import Cookies from 'universal-cookie';

import jsUtils, {
  getDomainName, getSubDomainName, isIpAddress,
} from '../../utils/jsUtility';

import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import { PRODUCTION } from '../../utils/Constants';

const cookies = new Cookies();

let signinApiCancelToken;
let preSigninApiCancelToken;
let preSigninRedirectCancelToken;
let googleSignInCancelToken;
let microsoftSignInCancelToken;
let forgotPasswordCancelToken;
let externalAuthSigninCancelToken;
let verifyUrlCancelToken;

export const isUserDetailsCached = (userDetails) => {
  if (!jsUtils.isEmpty(userDetails.domain) && !jsUtils.isEmpty(userDetails.username) && !jsUtils.isEmpty(userDetails.accountId)) return true;
  return false;
};

export const getCachedUserDetails = () => {
  const userDetails = {
    domain: cookies.get('domain'),
    username: cookies.get('username'),
    accountId: cookies.get('accountId'),
    email: cookies.get('email'),
    from_signup: cookies.get('fromSignup'),
    buy_now_user: cookies.get('buy_now_user'),
    accounts: cookies.get('accounts'),
  };
  return userDetails;
};

export const getSubdomainUrlRoutingForSignin = () => {
  if (!isUserDetailsCached(getCachedUserDetails())) {
    if (!isIpAddress(window.location.hostname) && window.location.hostname.split('.').length > 2 && getDomainName(window.location.hostname).split('.')[0] !== 'xip') {
      console.log('check!@#2');
      window.location = `${window.location.protocol}//${getDomainName(window.location.host)}${
        ROUTE_CONSTANTS.SIGNIN
      }${window.location.search}`;
    }
  }
};

export const setPrimaryDomainCookie = (domain) => {
  if (process.env.NODE_ENV === PRODUCTION && domain) {
    const cookieProps = {
      path: '/',
      domain: getDomainName(window.location.hostname),
    };
    cookies.set('primary_domain', domain, cookieProps);
  }
};

export const getPrimaryDomainFromCookies = () => cookies.get('primary_domain');

export const removePrimaryDomainCookie = () => {
  if (process.env.NODE_ENV === PRODUCTION && !jsUtils.isEmpty(cookies.get('primary_domain'))) {
    cookies.remove('primary_domain', {
      path: '/',
      domain: getDomainName(window.location.hostname),
    });
  }
};

export const removeCookiesIfExists = () => {
  if (!jsUtils.isEmpty(cookies.get('username'))) {
    cookies.remove('username', {
      path: '/',
      domain: getDomainName(window.location.hostname),
    });
  }
  if (!jsUtils.isEmpty(cookies.get('domain'))) {
    cookies.remove('domain', {
      path: '/',
      domain: getDomainName(window.location.hostname),
    });
  }
  removePrimaryDomainCookie();
};

export const redirectBasedOnAccountSelection = (domain, accountId, email, username) => {
  const cookieProps = {
    path: '/',
    domain: getDomainName(window.location.hostname),
  };
  if (!jsUtils.isEmpty(cookies.get('domain'))) cookies.remove('domain', cookieProps);
  if (!jsUtils.isEmpty(cookies.get('accountId'))) cookies.remove('accountId', cookieProps);
  removePrimaryDomainCookie();
  if (process.env.NODE_ENV === PRODUCTION || window.location.protocol === 'https:') {
    cookies.set('domain', domain, cookieProps);
    cookies.set('accountId', accountId, cookieProps);
    cookies.set('email', email, cookieProps);
    cookies.set('username', username, cookieProps);
    setPrimaryDomainCookie(domain);
    window.location = `https://${domain}.${getDomainName(
      window.location.hostname,
    )}${ROUTE_CONSTANTS.PASSWORD}${window.location.search}`;
  }
};

