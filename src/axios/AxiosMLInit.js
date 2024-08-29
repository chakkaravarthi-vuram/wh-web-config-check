import axios from 'axios';
import queryString from 'query-string';

import { cloneDeep } from 'lodash';

import { hasOwn, logoutTimerClear, removeActiveDomainCookie, showToastPopover } from '../utils/UtilityFunctions';
import { store } from '../Store';

import {
  REFRESH_ACCESS_TOKEN,
  CLEAR_SESSION_DETAILS,
  GET_ML_ENCRYPT_DETAILS,
  ML_BACKEND_API_GATEWAY_BASE_URL,
} from '../urls/ApiUrls';
import {
  // AXIOS_DEFAULT_TIMEOUT,
  SERVER_ERROR_CODE_TYPES,
  SERVER_ERROR_CODES,
} from '../utils/ServerConstants';
import { SIGNIN } from '../urls/RouteConstants';
import {
  FORM_POPOVER_STATUS,
  ML_INVALID_ENCRYPT_SESSION_ERROR,
  ML_INVALID_ENCRYPT_DATA_ERROR,
} from '../utils/Constants';

import { getEncryptionDetailsThunk } from './apiService/encryption.apiService';
import { refreshAccessToken } from './apiService/refreshAccessToken.apiService';
import { clearSessionDetails } from './apiService/clearSessionDetails.apiService';
import jsUtils from '../utils/jsUtility';
import {
  setEncryptionData,
  setEncryptionParams,
} from '../redux/actions/EncryptionData.Action';
import { removePrimaryDomainCookie } from '../containers/sign_in/SignIn.utils';
import {
  decryptAesEncryptionData,
  enryptAesEncryptionData,
} from '../utils/encryptionUtils';
import { getRefreshTokenApiStatus, setRefreshTokenApiStatus } from './axios.utils';

const urlencode = require('urlencode');

const instance = axios.create({
  // timeout: AXIOS_DEFAULT_TIMEOUT,
  timeout: 120000,
});

const waitingQueue = [];

const addToWaitingQueue = (cb) => {
  console.log('ML waiting queue', cb);
  waitingQueue.push(cb);
};

const retryWaitingReq = (csrfToken) => {
  console.log('ML waiting queue retry', csrfToken);
  waitingQueue.forEach((cb) => cb(csrfToken));
};
let csrfChangeListener = false;

const updateHeadersAndRetryML = async ({ originalReqConfig, axios, retryWaitingReq }) => {
  csrfChangeListener = true;
  const cycle = setInterval(async () => {
    if (!getRefreshTokenApiStatus()) {
      csrfChangeListener = false;
      clearInterval(cycle);
      console.log('localstorage sessionstorage console ML', localStorage, originalReqConfig, waitingQueue.length);
      const updatedCsrf = localStorage.getItem('csrf_token');
      originalReqConfig.headers['csrf-token'] = updatedCsrf;
      await axios.request(originalReqConfig);
      retryWaitingReq(updatedCsrf);
    }
  }, 1000);
};

const encryption_on = false;

