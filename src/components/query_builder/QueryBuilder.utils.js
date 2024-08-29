import { getFieldType, getOptionValue } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { getAllFieldsOperator, getVisibilityExternalFieldsAndFieldMetadataData, getVisibilityExternalFieldsDropdownList } from 'redux/reducer';
import { store } from 'Store';
import { FIELD_KEYS, FIELD_TYPE } from 'utils/constants/form.constant';
import { validate } from 'utils/UtilityFunctions';
import { expressionSchema } from 'validation/visibility/visbilityRule.schema';
import i18next from 'i18next';
import { get, isEmpty, isArray, has, compact, find, cloneDeep, join, intersection, translateFunction } from '../../utils/jsUtility';
import QUERY_BUILDER from './QueryBuilder.strings';

const { ALL_KEYS, LOGICAL_OPERATOR, SYSTEM_REPRESENTING_LOGICAL_OPERATOR, SERVER_ERROR_KEYS, SEREVR_ERROE_MESSGES } = QUERY_BUILDER;

// Function return workhall specific logical operator like (ALL = AND) ,(ANY = OR)
export const getLogicalOperator = (expression, t = translateFunction) => {
  const logical_operator = get(expression, [ALL_KEYS.LOGICAL_OPERATOR], null);
  switch (logical_operator) {
      case LOGICAL_OPERATOR.AND:
          return t(SYSTEM_REPRESENTING_LOGICAL_OPERATOR.ALL);
      case LOGICAL_OPERATOR.OR:
          return t(SYSTEM_REPRESENTING_LOGICAL_OPERATOR.ANY);
      default:
          return null;
  }
};

// Function helps to return margin level for nested structure
//  export const getCalculatedStyles = (nestedLevel = 0) => {
//   return { marginLeft: '18px' };
// };

// Utils for helper detail structure
const updateParamStructure = {
    nestedLevel: -1,
    expressionIndex: -1,
    expressionPathTrace: '',
    updatedParticularExpression: {},
};
const deleteConditionParamStructure = {
    nestedLevel: -1,
    expressionIndex: -1,
    expressionPathTrace: '',
};

export const getFieldFromFieldUuid = (lstAllFields = [], field_uuid = null) => {
  let field = {};
  if (lstAllFields && lstAllFields.length > 0) {
    if (has(lstAllFields[0], ['field_uuid'], false)) field = find(lstAllFields, { field_uuid: field_uuid });
    else field = find(lstAllFields, { value: field_uuid });
  }
  return (field === -1) ? {} : field;
};

const getManualValidation = (expression = {}, validation_list = {}) => {
  const allRules = get(expression, [ALL_KEYS.OPERANDS, ALL_KEYS.CONDITIONS], []);
  // const innerExpression = get(expression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], []);
  const error_list = { ...(validation_list || {}) };
  const isRvalueValid = (r_value, selector_opertor_info = {}) => {
    if (selector_opertor_info.has_operand) {
     return typeof r_value === 'number' ? (r_value === 0 || r_value) : r_value;
    } else return true;
  };
  // Addition of new validation
  // && isEmpty(innerExpression)
  if (isEmpty(allRules)) {
    error_list[`${ALL_KEYS.OPERANDS},${ALL_KEYS.CONDITIONS},empty_rule`] = QUERY_BUILDER.CUSTOM_VALIDATION_MESSAGE(i18next.t).EMPTY_RULE;
  } else {
    const serializedRules = compact((allRules).map((rule) => (
        rule.l_field &&
        rule.operator &&
        isRvalueValid(rule.r_value, rule[ALL_KEYS.SELECTED_OPERATOR_INFO]) ?
        JSON.stringify({
            l_field: rule.l_field,
            operator: rule.operator,
            r_value: rule.r_value,
          }) :
        null)));
    serializedRules.forEach((rule, idk) => {
      if (serializedRules.indexOf(rule) !== idk) error_list[`${ALL_KEYS.OPERANDS},${ALL_KEYS.CONDITIONS},${idk},rule_duplicate`] = QUERY_BUILDER.CUSTOM_VALIDATION_MESSAGE(i18next.t).DUPLICATE_RULE;
    });
   }
   return error_list || {};
};

