/**
 * @author Asttle
 * @email asttlej@vuram.com
 * @create date 2020-01-29 18:13:53
 * @modify date 2020-01-29 18:13:53
 * @desc [description]
 */

import { ADMIN_SETTINGS_CONSTANT } from 'containers/admin_settings/AdminSettings.constant';
import { store } from '../../../../Store';
import { FORM_POPOVER_STATUS } from '../../../../utils/Constants';
import { translateFunction } from '../../../../utils/jsUtility';

const HOLIDAY_TABLE_STRINGS = store.getState().LocalizationReducer.languageSettings.strings
  .ADMIN_SETTINGS.LANGUAGE_AND_CALENDAR_SETTINGS;

export const getWebpageEmbedStrings = () => {
  return {
    ACTIVE_DELETE_ICON_ID: 'active_delete_icon',
    ACTIVE_CORRECT_ICON_ID: 'active_correct_icon',
    ADD_NEW: translateFunction(ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.EMBED_URL_TABLE_ADD_NEW),
    NO_DATA_FOUND: translateFunction(ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.EMBED_URL_TABLE_NO_DATA_FOUND),
    HEADERS: [{ id: 1, label: translateFunction(ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.WHITELISTED_DOMAIN) }, { id: 2, label: '' }, { id: 3, label: '' }],
    NEW_EMBED_URL_INPUT: {
      ID: 'embed_url_origin',
      PLACEHOLDER: translateFunction(ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.NEW_EMBED_URL_INPUT_PLACEHOLDER),
    },
  };
};

export const getWebpageEmbedResponseStrings = () => {
  return {
    SUCCESSFULLY_ADDED_EMBED_URL: {
      title: translateFunction(ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.EMBED_URL_ADDED_TITLE),
      subTitle: translateFunction(ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.EMBED_URL_ADDED_SUBTITLE),
      status: FORM_POPOVER_STATUS.SUCCESS,
      isVisible: true,
    },
    SUCCESSFULLY_REMOVED_EMBED_URL: {
      title: translateFunction(ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.EMBED_URL_REMOVED_TITLE),
      subTitle: translateFunction(ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.EMBED_URL_REMOVED_SUBTITLE),
      status: FORM_POPOVER_STATUS.SUCCESS,
      isVisible: true,
    },
    FAILURE: {
      title: 'Error',
      status: FORM_POPOVER_STATUS.SERVER_ERROR,
      isVisible: true,
    },
  };
};

export const getIconStrings = () => {
  return {
    ADD_ICON: HOLIDAY_TABLE_STRINGS.HOLIDAY_TABLE_ADD_ICON,
    CORRECT_ICON: HOLIDAY_TABLE_STRINGS.HOLIDAY_TABLE_CORRECT_ICON,
    DELETE_ICON: HOLIDAY_TABLE_STRINGS.HOLIDAY_TABLE_DELETE_ICON,
  };
};

export const ICON_STRINGS = getIconStrings();
