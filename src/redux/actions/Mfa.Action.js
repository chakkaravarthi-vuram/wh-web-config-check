import Cookies from 'universal-cookie';
import { t } from 'i18next';
import { EToastPosition, EToastType, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import { userMfaDetailsAPI, userEnableOrDisableMfaAPI, verifyMfaAPI, disableMfaAPI, validateMfaAPI, resendLoginMfaOtpAPI } from '../../axios/apiService/mfa.apiService';
import { MFA_DETAILS } from './ActionConstants';
import { generateGetServerErrorMessage, generatePostServerErrorMessage } from '../../server_validations/ServerValidation';
import { updateErrorPopoverInRedux, setPointerEvent, updatePostLoader, expiryTimer, routeNavigate, showToastPopover } from '../../utils/UtilityFunctions';
import { MFA_STRINGS } from '../../containers/user_settings/mfa_settings/MFASetup.strings';
import { store } from '../../Store';
import { getDomainName, has } from '../../utils/jsUtility';
import { signInApiSuccess } from './SignIn.Action';
import { FORM_POPOVER_STATUS, ROUTE_METHOD } from '../../utils/Constants';
import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const cookies = new Cookies();

const mfaApiStarted = () => {
  return {
   type: MFA_DETAILS.STARTED,
 };
 };

export const mfaApiCleared = () => {
  return {
   type: MFA_DETAILS.CLEAR,
 };
};

export const updateMFAInfo = (payload) => {
  return {
    type: MFA_DETAILS.UPDATED,
    payload: payload,
  };
};

const getUserMfaDetailsSuccess = (userMfaDetails) => {
  return {
      type: MFA_DETAILS.SUCCESS,
      payload: userMfaDetails,
  };
};

const getUserMfaDetailsFailure = (common_server_error) => {
  return {
    type: MFA_DETAILS.FAILURE,
    payload: { common_server_error },
  };
};

export const getUserMfaDetailsApiAction = (isMFAEnforcedValidation = false) => (dispatch) => {
  dispatch(mfaApiStarted());
  setPointerEvent(true);
  updatePostLoader(true);
  userMfaDetailsAPI(isMFAEnforcedValidation)
    .then((response) => {
      const filteredMfaMethod = MFA_STRINGS.MFA_AUTHENTICATION_METHOD_RADIO.OPTION_LIST.filter((allowedMfaMethod) => response?.allowed_mfa_methods.includes(allowedMfaMethod?.value));
      store.dispatch(getUserMfaDetailsSuccess({
        isMfaVerified: response.is_mfa_verified,
        allowedMfaMethods: filteredMfaMethod,
        selectedMfaMethod: response.default_mfa_method,
        isMfaEnforced: response.is_mfa_enforced,
      }));
      updatePostLoader(false);
      setPointerEvent(false);
    })
    .catch((error) => {
      updatePostLoader(true);
      setPointerEvent(true);
      const errors = generateGetServerErrorMessage(error);
      dispatch(getUserMfaDetailsFailure({ ...errors.common_server_error }));
      updateErrorPopoverInRedux(MFA_DETAILS.FAILURE, errors.common_server_error);
    });
};

export const userEnableOrDisableMfaApiAction = (data, isResendOtp = false, isMFAEnforcedValidation = false) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  userEnableOrDisableMfaAPI(data, isMFAEnforcedValidation)
  .then((response) => {
      if (response) {
        store.dispatch(getUserMfaDetailsSuccess({
          MfaTOTPUrl: response.totp_uri,
        }));
      if (isResendOtp) {
        showToastPopover(
          t(MFA_STRINGS.MFA_POPOVER_MESSAGE.USER_ENABLE_DISABLE_SUCCESS_TITLE),
          t(MFA_STRINGS.MFA_POPOVER_MESSAGE.USER_ENABLE_DISABLE_SUCCESS_SUBTITLE),
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
      }
      updatePostLoader(false);
      setPointerEvent(false);
      } else {
          const err = {
            response: {
              status: 500,
            },
      };
      const errors = generateGetServerErrorMessage(err);
      dispatch(getUserMfaDetailsFailure({ ...errors.common_server_error }));
      updateErrorPopoverInRedux(MFA_DETAILS.FAILURE, errors.common_server_error);
      }
  })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      const { error_list } = store.getState().MfaReducer;
      const label = {
        mfa_code: t(MFA_STRINGS.MFA_POPOVER_MESSAGE.MFA_CODES.URL),
      };
      const errors = generatePostServerErrorMessage(error, error_list, label);
      store.dispatch(getUserMfaDetailsSuccess({
        error_list: {
          mfa_code: error_list.mfa_otp_url,
        },
      }));
      if (errors) {
        showToastPopover(
          t(MFA_STRINGS.MFA_POPOVER_MESSAGE.USER_ENABLE_DISABLE_ERROR_TITLE),
          error_list.mfa_otp_url,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    });
};

export const verifyMfaAPIAction = (data) => (dispatch) => {
  dispatch(mfaApiStarted());
  setPointerEvent(true);
  updatePostLoader(true);
  return new Promise((resolve, reject) => {
    verifyMfaAPI(data)
    .then((response) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (response) {
          if (response.is_otp_valid) {
          store.dispatch(getUserMfaDetailsSuccess({
            isMfaVerified: response.is_mfa_verified,
            isMfaDisabled: response.is_mfa_disabled,
          }));
          toastPopOver({
            title: t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_SUCCESS_TITLE),
            subtitle: response.is_mfa_verified ? t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_SUCCESS_ENABLE_SUBTITLE) : t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_SUCCESS_DISABLE_SUBTITLE),
            toastType: EToastType.success,
            toastPosition: EToastPosition.BOTTOM_LEFT,
          });
        } else {
          store.dispatch(getUserMfaDetailsSuccess({
            error_list: {
              mfa_code: t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_TITLE),
            },
          }));
          showToastPopover(
            t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_TITLE),
            t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_SUBTITLE),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        resolve(response);
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(getUserMfaDetailsFailure({ ...errors.common_server_error }));
        resolve(errors);
      }
    })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      const { error_list } = store.getState().MfaReducer;
      const label = {
        mfa_code: t(MFA_STRINGS.MFA_POPOVER_MESSAGE.MFA_CODES.CODE),
      };
      const errors = generatePostServerErrorMessage(error, error_list, label);
      store.dispatch(getUserMfaDetailsSuccess({
        error_list: {
          mfa_code: error_list.mfa_code,
        },
      }));
      if (errors) {
        showToastPopover(
          t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_TITLE),
          error_list.mfa_code,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
      reject(error);
    });
  });
};

