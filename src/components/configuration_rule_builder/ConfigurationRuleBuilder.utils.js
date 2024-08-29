import i18next from 'i18next';
import { isEmpty, has, get, find, uniqBy, isArray, intersectionWith, cloneDeep, set, compact, pick } from '../../utils/jsUtility';
import { COMMA, EMPTY_STRING, SPACE } from '../../utils/strings/CommonStrings';
import { CONFIGURATION_RULE_BUILDER, EXTRA_PARAMS_TYPE, FIELD_LABEL, VALUE_LABEL } from './ConfigurationRuleBuilder.strings';
import { CHECKBOX_OPERATORS, CURRENCY_OPERATORS, DROPDOWN_OPERATORS, NUMBER_OPERATORS, RADIO_BUTTON_OPERATORS, STRING_OPERATORS } from '../../utils/constants/rule/DefaultValueOperator.constant';
import { OPERAND_TYPES } from '../../utils/constants/rule/operand_type.constant';
import { validate } from '../../utils/UtilityFunctions';
import { defaultRuleValidationSchema, getLValueSchema, getRValueSchema, operatorSchema } from '../../validation/default_rule/defaultRule.schema';
import { ASSIGNMENT_EXPRESSION, CONCATENATION_EXPRESSION, CURRENCY_EXPRESSION, DATE_TIME_EXPRESSION, LIST_EXPRESSION, MATH_EXPRESSION } from '../../utils/constants/rule/expressionType.constant';
import { FIELD_TYPE } from '../../utils/constants/form.constant';

export const getOpertorList = (
operators = [],
isSourceTableField = false,
) => {
if (isEmpty(operators)) return [];

const optionslist = [];
const headers = new Map();
operators.forEach((each_operator) => {
    if (isSourceTableField === !!each_operator.is_source_table_field) {
    // Header
    if (!headers.get(each_operator.function_category)) {
        headers.set(each_operator.function_category, 1);
        optionslist.push({
        label: each_operator.label,
        value: each_operator.operator,
        header: each_operator.function_category,
        });
    } else {
        optionslist.push({
        label: each_operator.label,
        value: each_operator.operator,
        });
    }
    }
});
return optionslist;
};
// EXTRA_PARAMS_TYPE
export const getExtraParamsType = (
operatorInfo = {},
allowedCurrencyList = [],
) => {
if (has(operatorInfo, 'is_rounding')) return EXTRA_PARAMS_TYPE.ROUNDING;
else if (has(operatorInfo, 'is_concat_with')) return EXTRA_PARAMS_TYPE.CONCAT;
else if (!isEmpty(allowedCurrencyList) && !isEmpty(operatorInfo)) return EXTRA_PARAMS_TYPE.CURRENCY;

return EMPTY_STRING;
};

