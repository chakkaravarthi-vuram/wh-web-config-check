import { translateFunction } from '../../../../../utils/jsUtility';

export const TAB_ROUTE = {
  ALL_REQUEST: 'allRequests',
  TASKS: 'tasks',
};

export const TAB_OPTIONS = (t = translateFunction, allRequestName = null) => [
  {
    labelText: allRequestName || t('flow_dashboard.pd_tabs.all_requests'),
    value: 1,
    tabIndex: 1,
    isEditable: false,
    route: TAB_ROUTE.ALL_REQUEST,
  },
  {
    labelText: t('flow_dashboard.pd_tabs.task'),
    value: 2,
    tabIndex: 2,
    isEditable: false,
    route: TAB_ROUTE.TASKS,
  },
];

export const TAB_OPTIONS_TESTBED = (t = translateFunction, allRequestName = null) => [
  {
    labelText: allRequestName || t('flow_dashboard.pd_tabs.all_requests'),
    value: 1,
    tabIndex: 1,
    isEditable: false,
    route: TAB_ROUTE.ALL_REQUEST,
  },
];

export const ENTITY_TYPE = {
  FLOW: 1,
  DATALIST: 2,
};

export const EDIT_FLOW_TABS = {
  FORM: 'flow.edit_flow_tabs.form',
  ASSIGNEE: 'flow.edit_flow_tabs.assignee',
  ADD_ON_CONFIG: 'flow.edit_flow_tabs.add_on_config',
};

export const FLOW_STRINGS = {
  AVATAR: {
    ID: 'appPDAvatar',
  },
  FLOW_INFO: 'app_strings.flow_dashboard.flow_info',
  FLOW_NAME: 'app_strings.flow_dashboard.flow_name',
  FLOW_DESCRIPTION: 'app_strings.flow_dashboard.flow_description',
  START_LABEL: 'sign_up.basic_details.start',
  START_TESTBED_LABEL: 'flow_dashboard.action_button.start_test',
  PUBLISH: 'flow_dashboard.action_button.publish_for_live',
  RESULTS: {
    LABEL_1: 'datalist.datalist_strings.dashboard.body.list_view.results.label_1',
    LABEL_2: 'datalist.datalist_strings.dashboard.body.list_view.results.label_2',
  },
  IS_ADMIN_OWNER_VIEWER: 'isAdminOwnerViewer',
};

export const COLOR = {
  GREEN_100: '#027A48',
  GREEN_10: '#ECFDF3',
  BLUE_100: '#175CD3',
  BLUE_10: '#EFF8FF',
  RED_100: '#B42318',
  RED_10: '#FEF3F2',
};

export const ELEMENT_MESSAGE_TYPE = {
  LOADING: 'LOADING',
  NO_DATA_FOUND: 'NO_DATA_FOUND',
  INVALID_ACCESS: 'INVALID_ACCESS',
};

export const FIELDS_QUERY_TO_PASS = {
  SYSTEM_IDENTIFIER: 'system_identifier',
  DATA_LIST_IDENTIFIER: 'data_list_identifier',
};
