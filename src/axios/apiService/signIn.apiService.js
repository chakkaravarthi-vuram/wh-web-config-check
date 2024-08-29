import axios from 'axios';
import { axiosPostUtils, axiosGetUtils } from '../AxiosHelper';
import {
  PRE_SIGN_IN, SIGN_IN, GOOGLE_SIGN_IN, MICROSOFT_SIGN_IN, EXTERNAL_AUTH_SIGN_IN, FORGET_PASSWORD, VALIDATE_INVITE_USER, UPDATE_INVITE_USER, UPDATE_INVITE_USER_PROFILE, VERFIY_URL, MICROSOFT_HANDLE_REDIRECT,
} from '../../urls/ApiUrls';
import { getLoaderConfig } from '../../utils/UtilityFunctions';
import {
  normalizeForgotPassword, normalizeExternalAuthSignInApiResponse, normalizeOAuthSigninApiResponse, normalizePreSignIn, normalizeSignIn, normalizeValidateInviteUserResponse, normalizeMicrosoftAuthenticate,
} from '../apiNormalizer/signIn.apiNormalizer';
import {
  getForgotPasswordCancelToken, getExternalAuthSignInApiCancelToken,
  getGoogleSigninApiCancelToken, getMicrosoftSignInApiCancelToken, getPreSignInApiCancelToken, getSigninApiCancelToken, getVerifyUrlCancelToken, getMicrosoftSignInRedirectCancelToken,
} from '../../containers/sign_in/SignIn.utils';

const { CancelToken } = axios;

export const setPreSignIn = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(PRE_SIGN_IN, data, {
    ...getLoaderConfig(),
    cancelToken: new CancelToken((c) => {
      getPreSignInApiCancelToken(c);
    }),
  })
    .then((response) => {
      resolve(normalizePreSignIn(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const forgotPassword = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(FORGET_PASSWORD, data, {
    ...getLoaderConfig(),
    cancelToken: new CancelToken((c) => {
      getForgotPasswordCancelToken(c);
    }),
  })
    .then((response) => {
      resolve(normalizeForgotPassword(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const googleSignIn = (code) => new Promise((resolve, reject) => {
  axiosGetUtils(GOOGLE_SIGN_IN, {
    params: { code },
    cancelToken: new CancelToken((c) => {
      getGoogleSigninApiCancelToken(c);
    }),
  })
    .then((response) => resolve(normalizeOAuthSigninApiResponse(response)))
    .catch((err) => reject(err));
});

export const microsoftSignIn = () => new Promise((resolve, reject) => {
  axiosGetUtils(MICROSOFT_SIGN_IN, {
    cancelToken: new CancelToken((c) => {
      getMicrosoftSignInApiCancelToken(c);
    }),
  })
    .then((response) => resolve(normalizeMicrosoftAuthenticate(response)))
    .catch((err) => reject(err));
});

export const microsoftRedirect = (params) => new Promise((resolve, reject) => {
  axiosGetUtils(MICROSOFT_HANDLE_REDIRECT, {
    params,
    cancelToken: new CancelToken((c) => {
      getMicrosoftSignInRedirectCancelToken(c);
    }),
  })
    .then((response) => resolve(normalizeOAuthSigninApiResponse(response)))
    .catch((err) => reject(err));
});

export const setSignIn = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(SIGN_IN, data, {
    ...getLoaderConfig(),
    cancelToken: new CancelToken((c) => {
      getSigninApiCancelToken(c);
    }),
  })
    .then((response) => {
      resolve({ response: normalizeSignIn(response), headers: response.headers });
    })
    .catch((error) => {
      reject(error);
    });
});

export const externalAuthSigninGetApiService = (accountId) => new Promise((resolve, reject) => {
  axiosGetUtils(EXTERNAL_AUTH_SIGN_IN, {
    params: { account_id: accountId },
    cancelToken: new CancelToken((c) => {
      getExternalAuthSignInApiCancelToken(c);
    }),
  }).then((response) => {
    resolve({ response: normalizeExternalAuthSignInApiResponse(response), headers: response.headers });
  }).catch((error) => {
    reject(error);
  });
});

export const validateInviteUser = (inviteUserId) => new Promise((resolve, reject) => {
  axiosPostUtils(VALIDATE_INVITE_USER, inviteUserId, {
    cancelToken: new CancelToken(() => {

    }),
  }).then((response) => {
    resolve(normalizeValidateInviteUserResponse(response));
  }).catch((err) => reject(err));
});

export const updateInviteUserApi = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(UPDATE_INVITE_USER, data, { cancelToken: new CancelToken(() => {}) }).then((response) => resolve({ response: response.data.result.data, headers: response.headers })).catch((error) => reject(error));
});

export const updateInviteUserProfileApi = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(UPDATE_INVITE_USER_PROFILE, data, { cancelToken: new CancelToken(() => {}) }).then((response) => resolve(response.data.result.data)).catch((error) => reject(error));
});

export const urlVerifyApi = () => new Promise((resolve, reject) => {
  axiosGetUtils(VERFIY_URL, {
    cancelToken: new CancelToken((c) => {
      getVerifyUrlCancelToken(c);
    }),
  })
    .then((response) => resolve(response?.data?.result?.data))
    .catch((error) => { reject(error); });
});

export default setPreSignIn;
