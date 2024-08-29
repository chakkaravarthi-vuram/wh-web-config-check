import {
  cloneDeep,
  pick,
  unset,
  set,
  isEmpty,
  get,
  find,
  uniqBy,
} from 'utils/jsUtility';
import { FIELD_PICKER_DROPDOWN_TYPES } from '../../../components/field_picker/FieldPicker.utils';
import {
  EMPTY_STRING,
  FIELD_TYPE_TITLE_LABELS,
} from '../../../utils/strings/CommonStrings';
import {
  API_CONSTANTS,
  DATA_LIST_CONSTANTS,
  // DATA_LIST_CONSTANTS,
  FIELD_IDS,
  MULTIPLE_ENTRY_TYPES,
  OUTPUT_FORMAT_CONSTANTS,
  POST_DATA_KEYS,
  RULE_TYPES,
} from './ExternalSource.constants';
import { DATA_SOURCE_TYPES, ERROR_MESSAGES } from './ExternalSource.strings';
import { getSingleIntegrationConnector } from './useExternalSource.action';
import { externalSourceDataChange } from './useExternalSource';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../../utils/constants/form.constant';
import { SYSTEM_FIELDS } from '../../../utils/SystemFieldsConstants';
import { CHOICE_VALUE_FIELD_TYPES_CHECKBOX } from '../../edit_flow/step_configuration/node_configurations/data_manipulator/DataManipulator.utils';
import { constructCBWithFieldMappingPostData, constructCBWithFieldMappingResponse, getFilterFields, getSystemFieldsForExternalSource } from '../../../components/condition_builder_with_field_mapping/ConditionBuilderWithFieldMapping.utils';
import { MODULE_TYPES } from '../../../utils/Constants';

const systemFields = [SYSTEM_FIELDS.FLOW_ID, SYSTEM_FIELDS.DATA_LIST_ID, SYSTEM_FIELDS.ENTRY_ID];

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

export const getDLOutputFormatCurrentRow = (currentRow) => {
  const modifiedCurrentRow = {
    // [POST_DATA_KEYS.DATA_LIST_FIELD_UUID]: currentRow?.key,
    [POST_DATA_KEYS.TYPE]: currentRow?.type,
    [POST_DATA_KEYS.NAME]: currentRow?.name,
    [POST_DATA_KEYS.UUID]: currentRow?.key_uuid,
    [POST_DATA_KEYS.VALUE]: currentRow?.key,
    is_deleted: currentRow?.is_deleted,
  };

  // if (!isTableColumn) {
    modifiedCurrentRow[POST_DATA_KEYS.VALUE_TYPE] = currentRow?.value_type;
  // }

  if (CHOICE_VALUE_FIELD_TYPES_CHECKBOX.includes(currentRow?.type)) {
    modifiedCurrentRow[POST_DATA_KEYS.CHOICE_VALUE_TYPE] = currentRow?.field_details?.choice_value_type;
  }

  return modifiedCurrentRow;
};

export const getOutputFormatCurrentRow = (currentRow) => {
  const modifiedCurrentRow = {
    [POST_DATA_KEYS.MAPPING_INFO]: currentRow?.key,
    [POST_DATA_KEYS.TYPE]: currentRow?.type,
    [POST_DATA_KEYS.NAME]: currentRow?.name,
    [POST_DATA_KEYS.UUID]: currentRow?.key_uuid,
    is_deleted: currentRow?.is_deleted,
  };

  return modifiedCurrentRow;
};

export const getOutputFormatCurrentRowForDataList = (currentRow) => {
  const modifiedCurrentRow = {
    [POST_DATA_KEYS.MAPPING_INFO]: currentRow?.key,
    [POST_DATA_KEYS.TYPE]: currentRow?.type,
    [POST_DATA_KEYS.NAME]: currentRow?.name,
    [POST_DATA_KEYS.UUID]: currentRow?.key_uuid,
    is_deleted: currentRow?.is_deleted,
  };

  return modifiedCurrentRow;
};

