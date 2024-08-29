import { isEmpty, isNull } from 'lodash';
import { translate } from 'language/config';
import { ADD_MEMBER } from './ActionConstants';
import {
  getUserRoles,
  getBusinessUnits,
  updateNewRole,
  updateBusinessUnit,
  updateUser,
  checkUserNameExist,
  checkEmailExist,
  getUserData,
  editUser,
} from '../../axios/apiService/addMember.apiService ';
import {
  setPointerEvent,
  updatePostLoader,
  updateErrorPopoverInRedux,
  getUserProfileData,
  showToastPopover,
} from '../../utils/UtilityFunctions';
import {
  generateGetServerErrorMessage,
  generatePostServerErrorMessage,
} from '../../server_validations/ServerValidation';
import { store } from '../../Store';
import {
  EMPTY_STRING,
  VALIDATION_ERROR_TYPES,
} from '../../utils/strings/CommonStrings';
import { appendNewRole } from '../../containers/admin_settings/user_management/add_or_invite_members/add_member/AddMember.validation.schema';
import { ADD_OR_INVITE_MEMBERS_LABELS, ADD_OR_INVITE_USERS_ERROR } from '../../containers/admin_settings/user_management/add_or_invite_members/AddOrInviteMembers.strings';
import { ADD_MEMBERS_STRINGS } from '../../containers/admin_settings/user_management/add_or_invite_members/add_member/AddMember.strings';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';
import countryCodeList from '../../components/form_components/flags/countryCodeList';
import jsUtils, { translateFunction } from '../../utils/jsUtility';
import { updateAdminProfileData } from './Actions';
import { ERROR_TYPE_TRIAL_EXPIRATION_ERROR } from '../../utils/ServerValidationUtils';

export const addMemberApiStarted = () => {
  return {
    type: ADD_MEMBER.STARTED,
  };
};

export const addRoleApiStarted = () => {
  return {
    type: ADD_MEMBER.ADD_ROLE_STARTED,
  };
};

export const addBusinessUnitApiStarted = () => {
  return {
    type: ADD_MEMBER.ADD_BUSINESS_UNIT_STARTED,
  };
};

export const addMemberApiFailure = (error) => {
  return {
    type: ADD_MEMBER.FAILURE,
    payload: error,
  };
};

const addMemberApiSuccess = (addMemberData) => {
  return {
    type: ADD_MEMBER.SUCCESS,
    payload: { ...addMemberData },
  };
};

const addMemberUpdateApiSuccess = (addMemberData) => {
  return {
    type: ADD_MEMBER.UPDATE,
    payload: { ...addMemberData },
  };
};

export const addMemberDataChangeAction = (addMemberData) => (dispatch) => {
  dispatch({
    type: ADD_MEMBER.DATA_CHANGE,
    payload: { ...addMemberData },
  });
  return Promise.resolve();
};

export const addMemberApiCancelAction = () => {
  return {
    type: ADD_MEMBER.CANCEL,
  };
};

export const clearAddMemberDataAction = () => {
  return {
    type: ADD_MEMBER.CLEAR,
  };
};

export const addMemberPostsApiCancelAction = () => {
  return {
    type: ADD_MEMBER._POST_CANCEL,
  };
};

export const addMemberClearReportingManager = () => {
  return {
    type: ADD_MEMBER.CLEAR_REPORTING_MANAGER,
  };
};

export const updateUserDetailsThunk =
  (data) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(addMemberApiStarted());
      updatePostLoader(true);
      editUser(data).then((normalizedData) => {
        const userProfileData = getUserProfileData();
        if (data._id === userProfileData.id) {
          const updateData = {};
          updateData.email = data.email;
          updateData.first_name = data.first_name;
          updateData.last_name = data.last_name;
          dispatch(updateAdminProfileData({ userProfileData: updateData }));
        }
        updatePostLoader(false);
        showToastPopover(
          'Updated',
          translate('error_popover_status.update_user_details'),
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
        resolve(normalizedData);
      }).catch((error) => {
        updatePostLoader(false);
        const err = error?.response?.data?.errors || [];
        let errors = { server_error: {} };

        if (err.length) {
          let msg = 'Please try again after sometimes';
          if (err[0].field === 'email' && err[0].type === 'exist') {
            msg = 'Email already exists!';
            errors = { server_error: { email: msg } };
          }

          dispatch(addMemberApiFailure(errors));
        }
        reject(errors);
      });
    });

export const getAddMemberDataThunk = () => (dispatch) => {
  dispatch(addMemberApiStarted());
  Promise.all([getUserRoles(), getBusinessUnits()])
    .then(([normalizedRoles, normalizedBusinessUnits]) => {
      if (!isNull(normalizedRoles || normalizedBusinessUnits)) {
        const data = {
          role_list: normalizedRoles,
          business_unit_list: normalizedBusinessUnits,
        };
        dispatch(addMemberApiSuccess(data));
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(addMemberApiFailure(errors.common_server_error));
      }
    })
    .catch((error) => {
      const errors = generateGetServerErrorMessage(error);
      dispatch(addMemberApiFailure(errors));
    });
};

