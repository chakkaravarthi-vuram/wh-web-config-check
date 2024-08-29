import axios from 'axios';
import { getCancelTokenForTaskReassignment } from 'containers/flow/flow_dashboard/flow_entry_task/FlowEntryTask';
import { axiosPostUtils, axiosGetUtils } from '../AxiosHelper';
import {
  SAVE_FLOW,
  SAVE_STEP,
  SAVE_FORM,
  GET_ALL_NEXT_STEPS,
  GET_FIRST_FORM_DETAILS,
  GET_ALL_FIELDS,
  GET_FORM_DETAILS_BY_FILTER,
  GET_FIELD_CONFIG_BY_ID,
  DELETE_STEP,
  GET_FLOW_STEP_DETAILS_BY_ID,
  GET_ALL_FLOW_STEPS,
  UPDATE_STEP_ORDER,
  GET_RULE_OPERATORS_BY_FIELD_TYPE,
  GET_RULE_DETAILS_BY_ID,
  SAVE_RULE,
  DELETE_FLOW,
  DISCARD_FLOW,
  GET_ALL_FIELDS_BY_STEP_ORDER,
  GET_ALL_TABLE_FIELDS,
  DELETE_FORM,
  GET_FIELD_DEPENDENCY,
  GET_FORM_DEPENDENCY,
  GET_STEP_DEPENDENCY,
  // VALIDATE_REFERENCE_NAME,
  GET_ALL_FLOW_STEP_WITH_FORM,
  GET_FLOW_TASKS_BY_FILTER,
  DELETE_TEST_BED,
  SAVE_FLOW_STEP_STATUSES,
  CREATE_STEP,
  SAVE_NOTES,
  GET_FLOW_NOTES,
  SAVE_FLOW_ESCALATIONS,
  SAVE_DOCUMENT_GENERATION,
  DELETE_FLOW_ESCALATIONS,
  DELETE_DOCUMENT_GENERATION,
  SAVE_SEND_EMAIL,
  DELETE_SEND_EMAIL,
  SAVE_SEND_DATA_TO_DATALIST,
  DELETE_SEND_DATA_TO_DATALIST,
  SAVE_STEP_COORDINATES,
  GET_PRECEDING_STEPS,
  DELETE_CONNECTOR_LINE,
  GET_TRIGGER_DETAILS,
  GET_FLOW_DEPENDENCY,
  VALIDATE_FLOW,
  REASSIGNMENT_TASK,
  TEST_INTEGRATION,
  GET_SEND_DATA_TO_DATALIST,
  GET_FLOW_LANGUAGES_TRANSLATION_STATUS,
  GET_FLOW_DATA_BY_LOCALE,
  SAVE_FLOW_DATA_BY_LOCALE,
  GET_FLOW_SHORTCUTS,
  GET_ALL_USERS,
  GET_TRIGGER_NAMES,
  SAVE_ACTIONS,
  GET_LATEST_FLOW_DRAFT,
  GET_STEP_ACTIONS,
  SAVE_STEP_ACTIONS,
  GENERATE_ENTITY_REFERENCE_NAME,
  START_STEP,
  SAVE_CONNECTOR_LINE,
  GET_FLOW_BASIC_INFO,
  GET_FLOW_SUMMARY_INFO,
  GET_FLOW_SECURITY_INFO,
  GET_FLOW_ADDON_INFO,
  GET_SEND_EMAIL_CONFIG,
  GET_DOCUMENT_GENERATION,
  GET_ALL_SYSTEM_FIELDS,
  GET_TRIGGERED_FLOW_NAMES,
} from '../../urls/ApiUrls';
import { normalizeIsEmpty, getLoaderConfig } from '../../utils/UtilityFunctions';

