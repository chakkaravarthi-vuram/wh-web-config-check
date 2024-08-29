import { VALUE_CONFIG_TYPE } from '../../../shared_container/individual_entry/summary_builder/Summary.constants';

export const FIELD_CONFIG_TABS = {
  BASIC_CONFIG: 1,
  VALUE_CONFIG: 2,
  VALIDATION_VISIBILITY_CONFIG: 3,
  ADDITIONAL_CONFIG: 4,
  GENERAL: 5,
};

export const IMAGE_CONFIGURATION_TYPE = {
  UPLOAD_DIRECTLY: 'upload_directly',
  FIELDS: 'fields',
};

export const ACTION_BUTTON_STYLE_TYPE = {
  LINK: 'link',
  BUTTON: 'button',
  OUTLINE: 'outline',
};

export const BUTTON_LINK_TYPE = {
  START_SUB_FLOW: 'trigger',
  INTERNAL_EXTERNAL_LINK: 'link',
};

export const FIELD_CONFIGURATIONS_CONSTANTS = (t = () => {}) => {
  return {
    TITLE: {
      RICH_TEXT: t('individual_entry.field_config.title.rich_text'),
      IMAGE: t('individual_entry.field_config.title.image'),
      BUTTON_LINK: t('individual_entry.field_config.title.button_link'),
      FIELD_DISPLAY: t('individual_entry.field_config.title.field_display'),
      PAGE: t('individual_entry.field_config.title.page'),
    },
    TABS: {
      GENERAL: t('individual_entry.field_config.tabs.general'),
      ADDITIONAL_CONFIG: t(
        'individual_entry.field_config.tabs.additional_config',
      ),
    },
    GENERAL: {
      RICH_TEXT: {
        BACKGROUND_COLOR: t(
          'individual_entry.field_config.general.rich_text.background_color',
        ),
        CONTENT: t('individual_entry.field_config.general.rich_text.content'),
      },
      IMAGE: {
        UPLOAD_IMAGE: {
          ID: 'manual_upload_image',
          LABEL: t('individual_entry.field_config.general.image.upload_image'),
        },
      },
      BUTTON_LINK: {
        BUTTON_LINK_TYPE: {
          LABEL: t(
            'individual_entry.field_config.general.button_link.button_link_type.label',
          ),
          OPTIONS: [
            {
              label: t(
                'individual_entry.field_config.general.button_link.button_link_type.options.start_sub_flow',
              ),
              value: BUTTON_LINK_TYPE.START_SUB_FLOW,
            },
            {
              label: t(
                'individual_entry.field_config.general.button_link.button_link_type.options.internal_external_link',
              ),
              value: BUTTON_LINK_TYPE.INTERNAL_EXTERNAL_LINK,
            },
          ],
        },
        START_SUB_FLOW: {
          CHOOSE_ACTION: t(
            'individual_entry.field_config.general.button_link.start_sub_flow.choose_action',
          ),
          CREATE_ACTION: t(
            'individual_entry.field_config.general.button_link.start_sub_flow.create_action',
          ),
        },
        INTERNAL_EXTERNAL_LINK: {
          LABEL: t(
            'individual_entry.field_config.general.button_link.internal_external_link.label',
          ),
          PLACEHOLDER: t(
            'individual_entry.field_config.general.button_link.internal_external_link.placeholder',
          ),
        },
        BUTTON_LINK_LABEL: t(
          'individual_entry.field_config.general.button_link.button_link_label',
        ),
        ACTION_BUTTON_STYLE: {
          LABEL: t(
            'individual_entry.field_config.general.button_link.action_button_style.label',
          ),
          OPTIONS: {
            LINK: t(
              'individual_entry.field_config.general.button_link.action_button_style.options.link',
            ),
            BUTTON: t(
              'individual_entry.field_config.general.button_link.action_button_style.options.button',
            ),
            OUTLINE: t(
              'individual_entry.field_config.general.button_link.action_button_style.options.outline',
            ),
          },
        },
      },
      FIELD_DISPLAY: {
        TITLE: t('individual_entry.field_config.general.field_display.title'),
        FIELD_VALUE_SOURCE: {
          LABEL: t(
            'individual_entry.field_config.general.field_display.field_value_source.label',
          ),
          OPTIONS: [
            {
              label: t(
                'individual_entry.field_config.general.field_display.field_value_source.options.user_defined_field',
              ),
              value: VALUE_CONFIG_TYPE.USER_DEFINED_FIELD,
            },
            {
              label: t(
                'individual_entry.field_config.general.field_display.field_value_source.options.system_field',
              ),
              value: VALUE_CONFIG_TYPE.SYSTEM_FIELD,
            },
            {
              label: t(
                'individual_entry.field_config.general.field_display.field_value_source.options.external_source',
              ),
              value: VALUE_CONFIG_TYPE.EXTERNAL_DATA,
            },
            // {
            //   label: t(
            //     'individual_entry.field_config.general.field_display.field_value_source.options.rule_based',
            //   ),
            //   value: VALUE_CONFIG_TYPE.RULE,
            // },
          ],
        },
        CHOOSE_FIELD: {
          USER_DEFINED_FIELD: t(
            'individual_entry.field_config.general.field_display.choose_field.user_defined_field',
          ),
          SYSTEM_DEFINED_FIELD: t(
            'individual_entry.field_config.general.field_display.choose_field.system_defined_field',
          ),
          EXTERNAL_DATA_FIELD: t(
            'individual_entry.field_config.general.field_display.choose_field.external_data_field',
          ),
          EXTERNAL_RULE: t(
            'individual_entry.field_config.general.field_display.choose_field.external_rule',
          ),
          RULE: t(
            'individual_entry.field_config.general.field_display.choose_field.rule',
          ),
        },
        SHOW_PROPERTY_FOR_PICKER: t(
          'individual_entry.field_config.general.field_display.show_property_for_picker',
        ),
        CHOOSE_PICKER_PROPERTY: t(
          'individual_entry.field_config.general.field_display.choose_picker_property',
        ),
        FIELD_LABEL: {
          LABEL: t(
            'individual_entry.field_config.general.field_display.field_label.label',
          ),
          PLACEHOLDER: t(
            'individual_entry.field_config.general.field_display.field_label.placeholder',
          ),
        },
        FIELD_TYPE: t(
          'individual_entry.field_config.general.field_display.field_type',
        ),
        TABLE_COLUMN: {
          LABEL: t(
            'individual_entry.field_config.general.field_display.table_columns.label',
          ),
          COLUMN_NAME: t(
            'individual_entry.field_config.general.field_display.table_columns.column_name',
          ),
          COLUMN_TYPE: t(
            'individual_entry.field_config.general.field_display.table_columns.column_type',
          ),
          EDITABILITY: t(
            'individual_entry.field_config.general.field_display.table_columns.editability',
          ),
        },
        ADD_TABLE_COLUMN: t(
          'individual_entry.field_config.general.field_display.add_table_column',
        ),
      },
    },
    ADDITIONAL_CONFIG: {
      VISIBILITY: {
        TITLE: t(
          'individual_entry.field_config.additional_config.visibility.title',
        ),
        CONDITION: {
          LABEL: t(
            'individual_entry.field_config.additional_config.visibility.condition.label',
          ),
          ADD_CONDITION: t(
            'individual_entry.field_config.additional_config.visibility.condition.add_condition',
          ),
          EXPRESSION_OR_CALCULATION: t(
            'individual_entry.field_config.additional_config.visibility.condition.expression_or_calculation',
          ),
        },
        WHEN_VALUE_EMPTY: {
          LABEL: t(
            'individual_entry.field_config.additional_config.visibility.when_value_empty.label',
          ),
          OPTION: [
            {
              label: t(
                'individual_entry.field_config.additional_config.visibility.when_value_empty.options.show',
              ),
              value: false,
            },
            {
              label: t(
                'individual_entry.field_config.additional_config.visibility.when_value_empty.options.hide',
              ),
              value: true,
            },
          ],
        },
      },
      FIELD_GUIDANCE: {
        TITLE: t(
          'individual_entry.field_config.additional_config.field_guidance.title',
        ),
        FIELD_INSTRUCTION: {
          LABEL: t(
            'individual_entry.field_config.additional_config.field_guidance.field_instruction.label',
          ),
          PLACEHOLDER: t(
            'individual_entry.field_config.additional_config.field_guidance.field_instruction.placeholder',
          ),
        },
        HELPER_TOOLTIP: {
          LABEL: t(
            'individual_entry.field_config.additional_config.field_guidance.helper_tooltip.label',
          ),
          PLACEHOLDER: t(
            'individual_entry.field_config.additional_config.field_guidance.helper_tooltip.placeholder',
          ),
        },
      },
    },
    BUTTONS: {
      SAVE: t('common_strings.save'),
      CANCEL: t('common_strings.cancel'),
      DELETE: t('common_strings.delete'),
    },
  };
};

export const SUMMARY_CONFIG_TABS = (t) => [
  {
    labelText: FIELD_CONFIGURATIONS_CONSTANTS(t).TABS.GENERAL,
    value: FIELD_CONFIG_TABS.GENERAL,
    tabIndex: FIELD_CONFIG_TABS.GENERAL,
  },
  {
    labelText: FIELD_CONFIGURATIONS_CONSTANTS(t).TABS.ADDITIONAL_CONFIG,
    value: FIELD_CONFIG_TABS.ADDITIONAL_CONFIG,
    tabIndex: FIELD_CONFIG_TABS.ADDITIONAL_CONFIG,
  },
];
