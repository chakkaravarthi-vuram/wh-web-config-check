import { FIELD_TYPES } from '../../components/form_builder/FormBuilder.strings';
import { SYSTEM_FIELDS } from '../../utils/SystemFieldsConstants';

export const INTEGRATION_CONSTANTS = {
    API_TYPE: {
        EXTERNAL: 'external_api',
        WORKHALL: 'workhall_api',
        DB_CONNECTION: 'external_db_connection',
    },
    ROW_TYPES: {
        OBJECT: 'object',
        TEXT: 'text',
    },
    REQUEST_BODY: 'body',
    RESPONSE_BODY: 'response_body',
    EDIT_CATEGORY_ID: 'edit_category',
    SECONDARY_ACTIONS_LIST: {
        DISCARD: 1,
        EDIT_NAME_AND_SECURITY: 2,
        DELETE: 3,
    },
    ENTIRE_RESPONSE: 'entire_response',
    ENTIRE_REQUEST: 'entire_request',
    ERROR_MESSAGES: {
        NO_MAPPING: 'integration.integration_constants.test_integration_configuration.error_message.no_mapping',
    },
    ACTION_REQUIRED_ERROR: 'task_validation_strings.action_required_error',
};
export const REQ_BODY_NESTED_LEVEL = {
    INIT_DEPTH: 0,
    MAX_DEPTH: 3,
    MAPPING_DEPTH: 1,
};
export const RES_BODY_NESTED_LEVEL = {
    INIT_DEPTH: 0,
    MAX_DEPTH: 5,
    MAX_FIELD_MAPPING: 1,
};
export const EXTERNAL_FILTER_COUNT = 1;

export const WH_API_CONSTANTS = {
    STARTING_A_FLOW: 1,
    ADD_DATALIST_ENTRY: 2,
    UPDATE_DATALIST_ENTRY: 3,
    GET_DATALIST_ENTRY: 4,
};

export const CHOOSE_FLOW_SCROLLABLE_ID = 'integration_choose_flow_scrollable';
export const CHOOSE_FLOW_SCROLLABLE_THRESHOLD = 0.5;

export const ZOHO_ID = 'zoho_books';

export const WH_API_METHODS = {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
};

export const LIST_CONSTANTS = {
    TABLE: {
        ID: 'integration_listing',
    },
};

export const LIST_TAB_VALUES = {
    EXTERNAL_API: 1,
    WORKHALL_API: 2,
    DRAFTS: 3,
    API_CREDENTIALS: 6,
    DB_CONNECTOR: 7,
};

export const MASKED_VALUE = '********';

export const CRED_STATUS_VALUES = {
    ENABLED: 1,
    DISABLED: 2,
    EXPIRED: 3,
    DELETED: 4,
};
export const WORKHALL_AUTH_VALUES = {
    API_KEY: 1,
    CLIENT_CRED: 2,
};
export const WH_API_TYPES = {
    START_FLOW: 1,
    SUBMIT_OR_ADD_DL: 2,
    EDIT_OR_UPDATE_DL: 3,
    GET_OR_VIEW_DL: 4,
};

export const OAUTH_CRED_VALUES = {
    NAME_INFO: 'credential_name_info',
    NAME: 'credential_name',
    DESCRIPTION: 'credential_description',
    SCOPE: 'credential_scope',
    CREATE_CREDENTIAL: 'create_credential',
    EDIT_CREDENTIAL: 'edit_credential',
};

export const CREDENTIAL_EXPIRY_DATE = 'credential_expiry_date';

export const OAUTH_SETTINGS_VALUE = {
    REGENERATE: 'regenerate_credential',
    EDIT: 'edit_credential',
    ENABLE_DISABLE: 'disable_or_enable',
    DELETE: 'delete_credential',
  };

export const WORKHALL_AUTH_TYPE = {
    API_KEY: 1,
    OAUTH: 2,
};

export const INTEGRATION_FILTER_CONSTANTS = {
    EXTERNAL: {
        TEMPLATE: {
            CUSTOM: 0,
            PRE_BUILD: 1,
        },
    },
};

export const CRED_SCOPE_VALUE = {
    READ_FLOW: 'read:flow',
    WRITE_FLOW: 'write:flow',
    READ_DL: 'read:datalist',
    WRITE_DL: 'write:datalist',
};

export const COMPONENTS_ID = {
    COPY: {
        SAMPLE_BODY: 'sample_body',
    },
};

export const ALLOWED_INTEGRATION_VALUES = {
    STRING: 'string',
    NUMBER: 'number',
    OBJECT: 'object',
    BOOLEAN: 'boolean',
    DATE: 'date',
    DATE_TIME: 'datetime',
};

