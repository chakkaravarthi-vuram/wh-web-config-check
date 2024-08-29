import { translate } from 'language/config';
import { ACTION_TYPE } from 'utils/constants/action.constant';
import { FIELD_TYPE } from 'utils/constants/form.constant';
import { translateFunction } from 'utils/jsUtility';
import { STEP_TYPE } from '../../utils/Constants';
import { DEFAULT_STEP_STATUS, DUE_DATE_VALUE_TYPE } from './EditFlow.constants';
import { RECIPIENT_TYPE } from './step_configuration/configurations/Configuration.strings';

export const SEARCH_STEP = 'flows.edit_flow.search_step';

export const SuggestionTabs = (t = translateFunction) => [
  {
    TEXT: t('flows.form_field_design.field_suggestions'),
    INDEX: 1,
  },
];

// STEP_LABELS not to be translated, only maintain in english.json
export const STEP_LABELS = {
  [STEP_TYPE.START_STEP]: 'flows.step_type.start_step',
  [STEP_TYPE.INTEGRATION]: 'flows.step_type.integration',
  [STEP_TYPE.ML_MODELS]: 'flows.step_type.ml_model',
  [STEP_TYPE.DOCUMENT_GENERATION]: 'flows.step_type.document_generation',
  [STEP_TYPE.EMAIL_CONFIGURATION]: 'flows.step_type.email_configuration',
  [STEP_TYPE.SEND_DATA_TO_DATALIST]: 'flows.step_type.data_to_datalist',
  [STEP_TYPE.USER_STEP]: 'flows.step_type.user_step',
  [STEP_TYPE.CONDITON_PATH_SELECTOR]: 'flows.step_type.path_selector',
  [STEP_TYPE.JOIN_STEP]: 'flows.step_type.join',
  [STEP_TYPE.END_FLOW]: 'flows.step_type.end',
  [STEP_TYPE.FLOW_TRIGGER]: 'flows.step_type.trigger',
  [STEP_TYPE.PARALLEL_STEP]: 'flows.step_type.parallel',
  [STEP_TYPE.DATA_MANIPULATOR]: 'flows.step_type.data_manipulator',
  [STEP_TYPE.WAIT_STEP]: 'flows.step_type.wait_node',
};

export const FLOW_CONFIG_STRINGS = {
  STEP_NAME_GOES_HERE: 'flow_config_strings.step_name_goes_here',
  STATIC_STEP_INFO: {
    HIDE_INFO: 'flow_config_strings.static_step_info.hide_info',
    SHOW_INFO: 'flow_config_strings.static_step_info.show_info',
  },
  REPORT_NAME_LABEL: 'charts.report_name_label',
  REPORT_DESCRIPTION_LABEL: 'flow_config_strings.report_description_label',
  STEP_DESCRIPTION_LABEL: 'flows.basic_config_strings.fields.step_description.label',
  TASK_ID_LABEL: 'flow_config_strings.task_id_label',
  CONTROL_TYPE_LABEL: 'flow_config_strings.control_type_label',
  STEP_NAME_LABEL: 'flow_config_strings.step_name_label',
  DUE_DATE_LABEL: 'task_content.due_date',
  VALUE_LABEL: 'flow_config_strings.value_label',
  NEXT_STEP_NAME: 'flow_config_strings.next_step_name',
  ELSE_NEXT_STEP: 'flow_config_strings.else_next_step',
  EXTERNAL_LABEL: 'flow_config_strings.external_label',
  SEND_EMAIL_CONFIG: {
    EMAIL_BODY_LABEL: 'flow_config_strings.send_email_config.email_body_label',
    EMAIL_SUBJECT_LABEL: 'flow_config_strings.send_email_config.email_subject_label',
  },
  CHOOSE_FLOW_STRING: 'flow_config_strings.choose_flow_string',
  BUTTON_LABEL_TEXT: 'flow_config_strings.button_label_text',
  CUSTOM_ID_LABEL: 'flow_config_strings.custom_id_label',
  NEXT_STEP_TEXT: 'flow_config_strings.next_step_text',
  ADDITIONAL_CONFIG: {
    SEND_EMAIL: 'flow_config_strings.additional_config.send_email',
    SEND_ESCALATION: 'flow_config_strings.additional_config.email_escalation',
    SEND_DATA_TO_DATALIST: 'flow_config_strings.additional_config.send_data_to_datalist',
    DOC_GENERATION: 'flow_config_strings.additional_config.doc_generation',
    DOC_TEMPLATE_NAME: 'flow_config_strings.additional_config.doc_template_name',
    DOC_TEMPLATE_LABEL: 'flow_config_strings.additional_config.doc_template_label',
    DOC_FIELD_LABEL: 'flow_config_strings.additional_config.doc_field_label',
    DOC_FIELD_NAME_LABEL: 'flow_config_strings.additional_config.doc_field_name_label',
    DOC_GENERATION_REPLACE_DOCUMENT_DEPENDENCY: {
      TITLE: 'flow_config_strings.additional_config.doc_generation_replace_document_dependency.title',
      DESCRIPTION: 'flow_config_strings.additional_config.doc_generation_replace_document_dependency.description',
    },
  },
  ERRORS: {
    CHOOSE_FLOW_TO_CALL: 'flow_config_strings.errors.choose_flow_to_call',
    STEP_REQUIRED: 'flow_config_strings.errors.step_required',
    MIN_ONE_STEP_REQUIRED: 'flow_config_strings.errors.min_one_step_required',
    ADD_ATLEAST_ONE_STEP: 'flow_config_strings.errors.add_atleast_one_step',
    RULE_NAME_REQUIRED: 'flow_config_strings.errors.rule_name_required',
    ERROR_IN_FIELD: 'flow_config_strings.errors.error_in_field',
    CHECK_FIELD_CONFIG: 'flow_config_strings.errors.check_field_config',
    FAILED_TO_SAVE_FLOW: 'flow_config_strings.errors.failed_to_save_flow',
    EMAIL_MIN_ONE_ITEM: 'flow_config_strings.errors.email_min_one_item',
    ESCALATION_MIN_ONE_ITEM: 'flow_config_strings.errors.escalation_min_one_item',
    SEND_DATA_MIN_ONE_ITEM: 'flow_config_strings.errors.send_data_min_one_item',
    DOC_GENERATION_MIN_ONE_ITEM: 'flow_config_strings.errors.doc_generation_min_one_item',
    DIRECT_RECIPIENT: 'flow_config_strings.errors.direct_recipient',
    EMAIL_IS_REQUIRED: 'flow_config_strings.errors.email_address_required',
    STEP_DESCRIPTION_MAX_LIMIT: 'flow_config_strings.errors.step_description_max_limit',
    DUE_DATE: {
      MAX_HOURS_LIMIT: 'flow_config_strings.errors.due_date.max_hours',
      MIN_HOURS_LIMIT: 'flow_config_strings.errors.due_date.min_hours',
      MAX_DAYS_LIMIT: 'flow_config_strings.errors.due_date.max_days',
      MIN_DAYS_LIMIT: 'flow_config_strings.errors.due_date.min_days',
    },
    DOC_TEMPLATE_NAME_REQUIRED: 'flow_config_strings.errors.doc_template_name_required',
    DOC_TEMPLATE_UNIQUE_ERROR: 'flow_config_strings.errors.doc_template_unique_error',
    BUTTON_ACTIONS: {
      MIN_ONE_ACTION_REQUIRED: 'flow_config_strings.errors.button_actions.min_one_action_required',
      FORWARD_ACTION_REQUIRED: 'flow_config_strings.errors.button_actions.forward_action_required',
    },
    SECTION: {
      MIN_ONE_ITEM_REQUIRED: 'flow_config_strings.errors.section.min_one_item_required',
    },
    SOME_ERROR_IN_RULE: 'flow_config_strings.errors.some_error_in_rule',
    ADDITIONAL_CONFIG: {
      BTN_ACTION_REQUIRED: 'flow_config_strings.additional_config.button_action_validation',
    },
    IS_REQUIRED: 'common_strings.is_required',
  },
  LINK_DEPENDENCY_TITLE: 'flow_config_strings.link_dependency_title',
};

export const FLOW_VALIDATION_STRINGS = (t) => {
  return {
  NAME: t('flow_validation_strings.name'),
  SHOULD_NOT_EXCEED: t('flow_validation_strings.should_not_exceed'),
  CHARACTERS: t('flow_validation_strings.characters'),
  SHOULD_CONTAIN_ATLEAST: t('flow_validation_strings.should_contain_atleast'),
  DESCRIPTION: t('flow_validation_strings.description'),
  CHARACTERS_ALLOWED: t('flow_validation_strings.characters_allowed'),
  };
};

export const EDIT_FLOW_TAB_INDEX = {
  BASIC_INFO: 1,
  STEPS: 2,
  SECURITY: 3,
};

