// This file to deleted after functionality implementation

import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { STEP_TYPE } from '../../../../../utils/Constants';
import { SEND_DATA_TO_DL_CONFIG_CONSTANTS } from './SendDataToDl.string';
import { translateFunction } from '../../../../../utils/jsUtility';

export const DL_UPDATE_TYPE_VALUE = {
    CREATE: 'create',
    CREATE_MULTIPLE: 'create_multiple',
    UPDATE: 'update',
    DELETE: 'delete',
};

const MOCKDATA_CREATE_UPDATE_FLOW_FIELDS = [
    {
        label: 'User Field List 1',
        value: 'User Field List 1',
        isHeaderWithBg: true,
        header: 'User added fields',
    }, {
        label: 'User Field List 2',
        value: 'User Field List 2',
        isHeaderWithBg: true,
        header: 'User added fields',
    }, {
        label: 'User Field List 3',
        value: 'User Field List 3',
        isHeaderWithBg: true,
        header: 'User added fields',
    }, {
        label: 'System Field List 1',
        value: 'System Field List 1',
        isHeaderWithBg: true,
        header: 'System added fields',
    }, {
        label: 'System Field List 2',
        value: 'System Field List 2',
        isHeaderWithBg: true,
        header: 'System added fields',
    }, {
        label: 'System Field List 3',
        value: 'System Field List 3',
        isHeaderWithBg: true,
        header: 'System added fields',
    },
];

const MOCKDATA_STATIC_FIELDS = [
    {
        label: 'Static field',
        value: 'Static field',
    }, {
        label: 'Static field 1',
        value: 'Static field 1',
    }, {
        label: 'Static field 2',
        value: 'Static field 2',
    }, {
        label: 'Static field 3',
        value: 'Static field 3',
    },
];

export {
    MOCKDATA_CREATE_UPDATE_FLOW_FIELDS,
    MOCKDATA_STATIC_FIELDS,
};

export const FIELD_TYPE_IDS = {
    DATA_LIST_UUID: {
        ID: 'dataListUuid',
        LABEL: 'Datalist Field',
    },
    DATA_LIST_ENTRY_ACTION_TYPE: {
        ID: 'dataListEntryActionType',
        LABEL: 'Entry Action Type',
        PLACEHOLDER: 'Select',
    },
    SAVE_RESPONSE: {
        ID: 'saveResponse',
        LABEL: 'Save Response',
    },
    SAVE_RESPONSE_FIELD: {
        ID: 'saveResponseField',
        LABEL: 'Save Response Field',
    },
    PICKER_FIELD_UUID: {
        ID: 'pickerFieldUuid',
        PLACEHOLDER: 'Select',
        LABEL: 'Datalist Picker Field',
    },
    TABLE_UUID: {
        ID: 'tableUuid',
        LABEL: 'Table Field',
    },
    IS_AUTO_UPDATE: {
        ID: 'isAutoUpdate',
        LABEL: 'Is Auto Update',
    },
    MAPPING: {
        ID: 'mapping',
        LABEL: 'Mapping',
    },
    MAPPING_UUID: {
        ID: 'maapingUuid',
        LABEL: 'Mapping Uuid',
    },
    DATA_LIST_MAPPING: {
        ID: 'dataListMapping',
        LABEL: 'Datalist Mapping',
    },
    FIELD_TYPE: {
        ID: 'fieldType',
        LABEL: 'Field Type',
    },
    ACTION_UUID: {
        ID: 'actionUuid',
        LABEL: 'Action UUID',
    },
};

