// import { translate } from 'language/config';
import { OPERAND_TYPES } from 'utils/constants/rule/operand_type.constant';
import { translateFunction } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { v4 as uuidV4 } from 'uuid';

const QUERY_BUILDER = {
    ALL_LABELS: {
       SHOW_THE_FIELD_WHEN: 'flows.query_builder.show_the_field_when',
       ALL_CONDITIONS: 'flows.query_builder.all_condition',
       ANY_CONDITIONS: 'flows.query_builder.any_condition',
       WHEN: 'flows.query_builder.when',
       OPERATOR: 'flows.query_builder.operator',
       VALUES: 'flows.query_builder.values',
       ADD_CONDITION: 'flows.query_builder.add_condition',
       ADD_SUB_CONDITION: 'flows.query_builder.add_sub_condition',
       ADD_CONDITION_NAME: 'flows.query_builder.add_condition_name',
       DELETE_CONDITION: 'flows.query_builder.delete_condition',
       SUB_CONDITION: 'flows.query_builder.sub_condition',
       GROUP: 'flows.query_builder.group',
       GROUP_NAME: 'flows.query_builder.group_name',
       CHOOSE_A_FIELD: 'flows.query_builder.choose_a_field',
    },
    ALL_PLACEHOLDERS: {
        WHEN: '',
        OPERATOR: '',
        VALUES: 'flows.query_builder.values_placeholder',
    },
    ALL_KEYS: {
        EXPRESSION_TYPE: 'expression_type',
        EXPRESSION: 'expression',
        EXPRESSIONS: 'expressions',
        OPERANDS: 'operands',
        CONDITIONS: 'conditions',
        LOGICAL_OPERATOR: 'logical_operator',
        L_FIELD: 'l_field',
        OPERATOR: 'operator',
        R_VALUE: 'r_value',
        LABEL: 'label',
        VALIDATIONS: 'validations',
        L_FIELD_TYPE: 'l_field_type',
        CONDITION_UUID: 'condition_uuid',
        EXPRESSION_UUID: 'expression_uuid',
        SELECTED_OPERATOR_INFO: 'selected_operator_info',
    },
    LOGICAL_OPERATOR: {
        AND: 'and',
        OR: 'or',
        NOT: 'not',
    },
    SYSTEM_REPRESENTING_LOGICAL_OPERATOR: {
        ALL: 'flows.query_builder.all_label',
        ANY: 'flows.query_builder.any_label',
    },
    ACTIONS: {
        ADD_CONDITION: 'ADD_CONDITION',
        ADD_RULE: 'ADD_RULE',
        DELETE_CONDITION: 'DELETE_CONDITION',
        DELETE_RULE: 'DELETE_RULE',
    },
    CHANGE_HANDLER_TYPE: {
       EXPRESSION: 'expression',
       RULE: 'RULE',
    },
    MULTIPLE_OPERAND_TYPES: [
      OPERAND_TYPES.MULTI_NUMBER,
      OPERAND_TYPES.MULTI_CURRENCY,
      OPERAND_TYPES.MULTI_DROPDOWN,
      OPERAND_TYPES.MULTI_SINGLE_LINE,
      OPERAND_TYPES.MULTI_STRING,
      OPERAND_TYPES.MULTI_FIELD_PICKER,
      OPERAND_TYPES.USER_SELECT,
    ],
    DUAL_OPERAND_TYPES: [
      OPERAND_TYPES.DUAL_NUMBER,
      OPERAND_TYPES.DUAL_DATE,
      OPERAND_TYPES.DUAL_FIELD_PICKER,
      OPERAND_TYPES.DUAL_DATE_TIME,
    ],
    CUSTOM_VALIDATION_MESSAGE: (t = translateFunction) => {
      return {
       EMPTY_RULE: t('flows.query_builder.min_rule_error_message'),
       DUPLICATE_RULE: t('flows.query_builder.duplicate_rule_error_message'),
      };
    },
    INITIAL_NEST_LEVEL: 1,
    MAX_NEST_LEVEL: 4,
    SERVER_ERROR_KEYS: {
      CYCLIC_DEPENDENCY: 'cyclicDependency',
    },
    SEREVR_ERROE_MESSGES: {
      cyclicDependency: 'Cannot set condition based on another field dependent on the current field',
    },
};

export const LOGICAL_OPERATOR_OPTION_LIST = (t = translateFunction) => [
    { label: t(QUERY_BUILDER.ALL_LABELS.ALL_CONDITIONS), value: QUERY_BUILDER.LOGICAL_OPERATOR.AND },
    { label: t(QUERY_BUILDER.ALL_LABELS.ANY_CONDITIONS), value: QUERY_BUILDER.LOGICAL_OPERATOR.OR },
];

export const INITIAL_STATE = {
  GET_RULE: () => {
    return {
      condition_uuid: uuidV4(),
      l_field: EMPTY_STRING,
      operator: EMPTY_STRING,
     // r_value: null,
    };
  },
  GET_CONDITION: () => {
    return {
      label: null,
      expression_uuid: uuidV4(),
      logical_operator: QUERY_BUILDER.LOGICAL_OPERATOR.AND,
      operands: {
        conditions: [
          {
            condition_uuid: uuidV4(),
            l_field: EMPTY_STRING,
            operator: EMPTY_STRING,
           // r_value: null,
          },
        ],
      },
    };
  },
};

export const QUERY_BUILDER_INITIAL_STATE = {
  expression_type: 'logicalExpression',
  expression: INITIAL_STATE.GET_CONDITION(),
};

export const NEXT_LINE_OPERAND = [
  OPERAND_TYPES.DATE_TIME,
  OPERAND_TYPES.DUAL_DATE_TIME,
  OPERAND_TYPES.USER_SELECT,
];

export default QUERY_BUILDER;
