import {
  set,
  cloneDeep,
  translateFunction,
  isEmpty,
  isArray,
  find,
} from 'utils/jsUtility';
import { v4 as uuidv4 } from 'uuid';
import { INTEGRATION_CONSTANTS } from '../../Integration.constants';
import {
  DB_CONNECTION_QUERIES_STRINGS,
  QUERY_LIST_HEADER_SETINGS,
} from './DBConnector.strings';
import { INTEGRATION_ERROR_STRINGS } from '../../Integration.strings';
import {
  EMPTY_STRING,
  VALIDATION_ERROR_TYPES,
} from '../../../../utils/strings/CommonStrings';
import { DB_TYPE, NUMERIC_TYPES } from './DBConnector.constant';

export const DB_CONNECTOR_HEADER = (
  t = translateFunction,
  isEditView = false,
) => {
  const headerList = [
    {
      label: QUERY_LIST_HEADER_SETINGS(t).NAME,
      id: 'query_name',
      widthWeight: 25,
    },
    {
      label: QUERY_LIST_HEADER_SETINGS(t).QUERY_ACTION,
      id: 'query_action',
      widthWeight: 20,
    },
    {
      label: QUERY_LIST_HEADER_SETINGS(t).LAST_UPDATED_BY,
      id: 'last_updated_by',
      widthWeight: 25,
    },
    {
      label: QUERY_LIST_HEADER_SETINGS(t).LAST_UPDATED_ON,
      id: 'last_updated_on',
      widthWeight: 20,
    },
  ];
  if (isEditView) {
    headerList.push(
      {
        label: '',
        id: 'edit_query',
        widthWeight: 5,
      },
      {
        label: '',
        id: 'delete_query',
        widthWeight: 5,
      },
    );
  }

  return headerList;
};

export const getSingleDBConnectorAuthReducerData = (
  apiDataResponse,
  prevAuthentication = {},
) => {
  const apiData = cloneDeep(apiDataResponse);
  const stateData = {};
  const authenticationData = {
    ...apiData?.connection_details,
    ...prevAuthentication,
  };

  set(stateData, '_id', apiData?._id);
  set(stateData, 'db_connector_uuid', apiData?.db_connector_uuid);
  set(stateData, 'api_type', INTEGRATION_CONSTANTS.API_TYPE.DB_CONNECTION);
  set(authenticationData, 'db_connector_name', apiData?.db_connector_name);
  if (apiData?.db_type) set(authenticationData, 'db_type', apiData?.db_type);
  set(authenticationData, 'description', apiData?.description);
  if (
    authenticationData?.is_credentials_saved &&
    !authenticationData?.password_toggle
  ) {
    delete authenticationData.password;
  }
  if (!isEmpty(apiData?.connection_response)) {
    set(
      authenticationData,
      'is_connection_established',
      apiData?.connection_response.is_connection_established,
    );
  }
  set(stateData, 'authentication', authenticationData);
  if (apiData?.no_of_db_queries) {
    set(stateData, 'totalQueryCount', apiData?.no_of_db_queries);
  }

  return stateData;
};

export const getSingleDBConnectorQueryReducerData = (
  apiDataResponse,
  isFromEdit = false,
) => {
  const apiQueryData = cloneDeep(apiDataResponse);
  const queryStateData = apiQueryData?.query_config;

  set(queryStateData, '_id', apiQueryData?._id);
  set(queryStateData, 'db_query_uuid', apiQueryData?.db_query_uuid);
  set(queryStateData, 'db_query_name', apiQueryData?.db_query_name);

  const selectedFields = queryStateData.selected_fields?.map((field, index) => {
    const fieldData = {
      ...field,
      path: String(index),
      key_uuid: uuidv4(),
    };
    fieldData.key = fieldData.key_uuid;
    return fieldData;
  });

  set(queryStateData, 'selected_fields', selectedFields);

  if (queryStateData.selected_filters?.length > 0) {
    const selectedFilters =
      queryStateData.selected_filters[0].filter_config.filter_data?.map(
        (filter, index) => {
          const filterData = {
            ...filter.filter_config,
            path: String(index),
            key_uuid: uuidv4(),
          };
          filterData.key = filterData.key_uuid;
          return filterData;
        },
      );
    set(queryStateData, 'selected_filters', selectedFilters);
  }
  set(queryStateData, 'sort_fields', queryStateData.sort_fields[0]);

  if (isFromEdit) {
    set(queryStateData, 'isColumnFetched', true);
  }

  set(queryStateData, 'version_number', apiQueryData?.version_number);
  set(queryStateData, 'status', apiQueryData?.status);
  set(queryStateData, 'is_active', apiQueryData?.is_active);

  return queryStateData;
};

