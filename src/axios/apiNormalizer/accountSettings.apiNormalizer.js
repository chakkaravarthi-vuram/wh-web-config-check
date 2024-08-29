import { reportError } from '../../utils/UtilityFunctions';

const account_settings = 'account settings';

const validateUpdateAccountMainDetails = (content) => {
  const requiredProps = ['success'];
  const missingDataList = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${account_settings} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;
  return content;
};

export const normalizeUpdateAccountMainDetails = (untrustedContent) => {
  const content = validateUpdateAccountMainDetails(untrustedContent.data);
  if (!content) {
    reportError(`normalize ${account_settings} Data failed`);
    return null;
  }
  return content;
};

const validateAccountMainDetails = (content) => {
  const requiredProps = [
    'account_domain',
    'account_name',
    // 'primary_color',
    // 'secondary_color',
    'button_color',
  ];
  const missingDataList = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate ${account_settings} data failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (missingDataList.length > 0) return null;
  return content;
};

export const normalizeGetIndustryList = (untrustedContent) => {
  console.log('NORMALIZE IN INDUSTRY LIST', untrustedContent);
  const content = untrustedContent.data.result.data;
  if (!content) {
    reportError(`normalize ${account_settings} Data failed`);
    return null;
  }
  return content;
};

export const normalizeAccountMainDetails = (untrustedContent) => {
  const content = validateAccountMainDetails(untrustedContent.data.result.data);
  if (!content) {
    reportError(`normalize ${account_settings} Data failed`);
    return null;
  }
  return content;
};

export default normalizeAccountMainDetails;
