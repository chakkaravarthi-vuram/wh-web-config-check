import React from 'react';
import cx from 'classnames';
import { Text, ETextSize, Chip, EChipSize, BorderRadiusVariant, UserDisplayGroup, EPopperPlacements, TableSortOrder } from '@workhall-pvt-lmt/wh-ui-library';
import i18next from 'i18next';
import BugIcon from 'assets/icons/flow/BugIcon';
import jsUtility, { isEmpty, capitalizeEachFirstLetter, get, compact } from '../../../../utils/jsUtility';
import { BS } from '../../../../utils/UIConstants';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import gClasses from '../../../../scss/Typography.module.scss';
import ClipboardCheckIcon from '../../../../assets/icons/application/ClipboardCheckIcon';
import { constructAvatarOrUserDisplayGroupList, priorityTask } from '../../../../utils/UtilityFunctions';
import DotIcon from '../../../../assets/icons/application/DotIcon';
import CustomUserInfoToolTipNew from '../../../../components/form_components/user_team_tool_tip/custom_userinfo_tooltip/CustomUserInfoToolTipNew';
import styles from './tasks/Tasks.module.scss';
import { TASK_CATEGORY_ADHOC_TASK, TASK_CATEGORY_DATALIST_ADHOC_TASK, TASK_CATEGORY_FLOW_ADHOC_TASK } from '../../../../utils/taskContentUtils';
import { SYSTEM_NAME, TASK_CONTENT_STRINGS } from '../../../landing_page/LandingPage.strings';
import { isSameDay, parse12HoursTimeFromUTC } from '../../../../utils/dateUtils';
import { TASK_LIST_TYPE, PRIORITY, COLOR, GET_TASK_LIST_CONSTANTS, ASSIGNED_TO_OTHERS_TYPE, SORT_BY_COLUMN_KEY, GET_COLUMN_KEY_AND_SORT_KEY_MAPPING } from './TaskList.constants';
import ClipboardReviewTaskIcon from '../../../../assets/icons/ClipboardReviewTaskIcon';
import ClipboardRejectTaskIcon from '../../../../assets/icons/ClipboardRejectTaskIcon';
import { SORT_BY } from '../../../../utils/Constants';
import { store } from '../../../../Store';
import { USER_TYPE } from '../../../landing_page/my_tasks/task_content/task_header/TaskHeader.constants';
import { DATE_TIME_DURATION_DISPLAY, dateDuration } from '../../../data_list/view_data_list/data_list_entry_task/DataListEntryTask.utils';

const { ALL_COLUMN_LIST, LABEL, EMPTY_MESSAGE } = GET_TASK_LIST_CONSTANTS(i18next.t);

export const constructHeader = (allHeader = []) => {
    if (isEmpty(allHeader)) return [];

    const contructedHeader = allHeader.map((eachHeader) => {
        return {
            label: eachHeader.label,
            id: eachHeader.id,
            widthWeight: eachHeader.widthWeight,
            active: eachHeader?.active || false,
            sortBy: eachHeader?.sortBy,
            sortOrder: eachHeader?.sortOrder,
            // headerStyleConfig: { align: eachHeader.align },
            bodyStyleConfig: {
                // align: eachHeader.align,
                isChangeIconColorOnHover: eachHeader.isChangeIconColorOnHover || false,
            },
        };
    });
    return contructedHeader;
};

// Table Cell Data Utils
const isSelfTask = (publishedBy) => {
    const { user_id } = store.getState().RoleReducer;
    return (
      !isEmpty(publishedBy) &&
      (user_id === publishedBy._id)
    );
  };

const formatDate = (date = null) => {
    if (!date) return null;

    const dataTimeFormat = date?.pref_datetime_display || EMPTY_STRING;
    if (dataTimeFormat) {
        if (isSameDay(date?.utc_tz_datetime)) {
            return parse12HoursTimeFromUTC(dataTimeFormat);
        } else {
            const dateWithoutTime = dataTimeFormat.split(',')[0];
            const dateArray = dateWithoutTime.split(' ');
            return `${dateArray[1]} ${dateArray[0]} ${dateArray[2]}`;
        }
    }
    return null;
};

