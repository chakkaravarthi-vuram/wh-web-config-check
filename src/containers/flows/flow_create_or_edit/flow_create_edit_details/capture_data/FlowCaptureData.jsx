import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Skeleton } from '@workhall-pvt-lmt/wh-ui-library';
import DependencyHandler from '../../../../../components/dependency_handler/DependencyHandler';
import NodeDeleteConfiguration from '../../../../edit_flow/node_configuration/NodeDeleteConfiguration';
import { cloneDeep, isEmpty } from '../../../../../utils/jsUtility';
import { checkStepDependencyApiThunk, saveStepNodeApiThunk } from '../../../../../redux/actions/FlowStepConfiguration.Action';
import { closeLinkDependencyPopup, onDeleteStepLink } from '../../../../edit_flow/diagramatic_flow_view/DigramaticFlowView.utils';
import NodeConfiguration from '../../../../edit_flow/node_configuration/NodeConfiguration';
import ErrorDisplay from '../../../../edit_flow/ErrorDisplay';
import { createNewStepApiThunk, getAllFlowStepsById, saveConnectorLine } from '../../../../../redux/actions/EditFlow.Action';
import gClasses from '../../../../../scss/Typography.module.scss';
import DiagramaticFlowView from '../../../../edit_flow/diagramatic_flow_view/DiagramaticFlowView';
import { calculateStepName, constructPostDataForCreateStep } from '../../../../edit_flow/EditFlow.utils';
import { updateFlowStateChange } from '../../../../../redux/reducer/EditFlowReducer';

function FlowCaptureData(props) {
  const {
    flowName,
    metaData,
    systemFields,
    stepStatusList = [],
    metaData: {
      flowId,
      flowUUID,
    } } = props;
  const {
    isNodeConfigOpen,
    isFlowDiagramLoading,
    isErrorInFetchingFlowDiagram,
    selectedStepType,
    selectedStepUuid,
    activeStepId,
    flowData,
    flowData: {
      showStepDependencyDialog,
      showLinkDependencyDialog,
      dependency_name,
      dependency_data,
      linkSource,
      linkTarget,
    },
  } = useSelector((state) => state.EditFlowReducer);
  const reduxDispatch = useDispatch();

  let flowViewComponent = null;

  const loadFlowDataAgain = () => {
    reduxDispatch(getAllFlowStepsById(flowId, flowUUID, flowData, stepStatusList));
  };

  const onDeleteStepClick = async (stepId) => {
    console.log('deleteStepClicked from StepCard', stepId);
    const flow_data = cloneDeep(flowData);
    const checkFormDependencyParams = {
      _id: stepId,
    };
    const stepDetails = flow_data.steps.find((step) => stepId === step._id);
    if (stepDetails) {
      if (stepDetails.step_uuid) {
        reduxDispatch(checkStepDependencyApiThunk(
          checkFormDependencyParams,
          'Step',
          stepDetails.step_name,
        ));
      }
    }
  };

  const saveConnectorLines = (params, additionalData, updateCoordinates) => {
    reduxDispatch(saveConnectorLine(
      params,
      {},
      additionalData,
      updateCoordinates,
    ));
  };

  const addNewNode = async (newNodeParams = {}, connectorDetails = {}) => {
    if (isEmpty(newNodeParams.stepName)) {
      newNodeParams.stepName = calculateStepName(newNodeParams.stepType);
    }
    const nodeParams = constructPostDataForCreateStep(newNodeParams);
    const res = reduxDispatch(createNewStepApiThunk({
      params: { flow_id: flowId, flow_uuid: flowUUID, ...nodeParams },
      connectorDetails,
    }));
    return res;
  };

  useEffect(() => {
    if (flowUUID) {
      reduxDispatch(getAllFlowStepsById(flowId, flowUUID, flowData, stepStatusList));
    }
  }, []);

  const updateFlowDiagramData = (data) => {
    reduxDispatch(updateFlowStateChange({ ...data }));
  };

  const saveStepNode = (postData, handleErrors) => reduxDispatch(saveStepNodeApiThunk({
      postData,
      handleErrors,
  }));

  const nodeConfigModal = isNodeConfigOpen && (
    <NodeConfiguration
      onDeleteStepClick={onDeleteStepClick}
      saveStepNode={saveStepNode}
      metaData={metaData}
      selectedStepType={selectedStepType}
      selectedStepUuid={selectedStepUuid}
      flowData={flowData}
      activeStepId={activeStepId}
      updateFlowStateChange={updateFlowDiagramData}
      addNewNode={addNewNode}
      saveConnectorLines={saveConnectorLines}
      allSystemFields={systemFields}
      flowName={flowName}
    />
  );

  if (isErrorInFetchingFlowDiagram) {
    flowViewComponent = (
      <div className={gClasses.CenterH}>
        <ErrorDisplay onButtonClick={loadFlowDataAgain} />
      </div>
    );
  } else if (isFlowDiagramLoading) {
    flowViewComponent = (
      <>
        <div className={gClasses.MB20}>
          <Skeleton height={50} />
        </div>
        <div className={gClasses.MB20}>
          <Skeleton height={50} />
        </div>
        <div className={gClasses.MB20}>
          <Skeleton height={50} />
        </div>
      </>
    );
  } else {
    flowViewComponent = (
      <DiagramaticFlowView
        // onStepClick={onUserStepClick}
        addNewNode={addNewNode}
        onDeleteStepClick={onDeleteStepClick}
        metaData={metaData}
      />
    );
  }

  return (
    <>
      {nodeConfigModal}
      {flowViewComponent}
      {
        showStepDependencyDialog && (
          <NodeDeleteConfiguration />
        )
      }
      {
        showLinkDependencyDialog && (
          <DependencyHandler
            onDeleteClick={() => onDeleteStepLink(linkSource, linkTarget)}
            onCancelDeleteClick={closeLinkDependencyPopup}
            dependencyHeaderTitle={dependency_name}
            dependencyData={dependency_data}
          />
        )
      }
    </>
  );
}

export default FlowCaptureData;
