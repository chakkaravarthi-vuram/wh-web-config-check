import BillingModule from 'containers/billing_module/BillingModule';
import { TEAM_TABS } from 'containers/team/teams.utils';
import { get } from 'lodash';
import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import FullPageLoader from '../assets/icons/FullPageLoader';
import * as ROUTE_CONSTANTS from '../urls/RouteConstants';
import { getDevRoutePath } from '../utils/UtilityFunctions';

const CreateEditTask = React.lazy(() => import('../containers/task/task/Task'));
const Teams = React.lazy(() => import('../containers/team/team_listing/TeamsListing'));
const PageNotFound = React.lazy(() =>
  import('../containers/error_pages/PageNotFound'));
const UserSettings = React.lazy(() =>
  import('../containers/user_settings/UserSettings'));
const FlowDashboard = React.lazy(() =>
  import('../containers/application/app_components/dashboard/flow/Flow'),
);
const DataListDashboard = React.lazy(() =>
  import('../containers/application/app_components/dashboard/datalist/Datalist'),
);
const ListFlow = React.lazy(() =>
  import('../containers/flow/listFlow/ListFlow'));
const ListDataList = React.lazy(() =>
  import('../containers/data_list/listDataList/ListDataList'));
const MyTasks = React.lazy(() =>
  import('../containers/landing_page/my_tasks/MyTasks'));
const BillingStatusCheck = React.lazy(() =>
  import('containers/billing_module/billing_payment_success/PaymentSuccess'));

export const memberRoutes = (location, isBillingUser) => (
  <Switch>
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.MEMBER_HOME)}
      exact
      render={() => (<div />)}
    />
    <Route
      path={[
        getDevRoutePath(ROUTE_CONSTANTS.TASK_SCREENS.PARAMS_TAB_PID),
        getDevRoutePath(ROUTE_CONSTANTS.TASK_SCREENS.PARAMS_TAB),
      ]}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <MyTasks />
        </Suspense>
      )}
    />
    <Route
      path={
        getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_TAB)
      }
      // exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <ListFlow />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.CREATE_FLOW)}
      exact
      render={() => (
        <Redirect to={getDevRoutePath(ROUTE_CONSTANTS.HOME)} />
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.LIST_DATA_LIST)}
      // exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <ListDataList />
        </Suspense>
      )}
    />
    <Route
      path={[
        getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.TEXT_BED_PARAMS_UUID_REPORT_ID),
        getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.TEXT_BED_PARAMS_UUID_ACTION_TYPE),
        getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.TEXT_BED_PARAMS_UUID_ACTION_ID),
        getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.TEXT_BED_PARAMS_UUID),
        getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID_REPORT_ID),
        getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID_ACTION_TYPE),
        getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID_ACTION_ID),
        getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID),
      ]}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <FlowDashboard />
        </Suspense>
      )}
    />
    <Route
      path={[
        getDevRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.USERS_PARAMS_UUID_REPORT_ID),
        getDevRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.USERS_PARAMS_UUID_ACTION_TYPE),
        getDevRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.USERS_PARAMS_UUID_ACTION_ID),
        getDevRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.USERS_PARAMS_UUID),
      ]}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <DataListDashboard />
        </Suspense>
      )}
    />
    <Route
      path={[
        getDevRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.DASHBOARD_PARAMS_UUID_REPORT_ID),
        getDevRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.DASHBOARD_PARAMS_UUID_ACTION_TYPE),
        getDevRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.DASHBOARD_PARAMS_UUID_ACTION_ID),
        getDevRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.DASHBOARD_PARAMS_UUID),
      ]}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <DataListDashboard />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.TEAMS)}
      exact
      render={() => (
        <Redirect to={`${ROUTE_CONSTANTS.TEAMS}/${TEAM_TABS.ORGANISATIONAL}`} />
      )}
    />
    <Route
      path={[
        getDevRoutePath(ROUTE_CONSTANTS.TEAMS_SCREENS.PARAMS_TAB),
        getDevRoutePath(ROUTE_CONSTANTS.TEAMS),
      ]}
      render={({ match }) => {
        const tab = get(match, ['params', 'tab']);
        return (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            {([TEAM_TABS.CREATE, TEAM_TABS.EDIT].includes(tab)) ? <PageNotFound /> : <Teams />}
          </Suspense>
        );
      }}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.CREATE_EDIT_TASK)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <CreateEditTask />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.USER_SETTINGS)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <UserSettings />
        </Suspense>
      )}
    />
    {/* payment redirect route */}
    <Route
      path={getDevRoutePath(`${ROUTE_CONSTANTS.BILLING_STATUS}`)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <BillingStatusCheck />
        </Suspense>
      )}
    />
    {/* Billing Screen */}
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.BILLING)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          {isBillingUser ? <BillingModule /> : <PageNotFound />}
        </Suspense>
      )}
    />
    <Route
      path="*"
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <PageNotFound />
        </Suspense>
      )}
    />
  </Switch>
);
export default memberRoutes;
