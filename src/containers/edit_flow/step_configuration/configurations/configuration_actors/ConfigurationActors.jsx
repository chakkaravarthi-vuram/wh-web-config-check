import React, { useEffect, useState } from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { validate } from 'utils/UtilityFunctions';
import {
  find,
  cloneDeep,
  isEmpty,
  set,
  get,
  remove,
  isNull,
  isUndefined,
} from 'utils/jsUtility';
import { getAllFieldsByFilter } from 'redux/actions/EditFlow.Action';
import { FIELD_LIST_TYPE, FIELD_TYPE } from 'utils/constants/form.constant';
import { flowSetStepData } from 'redux/reducer/EditFlowReducer';
import { STEP_TYPE } from 'utils/Constants';
import { NO_DATA_FOUND_TEXT } from 'utils/strings/CommonStrings';
import { MultiDropdown, Size, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import {
  getSelectedRecipientByType,
  getFormFieldDropdownData,
  updateRecipientListByType,
} from '../Configuration.utils';
import {
  RECIPIENT_TYPE_LOOKUP,
  RECIPIENT_TYPE,
  CONFIGURATION_TYPE_ID,
  RECIPIENT_FIELD_CONTENT,
} from '../Configuration.strings';
import { recipientsArraySchema } from '../../StepConfiguration.validations';
import UserPicker from '../../../../../components/user_picker/UserPicker';
import gClasses from '../../../../../scss/Typography.module.scss';
import { updateFlowStateChange } from '../../../../../redux/reducer/EditFlowReducer';
import { FLOW_STRINGS } from '../../../EditFlow.strings';
import { VALIDATION_CONSTANT } from '../../../../../utils/constants/validation.constant';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { getInactiveAssigneesList } from '../../StepConfiguration.utils';

function ConfigurationActors(props) {
  const { t } = useTranslation();
  const {
    configurationTypeId,
    recipientType,
    stepData,
    stepData: {
      _id,
      active_email_action = {},
      active_escalation = {},
    },
    allUserTeamFields,
    allEmailFields,
    flow_id,
    onFlowStateChange,
    onGetAllFieldsByFilter,
    recipientErrorList = {},
    recipientTypeIndex,
  } = props;
  let recipientErrorIndex = `recipients,${recipientTypeIndex}`;
  useEffect(() => {
    if (
      [
        RECIPIENT_TYPE.FORM_FIELD_RECIPIENT,
        RECIPIENT_TYPE.FORM_REPORTING_MANAGER_RECIPIENT,
        RECIPIENT_TYPE.EMAIL_FORM_FIELD_RECIPIENT,
      ].includes(recipientType)
    ) {
      const allowedFieldType =
        recipientType === RECIPIENT_TYPE.EMAIL_FORM_FIELD_RECIPIENT
          ? [FIELD_TYPE.EMAIL]
          : [FIELD_TYPE.USER_TEAM_PICKER];
      const params = {
        page: 1,
        size: 200,
        sort_by: 1,
        flow_id,
        // step_order: stepData.step_order, // for api data
        field_list_type: FIELD_LIST_TYPE.DIRECT,
        allowed_field_types: allowedFieldType,
        include_property_picker: 1,
      };
      onGetAllFieldsByFilter(params, '', allowedFieldType[0]);
    }
  }, [onGetAllFieldsByFilter, flow_id, stepData._id, recipientType]);
  let recipients = [];
  let active_action = {};
  const [, setSelectedEmailToUserOrTeam] =
    useState(null);
  let fieldList = [];
  if (recipientType === RECIPIENT_TYPE.EMAIL_FORM_FIELD_RECIPIENT) {
    fieldList = allEmailFields;
  } else if (
    [
      RECIPIENT_TYPE.FORM_FIELD_RECIPIENT,
      RECIPIENT_TYPE.FORM_REPORTING_MANAGER_RECIPIENT,
    ].includes(recipientType)
  ) {
    fieldList = allUserTeamFields;
  }

  // set Initial Error list and active recipients based on type
  if (configurationTypeId === CONFIGURATION_TYPE_ID.SEND_EMAIL) {
    recipients = get(stepData, ['active_email_action', 'recipients'], []);
    active_action = active_email_action;
  } else if (configurationTypeId === CONFIGURATION_TYPE_ID.SEND_ESCALATION) {
    recipients = get(stepData, ['active_escalation', 'escalation_recipients'], []);
    active_action = active_escalation;
    recipientErrorIndex = `escalation_recipients,${recipientTypeIndex}`;
  }

  let component = null;

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

  const selectedValue = getSelectedRecipientByType(
    recipientType,
    active_action,
    configurationTypeId,
  );
  const [updatedselectedValue, setUpdatedSelectedValue] = useState([]);
  const [externalEmail, setExternalEmail] = useState(selectedValue);
  useEffect(() => {
    if (recipientType === RECIPIENT_TYPE.EXTERNAL_RECIPIENT) {
      setExternalEmail(selectedValue);
    }
  }, [selectedValue]);

  // gets all previous step
  const getPreviousStepsOptionList = () => {
    const {
      flowData: { steps },
    } = props;
    const prevSteps = [];
    steps.map((step) => {
      if (step._id !== _id && step.step_type === STEP_TYPE.USER_STEP) {
        prevSteps.push({
          label: step.step_name,
          value: step.step_uuid,
          _id: step._id,
        });
      }
      return null;
    });
    return prevSteps;
  };

  const onExternalEmailChangeHandler = (event) => {
    const { value } = event.target;
    setExternalEmail(value);
  };

  const recipientErrorUpdate = (errorList, recipients, index) => {
    const key = 'recipients';
    let isErrorInRecipients = false;
    Object.keys(errorList).forEach((errorKey) => {
      if (errorKey.includes(`recipients,${index}`)) {
        if (!isErrorInRecipients) isErrorInRecipients = true;
        delete errorList[errorKey];
      } else if (errorKey === 'recipients') {
        delete errorList[errorKey];
      }
    });

    if (isErrorInRecipients) {
      const recipientErrors = validate({ [key]: recipients }, constructJoiObject({ [key]: recipientsArraySchema(t) }));
      const directRecipientIndex = recipients.findIndex(({ recipients_type }) => recipients_type === RECIPIENT_TYPE.DIRECT_RECIPIENT);
      if ((directRecipientIndex > -1) && recipients[directRecipientIndex]?.to_recipients) {
        const inactiveAssigneeList = getInactiveAssigneesList(recipients[directRecipientIndex].to_recipients);
        if (!isEmpty(inactiveAssigneeList)) {
          set(errorList, [`recipients,${directRecipientIndex},to_recipients`], `${t(VALIDATION_CONSTANT.STEP_ACTOR_INVALID)}: ${inactiveAssigneeList.join(', ')}`);
        }
      }
      return { ...errorList, ...recipientErrors };
    }
    return errorList;
  };

  const updateRecipients = (event, isRemove, removableId) => {
    const { value } = event.target;
    const activeStepDetails = cloneDeep(stepData);
    if (recipientType === RECIPIENT_TYPE.DIRECT_RECIPIENT) {
      setSelectedEmailToUserOrTeam(value);
    }
    const updatedRecipients = updateRecipientListByType(
      recipientType,
      value,
      recipients,
      isRemove,
      removableId,
    );
    const errorList = recipientErrorUpdate(recipientErrorList, updatedRecipients, recipientTypeIndex);
    if (configurationTypeId === CONFIGURATION_TYPE_ID.SEND_EMAIL) {
      activeStepDetails.email_action_error_list = errorList || [];
      activeStepDetails.active_email_action.recipients = updatedRecipients;
    } else {
      activeStepDetails.escalation_error_list = errorList || [];
      activeStepDetails.active_escalation.escalation_recipients = updatedRecipients;
    }
    onFlowStateChange({ activeStepDetails });
  };

  useEffect(() => {
    if (
      recipientType === 'other_step_recipient' ||
      recipientType === 'initiator_reporting_manager_recipient' ||
      recipientType === 'form_field_recipient' ||
      recipientType === 'form_reporting_manager_recipient' ||
      recipientType === 'email_form_field_recipient'
    ) {
      if (!isEmpty(getFormFieldDropdownData(fieldList))) {
        const updatedRecipients = updateSelectedValueHandler(
          selectedValue,
          getFormFieldDropdownData(fieldList),
        );
        if (!isEmpty(updatedRecipients)) {
          setUpdatedSelectedValue(updatedRecipients);
        }
      }
      if (!isEmpty(getPreviousStepsOptionList(fieldList))) {
        const updatedRecipients = updateSelectedValueHandler(
          selectedValue,
          getPreviousStepsOptionList(),
        );
        if (!isEmpty(updatedRecipients)) {
          setUpdatedSelectedValue(updatedRecipients);
        }
      }
      if (isNull(selectedValue) || isUndefined(selectedValue)) {
        setUpdatedSelectedValue([]);
      }
    }
  }, [selectedValue]);

  const onAddRecipientsHandler = (event) => {
    const updatedRecipientsList = [...updatedselectedValue, event.target.value];
    setUpdatedSelectedValue(updatedRecipientsList);
    updateRecipients(event);
  };

  const onRemoveRecipientsHandler = (id) => {
    const updatedRecipientsList = updatedselectedValue;
    if (find(updatedRecipientsList, { value: id })) {
      remove(updatedRecipientsList, { value: id });
    }
    const removedFormFields = [];
    updatedRecipientsList.forEach((data) => {
      removedFormFields.push(data);
    });
    setUpdatedSelectedValue(removedFormFields);
  };

  const selectedUsersAndTeams = () => {
    const usersAndTeamsArray = { users: [], teams: [] };
    selectedValue.map((u) => {
      if (u.is_user || u.username) {
        usersAndTeamsArray?.users?.push(u);
      } else if (u.team_name) {
        usersAndTeamsArray?.teams?.push(u);
      }
      return null;
    });
    return usersAndTeamsArray;
  };

  switch (recipientType) {
    case RECIPIENT_TYPE.DIRECT_RECIPIENT:
      component = (
        <UserPicker
          id="users"
          selectedValue={selectedUsersAndTeams()}
          errorMessage={recipientErrorList?.[`${recipientErrorIndex},to_recipients`]}
          isSearchable
          hideLabel
          className={gClasses.MT3}
          onSelect={(option) =>
            updateRecipients({ target: { value: option } })
          }
          onRemove={(id) =>
            updateRecipients({ target: { value: null } }, true, id)
          }
          noDataFoundMessage={t(FLOW_STRINGS.NO_USER_OR_TEAN_FOUND)}
        />
      );
      break;
    case RECIPIENT_TYPE.OTHER_STEP_RECIPIENT:
    case RECIPIENT_TYPE.INITIATOR_REPORTING_MANAGER_RECIPIENT:
      component = (
        <MultiDropdown
          id={recipientType}
          optionList={getPreviousStepsOptionList()}
          selectedListValue={updatedselectedValue?.map((u) => u.value)}
          onClick={(value, label, id) => {
            if (find(updatedselectedValue, { value })) {
              onRemoveRecipientsHandler(value);
              updateRecipients({ target: { value: null } }, true, value);
            } else onAddRecipientsHandler({ target: { value: { value, label, id } } });
          }}
          dropdownViewProps={{
            selectedLabel: updatedselectedValue.map((u) => u.label).join(', '),
            errorMessage: recipientErrorList?.[`${recipientErrorIndex},to_recipients_other_steps`],
            placeholder: RECIPIENT_FIELD_CONTENT[recipientType].PLACEHOLDER,
            size: Size.md,
          }}
          noDataFoundMessage={NO_DATA_FOUND_TEXT}
        />
      );
      break;
    case RECIPIENT_TYPE.FORM_FIELD_RECIPIENT:
    case RECIPIENT_TYPE.FORM_REPORTING_MANAGER_RECIPIENT:
    case RECIPIENT_TYPE.EMAIL_FORM_FIELD_RECIPIENT:
      component = (
        <MultiDropdown
          id={recipientType}
          optionList={getFormFieldDropdownData(fieldList)}
          selectedListValue={updatedselectedValue.map((u) => u.value)}
          onClick={(value, label, id) => {
            if (find(updatedselectedValue, { value })) {
              onRemoveRecipientsHandler(value);
              updateRecipients({ target: { value: null } }, true, value);
            } else onAddRecipientsHandler({ target: { value: { value, label, id } } });
          }}
          dropdownViewProps={{
            selectedLabel: updatedselectedValue.map((u) => u.label).join(', '),
            errorMessage: recipientErrorList?.[`${recipientErrorIndex},to_recipients_field_uuids`],
            placeholder: RECIPIENT_FIELD_CONTENT[recipientType].PLACEHOLDER,
            size: Size.md,
          }}
          noDataFoundMessage={NO_DATA_FOUND_TEXT}
        />
      );
      break;
    case RECIPIENT_TYPE.EXTERNAL_RECIPIENT:
      component = (
        <TextInput
          id={recipientType}
          errorMessage={recipientErrorList?.[`${recipientErrorIndex},external_recipient`]}
          size={Size.md}
          value={externalEmail}
          onChange={onExternalEmailChangeHandler}
          onBlurHandler={updateRecipients}
          placeholder={RECIPIENT_FIELD_CONTENT[recipientType].PLACEHOLDER}
          hideMessage={!recipientErrorList?.[`${recipientErrorIndex},external_recipient`]}
        />
      );
      break;
    default:
      break;
  }

  return component;
}

const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
    flow_id: state.EditFlowReducer.flowData.flow_id,
    allUserTeamFields:
      state.EditFlowReducer.flowData.allUserTeamFields,
    allEmailFields: state.EditFlowReducer.flowData.allEmailFields,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setFlowStepData: (...params) => {
      dispatch(flowSetStepData(...params));
    },
    onGetAllFieldsByFilter: (...params) => {
      dispatch(getAllFieldsByFilter(...params));
    },
    onFlowStateChange: (flowData) => {
      dispatch(updateFlowStateChange(flowData));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfigurationActors);

ConfigurationActors.defaultProps = {
  recipientType: null,
  onFlowDataChange: null,
  configurationTypeId: null,
};
ConfigurationActors.propTypes = {
  recipientType: PropType.oneOf(RECIPIENT_TYPE_LOOKUP),
  onFlowDataChange: PropType.func,
  configurationTypeId: PropType.number,
};
