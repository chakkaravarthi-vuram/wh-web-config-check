import { ACTION_TYPE, USER_ACTIONS } from '../../../../../../utils/constants/action.constant';
import { translateFunction, isEmpty } from '../../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import ACTION_HISTORY_ACTION from './TaskHistory.strings';
import styles from './TaskHistoryCard.module.scss';
import gClasses from '../../../../../../scss/Typography.module.scss';

export const COLOR = {
    GREEN_100: '#027A48',
    GREEN_10: '#ECFDF3',
    BLUE_100: '#1A4AC8',
    BLUE_10: '#EBF4FF',
    RED_100: '#B54708',
    RED_10: '#FFFAEB',
    ORANGE_100: '#B42318',
    ORANGE_10: '#FEF3F2',
    GRAY_10: '#F2F4F7',
    GRAY_100: '#484D57',
    WHITE: '#FFFFFF',
    BLACK_V100: '#344054',
  };

export const getActionClass = (status) => {
    let statusClass = {
      textColor: EMPTY_STRING,
      backgroundColor: EMPTY_STRING,
    };
    switch (status) {
        case ACTION_TYPE.FORWARD:
        statusClass = {
            textColor: COLOR.BLUE_100,
            backgroundColor: COLOR.BLUE_10,
        };
        break;
        case ACTION_TYPE.SEND_BACK:
        case ACTION_TYPE.ASSIGN_REVIEW:
        case ACTION_TYPE.REASSIGN_FOR_ANOTHER_REVIEW:
        case ACTION_TYPE.FAILURE:
        statusClass = {
            textColor: COLOR.RED_100,
            backgroundColor: COLOR.RED_10,
        };
        break;
        case ACTION_TYPE.END_FLOW:
        case ACTION_TYPE.COMPLETED:
        case ACTION_TYPE.SUCCESS:
            statusClass = {
                textColor: COLOR.GREEN_100,
                backgroundColor: COLOR.GREEN_10,
            };
            break;
        case ACTION_TYPE.CANCEL:
            statusClass = {
                textColor: COLOR.ORANGE_100,
                backgroundColor: COLOR.ORANGE_10,
            };
        break;
        case USER_ACTIONS.POST_UPDATE:
        case USER_ACTIONS.POST_NOTES:
        case ACTION_TYPE.REVIEW_COMPLETED:
        case ACTION_TYPE.SCHEDULED:
        case ACTION_TYPE.TRIGGERED:
            statusClass = {
                textColor: COLOR.GRAY_100,
                backgroundColor: COLOR.GRAY_10,
            };
            break;
        case USER_ACTIONS.SNOOZED:
            statusClass = {
                textColor: COLOR.BLACK_V100,
                backgroundColor: COLOR.WHITE,
                className: styles.SnoozedCommentBorder,
                textClassName: gClasses.FTwo13BlackV20,
            };
            break;
      default: break;
    }
    return statusClass;
  };

