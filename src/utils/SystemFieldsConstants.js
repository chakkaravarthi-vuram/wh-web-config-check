import { FIELD_PICKER_DROPDOWN_TYPES } from '../components/field_picker/FieldPicker.utils';
import { FIELD_TYPES } from '../components/form_builder/FormBuilder.strings';
import { convertBeToFeKeys } from './normalizer.utils';
import { SYSTEM_FIELDS_LABELS, SYSTEM_FIELDS_TITLE_STRINGS } from './strings/CommonStrings';

export const SYSTEM_FIELDS_TITLE_KEYS = {
    TEXT_FIELDS: 'text',
    REFERENCE_FIELDS: 'reference',
    DATE_TIME_FIELDS: 'dateTime',
};

export const SYSTEM_FIELD_KEYS = {
    ACTIVE_TASK: 'active_task',
    ACTIVE_TASK_OWNER: 'active_task_owner',
    COMPLETED_BY: 'completed_by',
    COMPLETED_ON: 'completed_on',
    CREATED_BY: 'created_by',
    CREATED_ON: 'created_on',
    FLOW_LINK: 'flow_link',
    FLOW_ID: 'system_identifier',
    OPEN_WITH: 'open_with',
    STATUS: 'status',
    STEP_FIELDS: 'step_fields',
    STEP_NAME: 'step_name',
    DATALIST_ID: 'system_identifier',
    DATALIST_LINK: 'data_list_link',
    LAST_UPDATED_BY: 'last_updated_by',
    LAST_UPDATED_ON: 'last_updated_on',
};

export const STEP_SYSTEM_FIELD_KEYS = {
    ACCEPTED_BY: 'accepted_by',
    ACCEPTED_ON: 'accepted_on',
    ACTION: 'action',
    ACTOR_REPORTING_MANAGER: 'actor_reporting_manager',
    ASSIGNED_ON: 'assigned_on',
    ASSIGNED_TO: 'assigned_to',
    COMPLETED_BY: 'completed_by',
    COMPLETED_ON: 'completed_on',
    DUE_DATE: 'due_date',
    TASK_COMMENTS: 'task_comments',
};

export const SYSTEM_FIELDS_TITLE_LIST = {
    [SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS]: {
        label: SYSTEM_FIELDS_TITLE_STRINGS.TEXT_FIELDS,
        value: SYSTEM_FIELDS_TITLE_STRINGS.TEXT_FIELDS,
        optionType: FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE,
        disabled: true,
    },
    [SYSTEM_FIELDS_TITLE_KEYS.REFERENCE_FIELDS]: {
        label: SYSTEM_FIELDS_TITLE_STRINGS.REFERENCE_FIELDS,
        value: SYSTEM_FIELDS_TITLE_STRINGS.REFERENCE_FIELDS,
        optionType: FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE,
        disabled: true,
    },
    [SYSTEM_FIELDS_TITLE_KEYS.DATE_TIME_FIELDS]: {
        label: SYSTEM_FIELDS_TITLE_STRINGS.DATE_TIME_FIELDS,
        value: SYSTEM_FIELDS_TITLE_STRINGS.DATE_TIME_FIELDS,
        optionType: FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE,
        disabled: true,
    },
};

