import Joi from 'joi';
import { translateFunction } from 'utils/jsUtility';
import { USER_NAME_VALIDATION, constructJoiObject, REQUIRED_VALIDATION, EMAIL_VALIDATION, STRING_VALIDATION, ACCOUNT_DOMAIN_CASE_INSENSITIVE_VALIDATION } from '../../utils/ValidationConstants';
import { SIGN_IN_STRINGS } from './SignIn.strings';

export const signinDetailsValidateSchema = (t = translateFunction) => constructJoiObject({
  username: USER_NAME_VALIDATION(t).required().label(t(SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.LABEL)),
  password: REQUIRED_VALIDATION.label(t(SIGN_IN_STRINGS.FORM_LABEL.PASSWORD.LABEL)), // Allowing any non-empty password to make the backend handles any random password
  account_id: REQUIRED_VALIDATION,
});

export const userAccountSelectionValidateSchema = constructJoiObject({
  account_id: REQUIRED_VALIDATION.messages({ 'any.required': SIGN_IN_STRINGS.SELECT_ACCOUNT_ERROR }),
});

export const preSigninDetailsValidateSchema = (t = translateFunction) => constructJoiObject({
  sign_in_type: STRING_VALIDATION.required().label(SIGN_IN_STRINGS.SIGN_IN_TYPE),
  email: Joi.when('sign_in_type', { is: SIGN_IN_STRINGS.EMAIL, then: EMAIL_VALIDATION.required().label(t(SIGN_IN_STRINGS.FORM_LABEL.EMAIL.EMAIL_LABEL)), otherwise: Joi.forbidden() }),
  username: Joi.when('sign_in_type', { is: SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID, then: USER_NAME_VALIDATION(t).required().label(t(SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.LABEL)), otherwise: Joi.forbidden() }),
  username_or_email: Joi.when('sign_in_type', { is: SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID, then: STRING_VALIDATION.required().label(t(SIGN_IN_STRINGS.USER_NAME_EMAIL.LABEL)), otherwise: Joi.forbidden() }),
  domain: Joi.when('sign_in_type', { is: Joi.valid(SIGN_IN_STRINGS.FORM_LABEL.USER_NAME.ID, SIGN_IN_STRINGS.FORM_LABEL.SUB_DOMAIN.ID), then: ACCOUNT_DOMAIN_CASE_INSENSITIVE_VALIDATION.required().label(t(SIGN_IN_STRINGS.DOMAIN_NAME_SPA)), otherwise: Joi.forbidden() }),
});
// export const preSigninEmailValidationSchema = constructJoiObject({
//   email: EMAIL_VALIDATION.required().label(SIGN_IN_STRINGS.EMAIL),
//   is_email_signin: Joi.bool().required().label(SIGN_IN_STRINGS.EMAIL),

// });

export default signinDetailsValidateSchema;
