import axios from 'axios';
import { axiosPostUtils, axiosGetUtils } from '../AxiosHelper';
import {
  normalizeIsEmpty,
  getLoaderConfig,
} from '../../utils/UtilityFunctions';
import { updatePostLoader } from '../../utils/loaderUtils';
import {
  GET_ALL_FLOWS,
  GET_ALL_INITIATE_FLOWS,
  GET_FLOW_ACCESS_BY_UUID,
  INITIATE_FLOW_INSTANCE,
  GET_PUBLISHED_FLOW_DETAILS_BY_UUID,
  GET_ALL_SELF_INITIATED_FLOWS,
  GET_INSTANCE_DETAILS_BY_ID,
  GET_INSTANCE_SUMMARY_BY_ID,
  CANCEL_FLOW_INSTANCE,
  GET_ALL_WEIGHTED_SORT_FLOWS,
  GET_REPORT_DOWNLOAD_DOCS,
  GET_ALL_TRIGGER_DETAILS,
  GET_AGGREGATE_REPORT_UTILITIES_EXPORT_DATA,
  GET_SUB_FLOWS,
} from '../../urls/ApiUrls';
import {
  normalizeFlowList,
  normalizeGetAllInitiateFlows,
  normalizeGetFlowAccessByUUID,
  normalizeInitiateFlow,
  normalizeGetFlowDetailsByUUID,
  normalizeGetAllSelfInitiatedFlows,
  normalizeGetInstanceDetailsByID,
  normalizeGetInstanceSummaryByID,
  normalizeGetReportDownloadDocs,
  normalizeGetAllTriggerDetails,
  normalizeFlowListUpdate,
} from '../apiNormalizer/flow.apiNormalizer';
import { floatingActionMenuStartSectionCancel } from '../../redux/actions/FloatingActionMenuStartSection.Action';
import { axiosPostUtilsReportEngine } from '../AxiosHelperReportEngine';

const { CancelToken } = axios;
const setSource = () => CancelToken.source();

// Cancel Token Source's
let sourceGetAllInitiateFlow;
let sourceGetFlowAccessByUUID;
let sourceGetFlowDetailsByUUID;
let sourceGetInstanceDetailsByID;
let sourceGetInstanceSummaryByID;
let sourceCancelFlowInstance;
let sourceExportFlowDashboard;
let initiateFlowCancelToken;
let cancelForFlowGet;

export const getAllFlows = (params, getCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_ALL_FLOWS,
      { params },
      {
        cancelToken: new CancelToken((c) => {
          if (getCancelToken) getCancelToken(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeFlowList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const getSubFlows = (params, getCancelToken) =>
    new Promise((resolve, reject) => {
      axiosGetUtils(
        GET_SUB_FLOWS,
        { params },
        {
          cancelToken: new CancelToken((c) => {
            if (getCancelToken) getCancelToken(c);
          }),
        },
      )
        .then((response) => {
          resolve(normalizeFlowList(response));
        })
        .catch((error) => {
          reject(error);
        });
    });

export const apiGetAllInitiateFlows = (searchWithPaginationData) => {
  sourceGetAllInitiateFlow = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_INITIATE_FLOWS, {
      params: searchWithPaginationData && searchWithPaginationData,
      cancelToken: sourceGetAllInitiateFlow.token,
    })
      .then((res) => {
        const normalizeData = normalizeGetAllInitiateFlows(
          res.data.result.data,
        );
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const initiateFlow = (data) => {
  initiateFlowCancelToken = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(INITIATE_FLOW_INSTANCE, data, {
      ...getLoaderConfig,
      cancelToken: initiateFlowCancelToken.token,
    })
      .then((res) => {
        const normalizeData = normalizeInitiateFlow(res.data.result.data);
        resolve(normalizeData);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const cancelGetAllInitiateFlowAndClearState =
  (fnCancel = floatingActionMenuStartSectionCancel) =>
  (dispatch) => {
    sourceGetAllInitiateFlow &&
      sourceGetAllInitiateFlow.cancel('Canceled GetAllInitiateFlow.');
    dispatch(fnCancel());
  };

export const apiGetFlowAccessByUUID = (params) => {
  sourceGetFlowAccessByUUID = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_FLOW_ACCESS_BY_UUID, {
      params: { ...params },
      cancelToken: sourceGetFlowAccessByUUID.token,
    })
      .then((res) => {
        const normalizeData = normalizeGetFlowAccessByUUID(
          res.data.result.data,
        );
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const apiGetFlowDetailsByUUID = (params) => {
  sourceGetFlowDetailsByUUID = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_PUBLISHED_FLOW_DETAILS_BY_UUID, {
      params: { ...params },
      cancelToken: sourceGetFlowDetailsByUUID.token,
    })
      .then((res) => {
        const normalizeData = normalizeGetFlowDetailsByUUID(
          res.data.result.data,
        );
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getAllSelfInitiatedFlows = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_SELF_INITIATED_FLOWS, {
      params,
    })
      .then((res) => {
        const normalizeData = normalizeGetAllSelfInitiatedFlows(
          res.data.result.data,
        );
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const apiGetInstanceDetailsByID = (_id) => {
  sourceGetInstanceDetailsByID = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_INSTANCE_DETAILS_BY_ID, {
      params: { _id },
      cancelToken: sourceGetInstanceDetailsByID.token,
    })
      .then((res) => {
        const normalizeData = normalizeGetInstanceDetailsByID(
          res.data.result.data,
        );
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const apiGetInstanceSummaryByID = (_id) => {
  sourceGetInstanceSummaryByID = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_INSTANCE_SUMMARY_BY_ID, {
      params: { _id },
      cancelToken: sourceGetInstanceSummaryByID.token,
    })
      .then((res) => {
        const normalizeData = normalizeGetInstanceSummaryByID(
          res.data.result.data,
        );
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const apiCancelFlowInstance = (data) => {
  sourceCancelFlowInstance = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(CANCEL_FLOW_INSTANCE, data, {
      ...getLoaderConfig,
      cancelToken: sourceCancelFlowInstance.token,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const apiExportFlowDashboard = (
  query,
  uuid,
) => {
  sourceExportFlowDashboard = setSource();
  const urlExportFlowDashboard = `${GET_AGGREGATE_REPORT_UTILITIES_EXPORT_DATA}${uuid}`;
  const requestConfig = getLoaderConfig();
  return new Promise((resolve, reject) => {
    axiosPostUtilsReportEngine(urlExportFlowDashboard, query, {
      ...requestConfig,
      headers: {
        'Content-Type': 'application/json',
      },
      cancelToken: sourceExportFlowDashboard.token,
    })
      .then((res) => {
        updatePostLoader(false);
        resolve(res);
      })
      .catch((err) => {
        updatePostLoader(false);
        reject(err);
      });
  });
};

export const getAllWeightedSortFlows = (params) => {
  if (cancelForFlowGet) cancelForFlowGet();

  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_WEIGHTED_SORT_FLOWS, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelForFlowGet = c;
      }),
    })
      .then((response) => {
        resolve(normalizeFlowListUpdate(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const apiGetReportDownloadDocs = () => {
  sourceGetInstanceDetailsByID = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_REPORT_DOWNLOAD_DOCS)
      .then((res) => {
        const normalizeData = normalizeGetReportDownloadDocs(
          res.data.result.data,
        );
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const apiGetAllTriggerDetails = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_ALL_TRIGGER_DETAILS,
      { params },
      {
        ...getLoaderConfig(),
      },
    )
      .then((response) => {
        resolve(normalizeGetAllTriggerDetails(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
