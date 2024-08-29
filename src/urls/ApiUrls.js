// Docker Urls
// let BACKEND_API_URL = 'http://localhost:3000/';
// let AUTH_API_URL = 'http://localhost:8005/';
// let BILLING_URL = 'http://localhost:8011';

// Dev Urls
let BACKEND_API_URL = 'https://workhall.dev';
let AUTH_API_URL = 'https://workhall.dev';
let BILLING_URL = 'https://workhall.dev';
let SIGN_UP_API_URL = 'https://workhall.dev';
let REPORT_ENGINE_API_URL = 'https://workhall.dev';
let CHAT_API_URL = 'https://workhall.dev';
let NOTIFICATION_API_URL = 'https://workhall.dev';
let ML_BACKEND_URL = 'https://workhall.dev';
let ML_BACKEND_API_GATEWAY_URL =
  'https://workhall.dev'; // need to be removed
let ADMIN_API_URL = 'https://workhall.dev';

const DEV_URL = 'https://workhall.dev';

if (
  process.env.NODE_ENV === 'production' ||
  (process.env.NODE_ENV === 'development' &&
    window.location.protocol === 'https:')
) {
  BACKEND_API_URL = '';
  AUTH_API_URL = '';
  REPORT_ENGINE_API_URL = '';
  CHAT_API_URL = '';
  SIGN_UP_API_URL = '';
  ML_BACKEND_URL = '';
  ML_BACKEND_API_GATEWAY_URL = '';
  BILLING_URL = '';
  ADMIN_API_URL = '';
  NOTIFICATION_API_URL = '';
}

export const CHAT_BASE_URL = CHAT_API_URL;
export const NOTIFICATION_BASE_URL = NOTIFICATION_API_URL;
export const IMAGE_BASE_URL = `${BACKEND_API_URL}api/file_stream?`;
export const BACKEND_BASE_URL = BACKEND_API_URL;
export const AUTH_BASE_URL = AUTH_API_URL;
export const REPORT_ENGINE_BASE_URL = REPORT_ENGINE_API_URL;
export const ML_BACKEND_BASE_URL = ML_BACKEND_URL;
export const ML_BACKEND_API_GATEWAY_BASE_URL = ML_BACKEND_API_GATEWAY_URL;
export const ML_ID_URL = '/ml';
export const SIGNUP_BASE_URL = SIGN_UP_API_URL;
export const BILLING_BASE_URL = BILLING_URL;
export const ADMIN_BASE_URL = ADMIN_API_URL;
export const DEV_BASE_URL = DEV_URL;
// ML Backend
export const GET_FIELD_SUGGESTION = `${ML_BACKEND_URL}${ML_ID_URL}/field_suggestion`;

// Graphql
export const GRAPH_QL = `${CHAT_BASE_URL}/chat-ql/graphql`;

// Layout
export const GET_AUTHORIZATION_DETAILS =
  '/api/get_authorization_details?resolutions={"profile_pic":"medium"}';
export const CLEAR_SESSION_DETAILS = '/auth/clear_session_details/';
export const REFRESH_ACCESS_TOKEN = '/auth/refresh_access_token/';
export const UPDATE_FCM_TOKEN = '/auth/update_fcm_token/';

// Sign-up
export const VALIDATE_EMAIL = '/api/validate_email';
export const VALIDATE_EMAIL_DOMAIN = '/auth/verify_email_and_domain';
export const VERIFY_ACCOUNT_GENERATE_OTP = '/signup/generate_email_otp_code/';
export const VERIFY_ACCOUNT_RESEND_OTP = '/signup/resend_email_otp_code';

export const VERIFY_OTP = '/signup/verify_email_otp_code';
export const VALIDATE_ACCOUNT_NAME = '/api/validate_account_name';
export const VALIDATE_ACCOUNT_DOMAIN = '/api/validate_account_domain';
export const SIGN_UP = '/signup/account_signup';
export const ACCOUNT_CONFIGURATION = '/auth/account_configuration';
export const GET_ALL_TRIAL_DETAILS = '/billing/get_all_trial_details';
export const GET_ALL_COUNTRIES = '/api/get_all_countries?size=250';

// Sign in
export const PRE_SIGN_IN = '/auth/sign_in_details';
export const GOOGLE_SIGN_IN = '/auth/authenticate_with_google';
export const MICROSOFT_SIGN_IN = '/auth/authenticate_with_microsoft';
export const SIGN_IN = '/auth/sign_in';
export const VERFIY_URL = '/auth/verify_domain_url/';
export const FORGET_PASSWORD = '/auth/forget_password';
export const EXTERNAL_AUTH_SIGN_IN = '/auth/external_auth_signin/';
export const VALIDATE_INVITE_USER = '/auth/validate_invite_user/';
export const UPDATE_INVITE_USER = '/auth/update_invite_user/';
export const MICROSOFT_HANDLE_REDIRECT = '/auth/microsoft_auth_handle_redirect';

// Admin-settings(Account Settings)
export const ACCOUNT_SETTINGS_DETAILS = '/api/account_main_details';
export const UPDATE_ACCOUNT_DETAILS = '/api/update_account_main_details';
export const VALIDATE_USER_NAME = '/api/validate_username';
export const GET_INDUSTRY_LIST = '/api/get_all_account_industry';

// Admin-settings(Cover Settings)
export const ACCOUNT_COVER_DETAILS = '/api/account_cover_details';
export const UPDATE_ACCOUNT_COVER_DETAILS = '/api/update_account_cover_details';

