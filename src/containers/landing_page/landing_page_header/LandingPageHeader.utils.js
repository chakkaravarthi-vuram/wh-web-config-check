import { ADMIN_ACCOUNTS_INITIAL, CREATE_APP, EDIT_APP, FLOW_DASHBOARD, LIST_APPLICATION, LIST_FLOW, ML_MODELS, ADMIN_SETTINGS as ADMIN_DATA, ALL_USERS, DATALIST_USERS, TEAMS as TEAMS_ROUTE, LIST_DATA_LIST, TASKS as TASKS_ROUTE, INTEGRATIONS, USER_MANAGEMENT, USAGE_DASHBOARD_USAGE_SUMMARY, LIBRARY_MANAGEMENT, LANGUAGE_CALENDAR, OTHER_SETTINGS, NOTICE_BOARD_SETTINGS, ACCOUNT_SETTINGS, ADMIN_ACCOUNTS_ACCOUNTS, ADMIN_ACCOUNTS_SUMMARY, DATA_LIST_DASHBOARD, TASKS, OPEN_TASKS, COMPLETED_TASKS, ASSIGNED_TO_OTHERS_TASKS, SNOOZED_TASK, VIEW_REPORT, REPORT_LIST, PUBLISHED_REPORT_LIST, EXTERNAL_INTEGRATION, WORKHALL_INTEGRATION, EXTERNAL_DB_CONNECTION, DRAFT_TASK } from '../../../urls/RouteConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { getTabFromUrl, getTabFromUrlForBasicUserMode } from '../../../utils/taskContentUtils';
import { isBasicUserMode } from '../../../utils/UtilityFunctions';
import ADMIN_ACCOUNTS_STRINGS from '../../admin_panel/admin_pages/AdminPages.string';
import { VIEW_LABELS } from '../../integration/Integration.strings';
import { TEAM_TABS } from '../../team/teams.utils';
import { TASK_CONTENT_STRINGS, TASK_TAB_INDEX } from '../LandingPage.strings';
import { LANDING_PAGE_TOPICS } from '../main_header/common_header/CommonHeader.strings';
import { LANDING_PAGE_HEADER_CONSTANT } from './LandingPageHeader.string';

export const getSuperAdminTabIndexByHistory = (history) => {
    if (history) {
      if (
        history.location.pathname.includes(`/${ADMIN_ACCOUNTS_INITIAL}`) &&
        history.location.pathname.includes(`/${ADMIN_ACCOUNTS_ACCOUNTS}`)
      ) {
        return ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.TAB_INDEX;
      } else if (
        history.location.pathname.includes(`/${ADMIN_ACCOUNTS_INITIAL}`) &&
        history.location.pathname.includes(`/${ADMIN_ACCOUNTS_SUMMARY}`)
      ) {
        return ADMIN_ACCOUNTS_STRINGS.DASHBOARD.TAB_INDEX;
      }
    }
    return 0;
};

const getTaskRouteTitle = (history, t) => {
    const { location } = history;
    const taskListTabIndex = isBasicUserMode({ location }) ? getTabFromUrlForBasicUserMode(location.pathname) : getTabFromUrl(location.pathname);
    if (taskListTabIndex === TASK_TAB_INDEX.OPEN) {
        return {
            title: t(TASK_CONTENT_STRINGS.TASK_INFO.TASK_TYPE.MY_TASKS),
            route: `${TASKS}/${OPEN_TASKS}`,
        };
    } else if (taskListTabIndex === TASK_TAB_INDEX.COMPLETED) {
        return {
            title: t(TASK_CONTENT_STRINGS.TASK_INFO.TASK_TYPE.MY_COMPLETED_TASKS),
            route: `${TASKS}/${COMPLETED_TASKS}`,
        };
    } else if (taskListTabIndex === TASK_TAB_INDEX.ASSIGNED_TO_OTHERS) {
        return {
            title: t(TASK_CONTENT_STRINGS.TASK_INFO.TASK_TYPE.ASSIGNED_TO_OTHERS),
            route: `${TASKS}/${ASSIGNED_TO_OTHERS_TASKS}`,
        };
    } else if (taskListTabIndex === TASK_TAB_INDEX.SNOOZED_TASK) {
        return {
            title: t(TASK_CONTENT_STRINGS.TASK_INFO.TASK_TYPE.SNOOZED_TASKS),
            route: `${TASKS}/${SNOOZED_TASK}`,
        };
    }
    return {
        title: EMPTY_STRING,
        route: EMPTY_STRING,
    };
};

export const getIntegrationRouteAndName = (integrationTab) => {
    const defaultRoute = `${INTEGRATIONS}/${EXTERNAL_INTEGRATION}`;
    let navText = null;
    let navRoute = null;
    if (integrationTab === EXTERNAL_INTEGRATION) {
      navText = VIEW_LABELS.EXTERNAL_APIS;
      navRoute = defaultRoute;
    } else if (integrationTab === WORKHALL_INTEGRATION) {
      navText = VIEW_LABELS.WORKHALL_APIS;
      navRoute = `${INTEGRATIONS}/${WORKHALL_INTEGRATION}`;
    } else {
      navText = VIEW_LABELS.EXTERNAL_DB_CONNECTOR;
      navRoute = `${INTEGRATIONS}/${EXTERNAL_DB_CONNECTION}`;
    }
    return {
        navText,
        navRoute,
    };
};

