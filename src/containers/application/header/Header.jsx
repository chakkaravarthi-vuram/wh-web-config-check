import cx from 'classnames';
import queryString from 'query-string';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllSearchApiThunk, getSearchInitialState, SearchTextChange } from 'redux/actions/SearchResults.Action';
import { connect, useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  EButtonIconPosition,
  EButtonSizeType,
  EButtonType,
  ETextSize,
  Tab,
  Text,
  SingleDropdown,
  ColorVariant,
  Variant,
  Tooltip,
  ETooltipType,
  ETooltipPlacements,
} from '@workhall-pvt-lmt/wh-ui-library';
import axios from 'axios';
import MultiCategorySearch from 'containers/multi_category_search/MultiCategorySearch';
import { getUserPanelData } from 'redux/selectors/LandingPageSelctor';
import { get } from 'utils/jsUtility';
import i18next from 'i18next';
import ThemeContext from '../../../hoc/ThemeContext';
import BellIconNew from '../../../assets/icons/BellIconNew';
import FileHeartIcon from '../../../assets/icons/FileHeartIcon';
import PlusIcon from '../../../assets/icons/PlusIcon';
import SearchIconNew from '../../../assets/icons/SearchIconNew';
import gClasses from '../../../scss/Typography.module.scss';
import { toggleNotificationsModalVisibility } from '../../../redux/reducer/NotificationsReducer';
import {
  CREATE,
  MODULE_TYPES,
  MULTICATEGORY_SEARCH_TYPE,
  NOTIFICATION_SOCKET_EVENTS,
  REDIRECTED_FROM,
  ROUTE_METHOD,
} from '../../../utils/Constants';
import { MAIN_HEADER_SEARCHBAR } from '../../landing_page/main_header/common_header/CommonHeader.strings';
import PageNav from './page_nav/PageNav';
import ProfileDropdown from './profile_dropdown/ProfileDropdown';
import SystemDirectory from './system_directory/SystemDirectory';
import { APP, CREATE_EDIT_TASK, DEFAULT_APP_ROUTE, SIGNIN, USER_SETTINGS } from '../../../urls/RouteConstants';
import styles from './Header.module.scss';
import { ARIA_ROLES, BS, COLOR_CONSTANTS } from '../../../utils/UIConstants';
import jsUtility, { cloneDeep, isEmpty, unset } from '../../../utils/jsUtility';
import { USER_PROFILE_DROPDOWN_INDEX } from '../../../components/logged_in_nav_bar/LoggedInNavbar';
import {
  clearAlertPopOverStatus,
  getProfileDataForChat,
  logoutClearUtil,
  updateAlertPopverStatus,
  useClickOutsideDetector,
  getRouteLink,
  routeNavigate,
} from '../../../utils/UtilityFunctions';
import UpdateConfirmPopover from '../../../components/update_confirm_popover/UpdateConfirmPopover';
import { downloadWindowDataChange } from '../../../redux/reducer/DownloadWindowReducer';
import { SIGN_OUT } from '../../../urls/ApiUrls';
import { axiosGetUtils } from '../../../axios/AxiosHelper';
import { getProfileByRole } from '../../../redux/selectors/LandingPageSelctor';
import {
  EMPTY_STRING,
  FORM_POPOVER_STRINGS,
} from '../../../utils/strings/CommonStrings';
import { HEADER_STRINGS } from './header.utils';
import { COUNT_NINE_PLUS, STATIC_CHIP_LIST } from '../application.strings';
import AppHeaderDropdownIcon from '../../../assets/icons/app_builder_icons/AppHeaderDropdownArrow';
import { APP_HEADER_DISPLAY, DEFAULT_APP_NAME } from '../app_listing/app_header_settings/AppHeaderSettings.string';
import { applicationStateChange } from '../../../redux/reducer/ApplicationReducer';
import HeaderHamburgerIcon from '../../../assets/icons/HeaderHamburger';
import AppSelection from './app_selection/AppSelection';
import ResponsiveProfile from './responsive_profile/ResponsiveProfile';
import ResponsiveSearch from './responsive_search/ResponsiveSearch';
import Copilot from '../../copilot/Copilot';

const { CancelToken } = axios;
let cancelForSignOut;

