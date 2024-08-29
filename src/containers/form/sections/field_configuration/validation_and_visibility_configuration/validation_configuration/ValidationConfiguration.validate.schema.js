import Joi from 'joi';
import { FIELD_TYPES } from '../../../../../../components/form_builder/FormBuilder.strings';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from '../../basic_configuration/BasicConfiguration.strings';
import { translateFunction } from '../../../../../../utils/jsUtility';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../utils/constants/form/form.constant';
import { dateValidationSchema } from './date_field_validation_configuration/DateFieldValidationConfiguration.validate.schema';
import { VALIDATION_ERROR_TYPES } from '../../../../../../utils/strings/CommonStrings';
import { VALIDATION_CONSTANT } from '../../../../../../utils/constants/validation.constant';
import { datalistFilterValidationSchema } from './datalist_selector_validation_configuration/filter_configuration/FilterValidation';

export const singlelineValidationSchema = (t) => Joi.object().keys({
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MINIMUM_CHARACTERS]: Joi.number().default(0).min(1).messages({
      'number.min': t('validation_constants.utility_constant.min_eqaul_to_one'),
      'number.unsafe': `${t('form_field_strings.validation_config.minimum_characters.label')} ${t('validation_constants.utility_constant.safe_number')}`,
    }),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MAXIMUM_CHARACTERS]: Joi.number()
      .default(255)
      .min(Joi.ref('minimumCharacters'))
      .greater(0)
      .messages({
        'number.min': t('validation_constants.utility_constant.maximum_reater_than_minimum'),
        'number.greater': t('validation_constants.utility_constant.maximum_reater_than_minimum'),
        'number.unsafe': `${t('form_field_strings.validation_config.maximum_characters.label')} ${t('validation_constants.utility_constant.safe_number')}`,
      }),
      [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOW_SPECIAL_CHARACTERS]: Joi.optional(),
      [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOWED_SPECIAL_CHARACTERS]: Joi.when('allowSpecialCharacters', {
        is: true,
        then: Joi.string().required().label(t('form_field_strings.validation_config.allowed_special_characters.placeholder')),
        otherwise: Joi.forbidden(),
      }),
  });

export const paragraphValidationSchema = (t) => Joi.object().keys({
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].MINIMUM_CHARACTERS]: Joi.number().default(0).min(1).label(t('form_field_strings.validation_config.minimum_characters.label')),
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].MAXIMUM_CHARACTERS]: Joi.number()
    .default(4000)
    .min(Joi.ref('minimumCharacters'))
    .greater(0)
    .label(t('form_field_strings.validation_config.maximum_characters.label'))
    .messages({
      'number.min': t('validation_constants.utility_constant.maximum_reater_than_minimum'),
      'number.greater': t('validation_constants.utility_constant.maximum_reater_than_minimum'),
      'number.unsafe': `${t('form_field_strings.validation_config.maximum_characters.label')} ${t('validation_constants.utility_constant.safe_number')}`,
    }),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOW_SPECIAL_CHARACTERS]: Joi.optional(),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOWED_SPECIAL_CHARACTERS]: Joi.when('allowSpecialCharacters', {
      is: true,
      then: Joi.string().required().label(t('form_field_strings.validation_config.allowed_special_characters.placeholder')),
      otherwise: Joi.forbidden(),
    }),
});

