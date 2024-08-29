/** @module profile * */

import { userProfileSetStateThunk } from 'redux/actions/UserProfile.Action';
import { DEFAULT_COLORS_CONSTANTS } from './UIConstants';
import jsUtils, { nullCheck } from './jsUtility';
import { ROLES } from './Constants';
import { store } from '../Store';
import * as actions from '../redux/actions/Actions';
import { updateMFAInfo } from '../redux/actions/Mfa.Action';
import { consturctTheme, getAccountLanguageAndTimezone, getAccountSubscriptionType, getCardVerifiedStatus, getCheckHasBillingProfile, getIsBillingOwner, getRemainingDays } from './UtilityFunctions';
/**
 * @memberof profile
 */
/**
 * @function getColorCodes
 * @description To return configured or default color codes
 * @return {Object}
 */
 export function getColorCodes(responseColorCodes) {
    const buttonColor = responseColorCodes.button_color
      ? responseColorCodes.button_color
      : DEFAULT_COLORS_CONSTANTS.BUTTON;
    const primaryColor = responseColorCodes.primary_color
      ? responseColorCodes.primary_color
      : DEFAULT_COLORS_CONSTANTS.PRIMARY;
    const secondaryColor = responseColorCodes.secondary_color
      ? responseColorCodes.secondary_color
      : DEFAULT_COLORS_CONSTANTS.SECONDARY;
    const colorCodes = {
      primaryColor,
      secondaryColor,
      buttonColor,
    };
    return colorCodes;
  }
/**
 * @memberof profile
 */
  /**
 * @function getSignedUrlFromDocumentUrlDetails
 * @param {Object} document_url_details
 * @param {string} document_id
 * @description to retrieve signed url deom document details obejct
 * @return {string}
 */
export const getSignedUrlFromDocumentUrlDetails = (
    document_url_details,
    document_id,
  ) => {
    if (!jsUtils.isEmpty(document_url_details) && document_id) {
      const document = jsUtils.find(document_url_details, {
        document_id,
      });
      return document ? document.signedurl : null;
    }
    return null;
  };
/**
 * @memberof profile
 */
