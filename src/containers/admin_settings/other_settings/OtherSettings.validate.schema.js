import Joi from 'joi';
import { OTHER_SETTINGS_FORM } from './OtherSettings.strings';
import {
  BOOLEAN_VALIDATION,
  constructJoiObject,
  REMEMBER_ME_DAYS_VALIDATION,
  SESSION_TIMEOUT_VALIDATION,
  MOBILE_APP_SESSION_TIMEOUT_VALIDATION,
  PASSWORD_EXPIRY_DAYS_VALIDATION,
  MAXIMUM_FILE_SIZE_VALIDATION,
  arrayValidation,
  STRING_VALIDATION,
} from '../../../utils/ValidationConstants';
import { ADMIN_SETTINGS_CONSTANT } from '../AdminSettings.constant';

export const authAccountConfigurationValidationSchema = (t) => constructJoiObject({
  session_timeout: SESSION_TIMEOUT_VALIDATION.label(
    t(OTHER_SETTINGS_FORM.SESSION_TIMEOUT.LABEL),
  ).messages({
    'number.base': `${t(OTHER_SETTINGS_FORM.SESSION_TIMEOUT.LABEL)} ${t('admin_settings.security_settings.error_messages.must_number')}`,
    'number.min': `${t(OTHER_SETTINGS_FORM.SESSION_TIMEOUT.LABEL)} ${t('admin_settings.security_settings.error_messages.session_number_min')}`,
    'number.max': `${t(OTHER_SETTINGS_FORM.SESSION_TIMEOUT.LABEL)} ${t('admin_settings.security_settings.error_messages.session_number_max')}`,
    'any.required': `${t(OTHER_SETTINGS_FORM.SESSION_TIMEOUT.LABEL)} ${t('admin_settings.security_settings.error_messages.is_required')}`,
  }),
  mobile_session_timeout: MOBILE_APP_SESSION_TIMEOUT_VALIDATION.label(
    t(OTHER_SETTINGS_FORM.MOBILE_APP_SESSION_TIMEOUT.LABEL),
  ).messages({
    'number.base': `${t(OTHER_SETTINGS_FORM.MOBILE_APP_SESSION_TIMEOUT.LABEL)} ${t('admin_settings.security_settings.error_messages.must_number')}`,
    'number.min': `${t(OTHER_SETTINGS_FORM.MOBILE_APP_SESSION_TIMEOUT.LABEL)} ${t('admin_settings.security_settings.error_messages.mobile_app_session_number_min')}`,
    'number.max': `${t(OTHER_SETTINGS_FORM.MOBILE_APP_SESSION_TIMEOUT.LABEL)} ${t('admin_settings.security_settings.error_messages.mobile_app_session_number_max')}`,
    'any.required': `${t(OTHER_SETTINGS_FORM.MOBILE_APP_SESSION_TIMEOUT.LABEL)} ${t('admin_settings.security_settings.error_messages.is_required')}`,
  }),
  is_remember_me_enabled: BOOLEAN_VALIDATION,
  remember_me_days: REMEMBER_ME_DAYS_VALIDATION.label(
    t(OTHER_SETTINGS_FORM.STAY_LOGGED_IN.LABEL),
  ).messages({
    'number.base': `${t(OTHER_SETTINGS_FORM.STAY_LOGGED_IN.LABEL)} ${t('admin_settings.security_settings.error_messages.must_number')}`,
    'number.min': `${t(OTHER_SETTINGS_FORM.STAY_LOGGED_IN.LABEL)} ${t('admin_settings.security_settings.error_messages.remember_number_min')}`,
    'number.max': `${t(OTHER_SETTINGS_FORM.STAY_LOGGED_IN.LABEL)} ${t('admin_settings.security_settings.error_messages.remember_number_max')}`,
    'any.required': `${t(OTHER_SETTINGS_FORM.STAY_LOGGED_IN.LABEL)} ${t('admin_settings.security_settings.error_messages.is_required')}`,
  }),
  is_password_expiry_enabled: BOOLEAN_VALIDATION,
  password_expiry_days: PASSWORD_EXPIRY_DAYS_VALIDATION.label(
    t(OTHER_SETTINGS_FORM.PASSWORD_AGE.LABEL),
  ).messages({
    'number.base': `${t(OTHER_SETTINGS_FORM.PASSWORD_AGE.LABEL)} ${t('admin_settings.security_settings.error_messages.must_number')}`,
    'number.min': `${t(OTHER_SETTINGS_FORM.PASSWORD_AGE.LABEL)} ${t('admin_settings.security_settings.error_messages.password_number_min')}`,
    'number.max': `${t(OTHER_SETTINGS_FORM.PASSWORD_AGE.LABEL)} ${t('admin_settings.security_settings.error_messages.password_number_max')}`,
    'any.required': `${t(OTHER_SETTINGS_FORM.PASSWORD_AGE.LABEL)} ${t('admin_settings.security_settings.error_messages.is_required')}`,
  }),
});

