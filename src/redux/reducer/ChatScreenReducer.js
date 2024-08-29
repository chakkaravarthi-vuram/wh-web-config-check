import { cloneDeep } from 'utils/jsUtility';
import { ACTION_CONSTANTS, CHAT_SCREEN_ACTIONS } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  unread_notifications: {
    unread_message: [],
    unread_threads: 0,
  },
  chatThreads: [],
  selectedChatThreads: [],
  isDataLoading: false,
  isSearchDataLoading: false,
  noDataFound: false,
  search_list: [],
  nextPage: false,
  after: EMPTY_STRING,
  selectedThreadId: EMPTY_STRING,
  search_value: EMPTY_STRING,
  isChatModalOpen: false,
  dataCountPerCall: 6,
};

// eslint-disable-next-line default-param-last
export default function ChatScreenReducer(state = initialState, action) {
  switch (action.type) {
    case CHAT_SCREEN_ACTIONS.STARTED:
      return {
        ...state,
        isDataLoading: true,
        isError: false,
        reloadChatThreads: false,
      };
    case CHAT_SCREEN_ACTIONS.SEARCH_STARTED:
      return {
        ...state,
        isSearchDataLoading: true,
      };
    case CHAT_SCREEN_ACTIONS.GLOBAL_NOTICATION_COUNT_SUCCESS:
      return {
        ...state,
        unread_notifications: { ...action.payload },
      };
    case CHAT_SCREEN_ACTIONS.GLOBAL_NOTICATION_COUNT_FAILURE:
      return {
        ...state,
      };
    case CHAT_SCREEN_ACTIONS.CANCEL:
      return {
        ...state,
        isDataLoading: false,
      };
    case CHAT_SCREEN_ACTIONS.GET_THREADS_BY_USER_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case CHAT_SCREEN_ACTIONS.GET_THREADS_BY_USER_EMPTY:
      return {
        ...state,
        isDataLoading: false,
      };
    case CHAT_SCREEN_ACTIONS.GET_THREADS_BY_USER_FAILURE:
      return {
        ...state,
        // noDataFound: true,
        isDataLoading: false,
        isError: true,
        // error handling
      };
    case CHAT_SCREEN_ACTIONS.UPDATE_CHAT_THREADS:
      return {
        ...state,
        chatThreads: [...action.payload],
      };
    case CHAT_SCREEN_ACTIONS.UPDATE_SELECTED_CHAT_THREADS:
      const { selectedChatThreads } = cloneDeep(state);
      if (selectedChatThreads) {
        const index = selectedChatThreads.findIndex((data) => ((data.threadId === action.payload.threadId) || (data.threadEmail === action.payload.threadId)));
        if (index > -1) {
          if (action.payload.isClear) {
            selectedChatThreads.splice(index, 1);
          } else if (action.payload.isReplace) {
            selectedChatThreads.splice(index, 1, action.payload.chatThread);
          } else if (action.payload.isUpdateThreadId) {
            selectedChatThreads[index] = action.payload.chatThread;
          } else {
            const { threadId, threadStatus } = selectedChatThreads[index];
            selectedChatThreads[index] = {
              ...action.payload.chatThread,
              threadId,
              threadStatus: action.payload.threadStatus || threadStatus,
            };
          }
        } else if (action.payload.isNew) {
          selectedChatThreads.push(action.payload.chatThread);
        }
      } else if (action.payload.isNew) {
        selectedChatThreads.push(action.payload.chatThread);
      }
      return {
        ...state,
        selectedChatThreads,
      };
    case CHAT_SCREEN_ACTIONS.UPDATE_SEARCH_LIST:
      return {
        ...state,
        search_list: [...action.payload],
        isDataLoading: false,
        isSearchDataLoading: false,
      };
    case CHAT_SCREEN_ACTIONS.CLEAR_SEARCH_LIST:
      return {
        ...state,
        search_list: [],
        isDataLoading: false,
        isSearchDataLoading: false,
        search_value: '',
      };
    case CHAT_SCREEN_ACTIONS.UPDATE_SEARCH_VALUE:
      return {
        ...state,
        search_value: action.payload,
      };
    case CHAT_SCREEN_ACTIONS.CLEAR:
      return {
        ...initialState,
        unread_notifications: { ...state.unread_notifications },
      };
    case CHAT_SCREEN_ACTIONS.OPEN_MODAL:
      return {
        ...state,
        isChatModalOpen: true,
      };
    case CHAT_SCREEN_ACTIONS.CLOSE_MODAL:
      return {
        ...state,
        isChatModalOpen: false,
      };
    case ACTION_CONSTANTS.USER_LOGOUT_ACTION:
      return initialState;
    default:
      return state;
  }
}
