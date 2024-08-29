import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { BS } from 'utils/UIConstants';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from './Security.module.scss';
import { createDataListSetState, dataListStateChangeAction, updatePolicyConditon } from '../../../../redux/reducer/CreateDataListReducer';
import { getUserProfileData, unionUsersAndTeams } from '../../../../utils/UtilityFunctions';
import AddMembers from '../../../../components/member_list/add_members/AddMembers';
import RadioGroup, { RADIO_GROUP_TYPE } from '../../../../components/form_components/radio_group/RadioGroup';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { isCurrentUser } from '../../../../utils/userUtils';
import jsUtils, { isEmpty, isNull } from '../../../../utils/jsUtility';
import { CREATE_DATA_LIST_STRINGS } from '../CreateDataList.strings';
import { NON_PRIVATE_TEAMS_PARAMS } from '../../../edit_flow/EditFlow.utils';
import { store } from '../../../../Store';
import DataAccess from '../../../edit_flow/security/data_access/DataAccess';
import { MODULE_TYPES } from '../../../../utils/Constants';
import { getAllFieldsDataList } from '../../../../redux/actions/CreateDataList.action';
import { USER_FIELD_POLICY_CONSTANTS } from '../../../edit_flow/security/user_field_policy/UserFieldPolicy.constants';
import { FIELD_TYPE } from '../../../../utils/constants/form_fields.constant';
import { FIELD_LIST_TYPE } from '../../../../utils/constants/form.constant';
import DatalistUserSystem from '../../../data_lists/data_list_landing/datalist_details/datalist_user_system_action/DatalistUserSystems';

let cancelToken = null;
const getCancelToken = (token) => {
  cancelToken = token;
};

