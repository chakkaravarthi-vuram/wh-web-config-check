import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import {
  keydownOrKeypessEnterHandle,
  useClickOutsideDetector,
} from 'utils/UtilityFunctions';
import PlusIconBlueNew from 'assets/icons/PlusIconBlueNew';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { useSelector } from 'react-redux';
import styles from './AddReportFieldNew.module.scss';
import gClasses from '../../../../../scss/Typography.module.scss';
import SelectedFieldsNew from './SelectedFieldsNew';
import jsUtils from '../../../../../utils/jsUtility';
import { FIELD_TYPE } from '../../../../../utils/constants/form_fields.constant';
import {
  getGroupedField,
  getSystemAndDataFields,
  getSelectedFieldsByAllSourceFields,
  initialStateFieldEdit,
  getGroupedTableFields,
} from '../ConfigPanel.utils';
import {
  REPORT_VISUALIZATION_TYPES,
  CLUSTERED_TYPES,
  SINGLED_TYPES,
  AGGREGATE_TYPE,
} from '../../../Report.strings';
import Source from '../fields/Source';
import SystemAndData from '../fields/SystemAndData';
import List from '../fields/List';
import Config from '../fields/Config';
import Table from '../fields/Table';
import {
  initialLocalState,
  onClickPivotAddFiled,
} from './AddReportFieldNew.utils';
import ReportFieldConfiguration from './ReportFieldConfiguration';
import {
  constructValidationData,
  dataSchema,
} from '../../../Reports.validation';
import { validate } from '../../../../../utils/UtilityFunctions';
import CONFIG_PANEL_STRINGS, { FIELD_TAB_TYPES } from '../ConfigPanel.strings';

