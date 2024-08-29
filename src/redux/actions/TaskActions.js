import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { getTaskActionFieldsData, getDefaultValue, getFieldDataFromSection } from 'containers/landing_page/my_tasks/task_content/TaskContent.utils';
import { addFieldToApiQueue, removeFieldFromApiQueue } from 'redux/reducer/FieldVisiblityReducer';
import { createTaskSetState, setTaskReferenceDocuments } from 'redux/reducer/CreateTaskReducer';
import { FIELD_LIST_TYPE, FIELD_TYPE, PROPERTY_PICKER_ARRAY } from 'utils/constants/form.constant';
import {
  CREATE_DATA_LIST,
  CREATE_EDIT_TASK,
  DEV_USER,
} from 'urls/RouteConstants';
import { ACTION_TYPE } from 'utils/constants/action.constant';
import { getPrecedingStepsApi } from 'axios/apiService/flow.apiService';
import { DOWNLOAD_WINDOW_STRINGS } from 'components/download/Download.strings';
import { getFieldType } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { translate } from 'language/config';
import {
  TASK_LIST_ACTION,
  TASK_CONTENT_ACTION,
  TASK_COUNT_ACTION,
  TASK_ASSIGNEES_COMPLETED,
  TASK_RESPONSE_SUMMARY_ACTION,
  TASK_ASSIGNEES_RESPONSE,
  TASK_FORM_DETAILS_ACTION,
  TASK_METADATA,
} from './ActionConstants';
import {
  getCompletedTaskList,
  getActiveTaskList,
  getSelfTaskList,
  getAssignedTaskList,
  getBothAssignedTaskList,
  submitTask,
  getTaskData,
  apiRejectTask,
  apiUpdateTaskStatus,
  getTaskCount,
  getTaskCompletedAssignees,
  getTaskMetadataResponseSummary,
  getFormDetailsByTaskMetadataId,
  // getValidStepActionsApi,
  getTaskMetadata,
  getFieldVisibilityListApi,
  cancelTaskApi,
  getTaskMetadataActiveParticipants,
  assignTaskToParticipantsApi,
  getAllInstancesByTaskMetadataUuid,
  nudgeTaskApi,
  getDraftTaskList,
  apiGetExportTaskDetails,
  updateActiveTaskDetailsApiService,
  replicateTaskApiService,
  snoozeTaskApiService,
  postUpdateApi,
  getReassigntasApiService,
  apiGetActionHistoryByInstanceId,
  // getActiveResultTaskList,
} from '../../axios/apiService/task.apiService';
import {
  M_T_STRINGS,
  TASK_ACTION,
  TASK_STATUS_TYPES,
  TASK_CONTENT_STRINGS,
} from '../../containers/landing_page/LandingPage.strings';
import {
  generateGetServerErrorMessage,
} from '../../server_validations/ServerValidation';
import { store } from '../../Store';
import {
  updateErrorPopoverInRedux,
  setPointerEvent,
  updatePostLoader,
  generateApiErrorsAndHandleCatchBlock,
  getUserProfileData,
  getTaskReferenceDocumentsFileObject,
  isEmptyString,
  trimString,
  isBasicUserMode,
  routeNavigate,
  getDevRoutePath,
  getDefaultAppRoutePath,
  CancelToken,
  showToastPopover,
} from '../../utils/UtilityFunctions';
import jsUtils, {
  isEmpty,
  cloneDeep,
  compact,
  set,
  has,
  get,
  nullCheck,
  isPlainObject,
  translateFunction,
} from '../../utils/jsUtility';
import { constructSchemaFromData, getTableUniqueColumnMessage } from '../../containers/landing_page/my_tasks/task_content/TaskContent.validation.schema';
import { getUploadSignedUrlApi } from '../../axios/apiService/userProfile.apiService';
import { EMPTY_STRING, ERROR_TEXT } from '../../utils/strings/CommonStrings';
import { FORM_POPOVER_STATUS, REDIRECTED_FROM, ROUTE_METHOD } from '../../utils/Constants';
import { COMMON_SERVER_ERROR_TYPES, SERVER_ERROR_CODES, UNAUTHORIZED_CONTEXT } from '../../utils/ServerConstants';

import {
  addDataListChangeAction,
  addDataListIntChangeAction,
  setUpdatedFieldVisibilityListInDataList,
} from '../reducer/DataListReducer';
import { ADMIN_HOME, DRAFT_TASK, HOME, TASKS } from '../../urls/RouteConstants';
import { downloadWindowStateChange } from './FlowDashboard.Action';
import { taskListReducerDataChange } from '../reducer/TaskListReducer';
// import { setInitialFormVisibleFields } from '../../utils/formUtils';
import { USER_ACTIONS } from '../../utils/constants/action.constant';
import { TASK_CATEGORY_FLOW_TASK } from '../../utils/taskContentUtils';
import { constructTreeStructure } from '../../containers/form/sections/form_layout/FormLayout.utils';
import { normalizer } from '../../utils/normalizer.utils';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../../utils/constants/form/form.constant';
import { constructActiveFormDataFromResponse } from '../../containers/form/editable_form/EditableForm.utils';
import { getActionsForTaskContent } from '../../containers/form/form_builder/form_footer/FormFooter.utils';
import { constructInformationFieldFormContent } from '../../containers/landing_page/my_tasks/task_content/TaskContent.utils';
import { UUID_V4_REGEX } from '../../utils/strings/Regex';

const activeTaskCancelToken = new CancelToken();
const snoozeCancelToken = new CancelToken();
const completedCancelToken = new CancelToken();
const selfTaskCancelToken = new CancelToken();
const draftCancelToken = new CancelToken();

const taskListApiStarted = (apiStartedData = {}) => {
  return {
    type: TASK_LIST_ACTION.STARTED,
    payload: apiStartedData,
  };
};

const taskListApiStartedWithoutLoading = (apiStartedData = {}) => {
  return {
    type: TASK_LIST_ACTION.STARTED_NO_LOADING,
    payload: apiStartedData,
  };
};

const taskResultApiStarted = () => {
  return {
    type: TASK_LIST_ACTION.TASK_RESULT_STARTED,
  };
};

const taskListApiLoadMoreStarted = (loadMoreData = {}) => {
  return {
    type: TASK_LIST_ACTION.LOAD_MORE,
    payload: loadMoreData,
  };
};

const taskResultApiLoadMoreStarted = () => {
  return {
    type: TASK_LIST_ACTION.SEARCH_LOAD_MORE,
  };
};

const taskListApiSuccess = (allUserData) => {
  return {
    type: TASK_LIST_ACTION.SUCCESS,
    payload: { ...allUserData },
  };
};

const taskResultApiSuccess = (allUserData) => {
  console.log('allUserData118', allUserData);
  return {
    type: TASK_LIST_ACTION.SUCCESS,
    payload: { ...allUserData },
  };
};

const taskMetadataApiStarted = () => {
  return {
    type: TASK_METADATA.STARTED,
  };
};

const taskMetadataApiSuccess = (payload) => {
  return {
    type: TASK_METADATA.SUCCESS,
    payload: { ...payload },
  };
};

const taskMetadataApiFailure = (error) => {
  return {
    type: TASK_METADATA.FAILURE,
    payload: error,
  };
};

const taskAssigneesApiStarted = () => {
  return {
    type: TASK_ASSIGNEES_COMPLETED.STARTED,
  };
};

const taskAssigneesApiSuccess = (payload) => {
  return {
    type: TASK_ASSIGNEES_COMPLETED.SUCCESS,
    payload: { ...payload },
  };
};

const taskAssigneesApiFailure = (error) => {
  return {
    type: TASK_ASSIGNEES_COMPLETED.FAILURE,
    payload: error,
  };
};

const taskCountApiStarted = () => {
  return {
    type: TASK_COUNT_ACTION.STARTED,
  };
};

const taskCountApiSuccess = () => {
  return {
    type: TASK_COUNT_ACTION.SUCCESS,
  };
};

export const taskListDataChange = (allUserData) => (dispatch) => {
  dispatch({
    type: TASK_LIST_ACTION.DATA_CHANGE,
    payload: { ...allUserData },
  });
  return Promise.resolve();
};

const taskListApiFailure = (error) => {
  return {
    type: TASK_LIST_ACTION.FAILURE,
    payload: error,
  };
};
let cancelTokenOfVisibilityApi;
export const getCancelTokenOfVisibilityApi = (c) => {
  cancelTokenOfVisibilityApi = c;
};
export const taskListApiCancel = () => {
  return {
    type: TASK_LIST_ACTION.CANCEL,
  };
};

export const clearTaskListData = () => {
  return {
    type: TASK_LIST_ACTION.CLEAR,
  };
};

// refreshing the task list after creating a new task
export const refreshTaskListApiStarted = () => {
  return {
    type: TASK_LIST_ACTION.REFRESH_API_CALL_STARTED,
  };
};

export const refreshTaskResultApiStarted = () => {
  return {
    type: TASK_LIST_ACTION.REFRESH_API_CALL_STARTED,
  };
};

export const ruleFieldTypeChangeTaskStarted = () => {
  return {
    type: TASK_LIST_ACTION.RULE_FIELD_TYPE_CHANGE_TASK_STARTED,
  };
};

export const ruleFieldTypeChangeTaskSucess = (data) => {
  return {
    type: TASK_LIST_ACTION.RULE_FIELD_TYPE_CHANGE_TASK_SUCCESS,
    payload: data,
  };
};

export const ruleFieldTypeChangeTaskFailed = (error) => {
  return {
    type: TASK_LIST_ACTION.RULE_FIELD_TYPE_CHANGE_TASK_STARTED,
    payload: error,
  };
};

export const getAllFieldsTaskStartedAction = () => {
  return {
    type: TASK_LIST_ACTION.GET_ALL_FIELDS_STARTED,
  };
};

export const getAllFieldsTaskSuccessAction = (data) => {
  return {
    type: TASK_LIST_ACTION.GET_ALL_FIELDS_SUCCESS,
    payload: data,
  };
};

export const getAllFieldsTaskFailedAction = (error) => {
  return {
    type: TASK_LIST_ACTION.GET_ALL_FIELDS_FAILED,
    payload: error,
  };
};

export const hideTaskListStarted = () => {
  return {
    type: TASK_CONTENT_ACTION.HIDE_TASK_LIST_STARTED,
  };
};

export const hideTaskListCompleted = () => {
  return {
    type: TASK_CONTENT_ACTION.HIDE_TASK_LIST_COMPLETED,
  };
};

export const refreshTaskListApiCompleted = () => {
  return {
    type: TASK_LIST_ACTION.REFRESH_API_CALL_COMPLETED,
  };
};

export const setTabIndexAction = (index) => {
  return {
    type: TASK_CONTENT_ACTION.SET_TAB_INDEX,
    payload: index,
  };
};

export const setUpdatedAction = (data) => {
  return {
    type: TASK_CONTENT_ACTION.UPDATE_ACTIONS,
    payload: data,
  };
};

export const setUpdatedFieldVisibilityList = (data) => {
  return {
    type: TASK_CONTENT_ACTION.UPDATE_FIELD,
    payload: data,
  };
};

export const getCompletedTaskListDataThunk =
  (params, type, landingPageCall = false, history) =>
    (dispatch) => {
      if (type === M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST) {
        const { isRefresh } = store.getState().TaskReducer;
        dispatch(taskListDataChange({ isRefresh: !isRefresh }));
      }
      if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) dispatch(taskListApiLoadMoreStarted());
      else dispatch(taskListApiStarted());
      return new Promise((resolve) => {
        const updatedParams = cloneDeep({ ...params });
        if (has(updatedParams, ['search']) && isEmptyString(updatedParams.search)) {
          delete updatedParams.search;
        } else updatedParams.search = trimString(updatedParams.search);
        getCompletedTaskList(updatedParams, completedCancelToken)
          .then((response) => {
            console.log('completedTaskCount');
            if (!isEmpty(response)) {
              let successData = null;
              let searchCancel;
              if (landingPageCall) {
                successData = {
                  completedTaskCount: response.pagination_details[0].total_count,
                };
                dispatch(taskListApiSuccess(successData));
              } else if (
                type === M_T_STRINGS.TASK_LIST.GET_TASK_LIST ||
                type === M_T_STRINGS.TASK_LIST.INPUT_HANDLER
              ) {
                const { searchText } = store.getState().TaskReducer;
                if (params.search && params.search !== searchText) {
                  searchCancel = true;
                }
                const remainingTasksCount = response.pagination_details[0].total_count - response.pagination_data.length;

                if (!searchText && searchText !== EMPTY_STRING) {
                  successData = {
                    hasMore: remainingTasksCount > 0,
                    tasks_results_list: response.pagination_data,
                    document_url_details: response.document_url_details || [],
                    count: response.pagination_details[0].total_count,
                  };
                } else {
                  successData = {
                    hasMore: remainingTasksCount > 0,
                    active_tasks_list: response.pagination_data,
                    document_url_details: response.document_url_details || [],
                    count: response.pagination_details[0].total_count,
                  };
                }
              } else if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) {
                const { active_tasks_list } = cloneDeep(
                  store.getState().TaskReducer,
                );
                const reponseDataList = response.pagination_data;
                active_tasks_list.push(...reponseDataList);
                successData = {
                  active_tasks_list,
                };
              }
              if (
                store.getState().TaskReducer.searchText &&
                store.getState().TaskReducer.searchAccordionIndex === 2 &&
                !searchCancel
              ) {
                console.log('1st clalled');
                dispatch(taskListApiSuccess(successData));
              }
              if (
                !store.getState().TaskReducer.searchText &&
                store.getState().TaskReducer.tab_index === 2
              ) {
                console.log('2nd clalled');
                dispatch(taskListApiSuccess(successData));
              }
            } else {
              const err = {
                response: {
                  status: 500,
                },
              };
              const errors = generateGetServerErrorMessage(err);
              showToastPopover(
                translate('error_popover_status.somthing_went_wrong'),
                translate('error_popover_status.refresh_try_again'),
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
              dispatch(taskListApiFailure(errors.common_server_error));
            }
            resolve();
          })
          .catch((error) => {
            if (error && (error.code === 'ERR_CANCELED')) return;
            const errors = generateGetServerErrorMessage(error);
            dispatch(taskListApiFailure(errors.common_server_error));
            if (error && error.code === SERVER_ERROR_CODES.AXIOS_TIMEOUT) {
              showToastPopover(
                translate('error_popover_status.somthing_went_wrong'),
                translate('error_popover_status.refresh_try_again'),
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
              if (history && history.replace) {
                routeNavigate(history, ROUTE_METHOD.REPLACE, HOME);
              }
            }
            resolve();
          });
      });
    };

