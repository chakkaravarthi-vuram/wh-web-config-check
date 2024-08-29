import { ACCOUNT_LOGO_SIZE_VALIDATION, ACCOUNT_NAME_VALIDATION, constructJoiObject, REQUIRED_VALIDATION } from '../../../utils/ValidationConstants';
import { ACCOUNT_SETTINGS_FORM, ADMIN_THEME_COLORS, ADMIN_THEME_TYPE, INDUSTRY_TYPE } from './AccountSettings.strings';
import {
  nullCheckAndReturnValueOrEmptyString,
} from '../../../utils/UtilityFunctions';
import { DOCUMENT_TYPES } from '../../../utils/strings/CommonStrings';
import jsUtils from '../../../utils/jsUtility';
import { getSignedUrlFromDocumentUrlDetails } from '../../../utils/profileUtils';
import { store } from '../../../Store';
import { getFileUrl } from '../../../utils/attachmentUtils';

export const accountDetailsValidateSchema = constructJoiObject({
  account_name: ACCOUNT_NAME_VALIDATION.required().label(ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.LABEL),
});

export const accountLogoValidateSchema = constructJoiObject({
  type: REQUIRED_VALIDATION,
  size: ACCOUNT_LOGO_SIZE_VALIDATION,
});

export const getUpdatedAccountDetailsData = (props, state) => {
  const data = {};
  Object.keys(props).forEach((id) => {
    if (id === ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID) {
      data[id] = state[id].trim();
    } else if (!jsUtils.isEmpty(state[id])) {
      data[id] = state[id];
    } else {
      data[id] = null;
    }
  });
  return data;
};

export const getUpdatedAccountDetailsDataWithDocuments = (props, state) => {
  const data = getUpdatedAccountDetailsData(props, state);
  const { document_details } = store.getState().AccountSettingsReducer;
  if (document_details) {
    data.document_details = {
      uploaded_doc_metadata: [],
      entity: document_details.entity,
      entity_id: document_details.entity_id,
      ref_uuid: document_details.ref_uuid,
    };

    if (document_details.file_metadata) {
      document_details.file_metadata.forEach((file_info) => {
        if (file_info.type === DOCUMENT_TYPES.ACCOUNT_LOGO) {
          data.document_details.uploaded_doc_metadata.push({
            upload_signed_url: getFileUrl(file_info?.upload_signed_url),
            type: file_info.type,
            document_id: file_info._id,
          });

          data.acc_logo = file_info._id;
          if (state.acc_logo_pic_id && state.acc_logo_pic_id !== file_info._id) {
            data.document_details.removed_doc_list = [state.acc_logo_pic_id];
          }
        }
      });
    }
  }
  return data;
};

export const getAccountDetailsCompareData = (state) => {
  const data = {
    [ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID]: jsUtils.isEmpty(state.account_name) ? null : state.account_name.trim(),
    [INDUSTRY_TYPE.INDUSTRY_TYPE_ID]: jsUtils.isEmpty(state.industry_type) ? null : state.industry_type,
    [ACCOUNT_SETTINGS_FORM.ACCOUNT_DOMAIN.ID]: jsUtils.isEmpty(state.account_domain) ? null : state.account_domain,
    [ADMIN_THEME_TYPE.ID]: jsUtils.isEmpty(state.is_default_theme) ? null : state.is_default_theme,
    [ADMIN_THEME_COLORS.ID]: jsUtils.isEmpty(state.admin_theme) ? null : state.admin_theme,
  };

  return data;
};

export const getAccountDetailsInitialData = (props) => {
  const data = {
    [ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID]: nullCheckAndReturnValueOrEmptyString(props.account_name),
    [ACCOUNT_SETTINGS_FORM.ACCOUNT_DOMAIN.ID]: nullCheckAndReturnValueOrEmptyString(props.account_domain),
    [INDUSTRY_TYPE.INDUSTRY_TYPE_ID]: nullCheckAndReturnValueOrEmptyString(props.industry_type),
   };

  return data;
};

export const getStateToUpdateFromResponse = (response) => {
  const data = {
    is_data_loading: false,
    account_settings: jsUtils.cloneDeep(response),
    account_name: nullCheckAndReturnValueOrEmptyString(response.account_name),
    account_industry: nullCheckAndReturnValueOrEmptyString(response.industry_type),
    account_domain: nullCheckAndReturnValueOrEmptyString(response.account_domain),
    acc_logo: getSignedUrlFromDocumentUrlDetails(response.document_url_details, response.acc_logo),
    acc_favicon: getSignedUrlFromDocumentUrlDetails(response.document_url_details, response.acc_favicon),
    is_show_app_tasks: response.is_show_app_tasks,
  };
  return data;
};

export const getCompareValuesFromServer = (accountSettings) => {
  const data = {
    [ACCOUNT_SETTINGS_FORM.ACCOUNT_NAME.ID]: jsUtils.isEmpty(accountSettings?.account_name) ? null : accountSettings.account_name,
    [ACCOUNT_SETTINGS_FORM.ACCOUNT_DOMAIN.ID]: jsUtils.isEmpty(accountSettings?.account_domain)
      ? null
      : accountSettings.account_domain,
    [INDUSTRY_TYPE.INDUSTRY_TYPE_ID]: jsUtils.isEmpty(accountSettings?.industry_type)
      ? null
      : accountSettings.industry_type,
    // TO remove
    [ACCOUNT_SETTINGS_FORM.PRIMARY_COLOR.ID]: jsUtils.isEmpty(accountSettings?.primary_color)
      ? null
      : accountSettings.primary_color,
    // [ACCOUNT_SETTINGS_FORM.SECONDARY_COLOR.ID]: jsUtils.isEmpty(accountSettings.secondary_color)
    //   ? null
    //   : accountSettings.secondary_color,
    // to remove
    [ACCOUNT_SETTINGS_FORM.BUTTON_COLOR.ID]: jsUtils.isEmpty(accountSettings?.button_color) ? null : accountSettings.button_color,
    [ADMIN_THEME_TYPE.ID]: jsUtils.isEmpty(accountSettings?.is_default_theme) ? null : accountSettings.is_default_theme,
    [ADMIN_THEME_COLORS.ID]: jsUtils.isEmpty(accountSettings?.admin_theme) ? null : accountSettings.admin_theme,
  };
  return data;
};
