import { createSlice } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { TYPE_OPTION_LIST } from '../../containers/application/app_configuration/dashboard_configuration/DashboardConfig.strings';

const updateApplicationDashboardReportReducer =
  'updateApplicationDashboardReportReducer';

export const initialReport = {};

export const initialApplicationDashboardReportReducer = {
  dashboardConfig: {
    isLoading: false,
    dashboardLabel: EMPTY_STRING,
    typeDDSelectedValue: EMPTY_STRING,
    typeDDSelectedLabel: EMPTY_STRING,
    typeDDOptionList: TYPE_OPTION_LIST(i18next.t),
    dashboardDDSearchText: EMPTY_STRING,
    dashboardDDSelectedLabel: EMPTY_STRING,
    dashboardDDSelectedValue: EMPTY_STRING,
    dashboardDDOptionList: [],
    dashboardDDCurrentPage: 0,
    dashboardDDTotalCount: 0,
  },
  flowDashboard: {
    isLoading: false,
  },
  datalistDashboard: {
    isLoading: false,
  },
  flowReport: {},
  datalistReport: {},
  appReports: {},
};

export const ApplicationDashboardReportReducerSlice = createSlice({
  name: updateApplicationDashboardReportReducer,
  initialState: initialApplicationDashboardReportReducer,
  reducers: {
    dataChange: (state, action) => {
      return {
        ...state,
        ...action.payload.data,
      };
    },
    setDashboardConfigDataChange: (state, action) => {
      state.dashboardConfig = action.payload;
    },
    startDashboardConfigLoader: (state) => {
      state.dashboardConfig.isLoading = true;
    },
    stopDashboardConfigLoader: (state) => {
      state.dashboardConfig.isLoading = false;
    },
    clearDashboardConfig: (state) => {
      state.dashboardConfig =
        initialApplicationDashboardReportReducer.dashboardConfig;
    },
    clearDashboard: () => initialApplicationDashboardReportReducer,

    setFlowDashboard: (state, action) => {
      state.flowDashboard = action.payload;
    },
    setFlowDashboardLoader: (state, action) => {
      state.flowDashboard.isLoading = action.payload;
    },
    setFlowDashboardById: (state, action) => {
      state.flowDashboard[action.payload.id] = action.payload.data;
    },
    setFlowDashboardLoaderById: (state, action) => {
      state.flowDashboard[action.payload.id].isLoading = action.payload.data;
    },
    clearFlowDashboard: (state, action) => {
      delete state.flowDashboard[action.payload.id];
    },

    setDatalistDashboard: (state, action) => {
      state.datalistDashboard = action.payload;
    },
    setDatalistDashboardLoader: (state, action) => {
      state.datalistDashboard.isLoading = action.payload;
    },
    setDatalistDashboardById: (state, action) => {
      state.datalistDashboard[action.payload.id] = { ...state.datalistDashboard[action.payload.id], ...action.payload.data };
    },
    setDatalistDashboardLoaderById: (state, action) => {
      state.datalistDashboard[action.payload.id].isLoading =
        action.payload.data;
    },
    clearDatalistDashboard: (state, action) => {
      delete state.datalistDashboard[action.payload.id];
    },

    addAppReport: (state, action) => {
      state.appReports[action.payload.id] = { ...state.appReports[action.payload.id], ...action.payload.data };
    },
    setAppReportLoaderById: (state, action) => {
      state.appReports[action.payload.id].reports.isLoading = action.payload.data;
    },
    removeAppReport: (state, action) => {
      delete state.appReports[action.payload.id];
    },
  },
});

export const {
  dataChange,
  setDashboardConfigDataChange,
  startDashboardConfigLoader,
  stopDashboardConfigLoader,
  clearDashboardConfig,
  clearDashboard,

  setFlowDashboard,
  setFlowDashboardLoader,
  setFlowDashboardById,
  setFlowDashboardLoaderById,
  clearFlowDashboard,

  setDatalistDashboard,
  setDatalistDashboardLoader,
  setDatalistDashboardById,
  setDatalistDashboardLoaderById,
  clearDatalistDashboard,

  addAppReport,
  setAppReportLoaderById,
  removeAppReport,
} = ApplicationDashboardReportReducerSlice.actions;

export default ApplicationDashboardReportReducerSlice.reducer;
