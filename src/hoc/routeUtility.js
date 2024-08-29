import { Route, Switch, Redirect } from 'react-router-dom';
import React, { Suspense } from 'react';
import { WorkHallPageLoader } from '@workhall-pvt-lmt/wh-ui-library';
import PrivacyPolicy from '../containers/privacy_policy/PrivacyPolicy';
import UpdateForgotPassword from '../containers/reset_password/UpdateForgotPassword';
import InviteUser from '../containers/sign_in/invite_user/InviteUser';
import gClasses from '../scss/Typography.module.scss';
import * as ROUTE_CONSTANTS from '../urls/RouteConstants';
import { SIGN_IN_STRINGS } from '../containers/sign_in/SignIn.strings';
import SignIn from '../containers/sign_in/SignIn';
import { getUserRoutePath } from '../utils/UtilityFunctions';
import BasicUserLayout from './basic_user_layout/BasicUserLayout';

const PageNotFound = React.lazy(() =>
  import('../containers/error_pages/PageNotFound'),
);
const ResetPassword = React.lazy(() =>
  import('../containers/reset_password/ResetPassword'),
);
const DataListDashboard = React.lazy(() =>
  import('../containers/application/app_components/dashboard/datalist/Datalist'),
);
const ForgotPassword = React.lazy(() =>
  import('../containers/sign_in/forgot_password/ForgotPassword'),
);
const FlowDashboard = React.lazy(() =>
  import('../containers/application/app_components/dashboard/flow/Flow'),
);

export const getCommonRoutes = (appRoutes, loader = false, colorScheme) => (
    <Switch>
      <Route
        path={getUserRoutePath(ROUTE_CONSTANTS.HOME)}
        exact
        render={(props) => (
          <Redirect to={{ pathname: ROUTE_CONSTANTS.SIGNIN, search: props?.location?.search }} />
        )}
      />
      <Route
        path={[
          ROUTE_CONSTANTS.SIGNIN_OLD,
          ROUTE_CONSTANTS.SIGNIN_OLD_WITHOUT_SLASH,
          ROUTE_CONSTANTS.SIGNIN_OLD_USERNAME,
          ROUTE_CONSTANTS.SIGNIN_OLD_USERNAME_SLASH,
        ]}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <Redirect to={ROUTE_CONSTANTS.SIGNIN} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.SIGNIN}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <SignIn currentPage={SIGN_IN_STRINGS.PRE_SIGN_IN_STEP} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.CHOOSE_ACCOUNT}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <SignIn currentPage={SIGN_IN_STRINGS.USER_ACCOUNT_SELECTION} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.PASSWORD}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <SignIn currentPage={SIGN_IN_STRINGS.SIGN_IN_STEP} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.MFA_SETUP}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <SignIn currentPage={SIGN_IN_STRINGS.MFA_SETUP_STEP} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.MFA_OTP_ENFORCED}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader />}>
            <SignIn currentPage={SIGN_IN_STRINGS.MFA_ENFORCED_STEP} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.PRIVACY_POLICY}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <PrivacyPolicy />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.RESET_PASSWORD}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <ResetPassword />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.MFA_OTP_VERIFICATION}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <SignIn currentPage={SIGN_IN_STRINGS.MFA_OTP_VERFICATION_STEP} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.AUTH_SCREENS.UPDATE_FORGOT_PASSWORD_PARAMS_PID}
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <UpdateForgotPassword />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.FORGOT_PASSWORD}
        exact
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <ForgotPassword />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.AUTH_SCREENS.INVITE_USER_PARAMS_ID}
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <InviteUser />
          </Suspense>
        )}
      />
      {/* Flow Screens */}
      <Route
        path={[
          getUserRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID_FLOW_INSTANCE),
          getUserRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID_FLOW_TAB),
          getUserRoutePath(ROUTE_CONSTANTS.FLOW_SCREENS.PARAMS_UUID),
        ]}
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <BasicUserLayout appRoutes={appRoutes} hidePages><FlowDashboard /></BasicUserLayout>
          </Suspense>
        )}
      />
      <Route
        path={[
          getUserRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.DASHBOARD_PARAMS_UUID_DATALIST_INSTANCE),
          getUserRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.DASHBOARD_PARAMS_UUID_DATALIST_TAB),
          getUserRoutePath(ROUTE_CONSTANTS.DATA_LIST_SCREENS.DASHBOARD_PARAMS_UUID),
        ]}
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            <BasicUserLayout appRoutes={appRoutes} hidePages><DataListDashboard /></BasicUserLayout>
          </Suspense>
        )}
      />
      <Route
        path="*"
        render={() => (
          <Suspense fallback={<WorkHallPageLoader isDataLoading color={colorScheme?.activeColor && colorScheme?.activeColor} />}>
            {loader ? <WorkHallPageLoader color={colorScheme?.activeColor && colorScheme?.activeColor} className={gClasses.Height100Vh} /> : <PageNotFound />}
          </Suspense>
        )}
      />
    </Switch>
  );
