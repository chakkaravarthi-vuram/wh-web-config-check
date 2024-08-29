import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  isEmpty,
  cloneDeep,
  get,
} from 'utils/jsUtility';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { STEP_TYPE } from 'utils/Constants';
import { NO_DATA_FOUND_TEXT } from 'utils/strings/CommonStrings';
import { MultiDropdown, Size } from '@workhall-pvt-lmt/wh-ui-library';
import { CONDITION_BASED_CONSTANTS } from '../condition_based/ConditionBased.constants';

function OtherStepAssignees(props) {
  const { t } = useTranslation();
  const {
    data,
    flow_data,
    assigneeErrorList = {},
    onAssigneeDataChange,
    assigneeIndex,
    isRecursiveCall,
    recursiveIndex,
    parentAssigneeIndex,
  } = props;

  const {
    CHILD_RULE_ASSIGNEES,
    RULES,
    STEP_ASSIGNEES,
  } = CONDITION_BASED_CONSTANTS;

  const flowData = cloneDeep(flow_data);
  const {
    OTHER_STEP_ASSIGNEE: { CHOOSE_STEP },
  } = FLOW_STRINGS.STEPS.STEP.BASIC_INFO_AND_ACTORS.ACTORS;

  const errorMessage = isRecursiveCall ? get(assigneeErrorList, [`${STEP_ASSIGNEES},${parentAssigneeIndex},${RULES},${recursiveIndex},${CHILD_RULE_ASSIGNEES},${assigneeIndex},${CHOOSE_STEP.ID}`]) : get(assigneeErrorList, [`${STEP_ASSIGNEES},${assigneeIndex},${CHOOSE_STEP.ID}`]);

  const getPreviousStepsOptionList = () => {
    const { steps } = flowData;
    const prevSteps = [];
    steps.map((step) => {
      if ((step._id !== data._id) && step.step_type === STEP_TYPE.USER_STEP) {
        prevSteps.push({
          label: step.step_name,
          value: step.step_uuid,
          _id: step.step_uuid,
        });
      }
      return null;
    });
    return prevSteps;
  };

  const [updatedSelectedValue, setUpdatedSelectedValue] = useState([]);
  const updateSelectedValueHandler = (
    selectedValue,
    getFormFieldDropdownData,
  ) => {
    const updatedList = [];
    !isEmpty(selectedValue) &&
      selectedValue.map((value) => {
        getFormFieldDropdownData.forEach((fieldData) => {
          if (fieldData.value === value) {
            updatedList.push(fieldData);
          }
        });
        return getFormFieldDropdownData;
      });
    return updatedList;
  };
  useEffect(() => {
    const clonedData = cloneDeep(data);
    const updatedAssigneeData = clonedData.step_assignees[assigneeIndex];
    if (updatedAssigneeData.other_step_uuids) {
      setUpdatedSelectedValue(
        updateSelectedValueHandler(
          updatedAssigneeData.other_step_uuids,
          getPreviousStepsOptionList(),
        ),
      );
    }
  }, []);

  const onChooseStepDropdownChangeHandler = (value, label) => {
    const clonedData = cloneDeep(data);
    if (clonedData.step_assignees) {
      const updatedAssigneeData = cloneDeep(clonedData.step_assignees[assigneeIndex]);
      const selectedFields = cloneDeep(updatedSelectedValue || []);
      if (!isEmpty(updatedAssigneeData.other_step_uuids)) {
        const fieldIndex = updatedAssigneeData.other_step_uuids?.findIndex((_id) => _id === value);
        if (fieldIndex > -1) {
          updatedAssigneeData.other_step_uuids.splice(fieldIndex, 1);
          const selectedValueIndex = selectedFields?.findIndex((step) => step.value === value);
          if (selectedValueIndex > -1) {
            selectedFields.splice(selectedValueIndex, 1);
          }
        } else {
          selectedFields.push({ value, label });
          updatedAssigneeData.other_step_uuids.push(value);
        }
      } else {
        selectedFields.push({ value, label });
        updatedAssigneeData.other_step_uuids = [value];
      }
      setUpdatedSelectedValue(selectedFields);
      clonedData.step_assignees[assigneeIndex] = updatedAssigneeData;
    }
    onAssigneeDataChange(clonedData, assigneeIndex);
  };
  return (
    <MultiDropdown
      id={CHOOSE_STEP.ID}
      optionList={getPreviousStepsOptionList()}
      selectedListValue={updatedSelectedValue.map((u) => u.value)}
      onClick={onChooseStepDropdownChangeHandler}
      dropdownViewProps={{
        selectedLabel: updatedSelectedValue.map((u) => u.label).join(', '),
        errorMessage: errorMessage,
        placeholder: t(CHOOSE_STEP.PLACEHOLDER),
        size: Size.md,
      }}
      noDataFoundMessage={NO_DATA_FOUND_TEXT}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    flow_data: state.EditFlowReducer.flowData,
  };
};

export default connect(mapStateToProps)(OtherStepAssignees);