// Table Cell Data
const constructTaskDescription = (task_detail, t = i18next.t) => {
    const {
        task_description,
        task_definition,
        task_category,
        published_by,
        last_updated_by,
        translation_data,
    } = task_detail;

    const pref_locale = localStorage.getItem('application_language');

    switch (task_category) {
       case TASK_CATEGORY_DATALIST_ADHOC_TASK:
       case TASK_CATEGORY_FLOW_ADHOC_TASK:
           return `${capitalizeEachFirstLetter(translation_data?.[pref_locale]?.task_description ||
                              task_description ||
                              translation_data?.[pref_locale]?.task_definition ||
                              task_definition) ||
                              EMPTY_STRING} (${t(TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.ADHOC)})`;
       case TASK_CATEGORY_ADHOC_TASK: {
            const consolidatedPublisher = published_by || last_updated_by;
            if (isSelfTask(consolidatedPublisher)) {
                return `${
                capitalizeEachFirstLetter(translation_data?.[pref_locale]?.task_description || task_description) || EMPTY_STRING
                } (${t(TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.SELF_TASK)})`;
            } else {
                return `${
                capitalizeEachFirstLetter(translation_data?.[pref_locale]?.task_definition || task_description || task_definition) || EMPTY_STRING
                } (${t(TASK_CONTENT_STRINGS.TASK_CARD_DESCRIPTION.ADHOC)})`;
            }
       }
       default:
        return capitalizeEachFirstLetter(translation_data?.[pref_locale]?.task_definition || task_description || task_definition) || EMPTY_STRING;
    }
};

const getAssigneeData = (task_list_type, task_detail) => {
    const { initiated_by, assignees, assigned_to } = task_detail;
    let assignee = null;

    switch (task_list_type) {
        case TASK_LIST_TYPE.OPEN:
            const cloneInitiatedBy = jsUtility.cloneDeep(initiated_by);
            if (cloneInitiatedBy?.first_name === 'System') {
                cloneInitiatedBy.first_name = i18next.t(SYSTEM_NAME);
            }
            assignee = Array.isArray(cloneInitiatedBy) ? { users: cloneInitiatedBy } : { users: [cloneInitiatedBy] };
             break;
        case TASK_LIST_TYPE.ASSIGNED_TO_OTHERS:
        case TASK_LIST_TYPE.DRAFT_TASKS:
            assignee = assignees;
            break;

        case TASK_LIST_TYPE.COMPLETED_TASKS:
            assignee = assigned_to;
            break;
        default: break;
      }
      return assignee;
};

const getDateBasedOnFieldKey = (column_key, task_detail, task_list_type) => {
  switch (column_key) {
   case ALL_COLUMN_LIST.CREATED_ON.key:
   case ALL_COLUMN_LIST.ASSIGNED_ON.key:
        return formatDate(
            (task_list_type === TASK_LIST_TYPE.ASSIGNED_TO_OTHERS) ? task_detail?.published_on : task_detail.assigned_on,
        );
   case ALL_COLUMN_LIST.LAST_EDITED_ON.key:
        return formatDate(task_detail?.last_updated_on) || EMPTY_STRING;
   case ALL_COLUMN_LIST.COMPLETED_ON.key:
        return formatDate(task_detail?.closed_on) || EMPTY_STRING;
   case ALL_COLUMN_LIST.SNOOZE_UNTIL.key:
        return get(task_detail, ['snooze_time', 'pref_datetime_display'], EMPTY_STRING);
   default: break;
  }
  return null;
};

// Table Cell Component

