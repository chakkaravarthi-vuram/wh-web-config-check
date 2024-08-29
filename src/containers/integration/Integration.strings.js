import { translateFunction } from 'utils/jsUtility';
import { ALLOWED_INTEGRATION_VALUES, WORKHALL_AUTH_TYPE } from './Integration.constants';
import { CHARACTERS_STRING, DESCRIPTION_PLACEHOLDER_PART1, NAME_PLACEHOLDER_PART1 } from '../../utils/strings/CommonStrings';
import { CLIENT_CRED_MIN_MAX_CONSTRAINT } from '../../utils/Constants';
import { COLOUR_CODES } from '../../utils/UIConstants';

export const AUTHENTICATION_TYPE_OPTIONS = {
  NO_AUTH: 'Open',
  BASIC: 'Basic',
  API_KEY: 'API Key',
  TOKEN: 'Token',
  OAUTH_AUTH_CODE: 'Oauth 2.0: Authorization Code Grant',
  OAUTH_CLIENT_CODE: 'Oauth 2.0: Client Credentials Grant',
  OAUTH_PASSWORD_GRANT: 'Oauth 2.0: Password Grant',
};

export const EDIT_INTEGRATION_TABS = {
  AUTH_INFO: 'Authentication',
  EVENTS: 'Events',
  CREDENTIALS: 'Sources & Credentials',
  REQUEST_RESPONSE: 'Request & Response',
  QUERIES: 'Queries',
};

export const CUSTOM_INTEGRATION = {
    DROPDOWN_LABEL: 'Configure Rest API',
    DESCRIPTION: 'See your events and create new events from your doc.',
};

export const API_TYPE_CONSTANTS = {
  EXTERNAL: {
    LABEL: 'External API',
    DESCRIPTION: 'External API connector to connect to the 3rd party application',
  },
  WORKHALL: {
    LABEL: 'Workhall API',
    DESCRIPTION: 'Generating Workhall API to be consumed by the 3rd party application',
  },
  DB_CONNECTION: {
    LABEL: 'External DB Connection',
    DESCRIPTION: 'DB connector to connect to external databases',
  },
};

export const WH_API_OPTIONS = {
  START_FLOW: {
    LABEL: 'Starting a Flow',
    HEADER: 'Flow',
    DESCRIPTION: 'Initiating a seamless process by outlining the essential steps and connections within a structured flow.',
    METHOD: 'POST',
  },
  ADD_DL_ENTRY: {
    LABEL: 'Add Datalist Entry',
    HEADER: 'Datalist',
    DESCRIPTION: 'Add new entry into the datalist.',
    METHOD: 'POST',
  },
  UPDATE_DL_ENTRY: {
    LABEL: 'Update Datalist Entry',
    DESCRIPTION: 'Modify an existing entry in the datalist.',
    METHOD: 'PUT',
  },
  GET_DL_ENTRY: {
    LABEL: 'Get Datalist Entry',
    DESCRIPTION: 'Retrieve information from the datalist entry.',
    METHOD: 'GET',
  },
};

export const CONNECTOR_HEADERS = {
    CUSTOM: 'Custom Connector',
    PRE_BUILD: 'Pre-build Connectors',
};

export const VIEW_LABELS = {
  INTEGRATION: 'Integration',
  EXTERNAL_APIS: 'External APIs',
  WORKHALL_APIS: 'Workhall APIs',
  EXTERNAL_DB_CONNECTOR: 'External DB Connector',
  HOME: 'Home',
};

export const INTEGRATION_LIST_HEADERS = (t = translateFunction) => {
  return {
    EXTERNAL_API: t('integration.tab_header.external_api'),
    WORKHALL_API: t('integration.tab_header.workhall_api'),
    DB_CONNECTOR: t('integration.tab_header.db_connector'),
    DRAFTS: t('integration.tab_header.drafts'),
    API_CREDENTIALS: t('integration.tab_header.api_credentials'),
  };
};

export const LIST_TITLE = (t = translateFunction) => {
  return {
    SHOWING: t('integration.list_title.showing'),
    INTEGRATIONS: t('integration.list_title.integrations'),
    DB_CONNECTOR: t('integration.list_title.db_connector'),
    CREDENTIALS: t('integration.list_title.credentials'),
    QUERY: t('integration.list_title.query'),
    DRAFT: t('integration.list_title.draft'),
  };
};

export const OAUTH_SETTINGS_LABEL = (t = translateFunction) => {
  return {
    REGENERATE: t('integration.oauth_settings_label.regenerate'),
    EDIT: t('integration.oauth_settings_label.edit'),
    ENABLE_DISABLE: t('integration.oauth_settings_label.enable_disable'),
    DELETE: t('integration.oauth_settings_label.delete'),
  };
};