// Admin-Settings(Language And Calendar Details)
export const ACCOUNT_LANGUAGE_DETAILS = '/api/account_language_details';
export const HOLIDAY_DETAILS = '/api/holiday';
export const ADD_NEW_HOLIDAY = '/api/save_holiday';
export const DELETE_HOLIDAY = '/api/delete_holiday';
export const UPDATE_LANGUAGE_DETAILS = '/api/update_account_language_details';
export const GET_LANGUAGE_DETAILS = '/api/languages';
export const GET_LOCALE_DETAILS = '/api/locale';
export const GET_TIMEZONE_DETAILS = '/api/timezone';
export const GET_CONFIGURATION_DETAILS =
  '/api/get_account_configuration_details';
export const GET_CONFIGURATION_DETAILS_AUTH =
  '/auth/get_account_configuration_details';
export const UPDATE_CONFIGURATION_DETAILS =
  '/api/update_account_configuration_details';
export const UPDATE_CONFIGURATION_DETAILS_AUTH =
  '/auth/update_account_configuration_details';
export const GET_ALL_CURRENCY_TYPES = '/api/get_all_currency_types';
export const GET_ALL_FILE_EXTENSIONS = '/api/get_all_file_extensions';
export const GET_ALL_FILE_TYPES = '/api/get_all_file_types';
export const GET_USER_TEAM_PICKER_SUGGESTION =
  '/api/user_team_picker_suggestion';
export const GET_TEST_BED_ASSIGNEES = '/api/get_test_assignees';

// Add Member
export const ADD_NEW_MEMBER = '/auth/add_new_user';
export const GET_USER_ROLE = '/api/roles';
export const ADD_NEW_ROLE = '/api/add_new_role';
export const GET_BUSINESS_UNIT = '/api/business_units';
export const ADD_NEW_BUSINESS_UNIT = '/api/add_new_business_unit';
export const GET_REPORTING_MANAGERS = '/api/reporting_managers';

// Get users
export const GET_USERS = '/api/get_all_users';

// Get users and teams
export const GET_ALL_USERS_OR_TEAMS = '/api/get_all_users_or_teams';
export const GET_VALID_REVIEW_ASSIGNEES = 'api/get_valid_review_assignees';

// Reset Password,Change Password
export const RESET_PASSWORD = '/auth/update_password ';
export const UPDATE_FORGET_PASSWORD = '/auth/update_forget_password ';
export const CHANGE_PASSWORD_API = '/auth/change_password';
export const VALIDATE_FORGET_PASSWORD = '/auth/validate_forget_password';
export const UPDATED_RESET_PASSWORD = '/auth/reset_password/';
export const RESET_MFA = '/auth/disable_mfa/';
// User management
export const UPDATE_USER_TYPE = '/auth/update_user_type';
export const ACTIVATE_OR_DEACTIVATE_USER = '/auth/activate_or_deactivate_user';
export const INVITE_USER = '/auth/invite_user';
export const PASSWORD_RESET = '/auth/reset_user_password';

// Logout
export const SIGN_OUT = '/auth/sign_out/';

// Teams
export const CREATE_TEAM_API = '/api/create_team';
export const GET_ALL_TEAMS = '/api/get_all_teams';
export const GET_TEAM_BY_ID = '/api/team_by_id';
export const GET_TEAM_DETAILS_BY_ID = '/api/team_by_id';
export const UPDATE_TEAM_DETAILS = '/api/update_team';
export const ADD_TEAM_MEMBER = '/api/add_team_member';
export const GET_TEAM_MEMBERS = '/api/get_team_members';
export const REMOVE_TEAM_MEMBER = '/api/remove_team_member';
export const GET_TEAM_DEPENDENCY = '/api/get_team_dependency';
export const DEACTIVATE_TEAM = '/api/deactivate_team';
export const CHECK_TEAM_NAME = '/api/check_team_name';

// Multiple factor authentication
export const USER_MFA_DETAILS = 'auth/get_user_mfa_details';
export const ENABLE_OR_DISABLE_USER_MFA = 'auth/enable_or_disable_user_mfa';
export const VERIFY_MFA = 'auth/verify_mfa';
export const DISABLE_MFA = 'auth/disable_mfa';
export const VALIDATE_MFA = 'auth/validate_mfa/';
export const RESEND_LOGIN_MFA_OTP = 'auth/resend_mfa_email_otp/';
export const MFA_SETUP_USER_MFA_DETAILS = '/auth/mfa_setup_get_user_mfa_details/';
export const MFA_SETUP_ENABLE_OR_DISABLE_USER_MFA = '/auth/mfa_setup_enable_or_disable_user_mfa/';
export const MFA_SETUP_VERIFY_MFA = '/auth/mfa_setup_verify_mfa/';
// Flow
export const GET_ALL_INITIATE_FLOWS = '/api/get_all_initiate_flows';
export const GET_FLOW_ACCESS_BY_UUID = '/api/get_flow_access_by_uuid';
export const GET_FLOW_INSTANCES_BY_UUID =
  '/api/get_flow_instances_by_uuid';
export const GET_ALL_FLOWS = '/api/get_all_view_flows';
export const GET_SUB_FLOWS = 'api/dev/flows';
export const GET_ALL_FLOW_VERSIONS =
  '/api/get_all_flow_versions_by_uuid';
export const PUBLISH_FLOW = '/api/dev/publish_flow';
export const SAVE_STEP_COORDINATES = '/api/dev/save_step_coordinates';
export const SAVE_CONNECTOR_LINE = '/api/dev/connector_lines';
// Publish flow for testing
export const PUBLISH_TEST_FLOW = '/api/dev/publish_as_test_bed';
export const DELETE_TEST_BED = '/api/dev/delete_test_bed';

export const GET_LATEST_FLOW_DRAFT = '/api/get_latest_flow_version';
export const GET_FLOW_STEP_DETAILS_BY_ID =
  '/api/dev/get_flow_step_details_by_id';
