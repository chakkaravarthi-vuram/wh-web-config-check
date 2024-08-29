import { reportError } from '../../utils/UtilityFunctions';

const validateGetRules = (content) => {
  const requiredProps = ['_id', 'name', 'field_uuids', 'form_uuids', 'visibility', 'field_metadata'];
  return content.every((element) => requiredProps.every((prop) => {
    if (!Object.prototype.hasOwnProperty.call(element, prop)) {
      reportError(`validateGetRules failed: ${prop} missing`);
      return false;
    }
    return true;
  }));
};

export const normalizeGetRules = (untrustedContent) => {
  const content = validateGetRules(untrustedContent.data.result.data.pagination_data);
  if (!content) {
    reportError('normalizeGetRules failed');
    return null;
  }
  return untrustedContent.data.result.data.pagination_data;
};

export const normalizeGetUniqueRuleName = (untrustedContent) => {
  const content = untrustedContent.data.result.data;
  return content;
};
