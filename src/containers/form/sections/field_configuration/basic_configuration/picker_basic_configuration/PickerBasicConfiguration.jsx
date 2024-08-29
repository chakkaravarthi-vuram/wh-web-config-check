import { SingleDropdown, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames/bind';
import { useSelector } from 'react-redux';
import { FIELD_LIST_TYPE, INITIAL_PAGE, MAX_PAGINATION_SIZE } from '../../../../../../utils/constants/form.constant';
import { CancelToken } from '../../../../../../utils/UtilityFunctions';
import { getDatalistPickerValidationErrorMessage, getPickerDetails } from './PickerBasicConfiguration.utils';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { isEmpty } from '../../../../../../utils/jsUtility';
import { getAllDataListFields } from '../../../../../../axios/apiService/form.apiService';
import styles from './PickerBasicConfiguration.module.scss';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from '../BasicConfiguration.strings';
import { REQUEST_SAVE_FORM, RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { FIELD_TYPES } from '../../FieldConfiguration.strings';
import { getDataListDetailsByUuid } from '../../../../../../axios/apiService/dataList.apiService';
import { getModuleIdByModuleType } from '../../../../Form.utils';
import { MODULE_TYPES } from '../../../../../../utils/Constants';
import { ALLOWED_DATALIST_PROPERTY_TYPES } from '../../../../../../utils/constants/dataListPicker.constant';

const fieldsCancelToken = new CancelToken();

function PickerBasicConfiguration(props) {
    const { setFieldDetails, fieldDetails = {}, tableUUID, metaData = {}, setIsDlOptionListEmpty, moduleType = MODULE_TYPES.FLOW, isTable } = props;
    const { errorList = {} } = fieldDetails;

    const { user_data_list_uuid } = useSelector((store) => store.UserProfileReducer);

    const { t } = useTranslation();

    const extraParam = tableUUID ? { table_uuid: tableUUID } : {};
    const datalistFieldRef = useRef();
    const datalistRef = useRef();
    const [fields, setFields] = useState([]);
    const [searchText, setSearchText] = useState(EMPTY_STRING);
    const [selectedDatalistFields, setSelectedDatalistFields] = useState([]);
    const [datalistFieldsPaginationDetails, setDatalistFieldsPaginationDetails] = useState([]);
    const [pickerFieldSearchText, setPickerFieldsSearchText] = useState(EMPTY_STRING);

    const fetchFields = (params) => {
        const allowedFieldType =
        (fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DATA_LIST_PROPERTY_PICKER) ?
        FIELD_TYPES.DATA_LIST : FIELD_TYPES.USER_TEAM_PICKER;
        const param = {
            ...params,
            ...extraParam,
            ...getModuleIdByModuleType(metaData, moduleType, false),
            allowed_field_types: [allowedFieldType],
            field_list_type: (tableUUID || isTable) ? FIELD_LIST_TYPE.TABLE : FIELD_LIST_TYPE.DIRECT,
            is_property_picker: 1,
          };
          getAllDataListFields(param, fieldsCancelToken?.setCancelToken).then((res) => {
            console.log('getALlDatalistssss fields2', res);
            const { datalistFieldsPaginationDetails = {}, datalistFields = [] } = res;
            setIsDlOptionListEmpty(datalistFieldsPaginationDetails?.totalCount === 0);
            setFields([...(datalistFields || [])]);
            console.log('getALlDatalistssss fields', res);
          }).catch((res) => {
            console.log('getALlDatalistssss fields err', res);
          });
    };

    const fetchDataListFieldsApiCall = (params) => {
        console.log('getALlDatalistssss fields1 fetchDataListFieldsApiCall');
        const param = {
            ...params,
            data_list_uuids: [fieldDetails?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]?.[RESPONSE_FIELD_KEYS.DATA_LIST_UUID]],
            allowed_field_types: ALLOWED_DATALIST_PROPERTY_TYPES,
            field_list_type: FIELD_LIST_TYPE.DIRECT,
          };
          getAllDataListFields(param, fieldsCancelToken?.setCancelToken).then((res) => {
            console.log('getALlDatalistssss fields2');
            const { datalistFieldsPaginationDetails = {}, datalistFields = [] } = res;
            if (params?.page > 1) {
                setSelectedDatalistFields([...selectedDatalistFields, ...datalistFields || []]);
                setDatalistFieldsPaginationDetails(datalistFieldsPaginationDetails);
            } else {
                setSelectedDatalistFields([...datalistFields || []]);
                setDatalistFieldsPaginationDetails(datalistFieldsPaginationDetails);
            }
            console.log('getALlDatalistssss fields', res);
          }).catch((res) => {
            console.log('getALlDatalistssss fields err', res);
          });
    };

    useEffect(() => {
        console.log('getALlDatalistssss fields0', fieldDetails);
        !fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_UUID] && fetchFields({ page: INITIAL_PAGE, size: 1000 });
    }, [fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]]);

    useEffect(() => {
        console.log('getALlDatalistssss fields0useEffect1', fieldDetails);
        if (!isEmpty(fieldDetails?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS])) {
            fetchDataListFieldsApiCall({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
        }
    }, [fieldDetails?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]]);

    const onDatalistFieldSelectionHandler = (value, label, options) => {
        const index = fields.findIndex((field) => value === field.value);
        switch (fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
            case FIELD_TYPES.DATA_LIST_PROPERTY_PICKER:
                const datalistSelector = options?.find((field) => field.value === value);
                console.log('selectedFieldselectedField', options, value, label, datalistSelector);
                if (datalistSelector) {
                    setFieldDetails({
                        ...fieldDetails,
                        [RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]: {
                            [RESPONSE_FIELD_KEYS.SOURCE]: REQUEST_SAVE_FORM.SOURCE_TYPE.FORM,
                            [RESPONSE_FIELD_KEYS.SOURCE_FIELD_UUID]: value,
                            sourceFieldName: fields[index].label,
                            [RESPONSE_FIELD_KEYS.DATA_LIST_ID]: datalistSelector?.[RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS]?.[RESPONSE_FIELD_KEYS.DATA_LIST_ID],
                            [RESPONSE_FIELD_KEYS.DATA_LIST_UUID]: datalistSelector?.[RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS]?.[RESPONSE_FIELD_KEYS.DATA_LIST_UUID],
                            [RESPONSE_FIELD_KEYS.DATA_LIST_NAME]: datalistSelector?.[RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS]?.[RESPONSE_FIELD_KEYS.DATA_LIST_UUID],
                        },
                    });
                }
                break;
            case FIELD_TYPES.USER_PROPERTY_PICKER:
                if (value && user_data_list_uuid) {
                    getDataListDetailsByUuid({ data_list_uuid: user_data_list_uuid, process_response: 0 })
                    .then((datalistDetails) => {
                        setFieldDetails({
                            ...fieldDetails,
                            [RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]: {
                                [RESPONSE_FIELD_KEYS.SOURCE]: REQUEST_SAVE_FORM.SOURCE_TYPE.FORM,
                                [RESPONSE_FIELD_KEYS.SOURCE_FIELD_UUID]: value,
                                sourceFieldName: fields[index].label,
                                [RESPONSE_FIELD_KEYS.DATA_LIST_ID]: datalistDetails?.[RESPONSE_FIELD_KEYS.DATA_LIST_ID],
                                [RESPONSE_FIELD_KEYS.DATA_LIST_UUID]: user_data_list_uuid,
                            },
                        });
                    });
                  }
                break;
            default: break;
        }
        fetchFields({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
    };

    // const searchDatalistFields = (event) => {
    //     const searchText = event?.target?.value || EMPTY_STRING;
    //     setSearchText(searchText);
    //     fetchFields({
    //         page: INITIAL_PAGE,
    //         size: MAX_PAGINATION_SIZE,
    //         ...(!isEmpty(searchText)) ? { search: searchText } : null,
    //     });
    // };

    // const loadMoreDatalistFields = () => {
    //     fetchFields({
    //         page: paginationDetails.page + 1,
    //         size: MAX_PAGINATION_SIZE,
    //         ...(!isEmpty(searchText)) ? { search: searchText } : null,
    //     });
    // };

    const onPickerFieldSelectionChange = (value, label, fields) => {
        console.log('selectedFieldselectedField', fields, value, label);
        const pickerField = selectedDatalistFields?.find((field) => field.value === value);
        setFieldDetails({
            ...fieldDetails,
            [RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]: {
                ...fieldDetails?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS],
                [RESPONSE_FIELD_KEYS.REFERENCE_FIELD_TYPE]: pickerField?.[RESPONSE_FIELD_KEYS.FIELD_TYPE],
                [RESPONSE_FIELD_KEYS.REFERENCE_FIELD_UUID]: value,
                [RESPONSE_FIELD_KEYS.REFERENCE_FIELD_NAME]: label,
            },
            [RESPONSE_FIELD_KEYS.FIELD_NAME]: label,
        });
        fetchDataListFieldsApiCall({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
    };

    const searchPickerFields = (event) => {
        const searchText = event?.target?.value || EMPTY_STRING;
        setPickerFieldsSearchText(searchText);
        fetchDataListFieldsApiCall({
            page: INITIAL_PAGE,
            size: MAX_PAGINATION_SIZE,
            ...(!isEmpty(searchText)) ? { search: searchText } : null,
        });
    };

    const loadMorePickerFields = () => {
        fetchDataListFieldsApiCall({
            page: datalistFieldsPaginationDetails.page + 1,
            size: MAX_PAGINATION_SIZE,
            ...(!isEmpty(pickerFieldSearchText)) ? { search: pickerFieldSearchText } : null,
        });
    };

    let datalistLabel = BASIC_FORM_FIELD_CONFIG_STRINGS(t).DATALIST_SELECTOR.PICKER.LABEL;
    let datalistFieldLabel = BASIC_FORM_FIELD_CONFIG_STRINGS(t).DATALIST_SELECTOR.FIELD.LABEL;
    if (fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.USER_PROPERTY_PICKER) {
        datalistLabel = BASIC_FORM_FIELD_CONFIG_STRINGS(t).USER_SELECTOR.PICKER.LABEL;
        datalistFieldLabel = BASIC_FORM_FIELD_CONFIG_STRINGS(t).USER_SELECTOR.PICKER.FIELD_LABEL;
    }

    return (
        <div>
            <div className={gClasses.MT16}>
                <SingleDropdown
                    getPopperContainerClassName={() => styles.DatalistDropdownList}
                    optionList={fields}
                    onClick={(value, label, optionList) => onDatalistFieldSelectionHandler(value, label, optionList)}
                    selectedValue={fieldDetails?.propertyPickerDetails?.sourceFieldUUID}
                    errorMessage={getDatalistPickerValidationErrorMessage(errorList, RESPONSE_FIELD_KEYS.SOURCE)}
                    // infiniteScrollProps={{
                    //     dataLength: fields?.length,
                    //     next: loadMoreDatalistFields,
                    //     hasMore: fields?.length < paginationDetails?.totalCount,
                    //     scrollableId: 'data_list_infinite_scroll',
                    // }}
                    searchProps={{
                        // // searchPlaceholder: t(SEARCH_DATALIST),
                        // searchValue: searchText,
                        // onChangeSearch: searchDatalistFields,
                    }}
                    dropdownViewProps={{
                        selectedLabel: fieldDetails?.propertyPickerDetails?.sourceFieldName || getPickerDetails(fieldDetails?.otherFieldDetail, 'fieldUUID', fieldDetails?.propertyPickerDetails?.sourceFieldUUID)?.fieldName,
                        labelName: datalistLabel,
                        disabled: fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
                    }}
                    onOutSideClick={() => {
                        datalistRef?.current?.click();
                    }}
                />
                <button
                    ref={datalistRef}
                    className={gClasses.DisplayNone}
                    onClick={() => {
                        console.log('checkONCLICK');
                        !isEmpty(searchText) && fetchFields({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
                        setSearchText(EMPTY_STRING);
                    }}
                />
            </div>
            <div className={cx(gClasses.MT16, gClasses.DisplayFlex, gClasses.JusSpaceBtw)}>
                <div className={styles.DatalistField}>
                    <SingleDropdown
                        getPopperContainerClassName={() => styles.DatalistDropdownList}
                        optionList={selectedDatalistFields}
                        onClick={(value, label, optionList) => onPickerFieldSelectionChange(value, label, optionList)}
                        selectedValue={fieldDetails?.propertyPickerDetails?.referenceFieldUUID}
                        errorMessage={getDatalistPickerValidationErrorMessage(errorList, RESPONSE_FIELD_KEYS.REFERENCE_FIELD_UUID)}
                        infiniteScrollProps={{
                            dataLength: selectedDatalistFields?.length,
                            next: loadMorePickerFields,
                            hasMore: selectedDatalistFields?.length < datalistFieldsPaginationDetails?.totalCount,
                            scrollableId: 'data_list_infinite_scroll',
                        }}
                        searchProps={{
                            // searchPlaceholder: t(SEARCH_DATALIST),
                            searchValue: pickerFieldSearchText,
                            onChangeSearch: searchPickerFields,
                        }}
                        dropdownViewProps={{
                            selectedLabel: fieldDetails?.propertyPickerDetails?.referenceFieldName || getPickerDetails(fieldDetails?.otherFieldDetail, 'fieldUUID', fieldDetails?.propertyPickerDetails?.referenceFieldUUID)?.fieldName,
                            labelName: datalistFieldLabel,
                            disabled: isEmpty(fieldDetails?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS]) || fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
                        }}
                        onOutSideClick={() => {
                            datalistFieldRef?.current?.click();
                        }}
                    />
                    <button
                        ref={datalistFieldRef}
                        className={gClasses.DisplayNone}
                        onClick={() => {
                            console.log('checkONCLICK2341');
                            !isEmpty(pickerFieldSearchText) && fetchDataListFieldsApiCall({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
                            setPickerFieldsSearchText(EMPTY_STRING);
                        }}
                    />
                </div>
                <div className={styles.DatalistField}>
                    <TextInput
                        labelText={BASIC_FORM_FIELD_CONFIG_STRINGS(t).LABEL}
                        value={fieldDetails[RESPONSE_FIELD_KEYS.FIELD_NAME]}
                        className={styles.FieldInput}
                        onChange={(event) => {
                            setFieldDetails({
                                ...fieldDetails,
                                fieldName: event?.target?.value,
                            });
                        }}
                        errorMessage={errorList?.[RESPONSE_FIELD_KEYS.FIELD_NAME]}
                        required
                        readOnly={isEmpty(fieldDetails?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS])}
                    />
                </div>
            </div>
        </div>
    );
}

export default PickerBasicConfiguration;
