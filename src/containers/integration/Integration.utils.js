import React from 'react';
import { cloneDeep, get, isEmpty, set, has, groupBy, unset, isEqual } from 'utils/jsUtility';
import { getAllSearchParams } from 'utils/taskContentUtils';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { v4 as uuidv4 } from 'uuid';
import { CURLY_BRACES_INCOMPLETE_REGEX, CURLY_BRACES_REGEX, CURLY_BRACES_URL_END_REGEX, END_POINT_REGEX, EXTRACT_RELATIVE_PATH_REGEX, RELATIVE_PATH_REGEX, URL_END_REGEX, URL_INCOMPLETE_REGEX } from 'utils/strings/Regex';
import { TableAlignOption } from '@workhall-pvt-lmt/wh-ui-library';
import * as ROUTE_CONSTANTS from '../../urls/RouteConstants';
import styles from './Integration.module.scss';
import { ADD_API_KEY_TO, AUTHENTICATION_TYPE_OPTIONS, INTEGRATION_HEADERS_STRINGS, FEATURE_INTEGRATION_STRINGS,
  EDIT_INTEGRATION_TABS, API_TYPE_CONSTANTS, WH_API_OPTIONS, INTEGRATION_LIST_HEADERS, LIST_HEADER_STRINGS,
  CRED_STATUS_LABEL, WORKHALL_AUTH_LABEL, EXTERNAL_API_FILTER, OAUTH_SETTINGS_LABEL, CREATE_INTEGRATION, INTEGRATION_ERROR_STRINGS, WORKHALL_API_STRINGS, SUCCESS_RESPONSE_KEY_STRINGS, SCOPE_LABELS, VIEW_LABELS } from './Integration.strings';
import { ALLOWED_INTEGRATION_VALUES, API_CONFIG_URL, CRED_SCOPE_VALUE, CRED_STATUS_VALUES, INTEGRATION_CONSTANTS, INTEGRATION_FILTER_CONSTANTS, LIST_TAB_VALUES, OAUTH_SETTINGS_VALUE, PKCE_CHALLENGE_METHOD, SUCCESS_RESPONSE_KEYS, WH_API_CONSTANTS, WH_API_TYPES, WORKHALL_AUTH_VALUES } from './Integration.constants';
import WorkhallIconLetter from '../../assets/icons/WorkhallIconLetter';
import ApiIcon from '../../assets/icons/integration/ApiIcon';
import AuthenticationIcon from '../../assets/icons/integration/AuthenticationIcon';
import EventTabIcon from '../../assets/icons/integration/EventTabIcon';
import EditDetailsIconV2 from '../../assets/icons/EditDetailsIconV2';
import Trash from '../../assets/icons/application/Trash';
import { getFormattedDateFromUTC } from '../../utils/dateUtils';
import { HOLIDAY_DATE } from '../admin_settings/language_and_calendar/holidays/holiday_table/HolidayTable.strings';
import LockIcon from '../../assets/icons/LockIcon';
import ToggleIcon from '../../assets/icons/integration/ToggleIcon';
import EditDetailsIcon from '../../assets/icons/integration/EditDetailsIcon';
import { translate } from '../../language/config';
import DiscardIcon from '../../assets/icons/integration/DiscardIcon';
import { translateFunction } from '../../utils/jsUtility';
import { VALIDATION_ERROR_TYPES } from '../../utils/strings/CommonStrings';
import { getFullName, getRouteLink } from '../../utils/UtilityFunctions';
import { ACTION_TYPE } from '../../utils/constants/action.constant';
import DBIcon from '../../assets/icons/integration/DBIcon';
import QueriesTabIcon from '../../assets/icons/integration/QueriesTabIcon';
import { getModifiedRequestBody } from './add_integration/events/add_event/request_body/RequestBody.utils';

const crypto = require('crypto');

export const INTEGRATION_TABS = {
  EXTERNAL_API: 1,
  WORKHALL_API: 2,
  DRAFT_INTEGRATION: 3,
  EDIT_INTEGRATION: 4,
  EDIT_WORKHALL_INTEGRATION: 5,
  API_CREDENTIAL: 6,
  EXTERNAL_DB_CONNECTOR: 7,
};

export const EDIT_VIEW_INTEGRATION_TABS = {
  AUTHENTICATION: 1,
  EVENTS: 2,
  CREDENTIALS: 3,
  REQUEST_RESPONSE: 4,
  QUERIES: 5,
};

export const INTEGRATION_TAB_OPTIONS = [
  {
      labelText: EDIT_INTEGRATION_TABS.AUTH_INFO,
      value: EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION,
      tabIndex: EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION,
      Icon: AuthenticationIcon,
  },
  {
      labelText: EDIT_INTEGRATION_TABS.EVENTS,
      value: EDIT_VIEW_INTEGRATION_TABS.EVENTS,
      tabIndex: EDIT_VIEW_INTEGRATION_TABS.EVENTS,
      Icon: EventTabIcon,
  },
];

export const WORKHALL_INTEGRATION_TAB_OPTIONS = [
  {
      labelText: EDIT_INTEGRATION_TABS.CREDENTIALS,
      value: EDIT_VIEW_INTEGRATION_TABS.CREDENTIALS,
      tabIndex: EDIT_VIEW_INTEGRATION_TABS.CREDENTIALS,
      Icon: AuthenticationIcon,
  },
  {
      labelText: EDIT_INTEGRATION_TABS.REQUEST_RESPONSE,
      value: EDIT_VIEW_INTEGRATION_TABS.REQUEST_RESPONSE,
      tabIndex: EDIT_VIEW_INTEGRATION_TABS.REQUEST_RESPONSE,
      Icon: EventTabIcon,
  },
];

export const EXTERNAL_DB_CONNECTION_TAB_OPTIONS = [
  {
    labelText: EDIT_INTEGRATION_TABS.AUTH_INFO,
    value: EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION,
    tabIndex: EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION,
    Icon: AuthenticationIcon,
  },
  {
    labelText: EDIT_INTEGRATION_TABS.QUERIES,
    value: EDIT_VIEW_INTEGRATION_TABS.QUERIES,
    tabIndex: EDIT_VIEW_INTEGRATION_TABS.QUERIES,
    Icon: QueriesTabIcon,
  },
];

export const API_TYPE_OPTIONS = [
  {
    label: API_TYPE_CONSTANTS.EXTERNAL.LABEL,
    description: API_TYPE_CONSTANTS.EXTERNAL.DESCRIPTION,
    id: INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL,
    icon: <ApiIcon />,
  },
  {
    label: API_TYPE_CONSTANTS.WORKHALL.LABEL,
    description: API_TYPE_CONSTANTS.WORKHALL.DESCRIPTION,
    id: INTEGRATION_CONSTANTS.API_TYPE.WORKHALL,
    icon: <WorkhallIconLetter />,
  },
  {
    label: API_TYPE_CONSTANTS.DB_CONNECTION.LABEL,
    description: API_TYPE_CONSTANTS.DB_CONNECTION.DESCRIPTION,
    id: INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION,
    icon: <DBIcon />,
  },
];

export const EXTERNAL_VIEW_TABS = [
  {
    labelText: EDIT_INTEGRATION_TABS.AUTH_INFO,
    value: EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION,
    tabIndex: EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION,
  },
  {
    labelText: EDIT_INTEGRATION_TABS.EVENTS,
    value: EDIT_VIEW_INTEGRATION_TABS.EVENTS,
    tabIndex: EDIT_VIEW_INTEGRATION_TABS.EVENTS,
  },
];

export const WORKHALL_VIEW_TABS = [
  {
    labelText: EDIT_INTEGRATION_TABS.CREDENTIALS,
    value: EDIT_VIEW_INTEGRATION_TABS.CREDENTIALS,
    tabIndex: EDIT_VIEW_INTEGRATION_TABS.CREDENTIALS,
  },
  {
    labelText: EDIT_INTEGRATION_TABS.REQUEST_RESPONSE,
    value: EDIT_VIEW_INTEGRATION_TABS.REQUEST_RESPONSE,
    tabIndex: EDIT_VIEW_INTEGRATION_TABS.REQUEST_RESPONSE,
  },
];

export const DB_CONNECTOR_VIEW_TABS = [
  {
    labelText: EDIT_INTEGRATION_TABS.AUTH_INFO,
    value: EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION,
    tabIndex: EDIT_VIEW_INTEGRATION_TABS.AUTHENTICATION,
  },
  {
    labelText: EDIT_INTEGRATION_TABS.QUERIES,
    value: EDIT_VIEW_INTEGRATION_TABS.QUERIES,
    tabIndex: EDIT_VIEW_INTEGRATION_TABS.QUERIES,
  },
];

export const FILTER_TYPE = {
  MY_INTEGRATIONS: 'created_by_me',
  ALL_EXTERNAL_INTEGRATIONS: 'all',
  UN_PUBLISHED: 'unpublished',
  ANY: 'any',
  PUBLISHED: 'published',
};

export const INTEGRATION_LIST_TABS = (t = translateFunction) => [
  {
    labelText: INTEGRATION_LIST_HEADERS(t).EXTERNAL_API,
    value: 1,
    tabIndex: 1,
  },
  {
    labelText: INTEGRATION_LIST_HEADERS(t).WORKHALL_API,
    value: 2,
    tabIndex: 2,
  },
  {
    labelText: INTEGRATION_LIST_HEADERS(t).DB_CONNECTOR,
    value: 7,
    tabIndex: 7,
  },
  {
    labelText: INTEGRATION_LIST_HEADERS(t).API_CREDENTIALS,
    value: 6,
    tabIndex: 6,
  },
  {
    labelText: INTEGRATION_LIST_HEADERS(t).DRAFTS,
    value: 3,
    tabIndex: 3,
  },
];

export const INTEGRATION_API_OPTIONS = [
  {
    label: WH_API_OPTIONS.START_FLOW.LABEL,
    header: WH_API_OPTIONS.START_FLOW.HEADER,
    value: WH_API_CONSTANTS.STARTING_A_FLOW,
    description: WH_API_OPTIONS.START_FLOW.DESCRIPTION,
    method: WH_API_OPTIONS.START_FLOW.METHOD,
  },
  {
    label: WH_API_OPTIONS.ADD_DL_ENTRY.LABEL,
    header: WH_API_OPTIONS.ADD_DL_ENTRY.HEADER,
    value: WH_API_CONSTANTS.ADD_DATALIST_ENTRY,
    description: WH_API_OPTIONS.ADD_DL_ENTRY.DESCRIPTION,
    method: WH_API_OPTIONS.ADD_DL_ENTRY.METHOD,
  },
  {
    label: WH_API_OPTIONS.UPDATE_DL_ENTRY.LABEL,
    value: WH_API_CONSTANTS.UPDATE_DATALIST_ENTRY,
    description: WH_API_OPTIONS.UPDATE_DL_ENTRY.DESCRIPTION,
    method: WH_API_OPTIONS.UPDATE_DL_ENTRY.METHOD,
  },
  {
    label: WH_API_OPTIONS.GET_DL_ENTRY.LABEL,
    value: WH_API_CONSTANTS.GET_DATALIST_ENTRY,
    description: WH_API_OPTIONS.GET_DL_ENTRY.DESCRIPTION,
    method: WH_API_OPTIONS.GET_DL_ENTRY.METHOD,
  },
];

