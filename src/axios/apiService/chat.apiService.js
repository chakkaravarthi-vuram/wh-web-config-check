import { apolloClientChatEngine } from '../ApolloClientChatEngine';
import { normalizeGetMessagesData } from '../apiNormalizer/chat.apiNormalizer';

export const getMessages = async (query, variables) =>
  new Promise((resolve, reject) => {
    apolloClientChatEngine(query, variables)
      .then((result) => {
        resolve(normalizeGetMessagesData(result));
      })
      .catch((error) => {
        reject(error);
      });
  });

export default getMessages;
