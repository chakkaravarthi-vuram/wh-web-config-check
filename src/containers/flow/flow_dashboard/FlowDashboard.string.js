import { translateFunction } from 'utils/jsUtility';
import { DROPDOWN_CONSTANTS } from '../../../utils/strings/CommonStrings';

export const STATUS_CONSTANTS = (translate = translateFunction) => {
  return {
  IN_PROGRESS: {
    KEY: 'In Progress',
    NAME: translate('flow_dashboard.status_constants.in_progress'),
  },
  COMPLETED: {
    KEY: 'completed',
    NAME: translate('flow_dashboard.status_constants.completed'),
  },
  CANCELLED: {
    KEY: 'cancelled',
    NAME: translate('flow_dashboard.status_constants.cancelled'),
  },
  };
};

export const FLOW_NOT_EXIST = (translate) => {
  return {
    title: translate('flow_dashboard.flow_not_exist.title'),
    type: 'flowNotExist',
  };
};

export const FLOW_NO_DATA = (translate) => {
  return {
  title: translate('flow_dashboard.flow_no_data.title'),
  subTitle: translate('flow_dashboard.flow_no_data.sub_title'),
  };
};

export const STATUS_MULTI_CHECK_DATA = (t = translateFunction) => [
  {
    label: STATUS_CONSTANTS(t).IN_PROGRESS.NAME,
    value: 'inprogress',
    isCheck: false,
  },
  {
    label: STATUS_CONSTANTS(t).COMPLETED.NAME,
    value: 'completed',
    isCheck: false,
  },
  {
    label: STATUS_CONSTANTS(t).CANCELLED.NAME,
    value: 'cancelled',
    isCheck: false,
  },
];

export const FILTER = (translate = translateFunction) => {
  return {
  SYSTEM_DATA: {
    TITLE: translate('flow_dashboard.filter.system_data'),
    TAB_INDEX: 1,
  },
  FLOW_DATA: {
    TITLE: translate('flow_dashboard.filter.flow_data'),
    TAB_INDEX: 2,
  },
  };
};

export const PD_TAB = (translate = translateFunction) => {
  return {
  ALL: {
    TITLE: translate('flow_dashboard.pd_tabs.all_requests'),
    TAB_INDEX: 1,
  },
  SAVED_SEARCHES: {
    TITLE: translate('flow_dashboard.pd_tabs.reports'),
    TAB_INDEX: 2,
  },
  TASKS: {
    TITLE: translate('flow_dashboard.pd_tabs.task'),
    TAB_INDEX: 3,
  },
  NOTES: {
    TITLE: translate('flow_dashboard.pd_tabs.notes'),
    TAB_INDEX: 4,
  },
  };
};

export const PD_VIEW = (translate = translateFunction) => {
  return {
  TABLES: {
    TITLE: translate('flow_dashboard.pd_view.table_title'),
    TAB_INDEX: 1,
  },
  CHARTS: {
    TITLE: translate('flow_dashboard.pd_view.chart_title'),
    TAB_INDEX: 2,
  },
  };
};

export const DDL_MONTH_YEAR = (translate = translateFunction) => [
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: translate('flow_dashboard.report_ddl_month_year.none'),
    [DROPDOWN_CONSTANTS.VALUE]: 'none',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: translate('flow_dashboard.report_ddl_month_year.day'),
    [DROPDOWN_CONSTANTS.VALUE]: 'day',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: translate('flow_dashboard.report_ddl_month_year.month'),
    [DROPDOWN_CONSTANTS.VALUE]: 'month',
  },
  {
    [DROPDOWN_CONSTANTS.OPTION_TEXT]: translate('flow_dashboard.report_ddl_month_year.year'),
    [DROPDOWN_CONSTANTS.VALUE]: 'year',
  },
];

export const FILE_TYPE = {
  IMAGE: 2,
  VIDEO: 3,
};
export const ARIA_LABEL = {
  EDIT: 'app_strings.flow_dashboard.aria_label.edit',
  DOWNLOAD: 'app_strings.flow_dashboard.aria_label.download',
  BACK: 'app_strings.flow_dashboard.aria_label.back',
  REFRESH: 'app_strings.flow_dashboard.aria_label.refresh',
  REASSIGN: 'app_strings.flow_dashboard.aria_label.reassign_task',
  DATALIST: 'app_strings.flow_dashboard.aria_label.datalist',
};

export const SUMMARY_STATUS = (translate = translateFunction) => {
  return {
  ACCEPTED_BY: translate('flow_dashboard.status_summary.accepted_by'),
  REASSIGN_TO: translate('flow_dashboard.status_summary.reassign_to'),
  };
};

export const HEADER_TAB = (translate = translateFunction) => [
  {
    TEXT: translate('task_content.landing_page_translation.task_details'),
    INDEX: 0,
  },
  {
    TEXT: translate('task_content.landing_page_translation.action_history'),
    INDEX: 1,
  },
];

export const TRIGGER_SHORTCUT = (translate = translateFunction) => {
  return {
  TITLE: translate('flow_dashboard.trigger_shortcuts.actions'),
  SHORTCUT_TYPE: 'related_actions',
  SEE_MORE: translate('flow_dashboard.trigger_shortcuts.see_more'),
  IN_PROGRESS: translate('flow_dashboard.trigger_shortcuts.in_progess'),
  COMPLETED: translate('flow_dashboard.trigger_shortcuts.completed'),
  };
};