const construtPostConditionData = (condition, field_type, options = []) => {
   const clonedCondition = cloneDeep(condition);
   let checkBeforeFinalSubmission = false;
   switch (field_type) {
      case FIELD_TYPE.USER_TEAM_PICKER:
        const rValueData = cloneDeep(clonedCondition[ALL_KEYS.R_VALUE]);
        if (!isEmpty(rValueData)) {
          if (!isEmpty(rValueData.users)) {
            rValueData.users = rValueData.users.map((user) => user._id);
          }
          if (!isEmpty(rValueData.teams)) {
            rValueData.teams = rValueData.teams.map((team) => team._id);
          }
          clonedCondition[ALL_KEYS.R_VALUE] = rValueData;
        }
        break;
      case FIELD_TYPE.CHECKBOX:
      case FIELD_TYPE.DROPDOWN:
      case FIELD_TYPE.RADIO_GROUP:
      case FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN:
        if (has(clonedCondition, ['r_value'], false)) {
          const isRValueAnArray = Array.isArray(clonedCondition?.r_value);
          const constructed_r_value = isRValueAnArray ? clonedCondition?.r_value : [clonedCondition?.r_value];
          const consolidate_r_value = intersection(options, constructed_r_value);
          if (isEmpty(consolidate_r_value)) {
            clonedCondition[ALL_KEYS.R_VALUE] = (isRValueAnArray) ? [] : '';
            checkBeforeFinalSubmission = true;
          } else {
            clonedCondition[ALL_KEYS.R_VALUE] = (isRValueAnArray) ? consolidate_r_value : consolidate_r_value[0];
          }
        }
        break;
      default:
        break;
   }

   return { condition: clonedCondition, checkBeforeFinalSubmission };
};

const updateExpressionWithFieldType = (expression = {}, allFields = [], allFieldOperators = {}, isFinalSubmission = false) => {
  let checkBeforeFinalSubmission = false;
  if (
       !isEmpty(expression) && expression &&
       !isEmpty(expression[ALL_KEYS.OPERANDS][ALL_KEYS.CONDITIONS]) &&
       !isEmpty(allFields) && allFields
      ) {
       const conditions = expression[ALL_KEYS.OPERANDS][ALL_KEYS.CONDITIONS] || [];
       expression[ALL_KEYS.OPERANDS][ALL_KEYS.CONDITIONS] = conditions.map((condition) => {
         if (condition[ALL_KEYS.L_FIELD] && condition[ALL_KEYS.OPERATOR]) {
          const field = getFieldFromFieldUuid(allFields, condition[ALL_KEYS.L_FIELD]);
          const field_type = (field && !isEmpty(field) && field !== -1) ? getFieldType(field) : '';
          const options = getOptionValue(field);

          if (isFinalSubmission) {
               const { condition: constructed_condition, checkBeforeFinalSubmission: checkBeforeFinalSubmission_ } = construtPostConditionData(condition, field_type, options);
               condition = constructed_condition;
               checkBeforeFinalSubmission = checkBeforeFinalSubmission_;
               return condition;
          }

          let constructed_condition = condition;
          if (field_type !== FIELD_TYPE.USER_TEAM_PICKER) {
            const constructedObject = construtPostConditionData(condition, field_type, options);
            constructed_condition = constructedObject.condition || {};
            checkBeforeFinalSubmission = constructedObject.checkBeforeFinalSubmission;
          }
          const all_operators = allFieldOperators[field_type] || [];
          const selectedOperatorInfo = find(all_operators, { operator: condition[ALL_KEYS.OPERATOR] });
          return {
            ...(condition || {}),
            ...(constructed_condition || {}),
            [ALL_KEYS.SELECTED_OPERATOR_INFO]: (selectedOperatorInfo && !isEmpty(selectedOperatorInfo) && selectedOperatorInfo !== -1) ? selectedOperatorInfo : {},
          };
         }
           return condition;
        });
    }
    return { expression, checkBeforeFinalSubmission };
};

