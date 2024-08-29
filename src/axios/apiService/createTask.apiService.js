import axios from 'axios';
import { axiosMLPostUtils } from 'axios/AxiosMLHelper';
import { axiosPostUtils } from '../AxiosHelper';
import {
  PUBLISH_TASK,
  SAVE_TASK,
  SAVE_FORM,
  GET_TASK_ASSIGNEE_SUGGESTION,
  DELETE_TASK,
  DELETE_FORM,
  SAVE_SECTION,
  SAVE_FIELD,
  VALIDATE_FORM,
} from '../../urls/ApiUrls';
import { getLoaderConfig } from '../../utils/UtilityFunctions';
import {
  normalizePublishTask,
  normalizeSaveTask,
  normalizeSaveForm,
  normalizeTaskAssigneeSuggestion,
  normalizeDeleteTask,
  normalizeDeleteForm,
} from '../apiNormalizer/createTask.apiNormalizer';
import { createTaskCancel } from '../../redux/reducer/CreateTaskReducer';
import jsUtility from '../../utils/jsUtility';
import { updatePostLoader } from '../../utils/loaderUtils';

const { CancelToken } = axios;
let cancelForPublishTask;
let cancelForSaveTask;
let cancelForDeleteTask;
let cancelForSaveForm;
let cancelForTaskAssigneeSuggestion;
let cancelForDeleteForm;

export const publishTask = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(PUBLISH_TASK, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        cancelForPublishTask = c;
      }),
    }, false)
      .then((response) => {
        resolve(normalizePublishTask(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const deleteFormBuilder = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_FORM, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        cancelForDeleteForm = c;
      }),
    })
      .then((response) => {
        resolve(normalizeDeleteForm(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getTaskAssigneeSuggestionApi = (data) => new Promise((resolve, reject) => {
    axiosMLPostUtils(GET_TASK_ASSIGNEE_SUGGESTION, data, {
      // ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        cancelForTaskAssigneeSuggestion = c;
      }),
    })
      .then((response) => {
        resolve(normalizeTaskAssigneeSuggestion(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveTask = (data, mlUrlParam) => {
  if (!jsUtility.isEmpty(mlUrlParam)) data.ml_generation_uuid = mlUrlParam;
  data.is_reminder_task = false;
  return new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_TASK, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        cancelForSaveTask = c;
      }),
    }, false)
      .then((response) => {
        resolve(normalizeSaveTask(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteTask = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(DELETE_TASK, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        cancelForDeleteTask = c;
      }),
    })
      .then((response) => {
        resolve(normalizeDeleteTask(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const saveField = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(SAVE_FIELD, data, {
    ...getLoaderConfig(),
  })
    .then((response) => {
      resolve(normalizeSaveForm(response));
    })
    .catch((error) => {
      reject(error);
    });
});

export const saveForm = (data) => new Promise((resolve, reject) => {
    axiosPostUtils(SAVE_FORM, data, {
      ...getLoaderConfig(),
      cancelToken: new CancelToken((c) => {
        cancelForSaveForm = c;
      }),
    }, false)
      .then((response) => {
        resolve(normalizeSaveForm(response));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const validateFormApi = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(VALIDATE_FORM, data, {
    ...getLoaderConfig(),
    cancelToken: new CancelToken((c) => {
      cancelForSaveForm = c;
    }),
  }, false)
    .then((response) => {
      updatePostLoader(false);
      resolve(response?.data?.result?.data || []);
    })
    .catch((errorResponse) => {
      reject(errorResponse?.response?.data || []);
    });
});

export const saveSection = (data) => new Promise((resolve, reject) => {
  axiosPostUtils(SAVE_SECTION, data, {
    ...getLoaderConfig(),
    cancelToken: new CancelToken((c) => {
      cancelForSaveForm = c;
    }),
  }, false)
    .then((response) => {
      resolve(response.data.result.data);
    })
    .catch((error) => {
      reject(error);
    });
});

export const cancelPublishTask = (cancelFunction = createTaskCancel) => (dispatch) => {
  if (cancelForPublishTask) {
    cancelForPublishTask();
    dispatch(cancelFunction());
  }
};

export const cancelDeleteForm = (cancelFunction = createTaskCancel) => (dispatch) => {
  if (cancelForDeleteForm) {
    cancelForDeleteForm();
    dispatch(cancelFunction());
  }
};

export const cancelSaveTask = (cancelFunction = createTaskCancel) => (dispatch) => {
  if (cancelForSaveTask) {
    cancelForSaveTask();
    dispatch(cancelFunction());
  }
};

export const cancelDeleteTask = (cancelFunction = createTaskCancel) => (dispatch) => {
  if (cancelForDeleteTask) {
    cancelForDeleteTask();
    dispatch(cancelFunction());
  }
};

export const cancelSaveForm = (cancelFunction = createTaskCancel) => (dispatch) => {
  if (cancelForSaveForm) {
    cancelForSaveForm();
    dispatch(cancelFunction());
  }
};

export const cancelTaskAssigneeSuggestion = (cancelFunction = createTaskCancel) => (dispatch) => {
  if (cancelForTaskAssigneeSuggestion) {
    cancelForTaskAssigneeSuggestion();
    dispatch(cancelFunction());
  }
};

export default publishTask;
