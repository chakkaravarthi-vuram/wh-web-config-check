import { normalizeGetAllNotifications, normalizeGetNotificationsCount, normalizeReadNotification } from 'axios/apiNormalizer/notification.apiNormalizer';
import { axiosGetUtils, axiosPostUtils } from 'axios/AxiosHelper';
import { GET_ALL_NOTIFICATIONS, GET_NOTIFICATION_COUNT, READ_NOTIFICATION } from 'urls/ApiUrls';

export const getAllNotifications = (params) => new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_NOTIFICATIONS, {
      params,
    //   cancelToken: new CancelToken((c) => {
    //     cancelToken(c);
    //   }),
    })
      .then((response) => resolve(normalizeGetAllNotifications(response)))
      .catch((err) => reject(err));
});

export const readNotification = (params) => new Promise((resolve, reject) => {
  axiosPostUtils(READ_NOTIFICATION, {
    ...params,
  //   cancelToken: new CancelToken((c) => {
  //     cancelToken(c);
  //   }),
  })
    .then((response) => resolve(normalizeReadNotification(response)))
    .catch((err) => reject(err));
});

export const getNotificationsCount = (params) => new Promise((resolve, reject) => {
  console.log('getNotificationsCountApiThunk2', params);
  axiosGetUtils(GET_NOTIFICATION_COUNT, {
    params,
  //   cancelToken: new CancelToken((c) => {
  //     cancelToken(c);
  //   }),
  })
    .then((response) => resolve(normalizeGetNotificationsCount(response)))
    .catch((err) => reject(err));
});
