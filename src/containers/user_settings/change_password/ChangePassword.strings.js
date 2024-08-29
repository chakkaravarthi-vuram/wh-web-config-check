import { translateFunction } from 'utils/jsUtility';
import { store } from '../../../Store';
import { FORM_POPOVER_STATUS } from '../../../utils/Constants';

const CHANGE_PASSWORD_STRINGS = store.getState().LocalizationReducer.languageSettings.strings
  .CHANGE_PASSWORD;

export const { CHANGE_PASSWORD } = CHANGE_PASSWORD_STRINGS;
export const { CURRENT_PASSWORD } = CHANGE_PASSWORD_STRINGS;
export const CURRENT_PASSWORD_ID = 'current_password';
export const CURRENT_PASSWORD_PLACEHOLDER = 'user_settings_strings.user_change_password.password_place';
export const { NEW_PASSWORD } = CHANGE_PASSWORD_STRINGS;
export const NEW_PASSWORD_ID = 'new_password';
export const { CANCEL } = CHANGE_PASSWORD_STRINGS;
export const { CHANGE } = CHANGE_PASSWORD_STRINGS;
export const CHANGE_PASSWORD_SUCCESSFUL_UPDATE = {
  title: CHANGE_PASSWORD_STRINGS.CHANGED,
  subTitle: CHANGE_PASSWORD_STRINGS.PASSWORD_CHANGED,
  status: FORM_POPOVER_STATUS.SUCCESS,
  isVisible: true,
};

export const CHANGE_PASSWORD_UPDATE_FAILURE = {
  title: CHANGE_PASSWORD_STRINGS.ERROR,
  status: FORM_POPOVER_STATUS.SERVER_ERROR,
  isVisible: true,
};

export const CHANGE_PASSWORD_LABELS = (t = translateFunction) => {
  return {
  [CURRENT_PASSWORD_ID]: t(CURRENT_PASSWORD),
  [NEW_PASSWORD_ID]: t(NEW_PASSWORD),
  };
};

// store.subscribe(() => {
//   CHANGE_PASSWORD_STRINGS = store.getState().LocalizationReducer.languageSettings.strings
//     .CHANGE_PASSWORD;
//   CHANGE_PASSWORD = CHANGE_PASSWORD_STRINGS.CHANGE_PASSWORD;
//   CURRENT_PASSWORD = CHANGE_PASSWORD_STRINGS.CURRENT_PASSWORD;
//   CURRENT_PASSWORD_ID = 'current_password';
//   NEW_PASSWORD = CHANGE_PASSWORD_STRINGS.NEW_PASSWORD;
//   NEW_PASSWORD_ID = 'new_password';
//   CANCEL = CHANGE_PASSWORD_STRINGS.CANCEL;
//   CHANGE = CHANGE_PASSWORD_STRINGS.CHANGE;
//   CHANGE_PASSWORD_SUCCESSFUL_UPDATE = {
//     title: CHANGE_PASSWORD_STRINGS.CHANGED,
//     subTitle: CHANGE_PASSWORD_STRINGS.PASSWORD_CHANGED,
//     status: FORM_POPOVER_STATUS.SUCCESS,
//     isVisible: true,
//   };
//   CHANGE_PASSWORD_UPDATE_FAILURE = {
//     title: CHANGE_PASSWORD_STRINGS.ERROR,
//     status: FORM_POPOVER_STATUS.SERVER_ERROR,
//     isVisible: true,
//   };
//   CHANGE_PASSWORD_LABELS = {
//     [CURRENT_PASSWORD_ID]: CURRENT_PASSWORD,
//     [NEW_PASSWORD_ID]: NEW_PASSWORD,
//   };
// });
