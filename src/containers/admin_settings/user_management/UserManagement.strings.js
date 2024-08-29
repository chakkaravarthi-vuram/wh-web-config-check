import { store } from '../../../Store';
import { translateFunction } from '../../../utils/jsUtility';
import { FORM_POPOVER_STATUS, ROLES } from '../../../utils/Constants';
import { USER_TYPE_STRINGS } from '../../../utils/strings/CommonStrings';
import { BS_LAYOUT_COL } from '../../../utils/UIConstants';

let U_M_STRINGS =
  store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS
    .USER_MANAGEMENT;

export const USER_STATUS_INDEX = {
  ALL: 2,
  ACTIVE: 1,
  INACTIVE: 0,
};

export const USER_TABLE_COL_SIZE = {
  FULL_NAME: BS_LAYOUT_COL.FOUR,
  USER_NAME: BS_LAYOUT_COL.TWO,
  EMAIL: BS_LAYOUT_COL.TWO,
  ROLE: BS_LAYOUT_COL.TWO,
  EDIT: BS_LAYOUT_COL.ONE,
  STATUS: BS_LAYOUT_COL.ONE,
};

export const getRolesListString = () => [
  {
    label: U_M_STRINGS.MEMBER_CARD_STRINGS_GENERAL_USER,
    value: 2,
  },
  {
    label: U_M_STRINGS.MEMBER_CARD_STRINGS_FLOW_CREATOR,
    value: 3,
  },
  {
    label: U_M_STRINGS.MEMBER_CARD_STRINGS_SUPER_ADMIN,
    value: 1,
  },
];

export const getUserManagementFormStrings = () => {
  return {
    MEMBER_LIST_ALERTS: {
      ADD_A_MEMBER: U_M_STRINGS.ADD_A_MEMBER,
      NEW_MEMBER_ADDED: U_M_STRINGS.NEW_MEMBER_ADDED,
    },
    USER_TYPE: {
      ID: 'user_type',
      LABEL: U_M_STRINGS.USER_TYPE,
    },
    FILTER: {
      PLACEHOLDER: U_M_STRINGS.FILTER,
      ID: 'filter',
    },
    USER_SEARCH: {
      PLACEHOLDER: U_M_STRINGS.SEARCH_USER,
      ID: 'user_auto_suggestion',
    },
    RESET_FILTER: U_M_STRINGS.RESET_FILTER,
    ADD_BUTTON: {
      TITLE: U_M_STRINGS.ADD_USER,
      ID: 'add_user',
    },
    INVITE_BUTTON: {
      TITLE: U_M_STRINGS.INVITE_USER,
      ID: 'invite_user',
    },
    NEW_CARD_USER_AUTO_SUGGESTION: {
      PLACEHOLDER: U_M_STRINGS.NEW_CARD_USER_AUTO_SUGGESTION,
      ID: 'new_card_user_auto_suggestion',
    },
    MEMBER_LIST: {
      PLACEHOLDER: U_M_STRINGS.CHANGE_ROLE,
    },
    ADD_FLOW_CREATOR: U_M_STRINGS.ADD_FLOW_CREATOR,
    ADD_ADMIN: U_M_STRINGS.ADD_ADMIN,
    MEMBER_CARD_HEIGHT: 66,
    BUFFER_HEIGHT: 213,
    TITLE: U_M_STRINGS.USER_MANAGEMENT,
    SUCCESSFUL_UPDATE: (t = translateFunction) => {
      return {
      title: t(U_M_STRINGS.UPDATED),
      subTitle: t(U_M_STRINGS.UPDATED_SUCCESSFULLY),
      status: FORM_POPOVER_STATUS.SUCCESS,
      isVisible: true,
      };
    },
    RESET_SUCCESSFUL_UPDATE: {
      title: 'Email sent successfully',
      subTitle: 'Reset mail sent to user',
      status: FORM_POPOVER_STATUS.SUCCESS,
      isVisible: true,
    },
    UPDATE_FAILURE: {
      title: U_M_STRINGS.ERROR,
      subTitle: U_M_STRINGS.UPDATE_FAILURE,
      status: FORM_POPOVER_STATUS.SERVER_ERROR,
      isVisible: true,
    },
    CONFIRM_DEACTIVATE_STRING:
      'Are you sure you want to deactivate you own profile?',
    CONFIRM_CHANGE_ROLE_STRING:
      'Are you sure you want to change your own role?',
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    RESPONSE_HANLDER_STRINGS: {
      PEOPLE: {
        TITLE: 'admin_settings.response_handler_strings.people.title',
        SUB_TITLE:
          'admin_settings.response_handler_strings.people.sub_title',
        SUB_TITLE_1: 'admin_settings.response_handler_strings.people.sub_title_1',
        SUB_TITLE_2: 'admin_settings.response_handler_strings.people.sub_title_2',
        BUTTON_TEXT: 'admin_settings.response_handler_strings.people.button_text',
        SEARCH_INPUT_TYPES: {
          INVALID: 'invalid',
          FULL_NAME: 'full_name',
          FIRST_NAME: 'first_name',
          EMAIL: 'email',
        },
      },
    },
  };
};

