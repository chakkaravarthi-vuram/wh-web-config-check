import { FIELD_TYPE } from '../../../utils/constants/form.constant';
import { translateFunction } from '../../../utils/jsUtility';

export const FIELD_VISIBILITY_STRINGS = (t = translateFunction) => {
  return {
    MODAL: {
      ID: 'field_visibility_rule',
      CONDITIONAL_BUILDER: t('default_value_rule_strings.condition_builder'),
      EXPRESSION_BUILDER: t('default_value_rule_strings.expression_builder'),
      CONDITIONAL_BUILDER_ID: 'field_visibility_condition_builder',
      TITLE: t('default_value_rule_strings.condition_configuration'),
      ASSIGNEE_TITLE: t('default_value_rule_strings.condition_configuration'),
      CHOOSE_FIELDS: t('default_value_rule_strings.choose_the_field'),
      USE_ADVANCED: t('default_value_rule_strings.use_advanced'),
      RULE_NAME: t('default_value_rule_strings.rule_name'),
      CONFIGURATION_TYPE: {
        ID: 'configuration_type',
        LABEL: t('default_value_rule_strings.config_type_label'),
        OPTIONS: [
          {
            label: t('default_value_rule_strings.condition_builder'),
            value: 0,
          },
          {
            label: t('default_value_rule_strings.expression_builder'),
            value: 1,
          },
        ],
      },
      HIDE_OR_DISABLE: {
        ID: 'hide_or_disable',
        LABEL: t('default_value_rule_strings.hide_or_disable_label'),
        OPTIONS: [
          {
            label: t('default_value_rule_strings.hide_field'),
            value: 'hide',
          },
          {
            label: t('default_value_rule_strings.disable_field'),
            value: 'disable',
          },
        ],
      },
      DELETE_RULE: t('default_value_rule_strings.delete_rule'),
      SAVE_RULE: t('default_value_rule_strings.save_rule'),
      CANCEL: t('default_value_rule_strings.cancel'),
      FORMULA_REQUIRED: t('default_value_rule_strings.formula_required'),
      EXISTING_RULE_WARNING: t('default_value_rule_strings.existing_rule_warning'),
      CONFIRM_BUILDER_TYPE_CHANGE: t('default_value_rule_strings.confirm_builder_type_change'),
    },
    ERRORS: {
      RULE_NAME_EXISTS: t('default_value_rule_strings.errors.rule_name_exists'),
      FIELD_REQUIRED: t('default_value_rule_strings.errors.field_required'),
    },
    DELETE: {
      ID: 'delete_rule',
      DELETE_MODAL_TITLE: t('default_value_rule_strings.delete.delete_modal_title'),
      DELETE_MODAL_SUB_TITLE_FIRST: t('default_value_rule_strings.delete.delete_modal_sub_title_first'),
      DELETE_MODAL_SUB_TITLE_SECOND: '',
      DELETE_MODAL_YES_ACTION: t('default_value_rule_strings.delete.delete_modal_yes_action'),
      DELETE_MODAL_NO_ACTION: t('default_value_rule_strings.delete.delete_modal_no_action'),
    },
  };
};

export const FIELD_VISIBILITY_ALLOWED_FIELD = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.DATE,
  FIELD_TYPE.DATETIME,
  FIELD_TYPE.CURRENCY,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.EMAIL,
  FIELD_TYPE.CHECKBOX,
  FIELD_TYPE.RADIO_GROUP,
  FIELD_TYPE.YES_NO,
  FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
  FIELD_TYPE.PHONE_NUMBER,
  FIELD_TYPE.USER_TEAM_PICKER,
  FIELD_TYPE.SCANNER,
  FIELD_TYPE.FILE_UPLOAD,
];
