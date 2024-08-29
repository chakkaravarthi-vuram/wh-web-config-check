import React from 'react';
import SmallTextFieldIcon from '../../../assets/icons/form_field_dropdown/SmallTextFieldIcon';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { FIELD_TYPE } from '../../../utils/constants/form.constant';

export const MODAL_ATTRIBUTES = {
  ID: 'configure-data-from-another-source-modal',
  ADD_NEW_BUTTON_ID: 'add_new_row_button',
};
export const DATA_SOURCE_OPTIONS_LIST = [
  {
    label: 'Datalist',
    value: 'Datalist',
  },
  {
    label: 'Integration',
    value: 'Integration',
  },
];
export const INTEGRATION_OPTIONS_LIST = [
  {
    label: 'Google Calendar',
    value: 'Google Calendar',
    icon: <SmallTextFieldIcon />,
  },
  {
    label: 'Zoho Books Global',
    value: 'Zoho Books Global',
    icon: <SmallTextFieldIcon />,
  },
];

export const VALUE_TYPES = {
  DIRECT: 'direct',
  EXPRESSION: 'expression',
  FIELD: 'field',
  SYSTEM_FIELD: 'system_field',
};

export const INTEGRATION_KEY_VALUE = {
  PARAM_DIRECT_TYPE: VALUE_TYPES.DIRECT,
  PARAM_EXPRESSION_TYPE: VALUE_TYPES.EXPRESSION,
};

export const FILTER_KEY_VALUE = {
  PARAM_DIRECT_TYPE: VALUE_TYPES.DIRECT,
  PARAM_FIELD_TYPE: VALUE_TYPES.FIELD,
  EQUAL_TO: 'equal_to',
};

export const OUTPUT_FORMAT_KEY_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE_AND_TIME: 'datetime',
  OBJECT: 'object',
  DATE: 'date',
  TABLE: 'table',
};

export const OUTPUT_FORMAT_CONSTANTS = {
  INIT_DEPTH: 0,
  MAX_DEPTH: 1,
  ADD_CHILD: 'add-child',
  ADD_ROW: 'external_source_strings.add_field',
  ADD_CHILD_ROW: 'external_source_strings.add_column',
  KEY_ID: 'key',
  TYPE_ID: 'type',
  VALUE_TYPE: 'value_type',
  NAME_ID: 'name',
  DELETE_ID: 'delete',
  COLUMN_MAPPING: 'column',
  FIELD_DETAILS: 'field_details',
  KEY_UUID: 'key_uuid',
  INTEGRATION_INITIAL_ROW: {
    key: EMPTY_STRING,
    type: EMPTY_STRING,
    name: EMPTY_STRING,
  },
  DATALIST_INITIAL_ROW: {
    key: EMPTY_STRING,
    type: EMPTY_STRING,
  },
  INTEGRATION: {
    HEADERS: ['Key', 'Type', 'Name', ''],
  },
  DATA_LIST: {
    HEADERS: (t) => [t('external_source_strings.field_name'), t('external_source_strings.field_type'), t('external_source_strings.label'), ''],
  },
  getDataListFieldTypes: () => [
    {
      label: 'Single-Line Text',
      value: FIELD_TYPE.SINGLE_LINE,
    },
    {
      label: 'Number',
      value: FIELD_TYPE.NUMBER,
    },
    {
      label: 'Yes/No',
      value: FIELD_TYPE.YES_NO,
    },
    {
      label: 'Checkbox',
      value: FIELD_TYPE.CHECKBOX,
    },
    {
      label: 'Dropdown',
      value: FIELD_TYPE.DROPDOWN,
    },
    {
      label: 'Radio Button',
      value: FIELD_TYPE.RADIO_GROUP,
    },
    {
      label: 'Commonly Shared Dropdown',
      value: FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
    },
    {
      label: 'Currency',
      value: FIELD_TYPE.CURRENCY,
    },
    {
      label: 'Date',
      value: FIELD_TYPE.DATE,
    },
    {
      label: 'Date & Time',
      value: FIELD_TYPE.DATETIME,
    },
    {
      label: 'Scanner',
      value: FIELD_TYPE.SCANNER,
    },
    {
      label: 'Table',
      value: FIELD_TYPE.TABLE,
    },
    {
      label: 'System Field',
      value: VALUE_TYPES.SYSTEM_FIELD,
    },
  ],
  getOptions: () => [
    {
      label: 'Text',
      value: OUTPUT_FORMAT_KEY_TYPES.TEXT,
    },
    {
      label: 'Number',
      value: OUTPUT_FORMAT_KEY_TYPES.NUMBER,
    },
    {
      label: 'Boolean',
      value: OUTPUT_FORMAT_KEY_TYPES.BOOLEAN,
    },
    {
      label: 'Date',
      value: OUTPUT_FORMAT_KEY_TYPES.DATE,
    },
    {
      label: 'Date & Time',
      value: OUTPUT_FORMAT_KEY_TYPES.DATE_AND_TIME,
    },
    {
      label: 'Object',
      value: OUTPUT_FORMAT_KEY_TYPES.OBJECT,
    },
  ],
};

