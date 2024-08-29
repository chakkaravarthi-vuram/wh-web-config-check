import { WORKING_DAYS_VALIDATION, ACC_LOCALE_VALIDATION, DATE_VALIDATION, setJoiRef, constructJoiObject, ACC_LANGUAGE } from '../../../utils/ValidationConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { L_C_FORM, VALIDATE_SCHEMA } from './LanguagesAndCalendar.strings';
import { hasOwn } from '../../../utils/UtilityFunctions';
import jsUtils from '../../../utils/jsUtility';

export const languageDetailsValidateSchema = (t) => constructJoiObject({
  acc_language: ACC_LANGUAGE(t, t(L_C_FORM.LOCALE_DROPDOWN.LABEL)),
  acc_locale: ACC_LOCALE_VALIDATION(t, t(L_C_FORM.L_DROPDOWN.LABEL)),
  primary_locale: ACC_LANGUAGE(t, t(L_C_FORM.LOCALE_DROPDOWN.LABEL)),
  working_days: WORKING_DAYS_VALIDATION(t, t(L_C_FORM.WORKING_DAYS.LABEL)),
  working_hour_start_time: DATE_VALIDATION.required().label(t(VALIDATE_SCHEMA.WORK_START_TIME)),
  working_hour_end_time: DATE_VALIDATION
    .min(setJoiRef('working_hour_start_time'))
    .required()
    .label(t(VALIDATE_SCHEMA.WORK_END_TIME)),
});

export const getUpdatedLanguageDetailsData = (props, state) => {
  const data = {};
  console.log(props);
  if (!jsUtils.isEmpty(props)) {
    Object.keys(props).forEach((id) => {
        data[id] = state[id];
    });
    if (!hasOwn(props, 'allow_update_language_locale')) data.allow_update_language_locale = state.allow_update_language_locale;
    if (!hasOwn(props, 'allow_update_timezone')) data.allow_update_timezone = state.allow_update_timezone;
    if (
      jsUtils.isEmpty(data.acc_timezone) &&
      !jsUtils.isEmpty(state.acc_timezone) &&
      jsUtils.isEmpty(props.acc_timezone)
    ) {
      data[L_C_FORM.TZ_DROPDOWN.ID] = state.acc_timezone;
    }
  } else {
    data[L_C_FORM.L_DROPDOWN.ID] = state.acc_language;
    data[L_C_FORM.LOCALE_DROPDOWN.ID] = state.acc_locale;
    data.primary_locale = state.primary_locale;
    if (!jsUtils.isEmpty(state.acc_timezone)) data[L_C_FORM.TZ_DROPDOWN.ID] = state.acc_timezone;
    data[L_C_FORM.WORKING_DAYS.ID] = !jsUtils.isEmpty(state.working_days)
      ? state.working_days.sort()
      : state.working_days;
    data[L_C_FORM.WORKING_HOURS_FROM_DROPDOWN.ID] = state.working_hour_start_time;
    data[L_C_FORM.WORKING_HOURS_TO_DROPDOWN.ID] = state.working_hour_end_time;
    data.allow_update_language_locale = state.allow_update_language_locale;
    data.allow_update_timezone = state.allow_update_timezone;
  }

  return data;
};

export const updateLanguageStateFromResponse = (server_response) => {
  return {
    language_settings: server_response,
    acc_language: !jsUtils.isEmpty(server_response.acc_language) ? server_response.acc_language : null,
    acc_locale: !jsUtils.isEmpty(server_response.acc_locale) ? server_response.acc_locale : null,
    primary_locale: !jsUtils.isEmpty(server_response.primary_locale) ? server_response.primary_locale : null,
    acc_timezone: !jsUtils.isEmpty(server_response.acc_timezone) ? server_response.acc_timezone : [],
    allow_update_language_locale: server_response.allow_update_language_locale
      ? server_response.allow_update_language_locale
      : false,
      allow_update_timezone: server_response.allow_update_timezone
      ? server_response.allow_update_timezone
      : false,
    working_days: !jsUtils.isEmpty(server_response.working_days)
      ? server_response.working_days.slice()
      : [],
    working_hour_start_time: !jsUtils.isEmpty(server_response.working_hour_start_time)
      ? server_response.working_hour_start_time
      : EMPTY_STRING,
    working_hour_end_time: !jsUtils.isEmpty(server_response.working_hour_end_time)
      ? server_response.working_hour_end_time
      : EMPTY_STRING,
  };
};

export const getCurrentLanguageAndCalendarDetails = (state) => {
  const data = {
    [L_C_FORM.L_DROPDOWN.ID]: state.acc_language,
    [L_C_FORM.LOCALE_DROPDOWN.ID]: state.acc_locale,
    [L_C_FORM.TZ_DROPDOWN.ID]: state.acc_timezone,
    [L_C_FORM.WORKING_DAYS.ID]: !jsUtils.isEmpty(state.working_days)
      ? state.working_days.sort()
      : state.working_days,
    [L_C_FORM.WORKING_HOURS_FROM_DROPDOWN.ID]: state.working_hour_start_time,
    [L_C_FORM.WORKING_HOURS_TO_DROPDOWN.ID]: state.working_hour_end_time,
  };
  data.allow_update_language_locale = state.allow_update_language_locale;
  data.allow_update_timezone = state.allow_update_timezone;
  return data;
};

export const getLanguageInitialState = (state) => {
  return {
    acc_language: state.language_settings.acc_language
      ? state.language_settings.acc_language
      : null,
    acc_locale: state.language_settings.acc_locale ? state.language_settings.acc_locale : [],
    primary_locale: state.language_settings.primary_locale ? state.language_settings.primary_locale : null,
    acc_timezone: state.language_settings.acc_timezone
      ? state.language_settings.acc_timezone
      : null,
    working_days: state.language_settings.working_days ? state.language_settings.working_days : [],
    working_hour_start_time: state.language_settings.working_hour_start_time
      ? state.language_settings.working_hour_start_time
      : null,
    working_hour_end_time: state.language_settings.working_hour_end_time
      ? state.language_settings.working_hour_end_time
      : null,
    enable_button: false,
    error_list: [],
  };
};
