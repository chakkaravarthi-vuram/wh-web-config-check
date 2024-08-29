import axios from 'axios';

import { ML_BACKEND_BASE_URL } from '../urls/ApiUrls';
import {
  // AXIOS_DEFAULT_TIMEOUT,
  SERVER_ERROR_CODES,
} from '../utils/ServerConstants';

const axios_instance = axios.create({
  // timeout: AXIOS_DEFAULT_TIMEOUT,
  timeout: 60000,
});

axios_instance.defaults.baseURL = ML_BACKEND_BASE_URL;
axios_instance.interceptors.request.use(
  (request) => {
    if (localStorage.getItem('csrf_token')) {
      const csrfToken = localStorage.getItem('csrf_token');
      request.headers.common['csrf-token'] = csrfToken;
    }

    request.withCredentials = true;
    console.log('request', request.params);
    const returnRequest = { ...request };
    return returnRequest;
  },
  (error) => {
    throw error;
  },
);

export const axiosGetUtilsML = async (relativeURL, options_values) =>
  new Promise((resolve, reject) => {
    if (navigator.onLine) {
      console.log('options_values', options_values);
      axios_instance
        .get(relativeURL, { params: options_values })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.status &&
            error.response.status === SERVER_ERROR_CODES.UNAUTHORIZED &&
            error.response.data &&
            error.response.data.errors &&
            (error.response.data.errors[0].is_role ||
              error.response.data.errors[0].is_token_expired)
          ) {
            if (error.response.data.errors[0].is_role) {
              reject(error);
            }
            if (error.response.data.errors[0].is_token_expired) {
              reject(error);
            }
          } else reject(error);
        });
    } else {
      reject(
        new Error({
          network: 'offline',
        }),
      );
    }
  });

export default axiosGetUtilsML;
