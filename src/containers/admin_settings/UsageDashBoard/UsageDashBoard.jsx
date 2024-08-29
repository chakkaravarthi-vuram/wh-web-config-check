import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { BS } from 'utils/UIConstants';
import { useHistory } from 'react-router-dom';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../scss/Typography.module.scss';
import FlowMetrics from './flow_metrics/FlowMetrics';
import styles from './UsageDashBoard.module.scss';
import UsageSummary from './usage_summary/UsageSummary';
import UsersSummary from './users_summary/UsersSummary';
import {
  USAGE_DASHBOARD_USAGE_SUMMARY,
  USAGE_DASHBOARD_USERS_SUMMARY,
  USAGE_DASHBOARD_FLOW_METRICS,
  ADMIN_SETTINGS,
} from '../../../urls/RouteConstants';
import { USAGE_DASHBOARD } from '../user_management/UserManagement.strings';
import { routeNavigate } from '../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../utils/Constants';

function UsageDashBoard() {
  const { t } = useTranslation();
  let commonHeader = null;
  let current_component = null;
  const history = useHistory();
  const [tab_index, setTabIndex] = useState(1);

  const getUsageDashboardUrl = (selectedCardTab) => {
    if (selectedCardTab === 2) return USAGE_DASHBOARD_USERS_SUMMARY;
    if (selectedCardTab === 3) return USAGE_DASHBOARD_FLOW_METRICS;
    return USAGE_DASHBOARD_USAGE_SUMMARY;
  };

  const onNavClick = (e, navValue) => {
    e.preventDefault();
    setTabIndex(navValue);
    const usageDashboardPathName = `${ADMIN_SETTINGS}${getUsageDashboardUrl(navValue)}`;
    routeNavigate(history, ROUTE_METHOD.PUSH, usageDashboardPathName, null, null);
  };

  commonHeader = (
    <div>
      <p className={cx(styles.SubCommonHeaderTitle, gClasses.HeadingTitle2)}>
        {t(USAGE_DASHBOARD.TAB_TITLE)}
      </p>
      <div className={styles.SubHeaderTitle}>
        <span
          className={cx(
            tab_index === 1 ? cx(gClasses.FTwo13BlueV39, gClasses.FontWeight500) : gClasses.FTwo13GrayV3,
            gClasses.ClickableElement,
            gClasses.CursorPointer,
            BS.P_RELATIVE,
          )}
          onClick={(e) => onNavClick(e, 1)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) &&
            onNavClick(e, 1)}
        >
          {t(USAGE_DASHBOARD.USAGE_SUMMARY)}
          <div className={tab_index === 1 && styles.ActiveHeader} />
        </span>
        <span
          onClick={(e) => onNavClick(e, 2)}
          className={cx(
            tab_index === 2 ? cx(gClasses.FTwo13BlueV39, gClasses.FontWeight500) : gClasses.FTwo13GrayV3,
            gClasses.ML25,
            gClasses.MR25,
            gClasses.ClickableElement,
            gClasses.CursorPointer,
            BS.P_RELATIVE,
          )}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) &&
            onNavClick(e, 2)}
        >
          {t(USAGE_DASHBOARD.USERS_SUMMARY)}
          <div className={tab_index === 2 && styles.ActiveHeader} />
        </span>
        <span
          className={cx(
            tab_index === 3 ? cx(gClasses.FTwo13BlueV39, gClasses.FontWeight500) : gClasses.FTwo13GrayV3,
            gClasses.ClickableElement,
            gClasses.CursorPointer,
            BS.P_RELATIVE,
          )}
          onClick={(e) => onNavClick(e, 3)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) &&
            onNavClick(e, 3)}
        >
          {t(USAGE_DASHBOARD.FLOW_METRICS)}
          <div className={tab_index === 3 && styles.ActiveHeader} />
        </span>
      </div>
    </div>
  );

  const getUsageDashboardTabIndex = () => {
    const pathName = history.location.pathname;
    if (pathName === `${ADMIN_SETTINGS}${USAGE_DASHBOARD_USAGE_SUMMARY}`) return 1;
    if (pathName === `${ADMIN_SETTINGS}${USAGE_DASHBOARD_USERS_SUMMARY}`) return 2;
    if (pathName === `${ADMIN_SETTINGS}${USAGE_DASHBOARD_FLOW_METRICS}`) return 3;
    return 1;
  };

  useEffect(() => {
    setTabIndex(getUsageDashboardTabIndex());
  }, []);

  switch (tab_index) {
    case 1:
      current_component = <UsageSummary />;
      break;
    case 2:
      current_component = <UsersSummary />;
      break;
    case 3:
      current_component = <FlowMetrics />;
      break;
    default:
      break;
  }
  return (
    <div>
      {commonHeader}
      {current_component}
    </div>
  );
}

export default UsageDashBoard;
