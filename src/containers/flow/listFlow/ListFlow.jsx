import React, { useState, useEffect, lazy, useRef } from 'react';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useParams, withRouter } from 'react-router-dom';
import { FLOW_DASHBOARD, EDIT_FLOW, TEST_BED } from 'urls/RouteConstants';
import { NavBarDataChange } from 'redux/actions/NavBar.Action';
import { flowListDataChange } from 'redux/actions/FlowListActions';
import { initiateFlowApi } from 'redux/actions/FloatingActionMenuStartSection.Action';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import TestBedConfirmationScreen, { CONTENT_TYPE } from 'containers/edit_flow/test_bed/TestBedConfirmationScreen';
import { useTranslation } from 'react-i18next';
import { language } from 'language/config';
import { BorderRadiusVariant, Chip, DropdownList, EChipSize, EInputIconPlacement, EPopperPlacements, Input, Popper, Size, TableColumnWidthVariant, TableScrollType, TableWithInfiniteScroll, Text, UserDisplayGroup } from '@workhall-pvt-lmt/wh-ui-library';
import jsUtils from '../../../utils/jsUtility';
import * as ROUTE_CONSTANTS from '../../../urls/RouteConstants';
import { ARIA_ROLES } from '../../../utils/UIConstants';
import gClasses from '../../../scss/Typography.module.scss';
import {
  getDraftFlowsListDataThunk,
  getAllDevFlowsThunk,
} from '../../../redux/actions/FlowListActions';
import {
  FLOW_DROPDOWN,
  SEARCH_FLOW,
  SCROLLABLE_DIV_ID,
  FLOW_MANAGED_BY_TYPE,
  FLOW_ACTIONS,
  FLOW_LIST_BUTTONS,
  FLOW_NORMAL_HEADERS,
  SORT_DROP_DOWN,
  FLOW_LISTING_SORT_OPTIONS,
  FLOW_KEY_ID,
  // FLOW_TAB_DATA,
} from './listFlow.strings';
import { ROLES, REDIRECTED_FROM, ROUTE_METHOD } from '../../../utils/Constants';
import styles from './ListFlow.module.scss';
import { constructAvatarOrUserDisplayGroupList, getPopperContent, keydownOrKeypessEnterHandle, routeNavigate, useClickOutsideDetector } from '../../../utils/UtilityFunctions';
import {
  getTabFromUrl,
  getUrlFromTab,
  getNoDataFoundStrings,
  getNavigationLinkFromDropdownValue,
  getSubTabFromUrl,
  getSelectedValueFromUrl,
} from './ListFlow.utils';
import { EDIT_LIVE_FLOW_STRINGS } from '../Flow.strings';
import { getTestBedFlowLink } from '../flow_dashboard/flowDashboardUtils';
import { updateFlowStateChange } from '../../../redux/reducer/EditFlowReducer';
import { postFlowCreationPromptThunk } from '../../../redux/actions/FlowCreationPrompt.Action';
import LandingSearchExitIcon from '../../../assets/icons/LandingSearchExitIcon';
import { ICON_STRINGS } from '../../sign_in/SignIn.strings';
import SortDropdownIcon from '../../../assets/icons/landing_page/SortDropdownIcon';
import { ICON_ARIA_LABELS } from '../../../utils/strings/CommonStrings';
import LandingPageSearchIcon from '../../../assets/icons/landing_page/LandingPageSearchIcon';
import { COLOR } from '../../application/app_components/task_listing/TaskList.constants';
import FlowListingIcon from '../../../assets/icons/landing_page/FlowListingIcon';
import Edit from '../../../assets/icons/application/EditV2';
import useWindowSize from '../../../hooks/useWindowSize';
import { getLandingListingRowCount } from '../../../utils/generatorUtils';
import { isSameDay, parse12HoursTimeFromUTC } from '../../../utils/dateUtils';
import { flowDataEntity } from './listFlow.selectors';
// lazy imports

const NoDataFound = lazy(() => import('../../landing_page/no_data_found/NoDataFound'));
const InitFlowModal = lazy(() => import('../../edit_flow/InitFlowModal'));

let cancelForGetAllFlowsByCategory;
let cancelForGetAllDraftFlows;

