import { FIELD_LIST_KEYS, FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { formatValidationData } from '../../../../../utils/formUtils';
import jsUtility, { cloneDeep, pick, unset, set, isEmpty, translateFunction } from '../../../../../utils/jsUtility';
import { normalizer } from '../../../../../utils/normalizer.utils';
import { DOCUMENT_TYPES } from '../../../../../utils/strings/CommonStrings';
import { constructStaticValues } from '../../../node_configuration/NodeConfiguration.utils';
import { getStaticValue } from '../../StepConfiguration.utils';
import { FIELD_VALUE_TYPES } from '../row_components/RowComponents.constants';
import { REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS, SEND_DATA_TO_DL_CONSTANTS, TABLE_ROW_UPDATE_TYPE, UPDATE_DATA_LIST_OPERATIONS } from './SendDataToDl.constants';
import { SEND_DATA_TO_DL_CONFIG_CONSTANTS } from './SendDataToDl.string';

export const getFormattedDataListsResponse = (response) => {
    if (!jsUtility.isEmpty(response)) {
        return response.map((eachDataList) => {
            return {
                label: eachDataList?.data_list_name,
                value: eachDataList?.data_list_uuid,
            };
        });
    }
    return [];
};

export const getFormattedDataListsFieldsResponse = (response) => {
    if (!jsUtility.isEmpty(response)) {
        if (!jsUtility.isEmpty(response)) {
            return response.map((eachDataListField) => {
                return {
                    label: eachDataListField?.label,
                    value: eachDataListField?.field_uuid,
                };
            });
        }
    }
    return [];
};

const constructMappingValidationData = (mappingData = []) => {
    const dataListMapping = [];
    mappingData?.forEach((eachMappingRow) => {
        const validateData = cloneDeep(eachMappingRow);
        if (eachMappingRow?.valueType === FIELD_VALUE_TYPES.STATIC) {
            validateData.value = formatValidationData(
                eachMappingRow?.value,
                eachMappingRow?.fieldType,
            );
        } else if (eachMappingRow?.fieldType === FIELD_TYPE.TABLE) {
            validateData.tableColumnMapping = constructMappingValidationData(eachMappingRow.tableColumnMapping);
        }
        dataListMapping.push(validateData);
    });
    if (!isEmpty(dataListMapping)) return dataListMapping;
    return [];
};

export const getSendDataToDlValidateData = (stateDataParam = {}, t, isAddOnConfig) => {
    const stateData = cloneDeep(stateDataParam);
    console.log('asjajajshhasd', stateData);
    const validationData = pick(stateData, [
        RESPONSE_FIELD_KEYS.FLOW_ID,
        RESPONSE_FIELD_KEYS.STEP_NAME,
        RESPONSE_FIELD_KEYS.STEP_STATUS,
        RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING,
        RESPONSE_FIELD_KEYS.STEP_ID,
        RESPONSE_FIELD_KEYS.STEP_UUID,
        RESPONSE_FIELD_KEYS.SEND_DATA_DL_ACTIONS,
        RESPONSE_FIELD_KEYS.SELECTED_ACTION_LABELS,
    ]);

    validationData[RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING][RESPONSE_FIELD_KEYS.MAPPING] = constructMappingValidationData(stateData?.[RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING]?.[RESPONSE_FIELD_KEYS.MAPPING]);

    if (isAddOnConfig) {
        validationData.dataListMapping[RESPONSE_FIELD_KEYS.ACTION_UUID] = stateData?.sendDataToDlActions?.actionUuid;
    }

    if (validationData?.dataListMapping?.[RESPONSE_FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE] === SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).ID.CREATE_MULTIPLE_NEW_ENTRY) {
        validationData.dataListMapping[RESPONSE_FIELD_KEYS.TABLE_UUID] = stateData.dataListMapping[RESPONSE_FIELD_KEYS.TABLE_UUID];
    }
    if (validationData.dataListMapping?.[RESPONSE_FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE] === SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).ID.UPDATE_ENTRIES || stateData[RESPONSE_FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE] === SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).ID.DELETE_ENTRIES) {
        validationData.dataListMapping[RESPONSE_FIELD_KEYS.PICKER_FIELD_UUID] = stateData.dataListMapping[RESPONSE_FIELD_KEYS.PICKER_FIELD_UUID];
    }
    if (validationData?.dataListMapping?.saveResponse) {
        validationData.dataListMapping[RESPONSE_FIELD_KEYS.SAVE_RESPONSE_FIELD] = stateData.dataListMapping[RESPONSE_FIELD_KEYS.SAVE_RESPONSE_FIELD];
    }
    if (validationData?._id) {
        validationData[RESPONSE_FIELD_KEYS.ID] = stateData[RESPONSE_FIELD_KEYS.ID];
    }

    unset(validationData, [RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING, RESPONSE_FIELD_KEYS.DATA_LIST_UUID_LABEL]);
    unset(validationData, [RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING, RESPONSE_FIELD_KEYS.TABLE_FIELD_UUID_LABEL]);
    unset(validationData, [RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING, RESPONSE_FIELD_KEYS.TABLE_FIELD_UUID_TYPE]);
    unset(validationData, [RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING, RESPONSE_FIELD_KEYS.SAVE_RESPONSE_FIELD_LABEL]);
    unset(validationData, [RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING, RESPONSE_FIELD_KEYS.PICKER_FIELD_UUID_LABEL]);
    unset(validationData, [RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING, RESPONSE_FIELD_KEYS.DATA_LIST_ID]);
    unset(validationData, [RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING, RESPONSE_FIELD_KEYS.DATA_LIST_NAME]);
    unset(validationData, [RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING, RESPONSE_FIELD_KEYS.MAPPING_SERVER_DATA]);
    unset(validationData, [RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING, RESPONSE_FIELD_KEYS.DL_ENTRY_ACTION_TYPE_LABEL]);
    unset(validationData, [RESPONSE_FIELD_KEYS.SELECTED_ACTION_LABELS]);
    unset(validationData, [RESPONSE_FIELD_KEYS.SEND_DATA_DL_ACTIONS]);
    if (!isAddOnConfig) {
        unset(validationData, [RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING, RESPONSE_FIELD_KEYS.ACTION_UUID]);
    }

    console.log('kmkjajkdjkasd', validationData, stateDataParam);
    return validationData;
};

