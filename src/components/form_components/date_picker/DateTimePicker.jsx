import React, { useState, useEffect, useContext, forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import DatePicker from 'react-datepicker';
import Skeleton from 'react-loading-skeleton';
import propTypes from 'prop-types';
import moment from 'moment-business-days';

import { DATE, KEY_CODES, KEY_NAMES } from 'utils/Constants';
import gClasses from 'scss/Typography.module.scss';
import { isArray, isEmpty, map, isEqual, safeTrim, upperCase } from 'utils/jsUtility';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import { ACTION_STRINGS, EMPTY_STRING, SPACE } from 'utils/strings/CommonStrings';
import DATE_FORMAT from 'utils/constants/dateFormat.constant';
import { keydownOrKeypessEnterHandle, trimString } from 'utils/UtilityFunctions';
import { parse12HoursTimeFromUTC, parse12HrsTimeto24HoursTime } from 'utils/dateUtils';
import { ICON_STRINGS } from 'containers/sign_in/SignIn.strings';
import CalendarIcon from 'assets/icons/CalendarIcon';
import { getDatePickerRange, getDatePickerRangeForCalender, getFormattedWokingDaysArray, getHolidays, getHolidaysToUpdateMoment } from 'utils/formUtils';
import ThemeContext from 'hoc/ThemeContext';
import 'react-datepicker/dist/react-datepicker.css';
import './ReactDatePicker.scss';
import { DATE_PLACEHOLDER, DEFAULT_LOCALE, MONTH_PLACEHOLDER, YEAR_PLACEHOLDER } from 'components/form_components/date_picker/DataPicker.strings';
import CalendarHeader from 'components/form_components/date_picker/calendar_header/CalendarHeader';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import { DIGITS_REGEX } from 'utils/strings/Regex';
import CloseIconNew from 'assets/icons/CloseIconNew';
import styles from './DatePicker.module.scss';
import Label from '../label/Label';
import HelperMessage from '../helper_message/HelperMessage';
import HELPER_MESSAGE_TYPE from '../helper_message/HelperMessage.strings';
import { isTimeValid } from './DatePicker.utils';
import Modal from '../modal/Modal';
import { store } from '../../../Store';

export const WORKING_WEEK_DAYS = [0, 1, 2, 3, 4, 5, 6];
const CustomInput = forwardRef((props) => {
  const { onClick, readOnly, disabled, buttonColor, referenceName, iconClassName, calenderIconRef } = props;
  return (
    <div onClick={onClick} className={styles.calendervisible} aria-label="Date picker" tabIndex={-1} role="button" onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick()} ref={calenderIconRef}>
    <CalendarIcon
      title={ICON_STRINGS.CALENDAR_ICON}
      style={{ fill: buttonColor }}
      tabIndex={-1}
      role="button"
      ariaLabel="Date picker"
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick()}
      onClick={onClick}
      className={cx(
        gClasses.DisplayNone,
        !readOnly && gClasses.CursorPointer,
        !disabled && gClasses.CursorPointer,
        styles.TransparentBtn,
        BS.ML_AUTO,
        iconClassName,
      )}
      hideLabel
      referenceName={referenceName}
    />
    </div>
  );
});
function ReactDatePicker(props) {
  const context = useContext(ThemeContext);
  const state = store.getState();
  const prefLocale = state?.UserPreferenceReducer.pref_locale;
  const holidaysMainList = state?.HolidayListReducer.holiday_list;

  const {
    date,
    getDate,
    showClearButton,
    enableTime,
    placeholder,
    isDataLoading,
    className,
    hideLabel,
    label,
    id,
    isRequired,
    helperTooltipMessage,
    helperToolTipId,
    labelClassName,
    labelClass,
    labelFontClass,
    fieldTypeInstruction,
    editIcon,
    deleteIcon,
    hideMessage,
    helperMessageClass,
    errorMessage,
    readOnly,
    disabled,
    disableClass,
    referenceName,
    instructionMessage,
    instructionClass,
    innerClassName,
    workingDaysOnly,
    workingDays,
    validations,
    isTable,
    iconClassName,
    inputAriaLabelledBy,
    noAriaLabelledBy,
    showReset = false,
    buttonColor = context?.buttonColor,
  } = props;
  const { t } = useTranslation();
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [meridiem, setMeridiem] = useState('');
  const [time, setTime] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [calendarFocused, setCalendarFocusStatus] = useState(false);
  const [workingDaysArrary, setWorkingDays] = useState(WORKING_WEEK_DAYS);
  const [holidayList, setHolidayList] = useState([]);
  const [validationsData, setValidationsData] = useState(validations);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  //
  const [minDateValue, setMinDateValue] = useState('');
  const [maxDateValue, setMaxDateValue] = useState('');
  const [includeDates, setIncludeDates] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const calenderIconRef = useRef(null);
  const calenderIconRef2 = useRef(null);
  const datePickerRef = useRef(null);

  const helperMessageId = `${id}_helper_message`;
  const labelId = `${id}_label`;
  let selectedDate = EMPTY_STRING;
  if (moment.utc(date, moment.ISO_8601, true).isValid()) {
    const momentString = moment.utc(date, moment.ISO_8601).format(DATE.DATE_FORMAT);
    selectedDate = new Date(momentString);
    selectedDate.setHours(selectedHour, selectedMinute, 0);
  }
  const inputTextStyle = cx(
    gClasses.FOne13BlackV1,
    styles.ReadOnly,
    disabled && disableClass,
  );
  const calendarClass = cx(
    styles.CalendarContainer,
    enableTime ? styles.CalendarContainerWidth : null,
  );
  const getDatePickerProps = async () => {
    const { validations } = props;
    const formattedProps = await getDatePickerRange({
      date,
      readOnly,
      validations,
      workingDaysArray: workingDays,
      isEnableTime: enableTime,
      t,
    });
    setMinDateValue(formattedProps.minDate);
    setMaxDateValue(formattedProps.maxDate);
    setIncludeDates(formattedProps.includeDates);
    if (workingDaysOnly) {
      const holidays = getHolidays(holidaysMainList);
      setHolidayList(holidaysMainList);
      moment.updateLocale('us', {
        workingWeekdays: workingDaysArrary,
        holidays: holidays,
        holidayFormat: DATE.DATE_FORMAT,
      });
    }
  };
  const dateSwitch = (e) => {
    e.stopPropagation();
    const { target } = e;
    const { maxLength } = target;
    const myLength = target?.value?.length;
    const { code } = e;
    if (code === KEY_NAMES.TAB || code === KEY_CODES.SHIFT_LEFT || code === KEY_CODES.SHIFT_RIGHT) {
      return;
    }
    if (myLength >= maxLength) {
      let next = target?.nextElementSibling;
      while (next) {
        if (next.tagName.toLowerCase() === 'input') {
          next.focus();
          break;
        }
        next = next.nextElementSibling;
        if (next == null) break;
      }
    } else if (myLength === 0 && code === KEY_CODES.BACK_SPACE) {
      let previous = target?.previousElementSibling;
      while (previous) {
        if (previous == null) break;
        if (previous.tagName.toLowerCase() === 'input') {
          previous.focus();
          break;
        }
        previous = previous.previousElementSibling;
      }
    }
  };
  const preProcessDate = (_date) => {
    const input = trimString(_date);
    return input.replace(DIGITS_REGEX, '');
  };

  const getMaxDate = () => {
    const maxDate = month.length > 0 ?
    ((!isEmpty(year) && moment(year, 'YYYY').isValid()) ?
      moment(`${year}-${month}`, 'YYYY-MM').daysInMonth() : moment(month, 'MM').daysInMonth())
    : 31;
    return maxDate;
  };

  const getDateHandler = (dateString, timeString) => {
    const { getDate } = props;
    if (getDate) {
      const formattedDateTimeString = `${dateString}T${parse12HrsTimeto24HoursTime(timeString)}:00`;
      console.log(formattedDateTimeString, 'formattedDateTimeString formattedDateTimeString');
      if (enableTime) {
        let formattedTimeString;
        if ((typeof timeString === 'string' && timeString.length === 8) && moment(timeString, DATE.TIME_FORMAT, true).isValid()) {
          formattedTimeString = `${parse12HrsTimeto24HoursTime(timeString)}:00`;
        } else {
          formattedTimeString = timeString;
        }
        if (isEmpty(dateString) && isEmpty(formattedTimeString)) {
          getDate(EMPTY_STRING);
        } else if (!isEmpty(dateString)) {
          if (!isEmpty(timeString)) getDate(`${dateString}T${formattedTimeString}`);
          else getDate(`${dateString}T`);
        } else {
           getDate(EMPTY_STRING);
        }
      } else {
        getDate(dateString);
      }
    }
  };

  const onSelectDate = (date) => {
    date = date.toString().slice(0, 24);
    const dateString = moment.utc(date).format(DATE.DATE_FORMAT);

    if (enableTime) {
      const utcTime = date.toString().slice(16, 24);
      setSelectedHour(Number(utcTime.slice(0, 2)));
      setSelectedMinute(Number(utcTime.slice(3, 5)));
      const timeString = moment(utcTime, ['HH:mm']).format('hh:mm A');
      setTime(timeString);
      setHour(timeString.slice(0, 2));
      setMinute(timeString.slice(3, 5));
      setMeridiem(timeString.slice(6, 8));
      getDateHandler(dateString, timeString);
    } else {
      getDate(dateString);
    }
  };

  const onYearBlurHandler = (event) => {
    let userInput = preProcessDate(event?.target?.value);
    const minYear = minDateValue ? moment(minDateValue).year() : 1900;
    const maxYear = maxDateValue ? moment(maxDateValue).year() : 2100;
    if (userInput === EMPTY_STRING) userInput = EMPTY_STRING;
    else if (userInput.length < 4 || Number(userInput) < minYear) userInput = minYear;
    else if (Number(userInput) > maxYear) userInput = maxYear;
    if (inputDate && month) {
      const maxDate = getMaxDate();
      if (inputDate > maxDate) setInputDate(maxDate);
    }
    if (userInput || inputDate || month) getDateHandler(`${userInput}-${month}-${inputDate}`, time);
    else getDateHandler(EMPTY_STRING, time);
    setYear(userInput);
  };

  const onYearChangeHandler = (event) => {
    let userInput = preProcessDate(event?.target?.value);
    if (userInput === EMPTY_STRING) userInput = EMPTY_STRING;
    if (userInput || inputDate || month) getDateHandler(`${userInput}-${month}-${inputDate}`, time);
    else getDateHandler(EMPTY_STRING, time);
    setYear(userInput);
  };

  const onMonthChangeHandler = (event) => {
    let userInput = preProcessDate(event?.target?.value);
    if (Number(userInput) > 1 && userInput.length < 2) userInput = `0${userInput}`;
    if (userInput.length === 2 && Number(userInput) > 12) userInput = `0${userInput.charAt(1)}`;
    if (userInput || year || inputDate) getDateHandler(`${year}-${userInput}-${inputDate}`, time);
    else getDateHandler(EMPTY_STRING, time);
    setMonth(userInput);
  };

  const onMonthBlurHandler = (event) => {
    const userInput = preProcessDate(event?.target?.value);
    if ((userInput.length === 1 || Number(userInput) === 0) && [0, 1].includes(Number(userInput))) setMonth('01');
    if (userInput === EMPTY_STRING) setMonth(EMPTY_STRING);
    if (inputDate) {
      const maxDate = getMaxDate();
      if (inputDate > maxDate) setInputDate(maxDate);
    }
    if (year || inputDate || month) getDateHandler(`${year}-${month}-${inputDate}`, time);
    else getDateHandler(EMPTY_STRING, time);
  };

  const onInputDateChange = (event) => {
    let userInput = preProcessDate(event?.target?.value);
    const maxDate = getMaxDate();
    if (Number(userInput) > 3 && userInput.length < 2) userInput = `0${userInput}`;
    if (Number(userInput) > maxDate) userInput = `0${userInput.charAt(1)}`;
    if (month || year || userInput) getDateHandler(`${year}-${month}-${userInput}`, time);
    else getDateHandler(EMPTY_STRING, time);
    setInputDate(userInput);
  };

  const onInputDateBlurHandler = (event) => {
    let userInput = preProcessDate(event?.target?.value);
    if (userInput.length === 1) {
      if ([0, 1].includes(Number(userInput))) userInput = '01';
      if (Number(userInput) === 2) userInput = '02';
    }
    if (userInput === '00') userInput = '01';
    if (year || userInput || month) getDateHandler(`${year}-${month}-${userInput}`, time);
    else getDateHandler(EMPTY_STRING, time);
    setInputDate(userInput);
  };
  const onTimeChangeHandler = () => {
    const currentTime = `${hour}:${minute} ${meridiem}`;
    // if (moment(currentTime, 'LT', true).isValid()) {
    const timeString = parse12HrsTimeto24HoursTime(currentTime);
    setTime(currentTime);
    setSelectedHour(Number(timeString.slice(0, 2)));
    setSelectedMinute(Number(timeString.slice(3, 5)));
    if (year || inputDate || month) getDateHandler(`${year}-${month}-${inputDate}`, currentTime);
    // }
  };

  const onHourChangeHandler = (event) => {
    let userInput = preProcessDate(event?.target?.value);
    if (Number(userInput) > 1 && userInput.length < 2) userInput = `0${userInput}`;
    if (userInput.length === 2 && Number(userInput) > 12) userInput = `0${userInput.charAt(1)}`;
    if (userInput === EMPTY_STRING) userInput = EMPTY_STRING;
    setHour(userInput);
    onTimeChangeHandler();
  };
  const onHourBlurHandler = (event) => {
    let userInput = preProcessDate(event?.target?.value);
    if (Number(userInput) === 1) userInput = '01';
    if (['0', '00'].includes(userInput)) userInput = '12';
    if (userInput === EMPTY_STRING) userInput = EMPTY_STRING;
    setHour(userInput);
    onTimeChangeHandler();
  };
  const onMinuteChangeHandler = (event) => {
    let userInput = preProcessDate(event?.target?.value);
    if (userInput.length === 1 && Number(userInput) > 5) userInput = `0${userInput}`;
    setMinute(userInput);
    onTimeChangeHandler();
  };
  const onMinuteBlurHandler = (event) => {
    const userInput = preProcessDate(event?.target?.value);
    if (userInput.length === 1) setMinute(`0${userInput}`);
    onTimeChangeHandler();
  };
  const onMeridianKeyDownHandler = (event) => {
    if (event.keyCode === KEY_CODES.BACKSPACE) setMeridiem('');
    if ([KEY_CODES.UP_ARROW, KEY_CODES.DOWN_ARROW].includes(event.keyCode)) {
      setMeridiem(meridiem === 'AM' ? 'PM' : 'AM');
    }
    onTimeChangeHandler();
  };
  const onMeridiemChangeHandler = (event) => {
    const userInput = event?.target?.value;
    if (['a', 'A'].includes(userInput)) setMeridiem('AM');
    if (['p', 'P'].includes(userInput)) setMeridiem('PM');
    onTimeChangeHandler();
  };
  const timeInputComponent = () => {
    const timeSeparator = ':';
    const timeFormatString = 'hh:mm:a';
    const timeFormat = timeFormatString.split(timeSeparator);
    return (
        <>
        {' '}
          {map(timeFormat, (eachFormat, index) => {
            const ariaLabelledBy = `${index === 0 ? inputAriaLabelledBy || labelId : EMPTY_STRING}${errorMessage ? SPACE + helperMessageId : EMPTY_STRING}`;
            let inputClassName;
            let onInputTimeChangeHandler;
            let onTimeInputBlurHandler;
            let size;
            let inputPlaceholder;
            let value;
            let width;
            let paddingLeft;
            const textAlign = 'center';
            if (index === 0) {
              inputClassName = cx(
                inputTextStyle,
                styles.InputTextStyle,
              );
            } else if (index === 1) {
              inputClassName = cx(
                inputTextStyle,
                styles.InputTextStyle,
              );
            } else {
              inputClassName = cx(
                inputTextStyle,
                styles.InputTextStyle,
              );
            }
            if (eachFormat === 'hh') {
              value = hour;
              width = '16px';
              onInputTimeChangeHandler = onHourChangeHandler;
              onTimeInputBlurHandler = onHourBlurHandler;
              inputPlaceholder = 'hh';
              size = 2;
            }
            if (eachFormat === 'mm') {
              value = minute;
              width = '21px';
              onInputTimeChangeHandler = onMinuteChangeHandler;
              onTimeInputBlurHandler = onMinuteBlurHandler;
              inputPlaceholder = 'mm';
              size = 2;
            }
            if (eachFormat === 'a') {
              value = meridiem;
              width = '20px';
              onInputTimeChangeHandler = onMeridiemChangeHandler;
              onTimeInputBlurHandler = onTimeChangeHandler;
              inputPlaceholder = 'a';
              size = 2;
            }
            return (
              <>
                <input
                  onChange={onInputTimeChangeHandler}
                  onKeyDown={eachFormat === 'a' ?
                  onMeridianKeyDownHandler
                    : null
                  }
                  onBlur={onTimeInputBlurHandler}
                  placeholder={inputPlaceholder}
                  className={cx(
                    inputClassName,
                    errorMessage ? styles.ErrorMessage : null,
                    styles.inputNum,
                    gClasses.P0,
                    index === 0 ? gClasses.ML5 : null,
                  )}
                  autoComplete={ACTION_STRINGS.OFF}
                  value={value}
                  readOnly={readOnly}
                  disabled={disabled}
                  size={size}
                  maxLength={eachFormat.length}
                  tabIndex={readOnly || disabled ? -1 : 0}
                  style={{ width, paddingLeft, textAlign }}
                  ui-auto={referenceName}
                  aria-labelledby={index === 0 || errorMessage ? ariaLabelledBy : null}
                  aria-required={isRequired ? 'true' : 'false'}
                />
                {index === 0 ?
                  <span className={cx(gClasses.CenterV, styles.DashSpan)}>:</span>
                  : null
                }
              </>
            );
          })}
        </>
    );
  };
  const dateInputComponent = () => {
    const locale = DATE_FORMAT[prefLocale] || DEFAULT_LOCALE;
    if (locale) {
      const { separator } = locale;
      const format = locale.dateFormat.split(separator);
      return (
        <>
          {' '}
          {map(format, (eachFormat, index) => {
            const ariaLabelledBy = `${index === 0 ? inputAriaLabelledBy || labelId : EMPTY_STRING}${errorMessage ? SPACE + helperMessageId : EMPTY_STRING}`;
            let inputClassName;
            let onDateChangeHandler;
            let onDateBlurHandler = null;
            let size;
            let inputPlaceholder;
            let value;
            let width;
            let paddingLeft;
            const textAlign = 'center';
            if (index === 0) {
              inputClassName = cx(
                inputTextStyle,
                styles.InputTextStyle,
                gClasses.MR5,
              );
            } else if (index === 1) {
              inputClassName = cx(
                inputTextStyle,
                styles.InputTextStyle,
                gClasses.MR5,
                gClasses.ML5,
              );
            } else {
              inputClassName = cx(
                inputTextStyle,
                styles.InputTextStyle,
                gClasses.MR10,
                gClasses.ML5,
              );
            }
            if (eachFormat === 'YYYY') {
              value = year;
              width = '34px';
              onDateChangeHandler = onYearChangeHandler;
              onDateBlurHandler = onYearBlurHandler;
              inputPlaceholder = YEAR_PLACEHOLDER;
              size = 4;
            }
            if (eachFormat === 'MM') {
              value = month;
              width = '22px';
              onDateChangeHandler = onMonthChangeHandler;
              onDateBlurHandler = onMonthBlurHandler;
              inputPlaceholder = MONTH_PLACEHOLDER;
              size = 2;
            }
            if (eachFormat === 'DD') {
              value = inputDate;
              width = '17px';
              onDateChangeHandler = onInputDateChange;
              onDateBlurHandler = onInputDateBlurHandler;
              inputPlaceholder = DATE_PLACEHOLDER;
              size = 2;
            }
            return (
              <>
                <input
                  onChange={onDateChangeHandler}
                  placeholder={inputPlaceholder}
                  className={cx(
                    inputClassName,
                    errorMessage ? styles.ErrorMessage : null,
                    gClasses.MX0,
                    styles.inputNum,
                    gClasses.P0,
                  )}
                  autoComplete={ACTION_STRINGS.OFF}
                  value={value}
                  readOnly={readOnly}
                  disabled={disabled}
                  size={size}
                  maxLength={eachFormat.length}
                  tabIndex={readOnly || disabled ? -1 : 0}
                  onBlur={onDateBlurHandler}
                  style={{ width, paddingLeft, textAlign }}
                  // hideMessage={!errorMessage}
                  ui-auto={referenceName}
                  aria-labelledby={index === 0 || errorMessage ? ariaLabelledBy : null}
                  aria-required={isRequired ? 'true' : 'false'}
                />
                {index !== 2 ? (
                  <span className={cx(gClasses.CenterV, styles.DashSpan)}>-</span>
                ) : null}
              </>
            );
          })}
        </>
      );
    }
    return null;
  };

  const onYearPickerKeydown = (e) => {
    if ((e.keyCode === KEY_CODES.TAB || e.key === KEY_NAMES.TAB) && !e.shiftKey) {
        const dropdown = document.getElementById(`combo-box-timePicker-${id}`);
        dropdown?.focus();
        datePickerRef?.current?.setOpen(false);
    }
  };

  const onPrevArrowKeydown = (e) => {
    if (e.shiftKey && (e.keyCode === KEY_CODES.TAB || e.key === KEY_NAMES.TAB)) {
    datePickerRef?.current?.setOpen(false);
    calenderIconRef2?.current?.focus();
    !enableTime && calenderIconRef?.current?.focus();
    }
  };

  const renderCustomHeader = ((props) => {
    console.log(props, 'renderCustomHeader props');
    return (
      CalendarHeader(props, onYearPickerKeydown, onPrevArrowKeydown, getDatePickerRangeForCalender({
        readOnly,
        validations,
        isEnableTime: enableTime,
      }, t)));
  });
  const updateDateState = (date) => {
    const dateTimeMoment = moment(date);
    setYear(dateTimeMoment.format('YYYY'));
    setMonth(dateTimeMoment.format('MM'));
    setInputDate(dateTimeMoment.format('DD'));
    if (enableTime) {
      setSelectedHour(Number(dateTimeMoment.format('HH')));
      setSelectedMinute(Number(dateTimeMoment.format('mm')));
      setHour(dateTimeMoment.format('hh'));
      setMinute(dateTimeMoment.format('mm'));
      setMeridiem(upperCase(dateTimeMoment.format('a')));
      const timeString = !isEmpty(date) ? date.split('T')[1] : EMPTY_STRING;
      const timeStringTrimmed = safeTrim(timeString);
      if (isEmpty(timeStringTrimmed) || (timeStringTrimmed.length < 8) || !isTimeValid(timeString)) {
        setTime(timeString);
      } else if (!isEmpty(timeStringTrimmed) && isTimeValid(timeString)) {
        console.log(timeStringTrimmed, 'timeStringTrimmed timeStringTrimmed');
        setTime(parse12HoursTimeFromUTC(date));
      }
    } else setTime(dateTimeMoment.format(DATE.TIME_FORMAT));
  };

  const [isInitialRendor, setIsInitialRender] = useState(true);
  useEffect(() => {
    setIsInitialLoad(false);
  }, []);
  useEffect(() => {
    if (date) {
      console.log(date, 'date convertedDateTimeString');
      const isDateValid = moment(date, [DATE.DATE_FORMAT, moment.ISO_8601], true).isValid();
      if (isDateValid) {
        const utcOffset = moment.parseZone(date).utcOffset(); // If utc offset presents, date is from database and it has been converted to users timezone
        if (utcOffset || (date.charAt(date.length - 1) === 'Z')) {
          const convertedDateTimeString = moment(date).utcOffset(date).format('YYYY-MM-DDTHH:mm:ss');
          console.log(convertedDateTimeString, date, 'dfsfs convertedDateTimeString', `${convertedDateTimeString}:00`);
          updateDateState(convertedDateTimeString);
          getDate(convertedDateTimeString, isInitialRendor);
        } else {
          updateDateState(date);
        }
      } else {
        if (date.includes('T')) {
          const [dateString, timeString] = date.split('T');
          if (dateString) {
            const [year, month, day] = dateString.split('-');
            setYear(year);
            setMonth(month);
            setInputDate(day);
          } else {
            setYear(EMPTY_STRING);
            setMonth(EMPTY_STRING);
            setInputDate(EMPTY_STRING);
          }
          if (timeString) {
            const timeStringTrimmed = safeTrim(timeString);
            if (!isEmpty(timeStringTrimmed) && (timeStringTrimmed.length === 8) && isTimeValid(timeString)) setTime(moment(timeString, 'HH:mm:ss').format('hh:mm A'));
            else setTime(timeString);
          } else setTime(EMPTY_STRING);
        } else {
          const { isBulkUploadPreview } = props;
          if (isBulkUploadPreview) {
            let dateFromBulkUpload = date;
            if (isArray(date)) [dateFromBulkUpload] = date;
            const formattedDate = moment(dateFromBulkUpload);
            if ((formattedDate.isValid() && isInitialLoad)) {
              const year = formattedDate.format('YYYY');
              const day = formattedDate.format('DD');
              const month = formattedDate.format('MM');
              console.log('fhjkhjkfhjkshjksdf', year, month, day);
              if (![year, month, day].includes('Invalid date')) {
                setYear(year);
                setMonth(month);
                setInputDate(day);
            }
            } else {
              const [year, month, day] = date.split('-');
              setYear(year);
              setMonth(month);
              setInputDate(day);
            }
          } else {
            const [year, month, day] = date.split('-');
            setYear(year);
            setMonth(month);
            setInputDate(day);
          }
        }
      }
    } else {
      setYear(EMPTY_STRING);
      setMonth(EMPTY_STRING);
      setInputDate(EMPTY_STRING);
      setTime(EMPTY_STRING);
      setHour(EMPTY_STRING);
      setMinute(EMPTY_STRING);
      setMeridiem(EMPTY_STRING);
    }
    if (isInitialRendor) setIsInitialRender(false);
  }, [date]);
  useEffect(() => {
    let workingWeekDays = [];
    if (workingDaysOnly) {
      if (!isEmpty(workingDays)) {
        workingWeekDays = getFormattedWokingDaysArray(workingDays);
      } else {
        workingWeekDays = WORKING_WEEK_DAYS;
      }
      setWorkingDays(workingWeekDays);
      if (!isEmpty(year) && moment(year, 'YYYY').isValid()) {
        const yearString = year.toString();
        if (yearString.length === 4) {
          getHolidaysToUpdateMoment(Number(year));
        }
      }
    }
  }, [workingDaysOnly, year]);
  useEffect(() => {
    getDatePickerProps();
  }, [disabled]);
  useEffect(() => {
    if (workingDaysOnly) {
      const holidays = getHolidays(holidaysMainList);
      setHolidayList(holidaysMainList);
      moment.updateLocale('us', {
        workingWeekdays: workingDaysArrary,
        holidays: holidays,
        holidayFormat: DATE.DATE_FORMAT,
      });
    }
  }, [workingDaysArrary, isEqual(holidaysMainList, holidayList)]);

  useEffect(() => {
    getDatePickerProps();
    setValidationsData(validations);
  }, [isEqual(validationsData, validations)]);
  const isOutSideRange = (date) => {
    date.setHours(0, 0, 0);
    date = date.toString().slice(0, 24);
    const day = moment.utc(date);
    if (workingDaysOnly) {
      const holidays = getHolidays(holidaysMainList);
      moment.updateLocale('us', {
        workingWeekdays: workingDaysArrary,
        holidays: holidays,
        holidayFormat: DATE.DATE_FORMAT,
      });
      if (!day.isBusinessDay()) return styles.DisableDay;
    }
    return null;
  };

  const popperProps =
    { allowedAutoPlacements: [POPPER_PLACEMENTS.TOP, POPPER_PLACEMENTS.BOTTOM] };
  const popperModifiers =
  [
    {
      name: 'offset',
      options: {
        offset: [0, -30],
      },
    },
  ];
  useEffect(() => {
    if (calendarFocused && enableTime) {
        const leftArrow = document.getElementById('prevArrow');
        leftArrow?.focus();
    }
}, [calendarFocused]);
  const msgContainerStyle = styles.MsgContainer3;
  const setClear = () => {
    getDate && getDate(EMPTY_STRING);
    setYear(EMPTY_STRING);
    setMonth(EMPTY_STRING);
    setInputDate(EMPTY_STRING);
    setTime(EMPTY_STRING);
    setHour(EMPTY_STRING);
    setMinute(EMPTY_STRING);
    setMeridiem(EMPTY_STRING);
  };
  return (
    <div
      className={cx(
        className,
        (readOnly || disabled) && !deleteIcon && gClasses.NoPointerEvent,
      )}
    >
      {!hideLabel && (
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <Label
            content={label}
            for={id}
            id={`${id}_label`}
            labelFor={`datePicker-${id}`}
            isRequired={isRequired}
            isDataLoading={isDataLoading}
            message={helperTooltipMessage}
            toolTipId={helperToolTipId}
            innerClassName={labelClassName}
            labelFontClass={labelClass}
            labelFontClassAdmin={labelFontClass}
            formFieldBottomMargin
            hideLabelClass
          />
          {(fieldTypeInstruction || editIcon || deleteIcon) ? (
            <div className={cx(gClasses.CenterV, gClasses.Height24)}>
              {fieldTypeInstruction}
            </div>
          ) : null}
        </div>
      )}
      {isDataLoading ? (
        <Skeleton height={32} />
      ) : (
        <div className={BS.D_FLEX}>
          <div
            id={`datePicker-${id}`}
            onKeyUp={dateSwitch}
            role="presentation"
            aria-labelledby={noAriaLabelledBy ? null : `${id}_label`}
            className={cx(
              BS.D_FLEX,
              BS.ALIGN_ITEM_CENTER,
              styles.DatepickerContainer,
              styles.PlaceholderPadding,
              innerClassName,
              {
                [gClasses.ErrorInputBorderImp]: !!errorMessage,
                [styles.Disabled]: disabled,
                [styles.Active]: !disabled,
                [styles.ReadAlone]: readOnly,
              },
            )}
            style={{ width: enableTime ? '193px' : '127px' }}
          >
            <div className={cx(BS.D_FLEX)}>
              {dateInputComponent()}
              {enableTime ? timeInputComponent() : null}
            </div>
            <div className={cx(styles.calendervisible)}>
                <CalendarIcon
                role="button"
                calenderIconRef={calenderIconRef2}
                onClick={() => {
                  if (!disabled) {
                    setIsOpen(true);
                    setTimeout(() => {
                      calenderIconRef?.current.click();
                    }, 1);
                  }
                }
                }
                onKeyDown={(e) => {
                  if (keydownOrKeypessEnterHandle(e) && !disabled) {
                    setIsOpen(true);
                    setTimeout(() => {
                      calenderIconRef?.current?.click();
                    }, 1);
                  }
                }
                }
                  title={ICON_STRINGS.CALENDAR_ICON}
                  style={{ fill: buttonColor }}
                  tabIndex={readOnly ? -1 : 0}
                  ariaLabel="Date picker"
                  className={cx(
                    !readOnly && gClasses.CursorPointer,
                    !disabled && gClasses.CursorPointer,
                    styles.TransparentBtn,
                    iconClassName,
                  )}
                  hideLabel
                  referenceName={referenceName}
                />
            </div>
          </div>
          { (showReset && (inputDate || month || year || hour || minute || meridiem)) && (
            <CloseIconNew
              onClick={setClear}
              className={cx(gClasses.CursorPointer, gClasses.ML6, gClasses.MT14, gClasses.TransparentBtn)}
              role={ARIA_ROLES.BUTTON}
              tabIndex={0}
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && setClear()}
              ariaLabel={ICON_STRINGS.CLEAR}
              height={8}
              width={8}
            />
          )}
        </div>
      )}
        {
          isOpen &&
          (
            <Modal
              isModalOpen={isOpen}
              onCloseClick={() => setIsOpen(false)}
              noCloseIcon
              centerVH
              contentClass={styles.DatePickerModal}
            >
              <div id="date-picker-modal">
                <DatePicker
                  ref={datePickerRef}
                  id={id}
                  preventOpenOnFocus
                  placeholderText={placeholder}
                  selected={selectedDate}
                  focusSelectedMonth
                  minDate={minDateValue}
                  maxDate={maxDateValue}
                  onClickOutside={() => setIsOpen(false)}
                  showTimeSelect={enableTime}
                  timeFormat={enableTime ? 'hh:mm a' : null}
                  includeDates={includeDates}
                  onChange={onSelectDate}
                  dropdownMode="select"
                  isClearable={showClearButton}
                  timeIntervals={15}
                  disabled={disabled}
                  readOnly={readOnly}
                  fixedHeight
                  dateFormat={DATE.DATE_PICKER_DATE_FORMAT}
                  customInput={<CustomInput enableTime={enableTime} calenderIconRef={calenderIconRef} readOnly={readOnly} disabled={disabled} buttonColor={buttonColor} referenceName={referenceName} isTable={isTable} iconClassName={iconClassName} />}
                  popperModifiers={popperModifiers}
                  showPopperArrow={false}
                  calendarClassName={calendarClass}
                  renderCustomHeader={renderCustomHeader}
                  weekDayClassName={() => styles.weekDay}
                  dayClassName={isOutSideRange}
                  popperProps={popperProps}
                  enableTabLoop={false}
                  onCalendarOpen={() => setCalendarFocusStatus(true)}
                  onCalendarClose={() => {
                    setIsOpen(false);
                    setCalendarFocusStatus(false);
                    }
                  }
                  disabledKeyboardNavigation
                />
              </div>
            </Modal>
          )
        }
      <div className={msgContainerStyle}>
        {!!instructionMessage && (
          <div
            className={cx(
              gClasses.Fone12GrayV4,
              gClasses.WordWrap,
              gClasses.FontStyleNormal,
              gClasses.MT5,
              instructionClass,
            )}
          >
            {instructionMessage}
          </div>
        )}
        {!hideMessage && errorMessage ? (
          <HelperMessage
            id={helperMessageId}
            className={cx(gClasses.ErrorMarginV1, helperMessageClass)}
            message={errorMessage}
            type={HELPER_MESSAGE_TYPE.ERROR}
          />
        ) : null}
      </div>
    </div>
  );
}

ReactDatePicker.propTypes = {
  /** Add or remove time picker */
  enableTime: propTypes.bool,
};
ReactDatePicker.defaultProps = {
  enableTime: false,
};

export default ReactDatePicker;
