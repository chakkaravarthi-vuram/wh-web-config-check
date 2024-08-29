import { getSignedUrlFromDocumentUrlDetails } from 'utils/profileUtils';
import { translate } from 'language/config';
import { ACCOUNT_SETTINGS } from './ActionConstants';
import {
  setPointerEvent,
  updatePostLoader,
  updateErrorPopoverInRedux,
  updateFormPostOperationFeedback,
  consturctTheme,
  getFileNameFromServer,
} from '../../utils/UtilityFunctions';
import { generateGetServerErrorMessage } from '../../server_validations/ServerValidation';
import { accountMainDetails, getIndustryList, updateAccountMainDetails } from '../../axios/apiService/accountSettings.apiService';
import { getStateToUpdateFromResponse } from '../../containers/admin_settings/account_settings/AccountSettings.validate.schema';
import { ACCOUNT_SETTINGS_FORM } from '../../containers/admin_settings/account_settings/AccountSettings.strings';
import { getUploadSignedUrlApi } from '../../axios/apiService/userProfile.apiService';
import { FORM_FEEDBACK_TYPES } from '../../components/popovers/form_post_operation_feedback/FormPostOperationFeedback';
import jsUtils from '../../utils/jsUtility';
import { FILE_UPLOAD_STATUS } from '../../utils/Constants';

export const accountSettingApiStarted = () => {
  return {
    type: ACCOUNT_SETTINGS.STARTED,
  };
};

export const accountSettingApiSuccess = (data) => {
  return {
  type: ACCOUNT_SETTINGS.SUCCESS,
  payload: data,
  };
};

export const accountSettingSetState = (data) => (dispatch) => {
  dispatch({
    type: ACCOUNT_SETTINGS.DATA_CHANGE,
    payload: data,
  });
  return Promise.resolve();
};

export const getIndustryListtInfiniteScrollStartedAction = () => {
  return {
  type: ACCOUNT_SETTINGS.GET_INDUSTRY_LIST_INFINITE_SCROLL_STARTED,
  };
};

export const accountSettingApiFailure = (error) => {
  return {
    type: ACCOUNT_SETTINGS.FAILURE,
    payload: { error },
  };
};

export const accountSettingApiCancel = () => {
  return {
    type: ACCOUNT_SETTINGS.CANCEL,
  };
};

const throwError = (err, isGet) => {
  if (isGet) {
    const getError = generateGetServerErrorMessage(err);
    accountSettingSetState({
        common_server_error: getError.common_server_error,
    });
    return accountSettingApiFailure(getError.common_server_error);
  }
  return null;
};

  export const getIndustryListApiThunk = () => (dispatch) => {
  dispatch(accountSettingApiStarted());
  console.log('API START CALL DONE');
  console.log('API CALL B4');
  getIndustryList()
  .then((response) => {
    if (response) {
      console.log('INDUSTRY LIST', response);
    const industries = response.industries.map((obj) => {
      obj.label = obj.industry_type;
      obj.value = obj.industry_type; // Assign new key
      delete obj.industry_type; // Delete old key
      return obj;
    });

    console.log('INDUSTRY HAS MORE');
    dispatch(
      accountSettingSetState({
        industry_list: industries,
      }),
    );
    console.log('INDUSTRY LIST updated ARRAY');
    }
  }).catch((err) => {
    console.log('API CALL ERROR', err);
    dispatch(throwError(err, true));
  });
};

export const accountSettingClearState = () => {
  return {
    type: ACCOUNT_SETTINGS.CLEAR,
  };
};

export const accountMainDetailsApiThunk = (currentColorScheme, setColorScheme) => (dispatch) => {
  dispatch(accountSettingApiStarted());
  accountMainDetails()
    .then((response) => {
      const state_to_update = getStateToUpdateFromResponse(response);
      const { industry_type, theme, is_default_theme } = response;
      const colorScheme = theme?.color ? consturctTheme(theme.color) : currentColorScheme;
      console.log('theme responseSTATe', theme, 'response', response, 'colorScheme', colorScheme);
      let faviconDocument = {};
      response && response.document_url_details.forEach((document) => {
        if (response.acc_favicon === document.document_id) {
          if (document && document.original_filename) {
            const documenDetails = {
              fileName: getFileNameFromServer(document.original_filename),
              file: {
                name: getFileNameFromServer(document.original_filename),
                type: document.original_filename.content_type,
                url: document.signedurl,
                size: document.original_filename.file_size,
              },
              status: FILE_UPLOAD_STATUS.SUCCESS,
              fileId: document.document_id,
              url: document.signedurl,
            };
            faviconDocument = documenDetails;
          }
        }
      });
      dispatch(
        accountSettingSetState({
          ...state_to_update,
          is_data_loading: false,
          acc_logo_pic_id: !jsUtils.isEmpty(response.document_url_details) ? response.document_url_details[0]._id : null,
          industry_type,
          acc_initial_logo: getSignedUrlFromDocumentUrlDetails(response.document_url_details, response.acc_logo),
          is_default_theme: !jsUtils.isUndefined(is_default_theme) ? is_default_theme : true,
          is_default_theme_initial: !jsUtils.isUndefined(is_default_theme) ? is_default_theme : true,
          admin_theme: colorScheme,
          faviconDocument: !jsUtils.isEmpty(faviconDocument) ? [faviconDocument] : [],
        }),
      );
      setColorScheme(colorScheme);
    })
    .catch((error) => {
      const errors = generateGetServerErrorMessage(error);
      dispatch(
        accountSettingApiFailure({
          common_server_error: errors.common_server_error,
        }),
      );
      updateErrorPopoverInRedux(ACCOUNT_SETTINGS_FORM.UPDATE_FAILURE, errors.common_server_error);
    });
};

export const updateAccountMainDetailsApiThunk = (data, getUpdatedData, updateError, setColorScheme) => (
  dispatch,
) => {
  dispatch(accountSettingApiStarted());
  setPointerEvent(true);
  updateAccountMainDetails(data)
    .then((res) => {
      const { theme } = data;
      const color_scheme = consturctTheme(data?.theme?.color);
      console.log('response updateAccountMainDetailsApiThunk', data, 'theme', theme, 'color_scheme', color_scheme);
      setColorScheme(color_scheme);
      dispatch(
        accountSettingSetState({
          is_data_loading: false,
          account_settings: getUpdatedData(res.result.data),
          enable_button: false,
          is_default_theme_initial: data.is_default_theme,
          admin_theme: color_scheme,
        }),
      ).then(() => {
        dispatch(accountSettingApiSuccess());

        updatePostLoader(false);
        setPointerEvent(false);
        updateFormPostOperationFeedback({
          isVisible: true,
          type: FORM_FEEDBACK_TYPES.SUCCESS,
          id: 'account_settings',
          message: translate('error_popover_status.save_account_settings'),
        });
      });
    })
    .catch((error) => {
      dispatch(accountSettingApiFailure());
      updateFormPostOperationFeedback({
        isVisible: true,
        type: FORM_FEEDBACK_TYPES.FAILURE,
        id: 'account_settings',
        message: translate('error_popover_status.save_account_settings_error'),
      });
      updateError(error);
      updatePostLoader(false);
      setPointerEvent(false);
    });
};

export const getUploadSignedUrlApiThunk = (data, uploadDocumentToDMS, files) => (dispatch) => {
  dispatch(accountSettingApiStarted());
  getUploadSignedUrlApi(data).then(async (response) => {
   await dispatch(
      accountSettingSetState({

        document_details: response,
      }),
    );
    uploadDocumentToDMS(response.file_metadata, files);
  });
};
