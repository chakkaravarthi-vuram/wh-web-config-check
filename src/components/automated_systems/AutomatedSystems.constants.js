import { TIME_DROPDOWN } from '../../utils/strings/CommonStrings';
import { cloneDeep } from '../../utils/jsUtility';
import { SYSTEM_FIELDS, SYSTEM_FIELD_KEYS } from '../../utils/SystemFieldsConstants';
import { FIELD_TYPES } from '../../containers/form/sections/field_configuration/FieldConfiguration.strings';

export const SCHEDULAR_CONSTANTS = {
    TYPE: {
        MONTH: 'month',
        DAY: 'day',
    },
    REPEAT_TYPE: {
        FIRST_DAY: 'first_day',
        LAST_DAY: 'last_day',
        SELECTED_WEEK_DAY: 'selected_week_day',
        SELECTED_DATE: 'selected_date',
    },
    TRIGGER_TYPE: {
        SCHEDULER: 1,
        FIELD_VALUE_CHANGE: 2,
    },
    SET_WEEK: {
        FIRST_WEEK: 1,
        SECOND_WEEK: 2,
        THIRD_WEEK: 3,
        FOURTH_WEEK: 4,
        FIFTH_WEEK: 5,
    },
    CONDITION_TYPE: {
        ALL: 1,
        CONDITION: 2,
    },
    DAYS: {
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FIRDAY: 5,
        SATURDAY: 6,
        SUNDAY: 7,
    },
    TRIGGER: {
        EMAIL: 1,
        FLOW: 2,
    },
};

export const FLOW_ACTION_VALUE_TYPE = {
    STATIC: 'static',
    DYNAMIC: 'dynamic',
    SYSTEM: 'system',
    MAP_ENTRY: 'map_entry',
};

export const FIELD_MAPPING_ROW_INITIAL_STATE = {
    dataListFieldData: {},
    dataListFieldUUID: null,
    dataListFieldType: null,
    flowFieldData: {},
    flowFieldUUID: null,
    flowFieldType: null,
    valueType: FLOW_ACTION_VALUE_TYPE.DYNAMIC,
};

 export const SYSTEM_FIELDS_FOR_AUTOMATION_SYSTEM = [
    SYSTEM_FIELDS.DATA_LIST_ID,
    SYSTEM_FIELDS.DATA_LIST_LINK,
    SYSTEM_FIELDS.CREATED_BY,
    SYSTEM_FIELDS.CREATED_ON,
    SYSTEM_FIELDS.LAST_UPDATED_BY,
    SYSTEM_FIELDS.LAST_UPDATED_ON,
 ];

export const ALLOW_AUTOMATED_SYSTEM_ACTION_FIELDS = [
    SYSTEM_FIELD_KEYS.DATALIST_ID,
    SYSTEM_FIELD_KEYS.DATALIST_LINK,
    SYSTEM_FIELD_KEYS.CREATED_BY,
    SYSTEM_FIELD_KEYS.CREATED_ON,
    SYSTEM_FIELD_KEYS.LAST_UPDATED_BY,
    SYSTEM_FIELD_KEYS.LAST_UPDATED_ON,
];

 // Remove after verifying
export const RESPONSE_AUTOMATED_SYSTEM_KEYS = {
    ID: 'id',
    EVENT_UUID: 'eventUUID',
    DATA_LIST_ID: 'dataListId',
    DATA_LIST_UUID: 'dataListUUID',
    EVENT_NAME: 'eventName',
    EVENT_TYPE: 'eventType',

    SCHEDULER_DETAILS: 'schedulerDetails',
    IS_RECURSIVE: 'isRecursive',
    RECURSIVE_DATA: 'recursiveData',
    SCHEDULER_TYPE: 'schedulerType',
    SCHEDULER_TIME_AT: 'schedulerTimeAt',
    OFFSET: 'offset',
    IS_WORKING: 'isWorking',
    ON_DAYS: 'onDays',
    REPEAT_TYPE: 'repeatType',
    ON_DATE: 'onDate',
    ON_WEEK: 'onWeek',
    ON_DAY: 'onDay',

    FIELD_CHANGE: 'fieldChange',

    DATA_CONDITION: 'dataCondition',
    QUERY_BY: 'queryBy',
    CONDITION: 'condition',

    TRIGGER: 'trigger',
    TRIGGER_MAPPING: 'triggerMapping',

    FLOW_ACTIONS: 'flowActions',
    CHILD_FLOW_UUID: 'childFlowUUID',
    CHILD_FLOW_ID: 'childFlowId',
    DATA_LIST_FIELD_DATA: 'dataListFieldData',
    DATA_LIST_FIELD_UUID: 'dataListFieldUUID',
    DATA_LIST_TABLE_UUID: 'dataListTableUUID',
    DATA_LIST_FIELD_TYPE: 'dataListFieldType',
    FLOW_FIELD_DATA: 'flowFieldData',
    FLOW_FIELD_UUID: 'flowFieldUUID',
    FLOW_TABLE_UUID: 'flowTableUUID',
    FLOW_FIELD_TYPE: 'flowFieldType',
    VALUE_TYPE: 'valueType',
    STATIC_VALUE: 'staticValue',
    SYSTEM_FIELD: 'systemField',
    TABLE_COLUMN_MAPPING: 'fieldMapping',
    ADD_COLUMN: 'addColumn',
    ADD_MORE_FIELDS: 'addMoreFields',
    DELETE: 'delete',
    // CHILD_FLOW_UUID: 'childFlowUUID',
    // PARENT_FIELD_UUID: 'parentFieldUUID',
    // CHILD_FIELD_UUID: 'childFieldUUID',
    // STATIC_VALUE: 'staticValue',
    // SYSTEM_FIELD: 'systemField',
    // CHILD_TABLE_UUID: 'childTableUUID',
    // PARENT_TABLE_UUID: 'parentTableUUID',
    // VALUE_TYPE: 'valueType',
    // FIELD_MAPPING: 'fieldMapping',
};

 export const AUTOMATED_SYSTEM_KEYS = {

    TABLE_COLUMN_MAPPING: 'fieldMapping',
    FLOW_FIELD_TYPE: 'flowFieldType',
    FLOW_FIELD_DATA: 'flowFieldData',
    FLOW_FIELD_UUID: 'flowFieldUUID',
    FLOW_TABLE_UUID: 'flowTableUUID',
    DELETE: 'delete',
    TRIGGER_MAPPING: 'triggerMapping',
    DATA_LIST_FIELD_DATA: 'dataListFieldData',
    DATA_LIST_FIELD_UUID: 'dataListFieldUUID',
    DATA_LIST_TABLE_UUID: 'dataListTableUUID',
    DATA_LIST_FIELD_TYPE: 'dataListFieldType',
    VALUE_TYPE: 'valueType',
    STATIC_VALUE: 'staticValue',
    FLOW_ACTIONS: 'flowActions',

};

