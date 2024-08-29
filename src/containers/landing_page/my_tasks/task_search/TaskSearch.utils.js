import { TASK_TAB_INDEX } from 'containers/landing_page/LandingPage.strings';
import { NO_DATA_FOUND_STRINGS } from 'containers/landing_page/no_data_found/NoDataFound.strings';
import { translateFunction } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

export const getCurrentTabNoSearchDataText = (t = translateFunction, tabIndex) => {
  switch (tabIndex) {
    case TASK_TAB_INDEX.OPEN:
      return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.MY_TASKS);
    case TASK_TAB_INDEX.ASSIGNED_TO_OTHERS:
      return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.ASSIGNED_TO_OTHERS);
    case TASK_TAB_INDEX.COMPLETED:
      return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.COMPLETED_TASKS);
    case TASK_TAB_INDEX.DRAFT_TASK:
      return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.DRAFT_TASKS);
    default:
      return EMPTY_STRING;
  }
};

export const ASSIGNED_TO_OTHERS_TASK_SEARCH_LABEL = {
  OPEN: 'Open',
  COMPLETED: 'Completed',
};

export const TASK_SEARCH_HEAD = {
  TASKS: 'TASKS',
};
export const TASK_SEARCH_PLACEHOLDER = {
  SEARCH_TASK_NAME: 'task_content.task_search.search_task_name',
  SEARCH_TASK_NAME_WITHOUT_FLOW: 'task_content.task_search.search_task_name_without_flow',
  SEARCH_TASK_NAME_FOR_MOBILE: 'task_content.task_search.search_task_name_for_mobile',
};
