/**
 * @author Asttle
 * @email asttlej@vuram.com
 * @create date 2020-01-29 18:13:53
 * @modify date 2020-01-29 18:13:53
 * @desc [description]
 */

import { ADMIN_SETTINGS_CONSTANT } from 'containers/admin_settings/AdminSettings.constant';
import { store } from '../../../../../Store';

const HOLIDAY_TABLE_STRINGS = store.getState().LocalizationReducer.languageSettings.strings
  .ADMIN_SETTINGS.LANGUAGE_AND_CALENDAR_SETTINGS;

export const getHolidayTableStrings = () => {
  return {
    ACTIVE_DELETE_ICON_ID: 'active_delete_icon',
    ACTIVE_CORRECT_ICON_ID: 'active_correct_icon',
    OCCASION_INPUT: {
      PLACEHOLDER: ADMIN_SETTINGS_CONSTANT.LANGUAGE_CALENDAR.HOLIDAY_TABLE_OCCASION_INPUT_PLACEHOLDER,
      ID: 'occasion',
      LABEL: ADMIN_SETTINGS_CONSTANT.LANGUAGE_CALENDAR.HOLIDAY_TABLE_OCCASION_INPUT_LABEL,
    },
    DATE: {
      ID: 'date',
      LABEL: HOLIDAY_TABLE_STRINGS.HOLIDAY_TABLE_DATE_LABEL,
    },
    ADD_NEW: ADMIN_SETTINGS_CONSTANT.LANGUAGE_CALENDAR.HOLIADY_TABLE_ADD_NEW,
    NO_DATA_FOUND: ADMIN_SETTINGS_CONSTANT.LANGUAGE_CALENDAR.HOLIADY_TABLE_NO_DATA_FOUND,
  };
};

export const HOLIDAY_TABLE = getHolidayTableStrings();

export const getIconStrings = () => {
  return {
    ADD_ICON: HOLIDAY_TABLE_STRINGS.HOLIDAY_TABLE_ADD_ICON,
    CORRECT_ICON: HOLIDAY_TABLE_STRINGS.HOLIDAY_TABLE_CORRECT_ICON,
    DELETE_ICON: HOLIDAY_TABLE_STRINGS.HOLIDAY_TABLE_DELETE_ICON,
  };
};

export const ICON_STRINGS = getIconStrings();

export const LAYOUT_STRINGS = {
  OCCASION: '6',
  DATE: '6',
};

export const HOLIDAY_DATE = 'holiday_date';
