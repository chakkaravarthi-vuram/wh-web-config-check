import { FIELD_TYPE } from './form.constant';

export const DATALIST_SYSTEM_FIELD = {
  ID: {
    id: 'data_list_identifier',
    label: 'ID',
    value: 'data_list_identifier',
    field_type: FIELD_TYPE.SINGLE_LINE,
    field_list_type: 'system_field',
  },
  LAST_UPDATED_BY: {
    id: 'last_updated_by',
    label: 'Updated By',
    value: 'last_updated_by',
    field_type: FIELD_TYPE.USER_TEAM_PICKER,
    field_list_type: 'system_field',
  },
  LAST_UPDATED_ON: {
    id: 'last_updated_on',
    label: 'Updated On',
    value: 'last_updated_on',
    field_type: FIELD_TYPE.DATETIME,
    field_list_type: 'system_field',
  },
  CREATED_BY: {
    id: 'created_by',
    label: 'Created By',
    value: 'created_by',
    field_type: FIELD_TYPE.USER_TEAM_PICKER,
    field_list_type: 'system_field',
  },
  CREATED_ON: {
    id: 'created_on',
    label: 'Created On',
    value: 'created_on',
    field_type: FIELD_TYPE.DATETIME,
    field_list_type: 'system_field',
  },
  LINK: {
    id: 'data_list_link',
    label: 'Link',
    value: 'data_list_link',
    field_type: FIELD_TYPE.LINK,
    field_list_type: 'system_field',
  },
};

export const DATALIST_SYSTEM_FIELD_LIST = [
  DATALIST_SYSTEM_FIELD.ID,
  DATALIST_SYSTEM_FIELD.LAST_UPDATED_BY,
  DATALIST_SYSTEM_FIELD.LAST_UPDATED_ON,
  DATALIST_SYSTEM_FIELD.CREATED_BY,
  DATALIST_SYSTEM_FIELD.CREATED_ON,
];

export const FLOW_SYSTEM_FIELD = {
  ID: {
    id: 'system_identifier',
    label: 'ID',
    value: 'system_identifier',
    field_type: FIELD_TYPE.SINGLE_LINE,
    field_list_type: 'system_field',
  },
  LAST_UPDATED_BY: {
    id: 'last_updated_by',
    label: 'Updated By',
    value: 'last_updated_by',
    field_type: FIELD_TYPE.USER_TEAM_PICKER,
    field_list_type: 'system_field',
  },
  LAST_UPDATED_ON: {
    id: 'last_updated_on',
    label: 'Updated On',
    value: 'last_updated_on',
    field_type: FIELD_TYPE.DATETIME,
    field_list_type: 'system_field',
  },
  CREATED_BY: {
    id: 'created_by',
    label: 'Created By',
    value: 'created_by',
    field_type: FIELD_TYPE.USER_TEAM_PICKER,
    field_list_type: 'system_field',
  },
  CREATED_ON: {
    id: 'created_on',
    label: 'Created On',
    value: 'created_on',
    field_type: FIELD_TYPE.DATETIME,
    field_list_type: 'system_field',
  },
  COMPLETED_BY: {
    id: 'completed_by',
    label: 'Completed By',
    value: 'completed_by',
    field_type: FIELD_TYPE.USER_TEAM_PICKER,
    field_list_type: 'system_field',
  },
  COMPLETED_ON: {
    id: 'completed_on',
    label: 'Completed On',
    value: 'completed_on',
    field_type: FIELD_TYPE.DATETIME,
    field_list_type: 'system_field',
  },
  STATUS: {
    id: 'status',
    label: 'Status',
    value: 'status',
    field_type: FIELD_TYPE.SINGLE_LINE,
    field_list_type: 'system_field',
  },
  STEP_NAME: {
    id: 'step_name',
    label: 'Step Name',
    value: 'step_name',
    field_type: FIELD_TYPE.SINGLE_LINE,
    field_list_type: 'system_field',
  },
  OPEN_WITH: {
    id: 'open_with',
    label: 'Open With',
    value: 'open_with',
    field_type: FIELD_TYPE.USER_TEAM_PICKER,
    field_list_type: 'system_field',
  },
  ACTIVE_TASK: {
    id: 'current_active_task',
    label: 'Current Active Task',
    value: 'current_active_task',
    field_type: FIELD_TYPE.SINGLE_LINE,
    field_list_type: 'system_field',
  },
  ACTIVE_TASK_OWNER: {
    id: 'current_active_task_owners',
    label: 'Current Active Task Owners',
    value: 'current_active_task_owners',
    field_type: FIELD_TYPE.USER_TEAM_PICKER,
    field_list_type: 'system_field',
  },
  LINK: {
    id: 'flow_link',
    label: 'Link',
    value: 'flow_link',
    field_type: FIELD_TYPE.LINK,
    field_list_type: 'system_field',
  },
};

