import { translateFunction } from '../../../../../../utils/jsUtility';

export const CONDITION_BASED_STRINGS = (t = translateFunction) => {
  return {
    CHOOSE_CONDITION: {
      ID: 'chooseCondition',
      PLACEHOLDER: t('form.form_button_config.body.choose_condition'),
      SCROLLABLE_ID: 'choose-condition-scrollable',
      SCROLLABLE_THRESOLD: 0.5,
    },
    CREATE_CONDITION: t('form.form_button_config.body.create_condition'),
    // expression and is_true_then not used, check in june-sprint and remove
    EXPRESSION: 'Expression',
    IS_TRUE_THEN: 'is true, then',
    SEARCH_CONDITION: t('flow_strings.rule_based_assignee.search_condition'),
  };
};
