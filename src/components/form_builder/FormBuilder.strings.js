import React from 'react';
import DataSetIcon from 'assets/icons/DataSetIcon';
import { translate } from 'language/config';
import AddNewFormFieldsIcon from '../../assets/icons/add_form_fields_dropdown/AddNewFormFieldsIcon';
import ExistingFormFieldsIcon from '../../assets/icons/add_form_fields_dropdown/ExistingFormFieldsIcon';
import CheckListIcon from '../../assets/icons/form_field_dropdown/CheckListIcon';
import CurrencyIcon from '../../assets/icons/form_field_dropdown/CurrencyIcon';
import DateIcon from '../../assets/icons/form_field_dropdown/DateIcon';
import DropdownListIcon from '../../assets/icons/form_field_dropdown/DropdownListIcon';
import InfoIcon from '../../assets/icons/form_field_dropdown/InfoIcon';
import LargeTextFieldIcon from '../../assets/icons/form_field_dropdown/LargeTextFieldIcon';
import LinkIcon from '../../assets/icons/form_field_dropdown/LinkIcon';
import RadioButtonsIcon from '../../assets/icons/form_field_dropdown/RadioButtonsIcon';
import SmallTextFieldIcon from '../../assets/icons/form_field_dropdown/SmallTextFieldIcon';
import EmailFieldIcon from '../../assets/icons/form_field_dropdown/EmailFieldIcon';
import UploadIcon from '../../assets/icons/form_field_dropdown/UploadIcon';
import UserIcon from '../../assets/icons/UserIcon';
import DataListPropertyPickerIcon from '../../assets/icons/DataListPropertyPickerIcon';
import formBuilderStyles from './FormBuilder.module.scss';
import {
  FIELD_ACCESSIBILITY_TYPES,
  FIELD_LIST_TYPE,
  FIELD_TYPE,
  READ_ONLY_FIELD_TYPE,
  DATE_FIELD_VALIDATION_OPERATORS,
} from '../../utils/constants/form.constant';
import TableIcon from '../../assets/icons/form_field_dropdown/TableIcon';
import DateTimeIcon from '../../assets/icons/form_field_dropdown/DateTimeIcon';
import LookupDropdownIcon from '../../assets/icons/form_field_dropdown/LookupDropdownIcon';
import NumberIcon from '../../assets/icons/form_field_dropdown/NumberIcon';
import YesOrNoIcon from '../../assets/icons/form_field_dropdown/YesOrNoIcon';
import UserPropertyDisplayIcon from '../../assets/icons/form_field_dropdown/UserPropertyDisplayIcon';
import PhoneIcon from '../../assets/icons/PhoneIcon';
import { COLOR_CONSTANTS } from '../../utils/UIConstants';
import ScannerIcon from '../../assets/icons/ScannerIcon';

export const FIELD_TYPES = FIELD_TYPE;

export const READ_ONLY_FIELD_TYPES = READ_ONLY_FIELD_TYPE;

export const OPERAND_TYPE_STRINGS = {
  SINGLE_LINE: {
    LABEL: translate('rule_value_strings.operand_types.single_line.label'),
    PLACEHOLDER: translate('rule_value_strings.operand_types.single_line.placeholder'),
  },
  EMAIL: {
    LABEL: translate('rule_value_strings.operand_types.email.label'),
  },
  NUMBER: {
    LABEL: translate('rule_value_strings.operand_types.number.label'),
  },
  DATE: {
    LABEL: translate('rule_value_strings.operand_types.date.label'),
  },
  DUAL_DATE: {
    LABEL: translate('rule_value_strings.operand_types.dual_date.label'),
  },
  DUAL_DATE_TIME: {
    LABEL: translate('rule_value_strings.operand_types.dual_date_time.label'),
  },
  MULTI_DROPDOWN: {
    LABEL: translate('rule_value_strings.operand_types.multi_dropdown.label'),
  },
  DROPDOWN: {
    LABEL: translate('rule_value_strings.operand_types.dropdown.label'),
  },
  MULTI_NUMBER: {
    LABEL: translate('rule_value_strings.operand_types.multi_number.label'),
  },
};

export const SECTION_TITLE = {
  LABEL: translate('form_validation_schema.form_builder.section_title.label'),
  ID: 'section_name',
  PLACEHOLDER: translate('form_validation_schema.form_builder.section_title.placeholder'),
};

export const SECTION_DESCRIPTION = {
  LABEL: 'Section Description',
  ID: 'section_description',
  PLACEHOLDER: 'Enter Section Description',
};

export const FIELD_NAME = {
  LABEL: 'form_field_strings.field_config.label.label',
  ID: 'field_name',
  PLACEHOLDER: 'Enter label here',
};

export const SECTION_MENU = (t) => [
  {
    label: t('flows.form_field_design.section_menu.move_section_up'),
    value: 0,
  },
  {
    label: t('flows.form_field_design.section_menu.move_section_down'),
    value: 1,
  },
  {
    label: t('flows.form_field_design.section_menu.delete_section'),
    value: 2,
  },
];

export const FF_DROPDOWN_LIST_SECTION_TITLE_TYPE = {
  TABLE: 'FF_DROPDOWN_LIST_SECTION_TITLE_TABLE',
  NON_TABLE: 'FF_DROPDOWN_LIST_SECTION_TITLE',
};

export const CHECKBOX_SELECT_ALL = {
  LABEL: 'Select All',
  VALUE: 'select_all',
};

