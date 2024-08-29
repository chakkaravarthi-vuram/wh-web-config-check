import axios from 'axios';

import jsUtility from 'utils/jsUtility';
import { axiosGetUtils, axiosPostUtils } from '../AxiosHelper';
import {
  DELETE_ACTION,
  DELETE_FIELD,
  DELETE_TABLE,
  GET_ACTIONS,
  GET_ALL_FIELDS,
  GET_ALL_FIELD_VALUES,
  GET_ALL_FLOW_STEP_WITH_FORM,
  GET_CATEGORY,
  GET_FIELD_DEPENDENCY,
  GET_FORM_DETAILS,
  GET_FORM_DETAILS_BY_FILTER,
  LIST_FIELD_DEPENDENCY,
  SAVE_ACTION,
  SAVE_CATEGORY,
  SAVE_FORM,
  SAVE_FORM_HEADER,
  SAVE_TABLE,
  UPDATE_FORM_FIELD_ORDER,
  GET_ALL_DATA_LIST_ENTRY_DETAILS_BY_FILTER,
  SAVE_FORM_CONTENT,
  DELETE_SECTION,
  SAVE_SECTION,
  SECTION_ORDER,
  GET_FIELD_DETAILS,
  GET_REFERENCE_NAME,
  GET_DATA_RULES,
  GET_INPUT_STEPS,
} from '../../urls/ApiUrls';
import {
  normalizeAddNewCategory,
  normalizeDeleteAction,
  normalizeDeleteField,
  normalizeGetCategoryApiResponse,
  normalizeGetDatalistFields,
  normalizeGetFieldDependency,
  normalizeGetFormDetailsApiResponse,
  normalizeGetListDependency,
  normalizeGetReferenceName,
  normalizeSaveAction,
  normalizeSaveForm,
  normalizeSaveFormHeader,
} from '../apiNormalizer/form.apiNormalizer';
import { getLoaderConfig, updatePostLoader } from '../../utils/UtilityFunctions';
import { normalizer } from '../../utils/normalizer.utils';
import { REQUEST_GET_ACTIONS, REQUEST_GET_ALL_FLOW_STEPS, REQUEST_GET_FORM_DETAILS_BY_FILTER, REQUEST_SAVE_FORM, REQUEST_SAVE_SECTION, RESPONSE_GET_ACTIONS, RESPONSE_GET_ALL_FLOW_STEPS, RESPONSE_GET_FORM_DETAILS_BY_FILTER, RESPONSE_SAVE_FORM, RESPONSE_SAVE_SECTION } from '../../utils/constants/form/form.constant';

const { CancelToken } = axios;
const setSource = () => CancelToken.source();

let sourceGetFieldDependency;
let sourceGetListDependency;
let cancelForSaveForm;
let cancelForGetFormDetails;
let cancelForAddNewCategory;
let cancelForGetCategory;

// commmon form related apis

