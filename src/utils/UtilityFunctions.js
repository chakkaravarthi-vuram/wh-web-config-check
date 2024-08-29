import moment from 'moment';
import React, { useEffect } from 'react';
import { createStore } from 'redux';
import i18next from 'i18next';
import Cookies from 'universal-cookie';
import { cloneDeep, get, isEmpty, startCase } from 'lodash';
import { UTToolTipType, toastPopOver, EToastType } from '@workhall-pvt-lmt/wh-ui-library';
import { CHAT_STRINGS } from 'components/chat_components/chat_window/ChatTranslation.strings';
import { removeCookiesOnSwitchAccount, removePrimaryDomainCookie } from 'containers/sign_in/SignIn.utils';
import { clearSessionDetails } from 'axios/apiService/clearSessionDetails.apiService';
import { SIDE_NAV_BAR } from 'containers/landing_page/main_header/common_header/CommonHeader.strings';
import { setWelcomeChange } from 'redux/reducer/WelcomeInsightsReducer';
import { POP_OVER_STATUS } from 'components/form_components/pagination/Pagination.strings';
import { CONFIRM_PASSWORD_LABEL } from 'containers/sign_in/invite_user/newPassword/newPassword.strings';
import { getFieldDataByType, getSelectedUserTeamPickerDataForFilter } from '../components/dashboard_filter/FilterUtils';
import { RESET_PASSWORD_STRINGS } from '../containers/reset_password/ResetPassword.strings';
import { SIGN_IN_PASSWORD } from '../containers/sign_in/SignIn.strings';
import { ADDITIONAL_DETAILS_STRINGS } from '../containers/sign_up/additional_details/AdditionalDetails.strings';
import { CREATE_TASK } from '../containers/task/task/TaskTranslation.string';
import rootReducer from '../redux/reducer/index';
import { store } from '../Store';
import {
  DOT,
  DROPDOWN_CONSTANTS,
  EMPTY_STRING,
  FORM_POPOVER_STRINGS,
  LANGUAGES_LIST,
  NA,
  PAC_URL_STRING,
  SPACE,
  TYPE_STRING,
} from './strings/CommonStrings';

import * as actions from '../redux/actions/Actions';
import gClasses from '../scss/Typography.module.scss';
import {
  APP_MODE,
  DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES,
  DEFAULT_FILE_UPLOAD_SIZE_IN_MB,
  FORM_POPOVER_STATUS,
  PRODUCTION,
  RESPONSE_TYPE,
  ROLES,
  ROUTE_METHOD,
} from './Constants';
import { getLanguage } from '../axios/apiService/getLanguage.apiService';
import { LOGGED_IN_NAVBAR } from '../components/logged_in_nav_bar/LoggedInNavbarTranlsation.strings';
import { ADMIN_SETTINGS } from '../containers/admin_settings/AdminSettingsTranslation.strings';
import { OTHER_SETTINGS_FORM } from '../containers/admin_settings/other_settings/OtherSettings.strings';
import { LANDING_PAGE } from '../containers/landing_page/LandingPageTranslation.strings';
import { MESSAGE_OBJECT_STRINGS, FLOW_STRINGS } from '../containers/flows/Flow.strings';
import { FLOW_T_STRINGS } from '../containers/flows/FlowTranslations.strings';
import { ACTORS } from '../containers/task/task/Task.strings';
import { NEW_PASSWORD } from '../containers/user_settings/change_password/ChangePassword.strings';
import { CHANGE_PASSWORD } from '../containers/user_settings/change_password/ChangePasswordTranslation.strings';
import { USER_PROFILE } from '../containers/user_settings/user_profile/UserProfileTranslation.strings';
import ONETHING_STRINGS_SPANISH from '../translations/AccountSettingsStringSpa.json';
import * as ROUTE_CONSTANTS from '../urls/RouteConstants';
import {
  ALLOWED_EXTENSIONS_REGEX,
  MATCH_ALL_ALPHA_NUM,
  EMAIL_REGEX,
  EMAIL_REGEX_BASIC,
  FULL_NAME_REGEX,
  NEW_PASSWORD_REGEX,
  ONLY_ALPHABETS_REGEX,
  FILE_SUSPICICOUS_PATTERNS,
} from './strings/Regex';

import jsUtils, { getDomainName, getSubDomainName, nullCheck, translateFunction, groupBy, uniqBy } from './jsUtility';

import countryCodeList from '../components/form_components/flags/countryCodeList';
import UpdateConfirmPopover from '../components/update_confirm_popover/UpdateConfirmPopover';
import { generatePostServerErrorMessage } from '../server_validations/ServerValidation';
import { FIELD_LIST_TYPE, FIELD_TYPE } from './constants/form.constant';
import { generateFieldId } from './generatorUtils';
import { getAllSearchParams } from './taskContentUtils';
import { STRING_VALIDATION } from './ValidationConstants';
import { VALIDATION_CONSTANT } from './constants/validation.constant';
import { GET_TASK_LIST_CONSTANTS } from '../containers/application/app_components/task_listing/TaskList.constants';
import AlertCircle from '../assets/icons/application/AlertCircle';
import CustomUserInfoToolTipNew from '../components/form_components/user_team_tool_tip/custom_userinfo_tooltip/CustomUserInfoToolTipNew';
import { TAB_ROUTE } from '../containers/application/app_components/dashboard/flow/Flow.strings';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from '../containers/form/sections/field_configuration/basic_configuration/BasicConfiguration.strings';

const ms = require('ms');

const cookies = new Cookies();

// ************************************************** to be removed *****************************
// **** loader utils start ******
export const calculateProgressPercentage = (progressEvent) => {
  if (progressEvent) {
    return parseInt(
      Math.round((progressEvent.loaded / progressEvent.total) * 100),
      10,
    );
  }
  return null;
};

export const updatePostLoader = (isVisible, progressEvent) => {
  const progressPercentage = calculateProgressPercentage(progressEvent);
  const progress = {
    isVisible,
    progressPercentage,
  };
  store.dispatch(actions.postLoaderAction(progress));
};

export const setPointerEvent = (isVisible) => {
  if (isVisible) {
    document.body.classList.add(gClasses.NoPointerEvent);
  } else {
    document.body.classList.remove(gClasses.NoPointerEvent);
  }
};

export const getLoaderConfig = (hidePostLoader = false) => {
  const loaderConfig = {
    timeout: 0,
  };
  if (!hidePostLoader) {
    loaderConfig.onUploadProgress = (progressEvent) => updatePostLoader(true, progressEvent);
  }
  return loaderConfig;
};

export const getFileUploadStatus = (callBack) => {
  return {
    onUploadProgress: (progressEvent) => {
      const progressPercentage = calculateProgressPercentage(progressEvent);
      console.log('checking12345', progressEvent, progressPercentage);
      callBack(progressPercentage);
    },
    timeout: 0,
  };
};
// **** loader utils end ******
// **** joi utils start ******
export const joiValidate = (data, schema) => {
  if (!jsUtils.isEmpty(schema)) {
    console.log('joiValidate', data);
    const errors = schema.validate(data || {}, {
      abortEarly: false,
    });
    return errors.error;
  }
  return false;
};

