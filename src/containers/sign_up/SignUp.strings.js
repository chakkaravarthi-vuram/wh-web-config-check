import { BASIC_DETAIL_STRINGS } from './basic_details/BasicDetails.strings';
import { ADDITIONAL_DETAILS_STRINGS } from './additional_details/AdditionalDetails.strings';

export const SIGN_UP_STEP = {
  BASIC: 1,
  OTP_VERIFICATION: 2,
  ADDITIONAL: 3,
  LANDING: 4,
};
export const SIGN_UP_STRINGS = {
  EXISTING_ACCOUNT: 'sign_up.common.existing_account',
  SIGN_IN: 'sign_up.common.sign_in',
  SIGN_IN_ID: 'sign_in_button',
  BOTTOM_TEXT: 'sign_up.common.bottom_text',
};

export const SIGN_UP_LAYOUT = (step) => {
  if (step === SIGN_UP_STEP.BASIC) {
    return {
      XL: { size: 5, offset: 3 },
      LG: { size: 6, offset: 3 },
      XS: { size: 10 },
      MD: { size: 10 },
    };
  }
  return {
    XL: { size: 7, offset: 3 },
    LG: { size: 8, offset: 3 },
    XS: { size: 12 },
    MD: { size: 12 },
  };
};

export const SIGN_UP_LABELS = (t) => {
  return {
  [BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.ID]: t(BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.LABEL),
  [ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_NAME.ID]: t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_NAME.LABEL),
  [ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.ID]: t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.LABEL),
  [ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.ID]: t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.LABEL),
  [ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.ID]: t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.LABEL),
  [ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.ID]: t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.LABEL),
  [ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.ID]: t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.LABEL),
  };
};
export const ICON_STRINGS = {
  LOGO_SMALL: 'OneThing',
};
export const BLOCK_GENERATE_OTP = 'generate.block';
export const VERIFY_BLOCK_OTP = 'verify.block';
export const IP_BLOCK = 'ip.block';
export const SIGN_UP_ERRORS = {
  BLOCK_GENERATE_OTP_ERROR: 'sign_up.common.errors.block_gen_otp',
  VERIFY_BLOCK_OTP_ERROR_TITLE: 'sign_up.common.errors.verify_block_otp_title',
  VERIFY_BLOCK_OTP_ERROR_DESC: 'sign_up.common.errors.verify_block_otp_desc',
  IP_BLOCK_ERROR: 'sign_up.common.errors.ip_block',
  OTP_TIMEOUT: 'sign_up.common.errors.otp_timeout',
};
export const ARIA_STRINGS = {
  OTP_INPUT: 'OTP',
};
