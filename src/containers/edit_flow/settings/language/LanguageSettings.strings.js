import { translateFunction } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

export const LANGAUGE_SETTINGS_STRINGS = (t = translateFunction) => {
    return {
        LANGUAGE_TABLE_HEADERS: [
            t('publish_settings.language_settings.table_headers.language.label'),
            t('publish_settings.language_settings.table_headers.translate_status.label'),
            EMPTY_STRING,
        ],
        TRANSLATE_STATUS: {
            AVAILABLE: t('publish_settings.language_settings.translate_status.available'),
            NOT_AVAILABLE: t('publish_settings.language_settings.translate_status.not_available'),
        },
        TRANSLATE: {
            TRANSLATE: t('publish_settings.language_settings.translate.translate'),
            TRANSLATE_AGAIN: t('publish_settings.language_settings.translate.translate_again'),
        },
        LANGUAGE_CONFIGURATION: {
            ID: 'language_configuration',
            HEADER: {
                TITLE: t('publish_settings.language_settings.language_configuration.header.title'),
                DEFAULT_LANGAUGE: {
                    LABEL: t('publish_settings.language_settings.language_configuration.header.default_language'),
                    ID: 'default_langauge',
                    LANGUAGE: 'English',
                },
                TRANSLATE_LANGAUGE: {
                    LABEL: t('publish_settings.language_settings.language_configuration.header.translate_language'),
                    ID: 'translate_language',
                },
            },
            CONTENT: {
                INSTRUCTION: t('publish_settings.language_settings.language_configuration.content.instruction'),
                DOWNLOAD: {
                    TYPE: 'text/csv',
                    ID: 'download',
                    LABEL: t('publish_settings.language_settings.language_configuration.content.download.label'),
                    PROGRESS: t('publish_settings.language_settings.language_configuration.content.download.progress'),
                    SUCCESS: t('publish_settings.language_settings.language_configuration.content.download.success_message'),
                    FAILURE: t('publish_settings.language_settings.language_configuration.content.download.failure_message'),
                },
                IMPORT: {
                    ALLOWED_FILE_TYPE: '.csv',
                    ID: 'import',
                    LABEL: t('publish_settings.language_settings.language_configuration.content.import.label'),
                    PROGRESS: t('publish_settings.language_settings.language_configuration.content.import.progress'),
                    HEADERS: {
                        ENGLISH: t('publish_settings.language_settings.language_configuration.content.import.english'),
                        OTHER_LANGUAGE: t('publish_settings.language_settings.language_configuration.content.import.other_language'),
                    },
                    SUCCESS: t('publish_settings.language_settings.language_configuration.content.import.success_message'),
                    INVALID_FILE: t('publish_settings.language_settings.language_configuration.content.import.invalid_file_failure_message'),
                    INVALID_KEY: t('publish_settings.language_settings.language_configuration.content.import.invalid_keys_failure_message'),
                    FILE_SIZE_EXCEED: {
                        TITLE: t('publish_settings.language_settings.language_configuration.content.import.file_size_exceeded.title'),
                        SUB_TITLE: t('publish_settings.language_settings.language_configuration.content.import.file_size_exceeded.sub_title'),
                    },

                },
                SEARCH: {
                    PLACEHOLDER: t('publish_settings.language_settings.language_configuration.content.search.placeholder'),
                    NO_RESULTS: {
                        TITLE: t('publish_settings.language_settings.language_configuration.content.search.no_results.title'),
                        SUB_TITLE: t('publish_settings.language_settings.language_configuration.content.search.no_results.sub_title'),
                    },
                },
                FILTER: {
                    ID: 'filter_language_configuration',
                    OPTIONS: [
                        {
                            label: t('publish_settings.language_settings.language_configuration.content.filter.options.all.label'),
                            value: t('publish_settings.language_settings.language_configuration.content.filter.options.all.value'),
                        },
                        {
                            label: t('publish_settings.language_settings.language_configuration.content.filter.options.empty.label'),
                            value: t('publish_settings.language_settings.language_configuration.content.filter.options.empty.value'),
                        },
                        {
                            label: t('publish_settings.language_settings.language_configuration.content.filter.options.filled.label'),
                            value: t('publish_settings.language_settings.language_configuration.content.filter.options.filled.value'),
                        },
                    ],
                },
                TRANSLATION_TABLE: {
                    ENGLISH_TEXT: t('publish_settings.language_settings.language_configuration.content.translation_table.english_text'),
                    OTHER_LANGUAGE_TEXT: t('publish_settings.language_settings.language_configuration.content.translation_table.other_language_text'),
                    OTHER_LANGUAGE_PLACEHOLDER: t('publish_settings.language_settings.language_configuration.content.translation_table.other_language_placeholder'),
                },
            },
            FOOTER: {
                SAVE: t('publish_settings.language_settings.language_configuration.footer.save'),
                CANCEL: t('publish_settings.language_settings.language_configuration.footer.cancel'),
            },
            CANCEL_CONFIRMATION: {
                ID: 'cancel_language_configuration_confirmation',
                CANCEL: t('publish_settings.language_settings.language_configuration.cancel_confirmation.cancel'),
                TITLE: t('publish_settings.language_settings.language_configuration.cancel_confirmation.title'),
                SUB_TITLE: t('publish_settings.language_settings.language_configuration.cancel_confirmation.sub_title'),
                YES: t('publish_settings.language_settings.language_configuration.cancel_confirmation.buttons.yes'),
                NO: t('publish_settings.language_settings.language_configuration.cancel_confirmation.buttons.no'),
            },
        },
    };
};
