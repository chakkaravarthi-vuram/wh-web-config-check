import { ADMIN_SETTINGS_CONSTANT } from 'containers/admin_settings/AdminSettings.constant';
import { translate } from 'language/config';
import { ROLES, SECURITY_TYPES, ALERT_POPOVER_ACTIONS, ALERT_POPOVER_STATUS, TEAM_TYPES, FORM_POPOVER_STATUS } from '../Constants';
import {
  SERVER_ERROR_CODES,
  SERVER_ERROR_CODE_TYPES,
} from '../ServerConstants';

export const ERROR_TEXT = {
  NO_ERROR: '',
  EMPTY: translate('validation_constants.messages.field_not_empty'),
  ERR_WITH_NO_MSG: ' ',
  EMAIL: translate('error_popover_status.invalid_email'),
  SECTION_NAME_REQUIRED: translate('common_strings.error_text.section_name_required'),
  UPDATE_FAILURE: {
    title: translate('error_popover_status.error'),
    status: FORM_POPOVER_STATUS.SERVER_ERROR,
    isVisible: true,
  },
  SUCCESSFUL_TEAM_MEMBER_LOADING: {
    status: FORM_POPOVER_STATUS.SUCCESS,
    isVisible: true,
  },
};

export const NO_DATA_FOUND_TEXT = translate('dropdown_strings.no_data_found');

export const ENTITY = {
  ACCOUNTS: 'accounts',
  USERS: 'users',
  TEAMS: 'teams',
  FLOW_METADATA: 'flow_metadata',
  FLOW_STEPS: 'flow_steps',
  INSTANCES: 'instances',
  DATA_LIST: 'data_list',
  DATA_LIST_ENTRY: 'data_list_entry',
  DATA_LIST_ENTRY_NOTES: 'data_list_entry_notes',
  INSTANCE_NOTES: 'instance_notes',
  TASK_METADATA: 'task_metadata',
  TASK_REFERENCE_DOCUMENTS: 'task_reference_documents',
  FIELD_METADATA: 'field_metadata',
};

export const FIELD_CATEGORY = {
  SYSTEM: 'system',
};

export const DOCUMENT_TYPES = {
  TEAM_PIC: 'team_pic',
  ACCOUNT_LOGO: 'acc_logo',
  ACCOUNT_COVER_PIC: 'acc_cover_pic',
  PROFILE_PIC: 'profile_pic',
  ATTACHMENT: 'attachments',
  FORM_DOCUMENTS: 'form_documents',
  LIST_DOCUMENTS: 'list_documents',
  DATA_LIST_ENTRY_ATTACHMENTS: 'data_list_entry_attachments',
  DATA_LIST_BULK_ENTRY: 'data_list_bulk_entry',
  DATA_LIST_RELATED_ACTIONS: 'datalist_related_actions_static_documents',
  DATA_LIST_REFERENCE: 'data_list_reference_documents',
  TASK_REFERENCE_DOCUMENTS: 'task_reference_documents',
  STEP_HTML_DOCUMENTS: 'step_html_template_documents',
  STEP_HEADER_DOCUMENTS: 'step_html_header_documents',
  STEP_FOOTER_DOCUMENTS: 'step_html_footer_documents',
  STEP_STATIC_IMAGES: 'step_static_images',
  NOTES_INSTANCE: 'instance_notes',
  ACTION_HISTORY: 'action_history',
  INTEGRATION_TEST_FILE: 'integration_test_file',
  INFORMATION_FIELD_DOCUMENTS: 'information_field_documents',
  MANIPULATION_STATIC_DOCUMENTS: 'manipulation_step_static_documents',
  ACCOUNT_FAVICON: 'acc_favicon',
  SUB_FLOW_DOCUMENTS: 'step_sub_process_static_documents',
  SEND_DATA_TO_DL_DOCUMENTS: 'step_send_data_to_data_list_static_documents',
};