instance.defaults.baseURL = ML_BACKEND_API_GATEWAY_BASE_URL;
instance.interceptors.request.use(
  async (request) => {
    if (localStorage.getItem('x-correlation-id')) request.headers.common['x-correlation-id'] = localStorage.getItem('x-correlation-id');
    if (localStorage.getItem('csrf_token')) {
      const csrfToken = localStorage.getItem('csrf_token');
      request.headers.common['csrf-token'] = csrfToken;
    }
    if (
      encryption_on
    ) {
      const mlEncryptionDetails = JSON.parse(
        localStorage.getItem('ml_service_encryption_details'),
      );
      console.log('mlEncryptionDetails', mlEncryptionDetails);
      if (
        mlEncryptionDetails &&
        mlEncryptionDetails.session_id &&
        mlEncryptionDetails.public_key &&
        mlEncryptionDetails.aes_key &&
        mlEncryptionDetails.aes_enc_key
      ) {
        console.log('mlEncryptionDetails inside if');
        request.headers.common.session_id = mlEncryptionDetails.session_id;
        request.headers.common.aes_enc_key = mlEncryptionDetails.aes_enc_key;
        if (request.method === 'get') {
          console.log('get methoid', request);
          if (!jsUtils.isEmpty(request.params)) {
            console.log('ifff');
            const paramsToBeEncrypted = jsUtils.cloneDeep(request.params);
            await store.dispatch(setEncryptionParams(paramsToBeEncrypted));
            request.params = {
              request_enc_query: urlencode(
                enryptAesEncryptionData(
                  request.params,
                  mlEncryptionDetails.aes_key,
                ),
              ),
            };
            console.log('request.params', request.params);
          }
        } else {
          console.log('ifff elseeee');
          const dataToBeEncrypted = jsUtils.cloneDeep(request.data);
          await store.dispatch(setEncryptionData(dataToBeEncrypted));
          request.data = {
            request_enc_body: enryptAesEncryptionData(
              request.data,
              mlEncryptionDetails.aes_key,
            ),
          };
        }
      } else {
        const mlEncyptionResponseDetails = await getEncryptionDetailsThunk(
          GET_ML_ENCRYPT_DETAILS,
          request,
        );
        if (!jsUtils.isEmpty(mlEncyptionResponseDetails)) {
          request.headers.common.session_id =
            mlEncyptionResponseDetails.session_id;
          request.headers.common.aes_enc_key =
            mlEncyptionResponseDetails.aes_enc_key;
          if (request.method === 'get') {
            if (!jsUtils.isEmpty(request.params)) {
              request.params = {
                request_enc_query: urlencode(
                  enryptAesEncryptionData(
                    request.params,
                    mlEncyptionResponseDetails.aes_key,
                  ),
                ),
              };
            }
          } else {
            request.data = {
              request_enc_body: enryptAesEncryptionData(
                request.data,
                mlEncyptionResponseDetails.aes_key,
              ),
            };
          }
        } else {
          showToastPopover(
            'Something went wrong!',
            'Refresh and try again.',
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          throw new axios.Cancel('Something went wrong');
        }
      }
    }

    if (request.method === 'get') {
      if (!jsUtils.isEmpty(request.params)) {
        if (hasOwn(request, 'params')) {
          if (!hasOwn(request.params, 'format')) {
            // request.params['format'] = 'json';
          }
        } else {
          const queryParamsAndURL = queryString.parseUrl(request.url);
          if (queryParamsAndURL.query.format !== 'json') {
            request.params = {
              ...request.params,
              // format: 'json',
            };
          }
        }
      }
    }
    const returnRequest = { ...request };
    return returnRequest;
  },
  (error) => {
    throw error;
  },
);

instance.interceptors.response.use(
  async (response) => {
    console.log('res123 ml inside', response);
    let intermediateResponse = cloneDeep(response);

    if (encryption_on && 'response_enc_body' in response.data) {
      const mlEncryptionDetails = JSON.parse(
        localStorage.getItem('ml_service_encryption_details'),
      );
      console.log('res123 ml inside mlEncryptionDetails', mlEncryptionDetails);
      if (!jsUtils.isEmpty(mlEncryptionDetails)) {
        console.log(
          'res123 ml inside mlEncryptionDetails inside',
          mlEncryptionDetails,
        );
        const decryptedResponse = cloneDeep(response);
        decryptedResponse.data = decryptAesEncryptionData(
          response.data.response_enc_body,
          mlEncryptionDetails.aes_key,
        );
        console.log('res123 ml inside decryptedResponse', decryptedResponse);
        intermediateResponse = cloneDeep(decryptedResponse);
      }
    }
    if (intermediateResponse.data.success === true) return intermediateResponse;
    if (
      intermediateResponse &&
      intermediateResponse.data &&
      intermediateResponse.data.errors &&
      intermediateResponse.data.errors[0].is_token_expired &&
      !jsUtils.includes(
        intermediateResponse.config.url,
        REFRESH_ACCESS_TOKEN,
      ) &&
      !jsUtils.includes(intermediateResponse.config.url, CLEAR_SESSION_DETAILS)
    ) {
      try {
        const originalReqConfig = intermediateResponse.config;
        console.log('Initiate refresh access token 1 ML', getRefreshTokenApiStatus(), originalReqConfig.headers['csrf-token'], localStorage.getItem('csrf_token'));

        if (!getRefreshTokenApiStatus() && (originalReqConfig.headers['csrf-token'] === localStorage.getItem('csrf_token'))) {
          console.log('Initiate refresh access token ML', !getRefreshTokenApiStatus());
          setRefreshTokenApiStatus(true);
          const { headers } = await refreshAccessToken();
          originalReqConfig.headers['csrf-token'] = headers['csrf-token'];
          const data = await axios.request(originalReqConfig);
          return data;
        } else {
          if (!csrfChangeListener) {
            console.log('ML event listener added');
            updateHeadersAndRetryML({ originalReqConfig, axios, retryWaitingReq });
          }
        }
        const retryReq = new Promise((resolve, reject) => {
          addToWaitingQueue((csrfToken, err) => {
            if (csrfToken) {
              originalReqConfig.headers['csrf-token'] = csrfToken;
              resolve(axios.request(originalReqConfig));
            } else if (err) {
              reject(err);
            }
          });
        });
        console.log('axios get utils checker pushed', waitingQueue);
        return retryReq;
      } catch (err) {
        setRefreshTokenApiStatus(false);
        retryWaitingReq(null);
        if (
          (err.response &&
            err.response.data &&
            err.response.data.errors[0].type ===
            SERVER_ERROR_CODE_TYPES.CSRF_TOKEN_ERROR) ||
          err.response.data.error_code ===
          SERVER_ERROR_CODES.URL_NOT_FOUND_ERROR
        ) {
          localStorage.removeItem('csrf_token');
          removePrimaryDomainCookie();
          removeActiveDomainCookie();
          logoutTimerClear();
          clearSessionDetails()
            .then(() => {
              window.location.href = SIGNIN; // redirect to signin page
            })
            .catch(() => {
              console.log('Error in calling clear session details api');
            });
        }
      }
    }
    console.log('gsfgsfhas', intermediateResponse?.config?.url);
    if (
      intermediateResponse &&
      intermediateResponse.data &&
      intermediateResponse.data.errors &&
      (intermediateResponse.data.errors[0].type ===
        SERVER_ERROR_CODE_TYPES.CSRF_TOKEN_ERROR ||
        intermediateResponse.data.error_code ===
        SERVER_ERROR_CODES.URL_NOT_FOUND_ERROR ||
        intermediateResponse.data.errors[0].type ===
        SERVER_ERROR_CODE_TYPES.AUTH_ERROR) &&
      !jsUtils.includes(
        intermediateResponse.config.url,
        REFRESH_ACCESS_TOKEN,
      ) &&
      !jsUtils.includes(intermediateResponse.config.url, CLEAR_SESSION_DETAILS)
    ) {
      const { role } = store.getState().RoleReducer;
      console.log('here error response', intermediateResponse);
      localStorage.removeItem('csrf_token');
      removePrimaryDomainCookie();
      removeActiveDomainCookie();
      logoutTimerClear();
      clearSessionDetails()
        .then(() => {
          if (role) {
            window.location.href = SIGNIN; // redirect to signin page
          }
        })
        .catch(() => {
          console.log('Error in calling clear session details api');
        });
    }
    if (
      (intermediateResponse &&
        intermediateResponse.data &&
        intermediateResponse.data.error_code ===
        ML_INVALID_ENCRYPT_SESSION_ERROR) ||
      (intermediateResponse &&
        intermediateResponse.data.error_code ===
        ML_INVALID_ENCRYPT_SESSION_ERROR) ||
      (intermediateResponse &&
        intermediateResponse.data.error_code ===
        ML_INVALID_ENCRYPT_DATA_ERROR) ||
      (intermediateResponse &&
        intermediateResponse.data.error_code ===
        ML_INVALID_ENCRYPT_SESSION_ERROR)
    ) {
      if (
        intermediateResponse &&
        intermediateResponse.request.responseURL.includes('/ml') &&
        encryption_on
      ) {
        localStorage.removeItem('ml_service_encryption_details');
        const mlEncyptionResponseDetails = await getEncryptionDetailsThunk(
          GET_ML_ENCRYPT_DETAILS,
        );
        if (!jsUtils.isEmpty(mlEncyptionResponseDetails)) {
          localStorage.setItem(
            'ml_service_encryption_details',
            JSON.stringify(mlEncyptionResponseDetails),
          );
          const config = cloneDeep(intermediateResponse.config);
          config.headers.aes_enc_key = mlEncyptionResponseDetails.aes_enc_key;
          config.headers.session_id = mlEncyptionResponseDetails.session_id;
          if (config.method === 'get') {
            let { requestParams } = cloneDeep(
              store.getState().EncryptionDataReducer,
            );
            requestParams = {
              request_enc_query: urlencode(
                enryptAesEncryptionData(
                  requestParams,
                  mlEncyptionResponseDetails.aes_key,
                ),
              ),
            };
            config.params = requestParams;
          }
          if (config.method === 'post') {
            let { requestData } = cloneDeep(
              store.getState().EncryptionDataReducer,
            );
            requestData = {
              request_enc_body: enryptAesEncryptionData(
                requestData,
                mlEncyptionResponseDetails.aes_key,
              ),
            };
            config.data = requestData;
          }
          return new Promise((resolve, reject) => {
            axios.request({ ...config }).then(
              (_response) => {
                if (!localStorage.getItem('x-correlation-id')) {
                  localStorage.setItem(
                    'x-correlation-id',
                    _response.headers['x-correlation-id'],
                  );
                }
                if (_response.request.responseURL.includes('/ml')) {
                  if (
                    encryption_on
                  ) {
                    const mlEncryptionDetails = JSON.parse(
                      localStorage.getItem('ml_service_encryption_details'),
                    );
                    if (mlEncryptionDetails) {
                      const decryptedResponse = cloneDeep(_response);
                      decryptedResponse.data = decryptAesEncryptionData(
                        _response.data.response_enc_body,
                        mlEncryptionDetails.aes_key,
                      );
                      console.log(
                        'res123 ml inside ML_INVALID_ENCRYPT_DATA_ERROR mlEncyptionResponseDetails is set fina resolve',
                        decryptedResponse,
                      );
                      return resolve(decryptedResponse);
                    }
                  } else {
                    return resolve(_response);
                  }
                }
                return resolve(_response);
              },
              (err) => reject(err),
            );
          });
        }
        showToastPopover(
          'Something went wrong!',
          'Refresh and try again.',
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
        throw new axios.Cancel('Something went wrong');
      }
    }
    return Promise.reject(intermediateResponse);
  },
  async (error) => {
    if (
      error
      && error.response
      && error.response.data
      && (
        error.response.data?.errors[0]?.type === SERVER_ERROR_CODE_TYPES.INVALID_ACTIVE_SESSION
      )
    ) {
      const searchParams = !jsUtils.isEmpty(window.location.search)
        ? new URLSearchParams(window.location.search)
        : null;

      if (jsUtils.isEmpty(searchParams?.get('ide')) && jsUtils.isEmpty(searchParams?.get('cad'))) {
        const queryParamsObject = {};
        if (searchParams?.size) {
          searchParams?.forEach((value, key) => {
            queryParamsObject[key] = value;
          });
        }
        queryParamsObject.ide = 1; // isDomainExist = 1
        queryParamsObject.cad = error.response.data?.errors[0]?.account_domain; // current active domain
        const nextSearchParams = `?${new URLSearchParams(queryParamsObject)}`;

        window.location.href = `${SIGNIN}${nextSearchParams}`; // redirect to signin page ide = isDomainExist, cad = current active domain
      }
    }

    if (
      error && error.response
      && error.response.data
      && error.response.data.errors
      && error.response.data.errors[0]
      && error.response.data.errors[0].is_token_expired
      && !jsUtils.includes(error.config.url, REFRESH_ACCESS_TOKEN)
      && !jsUtils.includes(error.config.url, CLEAR_SESSION_DETAILS)
    ) {
      try {
        const originalReqConfig = error.response.config;
        if (!getRefreshTokenApiStatus()) {
          console.log('Initiate refresh access token ML', !getRefreshTokenApiStatus());
          setRefreshTokenApiStatus(true);
          const { headers } = await refreshAccessToken();
          originalReqConfig.headers['csrf-token'] = headers['csrf-token'];
          const data = await axios.request(originalReqConfig);
          return data;
        } else {
          if (!csrfChangeListener) {
            console.log('ML event listener added');
            updateHeadersAndRetryML({ originalReqConfig, axios, retryWaitingReq });
          }
        }
        const retryReq = new Promise((resolve, reject) => {
          addToWaitingQueue((csrfToken, err) => {
            if (csrfToken) {
              originalReqConfig.headers['csrf-token'] = csrfToken;
              resolve(axios.request(originalReqConfig));
            } else if (err) {
              reject(err);
            }
          });
        });
        console.log('axios get utils checker pushed', waitingQueue);
        return retryReq;
      } catch (err) {
        setRefreshTokenApiStatus(false);
        retryWaitingReq(null, err);
        if (
          (err.response
            && err.response.data
            && (err.response.data.errors[0].type
              === SERVER_ERROR_CODE_TYPES.CSRF_TOKEN_ERROR ||
              err.response.data.errors[0].type
              === SERVER_ERROR_CODE_TYPES.AUTH_ERROR))
          || err.response.data.error_code
          === SERVER_ERROR_CODES.URL_NOT_FOUND_ERROR
        ) {
          localStorage.removeItem('csrf_token');
          removePrimaryDomainCookie();
          logoutTimerClear();
          removeActiveDomainCookie();
          clearSessionDetails()
            .then(() => {
              window.location.href = SIGNIN; // redirect to signin page
            })
            .catch(() => {
              console.log('Error in calling clear session details api');
            });
        }
      }
    }
    if (
      error
      && error.response
      && error.response.data
      && error.response.data.errors
      && error.response.data.errors[0]
      && (error.response.data.errors[0].type
        === SERVER_ERROR_CODE_TYPES.CSRF_TOKEN_ERROR
        || error.response.data.error_code
        === SERVER_ERROR_CODES.URL_NOT_FOUND_ERROR
        || error.response.data.errors[0].type
        === SERVER_ERROR_CODE_TYPES.AUTH_ERROR)
      && !jsUtils.includes(error.config.url, REFRESH_ACCESS_TOKEN)
      && !jsUtils.includes(error.config.url, CLEAR_SESSION_DETAILS)
    ) {
      const { role } = store.getState().RoleReducer;
      console.log('here error response', error.response);
      localStorage.removeItem('csrf_token');
      removePrimaryDomainCookie();
      logoutTimerClear();
      removeActiveDomainCookie();
      clearSessionDetails()
        .then(() => {
          if (role) {
            window.location.href = SIGNIN; // redirect to signin page
          }
        })
        .catch(() => {
          console.log('Error in calling clear session details api');
        });
    }
    return Promise.reject(error);
  },
);

export default instance;
