import { createSlice } from '@reduxjs/toolkit';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const updateReportReducer = 'updateReportReducer';

export const initialReportReducerState = {
  reportListing: {
    isLoading: false,
    reportList: [],
    paginationDetails: { page: 1, totalCount: 6 },
    hasMore: false,
    searchText: EMPTY_STRING,
    sortName: EMPTY_STRING,
    sortField: 'published_on',
    sortBy: -1,
  },
  reportConfig: {
    _id: EMPTY_STRING,
    uuid: EMPTY_STRING,
    isLoading: false,
    name: EMPTY_STRING,
    description: EMPTY_STRING,
    admins: {
      users: [],
      teams: [],
    },
    viewers: {
      users: [],
      teams: [],
    },
    report_category: EMPTY_STRING,
    report_Data: {},
    source_Data: {},
    source_config: [],
    errorList: {},
    error_metadata: {
      deleted_field_uuid: [],
      deleted_source_uuid: [],
      deleted_map_source_uuid: [],
    },
    visualizationType: 3,
    isTableInstanceAdminOwnerViewer: false,
  },
  reports: {
    isLoading: false,
    inputFieldsForReport: [],
    selectedFieldsFromReport: [],
    chartDDSelectedDimensionsValue: EMPTY_STRING,
    fieldDisplayNameSelectedValue: EMPTY_STRING,
    chartSelectedRange: [
      {
        label: EMPTY_STRING,
        boundary: [],
      },
    ],
    isRangeSelected: false,
    is_break_down: false,
    ddMonthYearSelectedValue: EMPTY_STRING,
    skipNullValues: true,
    chartData: [],
    chartLabel: [],
    reportDrillDownTitle: EMPTY_STRING,
    reportDrillDownLabel: [],
    reportDrillDownData: [],
    paginationDetails: { limit_data: 5, skip_data: 0, total_count: 0 },
    additionalConfiguration: {
      isShowTotal: false,
      sortBySelectedFieldValue: EMPTY_STRING,
      sortBySelectedValue: EMPTY_STRING,
    },
    fieldCount: {
      x: 0,
      y: 0,
    },
    report: { error_list: {} },
    dataRangeErrorList: {},
  },
  filter: {
    order: {},
    headerDimension: [],
    isFilter: false,
    selectedFilterData: EMPTY_STRING,
    dataListInstanceId: EMPTY_STRING,
    isDataListId: false,
    sql_property: EMPTY_STRING,

    inputFieldDetailsForFilter: [],
    selectedFieldDetailsFromFilter: [],
    displayDimensions: [],
    metric_dimensions: [],
    system_dimensions: [],
    downloadInputField: [],
    download_select_all: [{ label: 'Select all', value: 0 }],
    download_is_open: false,
  },
  sourceList: [],
  originalCharts: {},
  originalFilter: {},
  optionList: [],
  primaryDataSource: EMPTY_STRING,
  secondaryDataSource: EMPTY_STRING,
  primaryField: EMPTY_STRING,
  secondaryField: EMPTY_STRING,
  primaryDataSourceOptionList: [],
  secondaryDataSourceOptionList: [],
  primaryFieldOptionList: [],
  secondaryFieldOptionList: [],
  primarySourceType: EMPTY_STRING,
  primaryDataSourceName: EMPTY_STRING,
  secondaryDataSourceName: EMPTY_STRING,
  secondaryDataSourceType: EMPTY_STRING,
  primaryFieldName: EMPTY_STRING,
  secondaryFieldName: EMPTY_STRING,
  isListLoading: true,
  apiBasicDetails: {},
  isAddOneMore: false,
  errorList: [],
  reportCategory: 3,
  userFilter: {
    order: {},
    headerDimension: [],
    isFilter: false,
    selectedFilterData: EMPTY_STRING,
    dataListInstanceId: EMPTY_STRING,
    isDataListId: false,
    sql_property: EMPTY_STRING,

    inputFieldDetailsForFilter: [],
    selectedFieldDetailsFromFilter: [],
    displayDimensions: [],
    metric_dimensions: [],
    system_dimensions: [],
    downloadInputField: [],
    download_select_all: [{ label: 'Select all', value: 0 }],
    download_is_open: false,
  },
  reportViewUserFilter: {
    order: {},
    headerDimension: [],
    isFilter: false,
    selectedFilterData: EMPTY_STRING,
    dataListInstanceId: EMPTY_STRING,
    isDataListId: false,
    sql_property: EMPTY_STRING,

    inputFieldDetailsForFilter: [],
    selectedFieldDetailsFromFilter: [],
    displayDimensions: [],
    metric_dimensions: [],
    system_dimensions: [],
    downloadInputField: [],
    download_select_all: [{ label: 'Select all', value: 0 }],
    download_is_open: false,
  },
  dayFilterData: EMPTY_STRING,
  monthFilterData: EMPTY_STRING,
  yearFilterData: EMPTY_STRING,
  currencyFilterList: [],
  selectedCurrencyFilter: null,
};

