import moment from 'moment';
import { DUE_DATE_AND_STATUS, FLOW_CONFIG_STRINGS, RECIPIENT_TYPES } from 'containers/edit_flow/EditFlow.strings';
import LOOK_UP_MANAGEMENT_STRINGS from 'containers/admin_settings/look_up_management/LookUpManagement.strings';
import { ADDITIONAL_DETAILS_STRINGS } from '../containers/sign_up/additional_details/AdditionalDetails.strings';
import {
  SIGNUP_MIN_MAX_CONSTRAINT,
  ADD_MEMBER_MIN_MAX_CONSTRAINT,
  CREATE_TEAM_MIN_MAX_CONSTRAINT,
  FLOW_MIN_MAX_CONSTRAINT,
  PUBLISH_FLOW_MIN_MAX_CONSTRAINT,
  FORM_MIN_MAX_CONSTRAINT,
  COVER_MESSAGE_MIN_MAX_CONSTRAINT,
  TASK_MIN_MAX_CONSTRAINT,
  DATA_LIST_MIN_MAX_CONSTRAINT,
  DATE,
  APP_MIN_MAX_CONSTRAINT,
  CLIENT_CRED_MIN_MAX_CONSTRAINT,
  API_KEY_MIN_MAX_CONSTRAINT,
  INTEGRATION_MIN_MAX_CONSTRAINT,
  API_CONFIG_MIN_MAX_CONSTRAINT,
} from './Constants';
import {
  ACCOUNT_AND_DOMAIN_NAME_REGEX,
  PASSWORD_REGEX,
  // MOBILE_NUMBER_REGEX,
  EMOJI_REGEX,
  FORM_NAME_REGEX,
  DOMAIN_SPECIFIC_REGEX,
  USER_NAME_REGEX,
  EMAIL_REGEX,
  ONLY_ALPHABETS_SPACES_REGEX,
  CURRENT_NEW_PASSWORD,
  DOMAIN_SPECIFIC_CASE_INSENSITIVE_REGEX,
  FIRST_AND_LAST_NAME_REGEX,
  TECHNICAL_REFERENCE_NAME_REGEX,
} from './strings/Regex';
import { ADD_MEMBER_BASIC_DETAILS_FORM } from '../containers/admin_settings/user_management/add_or_invite_members/add_member/add_member_basic_details/AddMemberBasicDetails.strings';
import { OTHER_DETAILS_FORM } from '../containers/admin_settings/user_management/add_or_invite_members/add_member/other_details/OtherDetails.strings';
// import { L_C_FORM } from '../containers/admin_settings/language_and_calendar/LanguagesAndCalendar.strings';
import { EMPTY_STRING } from './strings/CommonStrings';
import { FLOW_STRINGS } from '../containers/flows/Flow.strings';
import { FIELD_TYPES } from '../components/form_builder/FormBuilder.strings';
import { formatServerDateString } from './dateUtils';
import { VALIDATION_CONSTANT } from './constants/validation.constant';
import { translateFunction } from './jsUtility';

const Joi = require('joi');

const { ERRORS, STEP_DESCRIPTION_LABEL } = FLOW_CONFIG_STRINGS;

// Generic
export const STRING_VALIDATION = Joi.string();
export const BOOLEAN_VALIDATION = Joi.boolean();
export const ANY_VALIDATION = Joi.any();
export const OBJECT_VALIDATION = Joi.object();
export const REQUIRED_VALIDATION = Joi.string().required();
export const NUMBER_VALIDATION = Joi.number().required();
export const REQUIRED_OBJECT_VALIDATION = Joi.object().required();

export const alternativeConstraints = (constraints) => Joi.alternatives(constraints);

export const DATE_VALIDATION = Joi.date().iso();
export const DATE_REQUIRED_VALIDATION = Joi.date().required();

export const setJoiRef = (label) => Joi.ref(label);

export const arrayValidation = (items) => Joi.array().items(items);

export const constructJoiObject = (objectSchema) => Joi.object().keys((objectSchema));

