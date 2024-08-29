import { isEmpty } from 'lodash';
import { TIME_ZONE_LOOK_UP } from './ActionConstants';
import { getTimeZoneLookupData } from '../../axios/apiService/timeZoneLookUp.apiService';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';

const timeZoneLookUpApiStarted = () => {
 return {
  type: TIME_ZONE_LOOK_UP.STARTED,
};
};

const timeZoneLookUpApiSuccess = (lookupData) => {
 return {
  type: TIME_ZONE_LOOK_UP.SUCCESS,
  payload: [...lookupData],
};
};

export const timeZoneLookUpDataChangeAction = (lookupData) => {
 return {
  type: TIME_ZONE_LOOK_UP.DATA_CHANGE,
  payload: [...lookupData],
};
};

const timeZoneLookUpApiFailure = (error) => {
 return {
  type: TIME_ZONE_LOOK_UP.FAILURE,
  payload: error,
};
};

export const timeZoneLookUpApiCancelAction = () => {
 return {
  type: TIME_ZONE_LOOK_UP.CANCEL,
};
};

export const clearTimeZoneLookUpDataAction = () => {
 return {
  type: TIME_ZONE_LOOK_UP.CLEAR,
};
};

export const getTimeZoneLookUpDataThunk = (params) => (dispatch) => {
    dispatch(timeZoneLookUpApiStarted());
    getTimeZoneLookupData(params)
      .then((normalizedData) => {
        if (!isEmpty(normalizedData)) {
          dispatch(timeZoneLookUpApiSuccess(normalizedData));
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(timeZoneLookUpApiFailure(errors.common_server_error));
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(timeZoneLookUpApiFailure(errors.common_server_error));
      });
  };
