import { translateFunction } from '../../../utils/jsUtility';

export const FIELD_CONFIGURATION_STRINGS = (t = translateFunction) => {
    return {
        TITLE: t('form_field_strings.field_config.title'),
    };
};

export const DEPENDENCY_HANDLER_STRINGS = (t = translateFunction) => {
    return {
        TITLE: t('form_field_strings.field_config.dependency_handler_title'),
    };
};

export const VALIDATION_STRINGS = (t = translateFunction) => {
    return {
        FIELD_NAME_REGEX_ERROR: t('manage_flow_fields.validation_strings.invalid_name'),
    };
};
export const DOCUMENT_FIELD_LABEL = (t = translateFunction) => t('form_field_strings.dropdown_list_text.document');

export const FLOW_FIELDS = (t = translateFunction) => {
    return {
        TITLE: t('manage_flow_fields.flow_fields.title'),
        NO_FIELDS: t('manage_flow_fields.flow_fields.no_fields'),
        CREATE_FIELD: {
            TITLE: t('manage_flow_fields.flow_fields.create_field.title'),
        },
        SELECTION_OPTIONS: {
            TITLE: t('manage_flow_fields.flow_fields.selection_options.title'),
            BUTTON: t('manage_flow_fields.flow_fields.selection_options.button'),
        },
        LINK_FIELD: {
            MIN_LINK_COUNT: {
                TITLE: t('manage_flow_fields.flow_fields.link_field.min_link_count.title'),
                PLACEHOLDER: t('manage_flow_fields.flow_fields.link_field.min_link_count.placeholder'),
            },
            MAX_LINK_COUNT: {
                TITLE: t('manage_flow_fields.flow_fields.link_field.max_link_count.title'),
                PLACEHOLDER: t('manage_flow_fields.flow_fields.link_field.max_link_count.placeholder'),
            },
        },
        FILE_UPLOAD_FIELD: {
            MIN_FILE_COUNT: {
                TITLE: t('manage_flow_fields.flow_fields.link_field.min_file_count.title'),
                PLACEHOLDER: t('manage_flow_fields.flow_fields.link_field.min_file_count.placeholder'),
            },
            MAX_FILE_COUNT: {
                TITLE: t('manage_flow_fields.flow_fields.link_field.max_file_count.title'),
                PLACEHOLDER: t('manage_flow_fields.flow_fields.link_field.max_file_count.placeholder'),
            },
        },
        NUMBER_FIELD: {
            MINIMUM_VALUE: {
                TITLE: t('manage_flow_fields.flow_fields.number_field.allowed_minimum.title'),
                PLACEHOLDER: t('manage_flow_fields.flow_fields.number_field.allowed_minimum.placeholder'),
            },
            MAXIMUM_VALUE: {
                TITLE: t('manage_flow_fields.flow_fields.number_field.allowed_maximum.title'),
                PLACEHOLDER: t('manage_flow_fields.flow_fields.number_field.allowed_maximum.placeholder'),
            },
            ALLOW_DECIMAL: {
                PLACEHOLDER: t('manage_flow_fields.flow_fields.number_field.allowed_decimal.placeholder'),
            },
        },
    };
};
