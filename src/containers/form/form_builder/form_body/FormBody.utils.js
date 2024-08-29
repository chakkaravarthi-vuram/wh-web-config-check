import { unset } from 'lodash';
import { removeFieldAndDocIds } from '../../../../components/information_widget/InformationWidget.utils';
import { FIELD_LIST_TYPE, PROPERTY_PICKER_ARRAY } from '../../../../utils/constants/form.constant';
import { REQUEST_FIELD_KEYS, REQUEST_VALIDATION_KEYS, RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../utils/constants/form/form.constant';
import { cloneDeep, has, isBoolean, isEmpty, isFiniteNumber, translateFunction, findLastIndex, uniq } from '../../../../utils/jsUtility';
import { normalizer } from '../../../../utils/normalizer.utils';
import { COMMA, EMPTY_STRING, UNDERSCORE } from '../../../../utils/strings/CommonStrings';
import { FIELD_ACTION_TYPE, FORM_LAYOUT_TYPE, VALUE_CONFIG_TYPES } from '../../Form.string';
import { GET_COLUMN_LAYOUT_TEMPLATE, GET_FIELD_LAYOUT_TEMPLATE, GET_ROW_LAYOUT_TEMPLATE } from '../../layout/Layout.constant';
import { FIELD_TYPES } from '../../sections/field_configuration/FieldConfiguration.strings';
import { getValueTypeOptions } from '../../sections/field_configuration/basic_configuration/selection_fields_component/SelectionFieldComponent.constants';
import { checkAllFieldsAreReadOnly } from '../../sections/field_configuration/validation_and_visibility_configuration/validation_configuration/ValidationConfiguration.utils';
import { addLayout, constructSinglePath, getLayoutByPath, getSummaryFieldDataByMetaData, getTableColumnFromLayout } from '../../sections/form_layout/FormLayout.utils';
import { getCurrencyFieldValidationData, getDatalistSelectorFieldValidationData, getDateFieldsValidationData, getDocumentFieldValidationData, getLinkFieldValidationData, getNumberFieldPostData, getTextFieldsPostData, getUserSelectorFieldValidationData } from './post_data/ValidationConfigPostData.utils';
import { ALLOW_CHECKBOX_FIELDS } from '../../sections/field_configuration/basic_configuration/BasicConfiguration.utils';
import { MODULE_TYPES } from '../../../../utils/Constants';

const getSystemField = (systemField) => {
    switch (systemField) {
        case RESPONSE_FIELD_KEYS.CREATED_BY: return REQUEST_FIELD_KEYS.CREATED_BY;
        case RESPONSE_FIELD_KEYS.LAST_UPDATED_BY: return REQUEST_FIELD_KEYS.LAST_UPDATED_BY;
        case RESPONSE_FIELD_KEYS.LOGGED_IN_USER: return REQUEST_FIELD_KEYS.LOGGED_IN_USER;
        default: return systemField;
    }
};

const getTableColumns = (fieldData, sectionUUID, sectionData, fields) => {
    let columns = [];
    if (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE) {
        const layout = getLayoutByPath(sectionData?.layout, fieldData?.path);
        columns = getTableColumnFromLayout(layout, cloneDeep(fields), sectionUUID);
    }
    return columns;
};

const ALL_DEFAULT_READONLY_FIELD_TYPES = [FIELD_TYPES.INFORMATION, ...PROPERTY_PICKER_ARRAY];

export const constructSaveFieldPostData = (fieldData, t = translateFunction) => {
    const isReadOnly = ALL_DEFAULT_READONLY_FIELD_TYPES.includes(fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) || fieldData?.[RESPONSE_FIELD_KEYS.READ_ONLY];
    const postData = {
        // [REQUEST_FIELD_KEYS.FIELD_NAME]: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_NAME],
        // [REQUEST_FIELD_KEYS.FIELD_TYPE]: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE],
        field_type: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE],
        read_only: isReadOnly,
        required: fieldData?.[RESPONSE_FIELD_KEYS.REQUIRED],
        field_list_type: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] || FIELD_LIST_TYPE.DIRECT,
        ...(!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.FIELD_NAME])) && { field_name: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_NAME] },
        ...((isBoolean(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE])) || (isFiniteNumber(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE])) || (!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]))) ? {
            default_value: fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE],
        } : null,
        ...(!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID])) ? {
            field_uuid: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
        } : null,
        ...(!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.FIELD_ID])) ? {
            _id: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_ID],
        } : null,
        ...(!isEmpty(fieldData?.node_uuid || fieldData?.[RESPONSE_FIELD_KEYS.NODE_UUID])) ? {
            node_uuid: fieldData?.node_uuid,
        } : null,
        ...(!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.PLACEHOLDER])) ? {
            place_holder: fieldData?.[RESPONSE_FIELD_KEYS.PLACEHOLDER],
        } : null,
        ...(!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.INSTRUCTION])) ? {
            instructions: fieldData?.[RESPONSE_FIELD_KEYS.INSTRUCTION],
        } : null,
        ...(!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.HELPER_TOOLTIP])) ? {
            help_text: fieldData?.[RESPONSE_FIELD_KEYS.HELPER_TOOLTIP],
        } : null,
        ...(isReadOnly) ? {
            hide_field_if_null: fieldData?.[RESPONSE_FIELD_KEYS.HIDE_FIELD_IF_NULL] || false,
        } : null,
        ...(fieldData?.fieldType !== FIELD_TYPES.NUMBER && ALLOW_CHECKBOX_FIELDS.includes(fieldData?.fieldType)) ? {
            allow_multiple: fieldData?.allowMultiple || false,
        } : null,
        ...(fieldData?.fieldType === FIELD_TYPES.NUMBER) ? {
            allow_decimal: fieldData?.allowDecimal || false,
        } : null,

        // Visibility Rule
        ...(fieldData[RESPONSE_FIELD_KEYS.IS_FIELD_SHOW_WHEN_RULE] ? {
            is_field_show_when_rule: true,
            field_show_when_rule: fieldData[RESPONSE_FIELD_KEYS.FIELD_SHOW_WHEN_RULE],
            is_visible: fieldData[RESPONSE_FIELD_KEYS.IS_VISIBLE],
        } : {}),
        // Default Value rule / External Source Data
        ...(!isEmpty(fieldData[RESPONSE_FIELD_KEYS.AUTO_FILL]) ? {
            auto_fill: {
                type: fieldData[RESPONSE_FIELD_KEYS.AUTO_FILL][RESPONSE_FIELD_KEYS.TYPE],
                ...(fieldData?.[RESPONSE_FIELD_KEYS.AUTO_FILL]?.is_inherit_from_parent) ? {
                    is_inherit_from_parent: true,
                }
                    :
                    {
                        source: fieldData[RESPONSE_FIELD_KEYS.AUTO_FILL][RESPONSE_FIELD_KEYS.SOURCE],
                    },
                child_data: fieldData[RESPONSE_FIELD_KEYS.AUTO_FILL][RESPONSE_FIELD_KEYS.CHILD_DATA],
            },
        } : {}),
    };
    console.log('check post data', fieldData, fieldData?.[RESPONSE_FIELD_KEYS.AUTO_FILL]?.is_inhert_from_parent);

    if (fieldData?.[RESPONSE_FIELD_KEYS.TABLE_UUID]) {
        postData.table_uuid = fieldData?.[RESPONSE_FIELD_KEYS.TABLE_UUID];
    }

    // Needed for next release
    // if (postData?.field_list_type === FIELD_LIST_TYPE.TABLE) {
    //     postData.width = 'auto';
    // }

    if ((fieldData?.[RESPONSE_FIELD_KEYS.EDIT_REFERENCE_NAME]) &&
        (fieldData?.[RESPONSE_FIELD_KEYS.REFERENCE_NAME] !== fieldData?.[RESPONSE_FIELD_KEYS.TEMPORARY_REFERENCE_NAME])) {
        postData.reference_name = fieldData?.[RESPONSE_FIELD_KEYS.TEMPORARY_REFERENCE_NAME];
    }

    let validationData = getTextFieldsPostData(fieldData);
    switch (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
        case FIELD_TYPES.SINGLE_LINE:
            if (!isEmpty(validationData)) postData.validations = validationData;
            break;
        case FIELD_TYPES.PARAGRAPH:
            if (!isEmpty(validationData)) postData.validations = validationData || {};
            postData.validations = {
                ...validationData,
                is_ellipse_text: fieldData?.isEllipseText || false,
            };
            if (fieldData?.isEllipseText) postData.validations.max_ellipse_char = fieldData?.maxEllipseChar;
            break;
        case FIELD_TYPES.NUMBER:
            validationData = getNumberFieldPostData(fieldData);
            if (!isEmpty(validationData)) postData.validations = validationData;
            if (!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE])) {
                postData.default_value = Number(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]);
            }
            postData.is_digit_formatted = fieldData[RESPONSE_FIELD_KEYS.IS_DIGIT_FORMATTED] || false;
            break;
        case FIELD_TYPES.DROPDOWN:
        case FIELD_TYPES.RADIO_GROUP:
        case FIELD_TYPES.CHECKBOX: {
            postData.choice_value_type = fieldData[RESPONSE_FIELD_KEYS.VALUE_TYPE] || fieldData[RESPONSE_FIELD_KEYS.CHOICE_VALUE_TYPE];
            const valueOptions = getValueTypeOptions(t);
            console.log('check radio types', valueOptions[1], fieldData);
            if (postData.choice_value_type === valueOptions[1].value) {
                console.log('check radio types1', valueOptions[1], fieldData);
                if (!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE])) {
                    if (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.CHECKBOX) {
                        postData.default_value = fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.map((value) => Number(value));
                        console.log('check radio types2', postData, fieldData);
                    } else {
                        postData.default_value = Number(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]);
                    }
                }
                postData.choice_values = fieldData[RESPONSE_FIELD_KEYS.VALUES]?.map((option) => {
                    return {
                        label: option?.label,
                        value: Number(option?.value),
                    };
                });
            } else {
                postData.choice_values = fieldData[RESPONSE_FIELD_KEYS.VALUES]?.map((option) => {
                    return {
                        label: option?.label,
                        value: option?.value,
                    };
                });
            }
            if (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.CHECKBOX) {
                postData.select_all = fieldData?.[RESPONSE_FIELD_KEYS.ALLOW_SELECT_ALL] || false;
            }
            break;
        }
        case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
            postData.value_metadata = {
                custom_lookup_id: fieldData[RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_ID],
            };
            break;
        case FIELD_TYPES.DATE:
        case FIELD_TYPES.DATETIME:
            postData.validations = getDateFieldsValidationData(fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], t);
            break;
        case FIELD_TYPES.CURRENCY:
            postData.validations = getCurrencyFieldValidationData(fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], t);
            if (!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.value)) {
                postData.default_value = {
                    value: Number(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.CURRENCY].CURRENCY_VALUE]),
                    currency_type: fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.currency_type,
                };
            } else {
                delete postData?.default_value;
            }
            break;
        case FIELD_TYPES.PHONE_NUMBER:
            if (!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.phone_number)) {
                postData.default_value = {
                    phone_number: fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.phone_number,
                    country_code: fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.country_code,
                };
            } else {
                delete postData?.default_value;
            }
            break;
        case FIELD_TYPES.LINK:
            postData.validations = getLinkFieldValidationData(fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], fieldData?.allowMultiple);
            if (!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE])) {
                postData.default_value = fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.map((link) => {
                    return {
                        link_text: link?.link_text,
                        link_url: link?.link_url,
                    };
                });
            }
            break;
        case FIELD_TYPES.FILE_UPLOAD:
            postData.validations = getDocumentFieldValidationData(fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], fieldData?.allowMultiple);
            break;
        case FIELD_TYPES.USER_TEAM_PICKER:
            postData.validations = getUserSelectorFieldValidationData(fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], fieldData?.allowMultiple, t);
            if (fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_FIELD_KEYS.SYSTEM_FIELD]) {
                postData.default_value = {
                    system_field: getSystemField(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_FIELD_KEYS.SYSTEM_FIELD]),
                    operation: fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_FIELD_KEYS.OPERATION] || RESPONSE_FIELD_KEYS.REPLACE,
                };
            } else delete postData.default_value;
            break;
        case FIELD_TYPES.DATA_LIST:
            postData.validations = getDatalistSelectorFieldValidationData(fieldData?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], fieldData?.allowMultiple, t);
            postData.data_list_details = {
                data_list_uuid: fieldData?.[RESPONSE_FIELD_KEYS.SELECTED_DATALIST]?.[RESPONSE_FIELD_KEYS.DATA_LIST_UUID],
                display_fields: fieldData?.[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS]?.map((field) => field[RESPONSE_FIELD_KEYS.FIELD_UUID]),
            };
            break;
        case FIELD_TYPES.USER_PROPERTY_PICKER:
        case FIELD_TYPES.DATA_LIST_PROPERTY_PICKER: {
            const propertyPickerDetails = fieldData?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS];
            postData.property_picker_details = {
                data_list_uuid: propertyPickerDetails[RESPONSE_FIELD_KEYS.DATA_LIST_UUID],
                reference_field_type: propertyPickerDetails[RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE],
                reference_field_uuid: propertyPickerDetails[RESPONSE_FIELD_KEYS.REFERENCE_FIELD_UUID],
                source: propertyPickerDetails[RESPONSE_FIELD_KEYS.SOURCE],
                source_field_uuid: propertyPickerDetails[RESPONSE_FIELD_KEYS.SOURCE_FIELD_UUID],
            };
            postData.read_only = true;
            break;
        }
        case FIELD_TYPES.INFORMATION: {
            postData.information_data = {};
            const initialFields = fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[RESPONSE_FIELD_KEYS.INSERTED_FIELDS];
            const initialDocs = fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS]?.map((eachDoc) => eachDoc?.file_metadata?.[0]?._id);

            const { filteredFieldUuids, filteredDocIds, rawHtml, renderedTemplate } = removeFieldAndDocIds({ data: fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_CONTENT]?.[RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE], fieldUuids: initialFields, docIds: initialDocs, isPostData: true });

            postData[REQUEST_FIELD_KEYS.INFORMATION_CONTENT] = {
                [REQUEST_FIELD_KEYS.EDITOR_TEMPLATE]: rawHtml,
                [REQUEST_FIELD_KEYS.RENDERING_TEMPLATE]: renderedTemplate,
            };

            if (!isEmpty(filteredFieldUuids)) {
                postData.information_data.field_uuids = filteredFieldUuids;
            }
            if (!isEmpty(filteredDocIds)) {
                postData.information_data.doc_ids = filteredDocIds;
                const uploadedDocMetadata = [];
                fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS]?.forEach((eachDocument) => {
                    if (filteredDocIds.includes(eachDocument?.file_metadata?.[0]?._id)) {
                        uploadedDocMetadata.push({
                            type: eachDocument?.file_metadata?.[0]?.type,
                            upload_signed_url: eachDocument?.file_metadata?.[0]?.upload_signed_url?.s3_key,
                            document_id: eachDocument?.file_metadata?.[0]?._id,
                        });
                    }
                });
                postData.document_details = {
                    entity: fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS]?.[0]?.entity,
                    entity_id: fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS]?.[0]?.entity_id,
                    ref_uuid: fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS]?.[0]?.ref_uuid,
                    uploaded_doc_metadata: uploadedDocMetadata,
                };
                postData._id = fieldData?.[RESPONSE_FIELD_KEYS.INFORMATION_DATA]?.[RESPONSE_FIELD_KEYS.INSERTED_DOCUMENT_DETAILS]?.[0]?.entity_id;
            }
            console.log('inserted docs', fieldData);
            break;
        }
        default: break;
    }
    return postData;
};

