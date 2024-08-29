import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { getUserProfileData } from 'utils/UtilityFunctions';
import { store } from 'Store';
import AddMembers from 'components/member_list/add_members/AddMembers';
import RadioGroup, { RADIO_GROUP_TYPE } from 'components/form_components/radio_group/RadioGroup';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { isCurrentUser } from 'utils/userUtils';
import jsUtils, { isNull, cloneDeep, set } from 'utils/jsUtility';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import { BS } from 'utils/UIConstants';
import { VALIDATION_CONSTANT } from 'server_validations/serverValidation.constant';
import { useTranslation } from 'react-i18next';
import styles from './Security.module.scss';
import { FLOW_STRINGS } from '../EditFlow.strings';
import { SECURITY_SETTINGS_STRINGS } from '../settings_configuration/SettingsConfiguration.utils';
import { NON_PRIVATE_TEAMS_PARAMS } from '../EditFlow.utils';
import { updatePolicyConditon } from '../../../redux/reducer/EditFlowReducer';
import DataAccess from './data_access/DataAccess';
import { getAllFieldsByFilter } from '../../../redux/actions/EditFlow.Action';
import { USER_FIELD_POLICY_CONSTANTS } from './user_field_policy/UserFieldPolicy.constants';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../../utils/constants/form.constant';
import { MODULE_TYPES } from '../../../utils/Constants';