export const ACCOUNT_LOGO_SIZE_VALIDATION = () => Joi.number()
  .integer()
  .min(1)
  .max(1 * 1000 * 1000);

export const SESSION_TIMEOUT_VALIDATION = Joi.number()
  .integer()
  .min(60)
  .max(1440)
  .required();

export const MOBILE_APP_SESSION_TIMEOUT_VALIDATION = Joi.number()
  .integer()
  .min(1)
  .max(60)
  .required();

export const REMEMBER_ME_DAYS_VALIDATION = Joi.when('is_remember_me_enabled', {
  is: true,
  then: Joi.number().integer().min(2).max(180)
    .required(),
  otherwise: Joi.number().allow(null, EMPTY_STRING),
});

export const PASSWORD_EXPIRY_DAYS_VALIDATION = Joi.when('is_password_expiry_enabled', {
  is: true,
  then: Joi.number().integer().min(14).max(365)
    .required(),
  otherwise: Joi.number().allow(null, EMPTY_STRING),
});

export const MAXIMUM_FILE_SIZE_VALIDATION = Joi.number()
  .integer()
  .allow(null, EMPTY_STRING)
  .min(1)
  .max(250);

// Signup - screen1
export const EMAIL_CUTSOM_VALIDATION_MESSAGE = (t = translateFunction) => t(VALIDATION_CONSTANT.CUSTOM_EMAIL_VALIDATION);
export const LINK_CUTSOM_VALIDATION_MESSAGE = (t = translateFunction) => t(VALIDATION_CONSTANT.CUSTOM_VALID_LINK);
export const validateEmail = (value, t = translateFunction) => {
  if (!EMAIL_REGEX.test(value)) return t(VALIDATION_CONSTANT.CUSTOM_VALID_EMAIL);
  if (value && value.includes('@')) {
    const localPart = value.split('@')[0].length <= 64;
    const domainPart = value.split('@')[1].length <= 255;
    if (!(localPart && domainPart)) return EMAIL_CUTSOM_VALIDATION_MESSAGE(t);
  }
  return EMPTY_STRING;
};
export const validateLink = (value, t = translateFunction) => {
  if (!value.includes('.')) return LINK_CUTSOM_VALIDATION_MESSAGE(t);
  if (value && value.includes('.')) {
    const domainPart = value.split('.')[1].length >= 2;
    if (!(domainPart)) return LINK_CUTSOM_VALIDATION_MESSAGE(t);
  }
  if (value && (value.includes('://')) && !(value.includes('http') || value.includes('https'))) {
    return LINK_CUTSOM_VALIDATION_MESSAGE(t);
  }
  return EMPTY_STRING;
};
const emailCustomValidation = (value) => {
  const error = validateEmail(value);
  if (error) {
    throw new Error(error);
  }
  return value;
};
export const linkCustomValidation = (value) => {
  const error = validateLink(value);
  if (error) {
    throw new Error(error);
  }
  return value;
};
export const EMAIL_VALIDATION = Joi.string().custom(emailCustomValidation, 'Custom Email Validation');
export const LINK_VALIDATION = Joi.string().uri().required().custom(linkCustomValidation, 'Custom link Validation');

export const isValidDateRange = (date1, date2) => {
  if (date1 && date2 && moment(date1, [DATE.DATE_FORMAT, moment.ISO_8601], true).isValid() && moment(date2, [DATE.DATE_FORMAT, moment.ISO_8601], true).isValid()) {
    const dateString1 = formatServerDateString(date1);
    const dateString2 = formatServerDateString(date2);
    if (moment.utc(dateString1).isSameOrBefore(dateString2)) return false;
  }
  return true;
};

// Signup - screen3
export const ACCOUNT_NAME_VALIDATION = Joi.string()
  .min(SIGNUP_MIN_MAX_CONSTRAINT.ACCOUNT_NAME_MIN_VALUE)
  .max(SIGNUP_MIN_MAX_CONSTRAINT.ACCOUNT_NAME_MAX_VALUE)
  .regex(ACCOUNT_AND_DOMAIN_NAME_REGEX)
  .label(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_NAME.LABEL);

