import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { linkSelectedStep, getAllStepsListThunk } from 'redux/actions/EditFlow.Action';
import { updateFlowDataChange, updateFlowStateChange } from 'redux/reducer/EditFlowReducer';
import { cloneDeep, get, isEmpty, set, unset } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { validate } from 'utils/UtilityFunctions';
import { listDependencyApiThunk } from 'redux/actions/Form.Action';
import { NodeHandlerPosition } from '@workhall-pvt-lmt/wh-ui-library';
import { addNewStepValidateSchema } from '../step_configuration/StepConfiguration.validations';
import {
    getNodesAndEdgesData,
    handleNodeChanges,
    postStepCoordinateChanges,
} from './DigramaticFlowView.utils';
import FlowComponent from './flow_component/FlowComponent';
import { CONNECTOR_LINE_INIT_DATA, CONNECTOR_LINE_TYPE, CUSTOM_COMPONENTS_ID, CUSTOM_NODE_LABELS, MULTI_OUTPUT_NODES } from './flow_component/FlowComponent.constants';
import { generateEventTargetObject } from '../../../utils/generatorUtils';
import {
    saveStepAPIThunk,
    saveStepCoordinatesThunk,
} from '../../../redux/actions/FlowStepConfiguration.Action';
import ConditionalConfiguration from './flow_component/conditional_configuration/ConditionalConfiguration';
import { ConditionalConfigProvider } from './flow_component/conditional_configuration/useConditionalConfiguration';
import { saveConnectorLine } from '../../../redux/actions/EditFlow.Action';
import { updateLoaderStatus } from '../manage_flow_fields/ManageFlowFields.utils';
import { STEP_TYPE } from '../../../utils/Constants';
import { getRestrictedStepTypes } from './flow_component/FlowComponent.utils';
import { displayErrorToast } from '../../../utils/flowErrorUtils';
import { FLOW_STRINGS, STEP_LABELS } from '../EditFlow.strings';

