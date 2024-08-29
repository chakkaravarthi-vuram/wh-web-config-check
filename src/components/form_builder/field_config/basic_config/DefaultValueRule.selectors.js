import { FIELD_TYPE } from 'utils/constants/form_fields.constant';
import { get, intersectionWith, isArray, isEmpty, set, find, uniqBy, translateFunction } from '../../../../utils/jsUtility';
import { CHECKBOX_OPERATORS, CURRENCY_OPERATORS, DROPDOWN_OPERATORS, NUMBER_OPERATORS, RADIO_BUTTON_OPERATORS, STRING_OPERATORS } from '../../../../utils/constants/rule/DefaultValueOperator.constant';
import { OPERAND_TYPES } from '../../../../utils/constants/rule/operand_type.constant';
import { CONCAT_WITH, CURRENCY_TYPE, FIELD_LABEL, ROUNDING_LIST, VALUE_LABEL } from './DefaultValueRule.strings';

export const getInitialValueListByOperator = () => [null];

export const getInitialFieldValue = () => null;

export const getFieldValue = (fieldValue, isMultiSelect) => get(fieldValue, ['value'], isMultiSelect ? [] : '');

export const getFieldLabelFromUuid = (fieldValue, isMultiSelect, externalFields = []) => {
  if (isMultiSelect) {
    const value = get(fieldValue, ['value'], []);
    console.log('rule selected value', isArray(externalFields) ? intersectionWith(externalFields, value, (_field, _value) => _field.value === _value) : value);
    return isArray(externalFields) ? intersectionWith(externalFields, value, (_field, _value) => _field.value === _value) : value;
  }
  const value = get(fieldValue, ['value']);
  if (value) {
    const temp = externalFields.find((externalField) => externalField.value === value[0]);
    return temp ? temp.label : value;
  }
  return value;
};

export const getValueByOperator = (value, operator, isMultiSelect) => get(value, ['value'], isMultiSelect ? [] : '');

export const getIsField = (value) => get(value, ['isField'], false);
export const getValueByIndex = (valueList, index) => valueList[index];

export const getLValueLabelFromOperator = (operator, t = translateFunction) => {
  switch (operator) {
    case NUMBER_OPERATORS.SUM:
    case CURRENCY_OPERATORS.CURRENCY_SUM:
      return (FIELD_LABEL(t).OF);
    case NUMBER_OPERATORS.DIFFERENCE:
    case NUMBER_OPERATORS.DIFFERENCE_DATE_IN_DAYS:
    case NUMBER_OPERATORS.DIFFERENCE_DATE_IN_MONTHS:
    case NUMBER_OPERATORS.DIFFERENCE_DATE_IN_YEARS:
    case CURRENCY_OPERATORS.CURRENCY_DIFFERENCE:
      return FIELD_LABEL(t).BETWEEN;
    case STRING_OPERATORS.CONCAT:
      return FIELD_LABEL(t).CONCAT;
    case DROPDOWN_OPERATORS.DROPDOWN_SELECTION:
    case CHECKBOX_OPERATORS.CHECKBOX_SELECTION:
    case RADIO_BUTTON_OPERATORS.RADIO_BUTTON_SELECTION:
    case STRING_OPERATORS.CONCAT_LIST:
    case STRING_OPERATORS.CONCAT_LIST_TABLE:
    case NUMBER_OPERATORS.COUNT_LIST:
    case NUMBER_OPERATORS.MAXIMUM_NUMBER_LIST:
    case NUMBER_OPERATORS.MINIMUM_NUMBER_LIST:
    case NUMBER_OPERATORS.AVERAGE_NUMBER_LIST:
    case NUMBER_OPERATORS.SUM_NUMBER_LIST:
    case NUMBER_OPERATORS.SUM_TABLE_NUMBER_LIST:
    case NUMBER_OPERATORS.DIFFERENCE_TABLE_NUMBER_LIST:
    case NUMBER_OPERATORS.MULTIPLY_TABLE_NUMBER_LIST:
    case NUMBER_OPERATORS.DIVIDE_TABLE_NUMBER_LIST:
    case NUMBER_OPERATORS.DIFFERENCE_TABLE_DATE_IN_DAYS:
    case NUMBER_OPERATORS.DIFFERENCE_TABLE_DATE_IN_MONTHS:
    case NUMBER_OPERATORS.DIFFERENCE_TABLE_DATE_IN_YEARS:
    case CURRENCY_OPERATORS.SUM_CURRENCY_LIST:
      return FIELD_LABEL(t).PICK;
    case CURRENCY_OPERATORS.CURRENCY_DIVIDE:
    case NUMBER_OPERATORS.DIVIDE_NUMBER:
      return FIELD_LABEL(t).DIVIDE;
    case CURRENCY_OPERATORS.CURRENCY_MULTIPLY:
    case NUMBER_OPERATORS.MULTIPLY_NUMBER:
      return FIELD_LABEL(t).MULTIPY;
    default:
      return null;
  }
};

