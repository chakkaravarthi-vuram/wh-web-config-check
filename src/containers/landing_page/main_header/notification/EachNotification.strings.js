export const NOTIFICATION_TYPES = {
    TASK: {
    FLOW_DATALIST_ADHOC_TASK_ASSIGNED: 'flow_data_list_task_assigned',
    NORMAL_TASK_ASSIGNED: 'task_assigned',
    TASK_COMPLETED: 'task_completed',
    CANCEL_TASK: 'cancel_adhoc_task',
    NUDGE_TASK: 'task_reminder',
    PENDING_TASKS: 'pending_tasks',
    SNOOZED_TASK: 'snoozed_task',
    CUSTOM_REMINDER: 'custom_reminder',
    DOCUMENT_UPDATE: 'document_update',
    DOC_DOWNLOAD_COMPLETED: 'doc_download_completed',
    CANCEL_INSTANCE_TASK: 'cancel_instance_task',
    REASSIGNED: 'task_reassigned',
    REMOVE_DATA_LIST_TASK: 'remove_data_list_task',
    },
};

export const NOTIFICATION_TASK_REFRESH_TYPES = [
    NOTIFICATION_TYPES.TASK.FLOW_DATALIST_ADHOC_TASK_ASSIGNED,
    NOTIFICATION_TYPES.TASK.NORMAL_TASK_ASSIGNED,
    NOTIFICATION_TYPES.TASK.TASK_COMPLETED,
    NOTIFICATION_TYPES.TASK.CANCEL_TASK,
    NOTIFICATION_TYPES.TASK.CANCEL_INSTANCE_TASK,
];

export const NOTIFICATION_WITH_USER_IMAGES = [
    NOTIFICATION_TYPES.TASK.NORMAL_TASK_ASSIGNED,
    NOTIFICATION_TYPES.TASK.FLOW_DATALIST_ADHOC_TASK_ASSIGNED,
    NOTIFICATION_TYPES.TASK.CANCEL_TASK,
    NOTIFICATION_TYPES.TASK.NUDGE_TASK,
    NOTIFICATION_TYPES.TASK.TASK_COMPLETED,
    NOTIFICATION_TYPES.TASK.REASSIGNED,
];

export const NOTIFICATION_TASK_DYNAMIC_CONTENT = {
    ASSIGNED: 'notification.notification_task_dynamic_content.assigned',
    ADOHC_TASK_ASSIGNED: 'notification.notification_task_dynamic_content.adohc_task_assigned',
    COMPLETED: 'notification.notification_task_dynamic_content.completed',
    CANCELLED: 'notification.notification_task_dynamic_content.cancelled',
    NUDGED: 'notification.notification_task_dynamic_content.nudged',
    PENDING: 'notification.notification_task_dynamic_content.pending',
    SNOOZED: 'notification.notification_task_dynamic_content.snoozed',
    REMINDER: 'notification.notification_task_dynamic_content.reminder',
    INSTANCE_CANCELLED: 'notification.notification_task_dynamic_content.instance_cancelled',
    CANCEL_INSTANCE_TASK: 'notification.notification_task_dynamic_content.cancel_instance_task',
    TASK_REASSIGNED: 'notification.notification_task_dynamic_content.task_reassigned',
    REMOVE_DATA_LIST_TASK: 'notification.notification_task_dynamic_content.remove_data_list_task',
    DATALIST_DELETE: 'notification.notification_task_dynamic_content.datalist_delete',
    DELETION_OF_THE_DATA: 'notification.notification_task_dynamic_content.deletion_of_the_data',
    FROM: 'notification.notification_task_dynamic_content.from',
};

export const ENTITY = {
    FLOW: 'flow',
    DATALIST: 'datalist',
};
export const ENTITY_CONTENT = {
    FLOW_INSTANCE: 'notification.entity_content.flow_instance',
    DATALIST_INSTANCE: 'notification.entity_content.datalist_instance',
    FLOW_OR_DATALIST: 'notification.entity_content.flow_or_datalist',
    FLOW: 'notification.entity_content.flow',
    DATALIST: 'notification.entity_content.datalist',
};

export const NOTIFICATION_SECTION = {
    TODAY: 'notification.notification_section.today',
    YESTERDAY: 'notification.notification_section.yesterday',
    OLDER: 'notification.notification_section.older',
};

export const NOTIFICATION_CONTENT_STRINGS = {
    TITLE: 'notification.notification_content_strings.title',
    NO_NOTIFICATIONS: 'notification.notification_content_strings.no_notifications',
    NO_NOTIFICATIONS_MESSAGE: 'notification.notification_content_strings.no_notifications_message',
    MARK_ALL_AS_READ: 'notification.notification_content_strings.mark_all_as_read',
};

export default NOTIFICATION_TYPES;