function Security(props) {
  const {
    flowData,
    flowData: {
      invalidOwnersError,
      invalidAdminsError,
      invalidViewersError,
      userFieldsList,
      userFieldsListpaginationData,
      userFieldPolicyErrorList,
      lstAllFieldsLoading,
      securityPolicyErrorList,
      entityViewers,
      entityViewerSuggestionData,
      entityViewerSearchValue,
      invalidEntityViewersError,
    },
    onPolicyConditionUpdate,
    onGetAllFieldsByFilter,
  } = props;
  const clonedFlowData = cloneDeep(flowData);
  const { onFlowDataChange } = props;
  const { SECURITY } = FLOW_STRINGS;
  const { ACTORS_TEAMS_SUGGESTION, READ_ONLY_ACCESS_CONFIRMATION } = SECURITY;
  const { t } = useTranslation();
  const apiParamsForSecurity = {
    user_types: [1, 3],
  };
  let additional_viewers = [];
  let owners = [];
  let reassignedOwners = [];
  let modifiedEntityViewers = [];

  if (clonedFlowData.additional_viewers && clonedFlowData.additional_viewers.teams) additional_viewers = jsUtils.union(additional_viewers, clonedFlowData.additional_viewers.teams);
  if (clonedFlowData.additional_viewers && clonedFlowData.additional_viewers.users) {
    additional_viewers = jsUtils.union(additional_viewers, clonedFlowData.additional_viewers.users);
  }

  if (clonedFlowData.owners && clonedFlowData.owners.teams) owners = jsUtils.union(owners, clonedFlowData.owners.teams);
  if (clonedFlowData.owners && clonedFlowData.owners.users) {
    owners = jsUtils.union(owners, clonedFlowData.owners.users);
  }

  if (clonedFlowData.reassignedOwners && clonedFlowData.reassignedOwners.teams) reassignedOwners = jsUtils.union(reassignedOwners, clonedFlowData.reassignedOwners.teams);
  if (clonedFlowData.reassignedOwners && clonedFlowData.reassignedOwners.users) {
    reassignedOwners = jsUtils.union(reassignedOwners, clonedFlowData.reassignedOwners.users);
  }

  if (entityViewers?.teams) modifiedEntityViewers = jsUtils.union(modifiedEntityViewers, entityViewers?.teams);
  if (entityViewers?.users) {
    modifiedEntityViewers = jsUtils.union(modifiedEntityViewers, entityViewers?.users);
  }

  const onOpenVisibilityChangeHandler = (is_participants_level_security) => {
    clonedFlowData.is_participants_level_security = is_participants_level_security;
    onFlowDataChange(clonedFlowData);
  };

  const getInactivUserOrTeamsError = (userOrTeamList, errorList) => {
    if (errorList) {
      const invalidAssignees = [];
        if (!jsUtils.isEmpty(userOrTeamList)) {
          errorList.forEach((assignee) => {
            let inactiveAssigneeIndex = -1;
            if (!jsUtils.isEmpty(userOrTeamList?.users)) {
              inactiveAssigneeIndex = userOrTeamList?.users.findIndex((assigneeUser) => assigneeUser._id === assignee);
              if (inactiveAssigneeIndex > -1) invalidAssignees.push(userOrTeamList.users[inactiveAssigneeIndex].email);
            }
            if ((inactiveAssigneeIndex === -1) && !jsUtils.isEmpty(userOrTeamList?.teams)) {
              inactiveAssigneeIndex = userOrTeamList?.teams.findIndex((assigneeTeam) => assigneeTeam._id === assignee);
              if (inactiveAssigneeIndex > -1) invalidAssignees.push(userOrTeamList.teams[inactiveAssigneeIndex].team_name);
            }
          });
          if (!jsUtils.isEmpty(invalidAssignees)) return `${t(VALIDATION_CONSTANT.INVALID_USERS_OR_TEAMS)}: ${invalidAssignees.join(', ')}`;
        }
    }
    return EMPTY_STRING;
  };

  const onAdditionalViewersSelectHandler = (event) => {
    const team_or_user = event.target.value;
    clonedFlowData.additionalViewersSearchValue = EMPTY_STRING;
    clonedFlowData.selectedAdditionalViewer = event.target.value;
    if (team_or_user.is_user) {
      if (clonedFlowData.additional_viewers.users) {
        if (
          !jsUtils.find(clonedFlowData.additional_viewers.users, {
            _id: team_or_user._id,
          })
        ) clonedFlowData.additional_viewers.users.push(team_or_user);
      } else {
        clonedFlowData.additional_viewers.users = [];
        clonedFlowData.additional_viewers.users.push(team_or_user);
      }
    } else if (!team_or_user.is_user) {
      if (clonedFlowData.additional_viewers.teams) {
        if (
          !jsUtils.find(clonedFlowData.additional_viewers.teams, {
            _id: team_or_user._id,
          })
        ) clonedFlowData.additional_viewers.teams.push(team_or_user);
      } else {
        clonedFlowData.additional_viewers.teams = [];
        clonedFlowData.additional_viewers.teams.push(team_or_user);
      }
    }
    if (jsUtils.has(clonedFlowData, ['error_list', 'viewers'], false)) {
      const viewersError = getInactivUserOrTeamsError(clonedFlowData?.additional_viewers, invalidViewersError);
      if (!jsUtils.isEmpty(viewersError)) jsUtils.has(clonedFlowData, ['error_list', 'viewers'], viewersError);
      else delete clonedFlowData?.error_list?.viewers;
    }
    onFlowDataChange(clonedFlowData);
  };

  const onAdditionalViewersRemoveHandler = (id) => {
    if (clonedFlowData.additional_viewers.teams) {
      if (jsUtils.find(clonedFlowData.additional_viewers.teams, { _id: id })) {
        jsUtils.remove(clonedFlowData.additional_viewers.teams, { _id: id });
        if (clonedFlowData.additional_viewers.teams.length === 0) delete clonedFlowData.additional_viewers.teams;
      }
    }
    if (clonedFlowData.additional_viewers.users) {
      if (jsUtils.find(clonedFlowData.additional_viewers.users, { _id: id })) {
        jsUtils.remove(clonedFlowData.additional_viewers.users, { _id: id });
        if (clonedFlowData.additional_viewers.users.length === 0) delete clonedFlowData.additional_viewers.users;
      }
    }
    if (jsUtils.has(clonedFlowData, ['error_list', 'viewers'], false)) {
      const viewersError = getInactivUserOrTeamsError(clonedFlowData?.additional_viewers, invalidViewersError);
      if (!jsUtils.isEmpty(viewersError)) jsUtils.has(clonedFlowData, ['error_list', 'viewers'], viewersError);
      else delete clonedFlowData?.error_list?.viewers;
    }
    onFlowDataChange(clonedFlowData);
  };

  const setAddtionalViewersearchValue = (event) => {
    const flow_data = cloneDeep(store.getState().EditFlowReducer.flowData);
    flow_data.addtionalViewersSearchValue = event.target.value;
    onFlowDataChange(flow_data);
  };

  const onEntityViewerSelectHandler = (event) => {
    const teamOrUser = event.target.value;

    clonedFlowData.entityViewerSearchValue = EMPTY_STRING;
    clonedFlowData.entityViewerSuggestionData = event.target.value;

    if (teamOrUser?.is_user) {
      if (clonedFlowData?.entityViewers?.users) {
        if (
          !jsUtils.find(clonedFlowData?.entityViewers?.users, {
            _id: teamOrUser?._id,
          })
        ) clonedFlowData?.entityViewers?.users?.push(teamOrUser);
      } else {
        set(clonedFlowData, ['entityViewers', 'users'], [teamOrUser]);
      }
    } else if (!teamOrUser?.is_user) {
      if (clonedFlowData?.entityViewers?.teams) {
        if (
          !jsUtils.find(clonedFlowData?.entityViewers?.teams, {
            _id: teamOrUser?._id,
          })
        ) clonedFlowData?.entityViewers?.teams?.push(teamOrUser);
      } else {
        set(clonedFlowData, ['entityViewers', 'teams'], [teamOrUser]);
      }
    }

    if (jsUtils.has(clonedFlowData, ['error_list', 'entityViewers'], false)) {
      const viewersError = getInactivUserOrTeamsError(entityViewers, invalidEntityViewersError);
      if (!jsUtils.isEmpty(viewersError)) jsUtils.has(clonedFlowData, ['error_list', 'entityViewers'], viewersError);
      else delete clonedFlowData?.error_list?.entityViewers;
    }

    onFlowDataChange(clonedFlowData);
  };

  const onRemoveEntityViewer = (id) => {
    if (clonedFlowData?.entityViewers?.teams) {
      if (jsUtils.find(clonedFlowData.entityViewers.teams, { _id: id })) {
        jsUtils.remove(clonedFlowData.entityViewers.teams, { _id: id });
        if (clonedFlowData.entityViewers.teams?.length === 0) delete clonedFlowData.entityViewers.teams;
      }
    }

    if (clonedFlowData?.entityViewers?.users) {
      if (jsUtils.find(clonedFlowData.entityViewers.users, { _id: id })) {
        jsUtils.remove(clonedFlowData.entityViewers.users, { _id: id });
        if (clonedFlowData.entityViewers.users?.length === 0) delete clonedFlowData.entityViewers.users;
      }
    }

    if (jsUtils.has(clonedFlowData, ['error_list', 'entityViewers'], false)) {
      const viewersError = getInactivUserOrTeamsError(entityViewers, invalidEntityViewersError);
      if (!jsUtils.isEmpty(viewersError)) jsUtils.has(clonedFlowData, ['error_list', 'entityViewers'], viewersError);
      else delete clonedFlowData?.error_list?.entityViewers;
    }

    onFlowDataChange(clonedFlowData);
  };

  const setEntityViewerSearchValue = (event) => {
    set(clonedFlowData, 'entityViewerSearchValue', event.target.value);
    onFlowDataChange(clonedFlowData);
  };

  const onReassignedOwnersSelectHandler = (event) => {
    const team_or_user = event.target.value;
    clonedFlowData.reassignedOwnerSearchValue = EMPTY_STRING;
    clonedFlowData.selectedReassignedOwner = event.target.value;
    if (team_or_user?.email) {
      if (clonedFlowData?.reassignedOwners?.users) {
        if (
          !jsUtils.find(clonedFlowData?.reassignedOwners?.users, {
            _id: team_or_user._id,
          })
        ) clonedFlowData?.reassignedOwners?.users?.push(team_or_user);
      } else {
        set(clonedFlowData, ['reassignedOwners', 'users'], []);
        clonedFlowData?.reassignedOwners?.users?.push(team_or_user);
      }
    }
    if (team_or_user?.team_name) {
      if (clonedFlowData?.reassignedOwners?.teams) {
        if (
          !jsUtils.find(clonedFlowData?.reassignedOwners?.teams, {
            _id: team_or_user._id,
          })
        ) clonedFlowData?.reassignedOwners?.teams?.push(team_or_user);
      } else {
        set(clonedFlowData, ['reassignedOwners', 'teams'], []);
        clonedFlowData?.reassignedOwners?.teams?.push(team_or_user);
      }
    }
    if (jsUtils.has(clonedFlowData, ['error_list', 'reassignedOwners'], false)) {
      const reassignedOwnersError = getInactivUserOrTeamsError(clonedFlowData?.reassignedOwners, invalidOwnersError);
      if (!jsUtils.isEmpty(reassignedOwnersError)) jsUtils.has(clonedFlowData, ['error_list', 'reassignedOwners'], reassignedOwnersError);
      else delete clonedFlowData?.error_list?.reassignedOwners;
    }
    onFlowDataChange(clonedFlowData);
  };

  const onOwnersSelectHandler = (event) => {
    const team_or_user = event.target.value;
    clonedFlowData.ownerSearchValue = EMPTY_STRING;
    clonedFlowData.selectedOwner = event.target.value;
    if (team_or_user?.email) {
      if (clonedFlowData?.owners?.users) {
        if (
          !jsUtils.find(clonedFlowData?.owners?.users, {
            _id: team_or_user._id,
          })
        ) clonedFlowData?.owners?.users?.push(team_or_user);
      } else {
        clonedFlowData.owners = {};
        clonedFlowData.owners.users = [];
        clonedFlowData?.owners?.users?.push(team_or_user);
      }
    }
    if (jsUtils.has(clonedFlowData, ['error_list', 'owners'], false)) {
      const ownersError = getInactivUserOrTeamsError(clonedFlowData?.owners, invalidAdminsError);
      if (!jsUtils.isEmpty(ownersError)) jsUtils.has(clonedFlowData, ['error_list', 'owners'], ownersError);
      else delete clonedFlowData?.error_list?.owners;
    }
    onReassignedOwnersSelectHandler(event);
    onFlowDataChange(clonedFlowData);
  };

  const onOwnersRemoveHandler = (id) => {
    if (clonedFlowData.owners.teams) {
      if (jsUtils.find(clonedFlowData.owners.teams, { _id: id })) {
        jsUtils.remove(clonedFlowData.owners.teams, { _id: id });
        if (clonedFlowData.owners.teams.length === 0) delete clonedFlowData.owners.teams;
      }
    }
    if (clonedFlowData.owners.users) {
      if (jsUtils.find(clonedFlowData.owners.users, { _id: id })) {
        jsUtils.remove(clonedFlowData.owners.users, { _id: id });
        if (clonedFlowData.owners.users.length === 0) delete clonedFlowData.owners.users;
      }
    }
    if (jsUtils.has(clonedFlowData, ['error_list', 'owners'], false)) {
      const ownersError = getInactivUserOrTeamsError(clonedFlowData?.owners, invalidAdminsError);
      if (!jsUtils.isEmpty(ownersError)) jsUtils.has(clonedFlowData, ['error_list', 'owners'], ownersError);
      else delete clonedFlowData?.error_list?.owners;
    }
    onFlowDataChange(clonedFlowData);
  };

  const onReassignedOwnersRemoveHandler = (id) => {
    if (clonedFlowData.reassignedOwners.teams) {
      if (jsUtils.find(clonedFlowData.reassignedOwners.teams, { _id: id })) {
        jsUtils.remove(clonedFlowData.reassignedOwners.teams, { _id: id });
        if (clonedFlowData.reassignedOwners.teams.length === 0) delete clonedFlowData.reassignedOwners.teams;
      }
    }
    if (clonedFlowData.reassignedOwners.users) {
      if (jsUtils.find(clonedFlowData.reassignedOwners.users, { _id: id })) {
        jsUtils.remove(clonedFlowData.reassignedOwners.users, { _id: id });
        if (clonedFlowData.reassignedOwners.users.length === 0) delete clonedFlowData.reassignedOwners.users;
      }
    }
    if (jsUtils.has(clonedFlowData, ['error_list', 'reassignedOwners'], false)) {
      const reassignedOwnersError = getInactivUserOrTeamsError(clonedFlowData?.reassignedOwners, invalidOwnersError);
      if (!jsUtils.isEmpty(reassignedOwnersError)) jsUtils.has(clonedFlowData, ['error_list', 'reassignedOwners'], reassignedOwnersError);
      else delete clonedFlowData?.error_list?.reassignedOwners;
    }
    onFlowDataChange(clonedFlowData);
  };

  const setOwnersSearchValue = (event) => {
    const flow_data = cloneDeep(store.getState().EditFlowReducer.flowData);
    flow_data.ownerSearchValue = event.target.value;
    onFlowDataChange(flow_data);
  };

  const setReassignedOwnersSearchValue = (event) => {
    const flow_data = cloneDeep(store.getState().EditFlowReducer.flowData);
    flow_data.reassignedOwnerSearchValue = event.target.value;
    onFlowDataChange(flow_data);
  };

  const getFields = (customParams = {}) => {
    const params = {
      page: 1,
      size: USER_FIELD_POLICY_CONSTANTS.FIELDS_PAGE_SIZE,
      allowed_field_types: [FIELD_TYPE.USER_TEAM_PICKER],
      flow_id: flowData?.flow_id,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      ...customParams,
    };

    onGetAllFieldsByFilter(
      params,
      EMPTY_STRING,
      null,
      false,
      USER_FIELD_POLICY_CONSTANTS.FIELDS_LIST,
    );
  };

  const onLoadMoreFields = (customParams) => {
    getFields(customParams);
  };

  useEffect(() => {
    getFields();
    if (!clonedFlowData.isEditFlowView) {
      const userProfile = getUserProfileData();
      onOwnersSelectHandler({
        target: {
          value: {
            _id: userProfile.id,
            username: userProfile.user_name,
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            email: userProfile.email,
            profile_pic: userProfile.profile_pic,
            is_user: true,
            isDeleteDisabled: true,
          },
        },
      });
      onReassignedOwnersSelectHandler({
        target: {
          value: {
            _id: userProfile.id,
            username: userProfile.user_name,
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            email: userProfile.email,
            profile_pic: userProfile.profile_pic,
            is_user: true,
            isDeleteDisabled: false,
          },
        },
      });
    }
  }, []);

  useEffect(() => {
    const clonedFlowData = cloneDeep(flowData);
    const { error_list = {} } = clonedFlowData;
    onFlowDataChange({
      error_list: {
        ...error_list,
        reassignedOwners: getInactivUserOrTeamsError(clonedFlowData.reassignedOwners, invalidOwnersError),
        owners: getInactivUserOrTeamsError(clonedFlowData.owners, invalidAdminsError),
        viewers: getInactivUserOrTeamsError(clonedFlowData.additional_viewers, invalidViewersError),
        entityViewers: getInactivUserOrTeamsError(clonedFlowData.entityViewers, invalidEntityViewersError),
      },
    });
  }, [invalidOwnersError, invalidAdminsError, invalidViewersError, invalidEntityViewersError]);

  // useEffect(() => {
  //   if (initialRenderState) {
  //     setInitialRenderState(false);
  //   } else {
  //   const ownerUsers = clonedFlowData?.owners?.users || [];
  //   const ownerTeams = clonedFlowData?.owners?.teams || [];
  //   const reassignedUsers = clonedFlowData?.reassignedOwners?.users || [];
  //   const reassignedTeams = clonedFlowData?.reassignedOwners?.teams || [];

  //   let users = [...ownerUsers, ...reassignedUsers];
  //   let teams = [...ownerTeams, ...reassignedTeams];
  //   users = users.filter((value, index, self) => index === self.findIndex((user) => (user._id === value._id)));
  //   teams = teams.filter((value, index, self) => index === self.findIndex((team) => (team._id === value._id)));
  //   onFlowDataChange({ reassignedOwners: { users, teams } });
  //   }
  // }, [owners.length]);

  const getUserOwners = (users) => users.map((eachOwner) => {
    return {
      ...eachOwner,
      isDeleteDisabled: isCurrentUser(eachOwner),
    };
  });

  const getUserReassignedOwners = (users) => users.map((eachOwner) => {
    return {
      ...eachOwner,
      isDeleteDisabled: false,
    };
  });

  const getFlowOwnersData = () => {
    if (jsUtils.isEmpty(owners)) return [];
    if (Array.isArray(owners)) {
      return getUserOwners(owners);
    }
    return {
      ...owners,
      users: getUserOwners(owners.users),
    };
  };

  const getReassignedFlowOwnersData = () => {
    if (jsUtils.isEmpty(reassignedOwners)) return [];
    if (Array.isArray(reassignedOwners)) {
      return getUserReassignedOwners(reassignedOwners);
    }
    return {
      ...reassignedOwners,
      users: getUserReassignedOwners(reassignedOwners.users),
    };
  };

  return (
    <>
      <div className={BS.W50}>
        <AddMembers
          label={SECURITY_SETTINGS_STRINGS.FLOW_ADMINS.LABEL}
          onUserSelectHandler={onOwnersSelectHandler}
          selectedData={getFlowOwnersData()}
          removeSelectedUser={onOwnersRemoveHandler}
          errorText={clonedFlowData.error_list.owners}
          innerClassName={styles.SecurityContainer}
          selectedSuggestionData={clonedFlowData.selectedOwner}
          memberSearchValue={clonedFlowData.ownerSearchValue}
          setMemberSearchValue={setOwnersSearchValue}
          isActive
          apiParams={apiParamsForSecurity}
          id="additional_owners"
          lastSignin
          customClass={styles.AssignTo}
          showTagTitle
          helperMessageClassName={styles.AdminFieldHelperClass}
        />
        <AddMembers
          label={SECURITY_SETTINGS_STRINGS.FLOW_OWNERS.LABEL}
          onUserSelectHandler={onReassignedOwnersSelectHandler}
          selectedData={getReassignedFlowOwnersData()}
          innerClassName={styles.SecurityContainer}
          removeSelectedUser={onReassignedOwnersRemoveHandler}
          errorText={clonedFlowData?.error_list?.reassignedOwners}
          selectedSuggestionData={clonedFlowData.selectedReassignedOwner}
          memberSearchValue={clonedFlowData.reassignedOwnerSearchValue}
          setMemberSearchValue={setReassignedOwnersSearchValue}
          isActive
          id="additional_reassign_owners"
          customClass={styles.AssignTo}
          showTagTitle
          helperMessageClassName={styles.AdminFieldHelperClass}
          getTeamsAndUsers
          isRequired
          apiParams={NON_PRIVATE_TEAMS_PARAMS}
        />
        <RadioGroup
          label={t(READ_ONLY_ACCESS_CONFIRMATION.LABEL)}
          type={RADIO_GROUP_TYPE.TYPE_8}
          optionList={READ_ONLY_ACCESS_CONFIRMATION.OPTION_LIST(t)}
          onClick={(is_participants_level_security) => {
            if (!isNull(is_participants_level_security)) onOpenVisibilityChangeHandler(is_participants_level_security);
          }}
          selectedValue={clonedFlowData.is_participants_level_security}
          hideMessage
          radioButtonClasses={styles.FormFieldRadio}
          radioSelectedStyle={styles.RadioSelectedStyle}
        />
      </div>
      <DataAccess
        flowId={flowData?.flow_id}
        moduleId={flowData?.flow_id}
        moduleType={MODULE_TYPES.FLOW}
        policyList={flowData?.policyList || []}
        policyListHasValidation={flowData?.policyListHasValidation}
        onDataChange={onFlowDataChange}
        onPolicyConditionUpdate={onPolicyConditionUpdate}
        isRowSecurityEnabled={flowData?.is_row_security_policy}
        userFieldOptionList={userFieldsList}
        userFieldPaginationData={userFieldsListpaginationData}
        userFieldPolicyErrorList={userFieldPolicyErrorList}
        securityPolicyErrorList={securityPolicyErrorList}
        errorList={clonedFlowData.error_list}
        onLoadMoreFields={onLoadMoreFields}
        isUserFieldsLoading={lstAllFieldsLoading}
        onEntityViewerSelectHandler={onEntityViewerSelectHandler}
        entityViewerSelectedData={modifiedEntityViewers}
        onRemoveEntityViewer={onRemoveEntityViewer}
        entityViewerSuggestionData={entityViewerSuggestionData}
        entityViewerSearchValue={entityViewerSearchValue}
        setEntityViewerSearchValue={setEntityViewerSearchValue}
      />
      <div className={BS.W50}>
        <AddMembers
          className={cx(gClasses.MT15)}
          label={t(ACTORS_TEAMS_SUGGESTION.LABEL)}
          onUserSelectHandler={onAdditionalViewersSelectHandler}
          selectedData={additional_viewers}
          innerClassName={styles.SecurityContainer}
          removeSelectedUser={onAdditionalViewersRemoveHandler}
          errorText={clonedFlowData.error_list.viewers}
          selectedSuggestionData={clonedFlowData.selectedAdditionalViewer}
          memberSearchValue={clonedFlowData.addtionalViewersSearchValue}
          setMemberSearchValue={setAddtionalViewersearchValue}
          getTeamsAndUsers
          isActive
          id="read_only_users"
          showTagTitle
          customClass={styles.AssignTo}
          apiParams={NON_PRIVATE_TEAMS_PARAMS}
        />
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFlowDataChange: (flowData) => {
      dispatch(updateFlowDataChange(flowData));
    },
    onPolicyConditionUpdate: (policyUUID, expression, action) => dispatch(updatePolicyConditon({ policyUUID, expression, action })),
    onGetAllFieldsByFilter: (...params) => dispatch(getAllFieldsByFilter(...params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Security);
Security.defaultProps = {};
Security.propTypes = {};
