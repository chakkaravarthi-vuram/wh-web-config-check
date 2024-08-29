import { translate } from 'language/config';
import { accountSettingFailure, accountSettingStarted, accountSettingStateChange, accountSettingStateClear } from 'redux/reducer/AccountConfigSetReducer';
import { FORM_POPOVER_STATUS, PRODUCTION, ROUTE_METHOD } from 'utils/Constants';
import { updateLanguageAndCalendarData } from 'axios/apiService/languageAndCalendarAdmin.apiService';
import { SIGNIN, PASSWORD } from 'urls/RouteConstants';
import { getDomainName } from 'utils/jsUtility';
import Cookies from 'universal-cookie';
import { setPrimaryDomainCookie } from 'containers/sign_in/SignIn.utils';
import { ACTION_CONSTANTS, SIGN_UP_BASIC_DETAILS, SIGN_UP_OTP_VERIFICATION, SIGN_UP_ADDITIONAL_DETAILS, SIGN_UP } from './ActionConstants';
// eslint-disable-next-line import/no-cycle
import {
  generateOTPAPI,
  validateEmail,
  resendOTPSignUp,
  verifyOtp,
  signUp,
  validateAccountDomain,
  getCountryList,
  validateEmailDomain,
} from '../../axios/apiService/signUp.apiService';
import { getDropDownOptionListForCountry, routeNavigate, setAdminProfile, setColorCode, setIsAccountProfileCompleted, setMemberProfile, setPointerEvent, setFlowCreatorProfile, setRole, updatePostLoader, showToastPopover } from '../../utils/UtilityFunctions';
import { BASIC_DETAIL_STRINGS } from '../../containers/sign_up/basic_details/BasicDetails.strings';
import { EMPTY_STRING, NETWORK_ERROR } from '../../utils/strings/CommonStrings';
import { store } from '../../Store';
import { generateGetServerErrorMessage, generatePostServerErrorMessage } from '../../server_validations/ServerValidation';
import { SIGN_UP_LABELS } from '../../containers/sign_up/SignUp.strings';
import { SIGN_UP_STRINGS } from '../../containers/sign_up/otp_verification/OtpVerification.strings';
import { ADDITIONAL_DETAILS_STRINGS } from '../../containers/sign_up/additional_details/AdditionalDetails.strings';
import { setManualAccountCompletionStatus, roleActionAccountLocale } from './Actions';
import { getAuthorizationDetailsApiThunk } from './Layout.Action';
import { updateAccountMainDetails } from '../../axios/apiService/accountSettings.apiService';
// Signup Parent

const cookies = new Cookies();

export const signUpSetStateAction = (data) => (dispatch) => {
  dispatch({
    type: SIGN_UP.SET_STATE,
    payload: data,
  });
  return Promise.resolve();
};

export const signUpClearStateAction = () => {
  return {
    type: SIGN_UP.CLEAR,
  };
};

// Signup Basic Details
const validateEmailApiStarted = () => {
  return {
    type: SIGN_UP_BASIC_DETAILS.STARTED,
  };
};

export const signUpBasicDetailsCancel = () => {
  return {
    type: SIGN_UP_BASIC_DETAILS.CANCEL,
  };
};

export const signUpBasicDetailsSetState = (data) => (dispatch) => {
  dispatch({
    type: SIGN_UP_BASIC_DETAILS.SET_STATE,
    payload: data,
  });
  return Promise.resolve();
};

export const signUpBasicDetailsClearState = () => {
  return {
    type: SIGN_UP_BASIC_DETAILS.CLEAR,
  };
};

export const generateOtpApiAction = (data, navigateToOtp, t) => (dispatch) => {
  generateOTPAPI(data)
    .then((response) => {
      const { email, server_error } = store.getState().SignUpBasicDetailsReducer;
      setPointerEvent(false);
      updatePostLoader(false);
      server_error[BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.ID] = null;
      dispatch(
        signUpBasicDetailsSetState({
          server_error,
          common_server_error: EMPTY_STRING,
          is_data_loading: false,
        }),
      );
      navigateToOtp(email, response._id, response.expiry_in_sec);
    })
    .catch((error) => {
      const { server_error } = store.getState().SignUpBasicDetailsReducer;
      setPointerEvent(false);
      updatePostLoader(false);
      const errors = generatePostServerErrorMessage(error, server_error, SIGN_UP_LABELS(t));
      dispatch(
        signUpBasicDetailsSetState({
          server_error: errors.state_error ? errors.state_error : [],
          common_server_error: errors.common_server_error ? errors.common_server_error : EMPTY_STRING,
          is_data_loading: false,
        }),
      );
    });
};

