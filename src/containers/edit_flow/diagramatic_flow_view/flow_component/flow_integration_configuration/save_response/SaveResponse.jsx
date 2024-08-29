import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import { getTriggerMappingFields } from 'redux/actions/FlowStepConfiguration.Action';
import gClasses from 'scss/Typography.module.scss';
import { cloneDeep, get, has, isEmpty, set, unset } from 'utils/jsUtility';
import { DIRECT_FIELD_LIST_TYPE, TABLE_FIELD_LIST_TYPE } from 'utils/ValidationConstants';
import RecursiveMappingTable from 'containers/integration/recursive_mapping_table/RecursiveMappingTable';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import HelperMessage, { HELPER_MESSAGE_TYPE } from 'components/form_components/helper_message/HelperMessage';
import { ARIA_ROLES } from 'utils/UIConstants';
import { useTranslation } from 'react-i18next';
import { INTEGRATION_CONSTANTS } from '../FlowIntegrationConfiguration.constants';
import { CREATE_FIELDS_ALLOWED_FOR_RESPONSE_MAPPING, REQUEST_CONFIGURATION_STRINGS, saveResonseInitialData } from '../integration_request_configuration/IntegrationRequestConfiguration.utils';
import SaveResponseRowComponent from './SaveResponseRowComponent';
import styles from './SaveResponse.module.scss';
import configStyles from '../FlowIntegrationConfiguration.module.scss';

