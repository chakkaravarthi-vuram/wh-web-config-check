import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { STEP_TYPE } from '../../../../../utils/Constants';

export const ML_INTEGRATION = {
    ID: 'ml_integration',
    BASIC_INTEGRATION: {
        TITLE: 'ml_model_integration.basic_integration.title',
        ML_MODEL_DROPDOWN: {
            ID: 'model_code',
            LABEL: 'ml_model_integration.basic_integration.ml_modal_dropdown.label',
            PLACEHOLDER: 'ml_model_integration.basic_integration.ml_modal_dropdown.placeholder',
        },
        STEP_NAME: {
            ID: 'step_name',
            LABEL: 'ml_model_integration.basic_integration.step_name.label',
            PLACEHOLDER: 'ml_model_integration.basic_integration.step_name.placeholder',
        },
        STEP_DESCRIPTION: {
            ID: 'step_description',
            LABEL: 'ml_model_integration.basic_integration.step_description.label',
            PLACEHOLDER: 'ml_model_integration.basic_integration.step_description.placeholder',
        },
    },
    INTEGRATION_CONFIG: {
        TITLE: 'Integration Configuration',
    },
    BUTTONS: {
        CANCEL: 'ml_model_integration.buttons.cancel',
        BACK: 'ml_model_integration.buttons.back',
        CONTINUE: 'ml_model_integration.buttons.continue',
        NEXT: 'ml_model_integration.buttons.next',
        SAVE: 'ml_model_integration.buttons.save',
        SAVE_AND_CLOSE: 'ml_model_integration.buttons.save_and_close',
    },
};

export const NEW_ML_INTEGRATION_DATA = {
    ml_integration_details: {
        model_code: EMPTY_STRING,
        model_id: EMPTY_STRING,
    },
    step_type: STEP_TYPE.ML_MODELS,
    ml_integration_error_list: {},
};

export const ML_MODAL_LIST = [
    {
        model_code: 'TP_LLM_CTSA',
        model_name: 'Custom Text Sentiment Analysis',
        model_description: 'The Custom Text Sentiment Analysis model assesses sentiment in textual data with two main features: Comprehensive Sentiment Analysis, which evaluates overall sentiment, and Aspect-Specific Sentiment Analysis, offering granular insights into specific aspects, enabling the users to extract nuanced and tailored sentiment information.',
    },
    {
        model_code: 'TP_DOC_VOCR',
        model_name: 'Vision OCR',
        model_description: 'The Vision OCR model wields the power of optical character recognition to extract the content from the scanned documents or images.        It supports both printed as well as handwritten text content.',
    },
];

export const STEPPER_CONFIG_LIST = (t) => [
    {
      text: t('integration.integration_constants.request_configuration.heading'),
    },
    {
      text: t('integration.integration_constants.test_integration_configuration.save_response'),
    },
    {
      text: t('integration.integration_constants.additional_configuration.heading'),
    },
  ];

export const API_KEY_HEADERS = [
    {
        label: 'key',
        id: 'key',
        widthWeight: 25,
    },
    {
        label: 'type',
        id: 'type',
        widthWeight: 35,
    },
    {
        label: 'field',
        id: 'field',
        widthWeight: 25,
    },
];

export const tabledata = [
    {
        key: 'name',
        type: 'text',
        field: 'single line',
    },
];
