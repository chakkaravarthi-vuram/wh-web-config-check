/**
 * @author Asttle
 * @email asttlej@vuram.com
 * @create date 2019-11-20 09:25:02
 * @modify date 2019-11-20 09:25:02
 * @desc [description]
 */

import { TEAM_TABS } from '../containers/team/teams.utils';

// auth
export const SIGNUP = '/signup';
export const SIGNIN = '/login';
export const SIGNIN_OLD = '/signin/';
export const SIGNIN_OLD_WITHOUT_SLASH = '/signin';
export const SIGNIN_OLD_USERNAME = '/signin/user_name';
export const SIGNIN_OLD_USERNAME_SLASH = '/signin/user_name/';
export const FORGOT_PASSWORD = '/forgot_password';
export const RESET_PASSWORD = '/reset_password';
export const INVITE_USER_LOGIN = '/invite_user/';
export const UPDATE_FORGOT_PASSWORD = '/update_forget_password/';
export const MFA_SETUP = '/mfa_setup';
export const MFA_OTP_VERIFICATION = '/mfa_otp_verification';
export const MFA_OTP_ENFORCED = '/mfa_enforced';
// teams and users
export const CREATE_TEAM = '/create_team';
export const TEAMS = '/teams';
export const PRIVATE_TEAMS = '/private_teams';
export const PUBLIC_TEAMS = '/teams/public-teams';
export const ALL_USERS = '/all_users/';
export const TEAM_CREATE_TEAM = '/teams/create_team';
export const TEAMS_EDIT_TEAM = '/teams/edit_team/';
export const MATCH_PARAMS_EDIT_TEAM = ':teamid';

// settings
export const USER_SETTINGS = '/user_settings';
export const ADMIN_SETTINGS = '/admin_settings';
export const CREATE_MEMBERS = '/create_member';
export const MATCH_PARAMS_INVITE_USER_ID = ':iid';
export const MATCH_PARAMS_INVITE_USER_ID_KEY = 'iid';

// admin settings
export const ACCOUNT_SETTINGS = '/account_settings';
export const USER_MANAGEMENT = '/user_management';
export const USAGE_DASHBOARD_USAGE_SUMMARY = '/usage_dashboard_usage_summary';
export const USAGE_DASHBOARD_USERS_SUMMARY = '/usage_dashboard_users_summary';
export const USAGE_DASHBOARD_FLOW_METRICS = '/usage_dashboard_flow_metrics';
export const LIBRARY_MANAGEMENT = '/library_management';
export const LANGUAGE_CALENDAR = '/language_calendar';
export const OTHER_SETTINGS = '/other_settings';
export const NOTICE_BOARD_SETTINGS = '/notice_board_settings';

// task
export const TASKS = '/tasks';
export const COMPLETED_TASKS = 'completedTasks';
export const CREATE_EDIT_TASK = '/createTask';
export const ASSIGNED_TO_OTHERS_TASKS = 'assignedToOthers';
export const SELF_TASK = 'self_task';
export const OPEN_TASKS = 'myTasks';
export const DRAFT_TASK = 'draftTasks';
export const SNOOZED_TASK = 'snoozedTasks';

// flow
export const CREATE_FLOW = '/createFlow';
export const EDIT_FLOW = '/editFlow/';

export const FLOW_DASHBOARD = '/flow_details';
export const TEST_BED = 'testBed';
export const LIST_FLOW = '/flows/';
export const FLOW_OVERVIEW = 'overview';
export const MY_PUBLISHED_FLOW = 'myPublishedFlows';
export const MY_DRAFT_FLOWS = 'myDraftFlows';
export const ALL_PUBLISHED_FLOWS = 'allPublishedFlows';
export const FLOWS_MANAGED_BY_YOU = 'flowsManagedByYou';
export const FLOWS_MANAGED_BY_OTHERS = 'flowsManagedByOthers';
export const FLOW_TEST_BED_MANAGED_BY_YOU = 'flowTestBedManagedByYou';
export const FLOW_TEST_BED_MANAGED_BY_OTHERS = 'flowTestBedManagedByOthers';
export const FLOW_DRAFT_MANAGED_BY_YOU = 'flowDraftManagedByYou';
export const FLOW_DRAFT_MANAGED_BY_OTHERS = 'flowDraftManagedByOthers';
export const FLOW_MATCH_PARAM_TAB = ':tab';

