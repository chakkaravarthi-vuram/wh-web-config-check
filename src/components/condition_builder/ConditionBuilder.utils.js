import i18next from 'i18next';
import { CBAllKeys, cbCheckForValidation, CBConditionType, cbExpressionValidator, CBSingleExpressionOperationType } from '@workhall-pvt-lmt/wh-ui-library';
import {
  getFieldType,
  getFieldTypeIncludingChoiceValueType,
  getOptionValue,
} from '../../containers/edit_flow/step_configuration/StepConfiguration.utils';
import {
  isEmpty,
  has,
  find,
  cloneDeep,
  intersection,
  get,
} from '../../utils/jsUtility';
import CONDITION_BUILDER, { ROW_LEVEL_VALIDATION_KEY } from './ConditionBuilder.strings';
import { validate } from '../../utils/UtilityFunctions';
import { expressionSchema } from '../../validation/visibility/visbilityRule.schema';
import { FIELD_TYPE } from '../../utils/constants/form.constant';
import { store } from '../../Store';
import { getAllFieldsOperator, getVisibilityExternalFieldsDropdownList } from '../../redux/reducer';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { OPERAND_TYPES } from '../../utils/constants/rule/operand_type.constant';

export const getFieldFromFieldUuid = (lstAllFields = [], field_uuid = null) => {
  let field = {};
  if (lstAllFields && lstAllFields.length > 0) {
    if (has(lstAllFields[0], ['field_uuid'], false)) {
      field = find(lstAllFields, { field_uuid: field_uuid });
    } else field = find(lstAllFields, { value: field_uuid });
  }
  return field === -1 ? {} : field;
};

export const getSelectedOperator = (
  all_operator,
  selectedField,
  operator_value,
  choiceValueTypeBased = false,
) => {
  const { fieldType, actualChoiceValueType } = getFieldTypeIncludingChoiceValueType(selectedField);
  // const field_type = getFieldType(selectedField);
  const field_type = choiceValueTypeBased ? (actualChoiceValueType || fieldType) : fieldType;
  const allOperator = all_operator?.[field_type] || [];
  const selectedCurrentOperator = find(allOperator, {
    operator: operator_value,
  });
  return selectedCurrentOperator && selectedCurrentOperator !== -1
    ? selectedCurrentOperator
    : {};
};

export const getOperatorOptionList = (option_list = [], selectedField) => {
  if (isEmpty(option_list) || !option_list) return [];
  const { original_field_type, field_type, choice_value_type } = selectedField;

  const options = [];
  option_list.forEach((option) => {
    if (
      ([FIELD_TYPE.DROPDOWN, FIELD_TYPE.RADIO_GROUP].includes(original_field_type) ||
        [FIELD_TYPE.DROPDOWN, FIELD_TYPE.RADIO_GROUP].includes(field_type))
    ) {
      if (option.choice_type === choice_value_type) {
        options.push({
          label: option.label,
          value: option.operator,
        });
      }
      return;
    }

    options.push({
      label: option.label,
      value: option.operator,
    });
  });

  return options;
};

