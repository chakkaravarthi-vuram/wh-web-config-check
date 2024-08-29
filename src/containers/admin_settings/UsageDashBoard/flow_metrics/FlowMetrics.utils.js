import { translate } from 'language/config';

export const flowHeaders = [
  translate('admin_settings.usage_dashboard.flow_metrics_tab.flow_name'),
  translate('admin_settings.usage_dashboard.flow_metrics_tab.completed'),
  translate('admin_settings.usage_dashboard.flow_metrics_tab.open'),
];
export const taskFlowHeaders = [
  translate('admin_settings.usage_dashboard.flow_metrics_tab.task_name'),
  translate('admin_settings.usage_dashboard.flow_metrics_tab.flow_name'),
  translate('admin_settings.usage_dashboard.flow_metrics_tab.open_count'),
];
export const userTaskHeaders = [
  translate('admin_settings.usage_dashboard.flow_metrics_tab.user_name'),
  translate('admin_settings.usage_dashboard.flow_metrics_tab.task_name'),
  translate('admin_settings.usage_dashboard.flow_metrics_tab.flow_name'),
  translate('admin_settings.usage_dashboard.flow_metrics_tab.open_count'),
];

export const DROPDOWN_ID = {
  MOST_FLOW: 'most_flow',
  TASK_FLOW: 'task_flow',
  USER_TASK: 'user_task',
};

export const INITIAL_STATE = {
  [DROPDOWN_ID.MOST_FLOW]: 1,
  [DROPDOWN_ID.TASK_FLOW]: 1,
  [DROPDOWN_ID.USER_TASK]: 1,
};

export const DROPDOWN_OPTIONS = [
  {
    label: translate('admin_settings.usage_dashboard.flow_metrics_tab.all'),
    value: 0,
  },
  {
    label: translate('admin_settings.usage_dashboard.flow_metrics_tab.current_billing_cycle'),
    value: 1,
  },
];
export const FLOW_METRICS = {
MOST_USED_FLOW: translate('admin_settings.usage_dashboard.flow_metrics_tab.most_used_flow'),
OPEN_TASK_FLOW: translate('admin_settings.usage_dashboard.flow_metrics_tab.open_task_flow'),
OPEN_TASK_USER: translate('admin_settings.usage_dashboard.flow_metrics_tab.open_task_user'),
};
