import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import jsUtils from 'utils/jsUtility';
import { timeDifference } from 'utils/dateUtils';
import moment from 'moment';
import { ENTITY, ENTITY_CONTENT, NOTIFICATION_SECTION, NOTIFICATION_TASK_DYNAMIC_CONTENT, NOTIFICATION_TYPES } from './EachNotification.strings';
import { getUserRoutePath } from '../../../../utils/UtilityFunctions';
import { TASKS } from '../../../../urls/RouteConstants';
import { TASK_LIST_TYPE } from '../../../application/app_components/task_listing/TaskList.constants';

export const notificationPublisher = (notificationData, notificationType) => {
    console.log('EachNotificaitonEachNotificaiton', notificationData);
    let notificationPublisherName = EMPTY_STRING;
    switch (notificationType) {
        case NOTIFICATION_TYPES.TASK.NORMAL_TASK_ASSIGNED:
        case NOTIFICATION_TYPES.TASK.CANCEL_TASK:
        case NOTIFICATION_TYPES.TASK.NUDGE_TASK:
        case NOTIFICATION_TYPES.TASK.REMOVE_DATA_LIST_TASK:
            notificationPublisherName = jsUtils.get(notificationData, ['published_by'], EMPTY_STRING);
        break;
        case NOTIFICATION_TYPES.TASK.FLOW_DATALIST_ADHOC_TASK_ASSIGNED:
            notificationPublisherName = jsUtils.get(notificationData, ['initiated_by'], EMPTY_STRING);
            break;
        case NOTIFICATION_TYPES.TASK.TASK_COMPLETED:
            notificationPublisherName = jsUtils.get(notificationData, ['closed_by'], EMPTY_STRING);
        break;
        case NOTIFICATION_TYPES.TASK.REASSIGNED:
            notificationPublisherName = jsUtils.get(notificationData, ['reassigned_by'], EMPTY_STRING);
        break;
        default: notificationPublisherName = EMPTY_STRING;
        break;
    }
    return notificationPublisherName;
};

export const reassignedAssignees = (notificationData) => {
    let reassignedAssignees = EMPTY_STRING;
    reassignedAssignees = jsUtils.get(notificationData, ['assigned_to'], EMPTY_STRING);
    return reassignedAssignees;
};

const getFlowOrDataListContent = (t, entity) => {
    if (entity === ENTITY.FLOW) return t(ENTITY_CONTENT.FLOW_INSTANCE);
    else if (entity === ENTITY.DATALIST) return t(ENTITY_CONTENT.DATALIST_INSTANCE);
    return EMPTY_STRING;
};

const getFlowOrDatalistEntity = (t, entity) => {
    if (entity === ENTITY.FLOW) return t(ENTITY_CONTENT.FLOW);
    else if (entity === ENTITY.DATALIST) return t(ENTITY_CONTENT.DATALIST);
    return EMPTY_STRING;
};

export const notificationContentForDashboardAdhocTask = (t, notificationData) => (
    ` ${t(ENTITY_CONTENT.FLOW_OR_DATALIST)} ${getFlowOrDatalistEntity(t, jsUtils.get(notificationData, ['entity_type'], ''))} ${getFlowOrDataListContent(t, jsUtils.get(notificationData, ['entity_type'], ''))}`);

    const notificationDynamicContentForTask = (t, notificationData, notificationType) => {
    let notificationDynamicContent = EMPTY_STRING;
    switch (notificationType) {
        case NOTIFICATION_TYPES.TASK.NORMAL_TASK_ASSIGNED:
            notificationDynamicContent = t(NOTIFICATION_TASK_DYNAMIC_CONTENT.ASSIGNED);
        break;
        case NOTIFICATION_TYPES.TASK.FLOW_DATALIST_ADHOC_TASK_ASSIGNED:
            notificationDynamicContent = notificationContentForDashboardAdhocTask(t, notificationData);
        break;
        case NOTIFICATION_TYPES.TASK.TASK_COMPLETED:
            notificationDynamicContent = t(NOTIFICATION_TASK_DYNAMIC_CONTENT.COMPLETED);
        break;
        case NOTIFICATION_TYPES.TASK.CANCEL_TASK:
            notificationDynamicContent = t(NOTIFICATION_TASK_DYNAMIC_CONTENT.CANCELLED);
        break;
        case NOTIFICATION_TYPES.TASK.NUDGE_TASK:
            notificationDynamicContent = t(NOTIFICATION_TASK_DYNAMIC_CONTENT.NUDGED);
        break;
        case NOTIFICATION_TYPES.TASK.PENDING_TASKS:
            notificationDynamicContent = t(NOTIFICATION_TASK_DYNAMIC_CONTENT.PENDING);
        break;
        case NOTIFICATION_TYPES.TASK.SNOOZED_TASK:
            notificationDynamicContent = t(NOTIFICATION_TASK_DYNAMIC_CONTENT.SNOOZED);
        break;
        case NOTIFICATION_TYPES.TASK.CUSTOM_REMINDER:
            notificationDynamicContent = `${t(NOTIFICATION_TASK_DYNAMIC_CONTENT.REMINDER)} ${
            jsUtils.get(notificationData?.date_times, ['scheduled_date_time', 'pref_datetime_display'], '')}`;
        break;
        case NOTIFICATION_TYPES.TASK.CANCEL_INSTANCE_TASK:
            notificationDynamicContent = t(NOTIFICATION_TASK_DYNAMIC_CONTENT.CANCEL_INSTANCE_TASK);
        break;
        case NOTIFICATION_TYPES.TASK.REASSIGNED:
            notificationDynamicContent = t(NOTIFICATION_TASK_DYNAMIC_CONTENT.TASK_REASSIGNED);
        break;
        case NOTIFICATION_TYPES.TASK.REMOVE_DATA_LIST_TASK:
            notificationDynamicContent = t(NOTIFICATION_TASK_DYNAMIC_CONTENT.DATALIST_DELETE);
        break;
        default: break;
    }
    return notificationDynamicContent;
};

