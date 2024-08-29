import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useContext } from 'react';
import {
  Button,
  Charts,
  ColorVariant,
  EChartsType,
  ETitleSize,
  SingleDropdown,
  Skeleton,
  Table,
  Title,
  Text,
  ETitleHeadingLevel,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import LeftIcon from 'assets/icons/LeftIcon';
import ReportNoFieldIcon from 'assets/icons/application/ReportNoFieldIcon';
import ReportNoDataIcon from 'assets/icons/application/ReportNoDataIcon';
import ReportErrorPreviewIcon from 'assets/icons/application/ReportErrorPreviewIcon';
import InfoCircle from 'assets/icons/application/InfoCircle';
import RefreshDashboardIcon from 'assets/icons/dashboards/RefreshDashboardIcon';
import jsUtility from '../../../utils/jsUtility';
import gClasses from '../../../scss/Typography.module.scss';
import { BS } from '../../../utils/UIConstants';
import {
  isBasicUserMode,
  keydownOrKeypessEnterHandle,
  routeNavigate,
} from '../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../utils/Constants';
import { EMPTY_STRING, UNDERSCORE } from '../../../utils/strings/CommonStrings';
import {
  CREATE_REPORT,
  EDIT_REPORT,
  REPORT,
  REPORT_INSTANCE_VIEWER,
  VIEW_REPORT,
} from '../../../urls/RouteConstants';
import ThemeContext from '../../../hoc/ThemeContext';
import Tooltip from '../../../components/tooltip/Tooltip';
import ReportDateFilter from '../../../components/report_date_filter/ReportDateFilter';
import Filter from '../../../components/dashboard_filter/Filter';
import { DATE_FILTER_STRINGS } from '../../../components/report_date_filter/ReportDateFilter.string';
import { addAppReport } from '../../../redux/reducer/ApplicationDashboardReportReducer';
import {
  clearChartsData,
  clearCreateReportData,
  clearReportConfig,
  dataChange,
} from '../../../redux/reducer/ReportReducer';
import { INDIVIDUAL_ENTRY_MODE, INDIVIDUAL_ENTRY_TYPE, IndividualEntryModel } from '../../shared_container';
import { VISUALIZATION_TYPES } from '../report_creation/config_panel/ConfigPanel.utils';
import { getPreviewMessage } from '../report_creation/ReportCreation.utils';
import {
  closeReportAppModelRouting,
  closeReportTableInstanceRouting,
  getTableChartData,
} from '../Report.utils';
import { getColorSchemeByThemeContext } from '../../application/app_components/AppComponent.utils';
import { getFormatNumberByLocate } from '../report_creation/ReportData.utils';
import {
  REPORT_SOURCE_TYPES,
  REPORT_CATEGORY_TYPES,
  REPORT_STRINGS,
} from '../Report.strings';
import styles from './ReportPreview.module.scss';

const ReportPreview = React.memo(function ReportPreview(props) {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);

  const arrVisualizationTypes = VISUALIZATION_TYPES(t);
  const { REPORT_PREVIEW, ERRORS } = REPORT_STRINGS(t);
  const {
    isUserApp,
    isReportCreation,
    reports: {
      chartData,
      chartLabel,
      isLoading,
      selectedFieldsFromReport = [],
      reportDrillDownTitle,
      reportDrillDownLabel,
      reportDrillDownData,
    },
    reports,
    reportConfig: {
      visualizationType = 3,
      report_Data = {},
      name,
      description,
    },
    reportConfig = {},
    errorList,
    onClickEditBasicDetails,
    reportData: {
      dayFilterData,
      monthFilterData,
      yearFilterData,
      currencyFilterList,
      selectedCurrencyFilter,
      filter,
    },
    reportData,
    onGetReportView,
    setFilter = () => {},
    onGetChartData,
    isAppReport = false,
    componentName,
    componentId = null,
    onGetReportDrillDownData,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const colorScheme = getColorSchemeByThemeContext(themeContext, history);
  const params = useParams();
  const { reportId, reportInstanceId } = params;
  const userFilter = jsUtility.cloneDeep(reportData?.reportViewUserFilter);

  useEffect(
    () => () => {
      dispatch(clearReportConfig());
      dispatch(clearChartsData());
      dispatch(clearCreateReportData());
    },
    [],
  );

  const onClickDrillDown = (x, y) => {
    if (!x && !y) {
      return;
    }

    const drillDownFilterData = x;
    onGetReportDrillDownData(reports, drillDownFilterData);
  };

  const onClickDrillDownBack = () => {
    const clonedReports = jsUtility.cloneDeep(reports);
    clonedReports.reportDrillDownLabel = [];
    clonedReports.reportDrillDownData = [];
    if (isAppReport) {
      dispatch(
        addAppReport({
          data: { reports: clonedReports },
          id: reportConfig.uuid,
        }),
      );
    } else {
      dispatch(
        dataChange({
          data: {
            reports: clonedReports,
          },
        }),
      );
    }
  };

  const onClickReportInstance = (instanceId, isRowClickable = true) => {
    const splitInstanceId = instanceId.split(UNDERSCORE);
    const rowInstanceId =
      jsUtility.isArray(splitInstanceId) &&
      splitInstanceId?.length > 0 &&
      splitInstanceId[0];
    if (isRowClickable && !jsUtility.isNumber(rowInstanceId)) {
      const pathname = jsUtility.get(
        history,
        ['location', 'pathname'],
        EMPTY_STRING,
      );
      let instanceIdPathName;
      if (isBasicUserMode(history)) {
        instanceIdPathName = `${pathname}/${REPORT}/${VIEW_REPORT}/${reportConfig?.uuid}/${rowInstanceId}`;
      } else if (
        pathname.includes(EDIT_REPORT) ||
        pathname.includes(CREATE_REPORT)
      ) {
        instanceIdPathName = `${pathname}/${REPORT_INSTANCE_VIEWER}/${rowInstanceId}`;
      } else {
        instanceIdPathName = `${pathname}/${rowInstanceId}`;
      }
      routeNavigate(
        history,
        ROUTE_METHOD.PUSH,
        instanceIdPathName,
        null,
        null,
        true,
      );
    }
  };

  const getDrillDownPreview = () => {
    const tableChartData = getTableChartData(
      reportDrillDownData,
      reportDrillDownLabel,
      t,
    );
    const isRowClickable =
      report_Data?.report_type !== REPORT_SOURCE_TYPES.CROSS_FLOW_DATALIST;

    return (
      <div className={BS.FLEX_ROW}>
        <div className={cx(gClasses.MB8, gClasses.CenterV)}>
          <Title
            headingLevel={ETitleHeadingLevel.h2}
            content={reportDrillDownTitle}
            className={cx(styles.SubTitle)}
          />
        </div>
        <div className={cx(gClasses.MB8, gClasses.CenterV)}>
          <button
            className={cx(gClasses.ClickableElement, gClasses.CursorPointer)}
            onClick={onClickDrillDownBack}
          >
            <div className={cx(gClasses.CenterV)}>
              <LeftIcon />
              <span className={cx(gClasses.ML7, gClasses.FTwo13GrayV90)}>
                {REPORT_PREVIEW.DRILL_DOWN_BACK}
              </span>
            </div>
          </button>
        </div>
        <Table
          className={cx({
            [gClasses.MT2]: !isAppReport,
            [gClasses.MB5]: !isAppReport,
            [gClasses.BorderNoneImportant]: isAppReport,
          })}
          header={jsUtility.cloneDeep(reportDrillDownLabel)}
          headerClass={cx(gClasses.FontSize13, gClasses.FontWeightBold)}
          data={jsUtility.cloneDeep(tableChartData)}
          colorScheme={colorScheme}
          isRowClickable={isRowClickable}
          onRowClick={(event) => {
            onClickReportInstance(event, isRowClickable);
          }}
        />
      </div>
    );
  };

  const handleErrorList = () => {
    if (errorList.not_exist) {
      history.go(0);
      return null;
    }

    if (errorList?.invalidAccess) {
      return getPreviewMessage(
        <ReportErrorPreviewIcon />,
        ERRORS.INVALID_ACCESS_TITLE,
      );
    }

    const sourceOrMapFieldDeleted =
      errorList?.primaryDataSource ||
      errorList?.secondaryDataSource ||
      errorList?.primaryField ||
      errorList?.secondaryField;
    if (
      (sourceOrMapFieldDeleted || errorList?.fieldDeleted) &&
      errorList?.secondaryDataSource !== ERRORS.INVALID_SECONDARY_SOURCE
    ) {
      const changeSourceBtn =
        sourceOrMapFieldDeleted && isReportCreation ? (
          <Button
            className={gClasses.MT24}
            buttonText={REPORT_PREVIEW.CHANGE_DATA_SOURCE}
            onClickHandler={onClickEditBasicDetails}
          />
        ) : null;
      return getPreviewMessage(
        <ReportErrorPreviewIcon />,
        REPORT_PREVIEW.CANT_DISPLAY_LIST,
        sourceOrMapFieldDeleted
          ? ERRORS.SOME_FLOW_OR_DATA_MISSING
          : ERRORS.SOME_DATA_FIELD_MISSING,
        changeSourceBtn,
      );
    }

    if (errorList?.dataLoadingError) {
      return getPreviewMessage(
        <ReportErrorPreviewIcon />,
        REPORT_PREVIEW.NO_DATA_FOUND,
      );
    }
    return null;
  };

  const getDataPreview = () => {
    if (isLoading) {
      return <Skeleton count={8} height={12} enableAnimation />;
    }

    if (!jsUtility.isEmpty(errorList)) {
      return handleErrorList();
    }

    if (jsUtility.isEmpty(chartData) || jsUtility.isEmpty(chartLabel)) {
      if (jsUtility.isEmpty(selectedFieldsFromReport) && !isUserApp) {
        return getPreviewMessage(
          <ReportNoFieldIcon />,
          REPORT_PREVIEW.INPUT_NEEDED,
        );
      } else {
        return getPreviewMessage(
          <ReportNoDataIcon />,
          REPORT_PREVIEW.NO_DATA_FOUND,
        );
      }
    }

    const chartElement = [];
    switch (report_Data.report_category) {
      case REPORT_CATEGORY_TYPES.TABLE_ROLLUP:
      case REPORT_CATEGORY_TYPES.TABLE_NON_ROLLUP: {
        const tableChartData = getTableChartData(chartData, chartLabel, t);
        const isRowClickable =
          [REPORT_SOURCE_TYPES.FLOW, REPORT_SOURCE_TYPES.DATALIST].includes(
            report_Data.report_type,
          ) &&
          report_Data.report_category ===
            REPORT_CATEGORY_TYPES.TABLE_NON_ROLLUP;

        chartElement.push(
          <Table
            className={cx({
              [gClasses.MT2]: !isAppReport,
              [gClasses.MB5]: !isAppReport,
              [styles.AppReportTable]: isAppReport,
              [gClasses.BorderNoneImportant]: isAppReport,
            })}
            header={jsUtility.cloneDeep(chartLabel)}
            headerClass={cx(gClasses.FontSize13, gClasses.FontWeightBold)}
            data={jsUtility.cloneDeep(tableChartData)}
            isRowClickable={isRowClickable}
            onRowClick={(instanceId) =>
              onClickReportInstance(instanceId, isRowClickable)
            }
            colorScheme={colorScheme}
          />,
        );
        break;
      }
      case REPORT_CATEGORY_TYPES.CHART: {
        const type = arrVisualizationTypes.find(
          (v) => v.id === visualizationType,
        )?.type;
        chartElement.push(
          <Charts
            data={{
              datasets: chartData,
              labels: chartLabel,
            }}
            type={type}
            className={isAppReport && styles.ChartPadding}
            onClick={onClickDrillDown}
            colorScheme={isAppReport && colorScheme}
            getFormattedData={getFormatNumberByLocate}
          />,
        );
        break;
      }
      case REPORT_CATEGORY_TYPES.NUMERIC_ROLLUP:
        chartElement.push(
          <Charts
            data={{
              datasets: chartData,
              labels: chartLabel,
            }}
            type={EChartsType.stat}
            className={isAppReport && gClasses.BorderNoneImportant}
            colorScheme={isAppReport && colorScheme}
          />,
        );
        break;

      default:
        break;
    }
    return chartElement;
  };
  const onGetReportViews = (_filter = userFilter) => {
    _filter.isFilter = false;
    onGetReportView(reports, _filter, reportData);
  };
  const onDropDownChangeHandler = (dropDownType, value) => {
    const updateValue = {};
    switch (dropDownType) {
      case DATE_FILTER_STRINGS.TYPES.DAY:
        updateValue.dayFilterData = value;
        break;
      case DATE_FILTER_STRINGS.TYPES.MONTH:
        updateValue.monthFilterData = value;
        break;
      case DATE_FILTER_STRINGS.TYPES.YEAR:
        updateValue.yearFilterData = value;
        break;
      default:
        break;
    }
    const updatedState = { ...reportData, ...updateValue };

    onGetChartData(reports, filter, updatedState);
  };

  const onRefreshReport = () => {
    onGetReportView();
  };

  const getTableInstanceModel = (instanceId) => {
    const sourceDetails = reportConfig.source_Data?.[0];
    let type;
    const metaData = {
      moduleId: sourceDetails.source_id,
      moduleUuid: sourceDetails.source_uuid,
      instanceId: instanceId,
    };
    if (report_Data.report_type === REPORT_SOURCE_TYPES.FLOW) {
      type = INDIVIDUAL_ENTRY_TYPE.FLOW;
    } else if (report_Data.report_type === REPORT_SOURCE_TYPES.DATALIST) {
      type = INDIVIDUAL_ENTRY_TYPE.DATA_LIST;
    }

    const onReportInstanceCloseClick = () => {
      if (isBasicUserMode(history)) {
        closeReportAppModelRouting(history);
      } else {
        closeReportTableInstanceRouting(history);
      }
    };

    return (
      <IndividualEntryModel
        mode={INDIVIDUAL_ENTRY_MODE.REPORT_INSTANCE_MODE}
        type={type}
        metaData={metaData}
        onCloseModel={onReportInstanceCloseClick}
        refreshOnDelete={onRefreshReport}
      />
    );
  };

  const filterData = () =>
    reportDrillDownLabel?.length > 0 ? null : (
      <div
        className={cx(
          BS.W100,
          BS.D_FLEX,
          !isAppReport && BS.JC_BETWEEN,
          BS.ALIGN_ITEM_CENTER,
          !isAppReport && gClasses.MB16,
          gClasses.MinHeight36,
        )}
      >
        <div className={cx(styles.Order1, gClasses.gap5)}>
          {(dayFilterData || monthFilterData || yearFilterData) && (
            <div
              className={cx(
                BS.W100,
                BS.D_FLEX,
                BS.JC_BETWEEN,
                BS.ALIGN_ITEM_CENTER,
                styles.UserFilter,
              )}
            >
              <ReportDateFilter
                dayFilterData={dayFilterData}
                monthFilterData={monthFilterData}
                yearFilterData={yearFilterData}
                onDropDownChangeHandler={onDropDownChangeHandler}
              />
            </div>
          )}
          {!jsUtility.isEmpty(currencyFilterList) && (
            <SingleDropdown
              className={gClasses.Width100}
              selectedValue={jsUtility.cloneDeep(selectedCurrencyFilter)}
              optionList={jsUtility.cloneDeep(currencyFilterList)}
              colorScheme={isAppReport && colorScheme}
              dropdownViewProps={{
                colorVariant: isAppReport && ColorVariant.fill,
                colorScheme: isAppReport && colorScheme,
              }}
              onClick={(value) => {
                const updatedState = {
                  ...reportData,
                  selectedCurrencyFilter: value,
                };
                onGetChartData(reports, filter, updatedState);
              }}
            />
          )}
        </div>
        <div className={cx(styles.Order2, gClasses.CenterV)}>
          {!jsUtility.isEmpty(userFilter.inputFieldDetailsForFilter) && (
            <Filter
              filter={userFilter}
              onSetFilterAction={setFilter}
              getReportData={onGetReportViews}
              isUserFilter
            />
          )}
          <RefreshDashboardIcon
            className={cx(gClasses.CursorPointer, gClasses.ML16)}
            onClick={onRefreshReport}
            onkeydown={(e) =>
              keydownOrKeypessEnterHandle(e) && onRefreshReport()
            }
          />
        </div>
      </div>
    );
  const tooltipId = `report_${componentId}`;

  return (
    <div
      style={{ backgroundColor: isAppReport && colorScheme?.widgetBg }}
      className={cx(styles.Data, {
        [gClasses.P0]: isAppReport,
        [styles.AppReportContainer]: isAppReport,
      })}
    >
      {isAppReport ? (
        <div
          className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.MB6)}
        >
          <div className={cx(gClasses.CenterV, gClasses.Gap8, gClasses.W100)}>
            <div title={componentName}>
              <Title
                content={componentName}
                size={ETitleSize.xs}
                className={cx(gClasses.Ellipsis)}
                colorScheme={{
                  ...colorScheme,
                  activeColor: colorScheme?.highlight,
                }}
              />
            </div>
            <span id={tooltipId}>
              <InfoCircle />
              <Tooltip
                id={tooltipId}
                placement="right"
                isCustomToolTip
                customInnerClasss={styles.ToolTipContainer}
                outerClass={gClasses.OpacityFull}
                content={
                  <div className={styles.Tooltip}>
                    <Text
                      content={name}
                      className={cx(
                        gClasses.FTwo13Black18,
                        gClasses.FontWeight500,
                      )}
                    />
                    <Text
                      content={description || '-'}
                      className={cx(
                        gClasses.FTwo12BlackV18,
                        gClasses.FontWeight400,
                      )}
                    />
                  </div>
                }
              />
            </span>
          </div>
          <div>{filterData()}</div>
        </div>
      ) : (
        filterData()
      )}
      <div className={cx(gClasses.W100, styles.Content)}>
        {reportDrillDownLabel?.length > 0
          ? getDrillDownPreview()
          : getDataPreview()}
      </div>
      {reportInstanceId &&
        (history?.location?.pathname.includes(CREATE_REPORT) ||
          reportId === reportConfig?.uuid) &&
        getTableInstanceModel(reportInstanceId)}
    </div>
  );
});

