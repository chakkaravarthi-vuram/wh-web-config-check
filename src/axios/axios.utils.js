import Cookies from 'universal-cookie';
import { ADMIN_BASE_URL, AUTH_BASE_URL, BACKEND_BASE_URL, BILLING_BASE_URL, CHANGE_PASSWORD_API, NOTIFICATION_BASE_URL, RESET_PASSWORD, SIGNUP_BASE_URL, SIGN_IN, UPDATED_RESET_PASSWORD, UPDATE_FORGET_PASSWORD, UPDATE_INVITE_USER } from 'urls/ApiUrls';

const cookies = new Cookies();

export const getRefreshTokenApiStatus = () => cookies.get('refreshTokenInProgress') === '1';

export const setRefreshTokenApiStatus = (value) => {
    if (value) {
        const current_tab_id = sessionStorage.getItem('browser_tab_uuid') || null;
        cookies.set('refreshTokenInProgress', 1, { path: '/' });
        cookies.set('refreshTokenInProgressTab', current_tab_id, { path: '/' });
    } else {
        cookies.set('refreshTokenInProgress', 0, { path: '/' });
        cookies.set('refreshTokenInProgressTab', null, { path: '/' });
    }
};

export const getBaseUrlForAxios = (url) => {
    switch (true) {
        case url.includes('/billing'):
          return BILLING_BASE_URL;
        case url.includes('/notification'):
            return NOTIFICATION_BASE_URL;
        case url.includes('/api'):
            return BACKEND_BASE_URL;
        case url.includes('/signup'):
            return SIGNUP_BASE_URL;
        case url.includes('/admin'):
            return ADMIN_BASE_URL;
        default:
         return AUTH_BASE_URL;
      }
};

export const ENCRYPTION_APIS = [SIGN_IN, UPDATE_FORGET_PASSWORD, RESET_PASSWORD, UPDATE_INVITE_USER, CHANGE_PASSWORD_API, UPDATED_RESET_PASSWORD];