export const getActiveTaskListDataThunk =
  (params, type, history, isPeriodicRefresh = false) => (dispatch) => {
    if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) dispatch(taskListApiLoadMoreStarted());
    else if (isPeriodicRefresh) taskListApiStartedWithoutLoading();
    else dispatch(taskListApiStarted());
    return new Promise((resolve) => {
      const updatedParams = cloneDeep({ ...params });
      if (has(updatedParams, ['search']) && isEmptyString(updatedParams.search)) {
        delete updatedParams.search;
      } else updatedParams.search = trimString(updatedParams.search);
      getActiveTaskList(updatedParams, activeTaskCancelToken)
        .then(async (response) => {
          if (!isEmpty(response)) {
            let listData = [];
            let remainingTasksCount = 0;
            let searchCancel;
            if (
              type === M_T_STRINGS.TASK_LIST.GET_TASK_LIST ||
              type === M_T_STRINGS.TASK_LIST.INPUT_HANDLER ||
              type === M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST
            ) {
              const { searchText } = store.getState().TaskReducer;
              if (params.search && params.search !== searchText) {
                searchCancel = true;
              }
              if (window.location.pathname === DEV_USER ||
                (history && (
                  (history.location.pathname.includes('myTasks') ||
                    history.location.pathname.includes(DEV_USER) ||
                    (history.location.pathname === CREATE_EDIT_TASK) ||
                    (history.location.pathname === CREATE_DATA_LIST))))
              ) listData = response.pagination_data;
              console.log('### getActiveTaskListDataThunk21', listData, updatedParams);
            } else if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) {
              const { active_tasks_list, snoozed_tasks_list } = cloneDeep(
                store.getState().TaskReducer,
              );
              const reponseDataList = response.pagination_data;
              (history.location.pathname.includes('myTasks') || history.location.pathname === DEV_USER)
                ? active_tasks_list.push(...reponseDataList) :
                snoozed_tasks_list.push(...reponseDataList);
              if (
                history.location.pathname.includes('myTasks') ||
                history.location.pathname.includes(DEV_USER) ||
                (history.location.pathname === CREATE_EDIT_TASK) ||
                (history.location.pathname === CREATE_DATA_LIST)
              ) listData = active_tasks_list;
            }
            remainingTasksCount =
              response.pagination_details[0].total_count - listData.length;
            if (
              store.getState().TaskReducer.searchText &&
              store.getState().TaskReducer.searchAccordionIndex === 1
              && !searchCancel
            ) {
              console.log('getActiveTaskListDataThunk11', type, params);
              await dispatch(
                taskListApiSuccess({
                  remainingTasksCount,
                  hasMore: remainingTasksCount > 0,
                  active_tasks_list: listData,
                  snoozed_tasks_list: [],
                  document_url_details: response.document_url_details || [],
                  count: response.pagination_details[0].total_count,
                  pendingTaskCount: response.pagination_details[0].total_count,
                }),
              );
            }
            if (
              !store.getState().TaskReducer.searchText &&
              (window.location.pathname === DEV_USER ||
                (history && (
                  (history.location.pathname.includes('myTasks') ||
                    history.location.pathname.includes(DEV_USER) ||
                    (history.location.pathname === CREATE_EDIT_TASK) ||
                    (history.location.pathname === CREATE_DATA_LIST))))
              )
            ) {
              console.log('getActiveTaskListDataThunk21', type, params);

              await dispatch(
                taskListApiSuccess({
                  remainingTasksCount,
                  hasMore: remainingTasksCount > 0,
                  active_tasks_list: listData,
                  snoozed_tasks_list: [],
                  document_url_details: response.document_url_details || [], // to check
                  count: response.pagination_details[0].total_count,
                  pendingTaskCount: response.pagination_details[0].total_count,
                }),
              );
            }
            // console.log()
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            showToastPopover(
              translate('error_popover_status.somthing_went_wrong'),
              translate('error_popover_status.refresh_try_again'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            dispatch(taskListApiFailure(errors.common_server_error));
          }
          resolve();
        })
        .catch((error) => {
          console.log('image.pngimage.png', error);
          if (error && (error.code === 'ERR_CANCELED')) return;
          const errors = generateGetServerErrorMessage(error);
          dispatch(taskListApiFailure(errors.common_server_error));
          if (error && error.code === SERVER_ERROR_CODES.AXIOS_TIMEOUT) {
            showToastPopover(
              translate('error_popover_status.somthing_went_wrong'),
              translate('error_popover_status.refresh_try_again'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            if (history && history.replace) {
              routeNavigate(history, ROUTE_METHOD.REPLACE, HOME);
            }
          }
          resolve();
        });
    });
  };

export const getSnoozedTaskListDataThunk =
  (params, type, history) => (dispatch) => {
    if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) dispatch(taskListApiLoadMoreStarted());
    else dispatch(taskListApiStarted());
    return new Promise((resolve) => {
      const updatedParams = cloneDeep({ ...params });
      if (has(updatedParams, ['search']) && isEmptyString(updatedParams.search)) {
        delete updatedParams.search;
      } else updatedParams.search = trimString(updatedParams.search);
      getActiveTaskList(updatedParams, snoozeCancelToken)
        .then(async (response) => {
          if (!isEmpty(response)) {
            let listDataSnoozed = null;
            let remainingTasksCount = 0;
            let searchCancel;
            if (
              type === M_T_STRINGS.TASK_LIST.GET_TASK_LIST ||
              type === M_T_STRINGS.TASK_LIST.INPUT_HANDLER ||
              type === M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST
            ) {
              const { searchText } = store.getState().TaskReducer;
              if (params.search && params.search !== searchText) {
                searchCancel = true;
              }
              if (history.location.pathname.includes('snoozedTasks')) listDataSnoozed = response.pagination_data;
            } else if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) {
              const { snoozed_tasks_list } = cloneDeep(
                store.getState().TaskReducer,
              );
              const reponseDataList = response.pagination_data;
              snoozed_tasks_list.push(...reponseDataList);
              if (history.location.pathname.includes('snoozedTasks')) listDataSnoozed = snoozed_tasks_list;
            }
            remainingTasksCount =
              response.pagination_details[0].total_count - listDataSnoozed.length;
            if (
              store.getState().TaskReducer.searchText &&
              store.getState().TaskReducer.searchAccordionIndex === 6 &&
              !searchCancel
            ) {
              console.log('getActiveTaskListDataThunk12', type, params);
              await dispatch(
                taskListApiSuccess({
                  remainingTasksCount,
                  hasMore: remainingTasksCount > 0,
                  snoozed_tasks_list: listDataSnoozed,
                  active_tasks_list: [],
                  document_url_details: response.document_url_details || [],
                  count: response.pagination_details[0].total_count,
                  pendingTaskCount: response.pagination_details[0].total_count,
                  snoozedCount: response.pagination_details[0].total_count,
                  hasMoreSnoozed: remainingTasksCount > 0,
                }),
              );
            } if (
              !store.getState().TaskReducer.searchText &&
              (history.location.pathname.includes('snoozedTasks'))
            ) {
              console.log('getActiveTaskListDataThunk22', type, params);

              dispatch(
                taskListApiSuccess({
                  hasMore: false,
                  active_tasks_list: [],
                  count: response.pagination_details[0].total_count,
                  remainingTasksCount,
                  hasMoreSnoozed: remainingTasksCount > 0,
                  snoozed_tasks_list: listDataSnoozed,
                  document_url_details: response.document_url_details || [],
                  snoozedCount: response.pagination_details[0].total_count,
                  pendingTaskCount: response.pagination_details[0].total_count,
                }),
              );
            }
            // console.log()
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            showToastPopover(
              translate('error_popover_status.somthing_went_wrong'),
              translate('error_popover_status.refresh_try_again'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            dispatch(taskListApiFailure(errors.common_server_error));
          }
          resolve();
        })
        .catch((error) => {
          if (error && (error.code === 'ERR_CANCELED')) return;
          const errors = generateGetServerErrorMessage(error);
          dispatch(taskListApiFailure(errors.common_server_error));
          if (error && error.code === SERVER_ERROR_CODES.AXIOS_TIMEOUT) {
            showToastPopover(
              translate('error_popover_status.somthing_went_wrong'),
              translate('error_popover_status.refresh_try_again'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            if (history && history.replace) {
              routeNavigate(history, ROUTE_METHOD.REPLACE, HOME);
            }
          }
          resolve();
        });
    });
  };

export const getTaskResultsListThunk = (params, type) => (dispatch) =>
  new Promise((resolve) => {
    if (type === M_T_STRINGS.TASK_LIST.INPUT_HANDLER) dispatch(taskResultApiStarted());
    const updatedParams = cloneDeep({ ...params });
    if (has(updatedParams, ['search']) && isEmptyString(updatedParams.search)) {
      delete updatedParams.search;
    } else updatedParams.search = trimString(updatedParams.search);
    getActiveTaskList(updatedParams, activeTaskCancelToken)
      .then((response) => {
        if (!isEmpty(response)) {
          let listData = null;
          let remainingTasksCount = 0;
          let searchCancel;
          if (
            type === M_T_STRINGS.TASK_LIST.GET_TASK_LIST ||
            type === M_T_STRINGS.TASK_LIST.INPUT_HANDLER ||
            type === M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST
          ) {
            const { searchText } = store.getState().TaskReducer;
            if (params.search && params.search !== searchText) {
              searchCancel = true;
            }
            listData = response.pagination_data;
          } else if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) {
            const { active_tasks_list } = cloneDeep(
              store.getState().TaskReducer,
            );
            const reponseDataList = response.pagination_data;
            active_tasks_list.push(...reponseDataList);
            listData = active_tasks_list;
          }
          remainingTasksCount =
            response.pagination_details[0].total_count - listData.length;
          const { searchText } = store.getState().TaskReducer;
          if (searchText !== null) {
            dispatch(
              taskResultApiSuccess({
                remainingTasksCount,
                hasMore: remainingTasksCount > 0,
                tasks_results_list: listData,
                snoozed_tasks_list: listData,
                hasMoreSnoozed: remainingTasksCount > 0,
                pendingTaskCount: response.pagination_details[0].total_count,
                active_tasks_list: listData,
                count: response.pagination_details[0].total_count,
                snoozedCount: response.pagination_details[0].total_count,
              }),
            );
          }
          if (
            !store.getState().TaskReducer.searchText &&
            store.getState().TaskReducer.tab_index === 1
            && !searchCancel
          ) {
            console.log('4searchText', searchText);

            dispatch(
              taskResultApiSuccess({
                remainingTasksCount,
                hasMore: remainingTasksCount > 0,
                tasks_results_list: listData,
                active_tasks_list: listData,
                snoozed_tasks_list: listData,
                pendingTaskCount: response.pagination_details[0].total_count,
                count: response.pagination_details[0].total_count,
                snoozedCount: response.pagination_details[0].total_count,
              }),
            );
          }
          // console.log()
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(taskListApiFailure(errors.common_server_error));
        }
        resolve();
      })
      .catch((error) => {
        if (error && (error.code === 'ERR_CANCELED')) return;
        const errors = generateGetServerErrorMessage(error);
        dispatch(taskListApiFailure(errors.common_server_error));
        resolve();
      });
  });
export const getSearchCompletedTaskListDataThunk =
  (params, type) =>
    (dispatch) =>
      new Promise((resolve) => {
        if (type === M_T_STRINGS.TASK_LIST.INPUT_HANDLER) dispatch(taskResultApiStarted());
        const updatedParams = cloneDeep({ ...params });
        if (has(updatedParams, ['search']) && isEmptyString(updatedParams.search)) {
          delete updatedParams.search;
        } else updatedParams.search = trimString(updatedParams.search);
        getCompletedTaskList(updatedParams, completedCancelToken)
          .then((response) => {
            console.log('completedTaskCount564', response);
            let successData = null;
            let searchCancel;
            if (
              type === M_T_STRINGS.TASK_LIST.GET_TASK_LIST ||
              type === M_T_STRINGS.TASK_LIST.INPUT_HANDLER
            ) {
              const { searchText } = store.getState().TaskReducer;
              if (params.search && params.search !== searchText) {
                searchCancel = true;
              }
              const remainingTasksCount = response.pagination_details[0].total_count - response.pagination_data.length;
              if (!searchText && searchText !== EMPTY_STRING) {
                successData = {
                  hasMore: remainingTasksCount > 0,
                  tasks_results_list: response.pagination_data,
                  active_tasks_list: response.pagination_data,
                  count: response.pagination_details[0].total_count,
                };
              } else {
                successData = {
                  hasMore: remainingTasksCount > 0,
                  tasks_results_list: response.pagination_data,
                  active_tasks_list: response.pagination_data,
                  count: response.pagination_details[0].total_count,
                };
              }
            } else if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) {
              const { tasks_results_list } = cloneDeep(
                store.getState().TaskReducer,
              );
              const { active_tasks_list } = cloneDeep(
                store.getState().TaskReducer,
              );
              const reponseDataList = response.pagination_data;
              tasks_results_list.push(...reponseDataList);
              successData = {
                tasks_results_list,
                active_tasks_list,
              };
            }
            if (store.getState().TaskReducer.searchText && !searchCancel) {
              console.log('Result1', successData);
              dispatch(taskResultApiSuccess(successData));
            }
            if (
              !store.getState().TaskReducer.searchText &&
              store.getState().TaskReducer.tab_index === 2
            ) {
              console.log('Result2', successData);
              dispatch(taskResultApiSuccess(successData));
              console.log('2nd clalled new');
            }
            resolve();
          })
          .catch((error) => {
            if (error && (error.code === 'ERR_CANCELED')) return;
            const errors = generateGetServerErrorMessage(error);
            dispatch(taskListApiFailure(errors.common_server_error));
            resolve();
          });
      });

export const getSearchDraftTaskListDataThunk = (params, type) => (dispatch) => {
  if (type === M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST) {
    const { isRefresh } = store.getState().TaskReducer;
    dispatch(taskListDataChange({ isRefresh: !isRefresh }));
  }
  if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) dispatch(taskResultApiLoadMoreStarted());
  else dispatch(taskResultApiStarted());
  return new Promise((resolve) => {
    const updatedParams = cloneDeep({ ...params });
    if (has(updatedParams, ['search']) && isEmptyString(updatedParams.search)) {
      delete updatedParams.search;
    } else updatedParams.search = trimString(updatedParams.search);
    getDraftTaskList(updatedParams)
      .then((response) => {
        let successData = null;
        let searchCancel;
        if (!isEmpty(response)) {
          if (
            type === M_T_STRINGS.TASK_LIST.GET_TASK_LIST ||
            type === M_T_STRINGS.TASK_LIST.INPUT_HANDLER
          ) {
            const { searchText } = store.getState().TaskReducer;
            if (params.search && params.search !== searchText) {
              searchCancel = true;
            }
            const remainingTasksCount = response.pagination_details[0].total_count - response.pagination_data.length;
            successData = {
              hasMore: remainingTasksCount > 0,
              tasks_results_list: response.pagination_data,
              document_url_details: response.document_url_details,
              active_tasks_list: response.pagination_data,
              count: response.pagination_details[0].total_count,
            };
          } else if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) {
            const { tasks_results_list } = cloneDeep(
              store.getState().TaskReducer,
            );
            const reponseDataList = response.pagination_data;
            tasks_results_list.push(...reponseDataList);
            successData = {
              tasks_results_list,
            };
          }
          if (store.getState().TaskReducer.searchText && !searchCancel) dispatch(taskResultApiSuccess(successData));
          if (!store.getState().TaskReducer.searchText) dispatch(taskResultApiSuccess(successData));
          resolve();
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(taskListApiFailure(errors.common_server_error));
        }
        resolve();
      })
      .catch((error) => {
        if (error && (error.code === 'ERR_CANCELED')) return;
        const errors = generateGetServerErrorMessage(error);
        dispatch(taskListApiFailure(errors.common_server_error));
        resolve();
      });
  });
};

