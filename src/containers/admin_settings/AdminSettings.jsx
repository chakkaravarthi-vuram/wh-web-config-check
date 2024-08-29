import React, { useState, useEffect, lazy } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import gClasses from 'scss/Typography.module.scss';
import { NavBarDataChange } from 'redux/actions/NavBar.Action';
// import { BS } from 'utils/UIConstants';
import { adminSettingsStateChange } from 'redux/actions/AdminSettings.Action ';
import Tab, { TAB_TYPE } from 'components/tab/Tab';
import { navigator, getTabUrl } from 'containers/landing_page/main_header/common_header/CommonHeader.utils';
// import { isMobileScreen, onWindowResize } from '../../utils/UtilityFunctions';
import styles from './AdminSettings.module.scss';
import { ADMIN_SETTINGS_TAB_INDEX, ADMIN_SETTINGS_NAVBAR_STRINGS, SETTINGS_TAB_DATA } from './AdminSettings.strings';
import { ADMIN_SETTINGS_CONSTANT } from './AdminSettings.constant';

// import { ACCOUNT_SETTINGS,
//   LIBRARY_MANAGEMENT,
//   LANGUAGE_CALENDAR,
//   OTHER_SETTINGS,
//   NOTICE_BOARD_SETTINGS,
//   ADMIN_SETTINGS as ADMIN_SETTINGS_URL,
//  } from '../../urls/RouteConstants';

// lazy imports
const AccountSettings = lazy(() => import('./account_settings/AccountSettings'));
const LanguagesAndCalendar = lazy(() => import('./language_and_calendar/LanguagesAndCalendar'));
const UserManagement = lazy(() => import('./user_management/UserManagement'));
const OtherSettings = lazy(() => import('./other_settings/OtherSettings'));
const LookUpManagement = lazy(() => import('./look_up_management/LookUpManagement'));
const CoverContentSettings = lazy(() => import('./cover_content_settings/CoverContentSettings'));
const UsageDashboard = lazy(() => import('./UsageDashBoard/UsageDashBoard'));
const AuthenticationSettings = lazy(() => import('./authentication_settings/AuthenticationSettings'));