export const SYSTEM_FIELDS = {
    ID: {
        id: '_id',
        label: SYSTEM_FIELDS_LABELS.ID,
        value: '_id',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.SINGLE_LINE,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS,
    },
    FLOW_ID: {
        id: 'flow_id',
        label: SYSTEM_FIELDS_LABELS.FLOW_ID,
        value: 'flow_id',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.SINGLE_LINE,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS,
    },
    DATA_LIST_ID: {
        id: 'data_list_id',
        label: SYSTEM_FIELDS_LABELS.DATA_LIST_ID,
        value: 'data_list_id',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.SINGLE_LINE,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS,
    },
    FLOW_LINK: {
        id: 'flow_link',
        label: SYSTEM_FIELDS_LABELS.FLOW_LINK,
        value: 'flow_link',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.LINK,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS,
    },
    STATUS: {
        id: 'status',
        label: SYSTEM_FIELDS_LABELS.FLOW_LINK,
        value: 'status',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.SINGLE_LINE,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS,
    },
    DATA_LIST_LINK: {
        id: 'data_list_link',
        label: SYSTEM_FIELDS_LABELS.DATA_LIST_LINK,
        value: 'data_list_link',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.LINK,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS,
    },
    COMMENTS: {
        id: 'comments',
        label: SYSTEM_FIELDS_LABELS.COMMENTS,
        value: 'task_comments',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.PARAGRAPH,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS,
    },
    SEARCH: {
        id: 'search',
        label: SYSTEM_FIELDS_LABELS.SEARCH,
        value: 'search',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.SINGLE_LINE,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS,
    },
    PAGE: {
        id: 'page',
        label: SYSTEM_FIELDS_LABELS.PAGE,
        value: 'page',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.SINGLE_LINE,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS,
    },
    SIZE: {
        id: 'size',
        label: SYSTEM_FIELDS_LABELS.SIZE,
        value: 'size',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.SINGLE_LINE,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS,
    },
    SORT_BY: {
        id: 'sort_by',
        label: SYSTEM_FIELDS_LABELS.SORT_BY,
        value: 'sort_by',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.SINGLE_LINE,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS,
    },
    SORT_FIELD: {
        id: 'sort_field',
        label: SYSTEM_FIELDS_LABELS.SORT_FIELD,
        value: 'sort_field',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.SINGLE_LINE,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS,
    },
    CREATED_BY: {
        id: 'created_by',
        label: SYSTEM_FIELDS_LABELS.CREATED_BY,
        value: 'created_by',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.USER_TEAM_PICKER,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.REFERENCE_FIELDS,
    },
    UPDATED_BY: {
        id: 'updated_by',
        label: SYSTEM_FIELDS_LABELS.UPDATED_BY,
        value: 'updated_by',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.USER_TEAM_PICKER,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.REFERENCE_FIELDS,
    },
    LAST_UPDATED_BY: {
        id: 'last_updated_by',
        label: SYSTEM_FIELDS_LABELS.LAST_UPDATED_BY,
        value: 'last_updated_by',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.USER_TEAM_PICKER,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.REFERENCE_FIELDS,
    },
    COMPLETED_BY: {
        id: 'completed_by',
        label: SYSTEM_FIELDS_LABELS.COMPLETED_BY,
        value: 'completed_by',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.USER_TEAM_PICKER,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.REFERENCE_FIELDS,
    },
    COMPLETED_ON: {
        id: 'completed_on',
        label: SYSTEM_FIELDS_LABELS.COMNPLETED_ON,
        value: 'completed_on',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.DATETIME,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.REFERENCE_FIELDS,
    },
    CREATED_ON: {
        id: 'created_on',
        label: SYSTEM_FIELDS_LABELS.CREATED_ON,
        value: 'created_on',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.DATETIME,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.DATE_TIME_FIELDS,
    },
    UPDATED_ON: {
        id: 'updated_on',
        label: SYSTEM_FIELDS_LABELS.UPDATED_ON,
        value: 'updated_on',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.DATETIME,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.DATE_TIME_FIELDS,
    },
    LAST_UPDATED_ON: {
        id: 'last_updated_on',
        label: SYSTEM_FIELDS_LABELS.LAST_UPDATED_ON,
        value: 'last_updated_on',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.DATETIME,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.DATE_TIME_FIELDS,
    },
    PROCESSED_ON: {
        id: 'processed_on',
        label: 'Flow processed On',
        value: 'processed_on',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.DATETIME,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.DATE_TIME_FIELDS,
    },
    PROCESSED_BY: {
        id: 'processed_by',
        label: 'Flow processed by',
        value: 'processed_by',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.USER_TEAM_PICKER,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.REFERENCE_FIELDS,
    },
    INITIATED_BY: {
        id: 'initiated_by',
        label: 'Flow started by',
        value: 'd',
        system_field_type: 'system_field',
        field_type: FIELD_TYPES.USER_TEAM_PICKER,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.REFERENCE_FIELDS,
    },
    ENTRY_ID: {
        id: 'entry_id',
        label: 'Datalist Entry Id',
        value: 'entry_id',
        system_field_type: FIELD_TYPES.DATA_LIST,
        field_type: FIELD_TYPES.DATA_LIST,
        title_key: SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS,
    },
};

export const getModifiedSystemFields = () => convertBeToFeKeys(SYSTEM_FIELDS);

export const STEP_SYSTEM_FIELDS = {
    ASSIGNED_ON: {
        label: 'Assigned On',
        value: 'assigned_on',
        fieldType: FIELD_TYPES.DATETIME,
    },
    ASSIGNED_TO: {
        label: 'Assignee(s)',
        value: 'assigned_to',
        fieldType: FIELD_TYPES.USER_TEAM_PICKER,
    },
    ACCEPTED_BY: {
        label: 'Accepted By',
        value: 'accepted_by',
        fieldType: FIELD_TYPES.USER_TEAM_PICKER,
    },
    ACCEPTED_ON: {
        label: 'Accepted On',
        value: 'accepted_on',
        fieldType: FIELD_TYPES.DATETIME,
    },
    COMPLETED_BY: {
        label: 'Completed By',
        value: 'completed_by',
        fieldType: FIELD_TYPES.USER_TEAM_PICKER,
    },
    COMPLETED_ON: {
        label: 'Completed On',
        value: 'completed_on',
        fieldType: FIELD_TYPES.DATETIME,
    },
    BUTTON_ACTION: {
        label: 'Button Action Taken',
        value: 'action',
    },
    COMMENTS: {
        label: 'Comments Provided',
        value: 'task_comments',
    },
    DUE_DATE: {
        label: 'Due Date',
        value: 'due_date',
        fieldType: FIELD_TYPES.DATETIME,
    },
    REPORTING_MANAGER: {
        label: 'Reporting manager of current step finisher',
        value: 'actor_reporting_manager',
        fieldType: FIELD_TYPES.USER_TEAM_PICKER,
    },
    PROCESSED_BY: {
        label: 'Flow processed by',
        value: 'processed_by',
        fieldType: FIELD_TYPES.USER_TEAM_PICKER,
    },
};
