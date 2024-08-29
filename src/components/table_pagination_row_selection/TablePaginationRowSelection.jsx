import React from 'react';
import cx from 'classnames/bind';
import Radium from 'radium';

import PaginationWithRowsPerPage from 'components/form_components/pagination_with_rows_per_page/pagination/PaginationRedordered';
import Skeleton from 'react-loading-skeleton';
import { ROWS_PER_PAGE } from 'components/form_components/pagination/Pagination.strings';
import Dropdown from '../form_components/dropdown/Dropdown';
import Table from '../table/Table';
import Pagination from '../form_components/pagination/Pagination';

import gClasses from '../../scss/Typography.module.scss';
import { BS } from '../../utils/UIConstants';
import styles from './TablePaginationRowSelection.module.scss';

function TablePaginationRowSelection(props) {
  const {
    // Row Select Props
    ddlRowOptionList,
    ddlRowSelectedValue,
    ddlRowOnChangeHandler,
    // Table Props
    tblClassName,
    tblRowClassName,
    tableContainerClass,
    tblHeader,
    tblData,
    tblFixFirstColumn,
    tblColData,
    tblIsCompletedTask,
    tblNoOverflow,
    tblIsDataListEntryTable,
    tblIsRowClick,
    tblOnRowClick,
    tblOnPopupBlurHandler,
    tblPopupDropdownOptionList,
    tblOnPopupOptionClickHandler,
    tblEnablePopper,
    tblIsDataLoading,
    tblLoaderColCount,
    tblLoaderRowCount,
    tblTableError,
    tblTableErrorIndex,
    tblIsDashboard,
    // Pagination Props
    hidePagination,
    paginationInnerClass,
    paginationItemsCountPerPage,
    paginationActivePage,
    paginationTotalItemsCount,
    paginationClassName,
    paginationFlowDashboardView,
    paginationDataListDashboardView,
    paginationIsDataLoading,
    paginationResponseTableView,
    paginationType,
    paginationOnChange,
    paginationItem,
    tblIsTestBed,
    isReassignPopper,
    headerCharLimit,
    userManagementRowClass,
    paddingTd,
    PaginationWithRowsPerPageStatus = false,
    pageRangeDisplayed,
    isUserManagement = false,
    isSystemDefinedUser = false,
    PaginationStyle,
    tableDataClassname,
    rowPaginationClass,
    isFixedHeader,
    data_list_uuid,
    downloadButton,
    skeletonClass,
    resultsCount,
    ddHeightClassName,
  } = props;
  let subheaderComponent = null;
  if (tblIsDataLoading) {
    subheaderComponent = <Skeleton className={skeletonClass} />;
  } else {
    subheaderComponent = resultsCount ? (
      <>
        {resultsCount}
        <div className={cx(BS.D_FLEX)}>
          <span className={cx(styles.RowsPerPage)}>{ROWS_PER_PAGE.ROW_LABEL}</span>
          <Dropdown
            id={`${data_list_uuid}_rows-per-page`}
            hideLabel
            optionList={ddlRowOptionList}
            onChange={ddlRowOnChangeHandler}
            selectedValue={ddlRowSelectedValue}
            heightClassName={ddHeightClassName}
          />
          {downloadButton}
        </div>
      </>
    ) : (
      <>
        <span className={cx(styles.RowsPerPage)}>{ROWS_PER_PAGE.ROW_LABEL}</span>
        <Dropdown
          id={`${data_list_uuid}_rows-per-page`}
          hideLabel
          optionList={ddlRowOptionList}
          onChange={ddlRowOnChangeHandler}
          selectedValue={ddlRowSelectedValue}
          heightClassName={ddHeightClassName}
        />
        {downloadButton}
      </>
    );
  }
  return (
    <div>
      {!isUserManagement && (
        <div className={cx(BS.D_FLEX, isSystemDefinedUser && gClasses.ML30, rowPaginationClass, resultsCount && BS.JC_BETWEEN)}>
          {subheaderComponent}
        </div>
      )}
      <Table
        className={tblClassName}
        rowClassName={tblRowClassName}
        tableContainerClass={tableContainerClass}
        header={tblHeader}
        charLimit={headerCharLimit}
        data={tblData}
        fixFirstColumn={tblFixFirstColumn}
        colData={tblColData}
        isCompletedTask={tblIsCompletedTask}
        noOverflow={tblNoOverflow}
        isDataListEntryTable={tblIsDataListEntryTable}
        isRowClick={tblIsRowClick}
        onRowClick={tblOnRowClick}
        onPopupBlurHandler={tblOnPopupBlurHandler}
        popupDropdownOptionList={tblPopupDropdownOptionList}
        onPopupOptionClickHandler={tblOnPopupOptionClickHandler}
        enablePopper={tblEnablePopper}
        isDataLoading={tblIsDataLoading}
        loaderColCount={tblLoaderColCount}
        loaderRowCount={tblLoaderRowCount}
        tableError={tblTableError}
        tableErrorIndex={tblTableErrorIndex}
        isDashboard={tblIsDashboard}
        isTestBed={tblIsTestBed}
        isReassignPopper={isReassignPopper}
        paddingTd={paddingTd}
        userManagementRowClass={userManagementRowClass}
        isSystemDefinedUser={isSystemDefinedUser}
        tableDataClassname={tableDataClassname}
        isFixedHeader={isFixedHeader}
      />
      {!hidePagination && !PaginationWithRowsPerPageStatus ? (
        <Pagination
          innerClass={paginationInnerClass}
          itemsCountPerPage={paginationItemsCountPerPage}
          activePage={paginationActivePage}
          paginationItem={paginationItem}
          totalItemsCount={paginationTotalItemsCount}
          className={paginationClassName}
          flowDashboardView={paginationFlowDashboardView}
          datalistDashboardView={paginationDataListDashboardView}
          isDataLoading={paginationIsDataLoading}
          responseTableView={paginationResponseTableView}
          type={paginationType}
          onChange={paginationOnChange}
          pageRangeDisplayed={pageRangeDisplayed}
          tblIsDashboard
          PaginationStyle={PaginationStyle}
        />
      ) : (
        !hidePagination && (
          <PaginationWithRowsPerPage
            itemsCountPerPage={paginationItemsCountPerPage}
            activePage={paginationActivePage}
            paginationItem={paginationItem}
            totalItemsCount={paginationTotalItemsCount}
            isDataLoading={paginationIsDataLoading}
            type={paginationType}
            onChange={paginationOnChange}
            showItemDisplayInfoStrictly
            tblIsDataLoading={tblIsDataLoading}
            ddlRowOptionList={ddlRowOptionList}
            ddlRowOnChangeHandler={ddlRowOnChangeHandler}
            ddlRowSelectedValue={ddlRowSelectedValue}
            pageRangeDisplayed={pageRangeDisplayed}
          />
        )
      )}
    </div>
  );
}

export default Radium(TablePaginationRowSelection);