const getTableColumnMapping = (tableColumnMapping = []) => {
    const tableColumnData = jsUtility.cloneDeep(tableColumnMapping);
    if (jsUtility.isEmpty(tableColumnData)) {
        return [];
    } else {
        const columnMappingData = [];
        tableColumnData?.forEach((currentColumnData, index) => {
            if (!currentColumnData?.is_deleted) {
                const updatedData = {
                    [REQUEST_FIELD_KEYS.DATA_LIST_FIELD_UUID]: currentColumnData?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
                    [REQUEST_FIELD_KEYS.VALUE_TYPE]: currentColumnData?.[RESPONSE_FIELD_KEYS.VALUE_TYPE],
                    [REQUEST_FIELD_KEYS.VALUE]: currentColumnData?.[RESPONSE_FIELD_KEYS.VALUE],
                    [REQUEST_FIELD_KEYS.MAPPING_ORDER]: index + 1,
                    [REQUEST_FIELD_KEYS.OPERATION]: currentColumnData?.operation || UPDATE_DATA_LIST_OPERATIONS.EQUAL_TO,
                    [REQUEST_FIELD_KEYS.UPDATE_TYPE]: TABLE_ROW_UPDATE_TYPE.ADD_NEW_ROW,
                };

                if (currentColumnData?.valueType === FIELD_VALUE_TYPES.STATIC) {
                    updatedData[REQUEST_FIELD_KEYS.VALUE] = getStaticValue(currentColumnData.value, currentColumnData?.fieldType, {
                        isParseNumber: true,
                    });
                }

                columnMappingData.push(updatedData);
            }
        });
        return columnMappingData;
    }
};

