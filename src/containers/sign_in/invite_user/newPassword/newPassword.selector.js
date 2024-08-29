import { CONFIRM_PASSWORD_ID, NEW_PASSWORD_ID, POST_DATA_KEYS } from './newPassword.strings';

export const getValidationData = (newPassword, confirmPassword) => {
  return {
    [NEW_PASSWORD_ID]: newPassword,
    [CONFIRM_PASSWORD_ID]: confirmPassword,
  };
};

export const getPostData = (newPassword, confirmPassword, id) => {
  return {
    [POST_DATA_KEYS.confirmPassword]: confirmPassword,
    [POST_DATA_KEYS.newPassword]: newPassword,
    [POST_DATA_KEYS.token]: id,
  };
};
