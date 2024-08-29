// React and npm imports
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';

// Components
import Cookies from 'universal-cookie';
import { withTranslation } from 'react-i18next';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import PageNotFound from 'containers/error_pages/PageNotFound';
import FullPageLoader from 'assets/icons/FullPageLoader';
import { clearSessionDetails } from 'axios/apiService/clearSessionDetails.apiService';
import { store } from 'Store';
import { externalAuthSigninGetApiAction } from 'redux/actions/Layout.Action';
import { EXTERNAL_SIGNIN_COOKIE } from 'utils/constants/signin.constant';
import { notificationsDataChangeAction } from 'redux/reducer/NotificationsReducer';
import { changeLanguage } from 'i18next';
import gClasses from 'scss/Typography.module.scss';
import SignInForm from './sign_in_form/SignInForm';
import UserAccountSelection from './user_account_selection/userAccountSelection';
import PreSignIn from './pre_sign_in_form/PreSignInForm';
import FormStatusPopover from '../../components/popovers/form_status_popover/FormStatusPopover';
import AuthLayout from '../../components/auth_layout/AuthLayout';
// lazy imports
// const PreSignIn = lazy(() => import('./pre_sign_in_form/PreSignInForm'));
// const FormStatusPopover = lazy(() => import('../../components/popovers/form_status_popover/FormStatusPopover'));
// const AuthLayout = lazy(() => import('../../components/auth_layout/AuthLayout'));

// Assets and functions
import {
  adminProfileAction,
  roleAction,
  colorCodeAction,
  memberProfileAction,
  flowCreatorProfileAction,
  updateLanguageAction,
  setAccountCompletionStatus,
  roleActionAccountLocale,
  primaryActionAccountLocale,
} from '../../redux/actions/Actions';
import { cancelTokenForGetAuthorizationDetailsAndClearState } from '../../axios/apiService/resetPassword.apiService';
import {
  signinDetailsValidateSchema,
  preSigninDetailsValidateSchema,
  userAccountSelectionValidateSchema,
} from './SignIn.validation.schema';
import {
  mergeObjects,
  validate,
  navigateToHome,
  routeNavigate,
  consturctTheme,
  showToastPopover,
} from '../../utils/UtilityFunctions';
import {
  signInSetStateAction,
  signInClearStateAction,
  signInApiStarted,
  signInApiSuccess,
  signInApiFailure,
  signInApiCancel,
  getAuthorizationDetailsApiAction,
  signInApiAction,
  preSignInApiAction,
  googleSignInApiAction,
  microsoftSignInApiAction,
  verifyUrlAction,
} from '../../redux/actions/SignIn.Action';
import {
  isUserDetailsCached,
  // getSubdomainUrlRoutingForSignin,
  redirectBasedOnAccountSelection,
  removeCookiesOnSwitchAccount,
  getSignInToken,
  getPreSignInToken,
  getGoogleSignInToken,
  getMicrosoftPreSignInToken,
  removeCookiesIfExists,
  getCachedUserDetails,
  removeCachedDetails,
  getPrimaryDomainFromCookies,
  redirectFromPrimaryDomainToSubDomain,
} from './SignIn.utils';
import jsUtils, {
  cloneDeep,
  get,
  getDomainName,
  getSubDomainName,
  isEmpty,
} from '../../utils/jsUtility';
import { userPreferenceDataChangeAction } from '../../redux/actions/UserPreference.Action';

// CSS imports

// Strings and contsnats

