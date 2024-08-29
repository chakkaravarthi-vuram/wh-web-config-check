import { getFormattedLocaleListDropDown } from '../../utils/generatorUtils';
import { reportError } from '../../utils/UtilityFunctions';

const localeLookUp = 'Locale Look Up';

const validateLocaleLookUpData = (content) => {
  let requiredProps = ['locales'];
  let missingDataList = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`${localeLookUp} failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;
  requiredProps = ['_id', 'locale', 'language'];
  missingDataList = content.locales.some((localeObj) => {
    const list = requiredProps.filter((reqProp) => {
      if (!Object.prototype.hasOwnProperty.call(localeObj, reqProp)) {
        reportError(`${localeLookUp} failed: ${reqProp} missing`);
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

export const normalizeLocaleLookUpData = (unTrustedContent) => {
  const content = validateLocaleLookUpData(unTrustedContent.data.result.data);
  if (!content) {
    reportError(`normalize ${localeLookUp} failed`);
    return null;
  }
  const normalizedData = getFormattedLocaleListDropDown(content.locales);
  return normalizedData;
};

export default normalizeLocaleLookUpData;
