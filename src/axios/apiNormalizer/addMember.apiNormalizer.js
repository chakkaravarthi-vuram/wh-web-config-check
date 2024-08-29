import { isEmpty } from 'lodash';
import { reportError } from '../../utils/UtilityFunctions';
import jsUtils from '../../utils/jsUtility';
import {
  getBusinessUnitsFromResponse,
  getRolesFromResponse,
} from '../../containers/admin_settings/user_management/add_or_invite_members/add_member/AddMember.validation.schema';

const userManagement = 'add user';

const validateUserRoles = (content) => {
  const requiredProps = 'roles';
  const missingDataList = content.filter((data) => {
    if (!Object.prototype.hasOwnProperty.call(data, requiredProps)) {
      reportError(`validate ${userManagement} data failed: ${requiredProps} missing`);
      return true;
    }
    return false;
  });

  if (missingDataList.length > 0) return null;
  return content;
};

const validateUserData = (content) => {
  const requiredProps = jsUtils.has(content, 'email') ? ['email', 'username', 'user_type'] : ['username', 'user_type'];
  console.log('validateUserData', content, requiredProps, jsUtils.has(content, 'email'));
  const missingDataList = requiredProps.filter((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${userManagement} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });

  if (missingDataList.length > 0) return null;
  return content;
};

export const normalizeGetUserRoles = (unTrustedContent) => {
  let normalizedData = validateUserRoles(unTrustedContent.data.result.data.pagination_data);
  if (!normalizedData) {
    reportError('normalize User preference failed');
    return null;
  }
  normalizedData = getRolesFromResponse(normalizedData);
  console.log('normalizedData', normalizedData);
  return normalizedData;
};

export const normalizeGetUserData = (unTrustedContent) => {
  const normalizedData = validateUserData(unTrustedContent.data.result.data);
  if (isEmpty(normalizedData)) {
    reportError('normalize User data failed');
    return null;
  }
  return normalizedData;
};

const validateBusinessUnits = (content) => {
  const requiredProps = 'business_units';
  const missingDataList = content.filter((data) => {
    if (!Object.prototype.hasOwnProperty.call(data, requiredProps)) {
      reportError(`validate ${userManagement} data failed: ${requiredProps} missing`);
      return true;
    }
    return false;
  });

  if (missingDataList.length > 0) return null;
  return content;
};

export const normalizeGetBusinessUnits = (unTrustedContent) => {
  let normalizedData = validateBusinessUnits(unTrustedContent.data.result.data.pagination_data);
  if (isEmpty(normalizedData)) {
    reportError('normalize User preference failed');
    return null;
  }
  normalizedData = getBusinessUnitsFromResponse(normalizedData);
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

export const normalizePostAddNewRole = (unTrustedContent) => {
  const normalizedData = unTrustedContent.data.result.data;
  return normalizedData;
};

export const normalizePostAddNewBusinessUnit = (unTrustedContent) => {
  const normalizedData = unTrustedContent.data.result.data;
  return normalizedData;
};

export const normalizeAddUser = (unTrustedContent) => {
  const normalizedData = unTrustedContent.data.result.data;
  return normalizedData;
};

export const normalizeUpdateUser = (unTrustedContent) => {
  const normalizedData = unTrustedContent.data.result.data;
  return normalizedData;
};

export const normalizePostCheckUserNameExist = (unTrustedContent) => {
  const normalizedData = unTrustedContent.data.result.data;
  return normalizedData;
};

export const normalizePostCheckEmailExist = (unTrustedContent) => {
  const normalizedData = unTrustedContent.data.result.data;
  return normalizedData;
};

export default normalizeGetUserRoles;
