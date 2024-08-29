import socketIOClient from 'socket.io-client';
import { changeLanguage } from 'i18next';
import { translate } from 'language/config';
import { editAnyway } from 'axios/apiService/layout.apiService';
import { FORM_POPOVER_STATUS, ROUTE_METHOD } from 'utils/Constants';
import { SIGN_IN_LABELS, SIGN_IN_STRINGS } from 'containers/sign_in/SignIn.strings';
import { notificationsDataChangeAction } from 'redux/reducer/NotificationsReducer';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { setWelcomeChange, welcomeApiStarted, welcomeApiStopped } from 'redux/reducer/WelcomeInsightsReducer';
import { welcomeMessageApi } from 'axios/apiService/fieldAutoComplete.apiService';
import { EXTERNAL_SIGNIN, LAYOUT } from './ActionConstants';
import { SERVER_ERROR_CODES } from '../../utils/ServerConstants';
import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import {
  NOTIFICATION_BASE_URL, NOTIFICATION_SOCKET_PATH } from '../../urls/ApiUrls';

import { generateGetServerErrorMessage, generateNormalizerValidationError, generatePostServerErrorMessage } from '../../server_validations/ServerValidation';
import {
  consturctTheme,
  expiryTimer,
  routeNavigate,
  setPointerEvent,
  setPriamryLocale,
  showToastPopover,
  updateDefaultLanguage,
  updatePostLoader,
} from '../../utils/UtilityFunctions';
import { get, isEmpty, translateFunction } from '../../utils/jsUtility';

import { store } from '../../Store';

import { userPreferenceDataChangeAction } from './UserPreference.Action';

import { externalAuthSigninGetApiService } from '../../axios/apiService/signIn.apiService';
import { getAuthorizationDetails } from '../../axios/apiService/resetPassword.apiService';
import { removeCachedDetails } from '../../containers/sign_in/SignIn.utils';
import { updateProfileInRedux } from '../../utils/profileUtils';
import { signInApiFailure, signInSetStateAction } from './SignIn.Action';
import { getDmsLinkForPreviewAndDownload } from '../../utils/attachmentUtils';

let socket = null;
let notificationSocket = null;

export const layoutApiStarted = () => {
  return {
    type: LAYOUT.STARTED,
  };
};

export const layoutApiSuccess = () => {
  return {
    type: LAYOUT.SUCCESS,
  };
};

export const layoutApiFailure = (error) => {
  return {
    type: LAYOUT.FAILURE,
    payload: error,
  };
};

export const externalSigninApiStarted = () => {
  return {
    type: EXTERNAL_SIGNIN.STARTED,
  };
};

export const externalSigninApiSuccess = () => {
  return {
    type: EXTERNAL_SIGNIN.SUCCESS,
  };
};

export const externalSigninApiFailure = (error) => {
  return {
    type: EXTERNAL_SIGNIN.FAILURE,
    payload: error,
  };
};

export const layoutApiTokenCancelAction = () => {
  return {
    type: LAYOUT.CANCEL,
  };
};

export const layoutSetState = (data) => (dispatch) => {
  dispatch({
    type: LAYOUT.DATA_CHANGE,
    payload: data,
  });
  return Promise.resolve();
};

export const layoutClearState = () => {
  return {
    type: LAYOUT.CLEAR,
  };
};