export const getFieldToFetchHeader = (t) => {
  const { QUERY_CONFIG } = DB_CONNECTION_QUERIES_STRINGS(t);
  return [
    QUERY_CONFIG.FIELD_NAME.LABEL,
    QUERY_CONFIG.FIELD_TYPE.LABEL,
    QUERY_CONFIG.TYPE_CAST.LABEL,
    QUERY_CONFIG.DISPLAY_NAME.LABEL,
  ];
};

export const getFilterDateByHeader = (t) => {
  const { QUERY_CONFIG } = DB_CONNECTION_QUERIES_STRINGS(t);
  return [
    QUERY_CONFIG.FIELD_NAME.LABEL,
    QUERY_CONFIG.FIELD_TYPE.LABEL,
    QUERY_CONFIG.OPERATOR.LABEL,
    QUERY_CONFIG.VALUES.LABEL,
  ];
};

export const getDefaultKeyLabelsForFieldToFetch = (
  t,
  childKey,
  typeKey,
  addKeyText,
) => {
  return {
    childKey: childKey || 'child_rows',
    typeKey: typeKey || 'type',
    addKey: DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.ADD_MORE_FIELD.ID,
    requiredKey: 'isRequired',
    addRowText:
      addKeyText ||
      DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.ADD_MORE_FIELD.LABEL,
  };
};

export const getDefaultKeyLabelsForFilterDateBy = (t) => {
  return {
    childKey: 'filter_data',
    typeKey: 'type',
    addKey: DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.ADD_MORE_FILTER.ID,
    addRowText:
      DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.ADD_MORE_FILTER.LABEL,
    addChildRowText:
      DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.ADD_MORE_FILTER
        .OBJECT_LABEL,
  };
};

export const genreateSaveDBConnectorData = (
  authentication,
  _id,
  uuid,
  isSaveClose = false,
) => {
  const data = {};
  const connectionDetails = {};

  set(data, '_id', _id);
  set(data, 'db_connector_uuid', uuid);
  set(data, 'db_connector_name', authentication?.db_connector_name);
  set(data, 'description', authentication?.description);
  set(data, 'db_type', authentication?.db_type);

  switch (authentication?.db_type) {
    case DB_TYPE.MYSQL:
    case DB_TYPE.MSSQL:
      set(connectionDetails, 'db_name', authentication?.db_name);
      break;
    case DB_TYPE.ORACLE:
      set(connectionDetails, 'service_name', authentication?.service_name);
      break;
    default:
      break;
  }
  set(connectionDetails, 'host', authentication?.host);
  set(connectionDetails, 'port', authentication?.port);
  set(connectionDetails, 'username', authentication?.username);
  set(connectionDetails, 'password', authentication?.password);
  set(data, 'connection_details', connectionDetails);

  set(data, 'is_save_close', isSaveClose);
  return data;
};

