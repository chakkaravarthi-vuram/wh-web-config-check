import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { flowSetStepData, updateFlowDataChange, updateFlowStateChange } from 'redux/reducer/EditFlowReducer';
import { linkSelectedStep } from 'redux/actions/EditFlow.Action';
import { getAllFlowListApiThunk, getTriggerDetailsByUUID, getChildFlowDetailsByUUID, getTriggerMappingFields } from 'redux/actions/FlowStepConfiguration.Action';

import { cloneDeep, get, has, isEmpty, set } from 'utils/jsUtility';
import { clearExternalFields } from 'redux/actions/Visibility.Action';
import { constructTriggerStepSaveData, getSaveTriggerValidateData } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { validate } from 'utils/UtilityFunctions';
import { newStepNameSchema, saveTriggerStepValidationSchema } from 'containers/edit_flow/step_configuration/StepConfiguration.validations';
import TriggerConfiguration from 'components/flow_trigger_configuration/TriggerConfiguration';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { ASSIGNEE_TYPE } from 'containers/edit_flow/EditFlow.utils';
import { getAccountConfigurationDetailsApiService } from '../../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import { VALIDATION_CONSTANT } from '../../../../../utils/constants/validation.constant';
import { getAssigneeValidationSchema } from '../../../step_configuration/StepConfiguration.validations';
import { getInactiveAssigneesList } from '../../../step_configuration/StepConfiguration.utils';
import { setPointerEvent, updatePostLoader } from '../../../../../utils/UtilityFunctions';

