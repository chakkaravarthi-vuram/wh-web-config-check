import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { isEmpty, compact, cloneDeep, isUndefined, get } from 'utils/jsUtility';
import gClasses from 'scss/Typography.module.scss';
import ReadOnlyText from 'components/form_components/read_only_text/ReadOnlyText';
import { STEP_TYPE } from 'utils/Constants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import HelpIcon from 'assets/icons/HelpIcon';
import { FLOW_TRIGGER_CONSTANTS } from 'components/flow_trigger_configuration/TriggerConfiguration.constants';
import { Button, EButtonSizeType, EButtonType, RadioGroup, RadioGroupLayout, Text } from '@workhall-pvt-lmt/wh-ui-library';
import DropdownGroup from './flow_dropdown_group/DropdownGroup';
import styles from './Actors.module.scss';
import {
  ACTORS_STRINGS,
  FLOW_STRINGS,
  FLOW_WORKFLOW_ALGORITHM,
  STEP_CARD_STRINGS,
} from '../../../EditFlow.strings';
import { ASSIGNEE_TYPE as ASSIGNEE_TYPE_CONSTANTS, getStepAssigneeOptionList } from '../../../EditFlow.utils';

import AddStep from '../add_step/AddStep';
import { getConditionalRulesApi } from '../../../../../axios/apiService/rule.apiService';
import { CONDITION_BASED_CONSTANTS } from './condition_based/ConditionBased.constants';
import AddUserIcon from '../../../../../assets/icons/AddUserIcon';

