import moment from 'moment-timezone';
import { translate } from 'language/config';
import { HOLIDAY_DATE } from '../containers/admin_settings/language_and_calendar/holidays/holiday_table/HolidayTable.strings';
import { DATE } from './Constants';
import {
  DRAFT_DATA_LIST_UPDATED_DATE,
  DRAFT_FLOW_UPDATED_DATE,
  DROPDOWN_CONSTANTS,
  EFFECTIVE_DATE,
  DOWNLOAD_WINDOW_TIME,
  TEAM_CREATED_DATE,
  TEAM_CREATED_DATE_TIME,
  FLOW_DASHBOARD_DATE_TIME,
  REPORT_DATE_TIME,
  ADMIN_ACCOUNTS_DATE,
  ADMIN_ACCOUNTS_USER_ACTIVITY_DATE,
  ADMIN_ACCOUNTS_USAGE_SUMMARY_DATE,
  SOMEONE_IS_EDITING,
  EMPTY_STRING,
  FLOW_SHORTCUT,
  SHORTCUT_FILTER_DATE,
  FLOW_DASHBOARD_DATE,
  CHANGE_HISTORY,
} from './strings/CommonStrings';
import { CREDENTIAL_EXPIRY_DATE } from '../containers/integration/Integration.constants';
import { LAST_USED_DATE } from '../containers/user_settings/UserSettings.utils';

/** @module date * */
/**
 * @memberof date
 */
/**
 * @function getTimeToDisplayForAssignedOn
 * @description is same day return time else date
 * @param   {string} dateTime date string
 * @return  {string} date or time
 */
export const getTimeToDisplayForAssignedOn = (dateTime) => {
  if (moment(dateTime).isSame(moment(), 'day')) {
    return moment(dateTime).format('hh:mm a');
  }
  return moment(dateTime).format('DD MMM');
};
/**
 * @memberof date
 */
/**
 * @function getYearDropDown
 * @description to get customised year dropdown
 * @return  {Object}
 */
export const getYearDropDown = () => {
  const data = [];
  let index;
  let currentYear = Number(moment().format('YYYY'));
  for (index = 1; index <= 5; index += 1) {
    data.push({
      [DROPDOWN_CONSTANTS.OPTION_TEXT]: currentYear,
      [DROPDOWN_CONSTANTS.VALUE]: currentYear,
    });
    currentYear += 1;
  }
  return data;
};
/**
 * @memberof date
 */
/**
 * @function timeDifference
 * @description to get customised date fifference text
 * @return  {string} a few seconds ago
 */
export const timeDifference = (data = {}, onlyForDays = false, shortText = false) => {
  if (onlyForDays) {
    if (data) {
      if (data.days > 7 || data.months || data.years) {
        return false;
      }
    }
  }
  if (data.years) {
    if (data) {
      if (data.years > 1) return `${data.years}${shortText ? translate('date_time_label.yrs') : translate('date_time_label.years')} ${translate('date_time_label.ago')}`;
      return `${data.years}${shortText ? translate('date_time_label.yr') : translate('date_time_label.year')} ${translate('date_time_label.ago')}`;
    }
  } else if (data.months) {
    if (data.months > 1) return `${data.months}${shortText ? translate('date_time_label.mos') : translate('date_time_label.months')} ${translate('date_time_label.ago')}`;
    return `${data.months}${shortText ? translate('date_time_label.mo') : translate('date_time_label.month')} ${translate('date_time_label.ago')}`;
  } else if (data.days) {
    if (data.days > 1) return `${data.days}${shortText ? translate('date_time_label.d') : translate('date_time_label.days')} ${translate('date_time_label.ago')}`;
    return `${data.days}${shortText ? translate('date_time_label.d') : translate('date_time_label.day')} ${translate('date_time_label.ago')}`;
  } else if (data.hours) {
    if (data.hours < 0) return `${translate('date_time_label.a_few')} ${shortText ? translate('date_time_label.hrs') : translate('date_time_label.hours')} ${translate('date_time_label.ago')}`;
    if (data.hours > 1) return `${data.hours}${shortText ? translate('date_time_label.hrs') : translate('date_time_label.hours')} ${translate('date_time_label.ago')}`;
    return `${data.hours}${shortText ? translate('date_time_label.hr') : translate('date_time_label.hour')} ${translate('date_time_label.ago')}`;
  } else if (data.minutes) {
    if (data.minutes < 0) return `${translate('date_time_label.a_few')} ${shortText ? translate('date_time_label.m') : translate('date_time_label.minutes')} ${translate('date_time_label.ago')}`;
    if (data.minutes > 1) return `${data.minutes}${shortText ? translate('date_time_label.m') : translate('date_time_label.minutes')} ${translate('date_time_label.ago')}`;
    return `${data.minutes}${shortText ? translate('date_time_label.m') : translate('date_time_label.minute')} ${translate('date_time_label.ago')}`;
  } else if (data.seconds) {
    if (data.seconds < 0) return `${translate('date_time_label.a_few')} ${shortText ? translate('date_time_label.s') : translate('date_time_label.seconds')} ${translate('date_time_label.ago')}`;
    return `${data.seconds}${shortText ? translate('date_time_label.s') : translate('date_time_label.seconds')} ${translate('date_time_label.ago')}`;
  } else {
    return `${translate('date_time_label.a_few')} ${shortText ? translate('date_time_label.s') : translate('date_time_label.seconds')} ${translate('date_time_label.ago')}`;
  }
  return '';
};
/**
 * @memberof date
 */
