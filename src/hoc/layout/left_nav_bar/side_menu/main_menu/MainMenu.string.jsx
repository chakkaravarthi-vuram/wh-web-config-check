import React from 'react';
import * as ROUTE_CONSTANTS from '../../../../../urls/RouteConstants';
import styles from '../../LeftNavBar.module.scss';
import { store } from '../../../../../Store';
import AppGridIcon from '../../../../../assets/icons/application/AppGridIcon';
import FlowStackIcon from '../../../../../assets/icons/apps/FlowStackIcon';
import DataListMenuIcon from '../../../../../assets/icons/menu/DatalistMenuIcon';
import TeamMenuIcon from '../../../../../assets/icons/menu/TeamsMenuIcon';
import BillingMenuIcon from '../../../../../assets/icons/menu/BillingMenuIcon';
import ReportsMenuIcon from '../../../../../assets/icons/menu/ReportsMenuIcon';
import IntegrationMenuIcon from '../../../../../assets/icons/menu/IntegrationMenu';
import AdminMenuIcon from '../../../../../assets/icons/menu/AdminMenuIcon';
import HomeIcon from '../../../../../assets/icons/menu/HomeIcon';
import UserMenuIcon from '../../../../../assets/icons/menu/UserMenuIcon';
import TaskMenuIcon from '../../../../../assets/icons/menu/TaskMenuIcon';
import SuperAdminMenuIcon from '../../../../../assets/icons/menu/SuperAdminMenu';
import HomeSelectedIcon from '../../../../../assets/icons/menu/selected_icon/HomeSelectedIcon';
import AppSelectedIcon from '../../../../../assets/icons/menu/selected_icon/AppSelectedIcon';
import TaskSelectedIcon from '../../../../../assets/icons/menu/selected_icon/TaskSelectedIcon';
import FlowSelctedIcon from '../../../../../assets/icons/menu/selected_icon/FlowSelectedIcon';
import DatalistSelectedIcon from '../../../../../assets/icons/menu/selected_icon/DatalistSelectedIcon';
import ReportSelectedIcon from '../../../../../assets/icons/menu/selected_icon/ReportSelectedIcon';
import TeamSelectedIcon from '../../../../../assets/icons/menu/selected_icon/TeamSelectedIcon';
import IntegrationSelectedIcon from '../../../../../assets/icons/menu/selected_icon/IntegrationSelectedIcon';
import UserSelectedIcon from '../../../../../assets/icons/menu/selected_icon/UserSelectedIcon';
import AdminSelectedIcon from '../../../../../assets/icons/menu/selected_icon/AdminSelectedIcon';
import SuperAdminSelectedIcon from '../../../../../assets/icons/menu/selected_icon/SuperAdminSelectedIcon';
import BillingSelectedIcon from '../../../../../assets/icons/menu/selected_icon/BillingSelectedIcon';
import MLModelIcon from '../../../../../assets/icons/side_bar/MLModelIcon';
import MLModelSelectedIcon from '../../../../../assets/icons/side_bar/MLModelSelectedIcon';

let { SIDE_NAV_BAR } = store.getState().LocalizationReducer.languageSettings.strings;

export const MAIN_MENU_COMMON_STRINGS = {
  NAVTOOLS: 'navtools',
  TRUE: 'true',
  PLACEMENT_LEFT: 'left',
  SUBSCRIPTION: 'subscription',
  ADMINISTRATION: 'side_nav_bar.administration',
  APP_BUILDING_BLOCK: 'side_nav_bar.app_building_blocks',
};

