import { set, cloneDeep, isEmpty } from 'utils/jsUtility';
import { INTEGRATION_ERROR_STRINGS, WORKHALL_API_STRINGS } from '../../Integration.strings';
import { EMPTY_STRING, FIELD_TYPE_TITLE_LABELS } from '../../../../utils/strings/CommonStrings';
import {
  ALLOWED_INTEGRATION_VALUES,
  BODY_ROW_ID,
  INTEGRATION_CONSTANTS,
  WH_API_METHODS,
  WH_API_TYPES,
  WORKHALL_AUTH_TYPE,
  SYSTEM_FIELDS_FOR_PUT,
  SYSTEM_FIELDS_FOR_RES_BODY,
} from '../../Integration.constants';
import { FIELD_TYPES } from '../../../../components/form_builder/FormBuilder.strings';
import { translateFunction } from '../../../../utils/jsUtility';
import { FIELD_PICKER_DROPDOWN_TYPES } from '../../../../components/field_picker/FieldPicker.utils';
import { getFullName } from '../../../../utils/UtilityFunctions';
import { SYSTEM_FIELDS_TITLE_KEYS, SYSTEM_FIELDS_TITLE_LIST } from '../../../../utils/SystemFieldsConstants';

const getColumnMapping = (columnMapping = []) => {
  const modifiedColumn = [];
  columnMapping?.forEach((eachColumn) => {
    if (eachColumn?.[BODY_ROW_ID.IS_DELETED]) return;
    const clonedColumn = cloneDeep(eachColumn);
    delete clonedColumn?.[BODY_ROW_ID.FIELD_DETAILS];
    delete clonedColumn?.[BODY_ROW_ID.FIELD_TYPE_KEY];
    delete clonedColumn?.[BODY_ROW_ID.IS_TABLE];
    delete clonedColumn?.[BODY_ROW_ID.PATH];
    delete clonedColumn?.[BODY_ROW_ID.IS_MULTIPLE];
    delete clonedColumn?.[BODY_ROW_ID.KEY_TYPE];
    if (clonedColumn?.[BODY_ROW_ID.COLUMN_MAPPING_SAMPLE]) delete clonedColumn?.[BODY_ROW_ID.COLUMN_MAPPING_SAMPLE];
    modifiedColumn.push(clonedColumn);
  });

  return modifiedColumn;
};

const getModifiedBodyData = (body = []) => {
  const modifiedBody = [];
  body?.forEach((eachRow) => {
    if (eachRow?.[BODY_ROW_ID.IS_DELETED]) return;
    const clonedRow = cloneDeep(eachRow);
    delete clonedRow?.[BODY_ROW_ID.FIELD_DETAILS];
    delete clonedRow?.[BODY_ROW_ID.FIELD_TYPE_KEY];
    delete clonedRow?.[BODY_ROW_ID.PATH];
    delete clonedRow?.[BODY_ROW_ID.IS_MULTIPLE];
    delete clonedRow?.[BODY_ROW_ID.KEY_TYPE];
    if (isEmpty(clonedRow?.[BODY_ROW_ID.COLUMN_MAPPING])) delete clonedRow?.[BODY_ROW_ID.COLUMN_MAPPING];
    if (clonedRow?.[BODY_ROW_ID.COLUMN_MAPPING_SAMPLE]) delete clonedRow?.[BODY_ROW_ID.COLUMN_MAPPING_SAMPLE];
    if (clonedRow?.[BODY_ROW_ID.IS_TABLE]) {
      modifiedBody.push({
        ...clonedRow,
        [BODY_ROW_ID.COLUMN_MAPPING]: getColumnMapping(clonedRow?.[BODY_ROW_ID.COLUMN_MAPPING]),
      });
    } else {
      modifiedBody.push(clonedRow);
    }
  });

  return modifiedBody;
};

export const getModifiedDefaultFilter = (
  default_filter = [],
  allFields = [],
) => {
  const modifiedFilter = [];

  default_filter?.forEach((eachRow = {}) => {
    if (eachRow?.[BODY_ROW_ID.IS_DELETED]) return;

    const clonedRow = cloneDeep(eachRow);

    if (isEmpty(allFields)) {
      delete clonedRow?.[BODY_ROW_ID.FIELD_DETAILS];
    } else {
      clonedRow[BODY_ROW_ID.FIELD_DETAILS] = allFields.find(
        (field) => eachRow?.value === field.value,
      );
    }

    modifiedFilter.push(clonedRow);
  });

  return modifiedFilter;
};

