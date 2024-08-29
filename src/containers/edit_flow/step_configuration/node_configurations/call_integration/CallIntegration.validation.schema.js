import Joi from 'joi';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { translateFunction, isEmpty } from '../../../../../utils/jsUtility';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { CALL_INTEGRATION_STRINGS } from './CallIntegration.strings';
import {
  CALL_INTEGRATION_CONSTANTS,
  RESPONSE_FIELD_KEYS,
} from './CallIntegration.constants';
import { FIELD_VALUE_TYPES, ROW_COMPONENT_KEY_TYPES } from '../row_components/RowComponents.constants';
import { staticValueSchema } from '../../StepConfiguration.validations';

const getSchema = (currentSchema) =>
  Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: currentSchema,
  });

const constructRequestBodySchema = (depth = 0, t = translateFunction) => {
  const { MAPPING } = CALL_INTEGRATION_STRINGS(t).GENERAL;
  return Joi.object().keys({
    key: Joi.string().required().label(MAPPING.REQUEST_BODY.TITLE),
    key_type: Joi.string().required(),
    is_required: Joi.boolean().required().label('Is Required'),
    is_multiple: Joi.boolean().required().label('Is Multiple'),
    keepChild: Joi.optional(),
    value: Joi.when('key_type', {
      is: 'object',
      then: Joi.when('is_multiple', {
        is: true,
        then: Joi.when('is_required', {
          is: true,
          then: Joi.when('type', {
            is: FIELD_VALUE_TYPES.STATIC,
            then: staticValueSchema(t, null, 'field_type', {}),
            otherwise: Joi.string().required().label(MAPPING.VALUE),
          }),
          otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
      }),
      otherwise: Joi.when('is_required', {
        is: true,
        then: Joi.when('type', {
          is: FIELD_VALUE_TYPES.STATIC,
          then: staticValueSchema(t, null, 'field_type', {}),
          otherwise: Joi.string().required().label(MAPPING.VALUE),
        }),
        otherwise: Joi.optional(),
      }),
    }),
    field_details: Joi.optional(),
    field_type: Joi.optional(),
    type: Joi.optional(),
    key_uuid: Joi.optional(),
    root_uuid: Joi.optional(),
    path: Joi.optional(),
    description: Joi.optional(),
    component_type: Joi.optional(),
    validations: Joi.optional(),
    child_rows:
      depth === 4
        ? Joi.optional()
        : Joi.when('key_type', {
            is: 'object',
            then: Joi.array().when('keepChild', {
              is: true,
              then: Joi.array()
                .items(constructRequestBodySchema(depth + 1, t))
                .has(
                  Joi.object()
                    .keys({
                      value: Joi.when('key_type', {
                        is: 'object',
                        then: Joi.when('is_multiple', {
                          is: true,
                          then: Joi.string().required(),
                          otherwise: Joi.optional(),
                        }),
                        otherwise: Joi.string().required(),
                      }),
                    })
                    .unknown(true),
                ),
              otherwise: Joi.optional(),
            }),
            otherwise: Joi.forbidden(),
          }),
  });
};

export const requestBodyValidationSchema = (t = translateFunction) =>
  Joi.array().items(constructRequestBodySchema(0, t));

const constructSaveResponseSchema = (depth = 0, t = translateFunction) => {
  const { MAPPING } = CALL_INTEGRATION_STRINGS(t).GENERAL;
  return Joi.object().keys({
    is_deleted: Joi.bool().required(),
    mappingInfo: getSchema(Joi.string().required().label('Response Key')),
    mappingFieldType: getSchema(Joi.string().required().label('Type')),
    value: getSchema(Joi.string().required().label(MAPPING.FIELD_VALUE)),
    fieldDetails: Joi.optional(),
    fieldType: Joi.optional(),
    path: Joi.optional(),
    key_uuid: Joi.optional(),
    root_uuid: Joi.optional(),
    columnMapping: getSchema(
      depth === 1
        ? Joi.optional()
        : Joi.when('fieldType', {
            is: ROW_COMPONENT_KEY_TYPES.TABLE,
            then: Joi.array()
              .required()
              .min(1)
              .label('Column mapping')
              .unique((a, b) => a.mappingInfo === b.mappingInfo)
              .items(constructSaveResponseSchema(depth + 1))
              .messages({
                'array.min': 'At least one column must be mapped',
                'any.required': 'At least one column must be mapped',
              }),
            otherwise: Joi.forbidden(),
          }),
    ),
  });
};

export const saveResponseValidationSchema = (t = translateFunction) =>
  Joi.array()
    .unique(
      (a, b) =>
        !isEmpty(a.mappingInfo) &&
        !a.is_deleted &&
        !b.is_deleted &&
        a.mappingInfo === b.mappingInfo,
    )
    .items(constructSaveResponseSchema(0, t));

export const eventHeadersValidationSchema = (t = translateFunction) => {
  const { MAPPING } = CALL_INTEGRATION_STRINGS(t).GENERAL;

  return Joi.array().items(
    Joi.object().keys({
      value: Joi.when(RESPONSE_FIELD_KEYS.IS_REQUIRED, {
        is: true,
        then: Joi.string().required().label(MAPPING.VALUE),
        otherwise: Joi.optional(),
      }),
      key: Joi.string().required(),
      type: Joi.when(RESPONSE_FIELD_KEYS.IS_REQUIRED, {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.optional(),
      }),
      keyUuid: Joi.string().required(),
      isRequired: Joi.boolean().required(),
    }),
  );
};

export const relativePathValidationSchema = (t = translateFunction) => {
  const { MAPPING } = CALL_INTEGRATION_STRINGS(t).GENERAL;

  return Joi.array().items(
    Joi.object().keys({
      pathName: Joi.string().required(),
      value: Joi.when(RESPONSE_FIELD_KEYS.IS_REQUIRED, {
        is: true,
        then: Joi.string().required().label(MAPPING.VALUE),
        otherwise: Joi.optional(),
      }),
      type: Joi.when(RESPONSE_FIELD_KEYS.IS_REQUIRED, {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.optional(),
      }),
      isRequired: Joi.boolean().required(),
    }),
  );
};

export const queryParamValidationSchema = (t = translateFunction) => {
  const { MAPPING } = CALL_INTEGRATION_STRINGS(t).GENERAL;
  return Joi.array().items(
    Joi.object().keys({
      value: Joi.when(RESPONSE_FIELD_KEYS.IS_REQUIRED, {
        is: true,
        then: Joi.string().required().label(MAPPING.VALUE),
        otherwise: Joi.optional(),
      }),
      key: Joi.string().required(),
      type: Joi.when(RESPONSE_FIELD_KEYS.IS_REQUIRED, {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.optional(),
      }),
      keyUuid: Joi.string().required(),
      isRequired: Joi.boolean().required(),
    }),
  );
};

export const integerationValidationSchema = (t = translateFunction) => {
  const { EXTERNAL_SYSTEM } = CALL_INTEGRATION_STRINGS(t).GENERAL;
  const { ERROR_HANDLING } = CALL_INTEGRATION_STRINGS(t);

  return constructJoiObject({
    ...basicNodeValidationSchema(t),
    connectorUuid: Joi.when(CALL_INTEGRATION_CONSTANTS.IS_ML_INTEGRATION, {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.string()
        .required()
        .label(EXTERNAL_SYSTEM.CHOOSE_INTEGRATION.LABEL),
    }),
    eventUuid: Joi.when(CALL_INTEGRATION_CONSTANTS.IS_ML_INTEGRATION, {
      is: true,
      then: Joi.optional(),
      otherwise: Joi.string().required().label(EXTERNAL_SYSTEM.EVENT.LABEL),
    }),
    modelId: Joi.when(CALL_INTEGRATION_CONSTANTS.IS_ML_INTEGRATION, {
      is: true,
      then: Joi.string()
        .required()
        .label(EXTERNAL_SYSTEM.CHOOSE_ML_MODEL.LABEL),
      otherwise: Joi.optional(),
    }),
    modelCode: Joi.when(CALL_INTEGRATION_CONSTANTS.IS_ML_INTEGRATION, {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
    relativePath: Joi.optional(),
    eventHeaders: Joi.optional(),
    queryParams: Joi.optional(),
    body: Joi.optional(),
    responseFormat: Joi.when(RESPONSE_FIELD_KEYS.IS_SAVE_RESPONSE, {
      is: true,
      then: Joi.array().min(1).required(),
      otherwise: Joi.optional(),
    }),
    retryAttempts: Joi.array().items(
      Joi.object().keys({
        duration: Joi.number()
        .integer()
        .min(CALL_INTEGRATION_CONSTANTS.RETRY_MIN_LIMIT)
        .max(CALL_INTEGRATION_CONSTANTS.RETRY_MAX_LIMIT)
        .required()
        .label(ERROR_HANDLING.RETRY.INPUT_LABEL),
        durationType: Joi.string(),
      }),
    ),
    isMLIntegration: Joi.optional(),
    isSaveResponse: Joi.optional(),
  });
};
