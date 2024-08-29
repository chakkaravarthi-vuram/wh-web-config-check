import { reportError } from '../../utils/UtilityFunctions';
import { store } from '../../Store';

const userManagement = 'user  management';

const validateUserList = (content) => {
  let requiredProps = ['pagination_details', 'pagination_data'];
  let missingDataList = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${userManagement} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (missingDataList.length > 0) return null;
  // check list data

  requiredProps = ['_id', 'email', 'is_active', 'user_type', 'username'];
  missingDataList = content.pagination_data.some((data) => {
    const list = requiredProps.filter((reqProp) => {
      if (!Object.prototype.hasOwnProperty.call(data, reqProp)) {
        reportError(`validate ${userManagement} data failed: ${reqProp} missing`);
        return true;
      }
      return false;
    });
    if (list.length > 0) return true;
    return false;
  });

  if (missingDataList > 0) return null;
  // check pagination details
  requiredProps = ['page', 'size', 'total_count', 'sort'];
  missingDataList = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content.pagination_details[0], prop)) {
      reportError(`validate ${userManagement} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;

  return content;
};

export const normalizeUserList = (unTrustedContent, params) => {
  const content = validateUserList(unTrustedContent.data.result.data);
  const { full_user_list } = store.getState().UserManagementAdminReducer;
  console.log('params && params.search', params && params.search, params);
  const normalizedData = {
    user_list: content.pagination_data,
    full_user_list: params && params.search ? full_user_list : content.pagination_data,
    total_items_count: content.pagination_details[0].total_count,
  };
  if (content.document_url_details) normalizedData.document_details = content.document_url_details;
  if (!content) {
    reportError('normalize User preference failed');
    return null;
  }

  return normalizedData;
};

export const normalizeActivateDeactivateUser = (unTrustedContent) => {
  const normalizedData = unTrustedContent.data.result.data;
  return normalizedData;
};

export const normalizeUserRoleChange = (unTrustedContent) => {
  const normalizedData = unTrustedContent.data.result.data;
  return normalizedData;
};

export default normalizeUserList;
