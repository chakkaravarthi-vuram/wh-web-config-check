import React, { useContext } from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import ThemeContext from '../../../hoc/ThemeContext';

import styles from './ButtonSwitch.module.scss';
import gClasses from '../../../scss/Typography.module.scss';

import { BS } from '../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function ButtonSwitch(props) {
  const { optionList, selectedValue, onClick, isDataLoading, className, buttonClass, fillColor } = props;
  const { buttonColor } = useContext(ThemeContext);
  const onClickHandler = (value) => {
    if (onClick) {
      onClick(value);
    }
  };

  const radioOptionList = optionList.map((option) => {
    let selectedClass = null;
    let buttonStyle = null;
    if (option.value === selectedValue) {
      selectedClass = styles.SelectedButton;
      buttonStyle = {
        backgroundColor: fillColor || buttonColor,
      };
    } else {
      buttonStyle = {
        color: buttonColor,
      };
    }
    const radioView = (
      <button
        className={cx(
          styles.DefaultButton,
          gClasses.ClickableElement,
          gClasses.CursorPointer,
          selectedClass,
          gClasses.FTwo13,
          gClasses.FontWeight500,
          !selectedValue && styles.ButtonBorder,
          buttonClass,
        )}
        onClick={() => onClickHandler(option.value)}
        key={option.value}
        style={{ ...buttonStyle, borderColor: buttonColor }}
      >
        {option.label}
      </button>
    );
    return (
        isDataLoading ? (
          <div className={gClasses.MB15}>
            <Skeleton />
          </div>
        ) : (
          radioView
        )
    );
  });

  return (
    <div
      className={cx(BS.D_FLEX, styles.Container, className)}
      style={{ borderColor: buttonColor }}
    >
      {radioOptionList}
    </div>
  );
}
export default ButtonSwitch;

ButtonSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  optionList: PropTypes.arrayOf(PropTypes.any),
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
  isDataLoading: PropTypes.bool,
};

ButtonSwitch.defaultProps = {
  optionList: [],
  selectedValue: EMPTY_STRING,
  onClick: null,
  isDataLoading: false,
};