export const FULL_WIDTH_FIELDS = [FIELD_TYPES.FILE_UPLOAD, FIELD_TYPES.PARAGRAPH, FIELD_TYPE.INFORMATION];
export const FORM_STRINGS = {
  TITLE: 'form_field_strings.dropdown_list_section.title',

  FF_DROPDOWN_LIST_SECTIONS: {
    TEXT_NUMBER_FIELDS: 'form_field_strings.dropdown_list_section.text_number_fields',
    SELECTION_FIELDS: 'form_field_strings.dropdown_list_section.selection_fields',
    DATE_TIME_FIELDS: 'form_field_strings.dropdown_list_section.date_time_fields',
    DATA_LIST_FIELDS: 'form_field_strings.dropdown_list_section.data_list_fields',
    TABLE_FIELDS: 'form_field_strings.dropdown_list_section.table_fields',
    DATA_REFERENCE_FIELDS: 'form_field_strings.dropdown_list_section.data_reference_fields',
    OTHER_FIELDS: 'form_field_strings.dropdown_list_section.other_fields',
  },

  FF_DROPDOWN_LIST_TITLE_ST: 'form_field_strings.dropdown_list_text.single_line',
  FF_DROPDOWN_LIST_SUBTITLE_ST: 'form_field_strings.dropdown_list_text.single_line_text',
  FF_DROPDOWN_LIST_TITLE_NF: 'form_field_strings.dropdown_list_text.number',
  FF_DROPDOWN_LIST_SUBTITLE_NF: 'form_field_strings.dropdown_list_text.number_text',
  FF_DROPDOWN_LIST_TITLE_EF: 'form_field_strings.dropdown_list_text.email',
  FF_DROPDOWN_LIST_SUBTITLE_EF: 'form_field_strings.dropdown_list_text.email_text',
  FF_DROPDOWN_LIST_TITLE_YN: 'form_field_strings.dropdown_list_text.yes_or_no',
  FF_DROPDOWN_LIST_SUBTITLE_YN: 'form_field_strings.dropdown_list_text.yes_or_no_text',
  FF_DROPDOWN_LIST_TITLE_LT: 'form_field_strings.dropdown_list_text.Paragraph',
  FF_DROPDOWN_LIST_SUBTITLE_LT: 'form_field_strings.dropdown_list_text.Paragraph_text',
  FILE_UPLOAD: 'task_content.landing_page_translation.file_upload',
  FF_DROPDOWN_LIST_TITLE_DROPDOWN: 'form_field_strings.dropdown_list_text.dropdown',
  FF_DROPDOWN_LIST_SUBTITLE_DROPDOWN:
  'form_field_strings.dropdown_list_text.dropdown_text',
  FF_DROPDOWN_LIST_TITLE_CUSTOM_LOOKUP_DROPDOWN: 'form_field_strings.dropdown_list_text.custom_dropdown',
  FF_DROPDOWN_LIST_SUBTITLE_CUSTOM_LOOKUP_DROPDOWN:
  'form_field_strings.dropdown_list_text.custom_dropdown_text',
  FF_DROPDOWN_LIST_TITLE_CHECKBOX: 'form_field_strings.dropdown_list_text.Checkbox',
  FF_DROPDOWN_LIST_SUBTITLE_CHECKBOX:
  'form_field_strings.dropdown_list_text.checkbox_text',
  FF_DROPDOWN_LIST_TITLE_RADIO: 'form_field_strings.dropdown_list_text.radio',
  FF_DROPDOWN_LIST_SUBTITLE_RADIO:
  'form_field_strings.dropdown_list_text.radio_text',
  FF_DROPDOWN_LIST_TITLE_DATE: 'form_field_strings.dropdown_list_text.date',
  FF_DROPDOWN_LIST_SUBTITLE_DATE: 'form_field_strings.dropdown_list_text.date_text',
  FF_DROPDOWN_LIST_TITLE_DATE_AND_TIME: 'form_field_strings.dropdown_list_text.date_time',
  FF_DROPDOWN_LIST_SUBTITLE_DATE_AND_TIME: 'form_field_strings.dropdown_list_text.date_time_text',
  FF_DROPDOWN_LIST_TITLE_FU: 'form_field_strings.dropdown_list_text.document',
  FF_DROPDOWN_LIST_SUBTITLE_FU:
  'form_field_strings.dropdown_list_text.document_text',
  FF_DROPDOWN_LIST_TITLE_CURR: 'form_field_strings.dropdown_list_text.currency',
  FF_DROPDOWN_LIST_SUBTITLE_CURR:
  'form_field_strings.dropdown_list_text.currency_text',
  FF_DROPDOWN_LIST_TITLE_TABLE: 'form_field_strings.dropdown_list_text.table',
  FF_DROPDOWN_LIST_TITLE_LINK: 'form_field_strings.dropdown_list_text.link',
  FF_DROPDOWN_LIST_TITLE_INFO: 'form_field_strings.dropdown_list_text.information',
  FF_DROPDOWN_LIST_TITLE_SCANNER: 'form_field_strings.dropdown_list_text.scanner',
  FF_DROPDOWN_LIST_TITLE_DATA_LIST: 'form_field_strings.dropdown_list_text.datalist_selector',
  FF_DROPDOWN_LIST_TITLE_DATA_LIST_PROPERTY_PICKER: 'form_field_strings.dropdown_list_text.datalist_property_picker',
  FF_DROPDOWN_LIST_SUBTITLE_TABLE: 'form_field_strings.dropdown_list_text.table_text',
  FF_DROPDOWN_LIST_SUBTITLE_LINK: 'form_field_strings.dropdown_list_text.link_text',
  FF_DROPDOWN_LIST_SUBTITLE_INFO: 'form_field_strings.dropdown_list_text.information_text',
  FF_DROPDOWN_LIST_SUBTITLE_SCANNER: 'form_field_strings.dropdown_list_text.scanner_subtext',
  FF_DROPDOWN_LIST_TITLE_USER_TEAM_PICKER: 'form_field_strings.dropdown_list_text.user_selector',
  FF_DROPDOWN_LIST_TITLE_USER_PROPERTY_DISPLAY: 'form_field_strings.dropdown_list_text.user_property_picker',
  FF_DROPDOWN_LIST_SUBTITLE_USER_TEAM_PICKER: 'form_field_strings.dropdown_list_text.user_selector_text',
  FF_DROPDOWN_LIST_SUBTITLE_USER_PROPERTY_PICKER: 'form_field_strings.dropdown_list_text.user_property_picker_text',
  FF_DROPDOWN_LIST_SUBTITLE_DATA_LIST: 'form_field_strings.dropdown_list_text.datalist_selector_text',
  FF_DROPDOWN_LIST_SUBTITLE_DATA_LIST_PROPERTY_PICKER: 'form_field_strings.dropdown_list_text.datalist_property_picker_text',
  FF_DROPDOWN_LIST_TITLE_PHONE_NUMBER: 'form_field_strings.dropdown_list_text.phone_number',
  FF_DROPDOWN_LIST_SUBTITLE_PHONE_NUMBER: 'form_field_strings.dropdown_list_text.phone_number_text',
  ADD_FORM_FIELDS: 'flows.form_field_design.add_form_fields_title',
  ADD_FORM_FIELDS_NOTE: 'This is to capture information & ask questions',
  IMPORT_FORM_FILEDS_TITLE: 'Import Existing Form Fields',
  DROP_DOWN_OPTION_1_LABEL: 'Option 1',
  DROP_DOWN_OPTION_2_LABEL: 'Option 2',
  ADD_SECTION_ADD: 'Add',
  ADD_NEW_SECTION: 'flows.form_field_design.add_section_title',
  IMPORT_SECTION: 'flows.form_field_design.import_section',
  IMPORT_FORM_FIELDS: 'flows.form_field_design.import_form_fields',
  SECTION_NAME_PLACEHOLDER: 'Enter Section title ',
  ADD_TABLE: 'Add table',
  ADVANCED_DETAILS: 'Advanced details',
  DROP_DOWN: {
    option_list: [
      {
        value: 1,
        label: 'Option 1',
      },
      {
        value: 2,
        label: 'Option 2',
      },
    ],
  },
  CHECKBOX: {
    option_list: [
      {
        value: CHECKBOX_SELECT_ALL.VALUE,
        label: CHECKBOX_SELECT_ALL.LABEL,
      },
      {
        value: 1,
        label: 'Option 1',
      },
      {
        value: 2,
        label: 'Option 2',
      },
    ],
  },
  YES_NO: {
    option_list: [
      {
        value: true,
        label: 'Yes',
      },
      {
        value: false,
        label: 'No',
      },
    ],
  },
  FIELD_SUGGESTION: {
    ADD_NEW: 'Add new',
    COPY_FROM_EXISTING: 'Or copy from existing',
    SEARCH_INPUT: {
      PLACEHOLDER: 'Search form field',
    },
  },
  IMPORT_FIELDS: {
    BUTTON_SWITCH: {
      option_list: (t = () => {}) => [
        {
          label: t('form_builder_strings.import_intruction.read_only_text'),
          value: FIELD_ACCESSIBILITY_TYPES.READ_ONLY,
        },
        {
          label: t('form_builder_strings.editable_label'),
          value: FIELD_ACCESSIBILITY_TYPES.EDITABLE,
        },
      ],
    },
  },
  IMPORT_TABLE: {
    HEADER: {
      COLUMN_NAME: 'Column Name',
      COLUMN_TYPE: 'Column Type',
      COLUMN_ACCESSBILITY: 'Column Accessiblity',
    },
    FIELD_ACCESSIBILITY: {
      BUTTON_TAB_LIST: [
        { title: 'form_builder_strings.import_intruction.read_only_text' },
        { title: 'form_builder_strings.editable_label' },
      ],
    },
  },
  TABLE: {
    ADD_COLUMN: 'form_builder_strings.add_column',
    ROW_INSTRUCTION: 'form_builder_strings.table_row_instruction',
    MIN_FIELDS_TRANSLATED: 'form_builder_strings.min_table_field',
    MIN_FIELDS: 'must contain at least 1 item', // no need to translate this string as we are using it to compare the default joi validation message
    MIN_FIELDS_ERROR: 'form_builder_strings.min_table_field_error',
    ADD_ROW: 'form_builder_strings.add_row',
  },
};

export const FF_DROPDOWN_MENU = [
  {
    ID: 'add_new_field',
    TITLE: 'Add new',
    ICON: <AddNewFormFieldsIcon />,
  },
  {
    ID: 'existing_form_fields',
    TITLE: 'Import from existing fields',
    ICON: <ExistingFormFieldsIcon />,
  },
  // {
  //   ID: 'existing_table_fields',
  //   TITLE: 'Existing Table Fields',
  //   ICON: <ExistingTableFieldsIcon />,
  // },
];

export const ADD_NEW_FIELD_ID = 'add_new_field';
export const EXISTING_FORM_FIELD_ID = 'existing_form_fields';
export const EXISTING_TABLE_FIELD_ID = 'existing_table_fields';

