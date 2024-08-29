import React from 'react';
import { FIELD_TYPE } from '../../utils/constants/form.constant';
import TwoColumnsIcon from '../../assets/icons/TwoColumnsIcon';
import ThreeColumnsIcon from '../../assets/icons/ThreeColumnsIcon';
import FourColumnsIcon from '../../assets/icons/FourColumnsIcon';
import { translateFunction } from '../../utils/jsUtility';
import FileImportIcon from '../../assets/icons/FileImportIcon';
import DeleteIcon from '../../assets/icons/apps/DeleteIcon';
import { MODULE_TYPES } from '../../utils/Constants';

export const FORM_TYPE = {
  CREATION_FORM: 'creation_form',
  EDITABLE_FORM: 'editable_form',
  READONLY_FORM: 'readonly_form',
  IMPORT_FROM: 'import_form',
  READ_ONLY_CREATION_FORM: 'read_only_creation_form',
  EXISTING_READONLY: 'existing_readonly',
};

export const FIELD_ACTION = {
  VALUE_CHANGE: 'value_change',
  CHECKBOX_CHANGE: 'checkbox_change',

  USER_ADD: 'user_add',
  USER_REMOVE: 'user_remove',

  LINK_ADD: 'link_add',
  LINK_REMOVE: 'link_remove',
  LINK_EDIT: 'link_edit',

  ADD: 'add',
  EDIT: 'edit',
  SELECT: 'select',
  REMOVE: 'remove',

  FILE_ADD: 'add_file',
  FILE_REMOVE: 'remove_file',

  TABLE_ADD_ROW: 'add_table_row',
  TABLE_REMOVE_ROW: 'remove_table_row',
};

export const FORM_ACTIONS = {
  SAVE_FIELD: 'save_field',
  SAVE_FIELD_LIST: 'save_field_list',
  DELETE_FIELD: 'delete_fields',
  BULK_UPLOAD_FIELDS: 'bulk_upload_fields',

  ADD_SECTION: 'add_section',
  UPDATE_SECTION: 'update_section',
  UPDATE_SECTION_NAME: 'update_section_name',
  UPDATE_SECTIONS: 'update_sections',
  DELETE_SECTION: 'delete_section',
  UPDATE_LAYOUT_IN_SECTION: 'update_layout_in_section',
  RESIZE_FIELDS: 'resize_fields',

  ACTIVE_FIELD_DATA_CHANGE: 'active_field_data_change',
  UPDATE_ACTIVE_FIELD: 'update_active_field_data',

  ACTIVE_FIELD_COLUMN_DATA_CHANGE: 'active_field_column_data_change',
  ACTIVE_FIELD_EXTERNAL_SOURCE_DATA_CHANGE: 'active_field_external_source_data_change',
  ACTIVE_FIELD_CLEAR: 'active_field_clear',
  ACTIVE_COLUMN_CLEAR: 'active_column_clear',
  ACTIVE_EXTERNAL_SOURCE_CLEAR: 'active_external_source_clear',
  ACTIVE_FIELD_ERROR_LIST: 'active_field_error_list',

  ACTIVE_FORM_DATA_CHANGE: 'active_form_data_change',
  FORM_DATA_UPDATE: 'form_data_update',
  FORM_DATA_CHANGE: 'form_data_change',

  IMPORT_FORM_FIELD: 'import_form_field',
  IMPORT_SECTION: 'import_section',
  FILE_UPLOAD_FIELD_DATA_CHANGE: 'file_upload_field_data_change',
  EXTERNAL_SOURCE_DATA: 'external_source_data',

  VALIDATION_MESSAGE_DATA_CHANGE: 'validation_message_data_change',
  COMMON_STATE_UPDATER: 'common_state_updater',

  ACTIVE_LAYOUT_DATA_CHANGE: 'active_layout_data_change',
  ACTIVE_LAYOUT_CLEAR: 'active_layout_clear',
  UPDATE_ACTIVE_LAYOUT: 'update_active_layout_data',
};

export const FORM_LAYOUT_TYPE = {
  ROOT: 'root',
  FIELD: 'field',
  TABLE: 'table',
  ROW: 'container',
  COLUMN: 'column',
  ADD_FIELD: 'add-field',
  FIELD_TEMPLATE: 'field-template',
  LAYOUT: 'layout',
  BOX: 'box',
  EXISTING_FIELD: 'existing-field',
  EXISTING_TABLE: 'existing-table',
};

export const FORM_LAYOUT_STRINGS = (t) => {
  return {
    CLICK_ADD: t('form.form_layout_strings.click_add'),
    CLICK_DRAG: t('form.form_layout_strings.click_drag'),
  };
};

