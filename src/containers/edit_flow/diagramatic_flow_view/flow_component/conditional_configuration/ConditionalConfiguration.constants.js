import { EXPRESSION_TYPE } from '../../../../../utils/constants/rule/rule.constant';

export const ACTION_CARD_CONSTANTS = {};

export const POST_DATA_KEYS = {
  ACTION_LABEL: 'action_name',
  ACTION_UUID: 'action_uuid',
  ACTION_TYPE: 'action_type',
  IS_CONDITION_RULE: 'is_condition_rule',
  BUTTON_COLOR: 'button_color',
  BUTTON_POSITION: 'button_position',
  CONDITION_RULE: 'condition_rule',
  ALLOW_COMMENTS: 'allow_comments',
  IS_NEXT_STEP_RULE: 'is_next_step_rule',
  NEXT_STEP_RULE: 'next_step_rule',
  NEXT_STEP_UUID: 'next_step_uuid',
  NEXT_STEP_RULE_CONTENT: 'next_step_rule_content',
  NEXT_STEP_RULE_NAME: 'next_step_name',
  ELSE_NEXT_STEP_RULE_NAME: 'else_next_step_name',
  EXPRESSION: 'expression',
  IF: 'if',
  OUTPUT_VALUE: 'output_value',
  ELSE_OUTPUT_VALUE: 'else_output_value',
  RULE: 'rule',
  RULE_ID: 'rule_uuid',
  RULE_NAME: 'rule_name',
  CONTROL_TYPE: 'control_type',
  VISIBILITY: 'visibility',
};

export const FIELD_IDS = {
  ACTION_LABEL: 'actionName',
  ACTION_UUID: 'actionUUID',
  ACTION_TYPE: 'actionType',
  IS_CONDITION_RULE: 'isConditionRule',
  BUTTON_COLOR: 'buttonColor',
  BUTTON_POSITION: 'buttonPosition',
  CONDITION_RULE: 'conditionRule',
  ALLOW_COMMENTS: 'allowComments',
  IS_NEXT_STEP_RULE: 'isNextStepRule',
  NEXT_STEP_RULE: 'nextStepRule',
  NEXT_STEP_UUID: 'nextStepUUID',
  NEXT_STEP_RULE_CONTENT: 'nextStepRuleContent',
  NEXT_STEP_RULE_NAME: 'nextStepRuleName',
  ELSE_NEXT_STEP_RULE_NAME: 'elseNextStepRuleName',
  EXPRESSION: 'expression',
  EXPRESSION_TYPE: 'expression_type',
  IF: 'if',
  OUTPUT_VALUE: 'outputValue',
  ELSE_OUTPUT_VALUE: 'elseOutputValue',
  RULE: 'rule',
  RULE_ID: 'ruleUUID',
  RULE_NAME: 'ruleName',
  CONTROL_TYPE: 'controlType',
  VISIBILITY: 'visibility',
  VALIDATION_MESSAGE: 'validationMessage',
  RULE_DETAILS: 'ruleDetails',
  IS_NEXT_STEP_RULE_HAS_VALIDATION: 'is_next_step_rule_has_validation',
};

export const getNextStepConditionRuleIf = () => {
  return {
    [FIELD_IDS.EXPRESSION_TYPE]: 'string',
    [FIELD_IDS.RULE_ID]: '',
    [FIELD_IDS.OUTPUT_VALUE]: [''],
  };
};

export const getNextStepConditionRule = () => {
  return {
    [FIELD_IDS.EXPRESSION_TYPE]: EXPRESSION_TYPE.DECISION_EXPRESSION,
    [FIELD_IDS.EXPRESSION]: {
      [FIELD_IDS.IF]: [getNextStepConditionRuleIf()],
      [FIELD_IDS.ELSE_OUTPUT_VALUE]: [''],
    },
  };
};

export const ACTION_CONSTANTS = {
  CONDITIONAL_CONFIG_DATA_CHANGE: 'CONDITIONAL_CONFIG_DATA_CHANGE',
};