export const FF_DROPDOWN_LIST = (t) => [
  // TEXT_NUMBER_FIELDS
  {
    ID: FF_DROPDOWN_LIST_SECTION_TITLE_TYPE.NON_TABLE,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SECTIONS.TEXT_NUMBER_FIELDS),
  },
  {
    ID: FIELD_TYPES.SINGLE_LINE,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_ST),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_ST),
    ICON: <SmallTextFieldIcon />,
  },
  {
    ID: FIELD_TYPES.PARAGRAPH,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_LT),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_LT),
    ICON: <LargeTextFieldIcon />,
  },
  {
    ID: FIELD_TYPES.NUMBER,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_NF),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_NF),
    ICON: <NumberIcon />,
  },
  // SELECTION_FIELDS
  {
    ID: FF_DROPDOWN_LIST_SECTION_TITLE_TYPE.NON_TABLE,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SECTIONS.SELECTION_FIELDS),
  },
  {
    ID: FIELD_TYPES.YES_NO,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_YN),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_YN),
    ICON: <YesOrNoIcon />,
  },
  {
    ID: FIELD_TYPES.RADIO_GROUP,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_RADIO),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_RADIO),
    ICON: <RadioButtonsIcon />,
  },
  {
    ID: FIELD_TYPES.DROPDOWN,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_DROPDOWN),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_DROPDOWN),
    ICON: <DropdownListIcon />,
  },
  {
    ID: FIELD_TYPES.CHECKBOX,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_CHECKBOX),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_CHECKBOX),
    ICON: <CheckListIcon />,
  },
  {
    ID: FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_CUSTOM_LOOKUP_DROPDOWN),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_CUSTOM_LOOKUP_DROPDOWN),
    ICON: <LookupDropdownIcon />,
  },
  // DATE_TIME_FIELDS
  {
    ID: FF_DROPDOWN_LIST_SECTION_TITLE_TYPE.NON_TABLE,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SECTIONS.DATE_TIME_FIELDS),
  },
  {
    ID: FIELD_TYPES.DATE,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_DATE),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_DATE),
    ICON: <DateIcon />,
  },
  {
    ID: FIELD_TYPES.DATETIME,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_DATE_AND_TIME),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_DATE_AND_TIME),
    ICON: <DateTimeIcon />,
  },
  // TABLE_FIELDS
  {
    ID: FF_DROPDOWN_LIST_SECTION_TITLE_TYPE.TABLE,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SECTIONS.TABLE_FIELDS),
  },
  {
    ID: FIELD_TYPES.TABLE,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_TABLE),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_TABLE),
    ICON: <TableIcon />,
  },
  // DATA_REFERENCE_FIELDS
  {
    ID: FF_DROPDOWN_LIST_SECTION_TITLE_TYPE.NON_TABLE,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SECTIONS.DATA_REFERENCE_FIELDS),
  },
  {
    ID: FIELD_TYPES.USER_TEAM_PICKER,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_USER_TEAM_PICKER),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_USER_TEAM_PICKER),
    ICON: <UserIcon className={formBuilderStyles.UserIcon} />,
  },
  {
    ID: FIELD_TYPES.USER_PROPERTY_PICKER,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_USER_PROPERTY_DISPLAY),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_USER_PROPERTY_PICKER),
    ICON: <UserPropertyDisplayIcon className={formBuilderStyles.UserIcon} />,
  },
  {
    ID: FIELD_TYPES.DATA_LIST,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_DATA_LIST),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_DATA_LIST),
    ICON: <DataSetIcon fillColor={COLOR_CONSTANTS.GRAY_v2} />,
  },
  {
    ID: FIELD_TYPES.DATA_LIST_PROPERTY_PICKER,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_DATA_LIST_PROPERTY_PICKER),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_DATA_LIST_PROPERTY_PICKER),
    ICON: <DataListPropertyPickerIcon />,
  },
  // OTHER_FIELDS
  {
    ID: FF_DROPDOWN_LIST_SECTION_TITLE_TYPE.NON_TABLE,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SECTIONS.OTHER_FIELDS),
  },
  {
    ID: FIELD_TYPES.FILE_UPLOAD,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_FU),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_FU),
    ICON: <UploadIcon />,
  },
  {
    ID: FIELD_TYPES.EMAIL,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_EF),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_EF),
    ICON: <EmailFieldIcon />,
  },
  {
    ID: FIELD_TYPES.PHONE_NUMBER,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_PHONE_NUMBER),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_PHONE_NUMBER),
    ICON: <PhoneIcon />,
  },
  {
    ID: FIELD_TYPES.CURRENCY,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_CURR),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_CURR),
    ICON: <CurrencyIcon />,
  },
  {
    ID: FIELD_TYPES.LINK,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_LINK),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_LINK),
    ICON: <LinkIcon />,
  },
  {
    ID: FIELD_TYPES.INFORMATION,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_INFO),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_INFO),
    ICON: <InfoIcon />,
  },
  {
    ID: FIELD_TYPES.SCANNER,
    TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_TITLE_SCANNER),
    SUB_TITLE: t(FORM_STRINGS.FF_DROPDOWN_LIST_SUBTITLE_SCANNER),
    ICON: <ScannerIcon />,
  },
];
export const DATE_FIELDS_OPERATOR_VALUES = Object.freeze({
  LESS_THAN: 'lesser_than',
  LESS_THAN_OR_EQUAL_TO: 'lesser_than_or_equal_to',
  GREATER_THAN: 'greater_than',
  GREATER_THAN_OR_EQUAL_TO: 'greater_than_or_equal_to',
  BETWEEN: 'between',
});
export const FIELD_CONFIG = (t = () => {}) => {
  return {

  HEADER_TOOLTIP: t('form_field_strings.field_config.header_tooltip'),
  BASIC_CONFIG: {
    LABEL: {
      LABEL: t('form_field_strings.field_config.label.label'),
      ID: 'label',
      PLACEHOLDER: t('form_field_strings.field_config.label.placeholder'),
    },
    TABLE_FIELD: {
      LABEL: t('form_field_strings.field_config.table_field.label'),
      ID: 'label',
      PLACEHOLDER: t('form_field_strings.field_config.table_field.placeholder'),
    },
    REFERENCE_NAME: {
      LABEL: t('form_field_strings.field_config.reference_name.label'),
      ID: 'reference_name',
      PLACEHOLDER: t('form_field_strings.field_config.reference_name.placeholder'),
    },
    DEFAULT_VALUE: {
      LABEL: t('form_field_strings.field_config.default_value.label'),
      ID: 'default_value',
      PLACEHOLDER: t('form_field_strings.field_config.default_value.placeholder'),
    },
    DEFAULT_CURRENCY_TYPE: {
      LABEL: t('form_field_strings.field_config.default_currency_type.label'),
      ID: 'default_currency_type',
      PLACEHOLDER: t('form_field_strings.field_config.default_currency_type.placeholder'),
    },
    DEFAULT_PHONE_NUMBER_TYPE: {
      LABEL: t('form_field_strings.field_config.default_phone_number_type.label'),
      ID: 'default_phone_number',
      PLACEHOLDER: t('form_field_strings.field_config.default_phone_number_type.placeholder'),
    },
    COLUMN_NAME: {
      LABEL: t('form_field_strings.field_config.column_name.label'),
      ID: 'column_name',
      PLACEHOLDER: t('form_field_strings.field_config.column_name.placeholder'),
    },
    COLUMN_TYPE: {
      LABEL: t('form_field_strings.field_config.column_type.label'),
      ID: 'column_type',
      PLACEHOLDER: t('form_field_strings.field_config.column_type.placeholder'),
    },
    REQUIRED:
    {
      label: t('form_field_strings.field_config.required.label'),
      value: 1,
      help_text: false,
      id: 'required',
      OPTION_LIST: [
        {
          value: true,
          label: t('form_field_strings.field_config.required.yes'),
        },
        {
          value: false,
          label: t('form_field_strings.field_config.required.no'),
        },
      ],
    },

    DEFAULT_VALUE_RULE: [
      { label: t('form_field_strings.field_config.default_value_rule.label'), value: 1 },
    ],
    READ_ONLY: [
      {
        label: t('form_field_strings.field_config.read_only.label'),
        value: 1,
        help_text: t('form_field_strings.field_config.read_only.help_text'),
        id: 'readonly',
      },
    ],
    READ_ONLY_HELPER_TEXT_ID: 'read-only-field-checkbox',
    VALUES_DD: {
      PLACEHOLDER: t('form_field_strings.field_config.values_dd.placeholder'),
      ID: 'values_dd',
      LABEL: t('form_field_strings.field_config.values_dd.label'),
    },
    VALUES_LOOKUP: {
      PLACEHOLDER: t('form_field_strings.field_config.values_lookup.placeholder'),
      ID: 'values_lookup',
      LABEL: t('form_field_strings.field_config.values_lookup.label'),
    },
    VALUES_RB: {
      PLACEHOLDER: t('form_field_strings.field_config.values_rb.placeholder'),
      ID: 'values_rb',
      LABEL: t('form_field_strings.field_config.values_rb.label'),
    },
    DEFAULT_DD_VALUE: {
      PLACEHOLDER: t('form_field_strings.field_config.default_dd_value.placeholder'),
      ID: 'deafult_dd',
      LABEL: t('form_field_strings.field_config.default_dd_value.label'),
    },
    DEFAULT_LOOKUP_VALUE: {
      PLACEHOLDER: t('form_field_strings.field_config.default_lookup_value.placeholder'),
      ID: 'deafult_lookup',
      LABEL: t('form_field_strings.field_config.default_lookup_value.label'),
    },
    DEFAULT_RB_VALUE: {
      PLACEHOLDER: t('form_field_strings.field_config.default_rb_value.placeholder'),
      ID: 'deafult_rb',
      LABEL: t('form_field_strings.field_config.default_rb_value.label'),
    },
    DD_VALUES_INPUT: {
      PLACEHOLDER: t('form_field_strings.field_config.dd_value_input.placeholder'),
      ID: 'dd_values_input',
      LABEL: t('form_field_strings.field_config.dd_value_input.label'),
      INSTRUCTION: t('form_field_strings.field_config.dd_value_input.instruction'),
    },
    LOOKUP_VALUES_INPUT: {
      PLACEHOLDER: t('form_field_strings.field_config.lookup_values_input.placeholder'),
      ID: 'lookup_values_input',
      LABEL: t('form_field_strings.field_config.lookup_values_input.label'),
    },
    LINK_INPUT: {
      PLACEHOLDER: t('form_field_strings.field_config.link_input.placeholder'),
      ID: 'link_input',
      LABEL: t('form_field_strings.field_config.link_input.label'),
    },
    DEFAULT_LINK_URL: {
      PLACEHOLDER: t('form_field_strings.field_config.default_link_url.placeholder'),
      ID: 'default_linkURL',
      LABEL: t('form_field_strings.field_config.default_link_url.label'),
    },
    DEFAULT_LINK_TEXT: {
      PLACEHOLDER: t('form_field_strings.field_config.default_link_text.placeholder'),
      ID: 'default_linkText',
      LABEL: t('form_field_strings.field_config.default_link_text.label'),
    },

    LINK_TEXT: {
      PLACEHOLDER: t('form_field_strings.field_config.link_text.placeholder'),
      ID: 'link_text',
      LABEL: t('form_field_strings.field_config.link_text.label'),
    },
    LINK_URL: {
      PLACEHOLDER: t('form_field_strings.field_config.link_url.placeholder'),
      ID: 'link_url',
      LABEL: t('form_field_strings.field_config.link_url.label'),
    },
    ITEMS_LIST_CB: {
      PLACEHOLDER: t('form_field_strings.field_config.items_list_cb.placeholder'),
      ID: 'values_dd',
      LABEL: t('form_field_strings.field_config.items_list_cb.label'),
    },
    CB_VALUES: {
      PLACEHOLDER: t('form_field_strings.field_config.cb_values.placeholder'),
      ID: 'values_cb',
      LABEL: t('form_field_strings.field_config.cb_values.label'),
    },
    DEFAULT_CB_VALUE: {
      PLACEHOLDER: t('form_field_strings.field_config.default_cb_values.placeholder'),
      ID: 'deafult_dd',
      LABEL: t('form_field_strings.field_config.default_cb_values.label'),
    },
    DEFAULT_DATE_VALUE: {
      PLACEHOLDER: t('form_field_strings.field_config.default_date_value.placeholder'),
      ID: 'deafult_date',
      LABEL: t('form_field_strings.field_config.default_date_value.label'),
    },
    DEFAULT_TIME_VALUE: {
      ID: 'deafult_time',
      LABEL: t('form_field_strings.field_config.default_time_value.label'),
    },
    CURRENCY_TYPE_DD: {
      PLACEHOLDER: t('form_field_strings.field_config.currency_type_dd.placeholder'),
      ID: 'currency_type',
      LABEL: t('form_field_strings.field_config.currency_type_dd.label'),
    },
    DEFAULT_BOOLEAN_RADIO: {
      LABEL: t('form_field_strings.field_config.default_boolean_radio.label'),
      OPTION_LIST: [
        {
          value: true,
          label: t('form_field_strings.field_config.default_boolean_radio.yes'),
        },
        {
          value: false,
          label: t('form_field_strings.field_config.default_boolean_radio.no'),
        },
      ],
    },
    YES_NO_QUESTION: t('form_field_strings.field_config.question.label'),
    DEFAULT_BOOLEAN_VALUE: {
      LABEL: t('form_field_strings.field_config.default_boolean_value.label'),
      ID: 'default_value',
      VALUE: 'Yes/No',
    },
    DEFAULT_VALUE_CB_ID: 'default_value_cb',
  },
  VISIBILITY_CONFIG: {
    TITLE: t('form_field_strings.visibility_constant.title'),
    CONDITION_BASED_VISIBILITY: t('form_field_strings.visibility_constant.condition_based'),
    SHOW_HIDE: [
      {
        label: t('form_field_strings.visibility_constant.show_hide.label'),
        value: 1,
        help_text:
        t('form_field_strings.visibility_constant.show_hide.help_text'),
        id: 'visibility_config_helper_tooltip',
      },
    ],
    WHEN: {
      LABEL: t('form_field_strings.visibility_constant.when.label'),
      ID: 'visibility_when',
      PLACEHOLDER: t('form_field_strings.visibility_constant.when.placeholder'),
    },
    OPERATOR: {
      LABEL: t('form_field_strings.visibility_constant.operator.label'),
      ID: 'visibility_operator',
      PLACEHOLDER: t('form_field_strings.visibility_constant.operator.placeholder'),
    },
    R_FIELD: {
      LABEL: t('form_field_strings.visibility_constant.r_field.label'),
      ID: 'visibility_r_field',
      PLACEHOLDER: t('form_field_strings.visibility_constant.r_field.placeholder'),
    },
    HIDE_DISABLE: {
      id: 'is_visbile',
      OPTION_LIST: [
        {
          value: true,
          label: t('form_field_strings.visibility_constant.hide_label.label_1'),
        },
        {
          value: false,
          label: t('form_field_strings.visibility_constant.hide_label.label_2'),
        },
      ],
    },
    HIDE_VALUE_IF_NULL: {
      LABEL: t('form_field_strings.visibility_constant.hide_visibility.label'),
      id: 'visibility_config_show_value_if_exist',
      OPTION_LIST: [
        {
          value: false,
          label: t('form_field_strings.visibility_constant.hide_value_if_null.label_1'),
        },
        {
          value: true,
          label: t('form_field_strings.visibility_constant.hide_value_if_null.label_2'),
        },
      ],
    },
    INSTRUCTION: t('form_field_strings.visibility_constant.instruction'),
  },
  OTHER_CONFIG: {
    TITLE: t('form_field_strings.other_config.title'),
    PLACEHOLDER_VALUE: {
      LABEL: t('form_field_strings.other_config.placeholder_value.label'),
      ID: 'place_holder',
      PLACEHOLDER: t('form_field_strings.other_config.placeholder_value.placeholder'),
      HELPER_TOOLTIP: t('form_field_strings.other_config.placeholder_value.helper_tooltip'),
    },
    INSTRUCTION: {
      LABEL: t('form_field_strings.other_config.instruction.label'),
      ID: 'instructions',
      PLACEHOLDER: t('form_field_strings.other_config.instruction.placeholder'),
      HELPER_TOOLTIP: t('form_field_strings.other_config.instruction.helper_tooltip'),
    },
    HELPER_TOOL_TIP: {
      LABEL: t('form_field_strings.other_config.helper_tool_tip.label'),
      ID: 'help_text',
      PLACEHOLDER: t('form_field_strings.other_config.helper_tool_tip.placeholder'),
      HELPER_TOOLTIP: t('form_field_strings.other_config.helper_tool_tip.helper_tooltip'),
    },
    VALUE_FORMATER: {
      ID: 'VALUE_FORMATER',
      OPTION_LIST: [{ label: t('form_field_strings.other_config.value_formator.label'), value: 1 }],
    },
    USER_SELECTOR_DEFAULT_VALUE: {
      ID: 'USER_SELECTOR_DEFAULT_VALUE',
      OPTION_LIST: [
      { id: 'created_by', label: t('form_field_strings.other_config.user_selector_default_value.label_1'), value: 'created_by' },
      { id: 'last_updated_by', label: t('form_field_strings.other_config.user_selector_default_value.label_2'), value: 'last_updated_by' },
      { id: 'logged_in_user', label: t('form_field_strings.other_config.user_selector_default_value.label_3'), value: 'logged_in_user' },
      ],
    },
  },
  ADVANCED_TECHNICAL_CONFIG: {
    TITLE: t('form_field_strings.advanced_technical_config.title'),
    EDIT_CONFIGURATION: t('form_field_strings.advanced_technical_config.edit_configuration'),
    CANCEL_EDIT: t('form_field_strings.advanced_technical_config.cancel_edit'),
    CREATE_NEW_FLOW_FIELD: t('form_field_strings.advanced_technical_config.enter_reference_name'),
    CREATE_NEW_INSTRUCTION: t('form_field_strings.advanced_technical_config.instruction'),
    CREATE: t('form_field_strings.advanced_technical_config.create'),
    SEARCH_VALUE: t('form_field_strings.advanced_technical_config.search_value'),
    CHOOSE_VALUE: t('form_field_strings.advanced_technical_config.choose_value'),
    SELECTED_VALUE: t('form_field_strings.advanced_technical_config.selected_value'),
    INPUT_VALUE_FROM: t('form_field_strings.advanced_technical_config.input_value_from'),
    INPUT_VALUE_FROM_ID: 'value_from',
    CHOOSE_INPUT_VALUE_FROM_ID: 'choose_value_from',
    SAVE_VALUE_INTO: t('form_field_strings.advanced_technical_config.save_value_into'),
    SAVE_VALUE_INTO_ID: 'value_into',
    CHOOSE_SAVE_VALUE_INTO_ID: 'choose_value_into',
    LABEL: t('form_field_strings.advanced_technical_config.label'),
    INPUT_ID: 'input_value_from_save_value_into',
    FLOW_FIELD: {
      ID: 'flow_field',
      PLACEHOLDER: t('form_field_strings.advanced_technical_config.flow_field.placeholder'),
    },
    FLOW_TABLE_COLUMN_LABEL: t('form_field_strings.advanced_technical_config.flow_column_label'),
    FLOW_FIELD_LABEL: t('form_field_strings.advanced_technical_config.flow_label'),
    FLOW_FIELD_INSTRUCTION: t('form_field_strings.advanced_technical_config.flow_instruction'),
    DATALIST_TABLE_COLUMN_LABEL: t('form_field_strings.advanced_technical_config.datalist_column_label'),
    DATALIST_FIELD_LABEL: t('form_field_strings.advanced_technical_config.datalist_label'),
    DATALIST_FIELD_INSTRUCTION: t('form_field_strings.advanced_technical_config.datalist_instruction'),
    EDIT_CONFIG_LABEL: t('form_field_strings.advanced_technical_config.edit_config_label'),
    EDIT_CONFIG_OPTIONS: [
      {
        label: t('form_field_strings.advanced_technical_config.yes'),
        value: true,
      },
      {
        label: t('form_field_strings.advanced_technical_config.no'),
        value: false,
      },
    ],
    CREATE_NEW_REFERENCE: t('form_field_strings.advanced_technical_config.create_new_reference'),
    CREATE_NEW_REFERENCE_PLACEHOLDER: t('form_field_strings.advanced_technical_config.create_new_reference_placeholder'),
  },
  VALIDATION_CONFIG: {
    TITLE: t('form_field_strings.validation_config.title'),
    YET_TO_BE_ADDED: t('form_field_strings.validation_config.yet_to_be_added'),
    MINIMUM_CHARCTERS: {
      LABEL: t('form_field_strings.validation_config.minimum_characters.label'),
      ID: 'minumum_characters',
      PLACEHOLDER: t('form_field_strings.validation_config.minimum_characters.placeholder'),
    },
    MAXIMUM_CHARCTERS: {
      LABEL: t('form_field_strings.validation_config.maximum_characters.label'),
      ID: 'maximum_characters',
      PLACEHOLDER: t('form_field_strings.validation_config.maximum_characters.placeholder'),
    },
    MINIMUM_VALUE: {
      LABEL: t('form_field_strings.validation_config.minimum_value.label'),
      ID: 'minumum_value',
      PLACEHOLDER: t('form_field_strings.validation_config.minimum_value.placeholder'),
    },
    MAXIMUM_VALUE: {
      LABEL: t('form_field_strings.validation_config.maximum_value.label'),
      ID: 'maximum_value',
      PLACEHOLDER: t('form_field_strings.validation_config.maximum_value.placeholder'),
    },
    MINIMUM_COUNT: {
      LABEL: t('form_field_strings.validation_config.minimum_count.label'),
      ID: 'minimum_count',
      PLACEHOLDER: t('form_field_strings.validation_config.minimum_count.placeholder'),
    },
    MAXIMUM_COUNT_DATA_LIST: {
      LABEL: t('form_field_strings.validation_config.maximum_count_datalist.label'),
      ID: 'maximum_selection',
      PLACEHOLDER: t('form_field_strings.validation_config.maximum_count_datalist.placeholder'),
    },
    ALLOW_MULTIPLE_DATA_LIST: {
      LABEL: t('form_field_strings.validation_config.allow_multiple_datalist.label'),
      ID: 'allow_multiple',
      OPTION_LIST: [
        {
          label: t('form_field_strings.validation_config.allow_multiple_datalist.option_list.label'),
          value: 1,
          id: 'allow_multiple_value_selection',
        },
      ],
    },
    LIMIT_DATALIST: {
      ID: 'enable_datalist_filter',
      OPTION_LIST: [{ label: t('form_field_strings.validation_config.limit_datalist.label'), value: 1 }],
      IS_DATALIST_FILTER: 'is_datalist_filter',
      FILTER_FIELDS: {
        ID: 'filter_fields',
        FIELD: {
          ID: 'field_uuid',
          LABEL: t('form_field_strings.validation_config.limit_datalist.filter_fields.label'),
          NO_FIELDS_AVAILABLE: t('form_field_strings.validation_config.limit_datalist.filter_fields.no_fields_available'),
          ALLOWED_FIELD_TYPES: {
            inputFields: [
              FIELD_TYPES.NUMBER,
              // FIELD_TYPES.CURRENCY,
              FIELD_TYPES.DATE,
              FIELD_TYPES.DATETIME,
            ],
            selectionFields: [
              FIELD_TYPES.YES_NO,
              FIELD_TYPES.CHECKBOX,
              FIELD_TYPES.DROPDOWN,
              FIELD_TYPES.RADIO_GROUP,
              FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
            ],
          },
        },
        FIELD_TYPE: {
          id: 'field_type',
          LABEL: 'FIELD_TYPE',
        },
        OPERATORS: {
          id: 'operator',
          LABEL: t('form_field_strings.validation_config.limit_datalist.filter_fields.operator_label'),
          NO_OPERATORS_AVAILABLE: t('form_field_strings.validation_config.limit_datalist.filter_fields.no_operator'),
          OPTION_LIST: [
            {
              label: '>',
              value: 'greater_than',
            },
            {
              label: '<',
              value: 'lesser_than',
            },
            {
              label: '>=',
              value: 'greater_than_or_equal_to',
            },
            {
              label: '<=',
              value: 'lesser_than_or_equal_to',
            },
            {
              label: '=',
              value: 'equal_to',
            },
          ],
        },
        FIELD_VALUE: {
          ID: 'field_value',
          LABEL: t('form_field_strings.validation_config.limit_datalist.filter_fields.field_value_label'),
          NO_VALUES_FOUND: t('form_field_strings.validation_config.limit_datalist.filter_fields.no_values_found'),
        },
      },
      CHANGE_DATA: 'change_data',
    },
    MAXIMUM_COUNT: {
      LABEL: t('form_field_strings.validation_config.maximum_count.label'),
      ID: 'maximum_count',
      PLACEHOLDER: t('form_field_strings.validation_config.maximum_count.placeholder'),
    },
    ALLOWED_MINIMUM: {
      LABEL: t('form_field_strings.validation_config.allowed_minimum.label'),
      ID: 'allowed_minimum',
      PLACEHOLDER: t('form_field_strings.validation_config.allowed_minimum.placeholder'),
    },
    ALLOW_MULTIPLE_LINKS: {
      LABEL: t('form_field_strings.validation_config.allow_multiple_link.label'),
      ID: 'is_multiple',
      OPTION_LIST: [
        {
          label: t('form_field_strings.validation_config.allow_multiple_link.option_list.label'),
          value: 1,
          help_text: t('form_field_strings.validation_config.allow_multiple_link.option_list.help_text'),
          id: 'multiple_links',
        },
      ],
    },

    ALLOWED_MAXIMUM: {
      LABEL: t('form_field_strings.validation_config.allowed_maximum.label'),
      ID: 'allowed_maximum',
      PLACEHOLDER: t('form_field_strings.validation_config.allowed_maximum.placeholder'),
    },
    MAXIMUM_FILE_SIZE: {
      LABEL: t('form_field_strings.validation_config.maximum_file_size.label'),
      ID: 'maximum_file_size',
      PLACEHOLDER: t('form_field_strings.validation_config.maximum_file_size.placeholder'),
      SUFFIX: t('form_field_strings.validation_config.maximum_file_size.suffix'),
    },
    ALLOWED_FILE_EXTENSIONS: {
      LABEL: t('form_field_strings.validation_config.allowed_file_extension.label'),
      ID: 'allowed_file_extensions',
      PLACEHOLDER: t('form_field_strings.validation_config.allowed_file_extension.placeholder'),
    },
    MINIMUM_FILE_COUNT: {
      LABEL: t('form_field_strings.validation_config.minimum_file_count.label'),
      ID: 'minimum_count',
      PLACEHOLDER: t('form_field_strings.validation_config.minimum_file_count.placeholder'),
    },
    MAXIMUM_FILE_COUNT: {
      LABEL: t('form_field_strings.validation_config.maximum_file_count.label'),
      ID: 'maximum_count',
      PLACEHOLDER: t('form_field_strings.validation_config.maximum_file_count.placeholder'),
    },
    ALLOW_MULTIPLE_FILES: {
      LABEL: t('form_field_strings.validation_config.allow_miltiple_files.label'),
      ID: 'is_multiple',
      OPTION_LIST: [
        {
          label: t('form_field_strings.validation_config.allow_miltiple_files.option_list.label'),
          value: 1,
          id: 'is_multiple',
        },
      ],
    },
    ALLOWED_CURRENCY_TYPES: {
      LABEL: t('form_field_strings.validation_config.allowed_currency_types.label'),
      ID: 'allowed_currency_types',
      PLACEHOLDER: t('form_field_strings.validation_config.allowed_currency_types.placeholder'),
    },
    DEFAULT_CURRENCY_TYPE: {
      LABEL: t('form_field_strings.validation_config.default_currency_type.label'),
      ID: 'default_currency_type',
    },
    ADDITIONAL_CHARACTERS: {
      ID: 'allowed_special_characters',
      PLACEHOLDER: t('form_field_strings.validation_config.additional_characters.placeholder'),
    },

    ALLOWED_DECIMAL_POINTS: {
      LABEL: t('form_field_strings.validation_config.allowed_decimal_points.label '),
      ID: 'allowed_decimal_points',
      PLACEHOLDER: t('form_field_strings.validation_config.allowed_decimal_points.placeholder'),
    },
    ALLOW_SPECIAL_CHARACTERS: {
      OPTION_LIST: [{ label: t('form_field_strings.validation_config.allowed_special_characters.label'), value: 1 }],
      ID: 'allow_spl_char',
    },
    ALLOW_ZERO: {
      OPTION_LIST: [{ label: t('form_field_strings.validation_config.allow_zero.label'), value: 1 }],
      ID: 'allow_zero',
    },
    ALLOW_NEGATIVE_VALUE: {
      OPTION_LIST: [{ label: t('form_field_strings.validation_config.allow_negative_value.label'), value: 1 }],
      ID: 'allow_negative_numbers',
    },
    ALLOW_DECIMAL: {
      OPTION_LIST: [{ label: t('form_field_strings.validation_config.allow_decimal.label'), value: 1 }],
      ID: 'allow_decimal',
    },
    DATE_VALIDATIONS: {
      NO_LIMITS: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.no_limits.label'), value: 'no_limit' }],
        ID: 'accept_all_dates',
        VALUE: 'no_limit',
      },
      ALLOW_FUTURE: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_future.label'), value: 'future' }],
        ID: 'allow_future_dates',
        VALUE: 'future',
      },
      ALLOW_FUTURE_ALL: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_future_all.label'), value: 'all_future' }],
        ID: 'future_all',
        VALUE: 'all_future',
      },
      ALLOW_FUTURE_AFTER: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.Allow_future_after.label'), value: 'after' }],
        ID: 'future_after_next',
        VALUE: 'after',
        INPUT_ID: 'future_after_day',
        PLACEHOLDER: t('form_field_strings.validation_config.date_validation.Allow_future_after.placeholder'),
      },
      ALLOW_FUTURE_NEXT: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_future_next.label'), value: 'next' }],
        ID: 'future_next',
        VALUE: 'next',
        INPUT_ID: 'future_next_day',
        PLACEHOLDER: t('form_field_strings.validation_config.date_validation.allow_future_next.placeholder'),
      },
      ALLOW_FUTURE_BETWEEN: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_future_between.label'), value: 'between' }],
        ID: 'future_between',
        VALUE: 'between',
        INPUT_ID_1: 'future_between_start_day',
        INPUT_ID_2: 'future_between_end_day',
        PLACEHOLDER_1: t('form_field_strings.validation_config.date_validation.allow_future_between.placeholder_1'),
        PLACEHOLDER_2: t('form_field_strings.validation_config.date_validation.allow_future_between.placeholder_2'),
      },
      ALLOW_PAST: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_past.label'), value: 'past' }],
        ID: 'allow_past_dates',
        VALUE: 'past',
      },
      ALLOW_PAST_ALL: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_past_all.label'), value: 'all_past' }],
        ID: 'past_all',
        VALUE: 'all_past',
      },
      ALLOW_PAST_LAST: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_past_last.label'), value: 'last' }],
        ID: 'past_last',
        VALUE: 'last',
        INPUT_ID: 'past_last_day',
        PLACEHOLDER: 'form_field_strings.validation_config.date_validation.allow_past_last.placeholder',
      },
      ALLOW_PAST_BEFORE: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_past_before.label'), value: 'before' }],
        ID: 'past_before',
        VALUE: 'before',
        INPUT_ID: 'past_before_day',
        PLACEHOLDER: t('form_field_strings.validation_config.date_validation.allow_past_before.placeholder_1'),
      },
      ALLOW_PAST_BETWEEN: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_past_between.label'), value: 'between' }],
        ID: 'past_between',
        VALUE: 'between',
        INPUT_ID_1: 'past_between_start_day',
        INPUT_ID_2: 'past_between_end_day',
        PLACEHOLDER_1: t('form_field_strings.validation_config.date_validation.allow_past_between.placeholder_1'),
        PLACEHOLDER_2: t('form_field_strings.validation_config.date_validation.allow_past_between.placeholder_2'),
      },
      ALLOW_ONLY_TODAY: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_only_today.label'), value: 'today_only' }],
        ID: 'today_only',
        VALUE: 'today_only',
      },
      ALLOW_FIXED_RANGE: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_fixed_range.label'), value: 'date' }],
        ID: 'date',
        VALUE: 'date',
      },
      ALLOW_DATE_FIELDS: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_date_fields.label'), value: 'form_field' }],
        ID: 'form_field',
        VALUE: 'form_field',
      },
      DATE_FIELDS_OPERATORS: {
        SINGLE_FIELDS_OPTION_LIST: [
          { label: '>', value: DATE_FIELDS_OPERATOR_VALUES.GREATER_THAN },
          { label: '<', value: DATE_FIELDS_OPERATOR_VALUES.LESS_THAN },
          { label: '>=', value: DATE_FIELDS_OPERATOR_VALUES.GREATER_THAN_OR_EQUAL_TO },
          { label: '<=', value: DATE_FIELDS_OPERATOR_VALUES.LESS_THAN_OR_EQUAL_TO },
        ],
        DUAL_FIELDS_OPTION_LIST: [
          { label: t('form_field_strings.validation_config.date_validation.date_field_operators.label'), value: DATE_FIELDS_OPERATOR_VALUES.BETWEEN },
        ],
        ID: 'operator',
        PLACEHOLDER: t('form_field_strings.validation_config.date_validation.date_field_operators.placeholder'),
      },
      DATE_FIELDS_OPERAND_1: {
        ID: 'first_field_uuid',
        PLACEHOLDER: t('form_field_strings.validation_config.date_validation.date_field_operand_1.placeholder'),
        LABEL_1: t('form_field_strings.validation_config.date_validation.date_field_operand_1.label_1'),
        LABEL_2: t('form_field_strings.validation_config.date_validation.date_field_operand_1.label_2'),
      },
      DATE_FIELDS_OPERAND_2: {
        ID: 'second_field_uuid',
        PLACEHOLDER: t('form_field_strings.validation_config.date_validation.date_field_operand_2.placeholder'),
        LABEL: t('form_field_strings.validation_config.date_validation.date_field_operand_2.label'),
      },
      ALLOW_FIXED_RANGE_OPTIONS: {
        AFTER: 'after',
        BEFORE: 'before',
        BETWEEN: 'between',
      },
      OTHER_PREFERENCES: {
        LABEL: t('form_field_strings.validation_config.date_validation.other_preferences'),
      },
      ALLOW_TODAY: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_today.label'), value: 'allow_today' }],
        ID: 'allow_today',
      },
      ALLOW_WORKING_DAY: {
        OPTION_LIST: [{ label: t('form_field_strings.validation_config.date_validation.allow_working_day.label'), value: 'allow_working_day' }],
        ID: 'allow_working_day',
        SUBTITLE: t('form_field_strings.validation_config.date_validation.allow_working_day.subtitle'),
      },
      DATE_VALIDATIONS_OPERATOR: {
        LABEL: t('form_field_strings.validation_config.date_validation.date_validation_operator.label'),
        ID: 'operator',
        PLACEHOLDER: t('form_field_strings.validation_config.date_validation.date_validation_operator.placeholder'),
      },
      DATE_VALIDATION_VALUE: {
        LABEL: t('form_field_strings.validation_config.date_validation.allow_date_fields.label'),
        ID: 'value',
        SUFFIX: t('form_field_strings.validation_config.date_validation.allow_date_fields.placeholder'),
      },
      DATE_RANGE_MIN: {
        LABEL: t('form_field_strings.validation_config.date_validation.date_range_min.label'),
        ID: 'minimum_value',
        SUFFIX: t('form_field_strings.validation_config.date_validation.date_range_min.suffix'),
      },
      DATE_RANGE_MAX: {
        LABEL: t('form_field_strings.validation_config.date_validation.date_range_max.label'),
        ID: 'maximum_value',
        SUFFIX: t('form_field_strings.validation_config.date_validation.date_range_max.suffix'),
      },
      START_DATE: {
        LABEL: t('form_field_strings.validation_config.date_validation.start_date.label'),
        ID: 'start_date',
      },
      END_DATE: {
        LABEL: t('form_field_strings.validation_config.date_validation.end_date.label'),
        ID: 'end_date',
      },
    },
    DATE_VALIDATIONS_OPTION_LIST_FUTURE: [
      {
        label: t('form_field_strings.validation_config.date_validation_future.after'),
        value: DATE_FIELD_VALIDATION_OPERATORS.GREATER_THAN,
      },
      {
        label: t('form_field_strings.validation_config.date_validation_future.next'),
        value: DATE_FIELD_VALIDATION_OPERATORS.LESS_THAN,
      },
      {
        label: t('form_field_strings.validation_config.date_validation_future.from_next'),
        value: DATE_FIELD_VALIDATION_OPERATORS.BETWEEN,
      },
    ],
    DATE_VALIDATIONS_OPTION_LIST_PAST: [
      {
        label: t('form_field_strings.validation_config.date_validation_past.last'),
        value: DATE_FIELD_VALIDATION_OPERATORS.GREATER_THAN,
      },
      {
        label: t('form_field_strings.validation_config.date_validation_past.before_last'),
        value: DATE_FIELD_VALIDATION_OPERATORS.LESS_THAN,
      },
      {
        label: t('form_field_strings.validation_config.date_validation_past.from_last'),
        value: DATE_FIELD_VALIDATION_OPERATORS.BETWEEN,
      },
    ],
    ALLOW_ADDITIONAL_CHARACTERS: {
      OPTION_LIST: [{ label: t('form_field_strings.validation_config.allow_additional_characters.label'), value: 1 }],
      ID: 'allow_additional_character',
    },
    ALLOW_TEAMS: {
      OPTION_LIST: [{ label: t('form_field_strings.validation_config.allow_only_teams.label'), value: 1 }],
      ID: 'allow_teams',
    },
    ALLOW_USERS: {
      OPTION_LIST: [{ label: t('form_field_strings.validation_config.allow_only_users.label'), value: 1 }],
      ID: 'allow_users',
    },
    IS_RESTRICTED: {
      OPTION_LIST: [{ label: t('form_field_strings.validation_config.is_restricted.label'), value: 1 }],
      ID: 'is_restricted',
    },
    ALLOW_MAXIMUM_USER: {
      OPTION_LIST: [{ label: t('form_field_strings.validation_config.allowed_maximum_user.label'), value: 1 }],
      ID: 'allow_maximum_selection',
    },
    MAX_USER_SELECTION: {
      LABEL: t('form_field_strings.validation_config.max_user_selection.label'),
      PLACEHOLDER: t('form_field_strings.validation_config.max_user_selection.placeholder'),
      ID: 'maximum_selection',
    },
    ALLOW_MINIMUM_USER: {
      OPTION_LIST: [{ label: t('form_field_strings.validation_config.allow_minimum_user.label'), value: 1 }],
      ID: 'allow_minimum_selection',
    },
    MIN_USER_SELECTION: {
      LABEL: t('form_field_strings.validation_config.minimim_user_selection.label'),
      PLACEHOLDER: t('form_field_strings.validation_config.minimim_user_selection.placeholder'),
      ID: 'minimum_selection',
    },
    RESTRICTED_USER_TEAM: {
      PLACEHOLDER: t('form_field_strings.validation_config.restricted_user_team.placeholder'),
      ID: 'restricted_user_team',
    },
  },
};
};

