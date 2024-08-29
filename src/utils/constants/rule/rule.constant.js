import { translateFunction } from '../../jsUtility';

const fieldTypeConst = require('./field_type.constant');
const operandConst = require('./operand_type.constant');

export const { OPERAND_TYPES } = operandConst;
export const { RULE_FIELD_TYPE } = fieldTypeConst;
export const DEFAULT_RULE_ALLOWED_FIELD_TYPES = [
  fieldTypeConst.RULE_FIELD_TYPE.NUMBER,
  fieldTypeConst.RULE_FIELD_TYPE.CURRENCY,
  fieldTypeConst.RULE_FIELD_TYPE.DROPDOWN,
  fieldTypeConst.RULE_FIELD_TYPE.PARAGRAPH,
  fieldTypeConst.RULE_FIELD_TYPE.SINGLE_LINE,
  fieldTypeConst.RULE_FIELD_TYPE.RADIO_GROUP,
  fieldTypeConst.RULE_FIELD_TYPE.CHECKBOX,
  fieldTypeConst.RULE_FIELD_TYPE.PHONE_NUMBER,
  fieldTypeConst.RULE_FIELD_TYPE.EMAIL,
];

export const DEFAULT_RULE_ALLOWED_FIELD_TYPES_TABLE = [
  fieldTypeConst.RULE_FIELD_TYPE.NUMBER,
  fieldTypeConst.RULE_FIELD_TYPE.PARAGRAPH,
  fieldTypeConst.RULE_FIELD_TYPE.SINGLE_LINE,
];

export const EXPRESSION_TYPE = {
  FORMULA_EXPRESSION: 'formulaExpression',
  LOGICAL_EXPRESSION: 'logicalExpression',
  DECISION_EXPRESSION: 'decisionExpression',
};

export const RULE_TYPE = {
  VISIBILITY: 'rule_field_show_when_condition',
  DEFAULT_VALUE: 'rule_field_default_value_condition',
  DATA_MANIPULATOR_RULE: 'rule_step_manipulation',
  DUE_DATA: 'rule_step_due_date',
  ACTION_VISISBILITY: 'rule_step_action_condition',
  NEXT_STEP_ACTION: 'rule_step_action_next_step',
  DATA_LIST_QUERY: 'rule_data_list_query',
  INTEGRATION_FORM: 'rule_form_integration',
};

export const R_CONSTANT_TYPES = {
  TODAY: 'today',
  NOW: 'now',
};

export const R_CONSTANT = 'r_constant';
export const VALUE_TYPE = 'value_type';
export const L_VALUE_TYPE = 'l_value_type';

export const VALUE_TYPE_KEY = {
  USER_DEFINED: 'dynamic',
  SYSTEM_FIELDS: 'system',
  STATIC_VALUE: 'static',
};

export const RULE_VALUE_TYPE_OPTION_LIST = (t = translateFunction) => [
  {
    label: t('configure_rule.user_defined_fields'),
    value: VALUE_TYPE_KEY.USER_DEFINED,
  },
  {
    label: t('configure_rule.system_fields'),
    value: VALUE_TYPE_KEY.SYSTEM_FIELDS,
  },
  {
    label: t('configure_rule.static_value'),
    value: VALUE_TYPE_KEY.STATIC_VALUE,
  },
];

export const RULE_VALUE_TYPE_OPTION_LIST_EXCLUDING_STATIC_VALUE = (t = translateFunction) => [
  {
    label: t('configure_rule.user_defined_fields'),
    value: VALUE_TYPE_KEY.USER_DEFINED,
  },
  {
    label: t('configure_rule.system_fields'),
    value: VALUE_TYPE_KEY.SYSTEM_FIELDS,
  },
];
