import React from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import gClasses from 'scss/Typography.module.scss';

import { cloneDeep, get, set } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { SingleDropdown, Size } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './DropdownGroup.module.scss';
import ActorOrTeam from '../actor_or_team/ActorOrTeam';
import OtherStepAssignees from '../other_step_assignees/OtherStepAssignees';
import FormFieldAssignee from '../form_field_assignee/FormFieldAssignee';
import { RECIPIENT_OPTION_LIST } from '../../../configurations/Configuration.strings';
import ConfigurationActors from '../../../configurations/configuration_actors/ConfigurationActors';
import Trash from '../../../../../../assets/icons/application/Trash';
import { STEP_TYPE } from '../../../../../../utils/Constants';
import { ASSIGNEE_TYPE } from '../../../../EditFlow.utils';
import Actors from '../Actors';
import { CONDITION_BASED_CONSTANTS } from '../condition_based/ConditionBased.constants';
import RuleBasedRecipient from '../../../../../../components/rule_based_recipient/RuleBasedRecipient';

function DropdownGroup(props) {
  const { t } = useTranslation();
  const {
    data,
    optionList,
    onClick,
    selectedValue,
    outerClass,
    isStepAssignee = false,
    onDeleteHandler,
    assigneeIndex,
    configurationTypeId,
    // label,
    isHideDeleteIcon = false,
    className,
    assigneeErrorList = {},
    onAssigneeDataChange,
    parentId,
    triggerStep,
    serverError,
    currentStepIndex,
    stepActorTypeError = EMPTY_STRING,
    isRecursiveCall,
    recursiveIndex, // ruleIndex
    metaData,
    parentAssigneeIndex,
    selectedRules,
  } = props;
  const { USER_STEP } = STEP_TYPE;

  let actorType = null;

  const {
    CHILD_RULE_ASSIGNEES,
    STEP_ASSIGNEES,
    INITIAL_CHILD_RULE_ASSIGNEE,
    RULES,
  } = CONDITION_BASED_CONSTANTS;

  const getRuleAssigneeData = (assigneeIndex, ruleIndex) => {
    const childData = {
      ...data,
      [STEP_ASSIGNEES]: get(
        data,
        [STEP_ASSIGNEES, assigneeIndex, RULES, ruleIndex, CHILD_RULE_ASSIGNEES],
        INITIAL_CHILD_RULE_ASSIGNEE,
      ),
    };
    return childData;
  };

  const onRuleAssigneeDataChange = (dataParam, ruleIndex) => {
    const clonedDataParam = cloneDeep(dataParam);
    const clonedData = cloneDeep(data);

    if (clonedDataParam.step_assignees) {
      set(
        clonedData,
        [STEP_ASSIGNEES, assigneeIndex, RULES, ruleIndex, CHILD_RULE_ASSIGNEES],
        clonedDataParam?.[STEP_ASSIGNEES],
      );
    }

    onAssigneeDataChange(clonedData, assigneeIndex);
  };

  const onRuleDataChange = (dataParam) => {
    const clonedDataParam = cloneDeep(dataParam);
    const clonedData = cloneDeep(data);
    clonedData[STEP_ASSIGNEES][assigneeIndex] = clonedDataParam;
    onAssigneeDataChange(clonedData, assigneeIndex);
  };

  switch (selectedValue) {
    case ASSIGNEE_TYPE.DIRECT_ASSIGNEE:
      actorType =
        <ActorOrTeam
          assigneeIndex={assigneeIndex}
          data={data}
          assigneeErrorList={cloneDeep(assigneeErrorList)}
          serverError={serverError}
          onAssigneeDataChange={onAssigneeDataChange}
          triggerStep={triggerStep}
          isRecursiveCall={isRecursiveCall}
          recursiveIndex={recursiveIndex}
          parentAssigneeIndex={parentAssigneeIndex}
        />;
      break;
    case ASSIGNEE_TYPE.OTHER_STEP_ASSIGNEE:
    case ASSIGNEE_TYPE.INITIATOR_REPORTING_MANAGER:
      actorType =
        <OtherStepAssignees
          assigneeIndex={assigneeIndex}
          data={data}
          assigneeErrorList={assigneeErrorList}
          onAssigneeDataChange={onAssigneeDataChange}
          isRecursiveCall={isRecursiveCall}
          recursiveIndex={recursiveIndex}
          parentAssigneeIndex={parentAssigneeIndex}
        />;
        break;
     case ASSIGNEE_TYPE.RULE_BASED:
        // actorType = isRecursiveCall ? null : <useConditionBases
        //   data={data}
        //   assigneeErrorList={assigneeErrorList}
        //   onAssigneeDataChange={onAssigneeDataChange}
        //   parentId={parentId}
        //   triggerStep={false}
        //   currentStepIndex={currentStepIndex}
        //   isRecursiveCall={isRecursiveCall}
        //   assigneeIndex={assigneeIndex}
        //   metaData={metaData}
        //   selectedRules={selectedRules}
        // />;
        actorType = null;
        break;
     case ASSIGNEE_TYPE.FORM_FIELD_ASSIGNEE:
      case ASSIGNEE_TYPE.FORM_FIELD_REPORTING_MANAGER:
        actorType =
        <FormFieldAssignee
          assigneeIndex={assigneeIndex}
          data={data}
          assigneeErrorList={assigneeErrorList}
          onAssigneeDataChange={onAssigneeDataChange}
          parentId={parentId}
          isRecursiveCall={isRecursiveCall}
          recursiveIndex={recursiveIndex}
          parentAssigneeIndex={parentAssigneeIndex}
        />;
      break;
    case RECIPIENT_OPTION_LIST(t)[0].value:
    case RECIPIENT_OPTION_LIST(t)[1].value:
    case RECIPIENT_OPTION_LIST(t)[2].value:
    case RECIPIENT_OPTION_LIST(t)[3].value:
    case RECIPIENT_OPTION_LIST(t)[4].value:
    case RECIPIENT_OPTION_LIST(t)[5].value:
    case RECIPIENT_OPTION_LIST(t)[6].value:
      actorType = (
        <ConfigurationActors
          recipientTypeIndex={assigneeIndex}
          recipientType={selectedValue}
          stepData={data}
          configurationTypeId={configurationTypeId}
          recipientErrorList={assigneeErrorList}
        />
      );
      break;
    default:
      break;
  }

  return (
    <div className={cx(outerClass)}>
      <div className={cx(styles.DropdownContainer, className)}>
        <div className={gClasses.FlexJustifyBetween}>
          <div className={gClasses.DisplayFlex}>
            <div className={cx(styles.ActorTypes)}>
              <SingleDropdown
                optionList={optionList}
                selectedValue={selectedValue}
                errorMessage={stepActorTypeError}
                hideLabel
                onClick={(value) => onClick(value)}
                getPopperContainerClassName={() => gClasses.ZIndex8}
                dropdownViewProps={{
                  size: Size.md,
                  className: !isRecursiveCall ? styles.ActorDropdownView : styles.ActorDropdownViewRecursive,
                  disabled:
                    isStepAssignee &&
                    data?.is_initiation &&
                    data?.step_type === USER_STEP,
                }}
              />
            </div>
            <div className={styles.VerticalDivider} />
            <div
              className={
                isHideDeleteIcon
                  ? styles.ActorTypeInitialField
                  : styles.ActorTypeField
              }
            >
              {actorType}
            </div>
          </div>
          <div className={cx(gClasses.CursorPointer, gClasses.MT3)}>
            {isHideDeleteIcon ? null : (
              <button onClick={onDeleteHandler}>
                <Trash />
              </button>
            )}
          </div>
        </div>
        {isStepAssignee && selectedValue === ASSIGNEE_TYPE.RULE_BASED
          ? !isRecursiveCall && (
              <div className={cx(gClasses.MT16, styles.RuleRecipients)}>
                <RuleBasedRecipient
                  selectedRules={selectedRules}
                  onDataChange={onRuleDataChange}
                  data={data.step_assignees[assigneeIndex]}
                  metaData={metaData}
                  assigneeIndex={assigneeIndex}
                  assigneeErrorList={assigneeErrorList}
                  recipientsComponent={({ ruleIndex }) => (
                    <Actors
                      data={getRuleAssigneeData(assigneeIndex, ruleIndex)}
                      assigneeErrorList={assigneeErrorList}
                      onAssigneeDataChange={(dataParam) => onRuleAssigneeDataChange(dataParam, ruleIndex)}
                      parentId={parentId}
                      triggerStep={false}
                      currentStepIndex={currentStepIndex}
                      parentAssigneeIndex={assigneeIndex}
                      isRecursiveCall
                      recursiveIndex={ruleIndex}
                      dropdownGroupClass={styles.NestedAssigneeClass}
                      actorsContainerClassName={styles.NestedAssigneeClass}
                    />
                  )}
                />
              </div>
            )
          : null}
      </div>
    </div>
  );
}

export default DropdownGroup;
