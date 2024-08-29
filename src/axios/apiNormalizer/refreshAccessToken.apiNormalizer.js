import { reportError } from '../../utils/UtilityFunctions';

const validateRefreshAccessToken = (content, headers) => {
  const requiredHeaderProps = ['csrf-token'];
  // eslint-disable-next-line no-restricted-syntax
  for (const prop of requiredHeaderProps) {
    if (!Object.prototype.hasOwnProperty.call(headers, prop)) {
      reportError(`validateRefreshAccessToken failed: ${prop} missing`);
      return null;
    }
  }
  return content;
};

export const normalizeRefreshAccessToken = (untrustedContent) => {
  const content = validateRefreshAccessToken(untrustedContent.data.result.data, untrustedContent.headers);
  if (!content) {
    reportError('normalizeRefreshAccessToken failed');
    return null;
  }
  return content;
};

export default normalizeRefreshAccessToken;
