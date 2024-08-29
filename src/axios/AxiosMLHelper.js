import { USERS } from 'utils/strings/CommonStrings';
import axios from './AxiosMLInit';

import { SERVER_ERROR_CODES } from '../utils/ServerConstants';
import {
  updateAlertPopverStatus,
} from '../utils/UtilityFunctions';

export const axiosMLGetUtils = async (relativeURL, options_values) => new Promise((resolve, reject) => {
  if (navigator.onLine) {
    const options = {
      ...options_values,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        // "Access-Control-Allow-Origin": "*",
      },
    };
    console.log('relativeURL, options', relativeURL, options);
    axios
      .get(relativeURL, options)
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
// form data object
export const axiosMLPostUtils = async (relativeURL, data, options_values, isFormData, headersData = {}) =>
  new Promise((resolve, reject) => {
    let options = {};
    if (navigator.onLine) {
      if (isFormData) {
        options = {
          // ...options_values,
          // // withCredentials: true,
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // },
        };
      } else {
        options = {
          ...options_values,
          withCredentials: true,
          headers: { 'Content-Type': 'application/json', ...headersData },
        };
      }
      axios
        .post(relativeURL, data.params, options)
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
              updateAlertPopverStatus(USERS.ROLE_CHANGED_ALERT);
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

export default axiosMLGetUtils;