const constructOutputFormatPostData = (
  outputFormat,
  getCurrentRow,
  updatedList = [],
) => {
  outputFormat?.forEach((currentRow) => {
    if (currentRow?.is_deleted) return;

    const modifiedCurrentRow = getCurrentRow && getCurrentRow(currentRow);

    if (currentRow && currentRow?.column && currentRow?.column?.length > 0) {
      const columnMapping = [];

      currentRow.column?.forEach((currentChildRow) => {
        if (currentChildRow?.is_deleted) return;

        const modifiedChildRow =
          getCurrentRow && getCurrentRow(currentChildRow, true);

        if (!modifiedChildRow?.is_deleted) {
          delete modifiedChildRow.is_deleted;
          columnMapping.push(modifiedChildRow);
        }
      });

      modifiedCurrentRow[POST_DATA_KEYS.COLUMN_MAPPING] = columnMapping;
    }

    if (!modifiedCurrentRow?.is_deleted) {
      delete modifiedCurrentRow.is_deleted;
      updatedList.push(modifiedCurrentRow);
    }
  });

  return updatedList;
};

export const constructDataListPostData = (state = {}) => {
  const clonedState = cloneDeep(state);

  const postData = {};

  //  Meta data
  if (clonedState?.pageId) {
    set(postData, POST_DATA_KEYS.PAGE_ID, clonedState?.pageId);
  } else if (clonedState?.taskMetaDataId) {
    set(postData, POST_DATA_KEYS.TASK, clonedState?.taskMetaDataId);
  } else if (clonedState?.flowId) {
    set(postData, POST_DATA_KEYS.FLOW, clonedState?.flowId);
  } else if (clonedState?.dataListId) {
    set(postData, POST_DATA_KEYS.DATA_LIST, clonedState?.dataListId);
  }

  // Source Name
  set(postData, POST_DATA_KEYS.SOURCE_NAME, clonedState?.ruleName);

  // Rule Details
  if (clonedState?.ruleId) {
    set(postData, POST_DATA_KEYS.RULE_ID, clonedState?.ruleId);
  }

  if (clonedState?.ruleUuid) {
    set(postData, POST_DATA_KEYS.RULE_UUID, clonedState?.ruleUuid);
  }

  // Data list UUID
  set(
    postData,
    [POST_DATA_KEYS.RULE, POST_DATA_KEYS.DATA_LIST_UUID],
    clonedState?.dataListUuid,
  );

  // Filter
  // (soon to be removed) filter not applicable when query type distinct is chosen
  if (clonedState?.type !== DATA_LIST_CONSTANTS.QUERY_TYPE.DISTINCT) {
    if (!isEmpty(clonedState?.filter?.rule)) {
      const expression = constructCBWithFieldMappingPostData(clonedState?.filter?.rule);
      set(postData,
        [POST_DATA_KEYS.RULE, POST_DATA_KEYS.FILTER],
        [expression],
      );
    }
    if (clonedState?.type === DATA_LIST_CONSTANTS.QUERY_TYPE.SUB_TABLE_QUERY && !isEmpty(clonedState?.filter?.postRule)) {
      const expression = constructCBWithFieldMappingPostData(clonedState?.filter?.postRule);
      set(postData,
        [POST_DATA_KEYS.RULE, POST_DATA_KEYS.POST_FILTER],
        [expression],
      );
    }
  }

  // Type
  set(postData,
    [POST_DATA_KEYS.RULE, POST_DATA_KEYS.TYPE],
    clonedState?.type,
  );

  // Query Result
  if (state?.type === DATA_LIST_CONSTANTS.QUERY_TYPE.DISTINCT) {
    set(
      postData,
      [POST_DATA_KEYS.RULE, POST_DATA_KEYS.DISTINCT_FIELD],
      clonedState?.distinctField?.value,
    );
  } else {
    set(
      postData,
      [POST_DATA_KEYS.RULE, POST_DATA_KEYS.QUERY_RESULT],
      Number(clonedState?.queryResult),
    );
  }

  // Output Format
  if (!isEmpty(clonedState?.outputFormat)) {
    const outputFormat = constructOutputFormatPostData(
      clonedState?.outputFormat,
      getDLOutputFormatCurrentRow,
      [],
    );

    set(
      postData,
      [POST_DATA_KEYS.RULE, POST_DATA_KEYS.OUTPUT_FORMAT],
      outputFormat,
    );
  }

  // Sort Data
  if (!isEmpty(clonedState?.sortField?.value)) {
    set(
      postData,
      [POST_DATA_KEYS.RULE, POST_DATA_KEYS.SORT],
      [{
        field_uuid: clonedState?.sortField?.value,
        order: clonedState?.sortOrder,
      }],
    );
  }

  // Sub Table Query
  if (clonedState.tableUUID) {
    postData[POST_DATA_KEYS.RULE].table_uuid = clonedState.tableUUID;
  }

  return postData;
};