export const getDefaultKeyLabels = (t, childKey, typeKey) => {
  return {
    childKey: childKey || OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING,
    typeKey: typeKey || OUTPUT_FORMAT_CONSTANTS.TYPE_ID,
    addKey: OUTPUT_FORMAT_CONSTANTS.ADD_CHILD,
    addRowText: t(OUTPUT_FORMAT_CONSTANTS.ADD_ROW),
    addChildRowText: t(OUTPUT_FORMAT_CONSTANTS.ADD_CHILD_ROW),
  };
};

export const DATA_LIST_CONSTANTS = {
  DATA_LIST_LISTING: {
    PAGE_SIZE: 15,
    SCROLLABLE_ID: 'datalist-scrollable-id',
    SCROLLABLE_THRESOLD: 0.5,
    STATE_KEYS: {
      loading: 'isDataListLoading',
      list: 'dataList',
      hasMore: 'dataListHasMore',
      totalCount: 'dataListTotalCount',
      paginationDetails: 'dataListPaginationDetails',
      errorList: 'dataListErrorList',
      currentPage: 'dataListCurrentPage',
      eachRowLabel: 'data_list_name',
      eachRowValue: 'data_list_uuid',
    },
  },
  DATA_LIST_FIELD_LISTING: {
    PAGE_SIZE: 1000,
    FIELD_STATE_KEYS: {
      loading: 'isDLFieldListLoading',
      list: 'dlFieldList',
      hasMore: 'dlFieldListHasMore',
      totalCount: 'dlFieldListTotalCount',
      paginationDetails: 'dlFieldListPaginationDetails',
      errorList: 'dlFieldListErrorLists',
      currentPage: 'dlFieldListCurrentPage',
      eachRowLabel: 'field_name',
      eachRowValue: 'field_uuid',
    },
  },
  FIELD_LISTING: {
    PAGE_SIZE: 1000,
    FIELD_STATE_KEYS: {
      loading: 'isFieldListLoading',
      list: 'fieldList',
      hasMore: 'fieldListHasMore',
      totalCount: 'fieldListTotalCount',
      paginationDetails: 'fieldListPaginationDetails',
      errorList: 'fieldListErrorList',
      currentPage: 'fieldListCurrentPage',
      eachRowLabel: 'field_name',
      eachRowValue: 'field_uuid',
    },
  },
  INITIAL_FILTER_ROW: {
    field_uuid: EMPTY_STRING,
    field_type: EMPTY_STRING,
    operator: FILTER_KEY_VALUE.EQUAL_TO,
    field_value: EMPTY_STRING,
    value_type: FILTER_KEY_VALUE.PARAM_FIELD_TYPE,
  },
  LOCAL_STATE: {
    listSearch: EMPTY_STRING,
  },
  FILTER_LABELS: {
    FIELD_UUID: 'Filter Field',
    FIELD_TYPE: 'Filter Field Type',
    VALUE: 'Filter Value',
    VALUE_TYPE: 'Filter Value Type',
    FIELD_VALUE_TYPE: 'Filter Value Field Type',
    FILTER_FIELD_TYPE: 'Filter Field Type',
    OPERATOR: 'Operator',
  },
  OPERATOR: {
    AND: 'AND',
  },
  QUERY_TYPE: {
    SINGLE: 1,
    ALL: 2,
    SUB_TABLE_QUERY: 3,
    DISTINCT: 4,
    CUSTOM: 5,
  },
  QUERY_RESULT: {
    SINGLE_VALUE: 1,
    MULTIPLE_VALUE: -1,
  },
};