function Actors(props) {
  const { t } = useTranslation();
  const {
    data,
    triggerStep = false,
    assigneeErrorList = {},
    onAssigneeDataChange,
    onWorkloadDataChangeHandler,
    parentId,
    serverError,
    currentStepIndex,
    readOnlyClass,
    isRecursiveCall,
    recursiveIndex,
    metaData,
    parentAssigneeIndex,
    dropdownGroupClass,
    actorsContainerClassName,
  } = props;
  console.log('stepDataActors', data, 'step_assignees', data?.step_assignees, 'currentStepIndex', currentStepIndex);

  const { TRIGGER_HELPER_TOOLTIP_ID } = FLOW_TRIGGER_CONSTANTS;
  const {
    CHILD_RULE_ASSIGNEES,
    INITIAL_CHILD_RULE_ASSIGNEE,
    CONDITION_RULE,
    RULES,
    MAX_RULE_ASSIGNEE,
  } = CONDITION_BASED_CONSTANTS;

  let actorDropdownOptions = [];

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [assignmentPreferenceValue, setAssignmentPreferenceValue] = useState(
    FLOW_WORKFLOW_ALGORITHM.OPTION_LIST(t)[0].value,
  );
  const [assignmentPreferenceLabel, setAssignmentPreferenceLabel] = useState(
    FLOW_WORKFLOW_ALGORITHM.OPTION_LIST(t)[0].label,
  );
  const [isShowRadioOption, setShowRadioOption] = useState(false);
  const [rules, setRules] = useState({
    list: [],
    paginationDetails: {},
    loading: false,
  });

  const { selected_assignee_type } = cloneDeep(data);
  const { ASSIGNEE_TYPE, FLOW_TRIGGER_TITLE, FLOW_TRIGGER_SUB_TITLE,
    FLOW_TRIGGER_STEP_NAME_TITLE, FLOW_DEFAULT_ASSIGNEE_LABEL, AND_LABEL,
    FLOW_TRIGGER_DEFAULT_ASSIGNEE_LABEL,
  } =
    FLOW_STRINGS.STEPS.STEP.BASIC_INFO_AND_ACTORS.ACTORS;
  actorDropdownOptions = getStepAssigneeOptionList(t);

  const getAllSelectedConditionRules = () => {
    const selectedConditionalRules = data?.step_assignees?.map((eachAssignee) => eachAssignee?.[CONDITION_RULE]);

    return selectedConditionalRules?.filter((eachRule) => !isEmpty(eachRule));
  };

  const getConditionalRules = () => {
    const selectedRules = getAllSelectedConditionRules();

    const params = {
      page: 1,
      size: selectedRules?.length,
      flow_id: data?.flow_id,
      rule_uuids: selectedRules,
    };

    getConditionalRulesApi(params)
      .then((res) => {
        const { pagination_data = [], pagination_details = [{}] } = res;

        const paginationDetails = pagination_details[0];

        setRules(() => {
          return {
            list: pagination_data,
            loading: false,
            paginationDetails,
          };
        });
      })
      .catch((error) => {
        setRules({ list: [], loading: false, paginationDetails: {} });
        console.log('getConditionalRulesApi', error);
      });
  };

  useEffect(() => {
    const hasRuleBased = data?.step_assignees?.some((option) => option?.assignee_type === ASSIGNEE_TYPE.RULE_BASED);

    if (hasRuleBased && isEmpty(rules?.list) && !rules?.loading) {
      getConditionalRules();
    }
  }, []);

  useEffect(() => {
    const clonedData = cloneDeep(data);
    if (clonedData.step_type === STEP_TYPE.USER_STEP && !isRecursiveCall) {
      let isWorkloadAssignment = clonedData.is_workload_assignment;
      if (clonedData &&
        isUndefined(isWorkloadAssignment)
      ) {
        isWorkloadAssignment = false;
      } else {
        if (isWorkloadAssignment) {
          setAssignmentPreferenceValue(
            FLOW_WORKFLOW_ALGORITHM.OPTION_LIST(t)[1].value,
          );
          setAssignmentPreferenceLabel(
            FLOW_WORKFLOW_ALGORITHM.OPTION_LIST(t)[1].label,
          );
        }
      }
      onWorkloadDataChangeHandler(isWorkloadAssignment);
    }
  }, []);

  useEffect(() => {
    if (!showMoreOptions) {
      if (
        selected_assignee_type !== ASSIGNEE_TYPE_CONSTANTS.DIRECT_ASSIGNEE &&
        selected_assignee_type !== ASSIGNEE_TYPE_CONSTANTS.OTHER_STEP_ASSIGNEE
      ) {
        setShowMoreOptions(true);
      }
    }
  }, [selected_assignee_type]);
  const onAssigneeTypeSelect = (selectedAssigneeType, assigneeIndex) => {
    const clonedData = cloneDeep(data);
    if (clonedData.step_assignees[assigneeIndex].assignee_type !== selectedAssigneeType) {
      clonedData.assignee_error_list = {};
      if (assigneeIndex >= 0) {
        if (clonedData &&
          clonedData.step_assignees &&
          clonedData.step_assignees[assigneeIndex]
        ) {
          clonedData.step_assignees[
            assigneeIndex
          ].assignee_type = selectedAssigneeType;
          const allowed = ['assignee_type'];
          Object.keys(
            clonedData.step_assignees[assigneeIndex],
          )
            .filter((key) => !allowed.includes(key))
            .forEach(
              (key) =>
                delete clonedData.step_assignees[
                assigneeIndex
                ][key],
            );

          if (ASSIGNEE_TYPE.RULE_BASED === selectedAssigneeType) {
            const ruleBased = {
              ...clonedData.step_assignees[assigneeIndex],
               [RULES]: [{ [CONDITION_RULE]: null, [CHILD_RULE_ASSIGNEES]: INITIAL_CHILD_RULE_ASSIGNEE }],
            };
            clonedData.step_assignees[
              assigneeIndex
            ] = ruleBased;
            console.log('xyz clonedData', clonedData);
          }
        }
      }
    }
    onAssigneeDataChange(clonedData, assigneeIndex);
  };

  const updatedActorsAndTeams = (selectedType) => {
    const clonedData = cloneDeep(data);
    const allUsersAndTeamsList = actorDropdownOptions;
    const choosenUsersAndTeamsList = clonedData.step_assignees.map((data) => data.assignee_type);
    let consolidatedList = allUsersAndTeamsList.map((option) => {
      if (
        ((!isRecursiveCall) &&
          (option.value !== selectedType && choosenUsersAndTeamsList.includes(option.value))
        ) ||
        (isRecursiveCall && (
          option.value === ASSIGNEE_TYPE.RULE_BASED ||
          (option.value !== selectedType && choosenUsersAndTeamsList.includes(option.value)))
        )
      ) {
        return null;
      }
      return option;
    });
    consolidatedList = compact(consolidatedList);
    return consolidatedList;
  };
  const onAdddStepClickContainer = () => {
    const clonedData = cloneDeep(data);
    const consolidatedOptionList = updatedActorsAndTeams();
    console.log('onAddactors', onAdddStepClickContainer, 'consolidatedOptionList', consolidatedOptionList);
    if (!isEmpty(consolidatedOptionList)) {
      clonedData.step_assignees.push({
        assignee_type: consolidatedOptionList[0].value,
      });
      onAssigneeDataChange(clonedData);
    }
  };

  const onADeleteStepClickContainer = (assigneeIndex) => {
    const clonedData = cloneDeep(data);
    if (clonedData.step_assignees) {
      const deletedAssigneeType =
        clonedData.step_assignees[assigneeIndex]
          .assignee_type;
      clonedData.step_assignees.splice(
        assigneeIndex,
        1,
      );
      if (!isEmpty(clonedData.assignee_error_list)) {
        delete clonedData.assignee_error_list[
          deletedAssigneeType
        ];
      }
      onAssigneeDataChange(clonedData, assigneeIndex);
    }
  };

  const onChangeClickHandler = () => {
    setShowRadioOption(true);
  };

  let assigneeDropdownList = null;
  let updatedActorsAndTeamsOptionList = [];
  const clonedData = cloneDeep(data);
  const all_step_assignees =
    clonedData.step_assignees || [];

  const maxAssigneeRule = all_step_assignees.length !== (MAX_RULE_ASSIGNEE + (isRecursiveCall ? 0 : 1));

  if (clonedData.step_assignees) {
    assigneeDropdownList = clonedData.step_assignees.map((assignees, index) => {
      updatedActorsAndTeamsOptionList = updatedActorsAndTeams(
        assignees.assignee_type,
      );
      console.log('djadfhjsafjafsa', cloneDeep(clonedData), data, 'step_assignees', clonedData.step_assignees, 'actorsList', updatedActorsAndTeamsOptionList);
      let dropdownGroupLabel = index === 0 ? t(ASSIGNEE_TYPE.LABEL) : t(AND_LABEL);
      if (triggerStep) dropdownGroupLabel = t(FLOW_TRIGGER_SUB_TITLE);
      const serverErrorMsg = (assignees.assignee_type === ASSIGNEE_TYPE_CONSTANTS.DIRECT_ASSIGNEE) ? (serverError?.direct_assignee) : EMPTY_STRING;

      let dropdownGroupKey = `${assignees.assignee_type}-${index}`;

      if (!isUndefined(parentAssigneeIndex)) {
        dropdownGroupKey = `${assignees.assignee_type}-${parentAssigneeIndex}-${index}`;
      }

      return (
        <DropdownGroup
          key={dropdownGroupKey}
          onAssigneeDataChange={onAssigneeDataChange}
          isStepAssignee
          optionList={updatedActorsAndTeamsOptionList}
          onClick={(selectedAssigneeType) => {
            onAssigneeTypeSelect(selectedAssigneeType, index);
          }}
          selectedValue={assignees.assignee_type}
          label={dropdownGroupLabel}
          className={cx(isRecursiveCall && index === 4 && styles.LastRuleActor, dropdownGroupClass)}
          radioViewClassName={styles.ActorsEachDiv}
          containerClass={styles.ActorsContainer}
          serverError={serverErrorMsg}
          isRequired
          data={cloneDeep(data)}
          onDeleteHandler={() => onADeleteStepClickContainer(index)}
          assigneeIndex={index}
          isHideDeleteIcon={all_step_assignees.length === 1}
          assigneeErrorList={cloneDeep(assigneeErrorList)}
          parentId={parentId}
          triggerStep={triggerStep}
          currentStepIndex={currentStepIndex}
          isRecursiveCall={isRecursiveCall}
          recursiveIndex={recursiveIndex}
          metaData={metaData}
          parentAssigneeIndex={parentAssigneeIndex}
          selectedRules={rules?.list}
        />
      );
    });
  }

  return (
    <>
      {triggerStep &&
        (
          <>
            <div className={cx(gClasses.DisplayFlex, gClasses.MB10)}>
              <div className={styles.TriggerTitle}>
                {t(FLOW_TRIGGER_TITLE)}
              </div>
              <HelpIcon className={styles.HelpIcon} id={TRIGGER_HELPER_TOOLTIP_ID} title={t(FLOW_TRIGGER_CONSTANTS.FIRST_STEP_ACTOR_TOOLTIP)} />
            </div>
            <div>
              <ReadOnlyText
                label={t(FLOW_TRIGGER_STEP_NAME_TITLE)}
                value={get(clonedData,
                  ['child_flow_details', 'child_flow_initial_step_name'],
                  EMPTY_STRING)}
                // isLoading={isStepActorLoading}
                className={readOnlyClass}
              />
            </div>
          </>
        )
      }
      <div className={triggerStep ? styles.DropdownGroupClass : cx(styles.ActorsContainer, actorsContainerClassName)}>
        {assigneeDropdownList}
        {
          maxAssigneeRule ? (
            <AddStep
              onClick={onAdddStepClickContainer}
              stepText={t(ACTORS_STRINGS.STEP_TEXT)}
              className={styles.ActorsAddStep}
              textClassName={styles.AddStepText}
              noAddButton
              isCustomStepIcon
              stepIcon={<AddUserIcon className={styles.PlusIcon} />}
            />
          ) : null
        }
      </div>
      {
        !isRecursiveCall && (
          <>
            <Text
              content={triggerStep ? t(FLOW_TRIGGER_DEFAULT_ASSIGNEE_LABEL) : t(FLOW_DEFAULT_ASSIGNEE_LABEL)}
              className={cx(styles.DefaultActor, clonedData.is_initiation && gClasses.MT8)}
            />
            {!triggerStep && (!clonedData.is_initiation && clonedData?.step_type === STEP_TYPE.USER_STEP) &&
              (
                <>
                  <Text
                    content={t(ACTORS_STRINGS.SET_ASSIGNMENT)}
                    className={cx(gClasses.MT16, styles.FieldLabel)}
                  />
                  <div
                    className={cx(
                      gClasses.MT6,
                      gClasses.DisplayFlex,
                    )}
                  >
                    <Text
                      content={assignmentPreferenceLabel}
                      className={gClasses.FTwo13GrayV3}
                    />
                    {!isShowRadioOption && !isRecursiveCall && (
                      <Button
                        size={EButtonSizeType.MD}
                        buttonText={STEP_CARD_STRINGS(t).CHANGE_BUTTON}
                        onClickHandler={onChangeClickHandler}
                        noBorder
                        type={EButtonType.OUTLINE_SECONDARY}
                        className={cx(styles.ChangeTextClass, gClasses.ML4)}
                      />
                    )}
                  </div>
                  {isShowRadioOption && (
                    <RadioGroup
                      hideLabel
                      options={FLOW_WORKFLOW_ALGORITHM.OPTION_LIST(t)}
                      layout={RadioGroupLayout.stack}
                      onChange={(_event, _id, value) => {
                        setAssignmentPreferenceValue(value);
                        setAssignmentPreferenceLabel(
                          FLOW_WORKFLOW_ALGORITHM.OPTION_LIST(t)[value].label,
                        );
                        console.log('selectedVal', value);
                        onWorkloadDataChangeHandler(value !== 0);
                      }}
                      selectedValue={assignmentPreferenceValue}
                    />
                  )}
                </>
            )}
          </>
        )
      }
    </>
  );
}
export default Actors;

Actors.defaultProps = {};
Actors.propTypes = { data: PropTypes.objectOf(PropTypes.any).isRequired };
