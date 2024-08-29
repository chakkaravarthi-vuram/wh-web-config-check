import { reportError, hasOwn } from '../../utils/UtilityFunctions';

const validateCopilotInference = (content) => {
  const requiredProps = [
    'status_code',
    'answer',
    'other_relevant_sources',
    'context_uuid',
  ];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate CopilotInference failed: ${prop} missing`);
      return null;
    }
    return prop;
  });

  return content;
};

const normalizeCopilotInference = (untrustedContent) => {
  const validateData = validateCopilotInference(untrustedContent);
  if (!validateData) {
    reportError('normalize CopilotInference failed');
    return null;
  }
  return validateData;
};

export default normalizeCopilotInference;
