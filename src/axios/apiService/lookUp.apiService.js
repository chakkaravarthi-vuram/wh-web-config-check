import axios from 'axios';
import { has } from 'utils/jsUtility';
import { EDIT_LOOKUP, GET_ALL_CUSTOM_LOOKUP, SAVE_LOOKUP } from '../../urls/ApiUrls';
import { getLoaderConfig } from '../../utils/UtilityFunctions';
import { normalizeAddNewLookup, normalizeEditLookup, normalizeGetLookup } from '../apiNormalizer/lookUp.apiNormalizer';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';

let cancelForGetLookup;
const { CancelToken } = axios;
export const addNewLookup = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_LOOKUP, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizeAddNewLookup(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const editLookup = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(EDIT_LOOKUP, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizeEditLookup(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
  export const cancelGetLookupRequest = () => {
    cancelForGetLookup && cancelForGetLookup('Get lookup request canceled');
  };
  export const getLookupList = (params) => new Promise((resolve, reject) => {
    console.log('coneterawer lookup action params', params);
    axiosGetUtils(GET_ALL_CUSTOM_LOOKUP, {
      params,
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        cancelForGetLookup = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetLookup(response));
      })
      .catch((error) => {
        if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
        reject(error);
      });
  });

export default addNewLookup;
