import cx from 'classnames/bind';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import gClasses from 'scss/Typography.module.scss';
import { FIELD_TYPE } from 'utils/constants/form.constant';
import { translate } from 'language/config';
import { translateFunction } from 'utils/jsUtility';
import { JOIN_STEP_CONDITIONS } from '../../EditFlow.constants';
import { EMAIL_RECIPIENT_TYPE } from '../node_configurations/send_email/SendEmailConfig.constants';

export const CONFIGURATION_TYPE_ID = {
  SEND_EMAIL: 1,
  SEND_ESCALATION: 2,
  SEND_DATA_TO_DATALIST: 3,
  DOCUMENT_GENERATION: 4,
};
export const BRANCH_STEP = {
  CREATE_LABEL: translate('parallel_step_config.branch_step.create_label'),
  CHOOSE_LABEL: translate('parallel_step_config.branch_step.choose_label'),
  BUTTON_TEXT: translate('parallel_step_config.branch_step.button_text'),
  NO_DATA: translate('parallel_step_config.branch_step.no_data'),
};
export const PARALLEL_STEP_CONFIG = {
  HEADER: 'parallel_step_config.header',
  FOOTER: {
    SAVE: 'parallel_step_config.footer.save',
  },
  MULTI_DROPDOWN: {
    BUTTON_ID: 'createNewStepForSystemStep',
    LABEL: translate('parallel_step_config.multi_dropdown.label'),
    PLACEHOLDER: translate('parallel_step_config.multi_dropdown.placeholder'),
  },
  SINGLE_DROPDOWN: {
    LABEL: translate('parallel_step_config.single_dropdown.label'),
    PLACEHOLDER: translate('parallel_step_config.single_dropdown.placeholder'),
  },
  INPUT: {
    LABEL: translate('parallel_step_config.input.label'),
    PLACEHOLDER: translate('parallel_step_config.input.placeholder'),
  },
  JOIN_TYPE: {
    LABEL: translate('parallel_step_config.join_type.label'),
    OPTIONS: [
      {
        label: translate('parallel_step_config.join_type.options.all_steps'),
        value: JOIN_STEP_CONDITIONS.ALL,
      },
      {
        label: translate('parallel_step_config.join_type.options.any_one_step'),
        value: JOIN_STEP_CONDITIONS.ANY,
      },
    ],
    ACTIONS_ERROR: translate('parallel_step_config.join_type.actions_error'),
    STEP_COUNT_ERROR: translate('parallel_step_config.join_type.step_count_error'),
  },
  BRANCH_PARALLEL: {
    ACTIONS_ERROR: translate('parallel_step_config.branch_parallel.actions_error'),
  },
};

export const ADDON_CONFIG = {
  SEND_EMAIL: (t) => {
    return {
      label: t('flows.addon_config.send_email_label'),
      value: 'send_email_condition',
      id: 'send_email_condition',
    };
  },
  SEND_DATA_TO_DATALIST: (t) => {
    return {
      label: t('flows.addon_config.send_data_to_data_list'),
      value: 'send_data_to_datalist_condition',
      id: 'send_data_to_datalist_condition',
    };
  },
  DOCUMENT_GENERATION: (t) => {
    return {
      label: t('flows.addon_config.document_generation'),
      value: 'document_generation_condition',
      id: 'document_generation_condition',
    };
  },
};

export const STEP_FOOTER_BUTTONS = (t = translateFunction) => {
  return {
    SAVE_AND_CLOSE: t('flows.step_footer_button.save_and_close'),
    NEXT: t('flows.step_footer_button.next'),
    SAVE_STEP: t('flows.step_footer_button.save_step'),
    DELETE_STEP: t('flows.step_footer_button.delete_step'),
    BACK: t('flows.step_footer_button.back'),
  };
};

export const CUSTOM_EMAIL_FORM_FIELD_ERROR = translate('flows.configruation_content.custom_email_form_field_error');

