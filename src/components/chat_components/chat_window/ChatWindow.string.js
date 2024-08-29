import { gql } from 'apollo-boost';
import { store } from 'Store';
import { RESPONSE_TYPE } from 'utils/Constants';

const GET_MESSAGES = gql`
query getChats(
  $flow_id: String!
  $account_id: String!
  $user_id: String!
  $after: String
  $limit: Int
  $account_domain: String!
) {
  chatsByCursor(
    flow_id: $flow_id
    account_id: $account_id
    user_id: $user_id
    after: $after
    limit: $limit
    account_domain: $account_domain
  ) {
    ... on encryptedResponse {
      response_enc_body
    }
    ... on ChatsList {
      chat_logs {
        chat_id
        user
        first_name
        last_name
        text
        created_date
        user_id
      }
      user_status {
        user
        user_id
        first_name
        last_name
        status
        profile_picture
        is_active
      }
      offset
      after
      nextPage
    }
  }
}
`;
export const GET_THREAD_ID = gql`
query getThreadId(
  $id1: String!
  $id2: String!
  $type: String!
  $account_id: String!
  $account_domain: String!
) {
  userThreadIdByUserId(
    id1: $id1
    id2: $id2
    type: $type
    account_id: $account_id
    account_domain: $account_domain
  ) {
    ... on encryptedResponse {
      response_enc_body
    }
    ... on Chats {
        account_id
        type
        flow_id
        flow_title
        display_title
        flow_status
        updated_date
    } 
  }
}
`;

let { CHAT_STRINGS } =
  store.getState().LocalizationReducer.languageSettings.strings;
const getChatStrings = () => {
  return {
    PLACEHOLDER: CHAT_STRINGS.PLACEHOLDER,
    TODAY: CHAT_STRINGS.TODAY,
    YESTERDAY: CHAT_STRINGS.YESTERDAY,
    CHATS: CHAT_STRINGS.CHATS,
    SEARCH_BAR_PLACEHOLDER: CHAT_STRINGS.SEARCH_BAR_PLACEHOLDER,
  };
};

export const CH_STRINGS = getChatStrings();

store.subscribe(() => {
  CHAT_STRINGS =
    store.getState().LocalizationReducer.languageSettings.strings.CHAT_STRINGS;
});

export const NO_CHAT_HISTORY_RESPONSE_HANDLER = {
  title: 'No Chat History or Users found',
  subTitle: 'There are no users or chat history available to display here.',
  type: RESPONSE_TYPE.NO_CHAT_FOUND,
};

export const NO_MESSAGES_RESPONSE_HANDLER = {
  title: 'Start a conversation',
  subTitle: 'Start a conversation by simply sending a message.',
  type: RESPONSE_TYPE.NO_CHAT_FOUND,
};

export const NOT_AUTHORIZED_RESPONSE_HANDLER = {
  title: 'Not Authorized',
  subTitle: 'You are not authorized to access this chat thread.',
  type: RESPONSE_TYPE.NO_DATA_FOUND,
};

export const CHAT_THREADS_RESPONSE_HANDLER_STRINGS = {
  NO_SEARCH_RESULTS_FOUND: 'No search results found.',
  NO_USERS_FOUND: 'No users found.',
  NO_USERS_FOUND_DESCRIPTION: 'There are no users available to display here.',
};

export const CHAT_SOCKET_ERROR_CODES = {
  NOT_AUTHORIZED: 300,
};

export const CHAT_TYPES = {
  TASK_CHAT: 'TASK_CHAT',
  GLOBAL_CHAT: 'GLOBAL_CHAT',
};

export default GET_MESSAGES;
