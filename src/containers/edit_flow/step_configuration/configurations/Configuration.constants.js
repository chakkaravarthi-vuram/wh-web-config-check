import { FIELD_TYPE } from '../../../../utils/constants/form.constant';
import { SYSTEM_FIELDS } from '../../../../utils/SystemFieldsConstants';
import { CONFIGURATION_TYPE_ID, SEND_DATA_TO_DATALIST_STRINGS } from './Configuration.strings';

export const SEND_DATA_TO_DL_OPERANDS = {
    ADD: 'add',
    SUB: 'sub',
    MUL: 'mul',
    DIV: 'div',
    EQUAL_TO: 'equal_to',
};

export const ENTRY_ACTION_TYPE = {
    AUTO: 'auto',
    UPDATE: 'update',
    DELETE: 'delete',
};

export const DATA_TO_DL_OPERANDS_LIST = (t) => [
    {
        label: t(SEND_DATA_TO_DATALIST_STRINGS.OPERANDS.ADD),
        value: SEND_DATA_TO_DL_OPERANDS.ADD,
    },
    {
        label: t(SEND_DATA_TO_DATALIST_STRINGS.OPERANDS.SUB),
        value: SEND_DATA_TO_DL_OPERANDS.SUB,
    },
    {
        label: t(SEND_DATA_TO_DATALIST_STRINGS.OPERANDS.MUL),
        value: SEND_DATA_TO_DL_OPERANDS.MUL,
    },
    {
        label: t(SEND_DATA_TO_DATALIST_STRINGS.OPERANDS.DIV),
        value: SEND_DATA_TO_DL_OPERANDS.DIV,
    },
    {
        label: t(SEND_DATA_TO_DATALIST_STRINGS.OPERANDS.EQUAL_TO),
        value: SEND_DATA_TO_DL_OPERANDS.EQUAL_TO,
    },
];

export const ACTION_TYPE_OPTIONS = (t) => [
    {
        label: t(SEND_DATA_TO_DATALIST_STRINGS.ACTION_TYPE.AUTO),
        value: ENTRY_ACTION_TYPE.AUTO,
    },
    {
        label: t(SEND_DATA_TO_DATALIST_STRINGS.ACTION_TYPE.UPDATE),
        value: ENTRY_ACTION_TYPE.UPDATE,
    },
    {
        label: t(SEND_DATA_TO_DATALIST_STRINGS.ACTION_TYPE.DELETE),
        value: ENTRY_ACTION_TYPE.DELETE,
    },
];

export const SEND_DATA_TO_DATALIST = {
    ID: CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST,
    ENTRY_ID: {
        FORM_FIELD: 'form_field',
    },
    FIELD_KEYS: {
        DATA_LIST_MAPPING: 'data_list_mapping',
        ACTION_UUID: 'action_uuid',
        DATA_LIST_UUID: 'data_list_uuid',
        DATA_LIST_ENTRY_ACTION_TYPE: 'data_list_entry_action_type',
        ENTRY_ID_FROM: 'entry_id_from',
        ENTRY_ID_FORM_VALUE: 'entry_id_from_value',
        MAPPING: 'mapping',
        FLOW_FIELD: 'flow_field',
        FLOW_FIELD_UUID: 'flow_field_uuid',
        FLOW_FIELD_TYPE: 'flow_field_type',
        DATA_LIST_FIELD: 'data_list_field',
        DATA_LIST_FIELD_UUID: 'data_list_field_uuid',
        DATA_LIST_FIELD_TYPE: 'data_list_field_type',
        OPERATION: 'operation',
        MAPPING_UUID: 'mapping_uuid',
        IS_EDITED: 'is_edited',
        DATA_LIST_NAME: 'data_list_name',
        VALUE_TYPE: 'value_type',
        DYNAMIC: 'dynamic',
        MAPPING_TYPE: 'mapping_type',
        DIRECT_MAPPING_TYPE: 'direct_to_direct',
        DIRECT_TO_TABLE_MAPPING_TYPE: 'direct_to_table',
        TABLE_TO_TABLE_MAPPING_TYPE: 'table_to_table',
        MAPPING_ORDER: 'mapping_order',
        UPDATE_TYPE: 'update_type',
        ADD_NEW_ROW: 'add_new_row',
        DATA_LIST_TABLE_UUID: 'data_list_table_uuid',
        FLOW_TABLE_UUID: 'flow_table_uuid',
        TABLE_COLUMN_MAPPING: 'table_column_mapping',
        SYSTEM: 'system',
        SYSTEM_FIELD: 'system_field',
        DELETE: 'delete',
        FIELD_UUID: 'field_uuid',
        TABLE_UUID: 'table_uuid',
        STATIC: 'static',
        CHOICE_VALUE_OBJ: 'choiceValueObj',
        DATA_LIST_DETAILS: 'data_list_details',
        DISPLAY_FIELDS: 'display_fields',
        CHOICE_VALUES: 'choice_values',
    },
    VALIDATION_CONSTANTS: {
        LINK_TEXT: 'link_text',
        LINK_URL: 'link_url',
        CURRENCY_TYPE: 'currency_type',
        VALUE: 'value',
    },
    FIELD_MATCH_CATEGORY: {
        CATEGORY_1: [FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY],
        CATEGORY_2: [FIELD_TYPE.SINGLE_LINE, FIELD_TYPE.DROPDOWN, FIELD_TYPE.RADIO_GROUP, FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN],
    },
};

export const getValueTypeOptions = (t = () => {}) => [
    {
        label: t(SEND_DATA_TO_DATALIST_STRINGS.ALL_LABELS.DATA_FIELDS),
        value: SEND_DATA_TO_DATALIST.FIELD_KEYS.DYNAMIC,
    },
    {
        label: t(SEND_DATA_TO_DATALIST_STRINGS.ALL_LABELS.SYSTEM_FIELDS),
        value: SEND_DATA_TO_DATALIST.FIELD_KEYS.SYSTEM,
    },
    {
        label: t(SEND_DATA_TO_DATALIST_STRINGS.ALL_LABELS.STATIC_VALUE),
        value: SEND_DATA_TO_DATALIST.FIELD_KEYS.STATIC,
    },
];

export const SYSTEM_FIELDS_FOR_FLOW_DL_MAPPING = [
    SYSTEM_FIELDS.FLOW_ID,
    SYSTEM_FIELDS.FLOW_LINK,
    SYSTEM_FIELDS.COMMENTS,
    SYSTEM_FIELDS.CREATED_ON,
    SYSTEM_FIELDS.LAST_UPDATED_ON,
    SYSTEM_FIELDS.COMPLETED_BY,
    SYSTEM_FIELDS.CREATED_BY,
];
