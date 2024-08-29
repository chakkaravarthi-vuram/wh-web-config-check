import { store } from '../../../Store';

let U_M_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS
  .USER_MANAGEMENT;

export const getRolesListString = () => [
  {
    label: U_M_STRINGS.MEMBER_CARD_STRINGS_GENERAL_USER,
    value: 2,
  },
  {
    label: U_M_STRINGS.MEMBER_CARD_STRINGS_FLOW_CREATOR,
    value: 3,
  },
  {
    label: U_M_STRINGS.MEMBER_CARD_STRINGS_SUPER_ADMIN,
    value: 1,
  },
];

export const getMemberCardStrings = () => {
  return {
    DEACTIVATE: U_M_STRINGS.MEMBER_CARD_STRINGS_DEACTIVATE,
    ACTIVATE: U_M_STRINGS.MEMBER_CARD_STRINGS_ACTIVATE,
  };
};

export const ROLES_LIST = getRolesListString();

export const MEMBER_CARD_STRINGS = getMemberCardStrings();

export const MEMBER_CARD_TYPE = {
  TYPE_1: 1,
  TYPE_2: 2,
};
export const ICON_STRINGS = {
  MAIL_ICON: 'Mail ID',
};

store.subscribe(() => {
  U_M_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS
    .USER_MANAGEMENT;
});