export const FLOW_T_STRINGS = {
  FIELD_TYPES_SINGLE_LINE: 'singleline',
  FIELD_TYPES_PARAGRAPH: 'paragraph',
  FIELD_TYPES_NUMBER: 'number',
  FIELD_TYPES_DATE: 'date',
  FIELD_TYPES_DATE_AND_TIME: 'dateandtime',
  FIELD_TYPES_TIME: 'time',
  FIELD_TYPES_USERS: 'users',
  FIELD_TYPES_TEAMS: 'teams',
  FIELD_TYPES_FILE_UPLOAD: 'file_upload',
  FIELD_TYPES_CURRENCY: 'currency',
  FIELD_TYPES_DROPDOWN: 'dropdown',
  FIELD_TYPES_CHECKBOX: 'checkbox',
  FIELD_TYPES_ADDRESS: 'address',
  FIELD_TYPES_RATING: 'rating',
  FIELD_TYPES_PERCENTAGE: 'percentage',
  FIELD_TYPES_RADIO_GROUP: 'radio_group',
  FLOW_CARD_VIEW: 'View',
  FLOW_CARD_START: 'Start',
  FLOW_CARD_EDIT: 'Edit',
  MY_FLOW_TABS_PUBLISHED_TEXT: 'Published',
  MY_FLOW_TABS_UNPUBLISHED_TEXT: 'Unpublished',
  MY_FLOW_TITLE: 'My Flows',
  MY_FLOW_SEARCH_PLACEHOLDER: 'Search flow…',
  MY_FLOW_SORT_BY_DROPDOWN_PLACEHOLDER: 'Sort by',
  MY_FLOW_SORT_BY_DROPDOWN_ASCENDING: 'Ascending',
  MY_FLOW_SORT_BY_DROPDOWN_DESCENDING: 'Descending',
  MY_FLOW_CREATE_FLOW: 'Create Flow',
  ALL_FLOW_TITLE: 'All Flow',
  ALL_FLOW_SEARCH_PLACEHOLDER: 'Search flow…',
  ALL_FLOW_SORT_BY_DROPDOWN_PLACEHOLDER: 'Sort by',
  ALL_FLOW_SORT_BY_DROPDOWN_ASCENDING: 'Ascending',
  ALL_FLOW_SORT_BY_DROPDOWN_DESCENDING: 'Descending',
  ALL_FLOW_CREATE_FLOW: 'Create Flow',
  C_MENU_SUMMARY_SETTINGS: 'Summary Settings',
  C_MENU_VISIBILITY_SETTINGS: 'Visiblity & Security Settings',
  C_MENU_CHANGE_HISTORY: 'Change History',
  C_MENU_DELETE_FLOW: 'Delete Flow',
  A_P_STRINGS_PUBLISHED: 'Published',
  A_P_STRINGS_DRAFT: 'Draft (not yet published)',
  ALL_FLOW_BC_LIST_TEXT: 'All Flows',
  MY_FLOW_BC_LIST_TEXT: 'My Flows',
  ICON_STRINGS_MORE_ICON: 'Menu',
  ICON_STRINGS_CLOSE_ICON: 'Close',
  C_H_M_STRINGS_TITLE: 'Change History',
  C_H_M_STRINGS_CHANGE_HISTORY: 'Change history',
  C_H_M_STRINGS_VERSION_NO: 'Version No',
  C_H_M_STRINGS_PUBLISHED_ON: 'Published on',
  C_H_M_STRINGS_PUBLISHED_BY: 'Published by',
  C_H_M_STRINGS_DOCUMENTATION: 'Documentation',
  S_V_M_STRINGS_TITLE: 'Summary details',
  S_V_M_STRINGS_CANCEL: 'Cancel',
  S_V_M_STRINGS_SAVE: 'Save',
  V_M_STRINGS_CANCEL: 'Cancel',
  V_M_STRINGS_SAVE: 'Save',
  V_M_STRINGS_TITLE: 'Changes not saved',
  V_M_STRINGS_SUB_TITLE: 'Your task has been modified, do you want to save the changes?',
  V_S_M_STRINGS_TITLE: 'Visibility and Security Settings',
  V_S_M_STRINGS_CANCEL: 'Cancel',
  V_S_M_STRINGS_SAVE: 'Save',
  OTHER_REFERENCES_STRINGS_DESCRIPTION: 'Description',
  OTHER_REFERENCES_STRINGS_DOCUMENTS: 'Documents',
  OTHER_REFERENCES_STRINGS_ADD_REFERENCE: 'Add reference',
  RESPONSIBILITIES_STRINGS_TYPE: 'Username',
  RESPONSIBILITIES_STRINGS_USER_NAME: 'Username',
  RESPONSIBILITIES_STRINGS_COMPLETED_DATE: 'Completed Date',
  RESPONSIBILITIES_STRINGS_APPROVER: 'Approver ',
  RESPONSIBILITIES_STRINGS_REVIEWER: 'Reviewer ',
  RESPONSIBILITIES_STRINGS_ADD_RESPONSIBILITY: 'Add Responsiblity',
  P_P_STRINGS_SUMMARY_DETAILS: 'Summary Details',
  P_P_STRINGS_RESPONSIBILITIES: 'Responsibilities',
  P_P_STRINGS_VISIBILITY: 'Visibility',
  P_P_STRINGS_SECURITY: 'Security',
  P_P_STRINGS_P_O_I_T_S: 'Flow owner in the system',
  P_P_STRINGS_OTHER_REFERENCES: 'Other References',
  P_P_STRINGS_FLOW_NO: 'Flow No',
  P_P_STRINGS_VERSION_NO: 'Version No',
  P_P_STRINGS_VERSION: 'Version',
  P_P_STRINGS_EFFECTIVE_DATE_LABEL: 'Effective Date',
  P_P_STRINGS_DISCARD: 'Discard',
  P_P_STRINGS_PUBLISH: 'Publish',
  SECURITY_DD_ALL_USERS_LABEL: 'All the users of the system can see records',
  SECURITY_DD_PARTICIPANTS_ONLY_LABEL: 'All the users/team of the flow can see records',
  SECURITY_DD_VIEWERS_ONLY_LABEL: 'Users can see only their records',
  EFFECTIVE_DATE_ERROR_MESSAGE: 'effective_date is required',
  EFFECTIVE_DATE_ERROR_LABEL: 'Effective date is mandatory',
  V_L_STRINGS_USER_TEAMS_INVOLVED: 'Users / Teams involved',
  V_L_STRINGS_FLOW_STORED_BY: 'Flow will be started by',
  V_L_STRINGS_OTHER_VIEWERS: 'Other view only Users / Teams',
  ADD_STEP_ADD: 'Add',
  STEP_NAME_LABEL: 'Step Name',
  STEP_DESCRIPTION_LABEL: 'Step Description',
  STEPS_LABEL: 'Step',
  S_D_STRINGS_TASK_TITLE_PLACEHOLDER: 'Type task name',
  S_D_STRINGS__TASK_DESCRIPTION_PLACEHOLDER: 'Describe how to do this step',
  S_D_TABS_FORMS: 'Forms',
  S_D_TABS_TASK_ACTIONS: 'Task Actions',
  S_D_TABS_ACTORS: 'Actors',
  S_C_D_STRINGS_DESCRIPTION: 'Description',
  S_C_D_STRINGS_UPLOAD_DOCUMENTS: 'Upload documents',
  S_C_D_STRINGS_ACTORS: 'Actors',
  S_C_D_STRINGS_DISCARD: 'Discard',
  S_C_D_STRINGS_SAVE: 'Save',
  S_C_D_STRINGS_ASSIGNEES: 'actors',
  S_C_D_STRINGS_TEXT_EDITOR_PLACEHOLDER: 'Describe how to do this step…',
  S_C_D_STRINGS_ICON_STRINGS_DELETE_ICON: 'Delete Step',
  S_C_STRINGS_STEP_NAME_PLACEHOLDER: 'Enter step name here...',
  S_C_STRINGS_EMPTY_VALUE_STRINGS_MEMBERS: 'No users added',
  S_C_STRINGS_EMPTY_VALUE_STRINGS_DESCRIPTION: 'No description added',
  S_C_STRINGS_EMPTY_VALUE_STRINGS_DOCUMENTS: 'No documents added',
  S_C_STRINGS_ICON_STRINGS_SAVED_ICON: 'Saved',
  S_C_STRINGS_ICON_STRINGS_NOT_SAVED_ICON: 'Not saved',
  CP_STRINGS_CREATE_FLOW: 'Create Flow',
  CP_STRINGS_EDIT_FLOW: 'Edit Flow',
  CP_STRINGS_VIEW_FLOW: 'View Flow',
  CP_STRINGS_PUBLISH_BUTTON: 'Publish',
  CP_STRINGS_SAVE_DRAFT_BUTTON: 'Save Draft',
  CP_STRINGS_CANCEL_BUTTON: 'Cancel',
  CP_STRINGS_FLOW_NAME_PLACEHOLDER: 'Type flow name here',
  CP_STRINGS_FLOW_DESCRIPTION_PLACEHOLDER: 'Type flow description here...',
  CREATE_FLOW_SERVER_RESPONSE_SUCCESSFUL_FLOW_PUBLISH_TITLE: 'Published',
  CREATE_FLOW_SERVER_RESPONSE_SUCCESSFUL_FLOW_PUBLISH_SUBTITLE:
    'Flow published successfully',
  PUBLISH_TEST_FLOW_SERVER_RESPONSE_SUCCESS_TITLE: 'Published',
  PUBLISH_TEST_FLOW_SERVER_RESPONSE_SUCCESS_SUBTITLE:
    'Flow published for test successfully',
  CREATE_FLOW_SERVER_RESPONSE_SUCCESSFUL_EFFECTIVE_DATE_UPDATE_TITLE: 'Updated',
  CREATE_FLOW_SERVER_RESPONSE_SUCCESSFUL_EFFECTIVE_DATE_UPDATE_SUBTITLE:
    'Effective date for flow updated',
  CREATE_FLOW_SERVER_RESPONSE_SUCCESSFUL_VISIBILITY_SETTINGS_UPDATE_UPDATE_TITLE: 'Updated',
  CREATE_FLOW_SERVER_RESPONSE_SUCCESSFUL_VISIBILITY_SETTINGS_UPDATE_SUBTITLE:
    'Visibility settings for flow updated',
  CREATE_FLOW_REQUIRED_STEP_TITLE: 'Alert',
  CREATE_FLOW_REQUIRED_STEP_SUBTITLE: 'Atleast one step required',
  CREATE_FLOW_UPDATE_FAILURE_TITLE: 'Error',
  CREATE_FLOW_UPDATE_FAILURE_SUBTITLE: 'Failed to save flow',
  DELETE_FLOW_SERVER_RESPONSE_SUCCESSFUL_STEP_DELETE_TITLE: 'Deleted',
  DELETE_FLOW_SERVER_RESPONSE_SUCCESSFUL_STEP_DELETE_SUBTITLE: 'Step deleted successfully',
  DELETE_FLOW_SERVER_RESPONSE_SUCCESSFUL_FLOW_DELETE_TITLE: 'Deleted',
  DELETE_FLOW_SERVER_RESPONSE_SUCCESSFUL_FLOW_DELETE_SUBTITLE:
    'Flow deleted successfully',
  DELETE_FLOW_SERVER_RESPONSE_UPDATE_FAILURE_TITLE: 'Error',
  DELETE_FLOW_SERVER_RESPONSE_UPDATE_FAILURE_SUBTITLE: 'Something went wrong',
  CP_TABS_STEPS: 'Steps',
  CP_TABS_USER_TEAMS: 'User/Teams',
  CP_TABS_LOOKUP_RULES: 'Lookup/Rules',
  CP_TABS_OTHERS: 'Others',
  FLOW_LABELS_FLOW_NAME: 'Flow Name',
  FLOW_LABELS_FLOW_DESCRIPTION: 'Flow Description',
  FLOW_LABELS_STEPS: 'Steps',
  FLOW_LABELS_STEP_NAME: 'Step Name',
  FLOW_LABELS_FLOW_STEP_DESCRIPTION: 'Step Description',
  FLOW_LABELS_STEP_DOCUMENT: 'Step Document',
  FLOW_LABELS_EFFECTIVE_DATE: 'Effective Date',
  FLOW_LABELS_OWNERS: 'Owners',
  FLOW_LABELS_OTHER_REFERENCES: 'Other References',
  UPDATE_ACTIVE_STEP: 'Update',
  ADD_NEW_STEP: 'Add',
  PUBLISH_FLOW: 'Publish',
  DELETE_STEP: 'Delete',
  CATEGORY: 'Category',
};

