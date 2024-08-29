import axios from 'axios';
import { has } from 'utils/jsUtility';
import {
  UPDATE_ADMIN_ACCOUNT,
  DELETE_ADMIN_ACCOUNT,
  SAVE_ADMIN_ACCOUNT,
  GET_ADMIN_ACCOUNT,
  GET_ADMIN_ACCOUNT_DETAILS,
  GET_ADMIN_ACCOUNT_USAGE_SUMMARY,
  GET_ACTIVE_USER_COUNT_REPORT,
  GET_SESSION_COUNT_REPORT,
  GET_ACTIONS_PER_SESSION_REPORT,
  GET_RETENTION_RATE_REPORT,
} from '../../urls/ApiUrls';
import {
  normalizeEditAdminAccount,
  normalizeDeleteAdminAccount,
  normalizeGetAdminAccountApiResponse,
  normalizeGetAdminAccountDetailsApiResponse,
  normalizeGetUsageSummaryApiResponse,
  normalizeAdminAccountSummaryChartReport,
} from '../apiNormalizer/adminAccounts.apiNormalizer';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import { getLoaderConfig } from '../../utils/UtilityFunctions';

const { CancelToken } = axios;

export const addNewAdminAccountApiService = (postData) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_ADMIN_ACCOUNT, postData, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizeEditAdminAccount(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
let cancelTokenForGetAccounts;
export const getAdminAccountApiService = (params, cancelToken) =>
  new Promise((resolve, reject) => {
    if (cancelToken) cancelToken();
    else if (cancelTokenForGetAccounts) cancelTokenForGetAccounts();
    axiosGetUtils(GET_ADMIN_ACCOUNT, {
      ...getLoaderConfig(),
      params,
      cancelToken: new CancelToken((c) => {
        if (cancelToken) cancelToken = c;
        else cancelTokenForGetAccounts = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetAdminAccountApiResponse(response));
      })
      .catch((error) => {
        if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
        reject(error);
      });
  });

export const updateAdminAccount = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_ADMIN_ACCOUNT, data)
      .then((response) => {
        resolve(normalizeEditAdminAccount(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteAdminAccount = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_ADMIN_ACCOUNT, data)
      .then((response) => {
        resolve(normalizeDeleteAdminAccount(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
let cancelTokenForAccountDetails;
export const getAdminAccountDetailsApiService = (params) =>
  new Promise((resolve, reject) => {
    if (cancelTokenForAccountDetails) cancelTokenForAccountDetails();
    axiosGetUtils(GET_ADMIN_ACCOUNT_DETAILS, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelTokenForAccountDetails = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetAdminAccountDetailsApiResponse(response));
      })
      .catch((error) => {
        if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
        reject(error);
      });
  });
let cancelTokenForUsageSummary;
export const getUsageSummaryApiService = (params) =>
  new Promise((resolve, reject) => {
    if (cancelTokenForUsageSummary) cancelTokenForUsageSummary();
    axiosGetUtils(GET_ADMIN_ACCOUNT_USAGE_SUMMARY, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelTokenForUsageSummary = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetUsageSummaryApiResponse(response));
      })
      .catch((error) => {
        if (has(error, ['code'], false) && error.code === 'ERR_CANCELED') return;
        reject(error);
      });
  });

// Admin Account Summary - API
const adminAccountMLTimeOut = 1000 * 90; // 90 seconds
let cancelTokenForSummaryPerSession;
export const getAdminAccountSummaryActionPerSessionApiService = (params) =>
  new Promise((resolve, reject) => {
    if (cancelTokenForSummaryPerSession) cancelTokenForSummaryPerSession();
    axiosGetUtils(GET_ACTIONS_PER_SESSION_REPORT, {
      timeout: adminAccountMLTimeOut,
      params,
      cancelToken: new CancelToken((c) => {
        cancelTokenForSummaryPerSession = c;
      }),
    })
      .then((response) => {
        resolve(normalizeAdminAccountSummaryChartReport(response));
      })
      .catch((error) => {
        if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
        reject(error);
      });
  });
let cancelTokenForChartReport;
export const getAdminAccountSummarySessionCountApiService = (params) =>
  new Promise((resolve, reject) => {
    if (cancelTokenForChartReport) cancelTokenForChartReport();
    axiosGetUtils(GET_SESSION_COUNT_REPORT, {
      timeout: adminAccountMLTimeOut,
      params,
      cancelToken: new CancelToken((c) => {
        cancelTokenForChartReport = c;
      }),
    })
      .then((response) => {
        resolve(normalizeAdminAccountSummaryChartReport(response));
      })
      .catch((error) => {
        if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
        reject(error);
      });
  });
let cancelTokenForUserCount;
export const getAdminAccountSummaryActiveUserCountApiService = (params) =>
  new Promise((resolve, reject) => {
    if (cancelTokenForUserCount) cancelTokenForUserCount();
    axiosGetUtils(GET_ACTIVE_USER_COUNT_REPORT, {
      timeout: adminAccountMLTimeOut,
      params,
      cancelToken: new CancelToken((c) => {
        cancelTokenForUserCount = c;
      }),
    })
      .then((response) => {
        resolve(normalizeAdminAccountSummaryChartReport(response));
      })
      .catch((error) => {
        if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
        reject(error);
      });
  });
let cancelTokenForRetentionRate;
export const getAdminAccountSummaryRetentionRateApiService = () =>
  new Promise((resolve, reject) => {
    if (cancelTokenForRetentionRate) cancelTokenForRetentionRate();
    axiosGetUtils(GET_RETENTION_RATE_REPORT, {
      timeout: adminAccountMLTimeOut,
      cancelToken: new CancelToken((c) => {
        cancelTokenForRetentionRate = c;
      }),
    })
      .then((response) => {
        resolve(normalizeAdminAccountSummaryChartReport(response));
      })
      .catch((error) => {
        if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
        reject(error);
      });
  });
