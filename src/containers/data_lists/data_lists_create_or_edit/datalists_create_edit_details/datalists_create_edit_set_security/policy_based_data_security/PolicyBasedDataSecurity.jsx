import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import DataAccess from '../../../../../edit_flow/security/data_access/DataAccess';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { MODULE_TYPES } from '../../../../../../utils/Constants';
// import { POLICY_LIST } from '../../../DatalistsCreateEdit.mockdata';
import { USER_FIELD_POLICY_CONSTANTS } from '../../../../../edit_flow/security/user_field_policy/UserFieldPolicy.constants';
import { FIELD_TYPE } from '../../../../../../utils/constants/form_fields.constant';
import jsUtils, { cloneDeep, has, isEmpty } from '../../../../../../utils/jsUtility';
import { getAllFieldsDataList } from '../../../../../../redux/actions/CreateDataList.action';
import { FIELD_LIST_TYPE } from '../../../../../../utils/constants/form.constant';
import { unionUsersAndTeams } from '../../../../../../utils/UtilityFunctions';

let cancelToken = null;
const getCancelToken = (token) => {
    cancelToken = token;
};

function PolicyBasedDataSecurity(props) {
    const {
        dataListID,
        onGetAllFieldsByFilter,
        security,
        userFieldsList,
        userFieldsListpaginationData,
        lstAllFieldsLoading,
        securityData,
        setSecurityData,
        errorList,
        onUserSelectHandler,
        onUserRemoveHandler,
    } = props;

    const [entityViewerSearchValue, setEntityViewerSearchValue] = useState('');

    const setPolicyData = (value) => {
      const clonedSecurity = { ...securityData };
      if (has(value, ['policyUUID'])) {
        const updatedPolicies = clonedSecurity.security_policies.map((p) => {
          const _policy = { ...p };
          if (_policy.policy_uuid === value.policyUUID) {
            _policy.policy = value.expression;
          }
          return _policy;
        });
        clonedSecurity.security_policies = updatedPolicies;
      }
      if (has(value, ['policyList'])) clonedSecurity.security_policies = value.policyList;
      if (has(value, ['is_row_security_policy'])) clonedSecurity.isRowSecurityPolicy = value.is_row_security_policy;
      if (has(value, ['entityViewers'])) clonedSecurity.entityViewers = value.entityViewers;
      setSecurityData(clonedSecurity);
    };

    const getFields = (customParams = {}) => {
        const params = {
          page: 1,
          size: USER_FIELD_POLICY_CONSTANTS.FIELDS_PAGE_SIZE,
          allowed_field_types: [FIELD_TYPE.USER_TEAM_PICKER],
          data_list_id: dataListID,
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

    const onLoadMoreUserSelectorFields = (customParams) => {
        getFields(customParams);
    };

    useEffect(() => {
        getFields();
      }, []);

      const userOrTeamAddHandler = (event = {}) => {
        const { target: { value } = {} } = event;
        const entityViewers = cloneDeep(securityData.entityViewers || { users: [], teams: [] });
        if (value?.email) {
          if (entityViewers.users) {
            if (
              !jsUtils.find(entityViewers.users, {
                _id: value._id,
              })
            ) entityViewers.users.push(value);
          } else {
            entityViewers.users = [];
            entityViewers.users.push(value);
          }
        } else if (!value.is_user) {
          if (entityViewers.teams) {
            if (
              !jsUtils.find(entityViewers.teams, {
                _id: value._id,
              })
            ) entityViewers.teams.push(value);
          } else {
            entityViewers.teams = [];
            entityViewers.teams.push(value);
          }
        }
        setEntityViewerSearchValue('');
        setPolicyData({ entityViewers });
    };

    const userOrTeamRemoveHandler = (userOrTeamId) => {
      const entityViewers = cloneDeep(securityData.entityViewers || { users: [], teams: [] });
      if (entityViewers.teams) {
          if (jsUtils.find(entityViewers.teams, { _id: userOrTeamId })) {
          jsUtils.remove(entityViewers.teams, { _id: userOrTeamId });
          if (entityViewers.teams.length === 0) delete entityViewers.teams;
          }
      }
      if (entityViewers.users) {
          if (jsUtils.find(entityViewers.users, { _id: userOrTeamId })) {
          jsUtils.remove(entityViewers.users, { _id: userOrTeamId });
          if (entityViewers.users.length === 0) delete entityViewers.users;
          }
      }
      setPolicyData({ entityViewers });
  };

    const onPolicyConditionUpdate = (policyUUID, expression, action) => {
      setPolicyData({ policyUUID, expression, action });
    };

    console.log('errzx', props);

    return (
        <DataAccess
            moduleId={dataListID}
            moduleType={MODULE_TYPES.DATA_LIST}
            policyList={securityData.security_policies}
            policyListHasValidation={errorList?.isAnyPolicyHasValidation}
            onDataChange={setPolicyData}
            onPolicyConditionUpdate={onPolicyConditionUpdate}
            isRowSecurityEnabled={securityData.isRowSecurityPolicy}
            userFieldOptionList={userFieldsList}
            userFieldPaginationData={userFieldsListpaginationData}
            userFieldPolicyErrorList={errorList?.userFieldPolicyErrorList}
            securityPolicyErrorList={errorList?.commonErrorList}
            onLoadMoreFields={onLoadMoreUserSelectorFields}
            errorList={errorList}
            isUserFieldsLoading={lstAllFieldsLoading}
            onEntityViewerSelectHandler={(event) => userOrTeamAddHandler(event)}
            entityViewerSelectedData={unionUsersAndTeams(securityData.entityViewers)}
            onRemoveEntityViewer={(userOrTeamId) => userOrTeamRemoveHandler(userOrTeamId)}
            entityViewerSuggestionData={security?.selectedEntityViewer}
            entityViewerSearchValue={entityViewerSearchValue}
            setEntityViewerSearchValue={(e) => setEntityViewerSearchValue(e.target.value)}
            onUserSelectHandler={onUserSelectHandler}
            onUserRemoveHandler={onUserRemoveHandler}
        />
    );
}

const mapStateToProps = (state) => {
    return {
      security: state.CreateDataListReducer.security,
      userFieldsList: state.CreateDataListReducer.userFieldsList,
      userFieldsListpaginationData: state.CreateDataListReducer.lstPaginationData,
      lstAllFieldsLoading: state.CreateDataListReducer.loadinguserFieldsList,
    };
  };

const mapDispatchToProps = (dispatch) => {
    return {
    onGetAllFieldsByFilter: (params, currentFieldUuid, setStateKey, mapping, fieldListDropdownType, tableUuid, getCancelToken) => {
        dispatch(getAllFieldsDataList(params, currentFieldUuid, setStateKey, mapping, fieldListDropdownType, tableUuid, getCancelToken));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolicyBasedDataSecurity);
