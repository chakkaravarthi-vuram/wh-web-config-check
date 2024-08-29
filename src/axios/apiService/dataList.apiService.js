import axios from 'axios';
import {
  DELETE_DATA_LIST,
  DISCARD_DATA_LIST,
  DELETE_DATA_LIST_ENTRY,
  GET_ALL_VIEW_DATA_LISTS,
  GET_DATA_LIST_DETAILS_BY_UUID,
  GET_DATA_LIST_ENTRY_DETAILS_BY_ID,
  PUBLISH_DATA_LIST,
  SAVE_DATA_LIST,
  SAVE_RULE,
  SUBMIT_DATA_LIST_ENTRY,
  GET_DATA_LIST_TASKS_BY_FILTER,
  SAVE_SCHEDULE_REMAINDER,
  GET_SCHEDULE_REMAINDER_BY_FILTER,
  SUBMIT_BULK_DATA_LIST_ENTRY,
  GET_AUDIT_DATA,
  GET_AUDIT_DATA_EDITORS,
  GET_AUDIT_DATA_DETAILS,
  TRUNCATE_DATALIST_ENTRY,
  GET_ALL_VIEW_DATA_LIST,
  SAVE_NOTES,
  GET_LATEST_DATA_LIST_DRAFT,
  GET_FORM_DETAILS,
  GET_DATA_LIST_SECURITY_INFO,
  GET_DATA_LIST_SUMMARY_INFO,
  GET_DATA_LIST_BASIC_INFO,
  GET_DATA_LIST_ADDON_INFO,
  GENERATE_ENTITY_REFERENCE_NAME,
} from '../../urls/ApiUrls';
import {
  normalizeIsEmpty,
  getLoaderConfig,
} from '../../utils/UtilityFunctions';
import {
  normalizeSaveDataList,
  normalizePublishDataList,
  normalizeDeleteDataList,
  normalizeDiscardDataList,
  normalizeGetAllDataList,
  normalizeDataListDetailsById,
  normalizeDataListDetailsByUuid,
  normalizeDataListEntryDetailsById,
  normalizeSubmitDataListEntry,
  normalizeAddNewNotes,
  normalizeSaveRule,
  normalizeFormDetailsByDataListId,
  normalizeDataListEntryTaskDetails,
  normalizeAddNewRemainder,
  normalizeSubmitBulkDataListEntry,
  normalizeTruncateAllDataList,
  normalizeGetAllDataListUpdate,
  normalizeGetAllViewDataList,
  normalizeDatalistSecurityInfo,
  normalizeDatalistSummaryInfo,
  normalizeDatalistBasicInfo,
  normalizeDatalistAddOnInfo,
  normalizeSaveDataListResponse,
  normalizeGetDataListResponse,
} from '../apiNormalizer/dataList.apiNormalizer';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';

const { CancelToken } = axios;

let cancelForGetAllDataListData;
let cancelTokenForGetAllViewDataList;

