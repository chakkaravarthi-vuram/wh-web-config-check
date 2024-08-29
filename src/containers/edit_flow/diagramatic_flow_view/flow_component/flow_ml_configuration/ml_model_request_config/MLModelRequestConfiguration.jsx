import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getIntegrationMappingFields } from '../../../../../../redux/actions/FlowStepConfiguration.Action';
import gClasses from '../../../../../../scss/Typography.module.scss';
import { cloneDeep, isEmpty, set, unset } from '../../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import RecursiveMappingTable from '../../../../../integration/recursive_mapping_table/RecursiveMappingTable';
import { FEILD_LIST_DROPDOWN_TYPE } from '../../../../step_configuration/StepConfiguration.utils';
import NoRequestInputs from '../../../../../integration/no_request_inputs/NoRequestInputs';
import { FEATURE_INTEGRATION_STRINGS } from '../../../../../integration/Integration.strings';
import { updateFlowDataChange } from '../../../../../../redux/reducer/EditFlowReducer';
import { INTEGRATION_CONSTANTS } from '../../flow_integration_configuration/FlowIntegrationConfiguration.constants';
import styles from './MLModelRequestConfiguration.module.scss';
import configStyles from '../MLModelConfiguration.module.scss';
import { REQUEST_CONFIGURATION_STRINGS } from '../../flow_integration_configuration/integration_request_configuration/IntegrationRequestConfiguration.utils';
import BodyRowComponent from '../../flow_integration_configuration/integration_request_configuration/BodyRowComponent';
import { getFieldLabelWithRefName } from '../../../../../../utils/UtilityFunctions';

let cancelToken = null;
const getCancelToken = (token) => {
  cancelToken = token;
};

function MLModelRequestConfiguration(props) {
    const { flowData,
    onGetAllFieldsByFilter, updateMLIntegrationData, queryFieldsUuids = [], activeMLIntegrationData = {} } = props;
    const { request_body = [], ml_integration_error_list = {} } = activeMLIntegrationData;
    const { requestError = {} } = ml_integration_error_list;
    const { t } = useTranslation();

    const { REQUEST_CONFIGURATION } = INTEGRATION_CONSTANTS;
    const { NO_EVENT_PARAMS } = FEATURE_INTEGRATION_STRINGS;
    const getAllFieldsByFilterApi = (searchText = EMPTY_STRING, isSearch = false) => {
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

    const handleRowDelete = (path) => {
      const clonedIntegerationDetails = cloneDeep(activeMLIntegrationData);
      path = (path || []).split(',');
      const removedList = set(request_body, path, { is_deleted: true });
      set(clonedIntegerationDetails, ['request_body'], removedList);
      set(clonedIntegerationDetails, ['test_body'], removedList);
      updateMLIntegrationData(clonedIntegerationDetails);
    };

  const handleValueUpdate = (id, event, path, type) => {
    const clonedIntegerationDetails = cloneDeep(activeMLIntegrationData);
    console.log('clonedIntegerationDetailsid, event, path, type', id, event, path, type, clonedIntegerationDetails);
    if (type === 'expression') {
      set(clonedIntegerationDetails, ['request_body', path, 'value'], event.target.label);
      set(clonedIntegerationDetails, ['request_body', path, 'field_details'], { field_name: event.target.label, label: getFieldLabelWithRefName(event?.target?.field_name, event?.target?.reference_name), field_uuid: event?.target?.field_uuid });
    } else {
      set(clonedIntegerationDetails, ['request_body', path, 'value'], event.target.value);
    }
    set(clonedIntegerationDetails, ['request_body', path, 'type'], type);
    unset(clonedIntegerationDetails, ['ml_integration_error_list', 'requestError'], EMPTY_STRING);
    updateMLIntegrationData(clonedIntegerationDetails);
  };

    const onChangeHandlers = ({ event, value, type, path, current_index, value_type, component_uuid }) => {
      const { ADD_EVENT } = REQUEST_CONFIGURATION_STRINGS;
      console.log('onChangeHandlers', event, value, type, path, current_index);
      switch (type) {
        case ADD_EVENT.REQUEST_BODY.DELETE.ID:
          return handleRowDelete(path);
        case ADD_EVENT.REQUEST_BODY.VALUE.ID:
            return handleValueUpdate(type, event, path, value_type, component_uuid);
          default:
          break;
      }
      return null;
    };

    return (
      <div>
        { !flowData?.isRequestLoading && (
            <div>
              {isEmpty(request_body) ? (
                <div className={gClasses.MT100}>
                  <NoRequestInputs noDataFoundMessage={t(NO_EVENT_PARAMS.NO_INPUTS_TO_CONFIGURE)} />
                </div>
        ) : (
        <>
        <div className={cx(gClasses.FTwo18GrayV3, gClasses.MB15, gClasses.FontWeight500, configStyles.BodyHeader)}>
          {t(REQUEST_CONFIGURATION.HEADING)}
        </div>
          <div className={gClasses.MB15}>
            <div className={cx(gClasses.MB8, gClasses.FTwo14BlackV8, gClasses.FontWeight500, styles.SectionHeader)}>{REQUEST_CONFIGURATION.REQUEST_BODY.TITLE}</div>
            <RecursiveMappingTable
              request_body={request_body}
              RowComponent={BodyRowComponent}
              onChangeHandlers={onChangeHandlers}
              handleAddRow={() => { }}
              error_list={requestError}
              showAddMore={false}
              headers={REQUEST_CONFIGURATION.REQUEST_BODY_HEADERS_ML}
              headerStyles={[styles.ColMax, styles.ColMed, styles.CheckboxCol]}
              isMLIntegration
            />
          </div>
        </>
        )}
            </div>
        )}
      </div>
    );
}

const mapStateToProps = ({ EditFlowReducer }) => {
    return {
        isIntegrationConfigurationModalOpen: EditFlowReducer.flowData.isIntegrationConfigurationModalOpen,
        integerationList: EditFlowReducer.flowData.integerationList,
        integration_details: EditFlowReducer.flowData.integration_details,
        loadingMappingFields: EditFlowReducer.loadingMappingFields,
        bodyLstAllFields: EditFlowReducer.flowData.bodyLstAllFields,
    };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateProcedureData: (...params) => {
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
  connect(mapStateToProps, mapDispatchToProps)(MLModelRequestConfiguration));
