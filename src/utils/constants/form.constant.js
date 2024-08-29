// import { translate } from 'language/config';
import i18next from 'i18next';
import { nullCheck } from '../jsUtility';
import { FORM_BUILDER_STRINGS } from '../strings/CommonStrings';

export const FORM_TYPES = {
  CREATION_FORM: 'CREATION_FORM',
  EDITABLE_FORM: 'EDITABLE_FORM', // SUB VARIANTS -> 1.isCompletedForm, 2.isReadOnlyForm
  IMPORTABLE_FORM: 'IMPORTABLE_FORM',
};

export const FORM_PARENT_MODULE_TYPES = {
  TASK: 'TASK',
  FLOW: 'FLOW',
  DATA_LIST: 'DATALIST',
  TEAM: 'TEAM',
  ADD_DATA_LIST_ENTRY: 'ADD_DATALIST_ENTRY',
};

export const FIELD_LIST_TYPE = {
  DIRECT: 'direct',
  TABLE: 'table',
  CHART: 'chart',
};

export const FIELD_OR_FIELD_LIST = {
  FIELD: 'FIELD',
  FIELD_LIST: 'FIELD_LIST',
};

export const FIELD_TYPE = {
  SINGLE_LINE: 'singleline',
  PARAGRAPH: 'paragraph',
  NUMBER: 'number',
  EMAIL: 'email',
  DATE: 'date',
  FILE_UPLOAD: 'fileupload',
  CURRENCY: 'currency',
  DROPDOWN: 'dropdown',
  CHECKBOX: 'checkbox',
  RADIO_GROUP: 'radiobutton',
  CASCADING: 'cascading',
  USER_TEAM_PICKER: 'userteampicker',
  USER_PROPERTY_PICKER: 'userpropertypicker',
  YES_NO: 'yesorno',
  LINK: 'link',
  INFORMATION: 'information',
  SCANNER: 'barcodescanner',
  CUSTOM_LOOKUP_CHECKBOX: 'lookupcheckbox',
  CUSTOM_LOOKUP_DROPDOWN: 'lookupdropdown',
  CUSTOM_LOOKUP_RADIOBUTTON: 'lookupradiobutton',
  DATETIME: 'datetime',

  TIME: 'time',
  USERS: 'users',
  TEAMS: 'teams',
  ADDRESS: 'address',
  RATING: 'rating',
  PERCENTAGE: 'percentage',
  TABLE: 'table',
  DATA_LIST: 'datalistpicker',
  DATA_LIST_PROPERTY_PICKER: 'datalistpropertypicker',
  PHONE_NUMBER: 'phonenumber',
  IMAGE: 'image',
  BUTTON_LINK: 'button',
  RICH_TEXT: 'textstyle',
};

export const getFieldTypeForPropTypes = () => {
  const data = [];
  Object.keys(FIELD_TYPE).forEach((key) => data.push(FIELD_TYPE[key]));
  return data;
};

export const PROPERTY_PICKER_ARRAY = [
  FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
  FIELD_TYPE.USER_PROPERTY_PICKER,
];

export const READ_ONLY_DEFAULT_VALUE_UPDATE_FIELDS = [
    FIELD_TYPE.SINGLE_LINE,
    FIELD_TYPE.NUMBER,
    FIELD_TYPE.PARAGRAPH,
    FIELD_TYPE.CHECKBOX,
    FIELD_TYPE.DROPDOWN,
    FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
    FIELD_TYPE.DATE,
    FIELD_TYPE.DATETIME,
    FIELD_TYPE.CURRENCY,
    FIELD_TYPE.EMAIL,
    FIELD_TYPE.RADIO_GROUP,
    FIELD_TYPE.YES_NO,
    FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
    FIELD_TYPE.USER_PROPERTY_PICKER,
];

export const READ_ONLY_FIELD_TYPE = {
  DATA_LIST_PROPERTY_PICKER: 'datalistpropertypicker',
  USER_LIST_PROPERTY_PICKER: 'userpropertypicker',
  INFORMATION: 'information',
};

export const USER_TEAM_PICKER_CHANGE_HANDLER_TYPES = {
  USER_TEAM_PICKER_CH_ADD: 'USER_TEAM_PICKER_CH_ADD',
  USER_TEAM_PICKER_CH_REMOVE: 'USER_TEAM_PICKER_CH_REMOVE',
};

