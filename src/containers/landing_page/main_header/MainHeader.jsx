import React, { useState, useEffect, useRef } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import MenuIcon from 'assets/icons/MenuIcon';
import { NavToggle } from 'redux/actions/NavBar.Action';
import { getUserPanelData } from 'redux/selectors/LandingPageSelctor';
import { MULTICATEGORY_SEARCH_TYPE } from 'utils/Constants';
import ADMIN_ACCOUNTS_STRINGS from 'containers/admin_panel/admin_pages/AdminPages.string';
import {
  ADMIN_ACCOUNTS_INITIAL, EDIT_INTEGRATION, INTEGRATIONS,
} from 'urls/RouteConstants';
import MultiCategorySearch from 'containers/multi_category_search/MultiCategorySearch';
import AdminHeaderLayout from 'containers/admin_settings/admin_header/AdminHeader';
import { isMobileScreen, keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { toggleNotificationsModalVisibility } from 'redux/reducer/NotificationsReducer';
import NotificationIcon from 'assets/icons/NotificationIcon';
import styles from './MainHeader.module.scss';
import CommonHeader from './common_header/CommonHeader';
import { LANDING_PAGE_TOPICS, MAIN_HEADER_SEARCHBAR, SIDE_NAV_BAR } from './common_header/CommonHeader.strings';
import ProfileDropdown from '../../application/header/profile_dropdown/ProfileDropdown';
import { EDIT_FLOW, FLOW_DASHBOARD, LIST_APPLICATION, LIST_FLOW } from '../../../urls/RouteConstants';
import SystemDirectory from '../../application/header/system_directory/SystemDirectory';

function useClickOutsideDetector(ref, closeModal) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        closeModal();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

function HomeHeader(props) {
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const [isClearSearch, setClearSearch] = useState(false);
  const [systemDirectoryModal, setSystemDirectoryModal] = useState(false);

  const wrapperRef = useRef(null);
  const closeSearchResults = () => {
    setClearSearch(true);
  };
  const resetClearSearch = () => {
    setClearSearch(false);
  };
  const toggleSystemDirectoryModal = () => setSystemDirectoryModal((p) => !p);

  useClickOutsideDetector(wrapperRef, closeSearchResults);
  const [header, setHeader] = useState(t(LANDING_PAGE_TOPICS.HOME));
  const {
    toggleFunction,
    toggleState,
    searchTextState,
    isSearchLoading,
    profileData,
    isImportFormModalVisible,
    taskResults,
    flowResults,
    datalistResults,
    userResults,
    teamResults,
    flowData,
    dataListState,
    toggleProfileDropdown,
    toggleNotificationsModal,
    totalCount,
    onUserProfileDropdownClickHandler,
    isShowAppTasks,
  } = props;
  const toggleNotification = () => {
    toggleNotificationsModal();
  };

  const [isHeaderDisplay, setIsHeaderDisplay] = useState(true);
  const profileDropDownRef = useRef(null);
  useClickOutsideDetector(profileDropDownRef, () => {
    toggleProfileDropdown(false);
  });

  const MenuToggle = () => {
    toggleFunction();
  };
  useEffect(() => {
    if (flowData.isFlowModalDisabled) {
      setIsHeaderDisplay(false);
    } else {
      setIsHeaderDisplay(true);
    }
  }, [flowData.isFlowModalDisabled]);

  useEffect(() => {
    if (history.location.pathname.includes('tasks')) setHeader(t(LANDING_PAGE_TOPICS.TASKS));
    else if (history.location.pathname.includes(`/${ADMIN_ACCOUNTS_INITIAL}`)) setHeader(t(ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.LABEL));
    else if (history.location.pathname.includes('data_list') || history.location.pathname.includes('/Datalist')) setHeader(t(LANDING_PAGE_TOPICS.DATALIST));
    else if (history.location.pathname.includes(FLOW_DASHBOARD) || history.location.pathname.includes(LIST_FLOW)) setHeader(t(LANDING_PAGE_TOPICS.FLOW));
    else if (history.location.pathname.includes('teams')) setHeader(t(LANDING_PAGE_TOPICS.TEAMS));
    else if (history.location.pathname.includes('users')) setHeader(t(LANDING_PAGE_TOPICS.USERS));
    else if (history.location.pathname.includes('all_users')) setHeader(t(LANDING_PAGE_TOPICS.USERS));
    else if (history.location.pathname.includes('admin_settings')) setHeader(t(LANDING_PAGE_TOPICS.ADMIN_SETTINGS));
    else if (history.location.pathname.includes('mlmodels')) setHeader(t(LANDING_PAGE_TOPICS.ML_MODELS));
    else if (history.location.pathname.includes(LIST_APPLICATION) || history.location.pathname.includes('editApp') || history.location.pathname.includes('createApp')) setHeader(t(LANDING_PAGE_TOPICS.APPLICATIONS));
    else setHeader(t(LANDING_PAGE_TOPICS.HOME));
    if ((history.location.pathname === EDIT_FLOW) || (history.location.pathname === '/createDatalist' && dataListState.isDataListModalDisabled) || (history.location.pathname === '/editDatalist')) {
      setIsHeaderDisplay(false);
    }
  }, [i18n.language]);
  useEffect(() => {
    if (history.location.pathname.includes('tasks')) setHeader(t(LANDING_PAGE_TOPICS.TASKS));
    else if (history.location.pathname.includes(`/${ADMIN_ACCOUNTS_INITIAL}`)) setHeader(t(ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.LABEL));
    else if (history.location.pathname.includes('users')) setHeader(t(LANDING_PAGE_TOPICS.USERS));
    else if (history.location.pathname.includes('data_list') || history.location.pathname.includes('/Datalist')) setHeader(t(LANDING_PAGE_TOPICS.DATALIST));
    else if (history.location.pathname.includes(FLOW_DASHBOARD) || history.location.pathname.includes(LIST_FLOW))setHeader(t(LANDING_PAGE_TOPICS.FLOW));
    else if (history.location.pathname.includes('teams')) setHeader(t(LANDING_PAGE_TOPICS.TEAMS));
    else if (history.location.pathname.includes('all_users')) setHeader(t(LANDING_PAGE_TOPICS.USERS));
    else if (history.location.pathname.includes(INTEGRATIONS)) setHeader(t(SIDE_NAV_BAR.INTEGRATION));
    else if (history.location.pathname.includes('mlmodels')) setHeader(t(LANDING_PAGE_TOPICS.ML_MODELS));
    else if (history.location.pathname.includes('admin_settings')) setHeader(t(LANDING_PAGE_TOPICS.ADMIN_SETTINGS));
    else if (history.location.pathname.includes('billing')) setHeader(t(LANDING_PAGE_TOPICS.BILLING));
    else if (history.location.pathname.includes('report')) setHeader(t(LANDING_PAGE_TOPICS.REPORTS));
    else if (history.location.pathname.includes(LIST_APPLICATION) || history.location.pathname.includes('editApp') || history.location.pathname.includes('createApp')) setHeader(t(LANDING_PAGE_TOPICS.APPLICATIONS));
    else setHeader(t(LANDING_PAGE_TOPICS.HOME));
    if ((history.location.pathname === EDIT_FLOW) || (history.location.pathname.includes(EDIT_INTEGRATION) && history.location.pathname.includes(INTEGRATIONS)) || (history.location.pathname === '/createDatalist' && dataListState.isDataListModalDisabled) || (history.location.pathname === '/editDatalist')) {
      setIsHeaderDisplay(false);
    } else {
      setIsHeaderDisplay(true);
    }
  }, [history.location.pathname, i18n.language]);

const checkIsAdmin = history.location.pathname.includes('admin_settings');
  return (
    <div
      className={cx(
        gClasses.Sticky,
        isImportFormModalVisible ? gClasses.ZIndex0 : gClasses.ZIndex7,
        styles.MainHeader,
        isHeaderDisplay ? null : gClasses.DisplayNone,
      )}
    >
      <div className={cx(gClasses.W100, gClasses.CenterV, styles.SubContainer)}>
        <div className={cx(gClasses.CenterV)}>
          {isMobileScreen() && toggleState && (
          <MenuIcon
            className={cx(
              gClasses.MR15,
              styles.DisplayMenu,
              gClasses.CursorPointer,
              styles.MenuToggleDisplay,
              styles.TransparentBtn,
            )}
            onClick={() => MenuToggle()}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && MenuToggle()}
            role={ARIA_ROLES.BUTTON}
            ariaExpanded={isMobileScreen() ? !toggleState : toggleState}
            ariaLabel="Menu"
            tabIndex={0}
          />
        )}
        </div>

        <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
        <div className={cx(BS.D_FLEX, BS.JC_END, styles.TopNav)}>
          {!checkIsAdmin ? <CommonHeader currentHeader={header} onUserProfileDropdownClickHandler={onUserProfileDropdownClickHandler} /> : <AdminHeaderLayout currentHeader={header} />}
        </div>
        {([
          t(LANDING_PAGE_TOPICS.HOME),
          t(LANDING_PAGE_TOPICS.REPORTS),
          t(LANDING_PAGE_TOPICS.TEAMS),
          t(LANDING_PAGE_TOPICS.INTEGRATION),
          t(LANDING_PAGE_TOPICS.ML_MODELS),
        ].includes(header)) && (
          <div className={gClasses.CenterV}>
            <div
              className={cx(
                styles.SearchContainer,
              )}
              ref={wrapperRef}
            >
              <MultiCategorySearch
                placeholder={t(MAIN_HEADER_SEARCHBAR.PLACEHOLDER)}
                perPageDataCount={5}
                searchType={MULTICATEGORY_SEARCH_TYPE.GLOBAL}
                searchText={searchTextState}
                isSearchLoading={isSearchLoading}
                searchResultData={[
                  taskResults,
                  flowResults,
                  datalistResults,
                  userResults,
                  teamResults,
                ]}
                resetClearSearch={resetClearSearch}
                isClearSearch={isClearSearch}
                useOnlyPopper={false}
                title="Search bar"
              />
              {profileData?.acc_logo && (
                <div className={styles.Divider} />
              )}
            </div>
          </div>
        )}
        <div
          className={cx(gClasses.PR10, BS.D_FLEX, gClasses.PL15, profileData?.acc_logo && styles.NotificationIconContainer)}
          onClick={toggleNotification}
          role="button"
          tabIndex={0}
          aria-label="notifications"
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && toggleNotification()}
        >
          <NotificationIcon
            className={cx(gClasses.CursorPointer, styles.NotificationIcon)}
            role={ARIA_ROLES.IMG}
          />
          {totalCount > 0 &&
          (
          <div className={cx(gClasses.FTwo10White, styles.NotificationCount, gClasses.CenterVH, gClasses.CursorPointer)}>
            {totalCount > 9 ? '9+' : totalCount}
          </div>
          )}
        </div>
        <ProfileDropdown
          onUserProfileDropdownClickHandler={
            onUserProfileDropdownClickHandler
          }
        />
        </div>
        {systemDirectoryModal && (
          <SystemDirectory closeFn={toggleSystemDirectoryModal} onCloseClickHandler={toggleSystemDirectoryModal} isShowAppTasks={isShowAppTasks} />
        )}
      </div>
    </div>
  );
}

