import BillingModule from 'containers/billing_module/BillingModule';
import { TEAM_TABS } from 'containers/team/teams.utils';
import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import FullPageLoader from '../assets/icons/FullPageLoader';
import * as ROUTE_CONSTANTS from '../urls/RouteConstants';
import AppListing from '../containers/application/app_listing/AppListing';
import AppBuilder from '../containers/application/app_builder/AppBuilder';
import { getDevRoutePath } from '../utils/UtilityFunctions';
import CreateEditLayout from '../containers/team/create_and_edit_team/create_edit_layout/CreateEditLayout';

const ReportList = React.lazy(() => import('../containers/report/report_list/ReportList'));
const ReportConfig = React.lazy(() => import('../containers/report/report_config/ReportConfig'));
const Report = React.lazy(() => import('../containers/report/Report'));
const ReportCreation = React.lazy(() => import('../containers/report/report_creation/ReportCreation'));

const CreateEditTask = React.lazy(() => import('../containers/task/task/Task'));
const Teams = React.lazy(() => import('../containers/team/team_listing/TeamsListing'));
const PageNotFound = React.lazy(() =>
  import('../containers/error_pages/PageNotFound'));
const UserSettings = React.lazy(() =>
  import('../containers/user_settings/UserSettings'));

// const DataListDashboard = React.lazy(() =>
//   import('../containers/application/app_components/dashboard/datalist/Datalist'),
// );

const ListDataList = React.lazy(() =>
  import('../containers/data_list/listDataList/ListDataList'));
const ListFlow = React.lazy(() =>
  import('../containers/flow/listFlow/ListFlow'));
const MyTasks = React.lazy(() =>
  import('../containers/landing_page/my_tasks/MyTasks'));
const LandingPage = React.lazy(() => import('../containers/landing_page/LandingPage'));
const BillingStatusCheck = React.lazy(() => import('containers/billing_module/billing_payment_success/PaymentSuccess'));
const Integration = React.lazy(() =>
  import('containers/integration/Integration'));
const MLModels = React.lazy(() =>
  import('../containers/ml_models/MLModels'));
const MLModelDetails = React.lazy(() =>
  import('../containers/ml_models/model_details/ModelDetails'),
);

const DataListLandingPage = React.lazy(() => import('../containers/data_lists/data_list_landing/DatalistLanding'));
const DatalistCreateEdit = React.lazy(() => import('../containers/data_lists/data_lists_create_or_edit/DatalistsCreateEdit'));
const FlowLanding = React.lazy(() => import('../containers/flows/flow_landing/FlowLanding'));
const FlowCreateOrEdit = React.lazy(() => import('../containers/flows/flow_create_or_edit/FlowCreateOrEdit'));