export const SHOW_BY_OPTIONS = [
  {
    label: API_TYPE_CONSTANTS.EXTERNAL.LABEL,
    value: INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL,
  },
  {
    label: API_TYPE_CONSTANTS.WORKHALL.LABEL,
    value: INTEGRATION_CONSTANTS.API_TYPE.WORKHALL,
  },
];

export const getIntegrationBreadCrumbLink = (text) => {
  switch (text) {
    case VIEW_LABELS.HOME:
      return ROUTE_CONSTANTS.HOME;
    case VIEW_LABELS.WORKHALL_APIS:
      return `${ROUTE_CONSTANTS.INTEGRATIONS}/${ROUTE_CONSTANTS.WORKHALL_INTEGRATION}`;
    case VIEW_LABELS.INTEGRATION:
    case VIEW_LABELS.EXTERNAL_APIS:
        return `${ROUTE_CONSTANTS.INTEGRATIONS}/${ROUTE_CONSTANTS.EXTERNAL_INTEGRATION}`;
    default: return EMPTY_STRING;
  }
};

export const getIntegrationBreadcrumb = (integrationTab, name, history) => {
  const defaultRoute = `${ROUTE_CONSTANTS.INTEGRATIONS}/${ROUTE_CONSTANTS.EXTERNAL_INTEGRATION}`;
  let navText = null;
  let navRoute = null;
  if (integrationTab === ROUTE_CONSTANTS.EXTERNAL_INTEGRATION) {
    navText = VIEW_LABELS.EXTERNAL_APIS;
    navRoute = defaultRoute;
  } else if (integrationTab === ROUTE_CONSTANTS.WORKHALL_INTEGRATION) {
    navText = VIEW_LABELS.WORKHALL_APIS;
    navRoute = `${ROUTE_CONSTANTS.INTEGRATIONS}/${ROUTE_CONSTANTS.WORKHALL_INTEGRATION}`;
  } else {
    navText = VIEW_LABELS.EXTERNAL_DB_CONNECTOR;
    navRoute = `${ROUTE_CONSTANTS.INTEGRATIONS}/${ROUTE_CONSTANTS.EXTERNAL_DB_CONNECTION}`;
  }

  return [
    // {
    //   text: VIEW_LABELS.HOME,
    //   route: getRouteLink(ROUTE_CONSTANTS.HOME, history),
    // className: styles.BreadcrumbText,
    // },
    {
      text: VIEW_LABELS.INTEGRATION,
      route: getRouteLink(defaultRoute, history),
      className: styles.BreadcrumbText,
    },
    {
      text: navText,
      route: getRouteLink(navRoute, history),
      className: styles.BreadcrumbText,
    },
    {
      text: name,
      isText: true,
      className: styles.BreadcrumbText,
    },
  ];
};

export const getNameValue = (listItem, tab) => {
  console.log('listitemgnv', listItem, 'tab', tab);
  switch (tab) {
    case LIST_TAB_VALUES.EXTERNAL_API:
    case LIST_TAB_VALUES.DRAFTS:
      return (listItem?.connector_name || listItem?.name);
    case LIST_TAB_VALUES.WORKHALL_API:
      return listItem?.name;
    case LIST_TAB_VALUES.API_CREDENTIALS:
      return listItem?.name;
    default: return EMPTY_STRING;
  }
};

export const getSelectedLabels = (optionList, selectedValues) => {
  const selectedLabels = [];
  optionList.forEach((option) => {
    if (selectedValues?.includes(option.value)) {
      selectedLabels.push(option.label);
    }
  });
  console.log('selectedLabels', selectedLabels);
  return selectedLabels;
};

export const getTypeValue = (type) => {
  console.log('Typegettype', type);
  switch (type) {
    case WH_API_TYPES.START_FLOW:
      return WH_API_OPTIONS.START_FLOW.LABEL;
    case WH_API_TYPES.SUBMIT_OR_ADD_DL:
      return WH_API_OPTIONS.ADD_DL_ENTRY.LABEL;
    case WH_API_TYPES.EDIT_OR_UPDATE_DL:
      return WH_API_OPTIONS.UPDATE_DL_ENTRY.LABEL;
    case WH_API_TYPES.GET_OR_VIEW_DL:
      return WH_API_OPTIONS.GET_DL_ENTRY.LABEL;
    default: return EMPTY_STRING;
  }
};

export const getUpdatedOnValue = (listItem, tab) => {
  console.log('listitemUpdatedOn', listItem, 'tab', tab);
  let date = null;
  switch (tab) {
    case LIST_TAB_VALUES.EXTERNAL_API:
    case LIST_TAB_VALUES.DRAFTS:
      date = (listItem?.last_updated_on?.utc_tz_datetime || listItem?.updated_on?.utc_tz_datetime);
      break;
    case LIST_TAB_VALUES.WORKHALL_API:
      date = (listItem?.last_updated_on?.utc_tz_datetime || listItem?.updated_on?.utc_tz_datetime);
      break;
    case LIST_TAB_VALUES.DB_CONNECTOR:
      date = listItem?.last_updated_on?.utc_tz_datetime;
      break;
    case LIST_TAB_VALUES.API_CREDENTIALS:
      date = listItem?.updated_on;
      break;
    default: break;
  }
  return getFormattedDateFromUTC(date, HOLIDAY_DATE);
};

export const OAUTH_SETTINGS_LIST = (t = translateFunction) => [
  {
    label: OAUTH_SETTINGS_LABEL(t).REGENERATE,
    value: OAUTH_SETTINGS_VALUE.REGENERATE,
    icon: <LockIcon />,
  },
  {
    label: OAUTH_SETTINGS_LABEL(t).EDIT,
    value: OAUTH_SETTINGS_VALUE.EDIT,
    icon: <EditDetailsIcon />,
  },
  {
    label: OAUTH_SETTINGS_LABEL(t).ENABLE_DISABLE,
    value: OAUTH_SETTINGS_VALUE.ENABLE_DISABLE,
    icon: <ToggleIcon />,
  },
  {
    label: OAUTH_SETTINGS_LABEL(t).DELETE,
    value: OAUTH_SETTINGS_VALUE.DELETE,
    icon: <Trash />,
  },
];
export const ACTIVE_OAUTH_SETTINGS_LIST = (t = translateFunction) => [
  {
    label: OAUTH_SETTINGS_LABEL(t).REGENERATE,
    value: OAUTH_SETTINGS_VALUE.REGENERATE,
    icon: <LockIcon />,
  },
  {
    label: OAUTH_SETTINGS_LABEL(t).EDIT,
    value: OAUTH_SETTINGS_VALUE.EDIT,
    icon: <EditDetailsIcon />,
  },
  {
    label: OAUTH_SETTINGS_LABEL(t).DELETE,
    value: OAUTH_SETTINGS_VALUE.DELETE,
    icon: <Trash />,
  },
];

export const AUTHORIZATION_STATUS = {
  YET_TO_INITIATE: 1,
  IN_PROGRESS: 2,
  SUCCESS: 3,
  FAILURE: 4,
  ABORTED: 5,
  API_IN_PROGRESS: 6,
  SUCCESS_WITH_WARNING: 7,
};

export const VERIFY_OAUTH_RESPOSNE_TYPE = {
  SUCCESS: 'authorized',
  FAILURE: 'unauthorized',
  SUCCESS_WITH_WARNING: 'authorized_with_error',
};

export const EXTERNAL_API_FILTERS = (t = translateFunction) => [
  {
    label: EXTERNAL_API_FILTER(t).CUSTOM,
    value: INTEGRATION_FILTER_CONSTANTS.EXTERNAL.TEMPLATE.CUSTOM,
  },
  {
    label: EXTERNAL_API_FILTER(t).PREBUILD,
    value: INTEGRATION_FILTER_CONSTANTS.EXTERNAL.TEMPLATE.PRE_BUILD,
  },
];

export const getTableStyle = (tab, showByFilter) => {
  switch (tab) {
    case LIST_TAB_VALUES.EXTERNAL_API:
      return styles.ExternalTable;
    case LIST_TAB_VALUES.API_CREDENTIALS:
    case LIST_TAB_VALUES.DB_CONNECTOR:
      return styles.OauthTable;
    case LIST_TAB_VALUES.DRAFTS:
      if (showByFilter === INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL) {
        return styles.ExternalTable;
      }
      return EMPTY_STRING;
    default: return EMPTY_STRING;
  }
};

export const getIntegrationUrlFromTab = (tabIndex) => {
  if (tabIndex === INTEGRATION_TABS.EXTERNAL_API) {
    return `${ROUTE_CONSTANTS.INTEGRATIONS}/${ROUTE_CONSTANTS.EXTERNAL_INTEGRATION}`;
  } else if (tabIndex === LIST_TAB_VALUES.WORKHALL_API) {
    return `${ROUTE_CONSTANTS.INTEGRATIONS}/${ROUTE_CONSTANTS.WORKHALL_INTEGRATION}`;
  } else if (tabIndex === INTEGRATION_TABS.DRAFT_INTEGRATION) {
    return `${ROUTE_CONSTANTS.INTEGRATIONS}/${ROUTE_CONSTANTS.DRAFT_INTEGRATION}`;
  } else if (tabIndex === LIST_TAB_VALUES.API_CREDENTIALS) {
    return `${ROUTE_CONSTANTS.INTEGRATIONS}/${ROUTE_CONSTANTS.API_CREDENTIAL}`;
  } else if (tabIndex === LIST_TAB_VALUES.DB_CONNECTOR) {
    return `${ROUTE_CONSTANTS.INTEGRATIONS}/${ROUTE_CONSTANTS.EXTERNAL_DB_CONNECTION}`;
  }
  return EMPTY_STRING;
};

export const hasEventError = (errorList, properties) => {
  let hasError = false;
  properties.forEach((property) => {
    if (errorList[property]) hasError = true;
  });
  return hasError;
};

export const getIntegrationHeader = (t = () => {}) => [
  <span className={styles.ConnectorNameHeader}>{t(INTEGRATION_HEADERS_STRINGS.NAME)}</span>,
  <span className={styles.ApiTypeHeader}>{t(INTEGRATION_HEADERS_STRINGS.AUTHENTICATION_TYPE)}</span>,
  <span className={styles.CreatedOnHeader}>{t(INTEGRATION_HEADERS_STRINGS.CREATED_ON)}</span>,
  <span className={styles.EditIconHeader} />,
];

