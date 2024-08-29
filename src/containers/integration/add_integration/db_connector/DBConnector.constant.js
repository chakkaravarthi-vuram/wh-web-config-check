import { EMPTY_STRING } from 'utils/strings/CommonStrings';

export const QUERY_ACTION_OPTIONS = [
  {
    label: 'Fetch Data',
    value: 1,
  },
];

export const INITIAL_FIELD_TO_FETCH_DATA = {
  field_name: EMPTY_STRING,
  field_type: EMPTY_STRING,
  type_cast: EMPTY_STRING,
  display_name: EMPTY_STRING,
};

export const INITIAL_FILTER_DATA_BY_DATA = {
  field_name: EMPTY_STRING,
  field_type: EMPTY_STRING,
  operator: EMPTY_STRING,
  values: [EMPTY_STRING],
};

export const DB_TYPE = {
  MYSQL: 'mysql',
  ORACLE: 'oracle',
  MSSQL: 'mssql',
};

export const NUMERIC_TYPES = [
  'int',
  'integer',
  'float',
  'double',
  'decimal',
  'tinyint',
  'number',
  'real',
];

export const DATA_TYPE = ['date', 'datetime', 'timestamp'];

export const DEFAULT_TYPE_CAST_VALUE = 'auto';

export const FILTER_OPERATOR = {
  BETWEEN: 'BETWEEN',
  IN: 'IN',
};
