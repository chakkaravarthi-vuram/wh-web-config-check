import { getFormattedTimezoneListDropDown } from '../../utils/generatorUtils';
import { reportError } from '../../utils/UtilityFunctions';

const timeZoneLookUp = 'Time Zone Look Up';

const validateTimeZoneLookUpData = (content) => {
  let requiredProps = ['timezones'];
  let missingDataList = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`${timeZoneLookUp} failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;
  requiredProps = ['_id', 'timezone', 'country'];
  missingDataList = content.timezones.some((timeZoneObj) => {
    const list = requiredProps.filter((reqProp) => {
      if (!Object.prototype.hasOwnProperty.call(timeZoneObj, reqProp)) {
        reportError(`${timeZoneLookUp} failed: ${reqProp} missing`);
        return reqProp;
      }
      return false;
    });
    if (list.length > 0) return true;
    return false;
  });
  if (missingDataList > 0) return null;
  return content;
};

export const normalizeTimeZoneLookUpData = (unTrustedContent) => {
  const content = validateTimeZoneLookUpData(unTrustedContent.data.result.data);
  if (!content) {
    reportError(`normalize ${timeZoneLookUp} failed`);
    return null;
  }
  const normalizedData = getFormattedTimezoneListDropDown(content.timezones);
  return normalizedData;
};

export default normalizeTimeZoneLookUpData;