const AUTOMATED_TRIGGER_TIME = cloneDeep(TIME_DROPDOWN);

const AUTOMATED_SELECTED_WEEK = (t) => [
    {
        label: t('automated_systems.repeat_on.repeat_every_week.first_week'),
        value: SCHEDULAR_CONSTANTS.SET_WEEK.FIRST_WEEK,
    }, {
        label: t('automated_systems.repeat_on.repeat_every_week.second_week'),
        value: SCHEDULAR_CONSTANTS.SET_WEEK.SECOND_WEEK,
    }, {
        label: t('automated_systems.repeat_on.repeat_every_week.third_week'),
        value: SCHEDULAR_CONSTANTS.SET_WEEK.THIRD_WEEK,
    }, {
        label: t('automated_systems.repeat_on.repeat_every_week.fourth_week'),
        value: SCHEDULAR_CONSTANTS.SET_WEEK.FOURTH_WEEK,
    }, {
        label: t('automated_systems.repeat_on.repeat_every_week.fifth_week'),
        value: SCHEDULAR_CONSTANTS.SET_WEEK.FIFTH_WEEK,
    },
];

export const DATA_CHANGE_MODULE = {
    SCHEDULAR: 'schedular',
    CONDITION: 'condition',
    TRIGGER: 'trigger',
    COMMON: 'common',
};

export const DL_FIELD_TYPES_FOR_AUTOMATED_SYSTEMS = [
    FIELD_TYPES.SINGLE_LINE,
    FIELD_TYPES.PARAGRAPH,
    FIELD_TYPES.NUMBER,
    FIELD_TYPES.YES_NO,
    FIELD_TYPES.RADIO_GROUP,
    FIELD_TYPES.CHECKBOX,
    FIELD_TYPES.DROPDOWN,
    FIELD_TYPES.DATE,
    FIELD_TYPES.DATETIME,
    FIELD_TYPES.FILE_UPLOAD,
    FIELD_TYPES.USER_TEAM_PICKER,
    FIELD_TYPES.DATA_LIST,
    FIELD_TYPES.EMAIL,
    FIELD_TYPES.PHONE_NUMBER,
    FIELD_TYPES.CURRENCY,
    FIELD_TYPES.LINK,
    FIELD_TYPES.SCANNER,
];

export const VALIDATION_CONSTANTS = {
    LINK_TEXT: 'link_text',
    LINK_URL: 'link_url',
    CURRENCY_TYPE: 'currency_type',
    VALUE: 'value',
};

export const AUTOMATION_SYSTEM_FIELD_MAPPING_ERRORS = {
    CURRENCY_TYPE_REQUIRED: 'flow_trigger.field_mapping_errors.currency_type_required',
    CURRENCY_VALUE_REQUIRED: 'flow_trigger.field_mapping_errors.currency_value_required',
    TYPE_MISMATCH_TEXT: 'flow_trigger.field_mapping_errors.type_mismatch_text',
    MIN_ONE_TABLE_COLUMN: 'flow_trigger.field_mapping_errors.min_one_table_column',
    CROSS_TABLE_MAPPING_TEXT: 'flow_trigger.field_mapping_errors.cross_table_mapping_text',
};

export const SCHEDULER_REDUCER_CONSTANTS = {
    SCHEDULER_DEFAULT_TIME: '12:00 AM',
    SCHEDULER_DEFAULT_DATE: 1,
    SCHEDULER_DEFAULT_WEEK: 1,
};

export {
    AUTOMATED_TRIGGER_TIME,
    AUTOMATED_SELECTED_WEEK,
};