// Function helps to update a single expression from the helper details
const updateSingleExpression = (
        mainExpression,
        nestedLevel = 0,
        expressionIndex = 0,
        expressionPath = '',
        updateHelperDetails = updateParamStructure,
        isFromValidator = false,
        lstAllFields = [],
        allFieldOperators = {},
        isFinalSubmission = false,
        t = translateFunction,
      ) => {
        if (
          nestedLevel === updateHelperDetails.nestedLevel &&
          expressionIndex === updateHelperDetails.expressionIndex &&
          expressionPath === updateHelperDetails.expressionPathTrace
        ) {
            mainExpression = updateHelperDetails.updatedParticularExpression;
            mainExpression[ALL_KEYS.LABEL] = mainExpression[ALL_KEYS.LABEL] || null;
          }
        if (isFromValidator) {
          const { expression: validationData, checkBeforeFinalSubmission } = updateExpressionWithFieldType(
                                          cloneDeep(mainExpression),
                                          lstAllFields,
                                          allFieldOperators,
                                          isFinalSubmission,
                                        );
          if (isFinalSubmission && !checkBeforeFinalSubmission) {
            mainExpression[ALL_KEYS.OPERANDS][ALL_KEYS.CONDITIONS] = validationData[ALL_KEYS.OPERANDS][ALL_KEYS.CONDITIONS];
          } else {
            mainExpression[ALL_KEYS.VALIDATIONS] = validate(validationData, expressionSchema(t));
            mainExpression[ALL_KEYS.VALIDATIONS] = { ...(mainExpression[ALL_KEYS.VALIDATIONS] || {}), ...getManualValidation(cloneDeep(validationData), mainExpression[ALL_KEYS.VALIDATIONS]) };
            if (isEmpty(mainExpression[ALL_KEYS.VALIDATIONS] || !mainExpression[ALL_KEYS.VALIDATIONS])) {
              delete mainExpression[ALL_KEYS.VALIDATIONS];
            }
          }
        }
        return mainExpression;
};

// Function helps to add, update, delete the expression recursively based the helper.
const expressionRecursiveLogic = (
   expression,
   nestedLevel,
   expressionIndex,
   expressionPath,
   helperDetails,
   callbackFn,
   isDeleteCondition = false,
   isFromValidator = false,
   lstAllFields = [],
   allFieldOperators = {},
   isFinalSubmission = false,
   t = translateFunction,
   ) => {
    if (!isDeleteCondition) {
      expression = updateSingleExpression(
        expression,
        nestedLevel + 1,
        expressionIndex,
        expressionPath,
        helperDetails,
        isFromValidator,
        lstAllFields,
        allFieldOperators,
        isFinalSubmission,
        t,
      );
    }
    expression[ALL_KEYS.OPERANDS][ALL_KEYS.EXPRESSIONS] = callbackFn(
      get(expression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS]),
      helperDetails,
      nestedLevel + 1,
      expressionIndex,
      expressionPath,
      isFromValidator,
      lstAllFields,
      allFieldOperators,
      isFinalSubmission,
      );

  if (
      has(expression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], false) &&
      (
        isEmpty(get(expression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], [])) ||
        !get(expression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], false)
      )
    ) {
        delete expression[ALL_KEYS.OPERANDS][ALL_KEYS.EXPRESSIONS];
    }
 return expression;
};

const or = (boolArray = []) => {
  if (isArray(boolArray)) return boolArray.some(Boolean);
  else return !!boolArray;
};

