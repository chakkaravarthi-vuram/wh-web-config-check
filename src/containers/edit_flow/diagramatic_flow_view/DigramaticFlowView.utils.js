import { NodeHandlerPosition } from '@workhall-pvt-lmt/wh-ui-library';
import dagre from 'dagre';
import { updateLinks, deleteConnectorLineApiThunk } from 'redux/actions/EditFlow.Action';
import { updateFlowDataChange } from 'redux/reducer/EditFlowReducer';
import { store } from 'Store';
import { STEP_TYPE } from 'utils/Constants';
import jsUtility, { cloneDeep, isEmpty, set } from 'utils/jsUtility';
import { saveConnectorLine } from '../../../redux/actions/EditFlow.Action';
import { ACTION_TYPE } from '../../../utils/constants/action.constant';
import { translateFunction } from '../../../utils/jsUtility';
import { FLOW_STRINGS } from '../EditFlow.strings';
import { updateLoaderStatus } from '../node_configuration/NodeConfiguration.utils';
import { CALL_INTEGRATION_CONSTANTS } from '../step_configuration/node_configurations/call_integration/CallIntegration.constants';
import { TERMINATE_FLOW_TYPE } from '../step_configuration/node_configurations/end_step/EndStepConfig.constants';
import {
    EDGES_OPTIONS,
    CUSTOM_NODE_LABELS,
    DEFAULT_NODE_OPTIONS,
    CUSTOM_NODE_DIMENSION,
    BUTTON_EDGE_OPTIONS,
    EDGE_STYLES,
    CONNECTOR_LINE_TYPE,
} from './flow_component/FlowComponent.constants';

export const changeEdgeStyle = async (edgeType, connectorLineUuid, { connected_steps: connectedSteps, step_uuid: stepUuid, flow_id: flowId }) => {
    const connectedStepIndex = connectedSteps.findIndex((connectedStep) => (connectedStep.connector_line_uuid === connectorLineUuid));
    set(connectedSteps, [connectedStepIndex, 'style'], edgeType);
    const updatedConnectedSteps = [];
    connectedSteps.forEach((link) => {
        delete link?.source_step;
        updatedConnectedSteps.push({
            ...link,
        });
    });
    updateLoaderStatus(true);
    try {
        await store.dispatch(saveConnectorLine({
            flow_id: flowId,
            source_step: stepUuid,
            connector_lines: updatedConnectedSteps,
        }));
        updateLoaderStatus(false);
    } catch (e) {
        updateLoaderStatus(false);
    }
};

const getAdditionalPropForNode = (step) => {
    const data = {};
    data.isSpecialConnection = step?.connected_steps?.some((link) => link.source_point === NodeHandlerPosition.SPECIAL);
    data.isBottomConnection = step?.connected_steps?.some((link) => link.source_point === NodeHandlerPosition.BOTTOM);
    switch (step.step_type) {
        case STEP_TYPE.START_STEP:
            if (step.has_auto_trigger) {
                data.statusText = 'Scheduled';
            }
            break;
        case STEP_TYPE.END_FLOW:
            if (step.terminate_flow) {
                if (step.terminate_type === TERMINATE_FLOW_TYPE.CANCEL) {
                    data.statusText = 'Cancel';
                } else if (step.terminate_type === TERMINATE_FLOW_TYPE.COMPLETE) {
                    data.statusText = 'End';
                }
            }
            break;
        case STEP_TYPE.USER_STEP:
            const cancelButton = step?.actions?.find((action) => action.action_type === ACTION_TYPE.CANCEL);
            if (!isEmpty(cancelButton)) {
                data.failureText = cancelButton.action_name;
            }
            break;
        case STEP_TYPE.INTEGRATION:
        case STEP_TYPE.ML_MODELS:
            if (step.error_actions === CALL_INTEGRATION_CONSTANTS.ERROR_ACTION_SPLIT) {
                data.failureText = 'Failure';
            }
            break;
        default:
            break;
    }
    return data;
};

