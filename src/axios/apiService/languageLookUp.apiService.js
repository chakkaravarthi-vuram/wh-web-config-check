import axios from 'axios';
import { axiosGetUtils } from '../AxiosHelper';
import { GET_LANGUAGE_DETAILS } from '../../urls/ApiUrls';
import { normalizeLanguageLookUpData } from '../apiNormalizer/languageLookUp.apiNormalizer';

const { CancelToken } = axios;
let cancelForLanguageDetails;

const getCancelTokenLanguageDetails = (cancelToken) => {
  cancelForLanguageDetails = cancelToken;
};

export const getLanguageLookupData = (params) => new Promise((resolve, reject) => {
  if (cancelForLanguageDetails && cancelForLanguageDetails.cancelToken) {
    cancelForLanguageDetails.cancelToken();
  }
    axiosGetUtils(
      GET_LANGUAGE_DETAILS,
      { params },
      {
        cancelToken: new CancelToken((c) => {
          getCancelTokenLanguageDetails(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeLanguageLookUpData(response));
      })
      .catch((error) => {
        if (error && (error.code === 'ERR_CANCELED')) return;
        reject(error);
      });
  });

export default getLanguageLookupData;
