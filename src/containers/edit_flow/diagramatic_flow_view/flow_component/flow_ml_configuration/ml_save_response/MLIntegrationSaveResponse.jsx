import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { cloneDeep, get, has, isEmpty, set, unset } from '../../../../../../utils/jsUtility';
import { TABLE_FIELD_LIST_TYPE, DIRECT_FIELD_LIST_TYPE } from '../../../../../../utils/ValidationConstants';
import RecursiveMappingTable from '../../../../../integration/recursive_mapping_table/RecursiveMappingTable';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import HelperMessage, { HELPER_MESSAGE_TYPE } from '../../../../../../components/form_components/helper_message/HelperMessage';
import { ARIA_ROLES } from '../../../../../../utils/UIConstants';
import { getTriggerMappingFields } from '../../../../../../redux/actions/FlowStepConfiguration.Action';
import { updateFlowDataChange } from '../../../../../../redux/reducer/EditFlowReducer';
import { INTEGRATION_CONSTANTS } from '../../flow_integration_configuration/FlowIntegrationConfiguration.constants';
import { CREATE_FIELDS_ALLOWED_FOR_RESPONSE_MAPPING, REQUEST_CONFIGURATION_STRINGS, saveResonseInitialData } from '../../flow_integration_configuration/integration_request_configuration/IntegrationRequestConfiguration.utils';
import SaveResponseRowComponent from '../../flow_integration_configuration/save_response/SaveResponseRowComponent';
import styles from './MLIntegrationSaveResponse.module.scss';
import configStyles from '../../flow_integration_configuration/FlowIntegrationConfiguration.module.scss';
import { getFieldLabelWithRefName } from '../../../../../../utils/UtilityFunctions';

