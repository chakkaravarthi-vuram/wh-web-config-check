import { ADDITIONAL_DETAILS_STRINGS } from 'containers/sign_up/additional_details/AdditionalDetails.strings';
import {
  ACCOUNT_NAME_VALIDATION,
  ACCOUNT_DOMAIN_VALIDATION,
  USER_NAME_VALIDATION,
  EMAIL_VALIDATION,
  NICK_NAME_VALIDATION,
  REQUIRED_VALIDATION,
  NAME_VALIDATION_WITH_UNICODE,
} from '../../../../utils/ValidationConstants';
import ADMIN_ACCOUNT_STRINGS from './Accounts.strings';

const Joi = require('joi');

const getValidationKeys = (t) => {
  return {
    account_name: ACCOUNT_NAME_VALIDATION.required().label(t && t(ADMIN_ACCOUNT_STRINGS.ACCOUNT_NAME_LABEL)),
    account_industry: Joi.array().min(1).required().label(t && t(ADMIN_ACCOUNT_STRINGS.INDUSTRY_TYPE)),
    // account_locale: REQUIRED_VALIDATION.label(t && t(ADMIN_ACCOUNT_STRINGS.LOCALE)),
    // account_language: REQUIRED_VALIDATION.label(t && t(ADMIN_ACCOUNT_STRINGS.LANGUAGE)),
    account_country: REQUIRED_VALIDATION.label(t && t(ADMIN_ACCOUNT_STRINGS.COUNTRY)),
    account_timezone: REQUIRED_VALIDATION.label(t && t(ADMIN_ACCOUNT_STRINGS.TIME_ZONE)),
  };
};

export const addAdminAccountValidationSchema = (t) => Joi.object().keys({
  ...getValidationKeys(t),
  account_domain: ACCOUNT_DOMAIN_VALIDATION.required().label(t && t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.LABEL)),
  account_first_name: NAME_VALIDATION_WITH_UNICODE.required().label(t && t(ADMIN_ACCOUNT_STRINGS.ACCOUNT_FIRST_NAME_LABEL)),
  account_last_name: NAME_VALIDATION_WITH_UNICODE.required().label(t && t(ADMIN_ACCOUNT_STRINGS.ACCOUNT_LAST_NAME_LABEL)),
  account_username: USER_NAME_VALIDATION(t).required().label(t && t(ADMIN_ACCOUNT_STRINGS.ACCOUNT_USERNAME_LABEL)),
  account_email: EMAIL_VALIDATION.required().label(t && t(ADMIN_ACCOUNT_STRINGS.EMAIL)),
  role_in_company: REQUIRED_VALIDATION.label(t && t(ADMIN_ACCOUNT_STRINGS.ROLE_IN_A_COMPANY)),
});

export const editAdminAccountValidationSchema = (t) => Joi.object().keys({
  ...getValidationKeys(t),
  account_id: Joi.required(),
  account_manager: NICK_NAME_VALIDATION.required().label(t && t(ADMIN_ACCOUNT_STRINGS.ACCOUNT_MANAGER)),
  solution_consultant: NICK_NAME_VALIDATION.required().label(t && t(ADMIN_ACCOUNT_STRINGS.SOLUTION_CONSULTANT)),
});

export default addAdminAccountValidationSchema;
