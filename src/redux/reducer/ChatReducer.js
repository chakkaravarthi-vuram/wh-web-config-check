import { CHAT_ACTIONS } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  is_messages_loading: true,
  message_list: [],
  socket_message_list: [],
  typing_list: [],
  nextPage: true,
  after: EMPTY_STRING,
  room_id: EMPTY_STRING,
  all_users: [],
  page: 0,
  isAuthorized: false,
};

export default function ChatReducer(state = initialState, action) {
  switch (action.type) {
    case CHAT_ACTIONS.STARTED:
      return {
        ...state,
        is_messages_loading: true,
      };
    case CHAT_ACTIONS.SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case CHAT_ACTIONS.EMPTY:
      return {
        ...state,
        is_messages_loading: false,
        nextPage: false,
        after: EMPTY_STRING,
      };
    case CHAT_ACTIONS.FAILURE:
      return {
        ...state,
        // message_list: [],
        is_messages_loading: false,
        nextPage: false,
        after: EMPTY_STRING,
        // error handling
      };
    case CHAT_ACTIONS.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };
    case CHAT_ACTIONS.ROOM_ID:
      return {
        ...state,
        room_id: action.payload,
        isAuthorized: true,
      };
    case CHAT_ACTIONS.SOCKET_MESSAGES:
      return {
        ...state,
        socket_message_list: [...state.socket_message_list, action.payload],
      };
    case CHAT_ACTIONS.TYPING_LIST:
      return {
        ...state,
        typing_list: action.payload,
      };
    case CHAT_ACTIONS.ADD_NEW_USER_METADATA:
      return {
        ...state,
        all_users: [...state.all_users, action.payload],
      };
    case CHAT_ACTIONS.UPDATE_ALL_USERS_METADATA:
      return {
        ...state,
        all_users: [...action.payload],
      };
    case CHAT_ACTIONS.CLEAR:
      return {
        ...initialState,
      };

    default:
      return state;
  }
}
