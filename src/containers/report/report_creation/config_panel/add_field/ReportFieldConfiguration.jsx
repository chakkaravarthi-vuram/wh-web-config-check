import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { useDispatch } from 'react-redux';
import {
  Checkbox,
  ECheckboxSize,
  SingleDropdown,
} from '@workhall-pvt-lmt/wh-ui-library';
import { BS } from 'utils/UIConstants';

import jsUtils from '../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { validate } from '../../../../../utils/UtilityFunctions';
import { FIELD_TYPE } from '../../../../../utils/constants/form_fields.constant';
import Dropdown from '../../../../../components/form_components/dropdown/Dropdown';
import Input from '../../../../../components/form_components/input/Input';
import RadioGroup, {
  RADIO_GROUP_TYPE,
} from '../../../../../components/form_components/radio_group/RadioGroup';
import gClasses from '../../../../../scss/Typography.module.scss';
import RangeSetter from '../../../../../components/rangesetter/RangeSetter';
import {
  constructValidationData,
  dataSchema,
  fieldAddReportValidateSchema,
} from '../../../Reports.validation';
import { dataChange } from '../../../../../redux/reducer/ReportReducer';
import {
  AGGREGATE_SUM_AVG_TYPE,
  AGGREGATE_TYPE,
} from '../../../Report.strings';
import { getMeasureListAndConditions } from './AddReportFieldNew.utils';
import CONFIG_PANEL_STRINGS from '../ConfigPanel.strings';

