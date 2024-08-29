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
import {
  POPPER_PLACEMENTS,
} from '../auto_positioning_popper/AutoPositioningPopper';
import TableRowWithPopper from './TableRowWithPopper';
import gClasses from '../../scss/Typography.module.scss';
import { BS } from '../../utils/UIConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import styles from './Table.module.scss';
import { chunkStringToArray, getFirstStringWithExtraDotsByArray } from '../../utils/UtilityFunctions';
import Pagination from '../form_components/pagination/Pagination';
import jsUtils, { nullCheck } from '../../utils/jsUtility';
import DroppableWrapper from '../form_builder/dnd/droppable_wrapper/DroppableWrapper';
import DraggableWrapper from '../form_builder/dnd/draggable_wrapper/DraggableWrapper';
import { setTableCustomDragElement, setTableCustomDropElement } from '../../utils/formUtils';

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
    secondaryRowIndices,
    tableContainerClass,
    tableContainerStyle,
    auditedIndexs,
    isSystemDefinedUser,
    isAuditView,
    tableDataClassname,
    allRowUnqiueUUID,
    isFixedHeader,
    isRuleTable,
    isCreateDashboard,
    charLimit,
    headerDataClassname = null,
    isReassignPopper,
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
  const getRowData = (rowData, isHeader = false, wrapWithDraggable = false, isCreationView = false) => {
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
        return (wrapWithDraggable ?
          tdDraggableWrapper(idk, rowDataLength, dataItem) : (
            <td className={cx(paddingTd, (isCreationView && gClasses.CursorGrab))}>
              <div className={tableDataClassname}>{dataItem}</div>
            </td>
          )
        );
      }
      if (isHeader && dataItem) {
        if (isRuleTable) {
          return (
            <td>
                <div className={BS.D_FLEX} title={dataItem}>{dataItem}</div>
            </td>
          );
        } else {
          const arrHeader = chunkStringToArray(dataItem, charLimit || 20);
          const strHeader = getFirstStringWithExtraDotsByArray(arrHeader);
          return (
            <td>
                <div className={cx(BS.D_FLEX, headerDataClassname)} title={dataItem}>{strHeader}</div>
            </td>
          );
        }
      } else {
        let shortData = dataItem;
        if (typeof dataItem === 'string') {
          const arrRowData = chunkStringToArray(dataItem, 50);
          shortData = getFirstStringWithExtraDotsByArray(arrRowData);
        }
        return (
          <td className={paddingTd}>
            <div title={dataItem} className={tableDataClassname}>{shortData}</div>
          </td>
        );
      }
    });
  };
  const getContentRowData = (contentRowData) =>
    !jsUtils.isEmpty(contentRowData) && contentRowData.map((eachRow, index) => {
      let rowClass = null;
      let contentRowDataItem = eachRow;
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
      if ((enablePopper && !isDataLoading) || (isTestBed && !isDataLoading)) {
        let id = null;
        const isErrorRow = null;
        if (isDataListEntryTable) {
          id = contentRowDataItem[contentRowDataItem.length - 1];
          contentRowDataItem.splice(-1, 1);
        }
        const popupOptionClicked = (value) => {
          onPopupOptionClickHandler(value, id);
        };
        return (
          <TableRowWithPopper
              popperClassName={cx(gClasses.ZIndex5, styles.Popper)}
              popperPlacement={POPPER_PLACEMENTS.TOP}
              popperAllowedAutoPlacements={[
                isFixedHeader ? null : POPPER_PLACEMENTS.TOP,
                POPPER_PLACEMENTS.BOTTOM,
              ]}
              popperFixedStrategy
              popperShowTooltip
              rowData={getRowData(values(contentRowDataItem))}
              id={id}
              index={index}
              rowClassName={cx(rowClassName, errorClass, rowClass)}
              onRowClick={onRowClick}
              isDataListEntryTable
              isTestBed={isTestBed}
              isReassignPopper={isReassignPopper}
              isErrorRow={isErrorRow}
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
      let isErrorRow = null;
      let auditedColour;
      if (isRowClick && !isDataLoading) {
        if (isCreateDashboard) {
          instanceId = contentRowDataItem[contentRowDataItem.length - 2];
          isErrorRow = contentRowDataItem[contentRowDataItem.length - 1];
          contentRowDataItem.splice(contentRowDataItem.length - 2, 2);
        } else {
        instanceId = contentRowDataItem[contentRowDataItem.length - 1];
        contentRowDataItem.splice(-1, 1);
        }
      }
      if (isAuditView && !jsUtils.isNull(auditedIndexs)) {
        auditedIndexs.forEach((element) => {
          if (element.index === index) {
            switch (element.type) {
              case 'edit':
              {
                 auditedColour = styles.EditedCard;
                break;
              }
              case 'delete':
                {
                  auditedColour = styles.DeletedCard;
                break;
                }
              case 'add':
                {
                  auditedColour = styles.AddedCard;
                  break;
                }
                default:
                  break;
            }
          }
        });
      }
      const rowUniqueUUID = allRowUnqiueUUID && allRowUnqiueUUID[index] ? allRowUnqiueUUID[index] : `row_${index}`;
      const borderStyle = secondaryRowIndices.includes(index) ? { borderLeft: '2px solid #217CF5' } : {};
      return (
        <tr
          className={cx(rowClassName, errorClass, rowClass, userManagementRowClass, auditedColour && auditedColour, isErrorRow && styles.ErrorRow)}
          style={errorRowIndices.includes(index) ? { backgroundColor: '#fff0f0', ...borderStyle } : secondaryRowIndices.includes(index) ? { backgroundColor: '#f4f5f7', ...borderStyle } : { backgroundColor: '#ffffff' }}
          onClick={() => isRowClick && onRowClick(instanceId)}
          key={rowUniqueUUID}
          id={rowUniqueUUID}
        >
          {getRowData(values(contentRowDataItem), false, false, enableDragAndDrop)}
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
  return (
    <>
      <div
        className={cx(
          isFixedHeader ? null : BS.TABLE_RESPONSIVE,
          tableContainerClass,
          gClasses.ScrollBar,
          isCompletedForm && gClasses.MB10,
          !isCompletedForm && noOverflow,
          (tableError || createTableError) && (jsUtils.isEmpty(errorRowIndices)) && gClasses.ErrorInputBorder,
        )}
        onScroll={(event) => {
          if (tableRef) jsUtils.set(tableRef.current, [`${fieldListIndex}`], event.target.scrollLeft);
        }}
        ref={scrollRef}
        style={tableContainerStyle}
      >
        <ReactstrapTable
          id="tableId"
          fluid
          className={isSystemDefinedUser ? className :
          (cx(
            className,
            styles.Table,
            styles.TableDashboardBorder,
            {
              [styles.FixedFirstColumn]: fixFirstColumn,
            },
            !tableError && rowStyle,
          ))}
          role="table"
        >
          <thead className={cx(headerClassName, gClasses.PositionRelative, (isFixedHeader && !enablePopper) ? null : gClasses.ZIndex0, (isSystemDefinedUser) ? gClasses.ZIndex2 : null)}>
            {headerRow}
          </thead>
          <tbody className={cx(bodyClassName)}>{contentRow}</tbody>
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
  secondaryRowIndices: [],
  errorColumnIndex: [],
  allRowUnqiueUUID: [],
  isFixedHeader: false,
  isRuleTable: false,
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
  secondaryRowIndices: PropTypes.arrayOf(PropTypes.any),
  errorColumnIndex: PropTypes.arrayOf(PropTypes.any),
  allRowUnqiueUUID: PropTypes.arrayOf(PropTypes.any),
  isFixedHeader: PropTypes.bool,
  isRuleTable: PropTypes.bool,
};
export default Radium(Table);
