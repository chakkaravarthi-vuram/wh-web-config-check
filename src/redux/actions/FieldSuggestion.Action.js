import { isArray } from 'lodash';
import { FIELD_SUGGESTION } from './ActionConstants';
import { getFieldSuggestionApi } from '../../axios/apiService/fieldSuggestion.apiService';
import {
  generateGetServerErrorMessage,
} from '../../server_validations/ServerValidation';

const fieldSuggestionApiStarted = () => {
  return { type: FIELD_SUGGESTION.STARTED };
};

const fieldSuggestionApiSuccess = (suggestedFields) => {
  return {
    type: FIELD_SUGGESTION.SUCCESS,
    payload: suggestedFields,
  };
};

const fieldSuggestionApiFailure = (error) => {
  return {
    type: FIELD_SUGGESTION.FAILURE,
    payload: error,
  };
};

export const fieldSuggestionApiCancelAction = () => {
  return {
    type: FIELD_SUGGESTION.CANCEL,
  };
};

export const fieldSuggestionClear = () => {
  return {
    type: FIELD_SUGGESTION.CLEAR,
  };
};

// export const fieldSuggestionDataChange = (fieldSuggestionData) => (dispatch) =>
//   new Promise((resolve, reject) => {
//     console.log("fieldSuggestionData 1", fieldSuggestionData);
//     dispatch({
//       type: FIELD_SUGGESTION.DATA_CHANGE,
//       payload: fieldSuggestionData,
//     });
//     return resolve();
//   });

export const fieldSuggestionDataChange = (fieldSuggestionData) => (
  dispatch,
) => {
  console.log('fieldSuggestionDataChange313');
  dispatch({
    type: FIELD_SUGGESTION.DATA_CHANGE,
    payload: fieldSuggestionData,
  });
  return Promise.resolve();
};

export const getFieldSuggestionDataThunk = (data) => (dispatch) => {
  dispatch(fieldSuggestionApiStarted());
  const params = {
    text: data,
  };
  getFieldSuggestionApi({ params })
    .then((normalizedData) => {
      console.log('field suggestion', normalizedData);
      if (isArray(normalizedData)) {
        dispatch(fieldSuggestionApiSuccess(normalizedData));
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(fieldSuggestionApiFailure(errors.common_server_error));
      }
    })
    .catch((error) => {
      console.log('field suggestion error', error);
      const errors = generateGetServerErrorMessage(error);
      dispatch(fieldSuggestionApiFailure(errors.common_server_error));
      // updateErrorPopoverInRedux(
      //   "FAlure",
      //   errors.common_server_error
      // );
    });
};