export const flowCreatorRoutes = (location, isBillingUser) => (
  <Switch>
    <Route
      path={[
        getDevRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.USERS_PARAMS_UUID_REPORT_ID),
        getDevRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.USERS_PARAMS_UUID_ACTION_TYPE),
        getDevRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.USERS_PARAMS_UUID_ACTION_ID),
        getDevRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.USERS_PARAMS_UUID),
      ]}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <DataListLandingPage />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.CREATE_DATA_LIST)}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <LandingPage />
        </Suspense>
      )}
    />

    {/* DL Edit / Landing Pages */}
    <Route
      path={[
        getDevRoutePath(
          ROUTE_CONSTANTS.DATA_LIST_SCREENS.DASHBOARD_PARAMS_UUID_REPORT_ID,
        ),
        getDevRoutePath(
          ROUTE_CONSTANTS.DATA_LIST_SCREENS.DASHBOARD_PARAMS_UUID_ACTION_TYPE,
        ),
        getDevRoutePath(
          ROUTE_CONSTANTS.DATA_LIST_SCREENS.DASHBOARD_PARAMS_UUID_ACTION_ID,
        ),
        getDevRoutePath(
          ROUTE_CONSTANTS.DATA_LIST_SCREENS.DASHBOARD_PARAMS_UUID,
        ),
      ]}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <DataListLandingPage />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.EDIT_DATA_LIST)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <DatalistCreateEdit />
        </Suspense>
      )}
    />

    {/* Flow Edit / Landing Pages */}
    <Route
      path={[
        getDevRoutePath(
          ROUTE_CONSTANTS.FLOW_SCREENS.TEXT_BED_PARAMS_UUID_REPORT_ID,
        ),
        getDevRoutePath(
          ROUTE_CONSTANTS.FLOW_SCREENS.TEXT_BED_PARAMS_UUID_ACTION_TYPE,
        ),
        getDevRoutePath(
          ROUTE_CONSTANTS.FLOW_SCREENS.TEXT_BED_PARAMS_UUID_ACTION_ID,
        ),
        getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.TEXT_BED_PARAMS_UUID),
        getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID_REPORT_ID),
        // getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID_ACTION_TYPE),
        // getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID_ACTION_ID),
        getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID_FLOW_TAB),
        getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID),
      ]}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <FlowLanding />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.EDIT_FLOW)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <FlowCreateOrEdit />
        </Suspense>
      )}
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
      path={getDevRoutePath(ROUTE_CONSTANTS.FLOW_CREATOR_HOME)}
      exact
      render={() => (<div />)}
    />

    {/* Application Route */}

    {/* Application Listing */}
    <Route
      path={[
        getDevRoutePath(ROUTE_CONSTANTS.APPLICATION_SCREENS.PUBLISHED_LIST),
        getDevRoutePath(ROUTE_CONSTANTS.APPLICATION_SCREENS.DRAFT_LIST),
      ]}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <AppListing />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.LIST_APPLICATION)}
      render={() => (
        <Redirect
          to={getDevRoutePath(ROUTE_CONSTANTS.APPLICATION_SCREENS.PUBLISHED_LIST)}
        />
      )}
    />

    {/* Create App */}
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.CREATE_APP)}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <AppBuilder />
        </Suspense>
      )}
    />

    {/* Edit App */}
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.APPLICATION_SCREENS.EDIT_APP)}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <AppBuilder />
        </Suspense>
      )}
    />

    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.TEAM_CREATE_TEAM)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <CreateEditLayout />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.TEAMS_EDIT_TEAM + ROUTE_CONSTANTS.MATCH_PARAMS_EDIT_TEAM)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <CreateEditLayout isEdit />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.TEAMS)}
      exact
      render={() => (
        <Redirect to={getDevRoutePath(`${ROUTE_CONSTANTS.TEAMS}/${TEAM_TABS.ORGANISATIONAL}`)} />
      )}
    />
    <Route
      path={[
        getDevRoutePath(ROUTE_CONSTANTS.TEAMS_SCREENS.PARAMS_TAB_ACTION_ID),
        getDevRoutePath(ROUTE_CONSTANTS.TEAMS_SCREENS.PARAMS_TAB),
        getDevRoutePath(ROUTE_CONSTANTS.TEAMS),
      ]}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <Teams />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.CREATE_FLOW)}
      exact
      render={() => (
        <Redirect to={{ pathname: getDevRoutePath(ROUTE_CONSTANTS.HOME), search: new URLSearchParams({ create: ROUTE_CONSTANTS.CREATE_SEARCH_PARAMS.FLOW }).toString() }} />
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
      path={getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_TAB)}
      // exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <ListFlow />
        </Suspense>
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
    {/* payment redirect route */}

    {/* Start Report */}
    <Route
      path={[
        getDevRoutePath(ROUTE_CONSTANTS.REPORT_SCREENS.LIST_PARAMS_REPORT_ACTION),
      ]}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <ReportList />
        </Suspense>
      )}
    />

    <Route
      path={[
        getDevRoutePath(ROUTE_CONSTANTS.REPORT_SCREENS.CONFIG_PARAMS_REPORT_ACTION),
        getDevRoutePath(ROUTE_CONSTANTS.REPORT_SCREENS.CONFIG_PARAMS_REPORT_CONFIG),
      ]}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <ReportConfig />
        </Suspense>
      )}
    />

    <Route
      path={[
        getDevRoutePath(ROUTE_CONSTANTS.REPORT_SCREENS.VIEW_PARAMS_REPORT_ID),
        getDevRoutePath(ROUTE_CONSTANTS.REPORT_SCREENS.VIEW_PARAMS_REPORT_INSTANCE_ID),
      ]}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <Report />
        </Suspense>
      )}
    />

    <Route
      path={[
        getDevRoutePath(ROUTE_CONSTANTS.REPORT_SCREENS.CREATE),
        getDevRoutePath(ROUTE_CONSTANTS.REPORT_SCREENS.CREATE_PARAMS_REPORT_SUB_ACTION),
        getDevRoutePath(ROUTE_CONSTANTS.REPORT_SCREENS.CREATE_PARAMS_REPORT_INSTANCE_ID),
        getDevRoutePath(ROUTE_CONSTANTS.REPORT_SCREENS.EDIT_PARAMS_REPORT_ID),
        getDevRoutePath(ROUTE_CONSTANTS.REPORT_SCREENS.EDIT_PARAMS_REPORT_SUB_ACTION),
        getDevRoutePath(ROUTE_CONSTANTS.REPORT_SCREENS.EDIT_PARAMS_REPORT_INSTANCE_ID),
      ]}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <ReportCreation />
        </Suspense>
      )}
    />
    {/* End Report */}
    <Route
      path={[
        getDevRoutePath(`${ROUTE_CONSTANTS.INTEGRATIONS}/:${ROUTE_CONSTANTS.MATCH_PARAMS.TAB}`),
        getDevRoutePath(`${ROUTE_CONSTANTS.INTEGRATIONS}/:${ROUTE_CONSTANTS.MATCH_PARAMS.TAB}/:${ROUTE_CONSTANTS.MATCH_PARAMS.UUID}`),
        getDevRoutePath(`${ROUTE_CONSTANTS.INTEGRATIONS}/:${ROUTE_CONSTANTS.MATCH_PARAMS.TAB}/:${ROUTE_CONSTANTS.MATCH_PARAMS.UUID}/:${ROUTE_CONSTANTS.MATCH_PARAMS.ACTION}`),
      ]}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <Integration />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.ML_MODELS)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <MLModels />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(`${ROUTE_CONSTANTS.ML_MODELS}/${ROUTE_CONSTANTS.ML_MODEL_DETAIL}/${ROUTE_CONSTANTS.MATCH_PARAMS_MODEL_CODE}`)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <MLModelDetails />
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

export default flowCreatorRoutes;
