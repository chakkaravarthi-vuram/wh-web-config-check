import jsUtility from 'utils/jsUtility';
import { reportError, hasOwn } from '../../utils/UtilityFunctions';
import { validatePagination, validateUser, validateTeam } from './common.apiNormalizer';
import { convertBeToFeKeys } from '../../utils/normalizer.utils';

const flow_list = 'FlowList';

const validateFlowList = (content) => {
  let requiredProps = ['pagination_details', 'pagination_data'];
  let invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${flow_list} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (invalidData) return null;
  // check list data
  requiredProps = ['_id', 'flow_uuid', 'flow_name'];
  invalidData = content.pagination_data.some((data) => requiredProps.some((reqProp) => {
    if (!Object.prototype.hasOwnProperty.call(data, reqProp)) {
      reportError(`validate ${flow_list} data failed: ${reqProp} missing`);
      return true;
    }
    return false;
  }));

  if (invalidData) return null;
  // check pagination details
  requiredProps = ['page', 'size', 'total_count'];
  invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content.pagination_details[0], prop)) {
      reportError(`validate ${flow_list} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;

  return content;
};

const validateFlowListupdate = (content) => {
  const requiredProps = ['flow', 'flow_count'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${flow_list} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateSaveFlow = (content) => {
  const requiredProps = ['_id', 'flow_uuid'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${flow_list} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validatePublishFlow = (content) => {
  const requiredProps = ['_id'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${flow_list} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateFlowValidateAPI = (content) => {
  const requiredProps = ['success'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${flow_list} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateDeleteFlow = (content) => {
  const requiredProps = ['success'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate delete flow data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateGetFieldDependency = (content) => {
  const requiredProps = ['dependency_list', 'is_blocker'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get field dependency data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateGetFormDependency = (content) => {
  const requiredProps = ['dependency_list', 'is_blocker'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get form dependency data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateGetStepDependency = (content) => {
  const requiredProps = ['dependency_list', 'is_blocker'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get step dependency data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateGetStepLinkDependency = (content) => {
  const requiredProps = ['step_dependency'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get step link dependency data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateGetFlowDependency = (content) => {
  const requiredProps = ['success'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate delete flow data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateCreateStep = (content) => {
  const requiredProps = ['step_uuid'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${flow_list} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateSaveStep = (content) => {
  const requiredProps = ['step_id'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${flow_list} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateDeleteStep = (content) => {
  const requiredProps = ['success'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${flow_list} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateDeleteLink = (content) => {
  const requiredProps = ['success'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${flow_list} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const validateSaveForm = (content) => {
  const requiredProps = ['form_uuid'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${flow_list} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const normalizeCreateStep = (untrustedContent) => {
  const content = validateCreateStep(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize create step failed');
    return null;
  }
  return content;
};

export const normalizeSaveStep = (untrustedContent) => {
  const content = validateSaveStep(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize save step failed');
    return null;
  }
  return content;
};

export const normalizeDeleteStep = (untrustedContent) => {
  const content = validateDeleteStep(untrustedContent.data);
  if (!content) {
    reportError('normalize delete step failed');
    return null;
  }
  return content;
};

export const normalizeDeleteLink = (untrustedContent) => {
  const content = validateDeleteLink(untrustedContent.data);
  if (!content) {
    reportError('normalize delete link failed', content);
    return null;
  }
  console.log('normalize delte link response', content);
  return content.result.data;
};

export const normalizeValidateReferenceName = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize validate reference name failed');
    return null;
  }
  return content;
};

export const normalizeSaveForm = (untrustedContent) => {
  const content = validateSaveForm(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize save form failed');
    return null;
  }
  return content;
};

export const normalizeSaveFlow = (untrustedContent) => {
  const content = validateSaveFlow(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize save flow failed');
    return null;
  }
  return content;
};

export const normalizePublishFlow = (untrustedContent) => {
  const content = validatePublishFlow(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize publish flow failed');
    return null;
  }
  return content;
};

export const normalizeValidateFlow = (untrustedContent) => {
  const content = validateFlowValidateAPI(untrustedContent.data);
  if (!content) {
    reportError('normalize validate flow failed');
    return null;
  }
  return content;
};

export const normalizeDeleteFlow = (untrustedContent) => {
  const content = validateDeleteFlow(untrustedContent.data);
  if (!content) {
    reportError('normalize delete flow failed');
    return null;
  }
  return content;
};

export const normalizeDiscardFlow = (untrustedContent) => {
  const content = untrustedContent.data;
  if (!content) {
    reportError('normalize discard flow failed');
    return null;
  }
  return content;
};

export const normalizeGetFieldDependency = (untrustedContent) => {
  const content = validateGetFieldDependency(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize get field dependency failed');
    return null;
  }
  return content;
};

export const normalizeGetFormDependency = (untrustedContent) => {
  const content = validateGetFormDependency(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize get form dependency failed');
    return null;
  }
  return content;
};

export const normalizeGetStepDependency = (untrustedContent) => {
  const content = validateGetStepDependency(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize get step dependency failed');
    return null;
  }
  return content;
};

export const normalizeGetFlowDependency = (untrustedContent) => {
  const content = validateGetFlowDependency(untrustedContent.data);
  if (!content) {
    reportError('normalize get step link dependency failed');
    return null;
  }
  return content.result.data;
};

export const normalizeFlowList = (untrustedContent) => {
  const content = validateFlowList(untrustedContent.data.result.data);
  if (!content) {
    reportError(`normalize ${flow_list} Data failed`);
    return null;
  }
  return content;
};

export const normalizeFlowListUpdate = (untrustedContent) => {
  const content = validateFlowListupdate(untrustedContent.data.result.data);
  if (!content) {
    reportError(`normalize ${flow_list} Data failed`);
    return null;
  }
  return content;
};

export const normalizeGetAllSteps = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError(`normalize ${flow_list} Data failed`);
    return null;
  }
  return content;
};

export const normalizeGetFormByStepId = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError(`normalize ${flow_list} Data failed`);
    return null;
  }
  return content;
};

const validateInitiateFlow = (content) => {
  const requiredProps = ['task_log_id'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate initiate flow failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateGetAllInitiateFlows = (content) => {
  const requiredProps = ['_id', 'flow_name', 'flow_description', 'status', 'flow_uuid'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate GetAllInitiateFlows failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeGetAllInitiateFlows = (untrustedContent) => {
  const trustedPagination = validatePagination(untrustedContent);
  if (!trustedPagination) {
    reportError(`normalize ${flow_list} GetAllInitiateFlows failed`);
    return null;
  }
  trustedPagination.pagination_data &&
    trustedPagination.pagination_data.length > 0 &&
    validateGetAllInitiateFlows(trustedPagination.pagination_data[0]);
  return trustedPagination;
};

export const normalizeInitiateFlow = (untrustedContent) => {
  const content = validateInitiateFlow(untrustedContent);
  if (!content) {
    reportError('normalize initiate flow failed');
    return null;
  }
  return content;
};

const validateGetFlowInstancesByUUID = (content) => {
  const requiredProps = [
    '_id',
    'initiated_by',
    'initiated_on',
    'status',
    'flow_id',
    'flow_uuid',
    'total_tasks',
    'completed_tasks',
    'completed_percentage',
    'task_owner',
  ];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate GetAllInitiateFlows failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeGetFlowInstancesByUUID = (untrustedContent) => {
  const trustedPagination = validatePagination(untrustedContent);
  if (!trustedPagination) {
    reportError(`normalize ${flow_list} GetFlowInstancesByUUID failed`);
    return null;
  }

  trustedPagination.pagination_data &&
    trustedPagination.pagination_data.length > 0 &&
    validateGetFlowInstancesByUUID(trustedPagination.pagination_data[0]);

  if (
    trustedPagination.pagination_data &&
    trustedPagination.pagination_data.length > 0 &&
    hasOwn(trustedPagination.pagination_data[0], 'initiated_by')
  ) {
    trustedPagination.pagination_data[0].initiated_by && validateUser(trustedPagination.pagination_data[0].initiated_by);
  }

  if (
    trustedPagination.pagination_data &&
    trustedPagination.pagination_data.length > 0 &&
    hasOwn(trustedPagination.pagination_data[0], 'task_owner')
  ) {
    if (
      hasOwn(trustedPagination.pagination_data[0].task_owner, 'users') ||
      hasOwn(trustedPagination.pagination_data[0].task_owner, 'teams')
    ) {
      if (trustedPagination.pagination_data[0].task_owner.users) {
        trustedPagination.pagination_data[0].task_owner.users.length > 0 &&
          validateUser(trustedPagination.pagination_data[0].task_owner.users[0]);
      }
      if (trustedPagination.pagination_data[0].task_owner.teams) {
        trustedPagination.pagination_data[0].task_owner.teams.length > 0 &&
          validateTeam(trustedPagination.pagination_data[0].task_owner.teams[0]);
      }
    }
  }

  return trustedPagination;
};

const validateGetFlowAccessByUUID = (content) => {
  const requiredProps = ['show_initiate', 'show_view', 'show_edit'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate GetFlowAccessByUUID failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validatePaginationData = (paginationData) => {
  console.log('entryTask', paginationData);
  const requiredProps = ['_id', 'task_metadata_uuid', 'task_name', 'assigned_to', 'due_date'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(paginationData, prop)) {
      reportError(`pagination data failed : ${prop} missing`);
      return null;
    }
    return prop;
  });
  return paginationData;
};

export const normalizeGetFlowAccessByUUID = (untrustedContent) => {
  const content = validateGetFlowAccessByUUID(untrustedContent);
  if (!content) {
    reportError(`normalize ${flow_list} GetFlowAccessByUUID failed`);
    return null;
  }
  return content;
};

const validateGetFlowDetailsByUUID = (content) => {
  const requiredProps = ['version_document', 'document_url_details'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate GetFlowDetailsByUUID failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeGetFlowDetailsByUUID = (untrustedContent) => {
  const content = validateGetFlowDetailsByUUID(untrustedContent);
  if (!content) {
    reportError(`normalize ${flow_list} GetFlowDetailsByUUID failed`);
    return null;
  }
  return content;
};

export const normalizeGetFirstFormDetails = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError(`normalize ${flow_list} GetFlowAccessByUUID failed`);
    return null;
  }
  return content;
};

const validateGetAllFields = (content) => {
  const requiredProps = ['field_type', 'field_uuid', 'reference_name', '_id'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate GetAllInitiateFlows failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateGetAllTableFields = (content) => {
  const requiredProps = ['table_reference_name', 'table_uuid', '_id'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate get all tables list by filter failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeGetFieldConfigById = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  // validation ti be added
  if (!content) {
    reportError(`normalize ${flow_list} get field config failed`);
    return null;
  }
  return content;
};

export const normalizeGetAllFields = (untrustedContent) => {
  const trustedPagination = validatePagination(untrustedContent.data.result.data);
  if (!trustedPagination) {
    reportError(`normalize ${flow_list} GetAllFields failed`);
    return null;
  }
  trustedPagination.pagination_data &&
    trustedPagination.pagination_data.length > 0 &&
    validateGetAllFields(trustedPagination.pagination_data[0]);
  return trustedPagination;
};

export const normalizeGetAllTableFields = (untrustedContent) => {
  const trustedPagination = validatePagination(untrustedContent.data.result.data);
  if (!trustedPagination) {
    reportError(`normalize ${flow_list} get all tables failed`);
    return null;
  }
  trustedPagination.pagination_data &&
    trustedPagination.pagination_data.length > 0 &&
    validateGetAllTableFields(trustedPagination.pagination_data[0]);
  return trustedPagination;
};

const validateFlowDetails = (content) => {
  const requiredProps = ['flow_name'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate FlowDetails failed: ${prop} missing`);
      return null;
    }
    return prop;
  });

  return content;
};

