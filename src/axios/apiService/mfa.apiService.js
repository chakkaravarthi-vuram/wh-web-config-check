import axios from 'axios';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import { normalizeIsEmpty } from '../../utils/UtilityFunctions';
import { USER_MFA_DETAILS, ENABLE_OR_DISABLE_USER_MFA, VERIFY_MFA, DISABLE_MFA, VALIDATE_MFA, RESEND_LOGIN_MFA_OTP, MFA_SETUP_USER_MFA_DETAILS, MFA_SETUP_ENABLE_OR_DISABLE_USER_MFA, MFA_SETUP_VERIFY_MFA } from '../../urls/ApiUrls';
import { normalizeGetUserMfaDetails, normalizeEnableDisableUserMfa, normalizeVerifyMfa, normalizeDisableMfa, normalizeValidateMfa, normalizeLoginMfaOtpDetails, normalizeVerifyMfaWithHeader } from '../apiNormalizer/mfa.apiNormalizer';

const { CancelToken } = axios;
const setSource = () => CancelToken.source();

// Cancel Token Source's
let sourceUserMfaDetails;
let cancelForEnableDisableMfa;
let cancelForVerifyMfa;
let cancelForDisableMfa;
let sourceResendLoginOtpDetails;

export const userMfaDetailsAPI = (isMFAEnforcedValidation = false) => {
  sourceUserMfaDetails = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(isMFAEnforcedValidation ? MFA_SETUP_USER_MFA_DETAILS : USER_MFA_DETAILS, {
      cancelToken: sourceUserMfaDetails.token,
    })
      .then((res) => {
        const normalizeData = normalizeGetUserMfaDetails(res);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const userEnableOrDisableMfaAPI = (data, isMFAEnforcedValidation = false) => {
  cancelForEnableDisableMfa = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(isMFAEnforcedValidation ? MFA_SETUP_ENABLE_OR_DISABLE_USER_MFA : ENABLE_OR_DISABLE_USER_MFA, data, {
      cancelToken: cancelForEnableDisableMfa.token,
    })
      .then((response) => {
        resolve(normalizeEnableDisableUserMfa(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const verifyMfaAPI = (data, isMFAEnforcedValidation = false) => {
  cancelForVerifyMfa = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(isMFAEnforcedValidation ? MFA_SETUP_VERIFY_MFA : VERIFY_MFA, data, {
      cancelToken: cancelForVerifyMfa.token,
    })
      .then((response) => {
        if (isMFAEnforcedValidation) {
        resolve({ response: normalizeVerifyMfaWithHeader(response), headers: response.headers });
        } else {
          resolve(normalizeVerifyMfa(response));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const validateMfaAPI = (data) => {
  cancelForVerifyMfa = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(VALIDATE_MFA, data, {
      cancelToken: cancelForVerifyMfa.token,
    })
      .then((response) => {
        resolve({ response: normalizeValidateMfa(response), headers: response.headers });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const disableMfaAPI = (data) => {
  cancelForDisableMfa = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(DISABLE_MFA, data, {
      cancelToken: cancelForDisableMfa.token,
    })
      .then((response) => {
        resolve(normalizeDisableMfa(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const resendLoginMfaOtpAPI = (params) => {
  sourceResendLoginOtpDetails = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(RESEND_LOGIN_MFA_OTP, {
      params,
      cancelToken: sourceResendLoginOtpDetails.token,
    })
      .then((res) => {
        resolve(normalizeLoginMfaOtpDetails(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
};
