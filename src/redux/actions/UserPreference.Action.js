import { isEmpty } from 'lodash';
import { translateFunction } from 'utils/jsUtility';
import { USER_PREFERENCE } from './ActionConstants';
import {
  getUserPreferenceData,
  updateUserPreferenceData,
} from '../../axios/apiService/userPreference.apiService';
import {
  setPointerEvent,
  updatePostLoader,
  updateErrorPopoverInRedux,
  setRole,
  setColorCode,
  setAdminProfile,
  setFlowCreatorProfile,
  setMemberProfile,
  setIsAccountProfileCompleted,
  showToastPopover,
} from '../../utils/UtilityFunctions';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { L_C_FORM } from '../../containers/admin_settings/language_and_calendar/LanguagesAndCalendar.strings';
import { getAuthorizationDetailsApiThunk } from './Layout.Action';
import { roleActionAccountLocale } from './Actions';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';

const userPreferenceApiStarted = () => {
  return {
    type: USER_PREFERENCE.STARTED,
  };
};

const userPreferenceApiSuccess = (userPreferenceData) => {
  return {
    type: USER_PREFERENCE.SUCCESS,
    payload: { ...userPreferenceData },
  };
};

export const userPreferenceDataChangeAction = (userPreferenceData) => (dispatch) => {
  dispatch({
    type: USER_PREFERENCE.DATA_CHANGE,
    payload: { ...userPreferenceData },
  });
  return Promise.resolve();
};

const userPreferenceApiFailure = (error) => {
  return {
    type: USER_PREFERENCE.FAILURE,
    payload: error,
  };
};

export const userPreferenceApiCancelAction = () => {
  return {
    type: USER_PREFERENCE.CANCEL,
  };
};

export const clearUserPreferenceDataAction = () => {
  return {
    type: USER_PREFERENCE.CLEAR,
  };
};

export const userPreferencePostsApiCancelAction = () => {
  return {
    type: USER_PREFERENCE._POST_CANCEL,
  };
};

export const getUserPreferenceDataThunk = (getCancelToken) => (dispatch) => {
  dispatch(userPreferenceApiStarted());
  getUserPreferenceData(getCancelToken)
    .then((normalizedData) => {
      if (!isEmpty(normalizedData)) {
        dispatch(userPreferenceApiSuccess(normalizedData));
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(userPreferenceApiFailure(errors.common_server_error));
      }
    })
    .catch((error) => {
      updateErrorPopoverInRedux(L_C_FORM.UPDATE_FAILURE, error.common_server_error);
      const errors = generateGetServerErrorMessage(error);
      dispatch(userPreferenceApiFailure(errors.common_server_error));
    });
};

export const updateUserPreferenceDataThunk = (data, history, t = translateFunction) => (dispatch) => {
  dispatch(userPreferenceApiStarted());
  updateUserPreferenceData(data)
    .then((normalizedData) => {
      if (!isEmpty(normalizedData)) {
        updatePostLoader(false);
        setPointerEvent(false);
        console.log('normalizedData updateUserPreferenceDataThunk', normalizedData);
        dispatch(userPreferenceApiSuccess(normalizedData));
        dispatch(getAuthorizationDetailsApiThunk(
          history,
          setRole,
          setColorCode,
          setAdminProfile,
          setFlowCreatorProfile,
          setMemberProfile,
          setIsAccountProfileCompleted,
          true, // isReload
          true, // isFromProfileUpdate
          (value) => dispatch(roleActionAccountLocale(value)),
        ));
        // const url = response.data.result.data.file_url;
        showToastPopover(
          L_C_FORM.SUCCESSFUL_UPDATE(t).title,
          L_C_FORM.SUCCESSFUL_UPDATE(t).subTitle,
          FORM_POPOVER_STATUS.SUCCESS,
          true,
        );
        // localStorage.setItem('application_language', data?.pref_locale);
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(userPreferenceApiFailure(errors.common_server_error));
      }
    })
    .catch((error) => {
      updatePostLoader(false);
      setPointerEvent(false);
      // const errors = generatePostServerErrorMessage(error, server_error, LANGUAGE_SETTINGS_LABELS);
      // this.setState({
      //   server_error: errors.state_error ? errors.state_error : [],
      //   common_server_error: errors.common_server_error
      //     ? errors.common_server_error
      //     : EMPTY_STRING,
      //   is_data_loading: false,
      // });
      // if (jsUtils.isEmpty(errors.state_error)) {
      //   updateErrorPopoverInRedux(L_C_FORM.UPDATE_FAILURE, errors.common_server_error);
      // }
      dispatch(userPreferenceApiFailure(error.common_server_error));
    });
};
