import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames/bind';
import { Link, useHistory, withRouter } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import queryString from 'query-string';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';
import ADMIN_ACCOUNTS_STRINGS from 'containers/admin_panel/admin_pages/AdminPages.string';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import {
  isMobileScreen,
  onWindowResize,
  useClickOutsideDetector,
} from 'utils/UtilityFunctions';
import HamburgerMenuIcon from 'assets/icons/HamburgerMenuIcon';
import { flowListDataChange } from 'redux/actions/FlowListActions';
import { dataListStateChangeAction } from 'redux/reducer/DataListReducer';
import jsUtility, { get, isArray } from 'utils/jsUtility';
import { POPPER_PLACEMENTS } from 'components/auto_positioning_popper/AutoPositioningPopper';
import MoreIcon from 'assets/icons/MoreIcon';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import PlusIcon from 'assets/icons/chat/PlusIcon';
import { integrationDataChange } from 'redux/reducer/IntegrationReducer';
import { ROLES, WORKHALL_ADMIN_SUB_DOMAIN } from 'utils/Constants';
import {
  getTabUrl,
  getSelectedCondition,
  getMarginCondition,
  getCreateUrl,
  getButtonLabel,
  getTabIndexByHistory,
  getCommonHeaderTabs,
  navigator,
  getSelectedTabForMobileView,
} from './CommonHeader.utils';
import { taskListDataChange } from '../../../../redux/actions/TaskActions';
import styles from './CommonHeader.module.scss';
import { LANDING_PAGE_TOPICS, SIDE_NAV_BAR } from './CommonHeader.strings';
import { getRouteLink, routeNavigate } from '../../../../utils/UtilityFunctions';
import { ROUTE_METHOD } from '../../../../utils/Constants';
import {
  ADMIN_ACCOUNTS_INITIAL,
  DATALIST_OVERVIEW,
  TEST_BED,
} from '../../../../urls/RouteConstants';
import { FLOW_DROPDOWN } from '../../../flow/listFlow/listFlow.strings';