const getObjectFromKey = (arrayOfObjects, externalSourceId) => arrayOfObjects?.find((obj) => obj.externalSourceId === externalSourceId);

export const contructSaveTablePostData = (fieldData, sectionData = [], fields = []) => {
    const existingValidation = fieldData[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] || {};
    const REQUEST_TABLE_VALIDATION_KEY = REQUEST_VALIDATION_KEYS[FIELD_TYPES.TABLE];
    const RESPONSE_TABLE_VALIDATION_KEY = RESPONSE_VALIDATION_KEYS[FIELD_TYPES.TABLE];
    const validations = {
        [REQUEST_TABLE_VALIDATION_KEY.ADD_NEW_ROW]: !!existingValidation[RESPONSE_TABLE_VALIDATION_KEY.ADD_NEW_ROW],
        [REQUEST_TABLE_VALIDATION_KEY.ALLOW_MODIFY_EXISTING]: !!existingValidation[RESPONSE_TABLE_VALIDATION_KEY.ALLOW_MODIFY_EXISTING],
        [REQUEST_TABLE_VALIDATION_KEY.ALLOW_DELETE_EXISTING]: !!existingValidation[RESPONSE_TABLE_VALIDATION_KEY.ALLOW_DELETE_EXISTING],
        // [REQUEST_TABLE_VALIDATION_KEY.READ_ONLY]: !!existingValidation[RESPONSE_TABLE_VALIDATION_KEY.READ_ONLY],
        [REQUEST_TABLE_VALIDATION_KEY.IS_PAGINATION]: !!existingValidation[RESPONSE_TABLE_VALIDATION_KEY.IS_PAGINATION],
        [REQUEST_TABLE_VALIDATION_KEY.IS_MINIMUM_ROW]: !!existingValidation[RESPONSE_TABLE_VALIDATION_KEY.IS_MINIMUM_ROW],
        [REQUEST_TABLE_VALIDATION_KEY.IS_MAXIMUM_ROW]: !!existingValidation[RESPONSE_TABLE_VALIDATION_KEY.IS_MAXIMUM_ROW],
        [REQUEST_TABLE_VALIDATION_KEY.IS_UNIQUE_COLUMN_AVAILABLE]: !!existingValidation[RESPONSE_TABLE_VALIDATION_KEY.IS_UNIQUE_COLUMN_AVAILABLE],
    };

    if (!isEmpty(existingValidation)) {
        // Minimum Row
        if (
            validations?.[REQUEST_TABLE_VALIDATION_KEY.IS_MINIMUM_ROW] &&
            has(existingValidation, [RESPONSE_TABLE_VALIDATION_KEY.MINIMUM_ROW], false)
        ) {
            validations[REQUEST_TABLE_VALIDATION_KEY.MINIMUM_ROW] = existingValidation[RESPONSE_TABLE_VALIDATION_KEY.MINIMUM_ROW];
        }

        // Maximum Row
        if (
            validations?.[REQUEST_TABLE_VALIDATION_KEY.IS_MAXIMUM_ROW] &&
            has(existingValidation, [RESPONSE_TABLE_VALIDATION_KEY.MAXIMUM_ROW], false)
        ) {
            validations[REQUEST_TABLE_VALIDATION_KEY.MAXIMUM_ROW] = existingValidation[RESPONSE_TABLE_VALIDATION_KEY.MAXIMUM_ROW];
        }

        // Unique Row
        if (
            validations?.[REQUEST_TABLE_VALIDATION_KEY.IS_UNIQUE_COLUMN_AVAILABLE] &&
            has(existingValidation, [RESPONSE_TABLE_VALIDATION_KEY.UNIQUE_COLUMN_UUID], false)
        ) {
            validations[REQUEST_TABLE_VALIDATION_KEY.UNIQUE_COLUMN_UUID] = existingValidation[RESPONSE_TABLE_VALIDATION_KEY.UNIQUE_COLUMN_UUID];
        }
    }

    const autoFillData = {};
    const tableAutoFillData = [];
    if (fieldData?.externalSourceData) { // || fieldData?.external_source_data
        // Table Child Data
        const activeExternalSourceTableColumn = cloneDeep(fieldData?.activeExternalSourceData?.externalSourceData?.externalSourceTableColumns || []);

        const existingTableColumnsUUID = uniq([
            ...cloneDeep(fieldData?.externalSourceData?.externalSourceTableColumns || []),
            ...activeExternalSourceTableColumn,
        ]);

       const columnData = getTableColumns(
            fieldData,
            sectionData?.sectionUUID || sectionData?.section_uuid,
            cloneDeep(sectionData),
            fields,
        );

       existingTableColumnsUUID?.forEach((eachColumnUUID) => {
            const field = getObjectFromKey(columnData || [], eachColumnUUID);

            tableAutoFillData.push({
                child_data: eachColumnUUID,
                ...(field) ? { child_field_uuid: field?.[RESPONSE_FIELD_KEYS.FIELD_UUID] } : null,
            });
       });

       if (!isEmpty(existingTableColumnsUUID)) {
            // Auto Fill
            const externalSourceData = cloneDeep(fieldData?.external_source_data || fieldData?.externalSourceData);

            autoFillData.source = externalSourceData?.externalSourceRuleUUID;
            autoFillData.type = VALUE_CONFIG_TYPES.EXTERNAL_DATA;

            if (!isEmpty(externalSourceData?.externalSourceTableUUID)) {
                autoFillData.child_data = externalSourceData?.externalSourceTableUUID;
            }
        }
    }

    const postData = {
        required: false,
        read_only: false,
        is_field_show_when_rule: false,
        is_save: true,
        is_label_edited: true,
        order: 1,
        field_type: FIELD_TYPES.TABLE,
        field_list_type: FIELD_LIST_TYPE.DIRECT,

        // Field Name
        ...(!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.FIELD_NAME])) && { field_name: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_NAME] },

        // External Column
        ...(!isEmpty(autoFillData)) && { auto_fill: autoFillData },
        ...(!isEmpty(tableAutoFillData)) && { table_child_auto_fill: tableAutoFillData },
        // Validation
        validations,

        // Field Id
        ...(fieldData?.[RESPONSE_FIELD_KEYS.FIELD_ID]) ? { _id: fieldData[RESPONSE_FIELD_KEYS.FIELD_ID] } : {},

        // Field UUID
        ...fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID] ? { field_uuid: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_UUID] } : {},

        // Helper tooltip and Instruction
        ...fieldData[RESPONSE_FIELD_KEYS.HELPER_TOOLTIP] ? { help_text: fieldData?.[RESPONSE_FIELD_KEYS.HELPER_TOOLTIP] } : {},
        ...fieldData[RESPONSE_FIELD_KEYS.INSTRUCTION] ? { instructions: fieldData?.[RESPONSE_FIELD_KEYS.INSTRUCTION] } : {},
    };

    postData.is_visible = !!fieldData?.[RESPONSE_FIELD_KEYS.IS_VISIBLE];

    if (fieldData?.[RESPONSE_FIELD_KEYS.IS_FIELD_SHOW_WHEN_RULE]) {
        postData.is_field_show_when_rule = true;
        postData.field_show_when_rule = fieldData?.[RESPONSE_FIELD_KEYS.FIELD_SHOW_WHEN_RULE];
    }

    return postData;
};

