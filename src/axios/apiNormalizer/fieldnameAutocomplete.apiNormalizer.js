import { reportError } from '../../utils/UtilityFunctions';

const validateFieldName = (content) => {
  if (content.data.success && 'next_word' in content.data.result.data) {
    return content.data.result.data;
  }
  reportError('validate Field name autocomplete failed');
  return null;
};

const validateFieldType = (content) => {
  if (content) {
    return content.data.result;
  }
  reportError('validate Field name autocomplete failed');
  return null;
};

export const normalizeFieldName = (untrustedContent) => {
  const content = validateFieldName(untrustedContent);

  if (!content) {
    reportError('normalizeFieldName failed');
    return null;
  }

  const modifiedContent = {
    fieldNameSuggestions: content?.next_word || [],
  };
  return modifiedContent;
};

export const normalizeFieldType = (untrustedContent) => {
  const content = validateFieldType(untrustedContent);

  if (!content) {
    reportError('normalizeFieldName failed');
    return null;
  }

 const fieldTypeData = content?.data; // change keys inside data also

  return fieldTypeData;
};

export const normalizeTrackingData = (untrustedContent) => {
  if (!untrustedContent) {
    reportError('normalizeTrackingData failed');
    return null;
  }
  return untrustedContent;
};

const validateTaskAssignee = (content) => {
  if (content) {
    return content.data.result;
  }
  reportError('validate Field name autocomplete failed');
  return null;
};

export const normalizeTaskAssignee = (untrustedContent) => {
  const content = validateTaskAssignee(untrustedContent);

  if (!content) {
    reportError('normalizeFieldName failed');
    return null;
  }
  return content;
};

const validateGetWelcomeMessageDependency = (content) => {
  const requiredProps = ['greeting_message', 'workload_message'];
  const invalidData = requiredProps.some((prop) => {
    if (!Object.prototype.hasOwnProperty.call(content, prop)) {
      reportError(`validate get welcome message generation failed: ${prop} missing`);
      return true;
    }
    return false;
  });
  if (invalidData) return null;
  return content;
};

export const normalizeWelcomeMessage = (untrustedContent) => {
  const content = validateGetWelcomeMessageDependency(untrustedContent.data.result.data);

  if (!content) {
    reportError('normalize get welcome message failed');
    return null;
  }
  return content;
};

export default normalizeFieldName;
