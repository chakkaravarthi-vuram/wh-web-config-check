import axios from 'axios';

import { axiosGetUtils } from '../AxiosHelper';

import { GET_ALL_FIELDS, GET_DEFAULT_VALUE_RULE_OPERATOR_BY_FIELD_TYPE } from '../../urls/ApiUrls';

const { CancelToken } = axios;

let cancelForExternalFields;

export const getDefaultValueRuleOperator = (params) => new Promise((resolve, reject) => {
  axiosGetUtils(GET_DEFAULT_VALUE_RULE_OPERATOR_BY_FIELD_TYPE, { params, cancelToken: new CancelToken(() => {}) })
    .then((response) => resolve(response.data.result.data))
    .catch((error) => {
      reject(error);
    });
});

export const getExternalFields = (params) => new Promise((resolve, reject) => {
  if (cancelForExternalFields) cancelForExternalFields();
  axiosGetUtils(GET_ALL_FIELDS, {
    params,
    cancelToken: new CancelToken((c) => {
      cancelForExternalFields = c;
    }),
  })
    .then((response) => resolve(response.data.result.data))
    .catch((error) => reject(error));
});