export const getEditUserDataThunk = (params) => (dispatch) => {
  dispatch(addMemberApiStarted());
  getUserData(params)
    .then((response) => {
      if (!isEmpty(response)) {
        const data = {
          first_name: response.first_name,
          last_name: response.last_name,
          username: response.username,
          email: response.email,
          user_type: response.user_type,
          not_reporting: response.not_reporting
            ? response.not_reporting
            : false,
          mobile_number_country_code: countryCodeList[94].countryCodeId,
          mobile_number_country: countryCodeList[94].countryCode.toUpperCase(),
        };
        if (response.role) data.role = response.role;
        if (response.business_unit) data.business_unit = response.business_unit;
        if (response.mobile_number) {
          data.mobile_number = response.mobile_number;
          data.mobile_number_country = response.mobile_number_country;
          data.mobile_number_country_code = response.mobile_number_country_code;
        }
        if (response.phone_number) {
          data.phone_number = response.phone_number;
        }
        if (response.reporting_manager) {
          data.reporting_manager = response.reporting_manager;
        }
        if (response.datalist_info) {
          data.datalist_info = response.datalist_info;
        }
        data.user_details = response;
        dispatch(addMemberApiSuccess(data));
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(addMemberApiFailure(errors.common_server_error));
      }
    })
    .catch((error) => {
      const errors = generateGetServerErrorMessage(error);
      dispatch(addMemberApiFailure(errors));
    });
};

export const updateRoleThunk =
  (data, t = translateFunction) =>
  (dispatch) =>
    new Promise((resolve) => {
      dispatch(addRoleApiStarted());
      updateNewRole(data)
        .then((normalizedData) => {
          if (!isNull(normalizedData)) {
            const { role_list } = store.getState().AddMemberReducer;
            updatePostLoader(false);
            const successData = {
              role_list: appendNewRole(
                data.roles,
                role_list ? [...role_list] : [],
              ),
              role: data.roles[0],
              is_add_role_loading: false,
            };
            dispatch(addMemberDataChangeAction({ roles: EMPTY_STRING }));
            dispatch(addMemberUpdateApiSuccess(successData));
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            dispatch(addMemberApiFailure(errors.common_server_error));
          }
          updatePostLoader(false);
          resolve(true);
        })
        .catch((error) => {
          updatePostLoader(false);
          const { server_error } = store.getState().AddMemberReducer;
          const errors = generatePostServerErrorMessage(
            error,
            server_error,
            ADD_OR_INVITE_MEMBERS_LABELS(t),
          );
          const errorData = {
            server_error: errors.state_error ? errors.state_error : [],
            common_server_error: errors.common_server_error
              ? errors.common_server_error
              : EMPTY_STRING,
            is_data_loading: false,
            role: EMPTY_STRING,
          };
          dispatch(addMemberApiFailure(errorData));
          const new_role_error = {
            roles: translate('error_popover_status.role_already_exist'),
          };
          dispatch(
            addMemberDataChangeAction({
              new_role_error,
              is_add_role_loading: false,
            }),
          );
          // reject(error);
        });
    });

export const updateBusinessUnitThunk =
  (data, t = translateFunction) =>
  (dispatch) =>
    new Promise((resolve) => {
      dispatch(addBusinessUnitApiStarted());
      updateBusinessUnit(data)
        .then((normalizedData) => {
          if (!isNull(normalizedData)) {
            const { business_unit_list } = store.getState().AddMemberReducer;
            const successData = {
              business_unit_list: appendNewRole(
                data.business_units,
                business_unit_list ? [...business_unit_list] : [],
              ),
              business_unit: data.business_units[0],
              is_add_business_unit_loading: false,
            };
            dispatch(
              addMemberDataChangeAction({ business_units: EMPTY_STRING }),
            );
            dispatch(addMemberUpdateApiSuccess(successData));
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            dispatch(addMemberApiFailure(errors.common_server_error));
          }
          updatePostLoader(false);
          resolve(true);
        })
        .catch((error) => {
          updatePostLoader(false);
          const { server_error } = store.getState().AddMemberReducer;
          const errors = generatePostServerErrorMessage(
            error,
            server_error,
            ADD_OR_INVITE_MEMBERS_LABELS(t),
          );
          const errorData = {
            server_error: errors.state_error ? errors.state_error : [],
            common_server_error: errors.common_server_error
              ? errors.common_server_error
              : EMPTY_STRING,
            is_data_loading: false,
            business_unit: EMPTY_STRING,
          };
          dispatch(addMemberApiFailure(errorData));
          const business_unit_error = {
            business_units: translate(
              'error_popover_status.Business_unit_exist',
            ),
          };
          dispatch(
            addMemberDataChangeAction({
              business_unit_error,
              is_add_business_unit_loading: false,
            }),
          );
          // reject(error);
        });
    });