export const ACCOUNT_DOMAIN_VALIDATION = Joi.string()
  .min(SIGNUP_MIN_MAX_CONSTRAINT.DOMAIN_NAME_MIN_VALUE)
  .max(SIGNUP_MIN_MAX_CONSTRAINT.DOMAIN_NAME_MAX_VALUE)
  .regex(DOMAIN_SPECIFIC_REGEX)
  .label(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.LABEL);

export const ACCOUNT_DOMAIN_CASE_INSENSITIVE_VALIDATION = Joi.string()
  .min(SIGNUP_MIN_MAX_CONSTRAINT.DOMAIN_NAME_MIN_VALUE)
  .max(SIGNUP_MIN_MAX_CONSTRAINT.DOMAIN_NAME_MAX_VALUE)
  .regex(DOMAIN_SPECIFIC_CASE_INSENSITIVE_REGEX)
  .label(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.LABEL);

export const PASSWORD_VALIDATION = Joi.string()
  .min(SIGNUP_MIN_MAX_CONSTRAINT.PASSWORD_MIN_VALUE)
  .regex(PASSWORD_REGEX);

export const CURRENT_PASSWORD_VALIDATION = Joi.string()
  .min(SIGNUP_MIN_MAX_CONSTRAINT.PASSWORD_MIN_VALUE)
  .regex(CURRENT_NEW_PASSWORD);
// Add members
export const NAME_VALIDATION_WITH_UNICODE = Joi.string()
  .min(ADD_MEMBER_MIN_MAX_CONSTRAINT.FIRST_NAME_MIN_VALUE)
  .max(ADD_MEMBER_MIN_MAX_CONSTRAINT.FIRST_NAME_MAX_VALUE)
  .regex(FIRST_AND_LAST_NAME_REGEX)
  .label(ADD_MEMBER_BASIC_DETAILS_FORM.FIRST_NAME.LABEL);

export const FIRST_NAME_VALIDATION = Joi.string()
  .min(ADD_MEMBER_MIN_MAX_CONSTRAINT.FIRST_NAME_MIN_VALUE)
  .max(ADD_MEMBER_MIN_MAX_CONSTRAINT.FIRST_NAME_MAX_VALUE)
  .regex(ACCOUNT_AND_DOMAIN_NAME_REGEX)
  .label(ADD_MEMBER_BASIC_DETAILS_FORM.FIRST_NAME.LABEL);

export const NICK_NAME_VALIDATION = Joi.string()
  .min(ADD_MEMBER_MIN_MAX_CONSTRAINT.NICK_NAME_MIN_VALUE)
  .max(ADD_MEMBER_MIN_MAX_CONSTRAINT.NICK_NAME_MAX_VALUE)
  .regex(ACCOUNT_AND_DOMAIN_NAME_REGEX);

export const LAST_NAME_VALIDATION = Joi.string()
  .min(ADD_MEMBER_MIN_MAX_CONSTRAINT.LAST_NAME_MIN_VALUE)
  .max(ADD_MEMBER_MIN_MAX_CONSTRAINT.LAST_NAME_MAX_VALUE)
  .regex(ACCOUNT_AND_DOMAIN_NAME_REGEX)
  .label(ADD_MEMBER_BASIC_DETAILS_FORM.LAST_NAME.LABEL);

export const USER_NAME_VALIDATION = (t) => Joi.string()
  .min(ADD_MEMBER_MIN_MAX_CONSTRAINT.USER_NAME_MIN_VALUE)
  .max(ADD_MEMBER_MIN_MAX_CONSTRAINT.USER_NAME_MAX_VALUE)
  // .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .regex(USER_NAME_REGEX)
  .label(t(ADD_MEMBER_BASIC_DETAILS_FORM.USER_NAME.LABEL));

export const NEW_ROLE_VALIDATION = Joi.string()
  .min(ADD_MEMBER_MIN_MAX_CONSTRAINT.NEW_ROLE_AND_BUSINESS_UNIT_MIN_VALUE)
  .max(ADD_MEMBER_MIN_MAX_CONSTRAINT.NEW_ROLE_AND_BUSINESS_UNIT_MAX_VALUE)
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true });

