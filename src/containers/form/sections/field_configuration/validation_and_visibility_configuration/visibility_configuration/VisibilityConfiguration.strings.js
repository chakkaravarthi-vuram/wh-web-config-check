export const VISIBILITY_CONFIG_STRINGS = (t) => {
    return {
        ADD_EXISTING_VISIBILITY_RULE: {
            BUTTON: t('form_field_strings.visibility_constant.add_rule'),
            CHOOSE_EXISTING: {
                TITLE: t('form_field_strings.visibility_constant.choose_existing.title'),
                RULE_LIST: {
                    PLACEHOLDER: t('form_field_strings.visibility_constant.choose_existing.rule_list.placeholder'),
                },
                SAVE: t('form_field_strings.visibility_constant.choose_existing.save'),
                CANCEL: t('form_field_strings.visibility_constant.choose_existing.cancel'),
            },
        },
        ADD_EXPRESSION: t('form_field_strings.visibility_constant.add_expression'),
        SHOW_EXISTING_CONDITION: t('form_field_strings.visibility_constant.show_existing_condition'),
        ADD_CONDITION: t('form_field_strings.visibility_constant.add_condition'),
        ADD_CONDITION_ID: 'add_condition',
        ADD_NEW_VISIBILITY_RULE: t('form_field_strings.visibility_constant.add_new_rule'),
        RULE_LIST: [
            {
            value: 1,
            label: 'Rule 1',
            isCheck: false,
            },
            {
            value: 2,
            label: 'Rule 2',
            isCheck: false,
            },
        ],
         HIDE_OR_DISABLE: {
          LABEL: t('default_value_rule_strings.hide_or_disable_label'),
          OPTIONS: [
            {
              label: t('default_value_rule_strings.hide_field'),
              value: true,
            },
            {
              label: t('default_value_rule_strings.disable_field'),
              value: false,
            },
          ],
        },
    };
};
