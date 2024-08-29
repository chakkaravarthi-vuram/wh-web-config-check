import axios from 'axios';
import { axiosGetUtils } from '../AxiosHelper';
import { GET_LOCALE_DETAILS } from '../../urls/ApiUrls';
import { normalizeLocaleLookUpData } from '../apiNormalizer/localeLookUp.apiNormalizer';

const { CancelToken } = axios;
let cancelForGetLocaleDetails;

const getCancelTokenForPreferenceDetailsUpdate = (cancelToken) => {
  cancelForGetLocaleDetails = cancelToken;
};
export const getLocaleLookUpData = (params) => new Promise((resolve, reject) => {
  if (cancelForGetLocaleDetails && cancelForGetLocaleDetails.cancelToken) {
    cancelForGetLocaleDetails.cancelToken();
  }
  axiosGetUtils(
    GET_LOCALE_DETAILS,
    { params },
    {
      cancelToken: new CancelToken((c) => {
        getCancelTokenForPreferenceDetailsUpdate(c);
      }),
    },
  )
    .then((response) => {
      resolve(normalizeLocaleLookUpData(response));
    })
    .catch((error) => {
      if (error && (error.code === 'ERR_CANCELED')) return;
      reject(error);
    });
});

export default getLocaleLookUpData;