export const getTableColumnsFromFields = (tableUUID, fields = {}) => {
    if (!tableUUID) return [];
    const stablizedFields = Object.values(fields);
    const columns = stablizedFields.filter((eachField) => eachField?.[RESPONSE_FIELD_KEYS.TABLE_UUID] === tableUUID);
    return columns;
};

export const isDisableAddRowAndModifyRow = (aciveField, field, allFields) => {
    const columns = cloneDeep(isEmpty(aciveField?.columns) ? getTableColumnsFromFields(aciveField?.[RESPONSE_FIELD_KEYS.FIELD_UUID], allFields) : aciveField?.columns);

    const fieldIndex = columns.findIndex((eachColumn) => (field?.[RESPONSE_FIELD_KEYS.FIELD_UUID] === eachColumn?.[RESPONSE_FIELD_KEYS.FIELD_UUID]));

    if (fieldIndex > -1) unset(columns, [fieldIndex]);
    if (!isEmpty(field)) columns.push(field);

    const isAllColumnReadOnly = checkAllFieldsAreReadOnly(columns);
    const validation = aciveField?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA];
    const TABLE_VALIDATION_KEY = RESPONSE_VALIDATION_KEYS[FIELD_TYPES.TABLE];

    return isAllColumnReadOnly && (
        validation?.[TABLE_VALIDATION_KEY.ADD_NEW_ROW] ||
        validation?.[TABLE_VALIDATION_KEY.ALLOW_MODIFY_EXISTING]
    );
};

