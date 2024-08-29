import axios from 'axios';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import { GET_USER_PREFERENCE_DETAILS, UPDATE_USER_LANGUAGE_AND_TIMEZONE } from '../../urls/ApiUrls';
import {
  normalizeUserPreference,
  normalizeUserPreferenceUpdateData,
} from '../apiNormalizer/userPrefence.apiNormalizer';
import { getLoaderConfig } from '../../utils/UtilityFunctions';

const { CancelToken } = axios;

let cancelForGetPreferenceDetails;
let cancelForGetPreferenceDetailsUpdate;

const getCancelTokenForPreferenceDetails = (cancelToken) => {
  cancelForGetPreferenceDetails = cancelToken;
};
const getCancelTokenForPreferenceDetailsUpdate = (cancelToken) => {
  cancelForGetPreferenceDetailsUpdate = cancelToken;
};

export const getUserPreferenceData = (getCancelToken) => new Promise((resolve, reject) => {
  if (cancelForGetPreferenceDetails && cancelForGetPreferenceDetails.cancelToken) {
    cancelForGetPreferenceDetails.cancelToken();
  }
    axiosGetUtils(
      GET_USER_PREFERENCE_DETAILS,
      {
        cancelToken: new CancelToken((c) => {
          if (getCancelToken) getCancelToken(c);
          else getCancelTokenForPreferenceDetails(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeUserPreference(response));
      })
      .catch((error) => {
        if (error && (error.code === 'ERR_CANCELED')) return;
        reject(error);
      });
  });

export const updateUserPreferenceData = (data) => new Promise((resolve, reject) => {
  if (cancelForGetPreferenceDetailsUpdate && cancelForGetPreferenceDetailsUpdate.cancelToken) {
    cancelForGetPreferenceDetailsUpdate.cancelToken();
  }
    axiosPostUtils(UPDATE_USER_LANGUAGE_AND_TIMEZONE, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        getCancelTokenForPreferenceDetailsUpdate(c);
      }),
    })
      .then(() => {
        const normalizedData = normalizeUserPreferenceUpdateData(data);
        resolve(normalizedData);
      })
      .catch((error) => {
        if (error && (error.code === 'ERR_CANCELED')) return;
        reject(error);
      });
  });

export default getUserPreferenceData;
