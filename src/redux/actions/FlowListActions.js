import { cloneDeep, isEmpty } from 'lodash';
import { FLOW_DROPDOWN } from 'containers/flow/listFlow/listFlow.strings';
import { createElementAllFlow } from 'containers/landing_page/flows/Flow.utils';
import { LIST_TYPE } from 'components/list_headers/ListHeader';
import {
  FLOW_LIST_ACTION,
  STARTED_FLOW_LIST_ACTION,
} from './ActionConstants';
import {
  getAllSelfInitiatedFlows,
} from '../../axios/apiService/flowList.apiService';
import {
  getAllDevFlowsApiService,
  getAllDraftFlowApiService,
} from '../../axios/apiService/listFlow.apiService';
import { FLOW_STRINGS } from '../../containers/flows/Flow.strings';
import { API_CALL_STRINGS } from '../../components/list_and_filter/ListAndFilter.strings';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { store } from '../../Store';
import { validateAndProcessStartedFlowListData } from '../../containers/landing_page/all_flows/started_flow_list/StartedFlowList.utils';
import { CancelToken } from '../../utils/UtilityFunctions';

const flowListCancelToken = new CancelToken();

const flowListApiStarted = (allUserData) => {
  return {
    type: FLOW_LIST_ACTION.STARTED,
    payload: { ...allUserData },
  };
};

const flowListApiSuccess = (allUserData) => {
  return {
    type: FLOW_LIST_ACTION.SUCCESS,
    payload: { ...allUserData },
  };
};

const flowListLandingApiStarted = (allUserData) => {
  return {
    type: FLOW_LIST_ACTION.LANDING_STARTED,
    payload: { ...allUserData },
  };
};

const flowListLandingApiSuccess = (allUserData) => {
  return {
    type: FLOW_LIST_ACTION.LANDING_SUCCESS,
    payload: { ...allUserData },
  };
};

export const flowListDataChange = (allUserData) => (dispatch) => {
  dispatch({
    type: FLOW_LIST_ACTION.DATA_CHANGE,
    payload: { ...allUserData },
  });
  return Promise.resolve();
};

const flowListApiFailure = (error) => {
  return {
    type: FLOW_LIST_ACTION.FAILURE,
    payload: error,
  };
};

export const clearFlowListData = () => {
  return {
    type: FLOW_LIST_ACTION.CLEAR,
  };
};

export const refreshFlowListStarted = () => {
  return {
    type: FLOW_LIST_ACTION.REFRESH_FLOW_STARTED,
  };
};

const startedFlowListApiStarted = () => {
  return {
    type: STARTED_FLOW_LIST_ACTION.STARTED,
  };
};

const startedFlowListApiSuccess = (data) => {
  return {
    type: STARTED_FLOW_LIST_ACTION.SUCCESS,
    payload: { ...data },
  };
};

const startedFlowListApiFailure = (error) => {
  return {
    type: STARTED_FLOW_LIST_ACTION.FAILURE,
    payload: error,
  };
};

export const clearStartedFlowListData = () => {
  return {
    type: STARTED_FLOW_LIST_ACTION.CLEAR,
  };
};