// Main function to update a particular expression inside the main expression.
// Used for ADD CONDITION, ADD RULE(sub-condition), DELETE RULE(trigger with the help of delete icon).
// return the updated main expression.
export const updateExpression = (
        mainExpression = [],
        updateHelperDetails = updateParamStructure,
        nestedLevel = 0,
        expressionIndex = 0,
        expressionPath = '0',
        isFromValidator = false,
        lstAllFields = [],
        allFieldOperators = {},
        isFinalSubmission = false,
        t = translateFunction,
      ) => {
        if (
          (
            isEmpty(get(mainExpression, [ALL_KEYS.OPERANDS], [])) ||
            !get(mainExpression, [ALL_KEYS.OPERANDS], null)
          )
          && (!isArray(mainExpression) || (isArray(mainExpression) && isEmpty(mainExpression)))
        ) return [];

        if (isArray(mainExpression) && !isEmpty(mainExpression)) {
          return mainExpression.map((eachExpression, eachExpressionIdk) => {
            eachExpression = expressionRecursiveLogic(
                                eachExpression,
                                nestedLevel,
                                eachExpressionIdk,
                                join([expressionPath, eachExpressionIdk], ','),
                                updateHelperDetails,
                                updateExpression,
                                false,
                                isFromValidator,
                                lstAllFields,
                                allFieldOperators,
                                isFinalSubmission,
                                t,
                                );
            return eachExpression;
          });
        } else if (typeof mainExpression === 'object' && !isEmpty(mainExpression)) {
             mainExpression = expressionRecursiveLogic(
               mainExpression, nestedLevel, expressionIndex, expressionPath, updateHelperDetails, updateExpression, false, isFromValidator, lstAllFields, allFieldOperators, isFinalSubmission, t);
             return mainExpression;
        } else return [];
  };

// Main function to delete a particular expression inside the main expression.
// Used only in DELETE CONDITION.
// return the updated main expression.
export const deleteCondition = (
  expression = [],
  deleteHelperDetail = deleteConditionParamStructure,
  nestedLevel = 0,
  expressionIndex = 0,
  expressionPath = '0',
  isFromValidator = false,
  t = translateFunction,
  ) => {
   if (isEmpty(expression) || !expression) return null;

   if (isArray(expression)) {
      return compact(expression.map((eachExpression, eachExpressionIdk) => {
        const path = join([expressionPath, eachExpressionIdk], ',');
        if (
            path === deleteHelperDetail.expressionPathTrace &&
            nestedLevel + 1 === deleteHelperDetail.nestedLevel &&
            eachExpressionIdk === deleteHelperDetail.expressionIndex) eachExpression = null;
        else {
          eachExpression = expressionRecursiveLogic(
                                     eachExpression,
                                     nestedLevel,
                                     eachExpressionIdk,
                                     path,
                                     deleteHelperDetail,
                                     deleteCondition,
                                     true,
                                     isFromValidator,
                                     [],
                                     {},
                                     false,
                                     t,
                                     );
        }
        return eachExpression;
      }));
   } else if (typeof expression === 'object') {
          expression = expressionRecursiveLogic(
            expression,
            nestedLevel,
            expressionIndex,
            expressionPath,
            deleteHelperDetail,
            deleteCondition,
            true,
            isFromValidator,
            [],
            {},
            false,
            t,
            );
      return expression;
    }
    return null;
};

export const getSelectedOperator = (all_operator, selectedField, operator_value) => {
  const field_type = getFieldType(selectedField);
  const allOperator = all_operator[field_type] || [];
  const selectedCurrentOperator = find(allOperator, { operator: operator_value });
  return (selectedCurrentOperator && selectedCurrentOperator !== -1) ? selectedCurrentOperator : {};
};

export const getOperatorOptionList = (option_list = []) => {
    if (isEmpty(option_list) || !option_list) return [];

    return option_list.map((option) => {
      return {
        label: option.label,
        value: option.operator,
      };
    });
};

export const checkForValidation = (expression) => {
  if (isEmpty(expression) || !expression) return false;

  if (isArray(expression)) {
      return expression.map((eachExpression) => (
        has(eachExpression, ALL_KEYS.VALIDATIONS, false) ||
        or(checkForValidation(get(eachExpression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], null)))
      ));
  } else if (typeof expression === 'object') {
        return (has(expression, ALL_KEYS.VALIDATIONS, false) ||
        or(checkForValidation(get(expression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], null))));
  }
  return false;
};

export const getServerErrorMessageFromExpressionTrace = (server_errors = {}, expressionTrace = '') => {
  if (isEmpty(server_errors) || !expressionTrace) return null;
  expressionTrace = `${expressionTrace}.${ALL_KEYS.OPERANDS}.${ALL_KEYS.CONDITIONS}`;
  const key_modified_server_error = {};
  Object.keys(server_errors).forEach((key) => {
   if (key.indexOf(expressionTrace) !== -1) {
     const originalKeyStartIndex = key.lastIndexOf(ALL_KEYS.OPERANDS);
     const originalExpressionErrorKey = (key).substring(originalKeyStartIndex).replaceAll('.', ',');
     key_modified_server_error[originalExpressionErrorKey] = server_errors[key];
   }
  });
  return key_modified_server_error;
};