export const getSubmissionDataForWorkhallApi = (stateData, isValidate) => {
  const postData = {};
  const admins = stateData?.admins || {};
  const appAdmins = {};
  if ((admins?.teams || [])?.length > 0) {
    appAdmins.teams = admins?.teams?.map((team) => team._id);
  }
  if ((admins?.users || [])?.length > 0) {
    appAdmins.users = admins?.users?.map((user) => user._id);
  }
  set(postData, 'name', stateData?.name);
  set(postData, 'admins', appAdmins);

  if (isValidate || !isEmpty(stateData?.url_path)) {
    set(postData, 'url_path', stateData?.url_path);
  }
  if (stateData?.authentication_type) {
    set(postData, 'authentication_type', stateData?.authentication_type);
  }
  if (stateData?.authentication_id) {
    set(postData, 'authentication_id', stateData?.authentication_id);
  }

  set(postData, 'type', stateData?.workhall_api_type);
  if (stateData?.workhall_api_type === WH_API_TYPES.START_FLOW) {
    if (!isEmpty(stateData?.flow_uuid)) {
      set(postData, 'flow_uuid', stateData?.flow_uuid);
    }
  } else {
    if (!isEmpty(stateData?.data_list_uuid)) {
      set(postData, 'data_list_uuid', stateData?.data_list_uuid);
    }
    if (
      stateData?.workhall_api_method !== WH_API_METHODS.POST
    ) {
      if (!isEmpty(stateData?.default_filter)) {
        const defaultFilter = getModifiedDefaultFilter(stateData?.default_filter);
        set(postData, 'default_filter', defaultFilter);
      } else {
      set(postData, 'default_filter', []);
      }
    }
    if (
      stateData?.workhall_api_method === WH_API_METHODS.GET
    ) {
      if (!isEmpty(stateData?.query_params)) {
        const queryParams = getModifiedDefaultFilter(stateData?.query_params);
        set(postData, 'query_params', queryParams);
      } else {
        set(postData, 'query_params', []);
      }
    }
  }

  if (!isEmpty(stateData?.body)) {
    const postBodyData = getModifiedBodyData(stateData?.body);
    set(postData, 'body', postBodyData);
  } else {
    set(postData, 'body', []);
  }

  set(postData, '_id', stateData?._id);
  set(postData, 'api_configuration_uuid', stateData?.api_configuration_uuid);

  return postData;
};

export const getTypeKeysForFields = (fieldData = {}) => {
  if (isEmpty(fieldData)) return EMPTY_STRING;

  switch (fieldData?.field_type) {
    case FIELD_TYPES.NUMBER:
      return {
        [BODY_ROW_ID.KEY_TYPE]: ALLOWED_INTEGRATION_VALUES.NUMBER,
      };
    case FIELD_TYPES.DATE:
      return {
        [BODY_ROW_ID.KEY_TYPE]: ALLOWED_INTEGRATION_VALUES.DATE,
      };
    case FIELD_TYPES.DATETIME:
      return {
        [BODY_ROW_ID.KEY_TYPE]: ALLOWED_INTEGRATION_VALUES.DATE_TIME,
      };
    case FIELD_TYPES.CHECKBOX:
      return {
        [BODY_ROW_ID.KEY_TYPE]: ALLOWED_INTEGRATION_VALUES.STRING,
        [BODY_ROW_ID.IS_MULTIPLE]: true,
      };
    case FIELD_TYPES.YES_NO:
      return {
        [BODY_ROW_ID.KEY_TYPE]: ALLOWED_INTEGRATION_VALUES.BOOLEAN,
      };
    case FIELD_TYPES.PHONE_NUMBER:
      return {
        [BODY_ROW_ID.KEY_TYPE]: ALLOWED_INTEGRATION_VALUES.OBJECT,
        [BODY_ROW_ID.COLUMN_MAPPING_SAMPLE]: [
          {
            key: 'country_code',
            keyType: ALLOWED_INTEGRATION_VALUES.STRING,
          },
          {
            key: 'phone_number',
            keyType: ALLOWED_INTEGRATION_VALUES.STRING,
          },
        ],
      };
    case FIELD_TYPES.USER_TEAM_PICKER:
      return {
        [BODY_ROW_ID.KEY_TYPE]: ALLOWED_INTEGRATION_VALUES.OBJECT,
        [BODY_ROW_ID.COLUMN_MAPPING_SAMPLE]: [
          {
            key: 'users',
            keyType: ALLOWED_INTEGRATION_VALUES.STRING,
            is_multiple: true,
          },
        ],
      };
    case FIELD_TYPES.LINK:
      return {
        [BODY_ROW_ID.KEY_TYPE]: ALLOWED_INTEGRATION_VALUES.OBJECT,
        [BODY_ROW_ID.IS_MULTIPLE]: true,
        [BODY_ROW_ID.COLUMN_MAPPING_SAMPLE]: [
          {
            key: 'link_text',
            keyType: ALLOWED_INTEGRATION_VALUES.STRING,
          },
          {
            key: 'link_url',
            keyType: ALLOWED_INTEGRATION_VALUES.STRING,
          },
        ],
      };
    case FIELD_TYPES.CURRENCY:
      return {
        [BODY_ROW_ID.KEY_TYPE]: ALLOWED_INTEGRATION_VALUES.OBJECT,
        [BODY_ROW_ID.COLUMN_MAPPING_SAMPLE]: [
          {
            key: 'currency_type',
            keyType: ALLOWED_INTEGRATION_VALUES.STRING,
          },
          {
            key: 'value',
            keyType: ALLOWED_INTEGRATION_VALUES.NUMBER,
          },
        ],
      };
    case FIELD_TYPES.SINGLE_LINE:
    case FIELD_TYPES.PARAGRAPH:
    case FIELD_TYPES.DROPDOWN:
    case FIELD_TYPES.RADIO_GROUP:
    case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
    case FIELD_TYPES.EMAIL:
    case FIELD_TYPES.SCANNER:
    default:
      return {
        [BODY_ROW_ID.KEY_TYPE]: ALLOWED_INTEGRATION_VALUES.STRING,
      };
  }
};

