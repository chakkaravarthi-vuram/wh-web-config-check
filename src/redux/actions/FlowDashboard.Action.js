import {
  deleteTestBedFlowApi,
  taskReassign,
} from 'axios/apiService/flow.apiService';
import { FLOW_DROPDOWN } from 'containers/flow/listFlow/listFlow.strings';
import { EDIT_FLOW } from 'urls/RouteConstants';
import { DOWNLOAD_WINDOW_STRINGS } from 'components/download/Download.strings';
import {
  apiExportFlowDashboard,
  apiGetFlowAccessByUUID,
} from '../../axios/apiService/flowList.apiService';
import { FLOW_STRINGS } from '../../containers/flow/Flow.strings';
import {
  FLOW_NOT_EXIST,
} from '../../containers/flow/flow_dashboard/FlowDashboard.string';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { store } from '../../Store';
import { FORM_POPOVER_STATUS, ROUTE_METHOD } from '../../utils/Constants';
import jsUtils, { cloneDeep, isEmpty, isObject, translateFunction } from '../../utils/jsUtility';
import {
  EMPTY_STRING,
  ERROR_TEXT,
} from '../../utils/strings/CommonStrings';
import {
  hasOwn,
  routeNavigate,
  setPointerEvent,
  showToastPopover,
  updateErrorPopoverInRedux,
  updatePostLoader,
} from '../../utils/UtilityFunctions';
import {
  dataListDashboardDataChange,
} from '../reducer/DataListReducer';
import { downloadWindowDataChange } from '../reducer/DownloadWindowReducer';
import { FLOW_DASHBOARD } from './ActionConstants';
import { setFlowDashboardById } from '../reducer/ApplicationDashboardReportReducer';
import { dataChange } from '../reducer/IndividualEntryReducer';

const flowDashboardStarted = () => {
  return {
    type: FLOW_DASHBOARD.STARTED,
  };
};

const flowDashboardAccessByUUIDSuccess = (AccessFlows) => {
  return {
    type: FLOW_DASHBOARD.ACCESS_BY_UUID_SUCCESS,
    payload: { AccessFlows },
  };
};

export const flowDashboardDataChange = (data) => {
  return {
    type: FLOW_DASHBOARD.DATA_CHANGE,
    payload: data,
  };
};

const flowDashboardFailure = (error) => {
  return {
    type: FLOW_DASHBOARD.FAILURE,
    payload: error,
  };
};

const throwError = (err, isGet) => {
  if (isGet) {
    const getError = generateGetServerErrorMessage(err);
    const commonServerError = getError.common_server_error
      ? getError.common_server_error
      : EMPTY_STRING;
    if (
      !(
        err.response &&
        err.response.data &&
        err.response.data.errors &&
        (err.response.data.errors[0].type === 'not_exist' ||
          err.response.data.errors[0].type === 'string.guid')
      )
    ) {
      updateErrorPopoverInRedux(ERROR_TEXT.UPDATE_FAILURE, commonServerError);
    }
    return flowDashboardFailure(commonServerError);
  }
  return null;
};

export const getFlowAccessByUUID = (params, t = translateFunction, callbackFn, isNormalUserDashboard = false, flowData = {}, isReportInstMode = false) => (dispatch) => {
  dispatch(flowDashboardStarted());
  apiGetFlowAccessByUUID(params)
    .then((res) => {
      let access = true;
      if (!res.show_edit && !res.show_initiate && !res.show_view) {
        access = false;
      }

      const isAdminOwnerViewer = !res?.is_participants_level_security || res?.is_admin || res?.is_owner || res?.is_viewer;

      if (!isNormalUserDashboard) {
        dispatch(
          flowDashboardAccessByUUIDSuccess({
            ...res,
            FlowAccess: access,
            isAdminOwnerViewer,
          }),
        );
      } else if (isReportInstMode) {
        dispatch(dataChange({ isAdminOwnerViewer }));
      } else {
        let clonedFlowData = cloneDeep(flowData);
        clonedFlowData = {
          ...clonedFlowData,
          ...res,
          FlowAccess: access,
          isAdminOwnerViewer,
        };
        dispatch(
          setFlowDashboardById({ id: params.flow_uuid, data: clonedFlowData }),
        );
      }
      if (callbackFn) callbackFn(isAdminOwnerViewer);
    })
    .catch((err) => {
      if (
        jsUtils.get(err, ['response', 'data', 'errors', 0, 'field'], '') ===
          'status' &&
        jsUtils.get(err, ['response', 'data', 'errors', 0, 'type'], '') ===
          'not_exist'
      ) {
        dispatch(
          flowDashboardFailure('This flow has been deleted'),
        );
      } else if (
        jsUtils.get(err, ['response', 'data', 'errors', 0, 'field'], '') ===
          'flow_uuid' &&
        jsUtils.get(err, ['response', 'data', 'errors', 0, 'type'], '') ===
          'not_exist'
      ) {
        dispatch(
          flowDashboardFailure(FLOW_NOT_EXIST(t).type),
        );
      } else {
        dispatch(throwError(err, true));
      }
    });
};

const getSystemGeneratedIdentifier = (state) =>
  hasOwn(state, 'system_identifier') ? state.system_identifier : null;

const getCustomIdentifier = (state) => {
  if (isEmpty(state)) return null;

  return hasOwn(state, 'custom_identifier') ? state?.custom_identifier : null;
};

