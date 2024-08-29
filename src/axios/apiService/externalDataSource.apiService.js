import { axiosPostUtils } from 'axios/AxiosHelper';
import axios from 'axios';
import {
  DELETE_DATA_RULE,
  GET_RULE_DETAILS_BY_ID,
  SAVE_DATA_LIST_QUERY_RULE,
  SAVE_INTEGRATION_RULE,
} from '../../urls/ApiUrls';
import {
  normalizeDataListQueryRuleApi,
  normalizeDeleteDataRuleApi,
  normalizeIntegrationRuleApi,
} from '../apiNormalizer/externalDataSource.apiNormalizer';
import { axiosGetUtils } from '../AxiosHelper';
import { normalizeRuleDetailsById } from '../apiNormalizer/flow.apiNormalizer';
import { normalizeIsEmpty } from '../../utils/UtilityFunctions';

const { CancelToken } = axios;

export const saveIntegrationRuleApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_INTEGRATION_RULE, data)
      .then((response) => {
        resolve(normalizeIntegrationRuleApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveDataListQueryRuleApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_DATA_LIST_QUERY_RULE, data)
      .then((response) => {
        resolve(normalizeDataListQueryRuleApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteDataRuleApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_DATA_RULE, data)
      .then((response) => {
        resolve(normalizeDeleteDataRuleApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

let getRuleDetailsByIdCancelToken = null;
export const getRuleDetailsByIdApi = (ruleId, extraParams = {}) => {
  getRuleDetailsByIdCancelToken?.();

  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_RULE_DETAILS_BY_ID, {
      params: { _id: ruleId, ...(extraParams || {}) },
      cancelToken: new CancelToken((token) => {
        getRuleDetailsByIdCancelToken = token;
      }),
    })
      .then((res) => {
        const normalizeData = normalizeRuleDetailsById(res.data.result.data);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
