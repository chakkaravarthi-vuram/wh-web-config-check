import Joi from 'joi';
import { REQUEST_SAVE_FORM, RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';
import { translateFunction } from '../../../../../../utils/jsUtility';
import { FIELD_TYPES } from '../../FieldConfiguration.strings';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from '../BasicConfiguration.strings';

export const dataListPropertyPickerSchema = (t = translateFunction) =>
    Joi.object().keys({
        [RESPONSE_FIELD_KEYS.SOURCE]: Joi.valid(...(Object.values(REQUEST_SAVE_FORM.SOURCE_TYPE))).required().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).DATALIST_SELECTOR.PICKER.LABEL),
        [RESPONSE_FIELD_KEYS.SOURCE_FIELD_UUID]: Joi.string().required().label(t('form_field_strings.form_field_constants.datalist_picker')),
        [RESPONSE_FIELD_KEYS.REFERENCE_FIELD_UUID]: Joi.string().required().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).DATALIST_SELECTOR.FIELD.LABEL),
        [RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE]: Joi.valid(...(Object.values(FIELD_TYPES))).required().label(RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE),
        [RESPONSE_FIELD_KEYS.DATA_LIST_ID]: Joi.optional(),
        [RESPONSE_FIELD_KEYS.DATA_LIST_UUID]: Joi.optional(),
        [RESPONSE_FIELD_KEYS.REFERENCE_FIELD_NAME]: Joi.optional(),
        [RESPONSE_FIELD_KEYS.DATA_LIST_NAME]: Joi.optional(),
        [RESPONSE_FIELD_KEYS.REFERENCE_FIELD_CHOICE_VALUE_TYPE]: Joi.optional(),
        sourceFieldName: Joi.optional(),
      }).required();

export const userPropertyPickerSchema = (t = translateFunction) => Joi.object().keys({
        [RESPONSE_FIELD_KEYS.SOURCE]: Joi.valid(...(Object.values(REQUEST_SAVE_FORM.SOURCE_TYPE))).required().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).USER_SELECTOR.PICKER.LABEL),
        [RESPONSE_FIELD_KEYS.SOURCE_FIELD_UUID]: Joi.string().required().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).USER_SELECTOR.PICKER.LABEL),
        [RESPONSE_FIELD_KEYS.REFERENCE_FIELD_UUID]: Joi.string().required().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).DATALIST_SELECTOR.FIELD.LABEL).label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).USER_SELECTOR.PICKER.FIELD_LABEL),
        [RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE]: Joi.valid(...(Object.values(FIELD_TYPES))).required().label(RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE),
        [RESPONSE_FIELD_KEYS.DATA_LIST_ID]: Joi.optional(),
        [RESPONSE_FIELD_KEYS.DATA_LIST_UUID]: Joi.optional(),
        [RESPONSE_FIELD_KEYS.REFERENCE_FIELD_NAME]: Joi.optional(),
        [RESPONSE_FIELD_KEYS.DATA_LIST_NAME]: Joi.optional(),
        [RESPONSE_FIELD_KEYS.REFERENCE_FIELD_CHOICE_VALUE_TYPE]: Joi.optional(),
        sourceFieldName: Joi.optional(),
    }).required();
