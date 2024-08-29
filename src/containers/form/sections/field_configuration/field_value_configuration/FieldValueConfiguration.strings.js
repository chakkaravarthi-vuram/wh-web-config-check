import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../../../../../utils/constants/form/form.constant';
import { translateFunction } from '../../../../../utils/jsUtility';

export const DEFAULT_VALUE_FIELD_CONFIG_STRINGS = (t = translateFunction) => {
    return {
      DEFAULT_VALUE: {
        ID: 'default_value',
        LABEL: t('form_field_strings.field_config.default_value.label'),
        PLACEHOLDER: t('form_field_strings.field_config.default_value.placeholder'),
        INSTRUCTION: t('form_field_strings.field_config.default_value.instruction'),
        EXPRESSION: {
          TITLE: t('form_field_strings.field_config.default_value.expression.title'),
          BUTTON: t('form_field_strings.field_config.default_value.expression.button'),
        },
        OR: t('form_field_strings.field_config.default_value.or'),
        USER_SELECTOR: {
          DEFAULT_VALUE_OPTION_LIST: [
            {
              label: t('form_field_strings.other_config.user_selector_default_value.label_1'),
              value: REQUEST_FIELD_KEYS.CREATED_BY,
            },
            {
              label: t('form_field_strings.other_config.user_selector_default_value.label_2'),
              value: REQUEST_FIELD_KEYS.LAST_UPDATED_BY,
            },
            {
              label: t('form_field_strings.other_config.user_selector_default_value.label_3'),
              value: REQUEST_FIELD_KEYS.LOGGED_IN_USER,
            },
          ],
          OPERATIONS: (isMultiple = false) => [
            {
              value: RESPONSE_FIELD_KEYS.REPLACE,
              label: t('form_field_strings.form_field_constants.replace'),
            },
            {
              value: RESPONSE_FIELD_KEYS.APPEND,
              label: t('form_field_strings.form_field_constants.merge'),
              disabled: !isMultiple,
            },
          ],
        },
        EXTERNAL_SOURCE: {
          BUTTON: t('form_field_strings.field_config.external_source.button'),
          TITLE: t('form_field_strings.field_config.external_source.title'),
          EDIT_TITLE: t('form_field_strings.field_config.external_source.edit_title'),
        },
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
        VALUE_FORMATER: {
          ID: 'is_digit_formatted',
          OPTION_LIST: [{ label: t('form_field_strings.other_config.value_formator.label'), value: 1 }],
        },
        YES_NO_OPTIONS: [
          {
            label: 'Yes',
            value: true,
          },
          {
            label: 'No',
            value: false,
          },
        ],
        LINK: {
          L_PLACEHOLDER: t('form_field_strings.field_config.link_text.label'),
          R_PLACEHOLDER: `${t('form_field_strings.field_config.link_text.new_placeholder')} https://`,
          CUSTOM_VALID_LINK: t('validation_constants.messages.custom_valid_link'),
        },
        SHARED_PROPERTY_TEXT: t('form_field_strings.field_config.shared_property_text'),
        CHECKBOX: {
          SELECT_ALL: {
            LABEL: t('form_field_strings.other_config.select_all.label'),
            ID: 'is_digit_formatted',
            OPTION_LIST: [
              {
                label: t('form_field_strings.other_config.select_all.option_list.yes.label'),
                value: true,
              },
              {
                label: t('form_field_strings.other_config.select_all.option_list.no.label'),
                value: false,
              },
            ],
          },
        },
      },
    };
};
