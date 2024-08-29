import { translate } from 'language/config';
import { EToastType, toastPopOver } from '@workhall-pvt-lmt/wh-ui-library';
import { FLOATING_ACTION_MENU_START_SECTION, INITIATE_FLOW } from './ActionConstants';
import {
  apiGetAllInitiateFlows,
  initiateFlow,
} from '../../axios/apiService/flowList.apiService';
import { updateErrorPopoverInRedux, routeNavigate, openInNewTab, showToastPopover } from '../../utils/UtilityFunctions';
import {
  generateGetServerErrorMessage,
} from '../../server_validations/ServerValidation';
import { EMPTY_STRING, ERROR_TEXT } from '../../utils/strings/CommonStrings';
import { FORM_POPOVER_STATUS, REDIRECTED_FROM, ROUTE_METHOD } from '../../utils/Constants';
import { hideTaskListStarted } from './TaskActions';
import { OPEN_TASKS, TASKS } from '../../urls/RouteConstants';
import { store } from '../../Store';
import { taskListReducerDataChange } from '../reducer/TaskListReducer';

export const floatingActionMenuStartSectionSetSearchText = (searchText) => {
  return {
    type: FLOATING_ACTION_MENU_START_SECTION.SET_SEARCH_TEXT,
    payload: { searchText },
  };
};
export const floatingActionMenuStartSectionDataChange = (data) => (dispatch) => {
  dispatch({
    type: FLOATING_ACTION_MENU_START_SECTION.DATA_CHANGE,
    payload: data,
  });
  return Promise.resolve();
};
export const getInitiateFlowListInfiniteScrollStartedAction = () => {
  return {
    type: FLOATING_ACTION_MENU_START_SECTION.GET_FLOW_LIST_INFINITE_SCROLL_STARTED,
  };
};

export const floatingActionMenuStartSectionStarted = () => {
  return {
    type: FLOATING_ACTION_MENU_START_SECTION.STARTED,
  };
};

export const initiateFlowApiStarted = () => {
  return {
    type: INITIATE_FLOW.STARTED,
  };
};

export const initiateFlowApiSuccess = () => {
  return {
    type: INITIATE_FLOW.SUCCESS,
  };
};

export const floatingActionMenuStartSectionSuccess = (data) => {
  return {
    type: FLOATING_ACTION_MENU_START_SECTION.SUCCESS,
    payload: data,
  };
};

export const floatingActionMenuStartSectionFailure = (error) => {
  return {
    type: FLOATING_ACTION_MENU_START_SECTION.FAILURE,
    payload: error,
  };
};

export const floatingActionMenuStartSectionCancel = () => {
  return {
    type: FLOATING_ACTION_MENU_START_SECTION.CANCEL,
  };
};

export const floatingActionMenuStartSectionClear = () => {
  return {
    type: FLOATING_ACTION_MENU_START_SECTION.CLEAR,
  };
};

const throwError = (err, isGet) => {
  if (isGet) {
    const getError = generateGetServerErrorMessage(err);
    const commonServerError = getError.common_server_error
      ? getError.common_server_error
      : EMPTY_STRING;
    updateErrorPopoverInRedux(ERROR_TEXT.UPDATE_FAILURE, commonServerError);
    floatingActionMenuStartSectionDataChange({
      common_server_error: getError.common_server_error,
    });
    return floatingActionMenuStartSectionFailure(getError.common_server_error);
  } else {
    // const { server_error } = store.getState().TeamReducer;
    // const postError = generatePostServerErrorMessage(err, [], CREATE_TEAM_LABELS);
    // const commonServerError = postError.common_server_error ? postError.common_server_error : EMPTY_STRING;
    // const serverError = postError.state_error ? postError.state_error : [];
    // updateErrorPopoverInRedux(TEAMS.UPDATE_FAILURE, postError.common_server_error);
    // return teamFailure(commonServerError, serverError);
  }
  return null;
};

