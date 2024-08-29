import { translateFunction } from '../../../../../utils/jsUtility';

export const FLOW_ADDON_STRINGS = (t = translateFunction) => {
    return {
        IDENTIFIER: {
            TITLE: t('data_lists.datalist_landing.datalist_details.language_and_others.identifier.title'),
            UNIQUE_IDENTIFIER: {
                LABEL: t('data_lists.datalist_landing.datalist_details.language_and_others.identifier.unique_identifier.label'),
                SYSTEM_GENERATED: {
                    OPTIONS: (checked) => {
                        return {
                            value: t('data_lists.datalist_landing.datalist_details.language_and_others.identifier.unique_identifier.system_generated.options.value'),
                            label: t('data_lists.datalist_landing.datalist_details.language_and_others.identifier.unique_identifier.system_generated.options.label'),
                            selected: checked,
                            disabled: true,
                        };
                    },
                },
            },
            TASK_IDENTIFIER: {
                LABEL: t('data_lists.datalist_landing.datalist_details.language_and_others.identifier.task_identifier.label'),
                STEP_NAME: '+ Step name',
            },
            CUSTOM_IDENTIFER: {
                LABEL: t('data_lists.datalist_landing.datalist_details.language_and_others.identifier.custom_identifier.label'),
            },
        },
        TRANSLATION: {
            TITLE: t('data_lists.datalist_landing.datalist_details.language_and_others.translation.title'),
            HEADERS: [
            {
                label: t('data_lists.datalist_landing.datalist_details.language_and_others.translation.headers.language.label'),
            },
            {
                label: t('data_lists.datalist_landing.datalist_details.language_and_others.translation.headers.translate_status.label'),
            },
            ],
            STATUS: {
                AVAILABLE: t('data_lists.datalist_landing.datalist_details.language_and_others.translation.status.available'),
                NOT_AVAILABLE: t('data_lists.datalist_landing.datalist_details.language_and_others.translation.status.not_available'),
            },
        },
        TECHNICAL_CONFIGURATION: {
            TITLE: t('data_lists.datalist_landing.datalist_details.language_and_others.technical_configuration.title'),
            SHORT_CODE: {
                LABEL: t('data_lists.datalist_landing.datalist_details.language_and_others.technical_configuration.short_code.label'),
            },
            TECHNICAL_REFERENCE_NAME: {
                LABEL: t('data_lists.datalist_landing.datalist_details.language_and_others.technical_configuration.technical_reference_name.label'),
            },
        },
        CATEGORY: {
            TITLE: t('datalist.create_data_list.basic_info.data_list_category.label'),
        },
    };
};