export const MULTIPLE_ENTRY_TYPES = [
  DATA_LIST_CONSTANTS.QUERY_TYPE.ALL,
  DATA_LIST_CONSTANTS.QUERY_TYPE.CUSTOM,
  DATA_LIST_CONSTANTS.QUERY_TYPE.SUB_TABLE_QUERY,
];

export const INTEGRATION_CONSTANTS = {
  INTEGRATION_LIST: {
    PAGE_SIZE: 15,
    SCROLLABLE_ID: 'integration-scrollable-id',
    SCROLLABLE_THRESOLD: 0.5,
    STATE_KEYS: {
      loading: 'isIntegrationListLoading',
      list: 'integrationList',
      hasMore: 'integrationListHasMore',
      totalCount: 'integrationListTotalCount',
      paginationDetails: 'integrationListPaginationDetails',
      errorList: 'integrationListErrorList',
      currentPage: 'integrationListCurrentPage',
      eachRowLabel: 'connector_name',
      eachRowValue: 'connector_uuid',
    },
    EVENT_STATE_KEYS: {
      loading: 'isEventListLoading',
      list: 'eventList',
      hasMore: 'eventListHasMore',
      totalCount: 'eventListTotalCount',
      paginationDetails: 'eventListPaginationDetails',
      errorList: 'eventListErrorList',
      currentPage: 'eventListCurrentPage',
      eachRowLabel: 'name',
      eachRowValue: 'event_uuid',
    },
    FIELD_STATE_KEYS: {
      loading: 'isFieldListLoading',
      list: 'fieldList',
      hasMore: 'fieldListHasMore',
      totalCount: 'fieldListTotalCount',
      paginationDetails: 'fieldListPaginationDetails',
      errorList: 'fieldListErrorList',
      currentPage: 'fieldListCurrentPage',
      eachRowLabel: 'field_name',
      eachRowValue: 'field_uuid',
    },
    INITIAL_RELATIVE_PATH_ROW: {
      path_name: EMPTY_STRING,
      value: EMPTY_STRING,
      type: INTEGRATION_KEY_VALUE.PARAM_EXPRESSION_TYPE,
    },
    INITIAL_PARAM_ROW: {
      key: EMPTY_STRING,
      value: EMPTY_STRING,
      type: INTEGRATION_KEY_VALUE.PARAM_EXPRESSION_TYPE,
    },
  },
  EVENTS_LIST: {
    SCROLLABLE_ID: 'events-scrollable-id',
    SCROLLABLE_THRESOLD: 0.5,
    METHODS: {
      GET: 'GET',
    },
  },
  FIELD_LIST: {
    PAGE_SIZE: 1000,
  },
  LOCAL_STATE: {
    listSearch: EMPTY_STRING,
    eventSearch: EMPTY_STRING,
  },
};

export const ACTION_CONSTANTS = {
  EXTERNAL_SOURCE_DATA_CHANGE: 'EXTERNAL_SOURCE_DATA_CHANGE',
};

export const FIELD_IDS = {
  EXTERNAL_SOURCE: 'selectedExternalSource',
  SOURCE_NAME: 'ruleName',
  CONNECTOR_UUID: 'connectorUuid',
  EVENT_UUID: 'eventUuid',
  RELATIVE_PATH: 'relativePath',
  QUERY_PARAMS: 'queryParams',
  OUTPUT_FORMAT: 'outputFormat',
  TYPE: 'type',
  VALUE: 'value',
  DATA_LIST_UUID: 'dataListUuid',
  DATA_LIST_NAME: 'dataListName',
  RULE_DATA_LIST_ID: 'ruleDataListId',
  FILTER: 'filter',
  FEILD_UUID: 'field_uuid',
  FEILD_TYPE: 'field_type',
  VALUE_TYPE: 'value_type',
  FIELD_VALUE_TYPE: 'field_value_type',
  FILTER_FIELD_TYPE: 'filter_field_type',
  FIELD_VALUE: 'field_value',
  FIELD: 'field',
  RULE_DETAILS: 'rule_details',
  RULE_TYPE: 'ruleType',
  RULE: 'rule',
  RULE_UUID: 'ruleUuid',
  QUERY_RESULT: 'queryResult',
  CHOICE_VALUE_TYPE: 'choiceValueType',
  FILTER_VALUE_CHOICE_VALUE_TYPE: 'filterValueChoiceValueType',
  SORT_FIELD: 'sortField',
  SORT_ORDER: 'sortOrder',
  DISTINCT_FIELD: 'distinctField',
  POST_FILTER: 'post_filter',
  POST_RULE: 'postRule',
  IS_LIMIT_FIELDS: 'isLimitFields',
  TABLE_UUID: 'tableUUID',
};

