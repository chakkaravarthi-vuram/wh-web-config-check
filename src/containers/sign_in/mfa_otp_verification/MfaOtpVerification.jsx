import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import cx from 'clsx';
import { connect } from 'react-redux';
import { Button as LibraryButton,
  EButtonType,
  Text,
  ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../../scss/Typography.module.scss';
import MfaOtpVerificationForm from '../../mfa/mfa_authentication_methods/mfa_otp/OTP';
import PageNotFound from '../../error_pages/PageNotFound';
import { validateMfaAPIAction, resendLoginMfaOtpAction, updateMFAInfo } from '../../../redux/actions/Mfa.Action';
import { BS } from '../../../utils/UIConstants';
import styles from './MfaOtpVerification.module.scss';
import LockIcon from '../../../assets/icons/LockIcon';
import { MFA_OTP_VERIFICATION_STRINGS } from './MfaOtpVerification.strings';
import Timer from '../../../components/timer/Timer';
import { MFA_STRINGS } from '../../user_settings/mfa_settings/MFASetup.strings';
import { ALLOWED_MFA_METHOD } from '../../mfa/mfa_authentication_methods/MfaAuthenticationMethods.constants';
import { routeNavigate } from '../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../utils/Constants';
import * as ROUTE_CONSTANTS from '../../../urls/RouteConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import ThemeContext from '../../../hoc/ThemeContext';
import OnethingLogo from '../../../assets/icons/OnethingLogo';
import { ICON_STRINGS } from '../SignIn.strings';
import signinStyle from '../../../components/auth_layout/AuthLayout.module.scss';

class MfaOtpVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: '',
        };
      }

  // eslint-disable-next-line react/static-property-placement, react/sort-comp
  static contextType = ThemeContext;

  render() {
    const { location, mfa_code, email, form_details, t } = this.props;
    const location_state = location.state;
    const { colorScheme } = this.context;
    let verifyMfaView = null;
    if (location_state?.isMfaVerified) {
      const form = (
        <>
          <div className={cx(gClasses.FTwo24GrayV3, BS.TEXT_CENTER, gClasses.FontWeight600, signinStyle.SignInHeader)}>
            {form_details?.acc_logo ? (
                  <div className={signinStyle.Imageclass}>
                  <img src={form_details?.acc_logo} alt="" className={signinStyle.AccountLogo} />
                  </div>
                ) : (
                <div>
                  <OnethingLogo className={cx(signinStyle.Logo)} title={ICON_STRINGS.LOGO_SMALL} />
                </div>
                )}
          </div>
          <div className={cx(BS.D_FLEX, BS.JC_CENTER)}>
            <div className={cx(gClasses.MR5, styles.CircleEmailIcon)}>
              <LockIcon />
            </div>
          <div className={cx(BS.D_FLEX, BS.JC_CENTER)}>
            <Text
              content={MFA_OTP_VERIFICATION_STRINGS(t).TITLE}
              size={ETextSize.MD}
              className={cx(gClasses.MT8, gClasses.FontWeight500)}
            />
          </div>
          </div>
          <div className={cx(BS.D_FLEX, BS.JC_CENTER)}>
            <Text
              content={
               location_state?.mfaMethod === ALLOWED_MFA_METHOD.ALLOWED_MFA_METHOD_ID.TOTP_METHOD
               ? MFA_OTP_VERIFICATION_STRINGS(t).MFA_TOTP_USING_AUTHENTICATOR_APP
               : location_state?.mfaMethod === ALLOWED_MFA_METHOD.ALLOWED_MFA_METHOD_ID.EMAIL_OTP_METHOD
               ? `${MFA_OTP_VERIFICATION_STRINGS(t).VERIFICATION_CODE_WAS_SENT_PREFIX} ${email || location_state?.username} ${MFA_OTP_VERIFICATION_STRINGS(t).VERIFICATION_CODE_WAS_SENT_SUFFIX}`
               : MFA_OTP_VERIFICATION_STRINGS(t).OTP_DEFAULT_TEXT
              }
            size={ETextSize.SM}
            className={cx(gClasses.MT15, gClasses.FontWeight500, styles.CenteredText)}
            />
          </div>
          <div className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.MT10)}>
            <MfaOtpVerificationForm length={6} onChange={this.handleOTPChange} errorMessage={mfa_code?.mfa_code} />
          </div>
          {location_state?.mfaMethod === ALLOWED_MFA_METHOD.ALLOWED_MFA_METHOD_ID.EMAIL_OTP_METHOD && (
              <Timer time={MFA_STRINGS.MFA_OTP_TIMER} resendOTPHandler={this.resendOTPHandler} ResendTest={styles.ResendTest} ResendStyle={styles.ResendStyle} isDisplayResendText form_details={form_details} />
          )}

          <div className={cx(BS.D_FLEX, BS.JC_CENTER)}>
            <Text
              content={MFA_OTP_VERIFICATION_STRINGS(t).HAVING_TROUBLE_CONTACT_ADMIN_TEXT}
              size={ETextSize.SM}
              className={cx(gClasses.MT15, gClasses.FontWeight400)}
            />
          </div>

          <div className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.MT15)}>
            <LibraryButton
              buttonText={MFA_OTP_VERIFICATION_STRINGS(t).VERIFY_OTP_BTN_TEXT}
              type={EButtonType.PRIMARY}
              onClick={this.onVerifyOTPHandler}
              colorSchema={form_details?.isCustomTheme && colorScheme}
            />
          </div>
          <div className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.MT15)}>
            <LibraryButton
              buttonText={MFA_OTP_VERIFICATION_STRINGS(t).CANCEL_OTP_BTN_TEXT}
              type={EButtonType.TERTIARY}
              onClick={this.onCancelClickHandler}
              colorSchema={form_details?.isCustomTheme && colorScheme}
            />
          </div>

        </>
      );
      verifyMfaView = form;
    } else {
        verifyMfaView = <PageNotFound />;
    }
    return verifyMfaView;
  }

  onVerifyOTPHandler = () => {
    const { validateMfa, getAuthorizationDetailsApi, history } = this.props;
    const { otp } = this.state;
    const params = {
      mfa_code: otp,
    };
    validateMfa(params, getAuthorizationDetailsApi, history);
  };

  onCancelClickHandler = () => {
    const { history, updateMFAInformation } = this.props;
    routeNavigate(history, ROUTE_METHOD.PUSH, ROUTE_CONSTANTS.SIGNIN, EMPTY_STRING, {}, true);
    const params = {
      error_list: {},
      common_server_error: {},
    };
    updateMFAInformation(params);
  };

  handleOTPChange = (otpValue) => {
    this.setState({ otp: otpValue });
  };

  resendOTPHandler = () => {
    const { resendOtp } = this.props;
    resendOtp();
  };
}

const mapStateToProps = (state) => {
  return {
    mfa_code: state.MfaReducer.error_list,
    email: state.SignInReducer.email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    validateMfa: (params, getAuthorizationDetailsApiFn, history) => {
        dispatch(validateMfaAPIAction(params, getAuthorizationDetailsApiFn, history));
    },
    resendOtp: () => {
      dispatch(resendLoginMfaOtpAction());
  },
  updateMFAInformation: (params) => {
    dispatch(updateMFAInfo(params));
  },
  dispatch,
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(MfaOtpVerification)));
