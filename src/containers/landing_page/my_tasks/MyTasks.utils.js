import { isSameDay, parse12HoursTimeFromUTC } from 'utils/dateUtils';
import {
  TASK_CATEGORY_ADHOC_TASK,
  TASK_CATEGORY_DATALIST_ADHOC_TASK,
  TASK_CATEGORY_FLOW_ADHOC_TASK,
} from 'utils/taskContentUtils';
import jsUtils, { isEmpty, translateFunction } from '../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { LANDING_PAGE, TASK_TAB_INDEX, TASK_CONTENT_STRINGS } from '../LandingPage.strings';
import { NO_DATA_FOUND_STRINGS } from '../no_data_found/NoDataFound.strings';
import { store } from '../../../Store';

export const SCROLLABLE_DIV_ID = 'LayoutMainContent';

export const getAssignedOnDetails = (
  assigned_on,
  tab_index,
  hideTiemLabel = false,
) => {
  if (!assigned_on) return null;
  const dateTimeFormat = assigned_on.pref_datetime_display;

  if (dateTimeFormat) {
    const dateYear = dateTimeFormat.split(',')[0];
    const dateYearArray = dateYear.split(' ');
    let timeLabel = '';

    if (!hideTiemLabel) {
      switch (tab_index) {
        case TASK_TAB_INDEX.OPEN:
        case TASK_TAB_INDEX.ASSIGNED_TO_OTHERS:
        case TASK_TAB_INDEX.SELF_TASK:
          timeLabel = 'Assigned on: ';
          break;
        case TASK_TAB_INDEX.COMPLETED:
          timeLabel = 'Completed on: ';
          break;
        case TASK_TAB_INDEX.DRAFT_TASK:
          timeLabel = 'Last Edited on: ';
          break;
        default:
          return null;
      }
    }
    console.log(
      'getAssignedOnDetailsgetAssignedOnDetails',
      parse12HoursTimeFromUTC(dateTimeFormat),
      assigned_on.utc_tz_datetime,
      isSameDay(assigned_on.utc_tz_datetime),
    );
    if (isSameDay(assigned_on.utc_tz_datetime)) {
      return `${timeLabel} ${parse12HoursTimeFromUTC(dateTimeFormat)}`;
    }
    return `${timeLabel} ${dateYearArray[1]} ${dateYearArray[0]}, ${dateYearArray[2]}`;
  }
  return null;
};

export const ASSIGNED_TASK_TYPES = {
  OPEN: 1,
  COMPLETED: 2,
};

export const getCurrentTabTitle = (t = translateFunction, tabIndex, assignedTaskType) => {
  switch (tabIndex) {
    case TASK_TAB_INDEX.OPEN:
      return t(LANDING_PAGE.MY_OPEN_TASKS);
    case TASK_TAB_INDEX.SNOOZED_TASK:
      return t(LANDING_PAGE.SNOOZED_TASKS);
    case TASK_TAB_INDEX.ASSIGNED_TO_OTHERS: {
      if (assignedTaskType === ASSIGNED_TASK_TYPES.OPEN) {
        return jsUtils.concat(
          t(LANDING_PAGE.TASK_I_ASSIGNED_TO_OTHERS),
          `-${t(LANDING_PAGE.OPEN)}`,
        );
      } else {
        return jsUtils.concat(
          t(LANDING_PAGE.TASK_I_ASSIGNED_TO_OTHERS),
          `-${t(LANDING_PAGE.COMPLETED)}`,
        );
      }
    }
    case TASK_TAB_INDEX.SELF_TASK:
      return t(LANDING_PAGE.SELF_TASK);
    case TASK_TAB_INDEX.COMPLETED:
      return t(LANDING_PAGE.MY_COMPLETED_TASKS);
    case TASK_TAB_INDEX.DRAFT_TASK:
      return t(LANDING_PAGE.DRAFT_TASKS);
    default:
      return null;
  }
};

export const getCurrentTabNoDataText = (t = translateFunction, tabIndex, assignedTaskType, searchText) => {
  if (!isEmpty(searchText)) {
    switch (tabIndex) {
      case TASK_TAB_INDEX.OPEN:
        return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.MY_TASKS);
      case TASK_TAB_INDEX.ASSIGNED_TO_OTHERS: {
        if (assignedTaskType === ASSIGNED_TASK_TYPES.OPEN) {
          return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.ASSIGNED_TO_OTHERS_OPEN);
        } else {
          return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.ASSIGNED_TO_OTHERS_COMPLETED);
        }
      }
      case TASK_TAB_INDEX.COMPLETED:
        return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.COMPLETED_TASKS);
      case TASK_TAB_INDEX.DRAFT_TASK:
        return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.DRAFT_TASKS);
      case TASK_TAB_INDEX.SNOOZED_TASK:
      return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.SNOOZED_TASKS);
      default:
        return EMPTY_STRING;
    }
  } else {
    switch (tabIndex) {
      case TASK_TAB_INDEX.OPEN:
        return t(NO_DATA_FOUND_STRINGS.NO_DATA_TEXT.MY_TASKS);
      case TASK_TAB_INDEX.ASSIGNED_TO_OTHERS: {
        if (assignedTaskType === ASSIGNED_TASK_TYPES.OPEN) {
          return t(NO_DATA_FOUND_STRINGS.NO_DATA_TEXT.ASSIGNED_TO_OTHERS_OPEN);
        } else {
          return t(NO_DATA_FOUND_STRINGS.NO_DATA_TEXT.ASSIGNED_TO_OTHERS_COMPLETED);
        }
      }
      case TASK_TAB_INDEX.COMPLETED:
        return t(NO_DATA_FOUND_STRINGS.NO_DATA_TEXT.COMPLETED_TASKS);
      case TASK_TAB_INDEX.DRAFT_TASK:
        return t(NO_DATA_FOUND_STRINGS.NO_DATA_TEXT.DRAFT_TASKS);
      case TASK_TAB_INDEX.SNOOZED_TASK:
      return t(NO_DATA_FOUND_STRINGS.NO_DATA_TEXT.SNOOZED_TASKS);
      default:
        return EMPTY_STRING;
    }
  }
};

