import jsUtility from 'utils/jsUtility';
import { FORM_POPOVER_STATUS } from 'utils/Constants';
import { validate } from 'utils/UtilityFunctions';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { FIELD_TYPE } from 'utils/constants/form.constant';
import {
  getSortBySelectedFieldValue,
  initialStateFieldEdit,
} from '../ConfigPanel.utils';
import { AGGREGATE_TYPE, REPORT_STRINGS } from '../../../Report.strings';
import {
  constructValidationData,
  dataSchema,
  fieldAddReportValidateSchema,
} from '../../../Reports.validation';
import CONFIG_PANEL_STRINGS from '../ConfigPanel.strings';
import { showToastPopover } from '../../../../../utils/UtilityFunctions';

const isCheckSameFieldSelection = (
  t,
  reports,
  fieldEdit,
  selectedObj,
  isEdit = false,
) => {
  const clonedReports = jsUtility.cloneDeep(reports);
  const { fieldType } = selectedObj;
  let searchedObj = false;
  const isDateField =
    fieldType === FIELD_TYPE.DATE || fieldType === FIELD_TYPE.DATETIME;
  searchedObj = jsUtility.find(clonedReports.selectedFieldsFromReport, {
    output_key: reports.chartDDSelectedDimensionsValue,
    aggregation_type: isDateField
      ? reports.ddMonthYearSelectedValue
      : reports.chartsMeasureSelectedValue,
  });
  if (isEdit && !jsUtility.isEmpty(searchedObj)) {
    if (
      fieldEdit.output_key === searchedObj.output_key &&
      fieldEdit.measureDimension === searchedObj.aggregation_type
    ) {
      return !(
        searchedObj?.fieldDisplayName !==
          reports.fieldDisplayNameSelectedValue ||
        searchedObj?.skipNullValues !== reports.skipNullValues ||
        searchedObj?.range !== reports.chartSelectedRange
      );
    }
  }

  if (!jsUtility.isEmpty(searchedObj)) {
    const { ERRORS } = REPORT_STRINGS(t);
    const error = {
      title: ERRORS.DO_NOT_SELECT_SAME_FIELD,
      status: FORM_POPOVER_STATUS.SERVER_ERROR,
      isVisible: true,
    };
    showToastPopover(
      error?.title,
      EMPTY_STRING,
      FORM_POPOVER_STATUS.SERVER_ERROR,
      true,
    );
    return true;
  }
  return false;
};

const updateSelectedDimensionObjectProperties = (
  selectedDimensionsObject,
  clonedReports,
  axis,
  isDateTime,
  isAddField = false,
) => {
  const {
    chartsMeasureSelectedValue,
    ddMonthYearSelectedValue,
    chartSelectedRange,
    isRangeSelected,
    fieldDisplayNameSelectedValue,
    skipNullValues,
    distinct_value,
    is_roundup,
    roundup_value,
  } = clonedReports;
  selectedDimensionsObject.measureDimension =
    !isAddField && isDateTime
      ? AGGREGATE_TYPE.NONE
      : chartsMeasureSelectedValue;
  selectedDimensionsObject.fieldDisplayName = fieldDisplayNameSelectedValue;
  selectedDimensionsObject.measureLabel = fieldDisplayNameSelectedValue;
  selectedDimensionsObject.aggregation_type = isDateTime
    ? ddMonthYearSelectedValue
    : chartsMeasureSelectedValue;
  selectedDimensionsObject.skipNullValues = skipNullValues;
  selectedDimensionsObject.distinct_value = distinct_value;
  if (
    [FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY].includes(
      selectedDimensionsObject.field_type,
    )
  ) {
    selectedDimensionsObject.is_roundup = is_roundup;
    if (is_roundup) {
      selectedDimensionsObject.roundup_value = roundup_value;
    }
  }

  // Group By Year or Month Added
  if (isDateTime) {
    selectedDimensionsObject.ddMonthYearSelectedValue =
      ddMonthYearSelectedValue;
  }
  selectedDimensionsObject.isMeasure =
    selectedDimensionsObject.aggregation_type !== AGGREGATE_TYPE.NONE;

  // Add axis type
  if (axis) {
    selectedDimensionsObject.axis = axis;
  }
  if ((isAddField || !isDateTime) && axis === 'x') {
    if (!isRangeSelected) {
      delete selectedDimensionsObject.range;
    } else {
      selectedDimensionsObject.range = chartSelectedRange;
    }
  }
  return selectedDimensionsObject;
};

const getSelectedDimensionObject = (
  t,
  reports,
  clonedReports,
  fieldEdit,
  axis,
  selectedData,
  isDateTime,
) => {
  const selectedDimensionsObject = jsUtility.find(
    jsUtility.cloneDeep(clonedReports.inputFieldsForReport),
    {
      output_key: selectedData.output_key,
    },
  );
  const isFieldExists = isCheckSameFieldSelection(
    t,
    reports,
    fieldEdit,
    selectedDimensionsObject,
    true,
  );
  if (!isFieldExists) {
    return updateSelectedDimensionObjectProperties(
      selectedDimensionsObject,
      clonedReports,
      axis,
      isDateTime,
      false,
    );
  }
  return null;
};