export const CRED_STATUS_LABEL = {
  ENABLED: 'Enabled',
  DISABLED: 'Disabled',
  EXPIRED: 'Expired',
  DELETED: 'Deleted',
};

export const WORKHALL_AUTH_LABEL = {
  API_KEY: 'API',
  CLIENT_CRED: 'OAuth 2.0',
};

export const DELETE_OAUTH_LABELS = (t = translateFunction) => {
  return {
    TITLE: t('integration.delete_oauth_labels.title'),
    TEXT1: t('integration.delete_oauth_labels.text1'),
    DELETE: t('integration.delete_oauth_labels.delete'),
    CANCEL: t('integration.delete_oauth_labels.cancel'),
  };
};

export const MAX_CRED_LIMIT_LABELS = {
  TITLE: 'integration.max_cred_limit_labels.title',
  INFO: 'integration.max_cred_limit_labels.info',
  OKAY: 'integration.max_cred_limit_labels.okay',
};

export const CREATE_INTEGRATION = {
    ADMINS: {
        ID: 'admins',
        LABEL: 'Integration admins',
        INVALID_ADMINS: 'Invalid Users/Teams are added:',
    },
    CUSTOM: 'Custom',
    ADMINS_REQUIRED: 'Integration admins is required',
    TITLE: 'Create Integration',
    EDIT_NAME_AND_SECURITY: 'Edit Name and Security',
    SUBHEADER: 'Enable seamless data exchange and connection with external applications.',
    INTEGRATION_TYPE_TITLE: 'What would you like to add?',
    INTEGRATION_TYPE: 'Integration Type',
    TEMPLATE_TYPE: 'Template Type',
    API_TYPE: {
      ID: 'workhall_api_type',
      LABEL: 'What type of API is needed?',
      READ_ONLY_LABEL: 'API Type',
    },
    API_NAME: {
      ID: 'name',
      LABEL: 'Workhall API Name',
    },
    API_END_POINT: 'Endpoint',
    WORKHALL_API_LABEL: 'Workhall API',
    WORKHALL_API_INFO: 'Generating Workhall API to be consumed by the 3rd party application',
    CHOOSE_ADMINS: 'Choose Admins for this Integration',
    CHOOSE_VIEWERS: 'Choose Viewers for this Integration',
    CHANGE_BUTTON: 'Change',
    SET_CREDENTIALS_TEXT: 'To set credentials click on next',
    NEXT_BUTTON: 'Next',
    CANCEL_BUTTON: 'Cancel',
    CREATE_BUTTON: 'Create',
    SAVE: 'Save',
    CHOOSE_CONNECTOR_LABEL: 'Choose pre-build connectors or custom option',
    CONNECTOR_LABEL: 'Pre-build connectors or custom option',
    CONNECTOR_NAME_LABEL: 'External API Connector Name',
    DB_CONNECTION_NAME_LABEL: 'External DB Connection Name',
    NAME_PLACEHOLDER: 'Enter query name here...',
    EXTERNAL_API_CONNECTOR_NAME_PLACEHOLDER: 'Enter the external API connector name...',
    EXTERNAL_DB_CONNECTION_NAME_PLACEHOLDER: 'Enter the external DB connection name...',
    WORKHALL_API_NAME_PLACEHOLDER: 'Enter the workhall API name...',
    DESCRIPTION_PLACEHOLDER: 'Enter a description...',
    EDIT_INTEGRATION: 'Edit Integration',
    INTEGRATION: 'Integration',
    DESCRIPTION: 'Description',
    NO_USER_OR_TEAM_FOUND: 'No user or team found',
};

export const AUTHORIZATION_STATUS_STRINGS = {
  YET_TO_START: 'integration.authorization_status_strings.yet_to_start',
  IN_PROGRESS: 'integration.authorization_status_strings.in_progress',
  SUCCESS: 'integration.authorization_status_strings.success',
  FAILURE: 'integration.authorization_status_strings.failure',
  TRY_AGAIN: 'integration.authorization_status_strings.try_again',
  ABORTED: 'integration.authorization_status_strings.aborted',
  AUTHORIZE_AGAIN: 'integration.authorization_status_strings.authorize_again',
  WARNING: 'integration.authorization_status_strings.warning',
};
export const ADD_API_KEY_TO = {
  HEADERS: 'integration.add_api_key_to.headers',
  QUERY: 'integration.add_api_key_to.query',
};

export const INTEGRATION_TABS_STRINGS = {
  ALL_INTEGRATION: 'integration.integration_tab_strings.all_integration',
  DRAFTS: 'integration.integration_tab_strings.drafts',
};

