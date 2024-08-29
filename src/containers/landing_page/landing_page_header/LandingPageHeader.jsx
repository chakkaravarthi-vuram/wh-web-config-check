import React, { useEffect, useState } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import { Button, EButtonSizeType, EButtonType, EPopperPlacements, ETextSize, ETitleSize, ETooltipType, Tab, Text, Title, Tooltip } from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory, withRouter } from 'react-router-dom';
import { adminSettingsStateChange } from 'redux/actions/AdminSettings.Action ';
import queryString from 'query-string';
import { getAdminAccountsUrl } from 'containers/admin_panel/admin_pages/AdminPages.utils';
import { getUserPanelData } from '../../../redux/selectors/LandingPageSelctor';
import { NavToggle } from '../../../redux/actions/NavBar.Action';
import { toggleNotificationsModalVisibility } from '../../../redux/reducer/NotificationsReducer';
import ProfileDropdown from '../../application/header/profile_dropdown/ProfileDropdown';
import { keydownOrKeypessEnterHandle, routeNavigate } from '../../../utils/UtilityFunctions';
import { ARIA_ROLES } from '../../../utils/UIConstants';
import styles from './LandingPageHeader.module.scss';
import { MAIN_HEADER_SEARCHBAR } from '../main_header/common_header/CommonHeader.strings';
import { MULTICATEGORY_SEARCH_TYPE, ROUTE_METHOD } from '../../../utils/Constants';
import { ADMIN_SETTINGS, CREATE_APP, CREATE_DATA_LIST, EDIT_APP, EDIT_DATA_LIST, EDIT_FLOW, EDIT_INTEGRATION, INTEGRATIONS, LIST_DATA_LIST, LIST_FLOW, TASKS, CREATE_REPORT_CONFIG, REPORT_CONFIG, EDIT_REPORT, CREATE_REPORT, ADMIN_ACCOUNTS_INITIAL, ACCOUNT_DETAILS } from '../../../urls/RouteConstants';
import { getAdminSettingsUrl, getLandingPageHeaderData } from './LandingPageHeader.utils';
import { LANDING_PAGE_HEADER_CONSTANT } from './LandingPageHeader.string';
import { getTabUrl } from '../../team/teams.utils';
import { APP_LIST_ROUTE } from '../../application/app_listing/AppList.constants';
import { getIntegrationUrlFromTab } from '../../integration/Integration.utils';
import jsUtility from '../../../utils/jsUtility';
import { taskListDataChange } from '../../../redux/actions/TaskActions';
import { getDatalistUrl, getFlowUrl, getTaskUrl } from '../../../utils/taskContentUtils';
import { dataListStateChangeAction } from '../../../redux/reducer/DataListReducer';
import { appListDataChange } from '../../../redux/reducer/ApplicationReducer';
import LandingPageSearch from './landing_page_search/LandingPageSearch';
import LandingPageBackIcon from '../../../assets/icons/LandingPageBackIcon';
import AiAssist from './landing_page_ai_assist/AiAssist';
import MagicIcon from '../../../assets/icons/MagicIcon';
import HeaderNotificationIcon from '../../../assets/icons/landing_page/HeaderNotificationIcon';

