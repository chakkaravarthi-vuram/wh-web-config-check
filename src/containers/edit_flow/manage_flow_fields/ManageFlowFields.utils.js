import { EButtonType, TableAlignOption, TableSortOrder } from '@workhall-pvt-lmt/wh-ui-library';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { setPointerEvent, updatePostLoader } from '../../../utils/UtilityFunctions';
import jsUtility, { cloneDeep, isEmpty, pick, translateFunction, unset } from '../../../utils/jsUtility';
import { FIELD_KEYS, FIELD_TYPES, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS, TAB_FIELD_DEFAULT_VALIDATIONS } from './ManageFlowFields.constants';
import { FIELD_LIST_OBJECT } from '../../form/sections/field_configuration/basic_configuration/BasicConfiguration.constants';
import { FIELD_LIST_TYPE } from '../../../utils/constants/form.constant';

export const CONFIG_BUTTON_ARRAY = (onSaveClickHandler, onCancelClickHandler, onMouseDown = null) => [
    {
        buttonText: 'Cancel',
        onButtonClick: onCancelClickHandler,
        buttonType: EButtonType.TERTIARY,
        buttonClassName: EMPTY_STRING,
    }, {
        buttonText: 'Save',
        onButtonClick: onSaveClickHandler,
        buttonType: EButtonType.PRIMARY,
        buttonClassName: EMPTY_STRING,
        onMouseDown: onMouseDown,
    },
];

export const basicFieldsValidationData = (stateDataParam = {}, isColFields = false) => {
    const stateData = jsUtility.cloneDeep(stateDataParam);
    console.log('anndandnnasandadddd', stateData);
    const fieldDetails = isColFields ? stateData?.columnDetails : stateData?.fieldDetails;

    const validationData = pick(fieldDetails, [
        RESPONSE_FIELD_KEYS.FIELD_NAME,
        RESPONSE_FIELD_KEYS.FIELD_TYPE,
        RESPONSE_FIELD_KEYS.COLUMNS,
    ]);
    if (fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] !== FIELD_TYPES.TABLE) {
        delete validationData[RESPONSE_FIELD_KEYS.COLUMNS];
    }
    if (fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DATA_LIST) {
        validationData[RESPONSE_FIELD_KEYS.DATA_LIST_UUID] = fieldDetails?.dataListDetails?.dataListUuid;
        validationData[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS] = jsUtility.compact(fieldDetails?.dataListDetails?.displayFields);
    }
    if (fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.RADIO_GROUP || FIELD_TYPES.DROPDOWN || FIELD_TYPES.CHECKBOX || FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN) {
        fieldDetails?.choiceValues?.forEach((eachChoiceDetail) => {
            delete eachChoiceDetail?.valueEdited;
        });
        validationData[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] = fieldDetails?.choiceValueType;
        let updateChoiceValues = [];
        if (fieldDetails?.choiceValueType === 'number') {
            fieldDetails?.choiceValues.forEach((eachChoice) => {
                updateChoiceValues.push({
                    label: eachChoice?.label,
                    value: eachChoice?.value.toString(),
                });
            });
        } else {
            updateChoiceValues = fieldDetails?.choiceValues;
        }
        validationData[RESPONSE_FIELD_KEYS.CHOICE_VALUES] = updateChoiceValues;
    }
    if (fieldDetails[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN) {
        jsUtility.set(validationData, [RESPONSE_FIELD_KEYS.VALUE_METADATA, RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_ID], fieldDetails?.customLookupId);
        delete validationData[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE];
    }
    console.log('amsnmansmnsamasmdasm', validationData);
    return validationData;
};

export const getFieldsListHeader = () => [
    {
        id: 'field_name',
        label: 'Field Name',
        widthWeight: 12,
        align: TableAlignOption.LEFT,
        isChangeIconColorOnHover: true,
        sortOrder: TableSortOrder.ASC,
        sortBy: 'label',
    },
    {
        id: 'field_type',
        label: 'Field Type',
        widthWeight: 13,
        align: TableAlignOption.LEFT,
        isChangeIconColorOnHover: true,
        sortOrder: TableSortOrder.ASC,
        sortBy: 'fieldTypeLabel',
    },
    {
        id: '2',
        widthWeight: 5,
        align: TableAlignOption.RIGHT,
        isChangeIconColorOnHover: true,
    },
];

