import React from 'react';
import i18next from 'i18next';
import { TASK_CATEGORY_ADHOC_TASK, TASK_CATEGORY_DATALIST_ADHOC_TASK, TASK_CATEGORY_FLOW_ADHOC_TASK, TASK_CATEGORY_FLOW_TASK, isAssignedToOthersTaskCompleted, isAssigneedToOtherTab, isCompletedTab, isOpenTab, isSnoozedTab } from '../../../../../utils/taskContentUtils';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { getTaskBasicDetails, showReplicateTask } from '../TaskContent.utils';
import FlowStackIcon from '../../../../../assets/icons/apps/FlowStackIcon';
import { getCurrentUser } from '../../../../../utils/userUtils';
import jsUtils, { cloneDeep, isEmpty } from '../../../../../utils/jsUtility';
import DatalistIconNew from '../../../../../assets/icons/DatalistIconNew';
import { priorityTask } from '../../../../../utils/UtilityFunctions';
import { COLOR, PRIORITY } from '../../../../application/app_components/task_listing/TaskList.constants';
import { M_T_STRINGS, TASK_CONTENT_STRINGS, TASK_STATUS_TYPES } from '../../../LandingPage.strings';
import { ACTION_BUTTONS_CONSTANTS, TASK_TYPE_ACTION_BUTTONS, TASK_TYPE_BUTTON_ACTION_ID } from './TaskHeader.constants';
import TASK_HEADER from './TaskHeader.strings';
import ClipboardIcon from '../../../../../assets/icons/task/ClipboardIcon';
import styles from './TaskHeader.module.scss';
import { getFormattedDateAndTimeLabel } from '../task_history/TaskHistoryCard/TaskHistoryCard.utils';

export const getDueDateByPriority = (due_date, dueDateObj) => {
    const dueUtilObject = {
        displayText: EMPTY_STRING,
        textColor: EMPTY_STRING,
        backgroundColor: EMPTY_STRING,
    };

    if (!isEmpty(due_date)) {
        const priority = priorityTask(dueDateObj.duration_days, M_T_STRINGS.TASK_LIST.DEADLINE_HIGH_PRIORITY_VALUE);
        switch (priority) {
            case PRIORITY.HIGH:
            case PRIORITY.OVER_DUE:
                dueUtilObject.textColor = COLOR.RED_100;
                dueUtilObject.backgroundColor = COLOR.RED_10;
                break;
            case PRIORITY.MEDIUM:
                dueUtilObject.textColor = COLOR.ORANGE_100;
                dueUtilObject.backgroundColor = COLOR.ORANGE_10;
                break;
            default: break;
        }
    }
    dueUtilObject.displayText = due_date;
    return dueUtilObject;
};

const isSelfTask = (active_task_details) => {
    if (active_task_details?.metadata_info?.published_by) {
        const published_by = active_task_details?.metadata_info?.published_by;
        if (
            published_by.email === getCurrentUser(published_by)
        ) {
            return true;
        }
    }
    return false;
};

export const getDueDateString = (activeTaskDetail, taskMetadata, t) => {
    let date_string = '';
    let date = '';
    let dueDateObj = {};
    if (jsUtils.nullCheckObject(taskMetadata, ['due_date'])) {
        date = `${taskMetadata.due_date.pref_datetime_display}`;
        date_string = date;
        dueDateObj = taskMetadata?.due_date;
    } else if (
        activeTaskDetail?.task_log_info?.due_date
    ) {
        date = activeTaskDetail.task_log_info.due_date;
        date_string =
            (date &&
                `${date.pref_datetime_display}`);
        dueDateObj = activeTaskDetail?.task_log_info?.due_date;
    }
    date_string = date_string && `${t(TASK_HEADER.DUE_LBL)}: ${getFormattedDateAndTimeLabel(date_string, t)}`;
    return [date_string, dueDateObj];
};

const getButtonDataById = (id) => TASK_TYPE_ACTION_BUTTONS.find((item) => item.id === id);

