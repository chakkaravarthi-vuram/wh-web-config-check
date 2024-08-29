import { CBAllKeys, CBLogicalOperators, getCBConditionInitialState } from '@workhall-pvt-lmt/wh-ui-library';
import { v4 as uuidV4 } from 'uuid';
import i18next from 'i18next';
import { POLICY_BUILDER_OPERATOR_LIST, POLICY_STRINGS, POLICY_TYPE, REQUEST_OPERTAOR_LIST, RQUEST_TO_RESPONSE_OPERATOR_MAPPING } from '../security_policy/SecurityPolicy.strings';
import { has, get, cloneDeep, isEmpty, isBoolean } from '../../../../utils/jsUtility';
import { expressionValidator, hasValidation } from '../../../../components/condition_builder/ConditionBuilder.utils';
import { store } from '../../../../Store';
import { getVisibilityExternalFieldsDropdownList } from '../../../../redux/reducer';
import { validate } from '../../../../utils/UtilityFunctions';
import { getUserFieldPolicySchema } from '../user_field_policy/UserFieldPolicy.validation.schema';
import { MODULE_TYPES } from '../../../../utils/Constants';
import { ERROR_MESSAGES } from './PolicyBuilder.strings';
import { getFieldFromFieldUuid } from '../../../../components/configuration_rule_builder/ConfigurationRuleBuilder.utils';
import { FIELD_TYPES } from '../../../form/sections/field_configuration/FieldConfiguration.strings';
import { R_CONSTANT, R_CONSTANT_TYPES } from '../../../../utils/constants/rule/rule.constant';

const { TYPE, POLICY_UUID, POLICY, LOGICAL_OPERATOR, CONDITONS, ACCESS_TO, USER_TEAM, USERS, TEAMS, FIELD_UUID } = POLICY_STRINGS.REQUEST_KEYS;

export const GET_CONDITION_BASED_POLICY_INITAIL_STATE = () => {
    const uuid = uuidV4();
    return {
       [TYPE]: POLICY_TYPE.CONDIITON_BASED,
       [POLICY_UUID]: uuid,
       [POLICY]: {
        [CBAllKeys.EXPRESSION_UUID]: uuid,
        [CBAllKeys.LOGICAL_OPERATOR]: CBLogicalOperators.AND,
        [CBAllKeys.CONDITIONS]: [getCBConditionInitialState()],
       },
      [ACCESS_TO]: {
        [USER_TEAM]: {
        },
      },
    };
};

export const validatePolicy = (policyList = []) => {
  const validatedPolicyList = [];

  let isAnyPolicyHasValidation = false;
  let userFieldPolicyErrorList = {};
  let commonErrorList = {};

  if (isEmpty(policyList)) {
    commonErrorList = {
      policyList: ERROR_MESSAGES.POLICIES_REQUIRES,
    };
    isAnyPolicyHasValidation = true;
  }

  const allFields = getVisibilityExternalFieldsDropdownList(store.getState(), null, false);

  policyList?.forEach((eachPolicy) => {
    if (eachPolicy?.[TYPE] === POLICY_TYPE.USER_FIELD_BASED) {
      userFieldPolicyErrorList = validate(eachPolicy, getUserFieldPolicySchema());

      if (!isEmpty(userFieldPolicyErrorList)) isAnyPolicyHasValidation = true;
      validatedPolicyList.push(eachPolicy);
    } else {
      const clonedPolicy = cloneDeep(eachPolicy);

      // Policy Condition Validation
      const validatedExpression = expressionValidator({ expression: clonedPolicy?.[POLICY] }, allFields, POLICY_BUILDER_OPERATOR_LIST, false);
      clonedPolicy[POLICY] = validatedExpression?.expression;
      isAnyPolicyHasValidation = isAnyPolicyHasValidation || hasValidation(validatedExpression);
      validatedPolicyList.push(clonedPolicy);

      // User or Team Validation
      const userOrTeam = get(clonedPolicy, [ACCESS_TO, USER_TEAM], {});
      if (isEmpty(userOrTeam) || (isEmpty(userOrTeam?.[USERS]) && isEmpty(userOrTeam?.[TEAMS]))) {
        clonedPolicy.accessToErrorMessage = i18next.t('validation_constants.utility_constant.one_user_team_required');
        isAnyPolicyHasValidation = true;
      }
    }
  });

  return { isAnyPolicyHasValidation, validatedPolicyList, userFieldPolicyErrorList, commonErrorList };
};

// Response Data Construction
export const getResponseOperator = (operator = null, field = {}) => {
    const fieldType = field?.field_type;
    let operators = RQUEST_TO_RESPONSE_OPERATOR_MAPPING[fieldType];
    if (field.choice_value_type && fieldType !== FIELD_TYPES.CHECKBOX) { // not considering choice_value_type for checkbox
      operators = operators[field.choice_value_type];
    }

    if (operators) {
      return operators?.[operator] || operator;
    }
    return operator;
};

