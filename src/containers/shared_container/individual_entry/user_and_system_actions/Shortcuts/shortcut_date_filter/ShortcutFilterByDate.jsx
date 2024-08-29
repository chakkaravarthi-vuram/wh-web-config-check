import React from 'react';
import cx from 'classnames/bind';
import moment from 'moment';
import { DATE as DATECONSTANT } from 'utils/Constants';
import { useTranslation } from 'react-i18next';
import ReactDatePicker from 'components/form_components/date_picker/DatePicker';
import { joinWordsInString } from 'utils/UtilityFunctions';
import { BS } from 'utils/UIConstants';
import RadioGroup, { RADIO_GROUP_TYPE } from 'components/form_components/radio_group/RadioGroup';
import jsUtility from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import gClasses from 'scss/Typography.module.scss';
import styles from '../ShortCuts.module.scss';
import { SHORTCUT_STRINGS } from '../ShortCut.strings';
import Button, { BUTTON_TYPE } from '../../../../../../components/form_components/button/Button';

function ShortcutFilterByDate(props) {
  const { t } = useTranslation();
  const {
    title = 'shortcutFilter',
    shortcutDateFilterData = {},
    shortcutDateFilterData: {
      startDate = EMPTY_STRING,
      endDate = EMPTY_STRING,
    },
    onFlowDashboardDataChange,
    filterDateOperator,
    shortcutFilterErrors: {
      startDateError = EMPTY_STRING,
      endDateError = EMPTY_STRING,
    },
    onApplyClick,
  } = props;

  const {
    DATE,
  } = SHORTCUT_STRINGS(t);

  const RD_GROUP = {
    OPTION_LIST: [],
  };

  const onChangeDateBetween = (selectedDate, indexNumber) => {
    const clonedFilter = jsUtility.cloneDeep(shortcutDateFilterData);
    const selectedOperator = jsUtility.cloneDeep(filterDateOperator);

    let { startDate, endDate } = clonedFilter;
    const todayDate = moment().format(DATECONSTANT.UTC_DATE_WITH_TIME_STAMP);

    switch (selectedOperator) {
      case SHORTCUT_STRINGS(t).DATE.BETWEEN.TYPE:
        if (indexNumber === 0) {
            startDate = selectedDate;
        } else {
            endDate = selectedDate;
        }
        break;
      case SHORTCUT_STRINGS(t).DATE.CURRENT_YEAR_TO_DATE.TYPE:
        const currentYear = moment().year();
        const firstDayOfYear = `${currentYear}-01-01T00:00:00`;
        startDate = firstDayOfYear;
        endDate = selectedDate;
        break;
      case SHORTCUT_STRINGS(t).DATE.FROM_DATE_TO_TODAY.TYPE:
        startDate = selectedDate;
        endDate = todayDate;
        break;
      case SHORTCUT_STRINGS(t).DATE.BEFORE.TYPE:
        startDate = null;
        endDate = selectedDate;
        break;
      default: break;
    }

    clonedFilter.startDate = startDate;
    clonedFilter.endDate = endDate;

    onFlowDashboardDataChange({ shortcutDateFilterData: clonedFilter });
  };

  const joinedTitle = joinWordsInString(title);
  const ariaLabelledBy = `${joinedTitle}_label`;

  const onFilterRadioClick = (value) => {
    let selectedOperator = jsUtility.cloneDeep(filterDateOperator);

    selectedOperator = value;

    const clearDate = {
      startDate: EMPTY_STRING,
      endDate: EMPTY_STRING,
    };

    onFlowDashboardDataChange({
      shortcutDateFilterData: clearDate,
      shortcutFilterDateOperator: selectedOperator,
      shortcutFilterErrors: {},
    });
  };

  RD_GROUP.OPTION_LIST.push(
    {
      value: DATE.BETWEEN.TYPE,
      label: DATE.BETWEEN.LABEL,
      children: (
        <div>
          <ReactDatePicker
            id={`${joinedTitle}_${DATE.BETWEEN.TYPE}_1`}
            hideLabel
            date={startDate}
            getDate={(selectedDate) => onChangeDateBetween(selectedDate, 0)}
            errorMessage={startDateError}
            enableTime
            inputAriaLabelledBy={ariaLabelledBy}
            noAriaLabelledBy
            className={gClasses.MB7}
          />
          <ReactDatePicker
            id={`${joinedTitle}_${DATE.BETWEEN.TYPE}_2`}
            hideLabel
            getDate={(selectedDate) => onChangeDateBetween(selectedDate, 1)}
            date={endDate}
            errorMessage={endDateError}
            enableTime
            inputAriaLabelledBy={ariaLabelledBy}
            noAriaLabelledBy
            className={gClasses.MB7}
          />
        </div>
      ),
    },
    {
      value: DATE.FROM_DATE_TO_TODAY.TYPE,
      label: DATE.FROM_DATE_TO_TODAY.LABEL,
      children: (
        <ReactDatePicker
        id={`${joinedTitle}_${DATE.FROM_DATE_TO_TODAY.TYPE}`}
          hideLabel
          getDate={(selectedDate) => onChangeDateBetween(selectedDate)}
          date={startDate}
          validations={{
            date_selection: [{
              sub_type: 'all_past',
              type: 'past',
            }],
          }}
          enableTime
          inputAriaLabelledBy={ariaLabelledBy}
          noAriaLabelledBy
          className={gClasses.MB7}
          errorMessage={startDateError}
        />
      ),
    },
    {
      value: DATE.BEFORE.TYPE,
      label: DATE.BEFORE.LABEL,
      children: (
        <ReactDatePicker
          id={`${joinedTitle}_${DATE.BEFORE.TYPE}`}
          hideLabel
          getDate={(selectedDate) => onChangeDateBetween(selectedDate)}
          date={endDate}
          enableTime
          inputAriaLabelledBy={ariaLabelledBy}
          noAriaLabelledBy
          className={gClasses.MB7}
          errorMessage={endDateError}
        />
      ),
    },
    {
      value: DATE.CURRENT_YEAR_TO_DATE.TYPE,
      label: DATE.CURRENT_YEAR_TO_DATE.LABEL,
      children: (
        <ReactDatePicker
          id={`${joinedTitle}_${DATE.CURRENT_YEAR_TO_DATE.TYPE}`}
          hideLabel
          getDate={(selectedDate) => onChangeDateBetween(selectedDate)}
          date={endDate}
          enableTime
          inputAriaLabelledBy={ariaLabelledBy}
          noAriaLabelledBy
          className={gClasses.MB7}
          errorMessage={endDateError}
        />
      ),
    },
  );

  return (
    <div className={styles.DateFilterContainer}>
      <div className={BS.D_FLEX}>
        <RadioGroup
          hideLabel
          label={joinedTitle}
          id={joinedTitle}
          optionList={RD_GROUP.OPTION_LIST}
          onClick={onFilterRadioClick}
          selectedValue={filterDateOperator}
          type={RADIO_GROUP_TYPE.TYPE_4}
          innerClassName={BS.D_BLOCK}
        />
      </div>
      <div className={cx(BS.D_FLEX, BS.JC_END)}>
        <Button
          buttonType={BUTTON_TYPE.PRIMARY}
          onClick={onApplyClick}
        >
          {SHORTCUT_STRINGS(t).BUTTONS.APPLY}
        </Button>
      </div>
    </div>
  );
}

export default ShortcutFilterByDate;
