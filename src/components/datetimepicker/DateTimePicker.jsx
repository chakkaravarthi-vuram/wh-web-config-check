import React from 'react';
import { DateTimePicker } from '@workhall-pvt-lmt/wh-ui-library';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import DATE_FORMAT from '../../utils/constants/dateFormat.constant';
import { DEFAULT_LOCALE } from '../form_components/date_picker/DataPicker.strings';
import { isValidDate } from './Datetimepicker.utils';

function ReactDateTimePicker(props) {
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
  console.log('prefLocale', prefLocale);
  const locale = DATE_FORMAT[prefLocale] || DEFAULT_LOCALE;
  console.log(
    'locale',
    locale,
    typeof selectedDate,
    !isEmpty(selectedDate),
  );
  console.log('locale1', selectedDate);
  console.log('locale2', typeof selectedDate);

  console.log('locale3');

  console.log('locale4');

  const datePlaceholder = `${locale.dateFormat}, hh:mm:ss aa`;
  return (
    <DateTimePicker
      id={id}
      onChange={onChange}
      selectedDate={
        isValidDate(selectedDate) ? selectedDate : null
      }
      className={className}
      errorMessage={errorMessage}
      prefLocale={prefLocale}
      readOnly={readOnly}
      placeholder={datePlaceholder}
      isRequired={isRequired}
      disabled={disabled}
      helperText={helperText}
      holidayList={holidaysMainList}
      label={label}
      validationType={validationType}
    />
  );
}

const mapStateToProps = ({ RoleReducer, HolidayListReducer }) => {
  return {
    pref_locale: RoleReducer.acc_locale,
    holidaysMainList: HolidayListReducer.holiday_list,
  };
};

export default connect(mapStateToProps)(ReactDateTimePicker);
