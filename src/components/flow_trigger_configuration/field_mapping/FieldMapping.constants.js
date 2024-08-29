// import { translate } from 'language/config';
import { translateFunction } from 'utils/jsUtility';

export const MAPPING_CONSTANTS = {
    TRIGGER_MAPPING: 'trigger_mapping',
    ADD_FIELD: 'flow_trigger.mapping_constants.add_field',
    MAPPING_TITLE: 'flow_trigger.mapping_constants.mapping_title',
    HEADERS: {
        VALUE_TYPE: 'flow_trigger.mapping_constants.value_type.label',
        FIELD_MAPPING_TEXT: 'flow_trigger.mapping_constants.field_mapping_text',
    },
    VALUE_TYPE_OPTION_LIST: (t = translateFunction) => [
        {
            label: t('flow_trigger.mapping_constants.value_type.static'),
            value: 'static',
        },
        {
            label: t('flow_trigger.mapping_constants.value_type.dynamic'),
            value: 'dynamic',
        },
        {
            label: t('flow_trigger.mapping_constants.value_type.system'),
            value: 'system',
        },
    ],
    DATA_LIST_ENTRY_MAPPING: {
        label: 'Datalist entry',
        value: 'map_entry',
    },
    USER_ENTRY_MAPPING: {
        label: 'User entry',
        value: 'map_user',
    },
    CHILD_FIELD_MAPPING: {
        ID: 'child_field_details',
        PLACEHOLDER: 'flow_trigger.mapping_constants.child_field_placeholder',
    },
    CHILD_TABLE_MAPPING: {
        ID: 'child_table_details',
    },
    STATIC_VALUE: {
        ID: 'static_value',
        ERROR_MESSAGE: 'flow_trigger.mapping_constants.static_value_error',
    },
    VALUE_TYPE: {
        ID: 'value_type',
        PLACEHOLDER: 'Choose value type',
    },
    PARENT_FIELD_MAPPING: {
        ID: 'parent_field_details',
        PLACEHOLDER: 'flow_trigger.mapping_constants.parent_field_placeholder',
        DL_PLACEHOLDER: 'flow_trigger.mapping_constants.parent_dl_field_placeholder',
    },
    PARENT_TABLE_MAPPING: {
        ID: 'parent_table_details',
    },
    FIELD_MAPPING: {
        ID: 'field_mapping',
    },
    CANCEL_PARENT_OPTION_LIST: (t = translateFunction) => [
        {
            label: t('flow_trigger.mapping_constants.cancel_parent_option'),
            value: 1,
        },
    ],
    ADD_MAPPING: 'flow_trigger.mapping_constants.add_mapping',
    ADD_COLUMN: 'flow_trigger.mapping_constants.add_column',
};

export const FIELD_MAPPING_ERRORS = {
    CURRENCY_TYPE_REQUIRED: 'flow_trigger.field_mapping_errors.currency_type_required',
    CURRENCY_VALUE_REQUIRED: 'flow_trigger.field_mapping_errors.currency_value_required',
    TYPE_MISMATCH_TEXT: 'flow_trigger.field_mapping_errors.type_mismatch_text',
    MIN_ONE_TABLE_COLUMN: 'flow_trigger.field_mapping_errors.min_one_table_column',
    CROSS_TABLE_MAPPING_TEXT: 'flow_trigger.field_mapping_errors.cross_table_mapping_text',
};
