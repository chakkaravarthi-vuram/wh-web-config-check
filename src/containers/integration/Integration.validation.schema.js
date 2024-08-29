import Joi from 'joi';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { isEmpty } from 'utils/jsUtility';
import {
  INTEGRATION_DESCRIPTION_VALIDATION,
  STEP_NAME_VALIDATION,
} from 'utils/ValidationConstants';
import {
  AUTHENTICATION_TYPE_CONSTANTS,
  INTEGRATION_STRINGS,
  REQ_BODY_KEY_TYPES,
} from './Integration.utils';
import { CREATE_INTEGRATION, FEATURE_INTEGRATION_STRINGS, INTEGRATION_ERROR_STRINGS, OAUTH_CRED_LABELS, SCOPE_REQUIRED_ERROR, TEST_INTEGRATION_STRINGS, WORKHALL_API_STRINGS } from './Integration.strings';
import { translateFunction } from '../../utils/jsUtility';
import { API_CONFIG_DESCRIPTION_VALIDATION, API_CONFIG_NAME_VALIDATION, constructJoiObject, CREDENTIAL_DESCRIPTION_VALIDATION, CREDENTIAL_NAME_VALIDATION, INTEGRATION_NAME_VALIDATION } from '../../utils/ValidationConstants';
import { INTEGRATION_CONSTANTS, REQ_BODY_NESTED_LEVEL, RES_BODY_NESTED_LEVEL, VALIDATION_CONSTRAINTS, WH_API_TYPES, WORKHALL_AUTH_TYPE } from './Integration.constants';
import { ACCOUNT_AND_DOMAIN_NAME_REGEX, INTEGRATION_RESPONSE_BODY_LABEL, WORKHALL_API_END_POINT_REGEX } from '../../utils/strings/Regex';

const getSchema = (currentSchema) =>
  Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: currentSchema,
  });

const integrationNameAndSecuritySchema = (t = () => { }, api_type) => {
  let nameSchema = null;
  if (api_type === INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL) {
    nameSchema = INTEGRATION_NAME_VALIDATION.required().label(
      t(FEATURE_INTEGRATION_STRINGS.INTEGRATION_NAME),
    );
  } else if (api_type === INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION) {
    nameSchema = INTEGRATION_NAME_VALIDATION.required().label(
      t(FEATURE_INTEGRATION_STRINGS.DB_CONNECTOR_NAME),
    );
  } else {
    nameSchema = API_CONFIG_NAME_VALIDATION.required().label(
      t(FEATURE_INTEGRATION_STRINGS.INTEGRATION_NAME),
    );
  }
  return {
    name: nameSchema,
    description:
      api_type === INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL ||
      api_type === INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION
        ? INTEGRATION_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING).label(
            t(FEATURE_INTEGRATION_STRINGS.INTEGRATION_DESCRIPTION),
          )
        : API_CONFIG_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING).label(
            t(FEATURE_INTEGRATION_STRINGS.INTEGRATION_DESCRIPTION),
          ),
    admins: Joi.when('api_type', {
      is: INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION,
      then: Joi.optional(),
      otherwise: Joi.object()
        .keys({
          teams: Joi.array().items(),
          users: Joi.array().items(),
        })
        .label(CREATE_INTEGRATION.ADMINS.LABEL)
        .min(1)
        .messages({
          'object.min': CREATE_INTEGRATION.ADMINS_REQUIRED,
        }),
    }),
  };
};

export const commonIntegrationDetailsSchema = (t = () => { }, api_type) => {
  return {
    ...integrationNameAndSecuritySchema(t, api_type),
    api_type: Joi.string().required(),
    workhall_api_type: Joi.when('api_type', {
      is: INTEGRATION_CONSTANTS.API_TYPE.WORKHALL,
      then: Joi.number().required().label(CREATE_INTEGRATION.API_TYPE.READ_ONLY_LABEL),
      otherwise: Joi.optional(),
    }),
    selected_connector_name: Joi.when('api_type', {
      is: INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL,
      then: Joi.string().required().label(t(FEATURE_INTEGRATION_STRINGS.INTEGRATION_APP)),
      otherwise: Joi.optional(),
    }),
  };
};

export const basicDetailsIntegrationSchema = (t = () => { }, api_type) => constructJoiObject({
  ...commonIntegrationDetailsSchema(t, api_type),
});

