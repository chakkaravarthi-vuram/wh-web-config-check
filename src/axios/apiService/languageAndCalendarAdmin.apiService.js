import axios from 'axios';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import { ACCOUNT_LANGUAGE_DETAILS, UPDATE_LANGUAGE_DETAILS } from '../../urls/ApiUrls';

import {
  normalizeAccountLanguageData,
  normalizeUserPreferenceUpdateData,
} from '../apiNormalizer/languageAndCalendarAdmin.apiNormalizer';
import { getLoaderConfig } from '../../utils/UtilityFunctions';

const { CancelToken } = axios;

let cancelForGetLanguageDetails;
let cancelForLanguageDetailsUpdate;

export const getCancelTokenLanguageDetails = (cancelToken) => {
  cancelForGetLanguageDetails = cancelToken;
};
export const getCancelTokenLanguageDetailsUpdate = (cancelToken) => {
  cancelForLanguageDetailsUpdate = cancelToken;
};

export const getLanguageAndCalendarData = (params) => new Promise((resolve, reject) => {
  if (cancelForGetLanguageDetails && cancelForGetLanguageDetails.cancelToken) {
    cancelForGetLanguageDetails.cancelToken();
  }
    axiosGetUtils(
      ACCOUNT_LANGUAGE_DETAILS,
      { params },
      {
        cancelToken: new CancelToken((c) => {
          getCancelTokenLanguageDetails(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeAccountLanguageData(response));
      })
      .catch((error) => {
        if (error && (error.code === 'ERR_CANCELED')) return;
        reject(error);
      });
  });

export const updateLanguageAndCalendarData = (data) => new Promise((resolve, reject) => {
  if (cancelForLanguageDetailsUpdate && cancelForLanguageDetailsUpdate.cancelToken) {
    cancelForLanguageDetailsUpdate.cancelToken();
  }
    console.log('updateLanguageAndCalendarDatatr', data);
    axiosPostUtils(UPDATE_LANGUAGE_DETAILS, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        getCancelTokenLanguageDetailsUpdate(c);
      }),
    })
      .then((response) => {
        const normalizedData = normalizeUserPreferenceUpdateData(response);
        console.log('normalizedData', normalizedData);
        resolve(normalizedData);
      })
      .catch((error) => {
        if (error && (error.code === 'ERR_CANCELED')) return;
        reject(error);
      });
  });

export default getLanguageAndCalendarData;