export const notificationContent = (t, notificationData, notificationType) => {
    let notificationContent = EMPTY_STRING;
    switch (notificationType) {
        case NOTIFICATION_TYPES.TASK.NORMAL_TASK_ASSIGNED:
        case NOTIFICATION_TYPES.TASK.REASSIGNED:
        case NOTIFICATION_TYPES.TASK.REMOVE_DATA_LIST_TASK:
        case NOTIFICATION_TYPES.TASK.FLOW_DATALIST_ADHOC_TASK_ASSIGNED:
        case NOTIFICATION_TYPES.TASK.TASK_COMPLETED:
        case NOTIFICATION_TYPES.TASK.CANCEL_TASK:
        case NOTIFICATION_TYPES.TASK.NUDGE_TASK:
        case NOTIFICATION_TYPES.TASK.PENDING_TASKS:
        case NOTIFICATION_TYPES.TASK.SNOOZED_TASK:
        case NOTIFICATION_TYPES.TASK.CUSTOM_REMINDER:
        case NOTIFICATION_TYPES.TASK.CANCEL_INSTANCE_TASK:
            notificationContent = notificationDynamicContentForTask(t, notificationData, notificationType);
            break;
        default: break;
    }
    return notificationContent;
};

export const formatNotificationTime = (time, acc_timezone) => (
    jsUtils.isNull(acc_timezone) ? EMPTY_STRING : (timeDifference(
        moment.duration(moment().tz(acc_timezone).diff(time))._data, false, true)));

export const getNotificationTime = (notificationType, time, acc_timezone) => {
    let notificationTime = EMPTY_STRING;
    switch (notificationType) {
        case NOTIFICATION_TYPES.TASK.NORMAL_TASK_ASSIGNED:
        case NOTIFICATION_TYPES.TASK.REASSIGNED:
        case NOTIFICATION_TYPES.TASK.FLOW_DATALIST_ADHOC_TASK_ASSIGNED:
        case NOTIFICATION_TYPES.TASK.CANCEL_TASK:
        case NOTIFICATION_TYPES.TASK.TASK_COMPLETED:
        case NOTIFICATION_TYPES.TASK.NUDGE_TASK:
        case NOTIFICATION_TYPES.TASK.PENDING_TASKS:
        case NOTIFICATION_TYPES.TASK.SNOOZED_TASK:
        case NOTIFICATION_TYPES.TASK.CUSTOM_REMINDER:
        case NOTIFICATION_TYPES.TASK.CANCEL_INSTANCE_TASK:
            notificationTime = formatNotificationTime(
                time,
                acc_timezone,
            );
            break;
        default: break;
    }
    return notificationTime;
};

export const getNotificationURL = (url, notificationType, notificationData) => {
    let notificationURL = jsUtils.has(notificationData, ['protocol_url']) ?
                          jsUtils.get(notificationData, ['protocol_url'], '') :
                          jsUtils.get(notificationData, ['urlWithProtocol'], '');
    switch (notificationType) {
        case NOTIFICATION_TYPES.TASK.NORMAL_TASK_ASSIGNED:
        case NOTIFICATION_TYPES.TASK.FLOW_DATALIST_ADHOC_TASK_ASSIGNED:
        case NOTIFICATION_TYPES.TASK.TASK_COMPLETED:
        case NOTIFICATION_TYPES.TASK.CANCEL_TASK:
        case NOTIFICATION_TYPES.TASK.PENDING_TASKS:
        case NOTIFICATION_TYPES.TASK.NUDGE_TASK:
        case NOTIFICATION_TYPES.TASK.SNOOZED_TASK:
            const urlArray = notificationURL.split('/');
            const taskId = jsUtils.get(notificationData, ['task_id'], EMPTY_STRING) ||
                           jsUtils.get(urlArray, [urlArray.length - 1], EMPTY_STRING);
            notificationURL = getUserRoutePath(`${TASKS}/${TASK_LIST_TYPE.OPEN}/${taskId}`);
        break;
        case NOTIFICATION_TYPES.TASK.CUSTOM_REMINDER:
            const urlArrayData = notificationURL?.split('/');
            urlArrayData.splice(0, 3);
            notificationURL = getUserRoutePath(`/${urlArrayData.join('/')}`);
        break;
        default: break;
    }
    return notificationURL;
};

export const getNotificationSectionName = (days) => {
    if (days === 0) return NOTIFICATION_SECTION.TODAY;
    if (days === 1) return NOTIFICATION_SECTION.YESTERDAY;
    return NOTIFICATION_SECTION.OLDER;
};

export default notificationPublisher;
