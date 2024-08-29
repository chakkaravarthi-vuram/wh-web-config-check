import React from 'react';
// import { useState, useEffect, useContext, forwardRef, useRef } from 'react';
// import cx from 'classnames/bind';
// import DatePicker from 'react-datepicker';
// import Skeleton from 'react-loading-skeleton';
// import propTypes from 'prop-types';
// import { connect } from 'react-redux';
// import moment from 'moment-business-days';

// import { DATE, KEY_CODES, KEY_NAMES } from 'utils/Constants';
// import gClasses from 'scss/Typography.module.scss';
// import { isArray, isEmpty, map, isEqual, get, safeTrim } from 'utils/jsUtility';
// import { BS } from 'utils/UIConstants';
// import { ACTION_STRINGS, EMPTY_STRING, SPACE, TIME_DROPDOWN } from 'utils/strings/CommonStrings';
// import DATE_FORMAT from 'utils/constants/dateFormat.constant';
// import { keydownOrKeypessEnterHandle, trimString } from 'utils/UtilityFunctions';
// import { parse12HoursTimeFromUTC, parse12HrsTimeto24HoursTime } from 'utils/dateUtils';
// import { ICON_STRINGS } from 'containers/sign_in/SignIn.strings';
// import CalendarIcon from 'assets/icons/CalendarIcon';
// import { getDatePickerRange, getDatePickerRangeForCalender, getFormattedWokingDaysArray, getHolidays, getHolidaysToUpdateMoment } from 'utils/formUtils';
// import ThemeContext from 'hoc/ThemeContext';
import 'react-datepicker/dist/react-datepicker.css';
import './ReactDatePicker.scss';
// import { DATE_PLACEHOLDER, DEFAULT_LOCALE, MONTH_PLACEHOLDER, YEAR_PLACEHOLDER } from 'components/form_components/date_picker/DataPicker.strings';
// import CalendarHeader from 'components/form_components/date_picker/calendar_header/CalendarHeader';
// import ConditionalWrapper from 'components/conditional_wrapper/ConditionalWrapper';
// import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
// import styles from './DatePicker.module.scss';
// import Label from '../label/Label';
// import HelperMessage from '../helper_message/HelperMessage';
// import HELPER_MESSAGE_TYPE from '../helper_message/HelperMessage.strings';
// import Dropdown from '../dropdown/Dropdown';
// import { isTimeValid } from './DatePicker.utils';
import DateTimePicker from './DateTimePicker';

