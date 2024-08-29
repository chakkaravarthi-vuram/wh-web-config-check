import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  AvatarBorderRadiusVariant,
  AvatarGroup,
  AvatarSizeVariant,
  Button,
  Skeleton,
  Breadcrumb,
} from '@workhall-pvt-lmt/wh-ui-library';
import BarChartSquare from 'assets/icons/BarChartSquare';
import gClasses from '../../scss/Typography.module.scss';
import { BS } from '../../utils/UIConstants';
import jsUtility from '../../utils/jsUtility';
import { getDevRoutePath, routeNavigate } from '../../utils/UtilityFunctions';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { ROUTE_METHOD } from '../../utils/Constants';
import {
  EDIT_REPORT,
  PUBLISHED_REPORT_LIST,
  REPORT,
  REPORT_LIST,
} from '../../urls/RouteConstants';
import {
  getReportByUUIDThunk,
  getReportDrillDownValuesThunk,
  getReportValuesThunk,
} from '../../redux/actions/Report.Action';
import {
  clearChartsData,
  clearCreateReportData,
  clearReportConfig,
  dataChange,
} from '../../redux/reducer/ReportReducer';
import DeleteReportModal from './delete_report/DeleteReportModal';
import ReportPreview from './report_preview/ReportPreview';
import { getAvatarDisplay } from './report_list/ReportList.utils';
import {
  generateReportDrillDownQuery,
  generateReportQuery,
} from './report_creation/ReportQuery.utils';
import { REPORT_CATEGORY_TYPES, REPORT_STRINGS } from './Report.strings';
import styles from './Report.module.scss';