export const SCOPE_OPTION_LIST = [
  {
    value: CRED_SCOPE_VALUE.READ_FLOW,
    label: SCOPE_LABELS.READ_FLOW,
  },
  {
    value: CRED_SCOPE_VALUE.WRITE_FLOW,
    label: SCOPE_LABELS.WRITE_FLOW,
  },
  {
    value: CRED_SCOPE_VALUE.READ_DL,
    label: SCOPE_LABELS.READ_DL,
  },
  {
    value: CRED_SCOPE_VALUE.WRITE_DL,
    label: SCOPE_LABELS.WRITE_DL,
  },
];

export const EXTERNAL_API_HEADERS = (t = translateFunction) => [
  {
    label: LIST_HEADER_STRINGS(t).NAME,
    id: 'connector_name',
    widthWeight: 35,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
      isChangeIconColorOnHover: true,
    },
    // component: <div>
    //   <p>Sample Content</p>
    // </div>,
  },
  {
    label: LIST_HEADER_STRINGS(t).AUTH_TYPE,
    id: 'connector_auth_type',
    widthWeight: 20,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
    },
  },
  {
    label: LIST_HEADER_STRINGS(t).EVENT_COUNT,
    id: 'event_count',
    widthWeight: 20,
    headerStyleConfig: {
      align: TableAlignOption.MIDDLE,
    },
    bodyStyleConfig: {
      align: TableAlignOption.MIDDLE,
    },
  },
  {
    label: LIST_HEADER_STRINGS(t).LAST_UPDATED_ON,
    id: 'last_updated_on',
    widthWeight: 15,
    headerStyleConfig: {
      align: TableAlignOption.MIDDLE,
    },
    bodyStyleConfig: {
      align: TableAlignOption.MIDDLE,
    },
  },
];
export const WH_API_HEADERS = (t = translateFunction) => [
  {
    label: LIST_HEADER_STRINGS(t).API_NAME,
    id: 'api_name',
    widthWeight: 35,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
      isChangeIconColorOnHover: true,
    },
  },
  {
    label: LIST_HEADER_STRINGS(t).TYPE,
    id: 'wh_api_type',
    widthWeight: 20,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
    },
  },
  {
    label: LIST_HEADER_STRINGS(t).SOURCE,
    id: 'source',
    widthWeight: 15,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
    },
  },
  {
    label: LIST_HEADER_STRINGS(t).AUTH_TYPE,
    id: 'oauth_type',
    widthWeight: 15,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
    },
  },
  {
    label: LIST_HEADER_STRINGS(t).LAST_UPDATED_ON,
    id: 'last_updated_on',
    widthWeight: 15,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
    },
  },
];
export const API_CRED_HEADERS = (t = translateFunction) => [
  {
    label: LIST_HEADER_STRINGS(t).NAME,
    id: 'credential_name',
    widthWeight: 35,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
      isChangeIconColorOnHover: true,
    },
  },
  {
    label: LIST_HEADER_STRINGS(t).STATUS,
    id: 'credential_status',
    widthWeight: 20,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
    },
  },
  {
    label: LIST_HEADER_STRINGS(t).UPDATED_ON,
    id: 'updated_on',
    widthWeight: 20,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
    },
  },
  {
    label: LIST_HEADER_STRINGS(t).UPDATED_BY,
    id: 'updated_by',
    widthWeight: 25,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
    },
  },
];

export const DB_CONNECTOR_HEADER = (t = translateFunction) => [
  {
    label: LIST_HEADER_STRINGS(t).DB_CONNECTOR,
    id: 'db_connector_name',
    widthWeight: 35,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
      isChangeIconColorOnHover: true,
    },
  },
  {
    label: LIST_HEADER_STRINGS(t).DB_TYPE,
    id: 'db_type',
    widthWeight: 20,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
    },
  },
  {
    label: LIST_HEADER_STRINGS(t).UPDATED_ON,
    id: 'updated_on',
    widthWeight: 20,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
    },
  },
  {
    label: LIST_HEADER_STRINGS(t).UPDATED_BY,
    id: 'updated_by',
    widthWeight: 25,
    headerStyleConfig: {
      align: TableAlignOption.LEFT,
    },
    bodyStyleConfig: {
      align: TableAlignOption.LEFT,
    },
  },
];

export const getIntegrationListHeader = (tab, showByFilter, t = translateFunction) => {
  switch (tab) {
    case LIST_TAB_VALUES.EXTERNAL_API:
      return EXTERNAL_API_HEADERS(t);
    case LIST_TAB_VALUES.WORKHALL_API:
      return WH_API_HEADERS(t);
    case LIST_TAB_VALUES.DRAFTS:
      if (showByFilter === INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL) {
        return EXTERNAL_API_HEADERS(t);
      } else {
        return WH_API_HEADERS(t);
      }
    case LIST_TAB_VALUES.API_CREDENTIALS:
      return API_CRED_HEADERS(t);
    case LIST_TAB_VALUES.DB_CONNECTOR:
      return DB_CONNECTOR_HEADER(t);
    default: return [];
  }
};

export const AUTHENTICATION_TYPE_CONSTANTS = {
  NO_AUTH: 'no_auth',
  BASIC: 'basic',
  API_KEY: 'api_key',
  TOKEN: 'bearer_token',
  OAUTH_AUTH_CODE: 'oauth2_authorization_code_grant',
  OAUTH_CLIENT_CODE: 'oauth2_client_credentials_grant',
  OAUTH_PASSWORD_GRANT: 'oauth2_password_grant',
};

export const getAuthTypeInfo = (authType) => {
  let authLabel = null;
  let authLabelStyle = null;
  switch (authType) {
    case AUTHENTICATION_TYPE_CONSTANTS.NO_AUTH:
      authLabel = AUTHENTICATION_TYPE_OPTIONS.NO_AUTH;
      authLabelStyle = styles.OpenAuth;
      break;
    case AUTHENTICATION_TYPE_CONSTANTS.BASIC:
      authLabel = AUTHENTICATION_TYPE_OPTIONS.BASIC;
      authLabelStyle = styles.BasicAuth;
      break;
    case AUTHENTICATION_TYPE_CONSTANTS.API_KEY:
      authLabel = AUTHENTICATION_TYPE_OPTIONS.API_KEY;
      authLabelStyle = styles.ExternalAPIkeyAuth;
      break;
    case AUTHENTICATION_TYPE_CONSTANTS.TOKEN:
      authLabel = AUTHENTICATION_TYPE_OPTIONS.TOKEN;
      authLabelStyle = styles.TokenAuth;
      break;
    case AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE:
      authLabel = AUTHENTICATION_TYPE_OPTIONS.OAUTH_AUTH_CODE;
      authLabelStyle = styles.OAuthStyle;
      break;
    case AUTHENTICATION_TYPE_CONSTANTS.OAUTH_CLIENT_CODE:
      authLabel = AUTHENTICATION_TYPE_OPTIONS.OAUTH_CLIENT_CODE;
      authLabelStyle = styles.OAuthStyle;
      break;
    case AUTHENTICATION_TYPE_CONSTANTS.OAUTH_PASSWORD_GRANT:
      authLabel = AUTHENTICATION_TYPE_OPTIONS.OAUTH_PASSWORD_GRANT;
      authLabelStyle = styles.OAuthStyle;
      break;
    default:
      break;
  }
  return {
    authLabel,
    authLabelStyle,
  };
};

export const getCredStatusInfo = (status) => {
  console.log('statusgetCredStatusInfo', status);
  let statusLabel = null;
  let statusStyle = null;
  switch (status) {
    case CRED_STATUS_VALUES.ENABLED:
      statusLabel = CRED_STATUS_LABEL.ENABLED;
      statusStyle = styles.APIkeyAuth;
      break;
    case CRED_STATUS_VALUES.DISABLED:
      statusLabel = CRED_STATUS_LABEL.DISABLED;
      statusStyle = styles.DisabledAuth;
      break;
    case CRED_STATUS_VALUES.EXPIRED:
      statusLabel = CRED_STATUS_LABEL.EXPIRED;
      statusStyle = styles.ExpiredAuth;
      break;
    case CRED_STATUS_VALUES.DELETED:
      statusLabel = CRED_STATUS_LABEL.DELETED;
      statusStyle = styles.ExpiredAuth;
      break;
    default: break;
  }
  console.log('labelgetCredStatusInfo', statusLabel, 'style', statusStyle, 'status', status);
  return {
    statusLabel,
    statusStyle,
  };
};
export const getWorkhallAuthInfo = (status) => {
  let oAuthLabel = null;
  let oAuthStyle = null;
  switch (status) {
    case WORKHALL_AUTH_VALUES.API_KEY:
      oAuthLabel = WORKHALL_AUTH_LABEL.API_KEY;
      oAuthStyle = styles.ApiBadge;
      break;
    case WORKHALL_AUTH_VALUES.CLIENT_CRED:
      oAuthLabel = WORKHALL_AUTH_LABEL.CLIENT_CRED;
      oAuthStyle = styles.OauthBadge;
      break;
    default:
      break;
  }
  return {
    oAuthLabel,
    oAuthStyle,
  };
};

export const REQ_BODY_KEY_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE_AND_TIME: 'datetime',
  OBJECT: 'object',
  DATE: 'date',
  STREAM: 'stream',
};

export const getBadgeValue = (listItem, tab, showByFilter) => {
  console.log('listitemgnv', listItem, 'tab', tab);
  let label = null;
  let style = null;
  switch (tab) {
    case LIST_TAB_VALUES.EXTERNAL_API:
      const {
        authLabel,
        authLabelStyle,
      } = getAuthTypeInfo(listItem?.authentication?.type);
      label = authLabel;
      style = authLabelStyle;
      break;
    case LIST_TAB_VALUES.WORKHALL_API:
      const {
        oAuthLabel,
        oAuthStyle,
      } = getWorkhallAuthInfo(listItem?.authentication_type);
      label = oAuthLabel;
      style = oAuthStyle;
      break;
    case LIST_TAB_VALUES.DB_CONNECTOR:
      label = listItem?.db_type;
      style = styles.DBType;
      break;
    case LIST_TAB_VALUES.API_CREDENTIALS:
      const {
        statusLabel,
        statusStyle,
      } = getCredStatusInfo(listItem?.status);
      console.log('statusLableCredStatusInfo', statusLabel, 'statusStyle', statusStyle);
      label = statusLabel;
      style = statusStyle;
      break;
    case LIST_TAB_VALUES.DRAFTS:
      if (showByFilter === INTEGRATION_CONSTANTS.API_TYPE.EXTERNAL) {
        const {
          authLabel,
          authLabelStyle,
        } = getAuthTypeInfo(listItem?.authentication?.type);
        label = authLabel;
        style = authLabelStyle;
      } else {
        const {
          oAuthLabel,
          oAuthStyle,
        } = getWorkhallAuthInfo(listItem?.authentication_type);
        label = oAuthLabel;
        style = oAuthStyle;
      }
      break;
    default: break;
  }
  console.log('labelgetBadgeValue', label, 'style', style, 'tab', tab);
  return {
    label,
    style,
  };
};

