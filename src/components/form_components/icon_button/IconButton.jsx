import React, { useContext } from 'react';
import cx from 'classnames';
import Radium from 'radium';
import propTypes from 'prop-types';

import ThemeContext from '../../../hoc/ThemeContext';

import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { BS, COLOR_CONSTANTS } from '../../../utils/UIConstants';

import styles from './IconButton.module.scss';
import gClasses from '../../../scss/Typography.module.scss';

function IconButton(props) {
  const { buttonColor } = useContext(ThemeContext);
  const {
    id,
    onClick,
    disabled,
    className,
    children,
    onMouseDown,
    onBlur,
    style,
    isDataLoading,
    testId,
    type,
    isStrokeIcon,
    isSelected,
  } = props;
  const cursor = disabled ? null : gClasses.CursorPointer;
  let buttonStyles = null;
  let styledIcon = null;

  if (type === 1) {
    buttonStyles = {
      borderColor: buttonColor,
      [BS.HOVER]: {
        backgroundColor: buttonColor,
      },
    };
    if (isSelected) buttonStyles.backgroundColor = buttonColor;
    const iconStyles1 = isStrokeIcon
      ? {
          stroke: buttonColor,
          fill: isStrokeIcon ? COLOR_CONSTANTS.WHITE : null,
          ...style,
        }
      : { fill: buttonColor, ...style };
    const iconStyles2 = isStrokeIcon
      ? {
          stroke: COLOR_CONSTANTS.WHITE,
          fill: isStrokeIcon ? buttonColor : null,
          ...style,
        }
      : {
          fill: COLOR_CONSTANTS.WHITE,
          ...style,
        };
    styledIcon = (
      <>
        <div
          className={cx(styles.ButtonText)}
          style={isSelected ? iconStyles2 : iconStyles1}
        >
          {children}
        </div>
        <div className={cx(styles.ButtonTextOnHover)} style={iconStyles2}>
          {children}
        </div>
      </>
    );
  }

  return (
    !isDataLoading && (
        <button
          id={id}
          onClick={onClick}
          disabled={disabled}
          className={cx(
            styles.Container,
            className,
            cursor,
            gClasses.CenterVH,
            gClasses.ClickableElementV4,
          )}
          style={buttonStyles}
          onMouseDown={onMouseDown}
          onBlur={onBlur}
          data-test={testId}
        >
          {styledIcon}
        </button>
      )
  );
}

IconButton.defaultProps = {
  type: 1,
  onClick: null,
  id: null,
  className: null,
  disabled: false,
  onMouseDown: null,
  onBlur: null,
  style: null,
  isDataLoading: false,
  testId: EMPTY_STRING,
  isStrokeIcon: false,
};
IconButton.propTypes = {
  onClick: propTypes.func,
  id: propTypes.string,
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
    propTypes.string,
  ]).isRequired,
  className: propTypes.string,
  disabled: propTypes.bool,
  onMouseDown: propTypes.func,
  onBlur: propTypes.func,
  style: propTypes.string,
  isDataLoading: propTypes.bool,
  testId: propTypes.string,
  type: propTypes.number,
  isStrokeIcon: propTypes.bool,
};

export default Radium(IconButton);
