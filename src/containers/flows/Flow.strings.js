// import { translate } from 'language/config';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';
// import FLOW_T_STRINGS from './FlowTranslations.strings';
import { store } from '../../Store';

let FLOW_T_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.FLOWS;

export const MY_FLOW_TAB_INDEX = {
  PUBLISHED: 1,
  UN_PUBLISHED: 2,
};

export const getFlowStrings = () => {
  return {
    FLOW_NAME: {
      ID: 'flow_name',
    },
    FLOW_CARD: {
      VIEW: FLOW_T_STRINGS.FLOW_CARD_VIEW,
      START: FLOW_T_STRINGS.FLOW_CARD_START,
      EDIT: FLOW_T_STRINGS.FLOW_CARD_EDIT,
    },
    FLOW_API_CALL_STRINGS: {
      GET_FLOWS: 'GET_FLOWS',
      INPUT_HANDLER: 'INPUT HANDLER',
      LOAD_DATA: 'LOAD DATA',
    },
    MY_FLOW_TAB_INDEX: {
      PUBLISHED: 1,
      UN_PUBLISHED: 2,
    },
    MY_FLOW_TABS: [
      {
        TEXT: FLOW_T_STRINGS.MY_FLOW_TABS_PUBLISHED_TEXT,
        INDEX: MY_FLOW_TAB_INDEX.PUBLISHED,
      },
      {
        TEXT: FLOW_T_STRINGS.MY_FLOW_TABS_UNPUBLISHED_TEXT,
        INDEX: MY_FLOW_TAB_INDEX.UN_PUBLISHED,
      },
    ],
    MY_FLOW: {
      TITLE: FLOW_T_STRINGS.MY_FLOW_TITLE,
      SEARCH: {
        PLACEHOLDER: FLOW_T_STRINGS.MY_FLOW_SEARCH_PLACEHOLDER,
        ID: 'search_flow',
      },
      SORT_BY_DROPDOWN: {
        SORT_PARAMETER: 'flow_name',
        PLACEHOLDER: FLOW_T_STRINGS.MY_FLOW_SORT_BY_DROPDOWN_PLACEHOLDER,
        ID: 'sort_by_flow',
        OPTION_LIST: [
          { label: FLOW_T_STRINGS.MY_FLOW_SORT_BY_DROPDOWN_ASCENDING, value: 1 },
          { label: FLOW_T_STRINGS.MY_FLOW_SORT_BY_DROPDOWN_DESCENDING, value: -1 },
        ],
      },
      CREATE_FLOW: FLOW_T_STRINGS.MY_FLOW_CREATE_FLOW,
      CARD_HEIGHT: 80,
    },
    ALL_FLOW: {
      TITLE: FLOW_T_STRINGS.ALL_FLOW_TITLE,
      SEARCH: {
        PLACEHOLDER: FLOW_T_STRINGS.ALL_FLOW_SEARCH_PLACEHOLDER,
        ID: 'search_flow',
      },
      SORT_BY_DROPDOWN: {
        PLACEHOLDER: FLOW_T_STRINGS.ALL_FLOW_SORT_BY_DROPDOWN_PLACEHOLDER,
        ID: 'sort_by_flow',
        SORT_PARAMETER: 'flow_name',
        OPTION_LIST: [
          { label: FLOW_T_STRINGS.ALL_FLOW_SORT_BY_DROPDOWN_ASCENDING, value: 1 },
          { label: FLOW_T_STRINGS.ALL_FLOW_SORT_BY_DROPDOWN_DESCENDING, value: -1 },
        ],
      },
      CREATE_FLOW: FLOW_T_STRINGS.ALL_FLOW_CREATE_FLOW,
      CARD_HEIGHT: 135,
      CARD_WIDTH: 146,
    },
    C_MENU_VALUE: {
      SUMMARY_SETTINGS: 1,
      V_S_SETTINGS: 2,
      C_H: 3,
      DELETE_FLOW: 4,
    },
    C_MENU_OPTIONS: [
      { label: FLOW_T_STRINGS.C_MENU_SUMMARY_SETTINGS, value: 1 },
      { label: FLOW_T_STRINGS.C_MENU_VISIBILITY_SETTINGS, value: 2 },
      { label: FLOW_T_STRINGS.C_MENU_CHANGE_HISTORY, value: 3 },
      { label: FLOW_T_STRINGS.C_MENU_DELETE_FLOW, value: 4 },
    ],
    A_P_STRINGS: {
      PUBLISHED: FLOW_T_STRINGS.A_P_STRINGS_PUBLISHED,
      DRAFT: FLOW_T_STRINGS.A_P_STRINGS_DRAFT,
    },
    IMAGE_CROP: {
      ASPECT: 1 / 1,
      MIN_WIDTH: 32,
    },
    ALL_FLOW_BC_LIST: [
      {
        text: FLOW_T_STRINGS.ALL_FLOW_BC_LIST_TEXT,
        pathname: '/',
      },
    ],
    MY_FLOW_BC_LIST: [
      {
        text: FLOW_T_STRINGS.MY_FLOW_BC_LIST_TEXT,
        pathname: '/my_flow',
      },
    ],
    ICON_STRINGS: {
      MORE_ICON: FLOW_T_STRINGS.ICON_STRINGS_MORE_ICON,
      CLOSE_ICON: FLOW_T_STRINGS.ICON_STRINGS_CLOSE_ICON,
    },
    C_H_M_STRINGS: {
      TITLE: FLOW_T_STRINGS.C_H_M_STRINGS_TITLE,
      CHANGE_HISTORY: FLOW_T_STRINGS.C_H_M_STRINGS_CHANGE_HISTORY,
      VERSION_NO: FLOW_T_STRINGS.C_H_M_STRINGS_VERSION_NO,
      PUBLISHED_ON: FLOW_T_STRINGS.C_H_M_STRINGS_PUBLISHED_ON,
      PUBLISHED_BY: FLOW_T_STRINGS.C_H_M_STRINGS_PUBLISHED_BY,
      DOCUMENTATION: FLOW_T_STRINGS.C_H_M_STRINGS_DOCUMENTATION,
      ITEM_COUNTS_PER_PAGE: 5,
      PAGE_RANGE_DISPLAYED: 5,
    },
    C_H_M_TABLE_LAYOUT: {
      VERSION_NO: 3,
      PUBLISHED_ON: 3,
      PUBLISHED_BY: 3,
      DOCUMENTATION: 3,
    },
    S_V_M_STRINGS: {
      TITLE: FLOW_T_STRINGS.S_V_M_STRINGS_TITLE,
      CANCEL: FLOW_T_STRINGS.S_V_M_STRINGS_CANCEL,
      SAVE: FLOW_T_STRINGS.S_V_M_STRINGS_SAVE,
    },
    V_M_STRINGS: {
      CANCEL: FLOW_T_STRINGS.V_M_STRINGS_CANCEL,
      SAVE: FLOW_T_STRINGS.V_M_STRINGS_SAVE,
      TITLE: FLOW_T_STRINGS.V_M_STRINGS_TITLE,
      SUB_TITLE: FLOW_T_STRINGS.V_M_STRINGS_SUB_TITLE,
    },
    V_S_M_STRINGS: {
      TITLE: FLOW_T_STRINGS.V_S_M_STRINGS_TITLE,
      CANCEL: FLOW_T_STRINGS.V_S_M_STRINGS_CANCEL,
      SAVE: FLOW_T_STRINGS.V_S_M_STRINGS_SAVE,
    },
    OTHER_REFERENCES_STRINGS: {
      DESCRIPTION: FLOW_T_STRINGS.OTHER_REFERENCES_STRINGS_DESCRIPTION,
      DOCUMENTS: FLOW_T_STRINGS.OTHER_REFERENCES_STRINGS_DOCUMENTS,
      ADD_REFERENCE: FLOW_T_STRINGS.OTHER_REFERENCES_STRINGS_ADD_REFERENCE,
    },
    RESPONSIBILITIES_STRINGS: {
      TYPE: FLOW_T_STRINGS.RESPONSIBILITIES_STRINGS_TYPE,
      USER_NAME: FLOW_T_STRINGS.RESPONSIBILITIES_STRINGS_USER_NAME,
      COMPLETED_DATE: FLOW_T_STRINGS.RESPONSIBILITIES_STRINGS_COMPLETED_DATE,
      RESPONSIBILITY_TYPE: [
        { label: FLOW_T_STRINGS.RESPONSIBILITIES_STRINGS_REVIEWER, value: 'reviewer' },
        { label: FLOW_T_STRINGS.RESPONSIBILITIES_STRINGS_APPROVER, value: 'approver' },
      ],
      ADD_RESPONSIBILITY: FLOW_T_STRINGS.RESPONSIBILITIES_STRINGS_ADD_RESPONSIBILITY,
    },
    FIELDS: {
      TYPE: 'type',
      TEAMS: 'teams',
      USERS: 'users',
      DATE: 'date',
      DESCRIPTION: 'description',
      DOCUMENTS: 'document_details',
      NAME: 'fileName',
    },
    P_P_STRINGS: {
      SUMMARY_DETAILS: FLOW_T_STRINGS.P_P_STRINGS_SUMMARY_DETAILS,
      RESPONSIBILITIES: FLOW_T_STRINGS.P_P_STRINGS_RESPONSIBILITIES,
      VISIBILITY: FLOW_T_STRINGS.P_P_STRINGS_VISIBILITY,
      SECURITY: FLOW_T_STRINGS.P_P_STRINGS_SECURITY,
      P_O_I_T_S: FLOW_T_STRINGS.P_P_STRINGS_P_O_I_T_S,
      OTHER_REFERENCES: FLOW_T_STRINGS.P_P_STRINGS_OTHER_REFERENCES,
      FLOW_NO: FLOW_T_STRINGS.P_P_STRINGS_FLOW_NO,
      VERSION_NO: FLOW_T_STRINGS.P_P_STRINGS_VERSION_NO,
      VERSION: FLOW_T_STRINGS.P_P_STRINGS_VERSION,
      EFFECTIVE_DATE: {
        LABEL: FLOW_T_STRINGS.P_P_STRINGS_EFFECTIVE_DATE_LABEL,
        ID: 'effective_date',
      },
      EMPTY_RESPONSIBILITY: {
        type: '',
        teams: '',
        date: '',
      },
      EMPTY_REFERENCE: {
        description: '',
        document_details: {},
      },
      DISCARD: FLOW_T_STRINGS.P_P_STRINGS_DISCARD,
      PUBLISH: FLOW_T_STRINGS.P_P_STRINGS_PUBLISH,
    },
    SECURITY_DD: {
      option_list: [
        {
          value: 'all_users',
          label: FLOW_T_STRINGS.SECURITY_DD_ALL_USERS_LABEL,
        },
        {
          value: 'participants_only',
          label: FLOW_T_STRINGS.SECURITY_DD_PARTICIPANTS_ONLY_LABEL,
        },
        {
          value: 'viewers_only',
          label: FLOW_T_STRINGS.SECURITY_DD_VIEWERS_ONLY_LABEL,
        },
      ],
    },
    EFFECTIVE_DATE_ERROR_MESSAGE: FLOW_T_STRINGS.EFFECTIVE_DATE_ERROR_MESSAGE,
    EFFECTIVE_DATE_ERROR_LABEL: FLOW_T_STRINGS.EFFECTIVE_DATE_ERROR_LABEL,
    V_L_STRINGS: {
      USER_TEAMS_INVOLVED: FLOW_T_STRINGS.V_L_STRINGS_USER_TEAMS_INVOLVED,
      FLOW_STORED_BY: FLOW_T_STRINGS.V_L_STRINGS_FLOW_STORED_BY,
      OTHER_VIEWERS: FLOW_T_STRINGS.V_L_STRINGS_OTHER_VIEWERS,
    },
    ADD_STEP: {
      ADD: FLOW_T_STRINGS.ADD_STEP_ADD,
    },
    STEP_NAME: {
      ID: 'step_name',
      LABEL: FLOW_T_STRINGS.STEP_NAME_LABEL,
    },
    STEP_DESCRIPTION: {
      ID: 'step_description',
      LABEL: FLOW_T_STRINGS.STEP_DESCRIPTION_LABEL,
    },
    STEPS: {
      ID: 'steps',
      LABEL: FLOW_T_STRINGS.STEPS_LABEL,
    },
    ADD_STEP_ID: 'add_step',
    SECTION_NAME: {
      ID: 'section_name',
      PLACEHOLDER: FLOW_T_STRINGS.SECTION_NAME_PLACEHOLDER,
    },
    S_D_STRINGS: {
      TASK_TITLE: {
        PLACEHOLDER: FLOW_T_STRINGS.S_D_STRINGS_TASK_TITLE_PLACEHOLDER,
        ID: 'task_title',
      },
      TASK_DESCRIPTION: {
        PLACEHOLDER: FLOW_T_STRINGS.S_D_STRINGS__TASK_DESCRIPTION_PLACEHOLDER,
        ID: 'task_description',
      },
    },
    S_D_TABS_INDEX: {
      FORMS: 1,
      TASK_ACTION: 2,
      ACTORS: 3,
    },
    S_D_TABS: [
      {
        TEXT: FLOW_T_STRINGS.S_D_TABS_FORMS,
        INDEX: 1,
      },
      { TEXT: FLOW_T_STRINGS.S_D_TABS_TASK_ACTIONS, INDEX: 2 },
      {
        TEXT: FLOW_T_STRINGS.S_D_TABS_ACTORS,
        INDEX: 3,
      },
    ],
    S_C_D_STRINGS: {
      DESCRIPTION: FLOW_T_STRINGS.S_C_D_STRINGS_DESCRIPTION,
      UPLOAD_DOCUMENTS: FLOW_T_STRINGS.S_C_D_STRINGS_UPLOAD_DOCUMENTS,
      ID: 'step_document',
      ACTORS: FLOW_T_STRINGS.S_C_D_STRINGS_ACTORS,
      DISCARD: FLOW_T_STRINGS.S_C_D_STRINGS_ACTORS,
      SAVE: FLOW_T_STRINGS.S_C_D_STRINGS_SAVE,
      ASSIGNEES: FLOW_T_STRINGS.S_C_D_STRINGS_ASSIGNEES,
      TEXT_EDITOR_PLACEHOLDER: FLOW_T_STRINGS.S_C_D_STRINGS_TEXT_EDITOR_PLACEHOLDER,
      ICON_STRINGS: {
        DELETE_ICON: FLOW_T_STRINGS.S_C_D_STRINGS_ICON_STRINGS_DELETE_ICON,
      },
    },
    S_C_STRINGS: {
      STEP_NAME: {
        PLACEHOLDER: FLOW_T_STRINGS.S_C_STRINGS_STEP_NAME_PLACEHOLDER,
      },
      EMPTY_VALUE_STRINGS: {
        MEMBERS: FLOW_T_STRINGS.S_C_STRINGS_EMPTY_VALUE_STRINGS_MEMBERS,
        DESCRIPTION: FLOW_T_STRINGS.S_C_STRINGS_EMPTY_VALUE_STRINGS_DESCRIPTION,
        DOCUMENTS: FLOW_T_STRINGS.S_C_STRINGS_EMPTY_VALUE_STRINGS_DOCUMENTS,
      },
      ICON_STRINGS: {
        SAVED_ICON: FLOW_T_STRINGS.S_C_STRINGS_ICON_STRINGS_SAVED_ICON,
        NOT_SAVED_ICON: FLOW_T_STRINGS.S_C_STRINGS_ICON_STRINGS_NOT_SAVED_ICON,
      },
    },
    CP_STRINGS: {
      CREATE_FLOW: FLOW_T_STRINGS.CP_STRINGS_CREATE_FLOW,
      EDIT_FLOW: FLOW_T_STRINGS.CP_STRINGS_EDIT_FLOW,
      VIEW_FLOW: FLOW_T_STRINGS.CP_STRINGS_VIEW_FLOW,
      PUBLISH_BUTTON: FLOW_T_STRINGS.CP_STRINGS_PUBLISH_BUTTON,
      SAVE_DRAFT_BUTTON: FLOW_T_STRINGS.CP_STRINGS_SAVE_DRAFT_BUTTON,
      CANCEL_BUTTON: FLOW_T_STRINGS.CP_STRINGS_CANCEL_BUTTON,
      FLOW_NAME: {
        PLACEHOLDER: FLOW_T_STRINGS.CP_STRINGS_FLOW_NAME_PLACEHOLDER,
        ID: 'flow_name',
      },
      FLOW_DESCRIPTION: {
        PLACEHOLDER: FLOW_T_STRINGS.CP_STRINGS_FLOW_DESCRIPTION_PLACEHOLDER,
        ID: 'flow_description',
      },
    },
    CREATE_FLOW_SERVER_RESPONSE: {
      SUCCESSFUL_STEP_CREATED: {
        title: 'Created',
        subTitle: 'Step created successfully',
        status: FORM_POPOVER_STATUS.SUCCESS,
        isVisible: true,
      },
      SUCCESSFUL_STEP_UPDATED: {
        title: 'Updated',
        subTitle: 'Step Updated successfully',
        status: FORM_POPOVER_STATUS.SUCCESS,
        isVisible: true,
      },
      SUCCESSFUL_INITIAL_STEP_CREATED: {
        title: 'Created',
        subTitle: 'Flow Initiation Created successfully',
        status: FORM_POPOVER_STATUS.SUCCESS,
        isVisible: true,
      },
      SUCCESSFUL_INITIAL_STEP_UPDATED: {
        title: 'Updated',
        subTitle: 'Flow Initiation Updated successfully',
        status: FORM_POPOVER_STATUS.SUCCESS,
        isVisible: true,
      },
      SUCCESSFUL_FLOW_PUBLISH: {
        title: FLOW_T_STRINGS.CREATE_FLOW_SERVER_RESPONSE_SUCCESSFUL_FLOW_PUBLISH_TITLE,
        subTitle: FLOW_T_STRINGS.CREATE_FLOW_SERVER_RESPONSE_SUCCESSFUL_FLOW_PUBLISH_SUBTITLE,
        status: FORM_POPOVER_STATUS.SUCCESS,
        isVisible: true,
      },
      SUCCESSFUL_TEST_FLOW_PUBLISH: {
        title: FLOW_T_STRINGS.PUBLISH_TEST_FLOW_SERVER_RESPONSE_SUCCESS_TITLE,
        subTitle: FLOW_T_STRINGS.PUBLISH_TEST_FLOW_SERVER_RESPONSE_SUCCESS_SUBTITLE,
        status: FORM_POPOVER_STATUS.SUCCESS,
        isVisible: true,
      },
      SUCCESSFUL_EFFECTIVE_DATE_UPDATE: {
        title: FLOW_T_STRINGS.CREATE_FLOW_SERVER_RESPONSE_SUCCESSFUL_EFFECTIVE_DATE_UPDATE_TITLE,
        subTitle: FLOW_T_STRINGS.CREATE_FLOW_SERVER_RESPONSE_SUCCESSFUL_EFFECTIVE_DATE_UPDATE_SUBTITLE,
        status: FORM_POPOVER_STATUS.SUCCESS,
        isVisible: true,
      },
      SUCCESSFUL_VISIBILITY_SETTINGS_UPDATE: {
        title: FLOW_T_STRINGS.CREATE_FLOW_SERVER_RESPONSE_SUCCESSFUL_VISIBILITY_SETTINGS_UPDATE_UPDATE_TITLE,
        subTitle: FLOW_T_STRINGS.CREATE_FLOW_SERVER_RESPONSE_SUCCESSFUL_VISIBILITY_SETTINGS_UPDATE_SUBTITLE,
        status: FORM_POPOVER_STATUS.SUCCESS,
        isVisible: true,
      },
      SAVE_STEP_FAILURE: {
        title: FLOW_T_STRINGS.CREATE_FLOW_UPDATE_FAILURE_TITLE,
        subTitle: 'Failed to save step',
        status: FORM_POPOVER_STATUS.SERVER_ERROR,
        isVisible: true,
      },
      DELETE_STEP_FAILURE: {
        title: FLOW_T_STRINGS.CREATE_FLOW_UPDATE_FAILURE_TITLE,
        subTitle: 'Failed to delete step',
        status: FORM_POPOVER_STATUS.SERVER_ERROR,
        isVisible: true,
      },
      IMPORT_STEP_SUCCESS: {
        title: 'Successfully imported',
        subTitle: 'Successfully imported fields',
        status: FORM_POPOVER_STATUS.SUCCESS,
        isVisible: true,
      },
      IMPORT_STEP_FAILURE: {
        title: 'Import failed',
        subTitle: 'Cannot import fields',
        status: FORM_POPOVER_STATUS.SERVER_ERROR,
        isVisible: true,
      },
      REQUIRED_STEP: {
        title: FLOW_T_STRINGS.CREATE_FLOW_REQUIRED_STEP_TITLE,
        subTitle: FLOW_T_STRINGS.CREATE_FLOW_REQUIRED_STEP_SUBTITLE,
        status: FORM_POPOVER_STATUS.SERVER_ERROR,
        isVisible: true,
      },
      UPDATE_FAILURE: {
        title: FLOW_T_STRINGS.CREATE_FLOW_UPDATE_FAILURE_TITLE,
        subTitle: FLOW_T_STRINGS.CREATE_FLOW_UPDATE_FAILURE_SUBTITLE,
        status: FORM_POPOVER_STATUS.SERVER_ERROR,
        isVisible: true,
      },
      SUCCESSFUL_STEP_STATUSES: {
        title: 'Created',
        subtitle: 'New step status created successfully',
      },
      STEP_STATUS_FAILURE: {
        title: 'Status Creation failed',
        subTitle: 'Cannot create new step status',
        status: FORM_POPOVER_STATUS.SERVER_ERROR,
        isVisible: true,
      },
    },
    DELETE_FLOW_SERVER_RESPONSE: {
      SUCCESSFUL_STEP_DELETE: {
        title: FLOW_T_STRINGS.DELETE_FLOW_SERVER_RESPONSE_SUCCESSFUL_STEP_DELETE_TITLE,
        subTitle: FLOW_T_STRINGS.DELETE_FLOW_SERVER_RESPONSE_SUCCESSFUL_STEP_DELETE_SUBTITLE,
        status: FORM_POPOVER_STATUS.SUCCESS,
        isVisible: true,
      },
      SUCCESSFUL_FLOW_DELETE: {
        title: FLOW_T_STRINGS.DELETE_FLOW_SERVER_RESPONSE_SUCCESSFUL_FLOW_DELETE_TITLE,
        subTitle: FLOW_T_STRINGS.DELETE_FLOW_SERVER_RESPONSE_SUCCESSFUL_FLOW_DELETE_SUBTITLE,
        status: FORM_POPOVER_STATUS.SUCCESS,
        isVisible: true,
      },
      UPDATE_FAILURE: {
        title: FLOW_T_STRINGS.DELETE_FLOW_SERVER_RESPONSE_UPDATE_FAILURE_TITLE,
        subTitle: FLOW_T_STRINGS.DELETE_FLOW_SERVER_RESPONSE_UPDATE_FAILURE_SUBTITLE,
        status: FORM_POPOVER_STATUS.SERVER_ERROR,
        isVisible: true,
      },
    },
    CP_TABS_INDEX: {
      STEPS: 1,
      USER_OR_TEAMS: 2,
      LOOKUP_OR_RULES: 3,
      OTHERS: 4,
    },
    CP_TABS: [
      {
        TEXT: FLOW_T_STRINGS.CP_TABS_STEPS,
        INDEX: 1,
      },
      { TEXT: FLOW_T_STRINGS.CP_TABS_USER_TEAMS, INDEX: 2 },
      {
        TEXT: FLOW_T_STRINGS.CP_TABS_LOOKUP_RULES,
        INDEX: 3,
      },
      { TEXT: FLOW_T_STRINGS.CP_TABS_OTHERS, INDEX: 4 },
    ],
    FLOW_STATUS: {
      IN_PROGRESS: 'in_progress',
      SAVED: 'saved',
      PUBLISHED: 'published',
      INACTIVE: 'inactive',
      UN_PUBLISHED: 'unpublished',
    },
    FLOW_LABELS: {
      flow_name: FLOW_T_STRINGS.FLOW_LABELS_FLOW_NAME,
      flow_description: FLOW_T_STRINGS.FLOW_LABELS_FLOW_DESCRIPTION,
      steps: FLOW_T_STRINGS.FLOW_LABELS_STEPS,
      step_name: FLOW_T_STRINGS.FLOW_LABELS_STEP_NAME,
      step_description: FLOW_T_STRINGS.FLOW_LABELS_FLOW_STEP_DESCRIPTION,
      step_document: FLOW_T_STRINGS.FLOW_LABELS_STEP_DOCUMENT,
      effective_date: FLOW_T_STRINGS.FLOW_LABELS_EFFECTIVE_DATE,
      owners: FLOW_T_STRINGS.FLOW_LABELS_OWNERS,
      other_references: FLOW_T_STRINGS.FLOW_LABELS_OTHER_REFERENCES,
      step_statuses: FLOW_T_STRINGS.STEP_STATUS,
    },
    UPDATE_ACTIVE_STEP: FLOW_T_STRINGS.UPDATE_ACTIVE_STEP,
    ADD_NEW_STEP: FLOW_T_STRINGS.ADD_NEW_STEP,
    PUBLISH_FLOW: FLOW_T_STRINGS.PUBLISH_FLOW,
    DELETE_STEP: FLOW_T_STRINGS.DELETE_STEP,
  };
};

// eslint-disable-next-line import/no-mutable-exports
export let FLOW_STRINGS = getFlowStrings();

store.subscribe(() => {
  FLOW_T_STRINGS = store.getState().LocalizationReducer.languageSettings.strings.FLOWS;
  FLOW_STRINGS = getFlowStrings();
});

export const MESSAGE_OBJECT_STRINGS = (translate) => {
  return {
    TITLE: translate('no_data_found_strings.title'),
    SUB_TITLE: translate('no_data_found_strings.sub_title'),
  };
};

export default FLOW_STRINGS;
