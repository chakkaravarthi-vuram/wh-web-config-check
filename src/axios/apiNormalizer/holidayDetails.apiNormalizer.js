import { cloneDeep } from 'lodash';
import { reportError } from '../../utils/UtilityFunctions';
import { store } from '../../Store';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const holidayData = 'Holiday Data';

const addNewOccasionToState = (response) => {
  const { holiday_list } = cloneDeep(store.getState().HolidayDetailsReducer);

  holiday_list.push(response);
  const data = {
    add_new_occasion: false,
    occasion: EMPTY_STRING,
    date: null,
    holiday_list,
  };
  return data;
};

const validateHolidayData = (content) => {
  const requiredProps = ['date', 'occasion', '_id'];
  const missingDataList = content.some((data) => {
    const list = requiredProps.filter((reqProp) => {
      if (!Object.prototype.hasOwnProperty.call(data, reqProp)) {
        reportError(`validate ${holidayData} data failed: ${reqProp} missing`);
        return true;
      }
      return false;
    });
    if (list.length > 0) return true;
    return false;
  });

  if (missingDataList) return null;
  return content;
};

export const normalizeHolidayData = (unTrustedContent) => {
  const normalizedData = validateHolidayData(unTrustedContent.data.result.data);
  if (!normalizedData) {
    reportError(`normalize ${holidayData} failed`);
    return null;
  }

  return normalizedData;
};

export const validateHoldayUpdate = (content) => {
  const requiredProps = ['date', 'occasion'];
  const missingDataList = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${holidayData} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;
  return content;
};

export const normalizeHolidayUpdateData = (unTrustedContent) => {
  let normalizedData = validateHoldayUpdate(unTrustedContent.data.result.data);
  if (!normalizedData) {
    reportError(`normalize ${holidayData} failed`);
    return null;
  }
  normalizedData = addNewOccasionToState(normalizedData);
  return normalizedData;
};
export const normalizeHolidayDeleteData = (unTrustedContent) => {
  const normalizedData = unTrustedContent.data.result.data;
  return normalizedData;
};

export default normalizeHolidayData;
