import { isEmpty } from 'lodash';
import { translate } from 'language/config';
import { LANGAUGE_AND_CALENDAR_ADMIN } from './ActionConstants';
import {
  getLanguageAndCalendarData,
  updateLanguageAndCalendarData,
} from '../../axios/apiService/languageAndCalendarAdmin.apiService';
import {
  setPointerEvent,
  updatePostLoader,
  updateErrorPopoverInRedux,
  updateFormPostOperationFeedback,
  setRole,
  setColorCode,
  setAdminProfile,
  setFlowCreatorProfile,
  setMemberProfile,
  setIsAccountProfileCompleted,
  setLocale,
  setPriamryLocale,
} from '../../utils/UtilityFunctions';
import {
  generateGetServerErrorMessage,
  generatePostServerErrorMessage,
} from '../../server_validations/ServerValidation';
import { L_C_FORM } from '../../containers/admin_settings/language_and_calendar/LanguagesAndCalendar.strings';
import { ADMIN_SETTINGS_LABELS } from '../../containers/admin_settings/AdminSettings.strings';
import { store } from '../../Store';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { FORM_FEEDBACK_TYPES } from '../../components/popovers/form_post_operation_feedback/FormPostOperationFeedback';
import { getAuthorizationDetailsApiThunk } from './Layout.Action';

const languageAndCalendarApiStarted = () => {
  return {
    type: LANGAUGE_AND_CALENDAR_ADMIN.STARTED,
  };
};

const languageAndCalendarApiSuccess = (languageAndCalendarData) => {
  return {
    type: LANGAUGE_AND_CALENDAR_ADMIN.SUCCESS,
    payload: { ...languageAndCalendarData },
  };
};

export const languageAndCalendarDataChangeAction =
  (languageAndCalendarData) => (dispatch) => {
    dispatch({
      type: LANGAUGE_AND_CALENDAR_ADMIN.DATA_CHANGE,
      payload: { ...languageAndCalendarData },
    });
    return Promise.resolve();
  };

const languageAndCalendarApiFailure = (error) => {
  return {
    type: LANGAUGE_AND_CALENDAR_ADMIN.FAILURE,
    payload: error,
  };
};

export const languageAndCalendarApiCancelAction = () => {
  return {
    type: LANGAUGE_AND_CALENDAR_ADMIN.CANCEL,
  };
};

export const clearLanguageAndCalendarDataAction = () => {
  return {
    type: LANGAUGE_AND_CALENDAR_ADMIN.CLEAR,
  };
};

export const languageAndCalendarPostsApiCancelAction = () => {
  return {
    type: LANGAUGE_AND_CALENDAR_ADMIN._POST_CANCEL,
  };
};

export const getLanguageAndCalendarDataThunk = () => (dispatch) => {
  dispatch(languageAndCalendarApiStarted());
  getLanguageAndCalendarData()
    .then((normalizedData) => {
      if (!isEmpty(normalizedData)) {
        dispatch(languageAndCalendarApiSuccess(normalizedData));
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(languageAndCalendarApiFailure(errors.common_server_error));
      }
    })
    .catch((error) => {
      const errors = generateGetServerErrorMessage(error);
      dispatch(languageAndCalendarApiFailure(errors.common_server_error));
      updateErrorPopoverInRedux(
        L_C_FORM.UPDATE_FAILURE,
        error.common_server_error,
      );
    });
};
export const updateLanguageAndCalendarDataThunk =
  (data, history) => (dispatch) => {
    const { server_error } = store.getState().LanguageAndCalendarAdminReducer;
    dispatch(languageAndCalendarApiStarted());
    setPointerEvent(true);
    updateLanguageAndCalendarData(data)
      .then(async (normalizedData) => {
        updatePostLoader(false);
        setPointerEvent(false);
        if (!isEmpty(normalizedData)) {
          dispatch(
            languageAndCalendarApiSuccess({
              language_settings: normalizedData,
            }),
          );
          dispatch(
            getAuthorizationDetailsApiThunk(
              history,
              setRole,
              setColorCode,
              setAdminProfile,
              setFlowCreatorProfile,
              setMemberProfile,
              setIsAccountProfileCompleted,
              true, // isReload
              true, // isFromProfileUpdate
              setLocale,
              false,
              setPriamryLocale,
            ),
          );
          updateFormPostOperationFeedback({
            isVisible: true,
            type: FORM_FEEDBACK_TYPES.SUCCESS,
            id: 'language_and_calender_settings',
            message: translate('error_popover_status.language_settings_saved'),
          });
        } else {
          const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(languageAndCalendarApiFailure(errors.common_server_error));
        }
      })
      .catch((error) => {
        updatePostLoader(false);
        setPointerEvent(false);
        console.log('languageAndCalendarApiFailure error', error);
        const errors = generatePostServerErrorMessage(
          error,
          server_error,
          ADMIN_SETTINGS_LABELS,
        );
        const errorData = {
          server_error: errors.state_error ? errors.state_error : [],
          common_server_error: errors.common_server_error
            ? errors.common_server_error
            : EMPTY_STRING,
        };
        if (isEmpty(errors.state_error)) {
          updateErrorPopoverInRedux(
            L_C_FORM.UPDATE_FAILURE,
            errors.common_server_error,
          );
        }
        dispatch(languageAndCalendarApiFailure(errorData));
      });
  };