const getPostDataMapping = (mapping = {}) => {
    const mappingStateData = jsUtility.cloneDeep(mapping);
    console.log('lkkadsajdjasdja', mappingStateData);
    const mappingPostData = [];
    mappingStateData?.forEach((currentMappingData, index) => {
        if (!currentMappingData?.is_deleted) {
            let mappingPostDataKeys = {};
            mappingPostDataKeys = {
                [REQUEST_FIELD_KEYS.MAPPING_TYPE]: currentMappingData?.mappingType,
                [REQUEST_FIELD_KEYS.FLOW_TABLE_UUID]: currentMappingData?.value,
                [REQUEST_FIELD_KEYS.DATA_LIST_TABLE_UUID]: currentMappingData?.fieldUuid,
                [REQUEST_FIELD_KEYS.TABLE_COLUMN_MAPPING]: getTableColumnMapping(currentMappingData?.tableColumnMapping),
            };

            if (currentMappingData?.mappingType === SEND_DATA_TO_DL_CONSTANTS.DIRECT_TO_TABLE_MAPPING_TYPE) {
                delete mappingPostDataKeys?.[REQUEST_FIELD_KEYS.FLOW_TABLE_UUID];
            }

            if (currentMappingData?.mappingType === SEND_DATA_TO_DL_CONSTANTS.DIRECT_MAPPING_TYPE) {
                mappingPostDataKeys = {
                    ...mappingPostDataKeys,
                    [REQUEST_FIELD_KEYS.VALUE_TYPE]: currentMappingData?.valueType,
                    [REQUEST_FIELD_KEYS.DATA_LIST_FIELD_UUID]: currentMappingData?.fieldUuid,
                    [REQUEST_FIELD_KEYS.OPERATION]: currentMappingData?.operation || UPDATE_DATA_LIST_OPERATIONS.EQUAL_TO,
                    [REQUEST_FIELD_KEYS.MAPPING_ORDER]: index + 1,
                    [REQUEST_FIELD_KEYS.VALUE]: currentMappingData?.value,
                };

                if (currentMappingData?.valueType === FIELD_VALUE_TYPES.STATIC) {
                    mappingPostDataKeys[REQUEST_FIELD_KEYS.VALUE] = getStaticValue(currentMappingData.value, currentMappingData?.fieldType, {
                        isParseNumber: true,
                    });
                }
                delete mappingPostDataKeys?.[REQUEST_FIELD_KEYS.FLOW_TABLE_UUID];
                delete mappingPostDataKeys?.[REQUEST_FIELD_KEYS.DATA_LIST_TABLE_UUID];
            }

            if (jsUtility.isEmpty(currentMappingData?.tableColumnMapping || currentMappingData[REQUEST_FIELD_KEYS.MAPPING_TYPE] !== SEND_DATA_TO_DL_CONSTANTS.DIRECT_MAPPING_TYPE)) {
                delete mappingPostDataKeys?.[REQUEST_FIELD_KEYS.TABLE_COLUMN_MAPPING];
            }
            mappingPostData.push(mappingPostDataKeys);
        }
    });
    return mappingPostData;
};

export const formatTableAndColumnDetails = (allFields, childKey) => {
    const formattedFieldDetails = [];

    allFields?.forEach((eachField) => {
        if (eachField?.fieldType === FIELD_TYPE.TABLE) {
            const columns = allFields?.filter((eachFieldDetail) => eachFieldDetail?.tableUuid === eachField?.fieldUuid);
            formattedFieldDetails.push({ ...eachField, [childKey]: columns });
        } else {
            if (eachField?.fieldListType !== FIELD_TYPE.TABLE) {
                formattedFieldDetails.push(eachField);
            }
        }
    });
    console.log('allFields', allFields, 'formattedFieldDetails', formattedFieldDetails);
    return formattedFieldDetails;
};

