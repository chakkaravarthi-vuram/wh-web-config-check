/**
 * @author rajkumarj
 * @email rajkumarj@vuram.com
 * @create date 2020-08-01 09:56:16
 * @modify date 2020-08-01 09:56:16
 * @desc [description]
 */
import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { isUndefined } from 'lodash';
import debounce from 'lodash/debounce';
import axios from 'axios';
import queryString from 'query-string';
import { withTranslation } from 'react-i18next';
import ChatWindow from 'components/chat_components/chat_window/ChatWindow';
import DownloadWindow from 'components/download/download_window/DownloadWindow';
import DownloadActivityWindow from 'components/download/download_window/download_activity_window/DownloadActivityWindow';
import { axiosGetUtils } from 'axios/AxiosHelper';
import getReportDownloadDocsThunk from 'redux/actions/DownloadWindow.Action';
import { clearAccountSettingModalShowCheck, logoutAction } from 'redux/actions/Actions';
import AccountInfoModal from 'containers/landing_page/account_info/AccountInfoModal';
import { NOTIFICATION_TASK_REFRESH_TYPES, NOTIFICATION_TYPES } from 'containers/landing_page/main_header/notification/EachNotification.strings';
import TrialNotify from 'containers/landing_page/trial_notify/TrialNotify';
import PaymentFlow from 'containers/billing_module/payment_flow/PaymentFlow';
import { tryAgainBillingPayment } from 'redux/actions/BillingModule.Action';
import { layoutMainWrapperId } from 'components/form_components/modal/Modal.strings';
import UpdateConfirmPopover from 'components/update_confirm_popover/UpdateConfirmPopover';
import LandingPage from 'containers/landing_page/LandingPage';
import ConfirmPopover from 'components/popovers/confirm_popover/ConfirmPopover';
import FormStatusPopover from 'components/popovers/form_status_popover/FormStatusPopover';
import { DOWNLOAD_WINDOW_STRINGS } from 'components/download/Download.strings';
import {
  getCachedUserDetails,
} from 'containers/sign_in/SignIn.utils';
import { NavBarDataChange } from 'redux/actions/NavBar.Action';
import EditConfirmPopover from 'components/popovers/edit_confirm_popover/EditConfirmPopover';
import PaymentRedirectScreen from 'containers/billing_module/payment_redirect/PaymentRedirect';
import { INITIAL_FLOW_DATA } from 'redux/reducer/EditFlowReducer';
import { onMessageListener } from 'containers/sign_in/update_firebase_token/UpdateFirebaseToken';
import { getAllNotficationsApiThunk } from 'redux/actions/Notifications.Action';
import { notificationsDataChangeAction } from 'redux/reducer/NotificationsReducer';
import { downloadWindowDataChange } from 'redux/reducer/DownloadWindowReducer';
import { getActiveTaskListDataThunk } from 'redux/actions/TaskActions';
import { M_T_STRINGS } from 'containers/landing_page/LandingPage.strings';
import Task from 'containers/task/task/Task';
import CreateDataList from 'containers/flow/create_data_list/CreateDataList';
import InitFlowModal from 'containers/edit_flow/InitFlowModal';
import NotificationContent from 'containers/landing_page/main_header/notification/NotificationContent';
import { Toast } from '@workhall-pvt-lmt/wh-ui-library';
// import HomeHeader from '../../containers/landing_page/main_header/MainHeader';
import AlertStatusPopover from '../../components/alert_status_popover/AlertStatusPopover';
import UserImage from '../../components/user_image/UserImage';
import LeftNavBar from './left_nav_bar/LeftNavBar';
import ThemeContext from '../ThemeContext';
import styles from './Layout.module.scss';
import gClasses from '../../scss/Typography.module.scss';
import { BS } from '../../utils/UIConstants';
import { NOTIFICATION_SOCKET_EVENTS, ROLES, ROUTE_METHOD } from '../../utils/Constants';
import {
  LOGGED_IN_NAVBAR_STRINGS,
  USER_PROFILE_DROPDOWN_INDEX,
} from '../../components/logged_in_nav_bar/LoggedInNavbar';
import { IMAGE_BASE_URL, SIGN_OUT } from '../../urls/ApiUrls';
import { EMPTY_STRING, FORM_POPOVER_STRINGS } from '../../utils/strings/CommonStrings';

import {
  ADMIN_HOME,
  ADMIN_SETTINGS,
  USER_SETTINGS,
  CREATE_EDIT_TASK,
  CREATE_TEAM,
  EDIT_FLOW,
  CREATE_DATA_LIST,
  ALL_USERS,
  TEAMS,
  TASKS,
  LIST_FLOW,
  LIST_DATA_LIST,
  EDIT_DATA_LIST,
  CREATE_DATA_LIST_FROM_LISTING,
  ADMIN_ACCOUNTS,
  DATALIST_USERS,
  HOME,
  LANDING_PAGE_ROUTES,
  SIGNIN,
  OPEN_TASKS,
  INTEGRATIONS,
  LIST_APPLICATION,
  EDIT_APP,
  CREATE_APP,
  VIEW_REPORT,
  EDIT_REPORT,
  CREATE_REPORT,
  EXTERNAL_INTEGRATION,
  DRAFT_INTEGRATION,
  WORKHALL_INTEGRATION,
  API_CREDENTIAL,
  TEAM_CREATE_TEAM,
  EDIT_INTEGRATION,
  ML_MODELS,
  TEAMS_EDIT_TEAM,
  DEV_USER,
  FLOW_DASHBOARD,
  DATA_LIST_DASHBOARD,
  REPORT_LIST,
} from '../../urls/RouteConstants';
import {
  layoutWithSidebarSetState,
  layoutWithSidebarClearState,
} from '../../redux/actions/LayoutWithSidebar.Action';
import {
  getThreadsByUserSuccess,
  updateSelectedChatThreadsThunk,
} from '../../redux/actions/ChatScreen.Action';
import {
  editFlowExit,
  createTeamExit,
  createTaskExit,
  createDataSetExit,
  editDataListExit,
  updateAlertPopverStatus,
  clearAlertPopOverStatus,
  getProfileDataForChat,
  updateEditConfirmPopOverStatus,
  logoutClearUtil,
  getUserProfileData,
  isMobileScreen,
  routeNavigate,
  getRouteLink,
} from '../../utils/UtilityFunctions';
import jsUtils, { getDomainName, getSubDomainName, isEqual } from '../../utils/jsUtility';
import UserSettings from '../../containers/user_settings/UserSettings';
import CreateApp from '../../containers/application/create_app/CreateApp';
import { CUSTOMER_TOOLTIP } from '../../components/form_components/pagination/Pagination.strings';
import MfaVerificationModal from '../../containers/mfa/mfa_verification_modal/MfaVerificationModal';
import CreateEditTeam from '../../containers/team/create_and_edit_team/CreateEditTeam';
import TaskCreationLoader from '../../containers/task/task/task_creation_loader/TaskCreationLoader';
import LandingPageHeader from '../../containers/landing_page/landing_page_header/LandingPageHeader';
import { getLandingPageHeaderData } from '../../containers/landing_page/landing_page_header/LandingPageHeader.utils';