const getTaskName = (task_description, task_detail) => {
    const { translation_data } = task_detail;
    const pref_locale = localStorage.getItem('application_language');
    const taskName = translation_data?.[pref_locale]?.task_name || task_detail?.task_name;
    let taskDesription = EMPTY_STRING;
    if (task_description) {
        taskDesription += ` | ${task_description}`;
    }

    let taskIcon = <ClipboardCheckIcon />;
    if (task_detail?.task_type === 2) {
        taskIcon = <ClipboardReviewTaskIcon />;
    } else if (task_detail?.is_send_back_task) {
        taskIcon = <ClipboardRejectTaskIcon />;
    } else if (task_detail?.is_test_bed_task) {
        taskIcon = <BugIcon
        className={styles.TestBedIconContainer}
        fillColor="#fff"
        />;
    }

    return (
        <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}>
               <div>{taskIcon}</div>
                <Text
                    content={`${taskName}${taskDesription}`}
                    size={ETextSize.MD}
                    className={cx(gClasses.ML8, styles.TaskName, (task_detail.task_viewed ? styles.TaskViewed : styles.TaskNotViewedYet))}
                    title={`${taskName}${taskDesription}`}
                />
        </div>
    );
};

export const getUserDisplayGroup = (assignee, showCreateTask = true, isFromSummary = false) => {
    const getPopperContent = (id, type, onShow, onHide) => {
        if (assignee?.users?.[0]?.user_type === USER_TYPE.SYSTEM) return null;
        const content = (
                <CustomUserInfoToolTipNew
                    id={id}
                    contentClassName={gClasses.WhiteBackground}
                    type={type}
                    onFocus={onShow}
                    onBlur={onHide}
                    onMouseEnter={onShow}
                    onMouseLeave={onHide}
                    showCreateTask={showCreateTask}
                    isStandardUserMode
                />
          );
        return content;
    };
    console.log('dashboard assignee check', assignee);
    return (
        <UserDisplayGroup
            id="UserDisplayGroup"
            userAndTeamList={constructAvatarOrUserDisplayGroupList(assignee)}
            count={1}
            separator=", "
            popperPlacement={EPopperPlacements.BOTTOM_START}
            getPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide)}
            getRemainingPopperContent={(id, type, onShow, onHide) => getPopperContent(id, type, onShow, onHide)}
            className={cx({ [styles.UserList]: !isFromSummary }, gClasses.W100)}
        />
    );
};

const getDueDate = (due_date = null) => {
  const dueUtilObject = {
    displayText: EMPTY_STRING,
    textColor: EMPTY_STRING,
    backgroundColor: EMPTY_STRING,
  };

  if (!isEmpty(due_date)) {
    const priority = priorityTask(due_date.duration_days, 2);
    switch (priority) {
        case PRIORITY.HIGH:
              dueUtilObject.displayText = `${DATE_TIME_DURATION_DISPLAY(i18next.t).DUE} ${dateDuration(due_date.duration_display)}`;
              dueUtilObject.textColor = COLOR.RED_100;
              dueUtilObject.backgroundColor = COLOR.RED_10;
            break;
        case PRIORITY.MEDIUM:
              dueUtilObject.displayText = `${DATE_TIME_DURATION_DISPLAY(i18next.t).DUE} ${dateDuration(due_date.duration_display)}`;
              dueUtilObject.textColor = COLOR.ORANGE_100;
              dueUtilObject.backgroundColor = COLOR.ORANGE_10;
            break;
        case PRIORITY.OVER_DUE:
              dueUtilObject.displayText = 'Overdue';
              dueUtilObject.textColor = COLOR.WHITE;
              dueUtilObject.backgroundColor = COLOR.RED_50;
            break;
        default: break;
    }
  } else {
        dueUtilObject.displayText = LABEL.NO_DUE_DATE;
        dueUtilObject.textColor = COLOR.GRAY_100;
        dueUtilObject.backgroundColor = COLOR.GRAY_10;
  }
  const icon = <DotIcon className={gClasses.MB2} fillColor={dueUtilObject.textColor} />;
  return (
          <Chip
            size={EChipSize.sm}
            textColor={dueUtilObject.textColor}
            backgroundColor={dueUtilObject.backgroundColor}
            text={dueUtilObject.displayText}
            avatar={<div>{icon}</div>}
            borderRadiusType={BorderRadiusVariant.circle}
            className={gClasses.WhiteSpaceNoWrap}
          />
        );
};

