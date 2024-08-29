import { USERS } from 'utils/strings/CommonStrings';
import axios from './axios';

import { SERVER_ERROR_CODES } from '../utils/ServerConstants';
import { updateAlertPopverStatus, hasOwn } from '../utils/UtilityFunctions';

export const axiosGetUtils = async (relativeURL, options_values) =>
  new Promise((resolve, reject) => {
    if (navigator.onLine) {
      const headers = {
        'Content-Type': 'application/json',
      };

      if (
        options_values &&
        hasOwn(options_values, 'isSignOut') &&
        options_values?.isSignOut
      ) {
        const encryptionDetails = localStorage.getItem('encryption_details');
        const encryptionDetailsObj = JSON.parse(encryptionDetails);
        const pksId = encryptionDetailsObj ? encryptionDetailsObj.pks_id : null;
        headers.pks_id = pksId;
      }

      const options = {
        ...options_values,
        withCredentials: true,
        headers: headers,
      };
      axios
        .get(relativeURL, options)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          if (
            hasOwn(error, 'response') &&
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
export const axiosPostUtils = async (
  relativeURL,
  data,
  options_values,
  isFormData,
  headers = {},
) =>
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
          headers: { 'Content-Type': 'application/json', ...headers },
        };
      }
      axios
        .post(relativeURL, data, options)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          if (
            hasOwn(error, 'response') &&
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

  export const axiosPutUtils = async (
    relativeURL,
    data,
    options_values,
    isFormData,
    headers = {},
  ) =>
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
            headers: { 'Content-Type': 'application/json', ...headers },
          };
        }
        axios
          .put(relativeURL, data, options)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            if (
              hasOwn(error, 'response') &&
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

export default axiosPostUtils;