function DigramaticFlowView(props) {
    const { t } = useTranslation();
    const { isConditionConfigurationModalOpen, flowData,
        flowData: { steps, error_list, stepsList },
        onStepClick, activeStepId,
        searchStepValue,
        searchResults,
        resetFocusInFlowComponent, isTrialDisplayed,
        saveStepAPI,
        addNewNode, selectedNodeFromDiagram, activeStepNameEditId,
        metaData: { flowId } } = props;
    const [flowDropdownData, setFlowNodeDropdownData] = useState({});
    const [userConfigNode, setUserConfigNode] = useState({});

    console.log('DigramaticFlowViewDigramaticFlowView', cloneDeep(flowData));

    const handleStepNameChange = async (event, stepIndex, isOnBlur, openStepProgressView = false) => {
        const { updateFlowData } = props;
        const { value } = event.target;
        const clonedFlowData = cloneDeep(flowData);
        clonedFlowData.steps[stepIndex].tempStepName = value;
        if (isOnBlur || error_list[`stepName-${stepIndex}`]) {
            const errors = validate(
                { stepName: (value || EMPTY_STRING).trim() },
                addNewStepValidateSchema(stepIndex, t),
            ) || {};
            if (isEmpty(errors)) {
                unset(clonedFlowData, ['error_list', 'activeStepNameError']);
                if (isOnBlur) { // on out focus, if there is no error in step name, save step
                    await updateFlowData(clonedFlowData);
                    const details = clonedFlowData.steps[stepIndex];
                    const { _id, step_uuid, step_order, step_type, connected_steps = [] } = details;
                    const postData = {
                        flow_id: flowData.flow_id,
                        step_name: value.trim(),
                        _id,
                        step_uuid,
                        step_order,
                        step_type,
                        connected_steps,
                    };
                    try {
                        saveStepAPI({ postData, nextTabIndex: 0, label: value })
                            .then(() => {
                                if (openStepProgressView) {
                                    onStepClick(stepIndex);
                                }
                            });
                    } catch (e) {
                        console.log(e);
                    }
                }
            } else set(clonedFlowData, ['error_list', 'activeStepNameError'], errors.stepName);
        }
        return updateFlowData(clonedFlowData);
    };

    const handleEditClick = ({ type, stepId }) => {
        const { updateFlowStateChange } = props;
        // onStepClick(stepIndex);
        updateFlowStateChange({
            selectedStepType: type,
            // selectedStepUuid: stepUuid,
            activeStepId: stepId,
            isNodeConfigOpen: true,
        });
    };

    const setActiveNode = ({ stepId }) => {
        const { updateFlowStateChange } = props;
        if (selectedNodeFromDiagram !== stepId) {
            updateFlowStateChange({
                selectedNodeFromDiagram: stepId,
            });
            setFlowNodeDropdownData({});
        } else {
            updateFlowStateChange({
                selectedNodeFromDiagram: stepId,
            });
        }
    };

    const handleNodeClick = ({ type, stepIndex, label }) => {
        const { updateFlowStateChange } = props;
        if (type === CUSTOM_NODE_LABELS.USER_STEP) {
            onStepClick(stepIndex);
        } else if (type === CUSTOM_NODE_LABELS.NEW_STEP) {
            handleStepNameChange(generateEventTargetObject('new_step', label), stepIndex, true, 0, true);
        } else if (type === CUSTOM_NODE_LABELS.START_NODE_SETTINGS) {
            updateFlowStateChange({
                isShowStartNodeModal: true,
            });
        }
    };

    const { updateFlowStateChange, detailedFlowErrorInfo, stepsWithoutLinks, stepsWithUnusedLinks } = props;

    const toggleNodeNameEdit = (nodeId, isEdit = true) => {
        const { updateFlowStateChange } = props;
        const clonedFlowData = cloneDeep(flowData);
        const stepIndex = steps.findIndex((step) => step._id === nodeId);
        if (stepIndex > -1) {
            clonedFlowData.steps[stepIndex].tempStepName = steps[stepIndex].step_name;
        }
        updateFlowStateChange({ flowData: clonedFlowData, activeStepNameEditId: isEdit ? nodeId : null });
    };

    const { nodes, edges } = getNodesAndEdgesData({
        stepsList: steps,
        handleEditClick,
        handleNodeClick,
        toggleFlowNodeDropdown: setFlowNodeDropdownData,
        handleStepNameChange,
        error_list,
        updateFlowStateChange,
        serverError: detailedFlowErrorInfo,
        stepsWithoutLinks,
        stepsWithUnusedLinks,
        setActiveNode,
        selectedNodeFromDiagram,
        activeStepNameEditId,
        toggleNodeNameEdit,
        addNewNode,
        flowDropdownData,
        flowId,
        userConfigNode,
    });

    const updateFlowComponentState = (changes) => {
        const firstChange = get(changes, [0], {});
        if (firstChange.id !== CUSTOM_COMPONENTS_ID.DROPDOWN && firstChange.type === 'position') {
            const { updateFlowData } = props;
            const updatedFlowData = handleNodeChanges(changes, nodes, flowData);
            updateFlowData(updatedFlowData);
        }
    };

    const postCoordinatesData = (e, updatedNode) => {
        const { saveStepCoordinates } = props;
        postStepCoordinateChanges(updatedNode, flowData, saveStepCoordinates);
    };

    const toggleFocusInFlowComponent = () => {
        updateFlowStateChange({ resetFocusInFlowComponent: false, activeStepId: null });
    };

    const onConnectEdges = async (params) => {
        const clonedFlowData = cloneDeep(flowData);
        const sourceHandlePosition = params.sourceHandle?.split('#&#')?.[0] || NodeHandlerPosition.BOTTOM;
        const sourceStep = clonedFlowData.steps.find((step) => step.step_uuid === params.source);
        const destinationStep = clonedFlowData.steps.find((step) => step.step_uuid === params.target);
        if (!getRestrictedStepTypes(sourceStep.step_type)?.includes(destinationStep.step_type)) {
            const isDuplicateEntry = (sourceStep?.connected_steps || []).some((connectedStep) => (
                (connectedStep.destination_step === params.target)
            ));
            let connectedSteps = sourceStep?.connected_steps || [];
            if (isDuplicateEntry) {
                if ([STEP_TYPE.INTEGRATION, STEP_TYPE.ML_MODELS].includes(sourceStep.step_type)) {
                    const existingConnectedStep = (sourceStep?.connected_steps || []).find((connectedStep) => (
                        (connectedStep.destination_step === params.target)
                    ));
                    if (existingConnectedStep?.source_point !== sourceHandlePosition) {
                        displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.CONNECTOR_LINE_SAME_FLOW);
                    }
                }
            } else {
                const addonData = {
                    source_step: params.source,
                    destination_step: params.target,
                    source_point: sourceHandlePosition,
                    type: (sourceHandlePosition === NodeHandlerPosition.SPECIAL)
                        ? CONNECTOR_LINE_TYPE.EXCEPTION
                        : CONNECTOR_LINE_TYPE.NORMAL,
                };
                if (sourceHandlePosition === NodeHandlerPosition.SPECIAL || (
                    [STEP_TYPE.INTEGRATION].includes(sourceStep.step_type)
                )) {
                    const existingConnectedStepIndex = connectedSteps?.findIndex((connectedStep) => (
                        connectedStep.source_point === sourceHandlePosition
                    ));
                    if (existingConnectedStepIndex > -1) {
                        set(connectedSteps, [existingConnectedStepIndex, 'destination_step'], params.target);
                    } else {
                        connectedSteps.push({
                            ...CONNECTOR_LINE_INIT_DATA,
                            ...addonData,
                        });
                    }
                } else if (MULTI_OUTPUT_NODES.includes(sourceStep.step_type)) {
                    connectedSteps.push({
                        ...CONNECTOR_LINE_INIT_DATA,
                        ...addonData,
                    });
                } else {
                    connectedSteps = [{
                        ...connectedSteps?.[0] || CONNECTOR_LINE_INIT_DATA,
                        ...addonData,
                    }];
                }
                const updatedConnectedSteps = [];
                connectedSteps.forEach((link) => {
                    delete link?.source_step;
                    updatedConnectedSteps.push({
                        ...link,
                    });
                });
                const { saveConnectorLine } = props;
                try {
                    updateLoaderStatus(true);
                    await saveConnectorLine({
                        flow_id: flowData.flow_id,
                        source_step: params.source,
                        connector_lines: updatedConnectedSteps,
                    });
                    updateLoaderStatus(false);
                } catch (e) {
                    console.log('Connector line error', e);
                    displayErrorToast(FLOW_STRINGS.SERVER_RESPONSE.CONNECTOR_LINE_API_ERROR);
                    updateLoaderStatus(false);
                }
            }
        } else {
            const sourceStepType = t(STEP_LABELS[sourceStep.step_type]);
            const destinationStepType = t(STEP_LABELS[destinationStep.step_type]);
            const title = `${FLOW_STRINGS.SERVER_RESPONSE.CONNECTOR_LINE_TYPE_ERROR.title} ${sourceStepType} ${FLOW_STRINGS.SERVER_RESPONSE.CONNECTOR_LINE_TYPE_ERROR.subtitle} ${destinationStepType}`;
            displayErrorToast({ title });
        }
    };

    return (
        <>
            {
                isConditionConfigurationModalOpen && (
                    <ConditionalConfigProvider>
                        <ConditionalConfiguration />
                    </ConditionalConfigProvider>
                )
            }
            <FlowComponent
                data={{ nodes, edges }}
                stepsList={stepsList}
                updateFlowComponentState={updateFlowComponentState}
                postCoordinatesData={postCoordinatesData}
                activeStepId={activeStepId}
                searchStepValue={searchStepValue}
                searchResults={searchResults}
                updateFlowStateChange={updateFlowStateChange}
                toggleFocus={toggleFocusInFlowComponent}
                resetFocus={resetFocusInFlowComponent}
                isTrialDisplayed={isTrialDisplayed}
                addNewNode={addNewNode}
                flowDropdownData={flowDropdownData}
                onConnectEdges={onConnectEdges}
                removeFlowNodeDropdown={setActiveNode}
                setUserConfigNode={setUserConfigNode}
            />
        </>
    );
}

