import { reportError } from '../../utils/UtilityFunctions';

const validateResetPassword = (content) => {
  const requiredHeaderProps = ['csrf-token'];
  const invalidData = requiredHeaderProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(prop)) {
      reportError(`validateResetPassword failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

const validateResetMfa = (content) => {
  const requiredHeaderProps = ['csrf-token'];
  const invalidData = requiredHeaderProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(prop)) {
      reportError(`validateResetMFA failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};
const validateFCMToken = (content) =>
   content;

const validateGetAuthorizationDetails = (content) => {
  const requiredProps = [
    '_id',
    'username',
    'email',
    // 'first_name',
    // 'last_name',
    // 'allowed_extensions',
    // 'maximum_file_size',
    // 'account_domain',
    // 'language_file_url',
  ];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validateGetAuthorizationDetails failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const normalizeResetPassword = (untrustedContent) => {
  const content = validateResetPassword(untrustedContent.data.result.data, untrustedContent.headers);
  if (!content) {
    reportError('normalizeResetPassword failed');
    return null;
  }
  return content;
};

export const normalizeUpdatedResetPassword = (untrustedContent) => {
  const content = validateResetPassword(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalizeResetPassword failed');
    return null;
  }
  return content;
};

export const normalizeResetMFA = (untrustedContent) => {
  const content = validateResetMfa(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalizeResetMFAfailed');
    return null;
  }
  return content;
};

export const normalizeValidateForgetPassword = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalizeResetPassword failed');
    return null;
  }
  return content;
};

export const normalizeGetAuthorizationDetails = (untrustedContent) => {
  const content = validateGetAuthorizationDetails(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalizeGetAuthorizationDetails failed');
    return null;
  }
  return content;
};

export const normalizeFCMToken = (untrustedContent) => {
  const content = validateFCMToken(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalizeGetAuthorizationDetails failed');
    return null;
  }
  return content;
};

export default normalizeResetPassword;
