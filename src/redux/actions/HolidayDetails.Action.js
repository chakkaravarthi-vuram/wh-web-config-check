import { isEmpty, isArray } from 'lodash';
import { HOLIDAY_DETAILS } from './ActionConstants';
import {
  getHolidayData,
  updateHolidayData,
  deleteHolidayData,
} from '../../axios/apiService/holidayDetails.apiService';
import {
  setPointerEvent,
  updatePostLoader,
  updateErrorPopoverInRedux,
  showToastPopover,
} from '../../utils/UtilityFunctions';
import {
  generateGetServerErrorMessage,
  generatePostServerErrorMessage,
} from '../../server_validations/ServerValidation';
import {
  HOLIDAY_RESPONSE,
  HOLIDAY_LABELS,
} from '../../containers/admin_settings/language_and_calendar/holidays/Holidays.strings';
import { store } from '../../Store';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';

const holidayApiStarted = () => {
 return {
  type: HOLIDAY_DETAILS.STARTED,
};
};

const holidayApiSuccess = (holidayData) => {
 return {
  type: HOLIDAY_DETAILS.SUCCESS,
  payload: [...holidayData],
};
};

const holidayUpdateApiSuccess = (holidayData) => {
 return {
  type: HOLIDAY_DETAILS.UPDATE,
  payload: { ...holidayData },
};
};

export const holidayDataChangeAction = (holidayData) => (dispatch) => {
  dispatch({
    type: HOLIDAY_DETAILS.DATA_CHANGE,
    payload: { ...holidayData },
  });
  return Promise.resolve();
};

const holidayApiFailure = (error) => {
 return {
  type: HOLIDAY_DETAILS.FAILURE,
  payload: error,
};
};

export const holidayApiCancelAction = () => {
 return {
  type: HOLIDAY_DETAILS.CANCEL,
};
};

export const clearHolidayDataAction = () => {
 return {
  type: HOLIDAY_DETAILS.CLEAR,
};
};

export const holidayPostsApiCancelAction = () => {
 return {
  type: HOLIDAY_DETAILS._POST_CANCEL,
};
};

export const getHolidayDataThunk = (params) => (dispatch) => {
    dispatch(holidayApiStarted());
    getHolidayData(params)
      .then((normalizedData) => {
        if (isArray(normalizedData)) {
          dispatch(holidayApiSuccess(normalizedData));
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(holidayApiFailure(errors.common_server_error));
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(holidayApiFailure(errors.common_server_error));
        updateErrorPopoverInRedux(HOLIDAY_RESPONSE.FAILURE, errors.common_server_error);
      });
  };
export const updateHolidayDataThunk = (data) => (dispatch) => {
    dispatch(holidayApiStarted());
    setPointerEvent(true);
    updateHolidayData(data)
      .then((normalizedData) => {
        updatePostLoader(false);
        setPointerEvent(false);
        showToastPopover('Occasion Added Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.SUCCESS, true);
        if (!isEmpty(normalizedData)) {
          dispatch(holidayUpdateApiSuccess(normalizedData));
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(holidayApiFailure(errors.common_server_error));
        }
      })
      .catch((error) => {
        updatePostLoader(false);
        setPointerEvent(false);
        const { server_error } = store.getState().HolidayDetailsReducer;
        const errors = generatePostServerErrorMessage(error, server_error, HOLIDAY_LABELS);
        const errorData = {
          server_error: errors.state_error ? errors.state_error : [],
          common_server_error: errors.common_server_error
            ? errors.common_server_error
            : EMPTY_STRING,
        };
        dispatch(holidayApiFailure(errorData));
        if (isEmpty(errors.state_error)) {
          updateErrorPopoverInRedux(HOLIDAY_RESPONSE.FAILURE, errors.common_server_error);
        }
      });
  };
export const deleteHolidayDataThunk = (data) => (dispatch) => new Promise((resolve, reject) => {
    dispatch(holidayApiStarted());
    setPointerEvent(true);
    deleteHolidayData(data)
      .then(() => {
        updatePostLoader(false);
        setPointerEvent(false);
        showToastPopover('Occasion Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
        dispatch(holidayUpdateApiSuccess());
        resolve(true);
      })
      .catch((error) => {
        updatePostLoader(false);
        setPointerEvent(false);
        const { server_error } = store.getState().HolidayDetailsReducer;
        const errors = generatePostServerErrorMessage(error, server_error, HOLIDAY_LABELS);
        const errorData = {
          server_error: errors.state_error ? errors.state_error : [],
          common_server_error: errors.common_server_error
            ? errors.common_server_error
            : EMPTY_STRING,
        };
        dispatch(holidayApiFailure(errorData));
        if (isEmpty(errors.state_error)) {
          updateErrorPopoverInRedux(HOLIDAY_RESPONSE.FAILURE, errors.common_server_error);
        }
        reject(error);
      });
  });
