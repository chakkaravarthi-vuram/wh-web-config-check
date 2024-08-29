import React, { useEffect, useState } from 'react';
import {
  updateFlowDataChange,
  updateFlowStateChange,
} from 'redux/reducer/EditFlowReducer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { saveFlowThunk } from 'redux/actions/EditFlow.Action';
import {
  getAllFlowListApiThunk,
  getChildFlowDetailsByUUID,
  getTriggerMappingFields,
  getTriggerDetailsByUUID,
} from 'redux/actions/FlowStepConfiguration.Action';
import { cloneDeep, get, isEmpty } from 'utils/jsUtility';
import { useTranslation } from 'react-i18next';
import { getSaveTriggerValidateData } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { validate } from 'utils/UtilityFunctions';
import { saveTriggerStepValidationSchema, triggerNameSchema } from 'containers/edit_flow/step_configuration/StepConfiguration.validations';
import TriggerConfiguration from 'components/flow_trigger_configuration/TriggerConfiguration';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { getAccountConfigurationDetailsApiService } from '../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { TRIGGER_NAMES_ERROR } from '../../default_report_fields_list/Metrics.strings';
import { getCreateFlowValidateData, getFlowTriggerDetailsData } from '../../../EditFlow.utils';

function TriggerShortcutConfiguration(props) {
  const {
    isFlowTriggerShortcutModalOpen,
    isFlowListLoading,
    isChildFlowListLoading,
    isChildFlowDetailsLoading,
    onGetAllFieldsByFilter,
    onGetFlowChildDetailsByUUID,
    getAllFlowListApi,
    onFlowDataChange,
    allFlowsList,
    currentTriggerData,
    history,
    saveFlowAPI,
    onGetTriggerDetailsByUUID,
    flowsTotalCount,
    loadingChildMappingFields,
    loadingParentMappingFields,
    triggerIndex,
  } = props;
  const { t } = useTranslation();
  const [configuredMaxFileSize, setConfiguredMaxFileSize] = useState(0);

  const {
    flowData,
    flowData: {
      parentFlowlstAllFields = [],
      allparentFlowlstAllFields = [],
      parentFlowlstAllFieldsMetaData = [],
      childFlowlstAllFields = [],
      allchildFlowlstAllFields = [],
      childFlowlstAllFieldsMetaData = [],
      parentFlowlstAllFieldspaginationData = {},
      childFlowlstAllFieldspaginationData = {},
      triggerMappedUuids = [],
    },
  } = props;

  useEffect(() => {
    if (!isEmpty(get(currentTriggerData, ['trigger_uuid'], EMPTY_STRING))) {
      onGetTriggerDetailsByUUID(currentTriggerData.trigger_uuid, cloneDeep(currentTriggerData), 'flow_metadata', 'flow_related_actions_static_documents', flowData.flow_id, true, t);
  }
  getAccountConfigurationDetailsApiService().then(
    (response) => {
      setConfiguredMaxFileSize(response.maximum_file_size);
    },
  );
  }, []);

  const getFlowsList = (searchWithPaginationData) => {
    getAllFlowListApi(
      searchWithPaginationData,
      cloneDeep(currentTriggerData),
    );
  };

  const getFields = (paginationData, setStateKey, fieldListDropdownType, tableUuid, cancelToken) => {
    onGetAllFieldsByFilter(
      paginationData,
      setStateKey,
      cloneDeep(currentTriggerData).trigger_mapping,
      fieldListDropdownType,
      tableUuid,
      cancelToken,
      t,
    );
  };

  const cancelOrCloseTriggerConfiguration = () => {
    onFlowDataChange({
      isFlowTriggerShortcutModalOpen: false,
      anotherFlowConfigurationStepId: null,
      allFlowsList: [],
      activeTriggerData: {},
      childFlowlstAllFields: [],
      parentFlowlstAllFields: [],
      childFlowlstAllFieldspaginationData: {},
      parentFlowlstAllFieldspaginationData: {},
    });
  };

  const setStepData = (currentTriggerData) => {
    onFlowDataChange({ activeTriggerData: currentTriggerData });
  };

  const updateFieldList = (key, fieldList) => {
    onFlowDataChange({
      [key]: fieldList,
    });
  };

  const saveFlowTrigger = () => {
    const { trigger_mapping_error_list } = currentTriggerData;

    const triggerDetailsErrorList = validate(
      {
        ...getSaveTriggerValidateData(cloneDeep(currentTriggerData)),
        trigger_name: currentTriggerData?.trigger_name,
      },
      triggerNameSchema(t).concat(saveTriggerStepValidationSchema(t, configuredMaxFileSize)),
    );
    if (!isEmpty(currentTriggerData?.trigger_name)) {
      console.log('currentdatatriggerdetailscheck', flowData, 'current trigger data', currentTriggerData);
      flowData.trigger_details.forEach((eachName) => {
        if ((currentTriggerData?.trigger_uuid !== eachName?.trigger_uuid) && (currentTriggerData?.trigger_name === eachName?.trigger_name)) triggerDetailsErrorList.trigger_name = TRIGGER_NAMES_ERROR(t).ALREADY_EXIST;
      });
    }

    if (
      isEmpty(triggerDetailsErrorList) &&
      isEmpty(trigger_mapping_error_list)
    ) {
      const { triggerDetailsServerError } = cloneDeep(flowData);
      if (triggerIndex > -1 && triggerDetailsServerError && triggerDetailsServerError[triggerIndex]) {
        const updatedTriggerServerError = {};
        delete triggerDetailsServerError[triggerIndex];
        Object.keys(triggerDetailsServerError).forEach((key) => {
          if (key > triggerIndex) updatedTriggerServerError[key - 1] = triggerDetailsServerError[key];
          else updatedTriggerServerError[key] = triggerDetailsServerError[key];
        });
        onFlowDataChange({ triggerDetailsServerError: updatedTriggerServerError });
      }
      saveFlowAPI({
        data: {
          ...getFlowTriggerDetailsData({}, flowData),
          ...getCreateFlowValidateData(flowData),
        },
        loader: true,
        history,
      }, true);
    } else {
      const currentTrigger = cloneDeep(currentTriggerData);
      currentTrigger.trigger_mapping_error_list = {
        ...trigger_mapping_error_list,
        ...triggerDetailsErrorList,
      };
      onFlowDataChange({ activeTriggerData: currentTrigger });
    }
  };

  return (
    <TriggerConfiguration
      parentId={flowData.flow_id}
      entity="flow_metadata"
      parentFlowName={flowData.flow_name}
      documentsType="flow_related_actions_static_documents"
      entityId={flowData.flow_id}
      entityUuid={flowData.flow_uuid}
      isFlowListLoading={isFlowListLoading}
      isChildFlowListLoading={isChildFlowListLoading}
      isChildFlowDetailsLoading={isChildFlowDetailsLoading}
      isTriggerConfigurationModalOpen={isFlowTriggerShortcutModalOpen}
      allFlowsList={allFlowsList}
      saveFlowTrigger={saveFlowTrigger}
      onGetFlowChildDetailsByUUID={onGetFlowChildDetailsByUUID}
      lstAllFields={parentFlowlstAllFields}
      childFlowlstAllFields={childFlowlstAllFields}
      parentFieldsTotalCount={get(
        parentFlowlstAllFieldspaginationData,
        ['total_count'],
        0,
      )}
      childFieldsTotalCount={get(
        childFlowlstAllFieldspaginationData,
        ['total_count'],
        0,
      )}
      currentTrigger={currentTriggerData}
      getAllFlowListApi={getFlowsList}
      cancelOrCloseTriggerConfiguration={cancelOrCloseTriggerConfiguration}
      setChildFlowData={setStepData}
      setTriggerData={setStepData}
      onGetAllFieldsByFilter={getFields}
      isActorsReadOnly
      isShortcut
      allLstAllFields={allparentFlowlstAllFields}
      allChildFlowlstAllFields={allchildFlowlstAllFields}
      flowsTotalCount={flowsTotalCount}
      updateFieldList={updateFieldList}
      loadingChildMappingFields={loadingChildMappingFields}
      loadingParentMappingFields={loadingParentMappingFields}
      triggerMappedUuids={triggerMappedUuids}
      lstAllFieldsMetaData={parentFlowlstAllFieldsMetaData}
      childFlowlstAllFieldsMetaData={childFlowlstAllFieldsMetaData}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
    isFlowTriggerShortcutModalOpen:
      state.EditFlowReducer.flowData
        .isFlowTriggerShortcutModalOpen,
    allFlowsList:
      state.EditFlowReducer.flowData.allFlowsList,
    isFlowListLoading:
      state.EditFlowReducer.flowData.isFlowListLoading,
    flowsTotalCount:
      state.EditFlowReducer.flowData.flowsTotalCount,
    loadingChildMappingFields: state.EditFlowReducer.flowData.loadingchildFlowlstAllFields,
    loadingParentMappingFields: state.EditFlowReducer.flowData.loadingparentFlowlstAllFields,
    isChildFlowListLoading: state.EditFlowReducer.isChildFlowListLoading,
    isChildFlowDetailsLoading: state.EditFlowReducer.flowData.isChildFlowDetailsLoading,
  };
};

const mapDispatchToProps = {
  updateFlowState: updateFlowStateChange,
  getAllFlowListApi: getAllFlowListApiThunk,
  onFlowDataChange: updateFlowDataChange,
  onGetAllFieldsByFilter: getTriggerMappingFields,
  onGetFlowChildDetailsByUUID: getChildFlowDetailsByUUID,
  saveFlowAPI: saveFlowThunk,
  onGetTriggerDetailsByUUID: getTriggerDetailsByUUID,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    TriggerShortcutConfiguration,
    20,
  ),
);
