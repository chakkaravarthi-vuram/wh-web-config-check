import Joi from 'joi';
import { FIELD_TYPES } from '../../../../components/form_builder/FormBuilder.strings';
import { FIELD_GENERAL_CONFIG, RESPONSE_FIELD_KEYS } from '../../../../utils/constants/form/form.constant';
import { translateFunction } from '../../../../utils/jsUtility';
import { HELP_TEXT, INSTRUCTIONS } from '../../../../validation/form/form.validation.schema.constant';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from './basic_configuration/BasicConfiguration.strings';
import { FIELD_NAME_VALIDATION } from './basic_configuration/BasicConfiguration.validate.schema';

export const fieldSummaryConfigurationSchema = (t = translateFunction) => Joi.object().keys({
    [RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES]: Joi.allow(),
    [RESPONSE_FIELD_KEYS.FIELD_UUID]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES, {
        is: Joi.valid(...[FIELD_GENERAL_CONFIG.SYSTEM_FIELD, FIELD_GENERAL_CONFIG.DIRECT_FIELD]),
        then: Joi.string().required().trim().label(FIELD_GENERAL_CONFIG.FIELD),
        otherwise: Joi.forbidden(),
    }),
    [RESPONSE_FIELD_KEYS.HELPER_TOOLTIP]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES, {
        is: Joi.valid(...[FIELD_GENERAL_CONFIG.SYSTEM_FIELD, FIELD_GENERAL_CONFIG.DIRECT_FIELD]),
        then: HELP_TEXT.label('Helper Tooltip'),
        otherwise: Joi.forbidden(),
    }),
    [RESPONSE_FIELD_KEYS.INSTRUCTION]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES, {
        is: Joi.valid(...[FIELD_GENERAL_CONFIG.SYSTEM_FIELD, FIELD_GENERAL_CONFIG.DIRECT_FIELD]),
        then: INSTRUCTIONS.label('Field Instruction'),
        otherwise: Joi.forbidden(),
    }),
    [RESPONSE_FIELD_KEYS.FIELD_NAME]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: Joi.valid(...[FIELD_TYPES.INFORMATION, FIELD_GENERAL_CONFIG.ACTION_BUTTON]),
        then: FIELD_NAME_VALIDATION(t).optional().trim().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).LABEL)
        .allow(''),
        otherwise: FIELD_NAME_VALIDATION(t).required().trim().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).LABEL),
    }),
    [RESPONSE_FIELD_KEYS.FIELD_TYPE]: Joi.string().required().trim().label(BASIC_FORM_FIELD_CONFIG_STRINGS(t).FIELD_TYPE.LABEL),
    [FIELD_GENERAL_CONFIG.BUTTON_ACTION_TYPE]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: FIELD_GENERAL_CONFIG.ACTION_BUTTON,
        then: Joi.string().required().trim().label('Button/Link Type'),
        otherwise: Joi.forbidden(),
    }),
    [FIELD_GENERAL_CONFIG.BUTTON_NAME]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: FIELD_GENERAL_CONFIG.ACTION_BUTTON,
        then: Joi.string().required().trim().label('Button/Link Label'),
        otherwise: Joi.forbidden(),
    }),
    [FIELD_GENERAL_CONFIG.BUTTON_STYLE]: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
        is: FIELD_GENERAL_CONFIG.ACTION_BUTTON,
        then: Joi.string().required().trim().label('Action Button Style'),
        otherwise: Joi.forbidden(),
    }),
});