export const ERROR_CODES_STRINGS = {
  EMAIL_ALREADY_EXISTS: translate('validation_constants.messages.email_already_exist'),
  ACCOUNT_NAME_TAKEN: translate('validation_constants.messages.account_name_taken'),
  ACCOUNT_DOMAIN_TAKEN: translate('validation_constants.messages.account_domain_taken'),
  PASSWORD_VALIDATION: [
    translate('validation_constants.messages.password_8_char_long'),
    translate('validation_constants.messages.password_1_char_long'),
  ],
};
export const ATTRIBUTES = {
  ID: '_id',
};
export const SPACE = ' ';
export const EMPTY_STRING = '';
export const DOT = '.';
export const FORWARD_SLASH = '/';
export const PLUS = '+';
export const HASH = '#';
export const COMMA = ',';
export const PERCENTAGE = '%';
export const ASTERISK = '*';
export const HYPHEN = '-';
export const NA = 'N/A';
export const UNDERSCORE = '_';
export const COLON = ':';
export const ELLIPSIS = '...';

export const SERVER_ERROR_CODE_STRINGS = {
  [SERVER_ERROR_CODES.BAD_REQUEST]: translate('server_error_code_string.bad_request'),
  [SERVER_ERROR_CODES.UNAUTHORIZED]: translate('server_error_code_string.unauthorized'),
  [SERVER_ERROR_CODES.FORBIDDEN]: translate('server_error_code_string.forbidden'),
  [SERVER_ERROR_CODES.PAGE_NOT_FOUND]: translate('server_error_code_string.page_not_found'),
  [SERVER_ERROR_CODES.SOMETHING_WENT_WRONG]: translate('server_error_code_string.somthing_went_wrong'),
  [SERVER_ERROR_CODES.BAD_GATEWAY]: translate('server_error_code_string.bad_gateway'),
  [SERVER_ERROR_CODES.SERVICE_UNAVAILABLE]: translate('server_error_code_string.Service_unavailable'),
  [SERVER_ERROR_CODES.GATEWAY_TIMEOUT]: translate('server_error_code_string.Gateway_timeout'),
  LOGOUT_FAILED: translate('server_error_code_string.logout_failed'),
  [SERVER_ERROR_CODES.TOO_MANY_REQUEST]:
  translate('server_error_code_string.too_many_request'),
  [SERVER_ERROR_CODES.UNPROCESSABLE_ENTITY]:
  translate('server_error_code_string.try_after_some_time'),
  [SERVER_ERROR_CODES.REQUEST_FAILED]: translate('server_error_code_string.request_failed'),
};

export const SERVER_ERROR_CODE_TYPE_STRINGS = {
  [SERVER_ERROR_CODE_TYPES.INVALID_CREDENTIALS_ERROR]: translate('server_error_code_string.invalid_credentials'),
};

export const VALIDATION_ERROR_TYPES = {
  EXIST: 'exist',
  INVALID_EMAIL: 'string.email',
  REQUIRED: 'any.required',
  MINIMUM: 'string.min',
  MAXIMUM: 'string.max',
  NUMBER_MIN: 'number.min',
  NUMBER_MAX: 'number.max',
  REGEX: 'string.pattern.base',
  INVALID: 'invalid',
  USED_PASSWORD: 'past.pwd.limit',
  NOT_EXIST: 'not_exist',
  INTEGER: 'number.integer',
  DATE_LESS: 'date.less',
  STRING_EMPTY: 'string.empty',
  ONLY: 'any.only',
  UNIQUE: 'array.unique',
  UNKNOWN: 'any.unknown',
  EXCLUDES: 'array.excludes',
  LIMIT: 'LimitExceededError',
  ARRAY_UNKNOWN: 'array.includesRequiredUnknowns',
  ARRAY_MIN: 'array.min',
  ARRAY_UNIQUE: 'array.unique',
  ANY_INVALID: 'any.invalid',
  OBJECT_MISSING: 'object.missing',
  ARRAY_BASE: 'array.base',
  OBJECT_BASE: 'object.base',
};
export const HINT_MESSAGE =
translate('server_error_code_string.rules_been_assigned');
export const NETWORK_ERROR = translate('server_error_code_string.connection_lost');
export const CONDITION = translate('server_error_code_string.condition');

export const DROPDOWN_CONSTANTS = {
  VALUE: 'value',
  OPTION_TEXT: 'label',
  SELECT: 'integration.authentication.select',
  COUNTRY: 'Country',
  FIELD_NAME: 'field_name',
  LANGUAGE: 'language',
};

