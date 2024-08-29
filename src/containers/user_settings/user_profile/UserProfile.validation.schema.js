import { constructJoiObject, MOBILE_NUMBER_VALIDATION } from '../../../utils/ValidationConstants';
import { MOBILE_NUMBER_ID, COUNTRY_CODE_ID, COUNTRY_ID } from './UserProfile.strings';
import { nullCheckAndReturnValueOrEmptyString } from '../../../utils/UtilityFunctions';
import countryCodeList from '../../../components/form_components/flags/countryCodeList';
import { EMPTY_STRING, DOCUMENT_TYPES } from '../../../utils/strings/CommonStrings';
import jsUtils from '../../../utils/jsUtility';
import { getFileUrl } from '../../../utils/attachmentUtils';

export const userProfileDetailsValidateSchema = (t) => (
  constructJoiObject({
  mobile_number: MOBILE_NUMBER_VALIDATION(t).allow(null, EMPTY_STRING),
}));
export const userProfileDetailsMobileNumberRequiredValidateSchema = (t) => (
  constructJoiObject({
  mobile_number: MOBILE_NUMBER_VALIDATION(t).allow(null, EMPTY_STRING),
}));
export const getStateToUpdateFromResponse = (data) => {
  const state = {
    isProfileDetailsLoading: false,
    profileDetails: data,
    mobile_number: data.mobile_number ? data.mobile_number : EMPTY_STRING,
    mobile_number_country_code: nullCheckAndReturnValueOrEmptyString(
      data.mobile_number_country_code,
    )
      ? data.mobile_number_country_code
      : countryCodeList[94].countryCodeId,
    mobile_number_country: nullCheckAndReturnValueOrEmptyString(data.mobile_number_country)
      ? data.mobile_number_country
      : countryCodeList[94].countryCode.toUpperCase(),
    profile_pic: !jsUtils.isEmpty(data.document_url_details)
      ? data.document_url_details[0].signedurl
      : null,
  };
  state.profileDetails.mobile_number = data.mobile_number ? data.mobile_number : EMPTY_STRING;
  state.profileDetails.mobile_number_country_code = nullCheckAndReturnValueOrEmptyString(
    data.mobile_number_country_code,
  )
    ? data.mobile_number_country_code
    : countryCodeList[94].countryCodeId;
  state.profileDetails.mobile_number_country = nullCheckAndReturnValueOrEmptyString(
    data.mobile_number_country,
  )
    ? data.mobile_number_country
    : countryCodeList[94].countryCode.toUpperCase();
  return state;
};

export const getProfileDetailsCompareData = (state) => {
  const data = {
    mobile_number: jsUtils.isEmpty(state.mobile_number) ? EMPTY_STRING : state.mobile_number.trim(),
    mobile_number_country_code: jsUtils.isEmpty(state.mobile_number_country_code)
      ? countryCodeList[94].countryCodeId
      : state.mobile_number_country_code,
    mobile_number_country: jsUtils.isEmpty(state.mobile_number_country)
      ? countryCodeList[94].countryCode.toUpperCase()
      : state.mobile_number_country,
  };
  return data;
};

export const getUpdatedUserProfileDetailsData = (props, state) => {
  const data = {};
  Object.keys(props).forEach((id) => {
    // if (!jsUtils.isEqual(props[id], state[id])) {

    if (
      (id === MOBILE_NUMBER_ID || id === COUNTRY_CODE_ID || id === COUNTRY_ID) &&
      jsUtils.isEmpty(state[MOBILE_NUMBER_ID]) &&
      !jsUtils.isEmpty(props[MOBILE_NUMBER_ID])
    ) {
      data[MOBILE_NUMBER_ID] = null;
      data[COUNTRY_ID] = null;
      data[COUNTRY_CODE_ID] = null;
    } else if (
      (id === MOBILE_NUMBER_ID || id === COUNTRY_CODE_ID || id === COUNTRY_ID) &&
      jsUtils.isEmpty(state[MOBILE_NUMBER_ID]) &&
      jsUtils.isEmpty(props[MOBILE_NUMBER_ID])
    ) {
      // do nothing
    } else if (
      (id === MOBILE_NUMBER_ID || id === COUNTRY_CODE_ID || id === COUNTRY_ID) &&
      !jsUtils.isEmpty(state[MOBILE_NUMBER_ID])
    ) {
      data[MOBILE_NUMBER_ID] = state[MOBILE_NUMBER_ID];
      data[COUNTRY_ID] = state[COUNTRY_ID];
      data[COUNTRY_CODE_ID] = state[COUNTRY_CODE_ID];
    } else if (jsUtils.isEmpty(state[id]) && !jsUtils.isEmpty(props[id])) data[id] = null;
    else if (!jsUtils.isEmpty(state[id])) data[id] = state[id];
    // }
  });
  return data;
};

export const getUpdatedUserProfileDetailsDataWithDocuments = (props, state) => {
  const data = {};
  Object.keys(props).forEach((id) => {
    // if (!jsUtils.isEqual(props[id], state[id])) {
    if (
      (id === MOBILE_NUMBER_ID || id === COUNTRY_CODE_ID || id === COUNTRY_ID) &&
      jsUtils.isEmpty(state[MOBILE_NUMBER_ID]) &&
      !jsUtils.isEmpty(props[MOBILE_NUMBER_ID])
    ) {
      data[MOBILE_NUMBER_ID] = null;
      data[COUNTRY_ID] = null;
      data[COUNTRY_CODE_ID] = null;
    } else if (
      (id === MOBILE_NUMBER_ID || id === COUNTRY_CODE_ID || id === COUNTRY_ID) &&
      jsUtils.isEmpty(state[MOBILE_NUMBER_ID]) &&
      jsUtils.isEmpty(props[MOBILE_NUMBER_ID])
    ) {
      // do nothing
    } else if (
      (id === MOBILE_NUMBER_ID || id === COUNTRY_CODE_ID || id === COUNTRY_ID) &&
      !jsUtils.isEmpty(state[MOBILE_NUMBER_ID])
    ) {
      data[MOBILE_NUMBER_ID] = state[MOBILE_NUMBER_ID];
      data[COUNTRY_ID] = state[COUNTRY_ID];
      data[COUNTRY_CODE_ID] = state[COUNTRY_CODE_ID];
    } else if (jsUtils.isEmpty(state[id]) && !jsUtils.isEmpty(props[id])) data[id] = null;
    else if (!jsUtils.isEmpty(state[id])) data[id] = state[id];
    // }
  });
  if (state.document_details) {
    console.log(state.document_details);
    data.document_details = {};
    data.document_details.uploaded_doc_metadata = [];
    data.document_details.entity = state.document_details.entity;
    data.document_details.entity_id = state.document_details.entity_id;
    data.document_details.ref_uuid = state.document_details.ref_uuid;
    if (state.document_details.file_metadata) {
      state.document_details.file_metadata.forEach((file_info) => {
        data.document_details.uploaded_doc_metadata.push({
          upload_signed_url: getFileUrl(file_info?.upload_signed_url),
          type: DOCUMENT_TYPES.PROFILE_PIC,
          document_id: file_info._id,
        });
        data.profile_pic = file_info._id;
        if (state.profile_pic_id && state.profile_pic_id !== file_info._id) {
          data.document_details.removed_doc_list = [];
          data.document_details.removed_doc_list.push(state.profile_pic_id);
        }
      });
    }
  }
  return data;
};
