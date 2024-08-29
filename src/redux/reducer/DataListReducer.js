import {
  createAction,
  createReducer,
} from '@reduxjs/toolkit';
import { DATA_LIST } from '../actions/ActionConstants';
import jsUtils from '../../utils/jsUtility';
import {
  PD_TAB,
} from '../../containers/flow/flow_dashboard/FlowDashboard.string';

const { EMPTY_STRING } = require('../../utils/strings/CommonStrings');
// Actions

// recent data list
export const getAllRecentDataListStartedAction = createAction(
  DATA_LIST.GET_ALL_RECENT_DATA_LIST_API_STARTED,
);
export const getAllRecentDataListSuccessAction = createAction(
  DATA_LIST.GET_ALL_RECENT_DATA_LIST_API_SUCCESS,
  (dataList) => {
    return {
      payload: dataList,
    };
  },
);
export const getAllRecentDataListFailedAction = createAction(
  DATA_LIST.GET_ALL_RECENT_DATA_LIST_API_FAILED,
  (error) => {
    return {
      payload: error,
    };
  },
);

// other data list
export const getAllOtherDataListStartedAction = createAction(
  DATA_LIST.GET_ALL_OTHER_DATA_LIST_API_STARTED,
);
export const getAllOtherDataListInfiniteScrollStartedAction = createAction(
  DATA_LIST.GET_ALL_INFINITE_SCROLL_OTHER_DATA_LIST_API_STARTED,
);
export const getAllOtherDataListSuccessAction = createAction(
  DATA_LIST.GET_ALL_OTHERS_DATA_LIST_API_SUCCESS,
  (dataList) => {
    return {
      payload: dataList,
    };
  },
);
export const getAllOtherDataListFailedAction = createAction(
  DATA_LIST.GET_ALL_OTHER_DATA_LIST_API_FAILED,
  (error) => {
    return {
      payload: error,
    };
  },
);

export const clearLandingPageDataListAction = createAction(
  DATA_LIST.CLEAR_LANDING_PAGE_DATA_LIST,
);

export const addDataListChangeAction = createAction(
  DATA_LIST.ADD_DATA_LIST_DATA_UPDATE,
  (updatedAddDataListContent) => {
    return {
      payload: updatedAddDataListContent,
    };
  },
);

