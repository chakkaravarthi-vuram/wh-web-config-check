import Joi from 'joi';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { translateFunction } from '../../../../../utils/jsUtility';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { FIELD_TYPE_IDS, RESPONSE_FIELD_KEYS, SEND_DATA_TO_DL_CONSTANTS } from './SendDataToDl.constants';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { SEND_DATA_TO_DL_CONFIG_CONSTANTS } from './SendDataToDl.string';
import { FIELD_VALUE_TYPES } from '../row_components/RowComponents.constants';
import { FIELD_TYPE, PROPERTY_PICKER_ARRAY } from '../../../../../utils/constants/form.constant';
import { getSchemaForActiveRow } from '../row_components/RowComponents.utils';
import { staticValueSchema } from '../../StepConfiguration.validations';
import { FIELD_MATCH_CATEGORY } from '../call_another_flow/CallAnotherFlow.validation.schema';

export const getFieldTypeBasedSchemaForDL = () => {
    return {
        is_deleted: Joi.optional(),
        valueType: getSchemaForActiveRow(
            Joi.string().required().valid(
                FIELD_VALUE_TYPES.STATIC,
                FIELD_VALUE_TYPES.DYNAMIC,
                FIELD_VALUE_TYPES.SYSTEM,
                FIELD_VALUE_TYPES.ITERATIVE,
            ),
        ),
        mappingType: getSchemaForActiveRow(Joi.string().required()),
        fieldType: getSchemaForActiveRow(Joi.when('valueType', {
            is: [FIELD_VALUE_TYPES.DYNAMIC, FIELD_VALUE_TYPES.SYSTEM, FIELD_VALUE_TYPES.ITERATIVE],
            then: Joi.when('mappingType', {
                is: SEND_DATA_TO_DL_CONSTANTS.DIRECT_TO_TABLE_MAPPING_TYPE,
                then: Joi.optional(),
                otherwise: Joi.when(Joi.ref('fieldDetails.fieldType'), {
                    is: Joi.exist(),
                    then: Joi.when(Joi.ref('fieldDetails.fieldType'), {
                        is: PROPERTY_PICKER_ARRAY,
                        then: Joi.alternatives().conditional(Joi.ref('fieldDetails.propertyFieldType'), {
                            switch: [
                                {
                                    is: FIELD_MATCH_CATEGORY.NUMBER_CURRENCY_CATEGORY,
                                    then: Joi.alternatives().conditional(Joi.ref('choiceValueType'), {
                                        switch: [
                                            {
                                                is: 'number',
                                                then: Joi.string().valid(...FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS).messages({
                                                    'any.only': 'Type Mismatch',
                                                }),
                                            },
                                        ],
                                        otherwise: Joi.string().valid(...FIELD_MATCH_CATEGORY.NUMBER_CURRENCY_CATEGORY).messages({
                                            'any.only': 'Type Mismatch',
                                        }),
                                    }),
                                },
                                {
                                    is: FIELD_MATCH_CATEGORY.SINGLE_TEXT_FIELDS,
                                    then: Joi.alternatives().conditional(Joi.ref('choiceValueType'), {
                                        switch: [
                                            {
                                                is: 'text',
                                                then: Joi.string().valid(...FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS).messages({
                                                    'any.only': 'Type Mismatch',
                                                }),
                                            },
                                        ],
                                        otherwise: Joi.string().valid(...FIELD_MATCH_CATEGORY.SINGLE_TEXT_FIELDS).messages({
                                            'any.only': 'Type Mismatch',
                                        }),
                                    }),
                                },
                                {
                                    is: FIELD_MATCH_CATEGORY.MULTI_SELECTION_FIELDS,
                                    then: Joi.alternatives().conditional(Joi.ref('fieldDetails.propertyChoiceValueType'), {
                                        switch: [
                                            {
                                                is: 'text',
                                                then: Joi.alternatives().conditional(Joi.ref('choiceValueType'), {
                                                    switch: [
                                                        {
                                                            is: 'text',
                                                            then: Joi.string().valid(...FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS).messages({
                                                                'any.only': 'Type Mismatch',
                                                            }),
                                                        },
                                                    ],
                                                    otherwise: Joi.string().valid(...FIELD_MATCH_CATEGORY.SINGLE_TEXT_FIELDS).messages({
                                                        'any.only': 'Type Mismatch',
                                                    }),
                                                }),
                                            },
                                            {
                                                is: 'number',
                                                then: Joi.alternatives().conditional(Joi.ref('choiceValueType'), {
                                                    switch: [
                                                        {
                                                            is: 'number',
                                                            then: Joi.string().valid(...FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS).messages({
                                                                'any.only': 'Type Mismatch',
                                                            }),
                                                        },
                                                    ],
                                                    otherwise: Joi.string().valid(...FIELD_MATCH_CATEGORY.NUMBER_CURRENCY_CATEGORY).messages({
                                                        'any.only': 'Type Mismatch',
                                                    }),
                                                }),
                                            },
                                        ],
                                    }),
                                },
                                {
                                    is: FIELD_MATCH_CATEGORY.SINGLE_SELECTION_FIELDS,
                                    then: Joi.alternatives().conditional(Joi.ref('fieldDetails.propertyChoiceValueType'), {
                                        switch: [
                                            {
                                                is: 'text',
                                                then: Joi.string().valid(...FIELD_MATCH_CATEGORY.SINGLE_SELECTION_TEXT_CATEGORY, ...FIELD_MATCH_CATEGORY.MULTI_SELECTION_FIELDS).messages({
                                                    'any.only': 'Type Mismatch',
                                                }),
                                            },
                                            {
                                                is: 'number',
                                                then: Joi.string().valid(...FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS, ...FIELD_MATCH_CATEGORY.NUMBER_CURRENCY_CATEGORY).messages({
                                                    'any.only': 'Type Mismatch',
                                                }),
                                            },
                                        ],
                                    }),
                                },
                            ],
                            otherwise: Joi.string().valid(Joi.ref('fieldDetails.propertyFieldType')).messages({
                                'any.only': 'Type Mismatch',
                            }),
                        }),
                        otherwise: Joi.alternatives().conditional(Joi.ref('fieldDetails.fieldType'), {
                            switch: [
                                {
                                    is: FIELD_MATCH_CATEGORY.NUMBER_CURRENCY_CATEGORY,
                                    then: Joi.alternatives().conditional(Joi.ref('choiceValueType'), {
                                        switch: [
                                            {
                                                is: 'number',
                                                then: Joi.string().valid(...FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS).messages({
                                                    'any.only': 'Type Mismatch',
                                                }),
                                            },
                                        ],
                                        otherwise: Joi.string().valid(...FIELD_MATCH_CATEGORY.NUMBER_CURRENCY_CATEGORY).messages({
                                            'any.only': 'Type Mismatch',
                                        }),
                                    }),
                                },
                                {
                                    is: FIELD_MATCH_CATEGORY.SINGLE_TEXT_FIELDS,
                                    then: Joi.alternatives().conditional(Joi.ref('choiceValueType'), {
                                        switch: [
                                            {
                                                is: 'text',
                                                then: Joi.string().valid(...FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS).messages({
                                                    'any.only': 'Type Mismatch',
                                                }),
                                            },
                                        ],
                                        otherwise: Joi.string().valid(...FIELD_MATCH_CATEGORY.SINGLE_TEXT_FIELDS).messages({
                                            'any.only': 'Type Mismatch',
                                        }),
                                    }),
                                },
                                {
                                    is: FIELD_MATCH_CATEGORY.MULTI_SELECTION_FIELDS,
                                    then: Joi.alternatives().conditional(Joi.ref('fieldDetails.choiceValueType'), {
                                        switch: [
                                            {
                                                is: 'text',
                                                then: Joi.alternatives().conditional(Joi.ref('choiceValueType'), {
                                                    switch: [
                                                        {
                                                            is: 'text',
                                                            then: Joi.string().valid(...FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS).messages({
                                                                'any.only': 'Type Mismatch',
                                                            }),
                                                        },
                                                    ],
                                                    otherwise: Joi.string().valid(...FIELD_MATCH_CATEGORY.SINGLE_TEXT_FIELDS).messages({
                                                        'any.only': 'Type Mismatch',
                                                    }),
                                                }),
                                            },
                                            {
                                                is: 'number',
                                                then: Joi.alternatives().conditional(Joi.ref('choiceValueType'), {
                                                    switch: [
                                                        {
                                                            is: 'number',
                                                            then: Joi.string().valid(...FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS).messages({
                                                                'any.only': 'Type Mismatch',
                                                            }),
                                                        },
                                                    ],
                                                    otherwise: Joi.string().valid(...FIELD_MATCH_CATEGORY.NUMBER_CURRENCY_CATEGORY).messages({
                                                        'any.only': 'Type Mismatch',
                                                    }),
                                                }),
                                            },
                                        ],
                                    }),
                                },
                                {
                                    is: FIELD_MATCH_CATEGORY.SINGLE_SELECTION_FIELDS,
                                    then: Joi.alternatives().conditional(Joi.ref('fieldDetails.choiceValueType'), {
                                        switch: [
                                            {
                                                is: 'text',
                                                then: Joi.string().valid(...FIELD_MATCH_CATEGORY.SINGLE_SELECTION_TEXT_CATEGORY, ...FIELD_MATCH_CATEGORY.MULTI_SELECTION_FIELDS).messages({
                                                    'any.only': 'Type Mismatch',
                                                }),
                                            },
                                            {
                                                is: 'number',
                                                then: Joi.string().valid(...FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS, ...FIELD_MATCH_CATEGORY.NUMBER_CURRENCY_CATEGORY).messages({
                                                    'any.only': 'Type Mismatch',
                                                }),
                                            },
                                        ],
                                    }),
                                },
                            ],
                            otherwise: Joi.string().valid(Joi.ref('fieldDetails.fieldType')).messages({
                                'any.only': 'Type Mismatch',
                            }),
                        }),
                    }),
                    otherwise: Joi.optional(),
                }),
            }),
            otherwise: Joi.optional(),
        })),
        choiceValueType: getSchemaForActiveRow(Joi.when('valueType', {
            is: [FIELD_VALUE_TYPES.DYNAMIC, FIELD_VALUE_TYPES.SYSTEM, FIELD_VALUE_TYPES.ITERATIVE],
            then: Joi.when(Joi.ref('fieldDetails.fieldType'), {
                is: PROPERTY_PICKER_ARRAY,
                then: Joi.alternatives().conditional(Joi.ref('fieldDetails.propertyFieldType'), {
                    switch: [
                        {
                            is: FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS,
                            then: Joi.when(Joi.ref('fieldType'), {
                                is: FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS,
                                then: Joi.string().valid(Joi.ref('fieldDetails.propertyChoiceValueType')).messages({
                                    'any.only': 'Type Mismatch',
                                }),
                            }),
                        },
                    ],
                    otherwise: Joi.optional(),
                }),
                otherwise: Joi.alternatives().conditional(Joi.ref('fieldDetails.fieldType'), {
                    switch: [
                        {
                            is: FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS,
                            then: Joi.when(Joi.ref('fieldType'), {
                                is: FIELD_MATCH_CATEGORY.ALL_SELECTION_FIELDS,
                                then: Joi.string().valid(Joi.ref('fieldDetails.choiceValueType')).messages({
                                    'any.only': 'Type Mismatch',
                                }),
                            }),
                        },
                    ],
                    otherwise: Joi.optional(),
                }),
            }),
            otherwise: Joi.optional(),
        })),
        dataListDetails: getSchemaForActiveRow(Joi.when('fieldType', {
            is: FIELD_TYPE.DATA_LIST,
            then: Joi.when('valueType', {
                is: FIELD_VALUE_TYPES.DYNAMIC,
                then: Joi.when('value', {
                    is: EMPTY_STRING,
                    then: Joi.optional(),
                    otherwise: Joi.object().keys({
                        dataListUuid: Joi.string().valid(
                            Joi.ref('...fieldDetails.dataListDetails.dataListUuid'),
                        ).messages({
                            'any.only': 'Datalist Mismatch',
                        }),
                    }).unknown(true),
                }),
                otherwise: Joi.optional(),
            }),
            otherwise: Joi.optional(),
        })),
        fieldDetails: getSchemaForActiveRow(Joi.when('valueType', {
            is: [FIELD_VALUE_TYPES.DYNAMIC, FIELD_VALUE_TYPES.SYSTEM],
            then: Joi.when('value', {
                is: Joi.string(),
                then: Joi.object().keys({
                    fieldType: Joi.string(),
                    choiceValueType: Joi.string(),
                    propertyFieldType: Joi.string().allow(null),
                    propertyChoiceValueType: Joi.string().allow(null),
                }).unknown(true),
                otherwise: Joi.optional(),
            }),
            otherwise: Joi.optional(),
        })),
    };
};