export const getAllSelfInitiatedFlowsApiAction =
  (params, type) => (dispatch) => {
    if (type === API_CALL_STRINGS.LOAD_DATA) {
      dispatch(flowListDataChange({ infiniteScrollDataLoading: true }));
    } else dispatch(startedFlowListApiStarted());
    getAllSelfInitiatedFlows(params)
      .then((response) => {
        const { started_flow_list, startedFlowLength } =
          store.getState().FlowListReducer;
        const hasMore =
          response.pagination_details[0].total_count -
            (started_flow_list.length + response.pagination_data.length) >
          0;
        const page = hasMore
          ? response.pagination_details[0].page + 1
          : response.pagination_details[0].page;
        if (type === API_CALL_STRINGS.LOAD_DATA) {
          dispatch(
            startedFlowListApiSuccess({
              started_flow_list: [
                ...started_flow_list,
                ...validateAndProcessStartedFlowListData(
                  response.pagination_data,
                ),
              ],
              infiniteScrollHasMoreData: hasMore,
              infiniteScrollPage: page,
              infiniteScrollDataLoading: false,
              startedFlowLength:
                startedFlowLength + response.pagination_data.length,
            }),
          );
        } else {
          dispatch(
            startedFlowListApiSuccess({
              started_flow_list:
                validateAndProcessStartedFlowListData(
                  response.pagination_data,
                ),
              infiniteScrollHasMoreData: hasMore,
              infiniteScrollPage: page,
              startedFlowLength:
                startedFlowLength + response.pagination_data.length,
            }),
          );
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        if (type === API_CALL_STRINGS.LOAD_DATA) {
          dispatch(
            flowListDataChange({
              infiniteScrollDataLoading: false,
              common_server_error: errors.common_server_error,
            }),
          );
        } else {
          dispatch(startedFlowListApiFailure(errors.common_server_error));
        }
      });
  };

export const getDraftFlowsListDataThunk =
  (
    params,
  ) =>
    (dispatch) => {
      dispatch(
        flowListApiStarted({ isLoadMoreHandler: params.page > 1 }),
      );
      getAllDraftFlowApiService(params)
        .then((response) => {
          const { tab_index } = cloneDeep(
            store.getState().FlowListReducer,
          );
          if (
            !isEmpty(response) &&
            tab_index === FLOW_DROPDOWN.DRAFT_FLOW
          ) {
            let flowListUpdated = [];
            if (params.page === 1) {
              flowListUpdated = response.pagination_data;
            } else {
              const { flow_list } = cloneDeep(
                store.getState().FlowListReducer,
              );
              const reponseDataList = response.pagination_data;
              flow_list.push(...reponseDataList);
              flowListUpdated = flow_list;
            }
            const remainingFlowsCount =
              response.pagination_details[0].total_count -
              flowListUpdated.length;
            dispatch(
              flowListApiSuccess({
                flow_list: flowListUpdated,
                total_count: response.pagination_details[0].total_count,
                remainingFlowsCount,
                document_url_details: response.document_url_details,
                hasMore: remainingFlowsCount > 0,
              }),
            );
          }
        })
        .catch((error) => {
          const errors = generateGetServerErrorMessage(error);
          dispatch(flowListApiFailure(errors.common_server_error));
        });
    };

export const getAllDevFlowsThunk = (params, type) => (dispatch) => {
    if (type === FLOW_STRINGS.FLOW_API_CALL_STRINGS.GET_FLOWS) {
      dispatch(flowListLandingApiStarted({ isLoadMoreHandler: false }));
    } else {
      dispatch(
        flowListApiStarted({ isLoadMoreHandler: params.page > 1 }),
      );
    }
    getAllDevFlowsApiService(params, flowListCancelToken)
      .then((response) => {
        if (type === FLOW_STRINGS.FLOW_API_CALL_STRINGS.GET_FLOWS) {
          const flowListUpdated = response.pagination_data;
          const sizeAfterCalculation = createElementAllFlow(flowListUpdated, LIST_TYPE.FLOW);
          const remainingFlowsCount =
            response.pagination_details[0].total_count - flowListUpdated.slice(0, sizeAfterCalculation).length;
          dispatch(
            flowListLandingApiSuccess({
              landing_flow_list: flowListUpdated.slice(0, sizeAfterCalculation),
              total_count: response.pagination_details[0].total_count,
              remainingFlowsCount,
              hasMore: remainingFlowsCount > 0,
              isLandingDataLoading: false,
            }),
          );
        } else {
          let flowListUpdated = [];
          if (params.page === 1) {
            flowListUpdated = response.pagination_data;
          } else {
            const { flow_list } = cloneDeep(
              store.getState().FlowListReducer,
            );
            const reponseDataList = response.pagination_data;
            flow_list.push(...reponseDataList);
            flowListUpdated = flow_list;
          }
          const remainingFlowsCount =
            response.pagination_details[0].total_count -
            flowListUpdated.length;
          dispatch(
            flowListApiSuccess({
              flow_list: flowListUpdated,
              total_count: response.pagination_details[0].total_count,
              remainingFlowsCount,
              document_url_details: response.document_url_details,
              hasMore: remainingFlowsCount > 0,
            }),
          );
        }
      })
      .catch((error) => {
        if (error && (error.code === 'ERR_CANCELED')) return;
        const errors = generateGetServerErrorMessage(error);
        dispatch(flowListApiFailure(errors.common_server_error));
      });
  };
