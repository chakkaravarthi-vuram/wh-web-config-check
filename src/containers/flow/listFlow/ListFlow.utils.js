import { isSameDay, parse12HoursTimeFromUTC } from 'utils/dateUtils';
import jsUtils, { isEmpty } from 'utils/jsUtility';
import {
  ALL_PUBLISHED_FLOWS,
  FLOWS_MANAGED_BY_YOU,
  FLOWS_MANAGED_BY_OTHERS,
  FLOW_TEST_BED_MANAGED_BY_YOU,
  FLOW_TEST_BED_MANAGED_BY_OTHERS,
  FLOW_DRAFT_MANAGED_BY_YOU,
  FLOW_DRAFT_MANAGED_BY_OTHERS,
} from 'urls/RouteConstants';
import { NO_DATA_FOUND_STRINGS } from 'containers/landing_page/no_data_found/NoDataFound.strings';
import {
  FLOW_DROPDOWN,
  FLOW_MANAGED_BY_TYPE,
} from './listFlow.strings';
import { ROLES } from '../../../utils/Constants';
import { LIST_FLOW } from '../../../urls/RouteConstants';

const PUBLISHED_FLOWS_ROUTE = [
  ALL_PUBLISHED_FLOWS,
  FLOWS_MANAGED_BY_YOU,
  FLOWS_MANAGED_BY_OTHERS,
];
const UNDER_TESTING_ROUTE = [
  FLOW_TEST_BED_MANAGED_BY_YOU,
  FLOW_TEST_BED_MANAGED_BY_OTHERS,
];
const DRAFT_FLOWS_ROUTE = [
  FLOW_DRAFT_MANAGED_BY_YOU,
  FLOW_DRAFT_MANAGED_BY_OTHERS,
];

export const getAssignedOnDetails = (assigned_on) => {
  if (!assigned_on) return null;
  const dateTimeFormat = assigned_on.pref_datetime_display;

  if (dateTimeFormat) {
    const dateYear = dateTimeFormat.split(',')[0];
    const dateYearArray = dateYear.split(' ');

    if (isSameDay(assigned_on.utc_tz_datetime)) {
      return parse12HoursTimeFromUTC(dateTimeFormat);
    }
    return `${dateYearArray[1]} ${dateYearArray[0]}, ${dateYearArray[2]}`;
  }
  return null;
};

const getBaseUrl = (url) => {
  if (url) {
    const splitUrl = url.split('/');
    const tabIndex = splitUrl.findIndex((url) => url === LIST_FLOW.replaceAll('/', ''));
    if (tabIndex > -1) {
      return splitUrl[tabIndex + 1];
    }
  }
  return null;
};

export const getTabFromUrl = (url) => {
  const tab = getBaseUrl(url);
  if (tab) {
    if (PUBLISHED_FLOWS_ROUTE.includes(tab)) {
      return FLOW_DROPDOWN.PUBLISHED_FLOW;
    }
    if (UNDER_TESTING_ROUTE.includes(tab)) {
      return FLOW_DROPDOWN.UNDER_TESTING;
    }
    if (DRAFT_FLOWS_ROUTE.includes(tab)) {
      return FLOW_DROPDOWN.DRAFT_FLOW;
    }
  }
  return null;
};

export const getUrlFromTab = (tab) => {
  if (tab === FLOW_DROPDOWN.PUBLISHED_FLOW) {
    return ALL_PUBLISHED_FLOWS;
  }
  if (tab === FLOW_DROPDOWN.UNDER_TESTING) {
    return FLOW_TEST_BED_MANAGED_BY_YOU;
  }
  if (tab === FLOW_DROPDOWN.DRAFT_FLOW) {
    return FLOW_DRAFT_MANAGED_BY_YOU;
  } else return ALL_PUBLISHED_FLOWS;
};

export const getSubTabFromUrl = (t, tab, role = null, isMobile = false) => {
  if (!role || role === ROLES.MEMBER) return null;

  const tabList = isMobile
    ? FLOW_MANAGED_BY_TYPE.OPTIONS(t)
    : FLOW_MANAGED_BY_TYPE.TAB_OPTIONS(t);

  if (tab) {
    if (PUBLISHED_FLOWS_ROUTE.includes(tab)) {
      if (role === ROLES.FLOW_CREATOR) return tabList.slice(0, -1);
      else if (role === ROLES.ADMIN) return tabList;
    }
    if (
      UNDER_TESTING_ROUTE.includes(tab) ||
      DRAFT_FLOWS_ROUTE.includes(tab)
    ) {
      if (role === ROLES.FLOW_CREATOR) return tabList.slice(1, -1);
      else if (role === ROLES.ADMIN) return tabList.slice(1);
    }
  }
  return null;
};

