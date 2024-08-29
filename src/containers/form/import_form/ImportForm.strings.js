import { translateFunction } from '../../../utils/jsUtility';

export const IMPORT_FORM_STRINGS = (t = translateFunction) => {
  return {
    IMPORT_FORM: {
      MODAL_ID: 'import-form',
      MODAL_TITLE: t('form.import_form.modal_title'),
      SELECT_STEPS: t('form.import_form.select_steps'),
      CANCEL: t('form.import_form.cancel'),
      IMPORT: t('form.import_form.import'),
      READONLY: t('form.import_form.readonly'),
      EDITABLE: t('form.import_form.editable'),
      IMPORT_ALL_FIELDS_TEXT: t('form.import_form.import_all_fields_text'),
      ERRORS: {
        NO_FIELDS_SELECTED: t('form.import_form.errors.no_fields_selected'),
        SELECT_FIELD: t('form.import_form.errors.select_field'),
        SOMETHING_WENT_WRONG: t('server_error_code_string.somthing_went_wrong'),
        DUPLICATE_FIELD: t('form.import_form.errors.duplicate_field'),
        DUPLICATE_FIELD_SUBTITLE: t('form.import_form.errors.duplicate_field_subtitle'),
        TABLE_UNIQUE_COLUMN_TITLE: t('form.import_form.errors.table_unique_column_title'),
        TABLE_UNIQUE_COLUMN_SUBTITLE: t('form.import_form.errors.table_unique_column_subtitle'),
      },
      ALL_FIELDS: t('datalist.view_datalist.audit_view.all_fields'),
      NO_FORM_TO_IMPORT: t(
        'form_builder_strings.import_intruction.no_forms_to_import',
      ),
    },
  };
};

export const IMPORT_FIELD_TYPES = {
  EDITABLE: 'editable',
  READONLY: 'readonly',
};

export const IMPORT_ACTION_TYPE = {
  SELECTED: 'selected',
  DESELECTED: 'deselected',
};

export const IMPORT_TYPES = {
  FORM: 'form',
  FIELD: 'field',
  SECTION: 'section',
};

export const COLUMN_SELECT_TYPE = {
  SINGLE: 'SINGLE',
  ALL: 'ALL',
};
