import React from 'react';
import cx from 'classnames';
import Radium from 'radium';
import propTypes from 'prop-types';

import { BUTTON_TYPE } from '../../../utils/Constants';
import styles from './ButtonCheck.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { EMPTY_STRING, SPACE } from '../../../utils/strings/CommonStrings';

function ButtonCheck(props) {
  const {
    id,
    onClick,
    disabled,
    className,
    isCheck,
    label,
    onMouseDown,
    onBlur,
    testId,
    buttonLabelId,
    mainLabel,
  } = props;
  const ariaLabel = mainLabel + SPACE + label + SPACE + (isCheck ? 'selected' : 'not selected');
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
      )}
      onMouseDown={onMouseDown}
      onBlur={onBlur}
      data-test={testId}
      aria-label={ariaLabel}
    >
      <span className={gClasses.FOne13GrayV2} id={buttonLabelId}>{label}</span>
    </button>
  );
}
ButtonCheck.defaultProps = {
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
};
ButtonCheck.propTypes = {
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
};
export { BUTTON_TYPE };

export default Radium(ButtonCheck);
