import { translateFunction } from '../../utils/jsUtility';

export const RULE_BASED_RECIPIENTS = (t = translateFunction) => {
    return {
        RULE_RECIPIENT: {
            HEADERS: [
                t('flow_strings.rule_based_assignee.headers.condition'),
                t('flow_strings.rule_based_assignee.headers.set_assignee'),
            ],
            BODY: {
                CONDITION: {
                    ID: 'ruleName',
                    RULE_TYPE: t('flow_strings.rule_based_assignee.body.condition.rule_type'),
                },
            },
        },
    };
};