export const INTEGRATION_STRINGS = {
  ADD_MORE: 'integration.integration_strings.add_more',
  ADD_HEADER: 'Add Header',
  ADD_QUERY_PARAMATER: 'Add Query Parameter',
  ADD_KEY: 'integration.integration_strings.add_key',
  ADD_EVENT_TEXT: 'integration.integration_strings.add_event_text',
  SEARCH_PARAM: {
    CREATE_INTEGRATION: 'integration',
  },
  NO_SEARCH_RESULTS: {
    TITLE: 'integration.integration_strings.no_search_results.title',
    MESSAGE: 'integration.integration_strings.no_search_results.message',
  },
  LIST_LOAD_ERROR: 'integration.integration_strings.list_load_error',
  ERROR_LABEL: 'integration.integration_strings.error_label',
  EVENT_ERROR_VALUE: 'integration.integration_strings.event_error_value',
  ADD_INTEGRATION_TITLE: 'integration.integration_strings.add_integration_title',
  EDIT_INTEGRATION_TITLE: 'integration.integration_strings.edit_integration_title',
  HEADERS: {
    LABEL: 'integration.integration_strings.headers.label',
    KEY: {
      ID: 'key',
      LABEL: 'integration.integration_strings.headers.key_label',
    },
    VALUE: {
      ID: 'value',
      LABEL: 'integration.integration_strings.headers.value_label',
    },
    TABLE_HEADERS: [
      {
        id: 1,
        label: 'Key',
      },
      {
        id: 2,
        label: 'Value',
      },
    ],
  },
  QUERY_PARAMS: {
    LABEL: 'integration.integration_strings.query_params.label',
    KEY: {
      ID: 'key',
      LABEL: 'integration.integration_strings.headers.key_label',
    },
    VALUE: {
      ID: 'value',
      LABEL: 'integration.integration_strings.headers.value_label',
    },
  },
  INTEGRATION_DROPDOWN: {
    PLACEHOLDER: 'integration.integration_strings.integration_dropdown_placeholder',
    SEARCH_ID: 'integration_search',
  },
  ADD_INTEGRATION: {
    ID: 'add_integration_modal',
    CHOOSE_CONNECTOR_HERE: 'integration.integration_strings.add_integration.choose_connector_here',
    INTEGRATION_NAME: {
      ID: 'name',
      LABEL: 'integration.integration_strings.add_integration.integration_name.label',
      PLACEHOLDER: 'integration.integration_strings.add_integration.integration_name.placeholder',
    },
    INTEGRATION_DESCRIPTION: {
      ID: 'description',
      LABEL: 'integration.integration_strings.add_integration.integration_description.label',
      PLACEHOLDER: 'integration.integration_strings.add_integration.integration_description.placeholder',
    },
    FOOTER: {
      CANCEL: 'integration.integration_strings.add_integration.footer.cancel',
      CONTINUE: 'integration.integration_strings.add_integration.footer.continue',
      ADD: 'integration.integration_strings.add_integration.footer.add',
      UPDATE: 'integration.integration_strings.add_integration.footer.update',
    },
    HEADER: {
      TITLE: 'integration.integration_strings.add_integration.header.edit_integration',
      CANCEL: 'integration.integration_strings.add_integration.header.cancel',
      SAVE_AND_CLOSE: 'integration.integration_strings.add_integration.header.save_and_close',
      PUBLISH: 'integration.integration_strings.add_integration.header.publish',
      ADD: 'integration.integration_strings.add_integration.header.add',
      EDIT: 'integration.integration_strings.add_integration.header.edit',
    },
  },
  ADD_EVENT: {
    ID: 'add_event_modal',
    TITLE: 'integration.integration_strings.add_integration.add_event.title',
    EVENT_HEADER: 'integration.integration_strings.add_integration.add_event.event_header',
    ADD_KEY: 'integration.integration_strings.add_integration.add_event.add_key',
    ADD_MORE_KEY: 'integration.integration_strings.add_integration.add_event.add_more_key',
    ERROR_MESSAGES: {
      ADD_KEY: 'integration.integration_strings.add_integration.add_event.error_message.add_key',
      REQUIRED_ROW_KEY: 'integration.integration_strings.add_integration.add_event.error_message.required_row_key',
      CHILD_REQUIRED: 'integration.integration_constants.request_configuration.child_required_error',
    },
    EVENT_CATEGORY: {
      ID: 'category',
      LABEL: 'integration.integration_strings.add_integration.add_event.event_category.label',
      PLACEHOLDER: 'integration.integration_strings.add_integration.add_event.event_category.placeholder',
      NEW_CATEGORY_LABEL: 'integration.integration_strings.add_integration.add_event.event_category.new_category_label',
      SEARCH_PLACHOLDER: 'integration.integration_strings.add_integration.add_event.event_category.search_placeholder',
      CREATE_NEW_LABEL: 'integration.integration_strings.add_integration.add_event.event_category.create_new_label',
      INPUT_PLACEHOLDER: 'integration.integration_strings.add_integration.add_event.event_category.input_placeholder',
      CANCEL_BTN: 'integration.integration_strings.add_integration.add_event.event_category.cancel_btn',
      CREATE_BTN: 'integration.integration_strings.add_integration.add_event.event_category.create_btn',
      EDIT_CATEGORY_LABEL: 'integration.integration_strings.add_integration.add_event.event_category.edit_category_label',
      UPDATE_BTN: 'integration.integration_strings.add_integration.add_event.event_category.update_btn',
      NO_DATA: 'integration.integration_strings.add_integration.add_event.event_category.no_data',
    },
    EVENT_NAME: {
      ID: 'name',
      LABEL: 'integration.integration_strings.add_integration.add_event.event_category.event_name.label',
      PLACEHOLDER: 'integration.integration_strings.add_integration.add_event.event_category.event_name.placeholder',
    },
    EVENT_SEARCH: {
      ID: 'event_search',
      PLACEHOLDER: 'integration.integration_strings.add_integration.add_event.event_category.event_search_placeholder',
    },
    EVENT_METHOD: {
      ID: 'method',
      LABEL: 'integration.integration_strings.add_integration.add_event.event_category.event_method.label',
      PLACEHOLDER: 'integration.integration_strings.add_integration.add_event.event_category.event_method.placeholder',
      TYPES: {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        PATCH: 'PATCH',
        DELETE: 'DELETE',
      },
      OPTIONS: [
        {
          label: 'Get',
          value: 'GET',
        },
        {
          label: 'Post',
          value: 'POST',
        },
        {
          label: 'Put',
          value: 'PUT',
        },
        {
          label: 'Patch',
          value: 'PATCH',
        },
        {
          label: 'Delete',
          value: 'DELETE',
        },
      ],
    },
    END_POINT: {
      ID: 'end_point',
      LABEL: 'integration.integration_strings.add_integration.add_event.event_category.end_point.label',
      PLACEHOLDER: 'integration.integration_strings.add_integration.add_event.event_category.end_point.placeholder',
    },
    REQUEST_BODY_HEADERS: (t = () => {}) => [t('integration.integration_strings.add_integration.add_event.event_category.request_body_headers.key'),
    t('integration.integration_strings.add_integration.add_event.event_category.request_body_headers.type'),
    t('integration.integration_strings.add_integration.add_event.event_category.request_body_headers.is_multiple_values_allowed'),
    t('integration.integration_strings.add_integration.add_event.event_category.request_body_headers.is_required')],
    QUERY_PARAMS: {
      TITLE: 'integration.integration_strings.add_integration.add_event.event_category.query_parameters.title',
      SUB_TITLE: 'integration.integration_strings.add_integration.add_event.event_category.query_parameters.sub_title',
      ID: 'params',
      IS_REQUIRED: {
        ID: 'is_required',
        LABEL: 'integration.integration_strings.add_integration.add_event.event_category.request_body_headers.is_required',
        OPTIONS: [
          {
            value: 1,
            label: '',
          },
        ],
      },
    },
    HEADERS: {
      TITLE: 'integration.integration_strings.add_integration.add_event.event_category.headers.title',
      SUB_TITLE: 'integration.integration_strings.add_integration.add_event.event_category.headers.sub_title',
      ID: 'headers',
      IS_REQUIRED: {
        ID: 'is_required',
        LABEL: 'integration.integration_strings.add_integration.add_event.event_category.request_body_headers.is_required',
        OPTIONS: [
          {
            value: 1,
            label: '',
          },
        ],
      },
    },
    API_HEADERS_VALUE: (t = () => {}) => [t('integration.integration_strings.add_integration.add_event.event_category.request_body_headers.key'),
    t('integration.integration_strings.add_integration.add_event.event_category.request_body_headers.is_required'),
     ''],
    EVENTS_TABLE_HEADERS: (t = () => {}) => [
      {
        id: 1,
        label: t('integration.integration_strings.add_integration.add_event.event_category.event_table_headers.name'),
        widthWeight: 4,
        sortBy: 'name',
        sortOrder: 'asc',
      },
      {
        id: 2,
        label: 'Category',
        widthWeight: 2,
        sortBy: 'category',
        sortOrder: 'asc',
      },
      {
        id: 3,
        label: t('integration.integration_strings.add_integration.add_event.event_category.event_table_headers.method'),
        widthWeight: 1,
        sortBy: 'method',
        sortOrder: 'asc',
      },
      {
        id: 4,
        label: t('integration.integration_strings.add_integration.add_event.event_category.event_table_headers.end_point'),
        widthWeight: 1,
        sortBy: 'end_point',
        sortOrder: 'asc',
      },
      {
        id: 5,
        label: '',
        widthWeight: 1,
      },
    ],
    IS_BINARY: {
      ID: 'is_binary',
      OPTIONS: [
        {
          label: 'Is Content-Type Binary?',
          value: true,
        },
      ],
    },
    REQUEST_BODY: {
      TITLE: 'integration.integration_strings.add_integration.add_event.event_category.request_body.title',
      KEY_INPUT: {
        ID: 'key',
        LABEL: 'integration.integration_strings.headers.key_label',
      },
      KEY_TYPE: {
        ID: 'type',
        LABEL: 'integration.integration_strings.add_integration.add_event.event_category.request_body_headers.type',
        OPTIONS: (t = () => {}) => [
          {
            label: t('integration.integration_strings.add_integration.add_event.event_category.request_body.options.text'),
            value: REQ_BODY_KEY_TYPES.TEXT,
          },
          {
            label: t('integration.integration_strings.add_integration.add_event.event_category.request_body.options.number'),
            value: REQ_BODY_KEY_TYPES.NUMBER,
          },
          {
            label: t('integration.integration_strings.add_integration.add_event.event_category.request_body.options.boolean'),
            value: REQ_BODY_KEY_TYPES.BOOLEAN,
          },
          {
            label: t('integration.integration_strings.add_integration.add_event.event_category.request_body.options.date_and_time'),
            value: REQ_BODY_KEY_TYPES.DATE_AND_TIME,
          },
          {
            label: t('integration.integration_strings.add_integration.add_event.event_category.request_body.options.object'),
            value: REQ_BODY_KEY_TYPES.OBJECT,
          },
          {
            label: t('integration.integration_strings.add_integration.add_event.event_category.request_body.options.stream'),
            value: REQ_BODY_KEY_TYPES.STREAM,
          },
        ],
      },
      IS_MULTIPLE: {
        ID: 'is_multiple',
        LABEL: 'integration.integration_strings.add_integration.add_event.event_category.request_body_headers.is_multiple_values_allowed',
        OPTIONS: [
          {
            value: 1,
            label: '',
          },
        ],
      },
      IS_REQUIRED: {
        ID: 'is_required',
        LABEL: 'integration.integration_strings.add_integration.add_event.event_category.request_body_headers.is_required',
        OPTIONS: [
          {
            value: 1,
            label: '',
          },
        ],
      },
      ADD_MORE_CHILD: {
        ID: 'add_more_child',
      },
      DELETE: {
        ID: 'delete',
      },
      TEST: {
        ID: 'test_value',
        ADD_FILE: 'add_test_file',
        DELETE_FILE: 'delete_test_file',
        RETRY_UPLOAD: 'retry_upload_file',
      },
    },
    IS_DOCUMENT_URL: {
      ID: 'is_document_url',
      OPTIONS: [
        {
          label: 'Is Entire Response a Stream?',
          value: true,
        },
      ],
    },
    RESPONSE_BODY: {
      IS_RESPONSE_BODY: {
        ID: 'is_response_body',
        OPTIONS: [
          {
            label: 'Is Response Body?',
            value: 1,
          },
        ],
      },
      LABEL_INPUT: {
        ID: 'label',
        LABEL: 'Label',
      },
    },
  },
  AUTHENTICATION: {
    TITLE: 'integration.authentication.title',
    SENSITIVE_DATA_ASTRIC: '**********',
    BASE_URL: {
      ID: 'base_url',
      LABEL: 'integration.authentication.base_url_label',
    },
    AUTH_CODE: {
      ID: 'code',
      LABEL: 'integration.authentication.auth_code_label',
    },
    AUTHENTICATION_METHOD: {
      ID: 'type',
      LABEL: 'integration.authentication.authentication_method_label',
      TYPES: {
        NO_AUTH: 'no-auth',
        BASIC: 'basic',
      },
      OPTIONS: [
        {
          label: AUTHENTICATION_TYPE_OPTIONS.NO_AUTH,
          value: AUTHENTICATION_TYPE_CONSTANTS.NO_AUTH,
        },
        {
          label: AUTHENTICATION_TYPE_OPTIONS.BASIC,
          value: AUTHENTICATION_TYPE_CONSTANTS.BASIC,
        },
        {
          label: AUTHENTICATION_TYPE_OPTIONS.API_KEY,
          value: AUTHENTICATION_TYPE_CONSTANTS.API_KEY,
        },
        {
          label: AUTHENTICATION_TYPE_OPTIONS.TOKEN,
          value: AUTHENTICATION_TYPE_CONSTANTS.TOKEN,
        },
        {
          label: AUTHENTICATION_TYPE_OPTIONS.OAUTH_AUTH_CODE,
          value: AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE,
        },
        {
          label: AUTHENTICATION_TYPE_OPTIONS.OAUTH_CLIENT_CODE,
          value: AUTHENTICATION_TYPE_CONSTANTS.OAUTH_CLIENT_CODE,
        },
        {
          label: AUTHENTICATION_TYPE_OPTIONS.OAUTH_PASSWORD_GRANT,
          value: AUTHENTICATION_TYPE_CONSTANTS.OAUTH_PASSWORD_GRANT,
        },
      ],
    },
    HEADERS: {
      ID: 'headers',
    },
    QUERY_PARAMS: {
      ID: 'query_params',
    },
    API_HEADERS: {
      ID: 'api_headers',
      OPTIONS: (t = () => {}) => [
        {
          label: t('integration.integration_strings.headers.label'),
          value: true,
        },
      ],
    },
    API_QUERY_PARAMS: {
      ID: 'api_query_params',
      OPTIONS: (t = () => {}) => [
        {
          label: t('integration.authentication.api_query_parameters_label'),
          value: true,
        },
      ],
    },
    USERNAME: {
      ID: 'username',
      LABEL: 'integration.authentication.username_label',
    },
    PASSWORD: {
      ID: 'password',
      LABEL: 'integration.authentication.password_label',
    },
    KEY: {
      ID: 'key',
      LABEL: 'integration.authentication.key_label',
    },
    VALUE: {
      ID: 'value',
      LABEL: 'integration.authentication.value_label',
    },
    ADD_TO: {
      ID: 'add_to',
      LABEL: 'integration.authentication.add_to',
      OPTIONS: (t = () => {}) => [
        {
          label: t(ADD_API_KEY_TO.HEADERS),
          value: 'headers',
        },
        {
          label: t(ADD_API_KEY_TO.QUERY),
          value: 'query',
        },
      ],
    },
    TOKEN: {
      ID: 'token',
      LABEL: 'integration.authentication.token_label',
    },
    AUTH_URL: {
      ID: 'authorization_url',
      LABEL: 'integration.authentication.auth_url_label',
    },
    CLIENT_ID: {
      ID: 'client_id',
      LABEL: 'integration.authentication.client_id_label',
    },
    CLIENT_SECRET: {
      ID: 'client_secret',
      LABEL: 'integration.authentication.client_secret',
    },
    SCOPE: {
      ID: 'scope',
      LABEL: 'integration.authentication.scope',
    },
    TOKEN_URL: {
      ID: 'token_request_url',
      LABEL: 'integration.authentication.token_url_label',
    },
    PKCE: {
      ID: 'is_pkce',
    },
    PKCE_OPTION: (t) => {
      return {
        label: t('integration.authentication.pkce_label'),
        value: true,
      };
    },
    API_HEADERS_VALUE: (t = () => {}) => [t('integration.authentication.key_label'),
    t('integration.authentication.value_label'),
    ''],
  },
  EVENTS: {
    TITLE: 'integration.authentication.event_title',
    SHOWING: 'Showing',
    EDIT_CATEGORY: {
      ID: INTEGRATION_CONSTANTS.EDIT_CATEGORY_ID,
    },
  },
};

