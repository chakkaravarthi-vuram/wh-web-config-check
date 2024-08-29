import { Button, Checkbox, EButtonSizeType, ECheckboxSize, ErrorVariant, SingleDropdown, Size, Text, TextInput, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../ManageFlowFields.module.scss';
import { ALLOWED_DATA_LISTS_FIELD_TYPES, ALLOW_DECIMAL_CHECKBOX, ALLOW_MULTIPLE_CHECKBOX, COMMON_CONSTANTS, FIELD_KEYS, FIELD_LIST, FIELD_TYPES, FIELD_TYPE_IDS, FIELD_TYPE_SEARCH, FORM_LAYOUT_TYPE, MANAGE_FLOW_FIELD_INITIAL_STATE, PATHS, REQUEST_FIELD_KEYS, RESPONSE_FIELD_KEYS } from '../ManageFlowFields.constants';
import { COMMA, EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import PlusIconBlueNew from '../../../../assets/icons/PlusIconBlueNew';
import { manageFlowFieldsConfigDataChange, useManageFlowFieldsConfig } from '../use_manage_flow_fields_reducer/useManageFlowFieldsReducer';
import SelectionFieldComponent from '../../../form/sections/field_configuration/basic_configuration/selection_fields_component/SelectionFieldComponent';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from '../../../form/sections/field_configuration/basic_configuration/BasicConfiguration.strings';
import jsUtility, { isEmpty } from '../../../../utils/jsUtility';
import { FIELD_LIST_OBJECT } from '../../../form/sections/field_configuration/basic_configuration/BasicConfiguration.constants';
import Edit from '../../../../assets/icons/application/EditV2';
import { basicFieldsValidationData, constructSinglePath, deleteErrorListWithId, formatGetFieldsAPIResponse, getFormattedDataListsFieldsResponse, getFormattedDataListsResponse, getFormattedFieldDetails, updateLoaderStatus } from '../ManageFlowFields.utils';
import { generateEventTargetObject } from '../../../../utils/generatorUtils';
import TableConfiguration from '../TableConfiguration';
import { validate } from '../../../../utils/UtilityFunctions';
import { basicFieldsValidationSchema, tableFieldNameSchema } from '../ManageFlowFields.validation.schema';
import { getAllViewDataList } from '../../../../axios/apiService/dataList.apiService';
import { apiGetAllFieldsList } from '../../../../axios/apiService/flow.apiService';
import useApiCall from '../../../../hooks/useApiCall';
import { FIELD_LIST_TYPE, MAX_PAGINATION_SIZE } from '../../../../utils/constants/form.constant';
import { DOCUMENT_FIELD_LABEL } from '../ManageFlowFields.strings';
import Trash from '../../../../assets/icons/application/Trash';
import { deleteField, getFieldDetails } from '../../../../axios/apiService/form.apiService';
import { normalizer } from '../../../../utils/normalizer.utils';

function GeneralConfiguration(props) {
  const { t } = useTranslation();
  const { metaData, isTableColumn = false, isDocumentGeneration = false } = props;
  const { state, dispatch } = useManageFlowFieldsConfig();
  const { isTableColConfigOpen, fieldDetails, columnDetails, isFieldsLoading, fieldsList } = state;
  console.log('fieldDetailsfieldDetails', fieldDetails, columnDetails, metaData);
  const [fieldSearchText, setFieldSearchText] = useState(EMPTY_STRING);
  const [dataListsSearchText, setDataListsSearchText] = useState(EMPTY_STRING);
  const [dataListsFieldsSearchText, setDataListFieldsSearchText] = useState(EMPTY_STRING);
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);

  let fieldTypeKey = FIELD_KEYS.FIELD_DETAILS;

  // useAPI call initial set up
  const { data: allDataList, fetch: dataListFetch, clearData: clearDataList, isLoading: isDataListsLoading, hasMore: hasMoreDataList, page: dataListCurrentPage } = useApiCall({}, true);

  const { data: dataListFields, fetch: dataListFieldFetch, clearData: clearDataListFields, isLoading: isDataListsFieldsLoading, hasMore: hasMoreDataListFields, page: dataListFieldsCurrentPage } = useApiCall({}, true);

  if (isTableColumn) {
    fieldTypeKey = FIELD_KEYS.COLUMN_DETAILS;
  }
  const { fieldName, fieldType, allowDecimal, allowMultiple, columns, path, errorList, dataListDetails = {}, dataListFieldLabel, dataListUuidLabel, fieldTypeLabel, addOnFieldLabel } = state[fieldTypeKey];

  const { dataListUuid, displayFields = [] } = dataListDetails;

  console.log('asjbbadhbas', fieldType);

  useEffect(() => {
    if (!isFieldsLoading) {
      setIsAddFieldOpen(!isEmpty(displayFields?.[1]));
    }
    if (isDocumentGeneration) {
      dispatch(manageFlowFieldsConfigDataChange({ fieldDetails: { ...fieldDetails, fieldType: FIELD_TYPES.FILE_UPLOAD, allowMultiple: MANAGE_FLOW_FIELD_INITIAL_STATE.fieldDetails.allowMultiple } }));
    }
  }, [isFieldsLoading]);

  const isTableNameEmpty = () => {
    const tableName = { fieldName: fieldDetails[RESPONSE_FIELD_KEYS.FIELD_NAME] };
    const fieldName = validate(tableName, tableFieldNameSchema(t));
    if (!jsUtility.isEmpty(fieldName)) {
      dispatch(manageFlowFieldsConfigDataChange({ fieldDetails: { ...fieldDetails, errorList: fieldName } }));
      return true;
    }
    return false;
  };

  const onAdd = () => {
    if (isTableNameEmpty()) return;
    const index = columns?.length || 0;
    const tablePath = [path, constructSinglePath(index, FORM_LAYOUT_TYPE.FIELD)].join(COMMA);
    const data = {
      tablePath,
      dropType: FORM_LAYOUT_TYPE.FIELD,
      [RESPONSE_FIELD_KEYS.TABLE_UUID]: fieldDetails?.fieldUuid,
    };
    dispatch(manageFlowFieldsConfigDataChange({ isTableColConfigOpen: true, columnDetails: { ...columnDetails, ...data }, fieldDetails: { ...fieldDetails, errorList: {} } }));
  };
  const onInputChangeHandler = (event, displayFieldsIndex) => {
    const { id, value, label } = event.target;
    if (id === FIELD_TYPE_IDS.DATA_LISTS.ID) {
      const modifiedErrorList = deleteErrorListWithId(errorList, [
        id,
      ]);
      if (isAddFieldOpen) {
        setIsAddFieldOpen(!isAddFieldOpen);
      }
      if (isDocumentGeneration) {
        console.log('hjbxhjbshbbdb', isDocumentGeneration, state, [fieldTypeKey]);
        dispatch(manageFlowFieldsConfigDataChange({ [fieldTypeKey]: { ...state[fieldTypeKey], fieldType: FIELD_TYPES.FILE_UPLOAD, [id]: value, tableUuid: columnDetails?.tableUuid } }));
      } else {
        dispatch(manageFlowFieldsConfigDataChange({ [fieldTypeKey]: { ...state[fieldTypeKey], dataListUuidLabel: label, errorList: modifiedErrorList, addOnFieldLabel: EMPTY_STRING, dataListFieldLabel: EMPTY_STRING, dataListDetails: { ...dataListDetails, [id]: value, displayFields: MANAGE_FLOW_FIELD_INITIAL_STATE?.fieldDetails.dataListDetails.displayFields }, tableUuid: columnDetails?.tableUuid } }));
      }
    } else if (id === FIELD_TYPE_IDS.DATA_LISTS_FIELD.ID) {
      const modifiedErrorList = deleteErrorListWithId(errorList, [
        `${id},${displayFieldsIndex}`,
        id,
      ]);
      const updatedDisplayFields = [displayFields[0], displayFields[1]];
      updatedDisplayFields[displayFieldsIndex] = value;
      let labelName = EMPTY_STRING;
      if (displayFieldsIndex === 0) {
        labelName = RESPONSE_FIELD_KEYS.DATA_LIST_FIELD_LABEL;
      } else {
        labelName = RESPONSE_FIELD_KEYS.ADD_ON_FIELD_LABEL;
      }
      dispatch(manageFlowFieldsConfigDataChange({
        [fieldTypeKey]: {
          ...state[fieldTypeKey],
          [labelName]: label,
          dataListDetails: { ...dataListDetails, displayFields: updatedDisplayFields },
          errorList: modifiedErrorList,
          tableUuid: columnDetails?.tableUuid,
        },
      }));
    } else if (id === FIELD_TYPE_IDS.FIELD_TYPE.ID) {
      const modifiedErrorList = deleteErrorListWithId(errorList, [
        id,
        `${RESPONSE_FIELD_KEYS.CHOICE_VALUES},0,label`,
        `${RESPONSE_FIELD_KEYS.CHOICE_VALUES},0,value`,
      ]);
      dispatch(manageFlowFieldsConfigDataChange({ [fieldTypeKey]: { ...state[fieldTypeKey], [id]: value, fieldTypeLabel: label, fieldName: state[fieldTypeKey].fieldName, referenceName: state[fieldTypeKey].referenceName, tableUuid: columnDetails?.tableUuid, errorList: modifiedErrorList, choiceValues: [{ label: '', value: '' }] } }));
    } else if (id === FIELD_TYPE_IDS.FIELD_NAME.ID) {
      const modifiedErrorList = deleteErrorListWithId(errorList, [
        id,
      ]);
      dispatch(manageFlowFieldsConfigDataChange({ [fieldTypeKey]: { ...state[fieldTypeKey], [id]: value, tableUuid: columnDetails?.tableUuid, errorList: modifiedErrorList } }));
    } else {
      const modifiedErrorList = deleteErrorListWithId(errorList, [
        id,
      ]);
      dispatch(manageFlowFieldsConfigDataChange({ [fieldTypeKey]: { ...state[fieldTypeKey], [id]: value, errorList: modifiedErrorList, tableUuid: columnDetails?.tableUuid } }));
    }
  };

  console.log('mnmnmnmnsa', state);

  const onAllowClickHandler = (id) => {
    if (id === FIELD_TYPE_IDS.ALLOW_DECIMAL_CHECKBOX_ID) {
      dispatch(manageFlowFieldsConfigDataChange({ [fieldTypeKey]: { ...state[fieldTypeKey], [id]: !state[fieldTypeKey][id], allowedDecimal: COMMON_CONSTANTS.DEFAULT_DECIMAL_VALUES } }));
    } else {
      dispatch(manageFlowFieldsConfigDataChange({ [fieldTypeKey]: { ...state[fieldTypeKey], [id]: !state[fieldTypeKey][id] } }));
    }
  };

  const setFieldDetails = (fieldDetails) => {
    const commonDataToBeValidated = basicFieldsValidationData({ [fieldTypeKey]: fieldDetails }, isTableColumn);
    let commonErrorList = {};

    console.log('mnmnmnmnm', commonDataToBeValidated, errorList);

    if (!isEmpty(errorList)) {
      commonErrorList = validate(commonDataToBeValidated, basicFieldsValidationSchema(t, isDocumentGeneration));
    } else commonErrorList = {};

    dispatch(manageFlowFieldsConfigDataChange({ [fieldTypeKey]: { ...fieldDetails, errorList: commonErrorList } }));
  };

  const onSearchChangeHandler = (event) => {
    setFieldSearchText(event?.target?.target);
  };

  // Get all data lists API (Choose Datalist field)

  const getAllInitialDataLists = (search, page) => {
    const dataListParams = {
      page: page || dataListCurrentPage || 1,
      size: MAX_PAGINATION_SIZE,
      include_system_data_list: 1,
      search,
    };
    if (jsUtility.isEmpty(dataListParams.search)) delete dataListParams.search;
    dataListFetch(getAllViewDataList(dataListParams));
  };

  const getAllDataLists = () => {
    clearDataList({ data: [], paginationData: {} });
    setDataListsSearchText(EMPTY_STRING);
    setDataListFieldsSearchText(EMPTY_STRING);
    getAllInitialDataLists(EMPTY_STRING, 1);
  };

  const onDataListSearchHandler = (event) => {
    setDataListsSearchText(event.target.value);
    getAllInitialDataLists(event.target.value, 1);
  };

  const loadMoreDataList = () => {
    getAllInitialDataLists(dataListsSearchText, dataListCurrentPage + 1);
  };

  // Get All Datalist fields (display fields)

  const getInitialDatalistFields = (search, page, displayFieldsIndex) => {
    const excludedFieldUuids = [];
    const dataListsUuids = [];
    dataListsUuids.push(dataListUuid);
    const dataListFieldParams = {
      page: page || dataListFieldsCurrentPage || 1,
      size: MAX_PAGINATION_SIZE,
      data_list_uuids: dataListsUuids,
      allowed_field_types: ALLOWED_DATA_LISTS_FIELD_TYPES,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      search: search,
    };
    if (!jsUtility.isEmpty(displayFields?.[displayFieldsIndex])) {
      excludedFieldUuids.push(displayFields?.[displayFieldsIndex]);
      dataListFieldParams.exclude_field_uuids = excludedFieldUuids;
    }
    if (jsUtility.isEmpty(dataListFieldParams.search)) delete dataListFieldParams.search;
    dataListFieldFetch(apiGetAllFieldsList(dataListFieldParams));
  };

  const getAllFieldsList = (displayFieldsIndex) => {
    clearDataListFields({ data: [], paginationData: {} });
    setDataListFieldsSearchText(EMPTY_STRING);
    getInitialDatalistFields(EMPTY_STRING, 1, displayFieldsIndex);
  };

  const onDLFieldsSearchChangeHandler = (event, displayFieldsIndex) => {
    setDataListFieldsSearchText(event?.target?.value);
    getInitialDatalistFields(event?.target?.value, 1, displayFieldsIndex);
  };

  const loadMoreDataListFields = (displayFieldsIndex) => {
    getInitialDatalistFields(dataListsFieldsSearchText, dataListFieldsCurrentPage + 1, displayFieldsIndex);
  };

  // On Add Field click handler
  const onAddField = () => {
    setIsAddFieldOpen(!isAddFieldOpen);
    const modifiedErrorList = deleteErrorListWithId(errorList, [`${PATHS.ADD_ON_FIELD}`]);
    const updatedDisplayFields = !isAddFieldOpen ? [displayFields[0], EMPTY_STRING] : [displayFields[0]];
    dispatch(manageFlowFieldsConfigDataChange({ [fieldTypeKey]: { ...state[fieldTypeKey], dataListDetails: { ...dataListDetails, displayFields: updatedDisplayFields }, addOnFieldLabel: EMPTY_STRING, errorList: modifiedErrorList } }));
  };

  console.log('sdhgsd', errorList, state);

  const onDeleteClickHandler = async (data) => {
    updateLoaderStatus(true);
    deleteField(data)
      .then((response) => {
        console.log('ondeleteClickHandler response', response);
        // dispatch(manageFlowFieldsConfigDataChange({ isDependencyListLoading: false, isDependencyModalVisible: true, dependencyData: response }));
        updateLoaderStatus(false);
        apiGetAllFieldsList({ size: 1000, page: 1, sort_by: 1, flow_id: metaData?.moduleId })
          .then((getAPIresponse) => {
            const allFieldsRawData = normalizer(
              getAPIresponse,
              REQUEST_FIELD_KEYS,
              RESPONSE_FIELD_KEYS,
            );
            const formattedResponse = formatGetFieldsAPIResponse(allFieldsRawData, t);
            const currentTableColDetails = formattedResponse?.find((eachFieldDetails) => eachFieldDetails?.fieldUuid === fieldDetails?.fieldUuid);
            dispatch(manageFlowFieldsConfigDataChange({ isFieldsLoading: false, fieldsList: formattedResponse, flowId: metaData?.moduleId, fieldDetails: { ...fieldDetails, columns: currentTableColDetails?.columns } }));
            updateLoaderStatus(false);
          })
          .catch((err) => {
            console.log('kjsdjsndjsn', err);
          });
      })
      .catch((err) => {
        updateLoaderStatus(false);
        console.log('deleteclickerror', err);
        const response = err?.response?.data?.errors?.[0]?.message;
        console.log('njknjsdknjsdnjnds', response);
        dispatch(manageFlowFieldsConfigDataChange({ isDependencyListLoading: false, isDependencyModalVisible: true, dependencyData: response }));
      });
  };

  const getFields1 = async (data) => {
    try {
      updateLoaderStatus(true);
      dispatch(manageFlowFieldsConfigDataChange({ isFieldsLoading: true }));
      const response = await getFieldDetails(data);
      const allFieldsRawData = normalizer(
        response,
        REQUEST_FIELD_KEYS,
        RESPONSE_FIELD_KEYS,
      );
      const formattedResponse = getFormattedFieldDetails({ allData: allFieldsRawData, fieldDetails: null, columnDetails: allFieldsRawData?.fieldDetails, t });

      const currentDetails = fieldsList?.find((eachFieldDetails) => eachFieldDetails?.fieldUuid === formattedResponse?.fieldUuid);

      if (!jsUtility.isEmpty(currentDetails?.columns)) {
        dispatch(manageFlowFieldsConfigDataChange({ fieldDetails: { ...formattedResponse, columns: currentDetails?.columns } }));
      } else {
        dispatch(manageFlowFieldsConfigDataChange({ isFieldsLoading: false, columnDetails: formattedResponse, flowId: metaData?.moduleId }));
      }

      updateLoaderStatus(false);
    } catch (e) {
      dispatch(manageFlowFieldsConfigDataChange({ isFieldsLoading: false }));
      updateLoaderStatus(false);
      console.log('ahjadaghaghdahdahhaha', e);
    }
  };

  const getEachColumn = (column) => {
    console.log('anankannasnasnasndas', column);
    const onEdit = () => {
      getFields1({ flow_id: metaData?.moduleId, field_id: column?._id });
      const tablePath = [path, constructSinglePath(column?.index, FORM_LAYOUT_TYPE.FIELD)].join(COMMA);
      dispatch?.(manageFlowFieldsConfigDataChange({ columnDetails: { ...column, tablePath, tableUuid: fieldDetails?.fieldUuid }, isTableColConfigOpen: true }));
      console.log('kjnjanjdnasjnjzmjkchsdg', column, path);
    };

    const onDeleteTabCol = () => {
      onDeleteClickHandler({ field_uuid: column?.fieldUuid, flow_id: metaData?.moduleId, is_global_field: true });
    };

    return (

      <div className={styles.EachColumn}>
        <Text
          className={styles.EachValue}
          content={column?.[RESPONSE_FIELD_KEYS.FIELD_NAME]}
        />
        <Text
          className={styles.EachValue}
          content={FIELD_LIST_OBJECT(t)?.[column?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]]}
        />
        <div className={styles.ButtonContainer}>
          <Button
            icon={<Edit className={styles.EditIcon} />}
            onClickHandler={onEdit}
            size={EButtonSizeType.SM}
            iconOnly
            type={EMPTY_STRING}
            className={styles.Button}
          />
        </div>
        <div className={styles.ButtonContainer}>
          <Button
            icon={<Trash />}
            onClickHandler={onDeleteTabCol}
            size={EButtonSizeType.SM}
            iconOnly
            type={EMPTY_STRING}
            className={styles.Button}
          />
        </div>
      </div>
    );
  };

  const getColumnComponent = () => {
    console.log('columncomponent');
    if (jsUtility.isEmpty(columns)) return null;
    return (
      <div>
        <div className={styles.ColumnHeader}>
          <Text
            className={cx(styles.EachValue, gClasses.LabelStyle)}
            content={BASIC_FORM_FIELD_CONFIG_STRINGS(t).COLUMN_CONFIG.COLUMN_NAME}
            fontClass={gClasses.FontWeight500}
          />
          <Text
            className={cx(styles.EachValue, gClasses.LabelStyle)}
            content={BASIC_FORM_FIELD_CONFIG_STRINGS(t).COLUMN_CONFIG.COLUMN_TYPE}
            fontClass={gClasses.FontWeight500}
          />
          <div className={styles.EmptyDiv} />
        </div>
        <div className={styles.AllColumn}>
          {columns?.map((column) => getEachColumn(column))}
        </div>
      </div>
    );
  };

  const getActions = () => {
    console.log('getActions');
    return (
      <div className={cx(styles.ActionContainer, gClasses.MT16)}>
        <button id="one" className={gClasses.BlueIconBtn} onClick={onAdd}>
          <PlusIconBlueNew />
          <span>Add Column</span>
        </button>
      </div>
    );
  };

  // Additional fields based on specific data types
  const getAdditionalFields = () => {
    switch (fieldType) {
      case FIELD_TYPES.NUMBER:
        return <div>
          <Checkbox
            id={FIELD_TYPE_IDS.ALLOW_DECIMAL_CHECKBOX_ID}
            className={cx(gClasses.MT14, gClasses.MB16)}
            isValueSelected={allowDecimal}
            details={ALLOW_DECIMAL_CHECKBOX(t).OPTION}
            size={ECheckboxSize.SM}
            onClick={() => onAllowClickHandler(FIELD_TYPE_IDS.ALLOW_DECIMAL_CHECKBOX_ID)}
          />

               </div>;
      case FIELD_TYPES.LINK:
      case FIELD_TYPES.FILE_UPLOAD:
      case FIELD_TYPES.USER_TEAM_PICKER:
        return <div>
          <Checkbox
            id={FIELD_TYPE_IDS.ALLOW_MULTIPLE_CHECKBOX_ID}
            className={cx(gClasses.MT14, gClasses.MB16)}
            isValueSelected={allowMultiple}
            details={ALLOW_MULTIPLE_CHECKBOX(t).OPTION}
            size={ECheckboxSize.SM}
            onClick={() => onAllowClickHandler(FIELD_TYPE_IDS.ALLOW_MULTIPLE_CHECKBOX_ID)}
          />
               </div>;
      case FIELD_TYPES.DROPDOWN:
      case FIELD_TYPES.CHECKBOX:
      case FIELD_TYPES.RADIO_GROUP:
        return <SelectionFieldComponent
          fieldDetails={state[fieldTypeKey]}
          setFieldDetails={setFieldDetails}
          isLookupField={false}
        />;
      case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
        return <SelectionFieldComponent
          fieldDetails={state[fieldTypeKey]}
          setFieldDetails={setFieldDetails}
          isLookupField
        />;
      case FIELD_TYPES.TABLE:
        return <>
          {!isTableColConfigOpen && getActions()}
          {errorList?.columns && <Text
            className={cx(gClasses.MT14, styles.ErrorStyles)}
            id={FIELD_TYPE_IDS.ERROR.COLUMN_ERROR_ID}
            content={errorList?.columns}
            size={ETextSize.SM}
          />}
          {getColumnComponent()}
               </>;
      case FIELD_TYPES.DATA_LIST:
        return <>
          <SingleDropdown
            id={FIELD_TYPE_IDS.DATA_LISTS.ID}
            dropdownViewProps={{
              labelName: FIELD_TYPE_IDS.DATA_LISTS.LABEL,
              onClick: getAllDataLists,
              onKeyDown: getAllDataLists,
              selectedLabel: dataListUuidLabel,
            }}
            searchProps={{
              searchPlaceholder: FIELD_TYPE_SEARCH(t).PLACEHOLDER,
              searchValue: dataListsSearchText,
              onChangeSearch: onDataListSearchHandler,
              searchLabelClass: styles.SearchLabel,
              searchInputClass: styles.SearchInput,
            }}
            infiniteScrollProps={{
              dataLength: allDataList?.length || 0,
              next: loadMoreDataList,
              hasMore: hasMoreDataList,
              scrollableId: `scrollable-${REQUEST_FIELD_KEYS.DATA_LIST_UUID}`,
            }}
            placeholder={FIELD_TYPE_IDS.DATA_LISTS.PLACEHOLDER}
            selectedValue={dataListUuid}
            optionList={getFormattedDataListsResponse(allDataList) || []}
            errorVariant={ErrorVariant.direct}
            errorMessage={errorList?.[FIELD_TYPE_IDS.DATA_LISTS.ID]}
            onClick={(value, label) => {
              onInputChangeHandler(generateEventTargetObject(FIELD_TYPE_IDS.DATA_LISTS.ID, value, { label }));
            }}
            className={gClasses.MT14}
            isLoadingOptions={isDataListsLoading}
            required
          />

          <SingleDropdown
            id={FIELD_TYPE_IDS.DATA_LISTS_FIELD.ID}
            dropdownViewProps={{
              labelName: FIELD_TYPE_IDS.DATA_LISTS_FIELD.LABEL,
              onClick: () => getAllFieldsList(1),
              onKeyDown: () => getAllFieldsList(1),
              selectedLabel: dataListFieldLabel,
            }}
            searchProps={{
              searchPlaceholder: FIELD_TYPE_SEARCH(t).PLACEHOLDER,
              searchValue: dataListsFieldsSearchText,
              onChangeSearch: (e) => onDLFieldsSearchChangeHandler(e, 1),
              searchLabelClass: styles.SearchLabel,
              searchInputClass: styles.SearchInput,
            }}
            infiniteScrollProps={{
              dataLength: dataListFields?.length || 0,
              next: () => loadMoreDataListFields(1),
              hasMore: hasMoreDataListFields,
              scrollableId: `scrollable-${REQUEST_FIELD_KEYS.DISPLAY_FIELDS}`,
            }}
            placeholder={FIELD_TYPE_IDS.FIELD_TYPE.PLACEHOLDER}
            selectedValue={displayFields?.[0]}
            optionList={getFormattedDataListsFieldsResponse(dataListFields) || []}
            errorVariant={ErrorVariant.direct}
            errorMessage={errorList?.[`${[FIELD_TYPE_IDS.DATA_LISTS_FIELD.ID]},0`] || errorList?.displayFields}
            onClick={(value, label) => {
              onInputChangeHandler(generateEventTargetObject(FIELD_TYPE_IDS.DATA_LISTS_FIELD.ID, value, { label }), 0);
            }}
            className={gClasses.MT14}
            isLoadingOptions={isDataListsFieldsLoading}
            required
          />

          {isAddFieldOpen &&
            <SingleDropdown
              id={FIELD_TYPE_IDS.DATA_LISTS_FIELD.ID}
              dropdownViewProps={{
                onClick: () => getAllFieldsList(0),
                onKeyDown: () => getAllFieldsList(0),
                selectedLabel: addOnFieldLabel,
              }}
              searchProps={{
                searchPlaceholder: FIELD_TYPE_SEARCH(t).PLACEHOLDER,
                searchValue: dataListsFieldsSearchText,
                onChangeSearch: (e) => onDLFieldsSearchChangeHandler(e, 0),
                searchLabelClass: styles.SearchLabel,
                searchInputClass: styles.SearchInput,
              }}
              infiniteScrollProps={{
                dataLength: dataListFields?.length || 0,
                next: () => loadMoreDataListFields(0),
                hasMore: hasMoreDataListFields,
                scrollableId: `scrollable-${REQUEST_FIELD_KEYS.DISPLAY_FIELDS}`,
              }}
              placeholder={FIELD_TYPE_IDS.FIELD_TYPE.PLACEHOLDER}
              selectedValue={displayFields?.[1]}
              optionList={getFormattedDataListsFieldsResponse(dataListFields) || []}
              errorVariant={ErrorVariant.direct}
              errorMessage={errorList?.[`${[FIELD_TYPE_IDS.DATA_LISTS_FIELD.ID]},1`]}
              onClick={(value, label) => {
                onInputChangeHandler(generateEventTargetObject(FIELD_TYPE_IDS.DATA_LISTS_FIELD.ID, value, { label }), 1);
              }}
              className={gClasses.MT14}
              isLoadingOptions={isDataListsFieldsLoading}
            />
          }

          <div className={cx(styles.ActionContainer, gClasses.MT16)}>
            <button id="one" className={gClasses.BlueIconBtn} onClick={onAddField}>
              {!isAddFieldOpen && <PlusIconBlueNew />}
              <span>{isAddFieldOpen ? 'Remove Field' : 'Add Field'}</span>
            </button>
          </div>

          <Checkbox
            id={FIELD_TYPE_IDS.ALLOW_MULTIPLE_CHECKBOX_ID}
            className={cx(gClasses.MT14, gClasses.MB16)}
            isValueSelected={allowMultiple}
            details={ALLOW_MULTIPLE_CHECKBOX(t).OPTION}
            size={ECheckboxSize.SM}
            onClick={() => onAllowClickHandler(FIELD_TYPE_IDS.ALLOW_MULTIPLE_CHECKBOX_ID)}
          />
               </>;
      default:
        return null;
    }
  };

  return (
    <div>
      <TextInput
        id={FIELD_TYPE_IDS.FIELD_NAME.ID}
        labelText={FIELD_TYPE_IDS.FIELD_NAME.LABEL}
        onChange={onInputChangeHandler}
        value={fieldName}
        size={Size.lg}
        errorMessage={errorList?.[FIELD_TYPE_IDS.FIELD_NAME.ID]}
        className={cx(gClasses.MB14)}
        required
      />
      <SingleDropdown
        id={FIELD_TYPE_IDS.FIELD_TYPE.ID}
        dropdownViewProps={{
          labelName: FIELD_TYPE_IDS.FIELD_TYPE.LABEL,
          disabled: isTableColumn ? !jsUtility.isEmpty(columnDetails?.fieldUuid) : !jsUtility.isEmpty(fieldDetails?.fieldUuid) || isDocumentGeneration,
          selectedLabel: isDocumentGeneration ? DOCUMENT_FIELD_LABEL(t) : fieldTypeLabel,
        }}
        searchProps={{
          searchPlaceholder: FIELD_TYPE_SEARCH(t).PLACEHOLDER,
          searchValue: fieldSearchText,
          onChangeSearch: onSearchChangeHandler,
          searchLabelClass: styles.SearchLabel,
          searchInputClass: styles.SearchInput,
        }}
        placeholder={FIELD_TYPE_IDS.FIELD_TYPE.PLACEHOLDER}
        selectedValue={isDocumentGeneration ? FIELD_TYPES.FILE_UPLOAD : fieldType}
        optionList={isTableColumn ? FIELD_LIST(t, true) : FIELD_LIST(t)}
        errorVariant={ErrorVariant.direct}
        errorMessage={errorList?.[FIELD_TYPE_IDS.FIELD_TYPE.ID]}
        onClick={(value, label) => {
          onInputChangeHandler(generateEventTargetObject(FIELD_TYPE_IDS.FIELD_TYPE.ID, value, { label }));
        }}
        required
      />
      {(isTableColConfigOpen && !isTableColumn) && <TableConfiguration
        isModalOpen={isTableColConfigOpen}
        metaData={metaData}
      />}
      {getAdditionalFields()}
      {isAddFieldOpen && onAddField}
    </div>
  );
}

export default GeneralConfiguration;