export const generateValidationMessage = (errors, t = translateFunction) => {
  const error_list = {};
  let message = null;
  console.log('task error joi', cloneDeep(errors));
  if (errors) {
    console.log('task error joi inside', errors.details);
    errors.details.forEach((element) => {
      console.log('Joi Error Object', element);
      if (!nullCheck(element.context.value)) {
        if (element.context.label === SIGN_IN_PASSWORD) {
          message = t(VALIDATION_CONSTANT.PASSWORD_REQUIRED);
        } else if (
          element.type &&
          (element.type.includes('array.includesRequiredUnknowns') ||
            element.type.includes('array.base'))
        ) {
          if (
            element.context.label === 'teams' ||
            element.context.label === 'users'
          ) {
            message = t(VALIDATION_CONSTANT.STEP_ACTOR_REQUIRED);
          } else message = element.message;
        } else if (element?.type?.includes?.('string.base') && element.context.label === 'operation') {
            message = t(VALIDATION_CONSTANT.OPTIONS_REQUIRED);
        } else if (element.context.key === 'onDay' && element.message === t('scheduler_strings.repeat_every.day.error')) {
          message = element.message;
        } else if (element.type.includes('any.required') && element.message === t(VALIDATION_CONSTANT.CURRENCY_DEFAULT_VALUE_REQUIRED)) {
          message = element.message;
        } else if (element.type.includes('any.required') && element?.context?.key === 'minimumSelection') {
          message = element.message;
        } else if (element.type.includes('any.ref')) {
          message = element.message;
        } else {
          message = `${element.context.label} ${i18next.t(VALIDATION_CONSTANT.IS_REQUIRED)}`;
        }
      } else if (
        element.type &&
        (element.type.includes('regex') || element.type.includes('pattern'))
      ) {
        console.log('patternRegexdcd');
        const newPasswordSchema = STRING_VALIDATION.regex(NEW_PASSWORD_REGEX);
        const newPasswordError = newPasswordSchema.validate(
          element.context.value,
        );
        if (
          element.context.label ===
            ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.LABEL ||
          element.context.label ===
            RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.LABEL ||
          (element.context.label === NEW_PASSWORD && newPasswordError.error)
        ) {
          message = `${element.context.label} ${t(VALIDATION_CONSTANT.ATLEAST_ONE_ALPHABET_OR_NUMBER_REQUIRED)}`;
        } else if (
          element.context.label === SIGN_IN_PASSWORD ||
          element.context.label === NEW_PASSWORD
        ) {
          console.log('sign password error captured2');

          message = t(VALIDATION_CONSTANT.INVALID_PASSWORD);
        } else if (
          element.context.label ===
            OTHER_SETTINGS_FORM.ALLOWED_EXTENSIONS.LABEL ||
          element.context.label ===
            OTHER_SETTINGS_FORM.ALLOWED_CURRENCY_TYPES.LABEL
        ) {
          message = `${element.context.label} ${t(VALIDATION_CONSTANT.MUST_BE_ONLY_CHARACTERS)}`;
        } else if (element.context.label === BASIC_FORM_FIELD_CONFIG_STRINGS(t).LABEL) {
          message = BASIC_FORM_FIELD_CONFIG_STRINGS(t).INVALID_LABEL;
        } else {
          message = `${t(VALIDATION_CONSTANT.INVALID_CHARACTERS)}`;
        }
      } else if (element.message.includes(t(VALIDATION_CONSTANT.VALID_TEAMS_OR_USERS))) {
        if (element.path.length > 1 && element.path.length < 4) {
          error_list[element.path[0]] = element.message;
        } else if (element.path.length > 3) {
          error_list[`${element.path[0]},${element.path[1]},${element.path[2]}`] = element.message;
        }
      } else if (element?.type?.includes?.('string.min')) {
        if (element.context.label === SIGN_IN_PASSWORD) message = t(VALIDATION_CONSTANT.INVALID_PASSWORD);
        else message = element.message.replace(/"/g, '');
      } else if (element?.type?.includes?.('any.only')) {
        if (element.context.label === CONFIRM_PASSWORD_LABEL) message = t(VALIDATION_CONSTANT.PASSWORD_MISMATCH);
        else message = element.message;
      } else if (element?.type?.includes?.('array.min')) {
        if (element.context.label === FLOW_STRINGS.STEPS.ID) message = t(VALIDATION_CONSTANT.ATLEAST_ONE_STEP_REQUIRED);
        else message = element.message;
      } else if (element?.type?.includes?.('object.min')) {
        if (element.context.label === ACTORS.MEMBER_OR_TEAM.ASSIGN_TO.ID) message = i18next.t(VALIDATION_CONSTANT.ASSIGN_ONE_USER_OR_TEAM_FOR_TASK);
        else if (element.context.label === 'assignees') message = t(VALIDATION_CONSTANT.ATLEAST_ONE_ACTOR_REQUIRED);
        else if (element.context.label === 'Viewers') message = t(VALIDATION_CONSTANT.ATLEAST_ONE_VIEWER_REQUIRED);
        else if (element.context.label === 'Owners') message = t(VALIDATION_CONSTANT.ATLEAST_ONE_OWNER_REQUIRED);
        else if (element.context.label === 'entry adders') message = t(VALIDATION_CONSTANT.ATLEAST_ONE_ADDER_REQUIRED);
        else message = element.message;
      } else if (element?.type?.includes?.('any.invalid')) {
        if (element.context.label === NEW_PASSWORD) message = t(VALIDATION_CONSTANT.SAME_NEW_PASSWORD);
        else message = element.message;
      } else if (element?.type?.includes?.('number.min')) {
        if (
          element.context.key === 'maximum_file_size'
        ) message = `${t(VALIDATION_CONSTANT.MAXIMUM_FILE_SIZE)} ${t(VALIDATION_CONSTANT.GREATER_THAN_OR_EQUAL_TO_ONE)}`;
        else message = element.message;
      } else if (
        element?.message?.includes?.(t(VALIDATION_CONSTANT.DUPLICATE_VALUE))
      ) {
        message = `${element.context.label} ${t(VALIDATION_CONSTANT.HOLD_DUPLICATE)}`;
      } else if (
        element?.message?.includes?.(t(VALIDATION_CONSTANT.MUST_BE_ONE_OF))
      ) {
        message = `${element.context.label} mismatch`;
      } else if (element?.type?.includes?.('date.min')) {
        message = `${element.context.label} ${t(VALIDATION_CONSTANT.GREATER_THAN_START_TIME)}`;
      } else if (element?.type?.includes?.('any.custom')) {
        if (element.message.includes('domain part')) message = `${element.context.label} ${t(VALIDATION_CONSTANT.DOMAIN_VALIDATION)}`;
        else if (element.message.includes(t(VALIDATION_CONSTANT.VALID_EMAIL_TEXT))) message = `${element.context.label} ${t(VALIDATION_CONSTANT.VALID_EMAIL)}`;
        else if (element.message.includes(t(VALIDATION_CONSTANT.VALID_LINK_TEXT))) message = `${element.context.label} ${t(VALIDATION_CONSTANT.VALID_LINK)}`;
      } else message = element.message.replace(/"/g, '');

      let { key } = element.context;
      if (key !== element.path[0]) {
        key = generateFieldId(element.path[0], element.path[1]);
        // if (element.path[element.path.length - 1]) key = element.path[element.path.length - 1];
        if (element.path.length > 1) {
          key = element.path.map((path) => path);
          console.log(typeof key);
          // key = key.replace(',', '.');
        }
      } else {
        if (element?.type === 'array.unique' && element?.path?.length > 0) {
          key = element.path.join();
        }
      }
      if (element.path[0] === 'steps' && element.path[1] + 1) error_list.step_order = element.path[1] + 1;
      if (!error_list[key]) {
        error_list[key] = message;
      }
      message = null;

      if (element.message.includes('length must be at least')) {
        message = `${element.context.label} ${t(VALIDATION_CONSTANT.LENGTH_MUST_BE_ATLEAST)} ${element.context.limit} ${t(VALIDATION_CONSTANT.CHARACTERS_LONG)}`;
        error_list[key] = message;
      }
      if (element.message.includes('length must be less than or equal to')) {
        message = `${element.context.label} ${t(VALIDATION_CONSTANT.LENGTH_MUST_BE_LESS_THAN_OR_EQUAL)} ${element.context.limit} ${t(VALIDATION_CONSTANT.CHARACTERS_LONG)}`;
        error_list[key] = message;
      }
    });
  }
  console.log('task error joi inside1', error_list);
  return error_list;
};

export const validate = (data, schema, t = translateFunction) =>
  generateValidationMessage(joiValidate(data, schema), t);
// **** joi utils end ******
// **** popover utils start ******
export const updateFormPopOverStatus = (obj) => {
  store.dispatch(actions.formPopOverStatusAction(obj));
};

export const updateEditConfirmPopOverStatus = (obj) => {
  store.dispatch(actions.editConfirmPopOverStatusAction(obj));
};

export const updateConfirmPopover = (data) => {
  store.dispatch(actions.setConfirmPopoverAction(data));
};

export const clearConfirmPopover = () => {
  store.dispatch(actions.clearConfirmPopoverAction());
};

export const updateAlertPopverStatus = (obj) => {
  store.dispatch(actions.alertPopOverStatusAction(obj));
};

export const showToastPopover = (title = EMPTY_STRING, subtitle = EMPTY_STRING, status = EToastType.success, isFormStatus = false) => {
  let toastStatus = status;
  if (isFormStatus) {
    if (status === FORM_POPOVER_STATUS.SERVER_ERROR) {
      toastStatus = EToastType?.error;
    } else if (status === FORM_POPOVER_STATUS.SUCCESS) {
      toastStatus = EToastType?.success;
    } else if (status === FORM_POPOVER_STATUS.DELETE) {
      toastStatus = EToastType?.info;
    }
  }
  return toastPopOver({
    title,
    subtitle,
    toastType: toastStatus,
  });
};

export const updateErrorPopoverInRedux = (obj, serverError) => {
  const error_object = obj;
  if (!jsUtils.isEmpty(serverError)) {
    error_object.subTitle = serverError;
    showToastPopover(
      error_object?.title,
      error_object?.subTitle,
      FORM_POPOVER_STATUS.SERVER_ERROR,
      true,
    );
  }
};

export const clearAlertPopOverStatus = () => {
  store.dispatch(actions.clearAlertPopOverStatusAction());
};

export const getAppMode = (history) => {
  const pathname = get(history, ['location', 'pathname'], EMPTY_STRING);
  if (!pathname) return APP_MODE.DEV;
  const isDev = (pathname || EMPTY_STRING).split('/').includes(ROUTE_CONSTANTS.DEV_USER.replaceAll('/', ''));
  const { role } = store.getState().RoleReducer;
  return (isDev && role !== ROLES.MEMBER) ? APP_MODE.DEV : APP_MODE.USER;
};

export const getUserRoutePath = (link) => link;

export const getDefaultAppRoutePath = (link) => `${ROUTE_CONSTANTS.DEFAULT_APP_ROUTE}${link}`;

export const getDevRoutePath = (link) => {
  const { role } = store.getState().RoleReducer;
  if (role !== ROLES.MEMBER) {
    return `${ROUTE_CONSTANTS.DEV_USER}${link}`;
  } else {
    return `${ROUTE_CONSTANTS.DEFAULT_APP_ROUTE}${link}`;
  }
};

export const getRouteLink = (link, history) => {
  const mode = getAppMode(history);
  const { role } = store.getState().RoleReducer;
  if (mode === APP_MODE.USER) {
    return getUserRoutePath(link);
  } else {
    if (role !== ROLES.MEMBER) {
      return getDevRoutePath(link);
    } else {
      return getUserRoutePath(link);
    }
  }
};

export const routeNavigate = (history, routeMethod = ROUTE_METHOD.PUSH, link = EMPTY_STRING, searchParams = EMPTY_STRING, historyState = {}, isDirectLink = false) => {
  const routeDetails = {};
  if (!jsUtils.isEmpty(link)) {
    if (isDirectLink) routeDetails.pathname = link;
    else routeDetails.pathname = getRouteLink(link, history);
  }
  if (!jsUtils.isEmpty(searchParams)) {
    routeDetails.search = searchParams;
  }
  if (!jsUtils.isEmpty(historyState)) routeDetails.state = historyState;

  if (routeMethod === ROUTE_METHOD.GO_BACK || routeMethod === ROUTE_METHOD.GO_FORWARD) {
    delete routeDetails.pathname;
  }
  history[routeMethod]?.(routeDetails);
};

export const createTaskExit = (t = translateFunction, history, callBack) => {
  updateAlertPopverStatus({
    isVisible: true,
    customElement: (
      <UpdateConfirmPopover
        onYesHandler={async () => {
          if (callBack) {
            const res = await callBack();
            if (!res) return clearAlertPopOverStatus();
          }
          routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
          return clearAlertPopOverStatus();
        }}
        onNoHandler={() => clearAlertPopOverStatus()}
        title={t(FORM_POPOVER_STRINGS.CLOSE_POPOVER)}
        subTitle={POP_OVER_STATUS.CREATE_TASK_EXIT.SUB_TITLE}
      />
    ),
  });
};

export const createDataSetExit = (t = translateFunction, history, callBack) => {
  updateAlertPopverStatus({
    isVisible: true,
    // title: "Are you sure you want to discard the Data List Creation?",
    // routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
    customElement: (
      <UpdateConfirmPopover
        onYesHandler={async () => {
          if (callBack) await callBack();
          routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
          clearAlertPopOverStatus();
        }}
        onNoHandler={() => clearAlertPopOverStatus()}
        title={t(FORM_POPOVER_STRINGS.CLOSE_POPOVER)}
        subTitle={POP_OVER_STATUS.CREATE_TASK_EXIT.SUB_TITLE}
      />
    ),
  });
};

export const editFlowExit = (t = translateFunction, history, callBack) => {
  updateAlertPopverStatus({
    isVisible: true,
    customElement: (
      <UpdateConfirmPopover
        onYesHandler={async () => {
          if (callBack) await callBack();
          routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
          clearAlertPopOverStatus();
        }}
        onNoHandler={() => clearAlertPopOverStatus()}
        title={t(FORM_POPOVER_STRINGS.CLOSE_POPOVER)}
        subTitle={POP_OVER_STATUS.CREATE_TASK_EXIT.SUB_TITLE}
      />
    ),
  });
};

export const editDataListExit = (t = translateFunction, history, callBack) => {
  updateAlertPopverStatus({
    isVisible: true,
    customElement: (
      <UpdateConfirmPopover
        onYesHandler={async () => {
          if (callBack) await callBack();
          routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME);
          clearAlertPopOverStatus();
        }}
        onNoHandler={() => clearAlertPopOverStatus()}
        title={t(FORM_POPOVER_STRINGS.CLOSE_POPOVER)}
        subTitle={POP_OVER_STATUS.CREATE_TASK_EXIT.SUB_TITLE}
      />
    ),
  });
};

export const editDiscardExit = (history, editMode) => {
  if (editMode === 'DL') {
    const dataListOverviewPathName = `${ROUTE_CONSTANTS.LIST_DATA_LIST}overview`;
    routeNavigate(history, ROUTE_METHOD.PUSH, dataListOverviewPathName);
  } else {
    const flowPublishedPathName = `${ROUTE_CONSTANTS.LIST_FLOW}${ROUTE_CONSTANTS.ALL_PUBLISHED_FLOWS}`;
    routeNavigate(history, ROUTE_METHOD.PUSH, flowPublishedPathName);
  }
};

export const editReportExit = (t = translateFunction, callBack, history = null, pathname = null) => {
  updateAlertPopverStatus({
    isVisible: true,
    customElement: (
      <UpdateConfirmPopover
        onYesHandler={async () => {
          if (callBack) await callBack();
          if (history && pathname) {
            routeNavigate(history, ROUTE_METHOD.PUSH, pathname);
          }
          clearAlertPopOverStatus();
        }}
        onNoHandler={() => clearAlertPopOverStatus()}
        title={t(FORM_POPOVER_STRINGS.CLOSE_POPOVER)}
      />
    ),
  });
};
export const handleBlockedNavigation = (t = translateFunction, callBack, history, location) => {
  updateAlertPopverStatus({
    isVisible: true,
    customElement: (
      <UpdateConfirmPopover
        alertIcon={<div className={gClasses.AlertCircle}><AlertCircle /></div>}
        // titleStyle={gClasses.FTwo13BlackV13}
        subtitleStyle={gClasses.FTwo13RedV18}
        onYesHandler={async () => {
          clearAlertPopOverStatus();
          if (callBack) await callBack();
          if (history) {
            if (location?.state?.userSettingsModal) {
              routeNavigate(history, ROUTE_METHOD.REPLACE, ROUTE_CONSTANTS.HOME, EMPTY_STRING, location.state);
            } else routeNavigate(history, ROUTE_METHOD.REPLACE, location?.pathname, location?.search, location?.state, true);
          }
        }}
        onNoHandler={() => clearAlertPopOverStatus()}
        title={t(FORM_POPOVER_STRINGS.CLOSE_POPOVER)}
        subTitle={t(FORM_POPOVER_STRINGS.CHANGES_NOT_SAVED)}
      />
    ),
  });
};

export const createTeamExit = (history) => {
  updateConfirmPopover({
    isVisible: true,
    title: POP_OVER_STATUS.CREATE_TEAM_EXIT.TITLE,
    onConfirm: () => routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.ADMIN_HOME),
  });
};

export const onFileSizeExceed = (maximum_file_size) => {
  showToastPopover(
    POP_OVER_STATUS.FILE_SIZE_EXCEED.TITLE,
    `${POP_OVER_STATUS.FILE_SIZE_EXCEED.SUB_TITLE} ${maximum_file_size}MB`,
    FORM_POPOVER_STATUS.SERVER_ERROR,
    true,
  );
};
// **** popover utils end ******
// ***********************************************************************************************************

/** @module helper * */
/**
 * @memberof helper
 */