function Header(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const { colorScheme } = useContext(ThemeContext);
  const {
    searchTextState,
    isSearchLoading,
    taskResults,
    flowResults,
    datalistResults,
    userResults,
    teamResults,
    appDetails = [],
    isHome,
    onDownloadWindowDataChange,
    isDownloadNotificationsModalOpen,
    state,
    notificationCount,
    activeAppDataPages,
    headerType,
    isShowAppTasks,
    isCopilotEnabled,
    applicationStateChange,
    getGlobalSearch,
    seacrhTextChange,
    clearSearchResult,
  } = props;
  const [selectedPageDropdown, setSelectedPageDropdown] = useState(EMPTY_STRING);
  const appCurrentPageData = routeNavigate(`${APP}${params?.app_name}${activeAppDataPages?.[0]?.url_path}`, history);
  const [isClearSearch, setClearSearch] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [systemDirectoryModal, setSystemDirectoryModal] = useState(false);
  const [isAppSelectionOpen, setIsAppSelectionOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { BRAND_LOGO_ALT_TEXT } = HEADER_STRINGS;
  const isDisplayMultipleApp = jsUtility.isEqual(
    headerType,
    APP_HEADER_DISPLAY.MULTIPLE,
  );

  const onCloseClickHandler = () => {
    setSystemDirectoryModal(false);
    const state = location?.state || {};
    unset(state, [STATIC_CHIP_LIST.KEYS.TAB_INDEX]);
    unset(state, [STATIC_CHIP_LIST.KEYS.SHOW_SYSTEM_DIRECTORY]);
    history.push(history?.location?.path, state);
  };

  useEffect(() => {
    setSelectedPageDropdown(appCurrentPageData);
  }, [appCurrentPageData]);

  useEffect(() => {
    () => {
      if (cancelForSignOut) cancelForSignOut();
    };
  }, [location.pathname]);

  useEffect(() => {
    setSystemDirectoryModal(location?.state?.showSystemDirectory);
  }, [location?.state?.showSystemDirectory]);

  const toggleSearch = () => setToggle((p) => !p);
  const wrapperRef = useRef(null);
  const closeSearchResults = () => {
    setClearSearch(true);
  };
  useClickOutsideDetector(wrapperRef, closeSearchResults);
  const resetClearSearch = () => setClearSearch(false);
  const toggleSystemDirectoryModal = () => setSystemDirectoryModal((p) => !p);

  const createButtonClicked = () => {
    const currentParams = queryString.parseUrl(history.location.pathname);
    const newParams = {
      ...get(currentParams, ['query'], {}),
      [CREATE]: MODULE_TYPES.TASK,
    };
    history.replace({
      search: new URLSearchParams(newParams).toString(),
      state: {
        redirectedFrom: REDIRECTED_FROM.CREATE_GLOBAL_TASK,
      },
    });
  };

  const toggleNotification = () => {
    dispatch(toggleNotificationsModalVisibility());
  };
  const getDefaultAppName = (data) => {
    if (data === 'Default') {
      return i18next.t(DEFAULT_APP_NAME);
    } else {
      return data;
    }
    };
  const getTabOptionList = () => {
    const arrAppLink = [];
    if (appDetails && jsUtility.isArray(appDetails) && appDetails.length > 0) {
      appDetails.forEach((linkData) => {
        const value = getRouteLink(
          `${APP}${linkData?.url_path}/${get(
            linkData,
            ['pages', 0, 'url_path'],
            null,
          )}`,
          history,
        );
        if (isDisplayMultipleApp) {
          arrAppLink.push({
            labelText: getDefaultAppName(linkData?.name),
            value,
            tabIndex: getRouteLink(`${APP}${linkData?.url_path}`, history),
            isEditable: false,
            isSystemDefinedApp: linkData?.is_system_defined,
          });
        } else {
          arrAppLink.push({
            label: getDefaultAppName(linkData?.name),
            value,
            tabIndex: getRouteLink(`${APP}${linkData?.url_path}`, history),
            isSystemDefinedApp: linkData?.is_system_defined,
          });
        }
      });
    }
    return arrAppLink;
  };

  const tabOptionList = getTabOptionList();

  const onClickTabChange = (tabValue) => {
    setSelectedPageDropdown(tabValue);
    routeNavigate(history, ROUTE_METHOD.PUSH, tabValue, null, null);
  };

  const removeSocketListeners = () => {
    const userProfileData = getProfileDataForChat();
    if (userProfileData && userProfileData.notificationSocket) {
      const { notificationSocket } = userProfileData;
      notificationSocket.off(NOTIFICATION_SOCKET_EVENTS.ON_EVENTS.NOTIFICATION);
    }
  };

  const redirectToSignOut = (history) => {
    sessionStorage.clear();
    routeNavigate(history, ROUTE_METHOD.REPLACE, SIGNIN, null, null, true);
  };

  const handleSignoutHandler = () => {
    const profile = getProfileDataForChat();
    if (profile && profile.notificationSocket) {
      removeSocketListeners();
      profile.notificationSocket.emit(
        NOTIFICATION_SOCKET_EVENTS.EMIT_EVENTS.DISCONNECT,
        (code, error) => {
          console.log('Notification Socket - Disconnecting User', code, error);
        },
      );
      profile.notificationSocket.disconnect();
    }

    logoutClearUtil();
    redirectToSignOut(history);
  };

  const signOutFunction = () => {
    axiosGetUtils(SIGN_OUT, {
      cancelToken: new CancelToken((c) => {
        cancelForSignOut = c;
      }),
      isSignOut: true,
    })
      .then(() => {
        handleSignoutHandler();
      })
      .catch(() => handleSignoutHandler());
  };

  const profile = getProfileByRole(state);

  const onUserProfileDropdownClickHandler = (id, e) => {
    switch (id) {
      case USER_PROFILE_DROPDOWN_INDEX.LANGUAGE_TIME_ZONE:
        if (history.location.pathname === CREATE_EDIT_TASK) {
          updateAlertPopverStatus({
            isVisible: true,
            customElement: (
              <UpdateConfirmPopover
                onYesHandler={async () => {
                  const userSettingsPathName = USER_SETTINGS;
                  const userSettingsState = {
                    // originalLocation: 'Home',
                    userSettingsModal: true,
                  };
                  await routeNavigate(
                    history,
                    ROUTE_METHOD.PUSH,
                    userSettingsPathName,
                    null,
                    userSettingsState,
                  );
                  clearAlertPopOverStatus();
                }}
                onNoHandler={() => clearAlertPopOverStatus()}
                title={t(FORM_POPOVER_STRINGS.CLOSE_POPOVER)}
                subTitle={t(HEADER_STRINGS.SAVED_CHANGES_AS_DRAFT)}
              />
            ),
          });
        } else {
          console.log('history.location.pathname', history.location.pathname);
          const userSettingsModalState = {
            userSettingsModal: true,
          };
          routeNavigate(
            history,
            ROUTE_METHOD.PUSH,
            null,
            null,
            userSettingsModalState,
          );
        }
        break;
      case USER_PROFILE_DROPDOWN_INDEX.MY_DOWNLOADS:
        onDownloadWindowDataChange(
          'isDownloadNotificationsModalOpen',
          !isDownloadNotificationsModalOpen,
        );
        const myDownloadsState = {
          isDownloadOpen: true,
        };
        routeNavigate(history, ROUTE_METHOD.PUSH, null, null, myDownloadsState);
        break;
      case USER_PROFILE_DROPDOWN_INDEX.SIGN_OUT:
        e.preventDefault();
        signOutFunction();
        break;
      default:
        break;
    }
  };

  const getSelectedValue = (isValue, returnSelectedTab = false) => {
    const url = get(history, ['location', 'pathname'], EMPTY_STRING);
    const appOptionList = cloneDeep(tabOptionList);
    const appUrl = url.substr(0, url?.lastIndexOf('/')) || EMPTY_STRING;
    let selectedTab = appOptionList.filter((eachTabOption) => appUrl === eachTabOption?.tabIndex)?.[0] || [];
    if (isEmpty(selectedTab)) {
      const homeTab = appOptionList.filter((eachOption) => eachOption.value === DEFAULT_APP_ROUTE);
      selectedTab = homeTab?.[0];
    }
    if (returnSelectedTab) {
      if (selectedTab) return selectedTab;
      else return get(tabOptionList, [0], null);
    }

    if (selectedTab) return isValue ? selectedTab?.tabIndex : selectedTab?.value;
    if (!url.includes(APP)) {
      const defaultApp = tabOptionList.find((list) => list.isSystemDefinedApp);
      if (!isEmpty(defaultApp)) {
        return isValue ? get(defaultApp, 'tabIndex', null) : get(defaultApp, 'value', null);
      }
     }
    return isValue
      ? get(tabOptionList, [0, 'tabIndex'], null)
      : get(tabOptionList, [0, 'value'], null);
  };

  useEffect(() => {
    const selectedTab = getSelectedValue(false, true);
    applicationStateChange({
      isSystemDefinedApp: selectedTab?.isSystemDefinedApp || false,
    });
  }, [selectedPageDropdown, appDetails?.length]);

  return (
    <>
      <div
        className={styles.Header}
        style={{ backgroundColor: colorScheme?.highlight }}
      >
        <div className={cx(styles.Overlay, styles.AllPageHeight)} />
        <div className={cx(styles.HeaderContent)}>
          <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
            <div className={cx(styles.ImagePlaceholder)}>
              <img src={profile?.acc_logo} className={styles.Logo} alt={BRAND_LOGO_ALT_TEXT} />
            </div>
            <HeaderHamburgerIcon className={styles.HamburgerIcon} onClick={() => setIsAppSelectionOpen(true)} />
            <div className={cx(styles.NavLeft, styles.ResponsiveHide)}>
              {isDisplayMultipleApp && <Tab
                className={cx(gClasses.PT16)}
                options={tabOptionList}
                selectedTabIndex={getSelectedValue(true)}
                onClick={(tabValue) => onClickTabChange(tabValue)}
                textClass={styles.TabText}
                colorScheme={colorScheme}
                tabDisplayCount={3}
                bottomSelectionClass={styles.BottomClass}
                onPopperOptionSelect={onClickTabChange}
                selectedPopperData={selectedPageDropdown}
                moreComponent={
                  <div className={cx(BS.D_FLEX)}>
                    <Text
                      content={t(HEADER_STRINGS.MORE)}
                      className={cx(styles.TabText, styles.MoreButton)}
                      fontClass={gClasses.FontWeight500}
                      size={ETextSize.MD}
                    />
                    <AppHeaderDropdownIcon className={styles.MoreArrow} />
                  </div>
                }
                morePopperProps={{ className: styles.MorePopper }}
                moreDropdownProps={{
                  searchProps: {
                    searchValue: EMPTY_STRING,
                      searchPlaceholder: t(HEADER_STRINGS.APP_DROPDOWN.SEARCH_PLACEHOLDER),
                      removeSearchIcon: true,
                  },
                  noDataFoundMessage: t(HEADER_STRINGS.APP_DROPDOWN.NO_APPS_FOUND),
                }}
              />}
              {!isDisplayMultipleApp && (
                <PageNav isDisplayMultipleApp={isDisplayMultipleApp} isHome={isHome} appDetails={appDetails} />
              )}
            </div>
          </div>
          <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.Gap16, gClasses.PositionRelative)}>
            {console.log('gdasgdasgdasg', getSelectedValue(false), tabOptionList)}
            {!isDisplayMultipleApp && (
              <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, styles.ResponsiveHide)}>
                <SingleDropdown
                  optionList={tabOptionList}
                  selectedValue={getSelectedValue(false)}
                  onClick={onClickTabChange}
                  dropdownViewProps={{
                    className: styles.AppDropDown,
                    colorScheme: { activeColor: COLOR_CONSTANTS.WHITE },
                    colorVariant: ColorVariant.fill,
                    variant: Variant.borderLess,
                  }}
                  searchProps={{
                    searchValue: EMPTY_STRING,
                    searchPlaceholder: t(HEADER_STRINGS.APP_DROPDOWN.SEARCH_PLACEHOLDER),
                    removeSearchIcon: true,
                  }}
                  noDataFoundMessage={t(HEADER_STRINGS.APP_DROPDOWN.NO_APPS_FOUND)}
                  getPopperContainerClassName={(isOpen) =>
                    isOpen ? styles.AppDropDownPopper : EMPTY_STRING
                  }
                />
                <div className={cx(styles.Divider, styles.ResponsiveHide)} />
              </div>
            )}
           {!isCopilotEnabled ? (
              <div className={styles.SearchContainer}>
                {!toggle && (
                    <Tooltip
                      id={t(MAIN_HEADER_SEARCHBAR.ID)}
                      text={t(MAIN_HEADER_SEARCHBAR.PLACEHOLDER)}
                      tooltipType={ETooltipType.INFO}
                      tooltipPlacement={ETooltipPlacements.BOTTOM}
                      icon={
                      <SearchIconNew
                        id={t(MAIN_HEADER_SEARCHBAR.ID)}
                        className={styles.Icon}
                        role={ARIA_ROLES.BUTTON}
                        tabIndex={0}
                        ariaLabel={t(HEADER_STRINGS.ARIA_LABEL.SEARCH)}
                        onClick={toggleSearch}
                        onKeyDown={toggleSearch}
                      />}
                    />
                )}
                {toggle && (
                  <div className={cx(styles.SearchContainer)} ref={wrapperRef}>
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
                      title={t(HEADER_STRINGS.SEARCH_BAR_LABEL)}
                      fromAppHeader
                      showSearch={toggle}
                      searchIcon={
                        <Tooltip
                          id={t(MAIN_HEADER_SEARCHBAR.ID)}
                          text={t(MAIN_HEADER_SEARCHBAR.PLACEHOLDER)}
                          tooltipType={ETooltipType.INFO}
                          tooltipPlacement={ETooltipPlacements.BOTTOM}
                          icon={
                            <SearchIconNew
                              id={t(MAIN_HEADER_SEARCHBAR.ID)}
                              className={cx(gClasses.MR8, styles.Icon)}
                              role={ARIA_ROLES.BUTTON}
                              onClick={toggleSearch}
                              onKeyDown={toggleSearch}
                              tabIndex={0}
                              ariaLabel={t(HEADER_STRINGS.ARIA_LABEL.SEARCH)}
                            />}
                        />
                      }
                      closeFn={() => setToggle(false)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <Copilot />
            )}
            {isShowAppTasks && (
              <Tooltip
                id={HEADER_STRINGS.TASK_ID}
                text={t(HEADER_STRINGS.TASK)}
                tooltipType={ETooltipType.INFO}
                tooltipPlacement={ETooltipPlacements.BOTTOM}
                icon={
                <Button
                  id={HEADER_STRINGS.TASK_ID}
                  className={styles.CreateTask}
                  type={EButtonType.PRIMARY}
                  size={EButtonSizeType.SM}
                  icon={<PlusIcon className={cx(gClasses.MT3, gClasses.ML3)} />}
                  iconPosition={EButtonIconPosition.LEFT}
                  onClickHandler={createButtonClicked}
                  colorSchema={colorScheme}
                />}
              />
            )}
            <Tooltip
              id={HEADER_STRINGS.SYSTEM_DIRECTORY.ID}
              text={t(HEADER_STRINGS.SYSTEM_DIRECTORY.LABEL)}
              tooltipType={ETooltipType.INFO}
              tooltipPlacement={ETooltipPlacements.BOTTOM}
              icon={
              <FileHeartIcon
                id={HEADER_STRINGS.SYSTEM_DIRECTORY.ID}
                className={styles.SystemDirectoryIcon}
                role={ARIA_ROLES.BUTTON}
                tabIndex={0}
                ariaLabel={t(HEADER_STRINGS.ARIA_LABEL.SEARCH)}
                onClick={toggleSystemDirectoryModal}
                onKeyDown={toggleSystemDirectoryModal}
              />}
            />
            <button
              className={cx(BS.P_RELATIVE, styles.ButtonIcon)}
              ariaLabel={t(HEADER_STRINGS.ARIA_LABEL.NOTIFICATIONS)}
              onClick={() => toggleNotification()}
              id={HEADER_STRINGS.NOTIFICATION.ID}
            >
              <Tooltip
                id={HEADER_STRINGS.NOTIFICATION.ID}
                text={t(HEADER_STRINGS.NOTIFICATION.LABEL)}
                tooltipType={ETooltipType.INFO}
                tooltipPlacement={ETooltipPlacements.BOTTOM}
                icon={<BellIconNew />}
              />
              {notificationCount > 0 && (
                <div
                  className={cx(
                    gClasses.FTwo10White,
                    BS.P_ABSOLUTE,
                    styles.NotificationCount,
                    gClasses.CenterVH,
                    gClasses.CursorPointer,
                  )}
                >
                  {notificationCount > 9 ? COUNT_NINE_PLUS : notificationCount}
                </div>
              )}
            </button>

            <ProfileDropdown
              onUserProfileDropdownClickHandler={
                onUserProfileDropdownClickHandler
              }
            />
            <div className={styles.OverlayContainer}>
              <button className={isCopilotEnabled ? styles.LargeButton : styles.SmallButton} onClick={() => setIsSearchOpen(true)} />
              {isShowAppTasks && <button className={styles.ProfileButton} onClick={createButtonClicked} />}
              <button className={styles.SmallButton} onClick={() => toggleSystemDirectoryModal()} />
              <button className={styles.SmallButton} onClick={() => toggleNotification()} />
              <button className={styles.ProfileButton} onClick={() => setIsProfileOpen(true)} />
            </div>
          </div>
        </div>
        <div className={styles.ResponsiveTitle}>
          {!history.location.pathname.includes(DEFAULT_APP_ROUTE) && (
            <PageNav isDisplayMultipleApp isHome={isHome} appDetails={appDetails} isResponsiveHeader />
          )}
          <AppSelection
            appDetails={tabOptionList}
            profile={profile}
            isPopperOpen={isAppSelectionOpen}
            onCloseClick={() => setIsAppSelectionOpen(false)}
          />
          <ResponsiveProfile
            isPopperOpen={isProfileOpen}
            onCloseClick={() => setIsProfileOpen(false)}
            onUserProfileDropdownClickHandler={
              onUserProfileDropdownClickHandler
            }
          />
          <ResponsiveSearch
            isPopperOpen={isSearchOpen}
            searchResultData={[
              taskResults,
              flowResults,
              datalistResults,
              userResults,
              teamResults,
            ]}
            placeholder={t(MAIN_HEADER_SEARCHBAR.PLACEHOLDER)}
            perPageDataCount={5}
            searchType={MULTICATEGORY_SEARCH_TYPE.GLOBAL}
            searchText={searchTextState}
            isSearchLoading={isSearchLoading}
            onCloseClick={() => setIsSearchOpen(false)}
            getGlobalSearch={getGlobalSearch}
            seacrhTextChange={seacrhTextChange}
            clearSearchResult={clearSearchResult}
            isCopilotSearch={isCopilotEnabled}
          />
        </div>
      </div>
      {(systemDirectoryModal) && (
        <SystemDirectory
           closeFn={() => setSystemDirectoryModal(false)}
           onCloseClickHandler={onCloseClickHandler}
           isShowAppTasks={isShowAppTasks}
        />
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    profileData: getUserPanelData(state),
    searchTextState: state.SearchResultsReducer.searchText,
    isSearchLoading: state.SearchResultsReducer.isSearchDataLoading,
    taskResults: state.SearchResultsReducer.taskResults,
    flowResults: state.SearchResultsReducer.flowResults,
    datalistResults: state.SearchResultsReducer.datalistResults,
    userResults: state.SearchResultsReducer.userResults,
    teamResults: state.SearchResultsReducer.teamResults,
    isDownloadNotificationsModalOpen:
      state.DownloadWindowReducer.isDownloadNotificationsModalOpen,
    notificationCount: state.NotificationReducer.total_count,
    activeAppDataPages: state.ApplicationReducer.activeAppData.pages,
    headerType: state.RoleReducer.app_header_type,
    isShowAppTasks: state.RoleReducer.is_show_app_tasks,
    isCopilotEnabled: state.RoleReducer.is_copilot_enabled,
    state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDownloadWindowDataChange: (id, value) => {
      dispatch(downloadWindowDataChange(id, value));
    },
    applicationStateChange: (data) => {
      dispatch(applicationStateChange(data));
    },
    getGlobalSearch: (params, type, isNormalMode) => {
      dispatch(getAllSearchApiThunk(params, type, isNormalMode));
    },
    clearSearchResult: () => {
      dispatch(getSearchInitialState());
    },
    seacrhTextChange: (value) => {
      dispatch(SearchTextChange(value));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
