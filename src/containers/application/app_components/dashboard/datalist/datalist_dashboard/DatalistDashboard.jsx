import React, { useEffect, useRef, useState, useContext } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  TableWithPagination,
  BorderRadiusVariant,
  TableColumnWidthVariant,
  Skeleton,
  Tab,
  Avatar,
  AvatarSizeVariant,
  AvatarBorderRadiusVariant,
  Text,
  ETitleSize,
  Title,
  Button,
  EButtonType,
  ETitleAlign,
  ETitleHeadingLevel,
  ETextSize,
  EButtonSizeType,
} from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { useHistory, useParams } from 'react-router-dom';
import ConfirmationModal from 'components/form_components/confirmation_modal/ConfirmationModal';
import ThemeContext from '../../../../../../hoc/ThemeContext';
import { setDatalistDashboardById } from '../../../../../../redux/reducer/ApplicationDashboardReportReducer';
import { BS, ARIA_ROLES } from '../../../../../../utils/UIConstants';
import gClasses from '../../../../../../scss/Typography.module.scss';
import styles from './DatalistDashboard.module.scss';
import { getDatalistValuesActionThunk } from '../../../../../../redux/actions/ApplicationDashboardReport.Action';
import {
  clearDownloadInputField,
  getAppFlowFilterQuery,
  getSortDataBySortOrder,
  getTableData,
} from '../../flow/Flow.utils';
import {
  isBasicUserMode,
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
import {
  ARIA_LABEL,
  PD_MODAL_STRINGS,
} from '../../../../../flow/flow_dashboard/FlowDashboard.string';
import {
  ENTITY_TYPE,
  FLOW_STRINGS,
  TAB_OPTIONS,
} from '../../flow/Flow.strings';
import Tooltip from '../../../../../../components/tooltip/Tooltip';
import InfoCircle from '../../../../../../assets/icons/application/InfoCircle';
import {
  APP,
  DATA_LIST_DASHBOARD,
  DATALIST_USERS,
} from '../../../../../../urls/RouteConstants';
import {
  DATA_LIST_STRINGS,
  DATALIST_ENTRY_ACTIONS,
  PD_TAB,
  DATA_LIST_WARNING_MESSAGE,
  DATALIST_NO_DATA,
} from '../../../../../data_list/data_list_dashboard/DataList.strings';
import { FORM_PARENT_MODULE_TYPES } from '../../../../../../utils/constants/form.constant';
import { DASHBOARD_STRINGS } from '../Datalist.strings';
import AddDataList from '../../../../../data_list/data_list_dashboard/add_data_list/AddDataList';
import BulkUpload from '../../../../../data_list/data_list_dashboard/bulk_upload/BulkUpload';
import {
  dataListDashboardDataChange,
  setDataListDashboardTabIndex,
  setPopperVisibilityTruncateAll,
  toggleAddDataListModalVisibility,
} from '../../../../../../redux/reducer/DataListReducer';
import Task from '../../../../../data_list/view_data_list/addTask/Task';
import { POPPER_PLACEMENTS } from '../../../../../../components/auto_positioning_popper/AutoPositioningPopper';
import MoreIcon from '../../../../../../assets/icons/MoreIcon';
import Dropdown from '../../../../../../components/form_components/dropdown/Dropdown';
import {
  getDataListEntryTaskListApi,
  truncateAllEntryThunk,
} from '../../../../../../redux/actions/DataListAction';
import DatalistDashboardTaskEntry from './datalist_tasks/DatalistDashboardTaskEntry';
import AppliedFilter from '../../../../../../components/dashboard_filter/AppliedFilter';
import { getExportFlowDashboard } from '../../../../../../redux/actions/FlowDashboard.Action';
import Download from '../../../../../../components/download/Download';
import EmptyAppIcon from '../../../../../../assets/icons/application/EmptyAppIcon';
import {
  ROUTE_METHOD,
  ROWS_PER_PAGE_VALUE,
  UTIL_COLOR,
} from '../../../../../../utils/Constants';
import { getColorSchemeByThemeContext } from '../../../AppComponent.utils';
import DashboardWidgets from './dashboard_widgets/DashboardWidgets';
import {
  INDIVIDUAL_ENTRY_MODE,
  INDIVIDUAL_ENTRY_TYPE,
  IndividualEntryModel,
} from '../../../../../shared_container';
import { dataListOptions } from '../Datalist.utils';

function DatalistDashboard(props) {
  const { t } = useTranslation();
  const datalistCommonDashboard = useSelector((store) => store.DataListReducer);
  const [currentDlUUid, setCurrentDlUuid] = useState(EMPTY_STRING);

  const {
    originalDatalist,
    datalistData,
    datalistData: {
      isLoading,
      datalist_id,
      datalist_uuid,
      data_list_name,
      data_list_description,
      lstPaginationData: { pagination_data, pagination_details },
      filter,
      filter: { headerDimension, download_is_open, order },
      pdTabIndex = TAB_OPTIONS(t)[0].tabIndex,
      dataListSecurity: { is_system_defined },
      can_add_datalist_entry,
      can_reassign,
      features,
    },
    componentLabel = null,
    componentId = null,
    cancelToken,
    toggleDataListModalVisibilityAction,
    onDatalistDataUpdate,
    setTruncatePopperVisibility,
    truncateVisibility,
    truncateAllEntriesApiCall,
    tabIndex,
    getDataListEntryTaskList,
    isAppDashboard,
    componentDetails,
    userDatalistUuid,
  } = props;
  const history = useHistory();
  const {
    dataListModalVisibility: { isVisible, type },
  } = datalistCommonDashboard;
  const params = useParams();
  const { DlTab } = useParams();
  const instanceId = params?.datalistInstanceId;
  const { uuid } = params;
  const { total_count, page, size } = jsUtility.isArray(pagination_details)
    ? pagination_details[0]
    : {};
  const dispatch = useDispatch();
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
  const [renderedContent, setRenderedContent] = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);

  const getDatalistValues = (
    skip_data = 0,
    limit_data = size,
    pageNumber = 1,
    _datalistData = datalistData,
    search = EMPTY_STRING,
  ) => {
    const clonedDatalistData = jsUtility.cloneDeep(_datalistData);
    const queryData = getAppFlowFilterQuery(
      clonedDatalistData,
      limit_data,
      skip_data,
      true,
    );
    if (pagination_details && pagination_details.length > 0) {
      clonedDatalistData.lstPaginationData.pagination_details[0].page =
        pageNumber;
      clonedDatalistData.lstPaginationData.pagination_details[0].size =
        limit_data;
    }
    if (
      queryData.query_config.selected_fields.report_fields &&
      queryData.query_config.selected_fields.report_fields.length > 0
    ) {
      dispatch(
        getDatalistValuesActionThunk(
          datalist_uuid,
          queryData,
          search,
          clonedDatalistData,
          cancelToken,
        ),
      );
    }
  };

  const onChangePage = (pageNumber) => {
    if (pageNumber) {
      const clonedDatalistData = jsUtility.cloneDeep(datalistData);
      const selectedPageNumMinus = pageNumber - 1;
      const offset = selectedPageNumMinus * size;
      getDatalistValues(offset, size, pageNumber, clonedDatalistData, search);
    }
  };

  useEffect(() => {
    if (datalist_id) {
      getDatalistValues();
      if (params?.datalistInstanceId) {
        toggleDataListModalVisibilityAction(
          DATALIST_ENTRY_ACTIONS.VIEW_DETAILS,
        );
      }
      if (type === DATALIST_ENTRY_ACTIONS.ADD_DATA) {
        onDatalistDataUpdate({
          particularDataListDetails: {
            ...originalDatalist?.particularDataListDetails,
            _id: datalist_id,
          },
        });
      }
    }
  }, [datalist_id && !jsUtility.isEmpty(order) && !jsUtility.isEmpty(headerDimension)]);

  useEffect(() => {
    if (params?.datalistInstanceId) {
      toggleDataListModalVisibilityAction(DATALIST_ENTRY_ACTIONS.VIEW_DETAILS);
    }
  }, [params?.datalistInstanceId]);

  const onClickTabChange = (tabValue) => {
    const clonedDatalistData = jsUtility.cloneDeep(datalistData);
    clonedDatalistData.pdTabIndex = tabValue;
    dispatch(
      setDatalistDashboardById({ id: datalist_uuid, data: clonedDatalistData }),
    );
    const currentTabDetail = TAB_OPTIONS(t).find(
      (eachTab) => eachTab.tabIndex === tabValue,
    );
    if (currentTabDetail) {
      const pathname =
        jsUtility.get(history, ['location', 'pathname'], EMPTY_STRING) ||
        EMPTY_STRING;
      const tabStartIndex = pathname.indexOf(DlTab);
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
            setShowFullDescription(!showFullDescription);
            !showFullDescription && setShowMoreClicked(true);
          }}
          onKeyPress={() => setShowFullDescription(!showFullDescription)}
          role="link"
          tabIndex="0"
        >
          {showFullDescription ? t(LESS_LABEL) : t(MORE_LABEL)}
        </div>,
      );
    } else setRenderedContent(null);
  };
  useEffect(() => {
    moreLessShowHandle();
  }, [isLoading, showMoreClicked, descriptionRef, showFullDescription]);

  const onRefresh = () => {
    getDatalistValues(0, size, 1, datalistData, search);
  };

  const onSortClick = (sortBy, sortOrder) => {
    const clonedDatalistData = jsUtility.cloneDeep(datalistData);
    const { order, headerDimension } = getSortDataBySortOrder(
      sortBy,
      sortOrder,
      clonedDatalistData,
    );
    clonedDatalistData.filter.order = order;
    clonedDatalistData.filter.headerDimension = headerDimension;
    getDatalistValues(0, size, 1, clonedDatalistData, search);
  };

  const onSetFilter = (_filter) => {
    const clonedDatalistData = jsUtility.cloneDeep(datalistData);
    clonedDatalistData.filter = _filter;
    dispatch(
      setDatalistDashboardById({ id: datalist_uuid, data: clonedDatalistData }),
    );
  };

  const onCloseClick = () => {
    if (showCreateTask) {
      setShowCreateTask(false);
      return;
    }
    const pathname = jsUtility.get(
      history,
      ['location', 'pathname'],
      EMPTY_STRING,
    );
    if (isAppMode) {
      const splitPathname = pathname.split('/');
      const index = splitPathname.findIndex(
        (eachPath) =>
          eachPath === DATA_LIST_DASHBOARD.replace('/', EMPTY_STRING),
      );
      if (type === DATALIST_ENTRY_ACTIONS.ADD_TASKS) {
        toggleDataListModalVisibilityAction(2);
      } else if (index > -1) {
        splitPathname.splice(pathname?.includes(APP) ? index : index + 3);
        const dataListSplitPathName = splitPathname.join('/');
        toggleDataListModalVisibilityAction(0);
        routeNavigate(history, ROUTE_METHOD.PUSH, dataListSplitPathName);
      }
    } else {
      const splitPathname = pathname.split('/');
      const index = splitPathname.findIndex(
        (eachPath) =>
          eachPath === DATA_LIST_DASHBOARD.replace('/', EMPTY_STRING),
      );
      if (type === DATALIST_ENTRY_ACTIONS.ADD_TASKS) {
        toggleDataListModalVisibilityAction(2);
      } else if (index > -1) {
        splitPathname.splice(index + 2);
        const dataListSplitPathName = splitPathname.join('/');
        toggleDataListModalVisibilityAction(0);
        routeNavigate(
          history,
          ROUTE_METHOD.PUSH,
          dataListSplitPathName,
          null,
          null,
          true,
        );
      } else {
        const userIndex = splitPathname.findIndex(
          (eachPath) => eachPath === DATALIST_USERS.replace('/', EMPTY_STRING),
        );
        if (userIndex > -1) {
          splitPathname.splice(userIndex + 2);
          const dataListSplitPathName = splitPathname.join('/');
          toggleDataListModalVisibilityAction(0);
          routeNavigate(
            history,
            ROUTE_METHOD.PUSH,
            dataListSplitPathName,
            null,
            null,
            true,
          );
        }
      }
    }
    if (type === 7) toggleDataListModalVisibilityAction(0);
    setCurrentDlUuid(EMPTY_STRING);
  };

  const getModalSourceContent = () => {
    switch (type) {
      case DATALIST_ENTRY_ACTIONS.ADD_DATA:
        return (
          <AddDataList
            isModalOpen={isVisible}
            refreshTable={onRefresh}
            onCloseClick={onCloseClick}
            dataListUuid={datalist_uuid}
            dataListEntryId={instanceId}
            dataListId={datalist_id}
            isAddView
            datalistName={data_list_name}
          />
        );
      case DATALIST_ENTRY_ACTIONS.VIEW_DETAILS:
        return (
          <IndividualEntryModel
            mode={INDIVIDUAL_ENTRY_MODE.INSTANCE_MODE}
            type={INDIVIDUAL_ENTRY_TYPE.DATA_LIST}
            metaData={{
              moduleId: datalist_id,
              moduleUuid: datalist_uuid,
              instanceId: instanceId,
              dashboardId: datalistData?.dashboardId,
            }}
            onCloseModel={onCloseClick}
            refreshOnDelete={getDatalistValues}
            otherDetails={{
              onCreateTask: () => setShowCreateTask(true),
              canReassign: datalistData?.can_reassign,
            }}
          />
        );
      case DATALIST_ENTRY_ACTIONS.BULK_UPLOAD: {
        const {
          datalistData: {
            template_document: templateDoucmentId,
            document_url_details: documentUrlDetails,
          },
        } = props;
        let templateDocument = null;
        if (templateDoucmentId) {
          templateDocument = documentUrlDetails.find(
            (value) => value.document_id === templateDoucmentId,
          );
        }
        return (
          <BulkUpload
            id="bulk-upload-modal"
            isModalOpen={isVisible}
            templateDocument={templateDocument}
            dataListId={datalist_id}
            dataListUuid={datalist_uuid}
            onCloseClick={onCloseClick}
            refreshTable={onRefresh}
          />
        );
      }
      default:
        break;
    }
    return null;
  };

  const onGetReportFilter = (_filter) => {
    const clonedDatalistData = jsUtility.cloneDeep(datalistData);
    _filter.isFilter = false;
    clonedDatalistData.filter = _filter;
    getDatalistValues(0, size, 1, clonedDatalistData, search);
  };

  const onChangeSearch = (value) => {
    const clonedDatalistData = jsUtility.cloneDeep(datalistData);
    setSearch(value);
    getDatalistValues(0, size, 1, clonedDatalistData, value);
  };

  const onClickOpenOrCloseDownload = () => {
    const clonedFilter = jsUtility.cloneDeep(filter);
    clonedFilter.download_is_open = !download_is_open;
    onSetFilter(clonedFilter);
  };

  const getDataListDetailsComponent = () => {
    if (componentLabel) {
      const id = `data_list_${componentId}`;
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
            styles.DataListTitleMobile,
          )}
        >
          <div className={cx(gClasses.CenterV, gClasses.Gap8, gClasses.W100)}>
            <div title={componentLabel} className={gClasses.W90}>
              <Title
                content={componentLabel}
                size={ETitleSize.xs}
                className={styles.DataListTitle}
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
                      content={t(DASHBOARD_STRINGS.DL_INFO)}
                      className={styles.TooltipHeader}
                    />
                    <div>
                      <Text
                        content={t(DASHBOARD_STRINGS.DL_NAME)}
                        className={cx(
                          gClasses.FTwo13Black18,
                          gClasses.FontWeight500,
                        )}
                      />
                      <Text
                        content={data_list_name}
                        className={cx(
                          gClasses.FTwo12BlackV18,
                          gClasses.FontWeight400,
                        )}
                      />
                    </div>
                    <div>
                      <Text
                        content={t(DASHBOARD_STRINGS.DL_DESCRIPTION)}
                        className={cx(
                          gClasses.FTwo13Black18,
                          gClasses.FontWeight500,
                        )}
                      />
                      <Text
                        content={data_list_description || '-'}
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
          name={data_list_name}
          size={AvatarSizeVariant.lg}
        />
        {!isLoading ? (
          <div
            ref={descriptionContainerRef}
            className={cx(
              !data_list_description ? gClasses.CenterV : null,
              gClasses.ML16,
            )}
          >
            <div className={!data_list_description ? gClasses.CenterV : null}>
              <div
                className={cx(
                  gClasses.HeadingTitle2,
                  gClasses.Ellipsis,
                  styles.FlowDashboardTitle,
                  gClasses.CenterV,
                  gClasses.TextTransformCap,
                )}
              >
                <span className={cx(gClasses.Ellipsis)}>{data_list_name}</span>
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
                  {data_list_description}
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

  const datalistEntryClicked = (value, id) => {
    const pathname = jsUtility.get(
      history,
      ['location', 'pathname'],
      EMPTY_STRING,
    );
    if (
      pathname.includes(DATA_LIST_DASHBOARD) ||
      pathname.includes(DATALIST_USERS)
    ) {
      const dataListEntryDashboardPathName = `${pathname}/${id}`;
      const dataListEntryDashboardState = {
        dashboardTab: PD_TAB.ALL.TAB_INDEX,
        modalType: value,
      };
      routeNavigate(
        history,
        ROUTE_METHOD.REPLACE,
        dataListEntryDashboardPathName,
        null,
        dataListEntryDashboardState,
        true,
      );
    } else {
      const dataListDashboardEntryPathName = `${pathname}${DATA_LIST_DASHBOARD}/${datalist_uuid}/allRequests/${id}`;
      routeNavigate(
        history,
        ROUTE_METHOD.PUSH,
        dataListDashboardEntryPathName,
        null,
        null,
        true,
      );
    }
    toggleDataListModalVisibilityAction(2);
  };

  const displayEntryDetails = (id) => {
    datalistEntryClicked(2, id);
    onDatalistDataUpdate({
      particularDataListDetails: {
        ...originalDatalist?.particularDataListDetails,
        _id: datalist_id,
      },
    });
  };

  const onClickDownload = () => {
    const clonedDatalistData = jsUtility.cloneDeep(datalistData);
    const queryData = getAppFlowFilterQuery(
      clonedDatalistData,
      size,
      1,
      ENTITY_TYPE.DATALIST,
      true,
      true,
    );
    dispatch(getExportFlowDashboard(queryData, datalist_uuid, datalist_id));
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

  const updateModalType = (value) => {
    const pdTabState = { dashboardTab: PD_TAB.ALL.TAB_INDEX, modalType: value };
    routeNavigate(history, ROUTE_METHOD.REPLACE, null, null, pdTabState);
    if (!value) onDatalistDataUpdate({ isClosed: 0 });
    toggleDataListModalVisibilityAction(value);
  };

  const addNewEntryButton =
    !isLoading && can_add_datalist_entry && features?.show_submit ? (
      <div className={cx(BS.D_FLEX)}>
        {features?.show_submit && can_add_datalist_entry && (
          <Button
            className={gClasses.ML10}
            type={EButtonType.PRIMARY}
            onClick={() => {
              updateModalType(1);
              setCurrentDlUuid(datalist_uuid);
              onDatalistDataUpdate({
                particularDataListDetails: {
                  ...originalDatalist?.particularDataListDetails,
                  _id: datalist_id,
                },
              });
            }}
            size={isAppDashboard && EButtonSizeType.SM}
            colorSchema={colorScheme}
            buttonText={
              features?.submit_button_label ||
              DATA_LIST_STRINGS(t).DASHBOARD.HEADER.ADD_NEW_BUTTON.LABEL
            }
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
          content={DATALIST_NO_DATA(t).title}
          alignment={ETitleAlign.middle}
          headingLevel={ETitleHeadingLevel.h5}
          size={ETitleSize.xs}
          className={styles.Title}
        />
        <Text
          content={DATALIST_NO_DATA(t).subTitle}
          size={ETextSize.SM}
          className={styles.SubTitle}
        />
      </div>
    </div>
  );

  const handleRowsPerPageChange = (pageSize) => {
    if (pageSize) {
      const clonedDatalistData = jsUtility.cloneDeep(datalistData);
      getDatalistValues(0, pageSize, 1, clonedDatalistData, search);
    }
  };

  const getTabContent = () => {
    if (pdTabIndex === 1) {
      const tableData = getTableData(
        pagination_data,
        headerDimension,
        FORM_PARENT_MODULE_TYPES.DATA_LIST,
      );
      return (
        <>
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
            <div className={cx(BS.W30, gClasses.CenterVSpaceBetween, BS.W100)}>
              <Text
                isLoading={isLoading}
                content={`${t(
                  DASHBOARD_STRINGS.RESULTS.LABEL_1,
                )} ${total_count} ${t(DASHBOARD_STRINGS.RESULTS.LABEL_2)}`}
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
                  id={`datalistDashboard_${datalist_id}`}
                  isRowClickable
                  isLoading={isLoading}
                  className={gClasses.PB12}
                  onRowClick={(rowId) => displayEntryDetails(rowId)}
                  onSortClick={onSortClick}
                  widthVariant={TableColumnWidthVariant.CUSTOM}
                  header={jsUtility.cloneDeep(headerDimension)}
                  tableClassName={isAppDashboard && styles.TableAppDashboard}
                  data={tableData}
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
                  colorScheme={colorScheme}
                />
              )}
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div>
          <DatalistDashboardTaskEntry
            isAllTask
            data_list_uuid={datalist_uuid}
            isOwnerUser={can_reassign}
            isNormalmodeDashboard={isAppMode && !isAppDashboard}
          />
        </div>
      );
    }
  };

  const truncateApiCallAfterDelete = () => {
    if (tabIndex === PD_TAB.ALL.TAB_INDEX) {
      onRefresh();
    } else if (tabIndex === PD_TAB.TASKS.TAB_INDEX) {
      let cancelForGetAllDataListTask;

      if (cancelForGetAllDataListTask) {
        cancelForGetAllDataListTask();
      }
      const dataListEntryTaskDetailsParams = {
        data_list_uuid: datalist_uuid,
        size: 5,
        page: 1,
      };
      getDataListEntryTaskList(dataListEntryTaskDetailsParams);
      return () => {
        const { clearSearch } = props;
        clearSearch();
        if (cancelForGetAllDataListTask) {
          cancelForGetAllDataListTask();
        }
      };
    }
    return null;
  };

  const onConfirmTruncateClick = () => {
    const param = {
      data_list_uuid: datalist_uuid,
    };
    truncateAllEntriesApiCall(param, truncateApiCallAfterDelete);
  };

  const onDropdownChange = (value) => {
    if (value === 2) updateModalType(7);
    if (value === 3) setTruncatePopperVisibility(true);
    setCurrentDlUuid(datalist_uuid);
    return EMPTY_STRING;
  };

  const onCancelOrCloseTruncateClick = () => {
    setTruncatePopperVisibility(false);
  };

  const optionsMenu = () => {
    const optionList = dataListOptions(
      can_add_datalist_entry,
      is_system_defined,
      datalistData?.isOwner,
    );
    return optionList.length > 0 ? (
      <Dropdown
        className={cx(gClasses.ML20, gClasses.ZIndex3)}
        onChange={(event) => onDropdownChange(event.target.value)}
        optionList={optionList}
        isBorderLess
        isNewDropdown
        isTaskDropDown
        placement={POPPER_PLACEMENTS.BOTTOM_END}
        fallbackPlacements={[POPPER_PLACEMENTS.TOP_END]}
        popperClasses={cx(gClasses.ZIndex2, gClasses.MT10, gClasses.ML10)}
        customDisplay={
          <MoreIcon role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.MORE_OPTIONS} />
        }
        isDataLoading={isLoading}
        selectedValue={null}
        outerClassName={styles.MenuOuterClass}
        comboboxClass={gClasses.MinWidth0}
        noInputPadding
      />
    ) : null;
  };

  return (
    <>
      {download_is_open && (
        <Download
          id="app_datalist_download_modal"
          isModalOpen={download_is_open}
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
        {currentDlUUid === datalist_uuid && truncateVisibility && (
          <ConfirmationModal
            isModalOpen={truncateVisibility}
            onConfirmClick={onConfirmTruncateClick}
            onCancelOrCloseClick={onCancelOrCloseTruncateClick}
            titleName={t(DATA_LIST_WARNING_MESSAGE.TITLE_NAME)}
            mainDescription={t(DATA_LIST_WARNING_MESSAGE.MAIN_DESCRIPTION)}
            subDescription={t(DATA_LIST_WARNING_MESSAGE.SUB_DESCRIPTION)}
            confirmationName={t(DATA_LIST_WARNING_MESSAGE.CONFIRMATION_NAME)}
            cancelConfirmationName={t(
              DATA_LIST_WARNING_MESSAGE.CANCEL_CONFIRMATION_NAME,
            )}
          />
        )}
        {(uuid === datalist_uuid ||
          (currentDlUUid === datalist_uuid &&
            (type === DATALIST_ENTRY_ACTIONS.BULK_UPLOAD ||
              type === DATALIST_ENTRY_ACTIONS.ADD_DATA))) &&
          ((type === DATALIST_ENTRY_ACTIONS.ADD_TASKS || showCreateTask) && (
            <Task
              id="datalist_adhoc_task"
              isModalOpen={isVisible}
              dataListName={data_list_name}
              dataListUuid={uuid}
              dataListId={datalist_id}
              dataListEntryId={instanceId}
              onAddTaskClosed={onCloseClick}
              onCloseIconClick={() => {
                onCloseClick();
              }}
            />
          ))}
        {(uuid === datalist_uuid ||
          (currentDlUUid === datalist_uuid &&
            (type === DATALIST_ENTRY_ACTIONS.BULK_UPLOAD ||
              type === DATALIST_ENTRY_ACTIONS.ADD_DATA))) &&
          getModalSourceContent()}
        <div
          style={{
            backgroundColor:
              history?.location?.pathname.includes(APP) && colorScheme.widgetBg,
          }}
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
              styles.CardHeader,
            )}
          >
            {getDataListDetailsComponent()}
            <div
              className={cx(
                gClasses.CenterV,
                styles.DataListDashboardHeaderActions,
              )}
            >
              <DashboardWidgets
                filter={filter}
                onSetFilter={onSetFilter}
                onGetReportFilter={onGetReportFilter}
                onRefresh={onRefresh}
                showDownload={features?.show_download && total_count > 0}
                placeholderText={`${PD_MODAL_STRINGS(t).SEARCH} ${
                  data_list_name &&
                  jsUtility.capitalizeEachFirstLetter(data_list_name)
                }`}
                onChange={onChangeSearch}
                searchText={search}
                onClickOpenOrCloseDownload={onClickOpenOrCloseDownload}
                isLoading={isLoading}
                componentDimensions={componentDetails?.coordination}
              />
              {addNewEntryButton}
              {(datalist_uuid !== userDatalistUuid) ? optionsMenu() : null}
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
              options={TAB_OPTIONS(t, features?.report_name)}
              bottomSelectionClass={gClasses.ActiveBar}
              selectedTabIndex={pdTabIndex}
              onClick={(tabValue) => onClickTabChange(tabValue)}
              textClass={styles.TabText}
              colorScheme={colorScheme}
            />
          </div>
        )}

        <div className={cx(styles.BodyContainer, gClasses.ScrollBar)}>
          <div>{getTabContent()}</div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    originalDatalist: state.DataListReducer,
    truncateVisibility: state.DataListReducer.popperTruncateVisibility,
    tabIndex: state.DataListReducer.dataListDashboardTabIndex,
    userDatalistUuid: state.UserProfileReducer.user_data_list_uuid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDataListModalVisibilityAction: (data) => {
      dispatch(toggleAddDataListModalVisibility(data));
    },
    onDatalistDataUpdate: (data) => {
      dispatch(dataListDashboardDataChange(data));
    },
    truncateAllEntriesApiCall: (data, func) => {
      dispatch(truncateAllEntryThunk(data, func));
    },
    setTruncatePopperVisibility: (data) => {
      dispatch(setPopperVisibilityTruncateAll(data));
    },
    getDataListEntryTaskList: (params) => {
      dispatch(getDataListEntryTaskListApi(params));
    },
    setDataListDashboardTabIndexAction: (data) => {
      dispatch(setDataListDashboardTabIndex(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DatalistDashboard);
