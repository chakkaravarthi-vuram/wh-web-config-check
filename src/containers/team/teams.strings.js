import EditSecurityIcon from '../../assets/icons/teams/EditSecurityIcon';
import { translateFunction } from '../../utils/jsUtility';
import ManageMembersIcon from '../../assets/icons/teams/ManageMembersIcon';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const TEAMS_STRINGS = (t = translateFunction) => {
  return {
    TEAMS_LISTING: {
      SCROLL_ID: 'teamsListing',
      TABLE_HEADERS: [
        {
          id: 'Team Name',
          label: t('team.listing.table_headers.team_name'),
          widthWeight: 8,
          bodyStyleConfig: { isChangeIconColorOnHover: true },
        },
        {
          id: 'Members',
          label: t('team.listing.table_headers.members'),
          widthWeight: 2,
          bodyStyleConfig: { isChangeIconColorOnHover: true },
        },
      ],
      TAB: {
        OPTIONS: [
          {
            labelText: t('team.listing.header.organisational'),
            value: '2',
            tabIndex: 2,
          },
          {
            labelText: t('team.listing.header.system'),
            value: '1',
            tabIndex: 1,
          },
        ],
      },
      SORT_OPTIONS: [
        {
          label: 'Team Name (ASC)',
          value: 1,
        },
        {
          label: 'Team Name (DESC)',
          value: -1,
        },
      ],
      SHOWING: t('team.listing.showing'),
      CREATE_TEAM: t('team.listing.create_team'),
      CREATE_FIRST_TEAM: t('team.listing.create_first_team'),
      TEAMS: t('team.listing.teams'),
      TEAM: t('team.listing.team'),
      HOME: t('team.listing.home'),
      OF: t('team.listing.of'),
      MEMBERS: t('team.listing.members'),
      MEMBER: t('team.listing.member'),
      USERS: t('team.listing.users'),
      USER: t('team.listing.user'),
      SEARCH: t('team.details.search'),
    },
    CTA_LABELS: {
      UPDATE: t('team.cta_labels.update'),
      CREATE: t('team.cta_labels.create'),
      CANCEL: t('team.cta_labels.cancel'),
    },
    CREATE_TEAMS_TAB: {
      BASIC: 1,
      MANAGE_MEMBERS: 2,
      SECURITY: 3,
    },
    TEAM_DETAILS: {
      TAB: {
        OPTIONS: [
          {
            labelText: t('team.details.details_tab_header.team_members'),
            value: 1,
            tabIndex: 1,
          },
          {
            labelText: t('team.details.details_tab_header.security'),
            value: 2,
            tabIndex: 2,
          },
        ],
      },
      CREATED_ON: t('team.details.details_tab_header.created_on'),
      VIEW_MORE: t('team.details.details_tab_header.view_more'),
      VIEW_LESS: t('team.details.details_tab_header.view_less'),
    },
    STEPPER_DETAILS: [
      {
        text: 'Basic Details',
      },
      {
        text: 'Members',
      },
      {
        text: 'Security Settings',
      },
    ],
    LABEL_TEXT: {
      TEAM_NAME: t('team.create_edit_team.team_name'),
      TEAM_NAME_PLACEHOLDER: t('team.create_edit_team.type_team_name_placeholder'),
      TEAM_DESC: t('team.create_edit_team.team_description'),
      TEAM_DESC_PLACEHOLDER: t('team.create_edit_team.team_description_placeholder'),
    },
    COMMON_STRINGS: {
      ERROR: t('team.create_edit_team.error'),
      MANAGE_ERROR: t('team.create_edit_team.manage_member_error'),
      ERROR_SUBTITLE: t('team.create_edit_team.error_subtitle'),
      CREATE_TEAM: t('team.create_edit_team.create_team'),
      CREATE_TEAM_DESC: t('team.create_edit_team.create_team_desc'),
      BASIC_DETAILS: t('team.create_edit_team.edit_basic_settings'),
      CLOSE: t('team.create_edit_team.close'),
      ICON_SIZE: '16',
      DELETE_SELECTED: t('team.create_edit_team.delete_selected'),
      MANAGE_MEMBERS: t('team.create_edit_team.manage_members'),
      MANAGE_USERS: t('team.create_edit_team.manage_users'),
      MANAGE_TEAMS: t('team.create_edit_team.manage_teams'),
      SECURITY_SETTINGS: t('team.create_edit_team.security_settings'),
      ADD_MEMBERS: t('team.create_edit_team.add_members'),
      ADD_USERS: t('team.create_edit_team.add_users'),
      ADD_TEAMS: t('team.create_edit_team.add_teams'),
      EDIT_TEAM: t('team.create_edit_team.edit_team'),
      TEAM_NAME: t('team.create_edit_team.team_name'),
      QUERY: 'query',
      NO_DATA: t('team.no_search_team_data.title'),
      NO_DATA_SUBTITLE: t('team.no_search_team_data.subtitle'),
      NO_MEMBERS_FOUND: t('team.no_members_found'),
      NO_USERS_FOUND: t('team.no_users_found'),
      NO_TEAMS_FOUND: t('team.no_teams_found'),
      SEARCH_MEMBERS: t('team.create_edit_team.search_members'),
      SEARCH_TEAMS: t('team.create_edit_team.search_teams'),
      UPDATE_INFO: t('team.create_edit_team.update_info'),
    },
    VALIDATION_STRINGS: {
      MEMBERS: t('team.create_edit_team.members'),
      VISIBILITY_DATA: t('team.validation_strings.visibility_data'),
      MEMBER_REQUIRED: t('team.validation_strings.member_required'),
      VISIBILITY_REQUIRED: t('team.validation_strings.visibility_required'),
      MANAGE_MEMBERS_SELECTION: t('team.validation_strings.manage_members_selection'),
    },
    UTILS_CONSTANTS: {
      EDIT_BASIC_SETTINGS: t('team.create_edit_team.edit_basic_settings'),
      DELETE_TEAM: t('team.create_edit_team.delete_team'),
      USERS: t('team.create_edit_team.users'),
      TEAMS: t('team.create_edit_team.teams'),
      MEMBERS: t('team.create_edit_team.members'),
      USER_TYPE: t('team.create_edit_team.user_type'),
      TEAM_TYPE: t('team.create_edit_team.team_type'),
      MEMBER_TYPE: t('team.create_edit_team.member_type'),
      MEMBER_DETAILS: t('team.create_edit_team.member_details'),
      ALL_ADMIN: t('team.create_edit_team.security.all_admin'),
      ALL_ADMIN_DESCRIPTION: t('team.create_edit_team.security.all_admin_description'),
      ALL_DEVELOPERS: t('team.create_edit_team.security.all_developers'),
      ALL_DEVELOPERS_DESCRIPTION: t('team.create_edit_team.security.all_developers_description'),
      ALL_STANDARD_USERS: t('team.create_edit_team.security.all_standard_users'),
      ALL_STANDARD_USERS_DESCRIPTION: t('team.create_edit_team.security.all_standard_users_description'),
      SELECTIVE_MEMBERS: t('team.create_edit_team.security.selective_members'),
      SELECTIVE_MEMBERS_DESCRIPTION: t('team.create_edit_team.security.selective_members_description'),
      ALL_TEAM_MEMBERS: t('team.create_edit_team.security.all_team_members'),
      ALL_TEAM_MEMBERS_DESCRIPTION: t('team.create_edit_team.security.all_team_members_description'),
      TEAM_CREATOR: t('team.create_edit_team.security.team_creator'),
      TEAM_CREATOR_DESCRIPTION: t('team.create_edit_team.security.team_creator_description'),
      EDIT_TEAM: t('teams.teams_translation.edit_team'),
      DELETED_TEAM: t('teams.teams_translation.delete_team'),
      MEMBER: t('team.details.table_headers.members'),
      MEMBERS_TYPE: t('team.details.table_headers.member_type'),
    },
    ACTION_STRINGS: {
      TEAM_NAME_EXIST: t('team.action_strings.team_name_exist'),
      TEAM_NAME_EXIST_IN: t('team.action_strings.team_name_exist_in'),
      LIMIT_EXCEEDED: t('team.action_strings.limit_exceeded'),
      TEAM_EXIST: t('team.action_strings.team_exist'),
      TEAM_UPDATED: t('team.action_strings.team_updated'),
      TOAST_SUCCESS: t('team.action_strings.toast_success'),
      TOAST_FAILURE: t('team.action_strings.toast_failure'),
      TEAM_CREATED: t('team.action_strings.team_created'),
      TEAM_MEMBER_DELETED: t('team.action_strings.team_member_deleted'),
      DELETE_MEMBER_FAILED: t('team.action_strings.delete_member_failed'),
      DELETE_MEMBER_FAILED_SUBTITLE: t('team.action_strings.delete_member_failed_subtitle'),
      DELETE_TEAM_SUCCESS: t('team.action_strings.delete_team_success'),
      DELETE: t('team.action_strings.delete'),
      UPDATE_MEMBER_FAILED: t('team.action_strings.update_member_failed'),
      CYCLIC_DEPENDENCY_DETECTED: t('team.action_strings.cyclic_dependency_detected'),
      DONT_DELETE: t('team.action_strings.dont_delete'),
      YES_DELETE: t('team.action_strings.yes_delete'),
      DELETE_SURE_USERS: t('team.action_strings.delete_sure_users'),
      DELETE_SURE_TEAMS: t('team.action_strings.delete_sure_teams'),
      TEAM_NOT_EXIST: t('team.action_strings.team_not_exist'),
      USER_NOT_EXIST: t('team.action_strings.user_not_exist'),
      DEVELOPER_NOT_EXIST: t('team.action_strings.developer_not_exist'),
    },
    FORM_ID: {
      TEAM_NAME: 'teamName',
      TEAM_DESC: 'teamDesc',
    },
    KEYS: {
      EXCLUDE_USERS: 'excludeUsers',
      EXCLUDE_TEAMS: 'excludeTeams',
      SELECTED_USERS: 'selectedUsers',
      SELECTED_TEAMS: 'selectedTeams',
      OWNER_USER: 'owners,users',
      VISIBILITY_USERS: 'visibility,others,users',
    },
    TEAMS_TAB: {
      BASIC_DETAILS: 1,
      MANAGE_MEMBERS: 2,
      SECURITY: 3,
    },
    SECURITY_OPTION: {
      VISIBILITY: {
        ALL_DEVELOPERS: 2,
        ALL_STANDARD_USERS: 3,
        SELECTIVE_USERS: 4,
      },
      OWNER: {
        ALL_DEVELOPERS: 2,
        ALL_STANDARD_USERS: 5,
        SELECTIVE_DEVELOPER: 3,
      },
    },
    SECURITY: {
      OWNER_LABEL: t('team.create_edit_team.security.security_manage_members'),
      VISIBILITY_LABEL: t('team.create_edit_team.security.visibility'),
      CHOOSE_DEVELOPERS: t('team.create_edit_team.security.choose_devs'),
      SELECTED_USER_OR_TEAM: t('team.create_edit_team.security.choose_users_teams'),
    },
    BUTTON_TEXT: {
      CANCEL: t('team.cancel'),
      NEXT: t('team.next'),
      ADD: t('team.add'),
      SAVE: t('team.save'),
    },
  };
};

export const TEAMS_TABS = (t) => [
  {
      labelText: t('team.create_edit_team.manage_members'),
      value: 2,
      tabIndex: 2,
      Icon: ManageMembersIcon,
  },
  {
      labelText: t('team.create_edit_team.security_settings'),
      value: 3,
      tabIndex: 3,
      Icon: EditSecurityIcon,
  },
];

export const TEAM_MEMBER_PATH = {
  ORGANISATIONAL: 'team.details.team_type.public_teams',
  SYSTEM: 'team.details.team_type.system_teams',
  PRIVATE: 'team.details.team_type.private_teams',
  TEAMS: 'teams.teams_translation.teams',
};

export const TEAM_MEMBERS_TAB_INDEX = {
  TEAM_MEMBERS: 1,
  SECURITY: 2,
};

export const getPopOverStatusParams = (title = EMPTY_STRING, subTitle = EMPTY_STRING, status = 1) => {
  return {
      title: title,
      subTitle: subTitle,
      isVisible: true,
      status: status,
  };
};