export const constructIntegrationPostData = (state = {}) => {
  const clonedState = cloneDeep(state);

  const postData = {};

  if (clonedState?.pageId) {
    set(postData, POST_DATA_KEYS.PAGE_ID, clonedState?.pageId);
  } else if (clonedState?.taskMetaDataId) {
    set(postData, POST_DATA_KEYS.TASK, clonedState?.taskMetaDataId);
  } else if (clonedState?.flowId) {
    set(postData, POST_DATA_KEYS.FLOW, clonedState?.flowId);
  } else if (clonedState?.dataListId) {
    set(postData, POST_DATA_KEYS.DATA_LIST, clonedState?.dataListId);
  }

  set(postData, POST_DATA_KEYS.SOURCE_NAME, clonedState?.ruleName);

  if (clonedState?.ruleId) {
    set(postData, POST_DATA_KEYS.RULE_ID, clonedState?.ruleId);
  }

  if (clonedState?.ruleUuid) {
    set(postData, POST_DATA_KEYS.RULE_UUID, clonedState?.ruleUuid);
  }

  set(
    postData,
    [POST_DATA_KEYS.RULE, POST_DATA_KEYS.CONNECTOR_UUID],
    clonedState?.connectorUuid,
  );
  set(
    postData,
    [POST_DATA_KEYS.RULE, POST_DATA_KEYS.EVENT_UUID],
    clonedState?.eventUuid,
  );

  const validPaths = clonedState?.relativePath;

  if (!isEmpty(validPaths)) {
    const relativePath = validPaths?.map((eachRow) => {
      return {
        [POST_DATA_KEYS.PATHNAME]: eachRow?.path_name,
        [POST_DATA_KEYS.VALUE]: eachRow?.value,
        [POST_DATA_KEYS.TYPE]: eachRow?.type,
      };
    });

    set(
      postData,
      [POST_DATA_KEYS.RULE, POST_DATA_KEYS.RELATIVE_PATH],
      relativePath,
    );
  }

  const validParams = clonedState?.queryParams?.filter(
    (eachRow) => !isEmpty(eachRow?.value),
  );

  if (!isEmpty(validParams)) {
    const queryParams = validParams?.map((eachRow) => {
      return {
        [POST_DATA_KEYS.KEY]: eachRow?.key_uuid,
        [POST_DATA_KEYS.VALUE]: eachRow?.value,
        [POST_DATA_KEYS.TYPE]: eachRow?.type,
      };
    });

    set(
      postData,
      [POST_DATA_KEYS.RULE, POST_DATA_KEYS.QUERY_PARAMS],
      queryParams,
    );
  }

  if (!isEmpty(clonedState?.outputFormat)) {
    const outputFormat = constructOutputFormatPostData(
      clonedState?.outputFormat,
      getOutputFormatCurrentRowForDataList,
      [],
    );

    set(
      postData,
      [POST_DATA_KEYS.RULE, POST_DATA_KEYS.OUTPUT_FORMAT],
      outputFormat,
    );
  }

  return postData;
};

