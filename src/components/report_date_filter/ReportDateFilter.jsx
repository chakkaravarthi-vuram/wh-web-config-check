import React from 'react';
import cx from 'classnames/bind';
import { SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import { BS } from '../../utils/UIConstants';
import { DATE_FILTER_STRINGS } from './ReportDateFilter.string';
import styles from './ReportDateFilter.module.scss';
import { MONTHS_ARRAY } from '../../utils/strings/CommonStrings';
import { generateDaysArray, generateYearArray } from '../../utils/UtilityFunctions';
import gClasses from '../../scss/Typography.module.scss';

function ReportDateFilter(props) {
  const {
    onDropDownChangeHandler,
    monthFilterData,
    yearFilterData,
    dayFilterData,
  } = props;

  return (
    <div className={cx(BS.D_FLEX, gClasses.gap5)}>
      {yearFilterData && (
        <SingleDropdown
          className={cx(styles.DateDropDown)}
          selectedValue={yearFilterData}
          optionList={generateYearArray(15, 15, yearFilterData)}
          onClick={(value) => {
            onDropDownChangeHandler(DATE_FILTER_STRINGS.TYPES.YEAR, value);
          }}
        />
      )}
      {monthFilterData && (
        <SingleDropdown
          className={cx(styles.DateDropDown)}
          selectedValue={monthFilterData}
          optionList={MONTHS_ARRAY}
          onClick={(value) => {
            onDropDownChangeHandler(DATE_FILTER_STRINGS.TYPES.MONTH, value);
          }}
        />
      )}
      {dayFilterData && (
        <SingleDropdown
          className={cx(styles.DateDropDown)}
          selectedValue={dayFilterData}
          optionList={generateDaysArray(yearFilterData, monthFilterData)}
          onClick={(value) => {
            onDropDownChangeHandler(DATE_FILTER_STRINGS.TYPES.DAY, value);
          }}
        />
      )}
    </div>
  );
}

export default ReportDateFilter;
