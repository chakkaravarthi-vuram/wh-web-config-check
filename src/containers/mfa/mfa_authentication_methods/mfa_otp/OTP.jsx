import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames/bind';
import styles from './OTP.module.scss';
import HELPER_MESSAGE_TYPE from '../../../../components/form_components/helper_message/HelperMessage.strings';
import gClasses from '../../../../scss/Typography.module.scss';
import HelperMessage from '../../../../components/form_components/helper_message/HelperMessage';
import { KEY_CODES, KEY_NAMES } from '../../../../utils/Constants';

function OTPInput({ length, onChange, errorMessage }) {
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (!value.match(/^\d*$/)) {
      return;
    }
    otp[index] = value;
    setOTP([...otp]);
    if (index < length - 1 && value !== '') {
      inputRefs[index + 1].current.focus();
    }
    onChange(otp.join(''));
  };

  const handleBackspace = (e, index) => {
    if (e.key === KEY_CODES.BACK_SPACE && index > 0 && !otp[index]) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    console.log('OTP handleKeyDown ', e.key, KEY_NAMES.ARROW_RIGHT);
    if (e.key === KEY_NAMES.ARROW_RIGHT) {
      if (index < length - 1) {
        inputRefs[index + 1].current.focus();
      }
    }
    if (e.key === KEY_NAMES.ARROW_LEFT) {
      if (index < length + 1) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  useEffect(() => {
    inputRefs[0].current.focus();
  }, []);

  return (
    <div className={styles.otpClass}>
      {otp.map((digit, index) => (
      <input
        key={index}
        ref={inputRefs[index]}
        type="text"
        value={digit}
        onChange={(e) => {
          handleChange(e, index);
        }}
        onKeyDown={(e) => handleKeyDown(e, index)}
        onKeyUp={(e) => handleBackspace(e, index)}
        maxLength="1"
        className={cx(styles.OtpInputClass, (errorMessage && gClasses.ErrorInputBorder))}
      />
      ))}
      {errorMessage &&
      (<HelperMessage
        type={HELPER_MESSAGE_TYPE.ERROR}
        message={errorMessage}
        className={cx(gClasses.ErrorMarginV1)}
      />)}
    </div>
  );
}

export default OTPInput;
