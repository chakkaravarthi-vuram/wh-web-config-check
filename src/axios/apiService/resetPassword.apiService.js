import axios from 'axios';
import { axiosPostUtils, axiosGetUtils } from '../AxiosHelper';
import {
  RESET_PASSWORD,
  GET_AUTHORIZATION_DETAILS,
  VALIDATE_FORGET_PASSWORD,
  UPDATE_FORGET_PASSWORD,
  UPDATE_FCM_TOKEN,
  UPDATED_RESET_PASSWORD,
} from '../../urls/ApiUrls';
import { getLoaderConfig } from '../../utils/UtilityFunctions';
import {
  normalizeResetPassword,
  normalizeGetAuthorizationDetails,
  normalizeValidateForgetPassword,
  normalizeFCMToken,
  normalizeUpdatedResetPassword,
} from '../apiNormalizer/resetPassword.apiNormalizer';
import { resetPasswordCancelThunk } from '../../redux/actions/ResetPassword.Action';

const { CancelToken } = axios;
let cancelForResetPassword;
let cancelForGetAuthApi;
let cancelForUpdatedResetPassword;

export const resetPassword = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(RESET_PASSWORD, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        cancelForResetPassword = c;
      }),
    })
      .then((response) => {
        resolve({ response: normalizeResetPassword(response), headers: response.headers });
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const updatedResetPassword = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(UPDATED_RESET_PASSWORD, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        cancelForUpdatedResetPassword = c;
      }),
    })
      .then((response) => {
        resolve({ response: normalizeUpdatedResetPassword(response) });
      })
      .catch((error) => {
        reject(error);
      });
  });

export const updateForgetPasswordApiService = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(UPDATE_FORGET_PASSWORD, data, {
    ...getLoaderConfig(),
    cancelToken: new CancelToken((c) => {
      cancelForResetPassword = c;
    }),
  })
    .then((response) => {
      resolve({ response: normalizeResetPassword(response), headers: response.headers });
    })
    .catch((error) => {
      reject(error);
    });
});

export const validateForgetPasswordApi = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(VALIDATE_FORGET_PASSWORD, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        cancelForResetPassword = c;
      }),
    })
      .then((response) => {
        resolve(normalizeValidateForgetPassword(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getAuthorizationDetails = () => new Promise((resolve, reject) => {
    axiosGetUtils(GET_AUTHORIZATION_DETAILS, {
      cancelToken: new CancelToken((c) => {
        cancelForGetAuthApi = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetAuthorizationDetails(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const updateFCMToken = (params) => new Promise((resolve, reject) => {
  axiosPostUtils(UPDATE_FCM_TOKEN, params, {
    ...getLoaderConfig(),
    cancelToken: new CancelToken((c) => {
      cancelForResetPassword = c;
    }),
  })
    .then((response) => {
      resolve(normalizeFCMToken(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const cancelTokenForGetAuthorizationDetailsAndClearState = (
  cancelFunction = resetPasswordCancelThunk,
) => (dispatch) => {
  if (cancelForGetAuthApi) {
    cancelForGetAuthApi();
    dispatch(cancelFunction());
  }
};

export const cancelResetPassword = () => (dispatch) => {
  if (cancelForResetPassword) cancelForResetPassword();
  cancelTokenForGetAuthorizationDetailsAndClearState();
  dispatch(resetPasswordCancelThunk());
};

export const cancelUpdatedResetPassword = () => (dispatch) => {
  if (cancelForUpdatedResetPassword) cancelForUpdatedResetPassword();
  cancelTokenForGetAuthorizationDetailsAndClearState();
  dispatch(resetPasswordCancelThunk());
};
export default resetPassword;
