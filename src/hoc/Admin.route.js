import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { TEAM_TABS } from 'containers/team/teams.utils';
import { WORKHALL_ADMIN_SUB_DOMAIN } from 'utils/Constants';
import { getSubDomainName } from 'utils/jsUtility';

import FullPageLoader from '../assets/icons/FullPageLoader';

import * as ROUTE_CONSTANTS from '../urls/RouteConstants';
import AppBuilder from '../containers/application/app_builder/AppBuilder';
import { getDevRoutePath } from '../utils/UtilityFunctions';
import CreateEditLayout from '../containers/team/create_and_edit_team/create_edit_layout/CreateEditLayout';
import DatalistsCreateEdit from '../containers/data_lists/data_lists_create_or_edit/DatalistsCreateEdit';

const ReportList = React.lazy(() =>
  import('../containers/report/report_list/ReportList'),
);
const ReportConfig = React.lazy(() =>
  import('../containers/report/report_config/ReportConfig'),
);
const Report = React.lazy(() => import('../containers/report/Report'));
const ReportCreation = React.lazy(() =>
  import('../containers/report/report_creation/ReportCreation'),
);

const AdminSettings = React.lazy(() =>
  import('../containers/admin_settings/AdminSettings'),
);
const Teams = React.lazy(() =>
  import('../containers/team/team_listing/TeamsListing'),
);
const ListFlow = React.lazy(() =>
  import('../containers/flow/listFlow/ListFlow'),
);
const PageNotFound = React.lazy(() =>
  import('../containers/error_pages/PageNotFound'),
);
const ChecklistWorkflowPolicy = React.lazy(() =>
  import('../containers/checklist_workflow_policy/ChecklistWorkflowPolicy'),
);
const CreateMember = React.lazy(() =>
  import('../containers/create_member/CreateMember'),
);
// const FlowDashboard = React.lazy(() =>
//   import('../containers/application/app_components/dashboard/flow/Flow'),
// );
const FlowLanding = React.lazy(() =>
  import('../containers/flows/flow_landing/FlowLanding'),
);
const FlowCreateOrEdit = React.lazy(() =>
  import('../containers/flows/flow_create_or_edit/FlowCreateOrEdit'),
);
// const DataListDashboard = React.lazy(() =>
//   import(
//     '../containers/application/app_components/dashboard/datalist/Datalist'
//   ),
// );
const DataListLandingPage = React.lazy(() =>
  import('../containers/data_lists/data_list_landing/DatalistLanding'),
);
// const CreateDataList = React.lazy(() =>
//   import('../containers/flow/create_data_list/CreateDataList'),
// );
const ListDataList = React.lazy(() =>
  import('../containers/data_list/listDataList/ListDataList'),
);
const MyTasks = React.lazy(() =>
  import('../containers/landing_page/my_tasks/MyTasks'),
);
const AppListing = React.lazy(() =>
  import('../containers/application/app_listing/AppListing'),
);
const LandingPage = React.lazy(() =>
  import('../containers/landing_page/LandingPage'),
);
const BillingModule = React.lazy(() =>
  import('containers/billing_module/BillingModule'),
);
const BillingStatusCheck = React.lazy(() =>
  import('containers/billing_module/billing_payment_success/PaymentSuccess'),
);
const AdminPanel = React.lazy(() =>
  import('containers/admin_panel/AdminPanel'),
);
const Integration = React.lazy(() =>
  import('containers/integration/Integration'),
);
const MLModels = React.lazy(() =>
  import('../containers/ml_models/MLModels'),
);