export const WORKING_WEEK_DAYS = [0, 1, 2, 3, 4, 5, 6];
// const CustomInput = forwardRef((props) => {
//   const { onClick, readOnly, disabled, buttonColor, referenceName, isTable, iconClassName, enableTime, calenderIconRef } = props;
//   return (
//     <div onClick={onClick} className={styles.calendervisible} aria-label="Date picker" tabIndex={-1} role="button" onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick()} ref={calenderIconRef}>
//     <CalendarIcon
//       title={ICON_STRINGS.CALENDAR_ICON}
//       style={{ fill: buttonColor }}
//       tabIndex={enableTime ? -1 : (readOnly ? -1 : 0)}
//       role="button"
//       ariaLabel="Date picker"
//       onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClick()}
//       onClick={onClick}
//       className={cx(
//         enableTime ? gClasses.DisplayNone : styles.Icon,
//         !readOnly && gClasses.CursorPointer,
//         !disabled && gClasses.CursorPointer,
//         isTable && (enableTime ? gClasses.DisplayNone : styles.IconTablePosition),
//         styles.TransparentBtn,
//         BS.ML_AUTO,
//         iconClassName,
//       )}
//       hideLabel
//       referenceName={referenceName}
//     />
//     </div>
//   );
// });
function ReactDatePicker(props) {
  // const {
  //   date,
  //   getDate,
  //   showClearButton,
  //   enableTime,
  //   defaultTime = EMPTY_STRING,
  //   prefLocale,
  //   placeholder,
  //   isDataLoading,
  //   className,
  //   hideLabel,
  //   label,
  //   id,
  //   isRequired,
  //   helperTooltipMessage,
  //   helperToolTipId,
  //   labelClassName,
  //   labelClass,
  //   labelFontClass,
  //   fieldTypeInstruction,
  //   editIcon,
  //   deleteIcon,
  //   hideMessage,
  //   helperMessageClass,
  //   errorMessage,
  //   readOnly,
  //   disabled,
  //   disableClass,
  //   referenceName,
  //   instructionMessage,
  //   instructionClass,
  //   innerClassName,
  //   workingDaysOnly,
  //   workingDays,
  //   holidaysMainList,
  //   validations,
  //   disableTimePicker,
  //   fixedStrategy,
  //   timePlaceholder,
  //   isTable,
  //   iconClassName,
  //   disablePopper = false,
  //   isLastColumn,
  //   isFirstTableField = false,
  //   inputAriaLabelledBy,
  //   noAriaLabelledBy,
  // } = props;
  return (
    <DateTimePicker {...props} />
  );
//   const [year, setYear] = useState('');
//   const [month, setMonth] = useState('');
//   const [time, setTime] = useState('');
//   const [inputDate, setInputDate] = useState('');
//   const [calendarFocused, setCalendarFocusStatus] = useState(false);
//   const [workingDaysArrary, setWorkingDays] = useState(WORKING_WEEK_DAYS);
//   const [holidayList, setHolidayList] = useState([]);
//   const [validationsData, setValidationsData] = useState(validations);
//   const { buttonColor } = useContext(ThemeContext);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   //
//   const [minDateValue, setMinDateValue] = useState('');
//   const [maxDateValue, setMaxDateValue] = useState('');
//   const [includeDates, setIncludeDates] = useState([]);
//   const calenderIconRef = useRef(null);
//   const calenderIconRef2 = useRef(null);
//   const datePickerRef = useRef(null);

//   const helperMessageId = `${id}_helper_message`;
//   const labelId = `${id}_label`;
//   const inputTextStyle = cx(
//     gClasses.FOne13BlackV1,
//     styles.ReadOnly,
//     disabled && disableClass,
//   );
//   const calendarClass = cx(
//     isFirstTableField && gClasses.ML100,
//     isLastColumn ? styles.LastColumnCalendarContainer : styles.CalendarContainer,
//   );
//   const getDatePickerProps = async () => {
//     const { validations } = props;
//     const formattedProps = await getDatePickerRange({
//       date,
//       readOnly,
//       validations,
//       workingDaysArray: workingDays,
//       isEnableTime: enableTime,
//     });
//     setMinDateValue(formattedProps.minDate);
//     setMaxDateValue(formattedProps.maxDate);
//     setIncludeDates(formattedProps.includeDates);
//     if (workingDaysOnly) {
//       const holidays = getHolidays(holidaysMainList);
//       setHolidayList(holidaysMainList);
//       moment.updateLocale('us', {
//         workingWeekdays: workingDaysArrary,
//         holidays: holidays,
//         holidayFormat: DATE.DATE_FORMAT,
//       });
//     }
//   };
//   const dateSwitch = (e) => {
//     e.stopPropagation();
//     const { target } = e;
//     const { maxLength } = target;
//     const myLength = target.value.length;
//     const { code } = e;
//     if (code === 'Tab' || code === 'ShiftLeft' || code === 'ShiftRight') {
//       return;
//     }
//     if (myLength >= maxLength) {
//       let next = target.nextElementSibling;
//       while (next) {
//         if (next.tagName.toLowerCase() === 'input') {
//           next.focus();
//           break;
//         }
//         next = next.nextElementSibling;
//         if (next == null) break;
//       }
//     } else if (myLength === 0 && code === 'Backspace') {
//       let previous = target.previousElementSibling;
//       while (previous) {
//         if (previous == null) break;
//         if (previous.tagName.toLowerCase() === 'input') {
//           previous.focus();
//           break;
//         }
//         previous = previous.previousElementSibling;
//       }
//     }
//   };
//   const preProcessDate = (_date) => {
//     const input = trimString(_date);
//     return input.replace(/[^\d]/g, '');
//   };
//   const getDateHandler = (dateString, timeString) => {
//     const { getDate } = props;
//     if (getDate) {
//       const formattedDateTimeString = `${dateString}T${parse12HrsTimeto24HoursTime(timeString)}:00`;
//       console.log(formattedDateTimeString, 'formattedDateTimeString formattedDateTimeString');
//       // if()
//       if (enableTime) {
//         let formattedTimeString;
//         if ((typeof timeString === 'string' && timeString.length === 8) && moment(timeString, DATE.TIME_FORMAT, true).isValid()) {
//           formattedTimeString = `${parse12HrsTimeto24HoursTime(timeString)}:00`;
//         } else {
//           formattedTimeString = timeString;
//         }
//         if (isEmpty(dateString) && isEmpty(formattedTimeString)) {
//           getDate(EMPTY_STRING);
//         } else if (!isEmpty(dateString)) {
//           if (!isEmpty(timeString)) getDate(`${dateString}T${formattedTimeString}`);
//           else getDate(`${dateString}T`);
//         } else {
//            getDate(`T${formattedTimeString}`);
//         }
//       } else {
//         getDate(dateString);
//       }
//     }
//   };
//   const onSelectDate = (date) => {
//     date.setHours(0, 0, 0);
//     date = date.toString().slice(0, 24);
//     const dateString = moment.utc(date).format(DATE.DATE_FORMAT);

//     if (enableTime) {
//       const timeString = time || defaultTime || '12:00 AM';
//       setTime(timeString);
//       getDateHandler(dateString, timeString);
//     } else {
//       getDate(dateString);
//     }
//   };
//   const onYearChangeHandler = (event) => {
//     const userInput = preProcessDate(event.target.value);
//     if (userInput || inputDate || month) getDateHandler(`${userInput}-${month}-${inputDate}`, time);
//     else getDateHandler(EMPTY_STRING, time);
//     setYear(userInput);
//   };

//   const onMonthChangeHandler = (event) => {
//     let userInput = preProcessDate(event.target.value);
//     if (Number(userInput) > 1 && userInput.length < 2) userInput = `0${userInput}`;
//     if (userInput || year || inputDate) getDateHandler(`${year}-${userInput}-${inputDate}`, time);
//     else getDateHandler(EMPTY_STRING, time);
//     setMonth(userInput);
//   };

//   const onInputDateChange = (event) => {
//     let userInput = preProcessDate(event.target.value);
//     if (Number(userInput) > 3 && userInput.length < 2) userInput = `0${userInput}`;
//     if (month || year || userInput) getDateHandler(`${year}-${month}-${userInput}`, time);
//     else getDateHandler(EMPTY_STRING, time);
//     setInputDate(userInput);
//   };
//   const onTimeChangeHandler = (event) => {
//     const time = get(event, 'target.value');
//     if (year || inputDate || month) getDateHandler(`${year}-${month}-${inputDate}`, time);
//     else getDateHandler(EMPTY_STRING, time);
//     setTime(time);
//   };

//   const handleTimeInputBlur = (event) => {
//     const time = get(event, 'target.value');
//     if (year || inputDate || month) getDateHandler(`${year}-${month}-${inputDate}`, time);
//   };
//   const inputComponent = () => {
//     const locale = DATE_FORMAT[prefLocale] || DEFAULT_LOCALE;
//     if (locale) {
//       const { separator } = locale;
//       const format = locale.dateFormat.split(separator);
//       return (
//         <div>
//           {' '}
//           {map(format, (eachFormat, index) => {
//             const ariaLabelledBy = `${index === 0 ? inputAriaLabelledBy || labelId : EMPTY_STRING}${errorMessage ? SPACE + helperMessageId : EMPTY_STRING}`;
//             let inputClassName;
//             let onDateChangeHandler;
//             let size;
//             let inputPlaceholder;
//             let value;
//             let width;
//             let paddingLeft;
//             const textAlign = 'center';
//             if (index === 0) {
//               inputClassName = cx(
//                 inputTextStyle,
//                 styles.InputTextStyle,
//                 gClasses.MR5,
//               );
//             } else if (index === 1) {
//               inputClassName = cx(
//                 inputTextStyle,
//                 styles.InputTextStyle,
//                 gClasses.MR5,
//                 gClasses.ML5,
//               );
//             } else {
//               inputClassName = cx(
//                 inputTextStyle,
//                 styles.InputTextStyle,
//                 gClasses.MR10,
//                 gClasses.ML5,
//               );
//             }
//             if (eachFormat === 'YYYY') {
//               value = year;
//               width = '38px';
//               onDateChangeHandler = onYearChangeHandler;
//               inputPlaceholder = YEAR_PLACEHOLDER;
//               size = 4;
//             }
//             if (eachFormat === 'MM') {
//               value = month;
//               width = '30px';
//               onDateChangeHandler = onMonthChangeHandler;
//               inputPlaceholder = MONTH_PLACEHOLDER;
//               size = 2;
//             }
//             if (eachFormat === 'DD') {
//               value = inputDate;
//               width = '27px';
//               onDateChangeHandler = onInputDateChange;
//               inputPlaceholder = DATE_PLACEHOLDER;
//               size = 2;
//             }
//             return (
//               <>
//                 <input
//                   onChange={onDateChangeHandler}
//                   placeholder={inputPlaceholder}
//                   className={cx(
//                     inputClassName,
//                     errorMessage ? styles.ErrorMessage : null,
//                     gClasses.MX0,
//                   )}
//                   autoComplete={ACTION_STRINGS.OFF}
//                   value={value}
//                   readOnly={readOnly}
//                   disabled={disabled}
//                   size={size}
//                   maxLength={eachFormat.length}
//                   tabIndex={readOnly || disabled ? -1 : 0}
//                   // onBlur={handleDateInputBlur}
//                   style={{ width, paddingLeft, textAlign }}
//                   // hideMessage={!errorMessage}
//                   ui-auto={referenceName}
//                   aria-labelledby={index === 0 || errorMessage ? ariaLabelledBy : null}
//                   aria-required={isRequired ? 'true' : 'false'}
//                 />
//                 {index !== 2 ? (
//                   <span className={cx(BS.MB_AUTO, styles.DashSpan)}>-</span>
//                 ) : null}
//               </>
//             );
//           })}
//         </div>
//       );
//     }
//     return null;
//   };

//   const onYearPickerKeydown = (e) => {
//     if ((e.keyCode === KEY_CODES.TAB || e.key === KEY_NAMES.TAB) && !e.shiftKey) {
//         const dropdown = document.getElementById(`combo-box-timePicker-${id}`);
//         dropdown && dropdown.focus();
//         datePickerRef && datePickerRef.current && datePickerRef.current.setOpen(false);
//     }
//   };

//   const onPrevArrowKeydown = (e) => {
//     if (e.shiftKey && (e.keyCode === KEY_CODES.TAB || e.key === KEY_NAMES.TAB)) {
//     datePickerRef && datePickerRef.current && datePickerRef.current.setOpen(false);
//     enableTime && calenderIconRef2 && calenderIconRef2.current && calenderIconRef2.current.focus();
//     !enableTime && calenderIconRef && calenderIconRef.current && calenderIconRef.current.focus();
//     }
//   };

//   const renderCustomHeader = ((props) => {
//     console.log(props, 'renderCustomHeader props');
//     return (
//       CalendarHeader(props, onYearPickerKeydown, onPrevArrowKeydown, getDatePickerRangeForCalender({
//         readOnly,
//         validations,
//         isEnableTime: enableTime,
//       })));
//   });
//   const updateDateState = (date) => {
//     const dateTimeMoment = moment(date);
//     setYear(dateTimeMoment.format('YYYY'));
//     setMonth(dateTimeMoment.format('MM'));
//     setInputDate(dateTimeMoment.format('DD'));
//     if (enableTime) {
//       const timeString = !isEmpty(date) ? date.split('T')[1] : EMPTY_STRING;
//       const timeStringTrimmed = safeTrim(timeString);
//       if (isEmpty(timeStringTrimmed) || (timeStringTrimmed.length < 8) || !isTimeValid(timeString)) {
//         setTime(timeString);
//       } else if (!isEmpty(timeStringTrimmed) && isTimeValid(timeString)) {
//         console.log(timeStringTrimmed, 'timeStringTrimmed timeStringTrimmed');
//         setTime(parse12HoursTimeFromUTC(date));
//       }
//     } else setTime(dateTimeMoment.format(DATE.TIME_FORMAT));
//   };
//   useEffect(() => {
//     setIsInitialLoad(false);
//   }, []);
//   useEffect(() => {
//     if (date) {
//       console.log(date, 'date convertedDateTimeString');
//       const isDateValid = moment(date, [DATE.DATE_FORMAT, moment.ISO_8601], true).isValid();
//       if (isDateValid) {
//         const utcOffset = moment.parseZone(date).utcOffset(); // If utc offset presents, date is from database and it has been converted to users timezone
//         if (utcOffset || (date.charAt(date.length - 1) === 'Z')) {
//           const convertedDateTimeString = moment(date).utcOffset(date).format('YYYY-MM-DDTHH:mm:ss');
//           console.log(convertedDateTimeString, date, 'dfsfs convertedDateTimeString', `${convertedDateTimeString}:00`);
//           updateDateState(convertedDateTimeString);
//           getDate(convertedDateTimeString);
//         } else {
//           updateDateState(date);
//         }
//       } else {
//         if (date.includes('T')) {
//           const [dateString, timeString] = date.split('T');
//           if (dateString) {
//             const [year, month, day] = dateString.split('-');
//             setYear(year);
//             setMonth(month);
//             setInputDate(day);
//           } else {
//             setYear(EMPTY_STRING);
//             setMonth(EMPTY_STRING);
//             setInputDate(EMPTY_STRING);
//           }
//           if (timeString) {
//             const timeStringTrimmed = safeTrim(timeString);
//             if (!isEmpty(timeStringTrimmed) && (timeStringTrimmed.length === 8) && isTimeValid(timeString)) setTime(moment(timeString, 'HH:mm:ss').format('hh:mm A'));
//             else setTime(timeString);
//           } else setTime(EMPTY_STRING);
//         } else {
//           const { isBulkUploadPreview } = props;
//           if (isBulkUploadPreview) {
//             let dateFromBulkUpload = date;
//             if (isArray(date)) [dateFromBulkUpload] = date;
//             const formattedDate = moment(dateFromBulkUpload);
//             if ((formattedDate.isValid() && isInitialLoad)) {
//               const year = formattedDate.format('YYYY');
//               const day = formattedDate.format('DD');
//               const month = formattedDate.format('MM');
//               console.log('fhjkhjkfhjkshjksdf', year, month, day);
//               if (![year, month, day].includes('Invalid date')) {
//                 setYear(year);
//                 setMonth(month);
//                 setInputDate(day);
//             }
//             } else {
//               const [year, month, day] = date.split('-');
//               setYear(year);
//               setMonth(month);
//               setInputDate(day);
//             }
//           } else {
//             const [year, month, day] = date.split('-');
//             setYear(year);
//             setMonth(month);
//             setInputDate(day);
//           }
//         }
//       }
//     } else {
//       setYear(EMPTY_STRING);
//       setMonth(EMPTY_STRING);
//       setInputDate(EMPTY_STRING);
//       setTime(EMPTY_STRING);
//     }
//   }, [date]);
//   useEffect(() => {
//     let workingWeekDays = [];
//     if (workingDaysOnly) {
//       if (!isEmpty(workingDays)) {
//         workingWeekDays = getFormattedWokingDaysArray(workingDays);
//       } else {
//         workingWeekDays = WORKING_WEEK_DAYS;
//       }
//       setWorkingDays(workingWeekDays);
//       if (!isEmpty(year) && moment(year, 'YYYY').isValid()) {
//         const yearString = year.toString();
//         if (yearString.length === 4) {
//           getHolidaysToUpdateMoment(Number(year));
//         }
//       }
//     }
//   }, [workingDaysOnly, year]);
//   useEffect(() => {
//     getDatePickerProps();
//   }, [disabled]);
//   useEffect(() => {
//     if (workingDaysOnly) {
//       const holidays = getHolidays(holidaysMainList);
//       setHolidayList(holidaysMainList);
//       moment.updateLocale('us', {
//         workingWeekdays: workingDaysArrary,
//         holidays: holidays,
//         holidayFormat: DATE.DATE_FORMAT,
//       });
//     }
//   }, [workingDaysArrary, isEqual(holidaysMainList, holidayList)]);

//   useEffect(() => {
//     getDatePickerProps();
//     setValidationsData(validations);
//   }, [isEqual(validationsData, validations)]);
//   const isOutSideRange = (date) => {
//     date.setHours(0, 0, 0);
//     date = date.toString().slice(0, 24);
//     const day = moment.utc(date);
//     if (workingDaysOnly) {
//       const holidays = getHolidays(holidaysMainList);
//       moment.updateLocale('us', {
//         workingWeekdays: workingDaysArrary,
//         holidays: holidays,
//         holidayFormat: DATE.DATE_FORMAT,
//       });
//       if (!day.isBusinessDay()) return styles.DisableDay;
//     }
//     return null;
//   };

//   let selectedDate = EMPTY_STRING;
//   if (moment.utc(date, moment.ISO_8601, true).isValid()) {
//     const momentString = moment.utc(date, moment.ISO_8601).format(DATE.DATE_FORMAT);
//     selectedDate = new Date(momentString);
//     selectedDate.setHours(0, 0, 0);
//   }
//   const popperProps = isTable ?
//     { allowedAutoPlacements: [POPPER_PLACEMENTS.BOTTOM] } :
//     { allowedAutoPlacements: [POPPER_PLACEMENTS.TOP, POPPER_PLACEMENTS.BOTTOM] };
//   const popperModifiers = isTable ? [
//     {
//       name: 'offset',
//       options: {
//         offset: [0, -80],
//       },
//     },
//   ] : [
//     {
//       name: 'offset',
//       options: {
//         offset: [0, -30],
//       },
//     },
//   ];

//   useEffect(() => {
//     if (calendarFocused && enableTime) {
//         const leftArrow = document.getElementById('prevArrow');
//         leftArrow && leftArrow.focus();
//     }
// }, [calendarFocused]);
//   let msgContainerStyle = styles.MsgContainer3;
//   if (isTable) {
//     if (calendarFocused) msgContainerStyle = styles.MsgContainer;
//     else msgContainerStyle = styles.MsgContainer2;
//   }

//   return (
//     <div
//       className={cx(
//         className,
//         (readOnly || disabled) && !deleteIcon && gClasses.NoPointerEvent,
//       )}
//     >
//       {!hideLabel && (
//         <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
//           <Label
//             content={label}
//             for={id}
//             id={`${id}_label`}
//             labelFor={`datePicker-${id}`}
//             isRequired={isRequired}
//             isDataLoading={isDataLoading}
//             message={helperTooltipMessage}
//             toolTipId={helperToolTipId}
//             innerClassName={labelClassName}
//             labelFontClass={labelClass}
//             labelFontClassAdmin={labelFontClass}
//             formFieldBottomMargin
//             hideLabelClass
//           />
//           {(fieldTypeInstruction || editIcon || deleteIcon) ? (
//             <div className={cx(gClasses.CenterV, gClasses.Height24)}>
//               {fieldTypeInstruction}
//             </div>
//           ) : null}
//         </div>
//       )}
//       {isDataLoading ? (
//         <Skeleton height={32} />
//       ) : (
//         <ConditionalWrapper
//           condition={enableTime}
//           wrapper={(children) => (
//             <div className={cx(BS.D_FLEX)}>
//               {children}
//               <div
//               className={cx(styles.calendervisible)}
//               >
//                 <CalendarIcon
//                 role="button"
//                 calenderIconRef={calenderIconRef2}
//                 // tabIndex={0}
//                 onClick={() => { calenderIconRef && calenderIconRef.current.click(); }}
//                 onKeyDown={(e) => { keydownOrKeypessEnterHandle(e) && calenderIconRef && calenderIconRef.current && calenderIconRef.current.click(); }}
//                   title={ICON_STRINGS.CALENDAR_ICON}
//                   style={{ fill: buttonColor }}
//                   tabIndex={readOnly ? -1 : 0}
//                   ariaLabel="Date picker"
//                   className={cx(
//                     enableTime ? styles.IconWithTime : styles.Icon,
//                     !readOnly && gClasses.CursorPointer,
//                     !disabled && gClasses.CursorPointer,
//                     isTable && (enableTime ? styles.IconTablePositionWithTime : styles.IconTablePosition),
//                     styles.TransparentBtn,
//                     BS.ML_AUTO,
//                     iconClassName,
//                   )}
//                   hideLabel
//                   referenceName={referenceName}
//                 />
//               </div>
//               <Dropdown
//                 className={styles.TimeDropdown}
//                 isEditableDropdownInput
//                 optionList={TIME_DROPDOWN}
//                 placeholder={timePlaceholder || 'Select Time'}
//                 onChange={onTimeChangeHandler}
//                 selectedValue={time}
//                 hideMessage
//                 isDataLoading={isDataLoading}
//                 hideLabel
//                 onEditableInputBlurHandler={handleTimeInputBlur}
//                 disabled={readOnly || disableTimePicker || disabled}
//                 fixedPopperStrategy={fixedStrategy}
//                 popperClasses={cx(gClasses.ZIndex2, styles.TimeDropdownPopper)}
//                 errorBorder={!!errorMessage}
//                 inputSize={8}
//                 referenceName={referenceName}
//                 disablePopper={disablePopper}
//                 id={`timePicker-${id}`}
//               />
//             </div>
//           )}
//         >
//           <div
//             id={`datePicker-${id}`}
//             onKeyUp={dateSwitch}
//             role="presentation"
//             aria-labelledby={noAriaLabelledBy ? null : `${id}_label`}
//             className={cx(
//               BS.D_FLEX,
//               styles.DatepickerContainer,
//               styles.PlaceholderPadding,
//               innerClassName,
//               {
//                 [gClasses.ErrorInputBorderImp]: !!errorMessage,
//                 [styles.Disabled]: disabled,
//                 [styles.Active]: !disabled,
//                 [styles.ReadAlone]: readOnly,
//               },
//             )}
//             style={{ width: '152px' }}
//           >
//             {inputComponent()}
//           </div>
//         </ConditionalWrapper>
//       )}
//       <DatePicker
//         ref={datePickerRef}
//         id={id}
//         popperClassName={isTable ? styles.RemovePopper : null}
//         preventOpenOnFocus
//         placeholderText={placeholder}
//         selected={selectedDate}
//         focusSelectedMonth
//         minDate={minDateValue}
//         maxDate={maxDateValue}
//         includeDates={includeDates}
//         onChange={onSelectDate}
//         dropdownMode="select"
//         isClearable={showClearButton}
//         timeIntervals={15}
//         disabled={disabled}
//         readOnly={readOnly}
//         fixedHeight
//         dateFormat={DATE.DATE_PICKER_DATE_FORMAT}
//         customInput={
//           <CustomInput enableTime={enableTime} calenderIconRef={calenderIconRef} readOnly={readOnly} disabled={disabled} buttonColor={buttonColor} referenceName={referenceName} isTable={isTable} iconClassName={iconClassName} />
//         }
//         popperModifiers={popperModifiers}
//         showPopperArrow={false}
//         calendarClassName={calendarClass}
//         renderCustomHeader={renderCustomHeader}
//         weekDayClassName={() => styles.weekDay}
//         dayClassName={isOutSideRange}
//         popperProps={popperProps}
//         enableTabLoop={false}
//         onCalendarOpen={() => setCalendarFocusStatus(true)}
//         onCalendarClose={() => setCalendarFocusStatus(false)}
//         disabledKeyboardNavigation
//       />
//       <div className={msgContainerStyle}>
//         {!!instructionMessage && (
//           <div
//             className={cx(
//               gClasses.Fone12GrayV4,
//               gClasses.WordWrap,
//               gClasses.FontStyleNormal,
//               gClasses.MT5,
//               instructionClass,
//             )}
//           >
//             {instructionMessage}
//           </div>
//         )}
//         {!hideMessage ? (
//           <HelperMessage
//             id={helperMessageId}
//             className={cx(gClasses.ErrorMarginV1, helperMessageClass)}
//             message={errorMessage}
//             type={HELPER_MESSAGE_TYPE.ERROR}
//           />
//         ) : null}
//       </div>
//     </div>
//   );
}

// ReactDatePicker.propTypes = {
//   /** Add or remove time picker */
//   enableTime: propTypes.bool,
// };
// ReactDatePicker.defaultProps = {
//   enableTime: false,
// };
// const mapStateToProps = ({ UserPreferenceReducer, HolidayListReducer }) => {
//   return {
//     prefLocale: UserPreferenceReducer.pref_locale,
//     holidaysMainList: HolidayListReducer.holiday_list,
//   };
// };

// export default connect(mapStateToProps)(ReactDatePicker);
export default ReactDatePicker;