const constructFieldMappingSchema = (depth, t = translateFunction, options = {}) => Joi.object().keys({
    ...getFieldTypeBasedSchemaForDL(),
    fieldUuid: getSchemaForActiveRow(Joi.string().required().label('Field')),
    value: getSchemaForActiveRow(
        Joi.when('mappingType', {
            is: SEND_DATA_TO_DL_CONSTANTS.DIRECT_TO_TABLE_MAPPING_TYPE,
            then: Joi.optional(),
            otherwise: Joi.when('valueType', {
                is: FIELD_VALUE_TYPES.STATIC,
                then: staticValueSchema(t, options.maximumFileSize, 'fieldType', {}, true),
                otherwise: Joi.string().required().label('Value'),
            }),
        }),
    ),
    updateType: Joi.string().optional(),
    tableUuid: Joi.optional(),
    path: Joi.optional(),
    _id: Joi.optional(),
    label: Joi.optional(),
    fieldListType: Joi.optional(),
    choiceValues: Joi.optional(),
    mappingOrder: Joi.optional(),
    operation: Joi.optional(),
    tableColumnMapping: getSchemaForActiveRow((depth > 1) ?
        Joi.optional() :
        Joi.array().when('fieldType', {
            is: FIELD_TYPE.TABLE,
            then: Joi.array().min(1).items(
                constructFieldMappingSchema(depth + 1, t),
            ),
            otherwise: Joi.forbidden(),
        })),
});

