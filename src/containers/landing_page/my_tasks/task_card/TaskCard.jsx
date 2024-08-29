import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import AttachmentsIcon from 'assets/icons/AttachmentsIcon';
import { useTranslation } from 'react-i18next';
import Thumbnail, {
  THUMBNAIL_TYPE,
} from '../../../../components/thumbnail/Thumbnail';
import AvatarGroup from '../../../../components/avatar_group/AvatarGroup';
import CardPatch from '../../../../components/card_patch/CardPatch';
import styles from './TaskCard.module.scss';
import gClasses from '../../../../scss/Typography.module.scss';
import { BS } from '../../../../utils/UIConstants';
import {
  M_T_STRINGS,
  TASK_ACCORDION_INDEX,
  TASK_CONTENT_STRINGS,
  TASK_TAB_INDEX,
} from '../../LandingPage.strings';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { LOADER_STRINGS } from '../../all_flows/flow_card/FlowCard.strings';
import { BOX_STYLE } from '../../../../utils/constants/myTask.constant';

import {
  getUserImagesForAvatar,
  priorityTask,
} from '../../../../utils/UtilityFunctions';
import { getCurrentUser } from '../../../../utils/userUtils';
import jsUtils from '../../../../utils/jsUtility';
import { randomNumberInRange } from '../../../../utils/generatorUtils';
import { getTimeToDisplayForAssignedOn } from '../../../../utils/dateUtils';
import { dateDuration } from '../../../data_list/view_data_list/data_list_entry_task/DataListEntryTask.utils';

const constructDescription = (t, referenceName) => referenceName
    ? `${referenceName}(${t(TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.ADHOC)}) | `
    : '';
const getPublisher = (t, publishedBy, taskViewed, referenceName) => {
  if (publishedBy) {
    const currentUser = getCurrentUser(publishedBy);
    if (currentUser === publishedBy.email) {
      return taskViewed ? (
        <div
          className={cx(
            gClasses.FOne11GrayV38,
            gClasses.FontWeight400,
            gClasses.Ellipsis,
          )}
        >
          {`${constructDescription(t, referenceName)}
             ${t(TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.SELF_TASK)}`}
        </div>
      ) : (
        <div
          className={cx(
            gClasses.FOne11GrayV39,
            gClasses.FontWeight400,
            gClasses.Ellipsis,
          )}
        >
          {`${constructDescription(t, referenceName)}
             ${t(TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.SELF_TASK)}`}
        </div>
      );
    }
    return (
      <div>
        {taskViewed ? (
          <span className={cx(gClasses.FOne11GrayV38, gClasses.FontWeight400)}>
            {`${constructDescription(t, referenceName)}
             ${t(TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.ASSIGNED_BY)}`}
          </span>
        ) : (
          <span className={cx(gClasses.FOne11GrayV39, gClasses.FontWeight400)}>
            {`${constructDescription(t, referenceName)}
             ${t(TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.ASSIGNED_BY)}`}
          </span>
        )}
        <span className={cx(gClasses.FOne11BlackV1, gClasses.Ellipsis)}>
          {` ${publishedBy.first_name} ${publishedBy.last_name}`}
        </span>
      </div>
    );
  }
  return null;
};

const getTaskName = (taskName, taskViewed, isDataLoading, taskAttachmentsCount) => {
  if (taskViewed) {
    return (
    <>
      <span className={cx(gClasses.FTwo13GrayV35, styles.ViewedTaskOpacity)}>
        {taskName}
      </span>
      {taskAttachmentsCount !== 0 ? (
        <span
          title={taskName}
          className={cx(gClasses.FTwo13, gClasses.ML10, gClasses.CenterV)}
        >
          <div className={styles.AttachmentCount}>
            {!isDataLoading && taskAttachmentsCount}
          </div>
          <div className={gClasses.ML3}>
            {!isDataLoading &&
            (
              <AttachmentsIcon className={styles.AttachmentIcon} />
            )}
          </div>
        </span>
      ) : null}
    </>
    );
  }
  return (
    <>
  <span className={cx(gClasses.FTwo13BlackV8)}>{taskName}</span>
  {taskAttachmentsCount !== 0 ? (
              <span
                title={taskName}
                className={cx(gClasses.FTwo13, gClasses.ML10, gClasses.CenterV)}
              >
                <div className={styles.AttachmentCount}>
                  {!isDataLoading && taskAttachmentsCount}
                </div>
                <div className={gClasses.ML3}>
                  {!isDataLoading &&
                  (
                    <AttachmentsIcon className={styles.AttachmentIcon} />
                  )}
                </div>
              </span>
            ) : null}
    </>
  );
};
const getTaskDescription = (
  t,
  flowId,
  taskDescription,
  task_definition,
  publishedBy,
  taskViewed,
  referenceName,
) => {
  if (flowId) {
    if (taskViewed) {
      return (
        <div
          className={cx(
            gClasses.FOne11GrayV38,
            gClasses.FontWeight400,
            gClasses.Ellipsis,
          )}
        >
          {task_definition}
        </div>
      );
    }
    return (
      <div
        className={cx(
          gClasses.FOne11GrayV39,
          gClasses.FontWeight400,
          gClasses.Ellipsis,
        )}
      >
        {task_definition}
      </div>
    );
  }
  return getPublisher(t, publishedBy, taskViewed, referenceName);
};