export const FEATURE_INTEGRATION_STRINGS = {
  CANCEL: 'integration.feature_integration_strings.cancel',
  UPDATE: 'integration.feature_integration_strings.update',
  ADD_CUSTOM_INTEGRATION:
    'integration.feature_integration_strings.add_custom_integration',
  APP: 'integration.feature_integration_strings.app',
  CUSTOM: 'integration.feature_integration_strings.custom',
  SHOW_ALL: 'integration.feature_integration_strings.show_all',
  MORE_INFO: 'integration.feature_integration_strings.more_info',
  OTHERS: 'integration.feature_integration_strings.others',
  METHOD: 'integration.feature_integration_strings.method',
  END_POINT: 'integration.feature_integration_strings.end_point',
  HEADERS: 'integration.feature_integration_strings.headers',
  QUERY_PARAMETERS: 'integration.feature_integration_strings.query_parameters',
  RELATIVE_PATH: 'integration.feature_integration_strings.relative_path',
  ADD_MORE_KEYS: 'integration.integration_strings.add_integration.add_event.add_more_key',
  ADD_KEY: 'integration.integration_strings.add_integration.add_event.add_key',
  ADD_MORE: 'integration.integration_strings.add_integration.add_event.add_more',
  ADD_TABLE_COLUMNS: 'integration.integration_strings.add_integration.add_event.add_table_columns',
  NO_EVENT_PARAMS: {
    TITLE: 'integration.feature_integration_strings.no_event_params.title',
    NO_INPUTS_AVAILABLE:
      'integration.feature_integration_strings.no_event_params.no_input_available',
    NO_INPUTS_TO_CONFIGURE:
      'integration.feature_integration_strings.no_event_params.no_input_to_configure',
  },
  AUTHORIZE_ERROR: 'integration.feature_integration_strings.authorize_error',
  DUPLICATE_KEY_ERROR:
    'integration.feature_integration_strings.duplicate_key_error',
  DUPLICATE_KEY_LABEL_ERROR:
    'integration.feature_integration_strings.duplicate_key_label_error',
  EVENT_REQUIRED_ERROR: {
    TITLE: 'integration.feature_integration_strings.event_required_error.title',
    SUBTITLE:
      'integration.feature_integration_strings.event_required_error.sub_title',
  },
  EVENT_DELETED_MESSAGE: {
    TITLE:
      'integration.feature_integration_strings.event_deleted_message.title',
  },
  NO_CATEGORY_FOUND:
    'integration.feature_integration_strings.no_category_found',
  BACK_TO: {
    ALL_INTEGRATION:
      'integration.feature_integration_strings.back_to.all_integration',
  },
  INTEGRATION_NAME:
    'integration.integration_strings.add_integration.integration_description.integration_name',
  DB_CONNECTOR_NAME:
    'integration.integration_strings.add_integration.integration_description.db_connector_name',
  INTEGRATION_DESCRIPTION:
    'integration.integration_strings.add_integration.integration_description.integration_description',
  INTEGRATION_APP:
    'integration.integration_strings.add_integration.integration_description.integration_app',
  VALID_URL_MESSAGE:
    'integration.feature_integration_strings.valid_url_message',
  NO_EVENTS_TITLE: 'No Events Found!',
  NO_EVENTS_SUB_TITLE: 'Create your first event now.',
  CREATE_EVENT_TEXT: 'Create Event',
  RESPONSE_BODY: {
    TITLE: 'Response Body',
    SUB_TITLE: 'Map the response body here',
    HEADERS: ['Key', 'Label', 'Type', 'Is Multiple?'],
  },
  END_POINT_ERROR: {
    INVALID: 'Invalid End Point',
    DUPLICATE: 'Duplicate params found',
    INVALID_BRACES: 'Invalid URL. Invalid combinations of braces.',
    EMPTY_RELATIVE_PATH: 'Invalid URL. Empty path parameter:',
    INVALID_CHARACTERS: 'Invalid URL. Path parameter contains invalid characters:',
  },
  INTEGRATION_DEPENDENCY: {
    TYPE: 'integration.authentication.integration',
    NAME: 'integration.authentication.integration',
  },
  EVENT_DEPENDENCY: {
    TYPE: 'integration.authentication.events',
    NAME: 'integration.authentication.events',
  },
  PUBLISHED: {
    TITLE: 'integration.feature_integration_strings.published.title',
    SUBTITLE: 'integration.feature_integration_strings.published.subtitle',
  },
};

export const SECONDARY_ACTIONS_LIST = {
  DISCARD: {
    TITLE: 'integration.feature_integration_strings.discard.title',
    SUBTITLE: 'integration.feature_integration_strings.discard.sub_title',
    CONFIRM: 'integration.feature_integration_strings.discard.confirm',
    CANCEL: 'integration.feature_integration_strings.discard.cancel',
  },
  DELETE: {
    TITLE: 'integration.feature_integration_strings.delete.title',
    CONFIRM: 'integration.feature_integration_strings.delete.confirm',
    CANCEL: 'integration.feature_integration_strings.delete.cancel',
  },
};

