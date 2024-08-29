import React, { useState } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import UserStepConfiguration from '../step_configuration/StepConfiguration';
import { STEP_TYPE } from '../../../utils/Constants';
import { PARALLEL_STEP_CONFIG } from '../step_configuration/configurations/Configuration.strings';
import StartStepConfiguration from '../step_configuration/node_configurations/start_step/StartStepConfiguration';
import SendEmailConfig from '../step_configuration/node_configurations/send_email/SendEmailConfig';
import WaitStepConfig from '../step_configuration/node_configurations/wait_step/WaitStepConfig';
import { FlowNodeProvider } from './use_node_reducer/useNodeReducer';
import { START_STEP_INITIAL_STATE } from '../step_configuration/node_configurations/start_step/StartStepConfig.constants';
import { END_STEP_INITIAL_STATE } from '../step_configuration/node_configurations/end_step/EndStepConfig.constants';
import { WAIT_STEP_INITIAL_STATE } from '../step_configuration/node_configurations/wait_step/WaitStepConfig.strings';
import EndStepConfig from '../step_configuration/node_configurations/end_step/EndStepConfig';
import GenerateDocument from '../step_configuration/node_configurations/generate_document/GenerateDocument';
import { GENERATE_DOCUMENT_INITIAL_STATE } from '../step_configuration/node_configurations/generate_document/GenerateDocument.constants';
import SendDataToDlConfig from '../step_configuration/node_configurations/send_data_to_datalist/SendDataToDlConfig';
import CallAnotherFlow from '../step_configuration/node_configurations/call_another_flow/CallAnotherFlow';
import JoinParallelPaths from '../step_configuration/node_configurations/join_parallel_paths/JoinParallelPaths';
import CallIntegration from '../step_configuration/node_configurations/call_integration/CallIntegration';
import DataManipulator from '../step_configuration/node_configurations/data_manipulator/DataManipulator';
import BranchParallelPaths from '../step_configuration/node_configurations/branch_parallel_paths/BranchParallelPaths';
import { SEND_EMAIL_INITIAL_STATE } from '../step_configuration/node_configurations/send_email/SendEmailConfig.constants';
import { CALL_INTEGRATION_INITIAL_STATE } from '../step_configuration/node_configurations/call_integration/CallIntegration.constants';
import { SEND_DATA_TO_DL_INITIAL_STATE } from '../step_configuration/node_configurations/send_data_to_datalist/SendDataToDl.constants';
import { TRIGGER_STEP_INITIAL_STATE } from '../step_configuration/node_configurations/call_another_flow/CallAnotherFlow.constants';
import { apiGetFlowStepDetailsById } from '../../../axios/apiService/flow.apiService';
import { updateLoaderStatus } from './NodeConfiguration.utils';
import { PARALLEL_STEP_INITIAL_STATE } from '../step_configuration/node_configurations/branch_parallel_paths/BranchParallelPaths.constants';
import { DATA_MANIPULATOR_INITIAL_STATE } from '../step_configuration/node_configurations/data_manipulator/DataManipulator.constants';