const getRowData = (data, path, all_field_details, t = translateFunction) => {
  let errors = {};
  data.path = path;
  const fieldDetailWithPath = {
    path,
    field_uuid: data.field || data.system_field,
  };
  if (data?.value_type === 'dynamic') {
    const field_details = all_field_details?.find((field) => (
      (field.field_uuid === data.field) || (field.table_uuid === data.field)
    )) || {};
    if (!isEmpty(field_details)) {
      data.field_details = {
        ...field_details,
        label: field_details.field_name,
      };
    } else {
      errors = { [`${data.path},field`]: t(INTEGRATION_ERROR_STRINGS.DELETED_FIELDS) };
    }
    data[BODY_ROW_ID.FIELD_TYPE_KEY] = data?.[BODY_ROW_ID.IS_TABLE] ? 'table' : field_details?.[BODY_ROW_ID.FIELD_TYPE_KEY];
    if (data?.is_table) {
      data[BODY_ROW_ID.KEY_TYPE] = 'object';
      data[BODY_ROW_ID.IS_MULTIPLE] = true;
    } else {
      const additionalInfo = getTypeKeysForFields(field_details);
      set(data, [BODY_ROW_ID.KEY_TYPE], additionalInfo.keyType);
      set(data, [BODY_ROW_ID.IS_MULTIPLE], additionalInfo.is_multiple);
      if (additionalInfo.keyType === ALLOWED_INTEGRATION_VALUES.OBJECT) {
        set(data, [BODY_ROW_ID.COLUMN_MAPPING_SAMPLE], additionalInfo?.[BODY_ROW_ID.COLUMN_MAPPING_SAMPLE]);
      }
    }
  } else {
    set(data, [BODY_ROW_ID.KEY_TYPE], ALLOWED_INTEGRATION_VALUES.STRING);
    set(data, [BODY_ROW_ID.IS_MULTIPLE], false);
  }
  return {
    formattedData: data,
    errors,
    fieldDetailWithPath,
  };
};

const getModifiedRequestBody = (reqBody = [], field_details = [], error_list = {}, t = translateFunction) => {
  const reqBodyFieldDetails = [];
  const normalizedData = reqBody.map((data, index) => {
  (data?.[BODY_ROW_ID.COLUMN_MAPPING] || []).map((child, childIndex) => {
    const childPath = `${index},${BODY_ROW_ID.COLUMN_MAPPING},${childIndex}`;
    const { formattedData, errors, fieldDetailWithPath } = getRowData(child, childPath, field_details, t);
    reqBodyFieldDetails.push(fieldDetailWithPath);
    error_list = {
      ...error_list,
      ...errors,
    };
    return formattedData;
  });
  const { formattedData, errors, fieldDetailWithPath } = getRowData(data, index.toString(), field_details, t);
  reqBodyFieldDetails.push(fieldDetailWithPath);
  error_list = {
    ...error_list,
    ...errors,
  };
  return formattedData;
});
  return {
    data: normalizedData,
    error_list,
    reqBodyFieldDetails,
  };
};

export const SYSTEM_FIELDS = {
  ID: '_id',
};