export const NEW_BUSINESS_UNIT_VALIDATION = Joi.string()
  .min(ADD_MEMBER_MIN_MAX_CONSTRAINT.NEW_ROLE_AND_BUSINESS_UNIT_MIN_VALUE)
  .max(ADD_MEMBER_MIN_MAX_CONSTRAINT.NEW_ROLE_AND_BUSINESS_UNIT_MAX_VALUE)
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true });

export const PHONE_NUMBER_VALIDATION = (t = translateFunction) => Joi.string()
  .min(ADD_MEMBER_MIN_MAX_CONSTRAINT.PHONE_NUMBER_MIN_VALUE)
  .max(ADD_MEMBER_MIN_MAX_CONSTRAINT.PHONE_NUMBER_MAX_VALUE)
  // .regex(ACCOUNT_AND_DOMAIN_NAME_REGEX)
  .label(OTHER_DETAILS_FORM.PHONE_NUMBER.LABEL)
  .messages({
    'string.min': `${OTHER_DETAILS_FORM.PHONE_NUMBER.LABEL} ${t(VALIDATION_CONSTANT.MUST_BE_ATLEAST)} ${ADD_MEMBER_MIN_MAX_CONSTRAINT.PHONE_NUMBER_MIN_VALUE} ${t(VALIDATION_CONSTANT.DIGITS_LONG)}`,
    'string.max': `${OTHER_DETAILS_FORM.PHONE_NUMBER.LABEL} ${t(VALIDATION_CONSTANT.MUST_BE_LESS_THAN_OR_EQUAL)} ${ADD_MEMBER_MIN_MAX_CONSTRAINT.PHONE_NUMBER_MAX_VALUE} ${t(VALIDATION_CONSTANT.DIGITS)}`,
  });

export const MOBILE_NUMBER_VALIDATION = (t) => (
  Joi.string()
    .min(ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MIN_VALUE)
    .max(ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MAX_VALUE)
    // .regex(MOBILE_NUMBER_REGEX)
    .label(t(OTHER_DETAILS_FORM.MOBILE_NUMBER.LABEL))
    .messages({
      'string.min': `${t(OTHER_DETAILS_FORM.MOBILE_NUMBER.MIN_ERROR)}`,
      'string.max': `${t(OTHER_DETAILS_FORM.MOBILE_NUMBER.MAX_ERROR)}`,
    }));

// Language and Calendar
export const WORKING_DAYS_VALIDATION = (t, label) => Joi.array()
  .items(Joi.number().required())
  .required()
  .messages({ 'array.includesRequiredUnknowns': `${t(label)} ${t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.WORKING_DAYS)}` });
export const ACC_LANGUAGE = (t, label) => Joi.string()
  .required()
  .label(label)
  .messages({ 'array.min': `${label} ${t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.MIN_ERROR)}` });
export const ACC_LOCALE_VALIDATION = (t, label) => Joi.array()
  .min(1)
  .required()
  .messages({ 'array.min': `${label} ${t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.MIN_ERROR)}` });
// LookUP
export const LOOKUP_VALUE = (t, label) => (
  Joi.array()
    .items()
    .min(1)
    .required()
    .when('lookup_type', {
      is: 'Text',
      then: Joi.array().items(Joi.string()),
      otherwise: Joi.array().items(Joi.number()),
    })
    .messages({ 'array.min': `${t(label)} ${t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.VALUES.MIN_ERROR)}` })

);
// Holidays
export const OCCASION_NAME_VALIDATION = Joi.string()
  .required()
  .min(2)
  .max(255)
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true });

export const REMAINDER_MESSAGE_VALIDATION = Joi.string()
  .required()
  .min(2)
  .max(2000)
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true });

export const REMAINDER_USER_VALIDATION = Joi.string()
  .required();

export const LOOKUP_NAME = (t, label) => (
  Joi.string()
    .required()
    .min(2)
    .max(2000)
    .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
    .messages({
      'string.min': `${t(label)} ${t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.MIN_ERROR)}`,
      'string.max': `${t(label)} ${t(LOOK_UP_MANAGEMENT_STRINGS.ADD_LOOKUP.FIELD_NAME.MAX_ERROR)}`,
    })
);
export const LOOKUP_TYPE = Joi.string()
  .required()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true });