export const getActionLabel = (actionHistoryData, isTriggerTask, t) => {
if (actionHistoryData?.action_history_type === USER_ACTIONS.INITAITED) {
    if (actionHistoryData.flow_uuid) {
    if (isTriggerTask) {
        return t(ACTION_HISTORY_ACTION.TRIGGERED);
    } else {
        return t(ACTION_HISTORY_ACTION.INITIATED);
    }
    } else return t(ACTION_HISTORY_ACTION.CREATED);
}
if (actionHistoryData.action_history_type === USER_ACTIONS.COMPLETED) {
    if (actionHistoryData.flow_uuid) return t(ACTION_HISTORY_ACTION.FLOW_FLOW_FOR);
}
if (actionHistoryData.action_history_type === USER_ACTIONS.SNOOZED) {
    return t(ACTION_HISTORY_ACTION.SNOOZED);
}
if (actionHistoryData.action_history_type === USER_ACTIONS.POST_UPDATE ||
    actionHistoryData?.action_history_type === USER_ACTIONS.POST_NOTES) {
    return t(ACTION_HISTORY_ACTION.TASK_UPDATE);
} else if (actionHistoryData.action_history_type === USER_ACTIONS.ASSIGN_BACK) {
    return t(ACTION_HISTORY_ACTION.ASSIGN_BACK);
} else if (actionHistoryData.action_history_type === USER_ACTIONS.REJECT) {
    return `${t(ACTION_HISTORY_ACTION.REJECTED)} `;
} else if (actionHistoryData.action_history_type === USER_ACTIONS.REASSIGNED) {
    return `${t(ACTION_HISTORY_ACTION.REASSIGNED)} `;
} else if (actionHistoryData.action_history_type === USER_ACTIONS.CANCELLED) {
    return `${t(ACTION_HISTORY_ACTION.CANCELED)} `;
} else if (actionHistoryData.action_history_type === USER_ACTIONS.INTEGRATION) {
    if (actionHistoryData?.is_interagetion_success) return `${t(ACTION_HISTORY_ACTION.COMPLETED_INTEGRATION_TASK)} `;
    else return `${t(ACTION_HISTORY_ACTION.FAILED_INTEGRATION_TASK)} `;
} else if (actionHistoryData.action_history_type === USER_ACTIONS.ML_INTEGRATION) {
    if (actionHistoryData?.is_ml_integration_success) return `${t(ACTION_HISTORY_ACTION.COMPLETED_ML_INTEGRATION_TASK)} `;
    else return `${t(ACTION_HISTORY_ACTION.FAILED_ML_INTEGRATION_TASK)} `;
} else {
    return `${t(ACTION_HISTORY_ACTION.COMPLETED)} `;
}
};

export const getActionDescription = (isTriggerTask, t, actionHistoryData) => {
    if ((actionHistoryData.action_history_type === USER_ACTIONS.INITAITED &&
    !isTriggerTask &&
        actionHistoryData.flow_uuid) || actionHistoryData.action_history_type === USER_ACTIONS.SUBMIT_TASK) {
        return t(ACTION_HISTORY_ACTION.WITH_TASK_ACTION);
    }
    if (actionHistoryData.action_history_type === USER_ACTIONS.COMPLETED &&
        actionHistoryData.flow_uuid) {
        return t(ACTION_HISTORY_ACTION.COMPLETED_LABEL);
    }
    if (actionHistoryData.action_history_type === USER_ACTIONS.REASSIGNED &&
        !actionHistoryData?.reassigned_to) {
        return t(ACTION_HISTORY_ACTION.WITH_TASK_ACTION);
    }
    if (actionHistoryData.action_history_type === USER_ACTIONS.SNOOZED) {
        return t(ACTION_HISTORY_ACTION.UNTIL);
    }
    if (actionHistoryData.action_history_type === USER_ACTIONS.ASSIGN_BACK) {
        return t(ACTION_HISTORY_ACTION.TO_THE_ORIGINAL_ASSIGNEES);
    }
    if (actionHistoryData.action_history_type === USER_ACTIONS.INTEGRATION) {
        if (actionHistoryData?.is_interagetion_success) return `${t(ACTION_HISTORY_ACTION.SUCCESSFULLY_COMPLETED_INTEGRATION)} `;
        else return EMPTY_STRING;
    }
    if (actionHistoryData.action_history_type === USER_ACTIONS.ML_INTEGRATION) {
        if (actionHistoryData?.is_ml_integration_success) return `${t(ACTION_HISTORY_ACTION.SUCCESSFULLY_COMPLETED_ML_INTEGRATION)} `;
        else return EMPTY_STRING;
    }
console.log('latest activity11');
return EMPTY_STRING;
};

export const getFormattedDateAndTimeLabel = (dateTime = EMPTY_STRING, t = translateFunction) => (
    `${dateTime.substring(
        0,
        11,
      )}${t(ACTION_HISTORY_ACTION.AT)}${dateTime?.substring(13, 21)}`
);

export const reassignedAssignees = (reassigned_to) => {
    const userNames = [];
    reassigned_to?.users?.forEach((user) => {
        const firstName = user?.first_name || EMPTY_STRING;
        const lastName = user?.last_name || EMPTY_STRING;
        if (!isEmpty(firstName) || !isEmpty(lastName)) userNames.push(`${firstName} ${lastName}`);
    });
    reassigned_to?.teams?.forEach((team) => {
        userNames.push(team.team_name);
    });
    return userNames;
};
