import { validateForgetPasswordApi } from '../../axios/apiService/resetPassword.apiService';
import { setPointerEvent, updatePostLoader } from '../../utils/UtilityFunctions';
import { RESET_PASSWORD } from './ActionConstants';

export const resetPasswordStartedThunk = () => {
  return {
    type: RESET_PASSWORD.STARTED,
  };
};

export const resetPasswordSuccessThunk = () => {
  return {
    type: RESET_PASSWORD.SUCCESS,
  };
};

export const resetPasswordFailureThunk = (error) => {
  return {
    type: RESET_PASSWORD.FAILURE,
    payload: { error },
  };
};

export const resetPasswordCancelThunk = () => {
  return {
    type: RESET_PASSWORD.CANCEL,
  };
};

export const resetPasswordSetStateThunk = (data) => (dispatch) => {
  dispatch({
    type: RESET_PASSWORD.SET_STATE,
    payload: data,
  });
  return Promise.resolve();
};

export const validateForgetPasswordApiThunk = (data) => async (dispatch) =>
  new Promise((resolve) => {
    setPointerEvent(true);
    updatePostLoader(true);
    validateForgetPasswordApi(data)
      .then((response) => {
        if ((response)) {
          dispatch(resetPasswordSetStateThunk({ validLink: true, loading: false }));
        } else {
          dispatch(resetPasswordSetStateThunk({ validLink: false, loading: false }));
        }
        setPointerEvent(false);
        updatePostLoader(false);
        resolve(response);
      })
      .catch(() => {
        setPointerEvent(false);
        updatePostLoader(false);
        dispatch(resetPasswordSetStateThunk({ validLink: false, loading: false }));
        resolve();
      });
  });

export default resetPasswordSetStateThunk;
