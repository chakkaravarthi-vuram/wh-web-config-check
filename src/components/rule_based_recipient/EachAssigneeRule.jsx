import React, { useEffect, useRef } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { ETooltipType, Chip, Text, ETooltipPlacements, Tooltip, EChipSize } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import styles from './RuleBasedRecipient.module.scss';
import Trash from '../../assets/icons/application/Trash';
import Edit from '../../assets/icons/application/EditV2';
import { RULE_BASED_RECIPIENTS } from './RuleBasedRecipient.strings';
import useConditionBased from '../../containers/edit_flow/step_configuration/step_components/actors/condition_based/ConditionBased';
import DNDIcon from '../../assets/icons/flow_icons/DNDIcon';
import { CONDITION_BASED_CONSTANTS } from '../../containers/edit_flow/step_configuration/step_components/actors/condition_based/ConditionBased.constants';

function EachAssigneeRule(props) {
    const { t } = useTranslation();
    const {
      index,
      metaData,
      ruleData,
      recipientsComponent = null,
      selectedRules,
      usedRuleUUIDs,
      headerRef,
      onSelectRule,
      onRemoveRule,
      errorMessage,
      conditionRuleKey = CONDITION_BASED_CONSTANTS.CONDITION_RULE,
    } = props;
    const { RULE_RECIPIENT } = RULE_BASED_RECIPIENTS(t);
    const { BODY } = RULE_RECIPIENT;

    const bodyRef = useRef(null);
    const rule = selectedRules?.find((r) => r.rule_uuid === ruleData?.[conditionRuleKey]) || {};

    const { getRuleDropdown, getRuleModal, onEditRule } = useConditionBased({
      metaData,
      selectedRules,
      selectedRule: rule,
      usedRuleUUIDs,
      ruleSelectionViewClassName: cx(gClasses.DisplayFlex, gClasses.FlexDirectionColumn, gClasses.Gap8),
    });

    useEffect(() => {
        const e1 = headerRef?.current;
        const e3 = bodyRef?.current;
        if (e1 && e3) {
            const width = e1.clientWidth;
            console.log('external col mapping out useEf', width, e3, e1);
            e3.style.width = `${width}px`;
            e3.style.minWidth = `${width}px`;
          }
    }, [headerRef]);

    const onRuleClick = (rule) => {
      onSelectRule(index, rule);
    };

    return (
        <div className={cx(gClasses.DisplayFlex, gClasses.Gap16, styles.EachRuleContainer)}>
            <div className={styles.DNDContainer}>
                <DNDIcon />
            </div>
            <div className={cx(gClasses.DisplayFlex, gClasses.Gap16, styles.EachRule)}>
                { ruleData?.[conditionRuleKey] ? (
                <div className={cx(styles.SelectedRuleContainer, styles.RuleConditionBody)} ref={bodyRef}>
                    <Tooltip
                        id={BODY.CONDITION.ID}
                        text={rule?.rule_name}
                        tooltipType={ETooltipType.INFO}
                        tooltipPlacement={ETooltipPlacements.BOTTOM}
                        icon={<Text content={rule?.rule_name} className={cx(styles.RuleName, gClasses.Ellipsis, gClasses.PR8)} />}
                    />
                    <div className={cx(gClasses.DisplayFlex, gClasses.AlignCenter)}>
                        <Chip
                            id={BODY.CONDITION.ID}
                            text={BODY.CONDITION.RULE_TYPE}
                            size={EChipSize.sm}
                            className={cx(gClasses.FS13, gClasses.FontWeight500, gClasses.LineHeightV2, gClasses.LetterSpacingNormal, styles.ChipStyle)}
                            textClassName={styles.ChipTextStyle}
                            backgroundColor="#e8f2fe"
                            textColor="#217cf5"
                        />
                        <button
                            className={gClasses.ML8}
                            onClick={onEditRule}
                        >
                            <Edit />
                        </button>
                        <button
                            className={gClasses.ML8}
                            onClick={() => { onRemoveRule(index); }}
                        >
                            <Trash />
                        </button>
                    </div>
                </div>
                ) : (
                    getRuleDropdown(onRuleClick, errorMessage)
                )}
                <div className={cx(styles.RuleAssigneeBodyFlex, gClasses.W100)}>
                    {recipientsComponent({ ruleIndex: index })}
                </div>
            </div>
            {getRuleModal(onRuleClick)}
        </div>
    );
}

export default EachAssigneeRule;
