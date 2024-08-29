import { translateFunction } from '../../../../../utils/jsUtility';
import {
  CALL_INTEGRATION_CONSTANTS,
  RESPONSE_FIELD_KEYS,
} from './CallIntegration.constants';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';

export const CALL_INTEGRATION_STRINGS = (t = translateFunction) => {
  return {
    TITLE: t('flow_strings.step_configuration.call_integration.title'),
    TABS: [
      {
        labelText: t('end_step_configuration_strings.end_config_tab.general'),
        value: NODE_CONFIG_TABS.GENERAL,
        tabIndex: NODE_CONFIG_TABS.GENERAL,
      },
      {
        labelText: t(
          'flow_strings.step_configuration.call_integration.error_handling_tab',
        ),
        value: NODE_CONFIG_TABS.ERROR_HANDLING,
        tabIndex: NODE_CONFIG_TABS.ERROR_HANDLING,
      },
      {
        labelText: t(
          'end_step_configuration_strings.end_config_tab.additional_configuration',
        ),
        value: NODE_CONFIG_TABS.ADDITIONAL,
        tabIndex: NODE_CONFIG_TABS.ADDITIONAL,
      },
    ],
    GENERAL: {
      EXTERNAL_SYSTEM: {
        TITLE: t(
          'flow_strings.step_configuration.call_integration.general.external_system.title',
        ),
        CHOOSE_INTEGRATION: {
          ID: RESPONSE_FIELD_KEYS.CONNECTOR_UUID,
          LABEL: t(
            'flow_strings.step_configuration.call_integration.general.external_system.choose_integration.label',
          ),
        },
        CHOOSE_ML_MODEL: {
          ID: RESPONSE_FIELD_KEYS.MODEL_ID,
          LABEL: t(
            'flow_strings.step_configuration.call_integration.general.external_system.choose_integration.label',
          ),
        },
        EVENT: {
          ID: RESPONSE_FIELD_KEYS.EVENT_UUID,
          LABEL: t(
            'flow_strings.step_configuration.call_integration.general.external_system.event.label',
          ),
        },
      },
      MAPPING: {
        TITLE: t(
          'flow_strings.step_configuration.call_integration.general.mapping.title',
        ),
        VALUE: t(
          'flow_strings.step_configuration.call_integration.general.mapping.value',
        ),
        FIELD_VALUE: t(
          'flow_strings.step_configuration.call_integration.general.mapping.field_value',
        ),
        EVENT_HEADERS: {
          TITLE: t('integration.event_headers.title'),
          TABLE_HEADERS: [
            t('integration.event_headers.header_key'),
            t('integration.event_headers.header_value'),
          ],
        },
        QUERY_PARAMS: {
          TITLE: t(
            'flow_strings.step_configuration.call_integration.general.mapping.query_params.title',
          ),
          TABLE_HEADERS: [
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.query_params.table_headers.name',
            ),
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.query_params.table_headers.value',
            ),
          ],
        },
        RELATIVE_PATH: {
          TITLE: t(
            'flow_strings.step_configuration.call_integration.general.mapping.relative_path.title',
          ),
          TABLE_HEADERS: [
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.relative_path.table_headers.name',
            ),
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.relative_path.table_headers.value',
            ),
          ],
        },
        REQUEST_BODY: {
          TITLE: t(
            'flow_strings.step_configuration.call_integration.general.mapping.request_body.title',
          ),
          TABLE_HEADERS: [
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.request_body.table_headers.name',
            ),
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.request_body.table_headers.type',
            ),
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.request_body.table_headers.is_multiple',
            ),
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.request_body.table_headers.value',
            ),
          ],
          ML_TABLE_HEADERS: [
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.request_body.table_headers.name',
            ),
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.request_body.table_headers.type',
            ),
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.request_body.table_headers.value',
            ),
          ],
        },
        SAVE_RESPONSE: {
          TITLE: t(
            'flow_strings.step_configuration.call_integration.general.mapping.save_response.title',
          ),
          IS_SAVE_RESPONSE: {
            LABEL: t(
              'flow_strings.step_configuration.call_integration.general.mapping.save_response.is_save_response.label',
            ),
            OPTIONS: [
              {
                label: 'No',
                value: false,
              },
              {
                label: 'Yes',
                value: true,
              },
            ],
          },
          TABLE_HEADERS: [
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.save_response.table_headers.name',
            ),
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.save_response.table_headers.type',
            ),
            t(
              'flow_strings.step_configuration.call_integration.general.mapping.save_response.table_headers.field',
            ),
            '',
          ],
          RESPONSE_DETAILS: {
            TITLE: t(
              'flow_strings.step_configuration.call_integration.general.mapping.save_response.response_details.title',
            ),
          },
        },
      },
    },
    ERROR_HANDLING: {
      RETRY: {
        TITLE: t(
          'flow_strings.step_configuration.call_integration.error_handling.retry.title',
        ),
        LABEL: t(
          'flow_strings.step_configuration.call_integration.error_handling.retry.label',
        ),
        INPUT_LABEL: 'Retry Duration',
      },
      ERROR_PATH: {
        TITLE: t(
          'flow_strings.step_configuration.call_integration.error_handling.error_path.title',
        ),
        LABEL: t(
          'flow_strings.step_configuration.call_integration.error_handling.retry.label',
        ),
        OPTIONS: [
          {
            label: t(
              'flow_strings.step_configuration.call_integration.error_handling.error_path.options.continue_flow.label',
            ),
            value: CALL_INTEGRATION_CONSTANTS.ERROR_ACTION_CONTINUE,
          },
          {
            label: t(
              'flow_strings.step_configuration.call_integration.error_handling.error_path.options.failure_action.label',
            ),
            value: CALL_INTEGRATION_CONSTANTS.ERROR_ACTION_SPLIT,
          },
        ],
      },
    },
    ERROR_MESSAGES: {
      RESPONSE_FORMAT_REQUIRED: 'Response Format is required',
    },
  };
};

export const getRetryOptions = (t, chosenRetries = []) => [
  {
    label: t('flow_strings.step_configuration.retry_options.first_retry.label'),
    value: CALL_INTEGRATION_CONSTANTS.RETRY_OPTIONS.FIRST_RETRY,
    disabled: false,
    selected: chosenRetries.includes(
      CALL_INTEGRATION_CONSTANTS.RETRY_OPTIONS.FIRST_RETRY,
    ),
    placeholder: '00 min',
  },
  {
    label: t(
      'flow_strings.step_configuration.retry_options.second_retry.label',
    ),
    value: CALL_INTEGRATION_CONSTANTS.RETRY_OPTIONS.SECOND_RETRY,
    disabled: !chosenRetries?.includes(
      CALL_INTEGRATION_CONSTANTS.RETRY_OPTIONS.FIRST_RETRY,
    ),
    selected: chosenRetries.includes(
      CALL_INTEGRATION_CONSTANTS.RETRY_OPTIONS.SECOND_RETRY,
    ),
    placeholder: '00 min',
  },
  {
    label: t('flow_strings.step_configuration.retry_options.third_retry.label'),
    value: CALL_INTEGRATION_CONSTANTS.RETRY_OPTIONS.THIRD_RETRY,
    disabled: !chosenRetries?.includes(
      CALL_INTEGRATION_CONSTANTS.RETRY_OPTIONS.SECOND_RETRY,
    ),
    selected: chosenRetries.includes(
      CALL_INTEGRATION_CONSTANTS.RETRY_OPTIONS.THIRD_RETRY,
    ),
    placeholder: '00 min',
  },
];
