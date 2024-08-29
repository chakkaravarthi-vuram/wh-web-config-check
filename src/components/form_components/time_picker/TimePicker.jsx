import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import gClasses from '../../../scss/Typography.module.scss';
import { INPUT_TYPES, BS } from '../../../utils/UIConstants';
import styles from './TimePicker.module.scss';
import { KEY_CODES } from '../../../utils/Constants';
import jsUtils from '../../../utils/jsUtility';
import dropDownStyles from '../dropdown/dropdown_list/DropdownList.module.scss';
import Label from '../label/Label';
import HelperMessage, { HELPER_MESSAGE_TYPE } from '../helper_message/HelperMessage';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

function TimePicker(props) {
  const {
    id,
    label,
    errorMessage,
    hideMessage,
    hideLabel,
    message,
    isRequired,
    onChange,
    placeholder,
    value,
    readOnly,
  } = props;
  const minutesInputRef = React.createRef();

  let hour = 0;
  let minute = 0;

  if (!Number.isNaN(value.hour) && value.hour < 24) {
    hour = parseInt(value.hour, 10);
  }

  if (!Number.isNaN(value.minute) && value.minute < 60) {
    minute = parseInt(value.minute, 10);
  }

  const concatZero = (valueParam) => (valueParam < 10 ? '0'.concat(valueParam) : valueParam);

  const onHourChange = (e) => {
    let time = null;
    if (!Number.isNaN(parseInt(e.target.value, 10)) && e.target.value < 24) {
      time = { hour: parseInt(e.target.value, 10), minute };
      onChange(time);
    } else if (jsUtils.isEmpty(e.target.value)) {
      time = { hour: 0, minute };
      onChange(time);
    }
  };

  const onMinuteChange = (e) => {
    let time = null;
    if (!Number.isNaN(e.target.value) && e.target.value < 60) {
      time = { hour, minute: parseInt(e.target.value, 10) };
      onChange(time);
    } else if (jsUtils.isEmpty(e.target.value)) {
      time = { hour, minute: 0 };
      onChange(time);
    }
  };

  const getMinute = (minuteParam) => {
    const time = { target: { value: minuteParam } };
    onMinuteChange(time);
  };

  const getHour = (hourParam) => {
    const time = { target: { value: hourParam } };
    onHourChange(time);
  };

  const hourList = new Array(24).fill().map((data, index) => {
    const hourValue = concatZero(index);
    // const isActiveHour = hour === index;
    return (
      <button
        // ref={isActiveHour ? hourRef : null}
        className={cx(
          gClasses.CursorPointer,
          dropDownStyles.Option,
          gClasses.FOne13BlackV1,
          gClasses.ClickableElement,
          BS.D_BLOCK,
          BS.W100,
          // isActiveHour ? dropDownStyles.SelectedBg : null,
        )}
        onMouseDown={() => getHour(hourValue)}
      >
        {hourValue}
      </button>
    );
  });
  const minutesList = [0, 15, 30, 45].map((data) => {
    // const isActiveMinute = minute === index;
    const minuteValue = data;
    return (
      <button
        // ref={isActiveMinute ? minuteRef : null}
        className={cx(
          gClasses.CursorPointer,
          dropDownStyles.Option,
          gClasses.FOne13BlackV1,
          gClasses.ClickableElement,
          BS.D_BLOCK,
          BS.W100,
          // isActiveMinute ? dropDownStyles.SelectedBg : null,
        )}
        onMouseDown={() => getMinute(minuteValue)}
      >
        {minuteValue}
      </button>
    );
  });

  const onHourKeyDown = (e) => {
    if (e.keyCode === KEY_CODES.ENTER) {
      getHour(hour);
      if (minutesInputRef && minutesInputRef.current) {
        minutesInputRef.current.focus();
      }
    } else if (e.keyCode === KEY_CODES.UP_ARROW) {
      e.preventDefault();
      getHour((((hour - 1) % 24) + 24) % 24);
    } else if (e.keyCode === KEY_CODES.DOWN_ARROW) {
      e.preventDefault();
      getHour((((hour + 1) % 24) + 24) % 24);
    }
  };
  const onMinuteKeyDown = (e) => {
    if (e.keyCode === KEY_CODES.ENTER) {
      getMinute(minute);
      minutesInputRef.current.blur();
    } else if (e.keyCode === KEY_CODES.UP_ARROW) {
      e.preventDefault();
      getMinute((((minute - 1) % 60) + 60) % 60);
      // focusHourMinRef();
    } else if (e.keyCode === KEY_CODES.DOWN_ARROW) {
      // e.preventDefault();
      getMinute((((minute + 1) % 60) + 60) % 60);
      // focusHourMinRef();
    }
  };

  let timePickerMessage = null;
  let textBorder = gClasses.InputBorder;
  if (errorMessage) {
    timePickerMessage = errorMessage;
    textBorder = cx(gClasses.ErrorInputBorder, styles.Error);
  } else if (message) {
    timePickerMessage = message;
  }

  // setting id for label and helper message
  const labelId = `${id}_label`;
  const messageId = `${id}_message`;
  let labelComponent = null;
  let messageComponent = null;
  if (!hideMessage) {
    messageComponent = (
      <HelperMessage
        message={timePickerMessage}
        type={HELPER_MESSAGE_TYPE.ERROR}
        id={messageId}
        className={gClasses.ErrorMarginV1}
      />
    );
  }
  if (!hideLabel) {
    labelComponent = <Label content={label} labelFor={id} id={labelId} isRequired={isRequired} />;
  }

  return (
    <>
      {labelComponent}
      <div className={cx(textBorder, gClasses.InputBorderRadius, styles.Container, BS.D_FLEX)}>
        <div className={BS.P_RELATIVE}>
          <input
            type={INPUT_TYPES.TEXT}
            className={cx(styles.HourContainer, gClasses.BorderLessInput, gClasses.FOne13BlackV1)}
            onKeyDown={onHourKeyDown}
            onChange={onHourChange}
            value={hour}
            placeholder={placeholder.hour}
            readOnly={readOnly}
          />
          <div className={dropDownStyles.DropdownContainer}>
            <ul className={cx(styles.HoursDd, gClasses.ScrollBar, dropDownStyles.OptionList)}>
              {hourList}
            </ul>
          </div>
        </div>
        <div className={BS.P_RELATIVE}>
          <input
            type={INPUT_TYPES.TEXT}
            className={cx(
              gClasses.BorderLessInput,
              styles.MinutesContainer,
              gClasses.FOne13BlackV1,
            )}
            ref={minutesInputRef}
            onKeyDown={onMinuteKeyDown}
            onChange={onMinuteChange}
            value={minute}
            placeholder={placeholder.hour}
            readOnly={readOnly}
          />
          <div className={dropDownStyles.DropdownContainer}>
            <ul className={cx(styles.MinutesDd, gClasses.ScrollBar, dropDownStyles.OptionList)}>
              {minutesList}
            </ul>
          </div>
        </div>
      </div>
      {messageComponent}
    </>
  );
}
export default TimePicker;

TimePicker.propTypes = {
  errorMessage: PropTypes.string,
  message: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  placeholder: PropTypes.shape({
    hour: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minute: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  value: PropTypes.shape({
    hour: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    minute: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  hideMessage: PropTypes.bool,
  hideLabel: PropTypes.bool,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

TimePicker.defaultProps = {
  errorMessage: EMPTY_STRING,
  message: EMPTY_STRING,
  id: null,
  label: EMPTY_STRING,
  readOnly: false,
  placeholder: { hour: '00', minute: '00' },
  hideMessage: false,
  hideLabel: false,
  isRequired: false,
  value: {
    hour: 0,
    minute: 0,
  },
};
