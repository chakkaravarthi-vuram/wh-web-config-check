import { store } from '../../../../../Store';
import { FORM_POPOVER_STATUS } from '../../../../../utils/Constants';

let U_M_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS.USER_MANAGEMENT;

export const getAddMemberStrings = () => {
  return {
    ADD_USER: U_M_STRINGS.ADD_USER,
    CLEAR: U_M_STRINGS.CLEAR,
    TITLE: U_M_STRINGS.ADD_USER,
    EDIT_TITLE: U_M_STRINGS.EDIT_USER,
    EDIT_VIEW_FIELDS: 'user_settings_strings.user_profile_translation.add_member_string.edit_view_fields',
    CLICK_HERE: 'user_settings_strings.user_profile_translation.add_member_string.click_here',
    RESET_PASSWORD: 'user_settings_strings.user_profile_translation.add_member_string.reset_password',
    UPDATE: 'user_settings_strings.user_profile_translation.add_member_string.update',
    RESET_MFA: 'mfa.reset_mfa_string.reset_mfa',
    RESET_MFA_MODAL_CONTENT_LINE1: 'mfa.reset_mfa_string.modal_content_line1',
    RESET_MFA_MODAL_CONTENT_LINE2: 'mfa.reset_mfa_string.modal_content_line2',
    RESET_MFA_MODAL_DISABLE_BTN_TEXT: 'mfa.reset_mfa_string.modal_content_disable_btn',
    RESET_MFA_MODAL_CANCEL_BTN_TEXT: 'mfa.reset_mfa_string.modal_content_cancel_btn',
    SUCCESSFUL_ADD_MEMBER: (t = () => {}) => {
      return {
        title: t(U_M_STRINGS.SUCCESSFUL_ADD_MEMBER_TITLE),
        subTitle: t(U_M_STRINGS.SUCCESSFUL_ADD_MEMBER_SUBTITLE),
        status: FORM_POPOVER_STATUS.SUCCESS,
        isVisible: true,
      };
    },
    UPDATE_FAILURE: {
      title: 'Error',
      status: FORM_POPOVER_STATUS.SERVER_ERROR,
      isVisible: true,
    },
  };
};

export const ADD_MEMBERS_STRINGS = getAddMemberStrings();

store.subscribe(() => {
  console.log('datattt strings');
  U_M_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS.USER_MANAGEMENT;
  // ADD_MEMBERS_STRINGS = getAddMemberStrings();
});

export default ADD_MEMBERS_STRINGS;
