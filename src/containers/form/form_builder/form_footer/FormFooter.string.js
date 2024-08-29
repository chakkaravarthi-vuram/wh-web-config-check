import i18next from 'i18next';
import { ALLOW_COMMENTS, CONTROL_TYPES, FORM_ACTION_TYPES, VISIBILITY_TYPES } from './FormFooter.constant';

export const ALL_BUTTON_CONFIG_FIELD_ID = {
  IS_NEXT_STEP_RULE: 'is_next_step_rule',
};

export const CREATE_FORM_STRINGS = (t = i18next.t) => {
  return {
    FORM_CONFIG: {
      MODAL_ID: 'InitialFormConfiguration',
      HEADER: {
        CONTENT: t('form.form_header.header.content'),
        TITLE: t('form.form_header.header.title'),
        FORM_SETTINGS_ICON_ARIA_LABEL: t(
          'form.form_header.header.form_settings_icon_aria_label',
        ),
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
        FORM_TITLE_DYNAMIC_ID_APPEND_ID: 'is_dynamic_append', // exclude for localization
        FORM_TITLE_DYNAMIC_ID_APPEND_CONTENT: t(
          'form.form_header.header.form_title_dynamic_id_append_content',
        ),
      },
      BODY: {
        IMPORT_FORM_BUTTON: t('form.form_header.body.import_form_button'),
      },
      FOOTER: {
        SAVE_BUTTON: t('form.form_header.footer.save_button'),
        CANCEL_BUTTON: t('form.form_header.footer.cancel_button'),
      },
    },
    FORM_BUTTON_CONFIG: {
      ADD_BUTTON: t('form.form_button_config.add_button'),
      MORE: t('common_strings.more_label'),
      MODAL_ID: t('FormButtonConfig'),
      JOI_LABELS: {
        ACTION: t('form.form_button_config.joi_labels.action'),
        ACTION_TYPE: t('form.form_button_config.joi_labels.action_type'),
        BUTTON_POSITION: t(
          'form.form_button_config.joi_labels.button_position',
        ),
        BUTTON_COLOR: t('form.form_button_config.joi_labels.button_color'),
        ALLOW_COMMENTS: t('form.form_button_config.joi_labels.allow_comments'),
      },
      HEADER: {
        CONTENT: t('form.form_button_config.header.content'),
        TAB: {
          BASIC: t('form.form_button_config.header.basic'),
          VISIBILITY: t('form.form_button_config.header.visibility'),
        },
      },
      BODY: {
        BUTTON_LABEL: t('form.form_button_config.body.button_label'),
        BUTTON_LABEL_ID: 'label',
        BUTTON_LABEL_PLACEHOLDER: t(
          'form.form_button_config.body.button_label_placeholder',
        ),
        BUTTON_TYPES: [
          {
            label: t('form.form_button_config.body.button_types.forward'),
            value: FORM_ACTION_TYPES.FORWARD,
          },
          {
            label: t('form.form_button_config.body.button_types.complete'),
            value: FORM_ACTION_TYPES.END_FLOW,
          },
          {
            label: t('form.form_button_config.body.button_types.reject'),
            value: FORM_ACTION_TYPES.SEND_BACK,
          },
          {
            label: t('form.form_button_config.body.button_types.cancel'),
            value: FORM_ACTION_TYPES.CANCEL,
          },
          {
            label: t(
              'form.form_button_config.body.button_types.additional_review',
            ),
            value: FORM_ACTION_TYPES.ASSIGN_REVIEW,
          },
        ],
        BUTTON_TYPE_ID: 'button_type',
        BUTTON_TYPE_LABEL: t('form.form_button_config.body.button_type_label'),
        NEED_COMMENT_STATUS_ID: 'allow_comments',
        NEED_COMMENT_STATUS_LABEL: t(
          'form.form_button_config.body.need_comment_status_label',
        ),
        ALLOW_COMMENTS_TYPES: [
          {
            label: t('form.form_button_config.body.allow_comment_types.no_comments'),
            value: ALLOW_COMMENTS.NO_COMMENTS,
          },
          {
            label: t('form.form_button_config.body.allow_comment_types.optional'),
            value: ALLOW_COMMENTS.OPTIONAL,
          },
          {
            label: t('form.form_button_config.body.allow_comment_types.mandatory'),
            value: ALLOW_COMMENTS.REQUIRED,
          },
        ],
        CONTROL_TYPE_LABEL: 'Action controls to be available to the another user',
        CONTROL_TYPE_OPTIONS: [
          {
            label: 'Full control',
            value: CONTROL_TYPES.FULL_CONTROL,
          },
          {
            label: 'Should review and send to original user',
            value: CONTROL_TYPES.REVIEW_SEND_TO_OWNER,
          },
        ],
        NEXT_STEP_DROPDOWN_LABEL: 'Choose next step',
        NEXT_STEP_DROPDOWN_CREATE_LABEL: t(
          'form.form_button_config.body.next_step_dropdown_create_label',
        ),
        NEXT_STEP_DROPDOWN_CHOOSE_LABEL: t(
          'form.form_button_config.body.next_step_dropdown_choose_label',
        ),
        NEXT_STEP_DROPDOWN_LIST_NOT_FOUND_LABEL: t(
          'form.form_button_config.body.next_step_dropdown_list_not_found_label',
        ),
        NEXT_STEP_MULTI_SELECT_DROPDOWN_BUTTON_LABEL: t(
          'form.form_button_config.body.next_step_multi_select_dropdown_button_label',
        ),
        NEXT_STEP_DROPDOWN_PLACEHOLDER: t(
          'form.form_button_config.body.next_step_dropdown_placeholder',
        ),
        NEXT_STEP_CONFIGURATION_LABEL: t('form.form_button_config.body.next_step_configuration_label'),
        NEXT_STEP_CONFIGURATION_OPTIONS: [
          { label: t('form.form_button_config.body.Choose_next_step'), value: false },
          { label: t('form.form_button_config.body.conditionally_configure_the_next_step'), value: true },
        ],
        CONDITIONALLY_CONFIGURE_NEXT_STEP: t(
          'form.form_button_config.body.conditionally_configure_next_step',
        ),
        CONDITIONALLY_CONFIGURE_VISIBILITY: t(
          'form.form_button_config.body.conditionally_configure_visibility',
        ),
        ADD_MORE_CONDITION: t('flows.query_builder.add_more_condition'),
        ELSE: t('form.form_button_config.body.else'),
        EXPRESSION: t('form.form_button_config.body.expression'),
        IS_TRUE_THEN: t('form.form_button_config.body.is_true_then'),
        CHOOSE_CONDITION: t('form.form_button_config.body.choose_condition'),
        CREATE_CONDITION: t('form.form_button_config.body.create_condition'),
        EXPRESSION_TYPE: t('form.form_button_config.body.expression_type'),
        RULE: t('form.form_button_config.body.rule'),
        STEP: t('form.form_button_config.body.step'),
        CREATE_STEP: t('form.form_button_config.body.create_step'),
        HIDE_OR_DISABLE: {
          LABEL: t('default_value_rule_strings.hide_or_disable_label'),
          OPTIONS: [
            {
              label: t('default_value_rule_strings.hide_field'),
              value: VISIBILITY_TYPES.HIDE,
            },
            {
              label: t('default_value_rule_strings.disable_field'),
              value: VISIBILITY_TYPES.DISABLE,
            },
          ],
        },
        ACTION: t('form.form_button_config.joi_labels.action'),
        LABEL_ALREADY_EXISTS: t('form.form_button_config.body.label_already_exists'),
        CONDITION_SCROLLABLE_ID: 'condition-scrollable-id',
        CONDITION_SCROLLABLE_THRESHOLD: 0.5,
      },
      FOOTER: {
        SAVE_BUTTON: t('form.form_button_config.footer.save_button'),
        CANCEL_BUTTON: t('form.form_button_config.footer.cancel_button'),
        DELETE_BUTTON: t('form.form_button_config.footer.delete_button'),
      },
    },
  };
};

export const RULE_DEFAULT_OBJECT = {
  if: [
    {
      expression_type: 'string',
      rule_id: 'rule_id_1',
      output_value: ['497f6eca-6276-4993-bfeb-53cbbbba6f08'],
    },
    {
      expression_type: 'string',
      rule_id: 'rule_id_2',
      output_value: ['497f6eca-6276-4993-bfeb-53cbbbba6f08'],
    },
  ],
  else_output_value: ['64f9957b34619c4628cd0595'],
};
