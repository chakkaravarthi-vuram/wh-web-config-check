import { get, has, isEmpty } from 'lodash';
import { store } from 'Store';
import { USER_SETTINGS } from './ActionConstants';
import { showToastPopover } from '../../utils/UtilityFunctions';
import i18next, { translate } from '../../language/config';
import { FORM_POPOVER_STATUS } from '../../utils/Constants';
import { decryptApiKey, deleteApiKeyDetails, generateApiKey, getListAllApiKeys, updateApiKeyDetails } from '../../axios/apiService/userSettings.apiService';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { API_KEY_STRINGS } from '../../containers/user_settings/UserSettings.strings';
import { cloneDeep } from '../../utils/jsUtility';

export const userSettingsDataChange = (value) => {
 return {
  type: USER_SETTINGS.DATA_CHANGE,
  payload: value,
};
};

export const userSettingsClear = () => {
 return {
  type: USER_SETTINGS.CLEAR,
};
};

export const getListAllApiKeysThunk =
  (setCancelToken) => (dispatch) =>
    new Promise((resolve, reject) => {
        dispatch(
          userSettingsDataChange({
            isLoadingApiKeys: true,
            isErrorInLoadingApiKeys: false,
            // tab_index: USER_SETTINGS_TAB_INDEX.SECURITY,
          }),
        );
        getListAllApiKeys(setCancelToken)
        .then((response) => {
          console.log('responsegetListAllApiKeysThunk', response);
            dispatch(
              userSettingsDataChange({
                isLoadingApiKeys: false,
                apiKeyList: response,
                // tab_index: USER_SETTINGS_TAB_INDEX.SECURITY,
              }),
            );
            resolve(response);
          // }
        })
        .catch((error) => {
          console.log('errorgetListAllApiKeysThunk', error);
          if (has(error, ['code']) && error.code === 'ERR_CANCELED') return;
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.refresh_try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
          dispatch(
            userSettingsDataChange({
              isLoadingApiKeys: false,
              isErrorInLoadingApiKeys: true,
            }),
          );
          resolve(false);
          reject(error);
        });
    });

export const generateApiKeyThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    const { error_list } = cloneDeep(store.getState().UserSettingsReducer);
    generateApiKey(params)
      .then((response) => {
        console.log('response generateApiKey', response);
        if (!isEmpty(response)) {
          dispatch(
            userSettingsDataChange({
              isEditApiKeyOpen: false,
              apiKeyData: response,
              isViewApiKeyOpen: true,
              isSingleCardClicked: false,
            }),
          );
          dispatch(
            getListAllApiKeysThunk(),
          );
          // dispatch(
          //   userSettingsDataChange({
          //     isSingleCardClicked: false,
          //   }),
          // );
        }
        resolve(response);
      })
      .catch((error) => {
        console.log('error generateApiKey', error);
        const errorData = get(
          error,
          ['response', 'data', 'errors', 0],
          {},
        );
        if (errorData.type === 'exist' && errorData.field === 'name') {
          dispatch(
            userSettingsDataChange({
              error_list: {
                ...error_list,
                descriptive_name: API_KEY_STRINGS(i18next.t).NAME_EXIST_ERROR,
              },
            }),
          );
        } else {
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.refresh_try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        reject(error);
      });
  });

export const updateApiKeyDetailsThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    const { error_list } = cloneDeep(store.getState().UserSettingsReducer);
    updateApiKeyDetails(params)
      .then((response) => {
        console.log('response updateApiKeyDetails', response);
        if (!isEmpty(response)) {
          dispatch(
            userSettingsDataChange({
              isEditApiKeyOpen: false,
              isSingleCardClicked: false,
              apiKeyData: { name: EMPTY_STRING, scope: EMPTY_STRING },
            }),
          );
          dispatch(
            getListAllApiKeysThunk(),
          );
          // dispatch(
          //   userSettingsDataChange({
          //     isSingleCardClicked: false,
          //   }),
          // );
        }
        resolve(response);
      })
      .catch((error) => {
        console.log('error updateApiKeyDetails', error);
        const errorData = get(error, ['response', 'data', 'errors', 0], {});
        if (errorData.type === 'exist' && errorData.field === 'name') {
          dispatch(
            userSettingsDataChange({
              error_list: {
                ...error_list,
                descriptive_name: API_KEY_STRINGS(i18next.t).NAME_EXIST_ERROR,
              },
            }),
          );
        } else {
          showToastPopover(
            translate('error_popover_status.somthing_went_wrong'),
            translate('error_popover_status.refresh_try_again'),
            FORM_POPOVER_STATUS.SERVER_ERROR,
            true,
          );
        }
        reject(error);
      });
  });

export const deleteApiKeyDetailsThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    deleteApiKeyDetails(params)
      .then((response) => {
        dispatch(
          getListAllApiKeysThunk(),
        );
        resolve(response);
      })
      .catch((error) => {
        console.log('errordeleteApiKeyDetailsThunk', error);
        reject(error);
      });
  });

export const decryptApiKeyThunk = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    decryptApiKey(params)
      .then((response) => {
        const { apiKeyData = {} } = cloneDeep(store.getState().UserSettingsReducer);
        console.log('responseDecryptApikey', response, 'currentKeyData', apiKeyData);
        dispatch(
          userSettingsDataChange({
            isViewApiKeyOpen: true,
            apiKeyData: { ...apiKeyData, api_key: response?.api_key },
          }),
        );
        resolve(response);
      })
      .catch((error) => {
        console.log('errorDecryptApiKey', error);
        reject(error);
      });
  });

export default userSettingsDataChange;
