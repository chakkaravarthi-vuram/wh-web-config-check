import React from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import DatePicker from 'components/form_components/date_picker/DatePicker';
import Button from 'components/form_components/button/Button';
import { BUTTON_TYPE } from 'utils/Constants';
import { BS } from 'utils/UIConstants';
import { useTranslation } from 'react-i18next';
import ADMIN_ACCOUNTS_SUMMARY_STRINGS from '../../AccountsSummary.strings';

function CustomGranularity(props) {
  const {
    startDate,
    endDate,
    onChangeDate,
    onClickCustom,
    startDateError,
    endDateError,
  } = props;

  const { t } = useTranslation();

  return (
    <div>
      <div className={BS.FLEX_COLUMN}>
        <div className={cx(BS.FLEX_ROW)}>{t(ADMIN_ACCOUNTS_SUMMARY_STRINGS.GRANULARITY.CUSTOM_LABEL)}</div>
        <div className={cx(BS.D_FLEX)}>
          <DatePicker
            hideLabel
            getDate={(selectedDate) => onChangeDate(selectedDate, true)}
            date={startDate}
            errorMessage={startDateError}
            className={cx(BS.MARGIN_0, BS.PADDING_0)}
          />
        </div>
        <div className={BS.D_FLEX}>
          <DatePicker
            hideLabel
            getDate={(selectedDate) => onChangeDate(selectedDate, false)}
            date={endDate}
            errorMessage={endDateError}
            className={cx(BS.MARGIN_0, BS.PADDING_0)}
          />
        </div>
        <div className={cx(BS.D_FLEX, gClasses.ZIndex2)}>
          <Button
            id="btnCustomGranularity"
            buttonType={BUTTON_TYPE.PRIMARY}
            className={cx(BS.TEXT_NO_WRAP)}
            onClick={() => onClickCustom()}
          >
            {t(ADMIN_ACCOUNTS_SUMMARY_STRINGS.GRANULARITY.ADD_FILTER)}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CustomGranularity;
