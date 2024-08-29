import { gql } from 'apollo-boost';

const GET_THREADS_BY_USER = gql`
  query getThreads(
    $user_id: String!
    $account_id: String!
    $after: String
    $limit: Int
    $account_domain: String!
  ) {
    userchatsByCursor(
      user_id: $user_id
      account_id: $account_id
      after: $after
      limit: $limit
      account_domain: $account_domain
    ) {
      ... on encryptedResponse {
        response_enc_body
      }
      ... on ChatSummaryList {
        chat_logs {
          account_id
          type
          flow_id
          flow_title
          display_title
          flow_status
          user_id
          updated_date
        }
        user_status {
          user_id
          user
          status
          first_name
          last_name
          profile_picture
          is_active
        }
        unread_notifications {
          unread_message {
            _id
            count
          }
          unread_threads
        }
        after
        nextPage
      }
    }
  }
`;

export default GET_THREADS_BY_USER;