export const constructFieldPostData = (field = {}, aciveField_ = {}, dropUtil = {}, t = translateFunction, sectionData = [], fields = {}) => {
    const aciveField = cloneDeep(aciveField_);
    let fieldData = cloneDeep(field);
    let isTable = fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE;
    let fieldActionType = (isTable) ? FIELD_ACTION_TYPE.TABLE : FIELD_ACTION_TYPE.FIELD;

    const TABLE_VALIDATION_KEY = RESPONSE_VALIDATION_KEYS[FIELD_TYPES.TABLE];

    const isFieldInsideTable = fieldData?.[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES] === FIELD_TYPES.TABLE;

    const isAllColumnReadonly = isFieldInsideTable ? isDisableAddRowAndModifyRow(aciveField, field, fields) : false;
    if (
        isFieldInsideTable &&
        (!has(fieldData, [RESPONSE_FIELD_KEYS.TABLE_UUID], false) || isAllColumnReadonly)
    ) {
        if (isAllColumnReadonly) {
            aciveField[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA][TABLE_VALIDATION_KEY.ADD_NEW_ROW] = false;
            aciveField[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA][TABLE_VALIDATION_KEY.ALLOW_MODIFY_EXISTING] = false;
        }

        fieldData = aciveField;
        isTable = true;
        fieldActionType = FIELD_ACTION_TYPE.TABLE;
        dropUtil.path = (dropUtil.path || EMPTY_STRING).split(COMMA).slice(0, -1).join(COMMA);
    }

    let postData = {};

    if (isTable) {
        postData = contructSaveTablePostData(fieldData, sectionData, fields);
    } else {
        postData = constructSaveFieldPostData(fieldData, t);
    }

    if (fieldData?.[RESPONSE_FIELD_KEYS.NODE_UUID] || fieldData?.[REQUEST_FIELD_KEYS.NODE_UUID]) {
        postData[REQUEST_FIELD_KEYS.NODE_UUID] = fieldData?.[RESPONSE_FIELD_KEYS.NODE_UUID] || fieldData?.[REQUEST_FIELD_KEYS.NODE_UUID];
    }

    return { postData, fieldData, dropUtil, actionType: fieldActionType };
};

