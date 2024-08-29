import React from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { ASSIGNED_TO_OTHERS_TASK_SEARCH_LABEL } from 'containers/landing_page/my_tasks/task_search/TaskSearch.utils';
import Skeleton from 'react-loading-skeleton';
import { randomNumberInRange } from 'utils/generatorUtils';
import {
  ARIA_LABELS,
  M_T_STRINGS,
  TASK_CONTENT_STRINGS,
  TASK_TAB_INDEX,
} from 'containers/landing_page/LandingPage.strings';
import { keydownOrKeypessEnterHandle, priorityTask } from 'utils/UtilityFunctions';
// import AssignedToOthersTaskIcon from 'assets/icons/task/AssignedToOthersTaskIcon';
// import OpenTaskIcon from 'assets/icons/task/OpenTaskIcon';
// import CompletedTaskIcon from 'assets/icons/task/CompletedTaskIcon';
// import DraftTaskIcon from 'assets/icons/task/DraftTaskIcon';
import BugIcon from 'assets/icons/flow/BugIcon';
import AttachmentsIcon from 'assets/icons/AttachmentsIcon';
// import FlagIcon from 'assets/icons/FlagIcon';
// import FlagIconNew from 'assets/icons/FlagIconNew';
import { FORM_PARENT_MODULE_TYPES } from 'utils/constants/form.constant';
import { BS } from 'utils/UIConstants';
import { SPACE } from 'utils/strings/CommonStrings';
import { useTranslation } from 'react-i18next';
import { EPopperPlacements, UserDisplayGroup } from '@workhall-pvt-lmt/wh-ui-library';
import { useHistory } from 'react-router-dom';
import { TASK_PRIORITY_TYPE } from '../../../../utils/Constants';
import Thumbnail from '../../../../components/thumbnail/Thumbnail';
import styles from './TaskCard.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import {
  TASK_CATEGORY_ADHOC_TASK,
  TASK_CATEGORY_DATALIST_ADHOC_TASK,
  TASK_CATEGORY_FLOW_ADHOC_TASK,
  TASK_CATEGORY_FLOW_TASK,
} from '../../../../utils/taskContentUtils';
import { dateDuration } from '../../../data_list/view_data_list/data_list_entry_task/DataListEntryTask.utils';
import { getPopperContent } from '../../../../utils/UtilityFunctions';
import { constructAvatarGroupList } from '../../../application/app_listing/AppListing.utils';

