import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames/bind';
import { useSelector, connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ETextSize,
  ETitleAlign,
  ETitleHeadingLevel,
  ETitleSize,
  TableWithInfiniteScroll,
  TableColumnWidthVariant,
  TableScrollType,
  Text,
  Title,
  Input,
  EInputIconPlacement,
  Size,
  BorderRadiusVariant,
  Popper,
  EPopperPlacements,
  DropdownList,
} from '@workhall-pvt-lmt/wh-ui-library';
import PlusIconNew from 'assets/icons/PlusIconV2';
import EmptyAppIcon from 'assets/icons/application/EmptyAppIcon';
import LandingPageSearchIcon from '../../../assets/icons/landing_page/LandingPageSearchIcon';
import LandingSearchExitIcon from '../../../assets/icons/LandingSearchExitIcon';
import SortDropdownIcon from '../../../assets/icons/landing_page/SortDropdownIcon';
import gClasses from '../../../scss/Typography.module.scss';
import { ARIA_ROLES } from '../../../utils/UIConstants';
import { EMPTY_STRING, ICON_ARIA_LABELS } from '../../../utils/strings/CommonStrings';
import jsUtility from '../../../utils/jsUtility';
import { keydownOrKeypessEnterHandle, routeNavigate, useClickOutsideDetector } from '../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../utils/Constants';
import {
  PUBLISHED_REPORT_LIST,
  CREATE_REPORT_CONFIG,
  REPORT_CONFIG,
  REPORT,
  VIEW_REPORT,
  EDIT_REPORT,
} from '../../../urls/RouteConstants';
import { clearReportListing, setReportListingDataChange } from '../../../redux/reducer/ReportReducer';
import { getAllReportsActionThunk } from '../../../redux/actions/Report.Action';
import DeleteReportModal from '../delete_report/DeleteReportModal';
import { ICON_STRINGS } from '../../../components/list_and_filter/ListAndFilter.strings';
import { SORT_DROP_DOWN } from '../../flow/listFlow/listFlow.strings';
import { getLandingListingRowCount } from '../../../utils/generatorUtils';
import useWindowSize from '../../../hooks/useWindowSize';
import { constructTableData, constructTableHeader } from './ReportList.utils';
import { REPORT_LIST_CONSTANTS, REPORT_SORT_OPTIONS, REPORT_STRINGS } from '../Report.strings';
import styles from './ReportList.module.scss';