// auto_fill: {
//     source: 'c21c8c53-0788-4e1d-871b-5ae38e4566a1',
//     type: 'external_data',
//     child_data: '7db794d6-f828-49cb-ab65-4dbb9b15cf06',
// },
// table_child_auto_fill: [
//     {
//         child_data: '7db794d6-f828-46cb-ab65-4dbb9b15cf06',
//     },
//     {
//         child_data: '7db794d6-f828-49cb-ab65-4dbb9b15cf06',
//     },
// ],

export const getModifiedFieldData = (eachField, defaultFieldValue, sectionUUId) => {
    return {
        [RESPONSE_FIELD_KEYS.FIELD_NAME]: eachField?.[REQUEST_FIELD_KEYS.FIELD_NAME],
        [RESPONSE_FIELD_KEYS.REFERENCE_NAME]: eachField?.[REQUEST_FIELD_KEYS.REFERENCE_NAME],
        [RESPONSE_FIELD_KEYS.FIELD_ID]: eachField?.[REQUEST_FIELD_KEYS.FIELD_ID],
        [RESPONSE_FIELD_KEYS.FIELD_UUID]: eachField?.[REQUEST_FIELD_KEYS.FIELD_UUID],
        [RESPONSE_FIELD_KEYS.FIELD_TYPE]: eachField?.[REQUEST_FIELD_KEYS.FIELD_TYPE],
        [RESPONSE_FIELD_KEYS.VALUES]: eachField?.[REQUEST_FIELD_KEYS.CHOICE_VALUES],
        [RESPONSE_FIELD_KEYS.PLACEHOLDER]: eachField?.[REQUEST_FIELD_KEYS.PLACEHOLDER],
        [RESPONSE_FIELD_KEYS.HELPER_TOOLTIP]: eachField?.[REQUEST_FIELD_KEYS.HELPER_TOOLTIP],
        [RESPONSE_FIELD_KEYS.INSTRUCTION]: eachField?.[REQUEST_FIELD_KEYS.INSTRUCTION],
        [RESPONSE_FIELD_KEYS.DEFAULT_VALUE]: defaultFieldValue,
        [RESPONSE_FIELD_KEYS.REQUIRED]: eachField?.[REQUEST_FIELD_KEYS.REQUIRED],
        [RESPONSE_FIELD_KEYS.SECTION_UUID]: sectionUUId,
        [RESPONSE_FIELD_KEYS.ALLOW_SELECT_ALL]: eachField[REQUEST_FIELD_KEYS.ALLOW_SELECT_ALL],
    };
};

