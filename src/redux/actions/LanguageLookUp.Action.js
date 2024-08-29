import { isEmpty } from 'lodash';
import { LANGUAGE_LOOK_UP } from './ActionConstants';
import { getLanguageLookupData } from '../../axios/apiService/languageLookUp.apiService';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';

const languageLookUpApiStarted = () => {
 return {
  type: LANGUAGE_LOOK_UP.STARTED,
};
};

const languageLookUpApiSuccess = (lookupData) => {
 return {
  type: LANGUAGE_LOOK_UP.SUCCESS,
  payload: [...lookupData],
};
};

export const languageLookUpDataChangeAction = (lookupData) => {
 return {
  type: LANGUAGE_LOOK_UP.DATA_CHANGE,
  payload: [...lookupData],
};
};

const languageLookUpApiFailure = (error) => {
 return {
  type: LANGUAGE_LOOK_UP.FAILURE,
  payload: error,
};
};

export const languageLookUpApiCancelAction = () => {
 return {
  type: LANGUAGE_LOOK_UP.CANCEL,
};
};

export const clearLanguageLookUpDataAction = () => {
 return {
  type: LANGUAGE_LOOK_UP.CLEAR,
};
};

export const getLanguageLookupDataThunk = (params) => (dispatch) => {
    dispatch(languageLookUpApiStarted());
    getLanguageLookupData(params)
      .then((normalizedData) => {
        if (!isEmpty(normalizedData)) {
          dispatch(languageLookUpApiSuccess(normalizedData));
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(languageLookUpApiFailure(errors.common_server_error));
        }
      })
      .catch((error) => {
        const errors = generateGetServerErrorMessage(error);
        dispatch(languageLookUpApiFailure(errors.common_server_error));
      });
  };