function Security(props) {
  const {
    security: { owners: owners_, reassignedOwners: reassignedOwners_, entry_adders, viewers, entityViewers }, security,
    onDataListStateChange, error_list, datalistDetails, datalistStateChange, onPolicyConditionUpdate,
    onGetAllFieldsByFilter } = props;
    const { userFieldsList, userFieldsListpaginationData, userFieldPolicyErrorList,
      securityPolicyErrorList, lstAllFieldsLoading } = datalistDetails;
  const { t } = useTranslation();
  const { SECURITY } = CREATE_DATA_LIST_STRINGS(t);
  const [errorList, setErrorList] = useState();

  const getFields = (customParams = {}) => {
    console.log('check fields here');
    const params = {
      page: 1,
      size: USER_FIELD_POLICY_CONSTANTS.FIELDS_PAGE_SIZE,
      allowed_field_types: [FIELD_TYPE.USER_TEAM_PICKER],
      data_list_id: datalistDetails?.data_list_id,
      ...customParams,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
    };
    if (isEmpty(userFieldsList)) {
      if (cancelToken) cancelToken();
    }
    onGetAllFieldsByFilter(
      params,
      EMPTY_STRING,
      USER_FIELD_POLICY_CONSTANTS.FIELDS_LIST,
      [],
      false,
      EMPTY_STRING,
      EMPTY_STRING,
      getCancelToken,
    );
  };

  const owners = unionUsersAndTeams(owners_);
  const reassignedOwners = unionUsersAndTeams(reassignedOwners_);
  const apiParamsForSecurity = {
    user_types: [1, 3],
  };
  const apiParamsForOwnersSecurity = {
    user_types: [1, 2, 3],
  };
  const setValueInSecurity = (id, value) => {
    const { security } = props;
    if (id) onDataListStateChange({ ...security, [id]: value }, 'security');
  };

  const userOrTeamRemoveHandler = (key, userOrTeamId) => {
    const { security } = props;
    const security_ = jsUtils.cloneDeep(security);
    if (security_[key].teams) {
      if (jsUtils.find(security_[key].teams, { _id: userOrTeamId })) {
        jsUtils.remove(security_[key].teams, { _id: userOrTeamId });
        if (security_[key].teams.length === 0) delete security_[key].teams;
      }
    }
    if (security_[key]?.users) {
      if (jsUtils.find(security_[key].users, { _id: userOrTeamId })) {
        jsUtils.remove(security_[key].users, { _id: userOrTeamId });
        if (security_[key].users.length === 0) delete security_[key].users;
      }
    }
    onDataListStateChange(security_, 'security');
  };

  const userOrTeamAddHandler = (searchValueKey, selectedUserOrTeamKey, key, event = {}, securityKey) => {
    const { target: { value } = {} } = event;
    let securityValue = null;
    const { security } = jsUtils.cloneDeep(store.getState().CreateDataListReducer);
    if (!isEmpty(securityKey)) securityValue = securityKey;
    else securityValue = security;
    const security_ = jsUtils.cloneDeep(securityValue);
    const team_or_user = event.target.value;
    security_[searchValueKey] = EMPTY_STRING;
    security_[selectedUserOrTeamKey] = value;
    if (team_or_user?.email) {
      if (security_[key]?.users) {
        if (
          !jsUtils.find(security_[key].users, {
            _id: team_or_user._id,
          })
        ) security_[key].users.push(team_or_user);
      } else {
        security_[key].users = [];
        security_[key]?.users.push(team_or_user);
      }
    } else if (!team_or_user.is_user) {
      if (security_[key].teams) {
        if (
          !jsUtils.find(security_[key].teams, {
            _id: team_or_user._id,
          })
        ) security_[key].teams.push(team_or_user);
      } else {
        security_[key].teams = [];
        security_[key].teams.push(team_or_user);
      }
    }
    onDataListStateChange(jsUtils.cloneDeep(security_), 'security');
    if (key === 'owners') userOrTeamAddHandler('reassignedOwnerSearchValue', 'selectedReassignedOwner', 'reassignedOwners', event, security_);
  };

  const getUserOwners = (users) => users.map((eachOwner) => {
    return {
      ...eachOwner,
      isDeleteDisabled: isCurrentUser(eachOwner),
    };
  });

  const getReassignedUserOwners = (users) => users.map((eachOwner) => {
    return {
      ...eachOwner,
      isDeleteDisabled: false,
    };
  });

  const getDataListOwnersData = () => {
    if (jsUtils.isEmpty(owners)) return [];
    if (Array.isArray(owners)) {
      return getUserOwners(owners);
    }
    return {
      ...owners,
      users: getUserOwners(owners.users),
    };
  };

  const getDataListReassignedOwnersData = () => {
    if (jsUtils.isEmpty(reassignedOwners)) return [];
    if (Array.isArray(reassignedOwners)) {
      return getReassignedUserOwners(reassignedOwners);
    }
    return {
      ...reassignedOwners,
      users: getReassignedUserOwners(reassignedOwners.users),
    };
  };

  useEffect(() => {
    if (!isEmpty(error_list)) setErrorList(error_list);
  }, [error_list]);

  useEffect(() => {
    getFields();
    const userProfile = getUserProfileData();
    userOrTeamAddHandler('ownerSearchValue', 'selectedOwner', 'owners', {
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
    userOrTeamAddHandler('reassignedOwnerSearchValue', 'selectedReassignedOwner', 'reassignedOwners', {
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
  }, []);

  const onLoadMoreUserSelectorFields = (customParams) => {
    getFields(customParams);
  };

  // useEffect(() => {
  //   console.log('ereree45545656568ireass', reassignedOwners);
  //   const { security } = props;
  //   const security_ = jsUtils.cloneDeep(security);
  //   let reassignedMembers = {};
  //   const ownerUsers = security.owners?.users || [];
  //   const ownerTeams = security.owners?.teams || [];
  //   const reassignedUsers = reassignedOwners?.users || [];
  //   const reassignedTeams = reassignedOwners?.teams || [];

  //   let users = [...ownerUsers, ...reassignedUsers];
  //   let teams = [...ownerTeams, ...reassignedTeams];
  //   users = users.filter((value, index, self) => index === self.findIndex((user) => (user._id === value._id)));
  //   teams = teams.filter((value, index, self) => index === self.findIndex((team) => (team._id === value._id)));
  //     console.log('ereree45545656568i', users, 'teams', teams);
  //     // onDataListStateChange({ reassignedOwners: { users, teams } });
  //     reassignedMembers = { users, teams };
  //     set(security_, 'reassignedOwners', reassignedMembers);
  //     onDataListStateChange(security_, 'security');
  //   console.log('ereree4554', security.owners);
  // }, [security.owners?.users?.length || security.owners?.teams?.length]);

  const setEntityViewerSearchValue = (event = {}) => {
    const { target: { value } = {} } = event;
    setValueInSecurity('entityViewerSearchValue', value);
  };

  return (
    <>
      <div className={BS.W50}>
        <AddMembers
          className={cx(gClasses.MT15)}
          label={SECURITY.DATALIST_ADMINS.LABEL}
          innerClassName={styles.SecurityContainer}
          onUserSelectHandler={(event) => userOrTeamAddHandler('ownerSearchValue', 'selectedOwner', 'owners', event)}
          selectedData={getDataListOwnersData()}
          removeSelectedUser={(userOrTeamId) => userOrTeamRemoveHandler('owners', userOrTeamId)}
          selectedSuggestionData={security.selectedOwner}
          memberSearchValue={security.ownerSearchValue}
          setMemberSearchValue={(event = {}) => {
            const { target: { value } = {} } = event;
            setValueInSecurity('ownerSearchValue', value);
          }}
          isActive
          apiParams={apiParamsForSecurity}
          lastSignin
          customClass={styles.AssignTo}
          errorText={errorList?.owners}
          helperMessageClassName={styles.AdminFieldHelperClass}
        />
        <AddMembers
          className={cx(gClasses.MT15)}
          label={SECURITY.DATALIST_OWNERS.LABEL}
          innerClassName={styles.SecurityContainer}
          onUserSelectHandler={(event) => userOrTeamAddHandler('reassignedOwnerSearchValue', 'selectedReassignedOwner', 'reassignedOwners', event)}
          selectedData={getDataListReassignedOwnersData()}
          removeSelectedUser={(userOrTeamId) => userOrTeamRemoveHandler('reassignedOwners', userOrTeamId)}
          selectedSuggestionData={security.selectedReassignedOwner}
          memberSearchValue={security.reassignedOwnerSearchValue}
          setMemberSearchValue={(event = {}) => {
            const { target: { value } = {} } = event;
            setValueInSecurity('reassignedOwnerSearchValue', value);
          }}
          isActive
          apiParams={apiParamsForOwnersSecurity}
          lastSignin
          customClass={styles.AssignTo}
          errorText={errorList?.reassignedOwners}
          helperMessageClassName={styles.AdminFieldHelperClass}
          isRequired
        />
        <AddMembers
          label={SECURITY.DATALIST_UPDATERS.LABEL}
          className={cx(gClasses.MT15)}
          innerClassName={styles.SecurityContainer}
          onUserSelectHandler={(event) => userOrTeamAddHandler('updaterSearchValue', 'selectedUpdater', 'entry_adders', event)}
          selectedData={unionUsersAndTeams(entry_adders)}
          removeSelectedUser={(userOrTeamId) => userOrTeamRemoveHandler('entry_adders', userOrTeamId)}
          selectedSuggestionData={security.selectedUpdater}
          memberSearchValue={security.updaterSearchValue}
          setMemberSearchValue={(event = {}) => {
            const { target: { value } = {} } = event;
            setValueInSecurity('updaterSearchValue', value);
          }}
          getTeamsAndUsers
          isActive
          isRequired
          errorText={errorList?.entry_adders}
          customClass={styles.AssignTo}
          apiParams={NON_PRIVATE_TEAMS_PARAMS}
        />
        <RadioGroup
          label={SECURITY.DATA_SECURITY.LABEL}
          className={gClasses.MT15}
          type={RADIO_GROUP_TYPE.TYPE_8}
          optionList={SECURITY.DATA_SECURITY.OPTION_LIST}
          onClick={(value) => {
            if (!isNull(value)) setValueInSecurity('is_participants_level_security', value);
          }}
          selectedValue={security.is_participants_level_security}
          radioButtonClasses={styles.FormFieldRadio}
          radioSelectedStyle={styles.RadioSelectedStyle}
        />
      </div>
      <DataAccess
        moduleId={datalistDetails?.data_list_id}
        moduleType={MODULE_TYPES.DATA_LIST}
        policyList={datalistDetails?.policyList || []}
        policyListHasValidation={datalistDetails?.policyListHasValidation}
        onDataChange={datalistStateChange}
        onPolicyConditionUpdate={onPolicyConditionUpdate}
        isRowSecurityEnabled={datalistDetails?.is_row_security_policy}
        userFieldOptionList={userFieldsList}
        userFieldPaginationData={userFieldsListpaginationData}
        userFieldPolicyErrorList={userFieldPolicyErrorList}
        securityPolicyErrorList={securityPolicyErrorList}
        onLoadMoreFields={onLoadMoreUserSelectorFields}
        isUserFieldsLoading={lstAllFieldsLoading}
        errorList={errorList}
        onEntityViewerSelectHandler={(event) => userOrTeamAddHandler('entityViewerSearchValue', 'selectedEntityViewer', 'entityViewers', event)}
        entityViewerSelectedData={unionUsersAndTeams(entityViewers)}
        onRemoveEntityViewer={(userOrTeamId) => userOrTeamRemoveHandler('entityViewers', userOrTeamId)}
        entityViewerSuggestionData={security?.selectedEntityViewer}
        entityViewerSearchValue={security?.entityViewerSearchValue}
        setEntityViewerSearchValue={setEntityViewerSearchValue}
      />
      {console.log('fdsagasgas', viewers, security.selectedViewer)}
      <div className={cx(BS.W50, gClasses.MB16)}>
        <AddMembers
          label={SECURITY.DATALIST_VIEWERS.LABEL}
          className={gClasses.MT15}
          innerClassName={styles.SecurityContainer}
          onUserSelectHandler={(event) => userOrTeamAddHandler('viewerSearchValue', 'selectedViewer', 'viewers', event)}
          selectedData={unionUsersAndTeams(viewers)}
          removeSelectedUser={(userOrTeamId) => userOrTeamRemoveHandler('viewers', userOrTeamId)}
          selectedSuggestionData={security.selectedViewer}
          memberSearchValue={security.viewerSearchValue}
          setMemberSearchValue={(event = {}) => {
            const { target: { value } = {} } = event;
            setValueInSecurity('viewerSearchValue', value);
          }}
          errorText={errorList?.viewers}
          getTeamsAndUsers
          isActive
          customClass={styles.AssignTo}
          apiParams={NON_PRIVATE_TEAMS_PARAMS}
        />
      </div>
      <DatalistUserSystem
        metaData={{ dataListId: datalistDetails.data_list_id, dataListUUID: datalistDetails.data_list_uuid }}
      />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    security: state.CreateDataListReducer.security,
    error_list: state.CreateDataListReducer.error_list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDataListStateChange: (data, id) => {
      dispatch(dataListStateChangeAction(data, id));
    },
    datalistStateChange: (data) => {
      dispatch(createDataListSetState(data));
    },
    onPolicyConditionUpdate: (policyUUID, expression, action) => dispatch(updatePolicyConditon({ policyUUID, expression, action })),
    onGetAllFieldsByFilter: (params, currentFieldUuid, setStateKey, mapping, fieldListDropdownType, tableUuid, getCancelToken) => {
      dispatch(getAllFieldsDataList(params, currentFieldUuid, setStateKey, mapping, fieldListDropdownType, tableUuid, getCancelToken));
    },

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Security);