export const constructIntegrationValidationData = (state = {}) => {
  const clonedState = cloneDeep(state);

  const validateData = pick(clonedState, [
    FIELD_IDS.EXTERNAL_SOURCE,
    FIELD_IDS.SOURCE_NAME,
    FIELD_IDS.CONNECTOR_UUID,
    FIELD_IDS.EVENT_UUID,
    FIELD_IDS.RELATIVE_PATH,
    FIELD_IDS.QUERY_PARAMS,
  ]);

  const outputFormat = constructOutputFormatPostData(
    clonedState?.outputFormat,
    getOutputFormatCurrentRow,
    [],
  );

  validateData.outputFormat = outputFormat;

  return validateData;
};

export const constructDataListValidationData = (state = {}) => {
  const clonedState = cloneDeep(state);

  const validateData = pick(clonedState, [
    FIELD_IDS.EXTERNAL_SOURCE,
    FIELD_IDS.SOURCE_NAME,
    FIELD_IDS.DATA_LIST_UUID,
    FIELD_IDS.QUERY_RESULT,
    FIELD_IDS.TYPE,
    FIELD_IDS.DISTINCT_FIELD,
    FIELD_IDS.IS_LIMIT_FIELDS,
    FIELD_IDS.TABLE_UUID,
  ]);

  const outputFormat = constructOutputFormatPostData(
    clonedState?.outputFormat,
    getOutputFormatCurrentRow,
    [],
  );

  validateData.outputFormat = outputFormat;

  return validateData;
};

export const deleteErrorListWithId = (errorList, idsTobeDeleted = []) => {
  const clonedErrorList = cloneDeep(errorList);

  idsTobeDeleted?.forEach((id) => unset(clonedErrorList, id));

  return clonedErrorList;
};

export const isFieldExist = (fieldMetaData = [], fieldUuid = EMPTY_STRING) =>
  fieldMetaData?.find((eachField) => [eachField?.field_uuid, eachField?.table_uuid, eachField?.value]?.includes(fieldUuid));

export const getOutputFormatStateRow = (currentRow, path) => {
  const modifiedCurrentRow = {
    [OUTPUT_FORMAT_CONSTANTS.KEY_ID]:
      currentRow?.mapping_info || currentRow?.data_list_field_uuid || currentRow?.value,
    [OUTPUT_FORMAT_CONSTANTS.TYPE_ID]: currentRow?.type,
    [OUTPUT_FORMAT_CONSTANTS.NAME_ID]: currentRow?.name,
    [OUTPUT_FORMAT_CONSTANTS.KEY_UUID]: currentRow?.uuid,
    path,
  };

  // if (!isTableColumn) {
    modifiedCurrentRow[OUTPUT_FORMAT_CONSTANTS.VALUE_TYPE] = currentRow?.value_type;
  // }

  return modifiedCurrentRow;
};

