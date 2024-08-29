import React, { useEffect, useRef, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TableWithPagination,
  BorderRadiusVariant,
  TableColumnWidthVariant,
  Skeleton,
  Button,
  EButtonType,
  Tab,
  Avatar,
  AvatarSizeVariant,
  AvatarBorderRadiusVariant,
  Title,
  ETitleSize,
  Text,
  ETextSize,
  ETitleAlign,
  ETitleHeadingLevel,
  Modal,
  ModalSize,
  ModalStyleType,
  EButtonSizeType,
} from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import ThemeContext from '../../../../../../hoc/ThemeContext';
import { setFlowDashboardById } from '../../../../../../redux/reducer/ApplicationDashboardReportReducer';
import { BS, ARIA_ROLES } from '../../../../../../utils/UIConstants';
import gClasses from '../../../../../../scss/Typography.module.scss';
import styles from './FlowDashboard.module.scss';
import { getFlowValuesActionThunk } from '../../../../../../redux/actions/ApplicationDashboardReport.Action';
import {
  clearDownloadInputField,
  getAppFlowFilterQuery,
  getSortDataBySortOrder,
  getTableData,
} from '../Flow.utils';
import {
  isBasicUserMode,
  keydownOrKeypessEnterHandle,
  pxToVw,
  routeNavigate,
} from '../../../../../../utils/UtilityFunctions';
import {
  EMPTY_STRING,
  LESS_LABEL,
  MORE_LABEL,
  OF_TEXT,
  SHOWING_LABEL,
} from '../../../../../../utils/strings/CommonStrings';
import jsUtility from '../../../../../../utils/jsUtility';
import EmptyAppIcon from '../../../../../../assets/icons/application/EmptyAppIcon';
import {
  PD_MODAL_STRINGS,
  FLOW_NO_DATA,
} from '../../../../../flow/flow_dashboard/FlowDashboard.string';
import {
  ENTITY_TYPE,
  FLOW_STRINGS,
  TAB_OPTIONS,
  TAB_ROUTE,
  TAB_OPTIONS_TESTBED,
} from '../Flow.strings';
import { initiateFlowApi } from '../../../../../../redux/actions/FloatingActionMenuStartSection.Action';
import {
  REDIRECTED_FROM,
  ROUTE_METHOD,
  ROWS_PER_PAGE_VALUE,
  UTIL_COLOR,
} from '../../../../../../utils/Constants';
import InfoCircle from '../../../../../../assets/icons/application/InfoCircle';
import Tooltip from '../../../../../../components/tooltip/Tooltip';
import { FLOW_DASHBOARD } from '../../../../../../urls/RouteConstants';
import FlowEntryTask from '../../../../../flow/flow_dashboard/flow_entry_task/FlowEntryTask';
import { FORM_PARENT_MODULE_TYPES } from '../../../../../../utils/constants/form.constant';
import { getFlowTaskDetails } from '../../../../../../axios/apiService/flow.apiService';
import Download from '../../../../../../components/download/Download';
import AppliedFilter from '../../../../../../components/dashboard_filter/AppliedFilter';
import {
  getExportFlowDashboard,
  deleteTestBedFlowThunk,
} from '../../../../../../redux/actions/FlowDashboard.Action';
import {
  PUBLISH_TO_LIVE_STRINGS,
  EDIT_LIVE_FLOW_STRINGS,
  EDIT_TEST_FLOW_STRINGS,
} from '../../../../../flow/Flow.strings';
import { getTestBedFlowLink } from '../../../../../flow/flow_dashboard/flowDashboardUtils';
import TestBedConfirmationScreen, {
  CONTENT_TYPE,
} from '../../../../../edit_flow/test_bed/TestBedConfirmationScreen';
import { publishFlowThunk } from '../../../../../../redux/actions/EditFlow.Action';
import CloseIcon from '../../../../../../assets/icons/CloseIcon';
import { getColorSchemeByThemeContext } from '../../../AppComponent.utils';
import DashboardWidgets from '../../datalist/datalist_dashboard/dashboard_widgets/DashboardWidgets';

