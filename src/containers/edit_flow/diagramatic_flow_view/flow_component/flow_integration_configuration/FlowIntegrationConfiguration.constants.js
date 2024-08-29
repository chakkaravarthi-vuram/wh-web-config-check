import { translate } from 'language/config';
import { STEP_TYPE } from 'utils/Constants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

export const INTEGRATION_FAILURE_ACTION = {
    CONTINUE: 'continue_flow',
    ASSIGN_TO_STEP: 'assign_to_step',
};

export const INTEGRATION_CONSTANTS = {
    TITLE: 'integration.integration_constants.title',
    INTEGRATION_CONSTANTS: 'integration_configruation',
    BASIC_CONFIGURATION: {
        APP: {
            ID: 'app',
            LABEL: 'integration.integration_constants.app_label',
            PLACEHOLDER: 'integration.integration_strings.add_integration.title',
            CONTAINER: 'ddChangeIntegrationContainer',
            APP_ID: 'connector_uuid',
            DELETED: 'The selected app has been deleted',
          },
        STEP_NAME: {
          ID: 'step_name',
          LABEL: 'integration.integration_constants.step_name_label',
        },
        STEP_DESCRIPTION: {
            ID: 'step_description',
            LABEL: 'integration.integration_constants.step_description_label',
        },
        EVENT: {
            ID: 'event',
            LABEL: 'integration.integration_constants.event.label',
            PLACEHOLDER: 'integration.integration_constants.event.placeholder',
            CONTAINER: 'ddChangeEventContainer',
            NO_EVENTS: 'integration.integration_constants.event.no_events',
            EVENT_ID: 'event_uuid',
            SEARCH: 'integration.integration_constants.event.search',
            DELETED: 'elected event has been deleted',
            NOT_FOUND: 'No Events Found',
            TITLE_OPTION: 'Title',
        },
        BUTTONS: {
            CANCEL: {
                LABEL: 'integration.integration_constants.buttons.cancel',
            },
            BACK: {
                LABEL: 'integration.integration_constants.buttons.back',
            },
            CONTINUE: {
                LABEL: 'integration.integration_constants.buttons.continue',
            },
            NEXT: {
                LABEL: 'integration.integration_constants.buttons.next',
            },
            SAVE_INTEGRATION: {
                LABEL: 'integration.integration_constants.buttons.save',
            },
            SAVE: {
                LABEL: 'integration.integration_constants.buttons.save_and_close',
            },
        },
    },
    REQUEST_CONFIGURATION: {
        TITLE: 'integration.integration_constants.request_configuration.title',
        HEADING: 'integration.integration_constants.request_configuration.heading',
        HEADERS: {
            TITLE: 'integration.integration_constants.request_configuration.headers.title',
            ID: 'event_headers',
            TEST_ID: 'test_event_headers',
            HEADER: [
                translate('integration.integration_constants.request_configuration.header.key'),
                translate('integration.integration_constants.request_configuration.header.value'),
            ],
            KEY: {
                ID: 'key',
                KEY_ID: 'key_uuid',
                LABEL: 'integration.integration_constants.request_configuration.header.key',
            },
            VALUE: {
                PLACEHOLDER: 'integration.integration_constants.request_configuration.choose_field',
                ID: 'value',
                LABEL: 'integration.integration_constants.request_configuration.header.value',
                TYPES: {
                    DIRECT: 'direct',
                    EXPRESSION: 'expression',
                },
            },
        },
        QUERY: {
            TITLE: 'integration.integration_constants.request_configuration.query.title',
            ID: 'query_params',
            TEST_ID: 'test_query_params',
            HEADER: [
                translate('integration.integration_constants.request_configuration.header.key'),
                translate('integration.integration_constants.request_configuration.header.value'),
            ],
            KEY: {
                ID: 'key',
                KEY_ID: 'key_uuid',
                LABEL: 'integration.integration_constants.request_configuration.header.key',
            },
            VALUE: {
                PLACEHOLDER: 'integration.integration_constants.request_configuration.choose_field',
                ID: 'value',
                LABEL: 'integration.integration_constants.request_configuration.header.value',
                TYPES: {
                    DIRECT: 'direct',
                    EXPRESSION: 'expression',
                },
            },
        },
        RELATIVE_PATH: {
            TITLE: 'integration.feature_integration_strings.relative_path',
            ID: 'relative_path',
            HEADER: [
                translate('integration.integration_constants.request_configuration.header.key'),
                translate('integration.integration_constants.request_configuration.header.value'),
            ],
            KEY: {
                ID: 'key',
                KEY_ID: 'key_uuid',
            },
            VALUE: {
                PLACEHOLDER: 'integration.integration_constants.request_configuration.choose_field',
                ID: 'value',
                TYPES: {
                    DIRECT: 'direct',
                    EXPRESSION: 'expression',
                },
            },
        },
        REQUEST_BODY_HEADERS: [
            translate('integration.integration_constants.request_body_headers.key'),
            translate('integration.integration_constants.request_body_headers.type'),
            translate('integration.integration_constants.request_body_headers.is_multiple'),
            translate('integration.integration_constants.request_body_headers.field'),
        ],
        REQUEST_BODY_HEADERS_ML: [
            translate('integration.integration_constants.request_body_headers.key'),
            translate('integration.integration_constants.request_body_headers.type'),
            translate('integration.integration_constants.request_body_headers.field'),
        ],
        REQUEST_BODY: {
            TITLE: translate('integration.integration_constants.request_body_headers.request_body_title'),
        },
    },
   TEST_INTEGRATION_CONFIGURATION: {
        TITLE: translate('integration.integration_constants.test_integration_configuration.title'),
        CONFIRMATION: {
            TITLE: 'integration.integration_constants.test_integration_configuration.confirmation_title',
            ID: 'confirm_test',
            BUTTON_LABEL: 'integration.integration_constants.test_integration_configuration.test_label',
            OPTIONS: [
                {
                    label: translate('flows.start_node_config.schedule_flow.yes_label'),
                    value: 1,
                },
                {
                    label: translate('flows.start_node_config.schedule_flow.no_label'),
                    value: 0,
                },
            ],
        },
        HEADING: 'integration.integration_constants.test_integration_configuration.test_label',
        HEADERS: {
            TITLE: 'integration.integration_constants.request_configuration.headers.title',
            ID: 'event_headers',
            TEST_ID: 'test_event_headers',
            HEADER: [
                translate('integration.integration_constants.request_configuration.header.key'),
                translate('integration.integration_constants.test_integration_configuration.mapped_field_value'),
                translate('integration.integration_constants.test_integration_configuration.test_input'),
            ],
            KEY: {
                ID: 'key',
                KEY_ID: 'key_uuid',
            },
            VALUE: {
                PLACEHOLDER: 'integration.integration_constants.request_configuration.choose_field',
                ID: 'value',
                VALUE_KEY: 'test_value',
                TYPES: {
                    DIRECT: 'direct',
                    EXPRESSION: 'expression',
                },
            },
        },
        QUERY: {
            TITLE: 'integration.feature_integration_strings.query_parameters',
            ID: 'query_params',
            TEST_ID: 'test_query_params',
            HEADER: [
                translate('integration.integration_constants.request_configuration.header.key'),
                translate('integration.integration_constants.test_integration_configuration.mapped_field_value'),
                translate('integration.integration_constants.test_integration_configuration.test_input'),
            ],
            KEY: {
                ID: 'key',
                KEY_ID: 'key_uuid',
            },
            VALUE: {
                PLACEHOLDER: 'integration.integration_constants.request_configuration.choose_field',
                ID: 'value',
                VALUE_KEY: 'test_value',
                TYPES: {
                    DIRECT: 'direct',
                    EXPRESSION: 'expression',
                },
            },
        },
        RELATIVE_PATH: {
            TITLE: 'integration.feature_integration_strings.relative_path',
            ID: 'relative_path',
            HEADER: [
                translate('integration.integration_constants.request_configuration.header.key'),
                translate('integration.integration_constants.test_integration_configuration.mapped_field_value'),
                translate('integration.integration_constants.test_integration_configuration.test_input'),
            ],
            KEY: {
                ID: 'key',
                KEY_ID: 'key_uuid',
            },
            VALUE: {
                PLACEHOLDER: 'integration.integration_constants.request_configuration.choose_field',
                ID: 'value',
                VALUE_KEY: 'test_value',
                TYPES: {
                    DIRECT: 'direct',
                    EXPRESSION: 'expression',
                },
            },
        },
        REQUEST_BODY_HEADERS: [translate('integration.integration_constants.request_configuration.header.key'),
        translate('integration.integration_constants.request_body_headers.type'),
        translate('integration.integration_strings.add_integration.add_event.event_category.request_body_headers.is_required'),
        translate('integration.integration_constants.request_body_headers.field')],
        TEST_REQUEST_BODY_HEADERS: [translate('integration.integration_constants.request_configuration.header.key'),
        translate('integration.integration_constants.test_integration_configuration.mapped_field_value'),
         translate('integration.integration_constants.request_body_headers.is_multiple'),
         translate('integration.integration_constants.test_integration_configuration.test_input')],
        REQUEST_BODY: {
            TITLE: 'integration.integration_constants.request_body_headers.request_body_title',
        },
        SUCCESS: 'integration.integration_constants.test_integration_configuration.success',
        FAILURE: 'integration.integration_constants.test_integration_configuration.failure',
        FILE_UPLOAD: {
            FAILURE: 'common_strings.oops_something_went_wrong',
        },
    },
    SAVE_RESPONSE_CONFIGURATION: {
        TITLE: translate('integration.integration_constants.test_integration_configuration.title'),
        KEY: 'response_format',
        CONFIRMATION: {
            TITLE: translate('integration.integration_constants.test_integration_configuration.confirmation_title'),
            ID: 'confirm_test',
            BUTTON_LABEL: translate('integration.integration_constants.test_integration_configuration.test_label'),
            OPTIONS: [
                {
                    label: translate('flows.start_node_config.schedule_flow.yes_label'),
                    value: 1,
                },
                {
                    label: translate('flows.start_node_config.schedule_flow.no_label'),
                    value: 0,
                },
            ],
        },
        HEADING: 'integration.integration_constants.test_integration_configuration.save_response',
        TOOLTIP_TEXT: 'integration.integration_constants.test_integration_configuration.save_response_tooltip_text',
        TOOLTIP_TEXT_ML: 'integration.integration_constants.test_integration_configuration.save_response_tooltip_text_ml',
        QUERY: {
            TITLE: translate('integration.feature_integration_strings.query_parameters'),
            ID: 'query_params',
            HEADER: [
                translate('integration.integration_constants.request_configuration.header.key'),
                translate('integration.integration_constants.request_body_headers.field'),
                translate('integration.integration_constants.test_integration_configuration.value'),
            ],
            KEY: {
                ID: 'key',
                KEY_ID: 'key_uuid',
            },
            VALUE: {
                PLACEHOLDER: translate('integration.integration_constants.request_configuration.choose_field'),
                ID: 'value',
                TYPES: {
                    DIRECT: 'direct',
                    EXPRESSION: 'expression',
                },
            },
        },
        REQUEST_BODY_HEADERS: [translate('integration.integration_constants.request_configuration.header.key'),
        translate('integration.integration_constants.request_body_headers.type'),
        translate('integration.integration_strings.add_integration.add_event.event_category.request_body_headers.is_required'),
          translate('integration.integration_constants.request_body_headers.field')],
        RESONSE_HEADERS: [translate('integration.integration_constants.request_body_headers.response_key'),
        translate('integration.integration_constants.request_body_headers.type'),
        translate('integration.integration_constants.request_body_headers.field'),
          translate('integration.integration_constants.request_body_headers.type'),
            ''],
        COLUMN_MAPPING: 'column_mapping',
        SUCCESS: translate('integration.integration_constants.test_integration_configuration.success'),
        FAILURE: translate('integration.integration_constants.test_integration_configuration.failure'),
        ERROR_MESSAGES: {
            NO_MAPPING: 'integration.integration_constants.test_integration_configuration.error_message.no_mapping',
        },
    },
    ADDITIONAL_CONFIGURATION: {
        HEADING: translate('integration.integration_constants.additional_configuration.heading'),
        TEST_BED: {
            ID: 'skip_during_tesbed ',
            OPTION_LIST: [{
                label: translate('integration.integration_constants.additional_configuration.skip_during_test_run'),
                value: 1,
            }],
        },
        NEXT_ACTION_LABEL: translate('integration.integration_constants.additional_configuration.next_action_label'),
        FAILURE_OPTIONS: {
            ID: 'failure_action',
            LABEL: translate('integration.integration_constants.additional_configuration.if_integration_failed'),
            OPTIONS: [
                {
                    label: translate('integration.integration_constants.additional_configuration.continue_the_flow'),
                    value: INTEGRATION_FAILURE_ACTION.CONTINUE,
                },
                {
                    label: translate('integration.integration_constants.additional_configuration.assign_to_step'),
                    value: INTEGRATION_FAILURE_ACTION.ASSIGN_TO_STEP,
                },
            ],
            ASSIGN_STEP_ERROR: 'integration.integration_constants.additional_configuration.assign_step_error',
        },
        CHOOSE_ASSIGN_STEP: {
            ID: 'choose_assign_step',
            PLACEHOLDER: translate('integration.integration_constants.additional_configuration.choose_assign_step'),
        },
    },
    SAVE_RESPONSE: {
        TITLE: translate('integration.integration_constants.test_integration_configuration.save_response'),
    },
    INFINITE_SCROLL_DIV: 'scrollable-integration-div',
    ENTER_STATIC_VALUE: 'task_validation_strings.enter_static_value',
    STATIC_VALUE_ERROR: 'task_validation_strings.static_value_error',
    ACTION_REQUIRED_ERROR: 'task_validation_strings.action_required_error',
};

export const NEW_INTEGRATION_DATA = {
    integration_details: {
        integration_name: EMPTY_STRING,
        integration_uuid: EMPTY_STRING,
    },
    connector_details: {
        connector_id: EMPTY_STRING,
        connector_name: EMPTY_STRING,
    },
    event_details: {
        event_type: EMPTY_STRING,
        event_name: EMPTY_STRING,
        event_uuid: EMPTY_STRING,
    },
    step_type: STEP_TYPE.INTEGRATION,
    integration_error_list: {},
};

export const getStepperDetails = (t) => [
    {
      text: t('integration.integration_constants.request_configuration.heading'),
    },
    {
      text: t('integration.integration_constants.test_integration_configuration.test_label'),
    },
    {
      text: t('integration.integration_constants.test_integration_configuration.save_response'),
    },
    {
      text: t('integration.integration_constants.additional_configuration.heading'),
    },
  ];