export const ADD_EVENT_IDS = [
  INTEGRATION_STRINGS.ADD_EVENT.EVENT_METHOD.ID,
  INTEGRATION_STRINGS.ADD_EVENT.EVENT_NAME.ID,
  INTEGRATION_STRINGS.ADD_EVENT.END_POINT.ID,
];

export const getDefaultKeyLabels = (t, childKey, typeKey, addKeyText, addChildRowText, isButtonlabelAddMore) => {
    return {
    childKey: childKey || 'child_rows',
    typeKey: typeKey || 'type',
    addKey: INTEGRATION_STRINGS.ADD_EVENT.REQUEST_BODY.ADD_MORE_CHILD.ID,
    requiredKey: 'isRequired',
    addRowText: addKeyText || isButtonlabelAddMore ? t(FEATURE_INTEGRATION_STRINGS.ADD_MORE) : t(FEATURE_INTEGRATION_STRINGS.ADD_KEY),
    addChildRowText: addChildRowText || isButtonlabelAddMore ? t(FEATURE_INTEGRATION_STRINGS.ADD_TABLE_COLUMNS) : t(FEATURE_INTEGRATION_STRINGS.ADD_MORE_KEYS),
  };
};
export const getResponseBodyDefaultKeyLabels = (t, childKey, typeKey, addChildRowText) => {
  return {
    childKey: childKey || 'child_rows',
    typeKey: typeKey || 'type',
    addKey: INTEGRATION_STRINGS.ADD_EVENT.REQUEST_BODY.ADD_MORE_CHILD.ID,
    addRowText: t(FEATURE_INTEGRATION_STRINGS.ADD_KEY),
    addChildRowText: addChildRowText || t(FEATURE_INTEGRATION_STRINGS.ADD_MORE_KEYS),
  };
};
export const getIntegrationAuthDetails = (stateDataParam, isPost) => {
  const stateData = cloneDeep(stateDataParam);
  const validateData = {};
  if (!isPost || !isEmpty(stateData?.base_url, EMPTY_STRING)) {
    validateData.base_url = get(stateData, ['authentication', 'base_url'], EMPTY_STRING);
  }
  const authentication = get(stateData, ['authentication'], {});
  if (isPost) {
    if (has(authentication, ['hasSaved'])) delete authentication.hasSaved;
    if (has(authentication, ['redirect_uri'])) delete authentication.redirect_uri;
    if (has(authentication, ['code'])) delete authentication.code;
    if (has(authentication, ['authorization_status'])) delete authentication.authorization_status;
    if (has(authentication, ['expiry_date'])) delete authentication.expiry_date;
    if (has(authentication, ['is_update_auth_base_url'])) delete authentication.is_update_auth_base_url;
    if (has(authentication, ['refresh_token_generated_on'])) delete authentication.refresh_token_generated_on;
    if (has(authentication, ['is_credentials_saved'])) delete authentication.is_credentials_saved;
    if (has(authentication, ['is_authorized'])) delete authentication.is_authorized;
    if (has(authentication, ['challengeMethod'])) delete authentication.challengeMethod;
    if (has(authentication, ['challenge'])) delete authentication.challenge;
    if (authentication?.is_pkce && has(authentication, ['verifier'])) {
      authentication.code_verifier = stateData?.authentication?.verifier;
      delete authentication.verifier;
    }

    if (isEmpty(authentication?.scope)) delete authentication.scope;
    Object.keys(authentication).forEach((key) => {
      if (key.includes('_preview') || key.includes('_toggle')) delete authentication[key];
    });
  } else {
    validateData.api_headers = get(stateData, ['api_headers'], false);
    validateData.api_query_params = get(stateData, ['api_query_params'], false);
  }
  if (!isEmpty(authentication)) set(validateData, ['authentication'], authentication);
  if (!isEmpty(stateData?.headers)) {
    const rawHeaders = get(stateData, ['headers'], []);
    const filteredHeaders = rawHeaders?.filter((currentHeader) => !currentHeader?.is_deleted);
    if (isPost) {
      validateData.headers = filteredHeaders;
    } else {
      validateData.headers = isEmpty(filteredHeaders) ? [] : rawHeaders;
    }
  } else {
    validateData.headers = [];
  }
  if (!isEmpty(stateData?.query_params)) {
    const rawParams = get(stateData, ['query_params'], []);
    const filteredParams = rawParams?.filter((currentParam) => !currentParam?.is_deleted);
    if (isPost) {
      validateData.query_params = filteredParams;
    } else {
      validateData.query_params = isEmpty(filteredParams) ? [] : rawParams;
    }
  } else {
    validateData.query_params = [];
  }
  return validateData;
};

// done
export const getRequestBodyCurrentRow = (currentRow) => {
  const modifiedCurrentRow = {
    key: currentRow?.key,
    type: currentRow?.type,
    is_required: currentRow?.is_required,
    is_multiple: currentRow?.is_multiple,
    key_uuid: currentRow?.key_uuid,
    is_deleted: currentRow?.is_deleted,
  };

  if (currentRow?.root_uuid) set(modifiedCurrentRow, 'root_uuid', currentRow?.root_uuid);

  return modifiedCurrentRow;
};