const cookies = new Cookies();
const { CancelToken } = axios;
let cancelForSignOut;

class Layout extends Component {
  constructor(props) {
    super(props);
    this.layoutMainWrapperRef = React.createRef();
    this.popoverRef = React.createRef();
    this.state = {
      planShow: false,
      trialIndiacatorShow: true,
    };
  }

  componentDidMount() {
    const {
      is_account_completed,
      navbarDataChange,
      existing_account,
      acc_subscription_type,
      is_billing_card_verified,
      isBillingUser,
      role,
      history,
    } = this.props;

    const {
      trialIndiacatorShow,
    } = this.state;

    const URLParams = new URLSearchParams(jsUtils.get(history, ['location', 'search'], ''));

    navbarDataChange({
      isTrialDisplayed: (!existing_account && acc_subscription_type !== 'subscription' && trialIndiacatorShow) || (!existing_account && !is_billing_card_verified && acc_subscription_type === 'subscription' && trialIndiacatorShow && (isBillingUser || role === ROLES.ADMIN)),
    });
    const userDetails = getCachedUserDetails();
    if (userDetails.buy_now_user && is_account_completed) {
      this.setState({ planShow: true });
      cookies.remove('buy_now_user', {
        path: '/',
        domain: getDomainName(window.location.hostname),
      });
    }
    this.recursiveNotificationSocketListener();

    if (role === ROLES.MEMBER) {
      if (URLParams.get('create') === 'flow' || URLParams.get('create') === 'datalist') {
        routeNavigate(history, ROUTE_METHOD.PUSH, HOME);
      }
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      navbarDataChange,
      location,
      existing_account,
      acc_subscription_type,
      is_billing_card_verified,
      isBillingUser,
      role,
    } = this.props;
    const {
      trialIndiacatorShow,
    } = this.state;
    if (prevState.trialIndiacatorShow !== trialIndiacatorShow) {
      navbarDataChange({
        isTrialDisplayed: (!existing_account && acc_subscription_type !== 'subscription' && trialIndiacatorShow) || (!existing_account && !is_billing_card_verified && acc_subscription_type === 'subscription' && trialIndiacatorShow && (isBillingUser || role === ROLES.ADMIN)),
      });
    }
    if (!jsUtils.isEqual(prevProps.location, location)) {
      const scrollDiv = this.layoutMainWrapperRef.current;
      if (scrollDiv) {
        scrollDiv.scrollTo(0, 0);
      }
    }
  }

  componentWillUnmount() {
    if (cancelForSignOut) cancelForSignOut();
    const { clearState, clearAccountSettingCheck } = this.props;
    clearState();
    clearAccountSettingCheck();
    this.removeSocketListeners();
  }

  render() {
    const {
      t,
      profile,
      children,
      status,
      location,
      state,
      role,
      isNavbarOpen,
      history,
      selectedChatThreads,
      is_account_completed,
      manual_account_complete,
      is_account_expired,
      expiry_day_remaining,
      existing_account,
      direct_pay,
      acc_subscription_type,
      is_billing_card_verified,
      tryAgainHandle,
      isBillingUser,
      // displayFlowReportEdit,
      // displayDatalistReportEdit,
      flowData,
      dataListState,
      PaymentRedirectShow,
      isDownloadNotificationsModalOpen,
      isDownloadActivityOpen,
      isNotificationsModalOpen,
      isMlTaskLoading,
      isMfaEnabled,
      isMfaEnforced,
      isMfaVerified,
      retryDownloadData: {
        type,
      },
    } = this.props;
    const isTaskDownloadActivity = type === DOWNLOAD_WINDOW_STRINGS.ACTIVITY.TYPE.TASK;
    window.addEventListener('storage', (event) => {
      console.log('eventListener storage', event);
      console.log('localstorage sessionstorage console3', localStorage, sessionStorage, cookies);
      if (event.key === 'csrf_token' && event.oldValue && !event.newValue) {
        console.log('eventListener storage1', event);
        window.location.reload();
      }
   });

   onMessageListener()
    .then((payload) => {
      console.log('onMessageListener', payload, localStorage, localStorage.getItem('notificationID'));
      if (localStorage.getItem('notificationID') !== payload.messageId) {
      const notificationTitle = payload.data.title;
      const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.icon,
        tag: payload.msesageId,
    };
    const profileData = getUserProfileData();
    const notificationArray = JSON.parse(jsUtils.get(payload, ['data', 'notificationInfo'], ''));
    const currentNotificationObject = jsUtils.find(notificationArray, {
      user_id: profileData.id,
    });
    const notificationId = jsUtils.get(currentNotificationObject, ['_id'], '');
    if (!('Notification' in window)) {
        console.log('This browser does not support system notifications');
    } else if (Notification.permission === 'granted' && !notificationTitle.includes('Message from') && document.hasFocus()) { // Let's check whether notification permissions have already been granted
        const notification = new Notification(notificationTitle, notificationOptions);
        notification.onclick = async (event) => {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
      console.log('linkClickCheckEnter');
      if (!jsUtils.isEmpty(notificationId)) {
        const userProfileData = getProfileDataForChat();
        if (userProfileData && userProfileData.notificationSocket) {
          userProfileData.notificationSocket.emit(
            NOTIFICATION_SOCKET_EVENTS.EMIT_EVENTS.READ_NOTIFICATION,
            {
              _id: notificationId,
            },
            (code, error) => {
              console.log('Notification read via socket', code, error);
            },
          );
        }
      }
      if (!jsUtils.isEmpty(jsUtils.get(payload, ['data', 'click_action'], ''))) {
        const clickActionURL = payload.data.click_action;
        const domainName =
          window && window.location && window.location.hostname ?
          window.location.hostname.substring(
          window.location.hostname.lastIndexOf('.', window.location.hostname.lastIndexOf('.') - 1) + 1,
        ) : '';
        console.log('linkClickCheck');
        const link = domainName === 'localhost' ?
        `http://${clickActionURL.replace(`${getSubDomainName(clickActionURL)}.workhall.dev`,
        'localhost:8000')}` :
        `https://${clickActionURL}`;
        window.open(link, '_blank');
      }
            notification.close();
        };
    }
    }
    localStorage.setItem('notificationID', payload.messageId);
    })
    .catch((err) => console.log('failed: ', err));
   window.onpopstate = (event) => {
    console.log('popstatee', event);
    if (status.isEditConfirmVisible) {
    updateEditConfirmPopOverStatus({
      title: '',
      subTitle: '',
      status: '',
      isEditConfirmVisible: false,
      type: '',
    });
  }
   };

