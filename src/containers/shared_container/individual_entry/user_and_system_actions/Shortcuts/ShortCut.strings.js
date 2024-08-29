import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { translateFunction } from 'utils/jsUtility';
import { TableSortOrder } from '@workhall-pvt-lmt/wh-ui-library';
import { SORT_BY } from '../../../../../utils/Constants';

export const headers = [
  {
    label: 'individual_entry.user_and_system_action.shortcuts_headers.request_id',
    value: 'system_identifier',
  },
  {
    label: 'individual_entry.user_and_system_action.shortcuts_headers.shortcut_name',
    value: 'flow_name',
  },
  {
    label: 'individual_entry.user_and_system_action.shortcuts_headers.type',
    value: 'trigger_action',
  },
  {
    label: 'individual_entry.user_and_system_action.shortcuts_headers.created_by',
     value: 'initiated_by',
  },
  {
    label: 'individual_entry.user_and_system_action.shortcuts_headers.created_on',
     value: 'initiated_on',
  },
  {
    label: 'individual_entry.user_and_system_action.shortcuts_headers.status',
    value: 'status',
  },
];

export const TRIGGER_TYPES_LABELS = {
  1: translateFunction('individual_entry.user_and_system_action.shortcut_types.user_action'),
  5: translateFunction('individual_entry.user_and_system_action.shortcut_types.system_value_change'),
  6: translateFunction('individual_entry.user_and_system_action.shortcut_types.system_scheduler'),
};

export const SHORTCUT_FILTER_KEYS = {
  SHORTCUT_NAME: 'shortcut_name',
  CREATED_BY: 'user',
  CREATED_ON: 'date',
};

export const BETWEEN_DATE_TYPE = 'BETWEEN_DATES';

export const SHORTCUT_STRINGS = (t = translateFunction) => {
 return {
  TITLE: t('individual_entry.user_and_system_action.title'),
  SEARCH_PLACEHOLDER: t('individual_entry.user_and_system_action.search_placeholder'),
  FILTER_STRINGS: {
    FILTER: t('individual_entry.user_and_system_action.filter_strings.filter'),
    SHORTCUT_NAME: t('individual_entry.user_and_system_action.shortcuts_headers.shortcut_name'),
    CREATED_BY: t('individual_entry.user_and_system_action.shortcuts_headers.created_by'),
    CREATED_ON: t('individual_entry.user_and_system_action.shortcuts_headers.created_on'),
  },
  BUTTONS: {
    CLEAR: t('individual_entry.user_and_system_action.button_strings.clear'),
    APPLY: t('individual_entry.user_and_system_action.button_strings.apply'),
  },
  DATE: {
    BETWEEN: {
      LABEL: t(
        'flow_dashboard.filter_strings.fields.date.between',
      ),
      TYPE: 'BETWEEN_DATES',
      OPERATOR: 'inDateRange',
    },
    FROM_DATE_TO_TODAY: {
      LABEL: t(
        'flow_dashboard.filter_strings.fields.date.from_date_to_today',
      ),
      TYPE: 'FROM_DATE_TO_TODAY',
      OPERATOR: 'inDateRange',
    },
    BEFORE: {
      LABEL: t(
        'flow_dashboard.filter_strings.fields.date.before',
      ),
      TYPE: 'BEFORE_DATE',
      OPERATOR: 'beforeDate',
    },
    CURRENT_YEAR_TO_DATE: {
      LABEL: t(
        'flow_dashboard.filter_strings.fields.date.current_year_to_date',
      ),
      TYPE: 'CURRENT_YEAR_TO_DATE',
      OPERATOR: 'inDateRange',
    },
  },
 };
};

const DASHBOARD_INSTANCE_STRINGS = {
  COMPLETED: 'integration.dashboard_instance_strings.completed',
  IN_PROGRESS: 'integration.dashboard_instance_strings.in_progress',
  STARTED: 'integration.dashboard_instance_strings.started',
  CANCELLED: 'integration.dashboard_instance_strings.cancelled',
  SKIPPED: 'integration.dashboard_instance_strings.skipped',
};

export const tableHeader = (
  headers,
  _taskPaginationParams,
  t = translateFunction,
) => {
  const sort_order = (_taskPaginationParams.sort_by === SORT_BY.ASC) ? TableSortOrder.ASC : TableSortOrder.DESC;
  return headers.map((h) => {
    return {
      id: h.value,
      label: t(h.label),
      sortBy: h.value,
      active: _taskPaginationParams.sort_field === h.value,
      sortOrder: sort_order,
      isChangeIconColorOnHover: true,
    };
  });
};

export const getCurrentStatusDisplay = (status, t) => {
  switch (status) {
    case 'completed':
      return t(DASHBOARD_INSTANCE_STRINGS.COMPLETED);
    case 'inprogress':
      return t(DASHBOARD_INSTANCE_STRINGS.IN_PROGRESS);
    case 'cancelled':
      return t(DASHBOARD_INSTANCE_STRINGS.CANCELLED);
    default:
      return EMPTY_STRING;
  }
};

export const DATE_FILTER_STRINGS = (t = translateFunction) => {
  return {
    START_DATE_IS_REQUIRED: t(
      'individual_entry.user_and_system_action.error.start_date_is_required',
    ),
    DATE_REQUIRED: t('individual_entry.user_and_system_action.error.date_required'),
    END_DATE_REQUIRED: t('individual_entry.user_and_system_action.error.end_date_required'),
    DATE_DIFFERENCE_ERROR: t(
      'individual_entry.user_and_system_action.error.date_difference_error',
    ),
    CURRENT_YEAR: t('individual_entry.user_and_system_action.error.current_year'),
    LESS_THAN_ERROR: t('individual_entry.user_and_system_action.error.less_than_error'),
    GREATER_THAN_START_DATE: t(
      'individual_entry.user_and_system_action.error.greater_than_start_date',
    ),
    CREATED_BEFORE: t('individual_entry.user_and_system_action.error.created_before'),
    CREATED_BETWEEN: t('individual_entry.user_and_system_action.error.created_between'),
  };
};

export const ACCESS_DENIED_STRINGS = (t = translateFunction) => {
  return {
    TITLE: t('access_denied_pop_Over_strings.title'),
    SUB_TITLE: t('access_denied_pop_Over_strings.sub_title'),
  };
};

export const TRIGGER_SHORTCUT = (translate = translateFunction) => {
  return {
  TITLE: translate('flow_dashboard.trigger_shortcuts.actions'),
  SHORTCUT_TYPE: 'related_actions',
  SEE_MORE: translate('flow_dashboard.trigger_shortcuts.see_more'),
  IN_PROGRESS: translate('flow_dashboard.trigger_shortcuts.in_progess'),
  COMPLETED: translate('flow_dashboard.trigger_shortcuts.completed'),
  };
};