export const GET_RECURSIVE_DATA_CONSTANTS = {
  REPEAT: {
    ID: 'repeat_every',
    LABEL: 'Repeat Every',
    DAY: {
      LABEL: 'Day',
      VALUE: 'day',
    },
    MONTH: {
      LABEL: 'Month',
      VALUE: 'month',
    },
  },
};
export const DUE_DATE_AND_STATUS = {
  TITLE: 'Due Date and Status',
  DUE_DATE: {
    ID: 'due_data',
    LABEL: 'Set due date for this step to it’s actors',
    PLACEHOLDER: '000',
    LOOKUP: {
      DAYS: 'days',
      HOURS: 'hours',
    },
    OPTIONS: [
      {
        label: 'Days',
        value: DUE_DATE_VALUE_TYPE.DAYS,
      },
      {
        label: 'Hours',
        value: DUE_DATE_VALUE_TYPE.HOURS,
      },
    ],
    MAX_LIMIT: {
      DAYS: 365,
      HOURS: 23,
    },
    HOURS_PLACEHOLDER: '00',
    DAYS_PLACEHOLDER: '000',
  },
  STATUS: {
    ID: 'step_status',
    LABEL: 'flows.basic_config_strings.fields.step_due_date.customized_status.label',
    PLACEHOLDER: translate('flows.basic_config_strings.fields.step_due_date.customized_status.placeholder'),
    TOOLTIP_MESSAGE: {
      LABEL: translate('flows.basic_config_strings.fields.step_due_date.customized_status.tooltip_message'),
      ID: 'customezed_status_tooltip',
    },
    OPTIONS: [
      {
        label: translate('flows.basic_config_strings.fields.step_due_date.in_progress'),
        value: DEFAULT_STEP_STATUS,
      },
    ],
  },
};

