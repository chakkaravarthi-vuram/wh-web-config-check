import axios from 'axios';
import { getCancelTokenForGetAllFlowsByCategory, getCancelTokenForGetAllDraftFlows } from 'containers/flow/listFlow/ListFlow';
import { axiosGetUtils } from '../AxiosHelper';

import { GET_ALL_DRAFT_FLOW, GET_ALL_FLOW_CATEGORY_DEV, GET_ALL_FLOW_CATEGORY, GET_DEV_FLOWS } from '../../urls/ApiUrls';
import { normalizeGetAllDevFlowApi, normalizeGetAllDraftFlow, normalizeGetAllFlowCategoryApiService } from '../apiNormalizer/listFlow.apiNormalizer';
import { normalizeIsEmpty } from '../../utils/UtilityFunctions';
import { APP_MODE } from '../../utils/Constants';

const { CancelToken } = axios;

export const getAllDraftFlowApiService = (params) => new Promise((resolve, reject) => {
  axiosGetUtils(GET_ALL_DRAFT_FLOW, {
    params,
    cancelToken: new CancelToken((c) => {
      getCancelTokenForGetAllDraftFlows(c);
    }),
  })
    .then((response) => {
      const normalizedData = normalizeGetAllDraftFlow(response);
      normalizeIsEmpty(normalizedData, resolve, reject);
    })
    .catch((err) => reject(err));
});

export const getAllFlowCategoryApiService = (params, mode = APP_MODE.DEV) => new Promise((resolve, reject) => {
  axiosGetUtils(((mode === APP_MODE.USER) ? GET_ALL_FLOW_CATEGORY : GET_ALL_FLOW_CATEGORY_DEV), {
    params,
    cancelToken: new CancelToken((c) => {
      getCancelTokenForGetAllFlowsByCategory(c);
    }),
  })
    .then((response) => {
      const normalizedData = normalizeGetAllFlowCategoryApiService(response);
      normalizeIsEmpty(normalizedData, resolve, reject);
    })
    .catch((err) => reject(err));
});

export const getAllDevFlowsApiService = async (params, cancelToken) => {
  try {
    if (cancelToken?.cancelToken) cancelToken.cancelToken();
    const response = await axiosGetUtils(GET_DEV_FLOWS, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelToken.setCancelToken(c);
      }),
    });
    return normalizeGetAllDevFlowApi(response?.data?.result?.data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