export const getReferenceId = () => {
  const systemIdentifier = getSystemGeneratedIdentifier(
    store.getState().IndividualEntryReducer.instanceDetails,
  );
  const customIdentifier = getCustomIdentifier(
    store.getState().IndividualEntryReducer.instanceDetails,
  );

  if (customIdentifier) {
    if (isObject(customIdentifier)) {
      if (hasOwn(customIdentifier, 'currency_type')) {
        return `${customIdentifier?.value} ${customIdentifier?.currency_type}`;
      } else if (hasOwn(customIdentifier, 'phone_number')) {
        return `${customIdentifier?.country_code} (${customIdentifier?.phone_number})`;
      } else {
        return systemIdentifier;
      }
    } else return customIdentifier;
  } else {
    return systemIdentifier;
  }
};

export const downloadWindowStateChange = (type, data) => (dispatch) => {
  dispatch(downloadWindowDataChange('isDownloadActivityOpen', true));
  dispatch(downloadWindowDataChange('download_list', []));
  const {
    ACTIVITY: { TYPE },
  } = DOWNLOAD_WINDOW_STRINGS;
  if (type === TYPE.FLOW_OR_DATALIST) {
    const { flowId, query } = data;
    dispatch(
      downloadWindowDataChange('retryDownloadData', {
        flowOrDatalistId: flowId,
        queryData: query,
        type,
      }),
    );
  } else {
    const { task_metadata_uuid } = data;
    dispatch(
      downloadWindowDataChange('retryDownloadData', {
        task_metadata_uuid,
        type,
      }),
    );
  }
};

export const getExportFlowDashboard =
  (query, uuid, flowId, isDatalist = false) =>
  (dispatch) => {
    apiExportFlowDashboard(query, uuid, isDatalist)
      .then((response) => {
        const res = hasOwn(response, 'data') && response.data;
        if (
          res &&
          hasOwn(res, 'success') &&
          hasOwn(res, 'result') &&
          hasOwn(res.result, 'data')
        ) {
          if (res.result.data) {
            const {
              ACTIVITY: { TYPE },
            } = DOWNLOAD_WINDOW_STRINGS;
            dispatch(
              downloadWindowStateChange(TYPE.FLOW_OR_DATALIST, {
                flowId,
                query,
              }),
            );
          }
        }
      })
      .catch((err) => {
        dispatch(throwError(err, true));
      });
  };

export const reAssignmentApiThunk = (data, callbackFunction, t) => (dispatch) => {
  setPointerEvent(true);
  updatePostLoader(true);
  taskReassign(data)
    .then((res) => {
      let resData = EMPTY_STRING;
      if (res) {
        setPointerEvent(false);
        updatePostLoader(false);
        if (!isEmpty(res?.errors[0])) {
          showToastPopover(
            FLOW_STRINGS(t).FLOW_DASHBOARD.REASSIGNED_VALIDATION_STRINGS.REASSIGN_FAILED,
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          if (res.errors[0].error_reason.includes('reassign_assignees')) {
            resData = {
              reassignModal: {
                error_list: {
                  reassign_to:
                    FLOW_STRINGS(t).FLOW_DASHBOARD
                      .REASSIGNED_VALIDATION_STRINGS.REASSIGNED_ASSIGNEES,
                },
              },
            };
          }
        } else {
          showToastPopover(
            FLOW_STRINGS(t).FLOW_DASHBOARD.REASSIGNED_VALIDATION_STRINGS.REASSIGNED_SUCCESSFULLY,
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SUCCESS,
            true,
          );
          if (callbackFunction) callbackFunction();
          resData = {
            reassignModal: {
              error_list: {},
            },
          };
        }
        if (isEmpty(data?.data_list_uuid)) {
          dispatch(flowDashboardDataChange(resData));
        } else {
          dispatch(dataListDashboardDataChange(resData));
        }
      }
    })
    .catch((err) => {
      if (jsUtils.has(err, ['code']) && err.code === 'ERR_CANCELED') return;
      setPointerEvent(false);
      updatePostLoader(false);
      showToastPopover(
        FLOW_STRINGS(t).FLOW_DASHBOARD.REASSIGNED_VALIDATION_STRINGS.REASSIGN_FAILED,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    });
};

export const deleteTestBedFlowThunk =
  (flow_uuid, history) => (dispatch) =>
    new Promise((resolve) => {
      updatePostLoader(true);
      setPointerEvent(true);
      deleteTestBedFlowApi({ flow_uuid })
        .then((response) => {
          updatePostLoader(false);
          setPointerEvent(false);
          if (!jsUtils.isEmpty(response)) {
            dispatch(flowDashboardDataChange({ isLoading: false }));
            const flowDashboardState = {
              flow_tab: FLOW_DROPDOWN.DRAFT_FLOW,
              flow_uuid,
            };
            history &&
              routeNavigate(history, ROUTE_METHOD.PUSH, EDIT_FLOW, EMPTY_STRING, flowDashboardState);
          } else {
            const err = {
              response: {
                status: 500,
              },
            };
            throwError(err, true);
          }
          resolve();
        })
        .catch(() => {
          updatePostLoader(false);
          setPointerEvent(false);
          const err = {
            response: {
              status: 500,
            },
          };
          throwError(err, true);
        });
    });