export const getRValueLabelFromOperator = (operator, t = translateFunction) => {
  switch (operator) {
    case NUMBER_OPERATORS.SUM:
    case NUMBER_OPERATORS.DIFFERENCE:
    case NUMBER_OPERATORS.DIFFERENCE_DATE_IN_DAYS:
    case NUMBER_OPERATORS.DIFFERENCE_DATE_IN_MONTHS:
    case NUMBER_OPERATORS.DIFFERENCE_DATE_IN_YEARS:
    case CURRENCY_OPERATORS.CURRENCY_SUM:
    case CURRENCY_OPERATORS.CURRENCY_DIFFERENCE:
      return VALUE_LABEL(t).AND;
    case NUMBER_OPERATORS.MULTIPLY_NUMBER:
    case NUMBER_OPERATORS.DIVIDE_NUMBER:
    case STRING_OPERATORS.CONCAT:
    case CURRENCY_OPERATORS.CURRENCY_DIVIDE:
    case CURRENCY_OPERATORS.CURRENCY_MULTIPLY:
      return VALUE_LABEL(t).WITH;
    default:
      return null;
  }
};

export const getExtraOptions = (extraOptions, id) => {
  switch (id) {
    case ROUNDING_LIST.ID:
      return get(extraOptions, [ROUNDING_LIST.ID], null);
    case CONCAT_WITH.ID:
      return get(extraOptions, [CONCAT_WITH.ID], null);
    case CURRENCY_TYPE.ID:
      return get(extraOptions, [CURRENCY_TYPE.ID], null);
    default:
      return null;
  }
};

export const getInitialExtraParams = (optionList, id) => (id === CONCAT_WITH.ID ? get(optionList, [0, 'value'], null) : get(optionList, [0, 'value'], null));

export const ALLOW_DYNAMIC_SEARCH_FIELDS = [
  FIELD_TYPE.RADIO_BUTTON,
  FIELD_TYPE.CHECKBOX,
  FIELD_TYPE.DROPDOWN,
 // 'radio', 'checkbox', 'dropdown'
];
export const getTypeFromOperator = (operator, fieldType) => {
  switch (operator) {
    case NUMBER_OPERATORS.SUM:
    case NUMBER_OPERATORS.DIFFERENCE:
    case NUMBER_OPERATORS.MULTIPLY_NUMBER:
    case NUMBER_OPERATORS.DIVIDE_NUMBER:
      return FIELD_TYPE.NUMBER; // 'number';
    case STRING_OPERATORS.CONCAT:
      return (fieldType) || FIELD_TYPE.SINGLE_LINE; // 'string';
    case NUMBER_OPERATORS.DIFFERENCE_DATE_IN_DAYS:
    case NUMBER_OPERATORS.DIFFERENCE_DATE_IN_MONTHS:
    case NUMBER_OPERATORS.DIFFERENCE_DATE_IN_YEARS:
      return FIELD_TYPE.DATE; // 'date';
    case CURRENCY_OPERATORS.CURRENCY_DIFFERENCE:
    case CURRENCY_OPERATORS.CURRENCY_SUM:
    case CURRENCY_OPERATORS.CURRENCY_MULTIPLY:
    case CURRENCY_OPERATORS.CURRENCY_DIVIDE:
      return FIELD_TYPE.CURRENCY; // 'currency';
    case RADIO_BUTTON_OPERATORS.RADIO_BUTTON_SELECTION:
      return FIELD_TYPE.RADIO_BUTTON; // 'radio';
    case CHECKBOX_OPERATORS.CHECKBOX_SELECTION:
      return FIELD_TYPE.CHECKBOX; // 'checkbox';
    case DROPDOWN_OPERATORS.DROPDOWN_SELECTION:
      return FIELD_TYPE.DROPDOWN; // 'dropdown';
    default:
      return null;
  }
};
export const getTypeFromTableOperator = (operator, fieldType) => {
  switch (operator) {
  case NUMBER_OPERATORS.SUM_TABLE_NUMBER_LIST:
  case NUMBER_OPERATORS.DIFFERENCE_TABLE_NUMBER_LIST:
  case NUMBER_OPERATORS.MULTIPLY_TABLE_NUMBER_LIST:
  case NUMBER_OPERATORS.DIVIDE_TABLE_NUMBER_LIST:
       return FIELD_TYPE.NUMBER;
  case NUMBER_OPERATORS.DIFFERENCE_TABLE_DATE_IN_DAYS:
  case NUMBER_OPERATORS.DIFFERENCE_TABLE_DATE_IN_MONTHS:
  case NUMBER_OPERATORS.DIFFERENCE_TABLE_DATE_IN_YEARS:
       return FIELD_TYPE.DATE;
  case STRING_OPERATORS.CONCAT_LIST_TABLE:
    return (fieldType) || FIELD_TYPE.SINGLE_LINE;
  default:
    return null;
  }
};