/**
 * @function updateAdminProfileInRedux
 * @param {Object} response userdetails server response
 * @param {Object} acc_logo account logo
 * @param {Object} profile_pic profile picture
 * @param {Object} socket socket connection
 * @param {function} setAdminProfile
 * @param {Object} acc_cover_pic account profile picture
 * @param {Object} notificationSocket notificationSocket socket connection
 * @description update admin details in redux
 */
 const updateAdminProfileInRedux = (
    response,
    acc_logo,
    profile_pic,
    socket,
    setAdminProfile,
    acc_cover_pic,
    notificationSocket,
  ) => {
    const adminProfileJson = Object.freeze({
      id: response._id,
      user_name: response.username,
      email: response.email,
      acc_logo,
      first_name: response.first_name,
      last_name: response.last_name,
      isAdmin: true,
      profile_pic,
      account_domain: response.account_domain,
      account_id: response.account_id,
      socket,
      notificationSocket,
      pref_utc_offsetStr: response.pref_utc_offsetStr,
      pref_locale: response.pref_locale,
      pref_timezone: response.pref_timezone,
      show_cover: response.show_cover,
      cover_type: response.cover_type,
      cover_message: response.cover_message,
      cover_color: response.cover_color,
      account_name: response.account_name,
      acc_cover_pic,
      user_type: response.user_type,
      full_name: `${response.first_name} ${response.last_name}`,
    });
    setAdminProfile(adminProfileJson);
  };
  /**
 * @memberof profile
 */
  /**
 * @function updateFlowCreatorProfileInRedux
 * @param {Object} response userdetails server response
 * @param {Object} acc_logo account logo
 * @param {Object} profile_pic profile picture
 * @param {Object} socket socket connection
 * @param {function} setFlowCreatorProfile
 * @param {Object} acc_cover_pic account profile picture
 * @param {Object} notificationSocket notificationSocket socket connection
 * @description update flow creator details in redux
 */
  const updateFlowCreatorProfileInRedux = (
    response,
    acc_logo,
    profile_pic,
    socket,
    setFlowCreatorProfile,
    acc_cover_pic,
    notificationSocket,
  ) => {
    const flow_creator_profile_json = Object.freeze({
      id: response._id,
      user_name: response.username,
      email: response.email,
      acc_logo,
      first_name: response.first_name,
      last_name: response.last_name,
      isFlowCreator: true,
      profile_pic,
      account_domain: response.account_domain,
      account_id: response.account_id,
      socket,
      notificationSocket,
      show_cover: response.show_cover,
      cover_type: response.cover_type,
      cover_message: response.cover_message,
      cover_color: response.cover_color,
      acc_cover_pic,
      pref_locale: response.pref_locale,
      pref_utc_offsetStr: response.pref_utc_offsetStr,
      pref_timezone: response.pref_timezone,
      account_name: response.account_name,
      user_type: response.user_type,
      full_name: `${response.first_name} ${response.last_name}`,
    });
    setFlowCreatorProfile(flow_creator_profile_json);
  };
  /**
 * @memberof profile
 */
  /**
 * @function updateMemberProfileInRedux
 * @param {Object} response userdetails server response
 * @param {Object} acc_logo account logo
 * @param {Object} profile_pic profile picture
 * @param {Object} socket socket connection
 * @param {function} setMemberProfile
 * @param {Object} acc_cover_pic account profile picture
 * @param {Object} notificationSocket notificationSocket socket connection
 * @description update member details in redux
 */
  const updateMemberProfileInRedux = (
    response,
    acc_logo,
    profile_pic,
    socket,
    setMemberProfile,
    acc_cover_pic,
    notificationSocket,
  ) => {
    const member_profile_json = Object.freeze({
      id: response._id,
      user_name: response.username,
      email: response.email,
      acc_logo,
      first_name: response.first_name,
      last_name: response.last_name,
      isMember: true,
      profile_pic,
      account_domain: response.account_domain,
      account_id: response.account_id,
      socket,
      notificationSocket,
      show_cover: response.show_cover,
      cover_type: response.cover_type,
      cover_message: response.cover_message,
      cover_color: response.cover_color,
      acc_cover_pic,
      pref_utc_offsetStr: response.pref_utc_offsetStr,
      pref_locale: response.pref_locale,
      pref_timezone: response.pref_timezone,
      account_name: response.account_name,
      user_type: response.user_type,
      full_name: `${response.first_name} ${response.last_name}`,
    });
    setMemberProfile(member_profile_json);
  };
  /**
 * @memberof profile
 */
  /**
 * @function updateProfileInRedux
 * @param {Object} response userdetails server response
 * @param {function} setRole set role(admin, flow creator, member)
 * @param {function} setColorCode set color code
 * @param {Object} socket socket connection
 * @param {function} setAdminProfile
 * @param {function} setFlowCreatorProfile
 * @param {function} setMemberProfile
 * @param {Object} acc_cover_pic account profile picture
 * @param {Object} notificationSocket notificationSocket socket connection
 * @description update member details in redux
 */
  export const updateProfileInRedux = (
    response,
    setRole,
    setColorCode = null,
    socket,
    setAdminProfile,
    setFlowCreatorProfile,
    setMemberProfile,
    setIsAccountProfileCompleted,
    setLocale,
    notificationSocket,
    setPriamryLocale,
    setColorTheme,
  ) => {
    const color_code_json = getColorCodes(response);
    let acc_logo = null;
    let profile_pic = null;
    let acc_cover_pic = null;
    setColorTheme && setColorTheme(consturctTheme(response?.theme?.color));
    if (response.acc_logo && response.document_url_details) {
      const acc_logo_object = jsUtils.find(
        response.document_url_details,
        (document) => document.document_id === response.acc_logo,
      );
      if (!jsUtils.isEmpty(acc_logo_object)) acc_logo = acc_logo_object.signedurl;
    }

    if (response.profile_pic && response.document_url_details) {
      const profile_pic_object = jsUtils.find(
        response.document_url_details,
        (document) => document.document_id === response.profile_pic,
      );
      if (!jsUtils.isEmpty(profile_pic_object)) profile_pic = profile_pic_object.signedurl;
    }

    // to check
    if (response.acc_cover_pic && response.document_url_details) {
      acc_cover_pic = getSignedUrlFromDocumentUrlDetails(
        response.document_url_details,
        response.acc_cover_pic,
      );
    }

    store.dispatch(
      userProfileSetStateThunk({
        user_data_list_uuid: response.user_data_list_uuid,
      }),
    );
    store.dispatch(updateMFAInfo({
      isMfaEnabled: response.is_mfa_enabled,
      isMfaVerified: response.is_mfa_verified,
      isMfaEnforced: response.is_mfa_enforced,
    }));
    getIsBillingOwner(response.is_billing_owner || false);
    getCardVerifiedStatus(response.is_billing_profile_completed);
    getCheckHasBillingProfile(jsUtils.has(response, 'is_billing_profile_completed'));
    // console.log('response.acc_type', response.acc_type);
    if (response.acc_timezone && response.acc_language) getAccountLanguageAndTimezone({ timezone: response.acc_timezone, language: response.acc_language });
    if (response.acc_type) getAccountSubscriptionType(response.acc_type);
    if (response.acc_type_details) {
      store.dispatch(actions.setIsAccountExpired(getRemainingDays(response.acc_type_details.expiry_date.slice(0, 10)) < 1));
      store.dispatch(actions.setRemainDays(getRemainingDays(response.acc_type_details.expiry_date.slice(0, 10))));
    } else {
      store.dispatch(actions.accountAlreadyExists(true));
    }
    setRole(response.user_type);
    store.dispatch(actions.appHeaderType(response.header_type));
    store.dispatch(actions.isShowAppTasks(response.is_show_app_tasks));
    store.dispatch(actions.isCopilotEnabled(response.is_copilot_enabled));
    store.dispatch(actions.isEnablePrompt(response.enable_prompt));
    if (setPriamryLocale) setPriamryLocale(response?.primary_locale);
    if (setLocale) setLocale(response.pref_locale);
    setIsAccountProfileCompleted(response.is_acc_signup_completed);
    store.dispatch(
      actions.roleActionDomainName(response.account_domain, response._id),
    );
    if (!jsUtils.isNull(setColorCode)) setColorCode(color_code_json);
    switch (response.user_type) {
      case ROLES.ADMIN:
        updateAdminProfileInRedux(
          response,
          acc_logo,
          profile_pic,
          socket,
          setAdminProfile,
          acc_cover_pic,
          notificationSocket,
        );
        break;
      case ROLES.MEMBER:
        updateMemberProfileInRedux(
          response,
          acc_logo,
          profile_pic,
          socket,
          setMemberProfile,
          acc_cover_pic,
          notificationSocket,
        );
        break;
      case ROLES.FLOW_CREATOR:
        updateFlowCreatorProfileInRedux(
          response,
          acc_logo,
          profile_pic,
          socket,
          setFlowCreatorProfile,
          acc_cover_pic,
          notificationSocket,
        );
        break;
      default:
        break;
    }
  };
/**
 * @memberof profile
 */
 /**
 * @function replaceDocumentIdWithSignedUrlInList
 * @param {Object} objectArray
 * @param {Object} documentUrlDetails
 * @param {string} documentIdFieldName
 * @description to replace document id with signed url
 */
export const replaceDocumentIdWithSignedUrlInList = (
    objectArray,
    documentUrlDetails,
    documentIdFieldName,
  ) => {
    if (
      nullCheck(objectArray, 'length', true)
      && nullCheck(documentUrlDetails, 'length', true)
      && documentIdFieldName
    ) {
      return objectArray.map((obj) => {
        return {
          ...obj,
          [documentIdFieldName]: getSignedUrlFromDocumentUrlDetails(
            documentUrlDetails,
            obj[documentIdFieldName],
          ),
        };
      });
    }
    return objectArray;
  };

  export default updateProfileInRedux;
