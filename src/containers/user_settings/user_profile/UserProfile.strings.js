import { translateFunction } from 'utils/jsUtility';
import { store } from '../../../Store';
import { FORM_POPOVER_STATUS } from '../../../utils/Constants';

// let { USER_PROFILE } = store.getState().LocalizationReducer.languageSettings.strings;

export const COUNTRY_CODE_ID = 'mobile_number_country_code';
export const COUNTRY_ID = 'mobile_number_country';
export const MOBILE_NUMBER_ID = 'mobile_number';
export const PROFILE_PIC_ID = 'profile_pic';
export const getUserProfileStrings = () => {
  const { USER_PROFILE } = store.getState().LocalizationReducer.languageSettings.strings;
  return {
    BASIC_DETAILS: USER_PROFILE.BASIC_DETAILS,
    EMAIL: USER_PROFILE.EMAIL,
    EMPLOYEE_ID: USER_PROFILE.EMPLOYEE_ID,
    CONTACT: {
      LABEL: USER_PROFILE.CONTACT,
      ID: 'contact',
      PLACEHOLDER: USER_PROFILE.CONTACT_NUMBER,
    },
    ORGANISATION_DETAILS: USER_PROFILE.ORGANISATION_DETAILS,
    CONTACT_DETAILS: 'Contact details',
    ROLE: USER_PROFILE.ROLE,
    BUSINESS_UNIT: USER_PROFILE.BUSINESS_UNIT,
    LOCATION: USER_PROFILE.LOCATION,
    REPORTING_MANAGER: USER_PROFILE.REPORTING_MANAGER,
    CHANGE_IMAGE: 'user_settings_strings.user_profile_translation.edit',
    ADD_IMAGE: 'user_settings_strings.user_profile_translation.add',
    DISCARD: USER_PROFILE.DISCARD,
    SAVE: USER_PROFILE.SAVE,
    USER_PROFILE_LABELS: (t = translateFunction) => {
      return {
        MOBILE_NUMBER: t(USER_PROFILE.MOBILE_NUMBER_LABEL),
        PROFILE_PIC: t(USER_PROFILE.PROFILE_PIC_LABEL),
      };
    },
    SUCCESSFUL_UPDATE: (t = translateFunction) => {
      return {
      title: t(USER_PROFILE.SUCCESSFUL_UPDATE_TITLE),
      subTitle: t(USER_PROFILE.SUCCESSFUL_UPDATE_SUBTITLE),
      status: FORM_POPOVER_STATUS.SUCCESS,
      isVisible: true,
      };
    },
    UPDATE_FAILURE: (t = translateFunction) => {
      return {
      title: t(USER_PROFILE.UPDATE_FAILURE_TITLE),
      status: FORM_POPOVER_STATUS.SERVER_ERROR,
      isVisible: true,
      };
    },
  };
};

export const U_P_STRINGS = getUserProfileStrings();

export const IMAGE_CROP = {
  ASPECT: 1 / 1,
  MIN_WIDTH: 100,
};

// store.subscribe(() => {
//   USER_PROFILE = store.getState().LocalizationReducer.languageSettings.strings.USER_PROFILE;
//   U_P_STRINGS = getUserProfileStrings();
// });