export const updateActiveEntryDetails = createAction(
  DATA_LIST.UPDATE_ACTIVE_ENTRY_DETAILS,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const dataListDashboardDataChange = createAction(
  DATA_LIST.DATA_CHANGE,
  (payload) => {
    return {
      payload,
    };
  },
);

export const addDataListIntChangeAction = (content) => (dispatch) => {
  dispatch(addDataListChangeAction(content));
  return Promise.resolve(content);
};

export const getAllDataListFailedAction = createAction(
  DATA_LIST.GET_ALL_DATA_LIST_API_FAILED,
  (error) => {
    return {
      payload: error,
    };
  },
);

export const getDataListDetailsSuccessAction = createAction(
  DATA_LIST.GET_DATA_LIST_BY_DETAILS_SUCCESS,
  (dataListDetails) => {
    return {
      payload: dataListDetails,
    };
  },
);

// data list entries
export const getAllDataListEntriesStartedAction = createAction(
  DATA_LIST.GET_ALL_DATA_LIST_ENTRIES_STARTED,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const getDataListListingApiSuccessAction = createAction(
  DATA_LIST.GET_ALL_DATA_LIST_LISTING_ENTRIES_SUCCESS,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const getAllDataListEntriesFailedAction = createAction(
  DATA_LIST.GET_ALL_DATA_LIST_ENTRIES_FAILED,
  (error) => {
    return {
      payload: error,
    };
  },
);

export const submitDataListEntryStartedAction = createAction(
  DATA_LIST.SUBMIT_DATA_LIST_ENTRY_STARTED,
);

export const submitDataListEntrySuccessAction = createAction(
  DATA_LIST.SUBMIT_DATA_LIST_ENTRY_SUCCESS,
);

export const submitDataListEntryFailedAction = createAction(
  DATA_LIST.SUBMIT_DATA_LIST_ENTRY_FAILED,
  (error) => {
    return {
      payload: error,
    };
  },
);

export const getDataListEntryDetailsStartedAction = createAction(
  DATA_LIST.GET_DATA_LIST_ENTRY_DETAILS_STARTED,
);

export const getDataListEntryDetailsSuccessAction = createAction(
  DATA_LIST.GET_DATA_LIST_ENTRY_DETAILS_SUCCESS,
  (dataListEntryDetails) => {
    return {
      payload: dataListEntryDetails,
    };
  },
);

export const getDataListEntryDetailsFailedAction = createAction(
  DATA_LIST.GET_DATA_LIST_ENTRY_DETAILS_FAILED,
  (error) => {
    return {
      payload: error,
    };
  },
);

export const updateSelectedDataListAction = createAction(
  DATA_LIST.UPDATE_SELECTED_DATA_LIST_ID,
  (searchText) => {
    return { payload: searchText };
  },
);

export const setUpdatedFieldVisibilityListInDataList = createAction(
  DATA_LIST.UPDATE_FIELD_ON_VISIBILITY_CHANGE,
  (fields) => {
    return {
      payload: fields,
    };
  },
);

// datalist dashboard
export const setDataListDashboardTabIndex = createAction(
  DATA_LIST.SET_DATA_LIST_DASHBOARD_TAB_INDEX,
  (tabIndex = 1) => {
    return {
      payload: tabIndex,
    };
  },
);

export const toggleAddDataListModalVisibility = createAction(
  DATA_LIST.TOGGLE_ADD_NEW_DATA_LIST_MODAL_VISIBILITY,
  (value = 0) => {
    return {
      payload: value,
    };
  },
);

// data list entry task
export const getDataListEntryTaskDetailsStarted = createAction(
  DATA_LIST.GET_DATA_LIST_ENTRY_TASK_DETAILS_STARTED,
);
export const getDataListEntryTaskDetailsSuccess = createAction(
  DATA_LIST.GET_DATA_LIST_ENTRY_TASK_DETAILS_SUCCESS,
  (taskEntries) => {
    return {
      payload: taskEntries,
    };
  },
);
export const getDataListEntryTaskDetailsFailed = createAction(
  DATA_LIST.GET_DATA_LIST_ENTRY_TASK_DETAILS_FAILED,
  (error) => {
    return {
      payload: error,
    };
  },
);

export const dataListStateChangeAction = createAction(
  DATA_LIST.DATA_LIST_STATE_CHANGE,
  (content, id) => {
    return {
      payload: { content, id },
    };
  },
);

export const dataListIntStateChangeAction = (content, id) => (dispatch) => {
  dispatch(dataListStateChangeAction(content, id));
  return Promise.resolve(content, id);
};

// REPORT ENGINE
export const clearAddDataListFormData = createAction(
  DATA_LIST.CLEAR_ADD_DATA_LIST_FORM_DATA,
);

export const setPopperVisibilityTruncateAll = createAction(
  DATA_LIST.POPUP_TRUNCATE_VISIBLE,
  (condition) => {
    return {
      payload: condition,
    };
  },
);

export const setDataListModelVisibleFalse = createAction(DATA_LIST.SET_DATA_LIST_MODEL_VISIBLE_FALSE);

// Reducer

export const initState = {
  displayReportEdit: false,
  selectedDataListId: null,
  referenceId: null,
  systemIdentifier: null,
  particularDataListDetails: {},
  activeEntry: {},
  particularDataListEntryDetails: {
    form_metadata: {},
    file_ref_uuid: [],
    addDataListFormData: {},
    initialAddDataListFormData: {},
    unSuccessfullFileUploads: [],
    error_list: {},
    removed_doc_list: [],
  },

  entryListSortIndex: null,
  entryListSearchText: EMPTY_STRING,
  entryListHasMore: true,
  entryListDataCountPerCall: 5,
  entryListCount: null,
  entryListPage: 1,

  sortIndex: null,
  searchText: EMPTY_STRING,
  hasMore: true,
  dataCountPerCall: 10,
  count: null,

  // landing page data list
  // recent datalist
  allRecentDataList: [],
  totalRecentDataListCount: 0,
  renderedRecentDataListCount: 0,
  recentDataListCurrentPage: 1,
  isLandingPageRecentDataListLoading: true,

  // datalist listing page
  data_list: [],
  sortType: 'last_updated_on',
  sortValue: 'Published On (DESC)',
  sortBy: -1,
  sortLabel: 'Published On (DESC)',
  tab_index: 1,
  isDataListListingLoadMore: false,
  document_url_details: [],

  // other datalist
  allOthersDataList: [],
  totalOtherDataListCount: 0,
  renderedOtherDataListCount: 0,
  otherDataListCurrentPage: 1,
  otherDataListDataCountPerCall: 10,
  isLandingPageOtherDataListLoading: true,
  isLandingPageOtherDataListInfiniteScrollLoading: false,
  remainingOtherDataListCount: 0,
  otherDataListHasMore: false,
  // datalist dashboard
  allDataListEntries: [],
  dataListDashboardTabIndex: 1,
  dataListDashboardViewType: 1,
  dataListModalVisibility: {
    isVisible: false,
    type: 0,
  },
  isDataListDashboardLoading: false,
  isDataListEnteriesLoading: false,
  reassignTaskDetails: {
    reassignedUsers: {
      teams: [],
      users: [],
    },
  },
  reassignModal: {
    error_list: {},
  },
  // view data list
  viewDataListTabIndex: 1,

  isDataListLoading: false,
  isDataListEntryLoading: false,
  common_server_error: null,

  // REPORT ENGINE
  lstDashboardDataLists: {
    pagination_details: [],
    pagination_data: [],
    document_url_details: null,
  },
  lstPaginationData: {
    pagination_details: [{ total_count: 0, page: 1, size: 5 }],
    pagination_data: [],
    document_url_details: null,
  },
  PdTabIndex: PD_TAB().ALL.TAB_INDEX,
  reportEngineLoading: false,
  isFetchingSavedReportsChartData: false,
  isDashboardFilterLoading: false,
  filter: {
    order: {},
    headerDimension: [],
    isFilter: false,
    tab_index: 1,

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
  search: {
    _id: EMPTY_STRING,
    report_uuid: EMPTY_STRING,
    is_new_report: false,
    search_name: EMPTY_STRING,
    search_description: EMPTY_STRING,
    error_list: {},
  },
  savedSearch: {
    isLoading: false,
    selectedSavedSearchName: EMPTY_STRING,
    isSavedSearchLanding: true,
    selectedSearchTitle: EMPTY_STRING,
    selectedSearchId: EMPTY_STRING,
    searchText: EMPTY_STRING,
    savedSearchList: [],
    pdViewIndex: EMPTY_STRING,
    //
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
  },
  // data list entry task
  allDataListEntryTaskEntries: [],
  isDataListEntryTaskPageLoading: false,
  isDataListEntryTaskEntriesLoading: false,
  dataListEntryTaskCount: 0,
  activePage: 1,
  itemCountPerPage: 5,
  searchTask: EMPTY_STRING,
  isClosed: null,
  dataListTaskDocumentUrl: [],

  server_error: {},

  dataListSecurity: {
    can_add_datalist_entry: false,
    can_edit_datalist: false,
    is_system_defined: false,
  },
  searchValue: EMPTY_STRING,
  popperTruncateVisibility: false,
  auditListHashMore: true,
  auditListItem: [],
  auditPage: 1,
  dataListAuditDetail: {},
  isDataListAuditDataLoading: false,
  totalCount: 0,
  hasMoreAuditData: true,
  isIntialLoading: true,
  filterquerryLoading: true,
  listLoading: false,
  auditEditorsFieldList: [],
  audiEditorsLists: [],
  selectedFieldName: null,
  selectedEditorName: null,
  dataListAuditDetails: {},
  dataListAuditfields: {},
  auditedTabelRows: [],
  tabelfieldEditedLists: [],
  isAuditDetailsLoading: false,
  auditResponseError: {},
  isIntialEntry: true,
  datalistDeleted: false,
  currentReportData: {},
  isCurrentReportLoading: false,
  currentReportCharts: {},
};

const dataListReducer = createReducer(initState, (builder) => {
  builder
    .addCase(dataListStateChangeAction, (state, action) => {
      state[action.payload.id] = action.payload.content;
    })
    .addCase(getAllRecentDataListStartedAction, (state) => {
      state.isLandingPageRecentDataListLoading = true;
    })
    .addCase(getAllRecentDataListSuccessAction, (state, action) => {
      state.allRecentDataList = action.isPaginatedData
        ? [...state.allRecentDataList, ...action.payload.list]
        : action.payload.list;
      state.totalRecentDataListCount = action.payload.total_count;
      state.renderedRecentDataListCount = state.allRecentDataList.length;
      state.recentDataListCurrentPage = action.payload.page;
      state.isLandingPageRecentDataListLoading = false;
      state.common_server_error = null;
    })
    .addCase(getAllRecentDataListFailedAction, (state, action) => {
      state.common_server_error = action.payload.common_server_error;
      state.isLandingPageRecentDataListLoading = false;
    })
    // other datalist
    .addCase(getAllOtherDataListStartedAction, (state) => {
      state.isLandingPageOtherDataListLoading = true;
    })
    .addCase(
      getAllOtherDataListInfiniteScrollStartedAction,
      (state) => {
        state.isLandingPageOtherDataListInfiniteScrollLoading = true;
      },
    )
    .addCase(getAllOtherDataListSuccessAction, (state, action) => {
      state.allOthersDataList = action.payload.isPaginatedData
        ? [...state.allOthersDataList, ...action.payload.list]
        : action.payload.list;
      state.totalOtherDataListCount = action.payload.total_count;
      state.renderedOtherDataListCount = state.allOthersDataList.length;
      state.otherDataListCurrentPage = action.payload.page;
      state.isLandingPageOtherDataListLoading = false;
      state.isLandingPageOtherDataListInfiniteScrollLoading = false;
      state.common_server_error = null;
      state.remainingOtherDataListCount =
        state.totalOtherDataListCount - state.renderedOtherDataListCount;
      state.otherDataListHasMore = state.remainingOtherDataListCount > 0;
    })
    .addCase(getAllOtherDataListFailedAction, (state, action) => {
      state.common_server_error = action.payload.common_server_error;
      state.isLandingPageOtherDataListInfiniteScrollLoading = false;
      state.isLandingPageOtherDataListLoading = false;
    })
    .addCase(clearLandingPageDataListAction, (state) => {
      state.allOthersDataList = [];
      state.allRecentDataList = [];
      state.isLandingPageDataListLoading = true;
      state.isLandingPageRecentDataListLoading = true;
      state.isLandingPageOtherDataListLoading = true;
      state.isLandingPageOtherDataListInfiniteScrollLoading = false;
      state.totalRecentDataListCount = 0;
      state.renderedRecentDataListCount = 0;
      state.recentDataListCurrentPage = 1;
      state.totalOtherDataListCount = 0;
      state.renderedOtherDataListCount = 0;
      state.otherDataListCurrentPage = 1;
      state.common_server_error = null;
      state.remainingOtherDataListCount = 0;
      state.otherDataListHasMore = false;
    })
    .addCase(getDataListDetailsSuccessAction, (state, action) => {
      state.particularDataListDetails = action.payload;
      state.isDataListDashboardLoading = false;
      state.common_server_error = null;
      state.reportEngineLoading = false;
      state.isFetchingSavedReportsChartData = false;
    })
    // entry
    .addCase(getAllDataListEntriesStartedAction, (state, action) => {
        if (action.payload && action.payload.isLoadMoreHandler) {
          state.isDataListListingLoadMore = true;
        } else {
          state.isDataListEnteriesLoading = true;
          state.data_list = [];
          state.hasMore = false;
        }
    })
    .addCase(getDataListListingApiSuccessAction, (state, action) => {
      const {
        data_list,
        total_count,
        size,
        hasMore,
        document_url_details,
      } = action.payload;
      if (data_list != null) state.data_list = data_list;
      if (size != null) state.size = size;
      if (total_count != null) state.count = total_count;
      state.isDataListEnteriesLoading = false;
      state.isDataListListingLoadMore = false;
      if (hasMore != null) state.hasMore = hasMore;
      state.common_server_error = null;
      if (document_url_details != null) { state.document_url_details = document_url_details; }
    })

    .addCase(getAllDataListEntriesFailedAction, (state, action) => {
      state.data_list = [];
      state.common_server_error = action.payload.common_server_error;
      state.isDataListEnteriesLoading = false;
      state.isDataListListingLoadMore = false;
    })
    .addCase(getDataListEntryDetailsStartedAction, (state) => {
      state.isDataListEntryLoading = true;
    })
    .addCase(getDataListEntryDetailsSuccessAction, (state, action) => {
      const particularDataListEntryDetails = {
        ...action.payload,
      };

      let referenceId = null;
      let systemIdentifier = null;
      let isEditable = null;
      if (jsUtils.has(particularDataListEntryDetails, 'custom_identifier')) {
        referenceId = jsUtils.get(
          particularDataListEntryDetails,
          'custom_identifier',
        );
        delete particularDataListEntryDetails.custom_identifier;
      }
      if (jsUtils.has(particularDataListEntryDetails, 'system_identifier')) {
        systemIdentifier = jsUtils.get(
          particularDataListEntryDetails,
          'system_identifier',
        );
        delete particularDataListEntryDetails.system_identifier;
      }
      if (jsUtils.has(particularDataListEntryDetails, 'is_editable')) {
        isEditable = jsUtils.get(particularDataListEntryDetails, 'is_editable');
        delete particularDataListEntryDetails.is_editable;
      }
      state.referenceId = referenceId || state.referenceId;
      state.systemIdentifier = systemIdentifier || state.systemIdentifier;
      state.isEditable = isEditable || false;

      state.particularDataListEntryDetails = {
        ...state.particularDataListEntryDetails,
        ...particularDataListEntryDetails,
      };
      state.activeEntry = particularDataListEntryDetails.activeEntry;
      state.isDataListEntryLoading = false;
      state.common_server_error = null;
    })
    .addCase(getDataListEntryDetailsFailedAction, (state, action) => {
      state.common_server_error = action.payload.common_server_error;
      state.isDataListEntryLoading = false;
    })
    .addCase(updateActiveEntryDetails, (state, action) => {
      state.activeEntry = { ...state.activeEntry, ...action.payload };
    })
    .addCase(addDataListChangeAction, (state, action) => {
      state.particularDataListEntryDetails = {
        ...state.particularDataListEntryDetails,
        ...action.payload,
      };
    })
    .addCase(dataListDashboardDataChange, (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    })
    .addCase(submitDataListEntryStartedAction, (state) => {
      state.isDataLoading = true;
    })
    .addCase(submitDataListEntrySuccessAction, (state) => {
      state.particularDataListEntryDetails = {
        form_metadata: {},
        file_ref_uuid: [],
        addDataListFormData: {},
        unSuccessfullFileUploads: [],
        error_list: {},
        removed_doc_list: [],
        document_details: {},
      };
    })
    .addCase(clearAddDataListFormData, (state) => {
      state.particularDataListEntryDetails = {
        ...initState.particularDataListEntryDetails,
      };
      state.activeEntry = { ...initState.activeEntry };
    })
    .addCase(submitDataListEntryFailedAction, (state, action) => {
      state.isDataLoading = false;
      state.common_server_error = action.payload.common_server_error;
      state.server_error = action.payload.server_error;
    })

    // datalist dashboard
    .addCase(setDataListDashboardTabIndex, (state, action) => {
      state.dataListDashboardTabIndex = action.payload;
      state.PdTabIndex = action.payload;
    })
    .addCase(toggleAddDataListModalVisibility, (state, action) => {
      state.dataListModalVisibility = {
        isVisible: !(action.payload === 0),
        type: action.payload,
      };
      if (action.payload === 1) {
        state.isDataListEntryLoading = true;
      }
      state.viewDataListTabIndex = 1;
    })

    // view data list
    .addCase(updateSelectedDataListAction, (state, action) => {
      state.selectedDataListId = action.payload;
    })
    .addCase(setUpdatedFieldVisibilityListInDataList, (state, action) => {
      state.particularDataListEntryDetails.form_metadata.fields.form_visibility.visible_fields =
        action.payload.visibleFields || {};
      state.particularDataListEntryDetails.form_metadata.fields.form_visibility.visible_tables =
        action.payload.visibleTables || {};
      state.particularDataListEntryDetails.form_metadata.fields.form_visibility.visible_disable_fields =
        action.payload.visibleDisableFields || {};
    })
    .addCase(getDataListEntryTaskDetailsStarted, (state) => {
      state.isDataListEntryTaskPageLoading = true;
      state.isDataListEntryTaskEntriesLoading = true;
    })
    .addCase(getDataListEntryTaskDetailsSuccess, (state, action) => {
      state.allDataListEntryTaskEntries =
        action.payload.allDataListEntryTaskEntries;
      state.allDatalistEntryTasks =
        action?.payload?.allDatalistEntryTasks || [];
      state.dataListEntryTaskCount = action.payload.dataListEntryTaskCount;
      state.dataListEntryTaskDocumentUrl =
        action.payload.dataListEntryTaskDocumentUrl;
      state.isDataListEntryTaskPageLoading = false;
      state.isDataListEntryTaskEntriesLoading = false;
    })
    .addCase(getDataListEntryTaskDetailsFailed, (state, action) => {
      state.isDataListEntryTaskPageLoading = false;
      state.isDataListEntryTaskEntriesLoading = false;
      state.common_server_error = action.payload;
    })
    .addCase(setPopperVisibilityTruncateAll, (state, action) => {
      return {
        ...state,
        popperTruncateVisibility: action.payload,
      };
    })
    .addCase(setDataListModelVisibleFalse, (state) => {
      state.dataListModalVisibility.isVisible = false;
    });
});

export default dataListReducer;
