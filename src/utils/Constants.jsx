import { translate } from 'language/config';

const crypto = require('crypto');
// Button type constants
export const BUTTON_TYPE = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  AUTH_PRIMARY: 'AUTH_PRIMARY',
  AUTH_SECONDARY: 'AUTH_SECONDARY',
  PRIMARY_MINI: 'PRIMARY_MINI',
  CANCEL: 'CANCEL',
  OUTLINE_PRIMARY: 'OUTLINE_PRIMARY',
  OUTLINE_SECONDARY: 'OUTLINE_SECONDARY',
  LIGHT: 'LIGHT',
  DELETE: 'DELETE',
};

export const THUMBNAIL_TYPE = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TYPE_3: 'type_3',
};

export const NOTICE_BOARD_COVER_TYPE = {
  MESSAGE: 'message',
  PICTURE: 'picture',
};

// Sign Up validation constants
export const SIGNUP_MIN_MAX_CONSTRAINT = {
  ACCOUNT_NAME_MIN_VALUE: 3,
  ACCOUNT_NAME_MAX_VALUE: 50,
  DOMAIN_NAME_MIN_VALUE: 3,
  DOMAIN_NAME_MAX_VALUE: 50,
  PASSWORD_MIN_VALUE: 8,
};

export const LOADER_STRINGS = {
  LABEL: 'Loading...',
  COLOR: '#e5e9ef',
  HIGHLIGHT_COLOR: '#bfc9db',
};

export const PRODUCTION = 'production';

export const DEVELOPMENT = 'development';

export const TEST = 'test';

// Admin Settings -> Cover Content Settings
export const COVER_MESSAGE_MIN_MAX_CONSTRAINT = {
  COVER_MESSAGE_MIN_VALUE: 1,
  COVER_MESSAGE_MAX_VALUE: 127,
};

// Publish Flow constants
export const PUBLISH_FLOW_MIN_MAX_CONSTRAINT = {
  DESCRIPTION_MIN_VALUE: 2,
  DESCRIPTION_MAX_VALUE: 255,
};

export const STATUS_MIN_MAX_CONSTRAINT = {
  MIN: 2,
  MAX: 255,
};
// Add members validation constants
export const ADD_MEMBER_MIN_MAX_CONSTRAINT = {
  FIRST_NAME_MIN_VALUE: 1,
  FIRST_NAME_MAX_VALUE: 255,
  LAST_NAME_MIN_VALUE: 1,
  LAST_NAME_MAX_VALUE: 255,
  NICK_NAME_MIN_VALUE: 1,
  NICK_NAME_MAX_VALUE: 255,
  USER_NAME_MIN_VALUE: 5,
  USER_NAME_MAX_VALUE: 255,
  PHONE_NUMBER_MIN_VALUE: 3,
  PHONE_NUMBER_MAX_VALUE: 17,
  MOBILE_NUMBER_MAX_VALUE: 17,
  MOBILE_NUMBER_MIN_VALUE: 3,
  NEW_ROLE_AND_BUSINESS_UNIT_MIN_VALUE: 2,
  NEW_ROLE_AND_BUSINESS_UNIT_MAX_VALUE: 50,
};

// Create Team validation constants

export const CREATE_TEAM_MIN_MAX_CONSTRAINT = {
  TEAM_NAME_MIN_VALUE: 2,
  TEAM_NAME_MAX_VALUE: 50,
  TEAM_DESCRIPTION_MIN_VALUE: 1,
  TEAM_DESCRIPTION_MAX_VALUE: 255,
};
export const DATA_LIST_MIN_MAX_CONSTRAINT = {
  DATA_LIST_NAME_MIN_VALUE: 2,
  DATA_LIST_NAME_MAX_VALUE: 50,
  DATA_LIST_DESCRIPTION_MIN_VALUE: 1,
  DATA_LIST_DESCRIPTION_MAX_VALUE: 2000,
  DATA_LIST_TECH_REF_NAME_MIN_VALUE: 2,
  DATA_LIST_TECH_REF_NAME_MAX_VALUE: 100,
};