function AdminSettings(props) {
  const { navbarChange, currentTabIndex, tabChange } = props;
  const [selectedTabIndex, setTabIndex] = useState(ADMIN_SETTINGS_TAB_INDEX.ACCOUNT_SETTINGS);
  const { t } = useTranslation();
  // const [isMobile, setIsMobile] = useState(isMobileScreen());
  // const [tab_index, setTabIndex] = useState(ADMIN_SETTINGS_TAB_INDEX.ACCOUNT_SETTINGS);
  let current_component = null;
  let commonSubHeader = null;
  // let getAdminSettingsUrl = null;
  // const onTabChange = (index) => {
  //   setTabIndex(index);
  useEffect(() => {
    setTabIndex(currentTabIndex);
  }, [currentTabIndex]);
  // };
  const history = useHistory();

  switch (currentTabIndex) {
    case ADMIN_SETTINGS_TAB_INDEX.ACCOUNT_SETTINGS:
      current_component = <AccountSettings />;
      break;
    case ADMIN_SETTINGS_TAB_INDEX.COVER_SETTINGS:
      current_component = <CoverContentSettings />;
      break;
    case ADMIN_SETTINGS_TAB_INDEX.USER_MANAGEMENT:
      current_component = <UserManagement />;
      break;
    case ADMIN_SETTINGS_TAB_INDEX.LANGUAGE_AND_CALENDAR:
      current_component = <LanguagesAndCalendar />;
      break;
    case ADMIN_SETTINGS_TAB_INDEX.OTHER_SETTINGS:
      current_component = <OtherSettings />;
      break;
    case ADMIN_SETTINGS_TAB_INDEX.AUTHENTICATION:
      current_component = <AuthenticationSettings />;
      break;
    case ADMIN_SETTINGS_TAB_INDEX.LOOK_UP_MANAGEMENT:
      current_component = <LookUpManagement />;
      break;
    case ADMIN_SETTINGS_TAB_INDEX.USAGE_DASHBOARD:
      current_component = <UsageDashboard />;
      break;
    default:
      break;
  }

  // const onNavClick = (e, navValue) => {
  //   e.preventDefault();
  //   tabChange(navValue);
  //   history.push(`${ADMIN_SETTINGS_URL}${getAdminSettingsUrl(navValue)}`);
  // };

  // getAdminSettingsUrl = (selectedCardTab) => {
  //   if (selectedCardTab === 4) return LIBRARY_MANAGEMENT;
  //   if (selectedCardTab === 5) return LANGUAGE_CALENDAR;
  //   if (selectedCardTab === 6) return OTHER_SETTINGS;
  //   if (selectedCardTab === 7) return NOTICE_BOARD_SETTINGS;
  //   return ACCOUNT_SETTINGS;
  // };
  commonSubHeader = currentTabIndex !== 2 && currentTabIndex !== 3 && currentTabIndex !== 4 ? (
    <div>
      <p className={cx(styles.SubCommonHeaderTitle, gClasses.HeadingTitle2, gClasses.PL24)}>{t(ADMIN_SETTINGS_CONSTANT.SETTINGS.TITLE)}</p>
    </div>
  ) : null;
  const onTabSettingsChange = (indexData) => {
    setTabIndex(indexData);
    tabChange(indexData);
    const settingsURL = getTabUrl('admin_settings', { value: indexData }, t);
    navigator(history, settingsURL);
  };

  // const windowResize = () => {
  //   setIsMobile(isMobileScreen());
  // };

  // useEffect(() => {
  //   onWindowResize(windowResize);
  //   return () => window.removeEventListener('resize', windowResize);
  // });

  const NavBarValues = SETTINGS_TAB_DATA && currentTabIndex !== 2 && currentTabIndex !== 3 && currentTabIndex !== 4 ? (
    <Tab
      selectedIndex={selectedTabIndex}
      tabIList={SETTINGS_TAB_DATA(t)}
      type={TAB_TYPE.TYPE_7}
      setTab={onTabSettingsChange}
      tabTextClassName={cx(gClasses.MT4, gClasses.FS13, styles.AdminTab)}
    />) : null;
  useEffect(() => {
    navbarChange({
      commonHeader: {
        tabOptions: ADMIN_SETTINGS_NAVBAR_STRINGS,
        button: null,
      },
    });
    return () => {
      tabChange(ADMIN_SETTINGS_TAB_INDEX.ACCOUNT_SETTINGS);
    };
  }, []);
  return (
    // <StepperPage
    //   className={styles.StepperPage}
    //   rightSideContainerClasses={styles.StepperPageRightSide}
    //   title={ADMIN_SETTINGS.TITLE}
    //   stepperList={ADMIN_SETTINGS_TABS}
    //   onTabClick={onTabChange}
    //   currentComponent={current_component}
    //   selectedTab={tab_index}
    //   isAdminSettingsView
    //   enableCurrentTabTitles
    // />
    // <h1>Admin</h1>
    <>
      {/* <div className={styles.MiniHeaderContainer}>

    </div> */}
      {/* <div className={cx(BS.D_FLEX)}>
        <Tab
          selectedIndex={tab_index}
          tabIList={admin_tab_list}
          type={TAB_TYPE.TYPE_7}
          tabTextClassName={styles.TabTextClassName}
          setTab={onTabChange}
        />
      </div> */}

      {/* <div className={styles.StepperPage}> */}
      {commonSubHeader}
      {NavBarValues && (
        <div className={styles.NavBarValues}>
          {NavBarValues}
        </div>
      )}
      {current_component}
      {/* <UserManagement containerMarginStyles={styles.ContainerMarginStyles} /> */}
      {/* <UsageDashBoard /> */}
      {/* <AccountSettings /> */}
      {/* <LanguagesAndCalendar /> */}
      {/* <CoverContentSettings /> */}
      {/* <OtherSettings /> */}
      {/* <LookUpManagement /> */}
      {/* </div> */}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    currentTabIndex: state.AdminSettingsReducer.admin_setting_tab_index,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navbarChange: (data) => {
      dispatch(NavBarDataChange(data));
    },
    tabChange: (data) => dispatch(adminSettingsStateChange(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminSettings);
