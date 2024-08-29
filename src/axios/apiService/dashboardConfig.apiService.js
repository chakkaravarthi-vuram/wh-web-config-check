import axios from 'axios';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import {
  GET_DEFAULT_REPORT_BY_ID,
  SAVE_DEFAULT_REPORT,
  GET_DEFAULT_REPORT_BY_UUID,
  GET_ALL_FIELDS,
} from '../../urls/ApiUrls';
import {
  normalizeGetDefaultReportByIdApi,
  normalizeGetDefaultReportByUUIDApi,
  normalizeSaveDefaultReportApi,
} from '../apiNormalizer/dashboardConfig.apiNormalizer';

const { CancelToken } = axios;

export const getDefaultReportByIdApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_DEFAULT_REPORT_BY_ID, {
      params,
    })
      .then((response) => {
        resolve(normalizeGetDefaultReportByIdApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDefaultReportByUUIDApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_DEFAULT_REPORT_BY_UUID, {
      params,
    })
      .then((response) => {
        resolve(normalizeGetDefaultReportByUUIDApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveDefaultReportApi = (data, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_DEFAULT_REPORT, data, {
      cancelToken: new CancelToken((c) => {
        setCancelToken?.(c);
      }),
    })
      .then((response) => {
        resolve(normalizeSaveDefaultReportApi(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getAllDataFieldsApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_FIELDS, { params })
      .then((res) => {
        resolve(res.data.result.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
