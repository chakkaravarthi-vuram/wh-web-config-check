import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import jsUtils from 'utils/jsUtility';
import Line from 'components/chart_js/line/Line';
import HalfDoughnut from 'components/chart_js/halfDoughnut/HalfDoughnut';
import {
  adminAccountSummaryClear,
  adminAccountSummaryDataChange,
} from 'redux/reducer/AdminAccountsReducer';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from './AccountsSummary.module.scss';
import SummaryCard from './summary_card/SummaryCard';
import ADMIN_ACCOUNTS_SUMMARY_STRINGS, { chartColorPallet } from './AccountsSummary.strings';
import {
  getAdminAccountSummaryActionPerSessionApiThunk,
  getAdminAccountSummarySessionCountApiThunk,
  getAdminAccountSummaryActiveUserCountApiThunk,
  getAdminAccountSummaryRetentionRateApiThunk,
} from '../../../../redux/actions/AdminAccounts.Action';

function AccountsSummary(props) {
  const {
    adminAccountSummary,
    adminAccountSummary: {
      actionPerSession: {
        isActionPerSessionLoading,
        ddActionPerSessionGranularity,
        labelsActionPerSession,
        dataActionPerSession,
        startDateActionPerSession,
        endDateActionPerSession,
      },
      sessionCount: {
        isSessionCountLoading,
        ddSessionCountGranularity,
        labelsSessionCount,
        dataSessionCount,
        startDateSessionCount,
        endDateSessionCount,
      },
      activeUserCount: {
        isActiveUserCountLoading,
        ddActiveUserCountGranularity,
        labelsActiveUserCount,
        dataActiveUserCount,
        startDateActiveUserCount,
        endDateActiveUserCount,
      },
      retentionRate: {
        isRetentionRateLoading,
        labelsRetentionRate,
        dataRetentionRate,
      },
    },
    onAdminAccountSummaryDataChange,
    onGetAdminAccountSummaryActionPerSessionApiThunk,
    onGetAdminAccountSummarySessionCountApiThunk,
    onGetAdminAccountSummaryActiveUserCountApiThunk,
    onGetAdminAccountSummaryRetentionRateApiThunk,
    onAdminAccountSummaryClear,
  } = props;

  const defaultGranularityOptionValue =
    ADMIN_ACCOUNTS_SUMMARY_STRINGS.GRANULARITY.OPTION_LIST()[0].value;
  const param = {
    by: defaultGranularityOptionValue,
  };

  const { t } = useTranslation();

  useEffect(() => {
    onGetAdminAccountSummaryActionPerSessionApiThunk(param);
    onGetAdminAccountSummarySessionCountApiThunk(param);
    onGetAdminAccountSummaryActiveUserCountApiThunk(param);
    onGetAdminAccountSummaryRetentionRateApiThunk();
    return () => {
      onAdminAccountSummaryClear();
    };
  }, []);

  const ddOnChangeGranularity = (event) => {
    const { id, value } = event.target;
    if (value) {
      const clonedAdminAccountSummary = jsUtils.cloneDeep(adminAccountSummary);
      switch (id) {
        case ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTION_PER_SESSION.ID:
          {
            clonedAdminAccountSummary.actionPerSession.ddActionPerSessionGranularity =
              value;
            param.by = value;
            onAdminAccountSummaryDataChange(clonedAdminAccountSummary);
            onGetAdminAccountSummaryActionPerSessionApiThunk(param);
          }
          break;
        case ADMIN_ACCOUNTS_SUMMARY_STRINGS.SESSION_COUNT.ID:
          {
            clonedAdminAccountSummary.sessionCount.ddSessionCountGranularity =
              value;
            param.by = value;
            onAdminAccountSummaryDataChange(clonedAdminAccountSummary);
            onGetAdminAccountSummarySessionCountApiThunk(param);
          }
          break;
        case ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTIVE_USER_COUNT.ID:
          {
            clonedAdminAccountSummary.activeUserCount.ddActiveUserCountGranularity =
              value;
            param.by = value;
            onAdminAccountSummaryDataChange(clonedAdminAccountSummary);
            onGetAdminAccountSummaryActiveUserCountApiThunk(param);
          }
          break;
        default:
          break;
      }
    }
  };

  const onChangeDate = (selectedDate, isStartDate = true, id) => {
    if (selectedDate && id) {
      const clonedAdminAccountSummary = jsUtils.cloneDeep(adminAccountSummary);
      switch (id) {
        case ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTION_PER_SESSION.ID:
          {
            if (isStartDate) {
              clonedAdminAccountSummary.actionPerSession.startDateActionPerSession =
                selectedDate;
            } else {
              clonedAdminAccountSummary.actionPerSession.endDateActionPerSession =
                selectedDate;
            }
          }
          break;
        case ADMIN_ACCOUNTS_SUMMARY_STRINGS.SESSION_COUNT.ID:
          {
            if (isStartDate) {
              clonedAdminAccountSummary.sessionCount.startDateSessionCount =
                selectedDate;
            } else {
              clonedAdminAccountSummary.sessionCount.endDateSessionCount =
                selectedDate;
            }
          }
          break;
        case ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTIVE_USER_COUNT.ID:
          {
            if (isStartDate) {
              clonedAdminAccountSummary.activeUserCount.startDateActiveUserCount =
                selectedDate;
            } else {
              clonedAdminAccountSummary.activeUserCount.endDateActiveUserCount =
                selectedDate;
            }
          }
          break;
        default:
          break;
      }
      onAdminAccountSummaryDataChange(clonedAdminAccountSummary);
    }
  };
  const onClickCustom = (id) => {
    if (id) {
      switch (id) {
        case ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTION_PER_SESSION.ID:
          {
            if (startDateActionPerSession && endDateActionPerSession) {
              onGetAdminAccountSummaryActionPerSessionApiThunk({
                start_date: startDateActionPerSession,
                end_date: endDateActionPerSession,
              });
            }
          }
          break;
        case ADMIN_ACCOUNTS_SUMMARY_STRINGS.SESSION_COUNT.ID:
          {
            if (startDateSessionCount && endDateSessionCount) {
              onGetAdminAccountSummarySessionCountApiThunk({
                start_date: startDateSessionCount,
                end_date: endDateSessionCount,
              });
            }
          }
          break;
        case ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTIVE_USER_COUNT.ID:
          {
            if (startDateActiveUserCount && endDateActiveUserCount) {
              onGetAdminAccountSummaryActiveUserCountApiThunk({
                start_date: startDateActiveUserCount,
                end_date: endDateActiveUserCount,
              });
            }
          }
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className={styles.GlobalContainer}>
      <div
        className={cx(styles.Container, gClasses.DisplayFlex, gClasses.MB30)}
      >
        <div className={styles.CardMargin}>
          <SummaryCard
            title={t(ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTION_PER_SESSION.TITLE)}
            isLoading={isActionPerSessionLoading}
            isData={!jsUtils.isArrayObjectsEmpty(labelsActionPerSession)}
            ddIdGranularity={
              ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTION_PER_SESSION.ID
            }
            ddSelectedValueGranularity={ddActionPerSessionGranularity}
            ddOnChangeGranularity={(event) => ddOnChangeGranularity(event)}
            startDate={startDateActionPerSession}
            endDate={endDateActionPerSession}
            onChangeDate={(selectedDate, isStartDate) =>
              onChangeDate(
                selectedDate,
                isStartDate,
                ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTION_PER_SESSION.ID,
              )
            }
            onClickCustom={() =>
              onClickCustom(
                ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTION_PER_SESSION.ID,
              )
            }
          >
            <Line
              data={{
                labels: labelsActionPerSession,
                datasets: [
                  {
                    label: '',
                    data: dataActionPerSession,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                  },
                ],
              }}
            />
          </SummaryCard>
        </div>
        <div className={styles.CardMargin}>
          <SummaryCard
            title={t(ADMIN_ACCOUNTS_SUMMARY_STRINGS.SESSION_COUNT.TITLE)}
            isLoading={isSessionCountLoading}
            isData={!jsUtils.isArrayObjectsEmpty(labelsSessionCount)}
            ddIdGranularity={ADMIN_ACCOUNTS_SUMMARY_STRINGS.SESSION_COUNT.ID}
            ddSelectedValueGranularity={ddSessionCountGranularity}
            ddOnChangeGranularity={(event) => ddOnChangeGranularity(event)}
            startDate={startDateSessionCount}
            endDate={endDateSessionCount}
            onChangeDate={(selectedDate, isStartDate) =>
              onChangeDate(
                selectedDate,
                isStartDate,
                ADMIN_ACCOUNTS_SUMMARY_STRINGS.SESSION_COUNT.ID,
              )
            }
            onClickCustom={() =>
              onClickCustom(ADMIN_ACCOUNTS_SUMMARY_STRINGS.SESSION_COUNT.ID)
            }
          >
            <Line
              data={{
                labels: labelsSessionCount,
                datasets: [
                  {
                    label: '',
                    data: dataSessionCount,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                  },
                ],
              }}
            />
          </SummaryCard>
        </div>
      </div>
      <div
        className={cx(styles.Container, gClasses.DisplayFlex, gClasses.MB30)}
      >
        <div className={styles.CardMargin}>
          <SummaryCard
            title={t(ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTIVE_USER_COUNT.TITLE)}
            isLoading={isActiveUserCountLoading}
            isData={!jsUtils.isArrayObjectsEmpty(labelsActiveUserCount)}
            ddIdGranularity={
              ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTIVE_USER_COUNT.ID
            }
            ddSelectedValueGranularity={ddActiveUserCountGranularity}
            ddOnChangeGranularity={(event) => ddOnChangeGranularity(event)}
            startDate={startDateActiveUserCount}
            endDate={endDateActiveUserCount}
            onChangeDate={(selectedDate, isStartDate) =>
              onChangeDate(
                selectedDate,
                isStartDate,
                ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTIVE_USER_COUNT.ID,
              )
            }
            onClickCustom={() =>
              onClickCustom(ADMIN_ACCOUNTS_SUMMARY_STRINGS.ACTIVE_USER_COUNT.ID)
            }
          >
            <Line
              data={{
                labels: labelsActiveUserCount,
                datasets: [
                  {
                    label: '',
                    data: dataActiveUserCount,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                  },
                ],
              }}
            />
          </SummaryCard>
        </div>
        <div className={styles.CardMargin}>
          <SummaryCard
            title={t(ADMIN_ACCOUNTS_SUMMARY_STRINGS.RETENTION_RATE.TITLE)}
            isLoading={isRetentionRateLoading}
            isData={!jsUtils.isArrayObjectsEmpty(labelsRetentionRate)}
            hideRightDropDown
          >
            <HalfDoughnut
              className={gClasses.H85}
              data={{
                labels: labelsRetentionRate,
                datasets: [
                  {
                    label: '',
                    data: dataRetentionRate,
                    backgroundColor: chartColorPallet,
                  },
                ],
              }}
            />
          </SummaryCard>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    adminAccountSummary: state.AdminAccountsReducer.adminAccountSummary,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAdminAccountSummaryDataChange: (adminAccountSummary) => {
      dispatch(adminAccountSummaryDataChange(adminAccountSummary));
    },
    onAdminAccountSummaryClear: () => {
      dispatch(adminAccountSummaryClear());
    },
    onGetAdminAccountSummaryActionPerSessionApiThunk: (params) => {
      dispatch(getAdminAccountSummaryActionPerSessionApiThunk(params));
    },
    onGetAdminAccountSummarySessionCountApiThunk: (params) => {
      dispatch(getAdminAccountSummarySessionCountApiThunk(params));
    },
    onGetAdminAccountSummaryActiveUserCountApiThunk: (params) => {
      dispatch(getAdminAccountSummaryActiveUserCountApiThunk(params));
    },
    onGetAdminAccountSummaryRetentionRateApiThunk: () => {
      dispatch(getAdminAccountSummaryRetentionRateApiThunk());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountsSummary);
