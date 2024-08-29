import Joi from 'joi';
import { SECTION_DESCRIPTION, FIELD_NAME } from '../../../components/form_builder/FormBuilder.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import {
  FORM_NAME_VALIDATION,
  FORM_DESCRIPTION_VALIDATION,
  SECTION_DESCRIPTION_VALIDATION,
  FIELD_TYPE_VALIDATION,
  FIELD_NAME_VALIDATION,
  TASK_NAME_VALIDATION,
  TASK_DESCRIPTION_VALIDATION,
  PLACEHOLDER_TEXT,
  INSTRUCTION_TEXT,
  FIELD_HELP_TEXT,
} from '../../../utils/ValidationConstants';
import { TASK_STRINGS } from './Task.strings';

export default {
  FORM_TITLE: FORM_NAME_VALIDATION.label(TASK_STRINGS.FORM_TITLE.LABEL).allow(null, EMPTY_STRING),
  FORM_DESCRIPTION_VALIDATION,
  FORM_NAME_VALIDATION,
  SECTION_DESCRIPTION_VALIDATION,
  FIELD_NAME_VALIDATION,
  TASK_NAME_VALIDATION,
  TASK_NAME: TASK_NAME_VALIDATION.required().label(TASK_STRINGS.TASK_TITLE.LABEL),
  TASK_DESCRIPTION: TASK_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING),
  TEAMS: Joi.array().items(Joi.object().keys({ _id: Joi.string().required() }).unknown(true).required()),
  USERS: Joi.array().items(Joi.object().keys({ _id: Joi.string().required() }).unknown(true).required()),
  FORM_DESCRIPTION: FORM_DESCRIPTION_VALIDATION.label(TASK_STRINGS.FORM_DESCRIPTION.LABEL).allow(null, EMPTY_STRING),

  //  SECTION
  SECTION_DESCRIPTION: SECTION_DESCRIPTION_VALIDATION.label(SECTION_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
  SECTION_ORDER: Joi.number().required(),
  IS_SECTION_SHOW_WHEN_RULE: Joi.bool(),
  SECTION_SHOW_WHEN_RULE: Joi.string(),
  // IS_TABLE: Joi.bool().required(),

  // field list
  IS_FIELD_LIST_SHOW_WHEN_RULE: Joi.bool(),
  FIELD_LIST_SHOW_WHEN_RULE: Joi.string(),
  TABLE_REFERENCE_NAME: Joi.string(),
  TABLE_UUID: Joi.string().uuid({ version: 'uuidv4' }),
  ROW_ORDER: Joi.number().required().default(1),
  COLUMN_ORDER: Joi.number().required(),

  // fields
  IS_SCRATCH: Joi.bool().required(),
  IS_CONFIG_OPEN: Joi.bool(),
  FIELD_NAME: FIELD_NAME_VALIDATION.required().trim().label(FIELD_NAME.LABEL),
  FIELD_TYPE: FIELD_TYPE_VALIDATION.required(),
  IS_FIELD_SHOW_WHEN_RULE: Joi.bool(),
  FIELD_SHOW_WHEN_RULE: Joi.string(),
  IS_FIELD_DEFAULT_VALUE_RULE: Joi.bool(),
  FIELD_DEFAULT_VALUE_RULE: Joi.string(),
  REQUIRED: Joi.bool(),
  REQUIRED_WHEN: Joi.string().allow(EMPTY_STRING),
  READ_ONLY: Joi.bool(),
  READ_ONLY_WHEN: Joi.string().allow(EMPTY_STRING),
  HELP_TEXT: FIELD_HELP_TEXT,
  PLACE_HOLDER: PLACEHOLDER_TEXT,
  INSTRUCTIONS: INSTRUCTION_TEXT,

  // Field validation
  FIELD_TYPE_VALIDATION,
  FIELD_SINGLE_LINE: Joi.string(),
  FIELD_PARAGRAPH: Joi.string(),
  FIELD_NUMBER: Joi.number(),
  FIELD_DATE: Joi.string(),
  FIELD_CURRENCY: Joi.object().keys({
    // value: Joi.number().greater(0).required().label(FIELD_CONFIG.BASIC_CONFIG.DEFAULT_VALUE.LABEL),
    // currency_type: Joi.string().required().label(FIELD_CONFIG.BASIC_CONFIG.DEFAULT_CURRENCY_TYPE.LABEL),
  }),
  FIELD_DROPDOWN: Joi.optional(),
  FIELD_CHECKBOX: Joi.optional(),
  FIELD_RADIO_GROUP: Joi.optional(),
  FIELD_YES_NO: Joi.optional(),
  FIELD_DROPDOWN_VALUES: Joi.string().required().replace(',', ''),
  FIELD_CHECKBOX_VALUES: Joi.string().required().replace(',', ''),
  FIELD_RADIO_GROUP_VALUES: Joi.string().required().replace(',', ''),
  FIELD_YES_NO_VALUES: Joi.string(),
  FIELD_DROPDOWN_VALIDATION: Joi.optional(),
  FIELD_CHECKBOX_VALIDATION: Joi.optional(),
  FIELD_RADIO_GROUP_VALIDATION: Joi.optional(),
  FIELD_YES_NO_VALIDATION: Joi.optional(),
};
