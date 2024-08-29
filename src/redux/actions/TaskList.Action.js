import { cloneDeep, isEmpty } from 'lodash';
import { store } from '../../Store';
import { getActiveTaskList, getBothAssignedTaskList, getCompletedTaskList, getDraftTaskList } from '../../axios/apiService/task.apiService';
import { updateEachTaskListDataByComponentId } from '../reducer/TaskListReducer';
import { ASSIGNED_TO_OTHERS_TYPE, TASK_LIST_TYPE, TASK_TABLE_TYPE } from '../../containers/application/app_components/task_listing/TaskList.constants';
import jsUtility from '../../utils/jsUtility';

const setDataLoading = (componentId, value, dispatch) => {
    dispatch(updateEachTaskListDataByComponentId({ componentId, data: { isDataLoading: true, componentId: componentId } }));
};

const taskListReponseCommonFunctionality = (response_, componentId, dispatch, param, taskListType, tableType = TASK_TABLE_TYPE.PAGINATED) => {
    let response = response_;
    if (taskListType === TASK_LIST_TYPE.ASSIGNED_TO_OTHERS) {
        if (param.type === ASSIGNED_TO_OTHERS_TYPE.OPEN) {
            response = response_?.open_task || {};
        } else if (param.type === ASSIGNED_TO_OTHERS_TYPE.COMPLETED) {
            response = response_?.completed_task || {};
        }
    }
    const { pagination_data, pagination_details } = response;
        const { page, size, total_count } = pagination_details[0];
        let activeTaskList = [];

        if (tableType === TASK_TABLE_TYPE.INFINITE_SCROLL && page > 1) {
          const taskListReducer = jsUtility
                           .get(store.getState(), ['TaskListReducer', 'taskListReducers'] || [])
                           .find((eachTaskList) => eachTaskList.componentId === componentId);
          if (!isEmpty(taskListReducer)) {
            activeTaskList = [
                ...(taskListReducer?.activeTaskList || []),
                ...(pagination_data || []),
            ];
          }
        } else {
            activeTaskList = pagination_data;
        }

        const construtReducerObject = {
            activeTaskList: activeTaskList,
            paginationDetail: pagination_details[0],
            isDataLoading: false,
            hasMore: (page * size < total_count),
            totalCount: total_count,
        };
        dispatch(updateEachTaskListDataByComponentId(
            { componentId, data: construtReducerObject }));
};

const getOpenTaskListThunk = (componentId, params, cancelToken, tableType) => (dispatch) => {
    if (params.page === 1) setDataLoading(componentId, true, dispatch);
    getActiveTaskList(params, cancelToken)
        .then((response) => taskListReponseCommonFunctionality(response, componentId, dispatch, {}, TASK_LIST_TYPE.OPEN, tableType))
        .catch(() => {});
};

const getDraftTaskListThunk = (componentId, params, cancelToken, tableType) => (dispatch) => {
    if (params?.page === 1) setDataLoading(componentId, true, dispatch);
    getDraftTaskList(params, cancelToken)
        .then((response) => taskListReponseCommonFunctionality(response, componentId, dispatch, {}, TASK_LIST_TYPE.DRAFT_TASKS, tableType))
        .catch(() => {});
};

const getAssignedToOthersTaskListThunk = (componentId, params, cancelToken, tableType) => (dispatch) => {
    if (params.page === 1) setDataLoading(componentId, true, dispatch);
    getBothAssignedTaskList(params, cancelToken)
        .then((response) => taskListReponseCommonFunctionality(response, componentId, dispatch, params, TASK_LIST_TYPE.ASSIGNED_TO_OTHERS, tableType))
        .catch(() => {});
};

const getCompletedTaskListThunk = (componentId, params, cancelToken, tableType) => (dispatch) => {
    if (params.page === 1) setDataLoading(componentId, true, dispatch);
    getCompletedTaskList(params, cancelToken)
        .then((response) => taskListReponseCommonFunctionality(response, componentId, dispatch, {}, TASK_LIST_TYPE.COMPLETED_TASKS, tableType))
        .catch(() => {});
};

export const getTaskListThunk =
  (task_list_type, componentId, params, cancelToken, tableType) => (dispatch) => {
    switch (task_list_type) {
      case TASK_LIST_TYPE.OPEN:
        dispatch(getOpenTaskListThunk(componentId, params, cancelToken, tableType));
        break;
      case TASK_LIST_TYPE.ASSIGNED_TO_OTHERS: {
        const clonedParam = cloneDeep(params);
        if (!clonedParam?.type) clonedParam.type = ASSIGNED_TO_OTHERS_TYPE.OPEN;
        dispatch(
          getAssignedToOthersTaskListThunk(
            componentId,
            clonedParam,
            cancelToken,
            tableType,
          ),
        );
        break;
      }
      case TASK_LIST_TYPE.DRAFT_TASKS:
        dispatch(getDraftTaskListThunk(componentId, params, cancelToken, tableType));
        break;
      case TASK_LIST_TYPE.COMPLETED_TASKS:
        dispatch(getCompletedTaskListThunk(componentId, params, cancelToken, tableType));
        break;
      case TASK_LIST_TYPE.SNOOZE_TASKS:
        dispatch(
          getOpenTaskListThunk(
            componentId,
            { ...params, is_snoozed: 1 },
            cancelToken,
            tableType,
          ),
        );
        break;
      default:
        break;
    }
  };
