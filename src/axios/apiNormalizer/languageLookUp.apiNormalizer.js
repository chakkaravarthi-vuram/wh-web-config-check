import { getFormattedLanguageListDropDown } from '../../utils/generatorUtils';
import { reportError } from '../../utils/UtilityFunctions';

const validateLanguageData = (content) => {
  const requiredProps = ['languages'];
  const missingDataList = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`User preference failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;
  return content;
};

export const normalizeLanguageLookUpData = (unTrustedContent) => {
  const content = validateLanguageData(unTrustedContent.data.result.data);
  if (!content) {
    reportError('normalize User preference failed');
    return null;
  }
  const normalizedData = getFormattedLanguageListDropDown(content.languages);
  return normalizedData;
};

export default normalizeLanguageLookUpData;
