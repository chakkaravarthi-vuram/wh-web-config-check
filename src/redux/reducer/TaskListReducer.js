import { createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const initialSingleState = {
    componentId: null,
    activeTaskList: [],
    paginationDetail: {},
    isDataLoading: false,
    hasMore: false,
    filter: {
        task_type: null,
        due_date: null, // Assigned On
        due_type: null,
    },
    totalCount: 0,
    tabIndex: 1,
    dataCountPerPage: 15,
    searchText: EMPTY_STRING,
    taskListType: null,
    assignedToOtherShowBy: null,
};

export const taskListReducerInitialState = {
  taskListReducers: [],
  activeTaskId: null,
};

const taskListSlice = createSlice({
  name: 'TaskListReducer',
  initialState: taskListReducerInitialState,
  reducers: {
     deleteTaskListByComponentId: (state, action) => {
          const componentId = action.payload;
          const taskListReducers = cloneDeep(state?.taskListReducers);
          const taskListIndex = taskListReducers.findIndex((eachTaskList) => eachTaskList.componentId === componentId);
          taskListReducers.splice(taskListIndex, 1);
          state.taskListReducers = taskListReducers;
          return state;
     },
     updateEachTaskListDataByComponentId: (state, action) => {
       const { componentId, data = {} } = action.payload;
       const taskListReducers = cloneDeep(state?.taskListReducers);
       const taskListReducerIndex = taskListReducers.findIndex((eachTaskListReducer) => eachTaskListReducer.componentId === componentId);

       if (taskListReducerIndex === -1) {
        taskListReducers.push({ ...initialSingleState, ...data, componentId: componentId });
       } else {
        taskListReducers[taskListReducerIndex] = {
            ...(taskListReducers[taskListReducerIndex] || {}),
            ...data,
          };
       }
       state.taskListReducers = taskListReducers;
       return state;
     },
     taskListReducerDataChange: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
     },
     clearAllTaskList: () => taskListReducerInitialState,
   },
 });

 export const { updateEachTaskListDataByComponentId, deleteTaskListByComponentId, taskListReducerDataChange, clearAllTaskList } = taskListSlice.actions;

 export default taskListSlice.reducer;