export const DATALIST_PICKER_CHANGE_HANDLER_TYPES = {
  DATALIST_PICKER_CH_ADD: 'DATALIST_PICKER_CH_ADD',
  DATALIST_PICKER_CH_REMOVE: 'DATALIST_PICKER_CH_REMOVE',
};

export const IDENTIFIER_INPUT_TYPE = {
  METRIC: 'default_report_fields',
};

export const CUSTOM_IDENTIFIER_IGNORE_FIELD_TYPES = [
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.DATA_LIST,
  FIELD_TYPE.FILE_UPLOAD,
  FIELD_TYPE.CHECKBOX,
  FIELD_TYPE.YES_NO,
  FIELD_TYPE.LINK,
  FIELD_TYPE.INFORMATION,
  FIELD_TYPE.USER_TEAM_PICKER,
  FIELD_TYPE.CUSTOM_LOOKUP_CHECKBOX,
  FIELD_TYPE.TABLE,
];

export const DEFAULT_REPORT_FIELD_IGNORE_FIELD_TYPES = [
  FIELD_TYPE.TABLE,
];

export const TASK_IDENTIFIER_IGNORE_FIELD_TYPES = [
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.FILE_UPLOAD,
  FIELD_TYPE.CHECKBOX,
  FIELD_TYPE.YES_NO,
  FIELD_TYPE.LINK,
  FIELD_TYPE.INFORMATION,
  FIELD_TYPE.CUSTOM_LOOKUP_CHECKBOX,
  FIELD_TYPE.TABLE,
];

export const FIELD_KEYS = {
  FIELD_ID: 'field_id',
  FIELD_NAME: 'field_name',
  READ_ONLY: 'read_only',
  READ_ONLY_PREVIOUS_STATE: 'read_only_previous_state',
  REQUIRED: 'required',
  VALUES: 'values',
  REFERENCE_NAME: 'reference_name',
  DEFAULT_VALUE: 'default_value',
  DEFAULT_VALUE_RULE: 'field_default_value_rule',
  DEFAULT_DRAFT_VALUE: 'draft_default_rule',
 // DRAFT_VISIBILITY_RULE: 'draft_visibility_rule',
  PREVIOUS_DRAFT_DRAFT_RULE: 'previous_draft_default_rule',
 // PREVIOUS_DRAFT_VISIBILITY_RULE: 'previous_draft_visibility_rule',
  IS_DEFAULT_VALUE_RULE: 'is_field_default_value_rule',
  IS_SHOW_WHEN_RULE: 'is_field_show_when_rule',
  IS_VISIBLE: 'is_visible',
  FIELD_SHOW_WHEN_RULE: 'field_show_when_rule',
  IS_CONFIG_OPEN: 'isConfigPopupOpen',
  VALIDATIONS: 'validations',
  OTHER_CONFIG: 'otherConfig',
  SELECT_LOOKUP_FIELD: 'selected_lookup_field',
  LOOKUP_VALUE: 'lookup_value',
  DATA_LIST: 'data_list',
  DATA_liST_SELECTOR_ERROR: 'datalistErrorList',
  IS_LABEL_EDITED: 'is_label_edited',
  HIDE_FIELD_IF_NULL: 'hide_field_if_null',
  DATA_LIST_PROPERTY_PICKER: 'data_list_property_picker',
  DATA_LIST_PROPERTY_PICKER_ERROR: 'datalistPropertyErrorList',
  PROPERTY_PICKER_DETAILS: 'property_picker_details',
  RULE_EXPRESSION: 'rule_expression',
  PREVIOUS_RULE_EXPRESSION: 'previous_rule_expression',
  RULE_EXPRESSION_HAS_VALIDATION: 'rule_expression_has_validation',
  VALUE_META_DATA: 'value_metadata',
  CUSTOM_LOOKUP_ID: 'custom_lookup_id',
  IS_ADVANCED_EXPRESSION: 'is_advanced_expression',
  IS_DEFAULT_RULE: 'is_default_rule',
  DEFAULT_RULE_SAVE_FIELD: 'default_rule',
  DEFAULT_VALUE_OPERATION: 'operation',
  READ_ONLY_FROM_SERVER: 'read_only_from_server',
  CHOICE_VALUES: 'choice_values',
};

