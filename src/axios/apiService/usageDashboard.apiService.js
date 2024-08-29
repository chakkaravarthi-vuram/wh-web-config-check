import { axiosGetUtilsReportEngine } from '../AxiosHelperReportEngine';
import {
  MOST_USED_FLOW_LIST,
  TASK_FLOW_LIST,
  USER_TASK_FLOW_LIST,
  STATIC_METRICS,
  USERS_SUMMARY_METRICS,
} from '../../urls/ApiUrls';
import {
  normalizeFlowList,
  normalizeTaskFlowList,
  normalizeUserTaskList,
  normalizeUsersData,
  normalizeUsageSummary,
} from '../apiNormalizer/usageDashboard.apiNormalizer';

export const getUsageSummary = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtilsReportEngine(STATIC_METRICS, {
      params,
      // cancelToken: new CancelToken((c) => {
      //   cancelForFlowList = c;
      // }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        resolve(normalizeUsageSummary(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const getUsersSummary = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtilsReportEngine(USERS_SUMMARY_METRICS, {
      params,
      // cancelToken: new CancelToken((c) => {
      //   cancelForFlowList = c;
      // }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        resolve(normalizeUsersData(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getFlowList = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtilsReportEngine(MOST_USED_FLOW_LIST, {
      params,
      // cancelToken: new CancelToken((c) => {
      //   cancelForFlowList = c;
      // }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        resolve(normalizeFlowList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getTaskFlowList = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtilsReportEngine(TASK_FLOW_LIST, {
      params,
      // cancelToken: new CancelToken((c) => {
      //   cancelForFlowList = c;
      // }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        resolve(normalizeTaskFlowList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getUserTaskList = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtilsReportEngine(USER_TASK_FLOW_LIST, {
      params,
      // cancelToken: new CancelToken((c) => {
      //   cancelForFlowList = c;
      // }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        resolve(normalizeUserTaskList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
