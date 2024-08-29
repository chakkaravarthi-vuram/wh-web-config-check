import axios from 'axios';
import { getCancelTokenForGetAllDraftDataLists, getCancelTokenForGetAllDataListsByCategory } from 'containers/data_list/listDataList/ListDataList';
import { axiosGetUtils } from '../AxiosHelper';

import { GET_ALL_DRAFT_DATA_LIST, GET_ALL_DATA_LIST_CATEGORY, GET_ALL_DATA_LIST_CATEGORY_DEV, GET_DEV_DATALISTS } from '../../urls/ApiUrls';
import { normalizeGetAllDraftDataList, normalizeGetAllDataListCategory, normalizeGetAllDevDatalistApi } from '../apiNormalizer/listDataList.apiNormalizer';
import { normalizeIsEmpty } from '../../utils/UtilityFunctions';
import { APP_MODE } from '../../utils/Constants';

const { CancelToken } = axios;

export const getAllDraftDataListApiService = (params) => new Promise((resolve, reject) => {
  axiosGetUtils(GET_ALL_DRAFT_DATA_LIST, {
    params,
    cancelToken: new CancelToken((c) => {
      getCancelTokenForGetAllDraftDataLists(c);
    }),
  })
    .then((response) => {
      const normalizedData = normalizeGetAllDraftDataList(response);
      normalizeIsEmpty(normalizedData, resolve, reject);
    })
    .catch((err) => reject(err));
});

export const getAllDataListCategoryApiService = (params, mode = APP_MODE.DEV) => new Promise((resolve, reject) => {
  axiosGetUtils(((mode === APP_MODE.USER) ? GET_ALL_DATA_LIST_CATEGORY : GET_ALL_DATA_LIST_CATEGORY_DEV), {
    params,
    cancelToken: new CancelToken((c) => {
      getCancelTokenForGetAllDataListsByCategory(c);
    }),
  })
    .then((response) => {
      const normalizedData = normalizeGetAllDataListCategory(response);
      normalizeIsEmpty(normalizedData, resolve, reject);
    })
    .catch((err) => reject(err));
});

export const getAllDevDatalistApiService = async (params, cancelToken) => {
  try {
    if (cancelToken?.cancelToken) cancelToken.cancelToken();
    const response = await axiosGetUtils(GET_DEV_DATALISTS, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelToken.setCancelToken(c);
      }),
    });
    return normalizeGetAllDevDatalistApi(response?.data?.result?.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
