import axios from 'axios';
import queryString from 'query-string';
import Cookies from 'universal-cookie';

import { cloneDeep } from 'lodash';

import { getDomainName } from 'utils/jsUtility';
import * as ROUTE_CONSTANTS from 'urls/RouteConstants';
import {
  hasOwn,
  logoutClearUtil,
  logoutTimerClear,
  removeActiveDomainCookie,
  showToastPopover,
} from '../utils/UtilityFunctions';
import { store } from '../Store';

import {
  REFRESH_ACCESS_TOKEN,
  CLEAR_SESSION_DETAILS,
  BACKEND_BASE_URL,
  GET_ENCRYPT_DETAILS,
  GET_AUTHORIZATION_DETAILS,
  SIGN_OUT,
} from '../urls/ApiUrls';
import {
  AXIOS_DEFAULT_TIMEOUT,
  SERVER_ERROR_CODE_TYPES,
  SERVER_ERROR_CODES,
} from '../utils/ServerConstants';
import { SIGNIN } from '../urls/RouteConstants';
import {
  FORM_POPOVER_STATUS,
  AUTH_INVALID_ENCRYPTION_DATA_ERROR,
  AUTH_INVALID_ENCRYPTION_SESION_ERROR,
  BACKEND_INVALID_ENCRYPTION_DATA_ERROR,
  BACKEND_INVALID_ENCRYPTION_SESION_ERROR,
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
import { enryptAesEncryptionData } from '../utils/encryptionUtils';
import { ENCRYPTION_APIS, getBaseUrlForAxios, getRefreshTokenApiStatus, setRefreshTokenApiStatus } from './axios.utils';

const urlencode = require('urlencode');

const cookies = new Cookies();

const instance = axios.create({
  timeout: AXIOS_DEFAULT_TIMEOUT,
});

const waitingQueue = [];

const addToWaitingQueue = (cb) => {
  waitingQueue.push(cb);
};

const retryWaitingReq = (csrfToken) => {
  waitingQueue.forEach((cb) => cb(csrfToken));
};
let csrfChangeListener = false;

const updateHeadersAndRetry = async ({ originalReqConfig, axios, retryWaitingReq }) => {
  csrfChangeListener = true;
  const cycle = setInterval(async () => {
    if (!getRefreshTokenApiStatus()) {
      csrfChangeListener = false;
      clearInterval(cycle);
      const updatedCsrf = localStorage.getItem('csrf_token');
      originalReqConfig.headers['csrf-token'] = updatedCsrf;
      await axios.request(originalReqConfig);
      return retryWaitingReq(updatedCsrf);
    }
    return null;
  }, 1000);
  return null;
};

instance.defaults.baseURL = BACKEND_BASE_URL;
instance.interceptors.request.use(
  async (request) => {
    if (localStorage.getItem('x-correlation-id')) request.headers.common['x-correlation-id'] = localStorage.getItem('x-correlation-id');
    if (localStorage.getItem('csrf_token')) {
      const csrfToken = localStorage.getItem('csrf_token');
      request.headers.common['csrf-token'] = csrfToken;
    }
    const cookieProps = {
      path: '/',
      domain: getDomainName(window.location.hostname),
    };
    if (cookies.get('whd_id', cookieProps)
    // (jsUtils.get(request, ['url'], '').includes('/auth/'))
    ) {
      request.headers.common.whd_id = cookies.get('whd_id', cookieProps);
    }
    if (sessionStorage.getItem('browser_tab_uuid')) {
      const current_tab_id = sessionStorage.getItem('browser_tab_uuid');
      request.headers.common.browser_tab_uuid = current_tab_id;
    }
    if (ENCRYPTION_APIS.includes(request.url) && process.env.REACT_APP_ENCRYPTION_ENABLED === '1') {
        const encryptionDetails = JSON.parse(
          localStorage.getItem('encryption_details'),
        );
        if (
          encryptionDetails
          && encryptionDetails.pks_id
          && encryptionDetails.public_key
          && encryptionDetails.aes_key
          && encryptionDetails.aek
        ) {
          request.headers.common.pks_id = encryptionDetails.pks_id;
          request.headers.common.aek = encryptionDetails.aek;
          if (request.method === 'get') {
            if (!jsUtils.isEmpty(request.params)) {
              const paramsToBeEncrypted = jsUtils.cloneDeep(request.params);
              await store.dispatch(setEncryptionParams(paramsToBeEncrypted));
              request.params = {
                request_enc_query: urlencode(
                  enryptAesEncryptionData(
                    request.params,
                    encryptionDetails.aes_key,
                  ),
                ),
              };
            }
          } else {
            const dataToBeEncrypted = jsUtils.cloneDeep(request.data);
            await store.dispatch(setEncryptionData(dataToBeEncrypted));
            request.data = {
              request_enc_body: enryptAesEncryptionData(
                request.data,
                encryptionDetails.aes_key,
              ),
            };
          }
        } else {
          const encyptionResponseDetails = await getEncryptionDetailsThunk(
            GET_ENCRYPT_DETAILS,
            request,
          );
          if (!jsUtils.isEmpty(encyptionResponseDetails)) {
            request.headers.common.pks_id = encyptionResponseDetails.pks_id;
            request.headers.common.aek = encyptionResponseDetails.aek;
            if (request.method === 'get') {
              if (!jsUtils.isEmpty(request.params)) {
                request.params = {
                  request_enc_query: urlencode(
                    enryptAesEncryptionData(
                      request.params,
                      encyptionResponseDetails.aes_key,
                    ),
                  ),
                };
              }
            } else {
              request.data = {
                request_enc_body: enryptAesEncryptionData(
                  request.data,
                  encyptionResponseDetails.aes_key,
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
    if (request.url.includes('/admin') || request.url.includes('/api') || request.url.includes('/billing') || request.url.includes('/notification') || request.url.includes('/auth') || request.url.includes('/signup')) {
      request.baseURL = getBaseUrlForAxios(request.url);
      // encryption yet to handle
    }

    request.withCredentials = true;
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
  (response) => {
    if (!localStorage.getItem('x-correlation-id')) {
      localStorage.setItem(
        'x-correlation-id',
        response.headers['x-correlation-id'],
      );
    }
    if (response.request.responseURL.includes('/admin') || response.request.responseURL.includes('/api') || response.request.responseURL.includes('/auth')) {
      // decryption yet to handle
    }
    return response;
  },
  async (error) => {
    if (
      error
      && error.response
      && error.response.data
      && (
        error.response.data?.errors?.[0]?.type === SERVER_ERROR_CODE_TYPES.INVALID_ACTIVE_SESSION
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
      && error.response.data.errors[0].is_token_expired
      && !jsUtils.includes(error.config.url, REFRESH_ACCESS_TOKEN)
      && !jsUtils.includes(error.config.url, CLEAR_SESSION_DETAILS)
      && !jsUtils.includes(error.config.url, SIGN_OUT)
    ) {
      try {
        const originalReqConfig = error.response.config;
        console.log('Initiate refresh access token 1 RE Axios', getRefreshTokenApiStatus(), originalReqConfig.headers['csrf-token'], localStorage.getItem('csrf_token'));
        if (!getRefreshTokenApiStatus() && (originalReqConfig.headers['csrf-token'] === localStorage.getItem('csrf_token'))) {
          setRefreshTokenApiStatus(true);
          const { headers } = await refreshAccessToken();
          originalReqConfig.headers['csrf-token'] = headers['csrf-token'];
          const data = await axios.request(originalReqConfig);
          return data;
        } else {
          if (!csrfChangeListener) {
            console.log('BE event listener added');
            updateHeadersAndRetry({ originalReqConfig, axios, retryWaitingReq });
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
          (err.response
            && err.response.data
            && (err.response.data.errors[0].type
            === SERVER_ERROR_CODE_TYPES.CSRF_TOKEN_ERROR ||
            err.response.data.errors[0].type
            === SERVER_ERROR_CODE_TYPES.AUTH_ERROR))
          || err.response.data.error_code
          === SERVER_ERROR_CODES.URL_NOT_FOUND_ERROR
        ) {
          console.log('axios-47');
          localStorage.removeItem('csrf_token');
          if (sessionStorage.getItem('browser_tab_uuid')) {
            sessionStorage.removeItem('browser_tab_uuid');
          }
          logoutTimerClear();
          localStorage.removeItem('previous_log_time');
          removePrimaryDomainCookie();
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
      && (!error.response.data.errors[0].is_business)
      && (error.response.data.errors[0].type
        === SERVER_ERROR_CODE_TYPES.CSRF_TOKEN_ERROR
        || error.response.data.error_code
        === SERVER_ERROR_CODES.URL_NOT_FOUND_ERROR)
      && !jsUtils.includes(error.config.url, REFRESH_ACCESS_TOKEN)
      && !jsUtils.includes(error.config.url, CLEAR_SESSION_DETAILS)
      && !jsUtils.includes(error.config.url, GET_AUTHORIZATION_DETAILS)
    ) {
      const { role } = store.getState().RoleReducer;
      console.log('here error response', error.response);
      localStorage.removeItem('csrf_token');
      if (sessionStorage.getItem('browser_tab_uuid')) {
        sessionStorage.removeItem('browser_tab_uuid');
      }
      logoutTimerClear();
      localStorage.removeItem('previous_log_time');
      removePrimaryDomainCookie();
      removeActiveDomainCookie();
      clearSessionDetails()
        .then(() => {
          try {
            const nextUrl = window.location.search;
            if (nextUrl) {
              window.location = `${window.location.protocol}//${getDomainName(window.location.host)}${ROUTE_CONSTANTS.SIGNIN}${nextUrl}`;
            } else {
              window.location = `${window.location.protocol}//${getDomainName(window.location.host)}${ROUTE_CONSTANTS.SIGNIN}`;
            }
          } catch (err) {
            console.log('axioserror', err);
            if (role) {
              window.location.href = SIGNIN; // redirect to signin page
            }
          }
        })
        .catch(() => {
          console.log('Error in calling clear session details api');
        });
    }

    if (
      error
      && error.response
      && error.response.data
      && error.response.data.errors
      && (!error.response.data.errors[0].is_business)
      && (!error.response.data.errors[0].is_token_expired)
      && (error.response.data.errors[0].type
        === SERVER_ERROR_CODE_TYPES.AUTH_ERROR)
      && !jsUtils.includes(error.config.url, REFRESH_ACCESS_TOKEN)
      && !jsUtils.includes(error.config.url, CLEAR_SESSION_DETAILS)
    ) {
      console.log('axios-481');
      const { role } = store.getState().RoleReducer;
      logoutClearUtil();
      clearSessionDetails()
        .then(() => {
          try {
            const nextUrl = window.location.search;
            if (nextUrl) {
              window.location = `${window.location.protocol}//${getDomainName(window.location.host)}${ROUTE_CONSTANTS.SIGNIN}${nextUrl}`;
            } else {
              window.location = `${window.location.protocol}//${getDomainName(window.location.host)}${ROUTE_CONSTANTS.SIGNIN}`;
            }
          } catch (err) {
            if (role) {
              window.location.href = SIGNIN; // redirect to signin page
            }
          }
        })
        .catch(() => {
          console.log('Error in calling clear session details api');
        });
    }
    if (
      (
        error
        && error.response
        && error.response.data
        && error.response.data.error_code
        === AUTH_INVALID_ENCRYPTION_DATA_ERROR)
      || (error.response && error.response.data.error_code === AUTH_INVALID_ENCRYPTION_SESION_ERROR)
      || (error.response && error.response.data.error_code
        === BACKEND_INVALID_ENCRYPTION_DATA_ERROR)
      || (error.response && error.response.data.error_code === BACKEND_INVALID_ENCRYPTION_SESION_ERROR)
    ) {
      if ((error.response.request.responseURL.includes('/auth') || error.response.request.responseURL.includes('/api')) && process.env.REACT_APP_ENCRYPTION_ENABLED === '1') {
        localStorage.removeItem('encryption_details');
        const encyptionResponseDetails = await getEncryptionDetailsThunk(
          GET_ENCRYPT_DETAILS,
        );
        console.log('get_encrypt_details', encyptionResponseDetails, error);
        if (!jsUtils.isEmpty(encyptionResponseDetails)) {
          localStorage.setItem(
            'encryption_details',
            JSON.stringify(encyptionResponseDetails),
          );
          const config = cloneDeep(error.response.config);
          config.headers.aek = encyptionResponseDetails.aek;
          config.headers.pks_id = encyptionResponseDetails.pks_id;
          if (config.method === 'get') {
            let { requestParams } = cloneDeep(store.getState().EncryptionDataReducer);
            requestParams = {
              request_enc_query: urlencode(
                enryptAesEncryptionData(
                  requestParams,
                  encyptionResponseDetails.aes_key,
                ),
              ),
            };
            config.params = requestParams;
          }
          if (config.method === 'post') {
            const { requestData } = cloneDeep(store.getState().EncryptionDataReducer);
            let postReqData = {};
            if (requestData?.isDBConnector || requestData?.isIntegrationConnector || requestData?.isOAuthCredentials) {
            console.log('requestData', requestData);
              if (requestData?.isDBConnector) {
                delete requestData?.isDBConnector;
                postReqData = {
                  request_enc_data: enryptAesEncryptionData(
                    { connection_details: requestData?.connection_details },
                    encyptionResponseDetails.aes_key,
                  ),
                  ...requestData,
                };
                delete postReqData?.connection_details;
              }
              if (requestData?.isIntegrationConnector) {
                delete requestData?.isIntegrationConnector;
                postReqData = {
                  request_enc_data: enryptAesEncryptionData(
                    { authentication: requestData?.authentication },
                    encyptionResponseDetails.aes_key,
                  ),
                  ...requestData,
                };
                delete postReqData?.authentication;
              }
              if (requestData?.isOAuthCredentials) {
                delete requestData?.isOAuthCredentials;
                delete requestData?.request_enc_data;
                postReqData = {
                  request_enc_data: enryptAesEncryptionData(
                    requestData?.clientData,
                    encyptionResponseDetails.aes_key,
                  ),
                  ...requestData,
                };
                delete postReqData?.clientData;
              }
              config.data = postReqData;
            } else {
            console.log(requestData);
            postReqData = {
              request_enc_body: enryptAesEncryptionData(
                requestData,
                encyptionResponseDetails.aes_key,
              ),
            };
            config.data = postReqData;
            }

            console.log(config);
          }
          return new Promise((resolve, reject) => {
            axios.request({ ...config }).then((_response) => {
              if (!localStorage.getItem('x-correlation-id')) {
                localStorage.setItem(
                  'x-correlation-id',
                  _response.headers['x-correlation-id'],
                );
              }
              return resolve(_response);
            }, (err) => reject(err));
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
      return Promise.reject(error);
    } else return Promise.reject(error);
  },
);
export default instance;
