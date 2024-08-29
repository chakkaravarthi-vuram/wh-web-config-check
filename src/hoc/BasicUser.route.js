import React, { Suspense, useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { WorkHallPageLoader } from '@workhall-pvt-lmt/wh-ui-library';
import { getUserRoutePath } from 'utils/UtilityFunctions';
import * as ROUTE_CONSTANTS from '../urls/RouteConstants';
import { getCommonRoutes } from './routeUtility';
import { getAllAppsForRoute } from '../axios/apiService/application.apiService';
import BasicUserLayout from './basic_user_layout/BasicUserLayout';
import AppBuilder from '../containers/application/app_builder/AppBuilder';
import AppHome from '../containers/application/home/AppHome';
import TaskDetail from '../containers/application/app_components/task_listing/task_detail/TaskDetail';
import jsUtility from '../utils/jsUtility';
import CreateEditLayout from '../containers/team/create_and_edit_team/create_edit_layout/CreateEditLayout';
import { EMPTY_STRING } from '../utils/strings/CommonStrings';
import TeamsListing from '../containers/team/team_listing/TeamsListing';
import ThemeContext from './ThemeContext';

const AuthorizeApp = React.lazy(() => import('containers/integration/add_integration/authentication/AuthorizeApp'));

function BasicUserRouteSetup() {
  const [appRoutes, setAppRoutes] = useState([]);
  const [initialApp, setInitialApp] = useState(EMPTY_STRING);
  const [loader, setLoader] = useState(false);
  const { colorScheme } = useContext(ThemeContext);

  useEffect(() => {
    setLoader(true);
    const params = { page_required: 1, sort_field: 'order', sort_by: 1 };
    getAllAppsForRoute(params)
      .then((response) => {
        setAppRoutes(response);
        setInitialApp(`${ROUTE_CONSTANTS.APP}${response?.[0]?.url_path}/${response?.[0]?.pages?.[0]?.url_path}`);
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
      });
  }, []);

  const appCommonRouteLink = getUserRoutePath(
    `${ROUTE_CONSTANTS.APP}${ROUTE_CONSTANTS.APP_NAME}/${ROUTE_CONSTANTS.PAGE_NAME}`,
  );

  return (
    <Switch>
      <Route
        path={ROUTE_CONSTANTS.AUTHORIZE_APP}
        exact
        render={(props) => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <AuthorizeApp {...props} />
          </Suspense>
        )}
      />
      <Route
        path={[
          getUserRoutePath(ROUTE_CONSTANTS.HOME),
          // Added draft task route here, it will be removed once UI enhancement is taken for create and draft task
          getUserRoutePath(ROUTE_CONSTANTS.TASK_SCREENS.DRAFT_PARAMS_PID),
          getUserRoutePath(ROUTE_CONSTANTS.TASK_SCREENS.PARAMS_TAB),
        ]}
        exact
        render={() => (
          <Redirect to={initialApp} />
        )}
      />
      <Route
        path={[
          getUserRoutePath(ROUTE_CONSTANTS.DEFAULT_APP_ROUTE),
          getUserRoutePath(`${ROUTE_CONSTANTS.DEFAULT_APP_ROUTE}${ROUTE_CONSTANTS.TASK_SCREENS.PARAMS_TAB}`),
          getUserRoutePath(`${ROUTE_CONSTANTS.DEFAULT_APP_ROUTE}${ROUTE_CONSTANTS.TASK_SCREENS.DRAFT_PARAMS_PID}`),
        ]}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <BasicUserLayout appRoutes={appRoutes} hidePages>
              <AppHome isBasicUser />
            </BasicUserLayout>
          </Suspense>
        )}
      />
      <Route
        path={[
          getUserRoutePath(ROUTE_CONSTANTS.TASK_SCREENS.PARAMS_TAB_PID),
          `${appCommonRouteLink}${ROUTE_CONSTANTS.TASK_SCREENS.PARAMS_TAB_PID}`,
        ]}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <BasicUserLayout appRoutes={appRoutes} hidePages>
              <TaskDetail isBasicUser />
            </BasicUserLayout>
          </Suspense>
        )}
      />
      <Route
        path={getUserRoutePath(ROUTE_CONSTANTS.TEAM_CREATE_TEAM)}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <BasicUserLayout appRoutes={appRoutes} hidePages><CreateEditLayout /></BasicUserLayout>
          </Suspense>
        )}
      />
      <Route
        path={getUserRoutePath(ROUTE_CONSTANTS.TEAMS_EDIT_TEAM + ROUTE_CONSTANTS.MATCH_PARAMS_EDIT_TEAM)}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <BasicUserLayout appRoutes={appRoutes} hidePages><CreateEditLayout isEdit /></BasicUserLayout>
          </Suspense>
        )}
      />
      <Route
        path={getUserRoutePath(ROUTE_CONSTANTS.TEAMS_SCREENS.PRIVATE)}
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <BasicUserLayout appRoutes={appRoutes} hidePages><TeamsListing /></BasicUserLayout>
          </Suspense>
        )}
      />
      {!jsUtility.isEmpty(appRoutes) &&
        jsUtility.isArray(appRoutes) &&
        appRoutes.map(
          (app) =>
            !jsUtility.isEmpty(app) &&
            jsUtility.isArray(app.pages) &&
            app.pages.map((page) => {
              const { url_path } = page;
              return (
                <Route
                  key={url_path}
                  path={[
                    appCommonRouteLink,
                    `${appCommonRouteLink}${ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID_FLOW_TAB}`,
                    `${appCommonRouteLink}${ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID_FLOW_INSTANCE}`,
                    `${appCommonRouteLink}${ROUTE_CONSTANTS.DATA_LIST_SCREENS.DASHBOARD_PARAMS_UUID_DATALIST_TAB}`,
                    `${appCommonRouteLink}${ROUTE_CONSTANTS.DATA_LIST_SCREENS.DASHBOARD_PARAMS_UUID_DATALIST_INSTANCE}`,
                    `${appCommonRouteLink}${ROUTE_CONSTANTS.REPORT_SCREENS.VIEW_PARAMS_REPORT_INSTANCE_ID}`,
                  ]}
                  exact
                  render={() => (
                    <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
                      <BasicUserLayout appRoutes={appRoutes}>
                        <AppBuilder isBasicUser />
                      </BasicUserLayout>
                    </Suspense>
                  )}
                />
              );
            }),
        )}
        {!jsUtility.isEmpty(appRoutes) &&
        jsUtility.isArray(appRoutes) &&
        appRoutes.map(
          (app) => {
              const { url_path } = app;
              const redirectPath = `${ROUTE_CONSTANTS.APP}${url_path}/${app?.pages?.[0]?.url_path}`;
              return (
                <Route
                  path={`${ROUTE_CONSTANTS.APP}${url_path}/`}
                  exact
                  render={() => (
                    <Redirect to={redirectPath} />
                  )}
                />
              );
          },
        )}
      {getCommonRoutes(appRoutes, loader, colorScheme)}
    </Switch>
  );
}

export default BasicUserRouteSetup;
