import React, { Component } from 'react';
import cx from 'classnames/bind';
import i18next from 'i18next';
import propType from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isEmpty, isEqual } from 'lodash';
import { DATA_LIST_DASHBOARD, DRAFT_TASK, SNOOZED_TASK, TEST_BED } from 'urls/RouteConstants';
import { BS } from 'utils/UIConstants';
import {
  keydownOrKeypessEnterHandle,
  priorityTask,
} from 'utils/UtilityFunctions';
import {
  commonHeaderChange,
  NavBarDataChange,
} from 'redux/actions/NavBar.Action';
import { REDIRECTED_FROM, TASK_PRIORITY_TYPE, ROUTE_METHOD } from 'utils/Constants';
import { getTaskHeader } from 'components/list_headers/ListHeader.utils';
import BugIcon from 'assets/icons/flow/BugIcon';
import AttachmentsIcon from 'assets/icons/AttachmentsIcon';
import { language } from 'language/config';
import { withTranslation } from 'react-i18next';
import Task from 'containers/task/task/Task';
import FlowTask from 'containers/flow/flow_dashboard/task/Task';
import DataListTask from 'containers/data_list/view_data_list/addTask/Task';
import { BorderRadiusVariant, ButtonContentVaraint, DropdownList, EInputIconPlacement, EPopperPlacements, Input, PaginationButtonPlacement, Popper, Size, TableColumnWidthVariant, TableScrollType, TableWithInfiniteScroll, TableWithPagination, Text, UserDisplayGroup } from '@workhall-pvt-lmt/wh-ui-library';
import {
  ARIA_LABELS,
  M_T_STRINGS,
  TASK_ACCORDION_INDEX,
  TASK_CONTENT_STRINGS,
  TASK_TAB_INDEX,
} from '../LandingPage.strings';
import gClasses from '../../../scss/Typography.module.scss';
import { EMPTY_STRING, SPACE } from '../../../utils/strings/CommonStrings';
import {
  getDevRoutePath,
  getPopperContent,
  getRouteLink,
  getUserRoutePath,
  isBasicUserMode,
  onWindowResize,
  routeNavigate,
} from '../../../utils/UtilityFunctions';
import {
  getCompletedTaskListDataThunk,
  getSearchCompletedTaskListDataThunk,
  getActiveTaskListDataThunk,
  getSnoozedTaskListDataThunk,
  getSelfTaskListDataThunk,
  getAssignedTaskListDataThunk,
  getSearchAssignedTaskListDataThunk,
  taskListDataChange,
  clearTaskContentData,
  setSearchAccordionIndexAction,
  getDraftTaskListDataThunk,
  getTaskResultsListThunk,
  getSearchDraftTaskListDataThunk,
} from '../../../redux/actions/TaskActions';
import { store } from '../../../Store';
import {
  TASKS,
  HOME,
  COMPLETED_TASKS,
  OPEN_TASKS,
  ASSIGNED_TO_OTHERS_TASKS,
  SELF_TASK,
  LIST_FLOW,
  FLOW_DASHBOARD,
  FLOW_TEST_BED_MANAGED_BY_YOU,
} from '../../../urls/RouteConstants';
import {
  getTabFromUrl,
  getTabFromUrlForBasicUserMode,
  getTaskUrl,
  isAssigneedToOtherTab,
  isCompletedTab,
  isOpenTab,
  isSnoozedTab,
  TASK_CATEGORY_ADHOC_TASK,
  TASK_CATEGORY_DATALIST_ADHOC_TASK,
  TASK_CATEGORY_FLOW_ADHOC_TASK,
  TASK_CATEGORY_FLOW_TASK,
} from '../../../utils/taskContentUtils';
import jsUtils from '../../../utils/jsUtility';
import styles from './MyTasks.module.scss';
import { getCardCount, getLandingListingRowCount } from '../../../utils/generatorUtils';
import {
  getAssignedOnDetails,
  SCROLLABLE_DIV_ID,
  getCurrentTabTitle,
  getTasksDescription,
  ACTIVE_TASK_SORT_DETAILS,
  ASSIGNED_TASK_SORT_DETAILS,
  ASSIGNED_TASK_TYPES,
  COMPLETED_TASK_SORT_DETAILS,
  DRAFT_TASK_SORT_DETAILS,
  getCurrentTabNoDataText,
  getSortTypeBySortIndex,
  getDueType,
} from './MyTasks.utils';
import TaskContent from './task_content/TaskContent';
import { LANDING_PAGE } from '../LandingPageTranslation.strings';
import { LANDING_PAGE_TOPICS } from '../main_header/common_header/CommonHeader.strings';
import NoDataFound from '../no_data_found/NoDataFound';
import { postTaskCreationPromptThunk } from '../../../redux/actions/TaskCreationPrompt.Action';
import { dateDuration } from '../../data_list/view_data_list/data_list_entry_task/DataListEntryTask.utils';
import TaskListingIcon from '../../../assets/icons/landing_page/TaskListingIcon';
import LandingFilterIcon from '../../../assets/icons/landing_page/LandingFilterIcon';
import RefreshIcon from '../../../assets/icons/landing_page/RefreshIcon';
import LandingPageSearchIcon from '../../../assets/icons/landing_page/LandingPageSearchIcon';
import { ICON_STRINGS } from '../../../components/list_and_filter/ListAndFilter.strings';
import LandingSearchExitIcon from '../../../assets/icons/LandingSearchExitIcon';
import { ARIA_ROLES } from '../../../utils/UIConstants';
import LandingPageFilter from '../landing_page_filter/LandingPageFilter';
import SortDropdownIcon from '../../../assets/icons/landing_page/SortDropdownIcon';
import Edit from '../../../assets/icons/application/EditV2';
import { SORT_DROP_DOWN } from '../../flow/listFlow/listFlow.strings';
import { MY_TASK_STRINGS } from './MyTasks.strings';
import { constructAvatarGroupList } from '../../application/app_listing/AppListing.utils';

let cancelForGetActiveTasks;
let cancelForGetAssignedTasks;
let cancelForGetBothAssignedTasks;
let cancelForGetCompletedTasks;
let cancelForGetSelfTasks;
let cancelForGetSnoozedTasks;
let cancelForGetDraftTasks;

export const getCancelTokenActiveTask = (cancelToken) => {
  cancelForGetActiveTasks = cancelToken;
  return cancelToken;
};

export const getCancelTokenAssignedTask = (cancelToken) => {
  cancelForGetAssignedTasks = cancelToken;
  return cancelToken;
};

export const getCancelTokenBothAssignedTask = (cancelToken) => {
  cancelForGetBothAssignedTasks = cancelToken;
  return cancelToken;
};

export const getCancelTokenCompletedTask = (cancelToken) => {
  cancelForGetCompletedTasks = cancelToken;
  return cancelToken;
};

export const getCancelTokenSelfTask = (cancelToken) => {
  cancelForGetSelfTasks = cancelToken;
  return cancelToken;
};

export const getCancelTokenSnoozedTask = (cancelToken) => {
  cancelForGetSnoozedTasks = cancelToken;
  return cancelToken;
};

export const getCancelTokenDraftTask = (cancelToken) => {
  cancelForGetDraftTasks = cancelToken;
  return cancelToken;
};

class MyTasks extends Component {
  constructor(props) {
    super(props);
    this.messageListContainerRef = React.createRef();
    this.filterPopOverTargetRef = React.createRef();
    this.sortPopOverTargetRef = React.createRef();
    this.containerCompRef = null;
    this.headerCompRef = null;
    this.listCompRef = null;
    this.searchDataPerPage = 40;
    this.assignedTaskPerPageCount = 3;
    this.state = {
      isModalOpen: false,
      // isMobile: isMobileScreen(),
      replaceHistory: false,
      appliedFilterList: [],
      updatedAppliedFilterList: [],
      isSearchFocus: false,
      isFilterPopOverVisible: false,
      isSortPopOverVisible: false,
      height: 0,
    };
  }

