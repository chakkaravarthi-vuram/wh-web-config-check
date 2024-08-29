import axios from 'axios';
import {
  axiosGetUtilsReportEngine,
  axiosPostUtilsReportEngine,
} from '../AxiosHelperReportEngine';
import { normalizeIsEmpty } from '../../utils/UtilityFunctions';
import {
  GET_ALL_REPORT_METADATA,
  GET_ALL_REPORTS,
  GET_DATALIST_FILTERS,
  GET_DATALIST_VALUES,
  GET_FLOW_FILTERS,
  GET_FLOW_VALUES,
} from '../../urls/ApiUrls';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const { CancelToken } = axios;

// Flow Filter Call API
let cancelFlowFilters;
const getCancelTokenForFlowFilters = (cancelToken) => {
  cancelFlowFilters = cancelToken;
};
export const cancelApiGetFlowFilters = () => {
  if (cancelFlowFilters) cancelFlowFilters();
};
export const apiGetFlowFilters = (uuid, cancelToken = {}) => {
  if (cancelToken?.cancelToken) cancelToken.cancelToken();
  return new Promise((resolve, reject) => {
    axiosGetUtilsReportEngine(`${GET_FLOW_FILTERS}${uuid}?is_test_bed=0`, {
      cancelToken: new CancelToken((c) => {
        if (cancelToken?.setCancelToken) {
          cancelToken.setCancelToken(c);
        } else getCancelTokenForFlowFilters(c);
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        normalizeIsEmpty(res.data.result.data, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Flow Values Call API

let cancelFlowValues;
const getCancelTokenForFlowValues = (cancelToken) => {
  cancelFlowValues = cancelToken;
};
export const cancelApiGetFlowValues = () => {
  if (cancelFlowValues) cancelFlowValues();
};
export const apiGetFlowValues = (uuid, data, searchText = EMPTY_STRING, cancelToken = null) => {
  if (cancelToken) {
    if (cancelToken.cancelToken) cancelToken.cancelToken();
  } else {
    cancelApiGetFlowValues();
  }

  const urlStandard = searchText
    ? `${GET_FLOW_VALUES}${uuid}?search=${searchText}?is_test_bed=0`
    : `${GET_FLOW_VALUES}${uuid}?is_test_bed=0`;
  return new Promise((resolve, reject) => {
    axiosPostUtilsReportEngine(urlStandard, data, {
      cancelToken: new CancelToken((c) => {
        if (cancelToken) {
          cancelToken.setCancelToken(c);
        } else getCancelTokenForFlowValues(c);
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.data.success) resolve(res.data.result.data);
        else reject(res.data.result.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

let cancelTokenForGetAllReports = null;
export const getAllReports = (param) => {
  cancelTokenForGetAllReports && cancelTokenForGetAllReports();
  const searchParam = new URLSearchParams(param).toString();
  return new Promise((resolve, reject) => {
     axiosGetUtilsReportEngine(`${GET_ALL_REPORTS}?${searchParam}`, {
      cancelToken: new CancelToken((c) => {
        cancelTokenForGetAllReports = c;
      }),
     })
     .then((response) => {
        if (response?.data?.success) resolve(response?.data?.result?.data);
        else reject(response.data.result.data);
     })
     .catch((error) => reject(error));
    });
  };

// Datalist Filter Call API
let cancelDatalistFilters;
const getCancelTokenForDatalistFilters = (cancelToken) => {
  cancelDatalistFilters = cancelToken;
};
export const cancelApiGetDatalistFilters = () => {
  if (cancelDatalistFilters) cancelDatalistFilters();
};
export const apiGetDatalistFilters = (uuid) => {
  cancelApiGetFlowFilters();
  return new Promise((resolve, reject) => {
    axiosGetUtilsReportEngine(`${GET_DATALIST_FILTERS}${uuid}`, {
      cancelToken: new CancelToken((c) => {
        getCancelTokenForDatalistFilters(c);
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        normalizeIsEmpty(res.data.result.data, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

let cancelDatalistValues;
const getCancelTokenForDatalistValues = (cancelToken) => {
  cancelDatalistValues = cancelToken;
};
export const cancelApiGetDatalistValues = () => {
  if (cancelDatalistValues) cancelDatalistValues();
};
export const apiGetDatalistValues = (uuid, data, searchText = EMPTY_STRING, cancelToken = {}) => {
  if (cancelToken?.cancelToken) cancelToken.cancelToken();
  cancelApiGetDatalistValues();
  const urlStandard = searchText
    ? `${GET_DATALIST_VALUES}${uuid}?search=${searchText}`
    : `${GET_DATALIST_VALUES}${uuid}`;
  return new Promise((resolve, reject) => {
    axiosPostUtilsReportEngine(urlStandard, data, {
      cancelToken: new CancelToken((c) => {
          if (cancelToken?.setCancelToken) {
            cancelToken.setCancelToken(c);
          } else getCancelTokenForDatalistValues(c);
        }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.data.success) resolve(res.data.result.data);
        else reject(res.data.result.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Reports Lists

let cancelAllReportsApi;
const getCancelTokenForGetAllReportsApi = (cancelToken) => {
  cancelAllReportsApi = cancelToken;
};
export const cancelGetAllReportsApi = () => {
  if (cancelAllReportsApi) cancelAllReportsApi();
};
export const getAllReportsApi = (params) => {
  cancelGetAllReportsApi();
  return new Promise((resolve, reject) => {
    axiosGetUtilsReportEngine(GET_ALL_REPORT_METADATA, {
      params,
      cancelToken: new CancelToken((c) => {
        getCancelTokenForGetAllReportsApi(c);
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        normalizeIsEmpty(res.data.result.data, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
