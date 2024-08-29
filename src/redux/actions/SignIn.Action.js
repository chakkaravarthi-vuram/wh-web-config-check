import Cookies from 'universal-cookie';
// import { translate } from 'language/config';
import { v4 as uuidv4 } from 'uuid';
import { SERVER_ERROR_CODE_TYPES } from 'utils/ServerConstants';
import queryString from 'query-string';
import {
  forgotPassword,
  googleSignIn,
  microsoftRedirect,
  microsoftSignIn,
  setPreSignIn,
  setSignIn,
  urlVerifyApi,
} from '../../axios/apiService/signIn.apiService';
import { FORGOT_PASSWORD_API, SIGN_IN_API, URL_VERIFY_API } from './ActionConstants';
import { getAuthorizationDetails, updateFCMToken } from '../../axios/apiService/resetPassword.apiService';
import {
  FORGOT_PASSWORD_LABELS,
  FORGOT_PASSWORD_STRINGS,
  SIGN_IN_LABELS,
  SIGN_IN_STRINGS,
} from '../../containers/sign_in/SignIn.strings';
import {
  setPrimaryDomainCookie,
} from '../../containers/sign_in/SignIn.utils';
import {
  generateGetServerErrorMessage,
  generatePostServerErrorMessage,
} from '../../server_validations/ServerValidation';
import { store } from '../../Store';
import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import {
  DEVELOPMENT,
  FORM_POPOVER_STATUS,
  PRODUCTION,
  ROUTE_METHOD,
} from '../../utils/Constants';
import { EXTERNAL_SIGNIN_COOKIE } from '../../utils/constants/signin.constant';
import jsUtils, {
  get,
  getDomainName,
  getSubDomainName,
  has,
  isEmpty,
  translateFunction,
} from '../../utils/jsUtility';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import {
  expiryTimer,
  routeNavigate,
  setPointerEvent,
  showToastPopover,
  updateDefaultLanguage,
  updatePostLoader,
} from '../../utils/UtilityFunctions';
import { externalSigninApiFailure } from './Layout.Action';
import { getAllSearchParams } from '../../utils/taskContentUtils';
import { updateMFAInfo } from './Mfa.Action';

const cookies = new Cookies();

export const signInApiStarted = () => {
  return {
    type: SIGN_IN_API.STARTED,
  };
};

export const signInApiSuccess = () => {
  return {
    type: SIGN_IN_API.SUCCESS,
  };
};

export const signInApiFailure = (error) => {
  return {
    type: SIGN_IN_API.FAILURE,
    payload: { error },
  };
};
export const urlVerifyApiStarted = () => {
  return {
    type: URL_VERIFY_API.STARTED,
  };
};
export const urlVerifyApiSucess = () => {
  return {
    type: URL_VERIFY_API.SUCCESS,
  };
};
export const urlVerifyApiFailure = () => {
  return {
    type: URL_VERIFY_API.FAILURE,
  };
};

export const signInApiCancel = () => {
  return {
    type: SIGN_IN_API.CANCEL,
  };
};

export const signInSetStateAction = (data) => (dispatch) => {
  dispatch({
    type: SIGN_IN_API.SET_STATE,
    payload: data,
  });
  return Promise.resolve();
};

export const signInClearStateAction = () => {
  return {
    type: SIGN_IN_API.CLEAR,
  };
};

export const forgotPasswordSetStateAction = (data) => (dispatch) => {
  dispatch({
    type: FORGOT_PASSWORD_API.SET_STATE,
    payload: data,
  });
  return Promise.resolve();
};

// new reset password page - mani
// export const forgotPasswordSuccessStateAction = () => {
//   return {
//     type: FORGOT_PASSWORD_API.SUCCESS,
//   };
// };

export const forgotPasswordClearStateAction = () => {
  return {
    type: FORGOT_PASSWORD_API.CLEAR,
  };
};