// Create Team
export const TEAM_NAME_VALIDATION = () => Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(CREATE_TEAM_MIN_MAX_CONSTRAINT.TEAM_NAME_MIN_VALUE)
  .max(CREATE_TEAM_MIN_MAX_CONSTRAINT.TEAM_NAME_MAX_VALUE)
  .label('Team Name');// Need to change
// Create Team

export const DESCRIPTION_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(CREATE_TEAM_MIN_MAX_CONSTRAINT.TEAM_DESCRIPTION_MIN_VALUE)
  .max(CREATE_TEAM_MIN_MAX_CONSTRAINT.TEAM_DESCRIPTION_MAX_VALUE);

export const FLOW_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(FLOW_MIN_MAX_CONSTRAINT.FLOW_NAME_MIN_VALUE)
  .max(FLOW_MIN_MAX_CONSTRAINT.FLOW_NAME_MAX_VALUE);

export const DATA_LIST_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(DATA_LIST_MIN_MAX_CONSTRAINT.DATA_LIST_NAME_MIN_VALUE)
  .max(DATA_LIST_MIN_MAX_CONSTRAINT.DATA_LIST_NAME_MAX_VALUE);

export const TECHNICAL_REFERENCE_NAME_VALIDATION = Joi.string()
  .regex(TECHNICAL_REFERENCE_NAME_REGEX)
  .min(DATA_LIST_MIN_MAX_CONSTRAINT.DATA_LIST_TECH_REF_NAME_MIN_VALUE)
  .max(DATA_LIST_MIN_MAX_CONSTRAINT.DATA_LIST_TECH_REF_NAME_MAX_VALUE);

export const API_KEY_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(API_KEY_MIN_MAX_CONSTRAINT.NAME_MIN_VALUE)
  .max(API_KEY_MIN_MAX_CONSTRAINT.NAME_MAX_VALUE);

export const DATA_LIST_DESCRIPTION_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(DATA_LIST_MIN_MAX_CONSTRAINT.DATA_LIST_DESCRIPTION_MIN_VALUE)
  .max(DATA_LIST_MIN_MAX_CONSTRAINT.DATA_LIST_DESCRIPTION_MAX_VALUE);

export const APP_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(APP_MIN_MAX_CONSTRAINT.APP_NAME_MIN_VALUE)
  .max(APP_MIN_MAX_CONSTRAINT.APP_NAME_MAX_VALUE);

export const APP_DESCRIPTION_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(APP_MIN_MAX_CONSTRAINT.APP_DESCRIPTION_MIN_VALUE)
  .max(APP_MIN_MAX_CONSTRAINT.APP_DESCRIPTION_MAX_VALUE);

export const CREDENTIAL_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(CLIENT_CRED_MIN_MAX_CONSTRAINT.NAME_MIN_VALUE)
  .max(CLIENT_CRED_MIN_MAX_CONSTRAINT.NAME_MAX_VALUE);

export const INTEGRATION_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(INTEGRATION_MIN_MAX_CONSTRAINT.NAME_MIN_VALUE)
  .max(INTEGRATION_MIN_MAX_CONSTRAINT.NAME_MAX_VALUE);

export const API_CONFIG_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(API_CONFIG_MIN_MAX_CONSTRAINT.NAME_MIN_VALUE)
  .max(API_CONFIG_MIN_MAX_CONSTRAINT.NAME_MAX_VALUE);

export const API_CONFIG_DESCRIPTION_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(API_CONFIG_MIN_MAX_CONSTRAINT.DESCRIPTION_MIN_VALUE)
  .max(API_CONFIG_MIN_MAX_CONSTRAINT.DESCRIPTION_MAX_VALUE);

export const CREDENTIAL_DESCRIPTION_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(CLIENT_CRED_MIN_MAX_CONSTRAINT.DESCRIPTION_MIN_VALUE)
  .max(CLIENT_CRED_MIN_MAX_CONSTRAINT.DESCRIPTION_MAX_VALUE);