export const getNodesAndEdgesData = ({
    stepsList = [],
    handleNodeClick,
    handleStepNameChange,
    toggleFlowNodeDropdown,
    error_list = {},
    updateFlowStateChange,
    serverError = [],
    onDeleteStepClick,
    stepsWithoutLinks,
    stepsWithUnusedLinks,
    handleEditClick,
    setActiveNode,
    selectedNodeFromDiagram,
    activeStepNameEditId,
    toggleNodeNameEdit,
    addNewNode,
    flowDropdownData,
    flowId,
    userConfigNode,
}) => {
    const nodes = [];
    const edges = [];
    stepsList.forEach((step, stepIndex) => {
        const step_coordinates = jsUtility.get(step, ['coordinate_info', 'step_coordinates'], { x: 0, y: 0 });
        // const actions = jsUtility.get(step, ['actions'], []);
        const labelError = error_list[`step_name-${stepIndex}`];
        const errorKeys = Object.keys(error_list);
        const configErrors = errorKeys.find((key) => key.includes(`steps.${stepIndex}`));
        const stepErrorList = [];
        if (!jsUtility.isEmpty(stepsWithoutLinks)) {
            if (stepsWithoutLinks.includes(step.step_uuid)) {
                stepErrorList.push(FLOW_STRINGS.SERVER_RESPONSE.BROKEN_FLOW_ERROR);
            }
        }
        if (!jsUtility.isEmpty(stepsWithUnusedLinks)) {
            if (stepsWithUnusedLinks.includes(step.step_uuid)) {
                stepErrorList.push(FLOW_STRINGS.SERVER_RESPONSE.UNUSED_CONNECTED_STEPS);
            }
        }
        if (!jsUtility.isEmpty(serverError)) {
            const serverErrorIndex = serverError.findIndex((err) => (err.id === step._id));
            if (serverErrorIndex > -1) {
                if (jsUtility.has(serverError, [serverErrorIndex, 'errors'])) stepErrorList.push(...jsUtility.get(serverError, [serverErrorIndex, 'errors'], []));
            }
        }
        if (labelError) stepErrorList.push(labelError);
        nodes.push({
            id: step.step_uuid,
            type: CUSTOM_NODE_LABELS[step.step_type],
            ...DEFAULT_NODE_OPTIONS,
            ...CUSTOM_NODE_DIMENSION[step.step_type],
            position: step_coordinates,
            style: (flowDropdownData?.nodeId === step.step_uuid ? { zIndex: 1000 } : {}),
            data: {
                flowDropdownData,
                stepId: step._id,
                stepType: step.step_type,
                label: step.step_name,
                onClickIcon: handleNodeClick,
                handleEditClick,
                stepIndex,
                onChange: handleStepNameChange,
                onDeleteStepClick: onDeleteStepClick,
                nodeErrors: labelError || configErrors || stepErrorList,
                toggleFlowNodeDropdown,
                connectedSteps: step.connected_steps || [],
                updateFlowStateChange,
                hasSource: false,
                flow_id: flowId,
                activeStepNameEditId,
                tempStepName: step.tempStepName,
                ...getAdditionalPropForNode(step),
                setActiveNode,
                selectedNodeFromDiagram,
                toggleNodeNameEdit,
                activeStepNameError: error_list?.activeStepNameError,
                addNewNode,
            },
        });
        if (!isEmpty(userConfigNode)) {
           nodes.push({
               ...userConfigNode,
           });
        }
        if ((step.connected_steps || []).length) {
            step.connected_steps.forEach((link) => {
                const edgeId = `edge-${step.step_uuid}-to-${link.destination_step}`;
                let edgeLabel = null;
                if (step.step_type === STEP_TYPE.USER_STEP) {
                    let labelArray = [];
                    step.actions.forEach((action) => {
                        if ((action.next_step_uuid || []).includes(link.destination_step)) labelArray.push(action.action_name);
                        if ((action?.context_data?.steps || []).includes(link.destination_step)) labelArray.push(action.action_name);
                    });
                    labelArray = jsUtility.removeDuplicates(labelArray);
                    edgeLabel = labelArray.join('/');
                }
                const strokeColor = link.type === CONNECTOR_LINE_TYPE.EXCEPTION ? '#D92D20' : '#D8DEE9';
                edges.push({
                    id: edgeId,
                    ...BUTTON_EDGE_OPTIONS,
                    style: {
                        ...BUTTON_EDGE_OPTIONS.style,
                        stroke: strokeColor,
                    },
                    markerEnd: {
                        ...BUTTON_EDGE_OPTIONS.markerEnd,
                        color: strokeColor,
                    },
                    label: edgeLabel || link.label,
                    source: step.step_uuid,
                    target: link.destination_step,
                    sourceHandle: `${link?.source_point}#&#${step.step_uuid}`,
                    targetHandle: `${link?.destination_point}#&#${link.destination_step}`,
                    data: {
                        edgeStyle: link.style || EDGE_STYLES.STEP,
                        type: link.type,
                        onEdgeStyleChanged: changeEdgeStyle,
                        connectorLineUuid: link.connector_line_uuid,
                        stepData: {
                            ...cloneDeep(step),
                            flow_id: flowId,
                        },
                    },
                });
            });
        }
    });
    console.log(nodes, edges, 'nodes and edges in flow component');
    return { edges, nodes };
};