export const removeCookiesOnSwitchAccount = () => {
  const cookieProps = {
    path: '/',
    domain: getDomainName(window.location.hostname),
  };
  cookies.remove('username', cookieProps);
  cookies.remove('domain', cookieProps);
  cookies.remove('accountId', cookieProps);
  cookies.remove('cet', { path: '/', domain: window.location.hostname });
  cookies.remove('ctd', { path: '/', domain: window.location.hostname });
  removePrimaryDomainCookie();
};

export const getSigninApiCancelToken = (cancelToken) => {
  signinApiCancelToken = cancelToken;
};

export const getPreSignInApiCancelToken = (cancelToken) => {
  preSigninApiCancelToken = cancelToken;
};

export const getGoogleSigninApiCancelToken = (cancelToken) => {
  signinApiCancelToken = cancelToken;
};

export const getExternalAuthSignInApiCancelToken = (cancelToken) => {
  externalAuthSigninCancelToken = cancelToken;
};

export const getMicrosoftSignInApiCancelToken = (cancelToken) => {
  preSigninApiCancelToken = cancelToken;
};

export const getMicrosoftSignInRedirectCancelToken = (cancelToken) => {
  preSigninRedirectCancelToken = cancelToken;
};

export const getForgotPasswordCancelToken = (cancelToken) => {
  forgotPasswordCancelToken = cancelToken;
};
export const getVerifyUrlCancelToken = (cancelToken) => {
  verifyUrlCancelToken = cancelToken;
};
export const getSignInToken = () => signinApiCancelToken;

export const getPreSignInToken = () => preSigninApiCancelToken;

export const getGoogleSignInToken = () => googleSignInCancelToken;

export const getMicrosoftPreSignInToken = () => microsoftSignInCancelToken;

export const getMicrosoftPreSignInRedirectToken = () => preSigninRedirectCancelToken;

export const getForgotPasswordToken = () => forgotPasswordCancelToken;

export const getExternalAuthSignInToken = () => externalAuthSigninCancelToken;

export const getVerifyUrlToken = () => verifyUrlCancelToken;

export const redirectFromPrimaryDomainToSubDomain = () => {
  if (process.env.NODE_ENV === PRODUCTION) {
    const primary_domain = getPrimaryDomainFromCookies();
    const sub_domain = getSubDomainName(window.location.hostname);
    console.log('UtilityFunction.js - 196', primary_domain, sub_domain, !ROUTE_CONSTANTS.COMMON_ROUTE_CONSTANT_LIST.some((eachRoute) => window.location.pathname.includes(eachRoute)));
    if (primary_domain && !sub_domain && !ROUTE_CONSTANTS.COMMON_ROUTE_CONSTANT_LIST.some((eachRoute) => window.location.pathname.includes(eachRoute))) {
      window.location = `https://${primary_domain}.${getDomainName(window.location.hostname)}${
        window.location.pathname
      }${window.location.search}`;
    }

    // else if (window.location.pathname.includes(ROUTE_CONSTANTS.SIGNIN) && !sub_domain && !isUserDetailsCached(getCachedUserDetails())) {
    //   window.location = `https://${getCachedUserDetails().domain}.${getDomainName(window.location.hostname)}${
    //     window.location.pathname
    //   }${window.location.search}`;
    // }
  }
};

export const removeCachedDetails = () => {
  const cookieProps = {
    path: '/',
    domain: getDomainName(window.location.hostname),
  };
  console.log('sdsdscccc');
  if (!jsUtils.isEmpty(cookies.get('domain'))) cookies.remove('domain', cookieProps);
  if (!jsUtils.isEmpty(cookies.get('username'))) cookies.remove('username', cookieProps);
  if (!jsUtils.isEmpty(cookies.get('accountId'))) cookies.remove('accountId', cookieProps);
  if (!jsUtils.isEmpty(cookies.get('isUsernameOrEmail'))) cookies.remove('isUsernameOrEmail', cookieProps);
  if (!jsUtils.isEmpty(cookies.get('isEmailSignin'))) cookies.remove('isEmailSignin', cookieProps);
};