const constructOutputFormatStateData = (outputFormat, getCurrentRow, apiData) => {
  const outputFormatErrorList = {};

  const data = outputFormat?.map((currentRow = {}, index = 0) => {
    const modifiedCurrentRow =
      getCurrentRow && getCurrentRow(currentRow, String(index));

    const isSystemField = modifiedCurrentRow?.[OUTPUT_FORMAT_CONSTANTS.VALUE_TYPE] === 'system';
    let isValueExist = isFieldExist(apiData?.field_metadata, modifiedCurrentRow?.[OUTPUT_FORMAT_CONSTANTS.KEY_ID]);

    if (!isValueExist && !isSystemField) {
      outputFormatErrorList[`${index},${OUTPUT_FORMAT_CONSTANTS.KEY_ID}`] = ERROR_MESSAGES.FIELD_DELETED;
    }

    if (isValueExist?.field_type === FIELD_TYPE.TABLE) {
      isValueExist = {
        ...isValueExist,
        table_name: isValueExist?.label,
        table_uuid: isValueExist?.field_uuid,
        field_name: isValueExist?.label,
        label: isValueExist?.label,
        value: isValueExist?.field_uuid,
        field_type: FIELD_TYPE.TABLE,
      };
    } else if (isValueExist?.field_list_type === FIELD_TYPE.TABLE) {
      isValueExist = {
        ...isValueExist,
        table_name: isValueExist?.table_reference_name,
        table_uuid: isValueExist?.table_uuid,
        field_name: isValueExist?.table_reference_name,
        label: isValueExist?.table_reference_name,
        value: isValueExist?.table_uuid,
        field_type: FIELD_TYPE.TABLE,
      };
    }

    modifiedCurrentRow[OUTPUT_FORMAT_CONSTANTS.FIELD_DETAILS] = isValueExist;

    if (
      currentRow &&
      currentRow?.column_mapping &&
      currentRow?.column_mapping?.length > 0
    ) {
      modifiedCurrentRow[OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING] =
        currentRow.column_mapping?.map((currentRow, childIndex) => {
          const childPath = `${index},${OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING},${childIndex}`;
          const modifiedChildRow =
            getCurrentRow && getCurrentRow(currentRow, childPath, true);

          const isChildValueExist = isFieldExist(apiData?.field_metadata, modifiedChildRow?.key);
          const isChildSystemField = modifiedChildRow?.[OUTPUT_FORMAT_CONSTANTS.VALUE_TYPE] === 'system';

          if (!isChildValueExist && !isChildSystemField) {
            outputFormatErrorList[`${index},${OUTPUT_FORMAT_CONSTANTS.COLUMN_MAPPING},${childIndex},${OUTPUT_FORMAT_CONSTANTS.KEY_ID}`] = ERROR_MESSAGES.FIELD_DELETED;
          }

          modifiedChildRow[OUTPUT_FORMAT_CONSTANTS.FIELD_DETAILS] = isChildValueExist;

          return modifiedChildRow;
        });
    }
    return modifiedCurrentRow;
  });

  return { data, outputFormatErrorList };
};

export const constructIntegrationStateData = async (
  ruleDetails,
  ruleData,
  apiData,
  dispatch,
) => {
  const stateData = {};
  const errorList = {};

  const params = {
    connector_uuid: get(
      ruleData,
      [POST_DATA_KEYS.CONNECTOR_UUID],
      EMPTY_STRING,
    ),
    status: API_CONSTANTS.PUBLISHED,
    event_uuid: get(ruleData, [POST_DATA_KEYS.EVENT_UUID], EMPTY_STRING),
  };

  const { selectedEvent } = await getSingleIntegrationConnector({
    params,
    dispatch,
  });

  stateData[FIELD_IDS.EXTERNAL_SOURCE] = DATA_SOURCE_TYPES.INTEGRATION;
  stateData[FIELD_IDS.SOURCE_NAME] = get(
    ruleDetails,
    [POST_DATA_KEYS.SOURCE_NAME],
    EMPTY_STRING,
  );
  stateData[FIELD_IDS.RULE_UUID] = get(
    ruleDetails,
    [POST_DATA_KEYS.RULE_UUID],
    EMPTY_STRING,
  );
  stateData[FIELD_IDS.RULE_TYPE] = get(
    ruleDetails,
    [POST_DATA_KEYS.RULE_TYPE],
    EMPTY_STRING,
  );

  stateData[FIELD_IDS.CONNECTOR_UUID] = get(
    ruleData,
    [POST_DATA_KEYS.CONNECTOR_UUID],
    EMPTY_STRING,
  );
  stateData[FIELD_IDS.EVENT_UUID] = get(
    ruleData,
    [POST_DATA_KEYS.EVENT_UUID],
    EMPTY_STRING,
  );

  const modifiedQueryParams = selectedEvent?.params?.map((eachRow, paramIndex) => {
    const selectedParam = find(
      ruleData?.query_params,
      (param) => param?.key === eachRow?.key_uuid,
    );

    const isValueExist = isFieldExist([...(apiData?.field_metadata || []), ...systemFields], selectedParam?.value);

    if (!isValueExist && selectedParam?.value) {
      errorList[
        `${FIELD_IDS.QUERY_PARAMS},${paramIndex},${POST_DATA_KEYS.VALUE}`
      ] = ERROR_MESSAGES.FIELD_DELETED;
    }

    return {
      key: eachRow?.key,
      key_uuid: selectedParam?.key || eachRow?.key_uuid,
      value: selectedParam?.value,
      type: selectedParam?.type,
      isRequired: selectedParam?.is_required || eachRow?.is_required,
    };
  });

  stateData[FIELD_IDS.QUERY_PARAMS] = modifiedQueryParams || [];

  const modifiedRelativePath = ruleData?.relative_path?.map((eachRow, pathIndex) => {
    const isValueExist = isFieldExist([...(apiData?.field_metadata || []), ...systemFields], eachRow?.value);

    if (!isValueExist) {
      errorList[
        `${FIELD_IDS.RELATIVE_PATH},${pathIndex},${POST_DATA_KEYS.VALUE}`
      ] = ERROR_MESSAGES.FIELD_DELETED;
    }

    return {
      path_name: eachRow?.path_name,
      value: eachRow?.value,
      type: eachRow?.type,
      isRequired: true,
    };
  });

  stateData[FIELD_IDS.RELATIVE_PATH] = modifiedRelativePath || [];

  const { data } = constructOutputFormatStateData(
    ruleData?.output_format,
    getOutputFormatStateRow,
    apiData,
  );

  stateData[FIELD_IDS.OUTPUT_FORMAT] = data;

  return { stateData, errorList };
};

