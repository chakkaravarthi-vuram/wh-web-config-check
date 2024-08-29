import Joi from 'joi';
import { translateFunction } from '../../../../../../utils/jsUtility';
import { RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';
import { EXTERNAL_SOURCE_STRINGS } from './ExternalSourceColumnConfiguration.strings';

export const externalColumnConfigurationSchema = (t = translateFunction) => Joi.object().keys({
    [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_RULE_UUID]: Joi.string().required().label(EXTERNAL_SOURCE_STRINGS(t).CHOOSE_RULE.LABEL),
    [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_RULE_NAME]: Joi.string().required().label(EXTERNAL_SOURCE_STRINGS(t).CHOOSE_RULE.LABEL),
    [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_TABLE_COLUMNS]: Joi.array().required().min(1)
    .label(EXTERNAL_SOURCE_STRINGS(t).TABLE_COLUMNS.ERROR_LABEL)
    .messages({
        'array.min': EXTERNAL_SOURCE_STRINGS(t).TABLE_COLUMNS.ERROR_MESSAGE,
    }),
    [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_EXISTING_TABLE_COLUMNS]: Joi.array().optional(),
    [RESPONSE_FIELD_KEYS.EXTERNAL_SOURCE_DIRECT_FIELDS]: Joi.array().optional(),
    [RESPONSE_FIELD_KEYS.IS_EXTERNAL_SOURCE_SAVED_RULE]: Joi.any(),
});
