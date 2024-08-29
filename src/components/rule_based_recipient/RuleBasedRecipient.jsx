import React, { useRef } from 'react';
import gClasses from 'scss/Typography.module.scss';
import cx from 'classnames/bind';
import { Text } from '@workhall-pvt-lmt/wh-ui-library';
import { useTranslation } from 'react-i18next';
import styles from './RuleBasedRecipient.module.scss';
import { RULE_BASED_RECIPIENTS } from './RuleBasedRecipient.strings';
import EachAssigneeRule from './EachAssigneeRule';
import { CONDITION_BASED_CONSTANTS } from '../../containers/edit_flow/step_configuration/step_components/actors/condition_based/ConditionBased.constants';
import { cloneDeep, set } from '../../utils/jsUtility';
import PlusIconBlueNew from '../../assets/icons/PlusIconBlueNew';
import Trash from '../../assets/icons/application/Trash';
import { RECIPIENT_STRINGS } from '../../containers/edit_flow/step_configuration/node_configurations/send_email/SendEmailConfig.string';

const MAX_NO_OF_RULES = 10;

function RuleBasedRecipient(props) {
    const { t } = useTranslation();
    const { RULE_RECIPIENT } = RULE_BASED_RECIPIENTS(t);
    const { CHILD_RULE_ASSIGNEES, INITIAL_CHILD_RULE_ASSIGNEE, CONDITION_RULE, RULES } = CONDITION_BASED_CONSTANTS;
    const {
        recipientsComponent = null,
        metaData,
        headers = RULE_RECIPIENT.HEADERS,
        data,
        selectedRules,
        assigneeIndex,
        onDataChange,
        assigneeErrorList,
        rulesKey = RULES,
        conditionRuleKey = CONDITION_RULE,
        ruleAssigneeKey = CHILD_RULE_ASSIGNEES,
        initialAssigneeData = INITIAL_CHILD_RULE_ASSIGNEE,
        assigneeKey,
    } = props;

    const headerRef = useRef();
    const usedRuleUUIDs = data?.[rulesKey]?.map((r) => r[conditionRuleKey]).filter((v) => !!v) || [];

    const getTableHeader = () => {
        console.log('headersss');
        return (
            <div className={cx(gClasses.DisplayFlex, styles.RuleHeader, gClasses.gap24)}>
                <div
                    ref={headerRef}
                    className={styles.RuleCondition}
                >
                    <Text
                        content={headers?.[0]}
                        className={cx(gClasses.FTwo12GrayV89, gClasses.FontWeight500, styles.RuleCondition)}
                    />
                </div>
                <Text
                    content={headers?.[1]}
                    className={cx(gClasses.FTwo12GrayV89, gClasses.FontWeight500)}
                />
            </div>
        );
    };

    const onAddRule = () => {
        const clonedData = cloneDeep(data);
        clonedData[rulesKey].push({ [conditionRuleKey]: null, [ruleAssigneeKey]: initialAssigneeData });
        onDataChange(clonedData, assigneeIndex);
    };

    const onRemoveRule = (conditionIndex) => {
        const clonedData = cloneDeep(data);
        set(clonedData, [rulesKey, conditionIndex, conditionRuleKey], null);
        onDataChange(clonedData, assigneeIndex);
    };

    const onDeleteCondition = (conditionIndex) => {
        const clonedData = cloneDeep(data);
        clonedData[rulesKey].splice(conditionIndex, 1);
        onDataChange(clonedData, assigneeIndex);
    };

    const onSelectRule = (ruleIndex, rule) => {
        const clonedData = cloneDeep(data);
        clonedData[rulesKey][ruleIndex][conditionRuleKey] = rule.rule_uuid;
        onDataChange(clonedData, assigneeIndex, rule);
    };

    const getAssigneeRuleError = (ruleIndex) => {
        const errorKey = `${assigneeKey},${assigneeIndex},${rulesKey},${ruleIndex},${conditionRuleKey}`;
        return assigneeErrorList?.[errorKey];
    };

    const getTableBody = () => {
        console.log('bodytable', data?.[rulesKey]);
        // const hideDeleteCondition = data?.[rulesKey]?.length <= 1;
        return (
            <>
                <div className={cx(styles.RuleAssigneeBody, gClasses.MB8)}>
                    <div className={gClasses.ML6}>
                        {data?.[rulesKey]?.map((eachRule, idx) => (
                            <div key={idx} className={gClasses.DisplayFlex}>
                                <EachAssigneeRule
                                    index={idx}
                                    metaData={metaData}
                                    ruleData={eachRule}
                                    errorMessage={getAssigneeRuleError(idx)}
                                    selectedRules={selectedRules}
                                    usedRuleUUIDs={usedRuleUUIDs}
                                    onRemoveRule={onRemoveRule}
                                    onSelectRule={onSelectRule}
                                    recipientsComponent={recipientsComponent}
                                    headerRef={headerRef}
                                    conditionRuleKey={conditionRuleKey}
                                />
                                { data[rulesKey].length > 1 &&
                                <button
                                    className={cx(gClasses.ML6, styles.HideDeleteCondition)}
                                    onClick={() => onDeleteCondition(idx)}
                                >
                                    <Trash />
                                </button>}

                            </div>
                        ),
                        )}
                    </div>
                </div>
                {data?.[rulesKey]?.length < MAX_NO_OF_RULES &&
                    <button className={cx(gClasses.PX16, gClasses.PY8, gClasses.BlueIconBtn)} onClick={onAddRule}>
                        <PlusIconBlueNew />
                        <Text
                            content={RECIPIENT_STRINGS(t).ADD_CONDITION}
                            className={cx(gClasses.FTwo12BlueV39, gClasses.ML4, gClasses.FontWeight500)}
                        />
                    </button>}
            </>
        );
    };

    return (
        <div className={cx(gClasses.MT12, gClasses.ML20, styles.RuleAssigneeContainer)}>
            {getTableHeader()}
            {getTableBody()}
        </div>
    );
}

export default RuleBasedRecipient;