const mapStateToprops = (state) => {
  return {
    stateDataList: state.CreateDataListReducer,
    toggleState: state.NavBarReducer.isNavOpen,
    isModalOpen: state.NavBarReducer.isModalOpen,
    commonHeader: state.NavBarReducer.commonHeader,
    profileData: getUserPanelData(state),
    isNavOpen: state.NavBarReducer.isNavVisible,
    isImportFormModalVisible: state.ImportFormReducer.isImportFormModalVisible,
    searchTextState: state.SearchResultsReducer.searchText,
    isSearchLoading: state.SearchResultsReducer.isSearchDataLoading,
    taskResults: state.SearchResultsReducer.taskResults,
    flowResults: state.SearchResultsReducer.flowResults,
    datalistResults: state.SearchResultsReducer.datalistResults,
    userResults: state.SearchResultsReducer.userResults,
    teamResults: state.SearchResultsReducer.teamResults,
    flowData: state.EditFlowReducer.flowData,
    dataListState: state.CreateDataListReducer,
    UserProfileData: state.UserProfileReducer,
    totalCount: state.NotificationReducer.total_count,
    isShowAppTasks: state.RoleReducer.is_show_app_tasks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleFunction: () => {
      dispatch(NavToggle());
    },
    toggleNotificationsModal: () => {
      dispatch(toggleNotificationsModalVisibility());
    },
  };
};

export default withRouter(
  connect(mapStateToprops, mapDispatchToProps)(HomeHeader),
);