export const FLOW_STRINGS = Object.freeze({
  EDIT_FLOW_TITLE: 'flows.edit_flow_title',
  CREATE_FLOW_TITLE: 'flows.create_flow_title',
  FLOW_NAME_TITLE: 'flows.flow_name_title',
  CONFIGURE_STEP: 'flows.configure_step',
  EDIT_BASIC_DETAILS_TITLE: 'flows.edit_basic_details_title',
  CREATE_FLOW_DESCRIPTION: 'flows.create_flow_description',
  NO_USER_OR_TEAN_FOUND: 'flows.no_user_or_team_found',
  IS_FINAL_STEP_TRUE: 1,
  IS_FINAL_STEP_FALSE: 2,
  ALLOW_VIEWERS_TRUE: 1,
  ALLOW_VIEWERS_FALSE: 2,
  ALLOW_ADDITIONAL_OWNERS_TRUE: 1,
  ALLOW_ADDITIONAL_OWNERS_FALSE: 2,
  RULE: {
    ADD_RULE: translate('flows.rule.add_rule'),
    ADD_BUTTON: translate('flows.rule.add_button'),
    IF_LABEL: translate('flows.rule.if_label'),
    ELSE_IF_LABEL: 'flows.rule.else_if_label',
    ADD_CONDITION: translate('flows.rule.add_condition'),
    ADD_MULTI_CONDITION: translate('flows.rule.add_multi_condition'),
    ELSE_LABEL: translate('flows.rule.else_label'),
    ADDMEMBER_PLACEHOLDER: 'flows.rule.add_member_placeholder',
    RULE_NAME: translate('flows.rule.rule_name'),
    RULE_NAME_ID: 'rule_name_id',
    RULE_NAME_PLACEHOLDER: translate('flows.rule.rule_name_placeholder'),
    RULE_TYPE: translate('flows.rule.rule_type'),
    RULE_TYPE_ID: 'rule_type_id',
    RULE_TYPE_PLACEHOLDER: translate('flows.rule.rule_type_placeholder'),
  },
  TABS: [
    {
      TEXT: 'Basic Info',
      INDEX: EDIT_FLOW_TAB_INDEX.BASIC_INFO,
      SUB_TITLE:
        'Creating your flow is just a few steps away, enter your flow name to continue.',
      EDIT_VIEW_SUB_TITLE:
        'Editing your flow is just a few steps away, edit your flow name to continue.',
    },
    {
      TEXT: 'Steps',
      INDEX: EDIT_FLOW_TAB_INDEX.STEPS,
      SUB_TITLE: 'Creating your flow is just a few steps away.',
      EDIT_VIEW_SUB_TITLE:
        'Editing your flow is just a few steps away.',
    },
    {
      TEXT: 'Settings',
      INDEX: EDIT_FLOW_TAB_INDEX.SECURITY,
      SUB_TITLE:
        'Setup your metrics, secure your flow visibility and sharing with easy way.',

    },
  ],
  DISCARD: {
    TITLE: 'flows.delete_flow.discard.title',
    SUBTITLE: 'flows.delete_flow.discard.sub_title',
  },
  WARNING_TITLE: 'flows.delete_flow.warning',
  DELETE_FLOW: (t = translateFunction) => {
    return {
    TITLE: t('flows.delete_flow.title'),
    DRAFT: t('flows.delete_flow.draft'),
    RADIO_GROUP_OPTION_LIST: [
      {
        label: t('flows.delete_flow.radio_group_option_list.label_1'),
        value: 1,
      },
      {
        label:
        t('flows.delete_flow.radio_group_option_list.label_2'),
        value: 2,
      },
    ],
  DELETE_LABEL: t('flows.delete_flow.delete_label'),
    };
  },
  BASIC_INFO: {
    FLOW_NAME: {
      LABEL: 'flows.basic_info.flow_name.label',
      ID: 'flow_name',
      PLACEHOLDER: 'flows.basic_info.flow_name.placeholder',
    },
    SHORT_CODE: {
      LABEL: 'publish_settings.addon_settings.technical_configuration.short_code.title',
      ID: 'flow_short_code',
      PLACEHOLDER: translate('publish_settings.addon_settings.technical_configuration.short_code.placeholder'),
    },
    FLOW_DESCRIPTION: {
      LABEL: 'flows.basic_info.flow_description.label',
      ID: 'flow_description',
      PLACEHOLDER: 'flows.basic_info.flow_description.placeholder',
    },
    FLOW_TECHNICAL_REF_NAME: {
      LABEL: 'publish_settings.addon_settings.technical_configuration.technical_reference_name.title',
      ID: 'technical_reference_name',
      PLACEHOLDER: translate('publish_settings.addon_settings.technical_configuration.technical_reference_name.placeholder'),
    },
    FLOW_COLOR: {
      LABEL: translate('flows.basic_info.flow_color.label'),
      ID: 'flow_color',
      HELPER_TOOLTIP_MESSAGE: translate('flows.basic_info.flow_color.helper_tooltip_message'),
    },
    FLOW_CATEGORY: {
      LABEL: translate('flows.basic_info.flow_category.label'),
      ID: 'create_flow_category',
      PLACEHOLDER: translate('flows.basic_info.flow_category.placeholder'),
    },
  },
  SAVE_AND_CLOSE: 'flows.basic_info.action_buttons.save_and_close',
  PUBLISH: 'flows.basic_info.action_buttons.publish',
  STEPS: {
    INITIAL_CONFIGURATION_STEP: {
      FLOW_INITIATION: 'Flow Initiation',
      FLOW_WORKFLOW: 'Flow Workflow',
      FLOW_WORKFLOW_DESCRIPTION:
        'Once the start step for flow is configured, you will get option to configure workflow',
      STEP_NAME_PLACEHOLDER: 'flows.steps.step_name_placeholder',
    },
    ADD_STEP: {
      ADD_NEW_STEP: 'Add new step',
      ADD_BUTTON: 'Add',
    },
    STEP: {
      ACTION_CONFIG: {
        CREATE: 'flows.step_action_config.create',
        CREATE_END: 'flows.step_action_config.create_end',
        CHOOSE: 'flows.step_action_config.choose',
        CHOOSE_END: 'flows.step_action_config.choose_end',
        BUTTON_TEXT: 'flows.step_action_config.button_text',
        BUTTON_TEXT_END: 'flows.step_action_config.button_text_end',
        NO_DATA: 'flows.step_action_config.no_data',
      },
      BASIC_INFO_AND_ACTORS: {
        INDEX: 0,
        PROGRESS_COMMENT: '33.3%',
        TITLE: 'Actors',
        BASIC_INFO_AND_ACTORS_TITLE: 'Step Details & Actors',
        ID: 'create_flow_actors_helper_tooltip',
        HELPER_TOOLTIP_MESSAGE: 'To configure who will be performing this step',
        BASIC_INFO: { // current
          TITLE: translate('flows.basic_info_and_actors.basic_info.title'),
          SUB_TITLE: 'flows.basic_info_and_actors.basic_info.sub_title',
          STEP_TITLE: {
            PLACEHOLDER: 'flows.basic_info_and_actors.step_title.placeholder',
            LABEL: 'flows.basic_info_and_actors.step_title.label',
            HELPER_TOOLTIP_MESSAGE: 'flows.basic_info_and_actors.step_title.helper_tooltip_message',
            ID: 'create_flow_step_name_helper_tooltip',
          },
          STEP_DESCRIPTION: {
            PLACEHOLDER: 'flows.basic_info_and_actors.step_description.placeholder',
            LABEL: 'flows.basic_info_and_actors.step_description.label',
          },
        },
        ACTORS: {
          TITLE: 'Actors',
          SUB_TITLE: 'Add your actors to perform this task.',
          ADD_ACTORS_LABLE: 'Add actors with other options',
          AND_LABEL: 'flows.basic_info_and_actors.actors_strings.and_label',
          FLOW_TRIGGER_TITLE: 'flow_trigger.actors.first_step_actor',
          FLOW_TRIGGER_SUB_TITLE: 'flow_trigger.actors.step_actor_label',
          FLOW_TRIGGER_STEP_NAME_TITLE: 'flow_trigger.trigger_config_constants.step_name_label',
          FLOW_DEFAULT_ASSIGNEE_LABEL: 'flows.basic_info_and_actors.actors_strings.default_assignee',
          FLOW_TRIGGER_DEFAULT_ASSIGNEE_LABEL: 'flow_trigger.actors.default_trigger_assignee',
          ASSIGNEE_TYPE: {
            LABEL: 'flows.basic_info_and_actors.actors_strings.choose_actor_label',
            RULE_BASED: 'rule_assignee',
          },
          ACTORS_TEAMS: {
            ACTORS_TEAMS_SUGGESTION: {
              LABEL: 'Choose user(s) or team(s)',
              PLACEHOLDER: 'flow_trigger.actors.actor_team_placeholder',
            },
            CREATE_ADD_ACTORS: 'Create & add users',
            CREATE_ADD_TEAMS: 'Create & add teams',
          },
          FORM_FIELD_ASSIGNEE: {
            CHOOSE_FIELD: {
              LABEL: 'Choose any one of user picker fields',
              PLACEHOLDER: 'flow_trigger.actors.actor_team_placeholder',
              ID: 'assignee_field_uuids',
            },
            DEFAULT_FIELD_ASSIGNEE: {
              ID: 'assignee_field_default',
              LABEL: 'Choose Default User(s)',
              HELP_TEXT: "Default User(s) will be considered as Actors if selected User Picker field doesn't receive any value",
            },
            REPORTING_MANAGER_DEFAULT_ASSIGNEE: {
              ID: 'assignee_field_default',
              LABEL: "If above condition doesn't return a value then assign to",
              HELP_TEXT: "Default User(s) will be considered as Actors if selected field doesn't receive any value",
            },
          },
          OTHER_STEP_ASSIGNEE: {
            CHOOSE_STEP: {
              ID: 'other_step_uuids',
              PLACEHOLDER: 'flow_trigger.actors.other_step_assignee_placeholder',
              LABEL: 'Choose step, so the system can assign the user dynamically based on who completed that step',
            },
            DUE_DATA: {
              ID: 'due_data',
              LABEL: 'How many days you like to provide as due to complete this step?',
              DUE_DURATION_TYPES: [{ TYPE: 'days', SUFFIX_LABEL: 'Days' }],
            },
          },
        },
        SCHEDULE_FLOW: {
          REPEAT_TYPE_ERROR: 'scheduler_strings.option_required_error',
          ASSIGNEE_TYPE_ERROR: 'scheduler_strings.option_required_error',
          CHECKBOX: {
            ID: 'schedule_flow',
            LABEL: 'Do you want this flow initiation to be scheduled at regular intervals?',
            OPTIONS: [
              {
                label: 'Yes',
                value: true,
              },
              {
                label: 'No',
                value: false,
              },
            ],
          },
          MULTIPLE_ASSIGNEES: {
            ID: 'is_assign_to_individual_assignees',
            LABEL: 'Task is being assigned to more than one user. Who should complete it?',
            OPTIONS: [
              {
                label: 'Any one of the assignees',
                value: true,
              },
              {
                label: 'All of the assignees',
                value: false,
              },
            ],
          },
          REPEAT_EVERY: {
            ID: GET_RECURSIVE_DATA_CONSTANTS.REPEAT.ID,
            LABEL: GET_RECURSIVE_DATA_CONSTANTS.REPEAT.LABEL,
            OPTIONS: [
              {
                label: GET_RECURSIVE_DATA_CONSTANTS.REPEAT.DAY.LABEL,
                value: GET_RECURSIVE_DATA_CONSTANTS.REPEAT.DAY.VALUE,
              },
              {
                label: GET_RECURSIVE_DATA_CONSTANTS.REPEAT.MONTH.LABEL,
                value: GET_RECURSIVE_DATA_CONSTANTS.REPEAT.MONTH.VALUE,
              },
            ],
            TIME: {
              ID: 'at',
              LABEL: 'At',
            },
            DAY: {
              ID: 'on_day',
              LABEL: 'On Days',
            },
            MONTH: {
              ID: 'repeat_type',
              LABEL: 'Repeat on',
              OPTIONS: [
                {
                  label: 'First Day of the month',
                  value: 'first_day',
                },
                {
                  label: 'Last Day of the month',
                  value: 'last_day',
                },
                {
                  label: 'Selected week and day of the month',
                  value: 'selected_week_day',
                },
                {
                  label: 'Selected date of the month',
                  value: 'selected_date',
                },
              ],
            },
            WEEK: {
              ID: 'set_week',
              OPTIONS: [
                {
                  label: '1st Week',
                  value: 1,
                },
                {
                  label: '2nd Week',
                  value: 2,
                },
                {
                  label: '3rd Week',
                  value: 3,
                },
                {
                  label: '4th Week',
                  value: 4,
                },
              ],
            },
          },
        },
      },
      FORMS: {
        INDEX: 1,
        TITLE: 'Forms',
        FORM_TITLE: 'Design Form',
        ID: 'create_flow_forms_helper_tooltip',
        HELPER_TOOLTIP_MESSAGE: 'To configure the data that the user need to provide or look into during this step',
        SUB_TITLE: 'Add form fields to capture information.',
        PROGRESS_COMMENT: '66.6%',
        DATA_COLLECTION_CONFIRMATION: {
          LABEL:
            'Do you wish to collect any data from the user on this step?:',
          OPTION_LIST: [
            { value: 1, label: 'Yes' },
            { value: 2, label: 'No' },
          ],
        },
        NO_SOURCE: {
          TITLE: 'flows.form_field_design.create_form',
          SUB_TITLE: 'flows.form_field_design.create_form_subtitle',
          INDEX: 1,
        },
        IMPORT_SOURCE: {
          TITLE: 'flows.form_field_design.import_existing_form',
          SUB_TITLE: 'flows.form_field_design.import_form_subtitle',
          INDEX: 2,
        },
        IMPORT_FORM_POP_UP: {
          TITLE: 'Import Task Form',
          SUB_TITLE: 'Copy and Import first task form as read only',
          CANCEL: 'Cancel',
          IMPORT: 'Import',
        },
        FIELD_SUGGESTIONS: {
          TITLE: 'Field suggestions',
          DESC:
            'Choose the below fields. if it suits for your requirement.',
          MORE_SUGGESTIONS: 'More Suggessions',
          HIDE: 'Hide suggestions',
          UNHIDE: 'Show suggestions',
        },
      },
      CONFIGURATION: {
        INDEX: 2,
        TITLE: 'Additional Configuration',
        ID: 'create_flow_addon_configuration',
        HELPER_TOOLTIP_MESSAGE: 'To configure what action that this step actor can take when he completes the form of this step',

      },
      ACTIONS: {
        INDEX: 2,
        TITLE: 'Actions',
        CONFIGURATION_TITLE: 'Additional Configuration',
        ID: 'create_flow_actions_helper_tooltip',
        HELPER_TOOLTIP_MESSAGE: 'To configure what action that this step actor can take when he completes the form of this step',
        SUB_TITLE: 'Set the next action once the actor complete this step',
        PROGRESS_COMMENT: '100%',
        FINAL_STEP_CONFIRMATION: {
          LABEL: 'Is this the final step in the flow?',
          OPTION_LIST: [
            { value: 1, label: 'Yes' },
            { value: 2, label: 'No' },
          ],
        },
        ADD_ACTION: 'Add more task actions',
        ACTION: {
          ACTION_DD: {
            LABEL: 'flows.form_field_design.action_config_strings.action_dd_label',
            PLACEHOLDER: 'flows.form_field_design.action_config_strings.action_dd_placeholder',
          },
          ADVANCED_OPTION: 'Advanced options',
        },
        ACTION_CARD: {
          DIALOG_BOX_TITLE: {
            FORWARD_ACTION: 'Next Step Action Configuration',
            END_ACTION: 'End Action Configuration',
            REJECT_ACTION: 'Reject Action Configuration',
            CANCEL_ACTION: 'Cancel Action Configuration',
          },
          DESCRIPTION: {
            END_ACTION: 'It will complete the Flow Flow',
            REJECT_ACTION: 'It will reject Back to Previous Step',
            CANCEL_ACTION: 'It will cancel the Flow Flow',
          },
        },
      },

      ACTION_BUTTONS: {
        START: 'Next',
        ADD_ACTORS: 'Next',
        BACK: 'Back',
        NEXT: 'Next',
        CREATE_STEP: 'Update',
        FINISH: 'Finish',

        NEXT_FORM: 'Next: Form',
        NEXT_ACTIONS: 'Next: Actions',
        BACK_FORM: 'Back: Form',
        BACK_ACTORS: 'Back: Actors',
        UPDATE: 'Update',

        FORM: 'Form',
        ACTIONS: 'Actions',
        ACTORS: 'Actors',
        SAVE_STEP: 'Save Step',
      },
    },
  },
  SECURITY: {
    READ_ONLY_ACCESS_CONFIRMATION: {
      LABEL:
        'publish_settings.security_settings.flow_data_security.label',
      OPTION_LIST: (translate = translateFunction) => [
        { value: true, label: translate('publish_settings.security_settings.flow_data_security.option_list.tight_security') },
        { value: false, label: translate('publish_settings.security_settings.flow_data_security.option_list.open_security') },
      ],
    },
    ACTORS_TEAMS_SUGGESTION: {
      LABEL: 'publish_settings.security_settings.permitted_actors_teams.label',
    },
    ADDITIONAL_OWNER_CONFIRMATION: {
      LABEL:
        'Do you like to add additional owner to administrate this flow?',
      OPTION_LIST: [
        { value: 1, label: 'Yes' },
        { value: 2, label: 'No' },
      ],
    },
  },
  ACTION_BUTTONS: {
    BACK: 'flows.basic_info.action_buttons.back',
    CANCEL: translate('flows.basic_info.action_buttons.cancel'),
    SAVE: translate('flows.basic_info.action_buttons.save'),
    SAVE_CHANGES: translate('flows.basic_info.action_buttons.save_changes'),
    NEXT: 'flows.basic_info.action_buttons.next',
    CREATE_STEP: translate('flows.basic_info.action_buttons.create_step'),
    PUBLISH: translate('flows.basic_info.action_buttons.publish'),
    PUBLISH_CHANGES: translate('flows.basic_info.action_buttons.publish_changes'),
    SAVE_AND_CLOSE: translate('flows.basic_info.action_buttons.save_and_close'),
    START: translate('flows.basic_info.action_buttons.start'),
    CONTINUE: 'flows.basic_info.action_buttons.continue',
    DISCARD: translate('flows.basic_info.action_buttons.discard'),
    PUBLISH_FOR_TESTING: 'flows.basic_info.action_buttons.publish_for_testing',
    DELETE: translate('flows.basic_info.action_buttons.delete'),
    SAVE_STEP: translate('flows.basic_info.action_buttons.save_step'),
  },
  ACTIONS_ERROR_MESSAGE: 'User Actions must contain atleast 1 item',
  SETTINGS: {
    METRIC_ERROR_MESSAGE: 'server_validation_constants.select_from_current_list',
    SECURITY_SETTINGS: {
      LABEL: 'Security Settings',
      ID: 'security_settings',
    },
    CONGIFURE_SCHEDULER: {
      LABEL: 'Configure Scheduler',
      ID: 'configure_scheduler',
    },
    ADDON_SETTINGS: {
      LABEL: 'Addon Settings',
      ID: 'addon_settings',
    },
    ADD_DATA: {
      ADD_NEW_DATA: 'publish_settings.dashboard_settings.metrics.add_data.add_new_data',
      ADD_BUTTON: 'Add',
    },
    IDENTIFIER: {
      TITLE: 'publish_settings.addon_settings.identifier.title',
      DROPDOWN: {
        ID: 'custom_identifier',
        DATALIST_LABEL: translate('publish_settings.addon_settings.identifier.dl_title'),
        LABEL: 'publish_settings.addon_settings.identifier.dropdown_label',
      },
      CHECKBOX: {
        ID: 'is_system_identifier',
        OPTIONS: {
          label: translate('publish_settings.addon_settings.identifier.checkbox_label'),
          value: true,
        },
      },
    },
    TECHNICAL_CONFIGURATION: {
      TITLE: translate('publish_settings.addon_settings.technical_configuration.title'),
      SHORT_CODE_STRINGS: {
        TITLE: translate('publish_settings.addon_settings.technical_configuration.short_code.title'),
        INFORMATION: translate('publish_settings.addon_settings.technical_configuration.short_code.instruction'),
      },
      REFERENCE_NAME_STRINGS: {
        TITLE: translate('publish_settings.addon_settings.technical_configuration.technical_reference_name.title'),
        INFORMATION: translate('publish_settings.addon_settings.technical_configuration.technical_reference_name.instruction'),
      },
    },
    TASK_IDENTIFIER: {
      DROPDOWN: {
        ID: 'task_identifier',
        LABEL: 'publish_settings.addon_settings.task_identifier.dropdown_label',
      },
      ADD_FIELDS_BUTTON_ID: 'add_task_identifier_field',
      ADD_FIELDS_LABEL: 'publish_settings.addon_settings.task_identifier.add_fields',
      STEP_NAME_LABEL: 'publish_settings.addon_settings.task_identifier.step_name_label',
    },
    CATEGORY: {
      TITLE: 'publish_settings.addon_settings.category.title',
      LABEL: 'publish_settings.addon_settings.category.dropdown.label',
      PLACEHOLDER: 'publish_settings.addon_settings.category.dropdown.placeholder',
      ID: 'category',
      SERVER_ID: 'category_id',
      ADD_NEW_CATEGORY: {
        ID: 'newCategoryValue',
      },
      CREATE_LABEL: 'publish_settings.addon_settings.category.dropdown.create_label',
      CHOOSE_LABEL: 'publish_settings.addon_settings.category.dropdown.choose_label',
      BUTTON_TEXT: 'publish_settings.addon_settings.category.dropdown.button_text',
      NO_DATA: 'publish_settings.addon_settings.category.dropdown.no_data',
    },
  },
  FLOW_LABELS: {
    flow_name: translate('list_header.flow.flow_name'),
    flow_description: FLOW_T_STRINGS.FLOW_LABELS_FLOW_DESCRIPTION,
    steps: FLOW_T_STRINGS.FLOW_LABELS_STEPS,
    step_name: FLOW_T_STRINGS.FLOW_LABELS_STEP_NAME,
    step_description: FLOW_T_STRINGS.FLOW_LABELS_FLOW_STEP_DESCRIPTION,
    step_document: FLOW_T_STRINGS.FLOW_LABELS_STEP_DOCUMENT,
    effective_date: FLOW_T_STRINGS.FLOW_LABELS_EFFECTIVE_DATE,
    owners: FLOW_T_STRINGS.FLOW_LABELS_OWNERS,
    other_references: FLOW_T_STRINGS.FLOW_LABELS_OTHER_REFERENCES,
    step_statuses: FLOW_T_STRINGS.STEP_STATUS,
    step_assignees: 'Step Actors',
    // category: FLOW_T_STRINGS.CATEGORY,
    category_id: translate('flows.basic_info.flow_category.label'),
    technical_reference_name: translate('publish_settings.addon_settings.technical_configuration.technical_reference_name.title'),
  },
  SERVER_RESPONSE: {
    BROKEN_FLOW_ERROR: translate('flow_config_strings.server_response.broken_flow_error'),
    UNUSED_CONNECTED_STEPS: 'This step has unused connecting lines',
    INTEGRATION_CONFIFURATION_ERROR: 'Error in integration configuration',
    INTEGRATION_QUERY_PARAM_CONFIFURATION_ERROR: 'Error in query params configuration',
    INTEGRATION_RELATIVE_PATH_CONFIFURATION_ERROR: 'Error in relative path configuration',
    INTEGRATION_REQUESST_BODY_CONFIFURATION_ERROR: 'Error in request body configuration',
    DOCUMENT_GENERATION: {
      DATA_FIELDS: 'Fields used in document generation have been deleted',
    },
    NEW_STEP_ERROR_KEYS: {
      FROM_FLOW_DD: 'step_name_flow_dd',
      FROM_SYSTEM_STEP_CONFIG: 'step_name_system_stpe_config',
    },
    GET_FLOW_DATA_FAILURE: {
      title: 'Error',
      subTitle: 'Oops, something went wrong. Please try again later',
      ctaLabel: 'Try Again',
    },
    SAVE_FLOW_FAILURE: {
      title: 'Error',
      subtitle: 'Failed to save flow',
    },
    INCOMPLETE_STEP: {
      title: 'Error',
      subtitle: 'Please complete the required fields in steps',
    },
    SAVE_STEP_FAILURE: {
      title: 'Error',
      subtitle: 'Unable to save step',
    },
    PUBLISH_FLOW_FAILURE: {
      title: 'Error',
      subtitle: 'Failed to publish flow',
    },
    CONFIGURATIONS_NOT_ADDED: {
      title: 'Error Found: Unable to publish',
      subTitle: 'Added step(s) have some error or mis configurations. Kindly resolve it to publish',
    },
    CONFIGURATIONS_NOT_ADDED_SAVE_FLOW: (t = translateFunction) => {
      return {
      title: t('flow_config_strings.server_response.config_not_added_save_flow.title'),
      subtitle: t('flow_config_strings.server_response.config_not_added_save_flow.subtitle'),
      };
    },
    METRIC_ERROR_MESSAGE: {
      title: 'Error in default report fields data',
      subtitle: 'Remove the deleted field from default report fields data and publish',
    },
    OWNER_ROLE: {
      title: 'Some of the flow owner(s) role is not admin',
      subtitle: 'Change the owners\' role to admin and publish',
    },
    VIEWER_ROLE: {
      title: 'Some of the flow viewer(s) role is not admin',
      subtitle: 'Change the viewers\' role to admin and publish',
    },
    INITIATOR_STATUS: {
      title: 'Some of the flow initiator(s) are inactive',
      subtitle: 'Remove the inactive flow initiator and publish',
    },
    PARTICIPANTS_STATUS: {
      title: 'Some of the flow participant(s) are inactive',
      subtitle: 'Remove the inactive flow initiator and publish',
    },
    TRIGGER_DETAILS: (t = translateFunction) => {
      return {
        title: t('publish_settings.trigger_details.title'),
        subtitle: t('publish_settings.trigger_details.subtitle'),
      };
    },
    DELETE_FLOW_FAILURE: {
      title: 'Error',
      subtitle: 'Failed to delete flow',
    },
    DISCARD_FLOW_FAILURE: {
      title: 'Error',
      subtitle: 'Failed to discard flow',
    },
    UPDATE_FAILURE: (translate = translateFunction) => {
      return {
      title: translate('common_strings.error_label'),
      subtitle: translate('flow_config_strings.errors.failed_to_save_flow'),
      };
    },
    STEP_CONFIGURATION_VALIDATION: (translate = translateFunction) => {
      return {
      title: translate('flow_config_strings.errors.error_in_step'),
      subtitle: 'Please check and update step configuration',
      };
    },
    CONNECTOR_LINE_API_ERROR: {
      title: 'Unable to connect the steps',
    },
    CONNECTOR_LINE_TYPE_ERROR: {
      title: 'Unable to connect',
      subtitle: 'with',
    },
    CONNECTOR_LINE_SAME_FLOW: {
      title: 'Unable to add the same flow for both success and failure action',
    },
    FORM_CONFIGURATION_VALIDATION: {
      title: 'Error In Form',
      subtitle: 'Please check and update form configuration',
    },
    NEW_STEP_FAILURE: {
      title: 'Error',
      subtitle: 'Unable to create new step',
    },
    ADDITIONAL_CONFIG: {
      subTitle: 'flow_config_strings.server_response.additional_config_subtitle',
    },
    RESPONSE_KEY_MAPPING: {
      title: 'Error',
      subtitle: 'Same table is mapped for different response keys',
    },
    SEND_DATALIST_CONFIG_EXIST: {
      title: 'Configuration already exist',
      subtitle: 'The configuration for the same action, datalist and action type already exist',
    },
    LIMIT_EXCEEDED: {
      title: 'Limit Exceeded',
    },
    CREATE_FLOW_FAILURE: {
      title: 'Error',
      subtitle: 'Failed to create flow',
    },
    SAVE_NODE_FAILURE: {
      title: 'Unable to save step',
      subtitle: 'Please check the configurations',
    },
    SEND_DATA_LIST_FAILURE: (t) => {
      return {
        title: t('server_error_code_string.somthing_went_wrong'),
      };
    },
  },
});

