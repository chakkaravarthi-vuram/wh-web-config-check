const validateGetNotification = (content) => {
    let requiredProps = ['pagination_details', 'pagination_data'];
    let invalidData = requiredProps.some((prop) => {
      if (!Object.prototype.hasOwnProperty.call(content, prop)) {
        reportError(`validate get notification failed: ${prop} missing`);
        return true;
      }
      return false;
    });
    if (invalidData) return null;
    // check list data
    requiredProps = ['_id', 'context', 'data', 'is_read']; // to include user_id
    invalidData = content.pagination_data.some((data) => requiredProps.some((reqProp) => {
      if (!Object.prototype.hasOwnProperty.call(data, reqProp)) {
        reportError(`validate get notification failed: ${reqProp} missing`);
        return true;
      }
      return false;
    }));
    if (invalidData) return null;
    // check pagination details
    requiredProps = ['page', 'size', 'total_count'];
    invalidData = requiredProps.some((prop) => {
      if (!Object.prototype.hasOwnProperty.call(content.pagination_details[0], prop)) {
        reportError(`validate get notification failed: ${prop} missing`);
        return true;
      }
      return false;
    });
    if (invalidData) return null;
    return content;
  };

const validateGetNotificationsCount = (content) => {
  const requiredProps = ['data'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get notification count failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const normalizeGetAllNotifications = (untrustedContent) => {
  const content = validateGetNotification(untrustedContent.data.result.data);
if (!content) {
  reportError('normalize get notification failed');
  return null;
}
return content;
};

export const normalizeReadNotification = (untrustedContent) => {
  const content = (untrustedContent.data.result.data);
if (!content) {
  reportError('normalize read notification failed');
  return null;
}
return content;
};

export const normalizeGetNotificationsCount = (untrustedContent) => {
  const content = validateGetNotificationsCount(untrustedContent.data.result);
if (!content) {
  reportError('normalize get notification count failed');
  return null;
}
return content;
};