// data list
export const CREATE_DATA_LIST = '/createDatalist';
export const DATA_LIST_DASHBOARD = '/data_list_details';
export const DATALIST_USERS = '/users';
export const LIST_DATA_LIST = '/data_lists/';
export const DATALIST_OVERVIEW = 'overview';
export const MY_PUBLISHED_DATALIST = 'myPublishedDatalists';
export const MY_DRAFT_DATALIST = 'myDraftDatalists';
export const EDIT_DATA_LIST = '/editDatalist';
export const CREATE_DATA_LIST_FROM_LISTING = '/data_lists/createDatalist';
export const DATA_LIST = '/datalist';
export const ALL_REQUESTS = 'allRequests';

// others
export const REPORT_ID = '/report_id';
export const MATCH_PARAMS_PID = ':pid';
export const MATCH_PARAMS_TAB = ':tab';
export const MATCH_PARAMS_UUID = ':uuid';
export const MATCH_PARAMS_ACTION_ID = ':actionId';
export const MATCH_PARAMS_SUB_ACTION_TYPE = ':subAction';
export const MATCH_PARAMS_FLOW_TAB = ':flowTab';
export const MATCH_PARAMS_DATALIST_TAB = ':DlTab';
export const MATCH_PARAMS_DATALIST_DETAIL_TAB = ':dlDetailTab';
export const MATCH_PARAMS_DATALIST_HEADER_TAB = ':dlTab';
export const MATCH_PARAMS_FLOW_INSTANCE_UUID = ':flowInstanceId';
export const MATCH_PARAMS_DATALIST_INSTANCE_UUID = ':datalistInstanceId';
export const MATCH_PARAMS_REPORT_INSTANCE_ID = ':reportInstanceId';
export const CHECKLIST_WORKFLOW_POLICY = '/checklist_workflow_policy';
export const PRIVACY_POLICY = '/privacy_policy';
export const HOME = '/';
export const ADMIN_HOME = '/';
export const MEMBER_HOME = '/';
export const FLOW_CREATOR_HOME = '/';
export const CHAT = '/chat';

export const BILLING = '/billing';
export const PASSWORD = '/login/password';
export const CHOOSE_ACCOUNT = '/login/choose-account';
export const BILLING_STATUS = '/payment_status';

// admin panel
export const ADMIN_ACCOUNTS = '/super-admin/:tab';
export const MATCH_PARAMS_ADMIN_ACCOUNTS_ID = '/:id';
export const ADMIN_ACCOUNTS_INITIAL = 'super-admin';
export const ADMIN_ACCOUNTS_ACCOUNTS = 'accounts';
export const ADMIN_ACCOUNTS_SUMMARY = 'accountSummary';

// Signup routes
export const SIGNUP_CREATE = '/create-account';
export const SIGNUP_CREATE_EMAIL = '/create-account/email';
export const SIGNUP_CREATE_OTP = '/create-account/otp';
export const SIGNUP_CREATE_ACCOUNT_DETAILS = '/create-account/account-details';

// Integration routes
export const WORKHALL_INTEGRATION = 'workhallAPI';
export const API_CREDENTIAL = 'apiCredential';
export const DRAFT_INTEGRATION = 'drafts';
export const EDIT_INTEGRATION = 'edit';
export const EXTERNAL_INTEGRATION = 'externalAPI';
export const INTEGRATIONS = '/integration';
export const ADD_INTEGRATION = 'addIntegration';
export const AUTHORIZE_APP = '/authorizeApp';
export const EXTERNAL_DB_CONNECTION = 'externalDBConnection';

export const COMMON_ROUTE_CONSTANT_LIST = [SIGNUP, SIGNIN, SIGNIN_OLD_WITHOUT_SLASH, SIGNIN_OLD, FORGOT_PASSWORD, RESET_PASSWORD, PRIVACY_POLICY, UPDATE_FORGOT_PASSWORD, INVITE_USER_LOGIN, PASSWORD, CHOOSE_ACCOUNT, SIGNUP_CREATE, SIGNUP_CREATE_EMAIL, SIGNUP_CREATE_OTP, SIGNUP_CREATE_ACCOUNT_DETAILS, SIGNIN_OLD_USERNAME, SIGNIN_OLD_USERNAME_SLASH, MFA_SETUP, MFA_OTP_VERIFICATION];
// ml model routes
export const ML_MODELS = '/mlmodels';
export const ML_MODEL_DETAIL = 'model_details';
export const MATCH_PARAMS_MODEL_CODE = ':modelCode';

