import React, { useEffect, useState } from 'react';
import gClasses from 'scss/Typography.module.scss';
import { InputTreeLayout } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import { v4 as uuidv4 } from 'uuid';
import styles from './FieldMappingTable.module.scss';
import {
  checkForTypeMismatch,
  constructResponseFormatStateData,
  getCurrentComponentData,
  getCurrentComponentRowData,
  getRequestBodyMappingData,
} from '../RowComponents.utils';
import {
  FIELD_MAPPING_TABLE_TYPES,
  FIELD_VALUE_TYPES,
  MAPPING_COMPONENT_TYPES,
  ROW_COMPONENT_CONSTANTS,
  ROW_COMPONENT_KEY_TYPES,
} from '../RowComponents.constants';
import useApiCall from '../../../../../../hooks/useApiCall';
import { FIELD_TYPE } from '../../../../../../utils/constants/form.constant';
import { apiGetAllFieldsList } from '../../../../../../axios/apiService/flow.apiService';
import KeyValueWithUpdate from '../key_value_with_update/KeyValueWithUpdate';
import KeyValue from '../key_value/KeyValue';
import KeyValueType from '../key_value_with_type/KeyValueType';
import ResponseField from '../response_field/ResponseField';
import PlusIcon from '../../../../../../assets/icons/PlusIcon';
import keyValueStyles from '../key_value/KeyValue.module.scss';
import keyValueTypeStyles from '../key_value_with_type/KeyValueType.module.scss';
import keyValueUpdateStyles from '../key_value_with_update/KeyValueWithUpdate.module.scss';
import requestBodyStyles from '../request_body/RequestBody.module.scss';
import RequestBody from '../request_body/RequestBody';
import { formatTableAndColumnDetails } from '../../send_data_to_datalist/SendDataToDl.utils';
import { cloneDeep, set, has, unset, get, isEmpty } from '../../../../../../utils/jsUtility';
import { formatFieldsWithTable, formatMappingField, getSystemFieldsList } from '../../../../node_configuration/NodeConfiguration.utils';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';

let cancelTokenForParentFields = null;
let cancelTokenForKeyFields = null;
let cancelTokenForIterativeFields = null;

const setCancelTokenForKeyFields = (c) => {
  cancelTokenForKeyFields = c;
};

const setCancelTokenForParentFields = (c) => {
  cancelTokenForParentFields = c;
};

const setCancelTokenForIterativeFields = (c) => {
  cancelTokenForIterativeFields = c;
};

