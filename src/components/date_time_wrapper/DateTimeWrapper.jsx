import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getDatePickerRange, getDatePickerRangeForCalender, getFormattedWokingDaysArray, getHolidays, getHolidaysToUpdateMoment } from 'utils/formUtils';
import { DateTimePickerComponent } from '@workhall-pvt-lmt/wh-ui-library';
import DATE_FORMAT from '../../utils/constants/dateFormat.constant';
import { DEFAULT_LOCALE } from '../form_components/date_picker/DataPicker.strings';
import { getUserProfileData } from '../../utils/UtilityFunctions';

function DateTimeWrapper(props) {
  const userProfileData = getUserProfileData();
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
    working_days,
    validations,
    isTable,
    iconClassName,
    inputAriaLabelledBy,
    noAriaLabelledBy,
    showReset = false,
    prefLocale = userProfileData?.pref_locale,
    fontScheme,
    colorScheme,
    holidaysMainList,
    tooltipPlacement,
  } = props;

  const { t } = useTranslation();

  const locale = DATE_FORMAT[prefLocale] || DEFAULT_LOCALE;

  return (
    <DateTimePickerComponent
      id={id}
      hideLabel={hideLabel}
      disableClass={disableClass}
      referenceName={referenceName}
      label={label}
      locale={locale}
      editIcon={editIcon}
      getDatePickerRange={getDatePickerRange}
      getDatePickerRangeForCalender={getDatePickerRangeForCalender}
      getFormattedWokingDaysArray={getFormattedWokingDaysArray}
      getHolidays={getHolidays}
      getHolidaysToUpdateMoment={getHolidaysToUpdateMoment}
      holidaysMainList={holidaysMainList}
      t={t}
      date={date}
      getDate={getDate}
      showClearButton={showClearButton}
      enableTime={enableTime}
      placeholder={placeholder}
      isDataLoading={isDataLoading}
      helperTooltipMessage={helperTooltipMessage}
      helperToolTipId={helperToolTipId}
      labelClassName={labelClassName}
      fieldTypeInstruction={fieldTypeInstruction}
      deleteIcon={deleteIcon}
      hideMessage={hideMessage}
      helperMessageClass={helperMessageClass}
      workingDays={workingDays || working_days}
      workingDaysOnly={workingDaysOnly}
      validations={validations}
      isTable={isTable}
      iconClassName={iconClassName}
      inputAriaLabelledBy={inputAriaLabelledBy}
      noAriaLabelledBy={noAriaLabelledBy}
      showReset={showReset}
      fontScheme={fontScheme}
      colorScheme={colorScheme}
      className={className}
      errorMessage={errorMessage}
      readOnly={readOnly}
      isRequired={isRequired}
      disabled={disabled}
      instructionMessage={instructionMessage}
      instructionClass={instructionClass}
      innerClassName={innerClassName}
      tooltipPlacement={tooltipPlacement}
    />
  );
}

const mapStateToProps = ({ UserPreferenceReducer, LanguageAndCalendarAdminReducer, HolidayListReducer }) => {
  return {
    prefLocale: UserPreferenceReducer.acc_locale,
    holidaysMainList: HolidayListReducer.holiday_list,
    working_days: LanguageAndCalendarAdminReducer.working_days,
  };
};

export default connect(mapStateToProps)(DateTimeWrapper);
