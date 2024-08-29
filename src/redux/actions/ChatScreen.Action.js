/* eslint-disable import/no-cycle */
/* eslint-disable import/no-named-as-default */
import getMessages from 'axios/apiService/chat.apiService';
import deletedUser from 'assets/img/deleted_user.png';
import { CHAT_SCREEN_ACTIONS } from './ActionConstants';
import {
  getNotificationCount,
  getThreadsByUser,
  getAllUsers,
  getAllUsersWithQueryString,
} from '../../axios/apiService/chatScreen.apiService';

import { store } from '../../Store';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import {
  isEmpty,
  // safeTrim,
  find,
  uniqBy,
  cloneDeep,
} from '../../utils/jsUtility';
import { hasOwn } from '../../utils/UtilityFunctions';

export const getNotificationCountSuccess = (data) => {
  return {
    type: CHAT_SCREEN_ACTIONS.GLOBAL_NOTICATION_COUNT_SUCCESS,
    payload: data,
  };
};

const getNotificationCountFailure = (error) => {
  return {
    type: CHAT_SCREEN_ACTIONS.GLOBAL_NOTICATION_COUNT_FAILURE,
    payload: error,
  };
};

export const getThreadsByUserSuccess = (data) => {
  return {
    type: CHAT_SCREEN_ACTIONS.GET_THREADS_BY_USER_SUCCESS,
    payload: data,
  };
};
const getThreadsByUserEmpty = () => {
  return {
    type: CHAT_SCREEN_ACTIONS.GET_THREADS_BY_USER_EMPTY,
  };
};
const getThreadsByUserFailure = (error) => {
  return {
    type: CHAT_SCREEN_ACTIONS.GET_THREADS_BY_USER_FAILURE,
    payload: error,
  };
};
export const updateChatThreadsThunk = (data) => {
  return {
    type: CHAT_SCREEN_ACTIONS.UPDATE_CHAT_THREADS,
    payload: data,
  };
};

export const updateSelectedChatThreadsThunk = (data) => {
  return {
    type: CHAT_SCREEN_ACTIONS.UPDATE_SELECTED_CHAT_THREADS,
    payload: data,
  };
};

const chatApiStarted = () => {
  return {
    type: CHAT_SCREEN_ACTIONS.STARTED,
  };
};

export const chatSearchApiStarted = () => {
  return {
    type: CHAT_SCREEN_ACTIONS.SEARCH_STARTED,
  };
};
export const updateSearchListThunk = (data) => {
  console.log('searchListFiltereddata', data);
  return {
    type: CHAT_SCREEN_ACTIONS.UPDATE_SEARCH_LIST,
    payload: data,
  };
};

export const clearSearchListThunk = (data) => {
  return {
    type: CHAT_SCREEN_ACTIONS.CLEAR_SEARCH_LIST,
    payload: data,
  };
};

export const openChatModalAction = () => {
  return {
    type: CHAT_SCREEN_ACTIONS.OPEN_MODAL,
  };
};

export const closeChatModalAction = () => {
  return {
    type: CHAT_SCREEN_ACTIONS.CLOSE_MODAL,
  };
};

export const chatScreenCancelApi = () => {
  return {
    type: CHAT_SCREEN_ACTIONS.CANCEL,
  };
};

export const updateSearchValueThunk = (data) => async (dispatch) => {
  await dispatch({ type: CHAT_SCREEN_ACTIONS.UPDATE_SEARCH_VALUE, payload: data });
};
export const chatScreenClearState = () => (dispatch) => {
  dispatch({
    type: CHAT_SCREEN_ACTIONS.CLEAR,
  });
  return Promise.resolve();
};

export const getNotiticationCountThunk = (query, variables) => (dispatch) => {
  getNotificationCount(query, variables)
    .then((result) => {
      if (!isEmpty(result.userchatsByCursor.unread_notifications)) {
        dispatch(getNotificationCountSuccess(result.userchatsByCursor.unread_notifications));
      } else {
        dispatch(getNotificationCountFailure());
      }
    })
    .catch((error) => {
      console.log('Chat Graphql Get messages - Error', error);
      dispatch(getNotificationCountFailure(error));
    });
};

