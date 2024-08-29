import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import {
  clearTaskContentData,
  clearTaskListData,
  getActiveTaskListDataThunk,
  getCompletedTaskListDataThunk,
  getTaskCountApiAction,
  taskListDataChange,
} from 'redux/actions/TaskActions';
import { isEmpty, isNaN } from 'utils/jsUtility';
import { useHistory } from 'react-router-dom';
import { TASKS, OPEN_TASKS } from 'urls/RouteConstants';
import { getTaskUrl } from 'utils/taskContentUtils';
import { REDIRECTED_FROM, ROUTE_METHOD } from 'utils/Constants';
import { getUserProfileData, routeNavigate } from 'utils/UtilityFunctions';
import { layoutMainWrapperId } from 'components/form_components/modal/Modal.strings';
import { useTranslation } from 'react-i18next';
import { ARIA_LABELS, M_T_STRINGS, TASK_TAB_INDEX } from '../LandingPage.strings';
import styles from './ToDoTask.module.scss';
import TaskCard from './task_card/TaskCard';
import NoDataFound from '../no_data_found/NoDataFound';
import { NO_DATA_FOUND_STRINGS } from '../no_data_found/NoDataFound.strings';
import { isArray } from '../../../utils/jsUtility';
import { BS } from '../../../utils/UIConstants';
import { getTasksDescription } from '../my_tasks/MyTasks.utils';
import { LANDING_PAGE_TOPICS } from '../main_header/common_header/CommonHeader.strings';