export const CALL_BACK_URL_STRINGS = {
  TITLE: 'integration.feature_integration_strings.call_back_url_strings.title',
  DESCRIPTION_1:
    'integration.feature_integration_strings.call_back_url_strings.description_1',
  DESCRIPTION_2:
    'integration.feature_integration_strings.call_back_url_strings.description_2',
};

export const INTEGRATION_HEADERS_STRINGS = {
  NAME: 'integration.integration_headers_strings.name',
  AUTHENTICATION_TYPE:
    'integration.integration_headers_strings.authentication_type',
  CREATED_ON: 'integration.integration_headers_strings.created_on',
  DISCARD_INTEGRATION: 'integration.authentication.discard_integration',
  DELETE: 'integration.authentication.delete',
  CANCEL: 'integration.authentication.cancel',
  INTEGRATION: 'integration.authentication.integration',
  EDIT_NAME_AND_SECURITY: 'integration.integration_headers_strings.edit_name_and_security',
};

export const TEST_INTEGRATION_STRINGS = {
  RELATIVE_PATH: {
    TITLE: 'integration.feature_integration_strings.relative_path',
    ID: 'relative_path',
    VALUE: {
        PLACEHOLDER: 'integration.integration_constants.request_configuration.choose_field',
        ID: 'value',
        VALUE_KEY: 'test_value',
        TYPES: {
            DIRECT: 'direct',
            EXPRESSION: 'expression',
        },
    },
    HEADER: (t = translateFunction) => [
      t('integration.integration_constants.request_configuration.header.key'),
      t(
        'integration.integration_constants.test_integration_configuration.test_input',
      ),
    ],
  },
  HEADERS: {
    TITLE: 'integration.integration_constants.request_configuration.headers.title',
    ID: 'headers',
    HEADER: (t = translateFunction) => [
      t('integration.integration_constants.request_configuration.header.key'),
      t(
        'integration.integration_constants.test_integration_configuration.test_input',
      ),
    ],
    KEY: {
      ID: 'key',
      KEY_ID: 'key_uuid',
      LABEL: 'integration.integration_constants.request_configuration.header.key',
    },
    VALUE: {
      PLACEHOLDER:
        'integration.integration_constants.request_configuration.choose_field',
      ID: 'value',
      VALUE_KEY: 'test_value',
      TYPES: {
        DIRECT: 'direct',
        EXPRESSION: 'expression',
      },
      LABEL: 'integration.integration_constants.request_configuration.header.value',
    },
  },
  QUERY: {
    TITLE: 'integration.feature_integration_strings.query_parameters',
    ID: 'query_params',
    HEADER: (t = translateFunction) => [
      t('integration.integration_constants.request_configuration.header.key'),
      t(
        'integration.integration_constants.test_integration_configuration.test_input',
      ),
    ],
    KEY: {
      ID: 'key',
      KEY_ID: 'key_uuid',
      LABEL: 'integration.integration_constants.request_configuration.header.key',
    },
    VALUE: {
      PLACEHOLDER:
        'integration.integration_constants.request_configuration.choose_field',
      ID: 'value',
      VALUE_KEY: 'test_value',
      TYPES: {
        DIRECT: 'direct',
        EXPRESSION: 'expression',
      },
      LABEL: 'integration.integration_constants.request_configuration.header.value',
    },
  },
  REQUEST_BODY: {
    TITLE:
      'integration.integration_constants.request_body_headers.request_body_title',
    TEST_VALUE: {
      OPTION_LIST: [
        {
          label: 'True',
          value: true,
        },
        {
          label: 'False',
          value: false,
        },
      ],
    },
  },
  TEST_REQUEST_BODY_HEADERS: (t = translateFunction) => [
    t('integration.integration_constants.request_configuration.header.key'),
    t('integration.integration_constants.request_body_headers.type'),
    t('integration.integration_constants.request_body_headers.is_multiple'),
    t(
      'integration.integration_constants.test_integration_configuration.test_input',
    ),
  ],
  CONFIRMATION: {
    BUTTON_LABEL:
      'integration.integration_constants.test_integration_configuration.test_label',
  },
  TEST_CONNECTION: {
    ID: 'test_connection',
    BUTTON_LABEL: 'integration.integration_constants.test_integration_configuration.test_connection',
  },
  SUCCESS: 'integration.integration_constants.test_integration_configuration.success',
  FAILURE: 'integration.integration_constants.test_integration_configuration.failure',
};

