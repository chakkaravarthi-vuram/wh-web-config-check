import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { cloneDeep, get, isEmpty } from 'utils/jsUtility';
import TriggerConfiguration from 'components/flow_trigger_configuration/TriggerConfiguration';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import {
  createDatalistChange,
  dataListStateChangeAction,
} from 'redux/reducer/CreateDataListReducer';
import { useTranslation } from 'react-i18next';
import {
  getAllFieldsDataList,
  getAllFlowListApiThunk,
  getChildFlowDetailsByUUID,
  getTriggerDetailsByUUID,
  saveDataListApiThunk,
} from 'redux/actions/CreateDataList.action';
import { FLOW_TRIGGER_CONSTANTS } from 'components/flow_trigger_configuration/TriggerConfiguration.constants';
import { validate } from 'utils/UtilityFunctions';
import { getSaveTriggerValidateData } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import {
  saveTriggerStepValidationSchema,
  triggerNameSchema,
} from 'containers/edit_flow/step_configuration/StepConfiguration.validations';
import { getSaveDataListPostDetailsSelector } from 'redux/selectors/CreateDataList.selectors';
import { getDataListDetailsPostData } from 'containers/flow/create_data_list/CreateDataList.utility';
import { getAccountConfigurationDetailsApiService } from '../../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { TRIGGER_NAMES_ERROR } from '../../../../../edit_flow/settings/default_report_fields_list/Metrics.strings';