export const verifyUrlAction = () => (dispatch) =>
    new Promise((resolve) => {
      dispatch(urlVerifyApiStarted());
      urlVerifyApi().then((response) => {
          if (!isEmpty(response)) {
            console.log('response', response);
            dispatch(urlVerifyApiSucess());
            resolve(response);
          }
        })
        .catch((error) => {
          try {
            if (jsUtils.get(error, ['response', 'data', 'errors', 0, 'type'], EMPTY_STRING) === SERVER_ERROR_CODE_TYPES.URL_NOT_FOUND) { dispatch(urlVerifyApiFailure()); }
            } catch (error) {
              console.log('checking errors', error);
            }
          resolve(false);
        });
    });

export const signInApiAction =
  (data, history, getAuthorizationDetailsApi) => (dispatch) => {
    let cookieProps = {
      path: '/',
      domain: getDomainName(window.location.hostname),
    };
    if (!cookies.get('whd_id', cookieProps)) {
      cookieProps = { ...cookieProps, expires: new Date(new Date().getTime() + 2147483647 * 1000) };
      cookies.set('whd_id', uuidv4(), cookieProps);
    }
    dispatch(signInApiStarted()); // loader
    setSignIn(data)
      .then(({ response, headers }) => {
        expiryTimer(response.sessionExpiryTime, response.currentTime, history, true);
        dispatch(signInApiSuccess());
        setPointerEvent(false);
        updatePostLoader(false);
        const cookieProps = {
          path: '/',
          domain: getDomainName(window.location.hostname),
        };
        cookies.remove('username', cookieProps); // args(key, domain)
        cookies.remove('domain', cookieProps);
        cookies.remove('accountId', cookieProps);
        cookies.remove('email', cookieProps);
        cookies.remove('fromSignup', cookieProps);
        cookies.remove('isUsernameOrEmail', cookieProps);
        cookies.remove('isEmailSignin', cookieProps);
        if (has(headers, ['csrf-token'])) {
          localStorage.setItem('csrf_token', headers['csrf-token']);
          const newTime = new Date().getTime();
          localStorage.setItem('previous_log_time', newTime);
        }
        if (response?.is_temp_password || response?.is_mfa_verified) {
          if (response?.is_temp_password) {
            // first time on sign-in, you can reset
            const signInState = {
              isForResetPassword: response.is_temp_password,
              username: data.username,
              email: data.email,
            };
            routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.RESET_PASSWORD, EMPTY_STRING, signInState, true);
          } else if (response?.is_mfa_verified) {
            const mfaState = {
              isMfaVerified: response?.is_mfa_verified || false,
              mfaMethod: response?.mfa_method,
              username: data.username,
            };
            routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.MFA_OTP_VERIFICATION, EMPTY_STRING, mfaState, true);
          }
        } else {
          if (!response.is_temp_password && !response.is_mfa_verified) {
            if (response.is_mfa_enforced) {
              store.dispatch(updateMFAInfo({
                isShowMFADetails: true,
              }));
              routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.MFA_OTP_ENFORCED, EMPTY_STRING, {}, true);
            } else {
              getAuthorizationDetailsApi();
              dispatch(signInApiSuccess());
            }
          } else {
          getAuthorizationDetailsApi();
          dispatch(signInApiSuccess());
          }
        }
      })
      .catch((error) => {
        const { server_error } = store.getState().SignInReducer;
        setPointerEvent(false);
        updatePostLoader(false);
        const errors = generatePostServerErrorMessage(
          error,
          server_error,
          SIGN_IN_LABELS(),
        );
        dispatch(
          signInApiFailure({
            server_error: errors.state_error ? errors.state_error : [],
            common_server_error: errors.common_server_error
              ? errors.common_server_error
              : EMPTY_STRING,
          }),
        );
      });
  };
