export const FIELD_MAPPING_TABLE_TYPES = {
  KEY_VALUE_MAPPING: 1,
  KEY_VALUE_MAPPING_WITH_TYPE: 2,
  KEY_VALUE_MAPPING_WITH_UPDATE_TYPE: 3,
  RESPONSE_FIELD_MAPPING: 4,
  REQ_BODY_VALUE_MAPPING: 5,
};

export const MAPPING_COMPONENT_TYPES = {
  SEND_DATA_TO_DL: 'SEND_DATA_TO_DL',
  CALL_INTEGRATION: 'CALL_INTEGRATION',
  CALL_SUB_FLOW: 'CALL_SUB_FLOW',
  SHORTCUT_TRIGGER: 'SHORTCUT_TRIGGER',
  TRIGGER_ACTIONS: 'TRIGGER_ACTIONS',
};

export const FIELD_VALUE_TYPES = {
  DYNAMIC: 'dynamic',
  SYSTEM: 'system',
  STATIC: 'static',
  ITERATIVE: 'iterative',
  MAP_ENTRY: 'map_entry',
  USER_ENTRY: 'map_user',
};

export const ROW_COMPONENT_KEY_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE_AND_TIME: 'datetime',
  OBJECT: 'object',
  DATE: 'date',
  TABLE: 'table',
  STREAM: 'stream',
};

export const ROW_COMPONENT_CONSTANTS = {
  VALUE: 'value',
  VALUE_TYPE: 'type',
  FIELD_TYPE: 'fieldType',
  COLUMN_MAPPING: 'columnMapping',
  PROPERTY_FIELD_TYPE: 'propertyFieldType',
  PROPERTY_CHOICE_VALUE_TYPE: 'propertyChoiceValueType',
  CHOICE_VALUE_TYPE: 'choiceValueType',
  SEND_DATA_TO_DL: {
    TABLE_COLUMN_MAPPING: 'tableColumnMapping',
    DIRECT_TO_DIRECT_MAPPING: 'direct_to_direct',
    DIRECT_TO_TABLE_MAPPING: 'direct_to_table',
    TABLE_TO_TABLE_MAPPING: 'table_to_table',
  },
  RESPONSE_BODY_MAX_DEPTH: 1,
  ANOTHER_VALUE_UPDATE_TYPES: {
    RESPONSE_BODY_TYPE: 1,
    RESPONSE_BODY_VALUE_NAME: 2,
  },
  getResponseBodyOptions: () => [
    {
      label: 'Text',
      value: ROW_COMPONENT_KEY_TYPES.TEXT,
    },
    {
      label: 'Number',
      value: ROW_COMPONENT_KEY_TYPES.NUMBER,
    },
    {
      label: 'Boolean',
      value: ROW_COMPONENT_KEY_TYPES.BOOLEAN,
    },
    {
      label: 'Date',
      value: ROW_COMPONENT_KEY_TYPES.DATE,
    },
    {
      label: 'Date & Time',
      value: ROW_COMPONENT_KEY_TYPES.DATE_AND_TIME,
    },
    {
      label: 'Object',
      value: ROW_COMPONENT_KEY_TYPES.OBJECT,
    },
    {
      label: 'Stream',
      value: ROW_COMPONENT_KEY_TYPES.STREAM,
    },
  ],
};

export const REQ_BODY_KEY_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE_AND_TIME: 'datetime',
  OBJECT: 'object',
  DATE: 'date',
  STREAM: 'stream',
};
