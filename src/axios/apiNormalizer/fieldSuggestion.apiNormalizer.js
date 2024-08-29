import { reportError } from '../../utils/UtilityFunctions';
import { isEmpty } from '../../utils/jsUtility';

const validateFieldSuggestion = (content) => {
  if (content.data.success) {
    const field_data_subset = [];
    // const field_data_list =
    content.data.result.data.suggested_fields.forEach((field_data) => {
      let suggestionFields = {
        field_name: field_data.field_label,
        field_type: field_data.field_type,
        required: field_data.required,
        read_only: field_data.read_only,
        validations: field_data.validations ? field_data.validations : {},
      };
      if (!(isEmpty(field_data.options))) {
        suggestionFields = { ...suggestionFields, values: field_data.options && field_data.options.toString() };
      }
      field_data_subset.push(suggestionFields);
    });
    return field_data_subset;
  }
  reportError('validate Field suggestion failed');
  return null;
};

export const normalizeFieldSuggestion = (untrustedContent) => {
  const content = validateFieldSuggestion(untrustedContent);

  if (!content) {
    reportError('normalizeFieldSuggestion failed');
    return null;
  }
  return content;
};

export default normalizeFieldSuggestion;