export const handleNodeChanges = (changes, nodes, flowDataCopy) => {
    const flowData = jsUtility.cloneDeep(flowDataCopy);
    (changes || []).forEach((updatedNode) => {
        const { id, position } = updatedNode;
        if (!jsUtility.isEmpty(position)) {
            const stepIndex = flowData.steps.findIndex((step) => (step.step_uuid === id));
            if (stepIndex > -1) {
                const coordinate_info = jsUtility.get(flowData, ['steps', stepIndex, 'coodinate_info'], { step_coordinates: {} });
                coordinate_info.step_coordinates = position;
                flowData.steps[stepIndex].coordinate_info = coordinate_info;
            }
        }
    });
    return flowData;
};

export const postStepCoordinateChanges = (updatedNode, flowDataCopy, saveStepCoordinates) => {
    const flowData = jsUtility.cloneDeep(flowDataCopy);
    const coordinate_data = [];
    const { data, position } = updatedNode;
    if (!jsUtility.isEmpty(position)) {
        coordinate_data.push({
            step_id: data.stepId, // need to add step uuid coordinate
            coordinate_info: {
                step_coordinates: position,
            },
        });
        const postData = {
            flow_id: flowData.flow_id,
            flow_uuid: flowData.flow_uuid,
            coordinate_data,
        };
        saveStepCoordinates(postData);
    }

    console.log(coordinate_data, flowData, 'coordinate_data coordinate_data on node drag stop');

    return flowData;
};

const getLayoutedElements = (nodes, edges, direction = 'TB', idKey = 'step_id') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => { return {}; });
    const isHorizontal = direction === 'LR';
    const coordianteData = [];
    dagreGraph.setGraph({ rankdir: direction });
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: node.width, height: node.height });
    });
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });
    dagre.layout(dagreGraph);
    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? 'left' : 'top';
        node.sourcePosition = isHorizontal ? 'right' : 'bottom';
        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - node.width / 2,
            y: nodeWithPosition.y - node.height / 2,
        };
        coordianteData.push({
            [idKey]: node?.data?.stepId,
            coordinate_info: {
                step_coordinates: node.position,
            },
        });
        return node;
    });
    return coordianteData;
};