const getMenuNavData = (t, userPath) => {
  return {
    ADMIN: [
      {
        LABEL: '',
        MENU: [
          {
            LABEL: t(SIDE_NAV_BAR.HOME),
            ICON: <HomeIcon />,
            SELECTED_ICON: <HomeSelectedIcon className={styles.SelectedIcon} />,
            PATH: ROUTE_CONSTANTS.ADMIN_HOME,
            VALUE: 1,
          },
          {
            LABEL: t(SIDE_NAV_BAR.APPLICATIONS),
            ICON: <AppGridIcon />,
            SELECTED_ICON: <AppSelectedIcon className={styles.SelectedIcon} />,
            PATH: `${ROUTE_CONSTANTS.LIST_APPLICATION}${ROUTE_CONSTANTS.PUBLISHED_APP_LIST}`,
            VALUE: 12,
          },
        ],
      },
      {
        LABEL: t(MAIN_MENU_COMMON_STRINGS.APP_BUILDING_BLOCK),
        MENU: [
          {
            LABEL: t(SIDE_NAV_BAR.OPEN_TASK),
            ICON: <TaskMenuIcon />,
            SELECTED_ICON: <TaskSelectedIcon className={styles.SelectedIcon} />,
            PATH: `${ROUTE_CONSTANTS.TASKS}/${ROUTE_CONSTANTS.OPEN_TASKS}`,
            VALUE: 2,
          },
          {
            LABEL: t(SIDE_NAV_BAR.FLOW),
            ICON: <FlowStackIcon />,
            SELECTED_ICON: <FlowSelctedIcon className={styles.SelectedFLowIcon} />,
            PATH: ROUTE_CONSTANTS.LIST_FLOW + ROUTE_CONSTANTS.ALL_PUBLISHED_FLOWS,
            VALUE: 3,
          },
          {
            LABEL: t(SIDE_NAV_BAR.MY_DATA_LIST),
            ICON: <DataListMenuIcon />,
            SELECTED_ICON: <DatalistSelectedIcon className={styles.SelectedIcon} />,
            PATH: ROUTE_CONSTANTS.LIST_DATA_LIST + ROUTE_CONSTANTS.DATALIST_OVERVIEW,
            VALUE: 4,
          },
          {
            LABEL: t(SIDE_NAV_BAR.REPORTS),
            ICON: <ReportsMenuIcon />,
            SELECTED_ICON: <ReportSelectedIcon className={styles.SelectedIcon} />,
            PATH: `/${ROUTE_CONSTANTS.REPORT_LIST}/${ROUTE_CONSTANTS.PUBLISHED_REPORT_LIST}`,
            VALUE: 13,
          },
          {
            LABEL: t(SIDE_NAV_BAR.TEAMS),
            ICON: <TeamMenuIcon />,
            SELECTED_ICON: <TeamSelectedIcon className={styles.SelectedIcon} />,
            PATH: ROUTE_CONSTANTS.PUBLIC_TEAMS,
            VALUE: 6,
          },
          {
            LABEL: t(SIDE_NAV_BAR.INTEGRATION),
            ICON: <IntegrationMenuIcon />,
            SELECTED_ICON: <IntegrationSelectedIcon className={styles.SelectedIcon} />,
            PATH: `${ROUTE_CONSTANTS.INTEGRATIONS}/${ROUTE_CONSTANTS.EXTERNAL_INTEGRATION}`,
            VALUE: 8,
          },
          {
            LABEL: t(SIDE_NAV_BAR.ML_MODELS),
            ICON: <MLModelIcon className={styles.SelectedMlIcon} />,
            SELECTED_ICON: <MLModelSelectedIcon className={styles.SelectedIcon} />,
            PATH: `${ROUTE_CONSTANTS.ML_MODELS}`,
            VALUE: 14,
          },
        ],
      },
      {
        LABEL: t(MAIN_MENU_COMMON_STRINGS.ADMINISTRATION),
        MENU: [
          {
            LABEL: t(SIDE_NAV_BAR.PEOPLE),
            ICON: <UserMenuIcon />,
            SELECTED_ICON: <UserSelectedIcon className={styles.SelectedIcon} />,
            PATH: userPath,
            VALUE: 7,
          },
          {
            LABEL: t(SIDE_NAV_BAR.ADMIN_SETTINGS),
            ICON: <AdminMenuIcon />,
            SELECTED_ICON: <AdminSelectedIcon className={styles.SelectedIcon} />,
            PATH: `${ROUTE_CONSTANTS.ADMIN_SETTINGS}${ROUTE_CONSTANTS.ACCOUNT_SETTINGS}`,
            VALUE: 9,
          },
        ],
      },
    ],
    MEMBERS: [
      {
        LABEL: '',
        MENU: [
          {
            LABEL: t(SIDE_NAV_BAR.HOME),
            ICON: <HomeIcon />,
            SELECTED_ICON: <HomeSelectedIcon className={styles.SelectedIcon} />,
            PATH: ROUTE_CONSTANTS.ADMIN_HOME,
            VALUE: 1,
          },
        ],
      },
      {
        LABEL: t(MAIN_MENU_COMMON_STRINGS.APP_BUILDING_BLOCK),
        MENU: [
          {
            LABEL: t(SIDE_NAV_BAR.OPEN_TASK),
            ICON: <TaskMenuIcon />,
            SELECTED_ICON: <TaskSelectedIcon className={styles.SelectedIcon} />,
            PATH: `${ROUTE_CONSTANTS.TASKS}/${ROUTE_CONSTANTS.OPEN_TASKS}`,
            VALUE: 2,
          },
          {
            LABEL: t(SIDE_NAV_BAR.FLOW),
            ICON: <FlowStackIcon />,
            SELECTED_ICON: <FlowSelctedIcon className={styles.SelectedFLowIcon} />,
            PATH: ROUTE_CONSTANTS.LIST_FLOW + ROUTE_CONSTANTS.ALL_PUBLISHED_FLOWS,
            VALUE: 3,
          },
          {
            LABEL: t(SIDE_NAV_BAR.MY_DATA_LIST),
            ICON: <DataListMenuIcon />,
            SELECTED_ICON: <DatalistSelectedIcon className={styles.SelectedIcon} />,
            PATH: ROUTE_CONSTANTS.LIST_DATA_LIST + ROUTE_CONSTANTS.DATALIST_OVERVIEW,
            VALUE: 4,
          },
          {
            LABEL: t(SIDE_NAV_BAR.TEAMS),
            ICON: <TeamMenuIcon />,
            SELECTED_ICON: <TeamSelectedIcon className={styles.SelectedIcon} />,
            PATH: ROUTE_CONSTANTS.PUBLIC_TEAMS,
            VALUE: 6,
          },
        ],
      },
      {
        LABEL: t(MAIN_MENU_COMMON_STRINGS.ADMINISTRATION),
        MENU: [
          {
            LABEL: t(SIDE_NAV_BAR.PEOPLE),
            ICON: <UserMenuIcon />,
            SELECTED_ICON: <UserSelectedIcon className={styles.SelectedIcon} />,
            PATH: userPath,
            VALUE: 7,
          },
        ],
      },
    ],
    FLOW_CREATOR: [
      {
        LABEL: '',
        MENU: [
          {
            LABEL: t(SIDE_NAV_BAR.HOME),
            ICON: <HomeIcon />,
            SELECTED_ICON: <HomeSelectedIcon className={styles.SelectedIcon} />,
            PATH: ROUTE_CONSTANTS.ADMIN_HOME,
            VALUE: 1,
          },
          {
            LABEL: t(SIDE_NAV_BAR.APPLICATIONS),
            ICON: <AppGridIcon />,
            SELECTED_ICON: <AppSelectedIcon className={styles.SelectedIcon} />,
            PATH: `${ROUTE_CONSTANTS.LIST_APPLICATION}${ROUTE_CONSTANTS.PUBLISHED_APP_LIST}`,
            VALUE: 12,
          },
        ],
      },
      {
        LABEL: t(MAIN_MENU_COMMON_STRINGS.APP_BUILDING_BLOCK),
        MENU: [
          {
            LABEL: t(SIDE_NAV_BAR.OPEN_TASK),
            ICON: <TaskMenuIcon />,
            SELECTED_ICON: <TaskSelectedIcon className={styles.SelectedIcon} />,
            PATH: `${ROUTE_CONSTANTS.TASKS}/${ROUTE_CONSTANTS.OPEN_TASKS}`,
            VALUE: 2,
          },
          {
            LABEL: t(SIDE_NAV_BAR.FLOW),
            ICON: <FlowStackIcon />,
            SELECTED_ICON: <FlowSelctedIcon className={styles.SelectedFLowIcon} />,
            PATH: ROUTE_CONSTANTS.LIST_FLOW + ROUTE_CONSTANTS.ALL_PUBLISHED_FLOWS,
            VALUE: 3,
          },
          {
            LABEL: t(SIDE_NAV_BAR.MY_DATA_LIST),
            ICON: <DataListMenuIcon />,
            SELECTED_ICON: <DatalistSelectedIcon className={styles.SelectedIcon} />,
            PATH: ROUTE_CONSTANTS.LIST_DATA_LIST + ROUTE_CONSTANTS.DATALIST_OVERVIEW,
            VALUE: 4,
          },
          {
            LABEL: t(SIDE_NAV_BAR.REPORTS),
            ICON: <ReportsMenuIcon />,
            SELECTED_ICON: <ReportSelectedIcon className={styles.SelectedIcon} />,
            PATH: `/${ROUTE_CONSTANTS.REPORT_LIST}/${ROUTE_CONSTANTS.PUBLISHED_REPORT_LIST}`,
            VALUE: 13,
          },
          {
            LABEL: t(SIDE_NAV_BAR.TEAMS),
            ICON: <TeamMenuIcon />,
            SELECTED_ICON: <TeamSelectedIcon className={styles.SelectedIcon} />,
            PATH: ROUTE_CONSTANTS.PUBLIC_TEAMS,
            VALUE: 6,
          },
          {
            LABEL: t(SIDE_NAV_BAR.INTEGRATION),
            ICON: <IntegrationMenuIcon />,
            SELECTED_ICON: <IntegrationSelectedIcon className={styles.SelectedIcon} />,
            PATH: `${ROUTE_CONSTANTS.INTEGRATIONS}/${ROUTE_CONSTANTS.EXTERNAL_INTEGRATION}`,
            VALUE: 8,
          },
          {
            LABEL: t(SIDE_NAV_BAR.ML_MODELS),
            ICON: <MLModelIcon className={styles.SelectedMlIcon} />,
            SELECTED_ICON: <MLModelSelectedIcon className={styles.SelectedIcon} />,
            PATH: `${ROUTE_CONSTANTS.ML_MODELS}`,
            VALUE: 14,
          },
        ],
      },
      {
        LABEL: t(MAIN_MENU_COMMON_STRINGS.ADMINISTRATION),
         MENU: [
          {
            LABEL: t(SIDE_NAV_BAR.PEOPLE),
            ICON: <UserMenuIcon />,
            SELECTED_ICON: <UserSelectedIcon className={styles.SelectedIcon} />,
            PATH: userPath,
            VALUE: 7,
          },
        ],
      },
    ],
  };
};

