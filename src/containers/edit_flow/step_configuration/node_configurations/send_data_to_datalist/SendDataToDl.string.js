import { translateFunction } from '../../../../../utils/jsUtility';
import { ADDITIONAL_CONFIG_LABEL, GENERAL_LABEL, NO_LABEL, YES_LABEL } from '../../../../../utils/strings/CommonStrings';
import { DL_UPDATE_TYPE_VALUE } from './SendDataToDl.constants';

export const CREATE_NEW_STRINGS = (t = translateFunction) => {
    return {
        ADD_FIELD: t('common_strings.add_field'),
        ADD_COLUMN: t('form_builder_strings.add_column'),
    };
};

const SEND_DATA_TO_DL_CONFIG_CONSTANTS = (t = translateFunction) => {
    return {
        ID: {
            CREATE_NEW_ENTRY: 'create',
            CREATE_MULTIPLE_NEW_ENTRY: 'create_multiple',
            UPDATE_ENTRIES: 'update',
            DELETE_ENTRIES: 'delete',
            UPDATE_ACTION: 'update_action',
            RESPONSE_STORED: 'response_stored',
            TRIGGER_UPDATE: 'trigger_update',
            FLOW_FIELDS: 'Flow Fields',
        },
        TITLE: t('flow_strings.step_configuration.send_data_to_dl.title'),
        ADDON_CONFIG_TITLE: t('flow_strings.step_configuration.send_data_to_dl.addon_config_title'),
        SEND_DATA_TO_DL_TAB: [
            {
                labelText: t(GENERAL_LABEL),
                value: '1',
                tabIndex: '1',
            }, {
                labelText: t(ADDITIONAL_CONFIG_LABEL),
                value: '2',
                tabIndex: '2',
            },
        ],
        GENERAL: {
            DL_AND_EVENT_DETAILS: t('flow_strings.step_configuration.send_data_to_dl.general.dl_and_action_details'),
            CHOOSE_DATALIST: t('flow_strings.step_configuration.send_data_to_dl.general.choose_dl'),
            UPDATE_ACTION_TYPE: t('flow_strings.step_configuration.send_data_to_dl.general.update_action_type'),
            UPDATE_TYPE_OPTIONS: [
                {
                    label: t('flows.update_datalist.create_new_entry'),
                    value: DL_UPDATE_TYPE_VALUE.CREATE,
                },
                {
                    label: t('flows.update_datalist.create_multiple_entries'),
                    value: DL_UPDATE_TYPE_VALUE.CREATE_MULTIPLE,
                },
                {
                    label: t('flows.update_datalist.update_one_or_more'),
                    value: DL_UPDATE_TYPE_VALUE.UPDATE,
                },
                {
                    label: t('flows.update_datalist.delete_one_or_more'),
                    value: DL_UPDATE_TYPE_VALUE.DELETE,
                },
            ],
            CONFIGURE_DATA: 'Configure Data to be Passed',
            CREATE_ENTRY_VALUE_OPTIONS: [
                { label: 'Flow Fields', value: 'Flow Fields' },
                { label: 'Static Value', value: 'Static Value' },
            ],
            CREATE_MULTIPLE_ENTRY_VALUE_OPTIONS: [
                { label: 'Flow Fields', value: 'Flow Fields' },
                { label: 'Static Value', value: 'Static Value' },
                { label: 'Selected Table Column’s', value: 'Selected Table Column’s' },
            ],
            ENTRY_UPDATE_STATUS: [{
                label: 'Do not update',
                value: 'Do not update',
                header: 'Choose',
                isHeaderWithBg: true,
            }, {
                label: 'Update',
                value: 'Update',
                header: 'Choose',
                isHeaderWithBg: true,
            }, {
                label: 'Append',
                value: 'Append',
                header: 'Choose',
                isHeaderWithBg: true,
            },
            ],
            CREATE_ENTRY_HEADER: ['Datalist Field', 'Field Type', 'Value to be passed'],
            UPDATE_ENTRY_HEADER: ['Datalist Field', 'Field Type', 'Update / Append', 'Value to be passed'],
            RESPONSE_OPTIONS: (t = translateFunction) => [
                {
                    label: t(YES_LABEL),
                    value: true,
                }, {
                    label: t(NO_LABEL),
                    value: false,
                },
            ],
            CONFIGURE_CREATE_ENTRY: t('flow_strings.step_configuration.send_data_to_dl.general.configure_create_entry'),
            CONFIGURE_UPDATE_ENTRY: t('flow_strings.step_configuration.send_data_to_dl.general.configure_update_entry'),
            CONFIGURE_DELETE_ENTRY: t('flow_strings.step_configuration.send_data_to_dl.general.configure_delete_entry'),
            TABLE_MULTIPLE_ENTRY_LABEL: t('flow_strings.step_configuration.send_data_to_dl.general.table_multiple_entry_label'),
            FLOW_FIELD_SELECTED_DL_TYPE: t('flow_strings.step_configuration.send_data_to_dl.general.flow_field_selected_dl_type'),
            TRIGGER_UPDATE_INFO: t('flow_strings.step_configuration.send_data_to_dl.general.trigger_update_info'),
            SAVE_ENTRY_CREATION: t('flow_strings.step_configuration.send_data_to_dl.general.save_entry_creation'),
            UPDATE_EXECTION_INFO: t('flow_strings.step_configuration.send_data_to_dl.general.update_execution_info'),
            RESPONSE_NEEDED_QUESTION: t('flow_strings.step_configuration.send_data_to_dl.general.response_needed'),
            MAPPING_HEADERS: (t) => [
                t('flow_strings.step_configuration.send_data_to_dl.table_headers.input_field'),
                t('flow_strings.step_configuration.send_data_to_dl.table_headers.field_type'),
                t('flow_strings.step_configuration.send_data_to_dl.table_headers.value_to_passed'),
            ],
            MAPPING_HEADERS_UPDATE: (t) => [
                t('flow_strings.step_configuration.send_data_to_dl.table_headers.input_field'),
                t('flow_strings.step_configuration.send_data_to_dl.table_headers.field_type'),
                t('flow_strings.step_configuration.send_data_to_dl.table_headers.update_type'),
                t('flow_strings.step_configuration.send_data_to_dl.table_headers.value_to_passed'),
            ],
            BUTTON_ACTION: t('flow_strings.step_configuration.send_data_to_dl.general.button_action'),
            DATA_LOSS_POPOVER: {
                TITLE: t('flow_strings.step_configuration.send_data_to_dl.general.data_loss_alert.title'),
                SUBTITLE: t('flow_strings.step_configuration.send_data_to_dl.general.data_loss_alert.subtitle'),
            },
            MAPPING_VALIDATION_STRINGS: {
                MAPPING: t('flow_strings.step_configuration.send_data_to_dl.general.mapping_validation_strings.mapping'),
            },
        },
        ADDITIONAL: {
            DEFAULT_STEP_STATUS: t('flow_strings.step_configuration.send_data_to_dl.additional.default_step_status'),
        },
    };
};

export {
    SEND_DATA_TO_DL_CONFIG_CONSTANTS,
};