/**
 * @function getFormattedDateFromUTC
 * @description return date based on given format from UTC
 * @param   {string} UTCString utc format
 * @param   {string} type module
 * @return  {string} date or time
 */
export const getFormattedDateFromUTC = (UTCString, type) => {
  const date = moment(UTCString);
  switch (type) {
    case EFFECTIVE_DATE:
      return date.format(DATE.DATE_FORMAT);
    case HOLIDAY_DATE:
      return date.format('DD MMM YYYY');
    case LAST_USED_DATE:
      return date.format(' MMM DD, YYYY, hh:mm A');
    case SHORTCUT_FILTER_DATE:
      return date.format('DD/MMM/YYYY - hh:mm A');
    case CHANGE_HISTORY:
      return date.format('DD MMM YYYY');
    case CREDENTIAL_EXPIRY_DATE:
      return date.format(' MMM DD, YYYY - hh:mm A');
    case TEAM_CREATED_DATE:
      return `${date.format('DD MMM, hh:mm A')} ( ${timeDifference(
        moment.duration(moment().diff(date))._data,
      )} )`;
    case DOWNLOAD_WINDOW_TIME:
      return timeDifference(moment.duration(moment().diff(date))._data);
    case TEAM_CREATED_DATE_TIME: {
      return date.format('DD MMM YYYY, h:mm A');
    }
    case FLOW_DASHBOARD_DATE_TIME: {
      return moment.parseZone(UTCString).format('DD MMM YYYY, h:mm A');
    }
    case FLOW_DASHBOARD_DATE: {
      return moment.parseZone(UTCString).format('MMM DD, YYYY');
    }
    case SOMEONE_IS_EDITING: {
      let currentTimeText = EMPTY_STRING;
      let isMoreThanHoursLimit = false;
      const timeObj = moment.duration(moment().diff(date))._data;
      currentTimeText = timeDifference(
        timeObj,
        true, // onlyForDays
      );
      if (timeObj && (timeObj.hours > 8 || timeObj.days || timeObj.months || timeObj.years)) {
        isMoreThanHoursLimit = true;
      }
      if (currentTimeText) return { time: currentTimeText, isMoreThanHoursLimit };
      return { time: `on ${date.format('DD MMM YYYY, h:mm A')}`, isMoreThanHoursLimit };
    }
    case REPORT_DATE_TIME: {
      return date.utc().format('DD MMM YYYY, h:mm A');
    }
    case DRAFT_FLOW_UPDATED_DATE:
    case DRAFT_DATA_LIST_UPDATED_DATE:
      return date.format('DD-MM-YYYY');
    case ADMIN_ACCOUNTS_DATE:
      return date.format('MMM DD, YYYY');
    case ADMIN_ACCOUNTS_USER_ACTIVITY_DATE:
      return date.format('MMM DD, YYYY [at] h:mm A');
    case ADMIN_ACCOUNTS_USAGE_SUMMARY_DATE:
      return date.format('MMM YYYY');
    case FLOW_SHORTCUT:
      return date.format('MMM DD YYYY');
    default:
      return UTCString;
  }
};
/**
 * @memberof date
 */
/**
 * @function getISOStringFromTimeString
 * @description get ISO string from time string
 * @param   {string} time_string time string
 * @return  {string} ISO
 */
export const getISOStringFromTimeString = (timeString) => {
  console.log(timeString);
  const time_string = moment(timeString, 'HH:mm A').format('hh:mm A');
  console.log(time_string);
  const dateString = moment(time_string, 'HH:mm A').toDate();
  console.log(dateString);
  const ISOString = dateString.toISOString();
  console.log(ISOString);
  return ISOString;
};
/**
 * @memberof date
 */
/**
 * @function parse12HrsTimeto24HoursTime
 * @description to parse 12 hours time to 24 hours time
 * @param   {string} timeString time string
 * @return  {string}
 */