export const WORKHALL_API_STRINGS = {
  CREDENTIALS: 'Credentials',
  DATA_SOURCES_AND_ENDPOINT: 'Data Sources & Endpoint',
  MIN_USER_REQUIRED: 'At least one user is required',
  MIN_CREDENTIAL_REQUIRED: 'Credentials must contain at least 1 item',
  USERS: 'Users',
  CHOOSE_FLOW: {
    ID: 'flow_uuid',
    LABEL: 'Choose Flow',
    ERROR_LABEL: 'Flow',
    READ_ONLY_LABEL: 'Selected Flow',
    SCROLLABLE_ID: 'flow_scrollable_list',
    SEARCH: 'Search Flow',
  },
  NO_USER_FOUND: 'No user found',
  CHOOSE_DATA_LIST: {
    ID: 'data_list_uuid',
    ERROR_LABEL: 'Datalist',
    LABEL: 'Choose Datalist',
    SCROLLABLE_ID: 'data_list_scrollable_list',
    SEARCH: 'Search Datalist',
    READ_ONLY_LABEL: 'Selected Datalist',
  },
  CHOOSE_FLOW_ACTION: {
    ID: 'action_uuid',
    LABEL: 'Choose action for auto submit',
    ERROR_LABEL: 'Action',
    READ_ONLY_LABEL: 'Action',
  },
  API_URL: {
    ID: 'url_path',
    LABEL: 'API URL',
    PLACEHOLDER: '/endpoint',
    TOOLTIP_ID: 'api_endpoint_tooltip',
    ALLOWED_CHAR_TOOLTIP: 'API URL Endpoint will only allow alphabets, numbers, hyphen and underscore',
  },
  AUTHENTICATION_TYPE: {
    ID: 'authentication_type',
    LABEL: 'Credential Method Type',
    OPTION_LIST: [
      {
        label: 'API Key',
        value: WORKHALL_AUTH_TYPE.API_KEY,
      },
      {
        label: 'Oauth 2.0: Client Credentials Grant',
        value: WORKHALL_AUTH_TYPE.OAUTH,
      },
    ],
  },
  CHOOSE_CREDENTIAL: {
    ID: 'authentication_id',
    LABEL: 'Choose Credential',
    CHOOSE_USER_LABEL: 'Choose users for this Integration',
    USERS_READ_ONLY_LABEL: 'Selected users for this Integration',
    SELECTED_USERS: 'Selected Users',
    SCROLLABLE_ID: 'credentials_scrollable_list',
    READ_ONLY_LABEL: 'Selected Credentials',
    SELECTED_LIST_ID: 'selected_authentication_list',
    INVALID_CREDENTIALS: 'Disabled/Expired credential(s) are added:',
  },
  REQUEST_RESPONSE: {
    SYSTEM_FIELD: 'system_field',
    FILTER: 'Default Filter',
    FILTER_FIELDS: {
      ID: 'default_filter',
      FIELD: {
        ID: 'field',
        LABEL: 'Field',
      },
      SYSTEM_FIELD: {
        ID: 'system_field',
      },
      VALUE: {
        ID: 'value',
        LABEL: 'Value',
      },
    },
    QUERY_PARAMS: 'Query Parameters',
    QUERY_PARAMS_FIELDS: {
      ID: 'query_params',
      FIELD: {
        ID: 'field',
        LABEL: 'Field',
      },
      KEY: {
        ID: 'key',
        LABEL: 'Key',
      },
    },
    HEADERS_TITLE: 'Header',
    REQUEST_TITLE: 'Request Body',
    REQUEST_SUB_TITLE: 'Map the inputs needed to be passed to system.',
    REQUEST_ERROR: 'Request body is requried',
    RESPONSE_TITLE: 'Response Body',
    GET_SUBTITLE: 'Map the outputs to be passed from the system.',
    POST_OR_PUT_SUBTITLE: 'The outputs passed from the system.',
    RESPONSE_ERROR: 'Response body is requried',
    SAMPLE_RESPONSE: 'Sample Code',
    COLUMN_MAPPING: 'column_mapping',
    STATUS_CODES: 'Possible status code',
    ERROR_CODES_LIST: [
      {
        code: 200,
        text: 'Success',
        background: COLOUR_CODES.GREEN_V24,
        textColor: COLOUR_CODES.GREEN_V27,
      },
      {
        code: 201,
        text: 'Created',
        background: COLOUR_CODES.GREEN_V24,
        textColor: COLOUR_CODES.GREEN_V27,
      },
      {
        code: 401,
        text: 'Authorization error',
        background: COLOUR_CODES.RED_V24,
        textColor: COLOUR_CODES.RED_V25,
      },
      {
        code: 422,
        text: 'Validation Error',
        background: COLOUR_CODES.RED_V24,
        textColor: COLOUR_CODES.RED_V25,
      },
      {
        code: 404,
        text: 'Not Found',
        background: COLOUR_CODES.GRAY_V107,
        textColor: COLOUR_CODES.BLACK_V20,
      },
    ],
    VALUE_TYPES: {
      DYNAMIC: 'dynamic',
      SYSTEM: 'system',
    },
    QUERY_PARAMS_HEADERS: [
      {
        id: 1,
        label: 'Field',
        widthWeight: 2,
      },
      {
        id: 2,
        label: 'Key',
        widthWeight: 2,
      },
      {
        id: 3,
        label: 'Key Type',
        widthWeight: 2,
      },
      {
        id: 4,
        label: '',
        widthWeight: 1,
      },
    ],
    FILTER_HEADERS: [
      {
        id: 1,
        label: 'Field',
        widthWeight: 2,
      },
      {
        id: 2,
        label: 'Value',
        widthWeight: 2,
      },
      {
        id: 3,
        label: '',
        widthWeight: 1,
      },
    ],
    HEADERS: [
      {
        id: 1,
        label: 'Key',
        widthWeight: 1,
      },
      {
        id: 2,
        label: 'Key Type',
        widthWeight: 1,
      },
    ],
    HEADERS_DATA: [
      {
        key: 'username',
        value: 'string',
      },
    ],
    RESPONSE_HEADERS: [
      {
        id: 1,
        label: 'Key',
        widthWeight: 1,
      },
      {
        id: 2,
        label: 'Type',
        widthWeight: 1,
      },
    ],
    RESPONSE_DATA: [
      {
        key: 'is_success',
        value: 'Boolean',
        keyType: ALLOWED_INTEGRATION_VALUES.BOOLEAN,
      },
      {
        key: 'status_code',
        value: 'Number',
        keyType: ALLOWED_INTEGRATION_VALUES.NUMBER,
      },
      {
        key: 'status',
        value: 'String',
        keyType: ALLOWED_INTEGRATION_VALUES.STRING,
      },
      {
        key: 'id',
        value: 'String',
        keyType: ALLOWED_INTEGRATION_VALUES.STRING,
      },
    ],
    BODY_HEADERS: [
      'Field',
      'Key',
      'Type',
      'Is Required',
      'Is Multiple',
    ],
    EDIT_BODY_HEADERS: [
      'Field',
      'Key',
      'Type',
      'Is Required',
      'Is Multiple',
      '',
    ],
    READ_ONLY_HEADERS: [
      'Key',
      'Type',
    ],
    BODY_FIELDS: {
      FIELD: {
        ID: 'field',
        LABEL: 'Field',
      },
      SYSTEM_FIELD: {
        ID: 'system_field',
        LABEL: 'Field',
      },
      KEY: {
        ID: 'key',
        LABEL: 'Key',
      },
    },
  },
  DATA_FIELDS: 'Data Fields',
  SYSTEM_FIELDS: 'System Fields',
  CHOOSE_FIELDS: 'Choose Fields',
  SEARCH_FIELDS: 'common_strings.search_fields_placeholder',
};

