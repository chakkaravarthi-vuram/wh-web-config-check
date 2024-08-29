import { translateFunction } from 'utils/jsUtility';

export const NUMBER_DROPDOWN_INPUT = {
  LABEL: 'Set a value',
  PLACEHOLDER: 'Type a number..',
};

export const STRING_DROPDOWN_INPUT = (t = translateFunction) => {
  return {
  LABEL: t('form_field_strings.field_value.string_dropdown.label'),
  PLACEHOLDER: t('form_field_strings.field_value.string_dropdown.placeholder'),
  };
};

export const SET_BUTTON = {
  LABEL: 'form_field_strings.field_value.set_button',
  VALUE: 'form_field_strings.field_value.select_value',
};

export const REFERENCE_NAME_INSTRUCTION = 'field_value_strings.reference_name_tooltip';

export const SET_NON_EDITABLE_FIELD_DISABLED_INFO = {
  ERROR: 'This field is set as unique column and can not be set as read only',
  INFO: "Can't be marked as read only field.",
  HELPER: 'Why?',
  HELPER_TEXT: 'This field is been set as unique editable column for the table. Please remove unique condition to make it readonly.',
};

export const EXISTING_DATA_LIST_DELETED_ERROR_INSTRUCTION = (t) => t('form_field_strings.field_config.existing_datalist_deleted');