export const getButtonComponentByTaskCategory = (category, selectedCardTab, activeTaskDetail, userProfileData, taskMetadata, isMobile, isShowAppTasks, isBasicUser, t) => {
    const isAcceptedTask = jsUtils.get(activeTaskDetail, [TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO, 'accepted_by', '_id']) === userProfileData.id;
    const isCancelledTask = jsUtils.get(activeTaskDetail, [TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO, TASK_CONTENT_STRINGS.TASK_INFO.TASK_STATUS]) === TASK_STATUS_TYPES.CANCELLED;
    const dueDate = getDueDateString(activeTaskDetail, taskMetadata, t)?.[0];
    const actionTotalButtons = [];
    let actionButtonCount = ACTION_BUTTONS_CONSTANTS.MAX_COUNT;

    if (isOpenTab(selectedCardTab)) {
        const isAcceptOrRejectTask = jsUtils.get(activeTaskDetail, [TASK_CONTENT_STRINGS.TASK_INFO.TASKS_LOG_INFO, 'show_accept_reject']);
        if (category === TASK_CATEGORY_ADHOC_TASK && !isAcceptOrRejectTask && !isCancelledTask) {
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.SAVE_AND_CLOSE));
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.POST_NOTE));
            if ((isSelfTask(activeTaskDetail) || showReplicateTask(activeTaskDetail, selectedCardTab)) && isShowAppTasks) {
                actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.DUPLICATE));
            }
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.ACTION_HISTORY));
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.SNOOZE));

            if (activeTaskDetail?.task_log_info?.show_reassign && isAcceptedTask) {
                actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.REASSIGN));
            }
        } else if ((category === TASK_CATEGORY_FLOW_ADHOC_TASK || category === TASK_CATEGORY_DATALIST_ADHOC_TASK)
                    && !isAcceptOrRejectTask && !isCancelledTask) {
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.SAVE_AND_CLOSE));
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.POST_NOTE));
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.ACTION_HISTORY));
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.SNOOZE));

            if (activeTaskDetail?.task_log_info?.show_reassign && isAcceptedTask) {
                actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.REASSIGN));
            }
            if ((isSelfTask(activeTaskDetail) || showReplicateTask(activeTaskDetail, selectedCardTab)) && isShowAppTasks) {
                actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.DUPLICATE));
            }
        } else if (category === TASK_CATEGORY_FLOW_TASK && isAcceptedTask && !isCancelledTask) {
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.SAVE_AND_CLOSE));
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.POST_NOTE));
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.ACTION_HISTORY));
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.SNOOZE));
            if (activeTaskDetail?.task_log_info?.show_reassign) {
                actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.REASSIGN));
            }
        } else if (isAcceptOrRejectTask || isCancelledTask) {
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.ACTION_HISTORY));
        }
    } else if (isAssigneedToOtherTab(selectedCardTab)) {
        if (!taskMetadata?.is_assign_to_individual_assignees && !isAssignedToOthersTaskCompleted()) {
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.EDIT_ASSIGNEE));
        }
        if (!isBasicUser || (category !== TASK_CATEGORY_ADHOC_TASK || (category === TASK_CATEGORY_ADHOC_TASK && isShowAppTasks))) {
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.DUPLICATE));
        }
        actionButtonCount = ACTION_BUTTONS_CONSTANTS.ASSIGNED_TO_OTHERS_MAX_COUNT;
    } else if (isCompletedTab(selectedCardTab)) {
        actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.ACTION_HISTORY));
    } else if (isSnoozedTab(selectedCardTab)) {
        actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.SAVE_AND_CLOSE));
        actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.POST_NOTE));
        actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.ACTION_HISTORY));
        if (isSelfTask(activeTaskDetail) && category !== TASK_CATEGORY_FLOW_TASK && isShowAppTasks) {
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.DUPLICATE));
        }
                if (activeTaskDetail?.task_log_info?.show_reassign && isAcceptedTask) {
            actionTotalButtons.push(getButtonDataById(TASK_TYPE_BUTTON_ACTION_ID.REASSIGN));
        }
        actionButtonCount = isEmpty(dueDate) ?
        ACTION_BUTTONS_CONSTANTS.SNOOZED_MAX_COUNT :
        ACTION_BUTTONS_CONSTANTS.SNOOZED_MAX_COUNT_WITH_DUE_DATE;
    }

    // Sort the buttons by priority

    // Extract the first two buttons
    let actionButtons = cloneDeep(actionTotalButtons);
    let kebabButtons = 0;

    if (!isMobile) {
        if (actionButtons.length > actionButtonCount) {
            actionButtons = cloneDeep(actionTotalButtons).slice(0, actionButtonCount);
            // Extract the remaining buttons for the kebab menu
            kebabButtons = cloneDeep(actionTotalButtons).slice(actionButtonCount);
        }
    } else {
        console.log('********is mobile');
        actionButtons = 0;
        kebabButtons = cloneDeep(actionTotalButtons);
    }
    return { actionButtons, kebabButtons };
};