    const { trialIndiacatorShow, planShow } = this.state;
    console.log('fewsdsdf', is_account_completed, performance, performance.navigation.type);
    const initialLocation = isUndefined(location.pathname) ? location : null;
    console.log('LOCATION INITIAL', initialLocation);
    const { isUserProfileDropdownVisible } = state;
    console.log('isUserProfileDropdownVisible render', profile, status);
    const { primaryColor } = this.context;
    const URLParams = new URLSearchParams(jsUtils.get(history, ['location', 'search'], ''));
    const mainContentStyle = {
      padding:
        (location.pathname.includes(TASKS) ||
          location.pathname.includes(LIST_FLOW) ||
          location.pathname.includes(LIST_DATA_LIST) ||
          location.pathname.includes(CREATE_EDIT_TASK) ||
          location.pathname.includes(CREATE_DATA_LIST) ||
          location.pathname.includes(EDIT_DATA_LIST) ||
          location.pathname.includes(EDIT_FLOW) ||
          location.pathname.includes(FLOW_DASHBOARD) ||
          location.pathname.includes(DATA_LIST_DASHBOARD) ||
          location.pathname.includes(ADMIN_SETTINGS) ||
          (location.pathname.includes(ADMIN_ACCOUNTS) || location.pathname.includes('/super-admin')) ||
          location.pathname.includes(DATALIST_USERS) ||
          location.pathname.includes('dashboard')) ||
          location.pathname.includes(TEAMS) ||
          location.pathname.includes(INTEGRATIONS) ||
          location.pathname.includes(EDIT_APP) ||
          location.pathname.includes(CREATE_APP) ||
          location.pathname.includes(VIEW_REPORT) || location.pathname.includes(EDIT_REPORT) ||
          location.pathname.includes(CREATE_REPORT) ||
          location.pathname.includes(REPORT_LIST) ||
          location.pathname.includes(ML_MODELS) ||
          (URLParams.get('create') === 'flow' && flowData.isFlowModalDisabled) ||
        (URLParams.get('create') === 'datalist' && dataListState.isDataListModalDisabled)
          ? '0px' : '30px',
    };

    let profile_pic = null;
    if (profile.profile_pic) {
      if (profile.profile_pic.location) {
        profile_pic = IMAGE_BASE_URL + profile.profile_pic.location;
      } else if (profile.profile_pic) {
        profile_pic = profile.profile_pic;
      }
    }

    const profileDropDown = (
      <div className={BS.D_FLEX}>
        {console.log(profile.first_name, 'profile.first_name')}
        <UserImage
          className={cx(styles.UserIcon2, gClasses.CursorPointer)}
          firstName={profile.first_name}
          lastName={profile.last_name}
          src={profile_pic}
        />
        <div className={gClasses.ML15}>
          <div
            className={cx(gClasses.NavBarUserName)}
            style={{ color: primaryColor }}
          >
            {profile.user_name}
          </div>
          <div className={cx(gClasses.NavBarEmail, gClasses.MT5)}>
            {profile.email}
          </div>
        </div>
      </div>
    );
    let userProfileDropdownList;
    if (role === ROLES.ADMIN) {
      userProfileDropdownList =
        LOGGED_IN_NAVBAR_STRINGS(t).USER_PROFILE_DROPDOWN.map((option) => (
          <li
            key={`userProfileDropdown${option.INDEX}`}
            className={cx(
              gClasses.FTwo13BlackV2,
              gClasses.FontWeight600,
              gClasses.PT15,
            )}
            onMouseDown={() =>
              this.onUserProfileDropdownClickHandler(option.INDEX)
            }
            role="menuitem"
            onKeyDown={() =>
              this.onUserProfileDropdownClickHandler(option.INDEX)
            }
          >
            {option.TEXT}
          </li>
        ));
    }
    if (role === ROLES.MEMBER || role === ROLES.FLOW_CREATOR) {
      userProfileDropdownList =
        LOGGED_IN_NAVBAR_STRINGS(t).NON_ADMIN_USER_PROFILE_DROPDOWN.map(
          (option) => (
            <li
              key={`userProfileDropdown${option.INDEX}`}
              className={cx(
                gClasses.FTwo13BlackV2,
                gClasses.FontWeight600,
                gClasses.PT15,
              )}
              onMouseDown={() =>
                this.onUserProfileDropdownClickHandler(option.INDEX)
              }
              role="menuitem"
              onKeyDown={() =>
                this.onUserProfileDropdownClickHandler(option.INDEX)
              }
            >
              {option.TEXT}
            </li>
          ),
        );
    }