export const API_KEY_MIN_MAX_CONSTRAINT = {
  NAME_MIN_VALUE: 2,
  NAME_MAX_VALUE: 100,
};

export const APP_MIN_MAX_CONSTRAINT = {
  APP_NAME_MIN_VALUE: 2,
  APP_NAME_MAX_VALUE: 50,
  APP_DESCRIPTION_MIN_VALUE: 1,
  APP_DESCRIPTION_MAX_VALUE: 255,
  APP_URL_MAX_VALUE: 50,
  PAGE_URL_MAX_VALUE: 50,
};

export const CLIENT_CRED_MIN_MAX_CONSTRAINT = {
  NAME_MIN_VALUE: 2,
  NAME_MAX_VALUE: 100,
  DESCRIPTION_MIN_VALUE: 2,
  DESCRIPTION_MAX_VALUE: 250,
};

export const INTEGRATION_MIN_MAX_CONSTRAINT = {
  NAME_MIN_VALUE: 2,
  NAME_MAX_VALUE: 50,
  DESCRIPTION_MIN_VALUE: 1,
  DESCRIPTION_MAX_VALUE: 500,
};

export const API_CONFIG_MIN_MAX_CONSTRAINT = {
  NAME_MIN_VALUE: 2,
  NAME_MAX_VALUE: 100,
  DESCRIPTION_MIN_VALUE: 2,
  DESCRIPTION_MAX_VALUE: 250,
};

export const FLOW_MIN_MAX_CONSTRAINT = {
  FLOW_NAME_MIN_VALUE: 2,
  FLOW_NAME_MAX_VALUE: 50,
  FLOW_STEP_NAME_MAX_VALUE: 50,
  FLOW_DESCRIPTION_MIN_VALUE: 1,
  FLOW_DESCRIPTION_MAX_VALUE: 2000,
  FLOW_TECH_REF_NAME_MIN_VALUE: 2,
  FLOW_TECH_REF_NAME_MAX_VALUE: 100,
  STEP_NAME_MIN_VALUE: 2,
  STEP_NAME_MAX_VALUE: 255,
  SECTION_NAME_MIN_VALUE: 2,
  SECTION_NAME_MAX_VALUE: 50,
  SECTION_DESCRIPTION_MIN_VALUE: 5,
  SECTION_DESCRIPTION_MAX_VALUE: 2000,
  STEP_DESCRIPTION_MIN_VALUE: 1,
  STEP_DESCRIPTION_MAX_VALUE: 2000,
  INTEGRATION_DESCRIPTION_MAX_VALUE: 500,
  CONNECTOR_DESCRIPTION_MAX_VALUE: 250,
  FIELD_NAME_MIN_VALUE: 2,
  FIELD_NAME_MAX_VALUE: 255,
  REFERENCE_NAME_MAX_VALUE: 300,
  CREATE_NEW_PARALLEL_STEP_MIN_VALUE: 1,
  CREATE_STATUS_MIN_VALUE: 2,
  CREATE_STATUS_MAX_VALUE: 255,
};

export const FORM_MIN_MAX_CONSTRAINT = {
  FORM_NAME_MIN_VALUE: 5,
  FORM_NAME_MAX_VALUE: 255,
  FORM_DESCRIPTION_MIN_VALUE: 5,
  FORM_DESCRIPTION_MAX_VALUE: 2000,
  SECTION_NAME_MIN_VALUE: 5,
  SECTION_NAME_MAX_VALUE: 255,
  SECTION_DESCRIPTION_MIN_VALUE: 5,
  SECTION_DESCRIPTION_MAX_VALUE: 2000,
  INFO_FIELD_MIN_VALUE: 1,
  INFO_FIELD_MAX_VALUE: 10000,
};

export const TASK_MIN_MAX_CONSTRAINT = {
  TASK_DESCRIPTION_MIN_VALUE: 1,
  TASK_NAME_MIN_VALUE: 1,
  TASK_NAME_MAX_VALUE: 128,
};