const getDateText = (date = null) => (
  <Text
    className={gClasses.WhiteSpaceNoWrap}
    content={date || EMPTY_STRING}
    size={ETextSize.SM}
  />
);

// Return each cell of the table as a component with processed data.
const getEachCell = (column_key = null, task_list_type = null, task_detail = {}, showCreateTask = false, t = i18next.t) => {
    switch (column_key) {
       case ALL_COLUMN_LIST.TASK_NAME.key:
         const task_desc = constructTaskDescription(task_detail, t);
         return getTaskName(task_desc, task_detail);

       case ALL_COLUMN_LIST.CREATED_BY.key:
       case ALL_COLUMN_LIST.ASSIGNED_TO.key:
         const userDisplayGroupData = getAssigneeData(task_list_type, task_detail);
         return getUserDisplayGroup(userDisplayGroupData, showCreateTask);

       case ALL_COLUMN_LIST.CREATED_ON.key:
       case ALL_COLUMN_LIST.ASSIGNED_ON.key:
       case ALL_COLUMN_LIST.LAST_EDITED_ON.key:
       case ALL_COLUMN_LIST.COMPLETED_ON.key:
       case ALL_COLUMN_LIST.SNOOZE_UNTIL.key:
         const date = getDateBasedOnFieldKey(column_key, task_detail, task_list_type);
         return getDateText(date);

       case ALL_COLUMN_LIST.DUE_DATE.key:
          return getDueDate(task_detail?.due_date);

       default: break;
    }
    return null;
};

const getEachRowBasedColumnKeys = (column_keys = [], task_list_type = TASK_LIST_TYPE.SNOOZE_TASKS, task_detail = {}, showCreateTask = false, t = i18next.t) => {
     if (isEmpty(column_keys)) return [];

     return column_keys.map((each_field_key) => getEachCell(each_field_key, task_list_type, task_detail, showCreateTask, t));
};

// Combine all cell component based task page.
export const getEachTaskListBodyRowBasedOnType = (
    task_list_type = TASK_LIST_TYPE.OPEN,
    task_detail = {},
    dynamic_column_keys = [],
    show_by = null,
    showCreateTask = false,
    t = i18next.t,
 ) => {
    let static_column_key_based_on_task_list = [];
    switch (task_list_type) {
        case TASK_LIST_TYPE.OPEN:
            static_column_key_based_on_task_list = [
                ALL_COLUMN_LIST.TASK_NAME.key,
                ALL_COLUMN_LIST.CREATED_BY.key,
                ALL_COLUMN_LIST.ASSIGNED_ON.key,
                ALL_COLUMN_LIST.DUE_DATE.key,
            ];
            break;
        case TASK_LIST_TYPE.ASSIGNED_TO_OTHERS:
            static_column_key_based_on_task_list = [
                ALL_COLUMN_LIST.TASK_NAME.key,
                ALL_COLUMN_LIST.ASSIGNED_TO.key,
                ALL_COLUMN_LIST.ASSIGNED_ON.key,
            ];
            if (show_by === ASSIGNED_TO_OTHERS_TYPE.OPEN) {
                static_column_key_based_on_task_list.push(ALL_COLUMN_LIST.DUE_DATE.key);
            } else if (show_by === ASSIGNED_TO_OTHERS_TYPE.COMPLETED) {
                static_column_key_based_on_task_list.push(ALL_COLUMN_LIST.COMPLETED_ON.key);
            }
            break;
        case TASK_LIST_TYPE.DRAFT_TASKS:
            static_column_key_based_on_task_list = [
                ALL_COLUMN_LIST.TASK_NAME.key,
                ALL_COLUMN_LIST.ASSIGNED_TO.key,
                ALL_COLUMN_LIST.LAST_EDITED_ON.key,
            ];
            break;
        case TASK_LIST_TYPE.COMPLETED_TASKS:
            static_column_key_based_on_task_list = [
                ALL_COLUMN_LIST.TASK_NAME.key,
                ALL_COLUMN_LIST.ASSIGNED_TO.key,
                ALL_COLUMN_LIST.COMPLETED_ON.key,
            ];
            break;
        case TASK_LIST_TYPE.SNOOZE_TASKS:
            static_column_key_based_on_task_list = [
                ALL_COLUMN_LIST.TASK_NAME.key,
                ALL_COLUMN_LIST.SNOOZE_UNTIL.key,
                ALL_COLUMN_LIST.CREATED_ON.key,
                ALL_COLUMN_LIST.DUE_DATE.key,
            ];
            break;
        default:
            break;
    }
    const column_keys = isEmpty(dynamic_column_keys) ? static_column_key_based_on_task_list : dynamic_column_keys;
    return {
        id: task_detail.task_log_id || task_detail._id,
        component: getEachRowBasedColumnKeys(column_keys, task_list_type, task_detail, showCreateTask, t),
    };
};

