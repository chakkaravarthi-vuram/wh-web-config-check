import { translateFunction } from '../../../../../../utils/jsUtility';

export const EXTERNAL_SOURCE_STRINGS = (t = translateFunction) => {
    return {
        CHOOSE_RULE: {
            LABEL: t('form_field_strings.advanced_technical_config.external_source_column_configuration.choose_rule.label'),
            PLACEHOLDER: t('form_field_strings.advanced_technical_config.external_source_column_configuration.choose_rule.placeholder'),
            ID: t('form_field_strings.advanced_technical_config.external_source_column_configuration.choose_rule.id'),
        },
        CHOOSE_TABLE: {
            LABEL: t('form_field_strings.advanced_technical_config.external_source_column_configuration.choose_table.label'),
            PLACEHOLDER: t('form_field_strings.advanced_technical_config.external_source_column_configuration.choose_table.placeholder'),
            ID: t('form_field_strings.advanced_technical_config.external_source_column_configuration.choose_table.id'),
        },
        TABLE_COLUMNS: {
            ERROR_MESSAGE: t('form_field_strings.advanced_technical_config.external_source_column_configuration.table_columns.min_column_error'),
            LABEL: t('form_field_strings.advanced_technical_config.external_source_column_configuration.table_columns.label'),
            ERROR_LABEL: t('form_field_strings.advanced_technical_config.external_source_column_configuration.table_columns.error_label'),
        },
    };
};
