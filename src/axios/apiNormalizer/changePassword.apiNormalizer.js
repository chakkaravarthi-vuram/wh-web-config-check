import { reportError } from '../../utils/UtilityFunctions';

const validateChangePassword = (content) => {
  const requiredProps = ['success'];
  // eslint-disable-next-line no-restricted-syntax
  for (const prop of requiredProps) {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validateChangePassword failed: ${prop} missing`);
      return null;
    }
  }
  return content;
};

export const normalizeChangePassword = (untrustedContent) => {
  const content = validateChangePassword(untrustedContent.data);

  if (!content) {
    reportError('normalizeChangePassword failed');
    return null;
  }
  return content;
};
export default normalizeChangePassword;