import {
  normalizeSaveFlow,
  normalizeSaveStep,
  normalizeSaveForm,
  normalizeGetAllSteps,
  normalizePublishFlow,
  normalizeGetFirstFormDetails,
  normalizeGetAllFields,
  normalizeGetFormByStepId,
  normalizeGetFieldConfigById,
  normalizeDeleteStep,
  normalizeFlowDetails,
  normalizeFlowStepDetailsById,
  normalizeAllFlowSteps,
  normalizeRuleOperatorsByFieldType,
  normalizeRuleDetailsById,
  normalizeSaveRule,
  normalizeAllFieldsList,
  normalizeDeleteFlow,
  normalizeDiscardFlow,
  normalizeGetAllTableFields,
  normalizeGetFieldDependency,
  normalizeGetFormDependency,
  normalizeGetStepDependency,
  // normalizeValidateReferenceName,
  normalizeGetAllFlowStepsWithForm,
  normalizeFlowTaskDetails,
  normalizeDeleteTestBedFlow,
  normalizeSaveStepStatuses,
  normalizeCreateStep,
  normalizeAddNewNotes,
  normalizeSaveEscalations,
  normalizeSaveDocumentGeneration,
  normalizeSaveSendEmail,
  normalizeSendDataToDatalist,
  normalizeDeleteFlowCofigurations,
  normalizeSaveStepCoordinates,
  normalizeGetPrecedingSteps,
  normalizeDeleteLink,
  normalizeTriggerDetails,
  normalizeGetFlowDependency,
  normalizeValidateFlow,
  normalizeTaskReassign,
  normalizeTestIntegration,
  normalizeGetFlowLanguagesTranslationStatus,
  normalizeGetFlowDataByLocale,
  normalizeSaveFlowDataByLocale,
  normalizeAddShortcuts,
  normalizeAllUsers,
  normalizeTriggerNames,
  normalizeSaveStepAction,
  normalizeGenerateEntityReferenceName,
  normalizeSaveStartStepAction,
  normalizeGetStepAction,
  normalizeSaveConnectorLine,
  normalizeGetFlowBasicDetails,
  normalizeGetFlowSummaryInfo,
  normalizeGetFlowSecurityInfo,
  normalizeGetDocumentGeneration,
  normalizeAllSystemFields,
} from '../apiNormalizer/flow.apiNormalizer';
import { TEST_CONNECTION_API_TIMEOUT } from '../../containers/integration/Integration.constants';

const { CancelToken } = axios;
const setSource = () => CancelToken.source();

let sourceFlowStepDetailsById;
let sourceAllFlowSteps;
let sourceAllFieldsList;
let sourceRuleOperatorsByFieldType;
let sourceRuleDetailsById;
let sourceSaveRule;
let sourceTestIntegration;
let sourceGetFieldDependency;
let sourceGetFormDependency;
let sourceGetStepDependency;
let sourceGetFlowDependency;
let cancelTokenForAllFieldList;
let cancelTokenForGetFormDetailsByFilter;
let cancelTokenForGetAllUser;

export const saveFlow = (data, loader = true) =>
  new Promise((resolve, reject) => {
    const loaderConfig = loader ? getLoaderConfig() : {};
    axiosPostUtils(SAVE_FLOW, data, {
      ...loaderConfig,
    })
      .then((response) =>
        resolve(normalizeSaveFlow(response)))
      .catch((error) => {
        reject(error);
      });
  });