export const FIELD_CONFIGS = {
  BASIC_CONFIG: {
    TITLE: 'form_field_strings.field_config_title.basic',
    TAB_INDEX: 1,
  },
  VALIDATION: {
    TITLE: 'form_field_strings.field_config_title.validation',
    TAB_INDEX: 2,
  },
  VISIBILITY: {
    TITLE: 'form_field_strings.field_config_title.visibility',
    TAB_INDEX: 3,
  },
  OTHER_SETTINGS: {
    TITLE: 'form_field_strings.field_config_title.other_settings',
    TAB_INDEX: 4,
  },
};

export const FIELD_LIST_CONFIG = (translate = () => {}) => {
  return {
  TABLE: {
    BASIC_CONFIG: {
      TABLE_NAME: {
        // ID: 'table_name',
        LABEL: translate('form_field_strings.field_list_config.basic_config.table_name.label'),
        PLACEHOLDER: translate('form_field_strings.field_list_config.basic_config.table_name.placeholder'),
      },
      TABLE_REFERENCE_NAME: {
        // ID: 'table_reference_name',
        LABEL: translate('form_field_strings.field_list_config.basic_config.table_reference_name.label'),
        PLACEHOLDER: translate('form_field_strings.field_list_config.basic_config.table_reference_name.placeholder'),
      },
      ALLOW_NEW_ROW: {
        OPTION_LIST: [{ label: translate('form_field_strings.field_list_config.basic_config.allow_new_row.label'), value: 1 }],
      },
      MAKE_TABLE_READ_ONLY: {
        OPTION_LIST: [{ label: translate('form_field_strings.field_list_config.basic_config.make_table_row_readonly.placeholder'), value: 1 }],
      },
      PAGINATION_CONFIG: {
        LABEL: translate('form_field_strings.field_list_config.basic_config.pagination_config.label'),
        OPTION_LIST_1: [{ label: translate('form_field_strings.field_list_config.basic_config.pagination_config.label_1'), value: 1 }],
        OPTION_LIST_2: [{ label: translate('form_field_strings.field_list_config.basic_config.pagination_config.label_2'), value: 2 }],
        ROWS_INPUT: {
          PLACEHOLDER: '00',
          SUFFIX_LABEL: translate('form_field_strings.field_list_config.basic_config.pagination_config.suffix_label'),
        },
      },
    },
    HELP_ICON_FILL_COLOR: 'rgb(34, 139, 181)',
    VALIDATION_CONFIG: {
      MIN_ROW_VALIDATION: {
        OPTION_LIST: [{ label: translate('form_field_strings.field_list_config.validation_config.min_row_validation.label'), value: 1 }],
        ID: 'is_minimum_row',
        ROWS_INPUT: {
          ID: 'minimum_row',
          PLACEHOLDER: '0',
          SUFFIX_LABEL: translate('form_field_strings.field_list_config.validation_config.min_row_validation.suffix_label'),
        },
      },
      MAX_ROW_VALIDATION: {
        OPTION_LIST: [{ label: translate('form_field_strings.field_list_config.validation_config.max_row_validation.label'), value: 1 }],
        ID: 'is_maximum_row',
        ROWS_INPUT: {
          ID: 'maximum_row',
          PLACEHOLDER: '0',
          SUFFIX_LABEL: translate('form_field_strings.field_list_config.validation_config.max_row_validation.suffix_label'),
        },
      },
      UNIQUE_COLUMN: {
        OPTION_LIST: [{ label: translate('form_field_strings.field_list_config.validation_config.unique_column.label_1'), value: 1 }],
        ID: 'is_unique_column_available',
        UNIQUE_COLUMN_FIELDS: {
          ID: 'unique_column_uuid',
          PLACEHOLDER: translate('form_field_strings.field_list_config.validation_config.unique_column.placeholder'),
          LABEL: translate('form_field_strings.field_list_config.validation_config.unique_column.label_2'),
        },
      },
      ALLOW_ADDING_NEW_ROW: {
        OPTION_LIST: [{ label: translate('form_field_strings.field_list_config.validation_config.adding_new_row.label'), value: 1 }],
        ID: 'add_new_row',
        LABEL: translate('form_field_strings.field_list_config.validation_config.adding_new_row.label'),
      },
      ALLOW_EDITING_EXISTING_ROW: {
        OPTION_LIST: [
          { label: translate('form_field_strings.field_list_config.validation_config.allow_editing_existing_row.label'), value: 1 }],
        ID: 'allow_modify_existing',
        LABEL: translate('form_field_strings.field_list_config.validation_config.allow_editing_existing_row.label'),
      },
      ALLOW_DELETING_EXISTING_ROW: {
        OPTION_LIST: [
          { label: translate('form_field_strings.field_list_config.validation_config.allow_delete_existing_row.label'), value: 1 }],
        ID: 'allow_delete_existing',
        LABEL: translate('form_field_strings.field_list_config.validation_config.allow_delete_existing_row.label'),
      },
    },
    TABLE_CONFIGURATION: {
      LABEL: translate('form_field_strings.field_list_config.table_config.label'),
      INSTRUCTION: translate('form_field_strings.field_list_config.table_config.instruction'),
      ACTIONS: {
        UPDATE: translate('form_field_strings.field_list_config.table_config.update'),
        DISCARD: translate('form_field_strings.field_list_config.table_config.discard'),
      },
    },
  },
};
};

