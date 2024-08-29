import {
  CREATE_APP,
  EDIT_APP,
  EDIT_REPORT,
  REPORT_INSTANCE_VIEWER,
  VIEW_REPORT,
} from '../../../urls/RouteConstants';
import jsUtility, { cloneDeep, isEmpty } from '../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { TASK_COMPONENT_CONFIG_KEYS } from '../app_configuration/task_configuration/TaskConfiguration.constants';
import { BE_TO_FE_TASK_LIST_TYPE_MAPPING } from './task_listing/TaskList.constants';
import { isBasicUserMode } from '../../../utils/UtilityFunctions';

export const getTaskParam = (componentDetail = {}) => {
  const FILTER_KEYS = [
    TASK_COMPONENT_CONFIG_KEYS.ASSIGNED_ON,
    TASK_COMPONENT_CONFIG_KEYS.ASSIGNED_TO,
    TASK_COMPONENT_CONFIG_KEYS.DUE_ON,
    TASK_COMPONENT_CONFIG_KEYS.DUE_DATE,
    TASK_COMPONENT_CONFIG_KEYS.DUE_DATE_END,
    TASK_COMPONENT_CONFIG_KEYS.SORT_BY,
    TASK_COMPONENT_CONFIG_KEYS.SORT_FIELD,
  ];

  const { component_info = {} } = componentDetail;
  const all_keys = Object.keys(component_info);

  const params = {
    filter: {},
    selectColumns: component_info?.select_columns || [],
    taskListType: BE_TO_FE_TASK_LIST_TYPE_MAPPING[component_info?.type],
  };
  all_keys.forEach((eachKey) => {
    if (FILTER_KEYS.includes(eachKey)) {
      if (eachKey === TASK_COMPONENT_CONFIG_KEYS.ASSIGNED_TO) {
        params.filter.task_type = component_info[eachKey];
      } else if (eachKey === TASK_COMPONENT_CONFIG_KEYS.DUE_ON) {
        params.filter.due_type = component_info[eachKey];
      } else {
        params.filter[eachKey] = component_info[eachKey];
      }
    }
  });

  return params;
};

export const getConsolidatedFiltersForTask = (defaultFilter = {}, recoveredFilters) => {
  if (isEmpty(recoveredFilters)) return defaultFilter;

  const clonedRecoveredFilters = cloneDeep(recoveredFilters);

  delete clonedRecoveredFilters?.componentId;

  return { ...(defaultFilter || {}), ...(clonedRecoveredFilters || {}) };
};

export const getIsReportInstanceViewer = (history) => {
  const pathname = jsUtility.get(
    history,
    ['location', 'pathname'],
    EMPTY_STRING,
  );
  if (!pathname) return false;
  const arrPathName = (pathname || EMPTY_STRING).split('/');
  if (
    arrPathName.includes(VIEW_REPORT) ||
    arrPathName.includes(EDIT_REPORT) ||
    arrPathName.includes(REPORT_INSTANCE_VIEWER)
  ) {
    return true;
  }
  return false;
};

export const getIsAppCreateOrEditMode = (history) => {
  const pathname = jsUtility.get(
    history,
    ['location', 'pathname'],
    EMPTY_STRING,
  );
  if (!pathname) return false;
  const arrPathName = (pathname || EMPTY_STRING).split('/');
  if (
    arrPathName.includes(CREATE_APP.replaceAll('/', '')) ||
    arrPathName.includes(EDIT_APP.replaceAll('/', ''))
  ) {
    return true;
  }
  return false;
};

export const getColorSchemeByThemeContext = (themeContext, history) => {
  const { colorScheme: appColorScheme, colorSchemeDefault } = themeContext;
  let colorScheme = appColorScheme;
  const isAppMode = isBasicUserMode(history);
  const isAppCreateOrEditMode = getIsAppCreateOrEditMode(history);
  if (isAppCreateOrEditMode) {
    colorScheme = appColorScheme;
  } else if (!isAppMode && !isAppCreateOrEditMode) {
    colorScheme = colorSchemeDefault;
  }
  return colorScheme;
};
