import { translateFunction } from 'utils/jsUtility';
import { constructJoiObject, EMAIL_VALIDATION, STRING_VALIDATION } from '../../../utils/ValidationConstants';
import { FORGOT_PASSWORD_STRINGS } from '../SignIn.strings';

export const forgotPasswordValidateSchema = (t = translateFunction) => constructJoiObject({
  email: EMAIL_VALIDATION.required().label(t(FORGOT_PASSWORD_STRINGS.FORM_LABEL.EMAIL.LABEL)),
  account_id: STRING_VALIDATION.required().label(FORGOT_PASSWORD_STRINGS.ACCOUNT_ID),
});

export default forgotPasswordValidateSchema;
