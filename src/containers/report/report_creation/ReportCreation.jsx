import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory, Prompt } from 'react-router-dom';
import cx from 'classnames';
import {
  Button,
  ETitleHeadingLevel,
  ETitleSize,
  Modal,
  ModalSize,
  ModalStyleType,
  Skeleton,
  Title,
  Breadcrumb,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useDispatch, useSelector } from 'react-redux';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import gClasses from '../../../scss/Typography.module.scss';
import {
  REPORT_CATEGORY_TYPES,
  REPORT_VISUALIZATION_TYPES,
  REPORT_STRINGS,
} from '../Report.strings';
import styles from './ReportCreation.module.scss';
import ReportPreview from '../report_preview/ReportPreview';
import ConfigPanel from './config_panel/ConfigPanel';
import {
  CREATE_REPORT,
  EDIT_REPORT,
  EDIT_REPORT_BASIC_DETAILS,
  EDIT_REPORT_SECURITY,
  PUBLISHED_REPORT_LIST,
  REPORT_LIST,
} from '../../../urls/RouteConstants';
import {
  getDevRoutePath,
  handleBlockedNavigation,
  keydownOrKeypessEnterHandle,
  routeNavigate,
  showToastPopover,
  useClickOutsideDetector,
  validate,
} from '../../../utils/UtilityFunctions';
import SettingsAppIcon from '../../../assets/icons/app_builder_icons/SettingsAppIcon';
import Trash from '../../../assets/icons/application/Trash';
import CloseIcon from '../../../assets/icons/CloseIcon';
import LockIcon from '../../../assets/icons/LockIcon';
import EditDetailsIconV2 from '../../../assets/icons/EditDetailsIconV2';
import BasicDetails from '../report_config/basic_details/BasicDetails';
import Security from './security/Security';
import {
  getReportByUUIDThunk,
  getReportDrillDownValuesThunk,
  getReportFiltersThunk,
  getReportValuesThunk,
  publishReportThunk,
} from '../../../redux/actions/Report.Action';
import {
  generateReportDrillDownQuery,
  generateReportQuery,
} from './ReportQuery.utils';
import {
  getReportPublishData,
  isReportSourceEqual,
} from './ReportCreation.utils';
import {
  clearChartsData,
  clearCreateReportData,
  clearReportConfig,
  dataChange,
  setChartsData,
  setReportConfig,
} from '../../../redux/reducer/ReportReducer';
import { FORM_POPOVER_STATUS, ROUTE_METHOD } from '../../../utils/Constants';
import { clearAlertPopOverStatusAction } from '../../../redux/actions/Actions';
import jsUtility from '../../../utils/jsUtility';
import DeleteReportModal from '../delete_report/DeleteReportModal';
import {
  constructReportData,
  constructSourceData,
  getReportValidationData,
} from '../Report.utils';
import {
  CREATE_REPORT_VALIDATION_SCHEMA,
  savePublishReportValidation,
  securityDetailsValidation,
} from '../Reports.validation';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { validateFilterValues } from '../../../components/dashboard_filter/more_filters/MoreFilter.utils';
import { isEmptyFieldUpdateValue } from '../../../components/dashboard_filter/FilterUtils';