export const REQUEST_FIELD_KEYS = {
    ID: '_id',
    STEP_UUID: 'step_uuid',
    FLOW_ID: 'flow_id',
    DATA_LIST_MAPPING: 'data_list_mapping',
    DATA_LIST_UUID: 'data_list_uuid',
    DATA_LIST_ENTRY_ACTION_TYPE: 'data_list_entry_action_type',
    MAPPING_UUID: 'mapping_uuid',
    MAPPING: 'mapping',
    SAVE_RESPONSE: 'save_response',
    SAVE_RESPONSE_FIELD: 'save_response_field',
    PICKER_FIELD_UUID: 'picker_field_uuid',
    TABLE_UUID: 'table_uuid',
    IS_AUTO_UPDATE: 'is_auto_update',
    STEP_NAME: 'step_name',
    STEP_STATUS: 'step_status',
    STEP_TYPE: 'step_type',
    STEP_ORDER: 'step_order',
    MAPPING_TYPE: 'mapping_type',
    FIELD_LIST_TYPE: 'field_list_type',
    FIELD_TYPE: 'field_type',
    PATH: 'path',
    VALUE_TYPE: 'value_type',
    DATA_LIST_FIELD_UUID: 'data_list_field_uuid',
    LABEL: 'label',
    VALUE: 'value',
    OPERATION: 'operation',
    MAPPING_ORDER: 'mapping_order',
    TABLE_COLUMN_MAPPING: 'table_column_mapping',
    FIELD_UUID: 'field_uuid',
    CONNECTED_STEPS: 'connected_steps',
    UPDATE_TYPE: 'update_type',
    FLOW_TABLE_UUID: 'flow_table_uuid',
    DATA_LIST_TABLE_UUID: 'data_list_table_uuid',
    FLOW_UUID: 'flow_uuid',
    FIELD_DETAILS: 'field_details',
    COORDINATE_INFO: 'coordinate_info',
    DATA_LIST_NAME: 'data_list_name',
    VALUE_DETAILS: 'value_details',
    IS_SUBSEQUENT_STEP: 'is_subsequent_step',
    STEP_COORDINATES: 'step_coordinates',
    DATA_LIST_ID: 'data_list_id',
    FIELD_NAME: 'field_name',
    REFERENCE_NAME: 'reference_name',
    MAPPING_SERVER_DATA: 'mapping_server_data',
    ACTION_UUID: 'action_uuid',
    SEND_DATA_DL_ACTIONS: 'send_data_to_dl_actions',
    SELECTED_ACTION_LABELS: 'selected_action_labels',
    FLOW_STEP: 'flow_step',
    FIELD_METADATA: 'field_metadata',
    DOCUMENT_DETAILS: 'document_details',
    REMOVED_DOC_LIST: 'removed_doc_list',
    CHOICE_VALUES: 'choice_values',
    CHOICE_VALUE_TYPE: 'choice_value_type',
    VALUE_META_DATA: 'value_meta_data',
    CUSTOM_LOOKUP_ID: 'custom_lookup_id',
    DL_ENTRY_ACTION_TYPE_LABEL: 'dl_entry_action_type_label',
    IS_SYSTEM_DEFINED: 'is_system_defined',
    SYSTEM_DEFINED_NAME: 'system_defined_name',
    DATA_LIST_DETAILS: 'data_list_details',
    DISPLAY_FIELDS: 'display_fields',
};

export const RESPONSE_FIELD_KEYS = {
    ID: '_id',
    STEP_UUID: 'stepUuid',
    STEP_ID: 'stepId',
    FLOW_ID: 'flowId',
    DATA_LIST_MAPPING: 'dataListMapping',
    DATA_LIST_UUID: 'dataListUuid',
    DATA_LIST_ENTRY_ACTION_TYPE: 'dataListEntryActionType',
    ENTRY_ID_FROM: 'entryIdFrom',
    ENTRY_ID_FROM_VALUE: 'entryIdFromValue',
    MAPPING_UUID: 'mappingUuid',
    MAPPING: 'mapping',
    SAVE_RESPONSE: 'saveResponse',
    SAVE_RESPONSE_FIELD: 'saveResponseField',
    PICKER_FIELD_UUID: 'pickerFieldUuid',
    TABLE_UUID: 'tableUuid',
    IS_AUTO_UPDATE: 'isAutoUpdate',
    STEP_NAME: 'stepName',
    STEP_STATUS: 'stepStatus',
    DATA_LIST_UUID_LABEL: 'dataListUuidLabel',
    TABLE_FIELD_UUID_LABEL: 'tableFieldUuidLabel',
    TABLE_FIELD_UUID_TYPE: 'tableFieldUuidType',
    PICKER_FIELD_UUID_LABEL: 'pickerFieldUuidLabel',
    SAVE_RESPONSE_FIELD_LABEL: 'saveResponseFieldLabel',
    STEP_TYPE: 'stepType',
    STEP_ORDER: 'stepOrder',
    MAPPING_TYPE: 'mappingType',
    FIELD_LIST_TYPE: 'fieldListType',
    FIELD_TYPE: 'fieldType',
    PATH: 'path',
    VALUE_TYPE: 'valueType',
    FIELD_UUID: 'fieldUuid',
    DATA_LIST_FIELD_UUID: 'dataListFieldUuid',
    LABEL: 'label',
    VALUE: 'value',
    OPERATION: 'operation',
    MAPPING_ORDER: 'mappingOrder',
    TABLE_COLUMN_MAPPING: 'tableColumnMapping',
    CONNECTED_STEPS: 'connectedSteps',
    UPDATE_TYPE: 'updateType',
    DATA_LIST_TABLE_UUID: 'dataListTableUuid',
    FLOW_UUID: 'flowuuid',
    FIELD_DETAILS: 'fieldDetails',
    COORDINATE_INFO: 'coordinateInfo',
    DATA_LIST_NAME: 'dataListName',
    VALUE_DETAILS: 'valueDetails',
    IS_SUBSEQUENT_STEP: 'isSubsequentStep',
    STEP_COORDINATES: 'stepCoordinates',
    DATA_LIST_ID: 'dataListId',
    FIELD_NAME: 'fieldName',
    REFERENCE_NAME: 'referenceName',
    MAPPING_SERVER_DATA: 'mappingServerData',
    FLOW_TABLE_UUID: 'flowTableUuid',
    ACTION_UUID: 'actionUuid',
    SEND_DATA_DL_ACTIONS: 'sendDataToDlActions',
    SELECTED_ACTION_LABELS: 'selectedActionLabels',
    FLOW_STEP: 'flowStep',
    FIELD_METADATA: 'fieldMetadata',
    CHOICE_VALUES: 'choiceValues',
    CHOICE_VALUE_TYPE: 'choiceValueType',
    VALUE_META_DATA: 'valueMetaData',
    CUSTOM_LOOKUP_ID: 'customLookupId',
    DL_ENTRY_ACTION_TYPE_LABEL: 'dlEntryActionTypeLabel',
    IS_SYSTEM_DEFINED: 'isSystemDefined',
    SYSTEM_DEFINED_NAME: 'systemDefinedName',
    DATA_LIST_DETAILS: 'dataListDetails',
    DISPLAY_FIELDS: 'displayFields',
};