export const accountConfigurationValidationSchema = (t) => constructJoiObject({
  maximum_file_size: MAXIMUM_FILE_SIZE_VALIDATION.label(
    t(OTHER_SETTINGS_FORM.MAXIMUM_FILE_SIZE.LABEL),
  ).messages({
    'number.base': `${t(OTHER_SETTINGS_FORM.MAXIMUM_FILE_SIZE.LABEL)} ${t('admin_settings.security_settings.error_messages.must_number')}`,
    'number.min': `${t(OTHER_SETTINGS_FORM.MAXIMUM_FILE_SIZE.LABEL)} ${t('admin_settings.security_settings.error_messages.file_number_min')}`,
    'number.max': `${t(OTHER_SETTINGS_FORM.MAXIMUM_FILE_SIZE.LABEL)} ${t('admin_settings.security_settings.error_messages.file_number_max')}`,
    'any.required': `${t(OTHER_SETTINGS_FORM.MAXIMUM_FILE_SIZE.LABEL)} ${t('admin_settings.security_settings.error_messages.is_required')}`,
  }),
  allowed_extensions: arrayValidation(STRING_VALIDATION).required().min(1).label(
    t(OTHER_SETTINGS_FORM.ALLOWED_EXTENSIONS.LABEL),
  )
  .messages({
    'string.base': `${t(OTHER_SETTINGS_FORM.ALLOWED_EXTENSIONS.LABEL)} ${t('admin_settings.security_settings.error_messages.must_string')}`,
    'string.min': `${t(OTHER_SETTINGS_FORM.ALLOWED_EXTENSIONS.LABEL)} ${t('admin_settings.security_settings.error_messages.allowed_string_min')}`,
    'any.required': `${t(OTHER_SETTINGS_FORM.ALLOWED_EXTENSIONS.LABEL)} ${t('admin_settings.security_settings.error_messages.is_required')}`,
  }),
  // .regex(ALLOWED_EXTENSIONS_REGEX),
  default_currency_type: STRING_VALIDATION.required().label(
    t(OTHER_SETTINGS_FORM.DEFAULT_CURRENCY.LABEL),
  ).messages({
    'string.base': `${t(OTHER_SETTINGS_FORM.DEFAULT_CURRENCY.LABEL)} ${t('admin_settings.security_settings.error_messages.must_string')}`,
    'any.required': `${t(OTHER_SETTINGS_FORM.DEFAULT_CURRENCY.LABEL)} ${t('admin_settings.security_settings.error_messages.is_required')}`,
  }),
  allowed_currency_types: arrayValidation(STRING_VALIDATION)
    .min(1)
    .label(t(OTHER_SETTINGS_FORM.ALLOWED_CURRENCY_TYPES.LABEL))
    .required()
    .messages({
      'string.base': `${t(OTHER_SETTINGS_FORM.ALLOWED_CURRENCY_TYPES.LABEL)} ${t('admin_settings.security_settings.error_messages.must_string')}`,
      'string.min': `${t(OTHER_SETTINGS_FORM.ALLOWED_CURRENCY_TYPES.LABEL)} ${t('admin_settings.security_settings.error_messages.allowed_string_min')}`,
      'any.required': `${t(OTHER_SETTINGS_FORM.ALLOWED_CURRENCY_TYPES.LABEL)} ${t('admin_settings.security_settings.error_messages.is_required')}`,
    }),
  default_country_code: STRING_VALIDATION.required().label(
    t(OTHER_SETTINGS_FORM.DEFAULT_COUNTRY_CODE_SETTING.LABEL),
  ).messages({
    'string.base': `${t(OTHER_SETTINGS_FORM.DEFAULT_COUNTRY_CODE_SETTING.LABEL)} ${t('admin_settings.security_settings.error_messages.must_string')}`,
    'any.required': `${t(OTHER_SETTINGS_FORM.DEFAULT_COUNTRY_CODE_SETTING.LABEL)} ${t('admin_settings.security_settings.error_messages.is_required')}`,
  }),
  // .regex(ALLOWED_EXTENSIONS_REGEX),
});

export const mfaDetailsValidationSchema = (t) => constructJoiObject({
  is_mfa_enabled: BOOLEAN_VALIDATION,
  allowed_mfa_methods: Joi.array().required().min(1).label(t(ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.MFA_ALLOWED_MFA_METHODS))
  .messages({
      'array.min': `${t(OTHER_SETTINGS_FORM.MFA_SETTINGS.ALLOWED_MFA_METHODS_VALIDATION_TEXT)}`,
    }),
  mfa_enforced_teams: Joi.array().label(ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.MFA_ENFORCED_TEAMS),
});

export default accountConfigurationValidationSchema;