export const READ_ONLY = 'common_strings.readonly';
export const BUTTON_ACTION = 'configuration_strings.all_labels.button_action';
export const GENERAL_LABEL = 'form_field_strings.field_config_title.general';
export const ADDITIONAL_CONFIG_LABEL = 'charts.additional_configuration';
export const EDITABLE = 'common_strings.editable';
export const STEP_NAME_LABEL = 'flow_config_strings.step_name_label';
export const DURATION_LABEL = 'common_strings.duration_label';
export const DATE_FIELD_LABEL = 'common_strings.date_field_label';
export const FIELD_LABEL = 'common_strings.field_label';
export const NO_FIELDS_FOUND = 'common_strings.no_fields_found';
export const NO_DATA_FOUND = 'task_content.landing_page.task_individual_no_data_found.title';
export const DELETE_CONFIGURATION = 'common_strings.delete_configuration';
export const VALUE_REQUIRED_ERROR = translate('common_strings.value_required_error');
export const VALUE = translate('common_strings.value_label');
export const NO_RESULTS_FOUND = 'common_strings.no_results_found';
export const ERROR_LABEL = 'common_strings.error_label';
export const TRY_AGAIN = 'common_strings.try_again';
export const OOPS_SOMETHING_WENT_WRONG = 'common_strings.oops_something_went_wrong';
export const REQUIRED_TEXT = 'is required';
export const THIS_TEXT = translate('common_strings.this_text');
export const SECTION_IS_REQUIRED_TEXT = translate('common_strings.section_is_required_text');
export const SELECT_LABEL = 'integration.authentication.select';
export const SELECT_TYPE_LABEL = 'common_strings.select_type';
export const LABEL_CONSTANT = 'common_strings.label_constant';
export const SEARCH_LABEL = 'datalist.datalist_strings.search';
export const YES_LABEL = 'admin_settings.common_strings.yes';
export const NO_LABEL = 'admin_settings.common_strings.no';
export const SHOWING_LABEL = 'app_strings.app_listing.showing';
export const DELETE_STEP_LABEL = 'flows.step_footer_button.delete_step';
export const SAVE_STEP_LABEL = 'flows.step_footer_button.save_step';
export const SAVE_LABEL = 'team.save';
export const DISCARD_APP = 'app_strings.app_listing.discard_draft';
export const DISCARD = 'app_strings.app_settings.discard';
export const CANCEL_LABEL = 'app_strings.app_settings.cancel';
export const NAME_PLACEHOLDER_PART1 = 'common_strings.name_placeholder_part1';
export const DESCRIPTION_PLACEHOLDER_PART1 = 'common_strings.description_placeholder_part1';
export const CHARACTERS_STRING = 'common_strings.characters';
export const ALL_FLOWS = 'common_strings.all_flows';
export const ALL_DATALISTS = 'common_strings.all_datalist';
export const CHOOSE_A_FIELD = 'common_strings.choose_a_field';
export const ONLY_NUMBER_VALUES_ALLOWED_TO_SET = 'common_strings.only_number_allowed_to_set';
export const COMPLETED_LABEL = 'task_content.landing_page.completed';
export const CANCELLED_LABEL = 'task_content.landing_page.cancelled';
export const SELECT_FIELD = 'form_field_strings.dropdown_list_section.select_field';
export const BUTTON_LABEL = 'common_strings.button';
export const ASCENDING = 'common_strings.ascending';
export const DESCENDING = 'common_strings.descending';

export const USER_TYPE_STRINGS = {
  [ROLES.ADMIN]: translate('admin_settings.user_management.user_type_strings_role.role_admin'),
  [ROLES.FLOW_CREATOR]: translate('admin_settings.user_management.user_type_strings_role.role_flow_creator'),
  [ROLES.MEMBER]: translate('admin_settings.user_management.user_type_strings_role.role_basic_user'),
};

export const USER_TYPE_STRINGS_IN_TEAM_MEMBER = {
  [ROLES.ADMIN]: translate('team.details.user_type.admin'),
  [ROLES.FLOW_CREATOR]: translate('team.details.user_type.developer'),
  [ROLES.MEMBER]: translate('team.details.user_type.normal'),
};

export const TEAM_TYPE_STRINGS = {
  [TEAM_TYPES.SYSTEM]: translate('teams.system_teams'),
  [TEAM_TYPES.ORGANISATIONAL]: translate('teams.public_teams'),
};

export const SECURITY_STRINGS = {
  [SECURITY_TYPES.PRIVATE]: 'private',
  [SECURITY_TYPES.PUBLIC]: 'public',
};

export const COUNTRY_CODE = {
  COUNTRY_CODE: 'IN',
  MOBILE_NUMBER_COUNTRY_CODE: '+91',
  US_MOBILE_COUNTRY_CODE: '+1',
};