export const normalizeFlowDetails = (untrustedContent) => {
  const data = validateFlowDetails(untrustedContent.data.result.data);
  if (!data) {
    reportError('normalize flow details failed');
    return null;
  }
  return data;
};

const validateFlowStepDetailsById = (content) => {
  const requiredProps = ['step_name'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate FlowStepDetailsById failed: ${prop} missing`);
      return null;
    }
    return prop;
  });

  return content;
};

export const normalizeFlowStepDetailsById = (untrustedContent) => {
  const data = validateFlowStepDetailsById(untrustedContent);
  if (!data) {
    reportError('normalize FlowStepDetailsById failed');
    return null;
  }
  return data;
};

const validateAllFlowSteps = (content) => {
  const requiredProps = ['flow_steps'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate AllFlowSteps failed: ${prop} missing`);
      return null;
    }
    return prop;
  });

  return content;
};

export const normalizeAllFlowSteps = (untrustedContent) => {
  const validateData = validateAllFlowSteps(untrustedContent);
  if (!validateData) {
    reportError('normalize AllFlowSteps failed');
    return null;
  }
  return validateData && untrustedContent;
};

const validateAllFieldsList = (content) => {
  const requiredProps = ['pagination_details', 'pagination_data'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate AllFieldsList failed: ${prop} missing`);
      return null;
    }
    return prop;
  });

  return content;
};

export const normalizeAllSystemFields = (untrustedContent) => {
  if (!untrustedContent) {
    reportError('normalize AllFieldsList failed');
    return null;
  }
  return untrustedContent;
};

export const normalizeAllFieldsList = (untrustedContent) => {
  const validateData = validateAllFieldsList(untrustedContent);
  if (!validateData) {
    reportError('normalize AllFieldsList failed');
    return null;
  }

  const modifiedFields = validateData?.pagination_data?.map((field) => {
    return {
      ...field,
      label: field?.field_name,
      value: field?.field_uuid,
      fieldType: field?.field_type,
      tableUUID: field?.table_uuid,
    };
  }) || [];

  const modifiedContent = {
    ...validateData,
    dateFields: modifiedFields,
    modifiedFields: modifiedFields,
    paginationDetails: {
      page: validateData?.pagination_details?.[0]?.page || 1,
      totalCount: validateData?.pagination_details?.[0]?.total_count || 0,
    },
  };

  return modifiedContent;
};

export const normalizeAllFields = (untrustedContent) => {
  const validateData = validateAllFieldsList(untrustedContent);
  if (!validateData) {
    reportError('normalize AllFieldsList failed');
    return null;
  }

  const modifiedFields = validateData?.pagination_data?.map((field) => {
    return {
      ...field,
      value: field?.field_uuid,
      fieldType: field?.field_type,
      tableUUID: field?.table_uuid,
    };
  }) || [];

  const modifiedContent = {
    ...validateData,
    modifiedFields: modifiedFields,
    paginationDetails: {
      page: validateData?.pagination_details?.[0]?.page || 1,
      totalCount: validateData?.pagination_details?.[0]?.total_count || 0,
    },
  };

  return modifiedContent;
};

const validateRuleOperatorsByFieldType = (content) => {
  const requiredProps = ['singleline', 'yesorno'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate RuleOperatorsByFieldType failed: ${prop} missing`);
      return null;
    }
    return prop;
  });

  return content;
};