export const USER_TYPES_INDEX = {
  ALL_USERS: 5,
  GENERAL_USERS: ROLES.MEMBER,
  FLOW_CREATOR: ROLES.FLOW_CREATOR,
  SUPER_ADMIN: ROLES.ADMIN,
};

export const HEADER_STRINGS = {
  USER_NAME: 'admin_settings.user_management.heading_strings.user_name',
  FULL_NAME: 'admin_settings.user_management.heading_strings.full_name',
  ROLE: 'admin_settings.user_management.heading_strings.role',
  LAST_LOGGED_IN: 'admin_settings.user_management.heading_strings.last_logged_in',
  ADD: 'admin_settings.user_management.heading_strings.add',
};

export const addExistingUserButton = (userType, t) => {
  switch (userType) {
    case USER_TYPES_INDEX.FLOW_CREATOR:
      return `${t(HEADER_STRINGS.ADD)} ${USER_TYPE_STRINGS[ROLES.FLOW_CREATOR]}`;
    case USER_TYPES_INDEX.SUPER_ADMIN:
      return `${t(HEADER_STRINGS.ADD)} ${USER_TYPE_STRINGS[ROLES.ADMIN]}`;
    default:
      return null;
  }
};

export const getUserTypeDDStrings = () => {
  return {
    ID: 'user_type_index',
    OPTION_LIST: [
      {
        label: U_M_STRINGS.ALL_USERS,
        value: USER_TYPES_INDEX.ALL_USERS,
      },
      {
        label: U_M_STRINGS.FLOW_CREATORS,
        value: USER_TYPES_INDEX.FLOW_CREATOR,
        HELP_TEXT: U_M_STRINGS.FLOW_CREATORS_HELP_TEXT,
      },
      {
        label: U_M_STRINGS.SUPER_ADMINS,
        value: USER_TYPES_INDEX.SUPER_ADMIN,
        HELP_TEXT: U_M_STRINGS.SUPER_ADMINS_HELP_TEXT,
      },
    ],
  };
};

export const getUserTypeDDStringsOptions = () => {
  return {
    ID: 'user_type_index',
    OPTION_LIST: (t) => [
      {
        label: t(U_M_STRINGS.ALL_USERS),
        value: USER_TYPES_INDEX.ALL_USERS,
      },
      {
        label: t(U_M_STRINGS.FLOW_CREATORS),
        value: USER_TYPES_INDEX.FLOW_CREATOR,
        HELP_TEXT: t(U_M_STRINGS.FLOW_CREATORS_HELP_TEXT),
      },
      {
        label: t(U_M_STRINGS.SUPER_ADMINS),
        value: USER_TYPES_INDEX.SUPER_ADMIN,
        HELP_TEXT: t(U_M_STRINGS.SUPER_ADMINS_HELP_TEXT),
      },
    ],
  };
};

export const getUserStatusDDStrings = () => {
  return {
    ID: 'user_status_index',
    OPTION_LIST: (translate) => [
      // {
      //   label: 'All',
      //   value: USER_STATUS_INDEX.ALL,
      // },
      {
        label: translate('admin_settings.user_management.user_status.active'),
        value: USER_STATUS_INDEX.ACTIVE,
      },
      {
        label: translate('admin_settings.user_management.user_status.in_active'),
        value: USER_STATUS_INDEX.INACTIVE,
      },
    ],
  };
};

export const USER_TYPE_DD = getUserTypeDDStrings();

export const USER_TYPE_DD_OPTIONS = getUserTypeDDStringsOptions();

export const USER_STATUS_DD = getUserStatusDDStrings();

export const USER_MANAGEMENT_FORM = getUserManagementFormStrings();

export const ROLES_LIST = getRolesListString();