export const getResponseRValue = (operator = null, value = null, fieldType) => {
   switch (operator) {
      case REQUEST_OPERTAOR_LIST.EQUAL_TO:
      case REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO:
      case REQUEST_OPERTAOR_LIST.GREATER_THAN:
      case REQUEST_OPERTAOR_LIST.LESSER_THAN:
      case REQUEST_OPERTAOR_LIST.GREATER_THAN_OR_EQUAL_TO:
      case REQUEST_OPERTAOR_LIST.LESSER_THAN_OR_EQUAL_TO:
      case REQUEST_OPERTAOR_LIST.RANGE:
        if (fieldType === FIELD_TYPES.CHECKBOX) return value;
        if (isBoolean(value?.[0])) return value?.[0]?.toString();
        return value?.[0];
      default: return value;
   }
};

export const constructCondtionForResponse = (conditions = [], fields = {}) => {
    const constructedCondition = conditions.map((eachCondition) => {
        const consolidateCondition = getCBConditionInitialState();
        const fieldUUID = eachCondition[CBAllKeys.L_FIELD];
        const fieldType = fields[fieldUUID]?.field_type;
        const operator = getResponseOperator(eachCondition[CBAllKeys.OPERATOR], fields?.[fieldUUID]);

        if (eachCondition[CBAllKeys.CONDITION_UUID] && consolidateCondition[CBAllKeys.CONDITION_UUID]) {
          consolidateCondition[CBAllKeys.CONDITION_UUID] = eachCondition[CBAllKeys.CONDITION_UUID];
        }
        consolidateCondition[CBAllKeys.L_FIELD] = fieldUUID;
        consolidateCondition[CBAllKeys.OPERATOR] = operator;
        if (has(eachCondition, [CBAllKeys.R_VALUE])) {
          const hasRConstant = [
            R_CONSTANT_TYPES.NOW,
            R_CONSTANT_TYPES.TODAY,
          ].includes(get(eachCondition, [CBAllKeys.R_VALUE, 0]));

          if (hasRConstant) {
            consolidateCondition[R_CONSTANT] = get(eachCondition, [CBAllKeys.R_VALUE, 0]);
          } else {
            consolidateCondition[CBAllKeys.R_VALUE] = getResponseRValue(eachCondition[CBAllKeys.OPERATOR], eachCondition[CBAllKeys.R_VALUE], fieldType);
          }
        }
        return consolidateCondition;
    });
    return constructedCondition;
};

export const constructExpressionFromPolicy = (policy, fields = {}, isRunTime = false) => {
  const data = {
      [CBAllKeys.EXPRESSION_UUID]: policy?.[POLICY_UUID],
      [CBAllKeys.LOGICAL_OPERATOR]: get(policy, [POLICY, LOGICAL_OPERATOR], null),
  };

  if (isRunTime) { // To format expression inside policy builder in run time,
    data[CBAllKeys.CONDITIONS] = get(policy, [POLICY, CONDITONS], []);
  } else {
    data[CBAllKeys.CONDITIONS] = constructCondtionForResponse(get(policy, [POLICY, CONDITONS], []), fields);
  }

  if (has(policy, [POLICY, CBAllKeys.VALIDATIONS])) {
   data[CBAllKeys.VALIDATIONS] = get(policy, [POLICY, CBAllKeys.VALIDATIONS], []);
  }
  return data;
};

const constructStateUserFields = (fieldUuids = [], fields = {}) => fieldUuids?.map((eachField) => {
    const currentField = fields?.[eachField];
    return {
      key: eachField,
      label: currentField?.label,
    };
  });

const constructStateAccessTo = (accessTo, type, fields = {}) => {
  let constructedAccessTo = {};

  if (type === POLICY_TYPE.CONDIITON_BASED) {
    constructedAccessTo = accessTo;
  } else {
    constructedAccessTo[FIELD_UUID] = constructStateUserFields(accessTo?.[FIELD_UUID] || [], fields);
  }

  return constructedAccessTo;
};

export const constructPolicyForResponse = (policyList = [], fields = {}) => policyList.map((eachPolicy = {}) => {
  const data = {
    [TYPE]: eachPolicy[TYPE],
    [POLICY_UUID]: eachPolicy[POLICY_UUID],
    [ACCESS_TO]: constructStateAccessTo(eachPolicy[ACCESS_TO], eachPolicy[TYPE], fields),
  };

  if (data[TYPE] === POLICY_TYPE.CONDIITON_BASED) {
    data[POLICY] = constructExpressionFromPolicy(eachPolicy, fields);
  }
  console.log('asdfasdfasdfasdfasdf', data);
  return data;
});