const getEditedSelectedDimensions = (
  t,
  reports,
  clonedReports,
  fieldEdit,
  axis,
) => {
  const { chartSelectedRange } = clonedReports;
  const clonedSelectedDimensions = jsUtility.cloneDeep(
    clonedReports.selectedFieldsFromReport,
  );
  const editedSelectedDimensions = clonedSelectedDimensions?.map(
    (selectedData) => {
      if (
        selectedData.output_key === fieldEdit.output_key &&
        selectedData.aggregation_type === fieldEdit.monthYearValue &&
        (selectedData.fieldType === FIELD_TYPE.DATE ||
          selectedData.fieldType === FIELD_TYPE.DATETIME)
      ) {
        const selectedDimensionsObject = getSelectedDimensionObject(
          t,
          reports,
          clonedReports,
          fieldEdit,
          axis,
          selectedData,
          true,
        );
        if (selectedDimensionsObject !== null) {
          return selectedDimensionsObject;
        }
      } else if (
        selectedData.output_key === fieldEdit.output_key &&
        selectedData.aggregation_type === fieldEdit.measureDimension &&
        selectedData.fieldType !== FIELD_TYPE.DATE &&
        selectedData.fieldType !== FIELD_TYPE.DATETIME
      ) {
        const selectedDimensionsObject = getSelectedDimensionObject(
          t,
          reports,
          clonedReports,
          fieldEdit,
          axis,
          selectedData,
          false,
        );
        if (selectedDimensionsObject !== null) {
          return selectedDimensionsObject;
        }
      }
      if (axis === 'x' && jsUtility.isEmpty(chartSelectedRange)) {
        delete selectedData.range;
      } else if (axis === 'x' && !jsUtility.isEmpty(chartSelectedRange)) {
        selectedData.range = chartSelectedRange;
      }

      return selectedData;
    },
  );
  return editedSelectedDimensions;
};

const onPivotAddFieldEdit = (
  t,
  reports,
  clonedReports,
  fieldEdit,
  axis,
  localState,
) => {
  const {
    is_break_down,
    chartSelectedRange,
    isRangeSelected,
    is_unique_combination,
  } = localState;
  clonedReports.chartSelectedRange = chartSelectedRange;
  clonedReports.is_break_down = is_break_down;
  clonedReports.isRangeSelected = isRangeSelected;
  clonedReports.is_unique_combination = is_unique_combination;
  const editedSelectedDimensions = getEditedSelectedDimensions(
    t,
    reports,
    clonedReports,
    fieldEdit,
    axis,
  );
  clonedReports.selectedFieldsFromReport = jsUtility.cloneDeep(
    editedSelectedDimensions,
  );
  const { sortBySelectedFieldValue, sortBySelectedValue } =
    getSortBySelectedFieldValue(t, editedSelectedDimensions, false);
  if (sortBySelectedFieldValue) {
    clonedReports.additionalConfiguration.sortBySelectedFieldValue =
      sortBySelectedFieldValue;
    clonedReports.additionalConfiguration.sortBySelectedValue =
      sortBySelectedValue;
  }

  clonedReports.chartsDimensionsIsVisible = false;
  clonedReports.chartData = [];
  clonedReports.chartLabel = [];
  return clonedReports;
};

const onPivotAddFieldDimension = (
  t,
  clonedReports,
  fieldEdit,
  axis,
  localState,
) => {
  const {
    is_break_down,
    chartSelectedRange,
    isRangeSelected,
    is_unique_combination,
  } = localState;
  clonedReports.chartSelectedRange = chartSelectedRange;
  clonedReports.is_break_down = is_break_down;
  clonedReports.isRangeSelected = isRangeSelected;
  clonedReports.is_unique_combination = is_unique_combination;
  let selectedDimensionsObject = jsUtility.find(
    jsUtility.cloneDeep(clonedReports.inputFieldsForReport),
    {
      output_key: clonedReports.chartDDSelectedDimensionsValue,
    },
  );
  if (!jsUtility.isEmpty(selectedDimensionsObject)) {
    const isFieldExists = isCheckSameFieldSelection(
      t,
      clonedReports,
      fieldEdit,
      selectedDimensionsObject,
    );
    if (!isFieldExists) {
      const isDateTime = [FIELD_TYPE.DATE, FIELD_TYPE.DATETIME].includes(
        selectedDimensionsObject.fieldType,
      );
      selectedDimensionsObject = updateSelectedDimensionObjectProperties(
        selectedDimensionsObject,
        clonedReports,
        axis,
        isDateTime,
        true,
      );

      clonedReports.selectedFieldsFromReport.push(
        jsUtility.cloneDeep(selectedDimensionsObject),
      );
      // This is for next release.
      // if (
      //   clonedReports.additionalConfiguration.sortBySelectedFieldValue ===
      //   EMPTY_STRING
      // ) {
        const { sortBySelectedFieldValue, sortBySelectedValue } =
          getSortBySelectedFieldValue(
            t,
            jsUtility.cloneDeep(clonedReports.selectedFieldsFromReport),
            false,
          );
        if (sortBySelectedFieldValue) {
          clonedReports.additionalConfiguration.sortBySelectedFieldValue =
            sortBySelectedFieldValue;
          clonedReports.additionalConfiguration.sortBySelectedValue =
            sortBySelectedValue;
        }
      // }

      clonedReports.chartData = [];
      clonedReports.chartLabel = [];
      return clonedReports;
    }
  }
  return null;
};