export const MfaSetupverifyMfaAPIAction = (data, isMFAEnforcedValidation = false, history, getAuthorizationDetailsApi) => (dispatch) => {
  dispatch(mfaApiStarted());
  setPointerEvent(true);
  updatePostLoader(true);
  return new Promise((resolve, reject) => {
    verifyMfaAPI(data, isMFAEnforcedValidation)
    .then(({ response, headers }) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (response) {
        if (response?.is_otp_valid) {
            expiryTimer(response.sessionExpiryTime, response.currentTime, history, true);
            const cookieProps = {
              path: '/',
              domain: getDomainName(window.location.hostname),
            };
            cookies.remove('username', cookieProps); // args(key, domain)
            cookies.remove('domain', cookieProps);
            cookies.remove('accountId', cookieProps);
            cookies.remove('email', cookieProps);
            cookies.remove('fromSignup', cookieProps);
            cookies.remove('isUsernameOrEmail', cookieProps);
            cookies.remove('isEmailSignin', cookieProps);
            if (has(headers, ['csrf-token'])) {
              localStorage.setItem('csrf_token', headers['csrf-token']);
              const newTime = new Date().getTime();
              localStorage.setItem('previous_log_time', newTime);
            }
            dispatch(updateMFAInfo({
              error_list: {},
              common_server_error: {},
            }));
            getAuthorizationDetailsApi();
            dispatch(signInApiSuccess());

          store.dispatch(updateMFAInfo({
            isMfaVerified: response.is_mfa_verified,
            isMfaDisabled: response.is_mfa_disabled,
            isShowMFADetails: false,
          }));
          toastPopOver({
            title: t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_SUCCESS_TITLE),
            subtitle: response.is_mfa_verified ? t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_SUCCESS_ENABLE_SUBTITLE) : t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_SUCCESS_DISABLE_SUBTITLE),
            toastType: EToastType.success,
            toastPosition: EToastPosition.BOTTOM_LEFT,
          });
        } else {
          store.dispatch(getUserMfaDetailsSuccess({
            error_list: {
              mfa_code: t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_TITLE),
            },
          }));
          showToastPopover(
            t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_TITLE),
            t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_SUBTITLE),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        resolve(response);
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(getUserMfaDetailsFailure({ ...errors.common_server_error }));
        resolve(errors);
      }
    })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      const { error_list } = store.getState().MfaReducer;
      const label = {
        mfa_code: t(MFA_STRINGS.MFA_POPOVER_MESSAGE.MFA_CODES.CODE),
      };
      const errors = generatePostServerErrorMessage(error, error_list, label);
      store.dispatch(getUserMfaDetailsSuccess({
        error_list: {
          mfa_code: error_list.mfa_code,
        },
      }));
      if (errors) {
        showToastPopover(
          t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_TITLE),
          error_list.mfa_code,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
      reject(error);
    });
  });
};

