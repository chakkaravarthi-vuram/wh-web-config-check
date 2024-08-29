import Joi from 'joi';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from './BasicConfiguration.strings';
import { FIELD_GROUPING } from './BasicConfiguration.utils';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../FieldConfiguration.strings';
import { translateFunction } from '../../../../../utils/jsUtility';
import { dataListPropertyPickerSchema, userPropertyPickerSchema } from './picker_basic_configuration/PickerBasicConfiguration.validation.schema';
import { VALIDATION_ERROR_TYPES } from '../../../../../utils/strings/CommonStrings';
import { FORM_STRINGS } from '../../../../../components/form_builder/FormBuilder.strings';
import { FLOW_MIN_MAX_CONSTRAINT, FORM_MIN_MAX_CONSTRAINT } from '../../../../../utils/Constants';
import { FIELD_NAME_REGEX } from '../../../../../utils/strings/Regex';

export const FIELD_NAME_VALIDATION = (t = translateFunction) => Joi.string()
  .regex(FIELD_NAME_REGEX)
  .min(FLOW_MIN_MAX_CONSTRAINT.FIELD_NAME_MIN_VALUE)
  .max(FLOW_MIN_MAX_CONSTRAINT.FIELD_NAME_MAX_VALUE)
  .trim()
  .messages({
    [VALIDATION_ERROR_TYPES.REGEX]: BASIC_FORM_FIELD_CONFIG_STRINGS(t).INVALID_LABEL,
  });

const dataListFieldSchema = (t = translateFunction) => Joi.object().keys({
    [RESPONSE_FIELD_KEYS.DATA_LIST_ID]: Joi.string().optional().label(t('form_field_strings.form_field_constants.datalist')),
    [RESPONSE_FIELD_KEYS.DATA_LIST_UUID]: Joi.string().required().label(t('form_field_strings.form_field_constants.datalist')),
    [RESPONSE_FIELD_KEYS.DISPLAY_FIELDS]: Joi.array()
      .items(Joi.string().label(t('form_field_strings.form_field_constants.datalist_field')))
      .unique()
      .min(1)
      .label(t('form_field_strings.form_field_constants.datalist_field'))
      .required(),
    [RESPONSE_FIELD_KEYS.HAS_PROPERTY_FIELD]: Joi.optional(),
  });

export const fieldBasicConfigurationSchema = (t = () => {}) => Joi.object().keys({
    [RESPONSE_FIELD_KEYS.FIELD_NAME]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: FIELD_TYPES.INFORMATION,
        then: FIELD_NAME_VALIDATION(t).optional().trim().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).LABEL)
        .allow(''),
        otherwise: FIELD_NAME_VALIDATION(t).required().trim().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).LABEL),
    }),
    [RESPONSE_FIELD_KEYS.FIELD_TYPE]: Joi.string().required().trim().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).FIELD_TYPE.LABEL),
    [RESPONSE_FIELD_KEYS.REQUIRED]: Joi.bool().required().default(false).label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).REQUIRED.VALIDATION),
    [RESPONSE_FIELD_KEYS.READ_ONLY]: Joi.bool().required().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).READ_ONLY.LABEL),
    [RESPONSE_FIELD_KEYS.VALUES]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: Joi.valid(...FIELD_GROUPING.SELECTION_FIELDS),
        then: Joi.array().unique((a, b) => (a.label === b.label || a.value === b.value) && a.value && b.value).items(Joi.object().keys({
            label: Joi.string().required()
            .label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.OPTION_LABEL)
            .max(500)
            .messages({
                'string.empty': `${BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.OPTION_LABEL} ${t('task_validation_strings.is_required')}`,
            }),
            value: Joi.string().required()
            .label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_LABEL)
            .max(500)
            .messages({
                'string.empty': `${BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_LABEL} ${t('task_validation_strings.is_required')}`,
            }),
        }).required()
        .min(1))
        .messages({
            'array.includesRequiredUnknowns': BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_ERROR,
        })
        .label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.LABEL),
        otherwise: Joi.forbidden(),
    })
    .label(t('form_field_strings.form_field_constants.value'))
    .messages({
        'array.includesRequiredUnknowns': `${t('form_field_strings.form_field_constants.value')} ${t('task_validation_strings.is_required')}`,
    }),
    [RESPONSE_FIELD_KEYS.VALUE_TYPE]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: Joi.valid(...FIELD_GROUPING.SELECTION_FIELDS),
        then: Joi.string(),
        otherwise: Joi.forbidden(),
    }),
    [RESPONSE_FIELD_KEYS.VALUE_METADATA]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
        then: Joi.object().keys({
            [RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_ID]: Joi.string().required().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).LOOKUP_LIST.LABEL),
            [RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_NAME]: Joi.string().required().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).LOOKUP_LIST.LABEL),
        }).required().label(RESPONSE_FIELD_KEYS.VALUE_METADATA),
        otherwise: Joi.forbidden(),
    }),
    [RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: FIELD_TYPES.DATA_LIST,
        then: dataListFieldSchema(t).required(),
        otherwise: Joi.forbidden(),
    }).label(t('form_field_strings.form_field_constants.datalist')),
    [RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
    is: FIELD_TYPES.DATA_LIST_PROPERTY_PICKER,
    then: dataListPropertyPickerSchema(t),
    otherwise: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: FIELD_TYPES.USER_PROPERTY_PICKER,
        then: userPropertyPickerSchema(t),
        otherwise: Joi.forbidden(),
        }),
    }),
    [RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: FIELD_TYPES.INFORMATION,
        then: Joi.string().min(FORM_MIN_MAX_CONSTRAINT.INFO_FIELD_MIN_VALUE).max(FORM_MIN_MAX_CONSTRAINT.INFO_FIELD_MAX_VALUE).required(),
        otherwise: Joi.forbidden(),
    }).label(t('form_field_strings.form_field_constants.info_content')),
    columns: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
       is: Joi.valid(FIELD_TYPES.TABLE),
       then: Joi.array().items(Joi.object()).min(1).required()
       .messages({
        [VALIDATION_ERROR_TYPES.ARRAY_MIN]: t(FORM_STRINGS.TABLE.MIN_FIELDS_ERROR),
       }),
       otherwise: Joi.forbidden(),
    }),
});

export const fieldNameSchema = (t = translateFunction) => {
  const schema = Joi.object({
    fieldName: FIELD_NAME_VALIDATION(t).required()
      .trim()
      .label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).LABEL),
  });
  return schema;
};
