import { isEmpty } from 'lodash';
import { LOCALE_LOOK_UP } from './ActionConstants';
import { getLocaleLookUpData } from '../../axios/apiService/localeLookUp.apiService';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';

const localeLookUpApiStarted = () => {
 return {
  type: LOCALE_LOOK_UP.STARTED,
};
};

const localeLookUpApiSuccess = (lookupData) => {
 return {
  type: LOCALE_LOOK_UP.SUCCESS,
  payload: [...lookupData],
};
};

export const localeLookUpDataChangeAction = (lookupData) => {
 return {
  type: LOCALE_LOOK_UP.DATA_CHANGE,
  payload: [...lookupData],
};
};

const localeLookUpApiFailure = (error) => {
 return {
  type: LOCALE_LOOK_UP.FAILURE,
  payload: error,
};
};

export const localeLookUpApiCancelAction = () => {
 return {
  type: LOCALE_LOOK_UP.CANCEL,
};
};

export const clearLocaleLookUpDataAction = () => {
 return {
  type: LOCALE_LOOK_UP.CLEAR,
};
};

export const getLocaleLookUpDataThunk = (params) => (dispatch) => {
    dispatch(localeLookUpApiStarted());
    getLocaleLookUpData(params)
      .then((normalizedData) => {
        console.log('normalizedData', normalizedData);
        if (!isEmpty(normalizedData)) {
          dispatch(localeLookUpApiSuccess(normalizedData));
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(localeLookUpApiFailure(errors.common_server_error));
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(localeLookUpApiFailure(errors.common_server_error));
      });
  };
