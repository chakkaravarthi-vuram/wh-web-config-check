import { createAction, createReducer } from '@reduxjs/toolkit';
import { USAGE_DASHBOARD } from '../actions/ActionConstants';

const initialState = {
  // Usage Summary
  isUsageSummaryLoading: false,
  common_server_error: null,
  usageSummaryData: [],
  // User Summary
  isUsersSummaryLoading: false,
  common_server_error_users_summary: null,
  topActiveUsersData: [],
  topActiveDevelopersData: [],
  usersSummaryData: [],
  // Flow Metrics
  isFlowListLoading: false,
  common_server_error_flow_list: null,
  flowListData: [],

  isTaskFlowListLoading: false,
  common_server_error_task_flow: null,
  taskFlowListData: [],

  isUserTaskListLoading: false,
  common_server_error_user_task: null,
  userTaskListData: [],
};

// UsageSummary
export const getUsageSummaryDataStarted = createAction(
  USAGE_DASHBOARD.USAGE_SUMMARY_STARTED,
);

export const getUsageSummaryDataSuccess = createAction(
  USAGE_DASHBOARD.USAGE_SUMMARY_SUCCESS,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const getUsageSummaryDataFailure = createAction(
  USAGE_DASHBOARD.USAGE_SUMMARY_FAILURE,
  (error) => {
    return {
      payload: error,
    };
  },
);

// Users Summary
export const getUsersSummaryDataStarted = createAction(
  USAGE_DASHBOARD.USERS_SUMMARY_STARTED,
);

export const getUsersSummaryDataSuccess = createAction(
  USAGE_DASHBOARD.USERS_SUMMARY_SUCCESS,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const getUsersSummaryDataFailure = createAction(
  USAGE_DASHBOARD.USERS_SUMMARY_FAILURE,
  (error) => {
    return {
      payload: error,
    };
  },
);

// Flow Metrics Start
export const getFlowListDataStarted = createAction(
  USAGE_DASHBOARD.FLOW_LIST_STARTED,
);
export const getTaskFlowListDataStarted = createAction(
  USAGE_DASHBOARD.TASK_FLOW_LIST_STARTED,
);
export const getUserTaskListDataStarted = createAction(
  USAGE_DASHBOARD.USER_TASK_LIST_STARTED,
);

export const getFlowListDataSuccess = createAction(
  USAGE_DASHBOARD.FLOW_LIST_SUCCESS,
  (data) => {
    return {
      payload: data,
    };
  },
);
export const getTaskFlowListDataSuccess = createAction(
  USAGE_DASHBOARD.TASK_FLOW_LIST_SUCCESS,
  (data) => {
    return {
      payload: data,
    };
  },
);
export const getUserTaskListDataSuccess = createAction(
  USAGE_DASHBOARD.USER_TASK_LIST_SUCCESS,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const getFlowListDataFailure = createAction(
  USAGE_DASHBOARD.FLOW_LIST_FAILURE,
  (error) => {
    return {
      payload: error,
    };
  },
);
export const getTaskFlowListDataFailure = createAction(
  USAGE_DASHBOARD.TASK_FLOW_LIST_FAILURE,
  (error) => {
    return {
      payload: error,
    };
  },
);
export const getUserTaskListDataFailure = createAction(
  USAGE_DASHBOARD.USER_TASK_LIST_FAILURE,
  (error) => {
    return {
      payload: error,
    };
  },
);
// Flow Metrics End

const UsageDashboardReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getFlowListDataStarted, (state) => {
      // Flow Metrics Start
      return {
        ...state,
        isFlowListLoading: true,
      };
    })
    .addCase(getTaskFlowListDataStarted, (state) => {
      return {
        ...state,
        isTaskFlowListLoading: true,
      };
    })
    .addCase(getUserTaskListDataStarted, (state) => {
      return {
        ...state,
        isUserTaskListLoading: true,
      };
    })
    .addCase(getFlowListDataSuccess, (state, action) => {
      return {
        ...state,
        flowListData: action.payload,
        common_server_error_flow_list: null,
        isFlowListLoading: false,
      };
    })
    .addCase(getTaskFlowListDataSuccess, (state, action) => {
      return {
        ...state,
        taskFlowListData: action.payload,
        common_server_error_task_flow: null,
        isTaskFlowListLoading: false,
      };
    })
    .addCase(getUserTaskListDataSuccess, (state, action) => {
      return {
        ...state,
        userTaskListData: action.payload,
        common_server_error_user_task: null,
        isUserTaskListLoading: false,
      };
    })
    .addCase(getFlowListDataFailure, (state, action) => {
      return {
        ...state,
        flowListData: [],
        common_server_error_flow_list: action.payload.common_server_error,
        isFlowListLoading: false,
      };
    })
    .addCase(getTaskFlowListDataFailure, (state, action) => {
      return {
        ...state,
        taskFlowListData: [],
        common_server_error_task_flow: action.payload.common_server_error,
        isTaskFlowListLoading: false,
      };
    })
    .addCase(getUserTaskListDataFailure, (state, action) => {
      return {
        ...state,
        userTaskListData: [],
        common_server_error_user_task: action.payload.common_server_error,
        isUserTaskListLoading: false,
      };
      // Flow Metrics End
    })
    .addCase(getUsageSummaryDataStarted, (state) => {
      return {
        ...state,
        isUsageSummaryLoading: true,
      };
    })
    .addCase(getUsageSummaryDataSuccess, (state, action) => {
      return {
        ...state,
        usageSummaryData: action.payload,
        common_server_error: null,
        isUsageSummaryLoading: false,
      };
    })
    .addCase(getUsageSummaryDataFailure, (state, action) => {
      return {
        ...state,
        usageSummaryData: [],
        common_server_error: action.payload.common_server_error,
        isUsageSummaryLoading: false,
      };
    })
    .addCase(getUsersSummaryDataStarted, (state) => {
      return {
        ...state,
        isUsersSummaryLoading: true,
      };
    })
    .addCase(getUsersSummaryDataSuccess, (state, action) => {
      return {
        ...state,
        usersSummaryData: action.payload,
        common_server_error_users_summary: null,
        isUsersSummaryLoading: false,
      };
    })
    .addCase(getUsersSummaryDataFailure, (state, action) => {
      return {
        ...state,
        usersSummaryData: [],
        common_server_error_users_summary: action.payload.common_server_error,
        isUsersSummaryLoading: false,
      };
    });
});

export default UsageDashboardReducer;
