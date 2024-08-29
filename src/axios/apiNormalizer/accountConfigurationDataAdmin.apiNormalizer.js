import { get } from 'lodash';
import { reportError } from '../../utils/UtilityFunctions';

const accountConfigurationData = 'Account Configuration Data';
const authAccountConfigurationData = 'Auth Account Configuration Data';

const getAccountConfigurationData = (data) => {
  return {
    maximum_file_size: data.maximum_file_size ? data.maximum_file_size : 0,
    allowed_extensions: data.allowed_extensions ? data.allowed_extensions : [],
    allowed_currency_types: data.allowed_currency_types
      ? data.allowed_currency_types
      : [],
    default_currency_type: data.default_currency_type
      ? data.default_currency_type
      : null,
    _id: data._id ? data._id : null,
    account_id: data.account_id ? data.account_id : null,
    default_country_code: data.default_country_code
      ? data.default_country_code
      : null,
  };
};

const getAuthAccountConfigurationData = (data) => {
  return {
    session_timeout: data.session_timeout ? data.session_timeout : 0,
    mobile_session_timeout: data.mobile_session_timeout ? data.mobile_session_timeout : 1, // 1 day
    is_remember_me_enabled: data.is_remember_me_enabled
      ? data.is_remember_me_enabled
      : false,
    remember_me_days: data.remember_me_days ? data.remember_me_days : 0,
    is_password_expiry_enabled: data.is_password_expiry_enabled
      ? data.is_password_expiry_enabled
      : false,
    password_expiry_days: data.password_expiry_days
      ? data.password_expiry_days
      : 0,
    is_mfa_enabled: data.is_mfa_enabled ? data.is_mfa_enabled : false,
    mfa_details: data.mfa_details ? { allowed_mfa_methods: data.mfa_details.allowed_mfa_methods } : {
    allowed_mfa_methods: [],
  },
  mfa_enforced_teams: data.mfa_enforced_teams ? data.mfa_enforced_teams : [],
  };
};

// GET Apis
// 1. Get Account Configuration Details Api
const validateAccountConfigurationDetailsApiResponse = (content) => {
  const structuredContent = getAccountConfigurationData(content);
  return structuredContent;
};

export const normalizeAccountConfigurationDetailsApiResponse = (
  untrustedContent,
) => {
  const content = validateAccountConfigurationDetailsApiResponse(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError(`normalize ${accountConfigurationData} Data failed`);
    return null;
  }
  return content;
};

// 2. Get Account Configuration Details Api
const validateAuthAccountConfigurationDetailsApiResponse = (content) => {
  const structuredContent = getAuthAccountConfigurationData(content);
  return structuredContent;
};

export const normalizeAuthAccountConfigurationDetailsApiResponse = (
  untrustedContent,
) => {
  const content = validateAuthAccountConfigurationDetailsApiResponse(
    untrustedContent.data.result.data,
  );
  if (!content) {
    reportError(`normalize ${authAccountConfigurationData} Data failed`);
    return null;
  }
  return content;
};

// Post Apis
// 1. Update Account Configuration Details Api
export const normalizeUpdateAccountConfigurationDetailsApiResponse = (
  untrustedContent,
) => {
  const content = get(untrustedContent, 'data.success');
  if (!content) {
    reportError(`normalize ${accountConfigurationData} Data failed`);
    return null;
  }
  return content;
};

// 2. Update Auth Account Configuration Details Api
export const normalizeUpdateAuthAccountConfigurationDetailsApiResponse = (
  untrustedContent,
) => {
  const content = get(untrustedContent, 'data.success');
  if (!content) {
    reportError(`normalize ${authAccountConfigurationData} Data failed`);
    return null;
  }
  return content;
};

export default normalizeAccountConfigurationDetailsApiResponse;
