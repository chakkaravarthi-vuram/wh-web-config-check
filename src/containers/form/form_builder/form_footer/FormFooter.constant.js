import { INITIAL_STATE } from '../../../../components/condition_builder/ConditionBuilder.strings';
import { EXPRESSION_TYPE } from '../../../../utils/constants/rule/rule.constant';
import { CREATE_FORM_STRINGS } from './FormFooter.string';

export const FOOTER_PARAMS_POST_DATA_ID = {
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
    RULE_ID: 'rule_uuid',
    RULE_NAME: 'rule_name',
    CONTROL_TYPE: 'control_type',
    VISIBILITY: 'visibility',
};

export const FOOTER_PARAMS_ID = {
    ACTION_LABEL: 'actionName',
    ACTION_UUID: 'actionUUID',
    ACTION_TYPE: 'actionType',
    IS_CONDITION_RULE: 'isConditionRule',
    BUTTON_COLOR: 'buttonColor',
    BUTTON_POSITION: 'buttonPosition',
    CONDITION_RULE: 'conditionRule',
    ALLOW_COMMENTS: 'allowComments',
    IS_NEXT_STEP_RULE: 'isNextStepRule',
    NEXT_STEP_RULE: 'nextStepRule', // id
    NEXT_STEP_UUID: 'nextStepUUID',
    NEXT_STEP_RULE_CONTENT: 'nextStepRuleContent',
    NEXT_STEP_RULE_NAME: 'nextStepRuleName',
    ELSE_NEXT_STEP_RULE_NAME: 'elseNextStepRuleName',
    EXPRESSION: 'expression',
    EXPRESSION_TYPE: 'expression_type',
    IF: 'if',
    OUTPUT_VALUE: 'outputValue',
    ELSE_OUTPUT_VALUE: 'elseOutputValue',
    RULE_ID: 'ruleUUID',
    RULE_NAME: 'ruleName',
    CONTROL_TYPE: 'controlType',
    VISIBILITY: 'visibility',

    VALIDATION_MESSAGE: 'validationMessage',
    IS_NEXT_STEP_RULE_HAS_VALIDATION: 'is_next_step_rule_has_validation',
};

export const ALLOW_COMMENTS = {
  REQUIRED: 'required',
  OPTIONAL: 'optional',
  NO_COMMENTS: 'no_comment',
};

export const CONTROL_TYPES = {
  FULL_CONTROL: 'full_control',
  REVIEW_SEND_TO_OWNER: 'resend_to_owner',
};

export const VISIBILITY_TYPES = {
  HIDE: 'hide',
  DISABLE: 'disable',
};

export const BUTTON_COLOR_TYPES = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
};

export const BUTTON_POSITION_TYPES = {
  LEFT: 'left',
  RIGHT: 'right',
};

export const ACTIVE_ACTION_INITIAL_STATE = {
    [FOOTER_PARAMS_ID.ACTION_LABEL]: null,
    [FOOTER_PARAMS_ID.ACTION_UUID]: null,
    [FOOTER_PARAMS_ID.ACTION_TYPE]: null,
    [FOOTER_PARAMS_ID.BUTTON_COLOR]: null,
    [FOOTER_PARAMS_ID.BUTTON_POSITION]: null,
    [FOOTER_PARAMS_ID.IS_CONDITION_RULE]: false,
    [FOOTER_PARAMS_ID.CONDITION_RULE]: null,
    [FOOTER_PARAMS_ID.ALLOW_COMMENTS]: ALLOW_COMMENTS.NO_COMMENTS,
    [FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE]: false,
    // [FOOTER_PARAMS_ID.NEXT_STEP_UUID]: null,
};

export const ALL_FOOTER_ACTION = {
  ACTIVE_ACTION_DATA_CHANGE: 'active_action_data_change',
  UPDATE_ACTIVE_ACTION: 'update_active_action',
  CLEAR_ACTIVE_ACTION: 'clear_active_action',
  UPDATE_NEXT_STEP_RULE_IF_LST: 'update_next_step_rule_if_lst',
  UPDATE_VALIDATION_MESSAGE: 'update_validation_message',
  ADD_ACTION: 'add_action',
  UPDATE_ACTION: 'update_action',
  DELETE_ACTION: 'delete_action',
};

export const TAB = {
    BASIC: 0,
    VISIBILITY: 1,
};

export const GET_TAB_OPTIONS = (t) => [
        { labelText: CREATE_FORM_STRINGS(t).FORM_BUTTON_CONFIG.HEADER.TAB.BASIC, value: TAB.BASIC, tabIndex: TAB.BASIC },
        { labelText: CREATE_FORM_STRINGS(t).FORM_BUTTON_CONFIG.HEADER.TAB.VISIBILITY, value: TAB.VISIBILITY, tabIndex: TAB.VISIBILITY },
];

export const GET_NEXT_STEP_GROUP_CONDITION = () => {
    return {
            condition_expression: {
              ...INITIAL_STATE.GET_CONDITION(),
            },
            next_step_name: '',
            output_value: '',
        };
};

export const GET_NEXT_STEP_CONDITION_RULE_IF = () => {
  return {
    [FOOTER_PARAMS_ID.EXPRESSION_TYPE]: 'string',
    [FOOTER_PARAMS_ID.RULE_ID]: '',
    [FOOTER_PARAMS_ID.OUTPUT_VALUE]: [''],
  };
};

export const GET_NEXT_STEP_CONDITION_RULE = () => {
  return {
    [FOOTER_PARAMS_ID.EXPRESSION_TYPE]: EXPRESSION_TYPE.DECISION_EXPRESSION,
    [FOOTER_PARAMS_ID.EXPRESSION]: {
      [FOOTER_PARAMS_ID.IF]: [
        GET_NEXT_STEP_CONDITION_RULE_IF(),
      ],
      [FOOTER_PARAMS_ID.ELSE_OUTPUT_VALUE]: [''],
    },
  };
};

export const ELSE_CONDITION_ID = 'else_condition';

export const FORM_ACTION_TYPES = {
  FORWARD: 'forward',
  END_FLOW: 'end_flow',
  CANCEL: 'cancel',
  SEND_BACK: 'send_back',
  ASSIGN_REVIEW: 'assign_review',
  FORWARD_ON_FAILURE: 'forward_on_failure',
};