export const GET_ALL_FLOW_STEPS = '/api/get_all_flow_steps';
export const DELETE_FLOW = '/api/dev/delete_flow';
export const DISCARD_FLOW = '/api/dev/discard_flow';
export const GET_FIELD_DEPENDENCY = '/api/get_field_dependency';
export const LIST_FIELD_DEPENDENCY = '/api/list_field_dependency';
export const GET_FORM_DEPENDENCY = '/api/get_form_dependency';
export const GET_STEP_DEPENDENCY = '/api/dev/get_step_dependency';
export const GET_STEP_LINK_DEPENDENCY = '/api/dev/get_link_dependency';
export const GET_FLOW_DEPENDENCY = '/api/dev/get_flow_dependency';
export const GET_PUBLISHED_FLOW_DETAILS_BY_UUID =
  '/api/get_published_flow_details_by_uuid';
export const GET_INSTANCE_DETAILS_BY_ID = '/api/get_instance_details_by_id';
export const GET_INSTANCE_SUMMARY_BY_ID = '/api/get_instance_summary';
export const GET_INSTANCE_DATA = '/api/get_instance_data';
export const CANCEL_FLOW_INSTANCE = '/api/cancel_flow_instance';
export const GET_ALL_FIELDS_BY_STEP_ORDER = '/api/get_all_fields_by_step_order';
export const GET_ALL_SELF_INITIATED_FLOWS =
  '/api/get_all_self_initiated_flows';
export const GET_ALL_WEIGHTED_SORT_FLOWS =
  'api/get_all_sorted_view_flows';
export const SAVE_FLOW_STEP_STATUSES = 'api/dev/save_flow_step_statuses';
export const CREATE_STEP = '/api/dev/create_step';
export const SAVE_FLOW_ESCALATIONS = '/api/dev/save_escalations';
export const GET_DOCUMENT_GENERATION = '/api/dev/get_document_generation';
export const SAVE_DOCUMENT_GENERATION = '/api/dev/save_document_generation';
export const DELETE_FLOW_ESCALATIONS = '/api/dev/delete_escalations';
export const DELETE_DOCUMENT_GENERATION = '/api/dev/delete_document_generation';
export const GET_SEND_EMAIL_CONFIG = '/api/dev/get_email_actions';
export const SAVE_SEND_EMAIL = '/api/dev/save_email_actions';
export const DELETE_SEND_EMAIL = '/api/dev/delete_email_actions';
export const SAVE_SEND_DATA_TO_DATALIST = '/api/dev/send_flow_to_data_list';
export const DELETE_SEND_DATA_TO_DATALIST =
  '/api/dev/delete_flow_to_data_list';
export const GET_PRECEDING_STEPS = '/api/get_preceding_steps';
export const GET_TRIGGER_DETAILS = '/api/get_trigger_details_by_uuid';
export const VALIDATE_FLOW = '/api/dev/validate_flow';
export const GET_ALL_TRIGGER_DETAILS = '/api/get_trigger_details';
export const CHANGE_INITIAL_STEP = '/api/dev/update_initial_step';
export const TEST_INTEGRATION = '/api/integration/test';
export const GET_SEND_DATA_TO_DATALIST =
  '/api/dev/get_flow_to_data_list_details';
export const GET_FLOW_LANGUAGES_TRANSLATION_STATUS =
  '/api/get_flow_locale_translation_status';
export const GET_FLOW_DATA_BY_LOCALE = '/api/get_flow_details_by_locale';
export const SAVE_FLOW_DATA_BY_LOCALE = '/api/post_flow_details_by_locale';

// Report Engine
export const EXPORT_FLOW_DASHBOARD = '/api/export_flow_dashboard';
export const EXPORT_DATA_LIST_DASHBOARD = '/api/export_data_list_dashboard';
export const GET_SYSTEM_DATA_FILTERS = '/api/flows/StandardDataFilters';
export const GET_FLOW_DATA_FILTERS =
  '/api/flows/FlowDataFilters';
export const GET_DASHBOARD_REPORT_ENGINE_SYSTEM_DATA_FILTERS =
  '/api/flows/SystemDataFilters/values';
export const GET_DASHBOARD_REPORT_ENGINE_FLOW_DATA_FILTERS =
  '/api/flows/FlowDataFilters/values';
export const GET_DASHBOARD_REPORT_ENGINE_STANDARD_DATA_FILTERS =
  '/api/flows/StandardDataFilters/values';
export const REASSIGNMENT_TASK = 'api/reassign_task';

// Report export data using Lambda
export const GET_ADDITIONAL_ACTIONS_EXPORT_DATA =
  '/report/additional_actions/ExportData';

// DMS
export const GET_REPORT_DOWNLOAD_DOCS = '/dms/get_report_download_docs';

// Report Engine List
export const STANDARD_FLOW_FILTERS =
  '/report/flows/StandardFlowFilters';
export const STANDARD_FLOW_VALUES =
  '/report/flows/StandardFlowValues';

// Report Charts
export const GET_DEFAULT_CHART_BY_ID =
  '/report/defaultreports/GetDefaultReportById';

// Report Search
export const SAVE_SEARCH = '/report/reportmetadata/SaveReportMetadata';
export const GET_ALL_SEARCH_METADATA =
  '/report/reportmetadata/GetAllReportMetadata';
export const GET_SEARCH_METADATA_BY_ID =
  '/report/reportmetadata/getReportMetadataById';
export const GET_RECOMMENDED_REPORTS = 'ml/report_chart_suggestion';

export const DELETE_REPORT_BY_ID =
  '/report/reportmetadata/DeleteReportMetadata';

export const GET_REPORT_SEARCH_DATA =
  '/report/reportmetadata/GetAllReportMetadata'; //