import { SIGN_IN_STRINGS } from './SignIn.strings';
import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import {
  // CHAT_BASE_URL, CHAT_SOCKET_PATH,
  NOTIFICATION_BASE_URL,
  NOTIFICATION_SOCKET_PATH,
} from '../../urls/ApiUrls';
import {
  AUTH_PAGE_TYPES,
  FORM_POPOVER_STATUS,
  PRODUCTION,
  ROUTE_METHOD,
} from '../../utils/Constants';
import { updateProfileInRedux } from '../../utils/profileUtils';
import { setPointerEvent, updatePostLoader } from '../../utils/loaderUtils';
import { requestForToken } from './update_firebase_token/UpdateFirebaseToken';
import ThemeContext from '../../hoc/ThemeContext';
import MfaSetupFromLogin from './mfa_setup/MfaSetupFromLogin';
import MfaOtpVerification from './mfa_otp_verification/MfaOtpVerification';
import { getAllSearchParams } from '../../utils/taskContentUtils';
import { getDmsLinkForPreviewAndDownload } from '../../utils/attachmentUtils';
import MfaVerificationModal from '../mfa/mfa_verification_modal/MfaVerificationModal';
import { getCurrentUserObject } from '../../utils/userUtils';

let signinApiCancelToken;
let preSigninApiCancelToken;
let googleSignInCancelToken;
let microsoftSignInCancelToken;

export const getSigninApiCancelTokenFromUtils = () => {
  signinApiCancelToken = getSignInToken();
};

export const getPreSignInApiCancelTokenFromUtils = () => {
  preSigninApiCancelToken = getPreSignInToken();
};

export const getGoogleSigninApiCancelTokenFromUtils = () => {
  googleSignInCancelToken = getGoogleSignInToken();
};

