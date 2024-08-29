import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useSelector, connect } from 'react-redux';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { isMobileScreen, onWindowResize, clearAlertPopOverStatus, updateAlertPopverStatus, routeNavigate } from 'utils/UtilityFunctions';
import * as ROUTE_CONSTANTS from 'urls/RouteConstants';
import UpdateConfirmPopover from 'components/update_confirm_popover/UpdateConfirmPopover';
import Tooltip from 'components/tooltip/Tooltip';
import { getSubDomainName } from 'utils/jsUtility';
import { DATALIST_USERS } from 'urls/RouteConstants';
import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import { BILLING_NAV, MAIN_MENU_COMMON_STRINGS, NAVBAR_MENU_LIST, SUPER_ADMIN } from './MainMenu.string';
import styles from '../../LeftNavBar.module.scss';
import { ROLES, ROUTE_METHOD, WORKHALL_ADMIN_SUB_DOMAIN } from '../../../../../utils/Constants';
import { CREATE_APP, EDIT_APP, EDIT_FLOW, FLOW_DASHBOARD, LIST_APPLICATION, LIST_FLOW } from '../../../../../urls/RouteConstants';
import { EMPTY_STRING, FORM_POPOVER_STRINGS } from '../../../../../utils/strings/CommonStrings';
import { CUSTOMER_TOOLTIP } from '../../../../../components/form_components/pagination/Pagination.strings';
import { getDevRoutePath } from '../../../../../utils/UtilityFunctions';
import MenuTitleIcon from '../../../../../assets/icons/menu/MenuTitleMiniIcon';

