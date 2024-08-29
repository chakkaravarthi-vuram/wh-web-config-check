import { NOTIFICATIONS } from 'redux/actions/ActionConstants';
import jsUtils from 'utils/jsUtility';
import { createAction, createReducer } from '@reduxjs/toolkit';
import moment from 'moment';

export const toggleNotificationsModalVisibility = createAction(
NOTIFICATIONS.TOGGLE_NOTIFICATIONS_MODAL_VISIBILITY,
);

export const notificationsDataChangeAction = createAction(
    NOTIFICATIONS.NOTIFIACTIONS_DATA_CHANGE,
    (response) => {
        return {
        payload: response,
        };
    },
);

export const getAllNotificationsStartedAction = createAction(
    NOTIFICATIONS.GET_ALL_NOTIFICATIONS_STARTED,
);

export const getAllNotificationsSuccessAction = createAction(
    NOTIFICATIONS.GET_ALL_NOTIFICATIONS_SUCCESS,
    (response) => {
      return {
        payload: response,
      };
    },
);

export const getAllNotificationsFailureAction = createAction(
NOTIFICATIONS.GET_ALL_NOTIFICATIONS_FAILURE,
(response) => {
    return {
    payload: response,
    };
},
);

export const readNotificationStartedAction = createAction(
    NOTIFICATIONS.READ_NOTIFICATION_STARTED,
);

export const readNotificationSuccessAction = createAction(
    NOTIFICATIONS.READ_NOTIFICATION_SUCCESS,
);

export const readNotificationFailureAction = createAction(
NOTIFICATIONS.READ_NOTIFICATION_FAILURE,
(response) => {
    return {
    payload: response,
    };
},
);

export const loadMoreNotificationsStartedAction = createAction(
    NOTIFICATIONS.LOAD_MORE_NOTIFICATIONS_STARTED,
);

export const clearNotificationsState = createAction(
    NOTIFICATIONS.CLEAR_NOTIFICAIONS_STATE,
);

const initState = {
    isNotificationsModalOpen: false,
    isNotificationsListLoading: false,
    isLoadMoreNotifications: false,
    isReadNotificationPostLoading: false,
    notificationsList: [],
    hasMore: true,
    total_count: 0,
    page: 1,
    size: 10,
    common_server_error: null,
    server_error: {},
};

const notificationReducer = createReducer(initState, (builder) => {
    builder
    .addCase(toggleNotificationsModalVisibility, (state) => {
        state.isNotificationsModalOpen = !state.isNotificationsModalOpen;
    })
    .addCase(notificationsDataChangeAction, (state, action) => {
        return {
            ...state,
            ...action.payload,
          };
    })
    .addCase(getAllNotificationsStartedAction, (state) => {
        state.isNotificationsListLoading = true;
    })
    .addCase(getAllNotificationsSuccessAction, (state, action) => {
        state.isNotificationsListLoading = false;
        state.isLoadMoreNotifications = false;
        state.page = jsUtils.get(action, ['payload', 'pagination_details', 0, 'page'], state.page);
        state.size = jsUtils.get(action, ['payload', 'pagination_details', 0, 'size'], state.size);
        state.total_count = jsUtils.get(action, ['payload', 'pagination_details', 0, 'total_count'], state.total_count);
        if (jsUtils.get(action, ['payload', 'pagination_details', 0, 'page'], 1) > 1) {
            state.notificationsList = [...state.notificationsList, ...jsUtils.get(action, ['payload', 'pagination_data'], [])];
        } else {
        state.notificationsList = jsUtils.get(action, ['payload', 'pagination_data'], []);
        }
    })
    .addCase(getAllNotificationsFailureAction, (state, action) => {
        state.isNotificationsListLoading = false;
        state.isLoadMoreNotifications = false;
        state.common_server_error = jsUtils.get(action, ['payload', 'common_server_error'], null);
        state.server_error = jsUtils.get(action, ['payload', 'server_error'], {});
    })
    .addCase(loadMoreNotificationsStartedAction, (state) => {
        state.isLoadMoreNotifications = false;
    })
    .addCase(readNotificationStartedAction, (state) => {
        state.isReadNotificationPostLoading = true;
    })
    .addCase(readNotificationSuccessAction, (state) => {
        state.isReadNotificationPostLoading = false;
    })
    .addCase(readNotificationFailureAction, (state, action) => {
        state.isReadNotificationPostLoading = false;
        state.common_server_error = jsUtils.get(action, ['payload', 'common_server_error'], null);
        state.server_error = jsUtils.get(action, ['payload', 'server_error'], {});
    })
    .addCase(clearNotificationsState, (state) => {
        return {
            ...initState,
            total_count: state.total_count,
          };
        });
});

export default notificationReducer;

export const getModifiedNotificationsList = (state) => {
    const modifiedNotificationsList = [];
    let notiicationLabelsAssigned = false;
    jsUtils.get(state, ['NotificationReducer', 'notificationsList'], []).forEach((notification, index) => {
        const time = jsUtils.get(notification, ['alert_on'], '');
        if (!jsUtils.isEmpty(time)) {
        const notificationTime = new Date(time).toLocaleString('en-US', { timeZone: state.LanguageAndCalendarAdminReducer.acc_timezone });
        if (index === 0) {
            modifiedNotificationsList.push(
            { ...notification,
             days_before: moment().diff(notificationTime, 'days'),
            });
        } else {
            const prevTime = jsUtils.get(jsUtils.get(state, ['NotificationReducer', 'notificationsList'], [])[index - 1],
                            ['alert_on'],
                            '');
            const prevNotificationTime = new Date(prevTime).toLocaleString('en-US', { timeZone: state.LanguageAndCalendarAdminReducer.acc_timezone });
            if (moment().diff(notificationTime, 'days') !== moment().diff(prevNotificationTime, 'days') && !notiicationLabelsAssigned) {
                if (moment().diff(notificationTime, 'days') > 1) notiicationLabelsAssigned = true;
                modifiedNotificationsList.push(
                    { ...notification,
                     days_before: moment().diff(notificationTime, 'days'),
                    });
            } else modifiedNotificationsList.push(notification);
        }
    } else modifiedNotificationsList.push(notification);
    });
    return modifiedNotificationsList;
  };
