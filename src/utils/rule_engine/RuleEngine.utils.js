import { FORMULA_BUILDER } from 'components/formula_builder/FormulaBuilder.strings';
import { replaceEncodeWithDecodedUUID, updateFormulaBuilderValidationPopOver } from 'components/formula_builder/formula_tokenizer_utils/formulaBuilder.utils';
import { constructPostDataForFinalSubmission } from 'components/query_builder/QueryBuilder.utils';
import { DEFAULT_RULE_KEYS, FIELD_KEYS } from 'utils/constants/form.constant';
import { validateDefaultRuleValue } from 'utils/formUtils';
import { CONCAT_WITH, CURRENCY_TYPE, ROUNDING_LIST } from '../../components/form_builder/field_config/basic_config/DefaultValueRule.strings';
import { STRING_OPERATORS } from '../constants/rule/DefaultValueOperator.constant';
import { ASSIGNMENT_EXPRESSION, CONCATENATION_EXPRESSION, CURRENCY_EXPRESSION, DATE_TIME_EXPRESSION, LIST_EXPRESSION, MATH_EXPRESSION } from '../constants/rule/expressionType.constant';
import { DEFAULT_RULE_ALLOWED_FIELD_TYPES, DEFAULT_RULE_ALLOWED_FIELD_TYPES_TABLE, EXPRESSION_TYPE } from '../constants/rule/rule.constant';
import jsUtils, { has, isArray, isEmpty, set, translateFunction, isNull, get } from '../jsUtility';
import { DROPDOWN_CONSTANTS, EMPTY_STRING } from '../strings/CommonStrings';

export const getOperandField = (selectedOperator, arrOperatorData) => {
  let operandField = EMPTY_STRING;
  const filterOperandData =
    arrOperatorData &&
    arrOperatorData.length > 0 &&
    arrOperatorData.filter((operatorData) => operatorData.value === selectedOperator);
  operandField = filterOperandData && filterOperandData.length > 0 && filterOperandData[0].operand_field;
  return operandField;
};

export const getDropdownData = (list) => {
  const dropdownData = [];
  if (!jsUtils.isEmpty(list)) {
    list.map((data) => {
      dropdownData.push({
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: data,
        [DROPDOWN_CONSTANTS.VALUE]: data,
      });
      return data;
    });
  }
  console.log(dropdownData);
  return dropdownData;
};

export const getListValueDropdown = (values) => {
  const dropdownData = [];
  if (typeof values === 'string') {
    let list = values.split(',');
    list = Array.from(new Set(list));
    list.forEach((data) => {
      if (!jsUtils.isEmpty(data.trim()) && parseInt(data.trim(), 10)) {
        dropdownData.push({
          [DROPDOWN_CONSTANTS.OPTION_TEXT]: data,
          [DROPDOWN_CONSTANTS.VALUE]: data,
        });
      }
    });
    return dropdownData;
  } else if (isArray(values)) {
    values.forEach((data) => {
        if ((typeof data === 'string' && !jsUtils.isEmpty(data.trim()) && parseInt(data.trim(), 10)) || (data && typeof data !== 'string')) {
        dropdownData.push({
          [DROPDOWN_CONSTANTS.OPTION_TEXT]: data,
          [DROPDOWN_CONSTANTS.VALUE]: data,
        });
      }
    });
    return dropdownData;
  } else {
    return dropdownData;
  }
};