function SaveResponse(props) {
    const { currentIntegrationData = {}, integration_error_list = {},
    eventDetails,
    updateIntegerationData = 0, mappedResponseFields = [], updateFlowData } = props;
    const { response_format = [], test_response = {}, dataFields = [] } = currentIntegrationData;
    const { code } = test_response;
    const { saveResponseErrorList = {} } = integration_error_list;
    const { t } = useTranslation();
    const { SAVE_RESPONSE_CONFIGURATION } = INTEGRATION_CONSTANTS;
    console.log('eventDetailsSaveresponsewdd', eventDetails, 'currentIntegrationData', currentIntegrationData);

    useEffect(() => {
      if (!has(currentIntegrationData, ['response_format'])) {
        const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
        set(clonedIntegerationDetails, ['response_format'], []);
        updateIntegerationData(clonedIntegerationDetails);
      }
     }, []);

  const handleValueUpdate = (id, event = {}, path, createNewField = false) => {
    const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    path = (path || []).split(',');
    const currentRowJson = get(clonedIntegerationDetails?.response_format || {}, path, {});
    console.log('currentRowJSON', createNewField, cloneDeep(dataFields), currentRowJson, id, event.target, cloneDeep(clonedIntegerationDetails));
    const fieldType = event?.target?.field_type || event?.target?.field_list_type;
    const clonedMappedResponseFields = cloneDeep(mappedResponseFields || []);
    if (get(clonedIntegerationDetails, ['response_format', ...path, 'field_details', 'table_uuid'], EMPTY_STRING)) {
      const mappedTableIndex = clonedMappedResponseFields.findIndex((eachUuid) =>
      eachUuid === get(clonedIntegerationDetails, ['response_format', ...path, 'field_details', 'table_uuid'], EMPTY_STRING));
      if (mappedTableIndex > -1) delete clonedMappedResponseFields[mappedTableIndex];
    }
    if (event?.target?.table_uuid && fieldType === TABLE_FIELD_LIST_TYPE) clonedMappedResponseFields.push(event?.target?.table_uuid);
    updateFlowData({ mappedIntegrationResponseFields: clonedMappedResponseFields });
    unset(clonedIntegerationDetails, ['integration_error_list', 'saveResponseErrorList', `${path},field_type`]);
    set(clonedIntegerationDetails, ['response_format', ...path, id], event?.target);
    const isUpdateNewField = get(cloneDeep(clonedIntegerationDetails),
      ['response_format', ...path, 'new_field'],
      false);
    if (createNewField) {
      set(clonedIntegerationDetails, ['response_format', ...path, 'new_field'], true);
      const fieldType = get(cloneDeep(clonedIntegerationDetails), ['response_format', ...path, 'field_type']);
      if (!CREATE_FIELDS_ALLOWED_FOR_RESPONSE_MAPPING.includes(fieldType)) {
        set(clonedIntegerationDetails, ['response_format', ...path, 'field_type'], EMPTY_STRING);
      }
    } else set(clonedIntegerationDetails, ['response_format', ...path, 'new_field'], false);
    if (!path.includes('column_mapping')) {
      console.log('1234ertyewasdasdfasf',
      fieldType,
      get(cloneDeep(clonedIntegerationDetails), ['response_format', ...path, 'field_type']),
      isUpdateNewField,
      createNewField,
      get(cloneDeep(clonedIntegerationDetails), ['response_format', ...path, 'field_value']),
      );
      if (fieldType === TABLE_FIELD_LIST_TYPE) {
        if (
          get(cloneDeep(clonedIntegerationDetails), ['response_format', ...path, 'field_type']) === TABLE_FIELD_LIST_TYPE
        ) {
          if ((isUpdateNewField !== createNewField)) {
            set(clonedIntegerationDetails,
              ['response_format', ...path, 'column_mapping'],
              []);
          }
        }
      } else {
        unset(clonedIntegerationDetails,
          ['response_format', ...path, 'column_mapping']);
      }
    }
    if (!createNewField) {
      set(clonedIntegerationDetails,
      ['response_format', ...path, 'field_type'],
      fieldType);
    }
    set(clonedIntegerationDetails,
      ['response_format', ...path, id],
      event?.target?.value);
    set(clonedIntegerationDetails,
      ['response_format', ...path, 'field_details'],
      event?.target);
    unset(clonedIntegerationDetails, ['integration_error_list', 'saveResponseErrorList', path.join(',').concat(`,${id}`)]);
    console.log('1234ertyew', path, cloneDeep(clonedIntegerationDetails), get(clonedIntegerationDetails, ['response_format', ...path]));
    updateIntegerationData(clonedIntegerationDetails);
  };

  const handleValueTypeUpdate = (id, event = {}, path) => {
    const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    path = (path || []).split(',');
    unset(clonedIntegerationDetails, ['integration_error_list', 'saveResponseErrorList', `${path},field_type`]);
    if (event?.target?.value === TABLE_FIELD_LIST_TYPE) {
      const tableName = get(clonedIntegerationDetails, ['response_format', ...path, 'field_details', 'field_name']);
      set(clonedIntegerationDetails, ['response_format', ...path, 'field_details', 'table_name'], tableName || EMPTY_STRING);
      set(clonedIntegerationDetails, ['response_format', ...path, 'field_details', 'field_list_type'], TABLE_FIELD_LIST_TYPE);
      unset(clonedIntegerationDetails, ['response_format', ...path, 'field_details', 'field_name']);
    } else {
      set(clonedIntegerationDetails, ['response_format', ...path, 'field_details', 'field_list_type'], DIRECT_FIELD_LIST_TYPE);
      if (has(clonedIntegerationDetails, ['response_format', ...path, 'column_mapping'])) {
        unset(clonedIntegerationDetails,
          ['response_format', ...path, 'column_mapping']);
      }
      if (has(clonedIntegerationDetails, ['response_format', ...path, 'field_details', 'table_name'])) {
        set(clonedIntegerationDetails,
          ['response_format', ...path, 'field_details', 'field_name'],
          get(clonedIntegerationDetails,
            ['response_format', ...path, 'field_details', 'table_name'],
            EMPTY_STRING));
        unset(clonedIntegerationDetails,
          ['response_format', ...path, 'field_details', 'table_name']);
      }
    }
    set(clonedIntegerationDetails, ['response_format', ...path, id], event?.target?.value);
    console.log('1234ertyew', path, cloneDeep(clonedIntegerationDetails), get(clonedIntegerationDetails, ['response_format', ...path]));
    updateIntegerationData(clonedIntegerationDetails);
  };

  const handleAddMoreObjects = (path, root_uuid) => {
    console.log('add new keys', root_uuid);
    const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    const clonedSaveResponse = cloneDeep(response_format) || [];
    const clonedRow = cloneDeep(saveResonseInitialData);
    const parentPath = (path || []).split(',').slice(0, ((path || []).split(',')).length - 2);
    const parentJSON = get(clonedIntegerationDetails?.response_format || {}, parentPath, {});
    console.log('parentJSONparentJSON', parentJSON, parentPath, clonedIntegerationDetails?.response_format);
    if (parentJSON) {
      clonedRow.parent_table_uuid = parentJSON?.field_value;
      clonedRow.parent_table_name = parentJSON?.field_details?.table_name;
    } else {
      delete clonedRow.parent_table_uuid;
      delete parentJSON?.field_value;
    }
    clonedRow.path = path;
    unset(clonedIntegerationDetails, ['integration_error_list', 'saveResponseErrorList', `${parentPath},column_mapping`]);
    const currentPath = (path || []).split(',');
    set(clonedSaveResponse, currentPath, clonedRow);
    set(clonedIntegerationDetails, [INTEGRATION_CONSTANTS.SAVE_RESPONSE_CONFIGURATION.KEY], clonedSaveResponse);
    updateIntegerationData(clonedIntegerationDetails);
  };

  const handleAddRow = () => {
    const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    const clonedSaveResponse = cloneDeep(response_format) || [];
    const clonedRow = cloneDeep(saveResonseInitialData);
    clonedRow.path = String(clonedSaveResponse.length);
    clonedSaveResponse.push(clonedRow);
    unset(clonedIntegerationDetails, ['integration_error_list', 'saveResponseErrorList', 'response_format']);
    set(clonedIntegerationDetails, [INTEGRATION_CONSTANTS.SAVE_RESPONSE_CONFIGURATION.KEY], clonedSaveResponse);
    console.log('handleAddRow', clonedSaveResponse, clonedRow);
    updateIntegerationData(clonedIntegerationDetails);
  };

  const handleOnChangeHandler = (e, path, doNotUpdateDetails = false) => {
    const { ADD_EVENT } = REQUEST_CONFIGURATION_STRINGS;
    let clonedIntegerationDetails = cloneDeep(currentIntegrationData);

    if (get(e, ['target', 'is_response_body'], false)) {
      clonedIntegerationDetails = handleOnChangeHandler(get(e, ['target', 'key_type_event'], {}), get(e, ['target', 'key_type_path'], EMPTY_STRING), true);
    }

    const clonedSaveResponse = cloneDeep(clonedIntegerationDetails?.response_format) || [];
    console.log('currentRowJSONs', path);
    path = (path || []).split(',');
    if (e?.target?.id === ADD_EVENT.SAVE_RESPONSE.KEY_TYPE.ID) {
      if (e?.target?.value !== 'object' &&
      get(clonedSaveResponse, [...path, e?.target?.id]) === 'object') {
         if (get(clonedSaveResponse, [...path, 'field_details', 'field_list_type']) === 'table' ||
         (isEmpty(get(clonedSaveResponse, [...path, 'field_details', 'field_list_type'])) &&
         get(clonedSaveResponse, [...path, 'field_type']) === 'table')) {
          const clonedMappedResponseFields = cloneDeep(mappedResponseFields || []);
          if (get(clonedIntegerationDetails, ['response_format', ...path, 'field_details', 'table_uuid'], EMPTY_STRING)) {
            const mappedTableIndex = clonedMappedResponseFields.findIndex((eachUuid) =>
            eachUuid === get(clonedIntegerationDetails, ['response_format', ...path, 'field_details', 'table_uuid'], EMPTY_STRING));
            if (mappedTableIndex > -1) delete clonedMappedResponseFields[mappedTableIndex];
          }
          updateFlowData({ mappedIntegrationResponseFields: clonedMappedResponseFields });
          unset(clonedSaveResponse, [
           ...path, 'column_mapping']);
           set(clonedSaveResponse, [...path, 'field_type'], EMPTY_STRING);
           set(clonedSaveResponse, [...path, 'field_details'], {});
           set(clonedSaveResponse, [...path, 'field_value'], EMPTY_STRING);
         }
      }
    }

    let currentValue = e?.target?.value;
    let parentPath = EMPTY_STRING;

    if (currentIntegrationData?.response_body) {
      if (path?.includes(SAVE_RESPONSE_CONFIGURATION.COLUMN_MAPPING)) {
        const pathArr = cloneDeep(path);
        if (pathArr.length > 0 && pathArr[pathArr.length - 2] === SAVE_RESPONSE_CONFIGURATION.COLUMN_MAPPING) {
          pathArr.splice(pathArr.length - 2, 2);
          parentPath = pathArr;
        }
      }
      const parentLabel = `${get(clonedSaveResponse, [...parentPath, e?.target?.id])}.`;
      currentValue = currentValue.replace(parentLabel, EMPTY_STRING);
    }

    set(clonedSaveResponse, [...path, e?.target?.id], currentValue);
    set(clonedIntegerationDetails, [INTEGRATION_CONSTANTS.SAVE_RESPONSE_CONFIGURATION.KEY], clonedSaveResponse);
    unset(clonedIntegerationDetails, ['integration_error_list', 'saveResponseErrorList', path.join(',').concat(`,${e?.target?.id}`)]);
    console.log('clonedIntegerationDetailssdaadd', get(clonedIntegerationDetails, ['integration_error_list', 'saveResponseErrorList', path.join(',').concat(`,${e?.target?.id}`)]), cloneDeep(clonedIntegerationDetails), cloneDeep(clonedSaveResponse));

    if (doNotUpdateDetails) {
      return clonedIntegerationDetails;
    } else {
      updateIntegerationData(clonedIntegerationDetails);
      return null;
    }
  };

  const handleRowDelete = (path) => {
    const clonedIntegerationDetails = cloneDeep(currentIntegrationData);
    const clonedSaveResponse = cloneDeep(response_format) || [];
    const clonedMappedResponseFields = cloneDeep(mappedResponseFields || []);
    if (get(clonedIntegerationDetails, ['response_format', ...path, 'field_details', 'table_uuid'], EMPTY_STRING)) {
      const mappedTableIndex = clonedMappedResponseFields.findIndex((eachUuid) =>
      eachUuid === get(clonedIntegerationDetails, ['response_format', ...path, 'field_details', 'table_uuid'], EMPTY_STRING));
      if (mappedTableIndex > -1) delete clonedMappedResponseFields[mappedTableIndex];
    }
    updateFlowData({ mappedIntegrationResponseFields: clonedMappedResponseFields });
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
    set(clonedIntegerationDetails, [INTEGRATION_CONSTANTS.SAVE_RESPONSE_CONFIGURATION.KEY], removedList);

    const clonedErrorList = cloneDeep(saveResponseErrorList);
    if (saveResponseErrorList) {
      Object.keys(saveResponseErrorList).forEach((currentKey) => {
        if (currentKey?.includes(path)) {
          delete clonedErrorList[currentKey];
          unset(clonedIntegerationDetails, ['integration_error_list', 'saveResponseErrorList', currentKey]);
        }
      });
    }
    console.log('handleRowwDelete', cloneDeep(clonedIntegerationDetails), removedList);
    updateIntegerationData(clonedIntegerationDetails);
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
          {t(SAVE_RESPONSE_CONFIGURATION.TOOLTIP_TEXT)}
        </span>
      </div>
    </div>
  );

  console.log('test_responsetest_response', saveResponseErrorList.response_format, saveResponseErrorList, test_response, currentIntegrationData, code, !Number.isNaN(code));
  return (
      <>
      <div className={cx(gClasses.FTwo18GrayV3, gClasses.MB15, gClasses.FontWeight500, configStyles.BodyHeader)}>
        {t(SAVE_RESPONSE_CONFIGURATION.HEADING)}
      </div>
      {alertInformation}
      {has(currentIntegrationData, ['response_format']) && (
        <RecursiveMappingTable
          request_body={response_format}
          RowComponent={SaveResponseRowComponent}
          onChangeHandlers={onChangeHandlers}
          handleAddRow={handleAddRow}
          error_list={saveResponseErrorList}
          showAddMore
          headers={SAVE_RESPONSE_CONFIGURATION.RESONSE_HEADERS}
          maxDepth={1}
          innerRowClass={styles.TableRow}
          childKey={SAVE_RESPONSE_CONFIGURATION.COLUMN_MAPPING}
          headerStyles={[styles.ColMax, styles.ColMin, styles.ColMax, styles.ColMin, styles.ColMini]}
        />
      )}
      {saveResponseErrorList.response_format &&
        <HelperMessage
          message={saveResponseErrorList.response_format}
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
        mappedResponseFields: EditFlowReducer.flowData.mappedIntegrationResponseFields,
    };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFlowData: (...params) => {
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
  connect(mapStateToProps, mapDispatchToProps)(SaveResponse));