export const CONFIGURATION_STRINGS = {
  SEND_EMAIL: 'flows.configruation_content.send_email.title',
  SEND_ESCALATION: 'flows.configruation_content.send_escalation.title',
  SEND_DATA_TO_DATALIST: 'flows.configruation_content.send_data_to_data_list.title',
  DOCUMENT_GENERATION: 'flows.configruation_content.document_generation.title',
};

export const CONFIGURATION_CONTENT = [
  {
    ID: CONFIGURATION_TYPE_ID.SEND_EMAIL,
    TITLE: CONFIGURATION_STRINGS.SEND_EMAIL,
    SUB_TITLE: 'flows.configruation_content.send_email.sub_title',
    CONDITION_TEXT: translate('flows.configruation_content.send_email.condition_text'),
    ACTIONS: {
      ADD: 'flows.configruation_content.send_email.actions_add',
    },
    MODAL: {
      TITLE: 'flows.configruation_content.send_email.modal_title',
      FIELDS: {},
    },
  },
  {
    ID: CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST,
    TITLE: CONFIGURATION_STRINGS.SEND_DATA_TO_DATALIST,
    SUB_TITLE: 'flows.configruation_content.send_data_to_data_list.sub_title',
    CONDITION_TEXT: 'flows.configruation_content.send_data_to_data_list.condition_text',
    ACTIONS: {
      ADD: 'flows.configruation_content.send_data_to_data_list.actions_add',
    },
    MODAL: {
      TITLE: 'flows.configruation_content.send_data_to_data_list.modal_title',
      FIELDS: {},
    },
  },
  {
    ID: CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION,
    TITLE: CONFIGURATION_STRINGS.DOCUMENT_GENERATION,
    SUB_TITLE: 'flows.configruation_content.document_generation.sub_title',
    CONDITION_TEXT: 'flows.configruation_content.document_generation.condition_text',
    ACTIONS: {
      ADD: 'flows.configruation_content.document_generation.actions_add',
    },
    MODAL: {
      TITLE: 'flows.configruation_content.document_generation.modal_title',
      FIELDS: {},
    },
  },
];

export const MODAL_ACTION_BUTTON = {
  DISCARD: 'flows.configruation_content.modal_action_button.discard',
  SAVE: 'flows.configruation_content.modal_action_button.save',
  CANCEL: 'mfa.cancel_btn_text',
};

export const ADD_ON_CONFIG = 'Addon configuration';

export const VALIDATION_STRINGS = {
  INVALID_EMAIL: 'flow_config_strings.errors.invalid_email',
};

