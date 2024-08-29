import { removeCookiesOnSwitchAccount, removePrimaryDomainCookie } from 'containers/sign_in/SignIn.utils';
import { SIGN_OUT } from 'urls/ApiUrls';
import * as ROUTE_CONSTANTS from 'urls/RouteConstants';
import * as actions from 'redux/actions/Actions';
import { axiosGetUtils } from '../AxiosHelper';
import { store } from '../../Store';
import { routeNavigate } from '../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../utils/Constants';

export const signOutCall = (history) => {
    axiosGetUtils(SIGN_OUT, {
      isSignOut: true,
    })
      .then(() => {
        if (localStorage.getItem('csrf_token')) {
          localStorage.removeItem('csrf_token');
          if (sessionStorage.getItem('browser_tab_uuid')) {
            sessionStorage.removeItem('browser_tab_uuid');
          }
          localStorage.removeItem('previous_log_time');
        }
        store.dispatch(actions.logoutAction(null));
        removeCookiesOnSwitchAccount();
        removePrimaryDomainCookie();
        sessionStorage.clear();
        routeNavigate(
          history,
          ROUTE_METHOD.REPLACE,
          ROUTE_CONSTANTS.SIGNIN,
          null,
          null,
          true,
        );
      })
      .catch(() => {});
};
