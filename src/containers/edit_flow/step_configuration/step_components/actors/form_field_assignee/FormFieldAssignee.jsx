import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getAllFieldsByFilter } from 'redux/actions/EditFlow.Action';
import { FIELD_LIST_TYPE, FIELD_TYPE } from 'utils/constants/form.constant';
import {
  get,
  isEmpty,
  cloneDeep,
} from 'utils/jsUtility';
import { FLOW_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { NO_DATA_FOUND_TEXT } from 'utils/strings/CommonStrings';
import { MultiDropdown, Size } from '@workhall-pvt-lmt/wh-ui-library';
import { getFormFieldAssigneeDropdownData } from './FormFieldAssignee.utils';
import { CONDITION_BASED_CONSTANTS } from '../condition_based/ConditionBased.constants';

function FormFieldAssignee(props) {
  const { t } = useTranslation();
  const {
    data,
    lstAllUserFields,
    onGetAllFieldsByFilter,
    assigneeIndex,
    assigneeErrorList = {},
    onAssigneeDataChange,
    parentId,
    isRecursiveCall,
    recursiveIndex,
    parentAssigneeIndex,
  } = props;
  const {
    FORM_FIELD_ASSIGNEE: { CHOOSE_FIELD },
  } = FLOW_STRINGS.STEPS.STEP.BASIC_INFO_AND_ACTORS.ACTORS;

  const {
    CHILD_RULE_ASSIGNEES,
    RULES,
    STEP_ASSIGNEES,
  } = CONDITION_BASED_CONSTANTS;

  const errorMessage = isRecursiveCall ? get(assigneeErrorList, [`${STEP_ASSIGNEES},${parentAssigneeIndex},${RULES},${recursiveIndex},${CHILD_RULE_ASSIGNEES},${assigneeIndex},${CHOOSE_FIELD.ID}`]) : get(assigneeErrorList, [`${STEP_ASSIGNEES},${assigneeIndex},${CHOOSE_FIELD.ID}`]);

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
    if (updatedAssigneeData.assignee_field_uuids) {
      setUpdatedSelectedValue(
        updateSelectedValueHandler(
          updatedAssigneeData.assignee_field_uuids,
          getFormFieldAssigneeDropdownData(lstAllUserFields),
        ),
      );
    }
  }, [lstAllUserFields]);

  useEffect(() => {
    const params = {
      page: 1,
      size: 200,
      sort_by: 1,
      flow_id: parentId,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      allowed_field_types: [FIELD_TYPE.USER_TEAM_PICKER],
      include_property_picker: 1,
    };
    onGetAllFieldsByFilter(params, '', FIELD_TYPE.USER_TEAM_PICKER);
  }, [onGetAllFieldsByFilter, parentId]);

  const onChooseAssigneeFormFieldChangeHandler = (value, label) => {
    const clonedData = cloneDeep(data);
    if (clonedData.step_assignees) {
      const updatedAssigneeData = cloneDeep(clonedData.step_assignees[assigneeIndex]);
      const selectedFields = cloneDeep(updatedSelectedValue || []);
      if (!isEmpty(updatedAssigneeData.assignee_field_uuids)) {
        const fieldIndex = updatedAssigneeData.assignee_field_uuids?.findIndex((_id) => _id === value);
        if (fieldIndex > -1) {
          updatedAssigneeData.assignee_field_uuids.splice(fieldIndex, 1);
          const selectedValueIndex = selectedFields?.findIndex((field) => field.value === value);
          if (selectedValueIndex > -1) {
            selectedFields.splice(selectedValueIndex, 1);
          }
        } else {
          selectedFields.push({ value, label });
          updatedAssigneeData.assignee_field_uuids.push(value);
        }
      } else {
        selectedFields.push({ value, label });
        updatedAssigneeData.assignee_field_uuids = [value];
      }
      setUpdatedSelectedValue(selectedFields);
      clonedData.step_assignees[assigneeIndex] = updatedAssigneeData;
    }
    onAssigneeDataChange(clonedData, assigneeIndex);
  };

  return (
    <MultiDropdown
      id={CHOOSE_FIELD.ID}
      optionList={getFormFieldAssigneeDropdownData(lstAllUserFields)}
      selectedListValue={updatedSelectedValue.map((u) => u.value)}
      onClick={onChooseAssigneeFormFieldChangeHandler}
      dropdownViewProps={{
        selectedLabel: updatedSelectedValue.map((u) => u.label).join(', '),
        errorMessage: errorMessage,
        placeholder: t(CHOOSE_FIELD.PLACEHOLDER),
        size: Size.md,
      }}
      noDataFoundMessage={NO_DATA_FOUND_TEXT}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    lstAllUserFields: state.EditFlowReducer.flowData.allUserTeamFields,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetAllFieldsByFilter: (...params) => {
      dispatch(getAllFieldsByFilter(...params));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFieldAssignee);
