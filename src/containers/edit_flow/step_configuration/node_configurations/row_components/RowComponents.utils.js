import { isEmpty, cloneDeep, get, pick } from 'utils/jsUtility';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import { getFieldLabelWithRefName, validate } from '../../../../../utils/UtilityFunctions';
import {
  FIELD_VALUE_TYPES,
  ROW_COMPONENT_CONSTANTS,
  ROW_COMPONENT_KEY_TYPES,
} from './RowComponents.constants';
import { SEND_DATALIST_DROPDOWN_TYPES } from '../../configurations/Configuration.strings';
import { getModifiedRequestBody } from '../../../../integration/add_integration/events/add_event/request_body/RequestBody.utils';
import {
  constructStaticValues,
  getIntegrationRequestBodyData } from '../../StepConfiguration.utils';
import {
  FIELD_TYPE,
} from '../../../../../utils/constants/form.constant';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { translateFunction } from '../../../../../utils/jsUtility';
import { FIELD_VALUE_TYPE_LABELS } from './RowComponents.strings';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { getFieldTypeBasedSchemaForDL } from '../send_data_to_datalist/SendDataToDl.validation.schema';
import { getFieldTypeBasedSchemaForSubFlow } from '../call_another_flow/CallAnotherFlow.validation.schema';

export const getFieldTypeByKeyType = (keyType) => {
  switch (keyType) {
    case ROW_COMPONENT_KEY_TYPES.TEXT:
      return FIELD_TYPE.SINGLE_LINE;
    case ROW_COMPONENT_KEY_TYPES.NUMBER:
      return FIELD_TYPE.NUMBER;
    case ROW_COMPONENT_KEY_TYPES.BOOLEAN:
      return FIELD_TYPE.YES_NO;
    case ROW_COMPONENT_KEY_TYPES.DATE_AND_TIME:
      return FIELD_TYPE.DATETIME;
    case ROW_COMPONENT_KEY_TYPES.STREAM:
      return FIELD_TYPE.FILE_UPLOAD;
    default:
      return FIELD_TYPE.SINGLE_LINE;
  }
};

export const getCurrentSystemField = ({ fieldUuid, systemFields }) => {
  const fieldUuidLen = fieldUuid?.split('.');

  if (fieldUuidLen?.length > 1) {
    const stepUuid = fieldUuidLen[1];
    const currentStepSystemFields = systemFields?.find(
      (eachField) => eachField?.value === stepUuid,
    );
    return currentStepSystemFields?.subMenuItems?.find(
      (eachField) => eachField?.value === fieldUuid,
    );
  } else {
    return systemFields?.find((eachField) => eachField?.value === fieldUuid);
  }
};

export const getRequestBodyMappingData = ({
  keyData,
  fieldDetails,
  mappedValueData,
  systemFieldsList,
}) => {
  const getRowData = (data) => {
    data.key_type = data.type;
    data.field_type = getFieldTypeByKeyType(data.key_type);
    if (data?.value_type) {
      data.type = data.value_type;
      if (data.type === FIELD_VALUE_TYPES.DYNAMIC) {
        const selectedFieldDetails = fieldDetails.find(
          (field) => field.fieldUuid === data.value,
        );

        data.field_details = {
          ...selectedFieldDetails,
          label: getFieldLabelWithRefName(
            selectedFieldDetails?.fieldName,
            selectedFieldDetails?.referenceName,
          ),
        };
      } else if (data?.type === FIELD_VALUE_TYPES.SYSTEM) {
        const currentSystemField = getCurrentSystemField({
          fieldUuid: data.value,
          systemFields: systemFieldsList,
        });

        data.field_details = currentSystemField;
      } else if (data?.type === FIELD_VALUE_TYPES.STATIC) {
        data.value = constructStaticValues(data.value, data?.field_type, null, null, null, null, { isParseNumber: true });
      }
      delete data.value_type;
    } else {
      if (data.key_type === 'object' && !data.is_multiple) {
        data.type = FIELD_VALUE_TYPES.STATIC;
      } else data.type = FIELD_VALUE_TYPES.DYNAMIC;
    }
    return data;
  };

  const initialReqBody = getModifiedRequestBody(
    keyData,
    'child_rows',
    'key_uuid',
    getRowData,
    mappedValueData,
  );

  return getIntegrationRequestBodyData(cloneDeep(initialReqBody));
};

