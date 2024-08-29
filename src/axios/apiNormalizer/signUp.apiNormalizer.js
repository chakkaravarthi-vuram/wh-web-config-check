import { reportError, hasOwn } from '../../utils/UtilityFunctions';

const validateGenerateOTPSignUp = (content) => {
  const requiredProps = ['_id', 'expiry_in_sec'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`generate otp failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateResendOTPSignUp = (content) => {
  const requiredProps = ['_id', 'block_resend'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`resend otp failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateValidateEmail = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate ValidateEmail failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeGenerateOTPSignUp = (cancelForGenerateOtp, untrustedContent) => {
  const content = validateGenerateOTPSignUp(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize generate otp signup failed');
    return null;
  }
  return {
    _id: content._id,
    expiry_in_sec: content.expiry_in_sec,
    cancelForGenerateOtp,
  };
};

const validateVerifyOtp = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate VerifyOtp failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateSignUp = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validateSignUp failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateValidateAccountDomain = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate ValidateAccountDomain failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeResendOTPSignUp = (cancelForResendOtp, untrustedContent) => {
  const content = validateResendOTPSignUp(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize resend otp signup failed');
    return null;
  }
  return {
    _id: content._id,
    block_resend: content.block_resend,
    cancelForResendOtp,
  };
};

export const normalizeValidateEmail = (untrustedContent) => {
  const content = validateValidateEmail(untrustedContent.data);
  if (!content) {
    reportError('normalize ValidateEmail signup failed');
    return null;
  }
  return content;
};

export const normalizeValidateEmailAndDomain = (untrustedContent) => {
  const content = validateValidateEmail(untrustedContent.data);
  if (!content) {
    reportError('normalize ValidateEmailAndDomain signup failed');
    return null;
  }
  return content;
};

export const normalizeVerifyOtp = (untrustedContent) => {
  const content = validateVerifyOtp(untrustedContent.data);
  if (!content) {
    reportError('normalize VerifyOtp signup failed');
    return null;
  }
  return content;
};

export const normalizeSignUp = (untrustedContent) => {
  const content = validateSignUp(untrustedContent.data);
  if (!content) {
    reportError('normalize signup failed');
    return null;
  }
  return content;
};

export const normalizeValidateAccountDomain = (untrustedContent) => {
  const content = validateValidateAccountDomain(untrustedContent.data);
  if (!content) {
    reportError('normalizeValidateAccountDomain signup failed');
    return null;
  }
  return content;
};

export const normalizeAccountSettingConfig = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError('validate getAllPaymentUsers failed');
    return null;
  }
  return content;
};

export const normalizeGetTrialDetails = (untrustedContent) => {
  const content = untrustedContent.data.result.data[0];
  console.log('gbsdb', content);
  const requiredProperties = ['_id', 'trial_days', 'trial_description', 'trial_name'];
  const missingProperties = requiredProperties.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate getTrialDetails failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (!missingProperties) {
    return content;
  } else {
    return null;
  }
};

export const normalizeGetCountryTax = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content.data, prop)) {
      reportError(`validate CountryList failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content.data.result.data.pagination_data;
};

export default normalizeGenerateOTPSignUp;
