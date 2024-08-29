import { translate } from 'language/config';
import { FORM_POPOVER_STATUS, ASSIGNEES_TYPE } from '../../../../utils/Constants';

export const ADD_TASK = {
  TITLE: translate('flow_dashboard.add_task.title'),
  EDIT_TITLE: translate('flow_dashboard.add_task.edit_title'),
  SUB_TITLE: translate('flow_dashboard.add_task.sub_title'),
  FLOW_NAME: 'flow_dashboard.add_task.flow_name',
  RECORD: translate('flow_dashboard.add_task.record'),
  REFERENCE_ID: 'flow_dashboard.add_task.reference_id',
  CREATE_TASK: 'flow_dashboard.add_task.create_task',
};

export const BASIC_DETAILS = {
  TITLE: translate('flow_dashboard.add_task.basic_details.title'),
  TASK_NAME: {
    LABEL: translate('flow_dashboard.add_task.basic_details.task_name.label'),
    ID: 'task_name',
    PLACEHOLDER: translate('flow_dashboard.add_task.basic_details.task_name.placeholder'),
  },
  ASSIGNE_TO: {
    LABEL: translate('flow_dashboard.add_task.basic_details.assigne_to.label'),
    ID: 'assignees',
    PLACEHOLDER: translate('flow_dashboard.add_task.basic_details.assigne_to.placeholder'),
  },
  RECEIVE_TASK: {
    LABEL:
    translate('flow_dashboard.add_task.basic_details.receive_task.label'),
    ID: 'is_assign_to_individual_assignees',
    RADIO_BUTTON_LIST: [
      {
        value: ASSIGNEES_TYPE.ALL,
        label: translate('flow_dashboard.add_task.basic_details.receive_task.radio_button_list.all_assignees_label'),
      },
      {
        value: ASSIGNEES_TYPE.ANYONE,
        label: translate('flow_dashboard.add_task.basic_details.receive_task.radio_button_list.any_assignees_label'),
      },
    ],
  },
  DUE_DATE: {
    LABEL: translate('flow_dashboard.add_task.basic_details.due_date.label'),
    ID: 'due_date',
    PLACEHOLDER: translate('flow_dashboard.add_task.basic_details.due_date.placeholder'),
  },
  TASK_DESCRIPTION: {
    LABEL: translate('flow_dashboard.add_task.basic_details.task_description.label'),
    ID: 'task_description',
    PLACEHOLDER: translate('flow_dashboard.add_task.basic_details.task_description.placeholder'),
  },
};

export const ADD_TASK_FORM = {
  ADD_FORM_BUTTON: 'flow_dashboard.add_task.basic_details.add_form_button',
  FORM_TITLE: {
    LABEL: 'Form Name',
    ID: 'form_title',
    PLACEHOLDER: 'Form Name',
  },
  FORM_DESCRIPTION: {
    LABEL: 'Form Description',
    ID: 'form_description',
    PLACEHOLDER: 'Form Description',
  },
  FORM_BUILDER: { LABEL: 'Form Builder' },
  DEFAULT_RULE_SAVE: {
    TITLE: 'Required fields are missing',
  },
  PUBLISH_TASK_ERROR_UPDATE_SUBTITLE: 'Create and save form to publish task',
  PUBLISH_TASK_ERROR_UPDATE: {
    title: 'Error',
    status: FORM_POPOVER_STATUS.SERVER_ERROR,
    isVisible: true,
  },
  SECTIONS: 'sections',
};

export const TAB_BUTTONS = {
  PUBLISH: translate('flow_dashboard.add_task.basic_details.tab_buttons.publish'),
  CANCEL: 'flow_dashboard.add_task.basic_details.tab_buttons.cancel',
  SAVE_AS_DRAFT: 'flow_dashboard.add_task.basic_details.tab_buttons.save_as_drafts',
  CREATE: 'flow_dashboard.add_task.basic_details.tab_buttons.create',
};

export const TASK_DISCARD_POPOVER = {
  TITLE: 'task_content.discard_task_title',
  SUBTITLE: 'task_content.discard_task_subtitle',
};
