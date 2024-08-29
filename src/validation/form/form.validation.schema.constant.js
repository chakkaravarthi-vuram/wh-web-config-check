import { SECTION_DESCRIPTION as SECTION, FIELD_NAME as FN, FORM_STRINGS } from '../../components/form_builder/FormBuilder.strings';

const Joi = require('joi');
const { translate } = require('../../language/config');
const { FORM_MIN_MAX_CONSTRAINTS } = require('../../utils/Constants');
const { EMPTY_STRING } = require('../../utils/strings/CommonStrings');
const {
  SECTION_DESCRIPTION_VALIDATION, FIELD_TYPE_VALIDATION, FIELD_NAME_VALIDATION, PLACEHOLDER_TEXT, INSTRUCTION_TEXT, FIELD_HELP_TEXT, EMAIL_VALIDATION, LINK_VALIDATION,
} = require('../../utils/ValidationConstants');

const MODULE_VALUE = {
  //  SECTION
  SECTION_DESCRIPTION: SECTION_DESCRIPTION_VALIDATION.label(
    SECTION.LABEL,
  ).allow(EMPTY_STRING, null),
  SECTION_ORDER: Joi.number().required(),
  SECTION_UUID: Joi.string().uuid({ version: 'uuidv4' }).allow(EMPTY_STRING),
  IS_SECTION_SHOW_WHEN_RULE: Joi.bool(),
  IS_VISIBLE: Joi.bool(),
  SECTION_SHOW_WHEN_RULE: Joi.string().allow(EMPTY_STRING),
  // IS_TABLE: Joi.bool().required(),

  // field list
  IS_FIELD_LIST_SHOW_WHEN_RULE: Joi.bool(),
  FIELD_LIST_SHOW_WHEN_RULE: Joi.string().allow(EMPTY_STRING),
  TABLE_NAME: Joi.string()
    .required()
    .min(FORM_MIN_MAX_CONSTRAINTS.TABLE_NAME_MIN_VALUE)
    .max(FORM_MIN_MAX_CONSTRAINTS.TABLE_NAME_MAX_VALUE),
  TABLE_REFERENCE_NAME: Joi.string()
    .required()
    .min(FORM_MIN_MAX_CONSTRAINTS.TABLE_REFERENCE_NAME_MIN_VALUE)
    .max(FORM_MIN_MAX_CONSTRAINTS.TABLE_REFERENCE_NAME_MAX_VALUE),
  TABLE_UUID: Joi.string().uuid({ version: 'uuidv4' }).allow(EMPTY_STRING),
  ROW_ORDER: Joi.number().required().default(1),
  COLUMN_ORDER: Joi.number().required(),

  // fields
  IS_SCRATCH: Joi.bool().required(),
  IS_CONFIG_OPEN: Joi.bool(),
  FIELD_NAME: FIELD_NAME_VALIDATION.required().trim().label(FN.LABEL),
  FIELD_TYPE: FIELD_TYPE_VALIDATION.required(),
  IS_FIELD_SHOW_WHEN_RULE: Joi.bool(),
  FIELD_SHOW_WHEN_RULE: Joi.string().allow(EMPTY_STRING),
  IS_FIELD_DEFAULT_VALUE_RULE: Joi.bool(),
  FIELD_DEFAULT_VALUE_RULE: Joi.string().allow(EMPTY_STRING),
  REQUIRED: Joi.bool(),
  REQUIRED_WHEN: Joi.string().allow(EMPTY_STRING),
  READ_ONLY: Joi.bool(),
  READ_ONLY_WHEN: Joi.string().allow(EMPTY_STRING),
  HELP_TEXT: FIELD_HELP_TEXT.allow(EMPTY_STRING),
  PLACE_HOLDER: PLACEHOLDER_TEXT.allow(EMPTY_STRING),
  INSTRUCTIONS: INSTRUCTION_TEXT.allow(EMPTY_STRING),

  // Field validation
  FIELD_TYPE_VALIDATION,
  FIELD_SINGLE_LINE: Joi.string(),
  FIELD_PARAGRAPH: Joi.string(),
  FIELD_NUMBER: Joi.number(),
  FIELD_DATE: Joi.string(),
  FIELD_CURRENCY: Joi.object().keys({
    value: Joi.number().label(translate('form_field_strings.form_field_constants.default_value')).required()
    .messages({
      'any.required': translate('form_field_strings.form_field_constants.currency_type'),
    }),
    currency_type: Joi.string().label(translate('form_field_strings.form_field_constants.default_currency_type')).required(),
  }),
  FIELD_LINK: Joi.array().items(
    Joi.object()
      .keys({
        link_text: Joi.string().required().label(translate('form_field_strings.form_field_constants.link_text')),
        link_url: LINK_VALIDATION.label(translate('form_field_strings.field_config.link_url.label'))
        .messages({
          'string.uri': translate('form_field_strings.form_field_constants.link_url'),
        }),
      })
      .optional(),
  ),
  FIELD_DROPDOWN: Joi.optional(),
  FIELD_CHECKBOX: Joi.optional(),
  FIELD_RADIO_GROUP: Joi.optional(),
  FIELD_YES_NO: Joi.optional(),
  FIELD_INFORMATION: Joi.string().max(10000).required().label(translate('form_field_strings.form_field_constants.info_content')),
  FIELD_INFORMATION_VALIDATION: Joi.object().keys(),
  FIELD_SCANNER_VALIDATION: Joi.object().keys(),
  FIELD_LOOKUP_VALIDATION: Joi.optional(),
  FIELD_DROPDOWN_VALUES: Joi.string()
    .required()
    .replace(',', '')
    .label(translate('form_field_strings.form_field_constants.value')),
  FIELD_CHECKBOX_VALUES: Joi.string()
    .required()
    .replace(',', '')
    .label(translate('form_field_strings.form_field_constants.value')),
  FIELD_RADIO_GROUP_VALUES: Joi.string()
    .required()
    .replace(',', '')
    .label(translate('form_field_strings.form_field_constants.value')),
  FIELD_YES_NO_VALUES: Joi.string(),
  CUSTOM_LOOKUP_DROPDOWN: Joi.required().label(translate('form_field_strings.field_config.values_lookup.label')),
  FIELD_DROPDOWN_VALIDATION: Joi.optional(),
  FIELD_CHECKBOX_VALIDATION: Joi.optional(),
  FIELD_RADIO_GROUP_VALIDATION: Joi.optional(),
  FIELD_DATA_LIST_PROPERTY_PICKER: Joi.optional(),
  FIELD_YES_NO_VALIDATION: Joi.optional(),
  FIELD_USER_TEAM_PICKER_VALIDATION: Joi.object()
      .keys({
        system_field: Joi.string().required().label(translate('form_field_strings.form_field_constants.system_field')),
        operation: Joi.string().required().label(translate('form_field_strings.form_field_constants.operation')),
      })
      .optional(),
  FIELD_PHONE_NUMBER: Joi.object().keys({
    phone_number: Joi.string().max(12).min(5).label(translate('form_field_strings.form_field_constants.default_phone_number')),
    country_code: Joi.string().label(translate('form_field_strings.form_field_constants.default_country_code')).required(),
  }),
  FIELD_EMAIL: EMAIL_VALIDATION.label(translate(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_EF)),
};

