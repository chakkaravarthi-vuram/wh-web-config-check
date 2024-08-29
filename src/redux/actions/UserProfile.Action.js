import { USER_PROFILE } from './ActionConstants';

export const userProfileStartedThunk = () => {
  return {
    type: USER_PROFILE.STARTED,
  };
};

export const userProfileSuccessThunk = () => {
  return {
    type: USER_PROFILE.STARTED,
  };
};

export const userProfileFailureThunk = (error) => {
  return {
    type: USER_PROFILE.FAILURE,
    payload: { error },
  };
};

export const userProfileCancelThunk = () => {
  return {
    type: USER_PROFILE.CANCEL,
  };
};

export const userProfileSetStateThunk = (data) => (dispatch) => {
  dispatch({
    type: USER_PROFILE.SET_STATE,
    payload: data,
  });
  return Promise.resolve();
};

export default userProfileSetStateThunk;
