import { reportError } from '../../utils/UtilityFunctions';
import jsUtils from '../../utils/jsUtility';

const validateGetNotificationCount = (content) => {
  let requiredProps = ['userchatsByCursor'];
  let invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate GetNoticationCount failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (invalidData) return null;
  // checking result object's fields
  requiredProps = ['unread_notifications'];
  invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content.userchatsByCursor, prop)) {
      reportError(`validate GetNoticationCount failed inside userchatsByCursor: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (invalidData) return null;
  // checking each chat log's fields
  requiredProps = ['unread_message', 'unread_threads'];
  invalidData = requiredProps.some((prop) => {
    if (
      !Object.prototype.hasOwnProperty.call(content.userchatsByCursor.unread_notifications, prop)
    ) {
      reportError(
        `validate GetNoticationCount failed inside userchatsByCursor->unread_notifications: ${prop} missing`,
      );
      return true;
    }
    return false;
  });

  if (invalidData) return null;
  return content;
};

const validateGetThreadsByUser = (content) => {
  let requiredProps = ['userchatsByCursor'];
  let invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate GetThreadsByUser failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (invalidData) return null;
  // checking result object's fields
  requiredProps = ['chat_logs', 'user_status', 'unread_notifications', 'nextPage']; // 'after'
  invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content.userchatsByCursor, prop)) {
      reportError(`validate GetThreadsByUser failed inside userchatsByCursor: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (invalidData) return null;
  return content;
};

const validateGetAllUsers = (content) => {
  let requiredProps = ['pagination_data', 'pagination_details'];
  let invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate getAllUsers failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (!jsUtils.isEmpty(content.pagination_data)) {
    if (invalidData) return null;
    // checking result object's fields
    requiredProps = [
      'email',
      // 'first_name', //first name & last name will be empty for invited user
      // 'last_name',
      'username',
      '_id',
      'user_type',
      'is_active',
    ];
    invalidData = requiredProps.some((prop) => {
      if (!Object.prototype.hasOwnProperty.call(content.pagination_data[0], prop)) {
        reportError(`validate getAllUsers failed inside pagination_data: ${prop} missing`);
        return true;
      }
      return false;
    });
  }
  if (invalidData) return null;
  return content;
};
const validateGetThreadId = (content) =>
  // let requiredProps = ['flow_id'];
  // let invalidData = requiredProps.some((prop) => {
  //   if (!Object.prototype.hasOwnProperty.call(content, prop)) {
  //     reportError(`validate GetThreadId failed: ${prop} missing`);
  //     return true;
  //   }
  // });
  // if (invalidData) return null;
  // // // checking result object's fields
  // // requiredProps = ['flow_id'];
  // // invalidData = requiredProps.some((prop) => {
  // //   if (!Object.prototype.hasOwnProperty.call(content.userThreadIdByUserId, prop)) {
  // //     reportError(`validate GetThreadsBySearch failed inside userThreadIdByUserId: ${prop} missing`);
  // //     return true;
  // //   }
  // // });

  // if (invalidData) return null;
   content;

const validateGetThreadsBySearch = (content) => {
  let requiredProps = ['chat_search'];
  let invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate GetThreadsBySearch failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (invalidData) return null;
  // checking result object's fields
  requiredProps = ['chat_logs', 'user_status'];
  invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content.chat_search, prop)) {
      reportError(`validate GetThreadsBySearch failed inside chat_search: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (invalidData) return null;
  return content;
};

export const normalizeGetNotificationCount = (untrustedContent) => {
  const content = validateGetNotificationCount(untrustedContent.data);
  if (!content) {
    reportError('validate GetNoticationCount failed');
    return null;
  }
  return content;
};

export const normalizeGetThreadsByUser = (untrustedContent) => {
  const content = validateGetThreadsByUser(untrustedContent.data);
  if (!content) {
    reportError('validate GetThreadsByUser failed');
    return null;
  }
  return content;
};

export const normalizeAllUsers = (untrustedContent) => {
  const content = validateGetAllUsers(untrustedContent.data.result.data);
  if (!content) {
    reportError('validate getAllUsers failed');
    return null;
  }
  return content;
};

export const normalizeGetThreadsBySearch = (untrustedContent) => {
  const content = validateGetThreadsBySearch(untrustedContent.data);
  if (!content) {
    reportError('validate GetThreadsByUser failed');
    return null;
  }
  return content;
};
export const normalizeGetThreadId = (untrustedContent) => {
  const content = validateGetThreadId(untrustedContent.data);
  if (!content) {
    reportError('validate GetThreadId failed');
    return null;
  }
  return content;
};

export default normalizeGetNotificationCount;