export const googleSignInApiAction = (code, history, t = translateFunction, searchParamState = {}) => (dispatch) => {
  dispatch(signInApiStarted());
  console.log('googleSignInApiAction 209', searchParamState);
  let cookieProps = {
    path: '/',
    domain: getDomainName(window.location.hostname),
  };
  if (!cookies.get('whd_id', cookieProps)) {
    cookieProps = { ...cookieProps, expires: new Date(new Date().getTime() + 2147483647 * 1000) };
    cookies.set('whd_id', uuidv4(), cookieProps);
  }
  googleSignIn(code)
    .then((response) => {
      const domainName = searchParamState?.google_domain || null;
      if (!isEmpty(response)) {
        localStorage.removeItem('csrf_token');
        if (sessionStorage.getItem('browser_tab_uuid')) {
          sessionStorage.removeItem('browser_tab_uuid');
          }
        cookies.set(EXTERNAL_SIGNIN_COOKIE, true, {
          domain: window.location.hostname,
          maxAge: 60,
        });
        if (domainName) {
          console.log('googleSignInApiAction 231', domainName);
          let accountObj = {};
          if (response.length > 1) {
            accountObj = response.find((account) => account.account_domain === domainName);
          } else {
            const accountDetails = response[0];
            if (domainName === response[0]?.account_domain) {
              accountObj = accountDetails;
            }
          }

          const searchParams = {
            accountId: accountObj._id,
            islic: true,
          };

          if (!isEmpty(searchParamState?.nextUrl)) searchParams.nextUrl = searchParamState?.nextUrl;

          const accountSearch = `?${new URLSearchParams(searchParams)}`;
          window.location = `https://${domainName}.${getDomainName(window.location.hostname)}${accountSearch}`;
          // islic - is social media login.
        } else {
          console.log('googleSignInApiAction 250', domainName);
          if (response.length > 1) {
          const searchParams = isEmpty(searchParamState?.nextUrl) ? null : `?nextUrl=${searchParamState?.nextUrl}`;
          routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.CHOOSE_ACCOUNT, searchParams, null, true);
          dispatch(
            signInSetStateAction({
              formStep: SIGN_IN_STRINGS.USER_ACCOUNT_SELECTION,
              error_list: [],
              server_error: [],
              accounts: [...response],
              account_domain: response[0].account_domain,
              account_id: response[0]._id,
              email: response[0].email,
              username: response[0].username,
              isMultipleDomain: true,
            }),
          );
        } else {
          console.log('googleSignInApiAction 269', response);
          dispatch(
            signInSetStateAction({
              isMultipleDomain: false,
            }),
          );
          if (process.env.NODE_ENV === PRODUCTION || window.location.protocol === 'https:') {
            setPrimaryDomainCookie(response[0].account_domain);

            const searchParams = {
              accountId: response[0]._id,
              islic: true,
            };

            if (!isEmpty(searchParamState?.nextUrl)) searchParams.nextUrl = searchParamState?.nextUrl;

            const accountSearch = `?${new URLSearchParams(searchParams)}`;
            window.location = `https://${
              response[0].account_domain
            }.${getDomainName(window.location.hostname)}${accountSearch}`;
          } else {
          console.log('googleSignInApiAction 282', response);
          window.location = `http://${window.location.host}`;
          }
        }
      }
      } else {
        const error = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(error);
        dispatch(
          signInApiFailure({
            common_server_error: errors.common_server_error,
            password: EMPTY_STRING,
          }),
        );
      }
    })
    .catch((err) => {
      console.log('googleSignInApiAction 304', err);
      updatePostLoader(false);
      const { server_error } = store.getState().SignInReducer;
      const errors = generatePostServerErrorMessage(
        err,
        server_error,
        SIGN_IN_LABELS(t),
      );
      dispatch(externalSigninApiFailure(errors));
      routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNIN, null, null, true);

      let messageTitle = t(SIGN_IN_STRINGS.GOOGLE_SIGNIN_ERROR.TITLE);

      if (jsUtils.get(err, ['response', 'data', 'errors', 0, 'type'], EMPTY_STRING) === SERVER_ERROR_CODE_TYPES.INVALID_CREDENTIALS_ERROR) {
        messageTitle = get(errors, 'common_server_error', EMPTY_STRING);
      }

      showToastPopover(
        messageTitle,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    });
};

const handleMsSignInError = (err, dispatch, history, t) => {
  const { server_error } = store.getState().SignInReducer;
  const errors = generatePostServerErrorMessage(
    err,
    server_error,
    SIGN_IN_LABELS(t),
  );
  dispatch(externalSigninApiFailure(errors));
  sessionStorage.clear();
  routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNIN, null, null, true);
  showToastPopover(
    t(SIGN_IN_STRINGS.MICROSOFT_SIGNIN_ERROR.TITLE),
    errors?.common_server_error,
    FORM_POPOVER_STATUS.SERVER_ERROR,
    true,
  );
};