export const normalizeRuleOperatorsByFieldType = (untrustedContent) => {
  const validateData = validateRuleOperatorsByFieldType(untrustedContent);
  if (!validateData) {
    reportError('normalize RuleOperatorsByFieldType failed');
    return null;
  }
  return validateData;
};

const validateRuleDetailsById = (content) => {
  const requiredProps = ['rule_details'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate RuleDetailsById failed: ${prop} missing`);
      return null;
    }
    return prop;
  });

  return content;
};

export const normalizeRuleDetailsById = (untrustedContent) => {
  const validateData = validateRuleDetailsById(untrustedContent);
  if (!validateData) {
    reportError('normalize RuleDetailsById failed');
    return null;
  }
  return validateData;
};

const validateSaveRule = (content) => {
  const requiredProps = ['_id', 'rule'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate SaveRule failed: ${prop} missing`);
      return null;
    }
    return prop;
  });

  return content;
};

export const normalizeSaveRule = (untrustedContent) => {
  const validateData = validateSaveRule(untrustedContent);
  if (!validateData) {
    reportError('normalize SaveRule failed');
    return null;
  }
  return validateData;
};

export const normalizeTestIntegration = (untrustedContent) => {
  const validateData = untrustedContent;
  return validateData;
};

export const normalizeSaveStepStatuses = (untrustedContent) => {
   const validateData = untrustedContent;
   if (!validateData) {
      reportError('normalize save step statuses failed');
      return null;
    }
    return validateData;
};