function LandingPageHeader(props) {
    const {
        totalCount,
        profileData,
        onUserProfileDropdownClickHandler,
        searchTextState,
        isSearchLoading,
        taskResults,
        flowResults,
        datalistResults,
        userResults,
        teamResults,
        dataListState,
        onTaskListDataChange,
        onDataListDataChange,
        adminTabChange,
        teamsSelectedTab,
        integrationSelectedTab,
        taskSelectedTab,
        flowSelectedTab,
        datalistSelectedTab,
        adminSelectedTab,
        appSelectedTab,
        appListDataChange,
        toggleNotificationsModal,
        teamDetailsType,
        enablePrompt,
    } = props;
    const history = useHistory();
    const { t, i18n } = useTranslation();
    const [isHeaderDisplay, setIsHeaderDisplay] = useState(true);
    const [showAiAssit, setShowAiAssist] = useState(false);
    const [headerData, setHeaderData] = useState({});
    const { MODULE, COMMON } = LANDING_PAGE_HEADER_CONSTANT(t);

    useEffect(() => {
        const { headerDetails } = getLandingPageHeaderData(history, t, {
            teamsSelectedTab,
            integrationSelectedTab,
            taskSelectedTab,
            flowSelectedTab,
            datalistSelectedTab,
            adminSelectedTab,
            appSelectedTab,
        });
        setHeaderData(headerDetails);
        if ((history.location.pathname === EDIT_FLOW) ||
            (history.location.pathname.includes(EDIT_INTEGRATION) && history.location.pathname.includes(INTEGRATIONS)) ||
            (history.location.pathname === CREATE_DATA_LIST && dataListState.isDataListModalDisabled) ||
            (history.location.pathname === EDIT_DATA_LIST) ||
            history.location.pathname.includes(EDIT_APP) || history.location.pathname.includes(CREATE_APP) ||
            history.location.pathname.includes(EDIT_REPORT) || history.location.pathname.includes(CREATE_REPORT)) {
            setIsHeaderDisplay(false);
        } else {
            setIsHeaderDisplay(true);
        }
    }, [history.location.pathname,
        i18n.language,
        teamsSelectedTab,
        integrationSelectedTab,
        taskSelectedTab,
        flowSelectedTab,
        datalistSelectedTab,
        adminSelectedTab,
        appSelectedTab,
    ]);

    const onTabClick = (value, moduleType) => {
        if (moduleType === MODULE.TEAMS) {
            const teamPathname = getTabUrl(value);
            routeNavigate(history, ROUTE_METHOD.PUSH, teamPathname);
        } else if (moduleType === MODULE.APPS) {
            let route = null;
            if (value === headerData?.tabOptions[0].value) route = APP_LIST_ROUTE.PUBLISHED;
            else if (value === headerData?.tabOptions[1].value) route = APP_LIST_ROUTE.DRAFT;
            appListDataChange({ selectedTab: value });
            routeNavigate(history, ROUTE_METHOD.PUSH, route, null, null);
        } else if (moduleType === MODULE.INTEGRATION) {
            const route = getIntegrationUrlFromTab(value);
            !jsUtility.isEmpty(route) && routeNavigate(history, ROUTE_METHOD.PUSH, route);
        } else if (moduleType === MODULE.TASKS) {
            const taskRoute = `${TASKS}/${getTaskUrl(value)}`;
            onTaskListDataChange({
                tab_index: value,
                active_tasks_list: [],
                document_url_details: [],
                sortIndex: value === 3 ? null : -1,
                assignedOnIndex: -1,
                taskTypeIndex: -1,
                dueDateIndex: -3,
                currentPage: 1,
                count: null,
            });
            routeNavigate(history, ROUTE_METHOD.PUSH, taskRoute);
        } else if (moduleType === MODULE.FLOWS) {
            const flowURL = `${LIST_FLOW}${getFlowUrl(value)}`;
            routeNavigate(history, ROUTE_METHOD.PUSH, flowURL);
        } else if (moduleType === MODULE.DATALISTS) {
            onDataListDataChange(value, COMMON.TAB_INDEX);
            const datalistURL = `${LIST_DATA_LIST}${getDatalistUrl(value)}`;
            routeNavigate(history, ROUTE_METHOD.PUSH, datalistURL);
        } else if (moduleType === MODULE.ADMIN_SETTINGS) {
            adminTabChange(value);
            const adminURL = `${ADMIN_SETTINGS}${getAdminSettingsUrl(value)}`;
            routeNavigate(history, ROUTE_METHOD.PUSH, adminURL);
        } else if (moduleType === MODULE.SUPER_ADMIN) {
            const superAdminUrl = `/${ADMIN_ACCOUNTS_INITIAL}/${getAdminAccountsUrl(value)}`;
            routeNavigate(history, ROUTE_METHOD.PUSH, superAdminUrl);
        }
    };

    const onCreateActionClick = () => {
        if (headerData.type === MODULE.REPORTS) {
            const createReportConfigPathName = `/${REPORT_CONFIG}/${CREATE_REPORT_CONFIG}`;
            routeNavigate(history, ROUTE_METHOD.REPLACE, createReportConfigPathName, null, null);
            return;
        } else if (headerData.type === MODULE.SUPER_ADMIN) {
            const superAdminPath = ACCOUNT_DETAILS.CREATE_ACCOUNT;
            routeNavigate(history, ROUTE_METHOD.REPLACE, superAdminPath, null, null);
            return;
        }
        const currentParams = queryString.parseUrl(history.location.pathname);
        const newParams = { ...jsUtility.get(currentParams, [COMMON.QUERY], {}), create: headerData?.actionButtonSearchParam };
        const search = new URLSearchParams(newParams).toString();
        routeNavigate(history, ROUTE_METHOD.REPLACE, null, search, null);
    };

    const onBackClick = () => {
        if (headerData?.type === MODULE.TEAMS) {
            const teamPathname = getTabUrl(teamDetailsType.toString());
            routeNavigate(history, ROUTE_METHOD.PUSH, teamPathname);
        } else routeNavigate(history, ROUTE_METHOD.PUSH, headerData?.previousRoute);
    };

    const getRouteBackText = () => {
        if (headerData?.type === MODULE.TEAMS) {
            return `${teamDetailsType - 1 ? headerData?.tabOptions?.[0]?.labelText : headerData?.tabOptions?.[1]?.labelText} teams`;
        } else {
            return headerData?.previousRouteText;
        }
    };

    if (!isHeaderDisplay) return null;

    return (
        <div className={cx(styles.HeaderContainer, gClasses.Sticky)}>
            <AiAssist
                isModalOpen={showAiAssit}
                aiAssistType={headerData?.aiAssistType}
                setShowAiAssist={setShowAiAssist}
            />
            <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.W100, gClasses.MB8)}>
                <div className={gClasses.CenterV}>
                    {headerData?.previousRoute &&
                    <Tooltip
                        text={`${COMMON.BACK_TO} ${getRouteBackText()}`}
                        tooltipType={ETooltipType.INFO}
                        tooltipPlacement={EPopperPlacements.BOTTOM_START}
                        icon={<LandingPageBackIcon className={cx(gClasses.MR8, gClasses.CursorPointer)} onClick={onBackClick} />}
                    />
                    }
                    <Title content={headerData?.title} size={ETitleSize.medium} className={cx(gClasses.GrayV3, gClasses.LineHeightNormal)} />
                </div>
                <div className={gClasses.CenterV}>
                    <div
                        className={gClasses.PositionRelative}
                    >
                        <LandingPageSearch
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
                        />
                    </div>
                    <div
                        className={cx(gClasses.PX16, gClasses.DisplayFlex, gClasses.PositionRelative, profileData?.acc_logo && styles.NotificationIconContainer)}
                        onClick={() => toggleNotificationsModal()}
                        role="button"
                        tabIndex={0}
                        aria-label={COMMON.NOTIFICATION}
                        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && toggleNotificationsModal()}
                    >
                        <HeaderNotificationIcon
                            className={cx(gClasses.CursorPointer, styles.NotificationIcon)}
                            role={ARIA_ROLES.IMG}
                        />
                        {totalCount > 0 &&
                            (
                                <div className={cx(gClasses.FTwo10White, styles.NotificationCount, gClasses.CenterVH, gClasses.CursorPointer)}>
                                    {totalCount > 9 ? COMMON.NINE_PLUS : totalCount}
                                </div>
                            )}
                    </div>
                    <ProfileDropdown
                        onUserProfileDropdownClickHandler={
                            onUserProfileDropdownClickHandler
                        }
                    />
                </div>
            </div>
            {!headerData?.hideSubHeader && (
                <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw)}>
                    <div>
                        <Text className={cx(gClasses.FTwo12GrayV86, styles.SloganHeight)} content={headerData?.description} />
                        <Tab
                            className={cx(gClasses.MT16, styles.HeaderTab)}
                            options={headerData?.tabOptions}
                            tabSizeVariation={ETextSize.MD}
                            textClass={gClasses.MB6}
                            selectedTabIndex={headerData?.selectedTab}
                            bottomSelectionClass={styles.ActiveBar}
                            onClick={(value) => onTabClick(value, headerData?.type)}
                        />
                    </div>
                    <div className={cx(gClasses.CenterV, gClasses.gap12)}>
                        {headerData?.aiAssistType && enablePrompt && (
                            <Button
                                icon={<MagicIcon />}
                                size={EButtonSizeType.SM}
                                type={EButtonType.MULTI_COLOR_OUTLINE}
                                buttonText={headerData?.aiAssistButtonText}
                                className={gClasses.PX12}
                                onClickHandler={() => setShowAiAssist(true)}
                            />
                        )}
                        {headerData?.actionButtonText && (
                            <Button
                                size={EButtonSizeType.SM}
                                buttonText={headerData?.actionButtonText}
                                className={gClasses.PX12}
                                onClickHandler={onCreateActionClick}
                            />
                        )}
                    </div>
                </div>)}
        </div>
    );
}

