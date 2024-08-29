import jsUtils from '../../utils/jsUtility';
import { reportError } from '../../utils/UtilityFunctions';

const normalizeLanguage = (content) => {
  if (jsUtils.isEmpty(content)) {
    reportError('getLanguage failed !');
    return null;
  }
  return content;
};
export default normalizeLanguage;