export const USER_MANAGEMENT_PAGINATION = {
  PAGINATION_DATA: {
    totalItemsCount: 10,
  },
};

export const MODAL_STATUS = {
  ADD_USER: 1,
  INVITE_USER: 2,
  CLOSE: 3,
};

export const ROW_COUNT_DROPDOWN = [
  {
    label: 5,
    value: 5,
  },
  {
    label: 10,
    value: 10,
  },
  {
    label: 25,
    value: 25,
  },
  {
    label: 50,
    value: 50,
  },
  {
    label: 100,
    value: 100,
  },
];

store.subscribe(() => {
  U_M_STRINGS =
    store.getState().LocalizationReducer.languageSettings.strings.ADMIN_SETTINGS
      .USER_MANAGEMENT;
});

export const MEMBER_LIST_POP_OVER_STRINGS = {
  DEACTIVE: {
    TITLE: 'admin_settings.user_management.deactivate.title',
    SUB_TITLE: 'admin_settings.user_management.deactivate.sub_title',
  },
  ACTIVE: {
    TITLE: 'admin_settings.user_management.active.title',
    SUB_TITLE: 'admin_settings.user_management.active.sub_title',
  },
};

export const RESET_PASSWORD = {
  RESET: 'admin_settings.user_management.reset_password',
};
export const USER_MANAGEMENT_HEADING = {
  HEADING: 'admin_settings.user_management.tab_title',
  YET_TO_LOGIN: 'admin_settings.user_management.yet_to_login',
  EDIT_USERS: 'admin_settings.user_management.edit_user',
  DEACTIVATE_USER_ICON: 'admin_settings.user_management.deactivate_user_icon',
  ACTIVATE_USER_ICON: 'admin_settings.user_management.activate_user_icon',
};
export const USAGE_DASHBOARD = {
  TAB_TITLE: 'admin_settings.usage_dashboard.title',
  USAGE_SUMMARY: 'admin_settings.usage_dashboard.usage_summary',
  USERS_SUMMARY: 'admin_settings.usage_dashboard.users_summary',
  FLOW_METRICS: 'admin_settings.usage_dashboard.flow_metrics',
};
export const USAGE_SUMMARY_TAB = {
   N_A: 'admin_settings.usage_dashboard.n_a',
   HEADING: 'admin_settings.usage_dashboard.usage_summary_tab.heading',
   TITLE: 'admin_settings.usage_dashboard.usage_summary_tab.title',
   SUB_TITLE: 'admin_settings.usage_dashboard.usage_summary_tab.sub_title',
   DATA_LIST_HEADING: 'admin_settings.usage_dashboard.usage_summary_tab.usage_summary_data_list.heading',
   DATA_LIST_TITLE: 'admin_settings.usage_dashboard.usage_summary_tab.usage_summary_data_list.title',
   DATA_LIST_SUB_TITLE: 'admin_settings.usage_dashboard.usage_summary_tab.usage_summary_data_list.sub_title',
   ADHOC_TASK_HEADING: 'admin_settings.usage_dashboard.usage_summary_tab.usage_summary_adhoc_task.heading',
   ADHOC_TASK_TITLE: 'admin_settings.usage_dashboard.usage_summary_tab.usage_summary_adhoc_task.title',
   ADHOC_TASK_SUB_TITLE: 'admin_settings.usage_dashboard.usage_summary_tab.usage_summary_adhoc_task.sub_title',
   THRESHOLD_LIMIT: 'admin_settings.usage_dashboard.users_summary_tab.threshold_limit',
   ACTIVE_USERS_BILL: 'admin_settings.usage_dashboard.users_summary_tab.active_users_bill',
   ACTIVE_USERS: 'admin_settings.usage_dashboard.users_summary_tab.active_users',
   ACTIVE_DEVELOPERS: 'admin_settings.usage_dashboard.users_summary_tab.active_developers',
};

export const RESET_MFA_STRINGS = {
  RESET_MFA: 'mfa.reset_mfa_string.reset_mfa',
  RESET_MFA_MODAL_CONTENT_LINE1: 'mfa.reset_mfa_string.modal_content_line1',
  RESET_MFA_MODAL_CONTENT_LINE2: 'mfa.reset_mfa_string.modal_content_line2',
  RESET_MFA_MODAL_DISABLE_BTN_TEXT: 'mfa.reset_mfa_string.modal_content_disable_btn',
  RESET_MFA_MODAL_CANCEL_BTN_TEXT: 'mfa.reset_mfa_string.modal_content_cancel_btn',
};
