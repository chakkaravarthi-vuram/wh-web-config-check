import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { getUsageSummaryDataThunk } from 'redux/actions/UsageDashboard.Action';
import { USAGE_SUMMARY_TAB } from 'containers/admin_settings/user_management/UserManagement.strings';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from './UsageSummary.module.scss';

function UsageSummary(props) {
    const { getUsageSummaryData, usageSummaryData } =
    props;
    const { t } = useTranslation();
    useEffect(() => {
        getUsageSummaryData();
      }, []);

      const [flowCount, flowCountCurrentBilling, datalistCount, datalistCountCurrentBilling, adhocTaskCount, adhocTaskCountCurrentBilling] = usageSummaryData;

  return (
    <div className={cx(styles.Container, gClasses.M30)}>
      <div className={cx(styles.Card, gClasses.PL30)}>
        <div className={styles.CardTitle}>{t(USAGE_SUMMARY_TAB.HEADING)}</div>
        <span className={styles.TotalCount}>{flowCount || flowCount === 0 ? flowCount : t(USAGE_SUMMARY_TAB.N_A)}</span>
        <div className={styles.TotalString}>{t(USAGE_SUMMARY_TAB.TITLE)}</div>
        <div className={cx(styles.TotalCount, gClasses.MT10)}>{flowCountCurrentBilling || flowCountCurrentBilling === 0 ? flowCountCurrentBilling : 'N/A'}</div>
        <div className={cx(styles.TotalString, gClasses.MB30)}>
          {t(USAGE_SUMMARY_TAB.SUB_TITLE)}
        </div>
      </div>
      <div className={cx(styles.Card, gClasses.PL30)}>
        <div className={styles.CardTitle}>{t(USAGE_SUMMARY_TAB.DATA_LIST_HEADING)}</div>
        <span className={styles.TotalCount}>{datalistCount || datalistCount === 0 ? datalistCount : t(USAGE_SUMMARY_TAB.N_A)}</span>
        <div className={styles.TotalString}>{t(USAGE_SUMMARY_TAB.DATA_LIST_TITLE)}</div>
        <div className={cx(styles.TotalCount, gClasses.MT10)}>{datalistCountCurrentBilling || datalistCountCurrentBilling === 0 ? datalistCountCurrentBilling : 'N/A'}</div>
        <div className={cx(styles.TotalString, gClasses.MB30)}>
        {t(USAGE_SUMMARY_TAB.DATA_LIST_SUB_TITLE)}
        </div>
      </div>
      <div className={cx(styles.Card, gClasses.PL30)}>
        <div className={styles.CardTitle}>{t(USAGE_SUMMARY_TAB.ADHOC_TASK_HEADING)}</div>
        <span className={styles.TotalCount}>{adhocTaskCount || adhocTaskCount === 0 ? adhocTaskCount : t(USAGE_SUMMARY_TAB.N_A)}</span>
        <div className={styles.TotalString}>{t(USAGE_SUMMARY_TAB.ADHOC_TASK_TITLE)}</div>
        <div className={cx(styles.TotalCount, gClasses.MT10)}>{adhocTaskCountCurrentBilling || adhocTaskCountCurrentBilling === 0 ? adhocTaskCountCurrentBilling : 'N/A'}</div>
        <div className={cx(styles.TotalString, gClasses.MB30)}>
        {t(USAGE_SUMMARY_TAB.ADHOC_TASK_SUB_TITLE)}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
    return {
        isUsageSummaryLoading: state.UsageDashboardReducer.isUsageSummaryLoading,
        usageSummaryData: state.UsageDashboardReducer.usageSummaryData,
        common_server_error: state.UsageDashboardReducer.common_server_error,
    };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
        getUsageSummaryData: (params) => {
        dispatch(getUsageSummaryDataThunk(params));
      },
    };
  };

  export default connect(mapStateToProps, mapDispatchToProps)(UsageSummary);