function TaskCard(props) {
  const {
    isClosed,
    taskName,
    color_code,
    task_name,
    tabIndex,
    isDataLoading,
    dueDate,
    task_definition,
    task_description,
    assignees,
    assignedOn,
    snoozedUntil,
    CardContainerStyle,
    isSearchTask,
    isCompletedTask,
    assignedOnStyles,
    SearchCardContainerNameStyles,
    isTaskDefinition,
    AssignedToOthersLabel,
    isTestBedTask,
    data,
    initiated_by,
    task_category,
    showInitiator,
    flow_short_code,
    taskViewed = false,
    status,
    isAssigned = true,
    isComplete,
    completedOn,
  } = props;
  const { t } = useTranslation();
  const history = useHistory();
  let dueStyle = null;
  let dueLabel = null;
  let skeletonTaskName = null;
  let statusView = null;
  let assignedOnView = null;
  let snoozedUntilView = null;
  // let flagIcon = null;

  const getAssignee = (taskCategory, assignees, initiatedBy) => {
    if (tabIndex === TASK_TAB_INDEX.OPEN || showInitiator) {
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
    return assignees;
  };

  const getUserDisplayGroup = (isSearchTask, assignees) => {
    if (!isSearchTask && assignees) {
      return (
        <UserDisplayGroup
          assignees={getAssignee(task_category, assignees, initiated_by)}
          userAndTeamList={constructAvatarGroupList(getAssignee(task_category, assignees, initiated_by) || {})}
          count={1}
          popperPlacement={EPopperPlacements.AUTO}
          getPopperContent={(id, type, onShow, onHide) =>
            getPopperContent(id, type, onShow, onHide, history, true)
          }
          getRemainingPopperContent={(id, type, onShow, onHide) =>
            getPopperContent(id, type, onShow, onHide, history, true)
          }
          className={cx(styles.width125, styles.UserDisplayGroup)}
        />
      );
    }
    return null;
  };
  let taskAttachmentsCount = 0;
  if (data && data.task_reference_documents) {
    taskAttachmentsCount = data.task_reference_documents.length;
  }
  const onCardClick = () => {
    if (!isDataLoading) {
      const { onClick } = props;
        onClick();
    }
  };
  if (isClosed) {
    dueStyle = TASK_PRIORITY_TYPE.COMPLETED;
  } else if (dueDate) {
    const priority = priorityTask(
      dueDate.duration_days,
      M_T_STRINGS.TASK_LIST.DEADLINE_HIGH_PRIORITY_VALUE,
    );
    if (priority === TASK_PRIORITY_TYPE.HIGH_PRIORITY.VALUE) {
      dueStyle = styles.HighPriorityDue;
      dueLabel = t(TASK_CONTENT_STRINGS.DUE.LABEL) + SPACE + dateDuration(dueDate.duration_display);
      // flagIcon = <FlagIcon className={cx(styles.ML20)} />;
    } else if (!priority) {
      dueStyle = styles.MediumPriorityDue;
      dueLabel = t(TASK_CONTENT_STRINGS.DUE.LABEL) + SPACE + dateDuration(dueDate.duration_display);
      // flagIcon = <FlagIcon className={cx(styles.ML20, styles.MediumPriorityDueFlag)} />;
    } else {
      dueStyle = styles.OverDue;
      dueLabel = t(TASK_CONTENT_STRINGS.OVER_DUE);
      // flagIcon = <FlagIcon className={cx(styles.ML20)} />;
    }
  } else {
    dueStyle = styles.NoDue;
    dueLabel = t(TASK_CONTENT_STRINGS.NO_DUE);
}

  // if (tabIndex === TASK_TAB_INDEX.ASSIGNED_TO_OTHERS) {
  //   if (total_tasks === cancelled_tasks) {
  //     dueStyle = styles.OverDue;
  //     dueLabel = TASK_CONTENT_STRINGS.CANCELLED;
  //   } else if (total_tasks === completed_tasks) {
  //     dueStyle = styles.Completed;
  //     dueLabel = TASK_CONTENT_STRINGS.COMPLETED;
  //   } else {
  //     dueStyle = styles.InProgress;
  //     dueLabel = TASK_CONTENT_STRINGS.OPEN_TASK;
  //   }
  // }

  if (isDataLoading) {
    const MAX_LENGTH = 250;
    const MIN_LENGTH = 100;
    const taskNameLength = `${randomNumberInRange(MIN_LENGTH, MAX_LENGTH)}px`;
    const statusLoaderWidth = 110;
    const statusLoaderHeight = 23;
    skeletonTaskName = <Skeleton width={taskNameLength} />;
    statusView = (
      <Skeleton width={statusLoaderWidth} height={statusLoaderHeight} />
    );
  } else {
    if (
      TASK_TAB_INDEX.COMPLETED !== tabIndex &&
      TASK_TAB_INDEX.DRAFT_TASK !== tabIndex
    ) {
      if (!isComplete) {
      statusView = (
        <span
          className={cx(
            gClasses.FontWeight500,
            gClasses.FOne11,
            styles.TaskStatus,
            styles.DueDaysText,
            BS.D_FLEX,
            BS.D_FLEX_JUSTIFY_CENTER,
            BS.ALIGN_ITEM_CENTER,
            dueStyle,
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
            assignedOnStyles,
          )}
        >
          {completedOn}
        </div>
        );
      }
    }
  }

  if (assignedOn) {
    assignedOnView = (
      <div
        className={cx(
          gClasses.MR15,
          gClasses.FTwo12,
          styles.AssignedOn,
          assignedOnStyles,
        )}
      >
        {assignedOn}
      </div>
    );
  }
  if (snoozedUntil) {
    snoozedUntilView = (
      <div
        className={cx(
          gClasses.MR15,
          gClasses.FTwo12,
          styles.AssignedOn,
          assignedOnStyles,
        )}
      >
        {snoozedUntil}
      </div>
    );
  }
  let SearchTaskOpenOrCompleted = null;
  if (tabIndex === TASK_TAB_INDEX.ASSIGNED_TO_OTHERS && isSearchTask) {
    SearchTaskOpenOrCompleted = (
      <span
        className={cx(
          gClasses.CenterV,
          AssignedToOthersLabel,
          gClasses.FontWeight500,
        )}
      >
        {isCompletedTask
          ? ASSIGNED_TO_OTHERS_TASK_SEARCH_LABEL.COMPLETED
          : ASSIGNED_TO_OTHERS_TASK_SEARCH_LABEL.OPEN}
      </span>
    );
  }
  // Commenting the below for now, will be required for upcoming new UI version
  // let currentTabIcon = null;

  // switch (tabIndex) {
  //   case TASK_TAB_INDEX.OPEN:
  //     currentTabIcon = <OpenTaskIcon className={styles.AdhocTaskIcon} />;
  //     break;
  //   case TASK_TAB_INDEX.ASSIGNED_TO_OTHERS:
  //     currentTabIcon = (
  //       <AssignedToOthersTaskIcon className={styles.AdhocTaskIcon} />
  //     );
  //     break;
  //   case TASK_TAB_INDEX.COMPLETED:
  //     currentTabIcon = <CompletedTaskIcon className={styles.AdhocTaskIcon} />;
  //     break;
  //   case TASK_TAB_INDEX.DRAFT_TASK:
  //     currentTabIcon = <DraftTaskIcon className={styles.AdhocTaskIcon} />;
  //     break;
  //   default:
  //     currentTabIcon = null;
  // }

  const thumbnailTitle = (task_category === TASK_CATEGORY_FLOW_ADHOC_TASK || task_category === TASK_CATEGORY_FLOW_TASK) ? flow_short_code : (task_definition || task_name);
  let thumbnailClasses = styles.Thumbnail;
  if (data?.is_send_back_task) thumbnailClasses = styles.SendBackThumbnail;
  if (data?.task_type === 2) thumbnailClasses = styles.ReviewTaskThumbnail;
  return (
    <div
      role="button"
      className={cx(
        styles.CardContainer,
        gClasses.CenterV,
        CardContainerStyle,
        isTestBedTask && styles.TestBedContainer,
      )}
      onClick={() => {
        onCardClick();
      }}
      onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCardClick(e)}
      tabIndex={0}
      aria-label={` ${isDataLoading ? ARIA_LABELS.LOADING_TASK : `${taskName} Task`}`}
    >
      <div
        className={cx(
          SearchCardContainerNameStyles,
          styles.CardNameContainer,
          gClasses.CenterV,
        )}
      >
        {!isSearchTask && (
          <div className={cx(gClasses.MR8, styles.ThumbnailContainer)}>
            {isTestBedTask ? (
              <div
                className={cx(gClasses.CenterVH, styles.TestBedIconContainer)}
              >
                <BugIcon fillColor="#fff" />
              </div>
            ) : (
              <Thumbnail
                title={thumbnailTitle}
                type={FORM_PARENT_MODULE_TYPES.TASK}
                containerClassName={thumbnailClasses}
                thumbNailIconClass={cx(styles.ThumbnailText, BS.D_FLEX, BS.JC_CENTER, BS.ALIGN_ITEM_CENTER)}
                background={color_code}
                iconClasses={styles.AdhocTaskIcon}
                isLoading={isDataLoading}
                customLoaderHeight="28px"
                customLoaderWidth="30px"
                customSvgHeight="16"
                customSvgWidth="13"
                isIconThumbnail
                is_send_back_task={data?.is_send_back_task}
                isReviewTask={data?.task_type === 2}
              />
            )}
          </div>
        )}
        <div
          title={!isDataLoading && taskName}
          className={cx(gClasses.FTwo13GrayV3, styles.MW50)}
        >
          <span className={gClasses.CenterV}>
            <span className={
              cx(
                 styles.TaskName,
                 gClasses.FTwo13GrayV3,
                 (
                   taskViewed ||
                   (status === t(TASK_CONTENT_STRINGS.COMPLETED).toLowerCase()) ||
                   (dueLabel === t(TASK_CONTENT_STRINGS.COMPLETED)) || (!isAssigned)
                 ) ? cx(gClasses.FontWeight500) : gClasses.FontWeight600)}
            >
              {isDataLoading ? skeletonTaskName : taskName}
            </span>
            {taskAttachmentsCount !== 0 ? (
              <span
                title={!isDataLoading && taskName}
                className={cx(gClasses.FTwo13, gClasses.ML10, gClasses.CenterV)}
              >
                <div className={styles.AttachmentCount}>
                  {isDataLoading ? skeletonTaskName : taskAttachmentsCount}
                </div>
                <div className={gClasses.ML3}>
                  {isDataLoading ? (
                    skeletonTaskName
                  ) : (
                    <AttachmentsIcon className={styles.AttachmentIcon} />
                  )}
                </div>
              </span>
            ) : null}
          </span>
          {/* {getUserDisplayGroup(isSearchTask, assignees)} */}
        </div>

        {isTaskDefinition && task_description && (
          <div
            title={task_description}
            className={cx(
              gClasses.ML15,
              gClasses.FTwo12,
              !isDataLoading ? styles.TaskDefinition : null,
            )}
          >
            {!isSearchTask && task_description}
          </div>
        )}
      </div>
      <div className={cx(styles.TaskStatusContainer, snoozedUntilView && gClasses.MR7)}>
        {snoozedUntilView || getUserDisplayGroup(isSearchTask, assignees)}
        {SearchTaskOpenOrCompleted}
        {assignedOnView}
        {!isSearchTask && statusView}
        {/* {!isDataLoading && isLandingPage && flagIcon} */}
        {/* Other status - no due, over due, completed, in progress */}
        {/* {TASK_TYPE.IN_PROGRESS,TASK_TYPE.COMPLETED,TASK_TYPE.NO_DUE,TASK_TYPE.OVERDUE}  */}
      </div>
    </div>
  );
}
export default TaskCard;

TaskCard.propTypes = {
  isDataLoading: PropTypes.bool,
  isTaskDefinition: PropTypes.bool,
  isLandingPage: PropTypes.bool,
};

TaskCard.defaultProps = {
  isDataLoading: false,
  isTaskDefinition: true,
  isLandingPage: false,
};