export const PUBLISH_TO_TEST_STRINGS = (translate = translateFunction) => {
  return {
  TITLE: translate('flows.publish_test_strings.title'),
  BUTTON: {
    SECONDARY: translate('flows.publish_test_strings.button.primary'),
    PRIMARY: translate('flows.publish_test_strings.title'),
  },
  CONTENT: [
    {
      ID: '1',
      QUESTION: translate('flows.publish_test_strings.content.question_1'),
      ANSWER:
      translate('flows.publish_test_strings.content.answer_1'),
    },
    {
      ID: '2',
      QUESTION: translate('flows.publish_test_strings.content.question_2'),
      ANSWER:
      translate('flows.publish_test_strings.content.answer_2'),
        TRIGGER_INFO: translate('flows.publish_test_strings.trigger_info'),
    },
  ],
};
};

export const CONFIG_FIELD_KEY = {
  EMAIL_ACTIONS: 'email_actions',
  ESCALATIONS: 'escalations',
  TO_RECIPIENTS: 'to_recipients',
  EXTERNAL_RECIPIENT: 'external_recipient',
  TO_RECIPIENTS_FIELD_UUID: 'to_recipients_field_uuid',
  TO_RECIPIENTS_OTHER_STEP_ID: 'to_recipients_other_step_id',
  TO_RECIPIENTS_RULE: 'to_recipients_rule',
  DURATION: 'duration',
  DURATION_TYPE: 'duration_type',
  RECIPIENTS_TYPE: 'recipients_type',
  DATA_LIST_MAPPING: 'data_list_mapping',
  DOCUMENT_GENERATION: 'document_generation',
  TYPE: 'type',
};

