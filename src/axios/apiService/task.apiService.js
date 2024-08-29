import axios from 'axios';
import { axiosPostUtils, axiosGetUtils } from '../AxiosHelper';
import {
  normalizeIsEmpty,
  getLoaderConfig,
} from '../../utils/UtilityFunctions';
import {
  GET_ACTIVE_TASKS,
  GET_SORTED_ACTIVE_TASKS,
  GET_TASK_DETAILS,
  GET_COMPLETED_TASKS,
  GET_SORTED_COMPLETED_TASKS,
  GET_TASKS_ASSIGNED_TO_OTHERS,
  GET_TASKS_BOTH_ASSIGNED_TO_OTHERS,
  GET_TASK_COUNT,
  SUBMIT_TASK,
  UPDATE_TASK_STATUS,
  REJECT_TASK,
  GET_ACTION_HISTORY_BY_INSTANCE_ID,
  GET_TASK_METADATA_RESPONSE_SUMMARY,
  GET_TASK_COMPLETED_ASSIGNEES,
  // GET_VALID_STEP_ACTIONS,
  GET_TASK_METADATA,
  GET_SELF_TASKS,
  GET_SORTED_SELF_TASKS,
  GET_VALID_FORM_FIELDS,
  CANCEL_TASK,
  ASSIGN_TASK_TO_PARTICIPANTS,
  GET_ALL_INSTANCES,
  NUDGE_TASK,
  GET_TASK_METADATA_ACTIVE_PARTICIPANTS,
  GET_DRAFT_TASKS,
  GET_EXPORT_TASK_DETAILS,
  UPDATE_ACTIVE_TASK_DETAILS,
  REPLICATE_TASK,
  SNOOZE_TASK,
  GET_REASSIGN_TASK,
  SAVE_NOTES,
  GET_FORM_DETAILS,
} from '../../urls/ApiUrls';
import { getCancelTokenAssignedTask, getCancelTokenBothAssignedTask, getCancelTokenCompletedTask, getCancelTokenDraftTask, getCancelTokenActiveTask } from '../../containers/landing_page/my_tasks/MyTasks';
import {
  cancelTokenForGetAllInstancesByTaskMetadataUuid,
  getCancelTokenTaskDetails,
  // getCancelTokenUpdateActions,
} from '../../containers/landing_page/my_tasks/task_content/TaskContent';
import {
  normalizeTaskList,
  normalizeAssignedTaskList,
  normalizeTaskData,
  normalizeSubmitTask,
  normalizeGetActionHistoryByInstanceId,
  normalizeTaskCountData,
  normalizeTaskMetadataResponseSummary,
  normalizeCompletedAssigneesData,
  // normalizeGetValidStepActions,
  normalizeFieldVisibilityList,
  normalizeCancelTask,
  normalizeTaskMetadataActiveParticipants,
  normalizeAssignTaskToParticipants,
  normalizeGetAllInstancesApiResponse,
  normalizeNudgeTask,
  normalizeReplicateTask,
} from '../apiNormalizer/task.apiNormalizer';
import { normalizeSuccess } from '../apiNormalizer/common.apiNormalizer';

import { getCancelTokenOfVisibilityApi, taskContentApiCancel } from '../../redux/actions/TaskActions';
import { cancelTokenForCancelTask } from '../../containers/landing_page/my_tasks/task_content/cancel_task/cancel_task_form/CancelTaskForm';
import { M_T_STRINGS } from '../../containers/landing_page/LandingPage.strings';
import { cancelTokenForTaskMetadataActiveParticipants } from '../../containers/landing_page/my_tasks/task_content/assigned_to_others/add_or_remove_assignee/AddOrRemoveAssignee';

const { CancelToken } = axios;
const setSource = () => CancelToken.source();

// Cancel Token Source's
let cancelForSubmitTask;
let sourceRejectTask;
let sourceUpdateTaskStatus;
let sourceGetActionHistoryByInstanceId;
let cancelForUpdateActiveTaskDetails;