/**
 * @function mergeObjects
 * @description To merge two objects
 * @param   {Object} obj1 first object
 * @param   {Object} obj2 second object
 * @return  {Object}
 */
export const mergeObjects = (obj1, obj2) => {
  const value1 = jsUtils.omitBy(obj1, jsUtils.isNil);
  const value2 = jsUtils.omitBy(obj2, jsUtils.isNil);
  const mergedObject = jsUtils.merge(value1, value2);
  return mergedObject;
};
/**
 * @memberof helper
 */
/**
 * @function compareObjects
 * @description To compare two objects
 * @param   {Object} obj1 first object
 * @param   {Object} obj2 second object
 * @return  {boolean}
 */
export const compareObjects = (object1, object2) => {
  if (jsUtils.isEqual(object1, object2)) return true;
  return false;
};
/**
 * @memberof helper
 */
/**
 * @function nullCheckAndReturnValueOrEmptyString
 * @description To return value or empty string based on empty condition check
 * @param   {string} value value
 * @return  empty string or value
 */
export const nullCheckAndReturnValueOrEmptyString = (value) => {
  if (jsUtils.isEmpty(value)) return EMPTY_STRING;
  return value;
};
/**
 * @memberof helper
 */
/**
 * @function nullCheckAndReturnValueOrBool
 * @description To return value or false based on empty condition check
 * @param   {string} value value
 * @return  false or value
 */
export const nullCheckAndReturnValueOrBool = (value) => {
  if (jsUtils.isEmpty(value)) return false;
  return value;
};

/**
 * @memberof helper
 */
/**
 * @function getUserProfileData
 * @description To return user profile data based on role
 * @return object or null
 */
export const getUserProfileData = () => {
  switch (store.getState().RoleReducer.role) {
    case ROLES.ADMIN:
      return store.getState().AdminProfileReducer.adminProfile;
    case ROLES.MEMBER:
      return store.getState().MemberProfileReducer.memberProfile;
    case ROLES.FLOW_CREATOR:
      return store.getState().DeveloperProfileReducer
        .flowCreatorProfile;
    default:
      return null;
  }
};

export const getProfileDataForChat = () => {
  const profileData = getUserProfileData();
  if (profileData) {
    return {
      user: profileData.email,
      profile_pic: profileData.profile_pic,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      account_id: profileData.account_id,
      id: profileData.id,
      socket: profileData.socket,
      account_domain: profileData.account_domain,
      notificationSocket: profileData.notificationSocket,
    };
  }
  return {};
};
export const setUserProfileData = (data) => {
  switch (store.getState().RoleReducer.role) {
    case ROLES.ADMIN:
      store.dispatch(
        actions.adminProfileAction({
          ...store.getState().AdminProfileReducer.adminProfile,
          ...data,
        }),
      );
      break;
    case ROLES.FLOW_CREATOR:
      store.dispatch(
        actions.flowCreatorProfileAction({
          ...store.getState().DeveloperProfileReducer
            .flowCreatorProfile,
          ...data,
        }),
      );
      break;
    case ROLES.MEMBER:
      store.dispatch(
        actions.memberProfileAction({
          ...store.getState().MemberProfileReducer.memberProfile,
          ...data,
        }),
      );
      break;
    default:
      break;
  }
};
/**
 * @memberof helper
 */
/**
 * @function getFileSizeInMB
 * @description converts MB to bytes
 * @return {number}
 */
export const getFileSizeInBytes = (fileSize) => {
  if (!jsUtils.isEmpty(fileSize)) return parseInt(fileSize, 10) * DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES;
  return DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES;
};
/**
 * @memberof helper
 */
/**
 * @function getLogoSize
 * @description To return maximum file size configured by admin or user
 * @return {number}
 */
export const getLogoSize = (isInMB = false) => {
  let maxFileSize = DEFAULT_FILE_UPLOAD_SIZE_IN_MB;
  const { RoleReducer, AdminProfileReducer, MemberProfileReducer, DeveloperProfileReducer } = store.getState();
  switch (RoleReducer.role) {
    case ROLES.ADMIN:
      maxFileSize = AdminProfileReducer.adminProfile.maximum_file_size || DEFAULT_FILE_UPLOAD_SIZE_IN_MB;
      break;
    case ROLES.MEMBER:
      maxFileSize = MemberProfileReducer.memberProfile.maximum_file_size || DEFAULT_FILE_UPLOAD_SIZE_IN_MB;
      break;
    case ROLES.FLOW_CREATOR:
      maxFileSize = DeveloperProfileReducer.flowCreatorProfile.maximum_file_size || DEFAULT_FILE_UPLOAD_SIZE_IN_MB;
      break;
    default:
      break;
    }
    return isInMB ?
        parseInt(maxFileSize, 10) :
        parseInt(maxFileSize, 10) * DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES;
};
/**
 * @memberof helper
 */
/**
 * @function hexToRgbA
 * @param {string} hex Hexadecimal value
 * @param {string} value opacity
 * @description Color code conversion from hexadecimal to RGB
 * @return {string} or error
 */