function ReportCreation() {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { reportId = undefined } = useParams();
  const [isPublish, setIsPublish] = useState(false);
  const moreOptionWrapperRef = useRef();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [reportSubActionType, setReportSubActionType] = useState();
  const [isPublishLoading, setIsPublishLoading] = useState(false);
  const { REPORT_CREATION, ERRORS } = REPORT_STRINGS(t);
  const {
    reportConfig,
    reports,
    filter,
    userFilter,
    reportViewUserFilter,
    apiBasicDetails,
    ...rest
  } = useSelector((store) => store.ReportReducer);
  const { errorList } = rest;
  const state = useSelector((store) => store.ReportReducer);
  const blockNavigationRef = useRef(true);
  const copyDataRef = useRef();
  useClickOutsideDetector(moreOptionWrapperRef, () => setOptionsOpen(false));

  useEffect(() => {
    const { source_Data, report_Data } = reportConfig;
    /** reportId determines whether is edit or create page */
    if (reportId) {
      dispatch(getReportByUUIDThunk(reportId));
    } else if (!jsUtility.isEmpty(source_Data) && report_Data.report_type) {
      dispatch(getReportFiltersThunk(source_Data, report_Data.report_type));
    }

    return () => {
      dispatch(clearChartsData());
      dispatch(clearReportConfig());
      dispatch(clearCreateReportData());
    };
  }, []);

  const isEditSecurity = reportSubActionType === EDIT_REPORT_SECURITY;
  const reportData = useSelector((store) => store.ReportReducer);

  const links = [
    {
      text: REPORT_CREATION.REPORT,
      route: getDevRoutePath(`/${REPORT_LIST}/${PUBLISHED_REPORT_LIST}`),
    },
    {
      text: reportId
        ? REPORT_CREATION.EDIT_REPORT
        : REPORT_CREATION.CREATE_REPORT,
      isText: true,
    },
  ];

  const backToReportCreation = () => {
    setReportSubActionType(null);
  };

  const onClickEditSecurity = () => {
    copyDataRef.current = jsUtility.cloneDeep(reportConfig);
    setReportSubActionType(EDIT_REPORT_SECURITY);
  };

  const onClickEditBasicDetails = () => {
    copyDataRef.current = jsUtility.cloneDeep({ reportConfig, ...rest });
    setReportSubActionType(EDIT_REPORT_BASIC_DETAILS);
  };

  const reportPublishCallBackFunction = (
    is_new_report,
    success = true,
    err = {},
  ) => {
    let title;
    let subTitle = EMPTY_STRING;
    let status;

    if (success) {
      blockNavigationRef.current = false;
      title = is_new_report
        ? t('error_popover_status.save_report')
        : t('error_popover_status.modify_report');
      subTitle = is_new_report
        ? t('error_popover_status.report_saved_success')
        : t('error_popover_status.report_modify_success');
      status = FORM_POPOVER_STATUS.SUCCESS;
      const reportPublishedPathName = `/${REPORT_LIST}/${PUBLISHED_REPORT_LIST}`;
      routeNavigate(history, ROUTE_METHOD.PUSH, reportPublishedPathName);
    } else if (err.type === 'exist' && err.field === 'report_name') {
      const clonedReportConfig = jsUtility.cloneDeep(reportConfig);
      clonedReportConfig.errorList.report_name = ERRORS.REPORT_ALREADY_EXISTS;
      dispatch(setReportConfig(clonedReportConfig));
      !is_new_report && onClickEditSecurity();
    } else {
      title = ERRORS.SOMETHING_WENT_WRONG;
      status = FORM_POPOVER_STATUS.SERVER_ERROR;
    }
    title && showToastPopover(
      title,
      subTitle,
      status,
      true,
    );
    dispatch(clearAlertPopOverStatusAction());
    setIsPublishLoading(false);
  };

  const onPublishOrSaveClickHandler = () => {
    const clonedReports = jsUtility.cloneDeep(reports);
    const { report_category } = reportConfig.report_Data;
    clonedReports.report.error_list = savePublishReportValidation(
      report_category,
      clonedReports,
      t,
    );
    if (!jsUtility.isEmpty(clonedReports.report.error_list)) {
      return dispatch(setChartsData(clonedReports));
    }

    if (reportId) {
      const data = getReportPublishData(
        reportConfig,
        reports,
        filter,
        false,
        reportViewUserFilter,
      );
      setIsPublishLoading(true);
      dispatch(publishReportThunk(data, reportPublishCallBackFunction));
    } else {
      setIsPublish(true);
      onClickEditSecurity();
    }

    return null;
  };

  const promptBeforeLeaving = (location) => {
    if (
      !location.pathname.endsWith(EDIT_REPORT_SECURITY) &&
      !location.pathname.endsWith(EDIT_REPORT_BASIC_DETAILS) &&
      !location.pathname.includes(EDIT_REPORT) &&
      !location.pathname.includes(CREATE_REPORT) &&
      blockNavigationRef.current
    ) {
      handleBlockedNavigation(
        t,
        () => {
          blockNavigationRef.current = false;
        },
        history,
        location,
      );
      return false;
    }
    return true;
  };

  const onEditCancelClickHandler = () => {
    const reportPublishedPathName = `/${REPORT_LIST}/${PUBLISHED_REPORT_LIST}`;
    routeNavigate(history, ROUTE_METHOD.REPLACE, reportPublishedPathName);
  };

  const onSaveBasicsDetails = () => {
    const clonedErrorList = jsUtility.cloneDeep(errorList);
    delete clonedErrorList.fieldDeleted;
    if (!jsUtility.isEmpty(clonedErrorList)) {
      return;
    }

    const validationData = getReportValidationData(state);
    const _errorList = validate(
      validationData,
      CREATE_REPORT_VALIDATION_SCHEMA(),
    );
    if (
      validationData.primaryDataSource ===
        validationData?.secondaryDataSource &&
      validationData.primaryDataSource !== EMPTY_STRING &&
      validationData?.secondaryDataSource !== EMPTY_STRING
    ) {
      _errorList.secondaryDataSource =
        REPORT_STRINGS().ERRORS.INVALID_SECONDARY_SOURCE;
    }
    dispatch(dataChange({ data: { errorList: _errorList } }));
    if (jsUtility.isEmpty(_errorList)) {
      const source_Data = constructSourceData(state);
      const report_Data = constructReportData(state, source_Data);
      let reportConfig = state?.reportConfig;
      reportConfig = {
        ...reportConfig,
        source_Data,
        report_Data,
        visualizationType:
          reportConfig.visualizationType ??
          REPORT_VISUALIZATION_TYPES.VERTICAL_BAR,
      };
      dispatch(dataChange({ data: { reportConfig } }));

      const _reportConfig = copyDataRef.current.reportConfig;
      const [isSourceChanged, isMappingChanged] = isReportSourceEqual(
        source_Data,
        _reportConfig.source_Data,
      );

      if (!isSourceChanged) {
        if (!isMappingChanged) {
          dispatch(clearChartsData());
        }
        dispatch(getReportFiltersThunk(source_Data, report_Data.report_type));
      } else if (
        _reportConfig.report_Data?.report_category !==
        report_Data.report_category
      ) {
        const clonedReports = jsUtility.cloneDeep(reports);
        const clonedFilter = jsUtility.cloneDeep(filter);
        clonedReports.selectedFieldsFromReport = [];
        clonedReports.chartData = [];
        clonedReports.chartLabel = [];
        clonedReports.fieldCount = {
          x: 0,
          y: 0,
        };
        clonedReports.additionalConfiguration = {
          isShowTotal: false,
          sortBySelectedFieldValue: EMPTY_STRING,
          sortBySelectedValue: EMPTY_STRING,
        };

        clonedFilter.inputFieldDetailsForFilter =
          clonedFilter.inputFieldDetailsForFilter.map((f) => {
            f.fieldValues =
              f.fieldValues?.[0] &&
              f.fieldValues.map((checkList) => {
                checkList.isCheck = false;
                return checkList;
              });

            f.fieldUpdateValue = EMPTY_STRING;
            f.isAppliedFilter = false;
            f.isAppliedFieldEdit = false;
            f.fieldUpdateBetweenOne = EMPTY_STRING;
            f.fieldUpdateBetweenTwo = EMPTY_STRING;
            return f;
          });

        clonedFilter.selectedFieldDetailsFromFilter = jsUtility.cloneDeep(
          clonedFilter.inputFieldDetailsForFilter,
        );
        dispatch(
          dataChange({
            data: {
              reports: clonedReports,
              filter: clonedFilter,
              monthFilterData: EMPTY_STRING,
              yearFilterData: EMPTY_STRING,
              dayFilterData: EMPTY_STRING,
              currencyFilterList: [],
              selectedCurrencyFilter: EMPTY_STRING,
            },
          }),
        );
      }
      backToReportCreation();
    }
  };

  const onModalSaveClickHandler = () => {
    if (isEditSecurity) {
      const clonedReportConfig = jsUtility.cloneDeep(reportConfig);
      clonedReportConfig.errorList = securityDetailsValidation(
        clonedReportConfig,
        t,
      );
      dispatch(setReportConfig(clonedReportConfig));
      if (!jsUtility.isEmpty(clonedReportConfig.errorList)) {
        return;
      }

      if (!reportId && isPublish) {
        setIsPublishLoading(true);
        const data = getReportPublishData(
          reportConfig,
          reports,
          filter,
          true,
          reportViewUserFilter,
        );
        dispatch(publishReportThunk(data, reportPublishCallBackFunction));
      } else {
        backToReportCreation();
      }
    } else {
      onSaveBasicsDetails();
    }
  };

  const onModalCancelClickHandler = () => {
    if (!isEditSecurity) {
      dispatch(
        dataChange({
          data: {
            ...jsUtility.cloneDeep(copyDataRef.current),
            isAddOneMore: false,
          },
        }),
      );
    } else {
      setIsPublish(false);
      dispatch(setReportConfig(jsUtility.cloneDeep(copyDataRef.current)));
    }
    backToReportCreation();
  };

  const onGetChartData = (
    _reports = reports,
    _filter = filter,
    updatedState = state,
  ) => {
    const clonedErrorList = jsUtility.cloneDeep(errorList || {});
    const clonedFilter = jsUtility.cloneDeep(_filter);
    const clonedReports = jsUtility.cloneDeep(_reports);
    clonedReports.chartLabel = [];
    clonedReports.chartData = [];
    clonedReports.reportDrillDownLabel = [];
    clonedReports.reportDrillDownData = [];
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
    const clonedReportViewUserFilter =
      jsUtility.cloneDeep(
        reportData?.reportViewUserFilter?.inputFieldDetailsForFilter,
      ) || [];
    const { updatedFilterFlowData, isValid } = validateFilterValues(
      clonedReportViewUserFilter,
      t,
    );
    let isUserFilterHasValue = false;
    if (isValid) {
      updatedFilterFlowData &&
        updatedFilterFlowData.length > 0 &&
        updatedFilterFlowData.some((filterProData) => {
          if (isEmptyFieldUpdateValue(filterProData)) {
            isUserFilterHasValue = true;
            return 0;
          }
          return false;
        });
    }
    const query = generateReportQuery(
      clonedReports,
      clonedFilter,
      reportConfig,
      isUserFilterHasValue ? reportData?.reportViewUserFilter : {},
      updatedState,
      false,
    );
    const { source_Data = {}, report_Data = {} } = reportConfig;

    dispatch(getReportValuesThunk(source_Data, query, report_Data.report_type));
  };

  const elementHeaderContent = () => {
    const title = isEditSecurity
      ? REPORT_CREATION.OPTION_LIST.EDIT_SECURITY
      : REPORT_CREATION.SECURITY.BASIC_DETAILS;

    return (
      <>
        <Title
          className={cx(BS.D_FLEX, BS.JC_CENTER, gClasses.PX45)}
          content={title}
          headingLevel={ETitleHeadingLevel.h3}
          size={ETitleSize.medium}
        />
        <CloseIcon
          className={cx(styles.CloseIcon, BS.JC_END, gClasses.CursorPointer)}
          onClick={onModalCancelClickHandler}
          role={ARIA_ROLES.BUTTON}
          tabIndex={0}
          onKeyDown={(e) => {
            keydownOrKeypessEnterHandle(e) && onModalCancelClickHandler();
          }}
        />
      </>
    );
  };

  const elementMainContent = () =>
    isEditSecurity ? <Security reportId={reportId} /> : <BasicDetails />;

  const elementFooterContent = () => (
    <>
      <button
        className={cx(gClasses.ClickableElement, styles.CancelButton)}
        onClick={onModalCancelClickHandler}
      >
        {REPORT_CREATION.CANCEL}
      </button>
      <Button
        buttonText={REPORT_CREATION.SAVE}
        onClickHandler={onModalSaveClickHandler}
        disabled={isPublishLoading}
      />
    </>
  );

  const headerLoading = () => (
    <div className={cx(styles.Header)}>
      <Skeleton height={20} width={200} className={gClasses.MB8} />
      <div className={styles.HeaderContent}>
        <div className={cx(gClasses.W65)}>
          <Skeleton height={30} enableAnimation />
        </div>

        <div className={cx(BS.D_FLEX_JUSTIFY_END, BS.ALIGN_ITEM_CENTER)}>
          <Skeleton height={36} width={80} className={gClasses.ML16} />
          <Skeleton height={36} width={119} className={gClasses.ML16} />
          <Skeleton height={24} width={24} className={gClasses.ML16} />
        </div>
      </div>
    </div>
  );
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
    _filter = reportData?.reportViewUserFilter,
    upDatedState = state,
    isFromDelete = false,
    reportViewUserFilter = reportData?.reportViewUserFilter,
  ) => {
    const clonedErrorList = jsUtility.cloneDeep(errorList || {});
    const clonedUserFilter = jsUtility.cloneDeep(_filter);
    const clonedReportViewUserFilter =
      jsUtility.cloneDeep(
        isFromDelete
          ? reportViewUserFilter?.inputFieldDetailsForFilter
          : clonedUserFilter.inputFieldDetailsForFilter,
      ) || [];
    const { updatedFilterFlowData, isValid } = validateFilterValues(
      clonedReportViewUserFilter,
      t,
    );
    let isUserFilterHasValue = false;
    if (isValid) {
      updatedFilterFlowData &&
        updatedFilterFlowData.length > 0 &&
        updatedFilterFlowData.some((filterProData) => {
          if (isEmptyFieldUpdateValue(filterProData)) {
            isUserFilterHasValue = true;
            return 0;
          }
          return false;
        });
    }
    const clonedReports = jsUtility.cloneDeep(_charts);
    clonedReports.chartLabel = [];
    clonedReports.chartData = [];
    const updatedData = { reports: clonedReports };
    if (isFromDelete) {
      updatedData.userFilter = clonedUserFilter;
      updatedData.reportViewUserFilter = reportViewUserFilter;
    } else {
      updatedData.reportViewUserFilter = clonedUserFilter;
    }
    dispatch(
      dataChange({
        data: updatedData,
      }),
    );

    if (errorList?.fieldDeleted) {
      let isThereADeletedField = false;
      clonedReports.selectedFieldsFromReport.forEach((field) => {
        if (field.isFieldDeleted) {
          isThereADeletedField = true;
        }
      });

      clonedReportViewUserFilter.forEach((field) => {
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

    const userFiler = isFromDelete ? reportViewUserFilter : clonedUserFilter;
    const query = generateReportQuery(
      clonedReports,
      filter,
      reportConfig,
      isUserFilterHasValue ? userFiler : {},
      upDatedState,
      false,
    );
    const { source_Data = {}, report_Data = {} } = reportConfig;

    dispatch(getReportValuesThunk(source_Data, query, report_Data.report_type));
  };

  const onGetReportDrillDownData = (reports, drillDownFilterData) => {
    const clonedErrorList = jsUtility.cloneDeep(errorList || {});
    const clonedReports = jsUtility.cloneDeep(reports);
    const clonedReportViewUserFilter = jsUtility.cloneDeep(
      reportData?.reportViewUserFilter,
    );

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
      dayFilterData: rest.dayFilterData,
      monthFilterData: rest.monthFilterData,
      yearFilterData: rest.yearFilterData,
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

  return (
    <>
      {deleteModal && reportConfig._id && (
        <DeleteReportModal
          closeFn={() => setDeleteModal(null)}
          deleteReportCallBack={() => {
            blockNavigationRef.current = false;
          }}
          reportId={reportConfig._id}
        />
      )}

      {reportSubActionType && (
        <Modal
          id={reportSubActionType}
          isModalOpen
          headerContent={elementHeaderContent()}
          headerContentClassName={cx(
            BS.D_FLEX,
            BS.JC_BETWEEN,
            gClasses.PT25,
            gClasses.PR16,
          )}
          mainContent={elementMainContent()}
          footerContent={elementFooterContent()}
          footerContentClassName={styles.ModalFooter}
          modalStyle={ModalStyleType.modal}
          className={styles.ReportModal}
          mainContentClassName={cx(
            styles.ModalContent,
            BS.D_FLEX,
            BS.JC_CENTER,
          )}
          modalSize={ModalSize.md}
        />
      )}
      <Prompt when message={promptBeforeLeaving} />
      <div>
        {reportConfig?.isLoading ? (
          headerLoading()
        ) : (
          <div className={cx(styles.Header)}>
            <Breadcrumb
              list={links}
              className={styles.Breadcrumb}
              handleLinkClick={onEditCancelClickHandler}
              preventNavigation
            />
            <div className={cx(styles.HeaderContent)}>
              <div
                className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.W65)}
              >
                <Title
                  content={
                    reportConfig?.name || REPORT_CREATION.UNTITLED_REPORT
                  }
                  size={ETitleSize.medium}
                  className={cx(gClasses.Ellipsis)}
                />
              </div>
              <div className={cx(BS.D_FLEX_JUSTIFY_END, BS.ALIGN_ITEM_CENTER)}>
                <button
                  className={cx(gClasses.ClickableElement, styles.CancelButton)}
                  onClick={onEditCancelClickHandler}
                >
                  {REPORT_CREATION.CANCEL}
                </button>
                <Button
                  buttonText={
                    reportId
                      ? REPORT_CREATION.SAVE_REPORT
                      : REPORT_CREATION.PUBLISH_REPORT
                  }
                  onClickHandler={onPublishOrSaveClickHandler}
                  disabled={isPublishLoading}
                />
                <div
                  className={cx(BS.P_RELATIVE, gClasses.ML8)}
                  ref={moreOptionWrapperRef}
                >
                  <button
                    className={cx(
                      gClasses.ClickableElement,
                      gClasses.CursorPointer,
                      gClasses.P5,
                    )}
                    onClick={() => setOptionsOpen((p) => !p)}
                  >
                    <SettingsAppIcon />
                  </button>
                  {optionsOpen && (
                    <div className={cx(styles.OptionList)}>
                      <button
                        onClick={onClickEditBasicDetails}
                        className={cx(styles.OptionBtn)}
                      >
                        <EditDetailsIconV2 />
                        <span>
                          {REPORT_CREATION.OPTION_LIST.EDIT_BASIC_DETAILS}
                        </span>
                      </button>
                      <button
                        onClick={onClickEditSecurity}
                        className={cx(styles.OptionBtn)}
                      >
                        <LockIcon />
                        <span>{REPORT_CREATION.OPTION_LIST.EDIT_SECURITY}</span>
                      </button>
                      {reportId && (
                        <button
                          className={cx(styles.OptionBtn)}
                          onClick={() => setDeleteModal(true)}
                        >
                          <Trash />
                          <span>
                            {REPORT_CREATION.OPTION_LIST.DELETE_REPORT}
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={cx(styles.MainContent)}>
          <div className={cx(styles.ReportView)}>
            <ReportPreview
              isReportCreation
              reports={reports}
              reportConfig={reportConfig}
              errorList={errorList}
              onClickEditBasicDetails={onClickEditBasicDetails}
              reportData={reportData}
              setFilter={onSetFilter}
              onGetReportView={onGetReportFilter}
              onGetChartData={onGetChartData}
              onGetReportDrillDownData={onGetReportDrillDownData}
            />
          </div>

          <div className={styles.ConfigPanel}>
            <ConfigPanel
              onGetChartData={onGetChartData}
              onGetReportView={onGetReportFilter}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportCreation;