export const triggerMappingSchema = (t = translateFunction, options = {}) => (Joi.array()
    .items(constructFieldMappingSchema(0, t, options)));

const dataListMappingSchemaBase = (t = translateFunction) => {
    return {
        dataListUuid: Joi.string().required().label(FIELD_TYPE_IDS.DATA_LIST_UUID.LABEL),
        dataListEntryActionType: Joi.string().required().label(FIELD_TYPE_IDS.DATA_LIST_ENTRY_ACTION_TYPE.LABEL),
        isAutoUpdate: Joi.when(RESPONSE_FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE, {
            is: Joi.valid(SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).ID.CREATE_MULTIPLE_NEW_ENTRY, SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).ID.CREATE_NEW_ENTRY),
            then: Joi.boolean().required().label(FIELD_TYPE_IDS.IS_AUTO_UPDATE.LABEL),
            otherwise: Joi.optional(),
        }),
        mappingUuid: Joi.string().optional().allow(EMPTY_STRING).label(FIELD_TYPE_IDS.MAPPING_UUID.LABEL),
        saveResponse: Joi.boolean().required().label(FIELD_TYPE_IDS.SAVE_RESPONSE.LABEL),
        saveResponseField: Joi.when(RESPONSE_FIELD_KEYS.SAVE_RESPONSE, {
            is: Joi.valid(true),
            then: Joi.string().required().label(FIELD_TYPE_IDS.SAVE_RESPONSE_FIELD.LABEL),
            otherwise: Joi.optional(),
        }),
        tableUuid: Joi.when(RESPONSE_FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE, {
            is: Joi.valid(SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).ID.CREATE_MULTIPLE_NEW_ENTRY),
            then: Joi.string().required().label(FIELD_TYPE_IDS.TABLE_UUID.LABEL),
            otherwise: Joi.optional(),
        }),
        pickerFieldUuid: Joi.when(RESPONSE_FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE, {
            is: Joi.valid(SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).ID.UPDATE_ENTRIES, SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).ID.DELETE_ENTRIES),
            then: Joi.string().required().label(FIELD_TYPE_IDS.PICKER_FIELD_UUID.LABEL),
            otherwise: Joi.optional(),
        }),
        mapping: Joi.when(RESPONSE_FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE, {
            is: SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).ID.DELETE_ENTRIES,
            then: Joi.optional(),
            otherwise: Joi.array().min(1).required().label(FIELD_TYPE_IDS.MAPPING.LABEL),
        }),
        isSystemDefined: Joi.optional(),
        systemDefinedName: Joi.optional(),
    };
};

const dataListMappingSchema = (isAddOnConfig, t = translateFunction) => {
    if (isAddOnConfig) {
        return {
            ...dataListMappingSchemaBase(t),
            actionUuid: Joi.array().required().min(1).label(FIELD_TYPE_IDS.ACTION_UUID.LABEL)
                .messages({ 'array.min': 'Atleast one action button is required' }),
        };
    } else {
        return {
            ...dataListMappingSchemaBase(t),
        };
    }
};

export const sendDataToDlValidationSchema = (isAddOnConfig, t = translateFunction) => {
    const basicValidationData = basicNodeValidationSchema(t);
    delete basicValidationData.stepId;
    delete basicValidationData.stepOrder;
    return constructJoiObject({
        ...isAddOnConfig ? {
            stepId: Joi.string().required(),
            stepUuid: Joi.string().required(),
        } : basicValidationData,
        _id: Joi.string().optional(),
        stepUuid: Joi.string().optional(),
        flowId: Joi.string().required(),
        dataListMapping: Joi.object().keys(dataListMappingSchema(isAddOnConfig, t)).required().label(FIELD_TYPE_IDS.DATA_LIST_MAPPING.LABEL),
    });
};