export const TASK_CONTENT_MIN_MAX_CONSTRAINT = {
  COMMENTS_MAX_VALUE: 1000,
};

export const FORM_MIN_MAX_CONSTRAINTS = {
  TABLE_NAME_MIN_VALUE: 2,
  TABLE_NAME_MAX_VALUE: 255,
  TABLE_REFERENCE_NAME_MIN_VALUE: 2,
  TABLE_REFERENCE_NAME_MAX_VALUE: 260,
};

export const ROLES = {
  ADMIN: 1,
  MEMBER: 2,
  FLOW_CREATOR: 3,
};

export const USER_TYPES_PARAMS = {
  ALL_USERS: [ROLES.ADMIN, ROLES.MEMBER, ROLES.FLOW_CREATOR],
  DEVELOPER_ADMIN_USERS: [ROLES.ADMIN, ROLES.FLOW_CREATOR],
};

export const TEAM_TYPES = {
  SYSTEM: 1,
  ORGANISATIONAL: 2,
};

export const TEAM_TYPES_PARAMS = {
  SYSTEM: [1],
  ORGANISATIONAL: [2],
  PRIVATE: [3],
  SYSTEM_ORGANISATION_TEAMS: [1, 2],
  ALL_TEAMS: [1, 2, 3],
};

export const SECURITY_TYPES = {
  PRIVATE: 1,
  PUBLIC: 2,
};

export const ENTER_PRESS = 13;
export const KEY_CODES = {
  BACK_SPACE: 'Backspace',
  ENTER: 13,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  BACKSPACE: 8,
  DELETE: 46,
  ESCAPE: 27,
  SPACE_BAR: 32,
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  TAB: 9,
  SHIFT: 16,
  CAPS: 20,
};

export const KEY_NAMES = {
  ESCAPE: 'Escape',
  TAB: 'Tab',
  SHIFT_LEFT: 'ShiftLeft',
  SHIFT_RIGHT: 'ShiftRight',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_LEFT: 'ArrowLeft',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
};

export const DATE = {
  DATE_FORMAT: 'YYYY-MM-DD',
  DATE_AND_TIME_FORMAT: 'YYYY-MM-DD hh:mm A',
  TIME_FORMAT: 'hh:mm A',
  DATE_AND_TIME_24_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  TIME_24_FORMAT: 'hh:mm:ss',
  UTC_DATE_WITH_TIME_STAMP: 'YYYY-MM-DDTHH:mm:ss',
  DATE_PICKER_DATE_FORMAT: 'dd-MM-yyyy',
  DATE_PICKER_DATE_TIME_FORMAT: 'dd-MM-yyyy hh:mm aa',
  UTC_OFFSET: 'Z',
};

export const ROLES_LIST = [
  {
    label: translate('admin_settings.user_management.invite_member.role_list.normal_user'),
    value: ROLES.MEMBER,
  },
  {
    label: translate('admin_settings.user_management.invite_member.role_list.developer'),
    value: ROLES.FLOW_CREATOR,
  },
  {
    label: translate('admin_settings.user_management.invite_member.role_list.administartor'),
    value: ROLES.ADMIN,
  },
];

export const TIMER_CONSTANTS = {
  RESEND_CODE: 'timer.resend_code',
  EMAIL_NOT_RECEIVED: 'timer.email_not_received',
  SEND_AGAIN: 'timer.send_again',
};

export const IMAGE_EXTENSIONS = ['png', 'jpeg', 'jpg', 'JPG', 'JPEG', 'PNG'];
export const SVG_FORMAT = 'svg';
export const DOC_GEN_IMG_EXTENSIONS = ['png', 'jpeg', 'jpg'];
export const IMAGE_UPLOAD_EXTENSION = '.png,.jpg,.jpeg,.JPG,.PNG,.JPEG';

export const ASSIGNEES_TYPE = Object.freeze({
  ALL: 1,
  ANYONE: 2,
});

export const FORM_POPOVER_STATUS = {
  SUCCESS: 1,
  SERVER_ERROR: 2,
  DELETE: 3,
};