export function hexToRgbA(hex, opacity) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(
      ',',
    )},${opacity})`;
  }
  throw new Error('Bad Hex');
}

// test utility function
export const findByTestAttribute = (wrapper, val) =>
  wrapper.find(`[data-test="${val}"]`);

export const storeFactory = (initialState) =>
  createStore(rootReducer, initialState);
/**
 * @memberof helper
 */
/**
 * @function calcwidth
 * @param {string} x x axis
 * @param {string} y y axis
 * @param {string} width width
 * @description calculate width based on screen size
 * @return {string}
 */
export const calcwidth = (x, y, width) => {
  const val = (x / 100) * width - y;
  return val;
};
/**
 * @memberof helper
 */
/**
 * @function getFormDataFromJSON
 * @param {string} data json data
 * @description convert json to form data
 * @return {Object}
 */
export const getFormDataFromJSON = (data) => {
  const form_data = new FormData();
  Object.keys(data).forEach((key) => {
    // if(typeof data[key]===TYPE_OBJECT || typeof data[key]===TYPE_ARRAY)
    // form_data.append(key,JSON.stringify(data[key]))
    // else
    console.log(data[key] instanceof Blob);
    if (jsUtils.isArray(data[key])) {
      data[key].forEach((key_data) => {
        form_data.append(key, key_data);
      });
    } else form_data.append(key, data[key]);
  });
  return form_data;
};
/**
 * @memberof helper
 */
/**
 * @function hasOwn
 * @param {Object} obj object
 * @param {string} key key
 * @description to check whether given object has the key
 * @return {boolean}
 */
export const hasOwn = (obj, key) =>
  Object.prototype.hasOwnProperty.call(obj, key);
/**
 * @memberof helper
 */
/**
 * @function appendFormDataArrayOrObject
 * @param {Object} form_data json object
 * @description to construct form data in nested structures recursively
 * @return {Object} form data
 */
export const appendFormDataArrayOrObject = (form_data) => {
  FormData.prototype.appendRecursive = function formDataRecursion(data, wrapper) {
    Object.keys(data).forEach((key) => {
      let keyString = EMPTY_STRING;
      if (wrapper === EMPTY_STRING) keyString = key;
      else keyString = `${wrapper}[${key}]`;
      if (
        (!(data[key] instanceof File) &&
          !(data[key] instanceof Blob) &&
          typeof data[key] === 'object') ||
          data[key]?.constructor === Array
      ) {
        this.appendRecursive(data[key], keyString);
      } else {
        this.append(keyString, data[key]);
      }
    });
  };
  const formData = new FormData();
  const wrapper = EMPTY_STRING;
  formData.appendRecursive(form_data, wrapper);
  return formData;
};
/**
 * @memberof helper
 */
/**
 * @function updateFormPostOperationFeedback
 * @param {Object} data data
 * @description to invoke feedback operation after form submit
 * @return action to update feedback in redux
 */
export const updateFormPostOperationFeedback = (data) => {
  store.dispatch(actions.addFormFeedbackAction(data));
  setTimeout(() => {
    const feedbacks = cloneDeep(
      store.getState().FormPostOperationFeedbackReducer.feedbacks,
    );
    const index = feedbacks.findIndex((eachItem) => eachItem.id === data.id);
    feedbacks.splice(index, 1);
    store.dispatch(actions.updateFormFeedbackAction(feedbacks));
  }, 5000);
};
/**
 * @memberof helper
 */
/**
 * @function getServerErrorMessageObject
 * @param {Object} server_error error response from server
 * @param {Object} list_data list of data
 * @description construct error message based on server error response
 * @return {Object} error message object
 */
export const getServerErrorMessageObject = (server_error, list_data, type, t) => {
  let messageObject = null;
  if (!isEmpty(server_error)) {
    messageObject = {
      title: 'Oops',
      subTitle: server_error,
      type: RESPONSE_TYPE.SERVER_ERROR,
    };
  } else if (list_data.length === 0) {
    if (type === RESPONSE_TYPE.NO_TASK_FOUND) {
      messageObject = {
        title: 'There is no tasks!',
        type: RESPONSE_TYPE.NO_TASK_FOUND,
      };
      return messageObject;
    }
    if (type === RESPONSE_TYPE.DELETED) {
      messageObject = {
        title: 'Flow does not exist',
        subTitle: 'This flow has been deleted',
        type: RESPONSE_TYPE.DELETED,
      };
      return messageObject;
    }
    messageObject = {
      title: MESSAGE_OBJECT_STRINGS(t).TITLE,
      subTitle: MESSAGE_OBJECT_STRINGS(t).SUB_TITLE,
      type: RESPONSE_TYPE.NO_DATA_FOUND,
    };
  } else if (type === RESPONSE_TYPE.NO_DATA_FOUND) {
    messageObject = {
      title: MESSAGE_OBJECT_STRINGS(t).TITLE,
      subTitle: MESSAGE_OBJECT_STRINGS(t).SUB_TITLE,
      type: RESPONSE_TYPE.NO_DATA_FOUND,
    };
  }
  return messageObject;
};
/**
 * @memberof helper
 */
/**
 * @function reArrangeArray
 * @param {Object} list list to arrange
 * @param {string} from from
 * @param {string} to to
 * @description rearrange an array based on given from and to
 * @return {Object} error message object
 */
export const reArrangeArray = (list, from, to) => {
  const f = list.splice(from, 1)[0];
  list.splice(to, 0, f);
  return list;
};
/**
 * @memberof helper
 */
/**
 * @function getStringFileFromLanguage
 * @param {string} language
 * @description get strings based on language
 * @return {Object} string file
 */
export const getStringFileFromLanguage = (language) => {
  console.log(language);
  switch (language) {
    case LANGUAGES_LIST.ENGLISH:
      return {
        ADMIN_SETTINGS,
        USER_PROFILE,
        SIDE_NAV_BAR,
        LOGGED_IN_NAVBAR,
        FLOWS: FLOW_T_STRINGS,
        CHANGE_PASSWORD,
        CREATE_TASK,
        CHAT_STRINGS,
        LANDING_PAGE,
      };
    case LANGUAGES_LIST.SPANISH:
      return ONETHING_STRINGS_SPANISH;
    default:
      return {
        ADMIN_SETTINGS,
        USER_PROFILE,
        SIDE_NAV_BAR,
        LOGGED_IN_NAVBAR,
        FLOWS: FLOW_T_STRINGS,
        CHANGE_PASSWORD,
        CREATE_TASK,
        CHAT_STRINGS,
        LANDING_PAGE,
      };
  }
};
/**
 * @memberof helper
 */
/**
 * @function arryToDropdownData
 * @param {Array} array data
 * @description convert array to dropdown data
 * @return {Object} dropdown
 */
export const arryToDropdownData = (array) => {
  const dropdownData = [];

  array.forEach((data) => {
    if (!jsUtils.isEmpty(data.trim())) {
      dropdownData.push({
        [DROPDOWN_CONSTANTS.OPTION_TEXT]: data,
        [DROPDOWN_CONSTANTS.VALUE]: data,
      });
    }
  });

  return dropdownData;
};
/**
 * @memberof helper
 */
/**
 * @function getUserCardFromIndex
 * @param {Array} optionList data
 * @param {string} index
 * @description retreive user details from index
 * @return {Object} dropdown
 */
export const getUserCardFromIndex = (optionList, index) => {
  if (!jsUtils.isNull(index)) {
    return jsUtils.find(optionList, (option) => option.value === index)
      .userDetails;
  }
  return EMPTY_STRING;
};
/**
 * @memberof helper
 */
/**
 * @function reportError
 * @description error if any key not present in server
 */
export const reportError = (err) => console.log('Bad API Response', err);
/**
 * @memberof helper
 */
/**
 * @function normalizeIsEmpty
 * @param {Object} normalizeData
 * @param {function} resolve
 * @param {function} reject
 * @description check if data from server is not empty
 */
export const normalizeIsEmpty = (normalizeData, resolve, reject) => {
  const emptyError = {
    response: {
      status: 500,
    },
  };
  !jsUtils.isEmpty(normalizeData) || jsUtils.isArray(normalizeData) ? resolve(normalizeData) : reject(emptyError);
};
/**
 * @memberof helper
 */
/**
 * @function updateLanguage
 * @param {string} languageUrl
 * @description update language in system based on language url from server
 */
export const updateLanguage = (languageUrl) =>
  new Promise((resolve, reject) => {
    getLanguage(languageUrl)
      .then(async (languageResponse) => {
        const languageSettings = Object.freeze({
          language: 'english',
          strings: languageResponse,
        });
        store.dispatch(actions.updateLanguageAction(languageSettings));
        caches.open('language_strings').then((cache) => {
          cache
            .keys()
            .then((keys) =>
              Promise.all(
                keys.forEach((key) => {
                  console.log(
                    'keykey out',
                    languageUrl !== key.url,
                    languageUrl,
                    key.url,
                  );
                  if (languageUrl !== key.url) {
                    console.log('keykey', key);
                    cache.delete(key.url);
                  }
                }),

                cache.keys().then((keys) => {
                  console.log('keykey', keys);
                }),
              ))
            .catch((error) => {
              throw error;
            });
        });
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
  });
/**
 * @memberof helper
 */
/**
 * @function toIsAfterFromDate
 * @param {string} from
 * @param {string} to
 * @description check whether to date is after from date
 * @return {boolean}
 */
export const toIsAfterFromDate = (from, to) =>
  moment(to, 'YYYY-MM-DDThh:mm a').isAfter(moment(from, 'YYYY-MM-DDThh:mm a'));
/**
 * @memberof helper
 */
/**
 * @function updateDefaultLanguage
 * @description if language url is not present update default language string
 *  @return action to update language
 */
export const updateDefaultLanguage = () => {
  const languageStringObj = {
    ADMIN_SETTINGS,
    USER_PROFILE,
    SIDE_NAV_BAR,
    LOGGED_IN_NAVBAR,
    FLOWS: FLOW_T_STRINGS,
    CHANGE_PASSWORD,
    CREATE_TASK,
    CHAT_STRINGS,
    LANDING_PAGE,
  };
  const languageSettings = Object.freeze({
    language: 'english',
    strings: languageStringObj,
  });
  store.dispatch(actions.updateLanguageAction(languageSettings));
};
/**
 * @memberof helper
 */
/**
 * @function getReferenceNameError
 * @param {Object} error
 * @description construct reference name error message from server
 *  @return {string}
 */
export const getReferenceNameError = (error) => {
  if (error.response) {
    const server_error = error.response;
    if (server_error.data && server_error.data.errors) {
      if (server_error.data.errors[0].type === 'string.min') return 'Reference name should be minimum of 2 characters';
      if (server_error.data.errors[0].type === 'exist') return 'Reference name already exists';
    }
  }
  return null;
};

export const isBasicUserMode = (history = {}) => getAppMode(history) === APP_MODE.USER;

export const getFlowInstanceLink = (history, flowUuid, instanceId) => {
  const isNormalMode = isBasicUserMode(history);
  let routeLink;
  if (isNormalMode) {
    routeLink = `${ROUTE_CONSTANTS.FLOW_DASHBOARD}/${flowUuid}/${TAB_ROUTE.ALL_REQUEST}/${instanceId}`;
  } else {
    routeLink = `${ROUTE_CONSTANTS.FLOW_DASHBOARD}/${flowUuid}/${instanceId}`;
  }
  return getRouteLink(routeLink, history);
};

/**
 * @memberof helper
 */
/**
 * @function navigateToHome
 * @param {number} user_type
 * @param {Object} { isInviteUser, username, id }
 * @param {Object} history
 * @description common navigation to home for specific scenarios
 */
export const navigateToHome = (
  user_type,
  { isInviteUser, username, id },
  history,
) => {
  const searchParams = get(history, ['location', 'search'])
    ? getAllSearchParams(
        new URLSearchParams(get(history, ['location', 'search'])),
      )
    : null;
  let nextUrl = '';
  if (searchParams && !isEmpty(searchParams.nextUrl) && searchParams.nextUrl !== undefined && searchParams.nextUrl !== 'undefined') {
      nextUrl = searchParams.nextUrl;
  } else if (isInviteUser) {
    nextUrl = `${ROUTE_CONSTANTS.INVITE_USER_LOGIN}${id}?isManualLogin=1`;
    const homeState = { username, id };
    return routeNavigate(history, ROUTE_METHOD.PUSH, nextUrl, EMPTY_STRING, homeState, true);
  } else {
    switch (user_type) {
      case ROLES.ADMIN:
        nextUrl = ROUTE_CONSTANTS.ADMIN_HOME;
        break;
      case ROLES.MEMBER:
        nextUrl = ROUTE_CONSTANTS.MEMBER_HOME;
        break;
      case ROLES.FLOW_CREATOR:
        nextUrl = ROUTE_CONSTANTS.FLOW_CREATOR_HOME;
        break;
      default:
        break;
    }
  }
  console.log(
    'searchParams',
    nextUrl,
    searchParams,
    `${ROUTE_CONSTANTS.ADMIN_HOME}${nextUrl}`,
  );
  if (!isEmpty(nextUrl)) {
    if (searchParams && searchParams.session_id) {
      const homeSearchParams = `?session_id=${searchParams.session_id}`;
      return routeNavigate(history, ROUTE_METHOD.PUSH, nextUrl, homeSearchParams);
    } else {
      return routeNavigate(history, ROUTE_METHOD.PUSH, nextUrl);
    }
  }
  return null;
};
/**
 * @memberof helper
 */
/**
 * @function getFileNameFromServer
 * @param {Object} bytes
 * @description retrieve file name from the file details sent from server
 * @return {string} file name
 */
export const getFileNameFromServer = (fileObj) => {
  if (fileObj && fileObj.content_type && fileObj.filename) {
    const fileExtension = fileObj.content_type.split('/').pop();
    const fileName = [fileObj.filename, fileExtension].join(DOT);
    return fileName;
  }
  return EMPTY_STRING;
};
/**
 * @memberof helper
 */
/**
 * @function formatBytes
 * @param {Number} bytes // Size to convert
 * @param {Number} decimal // Convert size to how many decimals (default 2)
 * @description convert size into corresponig KB/MB or respective notation
 * @return {string} Size in Kb/MB or respective notation
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};
/**
 * @memberof helper
 */
/**
 * @function getTaskReferenceDocumentsFileObject
 * @param {Array} taskReferenceDocuments {Array of document ids}
 * @param {Array} document_url_details
 * @description construct file object for file preview and download
 * @return {Array} List of file object
 */
export const getTaskReferenceDocumentsFileObject = (
  taskReferenceDocuments,
  document_url_details,
) => {
  const files = [];
  document_url_details && document_url_details.forEach((document) => {
    if (taskReferenceDocuments.includes(document.document_id)) {
      console.log(
        'getTaskReferenceDocumentsFileObjectgetTaskReferenceDocumentsFileObject inside',
        document,
      );
      files.push({
        link: document.signedurl,
        size: document.original_filename.file_size,
        id: document.document_id,
        url: document.signedurl,
        file: {
          name: getFileNameFromServer(document.original_filename),
          type: document.original_filename.content_type,
          url: document.signedurl,
        },
      });
    }
  });
  console.log(
    'getTaskReferenceDocumentsFileObjectgetTaskReferenceDocumentsFileObject',
    files,
  );
  return files;
};

/**
 * @memberof helper
 */
/**
 * @function getCountryCodeDropdownList
 * @description customised country code dropdown
 * @return {Object} country code list
 */
export const getCountryCodeDropdownList = () =>
  countryCodeList.map((countryObj) => {
    return {
      label: `${countryObj.countryCodeId} ${countryObj.countryName}`,
      value: countryObj.countryCodeId,
      countryCode: countryObj.countryCode,
    };
  });
/**
 * @memberof helper
 */
/**
 * @function getSearchedCountryCodeDropdownList
 * @param {string} searchText
 * @description return country code list based on searched text
 * @return {string} file name
 */
export const getSearchedCountryCodeDropdownList = (searchText) => {
  let searchTextCap = jsUtils.capitalize(searchText);
  if (/^[0-9]+$/.test(searchTextCap)) searchTextCap = `+${searchText}`;
  if (/^\+[0-9]+$/.test(searchTextCap)) {
    const matches = getCountryCodeDropdownList().filter((country) => {
      if (jsUtils.startsWith(country.label.split(' ')[0], searchTextCap)) return true;
      return false;
    });
    return jsUtils.sortBy(matches, (country) =>
      Number(country.label.split(' ')[0].split('+')[1]));
  }
  return getCountryCodeDropdownList().filter((country) => {
    if (jsUtils.startsWith(country.label.split(' ')[1], searchTextCap)) {
      return true;
    }
    return false;
  });
};
/**
 * @memberof helper
 */
/**
 * @function onWindowResize
 * @param {function} callback
 * @description set event listener if window is resized
 */
export const onWindowResize = (callback) => {
  window.addEventListener('resize', callback);
};
/**
 * @memberof helper
 */
/**
 * @function getWindowWidth
 * @description return inner width of the screen
 */
export const getWindowWidth = () => window.innerWidth;
/**
 * @memberof helper
 */
/**
 * @function getWindowHeight
 * @description return inner height of the screen
 */
export const getWindowHeight = () => window.innerHeight;
/**
 * @memberof helper
 */
/**
 * @function isMobileScreen
 * @description return true if mobile screen else false
 * @return {boolean}
 */
export const isMobileScreen = () => window.innerWidth < 1024;
/**
 * @memberof helper
 */
/**
 * @function onSwipedUpOrDown
 * @param {Object} event
 * @description for mobile if swiped what should be dynamic top css set
 * @return {number} top
 */
export const onSwipedUpOrDown = (event) => {
  let top = Math.ceil(Math.abs(event.deltaY - event.initial[1]));
  // height-change-alert change in top pixel has to replicated in
  //  LCContainer in Typography.module.scss
  const windowHeight = getWindowHeight();
  if (top > windowHeight - 80) {
    top = windowHeight - 80;
  } else if (top < 65) {
    top = 65;
  }
  return top;
};
/**
 * @memberof helper
 */
/**
 * @function priorityTask
 * @param {number} deadline
 * @param {number} priority
 * @description return priority of task
 * @return {number}
 */
export const priorityTask = (deadline, priority) => {
  if (deadline < 0 && deadline * -1 < priority) return 1; // hight priority
  if (deadline > 0) return -1; // overdue
  return 0; // medium priority
};
/**
 * @memberof helper
 */
/**
 * @function addNotificationToTaskList
 * @param {Array} taskList
 * @param {Array} notificationArray
 * @param {number} maxCount
 * @description return notification on tasks list if new task arrived
 * @return {number}
 */
export const addNotificationToTaskList = (
  taskList,
  notificationArray,
  maxCount,
) => {
  const modifiedTaskList = [...taskList];
  notificationArray.forEach((notification) => {
    taskList.forEach((task, index) => {
      if (task.task_log_id === notification._id) {
        modifiedTaskList[index].notificationCount =
          notification.count > maxCount ? `${maxCount}+` : notification.count;
      }
    });
  });
  return modifiedTaskList;
};
/**
 * @memberof helper
 */
/**
 * @function getUserImagesForAvatar
 * @param {Array} users
 * @param {Array} teams
 * @param {Object} docUrlDetails
 * @description send if user image exists else send first letter from firstname and first letter from last name to construct image
 * @return {number}
 */
export const getUserImagesForAvatar = (users, teams, docUrlDetails) => {
  console.log('fsdgssg', users, teams, docUrlDetails);
  const userImages = [];
  const temp = jsUtils.concat(jsUtils.compact(users), jsUtils.compact(teams));
  temp.forEach((user) => {
    if (jsUtils.isArray(docUrlDetails) && docUrlDetails.length > 0) {
      let profilePicFound = false;
      docUrlDetails.forEach((docUrlDetail) => {
        if (
          docUrlDetail.document_id === user.profile_pic ||
          docUrlDetail.document_id === user.team_pic
        ) {
          profilePicFound = true;
          userImages.push({
            firstName: user.first_name,
            lastName: user.last_name,
            teamName: user.team_name,
            url: docUrlDetail.signedurl,
            id: user._id,
          });
        }
      });
      if (!profilePicFound) {
        userImages.push({
          firstName: user.first_name,
          lastName: user.last_name,
          teamName: user.team_name,
          id: user._id,
        });
      }
    } else {
      userImages.push({
        firstName: user.first_name,
        lastName: user.last_name,
        teamName: user.team_name,
        id: user._id,
      });
    }
  });
  return userImages;
};
/**
 * @memberof helper
 */
/**
 * @function validateEmailAndName
 * @param {string} inpString
 * @description check if name and email are valid
 * @return {string}
 */
export const validateEmailAndName = (inpString) => {
  const string = !jsUtils.isEmpty(inpString) ? inpString.trim() : EMPTY_STRING;
  let type = 'invalid';
  if (!jsUtils.isEmpty(string)) {
    if (string.match(EMAIL_REGEX)) {
      type = 'email';
    } else if (string.match(ALLOWED_EXTENSIONS_REGEX)) {
      if (string.match(ONLY_ALPHABETS_REGEX)) type = 'first_name';
      else if (string.match(FULL_NAME_REGEX)) type = 'full_name';
    }
  }
  return type;
};
/**
 * @memberof helper
 */
/**
 * @function trimString
 * @param {string} input
 * @description trim the given string
 * @return {string}
 */
export const trimString = (input) => {
  if (input && typeof input === 'string') {
    let trimmedString = input.trim(); // start and end
    trimmedString = trimmedString.replace(/\s{2,}/g, ' '); // middle
    return trimmedString;
  }
  return input;
};
/**
 * @memberof helper
 */
/**
 * @function isGeneratedRefName
 * @param {string} fieldName
 * @param {string} refName
 * @description if reference name generated return true else false
 * @return {boolean}
 */
export const isGeneratedRefName = (fieldName, refName) => {
  const refNameRegExp = RegExp(
    `^${jsUtils.snakeCase(fieldName)}jsUtils[0-9]+$`,
  );
  if (
    `${jsUtils.snakeCase(fieldName)}` === refName ||
    refNameRegExp.test(refName)
  ) return true;
  return false;
};
/**
 * @memberof helper
 */
/**
 * @function validatingRequiredFieldInDocuments
 * @param {Object} documentDetails
 * @param {string} requiredType
 * @description validate required field for document
 * @return {Object}
 */
export const validatingRequiredFieldInDocuments = (
  documentDetails,
  requiredType,
) => {
  if (jsUtils.nullCheck(documentDetails, 'file_metadata.0')) {
    return documentDetails.file_metadata.some(
      (file_info) => file_info.type === requiredType,
    );
  }
  return false;
};
/**
 * @memberof helper
 */
/**
 * @function snakeCaseToSentenceCase
 * @param {string} snakeString
 * @description convert snake case to sentence case
 * @return {string}
 */
export const snakeCaseToSentenceCase = (snakeString) => {
  if (snakeString) {
    const stringTokens = snakeString.split('jsUtils');
    return startCase(stringTokens.join(' '));
  }
  return snakeString;
};
/**
 * @memberof helper
 */
/**
 * @function generateApiErrorsAndHandleCatchBlock
 * @param {Object} errorData
 * @param {function} apiFailureAction
 * @param {boolean} errorPopoverData
 * @param {boolean} callPostOperations
 * @description to handle error messages sent from server and display message in frontend
 * @return {Object} error
 */
export const generateApiErrorsAndHandleCatchBlock = (
  errorData,
  apiFailureAction = {},
  errorPopoverData = false,
  callPostOperations = false,
) => {
  const { error, serverError = {}, labels = {} } = errorData;

  const { dispatch = false, action = false } = apiFailureAction;

  // generating errors
  const errors = generatePostServerErrorMessage(error, serverError, labels);

  // setting generated errors
  if (dispatch && action) {
    dispatch(
      action({
        common_server_error: errors.common_server_error || EMPTY_STRING,
        server_error: errors.state_error || [],
      }),
    );
  }

  if (errors.common_server_error) {
    const COMMON_ERROR_POPOVER_DATA = {
      title: 'Error',
      status: FORM_POPOVER_STATUS.SERVER_ERROR,
      isVisible: true,
    };

    // calling common server error popover
    updateErrorPopoverInRedux(
      COMMON_ERROR_POPOVER_DATA,
      startCase(errors.common_server_error),
    );
  } else if (errorPopoverData) {
    // calling error popover
    showToastPopover(
      errorPopoverData?.title,
      errorPopoverData?.subtitle || errorPopoverData?.subTitle,
      FORM_POPOVER_STATUS.SERVER_ERROR,
      true,
    );
  }

  // calling post operations
  if (callPostOperations) {
    updatePostLoader(false);
    setPointerEvent(false);
  }

  return errors;
};
/**
 * @memberof helper
 */
/**
 * @function openInNewTab
 * @param {string} url
 * @description open the given url in new tab
 */
export const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null;
};
/**
 * @memberof helper
 */
/**
 * @function stringLocaleNumericSort
 * @param {Array} arr
 * @description sort locale
 * @return {Array} sorted array
 */
export const stringLocaleNumericSort = (arr) =>
  arr.sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
/**
 * @memberof helper
 */
/**
 * @function getSortedListForFormField
 * @param {Array} fields
 * @description to sort the form fields
 * @return {Array} sorted form field list
 */
export const getSortedListForFormField = (fields) => {
  let new_list = [];
  if (typeof fields === 'string') {
    let list = fields.split(',');
    if (list) {
      list = list.map((eachItem) => trimString(eachItem));
      list = list.filter((eachItem) => eachItem !== '');
      list = Array.from(new Set(list));
    }
    new_list = list;
  } else if (Array.isArray(fields)) new_list = fields;
  else new_list = fields;
  return new_list;
};
/**
 * @memberof helper
 */
/**
 * @function getUsersAndTeamsIdList
 * @param {Object} usersAndTeams
 * @description to seperate users and teams
 * @return {Object}
 */
export const getUsersAndTeamsIdList = (usersAndTeams) => {
  let usersAndTeams_ = {};
  if (nullCheck(usersAndTeams, 'teams.length', true)) {
    usersAndTeams_ = {
      ...usersAndTeams_,
      teams: usersAndTeams.teams.map((eachTeam) => eachTeam._id),
    };
  }
  if (nullCheck(usersAndTeams, 'users.length', true)) {
    usersAndTeams_ = {
      ...usersAndTeams_,
      users: usersAndTeams.users.map((eachUser) => eachUser._id),
    };
  }
  return usersAndTeams_;
};
/**
 * @memberof helper
 */
/**
 * @function filterListBySearchValue
 * @param {Object} list_
 * @param {string} search_text
 * @param {boolean} isTimeZone
 * @description to filter list based on search
 * @return {Object}
 */
export const filterListBySearchValue = (list_, search_text, isTimeZone) => {
  let list = list_;
  if (search_text) {
    if (isTimeZone) {
      list = list_.filter(
        (str) =>
          ((str.label).toString() &&
          (str.label).toString().toLowerCase().includes(search_text.toLowerCase())) ||
          (str.Country &&
            str.Country.toLowerCase().includes(search_text.toLowerCase())),
      );
    } else {
      list = list_.filter(
        (str) =>
        (str.label)?.toString() &&
        (str.label)?.toString()?.toLowerCase()?.includes(search_text.toLowerCase()),
      );
    }
  }
  console.log('RETURNED LIST', list);
  return list;
};
/**
 * @memberof helper
 */
/**
 * @function findIndextBySearchValue
 * @param {Object} list_
 * @param {string} search_text
 * @param {boolean} isTimeZone
 * @description to filter list based on search
 * @return {Object}
 */
 export const findIndexBySearchValue = (list_, search_text, isTimeZone) => {
  let index = -1;
  if (search_text) {
    if (isTimeZone) {
      index = list_.findIndex(
        (str) =>
          ((str.label).toString() &&
           (str.label).toString().toLowerCase().includes(search_text.toLowerCase())) ||
          (str.Country &&
            str.Country.toLowerCase().includes(search_text.toLowerCase())),
      );
    } else {
      index = list_.findIndex(
        (str) =>
        (str.label).toString() &&
        (str.label).toString().toLowerCase().includes(search_text.toLowerCase()),
      );
    }
  }
  console.log('RETURNED LIST', index);
  return index;
};
/**
 * @memberof helper
 */
/**
 * @function generateEscapeString
 * @param {string} value
 * @param {boolean} allowNewline
 * @description to generate escape string for regular expression
 * @return {Object}
 */
const generateEscapeString = (value, allowNewline) => {
  const escapeChar = [
    '\\',
    '[',
    '^',
    '$',
    '.',
    '|',
    '?',
    '*',
    '+',
    '(',
    ')',
    '/',
    '{',
    '}',
    ']',
    '-',
  ];
  let result = value;
  escapeChar.forEach((item) => {
    const regex = RegExp(`\\${item}`, 'g');
    result = result.replace(regex, `\\${item}`);
  });
  if (allowNewline) return `${result}\r\n`;
  return result;
};
/**
 * @memberof helper
 */
/**
 * @function regexFormattedString
 * @param {string} value
 * @param {boolean} exactMatch
 * @param {boolean} allowNewline
 * @description to format the regaulr expression
 * @return {Object}
 */
export const regexFormattedString = (
  value,
  exactMatch = false,
  allowNewline,
) => {
  if (isEmpty(value)) return RegExp(value);
  let result = generateEscapeString(value, allowNewline);
  if (exactMatch) {
    result = `^${result}$`;
  }
  console.log('getValidationsForSingleLineresult', result);

  return result;
};
/**
 * @memberof helper
 */
/**
 * @function unionUsersAndTeams
 * @param {Object} usersAndTeams
 * @description to combine users and teams into single array
 * @return {Array}
 */
export const unionUsersAndTeams = (usersAndTeams) => {
  let unionedUserAndTeams = [];
  if (usersAndTeams && usersAndTeams.teams) {
    unionedUserAndTeams = jsUtils.union(
      unionedUserAndTeams,
      usersAndTeams.teams,
    );
  }
  if (usersAndTeams && usersAndTeams.users) {
    unionedUserAndTeams = jsUtils.union(
      unionedUserAndTeams,
      usersAndTeams.users,
    );
  }
  return unionedUserAndTeams;
};
/**
 * @memberof helper
 */
/**
 * @function getUsersAndTeamsIdObj
 * @param {Object} usersAndTeams
 * @description to get user and team id from list
 * @return {Array}
 */
export const getUsersAndTeamsIdObj = (usersAndTeams) => {
  const usersAndTeamsId = {};
  if (
    nullCheck(usersAndTeams, 'teams.length', true) ||
    nullCheck(usersAndTeams, 'users.length', true)
  ) {
    if (nullCheck(usersAndTeams, 'teams.length', true)) {
      usersAndTeamsId.teams = usersAndTeams.teams.map(
        (eachTeam) => eachTeam._id,
      );
    }
    if (nullCheck(usersAndTeams, 'users.length', true)) {
      usersAndTeamsId.users = usersAndTeams.users.map(
        (eachUser) => eachUser._id,
      );
    }
  }
  return usersAndTeamsId;
};

export const getSplittedUsersAndTeamsIdObjFromArray = (usersAndTeamsArray) => {
  const usersAndTeamsId = {};
  Array.isArray(usersAndTeamsArray) &&
    usersAndTeamsArray.forEach((eachUserOrTeam) => {
      if (eachUserOrTeam.email) {
        if (!jsUtils.has(usersAndTeamsId, 'users')) usersAndTeamsId.users = [];
        usersAndTeamsId.users.push(eachUserOrTeam._id);
      } else if (eachUserOrTeam.team_name) {
        if (!jsUtils.has(usersAndTeamsId, 'teams')) usersAndTeamsId.teams = [];
        usersAndTeamsId.teams.push(eachUserOrTeam._id);
      }
    });
  if (jsUtils.isObject(usersAndTeamsArray)) {
    if (!jsUtils.isEmpty(usersAndTeamsArray.users)) {
      usersAndTeamsArray.users.forEach((user) => {
        if (!jsUtils.has(usersAndTeamsId, 'users')) usersAndTeamsId.users = [];
        if (user.email) usersAndTeamsId.users.push(user._id);
        else usersAndTeamsId.users.push(user);
      });
    }
    if (!jsUtils.isEmpty(usersAndTeamsArray.teams)) {
      if (!jsUtils.has(usersAndTeamsId, 'teams')) usersAndTeamsId.teams = [];
      usersAndTeamsArray.teams.forEach((team) => {
        if (team.team_name) usersAndTeamsId.teams.push(team._id);
        else usersAndTeamsId.teams.push(team);
      });
    }
  }
  return usersAndTeamsId;
};

export const getUsersAndTeamsMergedArrayFromObject = (usersAndTeamsObj) => [
  ...get(usersAndTeamsObj, 'users', []),
  ...get(usersAndTeamsObj, 'teams', []),
];

/**
 * @memberof helper
 */
/**
 * @function calculateVerticalCardCountFromRef
 * @param {ref} containerRef
 * @param {number} usersAndTeams
 * @param {number} usersAndTeams
 * @param {number} usersAndTeams
 * @description to get no of cards to display from ref
 * @return {number}
 */
export const calculateVerticalCardCountFromRef = (
  containerRef,
  eachCardHeight,
  extraHeight = 0,
  minCount = 5,
) => {
  if (nullCheck(containerRef, 'current.clientHeight') && eachCardHeight) {
    return Math.max(
      Math.floor(
        (containerRef.current.clientHeight - extraHeight) / eachCardHeight,
      ),
      minCount,
    );
  }
  return minCount;
};

/**
 * @memberof helper
 */
/**
 * @function chunkStringToArray
 * @param {string} str
 * @param {number} len
 * @description to get Strings to Split array
 * @return {Array}
 */
export const chunkStringToArray = (str, len = 20) => {
  if (typeof str !== TYPE_STRING) {
    return [];
  }

  const arrSplitWords = str.split(SPACE);
  const arrSentence = [];
  let sentence = EMPTY_STRING;
  for (let index = 0; index < arrSplitWords.length; index++) {
    sentence += index === 0 ? arrSplitWords[index] : ` ${arrSplitWords[index]}`;
    const lengthCheck = index + 1;
    if (lengthCheck < arrSplitWords.length) {
      let checkSentence = sentence;
      checkSentence += arrSplitWords[lengthCheck];
      if (checkSentence.length > len) {
        arrSentence.push(sentence);
        sentence = EMPTY_STRING;
      }
    } else {
      arrSentence.push(sentence);
    }
  }
  return arrSentence;
};

/**
 * @memberof helper
 */
/**
 * @function getStringAndSubString
 * @param {any} inputData
 * @param {any} type
 * @param {number} length
 * @param {string} name
 * @param {array} fieldValues
 * @description to get Any to String and Substring
 * @return {object}
 */
export const getStringAndSubString = (
  inputData,
  t,
  type = FIELD_TYPE.SINGLE_LINE,
  length = 12,
  omission = '...',
  // name = null,
  // fieldValues = [],
) => {
  const ret = { str: EMPTY_STRING, subStr: EMPTY_STRING };
  const truncateOption = {
    length,
    omission,
  };
  if (jsUtils.isEmpty(inputData)) {
    return ret;
  }
  if (jsUtils.isArray(inputData)) {
    let str = EMPTY_STRING;
    inputData.forEach((data) => {
      const _data = getFieldDataByType(data, type, t);
      str += `${_data}, `;
    });
    if (!jsUtils.isEmpty(str)) {
      str = str.trim();
      str = str.substring(0, str.length - 1);
    }
    ret.str = str;
    ret.subStr = jsUtils.truncate(str, truncateOption);
    return ret;
  }
  if (jsUtils.isObject(inputData) && FIELD_TYPE.USER_TEAM_PICKER === type) {
    const arrUserTeamPicker = getSelectedUserTeamPickerDataForFilter(inputData);
    const str = arrUserTeamPicker.join(', ');
    ret.str = str;
    ret.subStr = jsUtils.truncate(str, truncateOption);
    return ret;
  }
  if (typeof inputData === 'string') {
    ret.str = getFieldDataByType(inputData, type, t);
    ret.subStr = jsUtils.truncate(inputData, truncateOption);
    return ret;
  }
  return ret;
};

/**
 * @memberof helper
 */
/**
 * @function getRankingWordsAdded
 * @param {int} inputData
 * @description to get Ranking Words Added.
 * @return {string}
 */
export const getRankingWordsAdded = (inputData) => {
  if (!inputData) {
    return EMPTY_STRING;
  }
  switch (inputData) {
    case 1:
      return `${inputData}st`;
    case 2:
      return `${inputData}nd`;
    case 3:
      return `${inputData}rd`;
    default:
      return `${inputData}th`;
  }
};

// GENERATOR UTILS
export { GetButtonStyle as getButtonStyle, getFullName } from './generatorUtils';

export const isEmail = (emailId) =>
  /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(
    emailId,
  );
export const isValidEmail = (emailId) =>
  EMAIL_REGEX_BASIC.test(
    emailId,
  );
export const defaultApiErrorPopover = (subTitle) => {
  showToastPopover(
    'Something went wrong!',
    subTitle,
    FORM_POPOVER_STATUS.SERVER_ERROR,
    true,
  );
};

export const isDevEnv = () => process.env.NODE_ENV === 'development';

export const calculateColCountForPagination = ({
  ref,
  cardWidth,
  colMinCount,
}) => {
  let minCount = colMinCount.lg;
  if (nullCheck(ref, 'current.clientWidth')) {
    const width = ref.current.clientWidth;
    if (width <= 576) minCount = colMinCount.sm;
    else if (width <= 768) minCount = colMinCount.md;
    else minCount = colMinCount.lg;
    const initialCount = Math.floor(width / cardWidth);
    const gutter = (initialCount - 1) * 20;
    return Math.max(Math.floor((width - gutter) / cardWidth), minCount);
  }
  return colMinCount;
};
export const calculatePaginationDataCount = ({
  ref,
  cardWidth,
  cardHeight,
  rowMinCount,
  colMinCount,
}) => {
  if (
    nullCheck(ref, 'current.clientWidth') &&
    nullCheck(ref, 'current.clientHeight')
  ) {
    const height = ref.current.clientHeight;
    const initialCount = Math.floor(height / cardHeight);
    const gutter = (initialCount - 1) * 20;
    const rowCount = Math.floor((height - gutter) / cardHeight);
    const colCount = calculateColCountForPagination({
      ref,
      cardWidth,
      colMinCount,
    });
    return Math.max(rowCount * colCount, rowMinCount);
  }
  return rowMinCount;
};

export const getRemainingDataCount = (total, rendered) => {
  const remainingCount = total - rendered;
  if (remainingCount > 0) {
    return {
      isRemainingDataExists: true,
      label: `+${remainingCount} More`,
      count: remainingCount,
    };
  }
  return {
    isRemainingDataExists: false,
  };
};

export const removeFieldByAttribute = (array, attribute, value) => {
  let arrayLength = array.length;
  while (arrayLength--) {
    if (
      array[arrayLength] &&
      jsUtils.has(array[arrayLength], attribute) &&
      array[arrayLength][attribute] === value
    ) {
      array.splice(arrayLength, 1);
    }
  }
  return array;
};

/**
 * @memberof helper
 */
/**
 * @function getFileSize
 * @param {int} byte
 * @description to get the file size.
 * @return {string}
 */
export const getFileSize = (byte) => {
  const ALL_BYTE_VALUE = {
    YB: { value: 10 ** 24, byte_unit: 'YB' },
    ZB: { value: 10 ** 21, byte_unit: 'ZB' },
    EB: { value: 10 ** 18, byte_unit: 'EB' },
    PB: { value: 10 ** 15, byte_unit: 'PB' },
    TB: { value: 10 ** 12, byte_unit: 'TB' },
    GB: { value: 10 ** 9, byte_unit: 'GB' },
    MB: { value: 10 ** 6, byte_unit: 'MB' },
    KB: { value: 10 ** 3, byte_unit: 'kB' },
    B: { value: 1, byte_unit: 'B' },
  };

  let calculatedByteObj = null;

  if (byte >= ALL_BYTE_VALUE.YB.value) calculatedByteObj = ALL_BYTE_VALUE.YB;
  else if (byte >= ALL_BYTE_VALUE.ZB.value) calculatedByteObj = ALL_BYTE_VALUE.ZB;
  else if (byte >= ALL_BYTE_VALUE.EB.value) calculatedByteObj = ALL_BYTE_VALUE.EB;
  else if (byte >= ALL_BYTE_VALUE.PB.value) calculatedByteObj = ALL_BYTE_VALUE.PB;
  else if (byte >= ALL_BYTE_VALUE.TB.value) calculatedByteObj = ALL_BYTE_VALUE.TB;
  else if (byte >= ALL_BYTE_VALUE.GB.value) calculatedByteObj = ALL_BYTE_VALUE.GB;
  else if (byte >= ALL_BYTE_VALUE.MB.value) calculatedByteObj = ALL_BYTE_VALUE.MB;
  else if (byte >= ALL_BYTE_VALUE.KB.value) calculatedByteObj = ALL_BYTE_VALUE.KB;
  else calculatedByteObj = ALL_BYTE_VALUE.B;

  const calculatedValue = byte / calculatedByteObj.value;
  const size =
    calculatedValue - Math.floor(calculatedValue) !== 0
      ? (Math.round(calculatedValue * 100) / 100).toFixed(2)
      : calculatedValue;

  return `${size} ${calculatedByteObj.byte_unit}`;
};

export const getDomainFromMail = (email) => {
  const emailString = email.trim();
  return emailString.substring(
    emailString.lastIndexOf('@') + 1,
    emailString.indexOf('.', emailString.lastIndexOf('@')),
  );
};

export const getDropDownOptionListForCountry = (params) => {
  const formattedArray = [];

  params.forEach((country) => {
    const countryValue = {};
    countryValue[DROPDOWN_CONSTANTS.OPTION_TEXT] = country.name;
    countryValue[DROPDOWN_CONSTANTS.VALUE] = country.name;
    formattedArray.push(countryValue);
  });

  return formattedArray;
};
export const setRole = (value) => {
  store.dispatch(actions.roleAction(value));
};
export const setLocale = (value) => {
  store.dispatch(actions.roleActionAccountLocale(value));
};

export const setPriamryLocale = (value) => {
  store.dispatch(actions.primaryActionAccountLocale(value));
};

export const setAppHeaderType = (value) => {
  store.dispatch(actions.appHeaderType(value));
};

export const setAdminProfile = (value) => {
  store.dispatch(actions.adminProfileAction(value));
};
export const setMemberProfile = (value) => {
  store.dispatch(actions.memberProfileAction(value));
};
export const setFlowCreatorProfile = (value) => {
  store.dispatch(actions.flowCreatorProfileAction(value));
};
export const setColorCode = (value) => {
  store.dispatch(actions.colorCodeAction(value));
};

export const setIsAccountProfileCompleted = (value) => {
  store.dispatch(actions.setAccountCompletionStatus(value));
};

export const setIsCompanyAccountExpired = (value) => {
  store.dispatch(actions.setIsAccountExpired(value));
};

export const setDaysRemainingForExpiry = (value) => {
  store.dispatch(actions.setRemainDays(value));
};

export const getIsBillingOwner = (value) => {
  store.dispatch(actions.setIsBillingUser(value));
};

export const getCardVerifiedStatus = (value) => {
  store.dispatch(actions.setCardVerifiedStatus(value));
};

export const getAccountSubscriptionType = (value) => {
  store.dispatch(actions.setAccountSubscriptionStatus(value));
};

export const getAccountLanguageAndTimezone = (value) => {
  store.dispatch(actions.setAccountLanguageAndTImezone(value));
};

export const getCheckHasBillingProfile = (value) => {
  store.dispatch(actions.checkHasBillingProfile(value));
};

export const getRemainingDays = (endDate) => {
  if (moment(endDate).diff(moment(), 'days') > 1) {
    return moment(endDate).diff(moment(), 'days') + 2;
  } else {
    return moment(endDate).diff(moment(), 'days') + 1;
  }
};

const timespan = (time, iat) => {
  const timestamp = iat || Math.floor(Date.now() / 1000);

  if (typeof time === 'string') {
    const milliseconds = ms(time);
    if (typeof milliseconds === 'undefined') {
      return null;
    }
    return Math.floor(timestamp + milliseconds / 1000);
  } else if (typeof time === 'number') {
    return timestamp + time;
  } else {
    return null;
  }
};

export function useClickOutsideDetector(ref, closeModal, dependencyArray = []) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        closeModal(event);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, ...dependencyArray]);
}

export function useClickOutsideDetectorForFilters(ref, closeModal, dependencyArray = []) {
  useEffect(() => {
    function handleClickOutside(event) {
      const check = document.getElementById('date-picker-modal');
      // if (check && !check.contains(event.target)) {
      //     // closeModal();
      // } else {
        if ((!check && ref.current && !ref.current.contains(event.target))) {
          closeModal();
        }
      // }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, ...dependencyArray]);
}

export const filterUserOrder = (order, userOrder) => {
  Object.keys(order).forEach((key) => {
    if (!userOrder.includes(key)) {
      delete order[key];
    }
  });
};

export const keydownOrKeypessEnterHandle = (event) => {
  if (event.keyCode === 13 || event.which === 13) {
    return true;
  }
  return false;
};
export const getNormalizeKeyCode = (event) => {
  let normalizedKeyCode = event.keyCode;
  const NORMALIZING_KEY_CODE_HELPER = {
                            188: '44',
                            109: '45',
                            190: '46',
                            191: '47',
                            192: '96',
                            220: '92',
                            222: '39',
                            221: '93',
                            219: '91',
                            173: '45',
                            187: '61', // IE Key codes
                            186: '59', // IE Key codes
                            189: '45', // IE Key codes}
                          };
    const SHIFT_UP_COMBINATION_HELPER = {
                              96: '126', // ~
                              49: '33', // !
                              50: '64', // @
                              51: '35', // #
                              52: '36', // $
                              53: '37', // %
                              54: '94', // ^
                              55: '38', // &
                              56: '42', // *
                              57: '40', // (
                              48: '41', // )
                              45: '95', // _
                              61: '43', // +
                              59: '58', // :
                              91: '123', // {
                              92: '124', // |
                              93: '125', // }
                              39: '34', // "
                              44: '60', // <
                              46: '62', // >
                              47: '63', // ?
                          };
  if (jsUtils.has(NORMALIZING_KEY_CODE_HELPER, [normalizedKeyCode])) {
    normalizedKeyCode = NORMALIZING_KEY_CODE_HELPER[normalizedKeyCode];
  }
  if (event.shiftKey && jsUtils.has(SHIFT_UP_COMBINATION_HELPER, [normalizedKeyCode])) {
    normalizedKeyCode = SHIFT_UP_COMBINATION_HELPER[normalizedKeyCode];
  }

  return normalizedKeyCode;
};

export const isPrintableKeyCode = (event) => {
  const keycode = event.keyCode;
  const valid = (keycode > 43 && keycode < 58) || // ,-.number keys
                ([32, 13, 109, 173, 61, 59].includes(keycode)) || // spacebar & return key(s) (if you want to allow carriage returns)
                (keycode > 64 && keycode < 91) || // letter keys
                (keycode > 95 && keycode < 112) || // numpad keys
                (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
                (keycode > 218 && keycode < 223);// [\]' (in order)
  return valid;
};
/**
 * @memberof helper
 */
/**
 * @function ifArrayisFullEmpty
 * @param {int} byte
 * @description to check if array is empty including is elements.
 * @return {string}
 */
export const ifArrayisFullEmpty = (array) => array.toString().replace(/,/g, '') === '';

export const evaluateFocusOnError = (allFieldId = [], allErrorMessage = {}) => {
  // allFieldIds value must be in diplaying accessible Order.
   if (jsUtils.isEmpty(allErrorMessage) || jsUtils.isEmpty(allFieldId)) return null;

   for (let fieldIdk = 0; fieldIdk < allFieldId.length; fieldIdk++) {
    if (jsUtils.has(allErrorMessage, [allFieldId[fieldIdk]], false)) {
      return allFieldId[fieldIdk];
     }
   }

   return null;
};

export const evaluateAriaLabelMessage = (errorMessage) => {
  if (jsUtils.includes(errorMessage, 'required')) {
    return 'value is required';
  } else {
    return 'Invalid value';
  }
};

export const interactiveElements = 'input:not([readonly]):not(.invisible):not([type="radio"]):not([tabindex="-13"]), button:not([disabled]):not([tabindex="-13"]):not([tabindex="-1"]), [href]:not([tabindex="-13"]):not([tabindex="-1"]), select:not([tabindex="-13"]), textarea:not([tabindex="-13"]):not([tabindex="-1"]), a:not([tabindex="-13"]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]):not([tabindex="-13"])';

// This function takes keydown event and modalId, and makes sures the focus always stays inside the modal
export const keepTabFocusWithinModal = (e, modalId) => {
  if (e.keyCode !== 9) return;

  const modalInvisbleBtnId = `${modalId}-invisible`;
  const modal = document.getElementById(modalId);
  const focusable = modal.querySelectorAll(interactiveElements);
  const modalInvisbleBtn = document.getElementById(modalInvisbleBtnId);
  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];

  let prevFocusable = null;
  let secondPrevFocusable = null;
  let nextFocusable = null;
  let secondNextFocusable = null;

  for (let index = 0; index <= focusable.length; index++) {
      const node = focusable[index];
      if (node === e.target) {
        prevFocusable = focusable[index !== 0 ? index - 1 : null];
        secondPrevFocusable = focusable[index >= 1 ? index - 2 : null];
        nextFocusable = focusable[index + 1 <= focusable.length ? index + 1 : null];
        secondNextFocusable = focusable[index + 2 <= focusable.length ? index + 2 : null];
        break;
    }
  }

  if (e.shiftKey && modalInvisbleBtn === prevFocusable) {
    e.preventDefault();
    secondPrevFocusable?.focus();
    return;
  }

  if (!e.shiftKey && modalInvisbleBtn === nextFocusable) {
    e.preventDefault();
    secondNextFocusable?.focus();
    return;
  }

  // const keys = {
  //     9: () => { // 9 = TAB
          if (e.shiftKey && e.target === firstFocusable) {
              e.preventDefault();
              return;
          }

          if (e.shiftKey && e.target === lastFocusable) {
              focusable[focusable.length - 2].focus();
              e.preventDefault();
              return;
          }

          if (e.target === lastFocusable) {
              e.preventDefault();
          }
  //     },
  // };

  // if (keys[e.keyCode]) {
  //     keys[e.keyCode]();
  // }
};

export const removeActiveDomainCookie = () => {
  if ((process.env.NODE_ENV === PRODUCTION || window.location.protocol === 'https:') && !jsUtils.isEmpty(cookies.get('active-domain'))) {
    cookies.remove('active-domain', {
      path: '/',
      domain: getDomainName(window.location.hostname),
    });
  }
};

export const logoutTimerClear = () => {
  const localTimeOutData = localStorage.getItem('ltod');
  if (localTimeOutData) {
    clearTimeout(localTimeOutData);
    localStorage.removeItem('ltod');
  }
};

export const logoutClearUtil = () => {
  if (localStorage.getItem('csrf_token')) {
    localStorage.removeItem('csrf_token');
    if (sessionStorage.getItem('browser_tab_uuid')) {
      sessionStorage.removeItem('browser_tab_uuid');
    }
    localStorage.removeItem('previous_log_time');
  }
  removeActiveDomainCookie();
  logoutTimerClear();
  store.dispatch(actions.logoutAction(null));
  removeCookiesOnSwitchAccount();
  removePrimaryDomainCookie();
  cookies.remove('refreshTokenInProgress');
  sessionStorage.clear();
};

const signOutExpiryUtils = (history) => {
    if (navigator.onLine) clearSessionDetails();
    logoutClearUtil();
    routeNavigate(history, ROUTE_METHOD.REPLACE, ROUTE_CONSTANTS.SIGNIN, null, null, true);
};

const setCookieWithExpiry = (expiryTime) => {
  if (process.env.NODE_ENV === PRODUCTION || window.location.protocol === 'https:') {
    const expiryDate = new Date(expiryTime);
    const cookieProps = {
      path: '/',
      domain: getDomainName(window.location.hostname),
      expires: expiryDate,
    };
    cookies.set('active-domain', getSubDomainName(window.location.hostname) || EMPTY_STRING, cookieProps);
  }
};

export const redirectToSubdomainPage = () => {
  if (process.env.NODE_ENV === PRODUCTION || window.location.protocol === 'https:') {
    const primary_domain = cookies.get('active-domain');
    if (primary_domain) {
      window.location = `https://${primary_domain}.${getDomainName(window.location.hostname)}${
        window.location.pathname
      }${window.location.search}`;
    }
  }
};

export const expiryTimer = (expiryTime, currentTime, history, fromSignin = false, isInviteUser = false, skipTimoutForRefreshToken = false) => {
  if (fromSignin) {
    store.dispatch(setWelcomeChange({ isWelcomeInsightsOpen: true }));
    const cookieProps = {
      path: '/',
      domain: window.location.hostname,
    };
    cookies.set('welcome-show', true, cookieProps);
    if (isInviteUser) cookies.set('invite-user', true, cookieProps);
  }
  const currentMoment = moment(currentTime);
  const expiryFormat = moment(expiryTime);
  setCookieWithExpiry(expiryTime);
  logoutTimerClear();
  !skipTimoutForRefreshToken && setTimeout(() => {
    cookies.set('refreshTokenInProgress', 0, { path: '/' });
  }, 2000);
  const difference = expiryFormat.diff(currentMoment, 'milliseconds') - 5000; // subtracted the buffer time for expire response
  if (difference > 0) {
    const timOutData = setTimeout(() => signOutExpiryUtils(history), difference);
    localStorage.setItem('ltod', timOutData);
  } else {
    signOutExpiryUtils(history);
  }
};

export const disableAllReadonlyFields = (containerId, condition = null) => {
  const allInteractiveElements = '[tabindex="-13"]';
  const interactiveElements = 'input:not([tabindex="-1"]), button:not([tabindex="-1"]), select:not([tabindex="-1"]), textarea:not([tabindex="-1"]), a:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

  const taskInputContent = document.getElementById(containerId);
  if (taskInputContent) {
    const elements = condition === null ? interactiveElements : condition ? interactiveElements : allInteractiveElements;
    const tab_index = condition === null ? '-13' : condition ? '-13' : '0';
    const focusable = taskInputContent.querySelectorAll(elements);
    focusable.forEach((element) => {
      element.setAttribute('tabindex', tab_index);
    });
  }
};

export function joinWordsInString(word) {
    return word?.split(' ').join('');
}
export const DMSDownloadURLCall = async (link) =>
     new Promise((resolve) => {
       resolve(`${link}&is_download=true`);
    });

export const rearrangeStepList = (currentStepCoordinates, stepList, ignoreStepTypeList) => {
  stepList = stepList.filter((step) => !(jsUtils.includes(ignoreStepTypeList, step.step_type)));
  const index = stepList.findIndex((step) => step.coordinate_info.step_coordinates.y >
  currentStepCoordinates.step_coordinates.y);
  const updatedStepList = [...stepList.slice(index), ...stepList.slice(0, index).reverse()];
  return updatedStepList;
};

export const rearrageStepOnStepId = (stepList, currentStepId) => {
  const index = stepList.findIndex((step) => step._id === currentStepId);
  if (index > -1) {
    const updatedStepList = [...stepList.slice(index + 1), ...stepList.slice(0, index).reverse(), ...stepList.slice(index, index + 1)];
    return updatedStepList;
  }
  return stepList;
};

export const getFirstStringWithExtraDotsByArray = (arrData) => {
  if (!arrData) {
    return EMPTY_STRING;
  }
  let shortSting = EMPTY_STRING;
  if (arrData && arrData.length > 0) {
    const [firstData] = arrData;
    shortSting = firstData;
    if (arrData.length > 1) {
      shortSting = `${firstData}...`;
    }
  }
  return shortSting;
};

export function pxToVw(px) {
  const vw = (px / window.innerWidth) * 100;
  return vw;
}

export const convertTextToHtml = (text) => {
   const parser = new DOMParser();
   const elementTag = parser.parseFromString(text, 'text/html');
   return elementTag;
};

export const isEmptyString = (text = EMPTY_STRING) => {
  const allSpacesRemoved = text.replaceAll(' ', '');
  return isEmpty(allSpacesRemoved);
};

export const constructAvatarOrUserDisplayGroupList = (assignee = {}) => {
  const users = assignee?.users || [];
  const teams = assignee?.teams || [];
  const avatarObjectList = [];

  if (!isEmpty(users) && Array.isArray(users)) {
      users.forEach((user) => {
          if (!isEmpty(user)) {
             avatarObjectList.push(
               {
                   id: user?._id,
                   src: user?.profile_pic || EMPTY_STRING,
                   name: [user.first_name, user.last_name].join(' '),
                   email: user.email || EMPTY_STRING,
                   type: UTToolTipType.user,
               },
             );
          }
      });
  }

  if (!isEmpty(teams) && Array.isArray(teams)) {
     teams.forEach((team) => {
          if (!isEmpty(team)) {
             avatarObjectList.push(
               {
                   id: team?._id,
                   src: team?.profile_pic || EMPTY_STRING,
                   name: team.team_name,
                   type: UTToolTipType.team,
               },
             );
          }
      });
  }

  return avatarObjectList;
};

export class CancelToken {
  cancelToken = null;

  setCancelToken = (token) => { this.cancelToken = token; };
}

// BE to FE
export const consturctTheme = (color = {}) => {
   if (isEmpty(color)) {
      return {
          highlight: '#1A4AC8', // initial color is first default swatch option
          widgetBg: '#FFFFFF',
          appBg: '#EEF1F3',
          activeColor: '#217CF5', // refers to button/link color
      };
    }

   return {
    highlight: color?.highlight_color,
    widgetBg: color?.widget_bg_color,
    appBg: color?.background_color,
    activeColor: color?.button_color,
   };
};

// FE to BE
export const constructThemeData = (color = {}) => {
  if (isEmpty(color)) {
    return {
      highlight_color: '#1A4AC8', // initial color is first default swatch option
      widget_bg_color: '#FFFFFF',
      background_color: '#EEF1F3',
      button_color: '#217CF5', // refers to button/link color
    };
  }

  return {
    highlight_color: color?.highlight,
    widget_bg_color: color?.widgetBg,
    background_color: color?.appBg,
    button_color: color?.activeColor,
  };
};

export const getTaskDataByLocation = (location) => {
        const { TAB } = GET_TASK_LIST_CONSTANTS();
        const data = {};
        const allRouteLabels = (location.pathname || EMPTY_STRING).split('/');
        const moduleIndex = allRouteLabels.findIndex((label) => `/${label}` === ROUTE_CONSTANTS.TASKS);
        data.tabIndex = TAB.OPTION[0].value;
        if (moduleIndex !== -1) {
          const currentRoute = allRouteLabels[moduleIndex + 1];
          const taskId = get(allRouteLabels, [moduleIndex + 2], null);
          const tab = TAB.OPTION.find((eachRoute) => eachRoute.route === currentRoute);
          if (!isEmpty(tab)) {
            data.tabIndex = tab?.value;
            data.taskListType = tab?.route;
          }
          if (taskId) {
            data.activeTaskId = taskId;
          }
        }
        return data;
};

export const isObjectNested = (obj) => {
  let isNested = false;

  Object.values(obj).forEach((value) => {
    if (typeof value === 'object' && value !== null) {
      isNested = true;
    }
  });

  return isNested;
};

export const generateYearArray = (
  yearsBack,
  yearsFuture,
  selectedYear = null,
) => {
  const currentYear = new Date().getFullYear();
  const Years = [];

  for (let i = -yearsBack; i <= yearsFuture; i++) {
    const year = currentYear + i;
    Years.push({
      value: year,
      label: year.toString(),
      isCheck: false,
    });
  }

  if (selectedYear) {
    const isSelectedYear = Years.find((year) => year.value === selectedYear);
    if (!isSelectedYear) {
      const selected_year = {
        value: selectedYear,
        label: selectedYear.toString(),
        isCheck: false,
      };
      if (currentYear - yearsBack > selectedYear) {
        Years.unshift(selected_year);
      } else if (currentYear + yearsFuture < selectedYear) {
        Years.push(selected_year);
      }
    }
  }

  return Years;
};

export const generateDaysArray = (year, month) => {
  // Calculate the number of days in the given month and year
  const daysInMonth = new Date(year, month, 0).getDate();

  // Create an array of day objects
  const Days = [];
  for (let day = 1; day <= daysInMonth; day++) {
    Days.push({
      value: day,
      label: day.toString(),
      isCheck: false,
    });
  }

  return Days;
};

export const generateCurrencyFilterList = (list) => {
  const optionList = list.map((value) => {
    return {
      value,
      label: value || NA,
      isCheck: false,
    };
  });
  return optionList;
};

export const getTechnicalReferenceName = (value = EMPTY_STRING) => {
  const name = value.replace(MATCH_ALL_ALPHA_NUM, '').toUpperCase().trim();
  return jsUtils.join(jsUtils.split(name.toLowerCase(), ' '), '_');
};

export const getShortCode = (value = EMPTY_STRING) => {
  const shortCodeName = value.replace(MATCH_ALL_ALPHA_NUM, '').toUpperCase().trim();
  const shortCode = shortCodeName.split(' ');
  let code = shortCode.toString();
  if (shortCode.length < 2) {
    code = code.slice(0, 3);
  } else if (shortCode.length === 2) {
    const firstWord = shortCode[0];
    const secondWord = shortCode[1];
    code = `${firstWord[0] || ''}${(firstWord[1] || '')}${secondWord[0] || ''}`;
  } else if (shortCode.length >= 3) {
    const firstWord = shortCode[0];
    const secondWord = shortCode[1];
    const thirdWord = shortCode[2];
    code = `${firstWord[0] || ''}${secondWord[0] || ''}${thirdWord[0] || ''}`;
  }
  return code;
};

export const getUrlPath = (value = EMPTY_STRING) =>
  jsUtils.join(jsUtils.split(value.toLowerCase(), ' '), '-');

export const getAllFieldsUuidList = (
  excludeFields = [],
  key = 'field_uuid',
) => {
  const valueToBeRemoved = [];
  (excludeFields || []).forEach((field) => {
    valueToBeRemoved.push(field[key]);
  });
  jsUtils.compact(valueToBeRemoved);
  return valueToBeRemoved;
};

export const safelyParseJSON = (stringJson) => {
  let parsed = null;

  try {
    parsed = JSON.parse(stringJson);
  } catch (e) {
    console.log(e);
  }

  return parsed || {};
};

export const getPopperContent = (id, type, onShow, onHide, history, showCreateTask = true) => {
  const isBasicUser = isBasicUserMode(history);

  const content = (
    <CustomUserInfoToolTipNew
      id={id}
      contentClassName={gClasses.BackgroundWhite}
      type={type}
      onFocus={onShow}
      onBlur={onHide}
      onMouseEnter={onShow}
      onMouseLeave={onHide}
      isStandardUserMode={isBasicUser}
      showCreateTask={showCreateTask}
    />
  );
  return content;
};

export const getAllTablesFromSections = (allTableFields, resAllFields) => {
  let tableUuidList = [];
  const tableList = [];
  if (!allTableFields || isEmpty(allTableFields)) {
    return tableList;
  }

  tableUuidList = groupBy(allTableFields, (table) => table.table_uuid);
  if (!isEmpty(tableUuidList)) {
    Object.keys(tableUuidList).forEach((tableUuid) => {
      const currentTable = resAllFields?.find((eachTable = {}) => eachTable?.field_uuid === tableUuid);

      if (tableUuidList[tableUuid] && tableUuidList[tableUuid][0]) {
        tableList.push({
          label: currentTable?.label,
          value: tableUuid,
          table_uuid: tableUuid,
          table_name: currentTable?.label,
          field_uuid: currentTable?.field_uuid,
          field_list_type: FIELD_LIST_TYPE.TABLE,
          fields: uniqBy(tableUuidList[tableUuid], (field) => field.field_uuid),
        });
      }
    });
  }

  return tableList;
};

export const constructServerImages = (imageIds) => {
  if (isEmpty(imageIds)) return [];
  const imagesArray = [];
  imageIds.forEach((_id) => {
    let constructServerImageUrl = null;
    if (window.location.protocol !== 'https:') {
      constructServerImageUrl = `https://workhall.dev/dms/display/?id=${_id}`;
    } else {
      constructServerImageUrl = `https://${window.location.hostname}/dms/display/?id=${_id}`;
    }

    imagesArray.push({
      imageId: _id,
      serverImageUrl: constructServerImageUrl,
    });
  });
  return imagesArray;
};

