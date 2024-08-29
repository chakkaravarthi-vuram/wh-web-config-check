import { toIsAfterFromDate } from 'utils/UtilityFunctions';
import { getDaysCountBetweenTwoDates } from 'utils/dateUtils';
import jsUtils from 'utils/jsUtility';
import { DATALIST_PICKER_CHANGE_HANDLER_TYPES } from 'utils/constants/form.constant';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import FILTER_STRINGS from '../Filter.strings';

export const dateRangeValidation = (date1, date2, t = () => {}, index = 1) => {
  const { ERROR_MESSAGES } = FILTER_STRINGS(t);
  let fieldUpdateBetweenOneError = EMPTY_STRING;
  let fieldUpdateBetweenTwoError = EMPTY_STRING;
  if (jsUtils.isEmpty(date1) && !jsUtils.isEmpty(date2)) {
    fieldUpdateBetweenOneError = ERROR_MESSAGES.START_DATE;
  }
  if (jsUtils.isEmpty(date2) && !jsUtils.isEmpty(date1)) {
    fieldUpdateBetweenTwoError = ERROR_MESSAGES.END_DATE;
  }

  if (!jsUtils.isEmpty(date1) && !jsUtils.isEmpty(date2)) {
    const daysDifference = getDaysCountBetweenTwoDates(date1, date2);
    if (toIsAfterFromDate(date1, date2)) {
      if (daysDifference === 0) {
        fieldUpdateBetweenOneError = ERROR_MESSAGES.DIFFERENT_DATE;
        fieldUpdateBetweenTwoError = ERROR_MESSAGES.DIFFERENT_DATE;
      }
    } else if (index === 0) {
      fieldUpdateBetweenOneError = ERROR_MESSAGES.START_DATE_LESS;
    } else {
      fieldUpdateBetweenTwoError = ERROR_MESSAGES.END_DATE_GREATER;
    }
  }

  return {
    fieldUpdateBetweenOneError,
    fieldUpdateBetweenTwoError,
  };
};

export const datalistPickerChangeHandler = (
  data,
  value,
  type = DATALIST_PICKER_CHANGE_HANDLER_TYPES.DATALIST_PICKER_CH_ADD,
) => {
  let arrData = [];
  if (data && jsUtils.isArray(data)) {
    arrData.push(...data);
  }

  switch (type) {
    case DATALIST_PICKER_CHANGE_HANDLER_TYPES.DATALIST_PICKER_CH_ADD:
      arrData.push(value);
      break;
    case DATALIST_PICKER_CHANGE_HANDLER_TYPES.DATALIST_PICKER_CH_REMOVE:
      arrData = arrData.filter((fData) => fData.value !== value);
      break;
    default:
      break;
  }
  return arrData;
};

export const numberRangeValidation = (num1, num2, t = () => {}, index = 1) => {
  const { ERROR_MESSAGES } = FILTER_STRINGS(t);
  let fieldUpdateBetweenOneError = EMPTY_STRING;
  let fieldUpdateBetweenTwoError = EMPTY_STRING;
  if (jsUtils.isEmpty(num1.toString()) && !jsUtils.isEmpty(num2.toString())) {
    fieldUpdateBetweenOneError = ERROR_MESSAGES.START_NUMBER;
  } else if (jsUtils.isEmpty(num2.toString()) && !jsUtils.isEmpty(num1.toString())) {
    fieldUpdateBetweenTwoError = ERROR_MESSAGES.END_NUMBER;
  } else if (!jsUtils.isEmpty(num1.toString()) && !jsUtils.isEmpty(num2.toString())) {
    if (num1 >= num2) {
      if (index === 0) {
        fieldUpdateBetweenOneError = ERROR_MESSAGES.START_NUMBER_LESS;
      } else {
        fieldUpdateBetweenTwoError = ERROR_MESSAGES.END_NUMBER_GREATER;
      }
    }
  }

  return {
    fieldUpdateBetweenOneError,
    fieldUpdateBetweenTwoError,
  };
};
