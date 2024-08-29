export const INDIVIDUAL_ENTRY_TAB_TYPES = {
  PAGE_BUILDER: 'custom',
  TASKS: 'task',
  NOTES_REMAINDERS: 'notes_and_reminders',
  USER_ACTION: 'user_and_system_action',
  DATA_AUDIT: 'data_audit',
  EXECUTION_SUMMARY: 'execution_summary',
};

export const INDIVIDUAL_ENTRY_MODE = {
  DEVELOP_MODE: 'develop_mode',
  READ_ONLY_MODE: 'read_only_mode',
  INSTANCE_MODE: 'instance_mode',
  REPORT_INSTANCE_MODE: 'report_instance_mode',
};

export const INDIVIDUAL_ENTRY_TYPE = {
  DATA_LIST: 'data list',
  FLOW: 'flow',
};

export const STEP_LIST_DROPDOWN = {
  ID: 'flow_step_id',
  LABEL: 'Select step',
  ALL_STEP_ID: 'all_steps',
  ALL_STEP_LABEL: 'All Steps',
};

export const CANCEL_INSTANCE_STRINGS = (t) => {
  return {
    OPTIONS: {
      label: t('flow_dashboard.tasks_strings.cancel_instance'),
      value: 'cancel_instance',
    },
    TITLE: 'Cancel Flow Instance',
    FLOW_NAME: t('flow_dashboard.pd_summary_strings.flow_name'),
    FLOW_ID: t('flow_dashboard.pd_summary_strings.flow_id'),
    REASON_LABEL: t('flow_dashboard.tasks_strings.cancel_instance_strings.reason_label'),
    REASON: t('flow_dashboard.tasks_strings.reason_label'),
    REASON_PLACEHOLDER: t('flow_dashboard.tasks_strings.cancel_instance_strings.reason_placeholder'),
    DISCARD: t('flow_dashboard.tasks_strings.cancel_instance_strings.discard'),
    CANCEL: t('common_strings.cancel'),
    TOAST: t('error_popover_status.flow_instance_canceled'),
  };
};

export const MAX_CUSTOM_PAGE_LIMIT = 6;