export const MATCH_PARAMS = {
    UUID: 'uuid',
    TAB: 'tab',
    ACTION: 'action',
};

export const AUTH_ROUTE_CONSTANT_LIST = [SIGNUP, SIGNIN, SIGNIN_OLD_WITHOUT_SLASH, SIGNIN_OLD, FORGOT_PASSWORD, RESET_PASSWORD, PASSWORD, CHOOSE_ACCOUNT, SIGNUP_CREATE, SIGNUP_CREATE_EMAIL, SIGNUP_CREATE_OTP, SIGNUP_CREATE_ACCOUNT_DETAILS, PRIVACY_POLICY, SIGNIN_OLD_USERNAME, SIGNIN_OLD_USERNAME_SLASH, MFA_SETUP, MFA_OTP_VERIFICATION];

export const DASHBOARD = '/dashboard';
export const MATCH_PARAMS_DASHBOARD_ID = ':dashboardId';
export const NEW_REPORT = 'newReport';
// Report
export const MATCH_PARAMS_REPORT_ACTION_TYPE = ':reportActionType';
export const MATCH_PARAMS_REPORT_SUB_ACTION_TYPE = ':reportSubActionType';

export const REPORT_LIST = 'reportList';
export const PUBLISHED_REPORT_LIST = 'publishedReportList';
export const DRAFTS_REPORT_LIST = 'draftsReportList';

export const REPORT_CONFIG = 'reportConfig';
export const CREATE_REPORT_CONFIG = 'createReportConfig';
export const EDIT_REPORT_CONFIG = 'editReportConfig';
export const MATCH_PARAMS_REPORT_CONFIG_ID = ':reportConfigId';

export const EDIT_REPORT_SECURITY = 'editReportSecurity';
export const EDIT_REPORT_BASIC_DETAILS = 'editReportBasicDetails';

export const REPORT = 'reports';
export const CREATE_REPORT = 'createReport';
export const VIEW_REPORT = 'viewReport';
export const EDIT_REPORT = 'editReport';
export const MATCH_PARAMS_REPORT_ID = ':reportId';
export const REPORT_INSTANCE_VIEWER = 'reportInstanceViewer';
//

// APP ROUTES
export const CREATE_APP = '/createApp';
export const LIST_APPLICATION = '/applications';
export const PUBLISHED_APP_LIST = '/publishedApps';
export const DRAFT_APP_LIST = '/draftApps';
export const EDIT_APP = '/editApp';
export const APP_ID = ':app_uuid';
export const APP_NAME = ':app_name';

export const APP = '/app/';
export const PAGE = '/page/';
export const PAGE_ID = ':page_uuid';
export const PAGE_NAME = ':page_name';
export const DEV_USER = '/developerMode';
export const DEFAULT_APP_ROUTE = '/app/default/home';
export const APP_DMS = {
 PARAMS: {
  IMG: {
    IS_EDIT_TRUE: 'is_edit=true',
  },
 },
};

export const LANDING_PAGE_ROUTES = [DEV_USER, `${DEV_USER}/`];

// Admin Constant
export const TASK_SCREENS = {
  PARAMS_TAB_PID: `${TASKS}/${MATCH_PARAMS_TAB}/${MATCH_PARAMS_PID}`,
  PARAMS_TAB: `${TASKS}/${MATCH_PARAMS_TAB}`,
  DRAFT_PARAMS_PID: `${TASKS}/${DRAFT_TASK}/${MATCH_PARAMS_PID}`,
};