function ToDoTask(props) {
  const {
    isLoadMoreData,
    isTaskDataLoading,
    totalCount,
    taskList,
    serverError,
    hasMore,
    remainingTasksCount,
    isDataListLoading,
    isFlowListLoading,
    clearTaskContentReduxState,
    isWelcomeInsightsOpen,
  } = props;
  const { t } = useTranslation();
  const isInitialLoading =
    isTaskDataLoading || isDataListLoading || isFlowListLoading;
  const isLoading = isInitialLoading || isLoadMoreData;
  const pref_locale = localStorage.getItem('application_language');
  const [perPageDataCount] = useState(3);
  const [page] = useState(1);
  const containerTaskRef = useRef(null);
  const history = useHistory();
  let listItems = [];
  let loadMoreCard = null;

  const calculateTaskLengthPerSize = () => {
    const marginBottom = 52 * 2;
    const ProcDlheight = 74 * 2;
    const initialTaskCard = 56;
    const header = 65;
    const taskInner = 140;
    const profile = getUserProfileData();
    const { show_cover } = profile;
    let calcLeftOutSpace = ProcDlheight + header + taskInner + marginBottom;
    if (show_cover || isWelcomeInsightsOpen) calcLeftOutSpace += 116;
    const refContainerHeight = document.getElementById(layoutMainWrapperId)?.clientHeight;
    const rowCount = Math.floor((refContainerHeight - calcLeftOutSpace) / initialTaskCard);
    return (!isNaN(rowCount) && rowCount >= 2) ? rowCount : 2;
  };

  useEffect(() => {
    const { getActiveTaskList, onTaskListDataChange } = props;
    onTaskListDataChange({ tab_index: 1, active_tasks_list: [] });
    clearTaskContentReduxState();
    getActiveTaskList(
      {
        page,
        size: calculateTaskLengthPerSize(),
      },
      M_T_STRINGS.TASK_LIST.GET_TASK_LIST,
      history,
    );
    return () => {
      const { clearTaskListData } = props;
      clearTaskListData();
    };
  }, []);

  const openTaskCard = (data) => {
    let queryParams = {};
    if (data?.task_metadata_uuid) queryParams = { uuid: data.task_metadata_uuid };
    const openTaskCradPathName = `${TASKS}/${getTaskUrl()}/${data.task_log_id}`;
    const openTaskCardState = { ...data, selectedCardTab: TASK_TAB_INDEX.OPEN, redirectedFrom: REDIRECTED_FROM.HOME };
    const openTaskCardSearchParams = queryParams
    ? `?${new URLSearchParams(queryParams).toString()}`
    : null;
    routeNavigate(history, ROUTE_METHOD.PUSH, openTaskCradPathName, openTaskCardSearchParams, openTaskCardState);
  };

  const loadMoreData = () => {
    const loadMoreDataPathName = `${TASKS}/${OPEN_TASKS}`;
    routeNavigate(history, ROUTE_METHOD.PUSH, loadMoreDataPathName, null, null);
  };
  if (isInitialLoading) {
    listItems = Array(perPageDataCount)
      .fill()
      .map((eachCard, index) => <TaskCard isDataLoading key={index} />);
  } else if (!isEmpty(taskList)) {
    listItems =
      taskList &&
      isArray(taskList) &&
      taskList.map((data, index) => {
        const {
          is_closed, // c
          task_name,
          published_by,
          task_status,
          due_date, // c
          color_code,
          task_definition,
          task_owner,
          documentUrlDetails, // c
          tabIndex,
          flow_id,
          initiated_by,
          task_category,
          is_test_bed_task,
          task_viewed,
          is_assigned, // c
          task_description,
          last_updated_by,
          translation_data,
        } = data;
        const taskPublishers = published_by || last_updated_by;
        return (
          <TaskCard
            key={index}
            taskName={translation_data?.[pref_locale]?.task_name || task_name}
            publishedBy={published_by}
            status={task_status}
            isIconThumbnail={!isEmpty(flow_id)}
            dueDate={due_date}
            onClick={() => openTaskCard(data)}
            isClosed={is_closed}
            task_definition={task_definition}
            data={data}
            assignees={task_owner}
            documentUrlDetails={documentUrlDetails}
            tabIndex={tabIndex}
            color_code={color_code}
            CardContainerStyle={styles.TaskCardContainer}
            task_name={translation_data?.[pref_locale]?.task_name || task_name}
            initiated_by={initiated_by}
            task_category={task_category}
            showInitiator
            isTestBedTask={is_test_bed_task}
            flow_short_code={data && data.flow_metadata && data.flow_metadata.flow_short_code}
            taskViewed={task_viewed}
            isAssigned={is_assigned}
            task_description={getTasksDescription(
              t,
              task_description,
              task_definition,
              task_category,
              taskPublishers,
              translation_data,
              pref_locale,
            )}
            isLandingPage
          />
        );
      });
    if (isLoadMoreData) {
      listItems.push(
        ...Array(perPageDataCount)
          .fill()
          .map((eachCard, index) => <TaskCard isDataLoading key={index} />),
      );
    }
  } else {
    if (serverError) listItems = <div>Something went wrong!</div>;
    else {
      listItems = (
        <NoDataFound
          originalLocation="Home Tasks"
          dataText={NO_DATA_FOUND_STRINGS.LANDING_PAGE_TODO_TEXT}
          linkText={NO_DATA_FOUND_STRINGS.NO_DATA_LINK_TEXT.MY_TASKS}
        />
      );
    }
  }

  if (hasMore && !isLoading) {
    loadMoreCard = (
      <div className={cx(gClasses.CenterH, styles.MoreItems, gClasses.MB20)}>
        <button
          className={cx(gClasses.FS13, gClasses.FontWeight500)}
          onClick={loadMoreData}
          aria-label={ARIA_LABELS.LOAD_MORE_TASKS}
        >
          {`+${remainingTasksCount} ${t(LANDING_PAGE_TOPICS.MORE)}`}
        </button>
        <div className={styles.LineMarker} />
      </div>
    );
  }
  return (
    <div>
      <h3>
      <div
        className={cx(
          gClasses.MB16,
          gClasses.HeadingTitleV1,
        )}
      >
        {t(LANDING_PAGE_TOPICS.TASK)}
        <span className={cx(gClasses.FTwo16GrayV89, gClasses.ML4)}>
          {totalCount ? ` (${totalCount})` : null}
        </span>
      </div>
      </h3>
      <div className={cx(gClasses.MB24, BS.P_RELATIVE, gClasses.ZIndex2)} ref={containerTaskRef}>{listItems}</div>
      {remainingTasksCount > 0 ? loadMoreCard : null}
    </div>
  );
}
const mapStateToProps = ({
  TaskReducer,
  FlowListReducer,
  DataListReducer,
  WelcomeInsightReducer,
}) => {
  return {
    isTaskDataLoading: TaskReducer.isTaskDataLoading,
    isFlowListLoading: FlowListReducer.isDataLoading,
    isDataListLoading: DataListReducer.isLandingPageOtherDataListLoading,
    isLoadMoreData: TaskReducer.isLoadMoreData,
    serverError: TaskReducer.common_server_error,
    taskList: TaskReducer.active_tasks_list,
    remainingTasksCount: TaskReducer.remainingTasksCount,
    hasMore: TaskReducer.hasMore,
    totalCount: TaskReducer.count,
    isWelcomeInsightsOpen: WelcomeInsightReducer.isWelcomeInsightsOpen,
  };
};
const mapDispatchToProps = {
  getActiveTaskList: getActiveTaskListDataThunk,
  getCompletedTaskList: getCompletedTaskListDataThunk,
  clearTaskListData: clearTaskListData,
  getTaskCountApi: getTaskCountApiAction,
  onTaskListDataChange: taskListDataChange,
  clearTaskContentReduxState: clearTaskContentData,
};
export default connect(mapStateToProps, mapDispatchToProps)(ToDoTask);
