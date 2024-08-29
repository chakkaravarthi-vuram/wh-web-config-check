import Joi from 'joi';
import { isEmpty } from 'utils/jsUtility';
import { constructJoiObject } from '../../../utils/ValidationConstants';
import {
  DATA_LIST_CONSTANTS,
  FIELD_IDS,
  OUTPUT_FORMAT_CONSTANTS,
  OUTPUT_FORMAT_KEY_TYPES,
  VALIDATION_CONSTANTS,
} from './ExternalSource.constants';
import {
  DATALIST_STRINGS,
  DATA_SOURCE,
  DATA_SOURCE_TYPES,
  EXTERNAL_SOURCE_STRINGS,
  INTEGRATION_STRINGS,
} from './ExternalSource.strings';
import { FIELD_LIST_TYPE } from '../../../utils/constants/form.constant';
import { translateFunction } from '../../../utils/jsUtility';
import { FIELD_NAME_REGEX } from '../../../utils/strings/Regex';
import { VALIDATION_ERROR_TYPES } from '../../../utils/strings/CommonStrings';

const getSchema = (currentSchema) =>
  Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: currentSchema,
  });

const getRelativePathValidationSchema = () =>
  Joi.object().keys({
    is_deleted: Joi.boolean(),
    path_name: getSchema(
      Joi.string().required().label(INTEGRATION_STRINGS.RELATIVE_PATH.PATHNAME),
    ),
    value: getSchema(
      Joi.when('isRequired', {
        is: true,
        then: Joi.string()
          .required()
          .label(INTEGRATION_STRINGS.RELATIVE_PATH.VALUE)
          .min(VALIDATION_CONSTANTS.COMMON_MIN_CHAR)
          .max(VALIDATION_CONSTANTS.COMMON_MAX_CHAR),
        otherwise: Joi.optional(),
      }),
    ),
    type: getSchema(
      Joi.when('isRequired', {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.optional(),
      }),
    ),
    isRequired: getSchema(Joi.boolean()),
  });

const getQueryParamsValidationSchema = () =>
  Joi.object().keys({
    is_deleted: Joi.boolean(),
    key: getSchema(
      Joi.string().required().label(INTEGRATION_STRINGS.QUERY_PARAMS.KEY),
    ),
    value: getSchema(
      Joi.when('isRequired', {
        is: true,
        then: Joi.string()
          .required()
          .label(INTEGRATION_STRINGS.QUERY_PARAMS.VALUE)
          .min(VALIDATION_CONSTANTS.COMMON_MIN_CHAR)
          .max(VALIDATION_CONSTANTS.COMMON_MAX_CHAR),
        otherwise: Joi.optional(),
      }),
    ),
    type: getSchema(
      Joi.when('isRequired', {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.optional(),
      }),
    ),
    isRequired: getSchema(Joi.boolean()),
    key_uuid: Joi.string().required(),
  });

const getUniqueRowOrNot = (a = {}, b = {}) => {
  if (!isEmpty(a.name) && !a.is_deleted && !b.is_deleted && a.name === b.name) {
    return true;
  } else if (!isEmpty(a.key) && !a.is_deleted && !b.is_deleted && a.key === b.key) {
    return true;
  } else {
    return false;
  }
};

export const constructOutputFormatSchema = (depth = 0, t = translateFunction, outputFormatKeys = [], selectedExternalSource) =>
  Joi.object().keys({
    [OUTPUT_FORMAT_CONSTANTS.KEY_ID]: getSchema(
      Joi.string().required().label(OUTPUT_FORMAT_CONSTANTS.KEY_ID).label(outputFormatKeys[0]),
    ),
    [OUTPUT_FORMAT_CONSTANTS.TYPE_ID]: getSchema(
      Joi.string().required().label(OUTPUT_FORMAT_CONSTANTS.TYPE_ID).label(outputFormatKeys[1]),
    ),
    [OUTPUT_FORMAT_CONSTANTS.VALUE_TYPE]: getSchema(
      Joi.string().optional(),
    ),
    [OUTPUT_FORMAT_CONSTANTS.NAME_ID]: getSchema(
        Joi.string()
          .regex(FIELD_NAME_REGEX)
          .required()
          .label(OUTPUT_FORMAT_CONSTANTS.NAME_ID)
          .min(VALIDATION_CONSTANTS.COMMON_MIN_CHAR)
          .max(VALIDATION_CONSTANTS.COMMON_MAX_CHAR)
          .messages({
            [VALIDATION_ERROR_TYPES.REGEX]: t('form_field_strings.field_config.label.invalid_error'),
          })
          .label(outputFormatKeys[2] || 'Label'),
    ),
    key_uuid: getSchema(Joi.string().required()),
    root_uuid: Joi.optional(),
    is_deleted: Joi.optional(),
    path: Joi.optional(),
    field_details: Joi.optional(),
    [OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING]: getSchema(
      depth > OUTPUT_FORMAT_CONSTANTS.MAX_DEPTH
        ? Joi.optional()
        : Joi.array().when(OUTPUT_FORMAT_CONSTANTS.TYPE_ID, {
          is: Joi.string().valid(
            OUTPUT_FORMAT_KEY_TYPES.OBJECT,
            FIELD_LIST_TYPE.TABLE,
          ),
          then: Joi.array()
            .unique(getUniqueRowOrNot)
            .items(constructOutputFormatSchema(depth + 1, t, outputFormatKeys, selectedExternalSource))
            .min(1)
            .required(),
          otherwise: Joi.forbidden(),
        }),
    ),
  });

