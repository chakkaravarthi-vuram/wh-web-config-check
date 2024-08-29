import Cookies from 'universal-cookie';
import jsUtils from '../../../utils/jsUtility';

import { ACCOUNT_DOMAIN_COOKIE_NAME, USERNAME_COOKIE_NAME } from './inviteUser.constant';

export const isUserDetailsCached = (userDetails) => {
  if (jsUtils.isEmpty(userDetails[ACCOUNT_DOMAIN_COOKIE_NAME]) && jsUtils.isEmpty(userDetails[USERNAME_COOKIE_NAME])) return false;
  return true;
};

export const getCachedUserDetails = () => {
  const cookies = new Cookies();
  const userDetails = {
    domain: cookies.get(ACCOUNT_DOMAIN_COOKIE_NAME),
    username: cookies.get(USERNAME_COOKIE_NAME),
  };
  return userDetails;
};