const mapStateToprops = (state) => {
    return {
        profileData: getUserPanelData(state),
        searchTextState: state.SearchResultsReducer.searchText,
        isSearchLoading: state.SearchResultsReducer.isSearchDataLoading,
        taskResults: state.SearchResultsReducer.taskResults,
        flowResults: state.SearchResultsReducer.flowResults,
        datalistResults: state.SearchResultsReducer.datalistResults,
        userResults: state.SearchResultsReducer.userResults,
        teamResults: state.SearchResultsReducer.teamResults,
        dataListState: state.CreateDataListReducer,
        totalCount: state.NotificationReducer.total_count,
        teamsSelectedTab: state.TeamsReducer.teamListing.selectedTabIndex,
        integrationSelectedTab: state.IntegrationReducer.tab_index,
        taskSelectedTab: state.TaskReducer.tab_index,
        flowSelectedTab: state.FlowListReducer.tab_index,
        datalistSelectedTab: state.DataListReducer.tab_index,
        adminSelectedTab: state.AdminSettingsReducer.admin_setting_tab_index,
        appSelectedTab: state.ApplicationReducer.appListParams.selectedTab,
        teamDetailsType: state.TeamsReducer.teamDetails.teamDetails.teamType,
        enablePrompt: state.RoleReducer.enable_prompt,
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
        onTaskListDataChange: (value) => {
            dispatch(taskListDataChange(value));
        },
        onDataListDataChange: (content, id) => {
            dispatch(dataListStateChangeAction(content, id));
        },
        adminTabChange: (data) => dispatch(adminSettingsStateChange(data)),
        appListDataChange: (params) => {
            dispatch(appListDataChange(params));
        },
    };
};

export default withRouter(
    connect(mapStateToprops, mapDispatchToProps)(LandingPageHeader),
);
