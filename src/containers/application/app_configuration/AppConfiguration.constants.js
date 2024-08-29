// import { BE_TASK_LIST_TYPE, TYPE_OF_TASK_KEY } from './task_configuration/TaskConfiguration';

import { BE_TASK_LIST_TYPE, TYPE_OF_TASK_KEY } from './task_configuration/TaskConfiguration.constants';

export const APP_ARIA_LABELS = {
    CLOSE_APP_MODAL: 'app_strings.aria_labels.close_app_modal',
};

export const APP_CONFIGURATION_TYPE = {
    LINK: 'link',
    IMAGE: 'image',
    DASHBOARDS: 'dashboards',
    TEXT_STYLE: 'textstyle',
    TASK: 'task',
    REPORTS: 'reports',
    WEBPAGE_EMBED: 'embed',
};

export const INITIAL_STATE = {
    TASK: {
       type: BE_TASK_LIST_TYPE.OPEN,
       type_of_task: TYPE_OF_TASK_KEY.ALL,
       flow_uuids: [],
       data_list_uuids: [],
    },
};

export const APP_CONFIGURATION_DASHBOARD_TYPE = {
    FLOW: 'flow_dashboard',
    DATA_LIST: 'data_list_dashboard',
};