const getAssignedToKey = (taskListType) => {
  if ([
    TASK_LIST_TYPE.ASSIGNED_TO_OTHERS,
    TASK_LIST_TYPE.DRAFT_TASKS,
  ].includes(taskListType)) {
    return SORT_BY_COLUMN_KEY.ASSIGNEES;
  } else if (taskListType === TASK_LIST_TYPE.COMPLETED_TASKS) {
    return SORT_BY_COLUMN_KEY.ASSIGNED_TO;
  }
  return EMPTY_STRING;
};

const getAssignedonKey = (taskListType) => {
    if (taskListType === TASK_LIST_TYPE.ASSIGNED_TO_OTHERS) {
      return SORT_BY_COLUMN_KEY.PUBLISHED_ON;
    }
    return SORT_BY_COLUMN_KEY.ASSIGNED_ON;
};

export const getEachHeaderBasedOnColumnKey = (id = null, columnKey = null, sortOrder = null, sortBy = null, isActive = false, taskListType = null) => {
  let eachHeader = {};
  const commonValue = {
    id: id,
    ...(sortOrder ? { sortOrder } : {}),
    ...(sortBy ? { sortBy } : {}),
    active: isActive,
  };

  switch (columnKey) {
    case ALL_COLUMN_LIST.TASK_NAME.key: eachHeader = {
        label: ALL_COLUMN_LIST.TASK_NAME.label,
        widthWeight: 4,
        isChangeIconColorOnHover: true,
       };
       break;
    case ALL_COLUMN_LIST.CREATED_BY.key: eachHeader = {
        label: ALL_COLUMN_LIST.CREATED_BY.label,
        sortBy: [SORT_BY_COLUMN_KEY.INITIATED_BY, ALL_COLUMN_LIST.CREATED_BY.key].join('-'),
        widthWeight: 1.5,
       };
       break;
    case ALL_COLUMN_LIST.ASSIGNED_TO.key: eachHeader = {
        label: ALL_COLUMN_LIST.ASSIGNED_TO.label,
        sortBy: [getAssignedToKey(taskListType), ALL_COLUMN_LIST.ASSIGNED_TO.key].join('-'),
        widthWeight: 1.5,
       };
       break;
    case ALL_COLUMN_LIST.CREATED_ON.key: eachHeader = {
        label: ALL_COLUMN_LIST.CREATED_ON.label,
        sortBy: [getAssignedonKey(taskListType), ALL_COLUMN_LIST.CREATED_ON.key].join('-'),
        widthWeight: 1.5,
       };
       break;
    case ALL_COLUMN_LIST.LAST_EDITED_ON.key: eachHeader = {
        label: ALL_COLUMN_LIST.LAST_EDITED_ON.label,
        sortBy: [SORT_BY_COLUMN_KEY.LAST_EDITED_ON, ALL_COLUMN_LIST.LAST_EDITED_ON.key].join('-'),
        widthWeight: 1.5,
       };
       break;
    case ALL_COLUMN_LIST.COMPLETED_ON.key: eachHeader = {
        label: ALL_COLUMN_LIST.COMPLETED_ON.label,
        sortBy: [SORT_BY_COLUMN_KEY.CLOSED_ON, ALL_COLUMN_LIST.COMPLETED_ON.key].join('-'),
        widthWeight: 1.5,
       };
       break;
    case ALL_COLUMN_LIST.ASSIGNED_ON.key: eachHeader = {
        label: ALL_COLUMN_LIST.ASSIGNED_ON.label,
        sortBy: [getAssignedonKey(taskListType), ALL_COLUMN_LIST.ASSIGNED_ON.key].join('-'),
        widthWeight: 1.5,
       };
       break;
    case ALL_COLUMN_LIST.SNOOZE_UNTIL.key: eachHeader = {
        label: ALL_COLUMN_LIST.SNOOZE_UNTIL.label,
        sortBy: [SORT_BY_COLUMN_KEY.SNOOZE_TIME, ALL_COLUMN_LIST.SNOOZE_UNTIL.key].join('-'),
        widthWeight: 1.5,
       };
       break;
    case ALL_COLUMN_LIST.DUE_DATE.key: eachHeader = {
        label: ALL_COLUMN_LIST.DUE_DATE.label,
        widthWeight: 1,
       };
       break;
    default: break;
    }

    if (isEmpty(eachHeader)) return {};
    return {
      ...commonValue,
      ...eachHeader,
    };
  };