export const getMicrosoftSignInApiCancelTokenFromUtils = () => {
  microsoftSignInCancelToken = getMicrosoftPreSignInToken();
};
const isSigninFromSubDomain = window.location.hostname.split('.').length > 2;
class SignIn extends Component {
  constructor(props) {
    super(props);
    const { role, history, location } = this.props;
    if (role) {
      const loggedInUser = getCurrentUserObject(role);
      if (history.location.pathname.includes(ROUTE_CONSTANTS.SIGNIN) && !isEmpty(loggedInUser)) {
        routeNavigate(history, ROUTE_METHOD.REPLACE, ROUTE_CONSTANTS.HOME);
      }
      console.log('gotit', history, location);
      const routeConstant = !isEmpty(new URLSearchParams(location?.search).get('nextUrl')) ? decodeURIComponent(new URLSearchParams(location?.search).get('nextUrl')) : ROUTE_CONSTANTS.HOME;
      if (get(location, ['search']) && new URLSearchParams(location?.search).get('accountId')) {
      routeNavigate(history, ROUTE_METHOD.PUSH, routeConstant, EMPTY_STRING);
      } else {
        const searchParams = get(location, ['search'])
        ? getAllSearchParams(new URLSearchParams(get(location, ['search'])))
        : {};
        routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, searchParams);
      }
    }
    console.log('check!@#1', get(location, ['state', 'pathname']));
    if (get(location, ['state', 'pathname'])) {
      const signInSearchParams = `?${new URLSearchParams({
        nextUrl: location.state.pathname,
      }).toString()}`;
      routeNavigate(
        history,
        ROUTE_METHOD.PUSH,
        EMPTY_STRING,
        signInSearchParams,
      );
    }
    // getSubdomainUrlRoutingForSignin();
    this.popoverRef = React.createRef();
  }

  // eslint-disable-next-line react/static-property-placement, react/sort-comp
  static contextType = ThemeContext;

  componentDidMount() {
    const { signInSetState, location, history, state, dispatch, i18n } = this.props;
    const { setColorScheme = null } = this.context;
    const application_language = localStorage.getItem('application_language');
    isSigninFromSubDomain && dispatch(verifyUrlAction()).then((resData) => {
      console.log(resData, 'resData');
      if (!isEmpty(resData)) {
        let acc_favicon = EMPTY_STRING;
        if (resData.acc_favicon) {
          acc_favicon = `${getDmsLinkForPreviewAndDownload(
            history,
          )}${SIGN_IN_STRINGS.PUBLIC_DMS_LINK}${resData.acc_favicon}`;
        }
        let acc_logo = EMPTY_STRING;
        if (resData.acc_logo) {
          acc_logo = `${getDmsLinkForPreviewAndDownload(
            history,
          )}${SIGN_IN_STRINGS.PUBLIC_DMS_LINK}${resData.acc_logo}`;
        }
        const accountLocaleList = [];
        if (!jsUtils.isEmpty(resData?.acc_locale)) {
          resData.acc_locale.forEach((locale) => {
            const account_locale = {
              label: locale.toUpperCase(),
              value: locale,
            };
            accountLocaleList.push(account_locale);
          });
        }
          signInSetState({
            account_name: resData?.account_name,
            acc_favicon: acc_favicon,
            acc_logo: acc_logo,
            isCustomTheme: !!resData?.theme?.color,
            pref_locale: application_language || resData?.primary_locale,
            account_locale: accountLocaleList,
          });
          localStorage.setItem('application_language', application_language || resData?.primary_locale);
          i18n.changeLanguage(application_language || resData?.primary_locale);
          changeLanguage(application_language || resData?.primary_locale);
          setColorScheme && setColorScheme(consturctTheme(resData?.theme?.color));
      }
    });

    const userDetails = getCachedUserDetails();
    const sub_domain = getSubDomainName(window.location.hostname);
    // clearSessionDetails();
    console.log(
      'isUserDetailsCached',
      isUserDetailsCached(userDetails),
      userDetails,
      sub_domain,
    );
    if (isUserDetailsCached(userDetails) && sub_domain) {
      signInSetState({
        username: userDetails.username,
        account_id: userDetails.accountId,
        account_domain: userDetails.domain,
        formStep: SIGN_IN_STRINGS.SIGN_IN_STEP,
        email: userDetails.email,
        direct_from_signin: userDetails.from_signup,
      });
    } else if (isUserDetailsCached(userDetails) && !sub_domain) {
      removeCookiesOnSwitchAccount();
    }
    // if (nullCheck(location, 'state.email')) {
    //   signInSetState({
    //     username: location.state.email,
    //   });
    // }
    if (
      !isUserDetailsCached(userDetails) &&
      userDetails.from_signup !== 'true' &&
      !localStorage.getItem('csrf_token')
    ) {
      routeNavigate(
        history,
        ROUTE_METHOD.REPLACE,
        ROUTE_CONSTANTS.SIGNIN,
        location.search,
        null,
        true,
      );
    }
    if (
      history.location.pathname === ROUTE_CONSTANTS.CHOOSE_ACCOUNT &&
      jsUtils.isEmpty(state.accounts)
    ) {
      routeNavigate(
        history,
        ROUTE_METHOD.REPLACE,
        ROUTE_CONSTANTS.SIGNIN,
        location.search,
        null,
        true,
      );
    }
  }

  componentDidUpdate() {
    const { history, location, state } = this.props;
    if (
      history.location.pathname === ROUTE_CONSTANTS.CHOOSE_ACCOUNT &&
      jsUtils.isEmpty(state.accounts)
    ) {
      routeNavigate(
        history,
        ROUTE_METHOD.REPLACE,
        ROUTE_CONSTANTS.SIGNIN,
        location.search,
        null,
        true,
      );
    }
  }

  componentWillUnmount() {
    const { signInClearState, dispatch } = this.props;
    if (signinApiCancelToken) signinApiCancelToken();
    if (preSigninApiCancelToken) preSigninApiCancelToken();
    if (googleSignInCancelToken) googleSignInCancelToken();
    if (microsoftSignInCancelToken) microsoftSignInCancelToken();
    dispatch(
      cancelTokenForGetAuthorizationDetailsAndClearState(signInApiCancel),
    );
    signInClearState();
  }

  render() {
    const signInForm = this.getSignInFormElement();
    const formStatusPopoverElement = this.getFormStatusPopoverElement();
    const {
      state: { isUrlVerificationLoading, isValidUrl, history },
    } = this.props; // when you try google or microsoft signIn  in dev environment
    const search = get(history, ['location', 'search'], null);
    const searchParams = !isEmpty(search) ? new URLSearchParams(search) : null;
    if (
      isValidUrl &&
      !isUrlVerificationLoading &&
      !searchParams?.get('google_domain')
    ) {
      return (
        <>
          {formStatusPopoverElement}
          {/* <AppBuilder /> */}
          {/* <AppHome /> */}
          {/* <TextInput /> */}
          {/* <Text content='fsdafas' />
        <Thumbnail title="Sample data" backgroundColor="#70a8ff" /> */}

          <AuthLayout
            navBarType={AUTH_PAGE_TYPES.SIGN_IN}
            innerContainer={signInForm}
            innerContainerClasses={gClasses.MT10}
          />
        </>
      );
    } else if (
      !isValidUrl &&
      !isUrlVerificationLoading &&
      !searchParams?.get('google_domain')
    ) {
      return <PageNotFound isFromSignin />;
    } else {
      return <FullPageLoader isDataLoading />;
    }
  }

  onForgotPasswordClick = (e) => {
    e.preventDefault();
    const { state } = this.props;
    const { history } = this.props;
    removeCookiesIfExists();
    const signInState = { email: state.email, account_id: state.account_id };
    routeNavigate(
      history,
      ROUTE_METHOD.PUSH,
      ROUTE_CONSTANTS.FORGOT_PASSWORD,
      EMPTY_STRING,
      signInState,
      true,
    );
  };

  onMicrosoftSignInClickHandler = (event) => {
    const { microsoftSignInApiCall, t, history } = this.props;
    event.preventDefault();
    const primaryDomain = getPrimaryDomainFromCookies();
    clearSessionDetails().then(() => {
      if (process.env.NODE_ENV === PRODUCTION && primaryDomain) {
        window.location = `https://${primaryDomain}.${getDomainName(
          window.location.hostname,
        )}${window.location.search}`;
        return null;
      }
      microsoftSignInApiCall(t, history);
      return null;
    });
  };

  onSignUpClickHandler = () => {
    const { history } = this.props;
    routeNavigate(
      history,
      ROUTE_METHOD.PUSH,
      ROUTE_CONSTANTS.SIGNUP_CREATE,
      null,
      null,
      true,
    );
  };

  onAccountClick = (accountId, accountDomain, email, username) => {
    const { signInSetState, error_list } = this.props;
    // const account_id = (state.account_id !== accountId) ? accountId : null;
    const account_id = accountId;
    signInSetState({
      account_id,
      account_domain: accountDomain,
      email,
      username,
    });
    if (!jsUtils.isEmpty(error_list)) {
      signInSetState({
        error_list: validate(
          { account_id },
          userAccountSelectionValidateSchema,
        ),
      });
    }
    return true;
  };

  onAccountSelected = (event) => {
    event.preventDefault();
    const { signInSetState, state, history, location } = this.props;
    const { search } = location;
    const historySearchParams = !isEmpty(search)
      ? new URLSearchParams(search)
      : null;
    const { isMultipleDomain } = state;
    const error_list = validate(
      { account_id: state.account_id },
      userAccountSelectionValidateSchema,
    );
    signInSetState({
      error_list,
    });
    const cookies = new Cookies();
    if (
      cookies.get(EXTERNAL_SIGNIN_COOKIE) &&
      jsUtils.isEmpty(error_list) &&
      isMultipleDomain
    ) {
      signInSetState({
        isMultipleDomain: false,
      });

      const searchParams = {
        accountId: state.account_id,
        islic: true,
      };

      if (historySearchParams?.get('nextUrl')) searchParams.nextUrl = historySearchParams?.get('nextUrl');

      const accountSearch = `?${new URLSearchParams(searchParams)}`;
      window.location = `https://${state.account_domain}.${getDomainName(
        window.location.hostname,
      )}${accountSearch}`;
    } else {
      if (jsUtils.isEmpty(error_list)) {
        if (
          process.env.NODE_ENV !== PRODUCTION &&
          window.location.protocol !== 'https:'
        ) {
          routeNavigate(
            history,
            ROUTE_METHOD.PUSH,
            ROUTE_CONSTANTS.PASSWORD,
            location.search,
          );
          return signInSetState({
            formStep: SIGN_IN_STRINGS.SIGN_IN_STEP,
            selectAccountError: EMPTY_STRING,
          });
        }
        return redirectBasedOnAccountSelection(
          state.account_domain,
          state.account_id,
          state.email,
          state.username,
        );
      }
    }
    return null;
  };

  onSwitchAccountHandler = async () => {
    const { signInSetState } = this.props;
    if (
      process.env.NODE_ENV !== PRODUCTION &&
      window.location.protocol !== 'https:'
    ) {
      const { history } = this.props;
      routeNavigate(
        history,
        ROUTE_METHOD.PUSH,
        ROUTE_CONSTANTS.SIGNIN,
        null,
        null,
        true,
      );
      await signInSetState({
        formStep: SIGN_IN_STRINGS.PRE_SIGN_IN_STEP,
      });
    }
    signInSetState({
      common_server_error: EMPTY_STRING,
    });
    removeCookiesOnSwitchAccount();
    // if (process.env.NODE_ENV === PRODUCTION || window.location.protocol === 'https:') {
    // react router doesnt know about subdomain(internal in internal.onething.io), so history object cant be used
    //   window.location = `https://${window.location.hostname}${ROUTE_CONSTANTS.SIGNIN}${window.location.search}`;
    //   return null;
    // }
    return null;
  };

  onChangeHandler = (id) => async (event) => {
    const { signInSetState } = this.props;
    if (
      id !== SIGN_IN_STRINGS.EMAIL ||
      /(\.[A-Za-z]{2,})$/.test(event.target.value) ||
      !/(\.[A-Za-z]{2,})([._])*([^\w.])$/.test(event.target.value)
    ) {
      let { value } = event.target;
      if (id === SIGN_IN_STRINGS.EMAIL) {
        value = value.replace(/\.+/g, '.');
      }
      await signInSetState({
        [id]: value,
      });
    }
    // if (!jsUtils.isEmpty(error_list)) {
    //   signInSetState({
    //     error_list: validate(this.getSignInDetailsValidateData(), signinDetailsValidateSchema),
    //   });
    // }
  };

  onLoginOptionSwitchHandler = (id, value) => {
    const { signInSetState } = this.props;
    signInSetState({
      [id]: value,
    });
  };

  onSuccessGoogleSignin = (response) => {
    if (getPrimaryDomainFromCookies()) return redirectFromPrimaryDomainToSubDomain();
    const { googleSignInApiCall, history, t } = this.props;
    googleSignInApiCall(response.code, history, t);
    return null;
  };

  onFailureGoogleSignin = (response) => {
    const { t } = this.props;
    if (response.error !== SIGN_IN_STRINGS.GOOGLE_SIGNIN_INIT_ERROR) {
      showToastPopover(
        t(SIGN_IN_STRINGS.GOOGLE_SIGNIN_ERROR.TITLE),
        response.error,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      updatePostLoader(false);
    }
  };

  onSignInClickedHandler = async (event) => {
    event.preventDefault();
    const { signInSetState, t } = this.props;
    const data = this.getSignInDetailsValidateData();
    const error_list_data = validate(data, signinDetailsValidateSchema(t));
    await signInSetState({
      error_list: error_list_data,
      server_error: [],
    });
    if (jsUtils.isEmpty(error_list_data)) this.signInAPI(data);
  };

  onNextClickedHandler = async (event, t) => {
    const { signInSetState, state } = this.props;
    event.preventDefault();
    const data = this.getPreSignInDetailsValidateData(
      state.is_email_signin,
      isSigninFromSubDomain,
    );
    await signInSetState({
      error_list: validate(data, preSigninDetailsValidateSchema(t)),
      server_error: [],
    });
    const { error_list } = this.props;
    if (jsUtils.isEmpty(error_list)) this.preSignInAPI(data);
  };

  getFormStatusPopoverElement = () => {
    const { formStatusPopOver } = this.props;
    if (formStatusPopOver.isVisible) return <FormStatusPopover popoverRef={this.popoverRef} />;
    return null;
  };

  unMountCallHandler = () => {
    const { signInSetState, state } = this.props;
    signInSetState({
      ...state,
      password: '',
    });
  };

  getSignInFormElement = () => {
    const { history, location } = this.props;
    const state = store.getState().SignInReducer;
    const { username, server_error, error_list, email } = state;
    const errors = mergeObjects(error_list, server_error);
    const { currentPage } = this.props;
    switch (currentPage) {
      case SIGN_IN_STRINGS.PRE_SIGN_IN_STEP:
        return (
          <PreSignIn
            errors={errors}
            onSignUpClick={this.onSignUpClickHandler}
            form_details={state}
            onChange={this.onChangeHandler}
            onNextClicked={this.onNextClickedHandler}
            onForgotPasswordClick={this.onForgotPasswordClick}
            onSuccessGoogleSignin={this.onSuccessGoogleSignin}
            onMicrosoftSignInClickHandler={this.onMicrosoftSignInClickHandler}
            onFailureGoogleSignin={this.onFailureGoogleSignin}
            isSigninFromSubDomain={isSigninFromSubDomain}
            onLoginOptionSwitchHandler={this.onLoginOptionSwitchHandler}
          />
        );
      case SIGN_IN_STRINGS.USER_ACCOUNT_SELECTION: // when there are 2 accounts with same login email
        return (
          <UserAccountSelection
            errors={errors}
            accounts={state.accounts}
            onAccountClick={this.onAccountClick}
            onNextClicked={this.onAccountSelected}
            selectedAccountId={state.account_id + state.username}
            onSwitchAccountClicked={this.onSwitchAccountHandler}
            form_details={state}
            isSigninFromSubDomain={isSigninFromSubDomain}
          />
        );
      case SIGN_IN_STRINGS.SIGN_IN_STEP:
        return (
          <SignInForm
            username={username}
            email={email}
            errors={errors}
            form_details={state}
            onChange={this.onChangeHandler}
            unMountCallHandler={this.unMountCallHandler}
            onSignInClicked={this.onSignInClickedHandler}
            onSwitchAccountClicked={this.onSwitchAccountHandler}
            onForgotPasswordClick={this.onForgotPasswordClick}
            onMicrosoftSignInClickHandler={this.onMicrosoftSignInClickHandler}
            history={history}
            location={location}
          />
        );
      case SIGN_IN_STRINGS.MFA_SETUP_STEP:
        return <MfaSetupFromLogin />;
      case SIGN_IN_STRINGS.MFA_OTP_VERFICATION_STEP:
        return (
          <MfaOtpVerification
            getAuthorizationDetailsApi={this.getAuthorizationDetailsApi}
            form_details={state}
          />
        );
      case SIGN_IN_STRINGS.MFA_ENFORCED_STEP:
        return (
          <MfaVerificationModal
          getAuthorizationDetailsApi={this.getAuthorizationDetailsApi}
          isModalOpen
          isDisableSignout
          />
        );
      default:
        return null;
    }
  };

  getAuthorizationDetailsApi = () => {
    const { dispatch } = this.props;
    const { setColorScheme = null } = this.context;
    // this.notificationSocket
    dispatch(
      getAuthorizationDetailsApiAction(
        cloneDeep(this.props),
        this.socketConnection,
        this.socket,
        requestForToken,
      ),
    ).then((response) => {
      removeCachedDetails();
      const {
        history,
        location,
        setFlowCreatorProfile,
        setMemberProfile,
        setAdminProfile,
        setRole,
        setIsAccountProfileCompleted,
        setLocale,
        setPriamryLocale,
        signInSetState,
      } = this.props;
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
        signInSetState({
          acc_favicon: acc_favicon,
        });
      }
      document.title = response.account_name;
      }
      if (!response.is_invite_user) {
        updateProfileInRedux(
          response,
          setRole,
          null,
          this.socket,
          setAdminProfile,
          setFlowCreatorProfile,
          setMemberProfile,
          setIsAccountProfileCompleted,
          setLocale,
          this.notificationSocket,
          setPriamryLocale,
          setColorScheme,
        );
      }
      localStorage.setItem(
        'application_language',
        response?.pref_locale || response?.primary_locale,
      );
      // window.location.reload();
      navigateToHome(
        response.user_type,
        {
          isInviteUser: response.is_invite_user,
          username: response.username,
          id: response._id,
        },
        { ...history, location },
      );
    });
  };

  getSignInDetailsValidateData = () => {
    const { state } = this.props;
    const { username, password, account_id } = state;
    const data = {
      [SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID]: username.trim(),
      [SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.ID]: password,
      account_id,
    };
    return data;
  };

  getPreSignInDetailsValidateData = (
    is_email_signin,
    isSigninFromSubDomain,
  ) => {
    const { state } = this.props;
    if (isSigninFromSubDomain) {
      return {
        [SIGN_IN_STRINGS.SIGN_IN_TYPE]:
          SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID,
        [SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID]:
          window.location.hostname.split('.')[0],
        [SIGN_IN_STRINGS.USER_NAME_EMAIL.ID]: state.username_or_email,
      };
    } else {
      if (is_email_signin) {
        const { email } = state;
        return {
          [SIGN_IN_STRINGS.SIGN_IN_TYPE]: SIGN_IN_STRINGS.EMAIL,
          [SIGN_IN_STRINGS.EMAIL]: email,
        };
      } else {
        const { username, domain } = state;
        return {
          [SIGN_IN_STRINGS.SIGN_IN_TYPE]:
            SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID,
          [SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID]: domain,
          [SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID]: username,
        };
      }
    }
  };

  // previous params socketConnection = (email, id, account_id, first_name, last_name, account_domain) => {
  socketConnection = () => {
    // CHAT SOCKET INITIATION
    // this.socket = socketIOClient(CHAT_BASE_URL, {
    //   path: CHAT_SOCKET_PATH,
    //   query: {
    //     user: email,
    //     user_id: id,
    //     account_id,
    //     first_name,
    //     last_name,
    //     is_active: true,
    //     account_domain,
    //   },
    //   reconnection: true,
    //   reconnectionDelay: 1000,
    //   reconnectionDelayMax: 5000,
    //   reconnectionAttempts: Infinity,
    //   withCredentials: true,
    // });
    // this.socket.on(SIGN_IN_STRINGS.SOCKET_CONNECTION_ESTABLISHED, (socketData) => {
    //   console.log('Chat Socket - Connection Established', socketData);
    // });

    // NOTIFICATION SOCKET INITIATION
    this.notificationSocket = socketIOClient(NOTIFICATION_BASE_URL, {
      path: NOTIFICATION_SOCKET_PATH,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      withCredentials: true,
    });
    this.notificationSocket.on(
      SIGN_IN_STRINGS.SOCKET_CONNECTION_ESTABLISHED,
      (socketData) => {
        const { notificationsDataChange, totalCount } = this.props;
        notificationsDataChange({
          total_count: jsUtils.get(socketData, ['unread_count'], totalCount),
        });
        console.log('Notification Socket - Connection Established', socketData);
      },
    );
  };

  preSignInAPI = (data) => {
    const { preSignInApiCall, history, location, t } = this.props;
    setPointerEvent(true);
    updatePostLoader(true);
    clearSessionDetails()
      .then(() => {
        preSignInApiCall(data, history, location, isSigninFromSubDomain, t);
      })
      .catch((error) => {
        setPointerEvent(false);
        updatePostLoader(false);
        console.log(error);
      });
  };

  signInAPI = (data) => {
    const { history, error_list, signInApiCall, dispatch } = this.props;
    dispatch(
      signInSetStateAction({
        oldPassword: data.password,
      }),
    );
    if (jsUtils.isEmpty(error_list)) {
      setPointerEvent(true);
      signInApiCall(data, history, this.getAuthorizationDetailsApi);
    }
  };

  socket = null;

  notificationSocket = null;
}