export const getSearchAssignedTaskListDataThunk =
  (params, type) => (dispatch) => {
    if (type === M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST) {
      const { isRefresh } = store.getState().TaskReducer;
      dispatch(taskListDataChange({ isRefresh: !isRefresh }));
    }
    if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) dispatch(taskResultApiLoadMoreStarted());
    else dispatch(taskResultApiStarted());
    return new Promise((resolve) => {
      const updatedParams = cloneDeep({ ...params });
      if (has(updatedParams, ['search']) && isEmptyString(updatedParams.search)) {
        delete updatedParams.search;
      } else updatedParams.search = trimString(updatedParams.search);
      getAssignedTaskList(updatedParams)
        .then((response) => {
          let successData = null;
          let searchCancel;
          if (!isEmpty(response)) {
            if (
              type === M_T_STRINGS.TASK_LIST.GET_TASK_LIST ||
              type === M_T_STRINGS.TASK_LIST.INPUT_HANDLER
            ) {
              const { searchText } = store.getState().TaskReducer;
              if (params.search && params.search !== searchText) {
                searchCancel = true;
              }
              successData = {
                hasMore: true,
                tasks_results_list: response.pagination_data,
                document_url_details: response.document_url_details,
                active_tasks_list: response.pagination_data,
              };
            } else if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) {
              const { tasks_results_list } = cloneDeep(
                store.getState().TaskReducer,
              );
              const reponseDataList = response.pagination_data;
              tasks_results_list.push(...reponseDataList);
              successData = {
                tasks_results_list,
              };
            }
            if (
              store.getState().TaskReducer.searchText &&
              // store.getState().TaskReducer.searchAccordionIndex === 3 &&
              !searchCancel
            ) dispatch(taskResultApiSuccess(successData));
            if (
              !store.getState().TaskReducer.searchText &&
              store.getState().TaskReducer.tab_index === 3
            ) dispatch(taskResultApiSuccess(successData));
            resolve();
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            dispatch(taskListApiFailure(errors.common_server_error));
          }
          resolve();
        })
        .catch((error) => {
          if (error && (error.code === 'ERR_CANCELED')) return;
          const errors = generateGetServerErrorMessage(error);
          dispatch(taskListApiFailure(errors.common_server_error));
          resolve();
        });
    });
  };

export const getSelfTaskListDataThunk = (params, type) => (dispatch) => {
  if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) dispatch(taskListApiLoadMoreStarted());
  else dispatch(taskListApiStarted());
  return new Promise((resolve) => {
    getSelfTaskList(params, selfTaskCancelToken)
      .then((response) => {
        if (!isEmpty(response)) {
          let successData = null;
          if (
            type === M_T_STRINGS.TASK_LIST.GET_TASK_LIST ||
            type === M_T_STRINGS.TASK_LIST.INPUT_HANDLER
          ) {
            successData = {
              hasMore: true,
              active_tasks_list: response.pagination_data,
              count: response.pagination_details[0].total_count,
            };
          } else if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) {
            const { active_tasks_list } = cloneDeep(
              store.getState().TaskReducer,
            );
            const reponseDataList = response.pagination_data;
            active_tasks_list.push(...reponseDataList);
            successData = {
              active_tasks_list,
            };
          }
          if (
            !store.getState().TaskReducer.searchText &&
            store.getState().TaskReducer.tab_index === 4
          ) dispatch(taskListApiSuccess(successData));
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(taskListApiFailure(errors.common_server_error));
        }
        resolve();
      })
      .catch((error) => {
        if (error && (error.code === 'ERR_CANCELED')) return;
        const errors = generateGetServerErrorMessage(error);
        dispatch(taskListApiFailure(errors.common_server_error));
        resolve();
      });
  });
};

