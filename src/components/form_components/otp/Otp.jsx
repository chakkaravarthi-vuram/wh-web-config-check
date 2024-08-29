import React, { useRef, useState } from 'react';
import cx from 'classnames/bind';

import { isMobileScreen } from 'utils/UtilityFunctions';
import { ARIA_STRINGS } from 'containers/sign_up/SignUp.strings';
import { useTranslation } from 'react-i18next';
import { BS, PIXEL_CONSTANTS } from '../../../utils/UIConstants';
import { KEY_CODES } from '../../../utils/Constants';
import { ACTION_STRINGS, EMPTY_STRING, NUMBER_STRINGS } from '../../../utils/strings/CommonStrings';
import styles from './Otp.module.scss';
import { SIGN_UP_STRINGS } from '../../../containers/sign_up/otp_verification/OtpVerification.strings';
import { IMAGE_UPLOAD_STRINGS } from '../image_upload/ImageUpload.strings';

const CODE_LENGTH = new Array(6).fill(0);

function Otp(props) {
  let OTP_BOX_WIDTH = 45;
  if (isMobileScreen()) OTP_BOX_WIDTH = 35;
  const otp_props = props;
  const inputRef = useRef(null);
  const value = otp_props.otp;
  const [focused, setFocused] = useState(false);
  const { t } = useTranslation();

  const values = value.toString().split(EMPTY_STRING);
  const selectedIndex = values.length < CODE_LENGTH.length ? values.length : CODE_LENGTH.length - 1;
  const hideInput = !(values.length < CODE_LENGTH.length);
  const errorBorder = otp_props.error === t(SIGN_UP_STRINGS.INVALID_OTP) ? styles.BorderColor : null;
  function handleClick() {
    inputRef.current.focus();
  }

  function handleFocus() {
    setFocused(true);
  }

  function handleBlur() {
    values.length < CODE_LENGTH.length && setFocused(false);
     setFocused(true);
  }

  function handleKeyUp(e) {
    if (e.key === KEY_CODES.BACK_SPACE) {
      otp_props.setOtpValue(value.slice(0, value.length - 1));
    }
  }

  function handleChange(e) {
    const updatevalue = e.target.value.replace(/[^0-9]/, EMPTY_STRING);
    if (!Number.isNaN(updatevalue)) {
      if (!(value.length >= CODE_LENGTH.length)) {
        otp_props.setOtpValue((value + updatevalue).slice(0, CODE_LENGTH.length));
      }
    }
  }

  return (
    <div className={cx(BS.D_FLEX, otp_props.className)}>
      {console.log('fdsfdfsd', focused)}
      <div className={cx(styles.Wrap, errorBorder)} onClick={handleClick} role="presentation">
        <input
          value={EMPTY_STRING}
          ref={inputRef}
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={styles.Input}
          style={{
            width: OTP_BOX_WIDTH + IMAGE_UPLOAD_STRINGS.UNIT,
            top: PIXEL_CONSTANTS.ZERO_PIXEL,
            bottom: PIXEL_CONSTANTS.ZERO_PIXEL,
            left: `${selectedIndex < 3 ? selectedIndex * OTP_BOX_WIDTH : (selectedIndex + 1) * OTP_BOX_WIDTH - 17}px`,
            opacity: hideInput ? 0 : 1,
          }}
          data-test={SIGN_UP_STRINGS.OTP_INPUT}
          id={otp_props.testId}
          aria-label={ARIA_STRINGS.OTP_INPUT}
          autoComplete={ACTION_STRINGS.OFF}
          tabIndex={0}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus="true"
        />
        {CODE_LENGTH.map((v, index) => {
          const selected = values.length === index;
          const filled = values.length === CODE_LENGTH.length && index === CODE_LENGTH.length - 1;
          let placeholderView = null;
          if (!focused) {
            if (values.length === 0) {
              placeholderView = NUMBER_STRINGS.ZERO;
            } else {
              placeholderView = index >= values.length ? NUMBER_STRINGS.ZERO : null;
            }
          } else {
            placeholderView = !selected && index >= values.length ? NUMBER_STRINGS.ZERO : null;
          }
          return (
            <React.Fragment key={index}>
              <div className={cx(styles.Display, errorBorder)}>
                <div className={styles.OtpPlaceholder}>{placeholderView}</div>
                {values[index]}
                {(selected || filled) && focused && <div className={cx(styles.Shadows, errorBorder)} />}
              </div>
              {index === 2 ? <div className={cx(styles.Splitter, errorBorder)}>-</div> : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default Otp;
