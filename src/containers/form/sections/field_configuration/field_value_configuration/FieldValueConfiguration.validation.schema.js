import Joi from 'joi';
import { FIELD_TYPES, FORM_STRINGS } from '../../../../../components/form_builder/FormBuilder.strings';
import { EMAIL_VALIDATION } from '../../../../../utils/ValidationConstants';
import jsUtility, { isNaN, translateFunction } from '../../../../../utils/jsUtility';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from '../basic_configuration/BasicConfiguration.strings';
import { LINK_VALIDATION } from './FieldValueConfiguration.utils';
import { RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';
import { DEFAULT_VALUE_FIELD_CONFIG_STRINGS } from './FieldValueConfiguration.strings';

const formDefaultValueValidation = (t = translateFunction) => [
  { is: FIELD_TYPES.SINGLE_LINE, then: Joi.string() },
  { is: FIELD_TYPES.PARAGRAPH, then: Joi.string() },
  { is: FIELD_TYPES.SCANNER, then: Joi.string() },
  { is: FIELD_TYPES.NUMBER, then: Joi.number().label(t('form_field_strings.form_field_constants.default_value')).messages({ 'number.unsafe': `${t('form_field_strings.form_field_constants.default_value')} ${t('validation_constants.utility_constant.safe_number')}` }) },
  { is: FIELD_TYPES.DROPDOWN, then: Joi.optional() },
  { is: FIELD_TYPES.DATE, then: Joi.string() },
  { is: FIELD_TYPES.DATETIME, then: Joi.string() },
  {
    is: FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
    then: Joi.optional(),
  },
  { is: FIELD_TYPES.CHECKBOX, then: Joi.optional() },
  { is: FIELD_TYPES.RADIO_GROUP, then: Joi.optional() },
  { is: FIELD_TYPES.YES_NO, then: Joi.optional() },
  {
    is: FIELD_TYPES.EMAIL,
    then: EMAIL_VALIDATION.label(t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_EF)),
  },
  {
    is: FIELD_TYPES.CURRENCY,
    then: Joi.object().keys({
      currency_type: Joi.string().label(t('form_field_strings.form_field_constants.default_currency_type')).required(),
      value: Joi.number().label(t('form_field_strings.form_field_constants.default_value')).required()
      .messages({
        'any.required': t('form_field_strings.form_field_constants.currency_type'),
      }),
    }),
  },
  {
    is: FIELD_TYPES.PHONE_NUMBER,
    then: Joi.object().keys({
      phone_number: Joi.string().max(17).min(3).label(t('form_field_strings.form_field_constants.default_phone_number')),
      country_code: Joi.string().label(t('form_field_strings.form_field_constants.default_country_code')).required(),
    }),
  },
  {
    is: FIELD_TYPES.LINK,
    then: Joi.when('validationData.isMultiple', {
      is: true,
      then: Joi.array().items(
        Joi.object()
          .keys({
            link_text: Joi.string().required().label(t('form_field_strings.form_field_constants.link_text')),
            link_url: LINK_VALIDATION.label(t('form_field_strings.field_config.link_url.label'))
            .messages({
              'string.uri': t('form_field_strings.form_field_constants.link_url'),
            }),
          })
          .optional(),
      ).custom((value, helper) => {
        const validationData = jsUtility.get(
          helper,
          ['state', 'ancestors', 0, 'validationData'],
          {},
          );
        const valueCount = (value || []).length;
        const minimumCount = !isNaN(validationData.minimumCount) ? validationData.minimumCount : 0;
        const maximumCount = !isNaN(validationData.maximumCount) ? validationData.maximumCount : minimumCount > 1 ? minimumCount : 1;
        if (valueCount < minimumCount) return helper.message(`${t('form_field_strings.error_text_constant.default_value')} ${minimumCount} ${t('form_field_strings.error_text_constant.items')}`);

          if (valueCount > maximumCount) return helper.message(`${t('form_field_strings.error_text_constant.default_value_equals')} ${maximumCount} ${t('form_field_strings.error_text_constant.items')}`);
          return value;
      }),
      otherwise: Joi.array().items(
        Joi.object()
          .keys({
            link_text: Joi.string().required().label(t('form_field_strings.form_field_constants.link_text')),
            link_url: LINK_VALIDATION.label(t('form_field_strings.field_config.link_url.label'))
            .messages({
              'string.uri': t('form_field_strings.form_field_constants.link_url'),
            }),
          })
          .optional(),
      ),
    }),
  },
  {
    is: FIELD_TYPES.USER_TEAM_PICKER,
    then: Joi.object().keys({
      [RESPONSE_FIELD_KEYS.SYSTEM_FIELD]: Joi.string(),
      [RESPONSE_FIELD_KEYS.OPERATION]: Joi.string(),
    }),
  },
];

export const fieldDefaultValueConfigurationSchema = (t = () => {}) => Joi.object().keys({
  defaultValue: Joi.when('fieldType', {
    switch: formDefaultValueValidation(t),
    otherwise: Joi.forbidden(),
  }),
  [RESPONSE_FIELD_KEYS.ALLOW_SELECT_ALL]: Joi.when('fieldType', {
    is: FIELD_TYPES.CHECKBOX,
    then: Joi.bool().required().label(DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.CHECKBOX.SELECT_ALL.LABEL),
    otherwise: Joi.forbidden(),
  }),
  fieldType: Joi.string().required().trim().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).FIELD_TYPE.LABEL),
});
