import React, {
  useReducer,
  useContext,
  createContext,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { createSlice } from '@reduxjs/toolkit';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

const initialDashboardConfigReducerState = {
  isLoading: false,
  configType: EMPTY_STRING,
  dashboardId: null,
  fieldList: [],
  columnList: [],
  sorting: {
    field_source: '',
    field: '',
    order: 1,
  },
  additionalConfig: {
    show_task_list: false,
    report_name: 'All Request',
    show_download: false,
    show_submit: false,
    submit_button_label: 'Add New',
  },
  errorList: {},
  isDataUpdated: false,
};

const DashboardConfigContext = createContext({
  state: initialDashboardConfigReducerState,
  dispatch: () => {},
});

const DashboardConfigReducerSlice = createSlice({
  name: 'DashboardConfig',
  initialState: initialDashboardConfigReducerState,
  reducers: {
    dataChange: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    startDashboardConfigLoader: (state) => {
      state.isLoading = true;
    },
    stopDashboardConfigLoader: (state) => {
      state.isLoading = false;
    },
    clearDashboardConfig: () => {
      return {
        ...initialDashboardConfigReducerState,
      };
    },
  },
});

function DashboardConfigReducer({ children }) {
  const [state, dispatch] = useReducer(
    DashboardConfigReducerSlice.reducer,
    DashboardConfigReducerSlice.getInitialState(),
  );
  const contextValue = useCallback(
    {
      state,
      dispatch,
    },
    [state, dispatch],
  );

  return (
    <DashboardConfigContext.Provider value={contextValue}>
      {children}
    </DashboardConfigContext.Provider>
  );
}
DashboardConfigReducer.propTypes = {
  children: PropTypes.object,
};

export const useDashboardConfigProvider = () =>
  useContext(DashboardConfigContext);

export const {
  dataChange,
  startDashboardConfigLoader,
  stopDashboardConfigLoader,
  clearDashboardConfig,
} = DashboardConfigReducerSlice.actions;

export default DashboardConfigReducer;
