import axios from 'axios';

import { SIGNIN } from 'urls/RouteConstants';
import { store } from '../Store';
import { removePrimaryDomainCookie } from '../containers/sign_in/SignIn.utils';
import { refreshAccessToken } from './apiService/refreshAccessToken.apiService';
import { clearSessionDetails } from './apiService/clearSessionDetails.apiService';
import {
  CLEAR_SESSION_DETAILS,
  REFRESH_ACCESS_TOKEN,
  REPORT_ENGINE_BASE_URL,
} from '../urls/ApiUrls';
import {
  AXIOS_DEFAULT_TIMEOUT_FOR_REPORT_ENGINE,
  SERVER_ERROR_CODES,
  SERVER_ERROR_CODE_TYPES,
} from '../utils/ServerConstants';
import jsUtils from '../utils/jsUtility';
import { logoutClearUtil, logoutTimerClear, removeActiveDomainCookie } from '../utils/UtilityFunctions';
import { getRefreshTokenApiStatus, setRefreshTokenApiStatus } from './axios.utils';

const instance = axios.create({
  timeout: AXIOS_DEFAULT_TIMEOUT_FOR_REPORT_ENGINE,
});

instance.defaults.baseURL = REPORT_ENGINE_BASE_URL;
instance.defaults.headers['Content-Type'] =
  'application/x-www-form-urlencoded; charset=UTF-8';

const waitingQueue = [];
const addToWaitingQueue = (cb) => {
  console.log('RE waiting queue', cb);
  waitingQueue.push(cb);
};
const retryWaitingReq = (csrfToken) => {
  console.log('RE waiting queue retry', csrfToken);
  waitingQueue.forEach((cb) => cb(csrfToken));
};
let csrfChangeListener = false;
const updateHeadersAndRetryRE = async ({ originalReqConfig, axios, retryWaitingReq }) => {
  csrfChangeListener = true;
  const cycle = setInterval(async () => {
    if (!getRefreshTokenApiStatus()) {
      csrfChangeListener = false;
      clearInterval(cycle);
      console.log('localstorage sessionstorage console RE', localStorage, originalReqConfig, waitingQueue.length);
      const updatedCsrf = localStorage.getItem('csrf_token');
      originalReqConfig.headers['csrf-token'] = updatedCsrf;
      await axios.request(originalReqConfig);
      retryWaitingReq(updatedCsrf);
    }
  }, 1000);
};

instance.interceptors.request.use(
  async (request) => {
    if (localStorage.getItem('x-correlation-id')) {
      request.headers.common['x-correlation-id'] =
        localStorage.getItem('x-correlation-id');
    }
    if (localStorage.getItem('csrf_token')) {
      const csrfToken = localStorage.getItem('csrf_token');
      request.headers.common['csrf-token'] = csrfToken;
    }
    request.withCredentials = true;
    return request;
  },
  (error) => {
    throw error;
  },
);

