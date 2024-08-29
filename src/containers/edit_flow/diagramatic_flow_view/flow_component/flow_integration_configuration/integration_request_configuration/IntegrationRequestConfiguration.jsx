import React, { useState, useEffect } from 'react';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import { getIntegrationMappingFields } from 'redux/actions/FlowStepConfiguration.Action';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep, get, isArray, isEmpty, set, unset } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import MappingTable from 'containers/integration/mapping_table/MappingTable';
import RecursiveMappingTable from 'containers/integration/recursive_mapping_table/RecursiveMappingTable';
import { FEILD_LIST_DROPDOWN_TYPE } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { TABLE_FIELD_LIST_TYPE } from 'utils/ValidationConstants';
import { BS } from 'utils/UIConstants';
import NoRequestInputs from 'containers/integration/no_request_inputs/NoRequestInputs';
import { FEATURE_INTEGRATION_STRINGS } from 'containers/integration/Integration.strings';
import { useTranslation } from 'react-i18next';
import { INTEGRATION_CONSTANTS } from '../FlowIntegrationConfiguration.constants';
import styles from './IntegrationRequestConfiguration.module.scss';
import configStyles from '../FlowIntegrationConfiguration.module.scss';
import BodyRowComponent from './BodyRowComponent';
import { REQUEST_CONFIGURATION_STRINGS } from './IntegrationRequestConfiguration.utils';

let cancelToken = null;
const getCancelToken = (token) => {
  cancelToken = token;
};