export const FORM_BUILDER_DND_ITEMS = {
  SECTION: 'Section',
  FIELD_LIST: 'Fieldlist',
  FIELD: 'Field',
};

export const getFieldConfigStrings = () => {
  return { TITLE: 'Field Config', ID: 'field_config' };
};

export const getFieldConfigTabStrings = (fieldType, allowBasicOnly = false) => {
  const tabs = [
    {
      TEXT: FIELD_CONFIGS.BASIC_CONFIG.TITLE,
      INDEX: FIELD_CONFIGS.BASIC_CONFIG.TAB_INDEX,
    },
    {
      TEXT: FIELD_CONFIGS.VALIDATION.TITLE,
      INDEX: FIELD_CONFIGS.VALIDATION.TAB_INDEX,
    },
    {
      TEXT: FIELD_CONFIGS.VISIBILITY.TITLE,
      INDEX: FIELD_CONFIGS.VISIBILITY.TAB_INDEX,
    },
    {
      TEXT: FIELD_CONFIGS.OTHER_SETTINGS.TITLE,
      INDEX: FIELD_CONFIGS.OTHER_SETTINGS.TAB_INDEX,
    },
  ];
  return [FIELD_TYPES.INFORMATION, FIELD_TYPES.SCANNER].includes(fieldType)
    ? [tabs[0], tabs[2]]
    : allowBasicOnly
      ? [tabs[0]]
      : tabs;
};

