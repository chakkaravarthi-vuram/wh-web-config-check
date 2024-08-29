import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { CBAllKeys, ETextSize, Input, SingleDropdown, Size, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
// import FieldPicker from '../../field_picker/FieldPicker';
import { getFieldTypeOptionsForCB } from '../ConditionBuilderWithFieldMapping.utils';
import { get, isEmpty, has, cloneDeep } from '../../../utils/jsUtility';
import { getOperatorOptionList, getSelectedOperator } from '../../condition_builder/ConditionBuilder.utils';
import { getFieldType } from '../../../containers/edit_flow/step_configuration/StepConfiguration.utils';
import styles from './RuleWithFieldMapping.module.scss';
import { getVisibilityOperatorsApiThunk } from '../../../redux/actions/Visibility.Action';
import { getAllFieldsOperator } from '../../../redux/reducer';
import { getVisibilityFieldMetaData } from '../../../redux/reducer/VisibilityReducer';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { RULE_VALUE_TYPE_OPTION_LIST, RULE_VALUE_TYPE_OPTION_LIST_EXCLUDING_STATIC_VALUE, R_CONSTANT, VALUE_TYPE, VALUE_TYPE_KEY } from '../../../utils/constants/rule/rule.constant';
import RValue from '../../form_builder/rule/RValueNew';
import { generateEventTargetObject } from '../../../utils/generatorUtils';
import CONDITION_BUILDER, { ROW_LEVEL_VALIDATION_KEY } from '../../condition_builder/ConditionBuilder.strings';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import RValueWithFieldMapping from '../r_value_with_field_mapping/RValueWithFieldMapping';
import LField from '../l_field/LField';
import { FIELD_TYPES } from '../../../containers/form/sections/field_configuration/FieldConfiguration.strings';
import { FIELD_LIST_TYPE } from '../../../utils/constants/form.constant';
import { IGNORE_STATIC_VALUE_FIELD_TYPES } from '../../../containers/edit_flow/security/security_policy/SecurityPolicy.strings';

function RuleWithMapping(props) {
    const {
        id,
        condition_uuid,
        l_field,
        operator,
        value_type,
        r_value,
        r_constant,

        lFieldsDetail,
        rFieldsDetail,

        ruleIndex,
        validations,

        onChangeHandler,
        allFieldOperators,
        getOperatorsByType,
        // noFieldsFoundMsg,
        lDataFieldList,
        choiceValueTypeBased = false,

    } = props;
    console.log('xyz validations', validations);

    const [selectedOperator, setSelectedOperator] = useState(null);
    const [selectedField, setSelectedField] = useState({});
    const [selectedTable, setSelectedTable] = useState({});

    const { t } = useTranslation();

   // Set Selected Field Object
    useEffect(() => {
      const field = cloneDeep(lFieldsDetail.allFields[l_field] || {});
      if (isEmpty(field)) return;

      setSelectedField(field);
      if (field?.field_list_type === FIELD_LIST_TYPE.TABLE) {
        const table = lFieldsDetail.allFields[field.table_uuid] || {};
        setSelectedTable(table);
      } else {
        setSelectedTable({});
      }
    }, [l_field, (Object.keys(lFieldsDetail?.allFields) || []).length]);

     // Operator related actions
     useEffect(() => {
      // Get Opertors for current field type if not exist in allFieldOperators
      const field_type = getFieldType(selectedField);
      if (!has(allFieldOperators, [field_type], false) && field_type) getOperatorsByType([field_type]);

      // On initial render, set the current rule operator
      const selected_opertor_info = getSelectedOperator(allFieldOperators, selectedField, (operator || null));
      setSelectedOperator(selected_opertor_info);
    }, [(Object.keys(allFieldOperators || {}).length), selectedField, condition_uuid]);

    // Get Validation Message
    const getErrorMessage = (key, returnObject = false) => {
      const errMessage = get(validations, [`${CBAllKeys.CONDITIONS},${ruleIndex},${key}`], null);
      if (key === CBAllKeys.R_VALUE) {
        const rValueCount = Object.keys(validations).filter((key) => key.includes(`${ruleIndex},${CBAllKeys.R_VALUE},`)).length;
        if ((rValueCount > 0) && returnObject) {
          const errObject = {};
          Object.keys(validations).forEach((key) => {
            if (key.includes(`${ruleIndex},${CBAllKeys.R_VALUE}`)) {
              const startIndex = key.indexOf(CBAllKeys.R_VALUE);
              const newKey = key.substring(startIndex);
              errObject[newKey] = validations[key];
            }
          });
          return errObject;
        }
      }
      return errMessage;
    };

    // Left Field Change handler
    const onLFieldChangeHandler = (value) => {
      if (l_field === value) return;
      const fieldData = cloneDeep(lFieldsDetail.allFields[value]);
      const fieldType = fieldData?.field_type;

      if (fieldType === FIELD_TYPES.TABLE) {
        if (selectedTable?.field_uuid === value) return;
        setSelectedField({});
        setSelectedTable(fieldData);
        onChangeHandler?.({ target: { id: CBAllKeys.L_FIELD, value: undefined } }, ruleIndex);
        return;
      } else {
        setSelectedTable({});
      }

     const consolidatedEvent = {
      ...fieldData,
      id: CBAllKeys.L_FIELD,
     };

      onChangeHandler?.({ target: consolidatedEvent }, ruleIndex);
    };

    // Operator Change Handler
    const operatorChangeHandler = (event) => {
      const selectedOperatorInfo = getSelectedOperator(allFieldOperators, selectedField, (event.target.value || null));
      setSelectedOperator(selectedOperatorInfo);
      onChangeHandler(event, ruleIndex, selectedOperatorInfo);
    };

    // R Value Type Change Handler
    const onRValueTypeChangeHandler = (event) => {
      onChangeHandler(event, ruleIndex, selectedOperator);
    };

    const operatorOptionList = getOperatorOptionList(
      allFieldOperators?.[getFieldType(selectedField)], selectedField, choiceValueTypeBased);

    const operatorValue = isEmpty(operatorOptionList) ? null : operator;

    // R Value Component
    const getRValue = () => {
      if (!isEmpty(selectedOperator) && !selectedOperator?.has_operand) return null;

      let originalRValue = null;
      const valueTypeOptions = IGNORE_STATIC_VALUE_FIELD_TYPES.includes(
        selectedField.field_type,
      )
        ? RULE_VALUE_TYPE_OPTION_LIST_EXCLUDING_STATIC_VALUE(t)
        : RULE_VALUE_TYPE_OPTION_LIST(t);

      const commonProps = {
        id: condition_uuid,
        // label: NEXT_LINE_OPERAND.includes(selectedOperator?.operand_field) ? t(ALL_LABELS.VALUES) : undefined,
        className: gClasses.Flex1,
        labelClassName: BS.MARGIN_0,
        rValue: r_value,
        rConstant: r_constant,
        selectedFieldInfo: selectedField,
        selectedOperatorInfo: selectedOperator,
        errorRValue: getErrorMessage(CBAllKeys.R_VALUE, selectedField?.field_type === FIELD_TYPES.LINK),
        ruleError: getErrorMessage(CBAllKeys.R_VALUE, true),
        onRValueChangeHandler: (event) => onChangeHandler(
               generateEventTargetObject(CBAllKeys.R_VALUE, event), ruleIndex),
      };

      switch (value_type) {
       case VALUE_TYPE_KEY.SYSTEM_FIELDS:
       case VALUE_TYPE_KEY.USER_DEFINED:
         originalRValue = (
          <RValueWithFieldMapping
            {...commonProps}
            valueType={value_type}
            rFieldsDetail={rFieldsDetail}
            pickerClassName={gClasses.Flex1}
          />
         );
         break;
       case VALUE_TYPE_KEY.STATIC_VALUE:
         originalRValue = (
            <RValue
              {...commonProps}
              onRConstantChangeHandler={(event) => onChangeHandler(generateEventTargetObject(R_CONSTANT, event), ruleIndex)}
              choiceValueTypeBased={choiceValueTypeBased}
            />
          );
          break;
       default:
        originalRValue = (<Input
            id="rvalue"
            readOnly
            label={t(CONDITION_BUILDER.ALL_LABELS.VALUES)}
            placeholder={t(CONDITION_BUILDER.ALL_PLACEHOLDERS.VALUES)}
            className={cx(gClasses.Flex1)}
            inputContainerClasses={gClasses.InputHeight32Important}
            labelClass={cx(BS.MARGIN_0)}
            hideMessage
            disabled
            size={Size.md}
        />);
      }

      return (
        <>
         <SingleDropdown
            id={VALUE_TYPE}
            optionList={valueTypeOptions}
            dropdownViewProps={{
              size: Size.md,
              disabled: isEmpty(operatorValue),
            }}
            onClick={(value, _label, _list, id) => onRValueTypeChangeHandler({ target: { id, value } })}
            selectedValue={value_type}
            errorMessage={EMPTY_STRING}
            className={cx(styles.ValueType, !isEmpty(operatorValue) && styles.ValueTypeFlex)}
         />
          {originalRValue}
        </>
      );
    };

    const getRowErrorMessage = () => {
        // Get Row Validation Message
      const stringifyedValidation = JSON.stringify(validations);
      let keyToFind = null;
      const rowLevelValidationKeys = Object.values(ROW_LEVEL_VALIDATION_KEY);
      for (let validtionKeyIndex = 0; validtionKeyIndex < rowLevelValidationKeys.length; validtionKeyIndex++) {
         if (stringifyedValidation.includes(`${CBAllKeys.CONDITIONS},${ruleIndex},${rowLevelValidationKeys[validtionKeyIndex]}`)) {
           keyToFind = rowLevelValidationKeys[validtionKeyIndex];
           break;
         }
      }
      if (keyToFind == null) return null;

      const allKeys = Object.keys(validations);
      const key = allKeys.find((eachKey) => eachKey.includes(keyToFind));
      return (
        <Text
            content={validations?.[key]}
            size={ETextSize.XS}
            className={styles.ErrorMessage}
        />
      );
    };

    return (
        <div id={condition_uuid} className={styles.RuleWrapper}>
          <div className={styles.Rule}>
            <div className={styles.When}>
                <LField
                  id={id}
                  optionList={lFieldsDetail.dataFields}
                  systemFieldList={lFieldsDetail.systemFields}
                  initialOptionList={
                    getFieldTypeOptionsForCB({
                      fieldsCount: lFieldsDetail?.dataFieldCount,
                      systemFieldsCount: lFieldsDetail?.systemFieldCount,
                    })
                  }
                  allFields={lFieldsDetail?.allFields}
                  lDataFieldList={lDataFieldList}
                  onChange={onLFieldChangeHandler}
                  selectedField={selectedField}
                  selectedTable={selectedTable}
                  setSelectedField={setSelectedField}
                  errorMessage={getErrorMessage(CBAllKeys.L_FIELD)}
                />
            </div>
              <div className={styles.OperatorAndValue}>
                <div className={styles.Operator}>
                  <SingleDropdown
                      id={CBAllKeys.OPERATOR}
                      selectedValue={isEmpty(operatorOptionList) ? null : operator}
                      errorMessage={getErrorMessage(CBAllKeys.OPERATOR)}
                      optionList={operatorOptionList}
                      onClick={(value, _label, _list, id) => operatorChangeHandler({ target: { id, value } })}
                      dropdownViewProps={{
                          placeholder: t('configure_rule.choose_operator'),
                          size: Size.md,
                      }}
                      placeholder={t('configure_rule.choose_operator')}
                      className={styles.DropdownPopperOperator}
                  />
                </div>
                <div className={styles.Value}>
                  {getRValue()}
                </div>
              </div>
          </div>
          {getRowErrorMessage()}
        </div>
    );
}

const mapStateToProps = (state) => {
  return {
    allFieldOperators: getAllFieldsOperator(state),
    fieldMetadata: getVisibilityFieldMetaData(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getOperatorsByType: (field_type) => dispatch(getVisibilityOperatorsApiThunk(field_type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RuleWithMapping);