export const RECIPIENT_OPTION_LIST = [
  {
    label: 'Users/Teams',
    value: 'direct_recipient',
  },
  {
    label: 'Email field',
    value: 'email_form_field_recipient',
  },
  {
    label: 'Email address',
    value: 'external_recipient',
  },
  {
    label: 'User field',
    value: 'form_field_recipient',
  },
  {
    label: 'Other step actor',
    value: 'other_step_recipient',
  },
  {
    label: 'Reporting manager of the user who completed any of the previous step',
    value: 'initiator_reporting_manager_recipient',
  },
  {
    label: 'Reporting manager of the user value captured in any of the previous step form field',
    value: 'form_reporting_manager_recipient',
  },
  {
    label: 'Current Step Finisher',
    value: 'same_step_recipient',
  },
  {
    label: 'Current Step Assignee(s)',
    value: 'same_step_assignees',
  },
  {
    label: 'Reporting manager of current task assignee',
    value: 'same_step_reporting_manager',
  },
];

export const ESCALATION_RECIPIENT_OPTION_LIST = [
  {
    label: 'Users/Teams',
    value: 'direct_recipient',
  },
  {
    label: 'Email field',
    value: 'email_form_field_recipient',
  },
  {
    label: 'Email address',
    value: 'external_recipient',
  },
  {
    label: 'User field',
    value: 'form_field_recipient',
  },
  {
    label: 'Other step recipient',
    value: 'other_step_recipient',
  },
  {
    label: 'Reporting manager of the user who completed any of the previous step',
    value: 'initiator_reporting_manager_recipient',
  },
  {
    label: 'Reporting manager of the user value captured in any of the previous step form field',
    value: 'form_reporting_manager_recipient',
  },
  {
    label: 'Current Step Assignee(s)',
    value: 'same_step_assignees',
  },
  {
    label: 'Reporting manager of current task assignee',
    value: 'same_step_reporting_manager',
  },
];