function NodeConfiguration(props) {
    const { t } = useTranslation();
    const {
        selectedStepType,
        activeStepId,
        className,
        flowData,
        metaData,
        updateFlowStateChange,
        onDeleteStepClick,
        saveStepNode,
        addNewNode,
        saveConnectorLines,
        allSystemFields,
        flowName,
    } = props;

    let configModal = null;

    const [isLoadingNodeDetails, setNodeDetailsLoader] = useState(true);
    const [isErrorInLoadingNodeDetails, setNodeDetailsError] = useState(false);

    const getStepNodeDetails = async (stepId) => {
        try {
            setNodeDetailsLoader(true);
            setNodeDetailsError(false);
            updateLoaderStatus(true);
            const res = await apiGetFlowStepDetailsById(stepId);
            updateLoaderStatus(false);
            setNodeDetailsLoader(false);
            return res;
        } catch (error) {
            updateLoaderStatus(false);
            setNodeDetailsLoader(false);
            setNodeDetailsError(true);
            throw new Error(error);
        }
    };

    switch (selectedStepType) {
        case STEP_TYPE.USER_STEP:
            configModal = (
                <UserStepConfiguration
                    stepId={activeStepId}
                    pageTitle={t(PARALLEL_STEP_CONFIG.HEADER)}
                    onDeleteStepClick={onDeleteStepClick}
                    metaData={{
                        ...metaData,
                        stepId: activeStepId,
                    }}
                    steps={flowData?.steps}
                    addNewNode={addNewNode}
                    allSystemFields={allSystemFields}
                    parentFlowName={flowName}
                />
            );
            break;
        case STEP_TYPE.END_FLOW:
            configModal = (
                <FlowNodeProvider initialState={END_STEP_INITIAL_STATE}>
                    <EndStepConfig
                        updateFlowStateChange={updateFlowStateChange}
                        stepId={activeStepId}
                        metaData={metaData}
                        onDeleteStepClick={onDeleteStepClick}
                        saveStepNode={saveStepNode}
                        getStepNodeDetails={getStepNodeDetails}
                        isLoadingNodeDetails={isLoadingNodeDetails}
                        isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                    />
                </FlowNodeProvider>
            );
            break;
        case STEP_TYPE.START_STEP:
            configModal = (
                <FlowNodeProvider initialState={START_STEP_INITIAL_STATE}>
                    <StartStepConfiguration
                        activeStepId={activeStepId}
                        updateFlowStateChange={updateFlowStateChange}
                    />
                </FlowNodeProvider>
            );
            break;
        case STEP_TYPE.DOCUMENT_GENERATION:
            configModal = (
                <FlowNodeProvider initialState={GENERATE_DOCUMENT_INITIAL_STATE}>
                    <GenerateDocument
                        stepId={activeStepId}
                        updateFlowStateChange={updateFlowStateChange}
                        metaData={metaData}
                        steps={flowData?.steps}
                        onDeleteStepClick={onDeleteStepClick}
                        getStepNodeDetails={getStepNodeDetails}
                        isLoadingNodeDetails={isLoadingNodeDetails}
                        isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                        saveStepNode={saveStepNode}
                        allSystemFields={allSystemFields}
                    />
                </FlowNodeProvider>
            );
            break;
        case STEP_TYPE.EMAIL_CONFIGURATION:
            configModal = (
                <FlowNodeProvider initialState={SEND_EMAIL_INITIAL_STATE}>
                    <SendEmailConfig
                        stepId={activeStepId}
                        saveStepNode={saveStepNode}
                        onDeleteStepClick={onDeleteStepClick}
                        getStepNodeDetails={getStepNodeDetails}
                        steps={flowData?.steps}
                        metaData={metaData}
                        isLoadingNodeDetails={isLoadingNodeDetails}
                        isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                        updateFlowStateChange={updateFlowStateChange}
                        allSystemFields={allSystemFields}
                    />
                </FlowNodeProvider>
            );
            break;
        case STEP_TYPE.WAIT_STEP:
            configModal = (
                <FlowNodeProvider initialState={WAIT_STEP_INITIAL_STATE}>
                    <WaitStepConfig
                        onDeleteStepClick={onDeleteStepClick}
                        stepId={activeStepId}
                        saveStepNode={saveStepNode}
                        getStepNodeDetails={getStepNodeDetails}
                        metaData={metaData}
                        isLoadingNodeDetails={isLoadingNodeDetails}
                        isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                        updateFlowStateChange={updateFlowStateChange}
                    />
                </FlowNodeProvider>
            );
            break;
        case STEP_TYPE.SEND_DATA_TO_DATALIST:
            configModal = (
                <FlowNodeProvider initialState={SEND_DATA_TO_DL_INITIAL_STATE(t)}>
                    <SendDataToDlConfig
                        metaData={metaData}
                        onDeleteStepClick={onDeleteStepClick}
                        stepId={activeStepId}
                        updateFlowStateChange={updateFlowStateChange}
                        saveStepNode={saveStepNode}
                        getStepNodeDetails={getStepNodeDetails}
                        isLoadingNodeDetails={isLoadingNodeDetails}
                        isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                        steps={flowData?.steps}
                        allSystemFields={allSystemFields}
                    />
                </FlowNodeProvider>
            );
            break;
        case STEP_TYPE.FLOW_TRIGGER:
            configModal = (
                <FlowNodeProvider initialState={TRIGGER_STEP_INITIAL_STATE}>
                    <CallAnotherFlow
                        metaData={metaData}
                        onDeleteStepClick={onDeleteStepClick}
                        stepId={activeStepId}
                        updateFlowStateChange={updateFlowStateChange}
                        saveStepNode={saveStepNode}
                        getStepNodeDetails={getStepNodeDetails}
                        isLoadingNodeDetails={isLoadingNodeDetails}
                        isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                        steps={flowData?.steps}
                        allSystemFields={allSystemFields}
                    />
                </FlowNodeProvider>
            );
            break;
        case STEP_TYPE.INTEGRATION:
            configModal = (
                <FlowNodeProvider initialState={CALL_INTEGRATION_INITIAL_STATE}>
                    <CallIntegration
                        metaData={metaData}
                        onDeleteStepClick={onDeleteStepClick}
                        stepId={activeStepId}
                        updateFlowStateChange={updateFlowStateChange}
                        saveStepNode={saveStepNode}
                        steps={flowData?.steps}
                        getStepNodeDetails={getStepNodeDetails}
                        isLoadingNodeDetails={isLoadingNodeDetails}
                        isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                        allSystemFields={allSystemFields}
                    />
                </FlowNodeProvider>
            );
            break;
        case STEP_TYPE.JOIN_STEP:
            configModal = (
                <FlowNodeProvider initialState={{}}>
                    <JoinParallelPaths
                        metaData={metaData}
                        onDeleteStepClick={onDeleteStepClick}
                        stepId={activeStepId}
                        updateFlowStateChange={updateFlowStateChange}
                        saveStepNode={saveStepNode}
                        getStepNodeDetails={getStepNodeDetails}
                        isLoadingNodeDetails={isLoadingNodeDetails}
                        isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                        steps={flowData?.steps}
                    />
                </FlowNodeProvider>
            );
            break;
        case STEP_TYPE.DATA_MANIPULATOR:
            configModal = (
                <FlowNodeProvider initialState={DATA_MANIPULATOR_INITIAL_STATE}>
                    <DataManipulator
                        metaData={metaData}
                        onDeleteStepClick={onDeleteStepClick}
                        stepId={activeStepId}
                        updateFlowStateChange={updateFlowStateChange}
                        saveStepNode={saveStepNode}
                        getStepNodeDetails={getStepNodeDetails}
                        isLoadingNodeDetails={isLoadingNodeDetails}
                        isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                        steps={flowData?.steps || []}
                        allSystemFields={allSystemFields}
                    />
                </FlowNodeProvider>
            );
            break;
        case STEP_TYPE.CONDITON_PATH_SELECTOR:
        case STEP_TYPE.PARALLEL_STEP:
            configModal = (
                <FlowNodeProvider initialState={PARALLEL_STEP_INITIAL_STATE}>
                    <BranchParallelPaths
                        steps={flowData?.steps}
                        metaData={metaData}
                        saveStepNode={saveStepNode}
                        onDeleteStepClick={onDeleteStepClick}
                        stepId={activeStepId}
                        updateFlowStateChange={updateFlowStateChange}
                        stepType={selectedStepType}
                        getStepNodeDetails={getStepNodeDetails}
                        isLoadingNodeDetails={isLoadingNodeDetails}
                        isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                        addNewNode={addNewNode}
                        saveConnectorLines={saveConnectorLines}
                    />
                </FlowNodeProvider>
            );
            break;
        case STEP_TYPE.ML_MODELS:
            configModal = (
                <FlowNodeProvider initialState={CALL_INTEGRATION_INITIAL_STATE}>
                    <CallIntegration
                        flowData={flowData}
                        onDeleteStepClick={onDeleteStepClick}
                        stepId={activeStepId}
                        metaData={metaData}
                        updateFlowStateChange={updateFlowStateChange}
                        saveStepNode={saveStepNode}
                        steps={flowData?.steps}
                        getStepNodeDetails={getStepNodeDetails}
                        isLoadingNodeDetails={isLoadingNodeDetails}
                        isErrorInLoadingNodeDetails={isErrorInLoadingNodeDetails}
                        isMLIntegration
                        allSystemFields={allSystemFields}
                    />
                </FlowNodeProvider>
            );
            break;
        default: break;
    }
    return (

        <div className={cx(className)}>
            {configModal}
        </div>
    );
}

export default NodeConfiguration;