export const constructResponseFormatStateData = ({
  keyData,
  fieldDetails,
  keyObject,
  parentIndex,
  isRecursiveCall,
}) => {
  const clonedResponseFormat = cloneDeep(keyData);

  const modifiedResponse = clonedResponseFormat?.map((eachResponse, index) => {
    const currentRowData = {
      [keyObject?.rowUuid]: get(
        eachResponse,
        [keyObject?.rowUuid],
        EMPTY_STRING,
      ),
      [keyObject?.keyType]: get(
        eachResponse,
        [keyObject?.keyType],
        EMPTY_STRING,
      ),
      path: isRecursiveCall
        ? `${String(parentIndex)},${keyObject?.columnMappingListKey},${String(
            index,
          )}`
        : String(index),
      key_uuid: uuidv4(),
      is_deleted: false,
    };

    if (eachResponse?.fieldUuid || eachResponse?.tableUuid) {
      currentRowData[keyObject?.value] =
        eachResponse?.fieldUuid || eachResponse?.tableUuid;

      const selectedField = fieldDetails?.find(
        (eachField = {}) =>
          eachField?.fieldUuid === currentRowData?.value,
      );

      currentRowData[keyObject?.valueDetails] = selectedField;
      currentRowData[keyObject?.valueFieldType] = selectedField?.fieldType;
    }

    if (eachResponse?.[keyObject?.keyType] === ROW_COMPONENT_KEY_TYPES.OBJECT) {
      currentRowData[keyObject?.columnMappingListKey] =
        constructResponseFormatStateData({
          keyData: eachResponse?.[keyObject?.columnMappingListKey],
          fieldDetails,
          keyObject,
          isRecursiveCall: true,
          parentIndex: index,
        });
    }

    return currentRowData;
  });

  return modifiedResponse;
};

export const getCurrentComponentRowData = ({
  fieldDetails = [],
  systemFieldsList = [],
  mappedValueData = [],
  keyObject = {},
  keyObject: {
    key,
    value,
    valueType,
    valueDetails,
    mappingUuid,
    childKey,
  },
  parentIndex,
  isRecursiveCall,
}) => {
  const updatedData = [];
  if (!isEmpty(mappedValueData)) {
    mappedValueData.forEach((mappedData, index) => {
      const selectedChildFieldDetails = fieldDetails?.find(
        (field) => field?.fieldUuid === mappedData?.[mappingUuid],
      ) || { fieldUuid: mappedData?.[mappingUuid] };
      const keyDetails = pick(selectedChildFieldDetails, [
        '_id',
        'fieldUuid',
        'fieldType',
        'choiceValueType',
        'choiceValues',
    ]);
      const data = {
        ...mappedData,
        ...keyDetails,
        dataListDetails: selectedChildFieldDetails?.dataListDetails,
        [key]: selectedChildFieldDetails?.label || getFieldLabelWithRefName(
          selectedChildFieldDetails?.fieldName || selectedChildFieldDetails?.label,
          selectedChildFieldDetails?.referenceName || selectedChildFieldDetails?.label,
        ),
        path: isRecursiveCall
        ? `${String(parentIndex)},${childKey},${String(index)}`
        : String(index),
      };
      delete data?.[mappingUuid];
      if (!isEmpty(mappedData?.[childKey]) && mappedData[childKey]?.length > 0) {
        data[childKey] = getCurrentComponentRowData({
          fieldDetails,
          systemFieldsList,
          mappedValueData: mappedData?.[childKey],
          keyObject,
          parentIndex: index,
          isRecursiveCall: true,
        });
      }
      if (mappedData?.[valueType] === FIELD_VALUE_TYPES.DYNAMIC || mappedData?.[valueType] === FIELD_VALUE_TYPES.ITERATIVE) {
        const selectedFieldDetails = fieldDetails?.find(
          (field) => field?.fieldUuid === mappedData?.[value],
        );
        if (selectedFieldDetails?.source_data_list_details) {
          selectedFieldDetails.dataListDetails = {
            dataListUuid: selectedFieldDetails?.source_data_list_details?.dataListUuid,
            displayFields: selectedFieldDetails?.source_data_list_details?.displayFields,
          };
        }
        data[valueDetails] = {
          ...selectedFieldDetails,
          propertyFieldType: selectedFieldDetails?.property_picker_details?.reference_field_type,
          propertyChoiceValueType: selectedFieldDetails?.property_picker_details?.reference_field_choice_value_type,
          label: selectedFieldDetails?.label || getFieldLabelWithRefName(
            selectedFieldDetails?.fieldName,
            selectedFieldDetails?.referenceName,
          ),
          tableUuid: selectedFieldDetails?.tableUuid,
        };
      } else if (mappedData?.[valueType] === FIELD_VALUE_TYPES.SYSTEM) {
        const currentSystemField = getCurrentSystemField({
          fieldUuid: mappedData?.[value],
          systemFields: systemFieldsList,
        });
        data[valueDetails] = currentSystemField;
      }
      updatedData.push({
        ...data,
      });
    });
  }
  return updatedData;
};

