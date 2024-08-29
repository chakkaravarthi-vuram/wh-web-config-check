import { translateFunction } from '../../../../utils/jsUtility';

export const POLICY_BUILDER_STRINGS = (t = translateFunction) => {
    return {
    DATA_NOT_FOUND: {
        FIELDS_NOT_FOUND: 'No supported fields found',
    },
    NO_USERS_FOUND: t('common_strings.no_users_teams_found'),
    };
};

export const ERROR_MESSAGES = {
    POLICIES_REQUIRES: 'Atleast one policy is required',
};
