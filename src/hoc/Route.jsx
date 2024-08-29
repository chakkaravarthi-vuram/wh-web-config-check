/**
 * @author Asttle
 * @email asttlej@vuram.com
 * @create date 2019-11-20 09:24:42
 * @modify date 2019-11-20 09:24:42
 * @desc [description]
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import queryString from 'query-string';
import { withTranslation } from 'react-i18next';
import { getAllSearchParams } from 'utils/taskContentUtils';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { clearSessionDetails } from 'axios/apiService/clearSessionDetails.apiService';
import { store } from 'Store';
import { requestForToken } from 'containers/sign_in/update_firebase_token/UpdateFirebaseToken';
import { GOOGLE_CONFIG } from 'containers/sign_in/signInUtils.constant';
import { redirectToSubdomainPage } from 'utils/UtilityFunctions';
import { AUTHORIZE_APP } from 'urls/RouteConstants';
import { getRefreshTokenApiStatus, setRefreshTokenApiStatus } from 'axios/axios.utils';
import { setWelcomeChange } from 'redux/reducer/WelcomeInsightsReducer';
import { WorkHallPageLoader } from '@workhall-pvt-lmt/wh-ui-library';
import FullPageLoader from '../assets/icons/FullPageLoader';
import Layout from './layout/Layout';
import NoInternetFound from '../containers/error_pages/NoInternetFound';
import ProgressBar from '../components/form_components/progress_bar/ProgressBar';
import { Routes } from './Common.route';
import { adminRoutes } from './Admin.route';
import { memberRoutes } from './Member.route';
import { flowCreatorRoutes } from './Developer.route';
import { ROLES, ROUTE_METHOD } from '../utils/Constants';
import {
  adminProfileAction,
  roleAction,
  memberProfileAction,
  colorCodeAction,
  flowCreatorProfileAction,
  updateLanguageAction,
  setAccountCompletionStatus,
  roleActionAccountLocale,
  primaryActionAccountLocale,
} from '../redux/actions/Actions';
import gClasses from '../scss/Typography.module.scss';
import {
  getAuthorizationDetailsApiThunk,
  layoutApiTokenCancelAction,
  layoutClearState,
  layoutApiSuccess,
  externalAuthSigninGetApiAction,
} from '../redux/actions/Layout.Action';
import { cancelTokenForGetAuthorizationDetailsAndClearState } from '../axios/apiService/resetPassword.apiService';
import jsUtility, { getDomainName, getSubDomainName, isEmpty, has, get, cloneDeep } from '../utils/jsUtility';
import { EXTERNAL_SIGNIN_COOKIE } from '../utils/constants/signin.constant';
import { UPDATE_FORGOT_PASSWORD, RESET_PASSWORD, ADMIN_HOME, AUTH_ROUTE_CONSTANT_LIST, SIGNIN, INVITE_USER_LOGIN, PASSWORD, CHOOSE_ACCOUNT, HOME, CREATE_EDIT_TASK, CREATE_DATA_LIST, TEAM_CREATE_TEAM } from '../urls/RouteConstants';
import { getCachedUserDetails, isUserDetailsCached, removePrimaryDomainCookie } from '../containers/sign_in/SignIn.utils';
import {
  googleSignInApiAction,
  microsoftSignInRedirectAction,
} from '../redux/actions/SignIn.Action';
import ThemeContext from './ThemeContext';
import BasicUserRouteSetup from './BasicUser.route';
import { getDevRoutePath, getUserRoutePath, isBasicUserMode, routeNavigate, safelyParseJSON } from '../utils/UtilityFunctions';
import SessionTransition from './session_transition/SessionTransition';

const cookies = new Cookies();
class Route extends Component {
  // eslint-disable-next-line react/static-property-placement, react/sort-comp
  static contextType = ThemeContext;

  componentDidMount() {
    const {
      history,
      getAuthorizationDetailsApiCall,
      externalAuthSigninApiCall,
      setFlowCreatorProfile,
      setMemberProfile,
      setAdminProfile,
      setRole,
      dispatch,
      location,
      setIsAccountProfileCompleted,
      setLocale,
      setWelcomeChange,
      setPriamryLocale,
      t,
    } = this.props;
    if (history.location.pathname !== HOME && cookies.get('welcome-show')) setWelcomeChange({ isWelcomeInsightsOpen: true });
    if (history.location.pathname === HOME && cookies.get('invite-user')) setWelcomeChange({ isWelcomeInsightsOpen: true });
    if (history.location.pathname === getDevRoutePath(TEAM_CREATE_TEAM) || history.location.pathname === getUserRoutePath(TEAM_CREATE_TEAM)) {
      const currentParams = queryString.parseUrl(history.location.pathname);
      let newParams = { ...get(currentParams, ['query'], {}) };
      newParams = { ...newParams, create: 'teams' };
      const search = new URLSearchParams(newParams).toString();
      routeNavigate(history, ROUTE_METHOD.PUSH, HOME, search);
    }
    const hash = location && has(location, ['hash']) && location.hash;
    const hashParams = !isEmpty(hash) ? new URLSearchParams(hash) : null;
    const { search } = location;
    const searchParams = !isEmpty(search) ? new URLSearchParams(search) : null;
    const { isMultipleDomain } = cloneDeep(store.getState().SignInReducer);
    dispatch(layoutApiSuccess());
    const query = getAllSearchParams(new URLSearchParams(get(history, ['location', 'search'])));
    const currentPathname = get(history, ['location', 'pathname']);
    const parsedSearchState = searchParams ? safelyParseJSON(searchParams?.get('state')) : {};

    /* Invalid Active Session change start */
    const subDomainCheck = getSubDomainName(window.location.hostname);

    const activeDomain = cookies?.get('active-domain') || searchParams?.get('cad'); // cad = current active domain

    const queryParamsObject = {};
    if (searchParams?.size) {
      searchParams?.forEach((value, key) => {
        queryParamsObject[key] = value;
      });
    }

    if (
      !isEmpty(subDomainCheck) &&
      !isEmpty(activeDomain) &&
      activeDomain !== subDomainCheck
    ) {
        queryParamsObject.ide = 1; // isDomainExist = 1
        queryParamsObject.cad = activeDomain; // current active domain
        const nextSearchParams = `?${new URLSearchParams(queryParamsObject)}`;
        routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, nextSearchParams);
        return;
    } else if (!isEmpty(queryParamsObject?.ide) || !isEmpty(queryParamsObject?.cad)) {
      delete queryParamsObject?.ide;
      delete queryParamsObject?.cad;
      const nextSearchParams = `?${new URLSearchParams(queryParamsObject)}`;
      routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, nextSearchParams);
    } else {
      // do nothing
    }
    /* Invalid Active Session change end */

    if (parsedSearchState?.is_microsoft_login) {
      console.log('ROUTE_CHECK_SECOND', {
        hashCodeParam: hashParams?.get('#code'),
      });

      const code = hashParams?.get('#code') || searchParams?.get('code');
      const authState = parsedSearchState?.auth_uuid || hashParams?.get('#state');

      const params = {
        code,
        state: authState,
      };
      dispatch(microsoftSignInRedirectAction(params, history, parsedSearchState, t));
    } else if (searchParams?.get('code') && !currentPathname.includes(AUTHORIZE_APP)) {
      console.log('ROUTE_CHECK_FIRST', {
        code: searchParams.get('code'),
        auth_app_includes: currentPathname.includes(AUTHORIZE_APP),
      });

      dispatch(googleSignInApiAction(searchParams.get('code'), history, t, parsedSearchState));
    } else if (searchParams?.get('google_domain')) {
       console.log('ROUTE_CHECK_THIRD', {
        google_domain: searchParams.get('google_domain'),
        sub_domain: getSubDomainName(window.location.hostname),
      });
      if (!getSubDomainName(window.location.hostname)) {
        const stateParams = {
          google_domain: searchParams?.get('google_domain'),
        };

        if (!isEmpty(searchParams?.get('nextUrl'))) stateParams.nextUrl = searchParams?.get('nextUrl');

        window.location = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CONFIG.clientId}&redirect_uri=${GOOGLE_CONFIG.redirectUri}&scope=${GOOGLE_CONFIG.scope}&prompt=select_account&response_type=${GOOGLE_CONFIG.responseType}&state=${JSON.stringify(stateParams)}`;
      }
    } else if (localStorage.getItem('csrf_token') && (query?.islic !== 'true') && (cookies.get('active-domain') || window.location.protocol === 'http:')) {
      console.log('ROUTE_CHECK_FOURTH', {
        csrf_token: localStorage.getItem('csrf_token'),
        isLic: query?.islic,
        active_domain: cookies.get('active-domain'),
        protocol: window.location.protocol,
      });
      const { setColorScheme = null } = this.context;
      getAuthorizationDetailsApiCall(
        history,
        setRole,
        null,
        setAdminProfile,
        setFlowCreatorProfile,
        setMemberProfile,
        setIsAccountProfileCompleted,
        null,
        null,
        setLocale,
        requestForToken,
        setPriamryLocale,
        setColorScheme,
      );
      if (cookies.get(EXTERNAL_SIGNIN_COOKIE)) cookies.remove(EXTERNAL_SIGNIN_COOKIE, { domain: getDomainName(window.location.hostname) });
    } else if (cookies.get(EXTERNAL_SIGNIN_COOKIE) && !(isMultipleDomain)) {
      console.log('ROUTE_CHECK_FIFTH', {
        external_signin: cookies.get(EXTERNAL_SIGNIN_COOKIE),
        isMultipleDomain,
      });
      clearSessionDetails()
      .then(() => {
        console.log('external-1', searchParams && searchParams.get('accountId'));
        externalAuthSigninApiCall(
          history,
          setRole,
          null,
          setAdminProfile,
          setFlowCreatorProfile,
          setMemberProfile,
          setIsAccountProfileCompleted,
          setLocale,
          searchParams && searchParams.get('accountId'),
          t,
        );
      });
    } else {
      console.log('reachedroute-132', currentPathname);
      if (getSubDomainName(window.location.hostname) && !localStorage.getItem('csrf_token')) {
        removePrimaryDomainCookie();
      }
      dispatch(layoutApiSuccess());
      let nextUrl = EMPTY_STRING;
      if ((!AUTH_ROUTE_CONSTANT_LIST.includes(currentPathname) && currentPathname !== HOME)) {
        nextUrl = `?${new URLSearchParams({
          nextUrl: currentPathname,
        })}`;
        if (!isEmpty(nextUrl) && query && query.session_id) {
          nextUrl = `${nextUrl}&session_id=${query.session_id}`;
        }
      }
      console.log('fdsagasdgasd', nextUrl);
      if (nextUrl && nextUrl !== EMPTY_STRING
        && !currentPathname.includes(INVITE_USER_LOGIN)
        && !currentPathname.includes(UPDATE_FORGOT_PASSWORD)
        && !currentPathname.includes(RESET_PASSWORD)) {
        routeNavigate(history, ROUTE_METHOD.PUSH, SIGNIN, nextUrl, null, true);
      }
    }
    const currentParams = queryString.parseUrl(history.location.pathname);
    if (currentPathname === CREATE_EDIT_TASK || currentPathname === CREATE_DATA_LIST) {
      const createName = (currentPathname === CREATE_EDIT_TASK) ? 'task' :
                        (currentPathname === CREATE_DATA_LIST) ? 'datalist' : null;
      const newParams = { ...get(currentParams, ['query'], {}), create: createName };
      const searchParams = new URLSearchParams(newParams).toString();
      routeNavigate(history, ROUTE_METHOD.REPLACE, HOME, searchParams);
    }
    cookies.remove(EXTERNAL_SIGNIN_COOKIE, { domain: getDomainName(window.location.hostname) });
    window.addEventListener('beforeunload', this.handleTabClose);
  }

  componentWillUnmount() {
    const { dispatch, clearState } = this.props;
    dispatch(cancelTokenForGetAuthorizationDetailsAndClearState(layoutApiTokenCancelAction));
    clearState();
    window.removeEventListener('beforeunload', this.handleTabClose);
  }

  render() {
    const { state, location, history } = this.props;
    const { isDataLoading, common_server_error } = state;
    const {
      role,
      adminProfile,
      formPopoverStatus,
      flowCreatorProfile,
      memberProfile,
      isBillingUser,
      // alertPopoverStatus,
      is_billing_card_verified,
    } = this.props;
   const { colorScheme } = this.context;
    const { account_name, acc_favicon } = store.getState().SignInReducer;
   console.log('SignInReducer', store.getState().SignInReducer);
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = acc_favicon;
    if (account_name) {
      document.title = account_name;
    }
    console.log(common_server_error);
    console.log(adminProfile);
    console.log(flowCreatorProfile);
    console.log(memberProfile);
    document.body.classList.remove(gClasses.BodyBackground);
    const isBasicUser = isBasicUserMode(history);
    console.log('fgdsagasgas', isBasicUser, role, navigator.onLine, location.pathname, AUTH_ROUTE_CONSTANT_LIST.includes(location.pathname));
    console.log('location search imp', location);
    if (navigator.onLine) {
      if (!isDataLoading) {
        const checkExpiry = cookies.get('active-domain');
        const { search } = location;
        const searchParams = !isEmpty(search) ? new URLSearchParams(search) : null;
        console.log('Comment, route.jsx-288', search, role, checkExpiry, !getSubDomainName(window.location.hostname), window.location.hostname, searchParams?.get('google_domain'), !jsUtility.isEmpty(checkExpiry) && !getSubDomainName(window.location.hostname) && jsUtility.isEmpty(searchParams?.get('google_domain')), AUTH_ROUTE_CONSTANT_LIST.includes(location.pathname), location.pathname);
        if (!jsUtility.isEmpty(checkExpiry) && !getSubDomainName(window.location.hostname) && jsUtility.isEmpty(searchParams?.get('google_domain'))) {
          redirectToSubdomainPage();
        }
        // redirectFromPrimaryDomainToSubDomain();
        // Commenting aboove line to check google sign in issue
        console.log('294', role, searchParams);
        if (role) {
          console.log('296', AUTH_ROUTE_CONSTANT_LIST.includes(location.pathname));
          if (AUTH_ROUTE_CONSTANT_LIST.includes(location.pathname)) {
            if ((location.pathname === SIGNIN) || (location.pathname === CHOOSE_ACCOUNT) || (location.pathname === PASSWORD)) {
              if (!isUserDetailsCached(getCachedUserDetails())) {
                const searchParams = get(history, ['location', 'search'])
                  ? getAllSearchParams(
                    new URLSearchParams(get(history, ['location', 'search'])),
                  ) : {};
                  console.log('searchParams', searchParams);
                // if (searchParams.nextUrl) routeNavigate(history, ROUTE_METHOD.REPLACE, searchParams.nextUrl);
                // else routeNavigate(history, ROUTE_METHOD.REPLACE, ADMIN_HOME);
              }
            } else routeNavigate(history, ROUTE_METHOD.REPLACE, ADMIN_HOME);
          }
        }
        let sessionProfile = null;

        switch (role) {
          case ROLES.ADMIN:
            sessionProfile = adminProfile;
            break;
          case ROLES.FLOW_CREATOR:
            sessionProfile = flowCreatorProfile;
            break;
          case ROLES.MEMBER:
            sessionProfile = memberProfile;
            break;
          default:
            sessionProfile = null;
            break;
        }

        if (searchParams?.get('ide') === '1') return <SessionTransition profile={sessionProfile} />; // ide = isDomainExist
        console.log('fgsagasfg', role);
        switch (role) {
          case ROLES.ADMIN:
            return (
              <>
                <ProgressBar />
                {
                (isBasicUser) ?
                (<BasicUserRouteSetup />) :
                (<Layout
                  profile={adminProfile}
                  status={formPopoverStatus}
                  expiryClearOnSignOut={this.expiryClearOnSignOut}
                >
                  {adminRoutes(location, isBillingUser && is_billing_card_verified, adminProfile)}
                 </Layout>
                )
                }
              </>
            );
          case ROLES.FLOW_CREATOR:
            return (
              <>
                <ProgressBar />
                {
                 (isBasicUser) ?
                 (<BasicUserRouteSetup />) :
                 (<Layout profile={flowCreatorProfile} status={formPopoverStatus} expiryClearOnSignOut={this.expiryClearOnSignOut}>
                    {flowCreatorRoutes(location, isBillingUser && is_billing_card_verified)}
                  </Layout>
                  )
                }
              </>
            );
          case ROLES.MEMBER:
            return (
              <>
                <ProgressBar />
                {
                 (isBasicUser) ?
                 (<BasicUserRouteSetup />) :
                 (<Layout profile={memberProfile} status={formPopoverStatus} expiryClearOnSignOut={this.expiryClearOnSignOut}>
                    {memberRoutes(location, isBillingUser && is_billing_card_verified)}
                  </Layout>)
               }
              </>
            );
          default:
            return (
              <>
              {console.log('vgsfadvbasfbva', role)}
                <ProgressBar />
                {Routes(isBillingUser && is_billing_card_verified)}
              </>
            );
        }
      }
      return (isBasicUser) ? <WorkHallPageLoader color={colorScheme?.activeColor && colorScheme?.activeColor} className={gClasses.Height100Vh} /> : <FullPageLoader isDataLoading />;
    }
    return <NoInternetFound />;
  }

  handleTabClose = () => {
    const isRefreshTokenIsInProgress = getRefreshTokenApiStatus();
    if (isRefreshTokenIsInProgress) {
      const current_tab_id = sessionStorage.getItem('browser_tab_uuid') || null;
      const refreshTokenInProgressTab = cookies.get('refreshTokenInProgressTab');
      if (!isEmpty(current_tab_id) &&
      !isEmpty(refreshTokenInProgressTab) &&
      refreshTokenInProgressTab === current_tab_id
      ) {
        setRefreshTokenApiStatus(false);
      }
    }
  };
}

const mapStateToProps = (state) => {
  return {
    role: state.RoleReducer.role,
    adminProfile: state.AdminProfileReducer.adminProfile,
    flowCreatorProfile: state.DeveloperProfileReducer.flowCreatorProfile,
    memberProfile: state.MemberProfileReducer.memberProfile,
    colorCodes: state.ColorCodeReducer.colorCodes,
    formPopoverStatus: state.FormStatusPopoverReducer.formStatus,
    state: state.LayoutReducer,
    isBillingUser: state.AccountCompleteCheckReducer.is_billing_user,
    // alertPopoverStatus: state.AlertPopoverReducer.alertStatus,
    is_billing_card_verified: state.AccountCompleteCheckReducer.is_card_verified,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRole: (value) => {
      dispatch(roleAction(value));
    },
    setLocale: (value) => {
      dispatch(roleActionAccountLocale(value));
    },
    setPriamryLocale: (value) => {
      dispatch(primaryActionAccountLocale(value));
    },
    setAdminProfile: (value) => {
      dispatch(adminProfileAction(value));
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
    getAuthorizationDetailsApiCall: (obj, func1, func2, func3, func4, func5, func6, value1, value2, func7, requestFCMToken, func8, setColorTheme) => {
      dispatch(getAuthorizationDetailsApiThunk(obj, func1, func2, func3, func4, func5, func6, value1, value2, func7, requestFCMToken, func8, setColorTheme));
    },
    externalAuthSigninApiCall: (obj, func1, func2, func3, func4, func5, func6, func7, account_id, t) => {
      dispatch(externalAuthSigninGetApiAction(obj, func1, func2, func3, func4, func5, func6, func7, account_id, t));
    },
    clearState: () => {
      dispatch(layoutClearState());
    },
    setIsAccountProfileCompleted: (value) => {
      dispatch(setAccountCompletionStatus(value));
    },
    setWelcomeChange: (params) => {
      dispatch(setWelcomeChange(params));
    },
    dispatch,
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Route)));
Route.defaultProps = {
  adminProfile: {},
  flowCreatorProfile: {},
  memberProfile: {},
  colorCodes: {},
  formPopoverStatus: {},
  state: {},
  role: null,
};
Route.propTypes = {
  setRole: PropTypes.func.isRequired,
  setAdminProfile: PropTypes.func.isRequired,
  setMemberProfile: PropTypes.func.isRequired,
  setFlowCreatorProfile: PropTypes.func.isRequired,
  setColorCode: PropTypes.func.isRequired,
  updateLanguageStrings: PropTypes.func.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  role: PropTypes.number,
  adminProfile: PropTypes.objectOf(PropTypes.any),
  flowCreatorProfile: PropTypes.objectOf(PropTypes.any),
  memberProfile: PropTypes.objectOf(PropTypes.any),
  colorCodes: PropTypes.objectOf(PropTypes.any),
  formPopoverStatus: PropTypes.objectOf(PropTypes.any),
  getAuthorizationDetailsApiCall: PropTypes.func.isRequired,
  state: PropTypes.objectOf(PropTypes.any),
  dispatch: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
  externalAuthSigninApiCall: PropTypes.func.isRequired,
  setLocale: PropTypes.func.isRequired,
};