export const getCurrentTabNoDataLink = (tabIndex, assignedTaskType) => {
  switch (tabIndex) {
    case TASK_TAB_INDEX.OPEN:
      return NO_DATA_FOUND_STRINGS.NO_DATA_LINK_TEXT.MY_TASKS;
    case TASK_TAB_INDEX.ASSIGNED_TO_OTHERS: {
      if (assignedTaskType === ASSIGNED_TASK_TYPES.OPEN) {
        return NO_DATA_FOUND_STRINGS.NO_DATA_LINK_TEXT.ASSIGNED_TO_OTHERS_OPEN;
      }
      return EMPTY_STRING;
    }
    default:
      return EMPTY_STRING;
  }
};

const isSelfTask = (publishedBy) => {
  const { user_id } = store.getState().RoleReducer;
  return (
    !jsUtils.isEmpty(publishedBy) &&
    (user_id === publishedBy._id)
  );
};

export const getTasksDescription = (
  t,
  taskDescription,
  taskDefinition,
  taskCategory,
  publishedBy = [],
  translation_data = {},
  pref_locale = EMPTY_STRING,
) => {
  const isSelfAssignedTask = isSelfTask(publishedBy);
  if (
    taskCategory === TASK_CATEGORY_FLOW_ADHOC_TASK ||
    taskCategory === TASK_CATEGORY_DATALIST_ADHOC_TASK
  ) {
    return `${
      jsUtils.capitalizeEachFirstLetter(translation_data?.[pref_locale]?.task_description || taskDescription) ||
      jsUtils.capitalizeEachFirstLetter(translation_data?.[pref_locale]?.task_definition || taskDefinition) ||
      EMPTY_STRING
    } (${t(TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.ADHOC)})`;
  } else if (taskCategory === TASK_CATEGORY_ADHOC_TASK) {
    if (isSelfAssignedTask) {
      return `${
        jsUtils.capitalizeEachFirstLetter(translation_data?.[pref_locale]?.task_description || taskDescription) ||
      EMPTY_STRING
      } (${t(TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.SELF_TASK)})`;
    }
    return `${
      jsUtils.capitalizeEachFirstLetter(translation_data?.[pref_locale]?.task_description || taskDescription) ||
      jsUtils.capitalizeEachFirstLetter(translation_data?.[pref_locale]?.task_definition || taskDefinition) ||
      EMPTY_STRING
    } (${t(TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.ADHOC)})`;
  } else {
    console.log('asdlfjkasfjkjlashfasd;lfhjasfjasilf',
    taskDescription,
    translation_data[pref_locale],
    pref_locale,
    taskDefinition,
    taskDefinition,
      EMPTY_STRING);
    return (
      jsUtils.capitalizeEachFirstLetter(translation_data?.[pref_locale]?.task_description || taskDescription) ||
      jsUtils.capitalizeEachFirstLetter(translation_data?.[pref_locale]?.task_definition || taskDefinition) ||
      EMPTY_STRING
    );
  }
};

export const ACTIVE_TASK_SORT_DETAILS = {
  ASSIGNED_ON_SORTING: 'assigned_on',
  NAME_SORTING: 'task_name',
};

export const ASSIGNED_TASK_SORT_DETAILS = {
  PUBLISHED_ON_SORTING: 'published_on',
  NAME_SORTING: 'task_name',
  OPEN_COMPLETED: 'is_completed',
};

export const COMPLETED_TASK_SORT_DETAILS = {
  CLOSED_ON_SORTING: 'closed_on',
  NAME_SORTING: 'task_name',
};

export const DRAFT_TASK_SORT_DETAILS = {
  UPDATED_ON_SORTING: 'last_updated_on',
  NAME_SORTING: 'task_name',
};
export const getSortTypeBySortIndex = (index) => {
  if (index === 1 || index === -1) {
    return 'published_on';
  } else { return 'task_name'; }
};
export const getDueType = (value) => {
  switch (value) {
    case -1:
      return 'overdue';
    case 5:
      return 'due_today';
    case -2:
      return 'no_due';
    case 3:
      return 'due_within';
    case 7:
      return 'due_after';
    case 37:
      return 'due_between';
    default:
      return 0;
  }
};