export const PD_MODAL_STRINGS = (translate = translateFunction) => {
  return {
  ADD_TASK: translate('flow_dashboard.pd_tabs.pd_modal_strings.add_task'),
  ADD_NOTES: translate(
    'flow_dashboard.pd_tabs.pd_modal_strings.add_notes',
  ),
  SEARCH: translate('flow_dashboard.add_notes_strings.search'),
  DOWNLOAD: translate('flow_dashboard.add_notes_strings.download'),
  REASSIGN_THE_TASK: translate('flow_dashboard.tasks_strings.reassign_the_task'),
  };
};
export const FILTER_FIELD_STRINGS = (translate = translateFunction) => {
  return {
    SYSTEM_FIELD: translate('filter_strings.system_field'),
    FLOW_FIELD: translate('filter_strings.flow_field'),
    DATA_LIST_FIELD: translate(
      'filter_strings.data_list_field',
    ),
  };
};

export const PD_SUMMARY_STRINGS = (translate = translateFunction) => {
  return {
  CANCELLED_BY: translate(
    'flow_dashboard.pd_summary_strings.cancelled_by',
  ),
  ON: translate('flow_dashboard.pd_summary_strings.on'),
  ON_WITHOUT_COLON: translate('task_content.on'),
  CANCEL_INSTANCE: translate(
    'flow_dashboard.pd_summary_strings.cancel_instance',
  ),
  CANCEL_INSTANCE_BY_SEND_BACK: translate(
    'flow_dashboard.pd_summary_strings.cancelled_due_to_send_back',
  ),
  STARTED_BY: translate('flow_dashboard.pd_summary_strings.started_by'),
  STARTED: translate('flow_dashboard.pd_summary_strings.started'),
  OPEN_WITH: translate('flow_dashboard.pd_summary_strings.open_with'),
  FLOW_NAME: translate(
    'flow_dashboard.pd_summary_strings.flow_name',
  ),
  FLOW_ID: translate(
    'flow_dashboard.pd_summary_strings.flow_id',
  ),
  ACCEPTED_BY: translate('flow_dashboard.pd_summary_strings.accepted_by'),
  SENT_BACK: translate('flow_dashboard.pd_summary_strings.sent_back'),
  CANCELLED_REASON: translate('flow_dashboard.pd_summary_strings.cancelled_reason'),
  SENT_BACK_BY: translate('flow_dashboard.pd_summary_strings.sent_back_by'),
  ASSIGNED_FOR_REVIEW: translate('flow_dashboard.pd_summary_strings.assigned_for_review'),
  REASSIGN: translate('flow_dashboard.pd_summary_strings.reassign'),
  SENT: translate('flow_dashboard.pd_summary_strings.sent'),
  RESENT: translate('flow_dashboard.pd_summary_strings.resent'),
  REVIEWED: translate('flow_dashboard.pd_summary_strings.reviewed'),
  COMPLETED_THE_INSTANCE: translate('flow_dashboard.pd_summary_strings.completed_the_instance'),
  RESEND: translate('flow_dashboard.pd_summary_strings.resend'),
  REASSIGNED_LABEL: translate('flow_dashboard.pd_summary_strings.reassigned_label'),
  DOWNLOAD: translate('flow_dashboard.pd_summary_strings.download'),
  TASK_ACTION_AND_COMMENTS: translate('flow_dashboard.pd_summary_strings.task_action_and_comments'),
  ACTION: translate('flow_dashboard.pd_summary_strings.action'),
  COMMENTS: translate('flow_dashboard.pd_summary_strings.comments'),
  };
};
export const DASHBOARD_INSTANCE_STRINGS = {
  COMPLETED: 'integration.dashboard_instance_strings.completed',
  IN_PROGRESS: 'integration.dashboard_instance_strings.in_progress',
  STARTED: 'integration.dashboard_instance_strings.started',
  CANCELLED: 'integration.dashboard_instance_strings.cancelled',
  SKIPPED: 'integration.dashboard_instance_strings.skipped',
};

export const FLOW_DASHBOARD_SYSTEM_DIMENSION = (pId) => {
  return {
    ID: 'Instances.system_identifier',
    STEP_NAME: 'InstanceCurrentActivity.CurrentActivityStepName',
    STATUS: 'Instances.status',
    FIRST_STEP_STARTED_ON: 'Instances.initiatedOn',
    CREATED_BY: 'Instances.initiatedBy',
    CREATED_ON: `Flow_${pId}.created_on`,
    UPDATED_ON: `Flow_${pId}.last_updated_on`,
    UPDATED_BY_0: `Flow_${pId}.last_updated_by`,
    UPDATED_BY_1: 'Updatedbyusers.fullName',
    OPEN_WITH_0: 'CurrentActivityUsersTeams.CurrentActivityUserTeamsValue',
    OPEN_WITH_1: 'CurrentActivityUsersTeams.openWithUserTeams',
  };
};

export const DATALIST_DASHBOARD_SYSTEM_DIMENSION = (dId) => {
  return {
    ID: `Datalist_${dId}.data_list_identifier`,
    ADDED_BY_0: 'Createdbyusers.fullName',
    ADDED_BY_1: `Datalist_${dId}.created_by`,
    CREATED_ON: `Datalist_${dId}.created_on`,
    UPDATED_ON: `Datalist_${dId}.last_updated_on`,
    UPDATED_BY_0: `Datalist_${dId}.last_updated_by`,
    UPDATED_BY_1: 'Users.userName',
    UPDATED_BY_2: 'Users.fullName',
  };
};
