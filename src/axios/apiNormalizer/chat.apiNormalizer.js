import { reportError } from '../../utils/UtilityFunctions';
import jsUtils from '../../utils/jsUtility';

const validateGetMessagesData = (content) => {
  let requiredProps = ['chatsByCursor'];
  let invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validateGetMessagesData failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (invalidData) return null;
  // checking result object's fields
  requiredProps = ['chat_logs', 'user_status', 'after', 'nextPage'];
  invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content.chatsByCursor, prop)) {
      reportError(`validateGetMessagesData failed inside chatsByCursor: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (!jsUtils.isEmpty(content.chatsByCursor.chat_logs)) {
    if (invalidData) return null;
    // checking each chat log's fields
    requiredProps = ['chat_id', 'user', 'first_name', 'last_name', 'text', 'created_date'];
    invalidData = requiredProps.some((prop) => {
      if (!Object.prototype.hasOwnProperty.call(content.chatsByCursor.chat_logs[0], prop)) {
        reportError(
          `validateGetMessagesData failed inside chatsByCursor->chat_logs: ${prop} missing`,
        );
        return true;
      }
      return false;
    });
  }

  if (invalidData) return null;
  requiredProps = ['user']; // status,profile_picture
  invalidData = requiredProps.some((prop) => {
    if (!jsUtils.isEmpty(content.chatsByCursor.user_status) && !Object.prototype.hasOwnProperty.call(content.chatsByCursor.user_status[0], prop)) {
      reportError(
        `validateGetMessagesData failed inside chatsByCursor->user_status: ${prop} missing`,
      );
      return true;
    }
    return false;
  });

  if (invalidData) return null;
  return content;
};

export const normalizeGetMessagesData = (untrustedContent) => {
  const content = validateGetMessagesData(untrustedContent.data);
  if (!content) {
    reportError('validateGetMessagesData failed');
    return null;
  }
  return content;
};

export default normalizeGetMessagesData;