const MLModelDetails = React.lazy(() =>
  import('../containers/ml_models/model_details/ModelDetails'),
);
export const adminRoutes = (location, isBillingUser, adminProfile) => (
  <Switch>
    {/* Home Screen */}
    <Route path={getDevRoutePath(ROUTE_CONSTANTS.ADMIN_HOME)} exact render={() => <div />} />
    {/* Settings Screens */}
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.ADMIN_SETTINGS)}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <AdminSettings />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.CREATE_MEMBERS)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <CreateMember />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.USER_SETTINGS)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <LandingPage />
        </Suspense>
      )}
    />
    {/* Task Screens */}
    {/* <Route
      path={ROUTE_CONSTANTS.CREATE_EDIT_TASK}
      exact
      render={() => (
        <Redirect to={`?create=task`} />
      )}
    />
    <Route
      path={`${ROUTE_CONSTANTS.TASKS}${ROUTE_CONSTANTS.CREATE_EDIT_TASK}`}
      exact
      render={() => (
        <Redirect to={`/tasks/myTasks/?create=task`} />
      )}
    /> */}
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
    {/* Data List Screens */}
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
      path={[
        getDevRoutePath(
          ROUTE_CONSTANTS.DATA_LIST_SCREENS.USERS_PARAMS_UUID_REPORT_ID,
        ),
        getDevRoutePath(
          ROUTE_CONSTANTS.DATA_LIST_SCREENS.USERS_PARAMS_UUID_ACTION_TYPE,
        ),
        getDevRoutePath(
          ROUTE_CONSTANTS.DATA_LIST_SCREENS.USERS_PARAMS_UUID_ACTION_ID,
        ),
        getDevRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.USERS_PARAMS_UUID),
      ]}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <DataListLandingPage />
        </Suspense>
      )}
    />
   {/* Data List Landing Page */}
   <Route
        path={[
          getDevRoutePath(
            ROUTE_CONSTANTS.DATA_LIST_LANDING_PAGE.DASHBOARD_WITH_SUB_TAB,
          ),
          getDevRoutePath(
            ROUTE_CONSTANTS.DATA_LIST_LANDING_PAGE.DASHBOARD_WITH_TAB,
          ),
          getDevRoutePath(
            ROUTE_CONSTANTS.DATA_LIST_LANDING_PAGE.DASHBOARD,
          ),
        ]}
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <DataListLandingPage />
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
      path={getDevRoutePath(ROUTE_CONSTANTS.EDIT_DATA_LIST)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          {/* <CreateDataList
            isEditDataListView
            dataListUuid={location.state?.dataListUuid}
          /> */}
          <DatalistsCreateEdit />
        </Suspense>
      )}
    />
    {/* Flow Screens */}
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
          {/* <FlowDashboard /> */}
          <FlowLanding />
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
      path={getDevRoutePath(ROUTE_CONSTANTS.CREATE_DATA_LIST)}
      // exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <LandingPage />
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
      path={getDevRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_TAB)}
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <ListFlow />
        </Suspense>
      )}
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
          to={getDevRoutePath(
            ROUTE_CONSTANTS.APPLICATION_SCREENS.PUBLISHED_LIST,
          )}
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

    {/* Teams & Users Screens */}
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
      path={getDevRoutePath(
        ROUTE_CONSTANTS.TEAMS_EDIT_TEAM +
          ROUTE_CONSTANTS.MATCH_PARAMS_EDIT_TEAM,
      )}
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
        <Redirect to={`${ROUTE_CONSTANTS.TEAMS}/${TEAM_TABS.ORGANISATIONAL}`} />
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
    {/* superadmin */}
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.ADMIN_ACCOUNTS)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          {getSubDomainName(window.location.hostname) ===
            WORKHALL_ADMIN_SUB_DOMAIN ||
            (adminProfile &&
              adminProfile.account_domain === WORKHALL_ADMIN_SUB_DOMAIN) ? (
            <AdminPanel />
          ) : (
            <PageNotFound />
          )}
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(
        ROUTE_CONSTANTS.SUPER_ADMIN_SCREENS.PARAMS_ACCOUNT_ID,
      )}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          {getSubDomainName(window.location.hostname) ===
            WORKHALL_ADMIN_SUB_DOMAIN ||
            (adminProfile &&
              adminProfile.account_domain === WORKHALL_ADMIN_SUB_DOMAIN) ? (
            <AdminPanel />
          ) : (
            <PageNotFound />
          )}
        </Suspense>
      )}
    />
    {/* Other Screens */}
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.CHECKLIST_WORKFLOW_POLICY)}
      exact
      render={() => (
        <Suspense fallback={<FullPageLoader isDataLoading />}>
          <ChecklistWorkflowPolicy />
        </Suspense>
      )}
    />
    <Route
      path={getDevRoutePath(ROUTE_CONSTANTS.BILLING_STATUS)}
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

    {/* Start Report */}
    <Route
      path={[
        getDevRoutePath(
          ROUTE_CONSTANTS.REPORT_SCREENS.LIST_PARAMS_REPORT_ACTION,
        ),
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
        getDevRoutePath(
          ROUTE_CONSTANTS.REPORT_SCREENS.CONFIG_PARAMS_REPORT_ACTION,
        ),
        getDevRoutePath(
          ROUTE_CONSTANTS.REPORT_SCREENS.CONFIG_PARAMS_REPORT_CONFIG,
        ),
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
        getDevRoutePath(
          `${ROUTE_CONSTANTS.INTEGRATIONS}/:${ROUTE_CONSTANTS.MATCH_PARAMS.TAB}`,
        ),
        getDevRoutePath(
          `${ROUTE_CONSTANTS.INTEGRATIONS}/:${ROUTE_CONSTANTS.MATCH_PARAMS.TAB}/:${ROUTE_CONSTANTS.MATCH_PARAMS.UUID}`,
        ),
        getDevRoutePath(
          `${ROUTE_CONSTANTS.INTEGRATIONS}/:${ROUTE_CONSTANTS.MATCH_PARAMS.TAB}/:${ROUTE_CONSTANTS.MATCH_PARAMS.UUID}/:${ROUTE_CONSTANTS.MATCH_PARAMS.ACTION}`,
        ),
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

export default adminRoutes;