export const parse12HrsTimeto24HoursTime = (timeString) =>
  // input: 1:00 PM
  // output: 13:00:00
  moment(timeString || '12:00 am', ['hh:mm A']).format('HH:mm');
/**
 * @memberof date
 */
/**
 * @function parse24HrsTimeto12HoursTime
 * @description to parse 24 hours time to 12 hours time
 * @param   {string} timeString time string
 * @return  {string}
 */
export const parse24HrsTimeto12HoursTime = (timeString) =>
  // input: 13:00
  // output: 1:00 PM
  moment(timeString || '00:00', ['HH:mm']).format('hh:mm A');
/**
 * @memberof date
 */
/**
 * @function parseDateFromUTC
 * @description to parse date from utc string
 * @param   {string} utcString utc time string
 * @return  {string}
 */
export const parseDateFromUTC = (utcString) =>
  moment.parseZone(utcString).format('YYYY-MM-DD');
/**
 * @memberof date
 */
/**
 * @function parse12HoursTimeFromUTC
 * @description to parse 12hrs time from utc string
 * @param   {string} utcString time string
 * @return  {string}
 */
export const parse12HoursTimeFromUTC = (utcString) =>
  moment.parseZone(utcString).format('hh:mm A');
/**
 * @memberof date
 */
/**
 * @function parseTimeZoneOffsetFromUTC
 * @description to parse timezone offset from utc string
 * @param   {string} utcString time string
 * @return  {string}
 */
export const parseTimeZoneOffsetFromUTC = (utcString) =>
  moment.parseZone(utcString).format('Z');
/**
 * @memberof date
 */
/**
 * @function validateDate
 * @description to find its a valid date or not
 * @param   {string} dateString date string
 * @return  {boolean}
 */
export const validateDate = (dateString) => {
  if (dateString && dateString.length === 10) return moment(moment(dateString).format('YYYY-MM-DD')).isValid();
  return false;
};
/*
 * @function validateDate
 * @description to find its a valid date or not
 * @param   {string} dateString date string with time
 * @return  {boolean}
 */
export const validateDateTime = (dateString) => moment(dateString).isValid();
/**
 * @memberof date
 */
/**
 * @function getDaysCountBetweenTwoDates
 * @description to count days between 2 dates
 * @param   {string} d1 date 1
 * @param   {string} d2 date 2
 * @return  {number}
 */
export const getDaysCountBetweenTwoDates = (d1, d2) => {
  const diffInMs = Math.abs(new Date(d2).getTime() - new Date(d1).getTime());
  if (diffInMs < 1) {
    return 0;
  }
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
};
/**
 * @memberof date
 */
/**
 * @function dateToLocaleString
 * @description to convert date to locale string
 * @param   {string} date date
 * @return  {string}
 */
export const dateToLocaleString = (date) =>
  date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

export default dateToLocaleString;

/**
 * @function getTimeStringInMin
 * @description to convert time format[HH:MM A] to minutes
 * @param   {string} time time in the format of [HH:MM A]
 * @return  {string}
 */
export const getTimeStringInMin = (time) => {
  const timeArrayWithUnit = time.split(' ');
  let timeInMin = 0;
  if (timeArrayWithUnit[1] && timeArrayWithUnit[1] === 'PM') {
    timeInMin = 12 * 60;
  }
  const timeArray = timeArrayWithUnit[0].split(':');
  if (Number(timeArray[0]) === 12) timeInMin += Number(timeArray[1]);
  else timeInMin += Number(timeArray[0]) * 60 + Number(timeArray[1]);
  return timeInMin;
};

export const isSameDay = (utcDate) => moment(utcDate).isSame(moment(), 'day');

export const checkIsAfterTime = (dateTime) =>
  moment(dateTime, 'YYYY-MM-DD HH:mm a').isAfter(moment());

/**
 * @function getTimezoneParsedDate
 * @description to parse the date with timezone
 * @param   {string} date Date string
 * @param   {string} timezone timezone
 * @param   {boolean} noISOString check for ISOstring. If ISOstring=true, to keep the timezone of the date parse it with timezone and offset
 * @return  {string} time zone parsed date string
 */
export const getTimezoneParsedDate = (date, timezone, noISOString = false) => {
  const dateStringFromServer = new Date(date);
  if (noISOString && dateStringFromServer.toISOString() === date) {
    return moment
      .parseZone(date)
      .tz(timezone)
      .format(DATE.DATE_AND_TIME_24_FORMAT);
  }
  return date;
};
/**
 * @function addDaysToDate
 * @description to add days to the given date
 * @param   {string} dateWithTimezone Date string
 * @param   {number} noOfDays timezone
 * @param   {boolean} isWorkingDaysOnly Check whether need to check working days or not
 * @param   {string} format output date format
 * @return  {string} formatted date string
 */
