import { isEmpty, isNull } from 'lodash';
import { translate } from 'language/config';
import { ACCOUNT_CONFIGURATION_ADMIN, AUTH_ACCOUNT_CONFIGURATION_ADMIN } from './ActionConstants';
import {
  getAccountConfigurationDetailsApiService,
  updateAuthAccountConfigurationDetailsApiService,
  getAuthAccountConfigurationDetailsApiService,
  updateAccountConfigurationDetailsApiService,
} from '../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import {
  setPointerEvent,
  updatePostLoader,
  updateErrorPopoverInRedux,
  updateFormPostOperationFeedback,
  showToastPopover,
} from '../../utils/UtilityFunctions';
import {
  generateGetServerErrorMessage,
  generatePostServerErrorMessage,
} from '../../server_validations/ServerValidation';
import { ACCOUNT_SETTINGS_FORM } from '../../containers/admin_settings/account_settings/AccountSettings.strings';
import { OTHER_SETTINGS_LABELS } from '../../containers/admin_settings/other_settings/OtherSettings.strings';
import { updateMaximumFileSizeAction } from './Actions';
import { store } from '../../Store';
import { FORM_FEEDBACK_TYPES } from '../../components/popovers/form_post_operation_feedback/FormPostOperationFeedback';
import { updateMFAInfo } from './Mfa.Action';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';

const accountConfigurationApiStarted = () => {
 return {
  type: ACCOUNT_CONFIGURATION_ADMIN.STARTED,
};
};

const authAccountConfigurationApiStarted = () => {
 return {
  type: AUTH_ACCOUNT_CONFIGURATION_ADMIN.STARTED,
};
};

const accountConfigurationApiSuccess = (accountConfigurationData) => {
 return {
  type: ACCOUNT_CONFIGURATION_ADMIN.SUCCESS,
  payload: { ...accountConfigurationData },
};
};

const accountConfigurationUpdateApiSuccess = (accountConfigurationData) => (dispatch) => {
  dispatch({ type: ACCOUNT_CONFIGURATION_ADMIN.UPDATE, payload: { ...accountConfigurationData } });
  return Promise.resolve();
};

export const accountConfigurationDataChangeAction = (accountConfigurationData) => (dispatch) => {
  dispatch({
    type: ACCOUNT_CONFIGURATION_ADMIN.DATA_CHANGE,
    payload: { ...accountConfigurationData },
  });
  return Promise.resolve();
};

const accountConfigurationApiFailure = (error) => {
 return {
  type: ACCOUNT_CONFIGURATION_ADMIN.FAILURE,
  payload: error,
};
};

export const accountConfigurationApiCancelAction = () => {
 return {
  type: ACCOUNT_CONFIGURATION_ADMIN.CANCEL,
};
};

export const clearAccountConfigurationDataAction = () => {
 return {
  type: ACCOUNT_CONFIGURATION_ADMIN.CLEAR,
};
};

export const accountConfigurationPostsApiCancelAction = () => {
 return {
  type: ACCOUNT_CONFIGURATION_ADMIN._POST_CANCEL,
};
};