function FlowStepTrigger(props) {
  const {
    isFlowTriggerConfigurationModalOpen,
    isFlowListLoading,
    isChildFlowListLoading,
    isChildFlowDetailsLoading,
    setFlowStepData,
    saveStepAPI,
    onGetAllFieldsByFilter,
    onGetTriggerDetailsByUUID,
    getAllFlowListApi,
    onFlowDataChange,
    allFlowsList,
    currentTriggerData,
    dispatch,
    linkSteps,
    triggerParentId,
    onGetFlowChildDetailsByUUID,
    flowsTotalCount,
    server_error,
    updateFlowState,
    loadingChildMappingFields,
    loadingParentMappingFields,
    onDeleteStepClick,
  } = props;
  const { t } = useTranslation();
  console.log('FlowTriggerprops', props);
  const {
    flowData,
    flowData: {
      steps = [],
      parentFlowlstAllFields = [],
      allparentFlowlstAllFields = [],
      parentFlowlstAllFieldsMetaData = [],
      childFlowlstAllFields = [],
      allchildFlowlstAllFields = [],
      childFlowlstAllFieldsMetaData = [],
      parentFlowlstAllFieldspaginationData = {},
      childFlowlstAllFieldspaginationData = {},
      error_list = {},
      triggerMappedUuids = [],
    },
  } = cloneDeep(props);

  const [initialStepsState, setInitialStepsState] = useState([]);
  const [configuredMaxFileSize, setConfiguredMaxFileSize] = useState(0);

  // const { END_FLOW } = ACTION_TYPE;

  useEffect(() => {
    if (isEmpty(initialStepsState)) {
      setInitialStepsState(steps);
    }
  }, [steps?.length]);

  useEffect(() => {
    if (!isEmpty(get(currentTriggerData, ['trigger_uuid'], EMPTY_STRING))) {
      onGetTriggerDetailsByUUID(
        currentTriggerData.trigger_uuid,
        cloneDeep(currentTriggerData),
        'flow_steps',
        'step_sub_process_static_documents',
        currentTriggerData._id,
        false,
        t);
    }
    getAccountConfigurationDetailsApiService().then(
      (response) => {
        setConfiguredMaxFileSize(response.maximum_file_size);
      },
    );
  }, []);

  const getFlowsList = (searchWithPaginationData) => {
    getAllFlowListApi(searchWithPaginationData, cloneDeep(currentTriggerData));
  };

  const getFields = (paginationData, setStateKey, fieldListDropdownType, tableUuid, getCancelToken) =>
    onGetAllFieldsByFilter(paginationData, setStateKey, cloneDeep(currentTriggerData).trigger_mapping, fieldListDropdownType, tableUuid, getCancelToken, t);

  const cancelOrCloseTriggerConfiguration = () => {
    onFlowDataChange({
      isFlowTriggerConfigurationModalOpen: false,
      anotherFlowConfigurationStepId: null,
      allFlowsList: [],
      activeTriggerData: {},
      childFlowlstAllFields: [],
      parentFlowlstAllFields: [],
      childFlowlstAllFieldspaginationData: {},
      parentFlowlstAllFieldspaginationData: {},
      steps: initialStepsState,
    });
  };

  const setStepData = (currentTriggerData, clearServerError) => {
    console.log('setStepData currentStep', cloneDeep(currentTriggerData));
    const updatedStepData = cloneDeep(steps);
    const clonedFlowData = cloneDeep(flowData);
    const clonedServerError = cloneDeep(server_error);
    const clonedErrorList = cloneDeep(error_list);
    const currentStepIndex = clonedFlowData.steps.findIndex(
      (step) => step._id === currentTriggerData._id);
    if (currentStepIndex > -1) {
      console.log('setStepData currentStep', currentStepIndex, currentTriggerData);
      updatedStepData[currentStepIndex] = cloneDeep(currentTriggerData);
      clonedFlowData.steps = updatedStepData;
      if (clearServerError) {
        delete clonedServerError?.step_name;
        delete clonedErrorList?.step_name;
      }
      clonedFlowData.error_list = clonedErrorList;
      console.log('clonedServerError', clonedServerError, clearServerError);
      updateFlowState({ flowData: clonedFlowData, server_error: clonedServerError });
    } else {
      if (clearServerError) {
        delete clonedServerError?.step_name;
        delete clonedErrorList?.step_name;
      }
      clonedFlowData.error_list = clonedErrorList;
      clonedFlowData.activeTriggerData = currentTriggerData;
      updateFlowState({ flowData: clonedFlowData, server_error: clonedServerError });
    }
  };

  const onAssigneeDataChange = (data, index) => {
    const activeTriggerData = cloneDeep(currentTriggerData);
    const stepAssignees = data.step_assignees || [];
    let errorList = activeTriggerData?.assignee_error_list || {};
    let isErrorInAssignees = false;
    Object.keys(errorList).forEach((errorKey) => {
      if (errorKey.includes(`step_assignees,${index}`)) {
        if (!isErrorInAssignees) isErrorInAssignees = true;
        delete errorList[errorKey];
      } else if (errorKey === 'step_assignees') {
        delete errorList[errorKey];
      }
    });
    if (isErrorInAssignees) {
      const assigneeError = validate({ step_assignees: stepAssignees }, getAssigneeValidationSchema(t));
      const directAssigneeIndex = stepAssignees.findIndex(({ assignee_type }) => assignee_type === ASSIGNEE_TYPE.DIRECT_ASSIGNEE);
      if ((directAssigneeIndex > -1) && stepAssignees[directAssigneeIndex]?.assignees) {
        const inactiveAssigneeList = getInactiveAssigneesList(stepAssignees[directAssigneeIndex].assignees);
        if (!isEmpty(inactiveAssigneeList)) {
          set(errorList, ['step_assignees', directAssigneeIndex, 'assignees'], `${t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID)}: ${inactiveAssigneeList.join(', ')}`);
        }
      }
      errorList = { ...errorList, ...assigneeError };
    }
    if (currentTriggerData._id) {
      const clonedFlowData = cloneDeep(flowData);
      const currentStepIndex = clonedFlowData.steps.findIndex((step) => step._id === currentTriggerData._id);
      const currentStepDetails = clonedFlowData.steps[currentStepIndex];
      set(clonedFlowData, ['steps', currentStepIndex], {
        ...currentStepDetails,
        ...data,
        assignee_error_list: errorList,
      });
      dispatch(updateFlowDataChange(clonedFlowData));
    } else {
      dispatch(updateFlowDataChange({ activeTriggerData: { ...activeTriggerData, ...data, assignee_error_list: errorList } }));
    }
    console.log(data, activeTriggerData, 'fkljkgljfkdljl', isErrorInAssignees, errorList);
  };

  const updateFieldList = (key, fieldList) => {
    onFlowDataChange({
      [key]: fieldList,
    });
  };

  const saveFlowTrigger = async () => {
    const flow_data = cloneDeep(flowData);
    const { trigger_mapping_error_list } = currentTriggerData;
    let inactiveAssigneeList = [];
    const stepAssignees = currentTriggerData.step_assignees || [];
    const assigneeError = validate({ step_assignees: stepAssignees }, getAssigneeValidationSchema(t));
    const directAssigneeIndex = stepAssignees.findIndex(({ assignee_type }) => assignee_type === ASSIGNEE_TYPE.DIRECT_ASSIGNEE);
    if (stepAssignees?.[directAssigneeIndex]?.assignees) {
      const directAssignees = stepAssignees?.[directAssigneeIndex];
      inactiveAssigneeList = getInactiveAssigneesList(directAssignees.assignees);
      if (!isEmpty(inactiveAssigneeList)) {
        set(assigneeError, [`step_assignees,${directAssigneeIndex},assignees`], `${t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID)}: ${inactiveAssigneeList.join(', ')}`);
      }
    }
    const triggerDetailsErrorList = validate(
      {
        ...getSaveTriggerValidateData(
          cloneDeep(currentTriggerData),
        ),
        step_name: currentTriggerData.step_name,
      },
      newStepNameSchema(t).concat(saveTriggerStepValidationSchema(t, configuredMaxFileSize)),
    );
    if (isEmpty(triggerDetailsErrorList) && isEmpty(assigneeError) && isEmpty(inactiveAssigneeList) && isEmpty(trigger_mapping_error_list)) {
      if (!has(currentTriggerData, ['_id']) || get(currentTriggerData, ['newStep'], false)) {
        const saveStepData =
          constructTriggerStepSaveData(
            cloneDeep(currentTriggerData),
            { flow_id: flowData.flow_id, steps: cloneDeep(steps) },
          );
        try {
          const updatedFlowData = await saveStepAPI({
            postData: saveStepData,
            isNewStep: true,
          });
          if (!isEmpty(updatedFlowData?.steps)) {
            updatedFlowData.isFlowTriggerConfigurationModalOpen = false;
            const stepDetails = updatedFlowData.steps.find((step) => step.step_name === saveStepData.step_name);
            if (triggerParentId) {
              await linkSteps({
                newStepUuid: stepDetails.step_uuid,
                connectToStepId: triggerParentId,
                flowDataCopy: cloneDeep(updatedFlowData),
                createNewAction: true,
              });
            }
          }
          setPointerEvent(false);
          updatePostLoader(false);
        } catch (e) {
          console.log(e);
          setPointerEvent(false);
          updatePostLoader(false);
        }
      } else {
        const currentStepIndex = flow_data.steps.findIndex((step) => step._id === currentTriggerData._id);
        const postData = constructTriggerStepSaveData(currentTriggerData, cloneDeep(flowData), currentStepIndex);
        try {
          const updatedFlowData = await saveStepAPI({
            postData: postData,
          });
          setPointerEvent(false);
          updatePostLoader(false);
          if (!isEmpty(updatedFlowData)) {
            updatedFlowData.isFlowTriggerConfigurationModalOpen = false;
            onFlowDataChange(cloneDeep(updatedFlowData));
          }
        } catch (e) {
          setPointerEvent(false);
          updatePostLoader(false);
        }
      }
    } else {
      if (currentTriggerData._id) {
        const currentStepIndex = flow_data.steps.findIndex((step) => step._id === currentTriggerData._id);
        if (!isEmpty(assigneeError)) {
          setFlowStepData(
            'assignee_error_list',
            assigneeError,
            currentStepIndex,
          );
        }
        if (!isEmpty(triggerDetailsErrorList)) {
          setFlowStepData(
            'trigger_mapping_error_list',
            { ...triggerDetailsErrorList, ...trigger_mapping_error_list },
            currentStepIndex,
          );
        }
      } else {
        const currentTrigger = cloneDeep(currentTriggerData);
        currentTrigger.assignee_error_list = assigneeError;
        currentTrigger.trigger_mapping_error_list = { ...trigger_mapping_error_list, ...triggerDetailsErrorList };
        onFlowDataChange({ activeTriggerData: currentTrigger });
      }
    }
  };

  if (!has(currentTriggerData, ['ruleData'])) {
    currentTriggerData.ruleData = {
      _id: EMPTY_STRING,
      isRule: false,
      selected_assignee_type: EMPTY_STRING,
      // step_assignees: [],
      expression_type: 'decisionExpression',
      expression: {
        if: [],
        conditionsRowCount: 0,
        else_output_field: 'const_working_retired',
        else_output_value: {
          users: [],
          teams: [],
        },
        elseTeamOrUserSearchValue: EMPTY_STRING,
        elseTeamOrUserSelectedValue: EMPTY_STRING,
      },
    };
  }

  const {
    trigger_mapping = [],
    trigger_mapping_error_list = {},
  } = currentTriggerData;
  console.log('eeeeeeeeeeeeeeeeeetttttttttttt', cloneDeep(currentTriggerData), trigger_mapping, trigger_mapping_error_list);
  return (
    <TriggerConfiguration
      currentTriggerData={currentTriggerData}
      parentId={flowData.flow_id}
      onDeleteStepClick={onDeleteStepClick}
      parentFlowName={flowData.flow_name}
      entity="flow_steps"
      documentsType="step_sub_process_static_documents"
      isFlowListLoading={isFlowListLoading}
      isChildFlowListLoading={isChildFlowListLoading}
      isChildFlowDetailsLoading={isChildFlowDetailsLoading}
      isTriggerConfigurationModalOpen={isFlowTriggerConfigurationModalOpen}
      allFlowsList={allFlowsList}
      saveFlowTrigger={saveFlowTrigger}
      lstAllFields={parentFlowlstAllFields}
      allLstAllFields={allparentFlowlstAllFields}
      lstAllFieldsMetaData={parentFlowlstAllFieldsMetaData}
      childFlowlstAllFields={childFlowlstAllFields}
      allChildFlowlstAllFields={allchildFlowlstAllFields}
      childFlowlstAllFieldsMetaData={childFlowlstAllFieldsMetaData}
      parentFieldsTotalCount={get(parentFlowlstAllFieldspaginationData, ['total_count'], 0)}
      childFieldsTotalCount={get(childFlowlstAllFieldspaginationData, ['total_count'], 0)}
      currentTrigger={cloneDeep(currentTriggerData)}
      getAllFlowListApi={getFlowsList}
      cancelOrCloseTriggerConfiguration={cancelOrCloseTriggerConfiguration}
      setChildFlowData={(data) => setStepData(data, true)}
      setTriggerData={setStepData}
      onGetAllFieldsByFilter={getFields}
      onAssigneeDataChange={onAssigneeDataChange}
      onGetFlowChildDetailsByUUID={onGetFlowChildDetailsByUUID}
      flowsTotalCount={flowsTotalCount}
      updateFieldList={updateFieldList}
      nameError={server_error?.step_name || error_list?.step_name}
      entityId={currentTriggerData._id}
      loadingChildMappingFields={loadingChildMappingFields}
      loadingParentMappingFields={loadingParentMappingFields}
      triggerMappedUuids={triggerMappedUuids}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
    currentStepId: state.EditFlowReducer.flowData.anotherFlowConfigurationStepId,
    isFlowTriggerConfigurationModalOpen: state.EditFlowReducer.flowData.isFlowTriggerConfigurationModalOpen,
    allFlowsList: state.EditFlowReducer.flowData.allFlowsList,
    flowsTotalCount: state.EditFlowReducer.flowData.flowsTotalCount,
    isFlowListLoading: state.EditFlowReducer.flowData.isFlowListLoading,
    triggerParentId: state.EditFlowReducer.flowData.triggerParentId,
    server_error: state.EditFlowReducer.server_error,
    isChildFlowListLoading: state.EditFlowReducer.isChildFlowListLoading,
    isChildFlowDetailsLoading: state.EditFlowReducer.flowData.isChildFlowDetailsLoading,
    loadingChildMappingFields: state.EditFlowReducer.flowData.loadingchildFlowlstAllFields,
    loadingParentMappingFields: state.EditFlowReducer.flowData.loadingparentFlowlstAllFields,
    detailedFlowErrorInfo: state.EditFlowReducer.detailedFlowErrorInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFlowState: (value) => {
      dispatch(updateFlowStateChange(value));
    },
    getAllFlowListApi: (searchWithPaginationData) => {
      dispatch(getAllFlowListApiThunk(searchWithPaginationData));
    },
    setFlowStepData: (...params) => {
      dispatch(flowSetStepData(...params));
    },
    onFlowDataChange: (flowData) => {
      dispatch(updateFlowDataChange(flowData));
    },
    clearDefaultValueExternalFields: () => dispatch(clearExternalFields()),
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
        getTriggerMappingFields(
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
    onGetTriggerDetailsByUUID: (data, currentTriggerData, entity, type, entityId) => {
      dispatch(getTriggerDetailsByUUID(data, currentTriggerData, entity, type, entityId));
    },
    linkSteps: (...params) => {
      dispatch(linkSelectedStep(...params));
    },
    onGetFlowChildDetailsByUUID: (flow_uuid, isTestBed, currentTriggerData, enableLoader) => {
      dispatch(getChildFlowDetailsByUUID(flow_uuid, isTestBed, currentTriggerData, enableLoader));
    },
    dispatch,
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FlowStepTrigger, 20),
);
