import axios from 'axios';
import { axiosPostUtils, axiosGetUtils } from '../AxiosHelper';
import { GET_USERS_BY_ID, GET_SIGNED_URL, UPDATE_USER_PROFILE, GET_SIGNED_URL_ADMIN, GET_TEMP_SIGNED_URL } from '../../urls/ApiUrls';
import { getLoaderConfig } from '../../utils/UtilityFunctions';
import {
  normalizeGetUserByIdApi,
  normalizeGetUploadSignedUrlApi,
  normalizeUpdateUserProfileApi,
  normalizeGetTempUploadSignedUrlApi,
} from '../apiNormalizer/userProfile.apiNormalizer';

const { CancelToken } = axios;
let cancelForGetUserProfileDetails;
let cancelForGetUploadSignedUrl;
let cancelForUpdateUserProfileDetails;

export const getUserByIdApi = (userId) => new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_USERS_BY_ID,
      { params: { _id: userId, resolutions: { profile_pic: 'medium' } } },
      {
        cancelToken: new CancelToken((c) => {
          cancelForGetUserProfileDetails = c;
        }),
      },
    )
      .then((response) => {
        resolve(normalizeGetUserByIdApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getUploadSignedUrlApi = (data, hidePostLoader = false, isTempFile) => new Promise((resolve, reject) => {
    axiosPostUtils(isTempFile ? GET_TEMP_SIGNED_URL : GET_SIGNED_URL, data, {
      ...getLoaderConfig(hidePostLoader),
      cancelToken: new CancelToken((c) => {
        cancelForGetUploadSignedUrl = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetUploadSignedUrlApi(response, isTempFile));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const getTempUploadSignedUrlApi = (data, hidePostLoader = false) => new Promise((resolve, reject) => {
    axiosPostUtils(GET_TEMP_SIGNED_URL, data, {
      ...getLoaderConfig(hidePostLoader),
      cancelToken: new CancelToken((c) => {
        cancelForGetUploadSignedUrl = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetTempUploadSignedUrlApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getUploadSignedUrlAdminApi = (data, hidePostLoader = false) => new Promise((resolve, reject) => {
  axiosPostUtils(GET_SIGNED_URL_ADMIN, data, {
    ...getLoaderConfig(hidePostLoader),
    cancelToken: new CancelToken((c) => {
      cancelForGetUploadSignedUrl = c;
    }),
  })
    .then((response) => {
      resolve(normalizeGetUploadSignedUrlApi(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const updateUserProfileApi = (post_data) => new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_USER_PROFILE, post_data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        cancelForUpdateUserProfileDetails = c;
      }),
    })
      .then((response) => {
        resolve(normalizeUpdateUserProfileApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const cancelUserProfile = () => () => {
  if (cancelForGetUserProfileDetails) cancelForGetUserProfileDetails();
  if (cancelForGetUploadSignedUrl) cancelForGetUploadSignedUrl();
  if (cancelForUpdateUserProfileDetails) cancelForUpdateUserProfileDetails();
};

export default getUserByIdApi;
