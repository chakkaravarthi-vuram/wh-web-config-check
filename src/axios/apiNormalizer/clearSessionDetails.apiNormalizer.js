import { reportError } from '../../utils/UtilityFunctions';

const validateClearSessionDetails = (content) => {
  const requiredProps = ['success'];
  // eslint-disable-next-line no-restricted-syntax
  for (const prop of requiredProps) {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validateClearSessionDetails failed: ${prop} missing`);
      return null;
    }
  }
  return content;
};

export const normalizeClearSessionDetails = (untrustedContent) => {
  const content = validateClearSessionDetails(untrustedContent.data);

  if (!content) {
    reportError('normalizeClearSessionDetails failed');
    return null;
  }

  return content;
};
export default normalizeClearSessionDetails;