export const getCancelTokenForGetAllFlowsByCategory = (cancelToken) => {
  cancelForGetAllFlowsByCategory = cancelToken;
  return cancelToken;
};

export const getCancelTokenForGetAllDraftFlows = (cancelToken) => {
  cancelForGetAllDraftFlows = cancelToken;
  return cancelToken;
};

function ListFlow(props) {
  const {
    tab_index,
    isLoadMoreDataLoading,
    // document_url_details,
    // common_server_error,
    total_count,
    hasMore,
    flow_list,
    isDataLoading,
    history,
    history: { location },
    role,
    onFlowListDataChange,
    flowListState,
    getAllDevFlowsThunk,
    isTrialDisplayed,
  } = props;
  const { sortType, sortValue, sortLabel, sortBy } = flowListState;
  const { t, i18n } = useTranslation();
  const { tab } = useParams();
  const [flowTab, setflowTab] = useState(tab_index);
  const [searchText, setSearchText] = useState('');
  const [isTestBedEditModalVisible, setTestBedEditModal] = useState(false);
  const [flowUuidToBeEdited, setFlowUuid] = useState(null);
  const [flowName, setFlowName] = useState(EMPTY_STRING);
  const [activePage, setCurrentPage] = useState(1);
  const [isSearchFocus, setIsSearchFocus] = useState(false);
  const [isSortPopOverVisible, setIsSortPopOverVisible] = useState(false);
  const [isShowByPopOverVisible, setIsShowByPopOverVisible] = useState(false);
  const sortPopOverTargetRef = useRef(null);
  const showByPopOverTargetRef = useRef(null);
  const [height] = useWindowSize();
  useClickOutsideDetector(sortPopOverTargetRef, () => setIsSortPopOverVisible(false));
  useClickOutsideDetector(showByPopOverTargetRef, () => setIsShowByPopOverVisible(false));

  const closeTestBedEditModal = () => {
    setTestBedEditModal(false);
    setFlowUuid(null);
    setFlowName(EMPTY_STRING);
  };
  let optionList = [];
  if (!location.pathname.includes(ROUTE_CONSTANTS.CREATE_FLOW)) {
    optionList = getSubTabFromUrl(t, tab, role, true);
  }
  const [selectedValue, setSelectedValue] = useState(getSelectedValueFromUrl(optionList, tab, true));

  useEffect(() => {
    if (!location.pathname.includes(ROUTE_CONSTANTS.CREATE_FLOW)) {
      setSelectedValue(getSelectedValueFromUrl(optionList, tab, true));
    }
  }, [tab_index, tab]);
  let flowListItems = [];

  const onCardClick = (flow_uuid, isDraft, isTestBed = false) => {
    // flow_uuid will be flow_id in case of draft flow
    const { history } = props;
    if (isDraft) {
      const flowState = {
        flow_uuid,
        flow_tab: flowTab,
      };
      routeNavigate(history, ROUTE_METHOD.PUSH, EDIT_FLOW, EMPTY_STRING, flowState);
    } else if (isTestBed) {
      const flowTextBebPathName = `${FLOW_DASHBOARD}/${TEST_BED}/${flow_uuid}`;
      const flowState = {
        flow_id: flow_uuid,
        flow_tab: tab_index,
      };
      routeNavigate(history, ROUTE_METHOD.PUSH, flowTextBebPathName, EMPTY_STRING, flowState);
    } else {
      const flowPathName = `${FLOW_DASHBOARD}/${flow_uuid}`;
      const flowState = {
        flow_id: flow_uuid,
        flow_tab: tab_index,
      };
      routeNavigate(history, ROUTE_METHOD.PUSH, flowPathName, EMPTY_STRING, flowState);
    }
  };

  const getParamBasedOnPathname = () => {
    if (!tab) return {};

    let param = {};
    const baseUrl = tab;
    switch (baseUrl) {
      case ROUTE_CONSTANTS.FLOW_TEST_BED_MANAGED_BY_YOU:
        param = { is_test_bed: 1, managed_by: FLOW_MANAGED_BY_TYPE.ME };
        break;
      case ROUTE_CONSTANTS.FLOW_TEST_BED_MANAGED_BY_OTHERS:
        param = { is_test_bed: 1, managed_by: FLOW_MANAGED_BY_TYPE.OTHERS };
        break;

      case ROUTE_CONSTANTS.FLOWS_MANAGED_BY_YOU:
      case ROUTE_CONSTANTS.FLOW_DRAFT_MANAGED_BY_YOU:
        param = { managed_by: FLOW_MANAGED_BY_TYPE.ME };
        break;
      case ROUTE_CONSTANTS.FLOWS_MANAGED_BY_OTHERS:
      case ROUTE_CONSTANTS.FLOW_DRAFT_MANAGED_BY_OTHERS:
        param = { managed_by: FLOW_MANAGED_BY_TYPE.OTHERS };
        break;
      default:
        break;
    }
    return param;
  };

  const getFlowsByCategory = (basicParams = {}, additionalParams = {}, cancelPrevCall = false) => {
    const { search, ...remainingParams } = basicParams;
    const params = {
      size: getLandingListingRowCount(height, isTrialDisplayed),
      search: searchText,
      sort_field: sortType,
      sort_by: sortBy,
      with_category: '1',
      ...remainingParams,
    };
    if (jsUtils.has(basicParams, 'search')) {
      params.search = basicParams.search;
    }
    if (cancelPrevCall || basicParams.search !== searchText) {
      if (cancelForGetAllFlowsByCategory) cancelForGetAllFlowsByCategory();
    }
    if (!params.search) delete params.search;
    if (basicParams.page) {
      setCurrentPage(basicParams.page || 1);
    }
    getAllDevFlowsThunk({
      ...params,
      ...additionalParams,
    });
  };

  const getDraftFlows = (basicParams, cancelPrevCall = false) => {
    const { getDraftFlowsListDataApi } = props;
    const { search, ...remainingParams } = basicParams;
    const params = {
      size: getLandingListingRowCount(height, isTrialDisplayed),
      search: searchText,
      ...remainingParams,
    };
    if (jsUtils.has(basicParams, 'search')) {
      params.search = basicParams.search;
    }
    if (cancelPrevCall || basicParams.search !== searchText) {
      if (cancelForGetAllDraftFlows) cancelForGetAllDraftFlows();
    }
    if (!params.search) delete params.search;
    setCurrentPage(basicParams.page || 1);
    getDraftFlowsListDataApi({
      ...params,
    });
  };

  const getFlowListFromAction = (page, search, cancelPrevCall = false, additionalParams) => {
    const { tab_index } = props;
    const params = {
      ...getParamBasedOnPathname(),
      page,
      search,
    };
    switch (tab_index) {
      case FLOW_DROPDOWN.PUBLISHED_FLOW:
      case FLOW_DROPDOWN.UNDER_TESTING:
        return getFlowsByCategory(params, additionalParams, cancelPrevCall);
      case FLOW_DROPDOWN.DRAFT_FLOW:
        return getDraftFlows(params, cancelPrevCall);
      default:
        return null;
    }
  };

  const onLoadMoreCallHandler = () => {
    const { onFlowListDataChange } = props;
    if (flow_list.length < total_count) {
      getFlowListFromAction(activePage + 1, searchText);
    } else if (hasMore) {
      onFlowListDataChange({
        hasMore: false,
      });
    }
  };

  const onInputChange = (event) => {
    const {
      target: { value },
    } = event;
    getFlowListFromAction(1, value);
    if (value !== searchText) {
      return setSearchText(value);
    }
    return null;
  };

  const input = {
    onChange: onInputChange,
    placeholder: t(SEARCH_FLOW.PLACE_HOLDER),
    isVisible: true,
    id: SEARCH_FLOW.ID,
  };

  const initiateFlowFromList = (flow_uuid, isTestBed = false) => {
    const { initiateFlow } = props;
    const postData = {
      flow_uuid,
      is_test_bed: isTestBed ? 1 : 0,
    };
    const flowTabUrl = getUrlFromTab(tab_index);
    initiateFlow(postData, history, REDIRECTED_FROM.FLOW_DASHBOARD, { flowTabUrl });
  };

  const editFlowFromListing = (flowUuid, hasTestbed, flowName) => {
    if (hasTestbed) {
      setTestBedEditModal(true);
      setFlowUuid(flowUuid);
      setFlowName(flowName);
    } else {
      const flowState = { flow_uuid: flowUuid };
      routeNavigate(history, ROUTE_METHOD.PUSH, EDIT_FLOW, EMPTY_STRING, flowState);
    }
  };

  const onActionHandler = (flow_uuid, action, flowData = {}) => {
    switch (action) {
      case FLOW_ACTIONS.START:
        return initiateFlowFromList(flow_uuid);
      case FLOW_ACTIONS.EDIT:
        const { hasTestbed = false, flowName = EMPTY_STRING } = flowData;
        return editFlowFromListing(flow_uuid, hasTestbed, flowName);
      default:
        return null;
    }
  };

  const redirectPage = (history, role) => {
    let pathname = tab;
    if ((role === ROLES.MEMBER && pathname !== ROUTE_CONSTANTS.FLOW_OVERVIEW) || !pathname) {
      pathname = ROUTE_CONSTANTS.FLOW_OVERVIEW;
    }

    if (role === ROLES.FLOW_CREATOR) {
      switch (tab) {
        case ROUTE_CONSTANTS.FLOWS_MANAGED_BY_OTHERS:
          pathname = ROUTE_CONSTANTS.FLOW_OVERVIEW;
          break;
        case ROUTE_CONSTANTS.FLOW_TEST_BED_MANAGED_BY_OTHERS:
          pathname = ROUTE_CONSTANTS.FLOW_TEST_BED_MANAGED_BY_YOU;
          break;
        case ROUTE_CONSTANTS.FLOW_DRAFT_MANAGED_BY_OTHERS:
          pathname = ROUTE_CONSTANTS.MY_DRAFT_FLOWS;
          break;
        default:
          break;
      }
    }

    let navigateTo = null;
    switch (pathname) {
      case ROUTE_CONSTANTS.FLOW_OVERVIEW:
        navigateTo = ROUTE_CONSTANTS.LIST_FLOW + ROUTE_CONSTANTS.ALL_PUBLISHED_FLOWS;
        break;
      case ROUTE_CONSTANTS.MY_PUBLISHED_FLOW:
        navigateTo = ROUTE_CONSTANTS.LIST_FLOW + ROUTE_CONSTANTS.FLOWS_MANAGED_BY_YOU;
        break;
      case ROUTE_CONSTANTS.FLOW_TEST_BED_MANAGED_BY_YOU:
        navigateTo = ROUTE_CONSTANTS.LIST_FLOW + ROUTE_CONSTANTS.FLOW_TEST_BED_MANAGED_BY_YOU;
        break;
      case ROUTE_CONSTANTS.MY_DRAFT_FLOWS:
        navigateTo = ROUTE_CONSTANTS.LIST_FLOW + ROUTE_CONSTANTS.FLOW_DRAFT_MANAGED_BY_YOU;
        break;
      default:
        break;
    }
    if (navigateTo) {
      routeNavigate(history, ROUTE_METHOD.PUSH, navigateTo);
    }
  };

  const onTabChangeHandler = (value) => {
    const navigationLink = getNavigationLinkFromDropdownValue(tab, value);
    const flowTabPathName = ROUTE_CONSTANTS.LIST_FLOW + navigationLink;
    navigationLink && routeNavigate(history, ROUTE_METHOD.REPLACE, flowTabPathName);
  };

  useEffect(() => {
    if (!location.pathname.includes('createFlow')) {
    if (!history.location || !history.location.pathname) return;
    redirectPage(history, role);
    const tabIndexFromUrl = getTabFromUrl(history.location.pathname);

    if (tab_index !== tabIndexFromUrl) {
      const { onFlowListDataChange } = props;
      onFlowListDataChange({
        tab_index: tabIndexFromUrl,
      });
    } else {
      getFlowListFromAction(1, searchText, true);
    }
}
  }, [tab_index, tab, height]);

  async function initFunction() {
    const { navbarChange, onFlowListDataChange } = props;
    let actualTabIndex = tab_index;
    const tabIndexFromUrl = getTabFromUrl(history.location.pathname);

    if (actualTabIndex !== tabIndexFromUrl) {
      actualTabIndex = tabIndexFromUrl;
    }
    setflowTab(actualTabIndex);
    await onFlowListDataChange({ tab_index: actualTabIndex });
    await navbarChange({
      commonHeader: {
        tabOptions: FLOW_DROPDOWN.OPTION_LIST(t),
        button: null,
      },
    });
  }
  // reducer logic end
  useEffect(() => {
    if (!location.pathname.includes('createFlow')) {
      initFunction();
    }
  }, []);

  const getFlowTitleAndCategory = (flowRow) => (
    <div className={gClasses.CenterV}>
      <FlowListingIcon className={gClasses.MinHW20} />
      <Text content={flowRow?.flow_name} className={cx(gClasses.FTwo12GrayV3Important, gClasses.FontWeight500, gClasses.ML8)} />
      {flowRow?.category_name && (
        <Chip
          key={flowRow?.label}
          size={EChipSize.sm}
          textColor={COLOR.BLACK_20}
          backgroundColor={COLOR.GRAY_10}
          text={flowRow?.category_name}
          borderRadiusType={BorderRadiusVariant.circle}
          textClassName={cx(gClasses.FontWeight400, gClasses.FTwo11)}
          className={cx(gClasses.WhiteSpaceNoWrap, gClasses.ML8, gClasses.PR6)}
        />
      )}
    </div>
  );

  const getFlowDescription = (datalistRow) => (
    <Text
      content={datalistRow?.flow_description ? datalistRow?.flow_description : '-'}
      className={cx(
        gClasses.FTwo12GrayV3Important,
        gClasses.FontWeight500,
        gClasses.ML8,
        gClasses.Ellipsis,
        styles.DescWidth,
        gClasses.FTwo13GrayV98,
      )}
    />
  );

  const getAssignedOnDetails = (assigned_on) => {
    if (!assigned_on) return null;
    const dateTimeFormat = assigned_on.pref_datetime_display;

    if (dateTimeFormat) {
      const dateYear = dateTimeFormat.split(',')[0];
      const dateYearArray = dateYear.split(' ');
      const timeLabel = '';
      if (isSameDay(assigned_on.utc_tz_datetime)) {
        return `${timeLabel} ${parse12HoursTimeFromUTC(dateTimeFormat)}`;
      }
      return `${timeLabel} ${dateYearArray[1]} ${dateYearArray[0]}, ${dateYearArray[2]}`;
    }
    return null;
  };

  let noData = false;

  if ((isDataLoading) && !isLoadMoreDataLoading) {
    // flowListItems = Array(8)
    //   .fill()
    //   .map((eachCard, index) => (
    //     <TaskCard
    //       CardContainerStyle={styles.FlowCardContainer}
    //       isDataLoading
    //       key={index}
    //     />
    //   ));
      noData = false;
  } else if (!jsUtils.isEmpty(flow_list)) {
    noData = false;
    if (tab_index === FLOW_DROPDOWN.DRAFT_FLOW) {
      flowListItems = flow_list.map((flow) => {
        const flowData = flowDataEntity(flow);
        const onEditClick = (e) => {
          e?.stopPropagation();
          onActionHandler(flowData.getFlowUuid(), FLOW_ACTIONS.EDIT, flow);
        };
        const version = (
          <div
            className={cx(
              styles.VersionText,
              gClasses.FTwo12,
              gClasses.CenterV,
              (i18n.language === language.spanish_mexico) ? gClasses.W150 : gClasses.W125,
              gClasses.MR8,
              gClasses.ML8,
            )}
          >
            {flowData.getVersionNumberDisplay()}
            {', '}
            {flowData.getLastUpdateOnView()}
          </div>
        );
        const DatalistName = flowData.getFlowName();
        const datalistDesc = flowData.getFlowDescription();
        const editButton = (
          <button
            className={gClasses.PR16}
            onClick={onEditClick}
          >
            <Edit className={styles.EditIcon} />
          </button>
        );
        const avatarGroup = (
          <div className={cx(styles.DatalistIOwnAvatar)}>
            <UserDisplayGroup
              userAndTeamList={constructAvatarOrUserDisplayGroupList({
                teams: flowData.getFlowTeams(),
                users: flowData.getFlowUsers(),
              })}
              count={1}
              separator=", "
              popperPlacement={EPopperPlacements.AUTO}
              getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide)}
              getRemainingPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide)}
              className={cx(styles.UserList, gClasses.W100)}
            />
          </div>
        );
        const titleData = (
          <div
            role="presentation"
            className={cx(
              gClasses.FTwo13GrayV3,
              styles.FlowTitleContainer,
              gClasses.Ellipsis,
              gClasses.CenterV,
            )}
          >
            <FlowListingIcon className={gClasses.MinHW20} />
            <span className={cx(gClasses.TextTransformCap, gClasses.FTwo13GrayV3, gClasses.FontWeight500, styles.TaskDefinition, gClasses.ML8)}>{DatalistName}</span>
            {datalistDesc && (<span className={styles.TitleDescDivider} />)}
            {datalistDesc && (
              <span title={datalistDesc} className={cx(styles.DatalistDesc, gClasses.FTwo12, styles.TaskDefinition)}>
                {datalistDesc}
              </span>
            )}
          </div>
        );
        return {
          id: flow.flow_uuid,
          component: [titleData, avatarGroup, version, editButton],
        };
      });
      } else {
      const flowData = [];
      flow_list.forEach((eachDatalist) => {
        const rowData = { component: [], id: EMPTY_STRING };
        rowData.component = [getFlowTitleAndCategory(eachDatalist), getFlowDescription(eachDatalist), getAssignedOnDetails(eachDatalist?.last_updated_on)];
        rowData.id = eachDatalist?.flow_uuid;
        flowData.push(rowData);
      });
      flowListItems = flowData;
    }
  } else {
    noData = true;
  }

  let flowEditConfirmationModal = null;
  if (isTestBedEditModalVisible) {
    const modalStrings = EDIT_LIVE_FLOW_STRINGS(t);
    jsUtils.set(modalStrings, ['CONTENT', 2, 'URI'], getTestBedFlowLink(flowUuidToBeEdited));
    flowEditConfirmationModal = (
      <ModalLayout
        id="test_bed_confirmation_modal"
        isModalOpen
        onCloseClick={closeTestBedEditModal}
        headerContent={
          <div className={cx(gClasses.ModalHeader, gClasses.PY10)}>
            {`${t(FLOW_LIST_BUTTONS.EDIT)} - ${flowName}`}
          </div>
        }
        mainContent={
          <TestBedConfirmationScreen
            onGoBackClickHandler={closeTestBedEditModal}
            primaryCtaClicked={closeTestBedEditModal}
            strings={modalStrings}
            contentType={CONTENT_TYPE.POINTS}
          />
        }
      />
    );
  }

  const handleCardClick = (id) => {
    onCardClick(id, tab_index === FLOW_DROPDOWN.DRAFT_FLOW, tab_index === FLOW_DROPDOWN.UNDER_TESTING);
  };

  // const postPromptDataToCreateFlow = (data, controller) => {
  //   const { postFlowCreationPrompt } = props;
  //   postFlowCreationPrompt(data, controller, history, { pathname: history.location.pathname, search: '?create=flow' }, t);
  // };

  const tableViewFlow = () => (
    <div>
      {
        noData ?
        <div className={gClasses.MX30}>
          <NoDataFound
            dataText={getNoDataFoundStrings(t, tab_index, searchText)}
            originalLocation="Flows"
            NoSearchFoundLabelStyles={gClasses.BoxShadowNone}
          />
        </div> : (
          <div id={SCROLLABLE_DIV_ID} className={cx(styles.TableFlowContainer, gClasses.W100, { [styles.TableTrialContainer]: isTrialDisplayed })}>
            <TableWithInfiniteScroll
              scrollableId={SCROLLABLE_DIV_ID}
              tableClassName={cx(styles.FlowTable, gClasses.W100, { [styles.DraftTable]: tab_index === FLOW_DROPDOWN.DRAFT_FLOW })}
              header={FLOW_NORMAL_HEADERS(tab_index === FLOW_DROPDOWN.DRAFT_FLOW, t)}
              data={flowListItems}
              isLoading={isDataLoading}
              isRowClickable
              onRowClick={handleCardClick}
              scrollType={TableScrollType.BODY_SCROLL}
              hasMore={hasMore}
              onLoadMore={onLoadMoreCallHandler}
              loaderRowCount={4}
              widthVariant={TableColumnWidthVariant.CUSTOM}
            />
          </div>
        )
      }
    </div>
    );

    const onSortHandler = (sortId) => {
      const sortObject = jsUtils.filter(FLOW_LISTING_SORT_OPTIONS(t), [FLOW_KEY_ID(t).VALUE, sortId])[0];
      const additionParams = {
        sort_field: sortObject?.type,
        sort_by: sortObject?.sortBy,
      };
      onFlowListDataChange({ sortLabel: sortObject.label, sortValue: sortObject.value, sortBy: sortObject?.sortBy });
      getFlowListFromAction(1, searchText, true, additionParams);
    };

  // Sort Flows
  const getSortPopper = () => (
    <Popper
      targetRef={sortPopOverTargetRef}
      open={isSortPopOverVisible}
      placement={EPopperPlacements.BOTTOM_START}
      className={gClasses.ZIndex10}
      content={
        <DropdownList
          optionList={FLOW_LISTING_SORT_OPTIONS(t)}
          onClick={onSortHandler}
          selectedValue={sortValue}
        />
      }
    />
  );

  // Show by popover
  const getShowByPopper = () => (
    <Popper
      targetRef={showByPopOverTargetRef}
      open={isShowByPopOverVisible}
      placement={EPopperPlacements.BOTTOM_START}
      className={gClasses.ZIndex10}
      content={
        <DropdownList
          optionList={optionList}
          onClick={onTabChangeHandler}
          selectedValue={selectedValue}
        />
      }
    />
  );

    // Search Icon
    const getSearchIcon = () => (
      <button
        aria-label={ICON_ARIA_LABELS.SEARCH}
        className={gClasses.CenterV}
        onClick={() => setIsSearchFocus(!isSearchFocus)}
      >
        <LandingPageSearchIcon />
      </button>
    );

  return (
    <div>
        {/* <div className={cx(styles.SearchSortContainer, BS.FLEX, BS.JC_BETWEEN)}>
        {optionList && !isMobile && role !== ROLES.MEMBER && (
          <div>
            <Tab
              className={styles.TabSpacing}
              selectedIndex={selectedValue}
              tabIList={optionList}
              type={TAB_TYPE.TYPE_7}
              tabTextClassName={styles.TabTextClassName}
              setTab={onTabChangeHandler}
            />
          </div>
        )}
        <div className={cx(styles.SearchContainer, !isMobile && role !== ROLES.MEMBER && styles.maxWidth20)}>
          <SearchTab
            input={input}
            onCardClick={onCardClick}
            tab_index={tab_index}
            tab_id={FLOW_DROPDOWN.ID}
            isSearchTabOpen={isSearchTabOpen}
            searchText={searchText}
            initiateFlowFromList={initiateFlowFromList}
          />
        </div>
        {optionList && isMobile && role !== ROLES.MEMBER && (
          <div>
            <Dropdown
              dropdownListClasses={styles.DropdownList}
              id={FLOW_MANAGED_BY_TYPE.ID}
              optionList={optionList}
              onChange={onTabChangeHandler}
              selectedValue={selectedValue}
              tabBased
              isNewDropdown
              isBorderLess
              noInputPadding
              isTaskDropDown
              isSortDropdown
              optionsNoWrap
            />
          </div>
        )}
        </div> */}
      {/* {isEnablePrompt &&
        <div className={gClasses.M30}>
          {
            enablePrompt && (
              <PromptInput
                postDataToCreateSource={postPromptDataToCreateFlow}
                placeholder={t(FLOW_CREATION_NLP.PLACEHOLDER)}
              />
            )
          }
        </div>
      } */}
      <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.MX24, gClasses.PT16, gClasses.PB16)}>
        <Text
          content={`${FLOW_KEY_ID(t).SHOWING} ${total_count} ${FLOW_KEY_ID(t).FLOWS}`}
          className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500)}
          isLoading={isDataLoading}
        />
        <div className={cx(gClasses.Gap16, gClasses.CenterV, gClasses.JusEnd)}>
          <div className={gClasses.M16}>
            <Input
              content={searchText || EMPTY_STRING}
              prefixIcon={getSearchIcon()}
              onChange={input.onChange}
              onFocusHandler={() => setIsSearchFocus(true)}
              onBlurHandler={() => setIsSearchFocus(false)}
              iconPosition={EInputIconPlacement.left}
              className={cx(styles.SearchOuterContainer, { [styles.ExpandedSearch]: isSearchFocus })}
              placeholder={FLOW_KEY_ID(t).SEARCH_PLACEHOLDER}
              size={Size.md}
              suffixIcon={
                searchText && (
                  <LandingSearchExitIcon
                    title={ICON_STRINGS.CLEAR}
                    className={cx(styles.SearchCloseIcon, gClasses.CursorPointer, gClasses.Width8, gClasses.MR6)}
                    tabIndex={0}
                    height={12}
                    width={12}
                    ariaLabel={ICON_STRINGS.CLEAR}
                    role={ARIA_ROLES.BUTTON}
                    onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && input.onChange({ target: { value: EMPTY_STRING } })}
                    onClick={() => input.onChange({ target: { value: EMPTY_STRING } })}
                  />
                )
              }
              borderRadiusType={BorderRadiusVariant.rounded}
            />
          </div>
          <div className={gClasses.CenterV}>
            <Text content={FLOW_KEY_ID(t).SHOW_BY} className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500, gClasses.MR8)} />
            <button onClick={() => setIsShowByPopOverVisible((prevState) => !prevState)} ref={showByPopOverTargetRef} className={cx(gClasses.FTwo12BlueV39, gClasses.FontWeight500, styles.SortContainer, gClasses.gap8, gClasses.CenterV)}>
              {jsUtils.filter(optionList, [FLOW_KEY_ID(t).VALUE, selectedValue])?.[0]?.label}
              <SortDropdownIcon />
              {getShowByPopper()}
            </button>
          </div>
          {tab_index !== FLOW_DROPDOWN.DRAFT_FLOW && (
            <div className={gClasses.CenterV}>
              <Text content={SORT_DROP_DOWN.PLACE_HOLDER} className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500, gClasses.MR8)} />
              <button onClick={() => setIsSortPopOverVisible((prevState) => !prevState)} ref={sortPopOverTargetRef} className={cx(gClasses.FTwo12BlueV39, gClasses.FontWeight500, styles.SortContainer, gClasses.gap8, gClasses.CenterV)}>
                {sortLabel}
                <SortDropdownIcon />
                {getSortPopper()}
              </button>
            </div>)}
        </div>
      </div>
      <div className={cx(
        styles.FlowListingContainer,
          tab_index === FLOW_DROPDOWN.DRAFT_FLOW && gClasses.PR0IMP,
          (tab_index === FLOW_DROPDOWN.DRAFT_FLOW) && gClasses.PL0,
        )}
      >
        {tableViewFlow()}
      </div>
      {((history.location.pathname.includes('createFlow'))) ? <InitFlowModal /> : null}
      {flowEditConfirmationModal}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    flowListState: state.FlowListReducer,
    isDataLoading: state.FlowListReducer.isDataLoading,
    isLoadMoreDataLoading: state.FlowListReducer.isLoadMoreDataLoading,
    tab_index: state.FlowListReducer.tab_index,
    flow_list: state.FlowListReducer.flow_list,
    document_url_details: state.FlowListReducer.document_url_details,
    userId: state.RoleReducer.user_id,
    total_count: state.FlowListReducer.total_count,
    common_server_error: state.FlowListReducer.common_server_error,
    hasMore: state.FlowListReducer.hasMore,
    role: state.RoleReducer.role,
    flow_tab_index: state.FlowListReducer.tab_index,
    flowData: state.EditFlowReducer.flowData,
    enablePrompt: state.RoleReducer.enable_prompt,
    isTrialDisplayed: state.NavBarReducer.isTrialDisplayed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navbarChange: (data) => {
      dispatch(NavBarDataChange(data));
    },
    onFlowListDataChange: (data) => {
      dispatch(flowListDataChange(data));
    },
    dispatch,
    getDraftFlowsListDataApi: (params, type) => {
      dispatch(getDraftFlowsListDataThunk(params, type));
    },
    getAllDevFlowsThunk: (params, type) => {
      dispatch(getAllDevFlowsThunk(params, type));
    },
    initiateFlow: (data, history, redirectedFrom, urlData) => {
      dispatch(initiateFlowApi(data, history, redirectedFrom, urlData));
    },
    onFlowStateChange: (...params) => {
      dispatch(updateFlowStateChange(...params));
    },
    postFlowCreationPrompt: (...params) => {
      dispatch(postFlowCreationPromptThunk(...params));
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListFlow),
);
