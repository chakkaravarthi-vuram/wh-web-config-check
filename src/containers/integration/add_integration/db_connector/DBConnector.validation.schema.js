import Joi from 'joi';
import { translateFunction, isEmpty } from 'utils/jsUtility';
import {
  DB_CONNECTION_AUTHTICATION_STRINGS,
  DB_CONNECTION_QUERIES_STRINGS,
} from './DBConnector.strings';
import {
  DATA_TYPE,
  DB_TYPE,
  FILTER_OPERATOR,
  NUMERIC_TYPES,
} from './DBConnector.constant';
import {
  DATE_VALIDATION,
  INTEGRATION_NAME_VALIDATION,
} from '../../../../utils/ValidationConstants';

const getQuerySchema = (currentSchema) =>
  Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: currentSchema,
  });

const getSaveCloseSchema = (currentSchema) =>
  Joi.when('isSaveAndClose', {
    is: true,
    then: Joi.optional(),
    otherwise: currentSchema,
  });

export const dbConnectorAuthenticationSchema = (t = translateFunction) =>
  Joi.object().keys({
    db_type: Joi.string()
      .required()
      .label(DB_CONNECTION_AUTHTICATION_STRINGS(t).EXTERNAL_DB_TYPE.LABEL),
    db_connector_name: INTEGRATION_NAME_VALIDATION.required().label(
      DB_CONNECTION_AUTHTICATION_STRINGS(t).CONNECTOR_NAME.LABEL,
    ),
    db_name: getSaveCloseSchema(
      Joi.when('db_type', {
        is: DB_TYPE.ORACLE,
        then: Joi.optional(),
        otherwise: Joi.string()
          .required()
          .label(DB_CONNECTION_AUTHTICATION_STRINGS(t).DATABASE_NAME.LABEL),
      }),
    ),
    service_name: getSaveCloseSchema(
      Joi.when('db_type', {
        is: DB_TYPE.ORACLE,
        then: Joi.optional().label(
          DB_CONNECTION_AUTHTICATION_STRINGS(t).SERVICE_NAME.LABEL,
        ),
        otherwise: Joi.optional(),
      }),
    ),
    host: getSaveCloseSchema(
      Joi.string()
        .required()
        .label(DB_CONNECTION_AUTHTICATION_STRINGS(t).DATABASE_HOST_NAME.LABEL),
    ),
    port: getSaveCloseSchema(
      Joi.number()
        .required()
        .label(DB_CONNECTION_AUTHTICATION_STRINGS(t).PORT.LABEL),
    ),
    username: getSaveCloseSchema(
      Joi.string()
        .required()
        .label(DB_CONNECTION_AUTHTICATION_STRINGS(t).USERNAME.LABEL),
    ),
    password: getSaveCloseSchema(
      Joi.when('password_toggle', {
        is: true,
        then: Joi.string()
          .required()
          .label(DB_CONNECTION_AUTHTICATION_STRINGS(t).PASSWORD.LABEL),
        otherwise: Joi.when('is_credentials_saved', {
          is: true,
          then: Joi.forbidden(),
          otherwise: Joi.string()
            .required()
            .label(DB_CONNECTION_AUTHTICATION_STRINGS(t).PASSWORD.LABEL),
        }),
      }),
    ),
    query_count: Joi.when('isPublish', {
      is: true,
      then: Joi.number().min(1).required(),
      otherwise: Joi.optional(),
    }),
    password_toggle: Joi.boolean().optional(),
    password_preview: Joi.boolean().optional(),
    description: Joi.string(),
    is_connection_established: Joi.boolean().optional(),
    is_credentials_saved: Joi.boolean().optional(),
    isPublish: Joi.boolean().optional(),
    isSaveAndClose: Joi.boolean().optional(),
  });

const constructQueryConfigCommonSchema = (t = translateFunction) => {
  return {
    db_query_name: INTEGRATION_NAME_VALIDATION.required().label(
      DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.QUERY_NAME.LABEL,
    ),
    data_source_type: Joi.string()
      .required()
      .label(DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.QUERY_SOURCE.LABEL),
    table_name: Joi.string()
      .required()
      .label(DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.SOURCE_NAME.LABEL),
    query_action: Joi.number()
      .required()
      .label(DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.QUERY_ACTION.LABEL),
  };
};

export const dbConnectorQueryConfigCommonSchema = (t = translateFunction) =>
  Joi.object().keys({
    ...constructQueryConfigCommonSchema(t),
  });