export const FIELD_ACTION_TYPE = {
  FIELD: 'field',
  TABLE: 'table',
};

export const FIELD_VISIBILITY_TYPE = {
  HIDE: 'hide',
  DISABLE: 'disable',
};

export const ROW_IDENTIFIER = {
   ID: '_id',
   TEMP_ROW_UUID: 'temp_row_uuid',
};

export const TABLE_ACTIONS = [FIELD_ACTION.TABLE_ADD_ROW, FIELD_ACTION.TABLE_REMOVE_ROW];

export const VALUE_CONFIG_TYPES = {
  EXTERNAL_DATA: 'external_data',
  CALCULATIVE_RULE: 'calculated_rule',
};

export const DEFAULT_VALUE_RULE_FIELDS = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.RADIO_GROUP,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.CHECKBOX,
  FIELD_TYPE.DATE,
  FIELD_TYPE.DATETIME,
  FIELD_TYPE.EMAIL,
  FIELD_TYPE.CURRENCY,
  FIELD_TYPE.USER_TEAM_PICKER,
  FIELD_TYPE.DATA_LIST,
];

export const TABLE_DEFAULT_VALUE_RULE_FIELDS = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.EMAIL,
  FIELD_TYPE.DATA_LIST,
  FIELD_TYPE.USER_TEAM_PICKER,
  FIELD_TYPE.RADIO_GROUP,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.CHECKBOX,
];

export const TABLE_EXPRESSION_RULE_FIELDS = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.EMAIL,
];