export const constructFieldDataFromApi = (fields, sectionUUId) => {
    const modifiedFields = {};
    fields?.forEach((eachField) => {
        const defaultFieldValue = eachField?.[REQUEST_FIELD_KEYS.DEFAULT_VALUE];

        modifiedFields[eachField?.[REQUEST_FIELD_KEYS.FIELD_UUID]] = {
            ...getModifiedFieldData(eachField, defaultFieldValue, sectionUUId),
            ...(eachField?.[REQUEST_FIELD_KEYS.AUTO_FILL]) && { [RESPONSE_FIELD_KEYS.AUTO_FILL]: eachField?.[REQUEST_FIELD_KEYS.AUTO_FILL] },
        };
    });
    return modifiedFields || {};
};

export const getColumnsForExternalColumnForTable = (layout = {}, fieldList = [], saveFieldPostData = {}, formUUID = EMPTY_STRING, moduleType = EMPTY_STRING) => {
    const availableColumns = cloneDeep(layout?.children) || [];
    const existingColumnUUID = availableColumns.map((eachColumnLayout) => eachColumnLayout?.field_uuid);
    const fields = {};

    const order = (isEmpty(availableColumns) || !Array.isArray(availableColumns)) ? 0 : availableColumns.length;
    let idk = order + 1;
    fieldList.forEach((eachField) => {
        if (existingColumnUUID.includes(eachField?.field_uuid)) return;

        const fieldLayout = GET_FIELD_LAYOUT_TEMPLATE(layout?.node_uuid, idk, FORM_LAYOUT_TYPE.FIELD, eachField?.node_uuid);
        fieldLayout.field_uuid = eachField?.field_uuid;

        if (saveFieldPostData?.auto_fill?.type === 'external_data') {
            eachField?.form_details?.forEach((eachDetail) => {
                if (eachDetail?.form_uuid === formUUID && eachDetail?.auto_fill?.is_inherit_from_parent) {
                    fieldLayout.external_source_uuid = eachDetail?.auto_fill?.child_data;
                    fieldLayout[RESPONSE_FIELD_KEYS.AUTO_FILL] = eachDetail?.auto_fill;
                }
            });
        }

        availableColumns.push(fieldLayout);
        // if (!(availableColumns?.find((eachColumn) => eachColumn?.field_uuid === fieldLayout.field_uuid))) {

        // }

        const _field = (moduleType === MODULE_TYPES.SUMMARY) ?
            getSummaryFieldDataByMetaData(eachField) :
            normalizer(eachField, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS);
        _field[RESPONSE_FIELD_KEYS.FIELD_ID] = eachField?._id || _field[RESPONSE_FIELD_KEYS.FIELD_ID];

        const fieldUUID = _field[RESPONSE_FIELD_KEYS.FIELD_UUID];
        fields[fieldUUID] = _field;

        idk++;
    });
    return { columns: availableColumns, fieldList: fields };
};