// Function return validated expression.
// return expression object.
export const expressionValidator = (ruleExpression, lstAllFields = [], allFieldOperators = {}, isFinalSubmission = false) => {
  const validatedExpression = updateExpression(
    ruleExpression.expression,
    updateParamStructure,
    0,
    0,
   '0',
    true,
    lstAllFields,
    allFieldOperators,
    isFinalSubmission,
  );
  return { ...ruleExpression, expression: validatedExpression };
};

// Check the whether the given expression has validation or not.
// return boolean
export const hasValidation = (ruleExpression) => {
    const expression = ruleExpression[ALL_KEYS.EXPRESSION];
    if (!isEmpty(expression) && expression) return checkForValidation(expression);
    return false;
};

const updateFieldInASection = (sectionIndex, fieldListIndex, fieldIndex, isTable, all_sections = [], validatedExpression = {}, has_validation = false) => {
  const allSections = cloneDeep(all_sections);
  if (!isTable) {
    allSections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex][FIELD_KEYS.RULE_EXPRESSION] = validatedExpression;
    allSections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex][FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION] = hasValidation(validatedExpression);
    has_validation = allSections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex][FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION];
  } else {
    allSections[sectionIndex].field_list[fieldListIndex][FIELD_KEYS.RULE_EXPRESSION] = validatedExpression;
    allSections[sectionIndex].field_list[fieldListIndex][FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION] = hasValidation(validatedExpression);
    has_validation = allSections[sectionIndex].field_list[fieldListIndex][FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION];
  }
  return { allSections, has_validation };
};

export const validateExpressionAndUpdateField = (field, sectionIndex, fieldListIndex, fieldIndex, isTable, all_sections = []) => {
 let allSections = cloneDeep(all_sections);
 let has_validation = false;
  if (!isEmpty(field[FIELD_KEYS.RULE_EXPRESSION]) && has(field, [FIELD_KEYS.RULE_EXPRESSION], false) && field[FIELD_KEYS.RULE_EXPRESSION]) {
    let validatedExpression = field[FIELD_KEYS.RULE_EXPRESSION];
    if (!hasValidation(validatedExpression)) {
         const externalFields = getVisibilityExternalFieldsAndFieldMetadataData(store.getState());
         const allFieldsOperator = getAllFieldsOperator(store.getState());
         validatedExpression = expressionValidator(cloneDeep(field[FIELD_KEYS.RULE_EXPRESSION]), externalFields, allFieldsOperator);
    }

   ({ allSections, has_validation } = updateFieldInASection(
     sectionIndex,
     fieldListIndex,
     fieldIndex,
     isTable,
     all_sections,
     validatedExpression,
     hasValidation(validatedExpression),
     ));
  }
  return { allSections, has_validation };
};