export const OAUTH_CRED_LABELS = (t = translateFunction) => {
  return {
    GENERATE: t('integration.oauth_cred_labels.generate'),
    NAME_PLACEHOLDER: `${t(NAME_PLACEHOLDER_PART1)} ${CLIENT_CRED_MIN_MAX_CONSTRAINT.NAME_MAX_VALUE} ${t(CHARACTERS_STRING)}`,
    DESCRIPTION_PLACEHOLDER: `${t(DESCRIPTION_PLACEHOLDER_PART1)} ${CLIENT_CRED_MIN_MAX_CONSTRAINT.DESCRIPTION_MAX_VALUE} ${t(CHARACTERS_STRING)}`,
    CREATE: t('integration.oauth_cred_labels.create'),
    NAME: t('integration.oauth_cred_labels.name'),
    DESCRIPTION: t('integration.oauth_cred_labels.description'),
    SCOPE: t('integration.oauth_cred_labels.scope'),
    CHOOSE_SCOPE: t('integration.oauth_cred_labels.choose_scope'),
    SAVE: t('integration.oauth_cred_labels.save'),
    CANCEL: t('integration.oauth_cred_labels.cancel'),
    CREDENTIAL_NAME: t('integration.oauth_cred_labels.credential_name'),
    CREDENTIAL_DESCRIPTION: t('integration.oauth_cred_labels.credential_description'),
    CLIENT_ID: t('integration.oauth_cred_labels.client_id'),
    CLIENT_SECRET: t('integration.oauth_cred_labels.client_secret'),
    CREDENTIALS_DETAILS: t('integration.oauth_cred_labels.credentials_details'),
    CREATION_DATE: t('integration.oauth_cred_labels.creation_date'),
    STATUS: t('integration.oauth_cred_labels.status'),
    EXPIRY_DATE: t('integration.oauth_cred_labels.expiry_date'),
    NAME_EXIST_ERROR: t('integration.oauth_cred_labels.name_exist_error'),
    INVALID_NAME_ERROR: t('integration.oauth_cred_labels.invalid_name_error'),
  };
};