export const DATA_LIST_UUID_VALIDATION = Joi.string();

export const FLOW_DESCRIPTION_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(FLOW_MIN_MAX_CONSTRAINT.FLOW_DESCRIPTION_MIN_VALUE)
  .max(FLOW_MIN_MAX_CONSTRAINT.FLOW_DESCRIPTION_MAX_VALUE);

export const EMAIL_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(2)
  .max(100);

export const EMAIL_SUBJECT_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(2)
  .max(2000);

export const RECIPIENT_TYPE_VALIDATION = Joi.string()
  .valid(RECIPIENT_TYPES.FORM_FIELD_RECIPIENT, RECIPIENT_TYPES.DIRECT_RECIPIENT, RECIPIENT_TYPES.OTHER_STEP_RECIPIENT);

export const EMAIL_BODY_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(2).max(10000);

export const STEP_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(FLOW_MIN_MAX_CONSTRAINT.STEP_NAME_MIN_VALUE)
  .max(FLOW_MIN_MAX_CONSTRAINT.STEP_NAME_MAX_VALUE);

export const STEP_STATUS_VALIDATION = (t = translateFunction) => Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(FLOW_MIN_MAX_CONSTRAINT.STEP_NAME_MIN_VALUE)
  .max(FLOW_MIN_MAX_CONSTRAINT.STEP_NAME_MAX_VALUE)
  .messages({
    'string.min': `${t(DUE_DATE_AND_STATUS.STATUS.LABEL)} ${t(VALIDATION_CONSTANT.MUST_BE_ATLEAST)} ${FLOW_MIN_MAX_CONSTRAINT.STEP_NAME_MIN_VALUE} ${t(VALIDATION_CONSTANT.CHARACTERS_LONG)}`,
    'string.max': `${t(DUE_DATE_AND_STATUS.STATUS.LABEL)} ${t(VALIDATION_CONSTANT.MUST_BE_LESS_THAN_OR_EQUAL)} ${FLOW_MIN_MAX_CONSTRAINT.STEP_NAME_MAX_VALUE} ${t(VALIDATION_CONSTANT.CHARACTERS_LONG)}`,
  });

export const FLOW_STEP_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(FLOW_MIN_MAX_CONSTRAINT.STEP_NAME_MIN_VALUE)
  .max(FLOW_MIN_MAX_CONSTRAINT.FLOW_STEP_NAME_MAX_VALUE);

export const STEP_DESCRIPTION_VALIDATION = (t = translateFunction) => Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(FLOW_MIN_MAX_CONSTRAINT.STEP_DESCRIPTION_MIN_VALUE)
  .max(FLOW_MIN_MAX_CONSTRAINT.STEP_DESCRIPTION_MAX_VALUE)
  .label(t(STEP_DESCRIPTION_LABEL))
  .messages({ 'string.max': t(ERRORS.STEP_DESCRIPTION_MAX_LIMIT) });

export const SECTION_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(FLOW_MIN_MAX_CONSTRAINT.SECTION_NAME_MIN_VALUE)
  .max(FLOW_MIN_MAX_CONSTRAINT.SECTION_NAME_MAX_VALUE);

export const SECTION_DESCRIPTION_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(FLOW_MIN_MAX_CONSTRAINT.SECTION_DESCRIPTION_MIN_VALUE)
  .max(FLOW_MIN_MAX_CONSTRAINT.SECTION_DESCRIPTION_MAX_VALUE);

export const ACTION_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(2)
  .max(50);

export const INTEGRATION_DESCRIPTION_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(INTEGRATION_MIN_MAX_CONSTRAINT.DESCRIPTION_MIN_VALUE)
  .max(INTEGRATION_MIN_MAX_CONSTRAINT.DESCRIPTION_MAX_VALUE);

