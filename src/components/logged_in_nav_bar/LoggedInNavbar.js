import React from 'react';
import SignOutIcon from 'assets/icons/SignOutIcon';
import UserIconProfileDropDown from 'assets/icons/UserIconProfileDropDown';
import { ARIA_ROLES } from 'utils/UIConstants';
import DownloadIconV2 from 'assets/icons/form_fields/DownloadIconV2';
import { translateFunction } from 'utils/jsUtility';
import { store } from '../../Store';

let { LOGGED_IN_NAVBAR } = store.getState().LocalizationReducer.languageSettings.strings;
export const USER_PROFILE_DROPDOWN_INDEX = {
  ADMIN_SETTINGS: 2,
  LANGUAGE_TIME_ZONE: 4,
  SIGN_OUT: 5,
  MY_DOWNLOADS: 6,
};

const getLoggedInNavbarStrings = (t) => {
  return {
    NAV_LIST: [
      {
        ADMIN_SETTINGS: LOGGED_IN_NAVBAR.ADMIN_SETTINGS,
      },
    ],

    USER_PROFILE_DROPDOWN: [
      {
        ID: 'menuLink_adminSetings',
        TEXT: t(LOGGED_IN_NAVBAR.ADMIN_SETTINGS),
        INDEX: USER_PROFILE_DROPDOWN_INDEX.ADMIN_SETTINGS,
      },
      {
        ID: 'menuLink_userProfile',
        TEXT: t(LOGGED_IN_NAVBAR.USER_SETTINGS),
        INDEX: USER_PROFILE_DROPDOWN_INDEX.LANGUAGE_TIME_ZONE,
      },
      {
        ID: 'menuLink_signout',
        TEXT: t(LOGGED_IN_NAVBAR.SIGN_OUT),
        INDEX: USER_PROFILE_DROPDOWN_INDEX.SIGN_OUT,
      },
    ],
    NON_ADMIN_USER_PROFILE_DROPDOWN: [
      {
        ID: 'menuLink_userProfile',
        TEXT: t(LOGGED_IN_NAVBAR.USER_SETTINGS),
        INDEX: USER_PROFILE_DROPDOWN_INDEX.LANGUAGE_TIME_ZONE,
        ICON: <UserIconProfileDropDown role={ARIA_ROLES.IMG} title="User Profile" />,
      },
      {
        ID: 'menuLink_myDownloads',
        TEXT: t(LOGGED_IN_NAVBAR.MY_DOWNLOADS),
        INDEX: USER_PROFILE_DROPDOWN_INDEX.MY_DOWNLOADS,
        ICON: <DownloadIconV2 role={ARIA_ROLES.IMG} title={t(LOGGED_IN_NAVBAR.MY_DOWNLOADS)} />,
      },
      {
        ID: 'menuLink_signout',
        TEXT: t(LOGGED_IN_NAVBAR.SIGN_OUT),
        INDEX: USER_PROFILE_DROPDOWN_INDEX.SIGN_OUT,
        ICON: <SignOutIcon role={ARIA_ROLES.IMG} title={t(LOGGED_IN_NAVBAR.SIGN_OUT)} />,
      },
    ],
  };
};

const getIconStrings = () => {
  return {
    LOGO_SMALL: LOGGED_IN_NAVBAR.LOGO_SMALL,
    NOTIFICATION_ICON: LOGGED_IN_NAVBAR.NOTIFICATION_ICON,
    CHAT_ICON: LOGGED_IN_NAVBAR.CHAT_ICON,
  };
};

export function LOGGED_IN_NAVBAR_STRINGS(t = translateFunction) {
  return getLoggedInNavbarStrings(t);
}

export const ICON_STRINGS = getIconStrings();

store.subscribe(() => {
  LOGGED_IN_NAVBAR = store.getState().LocalizationReducer.languageSettings.strings.LOGGED_IN_NAVBAR;
});