export const updateStepOrder = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_STEP_ORDER, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(response.data.success);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const publishFlow = (data, apiUrl) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(apiUrl, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizePublishFlow(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const validateFlow = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(VALIDATE_FLOW, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizeValidateFlow(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const createStep = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(CREATE_STEP, data).then((response) => {
        resolve(normalizeCreateStep(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveStep = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_STEP, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizeSaveStep(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteConnectorLine = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_CONNECTOR_LINE, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizeDeleteLink(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const deleteStep = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_STEP, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizeDeleteStep(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveForm = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_FORM, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(normalizeSaveForm(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteForm = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_FORM, data, {
      ...getLoaderConfig(),
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getAllSteps = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_ALL_NEXT_STEPS,
      { params },
      {
        ...getLoaderConfig(),
      },
    )
      .then((response) => {
        resolve(normalizeGetAllSteps(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getFormUsingStepId = (params) =>
  new Promise((resolve, reject) => {
    if (cancelTokenForGetFormDetailsByFilter) cancelTokenForGetFormDetailsByFilter();
    axiosGetUtils(
      GET_FORM_DETAILS_BY_FILTER,
      {
        params,
        cancelToken: new CancelToken((cancelToken) => {
          cancelTokenForGetFormDetailsByFilter = cancelToken;
      }) },
      {
        ...getLoaderConfig(),
      },
    )
      .then((response) => {
        resolve(normalizeGetFormByStepId(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getFirstFormDetails = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_FIRST_FORM_DETAILS,
      { params },
      {
        ...getLoaderConfig(),
      },
    )
      .then((response) => {
        resolve(normalizeGetFirstFormDetails(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getFieldConfigById = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_FIELD_CONFIG_BY_ID,
      { params },
      {
        ...getLoaderConfig(),
      },
    )
      .then((response) => {
        resolve(normalizeGetFieldConfigById(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getAllFields = (params, cancelToken) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_ALL_FIELDS,
      {
        params,
        cancelToken: new CancelToken((c) => {
             if (cancelToken) cancelToken(c);
            //  else setCancelTokenForGetAllFields(c);
            }),
      },
      {
        ...getLoaderConfig(),
      },
    )
      .then((response) => {
        resolve(normalizeGetAllFields(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getAllTableFields = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_ALL_TABLE_FIELDS,
      { params },
      {
        ...getLoaderConfig(),
      },
    )
      .then((response) => {
        resolve(normalizeGetAllTableFields(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getFlowDetailsById = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_LATEST_FLOW_DRAFT,
      { params },
      {
        ...getLoaderConfig(),
      },
    )
      .then((response) => {
        resolve(normalizeFlowDetails(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const apiGetAllFlowSteps = (selectedFlowId) => {
  sourceAllFlowSteps = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_FLOW_STEPS, {
      params: { flow_id: selectedFlowId },
      cancelToken: sourceAllFlowSteps.token,
    })
      .then((res) => {
        const normalizeData = normalizeAllFlowSteps(res.data.result.data);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const apiGetFlowStepDetailsById = (selectedFlowId) => {
  sourceFlowStepDetailsById = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_FLOW_STEP_DETAILS_BY_ID, {
      params: { _id: selectedFlowId },
      cancelToken: sourceFlowStepDetailsById.token,
    })
      .then((res) => {
        const normalizeData = normalizeFlowStepDetailsById(res.data.result.data);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const testIntegration = (params) => {
  sourceTestIntegration = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(TEST_INTEGRATION, params, {
      timeout: TEST_CONNECTION_API_TIMEOUT,
      cancelToken: sourceTestIntegration.token,
    })
      .then((res) => {
        const normalizeData = normalizeTestIntegration(res.data.result.data);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const apiGetAllFieldsByStepOrder = (paginationData) => {
  sourceAllFieldsList = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_FIELDS_BY_STEP_ORDER, {
      params: paginationData,
      cancelToken: sourceAllFieldsList.token,
    })
      .then((res) => {
        const normalizeData = normalizeAllFieldsList(res.data.result.data);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const apiGetAllSystemFieldsList = (setCancelToken = null, cancelToken = null) => {
  if (cancelToken) cancelToken();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_SYSTEM_FIELDS, {
      cancelToken: new CancelToken((c) => {
        if (setCancelToken) setCancelToken(c);
      }),
    })
      .then((res) => {
        const normalizeData = normalizeAllSystemFields(res?.data?.result?.data);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const apiGetAllFieldsList = (paginationData, setCancelToken = null, cancelToken = null, dontCancelToken = false, normalizeFunction) => {
  if (!dontCancelToken) {
    if (!setCancelToken && cancelTokenForAllFieldList) cancelTokenForAllFieldList();
    if (cancelToken) cancelToken();
  }
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_FIELDS, {
      params: paginationData,
      ...(!dontCancelToken ? { cancelToken: new CancelToken((c) => {
         if (setCancelToken) setCancelToken(c);
         if (!setCancelToken) cancelTokenForAllFieldList = c;
      }) } : {}),
    })
      .then((res) => {
        const normalizeData = normalizeFunction?.(res.data.result.data) || normalizeAllFieldsList(res.data.result.data);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const apiGetRuleOperatorsByFieldType = (fieldTypes) => {
  sourceRuleOperatorsByFieldType = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_RULE_OPERATORS_BY_FIELD_TYPE, {
      params: { field_types: fieldTypes },
      cancelToken: sourceRuleOperatorsByFieldType.token,
    })
      .then((res) => {
        const normalizeData = normalizeRuleOperatorsByFieldType(res.data.result.data);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const apiGetRuleDetailsById = (ruleId) => {
  sourceRuleDetailsById = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_RULE_DETAILS_BY_ID, {
      params: { _id: ruleId },
      cancelToken: sourceRuleDetailsById.token,
    })
      .then((res) => {
        const normalizeData = normalizeRuleDetailsById(res.data.result.data);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

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

export const checkFormDependencyApi = (params) => {
  sourceGetFormDependency = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_FORM_DEPENDENCY, {
      params,
      cancelToken: sourceGetFormDependency.token,
    })
      .then((res) => {
        resolve(normalizeGetFormDependency(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const checkStepDependencyApi = (params) => {
  sourceGetStepDependency = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_STEP_DEPENDENCY, {
      params,
      cancelToken: sourceGetStepDependency.token,
    })
      .then((res) => {
        resolve(normalizeGetStepDependency(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const checkFlowDependencyApi = (params) => {
  sourceGetFlowDependency = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_FLOW_DEPENDENCY, {
      params,
      cancelToken: sourceGetFlowDependency.token,
    })
      .then((res) => {
        resolve(normalizeGetFlowDependency(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const apiSaveRule = (ruleData) => {
  sourceSaveRule = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_RULE, ruleData, {
      cancelToken: sourceSaveRule.token,
    })
      .then((res) => {
        const normalizeData = normalizeSaveRule(res.data.result.data);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const deleteFlow = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_FLOW, data)
      .then((response) => {
        resolve(normalizeDeleteFlow(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const discardFlow = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DISCARD_FLOW, data)
      .then((response) => {
        resolve(normalizeDiscardFlow(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

let cancelForGetAllFlowSteps;

export const getAllFlowStepsWithFormApiService = (params) => {
  cancelForGetAllFlowSteps = setSource();
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_FLOW_STEP_WITH_FORM, {
      params,
      cancelToken: cancelForGetAllFlowSteps.token,
    })
      .then((res) => {
        resolve(normalizeGetAllFlowStepsWithForm(res));
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getFlowTaskDetails = (params, setCancelToken) => new Promise((resolve, reject) => {
  axiosGetUtils(
    GET_FLOW_TASKS_BY_FILTER,
    {
      params,
      cancelToken: new CancelToken((c) => {
        setCancelToken?.(c);
      }),
    },
  )
    .then((response) => {
      resolve(normalizeFlowTaskDetails(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const deleteTestBedFlowApi = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(DELETE_TEST_BED, data, {
    ...getLoaderConfig(),
  })
    .then((response) => {
      resolve(normalizeDeleteTestBedFlow(response));
    })
    .catch((error) => {
      reject(error);
    });
});

 export const saveFlowStepStatuses = (data) => new Promise((resolve, reject) => {
  sourceSaveRule = setSource();
    axiosPostUtils(
          SAVE_FLOW_STEP_STATUSES,
          data,
          { cancelToken: sourceSaveRule.token },
         )
         .then((res) => {
            const normalizeData = normalizeSaveStepStatuses(res.data.result.data);
            resolve(normalizeData);
          })
        .catch((err) => {
          reject(err);
        });
  });

  export const addFlowNotes = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_NOTES, data)
      .then((response) => {
        resolve(normalizeAddNewNotes(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const getFlowNotes = (params) =>
  new Promise((resolve, reject) => {
    console.log('GET NOTES LIST API ', params);

    axiosGetUtils(
      GET_FLOW_NOTES,
      {
        params,

      },
    )
      .then((response) => {
        resolve(normalizeAddNewNotes(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const getFlowShortCuts = (params) =>
  new Promise((resolve, reject) => {
    console.log('GET NOTES LIST API ', params);

    axiosGetUtils(
      GET_FLOW_SHORTCUTS,
      {
        params,

      },
    )
      .then((response) => {
        resolve(normalizeAddShortcuts(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
  export const getShortcutTriggerNames = (params) =>
  new Promise((resolve, reject) => {
    console.log('GET NOTES LIST API ', params);

    axiosGetUtils(
      GET_TRIGGER_NAMES,
      {
        params,

      },
    )
      .then((response) => {
        resolve(normalizeTriggerNames(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const getTriggeredFlowNames = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_TRIGGERED_FLOW_NAMES, { params })
      .then((response) => {
        resolve(normalizeTriggerNames(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveFlowEscalationsApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_FLOW_ESCALATIONS, data)
      .then((response) => {
        resolve(normalizeSaveEscalations(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteFlowEscalationsApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_FLOW_ESCALATIONS, data)
      .then((response) => {
        resolve(normalizeDeleteFlowCofigurations(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveDocumentGenerationApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_DOCUMENT_GENERATION, data)
      .then((response) => {
        resolve(normalizeSaveDocumentGeneration(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteDocumentGenerationApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_DOCUMENT_GENERATION, data)
      .then((response) => {
        resolve(normalizeDeleteFlowCofigurations(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getSendEmailApiConfig = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_SEND_EMAIL_CONFIG, {
      params,
    })
      .then((response) => {
        resolve(normalizeSaveSendEmail(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getDocumentGenerationConfig = (params) => new Promise((resolve, reject) => {
    axiosGetUtils(GET_DOCUMENT_GENERATION, {
      params,
    })
      .then((response) => {
        resolve(normalizeGetDocumentGeneration(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveSendEmailApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_SEND_EMAIL, data)
      .then((response) => {
        resolve(normalizeSaveSendEmail(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteSendEmailApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_SEND_EMAIL, data)
      .then((response) => {
        resolve(normalizeDeleteFlowCofigurations(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getSendDataToDatlistApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_SEND_DATA_TO_DATALIST, {
      params,
    })
      .then((response) => {
        resolve(normalizeSendDataToDatalist(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveSendDataToDatlistApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_SEND_DATA_TO_DATALIST, data)
      .then((response) => {
        resolve(normalizeSendDataToDatalist(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteSendDataToDatalistApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_SEND_DATA_TO_DATALIST, data)
      .then((response) => {
        resolve(normalizeDeleteFlowCofigurations(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getPrecedingStepsApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_PRECEDING_STEPS, {
      params,
    })
      .then((response) => {
        resolve(normalizeGetPrecedingSteps(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveStepCoordinates = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(SAVE_STEP_COORDINATES, data,
    //   {
    //   cancelToken: new CancelToken((c) => { cancelTokenForSaveStepCoordinates = c; }),
    // }
  )
    .then((response) => {
      resolve(normalizeSaveStepCoordinates(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const getTriggerDetails = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_TRIGGER_DETAILS,
      { params },
      {
        ...getLoaderConfig(),
      },
    )
      .then((response) => {
        resolve(normalizeTriggerDetails(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const taskReassign = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(REASSIGNMENT_TASK, data, {
    cancelToken: new CancelToken((c) => {
      getCancelTokenForTaskReassignment(c);
    }),
  })
    .then((response) => {
      resolve(normalizeTaskReassign(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const getFlowLanguagesTranslationStatus = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_FLOW_LANGUAGES_TRANSLATION_STATUS, {
      params,
    })
      .then((response) => {
        resolve(normalizeGetFlowLanguagesTranslationStatus(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
export const getAllUsers = (params) =>
  new Promise((resolve, reject) => {
    if (cancelTokenForGetAllUser) cancelTokenForGetAllUser();
    axiosGetUtils(GET_ALL_USERS, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelTokenForGetAllUser = c;
      }),
    })
      .then((response) => {
        resolve(normalizeAllUsers(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getFlowDataByLocale = (params) =>
new Promise((resolve, reject) => {
  axiosGetUtils(GET_FLOW_DATA_BY_LOCALE, {
    params,
  })
    .then((response) => {
      resolve(normalizeGetFlowDataByLocale(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const saveFlowDataByLocale = (data, loader = true) =>
  new Promise((resolve, reject) => {
    const loaderConfig = loader ? getLoaderConfig() : {};
    axiosPostUtils(SAVE_FLOW_DATA_BY_LOCALE, data, {
      ...loaderConfig,
    })
      .then((response) => {
        resolve(normalizeSaveFlowDataByLocale(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveActionApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_ACTIONS, data)
      .then((response) =>
        resolve(normalizeSaveStepAction(response)))
      .catch((error) => {
        reject(error);
      });
  });

export const saveStepActionApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_STEP_ACTIONS, data)
      .then((response) =>
        resolve(normalizeSaveStepAction(response)))
      .catch((error) => {
        reject(error);
      });
  });

export const getStepActionApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_STEP_ACTIONS, {
      params,
    })
      .then((response) =>
        resolve(normalizeSaveStepAction(response)))
      .catch((error) => {
        reject(error);
      });
  });

export const generateEntityReferenceNameAPI = async (params) => {
  try {
    const res = await axiosGetUtils(GENERATE_ENTITY_REFERENCE_NAME, { params });
    return normalizeGenerateEntityReferenceName(res);
  } catch (e) {
    throw Error(e);
  }
};

export const saveStartStepApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(START_STEP, data)
      .then((response) =>
        resolve(normalizeSaveStartStepAction(response)))
      .catch((error) => {
        reject(error);
      });
  });

export const getStartStepApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(START_STEP, {
      params,
    })
      .then((response) =>
        resolve(normalizeGetStepAction(response)))
      .catch((error) => {
        reject(error);
      });
  });

export const saveConnectorLineApi = async (data) => {
  try {
    const res = await axiosPostUtils(SAVE_CONNECTOR_LINE, data);
    return normalizeSaveConnectorLine(res);
  } catch (e) {
    throw Error(e);
  }
};

export const getFlowBasicDetailsApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_FLOW_BASIC_INFO, {
      params,
    })
      .then((response) =>
        resolve(normalizeGetFlowBasicDetails(response)))
      .catch((error) => {
        reject(error);
      });
  });

export const getFlowSummaryInfoApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_FLOW_SUMMARY_INFO, {
      params,
    })
      .then((response) =>
        resolve(normalizeGetFlowSummaryInfo(response)))
      .catch((error) => {
        reject(error);
      });
  });

export const getFlowSecurityInfoApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_FLOW_SECURITY_INFO, {
      params,
    })
      .then((response) =>
        resolve(normalizeGetFlowSecurityInfo(response)))
      .catch((error) => {
        reject(error);
      });
  });

export const getFlowAddOnInfoApi = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_FLOW_ADDON_INFO, {
      params,
    })
      .then((response) =>
        resolve(normalizeGetFlowSummaryInfo(response)))
      .catch((error) => {
        reject(error);
      });
  });

export default saveFlow;