// Post Data Construction
export const getPostOperator = (operator = null) => {
   switch (operator) {
     case 'stringEqualsTo':
     case 'dateEqualsTo':
     case 'dateAndTimeEqualsTo':
     case 'currencyEqualsTo':
     case 'numberEqualsTo': return 'equal_to';

     case 'stringNotEqualsTo':
     case 'dateNotEqualsTo':
     case 'dateAndTimeNotEqualsTo':
     case 'currencyNotEqualsTo':
     case 'numberNotEqualsTo': return 'not_equal_to';

     case 'stringIn':
     case 'numberIn': return 'in';

     case 'stringNotIn':
     case 'numberNotIn': return 'not_in';

     case 'numberGreaterThan': return 'greater_than';

     case 'numberLessThan': return 'lesser_than';

     case 'numberGreaterThanOrEqualTo': return 'greater_than_or_equal_to';

     case 'numberLessThanOrEqualTo': return 'lesser_than_or_equal_to';

     case 'numberInBetween': return 'between';

     case 'booleanIsTrue': return 'is_true';

     case 'booleanIsFalse': return 'is_false';

     case 'isEmpty': return 'is_empty';
     case 'isNotEmpty': return 'is_not_empty';

     default: return operator;
   }
};

export const constructConditionsforPostData = (conditions = []) => {
  const allFields = getVisibilityExternalFieldsDropdownList(store.getState(), null, false) || [];
  const constrcutedCondition = conditions.map((eachCondition) => {
    const field_data = getFieldFromFieldUuid(
      allFields,
      eachCondition[CBAllKeys.L_FIELD],
    );
    const obj = {
      [CBAllKeys.L_FIELD]: eachCondition[CBAllKeys.L_FIELD],
      [CBAllKeys.OPERATOR]: getPostOperator(eachCondition[CBAllKeys.OPERATOR]),
    };

    if (eachCondition[R_CONSTANT]) { // r_constant is maintained only in FE
      obj[CBAllKeys.R_VALUE] = [eachCondition[R_CONSTANT]];
    } else if (has(eachCondition, [CBAllKeys.R_VALUE])) {
      let rValue = [eachCondition[CBAllKeys.R_VALUE]].flat();
      if (field_data?.field_type === FIELD_TYPES.YES_NO) {
        rValue = [JSON.parse([eachCondition[CBAllKeys.R_VALUE]])];
      }
      obj[CBAllKeys.R_VALUE] = rValue;
    }

    return obj;
  });
  return constrcutedCondition;
};

const constructUserOrTeam = (UserOrTeam = {}) => {
  const constructedUserOrTeam = {};

  const users = get(UserOrTeam, [USERS], []).map((user) => user?._id);
  const teams = get(UserOrTeam, [TEAMS], []).map((team) => team?._id);

  if (!isEmpty(users)) constructedUserOrTeam[USERS] = users;
  if (!isEmpty(teams)) constructedUserOrTeam[TEAMS] = teams;

  return constructedUserOrTeam;
};

const constructUserFields = (fieldUuids = []) => {
  const postfieldUuids = fieldUuids?.filter((eachField) => !eachField?.is_deleted);

  return postfieldUuids?.map((eachField) => eachField?.key);
};

const constructAccessTo = (accessTo, type) => {
    const constructedAccessTo = {};

    if (type === POLICY_TYPE.CONDIITON_BASED) {
      constructedAccessTo[USER_TEAM] = constructUserOrTeam(accessTo?.[USER_TEAM] || {});
    } else {
      constructedAccessTo[FIELD_UUID] = constructUserFields(accessTo?.[FIELD_UUID] || []);
    }

    return constructedAccessTo;
};

export const constructSinglePolicyForPostData = (policy = {}) => {
  const data = {
    [TYPE]: policy[TYPE],
    [POLICY_UUID]: policy[POLICY_UUID],
  };

  if (data[TYPE] === POLICY_TYPE.CONDIITON_BASED) {
    const policyCondition = get(policy, [POLICY], {});
    console.log('isString([eachCondition[CBAllKeys.R_VALUE]]?.flat()1', policy, policyCondition);
    data[POLICY] = {
      [CBAllKeys.LOGICAL_OPERATOR]: policyCondition?.[CBAllKeys.LOGICAL_OPERATOR],
      [CBAllKeys.CONDITIONS]: constructConditionsforPostData(policyCondition?.[CBAllKeys.CONDITIONS]),
    };
  }

  data[ACCESS_TO] = constructAccessTo(get(policy, [ACCESS_TO], {}), policy[TYPE]);

  return data;
};

export const constructPolicyForConditionBasedData = (policyList = []) => cloneDeep(policyList).map((eachPolicy) => constructSinglePolicyForPostData(eachPolicy));

export const getModuleIdByType = (moduleId, moduleType) => {
  const data = {};

  if (moduleType === MODULE_TYPES.DATA_LIST) {
    data.data_list_id = moduleId;
  } else if (moduleType === MODULE_TYPES.FLOW) {
    data.flow_id = moduleId;
  } else if (moduleType === MODULE_TYPES.TASK) {
    data.task_metadata_id = moduleId;
  }

  return data;
};
