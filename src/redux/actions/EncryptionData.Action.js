import { DATA_ENCRYTION_REDUCER_CONSTANTS } from './ActionConstants';

export const setEncryptionData = (data) => (dispatch) => {
  dispatch({
    type: DATA_ENCRYTION_REDUCER_CONSTANTS.DATA_SUCCESS,
    payload: data,
  });
  return Promise.resolve();
};

export const setEncryptionParams = (params) => (dispatch) => {
  dispatch({
    type: DATA_ENCRYTION_REDUCER_CONSTANTS.PARAMS_SUCCESS,
    payload: params,
  });
  return Promise.resolve();
};

export const clearEncryptionData = () => {
  return {
    type: DATA_ENCRYTION_REDUCER_CONSTANTS.CLEAR,
  };
};

export default setEncryptionData;