export const updateServerErrorInExpression = (
  server_error = [],
  expression = {},
  expressionPath = 'rule.expression',
) => {
  if (isEmpty(expression) || !expression) return [];
  if (isArray(expression)) {
    return expression.map((eachExpression, idk) => {
      const currentExpressionServerError =
        getServerErrorMessageFromExpressionTrace(
          server_error,
          `${expressionPath}.${idk}`,
        );
      if (!isEmpty(currentExpressionServerError)) {
        eachExpression[ALL_KEYS.VALIDATIONS] = {
          ...(eachExpression[ALL_KEYS.VALIDATIONS] || {}),
          ...currentExpressionServerError,
        };
      }
      eachExpression[ALL_KEYS.OPERANDS][ALL_KEYS.EXPRESSIONS] =
        updateServerErrorInExpression(
          server_error,
          eachExpression[ALL_KEYS.OPERANDS][ALL_KEYS.EXPRESSIONS],
          `${expressionPath}.${idk}.${ALL_KEYS.OPERANDS}.${ALL_KEYS.EXPRESSIONS}`,
        );
      if (
        has(eachExpression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], false) &&
        (isEmpty(
          get(eachExpression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], []),
        ) ||
          !get(
            eachExpression,
            [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS],
            false,
          ))
      ) {
        delete eachExpression[ALL_KEYS.OPERANDS][ALL_KEYS.EXPRESSIONS];
      }

      return eachExpression;
    });
  } else if (typeof expression === 'object') {
    const currentExpressionServerError =
      getServerErrorMessageFromExpressionTrace(server_error, expressionPath);
    if (!isEmpty(currentExpressionServerError)) {
      expression[ALL_KEYS.VALIDATIONS] = {
        ...(expression[ALL_KEYS.VALIDATIONS] || {}),
        ...currentExpressionServerError,
      };
    }
    expression[ALL_KEYS.OPERANDS][ALL_KEYS.EXPRESSIONS] =
      updateServerErrorInExpression(
        server_error,
        expression[ALL_KEYS.OPERANDS][ALL_KEYS.EXPRESSIONS],
        `${expressionPath}.${ALL_KEYS.OPERANDS}.${ALL_KEYS.EXPRESSIONS}`,
      );

    if (
      has(expression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], false) &&
      (isEmpty(
        get(expression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], []),
      ) ||
        !get(expression, [ALL_KEYS.OPERANDS, ALL_KEYS.EXPRESSIONS], false))
    ) {
      delete expression[ALL_KEYS.OPERANDS][ALL_KEYS.EXPRESSIONS];
    }
    return expression;
  }
  return expression;
};

export const modifyAndUpdateServerErrorInExpression = (
  error,
  expression,
  sectionIndex,
  fieldListIndex,
  fieldIndex,
  isTable,
  all_sections,
  ) => {
   const allowedServerErrorToUpdateExpression = [SERVER_ERROR_KEYS.CYCLIC_DEPENDENCY];
   const server_errors = get(error, ['response', 'data', 'errors'], []);
   const hasAllowedServerError = server_errors.some(
     (each_error) => (allowedServerErrorToUpdateExpression).includes(each_error.validation_message),
     );
   let allSections = cloneDeep(all_sections);
   const validated_expression = expression;
   let has_validation = false;
   if (hasAllowedServerError) {
     const modified_server_error = {};
      server_errors.forEach((each_error) => {
        modified_server_error[each_error.field] = SEREVR_ERROE_MESSGES[each_error.validation_message] || each_error.validation_message;
      });
      has_validation = true;
      validated_expression[ALL_KEYS.EXPRESSION] = updateServerErrorInExpression(modified_server_error, expression[ALL_KEYS.EXPRESSION]);
   }
   ({ allSections, has_validation } = updateFieldInASection(
    sectionIndex,
    fieldListIndex,
    fieldIndex,
    isTable,
    all_sections,
    validated_expression,
    has_validation,
    ));
   return { allSections, has_validation };
};

export const constructPostDataForFinalSubmission = (expression = {}) => {
  const store_data = store.getState();
  const allFieldOperator = getAllFieldsOperator(store_data);
  const external_fields = getVisibilityExternalFieldsDropdownList(store_data, null, false);

  const post_data = expressionValidator(
      cloneDeep(expression),
      external_fields || [],
      allFieldOperator || [],
      true,
    );

  return post_data;
};

export const constructFieldsForBuilderDropdownOptions = (fields = []) => {
   if (isEmpty(fields)) return fields;

   return fields.map((field) => {
        const fieldObject = {
          label: field.label,
          value: field.field_uuid,
          fieldId: field._id,
          field_type: field.field_type,
        };
        if (has(field, [FIELD_KEYS.PROPERTY_PICKER_DETAILS], false)) {
              fieldObject[FIELD_KEYS.PROPERTY_PICKER_DETAILS] = field[FIELD_KEYS.PROPERTY_PICKER_DETAILS];
        }
        if (field.field_type === FIELD_TYPE.CURRENCY) {
              fieldObject[FIELD_KEYS.VALIDATIONS] = field[FIELD_KEYS.VALIDATIONS];
        }
        if (has(field, [FIELD_KEYS.VALUES], false)) {
              fieldObject[FIELD_KEYS.VALUES] = field[FIELD_KEYS.VALUES];
        }
      return fieldObject;
   });
};