// Report Data List
export const STANDARD_DATA_LIST_FILTERS =
  '/report/datalists/StandardDatalistFilters';
export const STANDARD_DATA_LIST_VALUES =
  '/report/datalists/StandardDatalistValues';

// Datalist Reports
export const GET_DATALIST_FILTERS = '/aggregate_report/get_datalist_filters/';
export const GET_DATALIST_VALUES = '/aggregate_report/get_datalist_values/';

// Flow Reports
export const GET_FLOW_FILTERS = '/aggregate_report/get_flow_filters/';
export const GET_FLOW_VALUES = '/aggregate_report/get_flow_values/';

export const GET_ALL_REPORTS = '/aggregate_report/get_all_report_metadata';

// Download for flow and Datalist
export const GET_AGGREGATE_REPORT_UTILITIES_EXPORT_DATA =
  '/aggregate_report/utilities/export_data/';

// Users
export const GET_ALL_USERS = '/api/get_all_users';
export const GET_USERS_BY_ID = '/api/user_by_id';
export const UPDATE_USER_PROFILE =
  '/api/update_user_profile?resolutions={"profile_pic":"medium"}';
export const UPDATE_USER = '/auth/update_user';
export const UPDATE_INVITE_USER_PROFILE = '/api/update_invite_user_profile/';

// Form
export const SAVE_FORM = '/api/dev/save_form';
export const SAVE_FORM_WITH_FIELD = '/api/dev/save_form_with_field';
export const VALIDATE_FORM = '/api/dev/validate_form';
export const SAVE_FIELD = '/api/dev/save_field';
export const GET_DATA_RULES = '/api/get_data_rules';
export const SAVE_TABLE = '/api/dev/save_table';
export const DELETE_FIELD = '/api/dev/delete_field';
export const DELETE_ACTION = '/api/dev/delete_actions';
export const SAVE_ACTION = '/api/dev/save_actions';
export const SAVE_FORM_HEADER = '/api/dev/save_form_header';
export const DELETE_FORM = '/api/delete_form';
export const DELETE_TABLE = '/api/dev/delete_table';
export const GET_FIRST_FORM_DETAILS = '/api/get_first_form_details';
export const GET_ALL_FLOW_STEP_WITH_FORM =
  '/api/get_all_flow_steps_with_form';
export const GET_ALL_FIELDS = '/api/get_all_fields_list_by_filter';
export const GET_ALL_FIELD_VALUES = '/api/get_all_field_values';
export const GET_ALL_FIELDS_LIST = '/api/get_all_fields_list';
export const GET_ALL_TABLE_FIELDS = '/api/get_all_tables_list_by_filter';
export const GET_ACTIONS = '/api/dev/get_actions';
export const UPDATE_FORM_FIELD_ORDER = '/api/dev/update_form_field_order';
export const SAVE_SECTION = 'api/dev/save_section';
export const DELETE_SECTION = 'api/dev/delete_section';
export const SECTION_ORDER = 'api/dev/section_order';
export const GET_FORM_DETAILS = '/api/get_form_details';
export const SAVE_FORM_CONTENT = '/api/dev/save_form_contents';
export const GET_FIELD_DETAILS = '/api/dev/field';
export const GET_INPUT_STEPS = 'api/dev/get_input_steps';

// Task
export const SAVE_TASK = '/api/save_task';
export const DELETE_TASK = '/api/delete_task';
export const GET_ACTIVE_TASKS = '/api/get_active_tasks';
export const GET_SORTED_ACTIVE_TASKS = '/api/get_sorted_active_tasks';
export const GET_SELF_TASKS = '/api/get_self_tasks';
export const GET_SORTED_SELF_TASKS = '/api/get_sorted_self_tasks';
export const GET_COMPLETED_TASKS = '/api/get_completed_tasks';
export const GET_SORTED_COMPLETED_TASKS = '/api/get_sorted_completed_tasks';
export const GET_TASKS_ASSIGNED_TO_OTHERS = '/api/get_all_view_task_metadata';
export const GET_TASKS_BOTH_ASSIGNED_TO_OTHERS =
  '/api/get_all_assigned_others_tasks';
export const GET_TASK_COUNT = '/api/get_task_count';
export const PUBLISH_TASK = '/api/publish_task';
export const GET_TASK_DETAILS = '/api/get_task_details_by_id';
export const GET_TASK_COMPLETED_ASSIGNEES = '/api/get_task_metadata_assignees';
export const SUBMIT_TASK = '/api/submit_task';
export const UPDATE_ACTIVE_TASK_DETAILS = '/api/update_active_task_details';
export const REPLICATE_TASK = '/api/get_replicated_task';
export const SNOOZE_TASK = '/api/snooze_task';
export const GET_TASK_PARTICIPANTS = '/api/get_task_participants';
export const GET_ALL_ACTIVE_TASKS_BY_IDS = '/api/get_all_active_tasks_by_ids';
export const UPDATE_TASK_STATUS = '/api/update_task_status';
export const REJECT_TASK = '/api/reject_task';
export const GET_ACTION_HISTORY_BY_INSTANCE_ID =
  '/api/get_action_history_by_filters';
export const GET_TASK_METADATA_RESPONSE_SUMMARY =
  '/api/get_task_metadata_response_summary';
export const GET_VALID_STEP_ACTIONS = '/api/get_valid_step_actions';
export const GET_VALID_FORM_FIELDS = '/api/get_form_fields_update';
export const GET_TASK_METADATA = '/api/get_task_metadata_by_id';
export const CANCEL_TASK = '/api/cancel_task';
export const GET_TASK_METADATA_PARTICIPANTS =
  '/api/get_task_metadata_participants';