    const userProfileDropdown = (
      <ul
        className={cx(
          BS.P_ABSOLUTE,
          styles.UserProfileDropdown,
          gClasses.InputBorderRadius,
        )}
      >
        {profileDropDown}
        {userProfileDropdownList}
      </ul>
    );
    let blurBg = null;
    console.log('LOCATION.PATHNAME ORIGINAL', location);
    if (location.pathname !== ADMIN_HOME) {
      blurBg = (
        <button
          className={cx(
            gClasses.ModalBg,
            gClasses.BlurBg,
            gClasses.ClickableElement,
          )}
          ref={this.modalBgRef}
          onClick={this.onBlurBgClick}
        >
          {EMPTY_STRING}
        </button>
      );
      if (
        location.pathname === '/all_users/' ||
        location.pathname === '/teams/' ||
        (location.pathname === '/data_lists/' && isUndefined(location.state)) ||
        (location.pathname === LIST_FLOW && isUndefined(location.state))
      ) blurBg = null;
      console.log('LOCATION.PATHNAME BLURBG', blurBg);
    }
    let mainContent = null;
    const hideHeader = ((URLParams.get('create') === 'flow' && flowData.isFlowModalDisabled) ||
      (URLParams.get('create') === 'datalist' && dataListState.isDataListModalDisabled) ||
      ([CREATE_DATA_LIST, CREATE_DATA_LIST_FROM_LISTING].includes(location.pathname) && dataListState.isDataListModalDisabled) ||
      (location.pathname === getRouteLink(EDIT_FLOW, history)) ||
      (location.pathname === getRouteLink(EDIT_DATA_LIST, history)) ||
      (location.pathname === getRouteLink(TEAM_CREATE_TEAM, history)) ||
      (location.pathname.includes(TEAMS_EDIT_TEAM)) ||
      (
        location.pathname.includes(INTEGRATIONS) &&
        (location.pathname.includes(EDIT_INTEGRATION))
      )
    );
      const { isTrialDisplayed } = this.props;
      const { headerDetails } = getLandingPageHeaderData(history, t, {});
    if (LANDING_PAGE_ROUTES.includes(location.pathname)) {
      mainContent =
      (
      <div className={!jsUtils.isNull(URLParams.get('create')) ?
      cx(styles.MainContent, isTrialDisplayed && styles.TrialActive, styles.HideHeaderHeight) : null}
      >
        <LandingPage isTrialDisplayed={(!existing_account && acc_subscription_type !== 'subscription' && trialIndiacatorShow) || (!existing_account && !is_billing_card_verified && acc_subscription_type === 'subscription' && trialIndiacatorShow && (isBillingUser || role === ROLES.ADMIN))} />
      </div>
      );
    } else {
      mainContent = (
        <div style={mainContentStyle} className={cx(styles.MainContent, styles.BgWhite, headerDetails?.hideSubHeader && styles.ResponsiveMainContent, isTrialDisplayed && styles.TrialActive, (hideHeader ? styles.HideHeaderHeight : null))}>
          {console.log('gfsgbhdsfhgs', URLParams.get('create'))}
          {URLParams.get('create') === 'task' ? <Task onCloseClick={this.onCloseIconClick} /> : null}
          {
            role !== ROLES.MEMBER && (
              <>
                {URLParams.get('create') === 'flow' ? <InitFlowModal /> : null}
                {URLParams.get('create') === 'datalist' ? <CreateDataList /> : null}
                {URLParams.get('create') === 'app' ? <CreateApp onCloseClick={this.onCloseIconClick} /> : null}
                {URLParams.get('create') === 'teams' ? <CreateEditTeam /> : null}
              </>
            )
          }
          {children}
        </div>
      );
    }