export const getColumnKey = (key) => {
    let active_key = key;

    if ((active_key || EMPTY_STRING).includes('-')) {
        active_key = get(active_key.split('-'), [1], EMPTY_STRING);
    }
    return active_key;
};

export const getColumSortByKey = (key) => {
    let active_key = key;

    if ((active_key || EMPTY_STRING).includes('-')) {
        active_key = get(active_key.split('-'), [0], EMPTY_STRING);
    }
    return active_key;
};

// Main function to return header and nody ogf table
export const getTaskListHeaderBasedOnType = (
        task_list_type = TASK_LIST_TYPE.OPEN,
        dynamic_column_keys = [],
        show_by = null,
        active_column_sort_order = null,
        active_column_key = null,
    ) => {
    const tableHeader = [];
    const sort_order = (active_column_sort_order === SORT_BY.ASC) ? TableSortOrder.ASC : TableSortOrder.DESC;

    if (isEmpty(dynamic_column_keys)) {
        switch (task_list_type) {
            case TASK_LIST_TYPE.OPEN:
                tableHeader.push(
                    { id: `${task_list_type}_0`, columnKey: ALL_COLUMN_LIST.TASK_NAME.key },
                    { id: `${task_list_type}_1`, columnKey: ALL_COLUMN_LIST.CREATED_BY.key },
                    { id: `${task_list_type}_2`, columnKey: ALL_COLUMN_LIST.ASSIGNED_ON.key },
                    { id: `${task_list_type}_3`, columnKey: ALL_COLUMN_LIST.DUE_DATE.key },
                );
                break;
            case TASK_LIST_TYPE.ASSIGNED_TO_OTHERS:
                tableHeader.push(
                    { id: `${task_list_type}_0`, columnKey: ALL_COLUMN_LIST.TASK_NAME.key },
                    { id: `${task_list_type}_1`, columnKey: ALL_COLUMN_LIST.ASSIGNED_TO.key },
                    { id: `${task_list_type}_2`, columnKey: ALL_COLUMN_LIST.ASSIGNED_ON.key },
                );
                if (show_by === ASSIGNED_TO_OTHERS_TYPE.OPEN) {
                    tableHeader.push(
                        { id: `${task_list_type}_3`, columnKey: ALL_COLUMN_LIST.DUE_DATE.key },
                    );
                } else if (show_by === ASSIGNED_TO_OTHERS_TYPE.COMPLETED) {
                    tableHeader.push(
                        { id: `${task_list_type}_3`, columnKey: ALL_COLUMN_LIST.COMPLETED_ON.key },
                    );
                }
                break;
            case TASK_LIST_TYPE.DRAFT_TASKS:
                tableHeader.push(
                    { id: `${task_list_type}_0`, columnKey: ALL_COLUMN_LIST.TASK_NAME.key },
                    { id: `${task_list_type}_1`, columnKey: ALL_COLUMN_LIST.ASSIGNED_TO.key },
                    { id: `${task_list_type}_2`, columnKey: ALL_COLUMN_LIST.LAST_EDITED_ON.key },
                );
                break;
            case TASK_LIST_TYPE.COMPLETED_TASKS:
                tableHeader.push(
                    { id: `${task_list_type}_0`, columnKey: ALL_COLUMN_LIST.TASK_NAME.key },
                    { id: `${task_list_type}_1`, columnKey: ALL_COLUMN_LIST.ASSIGNED_TO.key },
                    { id: `${task_list_type}_2`, columnKey: ALL_COLUMN_LIST.COMPLETED_ON.key },
                );
                break;
            case TASK_LIST_TYPE.SNOOZE_TASKS:
                tableHeader.push(
                    { id: `${task_list_type}_0`, columnKey: ALL_COLUMN_LIST.TASK_NAME.key },
                    { id: `${task_list_type}_1`, columnKey: ALL_COLUMN_LIST.SNOOZE_UNTIL.key },
                    { id: `${task_list_type}_2`, columnKey: ALL_COLUMN_LIST.CREATED_ON.key },
                    { id: `${task_list_type}_3`, columnKey: ALL_COLUMN_LIST.DUE_DATE.key },
                );
                break;
            default:
                break;
        }
    } else {
        dynamic_column_keys.forEach((each_column_key, index) => {
            tableHeader.push({ id: `${task_list_type}_${index}`, columnKey: each_column_key });
        });
    }

    const headers = tableHeader.map((eachHeader) => getEachHeaderBasedOnColumnKey(
            eachHeader?.id,
            eachHeader?.columnKey,
            sort_order,
            eachHeader?.columnKey,
            (getColumnKey(active_column_key) === eachHeader?.columnKey),
            task_list_type,
        ));
    return constructHeader(headers);
  };

 export const getTaskListBodyBasedOnType = (task_list_type = TASK_LIST_TYPE.OPEN, taskList = [], dynamic_column_keys = [], show_by = null, showCreateTask = false, t = i18next.t) => {
    if (isEmpty(taskList)) return [];
    const taskListBody = taskList.map((eachTaskDetail) => getEachTaskListBodyRowBasedOnType(task_list_type, eachTaskDetail, dynamic_column_keys, show_by, showCreateTask, t));
    return taskListBody;
    };