export const constructSelectedFieldsSchema = (t = translateFunction) =>
  Joi.array()
    .min(1)
    .required()
    .custom((value, helpers) => {
      const hasValidItem = value.some((item) => !item.is_deleted);
      if (!hasValidItem) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .unique(
      (a, b) =>
        !isEmpty(a.display_name) &&
        !a.is_deleted &&
        !b.is_deleted &&
        a.display_name === b.display_name,
    )
    .items(
      Joi.object().keys({
        field_name: getQuerySchema(
          Joi.string()
            .required()
            .label(
              DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.FIELD_NAME.LABEL,
            ),
        ),
        field_type: getQuerySchema(
          Joi.optional().label(
            DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.FIELD_TYPE.LABEL,
          ),
        ),
        type_cast: getQuerySchema(
          Joi.string()
            .required()
            .label(
              DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.TYPE_CAST.LABEL,
            ),
        ),
        display_name: getQuerySchema(
          Joi.string()
            .required()
            .label(
              DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.DISPLAY_NAME.LABEL,
            ),
        ),
        path: getQuerySchema(Joi.string()),
        key_uuid: getQuerySchema(Joi.string()),
        key: getQuerySchema(Joi.string()),
        is_deleted: Joi.optional(),
      }),
    )
    .label(DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.FIELD_TO_FETCH_TITLE);

const getFilterValueSchema = (currentSchema, t) =>
  Joi.when('operator', {
    is: FILTER_OPERATOR.BETWEEN,
    then: currentSchema
      .min(2)
      .label(DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.VALUES.LABEL),
    otherwise: Joi.when('operator', {
      is: FILTER_OPERATOR.IN,
      then: currentSchema
        .min(1)
        .label(DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.VALUES.LABEL),
      otherwise: currentSchema
        .min(1)
        .max(1)
        .label(DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.VALUES.LABEL),
    }),
  });

export const constructSelectedFiltersSchema = (t = translateFunction) =>
  Joi.array()
    .unique(
      (a, b) =>
        !isEmpty(a.key) && !a.is_deleted && !b.is_deleted && a.key === b.key,
    )
    .items(
      Joi.object().keys({
        field_name: getQuerySchema(
          Joi.string()
            .required()
            .label(
              DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.FIELD_NAME.LABEL,
            ),
        ),
        field_type: getQuerySchema(
          Joi.optional().label(
            DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.FIELD_TYPE.LABEL,
          ),
        ),
        operator: getQuerySchema(
          Joi.string()
            .required()
            .label(
              DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.OPERATOR.LABEL,
            ),
        ),
        values: getQuerySchema(
          Joi.when('field_type', {
            is: Joi.string().valid(...NUMERIC_TYPES),
            then: getFilterValueSchema(
              Joi.array()
                .items(
                  Joi.number().label(
                    DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.VALUES.LABEL,
                  ),
                )
                .required(),
              t,
            ),
            otherwise: Joi.when('field_type', {
              is: Joi.string().valid(...DATA_TYPE),
              then: getFilterValueSchema(
                Joi.array()
                  .items(
                    DATE_VALIDATION.label(
                      DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.VALUES
                        .LABEL,
                    ),
                  )
                  .required(),
                t,
              ),
              otherwise: getFilterValueSchema(
                Joi.array()
                  .items(
                    Joi.string().label(
                      DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.VALUES
                        .LABEL,
                    ),
                  )
                  .required(),
                t,
              ),
            }),
          }),
        ),
        path: getQuerySchema(Joi.string()),
        key_uuid: getQuerySchema(Joi.string()),
        key: getQuerySchema(Joi.string()),
        is_deleted: Joi.optional(),
      }),
    );

const constructSortFieldsSchema = (t = translateFunction) =>
  Joi.object()
    .keys({
      field_name: Joi.string()
        .required()
        .label(
          DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.SORT_PARAMETERS
            .SORT_DATA_BY.LABEL,
        ),
      display_name: Joi.string(),
      order_type: Joi.string()
        .required()
        .label(
          DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.SORT_PARAMETERS
            .SORT_TYPE.LABEL,
        ),
    })
    .required();

export const dbConnectorQueryConfigSchema = (t = translateFunction) =>
  Joi.object().keys({
    ...constructQueryConfigCommonSchema(t),
    selected_fields: Joi.optional(),
    selected_filters: Joi.optional(),
    sort_fields: constructSortFieldsSchema(),
    skip_data: Joi.number()
      .min(0)
      .required()
      .label(
        DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.SORT_PARAMETERS.SKIP
          .LABEL,
      ),
    limit_data: Joi.number()
      .min(1)
      .max(100)
      .required()
      .label(
        DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.SORT_PARAMETERS.LIMIT
          .LABEL,
      ),
    isColumnFetched: Joi.boolean().optional(),
    isTestSuccess: Joi.boolean().optional(),
    _id: Joi.string().optional(),
    db_query_uuid: Joi.string().optional(),
    db_type: Joi.string().optional(),
    version_number: Joi.number().optional(),
    status: Joi.string().optional(),
    is_active: Joi.boolean().optional(),
  });
