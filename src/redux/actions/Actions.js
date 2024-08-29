/**
 * @author Asttle
 * @email asttlej@vuram.com
 * @create date 2019-11-27 20:36:40
 * @modify date 2019-11-27 20:36:40
 * @desc [description]
 */
import { ACTION_CONSTANTS, CREATE_FLOW } from './ActionConstants';

export const adminProfileAction = (adminProfile) => {
  return {
    type: ACTION_CONSTANTS.ADMIN_PROFILE_ACTION,
    payload: adminProfile,
  };
};

export const updateAdminProfileData = (adminProfileData) => {
  return {
    type: ACTION_CONSTANTS.UPDATE_ADMIN_PROFILE_ACTION,
    payload: adminProfileData,
  };
};

export const flowCreatorProfileAction = (flowCreatorProfile) => {
  return {
    type: ACTION_CONSTANTS.FLOW_CREATOR_PROFILE_ACTION,
    payload: flowCreatorProfile,
  };
};

export const flowClearData = () => {
  return {
    type: CREATE_FLOW.FLOW_CLEAR,
  };
};

export const memberProfileAction = (memberProfile) => {
  return {
    type: ACTION_CONSTANTS.MEMBER_PROFILE_ACTION,
    payload: memberProfile,
  };
};

export const updateAccountLogoAction = (account_logo) => {
  return {
    type: ACTION_CONSTANTS.UPDATE_LOGO_ACTION,
    payload: account_logo,
  };
};

export const updateMaximumFileSizeAction = (maximum_file_size) => {
  return {
    type: ACTION_CONSTANTS.UPDATE_PIC_SIZE,
    payload: maximum_file_size,
  };
};

// export const updateUserTypeAction = (user_type) => {
//   return {
//     type: ACTION_CONSTANTS.UPDATE_USER_TYPE,
//     payload: user_type,
//   };
// };

export const roleAction = (setRole) => {
  return {
    type: ACTION_CONSTANTS.ROLE_ACTION,
    payload: setRole,
  };
};
export const roleActionAccountLocale = (locale) => {
  return {
    type: ACTION_CONSTANTS.ROLE_ACTION_ACOUNT_LOCALE,
    payload: locale,
  };
};

export const primaryActionAccountLocale = (locale) => {
  return {
    type: ACTION_CONSTANTS.PRIMARY_LOCALE,
    payload: locale,
  };
};

export const appHeaderType = (type) => {
  return {
    type: ACTION_CONSTANTS.APP_HEADER_TYPE,
    payload: type,
  };
};

export const isShowAppTasks = (isShow) => {
  return {
    type: ACTION_CONSTANTS.IS_SHOW_APP_TASKS,
    payload: isShow,
  };
};

export const isCopilotEnabled = (isEnabled) => {
  return {
    type: ACTION_CONSTANTS.IS_COPILOT_ENABLED,
    payload: isEnabled,
  };
};

export const isEnablePrompt = (isEnable) => {
  return {
    type: ACTION_CONSTANTS.ENABLE_PROMPT,
    payload: isEnable,
  };
};

export const roleActionDomainName = (account_domain, user_id) => {
  return {
    type: ACTION_CONSTANTS.ROLE_ACTION_DOMAIN_NAME,
    payload: { account_domain, user_id },
  };
};

export const colorCodeAction = (setColorCode) => {
  return {
    type: ACTION_CONSTANTS.COLOR_CODE_ACTION,
    payload: setColorCode,
  };
};

export const setAccountCompletionStatus = (setAccountStatus) => {
  return {
    type: ACTION_CONSTANTS.SET_ACCOUNT_COMPLETION_STATUS,
    payload: setAccountStatus,
  };
};

export const setIsAccountExpired = (expiryStatus) => {
  return {
    type: ACTION_CONSTANTS.SET_IS_ACCOUNT_EXPIRED,
    payload: expiryStatus,
  };
};

export const setRemainDays = (days) => {
  return {
    type: ACTION_CONSTANTS.SET_EXPIRY_REMAINING,
    payload: days,
  };
};

export const setIsBillingUser = (userType) => {
  return {
    type: ACTION_CONSTANTS.IS_BILLING_USER,
    payload: userType,
  };
};