export const getFieldDetailsAsObject = (source = [], value, label = EMPTY_STRING) => {
  let fieldDetails = {};
  source?.find((field) => {
    if (field?.field_uuid === value) {
      fieldDetails = field;
      return true;
    } else return false;
  });
  return {
    ...fieldDetails,
    ...(!isEmpty(label)) ? { label: label } : {},
    value: value,
  };
};

export const constructDataListStateData = (ruleDetails, ruleData, apiData, isFromFlow, dispatchFunction) => {
  const stateData = {};
  const errorList = {};

  stateData[FIELD_IDS.EXTERNAL_SOURCE] = DATA_SOURCE_TYPES.DATA_LIST;
  stateData[FIELD_IDS.SOURCE_NAME] = get(
    ruleDetails,
    [POST_DATA_KEYS.SOURCE_NAME],
    EMPTY_STRING,
  );
  stateData[FIELD_IDS.RULE_UUID] = get(
    ruleDetails,
    [POST_DATA_KEYS.RULE_UUID],
    EMPTY_STRING,
  );
  stateData[FIELD_IDS.RULE_TYPE] = get(
    ruleDetails,
    [POST_DATA_KEYS.RULE_TYPE],
    EMPTY_STRING,
  );

  stateData[FIELD_IDS.DATA_LIST_UUID] = get(
    ruleData,
    [POST_DATA_KEYS.DATA_LIST_UUID],
    EMPTY_STRING,
  );

  stateData[FIELD_IDS.DATA_LIST_NAME] = get(
    apiData,
    [POST_DATA_KEYS.DATA_LIST_NAME],
    EMPTY_STRING,
  );

  stateData[FIELD_IDS.RULE_DATA_LIST_ID] = get(
    apiData,
    [POST_DATA_KEYS.RULE_DATA_LIST_ID],
    EMPTY_STRING,
  );

  stateData[FIELD_IDS.TYPE] = get(
    ruleData,
    [POST_DATA_KEYS.TYPE],
    EMPTY_STRING,
  );

  if (!isEmpty(ruleData?.sort)) {
    stateData[FIELD_IDS.SORT_FIELD] = {
      label: getFieldDetailsAsObject(apiData?.field_metadata, ruleData.sort[0].field_uuid)?.field_name,
      value: ruleData.sort[0].field_uuid,
    };
    stateData[FIELD_IDS.SORT_ORDER] = ruleData.sort[0].order;
  }

  if (!isEmpty(ruleData?.distinct_field)) {
    stateData[FIELD_IDS.DISTINCT_FIELD] = {
      label: getFieldDetailsAsObject(apiData?.field_metadata, ruleData.distinct_field)?.field_name,
      value: ruleData.distinct_field,
    };
  }

  if (!isEmpty(ruleData?.[FIELD_IDS.FILTER]) || !isEmpty(ruleData?.[FIELD_IDS.POST_FILTER])) {
    const systemFields = getSystemFieldsForExternalSource(isFromFlow);
    let overallLFields = []; let
overallRFields = [];

    if (!isEmpty(ruleData?.[FIELD_IDS.FILTER])) {
      const { lFields, rFields } = getFilterFields(ruleData?.[FIELD_IDS.FILTER], apiData?.field_metadata, systemFields);
      overallLFields = Object.values(lFields);
      overallRFields = Object.values(rFields);
      const constructeRuleData = constructCBWithFieldMappingResponse(ruleData?.[FIELD_IDS.FILTER], lFields);
      set(stateData, [FIELD_IDS.FILTER, FIELD_IDS.RULE], constructeRuleData);
    }

    if (!isEmpty(ruleData?.[FIELD_IDS.POST_FILTER])) {
      const { lFields, rFields } = getFilterFields(ruleData?.[FIELD_IDS.POST_FILTER], apiData?.field_metadata, systemFields);
      overallLFields = uniqBy([...overallLFields, ...Object.values(lFields)], (eachField) => eachField?.field_uuid);
      overallRFields = uniqBy([...overallRFields, ...Object.values(rFields)], (eachField) => eachField?.field_uuid);
      const constructeRuleData = constructCBWithFieldMappingResponse(ruleData?.[FIELD_IDS.POST_FILTER], lFields);
      set(stateData, [FIELD_IDS.FILTER, FIELD_IDS.POST_RULE], constructeRuleData);
    }

    dispatchFunction({ lFields: overallLFields, rFields: overallRFields });
  }

  // const validFilters = get(
  //   ruleData,
  //   [POST_DATA_KEYS.FILTER, 0, POST_DATA_KEYS.EXPRESSION],
  //   [],
  // );

  // const filter = validFilters?.map((eachRow, filterIndex) => {
  //   const isFilterExist = isFieldExist(
  //     [...(apiData?.field_metadata || []), ...systemFields],
  //     eachRow?.field_uuid,
  //   );
  //   const isValueExist = isFieldExist([...(apiData?.field_metadata || []), ...systemFields], eachRow?.field || eachRow?.field_value);

  //   if (!isFilterExist) {
  //     errorList[
  //       `${POST_DATA_KEYS.FILTER},${filterIndex},${POST_DATA_KEYS.FIELD_UUID}`
  //     ] = ERROR_MESSAGES.FIELD_DELETED;
  //   }

  //   if (!isValueExist) {
  //     errorList[
  //       `${FIELD_IDS.FILTER},${filterIndex},${POST_DATA_KEYS.FIELD}`
  //     ] = ERROR_MESSAGES.FIELD_DELETED;
  //   }

  //   return {
  //     [POST_DATA_KEYS.FIELD_UUID]: eachRow?.field_uuid,
  //     [POST_DATA_KEYS.FIELD_TYPE]: eachRow?.field_type,
  //     [POST_DATA_KEYS.OPERATOR]: eachRow?.operator,
  //     [POST_DATA_KEYS.VALUE_TYPE]: eachRow?.value_type,
  //     [POST_DATA_KEYS.FIELD_VALUE]: eachRow?.field_value,
  //     [POST_DATA_KEYS.FIELD]: eachRow?.field,
  //     [POST_DATA_KEYS.FIELD_VALUE_TYPE]: isValueExist?.field_type,
  //     [POST_DATA_KEYS.FILTER_FIELD_TYPE]: isFilterExist?.field_type,
  //     [FIELD_IDS.CHOICE_VALUE_TYPE]: isFilterExist?.choice_value_type,
  //     [FIELD_IDS.FILTER_VALUE_CHOICE_VALUE_TYPE]: isValueExist?.choice_value_type,
  //   };
  // });

  stateData[FIELD_IDS.QUERY_RESULT] = get(
    ruleData,
    [POST_DATA_KEYS.QUERY_RESULT],
    EMPTY_STRING,
  );

  if (MULTIPLE_ENTRY_TYPES.includes(ruleData.type)) {
    stateData[FIELD_IDS.IS_LIMIT_FIELDS] = DATA_LIST_CONSTANTS.QUERY_RESULT.MULTIPLE_VALUE !== ruleData.query_result;
  }

  const { data, outputFormatErrorList } = constructOutputFormatStateData(
    ruleData?.output_format,
    getOutputFormatStateRow,
    apiData,
  );

  // Sub Table Query
  if (ruleData.table_uuid) {
    stateData.tableUUID = ruleData.table_uuid;
  }

  stateData[FIELD_IDS.OUTPUT_FORMAT] = data;

  return { stateData, errorList, outputFormatErrorList };
};

