import { translateFunction } from 'utils/jsUtility';
import { DOCUMENT_TYPES } from 'utils/strings/CommonStrings';
import { ACCOUNT_NAME_VALIDATION, ANY_VALIDATION, constructJoiObject, STRING_VALIDATION } from 'utils/ValidationConstants';
import { getFileUrl } from '../../../utils/attachmentUtils';
import { ACCOUNT_DROPDOWN_STRING, ACCOUNT_INFO_STRINGS } from './AccountInfoModal.string';

export const getAccountSettingVadidateData = (state) => {
    const data = {
        [ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID]: state.industry || null,
        [ACCOUNT_DROPDOWN_STRING.LANGUAGE.ID]: state.acc_language.trim() || null,
        [ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.ID]: state.acc_locale || null,
        [ACCOUNT_DROPDOWN_STRING.TIMEZONE_DROPDOWN.ID]: state.acc_timezone.trim() || null,
        [ACCOUNT_INFO_STRINGS.COMPANY_NAME_ID]: state.company_name.trim(),
        [ACCOUNT_INFO_STRINGS.COMPANY_LOGO_ID]: state.company_logo.trim(),
        [ACCOUNT_DROPDOWN_STRING.COUNTRY.ID]: state.country.trim(),
    };
    return data;
};

export const accountSettingValidationSchema = (t = translateFunction) => constructJoiObject({
    [ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.ID]: ANY_VALIDATION.required().label(t(ACCOUNT_DROPDOWN_STRING.INDUSTRY_DROPDOWN.LABEL)),
    [ACCOUNT_DROPDOWN_STRING.LANGUAGE.ID]: STRING_VALIDATION.required().label(t(ACCOUNT_DROPDOWN_STRING.LANGUAGE.LABEL)),
    [ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.ID]: ANY_VALIDATION.required().label(t(ACCOUNT_DROPDOWN_STRING.LOCALE_DROPDOWN.LABEL)),
    [ACCOUNT_DROPDOWN_STRING.TIMEZONE_DROPDOWN.ID]: STRING_VALIDATION.required().label(t(ACCOUNT_DROPDOWN_STRING.TIMEZONE_DROPDOWN.LABEL)),
    [ACCOUNT_INFO_STRINGS.COMPANY_NAME_ID]: ACCOUNT_NAME_VALIDATION.required().label(t(ACCOUNT_INFO_STRINGS.COMPANY_NAME)),
    [ACCOUNT_INFO_STRINGS.COMPANY_LOGO_ID]: STRING_VALIDATION.required().label(t(ACCOUNT_INFO_STRINGS.COMPANY_LOGO)),
    [ACCOUNT_DROPDOWN_STRING.COUNTRY.ID]: STRING_VALIDATION.required().label(t(ACCOUNT_DROPDOWN_STRING.COUNTRY.LABEL)),
});

export const getUpdatedDocumentUrlDetailsForAccountModal = (document_details, acc_logo_pic_id) => {
    const data = {};
    if (document_details) {
        data.document_details = {};
        data.document_details.uploaded_doc_metadata = [];
        data.document_details.entity = document_details.entity;
        data.document_details.entity_id = document_details.entity_id;
        data.document_details.ref_uuid = document_details.ref_uuid;
        if (document_details.file_metadata) {
          document_details.file_metadata.forEach((file_info) => {
            if (file_info.type === DOCUMENT_TYPES.ACCOUNT_LOGO || file_info.type === DOCUMENT_TYPES.ACCOUNT_COVER_PIC || file_info.type === DOCUMENT_TYPES.ACCOUNT_FAVICON) {
              data.document_details.uploaded_doc_metadata.push({
                upload_signed_url: getFileUrl(file_info?.upload_signed_url),
                type: file_info.type,
                document_id: file_info._id,
              });
              if (file_info.type === 'acc_favicon') {
                data.acc_favicon = file_info._id;
              } else {
                data.acc_logo = file_info._id;
              }
              if (acc_logo_pic_id && acc_logo_pic_id !== file_info._id) {
                data.document_details.removed_doc_list = [];
                data.document_details.removed_doc_list.push(acc_logo_pic_id);
              }
            }
          });
        }
    }
    return data;
};

export const getLanguageAccountValidationData = (state, calendarState) => {
    const data = {
        acc_locale: state.acc_locale,
        primary_locale: state.primary_locale.trim(),
        acc_language: state.acc_language.trim(),
        acc_timezone: state.acc_timezone.trim(),
        allow_update_language_locale: calendarState.allow_update_language_locale || false,
        allow_update_timezone: calendarState.allow_update_timezone || false,
        working_days: calendarState.working_days,
    };
    return data;
};

export const getAccountMainModalValidationData = (state, account_domain) => {
    const value = {
        account_name: state.company_name,
        account_domain: account_domain,
        industry_type: state.industry,
        acc_logo: state.company_logo,
        document_details: state.document_details,
        country: state.country,
        theme: state.theme || {},
        is_default_theme: state.is_default_theme,
    };
    return value;
};