export const COUNTRY_STRINGS = {
  COUNTRY_ID: 'countryCodeId',
  COUNTRY_NAME: 'countryName',
};

export const ALPHABETS = {
  CHAR_A: 'A',
  CHAR_B: 'B,',
};
export const TYPE_OBJECT = 'object';
export const TYPE_ARRAY = 'array';
export const TYPE_STRING = 'string';

export const ACTION_STRINGS = {
  CLICK: translate('action_string.click'),
  ADD: translate('action_string.add'),
  OFF: 'off',
  ON: 'on',
};
export const TRUE = 'true';
export const FALSE = 'false';

export const STATUS_STRINGS = {
  ACTIVE: 'active',
};
export const NUMBER_STRINGS = {
  ZERO: '0',
  TWO: '2',
  TWELVE: '12',
};

export const EFFECTIVE_DATE = 'effective_date';
export const SHORTCUT_FILTER_DATE = 'shortcut_filter_date';
export const CHANGE_HISTORY = 'changes_history';
export const TEAM_CREATED_DATE = 'team_created_date';
export const DOWNLOAD_WINDOW_TIME = 'download_window_time';
export const TEAM_CREATED_DATE_TIME = 'team_created_date_time';
export const FLOW_DASHBOARD_DATE_TIME = 'flow_dashboard_date_time';
export const FLOW_DASHBOARD_DATE = 'flow_dashboard_date';
export const REPORT_DATE_TIME = 'report_date_time';
export const SOMEONE_IS_EDITING = 'someone_is_editing';
export const DRAFT_FLOW_UPDATED_DATE = 'draft_flow_last_updated_date';
export const DRAFT_DATA_LIST_UPDATED_DATE = 'draft_data_list_last_updated_date';
export const ADMIN_ACCOUNTS_DATE = 'admin_accounts_date';
export const ADMIN_ACCOUNTS_USER_ACTIVITY_DATE = 'admin_accounts_user_activity_date';
export const ADMIN_ACCOUNTS_USAGE_SUMMARY_DATE = 'admin_accounts_usage_summary_date';
export const FLOW_TO_DATALIST = 'flow_to_data_list';
export const FLOW_SHORTCUT = 'flow_shortcut';

export const LANGUAGES_LIST = {
  ENGLISH: 'English',
  SPANISH: 'Spanish',
};

export const MULTIPLE_ASSIGNEES = {
  RADIO_GROUP_LABEL: 'common_strings.multiple_assignees.radio_group_label',
};

export const OF_TEXT = 'common_strings.of_text';
export const LESS_LABEL = 'common_strings.less_label';
export const MORE_LABEL = 'common_strings.more_label';
export const PUBLISHED_LABEL = 'common_strings.published_label';

export const FORM_POPOVER_STRINGS = {
  FORM_REQUIRES_ONE_SECTION: 'common_strings.form_popover_strings.form_requires_one_section',
  CHECK_DETAILS_TO_PROCEED: 'common_strings.form_popover_strings.check_details_to_proceed',
  REMOVE_FORM_BUILDER_TITLE: 'common_strings.form_popover_strings.remove_form_builder_title',
  REMOVE_FORM_BUILDER_SUBTITLE: 'common_strings.form_popover_strings.remove_form_builder_subtitle',
  FORM_BUILDER_REMOVED_SUCCESS: translate('common_strings.form_popover_strings.form_builder_removed_success'),
  SECTION_REQUIRED_ERROR: translate('common_strings.form_popover_strings.section_required_error'),
  SECTION_REQUIRED_SUBTITLE: translate('common_strings.form_popover_strings.section_required_subtitle'),
  TEST_FLOW_PUBLISHED_SUCCESSFULLY: translate('common_strings.form_popover_strings.test_flow_published_successfully'),
  FLOW_PUBLISHED_SUCCESSFULLY: translate('common_strings.form_popover_strings.flow_published_successfully'),
  FAILED_TO_PUBLISH_FLOW: 'common_strings.form_popover_strings.failed_to_publish_flow',
  APP_PUBLISHED_SUCCESSFULLY: translate('common_strings.form_popover_strings.app_published_successfully'),
  APP_PUBLISHED_FAILURE: translate('common_strings.form_popover_strings.app_published_failure'),
  FILE_UPLOAD_IN_PROGRESS: translate('common_strings.form_popover_strings.file_upload_in_progress'),
  BULK_FILE_UPLOAD_IN_PROGRESS: 'common_strings.form_popover_strings.bulk_file_upload_in_progress',
  CLOSE_POPOVER: 'pagination_strings.customer_tooltip.close_pop_over_label',
  CHANGES_NOT_SAVED: 'pagination_strings.customer_tooltip.changes_not_saved',
  INVALID_ASSIGNEES: 'common_strings.form_popover_strings.invalid_assignee',
};