const socketConnection = (email, id, account_id, first_name, last_name, account_domain, dispatch) => {
  const { adminProfile } = store.getState().AdminProfileReducer;
  const { flowCreatorProfile } = store.getState().DeveloperProfileReducer;
  const { memberProfile } = store.getState().MemberProfileReducer;
  if (adminProfile && adminProfile.socket) {
    socket = adminProfile.socket;
  } else if (flowCreatorProfile && flowCreatorProfile.socket) {
    socket = flowCreatorProfile.socket;
  } else if (memberProfile && memberProfile.socket) {
    socket = memberProfile.socket;
  }

  if (adminProfile && adminProfile.notificationSocket) {
    notificationSocket = adminProfile.notificationSocket;
  } else if (flowCreatorProfile && flowCreatorProfile.notificationSocket) {
    notificationSocket = flowCreatorProfile.notificationSocket;
  } else if (memberProfile && memberProfile.notificationSocket) {
    notificationSocket = memberProfile.notificationSocket;
  }
  if (!notificationSocket) {
    notificationSocket = socketIOClient(NOTIFICATION_BASE_URL, {
      path: NOTIFICATION_SOCKET_PATH,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      withCredentials: true,
    });
    notificationSocket.on(SIGN_IN_STRINGS.SOCKET_CONNECTION_ESTABLISHED, (socketData) => {
      console.log('Notification Socket - Connection Established', socketData);
      const { total_count } = store.getState().NotificationReducer;
      dispatch(
        notificationsDataChangeAction({ total_count: get(socketData, ['unread_count'], total_count) }),
      );
    });
  }
  return socket;
};

export const getAuthorizationDetailsApiThunk = (
  history,
  setRole,
  setColorCode = null,
  setAdminProfile,
  setFlowCreatorProfile,
  setMemberProfile,
  setIsAccountProfileCompleted,
  isReload = false,
  isFromProfileSettings = false,
  setLocale,
  requestFCMToken = undefined,
  setPriamryLocale,
  setColorTheme = null,
) => (dispatch) => {
  if (sessionStorage.getItem('browser_tab_uuid')) {
    sessionStorage.removeItem('browser_tab_uuid');
  }

  if (!isReload) dispatch(layoutApiStarted());
  getAuthorizationDetails()
    .then(async (response) => {
      console.log('### responseresponse', response);
      localStorage.setItem('application_language', response?.pref_locale);
      let link = document.querySelector("link[rel~='icon']");
      let acc_favicon = EMPTY_STRING;
      if (response?.account_domain) {
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      if (response.acc_favicon) {
        acc_favicon = `${getDmsLinkForPreviewAndDownload(
          history,
        )}${SIGN_IN_STRINGS.DMS_LINK}${response.acc_favicon}`;
        link.href = acc_favicon;
        dispatch(signInSetStateAction({
          acc_favicon: acc_favicon,
        }));
      }
      document.title = response.account_name;
    }
      changeLanguage(localStorage.getItem('application_language'));
      removeCachedDetails();

      const colorTheme = response?.theme?.color;
      setColorTheme && setColorTheme(consturctTheme(colorTheme));
      if (requestFCMToken) {
        const token = await requestFCMToken();
        console.log('FCM token1', token);
      }
      dispatch(layoutApiSuccess());
      if (response.current_tab_id) sessionStorage.setItem('browser_tab_uuid', response.current_tab_id);
      socketConnection(
        response.email,
        response._id,
        response.account_id,
        response.first_name,
        response.last_name,
        response.account_domain,
        dispatch,
      );
      updateProfileInRedux(
        response,
        setRole,
        setColorCode,
        socket,
        setAdminProfile,
        setFlowCreatorProfile,
        setMemberProfile,
        setIsAccountProfileCompleted,
        setLocale,
        notificationSocket,
        setPriamryLocale,
      );
      if (!isFromProfileSettings && response.pref_locale) dispatch(userPreferenceDataChangeAction({ pref_locale: response.pref_locale }));

      updateDefaultLanguage();
    })
    .catch((error) => {
      console.log('errorerror', error);
      if (error && error.response) {
        if (sessionStorage.getItem('browser_tab_uuid')) {
          sessionStorage.removeItem('browser_tab_uuid');
        }
      }
      if (error && error.response) {
        if (error.response.status === SERVER_ERROR_CODES.PAGE_NOT_FOUND) {
          dispatch(
            layoutSetState({
              showPageNotFound: true,
            }),
          );
        }
        if (
          error.response.status === SERVER_ERROR_CODES.UNAUTHORIZED &&
          window.location.pathname === ROUTE_CONSTANTS.SIGNIN
        ) {
          dispatch(
            layoutSetState({
              showUnauthorized: true,
            }),
          );
        }
      }
      const errors = generateGetServerErrorMessage(error);
      dispatch(
        layoutApiFailure(errors.common_server_error),
      );
    });
};