export const RECIPIENT_FIELD_CONTENT = {
  ADD_RECIPIENT: 'Add recipient',
  THEN_MAIL: 'Then Mail',
  AND: 'And',
  [RECIPIENT_TYPE.DIRECT_RECIPIENT]: {
    PLACEHOLDER: 'Type users(s) or teams(s) name',
  },
  [RECIPIENT_TYPE.EMAIL_FORM_FIELD_RECIPIENT]: {
    PLACEHOLDER: 'Choose any one of the email field',
  },
  [RECIPIENT_TYPE.EXTERNAL_RECIPIENT]: {
    PLACEHOLDER: 'Comma can be used to separate multiple email addresses',
  },
  [RECIPIENT_TYPE.FORM_FIELD_RECIPIENT]: {
    PLACEHOLDER: 'Choose any one of the user picker fields',
  },
  [RECIPIENT_TYPE.FORM_REPORTING_MANAGER_RECIPIENT]: {
    PLACEHOLDER: 'Choose any one of the user picker fields',
  },
  [RECIPIENT_TYPE.OTHER_STEP_RECIPIENT]: {
    PLACEHOLDER: 'Choose step, so the system can assign the user',
  },
  [RECIPIENT_TYPE.INITIATOR_REPORTING_MANAGER_RECIPIENT]: {
    PLACEHOLDER: 'Choose any one of the previous step',
  },
};

// send email strings
export const SEND_EMAIL_STRINGS = {
  AUTOMATED_ACTION: 'Automated Action',
  SYSTEM_FIELD: 'System field',
  FIELD_TYPE: { FORM_FIELD: 'FormField', SYSTEM_FIELD: 'SystemField' },
  CONFIGURE:
    'Configure the system actions to take place at the end of user form submission',
  SEND_EMAIL: 'Send Email',
  SEND_EMAIL_INSTRUCTION:
    'System will send an email once the user complete this step',
  EMAIL_TO: 'Then Mail To',
  CHOOSE_USER_OR_TEAMS: 'Choose User/Teams',
  CHOOSE_STEP: 'Choose Step',
  CHOOSE_STEP_ID: 'to_recipients_other_step_id',
  CHOOSE_USER_PICKER_FIELD: 'Choose User picker field',
  CHOOSE_USER_PICKER_FIELD_ID: 'to_recipients_field_uuid',
  CHOOSE_FIELD: 'Choose field',
  EMAIL_CC: 'Cc',
  EMAIL_NAME_LABEL: 'Email Name',
  EMAIL_NAME_ID: 'email_name',
  EMAIL_NAME_PLACEHOLDER:
    'Please enter email name(For eg: Confirmation mail etc.,)',
  EMAIL_SUBJECT_LABEL: 'Mail Subject',
  EMAIL_SUBJECT_ID: 'email_subject',
  EMAIL_SUBJECT_PLACEHOLDER: 'Enter the mail subject',
  EMAIL_BODY_ID: 'email_body',
  EMAIL_BODY_LABEL: 'Mail Description',
  EMAIL_BODY_PLACEHOLDER: 'Enter the mail description',
  TO_RECIPIENTS_REQUIRED: 'Atleast one to recipient is required',
  RECIPIENT_TYPE: 'recipients_type',
  ACTION_TYPE: 'action_type',
  ACTION_TYPE_LABEL:
    'On the click of which button in form , do you want to send this email?',
  SYSTEM_FIELD_OPTIONS_LIST: [
    { id: 'identifier', label: 'Flow Id', value: 'flow_id' },
    { id: 'initiated_by', label: 'Created By', value: 'created_by' },
    { id: 'initiated_on', label: 'Created On', value: 'created_on' },
    { id: 'completed_by', label: 'Completed By', value: 'completed_by' },
    { id: 'flow_link', label: 'Flow Link', value: 'flow_link' },
    { id: 'comments', label: 'Task Comments', value: 'task_comments' },
  ],
  SYSTEM_FIELD_LIST: ['identifier', 'initiated_by', 'initiated_on', 'completed_by', 'flow_link', 'comments', 'flow_id', 'created_by', 'created_on', 'task_comments'],
  INSERT_FIELD: 'Insert Field',
  ATTACHMENTS: 'Attachments',
  ATTACHMENTS_ID: 'Attachment_id',
  ATTACHMENT_CONTENT: 'Drop files here to attach or browse',
  ATTACH_FROM_FORM_FIELDS_ID: 'Attachment_form_field_id',
  ATTACH_FROM_FORM_FIELDS_PLACEHOLDER: 'Select form fields',
  ATTACH_FROM_FORM_FIELDS_LABEL: 'Attach files uploaded to form field(s)',
  ATTACHMENT_TOOLTIP: 'Total attachments size must be less than 25 MB',
};
export const RECIPIENT_TYPES = {
  DIRECT_RECIPIENT: 'direct_recipient',
  OTHER_STEP_RECIPIENT: 'other_step_recipient',
  RULE_RECIPIENT: 'rule_recipient',
  FORM_FIELD_RECIPIENT: 'form_field_recipient',
};

export const RECIPIENT_TYPE_OPTION_LIST = [
  {
    label: 'Users/Teams',
    value: 'direct_recipient',
  },
  {
    label: 'User who completed any of the previous steps',
    value: 'other_step_recipient',
  },
  {
    label: 'From form',
    value: 'form_field_recipient',
  },
];

export const RECIPIENT_TYPE_FIRST_STEP_OPTION_LIST = [
  {
    label: 'Users/Teams',
    value: 'direct_recipient',
  },
  {
    label: 'From form',
    value: 'form_field_recipient',
  },
];

export default SEND_EMAIL_STRINGS;

// SEND DATA TO DATA LIST
export const CONFIGURATION_TYPE_ID = {
  SEND_EMAIL: 1,
  SEND_ESCALATION: 2,
  SEND_DATA_TO_DATALIST: 3,
  DOCUMENT_GENERATION: 4,
};

// Form Constants
export const FORM_CLEAR = 'Added Form will be lost. Do you want to continue?';
export const DEFAULT_SECTION_NAME = 'Basic Details';
export const FORM_DEPENDENCY = {
  TITLE: 'Form dependency found',
  SUBTITLE: 'Dependency between forms found',
};
export const COLLECT_DATA = {
  YES: 1,
  NO: 2,
};