const construtPostConditionData = (condition, field_type, options = []) => {
  const clonedCondition = cloneDeep(condition);
  let checkBeforeFinalSubmission = false;
  switch (field_type) {
    case FIELD_TYPE.USER_TEAM_PICKER:
      const rValueData = cloneDeep(clonedCondition[CBAllKeys.R_VALUE]);
      if (!isEmpty(rValueData)) {
        if (Array.isArray(rValueData?.users) && rValueData?.users?.length > 0) {
          rValueData.users = rValueData.users.map((user) => user._id);
        }
        if (Array.isArray(rValueData?.teams) && rValueData?.teams?.length > 0) {
          rValueData.teams = rValueData.teams.map((team) => team._id);
        }
        clonedCondition[CBAllKeys.R_VALUE] = rValueData;
      }
      break;
    case FIELD_TYPE.CHECKBOX:
    case FIELD_TYPE.DROPDOWN:
    case FIELD_TYPE.RADIO_GROUP:
    case FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN:
      if (
           has(clonedCondition, ['r_value'], false) &&
           [OPERAND_TYPES.DROPDOWN, OPERAND_TYPES.MULTI_DROPDOWN].includes(get(clonedCondition, ['operator'], EMPTY_STRING))
          ) {
        const isRValueAnArray = Array.isArray(clonedCondition?.r_value);
        const constructed_r_value = isRValueAnArray
          ? clonedCondition?.r_value
          : [clonedCondition?.r_value];
        const consolidate_r_value = intersection(options, constructed_r_value);
        if (isEmpty(consolidate_r_value)) {
          clonedCondition[CBAllKeys.R_VALUE] = isRValueAnArray ? [] : '';
          checkBeforeFinalSubmission = true;
        } else {
          clonedCondition[CBAllKeys.R_VALUE] = isRValueAnArray
            ? consolidate_r_value
            : consolidate_r_value[0];
        }
      }
      break;
    default:
      break;
  }

  return { condition: clonedCondition, checkBeforeFinalSubmission };
};

const updateExpressionWithUtilInfoForValidation = (
  expression = {},
  allFields = [],
  allFieldOperators = {},
  isFinalSubmission = false,
) => {
  let checkBeforeFinalSubmission = false;
  if (
    !isEmpty(get(expression, [CBAllKeys.CONDITIONS], null)) &&
    !isEmpty(allFields)
  ) {
    const conditions = expression[CBAllKeys.CONDITIONS] || [];
    expression[CBAllKeys.CONDITIONS] = conditions.map((condition) => {
      if (
        condition?.condition_type === CBConditionType.CONDITION &&
        has(condition, [CBAllKeys.L_FIELD], false) &&
        has(condition, [CBAllKeys.OPERATOR], false)
      ) {
        const field_data = getFieldFromFieldUuid(
          allFields,
          condition[CBAllKeys.L_FIELD],
        );
        const field_type =
          !isEmpty(field_data) && field_data !== -1
            ? getFieldType(field_data)
            : '';
        const options = getOptionValue(field_data);

        if (isFinalSubmission) {
          const {
            condition: constructed_condition,
            checkBeforeFinalSubmission: checkBeforeFinalSubmission_,
          } = construtPostConditionData(condition, field_type, options);
          condition = constructed_condition;
          checkBeforeFinalSubmission = checkBeforeFinalSubmission_;
          return condition;
        }

        let constructed_condition = condition;
        if (field_type !== FIELD_TYPE.USER_TEAM_PICKER) {
          const constructedObject = construtPostConditionData(
            condition,
            field_type,
            options,
          );
          constructed_condition = constructedObject.condition || {};
          checkBeforeFinalSubmission =
            constructedObject.checkBeforeFinalSubmission;
        }
        const all_operators = allFieldOperators[field_type] || [];
        const selectedOperatorInfo = find(all_operators, {
          operator: condition[CBAllKeys.OPERATOR],
        });
        return {
          ...(condition || {}),
          ...(constructed_condition || {}),
          [CBAllKeys.SELECTED_OPERATOR_INFO]: !isEmpty(selectedOperatorInfo)
            ? selectedOperatorInfo
            : {},
        };
      }
      return condition;
    });
  }
  return { expression, checkBeforeFinalSubmission };
};