export const ALERT_POPOVER_STATUS = {
  SUCCESS: 1,
  SERVER_ERROR: 2,
};

export const SORT_VALUE = {
  ASCENDING: 1,
  DESCENDING: -1,
};

export const RESPONSE_TYPE = {
  NO_DATA_FOUND: 1,
  SERVER_ERROR: 2,
  NO_TASK_FOUND: 3,
  NO_CHAT_FOUND: 4,
  DELETED: 5,
};

export const API_CALL_STRINGS = {
  GET_TEAMS: 'GET_TEAMS',
  INPUT_HANDLER: 'INPUT HANDLER',
  LOAD_DATA: 'LOAD DATA',
};

export const FILE_UPLOAD_STATUS = {
  IN_PROGRESS: 1,
  SUCCESS: 2,
  FAILURE: 3,
  LOCAL_FILE: 4,
};

export const ENCRYPTION_SESSION_EXPIRY = 86400; // 24 hrs in seconds = 86400
export const ENCRYPTION_METHOD = 'rsa';
export const ENCRYPTION_RSA_KEY_OPTIONS = {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
};
export const ENCRYPTION_RSA_ENC_FORMAT = 'base64';
export const ENCRYPTION_RSA_ENC_KEY_OPTIONS = {
  padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
};

export const ENCRYPTION_AES_ENC_KEY_OPTIONS = {
  keySize: 16,
  iterations: 1000,
};

/* Field Name */
export const ENCRYPTION_FIELD_SESSION_ID = 'session_id';
export const ENCRYPTION_FIELD_PRIVATE_KEY = 'private_key';
export const ENCRYPTION_FIELD_PUBLIC_KEY = 'public_key';
export const ENCRYPTION_FIELD_AES_ENCRYPTED_KEY = 'aes_enc_key';
export const ENCRYPTION_FIELD_AES_KEY = 'aes_key';

export const ENCRYPTION_FIELD_REQUEST_ENC_BODY = 'request_enc_body';
export const ENCRYPTION_FIELD_REQUEST_ENC_QUERY = 'request_enc_query';
export const ENCRYPTION_FIELD_RESPONSE_ENC_BODY = 'response_enc_body';

export const AUTH_INVALID_ENCRYPTION_DATA_ERROR = 2405;
export const AUTH_INVALID_ENCRYPTION_SESION_ERROR = 2404;
export const BACKEND_INVALID_ENCRYPTION_DATA_ERROR = 1405;
export const BACKEND_INVALID_ENCRYPTION_SESION_ERROR = 1404;
export const ML_INVALID_ENCRYPT_SESSION_ERROR = 9404;
export const ML_INVALID_ENCRYPT_DATA_ERROR = 9405;

export const BACKEND_ENCRYPTION_ENABLED = false;
export const BACKEND_SERVICE = 'backend';
export const AUTH_SERVICE = 'auth';
export const AUTH_ENCRYPTION_ENABLED = false;

// alert popover actions

export const ALERT_POPOVER_ACTIONS = {
  CLEAR_REDUX_AND_GO_TO_SIGNIN: 'CLEAR_REDUX_AND_GO_TO_SIGNIN',
};

export const AUTH_PAGE_TYPES = {
  SIGN_IN: 1,
  SIGN_UP: 2,
  FORGOT_PASSWORD: 3,
  RESET_PASSWORD: 4,
  MFA_OTP_VERIFICATION: 5,
};

export const CHAT_SOCKET_EVENTS = {
  EMIT_EVENTS: {
    CHAT: 'chat',
    TYPING: 'typing',
    JOIN_P2P: 'joinP2P',
    JOIN_FLOW_TASK: 'joinFlowTask',
    READ_CHAT: 'read_chat',
  },
  ON_EVENTS: {
    RECONNECT: 'reconnect',
    CHAT: 'chat',
    TYPING: 'typing',
    USER_STATUS: 'userStatus',
  },
};