  async componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
    document.addEventListener('mousedown', (event) => {
      if (this.sortPopOverTargetRef.current && !this.sortPopOverTargetRef.current.contains(event.target)) {
        this.setState({ isSortPopOverVisible: false });
      }
    });
    const {
      location,
      onTaskListDataChange,
      hideTaskList,
      onCommonHeaderChange,
      isFilterApplied,
      clearTaskContentReduxState,
      match,
      t,
    } = this.props;
    const { TASK_LIST } = M_T_STRINGS;
    const currentTabIndex = getTabFromUrl(location.pathname) || 1;
    this.currentAssignedOpenPage = 1;
    this.currentAssignedCompletedPage = 1;
    const is_filter_applied = location?.state?.is_filter_applied;
    if (is_filter_applied) {
      this.setState({
        appliedFilterList: location?.state?.appliedFilterList,
      });
    }
    if (isFilterApplied || is_filter_applied) {
      await onTaskListDataChange({ dueDateIndex: -1 });
      await this.onDueDateDropdownChange(-1, isFilterApplied);
    }
    await onCommonHeaderChange({
      tabOptions: TASK_LIST.TASK_DROPDOWN(t, currentTabIndex, true),
      button: null,
      kebabMenuOptionList: TASK_LIST.TASK_DROPDOWN_KEBAB_OPTION(t, currentTabIndex, true),
    });
    if (jsUtils.isObject(location) && !hideTaskList) {
      await onTaskListDataChange({
        tab_index: currentTabIndex,
      });
    }
    this.calculateListSize();
    await this.calculateCardCount();
    this.getTaskList(M_T_STRINGS.TASK_LIST.GET_TASK_LIST, currentTabIndex);
    if (match?.params?.pid) {
      this.setState({
        isModalOpen: true,
      });
    }
    onWindowResize(this.windowResize);
    clearTaskContentReduxState();
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      location,
      tab_index,
      onTaskListDataChange,
      searchText,
      onCommonHeaderChange,
      match,
      t,
    } = this.props;
    const { height } = this.state;
    const { location: prevLocation, match: prevMatch } = prevProps;
    let selectedLabel; EMPTY_STRING;
    const { TASK_LIST } = M_T_STRINGS;
    if (tab_index === TASK_TAB_INDEX.COMPLETED) {
      selectedLabel = TASK_LIST.SORT_BY_COMPLETED.OPTION_LIST(t)?.[0]?.label;
    } else if (tab_index === TASK_TAB_INDEX.ASSIGNED_TO_OTHERS) {
      selectedLabel = TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.OPTION_LIST(t)?.[0]?.label;
    } else if (tab_index === TASK_TAB_INDEX.DRAFT_TASK) {
      selectedLabel = TASK_LIST.SORT_BY_EDITED.OPTION_LIST(t)?.[0]?.label;
    } else {
      selectedLabel = TASK_LIST.SORT_BY_ACTIVE_TASKS.OPTION_LIST(t)?.[0]?.label;
    }
    if (!isEqual(location, prevLocation) || (prevState?.height !== height && tab_index !== TASK_TAB_INDEX.ASSIGNED_TO_OTHERS)) {
      if (match?.params?.pid) {
        this.setState({
          isModalOpen: true,
        });
        onTaskListDataChange({
          activeTaskId: match?.params?.pid,
          selectedCardData: {},
        });
      }
      if ((prevMatch?.params?.tab != null && prevMatch?.params?.tab !== match?.params?.tab) || (prevState?.height !== height)) {
        const currentTabIndex = getTabFromUrl(location.pathname) || 1;
        await onCommonHeaderChange({
          tabOptions: TASK_LIST.TASK_DROPDOWN(t, tab_index, true),
          button: null,
          kebabMenuOptionList: TASK_LIST.TASK_DROPDOWN_KEBAB_OPTION(t, tab_index, true),
        });
        this.scrollToBottom();
        // While switching tab, reload the list and move the scroll to top
        const scrollDiv = document.getElementById(SCROLLABLE_DIV_ID);
        scrollDiv?.scrollTo(0, 0);
        await onTaskListDataChange({
          tab_index: currentTabIndex,
          active_tasks_list: [],
          document_url_details: [],
          sortIndex: (Number(currentTabIndex) === 3) ? null : -1,
          selectedSortLabel: selectedLabel,
          assignedOnIndex: -1,
          taskTypeIndex: -1,
          dueDateIndex: -3,
          currentPage: 1,
          count: null,
          searchAccordionIndex: searchText ? Number(currentTabIndex) : 0,
        });
        if (currentTabIndex) {
          this.currentPage = 1;
          this.currentAssignedOpenPage = 1;
          this.currentAssignedCompletedPage = 1;
          this.calculateListSize();
          await this.calculateCardCount();
          this.getTaskList(M_T_STRINGS.TASK_LIST.GET_TASK_LIST, currentTabIndex);
          this.setState({
            appliedFilterList: [],
            updatedAppliedFilterList: [],
          });
        } else {
          onTaskListDataChange({
            isTaskDataLoading: false,
          });
        }
      }
    }
    const currentTabIndex = getTabFromUrl(location.pathname) || 1;
    await onCommonHeaderChange({
      tabOptions: TASK_LIST.TASK_DROPDOWN(t, currentTabIndex, true),
      button: null,
      kebabMenuOptionList: TASK_LIST.TASK_DROPDOWN_KEBAB_OPTION(t, currentTabIndex, true),
    });
  }

  componentWillUnmount() {
    const { toggleFunction, onTaskListDataChange } = this.props;
    window.removeEventListener('resize', this.updateDimensions);
    document.removeEventListener('mousedown', (event) => {
      if (this.sortPopOverTargetRef.current && !this.sortPopOverTargetRef.current.contains(event.target)) {
        this.setState({ isSortPopOverVisible: false });
      }
    });
    toggleFunction({ isNavVisible: true });
    onTaskListDataChange({
      searchText: EMPTY_STRING,
      isFilterApplied: false,
      dueDateIndex: -3,
      assignedOnIndex: -1,
      taskTypeIndex: -1,
    });
    this.cancelApiIfPersists();
  }

  render() {
    const { TASK_LIST } = M_T_STRINGS;
    const {
      active_tasks_list,
      snoozed_tasks_list,
      common_server_error,
      hasMore,
      hasMoreSnoozed,
      tab_index,
      toggleFunction,
      sortIndex,
      isTaskDataLoading,
      searchText,
      hideTaskList,
      setModalBg,
      history,
      isTaskSearchLoading,
      assignedOpenTaskCount,
      isAssignedOpenTaskLoading,
      isAssignedOpenTaskLoadMore,
      assignedCompletedTaskCount,
      isAssignedCompletedTaskLoading,
      isAssignedCompletedTaskLoadMore,
      taskTypeIndex,
      assignedOnIndex,
      dueDateIndex,
      selectedSortLabel,
      t,
      isTrialDisplayed,
    } = this.props;
    const { isModalOpen, appliedFilterList, isSearchFocus, isFilterPopOverVisible, isSortPopOverVisible } =
      this.state;
    const isInitialLoading = isTaskDataLoading;
    const { SEARCH_PLACEHOLDER, SHOWING, TASKS_SHOWING, TASK_SCROLL_ID } = MY_TASK_STRINGS(t);

    const activeTaskId = this.getTaskIdFromUrl();
    const input = {
      onChange: this.handleInputChange,
      placeholder: t(TASK_LIST.SEARCH_BAR.PLACEHOLDER),
      id: TASK_LIST.SEARCH_BAR.ID,
      isVisible: true,
    };

    let dropdown;
    let taskTypeDropdown;
    let assignedOnTypeDropdown;
    let dueDateDropdown;
    if (tab_index === TASK_TAB_INDEX.COMPLETED) {
      dropdown = {
        optionList: TASK_LIST.SORT_BY_COMPLETED.OPTION_LIST(t),
        placeholder: t(TASK_LIST.SORT_BY_COMPLETED.PLACEHOLDER),
        onChange: this.onSortDropdownChange,
        isVisible: true,
        id: 'sort_dropdown',
        selectedValue: sortIndex,
        label: t(TASK_LIST.SORT_BY_COMPLETED.LABEL),
      };
      assignedOnTypeDropdown = {
        optionList: TASK_LIST.SORT_BY_COMPLETED.COMPLETED_ON(t),
        placeholder: t(TASK_LIST.SORT_BY_COMPLETED.PLACEHOLDER),
        onChange: this.onAssignedOnDropdownChange,
        isVisible: true,
        id: 'sort_dropdown',
        selectedValue: assignedOnIndex,
        label: t(TASK_LIST.SORT_BY_COMPLETED.ASSIGNED_LABEL),
      };
    } else if (tab_index === TASK_TAB_INDEX.ASSIGNED_TO_OTHERS) {
      dropdown = {
        optionList: TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.OPTION_LIST(t),
        placeholder: t(TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.PLACEHOLDER),
        onChange: this.onSortDropdownChange,
        isVisible: true,
        id: 'sort_dropdown',
        selectedValue: sortIndex || -1,
        label: t(TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.LABEL),
      };
      taskTypeDropdown = {
        optionList: TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.TASK_TYPE(t),
        placeholder: t(TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.PLACEHOLDER),
        onChange: this.onTaskTypeDropdownChange,
        isVisible: true,
        id: 'sort_dropdown',
        selectedValue: taskTypeIndex,
        label: t(TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.TASK_TYPE_LABEL),
      };
      assignedOnTypeDropdown = {
        optionList: TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.ASSIGNED_ON(t),
        placeholder: t(TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.PLACEHOLDER),
        onChange: this.onAssignedOnDropdownChange,
        isVisible: true,
        id: 'sort_dropdown',
        selectedValue: assignedOnIndex,
        label: t(TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.ASSIGNED_ON_LABEL),
      };
      dueDateDropdown = {
        optionList: TASK_LIST.SORT_BY_DUE_DATE.OPTION_LIST(t),
        placeholder: t(TASK_LIST.SORT_BY_ACTIVE_TASKS.PLACEHOLDER),
        onChange: this.onDueDateDropdownChange,
        isVisible: true,
        id: TASK_LIST.SORT_BY_DUE_DATE.ID,
        selectedValue: dueDateIndex,
        label: t(TASK_LIST.SORT_BY_DUE_DATE.LABLE),
      };
    } else if (tab_index === TASK_TAB_INDEX.DRAFT_TASK) {
      dropdown = {
        optionList: TASK_LIST.SORT_BY_EDITED.OPTION_LIST(t),
        placeholder: t(TASK_LIST.SORT_BY_EDITED.PLACEHOLDER),
        onChange: this.onSortDropdownChange,
        isVisible: true,
        id: 'sort_dropdown',
        selectedValue: sortIndex,
        label: TASK_LIST.SORT_BY_EDITED.OPTION_LIST.LABEL,
      };
      assignedOnTypeDropdown = {
        optionList: TASK_LIST.SORT_BY_EDITED.LAST_UPDATED_ON(t),
        placeholder: t(TASK_LIST.SORT_BY_EDITED.PLACEHOLDER),
        onChange: this.onAssignedOnDropdownChange,
        isVisible: true,
        id: 'sort_dropdown',
        selectedValue: assignedOnIndex,
        label: t(TASK_LIST.SORT_BY_EDITED.ASSIGNED_ON_LABEL),
      };
    } else {
      dropdown = {
        optionList: TASK_LIST.SORT_BY_ACTIVE_TASKS.OPTION_LIST(t),
        placeholder: t(TASK_LIST.SORT_BY_ACTIVE_TASKS.PLACEHOLDER),
        onChange: this.onSortDropdownChange,
        isVisible: true,
        id: 'sort_dropdown',
        selectedValue: sortIndex,
        label: t(TASK_LIST.SORT_BY_ACTIVE_TASKS.LABEL),
      };
      taskTypeDropdown = {
        optionList: TASK_LIST.SORT_BY_ACTIVE_TASKS.TASK_TYPE(t),
        placeholder: t(TASK_LIST.SORT_BY_ACTIVE_TASKS.PLACEHOLDER),
        onChange: this.onTaskTypeDropdownChange,
        isVisible: true,
        id: 'sort_dropdown',
        selectedValue: taskTypeIndex,
        label: t(TASK_LIST.SORT_BY_ACTIVE_TASKS.TASK_TYPE_LABEL),
      };
      assignedOnTypeDropdown = {
        optionList: TASK_LIST.SORT_BY_ACTIVE_TASKS.ASSIGNED_ON(t),
        placeholder: t(TASK_LIST.SORT_BY_ACTIVE_TASKS.PLACEHOLDER),
        onChange: this.onAssignedOnDropdownChange,
        isVisible: true,
        id: 'sort_dropdown',
        selectedValue: assignedOnIndex,
        label: t(TASK_LIST.SORT_BY_ACTIVE_TASKS.ASSIGNED_ON_LABEL),
      };
      dueDateDropdown = {
        optionList: TASK_LIST.SORT_BY_DUE_DATE.OPTION_LIST(t),
        placeholder: t(TASK_LIST.SORT_BY_ACTIVE_TASKS.PLACEHOLDER),
        onChange: this.onDueDateDropdownChange,
        isVisible: true,
        id: TASK_LIST.SORT_BY_DUE_DATE.ID,
        selectedValue: dueDateIndex,
        label: t(TASK_LIST.SORT_BY_DUE_DATE.LABLE),
      };
    }

    let taskContent = null;
    if (
      jsUtils.isEmpty(active_tasks_list) &&
      jsUtils.isEmpty(searchText) &&
      !isTaskDataLoading
    ) {
      dropdown.isVisible = false;
      input.isVisible = false;
    }
    const { location } = this.props;
    if (
      activeTaskId &&
      getTabFromUrl(location.pathname) !== TASK_TAB_INDEX.DRAFT_TASK
    ) {
      const { state } = history.location;
      let redirectURL = `${TASKS}/${OPEN_TASKS}`;
      let breadCrumbText = t(LANDING_PAGE_TOPICS.TASKS);
      const breadcrumbList = [];
      const { title = EMPTY_STRING, route = EMPTY_STRING } = this.getBreadCrumbTitle();
      switch (history?.location?.state?.redirectedFrom) {
        case REDIRECTED_FROM.HOME:
          breadCrumbText = title;
          redirectURL = route;
          breadcrumbList.push({
              route: getDevRoutePath(HOME),
              text: t(LANDING_PAGE_TOPICS.HOME),
          });
          break;
        case REDIRECTED_FROM.FLOW_DASHBOARD:
          if (state?.isTestBed) {
            redirectURL = `${FLOW_DASHBOARD}/${TEST_BED}/${state.flow_uuid}`;
          } else {
          redirectURL = `${FLOW_DASHBOARD}/${state.flow_uuid}`;
          }
          breadCrumbText = state.sourceName;
          break;
        case REDIRECTED_FROM.FLOW_DATA_INSTANCE:
          redirectURL = `${FLOW_DASHBOARD}/${state.flow_uuid}/${state.instance_id}`;
          breadCrumbText = state.sourceName;
          break;
        case REDIRECTED_FROM.FLOW_DASHBOARD_TEST_BED:
          redirectURL = `${FLOW_DASHBOARD}/${TEST_BED}/${state.flow_uuid}`;
          breadCrumbText = state.sourceName;
          break;
        case REDIRECTED_FROM.FLOW_LIST:
          redirectURL = LIST_FLOW + state.flowTabUrl;
          breadCrumbText = t(LANDING_PAGE_TOPICS.FLOW);
          break;
        case REDIRECTED_FROM.DATALIST_INSTANCE:
          redirectURL = `${DATA_LIST_DASHBOARD}/${state.data_list_uuid}/${state.instance_id}`;
          breadCrumbText = state.sourceName;
          break;
        case REDIRECTED_FROM.TASK_LIST:
          breadCrumbText = title;
          redirectURL = route;
          breadcrumbList.push({
            route: getDevRoutePath(`${TASKS}/${OPEN_TASKS}`),
            text: t(LANDING_PAGE_TOPICS.TASKS),
          });
          break;
        default: break;
      }

      breadcrumbList.push({
        text: breadCrumbText,
        route: getRouteLink(redirectURL, history),
        className: styles.TaskTabNameClass,
      });

      console.log('breadcrumbListbreadcrumbList', breadcrumbList);

      taskContent = (
        isModalOpen &&
            // <Modal
            //   id="task-content-modal"
            //   right={tab_index === TASK_TAB_INDEX.DRAFT_TASK}
            //   centerVH={
            //     tab_index !== TASK_TAB_INDEX.DRAFT_TASK || isMobile
            //   }
            //   contentClass={cx(
            //     tab_index !== TASK_TAB_INDEX.DRAFT_TASK
            //       ? cx(styles.TaskContentModal)
            //       : styles.OpenTaskModalContainer,
            //     gClasses.ModalContentClassWithoutPadding,
            //     (isMobile) && gClasses.OverflowHiddenImportant,
            //   )}
            //   containerClass={cx(
            //     tab_index !== TASK_TAB_INDEX.DRAFT_TASK
            //       ? styles.ModalCotainerClass
            //       : null,
            //   )}
            //   isModalOpen={isModalOpen}
            //   onCloseClick={this.onCloseIconClick}
            //   // noCloseIcon
            //   noUnmountToggle
            // >
              <TaskContent
                initialBreadCrumbList={breadcrumbList}
                id={activeTaskId}
                onTaskSuccessfulSubmit={this.onTaskSuccessfulSubmit}
                setModalBg={setModalBg}
                isFlowInitiationTask={hideTaskList}
                getAssignedTaskList={this.getAssignedTaskList}
                // onCloseClick={() => this.setState({ taskModalOpen: false })}
                currentTab={getCurrentTabTitle(t, tab_index)}
                onCloseIconClick={this.onCloseIconClick}
              />
            // </Modal>
            );
    } else if (activeTaskId) {
      console.log(location.state, 'bfjkdghkjdfhgjkhfjkdgh');
      if (location?.state?.taskDetails?.flow_uuid) {
        taskContent = (
          <FlowTask
            flowInstanceId={location.state.taskDetails.instance_id}
            flowName={location.state.taskDetails.reference_name}
            flowUuid={location.state.taskDetails.flow_uuid}
            isEditTask
            onCloseIconClick={this.onCloseIconClick}
            onAddTaskClosed={this.onCloseIconClick}
            isModalOpen={isModalOpen}
          />
        );
        console.log('card click location', taskContent, location, activeTaskId);
      } else if (location?.state?.taskDetails?.data_list_uuid) {
        taskContent = (
          <DataListTask
            dataListName={location.state.taskDetails.reference_name}
            dataListUuid={location.state.taskDetails.data_list_uuid}
            dataListEntryId={location.state.taskDetails.data_list_entry_id}
            onAddTaskClosed={this.onCloseIconClick}
            referenceId={() => { }}
            isEditTask
            onCloseIconClick={this.onCloseIconClick}
            isModalOpen={isModalOpen}
          />
        );
      } else {
        taskContent = <Task isEditTask onCloseClick={this.onCloseIconClick} isModalOpen={isModalOpen} />;
      }
    }
    let listItems = [];
    let assignedTaskOpened = [];
    let assignedTaskCompleted = [];
    let isNoData = false;

    if (isInitialLoading || isTaskSearchLoading) {
      isNoData = false;
      // listItems = Array(8)
      //   .fill()
      //   .map((eachCard, index) => (
      //     <TaskCard
      //       CardContainerStyle={styles.TaskCardContainer}
      //       isDataLoading
      //       key={index}
      //     />
      //   ));
    } else if (
      (!isEmpty(active_tasks_list) || !isEmpty(snoozed_tasks_list)) &&
      TASK_TAB_INDEX.ASSIGNED_TO_OTHERS !== tab_index
    ) {
      isNoData = false;
      listItems = tab_index === 6 ? this.getTaskCardsList(snoozed_tasks_list) : this.getTaskCardsList(active_tasks_list);
    } else {
      isNoData = true;
    }

    let noDataOpenContainer;
    if (isAssignedOpenTaskLoading || isTaskSearchLoading) {
      noDataOpenContainer = null;
      // assignedTaskOpened = Array(this.assignedTaskPerPageCount)
      //   .fill()
      //   .map((eachCard, index) => (
      //     <TaskCard
      //       CardContainerStyle={styles.TaskCardContainer}
      //       isDataLoading
      //       key={index}
      //     />
      //   ));
    } else if (
      !isEmpty(active_tasks_list) &&
      !isEmpty(active_tasks_list.open) &&
      TASK_TAB_INDEX.ASSIGNED_TO_OTHERS === tab_index
    ) {
      const openedList = active_tasks_list.open;
      console.log('gdsgadsgasdg', openedList);
      assignedTaskOpened = this.getTaskCardsList(openedList);
      noDataOpenContainer = null;
    } else if (
        common_server_error?.assigned_open_common_server_error != null
      ) {
        noDataOpenContainer = <div>Something went wrong!</div>;
      } else {
        noDataOpenContainer =
        <div className={gClasses.PX30}>
          <NoDataFound
            dataText={getCurrentTabNoDataText(
              t,
              tab_index,
              ASSIGNED_TASK_TYPES.OPEN,
              searchText,
            )}
            link={() => {
              const noDataFoundState = {
                originalLocation: 'My Tasks',
                createModalOpen: true,
                // type: 'Right',
              };
              routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, EMPTY_STRING, noDataFoundState);
            }}
            originalLocation="My Tasks"
            NoSearchFoundLabelStyles={gClasses.BoxShadowNone}
          />
        </div>;
      }

    let NoDataCompletedContanier;
    if (isAssignedCompletedTaskLoading || isTaskSearchLoading) {
      NoDataCompletedContanier = null;
      // assignedTaskCompleted = Array(this.assignedTaskPerPageCount)
      //   .fill()
      //   .map((eachCard, index) => (
      //     <TaskCard
      //       CardContainerStyle={styles.TaskCardContainer}
      //       isDataLoading
      //       key={index}
      //     />
      //   ));
    } else if (
      !isEmpty(active_tasks_list) &&
      !isEmpty(active_tasks_list.completed) &&
      TASK_TAB_INDEX.ASSIGNED_TO_OTHERS === tab_index
    ) {
      const completedList = active_tasks_list.completed;
      NoDataCompletedContanier = null;
      assignedTaskCompleted = this.getTaskCardsList(completedList, true);
    } else if (
        common_server_error?.assigned_completed_common_server_error != null
      ) {
        NoDataCompletedContanier = <div>Something went wrong!</div>;
      } else {
        NoDataCompletedContanier =
        <div className={gClasses.PX30}>
          <NoDataFound
            dataText={getCurrentTabNoDataText(
              t,
              tab_index,
              ASSIGNED_TASK_TYPES.COMPLETED,
              searchText,
            )}
            originalLocation="My Tasks"
            link={() => {
              const noDataFoundState = {
                originalLocation: 'My Tasks',
                createModalOpen: true,
              };
              routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, EMPTY_STRING, noDataFoundState);
            }}
            NoSearchFoundLabelStyles={gClasses.BoxShadowNone}
          />
        </div>;
      }

    if (isModalOpen && tab_index !== TASK_TAB_INDEX.DRAFT_TASK) toggleFunction({ isNavVisible: false });
    else if (!isModalOpen && tab_index !== TASK_TAB_INDEX.DRAFT_TASK) toggleFunction({ isNavVisible: true });

    const handleRowClick = (id, updatedList) => {
      let currentTaskList;
      if (updatedList) {
        currentTaskList = updatedList;
      } else currentTaskList = (tab_index === 6 ? snoozed_tasks_list : active_tasks_list) || [];
      const taskData = currentTaskList.filter((task) => task._id === id)?.[0];
      this.onTaskCardClick(taskData.task_log_id || taskData._id, tab_index, taskData);
    };

    const tableViewTask = () => (
      <div id={TASK_SCROLL_ID} className={cx(styles.TableTaskContainer, { [styles.TableTrialContainer]: isTrialDisplayed }, gClasses.W100)}>
            {
              isNoData ?
                <NoDataFound
                  dataText={getCurrentTabNoDataText(t, tab_index, null, searchText)}
                  originalLocation="My Tasks"
                  NoSearchFoundLabelStyles={gClasses.BoxShadowNone}
                />
              : (
                <TableWithInfiniteScroll
                  scrollableId={TASK_SCROLL_ID}
                  tableClassName={cx(styles.TaskTable, { [styles.DraftTable]: tab_index === TASK_TAB_INDEX.DRAFT_TASK }, gClasses.W100)}
                  header={getTaskHeader(t, tab_index)}
                  data={listItems}
                  isLoading={isInitialLoading}
                  isRowClickable
                  onRowClick={handleRowClick}
                  scrollType={TableScrollType.BODY_SCROLL}
                  hasMore={tab_index === 6 ? hasMoreSnoozed : hasMore}
                  onLoadMore={this.onLoadMoreCallHandler}
                  loaderRowCount={4}
                  widthVariant={TableColumnWidthVariant.CUSTOM}
                />
              )
            }
      </div>
    );

    const onSearchInputChange = (event) => {
      input.onChange(event);
    };

    // Search Icon
    const getSearchIcon = () => (
      <button
        aria-label="Search"
        className={gClasses.CenterV}
        onClick={() => this.setState({ isSearchFocus: !isSearchFocus })}
      >
        <LandingPageSearchIcon />
      </button>
    );

    const onSearchCloseIconClick = () => {
      input.onChange({ target: { value: EMPTY_STRING } });
    };

    const getFilterElements = () => {
      if (tab_index === TASK_TAB_INDEX.COMPLETED) {
        return [assignedOnTypeDropdown];
      } else if (tab_index === TASK_TAB_INDEX.ASSIGNED_TO_OTHERS) {
        return [taskTypeDropdown, assignedOnTypeDropdown, dueDateDropdown];
      } else if (tab_index === TASK_TAB_INDEX.DRAFT_TASK) {
        return [assignedOnTypeDropdown];
      } else {
        return [taskTypeDropdown, assignedOnTypeDropdown, dueDateDropdown];
      }
    };

    const getSortPopper = () => (
      <Popper
        targetRef={this.sortPopOverTargetRef}
        open={isSortPopOverVisible}
        placement={EPopperPlacements.BOTTOM_START}
        className={gClasses.ZIndex10}
        content={
            <DropdownList
              id={dropdown.id}
              optionList={dropdown.optionList}
              onClick={(selectValue, sortLabel) => { dropdown.onChange({ target: { value: selectValue, label: sortLabel } }); }}
              selectedValue={dropdown.selectedValue}
            />
          }
      />
    );

    const getAppliedFilterValue = (value, label) => {
      let appliedFilterText = null;
      switch (value) {
        case LANDING_PAGE.ASSIGNED_TO_GROUP_VALUE:
          appliedFilterText = t(LANDING_PAGE.ASSIGNED_TO_GROUP);
          break;
        case LANDING_PAGE.ASSIGNED_TO_ME_VALUE:
          appliedFilterText = t(LANDING_PAGE.ASSIGNED_TO_ME);
          break;
        case LANDING_PAGE.ASSIGNED_TO_INDIVIDUAL_VALUE:
          appliedFilterText = t(LANDING_PAGE.ASSIGNED_TO_INDIVIDUAL);
          break;
        default:
          appliedFilterText = label;
      }
      return appliedFilterText;
    };

    const getFilterPopperContent = () => (
      <Popper
        targetRef={this.filterPopOverTargetRef}
        open={isFilterPopOverVisible}
        placement={EPopperPlacements.BOTTOM_END}
        className={gClasses.ZIndex10}
        content={
            <LandingPageFilter
              filterTitle="Filter"
              filterDropdownList={getFilterElements()}
              onClearByFilterId={this.onCloseFilterClicked}
              onSave={this.onClickApplyFilter}
              onClear={this.onClearFilterClickHandler}
              formatAppliedFilterLabel={getAppliedFilterValue}
              targetRef={this.filterPopOverTargetRef}
              selectedFilter={jsUtils.cloneDeep(appliedFilterList)}
              setPopperVisibility={(visibility) => this.setState({ isFilterPopOverVisible: visibility })}
            />
          }
      />
    );

    return (
      <div className={BS.H100}>
        {(history.location.pathname.split('/').length < 5 || TASK_TAB_INDEX.DRAFT_TASK === tab_index) && (
        <div className={cx(gClasses.CenterV, gClasses.JusSpaceBtw, gClasses.MX24, gClasses.PT16, gClasses.PB16)}>
          {TASK_TAB_INDEX.ASSIGNED_TO_OTHERS !== tab_index ? <Text content={`${SHOWING} ${listItems?.length} ${TASKS_SHOWING}`} className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500)} /> : <button className={gClasses.VisibilityNone} />}
          <div className={cx(gClasses.Gap16, gClasses.CenterV, gClasses.JusEnd)}>
            <div className={gClasses.M16}>
              <Input
                content={searchText || EMPTY_STRING}
                prefixIcon={getSearchIcon()}
                onChange={onSearchInputChange}
                onFocusHandler={() => this.setState({ isSearchFocus: true })}
                onBlurHandler={() => this.setState({ isSearchFocus: false })}
                iconPosition={EInputIconPlacement.left}
                className={cx(styles.SearchOuterContainer, { [styles.ExpandedSearch]: isSearchFocus })}
                placeholder={SEARCH_PLACEHOLDER}
                size={Size.md}
                suffixIcon={
                  searchText && (
                    <LandingSearchExitIcon
                      title={ICON_STRINGS.CLEAR}
                      className={cx(styles.SearchCloseIcon, gClasses.CursorPointer, gClasses.Width8, gClasses.MR6)}
                      tabIndex={0}
                      height={12}
                      width={12}
                      role={ARIA_ROLES.BUTTON}
                      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onSearchCloseIconClick()}
                      onClick={onSearchCloseIconClick}
                    />
                  )
                }
                borderRadiusType={BorderRadiusVariant.rounded}
              />
            </div>
            <div className={gClasses.CenterV}>
              <Text content={SORT_DROP_DOWN.PLACE_HOLDER} className={cx(gClasses.FTwo12GrayV98, gClasses.FontWeight500, gClasses.MR8)} />
              <button onClick={() => this.setState({ isSortPopOverVisible: !isSortPopOverVisible })} ref={this.sortPopOverTargetRef} className={cx(gClasses.FTwo12BlueV39, gClasses.FontWeight500, styles.SortContainer, gClasses.gap8, gClasses.CenterV)}>
                {selectedSortLabel}
                <SortDropdownIcon />
                {getSortPopper()}
              </button>
            </div>
            <button onClick={this.onRefreshClickHandler} aria-label={ARIA_LABELS.LOAD_MORE_TASKS}>
              <RefreshIcon ariaLabel={ARIA_LABELS.LOAD_MORE_TASKS} />
            </button>
            <button className={gClasses.CenterV} ref={this.filterPopOverTargetRef} onClick={() => !isFilterPopOverVisible && this.setState({ isFilterPopOverVisible: true })}>
              <LandingFilterIcon />
              {appliedFilterList?.length > 0 && (
              <div className={cx(styles.FilterChip, gClasses.CenterVH, gClasses.FTwo12BlueV39, gClasses.ML8, gClasses.FontWeight500)}>
                {`0${appliedFilterList?.length}`}
              </div>)}
              {getFilterPopperContent()}
            </button>
          </div>
        </div>)}
        <div
          className={cx(
            !activeTaskId && styles.MyTasksContainer,
            activeTaskId && styles.TaskContentContainer,
            { [styles.AssignedToOthersTrial]: TASK_TAB_INDEX.ASSIGNED_TO_OTHERS === tab_index && isTrialDisplayed },
            { [styles.AssignedToOthersNormal]: TASK_TAB_INDEX.ASSIGNED_TO_OTHERS === tab_index && !isTrialDisplayed },
            { [gClasses.OverflowYAutoImportant]: TASK_TAB_INDEX.ASSIGNED_TO_OTHERS === tab_index },
              !jsUtils.isEmpty(appliedFilterList) && styles.MyTasksContainerWithFilter,
          )}
          ref={this.messageListContainerRef.current}
        >
          {(TASK_TAB_INDEX.ASSIGNED_TO_OTHERS !== tab_index && (!activeTaskId || getTabFromUrl(location.pathname) === TASK_TAB_INDEX.DRAFT_TASK)) && (
            <>
              { tableViewTask()}
            </>
          )}
          {(TASK_TAB_INDEX.ASSIGNED_TO_OTHERS === tab_index && !activeTaskId) && (
            <>
              <h2
                className={cx(
                  gClasses.MB8,
                  gClasses.MT20,
                  styles.Title,
                  gClasses.HeadingTitleV1,
                  gClasses.ML30,
                )}
              >
                {getCurrentTabTitle(t, tab_index, ASSIGNED_TASK_TYPES.OPEN)}
                {!isAssignedOpenTaskLoading &&
                  `(${assignedOpenTaskCount || 0})`}
              </h2>
              <div className={cx(BS.P_RELATIVE, gClasses.PT15, gClasses.PX24)}>
              {!isEmpty(noDataOpenContainer) ? noDataOpenContainer : (
                <TableWithPagination
                  tableClassName={styles.TaskTable}
                  // className={styles.RowContainer}
                  header={getTaskHeader(t, tab_index)}
                  data={assignedTaskOpened}
                  isRowClickable
                  isLoading={isInitialLoading || isAssignedOpenTaskLoading || isAssignedOpenTaskLoadMore}
                  onRowClick={(id) => handleRowClick(id, active_tasks_list?.open)}
                  widthVariant={TableColumnWidthVariant.CUSTOM}
                  paginationProps={{
                    totalItemsCount: assignedOpenTaskCount,
                    itemsCountPerPage: 5,
                    activePage: this.currentAssignedOpenPage,
                    prevAndNextButtonContentVariant: ButtonContentVaraint.icon,
                    prevAndNextButtonPlacement: PaginationButtonPlacement.connected,
                    shape: BorderRadiusVariant.square,
                    onChange: (_event, page) => this.loadAssignedData(false, ASSIGNED_TASK_TYPES.OPEN, page),
                  }}
                />
              )}
              </div>
              <h2
                className={cx(
                  gClasses.MB8,
                  gClasses.MT20,
                  styles.Title,
                  gClasses.HeadingTitleV1,
                  gClasses.ML30,
                )}
              >
                {getCurrentTabTitle(t, tab_index, ASSIGNED_TASK_TYPES.COMPLETED)}
                {!isAssignedCompletedTaskLoading &&
                  `(${assignedCompletedTaskCount || 0})`}
              </h2>
              <div className={cx(BS.P_RELATIVE, gClasses.PT15, gClasses.PX24)}>
              {!isEmpty(NoDataCompletedContanier) ? NoDataCompletedContanier : (
                <TableWithPagination
                  tableClassName={styles.TaskTable}
                  header={getTaskHeader(t, tab_index)}
                  data={assignedTaskCompleted}
                  isRowClickable
                  isLoading={isInitialLoading || isAssignedCompletedTaskLoading || isAssignedCompletedTaskLoadMore}
                  onRowClick={(id) => handleRowClick(id, active_tasks_list?.completed)}
                  widthVariant={TableColumnWidthVariant.CUSTOM}
                  paginationProps={{
                    totalItemsCount: assignedCompletedTaskCount,
                    itemsCountPerPage: 5,
                    activePage: this.currentAssignedCompletedPage,
                    prevAndNextButtonContentVariant: ButtonContentVaraint.icon,
                    prevAndNextButtonPlacement: PaginationButtonPlacement.connected,
                    shape: BorderRadiusVariant.square,
                    onChange: (_event, page) => this.loadAssignedData(false, ASSIGNED_TASK_TYPES.COMPLETED, page),
                  }}
                />
              )}
              </div>
            </>
          )}
          {/* <div> */}
            {taskContent && taskContent}
          {/* </div> */}
          {history?.location?.state?.createModalOpen ? (
            <div
              onBlur={() => {
                const taskListState = {
                  originalLocation: 'My Tasks',
                  createModalOpen: true,
                  redirectedFrom: REDIRECTED_FROM.TASK_LIST,
                };
                routeNavigate(history, ROUTE_METHOD.PUSH, EMPTY_STRING, EMPTY_STRING, taskListState);
              }}
            >
              <Task
                onCloseClick={this.onCloseIconClick}
                isModalOpen={isModalOpen}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  onClickApplyFilter = () => {
    const { tab_index } = this.props;
    const { updatedAppliedFilterList } = this.state;
    this.getTaskList(M_T_STRINGS.TASK_LIST.GET_TASK_LIST, tab_index);
    this.setState(
      {
        isFilterPopOverVisible: false,
        appliedFilterList: updatedAppliedFilterList,
      },
    );
  };

  onRefreshClickHandler = async () => {
    const {
      location,
    } = this.props;
    this.currentPage = 1;
    this.currentAssignedOpenPage = 1;
    this.currentAssignedCompletedPage = 1;
    this.getTaskList(M_T_STRINGS.TASK_LIST.GET_TASK_LIST, getTabFromUrl(location.pathname));
    onWindowResize(this.windowResize);
  };

  onCloseIconClick = async () => {
    const { tab_index, history, toggleFunction, onTaskListDataChange } = this.props;
    const { replaceHistory } = this.state;
    this.currentPage = 1;
    this.currentAssignedOpenPage = 1;
    this.currentAssignedCompletedPage = 1;
    const scrollDiv = document.getElementById(SCROLLABLE_DIV_ID);
    scrollDiv?.scrollTo(0, 0);
    await onTaskListDataChange({
      currentPage: 1,
    });
    this.getTaskList(M_T_STRINGS.TASK_LIST.GET_TASK_LIST, tab_index);
    await this.setState(
      {
        isModalOpen: false,
        // taskModalOpen: false,
      },
    );
    await toggleFunction({ isNavVisible: true });
    let pathname = `${TASKS}/${getTaskUrl(tab_index)}`;
    let { state } = history.location;
    if (history?.location?.state?.redirectedFrom) {
      console.log('history.location.state.redirectedFrom', history.location.state.redirectedFrom, state, replaceHistory);
      switch (history.location.state.redirectedFrom) {
        case REDIRECTED_FROM.HOME:
          pathname = HOME;
          state = {};
          break;
        case REDIRECTED_FROM.FLOW_DASHBOARD:
          if (state?.flowTabUrl === FLOW_TEST_BED_MANAGED_BY_YOU || state.isTestBed) {
            pathname = `${FLOW_DASHBOARD}/${TEST_BED}/${state?.flow_uuid}`;
          } else {
            pathname = `${FLOW_DASHBOARD}/${state.flow_uuid}`;
          }
          break;
        case REDIRECTED_FROM.FLOW_DATA_INSTANCE:
          pathname = `${FLOW_DASHBOARD}/${state.flow_uuid}/${state.instance_id}`;
          break;
        case REDIRECTED_FROM.FLOW_DASHBOARD_TEST_BED:
          pathname = `${FLOW_DASHBOARD}/${TEST_BED}/${state.flow_uuid}`;
          break;
        case REDIRECTED_FROM.FLOW_LIST:
          pathname = LIST_FLOW + state.flowTabUrl;
          state = {};
          break;
        case REDIRECTED_FROM.DATALIST_INSTANCE:
          pathname = `${DATA_LIST_DASHBOARD}/${state.data_list_uuid}/${state.instance_id}`;
          break;
        default:
          state = {
            originalLocation: 'My Tasks',
            createModalOpen: false,
          };
          break;
      }
    } else {
      state = {
        originalLocation: 'My Tasks',
        createModalOpen: false,
      };
    }
    routeNavigate(history, ROUTE_METHOD.REPLACE, pathname, null, { ...state, hideClosePopper: true });
  };

  onTaskCardClick = async (clickedTaskId, selectedCardTab, data) => {
    console.log('clickedTaskIdclickedTaskId', clickedTaskId);
    const scrollDiv = document.getElementById(SCROLLABLE_DIV_ID);
    scrollDiv?.scrollTo(0, 0);
    const { document_url_details } = this.props;
    if (selectedCardTab === TASK_TAB_INDEX.DRAFT_TASK) {
      const { history, onTaskListDataChange, toggleModal } = this.props;
      await onTaskListDataChange({
        assigneesCount: data.assigneesCount,
        selectedCardTab,
        activeTaskId: data._id,
        selectedCardData: { ...data, selectedCardTab },
      });
      await toggleModal({ originalLocation: 'My Tasks' });
      console.log('replicateitreplicateit', data, document_url_details, selectedCardTab, REDIRECTED_FROM.TASK_LIST);
      const taskCardPathName = `${TASKS}/${getTaskUrl(selectedCardTab)}/${clickedTaskId}`;
      const taskCardState = {
        taskDetails: { ...data },
        document_url_details: document_url_details,
        selectedCardTab,
        redirectedFrom: REDIRECTED_FROM.TASK_LIST,
        hideClosePopper: false,
      };
      routeNavigate(history, ROUTE_METHOD.PUSH, taskCardPathName, null, taskCardState);
      this.setState({
        isModalOpen: true,
      });
    } else {
      let queryParams = null;
      if (clickedTaskId === this.getTaskIdFromUrl()) return;
      const { history, clearTaskContentReduxState, toggleModal, onTaskListDataChange } =
        this.props;
      await onTaskListDataChange({
        assigneesCount: data.assigneesCount,
        selectedCardTab,
        activeTaskId: data._id,
        selectedCardData: { ...data, selectedCardTab },
      });
      if (isAssigneedToOtherTab(selectedCardTab)) {
        queryParams = { uuid: data.task_metadata_uuid };
      }
      await clearTaskContentReduxState();
      await toggleModal({ originalLocation: 'Tasks' });
      const taskIdPathName = `${TASKS}/${getTaskUrl(selectedCardTab)}/${clickedTaskId}`;
      const taskSearchParams = queryParams
        ? `?${new URLSearchParams(queryParams).toString()}`
        : null;
      const taskState = { ...data, selectedCardTab, redirectedFrom: REDIRECTED_FROM.TASK_LIST, originalLocation: 'Tasks', document_url_details: document_url_details };
      routeNavigate(history, ROUTE_METHOD.PUSH, taskIdPathName, taskSearchParams, taskState);
      this.setState({
        isModalOpen: true,
      });
    }
  };

  onTaskSuccessfulSubmit = async () => {
    this.setState({ replaceHistory: true });
    await this.onCloseIconClick(true);
  };

  onChangeHandler = async (event) => {
    this.cancelApiIfPersists();
    const { onTaskListDataChange } = this.props;
    await onTaskListDataChange({
      searchText: event.target.value,
    });
    this.currentPage = 1;
    const { tab_index } = this.props;
    const searchText = event.target.value;
    if (searchText.length) {
      await onTaskListDataChange({
        searchAccordionIndex: tab_index,
      });
      return this.getSearchTaskList(
        M_T_STRINGS.TASK_LIST.INPUT_HANDLER,
        tab_index,
      );
    } else {
      await onTaskListDataChange({
        active_tasks_list: [],
        snoozed_tasks_list: [],
        searchAccordionIndex: 0,
      });
      return this.getTaskList(M_T_STRINGS.TASK_LIST.INPUT_HANDLER, tab_index);
    }
  };

  onLoadMoreCallHandler = () => {
    const { active_tasks_list, count, isLoadMoreData, snoozed_tasks_list, tab_index } = this.props;
    if (isLoadMoreData) return;
    const totalCardsRendered = tab_index === 6 ? snoozed_tasks_list.length : active_tasks_list.length;
    if (count > totalCardsRendered) {
      this.loadData();
    } else {
      const { onTaskListDataChange } = this.props;
      onTaskListDataChange({
        hasMore: false,
        hasMoreSnoozed: false,
      });
    }
  };

  onTaskTypeDropdownChange = async (event) => {
    const { taskTypeIndex, t } = this.props;
    const { updatedAppliedFilterList } = this.state;
    if (taskTypeIndex !== event) {
      const { onTaskListDataChange } = this.props;
      await onTaskListDataChange({
        taskTypeIndex: event,
      });
      this.currentPage = 1;
      this.currentAssignedOpenPage = 1;
      this.currentAssignedCompletedPage = 1;
      if (event !== -1) {
        const indexOfObject = updatedAppliedFilterList.findIndex((object) => object.label === t(LANDING_PAGE.TASK_TYPE));
        if (indexOfObject >= 0) {
          const filter = jsUtils.cloneDeep(updatedAppliedFilterList);
          filter[indexOfObject].value = event;
          this.setState({
            updatedAppliedFilterList: filter,
          });
        } else {
          this.setState({
            updatedAppliedFilterList: [...updatedAppliedFilterList, {
              label: t(LANDING_PAGE.TASK_TYPE),
              value: event,
            }],
          });
        }
      }
    }
  };

  onAssignedOnDropdownChange = async (event, label) => {
    const { assignedOnIndex } = this.props;
    if (assignedOnIndex !== event) {
      const { onTaskListDataChange, t } = this.props;
      const { updatedAppliedFilterList } = this.state;
      await onTaskListDataChange({
        assignedOnIndex: event,
      });
      this.currentPage = 1;
      this.currentAssignedOpenPage = 1;
      this.currentAssignedCompletedPage = 1;
      const eventLabel = M_T_STRINGS.TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.ASSIGNED_ON(t).filter((o) => Object.values(o).includes(event));
      if (event !== -1) {
        const indexOfObject = updatedAppliedFilterList.findIndex((object) => object?.referenceName === LANDING_PAGE.ASSIGNED_ON || object.label === t(M_T_STRINGS.TASK_LIST.SORT_BY_EDITED.ASSIGNED_ON_LABEL) || object.label === LANDING_PAGE.COMPLETED_ON);
        if (indexOfObject >= 0) {
          const filter = jsUtils.cloneDeep(updatedAppliedFilterList);
          filter[indexOfObject].label = eventLabel?.[0] ? eventLabel[0].label : null;
          filter[indexOfObject].value = event;
          this.setState({
            updatedAppliedFilterList: filter,
          });
        } else {
          this.setState({
            updatedAppliedFilterList: [...updatedAppliedFilterList, {
              label: label,
              referenceName: LANDING_PAGE.ASSIGNED_ON,
              value: eventLabel?.[0] ? eventLabel[0].label : null,
            }],
          });
        }
      }
    }
  };

  onDueDateDropdownChange = async (event, label = false) => {
    const { dueDateIndex } = this.props;
    if (dueDateIndex !== event) {
      const { onTaskListDataChange, t } = this.props;
      const { updatedAppliedFilterList } = this.state;

      await onTaskListDataChange({
        dueDateIndex: event,
      });
      this.currentPage = 1;
      this.currentAssignedOpenPage = 1;
      this.currentAssignedCompletedPage = 1;
      if (event !== -3) {
        const indexOfObject = updatedAppliedFilterList.findIndex((object) => object.referenceName === t(M_T_STRINGS.TASK_LIST.SORT_BY_DUE_DATE.LABLE));
        if (indexOfObject >= 0) {
          const filter = jsUtils.cloneDeep(updatedAppliedFilterList);
          filter[indexOfObject].value = event;
          filter[indexOfObject].label = label;
          this.setState({
            updatedAppliedFilterList: filter,
          });
        } else {
          this.setState({
            updatedAppliedFilterList: [...updatedAppliedFilterList, {
              label: label,
              referenceName: t(M_T_STRINGS.TASK_LIST.SORT_BY_DUE_DATE.LABLE),
              value: event,
            }],
          });
        }
      }
    }
  };

  onCloseFilterClicked = async (value) => {
    const { tab_index, onTaskListDataChange, t } = this.props;
    const { updatedAppliedFilterList } = this.state;
    const tempUpdatedAppliedFilterList = jsUtils.cloneDeep(updatedAppliedFilterList);
    if (value.label === t(M_T_STRINGS.TASK_LIST.SORT_BY_ACTIVE_TASKS.TASK_TYPE_LABEL)) {
      await onTaskListDataChange({
        taskTypeIndex: -1,
      });
      tempUpdatedAppliedFilterList.splice(tempUpdatedAppliedFilterList.findIndex((el) => el.label === t(M_T_STRINGS.TASK_LIST.SORT_BY_ACTIVE_TASKS.TASK_TYPE_LABEL)), 1);
    }
    if ([t(M_T_STRINGS.TASK_LIST.SORT_BY_EDITED.ASSIGNED_ON_LABEL), t(M_T_STRINGS.TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.ASSIGNED_ON_LABEL), t(M_T_STRINGS.TASK_LIST.SORT_BY_COMPLETED.ASSIGNED_LABEL)].includes(value?.referenceName)) {
      await onTaskListDataChange({
        assignedOnIndex: -1,
      });
      tempUpdatedAppliedFilterList.splice(tempUpdatedAppliedFilterList.findIndex((el) => el.label === t(M_T_STRINGS.TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.ASSIGNED_ON_LABEL)), 1);
    }
    if (value?.referenceName === t(M_T_STRINGS.TASK_LIST.SORT_BY_DUE_DATE.LABLE)) {
      await onTaskListDataChange({
        dueDateIndex: -3,
      });
      tempUpdatedAppliedFilterList.splice(tempUpdatedAppliedFilterList.findIndex((el) => el.label === t(M_T_STRINGS.TASK_LIST.SORT_BY_DUE_DATE.LABLE)), 1);
    }
     this.setState({ updatedAppliedFilterList: tempUpdatedAppliedFilterList, appliedFilterList: tempUpdatedAppliedFilterList });
    this.getTaskList(M_T_STRINGS.TASK_LIST.GET_TASK_LIST, tab_index);
  };

  onClearFilterClickHandler = async () => {
    const { tab_index, onTaskListDataChange } = this.props;
    await onTaskListDataChange({
      taskTypeIndex: -1,
      assignedOnIndex: -1,
      dueDateIndex: -3,
    });
    this.setState({
      appliedFilterList: [],
      updatedAppliedFilterList: [],
      isFilterPopOverVisible: false,
    });
    this.getTaskList(M_T_STRINGS.TASK_LIST.GET_TASK_LIST, tab_index);
  };

  onSortDropdownChange = async (event) => {
    const { sortIndex, tab_index, active_tasks_list, snoozed_tasks_list } = this.props;
    if (sortIndex !== event.target.value) {
      const { onTaskListDataChange } = this.props;
      this.setState({ isSortPopOverVisible: false });
      await onTaskListDataChange({
        sortIndex: event.target.value,
        selectedSortLabel: event?.target?.label,
      });
      this.currentPage = 1;
      this.currentAssignedOpenPage = 1;
      this.currentAssignedCompletedPage = 1;
      if (!jsUtils.isEmpty(active_tasks_list) || !jsUtils.isEmpty(snoozed_tasks_list)) {
        this.getTaskList(M_T_STRINGS.TASK_LIST.GET_TASK_LIST, tab_index);
      }
    }
  };

  updateDimensions = () => {
    this.setState({ height: window.innerHeight });
  };

  getBreadCrumbTitle = () => {
    const { location } = this.props;
    const inNormalMode = isBasicUserMode({ location });
    const taskListTabIndex = isBasicUserMode({ location }) ? getTabFromUrlForBasicUserMode(location.pathname) : getTabFromUrl(location.pathname);
    if (taskListTabIndex === TASK_TAB_INDEX.OPEN) {
      return {
        title: i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.TASK_TYPE.MY_TASKS),
        route: inNormalMode ? getUserRoutePath(`${TASKS}/${OPEN_TASKS}`) : `${TASKS}/${OPEN_TASKS}`,
      };
    } else if (taskListTabIndex === TASK_TAB_INDEX.COMPLETED) {
      return {
        title: i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.TASK_TYPE.MY_COMPLETED_TASKS),
        route: inNormalMode ? getUserRoutePath(`${TASKS}/${COMPLETED_TASKS}`) : `${TASKS}/${COMPLETED_TASKS}`,
      };
    } else if (taskListTabIndex === TASK_TAB_INDEX.ASSIGNED_TO_OTHERS) {
      return {
        title: i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.TASK_TYPE.ASSIGNED_TO_OTHERS),
        route: inNormalMode ? getUserRoutePath(`${TASKS}/${ASSIGNED_TO_OTHERS_TASKS}`) : `${TASKS}/${ASSIGNED_TO_OTHERS_TASKS}`,
      };
    } else if (taskListTabIndex === TASK_TAB_INDEX.SNOOZED_TASK) {
        return {
          title: i18next.t(TASK_CONTENT_STRINGS.TASK_INFO.TASK_TYPE.SNOOZED_TASKS),
          route: inNormalMode ? getUserRoutePath(`${TASKS}/${SNOOZED_TASK}`) : `${TASKS}/${SNOOZED_TASK}`,
        };
      }
      return {
        title: EMPTY_STRING,
        route: EMPTY_STRING,
      };
  };

  getSearchAssignedTaskList = (apiType) => {
    const {
      onAssignedTaskListApi,
      sortIndex,
      searchText,
      t,
    } = this.props;
    let params = null;
    params = {
      size: this.assignedTaskPerPageCount,
      page: this.currentPage,
      sort_field: this.sortParameterAssignedToOthers,
    };
    const activeOptionList = M_T_STRINGS.TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.OPTION_LIST(t);
    let sort_index = 1;
    if (searchText === activeOptionList[3].value) sort_index = -1;

    if (sortIndex) params.sort_by = sort_index;
    if (!jsUtils.isEmpty(searchText)) {
      params.search = searchText;
    }
    return onAssignedTaskListApi(params, apiType);
  };

  getSearchTaskList = (apiType, tabIndex) => {
    if (cancelForGetActiveTasks) cancelForGetActiveTasks();
    if (cancelForGetAssignedTasks) cancelForGetAssignedTasks();
    if (cancelForGetBothAssignedTasks) cancelForGetBothAssignedTasks();
    if (cancelForGetCompletedTasks) cancelForGetCompletedTasks();
    if (cancelForGetSelfTasks) cancelForGetSelfTasks();
    if (cancelForGetSnoozedTasks) cancelForGetSnoozedTasks();
    if (cancelForGetDraftTasks) cancelForGetDraftTasks();
    if (isOpenTab(tabIndex)) return this.getSearchActiveResults(apiType);
    if (isSnoozedTab(tabIndex)) return this.getSearchActiveResults(apiType);
    if (isCompletedTab(tabIndex)) { return this.getSearchCompletedTaskList(apiType); }
    if (isAssigneedToOtherTab(tabIndex)) {
      return this.getSearchAssignedTaskList(apiType);
    }
    if (tabIndex === 5) return this.getSearchDraftTaskList(apiType);
    return null;
  };

  cancelApiIfPersists() {
    if (cancelForGetActiveTasks) cancelForGetActiveTasks();
    if (cancelForGetAssignedTasks) cancelForGetAssignedTasks();
    if (cancelForGetBothAssignedTasks) cancelForGetBothAssignedTasks();
    if (cancelForGetCompletedTasks) cancelForGetCompletedTasks();
    if (cancelForGetSelfTasks) cancelForGetSelfTasks();
    if (cancelForGetSnoozedTasks) cancelForGetSnoozedTasks();
    if (cancelForGetDraftTasks) cancelForGetDraftTasks();
  }

  scrollToBottom = () => {
    if (this?.messageListContainerRef?.current) {
      const { scrollHeight } = this.messageListContainerRef.current;
      const height = this.messageListContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      this.messageListContainerRef.current.scrollTop =
        maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  loadAssignedData = (isRefreshApiCall, assignedTaskType, page) => {
    const { tab_index } = this.props;
    let apiCallType = null;
    if (isRefreshApiCall === M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST) {
      this.currentPage = 1;
      this.currentAssignedOpenPage = 1;
      this.currentAssignedCompletedPage = 1;
      apiCallType = M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST;
    } else {
      if (ASSIGNED_TASK_TYPES.OPEN === assignedTaskType) {
        this.currentAssignedOpenPage = page;
      } else {
        this.currentAssignedCompletedPage = page;
      }
      this.currentPage += 1;
      apiCallType = M_T_STRINGS.TASK_LIST.LOAD_DATA;
    }
    if (assignedTaskType === ASSIGNED_TASK_TYPES.OPEN) {
      return this.getTaskList(apiCallType, tab_index, ASSIGNED_TASK_TYPES.OPEN);
    } else {
      return this.getTaskList(
        apiCallType,
        tab_index,
        ASSIGNED_TASK_TYPES.COMPLETED,
      );
    }
  };

  handleInputChange = (event) => {
    const { onTaskListDataChange } = this.props;
    if (jsUtils.isEmpty(event.target.value)) {
      onTaskListDataChange({
        searchText: EMPTY_STRING,
      });
      this.onChangeHandler(event);
    } else {
      this.onChangeHandler(event);
    }
  };

  windowResize = () => {
    this.setState({
      // isMobile: isMobileScreen(),
    });
  };

  getTaskCardsList = (tasksList, isComplete = false) => {
    const { tab_index, isTaskDataLoading, isInitialLoading, t, history } = this.props;
    const pref_locale = localStorage.getItem('application_language');
    const taskCards = Array.isArray(tasksList)
      ? tasksList.map((data) => {
        // empty check added
        const {
          is_closed,
          task_name,
          published_by,
          due_date,
          task_definition,
          task_description,
          task_owner,
          assigned_on,
          published_on,
          assignees,
          task_category,
          assigned_to,
          last_updated_on,
          last_updated_by,
          closed_on,
          is_test_bed_task,
          initiated_by,
          snooze_time,
          task_viewed,
          translation_data,
        } = data;
        let taskViewed = task_viewed;
        let assignedOn = null;
        let snoozedUntil = null;
        let completedOn = null;

        switch (tab_index) {
          case TASK_TAB_INDEX.OPEN:
          case TASK_TAB_INDEX.ASSIGNED_TO_OTHERS:
          case TASK_TAB_INDEX.SELF_TASK:
            console.log('tab_indextab_indextab_indextab_index12345', tab_index, data);
            assignedOn = getAssignedOnDetails(
              isEmpty(assigned_on) ? published_on : assigned_on,
              tab_index,
              true,
            );
            completedOn = getAssignedOnDetails(
              closed_on,
              tab_index,
              true,
            );
            break;
          case TASK_TAB_INDEX.SNOOZED_TASK:
            assignedOn = getAssignedOnDetails(
              isEmpty(assigned_on) ? published_on : assigned_on,
              tab_index,
              true,
            );
            snoozedUntil = snooze_time?.pref_datetime_display;
            break;
          case TASK_TAB_INDEX.COMPLETED:
            assignedOn = getAssignedOnDetails(closed_on, tab_index, true);
            break;
          case TASK_TAB_INDEX.DRAFT_TASK:
            assignedOn = getAssignedOnDetails(last_updated_on, tab_index, true);
            taskViewed = false;
            break;
          default:
            return null;
        }
        let taskAttachmentsCount = 0;
        if (data?.task_reference_documents) {
          taskAttachmentsCount = data.task_reference_documents.length;
        }
        const taskOwners = task_owner || assignees || assigned_to;
        const taskPublishers = published_by || last_updated_by;
        const taskDesc = getTasksDescription(
              t,
              task_description,
              task_definition,
              task_category,
              taskPublishers,
              translation_data,
              pref_locale,
            );
        const titleData = (
          <div
            role="presentation"
            className={cx(
              gClasses.FTwo13GrayV3,
              (TASK_ACCORDION_INDEX.DRAFT_TASK === tab_index || TASK_ACCORDION_INDEX.COMPLETED === tab_index) ?
              styles.TaskTitleSelectContainer : styles.TaskTitleContainer,
              gClasses.Ellipsis,
              gClasses.MR20,
              gClasses.Ellipsis,
              BS.D_FLEX,
              BS.ALIGN_ITEM_CENTER,
            )}
            // onClick={onCardClick}
          >
          {is_test_bed_task ? (
            <div
              className={cx(gClasses.CenterVH, styles.TestBedIconContainer, gClasses.ML8, gClasses.MR8)}
            >
              <BugIcon fillColor="#fff" />
            </div>
          ) : (
            <TaskListingIcon className={cx(gClasses.MR8, gClasses.MinHW20)} />)}
            <span
              className={cx((taskViewed || TASK_ACCORDION_INDEX.COMPLETED === tab_index) ? cx(gClasses.FontWeight500) : gClasses.FontWeight600, gClasses.FTwo13GrayV3, styles.TaskDefinition)}
              title={translation_data?.[pref_locale]?.task_name || task_name}
            >
              {translation_data?.[pref_locale]?.task_name || task_name}
            </span>
            {taskAttachmentsCount !== 0 ? (
              <span
                title={translation_data?.[pref_locale]?.task_name || task_name}
                className={cx(gClasses.FTwo13, gClasses.ML10, gClasses.CenterV)}
              >
                <div className={styles.AttachmentCount}>
                  {!isTaskDataLoading && taskAttachmentsCount}
                </div>
                <div className={gClasses.ML3}>
                  {!isTaskDataLoading &&
                  (
                    <AttachmentsIcon className={styles.AttachmentIcon} />
                  )}
                </div>
              </span>
            ) : null}
            {taskDesc && (<span className={styles.TitleDescDivider} />)}
            {taskDesc && (
              <span title={taskDesc} className={cx(styles.DatalistDesc, gClasses.FTwo12, styles.TaskDefinition)}>
                {taskDesc}
              </span>
            )}
          </div>
        );

        const getAssignee = (taskCategory, assignees, initiatedBy) => {
          if (tab_index === TASK_TAB_INDEX.OPEN) {
            if (
              [
                TASK_CATEGORY_DATALIST_ADHOC_TASK,
                TASK_CATEGORY_FLOW_ADHOC_TASK,
                TASK_CATEGORY_FLOW_TASK,
                TASK_CATEGORY_ADHOC_TASK,
              ].includes(taskCategory)
            ) {
              return Array.isArray(initiatedBy)
                ? { users: initiatedBy }
                : { users: [initiatedBy] };
            }
          }
          return taskOwners;
        };

        let assigneesData;
        if (!isInitialLoading) {
          assigneesData =
            <UserDisplayGroup
              assignees={getAssignee(task_category, assignees, initiated_by) || {}}
              userAndTeamList={constructAvatarGroupList(getAssignee(task_category, assignees, initiated_by) || {})}
              count={1}
              popperPlacement={EPopperPlacements.AUTO}
              getPopperContent={(id, type, onShow, onHide) =>
                getPopperContent(id, type, onShow, onHide, history, true)
              }
              getRemainingPopperContent={(id, type, onShow, onHide) =>
                getPopperContent(id, type, onShow, onHide, history, true)
              }
            />;
        }

        const assignedOnView = (
            <div
              className={cx(
                gClasses.FTwo12,
                styles.AssignedOn,
                ((i18next.language === language.spanish_mexico) && (TASK_TAB_INDEX.DRAFT_TASK === tab_index)) ? gClasses.W150 : gClasses.W120,
              )}
            >
              {assignedOn}
            </div>
          );

          const snoozedUntilView = (
            <div
              className={cx(
                gClasses.FTwo12,
                styles.AssignedOn,
                gClasses.W165,
                gClasses.MR15,
              )}
            >
              {snoozedUntil}
            </div>
          );
          let dueStyle;
          let dueLabel;
          if (is_closed) {
            dueStyle = TASK_PRIORITY_TYPE.COMPLETED;
          } else if (due_date) {
            const priority = priorityTask(
              due_date.duration_days,
              M_T_STRINGS.TASK_LIST.DEADLINE_HIGH_PRIORITY_VALUE,
            );
            if (priority === TASK_PRIORITY_TYPE.HIGH_PRIORITY.VALUE) {
              const { t } = this.props;
              dueStyle = styles.HighPriorityDue;
              dueLabel = t(TASK_CONTENT_STRINGS.DUE.LABEL) + SPACE + dateDuration(due_date.duration_display);
            } else if (!priority) {
              const { t } = this.props;
              dueStyle = styles.MediumPriorityDue;
              dueLabel = t(TASK_CONTENT_STRINGS.DUE.LABEL) + SPACE + dateDuration(due_date.duration_display);
            } else {
              const { t } = this.props;
              dueStyle = styles.OverDue;
              dueLabel = t(TASK_CONTENT_STRINGS.OVER_DUE);
            }
          } else {
            const { t } = this.props;
            dueStyle = styles.NoDue;
            dueLabel = t(TASK_CONTENT_STRINGS.NO_DUE);
        }

          let statusView;

          if (
            TASK_TAB_INDEX.COMPLETED !== tab_index &&
            TASK_TAB_INDEX.DRAFT_TASK !== tab_index
          ) {
            if (!isComplete) {
            statusView = (
              <span
                className={cx(
                  gClasses.FontWeight500,
                  gClasses.FTwo11,
                  styles.TaskStatus,
                  styles.DueDaysText,
                  dueStyle,
                  gClasses.CenterVH,
                  gClasses.W108,
                )}
              >
                {dueLabel}
              </span>
            );
            } else {
              statusView = (
              <div
                className={cx(
                  gClasses.FTwo12,
                  styles.AssignedOnCompleted,
                  gClasses.W108,
                  gClasses.MR8,
                  gClasses.ML8,
                  // assignedOnStyles,
                )}
              >
                {completedOn}
              </div>
              );
            }
          }
        const handleRowClick = (id) => {
          const { active_tasks_list } = this.props;
          const currentTaskList = active_tasks_list || [];
          const taskData = currentTaskList.filter((task) => task._id === id)?.[0];
          this.onTaskCardClick(taskData.task_log_id || taskData._id, tab_index, taskData);
        };
        const editButton = (
          <button
            className={gClasses.PR16}
            onClick={() => handleRowClick(data?._id)}
          >
            <Edit className={styles.EditIcon} />
          </button>
        );
        if (TASK_ACCORDION_INDEX.SNOOZED_TASK === tab_index) return { id: data._id, component: [titleData, snoozedUntilView, assignedOnView, statusView] };
        else if (TASK_ACCORDION_INDEX.COMPLETED === tab_index) {
          return { id: data._id, component: [titleData, assigneesData, assignedOnView] };
        } else if (TASK_ACCORDION_INDEX.DRAFT_TASK === tab_index) {
          return { id: data._id, component: [titleData, assigneesData, assignedOnView, editButton] };
        } else return { id: data._id, component: [titleData, assigneesData, assignedOnView, statusView] };
      })
      : [];
    return taskCards;
  };

  calculateListSize = () => {
    if (this.containerCompRef && this.headerCompRef && this.listCompRef) {
      const { isMobileView } = this.props;
      const topHeight = isMobileView ? 85 : 0;
      const listHeight =
        this.containerCompRef.clientHeight -
        this.headerCompRef.clientHeight -
        topHeight;
      this.listHeight = listHeight;
    }
  };

  calculateCardCount = async () => {
    const { onTaskListDataChange } = this.props;
    const dataCountPerCall =
      getCardCount(this.listHeight, M_T_STRINGS.TASK_LIST.CARD_HEIGHT) + 4;
    return onTaskListDataChange({ dataCountPerCall });
  };

  getTaskIdFromUrl = () => {
    const { location } = this.props;
    if (jsUtils.has(location, 'pathname')) {
      const url = location.pathname.split('/');
      if (
        jsUtils.get(url, url.length - 2) === OPEN_TASKS ||
        jsUtils.get(url, url.length - 2) === COMPLETED_TASKS ||
        jsUtils.get(url, url.length - 2) === ASSIGNED_TO_OTHERS_TASKS ||
        jsUtils.get(url, url.length - 2) === SELF_TASK ||
        jsUtils.get(url, url.length - 2) === DRAFT_TASK ||
        jsUtils.get(url, url.length - 2) === SNOOZED_TASK
      ) {
        if (jsUtils.get(url, url.length - 1)) {
          return url[url.length - 1];
        }
      }
    }
    return null;
  };

  loadData = (isRefreshApiCall) => {
    const { tab_index } = this.props;
    let apiCallType = null;
    if (isRefreshApiCall === M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST) {
      this.currentPage = 1;
      apiCallType = M_T_STRINGS.TASK_LIST.REFRESH_TASK_LIST;
    } else {
      this.currentPage += 1;
      apiCallType = M_T_STRINGS.TASK_LIST.LOAD_DATA;
    }
    this.getTaskList(apiCallType, tab_index);
  };

  getSearchActiveResults = (apiType) => {
    const { sortIndex, searchText, onSearchActiveListApi, tab_index, t } =
      this.props;
    let sort_index = null;
    const { TASK_LIST } = M_T_STRINGS;
    const activeOptionList = TASK_LIST.SORT_BY_ACTIVE_TASKS.OPTION_LIST(t);
    let params = null;
    params = {
      size: this.searchDataPerPage,
      page: this.currentPage,
    };

    if (sortIndex === activeOptionList[0].value) {
      sort_index = -1;
    } else if (
      sortIndex === activeOptionList[2].value ||
      sortIndex === activeOptionList[1].value
    ) {
      params = {
        ...params,
        sort_field: ACTIVE_TASK_SORT_DETAILS.NAME_SORTING,
      };
      sort_index = sortIndex === activeOptionList[1].value ? 1 : -1;
    } else if (sortIndex === activeOptionList[3].value) {
      params = {
        ...params,
        sort_field: ACTIVE_TASK_SORT_DETAILS.ASSIGNED_ON_SORTING,
      };
      sort_index = 1;
    } else {
      // do nothing
    }

    if (!jsUtils.isNull(sortIndex)) params.sort_by = sort_index;
    if (!jsUtils.isEmpty(searchText)) {
      params.search = searchText;
    }
    params.is_snoozed = tab_index === 6 ? 1 : 0;
    return onSearchActiveListApi(params, apiType);
  };

  getSearchCompletedTaskList = async (apiType) => {
    const {
      onSearchCompletedTaskListApi,
      sortIndex,
      searchText,
      t,
    } = this.props;
    let params = null;
    params = {
      size: this.searchDataPerPage,
      page: this.currentPage,
    };
    if (sortIndex !== M_T_STRINGS.TASK_LIST.SORT_PARAMETER_WEIGHTED.VALUE) {
      params = { ...params, sort_field: this.sortParameterCompleted };
    }
    const activeOptionList = M_T_STRINGS.TASK_LIST.SORT_BY_COMPLETED.OPTION_LIST(t);
    let sort_index = 1;
    if (searchText === activeOptionList[2].value) sort_index = 1;
    if (searchText === activeOptionList[3].value) sort_index = -1;
    if (!jsUtils.isNull(sortIndex)) params.sort_by = sort_index;
    if (!jsUtils.isEmpty(searchText)) {
      params.search = searchText;
    }
    return onSearchCompletedTaskListApi(params, apiType);
  };

  getActiveTaskList = (apiType, isSnoozed) => {
    const {
      sortIndex,
      taskTypeIndex,
      assignedOnIndex,
      onActiveTaskListApi,
      onSnoozedTaskListApi,
      dueDateIndex,
      history,
      t,
    } = this.props;
    const { searchText } = store.getState().TaskReducer;
    const { height } = this.state;
    const { isTrialDisplayed } = this.props;
    let sort_index = null;
    const { TASK_LIST } = M_T_STRINGS;
    const activeOptionList = TASK_LIST.SORT_BY_ACTIVE_TASKS.OPTION_LIST(t);
    let params = null;
    params = {
      size: getLandingListingRowCount(height, isTrialDisplayed),
      page: this.currentPage,
    };

    if (sortIndex === activeOptionList[0].value) {
      sort_index = -1;
    } else if (sortIndex === activeOptionList[1].value) {
      params = {
        ...params,
        sort_field: ACTIVE_TASK_SORT_DETAILS.ASSIGNED_ON_SORTING,
      };
      sort_index = 1;
    } else if (
      sortIndex === activeOptionList[2].value ||
      sortIndex === activeOptionList[3].value
    ) {
      params = {
        ...params,
        sort_field: ACTIVE_TASK_SORT_DETAILS.NAME_SORTING,
      };
      sort_index = sortIndex === activeOptionList[2].value ? 1 : -1;
    } else if (sortIndex === activeOptionList[4].value) {
      params = {
        ...params,
      };
      sort_index = 2;
    } else {
      // do nothing
    }
    console.log('taskTypeIndex', taskTypeIndex);
    if (!jsUtils.isNull(sortIndex)) params.sort_by = sort_index;
    if (!jsUtils.isEmpty(taskTypeIndex) && taskTypeIndex !== -1) params.task_type = taskTypeIndex;
    if (!jsUtils.isNull(assignedOnIndex) && assignedOnIndex !== -1) params.assigned_on = assignedOnIndex;
    if (!jsUtils.isNull(dueDateIndex) && dueDateIndex !== -3) {
        params.due_type = getDueType(dueDateIndex);
        if (dueDateIndex !== -1 && dueDateIndex !== -2 && dueDateIndex !== 37) {
          params.due_date = dueDateIndex === 5 ? 0 : dueDateIndex;
        }
        if (dueDateIndex === 37) {
          params.due_date = 3;
          params.due_end_date = 7;
        }
    }

    params.is_snoozed = isSnoozed ? 1 : 0;
    if (!jsUtils.isEmpty(searchText)) {
      params.search = searchText;
    }
    return isSnoozed ? onSnoozedTaskListApi(params, apiType, history) : onActiveTaskListApi(params, apiType, history);
  };

  getTaskList = (apiType, tabIndex, assignedTaskType) => {
    console.log('isSnoozedTab(tabIndex)', isSnoozedTab(tabIndex), tabIndex);
    const { toggleFunction } = this.props;
    if (isOpenTab(tabIndex)) return this.getActiveTaskList(apiType, false);
    if (isSnoozedTab(tabIndex)) return this.getActiveTaskList(apiType, true);
    if (isCompletedTab(tabIndex)) return this.getCompletedTaskList(apiType);
    if (isAssigneedToOtherTab(tabIndex)) {
      if (assignedTaskType === ASSIGNED_TASK_TYPES.OPEN) {
        return this.getAssignedTaskList(apiType, ASSIGNED_TASK_TYPES.OPEN);
      } else if (assignedTaskType === ASSIGNED_TASK_TYPES.COMPLETED) {
        return this.getAssignedTaskList(apiType, ASSIGNED_TASK_TYPES.COMPLETED);
      } else {
        return this.getAssignedTaskList(apiType);
      }
    }
    if (tabIndex === 4) return this.getSelfTaskList(apiType);
    if (tabIndex === 5) {
      toggleFunction({ isNavVisible: true });
      return this.getDraftTaskList(apiType);
    }
    return null;
  };

  getSelfTaskList = (apiType) => {
    const { sortIndex, onSelfTaskListApi, searchText } =
      this.props;
    let params = null;
    const { height } = this.state;
    const { isTrialDisplayed } = this.props;
    params = {
      size: getLandingListingRowCount(height, isTrialDisplayed),
      page: this.currentPage,
    };
    if (sortIndex !== M_T_STRINGS.TASK_LIST.SORT_PARAMETER_WEIGHTED.VALUE) {
      params = { ...params, sort_field: this.sortParameter };
    }
    if (!jsUtils.isNull(sortIndex)) params.sort_by = sortIndex;
    if (!jsUtils.isEmpty(searchText)) {
      params.search = searchText;
    }
    return onSelfTaskListApi(params, apiType);
  };

  getAssignedTaskList = (apiType, assignedTaskType) => {
    const {
      onAssignedTaskListApi,
      sortIndex,
      history,
      taskTypeIndex,
      assignedOnIndex,
      searchText,
      dueDateIndex,
      t,
    } = this.props;

    let sort_index = null;
    let taskType = null;
    const { TASK_LIST } = M_T_STRINGS;
    const assignedOptionList = TASK_LIST.SORT_BY_ASSIGNED_TO_OTHERS.OPTION_LIST(t);
    let params = null;
    const currentPage =
      ASSIGNED_TASK_TYPES.OPEN === assignedTaskType
        ? this.currentAssignedOpenPage
        : this.currentAssignedCompletedPage;

    params = {
      size: 5,
      page: currentPage,
      // resolutions: { 'assignees.users.profile_pic': 'small' },
    };

    if (sortIndex === assignedOptionList[0].value) {
      sort_index = -1;
    } else if (sortIndex === assignedOptionList[1].value) {
      params = {
        ...params,
        sort_field: ASSIGNED_TASK_SORT_DETAILS.PUBLISHED_ON_SORTING,
      };
      sort_index = 1;
    } else if (
      sortIndex === assignedOptionList[2].value ||
      sortIndex === assignedOptionList[3].value
    ) {
      params = {
        ...params,
        sort_field: ASSIGNED_TASK_SORT_DETAILS.NAME_SORTING,
      };
      sort_index = sortIndex === assignedOptionList[2].value ? 1 : -1;
    } else {
      // do nothing
    }

    if (assignedTaskType === ASSIGNED_TASK_TYPES.OPEN) {
      taskType = 'open';
    } else if (assignedTaskType === ASSIGNED_TASK_TYPES.COMPLETED) {
      taskType = 'completed';
    } else {
      taskType = 'all';
    }

    if (taskType === 'open') {
      params = {
        size: 5,
        page: currentPage,
        // is_scroll: 1,
        // total_count: assignedOpenTaskCount,
        // top_record: 3,
        sort_field: getSortTypeBySortIndex(sortIndex),
      };
    }

    if (taskType === 'completed') {
      params = {
        size: 5,
        page: currentPage,
        // is_scroll: 1,
        // total_count: assignedCompletedTaskCount,
        // top_record: 3,
        sort_field: getSortTypeBySortIndex(sortIndex),
      };
    }

    params = {
      ...params,
      type: taskType,
    };
    if (!jsUtils.isEmpty(searchText)) {
      params.search = searchText;
    }
    if (sortIndex) params.sort_by = sort_index;
    if (!jsUtils.isEmpty(taskTypeIndex) && taskTypeIndex !== -1) params.task_type = taskTypeIndex;
    if (!jsUtils.isNull(assignedOnIndex) && assignedOnIndex !== -1) params.assigned_on = assignedOnIndex;
    if (!jsUtils.isNull(dueDateIndex) && dueDateIndex !== -3) {
      params.due_type = getDueType(dueDateIndex);
      if (dueDateIndex !== -1 && dueDateIndex !== -2 && dueDateIndex !== 37) {
        params.due_date = dueDateIndex === 5 ? 0 : dueDateIndex;
      }
      if (dueDateIndex === 37) {
        params.due_date = 3;
        params.due_end_date = 7;
      }
  }
    return onAssignedTaskListApi(params, apiType, history);
  };

  getDraftTaskList = (apiType) => {
    const {
      onDraftTaskListApi,
      sortIndex,
      assignedOnIndex,
      history,
      searchText,
      t,
    } = this.props;
    let params = null;
    let sort_index = null;
    const { TASK_LIST } = M_T_STRINGS;
    const draftOptionList = TASK_LIST.SORT_BY_EDITED.OPTION_LIST(t);
    const { height } = this.state;
    const { isTrialDisplayed } = this.props;
    params = {
      size: getLandingListingRowCount(height, isTrialDisplayed),
      page: this.currentPage,
      // resolutions: { 'assignees.users.profile_pic': 'small' },
    };

    if (sortIndex === draftOptionList[0].value) {
      sort_index = -1;
    } else if (sortIndex === draftOptionList[1].value) {
      params = {
        ...params,
        sort_field: DRAFT_TASK_SORT_DETAILS.UPDATED_ON_SORTING,
      };
      sort_index = 1;
    } else if (
      sortIndex === draftOptionList[2].value ||
      sortIndex === draftOptionList[3].value
    ) {
      params = {
        ...params,
        sort_field: DRAFT_TASK_SORT_DETAILS.NAME_SORTING,
      };
      sort_index = sortIndex === draftOptionList[2].value ? 1 : -1;
    } else {
      // do nothing
    }

    if (sortIndex) params.sort_by = sort_index;
    if (!jsUtils.isNull(assignedOnIndex) && assignedOnIndex !== -1) params.assigned_on = assignedOnIndex;
    if (!jsUtils.isEmpty(searchText)) {
      params.search = searchText;
    }
    return onDraftTaskListApi(params, apiType, history);
  };

  getSearchDraftTaskList = (apiType) => {
    const {
      onSearchDraftTaskListApi,
      sortIndex,
      searchText,
      t,
    } = this.props;
    let params = null;
    params = {
      size: this.searchDataPerPage,
      page: this.currentPage,
      sort_field: this.sortParameterDraftTask,
      // resolutions: { 'assignees.users.profile_pic': 'small' },
    };
    const activeOptionList = M_T_STRINGS.TASK_LIST.SORT_BY_EDITED.OPTION_LIST(t);
    let sort_index = 1;
    if (searchText === activeOptionList[2].value) sort_index = 1;
    if (searchText === activeOptionList[3].value) sort_index = -1;
    if (sortIndex) params.sort_by = sort_index;
    if (!jsUtils.isEmpty(searchText)) {
      params.search = searchText;
    }
    return onSearchDraftTaskListApi(params, apiType);
  };

  getCompletedTaskList = async (apiType) => {
    const {
      onCompletedTaskListApi,
      sortIndex,
      history,
      assignedOnIndex,
      searchText,
      t,
    } = this.props;
    let params = null;
    let sort_index = null;
    const { TASK_LIST } = M_T_STRINGS;
    const completedOptionList = TASK_LIST.SORT_BY_COMPLETED.OPTION_LIST(t);
    const { height } = this.state;
    const { isTrialDisplayed } = this.props;
    params = {
      size: getLandingListingRowCount(height, isTrialDisplayed),
      page: this.currentPage,
    };
    if (sortIndex === completedOptionList[0].value) {
      sort_index = -1;
    } else if (sortIndex === completedOptionList[1].value) {
      params = {
        ...params,
        sort_field: COMPLETED_TASK_SORT_DETAILS.CLOSED_ON_SORTING,
      };
      sort_index = 1;
    } else if (
      sortIndex === completedOptionList[2].value ||
      sortIndex === completedOptionList[3].value
    ) {
      params = {
        ...params,
        sort_field: COMPLETED_TASK_SORT_DETAILS.NAME_SORTING,
      };
      sort_index = sortIndex === completedOptionList[2].value ? 1 : -1;
    } else {
      // do nothing
    }
    if (!jsUtils.isEmpty(searchText)) {
      params.search = searchText;
    }
    if (!jsUtils.isNull(sortIndex)) params.sort_by = sort_index;
    if (!jsUtils.isNull(assignedOnIndex) && assignedOnIndex !== -1) params.assigned_on = assignedOnIndex;
    return onCompletedTaskListApi(params, apiType, false, history);
  };

  currentPage = store.getState().TaskReducer.currentPage;

  sortParameter = M_T_STRINGS.TASK_LIST.SORT_PARAMETER;

  sortParameterCompleted = M_T_STRINGS.TASK_LIST.SORT_PARAMETER_COMPLETED;

  sortParameterAssignedToOthers =
    M_T_STRINGS.TASK_LIST.SORT_PARAMETER_ASSIGNED_TO_OTHERS;

  sortParameterDraftTask = M_T_STRINGS.TASK_LIST.SORT_PARAMETER_DRAFT;

  listHeight = 250;
}

const mapStateToProps = (state) => {
  return {
    activeTaskId: state.TaskReducer.activeTaskId,
    active_tasks_list: state.TaskReducer.active_tasks_list,
    snoozed_tasks_list: state.TaskReducer.snoozed_tasks_list,
    tasks_results_list: state.TaskReducer.tasks_results_list,
    common_server_error: state.TaskReducer.common_server_error,
    isLoadMoreData: state.TaskReducer.isLoadMoreData,
    hasMore: state.TaskReducer.hasMore,
    hasMoreSnoozed: state.TaskReducer.hasMoreSnoozed,
    tab_index: state.TaskReducer.tab_index,
    searchText: state.TaskReducer.searchText,
    sortIndex: state.TaskReducer.sortIndex,
    selectedSortLabel: state.TaskReducer.selectedSortLabel,
    taskTypeIndex: state.TaskReducer.taskTypeIndex,
    assignedOnIndex: state.TaskReducer.assignedOnIndex,
    count: state.TaskReducer.count,
    snoozedCount: state.TaskReducer.snoozedCount,
    currentPage: state.TaskReducer.currentPage,
    isTaskDataLoading: state.TaskReducer.isTaskDataLoading,
    isTaskSearchLoading: state.TaskReducer.isTaskSearchLoading,
    isFlowListLoading: state.FlowListReducer.isDataLoading,
    isDataListLoading: state.DataListReducer.isLandingPageOtherDataListLoading,
    dataCountPerCall: state.TaskReducer.dataCountPerCall,
    taskLogIdFromFlow: state.TaskReducer.taskLogIdFromFlow,
    hideTaskList: state.TaskContentReducer.hideTaskList,
    initiateFlowTask: state.TaskContentReducer.initiateFlowTask,
    document_url_details: state.TaskReducer.document_url_details,
    searchAccordionIndex: state.TaskReducer.searchAccordionIndex,
    isTaskCountDataLoading: state.TaskReducer.isTaskCountDataLoading,
    hasMoreAssignedOpenTask: state.TaskReducer.hasMoreAssignedOpenTask,
    isAssignedOpenTaskLoading: state.TaskReducer.isAssignedOpenTaskLoading,
    isAssignedOpenTaskLoadMore: state.TaskReducer.isAssignedOpenTaskLoadMore,
    assignedOpenTaskCount: state.TaskReducer.assignedOpenTaskCount,
    hasMoreAssignedCompletedTask:
      state.TaskReducer.hasMoreAssignedCompletedTask,
    isAssignedCompletedTaskLoading:
      state.TaskReducer.isAssignedCompletedTaskLoading,
    isAssignedCompletedTaskLoadMore:
      state.TaskReducer.isAssignedCompletedTaskLoadMore,
    assignedCompletedTaskCount: state.TaskReducer.assignedCompletedTaskCount,
    originalLocation: state.NavBarReducer.originalLocation,
    dueDateIndex: state.TaskReducer.dueDateIndex,
    isFilterApplied: state.TaskReducer.isFilterApplied,
    isTrialDisplayed: state.NavBarReducer.isTrialDisplayed,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: (data) => {
      dispatch(NavBarDataChange(data));
    },
    toggleFunction: (data) => {
      dispatch(NavBarDataChange(data));
    },
    onCommonHeaderChange: (header) => {
      dispatch(commonHeaderChange(header));
    },
    onActiveTaskListApi: (params, type, history) => {
      dispatch(getActiveTaskListDataThunk(params, type, history));
    },
    onSnoozedTaskListApi: (params, type, history) => {
      dispatch(getSnoozedTaskListDataThunk(params, type, history));
    },
    onSearchActiveListApi: (params, type) => {
      dispatch(getTaskResultsListThunk(params, type));
    },
    onSearchCompletedTaskListApi: (params, type, func) => {
      dispatch(getSearchCompletedTaskListDataThunk(params, type, func));
    },
    onSelfTaskListApi: (params, type, func) => {
      dispatch(getSelfTaskListDataThunk(params, type, func));
    },
    onCompletedTaskListApi: (params, type, landingPageCall, history) => {
      dispatch(
        getCompletedTaskListDataThunk(params, type, landingPageCall, history),
      );
    },
    onAssignedTaskListApi: (params, type, history) => {
      dispatch(getAssignedTaskListDataThunk(params, type, history));
    },
    onSearchAssignedTaskListApi: (params, type, func) => {
      dispatch(getSearchAssignedTaskListDataThunk(params, type, func));
    },
    onDraftTaskListApi: (params, type, history) => {
      dispatch(getDraftTaskListDataThunk(params, type, history));
    },
    onSearchDraftTaskListApi: (params, type, func) => {
      dispatch(getSearchDraftTaskListDataThunk(params, type, func));
    },
    onTaskListDataChange: (value) => {
      dispatch(taskListDataChange(value));
    },
    // getTaskCountApi: () => {
    //   dispatch(getTaskCountApiAction());
    // },
    clearTaskContentReduxState: () => {
      dispatch(clearTaskContentData());
    },
    setSearchAccordionIndex: (index) => {
      dispatch(setSearchAccordionIndexAction(index));
    },
    postTaskCreationPrompt: (...params) => {
      dispatch(postTaskCreationPromptThunk(...params));
    },
    dispatch,
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(MyTasks)));

MyTasks.defaultProps = {
  searchText: '',
  activeTaskId: null,
  sortIndex: null,
  dataCountPerCall: 10,
  hasMore: true,
  count: null,
  common_server_error: null,
  document_url_details: [],
  searchAccordionIndex: null,
};

MyTasks.propTypes = {
  setModalBg: propType.func.isRequired,
  history: propType.objectOf(propType.any).isRequired,
  activeTaskId: propType.string,
  tab_index: propType.number.isRequired,
  searchText: propType.string,
  sortIndex: propType.number,
  onActiveTaskListApi: propType.func.isRequired,
  onSnoozedTaskListApi: propType.func.isRequired,
  onCompletedTaskListApi: propType.func.isRequired,
  onTaskListDataChange: propType.func.isRequired,
  onAssignedTaskListApi: propType.func.isRequired,
  onSelfTaskListApi: propType.func.isRequired,
  active_tasks_list: propType.arrayOf(propType.object).isRequired,
  snoozed_tasks_list: propType.arrayOf(propType.object).isRequired,
  location: propType.objectOf(propType.any).isRequired,
  hideTaskList: propType.bool.isRequired,
  hasMore: propType.bool,
  isTaskDataLoading: propType.bool.isRequired,
  isLoadMoreData: propType.bool.isRequired,
  isTaskCountDataLoading: propType.bool.isRequired,
  clearTaskContentReduxState: propType.func.isRequired,
  dataCountPerCall: propType.number,
  common_server_error: propType.string,
  count: propType.number,
  isMobileView: propType.bool.isRequired,
  document_url_details: propType.arrayOf(propType.any),
  searchAccordionIndex: propType.number,
  setSearchAccordionIndex: propType.func.isRequired,
  getTaskCountApi: propType.func.isRequired,
};
