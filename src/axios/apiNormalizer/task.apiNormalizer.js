import { constructFieldDataFromApi } from '../../containers/form/form_builder/form_body/FormBody.utils';
import { constructTreeStructure } from '../../containers/form/sections/form_layout/FormLayout.utils';
import {
  validatePaginationData,
  validatePaginationDetails,
} from '../../utils/apiServiceAndNormalizerUtils';
import jsUtils, { get, nullCheck } from '../../utils/jsUtility';
import { getSignedUrlFromDocumentUrlDetails } from '../../utils/profileUtils';
import { reportError, hasOwn } from '../../utils/UtilityFunctions';
import { validatePagination } from './common.apiNormalizer';

const context = 'task';

const validateTaskListData = (content) => {
  let requiredProps = ['pagination_details', 'pagination_data'];
  let missingDataList = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${context} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (missingDataList.length > 0) return null;
  // check list data
  requiredProps = ['_id', 'task_name'];
  missingDataList = content.pagination_data.filter((data) =>
    requiredProps.some((reqProp) => {
      if (reqProp === 'task_name') {
        if (
          !Object.prototype.hasOwnProperty.call(data, reqProp) &&
          !Object.prototype.hasOwnProperty.call(data, 'flow_name')
        ) {
          reportError(`validate ${context} data failed: ${reqProp} missing`);
          return true;
        }
      } else if (!Object.prototype.hasOwnProperty.call(data, reqProp)) {
        reportError(`validate ${context} data failed: ${reqProp} missing`);
        return true;
      }
      return false;
    }));

  if (missingDataList.length > 0) return null;
  // check pagination details
  requiredProps = ['page', 'size', 'total_count'];
  missingDataList = requiredProps.filter((prop) => {
    if (
      !Object.prototype.hasOwnProperty.call(content.pagination_details[0], prop)
    ) {
      reportError(`validate ${context} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;

  return content;
};

export const validateAssignedTaskListData = (content, assignedTaskType) => {
  if (assignedTaskType === 'open') {
    const requiredProps = ['open_task'];
    const missingDataList = requiredProps.filter((prop) => {
      if (!Object.prototype.hasOwnProperty.call(content, prop)) {
        reportError(`validate ${context} data failed: ${prop} missing`);
        return true;
      }
      return false;
    });

    if (missingDataList.length > 0) return null;

    const openTaskContent = validateTaskListData(content.open_task);
    if (!openTaskContent) {
      reportError(`normalize ${context} data failed`);
      return null;
    }
    return content;
  } else if (assignedTaskType === 'completed') {
    const requiredProps = ['completed_task'];
    const missingDataList = requiredProps.filter((prop) => {
      if (!Object.prototype.hasOwnProperty.call(content, prop)) {
        reportError(`validate ${context} data failed: ${prop} missing`);
        return true;
      }
      return false;
    });

    if (missingDataList.length > 0) return null;

    const completedTaskContent = validateTaskListData(content.completed_task);

    if (!completedTaskContent) {
      reportError(`normalize ${context} data failed`);
      return null;
    }
    return content;
  } else {
    if (
      !jsUtils.isEmpty(content.open_task) &&
      !jsUtils.isEmpty(content.completed_task)
    ) {
      const openTaskContent = validateTaskListData(content.open_task);
      const completedTaskContent = validateTaskListData(content.completed_task);
      if (openTaskContent && completedTaskContent) {
        return content;
      } else {
        reportError(`normalize ${context} data failed`);
        return null;
      }
    } else {
      if (!jsUtils.isEmpty(content.open_task)) {
        const openTaskContent = validateTaskListData(content.open_task);
        if (openTaskContent) {
          return content;
        } else {
          reportError(`normalize ${context} data failed`);
          return null;
        }
      }
      if (!jsUtils.isEmpty(content.completed_task)) {
        const completedTaskContent = validateTaskListData(
          content.completed_task,
        );
        if (completedTaskContent) {
          return content;
        } else {
          reportError(`normalize ${context} data failed`);
          return null;
        }
      }
    }
    return content;
  }
};

export const normalizeTaskList = (untrustedContent) => {
  const content = validateTaskListData(untrustedContent.data.result.data);
  if (!content) {
    reportError(`normalize ${context} data failed`);
    return null;
  }
  return content;
};

export const normalizeAssignedTaskList = (
  untrustedContent,
  assignedTaskType,
) => {
  const content = validateAssignedTaskListData(
    untrustedContent.data.result.data,
    assignedTaskType,
  );
  if (!content) {
    reportError(`normalize ${context} data failed`);
    return null;
  }
  return content;
};

const validateTaskdata = (content) => {
  const requiredProps = [
    'task_status',
    'task_name',
    // 'task_metadata_uuid',
    'task_metadata_id',
    '_id',
    'instance_id',
    'assigned_to',
    'assigned_on',
  ];

  const metadataInfoRequiredProp = [
    'published_on',
    'published_by',
    // 'collect_data',
    'flow_name',
  ];

  const flowRequiredProp = [
    // 'flow_color',
    'step_name',
  ];

  const missingDataList = requiredProps.filter((reqProp) => {
    if (reqProp === 'task_name') {
      if (
        !Object.prototype.hasOwnProperty.call(content.task_log_info, reqProp) &&
        !Object.prototype.hasOwnProperty.call(
          content.task_log_info,
          'flow_name',
        )
      ) {
        reportError(`validate ${context} data failed: ${reqProp} missing`);
        return true;
      }
    } else if (reqProp === 'task_metadata_id') {
      if (
        !Object.prototype.hasOwnProperty.call(content.task_log_info, reqProp) &&
        !Object.prototype.hasOwnProperty.call(
          content.task_log_info,
          'flow_id',
        )
      ) {
        reportError(`validate ${context} data failed: ${reqProp} missing`);
        return true;
      }
    } else if (reqProp === 'task_metadata_uuid') {
      if (
        !Object.prototype.hasOwnProperty.call(content.task_log_info, reqProp) &&
        !Object.prototype.hasOwnProperty.call(
          content.task_log_info,
          'flow_uuid',
        )
      ) {
        reportError(`validate ${context} data failed: ${reqProp} missing`);
        return true;
      }
    } else if (
      !Object.prototype.hasOwnProperty.call(content.task_log_info, reqProp)
    ) {
      reportError(`validate ${context} data failed: ${reqProp} missing`);
      return true;
    }
    return false;
  });
  const missingDataListMetaDataInfo = metadataInfoRequiredProp.filter(
    (reqProp) => {
      if (reqProp === 'flow_name') {
        if (
          !Object.prototype.hasOwnProperty.call(
            content.metadata_info,
            reqProp,
          ) &&
          !Object.prototype.hasOwnProperty.call(
            content.metadata_info,
            'task_name',
          )
        ) {
          reportError(`validate ${context} data failed: task_name missing`);
          return true;
        }
        if (
          Object.prototype.hasOwnProperty.call(
            content.metadata_info,
            'task_name',
          )
        ) return false;
        const procRequired = flowRequiredProp.filter((flowProp) => {
          if (
            !Object.prototype.hasOwnProperty.call(
              content.metadata_info,
              flowProp,
            )
          ) {
            reportError(
              `validate ${context} data failed: ${flowProp} missing`,
            );
            return true;
          }
          return false;
        });
        return procRequired.length > 0;
      }
      if (
        !Object.prototype.hasOwnProperty.call(content.metadata_info, reqProp)
      ) {
        reportError(`validate ${context} data failed: ${reqProp} missing`);
        return true;
      }
      return false;
    },
  );
  if (missingDataList.length > 0 || missingDataListMetaDataInfo.length > 0) return null;
  return content;
};

export const normalizeTaskData = (untrustedContent) => {
  const content = validateTaskdata(untrustedContent.data.result.data);
  if (!content) {
    reportError(`normalize ${context} data failed`);
    return null;
  }
  return content;
};

const validateTaskMetadataResponseSummary = (content) => {
  const requiredProps = [
    '_id',
    'task_description',
    'task_metadata_uuid',
    'task_name',
  ];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`task response summary failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeTaskMetadataResponseSummary = (untrustedContent) => {
  const content = validateTaskMetadataResponseSummary(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError(`normalize ${context} response summary data failed`);
    return null;
  }
  return content;
};

const validateFormDetailsByTaskMetadataId = (content) => {
  const requiredProps = [
    '_id',
    'task_metadata_id',
    'task_metadata_uuid',
    'sections',
  ];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`task form details failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateGetValidStepActions = (content) => {
  const requiredProps = ['all_actions', 'valid_actions', 'dependent_field'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`get valid step actions  failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const validateGetValidFormFields = (content) => {
  const requiredProps = ['fields', 'dependent_fields'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`get valid form fields  failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeFormDetailsByTaskMetadataId = (untrustedContent) => {
  const content = validateFormDetailsByTaskMetadataId(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError(`normalize ${context} form details data failed`);
    return null;
  }
  let fields = {};
  const modifiedContent = {
    ...content,
    sections: content?.sections?.map((section) => {
      fields = { ...fields, ...constructFieldDataFromApi(section?.field_metadata || {}, section?.section_uuid) };
      return {
        ...section,
        layout: constructTreeStructure(section?.contents),
      };
    }),
    fields: fields,
  };
  return modifiedContent;
};

export const normalizeGetValidStepActions = (untrustedContent) => {
  const content = validateGetValidStepActions(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError(`normalize ${context} get valid actions failed`);
    return null;
  }
  return content;
};

export const normalizeFieldVisibilityList = (untrustedContent) => {
  const content = validateGetValidFormFields(untrustedContent.data.result.data);
  if (!content) {
    reportError(`normalize ${context} get form fields failed`);
    return null;
  }
  return content;
};

export const validateCompletedAssigneesData = (data) => {
  const requiredProps = ['_id', 'assigned_to'];
  let error = false;
  data.forEach((element) => {
    jsUtils.forEach(requiredProps, (requiredProp) => {
      if (!Object.hasOwnProperty.call(element, requiredProp)) {
        console.log('assignees', requiredProp);
        reportError(`validate ${context} data failed: ${requiredProp} missing`);
        error = true;
      }
    });
  });
  if (!error) {
    if (data && data.length > 0) {
      data.forEach((element) => {
        jsUtils.forEach(['assigned_to'], (requiredProp) => {
          if (!Object.hasOwnProperty.call(element, requiredProp)) {
            console.log('assignees', requiredProp);
            reportError(
              `validate ${context} data failed: ${requiredProp} missing`,
            );
            error = true;
          }
        });
      });
      if (error) return null;
    }
    return data;
  }
  return null;
};

export const normalizeCompletedAssigneesData = (rawData) => {
  if (nullCheck(rawData, 'data.result.data.task_assignee.length')) {
    const taskAssignee = rawData.data.result.data.task_assignee.map(
      (eachAssignee) => {
        const assignedTo = [];
        if (nullCheck(eachAssignee, 'assigned_to.users.length', true)) {
          eachAssignee.assigned_to.users.forEach((eachUser) =>
            assignedTo.push({ ...eachUser, isTeam: false }));
        }
        if (nullCheck(eachAssignee, 'assigned_to.teams.length', true)) {
          eachAssignee.assigned_to.teams.forEach((eachTeam) =>
            assignedTo.push({ ...eachTeam, isTeam: true }));
        }
        return {
          ...eachAssignee,
          assigned_to: assignedTo[0],
        };
      },
    );
    const data = {
      task_assignee: validateCompletedAssigneesData(taskAssignee),
      document_url_details: get(
        rawData,
        'data.result.data.document_url_details',
      ),
      task_all_assignee: get(rawData, 'data.result.data.task_assignee'),
    };
    if (!data) {
      reportError(`normalize ${data}  data failed`);
      return null;
    }
    return data;
  }
  return null;
};

export const validateTaskMetadataActiveParticipants = (data) => {
  const requiredProps = ['_id', 'email'];
  data.forEach((element) => {
    jsUtils.forEach(requiredProps, (requiredProp) => {
      if (!Object.hasOwnProperty.call(element, requiredProp)) {
        console.log('assignees', requiredProp);
        reportError(`validate ${context} data failed: ${requiredProp} missing`);
      }
    });
  });
  return data;
};

export const normalizeTaskMetadataActiveParticipants = (rawData) => {
  if (nullCheck(rawData, 'data.result.data.pagination_data.length')) {
    const docUrls = get(rawData, 'data.result.data.document_url_details');
    validateTaskMetadataActiveParticipants(
      get(rawData, 'data.result.data.pagination_data', []),
    );
    const usersWithProfilePic = rawData.data.result.data.pagination_data.map(
      (eachUser) => {
        return {
          ...eachUser,
          profile_pic: getSignedUrlFromDocumentUrlDetails(
            docUrls,
            eachUser.profile_pic,
          ),
        };
      },
    );
    if (!usersWithProfilePic) {
      reportError(`normalize ${usersWithProfilePic} data failed`);
      return null;
    }
    return {
      paginationData: usersWithProfilePic,
      paginationDetails: get(
        rawData,
        'data.result.data.pagination_details',
        [],
      ),
    };
  }
  return null;
};

export const normalizeGetAllInstancesApiResponse = (apiResponse) => {
  const paginationData = validatePaginationData(
    get(apiResponse, 'data.result.data.pagination_data', []),
    ['_id', 'status', 'participant'],
    'Get All Instances',
  );
  const paginationDetails = validatePaginationDetails(
    get(apiResponse, 'data.result.data.pagination_details', []),
    undefined,
    'Get All Instances',
  );
  return {
    paginationData,
    paginationDetails,
  };
};

const validateTaskCountData = (data) => {
  const requiredProps = [
    {
      prop: 'active_task_count',
      type: 'Number',
    },
    {
      prop: 'completed_task_count',
      type: 'Number',
    },
    {
      prop: 'active_task_overdue_count',
      type: 'Number',
    },
  ];
  let error = false;
  jsUtils.forEach(requiredProps, (requiredProp) => {
    if (!Object.hasOwnProperty.call(data, requiredProp.prop)) {
      reportError(
        `validate ${context} data failed: ${requiredProp.prop} missing`,
      );
      error = true;
    }
  });
  if (error) return null;
  return data;
};
export const normalizeTaskCountData = (rawData) => {
  const content = validateTaskCountData(rawData.data.result.data);
  if (!content) {
    reportError(`normalize ${context}  data failed`);
    return null;
  }
  return content;
};

const validateTaskMetadata = (data) =>
  // const requiredProps = [
  //   // 'assignees',
  //   'collect_data',
  //   'is_assign_to_individual_assignees', // previously is_anyone
  //   'is_deleted',
  //   'status',
  //   '_id',
  //   'account_id',
  //   'task_metadata_uuid',
  //   'task_name',
    // 'version_number', // removed
    // 'completed_tasks',
    // 'published_by',
    // 'published_on',
    // 'task_code',
    // 'total_tasks',
  // ];
  // let error = false;
  // requiredProps.forEach((requiredProp) => {
  //   if (!Object.hasOwnProperty.call(data, requiredProp)) {
  //     console.log('required prop in normalizer missing', requiredProp);
  //     reportError(`validate ${context} data failed: ${requiredProp} missing`);
  //     error = true;
  //   }
  // });
  // if (error) return null;
   data;

export const normalizeTaskMetadata = (rawData) => {
  const content = validateTaskMetadata(rawData.data.result.data);
  if (!content) {
    reportError(`normalize ${context}  data failed`);
    return null;
  }
  return content;
};

const validateSubmitTask = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate SubmitTask failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeSubmitTask = (untrustedContent) => {
  const content = validateSubmitTask(untrustedContent.data);
  if (!content) {
    reportError(`normalize ${context} data failed`);
    return null;
  }
  return content;
};

export const normalizeReplicateTask = (untrustedContent) => {
  const content = untrustedContent.data;
  if (!content) {
    reportError(`normalize ${context} data failed`);
    return null;
  }
  return content;
};

const validateGetActionHistory = (content) => {
  const requiredProps0 = [
    '_id',
    'instance_id',
    'task_log_id',
    'performed_by',
  ];
  requiredProps0.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate GetActionHistory failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  const requiredProps1 = [
    '_id',
    'username',
    'first_name',
    'last_name',
    'is_active',
    'user_type',
  ];
  const performedByData = content.performed_by && content.performed_by;
  requiredProps1.forEach((prop) => {
    if (!hasOwn(performedByData, prop)) {
      reportError(
        `validate GetActionHistory performed_by failed: ${prop} missing`,
      );
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeGetActionHistoryByInstanceId = (untrustedContent) => {
  const trustedPagination = validatePagination(untrustedContent);
  if (!trustedPagination) {
    reportError(`normalize ${context} GetActionHistoryByInstanceId failed`);
    return null;
  }
  trustedPagination.pagination_data &&
    trustedPagination.pagination_data.length > 0 &&
    validateGetActionHistory(trustedPagination.pagination_data[0]);
  return trustedPagination;
};

export const validateCancelTask = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate cancel task failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeCancelTask = (untrustedContent) => {
  const content = validateGetValidFormFields(untrustedContent.data);
  if (!content) {
    reportError(`normalize ${context} cancel task failed`);
    return null;
  }
  return content;
};

const validateAssignTaskToParticipants = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate AssignTaskToParticipants failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeAssignTaskToParticipants = (untrustedContent) => {
  const content = validateAssignTaskToParticipants(untrustedContent.data);
  if (!content) {
    reportError(`normalize ${context} cancel task failed`);
    return null;
  }
  return content;
};

const validateNudgeTask = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate Nudge Task failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeNudgeTask = (untrustedContent) => {
  const content = validateNudgeTask(untrustedContent.data);
  if (!content) {
    reportError(`normalize ${context} cancel task failed`);
    return null;
  }
  return content;
};

export default normalizeTaskList;