const updateProfileDetails = (result, chatThreads, state, dispatch, reload) => {
  const chatThreadsDistinct = uniqBy(chatThreads, 'threadId');
  console.log('chatThreadsDistinct', chatThreads, chatThreadsDistinct);

  const chatThreadsDistinctAndFiltered = !isEmpty(chatThreadsDistinct)
    ? chatThreadsDistinct.filter((element) => element !== undefined)
    : [];
  const initialChatThreads = reload ? [] : state.chatThreads;
  dispatch(
    getThreadsByUserSuccess({
      chatThreads: initialChatThreads
        ? uniqBy([...initialChatThreads, ...chatThreadsDistinctAndFiltered], 'threadId')
        : chatThreadsDistinctAndFiltered,
      isDataLoading: false,
      after: result.userchatsByCursor.after,
      nextPage: result.userchatsByCursor.nextPage,
    }),
  );
  console.log('userchatsByCursor &&&&', result.userchatsByCursor.after, result.userchatsByCursor.nextPage);
};
const getProfilePics = async (userIdArray, chatThreads, callback) => {
  let queryString = '';
  userIdArray.map((id) => {
    queryString += `user_ids=${id}&`;
    return null;
  });
  queryString += 'is_last_signin=0';
  queryString = `?${queryString}`;
  await getAllUsersWithQueryString(queryString)
    .then((response) => {
      console.log('getProfilePics chatThreads', response, chatThreads);
      response.pagination_data.map((iterator) => {
        const profilePic = find(response.document_url_details, {
          document_id: iterator.profile_pic,
        });
        if (profilePic) {
          const index = chatThreads.findIndex((data) => data.userId === iterator._id);
          if (index > -1) {
            const threadData = chatThreads[index];
            threadData.threadPic = profilePic.signedurl;
            threadData.firstName = iterator.first_name;
            threadData.lastName = iterator.last_name;
            chatThreads[index] = { ...chatThreads[index], ...threadData };
          }
        }
        return null;
      });
      if (callback) {
        console.log('CahtThreads Callback', chatThreads);
        callback(chatThreads);
      } else {
        return chatThreads;
      }
      return null;
    })
    .catch(() => {
      if (callback) {
        callback(chatThreads);
      } else {
        return chatThreads;
      }
      return null;
    });
};
export const getThreadsByUserThunk = (query, variables, reload) => (dispatch) => {
  dispatch(chatApiStarted());
  getThreadsByUser(query, variables)
    .then((result) => {
      if (!isEmpty(result.userchatsByCursor.chat_logs)) {
        const state = store.getState().ChatScreenReducer;
        const userIdArray = [];
        const chatThreads = result.userchatsByCursor.chat_logs.map((eachThread) => {
          if (eachThread.flow_id) {
            const notification = find(result.userchatsByCursor.unread_notifications.unread_message, {
              _id: eachThread.flow_id,
            });
            if (eachThread.type === 'p2p') {
              const opponentUserIndex = eachThread.user_id.indexOf(variables.user_id) ? 0 : 1;
              const userStatus = find(result.userchatsByCursor.user_status, (data) =>
                data.user_id === eachThread.user_id[opponentUserIndex]);
              let threadName = '';
              let threadPic = null;
              let firstName = '';
              let lastName = '';
              if (userStatus.is_active) {
                if (userStatus.first_name) {
                  firstName = userStatus.first_name;
                  lastName = userStatus.last_name;
                  threadName = userStatus.last_name ? `${userStatus.first_name} ${userStatus.last_name}` : userStatus.first_name;
                } else {
                  threadName = userStatus.user;
                  firstName = userStatus.user;
                }
                if (userStatus.profile_picture) {
                  threadPic = userStatus.profile_picture;
                } else {
                  userIdArray.push(userStatus.user_id);
                }
              } else {
                threadName = 'Deleted User';
                firstName = 'Deleted User';
                threadPic = deletedUser;
              }

              return {
                firstName: firstName,
                lastName: lastName,
                threadName: threadName,
                threadId: eachThread.flow_id,
                threadType: eachThread.type,
                threadPic: threadPic,
                threadStatus: userStatus ? userStatus.status : false,
                threadEmail: userStatus.user,
                id: eachThread.user_id[opponentUserIndex],
                notificationCount: notification ? notification.count : 0,
                userId: eachThread.user_id[opponentUserIndex],
                isActive: userStatus.is_active,
              };
            }
          }
          return null;
        });
        if (!isEmpty(userIdArray)) {
          const userIdArrayFiltered = uniqBy(userIdArray);
          getProfilePics(userIdArrayFiltered, chatThreads, (newChatThreads) => {
            updateProfileDetails(result, newChatThreads, state, dispatch, reload);
          });
        } else {
          updateProfileDetails(result, chatThreads, state, dispatch, reload);
        }
      } else {
        dispatch(getThreadsByUserEmpty());
      }
    })
    .catch((error) => {
      console.log('Chat Apollo Graphql Get Threads - Error', error);
      if (error && hasOwn(error, 'graphQLErrors') && error.graphQLErrors.length > 0 && error.graphQLErrors[0].message === "Cannot read property 'map' of undefined") {
        dispatch(getThreadsByUserEmpty());
      } else {
        dispatch(getThreadsByUserFailure());
      }
    });
};