    const onUpgradeClick = () => {
      this.setState({ planShow: true });
      const layoutState = {
        isTrialUser: true,
      };
      routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, EMPTY_STRING, layoutState);
    };

    const onCloseClick = () => {
      this.setState({ planShow: false });
    };

    const onCloseTrialIndicator = () => {
      this.setState({ trialIndiacatorShow: false });
    };

    const onChangeCardDetails = () => {
      tryAgainHandle(history);
    };

    return (
      <div>
      {isMfaEnabled && isMfaEnforced && !isMfaVerified ? (
        <MfaVerificationModal isModalOpen={isMfaEnabled && isMfaEnforced && !isMfaVerified} signOut={this.signOutFunction} />
      ) : (
        <div>
        <PaymentFlow isModalOpen={(is_account_expired && acc_subscription_type !== 'subscription') || planShow || direct_pay} onAccountClose={onCloseClick} onCloseClick={() => this.setState({ planShow: false })} signOut={this.signOutFunction} expiry_day_remaining={expiry_day_remaining} is_account_expired={is_account_expired} />
        {PaymentRedirectShow && <PaymentRedirectScreen />}
        <ConfirmPopover />
        {!is_account_completed && !manual_account_complete && (
          <AccountInfoModal
            signOut={this.signOutFunction}
            expiry_day_remaining={expiry_day_remaining}
            is_account_expired={is_account_expired}
          />
        )}
        <AlertStatusPopover />
        <FormStatusPopover isVisible={status.isVisible} popoverRef={this.popoverRef} />
        {status.isEditConfirmVisible ? <EditConfirmPopover history={history} /> : null}
        {isDownloadNotificationsModalOpen && <DownloadWindow />}
        <Toast />
        <div
          id={layoutMainWrapperId}
          ref={this.layoutMainWrapperRef}
          className={cx(
            styles.MainWrapper,
            (
              history.location.pathname.includes('createFlow') ||
              history.location.pathname.includes('createDatalist') ||
              history.location.pathname.includes(LIST_APPLICATION || EDIT_APP)
              || history.location.pathname.includes(EXTERNAL_INTEGRATION)
              || history.location.pathname.includes(WORKHALL_INTEGRATION)
              || history.location.pathname.includes(DRAFT_INTEGRATION)
              || history.location.pathname.includes(API_CREDENTIAL)
            ) ? gClasses.OverflowYHiddenImportant : null,
            isNavbarOpen ? styles.NavbarOpen : (!isMobileScreen() && styles.NavBarClosed),
            ((!existing_account && acc_subscription_type !== 'subscription' && trialIndiacatorShow) || (!existing_account && !is_billing_card_verified && acc_subscription_type === 'subscription' && trialIndiacatorShow && (isBillingUser || role === ROLES.ADMIN))) && styles.TrialAllow,
            ((!existing_account && acc_subscription_type !== 'subscription' && trialIndiacatorShow) || (!existing_account && !is_billing_card_verified && acc_subscription_type === 'subscription' && trialIndiacatorShow && (isBillingUser || role === ROLES.ADMIN))) && (location.pathname === ADMIN_HOME && styles.LandingTrialHeight),
          )}
        >
          {((!existing_account && acc_subscription_type !== 'subscription' && trialIndiacatorShow) || (!existing_account && !is_billing_card_verified && acc_subscription_type === 'subscription' && trialIndiacatorShow && (isBillingUser || role === ROLES.ADMIN))) && <TrialNotify onUpgradeClick={onUpgradeClick} expiry_day_remaining={expiry_day_remaining} is_account_expired={is_account_expired} trialShowClose={onCloseTrialIndicator} is_billing_card_verified={is_billing_card_verified} onChangeCardDetails={onChangeCardDetails} acc_subscription_type={acc_subscription_type} existing_account={existing_account} />}
          <LeftNavBar
            toggleProfileDropdown={this.toggleProfileDropdown}
            isUserProfileDropdownVisible={isUserProfileDropdownVisible}
            userProfileDropdown={userProfileDropdown}
            locationHistory={history}
            onUserProfileDropdownClickHandler={this.onUserProfileDropdownClickHandler}
            updateUserStatus={this.updateUserStatus}
            updateIncomingMessages={this.updateIncomingMessages}
            isTrialDisplayed={((!existing_account && acc_subscription_type !== 'subscription' && trialIndiacatorShow) || (!existing_account && !is_billing_card_verified && acc_subscription_type === 'subscription' && trialIndiacatorShow && (isBillingUser || role === ROLES.ADMIN)))}
          />
          {/* {!(hideHeader) && <HomeHeader
           onUserProfileDropdownClickHandler={
            this.onUserProfileDropdownClickHandler
          }
          toggleProfileDropdown={this.toggleProfileDropdown}
          isUserProfileDropdownVisible={isUserProfileDropdownVisible}
          userProfileDropdown={userProfileDropdown}
          />} */}
          {!hideHeader && (
            <LandingPageHeader
              onUserProfileDropdownClickHandler={this.onUserProfileDropdownClickHandler}
              toggleProfileDropdown={this.toggleProfileDropdown}
              isUserProfileDropdownVisible={isUserProfileDropdownVisible}
              userProfileDropdown={userProfileDropdown}
            />
          )}
          {/* <Header onUserProfileDropdownClickHandler={this.onUserProfileDropdownClickHandler} /> */}
          {mainContent}
        </div>
        <div
          className={cx(
            BS.P_FIXED,
            BS.D_FLEX,
            BS.FLEX_FLOW_REVERSE,
            BS.ALIGN_ITEMS_END,
            isTaskDownloadActivity ? styles.TaskDownloadActivityWindow : styles.DownloadActivityWindow,
          )}
        >
          {isDownloadActivityOpen && <DownloadActivityWindow />}
        </div>
        <div className={cx(gClasses.ZIndex10, BS.P_RELATIVE)}>
          {isNotificationsModalOpen && (
          <NotificationContent
            isModalOpen={isNotificationsModalOpen}
          />
          )}
        </div>
        <div
          className={cx(
            BS.P_FIXED,
            BS.D_FLEX,
            BS.FLEX_FLOW_REVERSE,
            BS.ALIGN_ITEMS_END,
            styles.ChatWindows,
          )}
        >
          {selectedChatThreads &&
            selectedChatThreads.map((data, index) => (
              <ChatWindow
                key={data.threadEmail}
                closeChatWindow={this.closeChatWindowHandler}
                index={index}
                data={data}
                profileData={getProfileDataForChat()}
                updateSelectedChatThreadsData={
                  this.updateSelectedChatThreadsData
                }
                markMessagesAsRead={this.markMessagesAsRead}
                updateTypingList={this.updateTypingList}
                updateUserStausInChatMenu={this.updateUserStatusAfterJoiningChat}
              />
            ))}
        </div>
        {isMlTaskLoading && <TaskCreationLoader />}
        {history.location.state && history.location.state.userSettingsModal ? (
          <UserSettings />
        ) : null}
        </div>
      )}
      </div>
    );
  }

  onBlurBgClick = () => {
    const {
      history,
      location,
      flowData,
      temporary_form_details,
      form_details,
      t,
    } = this.props;
    if (location.pathname === CREATE_EDIT_TASK) {
      createTaskExit(t, history);
      return;
    }
    if (location.pathname === CREATE_TEAM) {
      createTeamExit(history);
      return;
    }
    if (location.pathname === EDIT_FLOW) {
      console.log('EDITFLOWEXIT');
      if (!isEqual(flowData, INITIAL_FLOW_DATA)) {
        editFlowExit(t, history);
      } else {
        routeNavigate(history, ROUTE_METHOD.PUSH, ADMIN_HOME);
      }

      return;
    }
    if (location.pathname === EDIT_DATA_LIST) {
      console.log('EDITDATALISTEXIT');
      if (!isEqual(form_details, temporary_form_details)) {
        editDataListExit(t, history);
      } else {
        routeNavigate(history, ROUTE_METHOD.PUSH, ADMIN_HOME);
      }
      return;
    }
    if (location.pathname === CREATE_DATA_LIST) {
      createDataSetExit(t, history);
      return;
    }
    if (location.pathname.includes(ALL_USERS)) {
      console.log('LOCATION ALL UERS');
      routeNavigate(history, ROUTE_METHOD.PUSH, ALL_USERS);
      return;
    }
    if (location.pathname.includes(TEAMS)) {
      console.log('LOCATION ALL UERS');
      routeNavigate(history, ROUTE_METHOD.PUSH, TEAMS);
      return;
    }
    if (location.pathname.includes(LIST_DATA_LIST)) {
      console.log('LOCATION ALL DATALIST');
      routeNavigate(history, ROUTE_METHOD.PUSH, ADMIN_HOME);
    }
    if (location.pathname === LIST_FLOW) {
      routeNavigate(history, ROUTE_METHOD.PUSH, ADMIN_HOME);
      return;
    }
    routeNavigate(history, ROUTE_METHOD.PUSH, ADMIN_HOME);
  };

  onUserProfileDropdownClickHandler = (index, e) => {
    const { history, t } = this.props;
    console.log('index check', index, history);
    switch (index) {
      case USER_PROFILE_DROPDOWN_INDEX.ADMIN_SETTINGS:
        routeNavigate(history, ROUTE_METHOD.PUSH, ADMIN_SETTINGS);
        break;
      case USER_PROFILE_DROPDOWN_INDEX.LANGUAGE_TIME_ZONE:
        if (history.location.pathname === CREATE_EDIT_TASK) {
          updateAlertPopverStatus({
            isVisible: true,
            customElement: (
              <UpdateConfirmPopover
                onYesHandler={async () => {
                  const layoutState = {
                    // originalLocation: 'Home',
                    userSettingsModal: true,
                  };
                  await routeNavigate(history, ROUTE_METHOD.PUSH, USER_SETTINGS, EMPTY_STRING, layoutState);
                  clearAlertPopOverStatus();
                }}
                onNoHandler={() => clearAlertPopOverStatus()}
                title={t(FORM_POPOVER_STRINGS.CLOSE_POPOVER)}
                subTitle={t(CUSTOMER_TOOLTIP.CHANGES_SAVED_AS_DRAFT)}
              />
            ),
          });
        } else {
          console.log('history.location.pathname', history.location.pathname);
          const layoutState = {
            // originalLocation: 'Home',
            userSettingsModal: true,
          };
          routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, EMPTY_STRING, layoutState);
        }
        break;
      case USER_PROFILE_DROPDOWN_INDEX.MY_DOWNLOADS:
        const { isDownloadNotificationsModalOpen, onDownloadWindowDataChange } =
          this.props;
        onDownloadWindowDataChange(
          'isDownloadNotificationsModalOpen',
          !isDownloadNotificationsModalOpen,
        );
        const layoutState = {
          isDownloadOpen: true,
        };
        routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, EMPTY_STRING, layoutState);
        break;
      case USER_PROFILE_DROPDOWN_INDEX.SIGN_OUT:
        e.preventDefault();
        this.signOutFunction();
        break;
      default:
        break;
    }
  };

  onCloseIconClick = () => {
    const { history } = this.props;
    const currentParams = jsUtils.get(queryString.parseUrl(history.location.pathname), ['query'], {});
    delete currentParams.create;
    const layoutSearchParams = new URLSearchParams(currentParams).toString();
    const layoutState = {
      createModalOpen: false,
    };
    routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, layoutSearchParams, layoutState);
  };

  redirectToSignOut(history) {
    sessionStorage.clear();
    routeNavigate(history, ROUTE_METHOD.REPLACE, SIGNIN, null, null, true);
  }

  closeChatWindowHandler = (threadId) => {
    const {
      selectedChatThreads,
      updateSelectedChatThreads,
    } = this.props;
    const selectedChatIndex = selectedChatThreads.findIndex((thread) => thread.threadId === threadId);
    if (selectedChatIndex > -1) {
      const data = selectedChatThreads[selectedChatIndex];
      updateSelectedChatThreads({
        chatThread: data,
        threadId,
        isClear: true,
      });
    }
  };

  notificationSocketListner = (userProfileData) => {
    const { history, getActiveTaskList } = this.props;
    userProfileData.notificationSocket.on(NOTIFICATION_SOCKET_EVENTS.ON_EVENTS.NOTIFICATION, (data) => {
      console.log('NotificationSocket dev', data, history.location.pathname, HOME, `${TASKS}/${OPEN_TASKS}`);
      const { notificationsDataChange, totalCount, getAllNotficationsApiCall, isNotificationsModalOpen } = this.props;
      const contextData = jsUtils.get(data, ['context'], '');
      if (NOTIFICATION_TASK_REFRESH_TYPES.includes(contextData)) {
        const page = 1;
        const currentHome = history.location.pathname === HOME;
        if (history.location.pathname === HOME || history.location.pathname === `${DEV_USER}${TASKS}/${OPEN_TASKS}`) {
          getActiveTaskList(
            {
              page: page,
              size: currentHome ? 3 : 15,
            },
            currentHome ? M_T_STRINGS.TASK_LIST.GET_TASK_LIST : M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST,
            history,
            true,
          );
        }
      }
      if (contextData !== NOTIFICATION_TYPES.DOCUMENT_UPDATE) {
        notificationsDataChange({ total_count: jsUtils.get(data, ['unread_count'], totalCount) });
      if (isNotificationsModalOpen) {
        const params = {
          page: 1,
          size: 10,
          is_read: 0,
        };
        getAllNotficationsApiCall(params);
      }
      }
      // Download Notification
      if (contextData === NOTIFICATION_TYPES.TASK.DOCUMENT_UPDATE || contextData === NOTIFICATION_TYPES.TASK.DOC_DOWNLOAD_COMPLETED) {
        const { onGetReportDownloadDocsThunk } = this.props;
        onGetReportDownloadDocsThunk();
      }
    });
    userProfileData.notificationSocket.on(NOTIFICATION_SOCKET_EVENTS.ON_EVENTS.UPDATE_COUNT, (data) => {
      const { notificationsDataChange, totalCount } = this.props;
      notificationsDataChange({ total_count: jsUtils.get(data, ['unread_count'], totalCount) });
      console.log('updated count via socket', data);
    });
    userProfileData.notificationSocket.on(NOTIFICATION_SOCKET_EVENTS.ON_EVENTS.READ_NOTIFICATION_FAILURE, (data) => {
      console.log('read failure via socket', data);
    });
  };

  recursiveNotificationSocketListener = () => {
    const userProfileData = getProfileDataForChat();
    if (userProfileData && userProfileData.notificationSocket) {
      this.notificationSocketListner(userProfileData);
    } else {
      setTimeout(this.recursiveNotificationSocketListener, 500);
    }
  };

  removeSocketListeners = () => {
    const userProfileData = getProfileDataForChat();
    if (userProfileData && userProfileData.notificationSocket) {
      const { notificationSocket } = userProfileData;
      notificationSocket.off(
        NOTIFICATION_SOCKET_EVENTS.ON_EVENTS.NOTIFICATION,
      );
  }
  };

  updateSelectedChatThreadsData = (threadId, updatedThreadData, isInitialLoad = false) => {
    const {
      selectedChatThreads,
      updateSelectedChatThreads,
    } = this.props;
    const index = selectedChatThreads.findIndex((thread) => thread.threadId === threadId);
    if (index > -1) {
      const data = {
        ...selectedChatThreads[index],
        ...updatedThreadData,
      };
      if (isInitialLoad && updatedThreadData.threadId) {
        data.threadId = updatedThreadData.threadId;
      }
      updateSelectedChatThreads(
        {
          threadId,
          chatThread: data,
          isUpdateThreadId: true,
        },
      );
    }
  };

  markMessagesAsRead = (threadId) => {
    const {
      chatThreads,
      updateChatThreads,
      selectedChatThreads,
      updateSelectedChatThreads,
    } = this.props;
    const index = chatThreads.findIndex((data) => data.threadId === threadId);
    if (index > -1) {
      chatThreads[index].notificationCount = 0;
      updateChatThreads({ chatThreads });
    }
    const selectedChatIndex = selectedChatThreads.findIndex((data) => data.threadId === threadId);
    if (selectedChatIndex > -1) {
      const data = selectedChatThreads[selectedChatIndex];
      data.notificationCount = 0;
      updateSelectedChatThreads({ threadId, chatThread: data, isUpdate: true });
    }
  };

  updateUserStatus = (data) => {
    const {
      chatThreads,
      selectedChatThreads,
      updateChatThreads,
      updateSelectedChatThreads,
    } = this.props;
    const { user, status } = data;
    const index = chatThreads.findIndex((data) => data.threadEmail === user);
    if (index > -1) {
      chatThreads[index] = {
        ...chatThreads[index],
        threadStatus: status,
      };
    }
    const selectedChatIndex = selectedChatThreads.findIndex((data) => data.threadEmail === user);
    if (selectedChatIndex > -1) {
      const data = selectedChatThreads[selectedChatIndex];
      const { threadId } = data;
      data.threadStatus = status;
      updateSelectedChatThreads({ threadId, chatThread: data, isUpdate: true });
    }
    updateChatThreads({ chatThreads });
  };

  updateUserStatusAfterJoiningChat = (opponentUser) => {
    const {
      chatThreads,
      updateChatThreads,
    } = this.props;
    const { user_id, status } = opponentUser;
    const index = chatThreads.findIndex((data) => data.userId === user_id);
    if (index > -1) {
      chatThreads[index] = {
        ...chatThreads[index],
        threadStatus: status,
      };
    }
    updateChatThreads({ chatThreads });
  };

  updateIncomingMessages = (messageObj, threadId, currentUser) => {
    const {
      chatThreads, selectedChatThreads,
      updateChatThreads, updateSelectedChatThreads,
    } = this.props;
    let reloadDataCountPerPage;
    let reloadChatThreads = false;
    const index = chatThreads.findIndex((data) => data.threadId === threadId);
    console.log('messageObj.user_id, currentUser', index);
    const messageFromOtherUser = !jsUtils.isEqual(messageObj.user_id, currentUser);
    if (index > -1) {
      if (messageFromOtherUser) {
        chatThreads[index] = {
          ...chatThreads[index],
          notificationCount: chatThreads[index].notificationCount + 1,
          threadStatus: true,
        };
      }
      const newChatThread = chatThreads.splice(index, 1);
      chatThreads.unshift(newChatThread[0]);
      console.log('newChatThread ', newChatThread, chatThreads);
    } else {
      reloadChatThreads = true;
      reloadDataCountPerPage = chatThreads.length + 1;
    }
    const selectedChatIndex = selectedChatThreads.findIndex((data) => data.threadId === threadId);
    if (selectedChatIndex > -1) {
      const data = selectedChatThreads[selectedChatIndex];
      const { message_list, notificationCount } = data;
      message_list.unshift(messageObj);
      data.message_list = message_list;
      data.notificationCount = notificationCount + 1;
      console.log({ threadId, chatThread: data, isUpdate: true, threadStatus: true }, 'dghsjgjsjgdsjgh');
      if (messageFromOtherUser) updateSelectedChatThreads({ threadId, chatThread: data, isUpdate: true, threadStatus: true });
      else updateSelectedChatThreads({ threadId, chatThread: data, isUpdate: true });
    }
    updateChatThreads({
      chatThreads,
      reloadChatThreads,
      reloadDataCountPerPage,
    });
  };

  removeTypingListItem = debounce((threadId, typingListIndex) => {
    const { selectedChatThreads, updateSelectedChatThreads } = this.props;
    const index = selectedChatThreads.findIndex((data) => ((data.threadId === threadId) || (data.threadEmail === threadId)));
    if (index > -1) {
      const data = selectedChatThreads[index];
      const { typing_list } = data;
      typing_list.splice(typingListIndex, 1);
      data.typing_list = typing_list;
      updateSelectedChatThreads({
        threadId,
        chatThread: data,
        isUpdate: true,
      });
    }
  }, 500);

  updateTypingList = (threadId, typingObj) => {
    const { selectedChatThreads, updateSelectedChatThreads } = this.props;
    const index = selectedChatThreads.findIndex((data) => ((data.threadId === threadId) || (data.threadEmail === threadId)));
    if (index > -1) {
      const data = selectedChatThreads[index];
      const { typing_list } = data;
      const typingListIndex = typing_list.length;
      if (!jsUtils.some(typing_list, { user: typingObj.user })) {
        typing_list.push(typingObj);
        data.typing_list = typing_list;
        this.removeTypingListItem(threadId, typingListIndex);
      } else {
        const typingListIndex = typing_list.findIndex((item) => (item.user === typingObj.user));
        this.removeTypingListItem(threadId, typingListIndex);
      }
      updateSelectedChatThreads({ threadId, chatThread: data, isUpdate: true });
    }
  };

  handleSignoutHandler = () => {
    const { history, profile, expiryClearOnSignOut } = this.props;
    expiryClearOnSignOut && expiryClearOnSignOut();

    if (profile && profile.notificationSocket) {
      this.removeSocketListeners();
      profile.notificationSocket.emit(NOTIFICATION_SOCKET_EVENTS.EMIT_EVENTS.DISCONNECT, (code, error) => {
        console.log('Notification Socket - Disconnecting User', code, error);
      });
      profile.notificationSocket.disconnect();
    }

    logoutClearUtil();
    this.redirectToSignOut(history);
  };

  signOutFunction = () => {
    axiosGetUtils(SIGN_OUT, {
      cancelToken: new CancelToken((c) => {
        cancelForSignOut = c;
      }),
      isSignOut: true,
    })
      .then(() => {
        this.handleSignoutHandler();
      })
      .catch(() => this.handleSignoutHandler());
  };

  toggleProfileDropdown = (boolean) => {
    const { setState } = this.props;
    setState({
      isUserProfileDropdownVisible: boolean,
    });
  };
}

