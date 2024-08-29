import React from 'react';
import { Text, ETextSize } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import styles from '../BranchParallelPaths.module.scss';
import gClasses from '../../../../../../scss/Typography.module.scss';
import Plus from '../../../../../../assets/icons/configuration_rule_builder/Plus';
import StepSelection from './StepSelection';
import { cloneDeep, isEmpty } from '../../../../../../utils/jsUtility';
import { CONDITION_ROUTER_REQUEST_KEYS, CONDITION_ROUTER_RESPONSE_KEYS } from '../BranchParallelPaths.constants';
import SingleStepSelection from './SingleStepSelection';
import EachCondition from './EachCondition';

function ConditionalSplit(props) {
    const {
        configStrings,
        isParallelStep,
        onDataChangeHandler,
        state,
        toggleAddNewNodeDropdown,
        metaData: { flowId },
    } = props;

    const { stepsList, stepUuid, condition = [], errorList } = state;

    const getAllSelectedConditionRules = () => {
        const selectedConditionalRules = [];
        condition?.forEach((rule) => {
            if (!isEmpty(rule?.ruleDetails?.ruleUUID)) {
                selectedConditionalRules.push(rule?.ruleDetails?.ruleUUID);
            }
        });
        return selectedConditionalRules;
    };

    const {
        RULE_DETAILS,
        STEPS,
        DEFAULT_STEPS,
        RULE_NAME,
        RULE_UUID,
        CONDITION,
    } = CONDITION_ROUTER_RESPONSE_KEYS;

    const onSaveRule = (ruleData, index) => {
        const clonedConditions = cloneDeep(condition);
        const clonedErrorList = cloneDeep(errorList);
        if (clonedErrorList?.[`${CONDITION},${index},${RULE_DETAILS}`]) {
            delete clonedErrorList[`${CONDITION},${index},${RULE_DETAILS}`];
        }
        if (clonedConditions[index]) {
            clonedConditions[index][RULE_DETAILS] = {
                [RULE_NAME]: ruleData?.[CONDITION_ROUTER_REQUEST_KEYS.RULE_NAME],
                [RULE_UUID]: ruleData?.[CONDITION_ROUTER_REQUEST_KEYS.RULE_UUID],
            };
        }
        console.log('dsgfjhsdgfjdgs', ruleData, index, condition, clonedConditions, 'dskfjs');

        onDataChangeHandler({
            condition: clonedConditions,
            errorList: clonedErrorList,
            isSaveClicked: true,
        });
    };

    const onRemoveRule = (index) => {
        const clonedConditions = cloneDeep(condition);
        const clonedErrorList = cloneDeep(errorList);
        if (clonedErrorList?.[`${CONDITION},${index},${RULE_DETAILS}`]) {
            delete clonedErrorList[`${CONDITION},${index},${RULE_DETAILS}`];
        }
        if (clonedConditions[index]) {
            clonedConditions[index][RULE_DETAILS] = {};
        }
        onDataChangeHandler({
            condition: clonedConditions,
            errorList: clonedErrorList,
        });
    };

    const onStepSelect = (selectedValue, index) => {
        const clonedConditions = cloneDeep(condition);
        const clonedErrorList = cloneDeep(errorList);
        if (clonedErrorList?.[`condition,${index},stepUuids`]) {
            delete clonedErrorList[`condition,${index},stepUuids`];
        }
        if (clonedConditions?.[index]) {
            let addedSteps = clonedConditions[index][STEPS] || [];
            if (isParallelStep) {
                const selectedStepIndex = addedSteps.findIndex((step) => step.value === selectedValue.value);
                if (selectedStepIndex > -1) {
                    addedSteps.splice(selectedStepIndex, 1);
                } else {
                    addedSteps.push(selectedValue);
                }
            } else {
                addedSteps = [selectedValue];
            }
            clonedConditions[index][STEPS] = addedSteps;
        }
        onDataChangeHandler({
            condition: clonedConditions,
            errorList: clonedErrorList,
        });
    };

    const onAddNewCondition = () => {
        const clonedConditions = cloneDeep(condition);
        clonedConditions.push({
            [STEPS]: [],
            [RULE_DETAILS]: {},
        });
        onDataChangeHandler({ condition: clonedConditions });
    };

    const selectDefaultPath = (selectedValue) => {
        let addedSteps = cloneDeep(state?.[DEFAULT_STEPS]) || [];
        const clonedErrorList = cloneDeep(errorList);
        if (clonedErrorList?.[DEFAULT_STEPS]) {
            delete clonedErrorList[DEFAULT_STEPS];
        }
        if (isParallelStep) {
            const selectedStepIndex = addedSteps.findIndex((step) => step.value === selectedValue.value);
            if (selectedStepIndex > -1) {
                addedSteps.splice(selectedStepIndex, 1);
            } else {
                addedSteps.push(selectedValue);
            }
        } else {
            addedSteps = [selectedValue];
        }
        onDataChangeHandler({
            [DEFAULT_STEPS]: addedSteps,
            errorList: clonedErrorList,
        });
    };

    const onDeleteCondition = (index) => {
        let clonedConditions = cloneDeep(condition);
        if (clonedConditions?.[index]) {
            clonedConditions = clonedConditions.slice(0, index).concat(clonedConditions.slice(index + 1));
        }
        onDataChangeHandler({ condition: clonedConditions });
    };

    const getAllConditions = () => condition?.map((eachCondition, index) => (
        <EachCondition
            key={index}
            index={index}
            eachCondition={eachCondition}
            condition={condition}
            onDeleteCondition={onDeleteCondition}
            configStrings={configStrings}
            isParallelStep={isParallelStep}
            usedRuleUUIDs={getAllSelectedConditionRules()}
            metaData={{
                flowId,
                stepUuid,
            }}
            onSaveRule={onSaveRule}
            errorList={errorList}
            onStepSelect={onStepSelect}
            toggleAddNewNodeDropdown={toggleAddNewNodeDropdown}
            onRemoveRule={onRemoveRule}
            stepsList={stepsList}
        />
    ));

    const elseCondition = () => (
        <div className={gClasses.MT16}>
            <Text
                content={configStrings.CONDITIONAL.ELSE_LABEL}
                size={ETextSize.MD}
                className={cx(gClasses.FontWeight500, gClasses.FTwo12GrayV104, gClasses.MB8, gClasses.Italics)}
            />
            <div className={cx(!isParallelStep && gClasses.DisplayFlex)}>
                {
                    isParallelStep ? (
                        <StepSelection
                            id={`${DEFAULT_STEPS}`}
                            configStrings={configStrings}
                            stepsList={cloneDeep(stepsList)}
                            selectedValue={state?.[DEFAULT_STEPS]}
                            onSelectValue={selectDefaultPath}
                            onRemoveValue={(value) => selectDefaultPath({ value })}
                            errorMessage={errorList?.[DEFAULT_STEPS]}
                            toggleAddNewNodeDropdown={toggleAddNewNodeDropdown}
                            refId={DEFAULT_STEPS}
                        />
                    ) : (
                        <SingleStepSelection
                            addStepLabel={configStrings.PATH.ADD_STEP_LABEL}
                            placeholder={configStrings.STEPS_DROPDOWN.PLACEHOLDER}
                            searchLabel={configStrings.STEPS_DROPDOWN.SEARCH.PLACEHOLDER}
                            selectedValue={state?.[DEFAULT_STEPS]?.[0]?.value}
                            errorMessage={errorList?.[DEFAULT_STEPS]}
                            toggleAddNewNodeDropdown={toggleAddNewNodeDropdown}
                            refId={DEFAULT_STEPS}
                            stepsList={cloneDeep(stepsList)}
                            onClick={(value, label) => selectDefaultPath({ value, label })}
                            selectedLabel={state?.[DEFAULT_STEPS]?.[0]?.label}
                        />
                    )
                }
            </div>
        </div>
    );

    return (
        <div className={styles.ConditionBasedSteps}>
            {getAllConditions()}
            <button
                onClick={onAddNewCondition}
                className={cx(styles.AddNewCondition, gClasses.MT16)}
            >
                <Plus />
                {configStrings.CONDITIONAL.ADD_CONDITION}
            </button>
            {elseCondition()}
        </div>
    );
}

export default ConditionalSplit;