export const updateLoaderStatus = (isLoading = false) => {
    setPointerEvent(isLoading);
    updatePostLoader(isLoading);
};

export const constructSinglePath = (idk, type) => `${idk}_${type}`;

const getFormattedChoiceValues = (choiceValues) => {
    const formattedChoiceDetails = [];
    choiceValues?.forEach((eachChoice) => {
        formattedChoiceDetails.push({
            label: eachChoice,
            value: eachChoice,
        });
    });
    return formattedChoiceDetails;
};

export const getFormattedFieldDetails = ({ allData, fieldDetails, columnDetails, t = translateFunction }) => {
    let formattedfieldDetails = {};
    const getDataListFieldLabel = (otherFieldDetails, displayFields) => {
        const currentDLFieldData = otherFieldDetails?.find((eachFieldDetail) => eachFieldDetail?.fieldUuid === displayFields);
        return currentDLFieldData?.label;
    };
    if (!isEmpty(columnDetails)) {
        formattedfieldDetails = {
            fieldName: columnDetails?.fieldName,
            label: columnDetails?.label || columnDetails?.fieldName,
            fieldTypeLabel: FIELD_LIST_OBJECT(t)?.[columnDetails?.fieldType],
            fieldType: columnDetails?.fieldType,
            choiceValues: columnDetails?.fieldType === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN ? getFormattedChoiceValues(columnDetails?.choiceValues) : columnDetails?.choiceValues,
            choiceValueType: columnDetails?.choiceValueType,
            customLookupName: columnDetails?.lookupName,
            fieldListType: FIELD_LIST_TYPE.TABLE,
            fieldUuid: columnDetails?.fieldUuid,
            _id: columnDetails?._id || columnDetails?.field_id,
            tableUuid: columnDetails?.tableUuid,
            referenceName: columnDetails?.referenceName,
            allowMultiple: columnDetails?.allowMultiple,
            allowDecimal: columnDetails?.allowDecimal,
            isDigitFormatted: columnDetails?.isDigitFormatted,
            dataListDetails: {
                dataListUuid: columnDetails?.dataListDetails?.dataListUuid,
                displayFields: columnDetails?.dataListDetails?.displayFields,
            },
            isNewField: false,
            isGlobalField: true,
            isSave: false,
            dataListUuidLabel: allData?.dataList?.dataListName,
            dataListFieldLabel: getDataListFieldLabel(allData?.otherFieldDetail, columnDetails?.dataListDetails?.displayFields?.[0]),
            addOnFieldLabel: getDataListFieldLabel(allData?.otherFieldDetail, columnDetails?.dataListDetails?.displayFields?.[1]),
            customLookupId: columnDetails?.valueMetadata?.customLookupId,
        };
    } else {
        formattedfieldDetails = {
            fieldName: fieldDetails?.fieldName,
            label: fieldDetails?.label,
            fieldType: fieldDetails?.fieldType,
            fieldTypeLabel: FIELD_LIST_OBJECT(t)?.[fieldDetails?.fieldType],
            choiceValues: fieldDetails?.fieldType === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN ? getFormattedChoiceValues(fieldDetails?.choiceValues) : fieldDetails?.choiceValues,
            choiceValueType: fieldDetails?.choiceValueType,
            customLookupName: fieldDetails?.lookupName,
            fieldUuid: fieldDetails?.fieldUuid,
            _id: fieldDetails?._id || fieldDetails?.field_id,
            fieldListType: fieldDetails?.fieldListType,
            referenceName: fieldDetails?.referenceName,
            allowMultiple: fieldDetails?.allowMultiple,
            allowDecimal: fieldDetails?.allowDecimal,
            isDigitFormatted: fieldDetails?.isDigitFormatted,
            dataListDetails: {
                dataListUuid: fieldDetails?.dataListDetails?.dataListUuid,
                displayFields: fieldDetails?.dataListDetails?.displayFields,
            },
            isNewField: false,
            isGlobalField: true,
            isSave: false,
            dataListUuidLabel: allData?.dataList?.dataListName,
            dataListFieldLabel: getDataListFieldLabel(allData?.otherFieldDetail, fieldDetails?.dataListDetails?.displayFields?.[0]),
            addOnFieldLabel: getDataListFieldLabel(allData?.otherFieldDetail, fieldDetails?.dataListDetails?.displayFields?.[1]),
            customLookupId: fieldDetails?.valueMetadata?.customLookupId,
        };
    }
    return formattedfieldDetails;
};

