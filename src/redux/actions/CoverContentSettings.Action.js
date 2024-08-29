import { translate } from 'language/config';
import { accountCoverDetails, updateAccountCoverDetails } from '../../axios/apiService/coverContentSettings.apiService';
import {
  getInitialAccountCoverDetailsData,
  getUpdatedAccountCoverDetailsDataWithDocuments,
  getUpdatedServerDataFromStateData,
} from '../../containers/admin_settings/cover_content_settings/CoverContentSettings.utils';
import { store } from '../../Store';
import {
  generateApiErrorsAndHandleCatchBlock,
  setPointerEvent,
  setRole,
  updateFormPostOperationFeedback,
  updatePostLoader,
  setColorCode,
  setAdminProfile,
  setFlowCreatorProfile,
  setMemberProfile,
  setIsAccountProfileCompleted,
} from '../../utils/UtilityFunctions';
import { COVER_CONTENT_SETTINGS } from './ActionConstants';
import { nullCheck } from '../../utils/jsUtility';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';
import { FORM_FEEDBACK_TYPES } from '../../components/popovers/form_post_operation_feedback/FormPostOperationFeedback';
import { getUploadSignedUrlApi } from '../../axios/apiService/userProfile.apiService';
import { getAuthorizationDetailsApiThunk } from './Layout.Action';
import { roleActionAccountLocale } from './Actions';

export const coverContentSettingsApiStarted = () => {
  return {
    type: COVER_CONTENT_SETTINGS.STARTED,
  };
};

export const coverContentSettingsApiSuccess = (data) => {
  return {
    type: COVER_CONTENT_SETTINGS.SUCCESS,
    payload: data,
  };
};

export const coverContentSettingsApiFailure = (error) => {
  return {
    type: COVER_CONTENT_SETTINGS.FAILURE,
    payload: { error },
  };
};

export const coverContentSettingsApiCancel = () => {
  return {
    type: COVER_CONTENT_SETTINGS.CANCEL,
  };
};

export const coverContentSettingsSetState = (data) => (dispatch) => {
  dispatch({
    type: COVER_CONTENT_SETTINGS.SET_STATE,
    payload: data,
  });
  return Promise.resolve();
};

export const coverContentSettingsClearState = () => {
  return {
    type: COVER_CONTENT_SETTINGS.CLEAR,
  };
};

export const getAccountCoverDetailsApi = () => (dispatch) => {
  console.log('1230');
  dispatch(coverContentSettingsApiStarted());
  accountCoverDetails()
    .then((response) => {
      dispatch(coverContentSettingsApiSuccess({ serverData: response, ...getInitialAccountCoverDetailsData(response) }));
    })
    .catch((error) => {
      const { server_error } = store.getState().CoverContentSettingsReducer;
      const errorData = {
        error,
        server_error,
      };
      const apiFailureAction = {
        dispatch,
        action: coverContentSettingsApiFailure,
      };
      const errorPopoverData = {
        title: translate('error_popover_status.load_cover_settings_data'),
        subTitle: translate('error_popover_status.try_after_some_time'),
        isVisible: true,
        status: FORM_POPOVER_STATUS.SERVER_ERROR,
      };
      generateApiErrorsAndHandleCatchBlock(errorData, apiFailureAction, errorPopoverData);
    });
};

export const updateAccountCoverDetailsApi = (history, getUpdatedData, showOriginal) => (dispatch) => {
  const state = store.getState().CoverContentSettingsReducer;
  const data = getUpdatedAccountCoverDetailsDataWithDocuments(state, showOriginal);
  dispatch(coverContentSettingsApiStarted());
  setPointerEvent(true);
  updateAccountCoverDetails(data)
    .then((res) => {
      updatePostLoader(false);
      setPointerEvent(false);
      const updatedServerData = getUpdatedServerDataFromStateData(state.serverData, state);
      if (nullCheck(res.result.data, 'document_url_details.length', true)) {
        dispatch(coverContentSettingsSetState({
          acc_cover_pic_id: state.acc_cover_pic,
          acc_cover_pic_url: res.result.data.document_url_details[0].signedurl,
          enableButton: false,
          document_details: {},
        }));
        updatedServerData.document_url_details = res.result.data.document_url_details;
        getUpdatedData(res.result.data);
      }
      dispatch(coverContentSettingsApiSuccess({ enableButton: false, serverData: updatedServerData, acc_cover_pic_id: state.acc_cover_pic }));
      dispatch(getAuthorizationDetailsApiThunk(
        history,
        setRole,
        setColorCode,
        setAdminProfile,
        setFlowCreatorProfile,
        setMemberProfile,
        setIsAccountProfileCompleted,
        true, // isReload
        false,
        (value) => dispatch(roleActionAccountLocale(value)),
      ));
      updateFormPostOperationFeedback({
        isVisible: true,
        type: FORM_FEEDBACK_TYPES.SUCCESS,
        id: 'cover_settings',
        message: translate('admin_settings.notice_board_settings.cover_saved_successfully'),
      });
    })
    .catch((error) => {
      const { server_error } = store.getState().CoverContentSettingsReducer;
      const errorData = {
        error,
        server_error,
      };
      const apiFailureAction = {
        dispatch,
        action: coverContentSettingsApiFailure,
      };
      const errors = generateApiErrorsAndHandleCatchBlock(errorData, apiFailureAction, false, true);
      if (errors.state_error) {
        updateFormPostOperationFeedback({
          isVisible: true,
          type: FORM_FEEDBACK_TYPES.FAILURE,
          id: 'cover_settings',
          message: translate('error_popover_status.cover_settings_error'),
        });
      }
    });
};

export const getUploadSignedUrlApiThunk = (data, uploadDocumentToDMS, files, type, history) => (dispatch) => {
  getUploadSignedUrlApi(data)
    .then((response) => {
      dispatch(
        coverContentSettingsSetState({
          document_details: response,
        }),
      );
      uploadDocumentToDMS(response.file_metadata, files, type, history);
    })
    .catch((error) => {
      generateApiErrorsAndHandleCatchBlock({ error });
    });
};
