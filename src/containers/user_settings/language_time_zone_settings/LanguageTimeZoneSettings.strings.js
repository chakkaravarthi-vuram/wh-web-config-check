// import { store } from '../../../Store';
// import { FORM_POPOVER_STATUS } from '../../../utils/Constants';
// export let LANGUAGE_TIME_ZONE = store.getState().LocalizationReducer.languageSettings.strings
//   .LANGUAGE_TIME_ZONE;

const getLTZStrings = () => {
  return {
    L_DROPDOWN: {
      LABEL: 'user_settings_strings.language_time_zone.l_dropdown_label',
      ID: 'pref_language',
      PLACEHOLDER: 'user_settings_strings.language_time_zone.l_dropdown_placeholder',
    },
    LOCALE_DROPDOWN: {
      LABEL: 'user_settings_strings.language_time_zone.locale_label',
      ID: 'pref_locale',
      PLACEHOLDER: 'user_settings_strings.language_time_zone.locale_placeholder',
    },
    TZ_DROPDOWN: {
      LABEL: 'user_settings_strings.language_time_zone.tz_label',
      ID: 'pref_timezone',
      PLACEHOLDER: 'user_settings_strings.language_time_zone.tz_placeholder',
    },
    CANCEL_BUTTON: {
      LABEL: 'user_settings_strings.language_time_zone.cancel_button',
      ID: 'ltz_cancel',
    },
    SAVE_BUTTON: {
      LABEL: 'user_settings_strings.language_time_zone.save_button',
      ID: 'ltz_save',
    },
    ALERT_CONTENT: 'user_settings_strings.language_time_zone.alert_content',
    LANGUAGE_LOCALE: 'user_settings_strings.language_time_zone.language_locale',
    TIME_ZONE: 'user_settings_strings.language_time_zone.time_zone',
  };
};

export const LTZ_STRINGS = getLTZStrings();

// store.subscribe(() => {
//   LANGUAGE_TIME_ZONE = store.getState().LocalizationReducer.languageSettings.strings.LANDING_PAGE;
//    LTZ_STRINGS = getLTZStrings();
// });

export default LTZ_STRINGS;
