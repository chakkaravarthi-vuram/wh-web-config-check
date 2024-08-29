import Joi from 'joi';
import { translateFunction } from '../../../../../../../../utils/jsUtility';
import { FIELD_TYPES } from '../../../../FieldConfiguration.strings';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../../../utils/constants/form/form.constant';
import { dateFieldValidation } from '../../date_field_validation_configuration/DateFieldValidationConfiguration.validate.schema';

const validateDataListFilterDate = (value, isDateTime) => {
    const data = {
      futureDate: false,
      pastDate: false,
      specificDate: null,
      fromDate: null,
      toDate: null,
      today: false,
      isFixedDateTime: false,
    };
    return dateFieldValidation({
      workingDaysOnly: false,
      workingDays: [],
      ...data,
    }, value, isDateTime);
  };

export const datalistFilterValidationSchema = (translate = translateFunction) => Joi.object().keys({
    [RESPONSE_FIELD_KEYS.FIELD_UUID]: Joi.string().required().label(translate('form_field_strings.validation_config.limit_datalist.filter_fields.label')),
    [RESPONSE_FIELD_KEYS.FIELD_NAME]: Joi.any(),
    [RESPONSE_FIELD_KEYS.FIELD_TYPE]: Joi.string().required().label(translate('form_field_strings.validation_config.limit_datalist.filter_fields.field_type')),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].OPERATOR]: Joi.string().required().label(translate('form_field_strings.validation_config.limit_datalist.filter_fields.operator_label')),
    [RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: Joi.equal(
            FIELD_TYPES.CHECKBOX,
            FIELD_TYPES.DROPDOWN,
            FIELD_TYPES.RADIO_GROUP,
            ),
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
    }),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD_VALUE]: Joi.when(RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].VALUE_TYPE, {
    is: 'field',
    then: Joi.optional(),
    otherwise: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
    is: '',
    then: Joi.optional(),
    otherwise: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: Joi.equal(
        FIELD_TYPES.CHECKBOX,
        FIELD_TYPES.DROPDOWN,
        FIELD_TYPES.RADIO_GROUP,
        FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
        ),
        then: Joi.array().required().label(translate('form_field_strings.form_field_constants.value'))
        .messages({
            'array.base': `${translate('form_field_strings.form_field_constants.value')} ${translate('common_strings.is_required')}`,
        }),
        otherwise: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: FIELD_TYPES.NUMBER,
        then: Joi.number().required().label(translate('form_field_strings.form_field_constants.value')),
        otherwise: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
            is: Joi.equal(FIELD_TYPES.CURRENCY),
            then: Joi.object().keys({
            value: Joi.number().greater(0).label(translate('form_field_strings.form_field_constants.value')).required(),
            currency_type: Joi.string().label(translate('form_field_strings.field_config.currency_type_dd.label')).required(),
            }),
            otherwise: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
            is: Joi.equal(FIELD_TYPES.DATE, FIELD_TYPES.DATETIME),
            // then: validateDataListFilterDate(this.field_value),
            then: Joi.string().custom((value, helper) => {
                const error = validateDataListFilterDate(helper.state.ancestors[0].field_value, helper.state.ancestors[0].field_type === FIELD_TYPES.DATETIME);
                if (error) return helper.message(error);
                return value;
            }).label(translate('form_field_strings.form_field_constants.value')),
            otherwise: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
                is: FIELD_TYPES.YES_NO,
                then: Joi.bool().required().label(translate('form_field_strings.form_field_constants.value')),
                otherwise: Joi.forbidden(),
            }),
            }),
        }),
        }),
    }),
    }),
    }),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].VALUE_TYPE]: Joi.string(),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FIELD]: Joi.when(RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].VALUE_TYPE, {
    is: 'field',
    then: Joi.string().required().label(translate('form_field_strings.error_text_constant.field_name'))
    .messages({
        'string.empty': `${translate('form_field_strings.error_text_constant.field_name')} ${translate('common_strings.is_required')}`,
    }),
    otherwise: Joi.when(RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].VALUE_TYPE, {
        is: 'direct',
        then: Joi.optional(),
    }),
    }),
    [RESPONSE_FIELD_KEYS.CHOICE_VALUES]: Joi.array().optional(),
});