export const checkFieldDependencyApi = (params) => {
  sourceGetFieldDependency = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_FIELD_DEPENDENCY, {
      params,
      cancelToken: sourceGetFieldDependency.token,
    })
      .then((res) => {
        resolve(normalizeGetFieldDependency(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const listDependencyAPI = (params) => {
  sourceGetListDependency = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(LIST_FIELD_DEPENDENCY, {
      params,
      cancelToken: sourceGetListDependency.token,
    })
      .then((res) => {
        resolve(normalizeGetListDependency(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteField = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_FIELD, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizeSaveForm(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveAction = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_ACTION, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizeSaveAction(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getAllDataListEntries = (params, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_DATA_LIST_ENTRY_DETAILS_BY_FILTER, {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken(c);
      }),
    })
      .then((response) => resolve(response.data.result.data))
      .catch((error) => reject(error));
  });

export const deleteAction = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_ACTION, data)
      .then((response) => {
        resolve(normalizeDeleteAction(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveFormHeader = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_FORM_HEADER, data)
      .then((response) => {
        resolve(normalizeSaveFormHeader(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteFieldApiService = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_FIELD, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizeDeleteField(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteTable = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_TABLE, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizeSaveForm(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveTable = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_TABLE, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizeSaveForm(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveForm = (data) => {
  cancelForSaveForm = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_FORM, data, {
      ...getLoaderConfig(),
      cancelToken: cancelForSaveForm.token,
    })
      .then((response) => {
        resolve(normalizeSaveForm(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getFormDetailsApiService = (params) => {
  if (cancelForGetFormDetails) cancelForGetFormDetails();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_FORM_DETAILS_BY_FILTER, {
      params,
      cancelToken: new CancelToken((cancelToken) => {
        cancelForGetFormDetails = cancelToken;
      }),
      // cancelForGetFormDetails.token,
    })
      .then((response) => {
        resolve(normalizeGetFormDetailsApiResponse(response));
      })
      .catch((error) => {
        console.log('WEDSAWER', error);
        if (
          jsUtility.has(error, ['code'], false) &&
          error.code === 'ERR_CANCELED'
        ) {
          return;
        }
        reject(error);
      });
  });
};

export const addNewCategoryApiService = (postData) => {
  cancelForAddNewCategory = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_CATEGORY, postData, {
      ...getLoaderConfig(),
      cancelToken: cancelForAddNewCategory.token,
    })
      .then((response) => {
        resolve(normalizeAddNewCategory(response));
        updatePostLoader(false);
      })
      .catch((error) => {
        reject(error);
        updatePostLoader(false);
      });
  });
};

export const getCategoryApiService = (params) => {
  if (cancelForGetCategory) cancelForGetCategory();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_CATEGORY, {
      params,
      cancelToken: new CancelToken((cancelToken) => {
        cancelForGetCategory = cancelToken;
      }),
    })
      .then((response) => {
        resolve(normalizeGetCategoryApiResponse(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAllDataListFields = (params, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_FIELDS, {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken(c);
      }),
    })
      .then((response) => resolve(normalizeGetDatalistFields(response)))
      .catch((error) => {
        reject(error);
      });
  });

export const getReferenceNameApiService = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_REFERENCE_NAME, {
      params,
    })
      .then((response) => resolve(normalizeGetReferenceName(response)))
      .catch((error) => {
        reject(error);
      });
  });

export const getDataListFieldValues = (params, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_FIELD_VALUES, {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken(c);
      }),
    })
      .then((response) => resolve(response.data.result.data))
      .catch((error) => reject(error));
  });

export default checkFieldDependencyApi;

export const getActionsApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_ACTIONS, { params })
      .then((res) => {
        resolve(
          normalizer(
            res.data.result.data,
            RESPONSE_GET_ACTIONS,
            REQUEST_GET_ACTIONS,
          ),
        );
      })
      .catch((error) => reject(error));
  });

export const updateFormFieldOrderApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_FORM_FIELD_ORDER, data)
      .then((res) => {
        resolve(res.data.result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveSectionApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_SECTION, data, {
      ...getLoaderConfig(),
    })
      .then((res) => {
        resolve(
          normalizer(
            res.data.result.data,
            REQUEST_SAVE_SECTION,
            RESPONSE_SAVE_SECTION,
          ),
        );
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteSectionApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_SECTION, data, {
      ...getLoaderConfig(),
    })
      .then((res) => {
        resolve(res.data.result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const sectionOrderApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SECTION_ORDER, data, {
      ...getLoaderConfig(),
    })
      .then((res) => {
        resolve(res.data.result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getFormDetailsApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_FORM_DETAILS, { params })
      .then((res) => {
        resolve(
          // normalizer(
          res.data.result.data,
          // REQUEST_GET_FORM_DETAILS,
          // RESPONSE_GET_FORM_DETAILS,
          // ),
        );
      })
      .catch((error) => reject(error));
  });

export const getFieldDetails = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_FIELD_DETAILS, { params })
      .then((res) => {
        resolve(res.data.result.data);
      })
      .catch((error) => reject(error));
  });

export const getInputSteps = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_INPUT_STEPS, { params })
      .then((res) => {
        resolve(res.data.result.data);
      })
      .catch((error) => reject(error));
  });

export const saveFormApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_FORM, data)
      .then((res) =>
        resolve(
          normalizer(
            res.data.result.data,
            REQUEST_SAVE_FORM,
            RESPONSE_SAVE_FORM,
          ),
        ),
      )
      .catch((err) => reject(err));
  });

export const getAllFlowStepsApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_FLOW_STEP_WITH_FORM, {
      params,
    })
      .then((res) =>
        resolve(
          normalizer(
            res.data.result.data,
            REQUEST_GET_ALL_FLOW_STEPS,
            RESPONSE_GET_ALL_FLOW_STEPS,
          ),
        ),
      )
      .catch((err) => reject(err));
  });

export const getFormDetailsByFilterApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_FORM_DETAILS_BY_FILTER, {
      params,
    })
      .then((res) => {
        resolve(
          normalizer(
            res.data.result.data,
            REQUEST_GET_FORM_DETAILS_BY_FILTER,
            RESPONSE_GET_FORM_DETAILS_BY_FILTER,
          ),
        );
      })
      .catch((error) => {
        if (
          jsUtility.has(error, ['code'], false) &&
          error.code === 'ERR_CANCELED'
        ) {
          return;
        }
        reject(error);
      });
  });

export const saveFormContentApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_FORM_CONTENT, data)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getDataRules = (params, setCancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_DATA_RULES, {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken(c);
      }),
    })
      .then((response) => resolve(response.data.result.data))
      .catch((error) => reject(error));
  });
