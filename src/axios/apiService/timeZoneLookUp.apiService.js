import axios from 'axios';
import { axiosGetUtils } from '../AxiosHelper';
import { GET_TIMEZONE_DETAILS } from '../../urls/ApiUrls';
import { normalizeTimeZoneLookUpData } from '../apiNormalizer/timeZoneLookUp.apiNormalizer';

const { CancelToken } = axios;
let cancelForGetTimezoneLookup;

const getCancelTokenGetTimeZone = (cancelToken) => {
  cancelForGetTimezoneLookup = cancelToken;
};

export const getTimeZoneLookupData = (params) => new Promise((resolve, reject) => {
  if (cancelForGetTimezoneLookup && cancelForGetTimezoneLookup.cancelToken) {
    cancelForGetTimezoneLookup.cancelToken();
  }
    axiosGetUtils(
      GET_TIMEZONE_DETAILS,
      { params },
      {
        cancelToken: new CancelToken((c) => {
          getCancelTokenGetTimeZone(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeTimeZoneLookUpData(response));
      })
      .catch((error) => {
        if (error && (error.code === 'ERR_CANCELED')) return;
        reject(error);
      });
  });

export default getTimeZoneLookupData;
