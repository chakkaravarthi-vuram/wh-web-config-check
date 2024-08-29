// import { translate } from 'language/config';
import { translateFunction } from 'utils/jsUtility';
import { FIELD_TYPE } from '../../utils/constants/form_fields.constant';

export const FIELD_LABEL = (t = translateFunction) => {
  return {
    OF: t('default_value_rule_strings.of'),
    BETWEEN: t('default_value_rule_strings.between'),
    CONCAT: t('default_value_rule_strings.concat'),
    PICK: t('default_value_rule_strings.pick'),
    DIVIDE: t('default_value_rule_strings.divide'),
    MULTIPY: t('default_value_rule_strings.multiply'),
    ID: 'lValue',
  };
};

export const VALUE_LABEL = (t = translateFunction) => {
  return {
    AND: t('default_value_rule_strings.and'),
    WITH: t('default_value_rule_strings.with'),
    ID: 'rValue',
  };
};
export const ALLOW_DYNAMIC_SEARCH_FIELDS = [
  FIELD_TYPE.RADIO_BUTTON,
  FIELD_TYPE.CHECKBOX,
  FIELD_TYPE.DROPDOWN,
  // 'radio', 'checkbox', 'dropdown'
];

export const ADD_NEW_R_VALUE = {
  ID: 'addNewRvalue',
  LABEL: 'default_value_rule_strings.add_new',
};

export const OPERATOR_PICKER_VALUE = {
  LABEL: 'default_value_rule_strings.operators',
};

export const EXTRA_PARAMS_TYPE = {
  ROUNDING: 'rounding',
  CONCAT: 'concat',
  CURRENCY: 'currency',
};

export const CONFIGURATION_RULE_BUILDER = {
  FIELDS: {
    OPERATOR: {
      ID: 'operator',
      LABEL: 'default_value_rule_strings.choose_operator',
      PLACEHOLDER: 'configure_rule.select_operator',
    },
    ROUNDING_LIST: {
      ID: 'roundingList',
      LABEL: 'default_value_rule_strings.rounded_result',
    },
    CURRENCY_TYPE: {
      ID: 'currencyType',
      LABEL: 'default_value_rule_strings.currency_type',
    },
    CONCAT_WITH: {
      ID: 'concatWith',
      LABEL: 'default_value_rule_strings.concat_with',
    },
    ADD_NEW_R_VALUE: {
      ID: 'addNewRvalue',
      LABEL: 'default_value_rule_strings.add_new',
    },
    FIELD: {
      PLACEHOLDER: 'common_strings.select_a_value',
      NO_VALUE_FOUND: 'form_field_strings.error_text_constant.no_values_found',
    },
  },
  COMMON_LABEL: {
    NO_FIELDS: 'form_field_strings.error_text_constant.no_values_found',
    DATA_LIST: 'basic_config_strings.data_list_search',
    SEARCH_A_FIELD: 'basic_config_strings.search_a_field',
  },
};

export const INITIAL_PAGE = 1;
export const MAX_PAGINATION_SIZE = 15;
