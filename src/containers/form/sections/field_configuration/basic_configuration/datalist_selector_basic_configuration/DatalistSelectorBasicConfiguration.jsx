import { Button, SingleDropdown, EButtonType, EButtonSizeType, Label } from '@workhall-pvt-lmt/wh-ui-library';
import React, { useContext, useEffect, useRef, useState } from 'react';
import cx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { getAllViewDataList } from '../../../../../../axios/apiService/dataList.apiService';
import { FIELD_LIST_TYPE, INITIAL_PAGE, MAX_PAGINATION_SIZE } from '../../../../../../utils/constants/form.constant';
import { CancelToken, isBasicUserMode } from '../../../../../../utils/UtilityFunctions';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { ALLOWED_DATALIST_FIELD_TYPES, EXISTING_DATA_LIST_DELETED_ERROR_INSTRUCTION, getDataListFieldDetails, getDatalistFieldValidationErrorMessage, getModifiedDataLists } from './DatalistSelectorBasicConfiguration.utils';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import { cloneDeep, isEmpty } from '../../../../../../utils/jsUtility';
import { getAllDataListFields } from '../../../../../../axios/apiService/form.apiService';
import styles from './DatalistSelectorBasicConfiguration.module.scss';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from '../BasicConfiguration.strings';
import ThemeContext from '../../../../../../hoc/ThemeContext';
import { RESPONSE_FIELD_KEYS } from '../../../../../../utils/constants/form/form.constant';

const cancelToken = new CancelToken();
const fieldsCancelToken = new CancelToken();

