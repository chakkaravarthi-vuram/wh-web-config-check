import {
  FLOW_LIST_ACTION,
  STARTED_FLOW_LIST_ACTION,
} from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  sortType: 'last_updated_on',
  sortValue: 'Published On (DESC)',
  sortBy: -1,
  sortLabel: 'Published On (DESC)',
  hasMore: false,
  remainingFlowsCount: 0,
  flow_list: [],
  searchText: EMPTY_STRING,
  sortIndex: null,
  isDataLoading: false,
  isLoadMoreDataLoading: false,
  common_server_error: EMPTY_STRING,
  tab_index: 1,
  total_count: null,
  started_flow_list: [],
  isStartedFlowListLoading: false,
  infiniteScrollHasMoreData: true,
  infiniteScrollDataLoading: false,
  infiniteScrollPage: 1,
  startedFlowLength: 0,
  landing_flow_list: [],
  isLandingDataLoading: true,
  isLoadMoreLandingDataLoading: false,
};

export default function FlowListReducer(state = initialState, action) {
  const { type, payload } = action;
  const actionPayload = payload;

  switch (type) {
    case FLOW_LIST_ACTION.STARTED:
      return {
        ...state,
        ...(actionPayload.isLoadMoreHandler
          ? { isLoadMoreDataLoading: true }
          : { isDataLoading: true, flow_list: [], hasMore: false }),
      };
    case FLOW_LIST_ACTION.LANDING_STARTED:
      return {
        ...state,
        ...(actionPayload.isLoadMoreHandler
          ? { isLoadMoreLandingDataLoading: true }
          : { isLandingDataLoading: true }),
      };
    case FLOW_LIST_ACTION.SUCCESS:
      return {
        ...state,
        isLoadMoreDataLoading: false,
        common_server_error: null,
        isDataLoading: false,
        ...actionPayload,
      };
    case FLOW_LIST_ACTION.LANDING_SUCCESS:
      return {
        ...state,
        isLoadMoreLandingDataLoading: false,
        common_server_error: null,
        isLandingDataLoading: false,
        ...actionPayload,
      };
    // user details
    case FLOW_LIST_ACTION.FAILURE:
      return {
        ...state,
        isDataLoading: false,
        isLoadMoreDataLoading: false,
        flow_list: [],
        common_server_error: actionPayload,
      };
    case FLOW_LIST_ACTION.LANDING_FAILURE:
      return {
        ...state,
        isLandingDataLoading: false,
        isLoadMoreLandingDataLoading: false,
        landing_flow_list: [],
        common_server_error: actionPayload,
      };
    case FLOW_LIST_ACTION.CANCEL:
      return {
        ...state,
        isDataLoading: false,
        isLoadMoreDataLoading: false,
      };
    case FLOW_LIST_ACTION.DATA_CHANGE:
      return {
        ...state,
        ...actionPayload,
      };

    case FLOW_LIST_ACTION.CLEAR:
      return {
        ...state,
        ...initialState,
      };
    case FLOW_LIST_ACTION.REFRESH_FLOW_STARTED:
      return {
        ...state,
        refreshFlowList: true,
      };
    case FLOW_LIST_ACTION.REFRESH_FLOW_COMPLETED:
      return {
        ...state,
        refreshFlowList: false,
      };
    case STARTED_FLOW_LIST_ACTION.STARTED:
      return {
        ...state,
        isStartedFlowListLoading: true,
      };
    case STARTED_FLOW_LIST_ACTION.SUCCESS:
      return {
        ...state,
        isStartedFlowListLoading: false,
        common_server_error: null,
        ...actionPayload,
      };
    case STARTED_FLOW_LIST_ACTION.FAILURE:
      return {
        ...state,
        isStartedFlowListLoading: false,
        common_server_error: actionPayload,
      };
    case STARTED_FLOW_LIST_ACTION.CANCEL:
      return {
        ...state,
        isStartedFlowListLoading: false,
      };
    case STARTED_FLOW_LIST_ACTION.CLEAR:
      return {
        ...state,
        started_flow_list: [],
        isStartedFlowListLoading: false,
      };
    default:
      return state;
  }
}
