import {
  getFlowList,
  getTaskFlowList,
  getUserTaskList,
  getUsageSummary,
  getUsersSummary,
} from 'axios/apiService/usageDashboard.apiService';
import { FORM_POPOVER_STATUS } from 'utils/Constants';
import jsUtils from 'utils/jsUtility';
import { FLOW_INITIAL_LOADING_TEXT } from 'utils/strings/CommonStrings';
import {
  updatePostLoader,
} from 'utils/UtilityFunctions';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { showToastPopover } from '../../utils/UtilityFunctions';
import {
  getFlowListDataStarted,
  getTaskFlowListDataStarted,
  getUserTaskListDataStarted,
  getFlowListDataSuccess,
  getTaskFlowListDataSuccess,
  getUserTaskListDataSuccess,
  getFlowListDataFailure,
  getTaskFlowListDataFailure,
  getUserTaskListDataFailure,
  getUsageSummaryDataStarted,
  getUsageSummaryDataSuccess,
  getUsageSummaryDataFailure,
  getUsersSummaryDataStarted,
  getUsersSummaryDataSuccess,
  getUsersSummaryDataFailure,
} from '../reducer/UsageDashboardReducer';

// Usage Summary
export const getUsageSummaryDataThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getUsageSummaryDataStarted());
    updatePostLoader(true);
    getUsageSummary(params)
      .then((response) => {
        updatePostLoader(false);
        if (response) {
          dispatch(getUsageSummaryDataSuccess(response));
          resolve();
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(
            getUsageSummaryDataFailure({
              common_server_error: errors.common_server_error,
            }),
          );
          reject();
        }
      })
      .catch((error) => {
        updatePostLoader(false);
        reject();
        const errors = generateGetServerErrorMessage(error);
        dispatch(
          getUsageSummaryDataFailure({
            common_server_error: errors.common_server_error,
          }),
        );
      });
  });

  // Users Summary
  export const getUsersSummaryDataThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getUsersSummaryDataStarted());
    updatePostLoader(true);
    getUsersSummary(params)
      .then((response) => {
        updatePostLoader(false);
        if (response) {
          dispatch(getUsersSummaryDataSuccess(response));
          resolve();
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(
            getUsersSummaryDataFailure({
              common_server_error: errors.common_server_error,
            }),
          );
          reject();
        }
      })
      .catch((error) => {
        updatePostLoader(false);
        reject();
        const errors = generateGetServerErrorMessage(error);
        dispatch(
          getUsersSummaryDataFailure({
            common_server_error: errors.common_server_error,
          }),
        );
      });
  });

// Flow Metrics Start
export const getFlowListDataThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getFlowListDataStarted());
    updatePostLoader(true);
    getFlowList(params)
      .then((response) => {
        updatePostLoader(false);
        if (response) {
          dispatch(getFlowListDataSuccess(response));
          resolve();
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(
            getFlowListDataFailure({
              common_server_error: errors.common_server_error,
            }),
          );
          reject();
        }
      })
      .catch((error) => {
        updatePostLoader(false);
        reject();
        if (
          jsUtils.get(error, 'response.data.errors.0.type') ===
          FLOW_INITIAL_LOADING_TEXT.TYPE
        ) {
          showToastPopover(
            jsUtils.get(error, 'response.data.errors.0.message'),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        const errors = generateGetServerErrorMessage(error);
        dispatch(
          getFlowListDataFailure({
            common_server_error: errors.common_server_error,
          }),
        );
      });
  });

export const getTaskFlowListDataThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getTaskFlowListDataStarted());
    updatePostLoader(true);
    getTaskFlowList(params)
      .then((response) => {
        updatePostLoader(false);
        if (response) {
          dispatch(getTaskFlowListDataSuccess(response));
          resolve();
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(
            getTaskFlowListDataFailure({
              common_server_error: errors.common_server_error,
            }),
          );
          reject();
        }
      })
      .catch((error) => {
        updatePostLoader(false);
        reject();
        if (
          jsUtils.get(error, 'response.data.errors.0.type') ===
          FLOW_INITIAL_LOADING_TEXT.TYPE
        ) {
          showToastPopover(
            jsUtils.get(error, 'response.data.errors.0.message'),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        const errors = generateGetServerErrorMessage(error);
        dispatch(
          getTaskFlowListDataFailure({
            common_server_error: errors.common_server_error,
          }),
        );
      });
  });

export const getUserTaskListDataThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getUserTaskListDataStarted());
    updatePostLoader(true);
    getUserTaskList(params)
      .then((response) => {
        updatePostLoader(false);
        if (response) {
          dispatch(getUserTaskListDataSuccess(response));
          resolve();
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(
            getUserTaskListDataFailure({
              common_server_error: errors.common_server_error,
            }),
          );
          reject();
        }
      })
      .catch((error) => {
        updatePostLoader(false);
        reject();
        if (
          jsUtils.get(error, 'response.data.errors.0.type') ===
          FLOW_INITIAL_LOADING_TEXT.TYPE
        ) {
          showToastPopover(
            jsUtils.get(error, 'response.data.errors.0.message'),
            EMPTY_STRING,
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        const errors = generateGetServerErrorMessage(error);
        dispatch(
          getUserTaskListDataFailure({
            common_server_error: errors.common_server_error,
          }),
        );
      });
  });
// Flow Metrics End

export default getFlowListDataThunk;
