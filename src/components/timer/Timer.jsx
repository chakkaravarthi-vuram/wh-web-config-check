import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import { withTranslation } from 'react-i18next';
import { Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import { withRouter } from 'react-router-dom';
import styles from './Timer.module.scss';
import { BS } from '../../utils/UIConstants';
import gClasses from '../../scss/Typography.module.scss';
import { BUTTON_TYPE, TIMER_CONSTANTS } from '../../utils/Constants';
import Button from '../form_components/button/Button';
import ThemeContext from '../../hoc/ThemeContext';
import { isBasicUserMode } from '../../utils/UtilityFunctions';

class Timer extends Component {
  state = { time: {}, seconds: 0, enableResend: false };

  // eslint-disable-next-line react/static-property-placement, react/sort-comp
  static contextType = ThemeContext;

  componentDidMount() {
    const { time } = this.props;
    this.setState({ time: this.secondsToTime(time), seconds: time });
    if (this.timer === 0 && time > 0) {
      this.timer = setInterval(this.countDownFunction, 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { time, enableResend } = this.state;
    const { isDisplayResendText, t, history } = this.props;
    const { colorScheme, colorSchemeDefault } = this.context;
    const isNormalMode = isBasicUserMode(history);
    return (
      <div>
        {isDisplayResendText ? (
          <div className={cx(styles.ResendText, BS.D_FLEX, BS.JC_CENTER)}>
            {!enableResend ? (
              <div className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.MT20, gClasses.FontWeight400)}>
                <Text
                  content={t(TIMER_CONSTANTS.RESEND_CODE)}
                  size={ETextSize.MD}
                  className={cx(gClasses.MR3, gClasses.FontWeight400)}
                />
          {time.h ? (
            <div>
              {time.h}
              :
              {time.m}
              :
              {time.s}
            </div>
          ) : (
            <div>
              {time.m}
              :
              {time.s}
            </div>
          )}
              </div>
            ) : (
              <div className={cx(BS.D_FLEX, BS.JC_START)}>
                <Text
                  content={t(TIMER_CONSTANTS.EMAIL_NOT_RECEIVED)}
                  size={ETextSize.MD}
                  className={cx(gClasses.MT20, gClasses.FontWeight400)}
                />
              <Button
                buttonType={BUTTON_TYPE.LIGHT}
                className={cx(BS.TEXT_NO_WRAP, styles.ResendStyle, gClasses.PL3, gClasses.ML3, gClasses.MT10)}
                onClick={this.resendOTPClickHandler}
                removePadding
                style={{
                  color: isNormalMode ? colorScheme?.activeColor : colorSchemeDefault?.activeColor,
                }}
              >
                {t(TIMER_CONSTANTS.SEND_AGAIN)}
              </Button>
              </div>

            )}

          </div>
        ) : (
          <div>
            {time.h ? (
            <div>
              {time.h}
              :
              {time.m}
              :
              {time.s}
            </div>
          ) : (
            <div>
              {time.m}
              :
              {time.s}
            </div>
          )}
          </div>
        )
      }
      </div>
    );
  }

  secondsToTime = (secs) => {
    const hours = Math.floor(secs / (60 * 60));
    const divisor_for_minutes = secs % (60 * 60);
    const minutes = Math.floor(divisor_for_minutes / 60);
    const divisor_for_seconds = divisor_for_minutes % 60;
    const seconds = Math.ceil(divisor_for_seconds).toString().padStart(2, '0');
    const timeObj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return timeObj;
  };

  resendOTPClickHandler = () => {
    const { time, resendOTPHandler } = this.props;
    this.setState({ time: this.secondsToTime(time), seconds: time, enableResend: false });
    this.timer = setInterval(this.countDownFunction, 1000);
    resendOTPHandler();
  };

  countDownFunction = () => {
    const { seconds } = this.state;
    const { countDown } = this.props;
    const secondsCalc = seconds - 1;
    this.setState({
      time: this.secondsToTime(secondsCalc),
      seconds: secondsCalc,
    });
    if (secondsCalc === 0) {
      this.setState({
        enableResend: true,
      });
      clearInterval(this.timer);
      if (countDown) return countDown(true);
    }
    return null;
  };

  timer = 0;

  // countDown = this.countDownFunction.bind(this);
}

Timer.defaultProps = {};

Timer.propTypes = {
  countDown: PropTypes.func.isRequired,
  time: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withRouter(withTranslation()(Timer));