export const constructStateData = (apiDataParam, isFromFlow = false, dispatch, dispatchFunction) => {
  const apiData = cloneDeep(apiDataParam);
  const ruleDetails = get(apiData, [FIELD_IDS.RULE_DETAILS], {});
  const ruleData = get(apiData, [FIELD_IDS.RULE_DETAILS, FIELD_IDS.RULE], {});

  if (ruleDetails?.rule_type === RULE_TYPES.INTEGRATION) {
    const integrationData = constructIntegrationStateData(
      ruleDetails,
      ruleData,
      apiData,
      dispatch,
    );
    Promise.resolve(integrationData).then((data) => {
      const { stateData, errorList } = data;
      dispatch(externalSourceDataChange({ ...stateData, errorList }));
    });
  } else if (ruleDetails?.rule_type === RULE_TYPES.DATA_LIST) {
    const { stateData, errorList, outputFormatErrorList } = constructDataListStateData(
      ruleDetails,
      ruleData,
      apiData,
      isFromFlow,
      dispatchFunction,
    );
    console.log('xyz stateData', stateData);
    dispatch(externalSourceDataChange({ ...stateData, errorList, outputFormatErrorList }));
  }
};

export const getFieldsForTableSubQuery = (fieldList = [], tableUUID = null) => {
  console.log('xyz getFieldsForTableSubQuery', fieldList, tableUUID);
  if (tableUUID === null) return fieldList;

  const filteredData = fieldList.filter(
    (eachField) =>
      eachField?.table_uuid === tableUUID ||
      (eachField?.field_type !== FIELD_TYPE.TABLE &&
        eachField?.field_list_type === FIELD_LIST_TYPE.DIRECT),
  );
  return filteredData;
};

