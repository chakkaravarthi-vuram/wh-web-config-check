import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from '@workhall-pvt-lmt/wh-ui-library';
import ReportPreview from '../../../report/report_preview/ReportPreview';
import {
  getAppReportThunk,
  getAppReportValuesThunk,
} from '../../../../redux/actions/ApplicationDashboardReport.Action';
import { BS } from '../../../../utils/UIConstants';
import gClasses from '../../../../scss/Typography.module.scss';
import {
  addAppReport,
  removeAppReport,
} from '../../../../redux/reducer/ApplicationDashboardReportReducer';
import jsUtility from '../../../../utils/jsUtility';
import {
  generateReportDrillDownQuery,
  generateReportQuery,
} from '../../../report/report_creation/ReportQuery.utils';
import { getReportDrillDownValuesThunk } from '../../../../redux/actions/Report.Action';
import { REPORT_CATEGORY_TYPES } from '../../../report/Report.strings';

function Report(props) {
  const { componentDetails = {}, isAppReport, componentName } = props;
  const dispatch = useDispatch();
  const {
    component_info: { report_uuid },
  } = componentDetails;
  const { appReports } = useSelector(
    (store) => store.ApplicationDashboardReportReducer,
  );

  useEffect(() => {
    if (report_uuid) {
      dispatch(getAppReportThunk(report_uuid));
    }
    return () => report_uuid && dispatch(removeAppReport({ id: report_uuid }));
  }, [report_uuid]);

  const report = appReports[report_uuid];
  if (!report) {
    return <Skeleton count={8} height={12} enableAnimation />;
  }
  const {
    reportConfig,
    reports,
    errorList,
    reportViewUserFilter = [],
    dayFilterData,
    monthFilterData,
    yearFilterData,
    currencyFilterList,
    selectedCurrencyFilter,
  } = report;
  const reportData = {
    reportViewUserFilter,
    dayFilterData,
    monthFilterData,
    yearFilterData,
    filter: reports?.filter || {},
    currencyFilterList,
    selectedCurrencyFilter,
  };
  const onGetReportFilter = (
    _reports,
    _filter = reportViewUserFilter,
    stateUpdatesValue = {},
    isQuickFilter = false,
  ) => {
    const clonedErrorList = jsUtility.cloneDeep(errorList || {});
    const clonedFilter = jsUtility.cloneDeep(_filter);
    const clonedReports = jsUtility.cloneDeep(_reports);
    let filterData = reports?.filter;
    let userFilterData = null;
    const data = {
      reports: clonedReports,
    };
    if (isQuickFilter) {
      data.reports.filter = clonedFilter;
    } else {
      data.reportViewUserFilter = clonedFilter;
    }
    dispatch(
      addAppReport({
        data,
        id: report_uuid,
      }),
    );

    if (errorList?.fieldDeleted) {
      let isThereADeletedField = false;
      clonedReports.selectedFieldsFromReport.forEach((field) => {
        if (field.isFieldDeleted) {
          isThereADeletedField = true;
        }
      });

      clonedFilter.inputFieldDetailsForFilter.forEach((field) => {
        if (field.isAppliedFilter && field.isFieldDeleted) {
          isThereADeletedField = true;
        }
      });

      if (isThereADeletedField) return;
      else {
        delete clonedErrorList.fieldDeleted;
      }
    }
    if (isQuickFilter) {
      filterData = clonedFilter;
      userFilterData = reportViewUserFilter;
    } else {
      userFilterData = clonedFilter;
    }
    const query = generateReportQuery(
      clonedReports,
      filterData,
      reportConfig,
      userFilterData,
      stateUpdatesValue,
      false,
    );
    const {
      source_Data = {},
      report_Data: { report_type },
    } = reportConfig;

    dispatch(
      getAppReportValuesThunk(
        source_Data,
        query,
        report_type,
        clonedReports.selectedFieldsFromReport,
        report_uuid,
        clonedFilter,
        {},
        isQuickFilter,
      ),
    );
  };

  const onGetReportView = (
    _reports = reports,
    _filter = reportData?.reportViewUserFilter,
    stateUpdatesValue = reportData,
  ) => {
    const filter = jsUtility.cloneDeep(_filter);
    filter.isFilter = false;
    onGetReportFilter(_reports, filter, stateUpdatesValue);
  };
  const onGetChartData = (
    _reports = reports,
    _filter = reports?.filter,
    stateUpdatesValue = reportData,
  ) => {
    const filter = jsUtility.cloneDeep(_filter);
    onGetReportFilter(_reports, filter, stateUpdatesValue, true);
    dispatch(
      addAppReport({
        data: {
          reportConfig,
          reports,
          errorList,
          selectedCurrencyFilter: stateUpdatesValue?.selectedCurrencyFilter,
        },
        id: report_uuid,
      }),
    );
  };
  const setFilter = (_filter) => {
    dispatch(
      addAppReport({
        data: {
          reportViewUserFilter: _filter,
          reports,
          errorList,
          reportConfig,
        },
        id: report_uuid,
      }),
    );
  };

  const onGetReportDrillDownData = (reports, drillDownFilterData) => {
    const clonedErrorList = jsUtility.cloneDeep(errorList || {});
    const clonedReports = jsUtility.cloneDeep(reports);
    const clonedReportViewUserFilter =
      jsUtility.cloneDeep(reportViewUserFilter);

    if (
      !jsUtility.isEmpty(clonedErrorList) ||
      clonedReports.selectedFieldsFromReport.length === 0
    ) {
      return;
    }

    const clonedReportConfig = jsUtility.cloneDeep(reportConfig);
    clonedReportConfig.report_Data.report_category =
      REPORT_CATEGORY_TYPES.TABLE_NON_ROLLUP;

    const quickFilterData = {
      dayFilterData,
      monthFilterData,
      yearFilterData,
    };

    const query = generateReportDrillDownQuery(
      clonedReports,
      reports?.filter,
      reportConfig,
      false,
      0,
      clonedReportViewUserFilter,
      reportData,
      quickFilterData,
      drillDownFilterData,
    );
    const { source_Data = {}, report_Data = {} } = reportConfig;
    query.report_config.report_category =
      REPORT_CATEGORY_TYPES.TABLE_NON_ROLLUP;

    dispatch(
      getReportDrillDownValuesThunk(
        source_Data,
        query,
        report_Data.report_type,
        report_uuid,
        drillDownFilterData,
      ),
    );
  };

  return (
    <div className={cx(BS.FLEX_COLUMN, BS.W100, BS.H100)}>
      <div className={cx(gClasses.HeightInherit)}>
        <ReportPreview
          isUserApp
          reports={reports}
          reportConfig={reportConfig}
          errorList={errorList}
          reportData={reportData}
          onGetReportView={onGetReportView}
          onGetChartData={onGetChartData}
          setFilter={setFilter}
          isAppReport={isAppReport}
          componentName={componentName}
          componentId={componentDetails._id}
          onGetReportDrillDownData={onGetReportDrillDownData}
        />
      </div>
    </div>
  );
}

Report.propTypes = {
  componentDetails: PropTypes.objectOf({
    component_info: PropTypes.objectOf({ report_uuid: PropTypes.string }),
    _id: PropTypes.string,
  }),
  isAppReport: PropTypes.bool,
  componentName: PropTypes.string,
};

export default Report;
