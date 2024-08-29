import { FLOW_DASHBOARD } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { SORT_VALUE } from '../../utils/Constants';
import {
  FILTER,
  PD_TAB,
  PD_VIEW,
} from '../../containers/flow/flow_dashboard/FlowDashboard.string';

export const defaultPaginationDetails = [
  {
    total_count: 0,
    page: 1,
  },
];

export const initialState = {
  displayReportEdit: false,
  pdTabIndex: PD_TAB().ALL.TAB_INDEX,
  pdViewIndex: PD_VIEW().TABLES.TAB_INDEX,
  shortcutDateFilterData: {
    startDate: EMPTY_STRING,
    endDate: EMPTY_STRING,
  },
  filterStartDate: EMPTY_STRING,
  filterEndDate: EMPTY_STRING,
  initialDateOperator: 'BETWEEN_DATES',
  shortcutFilterErrors: {},
  allShortcutFilters: [],
  selectedShortcutUsers: [],
  selectedShortcutNames: [],
  appliedFilterCount: 0,
  innerFilterCount: 0,
  shortcutFilterDateOperator: 'BETWEEN_DATES',
  referenceId: null,
  isShowChartButton: true,
  isShowTableButton: true,
  flow_color: EMPTY_STRING,
  preMountLoading: true,
  isLoading: false,
  flow_name: EMPTY_STRING,
  flow_short_code: EMPTY_STRING,
  flow_description: EMPTY_STRING,
  document_url_details: null,
  shortcutsList: [],
  totalShortcutsCount: 0,
  isShortcutsLoading: true,
  isShortcutsUsersLoading: true,
  userDocumentDetails: [],
  shortcutUserDetails: [],
  shortcutUserPaginationDetails: [],
  shortcutUserTotalCount: 0,
  isLoadingShorcuts: true,
  shortcutSearchValue: EMPTY_STRING,
  categoryData: {
    categoryCurrentPage: 1,
    categoryCountPercall: 5,
    categoryTotalCount: 1,
    categoryList: [],
    newCategoryValue: '',
    categoryValueError: '',
  },
  owners: {
    teams: null,
    users: null,
  },
  admins: {
    teams: null,
    users: null,
  },
  canReassign: false,
  reassignModal: {
    error_list: {},
  },
  reassignTaskDetails: {
    reassignedUsers: {
      teams: [],
      users: [],
    },
    member_team_search_value: EMPTY_STRING,
  },
  published_by: {
    first_name: EMPTY_STRING,
    last_name: EMPTY_STRING,
  },
  published_on: {
    pref_datetime_display: EMPTY_STRING,
  },
  common_server_error: {},
  isTestBed: false,
  custom_identifier: {},
  entryTablePopupVisibility: {
    isVisible: false,
    id: null,
  },
  isAdhocTaskModalVisible: false,
  lstPaginationData: {
    pagination_details: [{ total_count: 0, page: 1, size: 5 }],
    pagination_data: [],
    document_url_details: null,
  },
  searchText: EMPTY_STRING,
  sort_field: EMPTY_STRING,
  sortIndex: SORT_VALUE.ASCENDING,
  show_initiate: false,
  show_view: false,
  show_edit: false,
  document_url: EMPTY_STRING,
  filter: {
    order: {},
    headerDimension: [],
    tab_index: FILTER().SYSTEM_DATA.TAB_INDEX,
    isFilter: false,
    selectedFilterData: EMPTY_STRING,
    flowInstanceId: EMPTY_STRING,
    isFlowId: false,
    sql_property: EMPTY_STRING,

    isAppliedFlowId: false,
    statusList: [],
    isAppliedStatusList: false,
    stepOrderList: [],
    isAppliedOrderList: false,

    inputFieldDetailsForFilter: [],
    selectedFieldDetailsFromFilter: [],
    displayDimensions: [],
    system_dimensions: [],
    metric_dimensions: [],
    downloadInputField: [],
    download_select_all: [{ label: 'Select all', value: 0 }],
    download_is_open: false,
  },
  isDashboardFilterLoading: false,
  search: {
    _id: EMPTY_STRING,
    report_uuid: EMPTY_STRING,
    is_new_report: false,
    search_name: EMPTY_STRING,
    search_description: EMPTY_STRING,
    error_list: {},
  },
  instance: {
    isOpenInstance: false,
    _id: null,
    flow_uuid: null,
    cancel: {
      isShow: false,
      cancel_reason: EMPTY_STRING,
      err_reason: EMPTY_STRING,
    },
  },
  isOpenInstance: false,
  instanceId: EMPTY_STRING,
  flow_uuid: EMPTY_STRING,
  flow_id: EMPTY_STRING,
  isInstanceSummaryLoading: true,
  instanceSummary: {},
  instanceSummaryError: null,
  isInstanceDetailsLoading: false,
  instanceDetails: {
    initiated_on: { utc_tz_datetime: EMPTY_STRING },
    initiated_by: { first_name: EMPTY_STRING, last_name: EMPTY_STRING },
  },
  instanceData: {},
  isInstanceDataLoading: false,
  isInstanceBodyDataLoading: false,
  FlowAccess: true,
  searchValue: EMPTY_STRING,
  isReportLoading: false,
  isSaveReportSuccess: false,
  currentReportData: {},
  isCurrentReportLoading: false,
  currentReportCharts: {},
  isAdminOwnerViewer: true,
};

export default function FlowDashboardReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FLOW_DASHBOARD.STARTED: {
      return {
        ...state,
        isLoading: true,
        common_server_error: {},
      };
    }
    case FLOW_DASHBOARD.ACCESS_BY_UUID_SUCCESS: {
      return {
        ...state,
        ...action.payload.AccessFlows,
      };
    }
    case FLOW_DASHBOARD.FAILURE: {
      return {
        ...state,
        preMountLoading: false,
        isLoading: false,
        isInstanceDetailsLoading: false,
        isInstanceSummaryLoading: false,
        isInstanceBodyDataLoading: false,
        isDashboardFilterLoading: false,
        common_server_error: action.payload,
      };
    }
    case FLOW_DASHBOARD.DATA_CHANGE: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}