function MLIntegrationSaveResponse(props) {
    const { currentMLIntegrationData = {}, ml_integration_error_list = {},
    eventDetails,
    updateMLIntegrationData = 0, mappedResponseFields = [], updateProcedureData } = props;
    const { response_format = [], test_response = {}, dataFields = [] } = currentMLIntegrationData;
    const { code } = test_response;
    const { saveResponseErrorList = {} } = ml_integration_error_list;
    const { t } = useTranslation();
    const { SAVE_RESPONSE_CONFIGURATION } = INTEGRATION_CONSTANTS;
    console.log('eventDetailsSaveresponsewdd', eventDetails, 'currentMLIntegrationData', currentMLIntegrationData);
    const clonedMLIntegerationDetails = cloneDeep(currentMLIntegrationData);

    useEffect(() => {
      if (!has(currentMLIntegrationData, ['response_format'])) {
        const clonedMLIntegerationDetails = cloneDeep(currentMLIntegrationData);
        set(clonedMLIntegerationDetails, ['response_format'], []);
        updateMLIntegrationData(clonedMLIntegerationDetails);
      }
      const clonedMLIntegerationDetails = cloneDeep(currentMLIntegrationData);
      const newArray1 = clonedMLIntegerationDetails?.key_option?.response_key_option.filter((item1) => !clonedMLIntegerationDetails.response_format.some((item2) => item1.value === item2.response_key));
      set(clonedMLIntegerationDetails, ['response_key_option'], newArray1);
      updateMLIntegrationData(clonedMLIntegerationDetails);
     }, []);

  const handleValueUpdate = (id, event = {}, path, createNewField = false) => {
    const clonedMLIntegerationDetails = cloneDeep(currentMLIntegrationData);
    path = (path || []).split(',');
    const currentRowJson = get(clonedMLIntegerationDetails?.response_format || {}, path, {});
    console.log('currentRowJSON', createNewField, cloneDeep(dataFields), currentRowJson, id, event.target, cloneDeep(clonedMLIntegerationDetails));
    const fieldType = event?.target?.field_type || event?.target?.field_list_type;
    const clonedMappedResponseFields = cloneDeep(mappedResponseFields || []);
    if (get(clonedMLIntegerationDetails, ['response_format', ...path, 'field_details', 'table_uuid'], EMPTY_STRING)) {
      const mappedTableIndex = clonedMappedResponseFields.findIndex((eachUuid) =>
      eachUuid === get(clonedMLIntegerationDetails, ['response_format', ...path, 'field_details', 'table_uuid'], EMPTY_STRING));
      if (mappedTableIndex > -1) delete clonedMappedResponseFields[mappedTableIndex];
    }
    if (event?.target?.table_uuid && fieldType === TABLE_FIELD_LIST_TYPE) clonedMappedResponseFields.push(event?.target?.table_uuid);
    updateProcedureData({ mappedIntegrationResponseFields: clonedMappedResponseFields });
    unset(clonedMLIntegerationDetails, ['ml_integration_error_list', 'saveResponseErrorList', `${path},field_type`]);
    set(clonedMLIntegerationDetails, ['response_format', ...path, id], event?.target);
    const isUpdateNewField = get(cloneDeep(clonedMLIntegerationDetails),
      ['response_format', ...path, 'new_field'],
      false);
    if (createNewField) {
      set(clonedMLIntegerationDetails, ['response_format', ...path, 'new_field'], true);
      const fieldType = get(cloneDeep(clonedMLIntegerationDetails), ['response_format', ...path, 'field_type']);
      if (!CREATE_FIELDS_ALLOWED_FOR_RESPONSE_MAPPING.includes(fieldType)) {
        set(clonedMLIntegerationDetails, ['response_format', ...path, 'field_type'], EMPTY_STRING);
      }
    } else set(clonedMLIntegerationDetails, ['response_format', ...path, 'new_field'], false);
    if (!path.includes('column_mapping')) {
      console.log('1234ertyewasdasdfasf',
      fieldType,
      get(cloneDeep(clonedMLIntegerationDetails), ['response_format', ...path, 'field_type']),
      isUpdateNewField,
      createNewField,
      get(cloneDeep(clonedMLIntegerationDetails), ['response_format', ...path, 'field_value']),
      );
      if (fieldType === TABLE_FIELD_LIST_TYPE) {
        if (
          get(cloneDeep(clonedMLIntegerationDetails), ['response_format', ...path, 'field_type']) === TABLE_FIELD_LIST_TYPE
        ) {
          if ((isUpdateNewField !== createNewField)) {
            set(clonedMLIntegerationDetails,
              ['response_format', ...path, 'column_mapping'],
              []);
          }
        }
      } else {
        unset(clonedMLIntegerationDetails,
          ['response_format', ...path, 'column_mapping']);
      }
    }
    if (!createNewField) {
      set(clonedMLIntegerationDetails,
      ['response_format', ...path, 'field_type'],
      fieldType);
    }
    set(clonedMLIntegerationDetails,
      ['response_format', ...path, id],
      event?.target?.value);
    set(clonedMLIntegerationDetails,
      ['response_format', ...path, 'field_details'],
      event?.target);
      if (event?.target?.field_list_type === 'direct') {
      set(clonedMLIntegerationDetails,
        ['response_format', ...path, 'field_value'],
        event?.target?.field_name);
        set(clonedMLIntegerationDetails,
          ['response_format', ...path, 'field_details', 'label'],
          event?.target?.field_name);
      } else {
        set(clonedMLIntegerationDetails,
          ['response_format', ...path, 'field_details', 'label'],
          getFieldLabelWithRefName(event?.target?.field_name, event?.target?.reference_name));
      }
    unset(clonedMLIntegerationDetails, ['ml_integration_error_list', 'saveResponseErrorList', path.join(',').concat(`,${id}`)]);
    updateMLIntegrationData(clonedMLIntegerationDetails);
  };

  const handleValueTypeUpdate = (id, event = {}, path) => {
    const clonedMLIntegerationDetails = cloneDeep(currentMLIntegrationData);
    path = (path || []).split(',');
    unset(clonedMLIntegerationDetails, ['ml_integration_error_list', 'saveResponseErrorList', `${path},field_type`]);
    if (event?.target?.value === TABLE_FIELD_LIST_TYPE) {
      const tableName = get(clonedMLIntegerationDetails, ['response_format', ...path, 'field_details', 'field_name']);
      set(clonedMLIntegerationDetails, ['response_format', ...path, 'field_details', 'table_name'], tableName || EMPTY_STRING);
      set(clonedMLIntegerationDetails, ['response_format', ...path, 'field_details', 'field_list_type'], TABLE_FIELD_LIST_TYPE);
      unset(clonedMLIntegerationDetails, ['response_format', ...path, 'field_details', 'field_name']);
    } else {
      set(clonedMLIntegerationDetails, ['response_format', ...path, 'field_details', 'field_list_type'], DIRECT_FIELD_LIST_TYPE);

      if (has(clonedMLIntegerationDetails, ['response_format', ...path, 'column_mapping'])) {
        unset(clonedMLIntegerationDetails,
          ['response_format', ...path, 'column_mapping']);
      }
      if (has(clonedMLIntegerationDetails, ['response_format', ...path, 'field_details', 'table_name'])) {
        set(clonedMLIntegerationDetails,
          ['response_format', ...path, 'field_details', 'field_name'],
          get(clonedMLIntegerationDetails,
            ['response_format', ...path, 'field_details', 'table_name'],
            EMPTY_STRING));
        unset(clonedMLIntegerationDetails,
          ['response_format', ...path, 'field_details', 'table_name']);
      }
    }
    set(clonedMLIntegerationDetails, ['response_format', ...path, id], event?.target?.value);
    console.log('1234ertyew', path, cloneDeep(clonedMLIntegerationDetails), get(clonedMLIntegerationDetails, ['response_format', ...path]));
    updateMLIntegrationData(clonedMLIntegerationDetails);
  };

  const handleAddMoreObjects = (path, root_uuid) => {
    console.log('add new keys', root_uuid);
    const clonedMLIntegerationDetails = cloneDeep(currentMLIntegrationData);
    const clonedSaveResponse = cloneDeep(response_format) || [];
    const clonedRow = cloneDeep(saveResonseInitialData);
    const parentPath = (path || []).split(',').slice(0, ((path || []).split(',')).length - 2);
    const parentJSON = get(clonedMLIntegerationDetails?.response_format || {}, parentPath, {});
    console.log('parentJSONparentJSON', parentJSON, parentPath, clonedMLIntegerationDetails?.response_format);
    if (parentJSON) {
      clonedRow.parent_table_uuid = parentJSON?.field_value;
      clonedRow.parent_table_name = parentJSON?.field_details?.table_name;
    } else {
      delete clonedRow.parent_table_uuid;
      delete parentJSON?.field_value;
    }
    clonedRow.path = path;
    unset(clonedMLIntegerationDetails, ['ml_integration_error_list', 'saveResponseErrorList', `${parentPath},column_mapping`]);
    const currentPath = (path || []).split(',');
    set(clonedSaveResponse, currentPath, clonedRow);
    set(clonedMLIntegerationDetails, [INTEGRATION_CONSTANTS.SAVE_RESPONSE_CONFIGURATION.KEY], clonedSaveResponse);
    updateMLIntegrationData(clonedMLIntegerationDetails);
  };

  const handleAddRow = () => {
    const clonedMLIntegerationDetails = cloneDeep(currentMLIntegrationData);
    const clonedSaveResponse = cloneDeep(response_format) || [];
    const clonedRow = cloneDeep(saveResonseInitialData);
    clonedRow.path = String(clonedSaveResponse.length);
    clonedSaveResponse.push(clonedRow);
    unset(clonedMLIntegerationDetails, ['ml_integration_error_list', 'saveResponseErrorList', 'response_format']);
    set(clonedMLIntegerationDetails, [INTEGRATION_CONSTANTS.SAVE_RESPONSE_CONFIGURATION.KEY], clonedSaveResponse);
    console.log('handleAddRow', clonedSaveResponse, clonedRow);
    updateMLIntegrationData(clonedMLIntegerationDetails);
  };

  const handleOnChangeHandler = (e, path, doNotUpdateDetails = false) => {
    console.log('handleOnChangeHandler', e, path);
    let clonedMLIntegerationDetails = cloneDeep(currentMLIntegrationData);

    if (get(e, ['target', 'is_response_body'], false)) {
      clonedMLIntegerationDetails = handleOnChangeHandler(get(e, ['target', 'key_type_event'], {}), get(e, ['target', 'key_type_path'], EMPTY_STRING), true);
    }
    const clonedSaveResponse = cloneDeep(clonedMLIntegerationDetails?.response_format) || [];
    const currentValue = e?.target?.value;
    set(clonedSaveResponse, [...path, e?.target?.id], currentValue);
    set(clonedMLIntegerationDetails, [INTEGRATION_CONSTANTS.SAVE_RESPONSE_CONFIGURATION.KEY], clonedSaveResponse);
    const foundObject = clonedMLIntegerationDetails.sample_response.find((item) => item[e?.target?.id] === e?.target?.value);
    set(clonedSaveResponse, [...path, 'response_type'], foundObject?.response_type);
    const newArray1 = clonedMLIntegerationDetails.key_option.response_key_option.filter((item1) => !clonedMLIntegerationDetails.response_format.some((item2) => (item1.value === item2.response_key && !item2.is_deleted)));
    set(clonedMLIntegerationDetails, ['response_key_option'], newArray1);
    if (doNotUpdateDetails) {
      return clonedMLIntegerationDetails;
    } else {
      updateMLIntegrationData(clonedMLIntegerationDetails);
      return null;
    }
  };

  const handleRowDelete = (path) => {
    const clonedMLIntegerationDetails = cloneDeep(currentMLIntegrationData);
    const clonedSaveResponse = cloneDeep(response_format) || [];
    const clonedMappedResponseFields = cloneDeep(mappedResponseFields || []);
    if (get(clonedMLIntegerationDetails, ['response_format', ...path, 'field_details', 'table_uuid'], EMPTY_STRING)) {
      const mappedTableIndex = clonedMappedResponseFields.findIndex((eachUuid) =>
      eachUuid === get(clonedMLIntegerationDetails, ['response_format', ...path, 'field_details', 'table_uuid'], EMPTY_STRING));
      if (mappedTableIndex > -1) delete clonedMappedResponseFields[mappedTableIndex];
    }
    updateProcedureData({ mappedIntegrationResponseFields: clonedMappedResponseFields });
    path = (path || []).split(',');
    let removedList = set(clonedSaveResponse, [...path, 'is_deleted'], true);
    if (path.includes('column_mapping')) {
      const removedColumnList = cloneDeep(clonedSaveResponse);
      unset(removedColumnList, [path.join(',')]);
      removedList = removedColumnList;
    }
    const childRowPath = cloneDeep(path);
    childRowPath.pop();
    const childRows = get(clonedSaveResponse, childRowPath);
    const validRows = (childRows || []).filter((data) => !data.is_deleted);
    if (isEmpty(validRows)) { removedList = set(clonedSaveResponse, childRowPath, []); }
    set(clonedMLIntegerationDetails, [INTEGRATION_CONSTANTS.SAVE_RESPONSE_CONFIGURATION.KEY], removedList);

    const clonedErrorList = cloneDeep(saveResponseErrorList);
    if (saveResponseErrorList) {
      Object.keys(saveResponseErrorList).forEach((currentKey) => {
        if (currentKey?.includes(path)) {
          delete clonedErrorList[currentKey];
          unset(clonedMLIntegerationDetails, ['ml_integration_error_list', 'saveResponseErrorList', currentKey]);
        }
      });
    }
  const newArray1 = clonedMLIntegerationDetails.key_option.response_key_option.filter((item1) => !clonedMLIntegerationDetails.response_format.some((item2) => (item1.value === item2.response_key && !item2.is_deleted)));
      set(clonedMLIntegerationDetails, ['response_key_option'], newArray1);
      console.log('handleRowwDelete', cloneDeep(clonedMLIntegerationDetails), removedList, newArray1);

    updateMLIntegrationData(clonedMLIntegerationDetails);
  };

  const onChangeHandlers = ({ event, value, type, path, current_index, root_uuid, createNewField }) => {
    const { ADD_EVENT } = REQUEST_CONFIGURATION_STRINGS;
    console.log('onChangeHandlers', createNewField, event, value, type, path, current_index);
    switch (type) {
      case ADD_EVENT.SAVE_RESPONSE.FIELD_VALUE.ID:
          return handleValueUpdate(type, event, path, createNewField);
      case ADD_EVENT.SAVE_RESPONSE.FIELD_TYPE.ID:
        return handleValueTypeUpdate(type, event, path, createNewField);
      case ADD_EVENT.SAVE_RESPONSE.ADD_MORE_CHILD.ID:
        return handleAddMoreObjects(path, root_uuid);
      case ADD_EVENT.SAVE_RESPONSE.KEY_INPUT.ID:
      case ADD_EVENT.SAVE_RESPONSE.KEY_TYPE.ID:
        return handleOnChangeHandler(event, path);
      case ADD_EVENT.SAVE_RESPONSE.DELETE.ID:
        return handleRowDelete(path);
        default:
        break;
    }
    return null;
  };

  const alertInformation = (
    <div
      role="alert"
      className={cx(styles.Note, gClasses.MB15)}
    >
      <div className={gClasses.CenterVImportant}>
        <span className={gClasses.FTwo10}>
          {t(SAVE_RESPONSE_CONFIGURATION.TOOLTIP_TEXT_ML)}
        </span>
      </div>
    </div>
  );

  console.log('test_responsetest_response', saveResponseErrorList.response_format, saveResponseErrorList, test_response, currentMLIntegrationData, code, !Number.isNaN(code));
  return (
      <>
      <div className={cx(gClasses.FTwo18GrayV3, gClasses.MB15, gClasses.FontWeight500, configStyles.BodyHeader)}>
        {t(SAVE_RESPONSE_CONFIGURATION.HEADING)}
      </div>
      {alertInformation}
      {has(currentMLIntegrationData, ['response_format']) && (
        <RecursiveMappingTable
          request_body={response_format}
          RowComponent={SaveResponseRowComponent}
          onChangeHandlers={onChangeHandlers}
          handleAddRow={handleAddRow}
          error_list={currentMLIntegrationData?.ml_integration_error_list?.saveResponseError}
          showAddMore={clonedMLIntegerationDetails?.response_key_option?.length !== 0}
          headers={SAVE_RESPONSE_CONFIGURATION.RESONSE_HEADERS}
          maxDepth={1}
          childKey={SAVE_RESPONSE_CONFIGURATION.COLUMN_MAPPING}
          headerStyles={[styles.ColMax, styles.ColMin, styles.ColMax, styles.ColMin, styles.ColMini]}
          isMLIntegration
        />
      )}
      {currentMLIntegrationData?.ml_integration_error_list?.saveResponseError?.response_format &&
        <HelperMessage
          message={currentMLIntegrationData?.ml_integration_error_list?.saveResponseError?.response_format}
          type={HELPER_MESSAGE_TYPE.ERROR}
          noMarginBottom
          className={gClasses.MT4}
          role={ARIA_ROLES.ALERT}
        />
      }
      </>
  );
}

const mapStateToProps = ({ EditFlowReducer }) => {
    return {
        isIntegrationConfigurationModalOpen: EditFlowReducer.flowData.isIntegrationConfigurationModalOpen,
        integerationList: EditFlowReducer.flowData.integerationList,
        integration_details: EditFlowReducer.flowData.integration_details,
        confirm_test: EditFlowReducer.flowData.confirm_test,
        mappedResponseFields: EditFlowReducer.flowData.mappedIntegrationResponseFields,
    };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateProcedureData: (...params) => {
      dispatch(updateFlowDataChange(...params));
    },
    onGetAllFieldsByFilter: (
      paginationData,
      setStateKey,
      mapping,
    ) => {
      dispatch(
        getTriggerMappingFields(
          paginationData,
          setStateKey,
          mapping,
        ),
      );
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MLIntegrationSaveResponse));
