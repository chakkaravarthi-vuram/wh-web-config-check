import React from 'react';
import cx from 'classnames/bind';
import { Text, ToggleButton, EButtonIconPosition, Label } from '@workhall-pvt-lmt/wh-ui-library';
import gClasses from '../../../../../../scss/Typography.module.scss';
import ConditionalSplit from './ConditionalSplit';
import StepSelection from './StepSelection';
import { cloneDeep, get, set } from '../../../../../../utils/jsUtility';
import { CONDITION_ROUTER_RESPONSE_KEYS } from '../BranchParallelPaths.constants';
import FlowNodeDropDown from '../../../../diagramatic_flow_view/flow_component/flow_node_dropdown/FlowNodeDropDown';
import { STEP_TYPE } from '../../../../../../utils/Constants';
import { dataLossAlertPopover } from '../../../../node_configuration/NodeConfiguration.utils';

function GeneralConfiguration(props) {
    const {
        isConditional,
        configStrings,
        state,
        onDataChangeHandler,
        isParallelStep,
        addNewNode,
        updateFlowStateChange,
        metaData,
    } = props;
    console.log('general');
    const {
        stepsList = [],
        errorList = {},
        addNewNodeDropdown,
    } = state;
    let addNodeDropodownComponent = null;

    const toggleAddNewNodeDropdown = (data = {}) => {
        onDataChangeHandler({
            addNewNodeDropdown: data,
        });
    };

    const updateConditionalData = (clearConditions) => {
        const clonedState = cloneDeep(state);
        if (clearConditions) {
            delete clonedState.condition;
            delete clonedState.defaultSteps;
            clonedState.stepUuids = [];
        } else {
            clonedState.condition = [
                {
                    [CONDITION_ROUTER_RESPONSE_KEYS.STEPS]: [],
                    [CONDITION_ROUTER_RESPONSE_KEYS.RULE_DETAILS]: {},
                },
            ];
            clonedState.defaultSteps = [];
            delete clonedState.stepUuids;
        }
        onDataChangeHandler({
            ...clonedState,
            isConditional: !isConditional,
        });
    };

    const selectBranchPath = (selectedValue) => {
        const clonedErrorList = cloneDeep(errorList);
        if (clonedErrorList?.[CONDITION_ROUTER_RESPONSE_KEYS.STEPS]) {
            delete clonedErrorList[CONDITION_ROUTER_RESPONSE_KEYS.STEPS];
        }
        const addedSteps = cloneDeep(state?.[CONDITION_ROUTER_RESPONSE_KEYS.STEPS]) || [];
        const selectedStepIndex = addedSteps.findIndex((step) => step.value === selectedValue.value);
        if (selectedStepIndex > -1) {
            addedSteps.splice(selectedStepIndex, 1);
        } else {
            addedSteps.push(selectedValue);
        }
        onDataChangeHandler({
            [CONDITION_ROUTER_RESPONSE_KEYS.STEPS]: addedSteps,
            errorList: clonedErrorList,
        });
    };

    const addNewNodeToList = async (postData) => {
        const addNewNodeResponse = await addNewNode(postData);
        const { isSuccess, flowData, response } = addNewNodeResponse;
        if (isSuccess) {
            updateFlowStateChange({ flowData });
            const clonedState = cloneDeep(state);
            const keyNameArray = addNewNodeDropdown?.refId?.split(',') || [];
            const { stepsList = [] } = cloneDeep(clonedState);
            let addedSteps = [];
            if (isParallelStep) {
                addedSteps = get(clonedState, keyNameArray, []) || [];
            }
            const newStepData = {
                id: response.step_uuid,
                label: response?.step_name,
                value: response?.step_uuid,
            };
            stepsList.push(newStepData);
            addedSteps.push(newStepData);
            set(clonedState, keyNameArray, addedSteps);
            clonedState.stepsList = stepsList;
            onDataChangeHandler({ ...clonedState });
        }
        return addNewNodeResponse;
    };

    const switchConditionalSplit = () => {
        if (isConditional) {
            dataLossAlertPopover({ title: configStrings.SWITCH_CONFIRMATION.TITLE, subTitle: configStrings.SWITCH_CONFIRMATION.SUBTITLE, onYesHandlerAdditionalFunc: () => updateConditionalData(true) });
        } else {
            updateConditionalData(false);
        }
    };

    if (addNewNodeDropdown?.refId) {
        addNodeDropodownComponent = (
            <FlowNodeDropDown
                parentId={addNewNodeDropdown?.refId}
                referenceElement={addNewNodeDropdown.ref}
                removeNode={() => toggleAddNewNodeDropdown({})}
                addNewNode={addNewNodeToList}
                linkToParent={false}
                restrictedNodes={isParallelStep ? [STEP_TYPE.JOIN_STEP] : []}
            />
        );
     }

    return (
        <div>
            <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw)}>
                <Text
                    className={cx(gClasses.FontWeight500, gClasses.FTwo16GrayV3)}
                    content={configStrings.TITLE}
                />
                {
                    isParallelStep && (
                        <ToggleButton
                            isActive={isConditional}
                            onChange={switchConditionalSplit}
                            label={configStrings.CONDITIONAL_SPLIT_LABEL}
                            toggleAlign={EButtonIconPosition.RIGHT}
                            labelClassName={cx(gClasses.FTwo13BlackV27, gClasses.FontWeight500, gClasses.MR8)}
                        />
                    )
                }
            </div>
            {
                (isConditional || !isParallelStep) ?
                    (
                        <ConditionalSplit
                            configStrings={configStrings}
                            isParallelStep={isParallelStep}
                            onDataChangeHandler={onDataChangeHandler}
                            state={state}
                            metaData={metaData}
                            toggleAddNewNodeDropdown={toggleAddNewNodeDropdown}
                        />
                    ) :
                    (
                        <>
                            <Label
                                labelName={configStrings.PATH.LABEL}
                                innerLabelClass={cx(gClasses.FTwo13BlackV22, gClasses.FontWeight500, gClasses.MT16)}
                                className={gClasses.MB8}
                            />
                            <StepSelection
                                id={CONDITION_ROUTER_RESPONSE_KEYS.STEPS}
                                stepsList={cloneDeep(stepsList)}
                                configStrings={configStrings}
                                selectedValue={state?.[CONDITION_ROUTER_RESPONSE_KEYS.STEPS]}
                                onSelectValue={selectBranchPath}
                                onRemoveValue={(value) => selectBranchPath({ value })}
                                errorMessage={errorList?.[CONDITION_ROUTER_RESPONSE_KEYS.STEPS]}
                                toggleAddNewNodeDropdown={toggleAddNewNodeDropdown}
                                refId={CONDITION_ROUTER_RESPONSE_KEYS.STEPS}
                            />
                        </>
                    )
            }
            {addNodeDropodownComponent}
        </div>
    );
}

export default GeneralConfiguration;