export const DUE_DATE_AND_STATUS = {
  TITLE: translate('flows.due_date_and_status.title'),
  DUE_DATE: {
    ID: 'due_data',
    LABEL: translate('flows.due_date_and_status.due_date_label'),
    PLACEHOLDER: '000',
    LOOKUP: {
      DAYS: 'days',
      HOURS: 'hours',
    },
    OPTIONS: [
      {
        label: translate('flows.due_date_and_status.days_label'),
        value: 'days',
      },
      {
        label: translate('flows.due_date_and_status.hours_label'),
        value: 'hours',
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
    LABEL: translate('flows.basic_config_strings.fields.step_due_date.customized_status.label'),
    PLACEHOLDER: translate('flows.basic_config_strings.fields.step_due_date.customized_status.placeholder'),
    TOOLTIP_MESSAGE: {
      LABEL: translate('flows.basic_config_strings.fields.step_due_date.customized_status.tooltip_message'),
      ID: 'customezed_status_tooltip',
    },
    OPTIONS: [
      {
        label: translate('flows.basic_config_strings.fields.step_due_date.in_progress'),
        value: 'In Progress',
      },
    ],
  },
};

export const CONFIG_FIELD_KEY = {
  EMAIL_ACTIONS: 'email_actions',
  ESCALATIONS: 'escalations',
  TO_RECIPIENTS: 'to_recipients',
  EXTERNAL_RECIPIENT: 'external_recipient',
  TO_RECIPIENTS_FIELD_UUID: 'to_recipients_field_uuids',
  TO_RECIPIENTS_OTHER_STEP_ID: 'to_recipients_other_steps',
  TO_RECIPIENTS_RULE: 'to_recipients_rule',
  DURATION: 'duration',
  DURATION_TYPE: 'duration_type',
  RECIPIENTS_TYPE: 'recipients_type',
  DATA_LIST_MAPPING: 'data_list_mapping',
  DOCUMENT_GENERATION: 'document_generation',
};

export const RECIPIENT_TYPE = {
  DIRECT_RECIPIENT: 'direct_recipient',
  RULE_RECIPIENT: 'rule_recipient',
  OTHER_STEP_RECIPIENT: 'other_step_recipient',
  INITIATOR_REPORTING_MANAGER_RECIPIENT: 'initiator_reporting_manager_recipient',
  FORM_FIELD_RECIPIENT: 'form_field_recipient',
  FORM_REPORTING_MANAGER_RECIPIENT: 'form_reporting_manager_recipient',
  EXTERNAL_RECIPIENT: 'external_recipient',
  EMAIL_FORM_FIELD_RECIPIENT: 'email_form_field_recipient',
  CURRENT_STEP_FINISHER: 'same_step_recipient',
  CURRENT_STEP_ASSIGNEE: 'same_step_assignees',
  SAME_STEP_REPORTING_MANAGER: 'same_step_reporting_manager',
};

export const RECIPIENT_TYPE_LOOKUP = [
  RECIPIENT_TYPE.DIRECT_RECIPIENT,
  RECIPIENT_TYPE.RULE_RECIPIENT,
  RECIPIENT_TYPE.OTHER_STEP_RECIPIENT,
  RECIPIENT_TYPE.INITIATOR_REPORTING_MANAGER_RECIPIENT,
  RECIPIENT_TYPE.FORM_FIELD_RECIPIENT,
  RECIPIENT_TYPE.FORM_REPORTING_MANAGER_RECIPIENT,
  RECIPIENT_TYPE.EXTERNAL_RECIPIENT,
  RECIPIENT_TYPE.EMAIL_FORM_FIELD_RECIPIENT,
  RECIPIENT_TYPE.CURRENT_STEP_FINISHER,
  RECIPIENT_TYPE.CURRENT_STEP_ASSIGNEE,
  RECIPIENT_TYPE.SAME_STEP_REPORTING_MANAGER,
];

export const RECIPIENT_OPTION_LIST = (t = translateFunction) => [
  {
    label: t('flow_config_strings.recipient_option_list.direct_recipient'),
    value: 'direct_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.email_form_field_recipient'),
    value: 'email_form_field_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.external_recipient'),
    value: 'external_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.form_field_recipient'),
    value: 'form_field_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.other_step_recipient'),
    value: 'other_step_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.initiator_reporting_manager_recipient'),
    value: 'initiator_reporting_manager_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.form_reporting_manager_recipient'),
    value: 'form_reporting_manager_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.reporting_manager_task_assign'),
    value: 'same_step_reporting_manager',
  },
  {
    label: t('flow_config_strings.recipient_option_list.same_step_recipient'),
    value: 'same_step_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.same_step_assignees'),
    value: 'same_step_assignees',
  },
];

export const ESCALATION_RECIPIENT_OPTION_LIST = (t = () => { }) => [
  {
    label: t('flow_config_strings.recipient_option_list.direct_recipient'),
    value: 'direct_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.email_form_field_recipient'),
    value: 'email_form_field_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.external_recipient'),
    value: 'external_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.form_field_recipient'),
    value: 'form_field_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.other_step_recipient'),
    value: 'other_step_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.initiator_reporting_manager_recipient'),
    value: 'initiator_reporting_manager_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.form_reporting_manager_recipient'),
    value: 'form_reporting_manager_recipient',
  },
  {
    label: t('flow_config_strings.recipient_option_list.reporting_manager_task_assign'),
    value: 'same_step_reporting_manager',
  },
  {
    label: t('flow_config_strings.recipient_option_list.same_step_assignees'),
    value: 'same_step_assignees',
  },
];

