import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { SIGN_UP_STRINGS, OTP_LENGTH, OTP_EXIPRATION_TIME_ZERO } from './OtpVerification.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import {
  setPointerEvent,
} from '../../../utils/UtilityFunctions';
import {
  signUpOtpVerificationSetState,
  signUpOtpVerificationClearState,
  resendOtpAPIAction,
  verifyOtpAPIAction,
} from '../../../redux/actions/SignUp.Action';
import OtpVerificationForm from './otp_verification_form/OtpVerificationForm';
import {
  cancelTokenForVerifyOtpAndClearState,
  cancelTokenForResendOtpAndClearState,
} from '../../../axios/apiService/signUp.apiService';

function OtpVerification(props) {
  const { t } = useTranslation();
  const {
    otp_expiration_time,
    email,
    setOtpExpired,
    onChangeEmailButtonClicked,
    state,
    clearState,
    dispatch,
    setState,
    updateError,
    uuid,
    navigateToAccountInfo,
    verifyOtpApiCall,
    updateUuid,
    resendOtpApiCall,
  } = props;

  let expiration_time = null;

  const { is_resend_enabled, otp_message_or_error_text } = state;
  if (otp_expiration_time) {
    expiration_time = otp_expiration_time > OTP_EXIPRATION_TIME_ZERO ? otp_expiration_time : OTP_EXIPRATION_TIME_ZERO;
  }

  useEffect(() => () => {
    dispatch(cancelTokenForVerifyOtpAndClearState());
    dispatch(cancelTokenForResendOtpAndClearState());
    clearState();
  }, []);

  const enableResendButton = () => {
    const { block_resend } = state;
    if (!block_resend) {
      setState({
        is_resend_enabled: true,
      });
    }
  };

  const updateOTPError = (error) => {
    if (error.response && error.response.data && error.response.data.errors[0]) {
      updateError(error.response.data.errors[0]);
    }
  };

  const verifyOtpAPI = (otpValue) => {
    const otp_post_data = {
      _id: uuid,
      otp_code: otpValue,
    };
    setPointerEvent(true);
    verifyOtpApiCall(otp_post_data, navigateToAccountInfo, updateOTPError, t);
  };

  const resendOtpAPI = () => {
    const data = {
      _id: uuid,
    };
    setPointerEvent(true);
    resendOtpApiCall(data, updateUuid, updateOTPError, t);
  };

  const setOtpValue = async (otpParam) => {
    await setState({
      otp: otpParam,
    });
    if (otpParam.length === OTP_LENGTH) verifyOtpAPI(otpParam);
    else {
      setState({
        otp_message_or_error_text: null,
      });
    }
  };

  const resetError = () => {
    setState({
      otp_message_or_error_text: null,
    });
  };

  return (
    <OtpVerificationForm
      email={email}
      formDetails={state}
      otpError={otp_message_or_error_text}
      resetError={resetError}
      setOtpValue={setOtpValue}
      resendOtp={resendOtpAPI}
      data-test={SIGN_UP_STRINGS.OTP_COMPONENT}
      expiration_time={expiration_time}
      isResendEnabled={is_resend_enabled}
      enableResendButton={enableResendButton}
      setOtpExpired={setOtpExpired}
      onChangeEmailButtonClicked={onChangeEmailButtonClicked}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    state: state.SignUpOtpVerificationReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setState: (data) => {
      dispatch(signUpOtpVerificationSetState(data));
    },
    resendOtpApiCall: (data, func1, func2, t) => {
      dispatch(resendOtpAPIAction(data, func1, func2, t));
    },
    verifyOtpApiCall: (data, func1, func2, t) => {
      dispatch(verifyOtpAPIAction(data, func1, func2, t));
    },
    clearState: () => {
      dispatch(signUpOtpVerificationClearState());
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OtpVerification);

OtpVerification.propTypes = {
  uuid: PropTypes.string.isRequired,
  email: PropTypes.string,
  otp_expiration_time: PropTypes.number.isRequired,
  navigateToAccountInfo: PropTypes.func.isRequired,
  updateUuid: PropTypes.func.isRequired,
  updateError: PropTypes.func.isRequired,
  setOtpExpired: PropTypes.func.isRequired,
  onChangeEmailButtonClicked: PropTypes.func.isRequired,
  resendOtpApiCall: PropTypes.func.isRequired,
  state: PropTypes.objectOf().isRequired,
  setState: PropTypes.func.isRequired,
  verifyOtpApiCall: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};
OtpVerification.defaultProps = {
  email: EMPTY_STRING,
};