export const microsoftSignInApiAction = (t = translateFunction, history) => (dispatch) => {
  microsoftSignIn()
    .then((res) => {
      const currentParams = queryString.parseUrl(res.redirect_url);
      let newParams = { ...get(currentParams, ['query'], {}) };

      const locationParams = get(window, ['location', 'search'])
        ? getAllSearchParams(
            new URLSearchParams(get(window, ['location', 'search'])),
          )
        : null;

      const nextUrl = locationParams?.nextUrl;
      const subDomain = getSubDomainName(window.location.hostname);

      const customState = {
        auth_uuid: newParams?.state,
        is_microsoft_login: 1,
      };

      if (!isEmpty(subDomain)) customState.wh_domain = subDomain;
      if (!isEmpty(nextUrl)) customState.nextUrl = nextUrl;

      newParams = { ...newParams, state: JSON.stringify(customState) };
      const searchParams = new URLSearchParams(newParams).toString();

      const redirectUri = `${get(currentParams, ['url'], EMPTY_STRING)}?${searchParams}`;

      window.location = redirectUri;
    })
    .catch((err) => handleMsSignInError(err, dispatch, history, t));
};

export const microsoftSignInRedirectAction =
  (params, history, searchParamState = {}, t = translateFunction) => (dispatch) => {
    let cookieProps = {
      path: '/',
      domain: getDomainName(window.location.hostname),
    };
    if (!cookies.get('whd_id', cookieProps)) {
      cookieProps = { ...cookieProps, expires: new Date(new Date().getTime() + 2147483647 * 1000) };
      cookies.set('whd_id', uuidv4(), cookieProps);
    }
    dispatch(signInApiStarted());
    microsoftRedirect(params)
      .then((response) => {
        if (!isEmpty(response)) {
          const domainName = searchParamState?.wh_domain || null;

          localStorage.removeItem('csrf_token');

          if (sessionStorage.getItem('browser_tab_uuid')) {
            sessionStorage.removeItem('browser_tab_uuid');
          }
          sessionStorage.clear();

          cookies.set(EXTERNAL_SIGNIN_COOKIE, true, {
            domain: window.location.hostname,
            maxAge: 60,
          });

          if (domainName) {
            let accountObj = {};
            if (response.length > 1) {
              accountObj = response.find((account) => account.account_domain === domainName);
            } else {
              const accountDetails = response[0];
              if (domainName === response[0]?.account_domain) {
                accountObj = accountDetails;
              }
            }

            const searchParams = {
              accountId: accountObj._id,
              islic: true,
            };

            if (!isEmpty(searchParamState?.nextUrl)) searchParams.nextUrl = searchParamState?.nextUrl;

            const accountSearch = `?${new URLSearchParams(searchParams)}`;
            window.location = `https://${domainName}.${getDomainName(window.location.hostname)}${accountSearch}`;
            // islic - is social media login.
          } else {
            if (response.length > 1) {
              const searchParams = isEmpty(searchParamState?.nextUrl) ? null : `?nextUrl=${searchParamState?.nextUrl}`;

              routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.CHOOSE_ACCOUNT, searchParams, null, true);
              dispatch(
                signInSetStateAction({
                  formStep: SIGN_IN_STRINGS.USER_ACCOUNT_SELECTION,
                  error_list: [],
                  server_error: [],
                  accounts: [...response],
                  account_domain: response[0].account_domain,
                  account_id: response[0]._id,
                  email: response[0].email,
                  username: response[0].username,
                  isMultipleDomain: true,
                }),
              );
            } else {
              dispatch(
                signInSetStateAction({
                  isMultipleDomain: false,
                }),
              );

              const searchParams = {
                accountId: response[0]._id,
                islic: true,
              };

              if (!isEmpty(searchParamState?.nextUrl)) searchParams.nextUrl = searchParamState?.nextUrl;

              const accountSearch = `?${new URLSearchParams(searchParams)}`;

              if (process.env.NODE_ENV === PRODUCTION || window.location.protocol === 'https:') {
                setPrimaryDomainCookie(response[0].account_domain);

                window.location = `https://${
                  response[0].account_domain
                }.${getDomainName(window.location.hostname)}${accountSearch}`;
              } else {
                window.location = `http://${window.location.host}${accountSearch}`;
              }
            }
          }
        } else {
          const error = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(error);
          dispatch(
            signInApiFailure({
              common_server_error: errors.common_server_error,
              password: EMPTY_STRING,
            }),
          );
        }
      })
      .catch((err) => {
        updatePostLoader(false);
        handleMsSignInError(err, dispatch, history, t);
      });
  };