function FlowDashboard(props) {
  const history = useHistory();
  const {
    flowData,
    flowData: {
      isLoading,
      flow_id,
      flow_uuid,
      lstPaginationData: { pagination_data, pagination_details },
      filter,
      filter: { headerDimension, download_is_open, order },
      pdTabIndex,
      show_initiate,
      flow_name,
      flow_description,
      translation_data = {},
      isTestBed,
      published_as_test_bed,
      features,
    },
    componentLabel = null,
    componentId = null,
    cancelToken = null,
    holdFlowData,
    currentPageName,
    isAppDashboard = false,
    componentDetails,
  } = props;

  const { total_count, page, size } = jsUtility.isArray(pagination_details)
    ? pagination_details[0]
    : {};
  const showCreateTask = useSelector(
    (state) => state.RoleReducer.is_show_app_tasks,
  );
  const pref_locale = localStorage.getItem('application_language');

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { flowTab } = useParams();
  const themeContext = useContext(ThemeContext);
  const isAppMode = isBasicUserMode(history);
  const colorScheme = getColorSchemeByThemeContext(themeContext, history);
  let tabBg;
  if (isAppDashboard || isAppMode) tabBg = colorScheme.widgetBg;
  else tabBg = UTIL_COLOR.GREY_40;

  const descriptionContainerRef = useRef(null);
  const descriptionRef = useRef(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMoreClicked, setShowMoreClicked] = useState(false);
  const [search, setSearch] = useState(EMPTY_STRING);
  const [isTestBedEditModalVisible, toggleTestBedEditModal] = useState(false);
  const [isTestBedPublishModalVisible, toggleTestBedPublishModal] =
    useState(false);
  const [renderedContent, setRenderedContent] = useState(null);
  const flowName = translation_data?.[pref_locale]?.flow_name || flow_name;
  const flowDescription =
    translation_data?.[pref_locale]?.flow_description || flow_description;

  const getFlowValues = (
    skip_data = 0,
    limit_data = size,
    pageNumber = 1,
    _flowData = flowData,
    search = EMPTY_STRING,
  ) => {
    const clonedFlowData = jsUtility.cloneDeep(_flowData);
    const queryData = getAppFlowFilterQuery(
      clonedFlowData,
      limit_data,
      skip_data,
    );
    if (pagination_details && pagination_details.length > 0) {
      clonedFlowData.lstPaginationData.pagination_details[0].page = pageNumber;
      clonedFlowData.lstPaginationData.pagination_details[0].size = limit_data;
    }
    if (
      queryData.query_config.selected_fields.report_fields &&
      queryData.query_config.selected_fields.report_fields.length > 0
    ) {
      dispatch(
        getFlowValuesActionThunk(
          flow_uuid,
          queryData,
          search,
          clonedFlowData,
          cancelToken,
        ),
      );
    }
  };

  useEffect(() => {
    if (flow_id && !holdFlowData) {
      const clonedFlowData = jsUtility.cloneDeep(flowData);
      getFlowValues(0, size, 1, clonedFlowData);
    }
  }, [flow_id && holdFlowData && !jsUtility.isEmpty(order) && !jsUtility.isEmpty(headerDimension)]);

  const onChangePage = (pageNumber) => {
    if (pageNumber) {
      const clonedFlowData = jsUtility.cloneDeep(flowData);
      const selectedPageNumMinus = pageNumber - 1;
      const offset = selectedPageNumMinus * size;
      getFlowValues(offset, size, pageNumber, clonedFlowData, search);
    }
  };

  const onClickTabChange = (tabValue) => {
    const clonedFlowData = jsUtility.cloneDeep(flowData);
    clonedFlowData.pdTabIndex = tabValue;
    dispatch(setFlowDashboardById({ id: flow_uuid, data: clonedFlowData }));
    const currentTabDetail = TAB_OPTIONS(t).find(
      (eachTab) => eachTab.tabIndex === tabValue,
    );
    if (currentTabDetail) {
      const pathname =
        jsUtility.get(history, ['location', 'pathname'], EMPTY_STRING) ||
        EMPTY_STRING;
      const tabStartIndex = pathname.indexOf(flowTab);
      const routeLink = `${pathname.substring(0, tabStartIndex)}${
        currentTabDetail.route
      }`;
      if (tabStartIndex > -1) {
        routeNavigate(history, ROUTE_METHOD.PUSH, routeLink, null, null);
      }
    }
  };

  const moreLessShowHandle = () => {
    if (
      !isLoading &&
      (pxToVw(descriptionRef?.current?.clientWidth) >= 54 || showMoreClicked)
    ) {
      setRenderedContent(
        <div
          className={cx(
            gClasses.FTwo12BlueV39,
            gClasses.ClickableElement,
            gClasses.CursorPointer,
            styles.DisplayInline,
            gClasses.ML5,
          )}
          onClick={() => {
            setShowFullDescription((prev) => !prev);
            !showFullDescription && setShowMoreClicked(true);
          }}
          onKeyPress={() => setShowFullDescription((prev) => !prev)}
          role="link"
          tabIndex="0"
        >
          {showFullDescription ? t(LESS_LABEL) : t(MORE_LABEL)}
        </div>,
      );
    } else {
      setRenderedContent(null);
    }
  };
  useEffect(() => {
    moreLessShowHandle();
  }, [isLoading, showMoreClicked, descriptionRef, showFullDescription]);

  const onRefresh = () => {
    getFlowValues(0, size, 1, flowData, search);
  };

  const onSortClick = (sortBy, sortOrder) => {
    const clonedFlowData = jsUtility.cloneDeep(flowData);
    const { order, headerDimension } = getSortDataBySortOrder(
      sortBy,
      sortOrder,
      clonedFlowData,
    );
    clonedFlowData.filter.order = order;
    clonedFlowData.filter.headerDimension = headerDimension;
    getFlowValues(0, size, 1, clonedFlowData, search);
  };

  const onSetFilter = (_filter) => {
    const clonedFlowData = jsUtility.cloneDeep(flowData);
    clonedFlowData.filter = _filter;
    dispatch(setFlowDashboardById({ id: flow_uuid, data: clonedFlowData }));
  };

  const initiateFlow = () => {
    const postData = {
      flow_uuid,
      is_test_bed: isTestBed ? 1 : 0,
    };
    dispatch(
      initiateFlowApi(
        postData,
        history,
        currentPageName ? REDIRECTED_FROM.APP : REDIRECTED_FROM.FLOW_DASHBOARD,
        {
          sourceName: currentPageName || flowName,
          flow_uuid: flow_uuid,
          isTestBed: isTestBed,
        },
        EMPTY_STRING,
      ),
    );
  };

  const onGetReportFilter = (_filter) => {
    const clonedFlowData = jsUtility.cloneDeep(flowData);
    _filter.isFilter = false;
    clonedFlowData.filter = _filter;
    getFlowValues(0, size, 1, clonedFlowData, search);
  };

  const onChangeSearch = (value) => {
    const clonedFlowData = jsUtility.cloneDeep(flowData);
    setSearch(value);
    getFlowValues(0, size, 1, clonedFlowData, value);
  };

  const onClickOpenOrCloseDownload = () => {
    const clonedFilter = jsUtility.cloneDeep(filter);
    clonedFilter.download_is_open = !download_is_open;
    onSetFilter(clonedFilter);
  };

  const getFlowDetailsComponent = () => {
    if (componentLabel) {
      const id = `flow_${componentId}`;
      return (
        <div
          className={cx(
            BS.D_FLEX,
            BS.ALIGN_ITEM_CENTER,
            gClasses.Gap8,
            gClasses.JusSpaceBtw,
            componentDetails?.coordination?.w === 2
              ? gClasses.MaxWidth30Percent
              : gClasses.MaxWidth40Percent,
          )}
        >
          <div className={cx(gClasses.CenterV, gClasses.Gap8, gClasses.W100)}>
            <div title={componentLabel} className={gClasses.W90}>
              <Title
                content={componentLabel}
                size={ETitleSize.xs}
                className={styles.FlowTitle}
                colorScheme={{
                  ...colorScheme,
                  activeColor: colorScheme?.highlight,
                }}
              />
            </div>
            <span id={id}>
              <InfoCircle />
              <Tooltip
                id={id}
                placement="auto"
                isCustomToolTip
                customInnerClasss={styles.ToolTipContainer}
                outerClass={gClasses.OpacityFull}
                content={
                  <div className={styles.Tooltip}>
                    <Text
                      content={t(FLOW_STRINGS.FLOW_INFO)}
                      className={styles.TooltipHeader}
                    />
                    <div>
                      <Text
                        content={t(FLOW_STRINGS.FLOW_NAME)}
                        className={cx(
                          gClasses.FTwo13Black18,
                          gClasses.FontWeight500,
                        )}
                      />
                      <Text
                        content={flowName}
                        className={cx(
                          gClasses.FTwo12BlackV18,
                          gClasses.FontWeight400,
                        )}
                      />
                    </div>
                    <div>
                      <Text
                        content={t(FLOW_STRINGS.FLOW_DESCRIPTION)}
                        className={cx(
                          gClasses.FTwo13Black18,
                          gClasses.FontWeight500,
                        )}
                      />
                      <Text
                        content={flowDescription || '-'}
                        className={cx(
                          gClasses.FTwo12BlackV18,
                          gClasses.FontWeight400,
                        )}
                      />
                    </div>
                  </div>
                }
              />
            </span>
          </div>
        </div>
      );
    }
    return (
      <div className={cx(BS.D_FLEX, gClasses.Flex1, gClasses.OverflowHidden)}>
        <Avatar
          isLoading={isLoading}
          colorScheme={colorScheme}
          variant={AvatarBorderRadiusVariant.square}
          id={FLOW_STRINGS.AVATAR.ID}
          name={flowName}
          size={AvatarSizeVariant.lg}
          className={isTestBed && styles.TestBedThumbnail}
        />
        {!isLoading ? (
          <div
            ref={descriptionContainerRef}
            className={cx(
              !flowDescription ? gClasses.CenterV : null,
              gClasses.ML16,
            )}
          >
            <div className={!flowDescription ? gClasses.CenterV : null}>
              <div
                className={cx(
                  gClasses.HeadingTitle2,
                  gClasses.Ellipsis,
                  styles.FlowDashboardTitle,
                  gClasses.CenterV,
                  gClasses.TextTransformCap,
                )}
              >
                <span className={cx(gClasses.Ellipsis)}>{flowName}</span>
              </div>
              <div
                className={cx(
                  BS.D_FLEX,
                  showFullDescription
                    ? styles.FullDescription
                    : styles.Description,
                )}
              >
                <div
                  className={cx(
                    gClasses.FTwo13BlackV13,
                    showFullDescription
                      ? gClasses.WordBreakBreakWord
                      : gClasses.Ellipsis,
                    gClasses.FontWeight500,
                  )}
                  ref={descriptionRef}
                >
                  {flowDescription}
                  {showFullDescription && renderedContent}
                </div>
                {!showFullDescription && renderedContent}
              </div>
            </div>
          </div>
        ) : (
          <Skeleton width="160px" />
        )}
      </div>
    );
  };
  const EDIT_LIVE_FLOW_STRINGS_COPY = EDIT_LIVE_FLOW_STRINGS(t);

  let confirmationModal = null;
  if (isTestBedPublishModalVisible || isTestBedEditModalVisible) {
    let headerTitle = null;
    let confirmationModalContent;
    if (isTestBedPublishModalVisible) {
      confirmationModalContent = PUBLISH_TO_LIVE_STRINGS(t);
      headerTitle = PUBLISH_TO_LIVE_STRINGS(t).TITLE;
    } else if (!isTestBed && published_as_test_bed) {
      confirmationModalContent = EDIT_LIVE_FLOW_STRINGS_COPY;
      EDIT_LIVE_FLOW_STRINGS_COPY.CONTENT[
        EDIT_LIVE_FLOW_STRINGS_COPY.URI_INDEX
      ].URI = getTestBedFlowLink(flow_uuid);
      headerTitle = `${EDIT_LIVE_FLOW_STRINGS_COPY.TITLE} - ${flowName}`;
    } else {
      confirmationModalContent = EDIT_TEST_FLOW_STRINGS(t);
      headerTitle = EDIT_TEST_FLOW_STRINGS(t).TITLE;
    }
    const closeTestBedConfirmation = () => {
      toggleTestBedEditModal(false);
      toggleTestBedPublishModal(false);
    };

    const confirmationModalHeader = (
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.W100)}>
        <Title
          className={cx(gClasses.FTwo18GrayV3, gClasses.PL24, gClasses.PT15)}
          content={headerTitle}
          headingLevel={ETitleHeadingLevel.h3}
          size={ETitleSize.medium}
        />
        <CloseIcon
          className={cx(styles.CloseIcon, BS.JC_END, gClasses.CursorPointer)}
          onClick={closeTestBedConfirmation}
          role={ARIA_ROLES.BUTTON}
          tabIndex={0}
          onKeyDown={(e) =>
            keydownOrKeypessEnterHandle(e) && closeTestBedConfirmation()
          }
        />
      </div>
    );

    const proceedWithTestBedConfirmation = () => {
      if (isTestBedPublishModalVisible) {
        dispatch(deleteTestBedFlowThunk(flow_uuid)).then(() => {
          dispatch(
            publishFlowThunk(
              { flow_uuid: flow_uuid, is_test_bed_flow: true },
              false,
              history,
              t,
            ),
          );
        });
      } else if (!isTestBed && published_as_test_bed) {
        closeTestBedConfirmation();
      } else if (isTestBedEditModalVisible) {
        dispatch(deleteTestBedFlowThunk(flow_uuid, history));
      }
    };
    confirmationModal = (
      <Modal
        id="test_bed_confirmation_modal"
        isModalOpen
        onCloseClick={closeTestBedConfirmation}
        headerContent={confirmationModalHeader}
        headerContentClassName={cx(BS.D_FLEX, gClasses.M15, gClasses.ML30)}
        modalStyle={ModalStyleType.modal}
        className={styles.PublishAppModal}
        mainContentClassName={cx(BS.D_FLEX, gClasses.M15, gClasses.ML30)}
        modalSize={ModalSize.md}
        mainContent={
          <TestBedConfirmationScreen
            onGoBackClickHandler={closeTestBedConfirmation}
            primaryCtaClicked={proceedWithTestBedConfirmation}
            strings={confirmationModalContent}
            contentType={CONTENT_TYPE.POINTS}
          />
        }
      />
    );
  }

  const onRowClick = (instanceId) => {
    const pathname = jsUtility.get(
      history,
      ['location', 'pathname'],
      EMPTY_STRING,
    );
    if (pathname.includes(FLOW_DASHBOARD)) {
      const flowDashboardInstancePathName = `${pathname}/${instanceId}`;
      routeNavigate(
        history,
        ROUTE_METHOD.PUSH,
        flowDashboardInstancePathName,
        null,
        null,
        true,
      );
    } else {
      const allRequestFlowDashboardPathName = `${pathname}${FLOW_DASHBOARD}/${flow_uuid}/${TAB_ROUTE.ALL_REQUEST}/${instanceId}`;
      routeNavigate(
        history,
        ROUTE_METHOD.PUSH,
        allRequestFlowDashboardPathName,
        null,
        null,
        true,
      );
    }
  };

  const onClickDownload = () => {
    const clonedFlowData = jsUtility.cloneDeep(flowData);
    const queryData = getAppFlowFilterQuery(
      clonedFlowData,
      size,
      1,
      ENTITY_TYPE.FLOW,
      false,
      true,
    );
    dispatch(getExportFlowDashboard(queryData, flow_uuid, flow_id));
    const clonedFilter = jsUtility.cloneDeep(filter);
    const { downloadInputField, download_select_all } = clonedFilter;
    clonedFilter.downloadInputField =
      clearDownloadInputField(downloadInputField);
    clonedFilter.download_select_all =
      clearDownloadInputField(download_select_all);
    clonedFilter.selectedCount = 0;
    clonedFilter.download_is_open = false;
    onSetFilter(clonedFilter);
  };

  const initiateOrPublishFlow = () => {
    if (isTestBed) toggleTestBedPublishModal(true);
    else initiateFlow();
  };

  const elementInitiateButton =
    !isLoading && show_initiate && features?.show_submit ? (
      <div className={cx(BS.D_FLEX)}>
        {features?.show_submit && show_initiate && isTestBed && (
          <Button
            buttonText={
              features?.submit_button_label ||
              t(FLOW_STRINGS.START_TESTBED_LABEL)
            }
            onClickHandler={initiateFlow}
            type={EButtonType.SECONDARY}
            className={cx(gClasses.ML10)}
            colorSchema={colorScheme}
          />
        )}
        {features?.show_submit && show_initiate && (
          <Button
            className={gClasses.ML10}
            buttonType={EButtonType.PRIMARY}
            onClick={initiateOrPublishFlow}
            size={isAppDashboard ? EButtonSizeType.SM : EButtonSizeType.MD}
            buttonText={
              features?.submit_button_label ||
              (isTestBed
                ? t(FLOW_STRINGS.PUBLISH)
                : t(FLOW_STRINGS.START_LABEL))
            }
            colorSchema={colorScheme}
          />
        )}
      </div>
    ) : null;

  // Empty Message
  const elementEmptyMessage = () => (
    <div className={styles.EmptyMessageContainer}>
      <div>
        <EmptyAppIcon />
        <Title
          content={FLOW_NO_DATA(t).title}
          alignment={ETitleAlign.middle}
          headingLevel={ETitleHeadingLevel.h5}
          size={ETitleSize.xs}
          className={styles.Title}
        />
        <Text
          content={FLOW_NO_DATA(t).subTitle}
          size={ETextSize.SM}
          className={styles.SubTitle}
        />
      </div>
    </div>
  );

  const handleRowsPerPageChange = (pageSize) => {
    if (pageSize) {
      const clonedDatalistData = jsUtility.cloneDeep(flowData);
      getFlowValues(0, pageSize, 1, clonedDatalistData, search);
    }
  };

  const getTabComponent = () => {
    let component = null;
    switch (pdTabIndex) {
      case TAB_OPTIONS(t)[0].tabIndex:
        const tableData = getTableData(
          pagination_data,
          headerDimension,
          FORM_PARENT_MODULE_TYPES.FLOW,
          t,
          isAppMode && showCreateTask,
        );
        component = (
          <div>
            {/* Applied Filters Data */}
            <div
              className={cx(
                BS.D_FLEX,
                BS.JC_BETWEEN,
                !isAppDashboard && gClasses.MX30,
                gClasses.MT10,
                gClasses.MB10,
              )}
            >
              <div className={BS.W70}>
                {!jsUtility.isEmpty(filter) && (
                  <AppliedFilter
                    filter={filter}
                    onSetFilterAction={onSetFilter}
                    getReportData={onGetReportFilter}
                    isLoading={isLoading}
                  />
                )}
              </div>
              <div
                className={cx(BS.W30, gClasses.CenterVSpaceBetween, BS.W100)}
              >
                <Text
                  isLoading={isLoading}
                  content={`${t(
                    FLOW_STRINGS.RESULTS.LABEL_1,
                  )} ${total_count} ${t(FLOW_STRINGS.RESULTS.LABEL_2)}`}
                />
              </div>
            </div>

            <div
              style={{ backgroundColor: colorScheme.widgetBg }}
              className={cx(gClasses.PT10)}
            >
              <div className={cx({ [gClasses.PX30]: !isAppDashboard })}>
                {!isLoading && jsUtility.isEmpty(tableData) ? (
                  elementEmptyMessage()
                ) : (
                  <TableWithPagination
                    id={`flowDashboard_${flow_uuid}`}
                    subContainerClassName={
                      total_count < 5 && styles.TablePopperHeight
                    }
                    isRowClickable
                    isLoading={isLoading}
                    onRowClick={onRowClick}
                    onSortClick={onSortClick}
                    widthVariant={TableColumnWidthVariant.CUSTOM}
                    header={jsUtility.cloneDeep(headerDimension)}
                    data={tableData}
                    className={gClasses.PB12}
                    paginationProps={{
                      itemsCountPerPage: size,
                      totalItemsCount: total_count,
                      activePage: page,
                      onChange: (event, page) => onChangePage(page),
                      constructItemsCountMessage: (
                        itemStart,
                        itemEnd,
                        totalCount,
                      ) =>
                        `${t(SHOWING_LABEL)} ${itemStart} - ${itemEnd} ${t(
                          OF_TEXT,
                        )} ${totalCount}`,
                      shape: BorderRadiusVariant.square,
                      hasRowsPerPage: true,
                      rowsPerPageSelectedValue: size,
                      rowsPerPageOptionList: ROWS_PER_PAGE_VALUE,
                      onHasRowsPerPageClick: handleRowsPerPageChange,
                    }}
                    paginationClassName={gClasses.ZIndex2}
                    colorScheme={colorScheme}
                    tableClassName={isAppDashboard && styles.TableAppDashboard}
                  />
                )}
              </div>
            </div>
          </div>
        );
        break;
      case TAB_OPTIONS(t)[1].tabIndex:
        component = (
          <FlowEntryTask
            type={FORM_PARENT_MODULE_TYPES.FLOW}
            uuid={flow_uuid}
            getTaskList={getFlowTaskDetails}
            showRecordId
            location={jsUtility.get(history, ['location'], {})}
            isOwnerUser={jsUtility.get(flowData, ['canReassign'], null)}
            isNormalmodeDashboard={isAppMode && !isAppDashboard}
          />
        );
        break;
      default:
        break;
    }
    return component;
  };

  return (
    <>
      {download_is_open && (
        <Download
          id="app_flow_download_modal"
          isModalOpen={download_is_open}
          isFlow
          isLoading={false}
          filter={filter}
          onSetFilterAction={onSetFilter}
          onDownloadClickHandler={onClickDownload}
          onCloseClick={onClickOpenOrCloseDownload}
          contentClass={cx(
            styles.AdHocTaskModal,
            gClasses.ModalContentClassWithoutPadding,
          )}
        />
      )}
      <div
        className={cx(styles.Container, { [gClasses.H100Imp]: isAppDashboard })}
      >
        {/* Header */}
        <div
          className={cx(styles.Header, isTestBed && styles.TestBedBg)}
          style={{ backgroundColor: tabBg }}
        >
          <div
            className={cx(
              BS.D_FLEX,
              {
                [gClasses.PX30]: !isAppDashboard,
                [gClasses.PT15]: !isAppDashboard,
                [gClasses.JusSpaceBtw]: isAppDashboard,
              },
              gClasses.PB5,
              styles.ResponsiveStyle,
            )}
          >
            {getFlowDetailsComponent()}
            <div className={styles.DashboardActions}>
              <DashboardWidgets
                filter={filter}
                onSetFilter={onSetFilter}
                onGetReportFilter={onGetReportFilter}
                onRefresh={onRefresh}
                showDownload={
                  features?.show_download &&
                  total_count > 0 &&
                  jsUtility.get(
                    flowData,
                    [FLOW_STRINGS.IS_ADMIN_OWNER_VIEWER],
                    null,
                  )
                }
                placeholderText={`${PD_MODAL_STRINGS(t).SEARCH} ${
                  flowName && jsUtility.capitalizeEachFirstLetter(flowName)
                }`}
                onChange={onChangeSearch}
                searchText={search}
                onClickOpenOrCloseDownload={onClickOpenOrCloseDownload}
                isLoading={isLoading}
                isFlow
                componentDimensions={componentDetails?.coordination}
              />
              <div
                className={cx(
                  BS.D_FLEX,
                  gClasses.WidthFitContent,
                  gClasses.CenterV,
                )}
              >
                {elementInitiateButton}
              </div>
            </div>
          </div>
        </div>

        {/* Tab */}
        {features?.show_task_list && (
          <div
            className={cx(styles.Sticky, styles.Tab)}
            style={{ backgroundColor: tabBg }}
          >
            <Tab
              isLoading={isLoading}
              className={cx(gClasses.PT10, {
                [gClasses.PX30]: !isAppDashboard,
              })}
              options={
                isTestBed
                  ? TAB_OPTIONS_TESTBED(t, features?.report_name)
                  : TAB_OPTIONS(t, features?.report_name)
              }
              selectedTabIndex={pdTabIndex}
              onClick={(tabValue) => onClickTabChange(tabValue)}
              textClass={styles.TabText}
              colorScheme={colorScheme}
              bottomSelectionClass={gClasses.ActiveBar}
            />
          </div>
        )}

        <div className={cx(styles.BodyContainer, gClasses.ScrollBar)}>
          {getTabComponent()}
          {confirmationModal}
        </div>
      </div>
    </>
  );
}

export default FlowDashboard;
