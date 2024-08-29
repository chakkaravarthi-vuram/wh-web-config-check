/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react';
import cx from 'classnames';
import Radium from 'radium';
import propTypes from 'prop-types';

import { BUTTON_TYPE } from '../../../utils/Constants';
import styles from './Button.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import { getButtonStyle } from '../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { BS } from '../../../utils/UIConstants';
import { LeftArrowIcon, RightArrowIcon } from '../../../assets/icons/DirectionArrows';

function Button(props) {
  const {
    id,
    onClick,
    disabled,
    className,
    children,
    buttonType,
    onMouseDown,
    onMouseOver,
    onMouseLeave,
    onBlur,
    style,
    isDataLoading,
    testId,
    // autoFocus,
    width100,
    toolTip,
    secondaryButtonColor,
    nextArrow,
    previousArrow,
    primaryButtonStyle,
    directionIconStyle,
    ariaLabel,
    tabIndex,
    buttonRef,
    onKeyDown,
    removePadding,
    icon = null,
  } = props;
  const { buttonTextClass, primaryButtonTypeStyle, secondaryButtonTypeStyle, buttonStyle } = getButtonStyle(
    buttonType,
    primaryButtonStyle,
    style,
    disabled,
  );
  console.log('secondaryButtonColor', secondaryButtonColor);
  const cursor = disabled ? cx(gClasses.CursorDefault, gClasses.NoPointerEvent) : gClasses.CursorPointer;
  const buttonWidthStyle = width100 ? BS.W100 : BS.W_AUTO;
  return (
      !isDataLoading && (
        <button
          id={id}
          onClick={onClick}
          disabled={disabled}
          className={cx(
            // styles.Button,
            className,
            primaryButtonTypeStyle,
            secondaryButtonTypeStyle,
            buttonTextClass,
            cursor,
            buttonWidthStyle,
            disabled && styles.DefaultPrimaryDisabledButton,
            removePadding && styles.removePadding,
          )}
          style={buttonStyle}
          onMouseDown={onMouseDown}
          onBlur={onBlur}
          data-test={testId}
          // autoFocus={autoFocus}
          title={toolTip}
          aria-label={ariaLabel}
          tab-index={tabIndex}
          onMouseEnter={onMouseOver}
          onMouseLeave={onMouseLeave}
          ref={buttonRef}
          onKeyDown={onKeyDown}
        >
          {icon}
          {previousArrow && <LeftArrowIcon className={cx(gClasses.MR5, styles.DirectionIcon)} style={directionIconStyle} isButtonColor={buttonType === BUTTON_TYPE.SECONDARY} />}
          {children}
          {nextArrow && <RightArrowIcon className={cx(gClasses.ML5, styles.DirectionIcon)} isButtonColor={buttonType === BUTTON_TYPE.SECONDARY} />}
        </button>
      )
  );
}

Button.defaultProps = {
  buttonType: BUTTON_TYPE.PRIMARY,
  onClick: null,
  id: null,
  className: null,
  disabled: false,
  onMouseDown: null,
  onBlur: null,
  style: null,
  secondaryButtonColor: null,
  primaryButtonStyle: null,
  isDataLoading: false,
  testId: EMPTY_STRING,
  toolTip: EMPTY_STRING,
  autoFocus: false,
  width100: false,
  nextArrow: false,
  previousArrow: false,
  directionIconStyle: null,
};
Button.propTypes = {
  onClick: propTypes.func,
  buttonType: propTypes.string,
  id: propTypes.string,
  children: propTypes.oneOfType([propTypes.arrayOf(propTypes.node), propTypes.node, propTypes.string]).isRequired,
  className: propTypes.string,
  disabled: propTypes.bool,
  onMouseDown: propTypes.func,
  onBlur: propTypes.func,
  style: propTypes.string,
  secondaryButtonColor: propTypes.string,
  primaryButtonStyle: propTypes.string,
  isDataLoading: propTypes.bool,
  testId: propTypes.string,
  toolTip: propTypes.string,
  autoFocus: propTypes.bool,
  width100: propTypes.bool,
  nextArrow: propTypes.bool,
  previousArrow: propTypes.bool,
  directionIconStyle: propTypes.string,
};
export { BUTTON_TYPE };

export default Radium(Button);