export const BODY_ROW_ID = {
    COLUMN_MAPPING: 'column_mapping',
    COLUMN_MAPPING_SAMPLE: 'column_mapping_sample',
    FIELD_TYPE_KEY: 'field_type',
    KEY_TYPE: 'keyType',
    IS_REQUIRED: 'required',
    IS_MULTIPLE: 'is_multiple',
    IS_TABLE: 'is_table',
    FIELD_DETAILS: 'field_details',
    IS_DELETED: 'is_deleted',
    PATH: 'path',
    VALUE_TYPE_KEY: 'value_type',
    DATA_FIELD: 'field',
    SYSTEM_FIELD: 'system_field',
};

export const SUCCESS_RESPONSE_KEYS = {
    IS_SUCCESS: 'is_success',
    STATUS_CODE: 'status_code',
    RESULT: 'result',
    TOTAL_COUNT: 'total_count',
    PAGE: 'page',
    SIZE: 'size',
    DATA: 'data',
    ID: '_id',
    REFERENCE_ID: 'reference_id',
};

export const TEST_CONNECTION_API_TIMEOUT = 90000;

export const INTEGRATION_DETAIL_ACTION = {
    VIEW: 'view',
    EDIT: 'edit',
    SAVED: 'saved',
};

export const API_CONFIG_URL = {
    BASE: 'web-api',
    FLOW: 'flow',
    DATA_LIST: 'data-list',
};

export const VALIDATION_CONSTRAINTS = {
    WORKHALL_API: {
        REQUEST_RESPONSE_BODY_KEY: 50,
        QUERY_PARAMS_KEY: 50,
        FILTER_VALUE: 255,
    },
    EXTERNAL_INTEGRATION: {
        RELATIVE_PATH: 50,
        QUERY_PARAMS_KEY: 255,
        QUERY_PARAMS_VALUE: 255,
        HEADER_KEY: 255,
        HEADER_VALUE: 255,
        REQUEST_BODY_KEY: 255,
        RESPONSE_BODY_KEY: 255,
        MIN_RESPONSE_BODY_LABEL: 2,
        RESPONSE_BODY_LABEL: 255,
    },
};

export const SYSTEM_FIELDS_FOR_PUT = [
    SYSTEM_FIELDS.ID,
];

export const SYSTEM_FIELDS_FOR_RES_BODY = [
    SYSTEM_FIELDS.ID,
    SYSTEM_FIELDS.CREATED_BY,
    SYSTEM_FIELDS.LAST_UPDATED_BY,
];

export const SYSTEM_FIELDS_FOR_FILTER = [
    SYSTEM_FIELDS.ID,
    SYSTEM_FIELDS.CREATED_BY,
    SYSTEM_FIELDS.LAST_UPDATED_BY,
];

export const SYSTEM_FIELDS_FOR_QUERY_PARAMS = [
    SYSTEM_FIELDS.ID,
    SYSTEM_FIELDS.SEARCH,
    SYSTEM_FIELDS.PAGE,
    SYSTEM_FIELDS.SIZE,
    SYSTEM_FIELDS.SORT_BY,
    SYSTEM_FIELDS.SORT_FIELD,
    SYSTEM_FIELDS.CREATED_BY,
    SYSTEM_FIELDS.LAST_UPDATED_BY,
];

export const WORKHALL_API_ALLOWED_FIELD_TYPES = [
    FIELD_TYPES.SINGLE_LINE,
    FIELD_TYPES.PARAGRAPH,
    FIELD_TYPES.NUMBER,
    FIELD_TYPES.DATE,
    FIELD_TYPES.DATETIME,
    FIELD_TYPES.DROPDOWN,
    FIELD_TYPES.CHECKBOX,
    FIELD_TYPES.RADIO_GROUP,
    FIELD_TYPES.YES_NO,
    FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
    FIELD_TYPES.EMAIL,
    FIELD_TYPES.SCANNER,
    FIELD_TYPES.CURRENCY,
    FIELD_TYPES.PHONE_NUMBER,
    FIELD_TYPES.LINK,
    FIELD_TYPES.USER_TEAM_PICKER,
    FIELD_TYPES.TABLE,
];

export const WORKHALL_API_FILTER_ALLOWED_FIELD_TYPES = [
    FIELD_TYPES.SINGLE_LINE,
    FIELD_TYPES.NUMBER,
    FIELD_TYPES.DATE,
    FIELD_TYPES.DROPDOWN,
    FIELD_TYPES.RADIO_GROUP,
    FIELD_TYPES.YES_NO,
    FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
];

export const PKCE_CHALLENGE_METHOD = 'S256';
