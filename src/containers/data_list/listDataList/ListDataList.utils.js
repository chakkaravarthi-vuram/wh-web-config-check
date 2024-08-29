import { isSameDay, parse12HoursTimeFromUTC } from 'utils/dateUtils';
import { isEmpty } from 'utils/jsUtility';
import {
  DATALIST_OVERVIEW,
  MY_PUBLISHED_DATALIST,
  MY_DRAFT_DATALIST,
} from 'urls/RouteConstants';
import { NO_DATA_FOUND_STRINGS } from '../../landing_page/no_data_found/NoDataFound.strings';
import { DATA_LIST_DROPDOWN } from './listDataList.strings';
import { LIST_DATA_LIST } from '../../../urls/RouteConstants';

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

export const getTabFromUrl = (url) => {
  const splitUrl = url.split('/');
  const tabIndex = splitUrl.findIndex((url) => url === LIST_DATA_LIST.replaceAll('/', ''));
  const tab = splitUrl[tabIndex + 1];
  if (tab) {
    if (tab === DATALIST_OVERVIEW) return DATA_LIST_DROPDOWN.ALL_DATA_LIST;
    if (tab === MY_PUBLISHED_DATALIST) { return DATA_LIST_DROPDOWN.DATA_LIST_I_OWN; }
    if (tab === MY_DRAFT_DATALIST) return DATA_LIST_DROPDOWN.DRAFT_DATA_LIST;
  }
  return null;
};

export const getNoDataFoundStrings = (tab_index, searchText, t) => {
  if (!isEmpty(searchText)) {
    switch (tab_index) {
      case DATA_LIST_DROPDOWN.ALL_DATA_LIST:
        return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_LIST_TEXT.ALL_DATA_LIST);
      case DATA_LIST_DROPDOWN.DATA_LIST_I_OWN:
        return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_LIST_TEXT.DATA_LIST_I_OWN);
      case DATA_LIST_DROPDOWN.DRAFT_DATA_LIST:
        return t(NO_DATA_FOUND_STRINGS.NO_SEARCH_DATA_LIST_TEXT.DRAFT_DATA_LIST);
      default:
        return null;
    }
  } else {
    switch (tab_index) {
      case DATA_LIST_DROPDOWN.ALL_DATA_LIST:
        return t(NO_DATA_FOUND_STRINGS.NO_DATA_LIST_TEXT.ALL_DATA_LIST);
      case DATA_LIST_DROPDOWN.DATA_LIST_I_OWN:
        return t(NO_DATA_FOUND_STRINGS.NO_DATA_LIST_TEXT.DATA_LIST_I_OWN);
      case DATA_LIST_DROPDOWN.DRAFT_DATA_LIST:
        return t(NO_DATA_FOUND_STRINGS.NO_DATA_LIST_TEXT.DRAFT_DATA_LIST);
      default:
        return null;
    }
  }
};
