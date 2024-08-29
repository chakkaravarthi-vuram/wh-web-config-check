import axios from 'axios';
import { axiosMLGetUtils, axiosMLPostUtils } from 'axios/AxiosMLHelper';
import { normalizeGetModelList, normalizeGetModelDetails } from 'axios/apiNormalizer/mlModel.apiNormalizer';
import { axiosGetUtils } from '../AxiosHelper';
import { GET_MODEL_LIST, GET_MODEL_DETAIL, POST_CALL_MODEL, GET_ML_MODEL_FLOW_LIST } from '../../urls/ApiUrls';
import { normalizePostCallModelData, normalizeGetFlowList } from '../apiNormalizer/mlModel.apiNormalizer';

const { CancelToken } = axios;

export const getModelListApi = (params) =>
  new Promise((resolve, reject) => {
    axiosMLGetUtils(GET_MODEL_LIST, {
      params,
    })
      .then((res) => {
        resolve(normalizeGetModelList(res));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getModelDetailsApi = (params) =>
  new Promise((resolve, reject) => {
    axiosMLGetUtils(GET_MODEL_DETAIL, {
      params,
    })
      .then((res) => {
        resolve(normalizeGetModelDetails(res));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const postCallModelApi = (params) => new Promise((resolve, reject) => {
    axiosMLPostUtils(POST_CALL_MODEL, {
      params,
    })
      .then((res) => {
        console.log('ML res', res);
        resolve(normalizePostCallModelData(res));
      })
      .catch((err) => {
        console.log('ML err', err);
        reject(err);
      });
  });

export const getMLModelFlowList = (params, cancelToken) => {
  console.log('getFlowList api service', params);
  if (cancelToken?.cancelToken) cancelToken.cancelToken();
  return new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_ML_MODEL_FLOW_LIST,
      { params,
        cancelToken: new CancelToken((c) => {
           cancelToken.setCancelToken(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeGetFlowList(response, params.type));
      })
      .catch((error) => {
        reject(error);
      });
});
};