function FieldMappingTable(props) {
  const {
    key,
    tableHeaders,
    keyLabels,
    additionalRowComponentProps,
    initialRawData,
    mappedData,
    fieldDetails,
    mappingVariant,
    mappingComponent,
    mappingListKey,
    handleMappingChange,
    parentId = EMPTY_STRING,
    childFlowId = EMPTY_STRING,
    dataListId = EMPTY_STRING,
    rowInitialData = {},
    mappedServerData = [],
    isParentDatalist,
    errorList = {},
    errorListKey = 'errorList',
    documentDetailsKey,
    parentSetCancelToken,
    parentCancelToken,
    keyFieldParams = {},
    valueFieldParams = {},
    systemFieldParams = {},
  } = props;

  const { SEND_DATA_TO_DL } = ROW_COMPONENT_CONSTANTS;

  console.log('FieldMappingTable', {
    mappedData,
    tableHeaders,
    keyLabels,
    additionalRowComponentProps,
    initialRawData,
    fieldDetails,
    mappingVariant,
    mappingComponent,
    mappingListKey,
    handleMappingChange,
    dataListId,
  }, 'props', props,
  );
  const [systemFieldsList, setSystemFields] = useState([]);
  const { keyObject, isMLIntegration, iterativeField, documentUrlDetails, metaData } = additionalRowComponentProps;

  const {
    data: mappingFields,
    fetch: mappingFieldFetch,
    clearData: clearMappingFields,
    isLoading: isMappingFieldsLoading,
  } = useApiCall({}, true, formatFieldsWithTable);

  const {
    data: valueFields,
    fetch: valueFieldFetch,
    clearData: clearValueFields,
    isLoading: isValueFieldsLoading,
  } = useApiCall({}, true, formatMappingField);

  const {
    data: iterativeFields,
    fetch: iterativeFieldFetch,
    clearData: clearIterativeFields,
    isLoading: isIterativeFieldsLoading,
  } = useApiCall({}, true, formatMappingField);

  useEffect(() => {
    if (parentId) {
      const params = {
        page: 1,
        size: 1000,
        ...(isParentDatalist) ? { data_list_id: parentId } : { flow_id: parentId },
        ignore_field_types: [FIELD_TYPE.INFORMATION],
        include_property_picker: 1,
        include_source_picker_details: 1,
        ...valueFieldParams,
      };

      const setCancelToken = parentSetCancelToken || setCancelTokenForParentFields;
      const cancelToken = parentCancelToken || cancelTokenForParentFields;
      valueFieldFetch(apiGetAllFieldsList(params, setCancelToken, cancelToken));
    }
  }, [parentId]);

  useEffect(() => {
    if (childFlowId) {
      const flowFieldsParam = {
        page: 1,
        size: 1000,
        flow_id: childFlowId,
        ...keyFieldParams,
      };
      mappingFieldFetch(apiGetAllFieldsList(flowFieldsParam, setCancelTokenForKeyFields, cancelTokenForKeyFields));
    }
  }, [childFlowId]);

  useEffect(() => {
    if (dataListId) {
      const datalistFieldsParams = {
        page: 1,
        size: 1000,
        data_list_id: dataListId,
        ...keyFieldParams,
      };
      mappingFieldFetch(apiGetAllFieldsList(datalistFieldsParams, setCancelTokenForKeyFields, cancelTokenForKeyFields));
    }
  }, [dataListId]);

  useEffect(() => {
    if (parentId && !isEmpty(iterativeField?.fieldUuid)) {
      const iterativeFieldsParam = {
        page: 1,
        size: 1000,
        flow_id: parentId,
        ignore_field_types: [FIELD_TYPE.INFORMATION],
        include_property_picker: 1,
      };

      if (iterativeField?.fieldType === FIELD_TYPE.TABLE) {
        iterativeFieldsParam.field_list_type = FIELD_TYPE.TABLE;
        iterativeFieldsParam.table_uuid = iterativeField?.fieldUuid;
      } else {
        iterativeFieldsParam.field_uuid = [iterativeField?.fieldUuid];
      }

      iterativeFieldFetch(apiGetAllFieldsList(iterativeFieldsParam, setCancelTokenForIterativeFields, cancelTokenForIterativeFields));
    }
  }, [iterativeField?.fieldUuid]);

  const getSystemFields = async () => {
    const formattedSystemFields = getSystemFieldsList({
      ...systemFieldParams,
    });
    setSystemFields(formattedSystemFields);
  };

  useEffect(() => {
    getSystemFields();
    return () => {
      clearMappingFields();
      clearValueFields();
      clearIterativeFields();
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(mappedData) || isEmpty(mappingFields)) return;
    if (
      [
        MAPPING_COMPONENT_TYPES.SEND_DATA_TO_DL,
        MAPPING_COMPONENT_TYPES.CALL_SUB_FLOW,
        MAPPING_COMPONENT_TYPES.SHORTCUT_TRIGGER,
        MAPPING_COMPONENT_TYPES.TRIGGER_ACTIONS,
      ].includes(mappingComponent)
    ) {
      const _mappingFields = formatTableAndColumnDetails(mappingFields, keyLabels?.childKey);
      const mappingData = getCurrentComponentRowData({
        keyData: _mappingFields,
        fieldDetails: [...fieldDetails, ..._mappingFields],
        systemFieldsList: systemFieldsList,
        mappedValueData: mappedServerData,
        keyObject: additionalRowComponentProps?.keyObject,
        keyLabels,
      });
      handleMappingChange?.({
        [mappingListKey]: mappingData,
      });
    }
  }, [mappingFields?.length]);

  useEffect(() => {
    if (!isEmpty(mappedData) || (!isEmpty(systemFieldParams?.allSystemFields) && systemFieldParams?.allSystemFields?.length !== 0 && systemFieldsList?.length === 0)) return;
    if (mappingComponent === MAPPING_COMPONENT_TYPES.CALL_INTEGRATION) {
      let mappingData = {};

      if (mappingVariant === FIELD_MAPPING_TABLE_TYPES.REQ_BODY_VALUE_MAPPING) {
        mappingData = getRequestBodyMappingData({
          keyData: initialRawData,
          fieldDetails,
          mappedValueData: mappedServerData,
          keyObject: additionalRowComponentProps?.keyObject,
          systemFieldsList: systemFieldsList,
        });
      } else if (
        mappingVariant === FIELD_MAPPING_TABLE_TYPES.RESPONSE_FIELD_MAPPING
      ) {
        mappingData = constructResponseFormatStateData({
          keyData: mappedServerData,
          fieldDetails,
          keyObject: additionalRowComponentProps?.keyObject,
        });
      } else {
        mappingData = getCurrentComponentData({
          keyData: initialRawData,
          mappedValueData: mappedServerData,
          systemFieldsList: systemFieldsList,
          fieldDetails,
          keyObject: additionalRowComponentProps?.keyObject,
        });
      }

      handleMappingChange({
        [mappingListKey]: mappingData,
      });
    }
  }, [mappedData?.length, systemFieldsList?.length]);

  let currentRowComponent = null;
  let hideRootAdd = true;
  let showAddMore = true;
  let readOnlyView = false;
  let headerStyles = [];
  const depth = 0;
  let maxDepth = 3;

  switch (mappingVariant) {
    case FIELD_MAPPING_TABLE_TYPES.KEY_VALUE_MAPPING_WITH_TYPE:
      currentRowComponent = KeyValueType;
      hideRootAdd = false;
      headerStyles = [
        keyValueTypeStyles.InputColumn,
        keyValueTypeStyles.TypeColumn,
        keyValueTypeStyles.OutputColumn,
        keyValueStyles.DeleteColumn,
      ];
      maxDepth = 1;
      break;
    case FIELD_MAPPING_TABLE_TYPES.KEY_VALUE_MAPPING_WITH_UPDATE_TYPE:
      currentRowComponent = KeyValueWithUpdate;
      hideRootAdd = false;
      headerStyles = [
        keyValueUpdateStyles.InputColumn,
        keyValueUpdateStyles.TypeColumn,
        keyValueUpdateStyles.UpdateColumn,
        keyValueUpdateStyles.OutputColumn,
        keyValueUpdateStyles.DeleteColumn,
      ];
      maxDepth = 1;
      break;
    case FIELD_MAPPING_TABLE_TYPES.RESPONSE_FIELD_MAPPING:
      currentRowComponent = ResponseField;
      hideRootAdd = false;
      headerStyles = [
        keyValueTypeStyles.InputColumn,
        keyValueTypeStyles.TypeColumn,
        keyValueTypeStyles.OutputColumn,
        keyValueStyles.DeleteColumn,
      ];
      maxDepth = 1;
      break;
    case FIELD_MAPPING_TABLE_TYPES.REQ_BODY_VALUE_MAPPING:
      currentRowComponent = RequestBody;
      showAddMore = false;
      readOnlyView = true;
      if (isMLIntegration) {
        headerStyles = [
          requestBodyStyles.InputColumn,
          requestBodyStyles.TypeColumn,
          requestBodyStyles.MLOutputColumn,
        ];
      } else {
        headerStyles = [
          requestBodyStyles.InputColumn,
          requestBodyStyles.TypeColumn,
          requestBodyStyles.MultipleColumn,
          requestBodyStyles.OutputColumn,
        ];
      }
      break;
    default:
      currentRowComponent = KeyValue;
      headerStyles = [keyValueStyles.InputColumn, keyValueStyles.OutputColumn];
      break;
  }

  const handleOnChangeHandler = (event, path, _isDuplicateKeyError, _duplicateKeyRowtype, type) => {
    const clonedMappedData = cloneDeep(mappedData);
    let clonedErrorList = cloneDeep(errorList);
    path = (path || []).split(',');
    let documentDetails = {};
    if (event?.target?.isUpdateAnotherValue) {
      if (keyObject?.documentDetails === event.target.updateId) {
        documentDetails = event.target.updateValue?.docDetails;
      } else {
        set(
          clonedMappedData,
          [...path, event.target.updateId],
          event.target.updateValue,
        );
      }

      if (
        event?.target?.updateType ===
        ROW_COMPONENT_CONSTANTS.ANOTHER_VALUE_UPDATE_TYPES.RESPONSE_BODY_TYPE
      ) {
        if (
          event.target.keyType !== ROW_COMPONENT_KEY_TYPES.OBJECT &&
          has(clonedMappedData, [
            ...path,
            ROW_COMPONENT_CONSTANTS.COLUMN_MAPPING,
          ])
        ) {
          unset(clonedMappedData, [
            ...path,
            ROW_COMPONENT_CONSTANTS.COLUMN_MAPPING,
          ]);
        }
      } else if (event?.target?.updateType === keyObject?.valueDetails && keyObject?.valueFieldType) {
        set(
          clonedMappedData,
          [...path, keyObject?.valueFieldType],
          event.target.updateValue?.fieldType,
        );
      } else if (event?.target?.updateType === keyObject?.valueType) {
        unset(
          clonedMappedData,
          [...path, keyObject?.valueFieldType],
        );
      } else {
        // do nothing
      }
    }
    if ([MAPPING_COMPONENT_TYPES.CALL_SUB_FLOW, MAPPING_COMPONENT_TYPES.TRIGGER_ACTIONS, MAPPING_COMPONENT_TYPES.SEND_DATA_TO_DL].includes(mappingComponent)) {
      const mappedData = get(clonedMappedData, [...path], {});
      switch (type) {
        case keyObject.key:
          set(clonedMappedData, [...path, event.target.id], event.target.value);
          set(clonedMappedData, [...path, keyObject?.key], event.target.label);
          set(clonedMappedData, [...path], {
            ...mappedData,
            ...event?.target?.selectedField || {},
          });
          delete clonedErrorList?.[`${path.join(',')},${keyObject?.rowUuid}`];
          delete clonedErrorList?.[`${path.join(',')},${keyObject?.key}`];
          delete clonedErrorList?.[`${path.join(',')},${ROW_COMPONENT_CONSTANTS.FIELD_TYPE}`];
          delete clonedErrorList?.[`${path.join(',')},${ROW_COMPONENT_CONSTANTS.CHOICE_VALUE_TYPE}`];
          delete clonedErrorList?.[`${path.join(',')},${keyObject?.valueDetails},${ROW_COMPONENT_CONSTANTS.FIELD_TYPE}`];
          delete clonedErrorList?.[`${path.join(',')},${keyObject?.valueDetails},${ROW_COMPONENT_CONSTANTS.CHOICE_VALUE_TYPE}`];
          delete clonedErrorList?.[`${path.join(',')},${keyObject?.valueDetails},${ROW_COMPONENT_CONSTANTS.PROPERTY_FIELD_TYPE}`];
          delete clonedErrorList?.[`${path.join(',')},${keyObject?.valueDetails},${ROW_COMPONENT_CONSTANTS.PROPERTY_CHOICE_VALUE_TYPE}`];
          delete clonedErrorList?.[`${path.join(',')},dataListDetails,dataListUuid`];
          if ([FIELD_VALUE_TYPES.STATIC].includes(get(clonedMappedData, [...path, 'valueType'], null))) {
            set(clonedMappedData, [...path, keyObject?.value], null);
            set(clonedMappedData, [...path, keyObject?.valueDetails], {});
          }
          if (get(clonedMappedData, [...path, ROW_COMPONENT_CONSTANTS.FIELD_TYPE], null) === FIELD_TYPE.TABLE) {
            set(clonedMappedData, [...path, keyLabels?.childKey], []);
            set(clonedMappedData, [...path, keyObject?.valueType], FIELD_VALUE_TYPES.DYNAMIC);
          } else {
            unset(clonedMappedData, [...path, keyLabels?.childKey]);
          }
          if (isEmpty(event?.target?.selectedField)) {
            unset(clonedMappedData, [...path, ROW_COMPONENT_CONSTANTS.FIELD_TYPE]);
          }
          if (isParentDatalist) {
            if (mappedData?.[keyObject?.valueType] === FIELD_VALUE_TYPES.MAP_ENTRY) {
              if (clonedMappedData?.dataListDetails?.dataListUuid !== metaData?.childModuleUuid) {
                set(clonedMappedData, [...path], {
                  ...mappedData,
                  [keyObject?.valueType]: FIELD_VALUE_TYPES.DYNAMIC,
                });
              }
            }
            if (mappedData?.[keyObject?.valueType] === FIELD_VALUE_TYPES.USER_ENTRY) {
              set(clonedMappedData, [...path], {
                ...mappedData,
                [keyObject?.valueType]: FIELD_VALUE_TYPES.DYNAMIC,
              });
            }
          }
          break;
        case keyObject?.valueType:
          delete clonedErrorList?.[`${path.join(',')},${event.target.id}`];
          if (get(clonedMappedData, [...path, event.target.id], null) !== event.target.value) {
            set(clonedMappedData, [...path, event.target.id], event.target.value);
            set(clonedMappedData, [...path, keyObject?.value], null);
            set(clonedMappedData, [...path, keyObject?.valueDetails], {});
            delete clonedErrorList?.[`${path.join(',')},${keyObject?.value}`];
            delete clonedErrorList?.[`${path.join(',')},${ROW_COMPONENT_CONSTANTS.FIELD_TYPE}`];
            delete clonedErrorList?.[`${path.join(',')},${ROW_COMPONENT_CONSTANTS.CHOICE_VALUE_TYPE}`];
            delete clonedErrorList?.[`${path.join(',')},${keyObject?.valueDetails},${ROW_COMPONENT_CONSTANTS.FIELD_TYPE}`];
            delete clonedErrorList?.[`${path.join(',')},${keyObject?.valueDetails},${ROW_COMPONENT_CONSTANTS.CHOICE_VALUE_TYPE}`];
            delete clonedErrorList?.[`${path.join(',')},${keyObject?.valueDetails},${ROW_COMPONENT_CONSTANTS.PROPERTY_FIELD_TYPE}`];
            delete clonedErrorList?.[`${path.join(',')},${keyObject?.valueDetails},${ROW_COMPONENT_CONSTANTS.PROPERTY_CHOICE_VALUE_TYPE}`];
            delete clonedErrorList?.[`${path.join(',')},dataListDetails,dataListUuid`];
          }
          break;
        case keyObject.value:
          if ([FIELD_VALUE_TYPES.DYNAMIC, FIELD_VALUE_TYPES.SYSTEM, FIELD_VALUE_TYPES.ITERATIVE].includes(
            get(clonedMappedData, [...path, keyObject?.valueType], null),
          )) {
            delete clonedErrorList?.[`${path.join(',')},${ROW_COMPONENT_CONSTANTS.FIELD_TYPE}`];
            delete clonedErrorList?.[`${path.join(',')},${ROW_COMPONENT_CONSTANTS.CHOICE_VALUE_TYPE}`];
            delete clonedErrorList?.[`${path.join(',')},${keyObject?.valueDetails},${ROW_COMPONENT_CONSTANTS.FIELD_TYPE}`];
            delete clonedErrorList?.[`${path.join(',')},${keyObject?.valueDetails},${ROW_COMPONENT_CONSTANTS.CHOICE_VALUE_TYPE}`];
            delete clonedErrorList?.[`${path.join(',')},${keyObject?.valueDetails},${ROW_COMPONENT_CONSTANTS.PROPERTY_FIELD_TYPE}`];
            delete clonedErrorList?.[`${path.join(',')},${keyObject?.valueDetails},${ROW_COMPONENT_CONSTANTS.PROPERTY_CHOICE_VALUE_TYPE}`];
            delete clonedErrorList?.[`${path.join(',')},dataListDetails,dataListUuid`];
          }
          if ([FIELD_VALUE_TYPES.DYNAMIC, FIELD_VALUE_TYPES.SYSTEM].includes(
            get(clonedMappedData, [...path, keyObject?.valueType], null),
          )) {
            const valueFieldType = get(clonedMappedData, [...path, keyObject?.valueDetails, ROW_COMPONENT_CONSTANTS.FIELD_TYPE], null);
            if ((valueFieldType === FIELD_TYPE.TABLE) || (isEmpty(valueFieldType))) {
              set(clonedMappedData, [...path, keyLabels?.childKey], []);
            }
            if (valueFieldType !== FIELD_TYPE.TABLE) {
              unset(clonedMappedData, [...path, keyLabels?.childKey], []);
            }
          }
          set(clonedMappedData, [...path, event.target.id], event.target.value);
          delete clonedErrorList?.[`${path.join(',')},${event.target.id}`];
          if (isEmpty(event?.target?.value)) {
            delete clonedErrorList?.[`${path.join(',')},dataListDetails,dataListUuid`];
          }
          break;
        default:
          set(clonedMappedData, [...path, event.target.id], event.target.value);
          break;
      }
      if ([MAPPING_COMPONENT_TYPES.SEND_DATA_TO_DL].includes(mappingComponent)) {
        if (
          (get(clonedMappedData, [...path, ROW_COMPONENT_CONSTANTS.FIELD_TYPE], null) === FIELD_TYPE.TABLE)
        ) {
          if (
            get(clonedMappedData, [...path, keyObject?.valueDetails, ROW_COMPONENT_CONSTANTS.FIELD_TYPE]) === FIELD_TYPE.TABLE
          ) {
            set(clonedMappedData, [...path, keyObject?.mappingType], SEND_DATA_TO_DL.TABLE_TO_TABLE_MAPPING);
          } else {
            set(clonedMappedData, [...path, keyObject?.value], null);
            set(clonedMappedData, [...path, keyObject?.valueDetails], {});
            set(clonedMappedData, [...path, keyObject?.mappingType], SEND_DATA_TO_DL.DIRECT_TO_TABLE_MAPPING);
          }
        } else {
          set(clonedMappedData, [...path, keyObject?.mappingType], SEND_DATA_TO_DL.DIRECT_TO_DIRECT_MAPPING);
        }
      }
      if ([FIELD_VALUE_TYPES.DYNAMIC, FIELD_VALUE_TYPES.SYSTEM, FIELD_VALUE_TYPES.ITERATIVE].includes(
        get(clonedMappedData, [...path, keyObject?.valueType], null))) {
        const fieldTYpeErrorList = checkForTypeMismatch(
          get(clonedMappedData, [...path], {}),
          path.join(','),
          keyObject,
          mappingComponent === MAPPING_COMPONENT_TYPES.SEND_DATA_TO_DL,
        );
        clonedErrorList = { ...cloneDeep(clonedErrorList || {}), ...fieldTYpeErrorList };
      }
    } else {
      switch (type) {
        case keyObject?.valueType:
          delete clonedErrorList?.[`${path.join(',')},${event.target.id}`];
          if (get(clonedMappedData, [...path, event.target.id], null) !== event.target.value) {
            set(clonedMappedData, [...path, event.target.id], event.target.value);
            set(clonedMappedData, [...path, keyObject?.value], null);
            set(clonedMappedData, [...path, keyObject?.valueDetails], {});
            delete clonedErrorList?.[`${path.join(',')},${keyObject?.value}`];
          }
          break;
        default:
          if (mappingVariant === FIELD_MAPPING_TABLE_TYPES.REQ_BODY_VALUE_MAPPING) {
            const isChild = path.includes(keyLabels?.childKey);

            if (isChild) {
              const parentPath = cloneDeep(path);
              (parentPath || []).splice(parentPath.length - 1, 1);
              if (clonedErrorList?.[`${parentPath.join()}`]) {
                delete clonedErrorList[`${parentPath.join()}`];
              }
            }
          }

          set(clonedMappedData, [...path, event.target.id], event.target.value);
          delete clonedErrorList?.[`${path.join(',')},${event.target.id}`];
          break;
      }
    }

    const dataTobeUpdated = {
      [errorListKey]: clonedErrorList,
      [mappingListKey]: clonedMappedData,
      [documentDetailsKey]: documentUrlDetails,
    };
    if (keyObject?.documentDetails === event.target.updateId) {
      dataTobeUpdated[documentDetailsKey] = documentDetails;
    }
    handleMappingChange(dataTobeUpdated);
  };

  const handleCheckboxChangeHandler = (event, path) => {
    const clonedMappedData = cloneDeep(mappedData);
    path = (path || []).split(',');

    set(clonedMappedData, [...path, event.target.id], !event.target.value);

    handleMappingChange({
      [mappingListKey]: clonedMappedData,
    });
  };

  const handleAddMore = (path, root_uuid = null, isDuplicateKeyError = false, duplicateKeyRow = null) => {
    const clonedMappedData = cloneDeep(mappedData);
    const clonedRow = cloneDeep(rowInitialData);
    clonedRow.path = path;
    const currentPath = (path || []).split(',');
    if ([
      MAPPING_COMPONENT_TYPES.CALL_INTEGRATION,
    ].includes(mappingComponent)) {
      clonedRow.key_uuid = uuidv4();
      if (root_uuid) {
        clonedRow.root_uuid = root_uuid;
      }
    }
    const isChild = path.includes(keyLabels?.childKey);
    const clonedErrorList = cloneDeep(errorList);

    if (isChild) {
      const parentPath = (path || []).split(',');
      (parentPath || []).splice(parentPath.length - 1, 1);
      if (clonedErrorList?.[`${parentPath.join()}`]) {
        delete clonedErrorList[`${parentPath.join()}`];
      }
    }

    if (isDuplicateKeyError) {
      delete clonedErrorList[duplicateKeyRow?.path];
    }

    set(
      clonedMappedData,
      currentPath,
      clonedRow,
    );
    handleMappingChange({
      [mappingListKey]: clonedMappedData,
      [errorListKey]: clonedErrorList,
    });
  };

  const onRemoveStaticFile = (rowTobeDeleted = {}) => {
    const { value } = rowTobeDeleted;
    const clonedDocs = cloneDeep(documentUrlDetails) || {};
    let docMetadata = cloneDeep(documentUrlDetails?.uploadedDocMetadata) || [];
    const removedDocs = cloneDeep(documentUrlDetails?.removedDocList) || [];

    value?.forEach((eachDocument) => {
      docMetadata = docMetadata?.filter((eachDoc) => eachDoc?.document_id !== eachDocument?.documentId);
      removedDocs.push(eachDocument?.documentId);
    });

    clonedDocs.uploadedDocMetadata = docMetadata;
    clonedDocs.removedDocList = removedDocs;

    return clonedDocs;
  };

  const handleRowDelete = (path, isDuplicateKeyError, duplicateKeyRow) => {
    const clonedMappedData = cloneDeep(mappedData);
    const clonedErrorList = cloneDeep(errorList);
    path = (path || []).split(',');

    const rowTobeDeleted = get(clonedMappedData, path, {});
    unset(rowTobeDeleted, keyLabels?.childKey);

    let removedList = set(clonedMappedData, path, {
      ...rowTobeDeleted,
      is_deleted: true,
    });

    const childRowPath = cloneDeep(path);
    childRowPath.pop();

    const childRows = get(clonedMappedData, childRowPath);
    const validRows = (childRows || []).filter((data) => !data.is_deleted);

    if (isEmpty(validRows)) {
      removedList = set(clonedMappedData, childRowPath, []);
    }

    if (isDuplicateKeyError) {
      delete clonedErrorList[duplicateKeyRow?.path];
    }

    const dataTobeUpdated = {
      [mappingListKey]: removedList,
      [errorListKey]: clonedErrorList,
      [documentDetailsKey]: documentUrlDetails,
    };

    if (rowTobeDeleted?.valueType === FIELD_VALUE_TYPES.STATIC && rowTobeDeleted?.fieldType === FIELD_TYPE.FILE_UPLOAD) {
      dataTobeUpdated[documentDetailsKey] = onRemoveStaticFile(rowTobeDeleted);
    }

    handleMappingChange(dataTobeUpdated);
  };

  const onChangeHandlers = ({
    event,
    type,
    path,
    root_uuid,
    isDuplicateKeyError,
    duplicateKeyRow,
  }) => {
    console.log('FieldMappingOnChange_event', keyObject, event, 'type', type, 'path', path, 'isDuplicateKeyError', isDuplicateKeyError, 'duplicateKeyRow', duplicateKeyRow);
    switch (type) {
      case keyObject?.key:
      case keyObject?.keyType:
      case keyObject?.value:
      case keyObject?.valueType:
      case keyObject?.updateType:
        console.log('fieldmappingOnChange1');
        return handleOnChangeHandler(
          event,
          path,
          isDuplicateKeyError,
          duplicateKeyRow,
          type,
        );
      case keyObject?.isMultiple:
        console.log('fieldmappingOnChange2');
        return handleCheckboxChangeHandler(
          event,
          path,
        );
      case keyLabels?.addKey:
        return handleAddMore(path, root_uuid, isDuplicateKeyError, duplicateKeyRow);
      case keyObject?.deleteRow:
        return handleRowDelete(path, isDuplicateKeyError, duplicateKeyRow);
      default:
        console.log('fieldmappingOnChange3');
        break;
    }
    return null;
  };

  return (
    <div>
      <InputTreeLayout
        key={key}
        tableHeaders={tableHeaders}
        innerTableClass={styles.InputTreeRow}
        headerRowClass={cx(styles.InputTreeHeaderRow)}
        headerStyles={
          headerStyles || [
            cx(styles.ValueTypeFlex, gClasses.FTwo13GrayV89),
            cx(styles.ValueFlex, gClasses.FTwo13GrayV89),
          ]
        }
        data={mappedData || []}
        errorList={errorList}
        RowComponent={currentRowComponent}
        keyLabels={{
          fieldDetailsKey: 'fieldDetails',
          tableUuidKey: 'fieldUuid',
          ...keyLabels,
        }}
        additionalRowComponentProps={{
          ...additionalRowComponentProps,
          systemFieldsList,
          fieldDetails: valueFields,
          iterativeFields,
          isValueFieldsLoading,
          isMappingFieldsLoading,
          isIterativeFieldsLoading,
          mappedData,
          mappingComponent,
          keyLabels,
          mappingListKey,
          parentId,
          mappingFields: mappingFields,
          mappingVariant,
        }}
        hideRootAdd={hideRootAdd}
        AddMoreIcon={() => <PlusIcon className={styles.Icon} />}
        addRowText="Add Row"
        depth={depth}
        maxDepth={maxDepth}
        parentDetails={{}}
        showAddMore={showAddMore}
        readOnlyView={readOnlyView}
        onChangeHandlers={onChangeHandlers}
      />
    </div>
  );
}

export default FieldMappingTable;
