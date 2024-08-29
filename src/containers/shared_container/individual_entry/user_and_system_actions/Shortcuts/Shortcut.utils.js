import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import jsUtils, { translateFunction } from 'utils/jsUtility';
import { getDaysCountBetweenTwoDates } from 'utils/dateUtils';
import { toIsAfterFromDate } from 'utils/UtilityFunctions';
import { DATE_FILTER_STRINGS, SHORTCUT_STRINGS } from './ShortCut.strings';

export const dateFilterValidation = (date1, date2, selectedOperator, t = translateFunction) => {
    const { DATE } = SHORTCUT_STRINGS(t);
    let startDateError = EMPTY_STRING;
    let endDateError = EMPTY_STRING;
    let error = EMPTY_STRING;

    if (jsUtils.isEmpty(date1) && selectedOperator !== DATE.BEFORE.TYPE) {
        if (selectedOperator === DATE.BETWEEN.TYPE) {
            startDateError = DATE_FILTER_STRINGS(t).START_DATE_IS_REQUIRED;
        } else {
            startDateError = DATE_FILTER_STRINGS(t).DATE_REQUIRED;
        }
    }
    if (jsUtils.isEmpty(date2)) {
        if (selectedOperator === DATE.BETWEEN.TYPE) {
            endDateError = DATE_FILTER_STRINGS(t).END_DATE_REQUIRED;
        } else {
            endDateError = DATE_FILTER_STRINGS(t).DATE_REQUIRED;
        }
    }

    if (!jsUtils.isEmpty(date1) && !jsUtils.isEmpty(date2)) {
      const daysDifference = getDaysCountBetweenTwoDates(date1, date2);
      if (daysDifference === 0) {
        error = DATE_FILTER_STRINGS(t).DATE_DIFFERENCE_ERROR;
        startDateError = error;
        endDateError = error;
      }
      if (!toIsAfterFromDate(date1, date2)) {
        if (selectedOperator === DATE.CURRENT_YEAR_TO_DATE.TYPE) {
            endDateError =
            DATE_FILTER_STRINGS(t).CURRENT_YEAR;
        } else {
            startDateError = DATE_FILTER_STRINGS(t).LESS_THAN_ERROR;
            if (selectedOperator === DATE.BETWEEN.TYPE) {
                endDateError = DATE_FILTER_STRINGS(t).GREATER_THAN_START_DATE;
            }
        }
      }
    }

    return {
        startDateError,
        endDateError,
    };
};

export const getDateFilterLabel = (startDate, endDate, selectedOperator, t = translateFunction) => {
    let dateFilterLabel = null;
    const { DATE } = SHORTCUT_STRINGS(t);
    switch (selectedOperator) {
        case DATE.BEFORE.TYPE:
            dateFilterLabel = `${DATE_FILTER_STRINGS(t).CREATED_BEFORE} ${endDate}`;
            break;
        default:
            dateFilterLabel = `${DATE_FILTER_STRINGS(t).CREATED_BETWEEN} ${startDate} - ${endDate}`;
            break;
    }
    return dateFilterLabel;
};
