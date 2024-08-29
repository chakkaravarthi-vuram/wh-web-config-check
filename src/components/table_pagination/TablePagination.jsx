import React from 'react';
import Radium from 'radium';
import Table from '../table/Table';
import TableListing from '../table_listing/Table';
import Pagination from '../form_components/pagination/Pagination';

function TablePagination(props) {
  const {
    tblClassName,
    tblRowClassName,
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
    tblIsTableViewListing,
    // Pagination Props
    paginationInnerClass,
    paginationItemsCountPerPage,
    paginationActivePage,
    paginationTotalItemsCount,
    paginationClassName,
    paginationFlowDashboardView,
    paginationIsDataLoading,
    paginationResponseTableView,
    paginationType,
    paginationOnChange,
    paginationItem,
    showItemDisplayInfoStrictly,
    tableErrorMessage,
    hidePagination,
    headerClassName,
    bodyClassName,
    rowsPerPageDropdown,
    libraryManagementStyles,
    pageRangeDisplayed,
    tableContainerClass,
    tableContainerStyle,
    tblIsInfiniteScroll,
    hasMore,
    onLoadMoreCallHandler,
    tblBodyRef,
    isDashboard,
  } = props;

  const TableComponent = tblIsTableViewListing ? TableListing : Table;

  return (
    <div>
        <TableComponent
          className={tblClassName}
          rowClassName={tblRowClassName}
          header={tblHeader}
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
          tableErrorMessage={tableErrorMessage}
          headerClassName={headerClassName}
          bodyClassName={bodyClassName}
          tableContainerClass={tableContainerClass}
          tableContainerStyle={tableContainerStyle}
          isInfiniteScrollEnabled={tblIsInfiniteScroll}
          hasMore={hasMore}
          onLoadMoreCallHandler={onLoadMoreCallHandler}
          tblBodyRef={tblBodyRef}
          isCreateDashboard={isDashboard}
        />
        {
          !hidePagination && (
          <Pagination
            innerClass={paginationInnerClass}
            itemsCountPerPage={paginationItemsCountPerPage}
            activePage={paginationActivePage}
            paginationItem={paginationItem}
            totalItemsCount={paginationTotalItemsCount}
            className={paginationClassName}
            flowDashboardView={paginationFlowDashboardView}
            isDataLoading={paginationIsDataLoading}
            responseTableView={paginationResponseTableView}
            type={paginationType}
            onChange={paginationOnChange}
            tblIsDashboard
            showItemDisplayInfoStrictly={showItemDisplayInfoStrictly}
            rowsPerPageDropdown={rowsPerPageDropdown}
            libraryManagementStyles={libraryManagementStyles}
            pageRangeDisplayed={pageRangeDisplayed}
          />
        )}
    </div>
  );
}

export default Radium(TablePagination);
