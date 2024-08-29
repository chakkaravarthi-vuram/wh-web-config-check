import { reportError } from '../../utils/UtilityFunctions';

const validateGetUserByIdApi = (content) => {
  const requiredProps = [
    '_id',
    'username',
    'email',
    'first_name',
    'last_name',
    // 'mobile_number',
    // 'mobile_number_country',
    // 'mobile_number_country_code',
  ];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate GetUserByIdApi failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

const validateGetUploadSignedUrlApi = (content, isTempFile = false) => {
  const requiredProps = isTempFile ? ['file_metadata'] : ['entity', 'entity_id', 'file_metadata'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate GetUploadSignedUrlApi failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

const validateGetTempUploadSignedUrlApi = (content) => {
  const requiredProps = ['file_metadata'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate GetUploadSignedUrlApi failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

const validateUpdateUserProfileApi = (content) => {
  const requiredProps = ['success'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate UpdateUserProfileApi failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const normalizeUpdateUserProfileApi = (untrustedContent) => {
  const content = validateUpdateUserProfileApi(untrustedContent.data);
  if (!content) {
    reportError('validate UpdateUserProfileApi failed');
    return null;
  }
  return content;
};

export const normalizeGetUserByIdApi = (untrustedContent) => {
  const content = validateGetUserByIdApi(untrustedContent.data.result.data);
  if (!content) {
    reportError('validate GetUserByIdApi failed');
    return null;
  }
  return content;
};

export const normalizeGetUploadSignedUrlApi = (untrustedContent, isTempFile) => {
  const content = validateGetUploadSignedUrlApi(untrustedContent.data.result.data, isTempFile);
  if (!content) {
    reportError('validate GetUploadSignedUrlApi failed');
    return null;
  }
  return content;
};

export const normalizeGetTempUploadSignedUrlApi = (untrustedContent) => {
  const content = validateGetTempUploadSignedUrlApi(untrustedContent.data.result.data);
  if (!content) {
    reportError('validate GetUploadSignedUrlApi failed');
    return null;
  }
  return content;
};

export default normalizeGetUserByIdApi;
