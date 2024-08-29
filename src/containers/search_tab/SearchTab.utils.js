import { TASK_TAB_INDEX } from 'containers/landing_page/LandingPage.strings';
import { NO_DATA_FOUND_STRINGS } from 'containers/landing_page/no_data_found/NoDataFound.strings';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { FLOW_DROPDOWN } from 'containers/flow/listFlow/listFlow.strings';
import { DATA_LIST_DROPDOWN } from 'containers/data_list/listDataList/listDataList.strings';

export const getTaskTabNoSearchDataText = (tabIndex) => {
  switch (tabIndex) {
    case TASK_TAB_INDEX.OPEN:
      return NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.MY_TASKS;
    case TASK_TAB_INDEX.ASSIGNED_TO_OTHERS:
      return NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.ASSIGNED_TO_OTHERS;
    case TASK_TAB_INDEX.COMPLETED:
      return NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.COMPLETED_TASKS;
    case TASK_TAB_INDEX.DRAFT_TASK:
      return NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_TEXT.DRAFT_TASKS;
    default:
      return EMPTY_STRING;
  }
};

export const getFlowTabNoSearchDataText = (tabIndex) => {
  switch (tabIndex) {
    case FLOW_DROPDOWN.PUBLISHED_FLOW:
      return NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_FLOW_TEXT.PUBLISHED_FLOW;
    case FLOW_DROPDOWN.UNDER_TESTING:
      return NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_FLOW_TEXT.UNDER_TESTING;
    case FLOW_DROPDOWN.DRAFT_FLOW:
      return NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_FLOW_TEXT.DRAFT_FLOW;
    default:
      return EMPTY_STRING;
  }
};

export const getDataListTabNoSearchDataText = (t, tabIndex) => {
  switch (tabIndex) {
    case DATA_LIST_DROPDOWN.ALL_DATA_LIST:
      return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_LIST_TEXT.ALL_DATA_LIST);
    case DATA_LIST_DROPDOWN.DRAFT_DATA_LIST:
      return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_LIST_TEXT.DRAFT_DATA_LIST);
    case DATA_LIST_DROPDOWN.DATA_LIST_I_OWN:
      return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_LIST_TEXT.DATA_LIST_I_OWN);
    default:
      return EMPTY_STRING;
  }
};

export const TAB_CONSTANT_ID = {
  FLOW_LIST_TAB_ID: 'FLOW_LIST_TAB_ID',
  DATA_LIST_TAB_ID: 'DATA_LIST_TAB_ID',
};

export const ASSIGNED_TO_OTHERS_TASK_SEARCH_LABEL = {
  OPEN: 'Open',
  COMPLETED: 'Completed',
};

export const TASK_SEARCH_HEAD = {
  TASKS: 'TASKS',
};
export const TASK_SEARCH_PLACEHOLDER = {
  SEARCH_TASK_NAME: 'Search task by name,  or flow…',
  SEARCH_TASK_NAME_WITHOUT_FLOW: 'Search task by name…',
  SEARCH_TASK_NAME_FOR_MOBILE: 'Search task',
};

export const ARIA_LABEL = {
  CLEAR_SEARCH: 'Clear Search',
};
export const LOADER_STRINGS = {
  LABEL: 'Loading...',
  COLOR: '#e5e9ef',
  HIGHLIGHT_COLOR: '#bfc9db',
};

export default LOADER_STRINGS;
