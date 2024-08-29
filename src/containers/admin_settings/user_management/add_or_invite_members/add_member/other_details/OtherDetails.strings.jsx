import { store } from '../../../../../../Store';

let U_M_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS.USER_MANAGEMENT;

export const getOtherDetailsStrings = () => {
  return {
    TITLE: U_M_STRINGS.ADD_USER_OTHER_DETAILS_TITLE,
    ROLE: {
      LABEL: U_M_STRINGS.ADD_USER_ROLE_LABEL,
      ID: 'role',
      PLACEHOLDER: U_M_STRINGS.ADD_USER_ROLE_PLACEHOLDER,
    },
    BUSSINESS_UNIT: {
      LABEL: U_M_STRINGS.ADD_USER_BUSINESS_UNIT_LABEL,
      ID: 'business_unit',
      PLACEHOLDER: U_M_STRINGS.ADD_USER_BUSINESS_UNIT_PLACEHOLDER,
    },
    PHONE_NUMBER: {
      LABEL: U_M_STRINGS.ADD_USER_PHONE_NUMBER_LABEL,
      ID: 'phone_number',
      PLACEHOLDER: U_M_STRINGS.ADD_USER_PHONE_NUMBER_PLACEHOLDER,
    },
    MOBILE_NUMBER: {
      LABEL: U_M_STRINGS.ADD_USER_MOBILE_NUMBER_LABEL,
      ID: 'mobile_number',
      PLACEHOLDER: U_M_STRINGS.ADD_USER_MOBILE_NUMBER_PLACEHOLDER,
      MIN_ERROR: U_M_STRINGS.ADD_USER_MOBILE_NUMBER_MIN_ERROR,
      MAX_ERROR: U_M_STRINGS.ADD_USER_MOBILE_NUMBER_MAX_ERROR,
    },
    MOBILE_NUMBER_COUNTRY_CODE: {
      ID: 'mobile_number_country_code',
    },
    MOBILE_NUMBER_COUNTRY: {
      ID: 'mobile_number_country',
    },
    REPORTING_MANAGER: {
      LABEL: U_M_STRINGS.ADD_USER_REPORTING_MANAGER_LABEL,
      ID: 'reporting_manager',
    },
    ADD_ROLE: {
      ID: 'roles',
      LABEL: U_M_STRINGS.ADD_USER_ADD_ROLE_LABEL,
    },
    ADD_BUSINESS_UIT: {
      ID: 'business_units',
      LABEL: U_M_STRINGS.ADD_USER_ADD_BUSINESS_UNIT_LABEL,
    },
  };
};

export const OTHER_DETAILS_FORM = getOtherDetailsStrings();

store.subscribe(() => {
  U_M_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS.USER_MANAGEMENT;
  // OTHER_DETAILS_FORM = getOtherDetailsStrings();
});

export default OTHER_DETAILS_FORM;
