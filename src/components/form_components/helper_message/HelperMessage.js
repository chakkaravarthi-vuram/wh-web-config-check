import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';
import cx from 'classnames/bind';

import styles from './HelperMessage.module.scss';
import globalClasses from '../../../scss/Typography.module.scss';
import HELPER_MESSAGE_TYPE from './HelperMessage.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function HelperMessage(props) {
  const { type, className, id, message, noMarginBottom, ariaLabelHelperMessage, ariaHidden, role } = props;
  const ariaRole = `${role || 'alert'}`;
  const messageStyle = classNames(
    {
      [globalClasses.FTwo12RedV18]: type === HELPER_MESSAGE_TYPE.ERROR,
    },
    className,
    styles.ErrorMessage,
    globalClasses.LineHeightNormal,
  );
  return (
    <div
      role={ariaRole}
      id={id}
      aria-label={ariaLabelHelperMessage}
      aria-hidden={ariaHidden}
      className={cx(messageStyle, message && !noMarginBottom && globalClasses.MB15)}
    >
      {message}
    </div>
  );
}
export default React.memo(HelperMessage);
export { HELPER_MESSAGE_TYPE };
HelperMessage.defaultProps = {
  type: HELPER_MESSAGE_TYPE.ERROR,
  id: null,
  className: EMPTY_STRING,
  message: EMPTY_STRING,
  ariaHidden: false,
  noMarginBottom: false,
};

HelperMessage.propTypes = {
  id: propTypes.string,
  message: propTypes.string,
  className: propTypes.string,
  type: propTypes.number,
  ariaHidden: propTypes.bool,
  noMarginBottom: propTypes.bool,
};