const convertRgbToHsl = (r, g, b) => {
  let d; let h; let l;
  let s;
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  h = 0;
  s = 0;
  l = (max + min) / 2;
  if (max === min) {
      h = 0;
      s = 0;
  } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
          case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
          case g:
              h = (b - r) / d + 2;
              break;
          case b:
              h = (r - g) / d + 4;
              break;
          default: break;
      }
      h /= 6;
  }
  h *= 360;
  s *= 100;
  l *= 100;
  return [h, s, l];
};

export const convertHexToHslBasedOnOpacity = (hexCode = EMPTY_STRING, lightness) => {
  const hex = hexCode.replace('#', '');

  if (isEmpty(hex) || lightness === undefined) return hexCode;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  if (lightness >= 0 && lightness <= 100) {
      const hsl = convertRgbToHsl(r, g, b);
      const l = lightness || hsl[2];
      return `hsl(${hsl[0]}, ${hsl[1]}%, ${l}%)`;
  }
  return hexCode;
};

export const constructIndexingFields = (fields = []) => {
  const fieldJson = {};

  fields.forEach((eachField = {}) => {
    fieldJson[eachField?.field_uuid] = eachField;
  });

  return fieldJson;
};

const toSnakeCase = (str) => (str ? str.replace(/\W+/g, ' ')
  .split(' ')
  .map((word) => word.toLowerCase())
  .join('_')
  .replace(/_$/, '')
  .replace(/^_/, '')
  : str);