export const getActiveTaskListReducer = (state, componentId) => {
    const taskListReducers = jsUtility.get(state, ['TaskListReducer', 'taskListReducers'], []) || [];
    return taskListReducers.find((eachTaskList) => eachTaskList.componentId === componentId) || {};
};

export const getLabelFromOptionListByValue = (options = [], value = null) => {
  if (isEmpty(options) || !value) return EMPTY_STRING;

  const option = options.find((eachOption) => eachOption.value === value);
  if (option) return option?.label;
  return EMPTY_STRING;
};

export const getFilterDataBasedOnTaskListType = (filters = {}, taskType = null) => {
  const { FILTER: { TASK_TYPE, ASSIGNED_ON, DUE_ON } } = GET_TASK_LIST_CONSTANTS(i18next.t);
  let all_filter_data = [];
  switch (taskType) {
    case TASK_LIST_TYPE.OPEN:
    case TASK_LIST_TYPE.ASSIGNED_TO_OTHERS:
        all_filter_data = [TASK_TYPE, ASSIGNED_ON, DUE_ON];
    break;
    case TASK_LIST_TYPE.SNOOZE_TASKS:
        all_filter_data = [ASSIGNED_ON, DUE_ON];
    break;
    default:
        all_filter_data = [ASSIGNED_ON];
    break;
  }

  const filter_data = all_filter_data.map((each_filter_data) => {
     const filter_value = get(filters, [each_filter_data.ID], null);
     if (filter_value !== null) {
        return {
                id: each_filter_data.ID,
                value: filter_value,
                label: getLabelFromOptionListByValue(
                    each_filter_data.USER_OPTIONS || each_filter_data.OPTIONS,
                    filter_value,
                    ),
            };
     }
      return null;
     });
   return compact(filter_data);
};