export const setRValueListByIndex = (valueList, index, newValue) => {
  const newValueList = [...valueList];
  newValueList[index] = newValue;
  return newValueList;
};

export const setLValue = (newValue) => newValue;
export const processError = (errors) => {
  const error_list = {};
  if (!isEmpty(errors)) {
    const errorKeys = Object.keys(errors);
    errorKeys.forEach((errorKey) => {
      const [id, indexStr] = errorKey.split(',');
      if (id === VALUE_LABEL().ID) {
        let index = Number(indexStr);
        let key;
        if (index || index === 0) key = `${id},${index}`;
        else {
          key = `${id}`;
          index = 0;
        }
        if (errors[key]) set(error_list, [id, index], [errors[key]]);
        else set(error_list, [id, index], errors[errorKey]);
      } else set(error_list, [id], errors[errorKey]);
    });
  }
  return error_list;
};
export const addNewRValueToList = (oldList) => [...oldList, null];
export const deleteValueListByIndex = (oldList, _index) => oldList.filter((value, index) => index !== _index);

export const clearValueList = (operator) => getInitialValueListByOperator(operator);
export const clearFieldValue = () => getInitialFieldValue();
export const clearConcatWith = () => null;
export const clearRoundingValue = () => null;
export const clearAllowedCurrencyList = () => null;
export const isAddValueVisible = (operatorInfo = {}) => {
  switch (operatorInfo.operand_field) {
    case OPERAND_TYPES.MULTI_STRING:
    case OPERAND_TYPES.MULTI_NUMBER:
    case OPERAND_TYPES.MULTI_CURRENCY:
      return true;
    default:
      return false;
  }
};

export const getAllowedFields = (operatorInfo = {}) => {
  if (operatorInfo.allowed_field_types) return operatorInfo.allowed_field_types;
  return [];
};

export const isUnaryOperand = (operatorInfo = {}) => {
  if (operatorInfo.is_unary_operand) return true;
  return false;
};

export const isInputAllowed = (operatorInfo = {}) => {
  if (operatorInfo.is_direct_value_allowed) return true;
  return false;
};

export const isDualSelectOperator = (selectedOperatorInfo = {}) => {
  switch (selectedOperatorInfo.operand_field) {
    case OPERAND_TYPES.DUAL_FIELD_PICKER:
      return true;
    default:
      return false;
  }
};

export const getFieldsSortedInSelectedOrder = (external_fields = [], selected_order_field_uuid = []) => {
  let updated_field_list = [];
 if (!isEmpty(external_fields) && !isEmpty(selected_order_field_uuid)) {
    selected_order_field_uuid.forEach((each_uuid) => {
       const match_field = find(external_fields, { value: each_uuid });
       if (match_field !== -1 && match_field) {
         updated_field_list.push(match_field);
       }
    });
    updated_field_list = uniqBy([...updated_field_list, ...external_fields], (option) => option.value);
    return updated_field_list;
 }
 return external_fields;
};