export const getExtraOptionData = (extraOptions, id) => {
const {
    FIELDS: { ROUNDING_LIST, CONCAT_WITH, CURRENCY_TYPE },
} = CONFIGURATION_RULE_BUILDER;
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

export const getRoundingOptionList = (operatorInfo = {}) => {
if (get(operatorInfo, 'is_rounding')) {
return operatorInfo.rounding_types.map((roundingType) => {
    return {
        label: Object.keys(roundingType)[0],
        value: roundingType[Object.keys(roundingType)[0]],
    };
    });
}
return false;
};

export const getConcatWithOptionList = (operatorInfo = {}) => {
if (get(operatorInfo, 'is_concat_with')) {
return operatorInfo.concat_with_types.map((concat_with) => {
    return {
        label: Object.keys(concat_with)[0],
        value: concat_with[Object.keys(concat_with)[0]],
    };
    });
}
return false;
};

export const getExtraParams = (
operatorInfo = {},
allowedCurrencyList = [],
extraOptions = {},
t = i18next.t,
) => {
const type = getExtraParamsType(operatorInfo, allowedCurrencyList);
const {
    FIELDS: { ROUNDING_LIST, CONCAT_WITH },
} = CONFIGURATION_RULE_BUILDER;

switch (type) {
    case EXTRA_PARAMS_TYPE.ROUNDING:
    return {
        id: ROUNDING_LIST.ID,
        label: t(ROUNDING_LIST.LABEL),
        optionList: getRoundingOptionList(operatorInfo),
        selectedValue: getExtraOptionData(extraOptions, ROUNDING_LIST.ID),
    };
    case EXTRA_PARAMS_TYPE.CONCAT:
    return {
        id: CONCAT_WITH.ID,
        label: t(CONCAT_WITH.LABEL),
        optionList: getConcatWithOptionList(operatorInfo),
        selectedValue: getExtraOptionData(extraOptions, CONCAT_WITH.ID),
    };
    // case EXTRA_PARAMS_TYPE.CURRENCY:
    // return {
    //     id: CURRENCY_TYPE.ID,
    //     label: t(CURRENCY_TYPE.LABEL),
    //     optionList: allowedCurrencyList,
    //     selectedValue: getExtraOptionData(extraOptions, CURRENCY_TYPE.ID),
    // };
    default:
    return {};
}
};

export const getLValueLabelFromOperator = (operator, t = i18next.t) => {
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

  export const getRValueLabelFromOperator = (operator, t = i18next.t) => {
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

  export const getIsField = (value) => get(value, ['isField'], false);

  export const getFieldLabelFromUuid = (fieldValue, isMultiSelect, externalFields = []) => {
    if (isMultiSelect) {
      const value = get(fieldValue, ['value'], []);
      return isArray(externalFields) ? intersectionWith(externalFields, value, (_field, _value) => _field.value === _value) : value;
    }
    const value = get(fieldValue, ['value']);
    if (value) {
      const temp = externalFields.find((externalField) => externalField.value === value);
      return temp ? temp.label : value;
    }
    return value;
  };

export const getFieldFromFieldUuid = (lstAllFields = [], field_uuid = null) => {
    let field = {};
    if (lstAllFields && lstAllFields.length > 0) {
      if (has(lstAllFields[0], ['field_uuid'], false)) field = find(lstAllFields, { field_uuid: field_uuid });
      else field = find(lstAllFields, { value: field_uuid });
    }
    return (field === -1) ? {} : field;
};

export const getValue = (value, isMultiSelect) => get(value, ['value'], isMultiSelect ? [] : '');
export const isUnaryOperand = (operatorInfo = {}) => {
    if (operatorInfo.is_unary_operand) return true;
    return false;
  };

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

// ******************** Global Utils *******************

export const validateConfigurationRule = (rule = {}) => {
  const cloned_rule = cloneDeep(rule);
  if (isEmpty(compact(cloned_rule?.rValue))) delete cloned_rule.rValue;
  if (isEmpty(cloned_rule?.lValue)) delete cloned_rule?.lValue;
  return validate(
    cloned_rule,
    defaultRuleValidationSchema(get(cloned_rule, ['operator']), false),
  );
};

export const validateConfigurationRuleOperator = (rule) => {
  const cloned_rule = cloneDeep(rule);
  return validate(
    pick(cloned_rule, ['operatorInfo', 'operator']),
    operatorSchema,
  );
};
export const validateConfigurationRuleLValue = (rule) => {
  const cloned_rule = cloneDeep(rule);
  if (isEmpty(cloned_rule?.lValue)) delete cloned_rule?.lValue;
  return validate(
    pick(cloned_rule, ['operatorInfo', 'operator', 'lValue']),
    getLValueSchema(get(cloned_rule, ['operator'])),
  );
};
export const validateConfigurationRuleRValue = (rule) => {
  const cloned_rule = cloneDeep(rule);
  if (isEmpty(compact(cloned_rule?.rValue))) delete cloned_rule.rValue;
  return validate(
    pick(cloned_rule, ['operatorInfo', 'operator', 'rValue']),
    getRValueSchema(get(cloned_rule, ['operator'])),
  );
};

export const getConfigurationRulePostData = (rule = {}) => {
  const { FIELDS: { ROUNDING_LIST, CONCAT_WITH, CURRENCY_TYPE } } = CONFIGURATION_RULE_BUILDER;
  if (isEmpty(compact(rule?.rValue))) delete rule?.rValue;
  if (isEmpty(rule?.lValue)) delete rule?.lValue;

  switch (rule.operatorInfo.expression_type) {
        case MATH_EXPRESSION:
        case LIST_EXPRESSION:
        case CURRENCY_EXPRESSION:
        case DATE_TIME_EXPRESSION: {
          const operands = [];
          // L Value
          if (rule?.lValue) {
            if (isArray(rule.lValue?.value)) {
              if (rule.lValue?.isField) operands.push({ fields: [...rule.lValue.value] });
              else operands.push({ values: [...rule.lValue.value] });
            } else if (rule.lValue?.isField) {
              operands.push({ fields: [rule.lValue.value] });
            } else if (rule.operatorInfo.expression_type === CURRENCY_EXPRESSION) {
              operands.push({ values: [{ value: rule.lValue?.value, currency_type: rule.extraOptions?.[CURRENCY_TYPE.ID] }] });
            } else operands.push({ values: [rule.lValue.value] });
          }

          // R Value
          if (rule?.rValue) {
            (rule.rValue || []).forEach((_rValue) => {
              if (_rValue.isField) operands.push({ fields: [_rValue.value] });
              else if (rule.operatorInfo.expression_type === CURRENCY_EXPRESSION) operands.push({ values: [{ value: _rValue.value }] });
              else operands.push({ values: [_rValue.value] });
            });
          }
          const consolidatedRule = {
            expression_type: rule.operatorInfo.expression_type,
            expression: {
              operator: rule.operator,
              operands,
            },
          };
          if (has(rule, ['extraOptions', ROUNDING_LIST.ID])) {
            set(consolidatedRule, 'decimal_point', rule.extraOptions[ROUNDING_LIST.ID]);
          }
          if (has(rule, ['extraOptions', CURRENCY_TYPE.ID])) {
            set(consolidatedRule.expression, 'default_currency', rule.extraOptions.currencyType);
          }
          return consolidatedRule;
        }
        case CONCATENATION_EXPRESSION: {
          const expressions = [];
          if (rule.operator === STRING_OPERATORS.CONCAT_LIST) { // one exception which does not follow the pattern (field picker but expects an array)
            expressions.push({ [rule.lValue.isField ? 'fields' : 'values']: [rule.lValue.value] });
          } else if (rule.lValue) {
            expressions.push({ [rule.lValue.isField ? 'fields' : 'values']: rule.lValue.value });
          }
          if (rule.rValue) {
            (rule.rValue || []).forEach((_rValue) => {
              if (_rValue.isField) expressions.push({ fields: _rValue.value });
              else expressions.push({ values: _rValue.value });
            });
          }
          const consolidatedRule = {
            expression_type: rule.operatorInfo.expression_type,
            expression: {
              operator: rule.operator,
              expressions,
            },
          };
          if (has(rule, ['extraOptions', CONCAT_WITH.ID]) && !isEmpty(rule.extraOptions[CONCAT_WITH.ID])) { // to remove without space option
            set(consolidatedRule, 'concat_with', rule.extraOptions.concatWith);
          }
          return consolidatedRule;
        }
        case ASSIGNMENT_EXPRESSION:
          const consolidatedRule = {
            expression_type: rule.operatorInfo.expression_type,
            expression: {
              expressions: {
                field: rule.lValue.value,
              },
              operator: rule.operator,
           },
          };
        return consolidatedRule;
        default:
          break;
  }

  return {};
};

export const getSelectedLabel = (
  value,
  lstFields,
  fieldMetaData,
  isMultiSelect,
) => {
  let selectedLabel;
  if (getIsField(value)) {
    const values = [value.value].flat();
    const lstFieldsUUID = !isEmpty(lstFields)
      ? lstFields.map((option) => option.value)
      : [];
    const isValueFoundOnExternalFields =
      !isEmpty(lstFields) &&
      values.every((value) => lstFieldsUUID.includes(value));
    if (isValueFoundOnExternalFields) selectedLabel = getFieldLabelFromUuid(value, isMultiSelect, lstFields);
    else {
      const allFieldMetaDataUUID = !isEmpty(fieldMetaData)
        ? fieldMetaData.map((option) => option.value)
        : [];
      let fieldLabels = [];
      if (!isEmpty(values)) {
        fieldLabels = values.map((eachValue) => {
          if (!allFieldMetaDataUUID.includes(eachValue)) return EMPTY_STRING;
          return (
            getFieldFromFieldUuid(fieldMetaData, eachValue).label ||
            EMPTY_STRING
          );
        });
      }

      selectedLabel = compact(fieldLabels).join(COMMA + SPACE) || EMPTY_STRING;
    }
  } else {
    selectedLabel = [getValue(value, isMultiSelect)].flat().join(', ');
  }

  return selectedLabel;
};