export const numberValidationSchema = (t) => Joi.object().keys({
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOW_DECIMAL]: Joi.bool().default(false),
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].DONT_ALLOW_ZERO]: Joi.bool().default(false),
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_MINIMUM]: Joi.when('dontAllowZero', {
    is: true,
    then: Joi.number().custom((value, helpers) => {
      if (helpers.state.ancestors[0][RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].DONT_ALLOW_ZERO] && value === 0) return helpers.message(t('form_field_strings.error_text_constant.invalid_minimum_value'));
      return value;
    }),
    otherwise: Joi.number(),
  }).label(t('form_field_strings.validation_config.minimum_value.label')),
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_MAXIMUM]: Joi.number().when('allowedMinimum', {
    is: Joi.number().valid(),
    then: Joi.number().custom((value, helpers) => {
      if (helpers.state.ancestors[0][RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].DONT_ALLOW_ZERO] && value === 0) return helpers.message(t('form_field_strings.error_text_constant.invalid_maximum_value'));
      if (value < helpers.state.ancestors[0][RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_MINIMUM]) return helpers.message(t('form_field_strings.error_text_constant.maximium_greater_than_minimum'));
      return value;
    }),
    otherwise: Joi.number().greater(0),
  }).label(t('form_field_strings.validation_config.maximum_value.label')),
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_DECIMAL_POINTS]: Joi.when('allowDecimal', {
    is: true,
    then: Joi.number().default(2).min(1).max(10)
    .required()
    .label(t('form_field_strings.error_text_constant.decimal'))
    .messages({
      'number.min': t('form_field_strings.error_text_constant.greate_than_0'),
    }),
    otherwise: Joi.forbidden(),
  }),
});

export const currencyValidationSchema = Joi.object().keys({
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.CURRENCY].ALLOWED_CURRENCY_TYPES]: Joi.array().items(Joi.string()),
});

export const linkValidationSchema = (t) => Joi.object().keys({
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].IS_MULTIPLE]: Joi.bool(),
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MAXIMUM_COUNT]: Joi.when('allowMultiple', {
    is: true,
    then: Joi.when('minimumCount', {
      is: Joi.exist(),
      then: Joi.number().greater(0).min(Joi.ref('minimumCount')),
      otherwise: Joi.number().greater(0),
    })
    .label(t('form_field_strings.validation_config.maximum_count.label'))
    .messages({
      'number.min': t('validation_constants.utility_constant.max_link_count'),
      'any.ref': '',
    }),
    otherwise: Joi.forbidden(),
  }),
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MINIMUM_COUNT]: Joi.when('allowMultiple', {
    is: true,
    then: Joi.number().greater(0),
    otherwise: Joi.forbidden(),
  })
  .label(t('form_field_strings.validation_config.minimum_count.label')),
});

export const fileUploadValidationSchema = (t) => Joi.object().keys({
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].IS_MULTIPLE]: Joi.bool(),
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_COUNT]: Joi.when('allowMultiple', {
    is: true,
    then: Joi.when('minimumCount', {
      is: Joi.exist(),
      then: Joi.number().greater(0).min(Joi.ref('minimumCount')),
      otherwise: Joi.number().greater(0),
    })
    .label(t('form_field_strings.validation_config.maximum_file_count.label'))
    .messages({
      'number.min': t('validation_constants.utility_constant.maximium_file_count_greater_than_min'),
      'any.ref': '',
    }),
    otherwise: Joi.forbidden(),
  }),
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MINIMUM_COUNT]: Joi.when('allowMultiple', {
    is: true,
    then: Joi.number().greater(0),
    otherwise: Joi.forbidden(),
  })
  .label(t('form_field_strings.validation_config.minimum_file_count.label')),
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].SYSTEM_MAX_FILE_SIZE]: Joi.number(),
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_FILE_SIZE]: Joi.number().integer().min(1).label(t('form_field_strings.validation_config.maximum_file_size.label'))
  .max(Joi.ref('systemMaxFileSize'))
  .messages({
    'number.max': `${t('form_field_strings.validation_config.maximum_file_size.system_max_size_error')}`,
  }),
  [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].ALLOWED_EXTENSIONS]: Joi.array().items(Joi.string()).label(t('form_field_strings.validation_config.allowed_file_extension.label')),
});

