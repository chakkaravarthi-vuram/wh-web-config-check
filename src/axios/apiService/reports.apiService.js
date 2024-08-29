import {
  GET_REPORT_METADATA_BY_UUID,
  PUBLISH_REPORT,
  DELETE_REPORT_METADATA,
  GET_DATALIST_FILTERS,
  GET_FLOW_FILTERS,
  GET_CROSS_FILTERS,
  GET_DATALIST_VALUES,
  GET_FLOW_VALUES,
  GET_CROSS_VALUES,
} from '../../urls/ApiUrls';
import {
  axiosGetUtilsReportEngine,
  axiosPostUtilsReportEngine,
} from '../AxiosHelperReportEngine';

let reportsCancelToken;

const cancelReportApi = () => reportsCancelToken?.();

export const publishReportApi = (data) => {
  cancelReportApi();
  return new Promise((resolve, reject) => {
    axiosPostUtilsReportEngine(PUBLISH_REPORT, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getReportByUUIDApi = (uuid) =>
  new Promise((resolve, reject) => {
    axiosGetUtilsReportEngine(`${GET_REPORT_METADATA_BY_UUID}/${uuid}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteReportByIdApi = (id) =>
  new Promise((resolve, reject) => {
    axiosGetUtilsReportEngine(`${DELETE_REPORT_METADATA}/${id}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDatalistValues = (data, uuid) =>
  new Promise((resolve, reject) => {
    axiosPostUtilsReportEngine(`${GET_DATALIST_VALUES}${uuid}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getFlowValues = (data, uuid) =>
  new Promise((resolve, reject) => {
    axiosPostUtilsReportEngine(`${GET_FLOW_VALUES}${uuid}?is_test_bed=0`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getCrossValues = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtilsReportEngine(GET_CROSS_VALUES, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDatalistFilters = (uuid) =>
  new Promise((resolve, reject) => {
    axiosGetUtilsReportEngine(`${GET_DATALIST_FILTERS}${uuid}`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getFlowFilters = (uuid) =>
  new Promise((resolve, reject) => {
    axiosGetUtilsReportEngine(`${GET_FLOW_FILTERS}${uuid}?is_test_bed=0`)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getCrossFilters = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtilsReportEngine(`${GET_CROSS_FILTERS}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