export const getEmptyMessage = (taskListType = null, searchText = null, showBy = null) => {
  if (!searchText) return LABEL.NO_TASK_FOUND;

  switch (taskListType) {
    case TASK_LIST_TYPE.OPEN: return EMPTY_MESSAGE.MY_TASKS;
    case TASK_LIST_TYPE.ASSIGNED_TO_OTHERS:
       if (showBy === ASSIGNED_TO_OTHERS_TYPE.OPEN) {
          return EMPTY_MESSAGE.ASSIGNED_TO_OTHERS_OPEN;
       } else if (showBy === ASSIGNED_TO_OTHERS_TYPE.COMPLETED) {
          return EMPTY_MESSAGE.ASSIGNED_TO_OTHERS_COMPLETED;
       }
    break;
    case TASK_LIST_TYPE.DRAFT_TASKS: return EMPTY_MESSAGE.DRAFT_TASKS;
    case TASK_LIST_TYPE.COMPLETED_TASKS: return EMPTY_MESSAGE.COMPLETED_TASKS;
    case TASK_LIST_TYPE.SNOOZE_TASKS: return EMPTY_MESSAGE.SNOOZED_TASKS;
    default: return EMPTY_STRING;
  }
  return EMPTY_STRING;
};

export const getSortKeyForActiveColumn = (taskListType, showBy, columnKey) => {
    let mapping_data = {};
    if (taskListType === TASK_LIST_TYPE.ASSIGNED_TO_OTHERS) {
        mapping_data = get(GET_COLUMN_KEY_AND_SORT_KEY_MAPPING, [taskListType, showBy], {});
    } else {
        mapping_data = get(GET_COLUMN_KEY_AND_SORT_KEY_MAPPING, [taskListType], {});
    }
    const all_column_key = Object.keys(mapping_data);
    const index = all_column_key.findIndex((each_key) => each_key === columnKey);
    if (index > -1) {
        const all_sort_key = Object.values(mapping_data);
        const active_sort_key = get(all_sort_key, [index], null);
        return [active_sort_key, columnKey].join('-');
    }
    return null;
};

export const getDateFieldPlacaholder = (taskListType = null, t) => {
  if (taskListType === TASK_LIST_TYPE.COMPLETED_TASKS) return t('list_header.task.completed_on');
  else if (taskListType === TASK_LIST_TYPE.DRAFT_TASKS) return t('list_header.task.last_edited_on');
  return null;
};

export const getRowsPerTaskComponent = (compHeight) => {
    let rowsPerPage = 2;
    switch (compHeight) {
        case 2:
            rowsPerPage = 2;
            break;
        case 3:
            rowsPerPage = 2;
            break;
        case 4:
            rowsPerPage = 4;
            break;
        case 5:
            rowsPerPage = 6;
            break;
        case 6:
            rowsPerPage = 8;
            break;
        case 7:
            rowsPerPage = 11;
            break;
        case 8:
            rowsPerPage = 13;
            break;
        default:
            rowsPerPage = 2;
    }
    return rowsPerPage;
};
