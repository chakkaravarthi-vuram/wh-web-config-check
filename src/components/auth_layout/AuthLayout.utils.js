import { SIGN_UP_STRINGS } from '../../containers/sign_up/SignUp.strings';
// import { SIGN_IN_STRINGS } from '../../containers/sign_in/SignIn.strings';
import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import { AUTH_PAGE_TYPES, ROUTE_METHOD } from '../../utils/Constants';
import { language } from '../../language/config';
import { routeNavigate } from '../../utils/UtilityFunctions';

export const getNavBarDetails = (navBarType, history) => {
  let navBarText = null;
  let navBarButtonName = null;
  let navBarButtonAction = null;
  let navBarButtonId = null;
  let navBarButtonAction1 = null;
  // let navBarButtonAction2 = null;
  if (navBarType === AUTH_PAGE_TYPES.SIGN_UP) {
    navBarText = SIGN_UP_STRINGS.EXISTING_ACCOUNT;
    navBarButtonId = SIGN_UP_STRINGS.SIGN_IN_ID;
    navBarButtonName = SIGN_UP_STRINGS.SIGN_IN;
    navBarButtonAction = () => routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNIN, null, null, true);
  } else if (navBarType === AUTH_PAGE_TYPES.SIGN_IN) {
    // navBarText = SIGN_IN_STRINGS.SWITCH_ACCOUNT;
    // navBarButtonId = SIGN_IN_STRINGS.FORM_LABEL.SIGN_UP_BUTTON.ID;
    // navBarButtonName = SIGN_IN_STRINGS.FORM_LABEL.SIGN_UP_BUTTON.LABEL;
  } else if (navBarType === AUTH_PAGE_TYPES.FORGOT_PASSWORD) {
    navBarButtonAction1 = () => routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNIN, null, null, true);
  } else {
    // navBarText = SIGN_IN_STRINGS.SWITCH_ACCOUNT;
    // navBarButtonId = SIGN_IN_STRINGS.FORM_LABEL.SIGN_IN_BUTTON.ID;
    // navBarButtonName = SIGN_IN_STRINGS.FORM_LABEL.SIGN_UP_BUTTON.LABEL;
  }

  return { navBarText, navBarButtonId, navBarButtonName, navBarButtonAction, navBarButtonAction1 };
};

export const LANGUAGE_OPTION_LIST = [
  {
    value: language.english_united_kingdom,
    label: 'EN-GB',
  },
  {
    value: language.spanish_mexico,
    label: 'ES-MX',
  },
  {
    value: language.solvene,
    label: 'SL-SI',
  },
];

export default getNavBarDetails;
