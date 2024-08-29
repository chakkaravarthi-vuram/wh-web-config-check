import axios from 'axios';
import {
  hasOwn,
} from '../utils/UtilityFunctions';
import { GRAPH_QL } from '../urls/ApiUrls';
import { getChatCredentialWithEncryptQueryVariables, getChatDecryptionResponseData } from '../utils/encryptionUtils';

export const apolloClientChatEngine = async (query, variables) => {
  if (process.env.REACT_APP_ENCRYPTION_ENABLED === '1') {
    const {
      loc: {
        source: { body },
      },
    } = query;
    if (body && variables) {
      const {
        credentials: { session_id, aes_enc_key },
        encryptQuery,
        encryptVariable,
      } = await getChatCredentialWithEncryptQueryVariables(body, variables);
      return new Promise((resolve, reject) => {
        axios({
          url: GRAPH_QL,
          method: 'post',
          data: { query: encryptQuery, variables: encryptVariable },
          withCredentials: true,
          headers: { session_id, aes_enc_key },
        })
          .then((result) => {
            if (hasOwn(result, 'data') && hasOwn(result.data, 'data')) {
              const {
                userchatsByCursor = null,
                chatsByCursor = null,
                chat_search = null,
              } = result.data.data;
              if (userchatsByCursor) {
                const data = {
                  data: {
                    userchatsByCursor: getChatDecryptionResponseData(
                      userchatsByCursor.response_enc_body,
                    ),
                  },
                };
                resolve(data);
              } else if (chatsByCursor) {
                const data = {
                  data: {
                    chatsByCursor: getChatDecryptionResponseData(
                      chatsByCursor.response_enc_body,
                    ),
                  },
                };
                resolve(data);
              } else if (chat_search) {
                const data = {
                  data: {
                    chat_search: getChatDecryptionResponseData(
                      chat_search.response_enc_body,
                    ),
                  },
                };
                resolve(data);
              }
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  } else {
    return new Promise((resolve, reject) => {
      const {
        loc: {
          source: { body },
        },
      } = query;

      axios({
        url: GRAPH_QL,
        method: 'post',
        data: { query: body, variables },
        withCredentials: true,
      }).then((result) => {
        resolve(result.data);
      })
        .catch((error) => {
          reject(error);
        });
    });
  }
  return false;
};

export default apolloClientChatEngine;
