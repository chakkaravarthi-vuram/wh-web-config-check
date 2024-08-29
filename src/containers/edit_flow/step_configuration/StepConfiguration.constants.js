import { ASSIGNEE_TYPE } from '../EditFlow.utils';

export const DATA_TYPE = {
    DIRECT: 'direct',
    RULE: 'rule',
};

export const DEFAULT_STATUS_VALUE = {
    value: 'In Progress',
    label: 'In Progress',
};

export const INITIAL_ASSIGNEE_DATA = [{
        assignee_type: ASSIGNEE_TYPE.DIRECT_ASSIGNEE,
    }];

export const INITIAL_RULE_BASED_ASSIGNEES_DATA = [{
    condition_rule: null,
    rule_assignees: INITIAL_ASSIGNEE_DATA,
}];