export const setCardVerifiedStatus = (cardStatus) => {
  return {
    type: ACTION_CONSTANTS.IS_ACCOUNT_CARD_VERIFIED,
    payload: cardStatus,
  };
};

export const accountAlreadyExists = (days) => {
  return {
    type: ACTION_CONSTANTS.ALREADY_EXISTING_ACCOUNT,
    payload: days,
  };
};

export const setManualAccountCompletionStatus = (setAccountStatus) => {
  return {
    type: ACTION_CONSTANTS.MANUAL_ACCOUNT_COMPLETION_STATUS,
    payload: setAccountStatus,
  };
};

export const clearAccountSettingModalShowCheck = () => {
  return {
    type: ACTION_CONSTANTS.CLEAR_ACCOUNT_COMPLETION_STATUS,
  };
};

export const setAccountSubscriptionStatus = (subType) => {
  return {
    type: ACTION_CONSTANTS.ACCOUNT_SUBSCRIPTION_TYPE,
    payload: subType,
  };
};

export const setAccountLanguageAndTImezone = (data) => {
  return {
    type: ACTION_CONSTANTS.SET_TIMEZONE_LANGUAGE,
    payload: data,
  };
};

export const checkHasBillingProfile = (data) => {
  return {
    type: ACTION_CONSTANTS.HAS_BILLING_PROFILE_COMPLETED,
    payload: data,
  };
};

export const formPopOverStatusAction = (setFormStatus) => {
  return {
    type: ACTION_CONSTANTS.FORM_POPOVER_STATUS_ACTION,
    payload: setFormStatus,
  };
};

export const editConfirmPopOverStatusAction = (setFormStatus) => {
  return {
    type: ACTION_CONSTANTS.EDIT_CONFIRM_POPOVER_STATUS_ACTION,
    payload: setFormStatus,
  };
};

export const setConfirmPopoverAction = (setConfirmPopover) => {
  return {
    type: ACTION_CONSTANTS.CONFIRM_POPOVER_ACTION,
    payload: setConfirmPopover,
  };
};

export const clearConfirmPopoverAction = () => {
  return { type: ACTION_CONSTANTS.CONFIRM_POPOVER_CLEAR };
};

export const updateFormFeedbackAction = (payload) => {
  return {
    type: ACTION_CONSTANTS.FORM_FEEDBACK_UPDATE,
    payload,
  };
};

export const addFormFeedbackAction = (payload) => {
  return { type: ACTION_CONSTANTS.FORM_FEEDBACK_ADD, payload };
};

export const alertPopOverStatusAction = (setAlertStatus) => {
  return {
    type: ACTION_CONSTANTS.ALERT_POPOVER_STATUS_ACTION,
    payload: setAlertStatus,
  };
};

export const clearAlertPopOverStatusAction = () => {
  return {
    type: ACTION_CONSTANTS.CLEAR_ALERT_POPOVER_STATUS_ACTION,
  };
};

export const postLoaderAction = (setPostLoaderStatus) => {
  return {
    type: ACTION_CONSTANTS.POST_LOADER_ACTION,
    payload: setPostLoaderStatus,
  };
};

export const updateLanguageAction = (language) => {
  return {
    type: ACTION_CONSTANTS.UPDATE_LANGUAGE_ACTION,
    payload: language,
  };
};

export const updateAdminProfilePicAction = (profile_pic) => {
  return {
    type: ACTION_CONSTANTS.UPDATE_ADMIN_PROFILE_PIC,
    payload: profile_pic,
  };
};

export const updateMemberProfilePicAction = (profile_pic) => {
  return {
    type: ACTION_CONSTANTS.UPDATE_MEMBER_PROFILE_PIC,
    payload: profile_pic,
  };
};

export const updateFlowCreatorProfilePicAction = (profile_pic) => {
  return {
    type: ACTION_CONSTANTS.UPDATE_FLOW_CREATOR_PROFILE_PIC,
    payload: profile_pic,
  };
};

export const logoutAction = (logout) => {
  return {
    type: ACTION_CONSTANTS.USER_LOGOUT_ACTION,
    payload: logout,
  };
};