export const TABLE_FIELD_LIST_TYPE = 'table';
export const DIRECT_FIELD_LIST_TYPE = 'direct';
export const CHART_FIELD_LIST_TYPE = 'chart';
export const FIELD_LIST_TYPE = [TABLE_FIELD_LIST_TYPE, DIRECT_FIELD_LIST_TYPE, CHART_FIELD_LIST_TYPE];
// export const STEP_DESCRIPTION_VALIDATION = Joi.string()
//   .regex(ACCOUNT_AND_DOMAIN_NAME_REGEX)
//   .min(FLOW_MIN_MAX_CONSTRAINT.STEP_DESCRIPTION_MIN_VALUE)
//   .max(FLOW_MIN_MAX_CONSTRAINT.STEP_DESCRIPTION_MAX_VALUE);

export const FIELD_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(FLOW_MIN_MAX_CONSTRAINT.FIELD_NAME_MIN_VALUE)
  .max(FLOW_MIN_MAX_CONSTRAINT.FIELD_NAME_MAX_VALUE)
  .trim();

export const REFERENCE_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(FLOW_MIN_MAX_CONSTRAINT.FIELD_NAME_MIN_VALUE)
  .max(FLOW_MIN_MAX_CONSTRAINT.REFERENCE_NAME_MAX_VALUE);

export const FIELD_TYPE_VALIDATION = Joi.string()
  .valid(
    ...Object.keys(FIELD_TYPES).map((eachKey) => FIELD_TYPES[eachKey]),
    // FIELD_TYPES.SINGLE_LINE,
    // 'paragraph',
    // 'number',
    // 'date',
    // 'dateandtime',
    // 'time',
    // 'users',
    // 'teams',
    // 'fileupload',
    // 'currency',
    // 'dropdown',
    // 'checkbox',
    // 'radio_group',
    // 'yesorno',
    // 'address',
    // 'rating',
    // 'percentage',
    // FIELD_TYPES.LINK,
  )
  .required();

export const doucmentMetadataSchema = Joi.object().keys({
  original_name: Joi.string().required(),
  location: Joi.string().required(),
  is_public: Joi.string().required(),
  key: Joi.string().required(),
  type_name: Joi.string().required(),
});

export const STEPS_VALIDATION = Joi.array()
  .items(
    Joi.object({
      // Object schema
      step_name: STEP_NAME_VALIDATION.required(),
      step_description: Joi.any().allow(null, EMPTY_STRING),
      step_order: Joi.number().allow(null),
      is_active: Joi.bool().allow(null),
      is_changes_saved: Joi.bool().allow(null),
      step_uuid: Joi.string().allow(null, EMPTY_STRING),
      assignees: Joi.object()
        .keys({
          teams: Joi.array().items(
            Joi.object()
              .keys({ _id: Joi.string().required() })
              .unknown(true)
              .required(),
          ),
          users: Joi.array().items(
            Joi.object()
              .keys({ _id: Joi.string().required() })
              .unknown(true)
              .required(),
          ),
        })
        .min(1),
      step_doc_metadata: Joi.array().items(doucmentMetadataSchema),
      step_document: Joi.any(),
      // sections: Joi.array()
      //   .items(
      //     Joi.object({
      //       // Object schema
      //       section_id: Joi.number(),
      //       section_name: SECTION_NAME_VALIDATION.required(),
      //       section_description: SECTION_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING),
      //       fields: Joi.array()
      //         .items(
      //           Joi.object({
      //             // Object schema
      //             field_id: Joi.number(),
      //             field_name: FIELD_NAME_VALIDATION.required(),
      //             field_type: FIELD_TYPE_VALIDATION,
      //           }),
      //         )
      //         .min(1)
      //         .required(),
      //     }),
      //   )
      //   .min(1)
      //   .required(),
    }),
  )
  .min(1)
  .required();

export const FILE_UPLOAD_VALIDATION = Joi.object().keys({
  size: Joi.number().min(1).required(),
  type: Joi.string().valid('image/png', 'image/jpeg').required(),
});

export const FORM_NAME_VALIDATION = Joi.string()
  .regex(FORM_NAME_REGEX)
  .min(FORM_MIN_MAX_CONSTRAINT.FORM_NAME_MIN_VALUE)
  .max(FORM_MIN_MAX_CONSTRAINT.FORM_NAME_MAX_VALUE);

