import React, { useState, useEffect } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import {
  getFlowListDataThunk,
  getTaskFlowListDataThunk,
  getUserTaskListDataThunk,
} from 'redux/actions/UsageDashboard.Action';
import TablePagination from 'components/table_pagination/TablePagination';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import FormTitle from 'components/form_components/form_title/FormTitle';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import styles from './FlowMetrics.module.scss';
import {
  flowHeaders,
  taskFlowHeaders,
  userTaskHeaders,
  FLOW_METRICS,
  DROPDOWN_ID,
  INITIAL_STATE,
  DROPDOWN_OPTIONS,
} from './FlowMetrics.utils';

function FlowMetrics(props) {
  const {
    getFlowListData,
    isFlowListLoading,
    flowListData,
    getTaskFlowListDataThunk,
    isTaskFlowListLoading,
    taskFlowListData,
    getUserTaskListDataThunk,
    isUserTaskListLoading,
    userTaskListData,
  } = props;
  let flowListTable = null;
  let taskFlowListTable = null;
  let userTaskListTable = null;

  let flowTableRowDatas = null;
  let taskFlowTableRowDatas = null;
  let userTaskTableRowDatas = null;

  const flowTableHeaders = flowHeaders.map((val) => val);
  const taskflowTableHeaders = taskFlowHeaders.map((val) => val);
  const userTaskTableHeaders = userTaskHeaders.map((val) => val);

  const [isBillingCycle, setIsBillingCycle] = useState(INITIAL_STATE);

  useEffect(() => {
    getFlowListData({
      is_billing_cycle: isBillingCycle[DROPDOWN_ID.MOST_FLOW],
    });
  }, [isBillingCycle[DROPDOWN_ID.MOST_FLOW]]);

  useEffect(() => {
    getTaskFlowListDataThunk({
      is_billing_cycle: isBillingCycle[DROPDOWN_ID.TASK_FLOW],
    });
  }, [isBillingCycle[DROPDOWN_ID.TASK_FLOW]]);

  useEffect(() => {
    getUserTaskListDataThunk({
      is_billing_cycle: isBillingCycle[DROPDOWN_ID.USER_TASK],
    });
  }, [isBillingCycle[DROPDOWN_ID.USER_TASK]]);

  const handleOnChange = (event) => {
    setIsBillingCycle({
      ...isBillingCycle,
      [event.target.id]: event.target.value,
    });
  };

  flowTableRowDatas =
    flowListData &&
    flowListData.map((value) => {
      const flowName = (
        <div className={cx(BS.D_FLEX)}>
          <div className={cx(gClasses.Ellipsis)} title={value.flow_name}>
            {value.flow_name}
          </div>
        </div>
      );
      const completedList = (
        <div className={cx(BS.D_FLEX)}>
          <div className={cx(gClasses.Ellipsis)} title={value.completed_count}>
            {value.completed_count}
          </div>
        </div>
      );
      const openList = (
        <div className={cx(BS.D_FLEX)}>
          <div className={cx(gClasses.Ellipsis)} title={value.inprogress_count}>
            {value.inprogress_count}
          </div>
        </div>
      );
      return [flowName, completedList, openList];
    });

  taskFlowTableRowDatas =
    taskFlowListData &&
    taskFlowListData.map((value) => {
      const taskName = (
        <div className={cx(BS.D_FLEX)}>
          <div className={cx(gClasses.Ellipsis)} title={value.task_name}>
            {value.task_name}
          </div>
        </div>
      );
      const flowName = (
        <div className={cx(BS.D_FLEX)}>
          <div className={cx(gClasses.Ellipsis)} title={value.flow_name}>
            {value.flow_name}
          </div>
        </div>
      );
      const count = (
        <div className={cx(BS.D_FLEX)}>
          <div className={cx(gClasses.Ellipsis)} title={value.count}>
            {value.count}
          </div>
        </div>
      );
      return [taskName, flowName, count];
    });

  userTaskTableRowDatas =
    userTaskListData &&
    userTaskListData.map((value) => {
      const userName = (
        <div className={cx(BS.D_FLEX)}>
          <div className={cx(gClasses.Ellipsis)} title={value.username}>
            {value.username}
          </div>
        </div>
      );
      const taskName = (
        <div className={cx(BS.D_FLEX)}>
          <div className={cx(gClasses.Ellipsis)} title={value.task_name}>
            {value.task_name}
          </div>
        </div>
      );
      const flowName = (
        <div className={cx(BS.D_FLEX)}>
          <div className={cx(gClasses.Ellipsis)} title={value.flow_name}>
            {value.flow_name}
          </div>
        </div>
      );
      const count = (
        <div className={cx(BS.D_FLEX)}>
          <div className={cx(gClasses.Ellipsis)} title={value.count}>
            {value.count}
          </div>
        </div>
      );
      return [userName, taskName, flowName, count];
    });

  flowListTable = (
    <div>
      <div className={cx(gClasses.MT10)}>
        <TablePagination
          tblClassName={cx(styles.Table)}
          tblRowClassName={styles.RowContainer}
          headerClassName={styles.HeaderContainer}
          bodyClassName={styles.TableBodyContainer}
          tblHeader={flowTableHeaders}
          tblData={flowTableRowDatas}
          tblIsDataLoading={isFlowListLoading}
          tblLoaderRowCount={5}
          tblLoaderColCount={3}
          showItemDisplayInfoStrictly
          hidePagination
        />
      </div>
    </div>
  );

  taskFlowListTable = (
    <div>
      <div className={cx(gClasses.MT10)}>
        <TablePagination
          tblClassName={cx(styles.Table)}
          tblRowClassName={styles.RowContainer}
          headerClassName={styles.HeaderContainer}
          bodyClassName={styles.TableBodyContainer}
          tblHeader={taskflowTableHeaders}
          tblData={taskFlowTableRowDatas}
          tblIsDataLoading={isTaskFlowListLoading}
          tblLoaderRowCount={5}
          tblLoaderColCount={3}
          showItemDisplayInfoStrictly
          hidePagination
        />
      </div>
    </div>
  );

  userTaskListTable = (
    <div>
      <div className={cx(gClasses.MT10)}>
        <TablePagination
          tblClassName={cx(styles.Table)}
          tblRowClassName={styles.RowContainer}
          headerClassName={styles.HeaderContainer}
          bodyClassName={styles.TableBodyContainer}
          tblHeader={userTaskTableHeaders}
          tblData={userTaskTableRowDatas}
          tblIsDataLoading={isUserTaskListLoading}
          tblLoaderRowCount={5}
          tblLoaderColCount={3}
          showItemDisplayInfoStrictly
          hidePagination
        />
      </div>
    </div>
  );

  return (
    <div className={styles.FlowMetricsContainer}>
      <div className={styles.MostFlowContainer}>
        <div className={styles.TableHeaderDiv}>
          <FormTitle
            isDataLoading={isFlowListLoading}
            noBottomMargin
            noTopPadding
          >
            {FLOW_METRICS.MOST_USED_FLOW}
          </FormTitle>
          <Dropdown
            dropdownListClasses={styles.DropdownList}
            innerClassName={styles.DropdownContainer}
            id={DROPDOWN_ID.MOST_FLOW}
            optionList={DROPDOWN_OPTIONS}
            onChange={handleOnChange}
            selectedValue={isBillingCycle[DROPDOWN_ID.MOST_FLOW]}
            hideLabel
            hideMessage
          />
        </div>
        <div>{flowListTable}</div>
      </div>
      <div className={styles.MostFlowContainer}>
        <div className={styles.TableHeaderDiv}>
          <FormTitle
            isDataLoading={isTaskFlowListLoading}
            noBottomMargin
            noTopPadding
          >
            {FLOW_METRICS.OPEN_TASK_FLOW}
          </FormTitle>
          <Dropdown
            dropdownListClasses={styles.DropdownList}
            innerClassName={styles.DropdownContainer}
            id={DROPDOWN_ID.TASK_FLOW}
            optionList={DROPDOWN_OPTIONS}
            onChange={handleOnChange}
            selectedValue={isBillingCycle[DROPDOWN_ID.TASK_FLOW]}
            hideLabel
            hideMessage
          />
        </div>
        <div>{taskFlowListTable}</div>
      </div>
      <div className={cx(styles.MostFlowContainer)}>
        <div className={styles.TableHeaderDiv}>
          <FormTitle
            isDataLoading={isUserTaskListLoading}
            noBottomMargin
            noTopPadding
          >
             {FLOW_METRICS.OPEN_TASK_USER}
          </FormTitle>
          <Dropdown
            dropdownListClasses={styles.DropdownList}
            innerClassName={styles.DropdownContainer}
            id={DROPDOWN_ID.USER_TASK}
            optionList={DROPDOWN_OPTIONS}
            onChange={handleOnChange}
            selectedValue={isBillingCycle[DROPDOWN_ID.USER_TASK]}
            hideLabel
            hideMessage
          />
        </div>
        <div>{userTaskListTable}</div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isFlowListLoading: state.UsageDashboardReducer.isFlowListLoading,
    flowListData: state.UsageDashboardReducer.flowListData,
    common_server_error_flow_list:
      state.UsageDashboardReducer.common_server_error_flow_list,
    isTaskFlowListLoading:
      state.UsageDashboardReducer.isTaskFlowListLoading,
    taskFlowListData: state.UsageDashboardReducer.taskFlowListData,
    common_server_error_task_flow:
      state.UsageDashboardReducer.common_server_error_task_flow,
    isUserTaskListLoading: state.UsageDashboardReducer.isUserTaskListLoading,
    userTaskListData: state.UsageDashboardReducer.userTaskListData,
    common_server_error_user_task:
      state.UsageDashboardReducer.common_server_error_user_task,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getFlowListData: (params) => {
      dispatch(getFlowListDataThunk(params));
    },
    getTaskFlowListDataThunk: (params) => {
      dispatch(getTaskFlowListDataThunk(params));
    },
    getUserTaskListDataThunk: (params) => {
      dispatch(getUserTaskListDataThunk(params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FlowMetrics);