export const clientCredentialValidationSchema = (t = translateFunction) =>
  Joi.object().keys({
    credential_name: CREDENTIAL_NAME_VALIDATION.required().label(OAUTH_CRED_LABELS(t).CREDENTIAL_NAME)
      .regex(ACCOUNT_AND_DOMAIN_NAME_REGEX),
    credential_description: CREDENTIAL_DESCRIPTION_VALIDATION.allow(
      null,
      EMPTY_STRING,
    ).label(OAUTH_CRED_LABELS(t).CREDENTIAL_DESCRIPTION),
    credential_scope: Joi.array().items(Joi.string()).min(1)
      .messages({
        'array.min': t(SCOPE_REQUIRED_ERROR),
      }),
  });

const headersSchema = (t = () => { }) => Joi.object().keys({
  is_deleted: Joi.boolean(),
  key: getSchema(
    Joi.string().max(VALIDATION_CONSTRAINTS.EXTERNAL_INTEGRATION.HEADER_KEY).required().label(t(INTEGRATION_STRINGS.HEADERS.KEY.LABEL)),
  ),
  value: getSchema(
    Joi.string().max(VALIDATION_CONSTRAINTS.EXTERNAL_INTEGRATION.HEADER_VALUE).required().label(t(INTEGRATION_STRINGS.HEADERS.VALUE.LABEL)),
  ),
});

const queryParamsScehma = (t = () => { }) => Joi.object().keys({
  is_deleted: Joi.boolean(),
  key: getSchema(
    Joi.string().max(VALIDATION_CONSTRAINTS.EXTERNAL_INTEGRATION.QUERY_PARAMS_KEY).required().label(t(INTEGRATION_STRINGS.QUERY_PARAMS.KEY.LABEL)),
  ),
  value: getSchema(
    Joi.string().max(VALIDATION_CONSTRAINTS.EXTERNAL_INTEGRATION.QUERY_PARAMS_VALUE).required().label(t(INTEGRATION_STRINGS.QUERY_PARAMS.VALUE.LABEL)),
  ),
});

const eventsParamsHeadersSchema = (t = () => { }) => Joi.object().keys({
  is_deleted: Joi.boolean(),
  key: getSchema(
    Joi.string().max(VALIDATION_CONSTRAINTS.EXTERNAL_INTEGRATION.QUERY_PARAMS_KEY).required().label(t(INTEGRATION_STRINGS.QUERY_PARAMS.KEY.LABEL)),
  ),
  is_required: getSchema(
    Joi.boolean()
      .required()
      .label(t(INTEGRATION_STRINGS.ADD_EVENT.QUERY_PARAMS.IS_REQUIRED.LABEL)),
  ),
  key_uuid: Joi.optional(),
});

