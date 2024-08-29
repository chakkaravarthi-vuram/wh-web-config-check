import { translateFunction } from '../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { FIELD_CONFIG_TABS } from './FieldConfiguration.constants';

export const FIELD_INITIAL_STATE = {
  field_name: EMPTY_STRING,
  field_type: EMPTY_STRING,
  read_only: false,
  required: false,
  validations: {},
  instruction: EMPTY_STRING,
  helper_tooltip: EMPTY_STRING,
  placeholder: EMPTY_STRING,
  default_value: EMPTY_STRING,
  ruleId: EMPTY_STRING,
  errorList: {},
};

export const FIELD_CONFIGURATION_STRINGS = (t = translateFunction) => {
    return {
        TITLE: t('form_field_strings.field_config.title'),
        SHARED_PROPERTY_TEXT: t('form_field_strings.field_config.field_shared_across_steps'),
        FIELD_CONFIG_TAB: [
            {
              labelText: t('form_field_strings.field_config_title.general'),
              tabIndex: FIELD_CONFIG_TABS.BASIC_CONFIG,
              value: FIELD_CONFIG_TABS.BASIC_CONFIG,
              isEditable: false,
              Icon: null,
            },
            {
              labelText: t('form_field_strings.field_config_title.value_config'),
              tabIndex: FIELD_CONFIG_TABS.VALUE_CONFIG,
              value: FIELD_CONFIG_TABS.VALUE_CONFIG,
              isEditable: false,
              Icon: null,
            },
            {
              labelText: t('form_field_strings.field_config_title.validation_and_visibility'),
              tabIndex: FIELD_CONFIG_TABS.VALIDATION_VISIBILITY_CONFIG,
              value: FIELD_CONFIG_TABS.VALIDATION_VISIBILITY_CONFIG,
              isEditable: false,
              Icon: null,
            },
            {
              labelText: t('form_field_strings.field_config_title.additional_config'),
              tabIndex: FIELD_CONFIG_TABS.ADDITIONAL_CONFIG,
              value: FIELD_CONFIG_TABS.ADDITIONAL_CONFIG,
              isEditable: false,
              Icon: null,
            },
        ],
        TABLE_FIELD_CONFIG_TAB: [
          {
            labelText: t('form_field_strings.field_config_title.general'),
            tabIndex: FIELD_CONFIG_TABS.BASIC_CONFIG,
            value: FIELD_CONFIG_TABS.BASIC_CONFIG,
            isEditable: false,
            Icon: null,
          },
          {
            labelText: t('form_field_strings.field_config_title.validation_and_visibility'),
            tabIndex: FIELD_CONFIG_TABS.VALIDATION_VISIBILITY_CONFIG,
            value: FIELD_CONFIG_TABS.VALIDATION_VISIBILITY_CONFIG,
            isEditable: false,
            Icon: null,
          },
          {
            labelText: t('form_field_strings.field_config_title.additional_config'),
            tabIndex: FIELD_CONFIG_TABS.ADDITIONAL_CONFIG,
            value: FIELD_CONFIG_TABS.ADDITIONAL_CONFIG,
            isEditable: false,
            Icon: null,
          },
      ],
    };
};

export const FIELD_TYPES = {
  SINGLE_LINE: 'singleline',
  PARAGRAPH: 'paragraph',
  NUMBER: 'number',
  EMAIL: 'email',
  DATE: 'date',
  FILE_UPLOAD: 'fileupload',
  CURRENCY: 'currency',
  DROPDOWN: 'dropdown',
  CHECKBOX: 'checkbox',
  RADIO_GROUP: 'radiobutton',
  CASCADING: 'cascading',
  USER_TEAM_PICKER: 'userteampicker',
  USER_PROPERTY_PICKER: 'userpropertypicker',
  YES_NO: 'yesorno',
  LINK: 'link',
  INFORMATION: 'information',
  SCANNER: 'barcodescanner',
  CUSTOM_LOOKUP_CHECKBOX: 'lookupcheckbox',
  CUSTOM_LOOKUP_DROPDOWN: 'lookupdropdown',
  CUSTOM_LOOKUP_RADIOBUTTON: 'lookupradiobutton',
  DATETIME: 'datetime',

  TIME: 'time',
  USERS: 'users',
  TEAMS: 'teams',
  ADDRESS: 'address',
  RATING: 'rating',
  PERCENTAGE: 'percentage',
  TABLE: 'table',
  DATA_LIST: 'datalistpicker',
  DATA_LIST_PROPERTY_PICKER: 'datalistpropertypicker',
  PHONE_NUMBER: 'phonenumber',
};

export const TABLE_FIELD_SOURCE_TYPE = {
  INLINE: 'inline',
  EXTERNAL: 'external',
};
