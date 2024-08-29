import cx from 'classnames';
import { Size, Text, TextInput, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import { get, isEmpty, set } from '../../../utils/jsUtility';
import styles from '../rule_with_field_mapping/RuleWithFieldMapping.module.scss';
import { BS } from '../../../utils/UIConstants';

import { filterFieldsByType } from '../ConditionBuilderWithFieldMapping.utils';
import FieldPicker from '../../field_picker/FieldPicker';
import { VALUE_TYPE_KEY } from '../../../utils/constants/rule/rule.constant';
import { FIELD_TYPES, RULE_VALUE_STRINGS } from '../../form_builder/FormBuilder.strings';
import { OPERAND_TYPES } from '../../../utils/constants/rule/operand_type.constant';
import CONDITION_BUILDER from '../../condition_builder/ConditionBuilder.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { formatRValueErrors } from '../../form_builder/rule/RValue.utils';
import { R_VALUE_MAPPING_STRINGS } from './RValueWithFieldMapping.strings';

function RValueWithFieldMapping(props) {
  const {
    id,
    selectedOperatorInfo,
    selectedFieldInfo,
    onRValueChangeHandler,
    rValue,
    errorRValue,
    className,
    ruleError,
    valueType = null,
    rFieldsDetail = {},
    pickerClassName,
  } = props;

  const { t } = useTranslation();

  // Common Change Handler
  const onChangeHandler = (event) => {
    onRValueChangeHandler(event?.target?.value);
  };

  // Dual Field Change Handler Depend on Index
  const onChangeDualHandler = (event, index) => {
    const eValue = event.target.value;
    const valueList = isEmpty(rValue) ? [] : [...rValue];
    return onRValueChangeHandler(set(valueList, [index], eValue));
  };

  const onRangeChange = (event, type) => {
    const { value } = event.target;
    const _rValue = rValue || {};
    _rValue[type] = value;
    onChangeHandler({ target: { value: _rValue } });
  };

  const getValue = (fieldUUID = null) => {
    const fieldList = rFieldsDetail.allFields;
    return fieldList?.[fieldUUID];
  };

  // Component Renderer
  const getFieldPicker = (props) => {
    const { id, fieldTypes, placeholder, value, errorMessage, onChange } = props;

    let optionList = [];

    if (valueType === VALUE_TYPE_KEY.USER_DEFINED) {
      optionList = filterFieldsByType(rFieldsDetail?.typeBasedDataFields, fieldTypes, t).fields;
    } else if (valueType === VALUE_TYPE_KEY.SYSTEM_FIELDS) {
      optionList = filterFieldsByType(rFieldsDetail?.typeBasedSystemFields, fieldTypes, t).fields;
    }

    return (
      <FieldPicker
        id={id}
        optionList={optionList}
        onChange={onChange}
        isExactPopperWidth
        errorMessage={errorMessage}
        selectedOption={getValue(value)}
        placeholder={placeholder}
        enableSearch
        fieldPickerClassName={pickerClassName}
        isDataFieldsOnly
      />
    );
  };

  const getInputComponent = (operandFieldType) => {
    const fieldTypes = [];
    switch (operandFieldType) {
      case OPERAND_TYPES.SINGLE_LINE:
      case OPERAND_TYPES.MULTI_SINGLE_LINE:
      case OPERAND_TYPES.EMAIL:
        fieldTypes.push(FIELD_TYPES.SINGLE_LINE, FIELD_TYPES.PARAGRAPH, FIELD_TYPES.EMAIL, FIELD_TYPES.SCANNER);
        break;

      case OPERAND_TYPES.NUMBER:
        const isDateField = [FIELD_TYPES.DATE, FIELD_TYPES.DATETIME].includes(selectedFieldInfo.field_type);
        if (isDateField) {
          fieldTypes.push(selectedFieldInfo.field_type);
        } else {
          fieldTypes.push(FIELD_TYPES.NUMBER, FIELD_TYPES.CURRENCY);
        }
        break;

      case OPERAND_TYPES.DUAL_NUMBER:
        const dualNumberErrors = formatRValueErrors(ruleError, operandFieldType, valueType);
        return (
          <div className={styles.DualField}>
            {
              getFieldPicker({
                id: `${id || EMPTY_STRING}-number-one`,
                placeholder: R_VALUE_MAPPING_STRINGS(t).CHOOSE_A_FIELD,
                fieldTypes: [FIELD_TYPES.NUMBER],
                value: get(rValue, [0]),
                errorMessage: dualNumberErrors.firstFieldError,
                onChange: (event) => onChangeDualHandler(event, 0),
              })
            }
            {
              getFieldPicker({
                id: `${id || EMPTY_STRING}-number-two`,
                placeholder: R_VALUE_MAPPING_STRINGS(t).CHOOSE_A_FIELD,
                fieldTypes: [FIELD_TYPES.NUMBER],
                value: get(rValue, [1]),
                errorMessage: dualNumberErrors.secondFieldError,
                onChange: (event) => onChangeDualHandler(event, 1),
              })
            }
          </div>
        );
      case OPERAND_TYPES.MULTI_NUMBER:
        fieldTypes.push(FIELD_TYPES.CHECKBOX);
        break;

      case OPERAND_TYPES.DROPDOWN:
        fieldTypes.push(FIELD_TYPES.DROPDOWN, FIELD_TYPES.RADIO_GROUP, FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN, FIELD_TYPES.SINGLE_LINE);
        break;

      case OPERAND_TYPES.MULTI_DROPDOWN:
          fieldTypes.push(FIELD_TYPES.CHECKBOX);
          break;
      case OPERAND_TYPES.DATE:
        fieldTypes.push(FIELD_TYPES.DATE);
        break;

      case OPERAND_TYPES.DATE_TIME:
        fieldTypes.push(FIELD_TYPES.DATETIME);
        break;

      case OPERAND_TYPES.USER_SELECT:
          fieldTypes.push(FIELD_TYPES.USER_TEAM_PICKER);
          break;
      case OPERAND_TYPES.DATALIST_PICKER:
          fieldTypes.push(FIELD_TYPES.DATA_LIST);
          break;

      case OPERAND_TYPES.DUAL_DATE_TIME:
        const dualDateErrorData = formatRValueErrors(ruleError, operandFieldType, valueType);
        return (
          <div className={cx(styles.DualField, BS.P_RELATIVE)}>
            <div className={styles.Text}>
              <Text
                content="From"
                size={ETextSize.MD}
              />
            </div>
            {
               getFieldPicker({
                id: `${id || EMPTY_STRING}-from-date-time`,
                fieldTypes: [FIELD_TYPES.DATETIME],
                value: get(rValue, [0]),
                placeholder: R_VALUE_MAPPING_STRINGS(t).CHOOSE_DATE_TIME_FIELD,
                errorMessage: dualDateErrorData.firstFieldError,
                onChange: (event) => onChangeDualHandler(event, 0),
              })
            }
            <div className={styles.Text}>
             <Text
              content="To"
              size={ETextSize.MD}
             />
            </div>
            {
               getFieldPicker({
                id: `${id || EMPTY_STRING}-to-date-time`,
                fieldTypes: [FIELD_TYPES.DATETIME],
                value: get(rValue, [1]),
                placeholder: R_VALUE_MAPPING_STRINGS(t).CHOOSE_DATE_TIME_FIELD,
                errorMessage: dualDateErrorData.secondFieldError,
                onChange: (event) => onChangeDualHandler(event, 1),
              })
            }

          </div>
        );
      case OPERAND_TYPES.DUAL_DATE:
        const dualDateErrors = formatRValueErrors(ruleError, operandFieldType, valueType);
        return (
          <div className={cx(styles.DualField, className)}>
            <div className={styles.Text}>
              <Text
                content="From"
                size={ETextSize.MD}
              />
            </div>
            {
               getFieldPicker({
                id: `${id || EMPTY_STRING}-from-date`,
                fieldTypes: [FIELD_TYPES.DATE],
                value: get(rValue, [0]),
                placeholder: R_VALUE_MAPPING_STRINGS(t).CHOOSE_DATE_FIELD,
                errorMessage: dualDateErrors.firstFieldError,
                onChange: (event) => onChangeDualHandler(event, 0),
              })
            }
            <div className={styles.Text}>
              <Text
                content="To"
                size={ETextSize.MD}
              />
            </div>
            {
               getFieldPicker({
                id: `${id || EMPTY_STRING}-to-date`,
                fieldTypes: [FIELD_TYPES.DATE],
                value: get(rValue, [1]),
                placeholder: R_VALUE_MAPPING_STRINGS(t).CHOOSE_DATE_FIELD,
                errorMessage: dualDateErrors.secondFieldError,
                onChange: (event) => onChangeDualHandler(event, 1),
              })
            }
          </div>
        );
      case OPERAND_TYPES.DUAL_TIME:
        const dualTimeErrorData = formatRValueErrors(ruleError, operandFieldType, valueType);
        return (
          <div className={cx(styles.DualField)}>
            <div className={styles.Text}>
              <Text
                content={RULE_VALUE_STRINGS.DUAL_TIME.LABEL_1}
                size={ETextSize.MD}
              />
            </div>
            {
               getFieldPicker({
                id: `${id || EMPTY_STRING}-from-time`,
                fieldTypes: [FIELD_TYPES.DROPDOWN],
                value: get(rValue, [0]),
                placeholder: R_VALUE_MAPPING_STRINGS(t).CHOOSE_A_FIELD,
                errorMessage: dualTimeErrorData.firstFieldError,
                onChange: (event) => onChangeDualHandler(event, 0),
              })
            }
            <div className={styles.Text}>
              <Text
                content={RULE_VALUE_STRINGS.DUAL_TIME.LABEL_2}
                size={ETextSize.MD}
              />
            </div>
            {
               getFieldPicker({
                id: `${id || EMPTY_STRING}-to-time`,
                fieldTypes: [FIELD_TYPES.DROPDOWN],
                value: get(rValue, [1]),
                placeholder: R_VALUE_MAPPING_STRINGS(t).CHOOSE_A_FIELD,
                errorMessage: dualTimeErrorData.secondFieldError,
                onChange: (event) => onChangeDualHandler(event, 1),
              })
            }
          </div>
        );
      case OPERAND_TYPES.MIN_MAX:
        return (
          <div>
            <div className={styles.DualField}>
                {
                  getFieldPicker({
                    id: `${id || EMPTY_STRING}-range-min`,
                    fieldTypes: [FIELD_TYPES.NUMBER],
                    value: get(rValue, 'min'),
                    placeholder: R_VALUE_MAPPING_STRINGS(t).CHOOSE_MIN_FIELD,
                    onChange: (event) => onRangeChange(event, 'min'),
                  })
                }
                {
                getFieldPicker({
                  id: `${id || EMPTY_STRING}-range-max`,
                  fieldTypes: [FIELD_TYPES.NUMBER],
                  value: get(rValue, 'max'),
                  placeholder: R_VALUE_MAPPING_STRINGS(t).CHOOSE_MAX_FIELD,
                  onChange: (event) => onRangeChange(event, 'max'),
                })
              }
            </div>
            { errorRValue && <Text className={cx(gClasses.MT4, gClasses.FOne11RedV7)} size={ETextSize.XS} content={errorRValue} /> }
          </div>
        );

      case OPERAND_TYPES.PHONE_NUMBER:
        fieldTypes.push(FIELD_TYPES.PHONE_NUMBER);
        break;
      case OPERAND_TYPES.LINK:
        fieldTypes.push(FIELD_TYPES.LINK);
        break;
      default:
        return null;
    }

    return getFieldPicker({
      id: `${id || EMPTY_STRING}`,
      fieldTypes: fieldTypes,
      value: rValue || EMPTY_STRING,
      placeholder: R_VALUE_MAPPING_STRINGS(t).CHOOSE_A_FIELD,
      errorMessage: errorRValue,
      onChange: onChangeHandler,
    });
  };

  if (!isEmpty(selectedOperatorInfo) && selectedOperatorInfo.has_operand) {
    return getInputComponent(selectedOperatorInfo.operand_field);
  } else if (!isEmpty(selectedOperatorInfo) && !selectedOperatorInfo.has_operand) {
    return null;
  }
  // dummy input component
  return (
    <TextInput
        id={`${id || EMPTY_STRING}-disabled`}
        readOnly
        placeholder={t(CONDITION_BUILDER.ALL_PLACEHOLDERS.VALUES)}
        className={className}
        size={Size.md}
    />
  );
}

export default RValueWithFieldMapping;
