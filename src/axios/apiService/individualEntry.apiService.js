import axios from 'axios';
import { axiosPostUtils, axiosGetUtils, axiosPutUtils } from '../AxiosHelper';
import {
  GET_DASHBOARD_PAGES,
  SAVE_DASHBOARD_PAGES,
  PUT_DASHBOARD_PAGES,
  DELETE_DASHBOARD_PAGES,
  SAVE_DASHBOARD_PAGE_COMPONENT,
  REORDER_PAGE,
  UPDATE_SYSTEM_DASHBOARD_PAGES,
  GET_DASHBOARD_PAGE_DATA_BY_ID,
  SAVE_DASHBOARD_TABLE_PAGE_COMPONENT,
  GET_DASHBOARD_FIELD,
  ENTITY_FORM_TO_DASHBOARD_PAGE,
  GET_DASHBOARD_PAGE_FOR_USER_MODE,
  DELETE_DASHBOARD_PAGE_COMPONENT,
  GET_DASHBOARD_COMPONENT,
  GET_INSTANCE_DETAILS_BY_ID,
  GET_DATA_LIST_ENTRY_BASIC_INFO,
  GET_DEV_DASHBOARD_PAGES,
  GET_DATA_LIST_VERSION_HISTORY,
} from '../../urls/ApiUrls';
import {
  normalizeGetAllDashboardPages,
  normalizeGetDashboardField,
  normalizeGetDashboardPageById,
  normalizeEntityFormDashboardPage,
  normalizeSaveDashboardPages,
  normalizeGetDashboardPageByIdForUserMode,
  normalizeDeleteDashboardPageComponent,
  normalizeGetDashboardComponent,
  normalizeGetInstanceDetailsByID,
  normalizeGetDatalistEntryBasicInfo,
  normalizeGetDatalistHistoryByUUID,
} from '../apiNormalizer/individualEntry.apiNormalizer';

const { CancelToken } = axios;

let cancelTokenForGetAllDashboardPages;
let cancelTokenForGetDashboardPageById;
let cancelTokenForGetDashboardField;

export const getAllDashboardPages = (params, isUserMode = false) =>
  new Promise((resolve, reject) => {
    if (cancelTokenForGetAllDashboardPages) {
      cancelTokenForGetAllDashboardPages();
    }
    axiosGetUtils(isUserMode ? GET_DASHBOARD_PAGES : GET_DEV_DASHBOARD_PAGES, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelTokenForGetAllDashboardPages = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetAllDashboardPages(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
export const getDashboardPageById = (pageId, params) =>
  new Promise((resolve, reject) => {
    if (cancelTokenForGetDashboardPageById) {
      cancelTokenForGetDashboardPageById();
    }
    axiosGetUtils(`${GET_DASHBOARD_PAGE_DATA_BY_ID}/${pageId}`, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelTokenForGetDashboardPageById = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetDashboardPageById(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDashboardPageByIdForUserMode = (params) =>
  new Promise((resolve, reject) => {
    if (cancelTokenForGetDashboardPageById) {
      cancelTokenForGetDashboardPageById();
    }
    axiosGetUtils(GET_DASHBOARD_PAGE_FOR_USER_MODE, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelTokenForGetDashboardPageById = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetDashboardPageByIdForUserMode(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveDashboardPages = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_DASHBOARD_PAGES, data)
      .then((response) => {
        resolve(normalizeSaveDashboardPages(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const putDashboardPages = (data, pageId) =>
  new Promise((resolve, reject) => {
    axiosPutUtils(`${PUT_DASHBOARD_PAGES}/${pageId}`, data)
      .then((response) => {
        resolve(normalizeSaveDashboardPages(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveDashboardPageComponentOrField = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_DASHBOARD_PAGE_COMPONENT, data)
      .then((response) => {
        resolve(normalizeSaveDashboardPages(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const reorderPagesApi = async (params) => {
  try {
    const res = await axiosPostUtils(REORDER_PAGE, params);
    const normalizeData = normalizeSaveDashboardPages(res);
    return await normalizeData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteDashboardPage = async (params) => {
  try {
    const res = await axiosPostUtils(DELETE_DASHBOARD_PAGES, params);
    const normalizeData = normalizeSaveDashboardPages(res);
    console.log('gsafgfsag', normalizeData, res);
    return await normalizeData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateSystemDashboardPagesApi = async (params) => {
  try {
    const res = await axiosPostUtils(UPDATE_SYSTEM_DASHBOARD_PAGES, params);
    const normalizeData = normalizeSaveDashboardPages(res);
    return await normalizeData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const saveDashboardPageTableComponentOrTableField = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_DASHBOARD_TABLE_PAGE_COMPONENT, data)
      .then((response) => {
        resolve(normalizeSaveDashboardPages(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDashboardField = (params) =>
  new Promise((resolve, reject) => {
    if (cancelTokenForGetDashboardField) {
      cancelTokenForGetDashboardField();
    }
    axiosGetUtils(GET_DASHBOARD_FIELD, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelTokenForGetDashboardField = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetDashboardField(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const EntityFormToDashboardPage = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(ENTITY_FORM_TO_DASHBOARD_PAGE, data)
      .then((response) => {
        resolve(normalizeEntityFormDashboardPage(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteDashboardPageComponentApi = (params) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_DASHBOARD_PAGE_COMPONENT, params)
      .then((response) => {
        resolve(normalizeDeleteDashboardPageComponent(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDashboardComponentApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_DASHBOARD_COMPONENT, {
      params,
    })
      .then((response) => {
        resolve(normalizeGetDashboardComponent(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getInstanceDetailsByID = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_INSTANCE_DETAILS_BY_ID, {
      params,
    })
      .then((response) => {
        resolve(normalizeGetInstanceDetailsByID(response));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getDatalistEntryBasicInfo = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_DATA_LIST_ENTRY_BASIC_INFO, {
      params,
    })
      .then((response) => {
        resolve(normalizeGetDatalistEntryBasicInfo(response));
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getGetDatalistHistoryByUUID = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_DATA_LIST_VERSION_HISTORY, {
      params,
    })
      .then((response) => {
        resolve(normalizeGetDatalistHistoryByUUID(response));
      })
      .catch((err) => {
        reject(err);
      });
  });