export const RECIPIENT_FIELD_CONTENT = {
  ADD_RECIPIENT: 'flows.send_email_strings.add_recipient',
  THEN_MAIL: 'flows.send_email_strings.then_mail',
  AND: 'flows.send_email_strings.and',
  [RECIPIENT_TYPE.DIRECT_RECIPIENT]: {
    PLACEHOLDER: translate('flows.configuration_strings.recipient_placeholders.direct'),
  },
  [RECIPIENT_TYPE.EMAIL_FORM_FIELD_RECIPIENT]: {
    PLACEHOLDER: translate('flows.configuration_strings.recipient_placeholders.email_field'),
  },
  [RECIPIENT_TYPE.EXTERNAL_RECIPIENT]: {
    PLACEHOLDER: translate('flows.configuration_strings.recipient_placeholders.external_email'),
  },
  [RECIPIENT_TYPE.FORM_FIELD_RECIPIENT]: {
    PLACEHOLDER: translate('flows.configuration_strings.recipient_placeholders.user_field'),
  },
  [RECIPIENT_TYPE.FORM_REPORTING_MANAGER_RECIPIENT]: {
    PLACEHOLDER: translate('flows.configuration_strings.recipient_placeholders.user_field'),
  },
  [RECIPIENT_TYPE.SAME_STEP_REPORTING_MANAGER]: {
    PLACEHOLDER: translate('flows.configuration_strings.recipient_placeholders.user_field'),
  },
  [RECIPIENT_TYPE.OTHER_STEP_RECIPIENT]: {
    PLACEHOLDER: translate('flows.configuration_strings.recipient_placeholders.other_step_assignee'),
  },
  [RECIPIENT_TYPE.INITIATOR_REPORTING_MANAGER_RECIPIENT]: {
    PLACEHOLDER: translate('flows.configuration_strings.recipient_placeholders.reporting_other_step'),
  },
};

export const FLOW_CONFIGURATION_MODAL_ID = 'flow_configuration_modal_layout';

export const INIT_CONFIGURATION_CARD_TEMPLATE = {
  [CONFIGURATION_TYPE_ID.SEND_EMAIL]: {
    email_name: null,
    is_action_type: false,
    action_type: [],
    email_subject: null,
    email_body: null,
    recipients: [
      {
        [CONFIG_FIELD_KEY.RECIPIENTS_TYPE]: EMAIL_RECIPIENT_TYPE.USERS_OR_TEAMS,
        [CONFIG_FIELD_KEY.TO_RECIPIENTS]: {},
      },
    ],
    is_condition_rule: false,
  },
  [CONFIGURATION_TYPE_ID.SEND_ESCALATION]: {
    escalation_type: 'email',
    escalation_recipients: [
      {
        [CONFIG_FIELD_KEY.RECIPIENTS_TYPE]: RECIPIENT_TYPE.DIRECT_RECIPIENT,
        [CONFIG_FIELD_KEY.TO_RECIPIENTS]: {},
      },
    ],
    escalation_due: { duration_type: DUE_DATE_AND_STATUS.DUE_DATE.OPTIONS[0].value, duration: '' },
  },
  [CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST]: {},
  [CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION]: {
    is_action_type: false,
    action_type: [],
    document_body: EMPTY_STRING,
    is_condition_rule: false,
    document_field_name: EMPTY_STRING,
    file_name: EMPTY_STRING,
    image_doc_ids: [],
    header_document: {
      header_config: {
        show_in_pages: EMPTY_STRING,
        show_page_number: EMPTY_STRING,
      },
    },
    footer_document: {
      footer_config: {
        show_in_pages: EMPTY_STRING,
        show_page_number: EMPTY_STRING,
      },
    },
  },
};

