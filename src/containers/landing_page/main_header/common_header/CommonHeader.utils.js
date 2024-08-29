import {
  getTaskUrl,
  getFlowUrl,
  getDatalistUrl,
} from 'utils/taskContentUtils';
import getAdminAccountsNavbarOptions, {
  getAdminAccountsUrl,
} from 'containers/admin_panel/admin_pages/AdminPages.utils';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import {
  ADMIN_ACCOUNTS_INITIAL,
  ADMIN_ACCOUNTS_ACCOUNTS,
  ADMIN_ACCOUNTS_SUMMARY,
  LIST_FLOW,
  TEST_BED,
} from 'urls/RouteConstants';
import ADMIN_ACCOUNTS_STRINGS from 'containers/admin_panel/admin_pages/AdminPages.string';
import { getIntegrationUrlFromTab } from 'containers/integration/Integration.utils';
import { translate } from 'language/config';
import { FLOW_DROPDOWN, getFlowNavbarOptions } from '../../../flow/listFlow/listFlow.strings';
import { getDatalistNavbarOptions } from '../../../data_list/listDataList/listDataList.strings';
import { LANDING_PAGE_TOPICS, SIDE_NAV_BAR } from './CommonHeader.strings';
import { routeNavigate } from '../../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../../utils/Constants';
import { getTeamlistUrl } from '../../../team/teams.utils';
import { CREATE_FLOW } from '../../../../redux/actions/ActionConstants';

export const getTabUrl = (currentHeader, value = null, t) => {
  if (currentHeader === t(LANDING_PAGE_TOPICS.TASKS)) {
    return `/tasks/${getTaskUrl(Number(value.value))}`;
  } else if (currentHeader === t(LANDING_PAGE_TOPICS.FLOW)) {
    return `${LIST_FLOW}${getFlowUrl(Number(value.value))}`;
  } else if (currentHeader === t(LANDING_PAGE_TOPICS.DATALIST)) {
    return `/data_lists/${getDatalistUrl(Number(value.value))}`;
  } else if (currentHeader === t(LANDING_PAGE_TOPICS.TEAMS)) {
    return `/teams/${getTeamlistUrl(Number(value.value))}`;
  } else if (currentHeader === t(SIDE_NAV_BAR.INTEGRATION)) {
    return getIntegrationUrlFromTab(Number(value.value));
  } else if (currentHeader === t(SIDE_NAV_BAR.ADMIN_ACCOUNTS)) {
    return `/${ADMIN_ACCOUNTS_INITIAL}/${getAdminAccountsUrl(
      Number(value.value),
    )}`;
  } else return null;
};

export const getTabIndexByHistory = (history) => {
  if (history) {
    if (
      history.location.pathname.includes(`/${ADMIN_ACCOUNTS_INITIAL}`) &&
      history.location.pathname.includes(`/${ADMIN_ACCOUNTS_ACCOUNTS}`)
    ) {
      return ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.TAB_INDEX;
    } else if (
      history.location.pathname.includes(`/${ADMIN_ACCOUNTS_INITIAL}`) &&
      history.location.pathname.includes(`/${ADMIN_ACCOUNTS_SUMMARY}`)
    ) {
      return ADMIN_ACCOUNTS_STRINGS.DASHBOARD.TAB_INDEX;
    }
  }
  return 0;
};

export const getSelectedCondition = (
  history,
  currentHeader,
  tab_index,
  flow_tab_index,
  datalist_tab_index,
  nav,
  integration_tab_index,
  t,
) => {
  const { value } = nav;
  if (currentHeader === t(LANDING_PAGE_TOPICS.TASKS)) return tab_index === value;
  else if (currentHeader === t(LANDING_PAGE_TOPICS.FLOW)) {
    if (history?.location?.pathname.includes(TEST_BED)) {
      return value === FLOW_DROPDOWN.UNDER_TESTING;
    }
    return flow_tab_index === value;
  } else if (currentHeader === t(LANDING_PAGE_TOPICS.DATALIST)) {
    return datalist_tab_index === value;
  } else if (currentHeader === t(SIDE_NAV_BAR.ADMIN_ACCOUNTS)) {
    return getTabIndexByHistory(history) === value;
  } else if (currentHeader === t(SIDE_NAV_BAR.INTEGRATION)) {
    return integration_tab_index === value;
  }
  return false;
};

