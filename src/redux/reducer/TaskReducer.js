import {
  TASK_LIST_ACTION,
  TASK_COUNT_ACTION,
} from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
// import { TASK_TAB_INDEX } from '../../containers/landing_page/LandingPage.strings';

const initialState = {
  activeTaskId: null,
  active_tasks_list: [],
  snoozed_tasks_list: [],
  tasks_results_list: [],
  isTaskSearchLoading: false,
  document_url_details: [],
  common_server_error: EMPTY_STRING,
  hasMore: false,
  hasMoreSnoozed: false,
  remainingTasksCount: 0,
  tab_index: 1,
  sortIndex: -1,
  selectedSortLabel: EMPTY_STRING,
  taskTypeIndex: -1,
  assignedOnIndex: -1,
  dueDateIndex: -3,
  isLoadMoreData: false,
  isTaskDataLoading: true,
  dataCountPerCall: 10,
  currentPage: 1,
  taskLogIdFromFlow: null,
  count: 0,
  snoozedCount: 0,
  searchText: EMPTY_STRING,
  searchTaskCount: {
    active_task_count: 0,
    completed_task_count: 0,
    assigned_to_others_task_count: 0,
  },
  isRefresh: false,
  searchAccordionIndex: 0,
  isTaskCountDataLoading: true,
  assigneesCount: 0,
  selectedCardTab: 1,
  selectedCardData: {},
  hasMoreAssignedOpenTask: false,
  isAssignedOpenTaskLoading: true,
  isAssignedOpenTaskLoadMore: false,
  assignedOpenTaskCount: 0,
  assigned_open_common_server_error: EMPTY_STRING,
  hasMoreAssignedCompletedTask: false,
  isAssignedCompletedTaskLoading: true,
  isAssignedCompletedTaskLoadMore: false,
  assignedCompletedTaskCount: 0,
  assigned_completed_common_server_error: EMPTY_STRING,
  isFilterApplied: false,
};

export default function TaskReducer(state = initialState, action) {
  switch (action.type) {
    case TASK_LIST_ACTION.STARTED:
      return {
        ...state,
        isTaskDataLoading: true,
        ...action.payload,
        active_tasks_list: [],
      };
    case TASK_LIST_ACTION.STARTED_NO_LOADING:
      return {
        ...state,
        ...action.payload,
        active_tasks_list: [],
      };
    case TASK_LIST_ACTION.TASK_RESULT_STARTED:
      return {
        ...state,
        isTaskSearchLoading: true,
        isTaskDataLoading: true,
      };
    case TASK_LIST_ACTION.LOAD_MORE: {
      return {
        ...state,
        isLoadMoreData: true,
        ...action.payload,
      };
    }
    case TASK_LIST_ACTION.SEARCH_LOAD_MORE: {
      return {
        ...state,
        isLoadMoreData: true,
        // isTaskSearchLoading: true,
      };
    }
    case TASK_LIST_ACTION.SUCCESS:
      return {
        ...state,
        isTaskDataLoading: false,
        isLoadMoreData: false,
        common_server_error: null,
        isTaskSearchLoading: false,
        ...action.payload,
      };
    // user details
    case TASK_LIST_ACTION.FAILURE:
      return {
        ...state,
        isTaskDataLoading: false,
        isTaskSearchLoading: false,
        isAssignedCompletedTaskLoading: false,
        isAssignedOpenTaskLoading: false,
        isAssignedCompletedTaskLoadMore: false,
        isAssignedOpenTaskLoadMore: false,
        common_server_error: action.payload,
      };
    case TASK_LIST_ACTION.CANCEL:
      return {
        ...state,
        isTaskDataLoading: false,
        isTaskSearchLoading: false,
      };
    case TASK_LIST_ACTION.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };

    case TASK_LIST_ACTION.CLEAR:
      return {
        // ...state,
        ...initialState,
      };
    case TASK_COUNT_ACTION.STARTED:
      return {
        ...state,
        isTaskCountDataLoading: true,
      };
    case TASK_COUNT_ACTION.SUCCESS:
      return {
        ...state,
        isTaskCountDataLoading: false,
        common_server_error: null,
      };
    default:
      return state;
  }
}
