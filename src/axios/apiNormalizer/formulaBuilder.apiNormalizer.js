import { get, isEmpty } from '../../utils/jsUtility';
import { reportError, hasOwn } from '../../utils/UtilityFunctions';

const normalizeGetFormulaBuilderFunctions = (untrustedContent) => {
    const content = get(untrustedContent, ['data', 'result'], []);
    return (isEmpty(content)) ? [] : content;
};

const validateGetExternalFields = (content) => {
  const requiredProps = ['pagination_data', 'pagination_details'];
  requiredProps.forEach((prop) => {
    if (!hasOwn(content, prop)) {
      reportError(`validate GetExternalFIelds failed: ${prop} missing`);
      return null;
    }
    return prop;
  });
  return content;
};

const validateSaveRule = (content) => {
    const requiredProps = ['_id', 'rule'];
    requiredProps.forEach((prop) => {
      if (!hasOwn(content, prop)) {
        reportError(`validate SaveRule failed: ${prop} missing`);
        return null;
      }
      return prop;
    });

    return content;
  };

export const normalizeSaveRule = (untrustedContent) => {
    const validateData = validateSaveRule(untrustedContent);
    if (!validateData) {
      reportError('normalize SaveRule failed');
      return null;
    }
    return validateData;
  };

export const normalizeGetExternalFields = (untrustedContent) => {
  const validateData = validateGetExternalFields(untrustedContent);
    if (!validateData) {
      reportError('normalize SaveRule failed');
      return null;
    }

    const modifiedContent = {
      ...validateData,
      externalFields: validateData?.pagination_data?.map((field) => {
        return {
          label: field?.field_name,
          value: field?.field_uuid,
          fieldType: field?.field_type,
        };
      }) || [],
      externalFieldsPaginationDetails: {
        page: validateData?.pagination_details?.[0]?.page || 1,
        totalCount: validateData?.pagination_details?.[0]?.total_count || 0,
      },
    };
    return modifiedContent;
};

export default normalizeGetFormulaBuilderFunctions;
