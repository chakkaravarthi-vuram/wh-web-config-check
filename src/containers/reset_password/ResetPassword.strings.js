import { translate } from 'language/config';

export const RESET_PASSWORD_STRINGS = {
  TITLE: translate('sign_in.reset_password_strings.reset_title'),
  SUB_TITLE: translate('sign_in.reset_password_strings.reset_sub_title'),
  WORK_EMAIL: 'Work Email: ',
  FORM_LABEL: {
    USER_NAME: {
      ID: 'username',
      LABEL: 'User name',
    },
    CONFIRM_PASSWORD: {
      ID: 'confirm_password',
      LABEL: translate('sign_in.reset_password_strings.reset_confirm_password'),
      PLACEHOLDER: translate('sign_in.reset_password_strings.reset_password_placeholder'),
    },
    PASSWORD: {
      ID: 'new_password',
      LABEL: translate('sign_in.reset_password_strings.reset_password_label'),
      PLACEHOLDER: translate('sign_in.reset_password_strings.reset_password_placeholder'),
    },
    RESET_BUTTON: {
      LABEL: translate('sign_in.reset_password_strings.reset_button'),
    },
  },
};
export const RESET_PASSWORD_LABELS = {
  [RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.ID]: RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.LABEL,
  [RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID]: RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.LABEL,
};
export const ICON_STRINGS = {
  LOGO_SMALL: 'OneThing',
};

export const CONFIRM_PASSWORD_STRINGS = {
CONFIRM_PASSWORD: 'sign_in.confirm_passwors_strings.confirm_password',
PASSWORD: 'sign_in.confirm_passwors_strings.password',
CHARACTERS: 'sign_in.confirm_passwors_strings.characters',
DIGIT_CHARACTERS: 'sign_in.confirm_passwors_strings.digit_characters',
ALPHANUMERIC_CHARACTERS: 'sign_in.confirm_passwors_strings.alphanumeric_characters',
EQUAL_TO_PASSWORD: 'sign_in.confirm_passwors_strings.equal_to_password',
SYMBOL_REQUIRED: 'sign_in.confirm_passwors_strings.symbol_required',
};