export const userSelectorValidationSchema = (t) => Joi.object().keys({
  [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.ALLOW_MULTIPLE]: Joi.bool().default(false),
  [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.MINIMUM_SELECTION]: Joi.when('allowMultiple', {
    is: true,
    then: Joi.number().default(0).greater(0).messages({
      'number.min': t('validation_constants.utility_constant.minimum_allowed_user_count'),
      'number.unsafe': `${t('form_field_strings.validation_config.minimim_user_selection.label')} ${t('validation_constants.utility_constant.safe_number')}`,
      })
      .optional()
      .label(t('form_field_strings.validation_config.minimim_user_selection.label')),
    otherwise: Joi.forbidden(),
  }),
  [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.MAXIMUM_SELECTION]: Joi.when('allowMultiple', {
    is: true,
    then: Joi.when('minimumSelection', {
      is: Joi.exist(),
      then: Joi.number()
      .default(255)
      .greater(0)
      .min(Joi.ref('minimumSelection'))
      .messages({
        'number.min': t('validation_constants.utility_constant.max_allowed_user_tham_min'),
        'number.unsafe': `${t('form_field_strings.validation_config.max_user_selection.label')} ${t('validation_constants.utility_constant.safe_number')}`,
      })
      .label(t('form_field_strings.validation_config.max_user_selection.label')),
      otherwise: Joi.number()
      .default(255)
      .greater(0)
      .messages({
        'any.required': t('validation_constants.utility_constant.either_is_required'),
        'number.min': t('validation_constants.utility_constant.max_allowed_user_tham_min'),
        'number.unsafe': `${t('form_field_strings.validation_config.max_user_selection.label')} ${t('validation_constants.utility_constant.safe_number')}`,
      })
      .label(t('form_field_strings.validation_config.max_user_selection.label')),
    }),
    otherwise: Joi.forbidden(),
  }),
  [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.IS_RESTRICTED]: Joi.bool().default(false),
  [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.RESTRICTED_USER_TEAM]: Joi.when('isRestricted', {
    is: true,
    then: Joi.object()
    .keys({
      teams: Joi.array().min(1),
      users: Joi.array().min(1),
    })
    .or('users', 'teams')
    .required(),
    otherwise: Joi.object(),
  })
  .label(t('form_field_strings.validation_config.restricted_user_team.label'))
  .messages({
    'any.required': t('validation_constants.utility_constant.one_user_team_required'),
  }),
});

export const datalistSelectorValidationSchema = (t) => Joi.object().keys({
  [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.ALLOW_MULTIPLE]: Joi.bool().default(false),
  [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.MINIMUM_SELECTION]: Joi.when('allowMultiple', {
    is: true,
    then: Joi.number().default(0).greater(0).messages({
        'number.min': t('validation_constants.utility_constant.minimum_allowed_user_count'),
        'number.unsafe': `${t('form_field_strings.validation_config.minimim_user_selection.label')} ${t('validation_constants.utility_constant.safe_number')}`,
        })
        .optional()
        .label(t('form_field_strings.validation_config.minimim_user_selection.label')),
    otherwise: Joi.forbidden(),
  }),
  [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.MAXIMUM_SELECTION]: Joi.when('allowMultiple', {
    is: true,
    then: Joi.when('minimumSelection', {
      is: Joi.exist(),
      then: Joi.number()
      .default(255)
      .greater(0)
      .min(Joi.ref('minimumSelection'))
      .messages({
        'number.min': t('validation_constants.utility_constant.max_allowed_user_tham_min'),
        'number.unsafe': `${t('form_field_strings.validation_config.maximum_user_selection.label')} ${t('validation_constants.utility_constant.safe_number')}`,
      })
      .label(t('form_field_strings.validation_config.max_user_selection.label')),
    otherwise: Joi.number()
    .default(255)
    .greater(0)
    .messages({
      'number.min': t('validation_constants.utility_constant.max_allowed_user_tham_min'),
      'number.unsafe': `${t('form_field_strings.validation_config.maximum_user_selection.label')} ${t('validation_constants.utility_constant.safe_number')}`,
    })
    .label(t('form_field_strings.validation_config.max_user_selection.label')),
    }),
    otherwise: Joi.forbidden(),
  }),
  [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS]: Joi.array().items(datalistFilterValidationSchema(t)).unique().label(t('form_field_strings.error_text_constant.filter')),
});

