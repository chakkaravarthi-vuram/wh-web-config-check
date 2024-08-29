import { constructJoiObject, PASSWORD_VALIDATION, setJoiRef, STRING_VALIDATION } from '../../utils/ValidationConstants';
import { RESET_PASSWORD_STRINGS } from './ResetPassword.strings';

export const updatedResetPasswordDetailsValidateSchema = () => constructJoiObject({
  _id: STRING_VALIDATION,
  new_password: PASSWORD_VALIDATION.required().label(
    RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.LABEL,
  ),
  confirm_password: PASSWORD_VALIDATION.label(
    RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.LABEL,
  )
    .valid(setJoiRef(RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID))
    .required(),
});

export const resetPasswordDetailsValidateSchema = constructJoiObject({
  token: STRING_VALIDATION,
  new_password: PASSWORD_VALIDATION.required().label(
    RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.LABEL,
  ),
  confirm_password: PASSWORD_VALIDATION.label(
    RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.LABEL,
  )
    .valid(setJoiRef(RESET_PASSWORD_STRINGS.FORM_LABEL.PASSWORD.ID))
    .required(),
});

export default resetPasswordDetailsValidateSchema;