export const getMarginCondition = (value, currentHeader, t) => {
  if (currentHeader === t(LANDING_PAGE_TOPICS.TASKS)) return value.value !== 5;
  else if (
    currentHeader === t(LANDING_PAGE_TOPICS.FLOW) ||
    currentHeader === t(LANDING_PAGE_TOPICS.DATALIST) ||
    currentHeader === t(LANDING_PAGE_TOPICS.TEAMS) ||
    currentHeader === t(SIDE_NAV_BAR.INTEGRATION)
  ) {
    return value.value !== 3;
  }
  return false;
};

export const getCreateUrl = (currentHeader, t) => {
  if (currentHeader === t(LANDING_PAGE_TOPICS.TASKS)) return '/tasks/createTask';
  else if (currentHeader === t(LANDING_PAGE_TOPICS.FLOW)) return CREATE_FLOW;
  else if (currentHeader === t(LANDING_PAGE_TOPICS.DATALIST)) return '/data_lists/createDatalist';
  else if (currentHeader === t(SIDE_NAV_BAR.ADMIN_ACCOUNTS)) {
    return '/super-admin/create-account';
  } else if (currentHeader === t(LANDING_PAGE_TOPICS.TEAMS)) return '/teams/create-team';
  return EMPTY_STRING;
};

export const getButtonLabel = (currentHeader, t) => {
  if (currentHeader === t(LANDING_PAGE_TOPICS.TASKS)) return t(LANDING_PAGE_TOPICS.CREATE_TASK);
  else if (currentHeader === t(LANDING_PAGE_TOPICS.FLOW)) return t(LANDING_PAGE_TOPICS.CREATE_FLOW);
  else if (currentHeader === t(LANDING_PAGE_TOPICS.DATALIST)) return t(LANDING_PAGE_TOPICS.CREATE_DATALIST);
  else if (currentHeader === t(SIDE_NAV_BAR.ADMIN_ACCOUNTS)) {
    return translate('super_admin.common_header.create_account');
  } else if (currentHeader === t(LANDING_PAGE_TOPICS.TEAMS)) return t(LANDING_PAGE_TOPICS.CREATE_TEAM);
  return EMPTY_STRING;
};

export const getCommonHeaderTabs = (currentHeader, commonHeader, tabIndex, t) => {
  if (currentHeader === t(LANDING_PAGE_TOPICS.TASKS)) return commonHeader.tabOptions;
  else if (currentHeader === t(LANDING_PAGE_TOPICS.FLOW)) {
    return getFlowNavbarOptions(tabIndex, t);
  } else if (currentHeader === t(LANDING_PAGE_TOPICS.DATALIST)) {
    return getDatalistNavbarOptions(t, tabIndex);
  } else if (currentHeader === t(SIDE_NAV_BAR.ADMIN_ACCOUNTS)) {
    return getAdminAccountsNavbarOptions(tabIndex, t);
  } else return [];
};

export const navigator = (history, url) => {
  if (history && url) routeNavigate(history, ROUTE_METHOD.REPLACE, url, null, null);
};
export const getSelectedTabForMobileView = (
  currentHeader,
  tab_index,
  flow_tab_index,
  datalist_tab_index,
  integration_tab_index,
  t,
) => {
  if (currentHeader === t(LANDING_PAGE_TOPICS.TASKS)) return tab_index;
  else if (currentHeader === t(LANDING_PAGE_TOPICS.FLOW)) {
    return flow_tab_index;
  } else if (currentHeader === t(LANDING_PAGE_TOPICS.DATALIST)) {
    return datalist_tab_index;
  } else if (currentHeader === t(SIDE_NAV_BAR.INTEGRATION)) {
    return integration_tab_index;
  } else return 0;
};

export default getTabUrl;
