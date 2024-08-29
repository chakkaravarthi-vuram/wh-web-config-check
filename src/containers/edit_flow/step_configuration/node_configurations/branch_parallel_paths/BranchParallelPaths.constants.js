import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';

export const CONDITION_ROUTER_RESPONSE_KEYS = {
    CONDITION: 'condition',
    STEP_STATUS: 'stepStatus',
    RULE_DETAILS: 'ruleDetails',
    RULE_UUID: 'ruleUUID',
    RULE_NAME: 'ruleName',
    STEPS: 'stepUuids',
    DEFAULT_STEPS: 'defaultSteps',
    IS_CONDITIONAL: 'isConditional',
};

export const CONDITION_ROUTER_REQUEST_KEYS = {
    CONDITION: 'condition',
    STEP_STATUS: 'step_status',
    RULE_DETAILS: 'rule',
    RULE_UUID: 'rule_uuid',
    RULE_NAME: 'rule_name',
    STEPS: 'step_uuids',
    DEFAULT_STEPS: 'default_step_uuids',
    BRANCH_CONFIG: 'branch_config',
    IS_CONDITIONAL: 'is_conditional',
};

export const PARALLEL_STEP_INITIAL_STATE = {
    flowId: null,
    stepUuid: null,
    _id: null,
    stepName: null,
    stepId: null,
    coordinateInfo: {
      stepCoordinates: {
        x: 0,
        y: 0,
      },
    },
    stepType: null,
    stepStatus: DEFAULT_STEP_STATUS,
    isLoadingNodeDetails: false,
    isErrorInLoadingNodeDetails: false,
};
