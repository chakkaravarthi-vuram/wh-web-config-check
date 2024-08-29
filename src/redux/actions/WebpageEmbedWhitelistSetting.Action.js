import { isEmpty, isArray } from 'lodash';
import { WEBPAGE_EMBED_WHITELIST } from './ActionConstants';
import {
  setPointerEvent,
  updatePostLoader,
  updateErrorPopoverInRedux,
  showToastPopover,
} from '../../utils/UtilityFunctions';
import {
  generateGetServerErrorMessage,
  generatePostServerErrorMessage,
} from '../../server_validations/ServerValidation';
import { store } from '../../Store';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { deleteWebpagefromWhitelist, getWebpageWhitelist, saveNewWebpageEmbedWhitelistData } from '../../axios/apiService/webpageEmbedConfiguration.apiService';
import { getWebpageEmbedResponseStrings, getWebpageEmbedStrings } from '../../containers/admin_settings/other_settings/webpage_embed_settings/WebpageEmbedSettings.strings';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';

const webpageEmbedWhitelistApiStarted = () => {
  return {
    type: WEBPAGE_EMBED_WHITELIST.STARTED,
  };
};

const webpageEmbedWhitelistApiSuccess = (url) => {
  return {
    type: WEBPAGE_EMBED_WHITELIST.SUCCESS,
    payload: url,
  };
};

export const webpageEmbedWhitelistDataChange = (data) => (dispatch) => {
  dispatch({
    type: WEBPAGE_EMBED_WHITELIST.DATA_CHANGE,
    payload: { ...data },
  });
  return Promise.resolve();
};

const webpageEmbedWhitelistApiFailure = (error) => (dispatch) => {
  dispatch({
    type: WEBPAGE_EMBED_WHITELIST.FAILURE,
    payload: error,
  });
  return Promise.resolve();
};

export const webpageEmbedWhitelistApiCancelAction = () => {
  return {
    type: WEBPAGE_EMBED_WHITELIST.CANCEL,
  };
};

export const getWebpageEmbedWhitelistDataThunk = (params) => (dispatch) => {
  dispatch(webpageEmbedWhitelistApiStarted());
  const WEBPAGE_EMBED_RESPONSE_STRING = getWebpageEmbedResponseStrings();
  getWebpageWhitelist(params)
    .then((normalizedData) => {
      if (isArray(normalizedData)) {
        dispatch(webpageEmbedWhitelistApiSuccess(normalizedData));
      } else {
        const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(webpageEmbedWhitelistApiFailure(errors));
      }
    })
    .catch((error) => {
      const errors = generateGetServerErrorMessage(error);
      dispatch(webpageEmbedWhitelistApiFailure(errors));
      updateErrorPopoverInRedux(WEBPAGE_EMBED_RESPONSE_STRING.FAILURE, errors.common_server_error);
    });
};
export const saveNewWebpageEmbedWhitelistDataThunk = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(webpageEmbedWhitelistApiStarted());
  setPointerEvent(true);
  const WEBPAGE_EMBED_RESPONSE_STRING = getWebpageEmbedResponseStrings();
  saveNewWebpageEmbedWhitelistData(data)
    .then(() => {
      updatePostLoader(false);
      setPointerEvent(false);
      showToastPopover('Webpage Embed URL Added Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.SUCCESS, true);
      dispatch(webpageEmbedWhitelistApiSuccess());
      resolve(true);
    })
    .catch((error) => {
      updatePostLoader(false);
      setPointerEvent(false);
      const { server_error } = store.getState().WebpageEmbedWhitelistSettingReducer;
      const WEBPAGE_EMBED_CONFIG_STRINGS = getWebpageEmbedStrings();

      const errors = generatePostServerErrorMessage(error, server_error, { [WEBPAGE_EMBED_CONFIG_STRINGS.NEW_EMBED_URL_INPUT.ID]: WEBPAGE_EMBED_CONFIG_STRINGS.NEW_EMBED_URL_INPUT.LABEL });
      const errorData = {
        server_error: errors.state_error ? errors.state_error : [],
        common_server_error: errors.common_server_error
          ? errors.common_server_error
          : EMPTY_STRING,
      };
      dispatch(webpageEmbedWhitelistApiFailure(errorData)).then(() => {
        if (isEmpty(errors.state_error)) {
          updateErrorPopoverInRedux(WEBPAGE_EMBED_RESPONSE_STRING.FAILURE, errors.common_server_error);
        }
        reject(errorData);
      });
    });
});

export const deleteWebpageEmbedWhitelistDataThunk = (data) => (dispatch) => new Promise((resolve, reject) => {
  dispatch(webpageEmbedWhitelistApiStarted());
  setPointerEvent(true);
  const WEBPAGE_EMBED_RESPONSE_STRING = getWebpageEmbedResponseStrings();
  deleteWebpagefromWhitelist(data)
    .then(() => {
      updatePostLoader(false);
      setPointerEvent(false);
      showToastPopover('Webpage Embed URL Deleted Successfully', EMPTY_STRING, FORM_POPOVER_STATUS.DELETE, true);
      dispatch(webpageEmbedWhitelistApiSuccess());
      resolve(true);
    })
    .catch((error) => {
      updatePostLoader(false);
      setPointerEvent(false);
      const WEBPAGE_EMBED_CONFIG_STRINGS = getWebpageEmbedStrings();
      const { server_error } = store.getState().WebpageEmbedWhitelistSettingReducer;
      const errors = generatePostServerErrorMessage(error, server_error, { [WEBPAGE_EMBED_CONFIG_STRINGS.NEW_EMBED_URL_INPUT.ID]: WEBPAGE_EMBED_CONFIG_STRINGS.NEW_EMBED_URL_INPUT.LABEL });
      const errorData = {
        server_error: errors.state_error ? errors.state_error : [],
        common_server_error: errors.common_server_error
          ? errors.common_server_error
          : EMPTY_STRING,
      };
      dispatch(webpageEmbedWhitelistApiFailure(errorData));
      if (isEmpty(errors.state_error)) {
        updateErrorPopoverInRedux(WEBPAGE_EMBED_RESPONSE_STRING.FAILURE, errors.common_server_error);
      }
      reject(error);
    });
});