export const formatGetFieldsAPIResponse = (response, t) => {
    const fieldsList = [];
    if (!jsUtility.isEmpty(response)) {
        const responseFieldData = response?.paginationData;
        if (!jsUtility.isEmpty(responseFieldData)) {
            responseFieldData.forEach((fields) => {
                if (fields?.fieldListType === FIELD_LIST_TYPE.DIRECT) {
                    if (fields?.fieldType !== FIELD_LIST_TYPE.TABLE) {
                        fieldsList.push(getFormattedFieldDetails({ fieldDetails: fields, t }));
                    } else if (fields?.fieldType === FIELD_TYPES.TABLE) {
                        const columns = [];
                        const tableColData = responseFieldData.filter((fieldData) => fieldData?.tableUuid === fields?.fieldUuid);
                        tableColData.forEach((col) => {
                            columns.push(getFormattedFieldDetails({ fieldDetails: fields, columnDetails: col, t }));
                        });
                        fieldsList.push({ ...getFormattedFieldDetails({ fieldDetails: fields, t }), columns });
                    }
                }
            });
        }
    }
    return fieldsList;
};

export const getFormattedDataListsResponse = (response) => {
    if (!jsUtility.isEmpty(response)) {
        if (!jsUtility.isEmpty(response)) {
            return response.map((eachDataList) => {
                return {
                    label: eachDataList?.data_list_name,
                    value: eachDataList?.data_list_uuid,
                };
            });
        }
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

export const deleteErrorListWithId = (errorList, idsTobeDeleted = []) => {
    const clonedErrorList = cloneDeep(errorList);

    idsTobeDeleted?.forEach((id) => unset(clonedErrorList, id));

    return clonedErrorList;
};

export const constructFlowFieldsPostData = (stateParam, isTableColPostData = false, flowId, isDocumentGeneration = false) => {
    let fieldTypeKey = FIELD_KEYS.FIELD_DETAILS;
    const stateData = cloneDeep(stateParam);
    if (isTableColPostData) {
        fieldTypeKey = FIELD_KEYS.COLUMN_DETAILS;
    }
    const fieldDetails = stateData?.[fieldTypeKey];
    const postData = {};
    jsUtility.set(postData,
        [REQUEST_FIELD_KEYS.FIELD_NAME],
        fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_NAME],
    );
    if (isDocumentGeneration) {
        jsUtility.set(postData,
            [REQUEST_FIELD_KEYS.FIELD_TYPE],
            FIELD_TYPES.FILE_UPLOAD,
        );
    } else {
        jsUtility.set(postData,
            [REQUEST_FIELD_KEYS.FIELD_TYPE],
            fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE],
        );
    }

    if (fieldDetails?.fieldType === FIELD_TYPES.TABLE) {
        jsUtility.set(postData,
            [REQUEST_FIELD_KEYS.VALIDATIONS],
            TAB_FIELD_DEFAULT_VALIDATIONS,
        );
    }

    jsUtility.set(postData,
        [REQUEST_FIELD_KEYS.FIELD_LIST_TYPE],
        fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPE],
    );

    jsUtility.set(postData,
        [REQUEST_FIELD_KEYS.IS_GLOBAL_FIELD],
        fieldDetails?.[RESPONSE_FIELD_KEYS.IS_GLOBAL_FIELD],
    );

    jsUtility.set(postData,
        [REQUEST_FIELD_KEYS.FLOW_ID],
        flowId,
    );

    jsUtility.set(postData,
        [REQUEST_FIELD_KEYS.IS_SAVE],
        fieldDetails?.[RESPONSE_FIELD_KEYS.IS_SAVE],
    );

    if ((fieldDetails?.[RESPONSE_FIELD_KEYS.EDIT_REFERENCE_NAME]) &&
        (fieldDetails?.[RESPONSE_FIELD_KEYS.REFERENCE_NAME] !== fieldDetails?.[RESPONSE_FIELD_KEYS.TEMPORARY_REFERENCE_NAME])) {
        jsUtility.set(postData,
            [REQUEST_FIELD_KEYS.REFERENCE_NAME],
            fieldDetails?.[RESPONSE_FIELD_KEYS.TEMPORARY_REFERENCE_NAME],
        );
    }

    if (fieldDetails?.tableUuid) {
        jsUtility.set(postData,
            [REQUEST_FIELD_KEYS.TABLE_UUID],
            fieldDetails?.[RESPONSE_FIELD_KEYS.TABLE_UUID],
        );
    }

    if (fieldDetails?.fieldUuid) {
        jsUtility.set(postData,
            [REQUEST_FIELD_KEYS.FIELD_UUID],
            fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
        );
    }

    if (fieldDetails?._id) {
        jsUtility.set(postData,
            [REQUEST_FIELD_KEYS.ID],
            fieldDetails?.[RESPONSE_FIELD_KEYS.ID],
        );
    }

    if (fieldDetails?.choiceValues && [FIELD_TYPES.DROPDOWN, FIELD_TYPES.CHECKBOX, FIELD_TYPES.RADIO_GROUP].includes(fieldDetails?.fieldType)) {
        let currentChoiceValues = fieldDetails?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES];
        currentChoiceValues = currentChoiceValues?.map((eachChoice) => {
            return {
                label: eachChoice?.label,
                value: fieldDetails?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE] === 'number' ? Number(eachChoice?.value) : eachChoice?.value,
            };
        });
        jsUtility.set(postData,
            [REQUEST_FIELD_KEYS.CHOICE_VALUES],
            currentChoiceValues,
        );
        if (fieldDetails?.choiceValueType) {
            jsUtility.set(postData,
                [REQUEST_FIELD_KEYS.CHOICE_VALUE_TYPE],
                fieldDetails?.[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE],
            );
        }
    }

    if (fieldDetails?.fieldType === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN) {
        jsUtility.set(postData,
            [REQUEST_FIELD_KEYS.VALUE_METADATA, REQUEST_FIELD_KEYS.CUSTOM_LOOKUP_ID],
            fieldDetails?.[RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_ID],
        );
    }

    if (fieldDetails?.fieldType === FIELD_TYPES.NUMBER) {
        jsUtility.set(postData,
            [REQUEST_FIELD_KEYS.IS_DIGIT_FORMATTED],
            fieldDetails?.[RESPONSE_FIELD_KEYS.IS_DIGIT_FORMATTED],
        );
        jsUtility.set(postData,
            [REQUEST_FIELD_KEYS.ALLOW_DECIMAL],
            fieldDetails?.[RESPONSE_FIELD_KEYS.ALLOW_DECIMAL],
        );
    }

    if (fieldDetails?.fieldType === FIELD_TYPES.LINK || fieldDetails?.fieldType === FIELD_TYPES.FILE_UPLOAD || fieldDetails?.fieldType === FIELD_TYPES.USER_TEAM_PICKER || fieldDetails?.fieldType === FIELD_TYPES.DATA_LIST) {
        jsUtility.set(postData,
            [REQUEST_FIELD_KEYS.ALLOW_MULTIPLE],
            fieldDetails?.[RESPONSE_FIELD_KEYS.ALLOW_MULTIPLE],
        );
    }

    if (fieldDetails?.tableUuid) {
        jsUtility.set(postData,
            [REQUEST_FIELD_KEYS.TABLE_UUID],
            fieldDetails?.[RESPONSE_FIELD_KEYS.TABLE_UUID],
        );
    }

    if (fieldDetails?.fieldType === FIELD_TYPES.DATA_LIST) {
        if (fieldDetails?.dataListDetails?.dataListUuid) {
            jsUtility.set(postData,
                [REQUEST_FIELD_KEYS.DATA_LIST_DETAILS, REQUEST_FIELD_KEYS.DATA_LIST_UUID],
                fieldDetails?.[RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS][RESPONSE_FIELD_KEYS.DATA_LIST_UUID],
            );
        }
        if (!jsUtility.isEmpty(fieldDetails?.dataListDetails?.displayFields)) {
            const filteredDisplayFields = fieldDetails?.dataListDetails?.displayFields?.filter((fieldUuid) => !jsUtility.isEmpty(fieldUuid));
            jsUtility.set(postData,
                [REQUEST_FIELD_KEYS.DATA_LIST_DETAILS, REQUEST_FIELD_KEYS.DISPLAY_FIELDS],
                filteredDisplayFields,
            );
        }
    }
    console.log('postdataformff', postData);
    return postData;
};