ReportPreview.propTypes = {
  isUserApp: PropTypes.bool,
  isReportCreation: PropTypes.bool,
  reports: PropTypes.objectOf({
    chartData: PropTypes.array,
    chartLabel: PropTypes.array,
    isLoading: PropTypes.bool,
    selectedFieldsFromReport: PropTypes.array,
    reportDrillDownTitle: PropTypes.string,
    reportDrillDownLabel: PropTypes.array,
    reportDrillDownData: PropTypes.array,
  }),
  reportConfig: PropTypes.objectOf({
    visualizationType: PropTypes.number,
    report_Data: PropTypes.object,
    name: PropTypes.string,
    description: PropTypes.string,
    source_Data: PropTypes.array,
    uuid: PropTypes.string,
    isTableInstanceAdminOwnerViewer: PropTypes.bool,
  }),
  errorList: PropTypes.object,
  onClickEditBasicDetails: PropTypes.func,
  reportData: PropTypes.objectOf({
    dayFilterData: PropTypes.number,
    monthFilterData: PropTypes.number,
    yearFilterData: PropTypes.number,
    currencyFilterList: PropTypes.array,
    selectedCurrencyFilter: PropTypes.string,
    reportViewUserFilter: PropTypes.object,
  }),
  onGetReportView: PropTypes.func,
  setFilter: PropTypes.func,
  onGetChartData: PropTypes.func,
  isAppReport: PropTypes.bool,
  componentName: PropTypes.string,
  componentId: PropTypes.string,
  onGetReportDrillDownData: PropTypes.func,
};

export default ReportPreview;
