import { SYSTEM_FIELDS } from '../../../../../utils/SystemFieldsConstants';
import { translateFunction } from '../../../../../utils/jsUtility';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';
import { TRIGGER_CONSTANTS } from './CallAnotherFlow.constants';

export const TRIGGER_CONFIG_TAB = (t = translateFunction) => [
  {
    labelText: t('end_step_configuration_strings.end_config_tab.general'),
    value: NODE_CONFIG_TABS.GENERAL,
    tabIndex: NODE_CONFIG_TABS.GENERAL,
  },
  {
    labelText: t(
      'end_step_configuration_strings.end_config_tab.additional_configuration',
    ),
    value: NODE_CONFIG_TABS.ADDITIONAL,
    tabIndex: NODE_CONFIG_TABS.ADDITIONAL,
  },
];

export const SUBFLOW_CHECKBOX_OPTIONS = (t = translateFunction) => {
 return {
  IS_ASYNC: {
    label: t('call_another_flow.checkbox_options.is_subflow_async'),
    value: TRIGGER_CONSTANTS.IS_ASYNC,
    selected: false,
  },
  IS_MNI: {
    label: t('call_another_flow.checkbox_options.allow_multiple_calls'),
    value: true,
  },
};
};

export const EXCEPTION_HANDLING_STRINGS = (t = translateFunction) => {
  return {
    SUB_FLOW: {
      LABEL: t('call_another_flow.exception_handling.title'),
      ID: 'exceptionHandling',
      OPTION: {
        label: t('call_another_flow.exception_handling.label'),
        value: true,
      },
    },
  };
};

export const CANCEL_SUB_FLOW_OPTIONS = (t = translateFunction) => {
  return {
    OPTION: {
      label: t('call_another_flow.exception_handling.label'),
      value: true,

    },
  };
};

// Sample data for dropdown
export const FLOW_FIELDS_DROPDOWN = [
  {
    label: 'User Field List 1',
    value: 'User Field List 1',
    isHeaderWithBg: true,
    header: 'User added fields',
  },
  {
    label: 'User Field List 2',
    value: 'User Field List 2',
    isHeaderWithBg: true,
    header: 'User added fields',
  },
  {
    label: 'User Field List 3',
    value: 'User Field List 3',
    isHeaderWithBg: true,
    header: 'User added fields',
  },
  {
    label: 'System Field List 1',
    value: 'System Field List 1',
    isHeaderWithBg: true,
    header: 'System added fields',
  },
  {
    label: 'System Field List 2',
    value: 'System Field List 2',
    isHeaderWithBg: true,
    header: 'System added fields',
  },
  {
    label: 'System Field List 3',
    value: 'System Field List 3',
    isHeaderWithBg: true,
    header: 'System added fields',
  },
];

export const VALUE_TO_BE_PASSED = (t) => [
  {
    label: t('call_another_flow.value_to_be_passed.flow_fields'),
    value: '1',
  },
  {
    label: t('call_another_flow.value_to_be_passed.static_value'),
    value: '2',
  },
];

export const SUB_FLOW_SYSTEM_FIELDS = [
  SYSTEM_FIELDS.FLOW_ID,
  SYSTEM_FIELDS.CREATED_ON,
  SYSTEM_FIELDS.CREATED_BY,
  SYSTEM_FIELDS.UPDATED_ON,
  SYSTEM_FIELDS.UPDATED_BY,
  SYSTEM_FIELDS.FLOW_LINK,
];

export const TABLE_HEADERS = (t) => [
  t('call_another_flow.table_headers.input_field'),
  t('call_another_flow.table_headers.field_type'),
  t('call_another_flow.table_headers.value_to_passed'),
];

export const CALL_ANOTHER_FLOW_STRINGS = (t) => {
  return {
    ITERATE_SUBFLOW_CONTENT: t(
      'call_another_flow.call_another_flow_strings.iterate_subflow_content',
    ),
    ITERATE_SUBFLOW_CONTENT_SEARCH: t(
      'call_another_flow.call_another_flow_strings.iterate_subflow_content_search',
    ),
    INPUTS_TO_SUBFLOW: t(
      'call_another_flow.call_another_flow_strings.inputs_to_subflow',
    ),
    SUBFLOW_DETAILS: t(
      'call_another_flow.call_another_flow_strings.subflow_details',
    ),
    CHOOSE_SUB_FLOW: t(
      'call_another_flow.call_another_flow_strings.choose_sub_flow',
    ),
    MODAL_TITLE: t(
      'call_another_flow.call_another_flow_strings.modal_title',
    ),
    CHOOSE_FLOW_FIELDS: t(
      'call_another_flow.call_another_flow_strings.choose_flow_fields',
    ),
    CHOOSE_FLOW_SEARCH_PLACEHOLDER: t(
      'call_another_flow.call_another_flow_strings.choose_flow_search_placeholder',
    ),
    ADD_FIELD: t(
      'flow_trigger.mapping_constants.add_field',
    ),
    ADD_COLUMN: t(
      'flow_trigger.mapping_constants.add_column',
    ),
  };
};