export const DATA_LIST_SCREENS = {
  DASHBOARD_PARAMS_UUID_REPORT_ID: `${DATA_LIST_DASHBOARD}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_DATALIST_INSTANCE_UUID}/${MATCH_PARAMS_SUB_ACTION_TYPE}/${MATCH_PARAMS_REPORT_ID}`,
  DASHBOARD_PARAMS_UUID_ACTION_TYPE: `${DATA_LIST_DASHBOARD}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_DATALIST_INSTANCE_UUID}/${MATCH_PARAMS_SUB_ACTION_TYPE}`,
  DASHBOARD_PARAMS_UUID_ACTION_ID: `${DATA_LIST_DASHBOARD}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_DATALIST_INSTANCE_UUID}`,
  DASHBOARD_PARAMS_UUID: `${DATA_LIST_DASHBOARD}/${MATCH_PARAMS_UUID}`,
  USERS_PARAMS_UUID_REPORT_ID: `${DATALIST_USERS}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_DATALIST_INSTANCE_UUID}/${MATCH_PARAMS_SUB_ACTION_TYPE}/${MATCH_PARAMS_REPORT_ID}`,
  USERS_PARAMS_UUID_ACTION_TYPE: `${DATALIST_USERS}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_DATALIST_INSTANCE_UUID}/${MATCH_PARAMS_SUB_ACTION_TYPE}`,
  USERS_PARAMS_UUID_ACTION_ID: `${DATALIST_USERS}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_DATALIST_INSTANCE_UUID}`,
  USERS_PARAMS_UUID: `${DATALIST_USERS}/${MATCH_PARAMS_UUID}`,
  DASHBOARD_PARAMS_UUID_DATALIST_TAB: `${DATA_LIST_DASHBOARD}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_DATALIST_TAB}`,
  DASHBOARD_PARAMS_UUID_DATALIST_INSTANCE: `${DATA_LIST_DASHBOARD}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_DATALIST_TAB}/${MATCH_PARAMS_DATALIST_INSTANCE_UUID}`,
};

export const DATA_LIST_LANDING_PAGE = {
  DASHBOARD: `${DATA_LIST}/${MATCH_PARAMS_UUID}`,
  DASHBOARD_WITH_TAB: `${DATA_LIST}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_DATALIST_HEADER_TAB}`,
  DASHBOARD_WITH_SUB_TAB: `${DATA_LIST}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_DATALIST_HEADER_TAB}/${MATCH_PARAMS_DATALIST_DETAIL_TAB}`,
};

export const FLOW_SCREENS = {
  TEXT_BED_PARAMS_UUID_REPORT_ID: `${FLOW_DASHBOARD}/${TEST_BED}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_FLOW_INSTANCE_UUID}/${MATCH_PARAMS_SUB_ACTION_TYPE}/${MATCH_PARAMS_REPORT_ID}`,
  TEXT_BED_PARAMS_UUID_ACTION_TYPE: `${FLOW_DASHBOARD}/${TEST_BED}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_FLOW_INSTANCE_UUID}/${MATCH_PARAMS_SUB_ACTION_TYPE}`,
  TEXT_BED_PARAMS_UUID_ACTION_ID: `${FLOW_DASHBOARD}/${TEST_BED}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_FLOW_INSTANCE_UUID}`,
  TEXT_BED_PARAMS_UUID: `${FLOW_DASHBOARD}/${TEST_BED}/${MATCH_PARAMS_UUID}`,
  PARAMS_UUID_REPORT_ID: `${FLOW_DASHBOARD}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_FLOW_INSTANCE_UUID}/${MATCH_PARAMS_SUB_ACTION_TYPE}/${MATCH_PARAMS_REPORT_ID}`,
  PARAMS_UUID_ACTION_TYPE: `${FLOW_DASHBOARD}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_FLOW_INSTANCE_UUID}/${MATCH_PARAMS_SUB_ACTION_TYPE}`,
  PARAMS_UUID_ACTION_ID: `${FLOW_DASHBOARD}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_FLOW_INSTANCE_UUID}`,
  PARAMS_UUID: `${FLOW_DASHBOARD}/${MATCH_PARAMS_UUID}`,
  PARAMS_TAB: LIST_FLOW + FLOW_MATCH_PARAM_TAB,
  PARAMS_UUID_FLOW_TAB: `${FLOW_DASHBOARD}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_FLOW_TAB}`,
  PARAMS_UUID_FLOW_INSTANCE: `${FLOW_DASHBOARD}/${MATCH_PARAMS_UUID}/${MATCH_PARAMS_FLOW_TAB}/${MATCH_PARAMS_FLOW_INSTANCE_UUID}`,
};

export const APPLICATION_SCREENS = {
  PUBLISHED_LIST: `${LIST_APPLICATION}${PUBLISHED_APP_LIST}`,
  DRAFT_LIST: `${LIST_APPLICATION}${DRAFT_APP_LIST}`,
  EDIT_APP: `${EDIT_APP}/${APP_ID}`,
};