export const SCOPE_REQUIRED_ERROR = 'integration.scope_required_error';

export const LIST_HEADER_STRINGS = (t = translateFunction) => {
  return {
    NAME: t('integration.list_header.name'),
    AUTH_TYPE: t('integration.list_header.auth_type'),
    EVENT_COUNT: t('integration.list_header.event_count'),
    LAST_UPDATED_ON: t('integration.list_header.last_updated_on'),
    API_NAME: t('integration.list_header.api_name'),
    TYPE: t('integration.list_header.type'),
    SOURCE: t('integration.list_header.source'),
    STATUS: t('integration.list_header.status'),
    UPDATED_ON: t('integration.list_header.updated_on'),
    UPDATED_BY: t('integration.list_header.updated_by'),
    DB_CONNECTOR: t('integration.list_header.db_connector'),
    DB_TYPE: t('integration.list_header.db_type'),
  };
};

export const SCOPE_LABELS = {
  READ_FLOW: 'Read Flow',
  WRITE_FLOW: 'Write Flow',
  READ_DL: 'Read Datalist',
  WRITE_DL: 'Write Datalist',
};

export const ADMIN_INFO = {
  USER_ACCOUNT_DELETED: 'User account Deleted!',
  USER_TEAM_DELETED: 'User or Team Deleted!',
  USER_TEAM_DELETED_SUBTITLE: 'We couldn\'t find all the users or teams for this integration. To publish, Please update the name and security settings.',
  OKAY: 'Okay',
};

export const NO_INTEGRATION_FOUND = 'integration.no_integration_found';
export const NO_CREDENTIAL_FOUND = 'integration.no_credential_found';
export const CREATE_CREDENTIAL = 'integration.create_credential';
export const CREATE_INTEGRATION_TEXT = 'integration.create_integration_text';
export const CREATE_FIRST_INTEGRATION = 'integration.create_first_integration';
export const CREATE_FIRST_CREDENTIAL = 'integration.create_first_credential';
export const CREDENTIAL_NAME_TOOLTIP = 'Name will only allow alphabets, numbers, white spaces and underscore';

export const LIST_FILTER_LABELS = (t = translateFunction) => {
  return {
    SHOW_BY: t('integration.list_filter_labels.show_by'),
    TEMPLATE_TYPE: t('integration.list_filter_labels.template_type'),
    APPLY: t('integration.list_filter_labels.apply'),
    FILTER: t('integration.list_filter_labels.filter'),
    CLEAR_ALL: t('integration.list_filter_labels.clear_all'),
  };
};

export const EXTERNAL_API_FILTER = (t = translateFunction) => {
  return {
    CUSTOM: t('integration.external_api_filter.custom'),
    PREBUILD: t('integration.external_api_filter.prebuild'),
  };
};

export const EMPTY_LIST_STRINGS = {
  NO_MATCHES_FOUND: 'integration.empty_list_strings.no_matches_found',
  TRY_ANOTHER_TERM: 'integration.empty_list_strings.try_another_term',
};

export const INTEGRATION_ERROR_STRINGS = {
  ADMINS: {
    INVALID: 'integration.integration_error_strings.admins.invalid',
    REQUIRED: 'integration.integration_error_strings.admins.required',
  },
  CONFIG: 'integration.integration_error_strings.config',
  LIMIT: 'integration.integration_error_strings.limit',
  DELETED_FIELDS: 'integration.integration_error_strings.deleted_fields',
  CONNECTOR_NAME: 'integration.integration_error_strings.connector_name',
  DB_CONNECTOR_NAME: 'integration.integration_error_strings.db_connector_name',
  QUERY_NAME: 'integration.integration_error_strings.query_name',
  BODY: 'integration.integration_error_strings.body',
  ACTION: 'integration.integration_error_strings.action',
  URL_PATH: 'integration.integration_error_strings.url_path',
  REQUIRED_TABLE_FIELD: 'integration.integration_error_strings.required_table_field',
  RESPONSE_BODY: 'integration.integration_error_strings.response_body',
};

export const SUCCESS_RESPONSE_KEY_STRINGS = {
  IS_SUCCESS: 'Is Success',
  STATUS_CODE: 'Status code',
  RESULT: 'Result',
  TOTAL_COUNT: 'Total Count',
  PAGE: 'Page',
  SIZE: 'Size',
  DATA: 'Data',
};

