import axios from 'axios';
import { axiosPostUtils, axiosGetUtils } from '../AxiosHelper';
import { DELETE_SYSTEM_EVENT, SYSTEM_EVENT } from '../../urls/ApiUrls';
import { normalizeGetAllSystemEvent, normalizeGetSystemEvent, normalizeSaveSystemEvent } from '../apiNormalizer/automatedSystems.apiNormalizer';

const { CancelToken } = axios;

let getAllSystemEventCancelToken = null;
export const getAllSystemEventApi = (params = {}) => {
    getAllSystemEventCancelToken?.();
    return new Promise((resolve, reject) => {
      axiosGetUtils(SYSTEM_EVENT, {
        params,
        cancelToken: new CancelToken((token) => { getAllSystemEventCancelToken = token; }),
      })
        .then((res) => {
          resolve(normalizeGetAllSystemEvent(res));
        })
        .catch((err) => {
          reject(err);
        });
    });
};

let getSystemEventApiCancelToken = null;
export const getSystemEventApi = (eventId) => {
    getSystemEventApiCancelToken?.();
    return new Promise((resolve, reject) => {
      axiosGetUtils(`${SYSTEM_EVENT}/${eventId}`, {
        cancelToken: new CancelToken((token) => { getSystemEventApiCancelToken = token; }),
      })
        .then((res) => {
          resolve(normalizeGetSystemEvent(res));
        })
        .catch((err) => {
          reject(err);
        });
    });
};

let postSystemEventCancelToken = null;
export const saveSystemEventApi = (data) => {
    postSystemEventCancelToken?.();
    return new Promise((resolve, reject) => {
      axiosPostUtils(SYSTEM_EVENT, data, {
        cancelToken: new CancelToken((token) => { postSystemEventCancelToken = token; }),
      })
        .then((res) => {
          resolve(normalizeSaveSystemEvent(res));
        })
        .catch((err) => {
          reject(err);
        });
    });
};

let deleteSystemEventCancelToken = null;
export const deleteSystemEventApi = (data = {}) => {
    deleteSystemEventCancelToken?.();
    return new Promise((resolve, reject) => {
      axiosPostUtils(DELETE_SYSTEM_EVENT, data, {
        cancelToken: new CancelToken((token) => { deleteSystemEventCancelToken = token; }),
      })
        .then(resolve)
        .catch(reject);
    });
};