export const onClickPivotAddFiled = (
  t,
  reports,
  axis,
  fieldEdit,
  setFieldEdit,
  onSetChartAction,
  onGetChartData,
  onClickReportOption,
  updateVisualizationType,
  isEdit = false,
  localState = {},
) => {
  const { chartSelectedRange, isRangeSelected } = localState;
  const clonedReports = jsUtility.cloneDeep(reports);
  clonedReports.report.error_list = validate(
    {
      fieldDisplayNameSelectedValue:
        reports.fieldDisplayNameSelectedValue.trim(),
    },
    fieldAddReportValidateSchema,
  );
  let dataRangeError = {};
  if (isRangeSelected) {
    dataRangeError = validate(
      constructValidationData(chartSelectedRange),
      dataSchema,
    );
    clonedReports.dataRangeErrorList = dataRangeError;
  }
  if (
    clonedReports?.is_roundup &&
    !clonedReports.roundup_value &&
    reports?.roundup_value !== 0
  ) {
    clonedReports.report.error_list.roundup_value =
      CONFIG_PANEL_STRINGS(t).FIELD_CONFIG.ROUNDUP_VALUE.REQUIRED;
  }
  if (
    !jsUtility.isEmpty(clonedReports.report.error_list) ||
    !jsUtility.isEmpty(dataRangeError)
  ) {
    onSetChartAction(clonedReports);
  }
  if (
    jsUtility.isEmpty(clonedReports.report.error_list) &&
    jsUtility.isEmpty(dataRangeError)
  ) {
    if (fieldEdit.isEdit || isEdit) {
      // Edit Field
      const pivotAddFieldEdit = onPivotAddFieldEdit(
        t,
        reports,
        clonedReports,
        fieldEdit,
        axis,
        localState,
      );
      onGetChartData(pivotAddFieldEdit);
      setFieldEdit(initialStateFieldEdit);
    } else {
      // Dimension Added.
      const pivotAddFieldDimension = onPivotAddFieldDimension(
        t,
        clonedReports,
        fieldEdit,
        axis,
        localState,
      );
      if (pivotAddFieldDimension !== null) {
        onGetChartData(pivotAddFieldDimension);
        setFieldEdit(initialStateFieldEdit);
      }
    }
    updateVisualizationType(clonedReports.fieldCount.y);
    onClickReportOption();
  }
};

export const initialLocalState = {
  chartSelectedRange: [
    {
      label: EMPTY_STRING,
      boundary: [],
    },
  ],
  isRangeSelected: false,
  is_break_down: false,
  is_unique_combination: false,
};

export const getMeasureListAndConditions = (
  fieldType,
  supported_aggregations,
  axis,
  isNumericRollup,
) => {
  const MEASURE_OPTION_LIST = [];
  let isAggregation = false;
  let ddIsShowMonthYear = false;
  let hideMeasureOptionLabel = true;
  const isDateField = [FIELD_TYPE.DATE, FIELD_TYPE.DATETIME].includes(
    fieldType,
  );
  if (jsUtility.isArray(supported_aggregations)) {
    isAggregation = true;
    supported_aggregations.forEach((aggregate) => {
      if (
        (axis === 'y' && aggregate !== AGGREGATE_TYPE.NONE) ||
        (axis === 'x' && isDateField && aggregate !== AGGREGATE_TYPE.COUNT) ||
        (isNumericRollup &&
          (isDateField
            ? aggregate === AGGREGATE_TYPE.COUNT
            : aggregate !== AGGREGATE_TYPE.NONE)) ||
        (!isNumericRollup && !axis)
      ) {
        MEASURE_OPTION_LIST.push({
          value: aggregate,
          label: jsUtility.upperFirst(aggregate),
        });
      }
    });
  }

  // Measure Option List Label show.
  if ([FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY].includes(fieldType)) {
    if (axis === 'x') {
      isAggregation = false;
    }
    hideMeasureOptionLabel = false;
  }

  // DD Year Month Show.
  if (isDateField && !isNumericRollup) {
    ddIsShowMonthYear = true;
    isAggregation = false;
  }

  return {
    MEASURE_OPTION_LIST,
    isAggregation,
    ddIsShowMonthYear,
    hideMeasureOptionLabel,
  };
};