export const validateEmailApiAction = (data, shouldNavigateToOTPScreenOnSuccess, generateOTPApiCall) => (dispatch) => {
  dispatch(validateEmailApiStarted());
  validateEmail(data)
    .then((response) => {
      if (response.result.data) {
        const { server_error, email } = store.getState().SignUpBasicDetailsReducer;
        server_error[BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.ID] = null;
        dispatch(
          signUpBasicDetailsSetState({
            server_error,
            common_server_error: EMPTY_STRING,
            is_email_unique: true,
            uniqueEmail: email,
            is_data_loading: false,
          }),
        ).then(() => {
          if (shouldNavigateToOTPScreenOnSuccess) generateOTPApiCall();
        });
      }
    })
    .catch((error) => {
      const { server_error } = store.getState().SignUpBasicDetailsReducer;
      const errors = generatePostServerErrorMessage(error, server_error, SIGN_UP_LABELS);
      dispatch(
        signUpBasicDetailsSetState({
          server_error: errors.state_error ? errors.state_error : [],
          common_server_error: errors.common_server_error ? errors.common_server_error : EMPTY_STRING,
          is_email_unique: false,
          is_data_loading: false,
        }),
      );
    });
};

export const validateEmailAndDomainApiAction = (data, shouldNavigateToOTPScreenOnSuccess, generateOTPApiCall, t) => (dispatch) => {
  dispatch(validateEmailApiStarted());
  validateEmailDomain(data)
    .then((response) => {
      if (response.result.data) {
        const { server_error, email } = store.getState().SignUpBasicDetailsReducer;
        server_error[BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.ID] = null;
        dispatch(
          signUpBasicDetailsSetState({
            server_error,
            common_server_error: EMPTY_STRING,
            is_email_unique: true,
            uniqueEmail: email,
            is_data_loading: false,
          }),
        ).then(() => {
          if (shouldNavigateToOTPScreenOnSuccess) generateOTPApiCall();
        });
      }
    })
    .catch((error) => {
      const { server_error } = store.getState().SignUpBasicDetailsReducer;
      const errors = generatePostServerErrorMessage(error, server_error, SIGN_UP_LABELS(t));
      dispatch(
        signUpBasicDetailsSetState({
          server_error: errors.state_error ? errors.state_error : [],
          common_server_error: errors.common_server_error ? errors.common_server_error : EMPTY_STRING,
          is_email_unique: false,
          is_data_loading: false,
        }),
      );
    });
};

// Signup Otp verification
const verifyOtpApiStarted = () => {
  return {
    type: SIGN_UP_OTP_VERIFICATION.STARTED,
  };
};

const resendOtpApiStarted = () => {
  return {
    type: SIGN_UP_OTP_VERIFICATION.STARTED,
  };
};

const resendOtpApiSuccess = () => {
  return {
    type: SIGN_UP_OTP_VERIFICATION.SUCCESS,
  };
};

export const signUpOtpVerificationCancel = () => {
  return {
    type: SIGN_UP_OTP_VERIFICATION.CANCEL,
  };
};

export const signUpOtpVerificationSetState = (data) => (dispatch) => {
  dispatch({
    type: SIGN_UP_OTP_VERIFICATION.SET_STATE,
    payload: data,
  });
  return Promise.resolve();
};

export const signUpOtpVerificationClearState = () => {
  return {
    type: SIGN_UP_OTP_VERIFICATION.CLEAR,
  };
};

