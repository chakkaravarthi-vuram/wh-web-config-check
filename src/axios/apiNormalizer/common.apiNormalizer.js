import { reportError, hasOwn } from '../../utils/UtilityFunctions';

const validateSuccess = (content) => {
  const requiredProps = ['success'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validateSuccess failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

export const normalizeSuccess = (unTrustedContent) => {
  const content = validateSuccess(unTrustedContent);
  if (!content) {
    reportError('normalize normalizeSuccess failed');
    return null;
  }
  return content;
};

const validatePaginationDetails = (content) => {
  const requiredProps = ['total_count', 'page', 'size', 'sort'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate Pagination Details failed: ${prop} missing`);
      return null;
    }
    return prop;
  });

  return content;
};

export const validatePagination = (content) => {
  if (!content) {
    reportError('validatePagination failed');
    return null;
  }
  const requiredProps = ['pagination_details', 'pagination_data'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate Pagination failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  content.pagination_details.length > 0 && validatePaginationDetails(content.pagination_details[0]);
  return content;
};

export const validateUser = (content) => {
  const requiredProps = [
    '_id',
    'username',
    'first_name',
    'last_name',
    'email',
    'is_active',
    'user_type',
  ];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate User failed: ${prop} missing`);
      return null;
    }
    return prop;
  });

  return content;
};

export const validateTeam = (content) => {
  const requiredProps = ['_id', 'team_name'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate team failed: ${prop} missing`);
      return null;
    }
    return prop;
  });

  return content;
};
