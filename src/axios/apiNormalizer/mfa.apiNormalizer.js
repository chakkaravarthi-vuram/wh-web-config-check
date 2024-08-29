import { reportError } from '../../utils/UtilityFunctions';

export const validateGetFieldDependency = (content) => {
const requiredProps = ['is_mfa_verified'];
const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
    reportError(`validate get user mfa details failed: ${prop} missing`);
    return true;
    }
    return false;
});
if (invalidData) return null;
return content;
};

const validateMfa = (content, headers) => {
  const requiredProps = ['is_otp_valid'];
  if (content.is_otp_valid) {
    requiredProps.push('sessionExpiryTime', 'currentTime');
  }
  const requiredHeaderProps = ['csrf-token'];
  // eslint-disable-next-line no-restricted-syntax
  for (const prop of requiredProps) {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validateMfa failed: ${prop} missing`);
      return null;
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const prop of requiredHeaderProps) {
    if (!Object.prototype.hasOwnProperty.call(headers, prop)) {
      reportError(`validateMfa failed: ${prop} missing`);
    }
  }
  return content;
};

export const normalizeGetUserMfaDetails = (untrustedContent) => {
const content = validateGetFieldDependency(untrustedContent.data.result.data);
if (!content) {
    reportError('normalize get user mfa details failed');
    return null;
}
return content;
};

export const normalizeEnableDisableUserMfa = (untrustedContent) => {
    const content = untrustedContent.data.result.data;
    if (!content) {
      reportError('normalize enable or disble user mfa failed');
      return null;
    }
    return content;
  };

export const normalizeVerifyMfaWithHeader = (untrustedContent) => {
  const content = validateMfa(untrustedContent.data.result.data, untrustedContent.headers);
  if (!content) {
    reportError('normalize verify mfa failed');
    return null;
  }
  return content;
};

export const normalizeVerifyMfa = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize verify mfa failed');
    return null;
  }
  return content;
};

export const normalizeValidateMfa = (untrustedContent) => {
  const content = validateMfa(untrustedContent.data.result.data, untrustedContent.headers);
  if (!content) {
    reportError('normalize verify mfa failed');
    return null;
  }
  return content;
};

export const normalizeDisableMfa = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize disable mfa failed');
    return null;
  }
  return content;
};

export const normalizeLoginMfaOtpDetails = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize mfa login otp failed');
    return null;
  }
  return content;
};