export const ASSIGN_TASK_TO_PARTICIPANTS = '/api/assign_task_to_participants';
export const GET_ALL_INSTANCES = '/api/get_all_instances';
export const NUDGE_TASK = '/api/nudge_task';
export const GET_TASK_METADATA_ACTIVE_PARTICIPANTS =
  '/api/get_task_metadata_active_participants';
export const GET_DRAFT_TASKS = '/api/get_all_draft_tasks';
export const GET_EXPORT_TASK_DETAILS =
  '/api/download_task_metadata_response_summary';

// Chat Socket Path
export const CHAT_SOCKET_PATH = '/chat-engine';

// Chat Socket Path
export const NOTIFICATION_SOCKET_PATH = '/notification/in_app_ws/';

// File based API
export const GET_SIGNED_URL = '/api/get_upload_signed_url';
export const GET_TEMP_SIGNED_URL = '/api/get_temp_upload_signed_url';

// User level language get and update
export const GET_USER_PREFERENCE_DETAILS = '/api/get_user_preference_details';
export const UPDATE_USER_LANGUAGE_AND_TIMEZONE =
  '/api/update_user_language_and_timezone';

export const GENERATE_ENTITY_REFERENCE_NAME = '/api/dev/generate_entity_reference_name';
// Flow
export const SAVE_FLOW = '/api/dev/save_flow';

export const SAVE_ACTIONS = 'api/dev/save_actions';

export const SAVE_STEP_ACTIONS = 'api/dev/save_step_actions';

export const GET_STEP_ACTIONS = 'api/dev/get_step_actions';

export const GET_FORM_DETAILS_BY_FILTER = '/api/get_form_details_by_filter';

export const GET_REASSIGN_TASK = '/api/assign_back_accepted_task';

export const SAVE_STEP = '/api/dev/save_step';

export const DELETE_STEP = '/api/dev/delete_step';

export const DELETE_CONNECTOR_LINE = '/api/dev/delete_connector_line';

export const GET_ALL_NEXT_STEPS = '/api/dev/get_all_next_flow_steps';

export const INITIATE_FLOW_INSTANCE = '/api/initiate_flow_instance';

export const GET_FIELD_CONFIG_BY_ID = '/api/get_field_config_by_filter';

export const UPDATE_STEP_ORDER = '/api/dev/update_step_order';

export const VALIDATE_REFERENCE_NAME = '/api/validate_field_reference_name';
export const GET_ALL_DRAFT_FLOW = '/api/dev/flows/drafts';
export const GET_REFERENCE_NAME = '/api/get_reference_name';

export const GET_ALL_FLOW_CATEGORY_DEV = '/api/dev/get_all_flows_by_category';

export const GET_ALL_FLOW_CATEGORY = '/api/get_all_flows_by_category';

export const GET_FLOW_TASKS_BY_FILTER =
  '/api/get_flow_tasks_by_filter';

export const START_STEP = 'api/dev/start_step';

// Encryption

export const GET_ENCRYPT_DETAILS = 'auth/get_encrypt_details/';

export const GET_CHAT_ENCRYPT_DETAILS = 'chat/get_encrypt_details/';

export const GET_ML_ENCRYPT_DETAILS = 'ml/get_encrypt_details';

// Data List

export const SAVE_DATA_LIST = '/api/dev/save_data_list';

export const PUBLISH_DATA_LIST = '/api/dev/publish_data_list';

export const GET_ALL_VIEW_DATA_LISTS = '/api/get_all_sorted_view_data_lists';
// export const GET_ALL_WEIGHTED_DATA_LISTS = '/api/get_all_sorted_view_data_lists'

export const DELETE_DATA_LIST = '/api/delete_data_list';

export const DISCARD_DATA_LIST = '/api/discard_data_list';

export const GET_LATEST_DATA_LIST_DRAFT = '/api/get_latest_data_list_version';

export const GET_DATA_LIST_DETAILS_BY_UUID = '/api/get_data_list_by_uuid';

export const SUBMIT_DATA_LIST_ENTRY = '/api/submit_data_list_entry';

export const SUBMIT_BULK_DATA_LIST_ENTRY = '/api/submit_bulk_data_list_entry';

export const DELETE_DATA_LIST_ENTRY = '/api/delete_data_list_entry';

export const GET_DATA_LIST_ENTRY_DETAILS_BY_ID =
  '/api/get_data_list_entry_details_by_id';

export const GET_ALL_DATA_LIST_CATEGORY_DEV = '/api/dev/get_all_data_lists_by_category';

export const GET_ALL_DATA_LIST_CATEGORY = '/api/get_all_data_lists_by_category';

export const GET_ALL_DATA_LIST_ENTRY_DETAILS_BY_FILTER =
  '/api/get_data_list_entry_details_by_filter';
export const GET_NOTES_LIST = '/api/get_data_list_entry_notes';
export const GET_SCHEDULE_REMAINDER_BY_ID = '/api/get_schedule_reminder_by_id';
export const GET_SCHEDULE_REMAINDER_BY_FILTER =
  '/api/get_all_schedule_reminders_by_filter';

export const ADD_NOTES = '/api/add_data_list_entry_notes';

export const SAVE_LOOKUP = '/api/save_custom_lookup';
export const EDIT_LOOKUP = '/api/edit_custom_lookup';
export const GET_ALL_CUSTOM_LOOKUP = '/api/get_all_custom_lookup';
export const SAVE_SCHEDULE_REMAINDER = '/api/save_schedule_reminder';
export const DELETE_SCHEDULE_REMAINDER = '/api/delete_schedule_reminder';

export const GET_ALL_DRAFT_DATA_LIST = '/api/dev/data_list/drafts';

export const GET_DATA_LIST_TASKS_BY_FILTER =
  '/api/get_data_list_tasks_by_filter';

export const GET_USER_SECURITY_BY_OBJECT = '/api/get_users_by_object_security';

