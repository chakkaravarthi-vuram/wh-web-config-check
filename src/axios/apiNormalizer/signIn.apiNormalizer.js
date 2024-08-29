import { reportError } from '../../utils/UtilityFunctions';

const validatePreSignIn = (content) => {
  const requiredProps = ['account_domain', '_id'];
  return content.every((element) => requiredProps.every((prop) => {
    if (!Object.prototype.hasOwnProperty.call(element, prop)) {
      reportError(`validatePreSingIn failed: ${prop} missing`);
      return false;
    }
    return true;
  }));
};

const validateSignIn = (content, headers) => {
  const requiredProps = ['is_temp_password', 'is_mfa_verified'];
  const requiredHeaderProps = ['csrf-token'];
  // eslint-disable-next-line no-restricted-syntax
  for (const prop of requiredProps) {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validateSignIn failed: ${prop} missing`);
      return null;
    }
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const prop of requiredHeaderProps) {
    if (!Object.prototype.hasOwnProperty.call(headers, prop)) {
      reportError(`validateSignIn failed: ${prop} missing`);
    }
  }
  return content;
};

export const normalizePreSignIn = (untrustedContent) => {
  const content = validatePreSignIn(untrustedContent.data.result.data.accounts);

  if (!content) {
    reportError('normalizePreSignIn failed');
    return null;
  }
  return untrustedContent.data.result.data.accounts;
};

export const normalizeSignIn = (untrustedContent) => {
  const content = validateSignIn(untrustedContent.data.result.data, untrustedContent.headers);
  if (!content) {
    reportError('normalizeSignIn failed');
    return null;
  }

  return content;
};

export const validateOAuthSigninApiResponse = (content) => {
  const requiredProps = ['account_domain', '_id'];
  return content.every((element) => requiredProps.every((prop) => {
    if (!Object.prototype.hasOwnProperty.call(element, prop)) {
      reportError(`validateOAuthSigninApi failed: ${prop} missing`);
      return false;
    }
    return true;
  }));
};
export const normalizeOAuthSigninApiResponse = (untrustedContent) => {
  const content = validateOAuthSigninApiResponse(untrustedContent.data.result.data.accounts);
  if (!content) {
    reportError('normalizeOAuthSigninApiResponse failed');
    return null;
  }
  return untrustedContent.data.result.data.accounts;
};

export const validateExternalAuthSignInApiResponse = (data, headers) => {
  const requiredProps = ['is_temp_password'];
  const requiredHeaderProps = ['csrf-token'];
  let status = requiredProps.every((prop) => {
    if (!Object.prototype.hasOwnProperty.call(data, prop)) {
      reportError(`validatePreSingIn failed: ${prop} missing`);
      return false;
    }
    return true;
  });
  status = requiredHeaderProps.every((prop) => {
    if (!Object.prototype.hasOwnProperty.call(headers, prop)) {
      reportError(`validatePreSingIn failed: ${prop} missing`);
      return false;
    }
    return true;
  });
  return status;
};

export const normalizeExternalAuthSignInApiResponse = (response) => {
  const { data } = response.data.result;
  if (validateExternalAuthSignInApiResponse(response.data.result.data, response.headers)) {
    return data;
  }
  reportError('normalizeSignIn failed');
  return null;
};

export const validateInviteUserApiResponse = (content) => {
  const requiredProps = ['account_domain', '_id'];
  return content.every((element) => requiredProps.every((prop) => {
    if (!Object.prototype.hasOwnProperty.call(element, prop)) {
      reportError(`validatePreSingIn failed: ${prop} missing`);
      return false;
    }
    return true;
  }));
};

export const normalizeValidateInviteUserResponse = (response) => {
  const content = validatePreSignIn(response.data.result.data.accounts);

  if (!content) {
    reportError('normalizePreSignIn failed');
    return null;
  }
  return response.data.result.data.accounts;
};

export const normalizeForgotPassword = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize forgot password failed');
    return null;
  }

  return content;
};

export const normalizeMicrosoftAuthenticate = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('normalize microsoft authenticate failed');
    return null;
  }

  return content;
};

export default normalizePreSignIn;
