import { createAction, createReducer } from '@reduxjs/toolkit';
import { headers } from 'containers/admin_panel/admin_pages/accounts/Accounts.strings';
import ADMIN_ACCOUNTS_SUMMARY_STRINGS from 'containers/admin_panel/admin_pages/accounts_summary/AccountsSummary.strings';
import {
  ADMIN_ACCOUNT_LIST,
  ADMIN_ACCOUNT_DETAILS,
  ADMIN_ACCOUNT_SUMMARY,
  ADMIN_ACCOUNT_SUMMARY_ACTION_PER_SESSION,
  ADMIN_ACCOUNT_SUMMARY_SESSION_COUNT,
  ADMIN_ACCOUNT_SUMMARY_ACTIVE_USER_COUNT,
  ADMIN_ACCOUNT_SUMMARY_RETENTION_RATE,
} from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const adminAccountApiStarted = createAction(ADMIN_ACCOUNT_LIST.STARTED);

export const adminAccountApiFailure = createAction(
  ADMIN_ACCOUNT_LIST.FAILURE,
  (error) => {
    return {
      payload: error,
    };
  },
);

export const adminAccountApiSuccess = createAction(
  ADMIN_ACCOUNT_LIST.SUCCESS,
  (adminAccountData) => {
    return {
      payload: { ...adminAccountData },
    };
  },
);

export const addAdminAccountDetails = createAction(
  ADMIN_ACCOUNT_LIST.ADD,
  (adminData) => {
    return {
      payload: adminData,
    };
  },
);

export const openOrCloseModal = createAction(
  ADMIN_ACCOUNT_LIST.TOGGLE_VISIBLE,
  (value) => {
    return {
      payload: value,
    };
  },
);

export const adminAccountDataChange = createAction(
  ADMIN_ACCOUNT_LIST.DATA_CHANGE,
  (id, value) => {
    return {
      payload: {
        id,
        value,
      },
    };
  },
);

export const modalAdminAccountDataClear = createAction(
  ADMIN_ACCOUNT_LIST.CLEAR,
);

export const paginateAdminAccount = createAction(
  ADMIN_ACCOUNT_LIST.PAGE_DETAILS,
  (paginate) => {
    return {
      payload: paginate,
    };
  },
);

export const validCheck = createAction(ADMIN_ACCOUNT_LIST.UPDATE, (valid) => {
  return {
    payload: valid,
  };
});

export const adminAccountPageLoad = createAction(ADMIN_ACCOUNT_LIST.PAGE_LOAD);

export const adminAccountClearData = createAction(
  ADMIN_ACCOUNT_LIST.CLEAR_DATA,
);

export const changeAdminAccountRowsPerPage = createAction(
  ADMIN_ACCOUNT_LIST.ROW_CHANGE,
  (value) => {
    return {
      payload: value,
    };
  },
);

export const adminAccountSearchValueChange = createAction(
  ADMIN_ACCOUNT_LIST.ACCOUNT_SEARCH_VALUE_CHANGE,
  (searchValue) => {
    return {
      payload: searchValue,
    };
  },
);

// account details
export const accountDetailsAPIStarted = createAction(
  ADMIN_ACCOUNT_DETAILS.STARTED,
);
export const usageSummaryAPIStarted = createAction(
  ADMIN_ACCOUNT_DETAILS.USAGE_SUMMARY_STARTED,
);

export const accountDetailsAPIFailure = createAction(
  ADMIN_ACCOUNT_DETAILS.FAILURE,
  (error) => {
    return {
      payload: error,
    };
  },
);
export const usageSummaryAPIFailure = createAction(
  ADMIN_ACCOUNT_DETAILS.USAGE_SUMMARY_FAILURE,
  (error) => {
    return {
      payload: error,
    };
  },
);

export const accountDetailsAPISuccess = createAction(
  ADMIN_ACCOUNT_DETAILS.SUCCESS,
  (adminAccountData) => {
    return {
      payload: { ...adminAccountData },
    };
  },
);
export const usageSummaryAPISuccess = createAction(
  ADMIN_ACCOUNT_DETAILS.USAGE_SUMMARY_SUCCESS,
  (usageSummaryData) => {
    return {
      payload: { ...usageSummaryData },
    };
  },
);

export const setAccountCustomizedDetails = createAction(
  ADMIN_ACCOUNT_DETAILS.ACCOUNT_CUSTOMISED_DATA,
  (adminAccountData) => {
    return {
      payload: { ...adminAccountData },
    };
  },
);