const getSideNavBarStrings = () => {
  return { START: SIDE_NAV_BAR.START };
};

export const NAVBAR_MENU_LIST = (t, userPath) => getMenuNavData(t, userPath);

export const SIDE_NAV_BAR_STRINGS = getSideNavBarStrings();

const getSideNavBarNewStrings = () => SIDE_NAV_BAR;

export const SIDE_NAV_BAR_NEW_STRINGS = getSideNavBarNewStrings();
store.subscribe(() => {
  SIDE_NAV_BAR = store.getState().LocalizationReducer.languageSettings.strings.SIDE_NAV_BAR;
});

export const BILLING_NAV = (t) => {
  return {
  LABEL: t(SIDE_NAV_BAR.BILLING),
  ICON: <BillingMenuIcon className={styles.MenuIcon} />,
  SELECTED_ICON: <BillingSelectedIcon className={styles.SelectedIcon} />,
  PATH: ROUTE_CONSTANTS.BILLING,
  VALUE: 10,
  };
};

export const SUPER_ADMIN = (t) => {
  return {
    LABEL: t(SIDE_NAV_BAR.ADMIN_ACCOUNTS),
    ICON: <SuperAdminMenuIcon className={styles.MenuIcon} />,
    SELECTED_ICON: <SuperAdminSelectedIcon className={styles.SelectedIcon} />,
    PATH: ROUTE_CONSTANTS.ACCOUNT_DETAILS.ACCOUNT,
    VALUE: 11,
  };
};
