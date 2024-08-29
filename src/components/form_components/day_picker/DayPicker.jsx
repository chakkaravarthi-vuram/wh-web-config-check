import React, { useContext } from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import propTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ThemeContext from '../../../hoc/ThemeContext';

import Label from '../label/Label';
import HelperMessage, { HELPER_MESSAGE_TYPE } from '../helper_message/HelperMessage';

import gClasses from '../../../scss/Typography.module.scss';
import styles from './DayPicker.module.scss';
import DAY_LIST from './DayPicker.strings';
import { BS } from '../../../utils/UIConstants';
import { hexToRgbA, keydownOrKeypessEnterHandle } from '../../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function DayPicker(props) {
  const { buttonColor } = useContext(ThemeContext);
  const opacity = 0.5;
  const alphaButtonColor = hexToRgbA(buttonColor, opacity);
  const { t } = useTranslation();
  const dayList = DAY_LIST(t).map((day) => {
    let isDaySelected = false;
    const { selectedDays, dayPickerBoxStyles, onDayClick } = props;
    if (selectedDays) {
      isDaySelected = selectedDays.some((selectedDay) => day.VALUE === selectedDay);
    }
    const dayBoxClass = cx(styles.DayBox, gClasses.FOne13GrayV5, gClasses.CursorPointer, {
      [styles.SelectedDayBox]: !!isDaySelected,
    });
    console.log('Daypicker days', selectedDays);
    return (
      <li key={day.VALUE} title={day.TITLE}>
      <div
        className={cx(dayBoxClass, dayPickerBoxStyles)}
        onClick={() => onDayClick(day.VALUE)}
        role="checkbox"
        aria-checked={isDaySelected}
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onDayClick(day.VALUE)}
        // id={day.VALUE}
        tabIndex={0}
        aria-label={day.TITLE}
      >
        <div
          className={styles.Box}
          style={{
            backgroundColor: alphaButtonColor,
            borderColor: buttonColor,
          }}
        />
        {day.LABEL}
      </div>
      </li>
    );
  });
  const { isDataLoading, label, errorMessage, id, hideLabel } = props;
  return (
    <>
      { !hideLabel && <Label labelFor={id} isDataLoading={isDataLoading} content={label} hideLabelClass />}
      {isDataLoading ? (
        <Skeleton height="31px" />
      ) : (
        <div>
          <ul
          id={id}
            className={cx(
              styles.DayPickerContainer,
              BS.D_FLEX,
              gClasses.InputBorder,
              gClasses.InputBorderRadius,
            )}
          >
            {dayList}
          </ul>
        </div>
      )}
      {errorMessage &&
      <HelperMessage
        type={HELPER_MESSAGE_TYPE.ERROR}
        message={errorMessage}
        className={cx(gClasses.ErrorMarginV1)}
      />
      }
    </>
  );
}
export default DayPicker;
DayPicker.defaultProps = {
  errorMessage: null,
  label: EMPTY_STRING,
  onDayClick: null,
  selectedDays: [],
  isDataLoading: false,
};

DayPicker.propTypes = {
  errorMessage: propTypes.string,
  onDayClick: propTypes.func,
  selectedDays: propTypes.arrayOf(propTypes.number),
  label: propTypes.string,
  isDataLoading: propTypes.bool,
};