export const accountDetailsDataClear = createAction(
  ADMIN_ACCOUNT_DETAILS.CLEAR,
);
export const usageSummaryDataClear = createAction(
  ADMIN_ACCOUNT_DETAILS.USAGE_SUMMARY_CLEAR,
);

// Admin Account Summary
export const adminAccountSummaryDataChange = createAction(
  ADMIN_ACCOUNT_SUMMARY.DATA_CHANGE,
  (adminAccountSummaryData) => {
    return {
      payload: { ...adminAccountSummaryData },
    };
  },
);
export const adminAccountSummaryActionPerSessionApiStarted = createAction(
  ADMIN_ACCOUNT_SUMMARY_ACTION_PER_SESSION.STARTED,
);
export const adminAccountSummaryActionPerSessionApiStop = createAction(
  ADMIN_ACCOUNT_SUMMARY_ACTION_PER_SESSION.STOP,
);
export const adminAccountSummaryActionPerSessionDataChange = createAction(
  ADMIN_ACCOUNT_SUMMARY_ACTION_PER_SESSION.DATA_CHANGE,
  (actionPerSession) => {
    return {
      payload: { ...actionPerSession },
    };
  },
);
export const adminAccountSummarySessionCountApiStarted = createAction(
  ADMIN_ACCOUNT_SUMMARY_SESSION_COUNT.STARTED,
);
export const adminAccountSummarySessionCountApiStop = createAction(
  ADMIN_ACCOUNT_SUMMARY_SESSION_COUNT.STOP,
);
export const adminAccountSummarySessionCountDataChange = createAction(
  ADMIN_ACCOUNT_SUMMARY_SESSION_COUNT.DATA_CHANGE,
  (SessionCount) => {
    return {
      payload: { ...SessionCount },
    };
  },
);
export const adminAccountSummaryActiveUserCountApiStarted = createAction(
  ADMIN_ACCOUNT_SUMMARY_ACTIVE_USER_COUNT.STARTED,
);
export const adminAccountSummaryActiveUserCountApiStop = createAction(
  ADMIN_ACCOUNT_SUMMARY_ACTIVE_USER_COUNT.STOP,
);
export const adminAccountSummaryActiveUserCountDataChange = createAction(
  ADMIN_ACCOUNT_SUMMARY_ACTIVE_USER_COUNT.DATA_CHANGE,
  (activeUserCount) => {
    return {
      payload: { ...activeUserCount },
    };
  },
);
export const adminAccountSummaryRetentionRateApiStarted = createAction(
  ADMIN_ACCOUNT_SUMMARY_RETENTION_RATE.STARTED,
);
export const adminAccountSummaryRetentionRateApiStop = createAction(
  ADMIN_ACCOUNT_SUMMARY_RETENTION_RATE.STOP,
);
export const adminAccountSummaryRetentionRateDataChange = createAction(
  ADMIN_ACCOUNT_SUMMARY_RETENTION_RATE.DATA_CHANGE,
  (retentionRate) => {
    return {
      payload: { ...retentionRate },
    };
  },
);
export const adminAccountSummaryClear = createAction(
  ADMIN_ACCOUNT_SUMMARY.CLEAR,
);
// Admin Account Summary -> End.

const ADMIN_DETAILS_STATE = {
  isAccountDetailsLoading: false,
  isAccountCustomisedDetailsLoading: true,
  eachAccountDetails: null,
  eachAccountCustomisedDetails: {},
  details_server_error: {},
  isUsageSummaryLoading: false,
  usageSummaryPaginationData: [],
  usageSummaryPaginationDetails: [],
  usageSummaryCurrentPage: 1,
  usageSummaryDataCountPerPage: 5,
  usageSummaryTotalCount: 0,
  usageSummaryErrorList: {},
};

const defaultGranularityOptionValue =
  ADMIN_ACCOUNTS_SUMMARY_STRINGS.GRANULARITY.OPTION_LIST()[0].value;