export const externalAuthSigninGetApiAction = (
  history,
  setRole,
  setColorCode = null,
  setAdminProfile,
  setFlowCreatorProfile,
  setMemberProfile,
  setIsAccountProfileCompleted,
  setLocale,
  accountId,
  t = translateFunction,
) => (dispatch) => {
  console.log('gasdgasfgafsg', accountId);
  if (isEmpty(accountId) || accountId === 'undefined' || accountId === undefined) {
    showToastPopover(
      SIGN_IN_STRINGS.INVALID_CREDENTIALS.TITLE,
      EMPTY_STRING,
      FORM_POPOVER_STATUS.SERVER_ERROR,
      true,
    );
    routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNIN, null, null, true);
  } else {
    dispatch(externalSigninApiStarted());
    externalAuthSigninGetApiService(accountId).then(({ response, headers }) => {
      expiryTimer(response.sessionExpiryTime, response.currentTime, history, true);
      dispatch(externalSigninApiSuccess());
      if (!isEmpty(get(headers, ['csrf-token']))) {
        localStorage.setItem('csrf_token', headers['csrf-token']);
        const newTime = new Date().getTime();
        localStorage.setItem('previous_log_time', newTime);
        dispatch(
          getAuthorizationDetailsApiThunk(
            history,
            setRole,
            setColorCode,
            setAdminProfile,
            setFlowCreatorProfile,
            setMemberProfile,
            setIsAccountProfileCompleted,
            false,
            false,
            setLocale,
            false,
            setPriamryLocale,
          ),
        );
      } else {
        generateNormalizerValidationError(dispatch, externalSigninApiFailure);
      }
    }).catch((error) => {
      const errors = generateGetServerErrorMessage(error);
      dispatch(
        externalSigninApiFailure(errors.common_server_error),
      );
      const errorPostServerError = generatePostServerErrorMessage(
        error,
        [],
        SIGN_IN_LABELS(t),
      );
      if (errorPostServerError?.common_server_error?.includes(SIGN_IN_STRINGS.HAS_BEEN_BLOCKED)) {
        dispatch(
          signInApiFailure({
            server_error: errorPostServerError.state_error ? errorPostServerError.state_error : [],
            common_server_error: errorPostServerError.common_server_error
              ? errorPostServerError.common_server_error
              : EMPTY_STRING,
          }),
        );
      }
    });
  }
};

export const editAnywayApiThunk =
  (params, apiUrl, setCancelToken) =>
    () => {
      setPointerEvent(true);
      updatePostLoader(true);
      return editAnyway(params, apiUrl, setCancelToken)
        .then(() => {
          console.log('');
          setPointerEvent(false);
          updatePostLoader(false);
          window.location.reload();
          return Promise.resolve();
        })
        .catch(() => {
          setPointerEvent(false);
          updatePostLoader(false);
          showToastPopover(
            translate('error_popover_status.error_in_editing'),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          return Promise.resolve();
        });
    };

export const getWelcomeMessageThunk = () => (dispatch) => {
  dispatch(welcomeApiStarted());
  welcomeMessageApi()
    .then((response) => {
      dispatch(welcomeApiStopped());
      if (response) {
        dispatch(setWelcomeChange({
          WelcomeMessage: response.greeting_message,
          WorkloadMessage: response.workload_message,
        }));
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        console.log(errors);
        showToastPopover(
          'Something went wrong!, try again',
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    })
    .catch((error) => {
      if (error?.response?.data) {
        dispatch(welcomeApiStopped());
        console.log(error);
      }
    });
};

export default layoutSetState;
