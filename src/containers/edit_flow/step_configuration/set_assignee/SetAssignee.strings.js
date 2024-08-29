import { translateFunction } from '../../../../utils/jsUtility';

export const SET_ASSIGNEE_STRINGS = (t = translateFunction) => {
  return {
    SET_ASSIGNEE: {
      TITLE: t('set_assignee.set_assignee.title'),
      SUB_TEXT: t('set_assignee.set_assignee.sub_text'),
      CHOOSE_ACTOR_LABEL: t('flows.basic_info_and_actors.actors_strings.choose_actor_label'),
      ADD_ACTOR: t('set_assignee.set_assignee.add_actor'),
      SUB_TEXT_2: t('set_assignee.set_assignee.sub_text_2'),
      TEXT_2: t('set_assignee.set_assignee.text_2'),
      CHANGE: t('set_assignee.set_assignee.change'),
      VALIDATION_STRINGS: {
        VALIDATION_LABELS: {
          USER_OR_TEAM: t('set_assignee.set_assignee.validation_labels.user_or_team'),
          ANY_OF_THE_PREVIOUS_STEP: t('set_assignee.set_assignee.validation_labels.any_of_the_previous_step'),
          RULE: t('set_assignee.set_assignee.validation_labels.rule'),
          USER_SELECTOR_FORM_FIELD: t('set_assignee.set_assignee.validation_labels.user_selector_form_field'),
          SYSTEM_FIELD: t('set_assignee.set_assignee.validation_labels.system_field'),
          FORM_FIELD: t('set_assignee.set_assignee.validation_labels.form_field'),
          RULE_BASED: t('set_assignee.set_assignee.validation_labels.rule_based'),
        },
        VALIDATION_MESSAGE: {
          USER_OR_TEAM: t('set_assignee.set_assignee.validation_message.user_or_team'),
          SYSTEM_FIELD: t('set_assignee.set_assignee.validation_message.system_field'),
          RULE: t('set_assignee.set_assignee.validation_message.rule'),
          FORM_FIELD: t('set_assignee.set_assignee.validation_message.form_field'),
          RULE_BASED: t('set_assignee.set_assignee.validation_message.rule_based'),
        },
      },
    },
    DUE_DATE: {
      TITLE: t('set_assignee.due_date.title'),
      SUB_TEXT: t('set_assignee.due_date.sub_text'),
      TABLE_HEADER: [t('set_assignee.due_date.table_header.rule_name'), ''],
      SET_CONFIGURATION_RULE: t('set_assignee.due_date.set_configuration_rule'),
      DURATION: {
        ID: 'duration',
      },
      DURATION_TYPE: {
        ID: 'duration_type',
        OPTIONS: [
          { label: t('set_assignee.due_date.days'), value: 'days' },
          { label: t('set_assignee.due_date.hours'), value: 'hours' },
        ],
      },
    },
    ESCALATION: {
      TITLE: t('set_assignee.escalation.title'),
      SUB_TEXT: t('set_assignee.escalation.sub_text'),
      TABLE_HEADER: [
        t('set_assignee.escalation.table_header.then_mail'),
        t('set_assignee.escalation.table_header.escalate_after'),
        '',
      ],
      ADD_ESCALATION: t('set_assignee.escalation.add_escalation'),
      DELETE_ESCALATION: t('set_assignee.escalation.delete_escalation'),
      DELETE_ESCALATION_SUB_TEXT_1: t(
        'set_assignee.escalation.delete_escalation_sub_text_1',
      ),
    },
    CUSTOMIZED_STATUS: {
      TITLE: t('set_assignee.customized_status.title'),
      VALIDATION_MESSAGE: (min, max) => `Status should be ${min} to ${max} characters`,
      REQUIRED: 'Status is required',
      UNIQUE: 'Status is added already',
      ADD_NEW: {
        LABEL: 'Add new',
        BACK: 'Back',
        SECONDARY: 'Cancel',
        PRIMARY: 'Add',
      },
      SEARCH_PLACEHOLDER: 'Search status',
      NO_OPTION: 'No data found!',
      STATUS_TYPE: {
        ID: 'customized_status',
      },
    },
  };
};