export const POST_DATA_KEYS = {
  RULE: 'rule',
  RULE_UUID: 'rule_uuid',
  RULE_TYPE: 'rule_type',
  TASK: 'task_metadata_id',
  FLOW: 'flow_id',
  DATA_LIST: 'data_list_id',
  PAGE_ID: 'page_id',
  SOURCE_NAME: 'rule_name',
  RULE_ID: '_id',
  CONNECTOR_UUID: 'connector_uuid',
  EVENT_UUID: 'event_uuid',
  QUERY_PARAMS: 'query_params',
  RELATIVE_PATH: 'relative_path',
  OUTPUT_FORMAT: 'output_format',
  KEY: 'key',
  VALUE: 'value',
  TYPE: 'type',
  PATHNAME: 'path_name',
  NAME: 'name',
  MAPPING_INFO: 'mapping_info',
  COLUMN_MAPPING: 'column_mapping',
  UUID: 'uuid',
  DATA_LIST_UUID: 'data_list_uuid',
  DATA_LIST_NAME: 'data_list_name',
  RULE_DATA_LIST_ID: 'data_list_id',
  FILTER: 'filter',
  POST_FILTER: 'post_filter',
  LOGICAL_OPERATOR: 'logical_operator',
  EXPRESSION: 'expression',
  FIELD: 'field',
  FIELD_VALUE_TYPE: 'field_value_type',
  FILTER_FIELD_TYPE: 'filter_field_type',
  FIELD_UUID: 'field_uuid',
  FIELD_TYPE: 'field_type',
  OPERATOR: 'operator',
  FIELD_VALUE: 'field_value',
  VALUE_TYPE: 'value_type',
  DATA_LIST_FIELD_UUID: 'data_list_field_uuid',
  QUERY_RESULT: 'query_result',
  CHOICE_VALUE_TYPE: 'choice_value_type',
  DISTINCT_FIELD: 'distinct_field',
  SORT: 'sort',
};

export const VALIDATION_CONSTANTS = {
  COMMON_MIN_CHAR: 2,
  COMMON_MAX_CHAR: 255,
};

export const DL_QUERY_ALLOWED_FIELD_TYPES = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.YES_NO,
  FIELD_TYPE.CHECKBOX,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.RADIO_GROUP,
  FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
  FIELD_TYPE.CURRENCY,
  FIELD_TYPE.DATE,
  FIELD_TYPE.DATETIME,
  FIELD_TYPE.SCANNER,
  FIELD_TYPE.TABLE,
];

export const DL_QUERY_IGNORED_FIELD_TYPES = [
  FIELD_TYPE.INFORMATION,
  FIELD_TYPE.USER_PROPERTY_PICKER,
  FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
  FIELD_TYPE.FILE_UPLOAD,
];

export const SORTABLE_ALLOWED_FIELD_TYPES = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.EMAIL,
  FIELD_TYPE.SCANNER,
  FIELD_TYPE.NUMBER,

  FIELD_TYPE.YES_NO,
  FIELD_TYPE.RADIO_GROUP,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,

  FIELD_TYPE.DATE,
  FIELD_TYPE.DATETIME,
];

export const FILTER_ALLOWED_FIELD_TYPES = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.YES_NO,
  FIELD_TYPE.CHECKBOX,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.RADIO_GROUP,
  FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
  FIELD_TYPE.CURRENCY,
  FIELD_TYPE.DATE,
  FIELD_TYPE.DATETIME,
  FIELD_TYPE.SCANNER,
  FIELD_TYPE.TABLE,
  FIELD_TYPE.DATA_LIST,
];

export const INTEGRATION_IGNORED_FIELD_TYPES = [
  FIELD_TYPE.CURRENCY,
  FIELD_TYPE.PHONE_NUMBER,
  FIELD_TYPE.DATA_LIST,
  FIELD_TYPE.USER_TEAM_PICKER,
  FIELD_TYPE.FILE_UPLOAD,
  FIELD_TYPE.INFORMATION,
  FIELD_TYPE.LINK,
];

export const RULE_TYPES = {
  INTEGRATION: 'rule_form_integration',
  DATA_LIST: 'rule_data_list_query',
};

export const API_CONSTANTS = {
  PUBLISHED: 'published',
};
