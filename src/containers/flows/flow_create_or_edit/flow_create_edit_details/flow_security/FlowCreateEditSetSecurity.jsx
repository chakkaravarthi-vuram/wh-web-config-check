import {
  EPopperPlacements,
    ETitleSize,
    Label,
    RadioGroup,
    Text,
    Title,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { useSelector } from 'react-redux';
import UserPicker from '../../../../../components/user_picker/UserPicker';
import styles from '../../FlowCreateOrEdit.module.scss';
import { FLOW_CREATE_EDIT_CONSTANTS, FLOW_SECURITY_CONSTANTS } from '../../FlowCreateOrEdit.constant';
import PolicyBasedDataSecurity from './policy_based_data_security/PolicyBasedDataSecurity';
import { FLOW_ACTIONS } from '../../../useFlow';
import { getFlowSecurityInfoApi } from '../../../../../axios/apiService/flow.apiService';
import { somethingWentWrongErrorToast, setLoaderAndPointerEvent, CancelToken } from '../../../../../utils/UtilityFunctions';
import { has } from '../../../../../utils/jsUtility';
import { deconstructFlowSecurityData } from './FlowCreateEditSecurity.utils';
import { TEAM_TYPES_PARAMS, USER_TYPES_PARAMS } from '../../../../../utils/Constants';
import { filterCurrentUser } from '../../../../data_lists/data_lists_create_or_edit/DatalistsCreateEdit.utils';

function FlowCreateEditSetSecurity(props) {
  const { security, dispatch, metaData } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const errorList = security.errorList || {};
  const FLOW_SECURITY = FLOW_SECURITY_CONSTANTS(t);
  const currentLoggedInUser = useSelector((state) => state.RoleReducer.user_id);

  const adminsCancelToken = new CancelToken();
  const ownersCancelToken = new CancelToken();
  const initiatorsCancelToken = new CancelToken();
  const viewersCancelToken = new CancelToken();

  console.log('security', security);

  useEffect(() => {
    setLoaderAndPointerEvent(true);
    const params = { flow_id: metaData.flowId };
    getFlowSecurityInfoApi(params).then((data) => {
      const _security = deconstructFlowSecurityData(data);
      const securityDataWithErrorList = {
        ..._security,
        errorList: errorList || {},
      };
      console.log('xyz security', securityDataWithErrorList);
      dispatch(FLOW_ACTIONS.SET_SECURITY, securityDataWithErrorList);
    }).catch((err) => {
      console.log('xyz security ERROR', err);
      somethingWentWrongErrorToast();
    }).finally(() => {
      setLoaderAndPointerEvent(false);
      setLoading(false);
    });

    return () => dispatch(FLOW_ACTIONS.SET_SECURITY, {});
  }, []);

  const {
    NO_DATA_FOUND,
  } = FLOW_CREATE_EDIT_CONSTANTS(t);

  // comments - refactor this function
  const onChange = (id, value, options = {}) => {
    const cloneSecurity = { ...security };
    switch (id) {
      case FLOW_SECURITY.ADMINS:
      case FLOW_SECURITY.OWNERS:
      case FLOW_SECURITY.VIEWERS:
      case FLOW_SECURITY.ENTITY_VIEWERS:
      case FLOW_SECURITY.INITIATORS:
        const { removeUser } = options;
        const _value = cloneSecurity[id] || { users: [], teams: [] };
        _value.users = cloneSecurity[id]?.users || [];
        _value.teams = cloneSecurity[id]?.teams || [];
        if (removeUser) {
          _value.users = _value.users?.filter((u) => u._id !== value) || [];
          _value.teams = _value.teams?.filter((u) => u._id !== value) || [];
          cloneSecurity[id] = _value;
        } else {
          const isUser = value?.is_user;
          isUser
            ? (_value.users = [..._value.users, value])
            : (_value.teams = [..._value.teams, value]);
          cloneSecurity[id] = _value;
        }
        break;
      case FLOW_SECURITY.POLICY:
        if (has(value, ['policyUUID'])) {
          const updatedPolicies = cloneSecurity.securityPolicies.map((p) => {
            const _policy = { ...p };
            if (_policy.policy_uuid === value.policyUUID) {
              _policy.policy = value.expression;
            }
            return _policy;
          });
          cloneSecurity.securityPolicies = updatedPolicies;
        }
        if (has(value, ['policyList'])) cloneSecurity.securityPolicies = value.policyList;
        if (has(value, ['is_row_security_policy'])) cloneSecurity.isRowSecurityPolicy = value.is_row_security_policy;
        if (has(value, ['entityViewers'])) cloneSecurity.entityViewers = value.entityViewers;
        break;
      default: cloneSecurity[id] = value;
    }

    dispatch(FLOW_ACTIONS.UPDATE_SECURITY, cloneSecurity);
  };

  return (
    <div className={cx(gClasses.P24, gClasses.BackgroundWhite)}>
      <div className={gClasses.MB24}>
        <Title
          content={FLOW_SECURITY.ADMINISTRATIVE_PERMISSIONS}
          size={ETitleSize.xs}
          className={cx(gClasses.GrayV3, gClasses.MB12)}
        />
        <div className={gClasses.CenterV}>
          <UserPicker
            id={FLOW_SECURITY.ADMINS}
            labelClassName={styles.FieldLabel}
            labelText={FLOW_SECURITY.FLOW_ADMINS}
            className={cx(gClasses.W50)}
            selectedValue={filterCurrentUser(security?.admins, currentLoggedInUser)}
            onSelect={(value) => onChange(FLOW_SECURITY.ADMINS, value)}
            onRemove={(id) =>
              onChange(FLOW_SECURITY.ADMINS, id, { removeUser: true })
            }
            isSearchable
            required
            noDataFoundMessage={NO_DATA_FOUND}
            errorMessage={errorList.admins}
            isloading={loading}
            allowedUserType={USER_TYPES_PARAMS.DEVELOPER_ADMIN_USERS}
            isUsers
            helpTooltip={FLOW_SECURITY.ADMINS_TOOLTIP}
            cancelToken={adminsCancelToken}
            popperPosition={EPopperPlacements.RIGHT}
          />
        </div>
      </div>

      <div className={gClasses.MB24}>
        <Title
          content={FLOW_SECURITY.DATA_SECURITY}
          size={ETitleSize.xs}
          className={cx(gClasses.GrayV3, gClasses.MB12)}
        />
        <UserPicker
            id={FLOW_SECURITY.OWNERS}
            labelClassName={styles.FieldLabel}
            labelText={FLOW_SECURITY.FLOW_OWNERS}
            className={cx(gClasses.W50, gClasses.MB16)}
            selectedValue={security?.owners}
            onSelect={(value) => onChange(FLOW_SECURITY.OWNERS, value)}
            onRemove={(id) =>
              onChange(FLOW_SECURITY.OWNERS, id, { removeUser: true })
            }
            isSearchable
            required
            noDataFoundMessage={NO_DATA_FOUND}
            errorMessage={errorList.owners}
            isloading={loading}
            allowedUserType={USER_TYPES_PARAMS.ALL_USERS}
            allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
            helpTooltip={FLOW_SECURITY.OWNERS_TOOLTIP}
            cancelToken={ownersCancelToken}
            popperPosition={EPopperPlacements.RIGHT}
        />
        <div className={gClasses.DisplayFlex}>
          <div className={gClasses.W50}>
            <Label
              labelName={FLOW_SECURITY.TRIGGER.LABEL}
              className={gClasses.MB4}
            />
            <Text
              id={FLOW_SECURITY.TRIGGER.ID}
              className={gClasses.GrayV3}
              content={security?.hasAutoTrigger ? FLOW_SECURITY.TRIGGER.OPTIONS[1].label : FLOW_SECURITY.TRIGGER.OPTIONS[0].label}
            />
          </div>
          <UserPicker
            id={FLOW_SECURITY.INITIATORS}
            className={gClasses.W50}
            labelText={FLOW_SECURITY.TO_START_FLOW}
            labelClassName={styles.FieldLabel}
            selectedValue={security?.initiators}
            onSelect={(value) => onChange(FLOW_SECURITY.INITIATORS, value)}
            onRemove={(id) =>
              onChange(FLOW_SECURITY.INITIATORS, id, { removeUser: true })
            }
            isSearchable
            noDataFoundMessage={NO_DATA_FOUND}
            isloading={loading}
            allowedUserType={USER_TYPES_PARAMS.ALL_USERS}
            allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
            required={!security?.hasAutoTrigger}
            errorMessage={errorList?.initiators}
            cancelToken={initiatorsCancelToken}
            popperPosition={EPopperPlacements.RIGHT}
          />
        </div>
        <RadioGroup
          className={gClasses.MT16}
          id={FLOW_SECURITY.IS_PARTICIPANTS_LEVEL_SECURITY}
          required
          labelText={FLOW_SECURITY.DATA_ACCESS_PERMISSIONS}
          selectedValue={security.isParticipantsLevelSecurity}
          options={FLOW_SECURITY.PERMISSION_OPTIONS}
          onChange={(e, id, v) => onChange(id, v)}
          errorMessage={errorList.isParticipantsLevelSecurity}
        />
      </div>
      <div>
        <Title
          content={FLOW_SECURITY.VIEW_PERMISSION}
          size={ETitleSize.xs}
          className={cx(gClasses.GrayV3, gClasses.MB12)}
        />
        <UserPicker
          id={FLOW_SECURITY.VIEWERS}
          labelClassName={styles.FieldLabel}
          labelText={FLOW_SECURITY.VIEW_ALL_DATA_LABEL}
          className={cx(gClasses.MB16)}
          selectedValue={security?.viewers}
          onSelect={(value) => onChange(FLOW_SECURITY.VIEWERS, value)}
          onRemove={(id) =>
            onChange(FLOW_SECURITY.VIEWERS, id, { removeUser: true })
          }
          isSearchable
          noDataFoundMessage={NO_DATA_FOUND}
          isloading={loading}
          allowedUserType={USER_TYPES_PARAMS.ALL_USERS}
          allowedTeamType={TEAM_TYPES_PARAMS.SYSTEM_ORGANISATION_TEAMS}
          cancelToken={viewersCancelToken}
          popperPosition={EPopperPlacements.RIGHT}
        />
      </div>

      {/* <div className={gClasses.MB24}>
        <Title
          content={FLOW_SECURITY.USER_PERMISSION}
          size={ETitleSize.xs}
          className={cx(gClasses.GrayV3, gClasses.MB12)}
        />
      </div> */}

      <div className={gClasses.MB24}>
        <PolicyBasedDataSecurity
          securityData={security}
          metaData={metaData}
          setSecurityData={(policyData) =>
            onChange(FLOW_SECURITY.POLICY, policyData)
          }
          errorList={errorList}
          isLoading={loading}
          onUserSelectHandler={(selectedUserorTeam, id) => onChange(id, selectedUserorTeam)}
          onUserRemoveHandler={(selectedUserorTeamID, id) => onChange(id, selectedUserorTeamID, { removeUser: true })}
        />
      </div>
    </div>
  );
}

export default FlowCreateEditSetSecurity;
