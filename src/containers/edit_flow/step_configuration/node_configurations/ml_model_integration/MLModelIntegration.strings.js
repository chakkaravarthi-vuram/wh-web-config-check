import { translateFunction } from '../../../../../utils/jsUtility';

export const ML_MODEL_INTEGRATION_STRINGS = (t = translateFunction) => {
    return {
        TITLE: t('flow_strings.step_configuration.ml_model.title'),
        TABS: [
            {
                labelText: t('end_step_configuration_strings.end_config_tab.general'),
                value: '1',
                tabIndex: '1',
            },
            {
                labelText: t('flow_strings.step_configuration.ml_model.error_handling_tab'),
                value: '2',
                tabIndex: '2',
            },
            {
                labelText: t(
                    'end_step_configuration_strings.end_config_tab.additional_configuration',
                ),
                value: '3',
                tabIndex: '3',
            },
        ],
        GENERAL: {
            MODEL_DETAILS: {
                TITLE: t('flow_strings.step_configuration.ml_model.general.model_details.title'),
                CHOOSE_MODEL: {
                    ID: t('flow_strings.step_configuration.ml_model.general.model_details.choose_model.id'),
                    LABEL: t('flow_strings.step_configuration.ml_model.general.model_details.choose_model.label'),
                    OPTIONS: [
                        {
                            label: t('flow_strings.step_configuration.ml_model.general.model_details.choose_model.options.text.label'),
                            value: t('flow_strings.step_configuration.ml_model.general.model_details.choose_model.options.text.value'),
                        },
                        {
                            label: t('flow_strings.step_configuration.ml_model.general.model_details.choose_model.options.document.label'),
                            value: t('flow_strings.step_configuration.ml_model.general.model_details.choose_model.options.document.value'),

                        },
                    ],
                },
                MODEL_INPUT: {
                    TITLE: t('flow_strings.step_configuration.ml_model.general.model_details.model_input.title'),
                    LABEL: t('flow_strings.step_configuration.ml_model.general.model_details.model_input.label'),
                    HEADERS: [
                        t('flow_strings.step_configuration.ml_model.general.model_details.model_input.headers.name'),
                        t('flow_strings.step_configuration.ml_model.general.model_details.model_input.headers.type'),
                        t('flow_strings.step_configuration.ml_model.general.model_details.model_input.headers.value'),
                    ],
                    SAVE_RESPONSE: {
                        TITLE: t('flow_strings.step_configuration.ml_model.general.model_details.model_input.save_response.title'),
                        IS_SAVE_RESPONSE: {
                            LABEL: t('flow_strings.step_configuration.ml_model.general.model_details.model_input.save_response.is_save_response.label'),
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
                            t('flow_strings.step_configuration.ml_model.general.model_details.model_input.save_response.table_headers.name'),
                            t('flow_strings.step_configuration.ml_model.general.model_details.model_input.save_response.table_headers.type'),
                            t('flow_strings.step_configuration.ml_model.general.model_details.model_input.save_response.table_headers.field'),
                            '',
                        ],
                        RESPONSE_DETAILS: {
                            TITLE: t('flow_strings.step_configuration.ml_model.general.model_details.model_input.save_response.response_details.title'),
                        },
                    },
                },
            },
        },
        ERROR_HANDLING: {
            RETRY: {
                TITLE: t('flow_strings.step_configuration.ml_model.error_handling.retry.title'),
                LABEL: t('flow_strings.step_configuration.ml_model.error_handling.retry.label'),
            },
            ERROR_PATH: {
                TITLE: t('flow_strings.step_configuration.ml_model.error_handling.error_path.title'),
                LABEL: t('flow_strings.step_configuration.ml_model.error_handling.retry.label'),
                OPTIONS: [
                    // {
                    //     label: t('flow_strings.step_configuration.ml_model.error_handling.error_path.options.stop_flow.label'),
                    //     value: 'stop_flow',
                    // },
                    {
                        label: t('flow_strings.step_configuration.ml_model.error_handling.error_path.options.continue_flow.label'),
                        value: 'continue_flow',
                    },
                    {
                        label: t('flow_strings.step_configuration.ml_model.error_handling.error_path.options.failure_action.label'),
                        value: 'failure_action',
                    },
                ],
            },
        },
    };
};

export const RETRY_OPTIONS = (t, chosenRetries = []) => [
    {
        label: t('flow_strings.step_configuration.retry_options.first_retry.label'),
        value: t('flow_strings.step_configuration.retry_options.first_retry.value'),
        disabled: false,
        selected: chosenRetries.includes('first'),
    },
    {
        label: t('flow_strings.step_configuration.retry_options.second_retry.label'),
        value: t('flow_strings.step_configuration.retry_options.second_retry.value'),
        disabled: !chosenRetries?.includes('first'),
        selected: chosenRetries.includes('second'),
    },
    {
        label: t('flow_strings.step_configuration.retry_options.third_retry.label'),
        value: t('flow_strings.step_configuration.retry_options.third_retry.value'),
        disabled: !chosenRetries?.includes('second'),
        selected: chosenRetries.includes('third'),
    },
    ];