const isWeightedSort = (sort_by) =>
  sort_by === M_T_STRINGS.TASK_LIST.SORT_PARAMETER_WEIGHTED.VALUE;

export const getActiveTaskList = (params, cancelToken) => {
   if (cancelToken?.cancelToken) cancelToken.cancelToken();
   return new Promise((resolve, reject) => {
    let url = GET_ACTIVE_TASKS;
    if (isWeightedSort(params.sort_by)) {
      url = GET_SORTED_ACTIVE_TASKS;
      delete params.sort_by;
    }
    axiosGetUtils(url, {
      params,
      cancelToken: new CancelToken((c) => {
        if (cancelToken?.setCancelToken) {
          cancelToken.setCancelToken(c);
        } else getCancelTokenActiveTask(c);
      }),
    })
      .then((response) => {
        resolve(normalizeTaskList(response));
      })
      .catch((error) => {
        reject(error);
      });
   });
};
export const getSelfTaskList = (params, cancelToken) =>
  new Promise((resolve, reject) => {
    if (cancelToken?.cancelToken) cancelToken.cancelToken();
    let url = GET_SELF_TASKS;
    if (isWeightedSort(params.sort_by)) {
      url = GET_SORTED_SELF_TASKS;
      delete params.sort_by;
    }
    axiosGetUtils(
      url,
      { params,
        cancelToken: new CancelToken((c) => {
          cancelToken?.setCancelToken(c);
        }),
      },
)
      .then((response) => {
        resolve(normalizeTaskList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getCompletedTaskList = (params, cancelToken) => {
  if (cancelToken?.cancelToken) cancelToken.cancelToken();
 return new Promise((resolve, reject) => {
    let url = GET_COMPLETED_TASKS;
    if (isWeightedSort(params.sort_by)) {
      url = GET_SORTED_COMPLETED_TASKS;
      delete params.sort_by;
    }
    if (params.sort_field && (params.sort_field === 'completed_on')) {
       params.sort_field = 'closed_on';
    }
    axiosGetUtils(
      url,
      { params,

        cancelToken: new CancelToken((c) => {
          if (cancelToken?.setCancelToken) {
            cancelToken.setCancelToken(c);
          } else getCancelTokenCompletedTask(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeTaskList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAssignedTaskList = (params, cancelToken) => {
  if (cancelToken.cancelToken) cancelToken.cancelToken();
  return new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_TASKS_ASSIGNED_TO_OTHERS,
      { params,
        cancelToken: new CancelToken((c) => {
          if (cancelToken.setCancelToken) {
            cancelToken.setCancelToken(c);
          } else getCancelTokenAssignedTask(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeTaskList(response, params.type));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getBothAssignedTaskList = (params, cancelToken) => {
  if (cancelToken?.cancelToken) cancelToken?.cancelToken();
  return new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_TASKS_BOTH_ASSIGNED_TO_OTHERS,
      { params,
        cancelToken: new CancelToken((c) => {
          if (cancelToken?.setCancelToken) {
            cancelToken.setCancelToken(c);
          } else getCancelTokenBothAssignedTask(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeAssignedTaskList(response, params.type));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getDraftTaskList = (params, cancelToken = {}) => {
  if (cancelToken?.cancelToken) cancelToken.cancelToken();
  return new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_DRAFT_TASKS,
      { params,
        cancelToken: new CancelToken((c) => {
          if (cancelToken?.setCancelToken) {
            cancelToken.setCancelToken(c);
          } else getCancelTokenDraftTask(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeTaskList(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const getTaskCount = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_TASK_COUNT,
      { params },
      {
        cacelToken: new CancelToken((c) => {
          getCancelTokenTaskDetails(c);
        }),
      },
    )
      .then((response) => resolve(normalizeTaskCountData(response)))
      .catch((error) => reject(error));
  });

export const getTaskData = (params) =>
  new Promise((resolve, reject) => {
    console.log('replicateTaskApiService getTaskData', params);
    axiosGetUtils(
      GET_TASK_DETAILS,
      { params },
      {
        cancelToken: new CancelToken((c) => {
          getCancelTokenTaskDetails(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeTaskData(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getTaskCompletedAssignees = async (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_TASK_COMPLETED_ASSIGNEES,
      { params },
      {
        cancelToken: new CancelToken((c) => {
          getCancelTokenTaskDetails(c);
        }),
      },
    )
      .then((response) => {
        resolve(normalizeCompletedAssigneesData(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getTaskMetadataActiveParticipants = async (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_TASK_METADATA_ACTIVE_PARTICIPANTS, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelTokenForTaskMetadataActiveParticipants(c);
      }),
    })
      .then((response) => {
        resolve(normalizeTaskMetadataActiveParticipants(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getAllInstancesByTaskMetadataUuid = async (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_INSTANCES, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelTokenForGetAllInstancesByTaskMetadataUuid(c);
      }),
    })
      .then((response) => {
        resolve(normalizeGetAllInstancesApiResponse(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getTaskMetadata = async (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_TASK_METADATA,
      { params },
      {
        cancelToken: new CancelToken((c) => {
          getCancelTokenTaskDetails(c);
        }),
      },
    )
      .then((response) => resolve(response.data.result.data))
      .catch((error) => reject(error));
  });

export const submitTask = (data, isFormData) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(
      SUBMIT_TASK,
      data,
      {
        ...getLoaderConfig(),
        cancelToken: new CancelToken((c) => {
          cancelForSubmitTask = c;
        }),
      },
      isFormData,
    )
      .then((response) => {
        resolve(normalizeSubmitTask(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const updateActiveTaskDetailsApiService = (data, isFormData) => {
  if (cancelForUpdateActiveTaskDetails) cancelForUpdateActiveTaskDetails();
  return new Promise((resolve, reject) => {
    axiosPostUtils(
      UPDATE_ACTIVE_TASK_DETAILS,
      data,
      {
        ...getLoaderConfig(),
        cancelToken: new CancelToken((c) => {
          cancelForUpdateActiveTaskDetails = c;
        }),
      },
      isFormData,
    )
      .then((response) => {
        resolve(normalizeSubmitTask(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const replicateTaskApiService = (params) => new Promise((resolve, reject) => {
  console.log('replicateTaskApiService', params);
  axiosGetUtils(
    REPLICATE_TASK,
    { params },
  )
      .then((response) => {
        resolve(normalizeReplicateTask(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const snoozeTaskApiService = (params) => new Promise((resolve, reject) => {
    console.log('snoozeTaskApiService', params);
    axiosPostUtils(
      SNOOZE_TASK,
      params,
    )
        .then((response) => {
          resolve(normalizeReplicateTask(response));
        })
        .catch((error) => {
          reject(error);
        });
    });

export const cancelSubmitTask =
  (cancelFunction = taskContentApiCancel) =>
  (dispatch) => {
    if (cancelForSubmitTask) {
      cancelForSubmitTask();
      dispatch(cancelFunction());
    }
  };

export const apiRejectTask = (teamData) => {
  sourceRejectTask = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(REJECT_TASK, teamData, {
      cancelToken: sourceRejectTask.token,
    })
      .then((res) => {
        const normalizeData = normalizeSuccess(res.data);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const cancelRejectTask =
  (fnCancel = taskContentApiCancel) =>
  (dispatch) => {
    sourceRejectTask && sourceRejectTask?.cancel?.('Canceled RejectTask.');
    dispatch(fnCancel());
  };

export const apiUpdateTaskStatus = (teamData) => {
  sourceUpdateTaskStatus = setSource();
  return new Promise((resolve, reject) => {
    axiosPostUtils(UPDATE_TASK_STATUS, teamData, {
      cancelToken: sourceUpdateTaskStatus.token,
    })
      .then((res) => {
        const normalizeData = normalizeSuccess(res.data);
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const cancelUpdateTaskStatus =
  (fnCancel = taskContentApiCancel) =>
  (dispatch) => {
    sourceUpdateTaskStatus &&
      sourceUpdateTaskStatus?.cancel?.('Canceled UpdateTaskStatus.');
    dispatch(fnCancel());
  };

export const apiGetActionHistoryByInstanceId = (params) => {
  sourceGetActionHistoryByInstanceId = setSource();
  console.log('apiGetActionHistoryByInstanceId', params);
  return new Promise((resolve, reject) => {
    axiosGetUtils(GET_ACTION_HISTORY_BY_INSTANCE_ID, {
      params,
      cancelToken: sourceGetActionHistoryByInstanceId.token,
    })
      .then((res) => {
        const normalizeData = normalizeGetActionHistoryByInstanceId(
          res.data.result.data,
        );
        normalizeIsEmpty(normalizeData, resolve, reject);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const cancelGetActionHistoryByInstanceIdAndClearState =
  (fnCancel = taskContentApiCancel) =>
  (dispatch) => {
    sourceGetActionHistoryByInstanceId &&
      sourceGetActionHistoryByInstanceId?.cancel?.(
        'Canceled GetActionHistoryByInstanceId.',
      );
    dispatch(fnCancel());
  };

export const getTaskMetadataResponseSummary = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(
      GET_TASK_METADATA_RESPONSE_SUMMARY,
      { params },
    )
      .then((response) => {
        resolve(normalizeTaskMetadataResponseSummary(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getFormDetailsByTaskMetadataId = (params) =>
  new Promise((resolve, reject) => {
    console.trace('sjdhbvsjkdnv');
    axiosGetUtils(
      GET_FORM_DETAILS,
      { params },
    )
      .then((response) => {
        resolve(response.data.result.data);
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getReassigntasApiService = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(GET_REASSIGN_TASK, data, {
    cancelToken: new CancelToken((c) => {
      getCancelTokenOfVisibilityApi(c);
    }),
  })
    .then((response) => {
      resolve(normalizeFieldVisibilityList(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const getFieldVisibilityListApi = (data, cancelToken, setCancelToken) => new Promise((resolve, reject) => {
  cancelToken?.();
  axiosPostUtils(GET_VALID_FORM_FIELDS, data, {
     cancelToken: new CancelToken((c) => {
       setCancelToken(c);
     }),
   })
   .then((response) => {
     setCancelToken(null);
     resolve(normalizeFieldVisibilityList(response));
   })
   .catch((error) => {
     reject(error);
   });
 });

export const cancelTaskApi = (data) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(CANCEL_TASK, data, {
      cancelToken: new CancelToken((c) => {
        cancelTokenForCancelTask(c);
      }),
    })
      .then((response) => {
        resolve(normalizeCancelTask(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const assignTaskToParticipantsApi = (payload) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(ASSIGN_TASK_TO_PARTICIPANTS, payload)
      .then((response) => {
        resolve(normalizeAssignTaskToParticipants(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const nudgeTaskApi = (payload) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(NUDGE_TASK, payload)
      .then((response) => {
        resolve(normalizeNudgeTask(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const apiGetExportTaskDetails = (task_metadata_uuid) =>
  new Promise((resolve, reject) => {
    sourceGetActionHistoryByInstanceId = setSource();
    axiosGetUtils(GET_EXPORT_TASK_DETAILS, {
      params: { task_metadata_uuid, trigger_download: true },
      cancelToken: sourceGetActionHistoryByInstanceId.token,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });

  export const postUpdateApi = (payload) =>
  new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_NOTES, payload, {
      cancelToken: new CancelToken(() => {
      }),
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