function ReportFieldConfiguration(props) {
  const { t } = useTranslation();
  const {
    reports,
    reports: {
      chartDDSelectedDimensionsValue,
      ddMonthYearSelectedValue,
      fieldDisplayNameSelectedValue,
      chartsMeasureSelectedValue,
      skipNullValues,
      fieldCount,
      report: { error_list },
      dataRangeErrorList,
      distinct_value,
      is_roundup,
      roundup_value,
    },
    onSetChartAction,
    isNonTableRollup = false,
    isNumericRollup = false,
    axis,
    field: { supported_aggregations, fieldType, reference_name },
    isFromSelected,
    onLocaleStateChange,
    localState,
    localState: {
      is_break_down,
      chartSelectedRange,
      isRangeSelected,
      is_unique_combination,
    },
  } = props;
  const { FIELD_CONFIG } = CONFIG_PANEL_STRINGS(t);
  const dispatch = useDispatch();

  const isRoundUpAvailable =
    [FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY].includes(fieldType) &&
    AGGREGATE_SUM_AVG_TYPE.includes(chartsMeasureSelectedValue);
  const {
    MEASURE_OPTION_LIST,
    isAggregation,
    ddIsShowMonthYear,
    hideMeasureOptionLabel,
  } = getMeasureListAndConditions(
    fieldType,
    supported_aggregations,
    axis,
    isNumericRollup,
  );

  const onSelectChangeMonthYearHandler = (event) => {
    const ddMonthYearSelectedValue = event.target.value;
    const clonedReports = jsUtils.cloneDeep(reports);
    if (ddMonthYearSelectedValue) {
      clonedReports.ddMonthYearSelectedValue = ddMonthYearSelectedValue;
    }
    dispatch(
      dataChange({
        data: {
          dayFilterData: EMPTY_STRING,
          monthFilterData: EMPTY_STRING,
          yearFilterData: EMPTY_STRING,
        },
      }),
    );
    onSetChartAction(clonedReports);
  };

  const onClickChartMeasureHandler = (measureDimensionValue) => {
    const clonedReports = jsUtils.cloneDeep(reports);
    if (measureDimensionValue) {
      if (
        [FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY].includes(fieldType) &&
        !AGGREGATE_SUM_AVG_TYPE.includes(measureDimensionValue)
      ) {
        delete clonedReports.is_roundup;
        delete clonedReports.roundup_value;
      }

      clonedReports.chartsMeasureSelectedValue = measureDimensionValue;
      // Get Selected Aggregation Label
      const { label: measureLabel, value: measureValue } = jsUtils.find(
        jsUtils.cloneDeep(MEASURE_OPTION_LIST),
        {
          value: measureDimensionValue,
        },
      );

      const { chartDDSelectedDimensionsValue, inputFieldsForReport } =
        clonedReports;
      // Get Dimension Field Name
      const { label: dimensionLabel } = jsUtils.find(
        jsUtils.cloneDeep(inputFieldsForReport),
        {
          output_key: chartDDSelectedDimensionsValue,
        },
      );
      if (measureValue !== AGGREGATE_TYPE.NONE) {
        clonedReports.fieldDisplayNameSelectedValue = `${measureLabel} ${
          CONFIG_PANEL_STRINGS(t).FIELD_CONFIG.OF
        } ${dimensionLabel}`;
      } else {
        clonedReports.fieldDisplayNameSelectedValue = dimensionLabel;
      }
    }
    onSetChartAction(clonedReports);
  };

  const onChangeFieldDisplayName = (event) => {
    const fieldDisplayName = event.target.value;
    const clonedReports = jsUtils.cloneDeep(reports);
    clonedReports.report.error_list = validate(
      { fieldDisplayNameSelectedValue: fieldDisplayName },
      fieldAddReportValidateSchema,
    );
    clonedReports.fieldDisplayNameSelectedValue = fieldDisplayName;
    onSetChartAction(clonedReports);
  };

  const onSkipNullValuesChange = () => {
    const clonedReports = jsUtils.cloneDeep(reports);
    clonedReports.skipNullValues = !clonedReports.skipNullValues;
    clonedReports.isSkipNullChanged = true;
    onSetChartAction(clonedReports);
  };

  const onRangeChangeHandler = (index, rangeType, value) => {
    const cloneRange = jsUtils.cloneDeep(chartSelectedRange);
    const clonedReports = jsUtils.cloneDeep(reports);
    cloneRange[index].boundary[rangeType] = value
      ? Number(value)
      : EMPTY_STRING;
    if (!jsUtils.isEmpty(clonedReports.dataRangeErrorList)) {
      clonedReports.dataRangeErrorList = validate(
        constructValidationData(cloneRange),
        dataSchema,
      );
    }
    onSetChartAction(clonedReports);
    onLocaleStateChange({ ...localState, chartSelectedRange: cloneRange });
  };

  const onRangeLabelChangeHandler = (index, value) => {
    const cloneRange = jsUtils.cloneDeep(chartSelectedRange);
    const clonedReports = jsUtils.cloneDeep(reports);
    cloneRange[index].label = value;
    if (!jsUtils.isEmpty(clonedReports.dataRangeErrorList)) {
      clonedReports.dataRangeErrorList = validate(
        constructValidationData(cloneRange),
        dataSchema,
      );
    }
    onSetChartAction(clonedReports);
    onLocaleStateChange({ ...localState, chartSelectedRange: cloneRange });
  };

  const onRangeDeleteHandler = (Index) => {
    let cloneRange = jsUtils.cloneDeep(chartSelectedRange);
    const updateData = { isRangeSelected, chartSelectedRange, is_break_down };
    const clonedReports = jsUtils.cloneDeep(reports);
    jsUtils.remove(cloneRange, { index: Index });
    cloneRange = cloneRange?.map((data, index) => {
      data.index = index + 1;
      return data;
    });
    if (jsUtils.isEmpty(cloneRange)) {
      updateData.isRangeSelected = false;
    }
    updateData.chartSelectedRange = cloneRange;
    clonedReports.dataRangeErrorList = validate(
      constructValidationData(cloneRange),
      dataSchema,
    );
    onSetChartAction(clonedReports);
    onLocaleStateChange(updateData);
  };

  const onRangeAddHandler = () => {
    const cloneRange = jsUtils.cloneDeep(chartSelectedRange);
    cloneRange.push({
      boundary: [],
      label: EMPTY_STRING,
      index: cloneRange.length + 1,
    });
    onLocaleStateChange({ ...localState, chartSelectedRange: cloneRange });
  };

  const onRangeClickHandler = () => {
    const clonedReports = jsUtils.cloneDeep(reports);
    if (clonedReports.isRangeSelected) {
      clonedReports.dataRangeErrorList = {};
    }
    let cloneRange = jsUtils.cloneDeep(chartSelectedRange);
    if (!isRangeSelected) {
      cloneRange = [
        {
          label: EMPTY_STRING,
          boundary: [],
          index: 1,
        },
      ];
    }
    clonedReports.dataRangeErrorList = {};
    onSetChartAction(clonedReports);
    onLocaleStateChange({
      ...localState,
      chartSelectedRange: cloneRange,
      isRangeSelected: !isRangeSelected,
    });
    onSetChartAction(clonedReports);
  };

  const onBreakDownClickHandler = () => {
    onLocaleStateChange({ ...localState, is_break_down: !is_break_down });
  };

  const onUniqueCombinationClickHandler = () => {
    onLocaleStateChange({
      ...localState,
      is_unique_combination: !is_unique_combination,
    });
  };

  const onUniqueValueClickHandler = () => {
    const clonedReports = jsUtils.cloneDeep(reports);
    clonedReports.distinct_value = !clonedReports.distinct_value;
    onSetChartAction(clonedReports);
  };

  const onIsRoundupClickHandler = () => {
    const clonedReports = jsUtils.cloneDeep(reports);
    clonedReports.is_roundup = !clonedReports.is_roundup;
    if (!clonedReports.is_roundup) {
      delete clonedReports.roundup_value;
    }
    onSetChartAction(clonedReports);
  };

  const onChangeRoundupValue = (value) => {
    const clonedReports = jsUtils.cloneDeep(reports);
    clonedReports.roundup_value = value;
    delete clonedReports.report.error_list.roundup_value;
    onSetChartAction(clonedReports);
  };

  return (
    <>
      <h4 className={cx(gClasses.FW600, gClasses.FS13, gClasses.MB8)}>
        {FIELD_CONFIG.TITLE}
      </h4>
      <div>
        <div className={cx(BS.D_FLEX, BS.FLEX_COLUMN)}>
          {!isNonTableRollup && ddIsShowMonthYear && (
            <Dropdown
              id={FIELD_CONFIG.DD_MONTH_YEAR.ID}
              label={FIELD_CONFIG.DD_MONTH_YEAR.LABEL}
              placeholder={FIELD_CONFIG.DD_MONTH_YEAR.PLACEHOLDER}
              optionList={MEASURE_OPTION_LIST}
              onChange={onSelectChangeMonthYearHandler}
              selectedValue={ddMonthYearSelectedValue}
              readOnly={chartDDSelectedDimensionsValue === EMPTY_STRING}
              disablePopper
              strictlySetSelectedValue
              autoFocus
            />
          )}
          {!isNonTableRollup && isAggregation && (
            <RadioGroup
              id={FIELD_CONFIG.MEASURE_OPTION.ID}
              label={FIELD_CONFIG.MEASURE_OPTION.LABEL}
              hideLabel={hideMeasureOptionLabel}
              optionList={MEASURE_OPTION_LIST}
              onClick={(value) => onClickChartMeasureHandler(value)}
              selectedValue={chartsMeasureSelectedValue}
              type={RADIO_GROUP_TYPE.TYPE_4}
              innerClassName={BS.D_BLOCK}
            />
          )}
          <Input
            id={FIELD_CONFIG.FILED_DISPLAY_NAME.ID}
            label={FIELD_CONFIG.FILED_DISPLAY_NAME.LABEL}
            placeholder={FIELD_CONFIG.FILED_DISPLAY_NAME.PLACEHOLDER}
            onChangeHandler={onChangeFieldDisplayName}
            value={fieldDisplayNameSelectedValue}
            errorMessage={error_list[FIELD_CONFIG.FILED_DISPLAY_NAME.ID]}
            required
            autoFocus
            readOnly={chartDDSelectedDimensionsValue === EMPTY_STRING}
          />
          {reference_name && (
            <div
              className={cx(
                gClasses.FW600,
                gClasses.FS14,
                gClasses.MB10,
                gClasses.DisplayFlex,
              )}
            >
              {FIELD_CONFIG.FILED_DISPLAY_NAME.REF}
              <div className={gClasses.ML5}>{reference_name}</div>
            </div>
          )}
          {(fieldType === FIELD_TYPE.NUMBER ||
            fieldType === FIELD_TYPE.CURRENCY) &&
            axis === 'x' && (
              <Checkbox
                details={{
                  label: FIELD_CONFIG.RANGE.LABEL,
                  value: FIELD_CONFIG.RANGE.VALUE,
                }}
                className={gClasses.MB8}
                isValueSelected={isRangeSelected}
                onClick={onRangeClickHandler}
                size={ECheckboxSize.SM}
              />
            )}
          {(fieldType === FIELD_TYPE.NUMBER ||
            fieldType === FIELD_TYPE.CURRENCY) &&
            isRangeSelected &&
            axis === 'x' && (
              <RangeSetter
                onChangeHandler={onRangeChangeHandler}
                range={chartSelectedRange}
                onDeleteHandler={onRangeDeleteHandler}
                onRangeAddHandler={onRangeAddHandler}
                onRangeLabelChangeHandler={onRangeLabelChangeHandler}
                error={dataRangeErrorList}
              />
            )}
          {isRoundUpAvailable && (
            <Checkbox
              details={{
                label: FIELD_CONFIG.ROUNDUP_VALUE.LABEL,
                value: FIELD_CONFIG.ROUNDUP_VALUE.VALUE,
              }}
              isValueSelected={is_roundup}
              className={gClasses.MB8}
              onClick={onIsRoundupClickHandler}
              size={ECheckboxSize.SM}
            />
          )}
          {is_roundup && isRoundUpAvailable && (
            <SingleDropdown
              placeholder={FIELD_CONFIG.ROUNDUP_VALUE.PLACEHOLDER}
              selectedValue={roundup_value}
              optionList={FIELD_CONFIG.ROUNDUP_VALUE.OPTION_LIST}
              onClick={onChangeRoundupValue}
              className={gClasses.MB10}
              errorMessage={error_list?.roundup_value}
            />
          )}
          {fieldType !== FIELD_TYPE.DATETIME &&
            fieldType !== FIELD_TYPE.DATE &&
            fieldType !== FIELD_TYPE.LINK &&
            fieldType !== FIELD_TYPE.NUMBER &&
            fieldType !== FIELD_TYPE.CURRENCY &&
            fieldCount?.y <= 1 &&
            (fieldCount?.y !== 1 || isFromSelected) &&
            axis === 'y' && (
              <Checkbox
                details={{
                  label: FIELD_CONFIG.BREAK_DOWN.LABEL,
                  value: FIELD_CONFIG.BREAK_DOWN.VALUE,
                }}
                isValueSelected={is_break_down}
                className={gClasses.MB8}
                onClick={onBreakDownClickHandler}
              />
            )}
          {(fieldType === FIELD_TYPE.USER_TEAM_PICKER ||
            fieldType === FIELD_TYPE.DATA_LIST ||
            fieldType === FIELD_TYPE.CHECKBOX) &&
            axis && (
              <Checkbox
                details={{
                  label: FIELD_CONFIG.UNIQUE_COMBINATION.LABEL,
                  value: FIELD_CONFIG.UNIQUE_COMBINATION.VALUE,
                }}
                className={gClasses.MB8}
                isValueSelected={is_unique_combination}
                onClick={onUniqueCombinationClickHandler}
              />
            )}
          {isNumericRollup && (
            <Checkbox
              details={{
                label: FIELD_CONFIG.UNIQUE_VALUE.LABEL,
                value: FIELD_CONFIG.UNIQUE_VALUE.VALUE,
              }}
              isValueSelected={distinct_value}
              className={gClasses.MB8}
              onClick={onUniqueValueClickHandler}
            />
          )}
          <Checkbox
            details={{
              label: FIELD_CONFIG.SKIP_NULL_VALUES.LABEL,
              value: FIELD_CONFIG.SKIP_NULL_VALUES.VALUE,
            }}
            isValueSelected={skipNullValues}
            className={gClasses.MB8}
            onClick={onSkipNullValuesChange}
          />
        </div>
      </div>
    </>
  );
}