export const getLandingPageHeaderData = (history, t, {
    teamsSelectedTab,
    integrationSelectedTab,
    taskSelectedTab,
    flowSelectedTab,
    datalistSelectedTab,
    adminSelectedTab,
    appSelectedTab,
}) => {
    const { HOME, APPS, TASKS, DATALISTS, FLOWS, TEAMS, ADMIN_SETTINGS, INTEGRATION, ML_MODEL, REPORTS, SUPER_ADMIN } = LANDING_PAGE_HEADER_CONSTANT(t);
    let headerDetails = {};
    if (history.location.pathname.includes(TASKS_ROUTE)) {
        headerDetails = TASKS;
        headerDetails.selectedTab = taskSelectedTab;
        if (history.location.pathname.split('/').length > 4 && !history.location.pathname.includes(DRAFT_TASK)) {
            headerDetails.hideSubHeader = true;
            const { title, route } = getTaskRouteTitle(history, t);
            headerDetails.previousRouteText = title;
            headerDetails.previousRoute = route;
        }
    } else if (history.location.pathname.includes(`/${ADMIN_ACCOUNTS_INITIAL}`)) {
        headerDetails = SUPER_ADMIN;
        headerDetails.selectedTab = getSuperAdminTabIndexByHistory(history);
    } else if (history.location.pathname.includes(LIST_DATA_LIST) || history.location.pathname.includes(DATA_LIST_DASHBOARD)) {
        headerDetails = DATALISTS;
        headerDetails.selectedTab = datalistSelectedTab;
        if (history.location.pathname.includes(DATA_LIST_DASHBOARD)) {
            headerDetails.hideSubHeader = true;
            if (history?.location?.state?.datalist_tab) {
                headerDetails.previousRouteText = DATALISTS.tabOptions[history.location.state.datalist_tab - 1].labelText;
                headerDetails.previousRoute = DATALISTS.tabOptions[history.location.state.datalist_tab - 1].route;
            } else {
                headerDetails.previousRouteText = DATALISTS.tabOptions[0].labelText;
                headerDetails.previousRoute = DATALISTS.tabOptions[0].route;
            }
        }
    } else if (history.location.pathname.includes(FLOW_DASHBOARD) || history.location.pathname.includes(LIST_FLOW)) {
        headerDetails = FLOWS;
        headerDetails.selectedTab = flowSelectedTab;
        if (history.location.pathname.includes(FLOW_DASHBOARD)) {
            headerDetails.hideSubHeader = true;
            if (history?.location?.state?.flow_tab) {
                headerDetails.previousRouteText = FLOWS.tabOptions[history.location.state.flow_tab - 1].labelText;
                headerDetails.previousRoute = FLOWS.tabOptions[history.location.state.flow_tab - 1].route;
            } else {
                headerDetails.previousRouteText = FLOWS.tabOptions[0].labelText;
                headerDetails.previousRoute = FLOWS.tabOptions[0].route;
            }
        }
    } else if (history.location.pathname.includes(TEAMS_ROUTE)) {
        headerDetails = TEAMS;
        headerDetails.selectedTab = teamsSelectedTab;
        if (!history.location.pathname.includes(TEAM_TABS.SYSTEM) && !history.location.pathname.includes(TEAM_TABS.ORGANISATIONAL)) {
            headerDetails.hideSubHeader = true;
            headerDetails.previousRouteText = true;
            headerDetails.previousRoute = true;
        }
    } else if (history.location.pathname.includes(DATALIST_USERS)) headerDetails = { title: t(LANDING_PAGE_TOPICS.USERS), hideSubHeader: true };
    else if (history.location.pathname.includes(ALL_USERS)) headerDetails = HOME;
    else if (history.location.pathname.includes(ADMIN_DATA)) {
        headerDetails = ADMIN_SETTINGS;
        headerDetails.selectedTab = adminSelectedTab;
    } else if (history.location.pathname.includes(ML_MODELS)) headerDetails = ML_MODEL;
    else if (history.location.pathname.includes(INTEGRATIONS)) {
        headerDetails = INTEGRATION;
        headerDetails.selectedTab = integrationSelectedTab;
        if (history.location.pathname.split('/').length > 4) {
            headerDetails.hideSubHeader = true;
            const selectedIntegration = history?.location?.pathname?.split('/')?.[3];
            const { navText, navRoute } = getIntegrationRouteAndName(selectedIntegration);
            headerDetails.previousRouteText = navText;
            headerDetails.previousRoute = navRoute;
        }
    } else if (history.location.pathname.includes('billing')) headerDetails = { title: t(LANDING_PAGE_TOPICS.USERS), hideSubHeader: true };
    else if (history.location.pathname.includes('report')) {
        headerDetails = REPORTS;
        if (history.location.pathname.includes(VIEW_REPORT)) {
            headerDetails.hideSubHeader = true;
            headerDetails.previousRouteText = 'Published Reports';
            headerDetails.previousRoute = `/${REPORT_LIST}/${PUBLISHED_REPORT_LIST}`;
        }
    } else if (history.location.pathname.includes(LIST_APPLICATION) || history.location.pathname.includes(EDIT_APP) || history.location.pathname.includes(CREATE_APP)) {
        headerDetails = APPS;
        headerDetails.selectedTab = appSelectedTab;
    } else headerDetails = HOME;

    return {
        headerDetails,
    };
};

export const getAdminSettingsUrl = (selectedCardTab) => {
    if (selectedCardTab === 2) return USER_MANAGEMENT;
    if (selectedCardTab === 3) return USAGE_DASHBOARD_USAGE_SUMMARY;
    if (selectedCardTab === 4) return LIBRARY_MANAGEMENT;
    if (selectedCardTab === 5) return LANGUAGE_CALENDAR;
    if (selectedCardTab === 6) return OTHER_SETTINGS;
    if (selectedCardTab === 7) return NOTICE_BOARD_SETTINGS;
    return ACCOUNT_SETTINGS;
  };
