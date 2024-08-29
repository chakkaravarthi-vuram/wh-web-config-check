import axios from 'axios';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import {
  GET_CONFIGURATION_DETAILS,
  GET_CONFIGURATION_DETAILS_AUTH,
  UPDATE_CONFIGURATION_DETAILS,
  UPDATE_CONFIGURATION_DETAILS_AUTH,
} from '../../urls/ApiUrls';
import {
  getCancelGetConfigurationDetails,
  getCancelUpdateConfigurationDetails,
  getCancelGetConfigurationDetailsAuth,
  getCancelUpdateConfigurationDetailsAuth,
} from '../../containers/admin_settings/other_settings/OtherSettings';
import {
  normalizeAccountConfigurationDetailsApiResponse,
  normalizeAuthAccountConfigurationDetailsApiResponse,
  normalizeUpdateAccountConfigurationDetailsApiResponse,
  normalizeUpdateAuthAccountConfigurationDetailsApiResponse,
} from '../apiNormalizer/accountConfigurationDataAdmin.apiNormalizer';
import { getLoaderConfig } from '../../utils/UtilityFunctions';

const { CancelToken } = axios;

let cancelTokenForAccountConfiguration;

export const getAccountConfigurationDetailsApiService = (params) => new Promise((resolve, reject) => {
    if (cancelTokenForAccountConfiguration) cancelTokenForAccountConfiguration();
    axiosGetUtils(
      GET_CONFIGURATION_DETAILS,
      { params },
      {
        cancelToken: new CancelToken((c) => {
          getCancelGetConfigurationDetails(c);
          cancelTokenForAccountConfiguration = c;
        }),
      },
    )
      .then((response) => {
        resolve(normalizeAccountConfigurationDetailsApiResponse(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getAuthAccountConfigurationDetailsApiService = (params) => new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_CONFIGURATION_DETAILS_AUTH,
      { params },
      {
        cancelToken: new CancelToken((c) => {
          getCancelGetConfigurationDetailsAuth(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeAuthAccountConfigurationDetailsApiResponse(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const updateAccountConfigurationDetailsApiService = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_CONFIGURATION_DETAILS, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        getCancelUpdateConfigurationDetails(c);
      }),
    })
      .then((response) => {
        const normalizedData = normalizeUpdateAccountConfigurationDetailsApiResponse(response);
        resolve(normalizedData);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const updateAuthAccountConfigurationDetailsApiService = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_CONFIGURATION_DETAILS_AUTH, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        getCancelUpdateConfigurationDetailsAuth(c);
      }),
    })
      .then((response) => {
        const normalizedData = normalizeUpdateAuthAccountConfigurationDetailsApiResponse(response);
        resolve(normalizedData);
      })
      .catch((error) => {
        reject(error);
      });
  });

export default getAccountConfigurationDetailsApiService;
