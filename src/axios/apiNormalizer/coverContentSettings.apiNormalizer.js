import { reportError } from '../../utils/UtilityFunctions';

const validateUpdateAccountCoverDetails = (content) => {
  const requiredProps = ['success'];
  const missingDataList = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate cover settings data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;
  return content;
};

export const normalizeUpdateAccountCoverDetails = (untrustedContent) => {
  const content = validateUpdateAccountCoverDetails(untrustedContent.data);
  if (!content) {
    reportError('normalize cover settings Data failed');
    return null;
  }
  return content;
};

const validateAccountCoverDetails = (content) => {
  const requiredProps = ['is_cover'];
  if (content.is_cover) {
    requiredProps.push(['cover_type', 'cover_start_dt', 'cover_end_dt']);
    if (content.cover_type === 'picture') {
      requiredProps.push(['acc_cover_pic']);
    } else if (content.cover_type === 'message') {
      requiredProps.push(['cover_message', 'cover_color']);
    }
  }
  const missingDataList = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate cover settings data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;
  return content;
};

export const normalizeAccountCoverDetails = (untrustedContent) => {
  const content = validateAccountCoverDetails(untrustedContent.data.result.data);
  if (!content) {
    reportError('normalize cover settings data failed');
    return null;
  }
  return content;
};

export default normalizeAccountCoverDetails;
