import { store } from '../../../../../../Store';

let U_M_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS
  .USER_MANAGEMENT;

export const getOtherDetailsStrings = () => {
  return {
    TITLE: 'Contact Details',
    PHONE_NUMBER: {
      LABEL: U_M_STRINGS.ADD_USER_PHONE_NUMBER_LABEL,
      ID: 'phone_number',
      PLACEHOLDER: U_M_STRINGS.ADD_USER_PHONE_NUMBER_PLACEHOLDER,
    },
    MOBILE_NUMBER: {
      LABEL: U_M_STRINGS.ADD_USER_MOBILE_NUMBER_LABEL,
      ID: 'mobile_number',
      PLACEHOLDER: U_M_STRINGS.ADD_USER_MOBILE_NUMBER_PLACEHOLDER,
    },
    MOBILE_NUMBER_COUNTRY_CODE: {
      ID: 'mobile_number_country_code',
    },
    MOBILE_NUMBER_COUNTRY: {
      ID: 'mobile_number_country',
    },
  };
};

export const CONTACT_DETAILS_FORM = getOtherDetailsStrings();

store.subscribe(() => {
  U_M_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS
    .USER_MANAGEMENT;
  // CONTACT_DETAILS_FORM = getOtherDetailsStrings();
});

export default CONTACT_DETAILS_FORM;