export const resendOtpAPIAction = (data, updateUuid, updateOTPError, t) => (dispatch) => {
  dispatch(verifyOtpApiStarted());
  resendOTPSignUp(data)
    .then((response) => {
      updatePostLoader(false);
      setPointerEvent(false);
      dispatch(
        signUpOtpVerificationSetState({
          otp_message_or_error_text: SIGN_UP_STRINGS.RESEND_OTP,
          otp: EMPTY_STRING,
          is_resend_enabled: false,
          block_resend: response.block_resend,
          is_data_loading: false,
        }),
      );
      updateUuid(response._id);
    })
    .catch((error) => {
      const { server_error } = store.getState().SignUpBasicDetailsReducer;
      const errors = generatePostServerErrorMessage(error, server_error, SIGN_UP_LABELS(t));
      updatePostLoader(false);
      setPointerEvent(false);
      if (error.network) {
        dispatch(
          signUpOtpVerificationSetState({
            otp_message_or_error_text: NETWORK_ERROR,
            is_data_loading: false,
          }),
        );
      } else {
      if (errors && errors.common_server_error) {
        dispatch(
          signUpOtpVerificationSetState({
            otp_message_or_error_text: errors.common_server_error ? errors.common_server_error : null,
            is_data_loading: false,
          }),
        );
      }
      }
      updateOTPError(error);
    });
};

export const verifyOtpAPIAction = (data, navigateToAccountInfo, updateOTPError, t) => (dispatch) => {
  dispatch(resendOtpApiStarted());
  verifyOtp(data)
    .then((response) => {
      dispatch(resendOtpApiSuccess());
      updatePostLoader(false);
      setPointerEvent(false);
      if (response.result.data) {
        navigateToAccountInfo();
      }
    })
    .catch((error) => {
      const { server_error } = store.getState().SignUpBasicDetailsReducer;
      const errors = generatePostServerErrorMessage(error, server_error, SIGN_UP_LABELS(t));
      updatePostLoader(false);
      setPointerEvent(false);
      dispatch(
        signUpOtpVerificationSetState({
          otp_message_or_error_text: errors.common_server_error ? errors.common_server_error : SIGN_UP_STRINGS.INVALID_OTP,
          is_data_loading: false,
        }),
      );
      updateOTPError(error);
    });
};

// Signup Additional Details
const signUpApiThunkStarted = () => {
  return {
    type: SIGN_UP_ADDITIONAL_DETAILS.STARTED,
  };
};

const validateAccountDomainApiThunkStarted = () => {
  return {
    type: SIGN_UP_ADDITIONAL_DETAILS.STARTED,
  };
};

export const signUpAdditionalDetailsCancel = () => {
  return {
    type: SIGN_UP_ADDITIONAL_DETAILS.CANCEL,
  };
};

export const signUpAdditionalDetailsSetState = (data) => (dispatch) => {
  console.log('SignUp.Action306-signUpAdditionalDetailsSetState', data);
  dispatch({
    type: SIGN_UP_ADDITIONAL_DETAILS.SET_STATE,
    payload: data,
  });
  return Promise.resolve();
};

export const signUpAdditionalDetailsClearState = () => {
  console.log('SignUp.Action315-Clear state');
  return {
    type: SIGN_UP_ADDITIONAL_DETAILS.CLEAR,
  };
};

export const signUpApiAction = (data, navigateToSignin, history, func2, t) => (dispatch) => {
  dispatch(signUpApiThunkStarted());
  signUp(data)
    .then((response) => {
      updatePostLoader(false);
      setPointerEvent(false);
      if (response.result.data) {
        dispatch(
          signUpAdditionalDetailsSetState({
            is_data_loading: false,
            server_error: null,
            common_server_error: EMPTY_STRING,
          }),
        );

        if (process.env.NODE_ENV === PRODUCTION) {
          const cookieProps = {
          path: '/',
          domain: getDomainName(window.location.hostname),
        };
        cookies.set('fromSignup', true, cookieProps);
        cookies.set('domain', data.account_domain, cookieProps);
        cookies.set('accountId', response.result.data.account_id, cookieProps);
        cookies.set('email', data.email, cookieProps);
        cookies.set('username', data.username, cookieProps);
        setPrimaryDomainCookie(data.account_domain);
          window.location = `https://${data.account_domain}.${getDomainName(window.location.hostname)}${PASSWORD}`;
        } else {
          routeNavigate(history, ROUTE_METHOD.PUSH, SIGNIN, null, null, true);
        //   const sigInData = { username: data.username, password: data.password, account_id: response.result.data.account_id };
        //   dispatch(signInApiAction(sigInData, history, getAuthorizationDetailsApi));
        }
      }
    })
    .catch((error) => {
      const { server_error } = store.getState().SignUpAdditionalDetailsReducer;
      updatePostLoader(false);
      setPointerEvent(false);
      const errors = generatePostServerErrorMessage(error, server_error, SIGN_UP_LABELS(t));
      if (errors.state_error || errors.common_server_error) {
        dispatch(
          signUpAdditionalDetailsSetState({
            server_error: errors.state_error ? errors.state_error : [],
            common_server_error: errors.common_server_error ? errors.common_server_error : EMPTY_STRING,
            is_data_loading: false,
          }),
        );
      }
    });
};