function IntegerationRequestConfiguration(props) {
    const { currentIntegrationData = {}, integration_error_list = {}, flowData,
    onGetAllFieldsByFilter, updateIntegerationData, queryFieldsUuids = [], loadingMappingFields } = props;
    const { lstAllFields = [] } = flowData;
    const { query_params = [], dataFields = [], request_body = [], relative_path = [], event_headers = [] } = currentIntegrationData;
    const { requestBodyErrorList = {}, requestError = {} } = integration_error_list;

    const { t } = useTranslation();

    const { REQUEST_CONFIGURATION } = INTEGRATION_CONSTANTS;
    const { NO_EVENT_PARAMS } = FEATURE_INTEGRATION_STRINGS;
    const [inputValue, setInputValue] = useState();
    const [isForceDropDownClose, setonForceDropdownClose] = useState(false);
    const [staticValueError, setStaticValueError] = useState(EMPTY_STRING);
    const getAllFieldsByFilterApi = (searchText = EMPTY_STRING, isSearch = false) => {
      setonForceDropdownClose(false);
        const paginationData = {
          // search: '',
          page: 1,
          size: 1000,
          // sort_field: '',
          sort_by: 1,
          flow_id: flowData.flow_id,
          include_property_picker: 1,
          allowed_field_types: REQUEST_CONFIGURATION_STRINGS.ADD_EVENT.REQUEST_ALLOWED_FIELD_TYPES,
        };
        if (isSearch && searchText) {
          paginationData.search = searchText;
        }
        if (onGetAllFieldsByFilter) {
          if (cancelToken) cancelToken();
          onGetAllFieldsByFilter(paginationData, 'lstAllFields', queryFieldsUuids, FEILD_LIST_DROPDOWN_TYPE.DIRECT, EMPTY_STRING, getCancelToken);
        }
    };

    useEffect(() => {
      getAllFieldsByFilterApi();
    }, []);

    const onAssignRelativePathValue = (event, index, type = REQUEST_CONFIGURATION.RELATIVE_PATH.VALUE.TYPES.EXPRESSION) => {
      console.log('onsetClicked', event);
      if (event?.target?.value) {
        const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
        const clonedRelativePath = cloneDeep(relative_path);
        if (!isEmpty(clonedRelativePath[index]?.value) &&
        clonedRelativePath[index]?.type === REQUEST_CONFIGURATION.RELATIVE_PATH.VALUE.TYPES.EXPRESSION &&
        !dataFields.includes(clonedRelativePath[index]?.value?.value)) {
        const updatedDataFields = dataFields.filter((fieldId) =>
        fieldId !== clonedRelativePath[index]?.value?.value);
        clonedIntegerationDetails.dataFields = updatedDataFields;
        }
        clonedRelativePath[index].value = event.target.value;
        clonedRelativePath[index].type = type;
        if (type === REQUEST_CONFIGURATION.RELATIVE_PATH.VALUE.TYPES.EXPRESSION) {
          clonedRelativePath[index].field_details = event.target;
          clonedRelativePath[index].test_value = EMPTY_STRING;
        } else {
          clonedRelativePath[index].test_value = event.target.value;
        }
        console.log('clonedIntegerationDetails0', type);
        if (type === REQUEST_CONFIGURATION.RELATIVE_PATH.VALUE.TYPES.EXPRESSION) {
          console.log('clonedIntegerationDetails0', isArray(clonedIntegerationDetails.dataFields));
          if (isArray(clonedIntegerationDetails.dataFields)) {
            clonedIntegerationDetails.dataFields.push(event.target.value);
          } else {
            clonedIntegerationDetails.dataFields = [];
            clonedIntegerationDetails.dataFields.push(event.target.value);
          }
        }
        clonedIntegerationDetails.relative_path = clonedRelativePath;
        clonedIntegerationDetails.test_relative_path = cloneDeep(clonedRelativePath);
        unset(clonedIntegerationDetails, ['integration_error_list', 'requestError',
        `${REQUEST_CONFIGURATION.RELATIVE_PATH.ID},${index},value`]);
        console.log('clonedIntegerationDetails', clonedIntegerationDetails);
        updateIntegerationData(clonedIntegerationDetails);
      }
    };

    const onAssignQueryParamValue = (event, index, type = REQUEST_CONFIGURATION.QUERY.VALUE.TYPES.EXPRESSION, mappingKey) => {
      console.log('onsetClicked', event);
      let testMappingKey;

      if (mappingKey === REQUEST_CONFIGURATION.HEADERS.ID) {
        testMappingKey = REQUEST_CONFIGURATION.HEADERS.TEST_ID;
      } else {
        testMappingKey = REQUEST_CONFIGURATION.QUERY.TEST_ID;
      }

      if (event?.target?.value) {
        const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
        const clonedQueryHeaders = cloneDeep(clonedIntegerationDetails[mappingKey]);
        if (!isEmpty(clonedQueryHeaders[index]?.value) &&
        clonedQueryHeaders[index]?.type === REQUEST_CONFIGURATION.QUERY.VALUE.TYPES.EXPRESSION &&
        !dataFields.includes(clonedQueryHeaders[index]?.value?.value)) {
        const updatedDataFields = dataFields.filter((fieldId) =>
        fieldId !== clonedQueryHeaders[index]?.value?.value);
        clonedIntegerationDetails.dataFields = updatedDataFields;
        }
        clonedQueryHeaders[index].value = event.target.value;
        clonedQueryHeaders[index].type = type;
        if (type === REQUEST_CONFIGURATION.QUERY.VALUE.TYPES.EXPRESSION) {
          clonedQueryHeaders[index].field_details = event.target;
          clonedQueryHeaders[index].test_value = EMPTY_STRING;
        } else {
          clonedQueryHeaders[index].test_value = event.target.value;
        }
        console.log('clonedIntegerationDetails0', type);
        if (type === REQUEST_CONFIGURATION.QUERY.VALUE.TYPES.EXPRESSION) {
          console.log('clonedIntegerationDetails0', isArray(clonedIntegerationDetails.dataFields));
          if (isArray(clonedIntegerationDetails.dataFields)) {
            clonedIntegerationDetails.dataFields.push(event.target.value);
          } else {
            clonedIntegerationDetails.dataFields = [];
            clonedIntegerationDetails.dataFields.push(event.target.value);
          }
        }
        clonedIntegerationDetails[mappingKey] = clonedQueryHeaders;
        clonedIntegerationDetails[testMappingKey] = cloneDeep(clonedQueryHeaders);
        unset(clonedIntegerationDetails, ['integration_error_list', 'requestError',
        `${mappingKey},${index},value`]);
        console.log('clonedIntegerationDetails', clonedIntegerationDetails);
        updateIntegerationData(clonedIntegerationDetails);
      }
    };

    const initialRelativePathRow = (index) => {
      const currentMappingList = cloneDeep(relative_path);
      const isRequired = currentMappingList[index]?.isRequired ? <span className={styles.Required}>&nbsp;*</span> : null;
      return (
        <>
          <div className={cx(styles.InputColMax, gClasses.MR24)}>
            <div className={cx(styles.KeyName, gClasses.ReadOnlyBg, gClasses.FTwo13GrayV3)}>
              {currentMappingList[index]?.key_name}
              {isRequired}
            </div>
          </div>
          <div className={styles.InputColMax}>
            <Dropdown
              optionList={lstAllFields}
              placeholder={t(REQUEST_CONFIGURATION.RELATIVE_PATH.VALUE.PLACEHOLDER)}
              id={`value-${index}`}
              showNoDataFoundOption
              setInitialSearchText
              showSelectedValTooltip
              initialSearchText={currentMappingList[index]?.type === 'direct' ? currentMappingList[index]?.value : EMPTY_STRING}
              selectedValue={currentMappingList[index]?.type === 'expression' ? currentMappingList[index]?.field_details?.label : currentMappingList[index]?.value}
              onChange={(event) => onAssignRelativePathValue(event, index, REQUEST_CONFIGURATION.RELATIVE_PATH.VALUE.TYPES.EXPRESSION)}
              strictlySetSelectedValue
              setSelectedValue
              errorMessage={requestError[`${REQUEST_CONFIGURATION.RELATIVE_PATH.ID},${index},${REQUEST_CONFIGURATION.RELATIVE_PATH.VALUE.ID}`]}
              hideDropdownListLabel
              isRequired
              disableFocusFilter
              loadData={getAllFieldsByFilterApi}
              hideLabel
              dropdownListLabel="Select Field"
              noDataFoundOptionLabel="No fields found"
              isPaginated
              hasMore={false}
              // loadDataHandler={onLoadMoreExternalFields}
              enableSearch
              onSetClicked={(inputSetClicked) => {
                console.log('inputSetClicked', inputSetClicked);
                if (isEmpty(inputValue)) {
                  setStaticValueError('Static Value should have at least 1 character');
                } else {
                  setStaticValueError(EMPTY_STRING);
                  onAssignRelativePathValue(
                    {
                      target: {
                        value: inputValue,
                      },
                    },
                    index,
                    REQUEST_CONFIGURATION.RELATIVE_PATH.VALUE.TYPES.DIRECT,
                  );
                  setonForceDropdownClose(true);
                }
              }}
              onSearchInputChange={(search) => {
                setInputValue(search);
                setStaticValueError(EMPTY_STRING);
              }}
              isForceDropDownClose={isForceDropDownClose}
              isLoadingOptions={loadingMappingFields}
              setValueError={staticValueError}
              setValuePlaceholder={t(INTEGRATION_CONSTANTS.ENTER_STATIC_VALUE)}
            />
          </div>
        </>
      );
    };

    const initialRow = (index, mappingKey) => {
      const currentMappingList = cloneDeep(currentIntegrationData[mappingKey]);
      const isRequired = currentMappingList[index]?.isRequired ? <span className={styles.Required}>&nbsp;*</span> : null;

      return (
        <>
          <div className={cx(styles.InputColMax, gClasses.MR24)}>
            <div className={cx(styles.KeyName, gClasses.ReadOnlyBg, gClasses.FTwo13GrayV3)}>
              {currentMappingList[index]?.key_name}
              {isRequired}
            </div>
          </div>
          <div className={styles.InputColMax}>
            <Dropdown
              optionList={lstAllFields}
              placeholder={t(REQUEST_CONFIGURATION.QUERY.VALUE.PLACEHOLDER)}
              id={`value-${index}`}
              showNoDataFoundOption
              setInitialSearchText
              showSelectedValTooltip
              initialSearchText={currentMappingList[index]?.type === 'direct' ? currentMappingList[index]?.value : EMPTY_STRING}
              selectedValue={currentMappingList[index]?.type === 'expression' ? currentMappingList[index]?.field_details?.label : currentMappingList[index]?.value} // field uuid
              onChange={(event) => onAssignQueryParamValue(event, index, REQUEST_CONFIGURATION.QUERY.VALUE.TYPES.EXPRESSION, mappingKey)}
              strictlySetSelectedValue
              setSelectedValue
              errorMessage={requestError[`${mappingKey},${index},${REQUEST_CONFIGURATION.QUERY.VALUE.ID}`]}
              hideDropdownListLabel
              isRequired
              disableFocusFilter
              loadData={getAllFieldsByFilterApi}
              hideLabel
              dropdownListLabel="Select Field"
              noDataFoundOptionLabel="No fields found"
              isPaginated
              hasMore={false}
              // loadDataHandler={onLoadMoreExternalFields}
              enableSearch
              onSetClicked={(inputSetClicked) => {
                if (isEmpty(inputValue)) {
                  setStaticValueError(t(INTEGRATION_CONSTANTS.STATIC_VALUE_ERROR));
                } else {
                  setStaticValueError(EMPTY_STRING);
                  console.log('inputSetClicked', inputSetClicked);
                  onAssignQueryParamValue(
                    {
                      target: {
                        value: inputValue,
                      },
                    },
                    index,
                    REQUEST_CONFIGURATION.QUERY.VALUE.TYPES.DIRECT,
                    mappingKey,
                  );
                  setonForceDropdownClose(true);
                }
              }}
              onSearchInputChange={(search) => {
                setStaticValueError(EMPTY_STRING);
                setInputValue(search);
              }}
              isForceDropDownClose={isForceDropDownClose}
              isLoadingOptions={loadingMappingFields}
              setValueError={staticValueError}
              setValuePlaceholder={t(INTEGRATION_CONSTANTS.ENTER_STATIC_VALUE)}
            />
          </div>
        </>
      );
    };

    const handleRowDelete = (path) => {
      const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
      path = (path || []).split(',');
      const removedList = set(request_body, path, { is_deleted: true });
      set(clonedIntegerationDetails, ['request_body'], removedList);
      set(clonedIntegerationDetails, ['test_body'], removedList);
      updateIntegerationData(clonedIntegerationDetails);
    };

  const handleValueUpdate = (id, event, path, type) => {
    const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    path = (path || []).split(',');
    const currentRowJson = get(clonedIntegerationDetails?.request_body || {}, path, {});
    console.log('currentRowJSON', currentRowJson, event.target, id, dataFields);
    if (id === REQUEST_CONFIGURATION_STRINGS.ADD_EVENT.REQUEST_BODY.VALUE.ID &&
      type === REQUEST_CONFIGURATION.QUERY.VALUE.TYPES.EXPRESSION) {
        if (!isEmpty(get(clonedIntegerationDetails, ['request_body', ...path, id])) &&
        get(clonedIntegerationDetails, ['request_body', ...path, 'value_type'])
        === REQUEST_CONFIGURATION.QUERY.VALUE.TYPES.EXPRESSION && !isEmpty(dataFields) &&
        !dataFields.includes(get(clonedIntegerationDetails, ['request_body', ...path, 'value']))) {
        const updatedDataFields = (dataFields || []).filter((fieldId) =>
        fieldId !== get(clonedIntegerationDetails, ['request_body', ...path, 'value']));
        clonedIntegerationDetails.dataFields = updatedDataFields;
        console.log('clonedIntegerationDetails request', dataFields, updatedDataFields);
        }
        console.log('clonedIntegerationDetails request1', event, Array.isArray(dataFields), dataFields, dataFields.includes(event?.target?.value?.value));
        set(clonedIntegerationDetails, ['request_body', ...path, 'field_details'], event.target);
        if (currentRowJson?.root_uuid) {
          const parentPath = cloneDeep(path);
          (parentPath || []).splice(path.length - 2, 2);
          const parentData = get(clonedIntegerationDetails?.request_body || {}, parentPath, {});
          if (parentData?.is_multiple && isEmpty(parentData?.field_details)) {
            const { table_name, table_uuid } = event.target;
            set(clonedIntegerationDetails, ['request_body', ...parentPath, 'type'], 'expression');
            set(clonedIntegerationDetails, ['request_body', ...parentPath, 'value'], table_uuid);
            set(clonedIntegerationDetails, ['request_body', ...parentPath, 'field_details'], { table_name, table_uuid, value: table_uuid, label: table_name, field_name: table_name });
            unset(clonedIntegerationDetails, ['integration_error_list', 'requestBodyErrorList', [...parentPath, 'value'].join(',')]);
          } else if (!parentData.is_multiple) {
            set(clonedIntegerationDetails, ['request_body', ...parentPath, 'type'], 'direct');
            set(clonedIntegerationDetails, ['request_body', ...parentPath, 'value'], EMPTY_STRING);
          }
        }
      }
      if (!dataFields.includes(event?.target?.value) && event?.target?.field_list_type !== TABLE_FIELD_LIST_TYPE) {
        if (Array.isArray(dataFields)) {
        clonedIntegerationDetails.dataFields = [...dataFields, event?.target?.value];
        } else {
          clonedIntegerationDetails.dataFields = [];
          clonedIntegerationDetails.dataFields.push(event?.target?.value);
        }
      }
    set(clonedIntegerationDetails, ['request_body', ...path, id], event.target.value);
    set(clonedIntegerationDetails, ['request_body', ...path, 'type'], type);
    if ((id === REQUEST_CONFIGURATION_STRINGS.ADD_EVENT.REQUEST_BODY.VALUE.ID)) {
      if (type === REQUEST_CONFIGURATION.QUERY.VALUE.TYPES.DIRECT) {
        set(clonedIntegerationDetails, ['request_body', ...path, 'test_value'], event.target.value);
      } else {
        set(clonedIntegerationDetails, ['request_body', ...path, 'test_value'], EMPTY_STRING);
      }
      clonedIntegerationDetails.test_body = get(clonedIntegerationDetails, ['request_body'], []);
    }
    unset(clonedIntegerationDetails, ['integration_error_list', 'requestBodyErrorList', path.join(',').concat(`,${id}`)]);
    if (currentRowJson?.root_uuid) {
      const childRowsPath = cloneDeep(path);
      (childRowsPath || []).splice(path.length - 1, 1);
      unset(clonedIntegerationDetails, ['integration_error_list', 'requestBodyErrorList', childRowsPath.join(',')]);
      const parentPath = cloneDeep(path);
      (parentPath || []).splice(path.length - 2, 2);
      const parentData = get(clonedIntegerationDetails?.request_body || {}, parentPath, {});
      if (!parentData.is_multiple) {
        set(clonedIntegerationDetails, ['request_body', ...parentPath, 'type'], 'direct');
        set(clonedIntegerationDetails, ['request_body', ...parentPath, 'value'], EMPTY_STRING);
      }
    }
    console.log('1234ertyew', clonedIntegerationDetails, get(clonedIntegerationDetails, ['request_body', ...path]));
    updateIntegerationData(clonedIntegerationDetails);
  };

    const onChangeHandlers = ({ event, value, type, path, current_index, value_type }) => {
      const { ADD_EVENT } = REQUEST_CONFIGURATION_STRINGS;
      console.log('onChangeHandlers', event, value, type, path, current_index);
      switch (type) {
        case ADD_EVENT.REQUEST_BODY.DELETE.ID:
          return handleRowDelete(path);
        case ADD_EVENT.REQUEST_BODY.VALUE.ID:
            return handleValueUpdate(type, event, path, value_type);
          default:
          break;
      }
      return null;
    };

    return (
      <div className={BS.H100}>
        {isEmpty(relative_path) && isEmpty(event_headers) && isEmpty(query_params) && isEmpty(request_body) ? (
          <NoRequestInputs noDataFoundMessage={t(NO_EVENT_PARAMS.NO_INPUTS_TO_CONFIGURE)} />
        ) : (
        <>
        <div className={cx(gClasses.FTwo18GrayV3, gClasses.MB15, gClasses.FontWeight500, configStyles.BodyHeader)}>
          {t(REQUEST_CONFIGURATION.HEADING)}
        </div>
        {!isEmpty(relative_path) && (
          <div className={gClasses.MB15}>
            <div className={cx(gClasses.MB8, styles.SectionHeader)}>{t(REQUEST_CONFIGURATION.RELATIVE_PATH.TITLE)}</div>
            <MappingTable
              tblHeaders={REQUEST_CONFIGURATION.RELATIVE_PATH.HEADER}
              mappingList={relative_path}
              handleMappingChange={() => { }}
              mappingKey={REQUEST_CONFIGURATION.RELATIVE_PATH.ID}
              initialRow={initialRelativePathRow}
              initialRowKeyValue={{
                key: EMPTY_STRING,
                value: EMPTY_STRING,
              }}
              headerClassName={styles.InputColHeader}
              noAddRow
            />
          </div>
        )}
        {!isEmpty(event_headers) && (
          <div className={gClasses.MB15}>
            <div className={cx(gClasses.MB8, styles.SectionHeader)}>{t(REQUEST_CONFIGURATION.HEADERS.TITLE)}</div>
            <MappingTable
              tblHeaders={REQUEST_CONFIGURATION.HEADERS.HEADER}
              mappingList={event_headers}
              handleMappingChange={() => { }}
              mappingKey={REQUEST_CONFIGURATION.HEADERS.ID}
              initialRow={(index) => initialRow(index, REQUEST_CONFIGURATION.HEADERS.ID)}
              initialRowKeyValue={{
                key: EMPTY_STRING,
                value: EMPTY_STRING,
              }}
              headerClassName={styles.InputColHeader}
              noAddRow
            />
          </div>
        )}
        {!isEmpty(query_params) && (
          <div className={gClasses.MB15}>
            <div className={cx(gClasses.MB8, styles.SectionHeader)}>{t(REQUEST_CONFIGURATION.QUERY.TITLE)}</div>
            <MappingTable
              tblHeaders={REQUEST_CONFIGURATION.QUERY.HEADER}
              mappingList={query_params}
              handleMappingChange={() => { }}
              mappingKey={REQUEST_CONFIGURATION.QUERY.ID}
              initialRow={(index) => initialRow(index, REQUEST_CONFIGURATION.QUERY.ID)}
              initialRowKeyValue={{
                key: EMPTY_STRING,
                value: EMPTY_STRING,
              }}
              headerClassName={styles.InputColHeader}
              noAddRow
            />
          </div>
        )}
        {!isEmpty(request_body) && (
          <div className={gClasses.MB15}>
            <div className={cx(gClasses.MB8, styles.SectionHeader)}>{REQUEST_CONFIGURATION.REQUEST_BODY.TITLE}</div>
            <RecursiveMappingTable
              request_body={request_body}
              RowComponent={BodyRowComponent}
              onChangeHandlers={onChangeHandlers}
              handleAddRow={() => { }}
              error_list={requestBodyErrorList}
              showAddMore={false}
              headers={REQUEST_CONFIGURATION.REQUEST_BODY_HEADERS}
              headerStyles={[styles.ColMax, styles.ColMed, styles.CheckboxCol, styles.ColMax]}
            />
          </div>
        )}
        </>
        )}
      </div>
    );
}

const mapStateToProps = ({ EditFlowReducer }) => {
    return {
        loadingMappingFields: EditFlowReducer.loadingMappingFields,
    };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFlowData: (...params) => {
      dispatch(updateFlowDataChange(...params));
    },
    onGetAllFieldsByFilter: (
      paginationData,
      // currentFieldUuid,
      // fieldType,
      // noLstAllFieldsUpdate,
      setStateKey,
      mapping,
      fieldListDropdownType,
      tableUuid,
      getCancelToken,
    ) => {
      dispatch(
        getIntegrationMappingFields(
          paginationData,
          // currentFieldUuid,
          // fieldType,
          // noLstAllFieldsUpdate,
          setStateKey,
          mapping,
          fieldListDropdownType,
          tableUuid,
          getCancelToken,
        ),
      );
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(IntegerationRequestConfiguration));