export const getAssignedTaskListDataThunk =
  (params, type, history) => (dispatch) => {
    if (type === M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST) {
      const { isRefresh } = store.getState().TaskReducer;
      dispatch(taskListDataChange({ isRefresh: !isRefresh }));
    }
    if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) {
      let dataLoadingFields = {};
      if (params.type === 'completed') {
        dataLoadingFields = {
          isAssignedCompletedTaskLoadMore: true,
        };
      } else if (params.type === 'open') {
        dataLoadingFields = {
          isAssignedOpenTaskLoadMore: true,
        };
      } else {
        dataLoadingFields = {
          isAssignedCompletedTaskLoadMore: true,
          isAssignedOpenTaskLoadMore: true,
        };
      }
      dispatch(taskListApiLoadMoreStarted(dataLoadingFields));
    } else {
      let dataLoadingFields = {};
      if (params.type === 'completed') {
        dataLoadingFields = {
          isAssignedCompletedTaskLoading: true,
        };
      } else if (params.type === 'open') {
        dataLoadingFields = {
          isAssignedOpenTaskLoading: true,
        };
      } else {
        dataLoadingFields = {
          isAssignedCompletedTaskLoading: true,
          isAssignedOpenTaskLoading: true,
        };
      }
      dispatch(taskListApiStarted(dataLoadingFields));
    }
    return new Promise((resolve) => {
      const updatedParams = cloneDeep({ ...params });
      if (has(updatedParams, ['search']) && isEmptyString(updatedParams.search)) {
        delete updatedParams.search;
      } else updatedParams.search = trimString(updatedParams.search);
      getBothAssignedTaskList(updatedParams)
        .then((response) => {
          let successData = null;
          let searchCancel;
          console.log('sfsdfsf', response, params.type);
          if (!isEmpty(response)) {
            let loadMoreData = {};
            let isAssignedTaskLoading = {};
            let totalCount = {};
            let activeTaskList = {};
            let documentUrlDetails = [];
            let remainingOpenTasksCount = 0;
            let remainingCompletedTasksCount = 0;
            let hasMoreData;

            if (params.type === 'completed') {
              loadMoreData = {
                isAssignedCompletedTaskLoadMore: false,
              };
              isAssignedTaskLoading = {
                isAssignedCompletedTaskLoading: false,
              };
              totalCount = {
                assignedCompletedTaskCount:
                  response.completed_task.pagination_details[0].total_count,
              };
              activeTaskList = {
                ...store.getState().TaskReducer.active_tasks_list,
                completed: [...response.completed_task.pagination_data],
              };
              remainingCompletedTasksCount =
                response.completed_task.pagination_details[0].total_count -
                (activeTaskList.completed
                  ? activeTaskList.completed.length
                  : 0);
              hasMoreData = {
                hasMoreAssignedCompletedTask: remainingCompletedTasksCount > 0,
              };
            } else if (params.type === 'open') {
              loadMoreData = {
                isAssignedOpenTaskLoadMore: false,
              };
              isAssignedTaskLoading = {
                isAssignedOpenTaskLoading: false,
              };
              totalCount = {
                assignedOpenTaskCount:
                  response.open_task.pagination_details[0].total_count,
              };
              activeTaskList = {
                ...store.getState().TaskReducer.active_tasks_list,
                open: [...response.open_task.pagination_data],
              };
              remainingOpenTasksCount =
                response.open_task.pagination_details[0].total_count -
                (activeTaskList.open ? activeTaskList.open.length : 0);
              hasMoreData = {
                hasMoreAssignedOpenTask: remainingOpenTasksCount > 0,
              };
            } else {
              loadMoreData = {
                isAssignedCompletedTaskLoadMore: false,
                isAssignedOpenTaskLoadMore: false,
              };
              isAssignedTaskLoading = {
                isAssignedCompletedTaskLoading: false,
                isAssignedOpenTaskLoading: false,
              };
              totalCount = {
                assignedCompletedTaskCount: !isEmpty(response.completed_task)
                  ? response.completed_task.pagination_details[0].total_count
                  : 0,
                assignedOpenTaskCount: !isEmpty(response.open_task)
                  ? response.open_task.pagination_details[0].total_count
                  : 0,
              };
              activeTaskList = {
                ...store.getState().TaskReducer.active_tasks_list,
                completed: !isEmpty(response.completed_task)
                  ? [...response.completed_task.pagination_data]
                  : [],
                open: !isEmpty(response.open_task)
                  ? [...response.open_task.pagination_data]
                  : [],
              };
              if (
                !isEmpty(response.completed_task) &&
                !isEmpty(response.completed_task.document_url_details)
              ) {
                documentUrlDetails = [
                  ...response.completed_task.document_url_details,
                ];
              }
              if (
                !isEmpty(response.open_task) &&
                !isEmpty(response.open_task.document_url_details)
              ) {
                documentUrlDetails = [
                  ...documentUrlDetails,
                  ...response.open_task.document_url_details,
                ];
              }
              documentUrlDetails = documentUrlDetails.filter(
                (doc, index, docArray) =>
                  docArray.findIndex(
                    (eachDoc) => eachDoc.document_id === doc.document_id,
                  ) === index,
              );
              if (!isEmpty(response.completed_task)) {
                remainingCompletedTasksCount =
                  response.completed_task.pagination_details[0].total_count -
                  (activeTaskList.completed
                    ? activeTaskList.completed.length
                    : 0);
              }
              if (!isEmpty(response.open_task)) {
                remainingOpenTasksCount =
                  response.open_task.pagination_details[0].total_count -
                  (activeTaskList.open ? activeTaskList.open.length : 0);
              }
              hasMoreData = {
                hasMoreAssignedCompletedTask: remainingCompletedTasksCount > 0,
                hasMoreAssignedOpenTask: remainingOpenTasksCount > 0,
              };
            }

            if (
              type === M_T_STRINGS.TASK_LIST.GET_TASK_LIST ||
              type === M_T_STRINGS.TASK_LIST.INPUT_HANDLER
            ) {
              const { searchText } = store.getState().TaskReducer;
              if (params.search && params.search !== searchText) {
                searchCancel = true;
              }
              successData = {
                ...hasMoreData,
                active_tasks_list: activeTaskList,
                document_url_details: [...documentUrlDetails],
                ...totalCount,
                ...isAssignedTaskLoading,
                ...loadMoreData,
              };
            } else if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) {
              const { active_tasks_list } = cloneDeep(
                store.getState().TaskReducer,
              );

              if (params.type === 'completed') {
                const reponseDataList = response.completed_task.pagination_data;
                if (!isEmpty(active_tasks_list.completed)) {
                  active_tasks_list.completed = reponseDataList;
                  remainingCompletedTasksCount =
                    response.completed_task.pagination_details[0].total_count -
                    (active_tasks_list.completed
                      ? active_tasks_list.completed.length
                      : 0);
                  hasMoreData = {
                    hasMoreAssignedCompletedTask:
                      remainingCompletedTasksCount > 0,
                  };
                }
              } else if (params.type === 'open') {
                const reponseDataList = response.open_task.pagination_data;
                if (!isEmpty(active_tasks_list.open)) {
                  active_tasks_list.open = reponseDataList;
                  remainingOpenTasksCount =
                    response.open_task.pagination_details[0].total_count -
                    (active_tasks_list.open
                      ? active_tasks_list.open.length
                      : 0);
                  hasMoreData = {
                    hasMoreAssignedOpenTask: remainingOpenTasksCount > 0,
                  };
                }
              } else {
                if (
                  !isEmpty(response.completed_task) &&
                  !isEmpty(active_tasks_list.completed)
                ) {
                  const reponseCompletedDataList =
                    response.completed_task.pagination_data;
                  active_tasks_list.completed.push(...reponseCompletedDataList);
                  remainingCompletedTasksCount =
                    response.completed_task.pagination_details[0].total_count -
                    (active_tasks_list.completed
                      ? active_tasks_list.completed.length
                      : 0);
                }
                if (
                  !isEmpty(response.open_task) &&
                  !isEmpty(active_tasks_list.open)
                ) {
                  const reponseOpenDataList =
                    response.open_task.pagination_data;
                  active_tasks_list.open.push(...reponseOpenDataList);
                  remainingOpenTasksCount =
                    response.open_task.pagination_details[0].total_count -
                    (active_tasks_list.open
                      ? active_tasks_list.open.length
                      : 0);
                }

                hasMoreData = {
                  hasMoreAssignedCompletedTask:
                    remainingCompletedTasksCount > 0,
                  hasMoreAssignedOpenTask: remainingOpenTasksCount > 0,
                };
              }

              successData = {
                ...hasMoreData,
                active_tasks_list,
                ...totalCount,
                ...isAssignedTaskLoading,
                ...loadMoreData,
              };
            }
            if (
              store.getState().TaskReducer.searchText &&
              store.getState().TaskReducer.searchAccordionIndex === 3 &&
              !searchCancel
            ) {
              dispatch(taskListApiSuccess(successData));
            }
            if (
              !store.getState().TaskReducer.searchText &&
              store.getState().TaskReducer.tab_index === 3
            ) {
              dispatch(taskListApiSuccess(successData));
            }
            resolve();
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            let dataErrorFields = {};
            if (params.type === 'completed') {
              dataErrorFields = {
                ...store.getState().TaskReducer.common_server_error,
                assigned_completed_common_server_error:
                  errors.common_server_error,
              };
            } else if (params.type === 'open') {
              dataErrorFields = {
                ...store.getState().TaskReducer.common_server_error,
                assigned_open_common_server_error: errors.common_server_error,
              };
            } else {
              dataErrorFields = {
                ...store.getState().TaskReducer.common_server_error,
                assigned_completed_common_server_error:
                  errors.common_server_error,
                assigned_open_common_server_error: errors.common_server_error,
              };
            }
            showToastPopover(
              translate('error_popover_status.somthing_went_wrong'),
              translate('error_popover_status.refresh_try_again'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            dispatch(taskListApiFailure(dataErrorFields));
          }
          resolve();
        })
        .catch((error) => {
          if (error && (error.code === 'ERR_CANCELED')) return;
          console.log('Logic Error:', error);
          const errors = generateGetServerErrorMessage(error);
          let dataErrorFields = {};
          if (params.type === 'completed') {
            dataErrorFields = {
              ...store.getState().TaskReducer.common_server_error,
              assigned_completed_common_server_error:
                errors.common_server_error,
            };
          } else if (params.type === 'open') {
            dataErrorFields = {
              ...store.getState().TaskReducer.common_server_error,
              assigned_open_common_server_error: errors.common_server_error,
            };
          } else {
            dataErrorFields = {
              ...store.getState().TaskReducer.common_server_error,
              assigned_completed_common_server_error:
                errors.common_server_error,
              assigned_open_common_server_error: errors.common_server_error,
            };
          }
          dispatch(taskListApiFailure(dataErrorFields));
          if (error && error.code === SERVER_ERROR_CODES.AXIOS_TIMEOUT) {
            showToastPopover(
              translate('error_popover_status.somthing_went_wrong'),
              translate('error_popover_status.refresh_try_again'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            if (history && history.replace) {
              routeNavigate(history, ROUTE_METHOD.REPLACE, HOME);
            }
          }
          resolve();
        });
    });
  };

export const getDraftTaskListDataThunk =
  (params, type, history) => (dispatch) => {
    if (type === M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST) {
      const { isRefresh } = store.getState().TaskReducer;
      dispatch(taskListDataChange({ isRefresh: !isRefresh }));
    }
    if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) dispatch(taskListApiLoadMoreStarted());
    else dispatch(taskListApiStarted());
    return new Promise((resolve) => {
      const updatedParams = cloneDeep({ ...params });
      if (has(updatedParams, ['search']) && isEmptyString(updatedParams.search)) {
        delete updatedParams.search;
      } else updatedParams.search = trimString(updatedParams.search);
      getDraftTaskList(updatedParams, draftCancelToken)
        .then((response) => {
          let successData = null;
          let searchCancel;
          if (!isEmpty(response)) {
            if (
              type === M_T_STRINGS.TASK_LIST.GET_TASK_LIST ||
              type === M_T_STRINGS.TASK_LIST.INPUT_HANDLER
            ) {
              const { searchText } = store.getState().TaskReducer;
              if (params.search && params.search !== searchText) {
                searchCancel = true;
              }
              const remainingTasksCount = response.pagination_details[0].total_count - response.pagination_data.length;

              successData = {
                hasMore: remainingTasksCount > 0,
                active_tasks_list: response.pagination_data,
                document_url_details: response.document_url_details,
                count: response.pagination_details[0].total_count,
              };
            } else if (type === M_T_STRINGS.TASK_LIST.LOAD_DATA) {
              const { active_tasks_list } = cloneDeep(
                store.getState().TaskReducer,
              );
              const reponseDataList = response.pagination_data;
              active_tasks_list.push(...reponseDataList);
              successData = {
                active_tasks_list,
              };
            }
            if (store.getState().TaskReducer.searchText && !searchCancel) dispatch(taskListApiSuccess(successData));
            if (!store.getState().TaskReducer.searchText) dispatch(taskListApiSuccess(successData));
            resolve();
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            const errors = generateGetServerErrorMessage(err);
            showToastPopover(
              translate('error_popover_status.somthing_went_wrong'),
              translate('error_popover_status.refresh_try_again'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            dispatch(taskListApiFailure(errors.common_server_error));
          }
          resolve();
        })
        .catch((error) => {
          if (error && (error.code === 'ERR_CANCELED')) return;
          const errors = generateGetServerErrorMessage(error);
          dispatch(taskListApiFailure(errors.common_server_error));
          if (error && error.code === SERVER_ERROR_CODES.AXIOS_TIMEOUT) {
            showToastPopover(
              translate('error_popover_status.somthing_went_wrong'),
              translate('error_popover_status.refresh_try_again'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            if (history && history.replace) {
              routeNavigate(history, ROUTE_METHOD.REPLACE, HOME);
            }
          }
          resolve();
        });
    });
  };
// Task Content Actions

const taskContentApiStarted = (isResponseCard) => {
  if (isResponseCard) return { type: TASK_ASSIGNEES_RESPONSE.STARTED };
  return {
    type: TASK_CONTENT_ACTION.STARTED,
  };
};

const taskContentApiSuccess = (data, isResponseCard) => {
  if (isResponseCard) return { type: TASK_ASSIGNEES_RESPONSE.SUCCESS, payload: { ...data } };
  console.log('task content api', cloneDeep(data));
  return {
    type: TASK_CONTENT_ACTION.SUCCESS,
    payload: { ...data },
  };
};

export const taskContentDataChange = (data) => (dispatch) => {
  dispatch({
    type: TASK_CONTENT_ACTION.DATA_CHANGE,
    payload: { ...data },
  });
  return Promise.resolve();
};

export const taskContentRespondantsSummaryDataChange = (data) => (dispatch) => {
  dispatch({
    type: TASK_CONTENT_ACTION.TASK_CONTENT_RESPONDANTS_SUMMARY_DATA_CHANGE,
    payload: { ...data },
  });
  return Promise.resolve();
};

export const formUploadFieldChange = (data) => {
  return {
    type: TASK_CONTENT_ACTION.FORM_UPLOAD_FIELD_CHANGE,
    payload: { ...data },
  };
};

export const formTableUploadFieldChange = (tableId, tableRow, id, objValue) => {
  return {
    type: TASK_CONTENT_ACTION.FORM_TABLE_UPLOAD_FIELD_CHANGE,
    payload: {
      tableId,
      tableRow,
      id,
      objValue,
    },
  };
};

export const taskContentFileUploadProgressChange =
  (fileId, progressPercentage) => (dispatch) => {
    dispatch({
      type: TASK_CONTENT_ACTION.FILE_UPLOAD_PROGRESS_CHANGE,
      payload: {
        fileId,
        progressPercentage,
      },
    });
  };

const taskContentApiFailure = (error, isResponseCard) => {
  if (isResponseCard) return { type: TASK_ASSIGNEES_RESPONSE.FAILURE, payload: error };
  return {
    type: TASK_CONTENT_ACTION.FAILURE,
    payload: error,
  };
};

export const setTaskContentSeverError = (error) => {
  return {
    type: TASK_CONTENT_ACTION.SERVER_ERROR,
    payload: error,
  };
};

export const taskContentApiCancel = () => {
  return {
    type: TASK_CONTENT_ACTION.CANCEL,
  };
};

export const clearTaskContentData = () => (dispatch) => {
  dispatch({
    type: TASK_CONTENT_ACTION.CLEAR,
  });
  return Promise.resolve();
};

const showAcceptReject = (show_accept_reject) => {
  return {
    type: TASK_CONTENT_ACTION.REQUIRED_TASK_ACTION,
    payload: { show_accept_reject },
  };
};

export const activeTaskDataChange = (activeTask) => {
  return {
    type: TASK_CONTENT_ACTION.UPDATE_ACTIVE_TASK,
    payload: activeTask,
  };
};

export const submitTaskApiThunk =
  (data, isFormData, onTaskSuccessfulSubmit, onCloseIconClick, readNotificationForCompleted, history, onSubmitFailure = null, onSuccess = null) => (dispatch) => {
    dispatch(taskContentApiStarted());
    submitTask(data, isFormData)
      .then(() => {
        readNotificationForCompleted(data?.task_log_id, data?.instance_id);
        setPointerEvent(false);
        updatePostLoader(false);
        const taskState = { ...history?.location?.state, hideClosePopper: true };
        routeNavigate(history, ROUTE_METHOD.REPLACE, EMPTY_STRING, EMPTY_STRING, taskState);
        onTaskSuccessfulSubmit();
        onSuccess?.();
        // data.action. == cancel cancel popover
        if (data.action_name === 'Cancel') {
          showToastPopover(
            M_T_STRINGS.CANCEL_TASK_SUCCESSFUL_UPDATE.title,
            M_T_STRINGS.CANCEL_TASK_SUCCESSFUL_UPDATE.subTitle,
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
        } else {
          showToastPopover(
            M_T_STRINGS.SUBMIT_TASK_SUCCESSFUL_UPDATE.title,
            M_T_STRINGS.SUBMIT_TASK_SUCCESSFUL_UPDATE.subTitle,
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
        }
      })
      .catch((error) => {
        console.log('### submit', error);
        setPointerEvent(false);
        updatePostLoader(false);
        onSubmitFailure?.();

        if (
          error.response &&
          error.response.data &&
          !jsUtils.isEmpty(error.response.data.errors)
        ) {
          // const { activeTask } = store.getState().TaskContentReducer;
          let errorList = {};
          let action_error_list = {};
          let errorHandled = false;
          const errorListFromServer = get(error, ['response', 'data', 'errors'], []);
          for (let i = 0; i < errorListFromServer.length; i++) {
            const { field, type, indexes, limit } = errorListFromServer[i] || {};
            if (type === 'number.integer') {
              const fieldParts = field?.split('.');
              if (fieldParts.length > 1) {
                errorList[fieldParts.join(',')] = translate('server_validation_constants.this_field_must_be_an_integer');
              } else {
                errorList[fieldParts[0]] = translate('server_validation_constants.this_field_must_be_an_integer');
              }
              dispatch(activeTaskDataChange({ errorList }));
              break;
            }
            if (type === 'array.max' && limit) {
              errorHandled = true;
              errorList[field] = `${translate('server_validation_constants.must_contain_less_than_equal_to')} ${limit} ${translate('server_validation_constants.items')}`;
              dispatch(activeTaskDataChange({ errorList }));
              break;
            }
            if (field === 'status' && type === 'invalid') {
              errorHandled = true;
              showToastPopover(
                translate('task_content.landing_page.task_action.popper.accepted_title'),
                translate('task_content.landing_page.task_action.popper.accepted_subtitle'),
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
              dispatch(taskContentDataChange({
                isTaskDataLoading: false,
              }));
              dispatch(taskListDataChange({ activeTaskId: null }));
              onCloseIconClick();
              break;
            }
            if (field === 'task_log_id' && type === 'not_exist') {
              errorHandled = true;
              showToastPopover(
                translate('task_content.landing_page.task_action.popper.cancelled_title'),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
              dispatch(taskContentDataChange({
                isTaskDataLoading: false,
              }));
              dispatch(taskListDataChange({ activeTaskId: null }));
              onCloseIconClick(true);
              break;
            }
            if (field === 'action' && type === 'any.required') {
              errorHandled = true;
              showToastPopover(
                translate('error_popover_status.select_task_action'),
                EMPTY_STRING,
                FORM_POPOVER_STATUS.SERVER_ERROR,
                true,
              );
              const errors = generateGetServerErrorMessage(error);
              dispatch(taskContentApiFailure(errors.common_server_error));
              break;
            }
            if (type === 'invalid') {
              if (field === 'reviewer') {
                action_error_list = {
                  reviewers_search_value: translate('error_popover_status.choose_user_team'),
                };
              } else if (UUID_V4_REGEX.test(field) && indexes?.includes?.('Restricted Users')) {
                const _errorList = { [field]: translate('error_popover_status.invalid_teams_or_users') };
                dispatch(activeTaskDataChange({ errorList: _errorList }));
              } else {
                const errorKeys = field ? field.split('.') : EMPTY_STRING || [];
                if (errorKeys.length && errorKeys[errorKeys.length - 1] === 'users') {
                  const { formUploadData } = cloneDeep(store.getState().TaskContentReducer);
                  if (errorKeys.length === 2) { // task field error
                    errorList = {
                      ...errorList,
                      [errorKeys[0]]: translate('error_popover_status.invalid_user'),
                    };
                  } else { // table field error
                    const [tableUuid, rowIndex, fieldUuid] = errorKeys;
                    if (!isEmpty(tableUuid)) {
                      const postDataTableRow = jsUtils.get(data, [tableUuid, rowIndex]);
                      const tableData = formUploadData[tableUuid] || [];
                      const index = tableData.findIndex((rowData) => (postDataTableRow._id === rowData._id));
                      if (index > -1) {
                        const tableRow = tableData[index];
                        if (!isEmpty(tableRow)) {
                          const errorListKey = [tableUuid, tableRow.temp_row_uuid, fieldUuid].join(',');
                          errorList = {
                            ...errorList,
                            [errorListKey]: translate('error_popover_status.invalid_user'),
                          };
                        }
                      }
                    }
                  }
                }
              }
            }
            if (type === 'custom') {
              const errorKeys = field ? field.split('.') : EMPTY_STRING || [];
              const [tableUuid, fieldUuid] = errorKeys;
              if (!jsUtils.isEmpty(tableUuid) && !jsUtils.isEmpty(fieldUuid) && (indexes === 'Unique Column Error')) {
                const selectedTable = data[tableUuid];
                const [uniqueColumnValidationMessage, notUniqueIndices] = getTableUniqueColumnMessage(
                  selectedTable,
                  fieldUuid,
                  false,
                );

                if (uniqueColumnValidationMessage) {
                  errorList = {
                    ...errorList,
                    [tableUuid]: uniqueColumnValidationMessage,
                    [`${tableUuid}non_unique_indices`]: notUniqueIndices,
                  };
                }
              }
            }
          }

          if ((!isEmpty(errorList) || !isEmpty(action_error_list)) && !errorHandled) {
            dispatch(taskContentDataChange({
              isTaskDataLoading: false,
              error_list: errorList,
              action_error_list,
            }));
          } else {
            const errors = generateGetServerErrorMessage(error);
            dispatch(taskContentApiFailure(errors.common_server_error));
          }
        } else {
          const errors = generateGetServerErrorMessage(error);
          dispatch(taskContentApiFailure(errors.common_server_error));
        }
      });
  };

export const snoozeTaskApiThunk = (params, onCloseIconClick, closeSnoozeTask, history) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  dispatch(taskContentApiStarted());
  snoozeTaskApiService(params)
    .then(async (response) => {
      console.log('snoozeIt', response);
      const taskState = { ...history?.state, hideClosePopper: true };
      routeNavigate(history, ROUTE_METHOD.REPLACE, EMPTY_STRING, EMPTY_STRING, taskState);
      setPointerEvent(false);
      updatePostLoader(false);
      await closeSnoozeTask?.();
      await onCloseIconClick();
      showToastPopover(
        translate('error_popover_status.task_snoozed'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SUCCESS,
        true,
      );
    })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      console.log('snooze task error', error, error.response);
      let errors = {};
      if (jsUtils.get(error, ['response', 'data', 'errors']) === 1100) {
        errors.common_server_error = jsUtils.get(error, [
          'response',
          'data',
          'errors',
        ]);
      } else errors = generateGetServerErrorMessage(error);
      console.log('repicate task error=>', errors);
      showToastPopover(
        translate('error_popover_status.task_not_snoozed'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      dispatch(
        taskContentApiFailure(errors.common_server_error, false),
      );
      // updateErrorPopoverInRedux(ACCOUNT_SETTINGS_FORM.UPDATE_FAILURE, errors.common_server_error);
    });
};

export const replicateTaskApiThunk = (params, history, refreshTaskListApiParams = {}) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  dispatch(taskContentApiStarted());
  replicateTaskApiService(params)
    .then(async (response) => {
      setPointerEvent(false);
      updatePostLoader(false);
      const selectedCardTab = 5;
      const draftTaskIdPathName = isBasicUserMode(history) ?
      getDefaultAppRoutePath(`${TASKS}/${DRAFT_TASK}/${response.result.data._id}`) :
      getDevRoutePath(`${TASKS}/${DRAFT_TASK}/${response.result.data._id}`);
      const taskActionState = {
        taskDetails: { ...response.result.data },
        document_url_details: [],
        selectedCardTab,
        taskListApiParams: { ...refreshTaskListApiParams, taskListType: DRAFT_TASK },
        redirectedFrom: REDIRECTED_FROM.TASK_LIST,
        hideClosePopper: true,
      };
      routeNavigate(history, ROUTE_METHOD.PUSH, draftTaskIdPathName, EMPTY_STRING, taskActionState, true);
    })
    .catch((error) => {
      setPointerEvent(false);
      updatePostLoader(false);
      console.log('repicate task error', error, error.response);
      let errors = {};
      if (jsUtils.get(error, ['response', 'data', 'errors']) === 1100) {
        errors.common_server_error = jsUtils.get(error, [
          'response',
          'data',
          'errors',
        ]);
      } else errors = generateGetServerErrorMessage(error);
      console.log('repicate task error=>', errors);
      if (
        error.response &&
        error.response.data &&
        error.response.data.errors[0].field === 'assignees.users' && error.response.data.errors[0].type === 'invalid'

      ) {
        const taskState = { ...history?.state, hideClosePopper: true };
        routeNavigate(history, ROUTE_METHOD.REPLACE, EMPTY_STRING, EMPTY_STRING, taskState);
        showToastPopover(
          `${error.response.data.errors[0].indexes.length === 1 ? 'One' : 'Some'} of the task assignees has been deactivated`,
          `Activate the ${error.response.data.errors[0].indexes.length === 1 ? 'owner' : 'owners'} to replicate the task`,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
      dispatch(
        taskContentApiFailure(errors.common_server_error, false),
      );
      // updateErrorPopoverInRedux(ACCOUNT_SETTINGS_FORM.UPDATE_FAILURE, errors.common_server_error);
    });
};

export const updateActiveTaskDetailsApiAction =
  (data, isFormData, onTaskSuccessfulSubmit, onCloseIconClick, history) => (dispatch) => {
    dispatch(taskContentApiStarted());
    updateActiveTaskDetailsApiService(data, isFormData)
      .then(async () => {
        const taskState = { ...history?.state, hideClosePopper: true };
        routeNavigate(history, ROUTE_METHOD.REPLACE, EMPTY_STRING, EMPTY_STRING, taskState);
        setPointerEvent(false);
        updatePostLoader(false);
        console.log('### update');
        await onCloseIconClick();
        showToastPopover(
          M_T_STRINGS.SAVE_TASK_SUCCESSFUL_UPDATE.title,
          M_T_STRINGS.SAVE_TASK_SUCCESSFUL_UPDATE.subTitle,
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
        dispatch(taskContentApiSuccess({ isTaskDataLoading: false }));
      })
      .catch((error) => {
        console.log('### update error', error);

        if (axios.isCancel(error)) {
          console.log('cancelled api error');
        } else {
          setPointerEvent(false);
          updatePostLoader(false);
          if (error?.response?.data?.errors?.[0]) {
            const { field, type } = error.response.data.errors[0];
          if (field === 'status' &&
            type === 'invalid'
          ) {
            showToastPopover(
              translate('task_content.landing_page.task_action.popper.accepted_title'),
              translate('task_content.landing_page.task_action.popper.accepted_subtitle'),
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            dispatch(taskContentDataChange({
              isTaskDataLoading: false,
            }));
            dispatch(taskListDataChange({ activeTaskId: null }));
            onCloseIconClick();
          } else if (field === 'action' &&
            type === 'any.required'
          ) {
            showToastPopover(
              translate('error_popover_status.select_task_action'),
              EMPTY_STRING,
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            const errors = generateGetServerErrorMessage(error);
            dispatch(taskContentApiFailure(errors.common_server_error));
          } else if (field === 'task_log_id' &&
            type === 'not_exist'
          ) {
            showToastPopover(
              translate('task_content.landing_page.task_action.popper.cancelled_title'),
              EMPTY_STRING,
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
            const errors = generateGetServerErrorMessage(error);
            dispatch(taskContentApiFailure(errors.common_server_error));
            onCloseIconClick();
          } else {
            const errors = generateGetServerErrorMessage(error);
            dispatch(taskContentApiFailure(errors.common_server_error));
          }
          } else {
            const errors = generateGetServerErrorMessage(error);
            dispatch(taskContentApiFailure(errors.common_server_error));
          }
        }
      });
  };

export const getPrecedingStepsApiThunk = (params) => (dispatch) =>
  new Promise((resolve) => {
    getPrecedingStepsApi(params)
      .then((response) => {
        if (!isEmpty(response)) {
          const precedingStepsList = response.map((stepData) => {
            return {
              label: stepData.task_name,
              value: stepData._id,
            };
          });
          dispatch(taskContentApiSuccess({ precedingStepsList }));
          resolve(precedingStepsList);
        }
        resolve();
      })
      .catch((error) => {
        resolve(error);
      });
  });

export const getTaskDetailsApiThunk =
  (params, declareStateVariables, isResponseCard, readNotificationForOpened = () => { }, t = translateFunction, userProfileData = {}) => (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(taskContentApiStarted(isResponseCard));
      console.log('is refresh task details api started', params, declareStateVariables, isResponseCard, t);
      getTaskData(params)
        .then(async (response) => {
          readNotificationForOpened(response?.task_log_info?._id, response?.task_log_info?.instance_id);

          // getting latest activity data
          let actionHistoryDataLatest = {};
          const userDetails = getUserProfileData();
          if ((userDetails.id === response?.task_log_info?.accepted_by?._id) || response?.task_log_info?.show_accept_reject) {
            if (response?.task_log_info?.instance_id) {
              const actionHistoryParams = {
                page: 1,
                size: 2,
                instance_id: response?.task_log_info?.instance_id,
              };
              actionHistoryDataLatest = await apiGetActionHistoryByInstanceId(actionHistoryParams);
            }
          }

          let schema = null;
          if (response.form_metadata.sections) {
            schema = constructSchemaFromData(
              response.form_metadata.sections,
              false,
              response.form_metadata.fields.form_visibility,
            );
          }
          const isCompletedTask =
            response.task_log_info.task_status === 'completed';
          const state_variables = declareStateVariables(
            response.form_metadata.sections,
            response.active_form_content,
            response.document_url_details,
            isCompletedTask,
          );
          console.log('xyz state_variables', state_variables);
          const selectedTestAssignee = get(cloneDeep(response), ['active_task_details', 'complete_as_user'], {});
          const selected_task_assignee = get(cloneDeep(response), ['task_log_info', 'accepted_as'], null);
          // store only datalist property picker related document field output data
          //  const documentFields = {};

          if (
            !jsUtils.isEmpty(response.active_form_content)
            // &&
            // isCompletedTask
          ) {
            if (
              !jsUtils.isEmpty(response.form_metadata) &&
              !jsUtils.isEmpty(response.form_metadata.sections)
            ) {
              const { sections } = response.form_metadata;
              sections.forEach((section) => {
                if (section.field_list) {
                  section.field_list.forEach((eachFieldList) => {
                    if (eachFieldList.fields) {
                      eachFieldList.fields.forEach((field) => {
                        if (
                          !jsUtils.isEmpty(
                            response.active_form_content[field.field_uuid],
                          )
                        ) {
                          if ((isCompletedTask && field.field_type === FIELD_TYPE.FILE_UPLOAD)) {
                            const fileDetails = jsUtils.find(
                              response.document_url_details,
                              {
                                document_id:
                                  response.active_form_content[field.field_uuid],
                              },
                            );
                            if (fileDetails && fileDetails.signedurl) {
                              response.active_form_content[
                                field.field_uuid
                              ] = `${fileDetails.original_filename.filename} (${fileDetails.original_filename.content_type} )`;
                            }
                          } else if (PROPERTY_PICKER_ARRAY.includes(field.field_type) && getFieldType(field) === FIELD_TYPE.FILE_UPLOAD) {
                            response.active_form_content[
                              field.field_uuid
                            ] = getDefaultValue(response.active_form_content, field.field_uuid, [field.field_uuid], response.document_url_details);
                          }
                        }
                      });
                    }
                  });
                }
              });
            }
          }
          const { taskActionUploadData, ...taskActionFieldsData } =
            getTaskActionFieldsData(
              response.active_task_details,
              response.document_url_details,
            );

          // response = setInitialFormVisibleFields(response);
          // For New FormBuilder
          const activeTask = {};
          activeTask.metaData = {
            moduleId: response.task_log_info?.task_metadata_id,
            instanceId: response.task_log_info.instance_id,
            formUUID: response.form_metadata?.form_uuid,
            stepId: response.task_log_info?.step_id,
            flowId: response?.task_log_info?.flow_id,
            dataListId: response?.task_log_info?.data_list_id,
            taskCategory: response?.task_log_info?.task_category,
          };
          activeTask.fields = {};
          activeTask.activeFormData = state_variables;
          activeTask.formMetaData = {
            dependentFields: [
              ...(response.form_metadata?.fields?.dependent_fields || []),
              ...(response.form_metadata?.actions?.dependent_field || []),
            ],
            formVisibility: response.form_metadata?.fields?.form_visibility || {},
            buttonVisibility: response.form_metadata?.actions?.button_visibility || {},
          };
          activeTask.documentDetails = {};
          activeTask.documentURLDetails = response.document_url_details;
          activeTask.sections = (response.form_metadata?.sections || []).map((section) => {
            const clonedSection = cloneDeep(section);
            clonedSection.layout = constructTreeStructure(section.contents);
            section.field_metadata.forEach((f) => {
              const field = normalizer(f, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS);
              if ((field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.DATE) ||
              (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.DATETIME)) {
                field.originalValidationData = f?.[REQUEST_FIELD_KEYS.VALIDATIONS];
              }

              if (PROPERTY_PICKER_ARRAY.includes(field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE])) {
                const referenceFieldType = field?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE];
                if ((referenceFieldType === FIELD_TYPE.DROPDOWN) ||
                (referenceFieldType === FIELD_TYPE.RADIO_GROUP) ||
                (referenceFieldType === FIELD_TYPE.CHECKBOX)) {
                  section?.field_metadata?.forEach((eachField) => {
                    if (eachField?.[REQUEST_FIELD_KEYS.FIELD_UUID] === field?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[RESPONSE_FIELD_KEYS.REFERENCE_FIELD_UUID]) {
                      field[RESPONSE_FIELD_KEYS.CHOICE_VALUES] = eachField?.[REQUEST_FIELD_KEYS.CHOICE_VALUES];
                    }
                  });
                }
              }

              if (field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.DATA_LIST) {
                field[RESPONSE_FIELD_KEYS.CHOICE_VALUE_OBJ] = {};
                const displayFields = field?.[RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS]?.[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS] || [];
                displayFields.forEach((uuid) => {
                  const displayField = section?.field_metadata?.find((eachField) => eachField?.[REQUEST_FIELD_KEYS.FIELD_UUID] === uuid);
                    if (displayField) {
                      const choiceValues = get(displayField, [REQUEST_FIELD_KEYS.CHOICE_VALUES], []);
                      const choiceObj = {};
                      choiceValues.forEach((c) => {
                        choiceObj[c.value.toString()] = c.label;
                      });
                      if (!isEmpty(choiceObj)) field[RESPONSE_FIELD_KEYS.CHOICE_VALUE_OBJ][uuid] = choiceObj;
                    }
                });
              }
              const fieldUUID = field[RESPONSE_FIELD_KEYS.FIELD_UUID];
              activeTask.fields[fieldUUID] = field;
            });
            activeTask.actions = getActionsForTaskContent(response.form_metadata.actions.action_details);
            return clonedSection;
          });

          activeTask.showSectionName = response?.form_metadata?.show_section_name || false;

          if (isCompletedTask) {
            const { infoFieldFormState } = constructInformationFieldFormContent({
              sections: response.form_metadata.sections,
              activeFormContent: response.active_form_content,
              documentUrlDetails: response.document_url_details,
              userProfileData,
            });

            console.log('informationFieldFormContent', infoFieldFormState, state_variables);

            activeTask.informationFieldFormContent = infoFieldFormState;
          }

          dispatch(
            taskContentApiSuccess(
              {
                formUploadData: {
                  ...state_variables, ...taskActionUploadData,
                  // ...(documentFields || {})
                },
                ref_uuid: uuidv4(),
                temporaryFormUploadData: {
                  ...state_variables,
                  ...taskActionUploadData,
                },
                task_title:
                  response.task_log_info.task_name ||
                  response.task_log_info.flow_name,
                active_task_details: isResponseCard
                  ? { task_log_info: {}, form_metadata: {} }
                  : response,
                activeTask,
                assignee_task_details: isResponseCard ? response : {},
                taskValidationSchema: schema,
                show_accept_reject: response.task_log_info.show_accept_reject,
                show_reassign: response.task_log_info.show_reassign,
                action:
                  response.form_metadata && response.form_metadata.actions
                    ? response.form_metadata.actions[0]
                    : null,
                document_url_details: response.document_url_details,
                selectedTestAssignee: selectedTestAssignee,
                selected_task_assignee: selected_task_assignee,
                ...taskActionFieldsData,
                latest_action_history:
                (actionHistoryDataLatest?.pagination_data?.[0]?.action_history_type === USER_ACTIONS.COMPLETED &&
                  response?.task_log_info?.task_category !== TASK_CATEGORY_FLOW_TASK) ?
                  actionHistoryDataLatest?.pagination_data?.[1] :
                  actionHistoryDataLatest?.pagination_data?.[0] || {}, // it always extracts the latest activity
              },
              isResponseCard,
            ),
          );

          const actionsList = get(cloneDeep(response), ['form_metadata', 'actions', 'action_details'], []);
          const taskLogId = get(cloneDeep(response), ['task_log_info', '_id'], []);

          if (!isEmpty(actionsList)) {
            actionsList.forEach((actionData) => {
              if (actionData.action_type === ACTION_TYPE.SEND_BACK) {
                dispatch(getPrecedingStepsApiThunk({
                  task_log_id: taskLogId,
                }));
              }
            });
          }

          resolve(response);
        })
        .catch((error) => {
          console.log('is refresh error', error, error.response);
          let errors = {};
          if (jsUtils.get(error, ['response', 'data', 'errors']) === 1100) {
            errors.common_server_error = jsUtils.get(error, [
              'response',
              'data',
              'errors',
            ]);
          } else if (
            jsUtils.get(error, ['response', 'data', 'errors', 0, 'type']) === 'not_exist'
          ) {
            if (jsUtils.get(error, ['response', 'data', 'errors', 0, 'field']) === 'assigned_to') {
              errors = {
                common_server_error: COMMON_SERVER_ERROR_TYPES.UNAUTHORIZED,
              };
            } else if (jsUtils.get(error, ['response', 'data', 'errors', 0, 'field']) === 'task_log_id') {
              errors = {
                common_server_error: COMMON_SERVER_ERROR_TYPES.NOT_EXIST,
              };
            }
          } else if (jsUtils.get(error, ['response', 'status']) === 401) {
              if (jsUtils.get(error, ['response', 'data', 'errors', 0, 'context']) === UNAUTHORIZED_CONTEXT.TASK) {
                errors = {
                  common_server_error: UNAUTHORIZED_CONTEXT.TASK,
                };
              } else errors = generateGetServerErrorMessage(error);
            } else errors = generateGetServerErrorMessage(error);
          console.log('is refresh errors=>', errors);
          dispatch(
            taskContentApiFailure(errors.common_server_error, isResponseCard),
          );
          reject();
        });
    });

export const getTaskCompletedAssigneesApiThunk =
  (params, declareStateVariables, refresh) => async (dispatch) =>
    new Promise((resolve) => {
      dispatch(taskAssigneesApiStarted());
      getTaskCompletedAssignees(params)
        .then((response) => {
          const { task_assignee, document_url_details, task_all_assignee } = response;
          if (
            !isEmpty(task_assignee)
          ) {
            console.log('is refresh', refresh);
            const completedUsers = task_assignee;

            let taskLogId;
            if (refresh) {
              taskLogId =
                store.getState().TaskContentReducer
                  .individualResponseSelectedValue;
              dispatch(
                taskAssigneesApiSuccess({
                  completedAssignees: [...completedUsers],
                  completedAssigneesDocumentUrlDetails: document_url_details,
                  initialCompletedAssigneesLoading: false,
                  refresh,
                  taskLogId,
                  taskAssignee: task_all_assignee,
                  individualResponseSelectedInstanceId: store.getState().TaskContentReducer
                    .individualResponseSelectedInstanceId,
                }),
              );
            } else {
              const prevIndividualRes =
                store.getState().TaskContentReducer
                  .individualResponseSelectedValue;
              const responseObject = completedUsers.find(
                (value) => value._id === prevIndividualRes,
              );
              if (!isEmpty(responseObject)) {
                taskLogId = responseObject?._id;
                dispatch(
                  taskAssigneesApiSuccess({
                    completedAssignees: [...completedUsers],
                    completedAssigneesDocumentUrlDetails: document_url_details,

                    initialCompletedAssigneesLoading: false,
                    refresh,
                    taskLogId,
                    taskAssignee: task_all_assignee,
                    individualResponseSelectedInstanceId: responseObject?.instance_id,
                  }),
                );
              } else {
                taskLogId = completedUsers[0]._id;
                dispatch(
                  taskAssigneesApiSuccess({
                    completedAssignees: [...completedUsers],
                    completedAssigneesDocumentUrlDetails: document_url_details,

                    initialCompletedAssigneesLoading: true,
                    refresh,
                    taskLogId,
                    individualResponseSelectedInstanceId: completedUsers[0].instance_id,
                    taskAssignee: task_all_assignee,
                  }),
                );
                dispatch(
                  getTaskDetailsApiThunk(
                    { task_log_id: taskLogId, is_open_task: 1 },
                    declareStateVariables,
                    true,
                  ),
                );
              }
            }
            return resolve(completedUsers);
          }
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(taskAssigneesApiFailure(errors.common_server_error));
          return resolve(response);
        })
        .catch((error) => {
          const errors = generateGetServerErrorMessage(error);
          dispatch(taskAssigneesApiFailure(errors.common_server_error));
        });
    });
export const getTaskMetadataApiThunk = (params, setAttachment = false) => (dispatch) => {
  dispatch(taskMetadataApiStarted());
  getTaskMetadata(params)
    .then((response) => {
      console.log('taskDetails task reference api', response);
      if (!isEmpty(response)) {
        if (response.task_reference_documents && setAttachment) {
          dispatch(setTaskReferenceDocuments({ files: getTaskReferenceDocumentsFileObject(response.task_reference_documents, response.document_url_details) }));
          dispatch(createTaskSetState({ entityId: response._id }));
        }
        response && response.document_url_details && response.document_url_details.forEach((document) => {
          if (document.original_filename.ref_uuid) dispatch(createTaskSetState({ ref_uuid: document.original_filename.ref_uuid }));
        });
        const reduxTaskDetails = jsUtils.get(store.getState().CreateTaskReducer, ['task_details'], {});
        dispatch(createTaskSetState({
          task_details: { ...jsUtils.cloneDeep(reduxTaskDetails), ...jsUtils.cloneDeep(response) },
        }));
        dispatch(taskMetadataApiSuccess(response));
        return;
      }
      const err = {
        response: {
          status: 500,
        },
      };
      const errors = generateGetServerErrorMessage(err);
      dispatch(taskMetadataApiFailure(errors.common_server_error));
    })
    .catch((error) => {
      let errors = {};
      if (jsUtils.get(error, ['response', 'data', 'error_code']) === 1100) {
        errors.common_server_error = jsUtils.get(error, [
          'response',
          'data',
          'errors',
        ]);
      } else errors = generateGetServerErrorMessage(error);
      console.log('setTaskReferenceDocuments reducer error', error, errors);
      dispatch(taskMetadataApiFailure(errors.common_server_error));
    });
};

export const getSignedUrlDataListApiThunk =
  (
    data,
    uploadDocumentToDMS,
    type,
    doc_details,
    file_ref_uuid,
    table_uuid,
    tableRow,
    index,
    filess,
    currentIndex,
    totalLength,
    recursiveFunc,
    paramEntityId,
    currentFilesLength,
    invalidFileType,
    invalidFileSize,
    isMultiple,
    currentFileIndex,
    fieldInfo = {},
  ) =>
    (dispatch) =>
      new Promise((resolve, reject) => {
        const { particularDataListEntryDetails } =
          store.getState().DataListReducer;
        const entityId =
          jsUtils.get(
            particularDataListEntryDetails,
            ['document_details', 'entity_id'],
            null,
          ) ||
          jsUtils.get(particularDataListEntryDetails, [
            'active_form_content',
            '_id',
          ]) || paramEntityId; // added it here to prevent entity id not being set if there are parallel request
        const refUuid = particularDataListEntryDetails.ref_uuid;
        if (entityId) data.entity_id = entityId;
        if (refUuid) data.ref_uuid = refUuid;
        getUploadSignedUrlApi(data)
          .then((response) => {
            updatePostLoader(false);
            const { particularDataListEntryDetails } = cloneDeep(
              store.getState().DataListReducer,
            );
            const { document_details } = particularDataListEntryDetails;
            set(response, ['file_metadata', 'type'], type);
            console.log('document_details.file_metadatas', document_details);
            if (document_details && document_details.entity_id) {
              document_details.file_metadata.push(...response.file_metadata);
              dispatch(
                addDataListChangeAction({
                  document_details,
                }),
              );
            } else {
              dispatch(
                addDataListChangeAction({
                  document_details: response,
                }),
              );
            }
            console.log('dfsdfds213123sd', response);
            console.log(response.file_metadata);
            if (uploadDocumentToDMS) {
              console.log('uploadDocument shgould be called');
              uploadDocumentToDMS(
                response.file_metadata,
                doc_details,
                file_ref_uuid,
                table_uuid,
                tableRow,
                index,
                filess,
                currentIndex,
                totalLength,
                recursiveFunc,
                response.entity_id,
                currentFilesLength,
                invalidFileType,
                invalidFileSize,
                isMultiple,
                currentFileIndex + 1,
                fieldInfo,
              );
            }
            resolve(true);
          })
          .catch((err) => {
            console.log('dsfsdsfdsfdsfdsfdsfdf', err);
            setPointerEvent(false);
            updatePostLoader(false);
            reject();
          });
      });
export const getSignedUrlApiThunk =
  (
    data,
    uploadDocumentToDMS,
    type,
    file_ref_uuid,
    table_uuid,
    tableRow,
    doc_details = null,
    metadata = null,
    createTask = false,
    index = undefined,
    filess,
    currentIndex,
    totalLength,
    recursiveFunc,
    _entityId,
    currentFilesLength,
    invalidFileType,
    invalidFileSize,
    isMultiple,
    currentFileIndex,
    fieldInfo = {},
    setFileUploadStatus = () => { },
  ) =>
    (dispatch) => {
      if (!createTask) {
        const { ref_uuid } = store.getState().TaskContentReducer;
        data.ref_uuid = ref_uuid;
      } else {
        const { ref_uuid } = store.getState().CreateTaskReducer;
        data.ref_uuid = ref_uuid;
      }
      return new Promise((resolve, reject) => {
        getUploadSignedUrlApi(data)
          .then(async (response) => {
            if (createTask) await dispatch(createTaskSetState({ entityId: response.entity_id }));
            updatePostLoader(false);
            const { document_details } = cloneDeep(
              store.getState().TaskContentReducer,
            );
            set(response, ['file_metadata', 'type'], type);
            console.log('document_details.file_metadatas', document_details, index);
            if (document_details && document_details.entity_id) {
              document_details.file_metadata.push(...response.file_metadata);
              dispatch(
                taskContentApiSuccess({
                  document_details,
                }),
              );
            } else {
              dispatch(
                taskContentApiSuccess({
                  document_details: response,

                }),
              );
            }
            console.log(response.file_metadata);
            if (uploadDocumentToDMS) {
              uploadDocumentToDMS(
                createTask ? response : response.file_metadata,
                file_ref_uuid,
                table_uuid,
                tableRow,
                doc_details,
                metadata,
                index,
                filess,
                currentIndex,
                totalLength,
                recursiveFunc,
                response.entity_id,
                currentFilesLength,
                invalidFileType,
                invalidFileSize,
                isMultiple,
                currentFileIndex + 1,
                fieldInfo,
                currentIndex,
                totalLength,
                setFileUploadStatus,
              );
            } else {
              setFileUploadStatus(false);
            }
            createTask ? resolve(response) : resolve(true);
          })
          .catch((error) => {
            setPointerEvent(false);
            updatePostLoader(false);
            setFileUploadStatus(false);
            console.log('taskcontentfailure', error);
            const errors = generateGetServerErrorMessage(error);
            dispatch(taskContentApiFailure(errors.common_server_error));
            reject();
          });
      });
    };
const throwError = (err) => {
  const getError = generateGetServerErrorMessage(err);
  const commonServerError = getError.common_server_error
    ? getError.common_server_error
    : EMPTY_STRING;
  updateErrorPopoverInRedux(ERROR_TEXT.UPDATE_FAILURE, commonServerError);
  return taskListApiFailure(commonServerError);
};

export const postRejectTask = (rejectData, history, onCloseIconClick) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  apiRejectTask(rejectData)
    .then((res) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (res.success) {
        showToastPopover(
          TASK_ACTION.SUCCESSFULLY_REJECTED_TASK.title,
          TASK_ACTION.SUCCESSFULLY_REJECTED_TASK.subTitle,
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
        dispatch(showAcceptReject(false));
        dispatch(taskListDataChange({ activeTaskId: null }));
        dispatch(refreshTaskListApiStarted());
        dispatch(refreshTaskResultApiStarted());
        dispatch(taskListReducerDataChange({ activeTaskId: null }));
        const taskState = { ...history?.state, hideClosePopper: true };
        routeNavigate(history, ROUTE_METHOD.REPLACE, EMPTY_STRING, EMPTY_STRING, taskState);
        if (isBasicUserMode(history)) {
          onCloseIconClick();
        } else {
          routeNavigate(history, ROUTE_METHOD.REPLACE, ADMIN_HOME);
        }
      }
    })
    .catch((err) => {
      const taskState = { ...history?.state, hideClosePopper: true };
      routeNavigate(history, ROUTE_METHOD.REPLACE, EMPTY_STRING, EMPTY_STRING, taskState);
      if (err && (err.code === 'ERR_CANCELED')) return;
      setPointerEvent(false);
      updatePostLoader(false);
      showToastPopover(
        translate('task_content.landing_page.task_action.popper.accepted_title'),
        translate('task_content.landing_page.task_action.popper.accepted_subtitle'),
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      onCloseIconClick();
    });
};

export const postUpdateTaskStatus = (acceptData, onCloseIconClick, statevariables, setDashboardNavigationLink) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  apiUpdateTaskStatus(acceptData)
    .then((res) => {
      setPointerEvent(false);
      updatePostLoader(false);
      if (res.success) {
        const { active_task_details } = store.getState().TaskContentReducer;
        if (has(active_task_details, 'task_log_info')) {
          dispatch(
            taskContentDataChange({
              active_task_details: {
                ...active_task_details,
                task_log_info: {
                  ...active_task_details.task_log_info,
                  show_accept_reject: false,
                  accepted_by: { _id: getUserProfileData().id },
                },
              },
            }),
          );
        }
        showToastPopover(
          TASK_ACTION.SUCCESSFULLY_ACCEPTED_TASK.title,
          TASK_ACTION.SUCCESSFULLY_ACCEPTED_TASK.subTitle,
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
        dispatch(showAcceptReject(false));
        const params = { task_log_id: active_task_details.task_log_info._id, is_open_task: 1 };
        const activeTaskInfo = jsUtils.get(active_task_details, [TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO, TASK_CONTENT_STRINGS.TASK_INFO.TASK_STATUS]);
        const isCompletedTask = activeTaskInfo === TASK_STATUS_TYPES.COMPLETED;
        if (!isCompletedTask) {
          params.is_table_default_value = 1;
        }
        dispatch(
          getTaskDetailsApiThunk(
            params,
            statevariables,
          ),
        ).then(() => setDashboardNavigationLink());
      }
    })
    .catch((err) => {
      if (err && (err.code === 'ERR_CANCELED')) return;
      setPointerEvent(false);
      updatePostLoader(false);
      onCloseIconClick();
    });
};

export const getTaskCountApiAction = () => (dispatch) => {
  const { searchText } = store.getState().TaskReducer;
  dispatch(taskCountApiStarted());
  const params = jsUtils.isEmpty(searchText) ? {} : { search: searchText };
  return new Promise((resolve) => {
    getTaskCount(params)
      .then((response) => {
        let searchCancel = false;
        const currentSearchText = store.getState().TaskReducer.searchText;
        if (currentSearchText !== searchText) {
          searchCancel = true;
        }
        if (!searchCancel) {
          console.log('responseresponse', response);
          dispatch(taskCountApiSuccess());
          dispatch(
            taskListDataChange({
              searchTaskCount: {
                active_task_count: response.active_task_count,
                completed_task_count: response.completed_task_count,
                completedTaskCount: response.completed_task_count,
                overdueTaskCount: response.active_task_overdue_count,
                assigned_to_others_task_count:
                  response.assigned_to_others_task_count, // c
              },
              // isTaskDataLoading: false,
            }),
          );
        }
        console.log('task count inside api end');
        resolve();
      })
      .catch((error) => {
        if (error && (error.code === 'ERR_CANCELED')) return;
        const errors = generateGetServerErrorMessage(error);
        dispatch(taskListApiFailure(errors.common_server_error));
        resolve();
      });
  });
  // api call to get task count
};

export const setSearchAccordionIndexAction =
  (searchAccordionIndex) => (dispatch) => {
    if (
      store.getState().TaskReducer.searchAccordionIndex !== searchAccordionIndex
    ) {
      dispatch(
        taskListDataChange({
          searchAccordionIndex,
          active_tasks_list: [],
        }),
      );
    }
  };

export const taskResponseSummaryApiStarted = () => {
  return {
    type: TASK_RESPONSE_SUMMARY_ACTION.STARTED,
  };
};

export const taskResponseSummaryApiSuccess = (payload) => {
  return {
    type: TASK_RESPONSE_SUMMARY_ACTION.SUCCESS,
    payload,
  };
};

export const taskResponseSummaryApiFailed = (payload) => {
  return {
    type: TASK_RESPONSE_SUMMARY_ACTION.FAILURE,
    payload,
  };
};

export const clearTaskResponseSummaryData = () => (dispatch) => {
  dispatch({
    type: TASK_RESPONSE_SUMMARY_ACTION.CLEAR,
  });
  return Promise.resolve();
};

export const getTaskResponseSummaryApiThunk = (params) => async (dispatch) =>
  new Promise((resolve) => {
    dispatch(taskResponseSummaryApiStarted());
    getTaskMetadataResponseSummary(params)
      .then((response) => {
        if (!isEmpty(response)) {
          dispatch(taskResponseSummaryApiSuccess(response));
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(taskResponseSummaryApiFailed(errors));
        }
        resolve(response);
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(taskResponseSummaryApiFailed(errors));
        resolve();
      });
  });

export const taskFormDetailsApiStarted = () => {
  return {
    type: TASK_FORM_DETAILS_ACTION.STARTED,
  };
};

export const taskFormDetailsApiSuccess = (payload) => {
  return {
    type: TASK_FORM_DETAILS_ACTION.SUCCESS,
    payload,
  };
};

export const taskFormDetailsApiFailed = (payload) => {
  return {
    type: TASK_FORM_DETAILS_ACTION.FAILURE,
    payload,
  };
};

export const clearTaskFormDetailsData = () => (dispatch) => {
  dispatch({
    type: TASK_FORM_DETAILS_ACTION.CLEAR,
  });
  return Promise.resolve();
};

export const getTaskFormDetailsApiThunk = (params) => async (dispatch) =>
  new Promise((resolve) => {
    dispatch(taskFormDetailsApiStarted());
    getFormDetailsByTaskMetadataId(params)
      .then((response) => {
        if (!isEmpty(response)) {
          const activeTask = {};
          activeTask.fields = {};
          activeTask.activeFormData = {};
          activeTask.formVisibility = response.form_metadata?.fields?.form_visibility || {};
          activeTask.formMetaData = {
            dependentFields: response.form_metadata?.fields?.dependent_fields || [],
          };
          activeTask.errorList = {};
          activeTask.documentDetails = {};
          activeTask.documentURLDetails = response.document_url_details;
          activeTask.sections = (response.sections || []).map((section) => {
            const clonedSection = cloneDeep(section);
            clonedSection.layout = constructTreeStructure(section.contents);
            section.field_metadata.forEach((f) => {
              const field = normalizer(f, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS);
              const fieldUUID = field[RESPONSE_FIELD_KEYS.FIELD_UUID];
              activeTask.fields[fieldUUID] = field;
              // if field has a default value, add that to activeFormData
              if (field[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]) {
                activeTask.activeFormData[fieldUUID] = field[RESPONSE_FIELD_KEYS.DEFAULT_VALUE];
              }
            });
            return clonedSection;
          });

          activeTask.activeFormData = constructActiveFormDataFromResponse(
            { ...activeTask.activeFormData, ...response.active_form_content },
            activeTask.fields,
            { documentDetails: response.document_url_details },
          );
          activeTask.showSectionName = response?.show_section_name || false;
          dispatch(taskFormDetailsApiSuccess({ ...response, activeTask: activeTask }));
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(taskFormDetailsApiFailed(errors));
        }
        resolve(response);
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(taskFormDetailsApiFailed(errors));
        resolve();
      });
  });

export const setReassignTaskActionThunk = (params, onCancelModalClick, history) => (dispatch) => {
  getReassigntasApiService(params)
    .then(async (response) => {
      console.log('response', response);
      const taskState = { ...history?.state, hideClosePopper: true };
      routeNavigate(history, ROUTE_METHOD.REPLACE, EMPTY_STRING, EMPTY_STRING, taskState);
      await onCancelModalClick();
      showToastPopover(
        translate('error_popover_status.reassigned_successfully'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SUCCESS,
        true,
      );
    })
    .catch((error) => {
      console.log('reassign task error', error, error.response);
      let errors = {};
      if (jsUtils.get(error, ['response', 'data', 'errors']) === 1100) {
        errors.common_server_error = jsUtils.get(error, [
          'response',
          'data',
          'errors',
        ]);
      } else errors = generateGetServerErrorMessage(error);
      console.log('repicate task error=>', errors);
      showToastPopover(
        translate('error_popover_status.task_not_reassigned'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      dispatch(
        taskContentApiFailure(errors.common_server_error, false),
      );
    });
};

const getTableFieldListFromSection = (sections = [], table_uuid) => {
  let table_field_list = {};
  sections.some((eachSection) => {
    table_field_list = (eachSection.field_list || []).find((eachFieldList) => (
      eachFieldList.field_list_type === FIELD_LIST_TYPE.TABLE &&
      eachFieldList.table_uuid === table_uuid
    ));
    if (isEmpty(table_field_list)) return false;
    return true;
  });
  return isEmpty(table_field_list) ? {} : table_field_list;
};

const getFormFieldUpdatesResponseHandler = (
  exisiting_post_data,
  field_uuid = null,
  response = {},
  form_metadata = {},
  form_data = {},
  documents = [],
  removed_doc_list = [],
  sections = [],
  updateFormData = () => { },
  updateVisibility = () => { },
  updateDocumentUrlDetails = () => { },
  dispatch = () => { },
) => {
  dispatch(removeFieldFromApiQueue(field_uuid));
  if (!isEmpty(response)) {
    const response_form_visibility = jsUtils.get(response, ['fields', 'form_visibility'], {});
    const form_visibility = jsUtils.get(form_metadata, ['fields', 'form_visibility'], {});
    let updatedRemovedDocList = removed_doc_list;
    // Existing Value.
    const visibleFields = cloneDeep(jsUtils.get(form_visibility, ['visible_fields']));
    const visibleDisableFields = cloneDeep(jsUtils.get(form_visibility, ['visible_disable_fields']));
    const visibleTables = jsUtils.get(form_visibility, ['visible_tables']);
    const postFieldDetails = get(exisiting_post_data, ['field_details'], {});
    const all_table_uuid = compact(Object.keys(visibleTables));
    const visible_button_visibility = cloneDeep(jsUtils.get(form_metadata, ['actions', 'button_visibility'], {}));

    // Newly Updated Value
    const updated_button_visibility = jsUtils.get(response, ['actions', 'button_visibility'], {});
    const updated_fields = jsUtils.get(response_form_visibility, ['visible_fields']);
    const updated_tables = jsUtils.get(response_form_visibility, ['visible_tables']);
    const disabled_fields = cloneDeep(jsUtils.get(response_form_visibility, ['visible_disable_fields']));
    const all_file_fields = jsUtils.get(response, ['fields', 'all_file_fields']);
    const system_calculated_fields = jsUtils.get(response, ['fields', 'system_calculated_fields']);
    const document_url_details = jsUtils.uniqBy(
      [...jsUtils.get(response, ['document_url_details'], []), ...documents],
      (document) => document.document_id,
    );
    const documentUrlDetailsFromResponse = jsUtils.get(response, ['document_url_details'], []);
    // update removed_doc_list
    if (!isEmpty(removed_doc_list) && !isEmpty(documentUrlDetailsFromResponse)) {
      const removed_doc_list_copy = [];
      removed_doc_list.forEach((deletedDocumentId) => {
        const newlyAddedDoc = documentUrlDetailsFromResponse.find(({ document_id }) => document_id === deletedDocumentId);
        if (isEmpty(newlyAddedDoc)) {
          removed_doc_list_copy.push(deletedDocumentId);
        }
      });
      updatedRemovedDocList = removed_doc_list_copy;
    }
    updateDocumentUrlDetails && updateDocumentUrlDetails(document_url_details, updatedRemovedDocList);
    const { default_field_values = {} } = response;
    const defaultValues = jsUtils.get(response, ['fields', 'default_field_values'], {});

    if (!isEmpty(defaultValues)) {
      const cloned_form_data = cloneDeep(form_data);
      Object.keys(defaultValues).forEach((fieldKey) => {
        if (
          jsUtils.has(visibleFields, fieldKey) ||
          jsUtils.has(visibleTables, fieldKey)
        ) {
          // Table
          if (all_table_uuid.includes(fieldKey)) {
            const table_field_values = defaultValues[fieldKey];
            const table_field_list = getTableFieldListFromSection(sections, fieldKey);
            if (!isEmpty(table_field_values)) {
              table_field_values.forEach((tableFieldValue, tableRowIdk) => {
                if (!isEmpty(tableFieldValue) && tableFieldValue) {
                  Object.keys(tableFieldValue).forEach((tableFieldKey) => {
                    const current_field = jsUtils.find((table_field_list?.fields || []), { field_uuid: tableFieldKey });
                    if (
                      current_field &&
                      current_field.field_type === FIELD_TYPE.DATA_LIST
                    ) {
                      const default_value = tableFieldValue[tableFieldKey] || null;
                      if (!isEmpty(default_value) && Array.isArray(default_value)) {
                        if (default_value.every((each_value) => typeof each_value === 'string')) {
                          return;
                        }
                      }
                    }
                    // Removed unwanted condition, Checked with the respective developer
                    if (has(postFieldDetails, [fieldKey], false)) {
                      if (
                        (current_field) &&
                        (
                          !has(
                            postFieldDetails,
                            [fieldKey, tableRowIdk, tableFieldKey],
                            false) ||
                          !get(
                            postFieldDetails,
                            [fieldKey, tableRowIdk, tableFieldKey],
                            null) ||
                          (system_calculated_fields || []).includes(tableFieldKey)
                        )
                      ) {
                        set(
                          cloned_form_data,
                          [fieldKey, tableRowIdk, tableFieldKey],
                          getDefaultValue(
                            tableFieldValue,
                            tableFieldKey,
                            all_file_fields,
                            document_url_details,
                            sections,
                          ),
                        );
                      }
                    } else {
                      // New table row won't present in post data, hence update data from API response
                      set(
                        cloned_form_data,
                        [fieldKey, tableRowIdk, tableFieldKey],
                        getDefaultValue(
                          tableFieldValue,
                          tableFieldKey,
                          all_file_fields,
                          document_url_details,
                          sections,
                        ),
                      );
                    }
                  });
                } else if (isPlainObject(tableFieldValue) && isEmpty(tableFieldValue)) {
                  set(
                    cloned_form_data,
                    [fieldKey, tableRowIdk],
                    tableFieldValue,
                  );
                }
              });
              const total_row_count = get(cloned_form_data, [fieldKey], []).length;
              const response_row_count = (table_field_values || []).length;
              if (response_row_count < total_row_count) {
                for (let row_index = response_row_count; row_index < total_row_count; row_index++) {
                  const all_row = get(cloned_form_data, [fieldKey], []);
                  all_row.splice(row_index, 1);
                  set(cloned_form_data, [fieldKey], all_row);
                }
              }
            } else if (Array.isArray(table_field_values) && isEmpty(table_field_values)) {
              set(
                cloned_form_data,
                [fieldKey],
                table_field_values,
              );
            }
          } else {
            const current_field = getFieldDataFromSection(fieldKey, sections);
            if (
              current_field &&
              current_field.field_type === FIELD_TYPE.DATA_LIST
            ) {
              const default_value = defaultValues[fieldKey] || null;
              if (!isEmpty(default_value) && Array.isArray(default_value)) {
                if (default_value.every((each_value) => typeof each_value === 'string')) {
                  return;
                }
              }
            }
            set(
              cloned_form_data,
              [fieldKey],
              getDefaultValue(
                defaultValues,
                fieldKey,
                all_file_fields,
                document_url_details,
                sections,
              ),
            );
          }
        }
        if (all_table_uuid.includes(fieldKey)) {
          if (has(cloned_form_data, ['tableSchema', fieldKey])) {
            defaultValues[fieldKey].forEach((tableRow, index) => {
              if (
                index >= defaultValues[fieldKey].length - 1 &&
                isEmpty(tableRow)
              ) {
                // !!ETF 3026,3005
                cloned_form_data[fieldKey][index] = {
                  ...cloned_form_data[fieldKey][index],
                  ...tableRow,
                };
              }
              if (!has(cloned_form_data, [fieldKey, index, 'temp_row_uuid'], false)) {
                cloned_form_data[fieldKey][index] = {
                  ...cloned_form_data[fieldKey][index],
                  temp_row_uuid: uuidv4(),
                };
              }
            });
          } else {
            cloned_form_data[fieldKey] = [
              ...(defaultValues[fieldKey]),
            ];
            if (
              !isEmpty(defaultValues[fieldKey]) &&
              !has(cloned_form_data, [fieldKey, 'temp_row_uuid'], false)
            ) {
              cloned_form_data[fieldKey].temp_row_uuid = uuidv4();
            }
            cloned_form_data.tableSchema = {
              ...cloned_form_data.tableSchema,
              ...{ [fieldKey]: defaultValues[fieldKey] },
            };
          }
        }
      });
      updateFormData(cloned_form_data);
    }

    if (default_field_values) {
      Object.keys(default_field_values).forEach((field) => {
        if (jsUtils.has(visibleFields, field)) visibleFields[field] = updated_fields[field];
      });
    }
    const updated_visible_fields = { ...(updated_fields || {}) };
    if (isEmpty(updated_visible_fields)) {
      Object.keys(defaultValues).forEach((each_key) => {
        updated_visible_fields[each_key] = true;
      });
    }
    Object.keys(updated_visible_fields).forEach((field) => {
      if (has(visibleFields, field) && has(updated_fields || {}, field)) {
        visibleFields[field] = updated_fields[field];
      }
    });

    const updated_disabled_fields = { ...(disabled_fields || {}) };
    Object.keys(updated_disabled_fields).forEach((table) => {
      if (jsUtils.isArray(updated_disabled_fields[table])) {
        updated_disabled_fields[table]?.forEach((fieldObj, index) => {
          Object.keys(fieldObj).forEach((field) => {
            jsUtils.set(visibleDisableFields, [table, index, field], jsUtils.get(updated_disabled_fields, [table, index, field]));
            if (!visibleFields[field]) {
              visibleFields[field] = true;
            }
          });
        });
      }
    });

    Object.keys(updated_tables).forEach((table) => {
      if (jsUtils.has(visibleTables, table)) {
        visibleTables[table] = updated_tables[table];
      }
    });

    Object.keys(updated_button_visibility).forEach((each_button_uuid) => {
      if (has(visible_button_visibility, [each_button_uuid], false)) {
        visible_button_visibility[each_button_uuid] = updated_button_visibility[each_button_uuid];
      }
    });

    updateVisibility({ visibleFields, visibleTables, visibleButtons: visible_button_visibility, visibleDisableFields });
  } else {
    const err = {
      response: {
        status: 500,
      },
    };
    const errors = generateGetServerErrorMessage(err);
    dispatch(taskFormDetailsApiFailed(errors));
  }
};

export const getFieldVisibilityListForDataListApiThunk = (data) => (dispatch) => {
  const fieldUuid = data.updated_field || data.updated_table_field;
  const { fieldUuidList } = store.getState().FieldVisibilityReducer;
  const index = fieldUuidList.findIndex((field_uuid) => field_uuid === fieldUuid);
  if (index > -1) {
    cancelTokenOfVisibilityApi && cancelTokenOfVisibilityApi();
  } else {
    dispatch(addFieldToApiQueue(fieldUuid));
  }
  getFieldVisibilityListApi(data)
    .then((response) => {
      const { particularDataListEntryDetails } = store.getState().DataListReducer;
      const form_metadata = cloneDeep(get(particularDataListEntryDetails, ['form_metadata']));
      const sections = get(particularDataListEntryDetails, ['form_metadata', 'sections'], []);
      const eachDocs = get(particularDataListEntryDetails, ['document_url_details'], []);
      const { addDataListFormData: form_data } = cloneDeep(particularDataListEntryDetails);
      getFormFieldUpdatesResponseHandler(
        data,
        fieldUuid,
        response,
        form_metadata,
        form_data,
        eachDocs,
        [],
        sections,
        (upadated_form_data) => dispatch(
          addDataListIntChangeAction({ addDataListFormData: upadated_form_data }),
        ),
        ({ visibleFields, visibleTables, visibleDisableFields }) => dispatch(
          setUpdatedFieldVisibilityListInDataList({ visibleFields, visibleTables, visibleDisableFields }),
        ),
        (document_url_details) => dispatch(addDataListIntChangeAction({ document_url_details })),
        dispatch,
      );
    })
    .catch((error) => {
      if (error && (error.code === 'ERR_CANCELED')) return;
      dispatch(removeFieldFromApiQueue(fieldUuid));
      const errors = generateGetServerErrorMessage(error);
      dispatch(taskFormDetailsApiFailed(errors));
      // resolve();
    });
};

export const getFieldVisibilityListApiThunk = (data, documents = [], removed_doc_list = []) => (dispatch) => {
  const fieldUuid = data.updated_field || data.updated_table_field;
  const { fieldUuidList } = store.getState().FieldVisibilityReducer;
  const index = fieldUuidList.findIndex((field_uuid) => field_uuid === fieldUuid);
  if (index > -1) {
    cancelTokenOfVisibilityApi && cancelTokenOfVisibilityApi();
  } else {
    dispatch(addFieldToApiQueue(fieldUuid));
  }
  const { active_task_details: { task_log_info } } = store.getState().TaskContentReducer;
  if (task_log_info.is_test_bed_task) data.task_log_id = task_log_info._id;
  getFieldVisibilityListApi(data)
    .then((response) => {
      const { active_task_details, formUploadData } = store.getState().TaskContentReducer;
      const form_metadata = cloneDeep(jsUtils.get(active_task_details, ['form_metadata']));
      const form_data = cloneDeep(formUploadData);
      const sections = cloneDeep(jsUtils.get(active_task_details, [
        'form_metadata',
        'sections',
      ]));

      getFormFieldUpdatesResponseHandler(
        data,
        fieldUuid,
        response,
        form_metadata,
        form_data,
        documents,
        removed_doc_list,
        sections,
        (upadted_form_data) => dispatch(taskContentDataChange({ formUploadData: upadted_form_data })),
        ({ visibleFields, visibleTables, visibleButtons, visibleDisableFields }) => dispatch(
          setUpdatedFieldVisibilityList({ visibleFields, visibleTables, visibleButtons, visibleDisableFields }),
        ),
        (document_url_details, updatedRemovedDocList) => dispatch(taskContentDataChange({ document_url_details: document_url_details, removed_doc_list: updatedRemovedDocList })),
        dispatch,
      );
    }).catch((error) => {
      if (error && (error.code === 'ERR_CANCELED')) return;
      dispatch(removeFieldFromApiQueue(fieldUuid));
      const errors = generateGetServerErrorMessage(error);
      dispatch(taskFormDetailsApiFailed(errors));
    });
};

// task content cancel task actions

export const setCancelTaskModalVisibilityAction = (payload) => {
  return {
    type: TASK_CONTENT_ACTION.SET_CANCEL_TASK_MODAL_VISIBILITY,
    payload,
  };
};

export const setCancelTaskDialogVisibilityAction = (payload) => {
  return {
    type: TASK_CONTENT_ACTION.SET_CANCEL_TASK_DIALOG_VISIBILITY,
    payload,
  };
};

export const setCancelTaskMessageAction = (payload) => {
  return {
    type: TASK_CONTENT_ACTION.SET_CANCEL_TASK_MESSAGE,
    payload,
  };
};

export const setDataInCancelFormAction = (payload) => {
  return {
    type: TASK_CONTENT_ACTION.SET_DATA_CANCEL_FORM,
    payload,
  };
};

export const clearCancelTaskData = () => {
  return {
    type: TASK_CONTENT_ACTION.CLEAR_TASK_CANCEL_DATA,
  };
};

// add or remove assignee actions
export const setAddOrRemoveAssigneeDataAction = (key, value) => (dispatch) => {
  dispatch({
    type: TASK_CONTENT_ACTION.TASK_CONTENT_ADD_OR_REMOVE_ASSIGNEE_SET_DATA,
    payload: {
      key,
      value,
    },
  });
  return Promise.resolve();
};
export const clearAddOrRemoveAssigneeDataAction = () => {
  return {
    type: TASK_CONTENT_ACTION.TASK_CONTENT_ADD_OR_REMOVE_ASSIGNEE_CLEAR_DATA,
  };
};

export const cancelTaskApiAction =
  (params, backToLandingPage, history) => (dispatch) => {
    updatePostLoader(true);
    setPointerEvent(true);
    cancelTaskApi(params)
      .then(() => {
        dispatch(clearCancelTaskData());
        const taskState = { ...history?.state, hideClosePopper: true };
        routeNavigate(history, ROUTE_METHOD.REPLACE, EMPTY_STRING, EMPTY_STRING, taskState);
        backToLandingPage();
        updatePostLoader(false);
        setPointerEvent(false);
        showToastPopover(
          translate('error_popover_status.task_canceled'),
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
      })
      .catch((error) => {
        const { server_error } = store.getState().TaskContentReducer;
        const errorData = {
          error,
          server_error,
        };
        const apiFailureAction = {
          dispatch,
          action: setDataInCancelFormAction,
        };
        generateApiErrorsAndHandleCatchBlock(
          errorData,
          apiFailureAction,
          {
            title: translate('error_popover_status.error'),
            subTitle: translate('error_popover_status.cancel_task_error'),
            isVisible: true,
            status: FORM_POPOVER_STATUS.SERVER_ERROR,
          },
          true,
        );
      });
  };

// add or remove assignees api actions
export const getTaskAssigneesApiAction = (params) => (dispatch) => {
  const { addOrRemoveAssignee } = store.getState().TaskContentReducer;
  const { isInitialLoading, isTableLoading } =
    store.getState().TaskContentReducer.addOrRemoveAssignee;
  if (!isTableLoading) dispatch(setAddOrRemoveAssigneeDataAction('isTableLoading', true));
  getTaskMetadataActiveParticipants(params)
    .then((response) => {
      const updatedAddOrRemoveAssigneeData = {
        ...addOrRemoveAssignee,
        isTableLoading: false,
        assigneeList: response.paginationData,
      };
      if (nullCheck(response, 'paginationDetails.length', true)) {
        updatedAddOrRemoveAssigneeData.activePage =
          response.paginationDetails[0].page;
        updatedAddOrRemoveAssigneeData.itemsCountPerPage =
          response.paginationDetails[0].size;
        updatedAddOrRemoveAssigneeData.totalItemsCount =
          response.paginationDetails[0].total_count;
      }
      if (isInitialLoading) updatedAddOrRemoveAssigneeData.isInitialLoading = false;
      dispatch(
        taskContentDataChange({
          addOrRemoveAssignee: updatedAddOrRemoveAssigneeData,
        }),
      );
    })
    .catch((err) => {
      if (isInitialLoading) dispatch(setAddOrRemoveAssigneeDataAction('isInitialLoading', false));
      dispatch(setAddOrRemoveAssigneeDataAction('isTableLoading', false));
      if (!axios.isCancel(err)) {
        showToastPopover(
          translate('error_popover_status.somthing_went_wrong'),
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SERVER_ERROR,
          true,
        );
      }
    });
};

export const assignTaskToParticipantsApiAction =
  (params, isRemoveAssigneeAction, callbackAction) => () => {
    updatePostLoader(true);
    setPointerEvent(true);
    assignTaskToParticipantsApi(params)
      .then(() => {
        callbackAction();
        updatePostLoader(false);
        setPointerEvent(false);
        showToastPopover(
          isRemoveAssigneeAction
            ? translate('error_popover_status.assignee_removed')
            : translate('error_popover_status.assignee_added'),
          EMPTY_STRING,
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
      })
      .catch((error) => {
        updatePostLoader(false);
        setPointerEvent(false);

        if (
          get(error, 'response.data.errors.0.type', '') === 'invalid' &&
          get(error, 'response.data.errors.0.field', '').includes(
            'remove_assignees',
          )
        ) {
          showToastPopover(
            translate('error_popover_status.remove_assignee_error'),
            translate('error_popover_status.cannot_remove_assignee'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        } else {
          const { server_error } = store.getState().TaskContentReducer;
          const errorData = {
            error,
            server_error,
          };
          generateApiErrorsAndHandleCatchBlock(
            errorData,
            undefined,
            {
              title: translate('error_popover_status.error'),
              subTitle: isRemoveAssigneeAction
                ? translate('error_popover_status.remove_assignee_error')
                : translate('error_popover_status.add_assignee_error'),
              isVisible: true,
              status: FORM_POPOVER_STATUS.SERVER_ERROR,
            },
          );
        }
      });
  };

export const getAllInstancesByTaskMetadataUuidApiAction =
  (params) => (dispatch) => {
    getAllInstancesByTaskMetadataUuid(params)
      .then((response) => {
        const respondantsSummaryData = {
          allInstances: response.paginationData,
        };
        if (nullCheck(response, 'paginationDetails.length', true)) {
          respondantsSummaryData.activePage =
            response.paginationDetails[0].page;
          respondantsSummaryData.itemsCountPerPage =
            response.paginationDetails[0].size;
          respondantsSummaryData.totalItemsCount =
            response.paginationDetails[0].total_count;
        }
        dispatch(
          taskContentRespondantsSummaryDataChange(respondantsSummaryData),
        );
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
      });
  };

export const nudgeTaskApiAction = (params) => () => {
  updatePostLoader(true);
  setPointerEvent(true);
  nudgeTaskApi(params)
    .then(() => {
      updatePostLoader(false);
      setPointerEvent(false);
      showToastPopover(
        translate('error_popover_status.nudged_successfully'),
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SUCCESS,
        true,
      );
    })
    .catch((error) => {
      updatePostLoader(false);
      setPointerEvent(false);
      const { server_error } = store.getState().TaskContentReducer;
      const errorData = {
        error,
        server_error,
      };
      generateApiErrorsAndHandleCatchBlock(
        errorData,
        undefined,
        {
          title: translate('error_popover_status.error'),
          subTitle: translate('error_popover_status.nudging_assignee'),
          isVisible: true,
          status: FORM_POPOVER_STATUS.SERVER_ERROR,
        },
      );
    });
};
export const postUpdateApiThunk = (data, isCommentPosted, task_log_info, closePostModal) => (dispatch) => {
  updatePostLoader(true);
  setPointerEvent(true);
  dispatch(taskContentDataChange({
    initialLoading: true,
    isAdhocComment: false,
  }));
  postUpdateApi(data).then(async () => {
    updatePostLoader(false);
    setPointerEvent(false);
    showToastPopover(
      translate('error_popover_status.update_posted'),
      EMPTY_STRING,
      FORM_POPOVER_STATUS.SUCCESS,
      true,
    );
    closePostModal?.(false);
    const actionHistoryParams = {
      page: 1,
      size: 1,
      task_log_id: task_log_info?._id,
      instance_id: task_log_info?.instance_id,
    };
    const actionHistoryDataLatest = await apiGetActionHistoryByInstanceId(actionHistoryParams);
    dispatch(taskContentDataChange({
      isCommentPosted: !isCommentPosted,
      initialLoading: false,
      isAdhocComment: false,
      adhoc_comments: EMPTY_STRING,
      latest_action_history: actionHistoryDataLatest?.pagination_data?.[0] || {},
    }));
  })
    .catch((error) => {
      updatePostLoader(false);
      setPointerEvent(false);
      dispatch(taskContentDataChange({
        initialLoading: false,
        isAdhocComment: true,
      }));
      const { server_error } = store.getState().TaskContentReducer;
      const errorData = {
        error,
        server_error,
      };
      generateApiErrorsAndHandleCatchBlock(
        errorData,
        undefined,
        {
          title: translate('error_popover_status.update_not_posted'),
          isVisible: true,
          status: FORM_POPOVER_STATUS.SERVER_ERROR,
        },
      );
    });
};

export const fieldAutoCompleteStarted = () => {
  return {
    type: TASK_LIST_ACTION.FIELD_AUTO_COMPLETE_STARTED,
  };
};

export const fieldAutoCompleteSucess = (data) => {
  return {
    type: TASK_LIST_ACTION.FIELD_AUTO_COMPLETE_SUCCESS,
    payload: data,
  };
};

export const fieldAutoCompleteFailed = (error) => {
  return {
    type: TASK_LIST_ACTION.FIELD_AUTO_COMPLETE_FAILED,
    payload: error,
  };
};

export const getExportTaskDetailsThunk = (task_metadata_uuid) => (dispatch) => {
  apiGetExportTaskDetails(task_metadata_uuid)
    .then((response) => {
      const res = jsUtils.has(response, 'data') && response.data;
      if (
        res &&
        jsUtils.has(res, 'success') &&
        jsUtils.has(res, 'result') &&
        jsUtils.has(res.result, 'data')
      ) {
        if (res.result.data) {
          const { ACTIVITY: { TYPE } } = DOWNLOAD_WINDOW_STRINGS;
          dispatch(downloadWindowStateChange(TYPE.TASK, { task_metadata_uuid }));
        }
      }
    })
    .catch((err) => {
      if (err && (err.code === 'ERR_CANCELED')) return;
      dispatch(throwError(err));
    });
};

export const memberTeamSearchValueChange = (searchValue) => {
  return {
    type: TASK_CONTENT_ACTION.MEMBER_TEAM_SEARCH_VALUE,
    payload: searchValue,
  };
};

export const setSelectedAssigneeData = (assigneeData) => {
  return {
    type: TASK_CONTENT_ACTION.SELECTED_ASSIGNEE_DATA,
    payload: assigneeData,
  };
};