function AddReportField(props) {
  const {
    reports: {
      inputFieldsForReport,
      selectedFieldsFromReport,
      fieldDisplayNameSelectedValue,
      report: { error_list },
      fieldCount,
      is_break_down,
      is_unique_combination,
    },
    reports,
    onSetChartAction,
    onGetChartData,
    onClickReportOption = () => {},
    dashboardList,
    axis,
    isNumericRollup,
    isNonTableRollup,
    visualizationType,
    onVisualizationChange,
  } = props;
  const { t } = useTranslation();
  const { BUTTONS } = CONFIG_PANEL_STRINGS(t);
  const filterBtnRef = useRef();
  const selectedFieldsContainerRef = useRef();
  const isSingleSource = dashboardList?.length === 1;
  const initialCurrentIndex = isSingleSource
    ? FIELD_TAB_TYPES.SYSTEM_AND_DATA_FIELDS
    : FIELD_TAB_TYPES.SOURCE;
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialCurrentIndex);
  const [fieldType, setFieldType] = useState();
  const [context, setContext] = useState(isSingleSource ? dashboardList[0] : {});
  const [systemFields, setSystemFields] = useState([]);
  const [dataFields, setDataFields] = useState([]);
  const [field, setField] = useState(null);
  const [tableFields, setTableFields] = useState([]);
  const [selectedTable, setSelectedTable] = useState(EMPTY_STRING);
  const [selectedTableName, setSelectedTableName] = useState(EMPTY_STRING);
  const [fieldEdit, setFieldEdit] = useState(initialStateFieldEdit);
  const [localState, setLocalState] = useState(initialLocalState);
  const state = jsUtils.cloneDeep(useSelector((store) => store.ReportReducer));
  const {
    reports: { chartSelectedRange, isRangeSelected },
  } = state;
  const defaultMeasureOption = AGGREGATE_TYPE.NONE;
  let currentComponent = null;

  const close = () => {
    setOpen(false);
    setFieldType(EMPTY_STRING);
    setCurrentIndex(initialCurrentIndex);
    setContext(isSingleSource ? dashboardList[0] : {});
    setField(null);
  };

  useClickOutsideDetector(filterBtnRef, close);

  useEffect(() => {
    const contextUuid = context?.context_uuid;
    const filteredChartDimensions = getSelectedFieldsByAllSourceFields(
      inputFieldsForReport,
      contextUuid,
    );

    const [systemFields, dataFields] = getSystemAndDataFields(
      filteredChartDimensions,
    );

    const [systemFieldsArr, dataFieldsArr, tableFields] = getGroupedField(
      t,
      systemFields,
      dataFields,
    );
    setSystemFields(systemFieldsArr);
    setDataFields(dataFieldsArr);
    setTableFields(tableFields);
  }, [inputFieldsForReport, context, isNumericRollup]);

  const openFilter = () => {
    if (open) return;
    setOpen(true);
    const clonedReports = jsUtils.cloneDeep(reports);
    clonedReports.chartDDSelectedDimensionsValue = EMPTY_STRING;
    clonedReports.chartsMeasureSelectedValue = defaultMeasureOption;
    clonedReports.fieldDisplayNameSelectedValue = EMPTY_STRING;
    clonedReports.ddMonthYearSelectedValue = AGGREGATE_TYPE.NONE;
    onSetChartAction(clonedReports);
    setFieldEdit(initialStateFieldEdit);
  };

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

  const selectFieldType = (type) => {
    setFieldType(type);
    setCurrentIndex(FIELD_TAB_TYPES.FIELD_LIST);
  };

  const updateAggregateSelection = (
    supported_aggregations,
    isDateTime,
    isNumericRollup,
    clonedReports,
  ) => {
    const [first, second] =
      supported_aggregations?.length >= 1 ? supported_aggregations : [];
    const selectedValue =
      (first === defaultMeasureOption ? second : first) || defaultMeasureOption;
    if (isDateTime) {
      if (isNumericRollup) {
        clonedReports.ddMonthYearSelectedValue = AGGREGATE_TYPE.COUNT;
        clonedReports.chartsMeasureSelectedValue = AGGREGATE_TYPE.COUNT;
      } else {
        clonedReports.ddMonthYearSelectedValue = selectedValue;
      }
    } else {
      clonedReports.chartsMeasureSelectedValue = selectedValue;
    }
  };

  const onSelectChangeFieldHandler = (data) => {
    setCurrentIndex(FIELD_TAB_TYPES.FIELD_CONFIG);
    setField(data);
    setLocalState({
      chartSelectedRange,
      isRangeSelected,
      is_break_down,
      is_unique_combination,
    });
    const clonedReports = jsUtils.cloneDeep(reports);
    if (data.output_key) {
      const { output_key, fieldType, fieldNames, range, is_roundup, roundup_value } =
        data;
      const isDateTime =
        fieldType === FIELD_TYPE.DATE || fieldType === FIELD_TYPE.DATETIME;
      clonedReports.chartDDSelectedDimensionsValue = output_key;
      clonedReports.fieldDisplayNameSelectedValue = fieldNames;
      clonedReports.skipNullValues = true;
      if (
        (fieldType === FIELD_TYPE.CURRENCY ||
          fieldType === FIELD_TYPE.NUMBER) &&
        range
      ) {
        clonedReports.chartSelectedRange = range;
      }

      if (isDateTime) {
        clonedReports.ddMonthYearSelectedValue = defaultMeasureOption;
      } else {
        clonedReports.chartsMeasureSelectedValue = defaultMeasureOption;
      }
      if (is_roundup) {
        clonedReports.is_roundup = is_roundup;
        clonedReports.roundup_value = roundup_value;
      } else {
        delete clonedReports.is_roundup;
        delete clonedReports.roundup_value;
      }

      if (axis === 'y' || isNumericRollup) {
        updateAggregateSelection(
          data?.supported_aggregations,
          isDateTime,
          isNumericRollup,
          clonedReports,
        );
      }
    }
    onSetChartAction(clonedReports);
  };

  const selectContext = (c) => {
    setContext(c);
    if (c?.context_name) {
      setCurrentIndex(FIELD_TAB_TYPES.SYSTEM_AND_DATA_FIELDS);
    } else {
      onSelectChangeFieldHandler(c);
    }
  };

  const updateVisualizationType = (y = 0) => {
    if (axis === 'y') {
      if (localState.is_break_down) {
        onVisualizationChange({ id: REPORT_VISUALIZATION_TYPES.STACKED });
      } else if (y >= 2 && !CLUSTERED_TYPES.includes(visualizationType)) {
        onVisualizationChange({ id: REPORT_VISUALIZATION_TYPES.CLUSTERED });
      } else if (y < 2 && !SINGLED_TYPES.includes(visualizationType)) {
        onVisualizationChange({ id: REPORT_VISUALIZATION_TYPES.VERTICAL_BAR });
      }
    }
  };

  const onTableNameClickHandler = (tableName, tableRefName) => {
    setSelectedTable(`${tableName} ${tableRefName}`);
    setSelectedTableName(tableName);
    setCurrentIndex(FIELD_TAB_TYPES.TABLE_FIELD);
  };

  const onClickApplyField = () => {
    onClickPivotAddFiled(
      t,
      reports,
      axis,
      fieldEdit,
      setFieldEdit,
      onSetChartAction,
      onGetChartData,
      onClickReportOption,
      updateVisualizationType,
      false,
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

  switch (currentIndex) {
    case FIELD_TAB_TYPES.SOURCE:
      currentComponent = (
        <Source
          dashboardList={dashboardList}
          context={context}
          onClickSource={selectContext}
        />
      );
      break;
    case FIELD_TAB_TYPES.SYSTEM_AND_DATA_FIELDS: {
      const systemFieldCount = systemFields.length;
      const dataFieldCount = dataFields.length;
      currentComponent = (
        <SystemAndData
          fieldType={fieldType}
          context={context}
          systemFieldCount={systemFieldCount}
          dataFieldCount={dataFieldCount}
          isBackNeeded={!isSingleSource}
          onClickBackBtn={() => setCurrentIndex(FIELD_TAB_TYPES.SOURCE)}
          onClick={selectFieldType}
        />
      );
      break;
    }
    case FIELD_TAB_TYPES.FIELD_LIST:
      currentComponent = (
        <List
          fieldType={fieldType}
          fieldDisplayNameSelectedValue={fieldDisplayNameSelectedValue}
          systemFields={systemFields}
          dataFields={dataFields}
          onClickBackBtn={() =>
            setCurrentIndex(FIELD_TAB_TYPES.SYSTEM_AND_DATA_FIELDS)
          }
          onClickTable={onTableNameClickHandler}
          onClickField={onSelectChangeFieldHandler}
        />
      );
      break;
    case FIELD_TAB_TYPES.FIELD_CONFIG:
      currentComponent = (
        <Config
          fieldDisplayNameSelectedValue={fieldDisplayNameSelectedValue}
          mainContent={
            <ReportFieldConfiguration
              reports={reports}
              onGetChartData={onGetChartData}
              onSetChartAction={onSetChartAction}
              isNonTableRollup={isNonTableRollup}
              axis={axis}
              field={field}
              isNumericRollup={isNumericRollup}
              localState={localState}
              onLocaleStateChange={(data) => {
                setLocalState(data);
              }}
            />
          }
          onClickBackBtn={() => {
            if (field?.is_table_field && context.context_name) {
              setCurrentIndex(FIELD_TAB_TYPES.TABLE_FIELD);
            } else if (context.context_name) {
              setCurrentIndex(FIELD_TAB_TYPES.FIELD_LIST);
            } else {
              setCurrentIndex(FIELD_TAB_TYPES.SOURCE);
            }
          }}
          onClickApply={onClickApplyField}
          onClickDiscard={onClickDiscardField}
        />
      );
      break;
    case FIELD_TAB_TYPES.TABLE_FIELD: {
      const filteredFields = tableFields.filter(
        (f) => selectedTable === `${f.table_name} ${f.table_reference_name}`,
      );
      const groupedFields = getGroupedTableFields(filteredFields, t);
      currentComponent = (
        <Table
          selectedTableName={selectedTableName}
          tableFields={groupedFields}
          selectedTable={selectedTable}
          fieldDisplayNameSelectedValue={fieldDisplayNameSelectedValue}
          onClickBackBtn={() => setCurrentIndex(FIELD_TAB_TYPES.FIELD_LIST)}
          onClickField={onSelectChangeFieldHandler}
        />
      );
      break;
    }
    default:
      break;
  }

  const error = axis
    ? error_list[`${axis}_axis`]
    : error_list.selectedFieldsFromReport || EMPTY_STRING;

  return (
    <div>
      <div ref={selectedFieldsContainerRef}>
        {selectedFieldsFromReport?.map(
          (field, index) =>
            ((axis && field.axis === axis) || (!axis && !field.axis)) && (
              <SelectedFieldsNew
                key={`${field.output_key}_${field.aggregation_type}`}
                index={index}
                field={field}
                reports={reports}
                onGetChartData={onGetChartData}
                onSetChartAction={onSetChartAction}
                onClickReportOption={onClickReportOption}
                isNonTableRollup={isNonTableRollup}
                isNumericRollup={isNumericRollup}
                axis={axis}
                fieldEdit={fieldEdit}
                setFieldEdit={setFieldEdit}
                updateVisualizationType={updateVisualizationType}
                localState={localState}
                onChangeLocalState={(data) => {
                  setLocalState(data);
                }}
              />
            ),
        )}
      </div>

      {!(
        (axis === 'x' && fieldCount.x === 1) ||
        (axis === 'y' && fieldCount.y === 3) ||
        (isNumericRollup && selectedFieldsFromReport.length === 1) ||
        (!axis && !isNumericRollup && selectedFieldsFromReport.length === 10) ||
        (axis === 'y' && is_break_down && fieldCount.y === 1)
      ) && (
        <div className={gClasses.PositionRelative} ref={filterBtnRef}>
          <button
            className={cx(styles.FilterBtn, {
              [gClasses.ErrorInputBorderImp]:
                error_list.selectedFieldsFromReport,
            })}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && openFilter()}
            onClick={openFilter}
            onBlur={onBlur}
          >
            <div className={cx(styles.FilterText, gClasses.CenterV)}>
              <PlusIconBlueNew className={gClasses.MR12} />
              {BUTTONS.ADD_FIELD}
            </div>
          </button>
          {open && (
            <div className={cx(styles.FilterDropdown)}>{currentComponent}</div>
          )}
        </div>
      )}
      {error && (
        <div
          role="alert"
          aria-hidden="false"
          className={cx(gClasses.FTwo12RedV2)}
        >
          {error}
        </div>
      )}
    </div>
  );
}

AddReportField.propTypes = {
  reports: PropTypes.objectOf({
    inputFieldsForReport: PropTypes.array,
    selectedFieldsFromReport: PropTypes.array,
    fieldDisplayNameSelectedValue: PropTypes.string,
    report: PropTypes.objectOf({ error_list: PropTypes.object }),
    fieldCount: PropTypes.objectOf({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    is_break_down: PropTypes.bool,
    is_unique_combination: PropTypes.bool,
    is_roundup: PropTypes.bool,
    roundup_value: PropTypes.number,
  }),
  onSetChartAction: PropTypes.func,
  onGetChartData: PropTypes.func,
  onClickReportOption: PropTypes.func,
  dashboardList: PropTypes.array,
  axis: PropTypes.string,
  isNumericRollup: PropTypes.bool,
  isNonTableRollup: PropTypes.bool,
  visualizationType: PropTypes.number,
  onVisualizationChange: PropTypes.func,
};

export default AddReportField;
