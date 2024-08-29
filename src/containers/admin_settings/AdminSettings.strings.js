import React from 'react';

import AccountSetingIconNew from 'assets/icons/admin_settings/new_icons/AccountSettingsV2';
import UserManageNewIcon from 'assets/icons/admin_settings/new_icons/UserManageV2';
import UsageDashboardIconNew from 'assets/icons/admin_settings/new_icons/UsageDashboardV2';
import LanguageCalendarIcon from 'assets/icons/admin_settings/new_icons/LanguageCalendarV2';
import OtherSettingNewIcon from 'assets/icons/admin_settings/new_icons/OtherSettingsV2';
import { ARIA_ROLES } from 'utils/UIConstants';
import { translateFunction } from 'utils/jsUtility';
import { store } from '../../Store';

import AccountSettingsIcon from '../../assets/icons/admin_settings/AccountSettingsIcons';
import UserManagementIcon from '../../assets/icons/admin_settings/UserManagementIcon';
import CalendarIcon from '../../assets/icons/admin_settings/CalendarIcon';
import SettingsIcon from '../../assets/icons/admin_settings/SettingsIcon';

import { ACCOUNT_SETTINGS_FORM } from './account_settings/AccountSettings.strings';
import { L_C_FORM } from './language_and_calendar/LanguagesAndCalendar.strings';
import { USER_MANAGEMENT_FORM } from './user_management/UserManagement.strings';
import NoticeBoardSettingsIcon from '../../assets/icons/admin_settings/NoticeBoardSettingsIcon';
import LookUpIcon from '../../assets/icons/admin_settings/LookUpIcon';
import NoticeBoardIcon from '../../assets/icons/NoticeBoardIcon';
import LibraryManagement from '../../assets/icons/LibraryManagement';
import SettingsIconNew from '../../assets/icons/flow/SettingsIcon';
import { ADMIN_SETTINGS_CONSTANT } from './AdminSettings.constant';

let ADMIN_SETTINGS_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS;

export const ADMIN_SETTINGS_TAB_INDEX = {
  ACCOUNT_SETTINGS: 1,
  USER_MANAGEMENT: 2,
  USAGE_DASHBOARD: 3,
  LOOK_UP_MANAGEMENT: 4,
  LANGUAGE_AND_CALENDAR: 5,
  OTHER_SETTINGS: 6,
  COVER_SETTINGS: 7,
  AUTHENTICATION: 8,
};

export const CUSTOM_LAYOUT_COL = { lg: 10, md: 10, sm: 12, xs: 12 };

export const SAVE_BUTTON_COL_SIZE = { lg: 2, md: 2, sm: 2, xs: 4 };

export const getAdminSettingsTabStrings = () => [
  {
    TEXT: ADMIN_SETTINGS_STRINGS.ACCOUNT_SETTINGS_TAB_TITLE,
    INDEX: ADMIN_SETTINGS_TAB_INDEX.ACCOUNT_SETTINGS,
    ICON: <AccountSettingsIcon />,
  },
  {
    TEXT: ADMIN_SETTINGS_STRINGS.COVER_SETTINGS_TAB_TITLE || 'Notice Board Settings',
    INDEX: ADMIN_SETTINGS_TAB_INDEX.COVER_SETTINGS,
    ICON: <NoticeBoardSettingsIcon />,
  },
  {
    TEXT: ADMIN_SETTINGS_STRINGS.USER_MANAGEMENT_TAB_TITLE,
    INDEX: ADMIN_SETTINGS_TAB_INDEX.USER_MANAGEMENT,
    ICON: <UserManagementIcon />,
  },
  {
    TEXT: ADMIN_SETTINGS_STRINGS.LANGUAGE_AND_CALENDAR_SETTINGS_TAB_TITLE,
    INDEX: ADMIN_SETTINGS_TAB_INDEX.LANGUAGE_AND_CALENDAR,
    ICON: <CalendarIcon />,
  },
  {
    TEXT: ADMIN_SETTINGS_STRINGS.OTHER_SETTINGS_TAB_TITLE,
    INDEX: ADMIN_SETTINGS_TAB_INDEX.OTHER_SETTINGS,
    ICON: <SettingsIcon />,
  }, {
    TEXT: ADMIN_SETTINGS_STRINGS.AUTHENTICATION_SETTINGS_TAB_TITLE,
    INDEX: ADMIN_SETTINGS_TAB_INDEX.AUTHENTICATION,
    ICON: <AccountSettingsIcon />,
  },
  {
    TEXT: ADMIN_SETTINGS_STRINGS.LIBRARY_MANAGEMENT_TAB_TITLE,
    INDEX: ADMIN_SETTINGS_TAB_INDEX.LOOK_UP_MANAGEMENT,
    ICON: <LookUpIcon />,
  },
];

export const getAdminSettingsStrings = () => {
  return { TITLE: ADMIN_SETTINGS_STRINGS.TITLE, ID: 'admin_settings' };
};

export const ADMIN_SETTINGS_TABS = getAdminSettingsTabStrings();