export const getCurrentComponentData = ({
  keyData = [],
  fieldDetails = [],
  systemFieldsList = [],
  mappedValueData = [],
  keyObject = {},
  keyObject: {
    rowUuid,
    // key,
    value,
    valueType,
    valueDetails,
    // isRequired,
    mappingUuid,
    childKey,
    updateType,
    mappingType,
  },
  parentIndex,
  isRecursiveCall,
  keyLabels = {},
}) => {
  const { SEND_DATA_TO_DL } = ROW_COMPONENT_CONSTANTS;
  return keyData.map((currentRow, index) => {
    let additionalData = {
      [valueType]: FIELD_VALUE_TYPES.DYNAMIC,
    };
    if (!isEmpty(mappedValueData)) {
      const mappedData = mappedValueData.find(
        (data) => data?.[mappingUuid] === currentRow?.[rowUuid],
      );
      if (!isEmpty(mappedData)) {
        additionalData = {
          [value]: mappedData?.[value],
          [valueType]: mappedData?.[valueType] || FIELD_VALUE_TYPES.DYNAMIC,
        };

        if (!isEmpty(updateType)) {
          additionalData[updateType] = mappedData?.operation;
        }
        if (mappedData?.[valueType] === FIELD_VALUE_TYPES.SYSTEM) {
          const currentSystemField = getCurrentSystemField({
            fieldUuid: mappedData?.[value],
            systemFields: systemFieldsList,
          });

          additionalData[valueDetails] = currentSystemField;
        } else if (
          mappedData?.[valueType] === FIELD_VALUE_TYPES.DYNAMIC ||
          isEmpty(mappedData?.[valueType]) //  to get table data for call sub flow table mapping
        ) {
          const selectedFieldDetails = fieldDetails?.find(
            (field) => field?.fieldUuid === mappedData?.[value],
          );
          additionalData[valueDetails] = {
            ...selectedFieldDetails,
            label: getFieldLabelWithRefName(
              selectedFieldDetails?.fieldName,
              selectedFieldDetails?.referenceName,
            ),
          };
        }
      }
    }

    const updatedData = {
      ...currentRow,
      ...additionalData,
      path: isRecursiveCall
        ? `${String(parentIndex)},${childKey},${String(index)}`
        : String(index),
    };

    if (mappingType && isEmpty(updatedData[mappingType])) {
      if (currentRow?.fieldType === FIELD_TYPE.TABLE) {
        updatedData[mappingType] = SEND_DATA_TO_DL.DIRECT_TO_TABLE_MAPPING;
      } else {
        updatedData[mappingType] = SEND_DATA_TO_DL.DIRECT_TO_DIRECT_MAPPING;
      }
    }

    if (!isEmpty(currentRow?.[keyLabels?.childKey])) {
      updatedData[childKey] = getCurrentComponentData({
        keyData: currentRow?.[keyLabels?.childKey],
        fieldDetails,
        mappedValueData,
        keyObject,
        parentIndex: index,
        isRecursiveCall: true,
      });
    }

    console.log('getSendDataListStateMapping', {
      keyData,
      fieldDetails,
      mappedValueData,
      keyObject,
      updatedData,
    });

    return updatedData;
  });
};