const validateGetAllSelfInitiatedFlows = (content) => {
  if (content.pagination_data.length > 0) {
    const requiredProps = ['flow_id', 'flow_uuid', 'flow_name', 'status', 'identifier'];
    requiredProps.forEach((prop) => {
      if (!hasOwn(content.pagination_data[0], prop)) {
        reportError(`validate getAllSelfInitiatedFlows failed: ${prop} missing`);
      }
    });
  }
  return content;
};

export const normalizeGetAllSelfInitiatedFlows = (untrustedContent) => {
  const content = validateGetAllSelfInitiatedFlows(untrustedContent);
  if (!content) {
    reportError(`normalize ${flow_list} getAllSelfInitiatedFlows failed`);
    return null;
  }
  return content;
};

const validateGetInstanceDetailsByID = (content) => {
  const requiredProps = ['_id', 'identifier'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate apiGetInstanceDetailsByID failed: ${prop} missing`);
    }
  });
  return content;
};

export const normalizeGetInstanceDetailsByID = (untrustedContent) => {
  const content = validateGetInstanceDetailsByID(untrustedContent);
  if (!content) {
    reportError('normalize apiGetInstanceDetailsByID failed');
    return null;
  }
  return content;
};

const validateGetInstanceSummaryByID = (content) => {
  const requiredProps = ['instance_summary', 'document_url_details'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate apiGetInstanceSummaryByID failed: ${prop} missing`);
    }
  });
  return content;
};