const dueBoxStyleSetter = (style, textToDisplay, isDot) => {
  let dueBoxStyle;
  let dueDaysTextStyle;
  let dueDisplay;
  switch (style) {
    case BOX_STYLE.HIGH_PRIORITY_BOX: {
      if (isDot) dueBoxStyle = styles.HighPriorityDueCircle;
      else dueBoxStyle = styles.HighPriorityDueBox;
      dueDaysTextStyle = cx(styles.DueDaysText, gClasses.FOne11RedV7);
      dueDisplay = textToDisplay;
      break;
    }
    case BOX_STYLE.MEDIUM_PRIORITY_BOX: {
      if (isDot) dueBoxStyle = styles.MediumPriorityDueCircle;
      else dueBoxStyle = styles.MediumPriorityDueBox;
      dueDaysTextStyle = cx(styles.DueDaysText, gClasses.FOne11OrangeV2);
      dueDisplay = textToDisplay;
      break;
    }
    case BOX_STYLE.COMPLETED_BOX: {
      if (isDot) dueBoxStyle = styles.LowPriorityDueCircle;
      else dueBoxStyle = styles.LowPriorityDueBox;
      dueDaysTextStyle = cx(styles.DueDaysText, gClasses.FOne11GreenV4);
      dueDisplay = textToDisplay;
      break;
    }
    case BOX_STYLE.OVER_DUE_BOX: {
      if (isDot) dueBoxStyle = styles.OverDueCircle;
      else dueBoxStyle = styles.OverDueBox;
      dueDaysTextStyle = cx(gClasses.FOne11White);
      dueDisplay = textToDisplay;
      break;
    }
    case BOX_STYLE.NO_DUE_BOX: {
      if (isDot) dueBoxStyle = styles.NoDueCircle;
      else dueBoxStyle = styles.NoDueBox;
      dueDaysTextStyle = cx(styles.DueDaysText, gClasses.FOne11GrayV38);
      dueDisplay = textToDisplay;
      break;
    }
    default:
      break;
  }
  return { dueBoxStyle, dueDaysTextStyle, dueDisplay };
};