export const FIELD_LIST = {
  // Single
  field_single: {
    helpTooltip: 'Helper',
    fieldUUID: 'field_single',
    fieldName: 'Single',
    fieldType: FIELD_TYPE.SINGLE_LINE,
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    validations: {
      allowedSpecialCharacters: [],
      allowSpecialCharacters: true,
      maximumCharacters: 10,
      minimumCharacters: 1,
    },
    columnOrder: 1,
    rowOrder: 1,
  },
  // Paragraph
  field_number: {
    helpTooltip: 'Helper',
    fieldUUID: 'field_number',
    fieldName: 'Number',
    fieldType: FIELD_TYPE.NUMBER,
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    validations: {
      allowedDecimalPoints: true,
      allowedMaximum: 100,
      allowedMinimum: 5,
      allowDecimal: true,
      dontAllowZero: true,
    },
    columnOrder: 2,
    rowOrder: 1,
  },
  // Number
  field_paragraph: {
    helpTooltip: 'Helper',
    fieldUUID: 'field_paragraph',
    fieldName: 'Paragraph',
    fieldType: FIELD_TYPE.PARAGRAPH,
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    validations: {
      allowedSpecialCharacters: [],
      allowSpecialCharacters: true,
      maximumCharacters: 10,
      minimumCharacters: 1,
    },
    columnOrder: 3,
    rowOrder: 1,
  },
  // Email
  field_email: {
    helpTooltip: 'Helper',
    fieldUUID: 'field_email',
    fieldName: 'Email',
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    fieldType: FIELD_TYPE.EMAIL,
    validations: {
      isDomainValidation: true,
      allowedDomains: ['com', 'org'],
    },
    columnOrder: 4,
    rowOrder: 1,
  },
  // Yes Or No
  field_yes_or_no: {
    fieldUUID: 'field_yes_or_no',
    fieldName: 'Yes Or No',
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    fieldType: FIELD_TYPE.YES_NO,
    columnOrder: 1,
    rowOrder: 2,
  },
  // Checkbox
  field_checkbox: {
    fieldUUID: 'field_checkbox',
    fieldName: 'Checkbox - City',
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    fieldType: FIELD_TYPE.CHECKBOX,
    choiceValues: [
      {
          label: 'Chennai',
          value: 'chennai',
      },
      {
        label: 'Coimbatore',
        value: 'coimbatore',
      },
      {
        label: 'Bangalore',
        value: 'bangalore',
      },
      {
        label: 'Kochi',
        value: 'kochi',
      },
    ],
    validation: {
      allowMaximumCount: true,
      allowMinimumCount: true,
      minimumCount: 1,
      maximumCount: 2,
    },
    columnOrder: 2,
    rowOrder: 2,
  },
  // Radio
  field_radio: {
    fieldUUID: 'field_radio',
    fieldName: 'Radio - City',
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    fieldType: FIELD_TYPE.RADIO_GROUP,
    choiceValues: [
      {
          label: 'Chennai',
          value: 'chennai',
      },
      {
        label: 'Coimbatore',
        value: 'coimbatore',
      },
    ],
    columnOrder: 3,
    rowOrder: 2,
  },
  // Dropdown
  field_dropdown: {
    fieldUUID: 'field_dropdown',
    fieldName: 'Dropdown - city',
    fieldType: FIELD_TYPE.DROPDOWN,
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    choiceValues: [
      {
          label: 'Chennai',
          value: 'chennai',
      },
      {
        label: 'Coimbatore',
        value: 'coimbatore',
      },
    ],
    columnOrder: 1,
    rowOrder: 3,
  },
  // CSD
  field_CSD: {
    fieldUUID: 'field_CSD',
    fieldName: 'Commonly Shared Dropdwon - city',
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    fieldType: FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
    choiceValues: [
      {
        label: 'Chennai',
        value: 'chennai',
    },
    {
      label: 'Coimbatore',
      value: 'coimbatore',
    },
    {
      label: 'Bangalore',
      value: 'bangalore',
    },
    {
      label: 'Kochi',
      value: 'kochi',
    },
    ],
    columnOrder: 2,
    rowOrder: 3,
  },
  // Date
  field_date: {
    fieldUUID: 'field_date',
    fieldName: 'Date',
    fieldType: FIELD_TYPE.DATE,
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    columnOrder: 1,
    rowOrder: 4,
  },
  // Date and Time
  field_date_time: {
    fieldUUID: 'field_date_time',
    fieldName: 'Date & Time',
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    fieldType: FIELD_TYPE.DATETIME,
    validation: {
    },
    columnOrder: 2,
    rowOrder: 4,
  },
  // User Selector
  field_user_selector: {
    fieldUUID: 'field_user_selector',
    fieldName: 'User Selector',
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    fieldType: FIELD_TYPE.USER_TEAM_PICKER,
    validation: {
    },
    columnOrder: 3,
    rowOrder: 4,
  },
  // Data List Selector
  field_data_list_selector: {
    fieldUUID: 'field_data_list_selector',
    fieldName: 'Datalist Selector',
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    fieldType: FIELD_TYPE.DATA_LIST,
    validation: {
    },
    columnOrder: 1,
    rowOrder: 5,
  },
  // File Upload
  field_file_upload: {
    fieldUUID: 'field_file_upload',
    fieldName: 'File Upload',
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    fieldType: FIELD_TYPE.FILE_UPLOAD,
    validation: {
      maximumFileSize: 1,
      allowedExtensions: ['pdf'],
      isMultiple: true,
      minimumCount: 1,
      maximumCount: 2,
    },
    columnOrder: 2,
    rowOrder: 5,
  },
  // Phone Number
  field_phone_number: {
    fieldUUID: 'field_phone_number',
    fieldName: 'Phone',
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    fieldType: FIELD_TYPE.PHONE_NUMBER,
    validation: {
    },
    columnOrder: 3,
    rowOrder: 5,
  },
  // Currency
  field_currency: {
    fieldUUID: 'field_currency',
    fieldName: 'Currency',
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    fieldType: FIELD_TYPE.CURRENCY,
    validation: {
      allowedMinimum: 1,
      allowedMaximum: 12,
      allowedDecimalPoints: 2,
      allowedCurrencyTypes: 'inr',
    },
    columnOrder: 1,
    rowOrder: 6,
  },
  // Link
  field_link: {
    fieldUUID: 'field_link',
    fieldName: 'Link',
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    fieldType: FIELD_TYPE.LINK,
    validation: {
      isMultiple: true,
      minimumCount: 2,
      maximumCount: 3,
    },
    columnOrder: 2,
    rowOrder: 6,
  },
  // Information
  field_information: {
    fieldUUID: 'field_information',
    fieldName: 'Information',
    fieldType: FIELD_TYPE.INFORMATION,
    defaultValue:
      '<h2 data-mce-style="text-align: center;" style="text-align: center;"><em>Sample</em> <em>Check</em></h2><p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p><p style="margin-top: 20px; color: steelblue;">The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p><p style="margin-top: 20px; color: steelblue;">The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>',
    columnOrder: 3,
    rowOrder: 6,
  },
  // Scanner
  field_scanner: {
    helpTooltip: 'Helper',
    fieldUUID: 'field_scanner',
    fieldName: 'Scanner',
    fieldType: FIELD_TYPE.SCANNER,
    instruction: 'Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, ',
    placeholder: 'placeholder',
    validations: {
      allowedSpecialCharacters: [],
      allowSpecialCharacters: true,
      maximumCharacters: 10,
      minimumCharacters: 1,
    },
    columnOrder: 1,
    rowOrder: 1,
  },
};