export const ADMIN_SETTINGS_LABELS = (t = translateFunction) => {
  return {
    [ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID]: t(ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.LABEL),
    [ACCOUNT_SETTINGS_FORM.ACCOUNT_LOGO.ID]: ACCOUNT_SETTINGS_FORM.ACCOUNT_LOGO.LABEL,
    [ACCOUNT_SETTINGS_FORM.PRIMARY_COLOR.ID]: ACCOUNT_SETTINGS_FORM.PRIMARY_COLOR.LABEL,
    [ACCOUNT_SETTINGS_FORM.SECONDARY_COLOR.ID]: ACCOUNT_SETTINGS_FORM.SECONDARY_COLOR.LABEL,
    [ACCOUNT_SETTINGS_FORM.BUTTON_COLOR.ID]: ACCOUNT_SETTINGS_FORM.BUTTON_COLOR.LABEL,
    [USER_MANAGEMENT_FORM.USER_TYPE]: USER_MANAGEMENT_FORM.USER_TYPE.LABEL,
    [L_C_FORM.L_DROPDOWN.ID]: L_C_FORM.L_DROPDOWN.LABEL,
    [L_C_FORM.LOCALE_DROPDOWN.ID]: L_C_FORM.LOCALE_DROPDOWN.LABEL,
    [L_C_FORM.TZ_DROPDOWN.ID]: L_C_FORM.TZ_DROPDOWN.LABEL,
    [L_C_FORM.WORKING_DAYS.ID]: L_C_FORM.WORKING_HOURS_FROM_DROPDOWN.LABEL,
    [L_C_FORM.WORKING_HOURS_FROM_DROPDOWN.ID]: L_C_FORM.WORKING_HOURS_FROM_DROPDOWN.LABEL,
    [L_C_FORM.WORKING_HOURS_TO_DROPDOWN.ID]: L_C_FORM.WORKING_HOURS_FROM_DROPDOWN.LABEL,
  };
};

export const ADMIN_SETTINGS = getAdminSettingsStrings();

store.subscribe(() => {
  ADMIN_SETTINGS_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS;
  // ADMIN_SETTINGS_TABS = getAdminSettingsTabStrings();
  // ADMIN_SETTINGS = getAdminSettingsStrings();
});

export const ADMIN_SETTINGS_NAVBAR_STRINGS = {
  ID: 'ADMIN_SETTINGS_TAB_ID',
  ACCOUNT_SETTINGS: 1,
  USER_MANAGEMENT: 2,
  USAGE_DASHBOARD: 3,
  LIBRARY_MANAGEMENT: 4,
  LANGUAGE_AND_CALENDAR: 5,
  OTHER_SETTINGS: 6,
  MORE: 'More',
  OPTION_LIST: (t) => [
    {
      label: t(ADMIN_SETTINGS_CONSTANT.SETTINGS.TITLE),
      value: 1,
      icon: <SettingsIconNew role={ARIA_ROLES.IMG} ariaLabel="Setings" />,
      defaultView: true,
    },
    {
      label: t(ADMIN_SETTINGS_CONSTANT.USER_MANAGEMENT.TITLE),
      value: 2,
      icon: <UserManageNewIcon role={ARIA_ROLES.IMG} ariaLabel="User Management" />,
      defaultView: true,
    },
    {
      label: t(ADMIN_SETTINGS_CONSTANT.USAGE_DASHBOARD.TITLE),
      value: 3,
      icon: <UsageDashboardIconNew role={ARIA_ROLES.IMG} ariaLabel="Usage Dashboard" />,
      defaultView: true,
    },
    {
      label: t(ADMIN_SETTINGS_CONSTANT.LIBRARY_MANAGEMENT.TITLE),
      value: 4,
      icon: <LibraryManagement role={ARIA_ROLES.IMG} ariaLabel="Library Management" />,
      defaultView: false,
    },
  ],
  SETTINGS_LIST: [
    {
      label: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.TITLE,
      value: 1,
      icon: <AccountSetingIconNew />,
      defaultView: true,
    },
    {
      label: ADMIN_SETTINGS_CONSTANT.LANGUAGE_CALENDAR.TITLE,
      value: 5,
      icon: <LanguageCalendarIcon />,
      defaultView: false,
    },
    {
      label: ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.TITLE,
      value: 6,
      icon: <OtherSettingNewIcon />,
      defaultView: false,
    },
    {
      label: ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.TITLE,
      value: 7,
      icon: <NoticeBoardIcon />,
      defaultView: false,
    },
  ],
};

export const getAdminSettingNavOptions = () => [
  {
    label: 'Account Settings',
    value: 1,
    icon: <AccountSetingIconNew />,
  },
  {
    label: 'User Management',
    value: 2,
    icon: <UserManageNewIcon />,
  },
  {
    label: 'Usage Dashboard',
    value: 3,
    icon: <UsageDashboardIconNew />,
  },
  {
    label: 'Library Management',
    value: 4,
    icon: <LanguageCalendarIcon />,
  },
  {
    label: 'Language & Calendar',
    value: 5,
    icon: <LanguageCalendarIcon />,
  },
  {
    label: 'Other Settings',
    value: 6,
    icon: <OtherSettingNewIcon />,
  },
];

export const admin_tab_list = [
  {
    label: 'All Flows',
    value: 0,
  },
  {
    label: 'Managed by You',
    value: 1,
  },
  {
    label: 'Managed by Others',
    value: 2,
  },
];

export const SETTINGS_TAB_DATA = (t) => [
  {
    TEXT: t(ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.TITLE),
    INDEX: 1,
    ICON: AccountSetingIconNew,
  },
  {
    TEXT: t(ADMIN_SETTINGS_CONSTANT.LANGUAGE_CALENDAR.TITLE),
    INDEX: 5,
    ICON: LanguageCalendarIcon,
  },
  {
    TEXT: t(ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.TITLE),
    INDEX: 6,
    ICON: OtherSettingNewIcon,
  },
  {
    TEXT: t(ADMIN_SETTINGS_CONSTANT.NOTICE_BOARD_SETTINGS.TITLE),
    INDEX: 7,
    ICON: NoticeBoardIcon,
  },
];
