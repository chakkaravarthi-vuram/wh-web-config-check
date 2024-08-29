import cx from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Checkbox, SingleDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../../../../scss/Typography.module.scss';
import { BS } from '../../../../../utils/UIConstants';
import jsUtility from '../../../../../utils/jsUtility';
import { getSortByDimensionOptionList } from '../ConfigPanel.utils';
import CONFIG_PANEL_STRINGS, { SORT_BY_VALUE } from '../ConfigPanel.strings';

function AdditionalConfiguration(props) {
  const {
    onGetChartData,
    onClickReportOption,
    reports,
    reports: {
      selectedFieldsFromReport,
      isCurrencyTypeSameFormat,
      additionalConfiguration: {
        isShowTotal,
        sortBySelectedFieldValue,
        sortBySelectedValue,
      },
    },
    isChart,
    isNumericRollup,
  } = props;
  const { t } = useTranslation();
  const { SHOW_TOTAL, SORT_BY, SORT_BY_ORDER } = CONFIG_PANEL_STRINGS(t);

  const onSortFieldChange = (field) => {
    const sortBySelectedFieldValue = field;
    if (sortBySelectedFieldValue) {
      const clonedReports = jsUtility.cloneDeep(reports);
      clonedReports.additionalConfiguration.sortBySelectedFieldValue =
        sortBySelectedFieldValue;
      clonedReports.additionalConfiguration.sortBySelectedValue =
        SORT_BY_VALUE.ASC;
      onGetChartData(clonedReports);
      onClickReportOption();
    }
  };

  const onSortOrderChange = (type) => {
    const sortBySelectedValue = type;
    if (sortBySelectedValue) {
      const clonedReports = jsUtility.cloneDeep(reports);
      clonedReports.additionalConfiguration.sortBySelectedValue =
        sortBySelectedValue;
      onGetChartData(clonedReports);
      onClickReportOption();
    }
  };

  const onShowTotalChange = () => {
    if (!isChart && !isNumericRollup) {
      const clonedReports = jsUtility.cloneDeep(reports);
      clonedReports.additionalConfiguration.isShowTotal = !isShowTotal;
      onGetChartData(clonedReports);
      onClickReportOption();
    }
  };

  const optionList = getSortByDimensionOptionList(selectedFieldsFromReport);

  return (
    <>
      <div className={cx(BS.D_FLEX, gClasses.MB8)}>
        <Checkbox
          details={{
            label: SHOW_TOTAL.LABEL,
            value: SHOW_TOTAL.VALUE,
          }}
          isValueSelected={isShowTotal}
          checkboxViewLabelClassName={cx(gClasses.MB4)}
          onClick={onShowTotalChange}
          disabled={isChart || isNumericRollup || isCurrencyTypeSameFormat}
        />
      </div>

      <SingleDropdown
        id={SORT_BY.ID}
        optionList={optionList}
        dropdownViewProps={{
          labelName: SORT_BY.LABEL,
          placeholder: SORT_BY.PLACEHOLDER,
          disabled: isNumericRollup,
        }}
        className={cx(gClasses.MB16)}
        onClick={onSortFieldChange}
        selectedValue={sortBySelectedFieldValue}
      />

      <SingleDropdown
        id={SORT_BY_ORDER.ID}
        optionList={SORT_BY_ORDER.OPTION_LIST}
        dropdownViewProps={{
          disabled: isNumericRollup,
        }}
        onClick={onSortOrderChange}
        selectedValue={sortBySelectedValue}
      />
    </>
  );
}

AdditionalConfiguration.propTypes = {
  onGetChartData: PropTypes.func,
  onClickReportOption: PropTypes.func,
  reports: PropTypes.objectOf({
    selectedFieldsFromReport: PropTypes.array,
    isCurrencyTypeSameFormat: PropTypes.bool,
    additionalConfiguration: PropTypes.objectOf({
      isShowTotal: PropTypes.bool,
      sortBySelectedFieldValue: PropTypes.string,
      sortBySelectedValue: PropTypes.string,
    }),
  }),
  isChart: PropTypes.bool,
  isNumericRollup: PropTypes.bool,
};

export default AdditionalConfiguration;