export const addDaysToDate = (
  dateWithTimezone,
  noOfDays,
  isWorkingDaysOnly,
  format = DATE.DATE_FORMAT,
) => {
  if (isWorkingDaysOnly) {
    return moment(dateWithTimezone)
      .businessAdd(noOfDays, 'days')
      .format(format);
  }
  return moment(dateWithTimezone).add(noOfDays, 'days').format(format);
};
/**
 * @function subtractDaysFromDate
 * @description subtract days from the given date
 * @param   {string} dateWithTimezone Date string
 * @param   {number} noOfDays timezone
 * @param   {boolean} isWorkingDaysOnly Check whether need to check working days or not
 * @param   {string} format output date format
 * @return  {string} formatted date string
 */
export const subtractDaysFromDate = (
  dateWithTimezone,
  noOfDays,
  isWorkingDaysOnly,
  format = DATE.DATE_FORMAT,
) => {
  if (isWorkingDaysOnly) {
    return moment(dateWithTimezone)
      .businessSubtract(noOfDays, 'days')
      .format(format);
  }
  return moment(dateWithTimezone).subtract(noOfDays, 'days').format(format);
};

/**
* @function isBeforeDateTimeCheck
* @description check whether a given datetime string isBefore the limit
* @param   {string} date1 Date string
* @param   {number} date2 limit date string
* @return  {boolean} is before
*/
export const isBeforeDateTimeCheck = (date1, date2, allowEqualValues = true) => {
  if (allowEqualValues) {
    if (moment(date1).isBefore(date2)) {
      if (moment(date1).diff(date2) < 0) return true;
    }
  } else {
    if (moment(date1).isSameOrBefore(date2)) {
      if (moment(date1).diff(date2) <= 0) return true;
    }
  }
  return false;
};
/**
* @function isAfterDateTimeCheck
* @description check whether a given datetime string isAfter the limit
* @param   {string} date1 Date string
* @param   {number} date2 limit date string
* @return  {boolean} is after
*/
export const isAfterDateTimeCheck = (date1, date2, allowEqualValues = true) => {
  if (allowEqualValues) {
    if (moment(date1).isAfter(date2)) {
      if (moment(date1).diff(date2) > 0) return true;
    }
  } else {
    if (moment(date1).isSameOrAfter(date2)) {
      if (moment(date1).diff(date2) >= 0) return true;
    }
  }
  return false;
};

/**
 * @memberof date
 */
/**
 * @function getDays
 * @description get Days Array List like day and shortDay and fullDay
 * @param   {number} year year
 * @param   {number} month month
 * @return  {array} Days
 */
export const getDays = (
  year = moment().format('YYYY'),
  month = moment().format('M'),
) => {
  const arrDays = [];
  if (!year && !month) {
    return arrDays;
  }
  const monthDate = moment(`${year}-${month}`, 'YYYY-M');
  const daysInMonth = monthDate.daysInMonth();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = moment(`${year}-${month}-${day}`, 'YYYY-M-D');
    const shortDay = date.format('ddd');
    const fullDay = date.format('dddd');
    const objDay = {
      day,
      shortDay,
      fullDay,
    };
    arrDays.push(objDay);
  }
  return arrDays;
};

/**
 * @function formatServerDateString
 * @description format date and removes timestamp
 * @param   {date} date
 */
export const formatServerDateString = (date) => {
  if (date) {
    const isDateValid = moment(date, [DATE.DATE_FORMAT, moment.ISO_8601], true).isValid();
    if (isDateValid) {
      const utcOffset = moment.parseZone(date).utcOffset(); // If utc offset presents, date is from database and it has been converted to users timezone
      if (utcOffset || (date?.charAt(date.length - 1) === DATE.UTC_OFFSET)) {
        return moment(date).utcOffset(date).format(DATE.UTC_DATE_WITH_TIME_STAMP);
      }
    }
  }
  return date;
};

/**
 * @function formatServerDateTimeString
 * @description format date and removes timestamp
 * @param   {date} dateTime
 */
export const formatReportServerDateTimeString = (dateTime) => {
  if (dateTime) {
    return moment(dateTime).utcOffset(dateTime).format(DATE.DATE_AND_TIME_24_FORMAT);
  }
  return dateTime;
};

/**
* @function getDaysDifference
* @description check whether a given datetime string isAfter the limit
* @param   {string} date1 Date string
* @param   {string} date2 limit date string
* @return  {number} days difference
*/
export const getDaysDifference = (startDate, endDate, unit = 'days') => {
  const date1 = moment(startDate, moment.ISO_8601);
  const date2 = moment(endDate, moment.ISO_8601);
  return date1.diff(date2, unit);
};