export const getDefaultRuleFieldSaveData = (defaultRuleData, metadata, defaultValueRuleId, is_advanced_expression = false) => {
  const data = {
    ...metadata,
    rule_type: 'rule_field_default_value_condition',
  };
  if (defaultValueRuleId) set(data, '_id', defaultValueRuleId);

  if (is_advanced_expression) {
    const code = get(defaultRuleData, ['input'], EMPTY_STRING);
    const rule = {
      expression_type: EXPRESSION_TYPE.FORMULA_EXPRESSION,
      expression: {
        input: replaceEncodeWithDecodedUUID(code),
      },
    };
    data.rule = rule;
  } else {
      switch (defaultRuleData.operatorInfo.expression_type) {
        case MATH_EXPRESSION:
        case LIST_EXPRESSION:
        case CURRENCY_EXPRESSION:
        case DATE_TIME_EXPRESSION: {
          const operands = [];
          if (defaultRuleData.lValue) {
            if (isArray(defaultRuleData.lValue.value)) {
              if (defaultRuleData.lValue.isField) operands.push({ fields: [...defaultRuleData.lValue.value] });
              else operands.push({ values: [...defaultRuleData.lValue.value] });
            } else if (defaultRuleData.lValue.isField) operands.push({ fields: [defaultRuleData.lValue.value] });
            else if (defaultRuleData.operatorInfo.expression_type === CURRENCY_EXPRESSION) operands.push({ values: [{ value: defaultRuleData.lValue.value, currency_type: defaultRuleData.extraOptions[CURRENCY_TYPE.ID] }] });
            else operands.push({ values: [defaultRuleData.lValue.value] });
          }
          if (defaultRuleData.rValue) {
            defaultRuleData.rValue.forEach((_rValue) => {
              if (_rValue.isField) operands.push({ fields: [_rValue.value] });
              else if (defaultRuleData.operatorInfo.expression_type === CURRENCY_EXPRESSION) operands.push({ values: [{ value: _rValue.value, currency_type: defaultRuleData.extraOptions[CURRENCY_TYPE.ID] }] });
              else operands.push({ values: [_rValue.value] });
            });
          }
          const rule = {
            expression_type: defaultRuleData.operatorInfo.expression_type,
            expression: {
              operator: defaultRuleData.operator,
              operands,
            },
          };
          console.log('defaultRuleDatadefaultRuleData', defaultRuleData);
          if (has(defaultRuleData, ['extraOptions', ROUNDING_LIST.ID])) {
            set(rule, 'decimal_point', defaultRuleData.extraOptions[ROUNDING_LIST.ID]);
          }
          if (has(defaultRuleData, ['extraOptions', 'currencyType'])) {
            set(rule.expression, 'default_currency', defaultRuleData.extraOptions?.currencyType);
          }
          set(data, ['rule'], rule);
          break;
        }
        case CONCATENATION_EXPRESSION: {
          const expressions = [];
          if (defaultRuleData.operator === STRING_OPERATORS.CONCAT_LIST) { // one exception which does not follow the pattern (field picker but expects an array)
            expressions.push({ [defaultRuleData.lValue.isField ? 'fields' : 'values']: [defaultRuleData.lValue.value] });
          } else if (defaultRuleData.lValue) {
            expressions.push({ [defaultRuleData.lValue.isField ? 'fields' : 'values']: defaultRuleData.lValue.value });
          }
          if (defaultRuleData.rValue) {
            defaultRuleData.rValue.forEach((_rValue) => {
              if (_rValue.isField) expressions.push({ fields: _rValue.value });
              else expressions.push({ values: _rValue.value });
            });
          }
          const rule = {
            expression_type: defaultRuleData.operatorInfo.expression_type,
            expression: {
              operator: defaultRuleData.operator,
              expressions,
            },
          };
          if (has(defaultRuleData, ['extraOptions', CONCAT_WITH.ID]) && !isEmpty(defaultRuleData.extraOptions[CONCAT_WITH.ID])) { // to remove without space option
            set(rule, 'concat_with', defaultRuleData.extraOptions.concatWith);
          }
          set(data, ['rule'], rule);
          break;
        }
        default:
          break;
      }
  }
  return data;
};

