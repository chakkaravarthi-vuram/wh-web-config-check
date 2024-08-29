import React from 'react';
import { DatePicker } from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import DATE_FORMAT, { DEFAULT_LOCALE } from '../../utils/constants/dateFormat.constant';

function ReactDatePicker(props) {
  const {
    id,
    onChange,
    selectedDate,
    className,
    errorMessage,
    prefLocale,
    readOnly = false,
    isRequired = false,
    helperText = EMPTY_STRING,
    disabled = false,
    holidaysMainList,
    validationType,
    label,
  } = props;
  const locale = DATE_FORMAT[prefLocale] || DEFAULT_LOCALE;
  const datePlaceholder = locale.dateFormat;
  return (
    <DatePicker
      id={id}
      onChange={onChange}
      selectedDate={selectedDate}
      className={className}
      errorMessage={errorMessage}
      prefLocale={prefLocale}
      readOnly={readOnly}
      placeholder={datePlaceholder}
      isRequired={isRequired}
      disabled={disabled}
      helperText={helperText}
      holidayList={holidaysMainList}
      validationType={validationType}
      label={label}
    />
  );
}

const mapStateToProps = ({ RoleReducer, HolidayListReducer }) => {
  return {
    prefLocale: RoleReducer.acc_locale,
    holidaysMainList: HolidayListReducer.holiday_list,
  };
};

export default connect(mapStateToProps)(ReactDatePicker);
