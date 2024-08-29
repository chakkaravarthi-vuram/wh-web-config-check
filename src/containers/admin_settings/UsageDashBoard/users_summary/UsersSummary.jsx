import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { BS } from 'utils/UIConstants';
import { getUsersSummaryDataThunk } from 'redux/actions/UsageDashboard.Action';
import TablePagination from 'components/table_pagination/TablePagination';
import { USAGE_SUMMARY_TAB } from 'containers/admin_settings/user_management/UserManagement.strings';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from './UsersSummary.module.scss';
import {
    topActiveUsersHeaders,
    topDevelopersUserseHeaders,
  } from './UsersSummary.utils';

function UsersSummary(props) {
  const { isUsersSummaryLoading, usersSummaryData, getUsersSummaryData } = props;
  const { t } = useTranslation();
  console.log('isUsersSummaryLoading', usersSummaryData[0]);

  useEffect(() => {
    getUsersSummaryData({
      is_billing_cycle: 1,
    });
  }, []);

  const [activeUsers, topActiveUsers, topActiveDevelopers] = usersSummaryData;
  const usersThreshold = USAGE_SUMMARY_TAB.N_A;
  let topActiveUsersTableRowDatas = null;
  let topActiveDevelopersTableRowDatas = null;

  let topActiveUsersListTable = null;
  let topActiveDevelopersListTable = null;

  const topActiveUsersTableHeaders = topActiveUsersHeaders(t).HEADERS.map((val) => val);
  const topDevelopersTableHeaders = topDevelopersUserseHeaders(t).HEADERS.map((val) => val);

  topActiveDevelopersTableRowDatas =
  topActiveDevelopers &&
  topActiveDevelopers.map((value) => {
      const userNameDeveloper = (
        <div className={cx(BS.D_FLEX)}>
          <div className={cx(gClasses.Ellipsis, gClasses.Width150)} title={value.full_name}>
            {value.full_name}
          </div>
        </div>
      );
      const emailDeveloper = (
        <div className={cx(BS.D_FLEX)}>
          <div className={cx(gClasses.Ellipsis, gClasses.Width200)} title={value.email}>
            {value.email}
          </div>
        </div>
      );
      return [userNameDeveloper, emailDeveloper];
  });

  topActiveUsersTableRowDatas =
  topActiveUsers &&
  topActiveUsers.map((value) => {
    const userName = (
      <div className={cx(BS.D_FLEX)}>
        <div className={cx(gClasses.Ellipsis, gClasses.Width150)} title={value.full_name}>
          {value.full_name}
        </div>
      </div>
    );
    const email = (
      <div className={cx(BS.D_FLEX)}>
        <div className={cx(gClasses.Ellipsis, gClasses.Width200)} title={value.email}>
          {value.email}
        </div>
      </div>
    );
    return [userName, email];
  });

  topActiveUsersListTable = (
    <div>
      <div>
        <TablePagination
          tblClassName={cx(styles.Table)}
          tblRowClassName={styles.RowContainer}
          headerClassName={styles.HeaderContainer}
          bodyClassName={styles.TableBodyContainer}
          tblHeader={topActiveUsersTableHeaders}
          tblData={topActiveUsersTableRowDatas}
          tblIsDataLoading={isUsersSummaryLoading}
          tblLoaderRowCount={10}
          tblLoaderColCount={3}
          showItemDisplayInfoStrictly
          hidePagination
        />
      </div>
    </div>
  );

  topActiveDevelopersListTable = (
    <div>
      <div>
        <TablePagination
          tblClassName={cx(styles.Table)}
          tblRowClassName={styles.RowContainer}
          headerClassName={styles.HeaderContainer}
          bodyClassName={styles.TableBodyContainer}
          tblHeader={topDevelopersTableHeaders}
          tblData={topActiveDevelopersTableRowDatas}
          tblIsDataLoading={isUsersSummaryLoading}
          tblLoaderRowCount={10}
          tblLoaderColCount={3}
          showItemDisplayInfoStrictly
          hidePagination
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className={cx(styles.UsersSummaryContainer)}>
        <div>
          <div className={styles.CountUserSummary}>{t(usersThreshold)}</div>
          <div className={styles.TotalString}>{t(USAGE_SUMMARY_TAB.THRESHOLD_LIMIT)}</div>
        </div>
        <div className={styles.UsersSummaryMargin} />
        <div>
        {/* {activeUsers} */}
          <div className={styles.TotalCount}>{activeUsers}</div>
          <div className={styles.TotalString}>
          {t(USAGE_SUMMARY_TAB.ACTIVE_USERS_BILL)}
          </div>
        </div>
      </div>
      {/* <div> hello </div> */}
      <div className={cx(styles.UserTablesContainer, gClasses.M30)}>
      <div className={cx(styles.TopActiveUsers)}>
        <div className={gClasses.FontWeight500}>{t(USAGE_SUMMARY_TAB.ACTIVE_USERS)}</div>
        <div>{topActiveUsersListTable}</div>
      </div>
      <div className={cx(styles.TopActiveUsers)}>
        <div className={gClasses.FontWeight500}>{t(USAGE_SUMMARY_TAB.ACTIVE_DEVELOPERS)}</div>
        <div>{topActiveDevelopersListTable}</div>
      </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isUsersSummaryLoading: state.UsageDashboardReducer.isUsersSummaryLoading,
    usersSummaryData: state.UsageDashboardReducer.usersSummaryData,
    common_server_error_users_summary:
      state.UsageDashboardReducer.common_server_error_users_summary,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUsersSummaryData: (params) => {
      dispatch(getUsersSummaryDataThunk(params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersSummary);
