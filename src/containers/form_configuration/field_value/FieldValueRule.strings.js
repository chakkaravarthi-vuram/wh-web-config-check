import i18next from 'i18next';
import { FORM_POPOVER_STATUS } from '../../../utils/Constants';
import { BUILDER_TYPES } from '../field_visibility/FieldVisibilityRule.utils';
import { FIELD_TYPE } from '../../../utils/constants/form.constant';

export const FIELD_DEFAULT_VALUE_STRINGS = (t = i18next.t) => {
  return {
    MODAL: {
      ID: 'field_visibility_rule',
      CONFIGURATION_BUILDER: t('default_value_rule_strings.configuration_builder'),
      EXPRESSION_BUILDER: t('default_value_rule_strings.expression_builder'),
      CONDITIONAL_BUILDER_ID: 'field_visibility_condition_builder',
      TITLE: t('default_value_rule_strings.condition_configuration'),
      DUE_DATE_TITLE: t('default_value_rule_strings.condition_configuration'),
      CHOOSE_FIELDS: t('default_value_rule_strings.choose_the_field'),
      RULE_NAME: t('default_value_rule_strings.rule_name'),
      USE_ADVANCED: t('default_value_rule_strings.use_advanced'),
      CONFIGURATION_TYPE: {
        LABEL: t('default_value_rule_strings.config_type_label'),
        OPTIONS: [
          {
            label: t('default_value_rule_strings.configuration_rule'),
            value: BUILDER_TYPES.CONFIGURATION_RULE,
          },
          {
            label: t('default_value_rule_strings.expression_rule'),
            value: BUILDER_TYPES.EXPRESSION,
          },
        ],
      },
      DELETE_RULE: t('default_value_rule_strings.delete_rule'),
      SAVE_RULE: t('default_value_rule_strings.save_rule'),
      CANCEL: t('default_value_rule_strings.cancel'),
      IMPORT: t('default_value_rule_strings.import'),
      FORMULA_REQUIRED: t('default_value_rule_strings.formula_required'),
      RULE_OUTPUT_TYPE: t('default_value_rule_strings.rule_output_type'),
      SEARCH_STEP: t('default_value_rule_strings.search_step'),
      EXISTING_RULE_WARNING: t('default_value_rule_strings.existing_rule_warning'),
      STEP_NAME: t('default_value_rule_strings.step_name'),
    },
    LISTING: {
      SEARCH_RULES: t('default_value_rule_strings.search_rules'),
      SHOWING: t('pagination_strings.show'),
      RULES: t('default_value_rule_strings.rules'),
      ADD_NEW: t('default_value_rule_strings.add_new_rule'),
      IMPORT_EXISTING: t('default_value_rule_strings.import_existing'),
      NO_RULE: {
        NO_CONFIG_TITLE: t('default_value_rule_strings.no_rule.no_config_title'),
        NO_RULE_TITLE: t('default_value_rule_strings.no_rule.no_rule_title'),
        YOU_HAVE_THE_OPTION_TO_CREATE_CONFIG: t('default_value_rule_strings.no_rule.you_have_the_option_to_create_config'),
        YOU_HAVE_THE_OPTION_TO_CREATE_RULE: t('default_value_rule_strings.no_rule.you_have_the_option_to_create_rule'),
        ADD_NEW_CONFIG: t('default_value_rule_strings.no_rule.add_new_config'),
        IMPORT_EXISTING_CONFIG: t('default_value_rule_strings.no_rule.import_existing_config'),
      },
      SUCCESS_POPOVER: {
        title: t('default_value_rule_strings.rule_import_successful'),
        isVisible: true,
        status: FORM_POPOVER_STATUS.SUCCESS,
      },
    },
  };
};

export const FIELD_VALUE_ALLOWED_DIRECT_FIELDS = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.EMAIL,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.CURRENCY,
  FIELD_TYPE.DATE,
  FIELD_TYPE.DATETIME,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.CHECKBOX,
  FIELD_TYPE.RADIO_GROUP,
];

export const FIELD_VALUE_ALLOWED_TABLE_FIELDS = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.EMAIL,
  FIELD_TYPE.NUMBER,
];
