import React, { useContext } from 'react';
import cx from 'classnames/bind';
import { CheckboxGroup, ECheckboxSize, EPopperPlacements, ETextSize, Label, RadioGroupLayout, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { useHistory } from 'react-router-dom';
import { ROLES } from 'utils/Constants';
import { TEAMS_STRINGS } from '../../../teams.strings';
import { getTeamSecurityVisibilityOption } from '../../../teams.utils';
import styles from '../../CreateEditTeam.module.scss';
import UserPicker from '../../../../../components/user_picker/UserPicker';
import { CancelToken, isBasicUserMode } from '../../../../../utils/UtilityFunctions';
import jsUtility from '../../../../../utils/jsUtility';
import ThemeContext from '../../../../../hoc/ThemeContext';

const cancelToken = new CancelToken();

function SecurityVisibility(props) {
    const {
        visibility,
        createEditDataChange,
        security,
        isTeamDetails,
        currentUserData,
        errorMessage,
    } = props;
    const { t } = useTranslation();
    const { SECURITY, SECURITY_OPTION, COMMON_STRINGS, KEYS } = TEAMS_STRINGS(t);
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const history = useHistory();
    const isNormalMode = isBasicUserMode(history);

    // Visibility user selection
    const onVisibilityUserSelect = (member) => {
        const clonedVisibility = jsUtility.cloneDeep(visibility);
        if (member?.is_user) {
            if (!jsUtility.find(clonedVisibility.others?.users, { _id: member?._id })) {
                clonedVisibility.others.users = [...clonedVisibility.others.users, member];
            }
        } else {
            if (!jsUtility.find(clonedVisibility.others?.teams, { _id: member?._id })) {
                clonedVisibility.others.teams = [...clonedVisibility.others.teams, member];
            }
        }
        createEditDataChange({ security: { ...security, visibility: clonedVisibility } });
    };

    // Visibility remove users
    const onVisibilityUserRemoveHandle = (removeId) => {
        const clonedVisibility = jsUtility.cloneDeep(visibility);
        if (jsUtility.find(clonedVisibility.others?.users, { _id: removeId })) {
            jsUtility.remove(clonedVisibility.others?.users, { _id: removeId });
        }
        if (jsUtility.find(clonedVisibility.others?.teams, { _id: removeId })) {
            jsUtility.remove(clonedVisibility.others?.teams, { _id: removeId });
        }
        createEditDataChange({ security: { ...security, visibility: clonedVisibility } });
    };

    // Checkbox Visibility option click
    const handleVisibilityOptionChange = (option) => {
        const existingError = jsUtility.cloneDeep(errorMessage);
        delete existingError[KEYS.VISIBILITY_USERS];
        const visibilityData = jsUtility.cloneDeep(visibility);
        switch (option) {
            case SECURITY_OPTION.VISIBILITY.ALL_STANDARD_USERS:
                if (!visibilityData.allUsers) {
                    visibilityData.members = false;
                    visibilityData.selectiveUsers = false;
                    visibilityData.others = {
                    users: currentUserData,
                    teams: [],
                    };
                } else visibilityData.members = true;
                visibilityData.allUsers = !visibilityData.allUsers;
                break;
            case SECURITY_OPTION.VISIBILITY.SELECTIVE_USERS:
                if (isNormalMode) return;
                if (!visibilityData.selectiveUsers) {
                    visibilityData.allUsers = false;
                    visibilityData.members = true;
                }
                visibilityData.others = {
                  users: currentUserData,
                  teams: [],
                };
                visibilityData.selectiveUsers = !visibilityData.selectiveUsers;
                if (isNormalMode) visibilityData.members = !visibilityData.members;
                break;
            case SECURITY_OPTION.VISIBILITY.ALL_DEVELOPERS:
                visibilityData.members = !visibilityData.members;
                break;
            default: break;
        }
        createEditDataChange({ security: { ...security, visibility: visibilityData }, errorMessage: existingError });
    };

    return (
        <div className={gClasses.MT10}>
            <Label
                labelName={SECURITY.VISIBILITY_LABEL}
                hideLabelClass
                className={cx(gClasses.FTwo12BlackV20, styles.SecurityTitle, gClasses.FontWeight600, gClasses.MB8)}
            />
            <CheckboxGroup
                size={ECheckboxSize.LG}
                layout={RadioGroupLayout.stack}
                options={getTeamSecurityVisibilityOption(t, visibility, isTeamDetails, isNormalMode)}
                onClick={handleVisibilityOptionChange}
                colorScheme={isBasicUserMode(history) && colorScheme}
                className={styles.CheckBoxStyle}
            />
            {visibility?.selectiveUsers && (
            <UserPicker
                isSearchable
                disabled={isNormalMode || isTeamDetails}
                hideLabel={isBasicUserMode(history)}
                required
                selectedValue={visibility?.others}
                maxCountLimit={3}
                maxLimit={isBasicUserMode(history) && ((visibility?.others?.users.length || 0) + (visibility?.others?.teams.length || 0))}
                className={gClasses.MT5}
                labelText={SECURITY.SELECTED_USER_OR_TEAM}
                labelClassName={gClasses.FTwo12BlackV20}
                onSelect={onVisibilityUserSelect}
                onRemove={onVisibilityUserRemoveHandle}
                noDataFoundMessage={COMMON_STRINGS.NO_DATA}
                colorScheme={isBasicUserMode(history) ? colorScheme : colorSchemeDefault}
                cancelToken={cancelToken}
                popperPosition={EPopperPlacements.TOP}
                allowedUserType={[ROLES.MEMBER]}
            />
            )}
            {jsUtility.get(errorMessage, [KEYS.VISIBILITY_USERS], null) && <Text size={ETextSize.SM} className={styles.ValidationMessage} content={`* ${jsUtility.get(errorMessage, [KEYS.VISIBILITY_USERS], null)}`} />}
        </div>
    );
}

export default SecurityVisibility;
