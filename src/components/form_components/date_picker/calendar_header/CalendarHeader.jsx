import React from 'react';
import moment from 'moment';
import cx from 'classnames';

import Dropdown from 'components/form_components/dropdown/Dropdown';
import DownArrowIcon from 'assets/icons/chat/DownArrowIcon';
import gClasses from 'scss/Typography.module.scss';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { ARIA_ROLES } from 'utils/UIConstants';
import styles from './CalendarHeader.module.scss';

function CalendarHeader({
    date,
    changeYear,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
}, onYearPickerKeydown, onPrevArrowKeydown, { minDateString, maxDateString }) {
    const selectedYear = new Date(date).getFullYear() || new Date(minDateString).getFullYear() || new Date(maxDateString).getFullYear() || new Date().getFullYear();
    const getYearOptionList = () => {
        const years = [];
        let minYear = minDateString ? moment(minDateString).year() : 1900;
        const maxYear = maxDateString ? moment(maxDateString).year() : 2100;
        while (minYear <= maxYear) {
            years.push({
                label: minYear,
                value: minYear,
            });
            minYear++;
        }
        return years;
    };
    const prevMonthNavStyle = cx(styles.MonthNavigation, prevMonthButtonDisabled && styles.MonthNavigationDisabled);
    const nextMonthNavStyle = cx(styles.MonthNavigation, nextMonthButtonDisabled && styles.MonthNavigationDisabled);

    return (
        <div
            className={styles.HeaderWrapper}
        >
            <div className={styles.TitleContainer}>
                <div
                    role="button"
                    onKeyDown={(e) => {
                        keydownOrKeypessEnterHandle(e) && decreaseMonth();
                        onPrevArrowKeydown && onPrevArrowKeydown(e);
                    }}
                    onClick={decreaseMonth}
                    tabIndex={0}
                    className={prevMonthNavStyle}
                    id="prevArrow"
                    aria-label="Previous month"
                >
                    <DownArrowIcon
                        className={cx(
                            styles.LeftNav,
                            styles.Icon,
                            gClasses.CursorPointer,
                        )}
                        isButtonColor={false}
                        role={ARIA_ROLES.IMG}
                        title="Previous Month"
                    />
                </div>
                <div className={styles.CalendarHeader}>
                    {moment(date).format('MMMM YYYY')}
                </div>

                <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && increaseMonth()}
                    onClick={increaseMonth}
                    className={nextMonthNavStyle}
                    aria-label="Next month"
                >
                    <DownArrowIcon
                        className={cx(
                            styles.RightNav,
                            styles.Icon,
                            gClasses.CursorPointer,
                        )}
                        isButtonColor={false}
                        role={ARIA_ROLES.IMG}
                        title="Next Month"
                    />
                </div>
            </div>
            <div>
                <Dropdown
                    id="yearPicker"
                    className={styles.YearSelect}
                    optionList={getYearOptionList()}
                    onChange={(event) => { changeYear(event.target.value); }}
                    hideLabel
                    hideMessage
                    selectedValue={selectedYear}
                    focusInitialValue
                    initialValue={selectedYear}
                    strictlySetSelectedValue
                    ondropdownKeydown={onYearPickerKeydown}
                />
            </div>
        </div>
    );
}
export default CalendarHeader;
