export const JOIN_TYPE = {
  ALL_FLOWS: 'all_steps',
  ATLEAST_N_FLOWS: 'atleast_n_steps',
  SPECIFIC_STEPS: 'specific_steps',
  CONDITIONAL: 'conditional_join',
};

export const INITIAL_JOIN_CONDITION = [
  { type: JOIN_TYPE.ALL_FLOWS },
];

export const JOIN_NODE_OBJECT_KEYS = {
  parentKey: 'joinConfig',
  ruleBased: 'condition',
  stepCount: 'stepCount',
  stepUuids: 'stepUuids',
  conditionRuleKey: 'rule',
};

export const JOIN_PARALLEL_PATHS = (t) => {
  return {
    LABEL: t('join_parallel_paths.radio_group_string.label'),
    RADIO_OPTIONS: (isRuleBased = false) => [
      {
        label: t('join_parallel_paths.radio_group_string.options.incoming'),
        value: JOIN_TYPE.ALL_FLOWS,
      },
      {
        label: t('join_parallel_paths.radio_group_string.options.atleast'),
        value: JOIN_TYPE.ATLEAST_N_FLOWS,
      },
      {
        label: t('join_parallel_paths.radio_group_string.options.completed'),
        value: JOIN_TYPE.SPECIFIC_STEPS,
      },
      ...(!isRuleBased ? [{
        label: t('join_parallel_paths.radio_group_string.options.condition'),
        value: JOIN_TYPE.CONDITIONAL,
      }] : []),
    ],
  };
};

export const JOIN_PARALLEL_PATHS_STRINGS = (t) => {
  return {
    MODAL_TITLE: t('join_parallel_paths.common_strings.modal_title'),
    GENERALTAB: {
      TITLE_CONTENT: t('join_parallel_paths.general_tab_strings.title_content'),
    },
    ADDITIONAL_CONFIG_TAB: {
      TITLE_CONTENT: t('join_parallel_paths.additional_config_tab.title_content'),
    },
    ADD_CONDITION: t('join_parallel_paths.common_strings.add_condition'),
    CHOOSE: t('join_parallel_paths.common_strings.choose'),
    STEP_COUNT: 'Step Count',
    STEP_UUID: 'Step',
    CONDITION_HEADERS: [
      'Condition',
      'Wait Until',
    ],
    VALIDATION_MESSAGE: {
      STEP_UUID_REQUIRED: 'Step is required',
      INVALID_STEPS_ADDED: 'Invalid step(s) are added',
    },
    NO_INPUT_STEPS: 'No input connections are added for this node',
    CONDITION: 'Condition',
  };
};

export const JOIN_NODE_RESPONSE_KEYS = {
  JOIN_CONFIG: 'joinConfig',
  TYPE: 'type',
  STEP_UUIDS: 'stepUuids',
  STEP_COUNT: 'stepCount',
  STEP_UUID: 'stepUuid',
  STEP_NAME: 'stepName',
  ID: 'id',
  CONDITION: 'condition',
  RULE: 'rule',
};

export const JOIN_NODE_REQUEST_KEYS = {
  JOIN_CONFIG: 'join_config',
  TYPE: 'type',
  STEP_UUIDS: 'step_uuids',
  STEP_COUNT: 'step_count',
  STEP_UUID: 'step_uuid',
  STEP_NAME: 'step_name',
  ID: 'id',
  CONDITION: 'condition',
  RULE: 'rule',
};

export const JOIN_CONDITION = {
  ID: 'join_condition',
  RULE_BASED_ID: 'join_condition_on_rule',
};
