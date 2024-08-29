import { has } from 'lodash';
import { CHANGE_PASSWORD } from './ActionConstants';
import { changePassword } from '../../axios/apiService/changePassword.apiService';
import {
  setPointerEvent,
  updatePostLoader,
  showToastPopover,
} from '../../utils/UtilityFunctions';
import { CHANGE_PASSWORD_SUCCESSFUL_UPDATE } from '../../containers/user_settings/change_password/ChangePassword.strings';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';

export const setStateThunk = (data) => (dispatch) => {
  dispatch({
    type: CHANGE_PASSWORD.SET_STATE,
    payload: data,
  });
  return Promise.resolve();
};

export const clearStateDataThunk = () => {
  return {
    type: CHANGE_PASSWORD.CLEAR,
  };
};

export const changePasswordThunk = (data, updateError) => (dispatch) => {
  changePassword(data)
    .then(({ headers }) => {
      dispatch(clearStateDataThunk());
      if (has(headers['csrf-token'])) localStorage.setItem('csrf_token', headers['csrf-token']);
      updatePostLoader(false);
      setPointerEvent(false);
      showToastPopover(
        CHANGE_PASSWORD_SUCCESSFUL_UPDATE.title,
        CHANGE_PASSWORD_SUCCESSFUL_UPDATE.subTitle,
        FORM_POPOVER_STATUS.SUCCESS,
        true,
      );
    })
    .catch((error) => {
      updateError(error);
      updatePostLoader(false);
      setPointerEvent(false);
    });
};
export default changePasswordThunk;
