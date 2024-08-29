import React, { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { Table as ReactstrapTable } from 'reactstrap';
import { values } from 'lodash';
import Radium from 'radium';
import Skeleton from 'react-loading-skeleton';
import HELPER_MESSAGE_TYPE from 'components/form_components/helper_message/HelperMessage.strings';
import HelperMessage from 'components/form_components/helper_message/HelperMessage';
import ThemeContext from '../../hoc/ThemeContext';
import DropdownList from '../form_components/dropdown/dropdown_list/DropdownList';
import { POPPER_PLACEMENTS } from '../auto_positioning_popper/AutoPositioningPopper';
import TableRowWithPopper from './TableRowWithPopper';
import gClasses from '../../scss/Typography.module.scss';
import { BS } from '../../utils/UIConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import styles from './Table.module.scss';
import { chunkStringToArray, keydownOrKeypessEnterHandle } from '../../utils/UtilityFunctions';
import Pagination from '../form_components/pagination/Pagination';
import jsUtils, { nullCheck } from '../../utils/jsUtility';
import DroppableWrapper from '../form_builder/dnd/droppable_wrapper/DroppableWrapper';
import DraggableWrapper from '../form_builder/dnd/draggable_wrapper/DraggableWrapper';
import {
  setTableCustomDragElement,
  setTableCustomDropElement,
} from '../../utils/formUtils';

const ReactInfiniteScrollComponent =
  require('react-infinite-scroll-component').default;

function Table(props) {
  const { buttonColor } = useContext(ThemeContext);
  const {
    className,
    rowClassName,
    headerClassName,
    header,
    data,
    fixFirstColumn,
    isCompletedForm,
    noOverflow,
    isDataListEntryTable,
    isRowClick,
    onRowClick,
    popupDropdownOptionList,
    onPopupOptionClickHandler,
    enablePopper,
    isDataLoading,
    loaderColCount,
    loaderRowCount,
    tableError,
    tableErrorIndex,
    createTableError,
    popperRef,
    enableInternalPagination,
    rowCountPerPage,
    tableRef,
    fieldListIndex,
    onFieldDragEndHandler,
    enableDragAndDrop,
    tableErrorMessage,
    isTestBed,
    paddingTd,
    userManagementRowClass,
    bodyClassName,
    errorRowIndices,
    tableContainerClass,
    tableContainerStyle,
    isInfiniteScrollEnabled,
    onLoadMoreCallHandler,
    hasMore,
    tblBodyRef,
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef(popperRef);
  useEffect(() => {
    if (tableRef && tableRef.current) {
      if (tableRef && jsUtils.has(tableRef.current, [`${fieldListIndex}`])) {
        scrollRef.current.scrollLeft = tableRef.current[`${fieldListIndex}`];
      }
    }
  }, []);
  // Get Styles
  const rowStyle = styles.TableRow;

  const tdDraggableWrapper = (idk, rowDataLength, dataItem) => (
    <DraggableWrapper
      enableDragAndDrop
      isDragDisabled={false}
      enableIsDragging
      id={`TableField-${fieldListIndex}`}
      index={idk}
      isCustomDraggable
      setCustomDraggable={setTableCustomDragElement}
    >
      <div>{dataItem}</div>
    </DraggableWrapper>
  );
  const getRowData = (rowData, isHeader = false, wrapWithDraggable = false) => {
    const rowDataLength = rowData.length;

    return rowData.map((dataItem, idk) => {
      if (isDataLoading) {
        return (
          <td>
            <Skeleton />
          </td>
        );
      }
      if (typeof dataItem === 'object') {
        return wrapWithDraggable ? (
          tdDraggableWrapper(idk, rowDataLength, dataItem)
        ) : (
          <td className={paddingTd}>
            <div>{dataItem}</div>
          </td>
        );
      }
      if (isHeader && dataItem) {
        return (
          <td>
            {chunkStringToArray(dataItem, 25).map((str) => (
              <div className={BS.D_FLEX}>{str}</div>
            ))}
          </td>
        );
      } else {
        return (
          <td className={paddingTd}>
            <div title={dataItem}>{dataItem}</div>
          </td>
        );
      }
    });
  };

  const getContentRowData = (contentRowData) =>
    contentRowData.map((eachRow, index) => {
      let rowClass = null;
      let rowBorderClass = null;
      let contentRowDataItem = eachRow;
      if (jsUtils.isArray(eachRow) && eachRow[eachRow.length - 1]?.is_test_bed_task) {
        rowBorderClass = styles.RowBorderClass;
      }
      if (nullCheck(eachRow, 'rowClass')) {
        rowClass = eachRow.rowClass;
        contentRowDataItem = eachRow.rowData;
      }
      let errorClass;
      if (createTableError) {
        errorClass = styles.TableError;
      }
      if (tableError && tableErrorIndex === index) {
        errorClass = styles.TableError;
      }
      if ((enablePopper && !isDataLoading) || isTestBed) {
        let id = null;
        if (isDataListEntryTable) {
          id = contentRowDataItem[contentRowDataItem.length - 1];
          contentRowDataItem.splice(-1, 1);
        }
        const popupOptionClicked = (value) => {
          onPopupOptionClickHandler(value, id);
        };
        return (
          <TableRowWithPopper
            popperClassName={cx(gClasses.ZIndex1, styles.Popper)}
            popperPlacement={POPPER_PLACEMENTS.AUTO}
            popperAllowedAutoPlacements={[
              POPPER_PLACEMENTS.TOP,
              POPPER_PLACEMENTS.BOTTOM,
            ]}
            popperFixedStrategy
            popperShowTooltip
            rowData={getRowData(values(contentRowDataItem))}
            id={id}
            index={index}
            rowClassName={cx(rowClassName, errorClass, rowClass, rowBorderClass)}
            onRowClick={onRowClick}
            isDataListEntryTable
            isTestBed={isTestBed}
          >
            <DropdownList
              className={styles.Dropdown}
              optionList={popupDropdownOptionList}
              isVisible
              noAbsolutePosition
              isNewDropdown
              showTooltip
              onClick={popupOptionClicked}
              onKeyDownHandler={popupOptionClicked}
              buttonColor={buttonColor}
            />
          </TableRowWithPopper>
        );
      }
      let instanceId = null;
      if (isRowClick && !isDataLoading) {
        instanceId = contentRowDataItem[contentRowDataItem.length - 1];
        contentRowDataItem.splice(-1, 1);
      }
      return (
        <tr
          className={cx(
            rowClassName,
            errorClass,
            rowClass,
            userManagementRowClass,
            rowBorderClass,
          )}
          onClick={() => isRowClick && onRowClick(instanceId)}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && isRowClick && onRowClick(instanceId)}
          tabIndex={isRowClick ? '0' : '-1'}
          role={isRowClick ? 'button' : 'presentation'}
        >
          {getRowData(values(contentRowDataItem))}
        </tr>
      );
    });
  const getPaginatedData = () => {
    if (enableInternalPagination) {
      return data.slice(
        (currentPage - 1) * rowCountPerPage,
        currentPage * rowCountPerPage,
      );
    }
    return data;
  };
  let headerRow = getRowData(
    isDataLoading ? Array(loaderColCount).fill() : header,
    true,
    enableDragAndDrop,
  );
  if (enableDragAndDrop && !isDataLoading) {
    const allDraggableFIelds = headerRow;
    headerRow = (
      <DroppableWrapper
        enableDragAndDrop
        onFieldDragEndHandler={(event) => {
          event.isFromTable = true;
          event.fieldIndex = fieldListIndex;
          onFieldDragEndHandler(event);
        }}
        id={`table-${fieldListIndex}`}
        index={fieldListIndex}
        isCustomDroppable
        setCustomDroppable={setTableCustomDropElement}
        direction="horizontal"
      >
        {allDraggableFIelds}
      </DroppableWrapper>
    );
  }
  const contentRow = getContentRowData(
    isDataLoading
      ? Array(loaderRowCount).fill(Array(loaderColCount).fill())
      : getPaginatedData(),
  );
  const pagination = enableInternalPagination ? (
    <Pagination
      activePage={currentPage}
      itemsCountPerPage={rowCountPerPage}
      totalItemsCount={contentRow.length}
      onChange={(currPage) => setCurrentPage(currPage)}
      className={gClasses.MT15}
      isDataLoading={isDataLoading}
    />
  ) : null;

  const tableBodyData = isInfiniteScrollEnabled ? (
    <tbody
      id="scrollable-tbody"
      ref={tblBodyRef}
      className={cx(bodyClassName, styles.InfiniteScrollTbody)}
    >
      <ReactInfiniteScrollComponent
        dataLength={contentRow.length}
        next={onLoadMoreCallHandler}
        hasMore={hasMore}
        loader={Array(loaderRowCount).fill(Array(loaderColCount).fill())}
        scrollableTarget="scrollable-tbody"
        scrollThreshold={0.4}
        className={cx(gClasses.ScrollBar, styles.TableListView)}
      >
        {contentRow}
      </ReactInfiniteScrollComponent>
    </tbody>
  ) : (
    <tbody className={cx(bodyClassName)}>{contentRow}</tbody>
  );

  return (
    <>
      <div
        className={cx(
          BS.TABLE_RESPONSIVE,
          tableContainerClass,
          gClasses.ScrollBar,
          isCompletedForm && gClasses.MB10,
          !isCompletedForm && noOverflow,
          (tableError || createTableError) &&
            jsUtils.isEmpty(errorRowIndices) &&
            gClasses.ErrorInputBorder,
        )}
        onScroll={(event) => {
          if (tableRef) {
            jsUtils.set(
              tableRef.current,
              [`${fieldListIndex}`],
              event.target.scrollLeft,
            );
          }
        }}
        ref={scrollRef}
        style={tableContainerStyle}
      >
        <ReactstrapTable
          fluid
          className={cx(
            className,
            !tableError && rowStyle,
            styles.Table,
            styles.TableDashboardBorder,
            {
              [styles.FixedFirstColumn]: fixFirstColumn,
            },
          )}
        >
          <thead className={cx(headerClassName, { [styles.InfiniteScrollThead]: isInfiniteScrollEnabled })}>{headerRow}</thead>
          {tableBodyData}
        </ReactstrapTable>
      </div>
      {tableErrorMessage && (
        <HelperMessage
          message={tableErrorMessage}
          type={HELPER_MESSAGE_TYPE.ERROR}
          id="table_common_id"
          className={gClasses.MT2}
        />
      )}
      {pagination}
    </>
  );
}
Table.defaultProps = {
  className: EMPTY_STRING,
  header: [],
  data: [],
  fixFirstColumn: false,
  isCompletedForm: false,
  noOverflow: false,
  isDataListEntryTable: false,
  enablePopper: false,
  loaderColCount: 4,
  loaderRowCount: 5,
  isDisplayTaskList: false,
  tableData: [],
  max_width: 0,
  enableDragAndDrop: false,
  isTestBed: false,
  errorRowIndices: [],
  errorColumnIndex: [],
};
Table.propTypes = {
  className: PropTypes.string,
  header: PropTypes.arrayOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  fixFirstColumn: PropTypes.bool,
  isCompletedForm: PropTypes.bool,
  noOverflow: PropTypes.bool,
  isDataListEntryTable: PropTypes.bool,
  enablePopper: PropTypes.bool,
  loaderColCount: PropTypes.number,
  loaderRowCount: PropTypes.number,
  isDisplayTaskList: PropTypes.bool,
  tableData: PropTypes.arrayOf(PropTypes.any),
  max_width: PropTypes.number,
  enableDragAndDrop: PropTypes.bool,
  isTestBed: PropTypes.bool,
  errorRowIndices: PropTypes.arrayOf(PropTypes.any),
  errorColumnIndex: PropTypes.arrayOf(PropTypes.any),
};
export default Radium(Table);