export const INTEGRATION_TABS_VALUE = {
  EXTERNAL_API: 1,
  WORKHALL_API: 2,
  DRAFT_INTEGRATION: 3,
  EDIT_INTEGRATION: 4,
  EDIT_WORKHALL_INTEGRATION: 5,
  API_CREDENTIAL: 6,
  EXTERNAL_DB_CONNECTOR: 7,
};

export const getIntegrationSortOptions = (sortType, isWorkhallApi) => {
  switch (sortType) {
    case INTEGRATION_TABS_VALUE.WORKHALL_API:
      return [
        {
          label: 'Updated On (DESC)',
          value: 'Updated On (DESC)',
          sortType: 'updated_on',
          sortBy: -1,
        }, {
          label: 'Updated On (ASC)',
          value: 'Updated On (ASC)',
          sortType: 'updated_on',
          sortBy: 1,
        }, {
          label: 'API Name (ASC)',
          value: 'API Name (ASC)',
          sortType: 'name',
          sortBy: 1,
        }, {
          label: 'API Name (DESC)',
          value: 'API Name (DESC)',
          sortType: 'name',
          sortBy: -1,
        },
      ];
    case INTEGRATION_TABS_VALUE.EXTERNAL_API:
      return [
        {
          label: 'Updated On (DESC)',
          value: 'Updated On (DESC)',
          sortType: 'last_updated_on',
          sortBy: -1,
        }, {
          label: 'Updated On (ASC)',
          value: 'Updated On (ASC)',
          sortType: 'last_updated_on',
          sortBy: 1,
        }, {
          label: 'API Name (ASC)',
          value: 'API Name (ASC)',
          sortType: 'connector_name',
          sortBy: 1,
        }, {
          label: 'API Name (DESC)',
          value: 'API Name (DESC)',
          sortType: 'connector_name',
          sortBy: -1,
        },
      ];
    case INTEGRATION_TABS_VALUE.EXTERNAL_DB_CONNECTOR:
      return [
        {
          label: 'Updated On (DESC)',
          value: 'Updated On (DESC)',
          sortType: 'last_updated_on',
          sortBy: -1,
        }, {
          label: 'Updated On (ASC)',
          value: 'Updated On (ASC)',
          sortType: 'last_updated_on',
          sortBy: 1,
        }, {
          label: 'DB Connector Name (ASC)',
          value: 'DB Connector Name (ASC)',
          sortType: 'db_connector_name',
          sortBy: 1,
        }, {
          label: 'DB Connector Name (DESC)',
          value: 'DB Connector Name (DESC)',
          sortType: 'db_connector_name',
          sortBy: -1,
        },
      ];
    case INTEGRATION_TABS_VALUE.API_CREDENTIAL:
      return [
        {
          label: 'Updated On (DESC)',
          value: 'Updated On (DESC)',
          sortType: 'updated_on',
          sortBy: -1,
        }, {
          label: 'Updated On (ASC)',
          value: 'Updated On (ASC)',
          sortType: 'updated_on',
          sortBy: 1,
        }, {
          label: 'API Name (ASC)',
          value: 'API Name (ASC)',
          sortType: 'name',
          sortBy: 1,
        }, {
          label: 'API Name (DESC)',
          value: 'API Name (DESC)',
          sortType: 'name',
          sortBy: -1,
        },
      ];
    case INTEGRATION_TABS_VALUE.DRAFT_INTEGRATION:
      if (isWorkhallApi) {
        return [
          {
            label: 'Updated On (DESC)',
            value: 'Updated On (DESC)',
            sortType: 'updated_on',
            sortBy: -1,
          }, {
            label: 'Updated On (ASC)',
            value: 'Updated On (ASC)',
            sortType: 'updated_on',
            sortBy: 1,
          }, {
            label: 'API Name (ASC)',
            value: 'API Name (ASC)',
            sortType: 'name',
            sortBy: 1,
          }, {
            label: 'API Name (DESC)',
            value: 'API Name (DESC)',
            sortType: 'name',
            sortBy: -1,
          },
        ];
      } else {
        return [
          {
            label: 'Updated On (DESC)',
            value: 'Updated On (DESC)',
            sortType: 'last_updated_on',
            sortBy: -1,
          }, {
            label: 'Updated On (ASC)',
            value: 'Updated On (ASC)',
            sortType: 'last_updated_on',
            sortBy: 1,
          }, {
            label: 'API Name (ASC)',
            value: 'API Name (ASC)',
            sortType: 'connector_name',
            sortBy: 1,
          }, {
            label: 'API Name (DESC)',
            value: 'API Name (DESC)',
            sortType: 'connector_name',
            sortBy: -1,
          },
        ];
      }
    default: return null;
  }
};
