import React from 'react';
import { CBAllKeys, EPopperPlacements, ETextSize, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import { constructExpressionFromPolicy } from '../PolicyBuilder.utils';
import { get, isEmpty, cloneDeep, find, remove } from '../../../../../utils/jsUtility';

import { POLICY_STRINGS } from '../../security_policy/SecurityPolicy.strings';
import SingleGroupConditionBuilder from '../../../../../components/condition_builder/single_group_condition_builder/SingleGroupConditionBuilder';
import styles from '../../security_policy/SecurityPolicy.module.scss';
import UserPicker from '../../../../../components/user_picker/UserPicker';
import { POLICY_BUILDER_STRINGS } from '../PolicyBuilder.strings';
import { TEAM_TYPES_PARAMS } from '../../../../../utils/Constants';

function SinglePolicyBuilder(props) {
    const {
        policy,
        hasValidation,
        fieldOptionList,
        isDeletable,

        updatePolicy,
        onLoadMoreFields,
        onSearchFields,
        onUpdatePolicy,
        onDeletePolicy,
     } = props;
     const { t } = useTranslation();

    const { ACCESS_TO, USER_TEAM } = POLICY_STRINGS.REQUEST_KEYS;
    const constructedPolicy = constructExpressionFromPolicy(policy, {}, true);
    const expressionUUID = constructedPolicy?.[CBAllKeys.EXPRESSION_UUID];
    const accessToErrorMessage = policy?.accessToErrorMessage;
    const selectedValue = get(policy, [ACCESS_TO, USER_TEAM], {});

    const onSelectUserHandler = (userOrTeam) => {
        const value = !isEmpty(cloneDeep(selectedValue)) ? cloneDeep(selectedValue) : { users: [], teams: [] };
        if (userOrTeam.is_user) {
            if (!find(value.users, { _id: userOrTeam._id })) {
                if (isEmpty(value.users)) value.users = [];
                value.users.push(userOrTeam);
            }
        } else if (!userOrTeam.is_user) {
            if (!find(value.teams, { _id: userOrTeam._id })) {
                if (isEmpty(value.teams)) value.teams = [];
                value.teams.push(userOrTeam);
            }
        }

        const accessTo = get(policy, [ACCESS_TO], {});
        updatePolicy(expressionUUID, ACCESS_TO, { ...accessTo, [USER_TEAM]: value });
    };

    const onRemoveUserHanlder = (id) => {
        const value = !isEmpty(cloneDeep(selectedValue)) ? cloneDeep(selectedValue) : { users: [], teams: [] };
        if (find(value.users, { _id: id })) {
            remove(value.users, { _id: id });
        } else if (find(value.teams, { _id: id })) {
            remove(value.teams, { _id: id });
        }
        const accessTo = get(policy, [ACCESS_TO], {});
        updatePolicy(expressionUUID, ACCESS_TO, { ...accessTo, [USER_TEAM]: value });
    };

    return (
        <SingleGroupConditionBuilder
            id={expressionUUID}
            rule={constructedPolicy}
            hasValidation={hasValidation}
            lstAllFields={fieldOptionList}
            onLoadMoreExternalFields={onLoadMoreFields}
            onSearchExternalFields={onSearchFields}
            updateExpressionInReduxFn={(updatedPolicy) => onUpdatePolicy(updatedPolicy, expressionUUID)}
            onDeleteGroupCondition={() => onDeletePolicy(expressionUUID)}
            isDeletable={isDeletable}
            noFieldsFoundMsg={POLICY_BUILDER_STRINGS(t).DATA_NOT_FOUND.FIELDS_NOT_FOUND}
            choiceValueTypeBased // prop to get operator based on choice value type -> only for security policy
        >
            <div className={styles.EachPolicyAccessContainer}>
                <Text
                    content={POLICY_STRINGS.LABELS.CONDITION_ACCESS_TO}
                    size={ETextSize.MD}
                    className={styles.Title}
                />
                <UserPicker
                    id={`${expressionUUID}-users`}
                    selectedValue={selectedValue}
                    errorMessage={accessToErrorMessage}
                    isSearchable
                    hideLabel
                    onSelect={onSelectUserHandler}
                    onRemove={onRemoveUserHanlder}
                    noDataFoundMessage={POLICY_BUILDER_STRINGS(t).NO_USERS_FOUND}
                    allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
                    popperPosition={EPopperPlacements.RIGHT}
                />
            </div>
        </SingleGroupConditionBuilder>
    );
}

export default SinglePolicyBuilder;