function Report() {
  const { t } = useTranslation();
  const history = useHistory();
  const matchParams = useParams();
  const dispatch = useDispatch();
  const { REPORT_CREATION } = REPORT_STRINGS(t);
  const {
    reportConfig,
    reports,
    errorList,
    userFilter,
    reportViewUserFilter,
    filter,
  } = useSelector((store) => store.ReportReducer);
  const reportData = useSelector((store) => store.ReportReducer);
  const [deleteModal, setDeleteModal] = useState(false);

  const navigationLinks = [
    {
      text: REPORT_CREATION.REPORT,
      route: getDevRoutePath(`/${REPORT_LIST}/${PUBLISHED_REPORT_LIST}`),
      isText: false,
      className: gClasses.FTwo12,
    },
    {
      text: reportConfig.name || EMPTY_STRING,
      isText: true,
      className: gClasses.FTwo12,
    },
  ];

  useEffect(() => {
    if (matchParams.reportId) {
      dispatch(getReportByUUIDThunk(matchParams.reportId));
    }
    return () => {
      dispatch(clearReportConfig());
      dispatch(clearChartsData());
      dispatch(clearCreateReportData());
    };
  }, []);

  const onEditClick = () => {
    if (matchParams.reportId) {
      const editReportIdPathName = `/${REPORT}/${EDIT_REPORT}/${matchParams.reportId}`;
      routeNavigate(history, ROUTE_METHOD.PUSH, editReportIdPathName);
    }
  };
  const onSetFilter = (_filter) => {
    dispatch(
      dataChange({
        data: {
          reportViewUserFilter: _filter,
        },
      }),
    );
  };
  const onGetReportFilter = (
    _charts = reports,
    _filter = reportViewUserFilter,
  ) => {
    const clonedErrorList = jsUtility.cloneDeep(errorList || {});
    const clonedReports = jsUtility.cloneDeep(_charts);
    const clonedReportViewUserFilter = jsUtility.cloneDeep(_filter);
    clonedReports.chartLabel = [];
    clonedReports.chartData = [];
    dispatch(
      dataChange({
        data: {
          reports: clonedReports,
          reportViewUserFilter: clonedReportViewUserFilter,
        },
      }),
    );

    if (errorList?.fieldDeleted) {
      let isThereADeletedField = false;
      clonedReports.selectedFieldsFromReport.forEach((field) => {
        if (field.isFieldDeleted) {
          isThereADeletedField = true;
        }
      });

      clonedReportViewUserFilter.inputFieldDetailsForFilter.forEach((field) => {
        if (field.isAppliedFilter && field.isFieldDeleted) {
          isThereADeletedField = true;
        }
      });

      if (isThereADeletedField) return;
      else {
        delete clonedErrorList.fieldDeleted;
        dispatch(dataChange({ data: { errorList: clonedErrorList } }));
      }
    }

    if (
      !jsUtility.isEmpty(clonedErrorList) ||
      clonedReports.selectedFieldsFromReport.length === 0
    ) {
      return;
    }

    const query = generateReportQuery(
      clonedReports,
      filter,
      reportConfig,
      clonedReportViewUserFilter,
      reportData,
      false,
    );
    const { source_Data = {}, report_Data = {} } = reportConfig;

    dispatch(getReportValuesThunk(source_Data, query, report_Data.report_type));
  };
  const onGetChartData = (
    _charts = reports,
    _filter = reportData.filter,
    updatedState = {},
  ) => {
    const clonedErrorList = jsUtility.cloneDeep(errorList || {});
    const clonedFilter = jsUtility.cloneDeep(_filter);
    const clonedReports = jsUtility.cloneDeep(_charts);
    clonedReports.chartLabel = [];
    clonedReports.chartData = [];
    dispatch(
      dataChange({
        data: {
          reports: clonedReports,
          filter: clonedFilter,
          selectedCurrencyFilter: updatedState?.selectedCurrencyFilter,
        },
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
        dispatch(dataChange({ data: { errorList: clonedErrorList } }));
      }
    }

    if (
      !jsUtility.isEmpty(clonedErrorList) ||
      clonedReports.selectedFieldsFromReport.length === 0
    ) {
      return;
    }
    const query = generateReportQuery(
      clonedReports,
      clonedFilter,
      reportConfig,
      reportViewUserFilter,
      updatedState,
      false,
    );
    const { source_Data = {}, report_Data = {} } = reportConfig;

    dispatch(getReportValuesThunk(source_Data, query, report_Data.report_type));
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
      dayFilterData: reportData.dayFilterData,
      monthFilterData: reportData.monthFilterData,
      yearFilterData: reportData.yearFilterData,
    };

    const query = generateReportDrillDownQuery(
      clonedReports,
      filter,
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
        EMPTY_STRING,
        drillDownFilterData,
      ),
    );
  };
  const headerLoading = () => (
    <div className={cx(styles.ReportHeader)}>
      <Skeleton height={20} width={200} className={gClasses.MB8} />
      <div className={styles.HeaderContent}>
        <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.W65)}>
          <Avatar size={AvatarSizeVariant.lg} isLoading />
          <div className={cx(gClasses.ML16, styles.Text)}>
            <Skeleton height={30} enableAnimation />
            <Skeleton height={12} enableAnimation />
          </div>
        </div>

        <div className={cx(styles.HeaderRight)}>
          <AvatarGroup size={AvatarSizeVariant.xs} isLoading />
          <Skeleton height={20} width={20} className={gClasses.ML16} />
          <Skeleton height={36} width={119} className={gClasses.ML16} />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {deleteModal && (
        <DeleteReportModal
          reportId={reportConfig._id}
          closeFn={() => setDeleteModal(false)}
        />
      )}

      {reportConfig.isLoading ? (
        headerLoading()
      ) : (
        <div className={cx(styles.ReportHeader)}>
          <Breadcrumb
            list={navigationLinks}
            className={gClasses.PY8}
          />
          <div className={styles.HeaderContent}>
            <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.W65)}>
              <Avatar
                icon={<BarChartSquare className={styles.ReportIcon} />}
                showIcon
                size={AvatarSizeVariant.lg}
                variant={AvatarBorderRadiusVariant.rounded}
              />

              <div className={cx(gClasses.ML16, styles.Text)}>
                <h2 className={cx(styles.Title, gClasses.Ellipsis)}>
                  {reportConfig.name}
                </h2>
                <p className={cx(styles.HeaderSubTitle, gClasses.Ellipsis)}>
                  {reportConfig.description}
                </p>
              </div>
            </div>

            <div className={cx(styles.HeaderRight)}>
              <div>{getAvatarDisplay(reportConfig.admins)}</div>
              {reportConfig.is_editable && (
                <Button
                  className={gClasses.ML10}
                  buttonText={REPORT_CREATION.EDIT_REPORT}
                  onClickHandler={onEditClick}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className={cx(styles.MainContent)}>
        <ReportPreview
          reportConfig={reportConfig}
          reports={reports}
          errorList={errorList}
          filter={userFilter}
          reportData={reportData}
          setFilter={onSetFilter}
          onGetReportView={onGetReportFilter}
          onGetChartData={onGetChartData}
          onGetReportDrillDownData={onGetReportDrillDownData}
        />
      </div>
    </div>
  );
}

export default Report;
