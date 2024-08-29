// eslint-disable-next-line quotes
import { FIELD_TYPES } from "../../../../../components/form_builder/FormBuilder.strings";
import { translateFunction } from '../../../../../utils/jsUtility';
import { NODE_CONFIG_TABS } from '../../../node_configuration/NodeConfiguration.constants';
import { PAGE_HEADER_FOOTER_OPTIONS, RESPONSE_FIELD_KEYS } from './GenerateDocument.constants';

export const GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS = (t = translateFunction) => {
    return {
        TITLE: t('flow_strings.step_configuration.generate_document.title'),
        ADDON_CONFIG_TITLE: t('flow_strings.step_configuration.generate_document.addon_config_title'),
        TABS: [
            {
                labelText: t('flow_strings.step_configuration.send_email.tab.general'),
                value: NODE_CONFIG_TABS.GENERAL,
                tabIndex: NODE_CONFIG_TABS.GENERAL,
            },
            {
                labelText: t('flow_strings.step_configuration.send_email.tab.additional'),
                value: NODE_CONFIG_TABS.ADDITIONAL,
                tabIndex: NODE_CONFIG_TABS.ADDITIONAL,
            },
        ],
        GENERAL: {
            BUTTON_ACTION: t('flow_strings.step_configuration.send_email.general.button_action'),
            TYPE_AND_STORE: {
                TITLE: t('flow_strings.step_configuration.generate_document.general.type_and_store.title'),
                DOCUMENT_TYPE: {
                    LABEL: t('flow_strings.step_configuration.generate_document.general.type_and_store.document_type.label'),
                    INSTRUCTION: t('flow_strings.step_configuration.generate_document.general.type_and_store.document_type.instruction'),
                },
                STORE_FIELD: {
                    LABEL: t('flow_strings.step_configuration.generate_document.general.type_and_store.store_field.label'),
                    VALIDATION_STRING: t('flow_strings.step_configuration.generate_document.general.type_and_store.store_field.validation_string'),
                    ID: t('flow_strings.step_configuration.generate_document.general.type_and_store.store_field.id'),
                    PLACEHOLDER: t('flow_strings.step_configuration.generate_document.general.general.type_and_store.store_field.placeholder'),
                    SEARCH: {
                        PLACEHOLDER: t('flow_strings.step_configuration.generate_document.general.type_and_store.store_field.search.placeholder'),
                        NO_FIELDS_FOUND: t('flow_strings.step_configuration.generate_document.general.type_and_store.store_field.search.no_fields_found'),
                        LABEL: t('flow_strings.step_configuration.generate_document.general.type_and_store.store_field.search.label'),
                    },
                    CREATE: {
                        ID: t('flow_strings.step_configuration.generate_document.general.type_and_store.store_field.create.id'),
                        BUTTON_LABEL: t('flow_strings.step_configuration.generate_document.general.type_and_store.store_field.create.button_label'),
                    },
                    INFINITE_SCROLL: {
                        ID: t('flow_strings.step_configuration.generate_document.general.type_and_store.store_field.infinite_scroll.id'),
                    },
                },
                CREATE_FIELD: {
                    BUTTON_LABEL: t('flow_strings.step_configuration.generate_document.general.type_and_store.create_field.button_label'),
                },
            },
            TEMPLATE: {
                TITLE: t('flow_strings.step_configuration.generate_document.general.template.title'),
                NAME: {
                    ID: RESPONSE_FIELD_KEYS.FILE_NAME,
                    LABEL: t('flow_strings.step_configuration.generate_document.general.template.name.label'),
                    VALIDATION_STRING: t('flow_strings.step_configuration.generate_document.general.template.name.validation_string'),
                    PLACEHOLDER: t('flow_strings.step_configuration.generate_document.general.template.name.placeholder'),
                    SUPPORTED_FIELDS: [
                        FIELD_TYPES.SINGLE_LINE,
                        FIELD_TYPES.RADIO_GROUP,
                        FIELD_TYPES.DROPDOWN,
                        FIELD_TYPES.DATE,
                        FIELD_TYPES.DATETIME,
                        FIELD_TYPES.EMAIL,
                        FIELD_TYPES.SCANNER,
                        FIELD_TYPES.DATA_LIST_PROPERTY_PICKER,
                        FIELD_TYPES.USER_PROPERTY_PICKER,
                        FIELD_TYPES.USER_TEAM_PICKER,
                        FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
                    ],
                },
                DOCUMENT: {
                    LABEL: t('flow_strings.step_configuration.generate_document.general.template.document.label'),
                    VALIDATION_STRING: t('flow_strings.step_configuration.generate_document.general.template.document.validation_string'),
                    INSERT_TABLE: {
                        TITLE: t('flow_strings.step_configuration.generate_document.general.template.document.insert_table.title'),
                        LABEL: t('flow_strings.step_configuration.generate_document.general.template.document.insert_table.label'),
                    },
                },
                HEADER: {
                    ID: RESPONSE_FIELD_KEYS.ALLOW_HEADER,
                    ADD_PAGE_HEADER_OPTION: {
                        label: t('flow_strings.step_configuration.generate_document.general.template.header.add_page_header_option.label'),
                        value: t('flow_strings.step_configuration.generate_document.general.template.header.add_page_header_option.value'),
                    },
                    LABEL: t('flow_strings.step_configuration.generate_document.general.template.header.label'),
                    PAGE_HEADER: {
                        ID: RESPONSE_FIELD_KEYS.SHOW_IN_PAGES,
                        LABEL: t('flow_strings.step_configuration.generate_document.general.template.header.page_header.label'),
                        PLACEHOLDER: t('flow_strings.step_configuration.generate_document.general.template.header.page_header.placeholder'),
                        OPTIONS: (isHeader = false) => [
                            {
                                label: t('flow_strings.step_configuration.generate_document.general.template.header.page_header.options.all_pages.label'),
                                value: PAGE_HEADER_FOOTER_OPTIONS.ALL_PAGES,
                            },
                            {
                                label: t('flow_strings.step_configuration.generate_document.general.template.header.page_header.options.first_page.label'),
                                value: PAGE_HEADER_FOOTER_OPTIONS.FIRST_PAGE,
                            },
                            (!isHeader) && {
                                label: t('flow_strings.step_configuration.generate_document.general.template.header.page_header.options.last_page.label'),
                                value: PAGE_HEADER_FOOTER_OPTIONS.LAST_PAGE,
                            },
                            {
                                label: t('flow_strings.step_configuration.generate_document.general.template.header.page_header.options.except_first_page.label'),
                                value: PAGE_HEADER_FOOTER_OPTIONS.EXCEPT_FIRST_PAGE,
                            },
                        ].filter(Boolean),
                        SHOW_PAGE_NUMBER: {
                            ID: RESPONSE_FIELD_KEYS.SHOW_PAGE_NUMBER,
                        },
                        SHOW_PAGE_NUMBER_OPTION: {
                            label: t('flow_strings.step_configuration.generate_document.general.template.header.page_header.show_page_number_option.label'),
                            value: true,
                        },
                    },
                },
                FOOTER: {
                    ID: RESPONSE_FIELD_KEYS.ALLOW_FOOTER,
                    ADD_PAGE_FOOTER_OPTION: {
                        label: t('flow_strings.step_configuration.generate_document.general.template.footer.add_page_footer_option.label'),
                        value: t('flow_strings.step_configuration.generate_document.general.template.footer.add_page_footer_option.value'),
                    },
                    LABEL: t('flow_strings.step_configuration.generate_document.general.template.footer.label'),
                    PAGE_FOOTER: {
                        ID: RESPONSE_FIELD_KEYS.SHOW_IN_PAGES,
                        LABEL: t('flow_strings.step_configuration.generate_document.general.template.footer.page_footer.label'),
                        PLACEHOLDER: t('flow_strings.step_configuration.generate_document.general.template.footer.page_footer.placeholder'),
                        SHOW_PAGE_NUMBER: {
                            ID: RESPONSE_FIELD_KEYS.SHOW_PAGE_NUMBER,
                        },
                        SHOW_PAGE_NUMBER_OPTION: {
                            label: t('flow_strings.step_configuration.generate_document.general.template.footer.page_footer.show_page_number_option.label'),
                            value: t('flow_strings.step_configuration.generate_document.general.template.footer.page_footer.show_page_number_option.value'),
                        },
                    },
                },
                TABLE: {
                    POP_OVER_STRINGS: {
                        TITLE: 'Validation on column selection',
                        SUBTITLE: 'Exceeds maxiumum limit of 7',
                    },
                    INSIDE_TABLE_TEXT: 'flows.document_generation_strings.inside_table_text',
                    SELECT_TABLE_COLUMNS: 'flows.document_generation_strings.select-table-column',
                    SELECT_COLUMNS: 'flows.document_generation_strings.select_columns',
                    CANCEL: 'flows.document_generation_strings.cancel',
                    INSERT_TABLE: 'flows.document_generation_strings.insert_table',
                },
            },
        },
        ERROR_MESSAGES: {
            HEADER_ERROR: t('flows.document_generation_strings.header_error'),
            FOOTER_ERROR: t('flows.document_generation_strings.footer_error'),
        },
    };
};