export const EMAIL_ESCALATION_STRING = {
  THEN_MAIL: 'flows.send_email_strings.then_mail',
  INSTRUCTION_MESSAGE: 'flows.due_date_and_status.instruction_message',
  FORM_DETAILS: {
    DUE_DATE: {
      ID: 'due date',
      LABEL: 'Set escalation hours/days after this step got assigned',
      PLACEHOLDER: '000',
      OPTIONS: [
        {
          label: 'Days',
          value: 'days',
        },
        {
          label: 'Hours',
          value: 'hours',
        },
      ],
    },
    ESCALATION_TYPE: {
      TITLE: 'flows.due_date_and_status.escalation_type_title',
      LABEL: 'flows.due_date_and_status.escalation_type_label',
      VALUE: 'email',
    },
    MAIL_SUBJECT: {
      LABEL: 'flows.due_date_and_status.mail_subject_label',
      VALUE: 'flows.due_date_and_status.mail_subject_value',
    },
    DESCRIPTION_LABEL: {
      LABEL: 'flows.due_date_and_status.mail_description_label',
      Value: [
        {
          id: 'NAME',
          value: 'flows.due_date_and_status.description_message.line_1',
          class: '',
        },
        {
          id: 'INFO',
          value:
            'flows.due_date_and_status.description_message.line_2',
          class: cx(gClasses.MT30),
        },
        {
          id: 'FLOW_NAME',
          value: 'flows.due_date_and_status.description_message.line_3',
          class: cx(gClasses.MT3),
        },
        {
          id: 'TASK_NAME',
          value: 'flows.due_date_and_status.description_message.line_4',
          class: cx(gClasses.MT3),
        },
        {
          id: 'PENDING_SINCE',
          value: 'flows.due_date_and_status.description_message.line_5',
          class: cx(gClasses.MT3),
        },
        {
          id: 'PENDING_WITH',
          value: 'flows.due_date_and_status.description_message.line_6',
          class: cx(gClasses.MT3),
        },
        {
          id: 'LINK_INSTRUCTION',
          value: 'flows.due_date_and_status.description_message.line_7',
          class: cx(gClasses.MT20),
        },
        {
          id: 'INSTRUCTION',
          value: 'flows.due_date_and_status.description_message.line_8',
          class: cx(gClasses.MT3, gClasses.Italics),
        },
        {
          id: 'THANKS',
          value: 'flows.due_date_and_status.description_message.line_9',
          class: cx(gClasses.MT20),
        },
        {
          id: 'TEAM',
          value: 'flows.due_date_and_status.description_message.line_10',
          class: cx(gClasses.MT3),
        },
      ],
    },
  },
};

export const ADD_STATUS = 'Add Status';

