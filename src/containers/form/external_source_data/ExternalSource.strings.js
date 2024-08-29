import { ASCENDING, DESCENDING } from '../../../utils/strings/CommonStrings';
import { SEND_DATALIST_DROPDOWN_TYPES } from '../../edit_flow/step_configuration/configurations/Configuration.strings';
import {
  DATA_LIST_CONSTANTS,
  FIELD_IDS,
  OUTPUT_FORMAT_CONSTANTS,
} from './ExternalSource.constants';

export const CANCEL = 'common_strings.cancel';
export const SAVE = 'common_strings.save';
export const HEADER_TEXT = 'external_source_strings.title';
export const HEADER_SUB_TEXT = 'external_source_strings.sub_title';
export const MAIN_TEXT = 'Main content';

export const DATA_SOURCE = 'external_source_strings.data_source';
export const DATA_SOURCE_TYPES = {
  INTEGRATION: 'Integration',
  DATA_LIST: 'Datalist',
};

export const EXTERNAL_SOURCE_STRINGS = {
  RULE_NAME: {
    ID: 'ruleName',
    LABEL: 'external_source_strings.ref_name',
    PLACEHOLDER: 'external_source_strings.ref_name_placeholder',
  },
};

export const DATALIST_STRINGS = {
  CHOOSE_DATALIST: {
    ID: 'dataListUuid',
    LABEL: 'external_source_strings.choose_datalist',
    ERROR_LABEL: 'external_source_strings.dl_error_label',
    PLACEHOLDER: 'external_source_strings.choose_datalist_placeholder',
    SEARCH_PLACEHOLDER: 'external_source_strings.search_datalist',
  },
  FILTER_AND_SORT: {
    TITLE: 'external_source_strings.filter_and_sorting',
    FILTER: {
      ID: 'filter',
      getHeaders: () => ['Filter Field', 'Filter Value', ''],
    },
    SORT: {
      SORT_FIELD: 'sortField',
      ID: 'sortOrder',
      TITLE: 'external_source_strings.sort',
      PLACEHOLDER: 'external_source_strings.asc_desc',
      OPTIONS: (t) => [
          {
            label: t(ASCENDING),
            value: 1,
          },
          {
            label: t(DESCENDING),
            value: -1,
          },
        ],
    },
  },
  LIMIT: {
    ID: 'type',
    QUERY_RESULT: 'queryResult',
    LABEL: 'external_source_strings.no_of_entries',
    OPTION_LIST: (t) => [
      {
        label: t('external_source_strings.multiple_entries'),
        value: DATA_LIST_CONSTANTS.QUERY_TYPE.ALL,
      },
      {
        label: t('external_source_strings.single_entry'),
        value: DATA_LIST_CONSTANTS.QUERY_TYPE.SINGLE,
      },
      // {
      //   label: 'Custom',
      //   value: DATA_LIST_CONSTANTS.QUERY_TYPE.CUSTOM,
      // },
      {
        label: t('external_source_strings.combine_entries'),
        value: DATA_LIST_CONSTANTS.QUERY_TYPE.SUB_TABLE_QUERY,
      },
      {
        label: 'Sub Table Query',
        value: DATA_LIST_CONSTANTS.QUERY_TYPE.SUB_TABLE_QUERY,
      },
    ],
    AGGREGATE: {
      TITLE: 'Aggregation',
      DISTINCT: {
        OPTION: [{
          label: 'Distinct',
          value: 4,
        }],
        DROPDOWN: {
          ID: 'distinctField',
          PLACEHOLDER: 'Choose a distinct field',
        },
      },
    },
  },
  ALWAYS_OR_CONDITIONALLY: {
    ID: 'always_or_conditionally',
    LABEL: 'Always/Conditionally',
  },
  ARE_U_SURE: 'external_source_strings.are_you_sure',
  REMOVE_FIELDS: 'external_source_strings.remove_fields',
  SEARCH_FIELDS: 'external_source_strings.search_fields',
  FIELDS_TO_FETCH: 'external_source_strings.fields_to_fetch',
  LIMIT_FIELDS_LABEL: 'external_source_strings.limit_fields_label',
  BASIC_FILTER: 'external_source_strings.basic_filter',
  OPTIONAL_FILTER: 'external_source_strings.optional_filter',
  ADD_FILTER: 'external_source_strings.add_filter',
  REMOVE_FILTER: 'external_source_strings.remove_filter',
};

export const OUTPUT_FORMAT_STRINGS = {
  KEY: {
    ID: OUTPUT_FORMAT_CONSTANTS.KEY_ID,
    PLACEHOLDER: 'Select Key',
    SEARCH_PLACEHOLDER: 'Search Key',
  },
};

export const INTEGRATION_STRINGS = {
  CHOOSE_INTEGRATION: {
    ID: FIELD_IDS.CONNECTOR_UUID,
    LABEL: 'Choose Integration',
    PLACEHOLDER: 'Choose integration here...',
    SEARCH_PLACEHOLDER: 'Search Integration',
  },
  FIELD_PICKER_ID: 'nested_dropdown_container',
  CHOOSE_EVENT: {
    ID: FIELD_IDS.EVENT_UUID,
    LABEL: 'Choose Event',
    PLACEHOLDER: 'Choose event here...',
    SEARCH_PLACEHOLDER: 'Search Event',
  },
  RELATIVE_PATH: {
    ID: FIELD_IDS.RELATIVE_PATH,
    LABEL: 'Integration Relative Path',
    getHeaders: () => ['Pathname', 'Value'],
    PATHNAME: 'path_name',
    VALUE: 'value',
    TYPE: 'type',
  },
  QUERY_PARAMS: {
    ID: FIELD_IDS.QUERY_PARAMS,
    LABEL: 'Integration Query Parameters',
    getHeaders: () => ['Key', 'Value'],
    KEY: 'key',
    VALUE: 'value',
    TYPE: 'type',
  },
  DATA_NEEDED_LABELS: {
    DATA_NEEDED: 'Fields to Fetch',
  },
  LIMIT_FIELDS_LABEL: 'Limit fields to fetch',
};
export const PLACEHOLDERS = {
  DATA_SOURCE: 'Choose data source here...',
  VALUE: 'Choose Value here...',
  DATALIST: 'Choose Datalist here...',
  CHOOSE_FIELD_TYPE: 'Choose field type here...',
  ENTER_FIELD_NAME: 'Enter field name here...',
  ENTER_FIELD_VALUE: 'Enter field value here...',
};
export const BUTTON_LABELS = {
  ADD_MORE_VALUE: 'Add more value',
  ADD_MORE_ROW: 'Add more row',
};

export const getDataNotFound = () => [
  {
    label: 'No Fields Found',
    value: 'No Fields Found',
    optionType: SEND_DATALIST_DROPDOWN_TYPES.OPTION_LIST_TITLE,
    disabled: true,
  },
];

export const ERROR_MESSAGES = {
  ROW_REQUIRED: 'Atleast one child row is required',
  DUPLICATE_KEY_NAME: 'Duplicate Key/Name found in the same level',
  DATA_NEEDED_REQUIRED: 'Data Needed is required',
  FIELD_DELETED: 'Field is deleted',
  NAME_EXIST: 'Source Name already exist',
};