export const getPutRequestData = () => [
  {
    key: SYSTEM_FIELDS.ID,
    system_field: SYSTEM_FIELDS.ID,
    value_type: 'default',
    is_table: false,
    keyType: ALLOWED_INTEGRATION_VALUES.STRING,
  },
];

export const getSingleWorkhallAPIReducerData = (apiDataParam, t) => {
  const apiData = cloneDeep(apiDataParam);
  let stateData = {};

  set(stateData, 'name', apiData?.name);
  set(stateData, 'description', apiData?.description);

  const admins = apiData?.admins;
  const teams = [];
  const users = [];
  if (admins?.teams) {
    (admins?.teams || []).forEach((team) => (teams.push({ ...team, id: team._id, label: team.team_name, name: team.team_name })));
  }
  if (admins?.users) {
    (admins?.users || []).forEach((user) => {
      const label = getFullName(user.first_name, user.last_name);
      users.push({
        ...user,
        id: user._id,
        label,
        name: label,
        is_user: true,
      });
    });
  }
  set(stateData, 'admins', { teams, users });
  set(stateData, 'url_path', apiData?.url_path);
  set(stateData, 'authentication_type', apiData?.authentication_type);
  set(stateData, 'workhall_api_type', apiData?.type);
  set(stateData, 'api_type', INTEGRATION_CONSTANTS.API_TYPE.WORKHALL);
  if (apiData?.authentication_id) {
    const idList = [];
    const selected_authentication_list = [];
    const authentication_name = [];
    if (apiData?.authentication_type === WORKHALL_AUTH_TYPE.OAUTH) {
      apiData?.authentication_id?.forEach((credential) => {
        idList.push(credential?._id);
        authentication_name.push(credential?.name);
        selected_authentication_list.push({
          ...credential,
          label: credential?.name,
          value: credential?._id,
        });
      });
    } else {
      apiData?.authentication_id?.forEach((credential) => {
        idList.push(credential?._id);
        const name = credential?.username ? getFullName(
          credential.first_name,
          credential.last_name,
          ) : credential?.team_name;
        selected_authentication_list.push({
          ...credential,
          id: credential?._id,
          label: name,
          name,
          is_user: !isEmpty(credential?.username),
        });
        authentication_name.push(credential?.name || `${credential?.first_name} ${credential?.last_name}` || credential?.emails);
      });
    }
    set(stateData, 'selected_authentication_list', selected_authentication_list);
    set(stateData, 'authentication_id', idList);
    set(stateData, 'authentication_name', authentication_name);
  }

  set(stateData, 'workhall_api_type', apiData?.type);

  let apiMethod = null;

  if (apiData?.type === WH_API_TYPES.GET_OR_VIEW_DL) {
    apiMethod = WH_API_METHODS.GET;
  } else if (apiData?.type === WH_API_TYPES.EDIT_OR_UPDATE_DL) {
    apiMethod = WH_API_METHODS.PUT;
  } else {
    apiMethod = WH_API_METHODS.POST;
  }

  set(stateData, 'workhall_api_method', apiMethod);

  if (apiData?.type === WH_API_TYPES.START_FLOW) {
    const flowValues = {
      flow_uuid: apiData?.flow_uuid,
      flow_id: apiData?.flow_id,
      flow_name: apiData?.flow_name,
    };
    stateData = {
      ...stateData,
      ...flowValues,
    };
  } else {
    const datalistValues = {
      data_list_uuid: apiData?.data_list_uuid,
      data_list_id: apiData?.data_list_id,
      data_list_name: apiData?.data_list_name,
    };
    stateData = {
      ...stateData,
      ...datalistValues,
    };
    if (stateData?.workhall_api_method !== WH_API_METHODS.POST) {
      set(stateData, 'default_filter', apiData?.default_filter);
    }

    if (stateData?.workhall_api_method === WH_API_METHODS.GET) {
      set(stateData, 'query_params', apiData?.query_params);
    }
  }

  const { data = [], error_list = {}, reqBodyFieldDetails = [] } = getModifiedRequestBody(apiData?.body, apiData?.field_details, {}, t);
  set(stateData, 'body', data);
  set(stateData, 'reqBodyFieldDetails', reqBodyFieldDetails);
  set(stateData, 'bodyError', error_list);
  set(stateData, 'version', apiData?.version);
  set(stateData, 'status', apiData?.status);
  set(stateData, 'is_active', apiData?.is_active);

  set(stateData, '_id', apiData?._id);
  set(stateData, 'api_configuration_uuid', apiData?.api_configuration_uuid);

  return stateData;
};