export const updateFCMTokenApiThunk = (params) => () => {
  console.log('FCM Token update success', params);
  setPointerEvent(true);
  updatePostLoader(true);
    updateFCMToken(params).then((response) => {
    console.log('FCM Token update success', response);
    setPointerEvent(false);
    updatePostLoader(false);
    }).catch((error) => {
      setPointerEvent(false);
    updatePostLoader(false);
      console.log('FCM Token update error', error);
    });
};

export const getAuthorizationDetailsApiAction =
  (props, socketConnectionFunction, socket, updateFCMTokenApi = undefined) => async (dispatch) =>
    new Promise((resolve) => {
      if (sessionStorage.getItem('browser_tab_uuid')) {
        sessionStorage.removeItem('browser_tab_uuid');
        }
      //   let cookieProps = {
      //     path: '/',
      //     domain: getDomainName(window.location.hostname),
      //   };
      //   if (!cookies.get('whd_id', cookieProps)) {
      //     cookieProps = { ...cookieProps, expires: new Date(new Date().getTime() + 2147483647 * 1000) };
      //     cookies.set('whd_id', uuidv4(), cookieProps);
      //   }
      dispatch(signInApiStarted());
      getAuthorizationDetails()
        .then(async (response) => {
          if (!isEmpty(response)) {
            if (updateFCMTokenApi) {
              const token = await updateFCMTokenApi();
              console.log('FCM token', token);
            }
            dispatch(signInApiSuccess());
            if (response.current_tab_id) sessionStorage.setItem('browser_tab_uuid', response.current_tab_id);
            updatePostLoader(false);
            const { setUserLocale } = props;
            socketConnectionFunction(
              response.email,
              response._id,
              response.account_id,
              response.first_name,
              response.last_name,
              response.account_domain,
            );
            // const url = response.language_file_url;
            updateDefaultLanguage();
            if (response.pref_locale) {
              setUserLocale({ pref_locale: response.pref_locale });
            }
            resolve(response);
          } else {
            const error = {
              response: {
                status: 500,
              },
            };
            signInApiFailure({
              common_server_error: error,
            });
          }
        })
        .catch((error) => {
          console.log('fdfdsfsff', error);
          const { signInFailure } = props;
          const errors = generateGetServerErrorMessage(error);
          signInFailure({
            common_server_error: errors.common_server_error,
          });
        });
    });

export const forgotPasswordAction = (data, history, t) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  forgotPassword(data)
    .then((response) => {
      if (response) {
        showToastPopover(
          t(FORGOT_PASSWORD_STRINGS.LINK_SENT),
          t(FORGOT_PASSWORD_STRINGS.LINK_SENT_TO_MAIL),
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
        const { email } = store.getState().ForgotPasswordReducer;
        setPointerEvent(false);
        updatePostLoader(false);
        // added a new screen after reset email is sent
        const signInState = { email };
        setTimeout(() => {
          routeNavigate(history, ROUTE_METHOD.REPLACE, ROUTE_CONSTANTS.SIGNIN, EMPTY_STRING, signInState, true);
        }, 2000);
        // new reset password page - mani
        // dispatch(forgotPasswordSuccessStateAction());
      }
    })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      const { server_error } = store.getState().ForgotPasswordReducer;
      const errors = generatePostServerErrorMessage(
        error,
        server_error,
        FORGOT_PASSWORD_LABELS(t),
      );

      dispatch(
        forgotPasswordSetStateAction({
          server_error: errors.state_error ? errors.state_error : [],
          common_server_error: errors.common_server_error
            ? errors.common_server_error
            : EMPTY_STRING,
        }),
      );
    });
};

