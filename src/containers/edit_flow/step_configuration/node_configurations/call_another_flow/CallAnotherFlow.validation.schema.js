import Joi from 'joi';
import { FIELD_TYPE, PROPERTY_PICKER_ARRAY } from '../../../../../utils/constants/form.constant';
import { translateFunction } from '../../../../../utils/jsUtility';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { staticValueSchema } from '../../StepConfiguration.validations';
import { FIELD_VALUE_TYPES } from '../row_components/RowComponents.constants';
import { getSchemaForActiveRow } from '../row_components/RowComponents.utils';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';

export const FIELD_MATCH_CATEGORY = {
    NUMBER_CATEGORY: [FIELD_TYPE.NUMBER],
    CURRENCY_CATEGORY: [FIELD_TYPE.CURRENCY],
    NUMBER_CURRENCY_CATEGORY: [FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY],
    SINGLE_TEXT_FIELDS: [FIELD_TYPE.SINGLE_LINE, FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN, FIELD_TYPE.PARAGRAPH],
    SINGLE_SELECTION_FIELDS: [FIELD_TYPE.DROPDOWN, FIELD_TYPE.RADIO_GROUP],
    MULTI_SELECTION_FIELDS: [FIELD_TYPE.CHECKBOX],
    ALL_SELECTION_FIELDS: [FIELD_TYPE.DROPDOWN, FIELD_TYPE.RADIO_GROUP, FIELD_TYPE.CHECKBOX],
    SINGLE_SELECTION_TEXT_CATEGORY: [FIELD_TYPE.SINGLE_LINE, FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN, FIELD_TYPE.DROPDOWN, FIELD_TYPE.RADIO_GROUP, FIELD_TYPE.PARAGRAPH], // text, para and csd
    SINGLE_SELECTION_NUMBER_CATEGORY: [FIELD_TYPE.NUMBER, FIELD_TYPE.DROPDOWN, FIELD_TYPE.RADIO_GROUP], // number
};

export const getFieldTypeBasedSchemaForSubFlow = () => {
    return {
        is_deleted: Joi.optional(),
        valueType: getSchemaForActiveRow(
            Joi.string().required().valid(
                FIELD_VALUE_TYPES.STATIC,
                FIELD_VALUE_TYPES.DYNAMIC,
                FIELD_VALUE_TYPES.SYSTEM,
                FIELD_VALUE_TYPES.ITERATIVE,
                FIELD_VALUE_TYPES.MAP_ENTRY,
                FIELD_VALUE_TYPES.USER_ENTRY,
            ),
        ),
        fieldType: getSchemaForActiveRow(Joi.when('valueType', {
            is: [FIELD_VALUE_TYPES.DYNAMIC, FIELD_VALUE_TYPES.SYSTEM, FIELD_VALUE_TYPES.ITERATIVE],
            then: Joi.when(Joi.ref('fieldDetails.fieldType'), {
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
                                // otherwise: Joi.string().valid(...FIELD_MATCH_CATEGORY.MULTI_SELECTION_FIELDS).messages({
                                //     'any.only': 'Type Mismatch',
                                // }),
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

const constructFieldMappingSchema = (depth, t = translateFunction) => Joi.object().keys({
    ...getFieldTypeBasedSchemaForSubFlow(),
    fieldUuid: getSchemaForActiveRow(Joi.string().required().label('Field')),
    valueType: getSchemaForActiveRow(Joi.string().required().valid(FIELD_VALUE_TYPES.STATIC, FIELD_VALUE_TYPES.DYNAMIC, FIELD_VALUE_TYPES.SYSTEM, FIELD_VALUE_TYPES.ITERATIVE, FIELD_VALUE_TYPES.MAP_ENTRY, FIELD_VALUE_TYPES.USER_ENTRY)),
    value: getSchemaForActiveRow(Joi.when('valueType', {
        is: Joi.valid(FIELD_VALUE_TYPES.MAP_ENTRY, FIELD_VALUE_TYPES.USER_ENTRY),
        then: Joi.optional(),
        otherwise: Joi.when('valueType', {
            is: FIELD_VALUE_TYPES.STATIC,
            then: staticValueSchema(t, null, 'fieldType', {}),
            otherwise: Joi.string().required().label('Value'),
        }),
    })),
    tableUuid: Joi.optional(),
    path: Joi.optional(),
    _id: Joi.optional(),
    label: Joi.optional(),
    fieldListType: Joi.optional(),
    choiceValues: Joi.optional(),
    tableColumnMapping: (depth > 1) ? Joi.optional() : getSchemaForActiveRow(Joi.array().when('fieldType', {
        is: FIELD_TYPE.TABLE,
        then: Joi.array().items(
            constructFieldMappingSchema(depth + 1, t),
        ),
        otherwise: Joi.forbidden(),
    })),
});

export const triggerMappingSchema = (t = translateFunction) => (
    Joi
        .array()
        .items(constructFieldMappingSchema(0, t))
        .optional()
);

export const triggerStepValidationSchema = (t = translateFunction) => {
    const basicNodeSchema = basicNodeValidationSchema(t);
    return constructJoiObject({
        ...basicNodeSchema,
        childFlowUuid: Joi.string().required().label('Sub-Flow'),
        cancelWithParent: Joi.bool().required(),
        isAsync: Joi.bool().required(),
        isMni: Joi.bool().required(),
        mniUuid: Joi.when('isMni', {
            is: true,
            then: Joi.string().required().label('Iterate Field'),
            otherwise: Joi.optional(),
        }),
        mapping: Joi.array().optional(),
    });
};