export const authenticationSchema = (t = () => { }) => Joi.object().keys({
  type: Joi.string()
    .required()
    .label(t(INTEGRATION_STRINGS.AUTHENTICATION.AUTHENTICATION_METHOD.LABEL)),
  hasSaved: Joi.boolean().optional(),
  username: Joi.string().when('type', {
    is: Joi.string().valid(
      AUTHENTICATION_TYPE_CONSTANTS.BASIC,
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_PASSWORD_GRANT,
    ),
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }).label(t(INTEGRATION_STRINGS.AUTHENTICATION.USERNAME.LABEL)),
  password: Joi.string().when('type', {
    is: Joi.string().valid(
      AUTHENTICATION_TYPE_CONSTANTS.BASIC,
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_PASSWORD_GRANT,
    ),
    then: Joi.string().when('hasSaved', {
      is: true,
      then: Joi.string().when('password_toggle', {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
      otherwise: Joi.string().required(),
    }),
    otherwise: Joi.forbidden(),
  }).label(t(INTEGRATION_STRINGS.AUTHENTICATION.PASSWORD.LABEL)),
  token: Joi.string().when('type', {
    is: AUTHENTICATION_TYPE_CONSTANTS.TOKEN,
    then: Joi.string().when('hasSaved', {
      is: true,
      then: Joi.string().when('token_toggle', {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
      otherwise: Joi.string().required(),
    }),
    otherwise: Joi.forbidden(),
  }).label(t(INTEGRATION_STRINGS.AUTHENTICATION.TOKEN.LABEL)),
  key: Joi.string().when('type', {
    is: AUTHENTICATION_TYPE_CONSTANTS.API_KEY,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }).label(t(INTEGRATION_STRINGS.AUTHENTICATION.KEY.LABEL)),
  value: Joi.string().when('type', {
    is: AUTHENTICATION_TYPE_CONSTANTS.API_KEY,
    then: Joi.string().when('hasSaved', {
      is: true,
      then: Joi.string().when('value_toggle', {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
      otherwise: Joi.string().required(),
    }),
    otherwise: Joi.forbidden(),
  }).label(t(INTEGRATION_STRINGS.AUTHENTICATION.VALUE.LABEL)),
  add_to: Joi.string().when('type', {
    is: AUTHENTICATION_TYPE_CONSTANTS.API_KEY,
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }).label(t(INTEGRATION_STRINGS.AUTHENTICATION.ADD_TO.LABEL)),
  client_id: Joi.string().when('type', {
    is: Joi.string().valid(
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE,
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_CLIENT_CODE,
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_PASSWORD_GRANT,
    ),
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }).label(t(INTEGRATION_STRINGS.AUTHENTICATION.CLIENT_ID.LABEL)),
  client_secret: Joi.string().when('type', {
    is: Joi.string().valid(
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE,
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_CLIENT_CODE,
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_PASSWORD_GRANT,
    ),
    then: Joi.string().when('hasSaved', {
      is: true,
      then: Joi.string().when('client_secret_toggle', {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.string().optional(),
      }),
      otherwise: Joi.string().required(),
    }),
    otherwise: Joi.forbidden(),
  }).label(t(INTEGRATION_STRINGS.AUTHENTICATION.CLIENT_SECRET.LABEL)),
  scope: Joi.string().when('type', {
    is: Joi.string().valid(
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE,
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_CLIENT_CODE,
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_PASSWORD_GRANT,
    ),
    then: Joi.string().optional().allow(EMPTY_STRING, null),
    otherwise: Joi.forbidden(),
  }).label(t(INTEGRATION_STRINGS.AUTHENTICATION.SCOPE.LABEL)),
  token_request_url: Joi.string().when('type', {
    is: Joi.string().valid(
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE,
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_CLIENT_CODE,
      AUTHENTICATION_TYPE_CONSTANTS.OAUTH_PASSWORD_GRANT,
    ),
    then: Joi.string().uri().required()
      .messages({
        'string.uri': `${t(INTEGRATION_STRINGS.AUTHENTICATION.TOKEN_URL.LABEL)} ${t(FEATURE_INTEGRATION_STRINGS.VALID_URL_MESSAGE)}`,
      }),
    otherwise: Joi.forbidden(),
  }).label(t(INTEGRATION_STRINGS.AUTHENTICATION.TOKEN_URL.LABEL)),
  authorization_url: Joi.string().when('type', {
    is: AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE,
    then: Joi.string().uri().required()
      .messages({
        'string.uri': `${t(INTEGRATION_STRINGS.AUTHENTICATION.AUTH_URL.LABEL)} ${t(FEATURE_INTEGRATION_STRINGS.VALID_URL_MESSAGE)}`,
      }),
    otherwise: Joi.forbidden(),
  }).label(t(INTEGRATION_STRINGS.AUTHENTICATION.AUTH_URL.LABEL)),
  is_pkce: Joi.when('type', {
    is: AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE,
    then: Joi.bool(),
    otherwise: Joi.forbidden(),
  }).label(t(INTEGRATION_STRINGS.AUTHENTICATION.AUTH_URL.LABEL)),
  redirect_uri: Joi.string().optional(),
  is_update_auth_base_url: Joi.boolean().optional(),
  header_prefix: Joi.string().optional(),
  code: Joi.string().optional(),
  authorization_status: Joi.number().optional(),
  client_secret_preview: Joi.boolean().optional(),
  client_secret_toggle: Joi.boolean().optional(),
  password_preview: Joi.boolean().optional(),
  password_toggle: Joi.boolean().optional(),
  value_preview: Joi.boolean().optional(),
  value_toggle: Joi.boolean().optional(),
  token_preview: Joi.boolean().optional(),
  token_toggle: Joi.boolean().optional(),
  refresh_token_id: Joi.string().optional(),
  expiry_date: Joi.string().allow(null, EMPTY_STRING),
  refresh_token_generated_on: Joi.string().optional(),
  is_authorized: Joi.boolean().optional(),
  is_credentials_saved: Joi.boolean().optional(),
  challenge: Joi.optional(),
  challengeMethod: Joi.optional(),
  verifier: Joi.optional(),
  code_verifier: Joi.optional(),
});

export const verifyOauthSchema = (t = () => { }) => Joi.object().keys({
  authentication: authenticationSchema(t),
});

export const baseUrlSchema = (t) => {
  return {
  base_url: Joi.string()
    .required()
    .uri()
    .messages({
      'string.uri': `${t(INTEGRATION_STRINGS.AUTHENTICATION.BASE_URL.LABEL)} ${t(FEATURE_INTEGRATION_STRINGS.VALID_URL_MESSAGE)}`,
    })
    .label(t(INTEGRATION_STRINGS.AUTHENTICATION.BASE_URL.LABEL)),
  };
};

export const overallIntegrationValidationSchema = (t = () => { }) => Joi.object().keys({
  name: STEP_NAME_VALIDATION.required().label(
    t(INTEGRATION_STRINGS.ADD_INTEGRATION.INTEGRATION_NAME.LABEL),
  ),
  description: INTEGRATION_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING).label(
    t(INTEGRATION_STRINGS.ADD_INTEGRATION.INTEGRATION_DESCRIPTION.LABEL),
  ),
  ...baseUrlSchema(t),
  authentication: authenticationSchema(t),
  api_headers: Joi.bool().optional(),
  api_query_params: Joi.bool().optional(),
  headers: Joi.array().when('api_headers', {
    is: true,
    then: Joi.array()
      .items(headersSchema(t))
      .min(1)
      .unique((a, b) => (!isEmpty(a.key) && !a.is_deleted && !b.is_deleted) && a.key === b.key)
      .required()
      .label(t(INTEGRATION_STRINGS.HEADERS.LABEL)),
    otherwise: Joi.optional(),
  }),
  query_params: Joi.array().when('api_query_params', {
    is: true,
    then: Joi.array()
      .items(queryParamsScehma(t))
      .min(1)
      .unique((a, b) => (!isEmpty(a.key) && !a.is_deleted && !b.is_deleted) && a.key === b.key)
      .required()
      .label(t(INTEGRATION_STRINGS.QUERY_PARAMS.LABEL)),
    otherwise: Joi.optional(),
  }),
  events_count: Joi.when('isExternalIntegration', {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.number().invalid(0).label(t(INTEGRATION_STRINGS.ADD_EVENT.EVENT_HEADER)).required(),
  }),
  template_id: Joi.when('isExternalIntegration', {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
  isExternalIntegration: Joi.boolean().optional(),
  connector_uuid: Joi.string().optional(),
  _id: Joi.string().optional(),
});

const constructRequestBodySchema = (depth = 0, isRequired = null, t = translateFunction) =>
  Joi.object().keys({
    key: getSchema(Joi.string().max(VALIDATION_CONSTRAINTS.EXTERNAL_INTEGRATION.REQUEST_BODY_KEY).required().label(t(INTEGRATION_STRINGS.ADD_EVENT.REQUEST_BODY.KEY_INPUT.LABEL))),
    type: getSchema(Joi.string().required().label(t(INTEGRATION_STRINGS.ADD_EVENT.REQUEST_BODY.KEY_TYPE.LABEL))),
    is_required: isRequired ? getSchema(Joi.boolean().required().valid(true).label(t(INTEGRATION_STRINGS.ADD_EVENT.REQUEST_BODY.IS_REQUIRED.LABEL))) : getSchema(Joi.boolean().required().label(t(INTEGRATION_STRINGS.ADD_EVENT.REQUEST_BODY.IS_REQUIRED.LABEL))),
    is_multiple: getSchema(Joi.boolean().required().label(t(INTEGRATION_STRINGS.ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.LABEL))),
    key_uuid: getSchema(Joi.string().required()),
    root_uuid: Joi.optional(),
    is_deleted: Joi.optional(),
    description: Joi.optional(),
    path: Joi.optional(),
    child_rows:
      getSchema(
        depth > REQ_BODY_NESTED_LEVEL.MAX_DEPTH
          ? Joi.optional()
          : Joi.array()
            .when('type', {
              is: REQ_BODY_KEY_TYPES.OBJECT,
              then: Joi.array()
                .when('is_required', {
                  is: true,
                  then: Joi.array()
                    .unique((a, b) => (!isEmpty(a.key) && !a.is_deleted && !b.is_deleted) && a.key === b.key)
                    .items(constructRequestBodySchema(depth + 1, null, t))
                    .has(Joi.object({ is_required: Joi.boolean().valid(true) }).unknown())
                    .min(1)
                    .required(),
                  otherwise: Joi.array()
                    .unique((a, b) => (!isEmpty(a.key) && !a.is_deleted && !b.is_deleted) && a.key === b.key)
                    .items(constructRequestBodySchema(depth + 1, null, t))
                    .min(1)
                    .required(),
                }),
              otherwise: Joi.forbidden(),
            }),
      ),
  });

export const eventRequestBodyValidationSchema = (t = () => { }) => Joi.array()
  .unique((a, b) => (!isEmpty(a.key) && !a.is_deleted && !b.is_deleted) && a.key === b.key)
  .items(constructRequestBodySchema(0, null, t));

const constructResponseBodySchema = (depth = 0, t = translateFunction) =>
  Joi.object().keys({
    key: getSchema(Joi.string().max(VALIDATION_CONSTRAINTS.EXTERNAL_INTEGRATION.RESPONSE_BODY_KEY).required().label(t(INTEGRATION_STRINGS.ADD_EVENT.REQUEST_BODY.KEY_INPUT.LABEL))),
    type: getSchema(Joi.string().required().label(t(INTEGRATION_STRINGS.ADD_EVENT.REQUEST_BODY.KEY_TYPE.LABEL))),
    label: getSchema(
      Joi.string()
      .min(VALIDATION_CONSTRAINTS.EXTERNAL_INTEGRATION.MIN_RESPONSE_BODY_LABEL)
      .max(VALIDATION_CONSTRAINTS.EXTERNAL_INTEGRATION.RESPONSE_BODY_LABEL)
      .required()
      .regex(INTEGRATION_RESPONSE_BODY_LABEL)
      .label(t(INTEGRATION_STRINGS.ADD_EVENT.RESPONSE_BODY.LABEL_INPUT.ID)),
    ),
    is_multiple: getSchema(Joi.boolean().required().label(t(INTEGRATION_STRINGS.ADD_EVENT.REQUEST_BODY.IS_MULTIPLE.LABEL))),
    key_uuid: getSchema(Joi.string().required()),
    root_uuid: Joi.optional(),
    is_deleted: Joi.optional(),
    path: Joi.optional(),
    child_rows:
      getSchema(
        depth > RES_BODY_NESTED_LEVEL.MAX_DEPTH
          ? Joi.optional()
          : Joi.array()
            .when('type', {
              is: REQ_BODY_KEY_TYPES.OBJECT,
              then: Joi.array()
                .unique('key')
                .unique('label')
                .items(constructResponseBodySchema(depth + 1, t))
                .min(1)
                .required(),
              otherwise: Joi.forbidden(),
            }),
      ),
  });

export const eventResponseBodyValidationSchema = (t = () => { }) => Joi.array()
  .unique('key')
  .unique('label')
  .items(constructResponseBodySchema(0, t));

export const overAllEventSchema = (t = () => { }) => Joi.object().keys({
  event_uuid: Joi.string().optional(),
  category: STEP_NAME_VALIDATION.required().label(t(INTEGRATION_STRINGS.ADD_EVENT.EVENT_CATEGORY.LABEL)),
  name: STEP_NAME_VALIDATION.required().label(t(INTEGRATION_STRINGS.ADD_EVENT.EVENT_NAME.LABEL)),
  method: Joi.string().required().label(t(INTEGRATION_STRINGS.ADD_EVENT.EVENT_METHOD.LABEL)),
  end_point: Joi.string().required().regex(/^\/.*/).label(t(INTEGRATION_STRINGS.ADD_EVENT.END_POINT.LABEL)),
  is_document_url: Joi.boolean().optional(),
  is_binary: Joi.boolean().optional(),
  headers: Joi.array()
    .items(eventsParamsHeadersSchema(t))
    .unique((a, b) => (!isEmpty(a.key) && !a.is_deleted && !b.is_deleted) && a.key === b.key),
  params: Joi.array()
    .items(eventsParamsHeadersSchema(t))
    .unique((a, b) => (!isEmpty(a.key) && !a.is_deleted && !b.is_deleted) && a.key === b.key),
  body: Joi.optional(),
  is_response_body: Joi.optional(),
  response_body: Joi.when('is_response_body', {
    is: 1,
    then: Joi.array().required().min(1),
    otherwise: Joi.optional(),
  }),
});

export const categoryNameSchema = (t = () => { }) => Joi.object().keys({
  category: STEP_NAME_VALIDATION.required().label(t(INTEGRATION_STRINGS.ADD_EVENT.EVENT_CATEGORY.LABEL)),
});

export const draftIntegrationValidationSchema = (t = () => { }) => Joi.object().keys({
  name: STEP_NAME_VALIDATION.allow(null, EMPTY_STRING).label(
    t(INTEGRATION_STRINGS.ADD_INTEGRATION.INTEGRATION_NAME.LABEL),
  ),
  description: INTEGRATION_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING).label(
    t(INTEGRATION_STRINGS.ADD_INTEGRATION.INTEGRATION_DESCRIPTION.LABEL),
  ),
  base_url: Joi.string()
    .allow(null, EMPTY_STRING)
    .label(t(INTEGRATION_STRINGS.AUTHENTICATION.BASE_URL.LABEL)),
  authentication: Joi.optional(),
  api_headers: Joi.bool().optional(),
  api_query_params: Joi.bool().optional(),
  headers: Joi.array().when('api_headers', {
    is: true,
    then: Joi.array()
      .items(headersSchema(t))
      .min(1)
      .unique((a, b) => (!isEmpty(a.key) && !a.is_deleted && !b.is_deleted) && a.key === b.key)
      .required()
      .label(t(INTEGRATION_STRINGS.HEADERS.LABEL)),
    otherwise: Joi.optional(),
  }),
  query_params: Joi.array().when('api_query_params', {
    is: true,
    then: Joi.array()
      .items(queryParamsScehma(t))
      .min(1)
      .unique((a, b) => (!isEmpty(a.key) && !a.is_deleted && !b.is_deleted) && a.key === b.key)
      .required()
      .label(t(INTEGRATION_STRINGS.QUERY_PARAMS.LABEL)),
    otherwise: Joi.optional(),
  }),
  events_count: Joi.optional(),
  template_id: Joi.when('isExternalIntegration', {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
  isExternalIntegration: Joi.boolean().optional(),
  connector_uuid: Joi.string().optional(),
  _id: Joi.string().optional(),
});

export const validateRelativeParamData = (t = translateFunction) =>
  Joi.object().keys({
    headers: Joi.array().items(
      Joi.object().keys({
        is_required: Joi.boolean().required().label('Required'),
        key: Joi.string()
          .required()
          .label(t(TEST_INTEGRATION_STRINGS.HEADERS.KEY.LABEL)),
        test_value: Joi.when('is_required', {
          is: true,
          then: Joi.string()
            .required()
            .label(t(TEST_INTEGRATION_STRINGS.HEADERS.VALUE.LABEL)),
          otherwise: Joi.string()
            .allow(EMPTY_STRING)
            .label(t(TEST_INTEGRATION_STRINGS.HEADERS.VALUE.LABEL)),
        }),
        key_uuid: Joi.optional(),
      }),
    ),
    params: Joi.array().items(
      Joi.object().keys({
        is_required: Joi.boolean().required().label('Required'),
        key: Joi.string()
          .required()
          .label(t(TEST_INTEGRATION_STRINGS.QUERY.KEY.LABEL)),
        test_value: Joi.when('is_required', {
          is: true,
          then: Joi.string()
            .required()
            .label(t(TEST_INTEGRATION_STRINGS.QUERY.VALUE.LABEL)),
          otherwise: Joi.string()
            .allow(EMPTY_STRING)
            .label(t(TEST_INTEGRATION_STRINGS.QUERY.VALUE.LABEL)),
        }),
        key_uuid: Joi.optional(),
      }),
    ),
    relative_path: Joi.array().items(
      Joi.object().keys({
        is_required: Joi.optional(),
        key: Joi.string()
          .required()
          .label(t(TEST_INTEGRATION_STRINGS.QUERY.KEY.LABEL)),
        test_value: Joi.when('is_required', {
          is: true,
          then: Joi.string()
            .required()
            .label(
              t(TEST_INTEGRATION_STRINGS.QUERY.VALUE.LABEL),
            ),
          otherwise: Joi.string()
            .allow(EMPTY_STRING)
            .label(
              t(TEST_INTEGRATION_STRINGS.QUERY.VALUE.LABEL),
            ),
        }),
        key_uuid: Joi.optional(),
        description: Joi.optional(),
      }),
    ),
  });

const constructTestRequestBodySchema = (depth = 0, t = translateFunction) =>
  Joi.object().keys({
    key: Joi.string()
      .required()
      .label(t(TEST_INTEGRATION_STRINGS.QUERY.KEY.LABEL)),
    type: Joi.string()
      .required()
      .label(t(TEST_INTEGRATION_STRINGS.QUERY.KEY.LABEL)),
    is_required: Joi.boolean().required().label('Is Required'),
    is_multiple: Joi.boolean().required().label('Is Multiple'),
    description: Joi.optional(),
    keepChild: Joi.optional(),
    test_value: Joi.when('type', {
      is: 'object',
      then: Joi.optional(),
      otherwise: Joi.when('is_required', {
        is: true,
        then: Joi.required().label(
          t(TEST_INTEGRATION_STRINGS.QUERY.VALUE.LABEL),
        ),
        otherwise: Joi.optional(),
      }),
    }),
    key_uuid: Joi.optional(),
    root_uuid: Joi.optional(),
    path: Joi.optional(),
    child_rows:
      depth === 4
        ? Joi.optional()
        : Joi.when('type', {
          is: 'object',
          then: Joi.array().when('keepChild', {
            is: true,
            then: Joi.array()
              .items(constructTestRequestBodySchema(depth + 1, t))
              .has(
                Joi.object()
                  .keys({
                    test_value: Joi.when('type', {
                      is: 'object',
                      then: Joi.optional(),
                      otherwise: Joi.required().label(
                        t(TEST_INTEGRATION_STRINGS.QUERY.VALUE.LABEL),
                      ),
                    }),
                  })
                  .unknown(true),
              ),
            otherwise: Joi.optional(),
          }),
          otherwise: Joi.forbidden(),
        }),
  });

export const testRequestBodyValidationSchema = (t = translateFunction) =>
  Joi.array()
    .unique((a, b) => a.key === b.key)
    .items(constructTestRequestBodySchema(0, t));

const constructRequestBodySchemaForApiconfig = (depth = 0, t = translateFunction) =>
  Joi.object().keys({
    field: getSchema(
      Joi.when('value_type', {
        is: WORKHALL_API_STRINGS.REQUEST_RESPONSE.VALUE_TYPES.DYNAMIC,
        then: Joi.string().required().label(WORKHALL_API_STRINGS.REQUEST_RESPONSE.BODY_FIELDS.FIELD.LABEL),
        otherwise: Joi.forbidden(),
      }),
    ),
    system_field: getSchema(
      Joi.when('value_type', {
        is: WORKHALL_API_STRINGS.REQUEST_RESPONSE.VALUE_TYPES.SYSTEM,
        then: Joi.string().required().label(WORKHALL_API_STRINGS.REQUEST_RESPONSE.BODY_FIELDS.FIELD.LABEL),
        otherwise: Joi.forbidden(),
      }),
    ),
    key: getSchema(
      Joi.string()
      .max(VALIDATION_CONSTRAINTS.WORKHALL_API.REQUEST_RESPONSE_BODY_KEY)
      .required()
      .label(WORKHALL_API_STRINGS.REQUEST_RESPONSE.BODY_FIELDS.KEY.LABEL)),
    value_type: getSchema(Joi.string().required()),
    is_table: getSchema(
      depth < RES_BODY_NESTED_LEVEL.MAX_FIELD_MAPPING
       ? Joi.when('value_type', {
          is: WORKHALL_API_STRINGS.REQUEST_RESPONSE.VALUE_TYPES.DYNAMIC,
          then: Joi.boolean().required(),
          otherwise: Joi.forbidden(),
        })
      : Joi.forbidden(),
    ),
    field_details: getSchema(Joi.when(('value_type'), {
      is: 'dynamic',
      then: Joi.required().messages({
        'any.required': t(INTEGRATION_ERROR_STRINGS.DELETED_FIELDS),
      }),
      otherwise: Joi.optional(),
    })),
    field_type: Joi.optional(),
    is_multiple: Joi.optional(),
    keyType: Joi.optional(),
    path: Joi.optional(),
    is_deleted: Joi.optional(),
    column_mapping_sample: Joi.optional(),
    column_mapping: getSchema(
      depth > REQ_BODY_NESTED_LEVEL.MAPPING_DEPTH
        ? Joi.forbidden()
        : Joi.when('is_table', {
          is: true,
          then: Joi.array()
            .unique((a, b) => (!isEmpty(a.key) && !a.is_deleted && !b.is_deleted) && a.key === b.key)
            .items(constructRequestBodySchemaForApiconfig(depth + 1, t))
            .has(Joi.object({
              field: Joi.string().required().label(WORKHALL_API_STRINGS.REQUEST_RESPONSE.BODY_FIELDS.FIELD.LABEL),
              is_deleted: Joi.boolean().invalid(true),
            }).unknown())
            .min(1)
            .required(),
          otherwise: Joi.forbidden(),
        }),
    ),
  });

export const apiConfigurationReqResponseSchema = () => {
  return {
    type: Joi.number().required().label(CREATE_INTEGRATION.API_TYPE.READ_ONLY_LABEL),
    default_filter: Joi.when('type', {
      is: Joi.string().valid(WH_API_TYPES.GET_OR_VIEW_DL, WH_API_TYPES.EDIT_OR_UPDATE_DL),
      then: Joi.array().items({
        field: Joi.when('value_type', {
          is: WORKHALL_API_STRINGS.REQUEST_RESPONSE.VALUE_TYPES.DYNAMIC,
          then: Joi.string().required().label(WORKHALL_API_STRINGS.REQUEST_RESPONSE.FILTER_FIELDS.FIELD.LABEL),
          otherwise: Joi.forbidden(),
        }),
        value: Joi.string().max(VALIDATION_CONSTRAINTS.WORKHALL_API.FILTER_VALUE).required().label(WORKHALL_API_STRINGS.REQUEST_RESPONSE.FILTER_FIELDS.VALUE.LABEL),
        value_type: Joi.string().required(),
        system_field: Joi.when('value_type', {
          is: WORKHALL_API_STRINGS.REQUEST_RESPONSE.VALUE_TYPES.SYSTEM,
          then: Joi.string().required().label(WORKHALL_API_STRINGS.REQUEST_RESPONSE.FILTER_FIELDS.FIELD.LABEL),
          otherwise: Joi.forbidden(),
        }),
      }),
      otherwise: Joi.forbidden(),
    }),
    query_params: Joi.when('type', {
      is: WH_API_TYPES.GET_OR_VIEW_DL,
      then: Joi.array()
      .unique((a, b) => (!isEmpty(a.key)) && (a.key === b.key))
      .items({
        field: Joi.when('value_type', {
          is: WORKHALL_API_STRINGS.REQUEST_RESPONSE.VALUE_TYPES.DYNAMIC,
          then: Joi.string().required().label(WORKHALL_API_STRINGS.REQUEST_RESPONSE.QUERY_PARAMS_FIELDS.FIELD.LABEL),
          otherwise: Joi.forbidden(),
        }),
        system_field: Joi.when('value_type', {
          is: WORKHALL_API_STRINGS.REQUEST_RESPONSE.VALUE_TYPES.SYSTEM,
          then: Joi.string().required().label(WORKHALL_API_STRINGS.REQUEST_RESPONSE.QUERY_PARAMS_FIELDS.FIELD.LABEL),
          otherwise: Joi.forbidden(),
        }),
        key: Joi.string().max(VALIDATION_CONSTRAINTS.WORKHALL_API.QUERY_PARAMS_KEY).required().label(WORKHALL_API_STRINGS.REQUEST_RESPONSE.QUERY_PARAMS_FIELDS.KEY.LABEL),
        value_type: Joi.string().required(),
      }),
      otherwise: Joi.forbidden(),
    }),
  };
};

export const apiConfigurationCredentialsSchema = (t, authentication_type) => {
  return {
    type: Joi.number().required().label(CREATE_INTEGRATION.API_TYPE.READ_ONLY_LABEL),
    url_path: Joi.string().required().regex(WORKHALL_API_END_POINT_REGEX).label(CREATE_INTEGRATION.API_END_POINT),
    api_configuration_uuid: Joi.string().required(),
    _id: Joi.string().required(),
    flow_uuid: Joi.when('type', {
      is: WH_API_TYPES.START_FLOW,
      then: Joi.string().required().label(WORKHALL_API_STRINGS.CHOOSE_FLOW.ERROR_LABEL),
      otherwise: Joi.forbidden(),
    }),
    authentication_type: Joi.number().required().label(WORKHALL_API_STRINGS.AUTHENTICATION_TYPE.LABEL),
    authentication_id: Joi.array().items(Joi.string()).min(1).required()
    .messages({
      'array.min': authentication_type === WORKHALL_AUTH_TYPE.OAUTH ? WORKHALL_API_STRINGS.MIN_CREDENTIAL_REQUIRED
      : WORKHALL_API_STRINGS.MIN_USER_REQUIRED,
    })
    .label(authentication_type === WORKHALL_AUTH_TYPE.OAUTH ? WORKHALL_API_STRINGS.CREDENTIALS : WORKHALL_API_STRINGS.USERS),
    data_list_uuid: Joi.when('type', {
      is: Joi.number().valid(WH_API_TYPES.EDIT_OR_UPDATE_DL, WH_API_TYPES.GET_OR_VIEW_DL, WH_API_TYPES.SUBMIT_OR_ADD_DL),
      then: Joi.string().required().label(WORKHALL_API_STRINGS.CHOOSE_DATA_LIST.ERROR_LABEL),
      otherwise: Joi.forbidden(),
    }),
    body: Joi.array().min(1),
    ...apiConfigurationReqResponseSchema(),
  };
};

export const apiConfigBodyValidationSchema = (t = () => { }) => Joi.array()
.unique((a, b) => (!isEmpty(a.key) && !a.is_deleted && !b.is_deleted) && a.key === b.key)
.items(constructRequestBodySchemaForApiconfig(0, t));

export const apiConfigurationSchema = (t = () => { }, api_type, authentication_type) => constructJoiObject({
  ...integrationNameAndSecuritySchema(t, api_type),
  ...apiConfigurationCredentialsSchema(t, authentication_type),
});