export const disableMfaApiAction = (data) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  disableMfaAPI(data)
  .then((response) => {
      if (response) {
        store.dispatch(getUserMfaDetailsSuccess({
          isMfaVerified: false,
        }));
      updatePostLoader(false);
      setPointerEvent(false);
      } else {
          const err = {
            response: {
              status: 500,
            },
      };
      const errors = generateGetServerErrorMessage(err);
      dispatch(getUserMfaDetailsFailure({ ...errors.common_server_error }));
      updateErrorPopoverInRedux(MFA_DETAILS.FAILURE, errors.common_server_error);
      }
  })
    .catch((error) => {
      updatePostLoader(true);
      setPointerEvent(true);
      const errors = generateGetServerErrorMessage(error);
      dispatch(getUserMfaDetailsFailure({ ...errors.common_server_error }));
      updateErrorPopoverInRedux(MFA_DETAILS.FAILURE, errors.common_server_error);
    });
};

export const validateMfaAPIAction = (data, getAuthorizationDetailsApi, history) => (dispatch) => {
  dispatch(mfaApiStarted());
  setPointerEvent(true);
  updatePostLoader(true);
  return new Promise((resolve, reject) => {
    validateMfaAPI(data)
      .then(({ response, headers }) => {
        setPointerEvent(false);
        updatePostLoader(false);
        if (response) {
          if (response?.is_otp_valid) {
            // set values to cookie
            expiryTimer(response.sessionExpiryTime, response.currentTime, history, true);
            const cookieProps = {
              path: '/',
              domain: getDomainName(window.location.hostname),
            };
            cookies.remove('username', cookieProps); // args(key, domain)
            cookies.remove('domain', cookieProps);
            cookies.remove('accountId', cookieProps);
            cookies.remove('email', cookieProps);
            cookies.remove('fromSignup', cookieProps);
            cookies.remove('isUsernameOrEmail', cookieProps);
            cookies.remove('isEmailSignin', cookieProps);
            if (has(headers, ['csrf-token'])) {
              localStorage.setItem('csrf_token', headers['csrf-token']);
              const newTime = new Date().getTime();
              localStorage.setItem('previous_log_time', newTime);
            }
            dispatch(updateMFAInfo({
              error_list: {},
              common_server_error: {},
            }));
            getAuthorizationDetailsApi();
            dispatch(signInApiSuccess());
          } else {
            store.dispatch(getUserMfaDetailsSuccess({
              error_list: {
                mfa_code: t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_TITLE),
              },
            }));
            showToastPopover(
              t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_TITLE),
              t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_SUBTITLE),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          }
          resolve(response);
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(getUserMfaDetailsFailure({ ...errors.common_server_error }));
          resolve(errors);
        }
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        const { error_list } = store.getState().MfaReducer;
        const label = {
          mfa_code: t(MFA_STRINGS.MFA_POPOVER_MESSAGE.MFA_CODES.CODE),
        };
        const errors = generatePostServerErrorMessage(error, error_list, label);
        store.dispatch(getUserMfaDetailsSuccess({
          error_list: {
            mfa_code: error_list.mfa_code,
          },
        }));
        if (errors) {
          if (error.response && error.response.data.error_code === (2407 || 2100)) {
            showToastPopover(
              t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_TITLE),
              error.response.data.errors[0].message,
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNIN, EMPTY_STRING, {}, true);
        } else {
          showToastPopover(
            t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_TITLE),
            error_list.mfa_code,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          }
        }
        reject(error);
      });
    });
};

export const resendLoginMfaOtpAction = () => (dispatch) => {
  dispatch(mfaApiStarted());
  setPointerEvent(true);
  updatePostLoader(true);
  resendLoginMfaOtpAPI()
    .then((response) => {
      if (response) {
        showToastPopover(
          t(MFA_STRINGS.MFA_POPOVER_MESSAGE.USER_ENABLE_DISABLE_SUCCESS_TITLE),
          t(MFA_STRINGS.MFA_POPOVER_MESSAGE.USER_ENABLE_DISABLE_SUCCESS_SUBTITLE),
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
      }
      updatePostLoader(false);
      setPointerEvent(false);
    })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      const { error_list } = store.getState().MfaReducer;
      const label = {
        mfa_code: t(MFA_STRINGS.MFA_POPOVER_MESSAGE.MFA_CODES.CODE),
      };
      const errors = generatePostServerErrorMessage(error, error_list, label);
      store.dispatch(getUserMfaDetailsSuccess({
        error_list: {
          mfa_code: error_list.mfa_code,
        },
      }));
      if (errors) {
        showToastPopover(
          t(MFA_STRINGS.MFA_POPOVER_MESSAGE.VERIFY_MFA_ERROR_TITLE),
          error_list.mfa_code,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    });
};

export default getUserMfaDetailsApiAction;
