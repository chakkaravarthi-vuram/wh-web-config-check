import axios from 'axios';
import { apolloClientChatEngine } from '../ApolloClientChatEngine';
import { axiosGetUtils } from '../AxiosHelper';
import { GET_ALL_USERS } from '../../urls/ApiUrls';
import {
  normalizeGetNotificationCount,
  normalizeGetThreadsByUser,
  normalizeAllUsers,
  normalizeGetThreadsBySearch,
  normalizeGetThreadId,
} from '../apiNormalizer/chatScreen.apiNormalizer';
import { chatScreenCancelApi } from '../../redux/actions/ChatScreen.Action';

const { CancelToken } = axios;
let cancelTokenForGetAllUserApi;

export const getNotificationCount = (query, variables) =>
  new Promise((resolve, reject) => {
    apolloClientChatEngine(query, variables)
      .then((result) => {
        resolve(normalizeGetNotificationCount(result));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getThreadsByUser = (query, variables) =>
  new Promise((resolve, reject) => {
    apolloClientChatEngine(query, variables)
      .then((result) => {
        resolve(normalizeGetThreadsByUser(result));
      })
      .catch((error) => {
        reject(error);
      });
  });

export const getAllUsers = (params) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_USERS, {
      params,
      cancelToken: new CancelToken((c) => {
        cancelTokenForGetAllUserApi = c;
      }),
    })
      .then((response) => {
        resolve(normalizeAllUsers(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
export const getAllUsersWithQueryString = (queryString) =>
  new Promise((resolve, reject) => {
    axiosGetUtils(GET_ALL_USERS + queryString, {
      cancelToken: new CancelToken((c) => {
        cancelTokenForGetAllUserApi = c;
      }),
    })
      .then((response) => {
        resolve(normalizeAllUsers(response));
      })
      .catch((error) => {
        reject(error);
      });
  });
export const getThreadsBySearch = (query, variables) =>
  new Promise((resolve, reject) => {
    apolloClientChatEngine(query, variables)
      .then((result) => {
        resolve(normalizeGetThreadsBySearch(result));
      })
      .catch((error) => {
        reject(error);
      });
  });
export const getThreadId = (query, variables) =>
  new Promise((resolve, reject) => {
    apolloClientChatEngine(query, variables)
      .then((result) => {
        resolve(normalizeGetThreadId(result));
      })
      .catch((error) => {
        reject(error);
      });
  });
export const cancelGetAllUserApi =
  (cancelFunction = chatScreenCancelApi) =>
    (dispatch) => {
      if (cancelTokenForGetAllUserApi) {
        cancelTokenForGetAllUserApi();
        dispatch(cancelFunction());
      }
    };

export default getNotificationCount;