export const getDataFromRuleFields = (expression, expressionType, extraOptions) => {
  const data = {};
  switch (expressionType) {
    case MATH_EXPRESSION:
    case LIST_EXPRESSION:
    case CURRENCY_EXPRESSION:
    case DATE_TIME_EXPRESSION: {
      const lValue = {};
      const rValue = [];
      expression.operands.forEach((operand, index) => {
        if (index === 0) {
          if ((operand.values && operand.values.length > 1) || (operand.fields && operand.fields.length > 1)) {
            if (operand.values) {
              lValue.isField = false;
              lValue.value = operand.values;
            } else {
              lValue.isField = true;
              lValue.value = operand.fields;
            }
          } else if (expressionType === CURRENCY_EXPRESSION) {
            if (operand.values) {
              lValue.isField = false;
              lValue.value = operand.values[0].value;
              // data.extraOptions = {
              //   [CURRENCY_TYPE.ID]: operand.values[0].currency_type,
              // };
            } else if (operand.fields) {
              lValue.isField = true;
              [lValue.value] = operand.fields;
            }
          } else if (operand.values) {
            lValue.isField = false;
            [lValue.value] = operand.values;
          } else {
            lValue.isField = true;
            [lValue.value] = operand.fields;
          }
        } else if (operand.values) {
          if (expressionType === CURRENCY_EXPRESSION) {
            rValue.push({ isField: false, value: operand.values[0].value });
          } else rValue.push({ isField: false, value: operand.values[0] });
        } else rValue.push({ isField: true, value: operand.fields[0] });
      });
      data.lValue = lValue;
      if (!jsUtils.isEmpty(rValue)) data.rValue = rValue;
      if (!jsUtils.isEmpty(extraOptions)) {
        data.extraOptions = {
          ...(
            !isNull(extraOptions.decimal_point) &&
            String(extraOptions.decimal_point,
          ) ? { [ROUNDING_LIST.ID]: extraOptions.decimal_point } : {}),
        };
      }
      return data;
    }
    case CONCATENATION_EXPRESSION: {
      const lValue = {};
      const rValue = [];
      expression.expressions.forEach((operand, index) => {
        if (index === 0) {
          if (operand.values) {
            lValue.isField = false;
            lValue.value = operand.values;
          } else {
            lValue.isField = true;
            lValue.value = operand.fields;
          }
        } else if (operand.values) {
          rValue.push({ isField: false, value: operand.values });
        } else {
          rValue.push({ isField: true, value: operand.fields });
        }
      });
      data.extraOptions = {
        ...(extraOptions.concat_with ? { [CONCAT_WITH.ID]: extraOptions.concat_with } : { [CONCAT_WITH.ID]: '' }),
      };
      data.lValue = lValue;
      if (!jsUtils.isEmpty(rValue)) data.rValue = rValue;
      return data;
    }
    case ASSIGNMENT_EXPRESSION: {
      const lValue = {
        isField: true,
        value: expression?.expressions?.field,
      };
      data.lValue = lValue;
      return data;
    }
    default:
      return data;
  }
};

export const getVisibilityRuleApiData = (metadata = {}, visibilityRuleId, rule_type, expression) => {
  const post_expression = constructPostDataForFinalSubmission(expression);
  const data = {
    ...metadata,
    _id: visibilityRuleId,
    rule_type,
    rule: (!isEmpty(post_expression)) ? post_expression : {
    },
  };
  return data;
};
export const isDefaultRuleValid = (fieldType, isTableField) => {
  const defaultValueFieldTypes = isTableField ? DEFAULT_RULE_ALLOWED_FIELD_TYPES_TABLE : DEFAULT_RULE_ALLOWED_FIELD_TYPES;
  if (defaultValueFieldTypes.includes(fieldType)) return true;
  return false;
};

export const getSelectedOperatorInfo = (defaultOperators, operator, fieldType) => {
  if (isEmpty(operator)) return {};
  const list = jsUtils.get(defaultOperators, [fieldType], []);
  return list.find((element) => element.operator === operator);
};

export const checkForDefaultValueValidation = (field = {}, t = translateFunction) => {
  if (!isEmpty(field) && field[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]) {
     const default_value = get(field, [FIELD_KEYS.DEFAULT_DRAFT_VALUE], {});
     const is_advanced_expression = get(field, [FIELD_KEYS.IS_ADVANCED_EXPRESSION], false);
     let calculatedError = EMPTY_STRING;

    const server_validation = default_value[DEFAULT_RULE_KEYS.ERRORS] || {};
    const validatedData = validateDefaultRuleValue(default_value, is_advanced_expression);
    if (is_advanced_expression) {
      calculatedError = validatedData[DEFAULT_RULE_KEYS.INPUT] || EMPTY_STRING;
      if (!calculatedError && server_validation[DEFAULT_RULE_KEYS.INPUT]) {
        calculatedError = FORMULA_BUILDER(t).VALIDATION.LABEL.INCORRECT_SYNTAX;
     }
    }
    if (calculatedError) {
      updateFormulaBuilderValidationPopOver(
        {},
        { [DEFAULT_RULE_KEYS.INPUT]: calculatedError });
    }

     return { has_validation_error: !isEmpty(validatedData), validation_error: validatedData };
    }
  return { has_validation_error: false, validation_error: null };
};

export default getOperandField;