// done
export const getResponseBodyCurrentRow = (currentRow) => {
  const modifiedCurrentRow = {
    key: currentRow?.key,
    type: currentRow?.type,
    label: currentRow?.label,
    is_multiple: currentRow?.is_multiple,
    key_uuid: currentRow?.key_uuid,
    is_deleted: currentRow?.is_deleted,
  };

  if (currentRow?.root_uuid) set(modifiedCurrentRow, 'root_uuid', currentRow?.root_uuid);

  return modifiedCurrentRow;
};

// done
export const constructRequestBodyPostData = (reqParam, updatedList, getCurrentRow, isTest = false) => {
  reqParam?.forEach((currentRow) => {
    if (isTest && !currentRow?.keepChild) return;
    const modifiedCurrentRow = getCurrentRow && getCurrentRow(currentRow);
    console.log('modifiedCurrentRow modifiedCurrentRow', modifiedCurrentRow);
    if (!modifiedCurrentRow?.is_deleted) {
      delete modifiedCurrentRow.is_deleted;
      updatedList.push(modifiedCurrentRow);
    }

    if (currentRow && (currentRow?.child_rows && currentRow?.child_rows?.length > 0)) {
      constructRequestBodyPostData(
        currentRow.child_rows,
        updatedList,
        getCurrentRow,
        isTest,
      );
    }
  });
  return updatedList;
};

export const getRequestBodyValidateData = (requestBody = []) => requestBody;

export const getEventsPostData = (activeEventParam, isPost) => {
  const postData = {};
  const activeEvent = cloneDeep(activeEventParam);
  console.log('activeEvent3232', activeEvent, 'is_document_url', activeEvent?.is_document_url);
  const eventUuid = get(activeEvent, 'event_uuid', null);
  if (eventUuid) postData.event_uuid = eventUuid;
  postData.category = get(activeEvent, 'category', null);
  postData.name = get(activeEvent, 'name', null);
  postData.method = get(activeEvent, 'method', null);
  postData.end_point = get(activeEvent, 'end_point', null);
  postData.is_document_url = activeEvent?.is_document_url || false;
  let queryParams = get(activeEvent, 'params', []);
  let eventHeaders = get(activeEvent, 'headers', []);
  if (isPost) queryParams = queryParams?.filter((param) => !param?.is_deleted);
  if (isPost) eventHeaders = eventHeaders?.filter((header) => !header?.is_deleted);
  postData.is_binary = activeEvent?.is_binary || false;
  postData.params = queryParams?.map((param) => {
    let currentParam = {
      key: param?.key,
      is_required: param?.is_required,
    };
    if (!isEmpty(param?.key_uuid)) currentParam.key_uuid = param?.key_uuid;

    if (param?.is_deleted) currentParam = param;
    return currentParam;
  });

  if (isEmpty(postData.params)) delete postData.params;

  postData.headers = eventHeaders?.map((header) => {
    let currentHeader = {
      key: header?.key,
      is_required: header?.is_required,
    };
    if (!isEmpty(header?.key_uuid)) currentHeader.key_uuid = header?.key_uuid;

    if (header?.is_deleted) currentHeader = header;
    return currentHeader;
  });

  if (isEmpty(postData.headers)) delete postData.headers;

  if (
    postData.method !== INTEGRATION_STRINGS.ADD_EVENT.EVENT_METHOD.TYPES.GET &&
    !isEmpty(get(activeEvent, 'body', []))
  ) {
    postData.body = constructRequestBodyPostData(
      get(activeEvent, 'body', []),
      [],
      getRequestBodyCurrentRow,
    );

    if (isEmpty(postData.body)) delete postData.body;
  }

  if (!isPost) postData.is_response_body = get(activeEvent, 'is_response_body', null);

  if (
    !isEmpty(get(activeEvent, 'response_body', []))
  ) {
    postData.response_body = constructRequestBodyPostData(
      get(activeEvent, 'response_body', []),
      [],
      getResponseBodyCurrentRow,
    );

    if (isEmpty(postData.response_body)) delete postData.response_body;
  }

  return postData;
};

export const getTemplateEventsPostData = (activeEventParam) => {
  const postData = {};
  const activeEvent = cloneDeep(activeEventParam);
  const eventUuid = get(activeEvent, 'event_uuid', null);
  if (eventUuid) postData.event_uuid = eventUuid;

  if (
    !isEmpty(get(activeEvent, 'response_body', []))
  ) {
    postData.response_body = constructRequestBodyPostData(
      get(activeEvent, 'response_body', []),
      [],
      getResponseBodyCurrentRow,
    );

    if (isEmpty(postData.response_body)) delete postData.response_body;
  }

  return postData;
};

export const getEventsReducerData = (activeEventParam) => {
  const reducerData = {};
  const activeEvent = cloneDeep(activeEventParam);
  console.log('activeEventgetData', activeEvent);
  const eventUuid = get(activeEvent, 'event_uuid', null);
  if (eventUuid) reducerData.event_uuid = eventUuid;
  reducerData.category = get(activeEvent, 'category', null);
  reducerData.name = get(activeEvent, 'name', null);
  reducerData.method = get(activeEvent, 'method', null);
  reducerData.end_point = get(activeEvent, 'end_point', null);
  reducerData.is_document_url = activeEvent.is_document_url;
  reducerData.is_binary = activeEvent.is_binary;
  const eventHeaders = get(activeEvent, 'headers', []);
  if (!isEmpty(eventHeaders)) {
    reducerData.headers = eventHeaders?.map((header) => {
      const currentHeader = {
        key: header?.key,
        is_required: header?.is_required,
      };

      if (!isEmpty(header?.key_uuid)) currentHeader.key_uuid = header?.key_uuid;

      return currentHeader;
    });
  }
  const queryParams = get(activeEvent, 'params', []);
  if (!isEmpty(queryParams)) {
    reducerData.params = queryParams?.map((param) => {
      const currentParam = {
        key: param?.key,
        is_required: param?.is_required,
      };

      if (!isEmpty(param?.key_uuid)) currentParam.key_uuid = param?.key_uuid;

      return currentParam;
    });
  }
  const requestBody = get(activeEvent, 'body', []);
  if (!isEmpty(requestBody)) {
    reducerData.body = getModifiedRequestBody(requestBody);
  }
  const responseBody = get(activeEvent, 'response_body', []);
  if (!isEmpty(responseBody)) {
    reducerData.response_body = getModifiedRequestBody(responseBody);
    reducerData.is_response_body = 1;
  }

  if (reducerData.method === INTEGRATION_STRINGS.ADD_EVENT.EVENT_METHOD.TYPES.GET) {
    reducerData.is_response_body = 1;
  }

  return reducerData;
};

export const constructConnectorPostData = (stateDataParam, isPost = false) => {
  const stateData = cloneDeep(stateDataParam);
  const authData = { ...getIntegrationAuthDetails(stateData, isPost) };
  let postData = {};
  console.log('fdgdfdgfd hjhjkhj', get(stateDataParam, ['init_authentication']), get(authData, ['authentication']));
  if (isPost && !isEmpty(get(stateDataParam, ['init_authentication'])) && isEqual(get(stateDataParam, ['init_authentication']), get(authData, ['authentication']))) {
    unset(authData, ['authentication']);
  }
  postData = { ...authData };
  if (stateData?._id) postData._id = stateData._id;
  if (stateData?.connector_uuid) postData.connector_uuid = stateData.connector_uuid;
  if (isPost) postData.connector_name = stateData?.name;
  else postData.name = stateData?.name;
  if (stateData?.description) postData.description = stateData?.description;
  postData.base_url = get(stateData, ['base_url'], EMPTY_STRING);
  if (stateDataParam?.isExternalIntegration) {
    if (stateData?.template_id) postData.template_id = stateData.template_id;
  } else if (!isPost) {
    postData.events_count = get(stateData, 'connector_events_count', 0);
  } else {
    // do nothing
  }

  console.log(postData, 'jjbnjbb');
  return postData;
};

export const getSingleConnectorData = (apiDataParam) => {
  const apiData = cloneDeep(apiDataParam);
  const stateData = {};
  set(stateData, 'selected_connector', apiData?._id);
  set(stateData, '_id', apiData?._id);
  set(stateData, 'version', apiData?.version);
  set(stateData, 'connector_status', apiData?.status);
  set(stateData, 'connector_uuid', apiData?.connector_uuid);
  set(stateData, 'connector_logo', apiData?.connector_logo);
  set(stateData, 'template_id', apiData?.template_id);
  if (!apiData?.template_id) {
    set(stateData, 'selected_template_details', {
      template_id: apiData?.template_id,
      name: apiData?.template_name || translate(FEATURE_INTEGRATION_STRINGS.CUSTOM),
    });
    if (apiData.base_url) {
      const decodedBaseUrl = decodeURIComponent(apiData.base_url);
      set(stateData, ['base_url'], (decodedBaseUrl || EMPTY_STRING));
    }
  } else {
    set(stateData, ['base_url'], (apiData?.base_url || EMPTY_STRING));
  }
  set(stateData, 'name', apiData?.connector_name);
  set(stateData, 'description', (apiData?.description || EMPTY_STRING));
  const admins = apiData?.admins;
  const teams = [];
  const users = [];
  if (admins?.teams) {
    (admins?.teams || []).forEach((team) => (teams.push({ ...team, id: team._id, label: team.team_name, name: team.team_name })));
  }
  if (admins?.users) {
    (admins?.users || []).forEach((user) => {
      const label = getFullName(user.first_name, user.last_name);
      users.push({
        ...user,
        id: user._id,
        label,
        name: label,
        is_user: true,
      });
  });
  }
  set(stateData, 'admins', { teams, users });
  set(
    stateData,
    ['init_authentication'],
    cloneDeep(get(apiData, ['authentication'], {})),
  );
  set(
    stateData,
    ['authentication'],
    get(apiData, ['authentication'], { hasSaved: false }),
  );
  if (!isEmpty(apiData?.authentication)) {
    if (has(apiData, ['authentication', 'is_credentials_saved'])) {
      const isCredentialSaved = get(apiData, ['authentication', 'is_credentials_saved'], false);
      set(stateData, ['authentication', 'hasSaved'], isCredentialSaved);
    }

    if (has(apiData, ['authentication', 'is_authorized'])) {
      const isAuthorized = get(apiData, ['authentication', 'is_authorized'], false);
      set(stateData, ['authentication', 'is_authorized'], isAuthorized);
    }

    if (has(apiData, ['authentication', 'type']) && (get(apiData, ['authentication', 'type']) === AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE)) {
      const redirect_uri = `${window.location.protocol}//${window.location.host}${ROUTE_CONSTANTS.AUTHORIZE_APP}`;
      set(apiData, ['authentication', 'redirect_uri'], redirect_uri);
    }
  }
  if (!isEmpty(apiData?.headers)) {
    set(stateData, ['headers'], apiData.headers);
    set(stateData, ['api_headers'], true);
  }
  if (!isEmpty(apiData?.query_params)) {
    set(stateData, ['query_params'], apiData.query_params);
    set(stateData, ['api_query_params'], true);
  }
  set(stateData, 'connector_events_count', get(apiData, 'no_of_events', 0));
  return stateData;
};