export const SEND_DATA_TO_DATALIST_STRINGS = {
    OPERANDS: {
      ADD: 'flows.send_data_to_datalist_all_labels.operands.add',
      SUB: 'flows.send_data_to_datalist_all_labels.operands.sub',
      MUL: 'flows.send_data_to_datalist_all_labels.operands.mul',
      DIV: 'flows.send_data_to_datalist_all_labels.operands.div',
      EQUAL_TO: 'flows.send_data_to_datalist_all_labels.operands.equal_to',
    },
    ACTION_TYPE: {
      AUTO: 'flows.send_data_to_datalist_all_labels.action_type_options.auto_label',
      UPDATE: 'flows.send_data_to_datalist_all_labels.action_type_options.update',
      DELETE: 'flows.send_data_to_datalist_all_labels.action_type_options.delete_label',
    },
    ENTRY_ID: {
      FORM_FIELD: 'form_field',
    },
    ALL_LABELS: {
      CONDITION_AND_DATALIST: 'flows.send_data_to_datalist_all_labels.condition_and_datalist',
      BUTTON_ACTION_FIELD: 'flows.send_data_to_datalist_all_labels.button_action_field',
      CHOOSE_DATALIST: 'flows.send_data_to_datalist_all_labels.choose_datalist',
      CHOOSE_ACTION_TYPE: 'flows.send_data_to_datalist_all_labels.choose_action_type',
      AUTO_TYPE_INSTRUCTION: 'flows.send_data_to_datalist_all_labels.auto_type_instruction',
      MAP_FIELDS_WITH_DATALIST: 'flows.send_data_to_datalist_all_labels.map_fields_with_datalist',
      CHOOSE_FLOW_FIELD: 'flows.send_data_to_datalist_all_labels.choose_flow_fields',
      SEARCH_FIELDS: 'configuration_strings.all_labels.search_field',
      SEARCH_COLUMNS: 'configuration_strings.all_labels.search_column',
      OPERATION: 'flows.send_data_to_datalist_all_labels.operation',
      CHOOSE_DATALIST_FIELD: 'flows.send_data_to_datalist_all_labels.choose-datalist_field',
      CHOOSE_FIELD: 'flows.send_data_to_datalist_all_labels.choose-field',
      CHOOSE_OPERATION: 'flows.send_data_to_datalist_all_labels.choose_operation',
      ADD_DATA: 'flows.send_data_to_datalist_all_labels.add_data',
      CHOOSE_FORM_FIELD: 'flows.send_data_to_datalist_all_labels.choose_form_field',
      CHOOSE_ACTION_BUTTON: 'flows.send_data_to_datalist_all_labels.choose_action_button',
      DATA_FIELDS: 'configuration_strings.all_labels.data_field',
      SYSTEM_FIELDS: 'configuration_strings.all_labels.System_fields',
      CHOOSE_FIELDS: 'configuration_strings.all_labels.choose_field',
      FLOW_FIELD: 'configuration_strings.all_labels.flow_field',
      DATALIST_FIELD: 'configuration_strings.all_labels.data_list_field',
      SYSTEM_FIELD: 'configuration_strings.all_labels.system_field',
      FORM_FIELD: 'configuration_strings.all_labels.form_field',
      ACTION_UUID: 'configuration_strings.all_labels.action_uuid',
      DATA_LIST: 'configuration_strings.all_labels.data_list',
      ENTRY_ACTION_TYPE: 'configuration_strings.all_labels.entry_action_type',
      TABLE_UUID: 'configuration_strings.all_labels.table_uuid',
      UPDATE_TYPE: 'configuration_strings.all_labels.update_type',
      FIELD_DELETED: 'configuration_strings.all_labels.field_deleted',
      DATALIST_DELETED: 'configuration_strings.all_labels.data_list_deleted',
      STATIC_VALUE: 'flows.send_data_to_datalist_all_labels.static_value',
      VALUE_TYPE: 'flows.send_data_to_datalist_all_labels.value_type',
      VALUE: 'flows.send_data_to_datalist_all_labels.value',
    },
    FIELD_MATCH_CATEGORY: {
      CATEGORY_1: [FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY],
      CATEGORY_2: [FIELD_TYPE.SINGLE_LINE, FIELD_TYPE.DROPDOWN, FIELD_TYPE.RADIO_GROUP, FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN],
    },
    VALIDATION_MESSAGE: {
      ACTION_UUID: 'flow_config_strings.additional_config.button_action_validation',
      TABLE_COLUMN_MAPPING: 'flow_config_strings.additional_config.table_column_mapping_validation',
      MAPPING: 'flow_config_strings.additional_config.data_list_mapping',
    },
};

export const DOCUMENT_TABS = {
  BASIC: 0,
  HEADER: 1,
  FOOTER: 2,
};

export const DOCUMENT_TAB_LIST = (t) => [
  { INDEX: DOCUMENT_TABS.BASIC, TEXT: t('flows.document_generation_strings.document_tab_strings.basic') },
  { INDEX: DOCUMENT_TABS.HEADER, TEXT: t('flows.document_generation_strings.document_tab_strings.header') },
  { INDEX: DOCUMENT_TABS.FOOTER, TEXT: t('flows.document_generation_strings.document_tab_strings.footer') },
];

