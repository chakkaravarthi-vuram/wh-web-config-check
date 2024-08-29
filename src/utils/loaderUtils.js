import { store } from '../Store';
import * as actions from '../redux/actions/Actions';
import gClasses from '../scss/Typography.module.scss';

/** @module loader * */
/**
 * @memberof loader
 */
/**
 * @function calculateProgressPercentage
 * @param {Object} progressEvent event object
 * @description to caluculate progress of api call in percentage and display loader based on that
 * @return {number}
 */
export const calculateProgressPercentage = (progressEvent) => {
    if (progressEvent) {
      return parseInt(
        Math.round((progressEvent.loaded / progressEvent.total) * 100),
        10,
      );
    }
    return null;
  };
  /**
 * @memberof loader
 */
/**
 * @function updatePostLoader
 * @param {boolean} isVisible boolean
 * @param {Object} progressEvent event object
 * @description to run a loader at top of screen for all api calls
 * @return dispatch action to redux to update popover
 */
  export const updatePostLoader = (isVisible, progressEvent) => {
    const progressPercentage = calculateProgressPercentage(progressEvent);
    const progress = {
      isVisible,
      progressPercentage,
    };
    store.dispatch(actions.postLoaderAction(progress));
  };
  /**
 * @memberof loader
 */
/**
 * @function setPointerEvent
 * @param {boolean} isVisible boolean
 * @description to hide pointer to prevent user clicking anywhere while making api calls
 */
  export const setPointerEvent = (isVisible) => {
    if (isVisible) {
      document.body.classList.add(gClasses.NoPointerEvent);
    } else {
      document.body.classList.remove(gClasses.NoPointerEvent);
    }
  };
  /**
 * @memberof loader
 */
/**
 * @function getLoaderConfig
 * @description to show loader at top
 * @return {Object}
 */
  export const getLoaderConfig = () => {
    return {
      onUploadProgress: (progressEvent) => updatePostLoader(true, progressEvent),
      timeout: 0,
    };
  };
  /**
 * @memberof loader
 */
/**
 * @function getFileUploadStatus
 * @param {function} callBack callback function
 * @description to show file uploading status
 */
  export const getFileUploadStatus = (callBack) => {
    return {
      onUploadProgress: (progressEvent) => {
        const progressPercentage = calculateProgressPercentage(progressEvent);
        console.log('checking12345', progressEvent, progressPercentage);
        callBack(progressPercentage);
      },
      timeout: 0,
    };
  };