export const DATA_LIST_PICKER_KEYS = {
  UUID: 'data_list_uuid',
  ID: 'data_list_id',
  DISPLAY_FIELDS: 'display_fields',
};

export const PROPERTY_PICKER_KEYS = {
  SOURCE: 'source', // "form_field","proc_to_dl",
  SOURCE_FIELD_UUID: 'source_field_uuid',
  REFERENCE_FIELD_UUID: 'reference_field_uuid',
  REFERENCE_FIELD_TYPE: 'reference_field_type',
  DATA_LIST_UUID: 'data_list_uuid',
  DATA_LIST_ID: 'data_list_id',
  VALUES: 'values',
  SOURCE_TYPE: {
    FORM: 'form_field',
    FLOW_TO_DATA_LIST: 'flow_to_data_list',
  },
};

export const REVERT_BACK_FILEDS = [
  FIELD_KEYS.FIELD_NAME,
  FIELD_KEYS.READ_ONLY,
  FIELD_KEYS.READ_ONLY_PREVIOUS_STATE,
  FIELD_KEYS.REFERENCE_NAME,
  FIELD_KEYS.REQUIRED,
  'place_holder',
  'instructions',
  'help_text',
  FIELD_KEYS.VALUES,
  FIELD_KEYS.DEFAULT_VALUE,
  FIELD_KEYS.IS_DEFAULT_VALUE_RULE,
  FIELD_KEYS.IS_SHOW_WHEN_RULE,
  FIELD_KEYS.VALIDATIONS,
  FIELD_KEYS.HIDE_FIELD_IF_NULL,
  FIELD_KEYS.IS_ADVANCED_EXPRESSION,
];

export const DEFAULT_RULE_KEYS = {
  L_VALUE: 'lValue',
  R_VALUE: 'rValue',
  OPERATOR: 'operator',
  OPERATOR_INFO: 'operatorInfo',
  ERRORS: 'errors',
  EXTRA_OPTIONS: 'extraOptions',
  INPUT: 'input',
};

export const FIELD_LIST_KEYS = {
  TABLE_NAME: 'table_name',
  TABLE_REF_NAME: 'table_reference_name',
  IS_TABLE_LABEL_EDITED: 'is_table_label_edited',
  FIELDS: 'fields',
  IS_FIELD_LIST_SHOW_WHEN_RULE: 'is_field_list_show_when_rule',
  IS_VISIBLE: 'is_visible',
  FIELD_LIST_SHOW_WHEN_RULE: 'field_list_show_when_rule',
  IS_FIELD_LIST_CONFIG_POPUP_OPEN: 'isFieldListConfigPopupOpen',
  IS_ROW_MAXIMUM: 'is_maximum_row',
  IS_ROW_MINIMUM: 'is_minimum_row',
  MINIMUM_ROW: 'maximum_row',
  MAXIMUM_ROW: 'minimum_row',
  IS_UNIQUE_COLUMN: 'is_unique_column_available',
  VALIDATIONS: 'validations',
  IS_DATALIST_FILTER: 'is_datalist_filter',
  FIELD_LIST_TYPE: 'field_list_type',
  TABLE_VALIDATIONS: 'table_validations',
  SHOW_TABLE_VALIDATION_MODAL: 'show_table_validation_modal',
  USERS: 'Users',
};

export const SECTION_KEYS = {
  SECTION_NAME: 'section_name',
  SECTION_DESCRIPTION: 'section_description',
  SECTION_UUID: 'section_uuid',
  SECTION_ORDER: 'section_order',
  IS_SECTION_SHOW_WHEN_RULE: 'is_section_show_when_rule',
  SECTION_SHOW_WHEN_RULE: 'section_show_when_rule',
  FIELD_LIST: 'field_list',
};

export const IMPORT_FORM_KEYS = {
  IS_IMPORT_FORM_DATA_LOADING: 'isImportFormEntirePageLoading',
  STEPS_DATA: 'stepsData',
  SELECTED_SECTION_INDEX: 'selectedSectionIndex',
  SELECTED_STEP_INDEX: 'selectedStepIndex',
  FORM_DETAILS: 'formDetails',
  FORM_DETAILS_SERVER_DATA: 'formDetailsServerData',
  IS_IMPORT_FORM_MODAL_VISIBLE: 'isImportFormModalVisible',
  IS_IMPORT_FORM_LOADING: 'isImportFormLoading',
};