export const FORM_BUILDER_STRINGS = {
  DEFAULT_SECTION_NAME: 'flows.form_field_design.default_section_name',
};

export const TIME_DROPDOWN = [
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '12:00 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '12:00 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '12:15 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '12:15 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '12:30 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '12:30 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '12:45 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '12:45 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '01:00 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '01:00 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '01:15 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '01:15 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '01:30 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '01:30 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '01:45 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '01:45 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '02:00 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '02:00 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '02:15 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '02:15 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '02:30 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '02:30 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '02:45 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '02:45 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '03:00 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '03:00 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '03:15 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '03:15 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '03:30 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '03:30 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '03:45 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '03:45 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '04:00 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '04:00 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '04:15 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '04:15 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '04:30 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '04:30 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '04:45 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '04:45 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '05:00 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '05:00 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '05:15 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '05:15 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '05:30 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '05:30 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '05:45 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '05:45 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '06:00 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '06:00 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '06:15 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '06:15 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '06:30 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '06:30 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '06:45 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '06:45 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '07:00 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '07:00 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '07:15 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '07:15 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '07:30 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '07:30 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '07:45 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '07:45 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '08:00 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '08:00 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '08:15 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '08:15 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '08:30 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '08:30 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '08:45 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '08:45 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '09:00 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '09:00 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '09:15 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '09:15 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '09:30 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '09:30 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '09:45 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '09:45 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '10:00 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '10:00 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '10:15 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '10:15 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '10:30 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '10:30 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '10:45 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '10:45 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '11:00 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '11:00 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '11:15 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '11:15 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '11:30 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '11:30 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '11:45 AM',
    [DROPDOWN_CONSTANTS.VALUE]: '11:45 AM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '12:00 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '12:00 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '12:15 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '12:15 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '12:30 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '12:30 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '12:45 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '12:45 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '01:00 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '01:00 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '01:15 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '01:15 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '01:30 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '01:30 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '01:45 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '01:45 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '02:00 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '02:00 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '02:15 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '02:15 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '02:30 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '02:30 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '02:45 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '02:45 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '03:00 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '03:00 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '03:15 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '03:15 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '03:30 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '03:30 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '03:45 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '03:45 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '04:00 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '04:00 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '04:15 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '04:15 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '04:30 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '04:30 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '04:45 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '04:45 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '05:00 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '05:00 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '05:15 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '05:15 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '05:30 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '05:30 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '05:45 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '05:45 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '06:00 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '06:00 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '06:15 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '06:15 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '06:30 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '06:30 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '06:45 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '06:45 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '07:00 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '07:00 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '07:15 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '07:15 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '07:30 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '07:30 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '07:45 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '07:45 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '08:00 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '08:00 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '08:15 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '08:15 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '08:30 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '08:30 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '08:45 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '08:45 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '09:00 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '09:00 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '09:15 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '09:15 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '09:30 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '09:30 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '09:45 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '09:45 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '10:00 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '10:00 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '10:15 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '10:15 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '10:30 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '10:30 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '10:45 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '10:45 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '11:00 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '11:00 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '11:15 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '11:15 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '11:30 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '11:30 PM',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '11:45 PM',
    [DROPDOWN_CONSTANTS.VALUE]: '11:45 PM',
  },
];