export const getStepCoordinates = ({ steps = [] }) => {
    const nodes = [];
    const edges = [];
    steps.forEach((step) => {
        const step_coordinates = jsUtility.get(step, ['coordinate_info', 'step_coordinates'], { x: 0, y: 0 });
        const actions = jsUtility.get(step, ['actions'], []);
        nodes.push({
            id: step.step_uuid,
            type: CUSTOM_NODE_LABELS[step.step_type],
            ...DEFAULT_NODE_OPTIONS,
            ...CUSTOM_NODE_DIMENSION[step.step_type],
            position: step_coordinates,
            data: {
                stepId: step._id,
            },
        });
        if ((step.connected_steps || []).length) {
            step.connected_steps.forEach((link) => {
                const edgeId = `edge-${step.step_uuid}-to-${link.step_uuid}`;
                let labelArray = [];
                actions.forEach((action) => {
                    if ((action.next_step_uuid || []).includes(link.step_uuid)) labelArray.push(action.action_name);
                    if ((action.context_data?.steps || []).includes(link.step_uuid)) labelArray.push(action.action_name);
                });
                labelArray = jsUtility.removeDuplicates(labelArray);
                edges.push({
                    id: edgeId,
                    ...EDGES_OPTIONS,
                    label: link?.label,
                    source: step.step_uuid,
                    target: link.destination_step,
                    sourceHandle: `${link?.source_point}#&#${step.step_uuid}`,
                    targetHandle: `${link?.destination_point}#&#${step.step_uuid}`,
                    data: {
                        edgeStyle: link.style || EDGE_STYLES.STEP,
                        type: link.type,
                    },
                });
            });
        }
    });
    console.log(nodes, edges, 'nodes and edges');
    return getLayoutedElements(nodes, edges);
};

export const getStepCoordinatesForNewStep = ({ steps = [] }, newStepData) => {
    steps.push(newStepData);
    console.log('newStepDatanewStepDatanewStepData', newStepData, cloneDeep(steps));
    const updatedCoordinates = getStepCoordinates({ steps });
    const selectedNodeCoordinates = updatedCoordinates.find((data) => data._id === newStepData._id);
    console.log(selectedNodeCoordinates, updatedCoordinates, 'jkhkjfhdkjghfjkdhgjkdfhgjk');
    return selectedNodeCoordinates?.coordinate_info || {};
};

export const deleteConnectedStep = (source, target) => {
    const { flowData } = jsUtility.cloneDeep(store.getState().EditFlowReducer);
    const { steps } = jsUtility.cloneDeep(flowData);
    const stepIndex = steps.findIndex((step) => (step._id === source));
    if (stepIndex > -1) {
        (steps[stepIndex].actions || []).map((action) => {
            if (!action.is_next_step_rule && !jsUtility.isEmpty(action.next_step_uuid)) {
                const actionIndex = action.next_step_uuid.indexOf(target);
                if (actionIndex > -1) action.next_step_uuid.splice(actionIndex, 1);
            }
            return action;
        });
        if (!jsUtility.isEmpty(steps[stepIndex].connected_steps)) {
            const { connected_steps } = jsUtility.cloneDeep(steps[stepIndex]);
            const connectedStepIndex = connected_steps.indexOf(connected_steps.find((step) => step.step_id === target));
            if (connectedStepIndex > -1) connected_steps.splice(connectedStepIndex, 1);
            steps[stepIndex].connected_steps = connected_steps;
        }
        // make delete action API call
        store.dispatch(updateLinks(
            steps[stepIndex], flowData, stepIndex, steps[stepIndex].actions,
        ));
    }
};

export const checkLinkDependency = async (flowId, connectorLineUuid, sourceStepUuid, t = translateFunction) => {
    store.dispatch(deleteConnectorLineApiThunk(
        {
            flow_id: flowId,
            connector_line_uuid: connectorLineUuid,
        },
        sourceStepUuid,
        t,
    ));
};

export const closeLinkDependencyPopup = () => {
    store.dispatch(updateFlowDataChange(
        {
            showLinkDependencyDialog: false,
            deleteIconRef: null,
        },
    ));
};

export const closeFlowDependencyPopup = () => {
    store.dispatch(updateFlowDataChange(
        {
            showFlowDependencyDialog: false,
        },
    ));
};

export const onDeleteStepLink = (source, target) => {
    closeLinkDependencyPopup();
    deleteConnectedStep(source, target);
};
