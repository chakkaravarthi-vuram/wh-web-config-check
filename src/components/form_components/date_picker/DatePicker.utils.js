import moment from 'moment';
import { DATE } from '../../../utils/Constants';
import jsUtils, { safeTrim } from '../../../utils/jsUtility';

export const isTimeValid = (time) => {
    if (moment(time, [DATE.TIME_FORMAT], true).isValid()) return true;
    if (moment(time, ['HH:mm:ss']).isValid()) return true;
    return false;
};
export const isValidDateTimeString = (dateString) => {
    if (
        moment(dateString, DATE.DATE_FORMAT).isValid() ||
        moment(dateString, DATE.DATE_AND_TIME_FORMAT).isValid() ||
        moment(dateString, moment.ISO_8601).isValid()
    ) {
        const year = moment(dateString).format('YYYY');
        return year.length === 4;
    }
    return false;
};

export const isDateValid = (date) => moment(date, [DATE.DATE_FORMAT], true).isValid();

export const isDateAndTimeValid = (datetime) => moment(datetime, [DATE.DATE_AND_TIME_FORMAT], true).isValid();

export const isInputDateMonthYearEmpty = (date, month, year) => jsUtils.isEmpty(safeTrim(date)) && jsUtils.isEmpty(safeTrim(month)) && jsUtils.isEmpty(safeTrim(year));