export const getTableTypeFieldsForTableSubQuery = (fieldList = []) => {
  const filteredData = fieldList.filter((eachField) => eachField?.field_type === FIELD_TYPE.TABLE);
  return filteredData;
};

export const getMetaData = (moduleType, metaData, moduleId) => {
  const data = {};

  if (moduleType === MODULE_TYPES.TASK) {
    data.taskMetaDataId = moduleId;
  } else if (moduleType === MODULE_TYPES.FLOW) {
    data.flowId = moduleId;
  } else if (moduleType === MODULE_TYPES.DATA_LIST) {
    data.dataListId = moduleId;
  } else if (moduleType === MODULE_TYPES.SUMMARY) {
    data.dashboardId = metaData.dashboardId;
    if (metaData.flowId) data.flowId = metaData.flowId;
    if (metaData.dataListId) data.dataListId = metaData.dataListId;
    data.pageId = metaData.pageId;
  }
  return data;
};

export const getPostMetaData = (moduleType, metaData, moduleId) => {
  const data = {};

  if (moduleType === MODULE_TYPES.TASK) {
    data.task_metadata_id = moduleId;
  } else if (moduleType === MODULE_TYPES.FLOW) {
    data.flow_id = moduleId;
  } else if (moduleType === MODULE_TYPES.DATA_LIST) {
    data.data_list_id = moduleId;
  } else if (moduleType === MODULE_TYPES.SUMMARY) {
    data.page_id = metaData.pageId;
  }
  return data;
};