export const NOTIFICATION_SOCKET_EVENTS = {
  ON_EVENTS: {
    NOTIFICATION: 'new_notification',
    UPDATE_COUNT: 'notification_count_update',
    READ_NOTIFICATION_FAILURE: 'read_notification',
  },
  EMIT_EVENTS: {
    DISCONNECT: 'disconnect_user',
    READ_NOTIFICATION: 'readNotification',
    TASK_OPENED: 'taskOpened',
    TASK_COMPLETED: 'taskCompleted',
  },
};

export const ADD_FORM_FIELDS_CUSTOM_DROPDOWN_SECTION_TITLE_TYPE =
  'ADD_FORM_FIELDS_CUSTOM_DROPDOWN_SECTION_TITLE_TYPE';

// file upload size
export const DEFAULT_FILE_UPLOAD_SIZE_IN_MB = 1;
export const DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES = 1048576;

// User Or Team PopOver Type
export const USER_TEAM_POP_OVER_TYPE = {
  USER: 1,
  TEAM: 2,
  DEVELOPER_USER: 3,
};

// User or Team tool tip
export const TOOL_TIP_TYPE = {
  TEAM: 'team',
  USER: 'user',
  PROFILE: 'profile',
  ROLE: 'Role',
  BU: 'Business Unit',
  REPORTING_MANAGER: 'Reporting Manager',
  TEAM_STATUS: 'Team status',
  CREATED_ON: 'Created on',
};
export const FLOW_TASK_ADHOC_TASK = {
  FLOW_TASK: 'Flow Task',
  ADHOC_TASK: 'Adhoc Task',
};

export const STEP_TYPE = {
  USER_STEP: 'user_step',
  JOIN_STEP: 'join',
  PARALLEL_STEP: 'split',
  END_FLOW: 'end',
  START_STEP: 'start',
  FLOW_TRIGGER: 'sub_process',
  INTEGRATION: 'integration',
  ML_MODELS: 'ml_integration',
  WAIT_STEP: 'wait',
  CONDITON_PATH_SELECTOR: 'xor',
  EMAIL_CONFIGURATION: 'send_email',
  DOCUMENT_GENERATION: 'document_generation',
  SEND_DATA_TO_DATALIST: 'flow_to_dl',
  MANAGE_FLOW_FIELDS: 'manage_flow_fields',
  // below steps are yet to be finalized
  DATA_MANIPULATOR: 'manipulation',
  SYSTEM_STEP: 'system_step',
  LINK_STEP: 'existing_step',
  OTHERS: 'others',
};

export const TASK_PRIORITY_TYPE = {
  MEDIUM: {
    VALUE: 0,
    STYLE: 'InProgress',
  },
  HIGH_PRIORITY: {
    VALUE: 1,
    STYLE: 'HighPriority',
  },
  OVERDUE: {
    VALUE: -1,
    STYLE: 'Overdue',
  },
  NO_DUE: {
    STYLE: 'NoDue',
  },
  COMPLETED: {
    STYLE: 'Completed',
  },
};

export const SEARCH_CONSTANTS = {
  ALLOW_ALL: 'all',
  ALLOW_FLOW_ONLY: 'flow',
  ALLOW_DATALIST_ONLY: 'data_list',
  ALLOW_TASK_ONLY: 'task',
  ALLOW_USER_ONLY: 'user',
  ALLOW_TEAM_ONLY: 'team',
  REPORTS: {
    RECOMMENDED: 'default',
    SAVED: 'own',
    OTHERS: 'others',
    ALL: 'all',
  },
};

export const MULTICATEGORY_SEARCH_TYPE = Object.freeze({
  GLOBAL: 1,
});

export const REDIRECTED_FROM = Object.freeze({
  HOME: 1, // For task, flow, datalist, quick links, create task from home,
  TASK_LIST: 3,
  FLOW_LIST: 4,
  FLOW_DASHBOARD: 5,
  FLOW_DATA_INSTANCE: 6,
  DATALIST_LIST: 7,
  DATALIST_DASHBOARD: 8,
  DATALIST_INSTANCE: 9,
  FLOW_DASHBOARD_TEST_BED: 10,
  APP: 11,
  CREATE_GLOBAL_TASK: 0,
});

