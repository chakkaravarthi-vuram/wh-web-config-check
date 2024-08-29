import Cookies from 'universal-cookie';
import { get, getDomainName } from '../../../utils/jsUtility';
import { MATCH_PARAMS_INVITE_USER_ID_KEY } from '../../../urls/RouteConstants';
import { ACCOUNT_DOMAIN_COOKIE_NAME, ACCOUNT_ID_COOKIE_NAME, USERNAME_COOKIE_NAME } from './inviteUser.constant';

export const getInviteUserIdFromParams = (match) => get(match, ['params', MATCH_PARAMS_INVITE_USER_ID_KEY]);

export const getAccountDomainFromResponse = (response) => response[0].account_domain;

export const getAccountIdFromResponse = (response) => response[0].account_id;

export const getUserIdFromResponse = (response) => response[0]._id;

export const getUserNameFromResponse = (response) => response[0].username;

export const getUserProfileIdFromResponse = (response) => response[0].user_id;

export const setAccounDomainCookie = (response) => {
  const accounDomain = getAccountDomainFromResponse(response);
  const cookieProps = {
    path: '/',
    domain: getDomainName(window.location.hostname),
  };
  const cookies = new Cookies();
  cookies.set(ACCOUNT_DOMAIN_COOKIE_NAME, accounDomain, cookieProps);
};

export const setAccountIdCookie = (response) => {
  const accountId = getAccountIdFromResponse(response);
  const cookieProps = {
    path: '/',
    domain: getDomainName(window.location.hostname),
  };
  const cookies = new Cookies();
  cookies.set(ACCOUNT_ID_COOKIE_NAME, accountId, cookieProps);
};

export const setUsernameCookie = (response) => {
  const username = getUserNameFromResponse(response);
  const cookieProps = {
    path: '/',
    domain: getDomainName(window.location.hostname),
  };
  const cookies = new Cookies();
  cookies.set(USERNAME_COOKIE_NAME, username, cookieProps);
};

export const getUsernameFromUserDetails = (userDetails) => userDetails.username;
