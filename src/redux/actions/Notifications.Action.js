import { getAllNotifications, getNotificationsCount, readNotification } from 'axios/apiService/notification.apiService';
import {
  getAllNotificationsFailureAction,
  getAllNotificationsStartedAction,
  getAllNotificationsSuccessAction,
  loadMoreNotificationsStartedAction,
  notificationsDataChangeAction,
  readNotificationFailureAction,
  readNotificationStartedAction,
  readNotificationSuccessAction,
} from 'redux/reducer/NotificationsReducer';
import { generateGetServerErrorMessage } from 'server_validations/ServerValidation';
import { store } from 'Store';
import { generateApiErrorsAndHandleCatchBlock, setPointerEvent, updatePostLoader } from 'utils/UtilityFunctions';
import jsUtils from 'utils/jsUtility';

export const getAllNotficationsApiThunk = (params) => (dispatch) => {
    if (jsUtils.get(params, ['page'], 1) > 1) dispatch(loadMoreNotificationsStartedAction());
    else dispatch(getAllNotificationsStartedAction());
    setPointerEvent(true);
    updatePostLoader(true);
    getAllNotifications(params).then((response) => {
    setPointerEvent(false);
    updatePostLoader(false);
    if (response) {
        dispatch(getAllNotificationsSuccessAction(response));
     } else {
        const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(getAllNotificationsFailureAction(errors));
     }
    }).catch((error) => {
    setPointerEvent(false);
    updatePostLoader(false);
    const { server_error } = store.getState().NotificationReducer;
    const errorData = {
      error,
      server_error,
    };
    const apiFailureAction = {
      dispatch,
      action: getAllNotificationsFailureAction,
    };
    generateApiErrorsAndHandleCatchBlock(
      errorData,
      apiFailureAction,
      false,
      true,
    );
    });
};

export const getNotificationsCountApiThunk = (params) => (dispatch) => {
  getNotificationsCount(params).then((response) => {
  if (response) {
      dispatch(notificationsDataChangeAction({ total_count: response.data }));
   } else {
      const err = {
          response: {
            status: 500,
          },
        };
        const errors = generateGetServerErrorMessage(err);
        dispatch(getAllNotificationsFailureAction(errors));
   }
  }).catch((error) => {
  const { server_error } = store.getState().NotificationReducer;
  const errorData = {
    error,
    server_error,
  };
  const apiFailureAction = {
    dispatch,
    action: getAllNotificationsFailureAction,
  };
  generateApiErrorsAndHandleCatchBlock(
    errorData,
    apiFailureAction,
    false,
    true,
  );
  });
};

export const readNotificationApiThunk = (params) => (dispatch) => {
    dispatch(readNotificationStartedAction());
    setPointerEvent(true);
    updatePostLoader(true);
    readNotification(params).then((response) => {
    setPointerEvent(false);
    updatePostLoader(false);
    if (response) {
        dispatch(readNotificationSuccessAction(response));
        dispatch(getNotificationsCountApiThunk({ is_read: 0 }));
     } else {
        const err = {
            response: {
              status: 500,
            },
          };
          const errors = generateGetServerErrorMessage(err);
          dispatch(readNotificationFailureAction(errors));
     }
    }).catch((error) => {
    setPointerEvent(false);
    updatePostLoader(false);
    const { server_error } = store.getState().NotificationReducer;
    const errorData = {
      error,
      server_error,
    };
    const apiFailureAction = {
      dispatch,
      action: readNotificationFailureAction,
    };
    generateApiErrorsAndHandleCatchBlock(
      errorData,
      apiFailureAction,
      false,
      true,
    );
    });
};