export const getAccountConfigurationDetailsApiAction = (params) => (dispatch) => {
    dispatch(accountConfigurationApiStarted());
    getAccountConfigurationDetailsApiService(params)
      .then((normalizedData) => {
        if (!isNull(normalizedData)) {
          dispatch(accountConfigurationApiSuccess(normalizedData));
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(accountConfigurationApiFailure(errors.common_server_error));
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(accountConfigurationApiFailure(errors.common_server_error));
        updateErrorPopoverInRedux(ACCOUNT_SETTINGS_FORM.UPDATE_FAILURE, errors.common_server_error);
      });
  };

export const getAuthAccountConfigurationDetailsApiAction = (params) => (dispatch) => {
    dispatch(authAccountConfigurationApiStarted());
    getAuthAccountConfigurationDetailsApiService(params)
      .then((normalizedData) => {
        if (!isNull(normalizedData)) {
          dispatch(accountConfigurationApiSuccess(normalizedData));
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(accountConfigurationApiFailure(errors.common_server_error));
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(accountConfigurationApiFailure(errors.common_server_error));
        updateErrorPopoverInRedux(ACCOUNT_SETTINGS_FORM.UPDATE_FAILURE, errors.common_server_error);
      });
  };

export const updateAccountConfigurationDetailsApiAction = (data) => (dispatch) => {
    dispatch(accountConfigurationApiStarted());
    setPointerEvent(true);
    updateAccountConfigurationDetailsApiService(data)
      .then((result) => {
        if (result) {
          updatePostLoader(false);
          setPointerEvent(false);
          updateFormPostOperationFeedback({
            isVisible: true,
            type: FORM_FEEDBACK_TYPES.SUCCESS,
            id: 'other_settings',
            message: translate('error_popover_status.save_other_settings'),
          });
          dispatch(accountConfigurationUpdateApiSuccess(data)).then(() => {
            if (data.maximum_file_size) {
              store.dispatch(updateMaximumFileSizeAction(data.maximum_file_size));
            }
          });
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(accountConfigurationApiFailure(errors.common_server_error));
        }
      })
      .catch((error) => {
        updatePostLoader(false);
        setPointerEvent(false);
        const { server_error } = store.getState().AccountConfigurationAdminReducer;
        const errors = generatePostServerErrorMessage(error, server_error, OTHER_SETTINGS_LABELS);
        const errorData = {
          server_error: errors.state_error ? errors.state_error : [],
          // common_server_error: errors.common_server_error
          //   ? errors.common_server_error
          //   : EMPTY_STRING,
        };
        dispatch(accountConfigurationApiFailure(errorData));
        if (isEmpty(errors.state_error)) {
          updateErrorPopoverInRedux(ACCOUNT_SETTINGS_FORM.FAILURE, errors.common_server_error);
        }
      });
  };

export const updateAuthAccountConfigurationDetailsApiAction = (data, isMfaDataConfigured = false) => (dispatch) => {
    dispatch(authAccountConfigurationApiStarted());
    setPointerEvent(true);
    updateAuthAccountConfigurationDetailsApiService(data)
      .then((result) => {
        if (result) {
          updatePostLoader(false);
          setPointerEvent(false);
          dispatch(accountConfigurationUpdateApiSuccess(data));
          dispatch(updateMFAInfo({
            isMfaEnabled: data.is_mfa_enabled,
          }));
          isMfaDataConfigured && dispatch(getAuthAccountConfigurationDetailsApiAction());
          // updateFormPostOperationFeedback({
          //   isVisible: true,
          //   type: FORM_FEEDBACK_TYPES.SUCCESS,
          //   id: 'other_settings',
          //   message: 'Changes made in Other Settings saved succesfully!',
          // });
          showToastPopover(
            ACCOUNT_SETTINGS_FORM.SUCCESSFUL_UPDATE.title,
            ACCOUNT_SETTINGS_FORM.SUCCESSFUL_UPDATE.subTitle,
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
          dispatch(accountConfigurationApiFailure(errors.common_server_error));
        }
      })
      .catch((error) => {
        updatePostLoader(false);
        setPointerEvent(false);
        const { server_error } = store.getState().AccountConfigurationAdminReducer;
        const errors = generatePostServerErrorMessage(error, server_error, OTHER_SETTINGS_LABELS);
        const errorData = {
          server_error: errors.state_error ? errors.state_error : [],
          // common_server_error: errors.common_server_error
          //   ? errors.common_server_error
          //   : EMPTY_STRING,
        };
        dispatch(accountConfigurationApiFailure(errorData));
        if (isEmpty(errors.state_error)) {
          updateErrorPopoverInRedux(ACCOUNT_SETTINGS_FORM.FAILURE, errors.common_server_error);
        }
      });
  };