export const SAVE_NOTES = '/api/save_note';

export const GET_FLOW_NOTES = '/api/get_all_notes';

export const GET_FLOW_SHORTCUTS = '/api/get_child_instances';
export const GET_TRIGGER_NAMES = '/api/get_trigger_names';
export const GET_TRIGGERED_FLOW_NAMES = '/api/get_triggered_flow_names';

// RULE

export const GET_DEFAULT_VALUE_RULE_OPERATOR_BY_FIELD_TYPE =
  '/api/get_default_value_rule_operators_by_field_type';

export const GET_DATA_LIST_NOTES_CATEGORY = '/api/get_data_list_notes_category';

export const ADD_DATA_LIST_NOTES_CATEGORY = '/api/add_data_list_notes_category';

// ML

export const GET_FIELD_AUTOCOMPLETE = '/ml/field_autocomplete';
export const FIELD_TYPE_SUGGESTION = '/ml/field_type_suggestion';
export const GET_TASK_ASSIGNEE_SUGGESTION = '/ml/task_assignee_suggestion';
export const WELCOME_MESSAGE_GENERATION = '/ml/welcome_message_generation';
export const CREATE_TASK_FROM_PROMPT = '/ml/task_creation';
export const CREATE_FLOW_FROM_PROMPT = '/ml/flow_creation';
export const CREATE_DATALIST_FROM_PROMPT = '/ml/data_list_creation';
export const CREATE_APP_FROM_PROMPT = '/ml/app_creation';
export const GET_MODEL_LIST = '/ml/list_integration_models';
export const GET_MODEL_DETAIL = '/ml/integration_model_detail';
export const POST_CALL_MODEL = '/ml/integration_model_inference';
export const GET_ML_MODEL_FLOW_LIST = 'api/get_model_dependents';

// Category Admin

export const SAVE_CATEGORY = '/api/save_category';

export const GET_CATEGORY = '/api/get_all_category';

export const UPDATE_CATEGORY = '/api/edit_category';

export const DELETE_CATEGORY = '/api/delete_category';

// Admin Panel Account

export const GET_ADMIN_ACCOUNT = '/admin/get_all_accounts';

export const GET_ADMIN_ACCOUNT_DETAILS = '/admin/get_account_details_by_id';

export const GET_ADMIN_ACCOUNT_USAGE_SUMMARY =
  '/admin/get_account_usage_summary';

export const SAVE_ADMIN_ACCOUNT = '/admin/create_account';

export const UPDATE_ADMIN_ACCOUNT = '/admin/edit_account_details/';

export const GET_SIGNED_URL_ADMIN = '/admin/admin_get_upload_signed_url';

export const DELETE_ADMIN_ACCOUNT = '/api/delete_admin_account';

// Admin Account Summary - ML
export const GET_ACTIVE_USER_COUNT_REPORT = '/ml/active_user_count_report';
export const GET_SESSION_COUNT_REPORT = '/ml/session_count_report';
export const GET_ACTIONS_PER_SESSION_REPORT = '/ml/actions_per_session_report';
export const GET_RETENTION_RATE_REPORT = '/ml/retention_rate_report';

// Global Search

export const GLOBAL_SEARCH = '/api/get_global_search_details';
export const GLOBAL_SEARCH_DEV = '/api/dev/get_global_search_details';

// Billing Module

export const GET_PAYMENT_USERS_BY_ID = '/billing/get_payment_profile';

export const UPDATE_PAYMENT_PROFILE = '/billing/edit_payment_profile';

export const SAVE_OR_UPDATE_PAYMENT_METHOD = '/billing/save_payment_methods';

export const EDIT_PAYMENT_DATA = '/billing/save_payment_users';

export const GET_PAYMENT_PROFILE_DATA =
  '/billing/get_payment_profile_by_account_id';

export const GET_ALL_INVOICES = '/billing/get_all_invoices';

export const SAVE_PAYMENT_PROFILE = '/billing/save_payment_profile';

export const GET_COUNTRY_TAX_LIST = '/billing/get_all_tax_types';

export const SUBSRIPTION_BILLING = '/billing/get_periodic_invoice_details';

export const GET_ALL_SUBSCRIPTION = '/billing/get_all_subscription_details';

export const VERIFY_PAYMENT_METHOD = '/billing/verify_payment_method';

export const CHECK_PAYMENT_STATUS = '/billing/check_payment_status';

export const GET_PAYMENT_URL = '/billing/get_checkout_session_url';

export const MOST_USED_FLOW_LIST = 'aggregate_report/most_used_flow_metrics/';

export const TASK_FLOW_LIST = 'aggregate_report/open_tasks_flow_metrics/';

export const USER_TASK_FLOW_LIST = 'aggregate_report/open_tasks_user_flow_metrics/';

export const STATIC_METRICS = 'aggregate_report/static_metrics/';

export const USERS_SUMMARY_METRICS = 'aggregate_report/users_summary_metrics/';
export const GET_AUDIT_DATA = 'api/get_all_audit_data_by_filters';
export const GET_AUDIT_DATA_EDITORS = 'api/get_audit_data_editors';
export const GET_AUDIT_DATA_DETAILS = 'api/get_audit_data_by_id';
export const TRUNCATE_DATALIST_ENTRY = '/api/truncate_data_list_entries';

// Edit Anyway
export const EDIT_ANYWAY_FLOW = '/api/dev/edit_anyway_flow';
export const EDIT_ANYWAY_DATA_LIST = '/api/edit_anyway_datalist';
export const EDIT_ANYWAY_TASK = '/api/edit_anyway_task';

// Formula Builder
export const GET_FORMULA_BUILDER_FUNCTIONS =
  '/api/get_formula_builder_functions';
