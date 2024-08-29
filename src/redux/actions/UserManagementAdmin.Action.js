import { isEmpty, isNull } from 'lodash';
import { FORM_POPOVER_STATUS, ROUTE_METHOD } from 'utils/Constants';
import { ADMIN_SETTINGS } from 'containers/admin_settings/AdminSettingsTranslation.strings';
import { USER_MANAGEMENT_ADMIN } from './ActionConstants';
import {
  getUserManagementData,
  activateOrDeactivateUser,
  userRoleChange,
  resetPasswordApiService,
  resetMfaApiService,
} from '../../axios/apiService/userManagementAdmin.apiService';
import {
  setPointerEvent,
  updatePostLoader,
  updateErrorPopoverInRedux,
  routeNavigate,
  showToastPopover,
} from '../../utils/UtilityFunctions';
import {
  generateGetServerErrorMessage,
  generatePostServerErrorMessage,
} from '../../server_validations/ServerValidation';
import {
  USER_MANAGEMENT_FORM,
  USER_STATUS_INDEX,
  USER_TYPES_INDEX,
} from '../../containers/admin_settings/user_management/UserManagement.strings';
import { logoutAction, roleAction } from './Actions';
import { store } from '../../Store';
import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import { history } from '../../App';
import { EMPTY_STRING, VALIDATION_ERROR_TYPES } from '../../utils/strings/CommonStrings';
import { ADMIN_SETTINGS_LABELS } from '../../containers/admin_settings/AdminSettings.strings';
import jsUtils, { translateFunction } from '../../utils/jsUtility';

const { USER_MANAGEMENT } = ADMIN_SETTINGS;
export const userManagementApiStarted = () => {
 return {
  type: USER_MANAGEMENT_ADMIN.STARTED,
};
};

export const userManagementApiFailure = (error) => {
 return {
  type: USER_MANAGEMENT_ADMIN.FAILURE,
  payload: error,
};
};

const userManagementApiSuccess = (userManagementData) => {
 return {
  type: USER_MANAGEMENT_ADMIN.SUCCESS,
  payload: { ...userManagementData },
};
};

export const userManagementDataChangeAction = (userManagementData) => (dispatch) => {
  dispatch({
    type: USER_MANAGEMENT_ADMIN.DATA_CHANGE,
    payload: { ...userManagementData },
  });
  return Promise.resolve();
};

export const userManagementApiCancelAction = () => {
 return {
  type: USER_MANAGEMENT_ADMIN.CANCEL,
};
};

export const clearUserManagementDataAction = () => {
 return {
  type: USER_MANAGEMENT_ADMIN.CLEAR,
};
};

export const userManagementPostsApiCancelAction = () => {
 return {
  type: USER_MANAGEMENT_ADMIN._POST_CANCEL,
};
};