export const DAY_DROPDOWN = [
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '1',
    [DROPDOWN_CONSTANTS.VALUE]: 1,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '2',
    [DROPDOWN_CONSTANTS.VALUE]: 2,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '3',
    [DROPDOWN_CONSTANTS.VALUE]: 3,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '4',
    [DROPDOWN_CONSTANTS.VALUE]: 4,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '5',
    [DROPDOWN_CONSTANTS.VALUE]: 5,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '6',
    [DROPDOWN_CONSTANTS.VALUE]: 6,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '7',
    [DROPDOWN_CONSTANTS.VALUE]: 7,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '8',
    [DROPDOWN_CONSTANTS.VALUE]: 8,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '9',
    [DROPDOWN_CONSTANTS.VALUE]: 9,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '10',
    [DROPDOWN_CONSTANTS.VALUE]: 10,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '11',
    [DROPDOWN_CONSTANTS.VALUE]: 11,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '12',
    [DROPDOWN_CONSTANTS.VALUE]: 12,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '13',
    [DROPDOWN_CONSTANTS.VALUE]: 13,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '14',
    [DROPDOWN_CONSTANTS.VALUE]: 14,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '15',
    [DROPDOWN_CONSTANTS.VALUE]: 15,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '16',
    [DROPDOWN_CONSTANTS.VALUE]: 16,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '17',
    [DROPDOWN_CONSTANTS.VALUE]: 17,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '18',
    [DROPDOWN_CONSTANTS.VALUE]: 18,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '19',
    [DROPDOWN_CONSTANTS.VALUE]: 19,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '20',
    [DROPDOWN_CONSTANTS.VALUE]: 20,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '21',
    [DROPDOWN_CONSTANTS.VALUE]: 21,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '22',
    [DROPDOWN_CONSTANTS.VALUE]: 22,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '23',
    [DROPDOWN_CONSTANTS.VALUE]: 23,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '24',
    [DROPDOWN_CONSTANTS.VALUE]: 24,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '25',
    [DROPDOWN_CONSTANTS.VALUE]: 25,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '26',
    [DROPDOWN_CONSTANTS.VALUE]: 26,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '27',
    [DROPDOWN_CONSTANTS.VALUE]: 27,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '28',
    [DROPDOWN_CONSTANTS.VALUE]: 28,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '29',
    [DROPDOWN_CONSTANTS.VALUE]: 29,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '30',
    [DROPDOWN_CONSTANTS.VALUE]: 30,
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: '31',
    [DROPDOWN_CONSTANTS.VALUE]: 31,
  },
];

export const FLOW_INITIAL_LOADING_TEXT = {
  TYPE: 'DataLoadingError',
  ERROR_MESSAGE: translate('server_error_code_string.data_loading_error'),
};

export const MONTHS = Object.freeze([
  { month: 1, shortMonth: 'Jan', fullMonth: 'January' },
  { month: 2, shortMonth: 'Feb', fullMonth: 'February' },
  { month: 3, shortMonth: 'Mar', fullMonth: 'March' },
  { month: 4, shortMonth: 'Apr', fullMonth: 'April' },
  { month: 5, shortMonth: 'May', fullMonth: 'May' },
  { month: 6, shortMonth: 'Jun', fullMonth: 'June' },
  { month: 7, shortMonth: 'Jul', fullMonth: 'July' },
  { month: 8, shortMonth: 'Aug', fullMonth: 'August' },
  { month: 9, shortMonth: 'Sep', fullMonth: 'September' },
  { month: 10, shortMonth: 'Oct', fullMonth: 'October' },
  { month: 11, shortMonth: 'Nov', fullMonth: 'November' },
  { month: 12, shortMonth: 'Dec', fullMonth: 'December' },
]);

export const FILE_CROP_PREVIEW_TEXT = {
  ADD_COMPANY_LOGO: ADMIN_SETTINGS_CONSTANT.ACCOUNT_SETTINGS.BRANDING_THEME.FILE_CROP_PREVIEW_TEXT,
  ADD_FAVICON: 'Add Favicon',
};

export const SOMEONE_IS_EDITING_ERROR = {
  SAME_USER: translate('someone_is_editing_error.same_user'),
  DIFFERENT_USER: translate('someone_is_editing_error.is_editing'),
  DESCRIPTION_LABEL: translate('someone_is_editing_error.last_edited_on'),
  FLOW: {
    TITLE: translate('someone_is_editing_error.error_in_flow'),
    TYPE: 'Flow',
  },
  WORKHALL_API_CONFIGURATION: {
    TITLE: translate('someone_is_editing_error.integration_error'),
    TYPE: 'Workhall API',
  },
  INTEGRATION: {
    TITLE: translate('someone_is_editing_error.integration_error'),
    TYPE: 'Integration',
  },
  APPLICATION: {
    TITLE: translate('someone_is_editing_error.application_error'),
    TYPE: 'Application',
  },
  EXTERNAL_SOURCE: {
    TITLE: translate('someone_is_editing_error.external_source'),
    TYPE: 'External Source',
  },
  EXTERNAL_DB_CONNECTOR: {
    TITLE: translate('someone_is_editing_error.integration_error'),
    TYPE: 'External DB Connector',
  },
};
export const TABLE_ACTION_TYPE = {
  ADD_ROW: 'add_row',
  DELETE_ROW: 'delete_row',
};

