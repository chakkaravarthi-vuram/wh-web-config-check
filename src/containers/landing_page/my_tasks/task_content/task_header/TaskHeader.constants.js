import React from 'react';
import AnnotationIcon from '../../../../../assets/icons/task/AnnotationIcon';
import ClockRewindIcon from '../../../../../assets/icons/task/ClockRewindIcon';
import DuplicateIcon from '../../../../../assets/icons/task/DuplicateIcon';
import EditAssigneeIcon from '../../../../../assets/icons/task/EditAssigneeIcon';
import ReassignIcon from '../../../../../assets/icons/task/ReassignIcon';
import SaveCloseIcon from '../../../../../assets/icons/task/SaveCloseIcon';
import SnoozedTaskMenuIcon from '../../../../../assets/icons/task/SnoozedTaskMenuIcon';
import TASK_HEADER from './TaskHeader.strings';

export const TASK_TYPE_BUTTON_ACTION_ID = {
    SAVE_AND_CLOSE: 1,
    POST_NOTE: 2,
    DUPLICATE: 3,
    ACTION_HISTORY: 4,
    SNOOZE: 5,
    REASSIGN: 6,
    EDIT_ASSIGNEE: 7,
};

export const TASK_TYPE_ACTION_BUTTONS = [
    {
        name: TASK_HEADER.SAVE_CLOSE_BTN,
        icon: <SaveCloseIcon />,
        sortNumber: 1,
        id: TASK_TYPE_BUTTON_ACTION_ID.SAVE_AND_CLOSE,
    },
    {
        name: TASK_HEADER.POST_NOTE_BTN,
        icon: <AnnotationIcon />,
        sortNumber: 2,
        id: TASK_TYPE_BUTTON_ACTION_ID.POST_NOTE,
    },
    {
        name: TASK_HEADER.DUPLICATE_BTN,
        icon: <DuplicateIcon width={16} height={16} />,
        sortNumber: 3,
        id: TASK_TYPE_BUTTON_ACTION_ID.DUPLICATE,
    },
    {
        name: TASK_HEADER.ACTION_HISTORY_BTN,
        icon: <ClockRewindIcon width={16} height={16} />,
        sortNumber: 4,
        id: TASK_TYPE_BUTTON_ACTION_ID.ACTION_HISTORY,
    },
    {
        name: TASK_HEADER.SNOOZE_BTN,
        icon: <SnoozedTaskMenuIcon width={16} height={16} />,
        sortNumber: 5,
        id: TASK_TYPE_BUTTON_ACTION_ID.SNOOZE,
    },
    {
        name: TASK_HEADER.REASSIGN_BTN,
        icon: <ReassignIcon width={16} height={16} />,
        sortNumber: 6,
        id: TASK_TYPE_BUTTON_ACTION_ID.REASSIGN,
    },
    {
        name: TASK_HEADER.EDIT_ASSIGNEE_BTN,
        icon: <EditAssigneeIcon width={16} height={16} />,
        sortNumber: 7,
        id: TASK_TYPE_BUTTON_ACTION_ID.EDIT_ASSIGNEE,
    },

];

export const ACTION_BUTTONS_CONSTANTS = {
    MAX_COUNT: 2,
    SNOOZED_MAX_COUNT: 2,
    SNOOZED_MAX_COUNT_WITH_DUE_DATE: 1,
    ASSIGNED_TO_OTHERS_MAX_COUNT: 1,
    MOBILE_MAX_COUNT: 0,
};

export const USER_TYPE = {
    SYSTEM: 0,
};

export const TASK_TYPE = {
    REVIEW: 2,
};
