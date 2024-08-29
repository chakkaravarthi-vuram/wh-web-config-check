import React from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from 'components/auth_layout/AuthLayout.module.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Timer from '../../../../components/timer/Timer';
import OTP from '../../../../components/form_components/otp/Otp';
import Alert from '../../../../components/form_components/alert/Alert';
import CustomLink from '../../../../components/form_components/link/Link';
import gClasses from '../../../../scss/Typography.module.scss';
import { DEFAULT_RESEND_BUTTON_ENABLE_TIME, SIGN_UP_STRINGS } from '../OtpVerification.strings';
import { DOT } from '../../../../utils/strings/CommonStrings';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';

function OtpVerificationForm(props) {
  let resend_button = null;
  let timer = null;
  const {
    formDetails,
    email,
    isResendEnabled,
    resetError,
    setOtpValue,
    onChangeEmailButtonClicked,
    // expiration_time,
    // setOtpExpired,
    otpError,
    resendOtp,
    enableResendButton,
  } = props;
  const { t } = useTranslation();
  // if (isResendEnabled) {
    resend_button = (
      <CustomLink className={cx(gClasses.FTwo12, gClasses.FontWeight500)} id={SIGN_UP_STRINGS.RESEND_OTP_LINK.ID} onClick={resendOtp}>
        {t(SIGN_UP_STRINGS.RESEND_OTP_LINK.LABEL)}
      </CustomLink>
    );
  // }

  if (!isResendEnabled) {
    timer = (
      <div className={BS.D_FLEX}>
        {`${t(SIGN_UP_STRINGS.RESEND_OTP_2)} `}
        <span className={gClasses.MR5} />
        <div className={styles.Timer}>
          <Timer time={DEFAULT_RESEND_BUTTON_ENABLE_TIME} countDown={enableResendButton} />
        </div>
      </div>
    );
  }

  let resendOtpComponent = null;

  if (formDetails.otp_message_or_error_text === t(SIGN_UP_STRINGS.RESEND_OTP) && !isResendEnabled) {
    resendOtpComponent = null;
  } else if (formDetails.otp_message_or_error_text !== t(SIGN_UP_STRINGS.RESEND_OTP)) {
    resendOtpComponent = <Alert role={ARIA_ROLES.ALERT} content={formDetails.otp_message_or_error_text} className={gClasses.MT20} />;
  }

  return (
    <>
      <h1 className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600)}>
        {t(SIGN_UP_STRINGS.TITLE)}
      </h1>
      <div className={cx(gClasses.MT20, BS.TEXT_CENTER)}>
        <div className={gClasses.FTwo12GrayV2}>{t(SIGN_UP_STRINGS.SUB_TITLE_1)}</div>
        <div className={cx(gClasses.FTwo12GrayV2, gClasses.FontWeight600, gClasses.WordBreakBreakWord, gClasses.MT3)}>
          {email}
          {DOT}
        </div>
        <Link
        onClick={onChangeEmailButtonClicked}
        id={SIGN_UP_STRINGS.CHANGE.ID}
        className={cx(gClasses.FTwo12BlueV39, gClasses.FontWeight500, styles.ChangeEmail)}
        to="/create-account/email"
        >
          {t(SIGN_UP_STRINGS.CHANGE.LABEL)}
        </Link>
        {/* <div className={cx(gClasses.FOne13GrayV2, gClasses.MT3)}>{SIGN_UP_STRINGS.SUB_TITLE_2}</div> */}
      </div>
      <OTP
        className={cx(gClasses.MT30, gClasses.CenterH)}
        otp={formDetails.otp}
        resetError={resetError}
        setOtpValue={setOtpValue}
        testId={SIGN_UP_STRINGS.OTP_INPUT}
        error={otpError}
      />
      {resendOtpComponent}
      <div className={cx(styles.MessageContainer, gClasses.FTwo12GrayV2, gClasses.MT20)}>
        {/* <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}> */}
          {/* <div className={BS.D_FLEX}>
            <div className={cx(gClasses.MR5, gClasses.FOne12GrayV2)}>{SIGN_UP_STRINGS.OTP_EXPIRY_LABEL}</div>
            <div className={styles.Timer}>
              <Timer time={expiration_time} countDown={setOtpExpired} />
            </div>
          </div> */}
          <div className={cx(BS.D_FLEX, BS.TEXT_CENTER)}>
            {timer}
            {isResendEnabled && (
            <>
              {t(SIGN_UP_STRINGS.DIDNT_RECEIVE)}
              <div className={cx(styles.Timer, gClasses.ML5)}>{resend_button}</div>
            </>
            )}
          </div>
        {/* </div> */}
        <div className={cx(gClasses.Italics, gClasses.MT30, gClasses.FTwo10GrayV20)}>{t(SIGN_UP_STRINGS.NOTE)}</div>
        {/* <div className={gClasses.MT20}>
          {SIGN_UP_STRINGS.CHANGE_EMAIL}
          <CustomLink onClick={onChangeEmailButtonClicked} id={SIGN_UP_STRINGS.CHANGE.ID}>
            {SIGN_UP_STRINGS.CHANGE.LABEL}
          </CustomLink>
        </div> */}
      </div>
    </>
  );
}

OtpVerificationForm.defaultProps = {
  otpError: null,
};

OtpVerificationForm.propTypes = {
  email: PropTypes.string.isRequired,
  expiration_time: PropTypes.number.isRequired,
  isResendEnabled: PropTypes.bool.isRequired,
  resendOtp: PropTypes.func.isRequired,
  enableResendButton: PropTypes.func.isRequired,
  resetError: PropTypes.func.isRequired,
  setOtpValue: PropTypes.func.isRequired,
  setOtpExpired: PropTypes.func.isRequired,
  formDetails: PropTypes.objectOf().isRequired,
  onChangeEmailButtonClicked: PropTypes.func.isRequired,
  otpError: PropTypes.string,
};

export default OtpVerificationForm;
