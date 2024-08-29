// import { translate } from 'language/config';
import { translateFunction } from 'utils/jsUtility';

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

export const ROUNDING_LIST = {
  ID: 'roundingList',
  LABEL: 'default_value_rule_strings.rounded_result',
};

export const CURRENCY_TYPE = {
  ID: 'currencyType',
  LABEL: 'default_value_rule_strings.currency_type',
};

export const CONCAT_WITH = {
  ID: 'concatWith',
  LABEL: 'default_value_rule_strings.concat_with',
};

export const ADD_NEW_R_VALUE = {
  ID: 'addNewRvalue',
  LABEL: 'default_value_rule_strings.add_new',
};

export const OPERATOR_PICKER = {
  ID: 'operator',
  LABEL: 'default_value_rule_strings.choose_operator',
};

export const OPERATOR_PICKER_VALUE = {
LABEL: 'default_value_rule_strings.operators',
};
export const BASIC_CONFIG_STRINGS = {
  PLACEHOLDER: {
     DATA_LIST: 'basic_config_strings.data_list_search',
     SEARCH_A_FIELD: 'basic_config_strings.search_a_field',
  },
};

export const DEFAULT_VALUE_CONFIG_STRINGS = {
  NO_FIELDS: 'form_field_strings.error_text_constant.no_values_found',
  NO_RULES: 'form_field_strings.error_text_constant.no_rules_found',
};
