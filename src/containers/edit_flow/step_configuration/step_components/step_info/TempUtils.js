import { isArrayObjectsEmpty } from 'utils/jsUtility';

const fieldSuggestions = [
  {
    field_label: 'Address Line 2',
    field_type: 'singleline',
    options: [],
    is_table: false,
    validations: '',
    score: 0.9999999999999999,
  },
  {
    field_label: 'City',
    field_type: 'singleline',
    options: [],
    is_table: false,
    validations: '',
    score: 0.9999999999999999,
  },
  {
    field_label: 'Country',
    field_type: 'dropdown',
    options: ['Country 1', 'Country 2', 'Country 3'],
    is_table: false,
    validations: '',
    score: 0.9999999999999999,
  },
  {
    field_label: 'ZIP Code',
    field_type: 'singleline',
    options: [],
    is_table: false,
    validations: '',
    score: 0.8728715609439697,
  },
  {
    field_label: 'Street',
    field_type: 'singleline',
    options: [],
    is_table: false,
    validations: '',
    score: 6.878104768743326e-16,
  },
  {
    field_label: 'End Date',
    field_type: 'date',
    options: [],
    is_table: false,
    validations: '',
    score: 5.979799483879009e-16,
  },
  {
    field_label: 'Start Date',
    field_type: 'date',
    options: [],
    is_table: false,
    validations: '',
    score: 4.589787027483383e-16,
  },
];

export const validateFieldSuggestion = () => {
  const field_data_subset = [];
  fieldSuggestions.forEach((field_data) => {
    let suggestionFields = {
      field_name: field_data.field_label,
      field_type: field_data.field_type,
      required: field_data.required,
      read_only: field_data.read_only,
      validations: field_data.validations ? field_data.validations : {},
    };
    if (!isArrayObjectsEmpty(field_data.options)) {
      suggestionFields = {
        ...suggestionFields,
        values: field_data.options && field_data.options.toString(),
      };
    }
    field_data_subset.push(suggestionFields);
  });
  return field_data_subset;
};

export default fieldSuggestions;
