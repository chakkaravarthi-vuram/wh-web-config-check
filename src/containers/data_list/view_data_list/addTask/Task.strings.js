import { translate } from 'language/config';
import { ASSIGNEES_TYPE } from '../../../../utils/Constants';

export const ADD_TASK = {
  TITLE: 'Add Task',
  EDIT_TITLE: 'Edit Task',
  SUB_TITLE: 'Add a task to the datalist',
  DATA_LIST_LABEL: 'create_dashboard_strings.datalist',
  DATA_LIST_NAME: translate('datalist.view_datalist.add_task.data_list_name'),
  RECORD: 'Record',
  REFRENCE_ID: 'datalist.view_datalist.add_task.reference_id',
  CREATE_TASK: 'datalist.view_datalist.add_task.create_task',
};

export const BASIC_DETAILS = {
  BASIC_DETAILS: translate('datalist.view_datalist.add_task.basic_details.basic_details'),
  TASK_NAME: {
    LABEL: translate('datalist.view_datalist.add_task.basic_details.task_name.label'),
    ID: 'task_name',
    PLACEHOLDER: translate('datalist.view_datalist.add_task.basic_details.task_name.placeholder'),
  },
  ASSIGNE_TO: {
    LABEL: translate('datalist.view_datalist.add_task.basic_details.assigne_to.label'),
    ID: 'assignees',
    PLACEHOLDER: translate('datalist.view_datalist.add_task.basic_details.assigne_to.placeholder'),
  },
  RECEIVE_TASK: {
    LABEL: translate('datalist.view_datalist.add_task.basic_details.receive_task.label'),
    ID: 'is_assign_to_individual_assignees',
    RADIO_BUTTON_LIST: [
      {
        value: ASSIGNEES_TYPE.ALL,
        label: translate('datalist.view_datalist.add_task.basic_details.receive_task.radio_button_list.all_assignees_label'),
      },
      {
        value: ASSIGNEES_TYPE.ANYONE,
        label: translate('datalist.view_datalist.add_task.basic_details.receive_task.radio_button_list.any_assignees_label'),
      },
    ],
  },
  DUE_DATE: {
    LABEL: translate('datalist.view_datalist.add_task.basic_details.due_date.label'),
    ID: 'due_date',
    PLACEHOLDER: translate('datalist.view_datalist.add_task.basic_details.due_date.placeholder'),
  },
  TASK_DESCRIPTION: {
    LABEL: translate('datalist.view_datalist.add_task.basic_details.task_description.label'),
    ID: 'task_description',
    PLACEHOLDER: translate('datalist.view_datalist.add_task.basic_details.task_description.placeholder'),
  },
};

export const TAB_BUTTONS = {
  PUBLISH: translate('datalist.view_datalist.add_task.tab_buttons.publish'),
  CANCEL: 'datalist.view_datalist.add_task.tab_buttons.cancel',
  SAVE_AS_DRAFT: 'datalist.view_datalist.add_task.tab_buttons.save_as_draft',
  CREATE: 'datalist.view_datalist.add_task.tab_buttons.create',
};

export const TASK_DISCARD_POPOVER = {
  TITLE: 'task_content.discard_task_title',
  SUBTITLE: 'task_content.discard_task_subtitle',
};