export const SEND_DATALIST_DROPDOWN_TYPES = {
  INITIAL: 'initial',
  DATA_FIELDS: 'data-fields',
  SYSTEM_FIELDS: 'system-fields',
  TABLE_FIELDS: 'table-fields',
  OPTION_LIST_TITLE: 'Title',
};

export const getFlowFieldTypeOptions = ({ fieldsCount }, t = () => { }) => [
  {
    label: t('flows.send_data_to_datalist_all_labels.data_fields'),
    value: 'data-fields',
    is_expand: true,
    expand_count: fieldsCount,
    current_level: SEND_DATALIST_DROPDOWN_TYPES.DATA_FIELDS,
  },
  {
    label: t('flows.send_data_to_datalist_all_labels.system_fields'),
    value: 'system-fields',
    is_expand: true,
    expand_count: 7,
    current_level: SEND_DATALIST_DROPDOWN_TYPES.SYSTEM_FIELDS,
  },
];

export const NO_DATA_FOUND_LIST = (t = () => { }) => [
  {
    label: t('flows.send_data_to_datalist_all_labels.no_data_found'),
    value: 'No Fields Found',
    optionType: SEND_DATALIST_DROPDOWN_TYPES.OPTION_LIST_TITLE,
    disabled: true,
  },
];

export const SELECT_COLUMN = {
  label: 'Select Column',
  value: 'Select Column',
  optionType: SEND_DATALIST_DROPDOWN_TYPES.OPTION_LIST_TITLE,
  disabled: true,
};

export const SYSTEM_FIELD_OPTIONS_LIST = (t = () => { }) => [
  { label: t('flows.send_data_to_datalist_all_labels.field_groups.text_fields'), value: 'Text Fields', optionType: SEND_DATALIST_DROPDOWN_TYPES.OPTION_LIST_TITLE, disabled: true },
  { id: 'identifier', label: t('flows.send_data_to_datalist_all_labels.system_field_groups.flow_id'), value: 'flow_id', field_type: 'system_field', system_field_type: FIELD_TYPE.SINGLE_LINE },
  { id: 'flow_link', label: t('flows.send_data_to_datalist_all_labels.system_field_groups.flow_link'), value: 'flow_link', field_type: 'system_field', system_field_type: FIELD_TYPE.LINK },
  { id: 'comments', label: t('flows.send_data_to_datalist_all_labels.system_field_groups.task_comments'), value: 'task_comments', field_type: 'system_field', system_field_type: FIELD_TYPE.PARAGRAPH },
  { label: t('flows.send_data_to_datalist_all_labels.system_field_groups.Date/Time_Fields'), value: 'Date/Time Fields', optionType: SEND_DATALIST_DROPDOWN_TYPES.OPTION_LIST_TITLE, disabled: true },
  { id: 'initiated_on', label: t('flows.send_data_to_datalist_all_labels.system_field_groups.created_on'), value: 'created_on', field_type: 'system_field', system_field_type: FIELD_TYPE.DATETIME },
  { id: 'last_updated_on', label: t('flows.system_field_options_list.updated_on'), value: 'last_updated_on', field_type: 'system_field', system_field_type: FIELD_TYPE.DATETIME },
  { label: t('flows.send_data_to_datalist_all_labels.system_field_groups.Data_Reference_Fields'), value: 'Data Reference Fields', optionType: SEND_DATALIST_DROPDOWN_TYPES.OPTION_LIST_TITLE, disabled: true },
  { id: 'completed_by', label: t('flows.send_data_to_datalist_all_labels.system_field_groups.completed_by'), value: 'completed_by', field_type: 'system_field', system_field_type: FIELD_TYPE.USER_TEAM_PICKER },
  { id: 'initiated_by', label: t('flows.send_data_to_datalist_all_labels.system_field_groups.created_by'), value: 'created_by', field_type: 'system_field', system_field_type: FIELD_TYPE.USER_TEAM_PICKER },
];
