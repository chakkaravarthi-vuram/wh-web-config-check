import React, { lazy } from 'react';
import { TASK_TAB_INDEX } from 'containers/landing_page/LandingPage.strings';
import { isEmpty } from 'lodash';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import CloseIconNew from 'assets/icons/CloseIconNew';
import cx from 'classnames/bind';
import { isMobileScreen } from 'utils/UtilityFunctions';
import { useTranslation } from 'react-i18next';
import { getAssignedOnDetails, getTasksDescription } from '../MyTasks.utils';
import styles from './TaskSearchResults.module.scss';
import {
  getCurrentTabNoSearchDataText,
  TASK_SEARCH_HEAD,
} from './TaskSearch.utils';
import gClasses from '../../../../scss/Typography.module.scss';
import { ICON_STRINGS } from '../../../../components/list_and_filter/ListAndFilter.strings';

// lazy imports
const NoDataFound = lazy(() => import('containers/landing_page/no_data_found/NoDataFound'));
const TaskCard = lazy(() => import('../../to_do_task/task_card/TaskCard'));

function TaskSearchResults({
  isTaskSearchLoading,
  tasks_results_list,
  openTaskCard,
  setSearchValue,
  tab_index,
  taskSearchModalOpen,
  onCloseIconClick,
}) {
  const { t } = useTranslation();
  const pref_locale = localStorage.getItem('application_language');
  let listItems = null;
  if (!taskSearchModalOpen) {
    setSearchValue(EMPTY_STRING);
  }
  if (isTaskSearchLoading) {
    listItems = Array(4)
      .fill()
      .map((eachCard, index) => (
        <TaskCard
          CardContainerStyle={styles.TaskCardContainer}
          isDataLoading
          key={index}
          isTaskDefinition={false}
        />
      ));
  } else if (isEmpty(tasks_results_list)) {
    listItems = [
      <NoDataFound
        NoSearchFoundLabelStyles={styles.NoSearchFoundLabel}
        dataText={getCurrentTabNoSearchDataText(t, tab_index)}
      />,
    ];
  } else if (!isEmpty(tasks_results_list)) {
    listItems = tasks_results_list.map((data, index) => {
      const {
        is_closed,
        task_name,
        published_by,
        task_status,
        due_date,
        color_code,
        task_definition,
        task_owner,
        documentUrlDetails,
        flow_id,
        assigned_on,
        published_on,
        assignees,
        task_category,
        last_updated_on,
        closed_on,
        total_tasks,
        completed_tasks,
        task_viewed,
        is_assigned,
        translation_data,
      } = data;
      let taskViewed = task_viewed;
      let assignedOn = null;
      let isCompletedTask = false;
      if (TASK_TAB_INDEX.ASSIGNED_TO_OTHERS) {
        if (total_tasks === completed_tasks) {
          isCompletedTask = true;
        } else {
          isCompletedTask = false;
        }
      }
      switch (tab_index) {
        case TASK_TAB_INDEX.OPEN:
        case TASK_TAB_INDEX.ASSIGNED_TO_OTHERS:
        case TASK_TAB_INDEX.SELF_TASK:
        case TASK_TAB_INDEX.SNOOZED_TASK:
          assignedOn = getAssignedOnDetails(
            isEmpty(assigned_on) ? published_on : assigned_on,
            tab_index,
          );
          break;
        case TASK_TAB_INDEX.COMPLETED:
          assignedOn = getAssignedOnDetails(closed_on, tab_index);
          break;
        case TASK_TAB_INDEX.DRAFT_TASK:
          assignedOn = getAssignedOnDetails(last_updated_on, tab_index);
          taskViewed = false;
          break;
        default:
          return null;
      }

      return (
        <TaskCard
          key={index}
          taskName={task_name}
          publishedBy={published_by}
          status={task_status}
          isIconThumbnail={!isEmpty(flow_id)}
          dueDate={due_date}
          onClick={() => {
            setSearchValue(EMPTY_STRING);
            openTaskCard(data);
          }}
          isClosed={is_closed}
          task_definition={task_definition}
          task_description={getTasksDescription(
            t,
            task_definition,
            task_category,
            published_by,
            translation_data,
            pref_locale,
          )}
          data={data}
          assignees={isEmpty(task_owner) ? assignees : task_owner}
          documentUrlDetails={documentUrlDetails}
          tabIndex={tab_index}
          color_code={color_code}
          task_name={translation_data?.[pref_locale]?.task_name || task_name}
          assignedOn={assignedOn}
          CardContainerStyle={styles.TaskCardContainer}
          isSearchTask
          isCompletedTask={isCompletedTask}
          assignedOnStyles={styles.assignedOn}
          SearchCardContainerNameStyles={styles.SearchCardContainerName}
          isTaskDefinition={false}
          AssignedToOthersLabel={styles.StatusLabel}
          taskViewed={taskViewed}
          isAssigned={is_assigned}
        />
      );
    });
  }
  return isMobileScreen()
    ? taskSearchModalOpen && (
        <div className={styles.SearchMainContainer}>
          <div className={styles.SearchSubContainer}>
          <span>
            <p className={styles.TaskHead}>{TASK_SEARCH_HEAD.TASKS}</p>
            <CloseIconNew
              title={ICON_STRINGS.CLEAR}
              className={cx(styles.CloseIcon, gClasses.CursorPointer)}
              onClick={onCloseIconClick}
            />
          </span>
          {listItems}
          </div>
        </div>
      )
    : taskSearchModalOpen && (
        <div className={styles.SearchMainContainer}>
          <div className={styles.SearchSubContainer}>
          <span>
            <p className={styles.TaskHead}>{TASK_SEARCH_HEAD.TASKS}</p>
          </span>
          {listItems}
          </div>
        </div>
      );
}

export default TaskSearchResults;
