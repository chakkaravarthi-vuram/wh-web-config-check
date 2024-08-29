import React, { useState } from 'react';
import { Title, ETitleSize, SingleDropdown, Checkbox, Text, ETextSize, RadioGroup, ECheckboxSize, RadioGroupLayout, MultiDropdown } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { CREATE_NEW_STRINGS, SEND_DATA_TO_DL_CONFIG_CONSTANTS } from '../SendDataToDl.string';
import styles from '../SendDataToDl.module.scss';
import { DOCUMENT_TYPES, EMPTY_STRING, ENTITY, NO_DATA_FOUND, SELECT_LABEL } from '../../../../../../utils/strings/CommonStrings';
import jsUtility, { cloneDeep, isEmpty } from '../../../../../../utils/jsUtility';
import { getAllViewDataList } from '../../../../../../axios/apiService/dataList.apiService';
import useApiCall from '../../../../../../hooks/useApiCall';
import { FIELD_LIST_KEYS, FIELD_LIST_TYPE, MAX_PAGINATION_SIZE } from '../../../../../../utils/constants/form.constant';
import { DL_UPDATE_TYPE_VALUE, FIELD_TYPE_IDS, RESPONSE_FIELD_KEYS, SEND_DATA_TO_DL_CONSTANTS, SEND_DATA_TO_DL_INITIAL_STATE, UPDATE_DATA_LIST_OPERATIONS } from '../SendDataToDl.constants';
import { nodeConfigDataChange, useFlowNodeConfig } from '../../../../node_configuration/use_node_reducer/useNodeReducer';
import { deleteErrorListWithId, getFormattedDataListsFieldsResponse, getFormattedDataListsResponse } from '../SendDataToDl.utils';
import { generateEventTargetObject } from '../../../../../../utils/generatorUtils';
import { apiGetAllFieldsList } from '../../../../../../axios/apiService/flow.apiService';
import { FIELD_TYPES } from '../../../../../../components/form_builder/FormBuilder.strings';
import FieldMappingTable from '../../row_components/field_mapping_table/FieldMappingTable';
import { FIELD_MAPPING_TABLE_TYPES, FIELD_VALUE_TYPES, MAPPING_COMPONENT_TYPES } from '../../row_components/RowComponents.constants';
import { MODULE_TYPES } from '../../../../../../utils/Constants';
import { FIELD_TYPE } from '../../../../../../utils/constants/form_fields.constant';
import { dataLossAlertPopover } from '../../../../node_configuration/NodeConfiguration.utils';
import { ALLOW_MAPPING_STEP_SYSTEM_FIELDS, ALLOW_MAPPING_SYSTEM_FIELDS, PAGINATION_API_INIT_DATA } from '../../../../node_configuration/NodeConfiguration.constants';