const ADMIN_ACCOUNT_SUMMARY_STATE = {
  adminAccountSummary: {
    actionPerSession: {
      isActionPerSessionLoading: false,
      ddActionPerSessionGranularity: defaultGranularityOptionValue,
      labelsActionPerSession: [],
      dataActionPerSession: [],
      startDateActionPerSession: EMPTY_STRING,
      endDateActionPerSession: EMPTY_STRING,
    },
    sessionCount: {
      isSessionCountLoading: false,
      ddSessionCountGranularity: defaultGranularityOptionValue,
      labelsSessionCount: [],
      dataSessionCount: [],
      startDateSessionCount: EMPTY_STRING,
      endDateSessionCount: EMPTY_STRING,
    },
    activeUserCount: {
      isActiveUserCountLoading: false,
      ddActiveUserCountGranularity: defaultGranularityOptionValue,
      labelsActiveUserCount: [],
      dataActiveUserCount: [],
      startDateActiveUserCount: EMPTY_STRING,
      endDateActiveUserCount: EMPTY_STRING,
    },
    retentionRate: {
      isRetentionRateLoading: false,
      labelsRetentionRate: [],
      dataRetentionRate: [],
    },
  },
};

const initialState = {
  isAdminAccountListLoading: true,
  server_error: {},
  account_details: {
    account_id: EMPTY_STRING,
    account_name: EMPTY_STRING,
    account_domain: EMPTY_STRING,
    account_first_name: EMPTY_STRING,
    account_last_name: EMPTY_STRING,
    account_username: EMPTY_STRING,
    account_email: EMPTY_STRING,
    role_in_company: EMPTY_STRING,
    account_manager: EMPTY_STRING,
    solution_consultant: EMPTY_STRING,
    account_industry: [],
    account_language: EMPTY_STRING,
    account_country: EMPTY_STRING,
    account_locale: [],
    account_timezone: EMPTY_STRING,
    acc_logo_pic_id: EMPTY_STRING,
    acc_logo: EMPTY_STRING,
    acc_initial_logo: EMPTY_STRING,
    document_details: null,
    primary_locale: EMPTY_STRING,
    is_copilot_enabled: false,
  },
  industry_list: [],
  country_list: [],
  isAdminAccountModalOpen: false,
  adminAccountId: EMPTY_STRING,
  adminAccountCurrentPage: 1,
  adminAccountDataCountPerPage: 10,
  adminAccountTotalCount: 0,
  adminAccountErrorList: {},
  isPaginationLoading: true,
  accountSearchValue: EMPTY_STRING,
  accountTableHeaders: headers,

  // account details
  ...ADMIN_DETAILS_STATE,

  // Account Summary
  ...ADMIN_ACCOUNT_SUMMARY_STATE,
};

const AdminAccountsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(adminAccountApiStarted, (state) => {
      return {
        ...state,
        isAdminAccountListLoading: true,
      };
    })
    .addCase(adminAccountApiFailure, (state, action) => {
      return {
        ...state,
        isAdminAccountListLoading: false,
        common_server_error: action.payload.common_server_error,
        server_error: action.payload.common_server_error,
      };
    })
    .addCase(adminAccountApiSuccess, (state, action) => {
      return {
        ...state,
        ...action.payload,
        isAdminAccountListLoading: false,
        common_server_error: null,
        adminAccountTotalCount:
          action.payload.pagination_details[0].total_count,
        adminAccountCurrentPage: action.payload.pagination_details[0].page,
      };
    })
    .addCase(addAdminAccountDetails, (state, action) => {
      return {
        ...state,
        account_details: { ...action.payload },
      };
    })
    .addCase(openOrCloseModal, (state, action) => {
      return {
        ...state,
        isAdminAccountModalOpen: action.payload,
      };
    })
    .addCase(adminAccountDataChange, (state, action) => {
      return {
        ...state,
        [action.payload.id]: action.payload.value,
      };
    })
    .addCase(modalAdminAccountDataClear, (state) => {
      return {
        ...state,
        account_details: initialState.account_details,
        adminAccountErrorList: {},
      };
    })
    .addCase(paginateAdminAccount, (state, action) => {
      return {
        ...state,
        adminAccountCurrentPage: action.payload.pagination_details[0].page,
        adminAccountTotalCount:
          action.payload.pagination_details[0].total_count,
      };
    })
    .addCase(validCheck, (state, action) => {
      return {
        ...state,
        adminAccountErrorList: action.payload,
      };
    })
    .addCase(adminAccountPageLoad, (state) => {
      return {
        ...state,
        isAdminAccountListLoading: false,
      };
    })
    .addCase(adminAccountClearData, () => {
      return {
        ...initialState,
      };
    })
    .addCase(changeAdminAccountRowsPerPage, (state, action) => {
      return {
        ...state,
        adminAccountDataCountPerPage: action.payload,
      };
    })
    .addCase(adminAccountSearchValueChange, (state, action) => {
      return {
        ...state,
        accountSearchValue: action.payload,
      };
    })
    .addCase(accountDetailsAPIStarted, (state) => {
      return {
        ...state,
        isAccountDetailsLoading: true,
      };
    })
    .addCase(usageSummaryAPIStarted, (state) => {
      return {
        ...state,
        isUsageSummaryLoading: true,
      };
    })
    .addCase(accountDetailsAPIFailure, (state, action) => {
      return {
        ...state,
        isAccountDetailsLoading: false,
        eachAccountDetails: null,
        details_server_error: action.payload.common_server_error,
      };
    })
    .addCase(usageSummaryAPIFailure, (state, action) => {
      return {
        ...state,
        isUsageSummaryLoading: false,
        usageSummaryPaginationData: null,
        usageSummaryPaginationDetails: null,
        usageSummaryErrorList: action.payload.common_server_error,
      };
    })
    .addCase(accountDetailsAPISuccess, (state, action) => {
      return {
        ...state,
        eachAccountDetails: { ...action.payload },
        isAccountDetailsLoading: false,
        common_server_error: null,
      };
    })
    .addCase(usageSummaryAPISuccess, (state, action) => {
      return {
        ...state,
        usageSummaryPaginationData: action.payload.pagination_data,
        usageSummaryPaginationDetails: action.payload.pagination_details,
        isUsageSummaryLoading: false,
        usageSummaryErrorList: null,
        usageSummaryTotalCount:
          action.payload.pagination_details[0].total_count,
        usageSummaryCurrentPage: action.payload.pagination_details[0].page,
      };
    })
    .addCase(setAccountCustomizedDetails, (state, action) => {
      return {
        ...state,
        eachAccountCustomisedDetails: { ...action.payload },
        isAccountDetailsLoading: false,
        isAccountCustomisedDetailsLoading: false,
        common_server_error: null,
      };
    })
    .addCase(accountDetailsDataClear, (state) => {
      return {
        ...state,
        ...ADMIN_DETAILS_STATE,
      };
    })
    .addCase(adminAccountSummaryDataChange, (state, action) => {
      return {
        ...state,
        adminAccountSummary: { ...action.payload },
      };
    })
    .addCase(adminAccountSummaryClear, (state) => {
      return {
        ...state,
        ...ADMIN_ACCOUNT_SUMMARY_STATE,
      };
    })
    .addCase(adminAccountSummaryActionPerSessionApiStarted, (state) => {
      state.adminAccountSummary.actionPerSession.isActionPerSessionLoading = true;
    })
    .addCase(adminAccountSummaryActionPerSessionApiStop, (state) => {
      state.adminAccountSummary.actionPerSession.isActionPerSessionLoading = false;
    })
    .addCase(adminAccountSummaryActionPerSessionDataChange, (state, action) => {
      state.adminAccountSummary.actionPerSession = { ...action.payload };
    })
    .addCase(adminAccountSummarySessionCountApiStarted, (state) => {
      state.adminAccountSummary.sessionCount.isSessionCountLoading = true;
    })
    .addCase(adminAccountSummarySessionCountApiStop, (state) => {
      state.adminAccountSummary.sessionCount.isSessionCountLoading = false;
    })
    .addCase(adminAccountSummarySessionCountDataChange, (state, action) => {
      state.adminAccountSummary.sessionCount = { ...action.payload };
    })
    .addCase(adminAccountSummaryActiveUserCountApiStarted, (state) => {
      state.adminAccountSummary.activeUserCount.isActiveUserCountLoading = true;
    })
    .addCase(adminAccountSummaryActiveUserCountApiStop, (state) => {
      state.adminAccountSummary.activeUserCount.isActiveUserCountLoading = false;
    })
    .addCase(adminAccountSummaryActiveUserCountDataChange, (state, action) => {
      state.adminAccountSummary.activeUserCount = { ...action.payload };
    })
    .addCase(adminAccountSummaryRetentionRateApiStarted, (state) => {
      state.adminAccountSummary.retentionRate.isRetentionRateLoading = true;
    })
    .addCase(adminAccountSummaryRetentionRateApiStop, (state) => {
      state.adminAccountSummary.retentionRate.isRetentionRateLoading = false;
    })
    .addCase(adminAccountSummaryRetentionRateDataChange, (state, action) => {
      state.adminAccountSummary.retentionRate = { ...action.payload };
    });
});

export default AdminAccountsReducer;