export const getAllInitiateFlows = (searchWithPaginationData) => (dispatch) => {
  const { isPaginatedData } = store.getState().FloatingActionMenuStartSectionReducer;
  console.log('API CALL BEING MADE IN ACTIONS', searchWithPaginationData);
  let params_ = searchWithPaginationData;
  if (isPaginatedData) {
    dispatch(getInitiateFlowListInfiniteScrollStartedAction());
    // const { initiateFlowTotalCount, renderedInitiateFlowListCount } = store.getState().FloatingActionMenuStartSectionReducer;
    // const remainingDataCount = Math.max(
    //   0,
    //   initiateFlowTotalCount - renderedInitiateFlowListCount,
    // );
    console.log('API CALL PARAMS before', params_);
    params_ = {
      ...searchWithPaginationData,
      page: searchWithPaginationData.page + 1,
      // size: Math.min(params.size, remainingDataCount),
      size: searchWithPaginationData.size,
    }; console.log('API CALL PARAMS', params_);
  } else dispatch(floatingActionMenuStartSectionStarted);
  console.log('API CALL PARAMS', params_);
  apiGetAllInitiateFlows(params_)
    .then((res) => {
      console.log('API CALL BEING MADE SUCCESS ACTION', res.pagination_details[0].total_count, res);
      dispatch(floatingActionMenuStartSectionSuccess(res));
      // dispatch(
      //   floatingActionMenuStartSectionDataChange({
      //     // dataChange
      //     isInitiateFlowListInfiniteScrollLoading : false,
      //     initiateFlowList : isPaginatedData ? [...initiateFlowList, ...res.pagination_data]
      //     : res.pagination_data,
      //     initiateFlowListDocumentDetails: isPaginatedData
      //     ? [...initiateFlowListDocumentDetails, ...res.document_url_details]
      //     : res.document_url_details,
      //     renderedInitiateFlowListCount : initiateFlowList.length,
      //     initiateFlowTotalCount : res.pagination_details[0].total_count,
      //     initiateFlowListCurrentPage : res.pagination_details[0].page,
      //     }),
      // );
    })
    .catch((err) => {
      console.log('API CALL ERROR', err);
      dispatch(throwError(err, true));
    });
};

export const initiateFlowApi = (data, history, redirectedFrom, urlData = {}, pathname) => (dispatch) => new Promise((resolve) => {
  dispatch(initiateFlowApiStarted());
  initiateFlow(data)
    .then((res) => {
      if (res.task_log_id) {
        dispatch(hideTaskListStarted());
        dispatch(taskListReducerDataChange({ activeTaskId: res.task_log_id }));
        const openTaskIdPathName = pathname
          ? `${pathname}${TASKS}/${OPEN_TASKS}/${res.task_log_id}`
          : `${TASKS}/${OPEN_TASKS}/${res.task_log_id}`;
        const initiateFlowState = {
          redirectedFrom,
          flow_uuid: data.flow_uuid,
          ...urlData,
          isFlowInitiationTask: true,
          tabIndex: OPEN_TASKS,
          fromPathname: history?.location?.pathname || EMPTY_STRING,
        };
        if (redirectedFrom === REDIRECTED_FROM.FLOW_DATA_INSTANCE || redirectedFrom === REDIRECTED_FROM.DATALIST_INSTANCE) {
          openInNewTab(openTaskIdPathName);
        } else {
          routeNavigate(history, ROUTE_METHOD.PUSH, openTaskIdPathName, EMPTY_STRING, initiateFlowState);
        }
        resolve(res.task_log_id);
      } else {
        toastPopOver({
          title: 'Flow Instance has been started Successfully',
          toastType: EToastType.success,
        });
      }
    })
    .catch(() => {
      showToastPopover(
        translate('error_popover_status.error'),
        translate('error_popover_status.flow_failed'),
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
      resolve(null);
    });
});