export const MODULE_TYPES = {
  TASK: 'task',
  DATA_LIST: 'data list',
  FLOW: 'flow',
  SUMMARY: 'summary',
};

export const USERS_AND_TEAMS_TYPE = {
  SYSTEM: 1,
  NON_PRIVATE_TEAMS: 2,
  PRIVATE_TEAMS: 3,
};

export const NON_PRIVATE_TEAM_TYPES = [USERS_AND_TEAMS_TYPE.SYSTEM, USERS_AND_TEAMS_TYPE.NON_PRIVATE_TEAMS];
export const PRIVATE_TEAM_TYPES = [USERS_AND_TEAMS_TYPE.SYSTEM, USERS_AND_TEAMS_TYPE.PRIVATE_TEAMS];
export const CREATE = 'create';
export const ALL_ACTIONS = 'allActions';
export const TEAMS_CONST = 'teams';
export const CREATE_TEAM_CONST = '/?create=teams';

export const LAYOUT_MAIN_WRAPPER_ID = 'layout_main_wrapper';

export const WORKHALL_ADMIN_SUB_DOMAIN = 'superadmin';

export const LINK_FIELD_PROTOCOL = {
  HTTP: 'http://',
  HTTPS: 'https://',
};

export const EXLCUDING_NUMBER_CHARACTERS = ['e', 'E', '+', '-'];

export const EXLCUDING_NUMBER_CHARACTERS_INPUT_ALONE = ['e', 'E', '+'];

export const EXCLUDING_EXPONENTIAL_CHARACTERS = ['e', 'E'];

export const YES_NO_FIELD_OPTIONS = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

export const BOOLEAN_FIELD_OPTIONS = [
  { label: 'true', value: true }, // as it represents boolean, no need to change lable and value
  { label: 'false', value: false },
];

export const REMOVE_FORM = {
  TITLE: 'Are you sure you want to remove the Form Builder?',
  SUBTITLE: 'All the created fields will be discarded',
};

export const FADE = 'fade';

export const UTIL_COLOR = {
  RED_600: '#CD3636',
  GREY_40: '#fafbfc',
  YELLOW_700: '#B54708',
  YELLOW_600: '#DC6803',
  YELLOW_50: '#FFFAEB',
  BLUE_10: '#E9F2FE',
  BLUE_PRIMARY: '#217CF5',
};
export const SORT_BY = {
  ASC: 1,
  DESC: -1,
  NAME: 'team_name',
  SORT_NAME: 'name',
};

export const APP_MODE = {
  USER: 'user',
  DEV: 'dev',
};

export const ROUTE_METHOD = {
  REPLACE: 'replace',
  PUSH: 'push',
  GO_BACK: 'goBack',
  GO_FORWARD: 'goForward',
};

export const SYSTEM_TEAMS_CODE = {
  ADMIN: 102,
  DEVELOPER: 103,
};

export const CHIP_COLOR = {
  BLUE_01: '#EBF4FF',
  BLUE_10: '#1A4AC8',
  GRAY_10: '#F2F4F7',
  BLACK_10: '#344054',
  GREEN_01: '#ECFDF3',
  GREEN_10: '#027A48',
};

export const ELLIPSIS_CHARS = {
  MAX: 70,
};

export const USER_ROLE = {
  ADMIN: 'Administrator',
};

export const HOME_CONST = 'Home';

export const MEMBER_TYPE = {
  USERS: 'users',
  OWNERS: 'owners',
};

export const ROWS_PER_PAGE_VALUE = [
  {
    value: 5,
    label: '5',
  }, {
    value: 10,
    label: '10',
  }, {
    value: 15,
    label: '15',
  }, {
    value: 20,
    label: '20',
  }, {
    value: 25,
    label: '25',
  }, {
    value: 50,
    label: '50',
  }, {
    value: 100,
    label: '100',
  },
];

export const INTEGRATION_METHOD_TYPES = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};
