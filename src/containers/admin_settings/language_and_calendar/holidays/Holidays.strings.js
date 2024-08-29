import { ADMIN_SETTINGS_CONSTANT } from 'containers/admin_settings/AdminSettings.constant';
import { translateFunction } from 'utils/jsUtility';
import { store } from '../../../../Store';
import { L_C_FORM } from '../LanguagesAndCalendar.strings';
import { HOLIDAY_TABLE } from './holiday_table/HolidayTable.strings';
import { FORM_POPOVER_STATUS } from '../../../../utils/Constants';

let HOLIDAY_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS
  .LANGUAGE_AND_CALENDAR_SETTINGS;

export const getTableStrings = () => {
  return {
    OCCASION: ADMIN_SETTINGS_CONSTANT.LANGUAGE_CALENDAR.HOLIADY_TABLE_OCCASION,
    DATE: ADMIN_SETTINGS_CONSTANT.LANGUAGE_CALENDAR.HOLIADY_TABLE_DATE,
  };
};

export const getHolidayResponseStrings = () => {
  return {
    SUCCESSFULLY_ADDED_OCCASION: {
      title: translateFunction(HOLIDAY_STRINGS.HOLIDAY_TABLE_RESPONSE_ADDED_TITLE),
      subTitle: translateFunction(HOLIDAY_STRINGS.HOLIDAY_TABLE_RESPONSE_ADDED_SUBTITLE),
      status: FORM_POPOVER_STATUS.SUCCESS,
      isVisible: true,
    },
    SUCCESSFULLY_REMOVED_OCCASION: {
      title: translateFunction(HOLIDAY_STRINGS.HOLIDAY_TABLE_RESPONSE_REMOVED_TITLE),
      subTitle: translateFunction(HOLIDAY_STRINGS.HOLIDAY_TABLE_RESPONSE_REMOVED_SUBTITLE),
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

export const TABLE = getTableStrings();

export const year_DROPDOWN = {
  ID: 'year',
};

export const HOLIDAY_LABELS = {
  [L_C_FORM.YEAR_DROPDOWN.ID]: L_C_FORM.YEAR_DROPDOWN.LABEL,
  [HOLIDAY_TABLE.OCCASION_INPUT.ID]: HOLIDAY_TABLE.OCCASION_INPUT.LABEL,
  [HOLIDAY_TABLE.DATE.ID]: HOLIDAY_TABLE.DATE.LABEL,
};

export const HOLIDAY_RESPONSE = getHolidayResponseStrings();

store.subscribe(() => {
  HOLIDAY_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS
    .LANGUAGE_AND_CALENDAR_SETTINGS;
});
