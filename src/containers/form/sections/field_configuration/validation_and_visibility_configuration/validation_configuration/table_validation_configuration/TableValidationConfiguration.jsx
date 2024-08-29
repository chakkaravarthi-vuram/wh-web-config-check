import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { CheckboxGroup, ErrorVariant, ETextSize, SingleDropdown, Size, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';

import gClasses from '../../../../../../../scss/Typography.module.scss';
import { TABLE_VALIDATION_CONFIG_STRING, TABLE_CONTROL_ACCESS } from '../ValidationConfiguration.strings';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../../../FieldConfiguration.strings';
import styles from '../ValidationConfiguration.module.scss';
import { cloneDeep, get } from '../../../../../../../utils/jsUtility';
import { BS, INPUT_TYPES } from '../../../../../../../utils/UIConstants';
import { checkAllFieldsAreReadOnly, getOptionListForUnqiueColumnTableValidation } from '../ValidationConfiguration.utils';
import { CHOOSE_A_FIELD, EMPTY_STRING } from '../../../../../../../utils/strings/CommonStrings';

function TableValidationConfiguration(props) {
   const {
      ADD_NEW_ROW,
      ALLOW_MODIFY_EXISTING,
      IS_MINIMUM_ROW,
      IS_MAXIMUM_ROW,
      IS_UNIQUE_COLUMN_AVAILABLE,
      MAXIMUM_ROW,
      MINIMUM_ROW,
      UNIQUE_COLUMN_UUID,
   } = RESPONSE_VALIDATION_KEYS[FIELD_TYPES.TABLE];

   const { VALIDATIONS } = RESPONSE_FIELD_KEYS;

   const { fieldDetails, setFieldDetails, tableColumns = [] } = props;
   const validations = fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] || {};
   const { errorList = {} } = fieldDetails;
   const { t } = useTranslation();
   const [fieldOptionList, setFieldOptionList] = useState([]);
   const [selectedFieldLabel, setSelectedFieldLabel] = useState(EMPTY_STRING);
   const [isAllFieldReadOnly] = useState(checkAllFieldsAreReadOnly(tableColumns));

   useEffect(() => {
      if (validations[IS_UNIQUE_COLUMN_AVAILABLE]) {
         const fieldList = getOptionListForUnqiueColumnTableValidation(tableColumns);
         setFieldOptionList(fieldList);
         const selectedField = fieldList.find((eachOption) => eachOption.value === validations?.[UNIQUE_COLUMN_UUID]);
         if (selectedField) setSelectedFieldLabel(selectedField?.label);
      }
   }, [validations[IS_UNIQUE_COLUMN_AVAILABLE]]);

   const getFieldForValidation = (type) => {
     let field = null;

     const onChange = (id, _value, event, label) => {
      let value = _value;
      if ([MINIMUM_ROW, MAXIMUM_ROW].includes(id)) {
          if (!/^\d+$/.test(_value) && _value !== '') {
              event.preventDefault();
              return; // Return control
          }
          value = _value ? Number(_value) : _value;
      }
      if (id === UNIQUE_COLUMN_UUID) {
        setSelectedFieldLabel(label);
      }

      setFieldDetails({
          ...fieldDetails,
          [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
              ...validations,
              [id]: value,
          },
      });
  };

     switch (type) {
        case IS_MINIMUM_ROW:
             field = (
               <TextInput
                  id={`${VALIDATIONS}-${MINIMUM_ROW}`}
                  placeholder="0"
                  type={INPUT_TYPES.NUMBER}
                  value={validations[MINIMUM_ROW]}
                  onChange={(event) => onChange(MINIMUM_ROW, event?.target?.value, event)}
                  size={ETextSize.MD}
                  className={styles.Field}
                  errorVariant={ErrorVariant.direct}
                  errorMessage={errorList[`${RESPONSE_VALIDATION_KEYS.VALIDATION_DATA},${MINIMUM_ROW}`]}
               />
             );
             break;
        case IS_MAXIMUM_ROW:
            field = (
               <TextInput
                  id={`${VALIDATIONS}-${MAXIMUM_ROW}`}
                  placeholder="0"
                  type={INPUT_TYPES.NUMBER}
                  value={validations[MAXIMUM_ROW]}
                  onChange={(event) => onChange(MAXIMUM_ROW, event?.target?.value, event)}
                  size={ETextSize.MD}
                  className={styles.Field}
                  errorVariant={ErrorVariant.direct}
                  errorMessage={errorList[`${RESPONSE_VALIDATION_KEYS.VALIDATION_DATA},${MAXIMUM_ROW}`]}
               />
            );
             break;
        case IS_UNIQUE_COLUMN_AVAILABLE:
            field = (
               <SingleDropdown
                  id={`${VALIDATIONS}-${UNIQUE_COLUMN_UUID}`}
                  selectedValue={validations?.[UNIQUE_COLUMN_UUID]}
                  optionList={fieldOptionList}
                  onClick={(value, label) => onChange(UNIQUE_COLUMN_UUID, value, null, label)}
                  placeholder={t(CHOOSE_A_FIELD)}
                  dropdownViewProps={{
                     size: Size.md,
                     selectedLabel: selectedFieldLabel,
                  }}
                  className={styles.Field}
                  errorMessage={errorList[`${RESPONSE_VALIDATION_KEYS.VALIDATION_DATA},${UNIQUE_COLUMN_UUID}`]}
               />
            );
             break;
        default: break;
     }
     return field;
   };

   const getCheckboxGroup = () => {
      const onChange = (value) => {
         const consolidatedValidation = cloneDeep(validations);
         const prevValue = get(consolidatedValidation, [value], false);

         if (prevValue) {
            switch (value) {
               case IS_MINIMUM_ROW:
                     delete consolidatedValidation?.[MINIMUM_ROW];
                     break;
               case IS_MAXIMUM_ROW:
                     delete consolidatedValidation?.[MAXIMUM_ROW];
                     break;
               case IS_UNIQUE_COLUMN_AVAILABLE:
                     delete consolidatedValidation?.[UNIQUE_COLUMN_UUID];
                     setSelectedFieldLabel(EMPTY_STRING);
                     break;
               default: break;
            }
         }

         setFieldDetails({
            ...fieldDetails,
            [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: {
               ...consolidatedValidation,
               [value]: !prevValue,
            },
         });
      };

      const validationList = Object.values(TABLE_VALIDATION_CONFIG_STRING(t)).map((eachOption, idk) => {
         const isDisableAndDeselect = [ADD_NEW_ROW, ALLOW_MODIFY_EXISTING].includes(eachOption?.value) && isAllFieldReadOnly;
         const isSelected = !!get(validations, [eachOption?.value], false);
         return (
            <>
               <CheckboxGroup
                  id={idk}
                  options={[{ ...eachOption, selected: isSelected, disabled: isDisableAndDeselect }]}
                  hideLabel
                  onClick={onChange}
               />
               {getFieldForValidation(isSelected ? eachOption?.value : null)}
            </>
         );
      });

      return (<div className={styles.CheckboxGroup}>{validationList}</div>);
   };

   const getInstruction = () => {
      if (!isAllFieldReadOnly) return null;

      return (
            <div className={cx(BS.ALERT, BS.ALERT_WARNING, gClasses.FTwo11)}>
            {TABLE_CONTROL_ACCESS(t).REVOKE_ADD_AND_EDIT_VALIDATION_CONFIG}
            </div>
      );
   };

    return (
    <div className={styles.TableValidationConfig}>
      {getInstruction()}
      {getCheckboxGroup()}
    </div>
   );
}

export default TableValidationConfiguration;