export const FORM_VISIBILITY_TYPES = {
  SECTION: 'visible_sections',
  TABLE: 'visible_tables',
  FIELD: 'visible_fields',
};

export const ADD_FORM_FIELD_SOURCE = {
  SECTION: 'section',
  TABLE: 'TABLE',
};

export const FORM_FIELD_CONFIG_TYPES = {
  FIELD_LIST: 'FIELD_LIST',
  FIELD: 'FIELD',
};

export const VISIBILITY_CONFIG_CHANGE = {
  FIELD: 'FIELD_VISIBILITY_CONFIG',
  FIELD_LIST: 'FIELD_LIST_VISIBILITY_CONFIG',
};

export const VISIBILITY_CONFIG_FIELDS = {
  SELECTED_L_FIELD_INFO: 'selected_l_field_info',
  SELECTED_OPERATOR_INFO: 'selected_operator_info',
  R_VALUE: 'r_value',
  VISIBILITY: 'is_visible',
  ERRORS: 'errors',
};

export const FORM_FIELD_CONFIG_ACTIONS = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  EDIT: 'EDIT',
  TAB_SWITCH: 'TAB_SWITCH',
  REFERENCE_NAME_BLUR: 'REFERENCE_NAME_BLUR',
  BASIC_CONFIG_ERROR: 'BASIC_CONFIG_ERROR',
  TABLE_REFERENCE_NAME_BLUR: 'TABLE_REFERENCE_NAME_BLUR',
};

export const FIELD_ACCESSIBILITY_TYPES = {
  READ_ONLY: 'FA_READONLY',
  EDITABLE: 'FA_EDITABLE',
};

export const DEFAULT_CURRENCY_TYPE = 'INR';

export const GET_FIELD_INITIAL_DATA = (
  fieldSuggestionData = {},
  fieldType,
  fieldRowOrder,
  fieldColumnOrder,
  initialTaskLabel,
  optionValue,
) => {
  const readOnly = Object.values(READ_ONLY_FIELD_TYPE).includes(fieldType);
  let fieldData = {
    field_name: initialTaskLabel,
    is_scratch: true,
    is_edited: false,
    row_order: fieldRowOrder,
    column_order: fieldColumnOrder,
    field_type: fieldType,
    required: false,
    read_only: readOnly,
    is_field_show_when_rule: false,
    is_visible: true,
    is_field_default_value_rule: false,
    validations: {},
    isConfigPopupOpen: true,
    reference_name: initialTaskLabel,
    // values: optionValue
  };

  if (optionValue) {
    fieldData.values = optionValue;
  }
  if (PROPERTY_PICKER_ARRAY.includes(fieldType)) fieldData[FIELD_KEYS.PROPERTY_PICKER_DETAILS] = {};
  if (fieldType === FIELD_TYPE.DATE || fieldType === FIELD_TYPE.DATETIME) {
    fieldData.validations.date_selection = [
      {
        type: 'no_limit',
      },
    ];
  }
  if (fieldType === FIELD_TYPE.NUMBER) fieldData.is_digit_formatted = true;
  if (nullCheck(fieldSuggestionData, 'selected_field_index')) {
    const { selected_field_index } = fieldSuggestionData;
    if (selected_field_index >= 0) {
      fieldData = {
        ...fieldData,
        ...fieldSuggestionData.field_suggestions[selected_field_index],
        reference_name:
          fieldSuggestionData.field_suggestions[selected_field_index]
            .field_name,
      };
      if (fieldType === FIELD_TYPE.DATE || fieldType === FIELD_TYPE.DATETIME) {
        fieldData.validations.date_selection = [
          {
            type: 'no_limit',
          },
        ];
      }
    }
  }
  return fieldData;
};