const getManualValidation = (expression = {}, validation_list = {}) => {
  const allRules = get(expression, [CBAllKeys.CONDITIONS], []);
  const error_list = { ...(validation_list || {}) };
  const isRvalueValid = (r_value, selector_opertor_info = {}) => {
    if (selector_opertor_info.has_operand) {
      return typeof r_value === 'number' ? r_value === 0 || r_value : r_value;
    } else return true;
  };
  // Addition of new validation
  if (isEmpty(allRules)) {
    // EMPTY RULE
    error_list[`${CBAllKeys.CONDITIONS},empty_rule`] =
      CONDITION_BUILDER.CUSTOM_VALIDATION_MESSAGE(i18next.t).EMPTY_RULE;
  } else {
    // DUPLICATE RULE
    const serializedRules = allRules.map((rule) => {
        if (
          rule.l_field &&
          rule.operator &&
          isRvalueValid(rule.r_value, rule[CBAllKeys.SELECTED_OPERATOR_INFO])
        ) {
          return JSON.stringify({
            l_field: rule.l_field,
            operator: rule.operator,
            r_value: rule.r_value,
          });
        }
        return null;
      });

    serializedRules.forEach((rule, idk) => {
      if (rule != null) {
        if (serializedRules.indexOf(rule) !== idk) {
          error_list[`${CBAllKeys.CONDITIONS},${idk},${ROW_LEVEL_VALIDATION_KEY.DUPLICATE_ROW}`] =
            CONDITION_BUILDER.CUSTOM_VALIDATION_MESSAGE(i18next.t).DUPLICATE_RULE;
        }
      }
    });
  }
  return error_list || {};
};

export const getValidatedExpression = (
  expression,
  lstAllFields,
  allFieldOperators,
  isFinalSubmission = false,
  t = i18next.t,
) => {
  if (isEmpty(expression)) return expression;
  const { expression: validationData, checkBeforeFinalSubmission } =
    updateExpressionWithUtilInfoForValidation(
      cloneDeep(expression),
      lstAllFields,
      allFieldOperators,
      isFinalSubmission,
    );
  if (isFinalSubmission && !checkBeforeFinalSubmission) {
    expression[CBAllKeys.CONDITIONS] = validationData[CBAllKeys.CONDITIONS];
  } else {
    expression[CBAllKeys.VALIDATIONS] = validate(
      validationData,
      expressionSchema(t),
    );
    expression[CBAllKeys.VALIDATIONS] = {
      ...(expression[CBAllKeys.VALIDATIONS] || {}),
      ...getManualValidation(
        cloneDeep(validationData),
        expression[CBAllKeys.VALIDATIONS],
      ),
    };
    if (isEmpty(expression[CBAllKeys.VALIDATIONS])) {
      delete expression[CBAllKeys.VALIDATIONS];
    }
  }
  return expression;
};

export const expressionValidator = (expression = null, lstAllFields = [], allFieldOperator = {}, isFinalSubmission = false) => {
  const clonedExpression = cloneDeep(expression);
  if (isEmpty(clonedExpression?.expression)) return clonedExpression;
  const validatedExpression = cbExpressionValidator({
      type: CBSingleExpressionOperationType.ONLY_VALIDATION,
      expression: clonedExpression?.expression,
      lstAllFields,
      allFieldOperator,
      getValidatedExpression: (expression, lstAllFields, allFieldOperators) => getValidatedExpression(expression, lstAllFields, allFieldOperators, isFinalSubmission),
    });
  return {
    ...clonedExpression,
    expression: validatedExpression,
  };
};

export const constructRuleDataForFinalSubmission = (expression = {}) => {
  const store_data = store.getState();
  const allFieldOperator = getAllFieldsOperator(store_data);
  const external_fields = getVisibilityExternalFieldsDropdownList(store_data, null, false);

  const post_data = expressionValidator(
      cloneDeep(expression),
      external_fields || [],
      allFieldOperator || [],
      true,
    );

  if (isEmpty(post_data?.expression?.expression_uuid)) delete post_data?.expression?.expression_uuid;
  return post_data;
};

export const hasValidation = (expression) => cbCheckForValidation(expression?.expression);

export const validateRuleData = (expression = {}) => {
  const store_data = store.getState();
  const allFieldOperator = getAllFieldsOperator(store_data);
  const external_fields = getVisibilityExternalFieldsDropdownList(store_data, null, false);

  const post_data = expressionValidator(
      cloneDeep(expression),
      external_fields || [],
      allFieldOperator || [],
    );
  const has_validation = hasValidation(post_data);

  return { has_validation, validated_expression: post_data.expression };
};