Layout.contextType = ThemeContext;
const mapDispatchToProps = (dispatch) => {
  return {
    setState: (value) => {
      dispatch(layoutWithSidebarSetState(value));
    },
    clearRedux: (value) => {
      dispatch(logoutAction(value));
    },
    clearState: () => {
      dispatch(layoutWithSidebarClearState());
    },
    updateSelectedChatThreads: (data) => {
      dispatch(updateSelectedChatThreadsThunk(data));
    },
    updateChatThreads: (data) => {
      dispatch(getThreadsByUserSuccess(data));
    },
    clearAccountSettingCheck: () => {
      dispatch(clearAccountSettingModalShowCheck());
    },
    tryAgainHandle: (data) => dispatch(tryAgainBillingPayment(data)),
    navbarDataChange: (data) => dispatch(NavBarDataChange(data)),
    onGetReportDownloadDocsThunk: () => {
      dispatch(getReportDownloadDocsThunk());
    },
    notificationsDataChange: (data) => {
      dispatch(notificationsDataChangeAction(data));
    },
    getAllNotficationsApiCall: (params) => {
      dispatch(getAllNotficationsApiThunk(params));
      },
    getActiveTaskList: (params, type, history, isPeriodicCall) => {
      dispatch(getActiveTaskListDataThunk(params, type, history, isPeriodicCall));
    },
    onDownloadWindowDataChange: (id, value) => {
      dispatch(downloadWindowDataChange(id, value));
    },
    dispatch,
  };
};
const mapStateToProps = (state) => {
  return {
    state: state.LayoutWithSidebarReducer,
    role: state.RoleReducer.role,
    flowData: state.EditFlowReducer.flowData,
    dataListState: state.CreateDataListReducer,
    form_details: state.CreateDataListReducer.form_details,
    temporary_form_details: state.CreateDataListReducer.temporary_form_details,
    isNavbarOpen: state.NavBarReducer.isNavOpen,
    isNavVisible: state.NavBarReducer.isNavVisible,
    selectedChatThreads: state.ChatScreenReducer.selectedChatThreads,
    chatThreads: state.ChatScreenReducer.chatThreads,
    is_account_completed:
      state.AccountCompleteCheckReducer.is_account_completed_status,
    manual_account_complete:
      state.AccountCompleteCheckReducer.manual_completion,
    is_account_expired: state.AccountCompleteCheckReducer.is_account_expired,
    expiry_day_remaining: state.AccountCompleteCheckReducer.expiry_day_remaining,
    existing_account: state.AccountCompleteCheckReducer.already_existing_account,
    direct_pay: state.BillingModuleReducer.setPaymentMethod.is_direct_payment_method,
    acc_subscription_type: state.AccountCompleteCheckReducer.account_subscription_type,
    is_billing_card_verified: state.AccountCompleteCheckReducer.is_card_verified,
    isBillingUser: state.AccountCompleteCheckReducer.is_billing_user,
    displayFlowReportEdit: state.FlowDashboardReducer.displayReportEdit,
    displayDatalistReportEdit: state.DataListReducer.displayReportEdit,
    isTrialDisplayed: state.NavBarReducer.isTrialDisplayed,
    PaymentRedirectShow: state.BillingModuleReducer.PaymentRedirectShow,
    isDownloadNotificationsModalOpen: state.DownloadWindowReducer.isDownloadNotificationsModalOpen,
    isDownloadActivityOpen: state.DownloadWindowReducer.isDownloadActivityOpen,
    retryDownloadData: state.DownloadWindowReducer.retryDownloadData,
    totalCount: state.NotificationReducer.total_count,
    isNotificationsModalOpen: state.NotificationReducer.isNotificationsModalOpen,
    isMlTaskLoading: state.CreateTaskReducer.isMlTaskLoading,
    isMfaVerified: state.MfaReducer.isMfaVerified,
    isMfaEnabled: state.MfaReducer.isMfaEnabled,
    isMfaEnforced: state.MfaReducer.isMfaEnforced,
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Layout)));
Layout.defaultProps = {
  status: {},
  isUserSettingsModal: false,
};
Layout.propTypes = {
  isUserSettingsModal: PropTypes.bool,
  profile: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.objectOf])
    .isRequired,
  status: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  setState: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
  state: PropTypes.objectOf(PropTypes.any).isRequired,
};