export const validateAccountDomainApiAction = (data, shouldNavigateToCreateAccountOnSuccess, createAdminAccountAPI, errCallback, t) => {
  const { server_error, account_domain } = store.getState().SignUpAdditionalDetailsReducer;
  return (dispatch) => {
    dispatch(validateAccountDomainApiThunkStarted());
    validateAccountDomain(data)
      .then(() => {
        server_error[ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID] = null;
        dispatch(
          signUpAdditionalDetailsSetState({
            server_error,
            common_server_error: EMPTY_STRING,
            isDomainNameUnique: true,
            uniqueDomainName: account_domain,
            is_data_loading: false,
          }),
        ).then(() => {
          if (shouldNavigateToCreateAccountOnSuccess) createAdminAccountAPI();
        });
        errCallback([]);
      })
      .catch((error) => {
        const errors = generatePostServerErrorMessage(error, server_error, SIGN_UP_LABELS(t));
        if (errors.state_error || errors.common_server_error) {
          dispatch(
            signUpAdditionalDetailsSetState({
              server_error: errors.state_error ? errors.state_error : [],
              common_server_error: errors.common_server_error ? errors.common_server_error : EMPTY_STRING,
              isDomainNameUnique: false,
              is_data_loading: false,
            }),
          );
        }
        errCallback(errors.state_error ? errors.state_error : []);
      });
  };
};

export const accountSettingSaveThunk = (params, languageParams, history) => (dispatch) => {
  dispatch(accountSettingStarted());
  Promise.all([updateAccountMainDetails(params), updateLanguageAndCalendarData(languageParams)])
  .then((response) => {
    console.log('fsddddbv', response);
    if (response) {
      dispatch(setManualAccountCompletionStatus(true));
      dispatch(accountSettingStateChange({ account_setting_open: false }));
      dispatch(accountSettingStateClear());
      dispatch(getAuthorizationDetailsApiThunk(
        history,
        setRole,
        setColorCode,
        setAdminProfile,
        setFlowCreatorProfile,
        setMemberProfile,
        setIsAccountProfileCompleted,
        false,
        false,
        (value) => dispatch(roleActionAccountLocale(value)),
      ));
      showToastPopover(
        translate('error_popover_status.company_settings'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SUCCESS,
        true,
      );
      updatePostLoader(false);
    } else {
      const err = {
        response: {
          status: 500,
        },
      };
      const errors = generateGetServerErrorMessage(err);
      updatePostLoader(false);
      dispatch(accountSettingFailure(errors));
      console.log(errors);
      showToastPopover(
        translate('error_popover_status.somthing_went_wrong_try_again'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
  });
};

export const getCountryListSuccessfull = (params) => {
  return {
    type: ACTION_CONSTANTS.COUNTRY_LIST_SET,
    payload: params,
  };
};

export const getCountryListThunk = () => (dispatch) => {
  getCountryList()
  .then((response) => {
    if (response) {
      dispatch(getCountryListSuccessfull(getDropDownOptionListForCountry(response)));
    } else {
      const err = {
        response: {
          status: 500,
        },
      };
      const errors = generateGetServerErrorMessage(err);
      console.log(errors);
      showToastPopover(
        translate('error_popover_status.somthing_went_wrong_try_again'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
  });
};
