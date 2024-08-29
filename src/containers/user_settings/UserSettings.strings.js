import { translateFunction } from 'utils/jsUtility';

export const USER_SETTINGS_TAB_INDEX = {
  PROFILE: 1,
  SETTINGS: 2,
  PASSWORD: 3,
  SECURITY_SETTINGS: 4,
  API_KEY_SECURITY: 5,
};

export const API_KEY_HEADER_LABELS = (t = translateFunction) => {
  return {
    DESCRIPTIVE_NAME: t('api_key_strings.headers.descriptive_name'),
    API_KEY: t('api_key_strings.headers.api_key'),
    LAST_USED: t('api_key_strings.headers.last_used'),
  };
};
export const SAVE_CANCEL_BUTTON_COL = {
  lg: 2,
  md: 3,
  sm: 4,
  xs: 5,
};

export function USER_SETTINGS_TAB(t = translateFunction) {
  return [
    {
      labelText: t('user_settings_strings.user_setting_tabs.user_profile'),
      value: USER_SETTINGS_TAB_INDEX.PROFILE,
      tabIndex: USER_SETTINGS_TAB_INDEX.PROFILE,
    },
    {
      labelText: t('user_settings_strings.user_setting_tabs.language_and_time'),
      value: USER_SETTINGS_TAB_INDEX.SETTINGS,
      tabIndex: USER_SETTINGS_TAB_INDEX.SETTINGS,
    },
    {
      labelText: t('user_settings_strings.user_setting_tabs.change_password'),
      value: USER_SETTINGS_TAB_INDEX.PASSWORD,
      tabIndex: USER_SETTINGS_TAB_INDEX.PASSWORD,
    },
    {
      labelText: t('user_settings_strings.user_setting_tabs.mfa'),
      value: USER_SETTINGS_TAB_INDEX.SECURITY_SETTINGS,
      tabIndex: USER_SETTINGS_TAB_INDEX.SECURITY_SETTINGS,
    },
    {
      labelText: t('user_settings_strings.user_setting_tabs.api_keys'),
      value: USER_SETTINGS_TAB_INDEX.API_KEY_SECURITY,
      tabIndex: USER_SETTINGS_TAB_INDEX.API_KEY_SECURITY,
    },
  ];
}
export function USER_SETTINGS_TAB_NON_ADMIN(t = translateFunction) {
  return [
    {
      labelText: t('user_settings_strings.user_setting_tabs.user_profile'),
      value: USER_SETTINGS_TAB_INDEX.PROFILE,
      tabIndex: USER_SETTINGS_TAB_INDEX.PROFILE,
    },
    {
      labelText: t('user_settings_strings.user_setting_tabs.language_and_time'),
      value: USER_SETTINGS_TAB_INDEX.SETTINGS,
      tabIndex: USER_SETTINGS_TAB_INDEX.SETTINGS,
    },
    {
      labelText: t('user_settings_strings.user_setting_tabs.change_password'),
      value: USER_SETTINGS_TAB_INDEX.PASSWORD,
      tabIndex: USER_SETTINGS_TAB_INDEX.PASSWORD,
    },
    {
      labelText: t('user_settings_strings.user_setting_tabs.mfa'),
      value: USER_SETTINGS_TAB_INDEX.SECURITY_SETTINGS,
      tabIndex: USER_SETTINGS_TAB_INDEX.SECURITY_SETTINGS,
    },
  ];
}

export const USER_SETTINGS_STRINGS = {
  TITLE: 'user_settings_strings.string_title',
};

export const API_KEY_STRINGS = (t = translateFunction) => {
  return {
    EDIT_KEY: t('api_key_strings.edit_key'),
    TITLE: t('api_key_strings.title'),
    API_KEY_NAME: t('api_key_strings.api_key_name'),
    NAME_EXIST_ERROR: t('api_key_strings.name_exist_error'),
    LIMIT_REACHED_TITLE: t('api_key_strings.limit_reached_title'),
    LIMIT_REACHED_INFO: t('api_key_strings.limit_reached_info'),
    SCOPE: t('api_key_strings.scope'),
    OKAY: t('api_key_strings.okay'),
    CREATE_NEW: t('api_key_strings.create_new'),
    GENERATE_KEY: t('api_key_strings.generate_key'),
    EDIT_API_KEY: t('api_key_strings.edit_api_key'),
    TITLE_INFO: t('api_key_strings.title_info'),
    DESCRIPTIVE_NAME: t('api_key_strings.descriptive_name'),
    NAME_PLACEHOLDER: t('api_key_strings.name_placeholder'),
    SCOPE_LABEL: t('api_key_strings.scope_label'),
    READ_WRITE_LABEL: t('api_key_strings.read_write_label'),
    WRITE_LABEL: t('api_key_strings.write_label'),
    READ_LABEL: t('api_key_strings.read_label'),
    CANCEL: t('api_key_strings.cancel'),
    SAVE: t('api_key_strings.save'),
    NEXT: t('api_key_strings.next'),
    CANT_DISPLAY_LIST: t('api_key_strings.cant_display_list'),
    COULD_NOT_LOAD: t('api_key_strings.could_not_load'),
    NO_KEY_FOUND: t('api_key_strings.no_key_found'),
    CREATE_FIRST_KEY: t('api_key_strings.create_first_key'),
    CREATE: t('api_key_strings.create'),
    YOUR_API_KEY: t('api_key_strings.your_api_key'),
    KEY_INFO: t('api_key_strings.key_info'),
    KEY_SUCCESS_TITLE: t('api_key_strings.key_success_title'),
    KEY_SUCCESS_INFO: t('api_key_strings.key_success_info'),
    DELETE_API_KEY: t('api_key_strings.delete_api_key'),
    DELETE_SUB_TEXT: t('api_key_strings.delete_sub_text'),
    DELETE: t('api_key_strings.delete'),
  };
};
