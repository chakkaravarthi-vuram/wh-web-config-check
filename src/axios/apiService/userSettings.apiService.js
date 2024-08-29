import axios from 'axios';
import { DECRYPT_API_KEY, DELETE_API_KEY, GENERATE_API_KEY, GET_LIST_API_KEYS, UPDATE_API_KEY_DETAILS } from '../../urls/ApiUrls';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import { normalizeDeleteApiKey, normalizeGetApiKeys, normalizePostApiKey } from '../apiNormalizer/userSettings.apiNormalizer';

const { CancelToken } = axios;

export const getListAllApiKeys = (setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_LIST_API_KEYS, {
    //   params,
    cancelToken: new CancelToken((c) => {
      setCancelToken?.(c);
    }),
    })
      .then((res) => {
        resolve(normalizeGetApiKeys(res));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const generateApiKey = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(GENERATE_API_KEY, data)
      .then((response) => {
        resolve(normalizePostApiKey(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const updateApiKeyDetails = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_API_KEY_DETAILS, data)
      .then((response) => {
        resolve(normalizePostApiKey(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteApiKeyDetails = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_API_KEY, data)
      .then((response) => {
        resolve(normalizeDeleteApiKey(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const decryptApiKey = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(DECRYPT_API_KEY, {
      params,
    })
      .then((res) => {
        resolve(normalizeGetApiKeys(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