function SendDataToDlGeneral(props) {
    const { t } = useTranslation();
    const { metaData: { flowId }, steps = [], isAddOnConfig, actions, allSystemFields = {} } = props;
    const { state, dispatch } = useFlowNodeConfig();
    console.log('pojwjhjewhew', state);
    const { dataListMapping, errorList, fieldDetails, mappingErrorList, selectedActionLabels = [], sendDataToDlActions, maximumFileSize, allowedExtensions, allowedCurrencyList, defaultCurrencyType, defaultCountryCode, isSystemDefined, documentUrlDetails } = state;
    console.log('aksjashhashjsahdsndjsa', errorList);
    const { dataListUuid, dataListEntryActionType, isAutoUpdate,
        saveResponse, saveResponseField, tableUuid, pickerFieldUuid,
        dataListUuidLabel, pickerFieldUuidLabel, saveResponseFieldLabel, dlEntryActionTypeLabel,
        tableFieldUuidLabel, tableFieldUuidType, mapping, mappingServerData, dataListId, mappingUuid } = dataListMapping;

    const [dataListSearchText, setDataListSearchText] = useState(EMPTY_STRING);
    const [dlDsPickerFieldSearchText, setdlDsPickerFieldSearchText] = useState(EMPTY_STRING);
    const [tableFieldsSearchText, setTableFieldsSearchText] = useState(EMPTY_STRING);
    const {
        ID,
        GENERAL: {
            DL_AND_EVENT_DETAILS,
            UPDATE_TYPE_OPTIONS,
            CHOOSE_DATALIST,
            UPDATE_ACTION_TYPE,
            RESPONSE_OPTIONS,
            CONFIGURE_CREATE_ENTRY,
            CONFIGURE_UPDATE_ENTRY,
            CONFIGURE_DELETE_ENTRY,
            TABLE_MULTIPLE_ENTRY_LABEL,
            FLOW_FIELD_SELECTED_DL_TYPE,
            TRIGGER_UPDATE_INFO,
            SAVE_ENTRY_CREATION,
            UPDATE_EXECTION_INFO,
            RESPONSE_NEEDED_QUESTION,
            BUTTON_ACTION,
            DATA_LOSS_POPOVER,
            MAPPING_VALIDATION_STRINGS,
            MAPPING_HEADERS,
            MAPPING_HEADERS_UPDATE,
        },
    } = SEND_DATA_TO_DL_CONFIG_CONSTANTS(t);

    // useAPICall initial set up
    const {
        data: allDataList,
        fetch: dataListFetch,
        clearData: clearDataList,
        isLoading: isDataListsLoading,
        hasMore: hasMoreDataList,
        page: dataListCurrentPage,
        clearData: clearAllDataLists,
    } = useApiCall(PAGINATION_API_INIT_DATA, true);

    const {
        data: dataListPickerFields,
        fetch: dataListPickerFieldFetch,
        isLoading: isDataListsPickerFieldsLoading,
        hasMore: hasMoreDataListPickerFields,
        page: dataListPickerFieldsCurrentPage,
        clearData: clearDataListPickerFields,
    } = useApiCall(PAGINATION_API_INIT_DATA, true);

    const {
        data: tableFields,
        fetch: tableFieldsFetch,
        isLoading: isTableFieldsLoading,
        hasMore: hasMoreTableFields,
        page: tableFieldsCurrentPage,
        clearData: clearTableFields,
    } = useApiCall(PAGINATION_API_INIT_DATA, true);

    // onChange handlers
    const onInputChangeHandler = (event) => {
        const { id, value, label } = event.target;
        const modifiedErrorList = deleteErrorListWithId(errorList, [
            `${FIELD_TYPE_IDS.DATA_LIST_MAPPING.ID},${id}`,
        ]);
        if (id === FIELD_TYPE_IDS.DATA_LIST_UUID.ID) {
            const selectedDlId = allDataList?.find((eachDataList) => eachDataList?.data_list_uuid === value);
            if (dataListUuid !== value) {
                if (!isEmpty(dataListEntryActionType)) {
                    dataLossAlertPopover({ title: DATA_LOSS_POPOVER.TITLE, subTitle: DATA_LOSS_POPOVER.SUBTITLE, onYesHandlerAdditionalFunc: () => dispatch(nodeConfigDataChange({ isSystemDefined: selectedDlId?.is_system_defined && selectedDlId?.system_defined_name === FIELD_LIST_KEYS.USERS, errorList: modifiedErrorList, dataListMapping: { ...SEND_DATA_TO_DL_INITIAL_STATE(t).dataListMapping, [id]: value, dataListUuidLabel: label, dataListId: selectedDlId?._id, mappingUuid: mappingUuid } })) });
                } else {
                    dispatch(nodeConfigDataChange({ isSystemDefined: selectedDlId?.is_system_defined && selectedDlId?.system_defined_name === FIELD_LIST_KEYS.USERS, errorList: modifiedErrorList, dataListMapping: { ...SEND_DATA_TO_DL_INITIAL_STATE(t).dataListMapping, [id]: value, dataListUuidLabel: label, dataListId: selectedDlId?._id, mappingUuid: mappingUuid } }));
                }
            }
        } else if (id === FIELD_TYPE_IDS.DATA_LIST_ENTRY_ACTION_TYPE.ID) {
            if (dataListEntryActionType !== value) {
                if (!isEmpty(pickerFieldUuid) || !isEmpty(tableUuid) || !isEmpty(mapping)) {
                    dataLossAlertPopover({ title: DATA_LOSS_POPOVER.TITLE, subTitle: DATA_LOSS_POPOVER.SUBTITLE, onYesHandlerAdditionalFunc: () => dispatch(nodeConfigDataChange({ errorList: modifiedErrorList, dataListMapping: { ...SEND_DATA_TO_DL_INITIAL_STATE(t).dataListMapping, dataListUuid: state?.dataListMapping?.dataListUuid, dataListUuidLabel: state?.dataListMapping?.dataListUuidLabel, dlEntryActionTypeLabel: label, dataListId: state?.dataListMapping?.dataListId, [id]: value, mappingUuid: mappingUuid } })) });
                } else {
                    dispatch(nodeConfigDataChange({ errorList: modifiedErrorList, dataListMapping: { ...SEND_DATA_TO_DL_INITIAL_STATE(t).dataListMapping, dataListUuid: state?.dataListMapping?.dataListUuid, dataListUuidLabel: state?.dataListMapping?.dataListUuidLabel, dlEntryActionTypeLabel: label, dataListId: state?.dataListMapping?.dataListId, [id]: value, mappingUuid: mappingUuid } }));
                }
            }
        } else if (id === FIELD_TYPE_IDS.PICKER_FIELD_UUID.ID) {
            dispatch(nodeConfigDataChange({ errorList: modifiedErrorList, dataListMapping: { ...dataListMapping, [id]: value, pickerFieldUuidLabel: label } }));
        } else if (id === FIELD_TYPE_IDS.SAVE_RESPONSE_FIELD.ID) {
            dispatch(nodeConfigDataChange({ errorList: modifiedErrorList, dataListMapping: { ...dataListMapping, [id]: value, saveResponseFieldLabel: label } }));
        } else if (id === FIELD_TYPE_IDS.TABLE_UUID.ID) {
            const selectedTableField = tableFields?.find((eachField) => eachField?.field_uuid === value);
            let updatedData = {
                [id]: value,
                tableFieldUuidLabel: label,
                tableFieldUuidType: selectedTableField?.field_type,
            };

            if (!isEmpty(tableUuid) && tableUuid !== value) {
                updatedData = {
                    ...SEND_DATA_TO_DL_INITIAL_STATE(t).dataListMapping,
                    ...updatedData,
                    dataListUuid: state?.dataListMapping?.dataListUuid,
                    dataListUuidLabel: state?.dataListMapping?.dataListUuidLabel,
                    dataListId: state?.dataListMapping?.dataListId,
                    dataListEntryActionType: state?.dataListMapping?.dataListEntryActionType,
                    dlEntryActionTypeLabel: state?.dataListMapping?.dlEntryActionTypeLabel,
                    mappingUuid: mappingUuid,
                };
            } else {
                updatedData = {
                    ...dataListMapping,
                    ...updatedData,
                };
            }
            if (tableUuid !== value) {
                if (!isEmpty(mapping)) {
                    dataLossAlertPopover({ title: DATA_LOSS_POPOVER.TITLE, subTitle: DATA_LOSS_POPOVER.SUBTITLE, onYesHandlerAdditionalFunc: () => dispatch(nodeConfigDataChange({ errorList: modifiedErrorList, dataListMapping: updatedData })) });
                } else {
                    dispatch(nodeConfigDataChange({ errorList: modifiedErrorList, dataListMapping: updatedData }));
                }
            } else {
                dispatch(nodeConfigDataChange({ errorList: modifiedErrorList, dataListMapping: { ...dataListMapping, [id]: value } }));
            }
        }
    };

    const onAllowClickHanlder = (event) => {
        const { id } = event.target;
        const modifiedErrorList = deleteErrorListWithId(errorList, [
            `${FIELD_TYPE_IDS.DATA_LIST_MAPPING.ID},${id}`,
        ]);
        dispatch(nodeConfigDataChange({ dataListMapping: { ...dataListMapping, [id]: !state.dataListMapping[id] }, errorList: modifiedErrorList }));
    };

    const onRadioChangeHandler = (_event, id, value) => {
        const modifiedErrorList = deleteErrorListWithId(errorList, [
            `${FIELD_TYPE_IDS.DATA_LIST_MAPPING.ID},${id}`,
            `${FIELD_TYPE_IDS.DATA_LIST_MAPPING.ID},${FIELD_TYPE_IDS.SAVE_RESPONSE_FIELD.ID}`,
        ]);
        dispatch(nodeConfigDataChange({ dataListMapping: { ...dataListMapping, [id]: value, saveResponseField: null, saveResponseFieldLabel: EMPTY_STRING }, errorList: modifiedErrorList }));
    };

    // Get all view data lists API (Choose datalist field)
    const getAllDataLists = (search, page) => {
        const dataListParams = {
            page: page || dataListCurrentPage || 1,
            size: MAX_PAGINATION_SIZE,
            include_system_data_list: 1,
            search: search,
        };
        if (jsUtility.isEmpty(dataListParams.search)) delete dataListParams.search;
        if ((dataListParams.page === 1) && !isEmpty(allDataList)) {
            clearAllDataLists();
        }
        dataListFetch(getAllViewDataList(dataListParams));
    };

    const getAllInitialDataLists = () => {
        clearDataList({ data: [], paginationData: {} });
        setDataListSearchText(EMPTY_STRING);
        getAllDataLists(EMPTY_STRING, 1);
    };

    const onDataListSearchHandler = (event) => {
        setDataListSearchText(event.target.value);
        getAllDataLists(event.target.value, 1);
    };

    const loadMoreDataList = () => {
        getAllDataLists(dataListSearchText, dataListCurrentPage + 1);
    };

    // Get all datalist pickers with flow id(Save Response field, datalist data picker field for update/delete entries)
    const getDataListPickers = (search, page, isSaveResponseField = false) => {
        const dlPickerParams = {
            page: page || dataListPickerFieldsCurrentPage || 1,
            size: MAX_PAGINATION_SIZE,
            allowed_field_types: (!isSystemDefined || isSaveResponseField) ? [FIELD_TYPES.DATA_LIST] : [FIELD_TYPES.USER_TEAM_PICKER],
            flow_id: flowId,
            field_list_type: FIELD_LIST_TYPE.DIRECT,
            search,
        };
        if (!jsUtility.isEmpty(dataListUuid) && (!isSystemDefined || isSaveResponseField)) {
            dlPickerParams.allowed_picker_dl_uuid = dataListUuid;
        }
        if (isSaveResponseField && dataListEntryActionType === DL_UPDATE_TYPE_VALUE.CREATE_MULTIPLE) {
            dlPickerParams.include_table_fields = 1;
            dlPickerParams.table_uuid = tableUuid;
        }
        if (jsUtility.isEmpty(dlPickerParams.search)) delete dlPickerParams.search;
        if ((dlPickerParams.page === 1) && !isEmpty(dataListPickerFields)) {
            clearDataListPickerFields();
        }
        console.log('namnbasdopiiojjn', dlPickerParams);
        dataListPickerFieldFetch(apiGetAllFieldsList(dlPickerParams));
    };

    const getInitialDLPickers = (isSaveResponseField = false) => {
        setdlDsPickerFieldSearchText(EMPTY_STRING);
        getDataListPickers(EMPTY_STRING, 1, isSaveResponseField);
    };

    const onDLPickerSearchChange = (event, isSaveResponseField = false) => {
        setdlDsPickerFieldSearchText(event?.target?.value);
        getDataListPickers(event?.target?.value, 1, isSaveResponseField);
    };

    const loadMoreDataListPickerFields = (isSaveResponseField = false) => {
        getDataListPickers(dlDsPickerFieldSearchText, dataListPickerFieldsCurrentPage + 1, isSaveResponseField);
    };

    // Get all table fields (Create Multiple Action type)
    const getAllTableFields = (search, page) => {
        const tableParams = {
            page: page || tableFieldsCurrentPage || 1,
            size: MAX_PAGINATION_SIZE,
            allowed_field_types: [FIELD_TYPES.TABLE],
            flow_id: flowId,
            search,
        };
        if (jsUtility.isEmpty(tableParams.search)) delete tableParams.search;
        if ((tableParams.page === 1) && !isEmpty(tableFields)) {
            clearTableFields();
        }
        tableFieldsFetch(apiGetAllFieldsList(tableParams));
    };

    const getAllInitialTableFields = () => {
        setTableFieldsSearchText(EMPTY_STRING);
        getAllTableFields(EMPTY_STRING, 1);
    };

    const tableFieldsSearchHandler = (event) => {
        setTableFieldsSearchText(event?.target?.value);
        getAllTableFields(event?.target?.value, 1);
    };

    const loadMoreTableFields = () => {
        getAllTableFields(tableFieldsSearchText, tableFieldsCurrentPage + 1);
    };

    // errorList id formatting function
    const getErrorListId = (id) => errorList?.[`${FIELD_TYPE_IDS.DATA_LIST_MAPPING.ID},${id}`];

    // search text state updates
    const onOutSideClick = () => {
        setDataListSearchText(EMPTY_STRING);
        setdlDsPickerFieldSearchText(EMPTY_STRING);
        setTableFieldsSearchText(EMPTY_STRING);
    };

    const handleMappingChange = (data = {}) => {
        const modifiedErrorList = cloneDeep(errorList);
        if (modifiedErrorList?.['dataListMapping,mapping']) {
            delete modifiedErrorList?.['dataListMapping,mapping'];
        }

        const updatedData = {
            ...data,
            dataListMapping: { ...dataListMapping, mapping: data?.mapping },
            errorList: modifiedErrorList,
        };

        delete updatedData?.mapping;

        dispatch(nodeConfigDataChange(updatedData));
    };

    console.log('sagvgfasgfascfgsacfdas', state, errorList);

    const getMappingComponent = ({ isUpdateEntry }) => (
        <>
            <FieldMappingTable
                key={dataListEntryActionType}
                initialRawData={[]}
                mappedServerData={mappingServerData}
                mappedData={mapping}
                fieldDetails={fieldDetails || []}
                tableHeaders={isUpdateEntry ? MAPPING_HEADERS_UPDATE(t) : MAPPING_HEADERS(t)}
                keyFieldParams={{
                    ignore_field_types: [FIELD_TYPE.INFORMATION],
                    ...(dataListEntryActionType === ID.UPDATE_ENTRIES && isSystemDefined) ? { is_edit_add_only: 0 } : {},
                }}
                valueFieldParams={{
                    ignore_field_types: [FIELD_TYPE.INFORMATION],
                    include_property_picker: 1,
                }}
                systemFieldParams={{
                    allSystemFields,
                    allowedSystemFields: ALLOW_MAPPING_SYSTEM_FIELDS,
                    allowedStepSystemFields: ALLOW_MAPPING_STEP_SYSTEM_FIELDS,
                    steps: steps,
                }}
                keyLabels={{
                    childKey: 'tableColumnMapping',
                    typeKey: 'fieldType',
                    addKey: 'addKey',
                    requiredKey: 'isRequired',
                    addRowText: CREATE_NEW_STRINGS(t).ADD_FIELD,
                    addChildRowText: CREATE_NEW_STRINGS(t).ADD_COLUMN,
                }}
                errorListKey="mappingErrorList"
                additionalRowComponentProps={{
                    keyObject: {
                        rowUuid: 'fieldUuid',
                        key: 'label',
                        value: 'value',
                        valueType: 'valueType',
                        mappingUuid: 'dataListFieldUuid',
                        mappingType: 'mappingType',
                        childKey: 'tableColumnMapping',
                        valueDetails: 'fieldDetails',
                        updateType: 'operation',
                        columnMappingListKey: 'tableColumnMapping',
                        deleteRow: 'deleteRow',
                        documentDetails: 'documentDetails',
                    },
                    isUpdateEntry,
                    steps,
                    isEditableKey: true,
                    fileUploadProps: {
                        contextId: state?.flowId,
                        fileEntityId: state?._id || state?.stepId,
                        fileEntity: ENTITY.FLOW_STEPS,
                        fileEntityType: DOCUMENT_TYPES.SEND_DATA_TO_DL_DOCUMENTS,
                        maximumFileSize,
                        allowedExtensions,
                        refUuid: state?.stepUuid,
                    },
                    allowedCurrencyList,
                    defaultCurrencyType,
                    defaultCountryCode,
                    metaData: {
                        childModuleType: MODULE_TYPES.DATA_LIST,
                        childModuleId: dataListId,
                    },
                    iterativeField: {
                        fieldName: tableFieldUuidLabel,
                        fieldType: tableFieldUuidType,
                        fieldUuid: tableUuid,
                    },
                    documentUrlDetails,
                }}
                rowInitialData={{
                    mappingType: SEND_DATA_TO_DL_CONSTANTS.DIRECT_MAPPING_TYPE,
                    valueType: FIELD_VALUE_TYPES.DYNAMIC,
                    operation: UPDATE_DATA_LIST_OPERATIONS.EQUAL_TO,
                }}
                mappingVariant={isUpdateEntry ? FIELD_MAPPING_TABLE_TYPES.KEY_VALUE_MAPPING_WITH_UPDATE_TYPE : FIELD_MAPPING_TABLE_TYPES.KEY_VALUE_MAPPING_WITH_TYPE}
                mappingComponent={MAPPING_COMPONENT_TYPES.SEND_DATA_TO_DL}
                dataListId={dataListId}
                parentId={flowId}
                mappingListKey={RESPONSE_FIELD_KEYS.MAPPING}
                documentDetailsKey="documentUrlDetails"
                handleMappingChange={handleMappingChange}
                errorList={mappingErrorList}
            />
            {
                errorList?.['dataListMapping,mapping'] && (
                    <Text
                        content={MAPPING_VALIDATION_STRINGS.MAPPING}
                        className={gClasses.red22}
                    />
                )
            }
        </>
    );

    const onActionClick = (value, label) => {
        const modifiedErrorList = deleteErrorListWithId(errorList, [
            `${FIELD_TYPE_IDS.DATA_LIST_MAPPING.ID},${FIELD_TYPE_IDS.ACTION_UUID.ID}`,
        ]);
        const clonedActions = cloneDeep(sendDataToDlActions);
        const selectedActions = cloneDeep(clonedActions?.actionUuid) || [];
        const clonedLabels = cloneDeep(clonedActions?.selectedActionLabels) || [];
        const index = selectedActions?.findIndex((actionUuid) => actionUuid === value);
        if (index > -1) {
            selectedActions.splice(index, 1);
            clonedLabels.splice(index, 1);
        } else {
            selectedActions.push(value);
            clonedLabels.push(label);
        }
        clonedActions.actionUuid = selectedActions;
        console.log('anssabdhbashbdsa', clonedActions, clonedLabels);
        dispatch(
            nodeConfigDataChange({
                sendDataToDlActions: cloneDeep(clonedActions),
                selectedActionLabels: cloneDeep(clonedLabels),
                errorList: modifiedErrorList,
            }),
        );
    };

    console.log('bahdahdghasdghsa', state);
    // Get fields based on entry action type
    const getActionUpdateData = () => {
        switch (dataListEntryActionType) {
            case ID.CREATE_NEW_ENTRY:
                return (
                    <>
                        <Title
                            content={CONFIGURE_CREATE_ENTRY}
                            size={ETitleSize.xs}
                            className={cx(gClasses.GrayV3, gClasses.MT20, gClasses.MB24)}
                        />
                        {getMappingComponent({})}
                    </>
                );
            case ID.CREATE_MULTIPLE_NEW_ENTRY:
                return (
                    <>
                        <Title
                            content={CONFIGURE_CREATE_ENTRY}
                            size={ETitleSize.xs}
                            className={cx(gClasses.GrayV3, gClasses.MT20, gClasses.MB12)}
                        />
                        <div className={styles.DropdownResponsive}>
                            <SingleDropdown
                                id={FIELD_TYPE_IDS.TABLE_UUID.ID}
                                className={cx(gClasses.MB24)}
                                placeholder={t(SELECT_LABEL)}
                                optionList={getFormattedDataListsFieldsResponse(tableFields) || []}
                                selectedValue={tableUuid}
                                dropdownViewProps={{
                                    labelName: TABLE_MULTIPLE_ENTRY_LABEL,
                                    labelClassName: styles.LabelClass,
                                    onClick: getAllInitialTableFields,
                                    onKeyDown: getAllInitialTableFields,
                                    selectedLabel: tableFieldUuidLabel,
                                }}
                                searchProps={{
                                    searchPlaceholder: t(SELECT_LABEL),
                                    searchValue: tableFieldsSearchText,
                                    onChangeSearch: tableFieldsSearchHandler,
                                    searchLabelClass: styles.SearchLabel,
                                    searchInputClass: styles.SearchInput,
                                }}
                                noDataFoundMessage={t(NO_DATA_FOUND)}
                                infiniteScrollProps={{
                                    dataLength: tableFields?.length || 0,
                                    next: loadMoreTableFields,
                                    hasMore: hasMoreTableFields,
                                    scrollableId: `scrollable-${FIELD_TYPE_IDS.TABLE_UUID.ID}`,
                                    scrollThreshold: 0.5,
                                }}
                                isLoadingOptions={isTableFieldsLoading}
                                onClick={(value, label) => onInputChangeHandler(generateEventTargetObject(FIELD_TYPE_IDS.TABLE_UUID.ID, value, { label }))}
                                errorMessage={getErrorListId(FIELD_TYPE_IDS.TABLE_UUID.ID)}
                                onOutSideClick={onOutSideClick}
                            />
                        </div>
                        {getMappingComponent({})}
                    </>
                );
            case ID.UPDATE_ENTRIES:
                return (
                    <>
                        <Title
                            content={CONFIGURE_UPDATE_ENTRY}
                            size={ETitleSize.xs}
                            className={cx(gClasses.GrayV3, gClasses.MT20, gClasses.MB12)}
                        />
                        <div className={styles.DropdownResponsive}>
                            <SingleDropdown
                                id={FIELD_TYPE_IDS.PICKER_FIELD_UUID.ID}
                                className={cx(gClasses.MB24)}
                                placeholder={t(SELECT_LABEL)}
                                optionList={getFormattedDataListsFieldsResponse(dataListPickerFields) || []}
                                selectedValue={pickerFieldUuid}
                                dropdownViewProps={{
                                    labelName: FLOW_FIELD_SELECTED_DL_TYPE,
                                    labelClassName: styles.LabelClass,
                                    onClick: () => getInitialDLPickers(),
                                    onKeyDown: () => getInitialDLPickers(),
                                    selectedLabel: pickerFieldUuidLabel,
                                }}
                                searchProps={{
                                    searchPlaceholder: t(SELECT_LABEL),
                                    searchValue: dlDsPickerFieldSearchText,
                                    onChangeSearch: (event) => onDLPickerSearchChange(event),
                                    searchLabelClass: styles.SearchLabel,
                                    searchInputClass: styles.SearchInput,
                                }}
                                noDataFoundMessage={t(NO_DATA_FOUND)}
                                infiniteScrollProps={{
                                    dataLength: dataListPickerFields?.length || 0,
                                    next: () => loadMoreDataListPickerFields(),
                                    hasMore: hasMoreTableFields,
                                    scrollableId: `scrollable-${FIELD_TYPE_IDS.PICKER_FIELD_UUID.ID}`,
                                    scrollThreshold: 0.5,
                                }}
                                isLoadingOptions={isDataListsPickerFieldsLoading}
                                onClick={(value, label) => onInputChangeHandler(generateEventTargetObject(FIELD_TYPE_IDS.PICKER_FIELD_UUID.ID, value, { label }))}
                                errorMessage={getErrorListId(FIELD_TYPE_IDS.PICKER_FIELD_UUID.ID)}
                                onOutSideClick={onOutSideClick}
                            />
                        </div>
                        {getMappingComponent({ isUpdateEntry: true })}
                    </>
                );
            case ID.DELETE_ENTRIES:
                return (
                    <div className={cx(styles.DropdownResponsive, gClasses.MT20)}>
                        <Title
                            content={CONFIGURE_DELETE_ENTRY}
                            className={cx(gClasses.GrayV3, gClasses.MT20, gClasses.MB12)}
                            size={ETitleSize.xs}
                        />
                        <SingleDropdown
                            id={FIELD_TYPE_IDS.PICKER_FIELD_UUID.ID}
                            className={cx(gClasses.MB24)}
                            optionList={getFormattedDataListsFieldsResponse(dataListPickerFields) || []}
                            selectedValue={pickerFieldUuid}
                            placeholder={t(SELECT_LABEL)}
                            dropdownViewProps={{
                                labelName: FLOW_FIELD_SELECTED_DL_TYPE,
                                labelClassName: styles.LabelClass,
                                onClick: () => getInitialDLPickers(),
                                onKeyDown: () => getInitialDLPickers(),
                                selectedLabel: pickerFieldUuidLabel,
                            }}
                            searchProps={{
                                searchPlaceholder: t(SELECT_LABEL),
                                searchValue: dlDsPickerFieldSearchText,
                                onChangeSearch: (event) => onDLPickerSearchChange(event),
                                searchLabelClass: styles.SearchLabel,
                                searchInputClass: styles.SearchInput,
                            }}
                            noDataFoundMessage={t(NO_DATA_FOUND)}
                            infiniteScrollProps={{
                                dataLength: dataListPickerFields?.length || 0,
                                next: () => loadMoreDataListPickerFields(),
                                hasMore: hasMoreTableFields,
                                scrollableId: `scrollable-${FIELD_TYPE_IDS.PICKER_FIELD_UUID.ID}`,
                                scrollThreshold: 0.5,
                            }}
                            isLoadingOptions={isDataListsPickerFieldsLoading}
                            onClick={(value) => onInputChangeHandler(generateEventTargetObject(FIELD_TYPE_IDS.PICKER_FIELD_UUID.ID, value))}
                            errorMessage={getErrorListId(FIELD_TYPE_IDS.PICKER_FIELD_UUID.ID)}
                            onOutSideClick={onOutSideClick}
                        />
                    </div>
                );
            default: return null;
        }
    };

    console.log('dlEntryActionTypeLabel', dlEntryActionTypeLabel);

    return (
        <>
            {
                isAddOnConfig && (
                    <MultiDropdown
                        optionList={cloneDeep(actions)}
                        dropdownViewProps={{
                            labelName: BUTTON_ACTION,
                            className: gClasses.MB12,
                            selectedLabel: !isEmpty(selectedActionLabels) && selectedActionLabels.join(', '),
                            errorMessage: errorList?.[`${FIELD_TYPE_IDS.DATA_LIST_MAPPING.ID},${FIELD_TYPE_IDS.ACTION_UUID.ID}`],
                        }}
                        onClick={onActionClick}
                        selectedListValue={sendDataToDlActions?.actionUuid}
                    />
                )
            }
            <Title content={DL_AND_EVENT_DETAILS} size={ETitleSize.xs} className={gClasses.GrayV3} />
            <div className={cx(styles.DropdownResponsive, gClasses.MT12)}>
                <SingleDropdown
                    id={FIELD_TYPE_IDS.DATA_LIST_UUID.ID}
                    className={cx(gClasses.MB12)}
                    optionList={getFormattedDataListsResponse(allDataList) || []}
                    selectedValue={dataListUuid}
                    placeholder={t(SELECT_LABEL)}
                    required
                    dropdownViewProps={{
                        labelName: CHOOSE_DATALIST,
                        labelClassName: styles.LabelClass,
                        onClick: getAllInitialDataLists,
                        onKeyDown: getAllInitialDataLists,
                        selectedLabel: dataListUuidLabel,
                    }}
                    searchProps={{
                        searchPlaceholder: t(SELECT_LABEL),
                        searchValue: dataListSearchText,
                        onChangeSearch: onDataListSearchHandler,
                        searchLabelClass: styles.SearchLabel,
                        searchInputClass: styles.SearchInput,
                    }}
                    infiniteScrollProps={{
                        dataLength: allDataList?.length || 0,
                        next: loadMoreDataList,
                        hasMore: hasMoreDataList,
                        scrollableId: `scrollable-${FIELD_TYPE_IDS.DATA_LIST_UUID.ID}`,
                        scrollThreshold: 0.5,
                    }}
                    isLoadingOptions={isDataListsLoading}
                    onClick={(value, label) => onInputChangeHandler(generateEventTargetObject(FIELD_TYPE_IDS.DATA_LIST_UUID.ID, value, { label }))}
                    errorMessage={getErrorListId(FIELD_TYPE_IDS.DATA_LIST_UUID.ID)}
                    onOutSideClick={onOutSideClick}
                />
                {dataListUuid &&
                    <SingleDropdown
                        id={FIELD_TYPE_IDS.DATA_LIST_ENTRY_ACTION_TYPE.ID}
                        optionList={UPDATE_TYPE_OPTIONS}
                        placeholder={t(SELECT_LABEL)}
                        selectedValue={dataListEntryActionType}
                        required
                        dropdownViewProps={{
                            labelName: UPDATE_ACTION_TYPE,
                            labelClassName: styles.LabelClass,
                            selectedLabel: dlEntryActionTypeLabel,
                        }}
                        onClick={(value, label) => onInputChangeHandler(generateEventTargetObject(FIELD_TYPE_IDS.DATA_LIST_ENTRY_ACTION_TYPE.ID, value, { label }))}
                        errorMessage={getErrorListId(FIELD_TYPE_IDS.DATA_LIST_ENTRY_ACTION_TYPE.ID)}
                    />
                }
            </div>
            {getActionUpdateData()}
            {dataListEntryActionType && (dataListEntryActionType === ID.CREATE_NEW_ENTRY || dataListEntryActionType === ID.CREATE_MULTIPLE_NEW_ENTRY) && (
                <Checkbox
                    id={FIELD_TYPE_IDS.IS_AUTO_UPDATE.ID}
                    details={{
                        value: true,
                        label: TRIGGER_UPDATE_INFO,
                    }}
                    className={gClasses.MT16}
                    size={ECheckboxSize.SM}
                    checkboxViewLabelClassName={gClasses.FTwo13GrayV90}
                    isValueSelected={isAutoUpdate}
                    onClick={() => onAllowClickHanlder(generateEventTargetObject(FIELD_TYPE_IDS.IS_AUTO_UPDATE.ID))}
                />)}
            {dataListEntryActionType && (dataListEntryActionType !== ID.DELETE_ENTRIES) && (
                <>
                    <Title
                        content={SAVE_ENTRY_CREATION}
                        size={ETitleSize.xs}
                        className={cx(gClasses.GrayV3, gClasses.MT20, gClasses.MB12)}
                    />
                    <Text
                        content={UPDATE_EXECTION_INFO}
                        className={cx(gClasses.FTwo12GrayV104, gClasses.FontWeight500)}
                    />
                    <Text
                        content={RESPONSE_NEEDED_QUESTION}
                        size={ETextSize.SM}
                        className={cx(gClasses.FTwo12GrayV104, gClasses.FontWeight500)}
                    />
                    <RadioGroup
                        id={FIELD_TYPE_IDS.SAVE_RESPONSE.ID}
                        selectedValue={saveResponse}
                        options={RESPONSE_OPTIONS(t)}
                        radioContainerStyle={gClasses.gap8}
                        optionClassName={gClasses.FTwo13GrayV3}
                        layout={RadioGroupLayout.stack}
                        hideLabel
                        onChange={onRadioChangeHandler}
                    />
                    {saveResponse && (
                        <div className={cx(gClasses.CenterV, styles.DropdownResponsive, gClasses.MT20)}>
                            {/* <CreateDropdown
                                optionList={[]}
                                onClick={null}
                                searchProps={{
                                    searchPlaceholder: 'Enter Field Name',
                                    searchLabel: 'Create New Field Name',
                                    searchLabelClass: styles.SearchLabel,
                                    searchInputClass: styles.SearchInput,
                                }}
                                createProps={{
                                    createButtonLabel: 'Create',
                                    onCreateButtonClick: null,
                                    createError: EMPTY_STRING,
                                }}
                                dropdownViewProps={{
                                    labelName: 'Flow Field to Store the Response',
                                    labelClassName: cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500),
                                }}
                            /> */}
                            <SingleDropdown
                                id={FIELD_TYPE_IDS.SAVE_RESPONSE_FIELD.ID}
                                optionList={getFormattedDataListsFieldsResponse(dataListPickerFields) || []}
                                searchProps={{
                                    searchPlaceholder: 'Enter Field Name',
                                    searchValue: dlDsPickerFieldSearchText,
                                    onChangeSearch: (event) => onDLPickerSearchChange(event, true),
                                    searchLabelClass: styles.SearchLabel,
                                    searchInputClass: styles.SearchInput,
                                }}
                                infiniteScrollProps={{
                                    dataLength: dataListPickerFields?.length || 0,
                                    next: () => loadMoreDataListPickerFields(true),
                                    hasMore: hasMoreDataListPickerFields,
                                    scrollableId: `scrollable-${FIELD_TYPE_IDS.SAVE_RESPONSE_FIELD.ID}`,
                                    scrollThreshold: 0.5,
                                }}
                                placeholder={t(SELECT_LABEL)}
                                dropdownViewProps={{
                                    labelName: 'Flow Field to Store the Response',
                                    labelClassName: cx(gClasses.FTwo12BlackV20, gClasses.FontWeight500),
                                    selectedLabel: saveResponseFieldLabel,
                                    onClick: () => getInitialDLPickers(true),
                                    onKeyDown: () => getInitialDLPickers(true),
                                }}
                                selectedValue={saveResponseField}
                                isLoadingOptions={isDataListsPickerFieldsLoading}
                                onClick={(value, label) => onInputChangeHandler(generateEventTargetObject(FIELD_TYPE_IDS.SAVE_RESPONSE_FIELD.ID, value, { label }))}
                                errorMessage={getErrorListId(FIELD_TYPE_IDS.SAVE_RESPONSE_FIELD.ID)}
                                onOutSideClick={onOutSideClick}
                            />
                        </div>
                    )}
                </>)}
        </>
    );
}

export default SendDataToDlGeneral;
