const ENTRY_TASK_STRINGS = (t = () => {}) => {
  return {
    TITLE: t('individual_entry.entry_tasks.title'),
    BUTTON: {
      CREATE_TASK: t('individual_entry.entry_tasks.button.create_task'),
      REASSIGN_TASK: t('individual_entry.entry_tasks.button.reassign_task'),
    },
    TASK_TYPE: {
      OPEN: t('individual_entry.entry_tasks.task_type.open'),
      CLOSED: t('individual_entry.entry_tasks.task_type.closed'),
    },
    TABLE_HEADER: {
      TASK_NAME: t('individual_entry.entry_tasks.table_header.task_name'),
      OPEN_WITH: t('individual_entry.entry_tasks.table_header.open_with'),
      CLOSED_BY: t('flow_dashboard.tasks_strings.closed_by'),
      COMPLETED_ON: t('flow_dashboard.tasks_strings.completed_on'),
      PENDING_SINCE: t('individual_entry.entry_tasks.table_header.pending_since'),
    },
    REASSIGN_TASK: {
      TITLE: t('individual_entry.entry_tasks.reassign_task.title'),
      TABLE_LABEL: t('individual_entry.entry_tasks.reassign_task.table_label'),
      DETAILS: t('individual_entry.entry_tasks.reassign_task.details'),
      REASSIGN_TO: {
        LABEL: t('individual_entry.entry_tasks.reassign_task.reassign_to.label'),
        PLACEHOLDER: t('individual_entry.entry_tasks.reassign_task.reassign_to.placeholder'),
        ERROR: t('individual_entry.entry_tasks.reassign_task.reassign_to.error'),
      },
      REASON: {
        LABEL: t('individual_entry.entry_tasks.reassign_task.reason.label'),
        PLACEHOLDER: t('individual_entry.entry_tasks.reassign_task.reason.placeholder'),
      },
      WARNING: {
        TITLE: t('individual_entry.entry_tasks.reassign_task.warning.title'),
        LABEL: t('individual_entry.entry_tasks.reassign_task.warning.label'),
      },
      SEND_EMAIL: t('individual_entry.entry_tasks.reassign_task.send_email'),
      BUTTON: {
        CANCEL: t('individual_entry.entry_tasks.reassign_task.button.cancel'),
        REASSIGN: t('individual_entry.entry_tasks.reassign_task.button.reassign'),
      },
    },
    ERROR: {
      TITLE: t('access_denied_pop_Over_strings.title'),
      SUB_TITLE: t('access_denied_pop_Over_strings.sub_title'),
    },
  };
};

export default ENTRY_TASK_STRINGS;
