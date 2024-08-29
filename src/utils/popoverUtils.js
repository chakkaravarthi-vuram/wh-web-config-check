import React from 'react';
import * as ROUTE_CONSTANTS from '../urls/RouteConstants';
import jsUtils, { translateFunction } from './jsUtility';
import { store } from '../Store';
import * as actions from '../redux/actions/Actions';
import UpdateConfirmPopover from '../components/update_confirm_popover/UpdateConfirmPopover';
import { VALIDATION_CONSTANT } from './constants/validation.constant';
import { routeNavigate, showToastPopover } from './UtilityFunctions';
import { FORM_POPOVER_STATUS, ROUTE_METHOD } from './Constants';

/** @module popover * */
/**
 * @memberof popover
 */
/**
 * @function updateFormPopOverStatus
 * @param {Object} obj obejct
 * @description to display a consolidated popover on any success or failure action
 * @return dispatch function to update popover in redux
 */
 export const updateFormPopOverStatus = (obj) => {
    store.dispatch(actions.formPopOverStatusAction(obj));
  };
/**
 * @memberof popover
 */
  /**
   * @function updateConfirmPopover
   * @param {Object} obj object
   * @description to display a confirmation popover
   * @return dispatch function to update confirmation popover in redux
   */
  export const updateConfirmPopover = (data) => {
    store.dispatch(actions.setConfirmPopoverAction(data));
  };
/**
 * @memberof popover
 */
  /**
   * @description to clear confirm popoverr
   * @return dispatch function to update confirmation popover in redux
   */
  export const clearConfirmPopover = () => {
    store.dispatch(actions.clearConfirmPopoverAction());
  };
  /**
 * @memberof popover
 */
  /**
   * @function updateAlertPopverStatus
   * @param {Object} obj object
   * @description to display a alert popover
   * @return dispatch function to update alert popover in redux
   */
  export const updateAlertPopverStatus = (obj) => {
    store.dispatch(actions.alertPopOverStatusAction(obj));
  };
/**
 * @memberof popover
 */
  /**
   * @function updateErrorPopoverInRedux
   * @param {Object} obj object
   * @param {Object} serverError error from server
   * @description to display a server error popover
   * @return dispatch function to update server error popover in redux
   */

  export const updateErrorPopoverInRedux = (obj, serverError) => {
    const error_object = obj;
    if (!jsUtils.isEmpty(serverError)) {
      error_object.subTitle = serverError;
      showToastPopover(
        error_object?.title,
        error_object?.subtitle || error_object?.subTitle,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
  };
  /**
 * @memberof popover
 */
/**
   * @function clearAlertPopOverStatus
   * @description to clear alert popover
   */
  export const clearAlertPopOverStatus = () => {
    store.dispatch(actions.clearAlertPopOverStatusAction());
  };
  /**
 * @memberof popover
 */
 /**
   * @function createTaskExit
   * @param {Object} history history object
   * @param {function} callBack call back method
   * @description to display task exit popover
   */
  export const createTaskExit = (history, callBack, t = translateFunction) => {
    updateAlertPopverStatus({
      isVisible: true,
      customElement: (
        <UpdateConfirmPopover
          onYesHandler={async () => {
            if (callBack) await callBack();
            routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
            clearAlertPopOverStatus();
          }}
          onNoHandler={() => clearAlertPopOverStatus()}
          title={t(VALIDATION_CONSTANT.TASK_DISCARD_CONFIRMATION)}
        />

      ),
    });
  };
  /**
 * @memberof popover
 */
/**
   * @function createDataSetExit
   * @param {Object} history history object
   * @param {function} callBack call back method
   * @description to display data list exit popover
   */
  export const createDataSetExit = (history, callBack, t = translateFunction) => {
    updateAlertPopverStatus({
      isVisible: true,
      // title: "Are you sure you want to discard the Data List Creation?",
      // routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
      customElement: (
        <UpdateConfirmPopover
          onYesHandler={async () => {
            if (callBack) await callBack();
            routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
            clearAlertPopOverStatus();
          }}
          onNoHandler={() => clearAlertPopOverStatus()}
          title={t(VALIDATION_CONSTANT.CLOSE_CONFIRMATION)}
          subTitle={t(VALIDATION_CONSTANT.CHANGES_SAVED_AS_DRAFT)}
        />
      ),
    });
  };
  /**
 * @memberof popover
 */
/**
   * @function defaultAlert
   * @param {Object} history history object
   * @param {function} callBack call back method
   * @description to display default alert popover
   */
  export const defaultAlert = (history, callBack, t = translateFunction) => {
    updateAlertPopverStatus({
      isVisible: true,
      // title: "Are you sure you want to discard the Data List Creation?",
      // routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
      customElement: (
        <UpdateConfirmPopover
          onYesHandler={async () => {
            if (callBack) await callBack();
            routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
            clearAlertPopOverStatus();
          }}
          onNoHandler={() => clearAlertPopOverStatus()}
          title={t(VALIDATION_CONSTANT.CLOSE_CONFIRMATION)}
          subTitle={t(VALIDATION_CONSTANT.SAVE_CURRENT_CHANGES)}
        />
      ),
    });
  };
  /**
 * @memberof popover
 */
/**
   * @function editFlowExit
   * @param {Object} history history object
   * @param {function} callBack call back method
   * @description to display edit flow exit popover
   */
  export const editFlowExit = (history, callBack, t = translateFunction) => {
    updateAlertPopverStatus({
      isVisible: true,
      customElement: (
        <UpdateConfirmPopover
          onYesHandler={async () => {
            if (callBack) await callBack();
            routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
            clearAlertPopOverStatus();
          }}
          onNoHandler={() => clearAlertPopOverStatus()}
          title={t(VALIDATION_CONSTANT.CLOSE_CONFIRMATION)}
          subTitle={t(VALIDATION_CONSTANT.CHANGES_SAVED_AS_DRAFT)}
        />
      ),
    });
  };
  /**
 * @memberof popover
 */
/**
   * @function editDataListExit
   * @param {Object} history history object
   * @param {function} callBack call back method
   * @description to display editDataList exit popover
   */
  export const editDataListExit = (history, callBack, t = translateFunction) => {
    updateAlertPopverStatus({
      isVisible: true,
      customElement: (
        <UpdateConfirmPopover
          onYesHandler={async () => {
            if (callBack) await callBack();
            routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
            clearAlertPopOverStatus();
          }}
          onNoHandler={() => clearAlertPopOverStatus()}
          title={t(VALIDATION_CONSTANT.CLOSE_CONFIRMATION)}
          subTitle={t(VALIDATION_CONSTANT.CHANGES_SAVED_AS_DRAFT)}
        />
      ),
    });
  };
  /**
 * @memberof popover
 */
/**
   * @function saveDataListExit
   * @param {Object} history history object
   * @param {function} callBack call back method
   * @description to display save data list exit popover
   */
  export const saveDataListExit = (history, callBack, t = translateFunction) => {
    updateAlertPopverStatus({
      isVisible: true,
      customElement: (
        <UpdateConfirmPopover
          onYesHandler={async () => {
            if (callBack) await callBack();
            routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
            clearAlertPopOverStatus();
          }}
          onNoHandler={() => clearAlertPopOverStatus()}
          title={t(VALIDATION_CONSTANT.CLOSE_CONFIRMATION)}
          subTitle={t(VALIDATION_CONSTANT.CHANGES_SAVED_AS_DRAFT)}
        />
      ),
    });
  };
