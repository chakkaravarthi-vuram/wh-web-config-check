import Joi from 'joi';
import { constructJoiObject } from '../../../utils/ValidationConstants';
import { FLOW_MIN_MAX_CONSTRAINT } from '../../../utils/Constants';
import { VALIDATION_ERROR_TYPES } from '../../../utils/strings/CommonStrings';
import { FIELD_NAME_REGEX } from '../../../utils/strings/Regex';
import { VALIDATION_STRINGS } from './ManageFlowFields.strings';
import { FIELD_TYPES, FIELD_TYPE_IDS, RESPONSE_FIELD_KEYS } from './ManageFlowFields.constants';
import { translateFunction } from '../../../utils/jsUtility';

export const basicFieldsValidationSchema = (t = translateFunction, isDocumentGeneration) => {
    const baseSchema = {
        fieldName: Joi.string()
            .required()
            .regex(FIELD_NAME_REGEX)
            .min(FLOW_MIN_MAX_CONSTRAINT.FIELD_NAME_MIN_VALUE)
            .max(FLOW_MIN_MAX_CONSTRAINT.FIELD_NAME_MAX_VALUE)
            .trim()
            .label(FIELD_TYPE_IDS.FIELD_NAME.LABEL)
            .messages({ [VALIDATION_ERROR_TYPES.REGEX]: VALIDATION_STRINGS(t).FIELD_NAME_REGEX_ERROR }),
        fieldType: Joi.string()
            .label(FIELD_TYPE_IDS.FIELD_TYPE.LABEL)
            .required(),
        columns: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
            is: Joi.valid(FIELD_TYPES.TABLE),
            then: Joi.array().items(Joi.object()).min(1).required()
                .messages({
                    [VALIDATION_ERROR_TYPES.ARRAY_MIN]: 'Table must have at least 1 column',
                    [VALIDATION_ERROR_TYPES.REQUIRED]: 'Table must have at least 1 column',
                }),
            otherwise: Joi.forbidden(),
        }),
        dataListUuid: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
            is: FIELD_TYPES.DATA_LIST,
            then: Joi.string().required().label(FIELD_TYPE_IDS.DATA_LISTS.LABEL),
        }),
        displayFields: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
            is: FIELD_TYPES.DATA_LIST,
            then: Joi.array().required().min(1)
                .items(Joi.string().label(FIELD_TYPE_IDS.DATA_LISTS_FIELD.LABEL), Joi.string().label(FIELD_TYPE_IDS.DATA_LISTS_FIELD.LABEL))
                .label(FIELD_TYPE_IDS.DATA_LISTS_FIELD.LABEL)
                .messages({
                    [VALIDATION_ERROR_TYPES.ARRAY_BASE]: "Datalists' Field is required",
                    [VALIDATION_ERROR_TYPES.ARRAY_MIN]: "Datalists' Field is required",
                }),
        }),
        choiceValueType: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
            is: Joi.valid(FIELD_TYPES.RADIO_GROUP, FIELD_TYPES.DROPDOWN, FIELD_TYPES.CHECKBOX),
            then: Joi.string().required().label(FIELD_TYPE_IDS.CHOICE_VALUE_TYPE.LABEL),
        }),
        choiceValues: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
            is: Joi.valid(FIELD_TYPES.RADIO_GROUP, FIELD_TYPES.DROPDOWN, FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN, FIELD_TYPES.CHECKBOX),
            then: Joi.array().required().min(1)
                .unique((a, b) => (a.label === b.label || a.value === b.value) && a.value && b.value)
                .label(FIELD_TYPE_IDS.CHOICE_VALUES.LABEL)
                .items(
                    Joi.object().keys({
                        label: Joi.string().required().label('Label'),
                        value: Joi.string().required().label('Value'),
                    }),
                )
                .messages({ [VALIDATION_ERROR_TYPES.ARRAY_MIN]: 'Selection Options is required' }),
        }),
        valueMetadata: Joi.when(RESPONSE_FIELD_KEYS.FIELD_TYPE, {
            is: Joi.valid(FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN),
            then: Joi.object({
                customLookupId: Joi.string().required().label(FIELD_TYPE_IDS.LOOKUP_ID.LABEL),
            }).label(FIELD_TYPE_IDS.LOOKUP_ID.LABEL),
        }),

    };

    if (isDocumentGeneration) {
        baseSchema.fieldType = Joi.optional().label(FIELD_TYPE_IDS.FIELD_TYPE.LABEL);
    }
    return constructJoiObject(baseSchema);
};

export const tableFieldNameSchema = (t = translateFunction) => {
    const schema = Joi.object({
        fieldName: Joi.string()
            .required()
            .regex(FIELD_NAME_REGEX)
            .min(FLOW_MIN_MAX_CONSTRAINT.FIELD_NAME_MIN_VALUE)
            .max(FLOW_MIN_MAX_CONSTRAINT.FIELD_NAME_MAX_VALUE)
            .trim()
            .label(FIELD_TYPE_IDS.FIELD_NAME.LABEL)
            .messages({ [VALIDATION_ERROR_TYPES.REGEX]: VALIDATION_STRINGS(t).FIELD_NAME_REGEX_ERROR }),
    });
    return schema;
};