export const GET_FIELD_LIST_INITIAL_DATA = (
  fieldSuggestionData = {},
  fieldListType,
  fieldListRowOrder = 1,
  fieldListColumnOrder = 1,
  fieldType,
  fieldRowOrder = 1,
  fieldColumnOrder = 1,
  initialTaskLabel,
  optionValue,
) => {
  let initialData = {};
  let fields = [];

  if (fieldListType === FIELD_LIST_TYPE.DIRECT) {
    fields = [
      GET_FIELD_INITIAL_DATA(
        fieldSuggestionData,
        fieldType,
        fieldRowOrder,
        fieldColumnOrder,
        initialTaskLabel,
        optionValue,
      ),
    ];
  }

  if (fieldListType === FIELD_LIST_TYPE.TABLE) {
    initialData = {
      // table_uuid: '',
      table_name: '',
      table_validations: {
        add_new_row: true,
        read_only: false,
        is_pagination: false,
        // page_size: 0,
        is_minimum_row: false,
        // minimum_row: 0,
        is_maximum_row: false,
        is_unique_column_available: false,
        allow_delete_existing: true,
        allow_modify_existing: true,
        // unique_column_uuid: '', // commenting this line - when 'is_unique_column_available' is false, 'unique_column_uuid' is forbidden)
        // maximum_row: false,
      },
      isFieldListConfigPopupOpen: true,
    };
  }

  initialData = {
    ...initialData,
    field_list_type: fieldListType,
    row_order: fieldListRowOrder,
    column_order: fieldListColumnOrder,
    is_field_list_show_when_rule: false,
    is_visible: true,
    fields,
  };
  return initialData;
};

export const GET_SECTION_INITIAL_DATA = (
  sectionName = i18next.t(FORM_BUILDER_STRINGS.DEFAULT_SECTION_NAME),
  sectionOrder = 1,
) => {
  return {
    section_name: sectionName,
    section_order: sectionOrder,
    is_section_show_when_rule: false,
    field_list: [],
  };
};

export const DATE_FIELD_VALIDATION_OPERATORS = Object.freeze({
  EQUAL_TO: 'equal_to',
  GREATER_THAN: 'greater_than',
  GREATER_THAN_OR_EQUAL_TO: 'greater_than_or_equal_to',
  LESS_THAN: 'lesser_than',
  LESS_THAN_OR_EQUAL_TO: 'lesser_than_or_equal_to',
  BETWEEN: 'within',
});

export const FIELD_CONFIG_BUTTONS = {
  DISCARD: 'form_builder_strings.action_buttons.discard',
  SAVE: 'form_builder_strings.action_buttons.save',
  DEL_FIELD_BUTTON: 'form_builder_strings.action_buttons.del_field_button',
};

export const INITIAL_PAGE = 1;
export const MAX_PAGINATION_SIZE = 15;
export const MAX_PAGINATION_SIZE_V2 = 30;

export const DEFAULT_CALCULATOR_APPLICABLE_FIELD_TYPES = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.CHECKBOX,
  FIELD_TYPE.RADIO_GROUP,
  FIELD_TYPE.DATE,
  FIELD_TYPE.DATETIME,
  FIELD_TYPE.EMAIL,
  FIELD_TYPE.CURRENCY,
];

export const TABLE_DEFAULT_CALCULATOR_APPLICABLE_FIELD_TYPES = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.EMAIL,
];

export const PLACEHOLDER_APPLICABLE_FIELD_TYPES = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.CURRENCY,
  FIELD_TYPE.USER_TEAM_PICKER,
  FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
  FIELD_TYPE.PHONE_NUMBER,
  FIELD_TYPE.EMAIL,
];

export const MULTIPLE_RULE_CONDTION_ALLOWED_FIELDS = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.DATE,
  FIELD_TYPE.CURRENCY,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.FILE_UPLOAD,
  FIELD_TYPE.CHECKBOX,
  FIELD_TYPE.RADIO_GROUP,
  FIELD_TYPE.YES_NO,
  FIELD_TYPE.CUSTOM_LOOKUP_CHECKBOX,
  FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
  FIELD_TYPE.CUSTOM_LOOKUP_RADIOBUTTON,
  FIELD_TYPE.PHONE_NUMBER,
  FIELD_TYPE.EMAIL,
  FIELD_TYPE.DATETIME,
  FIELD_TYPE.USER_TEAM_PICKER,
  FIELD_TYPE.SCANNER,
];

export const RULE_MODULE = {
   VISBILITY: 'visibility',
   DEFAULT_VALUE: 'default_value',
};
