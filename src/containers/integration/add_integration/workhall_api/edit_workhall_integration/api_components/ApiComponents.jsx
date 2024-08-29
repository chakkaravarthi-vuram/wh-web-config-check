import React from 'react';
import { Table } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import styles from './ApiComponents.module.scss';

function TableComponent({ headers, tblData, className }) {
  const tableBodyData = [];

   (tblData || []).forEach((eachData, index) => {
    const key = (
      <div className={cx(styles.TableColumn, gClasses.Ellipsis)}>
        {eachData.key}
      </div>
    );
    const value = (
      <div className={cx(styles.TableColumn, gClasses.Ellipsis)}>
        {eachData.value}
      </div>
    );
    tableBodyData.push({
      id: index,
      component: [key, value],
    });
   });
  return (
    <Table
      header={headers}
      data={tableBodyData}
      className={cx(className, styles.HeadersTable)}
    />
  );
}

export default TableComponent;
