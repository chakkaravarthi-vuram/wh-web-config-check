import React, { useEffect } from 'react';
import { ETabVariation, Text } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import Header from 'components/header_and_body_layout/Header';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Prompt, useHistory, useParams } from 'react-router-dom';
import queryString from 'query-string';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from './CreateEditLayout.module.scss';
import { TEAMS_STRINGS, TEAMS_TABS } from '../../teams.strings';
import { constructCreateEditPostData, getMoreOptionTeamHeaders } from '../../teams.utils';
import ManageMembers from '../members/ManageMembers';
import { clearCreateEditTeamManageMembers, createEditDataChange, clearCreateEditDetails } from '../../../../redux/reducer/TeamsReducer';
import { addOrRemoveTeamMemberApiThunk, createTeamApiThunk, getSeparateAllUserOrTeamsDataThunk, getTeamDetailsThunk } from '../../../../redux/actions/Teams.action';
import TeamSecurity from '../team_security/TeamSecurity';
import { HOME, PUBLIC_TEAMS, SIGNIN } from '../../../../urls/RouteConstants';
import jsUtility from '../../../../utils/jsUtility';
import { getUserProfileData, handleBlockedNavigation, isBasicUserMode, routeNavigate, showToastPopover, validate } from '../../../../utils/UtilityFunctions';
import { constructCreateEditValidationData, createOrEditTeamSecurityValidationSchema } from '../../teams.validation';
import { FORM_POPOVER_STATUS, ROUTE_METHOD } from '../../../../utils/Constants';
import WarningNewIcon from '../../../../assets/icons/WarningNewIcon';