export const normalizeGetInstanceSummaryByID = (untrustedContent) => {
  const content = validateGetInstanceSummaryByID(untrustedContent);
  if (!content) {
    reportError('normalize apiGetInstanceSummaryByID failed');
    return null;
  }
  return content;
};

export const validateGetAllFlowStepsWithForm = (content) => {
  const requiredProps = ['pagination_details', 'pagination_data'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get all flow steps with form failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};
export const validateDeleteTestBedFlow = (content) => {
  const requiredProps = ['_id'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get all flow steps with form failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};
export const normalizeGetAllFlowStepsWithForm = (untrustedContent) => {
  const content = validateGetAllFlowStepsWithForm(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize get all flow steps with form failed');
    return null;
  }
  return content;
};

export const normalizeFlowTaskDetails = (untrustedContent) => {
  console.log('sri123', untrustedContent);
  const content = untrustedContent.data.result.data;
  console.log('content123', content);
  const paginationData = content.pagination_data;
  if (paginationData.length === 0) {
    return content;
  }
  validatePaginationData(paginationData[0]);

  if (!content) {
    reportError('datalist entry task details failed');
    return null;
  }
  return content;
};

export const normalizeDeleteTestBedFlow = (untrustedContent) => {
  const content = validateDeleteTestBedFlow(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize delete test bed failed');
    return null;
  }
  return content;
};

export const normalizeAddNewNotes = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('add new notes result failed');
    return null;
  }
  return content;
};

export const normalizeAddShortcuts = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('No Shorcuts result Found');
    return null;
  }
  return content;
};
export const normalizeTriggerNames = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('No Shorcuts Trigger Names Found');
    return null;
  }
  return content;
};

const validateGetReportDownloadDocs = (content) => {
  const requiredProps = ['_id'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate apiGetReportDownloadDocs failed: ${prop} missing`);
    }
  });
  return content;
};

const validateTriggerData = (content) => {
  const requiredProps = ['trigger_details'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate apiGetTriggerDetails failed: ${prop} missing`);
    }
  });
  return content;
};