export const FLOW_SYSTEM_FIELD_LIST = [
  FLOW_SYSTEM_FIELD.ID,
  FLOW_SYSTEM_FIELD.LAST_UPDATED_BY,
  FLOW_SYSTEM_FIELD.LAST_UPDATED_ON,
  FLOW_SYSTEM_FIELD.CREATED_BY,
  FLOW_SYSTEM_FIELD.CREATED_ON,
  FLOW_SYSTEM_FIELD.COMPLETED_BY,
  FLOW_SYSTEM_FIELD.COMPLETED_ON,
  FLOW_SYSTEM_FIELD.STATUS,
  FLOW_SYSTEM_FIELD.STEP_NAME,
  FLOW_SYSTEM_FIELD.OPEN_WITH,
  FLOW_SYSTEM_FIELD.ACTIVE_TASK,
  FLOW_SYSTEM_FIELD.ACTIVE_TASK_OWNER,
];

// New List
export const DATA_LIST_SYSTEM_FIELDS_NEW = {
  system_identifier: {
    label: 'Datalist Entry Id',
    value: 'system_identifier',
    field_type: FIELD_TYPE.SINGLE_LINE,
  },
  data_list_entry_id: {
    label: 'Datalist Entry',
    value: 'data_list_entry_id',
    field_type: FIELD_TYPE.DATA_LIST,
  },
  data_list_link: {
    label: 'Datalist Entry Link',
    value: 'data_list_link',
    field_type: FIELD_TYPE.LINK,
  },
  last_updated_by: {
    label: 'Entry Updated By',
    value: 'last_updated_by',
    field_type: FIELD_TYPE.USER_TEAM_PICKER,
  },
  last_updated_on: {
    label: 'Entry Updated On',
    value: 'last_updated_on',
    field_type: FIELD_TYPE.DATETIME,
  },
  created_by: {
    label: 'Entry Created By',
    value: 'created_by',
    field_type: FIELD_TYPE.USER_TEAM_PICKER,
  },
  created_on: {
    label: 'Entry Created On',
    value: 'created_on',
    field_type: FIELD_TYPE.DATETIME,
  },
};

export const FLOW_SYSTEM_FIELDS_NEW = {
  system_identifier: {
    label: 'Flow Entry Id',
    value: 'system_identifier',
    field_type: FIELD_TYPE.SINGLE_LINE,
  },
  flow_link: {
    label: 'Flow Entry Link',
    value: 'flow_link',
    field_type: FIELD_TYPE.LINK,
  },
  status: {
    label: 'Flow Status',
    value: 'status',
    field_type: FIELD_TYPE.SINGLE_LINE,
  },
  created_by: {
    label: 'Flow Started By',
    value: 'created_by',
    field_type: FIELD_TYPE.USER_TEAM_PICKER,
  },
  created_on: {
    label: 'Flow started On',
    value: 'created_on',
    field_type: FIELD_TYPE.DATETIME,
  },
  completed_on: {
    label: 'Flow Completed On',
    value: 'completed_on',
    field_type: FIELD_TYPE.DATETIME,
  },
  completed_by: {
    label: 'Flow Completed By',
    value: 'completed_by',
    field_type: FIELD_TYPE.USER_TEAM_PICKER,
  },
  step_fields: {
    data: {
      accepted_by: {
        label: 'Accepted By',
        value: 'accepted_by',
        field_type: FIELD_TYPE.USER_TEAM_PICKER,
      },
      accepted_on: {
        label: 'Accepted On',
        value: 'accepted_on',
        field_type: FIELD_TYPE.DATETIME,
      },
      assigned_on: {
        label: 'Assigned On',
        value: 'assigned_on',
        field_type: FIELD_TYPE.DATETIME,
      },
      assigned_to: {
        label: 'Assigned To',
        value: 'assigned_to',
        field_type: FIELD_TYPE.USER_PROPERTY_PICKER,
      },
      completed_on: {
        label: 'Completed On',
        value: 'completed_on',
        field_type: FIELD_TYPE.DATETIME,
      },
      completed_by: {
        label: 'Completed By',
        value: 'completed_by',
        field_type: FIELD_TYPE.USER_TEAM_PICKER,
      },
      task_comments: {
        label: 'Comments Provided',
        value: 'task_comments',
        field_type: FIELD_TYPE.PARAGRAPH,
      },
      due_date: {
        label: 'Due Date',
        value: 'due_date',
        field_type: FIELD_TYPE.DATETIME,
      },
      action: {
        label: 'Button Action',
        value: 'action',
        field_type: FIELD_TYPE.SINGLE_LINE,
      },
      actor_reporting_manager: {
        label: 'Actor Reporting Manager',
        value: 'actor_reporting_manager',
        field_type: FIELD_TYPE.USER_TEAM_PICKER,
      },
    },
  },
};
