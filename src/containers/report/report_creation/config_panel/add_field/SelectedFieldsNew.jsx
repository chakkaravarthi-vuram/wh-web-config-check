import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames/bind';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import CloseIconNewSmall from 'assets/icons/CloseIconNewSmall';
import {
  keydownOrKeypessEnterHandle,
  useClickOutsideDetector,
} from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import styles from './AddReportFieldNew.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import { AGGREGATE_TYPE, REPORT_STRINGS } from '../../../Report.strings';
import { getOutputKey } from '../../ReportCreation.utils';
import { getSortBySelectedFieldValue } from '../ConfigPanel.utils';
import jsUtils from '../../../../../utils/jsUtility';
import { dataChange } from '../../../../../redux/reducer/ReportReducer';
import Config from '../fields/Config';
import { onClickPivotAddFiled } from './AddReportFieldNew.utils';
import ReportFieldConfiguration from './ReportFieldConfiguration';
import {
  constructValidationData,
  dataSchema,
} from '../../../Reports.validation';
import { validate } from '../../../../../utils/UtilityFunctions';
import { FIELD_TYPE } from '../../../../../utils/constants/form_fields.constant';

function SelectedFieldsNew(props) {
  const {
    index,
    field,
    field: { fieldDisplayName, output_key, aggregation_type, isFieldDeleted },
    reports,
    onGetChartData,
    onSetChartAction,
    onClickReportOption,
    isNonTableRollup,
    isNumericRollup,
    axis,
    fieldEdit,
    setFieldEdit,
    updateVisualizationType,
    onChangeLocalState,
    localState,
  } = props;
  const filterBtnRef = useRef();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { ERRORS } = REPORT_STRINGS(t);
  const state = jsUtils.cloneDeep(useSelector((store) => store.ReportReducer));

  const onSelectedFieldsDeleteClickHandler = (index) => {
    const clonedReports = jsUtils.cloneDeep(reports);
    const deletingField = clonedReports.selectedFieldsFromReport.find(
      (_, i) => i === index,
    );
    clonedReports.selectedFieldsFromReport =
      clonedReports.selectedFieldsFromReport.filter((_, i) => i !== index);
    clonedReports.chartData = [];
    clonedReports.chartLabel = [];
    clonedReports.distinct_value = false;
    delete clonedReports.is_roundup;
    delete clonedReports.roundup_value;
    let sortValue = deletingField?.output_key;
    if (deletingField?.axis === 'y') {
      sortValue = getOutputKey(
        deletingField.output_key,
        deletingField.aggregation_type,
      );
    }
    if (
      clonedReports.additionalConfiguration.sortBySelectedFieldValue ===
      sortValue
    ) {
      const { sortBySelectedFieldValue, sortBySelectedValue } =
        getSortBySelectedFieldValue(
          t,
          jsUtils.cloneDeep(clonedReports.selectedFieldsFromReport),
        );
      clonedReports.additionalConfiguration.sortBySelectedFieldValue =
        sortBySelectedFieldValue;
      clonedReports.additionalConfiguration.sortBySelectedValue =
        sortBySelectedValue;
    }

    // update axis count
    if (axis) {
      clonedReports.fieldCount[axis] -= 1;
      if (clonedReports.fieldCount.x + clonedReports.fieldCount.y === 0) {
        clonedReports.is_unique_combination = false;
      }
    }
    if (axis === 'x') {
      clonedReports.chartSelectedRange = [];
      clonedReports.isRangeSelected = false;
      dispatch(
        dataChange({
          data: {
            dayFilterData: EMPTY_STRING,
            monthFilterData: EMPTY_STRING,
            yearFilterData: EMPTY_STRING,
            currencyFilterList: [],
            selectedCurrencyFilter: null,
          },
        }),
      );
      state.dayFilterData = EMPTY_STRING;
      state.monthFilterData = EMPTY_STRING;
      state.yearFilterData = EMPTY_STRING;
      state.currencyFilterList = [];
      state.selectedCurrencyFilter = null;
    }
    if (axis === 'y') {
      clonedReports.is_break_down = false;
    }
    state.reports = clonedReports;
    onGetChartData(clonedReports, undefined, state);
    updateVisualizationType(clonedReports.fieldCount.y);
  };

  const onSelectedFieldsEditClickHandler = (
    dimensionsValue,
    _aggregation_type,
  ) => {
    const clonedReports = jsUtils.cloneDeep(reports);
    const {
      chartSelectedRange,
      isRangeSelected,
      is_break_down,
      is_unique_combination,
    } = clonedReports;
    onChangeLocalState({
      chartSelectedRange,
      isRangeSelected,
      is_break_down,
      is_unique_combination,
    });
    if (dimensionsValue) {
      clonedReports.chartDDSelectedDimensionsValue = dimensionsValue;
      const selectedObject = jsUtils.find(
        clonedReports.selectedFieldsFromReport,
        {
          output_key: dimensionsValue,
          aggregation_type: _aggregation_type,
        },
      );
      const {
        fieldDisplayName,
        ddMonthYearSelectedValue = EMPTY_STRING,
        skipNullValues,
        aggregation_type,
        range = [],
        distinct_value,
        is_roundup,
        roundup_value,
      } = selectedObject;
      clonedReports.fieldDisplayNameSelectedValue = fieldDisplayName;
      if (!jsUtils.isEmpty(range)) {
        clonedReports.chartSelectedRange = range;
      }
      clonedReports.chartsMeasureSelectedValue =
        aggregation_type || AGGREGATE_TYPE.NONE;
      clonedReports.ddMonthYearSelectedValue =
        aggregation_type || ddMonthYearSelectedValue;
      clonedReports.skipNullValues = skipNullValues;
      clonedReports.distinct_value = distinct_value;
      if (is_roundup) {
        clonedReports.is_roundup = is_roundup;
        clonedReports.roundup_value = roundup_value;
      } else {
        delete clonedReports.is_roundup;
        delete clonedReports.roundup_value;
      }
      onSetChartAction(clonedReports);
      setFieldEdit({
        isEdit: true,
        output_key: dimensionsValue,
        measureDimension: aggregation_type || AGGREGATE_TYPE.NONE,
        monthYearValue: aggregation_type || ddMonthYearSelectedValue,
        skipNullValues: skipNullValues,
        distinct_value,
        is_roundup,
        roundup_value,
        fieldDisplayName,
      });
    }
  };

  const openFilter = () => {
    if (open || isFieldDeleted) return;
    onSelectedFieldsEditClickHandler(output_key, aggregation_type);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  useClickOutsideDetector(filterBtnRef, close);

  const onBlur = (e) => {
    if (
      (e.relatedTarget && filterBtnRef.current?.contains(e.relatedTarget)) ||
      (!e.relatedTarget && filterBtnRef.current?.contains(e.target))
    ) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    close();
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectedFieldsDeleteClickHandler(index);
  };
  const onClickApplyField = () => {
    const clonedReports = jsUtils.cloneDeep(reports);
    if (field?.fieldType === FIELD_TYPE.CURRENCY && reports?.isSkipNullChanged && axis === 'x') {
      dispatch(
        dataChange({
          data: {
            currencyFilterList: [],
          },
        }),
      );
      clonedReports.isSkipNullChanged = false;
    }
    onClickPivotAddFiled(
      t,
      clonedReports,
      axis,
      fieldEdit,
      setFieldEdit,
      onSetChartAction,
      onGetChartData,
      onClickReportOption,
      updateVisualizationType,
      true,
      localState,
    );
    if (
      axis === 'x'
        ? !localState.isRangeSelected ||
          jsUtils.isEmpty(
            validate(
              constructValidationData(localState.chartSelectedRange),
              dataSchema,
            ),
          )
        : !reports?.is_roundup ||
          reports?.roundup_value ||
          reports?.roundup_value === 0
    ) {
      close();
    }
  };

  const onClickDiscardField = (e) => {
    e.stopPropagation();
    e.preventDefault();
    close();
  };

  const currentComponent = (
    <Config
      isBackNeeded
      mainContent={
        <ReportFieldConfiguration
          reports={reports}
          onGetChartData={onGetChartData}
          onSetChartAction={onSetChartAction}
          isNonTableRollup={isNonTableRollup}
          axis={axis}
          field={field}
          isNumericRollup={isNumericRollup}
          isAppliedField
          index={index}
          isFromSelected
          localState={localState}
          onLocaleStateChange={onChangeLocalState}
        />
      }
      onClickApply={onClickApplyField}
      onClickDiscard={onClickDiscardField}
    />
  );

  return (
    <div className={gClasses.MB8}>
      <div className={gClasses.PositionRelative} ref={filterBtnRef}>
        <button
          className={cx(styles.FilterBtn, styles.SelectedField, {
            [styles.Error]: isFieldDeleted,
          })}
          ref={filterBtnRef}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && openFilter()}
          onClick={openFilter}
          onBlur={onBlur}
        >
          <div className={styles.FilterTextCompleted}>
            <div className={gClasses.Ellipsis}>{fieldDisplayName}</div>
            <button
              className={cx(
                gClasses.CursorPointer,
                gClasses.ClickableElement,
                styles.closeBtn,
              )}
              onClick={handleCloseClick}
              onKeyDown={(e) =>
                keydownOrKeypessEnterHandle(e) && e.stopPropagation()
              }
            >
              <CloseIconNewSmall />
            </button>
          </div>
        </button>
        {open && (
          <div
            className={cx(styles.FilterDropdown, {
              [styles.Completed]: true,
            })}
          >
            {currentComponent}
          </div>
        )}
      </div>
      {isFieldDeleted && (
        <div
          role="alert"
          aria-hidden="false"
          className={cx(gClasses.FTwo12RedV2)}
        >
          {ERRORS.FIELD_DELETED_FROM_SOURCE}
        </div>
      )}
    </div>
  );
}

SelectedFieldsNew.propTypes = {
  index: PropTypes.number,
  field: PropTypes.objectOf({
    fieldDisplayName: PropTypes.string,
    output_key: PropTypes.string,
    aggregation_type: PropTypes.string,
    isFieldDeleted: PropTypes.bool,
  }),
  reports: PropTypes.objectOf({
    is_roundup: PropTypes.bool,
    roundup_value: PropTypes.number,
  }),
  onGetChartData: PropTypes.func,
  onSetChartAction: PropTypes.func,
  onClickReportOption: PropTypes.func,
  isNonTableRollup: PropTypes.bool,
  isNumericRollup: PropTypes.bool,
  axis: PropTypes.string,
  fieldEdit: PropTypes.object,
  setFieldEdit: PropTypes.func,
  updateVisualizationType: PropTypes.func,
  onChangeLocalState: PropTypes.func,
  localState: PropTypes.objectOf({
    isRangeSelected: PropTypes.bool,
    chartSelectedRange: PropTypes.array,
  }),
};

export default SelectedFieldsNew;
