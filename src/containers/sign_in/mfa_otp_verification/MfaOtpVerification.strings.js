import { translateFunction } from '../../../utils/jsUtility';

export const MFA_OTP_VERIFICATION_STRINGS = (translate = translateFunction) => {
  return {
    TITLE: translate('mfa.otp_verification.title'),
    HAVING_TROUBLE_CONTACT_ADMIN_TEXT: translate('mfa.otp_verification.having_trouble_contact_admin_text'),
    OTP_DEFAULT_TEXT: translate('mfa.otp_default_text'),
    MFA_TOTP_USING_AUTHENTICATOR_APP: translate('admin_settings.security_settings.mfa_settings.totp_using_authenticator_app'),
    VERIFICATION_CODE_WAS_SENT_PREFIX: translate('mfa.enable_mfa.enable_eotp.verification_code_was_sent_prefix'),
    VERIFICATION_CODE_WAS_SENT_SUFFIX: translate('mfa.enable_mfa.enable_eotp.verification_code_was_sent_suffix'),
    VERIFY_OTP_BTN_TEXT: translate('mfa.verify_otp_text'),
    CANCEL_OTP_BTN_TEXT: translate('mfa.cancel_btn_text'),
  };
};