export const TEAMS_SCREENS = {
  PARAMS_TAB_ACTION_ID: `${TEAMS}/${MATCH_PARAMS_TAB}/${MATCH_PARAMS_ACTION_ID}`,
  PARAMS_TAB: `${TEAMS}/${MATCH_PARAMS_TAB}`,
  PUBLIC: `${TEAMS}/${TEAM_TABS.PUBLIC}`,
  PRIVATE: `${PRIVATE_TEAMS}/${MATCH_PARAMS_TAB}`,
};

export const REPORT_SCREENS = {
  LIST_PARAMS_REPORT_ACTION: `/${REPORT_LIST}/${MATCH_PARAMS_REPORT_ACTION_TYPE}`,
  CONFIG_PARAMS_REPORT_ACTION: `/${REPORT_CONFIG}/${MATCH_PARAMS_REPORT_ACTION_TYPE}`,
  CONFIG_PARAMS_REPORT_CONFIG: `/${REPORT_CONFIG}/${MATCH_PARAMS_REPORT_ACTION_TYPE}/${MATCH_PARAMS_REPORT_CONFIG_ID}`,
  VIEW_PARAMS_REPORT_ID: `/${REPORT}/${VIEW_REPORT}/${MATCH_PARAMS_REPORT_ID}`,
  VIEW_PARAMS_REPORT_INSTANCE_ID: `/${REPORT}/${VIEW_REPORT}/${MATCH_PARAMS_REPORT_ID}/${MATCH_PARAMS_REPORT_INSTANCE_ID}`,
  CREATE: `/${REPORT}/${CREATE_REPORT}`,
  CREATE_PARAMS_REPORT_SUB_ACTION: `/${REPORT}/${CREATE_REPORT}/${MATCH_PARAMS_REPORT_SUB_ACTION_TYPE}`,
  CREATE_PARAMS_REPORT_INSTANCE_ID: `/${REPORT}/${CREATE_REPORT}/${MATCH_PARAMS_REPORT_SUB_ACTION_TYPE}/${MATCH_PARAMS_REPORT_INSTANCE_ID}`,
  EDIT_PARAMS_REPORT_ID: `/${REPORT}/${EDIT_REPORT}/${MATCH_PARAMS_REPORT_ID}`,
  EDIT_PARAMS_REPORT_SUB_ACTION: `/${REPORT}/${EDIT_REPORT}/${MATCH_PARAMS_REPORT_ID}/${MATCH_PARAMS_REPORT_SUB_ACTION_TYPE}`,
  EDIT_PARAMS_REPORT_INSTANCE_ID: `/${REPORT}/${EDIT_REPORT}/${MATCH_PARAMS_REPORT_ID}/${MATCH_PARAMS_REPORT_SUB_ACTION_TYPE}/${MATCH_PARAMS_REPORT_INSTANCE_ID}`,

};

export const DASHBOARD_SCREENS = {
  PARAMS_DASHBOARD_ID: `${DASHBOARD}/${MATCH_PARAMS_DASHBOARD_ID}`,
  NEW_REPORT: `${DASHBOARD}/${MATCH_PARAMS_DASHBOARD_ID}/${NEW_REPORT}`,
  REPORT_PARAMS_REPORT_ID: `${DASHBOARD}/${MATCH_PARAMS_DASHBOARD_ID}/${REPORT}/${MATCH_PARAMS_REPORT_ID}`,
};

export const SUPER_ADMIN_SCREENS = {
  PARAMS_ACCOUNT_ID: ADMIN_ACCOUNTS + MATCH_PARAMS_ADMIN_ACCOUNTS_ID,
};

export const AUTH_SCREENS = {
  UPDATE_FORGOT_PASSWORD_PARAMS_PID: UPDATE_FORGOT_PASSWORD + MATCH_PARAMS_PID,
  INVITE_USER_PARAMS_ID: INVITE_USER_LOGIN + MATCH_PARAMS_INVITE_USER_ID,
};

export const ACCOUNT_DETAILS = {
ACCOUNT: '/super-admin/accounts',
EDIT_ACCOUNT_ID: '/super-admin/edit-account/',
ADMIN_ACCOUNT: '/super-admin/accounts/',
CREATE_ACCOUNT: '/super-admin/create-account',
};

export const CREATE_SEARCH_PARAMS = {
  FLOW: 'flow',
  DATALITS: 'datalist',
};