const mapStateToProps = (state) => {
  return {
    role: state.RoleReducer.role,
    state: state.SignInReducer,
    error_list: state.SignInReducer.error_list,
    formStatusPopOver: state.FormStatusPopoverReducer.formStatus,
    totalCount: state.NotificationReducer.total_count,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRole: (value) => {
      dispatch(roleAction(value));
    },
    setAdminProfile: (value) => {
      dispatch(adminProfileAction(value));
    },
    setUserLocale: (value) => {
      dispatch(userPreferenceDataChangeAction(value));
    },
    setMemberProfile: (value) => {
      dispatch(memberProfileAction(value));
    },
    setFlowCreatorProfile: (value) => {
      dispatch(flowCreatorProfileAction(value));
    },
    setColorCode: (value) => {
      dispatch(colorCodeAction(value));
    },
    updateLanguageStrings: (value) => {
      dispatch(updateLanguageAction(value));
    },
    signInSetState: (value) => {
      dispatch(signInSetStateAction(value));
    },
    signInClearState: (value) => {
      dispatch(signInClearStateAction(value));
    },
    signInApiCall: (data, obj, func) => {
      dispatch(signInApiAction(data, obj, func));
    },
    preSignInApiCall: (data, obj, obj2, data2, t) => {
      dispatch(preSignInApiAction(data, obj, obj2, data2, t));
    },
    googleSignInApiCall: (code, obj, t) => {
      dispatch(googleSignInApiAction(code, obj, t));
    },
    microsoftSignInApiCall: (...params) => {
      dispatch(microsoftSignInApiAction(...params));
    },
    signInStarted: () => {
      dispatch(signInApiStarted());
    },
    signInSuccess: () => {
      dispatch(signInApiSuccess());
    },
    signInFailure: (err) => {
      dispatch(signInApiFailure(err));
    },
    setIsAccountProfileCompleted: (value) => {
      dispatch(setAccountCompletionStatus(value));
    },
    setLocale: (value) => {
      dispatch(roleActionAccountLocale(value));
    },
    setPriamryLocale: (value) => {
      dispatch(primaryActionAccountLocale(value));
    },
    getUrlVerificationStatus: () => {
      dispatch(verifyUrlAction());
    },
    externalAuthSigninApiCall: (
      obj,
      func1,
      func2,
      func3,
      func4,
      func5,
      func6,
      func7,
      accountId,
    ) => {
      dispatch(
        externalAuthSigninGetApiAction(
          obj,
          func1,
          func2,
          func3,
          func4,
          func5,
          func6,
          func7,
          accountId,
        ),
      );
    },
    notificationsDataChange: (data) => {
      dispatch(notificationsDataChangeAction(data));
    },
    dispatch,
  };
};
SignIn.defaultProps = {
  role: null,
  error_list: [],
  location: {},
  formStatusPopOver: {},
};
SignIn.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  setRole: PropTypes.func.isRequired,
  setColorCode: PropTypes.func.isRequired,
  setAdminProfile: PropTypes.func.isRequired,
  setMemberProfile: PropTypes.func.isRequired,
  role: PropTypes.number,
  setFlowCreatorProfile: PropTypes.func.isRequired,
  signInSetState: PropTypes.func.isRequired,
  state: PropTypes.objectOf(PropTypes.any).isRequired,
  error_list: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  signInClearState: PropTypes.func.isRequired,
  signInApiCall: PropTypes.func.isRequired,
  preSignInApiCall: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  googleSignInApiCall: PropTypes.func.isRequired,
  microsoftSignInApiCall: PropTypes.func.isRequired,
  location: PropTypes.objectOf(PropTypes.any),
  formStatusPopOver: PropTypes.objectOf(PropTypes.any),
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SignIn)),
);
