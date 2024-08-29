import React, { useContext } from 'react';
import cx from 'classnames/bind';
import { CheckboxGroup, ECheckboxSize, ETextSize, Label, RadioGroupLayout, Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { useHistory } from 'react-router-dom';
import { TEAMS_STRINGS } from '../../../teams.strings';
import { getTeamOwnerOptionsList } from '../../../teams.utils';
import styles from '../../CreateEditTeam.module.scss';
import UserPicker from '../../../../../components/user_picker/UserPicker';
import { CancelToken, isBasicUserMode } from '../../../../../utils/UtilityFunctions';
import jsUtility from '../../../../../utils/jsUtility';
import ThemeContext from '../../../../../hoc/ThemeContext';

const cancelToken = new CancelToken();

function SecurityOwners(props) {
    const {
        owner,
        createEditDataChange,
        security,
        isTeamDetails,
        currentUserData,
        errorMessage,
    } = props;
    const { t } = useTranslation();
    const { SECURITY, SECURITY_OPTION, COMMON_STRINGS, KEYS } = TEAMS_STRINGS(t);
    const history = useHistory();
    const isNormalMode = isBasicUserMode(history);
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);

    // Check option change for owners
    const handleOwnersOptionChange = (option) => {
        const existingError = jsUtility.cloneDeep(errorMessage);
        delete existingError[KEYS.OWNER_USER];
        const ownerData = jsUtility.cloneDeep(owner);
        switch (option) {
            case SECURITY_OPTION.OWNER.ALL_DEVELOPERS:
                if (!ownerData.allDevelopers) {
                    ownerData.selectiveUsers = false;
                    ownerData.users = currentUserData;
                }
                ownerData.allDevelopers = !ownerData.allDevelopers;
                break;
            case SECURITY_OPTION.OWNER.SELECTIVE_DEVELOPER:
                if (isBasicUserMode(history)) return;
                if (!ownerData.selectiveUsers) {
                    ownerData.allDevelopers = false;
                }
                if (isBasicUserMode(history)) ownerData.members = !ownerData.members;
                ownerData.users = currentUserData;
                ownerData.selectiveUsers = !ownerData.selectiveUsers;
                break;
            case SECURITY_OPTION.OWNER.ALL_STANDARD_USERS:
                ownerData.members = !ownerData.members;
                break;
            default: break;
        }
        createEditDataChange({ security: { ...security, owner: ownerData }, errorMessage: existingError });
    };

    // Owners select handle
    const onOwnerUserSelect = (member) => {
        const ownerData = jsUtility.cloneDeep(owner);
        if (!jsUtility.find(ownerData?.users, { _id: member?._id })) {
            ownerData.users = [...ownerData.users, member];
            createEditDataChange({ security: { ...security, owner: ownerData } });
        }
    };

    // Owner Remove handle
    const onOwnerUserRemoveHandle = (removeId) => {
        const ownerData = jsUtility.cloneDeep(owner);
        if (jsUtility.find(ownerData?.users, { _id: removeId })) {
            jsUtility.remove(ownerData?.users, { _id: removeId });
        }
        if (jsUtility.find(ownerData?.teams, { _id: removeId })) {
            jsUtility.remove(ownerData?.teams, { _id: removeId });
        }
        createEditDataChange({ security: { ...security, owner: ownerData } });
    };

    return (
        <div className={gClasses.MB16}>
            <Label
                labelName={SECURITY.OWNER_LABEL}
                hideLabelClass
                className={cx(gClasses.FTwo12BlackV20, styles.SecurityTitle, gClasses.FontWeight600, gClasses.MB8)}
            />
            <CheckboxGroup
                size={ECheckboxSize.LG}
                layout={RadioGroupLayout.stack}
                options={getTeamOwnerOptionsList(t, owner, isTeamDetails, isNormalMode)}
                onClick={handleOwnersOptionChange}
                colorScheme={isBasicUserMode(history) && colorScheme}
                className={styles.CheckBoxStyle}
            />
            {owner?.selectiveUsers && (
            <UserPicker
                isSearchable
                disabled={isNormalMode || isTeamDetails}
                hideLabel={isBasicUserMode(history)}
                selectedValue={{ users: owner?.users, teams: [] }}
                required
                maxCountLimit={3}
                maxLimit={isBasicUserMode(history) && owner?.users.length}
                className={gClasses.MT5}
                labelText={SECURITY.CHOOSE_DEVELOPERS}
                labelClassName={gClasses.FTwo12BlackV20}
                onSelect={onOwnerUserSelect}
                onRemove={onOwnerUserRemoveHandle}
                allowedUserType={[3]}
                noDataFoundMessage={COMMON_STRINGS.NO_DATA}
                colorScheme={isBasicUserMode(history) ? colorScheme : colorSchemeDefault}
                cancelToken={cancelToken}
                isUsers
            />
            )}
            {jsUtility.get(errorMessage, [KEYS.OWNER_USER], null) && <Text size={ETextSize.SM} className={styles.ValidationMessage} content={`* ${jsUtility.get(errorMessage, ['owners,users'], null)}`} />}
        </div>
    );
}

export default SecurityOwners;