export const getFieldListConfigTabStrings = (fieldListType, t) => {
  if (fieldListType === FIELD_LIST_TYPE.TABLE) {
    return [
      {
        TEXT: t(FIELD_CONFIGS.BASIC_CONFIG.TITLE),
        INDEX: FIELD_CONFIGS.BASIC_CONFIG.TAB_INDEX,
      },
      {
        TEXT: t(FIELD_CONFIGS.VALIDATION.TITLE),
        INDEX: FIELD_CONFIGS.VALIDATION.TAB_INDEX,
      },
      {
        TEXT: t(FIELD_CONFIGS.VISIBILITY.TITLE),
        INDEX: FIELD_CONFIGS.VISIBILITY.TAB_INDEX,
      },
      // {
      //   TEXT: FIELD_CONFIGS.OTHER_SETTINGS.TITLE,
      //   INDEX: FIELD_CONFIGS.OTHER_SETTINGS.TAB_INDEX,
      // },
    ];
  }
  return [];
};

export const FIELD_CONFIGS_TABS = getFieldConfigTabStrings;

export const FIELD_CONFIGS_STRINGS = getFieldConfigStrings();

export const FIELD_LIST_CONFIGS_TABS = (fieldListType, t) =>
  getFieldListConfigTabStrings(fieldListType, t);