export const {
    SECTION_DESCRIPTION,
    SECTION_ORDER,
    SECTION_UUID,
    IS_SECTION_SHOW_WHEN_RULE,
    IS_VISIBLE,
    SECTION_SHOW_WHEN_RULE,
    IS_FIELD_LIST_SHOW_WHEN_RULE,
    FIELD_LIST_SHOW_WHEN_RULE,
    TABLE_NAME,
    TABLE_REFERENCE_NAME,
    TABLE_UUID,
    ROW_ORDER,
    COLUMN_ORDER,
    IS_SCRATCH,
    IS_CONFIG_OPEN,
    FIELD_NAME,
    FIELD_TYPE,
    IS_FIELD_SHOW_WHEN_RULE,
    FIELD_SHOW_WHEN_RULE,
    IS_FIELD_DEFAULT_VALUE_RULE,
    FIELD_DEFAULT_VALUE_RULE,
    REQUIRED,
    REQUIRED_WHEN,
    READ_ONLY,
    READ_ONLY_WHEN,
    HELP_TEXT,
    PLACE_HOLDER,
    INSTRUCTIONS,
    FIELD_SINGLE_LINE,
    FIELD_PARAGRAPH,
    FIELD_NUMBER,
    FIELD_DATE,
    FIELD_CURRENCY,
    FIELD_LINK,
    FIELD_DROPDOWN,
    FIELD_CHECKBOX,
    FIELD_RADIO_GROUP,
    FIELD_YES_NO,
    FIELD_INFORMATION,
    FIELD_INFORMATION_VALIDATION,
    FIELD_SCANNER_VALIDATION,
    FIELD_LOOKUP_VALIDATION,
    FIELD_DROPDOWN_VALUES,
    FIELD_CHECKBOX_VALUES,
    FIELD_RADIO_GROUP_VALUES,
    FIELD_YES_NO_VALUES,
    CUSTOM_LOOKUP_DROPDOWN,
    FIELD_DROPDOWN_VALIDATION,
    FIELD_CHECKBOX_VALIDATION,
    FIELD_RADIO_GROUP_VALIDATION,
    FIELD_DATA_LIST_PROPERTY_PICKER,
    FIELD_YES_NO_VALIDATION,
    FIELD_USER_TEAM_PICKER_VALIDATION,
    FIELD_PHONE_NUMBER,
    FIELD_EMAIL,
 } = MODULE_VALUE;

 export { FIELD_TYPE_VALIDATION };