export const getAllDataList = (
  params,
  // setCancelToken,
) => {
  if (cancelForGetAllDataListData) cancelForGetAllDataListData();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_VIEW_DATA_LISTS, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelForGetAllDataListData = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetAllDataListUpdate(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const getAllViewDataList = (params, cancelToken) => {
  if (cancelTokenForGetAllViewDataList) cancelTokenForGetAllViewDataList();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_VIEW_DATA_LIST, {
      params,
      cancelToken: new CancelToken((c) => {
        if (cancelToken) cancelToken(c);
        else cancelTokenForGetAllViewDataList = c;
      }),
    })
      .then((response) => {
        resolve(normalizeGetAllViewDataList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getRemainderListApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_SCHEDULE_REMAINDER_BY_FILTER, {
      params,
      // cancelToken: new CancelToken((c) => {
      //   cancelForGetAllDataList = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeGetAllDataList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDataListDetailsById = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_LATEST_DATA_LIST_DRAFT, {
      params,
      // cancelToken: new CancelToken((c) => {
      //   cancelForDataListDetails = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeDataListDetailsById(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDataListDetailsByUuid = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_DATA_LIST_DETAILS_BY_UUID, {
      params,
      // cancelToken: new CancelToken((c) => {
      //   cancelForDataListDetails = c;
      // }),
    })
      .then((response) => resolve(normalizeDataListDetailsByUuid(response)))
      .catch((error) => reject(error));
  });

export const getDataListEntryDetailsById = (params, isAudit) =>
  new Promise((resolve, reject) => {
    let url;
    if (isAudit) {
      url = GET_AUDIT_DATA_DETAILS;
    } else {
      url = GET_DATA_LIST_ENTRY_DETAILS_BY_ID;
    }
    axiosGetUtils(url, {
      params,
      // cancelToken: new CancelToken((c) => {
      //   cancelForDataListEntryDetails = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeDataListEntryDetailsById(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDataListEntryTaskDetails = (params, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_DATA_LIST_TASKS_BY_FILTER, {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken?.(c);
      }),
    })
      .then((response) => {
        resolve(normalizeDataListEntryTaskDetails(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const submitDataListEntry = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SUBMIT_DATA_LIST_ENTRY, data, {
      ...getLoaderConfig(),
      // cancelToken: new CancelToken((c) => {
      //   cancelForSubmitDataListEntry = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeSubmitDataListEntry(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const submitBulkDataListEntry = (data, cancelToken = () => {}) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SUBMIT_BULK_DATA_LIST_ENTRY, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => cancelToken(c)),
    }).then(
      (response) => {
        resolve(normalizeSubmitBulkDataListEntry(response));
      },
      (error) => reject(error),
    );
  });

export const getDataListFormDetailsByIdApi = (params, cancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_FORM_DETAILS, {
      params,
      cancelToken: new CancelToken((c) => cancelToken(c)),
    })
      .then((res) => resolve(normalizeFormDetailsByDataListId(res)))
      .catch((error) => reject(error));
  });

export const addDataListNote = (data) =>
new Promise((resolve, reject) => {
  axiosPostUtils(SAVE_NOTES, data)
    .then((response) => {
      resolve(normalizeAddNewNotes(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const addNewRemainder = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_SCHEDULE_REMAINDER, data, {
      ...getLoaderConfig(),
      // cancelToken: new CancelToken((c) => {
      //   cancelForAddNewRemainder = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeAddNewRemainder(response));
      })
      .catch((error) => {
        console.log('ERROR DUE TO 5 MINS', error);
        reject(error);
      });
  });

export const apiSaveRule = (ruleData) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_RULE, ruleData, {
      // cancelToken: new CancelToken((c) => {
      //   cancelTokenForDefaultRule = c;
      // }),
    })
      .then((res) => {
        const normalizeData = normalizeSaveRule(res.data.result.data);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => reject(err));
  });

export const deleteDataListEntry = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_DATA_LIST_ENTRY, data, {
      ...getLoaderConfig(),
      // cancelToken: new CancelToken((c) => {
      //   cancelForDeleteDataListEntry = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeSubmitDataListEntry(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveDataList = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_DATA_LIST, data, {
      ...getLoaderConfig(),
      // cancelToken: new CancelToken((c) => {
      //   cancelForSaveDataList = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeSaveDataList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const publishDataList = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(PUBLISH_DATA_LIST, data, {
      ...getLoaderConfig(),
      // cancelToken: new CancelToken((c) => {
      //   cancelForPublishDataList = c;
      // }),
    })
      .then((response) => {
        resolve(normalizePublishDataList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteDataList = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_DATA_LIST, data, {
      ...getLoaderConfig(),
      // cancelToken: new CancelToken((c) => {
      //   cancelForDeleteDataList = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeDeleteDataList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const discardDataList = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DISCARD_DATA_LIST, data, {
      ...getLoaderConfig(),
      // cancelToken: new CancelToken((c) => {
      //   cancelForDeleteDataList = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeDiscardDataList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const truncateDatalistApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(TRUNCATE_DATALIST_ENTRY, data, {
      ...getLoaderConfig(),
      // cancelToken: new CancelToken((c) => {
      //   cancelTruncateAllEntries = c;
      // }),
    })
      .then((response) => {
        resolve(normalizeTruncateAllDataList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDatalistAuditData = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_AUDIT_DATA, {
      params,
      // cancelToken: new CancelToken((c) => { cancelForGetAuditData = c; }),
    })
      .then((res) => {
        resolve(res.data.result.data);
      })
      .catch((error) => reject(error));
  });
export const getEditorsListData = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_AUDIT_DATA_EDITORS, {
      params,
      // cancelToken: new CancelToken((c) => { cancelForGetEditorsData = c; }),
    })
      .then((res) => {
        resolve(res.data.result.data);
      })
      .catch((error) => reject(error));
  });