const formatMappingData = (mappingList, { fieldDetails, documentUrlDetails, flowId, _id }) => {
    const serverMappingData = [];
    mappingList?.forEach((mappingData) => {
        if (!isEmpty(mappingData?.dataListTableUuid)) {
            const data = {
                dataListFieldUuid: mappingData.dataListTableUuid,
                mappingType: mappingData.mappingType,
                updateType: 'add_new_row',
                valueType: FIELD_VALUE_TYPES.DYNAMIC,
                operation: UPDATE_DATA_LIST_OPERATIONS.EQUAL_TO,
                tableColumnMapping: (mappingData?.tableColumnMapping || []).map((tableCol) => {
                    tableCol.mappingType = SEND_DATA_TO_DL_CONSTANTS.DIRECT_MAPPING_TYPE;
                    if (tableCol?.valueType === FIELD_VALUE_TYPES.STATIC) {
                        const selectedChildField = fieldDetails?.find((eachField) => eachField?.fieldUuid === tableCol?.dataListFieldUuid);
                        tableCol.value = constructStaticValues(tableCol.value, selectedChildField?.fieldType, documentUrlDetails, flowId, _id, DOCUMENT_TYPES.SEND_DATA_TO_DL_DOCUMENTS, { isParseNumber: true });
                    }
                    return tableCol;
                }),
            };
            if (mappingData?.flowTableUuid) {
                data.value = mappingData.flowTableUuid;
            }
            serverMappingData.push(data);
        } else {
            if (mappingData?.valueType === FIELD_VALUE_TYPES.STATIC) {
                const selectedChildField = fieldDetails?.find((eachField) => eachField?.fieldUuid === mappingData?.dataListFieldUuid);
                mappingData.value = constructStaticValues(mappingData.value, selectedChildField?.fieldType, documentUrlDetails, flowId, _id, DOCUMENT_TYPES.SEND_DATA_TO_DL_DOCUMENTS, { isParseNumber: true });
            }
            serverMappingData.push(mappingData);
        }
    });
    return serverMappingData;
};

export const constructSendDataToDlStateData = (stateParam, isAddOnConfig, metaData, actions, t = translateFunction) => {
    const stateDataParam = jsUtility.cloneDeep(stateParam);
    console.log('statedataparam', stateDataParam, metaData, isAddOnConfig, actions);
    const stateData = normalizer(
        stateDataParam,
        REQUEST_FIELD_KEYS,
        RESPONSE_FIELD_KEYS,
    );
    try {
        stateData.dataListMapping = isAddOnConfig ? stateData?.flowStep?.dataListMapping : stateData?.dataListMapping?.[0] || {};
        if (isAddOnConfig) {
            stateData.stepUuid = stateData?.flowStep?.stepUuid;
            stateData.flowId = stateData?.flowStep?.flowId;
            stateData.fieldDetails = stateData?.fieldMetadata;
            stateData.stepId = stateData?.flowStep?._id;
            stateData.dataListMapping.mappingUuid = stateData?.flowStep?.dataListMapping?.mappingUuid;
            stateData.dataListMapping.mapping = stateData?.flowStep?.dataListMapping?.mapping;
            stateData.sendDataToDlActions = { actionUuid: stateData?.dataListMapping?.actionUuid };
            stateData.dataListMapping.mappingServerData = formatMappingData(cloneDeep(stateData?.flowStep?.dataListMapping?.mapping), { documentUrlDetails: stateData?.document_url_details, fieldDetails: stateData?.fieldMetadata, flowId: stateData?.flowId, _id: stateData?._id });
            stateData.dataListMapping.mapping = [];

            const selectedLabels = [];
            stateData.dataListMapping?.actionUuid?.forEach((action) => {
                const labels = actions?.find((eachAction) => eachAction?.value === action);
                selectedLabels.push(labels?.label);
            });
            stateData.selectedActionLabels = selectedLabels;

            const pickerFieldDetails = stateData?.fieldMetadata?.find((eachFieldDetails) => eachFieldDetails.fieldUuid === stateData?.flowStep?.dataListMapping?.pickerFieldUuid);
            const tableFieldDetails = stateData?.fieldMetadata?.find((eachFieldDetails) => eachFieldDetails.fieldUuid === stateData?.flowStep?.dataListMapping?.tableUuid);
            const saveResponseFieldDetails = stateData?.fieldMetadata?.find((eachFieldDetails) => eachFieldDetails.fieldUuid === stateData?.flowStep?.dataListMapping?.saveResponseField);

            if (stateData?.dataListMapping?.isSystemDefined && stateData?.dataListMapping?.systemDefinedName === FIELD_LIST_KEYS.USERS) {
                stateData.isSystemDefined = true;
            }

            stateData.dataListMapping.pickerFieldUuidLabel = pickerFieldDetails?.fieldName;
            stateData.dataListMapping.tableFieldUuidLabel = tableFieldDetails?.fieldName;
            stateData.dataListMapping.tableFieldUuidType = tableFieldDetails?.fieldType;
            stateData.dataListMapping.saveResponseFieldLabel = saveResponseFieldDetails?.fieldName;
        } else {
            stateData.dataListMapping.mappingServerData = formatMappingData(cloneDeep(stateData?.dataListMapping?.mapping), { documentUrlDetails: stateData?.document_url_details, fieldDetails: stateData?.fieldDetails, flowId: stateData?.flowId, _id: stateData?._id });
            stateData.dataListMapping.mapping = [];

            const tableFieldDetails = stateData?.fieldDetails?.find((eachFieldDetails) => eachFieldDetails.fieldUuid === stateData?.dataListMapping?.tableUuid);

            const pickerFieldDetails = stateData?.fieldDetails?.find((eachFieldDetails) => eachFieldDetails.fieldUuid === stateData?.dataListMapping?.pickerFieldUuid);

            const saveResponseFieldDetails = stateData?.fieldDetails?.find((eachFieldDetails) => eachFieldDetails.fieldUuid === stateData?.dataListMapping?.saveResponseField);

            if (stateData?.dataListMapping?.isSystemDefined && stateData?.dataListMapping?.systemDefinedName === FIELD_LIST_KEYS.USERS) {
                stateData.isSystemDefined = true;
            }

            stateData.dataListMapping.tableFieldUuidLabel = tableFieldDetails?.fieldName;
            stateData.dataListMapping.pickerFieldUuidLabel = pickerFieldDetails?.fieldName;
            stateData.dataListMapping.tableFieldUuidType = tableFieldDetails?.fieldType;
            stateData.dataListMapping.saveResponseFieldLabel = saveResponseFieldDetails?.fieldName;
        }
        const dlActionTypeLabel = SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).GENERAL.UPDATE_TYPE_OPTIONS.find((eachActionType) => eachActionType?.value === stateData?.dataListMapping?.dataListEntryActionType);
        stateData.dataListMapping.dlEntryActionTypeLabel = dlActionTypeLabel?.label;

        stateData.dataListMapping.dataListUuidLabel = stateData?.dataListMapping?.dataListName;
        unset(stateData, 'document_url_details');
        console.log('statedataparam1', stateData);
    } catch (e) {
        console.log('dsfjgsjgjshgfjsdgf', e);
    }
    return stateData;
};