export const ICON_ARIA_LABELS = {
  BELL_ICON: 'bell icon',
  UP_DOWN_ICON: 'up down icon',
  CANCEL: 'Cancel',
  EDIT: 'Edit',
  SEARCH: 'Search',
};

export const USERS = {
  TITLE: translate('server_error_code_string.users'),
  RELOADDATA: translate('server_error_code_string.reload_user'),
  ROLE_CHANGED_ALERT: {
    title: translate('server_error_code_string.access_denied'),
    subTitle: translate('server_error_code_string.dont_have_previlage'),
    status: ALERT_POPOVER_STATUS.SERVER_ERROR,
    isButtonVisible: true,
    buttonTitle: translate('server_error_code_string.refresh'),
    isVisible: true,
    buttonAction: ALERT_POPOVER_ACTIONS.CLEAR_REDUX_AND_GO_TO_SIGNIN,
  },
  TOKEN_EXPIRED_ALERT: {
    title: translate('server_error_code_string.section_expired'),
    subTitle: translate('server_error_code_string.section_expired_login'),
    status: ALERT_POPOVER_STATUS.SERVER_ERROR,
    isButtonVisible: true,
    buttonTitle: translate('server_error_code_string.sign_in'),
    isVisible: true,
    buttonAction: ALERT_POPOVER_ACTIONS.CLEAR_REDUX_AND_GO_TO_SIGNIN,
  },
};

export const ERROR_MESSAGES = {
  CATEGORY_NAME_EMPTY: translate('server_error_code_string.category_name_required'),
  EVENT_NAME_DUPLICATE: translate('server_error_code_string.event_name_exist'),
};

export const SERVER_ERROR_MESSAGES = {
  DEFAULT: {
    TITLE: 'error_popover_status.somthing_went_wrong',
    DESCRIPTION: 'error_popover_status.refresh_try_again',
  },
  ERROR_TYPE_STRING_GUID_ERROR: {
    TITLE: 'error_popover_status.no_data_found',
  },
};
export const MONTHS_ARRAY = [
  { label: 'January', value: 1, isCheck: false },
  { label: 'February', value: 2, isCheck: false },
  { label: 'March', value: 3, isCheck: false },
  { label: 'April', value: 4, isCheck: false },
  { label: 'May', value: 5, isCheck: false },
  { label: 'June', value: 6, isCheck: false },
  { label: 'July', value: 7, isCheck: false },
  { label: 'August', value: 8, isCheck: false },
  { label: 'September', value: 9, isCheck: false },
  { label: 'October', value: 10, isCheck: false },
  { label: 'November', value: 11, isCheck: false },
  { label: 'December', value: 12, isCheck: false },
];

export const FIELD_TYPE_TITLE_LABELS = {
  SYSTEM: 'System Fields',
  DATA: 'Data Fields',
};

export const SYSTEM_FIELDS_LABELS = {
  ID: 'Id',
  SEARCH: 'Search',
  PAGE: 'Page',
  SIZE: 'Size',
  SORT_BY: 'Sort By',
  SORT_FIELD: 'Sort Field',
  CREATED_BY: 'Created by',
  UPDATED_BY: 'Updated by',
  LAST_UPDATED_BY: 'Last Updated by',
  CREATED_ON: 'Created on',
  UPDATED_ON: 'Updated on',
  LAST_UPDATED_ON: 'Last Updated on',
  COMMENTS: 'Comments',
  FLOW_LINK: 'Flow Link',
  DATA_LIST_LINK: 'Datalist Link',
  COMPLETED_BY: 'Completed by',
  COMNPLETED_ON: 'Completed on',
  FLOW_ID: 'Flow Id',
  DATA_LIST_ID: 'Datalist Id',
  STATUS: 'Status',
};

export const SYSTEM_FIELDS_TITLE_STRINGS = {
  TEXT_FIELDS: 'Text Fields',
  REFERENCE_FIELDS: 'Data Reference Fields',
  DATE_TIME_FIELDS: 'Date/Time Fields',
};

export const PAC_URL_STRING = 'pacsticketing.machint.com';