export const getDatalistAuditDetails = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_AUDIT_DATA_DETAILS, {
      params,
      // cancelToken: new CancelToken((c) => { cancelForGetAuditDetails = c; }),
    })
      .then((res) => {
        resolve(res.data.result.data);
      })
      .catch((error) => reject(error));
  });

export const getDataListBasicInfo = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_DATA_LIST_BASIC_INFO, {
      params,
    }).then((res) => {
      resolve(normalizeDatalistBasicInfo(res));
    }).catch((err) => reject(err));
  });

export const getDataListSummaryInfo = async (params) => {
  try {
    const res = await axiosGetUtils(GET_DATA_LIST_SUMMARY_INFO, { params });
    return normalizeDatalistSummaryInfo(res);
  } catch (err) {
    console.log('getDataListSummaryInfo err', err);
    throw err;
  }
};

export const getDataListSecurityInfoApi = async (params) => {
  try {
    const res = await axiosGetUtils(GET_DATA_LIST_SECURITY_INFO, { params });
    return normalizeDatalistSecurityInfo(res);
  } catch (err) {
    console.log('getDataListSecurityInfoApi err', err);
    throw err;
  }
};

export const getDataListAddOnInfoApi = async (params) => {
  try {
    const res = await axiosGetUtils(GET_DATA_LIST_ADDON_INFO, { params });
    return normalizeDatalistAddOnInfo(res);
  } catch (err) {
    console.log('getDataListAddOnInfoApi err', err);
    throw err;
  }
};

export const publishDataListApi = async (params) => {
  try {
    const res = await axiosPostUtils(PUBLISH_DATA_LIST, params);
    return res;
  } catch (err) {
    console.log('publishDataListApi err', err);
    throw err.response.data.errors;
  }
};

export const saveDataListApi = async (params) => {
  try {
    const res = await axiosPostUtils(SAVE_DATA_LIST, params);
    return normalizeSaveDataListResponse(res);
  } catch (err) {
    console.log('saveDataListApi err', err?.response?.data?.errors);
    throw err?.response?.data?.errors;
  }
};

export const getDataListDraftApi = async (params) => {
  try {
    const res = await axiosGetUtils(GET_LATEST_DATA_LIST_DRAFT, { params });
    return normalizeGetDataListResponse(res);
  } catch (err) {
    console.log('getDataListDraftApi err', err);
    throw err;
  }
};

export const generateEntityReferenceName = async (params) => {
  try {
    const res = await axiosGetUtils(GENERATE_ENTITY_REFERENCE_NAME, { params });
    return res;
  } catch (err) {
    console.log('get dl reference name err', err);
    throw err;
  }
};

export const discardDataListApi = async (params) => {
  try {
    const res = await axiosPostUtils(DISCARD_DATA_LIST, params);
    return res?.data?.result?.data;
  } catch (err) {
    console.log('discard dl err', err);
    throw err;
  }
};

export const deleteDataListApi = async (params) => {
  try {
    const res = await axiosPostUtils(DELETE_DATA_LIST, params);
    return res?.data?.result?.data;
  } catch (err) {
    console.log('delete dl err', err);
    throw err;
  }
};
