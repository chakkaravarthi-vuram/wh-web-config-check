import { store } from '../../../../../../Store';

let U_M_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS
  .USER_MANAGEMENT;

export const getAddMemberBasicDetailsStrings = () => {
  return {
    TITLE: U_M_STRINGS.ADD_USER_BASIC_DETAILS_TITLE,
    FIRST_NAME: {
      LABEL: U_M_STRINGS.ADD_USER_FIRST_NAME_LABEL,
      ID: 'first_name',
      PLACEHOLDER: U_M_STRINGS.ADD_USER_FIRST_NAME_PLACEHOLDER,
    },
    LAST_NAME: {
      LABEL: U_M_STRINGS.ADD_USER_LAST_NAME_LABEL,
      ID: 'last_name',
      PLACEHOLDER: U_M_STRINGS.ADD_USER_LAST_NAME_PLACEHOLDER,
    },
    USER_NAME: {
      LABEL: U_M_STRINGS.ADD_USER_USER_NAME_LABEL,
      ID: 'username',
      PLACEHOLDER: U_M_STRINGS.ADD_USER_USER_NAME_PLACEHOLDER,
    },
    EMAIL: {
      LABEL: U_M_STRINGS.ADD_USER_EMAIL_LABEL,
      ID: 'email',
      PLACEHOLDER: U_M_STRINGS.ADD_USER_EMAIL_PLACEHOLDER,
    },
    USER_TYPE_RADIO: (t = () => {}) => {
      return {
      LABEL: t(U_M_STRINGS.ADD_USER_USER_TYPE_RADIO_LABEL),
      ID: 'user_type',
      OPTION_LIST: [
        {
          label: t(U_M_STRINGS.ADD_USER_USER_TYPE_RADIO_GENERAL_USER_LABEL),
          value: 2,
        },
        {
          label: t(U_M_STRINGS.ADD_USER_USER_TYPE_RADIO_FLOW_CREATOR_LABEL),
          value: 3,
        },
        {
          label: t(U_M_STRINGS.ADD_USER_USER_TYPE_RADIO_SUPER_ADMIN_LABEL),
          value: 1,
        },
      ],
    };
    },
    REPORTING_MANAGER_CB: (t = () => {}) => [
      {
        ID: 'not_reporting',
        label: t(U_M_STRINGS.ADD_USER_REPORTING_MANAGER_CHECKBOX_LABEL),
        value: 1,
      },
    ],
  };
};

export const ADD_MEMBER_BASIC_DETAILS_FORM = getAddMemberBasicDetailsStrings();

store.subscribe(() => {
  U_M_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS
    .USER_MANAGEMENT;
  // ADD_MEMBER_BASIC_DETAILS_FORM = getAddMemberBasicDetailsStrings();
});

export default ADD_MEMBER_BASIC_DETAILS_FORM;
