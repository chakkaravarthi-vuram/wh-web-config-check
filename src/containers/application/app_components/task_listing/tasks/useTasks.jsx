import { cloneDeep, get, isEmpty, unset } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom';
import { TABLE_RELATED_CLASSNAME, TableSortOrder } from '@workhall-pvt-lmt/wh-ui-library';
import queryString from 'query-string';
import { getRouteLink } from 'utils/UtilityFunctions';
import { getTaskListThunk } from '../../../../../redux/actions/TaskList.Action';
import { deleteTaskListByComponentId, taskListReducerDataChange, updateEachTaskListDataByComponentId } from '../../../../../redux/reducer/TaskListReducer';
import { GET_TASK_LIST_CONSTANTS, HOME_COMPONENT, TABLE_ROW_COUNT, TASK_LIST_TYPE, TASK_TABLE_TYPE } from '../TaskList.constants';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { DEFAULT_APP_ROUTE, TASKS } from '../../../../../urls/RouteConstants';
import { CREATE, MODULE_TYPES, REDIRECTED_FROM, ROUTE_METHOD, SORT_BY } from '../../../../../utils/Constants';
import { getActiveTaskListReducer, getColumSortByKey, getSortKeyForActiveColumn, getFilterDataBasedOnTaskListType, getRowsPerTaskComponent } from '../TaskListing.utils';
import { routeNavigate } from '../../../../../utils/UtilityFunctions';

export const getPaginationCount = (taskListRef = null) => {
   if (taskListRef?.current) {
      const table = get(taskListRef?.current?.getElementsByClassName(TABLE_RELATED_CLASSNAME.TABLE), [0], null);
      if (table) {
        const taskListContainerHeight = get(taskListRef?.current, ['clientHeight'], 0) || 0;
        const tableHeight = get(table, ['parentElement', 'clientHeight'], 0) || 0;
        const tbodyHeight = get(table.getElementsByTagName('tbody'), [0, 'clientHeight'], null) || 0;
        const staticContentHeight = tableHeight - tbodyHeight;
        const eachTbodyRowHeight = 49;

        const rowCount = (taskListContainerHeight - (staticContentHeight + 8)) / eachTbodyRowHeight;
        return Math.floor(rowCount);
      }
   }
   return TABLE_ROW_COUNT.PAGINATED;
};