export const getOutputFormatValidationSchema = (t = translateFunction, outputFormatKeys = [], selectedExternalSource = DATA_SOURCE_TYPES.DATA_LIST) =>
  Joi.array()
    .unique(getUniqueRowOrNot)
    .items(constructOutputFormatSchema(0, t, outputFormatKeys, selectedExternalSource));

export const commonValidationSchema = (t) => {
  return {
    [FIELD_IDS.EXTERNAL_SOURCE]: Joi.string().required().label(t(DATA_SOURCE)),
    [FIELD_IDS.SOURCE_NAME]: Joi.string()
      .required()
      .label(t(EXTERNAL_SOURCE_STRINGS.RULE_NAME.LABEL))
      .min(VALIDATION_CONSTANTS.COMMON_MIN_CHAR)
      .max(VALIDATION_CONSTANTS.COMMON_MAX_CHAR),
  };
};

export const getIntegrationValidationSchema = (t) =>
  constructJoiObject({
    ...commonValidationSchema(t),
    [FIELD_IDS.CONNECTOR_UUID]: Joi.string()
      .required()
      .label(INTEGRATION_STRINGS.CHOOSE_INTEGRATION.LABEL),
    [FIELD_IDS.EVENT_UUID]: Joi.string()
      .required()
      .label(INTEGRATION_STRINGS.CHOOSE_EVENT.LABEL),
    [FIELD_IDS.RELATIVE_PATH]: Joi.array().items(
      getRelativePathValidationSchema(),
    ),
    [FIELD_IDS.QUERY_PARAMS]: Joi.array().items(
      getQueryParamsValidationSchema(),
    ),
    [FIELD_IDS.OUTPUT_FORMAT]: Joi.array().min(1),
  });

export const getDataListValidationSchema = (t = translateFunction) =>
  constructJoiObject({
    ...commonValidationSchema(t),
    [FIELD_IDS.DATA_LIST_UUID]: Joi.string()
      .required()
      .label(t(DATALIST_STRINGS.CHOOSE_DATALIST.ERROR_LABEL)),
    [FIELD_IDS.OUTPUT_FORMAT]: Joi.array().min(1),
    [FIELD_IDS.TYPE]: Joi.valid(...Object.values(DATA_LIST_CONSTANTS.QUERY_TYPE)),
    [FIELD_IDS.IS_LIMIT_FIELDS]: Joi.bool().optional(),
    [FIELD_IDS.QUERY_RESULT]: Joi.when('isLimitFields', {
      is: true,
      then: Joi.number().integer().min(2).required()
      .label(t('common_strings.value_label')),
      otherwise: Joi.optional(),
    }),
    [FIELD_IDS.TABLE_UUID]: Joi.when('type', {
      is: DATA_LIST_CONSTANTS.QUERY_TYPE.SUB_TABLE_QUERY,
      then: Joi.string().required().label(t('common_strings.table_label')),
      otherwise: Joi.optional(),
    }),
    [FIELD_IDS.DISTINCT_FIELD]: Joi.when('type', {
      is: DATA_LIST_CONSTANTS.QUERY_TYPE.DISTINCT,
      then: Joi.object().required()
      .label('Field'),
      otherwise: Joi.optional(),
    }),
  });