export const updateUserThunk = (data, t) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(addMemberApiStarted());
    updateUser(data)
      .then((normalizedData) => {
        if (!isNull(normalizedData)) {
          setPointerEvent(false);
          updatePostLoader(false);
          showToastPopover(ADD_MEMBERS_STRINGS.SUCCESSFUL_ADD_MEMBER(t).title, EMPTY_STRING, FORM_POPOVER_STATUS.SUCCESS, true);
          dispatch(addMemberUpdateApiSuccess());
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(addMemberApiFailure(errors.common_server_error));
        }
        updatePostLoader(false);
        resolve(normalizedData);
      })
      .catch((error) => {
        const { TRIAL_LIMIT, LIMIT_EXCEED } = ADD_OR_INVITE_USERS_ERROR(t);
        if (error?.response?.data?.errors[0]?.type === VALIDATION_ERROR_TYPES.LIMIT) {
          showToastPopover(LIMIT_EXCEED, EMPTY_STRING, FORM_POPOVER_STATUS.SERVER_ERROR, true);
        } else if (error?.response?.data?.errors[0]?.type === ERROR_TYPE_TRIAL_EXPIRATION_ERROR) {
          showToastPopover(TRIAL_LIMIT, EMPTY_STRING, FORM_POPOVER_STATUS.SERVER_ERROR, true);
        } else {
          updateErrorPopoverInRedux(
            ADD_MEMBERS_STRINGS.UPDATE_FAILURE,
            error.common_server_error,
          );
        }
        setPointerEvent(false);
        updatePostLoader(false);
        const { server_error } = store.getState().AddMemberReducer;
        const errors = generatePostServerErrorMessage(
          error,
          server_error,
          ADD_OR_INVITE_MEMBERS_LABELS(t),
        );
        const errorData = {
          server_error: errors.state_error ? errors.state_error : [],
          common_server_error: errors.common_server_error
            ? errors.common_server_error
            : EMPTY_STRING,
          is_data_loading: false,
        };
        dispatch(addMemberApiFailure(errorData));

        reject(error);
      });
  });
export const checkUserNameExistThunk =
  (data, shouldAddMember, t = translateFunction) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(addMemberApiStarted());
      checkUserNameExist(data)
        .then((normalizedData) => {
          if (!isNull(normalizedData)) {
            const { server_error, username } =
              store.getState().AddMemberReducer;
            if (server_error.username) delete server_error.username;
            const successData = {
              server_error,
              common_server_error: EMPTY_STRING,
              is_username_unique: true,
              unique_username: username,
            };
            dispatch(addMemberApiSuccess(successData));
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            dispatch(addMemberApiFailure(errors.common_server_error));
          }
          console.log('should add memner', shouldAddMember);
          resolve({ shouldAddMember, is_email_unique: true });
        })
        .catch((error) => {
          const { server_error } = store.getState().AddMemberReducer;
          const errors = generatePostServerErrorMessage(
            error,
            server_error,
            ADD_OR_INVITE_MEMBERS_LABELS(t),
          );
          const errorData = {
            server_error: errors.state_error ? errors.state_error : [],
            common_server_error: errors.common_server_error
              ? errors.common_server_error
              : EMPTY_STRING,
            is_data_loading: false,
          };
          dispatch(addMemberApiFailure(errorData));
          reject(error);
        });
    });

export const checkEmailExistThunk =
  (data, shouldAddMember, t = translateFunction) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(addMemberApiStarted());
      checkEmailExist(data)
        .then((normalizedData) => {
          if (!isNull(normalizedData)) {
            const {
              username,
              is_username_unique,
              server_error,
              email,
              error_list,
            } = store.getState().AddMemberReducer;
            if (server_error.email) delete server_error.email;
            if (jsUtils.isEmpty(username)) {
              if (error_list.username) delete error_list.username;
            }
            const successData = {
              server_error,
              error_list,
              common_server_error: EMPTY_STRING,
              is_email_unique: true,
              unique_email: email,
              username: jsUtils.isEmpty(username) ? email : username,
              unique_username: jsUtils.isEmpty(username) ? email : username,
              is_username_unique: jsUtils.isEmpty(username)
                ? true
                : is_username_unique,
            };
            console.log(successData);
            dispatch(addMemberApiSuccess(successData));
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            dispatch(addMemberApiFailure(errors.common_server_error));
          }
          updatePostLoader(false);
          resolve({ shouldAddMember, is_username_unique: true });
        })
        .catch((error) => {
          const { server_error } = store.getState().AddMemberReducer;
          const errors = generatePostServerErrorMessage(
            error,
            server_error,
            ADD_OR_INVITE_MEMBERS_LABELS(t),
          );
          const errorData = {
            server_error: errors.state_error ? errors.state_error : [],
            common_server_error: errors.common_server_error
              ? errors.common_server_error
              : EMPTY_STRING,
            is_data_loading: false,
          };
          dispatch(addMemberApiFailure(errorData));
          reject(error);
        });
    });
