import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import Trash from '../../../../../../assets/icons/application/Trash';

function ShortcutAutofillData() {
    return (
        <div className={gClasses.DisplayFlex}>
            <SingleDropdown
                className={cx(gClasses.MR24)}
                optionList={[]}
                required
                selectedValue=""
                // onClick={(value) => onChangeHandler(AUTOMATED_SYSTEM_ID.TRIGGER_REPEAT_MONTH, value, false, { ...automatedSystemsState?.triggerRepeatMonth?.repeatMonthConfig, type: AUTOMATED_STRING_VALUES.SELECTED_WEEK_DAY, repeatMonthWeek: value })}
            />
            <SingleDropdown
                className={cx(gClasses.MR24)}
                optionList={[]}
                required
                selectedValue=""
                // onClick={(value) => onChangeHandler(AUTOMATED_SYSTEM_ID.TRIGGER_REPEAT_MONTH, value, false, { ...automatedSystemsState?.triggerRepeatMonth?.repeatMonthConfig, type: AUTOMATED_STRING_VALUES.SELECTED_WEEK_DAY, repeatMonthWeek: value })}
            />
            <SingleDropdown
                className={cx(gClasses.MR24)}
                optionList={[]}
                required
                selectedValue=""
                // onClick={(value) => onChangeHandler(AUTOMATED_SYSTEM_ID.TRIGGER_REPEAT_MONTH, value, false, { ...automatedSystemsState?.triggerRepeatMonth?.repeatMonthConfig, type: AUTOMATED_STRING_VALUES.SELECTED_WEEK_DAY, repeatMonthWeek: value })}
            />
            <button><Trash /></button>
        </div>
    );
}

export default ShortcutAutofillData;
