import { CHOICE_VALUE_TYPE_OPTIONS } from './BasicConfiguration.constants';

export const BASIC_FORM_FIELD_CONFIG_STRINGS = (t) => {
  return {
    LABEL: t('form_field_strings.field_config.label.label'),
    INVALID_LABEL: t('form_field_strings.field_config.label.invalid_error'),
    FIELD_TYPE: {
      LABEL: t('form_field_strings.field_config.field_type.label'),
      PLACEHOLDER: t('form_field_strings.field_config.field_type.placeholder'),
      HELPER_MESSAGE: t('form_field_strings.field_config.field_type.helper_message'),
      ID: 'fieldType',
      SEARCH_FIELD_TYPE: t('form_field_strings.field_config.field_type.search_field_types'),
      NO_DATA_FOUND: t('form_field_strings.field_config.field_type.no_data_found'),
    },
    LOOKUP_LIST: {
      PLACEHOLDER: t('form_field_strings.field_config.values_lookup.placeholder'),
      ID: 'values_lookup',
      LABEL: t('form_field_strings.field_config.values_lookup.label'),
    },
    READ_ONLY: {
      LABEL: t('form_field_strings.field_config.read_only.label'),
      OPTIONS: [
        {
          label: t('form_field_strings.field_config.read_only.options.editable'),
          value: false,
        },
        {
          label: t('form_field_strings.field_config.read_only.options.read_only'),
          value: true,
        },
      ],
    },
    REQUIRED: {
      LABEL: t('form_field_strings.field_config.required.label'),
      VALIDATION: t('form_field_strings.field_config.required.validation_label'),
      OPTIONS: [
        {
          label: t('form_field_strings.field_config.required.options.required'),
          value: true,
        },
        {
          label: t('form_field_strings.field_config.required.options.optional'),
          value: false,
        },
      ],
    },
    OPTIONS: {
      LABEL: t('form_field_strings.field_config.options.label'),
      OPTION_ID: t('form_field_strings.field_config.options.option_id'),
      OPTION_LABEL: t('form_field_strings.field_config.options.option_label'),
      VALUE_ID: t('form_field_strings.field_config.options.option_label'),
      VALUE_LABEL: t('form_field_strings.field_config.options.value_id'),
      VALUE_TYPE_LABEL: t('form_field_strings.field_config.options.value_types.label'),
      VALUE_TYPES: [
        {
          LABEL: t('form_field_strings.field_config.options.value_types.text.label'),
          VALUE: CHOICE_VALUE_TYPE_OPTIONS.TEXT,
        },
        {
          LABEL: t('form_field_strings.field_config.options.value_types.number.label'),
          VALUE: CHOICE_VALUE_TYPE_OPTIONS.NUMBER,
        },
        {
          LABEL: t('form_field_strings.field_config.options.value_types.date.label'),
          VALUE: 'date',
        },
      ],
      VALUE_ERROR: t('form_field_strings.field_config.options.value_required_error'),
    },
    SHARED_PROPERTY_TEXT: t('form_field_strings.field_config.shared_property_text'),
    DATALIST_SELECTOR: {
      ADD_MORE: t('form_field_strings.field_config.add_more_field'),
      REMOVE_FIELD: t('form_field_strings.field_config.remove_field'),
      PICKER: {
        ID: 'data_list',
        LABEL: t('validation_constants.datalist_field_config.picker.label'),
        PLACEHOLDER: t('validation_constants.datalist_field_config.picker.placeholder'),
        READ_ONLY: t('validation_constants.datalist_property_picker.read_only'),
        NO_DATA_LIST_SELECTOR_FORM_FEILD: t('validation_constants.datalist_property_picker.no_datalist_picker_form_field'),
        NO_DATA_LIST_SELECTOR_TABLE_FEILD: t('validation_constants.datalist_property_picker.no_datalist_picker_table_field'),
      },
      FIELD: {
        LABEL: t('form_field_strings.field_config.datalist_field'),
      },
    },
    USER_SELECTOR: {
      PICKER: {
        LABEL: t('validation_constants.user_list_config.picker.label'),
        FIELD_LABEL: t('form_field_strings.field_config.user_selector_field'),
        READ_ONLY: t('validation_constants.user_property_picker.read_only'),
        NO_DATA_LIST_PICKER_FORM_FEILD: t('validation_constants.user_property_picker.no_user_picker_from_field'),
        NO_DATA_LIST_PICKER_TABLE_FEILD: t('validation_constants.user_property_picker.no_user_picker_table_field'),
      },
    },
    INFORMATION_FIELD: {
      LABEL: t('form_field_strings.form_field_constants.info_content'),
    },
    ERRORS: {
      OPTION: t('common_strings.option'),
      REMOVE_DEFAULT_VALUE_TITLE: t('form_field_strings.field_config.remove_default_value_title'),
      REMOVE_DEFAULT_VALUE_SUBTITLE: t('form_field_strings.field_config.remove_default_value_subtitle'),
    },
    COLUMN_CONFIG: {
      COLUMN_NAME: t('form_field_strings.field_config.column_name.label'),
      COLUMN_TYPE: t('form_field_strings.field_config.column_type.label'),
      EDITABILITY: t('form_field_strings.field_config.read_only.label'),
    },
  };
};