export const getUserManagementDataThunk = () => (dispatch) => {
    const {
      user_type,
      page,
      cardCount,
      user_auto_suggestion,
      user_status_index,
      user_list_sort_index,
      sort_field,
      sort_by,
    } = store.getState().UserManagementAdminReducer;
    dispatch(userManagementApiStarted());

    let get_user_params = {
      page,
      size: cardCount,
      is_last_signin: 1,
      sort_field,
      sort_by,
    };
    if (!jsUtils.isEmpty(user_list_sort_index)) get_user_params.sort_by = user_list_sort_index;
    if (user_type !== USER_TYPES_INDEX.ALL_USERS) {
      get_user_params = {
        ...get_user_params,
        user_types: [user_type],
      };
    }
    if (!isEmpty(user_auto_suggestion)) {
      get_user_params = {
        ...get_user_params,
        search: user_auto_suggestion,
      };
    }
    if (user_status_index !== USER_STATUS_INDEX.ALL) {
      get_user_params = {
        ...get_user_params,
        is_active: user_status_index,
      };
    }

    getUserManagementData(get_user_params)
      .then((normalizedData) => {
        if (!isNull(normalizedData)) {
          console.log('normalizedData', normalizedData);
          dispatch(userManagementApiSuccess(normalizedData));
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(userManagementApiFailure(errors.common_server_error));
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(userManagementApiFailure(errors));
        updateErrorPopoverInRedux(USER_MANAGEMENT_FORM.UPDATE_FAILURE, errors.common_server_error);
      });
  };
export const activateOrDeactivateUserThunk = (data, isActiveUser, t = translateFunction) => (dispatch) => new Promise((resolve, reject) => {
    setPointerEvent(true);
    activateOrDeactivateUser(data)
      .then((normalizedData) => {
        if (!isNull(normalizedData)) {
          showToastPopover(
            USER_MANAGEMENT_FORM.SUCCESSFUL_UPDATE(t).title,
            USER_MANAGEMENT_FORM.SUCCESSFUL_UPDATE(t).subTitle,
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
          if (isActiveUser) {
            if (localStorage.getItem('csrf_token')) {
              localStorage.removeItem('csrf_token');
              if (sessionStorage.getItem('browser_tab_uuid')) {
                sessionStorage.removeItem('browser_tab_uuid');
              }
              localStorage.removeItem('previous_log_time');
            }
            routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
            dispatch(logoutAction());
          }
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(userManagementApiFailure(errors.common_server_error));
        }
        setPointerEvent(false);
        updatePostLoader(false);
        resolve(true);
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        if (error?.response?.data?.errors[0]?.type === VALIDATION_ERROR_TYPES.LIMIT) {
          showToastPopover(
            'Limit Exceeded',
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        const { server_error } = store.getState().AdminSettingsReducer;
        const errors = generatePostServerErrorMessage(error, server_error, ADMIN_SETTINGS_LABELS);
        const errorData = {
          server_error: errors.state_error ? errors.state_error : [],
          common_server_error: errors.common_server_error
            ? errors.common_server_error
            : EMPTY_STRING,
        };
        dispatch(userManagementApiFailure(errorData));
        reject(error);
      });
  });

export const userRoleChangeThunk = (data, isActiveUser, t = translateFunction) => (dispatch) => new Promise((resolve) => {
    setPointerEvent(true);
    userRoleChange(data)
      .then((normalizedData) => {
        if (!isNull(normalizedData)) {
          showToastPopover(
            USER_MANAGEMENT_FORM.SUCCESSFUL_UPDATE(t).title,
            USER_MANAGEMENT_FORM.SUCCESSFUL_UPDATE(t).subTitle,
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
          if (isActiveUser) {
            roleAction(normalizedData.user_type ? normalizedData.user_type : data.user_type);
            routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
          }
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(userManagementApiFailure(errors.common_server_error));
        }
        setPointerEvent(false);
        updatePostLoader(false);
        resolve(true);
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const { server_error } = store.getState().UserManagementAdminReducer;
        const errors = generatePostServerErrorMessage(error, server_error, ADMIN_SETTINGS_LABELS);
        const errorData = {
          server_error: errors.state_error ? errors.state_error : [],
          common_server_error: errors.common_server_error
            ? errors.common_server_error
            : EMPTY_STRING,
        };
        dispatch(userManagementApiFailure(errorData));
        showToastPopover(
          USER_MANAGEMENT_FORM.UPDATE_FAILURE.title,
          USER_MANAGEMENT_FORM.UPDATE_FAILURE.subTitle,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      });
  });

export const passwordResetThunk = (data, t = translateFunction) => (dispatch) => new Promise((resolve, reject) => {
    setPointerEvent(true);
    resetPasswordApiService(data)
      .then((normalizedData) => {
        if (!isNull(normalizedData)) {
          showToastPopover(
            t(USER_MANAGEMENT.SUCCESSFUL_UPDATE_TITLE),
            t(USER_MANAGEMENT.SUCCESSFUL_UPDATE_SUBTITLE),
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(userManagementApiFailure(errors.common_server_error));
        }
        setPointerEvent(false);
        updatePostLoader(false);
        resolve(true);
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const { server_error } = store.getState().AdminSettingsReducer;
        const errors = generatePostServerErrorMessage(error, server_error, ADMIN_SETTINGS_LABELS);
        const errorData = {
          server_error: errors.state_error ? errors.state_error : [],
          common_server_error: errors.common_server_error
            ? errors.common_server_error
            : EMPTY_STRING,
        };
        dispatch(userManagementApiFailure(errorData));
        updateErrorPopoverInRedux(USER_MANAGEMENT_FORM.UPDATE_FAILURE, errors.common_server_error);
        reject(error);
      });
  });

  export const resetMfaThunk = (data, t = translateFunction) => (dispatch) => {
    setPointerEvent(true);
    updatePostLoader(true);
    return new Promise((resolve, reject) => {
      resetMfaApiService(data)
      .then((response) => {
        setPointerEvent(false);
        updatePostLoader(false);
        if (response) {
          showToastPopover(
            t(USER_MANAGEMENT.SUCCESSFUL_MFA_UPDATE_TITLE),
            t(USER_MANAGEMENT.SUCCESSFUL_MFA_UPDATE_SUBTITLE),
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
          resolve(response);
        } else {
         const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(userManagementApiFailure(errors.common_server_error));
          setPointerEvent(false);
          updatePostLoader(false);
          resolve(true);
        }
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const { server_error } = store.getState().AdminSettingsReducer;
        const errors = generatePostServerErrorMessage(error, server_error, ADMIN_SETTINGS_LABELS);
        const errorData = {
          server_error: errors.state_error ? errors.state_error : [],
          common_server_error: errors.common_server_error
            ? errors.common_server_error
            : EMPTY_STRING,
        };
        dispatch(userManagementApiFailure(errorData));
        updateErrorPopoverInRedux(USER_MANAGEMENT_FORM.UPDATE_FAILURE, errors.common_server_error);
        reject(error);
      });
    });
  };