const mapStateToProps = ({ EditFlowReducer, NavBarReducer }) => {
    return {
        flowData: EditFlowReducer.flowData,
        selectedNodeFromDiagram: EditFlowReducer.selectedNodeFromDiagram,
        activeStepNameEditId: EditFlowReducer.activeStepNameEditId,
        stepsList: EditFlowReducer.flowData.steps_list,
        isConditionConfigurationModalOpen: EditFlowReducer.isConditionConfigurationModalOpen,
        detailedFlowErrorInfo: EditFlowReducer.detailedFlowErrorInfo,
        activeStepId: EditFlowReducer.activeStepId,
        searchStepValue: EditFlowReducer.searchStepValue,
        searchResults: EditFlowReducer.searchResults,
        resetFocusInFlowComponent: EditFlowReducer.resetFocusInFlowComponent,
        isTrialDisplayed: NavBarReducer.isTrialDisplayed,
        stepsWithoutLinks: EditFlowReducer.stepsWithoutLinks,
        stepsWithUnusedLinks: EditFlowReducer.stepsWithUnusedLinks,
    };
};

const mapDispatchToProps = {
    updateFlowData: updateFlowDataChange,
    saveStepAPI: saveStepAPIThunk,
    updateFlowStateChange,
    linkSelectedStep,
    getAllStepsListApi: getAllStepsListThunk,
    saveStepCoordinates: saveStepCoordinatesThunk,
    listDependencyApiCall: listDependencyApiThunk,
    saveConnectorLine: saveConnectorLine,
};

const MemorizedDiagramaticFlowView = React.memo(DigramaticFlowView);
export default connect(mapStateToProps, mapDispatchToProps)(MemorizedDiagramaticFlowView);
