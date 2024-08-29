import { translate } from 'language/config';

export const TITLE = translate('sign_in.new_password_strings.new_password_title');

export const NEW_PASSWORD_LABEL = translate('sign_in.new_password_strings.new_password_label');

export const NEW_PASSWORD_PLACEHOLDER = translate('sign_in.new_password_strings.new_password_placeholder');

export const NEW_PASSWORD_ID = 'newPassword';

export const CONFIRM_PASSWORD_LABEL = translate('sign_in.new_password_strings.confirm_password_label');

export const CONFIRM_PASSWORD_PLACEHOLDER = translate('sign_in.new_password_strings.confirm_password_placeholder');

export const CONFIRM_PASSWORD_ID = 'confirmPassword';

export const SUBMIT_BUTTON = {
  LABEL: translate('sign_in.new_password_strings.submit_button'),
  ID: 'submit',
};

export const POST_DATA_KEYS = {
  [NEW_PASSWORD_ID]: 'new_password',
  [CONFIRM_PASSWORD_ID]: 'confirm_password',
  token: 'token',
};