export const getUpdatedLayoutOnRowDrop = (section = {}, noOfColumn = 4, modifiedFieldData = {}, originalFieldData = {}) => {
    const isTable = modifiedFieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE;
    const cols = isTable ? 1 : noOfColumn;
    const overAllLayout = cloneDeep(section?.layout);

    const splittedPath = originalFieldData.path.split(COMMA);
    const lastRowidk = findLastIndex(splittedPath, (eachPath) => eachPath.includes(FORM_LAYOUT_TYPE.ROW));
    const path = splittedPath.slice(0, lastRowidk);

    let layout = getLayoutByPath(overAllLayout, path.join(COMMA));
    const parentUUID = layout?.node_uuid;

    const newRowIndex = Number(splittedPath[lastRowidk]?.split(UNDERSCORE)?.[0] || 0);

    const newRow = GET_ROW_LAYOUT_TEMPLATE(parentUUID);
    newRow.order = newRowIndex + 1;
    for (let i = 0; i < cols; i++) {
        newRow.children.push(GET_COLUMN_LAYOUT_TEMPLATE(newRow.node_uuid, i + 1));
    }

    layout = addLayout(overAllLayout, path.join(COMMA), [], newRowIndex, newRow);

    path.push(
        constructSinglePath(newRowIndex, FORM_LAYOUT_TYPE.ROW),
        constructSinglePath(0, FORM_LAYOUT_TYPE.COLUMN),
        constructSinglePath(0, isTable ? FORM_LAYOUT_TYPE.TABLE : FORM_LAYOUT_TYPE.ADD_FIELD),
    );

    return { path: path.join(COMMA), newRowIdk: newRowIndex, layout };
};
