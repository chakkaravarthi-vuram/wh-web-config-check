import React from 'react';
import { useTable, useSortBy } from 'react-table';
import InfiniteScroll from 'react-infinite-scroll-component';
import cx from 'classnames/bind';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { BS } from 'utils/UIConstants';
import Skeleton from 'react-loading-skeleton';
import gClasses from 'scss/Typography.module.scss';
import styles from './TableInfinite.module.scss';

function TableInfinite(props) {
  const {
    data,
    columns,
    hasMore,
    onLoadMoreCallHandler,
    loaderRowCount,
    tableClassName,
    headerClassName,
    scrollableId,
    isRowClick,
    onRowClick,
    hasHoverActionButon,
    tblIsDataLoading,
  } = props;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
  );

  return (
    <InfiniteScroll
      dataLength={rows.length}
      next={onLoadMoreCallHandler}
      hasMore={hasMore}
      scrollableTarget={scrollableId}
      loader={scrollableId && Array(loaderRowCount).fill(<div className={gClasses.PX30}><Skeleton /></div>)}
      className={styles.OverFlowInherit}
    >
      <table {...getTableProps()} className={cx(styles.Table, tableClassName)}>
        <thead className={headerClassName}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th className={gClasses.LabelStyle} {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {tblIsDataLoading ? <Skeleton width={100} /> : column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={BS.P_RELATIVE}
                tabIndex={isRowClick ? '0' : '-1'}
                role={isRowClick ? 'button' : 'presentation'}
                onClick={() => isRowClick && onRowClick(data[index]?.instanceId, data[index]?.dataListData)}
                onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && isRowClick && onRowClick(data[index]?.instanceId)}
              >
                {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{tblIsDataLoading ? <Skeleton /> : cell.render('Cell')}</td>
                  ))}
                {hasHoverActionButon && data[index]?.hoverAction}
              </tr>
            );
          })}
        </tbody>
      </table>
    </InfiniteScroll>
  );
}

export default TableInfinite;