instance.interceptors.response.use(
  (response) => response,
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
      error &&
      error.response &&
      error.response.data &&
      error.response.data.errors[0].is_token_expired &&
      !jsUtils.includes(error.config.url, REFRESH_ACCESS_TOKEN) &&
      !jsUtils.includes(error.config.url, CLEAR_SESSION_DETAILS)
    ) {
      try {
        const originalReqConfig = error.response.config;
        console.log('Initiate refresh access token 1 RE Axios Report', getRefreshTokenApiStatus(), originalReqConfig.headers['csrf-token'], localStorage.getItem('csrf_token'));
        if (!getRefreshTokenApiStatus() && (originalReqConfig.headers['csrf-token'] === localStorage.getItem('csrf_token'))) {
          console.log('Initiate refresh access token RE', !getRefreshTokenApiStatus());
          setRefreshTokenApiStatus(true);
          const { headers } = await refreshAccessToken();
          originalReqConfig.headers['csrf-token'] = headers['csrf-token'];
          const data = await axios.request(originalReqConfig);
          return data;
        } else {
          if (!csrfChangeListener) {
            console.log('RE event listener added');
            updateHeadersAndRetryRE({ originalReqConfig, axios, retryWaitingReq });
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
        return retryReq;
      } catch (err) {
        setRefreshTokenApiStatus(false);
        retryWaitingReq(null);
        if (
          (err.response &&
            err.response.data &&
            (err.response.data.errors[0].type
              === SERVER_ERROR_CODE_TYPES.CSRF_TOKEN_ERROR ||
              err.response.data.errors[0].type
              === SERVER_ERROR_CODE_TYPES.AUTH_ERROR)) ||
          err.response.data.error_code ===
            SERVER_ERROR_CODES.URL_NOT_FOUND_ERROR
        ) {
          localStorage.removeItem('csrf_token');
          logoutTimerClear();
          if (sessionStorage.getItem('browser_tab_uuid')) {
            sessionStorage.removeItem('browser_tab_uuid');
          }
          localStorage.removeItem('previous_log_time');
          removePrimaryDomainCookie();
          removeActiveDomainCookie();
          clearSessionDetails()
            .then(() => {
              window.location.href = SIGNIN; // redirect to sign-in page
            })
            .catch(() => {
              console.log('Error in calling clear session details api');
            });
        }
      }
    }
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      !error.response.data.errors[0].is_business &&
      (error.response.data.errors[0].type ===
        SERVER_ERROR_CODE_TYPES.CSRF_TOKEN_ERROR ||
        error.response.data.error_code ===
          SERVER_ERROR_CODES.URL_NOT_FOUND_ERROR) &&
      !jsUtils.includes(error.config.url, REFRESH_ACCESS_TOKEN) &&
      !jsUtils.includes(error.config.url, CLEAR_SESSION_DETAILS)
    ) {
      const { role } = store.getState().RoleReducer;
      localStorage.removeItem('csrf_token');
      logoutTimerClear();
      if (sessionStorage.getItem('browser_tab_uuid')) {
        sessionStorage.removeItem('browser_tab_uuid');
      }
      localStorage.removeItem('previous_log_time');
      removePrimaryDomainCookie();
      removeActiveDomainCookie();
      clearSessionDetails()
        .then(() => {
          try {
            const nextUrl = window.location.search;
            if (nextUrl) {
              window.location = `${
                window.location.protocol
              }//${jsUtils.getDomainName(
                window.location.host,
              )}${SIGNIN}${nextUrl}`;
            } else {
              window.location = `${
                window.location.protocol
              }//${jsUtils.getDomainName(window.location.host)}${SIGNIN}`;
            }
          } catch (err) {
            if (role) {
              window.location.href = SIGNIN; // redirect to sign-in page
            }
          }
        })
        .catch(() => {
          console.log('Error in calling clear session details api');
        });
    }
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      !error.response.data.errors[0].is_business &&
      !error.response.data.errors[0].is_token_expired &&
      error.response.data.errors[0].type ===
        SERVER_ERROR_CODE_TYPES.AUTH_ERROR &&
      !jsUtils.includes(error.config.url, REFRESH_ACCESS_TOKEN) &&
      !jsUtils.includes(error.config.url, CLEAR_SESSION_DETAILS)
    ) {
      const { role } = store.getState().RoleReducer;
      logoutClearUtil();
      clearSessionDetails()
        .then(() => {
          try {
            const nextUrl = window.location.search;
            if (nextUrl) {
              window.location = `${
                window.location.protocol
              }//${jsUtils.getDomainName(
                window.location.host,
              )}${SIGNIN}${nextUrl}`;
            } else {
              window.location = `${
                window.location.protocol
              }//${jsUtils.getDomainName(window.location.host)}${SIGNIN}`;
            }
          } catch (err) {
            if (role) {
              window.location.href = SIGNIN; // redirect to sign-in page
            }
          }
        })
        .catch(() => {
          console.log('Error in calling clear session details api');
        });
      return Promise.reject(error);
    } else return Promise.reject(error);
  },
);

export default instance;