export const getFieldLabelWithRefName = (fieldName, refName) => {
  if (isEmpty(refName)) {
    return fieldName;
  }
  if (toSnakeCase(fieldName) !== refName) {
    return `${fieldName} (Ref: ${refName})`;
  }
  return fieldName;
};

export const isSatraGroup = () => {
  if (window?.location?.href?.includes(PAC_URL_STRING)) {
    return true;
  }
  return false;
};

export const somethingWentWrongErrorToast = (
  title,
  subtitle,
  t = translateFunction,
) =>
  toastPopOver({
    title: title || t('server_error_code_string.somthing_went_wrong'),
    subtitle: subtitle || EMPTY_STRING,
    toastType: EToastType.error,
  });

  export const setLoaderAndPointerEvent = (status) => {
    setPointerEvent(status);
    updatePostLoader(status);
  };

export function truncateWithEllipsis(input, maxLength = 20) {
  if (input?.trim()?.length > maxLength) {
      return `${input.substring(0, maxLength)}...`;
  }
  return input;
}

export function isFileContentSuspicious(content, t) {
  const suspiciousPatterns = Object.values(FILE_SUSPICICOUS_PATTERNS);
  let foundSuspicious = false;
  suspiciousPatterns.forEach((pattern) => {
    if (pattern.test(content)) {
      foundSuspicious = true;
    }
  });

  if (foundSuspicious) {
    showToastPopover(t('user_settings_strings.file_upload_failed'), t('user_settings_strings.suspicious_file_found'), FORM_POPOVER_STATUS.SERVER_ERROR, true);
    return true;
  }
  return false;
}