// export const FORM_BUILDER_LABELS = {
//   [FIELD_CONFIG.BASIC_CONFIG.REFERENCE_NAME.ID]:
//     FIELD_CONFIG.BASIC_CONFIG.REFERENCE_NAME.LABEL,
// };

export const IMPORT_INSTRUCTION = {
  IMPORT_FROM: translate('form_builder_strings.import_intruction.import_from'),
  NOT_IMPORTING_FIELD_CONFIG: translate('form_builder_strings.import_intruction.not_importing_field_config'),
  IMPORT_ALL_FIELDS: translate('form_builder_strings.import_intruction.import_all_fields'),
  IMPORT_TASK_FORM: translate('form_builder_strings.import_intruction.import_task_form'),
  IMPORT_SELECT_STEP: translate('form_builder_strings.import_intruction.import_select_step'),
  IMPORTED_FIELD_INSTRUCTION: translate('form_builder_strings.import_intruction.imported_field_instruction'),
  NO_FORMS_TO_IMPORT: translate('form_builder_strings.import_intruction.no_forms_to_import'),
  TABLE_ALREADY_EXISTS: translate('form_builder_strings.import_intruction.table_already_exists'),
  FIELD_ALREADY_EXISTS: translate('form_builder_strings.import_intruction.field_already_exists'),
  READ_ONLY_TEXT: translate('form_builder_strings.import_intruction.read_only_text'),
  UNIQUE_COLUMN_ERROR: 'form_builder_strings.import_intruction.unique_column_error',
};