export const SEND_DATA_TO_DL_INITIAL_STATE = (t = translateFunction) => {
    return {
        _id: null,
        stepUuid: null,
        flowId: null,
        stepName: EMPTY_STRING,
        stepStatus: SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).ADDITIONAL.DEFAULT_STEP_STATUS,
        stepOrder: null,
        connectedSteps: [],
        dataListMapping: {
            actionUuid: [],
            dataListUuid: null,
            dataListEntryActionType: EMPTY_STRING,
            mappingUuid: EMPTY_STRING,
            mapping: [],
            pickerFieldUuid: null,
            tableUuid: null,
            isAutoUpdate: true,
            saveResponse: false,
            saveResponseField: null,
            dlEntryActionTypeLabel: EMPTY_STRING,
        },
        sendDataToDlActions: { actionUuid: [] },
        selectedActionLabels: [],
        errorList: {},
        stepType: STEP_TYPE.SEND_DATA_TO_DATALIST,
        isLoadingNodeDetails: false,
        isErrorInLoadingNodeDetails: false,
        documentUrlDetails: {
            uploadedDocMetadata: [],
        },
        isSaveClicked: false,
    };
};

export const SEND_DATA_TO_DL_CONSTANTS = {
    DIRECT_MAPPING_TYPE: 'direct_to_direct',
    DIRECT_TO_TABLE_MAPPING_TYPE: 'direct_to_table',
    TABLE_TO_TABLE_MAPPING_TYPE: 'table_to_table',
};

export const UPDATE_DATA_LIST_OPERATIONS = {
    EQUAL_TO: 'equal_to',
    ADD: 'add',
    SUBTRACT: 'sub',
    MULTIPLY: 'mul',
    DIVIDE: 'div',
};

export const TABLE_ROW_UPDATE_TYPE = {
    ADD_NEW_ROW: 'add_new_row',
};

export const UPDATE_TYPE_OPTIONS_LIST = (t = translateFunction) => [
    {
        value: UPDATE_DATA_LIST_OPERATIONS.EQUAL_TO,
        label: t('flows.send_data_to_datalist_all_labels.operands.equal_to'),
    },
];

export const UPDATE_TYPE_OPERATORS_OPTION_LIST = (t = translateFunction) => [
    {
        value: UPDATE_DATA_LIST_OPERATIONS.ADD,
        label: t('flows.send_data_to_datalist_all_labels.operands.add'),
    }, {
        value: UPDATE_DATA_LIST_OPERATIONS.SUBTRACT,
        label: t('flows.send_data_to_datalist_all_labels.operands.sub'),
    }, {
        value: UPDATE_DATA_LIST_OPERATIONS.MULTIPLY,
        label: t('flows.send_data_to_datalist_all_labels.operands.mul'),
    }, {
        value: UPDATE_DATA_LIST_OPERATIONS.DIVIDE,
        label: t('flows.send_data_to_datalist_all_labels.operands.div'),
    }, {
        value: UPDATE_DATA_LIST_OPERATIONS.EQUAL_TO,
        label: t('flows.send_data_to_datalist_all_labels.operands.equal_to'),
    },
];