export const EXPRESSION_VERIFICATION = '/api/expression_verification';

// Notification
export const GET_ALL_NOTIFICATIONS = '/notification/notification_alert/';
export const READ_NOTIFICATION = '/notification/notification_alert/update_read';
export const GET_NOTIFICATION_COUNT = 'notification/notification_alert/count';

export const SAVE_TASK_COMMENT_LOG = '/api/save_task_comment_log';

// Integration
export const INTEGRATION_CONNECTOR = '/api/connector';
export const GET_OAUTH_CLIENT_CREDENTIALS = '/auth/list_all_oauth_client_credentials';
export const GENERATE_OAUTH_CLIENT_CREDENTIALS = '/auth/generate_oauth_client_credentials';
export const UPDATE_OAUTH_CLIENT_CREDENTIALS = '/auth/update_oauth_client_credentials';
export const DELETE_OAUTH_CLIENT_CREDENTIALS = '/auth/delete_oauth_client_credentials';
export const ENABLE_DISABLE_CLIENT_CREDENTIALS = '/auth/enable_or_disable_client_credentials';
export const DECRYPT_OAUTH_CLIENT_CREDENTIALS = '/auth/decrypt_oauth_client_credentials';
export const GET_EVENT_CATEGORY = '/api/get_event_categories';
export const VERIFY_OAUTH2_CREDENTIALS = 'api/verify_oauth2_credentials';
export const PUBLISH_CONNECTOR = '/api/publish_connector';
export const DELETE_CONNECTOR = '/api/connector/delete';
export const GET_INTEGRATION_TEMPLATES = '/api/integration_templates';
export const EDIT_ANYWAY_CONNECTOR = '/api/edit_anyway_connector';
export const DISCARD_CONNECTOR = '/api/discard_connector';
export const CHECK_INTEGRATION_DEPENDENCY = '/api/check_event_dependency';
export const WORKHALL_API_CONFIGURATION = '/api/api_configuration/';
export const GET_INITIATION_STEP_ACTIONS = '/api/get_initiation_step_actions/';
export const WORKHALL_API_PUBLISH = '/api/publish_api_configuration/';
export const DELETE_WORKHALL_API_CONFIURATION = 'api/delete_api_configuration/';
export const EDIT_ANYWAY_WORKHALL_API_CONFIGURATION = 'api/edit_anyway_api_configuration/';
export const DISCARD_WORKHALL_API_CONFIGURATION = 'api/discard_api_configuration/';
export const GET_LIST_API_KEYS = '/auth/list_all_api_keys';
export const GENERATE_API_KEY = '/auth/generate_api_key/';
export const UPDATE_API_KEY_DETAILS = '/auth/update_api_key_details';
export const DELETE_API_KEY = '/auth/delete_api_key';
export const DECRYPT_API_KEY = '/auth/decrypt_api_key';
export const GET_ALL_EVENTS = '/api/get_all_events';
export const ADD_INTEGRATION_EVENT = '/api/add_event';
export const REMOVE_INTEGRATION_EVENT = '/api/remove_event';

export const GET_ALL_VIEW_DATA_LIST = 'api/get_all_view_data_lists';

export const ENV_LIST = {
  DEV_ENV: 'workhall.dev',
  TEST_ENV: 'onething.io',
};

export const SORTED_VIEW_FLOW =
  '/api/get_sorted_view_flow_data_lists';

export const DB_CONNECTOR = '/api/dev/db_connector';
export const PUBLISH_DB_CONNECTOR = '/api/dev/publish_db_connector';
export const DISCARD_DB_CONNECTOR = '/api/dev/discard_db_connector';
export const EDIT_ANYWAY_DB_CONNECTOR = '/api/dev/edit_anyway_db_connector';
export const DELETE_DB_CONNECTOR = '/api/dev/delete_db_connector';
export const GET_TABLES_LIST = '/api/dev/get_tables_list';
export const GET_TABLE_INFO = '/api/dev/get_table_info';
export const FETCH_DB_DATA = '/api/fetch_db_data';
export const DB_CONNECTOR_QUERY = '/api/dev/db_connector_query';
export const PUBLISH_DB_CONNECTOR_QUERY = '/api/dev/publish_db_connector_query';
export const DELETE_DB_CONNECTOR_QUERY = '/api/dev/delete_db_connector_query';
export const GET_DB_CONNECTOR_SUPPORTED_OPTIONS = '/api/dev/get_db_connector_supported_options';

// Application
export const APPLICATION = '/api/dev/apps';
export const GET_APPLICATION_DATA_NORMAL = '/api/apps';
export const SAVE_APPLICATION = '/api/dev/apps';
export const DELETE_APPLICATOIN = '/api/dev/delete_app';
export const DISCARD_APPLICATION = '/api/dev/discard_app';
export const PUBLISH_APPLICATION = '/api/dev/publish_app';
export const EDIT_ANYWAY_APP = '/api/dev/edit_anyway_app';
export const UPDATE_APP_SECURITY = '/api/dev/update_app_security';
export const VALIDATE_APP = 'api/dev/validate_app';
export const UPDATE_APP_ORDER = 'api/dev/update_app_order/';

export const GET_PAGES_NORMAL = '/api/pages';
export const PAGES = '/api/dev/pages';
export const DELETE_PAGE = '/api/dev/delete_page';
export const SAVE_COORDINATES = '/api/save_coordinates';

export const GET_COMPONENTS = '/api/dev/components';
export const GET_COMPONENTS_NORMAL = '/api/components';
export const SAVE_COMPONENT = '/api/dev/components';
export const DELETE_COMPONENT = '/api/delete_component';
export const UPDATE_PAGE_ORDER = '/api/dev/update_page_order';
export const GET_LATEST_APP_VERSION = '/api/dev/get_latest_app_version';
export const UPDATE_APP_HEADER = '/api/update_app_header';