export const getValueTypes = (t = translateFunction) => [
  {
    label: FIELD_VALUE_TYPE_LABELS(t).USER_DEFINED_FIELDS,
    value: FIELD_VALUE_TYPES.DYNAMIC,
  },
  {
    label: FIELD_VALUE_TYPE_LABELS(t).ITERATIVE_FIELDS,
    value: FIELD_VALUE_TYPES.ITERATIVE,
  },
  {
    label: FIELD_VALUE_TYPE_LABELS(t).DATALIST_ENTRY,
    value: FIELD_VALUE_TYPES.MAP_ENTRY,
  },
  {
    label: FIELD_VALUE_TYPE_LABELS(t).USER_ENTRY,
    value: FIELD_VALUE_TYPES.USER_ENTRY,
  },
  {
    label: FIELD_VALUE_TYPE_LABELS(t).SYSTEM_FIELDS,
    value: FIELD_VALUE_TYPES.SYSTEM,
  },
  {
    label: FIELD_VALUE_TYPE_LABELS(t).STATIC_VALUE,
    value: FIELD_VALUE_TYPES.STATIC,
  },
];

export const getDataNotFound = () => [
  {
    label: 'No Fields Found',
    value: 'No Fields Found',
    optionType: SEND_DATALIST_DROPDOWN_TYPES.OPTION_LIST_TITLE,
    disabled: true,
  },
];

export const checkForTypeMismatch = (rowData, path, keyObject, isDLCheck) => {
  const updatedErrorList = {};

  if (isEmpty(rowData?.[keyObject?.value]) || isEmpty(rowData?.[keyObject?.rowUuid])) {
    return {};
  }
    const schema = isDLCheck ? getFieldTypeBasedSchemaForDL() : getFieldTypeBasedSchemaForSubFlow();
    const errorList = validate({
      fieldDetails: rowData.fieldDetails,
      fieldType: rowData.fieldType,
      choiceValueType: rowData.choiceValueType,
      [keyObject?.valueType]: rowData?.[keyObject?.valueType],
      is_deleted: rowData?.is_deleted,
      dataListDetails: rowData?.dataListDetails,
      ...isDLCheck ? { mappingType: rowData?.mappingType } : {},
    }, constructJoiObject({ ...schema }));
    Object.keys(errorList || {}).forEach((key) => {
      updatedErrorList[`${path},${key}`] = errorList[key];
    });
    console.log('errorList in mapping type check', errorList, updatedErrorList, {
      fieldDetails: rowData.fieldDetails,
      fieldType: rowData.fieldType,
      choiceValueType: rowData.choiceValueType,
    });
  return updatedErrorList;
};

export const getFieldsList = ({
  tableUuid = EMPTY_STRING,
  allFields = [],
  mappedFieldUuids = [],
  allowedFieldTypes = [],
  ignoreFieldTypes = [],
  allowedFieldListTypes = [],
  searchText = EMPTY_STRING,
}) => {
    let filteredFields = allFields;
  if (allowedFieldTypes?.length > 0) {
    filteredFields = filteredFields?.filter((fieldData) => allowedFieldTypes?.includes(fieldData.fieldType));
  }
  if (allowedFieldListTypes?.length > 0) {
    filteredFields = filteredFields?.filter((fieldData) => allowedFieldListTypes?.includes(fieldData.fieldListType));
  }
  if (ignoreFieldTypes?.length > 0) {
    filteredFields = filteredFields?.filter((fieldData) => !ignoreFieldTypes?.includes(fieldData.fieldType));
  }
  if (!isEmpty(tableUuid)) {
    filteredFields = filteredFields?.filter((fieldData) => (fieldData.tableUuid === tableUuid));
  }
  if (mappedFieldUuids?.length > 0) {
    filteredFields = filteredFields?.filter((fieldData) => !mappedFieldUuids?.includes(fieldData.fieldUuid));
  }
  if (!isEmpty(searchText)) {
    searchText = searchText?.toLowerCase();
    filteredFields = filteredFields?.filter((fieldData) => (fieldData?.label)?.toLowerCase()?.includes(searchText));
  }
  return filteredFields;
};

export const getSchemaForActiveRow = (currentSchema) =>
  Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: currentSchema,
  });