const useTasks = (
    componentId,
    taskListType,
    defaultFilters,
    cancelToken,
    tableType = TASK_TABLE_TYPE.PAGINATED,
    taskListRef = null,
    componentInfo = {},
    coordinates = {},
) => {
  const { t } = useTranslation();
  const TASK_LIST_CONSTANT = GET_TASK_LIST_CONSTANTS(t);
  const { FILTER: { TASK_TYPE, ASSIGNED_ON, DUE_ON, SHOW_BY }, TAB } = TASK_LIST_CONSTANT;

  // Redux
  const taskListReducer = useSelector((state) => getActiveTaskListReducer(state, componentId));

  const dispatch = useDispatch();

  // Route Logic
  const location = useLocation();
  const history = useHistory();
  useLayoutEffect(() => {
    const allRouteLabels = (location.pathname || EMPTY_STRING).split('/');
    const moduleIndex = allRouteLabels.findIndex((label) => `/${label}` === TASKS);
    const data = { tabIndex: TAB.OPTION[0].value };
    if (moduleIndex !== -1) {
      const currentRoute = allRouteLabels[moduleIndex + 1];
      const taskId = get(allRouteLabels, [moduleIndex + 2], null);
      data.tabIndex = TAB.OPTION.find((eachRoute) => eachRoute.route === currentRoute)?.value;
      if (taskId) data.activeTaskId = taskId;
    }
    dispatch(updateEachTaskListDataByComponentId({ componentId, data: data }));
  }, []);

  // Local State for filter handling.
  const size = (tableType === TASK_TABLE_TYPE.INFINITE_SCROLL) ? TABLE_ROW_COUNT.INFINITE_SCROLL : TABLE_ROW_COUNT.PAGINATED;
  const [isFilterPopOverVisible, setFilterPopOverVisibility] = useState(false);
  const [filter, setFilter] = useState({
    size: size,
    sort_by: -1,
    ...defaultFilters,
  });
  const [filterPrevState, setFilterPrevState] = useState({
    size: size,
    sort_by: -1,
    ...defaultFilters,
  });

  const [isSearchFocus, setSearchFocus] = useState(false);
  const [selectedFilterCount, setSelectedFilterCount] = useState(0);
  const [activeSortField, setActiveSortField] = useState(null);

  const updateFilterAndPreviousFilterState = (state) => {
    setFilter(state);
    setFilterPrevState(state);
   };

  const getTaskListApiParams = (page, filter) => {
    const componentIdObj = (componentId && componentId !== HOME_COMPONENT) ? { component_id: componentId } : {};
    const params = {
      taskListType,
      componentId,
      cancelToken,
      tableType,
      pagination: {
        ...filter,
        page: page,
        ...(componentIdObj),
      },
    };
    return params;
  };
  // Load data based on page and filter available on filter state.
  const loadTaskList = (page, filter) => {
    const {
      taskListType,
      componentId,
      cancelToken,
      tableType,
      pagination,
    } = getTaskListApiParams(page, filter);
    dispatch(getTaskListThunk(taskListType, componentId, pagination, cancelToken, tableType));
  };

  useEffect(() => () => {
    dispatch(deleteTaskListByComponentId(componentId));
  }, []);

  useEffect(() => {
      if (taskListRef?.current) {
        taskListRef?.current?.scrollTo(0, 0);
      }

      const constructFilter = { ...(defaultFilters || {}), size: filter?.size };
      const paginationRow = getRowsPerTaskComponent(coordinates?.h);
      if (tableType === TASK_TABLE_TYPE.DYNAMIC_PAGINATION) {
        if (paginationRow && paginationRow >= 0) {
          constructFilter.size = paginationRow;
        }
      }
      if (taskListType === TASK_LIST_TYPE.ASSIGNED_TO_OTHERS) {
        if (isEmpty(get(constructFilter, ['type'], null))) constructFilter.type = SHOW_BY.OPTIONS[0].value;
      } else {
        delete constructFilter?.type;
      }
      const sortKey = getSortKeyForActiveColumn(
        taskListType,
        constructFilter?.type,
        constructFilter?.sort_field,
      );

      setActiveSortField(() => {
        constructFilter.sort_field = getColumSortByKey(sortKey);
        return sortKey;
      });
      if (paginationRow) loadTaskList(1, cloneDeep(constructFilter));
      updateFilterAndPreviousFilterState(cloneDeep(constructFilter));
      setSelectedFilterCount(getFilterDataBasedOnTaskListType(cloneDeep(constructFilter), taskListType).length);
  }, [taskListType, JSON.stringify(defaultFilters), JSON.stringify(componentInfo), coordinates?.h]);

  // Infinite Scroll Task List Loader.
  const onLoadMoreTaskList = () => {
    const page = get(taskListReducer, ['paginationDetail', 'page'], 1) + 1;
    loadTaskList(page, filter);
  };

  // Paginated Loader.
  const onPageChange = (page) => loadTaskList(page, filter);

  // Filter Related Change Handler.
 const onFilterChangeHandler = (value, label, _, id) => {
    switch (id) {
       case TASK_TYPE.ID:
       case ASSIGNED_ON.ID:
           setFilter((prev_filter_state) => {
               return { ...prev_filter_state, [id]: value };
           });
           break;
       case DUE_ON.ID:
           if ([
               DUE_ON.OPTIONS[1].value,
               DUE_ON.OPTIONS[2].value,
               DUE_ON.OPTIONS[3].value,
               DUE_ON.OPTIONS[4].value,
           ].includes(value)) {
               let due_date = null;
               let due_end_date = null;
               switch (value) {
                    case DUE_ON.OPTIONS[1].value:
                        due_date = 0;
                        break;
                   case DUE_ON.OPTIONS[2].value:
                        due_date = 3;
                        break;
                   case DUE_ON.OPTIONS[3].value:
                        due_date = 3;
                        due_end_date = 7;
                        break;
                   case DUE_ON.OPTIONS[4].value:
                        due_date = 7;
                        break;
                   default: break;
               }
               setFilter((prev_filter_state) => {
                   const clonePrevState = cloneDeep(prev_filter_state);
                   delete clonePrevState?.due_date;
                   delete clonePrevState?.due_end_date;
                   if (due_date > -1) clonePrevState.due_date = due_date;
                   if (due_end_date) clonePrevState.due_end_date = due_end_date;
                   return { ...clonePrevState, [id]: value };
               });
           } else {
               setFilter((prev_filter_state) => {
                   const clonePrevState = cloneDeep(prev_filter_state);
                   delete clonePrevState?.due_date;
                   delete clonePrevState?.due_end_date;
                   return { ...clonePrevState, [id]: value };
               });
           }
       break;
       default: break;
    }
 };

 const onFilterSaveHandler = () => {
  loadTaskList(1, filter);
  setFilterPrevState(cloneDeep(filter));
  setSelectedFilterCount(getFilterDataBasedOnTaskListType(filter, taskListType).length);
  setFilterPopOverVisibility(false);
 };

 const onFilterCancelHandler = () => {
   setFilter(cloneDeep(filterPrevState));
   setFilterPopOverVisibility(false);
 };

 const onFilterClearByFilterId = (filter_id = null) => {
   if (filter_id) {
      const clonedFilter = cloneDeep(filter);
      unset(clonedFilter, [filter_id]);
      setFilter(clonedFilter);
   }
 };

 const onFilterClear = () => {
      const clonedFilter = cloneDeep(filter);
      unset(clonedFilter, [TASK_TYPE.ID]);
      unset(clonedFilter, [ASSIGNED_ON.ID]);
      unset(clonedFilter, [DUE_ON.ID]);
      setFilter(clonedFilter);
 };

 // Search Field

 const onToggleSearch = () => setSearchFocus((previous) => !previous);

 const onSearchHandler = (event) => {
    const { value = EMPTY_STRING } = event?.target || {};
    const searchValue = (value || EMPTY_STRING).trim();
    const clonedFilterSearch = cloneDeep(filter);
    if (searchValue) {
      clonedFilterSearch.search = value;
    } else {
      delete clonedFilterSearch?.search;
    }
    setFilter(clonedFilterSearch);
    loadTaskList(1, clonedFilterSearch);
  };

 // Create Task
 const onCreateTask = () => {
    const currentParams = queryString.parseUrl(history.location.pathname);
    const newParams = {
      ...get(currentParams, ['query'], {}),
      [CREATE]: MODULE_TYPES.TASK,
    };
    const param = getTaskListApiParams(1, filter);
    delete param.cancelToken;
    const createTaskSearchParams = new URLSearchParams(newParams).toString();
    const createTaskState = {
      tabIndex: taskListType,
      taskListApiParams: param,
      redirectedFrom: REDIRECTED_FROM.TASK_LIST,
    };
    routeNavigate(history, ROUTE_METHOD.REPLACE, null, createTaskSearchParams, createTaskState);
};

 // Row Click
 const onRowClickHandler = (id) => {
  const activeTaskData = (taskListReducer?.activeTaskList || []).find((eachList) => eachList?._id === id);
  const queryParams = (taskListType === TASK_LIST_TYPE.ASSIGNED_TO_OTHERS) ? { uuid: activeTaskData?.task_metadata_uuid } : null;
  dispatch(taskListReducerDataChange({ activeTaskId: id }));
  const existingPathname = get(history, ['location', 'pathname'], EMPTY_STRING);

  let pathname = getRouteLink(EMPTY_STRING, history);
  if (componentId !== HOME_COMPONENT) {
     pathname = (existingPathname) ? existingPathname.substring(0, existingPathname.length) : existingPathname;
  } else if (componentId === HOME_COMPONENT) {
    pathname = DEFAULT_APP_ROUTE;
  }
  const param = getTaskListApiParams(1, filter);
  delete param.cancelToken;
  const useTaskPathName = `${pathname}${TASKS}/${taskListType}/${id}`;
  const appData = history?.location?.pathname?.split('/');
  const pageName = appData?.[appData.length - 1];
  const useTaskState = {
    taskDetails: { ...(activeTaskData || {}) },
    tabIndex: taskListType,
    taskListApiParams: param,
    standardUserRedirectComponentId: componentId,
    redirectedFrom: REDIRECTED_FROM.TASK_LIST,
    ...(pageName) && { sourceName: pageName },
    hideClosePopper: false,
    fromPathname: history?.location?.pathname,
  };
  const useTaskSearchParams = queryParams ? `?${new URLSearchParams(queryParams).toString()}` : null;
  routeNavigate(history, ROUTE_METHOD.PUSH, useTaskPathName, useTaskSearchParams, useTaskState);
 };

 // Sort Click
 const onSortHandler = (fieldKey = null, sortOrder = TableSortOrder.ASC) => {
  const sort_order = (sortOrder === TableSortOrder.ASC) ? SORT_BY.DESC : SORT_BY.ASC;
  setFilter((existing_filter) => {
      const clonedFilter = cloneDeep(existing_filter);
      clonedFilter.sort_by = sort_order;
      clonedFilter.sort_field = getColumSortByKey(fieldKey);
      setActiveSortField(fieldKey);
      loadTaskList(1, clonedFilter);
      return clonedFilter;
  });
 };

 const onCloseClick = (taskListType, componentId) => {
   const stringToFind = `${TASKS}/${taskListType}`;
   const existingPathname = get(history, ['location', 'pathname'], EMPTY_STRING);

   let endRange = (existingPathname.indexOf(stringToFind));
   if (componentId === HOME_COMPONENT) {
      endRange = (existingPathname.indexOf(stringToFind) + stringToFind.length - 1);
   }
   const pathname = existingPathname.substring(0, endRange);

   dispatch(taskListReducerDataChange({ activeTaskId: null }));
   routeNavigate(history, ROUTE_METHOD.REPLACE, pathname, null, null);
 };

 const onAssigneToOtherTypeChange = (value) => {
    const constructedfilter = {
      ...filter,
      type: value,
    };
    setFilter(constructedfilter);
    loadTaskList(1, constructedfilter);
 };

return {
    taskListReducer,
    history,
    filter,
    filterPrevState,
    activeSortField,
    isFilterPopOverVisible,
    TASK_LIST_CONSTANT,
    isSearchFocus,
    location,
    selectedFilterCount,
    updateFilterAndPreviousFilterState,
    setFilterPopOverVisibility,
    onToggleSearch,
    onSearchHandler,
    onLoadMoreTaskList,
    onFilterChangeHandler,
    onFilterSaveHandler,
    onFilterCancelHandler,
    onRowClickHandler,
    onSortHandler,
    onCreateTask,
    onCloseClick,
    onPageChange,
    onAssigneToOtherTypeChange,
    onFilterClearByFilterId,
    onFilterClear,
 };
};

export default useTasks;