export const FLOW_ACTION_TYPES = {
  END_FLOW: {
    action: 'Mark as Completed',
    action_type: ACTION_TYPE.END_FLOW,
  },
  FORWARD: {
    action: 'Submit',
    action_type: ACTION_TYPE.FORWARD,
  },
  SEND_BACK: {
    action: 'Reject Back to Previous Step',
    action_type: ACTION_TYPE.SEND_BACK,
  },
  CANCEL: {
    action: 'Cancel',
    action_type: ACTION_TYPE.CANCEL,
  },
  ASSIGN_REVIEW: {
    action: 'Assign this step for further review',
    action_type: ACTION_TYPE.ASSIGN_REVIEW,
  },
  DEFAULT_SEND_BACK: {
    action: 'Send Back to Review Requestor',
    action_type: ACTION_TYPE.DEFAULT_SEND_BACK,
  },
  // NEXT: {
  //   action: 'Submit',
  //   action_type: ACTION_TYPE.NEXT,
  // },
};

export const FLOW_WORKFLOW_ALGORITHM = {
  OPTION_LIST: (t) => [
    {
      value: 0,
      label: t('flows.basic_info_and_actors.actors_strings.assignment_preference_label'),
    },
    {
      value: 1,
      label: t('flows.basic_info_and_actors.actors_strings.distribute_task'),
    },
  ],
};
export const RULE_ENGINE_UNARY_OPERATORS = [
  'isEmpty',
  'isNotEmpty',
  'booleanIsTrue',
  'booleanIsFalse',
  'dateIsToday',
  'dateIsPastDate',
  'dateIsFutureDate',
  'dateIsWeekend',
  'dateIsWeekday',
  'dateIsHoliday',
  'fileIsEmpty',
  'fileIsNotEmpty',
];

export const RULE_CONDITIONS = {
  RULE_NAME: 'configure_rule.rule_name_label',
  RULE_NAME_ID: 'rule_name_id',
  RULE_NAME_PLACEHOLDER: 'configure_rule.rule_name_placeholder',
  RULE_TYPE: 'configure_rule.rule_type_label',
  RULE_TYPE_ID: 'rule_type_id',
  RULE_TYPE_PLACEHOLDER: 'configure_rule.rule_type_placeholder',
  RULE_TYPE_VALUE: 'configure_rule.rule_type_value',
};

export const GET_ALL_FIELDS_LIST_BY_FILTER_TYPES = {
  METRICS: 1,
  IDENTIFIERS: 2,
  TASK_IDENTIFIERS: 3,
  GET_ALL_FIELDS: 4,
  DEFAULT_REPORT_FIELDS: 1,
};

export const STEP_ACTOR_STRINGS = {
  CREATE_RULE: 'flow_trigger.actors.create_rule',
  EDIT_RULE: 'flow_trigger.actors.edit_rule',
};

export const FIELD_TYPE_CATEGORY = {
  NUMBER_FIELDS: [
    FIELD_TYPE.NUMBER,
    FIELD_TYPE.CURRENCY,
    FIELD_TYPE.TIME,
    FIELD_TYPE.PERCENTAGE,
    FIELD_TYPE.TIME,
    FIELD_TYPE.RATING,
    FIELD_TYPE.PHONE_NUMBER,
  ],
  SELECTION_FIELDS: [
    FIELD_TYPE.YES_NO,
    FIELD_TYPE.CHECKBOX,
    FIELD_TYPE.DROPDOWN,
    FIELD_TYPE.RADIO_GROUP,
    FIELD_TYPE.CUSTOM_LOOKUP_CHECKBOX,
    FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
    FIELD_TYPE.CUSTOM_LOOKUP_RADIOBUTTON,
    FIELD_TYPE.DATA_LIST,
    FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
    FIELD_TYPE.USER_TEAM_PICKER,
    FIELD_TYPE.USER_PROPERTY_PICKER,
    FIELD_TYPE.TEAMS,
  ],
  TEXT_FIELDS: [
    FIELD_TYPE.SINGLE_LINE,
    FIELD_TYPE.PARAGRAPH,
    FIELD_TYPE.EMAIL,
    FIELD_TYPE.ADDRESS,
    FIELD_TYPE.LINK,
    FIELD_TYPE.SINGLE_LINE,
    'string',
  ],
  FILE_FIELDS: [
    FIELD_TYPE.FILE_UPLOAD,
  ],
  TABLE_FIELDS: [
    FIELD_TYPE.TABLE,
  ],
  DATE_FIELDS: [
    FIELD_TYPE.DATETIME,
    FIELD_TYPE.DATE,
  ],
};

export const STEP_CARD_STRINGS = (t = translateFunction) => {
  return {
OTHER_ACTIONS: t('flows.step_card_strings.other_actions'),
START_FLOW_TEXT: t('flows.step_card_strings.start_flow_text'),
DELETE_FLOW_TEXT: t('flows.step_card_strings.delete_flow_text'),
DELETE_BUTTON: t('flows.delete_flow.delete_button'),
CANCEL_BUTTON: t('flows.delete_flow.cancel_button'),
CHANGE_BUTTON: t('set_assignee.set_assignee.change'),
SCHEDULER: t('flows.start_node_config.schedule_flow.schedule'),
CREATE_FLOW: t('flows.create_flow_title'),
SECTION_PLACEHOLDER: t('flows.form_field_design.section_placeholder'),
FORM_ACTIONS: t('flows.form_field_design.form_actions'),
ADD_BUTTON: t('flows.form_field_design.add_button'),
SAVE_BUTTON: t('flows.form_field_design.save_button'),
ADD_FORM_FIELDS: t('flows.form_field_design.add_form_fields'),
NO_SUGGESTION_FOUND: t('flows.form_field_design.no_suggestion_found'),
DRAG_AND_DROP: t('flows.send_email_strings.drag_and_drop'),
CHOOSE_FILE: t('flows.send_email_strings.choose_file'),
DISCARD_FLOW: t('flows.form_field_design.discard_flow'),
EDIT_BASIC_DETAILS: t('flows.form_field_design.edit_basic_details'),
  };
};

export const ACTION_CONFIG_BUTTON = {
  DIALOG_BOX_TITLE: 'flows.form_field_design.action_configuration_button.dialog_box_title',
  BASIC_TEXT: 'flows.form_field_design.action_configuration_button.basic_text',
  VISIBILITY_TEXT: 'flows.form_field_design.action_configuration_button.visibility_text',
  CHECK_BOX_INFO: 'flows.form_field_design.action_configuration_button.check_box_info',
  BUTTON_LABEL: 'flows.form_field_design.action_configuration_button.button_label',
  CHECK_OPTION: 'flows.form_field_design.action_configuration_button.check_option',
};

export const ACTORS_RECOMMENDED_STRINGS = {
  WHY_RECOMMENDED: 'flows.actors_recommended_strings.why_recommended',
  DESCRIPTION_1: 'flows.actors_recommended_strings.description_1',
  DESCRIPTION_2: 'flows.actors_recommended_strings.description_2',
  OK: 'flows.actors_recommended_strings.ok',
};

export const STEPPER_DETAILS_STRINGS = {
  STEP_DETAILS_AND_ACTORS: 'flows.stepper_details_strings.step_details_and_actors',
  DESIGN_FORM: 'flows.stepper_details_strings.design_form',
  ADDITIONAL_CONFIG: 'flows.stepper_details_strings.additional_config',
};

export const ACTORS_STRINGS = {
STEP_ACTORS: 'flows.basic_info_and_actors.actors_strings.step_actors',
STEP_TEXT: 'flows.basic_info_and_actors.actors_strings.step_text',
SET_ASSIGNMENT: 'flows.basic_info_and_actors.actors_strings.set_assignment',
  INVALID_ACTOR: 'flows.basic_info_and_actors.actors_strings.invalid_step_actors',
  CONDITIONAL_RULE_ASSIGNEE: 'flow_builder.conditional_rule_assignee',
};

export const ELSE_IF_CONDITION = {
  THEN_MOVE_TO: 'flows.else_if_condition.move_to',
  NO_STEP: 'flows.else_if_condition.no_step',
  DELETE_CONDITION: 'flows.else_if_condition.delete_condition',
  ELSE: 'flows.else_if_condition.else',
  THEN_DIRECT_TO: 'flows.else_if_condition.then_direct_to',
};

export const CONDITION_CONFIGURATION_STRINGS = {
  CONDITION_CONFIGURATION: 'flows.condition_configuration_strings.condition_configuration',
  APPLY_CONDITION: 'flows.condition_configuration_strings.apply_condition',
};

export const CONFIGURE_RULE = {
THEN_ASSIGN_TO: 'configure_rule.assign_to',
NO_USER_OR_TEAM_CONFIGURED: 'configure_rule.no_user_or_team_configured',
CONFIGURE_RULE_LABEL: 'configure_rule.configure_rule_label',
DISCARD: 'configure_rule.discard',
SAVE: 'configure_rule.save',
DELETE_CONDITION: 'configure_rule.delete_condition',
ADD_ANOTHER_CONDITION: 'configure_rule.add_another_condition',
};