function DatalistSelectorBasicConfiguration(props) {
    const { setFieldDetails, fieldDetails = {}, tableUuid } = props;
    const { errorList = {} } = fieldDetails;

    const { t } = useTranslation();

    const history = useHistory();
    const { colorScheme, colorSchemeDefault } = useContext(ThemeContext);
    const isBasicUser = isBasicUserMode(history);
    const colorSchema = isBasicUser ? colorScheme : colorSchemeDefault;

    const [dataLists, setDataLists] = useState([]);
    const [datalistsPaginationDetails, setDatalistsPaginationDetails] = useState({
        page: 1,
        totalCount: 0,
    });
    const [datalistSearchText, setDatalistSearchText] = useState(EMPTY_STRING);
    const extraParam = tableUuid ? { table_uuid: tableUuid } : {};

    const datalistFieldRef = useRef();
    const datalistRef = useRef();
    const [selectedDatalistFields, setSelectedDatalistFields] = useState([]);
    const [datalistFieldsPaginationDetails, setDatalistFieldsPaginationDetails] = useState([]);
    const [datalistFieldsCount, setDatalistFieldsCount] = useState(0);
    const [datalistFieldsSearchText, setDatalistFieldsSearchText] = useState(EMPTY_STRING);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDataListsApiCall = (params) => {
        getAllViewDataList({
            ...params,
            ...extraParam,
            include_system_data_list: 1,
          }, cancelToken.setCancelToken).then((res) => {
            setIsLoading(false);
            const { dataListPaginationDetails = {}, dataList = [] } = res;
            const modifiedDatalistFields = getModifiedDataLists(dataList);
            if (params?.page > 1) {
                setDataLists([...dataLists, ...modifiedDatalistFields || []]);
                setDatalistsPaginationDetails(dataListPaginationDetails);
            } else {
                setDataLists([...modifiedDatalistFields || []]);
                setDatalistsPaginationDetails(dataListPaginationDetails);
            }
            console.log('getALlDatalistssss', res);
          }).catch((res) => {
            setIsLoading(false);
            console.log('getALlDatalistssss err', res);
          });
    };

    const fetchDataListFieldsApiCall = (params) => {
        console.log('getALlDatalistssss fields1 fetchDataListFieldsApiCall');
        const param = {
            ...params,
            data_list_uuids: [fieldDetails?.[RESPONSE_FIELD_KEYS.SELECTED_DATALIST]?.[RESPONSE_FIELD_KEYS.DATA_LIST_UUID]],
            allowed_field_types: ALLOWED_DATALIST_FIELD_TYPES,
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
        fetchDataListsApiCall({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
    }, [fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]]);

    useEffect(() => {
        console.log('getALlDatalistssss fields0', fieldDetails);
        if (fieldDetails?.[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS]?.length === 2) setDatalistFieldsCount(2);
        else setDatalistFieldsCount(1);
        fieldDetails?.[RESPONSE_FIELD_KEYS.SELECTED_DATALIST]?.[RESPONSE_FIELD_KEYS.DATA_LIST_UUID] && fetchDataListFieldsApiCall({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
    }, [fieldDetails?.[RESPONSE_FIELD_KEYS.SELECTED_DATALIST]?.[RESPONSE_FIELD_KEYS.DATA_LIST_UUID]]);

    useEffect(() => {
        if (!isEmpty(fieldDetails?.dataListDetails) && !isLoading) {
            const dataListFieldData = getDataListFieldDetails(fieldDetails, 'fieldUUID', fieldDetails?.dataListDetails?.displayFields);
            const errorList = {};
            if (isEmpty(fieldDetails?.dataList) && fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_UUID]) {
                errorList[`${RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS},${RESPONSE_FIELD_KEYS.DATA_LIST_ID}`] = EXISTING_DATA_LIST_DELETED_ERROR_INSTRUCTION(t);
            }
            const displayFields = [{
                fieldName: dataListFieldData?.[0]?.fieldName,
                fieldUUID: dataListFieldData?.[0]?.fieldUUID,
            }];
            if (dataListFieldData?.[1]) {
                setDatalistFieldsCount(2);
                displayFields.push({
                    fieldName: dataListFieldData?.[1]?.fieldName,
                    fieldUUID: dataListFieldData?.[1]?.fieldUUID,
                });
            }
            setFieldDetails({
                ...fieldDetails,
                errorList,
                displayFields: displayFields,
                selectedDatalist: {
                    dataListName: fieldDetails?.dataList?.dataListName,
                    dataListUUID: fieldDetails?.dataList?.dataListUUID,
                },
            }, false, true);
        }
    }, [fieldDetails?.dataListDetails, isLoading]);

    const loadMoreDatalists = () => {
        fetchDataListsApiCall({
            page: datalistsPaginationDetails.page + 1,
            size: MAX_PAGINATION_SIZE,
            ...(!isEmpty(datalistSearchText)) ? { search: datalistSearchText } : null,
        });
    };

    const searchDatalists = (event) => {
        const searchText = event?.target?.value || EMPTY_STRING;
        setDatalistSearchText(searchText);
        fetchDataListsApiCall({
            page: INITIAL_PAGE,
            size: MAX_PAGINATION_SIZE,
            ...(!isEmpty(searchText)) ? { search: searchText } : null,
        });
    };

    const onDatalistSelectionChangeHandler = (value, label, optionList) => {
        const datalistId = optionList?.find?.((option) => option?.value === value)?.datalistId;
        console.log('datalistIddatalistId', datalistId, optionList, value);
        if (datalistId) {
            setFieldDetails({
                ...fieldDetails,
                [RESPONSE_FIELD_KEYS.SELECTED_DATALIST]: {
                    [RESPONSE_FIELD_KEYS.DATA_LIST_NAME]: label,
                    [RESPONSE_FIELD_KEYS.DATA_LIST_UUID]: value,
                    [RESPONSE_FIELD_KEYS.DATA_LIST_ID]: datalistId,
                },
                [RESPONSE_FIELD_KEYS.DISPLAY_FIELDS]: [],
            });
        }
        fetchDataListsApiCall({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
    };

    const onDatalistFieldSelectionHandler = (value, label, index) => {
        const selectedFields = cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS] || [];
        console.log('chyeck selected', cloneDeep(fieldDetails), selectedFields);
        selectedFields[index] = {
            [RESPONSE_FIELD_KEYS.FIELD_NAME]: label,
            [RESPONSE_FIELD_KEYS.FIELD_UUID]: value,
        };
        setFieldDetails({
            ...fieldDetails,
            [RESPONSE_FIELD_KEYS.DISPLAY_FIELDS]: selectedFields,
        });
        fetchDataListFieldsApiCall({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
    };

    const removeDatalistField = () => {
        setDatalistFieldsCount(1);
        let selectedFields = cloneDeep(fieldDetails)?.[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS] || [];
        selectedFields = [...selectedFields.slice(0, 1), ...selectedFields.slice(2)];
        setFieldDetails({
            ...fieldDetails,
            [RESPONSE_FIELD_KEYS.DISPLAY_FIELDS]: selectedFields,
        });
    };

    const loadMoreDatalistFields = () => {
        fetchDataListFieldsApiCall({
            page: datalistFieldsPaginationDetails.page + 1,
            size: MAX_PAGINATION_SIZE,
            ...(!isEmpty(datalistFieldsSearchText)) ? { search: datalistFieldsSearchText } : null,
        });
    };

    const searchDatalistFields = (event) => {
        const searchText = event?.target?.value || EMPTY_STRING;
        setDatalistFieldsSearchText(searchText);
        fetchDataListFieldsApiCall({
            page: INITIAL_PAGE,
            size: MAX_PAGINATION_SIZE,
            ...(!isEmpty(searchText)) ? { search: searchText } : null,
        });
    };

    const firstDatalistFieldList = selectedDatalistFields?.filter((field) =>
    field.value !== fieldDetails?.[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS]?.[1]?.fieldUUID) || [];

    const secondDatalistFieldList = selectedDatalistFields?.filter((field) =>
    field.value !== fieldDetails?.[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS]?.[0]?.fieldUUID) || [];

    return (
        <div>
            <Label
                id={BASIC_FORM_FIELD_CONFIG_STRINGS(t).DATALIST_SELECTOR.PICKER.ID}
                labelName={BASIC_FORM_FIELD_CONFIG_STRINGS(t).DATALIST_SELECTOR.PICKER.LABEL}
                isRequired
                className={gClasses.MT16}
            />
            <SingleDropdown
                getPopperContainerClassName={() => styles.DatalistDropdownList}
                optionList={dataLists}
                onClick={(value, label, optionList) => onDatalistSelectionChangeHandler(value, label, optionList)}
                selectedValue={fieldDetails?.[RESPONSE_FIELD_KEYS.SELECTED_DATALIST]?.[RESPONSE_FIELD_KEYS.DATA_LIST_UUID]}
                errorMessage={getDatalistFieldValidationErrorMessage(errorList, RESPONSE_FIELD_KEYS.DATA_LIST_ID) || getDatalistFieldValidationErrorMessage(errorList, RESPONSE_FIELD_KEYS.DATA_LIST_UUID)}
                infiniteScrollProps={{
                    dataLength: dataLists?.length,
                    next: loadMoreDatalists,
                    hasMore: dataLists?.length < datalistsPaginationDetails?.totalCount,
                    scrollableId: 'data_list_infinite_scroll',
                }}
                searchProps={{
                    // searchPlaceholder: t(SEARCH_DATALIST),
                    searchValue: datalistSearchText,
                    onChangeSearch: searchDatalists,
                }}
                dropdownViewProps={{
                    selectedLabel: fieldDetails?.[RESPONSE_FIELD_KEYS.SELECTED_DATALIST]?.[RESPONSE_FIELD_KEYS.DATA_LIST_NAME],
                    onBlur: () => setDatalistSearchText(EMPTY_STRING),
                    disabled: !isEmpty(fieldDetails?.fieldUUID),
                    isLoading: isLoading,
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
                    !isEmpty(datalistSearchText) && fetchDataListsApiCall({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
                    setDatalistSearchText(EMPTY_STRING);
                }}
            />
            {fieldDetails?.[RESPONSE_FIELD_KEYS.SELECTED_DATALIST]?.[RESPONSE_FIELD_KEYS.DATA_LIST_UUID] &&
                <div className={styles.DatalistFieldsList}>
                    <Label
                        labelName={BASIC_FORM_FIELD_CONFIG_STRINGS(t).DATALIST_SELECTOR.FIELD.LABEL}
                        isRequired
                        className={gClasses.MT16}
                    />
                    <SingleDropdown
                        optionList={firstDatalistFieldList}
                        getPopperContainerClassName={() => styles.DatalistFieldDropdown}
                        onClick={(value, label) => onDatalistFieldSelectionHandler(value, label, 0)}
                        selectedValue={fieldDetails?.[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS]?.[0]?.fieldUUID}
                        errorMessage={getDatalistFieldValidationErrorMessage(errorList, RESPONSE_FIELD_KEYS.DISPLAY_FIELDS)}
                        infiniteScrollProps={{
                            dataLength: selectedDatalistFields?.length,
                            next: loadMoreDatalistFields,
                            hasMore: selectedDatalistFields?.length < datalistFieldsPaginationDetails?.totalCount,
                            scrollableId: 'data_list_fields_infinite_scroll',
                        }}
                        searchProps={{
                            // searchPlaceholder: t(SEARCH_DATALIST),
                            searchValue: datalistFieldsSearchText,
                            onChangeSearch: searchDatalistFields,
                        }}
                        dropdownViewProps={{
                            selectedLabel: fieldDetails?.[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS]?.[0]?.[RESPONSE_FIELD_KEYS.FIELD_NAME],
                            onBlur: () => setDatalistFieldsSearchText(EMPTY_STRING),
                        }}
                        onOutSideClick={() => {
                            datalistFieldRef?.current?.click();
                        }}
                    />
                    {datalistFieldsCount === 2 ?
                        (
                            <div className={gClasses.MT16}>
                                <SingleDropdown
                                    getPopperContainerClassName={() => styles.DatalistFieldDropdown}
                                    optionList={secondDatalistFieldList}
                                    onClick={(value, label) => onDatalistFieldSelectionHandler(value, label, 1)}
                                    selectedValue={fieldDetails?.[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS]?.[1]?.fieldUUID}
                                    errorMessage={errorList?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]}
                                    infiniteScrollProps={{
                                        dataLength: selectedDatalistFields?.length,
                                        next: loadMoreDatalistFields,
                                        hasMore: selectedDatalistFields?.length < datalistFieldsPaginationDetails?.totalCount,
                                        scrollableId: 'data_list_fields_infinite_scroll1 ',
                                    }}
                                    searchProps={{
                                        // searchPlaceholder: t(SEARCH_DATALIST),
                                        searchValue: datalistFieldsSearchText,
                                        onChangeSearch: searchDatalistFields,
                                    }}
                                    dropdownViewProps={{
                                        selectedLabel: fieldDetails?.[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS]?.[1]?.[RESPONSE_FIELD_KEYS.FIELD_NAME],
                                        onBlur: () => setDatalistFieldsSearchText(EMPTY_STRING),
                                    }}
                                    onOutSideClick={() => {
                                        datalistFieldRef?.current?.click();
                                    }}
                                />
                            </div>
                        ) : selectedDatalistFields?.length > 1 ?
                        (
                            <div className={cx(gClasses.DisplayFlex, gClasses.JusEnd)}>
                                <Button
                                    type={EButtonType.SECONDARY}
                                    onClickHandler={() => setDatalistFieldsCount(2)}
                                    size={EButtonSizeType.SM}
                                    buttonText={BASIC_FORM_FIELD_CONFIG_STRINGS(t).DATALIST_SELECTOR.ADD_MORE}
                                    className={styles.AddMoreFields}
                                    noBorder
                                    colorSchema={colorSchema}
                                />
                            </div>
                        ) : null
                    }
                    <button
                        ref={datalistFieldRef}
                        className={gClasses.DisplayNone}
                        onClick={() => {
                            console.log('checkONCLICK2341');
                            !isEmpty(datalistFieldsSearchText) && fetchDataListFieldsApiCall({ page: INITIAL_PAGE, size: MAX_PAGINATION_SIZE });
                            setDatalistFieldsSearchText(EMPTY_STRING);
                        }}
                    />
                </div>
            }
            {datalistFieldsCount === 2 &&
                <div className={cx(gClasses.MT10, gClasses.DisplayFlex, gClasses.JusEnd, styles.DatalistFieldsList)}>
                    <Button
                        type={EButtonType.SECONDARY}
                        onClickHandler={removeDatalistField}
                        size={EButtonSizeType.SM}
                        buttonText={BASIC_FORM_FIELD_CONFIG_STRINGS(t).DATALIST_SELECTOR.REMOVE_FIELD}
                        className={cx(gClasses.FTwo12RedV8, styles.RemoveFields)}
                        noBorder
                    />
                </div>
            }
        </div>
    );
}

export default DatalistSelectorBasicConfiguration;