export const POST_VERIFY_WEBPAGE_EMBEDDING_URL = '/api/embed';
export const GET_WEBPAGE_EMBED_WHITELIST_URL = '/api/get_all_embed';
export const DELETE_WEBPAGE_EMBED_WHITELIST_URL = '/api/delete_embed';
export const SAVE_WEBPAGE_EMBED_WHITELIST_URL = '/api/save_embed';

// Reports
export const PUBLISH_REPORT = '/aggregate_report/publish_report_metadata';
export const GET_ALL_REPORT_METADATA = '/aggregate_report/get_all_report_metadata';
export const GET_REPORT_METADATA_BY_UUID = '/aggregate_report/get_report_metadata_by_uuid';
export const DELETE_REPORT_METADATA = '/aggregate_report/delete_report_metadata';

export const GET_CROSS_FILTERS = '/aggregate_report/get_cross_report_filters';
export const GET_CROSS_VALUES = '/aggregate_report/get_cross_report_values';

// Copilot
export const COPILOT_INFERENCE = '/ml/dbqa_inference';

// Rule Engine
export const GET_RULES = '/api/get_rules';
export const IMPORT_RULES = '/api/import_rules';
export const REMOVE_RULE = '/api/remove_rule';
export const SAVE_RULE = '/api/save_rule';
export const GET_RULE_OPERATORS_BY_FIELD_TYPE = '/api/get_rule_operators_by_field_type';
export const GET_RULE_DETAILS_BY_ID = '/api/get_rule_details_by_id';
export const GET_ESCALATIONS = '/api/dev/get_escalations';
export const GET_CONDITIONAL_RULES = '/api/get_conditional_rules';
export const GET_UNIQUE_RULE_NAME = '/api/get_unique_rule_name';
export const DELETE_CONDITIONAL_RULE = '/api/dev/delete_conditional_rule';
export const DELETE_DEFAULT_VALUE_RULE = '/api/dev/delete_conditional_rule';

// External Data Source
export const SAVE_INTEGRATION_RULE = '/api/save_integration_rule';
export const SAVE_DATA_LIST_QUERY_RULE = '/api/save_data_list_query_rule';
export const DELETE_DATA_RULE = '/api/dev/delete_data_rule';

// System Actions
export const SYSTEM_EVENT = '/api/dev/system_event';
export const DELETE_SYSTEM_EVENT = '/api/dev/delete_system_event';

// Datalist Landing page
export const GET_DATA_LIST_DETAILS_BY_ID = '/api/get_data_list_details_by_id';
export const GET_DATA_LIST_BASIC_INFO = '/api/dev/get_data_list_basic_info';
export const GET_DATA_LIST_SUMMARY_INFO = '/api/dev/get_data_list_summary_info';
export const GET_DATA_LIST_SECURITY_INFO = '/api/dev/get_data_list_security_info';
export const GET_DATA_LIST_ADDON_INFO = '/api/dev/get_data_list_add_on_info';

// Flow Landing page
export const GET_FLOW_BASIC_INFO = '/api/dev/get_flow_basic_info';
export const GET_FLOW_SUMMARY_INFO = '/api/dev/get_flow_summary_info';
export const GET_FLOW_SECURITY_INFO = '/api/dev/get_flow_security_info';
export const GET_FLOW_ADDON_INFO = '/api/dev/get_flow_add_on_info';

// Dashboard metadata / config
export const GET_DEFAULT_REPORT_BY_ID = '/api/dev/get_default_report_by_entity_id';
export const GET_DEFAULT_REPORT_BY_UUID = '/api/get_default_report_by_entity_uuid';
export const SAVE_DEFAULT_REPORT = '/api/dev/save_default_report';

// Individual Entry
export const GET_DEV_DASHBOARD_PAGES = '/api/dev/dashboard_pages';
export const GET_DASHBOARD_PAGES = '/api/dashboard_pages';
export const SAVE_DASHBOARD_PAGES = '/api/dev/dashboard_page';
export const PUT_DASHBOARD_PAGES = '/api/dev/dashboard_page';
export const DELETE_DASHBOARD_PAGES = '/api/dev/delete_dashboard_page';
export const SAVE_DASHBOARD_PAGE_COMPONENT = 'api/dev/dashboard_page_component';
export const REORDER_PAGE = '/api/dev/update_dashboard_page_order';
export const UPDATE_SYSTEM_DASHBOARD_PAGES = '/api/dev/update_system_dashboard_pages';
export const GET_DASHBOARD_PAGE_DATA_BY_ID = '/api/dev/dashboard_page';
export const SAVE_DASHBOARD_TABLE_PAGE_COMPONENT = 'api/dev/dashboard_page_table_component';
export const GET_DASHBOARD_FIELD = '/api/dev/dashboard_field';
export const ENTITY_FORM_TO_DASHBOARD_PAGE = '/api/dev/entity_form_to_dashboard_page';
export const GET_DASHBOARD_PAGE_FOR_USER_MODE = '/api/dashboard_page';
export const DELETE_DASHBOARD_PAGE_COMPONENT = '/api/dev/delete_dashboard_page_component';
export const GET_DASHBOARD_COMPONENT = '/api/dev/dashboard_component';
export const GET_DATA_LIST_ENTRY_BASIC_INFO = '/api/get_data_list_entry_basic_info';
export const GET_DATA_LIST_VERSION_HISTORY = '/api/dev/get_data_list_versions';

// Landing Page API
export const GET_DEV_FLOWS = '/api/dev/flows';
export const GET_DEV_DATALISTS = '/api/dev/data_lists';

export const GET_ALL_SYSTEM_FIELDS = '/api/get_all_system_fields';