export const preSignInApiAction = (data, history, location, isSigninFromSubDomain, t = translateFunction) => (dispatch) => {
  dispatch(signInApiStarted());
  setPreSignIn(data)
    .then((res) => {
      if (res) {
        const { account_domain, _id, email, username } = res[0];
        setPointerEvent(false);
        updatePostLoader(false);
        setPrimaryDomainCookie(account_domain);
        console.log('sdsdsddssd', res);
        if (res.length === 1 && process.env.NODE_ENV === PRODUCTION) {
          window.location = `https://${account_domain}.${getDomainName(
            window.location.hostname,
          )}${ROUTE_CONSTANTS.PASSWORD}${window.location.search}`;
          dispatch(
            signInSetStateAction({
              username: username,
              email: email,
            }),
          );
        }
        if (res.length > 1) {
          routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.CHOOSE_ACCOUNT, window.location.search, null, true);
          dispatch(
            signInSetStateAction({
              formStep: SIGN_IN_STRINGS.USER_ACCOUNT_SELECTION,
              error_list: [],
              server_error: [],
              accounts: [...res],
              account_domain: account_domain,
              account_id: _id,
              email: email,
              username: username,
            }),
          );
        } else if (process.env.NODE_ENV === DEVELOPMENT) {
          console.log('sdsdsddssd', res);
          dispatch(
            signInSetStateAction({
              username: username,
              email: email,
            }),
          );
          if (window.location.protocol === 'https:') {
            window.location = `https://${account_domain}.${getDomainName(
              window.location.hostname,
            )}${ROUTE_CONSTANTS.PASSWORD}${window.location.search}`;
          } else {
            routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.PASSWORD, location.search, null, true);
          }
          dispatch(
            signInSetStateAction({
              formStep: SIGN_IN_STRINGS.SIGN_IN_STEP,
              error_list: [],
              server_error: [],
              accounts: [...res],
              account_id: _id,
              account_domain: account_domain,
              email: email,
              username: username,
            }),
          );
        }
        const cookieProps = {
          path: '/',
          domain: getDomainName(window.location.hostname),
        };
        const userName = cookies.get('username', cookieProps);
        const domain = cookies.get('domain', cookieProps);
        const accountId = cookies.get('accountId', cookieProps);
        if (!jsUtils.isEmpty(userName)) {
          cookies.remove('username', cookieProps);
        }
        if (!jsUtils.isEmpty(domain)) {
          cookies.remove('domain', cookieProps);
        }
        if (!jsUtils.isEmpty(accountId)) {
          cookies.remove('accountId', cookieProps);
        }
        if (process.env.NODE_ENV === PRODUCTION || window.location.protocol === 'https:') {
          const state = store.getState().SignInReducer;
          cookies.set('username', username, cookieProps);
          cookies.set('domain', account_domain, cookieProps);
          cookies.set('accountId', _id, cookieProps);
          cookies.set('email', email, cookieProps);
          cookies.set('fromSignup', false, cookieProps);
          cookies.set('isEmailSignin', state.is_email_signin, cookieProps);
          cookies.set('isUsernameOrEmail', state.username_or_email, cookieProps);
        }
      }
    })
    .catch((err) => {
      const { server_error } = store.getState().SignInReducer;
      setPointerEvent(false);
      updatePostLoader(false);
      const errors = generatePostServerErrorMessage(
        err,
        server_error,
        SIGN_IN_LABELS(t),
        t,
      );

      dispatch(
        signInApiFailure({
          server_error: errors.state_error ? errors.state_error : [],
          common_server_error: errors.common_server_error
            ? errors.common_server_error
            : EMPTY_STRING,
        }),
      );
      const errorKeys = jsUtils.isObject(errors.state_error) && Object.keys(errors.state_error);
      if (isSigninFromSubDomain && errors.state_error && errorKeys[0] === 'domain') {
        showToastPopover(
          t('error_popover_status.valid_url'),
          t('error_popover_status.invalid_subdomain'),
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    });
};