export const normalizeGetReportDownloadDocs = (untrustedContent) => {
  const content = validateGetReportDownloadDocs(untrustedContent);
  if (!content) {
    reportError('normalize apiGetReportDownloadDocs failed');
    return null;
  }
  return content;
};

export const normalizeSaveEscalations = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('add new notes result failed');
    return null;
  }
  return content;
};

export const normalizeSaveDocumentGeneration = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('add new notes result failed');
    return null;
  }
  return content;
};

export const normalizeGetDocumentGeneration = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('get doc generation failed');
    return null;
  }
  return {
    document_generation: [content?.flow_step?.document_generation],
    field_details: content?.field_metadata,
  };
};

export const normalizeSaveSendEmail = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('add new notes result failed');
    return null;
  }
  return content;
};

export const normalizeSendDataToDatalist = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('add new notes result failed');
    return null;
  }
  return content;
};

export const normalizeDeleteFlowCofigurations = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('add new notes result failed');
    return null;
  }
  return content;
};

export const normalizeSaveStepCoordinates = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('save step coordinates failed');
    return null;
  }
  return content;
};

export const normalizeTaskReassign = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('task reassign failed');
    return null;
  }
  return content;
};

export const normalizeGetPrecedingSteps = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('get preceding steps api failed');
    return null;
  }
  return content;
};

export const normalizeTriggerDetails = (untrustedContent) => {
  console.log('normalize trigger details', untrustedContent);
  const content = validateTriggerData(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize apiGetReportDownloadDocs failed');
    return null;
  }
  return content;
};

export const normalizeGetAllTriggerDetails = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('get all trigger details result failed');
    return null;
  }
  return content;
};
const validateGetAllUsers = (content) => {
  let requiredProps = ['pagination_data', 'pagination_details'];
  let invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate getAllUsers failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (!jsUtility.isEmpty(content.pagination_data)) {
    if (invalidData) return null;
    // checking result object's fields
    requiredProps = [
      'email',
      'username',
      '_id',
      'user_type',
      'is_active',
    ];
    invalidData = requiredProps.some((prop) => {
      if (!Object.prototype.hasOwnProperty.call(content.pagination_data[0], prop)) {
        reportError(`validate getAllUsers failed inside pagination_data: ${prop} missing`);
        return true;
      }
      return false;
    });
  }
  if (invalidData) return null;
  return content;
};

export const normalizeGetFlowLanguagesTranslationStatus = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('get flow translation language failed');
    return null;
  }
  return content;
};
export const normalizeAllUsers = (untrustedContent) => {
  const content = validateGetAllUsers(untrustedContent.data.result.data);
  if (!content) {
    reportError('validate getAllUsers failed');
    return null;
  }
  return content;
};

export const normalizeGetFlowDataByLocale = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('get flow data by locale failed');
    return null;
  }
  return content;
};

export const normalizeSaveFlowDataByLocale = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('save flow data by locale failed');
    return null;
  }
  return content;
};

export const normalizeSaveStepAction = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('save flow step action data failed');
    return null;
  }
  return content;
};

export const normalizeGetStepAction = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('get action data failed');
    return null;
  }
  return content;
};

export const normalizeGenerateEntityReferenceName = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('generate reference name failed');
    return null;
  }
  return content;
};

export const normalizeSaveStartStepAction = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('save flow start step action data failed');
    return null;
  }
  return content;
};

export const normalizeSaveConnectorLine = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('save connector line failed');
    return null;
  }
  return content;
};

export const normalizeGetFlowBasicDetails = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('getFlowBasicDetails failed');
    return null;
  }
  return convertBeToFeKeys(content, {}, [], []);
};

export const normalizeGetFlowSummaryInfo = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('getFlowSummaryInfo failed');
    return null;
  }
  return convertBeToFeKeys(content, {}, [], ['users', 'teams', 'translation_status']);
};

export const normalizeGetFlowSecurityInfo = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('getFlowSummaryInfo failed');
    return null;
  }
  return convertBeToFeKeys(content, {}, [], ['users', 'teams', 'access_to', 'policy', 'policy_uuid', 'policy_fields']);
};

export default normalizeFlowList;
