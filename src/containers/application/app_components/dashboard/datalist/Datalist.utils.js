import { translate } from '../../../../../language/config';
import {
  adminProfileAction,
  flowCreatorProfileAction,
  memberProfileAction,
} from '../../../../../redux/actions/Actions';
import { ROLES } from '../../../../../utils/Constants';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';
import jsUtility from '../../../../../utils/jsUtility';
import { DATA_LIST_STRINGS } from '../../../../data_list/data_list_dashboard/DataList.strings';

export const getIndividualDatalistDashboard = (DLData) => {
  return {
    tabIndex: DLData?.viewDataListTabIndex,
    dataListDetails: DLData?.particularDataListDetails,
    dataListEntryDetails: DLData?.particularDataListEntryDetails,
    isDataLoading: DLData?.isDataListEntryLoading,
    dataListSecurity: DLData?.dataListSecurity,
    referenceId: DLData?.referenceId,
    systemIdentifier: DLData?.systemIdentifier,
    owners: DLData?.particularDataListDetails.owners,
    state: DLData,
    common_server_error: DLData?.common_server_error,
    can_add_datalist_entry: DLData?.can_add_datalist_entry,
    can_edit_datalist: DLData?.can_edit_datalist,
    is_system_identifier: DLData?.is_system_identifier,
    dataListUuid: DLData?.datalist_uuid,
    can_reassign: DLData?.can_reassign,
    datalist_id: DLData?.datalist_id,
  };
};

export const getProfileData = (formData, fields) => {
  const profileData = {};
  if (!jsUtility.isEmpty(formData)) {
    Object.keys(formData).forEach((uuid) => {
      const value = formData[uuid];
      const field = fields[uuid];
      if (
        !jsUtility.isFiniteNumber(value) &&
        !jsUtility.isBoolean(value) &&
        jsUtility.isEmpty(value) &&
        jsUtility.isEmpty(field)
      ) {
        return;
      }

      switch (field[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
        case FIELD_TYPE.EMAIL: {
          profileData.email = value;
          break;
        }
        default:
      }
    });
  }
  return profileData;
};

export const updateProfileAction =
  (updateProfileData, state, postData) => (dispatch) => {
    if (state && postData) {
      const {
        RoleReducer,
        AdminProfileReducer,
        MemberProfileReducer,
        DeveloperProfileReducer,
      } = jsUtility.cloneDeep(state);
      const { role, user_id } = RoleReducer;
      const { _id } = postData;
      if (user_id === _id) {
        let profileData = {};
        let profileAction;
        switch (role) {
          case ROLES.ADMIN:
            profileData = AdminProfileReducer.adminProfile;
            profileAction = adminProfileAction;
            break;
          case ROLES.MEMBER:
            profileData = MemberProfileReducer.memberProfile;
            profileAction = memberProfileAction;
            break;
          case ROLES.FLOW_CREATOR:
            profileData = DeveloperProfileReducer.flowCreatorProfile;
            profileAction = flowCreatorProfileAction;
            break;
          default:
            break;
        }

        const modifiedProfileData = {
          ...profileData,
          ...updateProfileData,
        };
        dispatch(profileAction(modifiedProfileData));
      }
    }
  };

export const dataListOptions = (
  can_add_datalist_entry,
  is_system_defined,
  can_truncate_entry,
) => {
  const optionList = [];

  if (can_add_datalist_entry && !is_system_defined) {
    optionList.push({
      label: translate('datalist.datalist_dashboard.bulk_upload'),
      value: DATA_LIST_STRINGS().BULK_UPLOAD,
    });
  }
  if (can_truncate_entry && !is_system_defined) {
    optionList.push({
      label: translate('datalist.datalist_dashboard.truncate_entries'),
      value: DATA_LIST_STRINGS().TRUNCATE_ALL_VALUES,
    });
  }
  return optionList;
};
