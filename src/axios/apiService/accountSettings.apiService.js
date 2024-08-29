import axios from 'axios';
import { axiosPostUtils, axiosGetUtils } from '../AxiosHelper';
import { ACCOUNT_SETTINGS_DETAILS, GET_INDUSTRY_LIST, UPDATE_ACCOUNT_DETAILS } from '../../urls/ApiUrls';
import { getLoaderConfig } from '../../utils/UtilityFunctions';
import {
  normalizeAccountMainDetails,
  normalizeGetIndustryList,
  normalizeUpdateAccountMainDetails,
} from '../apiNormalizer/accountSettings.apiNormalizer';
import { accountSettingApiCancel } from '../../redux/actions/AccountSettings.Action';

const { CancelToken } = axios;
let cancelForAccountDetails;
let cancelForUpdateDetails;
let cancelForGetIndustryListDetails;

export const accountMainDetails = () => new Promise((resolve, reject) => {
    axiosGetUtils(ACCOUNT_SETTINGS_DETAILS, {
      cancelToken: new CancelToken((c) => {
        cancelForAccountDetails = c;
      }),
    })
      .then((response) => {
        resolve(normalizeAccountMainDetails(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const getIndustryList = () => new Promise((resolve, reject) => {
    console.log('API CALLED');
      axiosGetUtils(GET_INDUSTRY_LIST, {
        ...getLoaderConfig(),
        cancelToken: new CancelToken((c) => {
          cancelForGetIndustryListDetails = c;
        }),
      })
        .then((response) => {
          console.log('API CALL response', response);
          resolve(normalizeGetIndustryList(response));
        })
        .catch((error) => {
          console.log('API CALL API ERROR', error);
          reject(error);
        });
    });

export const updateAccountMainDetails = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_ACCOUNT_DETAILS, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        cancelForUpdateDetails = c;
      }),
    })
      .then((response) => {
        resolve(normalizeUpdateAccountMainDetails(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const cancelAccountDetails = (cancelFunction = accountSettingApiCancel) => (dispatch) => {
  if (cancelForAccountDetails) {
    cancelForAccountDetails();
    dispatch(cancelFunction());
  }
};

export const cancelUpdateDetails = (cancelFunction = accountSettingApiCancel) => (dispatch) => {
  if (cancelForUpdateDetails) {
    cancelForUpdateDetails();
    dispatch(cancelFunction());
  }
};

export const cancelGetIndustryListDetails = (cancelFunction = accountSettingApiCancel) => (dispatch) => {
  if (cancelForGetIndustryListDetails) {
    cancelForGetIndustryListDetails();
    dispatch(cancelFunction());
  }
};

export default accountMainDetails;
