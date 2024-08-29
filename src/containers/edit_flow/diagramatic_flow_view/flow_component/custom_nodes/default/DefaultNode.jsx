import React, { useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { NodeHandlerPosition, StepNode } from '@workhall-pvt-lmt/wh-ui-library';
import { useSelector } from 'react-redux';
import { STEP_TYPE } from '../../../../../../utils/Constants';
import { isEmpty } from '../../../../../../utils/jsUtility';
import { ROUTING_NODES } from '../../FlowComponent.constants';
import FlowNodeDropDown from '../../flow_node_dropdown/FlowNodeDropDown';
import { getRestrictedStepTypes } from '../../FlowComponent.utils';
import styles from './DefaultNode.module.scss';
import { EMPTY_STRING } from '../../../../../../utils/strings/CommonStrings';
import {
    getHighlightedSearchText,
    getHighlightedSearchTextWithEllipsis,
} from './DefaultNode.utils';

function DefaultNode({ id, data }) {
    const {
        toggleFlowNodeDropdown,
        stepId,
        // connectedSteps,
        tempStepName,
        handleEditClick,
        stepIndex,
        onChange,
        stepType,
        activeStepNameEditId,
        label,
        failureText,
        statusText,
        setActiveNode,
        selectedNodeFromDiagram,
        activeStepNameError,
        flowDropdownData = {},
        addNewNode,
        isSpecialConnection,
        // isBottomConnection,
        nodeErrors,
    } = data;

    const {
        searchStepValue = EMPTY_STRING,
        searchResults = {},
    } = useSelector((state) => state.EditFlowReducer);

    const isActive = selectedNodeFromDiagram === stepId;
    console.log('stepDataDefaultNode', data, 'stepType', stepType, 'isActive', isActive, 'id', id, 'searchStepValue', searchStepValue, 'searchResults', searchResults);
    const displayDropdownNode = (sourcePosition, ref) => {
        toggleFlowNodeDropdown({
            sourcePosition,
            ref,
            nodeId: id,
        });
    };

    const updateNodeInternals = useUpdateNodeInternals();

    useEffect(() => {
        updateNodeInternals(id);
    }, [updateNodeInternals, id, selectedNodeFromDiagram, failureText]);

    let addonComponent = null;
    if (isActive && flowDropdownData?.nodeId === id) {
        addonComponent = (
            <FlowNodeDropDown
                parentId={flowDropdownData?.nodeId}
                referenceElement={flowDropdownData?.ref}
                removeNode={() => toggleFlowNodeDropdown({})}
                addNewNode={addNewNode}
                sourcePosition={flowDropdownData.sourcePosition}
                restrictedNodes={getRestrictedStepTypes(stepType)}
            />
        );
    }

    const getErrorDisplay = () => {
        if (isEmpty(nodeErrors)) return null;
        return (
            <ul className={styles.ErrorList}>
                {nodeErrors?.map((eachError) => (
                    <li>{eachError}</li>
                ))}
            </ul>
        );
    };

    const onChangeHandler = (event) => {
        onChange(event, stepIndex);
    };

    const onBlurHandler = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            onChange(event, stepIndex, true);
        }
    };

    const onStepNodeClick = () => {
        if (!isActive) {
            setActiveNode({ stepId });
        } else if (ROUTING_NODES.includes(stepType)) {
            handleEditClick({ type: stepType, stepId, stepIndex });
        }
    };

    let bottomHandleStyles = {};
    let specialHandleStyles = { bottom: isActive ? '5px' : '-25px', zIndex: 10 };
    if (stepType === STEP_TYPE.CONDITON_PATH_SELECTOR) {
        bottomHandleStyles = { bottom: isActive ? '-17px' : '13px' };
    } else if (ROUTING_NODES.includes(stepType)) {
        bottomHandleStyles = { bottom: isActive ? '-2px' : '23px' };
    } else if ([STEP_TYPE.START_STEP].includes(stepType)) {
        bottomHandleStyles = { bottom: isActive ? '32px' : '-5px', zIndex: 10 };
    } else {
        bottomHandleStyles = { bottom: isActive ? '32px' : '-5px', zIndex: 10 };
    }

    const isNodeNameEditable = activeStepNameEditId === stepId;
    const allowOtherHandlers = isNodeNameEditable || isEmpty(activeStepNameEditId);
    const showSpecialHandle = [STEP_TYPE.INTEGRATION, STEP_TYPE.ML_MODELS].includes(stepType) && !isEmpty(failureText);
    const stepTitle = isNodeNameEditable ? tempStepName : label;

    const getStepName = (string) => getHighlightedSearchTextWithEllipsis(string, searchStepValue, searchResults, id, stepType);

    if (isEmpty(failureText)) {
        specialHandleStyles = { bottom: isActive ? '32px' : '-5px', zIndex: 10 };
    }

    return (
        <>
            <div id={`node-step-${id}`} className={isNodeNameEditable ? 'nodrag' : ''}>
                <StepNode
                    id={id}
                    title={getStepName(stepTitle)}
                    stepNameTooltip={getHighlightedSearchText(stepTitle, searchStepValue, searchResults, id)}
                    onStepNameChange={onChangeHandler}
                    onStepNameBlur={onBlurHandler}
                    onSettingsClick={() => allowOtherHandlers && handleEditClick({ type: stepType, stepId, stepIndex })}
                    failureText={failureText}
                    statusText={statusText}
                    onStepNodeClick={onStepNodeClick}
                    isEditable={isNodeNameEditable}
                    // isBottomConnection={isBottomConnection}
                    isSpecialConnection={isSpecialConnection}
                    showSpecialHandle={showSpecialHandle}
                    stepNameError={isActive && activeStepNameError}
                    isActive={isActive}
                    type={stepType}
                    addButtonHandler={displayDropdownNode}
                    errorMessage={getErrorDisplay()}
                    hasError={!isEmpty(nodeErrors)}
                />
                {addonComponent}
            </div>
            {
                (stepType !== STEP_TYPE.START_STEP) && (
                    <Handle
                        type="target"
                        position={Position.Top}
                        id={`${NodeHandlerPosition.TOP}#&#${id}`}
                        style={(stepType === STEP_TYPE.CONDITON_PATH_SELECTOR) ? { top: '-14.5%' } : {}}
                    />
                )
            }
            {
                (stepType !== STEP_TYPE.END_FLOW) && (
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id={`${NodeHandlerPosition.BOTTOM}#&#${id}`}
                        style={bottomHandleStyles}
                    />
                )
            }
            {
                (showSpecialHandle || isSpecialConnection) &&
                (
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id={`${NodeHandlerPosition.SPECIAL}#&#${id}`}
                        className="react-flow__custom-special-with-text"
                        style={specialHandleStyles}
                    />
                )
            }
        </>
    );
}

export default DefaultNode;