export const getSelectedValueFromUrl = (options, tab, isMobile = false) => {
  const param = isMobile ? 'value' : 'INDEX';
  if (tab) {
    if (
      [
        ALL_PUBLISHED_FLOWS,
        FLOW_TEST_BED_MANAGED_BY_YOU,
        FLOW_DRAFT_MANAGED_BY_YOU,
      ].includes(tab)
    ) {
      return jsUtils.get(options, ['0', param]);
    }
    if (
      [
        FLOWS_MANAGED_BY_YOU,
        FLOW_TEST_BED_MANAGED_BY_OTHERS,
        FLOW_DRAFT_MANAGED_BY_OTHERS,
      ].includes(tab)
    ) {
      return jsUtils.get(options, ['1', param]);
    }
    if ([FLOWS_MANAGED_BY_OTHERS].includes(tab)) {
      return jsUtils.get(options, ['2', param]);
    }
  }
  return 1;
};

export const getNavigationLinkFromDropdownValue = (tab, value) => {
  if (jsUtils.isNull(tab)) return null;
  if (PUBLISHED_FLOWS_ROUTE.includes(tab)) {
    if (value === FLOW_MANAGED_BY_TYPE.VALUE_ALL) {
      return ALL_PUBLISHED_FLOWS;
    } else if (value === FLOW_MANAGED_BY_TYPE.VALUE_MANAGED_BY_YOU) {
      return FLOWS_MANAGED_BY_YOU;
    } else if (value === FLOW_MANAGED_BY_TYPE.VALUE_MANAGED_BY_OTHERS) {
      return FLOWS_MANAGED_BY_OTHERS;
    }
  }
  if (UNDER_TESTING_ROUTE.includes(tab)) {
    if (value === FLOW_MANAGED_BY_TYPE.VALUE_MANAGED_BY_YOU) {
      return FLOW_TEST_BED_MANAGED_BY_YOU;
    } else if (value === FLOW_MANAGED_BY_TYPE.VALUE_MANAGED_BY_OTHERS) {
      return FLOW_TEST_BED_MANAGED_BY_OTHERS;
    }
  }
  if (DRAFT_FLOWS_ROUTE.includes(tab)) {
    if (value === FLOW_MANAGED_BY_TYPE.VALUE_MANAGED_BY_YOU) {
      return FLOW_DRAFT_MANAGED_BY_YOU;
    } else if (value === FLOW_MANAGED_BY_TYPE.VALUE_MANAGED_BY_OTHERS) {
      return FLOW_DRAFT_MANAGED_BY_OTHERS;
    }
  }
  return null;
};

export const getNoDataFoundStrings = (t, tab_index, searchText) => {
  if (!isEmpty(searchText)) {
    switch (tab_index) {
      case FLOW_DROPDOWN.PUBLISHED_FLOW:
        return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_FLOW_TEXT.PUBLISHED_FLOW);
      case FLOW_DROPDOWN.UNDER_TESTING:
        return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_FLOW_TEXT.UNDER_TESTING);
      case FLOW_DROPDOWN.DRAFT_FLOW:
        return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_FLOW_TEXT.DRAFT_FLOW);
      default:
        return null;
    }
  } else {
    switch (tab_index) {
      case FLOW_DROPDOWN.PUBLISHED_FLOW:
        return t(NO_DATA_FOUND_STRINGS.NO_DATA_FLOW_TEXT.PUBLISHED_FLOW);
      case FLOW_DROPDOWN.UNDER_TESTING:
        return t(NO_DATA_FOUND_STRINGS.NO_DATA_FLOW_TEXT.UNDER_TESTING);
      case FLOW_DROPDOWN.DRAFT_FLOW:
        return t(NO_DATA_FOUND_STRINGS.NO_DATA_FLOW_TEXT.DRAFT_FLOW);
      default:
        return null;
    }
  }
};