function ReportList(props) {
  const {
    getAllReportsActionThunk,
    clearReportListing,
    setReportListingDataChange,
  } = props;
  const history = useHistory();
  const matchParams = useParams();
  const [height] = useWindowSize();
  const [reportDeleteId, setReportDeleteId] = useState(null);
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const [isSortPopOverVisible, setIsSortPopOverVisible] = useState(false);
  const sortPopOverTargetRef = useRef(null);
  useClickOutsideDetector(sortPopOverTargetRef, () => setIsSortPopOverVisible(false));
  const { t } = useTranslation();
  const { SEARCH, VALUE_KEY } = REPORT_LIST_CONSTANTS(t);

  const { reportListing } = useSelector((store) => store.ReportReducer);
  const { isTrialDisplayed } = useSelector((store) => store.NavBarReducer);
  const {
    isLoading,
    reportList,
    paginationDetails: { totalCount, page },
    hasMore,
    searchText,
    sortName,
    sortField,
    sortBy,
  } = reportListing;

  const {
    REPORT_LISTINGS: { ID, SHOWING, REPORTS, EMPTY_MESSAGE },
  } = REPORT_STRINGS();

  const selectedTabIndex = matchParams.reportActionType;

  const getAllReports = (additionalParams = {}, isLoadMore) => {
    let params = {
      page: 1,
      size: getLandingListingRowCount(height, isTrialDisplayed),
      sort_field: sortField,
      sort_by: sortBy,
    };
    if (!jsUtility.isEmpty(additionalParams)) {
      params = { ...params, ...additionalParams };
    }
    getAllReportsActionThunk(params, isLoadMore);
  };

  const getReportList = (value = selectedTabIndex) => {
    if (value === PUBLISHED_REPORT_LIST) {
      getAllReports();
    }
  };

  const onSearchChangeHandler = (event) => {
    const { value } = event.target;
    setReportListingDataChange({ searchText: value });
    let param;
    if (jsUtility.isEmpty(value)) param = {};
    else param = { search: value };
    getAllReports(param);
  };

  useEffect(() => {
    setReportListingDataChange({ sortName: REPORT_SORT_OPTIONS(t)?.[0]?.label });
    getReportList(PUBLISHED_REPORT_LIST);
    return () => {
      clearReportListing();
    };
  }, [height]);

  const onClickCreateReportConfig = () => {
    const createReportConfigPathName = `/${REPORT_CONFIG}/${CREATE_REPORT_CONFIG}`;
    routeNavigate(history, ROUTE_METHOD.PUSH, createReportConfigPathName);
  };

  // Empty Message
  const elementEmptyMessage = () => (
    <div className={styles.EmptyMessageContainer}>
      <div>
        <EmptyAppIcon />
        <Title
          content={EMPTY_MESSAGE.TITLE}
          alignment={ETitleAlign.middle}
          headingLevel={ETitleHeadingLevel.h5}
          size={ETitleSize.xs}
          className={styles.Title}
        />
        {jsUtility.isEmpty(searchText) && (
        <>
          <Text
            content={EMPTY_MESSAGE.SUB_TITLE}
            size={ETextSize.SM}
            className={styles.SubTitle}
          />
          <Button
            buttonText={EMPTY_MESSAGE.CREATE_REPORT_ACTION}
            icon={<PlusIconNew />}
            onClickHandler={onClickCreateReportConfig}
          />
        </>)}
      </div>
    </div>
  );

  // Search Icon
  const getSearchIcon = () => (
    <button
      aria-label={ICON_ARIA_LABELS.SEARCH}
      className={gClasses.CenterV}
      onClick={() => setIsSearchFocus(!isSearchFocus)}
    >
      <LandingPageSearchIcon />
    </button>
  );

  const onSortHandler = (value) => {
    const sortObject = jsUtility.filter(REPORT_SORT_OPTIONS(t), [VALUE_KEY, value])?.[0] || [];
    const apiParams = {
      sort_field: sortObject?.sortField,
      sort_by: sortObject?.sortBy,
    };
    if (!jsUtility.isEmpty(searchText)) {
      apiParams.search = searchText;
    }
    setReportListingDataChange({ sortField: sortObject?.sortField, sortBy: sortObject?.sortBy, sortName: value });
    getAllReports(apiParams);
  };

  // Sort Reports
  const getSortPopper = () => (
    <Popper
      targetRef={sortPopOverTargetRef}
      open={isSortPopOverVisible}
      placement={EPopperPlacements.BOTTOM_START}
      className={gClasses.ZIndex10}
      content={
        <DropdownList
          optionList={REPORT_SORT_OPTIONS(t)}
          onClick={onSortHandler}
          selectedValue={sortName}
        />
      }
    />
  );

  const elementItemDisplay = () => (
    <div
      className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.MX24, gClasses.PT16, gClasses.PB16)}
    >
      <Text
        content={`${SHOWING} ${totalCount} ${REPORTS}`}
        className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500)}
        isLoading={isLoading}
      />
      <div className={cx(gClasses.Gap16, gClasses.CenterV, gClasses.JusEnd)}>
        <div className={gClasses.M16}>
          <Input
            content={searchText || EMPTY_STRING}
            prefixIcon={getSearchIcon()}
            onChange={onSearchChangeHandler}
            onFocusHandler={() => setIsSearchFocus(true)}
            onBlurHandler={() => setIsSearchFocus(false)}
            iconPosition={EInputIconPlacement.left}
            className={cx(styles.SearchOuterContainer, { [styles.ExpandedSearch]: isSearchFocus })}
            placeholder={SEARCH}
            size={Size.md}
            suffixIcon={
              searchText && (
                <LandingSearchExitIcon
                  title={ICON_STRINGS.CLEAR}
                  className={cx(styles.SearchCloseIcon, gClasses.CursorPointer, gClasses.Width8, gClasses.MR6)}
                  tabIndex={0}
                  height={12}
                  width={12}
                  ariaLabel={ICON_STRINGS.CLEAR}
                  role={ARIA_ROLES.BUTTON}
                  onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onSearchChangeHandler({ target: { value: EMPTY_STRING } })}
                  onClick={() => onSearchChangeHandler({ target: { value: EMPTY_STRING } })}
                />
              )
            }
            borderRadiusType={BorderRadiusVariant.rounded}
          />
        </div>
        <div className={gClasses.CenterV}>
          <Text content={SORT_DROP_DOWN.PLACE_HOLDER} className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500, gClasses.MR8)} />
          <button onClick={() => setIsSortPopOverVisible((prevState) => !prevState)} ref={sortPopOverTargetRef} className={cx(gClasses.FTwo12BlueV39, gClasses.FontWeight500, styles.SortContainer, gClasses.gap8, gClasses.CenterV)}>
            {sortName}
            <SortDropdownIcon />
            {getSortPopper()}
          </button>
        </div>
      </div>
    </div>
  );

  // Table With Infinite scroll function
  const elementReportListTable = () => {
    const onLoadMore = () => {
      if (hasMore && !isLoading) {
        const params = { page: page + 1 };
        if (!jsUtility.isEmpty(searchText)) {
          params.search = searchText;
        }
        getAllReports(params, true);
      }
    };
    const onRowEdit = (id, event) => {
      event.stopPropagation();
      const editReportIdPathName = `/${REPORT}/${EDIT_REPORT}/${id}`;
      routeNavigate(history, ROUTE_METHOD.PUSH, editReportIdPathName);
    };
    const onRowClick = (id) => {
      const viewReportIdPathName = `/${REPORT}/${VIEW_REPORT}/${id}`;
      routeNavigate(history, ROUTE_METHOD.PUSH, viewReportIdPathName);
    };

    return (
      <div id={ID} className={styles.TableContainer}>
        <TableWithInfiniteScroll
          scrollableId={ID}
          className={styles.OverFlowInherit}
          tableClassName={styles.ReportListTable}
          header={constructTableHeader()}
          headerClass={gClasses.FS12}
          data={constructTableData(reportList, onRowEdit)}
          isLoading={isLoading}
          isRowClickable
          onRowClick={onRowClick}
          scrollType={TableScrollType.BODY_SCROLL}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
          loaderRowCount={4}
          widthVariant={TableColumnWidthVariant.CUSTOM}
        />
      </div>
    );
  };

  const elementContent = () => {
    if (!isLoading && jsUtility.isEmpty(reportList)) {
      return (
        <>
          {elementItemDisplay()}
          {elementEmptyMessage()}
        </>
      );
    }

    return (
      <>
        {/* Item count with filter */}
        {elementItemDisplay()}

        {/* Table With Infinite scroll */}
        {elementReportListTable()}
      </>
    );
  };

  return (
    <div className={cx(styles.ReportListContainer, { [styles.ReportListTrialContainer]: isTrialDisplayed })}>
      {reportDeleteId && (
        <DeleteReportModal
          closeFn={() => setReportDeleteId(null)}
          cb={() => getReportList(PUBLISHED_REPORT_LIST)}
          reportId={reportDeleteId}
        />
      )}
      {/* Item count & Table With Infinite scroll */}
      <div className={cx(styles.ReportContentContainer, { [styles.ReportTrialContainer]: isTrialDisplayed })}>
        {elementContent()}
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  getAllReportsActionThunk,
  setReportListingDataChange,
  clearReportListing,
};

export default connect(null, mapDispatchToProps)(ReportList);