export const ReportReducerSlice = createSlice({
  name: updateReportReducer,
  initialState: initialReportReducerState,
  reducers: {
    dataChange: (state, action) => {
      return {
        ...state,
        ...action.payload.data,
      };
    },
    setReportListing: (state, action) => {
      state.reportListing = action.payload;
    },
    setReportListingDataChange: (state, action) => {
      state.reportListing = {
        ...state.reportListing,
        ...action.payload,
      };
    },
    startReportListingLoader: (state) => {
      state.reportListing.isLoading = true;
    },
    stopReportListingLoader: (state) => {
      state.reportListing.isLoading = false;
    },
    clearReportListing: (state) => {
      state.reportListing = initialReportReducerState.reportListing;
    },

    setReportConfig: (state, action) => {
      state.reportConfig = action.payload;
    },
    startReportConfigLoader: (state) => {
      state.reportConfig.isLoading = true;
    },
    stopReportConfigLoader: (state) => {
      state.reportConfig.isLoading = false;
    },
    clearReportConfig: (state) => {
      state.reportConfig = initialReportReducerState.reportConfig;
    },

    startChartsLoading: (state) => {
      state.reports.isLoading = true;
    },
    stopChartsLoading: (state) => {
      state.reports.isLoading = false;
    },
    setChartsData: (state, action) => {
      state.reports = action.payload;
    },
    clearChartsData: (state) => {
      state.reports = initialReportReducerState.reports;
      state.filter = initialReportReducerState.filter;
      state.dayFilterData = initialReportReducerState.dayFilterData;
      state.monthFilterData = initialReportReducerState.monthFilterData;
      state.yearFilterData = initialReportReducerState.yearFilterData;
      state.currencyFilterList = initialReportReducerState.currencyFilterList;
      state.selectedCurrencyFilter = initialReportReducerState.selectedCurrencyFilter;
      state.sourceList = initialReportReducerState.sourceList;
      state.reportViewUserFilter = initialReportReducerState.reportViewUserFilter;
    },
    clearCreateReportData: (state) => {
      state.primaryDataSource = EMPTY_STRING;
      state.secondaryDataSource = EMPTY_STRING;
      state.primaryField = EMPTY_STRING;
      state.secondaryField = EMPTY_STRING;
      state.primaryDataSourceOptionList = [];
      state.primaryFieldOptionList = [];
      state.primarySourceType = EMPTY_STRING;
      state.primaryDataSourceName = EMPTY_STRING;
      state.secondaryDataSourceName = EMPTY_STRING;
      state.secondaryDataSourceType = EMPTY_STRING;
      state.primaryFieldName = EMPTY_STRING;
      state.secondaryFieldName = EMPTY_STRING;
      state.reportCategory = 3;
      state.errorList = {};
      state.isAddOneMore = false;
      state.reportViewUserFilter =
        initialReportReducerState.reportViewUserFilter;
      state.userFilter = initialReportReducerState.userFilter;
      state.dayFilterData = EMPTY_STRING;
      state.monthFilterData = EMPTY_STRING;
      state.yearFilterData = EMPTY_STRING;
      state.currencyFilterList = [];
      state.selectedCurrencyFilter = null;
      state.sourceList = [];
    },
    clearAdditionalData: (state) => {
      state.primaryField = EMPTY_STRING;
      state.secondaryField = EMPTY_STRING;
      state.primaryFieldOptionList = [];
      state.secondaryDataSourceName = EMPTY_STRING;
      state.secondaryDataSourceType = EMPTY_STRING;
      state.primaryFieldName = EMPTY_STRING;
      state.secondaryFieldName = EMPTY_STRING;
      state.secondaryDataSource = EMPTY_STRING;
    },
    clearDrillDownData: (state) => {
      state.reports.reportDrillDownLabel = [];
      state.reports.reportDrillDownData = [];
    },
  },
});

export const {
  dataChange,

  setReportListing,
  setReportListingDataChange,
  startReportListingLoader,
  stopReportListingLoader,
  clearReportListing,

  setReportConfig,
  startReportConfigLoader,
  stopReportConfigLoader,
  clearReportConfig,

  setChartsData,
  startChartsLoading,
  stopChartsLoading,
  clearChartsData,
  clearCreateReportData,
  clearAdditionalData,
  clearDrillDownData,
} = ReportReducerSlice.actions;

export default ReportReducerSlice.reducer;
