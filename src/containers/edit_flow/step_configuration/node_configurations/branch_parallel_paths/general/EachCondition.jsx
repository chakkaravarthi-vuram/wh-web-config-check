import React, { useState } from 'react';
import { Text, ETextSize, Tooltip, Chip, EChipSize, ETooltipPlacements, ETooltipType } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import styles from '../BranchParallelPaths.module.scss';
import gClasses from '../../../../../../scss/Typography.module.scss';
import StepSelection from './StepSelection';
import Trash from '../../../../../../assets/icons/application/Trash';
import Edit from '../../../../../../assets/icons/application/EditV2';
import { cloneDeep } from '../../../../../../utils/jsUtility';
import { CONDITION_ROUTER_RESPONSE_KEYS } from '../BranchParallelPaths.constants';
import SingleStepSelection from './SingleStepSelection';
import useConditionBased from '../../../step_components/actors/condition_based/ConditionBased';

function EachCondition(props) {
    const {
        index,
        eachCondition,
        configStrings,
        onDeleteCondition,
        condition,
        usedRuleUUIDs = [],
        metaData: {
            flowId,
            stepUuid,
        },
        isParallelStep,
        errorList,
        onSaveRule,
        onStepSelect,
        toggleAddNewNodeDropdown,
        stepsList,
        onRemoveRule,
    } = props;

    const {
        RULE_DETAILS,
        STEPS,
        CONDITION,
    } = CONDITION_ROUTER_RESPONSE_KEYS;

    const [selectedRule, setSelectedRule] = useState();

    const { getRuleDropdown, getRuleModal, onEditRule } = useConditionBased({
        metaData: {
            moduleId: flowId,
            stepUUID: stepUuid,
        },
        selectedRule: {
            rule_uuid: selectedRule?.ruleUUID,
        },
        usedRuleUUIDs: usedRuleUUIDs,
        // restrictExistingConditions: true,
        ruleSelectionViewClassName: cx(gClasses.CenterV, gClasses.Gap16),
    });

    const getConditionComponent = (condition, index) => {
        const { ruleDetails = {} } = condition;
        return !ruleDetails?.ruleUUID ? (
            <>
                {getRuleDropdown((ruleData) => onSaveRule(ruleData, index))}
                {
                    errorList?.[`${CONDITION},${index},${RULE_DETAILS}`] && (
                        <Text
                            content={errorList?.[`${CONDITION},${index},${RULE_DETAILS}`]}
                            size={ETextSize.XS}
                            className={gClasses.red22}
                        />
                    )
                }
            </>
        ) : (
            <div className={cx(styles.SelectedRuleContainer)}>
                <Tooltip
                    id={ruleDetails.ruleUUID}
                    text={ruleDetails?.ruleName}
                    tooltipType={ETooltipType.INFO}
                    tooltipPlacement={ETooltipPlacements.BOTTOM}
                    icon={
                        <Text
                            content={ruleDetails?.ruleName}
                            className={cx(styles.RuleName, gClasses.Ellipsis, gClasses.PR8)}
                        />
                    }
                />
                <div className={cx(gClasses.DisplayFlex, gClasses.AlignCenter)}>
                    <Chip
                        text="Expression"
                        size={EChipSize.sm}
                        className={cx(gClasses.FS13, gClasses.FontWeight500, gClasses.LineHeightV2, gClasses.LetterSpacingNormal, styles.ChipStyle)}
                        textClassName={styles.ChipTextStyle}
                        backgroundColor="#e8f2fe"
                        textColor="#217cf5"
                    />
                    <button
                        className={gClasses.ML8}
                        onClick={() => {
                            onEditRule();
                            setSelectedRule(ruleDetails);
                        }}
                    >
                        <Edit />
                    </button>
                    <button
                        className={gClasses.ML8}
                        onClick={() => onRemoveRule(index)}
                    >
                        <Trash />
                    </button>
                </div>
            </div>
        );
    };
    return (
            <div key={index}>
                <div className={cx(styles.ConditionContainer, index !== 0 && gClasses.MT16)}>
                    <div className={styles.AddCondition}>
                        <div className={cx(gClasses.DisplayFlex, gClasses.JusSpaceBtw, gClasses.MB12)}>
                            <Text
                                content={configStrings.CONDITIONAL.TITLE}
                                className={cx(gClasses.FontWeight500, gClasses.FTwo12BlackV20)}
                            />
                            <button
                                onClick={() => onDeleteCondition(index)}
                                className={cx(condition?.length <= 1 && styles.Hide)}
                            >
                                <Trash />
                            </button>
                        </div>
                        {getConditionComponent(eachCondition, index)}
                    </div>
                    <div className={cx(styles.EachStepCondition, isParallelStep && gClasses.FlexDirectionCol)}>
                        <Text
                            content={configStrings.CONDITIONAL.CONDITION_TRUE_LABEL}
                            size={ETextSize.MD}
                            className={cx(styles.Title, gClasses.MY_AUTO)}
                        />
                        {
                            isParallelStep ? (
                                <StepSelection
                                    configStrings={configStrings}
                                    stepsList={cloneDeep(stepsList)}
                                    selectedValue={eachCondition?.[STEPS]}
                                    onSelectValue={(selectedValue) => onStepSelect(selectedValue, index)}
                                    onRemoveValue={(value) => onStepSelect({ value }, index)}
                                    errorMessage={errorList?.[`${CONDITION},${index},${STEPS}`]}
                                    toggleAddNewNodeDropdown={toggleAddNewNodeDropdown}
                                    refId={`${CONDITION},${index},${STEPS}`}
                                />
                            ) : (
                                <SingleStepSelection
                                    addStepLabel={configStrings.PATH.ADD_STEP_LABEL}
                                    placeholder={configStrings.STEPS_DROPDOWN.PLACEHOLDER}
                                    searchLabel={configStrings.STEPS_DROPDOWN.SEARCH.PLACEHOLDER}
                                    selectedValue={eachCondition?.[STEPS]?.[0]?.value}
                                    errorMessage={errorList?.[`${CONDITION},${index},${STEPS}`]}
                                    toggleAddNewNodeDropdown={toggleAddNewNodeDropdown}
                                    refId={`${CONDITION},${index},${STEPS}`}
                                    stepsList={cloneDeep(stepsList)}
                                    selectedLabel={eachCondition?.[STEPS]?.[0]?.label}
                                    onClick={(value, label) => onStepSelect({ value, label }, index)}
                                />
                            )
                        }
                    </div>
                    {getRuleModal((ruleData) => onSaveRule(ruleData, index), () => setSelectedRule(null))}
                </div>
            </div>
        );
}

export default EachCondition;