ReportFieldConfiguration.propTypes = {
  reports: PropTypes.objectOf({
    chartDDSelectedDimensionsValue: PropTypes.string,
    ddMonthYearSelectedValue: PropTypes.string,
    fieldDisplayNameSelectedValue: PropTypes.string,
    chartsMeasureSelectedValue: PropTypes.string,
    skipNullValues: PropTypes.bool,
    fieldCount: PropTypes.objectOf({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    report: PropTypes.objectOf({ error_list: PropTypes.object }),
    dataRangeErrorList: PropTypes.object,
    distinct_value: PropTypes.bool,
    is_roundup: PropTypes.bool,
    roundup_value: PropTypes.number,
  }),
  onSetChartAction: PropTypes.func,
  isNonTableRollup: PropTypes.bool,
  isNumericRollup: PropTypes.bool,
  axis: PropTypes.string,
  field: PropTypes.objectOf({
    supported_aggregations: PropTypes.array,
    fieldType: PropTypes.string,
    reference_name: PropTypes.string,
  }),
  isFromSelected: PropTypes.bool,
  onLocaleStateChange: PropTypes.func,
  localState: PropTypes.objectOf({
    is_break_down: PropTypes.bool,
    isRangeSelected: PropTypes.bool,
    chartSelectedRange: PropTypes.array,
    is_unique_combination: PropTypes.bool,
  }),
};

export default ReportFieldConfiguration;
