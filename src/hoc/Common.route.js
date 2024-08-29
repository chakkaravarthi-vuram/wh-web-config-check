import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import BillingModule from 'containers/billing_module/BillingModule';

import FullPageLoader from '../assets/icons/FullPageLoader';
import PrivacyPolicy from '../containers/privacy_policy/PrivacyPolicy';
import UpdateForgotPassword from '../containers/reset_password/UpdateForgotPassword';
import InviteUser from '../containers/sign_in/invite_user/InviteUser';

import * as ROUTE_CONSTANTS from '../urls/RouteConstants';
import { SIGN_IN_STRINGS } from '../containers/sign_in/SignIn.strings';
import SignIn from '../containers/sign_in/SignIn';
import { getDevRoutePath } from '../utils/UtilityFunctions';

const ListFlow = React.lazy(() => import('../containers/flow/listFlow/ListFlow'));
const ListDataList = React.lazy(() => import('../containers/data_list/listDataList/ListDataList'));
const PageNotFound = React.lazy(() => import('../containers/error_pages/PageNotFound'));
const ResetPassword = React.lazy(() => import('../containers/reset_password/ResetPassword'));
const ForgotPassword = React.lazy(() =>
  import('../containers/sign_in/forgot_password/ForgotPassword'));
const BillingStatusCheck = React.lazy(() => import('../containers/billing_module/billing_payment_success/PaymentSuccess'));
const FlowDashboard = React.lazy(() =>
  import('../containers/application/app_components/dashboard/flow/Flow'),
);
const DataListDashboard = React.lazy(() =>
  import('../containers/application/app_components/dashboard/datalist/Datalist'),
);

export function Routes(isBillingUser) {
  return (
    <Switch>
      <Route
        path={ROUTE_CONSTANTS.HOME}
        exact
        render={(props) => (
          <Redirect to={{ pathname: ROUTE_CONSTANTS.SIGNIN, search: props?.location?.search }} />
        )}
      />
      <Route
        path={getDevRoutePath(ROUTE_CONSTANTS.HOME)}
        exact
        render={(props) => (
          <Redirect to={{ pathname: ROUTE_CONSTANTS.SIGNIN, search: props?.location?.search }} />
        )}
      />
      {/* <Route
        path={ROUTE_CONSTANTS.SIGNUP_CREATE}
        exact
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <SignUp currentSignupPage={SIGN_UP_STEP.LANDING} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.SIGNUP_CREATE_EMAIL}
        exact
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <SignUp currentSignupPage={SIGN_UP_STEP.BASIC} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.SIGNUP_CREATE_OTP}
        exact
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <SignUp currentSignupPage={SIGN_UP_STEP.OTP_VERIFICATION} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.SIGNUP_CREATE_ACCOUNT_DETAILS}
        exact
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <SignUp currentSignupPage={SIGN_UP_STEP.ADDITIONAL} />
          </Suspense>
        )}
      /> */}
      <Route
        path={[
          ROUTE_CONSTANTS.SIGNIN_OLD,
          ROUTE_CONSTANTS.SIGNIN_OLD_WITHOUT_SLASH,
          ROUTE_CONSTANTS.SIGNIN_OLD_USERNAME,
          ROUTE_CONSTANTS.SIGNIN_OLD_USERNAME_SLASH,
        ]}
        exact
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <Redirect to={ROUTE_CONSTANTS.SIGNIN} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.SIGNIN}
        exact
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <SignIn currentPage={SIGN_IN_STRINGS.PRE_SIGN_IN_STEP} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.DATALIST_USERS}
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <DataListDashboard />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.CHOOSE_ACCOUNT}
        exact
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <SignIn currentPage={SIGN_IN_STRINGS.USER_ACCOUNT_SELECTION} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.PASSWORD}
        exact
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <SignIn currentPage={SIGN_IN_STRINGS.SIGN_IN_STEP} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.PRIVACY_POLICY}
        exact
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <PrivacyPolicy />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.RESET_PASSWORD}
        exact
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <ResetPassword />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.MFA_OTP_VERIFICATION}
        exact
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
             <SignIn currentPage={SIGN_IN_STRINGS.MFA_OTP_VERFICATION_STEP} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.MFA_OTP_ENFORCED}
        exact
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
             <SignIn currentPage={SIGN_IN_STRINGS.MFA_ENFORCED_STEP} />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.AUTH_SCREENS.UPDATE_FORGOT_PASSWORD_PARAMS_PID}
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <UpdateForgotPassword />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.FORGOT_PASSWORD}
        exact
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <ForgotPassword />
          </Suspense>
        )}
      />
      <Route
        path={ROUTE_CONSTANTS.AUTH_SCREENS.INVITE_USER_PARAMS_ID}
        render={() => (
          <Suspense fallback={<FullPageLoader isDataLoading />}>
            <InviteUser />
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
      {/* Flow Screens */}
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
}

export default Routes;