export const SECTION_MENU = (t, moduleType, isLastSection = false) => {
  const optionList = [];

  if (moduleType === MODULE_TYPES.FLOW) {
    optionList.push(
      {
        label: t('flows.form_field_design.import_form_field'),
        value: FORM_ACTIONS.IMPORT_FORM_FIELD,
        icon: <FileImportIcon fill="#9E9E9E" />,
        header: t('form.sections.import'),
      },
    );
  }

  if (moduleType !== MODULE_TYPES.SUMMARY) {
    optionList.push(
      {
        label: t('flows.form_field_design.two_columns'),
        value: 2,
        icon: <TwoColumnsIcon />,
        header: t('form.sections.layout'),
      },
      {
        label: t('flows.form_field_design.three_columns'),
        value: 3,
        icon: <ThreeColumnsIcon />,
      },
      {
        label: t('flows.form_field_design.four_columns'),
        value: 4,
        icon: <FourColumnsIcon />,
      },
    );
  }

  if (!isLastSection) {
    optionList.push(
      {
        label: t('flows.form_field_design.section_menu.delete_section'),
        value: FORM_ACTIONS.DELETE_SECTION,
        icon: <DeleteIcon height="18" width="18" />,
        header: t('form.sections.action'),
      },
    );
  }

  return optionList;
};

export const SECTION_STRINGS = (t) => {
  return {
    SECTION: {
      ADD_SECTION: t('flows.form_field_design.add_section_title'),
      UNTITLE_SECTION: t('flows.form_field_design.untitled_section'),
      IMPORT_FORM_FIELD: t('flows.form_field_design.import_form_field'),
      IMPORT_SECTION: t('flows.form_field_design.import_section'),
      SECTION_NAME_ERROR: t('form.import_form.errors.section_name_is_empty'),
    },
  };
};

export const FORM_CONFIG_STRINGS = (t = translateFunction) => {
  return {
    CHIP: {
      FORM_HEADER: t('form.chip.form_header'),
      FORM_FOOTER: t('form.chip.form_footer'),
      FORM_BODY: t('form.chip.form_body'),
    },
    FORM_CONFIG: {
      MODAL_ID: 'form_header_configuration',
      HEADER: {
        CONTENT: t('form.form_header.header.content'),
        TITLE: t('form.form_header.header.title'),
        FORM_DISABLED_TITLE_PLACEHOLDER: t(
          'form.form_header.header.form_disabled_title_placeholder',
        ),
        FORM_DISABLED_DESCRIPTION_PLACEHOLDER: t(
          'form.form_header.header.form_disabled_description_placeholder',
        ),
        FORM_TITLE_ID: 'form_title', // exclude for localization
        FORM_TITLE_LABEL: t('form.form_header.header.form_title_label'),
        FORM_TITLE_PLACEHOLDER: t(
          'form.form_header.header.form_title_placeholder',
        ),
        FORM_DESCRIPTION_ID: 'form_description', // exclude for localization
        FORM_DESCRIPTION_LABEL: t(
          'form.form_header.header.form_description_label',
        ),
        FORM_DESCRIPTION_PLACEHOLDER: t(
          'form.form_header.header.form_description_placeholder',
        ),
      },
      FOOTER: {
        SAVE_BUTTON: t('form.form_header.footer.save_button'),
        CANCEL_BUTTON: t('form.form_header.footer.cancel_button'),
      },
    },
  };
};

export const FORM_BODY_STRINGS = (t) => {
  return {
    IMPORT_EXISTING_FORM: t('flows.form_field_design.import_existing_form'),
    IMPORT_EXISTING_FORM_DESC: t('flows.form_field_design.import_form_subtitle'),
    CREATE_FORM: t('flows.form_field_design.create_form'),
    CREATE_FORM_DESC: t('flows.form_field_design.create_form_subtitle'),
  };
};

export const LAYOUT_CONFIGURATION_STRINGS = (t) => {
  return {
    BOX_CONFIG: {
      MODAL_TITLE: t('layout_configuration.box_config.modal_title'),
      TITLE: t('layout_configuration.box_config.title'),
      NO_OF_COLUMNS: t('layout_configuration.box_config.no_of_columns'),
      BACKGROUND_COLOR: t('layout_configuration.box_config.background_color'),
      CANNOT_DELETE_TITLE: t('layout_configuration.box_config.cannot_delete_title'),
      CANNOT_DELETE_TEXT: t('layout_configuration.box_config.cannot_delete_text'),
    },
  };
};