function CreateEditLayout(props) {
    const {
        teamCreateEditState,
        teamCreateEditState: {
            teamName,
            currentTab,
            blockRoute,
            isBasicDetailsBlockNavigate,
        },
        createEditDataChange,
        getSeparateAllUserOrTeamsDataThunk,
        clearCreateEditTeamManageMembers,
        createTeamApiThunk,
        addOrRemoveTeamMemberApiThunk,
        clearCreateEditDetails,
        getTeamDetailsThunk,
     } = props;
     const { t } = useTranslation();
     const history = useHistory();
     const isNormalMode = isBasicUserMode(history);
     const { COMMON_STRINGS, TEAMS_TAB, CTA_LABELS } = TEAMS_STRINGS(t);
     const { teamid } = useParams();

    const userProfileData = getUserProfileData();
    const currentUserData = [{
        noDelete: true,
        _id: userProfileData?.id,
        username: userProfileData?.user_name,
        first_name: userProfileData?.first_name,
        last_name: userProfileData?.last_name,
        email: userProfileData?.email,
        is_active: true,
        is_user: true,
        label: userProfileData?.full_name,
        name: userProfileData?.full_name,
        id: userProfileData?.id,
    }];

    // On Submit create and edit Team
    const onSubmitCreateEditClick = () => {
        const errorList = validate(constructCreateEditValidationData(teamCreateEditState, isNormalMode), createOrEditTeamSecurityValidationSchema(t));
        if (jsUtility.isEmpty(errorList)) {
            const postData = constructCreateEditPostData(teamCreateEditState, isNormalMode, teamid);
            createTeamApiThunk(postData, history, teamid, t);
        } else {
            showToastPopover(COMMON_STRINGS.MANAGE_ERROR, COMMON_STRINGS.ERROR_SUBTITLE, FORM_POPOVER_STATUS.SERVER_ERROR, true);
            createEditDataChange({ errorMessage: errorList });
        }
    };

    useEffect(() => {
        if (!teamid && !teamCreateEditState?.isEditTeam) {
            const clonedSecurity = jsUtility.cloneDeep(teamCreateEditState);
            clonedSecurity.security.visibility.selectiveUsers = true;
            clonedSecurity.security.visibility.members = false;
            clonedSecurity.security.visibility.others.users = jsUtility.isEmpty(clonedSecurity?.visibility?.others?.users) ? currentUserData : clonedSecurity?.visibility?.others?.users;
            clonedSecurity.security.owner.selectiveUsers = true;
            clonedSecurity.security.owner.users = jsUtility.isEmpty(clonedSecurity?.owner?.users) ? currentUserData : clonedSecurity?.owner?.users;
            if (isNormalMode) {
                clonedSecurity.security.visibility.members = true;
            }
            createEditDataChange({ ...teamCreateEditState, ...clonedSecurity });
        }
        return () => {
            clearCreateEditDetails();
        };
    }, []);

    // Header cancel clicked
    const onCancelClick = () => {
        routeNavigate(history, ROUTE_METHOD.PUSH, isNormalMode ? HOME : PUBLIC_TEAMS);
    };

    useEffect(() => {
        if (!isBasicDetailsBlockNavigate) {
            const currentParams = queryString.parseUrl(history.location.pathname);
            let newParams = { ...jsUtility.get(currentParams, ['query'], {}) };
            newParams = { ...newParams, create: 'teams' };
            const search = new URLSearchParams(newParams).toString();
            routeNavigate(history, ROUTE_METHOD.PUSH, null, search);
        }
    }, [isBasicDetailsBlockNavigate]);

    // Clicking basic settings menu
    const onBasicSettingsSubMenuClick = () => {
        createEditDataChange({ isBasicDetailsBlockNavigate: false });
    };

    const validationCheck = () => {
        const errorList = validate(constructCreateEditValidationData(teamCreateEditState, isNormalMode), createOrEditTeamSecurityValidationSchema(t));
        return !jsUtility.isEmpty(errorList);
    };

    const secondaryProps = {
        displaySecondaryActions: true,
        subMenuList: getMoreOptionTeamHeaders(false, t),
        primaryCTALabel: teamid ? CTA_LABELS.UPDATE : CTA_LABELS.CREATE,
        primaryCTAClicked: onSubmitCreateEditClick,
        secondaryCTALabel: CTA_LABELS.CANCEL,
        secondaryCTAClicked: () => onCancelClick(),
        subMenuItemClicked: () => onBasicSettingsSubMenuClick(),
        primaryButtonDisabled: validationCheck(),
    };

    const updateStatusInfo = (
        <div className={cx(gClasses.CenterV, styles.WarnContainer, gClasses.MB16)}>
            <WarningNewIcon />
            <Text content={COMMON_STRINGS.UPDATE_INFO} className={cx(gClasses.FTwo13RedV28, gClasses.ML8)} />
        </div>);

    // get current Teams tab
    const getCurrentTeamTab = () => {
        switch (currentTab) {
            case TEAMS_TAB.MANAGE_MEMBERS:
                return (
                    <ManageMembers
                        createEditDataChange={createEditDataChange}
                        teamCreateEditState={teamCreateEditState}
                        getSeparateAllUserOrTeamsDataThunk={getSeparateAllUserOrTeamsDataThunk}
                        clearCreateEditTeamManageMembers={clearCreateEditTeamManageMembers}
                        addOrRemoveTeamMemberApiThunk={addOrRemoveTeamMemberApiThunk}
                        getTeamDetailsThunk={getTeamDetailsThunk}
                        updateStatusInfo={updateStatusInfo}
                    />
                );
            case TEAMS_TAB.SECURITY:
                return (
                    <div className={styles.SecurityWrap}>
                        {teamid && updateStatusInfo}
                        <TeamSecurity currentUserData={currentUserData} />
                    </div>
                );
            default: return null;
        }
    };

    // Tab change function
    const onTabChangeClick = (tab) => {
        const errorList = validate(constructCreateEditValidationData(teamCreateEditState, isNormalMode), createOrEditTeamSecurityValidationSchema(t));
        if (jsUtility.isEmpty(errorList)) {
            createEditDataChange({ currentTab: tab });
        } else {
            showToastPopover(COMMON_STRINGS.MANAGE_ERROR, COMMON_STRINGS.ERROR_SUBTITLE, FORM_POPOVER_STATUS.SERVER_ERROR, true);
            createEditDataChange({ errorMessage: errorList });
        }
    };

    // Block Navigate while editing
    const promptBeforeLeaving = (location) => {
        if ((location.pathname !== SIGNIN) && isBasicDetailsBlockNavigate && !blockRoute) {
          handleBlockedNavigation(
            t,
            () => {
                createEditDataChange({ isBasicDetailsBlockNavigate: false });
            },
            history,
            {
              ...location,
            },
          );
        } else return true;
        return false;
      };

    return (
        <>
            <Prompt message={promptBeforeLeaving} />
            <Header
                pageTitle={teamid ? COMMON_STRINGS.EDIT_TEAM : COMMON_STRINGS.CREATE_TEAM}
                fieldLabel={COMMON_STRINGS.TEAM_NAME}
                variation={ETabVariation.stepper}
                fieldValue={teamName}
                tabOptions={TEAMS_TABS(t)}
                selectedTabIndex={currentTab}
                onTabItemClick={onTabChangeClick}
                className={cx(gClasses.ZIndex5, styles.ResponsiveTeamTabs)}
                textClass={styles.TabText}
                tabIconClassName={styles.TabIcon}
                {...secondaryProps}
            />
            <div className={cx(styles.BodyLayout, gClasses.PositionRelative)}>
                {getCurrentTeamTab()}
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        teamCreateEditState: state.TeamsReducer.createEditTeam,
    };
};

const mapDispatchToProps = {
    createEditDataChange,
    getSeparateAllUserOrTeamsDataThunk,
    clearCreateEditTeamManageMembers,
    createTeamApiThunk,
    clearCreateEditDetails,
    addOrRemoveTeamMemberApiThunk,
    getTeamDetailsThunk,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateEditLayout);