const getWindow = () => (typeof window === 'undefined' ? null : window);

export const isSvgContentSuspicious = async (svg, window = getWindow(), t, showPopper = true) => {
  const svgDisallowed = [
    'a',
    'animate',
    'color-profile',
    'cursor',
    'discard',
    'fedropshadow',
    'font-face',
    'font-face-format',
    'font-face-name',
    'font-face-src',
    'font-face-uri',
    'foreignobject',
    'hatch',
    'hatchpath',
    'mesh',
    'meshgradient',
    'meshpatch',
    'meshrow',
    'missing-glyph',
    'script',
    'set',
    'solidcolor',
    'unknown',
    'use',
  ];

  const isFile = (obj) => obj.size !== undefined;

  const readAsText = (svg) =>
  new Promise((resolve) => {
    if (!isFile(svg)) {
      resolve(svg.toString('utf-8'));
    } else {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.readAsText(svg);
    }
  });
  if (!window) throw new Error('DOM window required');
  if (isFile(svg) && svg.type !== 'image/svg+xml') return svg;
  const svgText = await readAsText(svg);
  if (!svgText) throw new Error('Image corrupt');
  const playground = window.document.createElement('template');
  playground.innerHTML = svgText;
  const svgEl = playground?.content?.firstElementChild;
  const attributes = Array.from(svgEl?.attributes).map(({ name }) => name);
  const hasScriptAttr = !!attributes.find((attr) => attr.startsWith('on'));
  const disallowedSvgElements = svgEl?.querySelectorAll(svgDisallowed.join(','));
  if (disallowedSvgElements.length === 0 && !hasScriptAttr) {
    return svg;
  }
  showPopper && showToastPopover(t('user_settings_strings.file_upload_failed'), `${t('user_settings_strings.suspicious_file_found')} in ${svg?.name}`, FORM_POPOVER_STATUS.SERVER_ERROR, true);
  return false;
};