export const getEventsByCategory = (events) => {
  const groupedEvents = groupBy(events, (event) => event.category);

  return groupedEvents;
};

const base64URLEncode = (str) => str.toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '');

const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest();

export const getCodeChallengeAndVerifier = () => {
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const challenge = base64URLEncode(sha256(verifier));
  return {
    verifier,
    challenge,
    challengeMethod: PKCE_CHALLENGE_METHOD,
  };
};

export const authorizeAppInNewWindow = (authentication, setExternalPopup) => {
  const WIDTH = 500;
  const HEIGHT = 400;
  const left = window.screenX + (window.outerWidth - WIDTH) / 2;
  const top = window.screenY + (window.outerHeight - HEIGHT) / 2.5;
  const { authorization_url, scope, client_id, redirect_uri } = authentication;
  const { origin, pathname, searchParams } = new URL(authorization_url);
  const searchObj = {
    ...getAllSearchParams(searchParams),
    client_id,
    redirect_uri,
    response_type: 'code',
  };

  if (!isEmpty(scope)) searchObj.scope = scope;
  if (authentication.is_pkce) {
    searchObj.code_challenge = authentication.challenge;
    searchObj.code_challenge_method = authentication.challengeMethod;
  }
  const search = {
    authorizeUrl: `${origin}${pathname}?${new URLSearchParams(searchObj).toString()}`,
  };
  const searchString = new URLSearchParams(search).toString();
  const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${WIDTH},height=${HEIGHT},top=${top},left=${left}`;
  const authWindow = window.open(
    `${ROUTE_CONSTANTS.AUTHORIZE_APP}?${searchString}`, 'test', params);
  setExternalPopup(authWindow);
};

export const getAuthValidationData = (stateAuth = {}, isTemplateData = false) => {
  const validateData = {};

  set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.AUTHENTICATION_METHOD.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.AUTHENTICATION_METHOD.ID]);

  switch (stateAuth?.type) {
    case AUTHENTICATION_TYPE_CONSTANTS.BASIC:
      if (!isTemplateData) {
        set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.USERNAME.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.USERNAME.ID]);
        set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.PASSWORD.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.PASSWORD.ID]);
      }
      break;
    case AUTHENTICATION_TYPE_CONSTANTS.API_KEY:
      if (!isTemplateData) {
        set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.KEY.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.KEY.ID]);
        set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.VALUE.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.VALUE.ID]);
      }
      set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.ADD_TO.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.ADD_TO.ID]);
      break;
    case AUTHENTICATION_TYPE_CONSTANTS.TOKEN:
      if (!isTemplateData) {
        set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.TOKEN.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.TOKEN.ID]);
      }
      break;
    case AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE:
      if (!isTemplateData) {
        set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.CLIENT_ID.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.CLIENT_ID.ID]);
        set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.CLIENT_SECRET.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.CLIENT_SECRET.ID]);
      }
      set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.SCOPE.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.SCOPE.ID]);
      set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.TOKEN_URL.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.TOKEN_URL.ID]);
      set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.AUTH_URL.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.AUTH_URL.ID]);
      set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.PKCE.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.PKCE.ID] || false);
      validateData.redirect_uri = `${window.location.protocol}//${window.location.host}${ROUTE_CONSTANTS.AUTHORIZE_APP}`;
      validateData.authorization_status = AUTHORIZATION_STATUS.YET_TO_INITIATE;
      break;
    case AUTHENTICATION_TYPE_CONSTANTS.OAUTH_CLIENT_CODE:
      if (!isTemplateData) {
        set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.CLIENT_ID.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.CLIENT_ID.ID]);
        set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.CLIENT_SECRET.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.CLIENT_SECRET.ID]);
      }
      set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.SCOPE.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.SCOPE.ID]);
      set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.TOKEN_URL.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.TOKEN_URL.ID]);
      set(validateData, INTEGRATION_STRINGS.AUTHENTICATION.AUTH_URL.ID, stateAuth[INTEGRATION_STRINGS.AUTHENTICATION.AUTH_URL.ID]);
      validateData.authorization_status = AUTHORIZATION_STATUS.YET_TO_INITIATE;
      break;
    case AUTHENTICATION_TYPE_CONSTANTS.NO_AUTH:
      break;
    default:
      break;
  }
  return validateData;
};

export const getExternalIntegrationStateData = (apiData, returnFullDetails = false, authDetails = {}, events_count = 0) => {
  const stateData = {};

  set(stateData, 'template_id', apiData?._id);
  set(stateData, ['selected_template_details', 'name'], apiData?.name);
  set(stateData, ['selected_template_details', 'description'], apiData?.description);
  set(stateData, ['selected_template_details', 'base_url'], apiData?.base_url);

  if (returnFullDetails) {
    const templateAuthDetails = getAuthValidationData(get(apiData, ['authentication'], { hasSaved: false }), true);

    if (templateAuthDetails?.type === AUTHENTICATION_TYPE_CONSTANTS.OAUTH_AUTH_CODE) {
      if (!get(apiData, ['authentication', 'is_update_auth_base_url'], false)) {
        set(templateAuthDetails, ['authorization_url'], get(templateAuthDetails, ['authorization_url', 0], EMPTY_STRING));
        set(templateAuthDetails, ['token_request_url'], get(templateAuthDetails, ['token_request_url', 0], EMPTY_STRING));
      } else {
        set(templateAuthDetails, 'authorization_url', EMPTY_STRING);
        set(templateAuthDetails, 'token_request_url', EMPTY_STRING);
      }
    } else if (templateAuthDetails?.type === AUTHENTICATION_TYPE_CONSTANTS.OAUTH_CLIENT_CODE) {
      if (!get(apiData, ['authentication', 'is_update_auth_base_url'], false)) {
        set(templateAuthDetails, ['token_request_url'], get(templateAuthDetails, ['token_request_url', 0], EMPTY_STRING));
      } else {
        set(templateAuthDetails, 'token_request_url', EMPTY_STRING);
      }
    } else {
      // do nothing
    }

    const authenticationObject = {
      ...get(apiData, ['authentication'], { hasSaved: false }),
      ...templateAuthDetails,
      ...authDetails,
    };

    if (!isEmpty(authDetails) && has(authDetails, ['is_credentials_saved'])) {
      const isCredentialSaved = get(authDetails, ['is_credentials_saved'], false);
      set(authenticationObject, ['hasSaved'], isCredentialSaved);
    }

    set(
      stateData,
      ['authentication'],
      authenticationObject,
    );
    set(
      stateData,
      ['selected_template_details', 'authentication'],
      get(apiData, ['authentication'], { hasSaved: false }),
    );
    if (!isEmpty(apiData?.headers)) {
      set(stateData, ['headers'], apiData.headers);
      set(stateData, ['api_headers'], true);
    }
    if (!isEmpty(apiData?.query_params)) {
      set(stateData, ['query_params'], apiData.query_params);
      set(stateData, ['api_query_params'], true);
    }
    set(stateData, 'connector_events_count', events_count);
  }

  return stateData;
};

export const getEditIntegrationSecondaryActionMenu = (version, t = () => { }) => {
  const optionList = [
    {
      label: t(INTEGRATION_HEADERS_STRINGS.EDIT_NAME_AND_SECURITY),
      icon: <EditDetailsIconV2 />,
      value: INTEGRATION_CONSTANTS.SECONDARY_ACTIONS_LIST.EDIT_NAME_AND_SECURITY,
      isChecked: false,
    },
    {
      label: t(INTEGRATION_HEADERS_STRINGS.DELETE),
      icon: <Trash />,
      value: INTEGRATION_CONSTANTS.SECONDARY_ACTIONS_LIST.DELETE,
      isChecked: false,
    },
  ];
  if (version > 1) {
    optionList.push({
      label: t(INTEGRATION_HEADERS_STRINGS.DISCARD_INTEGRATION),
      icon: <DiscardIcon />,
      value: INTEGRATION_CONSTANTS.SECONDARY_ACTIONS_LIST.DISCARD,
      isChecked: false,
    });
  }
  return optionList;
};

export const isAuthDetailsChanged = (initAuth = {}, currentAuth = {}) => {
  const keysTobeChecked = ['type', 'authorization_url', 'client_id', 'client_secret', 'scope', 'token_request_url'];
  return keysTobeChecked.some((currentKey) => initAuth[currentKey] !== currentAuth[currentKey]);
};

export const validateAndExtractRelativePathFromEndPoint = (endPoint = EMPTY_STRING, existingParams = []) => {
  function extractPathParameters(url) {
    const regex = EXTRACT_RELATIVE_PATH_REGEX;
    const matches = Array.from(url.matchAll(regex));

    const openingBracesCount = (url.match(/{/g) || []).length;
    const closingBracesCount = (url.match(/}/g) || []).length;

    if (
      openingBracesCount !== closingBracesCount ||
      CURLY_BRACES_REGEX.test(url) ||
      RELATIVE_PATH_REGEX.test(url) ||
      URL_END_REGEX.test(url) ||
      URL_INCOMPLETE_REGEX.test(url) ||
      CURLY_BRACES_INCOMPLETE_REGEX.test(url) ||
      CURLY_BRACES_URL_END_REGEX.test(url)
    ) {
      throw new Error(FEATURE_INTEGRATION_STRINGS.END_POINT_ERROR.INVALID_BRACES);
    }

    const pathParams = matches.map((match) => {
      const param = match[1];

      if (param === '') {
        throw new Error(`${FEATURE_INTEGRATION_STRINGS.END_POINT_ERROR.EMPTY_RELATIVE_PATH} ${match[0]}`);
      }

      if (!END_POINT_REGEX.test(param)) {
        throw new Error(`${FEATURE_INTEGRATION_STRINGS.END_POINT_ERROR.INVALID_CHARACTERS} ${match[0]}`);
      }

      return param;
    });
    if (new Set(pathParams).size !== pathParams.length) {
      throw new Error(FEATURE_INTEGRATION_STRINGS.END_POINT_ERROR.DUPLICATE);
    }
    return pathParams;
  }

  const relative_path_params = existingParams;
  let relativePathError = EMPTY_STRING;
  try {
    (extractPathParameters(endPoint) || []).forEach((param) => {
      if (!relative_path_params.find((relParam) => relParam.key === param)) {
        relative_path_params.push({
          key: param,
          is_required: true,
          key_uuid: uuidv4(),
        });
      }
    });
  } catch (error) {
    relativePathError = error?.message === FEATURE_INTEGRATION_STRINGS.END_POINT_ERROR.DUPLICATE ?
    FEATURE_INTEGRATION_STRINGS.END_POINT_ERROR.DUPLICATE
    : FEATURE_INTEGRATION_STRINGS.END_POINT_ERROR.INVALID;
  }
  return { relative_path_params, relativePathError };
};