function TaskCard(props) {
  let skeletonTaskName = null;
  let taskDescription = null;
  let dueDayView = null;
  let dueBoxStyle = null;
  let avatar = null;
  let assigned_on_date = null;
  const {
    data,
    onClick,
    isDataLoading,
    tabIndex,
    selectedId,
    documentUrlDetails,
    searchText,
    accordionIndex,
  } = props;
  console.log('dat', data);
  const {
    flow_id,
    closed_on,
    task_name,
    task_log_id,
    _id,
    notificationCount,
    due_date,
    assignees,
    color_code,
    published_by,
    task_description,
    assigned_on,
    published_on,
    total_tasks,
    completed_tasks,
    cancelled_tasks,
    is_assign_to_individual_assignees,
    is_closed,
    task_definition,
    last_updated_on,
    task_viewed,
    reference_name,
  } = data;
  const { t } = useTranslation();
  let taskAttachmentsCount = 0;
  if (data && data.task_reference_documents) {
    taskAttachmentsCount = data.task_reference_documents.length;
  }
  let { task_id } = data;
  task_id = task_id || task_log_id;
  let isSelected = false;
  const dueDaysViewBuilder = (
    textStyle,
    boxViewStyle,
    isLoading,
    displayDate,
    isCircle,
  ) =>
    isLoading ? (
      <SkeletonTheme
        color={LOADER_STRINGS.COLOR}
        highlightColor={LOADER_STRINGS.HIGHLIGHT_COLOR}
      >
        <Skeleton height={26} width={110} style={{ borderRadius: '12px' }} />
      </SkeletonTheme>
    ) : (
      <div
        className={cx(
          isCircle ? styles.DueCircle : styles.DueBox,
          textStyle,
          gClasses.CenterVH,
          boxViewStyle,
          BS.TEXT_CENTER,
        )}
      >
        {displayDate}
      </div>
    );
  assigned_on_date = (tabIndex !== TASK_TAB_INDEX.DRAFT_TASK) ? (
    <p className={styles.AssignedOnTimeOrDate}>
      {assigned_on
        ? getTimeToDisplayForAssignedOn(assigned_on.pref_tz_datetime)
        : null}
    </p>
  ) : null;
  if (tabIndex === TASK_TAB_INDEX.OPEN) {
    isSelected = task_id === selectedId;
  } else if (tabIndex === TASK_TAB_INDEX.COMPLETED) {
    isSelected = _id === selectedId;
  } else {
    isSelected = _id === selectedId;
  }
  if (isDataLoading) {
    const MAX_LENGTH = 300;
    const MIN_LENGTH = 100;
    const taskNameLength = `${randomNumberInRange(MIN_LENGTH, MAX_LENGTH)}px`;
    skeletonTaskName = <Skeleton width={taskNameLength} />;
    dueBoxStyle = styles.NoDueBox;
    let index;
    let open;
    let completed;
    let assignedToOthers;
    let selfTask;
    let draftTask;
    if (searchText) {
      index = accordionIndex;
      open = TASK_ACCORDION_INDEX.OPEN;
      completed = TASK_ACCORDION_INDEX.COMPLETED;
      assignedToOthers = TASK_ACCORDION_INDEX.ASSIGNED_TO_OTHERS;
      draftTask = TASK_TAB_INDEX.DRAFT_TASK;
    } else {
      index = tabIndex;
      open = TASK_TAB_INDEX.OPEN;
      completed = TASK_TAB_INDEX.COMPLETED;
      assignedToOthers = TASK_TAB_INDEX.ASSIGNED_TO_OTHERS;
      selfTask = TASK_TAB_INDEX.SELF_TASK;
      draftTask = TASK_TAB_INDEX.DRAFT_TASK;
    }
    switch (index) {
      case open:
      case draftTask:
      case selfTask: {
        dueDayView = dueDaysViewBuilder(null, dueBoxStyle, true, null, false);
        break;
      }
      case completed: {
        const completedLength = '100px';
        dueDayView = (
          <div className={cx(gClasses.FOne11GrayV38, gClasses.FontWeight400)}>
            <Skeleton width={completedLength} />
          </div>
        );
        break;
      }
      case assignedToOthers: {
        avatar = <AvatarGroup isDataLoading={isDataLoading} />;
        dueDayView = dueDaysViewBuilder(null, dueBoxStyle, true, null, false);
        break;
      }
      default:
        break;
    }
  } else {
    let dueStyle;
    let index;
    let open;
    let completed;
    let assignedToOthers;
    let selfTask;
    let draftTask;
    if (searchText) {
      index = accordionIndex;
      open = TASK_ACCORDION_INDEX.OPEN;
      completed = TASK_ACCORDION_INDEX.COMPLETED;
      assignedToOthers = TASK_ACCORDION_INDEX.ASSIGNED_TO_OTHERS;
      draftTask = TASK_TAB_INDEX.DRAFT_TASK;
    } else {
      index = tabIndex;
      open = TASK_TAB_INDEX.OPEN;
      completed = TASK_TAB_INDEX.COMPLETED;
      assignedToOthers = TASK_TAB_INDEX.ASSIGNED_TO_OTHERS;
      selfTask = TASK_TAB_INDEX.SELF_TASK;
      draftTask = TASK_TAB_INDEX.DRAFT_TASK;
    }
    switch (index) {
      case completed: {
        dueDayView = isSelected ? null : (
          <div>
            <span
              className={cx(gClasses.FOne11GrayV38, gClasses.FontWeight400)}
            >
              {t(TASK_CONTENT_STRINGS.COMPLETED_ON)}
            </span>
            <span className={gClasses.FOne11BlackV1}>
            {` ${
              closed_on.pref_tz_datetime.split('T')[0]
            }`}
            </span>
          </div>
        );
        taskDescription = getTaskDescription(
          t,
          flow_id,
          task_description,
          task_definition,
          published_by,
          task_viewed,
          reference_name,
        );
        break;
      }
      case selfTask: {
        if (is_closed) {
          dueStyle = dueBoxStyleSetter(
            BOX_STYLE.COMPLETED_BOX,
            t(TASK_CONTENT_STRINGS.COMPLETED),
          );
          dueDayView = dueDaysViewBuilder(
            dueStyle.dueDaysTextStyle,
            dueStyle.dueBoxStyle,
            false,
            dueStyle.dueDisplay,
            false,
          );
        } else if (due_date) {
          const priority = priorityTask(
            due_date.duration_days,
            M_T_STRINGS.TASK_LIST.DEADLINE_HIGH_PRIORITY_VALUE,
          );
          if (priority === 1) {
            dueStyle = dueBoxStyleSetter(
              BOX_STYLE.HIGH_PRIORITY_BOX,
              t(TASK_CONTENT_STRINGS.DUE.LABEL) + dateDuration(due_date.duration_display),
            );
          } else if (!priority) {
            dueStyle = dueBoxStyleSetter(
              BOX_STYLE.MEDIUM_PRIORITY_BOX,
              t(TASK_CONTENT_STRINGS.DUE.LABEL) + dateDuration(due_date.duration_display),
            );
          } else {
            dueStyle = dueBoxStyleSetter(
              BOX_STYLE.OVER_DUE_BOX,
              t(TASK_CONTENT_STRINGS.OVER_DUE),
            );
          }
          dueDayView = dueDaysViewBuilder(
            dueStyle.dueDaysTextStyle,
            dueStyle.dueBoxStyle,
            false,
            dueStyle.dueDisplay,
            false,
          );
        } else {
          dueStyle = dueBoxStyleSetter(
            BOX_STYLE.NO_DUE_BOX,
            t(TASK_CONTENT_STRINGS.NO_DUE),
          );
          dueDayView = dueDaysViewBuilder(
            dueStyle.dueDaysTextStyle,
            dueStyle.dueBoxStyle,
            false,
            dueStyle.dueDisplay,
            false,
          );
        }
        taskDescription = getTaskDescription(
          t,
          true,
          task_description,
          task_definition,
          published_by,
          task_viewed,
          reference_name,
        );
        break;
      }
      case open: {
        if (due_date) {
          const priority = priorityTask(
            due_date.duration_days,
            M_T_STRINGS.TASK_LIST.DEADLINE_HIGH_PRIORITY_VALUE,
          );
          if (priority === 1) {
            dueStyle = dueBoxStyleSetter(
              BOX_STYLE.HIGH_PRIORITY_BOX,
              t(TASK_CONTENT_STRINGS.DUE.LABEL) + dateDuration(due_date.duration_display),
            );
          } else if (!priority) {
            dueStyle = dueBoxStyleSetter(
              BOX_STYLE.MEDIUM_PRIORITY_BOX,
              t(TASK_CONTENT_STRINGS.DUE.LABEL) + dateDuration(due_date.duration_display),
            );
          } else {
            dueStyle = dueBoxStyleSetter(
              BOX_STYLE.OVER_DUE_BOX,
              t(TASK_CONTENT_STRINGS.OVER_DUE),
            );
          }
        } else {
          dueStyle = dueBoxStyleSetter(
            BOX_STYLE.NO_DUE_BOX,
            t(TASK_CONTENT_STRINGS.NO_DUE),
          );
        }
        dueDayView = dueDaysViewBuilder(
          dueStyle.dueDaysTextStyle,
          dueStyle.dueBoxStyle,
          false,
          dueStyle.dueDisplay,
          false,
        );
        taskDescription = getTaskDescription(
          t,
          flow_id,
          task_description,
          task_definition,
          published_by,
          task_viewed,
          reference_name,
        );
        break;
      }
      case draftTask: {
        if (due_date) {
          const priority = priorityTask(due_date.duration_days, M_T_STRINGS.TASK_LIST.DEADLINE_HIGH_PRIORITY_VALUE);
          if (priority === 1) {
            dueStyle = dueBoxStyleSetter(
              BOX_STYLE.HIGH_PRIORITY_BOX,
              t(TASK_CONTENT_STRINGS.DUE.LABEL) + dateDuration(due_date.duration_display),
            );
          } else if (!priority) {
            dueStyle = dueBoxStyleSetter(
              BOX_STYLE.MEDIUM_PRIORITY_BOX,
              t(TASK_CONTENT_STRINGS.DUE.LABEL) + dateDuration(due_date.duration_display),
            );
          } else {
            dueStyle = dueBoxStyleSetter(
              BOX_STYLE.OVER_DUE_BOX,
              t(TASK_CONTENT_STRINGS.OVER_DUE),
            );
          }
        } else {
          dueStyle = dueBoxStyleSetter(
            BOX_STYLE.NO_DUE_BOX,
            t(TASK_CONTENT_STRINGS.NO_DUE),
          );
        }
       // dueDayView = dueDaysViewBuilder(dueStyle.dueDaysTextStyle, dueStyle.dueBoxStyle, false, dueStyle.dueDisplay, false);
          taskDescription = (
          <div>
            <span className={cx(gClasses.FOne11GrayV38, gClasses.FontWeight400, gClasses.Ellipsis)}>
             {t(TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.ASSIGNED_TO)}
            </span>
            {assignees?.users?.map((assignedUser, index) => {
              let user = assignedUser.first_name ? `${assignedUser.first_name} ${assignedUser.last_name}` : assignedUser.username;
              if (index !== 0) user = ` ,${user}`;
              return (
              <span className={cx(gClasses.FOne11BlackV1, gClasses.Ellipsis)}>
                {user}
              </span>
              );
            })}
            {assignees?.teams?.map((assignedTeam, index) => {
              let team = assignedTeam.team_name;
              if ((index === 0 && !jsUtils.isEmpty(assignees.users)) || index !== 0) team = ` ,${team}`;
              return (
              <span className={cx(gClasses.FOne11BlackV1, gClasses.Ellipsis)}>
                {team}
              </span>
              );
            })}
          </div>
        );
       if (last_updated_on) {
        avatar = (
          <div className={cx(gClasses.FOne11GrayV38, gClasses.FontWeight400, gClasses.Ellipsis)}>
            {`${t(TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.LAST_EDITED)} ${getTimeToDisplayForAssignedOn(last_updated_on.pref_tz_datetime)}`}
          </div>
        );
       }
        break;
      }
      case assignedToOthers: {
        if (total_tasks === cancelled_tasks) {
          dueStyle = selectedId
            ? dueBoxStyleSetter(BOX_STYLE.COMPLETED_BOX, null, true)
            : dueBoxStyleSetter(
                BOX_STYLE.COMPLETED_BOX,
                t(TASK_CONTENT_STRINGS.CANCELLED),
              );
        } else if (total_tasks === completed_tasks) {
          dueStyle = selectedId
            ? dueBoxStyleSetter(BOX_STYLE.COMPLETED_BOX, null, true)
            : dueBoxStyleSetter(
                BOX_STYLE.COMPLETED_BOX,
                t(TASK_CONTENT_STRINGS.COMPLETED),
              );
        } else {
          dueStyle = selectedId
            ? dueBoxStyleSetter(BOX_STYLE.OVER_DUE_BOX, null, true)
            : dueBoxStyleSetter(
                BOX_STYLE.OVER_DUE_BOX,
                t(TASK_CONTENT_STRINGS.OPEN_TASK),
              );
        }
        dueDayView = dueDaysViewBuilder(
          dueStyle.dueDaysTextStyle,
          dueStyle.dueBoxStyle,
          false,
          dueStyle.dueDisplay,
          selectedId,
        );
        avatar = (
          <AvatarGroup
            isDataLoading={isDataLoading}
            userImages={getUserImagesForAvatar(
              assignees.users,
              assignees.teams,
              documentUrlDetails,
            )}
          />
        );
        taskDescription = getTaskDescription(
          t,
          true,
          null,
          `${TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.ASSIGNED_ON} ${
            published_on.pref_tz_datetime.split('T')[0]
          }`,
          null,
          task_viewed,
          reference_name,
        );
        break;
      }
      default:
        break;
    }
  }
  const onCardClick = () => {
    if (isDataLoading) return;
    let index;
    let open;
    let completed;
    let assignedToOthers;
    let selfTask;
    let taskDefinition;
    let draftTask;
    if (searchText) {
      index = accordionIndex;
      open = TASK_ACCORDION_INDEX.OPEN;
      completed = TASK_ACCORDION_INDEX.COMPLETED;
      assignedToOthers = TASK_ACCORDION_INDEX.ASSIGNED_TO_OTHERS;
    } else {
      index = tabIndex;
      open = TASK_TAB_INDEX.OPEN;
      completed = TASK_TAB_INDEX.COMPLETED;
      assignedToOthers = TASK_TAB_INDEX.ASSIGNED_TO_OTHERS;
      selfTask = TASK_TAB_INDEX.SELF_TASK;
      draftTask = TASK_TAB_INDEX.DRAFT_TASK;
    }
    if (flow_id) taskDefinition = task_definition;
    else if (
      jsUtils.isObject(published_by) &&
      published_by.email === getCurrentUser(published_by)
    ) {
      taskDefinition = 'Self Task';
    } else taskDefinition = 'Adhoc Task';
    switch (index) {
      case open:
        onClick(task_id, index, {
          assigneesCount: 0,
          ...data,
          task_description: taskDefinition,
        });
        break;
      case selfTask:
        onClick(_id, index, {
          assigneesCount: 0,
          ...data,
          task_description: taskDefinition,
        });
        break;
      case completed:
        onClick(_id, index, {
          assigneesCount: 0,
          ...data,
          task_description: taskDefinition,
        });
        break;
      case assignedToOthers: {
        if (is_assign_to_individual_assignees) {
          onClick(_id, index, {
            assigneesCount: 0,
            ...data,
            avatarGroup: getUserImagesForAvatar(
              assignees.users,
              assignees.teams,
              documentUrlDetails,
            ),
          });
        } else {
          const assigneesCount = total_tasks;
          onClick(_id, index, {
            assigneesCount,
            ...data,
            avatarGroup: getUserImagesForAvatar(
              assignees.users,
              assignees.teams,
              documentUrlDetails,
            ),
          });
        }
        break;
      }
      case draftTask: {
        onClick(_id, index, { ...data });
        break;
      }
      default:
        break;
    }
  };
  const selectedClass = isSelected ? gClasses.SelectedListCard : EMPTY_STRING;
  return (
    <button
      className={cx(
        BS.JC_BETWEEN,
        gClasses.CenterV,
        styles.Container,
        gClasses.CursorPointer,
        gClasses.ClickableElement,
        gClasses.ListCard,
        BS.W100,
        selectedClass,
        BS.P_RELATIVE,
      )}
      onClick={onCardClick}
    >
      <CardPatch isSelected={isSelected} />
      <Thumbnail
        title={task_definition || task_name} // for assigned to others task
        type={color_code ? null : THUMBNAIL_TYPE.PRIMARY}
        notificationCount={notificationCount}
        containerClassName={styles.Thumbnail}
        textClassName={styles.ThumbnailText}
        isLoading={isDataLoading}
        background={color_code}
        isIconThumbnail={(tabIndex === TASK_TAB_INDEX.OPEN || tabIndex === TASK_TAB_INDEX.COMPLETED || tabIndex === TASK_TAB_INDEX.DRAFT_TASK) && !color_code}
        iconClasses={styles.AdhocTaskIcon}
      />
      <div
        className={cx(
          gClasses.CenterVH,
          gClasses.ML15,
          gClasses.FTwo13GrayV3,
          styles.TaskTitle,
          gClasses.Ellipsis,
          gClasses.MR20,
          gClasses.FontWeight500,
          gClasses.Ellipsis,
        )}
      >
        {isDataLoading ? skeletonTaskName : getTaskName(task_name, task_viewed, isDataLoading, taskAttachmentsCount)}
        {taskDescription}
      </div>
      {avatar}
      {assigned_on_date}
      {dueDayView}
    </button>
  );
}

export default TaskCard;

TaskCard.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  isDataLoading: PropTypes.bool,
  tabIndex: PropTypes.number,
  selectedId: PropTypes.string,
  documentUrlDetails: PropTypes.arrayOf(PropTypes.any),
  searchText: PropTypes.string,
  accordionIndex: PropTypes.number,
  is_assign_to_individual_assignees: PropTypes.bool,
  task_definition: PropTypes.string,
};

TaskCard.defaultProps = {
  data: {},
  onClick: null,
  isDataLoading: false,
  tabIndex: 1,
  selectedId: null,
  documentUrlDetails: [],
  searchText: EMPTY_STRING,
  accordionIndex: null,
  is_assign_to_individual_assignees: null,
  task_definition: null,
};
