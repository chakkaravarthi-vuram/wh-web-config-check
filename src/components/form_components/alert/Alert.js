import cx from 'classnames/bind';
import propTypes from 'prop-types';
import React from 'react';
import globalClasses from '../../../scss/Typography.module.scss';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import styles from './Alert.module.scss';

export const ALERT_TYPES = {
  TYPE_1: 1,
  TYPE_2: 2,
};
function Alert(props) {
  const { content, className, type = ALERT_TYPES.TYPE_1, role, ariaLabelHelperMessage } = props;
  const alertClass = cx(
    type === 1 ? styles.Alert : styles.AlertV2,
    type === 1 ? globalClasses.FOne12RedV2 : globalClasses.FOne12White,
    // globalClasses.ErrorInputBorder,
    globalClasses.InputBorderRadius,
    className,
  );
  return content ? <div role={role} aria-label={ariaLabelHelperMessage} className={alertClass}>{content}</div> : null;
}
Alert.defaultProps = {
  className: EMPTY_STRING,
  content: EMPTY_STRING,
  role: EMPTY_STRING,
};
Alert.propTypes = {
  content: propTypes.string,
  className: propTypes.string,
  role: propTypes.string,
};

export default Alert;
