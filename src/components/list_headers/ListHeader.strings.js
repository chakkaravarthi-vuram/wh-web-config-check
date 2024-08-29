import { translate } from 'language/config';

const LIST_HEADER = {
  TASK: {
    TASK_NAME: 'list_header.task.task_name',
    TASK_DESCRIPTION: translate('list_header.task.task_description'),
    TASK_NAME_DESCRIPTION: translate('list_header.task.task_name_description'),
    CREATED_BY: 'list_header.task.created_by',
    CREATED_ON: 'list_header.task.created_on',
    ASSIGNED_ON: 'list_header.task.assigned_on',
    COMPLETED_ON: 'list_header.task.completed_on',
    LAST_EDITED_ON: 'list_header.task.last_edited_on',
    DUE_DATE: 'list_header.task.due_date',
    ASSIGNED_TO: 'list_header.task.assigned_to',
    SNOOZED_UNTIL: 'list_header.task.snoozed_until',
  },
  FLOW: {
    FLOW_NAME: 'list_header.flow.flow_name',
    PUBLISHED_BY: 'PUBLISHED BY',
    PUBLISHED_ON: 'list_header.flow.published_on',
    SAVED_BY: 'SAVED BY',
    SAVED_ON: 'list_header.flow.saved_on',
    ACTION: 'Action',
    ACTIONS: 'Actions',
    ADMINS: 'list_header.flow.admins',
  },
  DATA_LIST: {
    DATALIST_NAME: 'list_header.datalist.datalist_name',
    DATALIST_DESC: 'list_header.datalist.datalist_description',
    PUBLISHED_BY: 'PUBLISHED BY',
    PUBLISHED_ON: 'VERSION & PUBLISHED ON',
    SAVED_BY: 'SAVED BY',
    SAVED_ON: 'list_header.datalist.saved_on',
    ACTION: 'Action',
    ACTIONS: 'ACTIONS',
    ADMINS: 'list_header.datalist.admins',
  },
};
export default LIST_HEADER;