const tableValidationSchema = (t) => {
     const {
      ADD_NEW_ROW,
      ALLOW_MODIFY_EXISTING,
      ALLOW_DELETE_EXISTING,
      IS_MINIMUM_ROW,
      IS_MAXIMUM_ROW,
      IS_UNIQUE_COLUMN_AVAILABLE,
      MAXIMUM_ROW,
      MINIMUM_ROW,
      UNIQUE_COLUMN_UUID,
      // READ_ONLY,
      IS_PAGINATION,
   } = RESPONSE_VALIDATION_KEYS[FIELD_TYPES.TABLE];

  const schema = Joi.object({
    [ADD_NEW_ROW]: Joi.boolean().required(),
    [ALLOW_MODIFY_EXISTING]: Joi.boolean().required(),
    [ALLOW_DELETE_EXISTING]: Joi.boolean().required(),
    // [READ_ONLY]: Joi.boolean().required(),
    [IS_PAGINATION]: Joi.boolean().required(),
    [IS_MAXIMUM_ROW]: Joi.boolean().required(),
    [IS_MINIMUM_ROW]: Joi.boolean().required(),
    [IS_UNIQUE_COLUMN_AVAILABLE]: Joi.boolean().required(),
    [MINIMUM_ROW]: Joi.when(IS_MINIMUM_ROW, {
      is: true,
      then: Joi.number().default(1).required().min(1),
      otherwise: Joi.allow(null, ''),
    })
    .label(t('form_field_strings.validation_config.minimum_value.label'))
    .messages({
      [VALIDATION_ERROR_TYPES.NUMBER_MIN]: `${t('form_field_strings.validation_config.minimum_value.label')} ${t(VALIDATION_CONSTANT.MUST_BE_GREATER_THAN_OR_EQUAL)} 1`,
    }),
    [MAXIMUM_ROW]: Joi.when(IS_MAXIMUM_ROW, {
      is: true,
      then: Joi.when(IS_MINIMUM_ROW, {
        is: true,
        then: Joi.number().required().min(Joi.ref(MINIMUM_ROW)),
        otherwise: Joi.number().required().min(1),
      }),
      otherwise: Joi.allow(null, ''),
    })
    .label(t('form_field_strings.validation_config.maximum_value.label'))
    .messages({
      [VALIDATION_ERROR_TYPES.NUMBER_MIN]: `${t('form_field_strings.validation_config.maximum_value.label')} ${t(VALIDATION_CONSTANT.MUST_BE_GREATER_THAN_OR_EQUAL)} {{${MINIMUM_ROW}}}`,
    }),
    [UNIQUE_COLUMN_UUID]: Joi.when(IS_UNIQUE_COLUMN_AVAILABLE, {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.allow(null, ''),
    }).label(t('form_field_strings.field_list_config.validation_config.unique_column.label_2')),
  });

  return schema;
};

const formFieldValidation = (t = translateFunction) => [
    { is: FIELD_TYPES.SINGLE_LINE, then: singlelineValidationSchema(t) },
    { is: FIELD_TYPES.PARAGRAPH, then: paragraphValidationSchema(t) },
    { is: FIELD_TYPES.NUMBER, then: numberValidationSchema(t) },
    { is: FIELD_TYPES.CURRENCY, then: currencyValidationSchema },
    { is: FIELD_TYPES.LINK, then: linkValidationSchema(t) },
    { is: FIELD_TYPES.FILE_UPLOAD, then: fileUploadValidationSchema(t) },
    { is: FIELD_TYPES.USER_TEAM_PICKER, then: userSelectorValidationSchema(t) },
    { is: FIELD_TYPES.DATA_LIST, then: datalistSelectorValidationSchema(t) },
    { is: FIELD_TYPES.DATE, then: dateValidationSchema(t) },
    { is: FIELD_TYPES.DATETIME, then: dateValidationSchema(t) },
    { is: FIELD_TYPES.TABLE, then: tableValidationSchema(t) },
];

export const fieldValidationConfigurationSchema = (t = () => {}) => Joi.object().keys({
  [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: Joi.when('fieldType', {
    switch: formFieldValidation(t),
    otherwise: Joi.forbidden(),
  }),
  [RESPONSE_FIELD_KEYS.FIELD_TYPE]: Joi.string().required().trim().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).FIELD_TYPE.LABEL),
});
