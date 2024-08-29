import React from 'react';
import cx from 'classnames';
import Radium from 'radium';
import propTypes from 'prop-types';

import { BUTTON_TYPE } from '../../../utils/Constants';
import styles from './ButtonReport.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function ButtonReport(props) {
  const {
    id,
    children,
    onClick,
    disabled,
    className,
    isCheck,
    labelClassName,
    label,
    hideLabel,
    onMouseDown,
    onBlur,
    testId,
  } = props;
  const cursor = disabled ? null : gClasses.CursorPointer;

  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        isCheck ? styles.CheckedButton : styles.Button,
        className,
        cursor,
        gClasses.MB10,
        BS.D_FLEX,
        BS.FLEX_COLUMN,
        disabled && styles.DisabledButtonReport,
      )}
      onMouseDown={onMouseDown}
      onBlur={onBlur}
      data-test={testId}
    >
      {children}
      {!hideLabel && (
        <span
          className={cx(
            isCheck ? styles.CheckedLabel : styles.Label,
            labelClassName,
          )}
        >
          {label}
        </span>
      )}
    </button>
  );
}
ButtonReport.defaultProps = {
  onClick: null,
  id: null,
  className: null,
  disabled: false,
  onMouseDown: null,
  onBlur: null,
  style: EMPTY_STRING,
  testId: EMPTY_STRING,
  isCheck: false,
  label: EMPTY_STRING,
  labelClassName: null,
};
ButtonReport.propTypes = {
  onClick: propTypes.func,
  id: propTypes.string,
  className: propTypes.string,
  disabled: propTypes.bool,
  onMouseDown: propTypes.func,
  onBlur: propTypes.func,
  style: propTypes.string,
  testId: propTypes.string,
  isCheck: propTypes.bool,
  label: propTypes.string,
  labelClassName: propTypes.string,
};
export { BUTTON_TYPE };

export default Radium(ButtonReport);