export const TASK_NAME_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(TASK_MIN_MAX_CONSTRAINT.TASK_NAME_MIN_VALUE)
  .max(TASK_MIN_MAX_CONSTRAINT.TASK_NAME_MAX_VALUE);

export const FORM_DESCRIPTION_VALIDATION = Joi.string()
  .regex(FORM_NAME_REGEX)
  .min(FORM_MIN_MAX_CONSTRAINT.FORM_DESCRIPTION_MIN_VALUE)
  .max(FORM_MIN_MAX_CONSTRAINT.FORM_DESCRIPTION_MAX_VALUE);

export const TASK_DESCRIPTION_VALIDATION = Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(TASK_MIN_MAX_CONSTRAINT.TASK_DESCRIPTION_MIN_VALUE)
  .max(FORM_MIN_MAX_CONSTRAINT.FORM_DESCRIPTION_MAX_VALUE);

export const PUBLISH_PREVIEW_REFERENCE_DESCRIPTION_VALIDATION = Joi.string()
  .min(PUBLISH_FLOW_MIN_MAX_CONSTRAINT.DESCRIPTION_MIN_VALUE)
  .max(PUBLISH_FLOW_MIN_MAX_CONSTRAINT.DESCRIPTION_MAX_VALUE)
  .regex(ACCOUNT_AND_DOMAIN_NAME_REGEX)
  .label(FLOW_STRINGS.OTHER_REFERENCES_STRINGS.DESCRIPTION);

// admin settings -> cover content settings
export const COVER_MESSAGE_VALIDATION = Joi.string()
  .min(COVER_MESSAGE_MIN_MAX_CONSTRAINT.COVER_MESSAGE_MIN_VALUE)
  .max(COVER_MESSAGE_MIN_MAX_CONSTRAINT.COVER_MESSAGE_MAX_VALUE);

export const SUBMIT_TASK_COMMENTS = Joi.string().min(1).max(2000);

export const TEST_ASSIGNEES = Joi.string().required();

export const FIELD_HELP_TEXT = Joi.string()
  .min(2)
  .max(255)
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .label(VALIDATION_CONSTANT.HELPER_TOOL_TIP);

export const PLACEHOLDER_TEXT = Joi.string()
  .min(2)
  .max(255)
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .label(VALIDATION_CONSTANT.PLACEHOLDER);

export const INSTRUCTION_TEXT = Joi.string()
  .custom((value) => {
    const removeHtmlRegex = /(<([^>]+)>)/gi;
    const removeNewLineRegex = /(\n)/gi;
    const parsedValue = value
      .replace(removeHtmlRegex, '')
      .replace(removeNewLineRegex, '');
    return parsedValue;
  }, 'Custom validation function for instruction')
  .min(2)
  .max(1000)
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .label(VALIDATION_CONSTANT.INSTRUCTION);

export const ALLOWED_SPECIAL_CHARACTER_VALIDATION = Joi.string()
  .min(1)
  .max(255)
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true });

export const NOTES_VALIDATION = Joi.string()
  .min(1)
  .max(2000)
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true });

export const REASSIGN_REASON = Joi.string()
  .optional()
  .max(2000)
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true });

export const CATEGORY_NAME = Joi.string()
  .required()
  .min(2)
  .max(50)
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true });

export const COMPANY_NAME_VALIDATIONS = Joi.string()
  .min(3)
  .max(50)
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true });

export const POSTAL_CODE_VALIDATIONS = Joi.number()
  .min(1)
  // .max(10)
  .required();

export const ADDRESS_VALIDATIONS = Joi.string()
  .min(1)
  .max(255)
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true });

export const CARD_NUMBER_VALIDATION = Joi.string()
  .length(16)
  .pattern(/^[0-9]+$/)
  .required();

export const CVV_NUMBER = Joi.string()
  .min(3)
  .max(4)
  .pattern(/^[0-9]{3,4}$/)
  .required();

export const CITY_VALIDATION = Joi.string()
  .min(1)
  .max(255)
  .regex(ONLY_ALPHABETS_SPACES_REGEX);