export const searchChatThreadsThunk = (getAllUsersParams, userId) => (dispatch) => {
  // if (safeTrim(getAllUsersParams.search)) {
    getAllUsers(getAllUsersParams)
      .then((response) => {
        const searchList = [];
        response.pagination_data.map((iterator) => {
          if (iterator.is_active && (iterator._id !== userId)) {
            const profilePic = find(response.document_url_details, {
              document_id: iterator.profile_pic,
            });
            searchList.push({
              threadType: 'p2p',
              userId: iterator._id,
              threadId: iterator.email,
              id: iterator.email,
              threadEmail: iterator.email,
              firstName: iterator.first_name,
              lastName: iterator.last_name,
              threadName:
                iterator.first_name && iterator.first_name !== 'undefined'
                  ? `${iterator.first_name} ${iterator.last_name}`
                  : iterator.email,
              threadPic: profilePic ? profilePic.signedurl : null,
              notificationCount: 0,
              isActive: iterator.is_active,
              threadStatus: false,
            });
          }
          return null;
        });
        const searchListFiltered = !isEmpty(searchList) ? searchList.filter((element) => element !== undefined) : [];
        console.log(searchListFiltered, 'searchListFiltered');
        dispatch(updateSearchListThunk(searchListFiltered));
      })
      .catch(() => {
         dispatch(updateSearchListThunk([]));
});
  // } else {
  //   dispatch(updateSearchListThunk([]));
  // }
};

export const getMessagesDataThunk = (query, variables, selectedThread) => (dispatch) => {
  let activeChatThread = cloneDeep(selectedThread);
  activeChatThread = {
    ...activeChatThread,
    isLoadingMessages: true,
    nextPage: false,
    after: EMPTY_STRING,
    isError: false,
  };
  dispatch(
    updateSelectedChatThreadsThunk({
      threadId: activeChatThread.threadId, chatThread: activeChatThread, isUpdate: true,
    }),
  );
  getMessages(query, variables)
    .then((result) => {
      console.log('getMessagesDataThunk', result);
      const { user_status } = result.chatsByCursor;
      const page = activeChatThread.page ? activeChatThread.page : 0;
      if (!isEmpty(result.chatsByCursor.chat_logs)) {
        const { message_list } = activeChatThread;

        // no need to reverse messages as the chat container has flex direaction as column reverse
        const data = result.chatsByCursor.chat_logs; // .slice(0).reverse();
        const formattedChatList = data.map((msg) => {
          if (msg.user_id) {
            const msgIndex = user_status.findIndex((user) => (user.user_id === msg.user_id));
            if (msgIndex > -1) {
              msg.first_name = user_status[msgIndex].first_name;
              msg.last_name = user_status[msgIndex].last_name;
              msg.user = user_status[msgIndex].user;
            }
          }
          return msg;
        });
        const messages = message_list ? [...message_list, ...formattedChatList] : formattedChatList;
        activeChatThread = {
          ...activeChatThread,
          message_list: messages,
          isLoadingMessages: false,
          nextPage: !isEmpty(result.chatsByCursor.after),
          page: page + 1,
          after: result.chatsByCursor.after,
        };
        console.log('result.chatsByCursor.nextPage', result.chatsByCursor.nextPage, page);
        dispatch(
          updateSelectedChatThreadsThunk({
            threadId: activeChatThread.threadId, chatThread: activeChatThread, isUpdate: true,
          }),
        );
      } else {
        activeChatThread = {
          ...activeChatThread,
          isLoadingMessages: false,
          nextPage: false,
          after: EMPTY_STRING,
        };
        dispatch(
          updateSelectedChatThreadsThunk({
            threadId: activeChatThread.threadId, chatThread: activeChatThread, isUpdate: true,
          }),
        );
      }
    })
    .catch((error) => {
      console.log('Chat Graphql Get messages - Error', error);
      activeChatThread = {
        ...activeChatThread,
        isLoadingMessages: false,
        nextPage: false,
        after: EMPTY_STRING,
        isError: true,
      };
      dispatch(
        updateSelectedChatThreadsThunk({
          threadId: activeChatThread.threadId, chatThread: activeChatThread, isUpdate: true,
        }),
      );
    });
};

export default getNotiticationCountThunk;