function MainMenu(props) {
  const { changeCollapseState, isNavCollapsed, isBillingUser, acc_subscription_type, is_billing_card_verified, adminProfile, user_data_list_uuid } = props;
  const [isMobile, setIsMobile] = useState(isMobileScreen());
  const [isHover, setIsHover] = useState(false);
  const { t } = useTranslation();
  const windowResize = () => {
    setIsMobile(isMobileScreen());
  };

  const navData = NAVBAR_MENU_LIST(t, `${DATALIST_USERS}/${user_data_list_uuid}`);
  useEffect(() => {
    onWindowResize(windowResize);
    return () => window.removeEventListener('resize', windowResize);
  });
  const history = useHistory();
  const Role = useSelector((state) =>
  state.RoleReducer);
  const [activePath, setActivePath] = useState(1);
  useEffect(() => {
    setActivePath(history.location.pathname);
  }, []);
   useEffect(() => {
     try {
    if (history.location.pathname.includes('tasks')) setActivePath('/tasks/myTasks');
    else if ((history.location.pathname.includes('data_list') || history.location.pathname.includes('editDatalist') || history.location.pathname.includes('createDatalist'))) setActivePath('/data_lists/overview');
    else if (history.location.pathname.includes(FLOW_DASHBOARD) || history.location.pathname.includes(LIST_FLOW) || history.location.pathname.includes(EDIT_FLOW)) { setActivePath(ROUTE_CONSTANTS.LIST_FLOW + ROUTE_CONSTANTS.ALL_PUBLISHED_FLOWS); } else if (history.location.pathname.includes('teams')) setActivePath('/teams/public-teams');
    else if (history.location.pathname.includes('all_users')) setActivePath('/all_users/');
    else if (history.location.pathname.includes('admin_settings')) setActivePath('/admin_settings/account_settings');
    else if (history.location.pathname.includes('billing')) setActivePath('/billing');
    else if (history.location.pathname.includes(ROUTE_CONSTANTS.ADMIN_ACCOUNTS) || history.location.pathname.includes('/super-admin')) setActivePath('/super-admin/accounts');
    else if (history.location.pathname.includes('users')) {
      const { user_data_list_uuid } = props;
      setActivePath(`${DATALIST_USERS}/${user_data_list_uuid}`);
    } else if (history.location.pathname.includes('integration')) setActivePath(`${ROUTE_CONSTANTS.INTEGRATIONS}/${ROUTE_CONSTANTS.EXTERNAL_INTEGRATION}`);
    else if (history.location.pathname.includes('mlmodels')) setActivePath(ROUTE_CONSTANTS.ML_MODELS);
    else if (history.location.pathname.includes('model_details')) setActivePath(`${ROUTE_CONSTANTS.ML_MODELS}/${ROUTE_CONSTANTS.ML_MODEL_DETAIL}`);
    else if (history.location.pathname.includes('/dashboard')) setActivePath(ROUTE_CONSTANTS.DASHBOARD);
    else if (history.location.pathname.includes(ROUTE_CONSTANTS.REPORT) || history.location.pathname.includes(ROUTE_CONSTANTS.REPORT_LIST)) setActivePath(`/${ROUTE_CONSTANTS.REPORT_LIST}/${ROUTE_CONSTANTS.PUBLISHED_REPORT_LIST}`);
    else if (
      history.location.pathname.includes(LIST_APPLICATION) ||
      history.location.pathname.includes(EDIT_APP) || history.location.pathname.includes(CREATE_APP)
      ) setActivePath(ROUTE_CONSTANTS.LIST_APPLICATION + ROUTE_CONSTANTS.PUBLISHED_APP_LIST);
    else setActivePath('/');
} catch (error) { console.log(error); }
  }, [history.location]);

    const onclickHandler = (event, list) => {
      const { user_data_list_uuid } = props;
      event.preventDefault();
      console.log('history push', history);
      if (history.location.state && history.location.state.createModalOpen === true) {
        console.log('history push1');
        updateAlertPopverStatus({
          isVisible: true,
          customElement: (
            <UpdateConfirmPopover
              onYesHandler={async () => {
                const mainMenuState = {
                  originalLocation: EMPTY_STRING,
                  createModalOpen: false,
                  type: 'Right',
                };
                routeNavigate(history, ROUTE_METHOD.PUSH, list.PATH, EMPTY_STRING, mainMenuState);
                clearAlertPopOverStatus();
              }}
              onNoHandler={() => clearAlertPopOverStatus()}
              title={t(FORM_POPOVER_STRINGS.CLOSE_POPOVER)}
              subTitle={t(CUSTOMER_TOOLTIP.CHANGES_SAVED_AS_DRAFT)}
            />
          ),
        });
      } else {
        if (list.LABEL === 'Users') {
          const dataListUsersUUIDPathName = `${DATALIST_USERS}/${user_data_list_uuid}`;
          const mainMenuState = { _id: user_data_list_uuid, datalist_tab: 1, isUserDatalist: true };
          routeNavigate(history, ROUTE_METHOD.PUSH, dataListUsersUUIDPathName, EMPTY_STRING, mainMenuState);
        } else {
          routeNavigate(history, ROUTE_METHOD.PUSH, list.PATH);
        }
      }
      if (isMobile) changeCollapseState();
    };

  const generateList = (list) => {
    const _list = list;
    const navList = _list.map((navItem) => (
      <>
        {navItem.LABEL && (isNavCollapsed || isMobileScreen()) && (<Text className={cx(gClasses.MB24, gClasses.FTwo12GrayV86, gClasses.FontWeight500)} content={navItem.LABEL} />)}
        {navItem.LABEL && !isNavCollapsed && !isMobileScreen() && <MenuTitleIcon className={cx(gClasses.MB24, gClasses.ML2)} />}
        {navItem.MENU.map((navMenu) => (
          <div className={cx(styles.NavMenu)} key={navMenu.PATH}>
            <Link
              to={getDevRoutePath(navMenu.PATH)}
              id={`${navMenu.VALUE}`}
              onClick={(event) => onclickHandler(event, navMenu)}
              className={cx(styles.NavMenu, gClasses.PB24, { [styles.Active]: navMenu.PATH === activePath })}
            >
              <div className={gClasses.CenterV} aria-hidden={MAIN_MENU_COMMON_STRINGS.TRUE} key={navMenu.VALUE} id={`${MAIN_MENU_COMMON_STRINGS.NAVTOOLS}${navMenu.VALUE}`}>
                {navMenu.PATH === activePath ? navMenu.SELECTED_ICON : navMenu.ICON}
                {(isNavCollapsed || isMobileScreen()) && (<Text className={cx(gClasses.FTwo13, gClasses.FontWeight500, gClasses.ML16)} content={navMenu.LABEL} />)}
                {!isNavCollapsed && <Tooltip id={`${MAIN_MENU_COMMON_STRINGS.NAVTOOLS}${navMenu.VALUE}`} content={navMenu.LABEL} placement={MAIN_MENU_COMMON_STRINGS.PLACEMENT_LEFT} isCustomToolTip isNav />}
              </div>
            </Link>
          </div>
        ))}
      </>
    ));
    return navList;
  };
let NavigationMenu;
if (Role.role === ROLES.MEMBER) NavigationMenu = navData.MEMBERS;
else if (Role.role === ROLES.ADMIN) {
    NavigationMenu = navData.ADMIN;
} else if (Role.role === ROLES.FLOW_CREATOR) NavigationMenu = navData.FLOW_CREATOR;

if (isBillingUser && acc_subscription_type === MAIN_MENU_COMMON_STRINGS.SUBSCRIPTION && is_billing_card_verified) {
  NavigationMenu?.[2]?.MENU?.splice(1, 0, BILLING_NAV(t));
}

if (Role.role === ROLES.ADMIN && ((getSubDomainName(window.location.hostname) === WORKHALL_ADMIN_SUB_DOMAIN) || (adminProfile && (adminProfile.account_domain === WORKHALL_ADMIN_SUB_DOMAIN)))) {
  const isBillingIconPresent = (isBillingUser && acc_subscription_type === MAIN_MENU_COMMON_STRINGS.SUBSCRIPTION && is_billing_card_verified);
  const insertIndex = (isBillingIconPresent ? 2 : 1);
  NavigationMenu?.[2]?.MENU?.splice(insertIndex, 0, SUPER_ADMIN(t));
}

const uTNavItemList = generateList(NavigationMenu);

return (
    <div
      className={cx(isHover ? gClasses.OverflowYAuto : gClasses.OverflowYHiddenImportant, ((!isNavCollapsed || isMobileScreen()) ? gClasses.PL30 : gClasses.PL24), gClasses.MT24, gClasses.PositionRelative)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {uTNavItemList}
    </div>
);
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.FloatingActionMenuStartSectionReducer.isLoading,
    isDataLoading: state.FlowListReducer.isDataLoading,
    isTaskDataLoading: state.TaskReducer.isTaskDataLoading,
    isDataListLoading: state.DataListReducer.isLandingPageOtherDataListLoading,
    isBillingUser: state.AccountCompleteCheckReducer.is_billing_user,
    acc_subscription_type: state.AccountCompleteCheckReducer.account_subscription_type,
    is_billing_card_verified: state.AccountCompleteCheckReducer.is_card_verified,
    user_data_list_uuid: state.UserProfileReducer.user_data_list_uuid,
    adminProfile: state.AdminProfileReducer.adminProfile,
  };
};
export default connect(mapStateToProps)(MainMenu);