export const IMPORT_BUTTON = {
  IMPORT: translate('form_builder_strings.import_form.import_label'),
  CANCEL: translate('form_builder_strings.import_form.cancel_label'),
};

export const ERROR_MESSAGES = {
  ERROR_IN_FIELD: 'flow_config_strings.errors.error_in_field',
  CHECK_FIELD_CONFIG: 'flow_config_strings.errors.check_field_config',
  NO_FIELDS_SELECTED: 'form_field_strings.errors.no_fields_selected',
  SELECT_ATLEAST_ONE_FIELD: 'form_field_strings.errors.select_field',
};

export const DATA_LIST_VISIBILITY = {
  INSTRUCTION: translate('form_field_strings.data_list_visibility.instruction'),
  OPTIONS: [
    { label: translate('form_field_strings.data_list_visibility.label'), value: 1 },
  ],
  ACTIONS: {
    ENABLE_LIMIT_SWITCH: 1,
    ADD_CONDITION: 2,
  },
};

export const RULE_VALUE_STRINGS = Object.freeze({
  DUAL_DATE: {
    LABEL_1: translate('form_field_strings.rule_value_string.dual_date.label_1'),
    LABEL_2: translate('form_field_strings.rule_value_string.dual_date.label_2'),
    ERRORS: {
      REQUIRED: translate('form_field_strings.rule_value_string.dual_date.required'),
      DATE_FORMAT: translate('form_field_strings.rule_value_string.dual_date.date_formate'),
      VALID_RANGE: translate('form_field_strings.rule_value_string.dual_date.valid_range'),
    },
  },
  DUAL_NUMBER: {
    LABEL_1: translate('rule_value_strings.dual_number.first_num_label'),
    LABEL_2: translate('rule_value_strings.dual_number.second_num_label'),
    ERRORS: {
      REQUIRED: translate('rule_value_strings.dual_number.errors.num_required'),
      VALID_RANGE: translate('rule_value_strings.dual_number.errors.invalid_range'),
    },
  },
  MULTI_NUMBER: {
    DROPDOWN_LABEL: translate('rule_value_strings.operand_types.multi_number.dropdown_label'),
    DROPDOWN_PLACEHOLDER: translate('rule_value_strings.operand_types.multi_number.dropdown_placeholder'),
    PLACEHOLDER: translate('rule_value_strings.operand_types.multi_number.placeholder'),
  },
  DROPDOWN: {
    SINGLE_DD_PLACEHOLDER: translate('common_strings.select_a_value'),
    MULTI_DD_PLACEHOLDER: translate('common_strings.select_one_or_more_values'),
  },
  DUAL_TIME: {
    LABEL_1: translate('rule_value_strings.dual_time.label_1'),
    PLACEHOLDER_1: translate('rule_value_strings.dual_time.placeholder_1'),
    LABEL_2: translate('rule_value_strings.dual_time.label_2'),
    PLACEHOLDER_2: translate('rule_value_strings.dual_time.placeholder_2'),
    ERRORS: {
      VALID_RANGE: translate('rule_value_strings.dual_time.errors.invalid_range'),
    },
  },
});

export const TABLE_CONTROL_ACCESS = {
  REVOKE_ADD_AND_EDIT_VALIDATION_CONFIG: translate('form_builder_strings.table_control.revoke_validation_config'),
  REVOKE_ADD_AND_EDIT_INFO: translate('form_builder_strings.table_control.revoke_edit_info'),
};

export const ARIA_LABEL = {
  ADD: translate('form_field_strings.aria_label.add'),
  ADD_SECTION: translate('form_field_strings.aria_label.add_section'),
};

export const DATE_VALIDATION = {
  DATE_VALIDATIONS: {

    ALLOW_FUTURE_AFTER: {
      ID: 'future_after_next',
    },
    ALLOW_FUTURE_NEXT: {
      ID: 'future_next',
    },
    ALLOW_FUTURE_BETWEEN: {
      ID: 'future_between',
    },
    ALLOW_PAST: {
      ID: 'allow_past_dates',

    },
    ALLOW_PAST_ALL: {
      ID: 'past_all',

    },
    ALLOW_PAST_LAST: {
      ID: 'past_last',
    },
    ALLOW_PAST_BEFORE: {
      ID: 'past_before',
    },
    ALLOW_PAST_BETWEEN: {
      ID: 'past_between',
    },
    ALLOW_ONLY_TODAY: {
      ID: 'today_only',
    },
    ALLOW_DATE_FIELDS: {
      ID: 'form_field',
    },
  },
};