export const getTaskSummary = (taskMetadata, active_task_details, isTaskDataLoading, selectedCardTab) => {
    const pref_locale = localStorage.getItem('application_language');
    const isFlowInitiationTask = jsUtils.get(active_task_details, ['metadata_info', 'is_initiation_task'], false);
    const taskCategory =
        active_task_details && (
        jsUtils.get(active_task_details, ['task_log_info', 'task_category'])
        || jsUtils.get(taskMetadata, ['task_category']));

    const reference_name =
        jsUtils.get(active_task_details, ['metadata_info', 'flow_name']) ||
        jsUtils.get(active_task_details, ['metadata_info', 'data_list_name']) ||
        jsUtils.get(taskMetadata, ['flow_name'], EMPTY_STRING) ||
        jsUtils.get(taskMetadata, ['data_list_name'], EMPTY_STRING);

    const { initiatorName, publisherName } = getTaskBasicDetails(taskMetadata, selectedCardTab, active_task_details, isTaskDataLoading);
    let taskSummary = {};
    let taskSummaryIcon = null;
    let user = null;
    let createdDate = null;
    let taskCategoryName;
    let createdByLbl = i18next.t(TASK_HEADER.CREATED_BY_LBL);
    let onLbl = i18next.t(TASK_HEADER.ON_LABEL);
    const createdOnLbl = i18next.t(TASK_HEADER.CREATED_ON_LBL);
    let showUserName = true;

    // created by and created on
    user = publisherName?.[0];
    if (
        jsUtils.nullCheckObject(taskMetadata, ['published_on']) &&
        isAssigneedToOtherTab(selectedCardTab)
    ) {
        createdDate = taskMetadata.published_on.pref_datetime_display;
        createdByLbl = createdOnLbl;
        onLbl = EMPTY_STRING;
        showUserName = false;
    } else if (active_task_details?.task_log_info?.initiated_on
    ) {
        createdDate = active_task_details?.task_log_info?.initiated_on?.pref_datetime_display;
    }

    console.log('isFlowInitiationTask', isFlowInitiationTask, taskCategory);

    if (taskCategory === TASK_CATEGORY_FLOW_TASK) {
        taskSummaryIcon = <FlowStackIcon width={14} height={14} />;
        user = initiatorName[0] || initiatorName;
        taskCategoryName = jsUtils.get(active_task_details, [
            'task_log_info',
            'translation_data',
            pref_locale,
            'task_definition',
        ], EMPTY_STRING) || jsUtils.get(active_task_details, [
            'metadata_info',
            'flow_name',
        ]);
        if (isFlowInitiationTask) createdByLbl = i18next.t(TASK_HEADER.INIATED_BY_LBL);
    } else if (taskCategory === TASK_CATEGORY_DATALIST_ADHOC_TASK) {
        taskSummaryIcon = <DatalistIconNew width={14} height={14} />;
        taskCategoryName = `${reference_name} (${i18next.t(TASK_HEADER.ADHOC_TASK_LBL)})`;
    } else if (taskCategory === TASK_CATEGORY_FLOW_ADHOC_TASK) {
        taskSummaryIcon = <FlowStackIcon width={14} height={14} />;
        taskCategoryName = `${reference_name} (${i18next.t(TASK_HEADER.ADHOC_TASK_LBL)})`;
    } else if (taskCategory === TASK_CATEGORY_ADHOC_TASK) {
        taskSummaryIcon = <ClipboardIcon className={styles.Icon} />;
        if (isSelfTask(active_task_details)) {
            taskCategoryName = i18next.t(TASK_HEADER.SELF_TASK_LBL);
            createdByLbl = createdOnLbl;
            onLbl = EMPTY_STRING;
            showUserName = false;
        } else {
            taskCategoryName = i18next.t(TASK_HEADER.ADHOC_TASK_LBL);
        }
    }

    taskSummary = {
        taskCategoryName: taskCategoryName,
        taskSummaryIcon: taskSummaryIcon,
        createdByLbl: createdByLbl,
        showUserName: showUserName,
        user: user,
        onLbl: onLbl,
        createdDate: createdDate,
    };
    return taskSummary;
};

export const getSnoozedDate = (activeTaskDetail, t) => {
    const snoozedDate = activeTaskDetail?.task_log_info?.snooze_time?.pref_datetime_display || EMPTY_STRING;
    return getFormattedDateAndTimeLabel(snoozedDate, t);
};

export const getCompletedDate = (activeTaskDetail, t) => {
    const completedDate = activeTaskDetail?.active_task_details?.performed_on?.pref_datetime_display || EMPTY_STRING;
    return getFormattedDateAndTimeLabel(completedDate, t);
};