export const generateSaveQueryData = (
  query,
  _id,
  uuid,
  isFromEdit = false,
  isTestQuery = false,
) => {
  const data = {};
  const queryConfigData = {};

  const selectedFields = [];
  query?.selected_fields.forEach((field) => {
    if (!field?.is_deleted) {
      const currentField = {
        field_name: field.field_name,
        field_type: field.field_type,
        type_cast: field.type_cast,
        display_name: field.display_name,
      };
      selectedFields.push(currentField);
    }
  });

  let selectedFilters = [];
  if (query?.selected_filters?.length > 0) {
    const filterDataList = [];
    query?.selected_filters.forEach((filter) => {
      if (!filter?.is_deleted) {
        const isNumericType = NUMERIC_TYPES.includes(filter.field_type);
        const values = filter.values?.map((val) =>
          isNumericType ? Number(val) : val,
        );
        const currentFilter = {
          nested_filter: false,
          filter_config: {
            field_name: filter.field_name,
            field_type: filter.field_type,
            operator: filter.operator,
            values: values,
          },
        };
        filterDataList.push(currentFilter);
      }
    });

    if (filterDataList.length > 0) {
      selectedFilters = [
        {
          nested_filter: true,
          filter_config: {
            filter_type: 'AND',
            filter_data: filterDataList,
          },
        },
      ];
    }
  }

  const sortFields = [query?.sort_fields];

  set(data, 'connector_id', _id);
  if (isFromEdit) {
    set(data, 'db_query_uuid', query?.db_query_uuid);
  }
  if (!isTestQuery) {
    set(data, 'db_query_name', query?.db_query_name);
    set(data, 'connector_uuid', uuid);
  }
  set(data, 'db_type', query?.db_type);
  set(queryConfigData, 'data_source_type', query?.data_source_type);
  set(queryConfigData, 'query_action', query?.query_action);
  set(queryConfigData, 'table_name', query?.table_name);
  set(queryConfigData, 'selected_fields', selectedFields);
  set(queryConfigData, 'selected_filters', selectedFilters);
  set(queryConfigData, 'sort_fields', sortFields);
  set(queryConfigData, 'skip_data', query?.skip_data);
  set(queryConfigData, 'limit_data', query?.limit_data);
  set(data, 'query_config', queryConfigData);

  return data;
};

export const generateDropDownOptions = (options = []) => {
  const optionList = [];
  if (isArray(options)) {
    options.forEach((option) => {
      const data = {
        label: option,
        value: option,
      };
      optionList.push(data);
    });
  }
  return optionList;
};

export const generateTableFieldListDetails = (
  tableInfo = [],
  allowedDataType = [],
  currentFieldName = EMPTY_STRING,
  selectedFields = [],
) => {
  const fieldNameList = [];

  if (isArray(tableInfo)) {
    tableInfo.forEach((field) => {
      if (allowedDataType.includes(field.DATA_TYPE)) {
        const isFieldSelected = find(selectedFields || [], {
          field_name: field.COLUMN_NAME,
        });
        if (
          currentFieldName === field.COLUMN_NAME ||
          isEmpty(isFieldSelected) ||
          isFieldSelected?.is_deleted
        ) {
          const name = {
            label: field.COLUMN_NAME,
            value: field.COLUMN_NAME,
          };
          fieldNameList.push(name);
        }
      }
    });
  }

  return fieldNameList;
};

export const generateSortDataByList = (selectedFields = []) => {
  const sortDataByList = [];

  if (isArray(selectedFields)) {
    selectedFields.forEach((field) => {
      if (!field?.is_deleted && field?.field_name) {
        const sortField = {
          label: field.field_name,
          value: field.field_name,
        };
        sortDataByList.push(sortField);
      }
    });
  }

  return sortDataByList;
};

export const generateQueryDataJsonContainer = (queryData = []) => {
  const responseData = [];

  if (isArray(queryData)) {
    queryData.forEach((data, index) => {
      const keys = Object.keys(data);
      const jsonData = {
        column_mapping: [],
        key: index,
        keyType: 'object',
      };
      keys.forEach((key) => {
        const keyType = String(data[key]);
        const oneJsonData = { key, keyType };
        jsonData.column_mapping.push(oneJsonData);
      });
      responseData.push(jsonData);
    });
  }

  return responseData;
};

export const getQueryServerErrors = (err, t = translateFunction) => {
  const errList = err?.response?.data?.errors || [];
  const error_list = {};
  let serverErrorText = t(INTEGRATION_ERROR_STRINGS.CONFIG);
  if (isArray(errList)) {
    errList.forEach((errorData) => {
      const { field, type } = errorData;
      switch (type) {
        case VALIDATION_ERROR_TYPES.EXIST:
          if (field.includes('db_query_name')) {
            error_list[
              DB_CONNECTION_QUERIES_STRINGS(t).QUERY_CONFIG.QUERY_NAME.ID
            ] = t(INTEGRATION_ERROR_STRINGS.QUERY_NAME);
          }
          break;
        case VALIDATION_ERROR_TYPES.LIMIT:
          serverErrorText = t(INTEGRATION_ERROR_STRINGS.LIMIT);
          break;
        default:
          break;
      }
    });
  }

  return {
    error_list,
    serverErrorText,
  };
};