export const filterInitialRowData = {
  field: EMPTY_STRING,
  value: EMPTY_STRING,
  value_type: WORKHALL_API_STRINGS.REQUEST_RESPONSE.VALUE_TYPES.DYNAMIC,
  field_details: {},
};

export const paramsInitialRowData = {
  field: EMPTY_STRING,
  key: EMPTY_STRING,
  value_type: WORKHALL_API_STRINGS.REQUEST_RESPONSE.VALUE_TYPES.DYNAMIC,
  field_details: {},
};

export const getSelectedOption = (value, _list, key = 'value') => {
  const selectedData = _list?.find(
    (data) => data?.[key] === value,
  );
  return selectedData;
};

export const getMultiDropdownValue = (list = []) => {
  const strArray = [];
  list.forEach((data) => {
    strArray.push(data?.name);
  });
  return strArray.join(', ');
};

export const SELECT_COLUMN = {
  label: 'Select Column',
  value: 'Select Column',
  optionType: FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE,
  disabled: true,
};

export const getNoDataFoundList = (t) => [
  {
    label: t('common_strings.no_fields_found'),
    value: t('common_strings.no_fields_found'),
    optionType: FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE,
    disabled: true,
  },
];

export const getFieldTypeOptions = ({ fieldsCount, systemFieldsCount }) => [
  {
    label: FIELD_TYPE_TITLE_LABELS.DATA,
    value: FIELD_PICKER_DROPDOWN_TYPES.DATA_FIELDS,
    is_expand: true,
    expand_count: fieldsCount,
    current_level: FIELD_PICKER_DROPDOWN_TYPES.DATA_FIELDS,
  },
  {
    label: FIELD_TYPE_TITLE_LABELS.SYSTEM,
    value: FIELD_PICKER_DROPDOWN_TYPES.SYSTEM_FIELDS,
    is_expand: true,
    expand_count: systemFieldsCount,
    current_level: FIELD_PICKER_DROPDOWN_TYPES.SYSTEM_FIELDS,
  },
];

export const getCurrentSystemFields = (workhall_api_method, isChild, fromListing = false) => {
  if (workhall_api_method === WH_API_METHODS.POST) return [];

  if (workhall_api_method === WH_API_METHODS.GET) {
    if (fromListing && isChild) {
      return SYSTEM_FIELDS_FOR_PUT;
    }
    return SYSTEM_FIELDS_FOR_RES_BODY;
  } else if (workhall_api_method === WH_API_METHODS.PUT) {
    if (isChild) {
      return SYSTEM_FIELDS_FOR_PUT;
    }
    return [];
  } else {
    return [];
  }
};

export const getGroupedSystemFieldListForMapping = (fieldList, selectedFieldsUuid = []) => {
  const groupedFieldList = {
    [SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS]: [],
    [SYSTEM_FIELDS_TITLE_KEYS.REFERENCE_FIELDS]: [],
    [SYSTEM_FIELDS_TITLE_KEYS.DATE_TIME_FIELDS]: [],
  };
  const optionList = [];
  (fieldList || []).forEach((field) => {
    if (!selectedFieldsUuid.includes(field.value)) {
      switch (field.title_key) {
        case SYSTEM_FIELDS_TITLE_KEYS.REFERENCE_FIELDS:
          groupedFieldList[SYSTEM_FIELDS_TITLE_KEYS.REFERENCE_FIELDS].push({ ...field });
          break;
        case SYSTEM_FIELDS_TITLE_KEYS.DATE_TIME_FIELDS:
          groupedFieldList[SYSTEM_FIELDS_TITLE_KEYS.DATE_TIME_FIELDS].push({ ...field });
          break;
        default:
          groupedFieldList[SYSTEM_FIELDS_TITLE_KEYS.TEXT_FIELDS].push({ ...field });
          break;
      }
    }
  });
  Object.keys(groupedFieldList).forEach((key) => {
    if (groupedFieldList[key].length > 0) {
      optionList.push(SYSTEM_FIELDS_TITLE_LIST[key]);
      optionList.push(...groupedFieldList[key]);
    }
  });
  return optionList;
};

export const getDisabledCredError = (disabledCredList, selectedCredList) => {
  const disabledCredNameArr = [];
  (disabledCredList || []).forEach((disabledCred) => {
    const index = (selectedCredList || []).findIndex((selectedCred) => (selectedCred._id === disabledCred));
    if (index > -1) {
      disabledCredNameArr.push(selectedCredList[index].name);
    }
  });
  if (!isEmpty(disabledCredNameArr)) {
    return `${WORKHALL_API_STRINGS.CHOOSE_CREDENTIAL.INVALID_CREDENTIALS} ${disabledCredNameArr.join(', ')}`;
  }
  return null;
};