function CommonHeader(props) {
  const {
    commonHeader,
    currentHeader,
    onTaskListDataChange,
    onDataListDataChange,
    tab_index,
    flow_tab_index,
    datalist_tab_index,
    integration_tab_index,
    isNavOpen,
    isFlowListLoading,
    integrationDataChange,
  } = props;
  const { t } = useTranslation();
  const wrapperRef = useRef(null);

  const [isMobile, setIsMobile] = useState(isMobileScreen());
  const kebabMenuOptions = commonHeader.kebabMenuOptionList;
  const Role = useSelector((state) => state.RoleReducer);
  const windowResize = () => {
    setIsMobile(isMobileScreen());
  };
  useEffect(() => {
    onWindowResize(windowResize);
    return () => window.removeEventListener('resize', windowResize);
  });
  const history = useHistory();
  const [tabComponent, setTabComponent] = useState(null);
  const [, setCurrentTab] = useState(tab_index);
  const [buttonComponent, setButtonComponent] = useState(null);
  const [headerOptionList, setHeaderOptionList] = useState([]);
  const [dropdownShow, setDropdownShow] = useState(false);
  const [, setCommonHeaders] = useState([]);

  useClickOutsideDetector(wrapperRef, () => setDropdownShow(false));

  const onClickHandler = async (event) => {
    setCurrentTab(Number(event.target.id));
    if (
      Number(event.target.id) !== Number(tab_index) &&
      currentHeader === t(LANDING_PAGE_TOPICS.TASKS)
    ) {
      await onTaskListDataChange({
        tab_index: Number(event.target.id),
        // isTaskDataLoading: false,
        active_tasks_list: [],
        document_url_details: [],
        // searchText: EMPTY_STRING,
        sortIndex: Number(event.target.id) === 3 ? null : -1,
        assignedOnIndex: -1,
        taskTypeIndex: -1,
        dueDateIndex: -3,
        currentPage: 1,
        count: null,
      });
    } else if (currentHeader === t(LANDING_PAGE_TOPICS.FLOW) && !isFlowListLoading) {
      const flowURL = getTabUrl(currentHeader, { value: event.target.id }, t);
      navigator(history, flowURL);
    } else if (currentHeader === t(LANDING_PAGE_TOPICS.DATALIST)) {
      await onDataListDataChange(Number(event.target.id), 'tab_index');
    } else if (currentHeader === t(SIDE_NAV_BAR.INTEGRATION)) {
      integrationDataChange({ tab_index: Number(event.target.id) });
    }
    setDropdownShow(!dropdownShow);
  };

  useEffect(() => {
    if (currentHeader === t(LANDING_PAGE_TOPICS.DATALIST)) {
      if (history?.location?.pathname.includes(DATALIST_OVERVIEW) && datalist_tab_index !== 1) {
        onDataListDataChange(1, 'tab_index');
      }
    }
  }, [history?.location?.pathname]);

  const onHamburgerDropdownClickHandler = async (event) => {
    setCurrentTab(Number(event.target.value));
    if (
      Number(event.target.id) !== Number(tab_index) &&
      currentHeader === t(LANDING_PAGE_TOPICS.TASKS)
    ) {
      await onTaskListDataChange({
        tab_index: Number(event.target.value),
        // isTaskDataLoading: false,
        active_tasks_list: [],
        document_url_details: [],
        // searchText: EMPTY_STRING,
        sortIndex: Number(event.target.value) === 3 ? null : -1,
        assignedOnIndex: -1,
        taskTypeIndex: -1,
        currentPage: 1,
        count: null,
      });
    } else if (currentHeader === t(LANDING_PAGE_TOPICS.FLOW) && !isFlowListLoading) {
      const flowURL = getTabUrl(currentHeader, { value: event.target.value }, t);
      navigator(history, flowURL);
    } else if (currentHeader === t(LANDING_PAGE_TOPICS.DATALIST)) {
      await onDataListDataChange(Number(event.target.value), 'tab_index');
    } else if (currentHeader === t(SIDE_NAV_BAR.INTEGRATION)) {
        await integrationDataChange({ tab_index: Number(event.target.value) });
    }
    const url = getTabUrl(currentHeader, { value: event.target.value }, t);
    navigator(history, url);
    setDropdownShow(!dropdownShow);
  };

  const onDropdownClickHandler = async (event) => {
    setCurrentTab(Number(event.target.value));
    if (
      Number(event.target.value) !== Number(tab_index) &&
      currentHeader === t(LANDING_PAGE_TOPICS.TASKS)
    ) {
      await onTaskListDataChange({
        tab_index: Number(event.target.value),
        active_tasks_list: [],
        document_url_details: [],
        // searchText: EMPTY_STRING,
        sortIndex: Number(event.target.value) === 3 ? null : -1,
        assignedOnIndex: -1,
        taskTypeIndex: -1,
        currentPage: 1,
        dueDateIndex: -3,
        count: null,
      });
    }
    const url = getTabUrl(currentHeader, { value: event.target.value }, t);
    navigator(history, url);
    setDropdownShow(!dropdownShow);
  };

  const selectedTab = getSelectedTabForMobileView(
    currentHeader,
    tab_index,
    flow_tab_index,
    datalist_tab_index,
    integration_tab_index,
    t,
  );
  useEffect(() => {
    setCurrentTab(tab_index);
  }, [tab_index]);
  useEffect(() => {
    let currentTabIndex = null;
    if (currentHeader === t(LANDING_PAGE_TOPICS.FLOW)) {
      currentTabIndex = flow_tab_index;
      if (history?.location?.pathname.includes(TEST_BED)) {
        currentTabIndex = FLOW_DROPDOWN.UNDER_TESTING;
      }
    } else if (currentHeader === t(LANDING_PAGE_TOPICS.DATALIST)) {
      currentTabIndex = datalist_tab_index;
    } else if (currentHeader === t(SIDE_NAV_BAR.INTEGRATION)) {
      currentTabIndex = integration_tab_index;
    } else if (currentHeader === t(ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.LABEL)) {
      currentTabIndex = getTabIndexByHistory(history);
    } else {
      currentTabIndex = tab_index;
    }
    const commonHeaderTabs = getCommonHeaderTabs(
      currentHeader,
      commonHeader,
      currentTabIndex,
      t,
    );
    setHeaderOptionList(commonHeaderTabs);
    setCommonHeaders(commonHeaderTabs);

    if (
      (([
        t(LANDING_PAGE_TOPICS.FLOW),
        t(LANDING_PAGE_TOPICS.DATALIST),
        t(LANDING_PAGE_TOPICS.INTEGRATION),
      ].includes(currentHeader)) &&
      Role.role === ROLES.MEMBER) || (
        t(ADMIN_ACCOUNTS_STRINGS.ACCOUNTS.LABEL) === currentHeader && Role.account_domain !== WORKHALL_ADMIN_SUB_DOMAIN
      )
    ) {
      setTabComponent(null);
      setButtonComponent(null);
      setHeaderOptionList(null);
    } else if (
      (currentHeader !== t(LANDING_PAGE_TOPICS.HOME) &&
        !history.location.pathname.includes('create') &&
        !history.location.pathname.includes('edit')) ||
      history.location.pathname.includes(ADMIN_ACCOUNTS_INITIAL)
    ) {
      setTabComponent(
        commonHeaderTabs &&
        isArray(commonHeaderTabs) &&
        commonHeaderTabs.map((value, index) => {
          const link = getRouteLink(getTabUrl(currentHeader, value, t), history);
          return (
          <Link
            to={link}
            activeClass
            className={cx(styles.LinkTag)}
            key={index}
            tabIndex={0}
            onClick={((currentHeader !== t(LANDING_PAGE_TOPICS.DATALIST)) && (currentHeader !== t(SIDE_NAV_BAR.INTEGRATION))) ?
              (e) => {
                e.stopPropagation();
                onClickHandler;
              }
              : onClickHandler}
          >
            <div
              className={cx(
                BS.D_FLEX,
                gClasses.CenterV,
                gClasses.ClickableElement,
                gClasses.CursorPointer,
                styles.Container,
              )}
            >
              <span
                className={cx(
                  gClasses.PR15,
                  gClasses.ML15,
                  styles.NavItem,
                  (getSelectedCondition(
                    history,
                    currentHeader,
                    tab_index,
                    flow_tab_index,
                    datalist_tab_index,
                    value,
                    integration_tab_index,
                    t,
                  ) || (link === history.location.pathname)) && styles.Selected,
                  getMarginCondition(value, currentHeader, t) && styles.Margin,
                )}
              >
                <span
                  className={cx(styles.Icon, gClasses.PR5)}
                  aria-hidden="true"
                >
                  {value.icon}
                </span>
                <span
                  className={cx(styles.Label)}
                  id={`${value.value}`}
                >
                  {value.label}
                </span>
              </span>
            </div>
          </Link>
        );
      }),
      );
      if (
        (!history.location.pathname.includes('create') &&
          (!history.location.pathname.includes('edit')) &&
          currentHeader !== t(LANDING_PAGE_TOPICS.USERS) &&
          currentHeader !== t(LANDING_PAGE_TOPICS.APPLICATIONS) &&
          currentHeader !== t(LANDING_PAGE_TOPICS.REPORTS) &&
          currentHeader !== t(LANDING_PAGE_TOPICS.ADMIN_SETTINGS) &&
          currentHeader !== t(LANDING_PAGE_TOPICS.BILLING) &&
          currentHeader !== t(SIDE_NAV_BAR.INTEGRATION) &&
          currentHeader !== t(LANDING_PAGE_TOPICS.ML_MODELS) &&
          (currentHeader !== t(LANDING_PAGE_TOPICS.TEAMS)))
      ) {
        setButtonComponent(
          <div>
            <Button
              buttonType={BUTTON_TYPE.PRIMARY}
              className={cx(BS.TEXT_NO_WRAP, gClasses.PL15)}
              primaryButtonStyle={styles.PrimaryButton}
              onClick={() => {
                const currentParams = queryString.parseUrl(history.location.pathname);
                const createName = (currentHeader === t(SIDE_NAV_BAR.OPEN_TASK)) ? 'task' :
                        (currentHeader === t(SIDE_NAV_BAR.MY_FLOWS)) ? 'flow' :
                        (currentHeader === t(SIDE_NAV_BAR.MY_DATA_LIST)) ? 'datalist' :
                        (currentHeader === t(SIDE_NAV_BAR.INTEGRATION)) ? 'integration' : null;
                const newParams = { ...get(currentParams, ['query'], {}), create: createName };
                if ((currentHeader === t(SIDE_NAV_BAR.OPEN_TASK)) || (currentHeader === t(SIDE_NAV_BAR.MY_FLOWS)) || currentHeader === t(SIDE_NAV_BAR.MY_DATA_LIST) || currentHeader === t(SIDE_NAV_BAR.INTEGRATION)) {
                  const commonHeaderSearchParams = new URLSearchParams(newParams).toString();
                  routeNavigate(history, ROUTE_METHOD.PUSH, null, commonHeaderSearchParams, null);
                } else {
                  const currentHeaderPathName = getCreateUrl(currentHeader, t);
                  routeNavigate(history, ROUTE_METHOD.PUSH, currentHeaderPathName, null, null);
                }
              }}
              ariaLabel={getButtonLabel(currentHeader, t)}
            >
              {isMobile ?
              <PlusIcon
              ariaLabel="Create Task"
              ariaHidden="true"
              />
             : getButtonLabel(currentHeader, t)}
            </Button>
          </div>,
        );
      } else {
        setButtonComponent(null);
      }
    } else {
      setTabComponent(null);
      setButtonComponent(null);
    }
  }, [
    currentHeader,
    isMobile,
    commonHeader,
    dropdownShow,
    isNavOpen,
    history.location.state,
    flow_tab_index,
    datalist_tab_index,
    history.location.pathname,
    tab_index,
    integration_tab_index,
  ]);

  const mobileSelectedTab =
    tabComponent &&
    tabComponent.filter((element) => {
      if (element.props.id === selectedTab) return true;
      else return false;
    });
    const MenuOptionsList = isMobile ? (headerOptionList || []).concat(kebabMenuOptions) : kebabMenuOptions;
  return (
    <div className={cx(BS.D_FLEX)}>
      <div className={gClasses.CenterV}>
        {isMobile ? tabComponent && mobileSelectedTab : tabComponent}
      </div>
      <div ref={wrapperRef}>
        {currentHeader !== t(LANDING_PAGE_TOPICS.BILLING) && currentHeader !== t(LANDING_PAGE_TOPICS.HOME) && currentHeader !== t(LANDING_PAGE_TOPICS.USERS) && isMobile ? !jsUtility.isEmpty(headerOptionList) && (
          <Dropdown
            id="hamburger_menu"
            placeholder=""
            className={cx(
              gClasses.ML15,
              gClasses.PR15,
              gClasses.CenterV,
              gClasses.MT10,
              gClasses.ClickableElement,
              gClasses.CursorPointer,
            )}
            comboboxClass={gClasses.MinWidth0}
            optionList={currentHeader === t(LANDING_PAGE_TOPICS.TASKS) ? MenuOptionsList : headerOptionList}
            onChange={onHamburgerDropdownClickHandler}
            isBorderLess
            isNewDropdown
            isTaskDropDown
            placement={POPPER_PLACEMENTS.BOTTOM_END}
            fallbackPlacements={[POPPER_PLACEMENTS.TOP_END]}
            popperClasses={cx(gClasses.ZIndex5, gClasses.MT10, gClasses.ML10)}
            customDisplay={
              <>
                {/* temp fix for kebab menu accessibility and screen reader */}
                <div className={styles.customDisplay} aria-label="menu items">......</div>
                <HamburgerMenuIcon ariaLabel="true" role={ARIA_ROLES.IMG} />
              </>
            }
            outerClassName={gClasses.MinWidth0}
            noInputPadding
          />
        ) : null}
      </div>
      {currentHeader === t(LANDING_PAGE_TOPICS.TASKS) && !isMobile && (
        <div>
          <Dropdown
            id="more_items"
            placeholder=""
            className={cx(gClasses.MR15, gClasses.MT8)}
            comboboxClass={gClasses.MinWidth0}
            optionList={kebabMenuOptions}
            onChange={onDropdownClickHandler}
            selectedValue={tab_index}
            isBorderLess
            isNewDropdown
            isTaskDropDown
            placement={POPPER_PLACEMENTS.BOTTOM_END}
            fallbackPlacements={[POPPER_PLACEMENTS.TOP_END]}
            popperClasses={cx(gClasses.ZIndex5, gClasses.MT10, gClasses.ML10)}
            customDisplay={
              <>
                {/* temp fix for kebab menu accessibility and screen reader */}
                <div className={styles.customDisplay} aria-label="more items">......</div>
                <MoreIcon ariaHidden="true" role={ARIA_ROLES.IMG} />
              </>
            }
            outerClassName={gClasses.MinWidth0}
            noInputPadding
          />
        </div>
      )}
      {buttonComponent}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    commonHeader: state.NavBarReducer.commonHeader,
    tab_index: state.TaskReducer.tab_index,
    isTaskDataLoading: state.TaskReducer.isTaskDataLoading,
    flow_tab_index: state.FlowListReducer.tab_index,
    datalist_tab_index: state.DataListReducer.tab_index,
    integration_tab_index: state.IntegrationReducer.tab_index,
    isNavOpen: state.NavBarReducer.isNavOpen,
    admin_settings_tab_index:
      state.AdminSettingsReducer.admin_setting_tab_index,
    isFlowListLoading: state.FlowListReducer.isDataLoading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onTaskListDataChange: (value) => {
      dispatch(taskListDataChange(value));
    },
    onFlowListDataChange: (data) => {
      dispatch(flowListDataChange(data));
    },
    onDataListDataChange: (content, id) => {
      dispatch(dataListStateChangeAction(content, id));
    },
    integrationDataChange: (data) => {
      dispatch(integrationDataChange(data));
    },
    dispatch,
  };
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CommonHeader),
);