export const constructSendDataToDlPostData = (stateParam, isAddOnConfig, t = translateFunction) => {
    const stateData = jsUtility.cloneDeep(stateParam);
    console.log('andajka', stateData, isAddOnConfig);
    const postData = {};
    jsUtility.set(
        postData,
        [REQUEST_FIELD_KEYS.FLOW_ID],
        stateData?.[RESPONSE_FIELD_KEYS.FLOW_ID],
    );
    if (!isAddOnConfig) {
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.STEP_TYPE],
            stateData?.[RESPONSE_FIELD_KEYS.STEP_TYPE],
        );
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.STEP_NAME],
            stateData?.[RESPONSE_FIELD_KEYS.STEP_NAME],
        );
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.STEP_STATUS],
            stateData?.[RESPONSE_FIELD_KEYS.STEP_STATUS],
        );
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.STEP_ORDER],
            stateData?.[RESPONSE_FIELD_KEYS.STEP_ORDER],
        );
    } else {
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.DATA_LIST_MAPPING, REQUEST_FIELD_KEYS.ACTION_UUID],
            stateData?.sendDataToDlActions?.actionUuid,
        );
    }
    if (!jsUtility.isEmpty(stateData?.dataListMapping?.dataListId)) {
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.DATA_LIST_MAPPING, REQUEST_FIELD_KEYS.DATA_LIST_ID],
            stateData?.sendDataToDlActions?.dataListId,
        );
    }
    jsUtility.set(
        postData,
        [REQUEST_FIELD_KEYS.STEP_UUID],
        stateData?.[RESPONSE_FIELD_KEYS.STEP_UUID],
    );
    jsUtility.set(
        postData,
        [REQUEST_FIELD_KEYS.ID],
        stateData?.[RESPONSE_FIELD_KEYS.STEP_ID],
    );

    if (stateData?._id) {
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.ID],
            stateData?.[RESPONSE_FIELD_KEYS.ID],
        );
    }

    jsUtility.set(
        postData,
        [REQUEST_FIELD_KEYS.DATA_LIST_MAPPING, REQUEST_FIELD_KEYS.DATA_LIST_UUID],
        stateData?.[RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING][RESPONSE_FIELD_KEYS.DATA_LIST_UUID],
    );
    jsUtility.set(
        postData,
        [REQUEST_FIELD_KEYS.DATA_LIST_MAPPING, REQUEST_FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE],
        stateData?.[RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING][RESPONSE_FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE],
    );
    if (stateData?.dataListMapping?.pickerFieldUuid) {
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.DATA_LIST_MAPPING, REQUEST_FIELD_KEYS.PICKER_FIELD_UUID],
            stateData?.[RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING][RESPONSE_FIELD_KEYS.PICKER_FIELD_UUID],
        );
    }
    if (stateData?.dataListMapping?.tableUuid) {
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.DATA_LIST_MAPPING, REQUEST_FIELD_KEYS.TABLE_UUID],
            stateData?.[RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING][RESPONSE_FIELD_KEYS.TABLE_UUID],
        );
    }
    if (stateData?.dataListMapping?.dataListEntryActionType === SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).ID.CREATE_MULTIPLE_NEW_ENTRY || stateData?.dataListMapping?.dataListEntryActionType === SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).ID.CREATE_NEW_ENTRY) {
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.DATA_LIST_MAPPING, REQUEST_FIELD_KEYS.IS_AUTO_UPDATE],
            stateData?.[RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING][RESPONSE_FIELD_KEYS.IS_AUTO_UPDATE],
        );
    }
    if (!jsUtility.isEmpty(stateData?.dataListMapping?.mappingUuid)) {
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.DATA_LIST_MAPPING, REQUEST_FIELD_KEYS.MAPPING_UUID],
            stateData?.[RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING][RESPONSE_FIELD_KEYS.MAPPING_UUID],
        );
    }
    jsUtility.set(
        postData,
        [REQUEST_FIELD_KEYS.DATA_LIST_MAPPING, REQUEST_FIELD_KEYS.SAVE_RESPONSE],
        stateData?.[RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING][RESPONSE_FIELD_KEYS.SAVE_RESPONSE],
    );

    if (stateData?.dataListMapping?.saveResponse) {
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.DATA_LIST_MAPPING, REQUEST_FIELD_KEYS.SAVE_RESPONSE_FIELD],
            stateData?.[RESPONSE_FIELD_KEYS.DATA_LIST_MAPPING][RESPONSE_FIELD_KEYS.SAVE_RESPONSE_FIELD],
        );
    }

    const mappingResult = getPostDataMapping(stateData?.dataListMapping?.mapping);
    if (!jsUtility.isEmpty(mappingResult)) {
        jsUtility.set(
            postData,
            [REQUEST_FIELD_KEYS.DATA_LIST_MAPPING, REQUEST_FIELD_KEYS.MAPPING],
            mappingResult,
        );
    }

    // jsUtility.set(
    //     postData,
    //     [REQUEST_FIELD_KEYS.CONNECTED_STEPS],
    //     stateData?.[RESPONSE_FIELD_KEYS.CONNECTED_STEPS],
    // );

    if (!isAddOnConfig) {
        postData[REQUEST_FIELD_KEYS.DATA_LIST_MAPPING] = [postData[REQUEST_FIELD_KEYS.DATA_LIST_MAPPING]];
    }

    if (!isEmpty(stateData?.documentUrlDetails?.uploadedDocMetadata)) {
        postData.document_details = {
            ...stateData?.documentUrlDetails,
            uploaded_doc_metadata: [
                ...stateData.documentUrlDetails.uploadedDocMetadata,
            ],
        };

        delete postData?.document_details?.uploadedDocMetadata;
        delete postData?.document_details?.removedDocList;
    }

    if (!isEmpty(stateData?.documentUrlDetails?.removedDocList)) {
        set(postData, [REQUEST_FIELD_KEYS.DOCUMENT_DETAILS, REQUEST_FIELD_KEYS.REMOVED_DOC_LIST], stateData?.documentUrlDetails?.removedDocList);
    }

    console.log('ksjahsasahasdashdsa', postData);
    return postData;
};

export const deleteErrorListWithId = (errorList, idsTobeDeleted = []) => {
    const clonedErrorList = cloneDeep(errorList);
    idsTobeDeleted?.forEach((id) => unset(clonedErrorList, id));
    return clonedErrorList;
};
