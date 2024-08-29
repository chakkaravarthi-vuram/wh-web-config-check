import Joi from 'joi';
import { HELP_TEXT, INSTRUCTIONS, PLACE_HOLDER } from '../../../../../../validation/form/form.validation.schema.constant';
import { FIELD_CONFIG } from '../../../../../../components/form_builder/FormBuilder.strings';
import { translateFunction } from '../../../../../../utils/jsUtility';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../../FieldConfiguration.strings';
import { TECHNICAL_REFERENCE_NAME_REGEX } from '../../../../../../utils/strings/Regex';

export const fieldGuidanceConfigurationSchema = (t = translateFunction) => Joi.object().keys({
    [RESPONSE_FIELD_KEYS.EDIT_REFERENCE_NAME]: Joi.bool().required(),
    [RESPONSE_FIELD_KEYS.TEMPORARY_REFERENCE_NAME]: Joi.when('editReferenceName', {
        is: true,
        then: Joi.string().regex(TECHNICAL_REFERENCE_NAME_REGEX).required().label(FIELD_CONFIG(t).ADVANCED_TECHNICAL_CONFIG.FLOW_FIELD.PLACEHOLDER),
        otherwise: Joi.optional(),
    }),
    [RESPONSE_FIELD_KEYS.HELPER_TOOLTIP]: HELP_TEXT.label(FIELD_CONFIG(t).OTHER_CONFIG.HELPER_TOOL_TIP.LABEL),
    [RESPONSE_FIELD_KEYS.HELPER_TOOLTIP]: HELP_TEXT.label(FIELD_CONFIG(t).OTHER_CONFIG.HELPER_TOOL_TIP.LABEL),
    [RESPONSE_FIELD_KEYS.PLACEHOLDER]: PLACE_HOLDER.label(FIELD_CONFIG(t).OTHER_CONFIG.PLACEHOLDER_VALUE.LABEL),
    [RESPONSE_FIELD_KEYS.INSTRUCTION]: INSTRUCTIONS.label(FIELD_CONFIG(t).OTHER_CONFIG.INSTRUCTION.LABEL),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].SHOW_ELLIPSIS]: Joi.bool().default(false),
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.PARAGRAPH].ELLIPSIS_LENGTH]: Joi.when('isEllipseText', {
        is: true,
        then: Joi.number()
        .integer()
        .required()
        .min(0)
        .label(t('form_field_strings.validation_config.show_ellipsis.text_length')),
        otherwise: Joi.forbidden(),
    }),
});