function TriggerShortcutConfiguration(props) {
  const {
    isFlowListLoading,
    isChildFlowListLoading,
    isChildFlowDetailsLoading,
    onGetAllFieldsByFilter,
    onGetFlowChildDetailsByUUID,
    getAllFlowListApi,
    onDataListDataChange,
    currentTriggerData,
    saveDataListPostDetails,
    onSaveDataList,
    state,
    loadingChildMappingFields,
    loadingParentMappingFields,
  } = props;
  const { t } = useTranslation();

  const {
    state: {
      isDatalistTriggerShortcutModalOpen,
      data_list_id,
      data_list_name,
      data_list_uuid,
      allFlowsList,
      flowsTotalCount,
      parentFlowlstAllFields = [],
      allparentFlowlstAllFields,
      childFlowlstAllFields = [],
      allchildFlowlstAllFields = [],
      parentFlowlstAllFieldspaginationData = {},
      childFlowlstAllFieldspaginationData = {},
      triggerMappedUuids = [],
      parentFlowlstAllFieldsMetaData = [],
      childFlowlstAllFieldsMetaData = [],
    },
    onGetTriggerDetailsByUUID,
    triggerIndex,
  } = props;
  const [configuredMaxFileSize, setConfiguredMaxFileSize] = useState(0);

  useEffect(() => {
    if (!isEmpty(get(currentTriggerData, ['trigger_uuid'], EMPTY_STRING))) {
      onGetTriggerDetailsByUUID(
        currentTriggerData.trigger_uuid,
        cloneDeep(currentTriggerData),
        'data_list',
        'datalist_related_actions_static_documents',
        data_list_id,
        t,
      );
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

  const getFields = (paginationData, setStateKey, fieldListDropdownType, tableUuid, getCancelToken) => {
    if (
      FLOW_TRIGGER_CONSTANTS.PARENT_FLOW_FIELDS_SET_STATE_KEY ===
      setStateKey
    ) {
      paginationData.data_list_id = paginationData.flow_id;
      delete paginationData.flow_id;
    }
    onGetAllFieldsByFilter(
      paginationData,
      EMPTY_STRING,
      setStateKey,
      currentTriggerData?.trigger_mapping,
      fieldListDropdownType,
      tableUuid,
      getCancelToken,
    );
  };

  const cancelOrCloseTriggerConfiguration = () => {
    onDataListDataChange({
      isDatalistTriggerShortcutModalOpen: false,
      allFlowsList: [],
      activeTriggerData: {},
      childFlowlstAllFields: [],
      parentFlowlstAllFields: [],
      childFlowlstAllFieldspaginationData: {},
      parentFlowlstAllFieldspaginationData: {},
    });
  };

  const setStepData = (currentTriggerData) => {
    onDataListDataChange({ activeTriggerData: currentTriggerData });
  };

  const updateFieldList = (key, fieldList) => {
    onDataListDataChange({
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
      console.log('currentdatatriggerdetailscheckfordl', state.trigger_details, 'current trigger data', currentTriggerData);
      state.trigger_details.forEach((eachName) => {
        if ((currentTriggerData?.trigger_uuid !== eachName?.trigger_uuid) && (currentTriggerData?.trigger_name === eachName?.trigger_name)) triggerDetailsErrorList.trigger_name = TRIGGER_NAMES_ERROR(t).ALREADY_EXIST;
      });
    }

    if (
      isEmpty(triggerDetailsErrorList) &&
      isEmpty(trigger_mapping_error_list)
    ) {
      // save datalist call
      const clonedSavePublishDataList = cloneDeep(saveDataListPostDetails);
      const savePostData = getDataListDetailsPostData(
        clonedSavePublishDataList,
        false,
        true,
      );

      const { triggerDetailsServerError } = cloneDeep(state);
      if (triggerIndex > -1 && triggerDetailsServerError && triggerDetailsServerError[triggerIndex]) {
        const updatedTriggerServerError = {};
        delete triggerDetailsServerError[triggerIndex];
        Object.keys(triggerDetailsServerError).forEach((key) => {
          if (key > triggerIndex) updatedTriggerServerError[key - 1] = triggerDetailsServerError[key];
          else updatedTriggerServerError[key] = triggerDetailsServerError[key];
        });
        onDataListDataChange({ triggerDetailsServerError: updatedTriggerServerError });
      }

      onSaveDataList(savePostData, null, false);
    } else {
      const currentTrigger = cloneDeep(currentTriggerData);
      currentTrigger.trigger_mapping_error_list = {
        ...trigger_mapping_error_list,
        ...triggerDetailsErrorList,
      };
      onDataListDataChange({ activeTriggerData: currentTrigger });
    }
  };

  return (
    <TriggerConfiguration
      parentId={data_list_id}
      isFlowListLoading={isFlowListLoading}
      isChildFlowListLoading={isChildFlowListLoading}
      isChildFlowDetailsLoading={isChildFlowDetailsLoading}
      parentFlowName={data_list_name}
      isTriggerConfigurationModalOpen={isDatalistTriggerShortcutModalOpen}
      allFlowsList={allFlowsList}
      saveFlowTrigger={saveFlowTrigger}
      lstAllFields={parentFlowlstAllFields}
      childFlowlstAllFields={childFlowlstAllFields}
      onGetFlowChildDetailsByUUID={onGetFlowChildDetailsByUUID}
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
      entity="data_list"
      documentsType="datalist_related_actions_static_documents"
      entityId={data_list_id}
      entityUuid={data_list_uuid}
      allLstAllFields={allparentFlowlstAllFields}
      allChildFlowlstAllFields={allchildFlowlstAllFields}
      flowsTotalCount={flowsTotalCount}
      updateFieldList={updateFieldList}
      isDataListShortcut
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
    state: state.CreateDataListReducer,
    saveDataListPostDetails: getSaveDataListPostDetailsSelector(
      state.CreateDataListReducer,
    ),
    loadingChildMappingFields: state.CreateDataListReducer.loadingchildFlowlstAllFields,
    loadingParentMappingFields: state.CreateDataListReducer.loadingparentFlowlstAllFields,
    isChildFlowListLoading: state.CreateDataListReducer.isChildFlowListLoading,
    isFlowListLoading: state.CreateDataListReducer.isFlowListLoading,
    isChildFlowDetailsLoading: state.CreateDataListReducer.isChildFlowDetailsLoading,
  };
};

const mapDispatchToProps = {
  getAllFlowListApi: getAllFlowListApiThunk,
  onGetAllFieldsByFilter: getAllFieldsDataList,
  onGetFlowChildDetailsByUUID: getChildFlowDetailsByUUID,
  onDataListDataChange: createDatalistChange,
  onDataListStateChange: dataListStateChangeAction,
  onSaveDataList: saveDataListApiThunk,
  onGetTriggerDetailsByUUID: getTriggerDetailsByUUID,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    TriggerShortcutConfiguration,
    20,
  ),
);