const getCurrentRowPostData = (currentRow) => {
  let value = EMPTY_STRING;
  if ((currentRow?.type !== REQ_BODY_KEY_TYPES.OBJECT) || isEmpty(currentRow?.child_rows)) {
    if (currentRow.type === REQ_BODY_KEY_TYPES.STREAM) {
      value = [];
      (currentRow?.test_value?.fileData || []).forEach((file) => {
        value.push(file.fileId);
      });
    } else {
      if (has(currentRow, 'test_value')) {
        value = currentRow.test_value;
      }
    }
  }
  return {
    key: currentRow?.key_uuid,
    value,
  };
};

const getRelativePathPostData = (currentRow) => {
  return {
    path_name: currentRow?.key,
    value: currentRow?.test_value,
  };
};

export const constructIntegrationTestPostData = (
  testEventDetails,
) => {
  const clonedTestDetails = cloneDeep(testEventDetails);

  const {
    connector_uuid,
    event_uuid,
    body = [],
    params = [],
    relative_path = [],
    headers = [],
  } = clonedTestDetails;

  const testBody = constructRequestBodyPostData(
    body,
    [],
    getCurrentRowPostData,
    true,
  );

  const testEventHeaders = [];
  if (!isEmpty(headers)) {
    headers.forEach((header) => {
      if (!isEmpty(header.test_value)) {
        testEventHeaders.push(getCurrentRowPostData(header));
      }
    });
  }
  const testParams = [];
  if (!isEmpty(params)) {
    params.forEach((param) => {
      if (!isEmpty(param.test_value)) {
        testParams.push(getCurrentRowPostData(param));
      }
    });
  }
  const testRelativePath = [];
  if (!isEmpty(relative_path)) {
    relative_path.forEach((param) => {
      if (!isEmpty(param.test_value)) {
        testRelativePath.push(getRelativePathPostData(param));
      }
    });
  }

  const integrationDetailsPostData = {
    connector_uuid,
    event_uuid,
  };

  if (!isEmpty(testBody)) integrationDetailsPostData.body = testBody;
  if (!isEmpty(testEventHeaders)) integrationDetailsPostData.event_headers = testEventHeaders;
  if (!isEmpty(testParams)) integrationDetailsPostData.query_params = testParams;
  if (!isEmpty(testRelativePath)) integrationDetailsPostData.relative_path = testRelativePath;

  return integrationDetailsPostData;
};

export const isAllRowsDeleted = (tableRows = []) => {
  if (isEmpty(tableRows)) return true;
  else {
    let isAllRowsDeleted = true;

    tableRows.forEach((eachRow) => {
      if (!(has(eachRow, 'is_deleted') && eachRow?.is_deleted === true)) {
        isAllRowsDeleted = false;
      }
    });
    return isAllRowsDeleted;
  }
};

export const getCurrentFlowActions = (actionsParam = []) => {
  const actions = actionsParam?.filter((currentAction) => currentAction?.action_type !== ACTION_TYPE.CANCEL);
  if (isEmpty(actions)) return [];

  return actions?.map((currentAction) => {
    return {
      label: currentAction?.action_name,
      value: currentAction?.action_uuid,
    };
  });
};

export const DEFAULT_REQUEST_KEY_LABELS = (t) => {
  return {
  childKey: 'child_rows',
  typeKey: 'type',
  addKey: t(FEATURE_INTEGRATION_STRINGS.ADD_MORE_KEY),
  requiredKey: 'isRequired',
  addRowText: t(FEATURE_INTEGRATION_STRINGS.ADD_KEY),
  addChildRowText: t(FEATURE_INTEGRATION_STRINGS.ADD_MORE_KEY),
  };
};

export const getServerErrors = (err, t = translateFunction, data = {}) => {
  const server_response = err?.response;
  const error_list = {};
  const additionalData = {};
  const disabledAdminUsers = [];
  const disabledAdminTeams = [];
  let serverErrorText = t(INTEGRATION_ERROR_STRINGS.CONFIG);
  if (server_response?.data?.errors) {
    const errList = (server_response.data.errors) || [];
    errList.forEach((errorData) => {
      const { field, values } = errorData;
      switch (errorData.type) {
        case 'any.invalid':
          if (field?.includes('admins')) {
            error_list[CREATE_INTEGRATION.ADMINS.ID] = t(INTEGRATION_ERROR_STRINGS.ADMINS.INVALID);
          }
          if (field.includes('admins.users') && (data?.admins?.users)) {
            disabledAdminUsers.push(get(data, field.split('.'), null));
          }
          if (field.includes('admins.teams') && (data?.admins?.teams)) {
           disabledAdminTeams.push(get(data, field.split('.'), null));
          }
          console.log('invalidadmins12sqw2');
          break;
        case 'any.required':
          if (field?.includes('admins')) {
            error_list[CREATE_INTEGRATION.ADMINS.ID] = t(INTEGRATION_ERROR_STRINGS.ADMINS.REQUIRED);
          } else if (field.includes('body')) {
            error_list.body = t(INTEGRATION_ERROR_STRINGS.BODY);
          }
          break;
        case VALIDATION_ERROR_TYPES.LIMIT:
          serverErrorText = t(INTEGRATION_ERROR_STRINGS.LIMIT);
          break;
        case 'exist':
          if (['connector_name', 'name'].includes(field)) {
            error_list[INTEGRATION_STRINGS.ADD_INTEGRATION.INTEGRATION_NAME.ID] =
              t(INTEGRATION_ERROR_STRINGS.CONNECTOR_NAME);
          } else if (field.includes('url_path')) {
            error_list[WORKHALL_API_STRINGS.API_URL.ID] =
              t(INTEGRATION_ERROR_STRINGS.URL_PATH);
          } else if ('db_connector_name'.includes(field)) {
            error_list[INTEGRATION_STRINGS.ADD_INTEGRATION.INTEGRATION_NAME.ID] = t(INTEGRATION_ERROR_STRINGS.DB_CONNECTOR_NAME);
          }
          break;
        case 'invalid':
          if (field === 'authentication_id') {
            additionalData.disabledCredList = values;
          }
          break;
        case 'any.only':
          if (field.includes('admins.users') && (data?.admins?.users)) {
            disabledAdminUsers.push(get(data, field.split('.'), null));
          }
          if (field.includes('admins.teams') && (data?.admins?.teams)) {
           disabledAdminTeams.push(get(data, field.split('.'), null));
          }
          break;
        default:
          break;
      }
    });
  }
  return {
    error_list,
    serverErrorText,
    additionalData: {
      ...additionalData,
      disabledAdminUsers,
      disabledAdminTeams,
    },
  };
};

export const getResponseData = () => ([
  {
      is_table: false,
      key: SUCCESS_RESPONSE_KEYS.IS_SUCCESS,
      value_type: 'default',
      keyType: ALLOWED_INTEGRATION_VALUES.BOOLEAN,
      isReadOnlyResponse: true,
  },
  {
      is_table: false,
      key: SUCCESS_RESPONSE_KEYS.STATUS_CODE,
      value_type: 'default',
      keyType: ALLOWED_INTEGRATION_VALUES.NUMBER,
      isReadOnlyResponse: true,
  },
  {
      is_table: true,
      key: SUCCESS_RESPONSE_KEYS.RESULT,
      value_type: 'default',
      keyType: ALLOWED_INTEGRATION_VALUES.OBJECT,
      isReadOnlyResponse: true,
      column_mapping: [
          {
              is_table: false,
              key: SUCCESS_RESPONSE_KEYS.ID,
              value_type: 'default',
              keyType: ALLOWED_INTEGRATION_VALUES.STRING,
              isReadOnlyResponse: true,
          },
          {
            is_table: false,
            key: SUCCESS_RESPONSE_KEYS.REFERENCE_ID,
            value_type: 'default',
            keyType: ALLOWED_INTEGRATION_VALUES.STRING,
            isReadOnlyResponse: true,
          },
      ],
  },
]);

export const getSuccessResponseData = () => ([
  {
      field: SUCCESS_RESPONSE_KEY_STRINGS.IS_SUCCESS,
      is_table: false,
      key: SUCCESS_RESPONSE_KEYS.IS_SUCCESS,
      value_type: 'default',
      keyType: ALLOWED_INTEGRATION_VALUES.BOOLEAN,
  },
  {
      field: SUCCESS_RESPONSE_KEY_STRINGS.STATUS_CODE,
      is_table: false,
      key: SUCCESS_RESPONSE_KEYS.STATUS_CODE,
      value_type: 'default',
      keyType: ALLOWED_INTEGRATION_VALUES.NUMBER,
  },
  {
      field: SUCCESS_RESPONSE_KEY_STRINGS.RESULT,
      is_table: true,
      key: SUCCESS_RESPONSE_KEYS.RESULT,
      value_type: 'default',
      keyType: ALLOWED_INTEGRATION_VALUES.OBJECT,
      column_mapping: [
          {
              field: SUCCESS_RESPONSE_KEY_STRINGS.TOTAL_COUNT,
              is_table: false,
              key: SUCCESS_RESPONSE_KEYS.TOTAL_COUNT,
              value_type: 'default',
              keyType: ALLOWED_INTEGRATION_VALUES.NUMBER,
          },
          {
              field: SUCCESS_RESPONSE_KEY_STRINGS.PAGE,
              is_table: false,
              key: SUCCESS_RESPONSE_KEYS.PAGE,
              value_type: 'default',
              keyType: ALLOWED_INTEGRATION_VALUES.NUMBER,
          },
          {
              field: SUCCESS_RESPONSE_KEY_STRINGS.SIZE,
              is_table: false,
              key: SUCCESS_RESPONSE_KEYS.SIZE,
              value_type: 'default',
              keyType: ALLOWED_INTEGRATION_VALUES.NUMBER,
          },
          {
              field: SUCCESS_RESPONSE_KEY_STRINGS.DATA,
              key: SUCCESS_RESPONSE_KEYS.DATA,
              value_type: 'default',
              keyType: ALLOWED_INTEGRATION_VALUES.OBJECT,
              is_multiple: true,
              is_table: true,
              column_mapping: [],
              field_type: 'table',
              path: 'initial',
          },
      ],
  },
]);

export const getAPIConfigBaseUrl = (isFlowApi) => `
${window.location.protocol}//${window.location.host}/${API_CONFIG_URL.BASE}/${
  isFlowApi ? API_CONFIG_URL.FLOW : API_CONFIG_URL.DATA_LIST
}`;

export const getDeactivatedAdminsError = (deactivatedUsers = [], deactivatedTeams = []) => {
  const deactivatedData = [...deactivatedUsers, ...deactivatedTeams];
  const deactivatedStrArr = [];
  deactivatedData.forEach((userOrTeam) => {
      deactivatedStrArr.push(userOrTeam.label || userOrTeam.email);
  });
  if (!isEmpty(deactivatedStrArr)) {
    return `${CREATE_INTEGRATION.ADMINS.INVALID_ADMINS} ${deactivatedStrArr.join(', ')}`;
  }
  return null;
};
