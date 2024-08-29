import {
  isEmpty,
  get,
  isArray,
  compact,
  find,
  findIndex,
  union,
  cloneDeep,
  join,
  nullCheck,
  isNull,
  has,
  unset,
  set,
  pick,
} from 'utils/jsUtility';
import { FIELD_MAPPING_ERRORS } from 'components/flow_trigger_configuration/field_mapping/FieldMapping.constants';
import { FIELD_TYPE_CATEGORY, FLOW_CONFIG_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import {
  RECIPIENT_TYPE,
  CONFIG_FIELD_KEY,
  DUE_DATE_AND_STATUS,
  CONFIGURATION_TYPE_ID,
  VALIDATION_STRINGS,
  SEND_DATALIST_DROPDOWN_TYPES,
  EMAIL_ESCALATION_STRING,
} from './Configuration.strings';
import {
  computeUsersOrTeamsForEmail,
  removeUsersOrTeamsForEmail,
} from './send_email/SendEmail.utils';
import { constructDynamicMailContentMessage, constructStaticValues, getFieldType, getStaticValue } from '../StepConfiguration.utils';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../../../utils/constants/form.constant';
import { DATA_TO_DL_OPERANDS_LIST, ENTRY_ACTION_TYPE, SEND_DATA_TO_DATALIST, SEND_DATA_TO_DL_OPERANDS, SYSTEM_FIELDS_FOR_FLOW_DL_MAPPING, getValueTypeOptions } from './Configuration.constants';
import { getFieldLabelWithRefName } from '../../../../utils/UtilityFunctions';
import { formatValidationData } from '../../../../utils/formUtils';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { EMAIL_RECIPIENT_TYPE, ESCALATION_RECIPIENT_OBJECT_KEYS } from '../node_configurations/send_email/SendEmailConfig.constants';
import { stepAssigneesPostData } from '../../node_configuration/NodeConfiguration.utils';
import { SEND_DATA_TO_DL_CONFIG_CONSTANTS } from '../node_configurations/send_data_to_datalist/SendDataToDl.string';

const { TYPE_MISMATCH_TEXT } = FIELD_MAPPING_ERRORS;
const { EXTERNAL_LABEL } = FLOW_CONFIG_STRINGS;

const RECIPIENT_STRING = {
  EMAIL_FORM_FIELD_RECIPIENT: 'Email form field recipients',
  FORM_REPORTING_MANAGER_RECIPIENT: 'Reporting manager of user picker field',
  INITIATOR_REPORTING_MANAGER_RECIPIENT:
    'Reporting manager of previous step completed user',
  OTHER_STEP_RECIPIENT: 'Other step actor',
  FORM_FIELD_RECIPIENT: 'User form field recipients',
  CURRENT_STEP_FINISHER: 'Current Step Finisher',
  CURRENT_STEP_ASSIGNEE: 'Current Step Assignee(s)',
  SAME_STEP_REPORTING_MANAGER: 'Reporting manager of current task assignee',
  SYSTEM_FIELD_RECIPIENT: 'System field recipients',
  RULE_BASED_RECIPIENT: 'Rule based recipients',
};

export const getDirectRecipient = (recipientObj) => {
  if (isEmpty(get(recipientObj, [CONFIG_FIELD_KEY.TO_RECIPIENTS], {}))) {
    return null;
  }

  const recipients = [];
  const users = get(
    recipientObj,
    [CONFIG_FIELD_KEY.TO_RECIPIENTS, 'users'],
    [],
  );
  const teams = get(
    recipientObj,
    [CONFIG_FIELD_KEY.TO_RECIPIENTS, 'teams'],
    [],
  );

  !isEmpty(users) &&
    users.forEach((user) => recipients.push(user));
  !isEmpty(teams) &&
    teams.forEach((team) => recipients.push(team));

  return compact(recipients);
};

export const getDueDateString = (due_data = {}) => {
  const { duration_type } = due_data;
  if (
    !Number.isNaN(due_data.duration) &&
    due_data.duration &&
    !isEmpty(duration_type)
  ) {
    return `${due_data.duration} ${duration_type
      .charAt(0)
      .toUpperCase()}${duration_type.slice(1)}`;
  }
  return ' ';
};

export const getActionAndRecipient = (
  action,
  configurationTypeId,
  activeActionList = [],
) => {
  console.log('getActionAndRecipient_action', action, 'configurationTypeId', configurationTypeId, 'activeActionList', activeActionList);
    let recipientsData = [];
  let actionTypeOrDueDate = [];
  let actionTypeArray = [];
  if (configurationTypeId === CONFIGURATION_TYPE_ID.SEND_EMAIL) {
    recipientsData = get(action, ['recipients'], []);
    actionTypeArray = activeActionList.filter(({ value }) =>
      get(action, ['action_uuid'], []).includes(value),
    );
    actionTypeArray.forEach(({ label }) => actionTypeOrDueDate.push(label));
    console.log('recipientsData_sendEmail', recipientsData, 'actionTypeOrDueDate', actionTypeOrDueDate);
  } else if (configurationTypeId === CONFIGURATION_TYPE_ID.SEND_ESCALATION) {
    recipientsData = get(action, ['escalation_recipients'], []);
    actionTypeOrDueDate = [
      getDueDateString(get(action, ['escalation_due'], [])),
    ];
  } else if (
    configurationTypeId === CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST
  ) {
    recipientsData = get(action, ['recipients'], []);
    actionTypeArray = activeActionList.filter(({ value }) =>
      get(action, ['action_uuid'], []).includes(value),
    );
    actionTypeArray.forEach(({ label }) => actionTypeOrDueDate.push(label));
  } else if (
    configurationTypeId === CONFIGURATION_TYPE_ID.DOCUMENT_GENERATION
  ) {
    actionTypeArray = activeActionList.filter(({ value }) =>
      get(action, ['action_uuid'], []).includes(value),
    );
    actionTypeArray.forEach(({ label }) => actionTypeOrDueDate.push(label));
    }

  if (
    isEmpty(action) &&
    isEmpty(recipientsData) &&
    isEmpty(actionTypeOrDueDate)
  ) {
    return [[], []];
  }

  const recipientList = recipientsData;
  const recipients = [];
  const actions = actionTypeOrDueDate;
  console.log('recipientsList_', recipientList, 'actions', actions, 'currentAction', action);
  recipientList.forEach((recipientObj) => {
    switch (recipientObj.recipients_type) {
      case EMAIL_RECIPIENT_TYPE.USERS_OR_TEAMS:
        const directRecipients = (recipientObj?.direct_recipients);
        console.log('recipientsList_obj', recipientObj, 'currentAction', action, 'directRecipients', directRecipients);
        !isEmpty(directRecipients) &&
          recipients.push(...directRecipients?.users || [], ...directRecipients?.teams || []);
        break;
      case EMAIL_RECIPIENT_TYPE.EMAIL_ADDRESS:
        const externalRecipients = get(
          recipientObj,
          [CONFIG_FIELD_KEY.EXTERNAL_RECIPIENT],
          [],
        );
        !isEmpty(externalRecipients) &&
          isArray(externalRecipients) &&
          recipients.push(...externalRecipients);
        break;
      case RECIPIENT_TYPE.EMAIL_FORM_FIELD_RECIPIENT:
        recipients.push(RECIPIENT_STRING.EMAIL_FORM_FIELD_RECIPIENT);
        break;
      case RECIPIENT_TYPE.FORM_REPORTING_MANAGER_RECIPIENT:
        recipients.push(RECIPIENT_STRING.FORM_REPORTING_MANAGER_RECIPIENT);
        break;
      case RECIPIENT_TYPE.INITIATOR_REPORTING_MANAGER_RECIPIENT:
        recipients.push(RECIPIENT_STRING.INITIATOR_REPORTING_MANAGER_RECIPIENT);
        break;
      case EMAIL_RECIPIENT_TYPE.FORM_FIELDS:
        recipients.push(RECIPIENT_STRING.FORM_FIELD_RECIPIENT);
        break;
      case EMAIL_RECIPIENT_TYPE.SYSTEM_FIELDS:
        recipients.push(RECIPIENT_STRING.SYSTEM_FIELD_RECIPIENT);
        break;
      case EMAIL_RECIPIENT_TYPE.RULE:
        recipients.push(RECIPIENT_STRING.RULE_BASED_RECIPIENT);
        break;
      case RECIPIENT_TYPE.OTHER_STEP_RECIPIENT:
        recipients.push(RECIPIENT_STRING.OTHER_STEP_RECIPIENT);
        break;
      case RECIPIENT_TYPE.CURRENT_STEP_FINISHER:
        recipients.push(RECIPIENT_STRING.CURRENT_STEP_FINISHER);
        break;
      case RECIPIENT_TYPE.CURRENT_STEP_ASSIGNEE:
        recipients.push(RECIPIENT_STRING.CURRENT_STEP_ASSIGNEE);
        break;
      case RECIPIENT_TYPE.SAME_STEP_REPORTING_MANAGER:
        recipients.push(RECIPIENT_STRING.SAME_STEP_REPORTING_MANAGER);
        break;
      default:
        break;
    }
  });

  return [compact(actions), compact(recipients)];
};
export const getConfiguartionCardType = (action, configurationTypeId, t) => {
  if (configurationTypeId === CONFIGURATION_TYPE_ID.SEND_DATA_TO_DATALIST) {
    const entry_action_type = get(
      action,
      [SEND_DATA_TO_DATALIST.FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE],
      null,
    );
    if (entry_action_type) {
      const option = find(SEND_DATA_TO_DL_CONFIG_CONSTANTS(t).GENERAL.UPDATE_TYPE_OPTIONS, {
        value: entry_action_type,
      });
      return option ? option.label : t(EXTERNAL_LABEL);
    }
  }
  return t(EXTERNAL_LABEL);
};

const addRecipientsHandler = (existingRecipient = [], value) => {
  let clonedRecipient = cloneDeep(existingRecipient);
  if (!isEmpty(clonedRecipient)) {
    clonedRecipient.push(value.value);
  } else {
    const updatedrecipients = [];
    updatedrecipients.push(value.value);
    clonedRecipient = updatedrecipients;
  }
  return clonedRecipient;
};

const removeRecipientsHandler = (existingRecipient, id) => {
  const updatedrecipients = existingRecipient.filter((s) => s !== id);
  return updatedrecipients;
};

export const updateRecipientListByType = (
  recipients_type,
  value,
  recipientList,
  isRemove = false,
  id = null,
) => {
  const existingRecipient =
    find(recipientList, { recipients_type: recipients_type }) || {};
  const existingRecipientIndex = findIndex(recipientList, {
    recipients_type: recipients_type,
  });
  let updatedRecipient = existingRecipient;
  const updatedList = cloneDeep(recipientList) || [];
  switch (recipients_type) {
    case RECIPIENT_TYPE.DIRECT_RECIPIENT:
      updatedRecipient = {
        recipients_type: recipients_type,
        to_recipients: isRemove
          ? removeUsersOrTeamsForEmail(
            existingRecipient.to_recipients || {},
            id,
          )
          : computeUsersOrTeamsForEmail(
            existingRecipient.to_recipients || {},
            value,
          ),
      };
      console.log('updatedRecipientlis2232', updatedRecipient?.to_recipients);
      break;
    case RECIPIENT_TYPE.RULE_RECIPIENT:
      updatedRecipient = {
        recipients_type: recipients_type,
        to_recipients_rule: value, // ruleId
      };
      break;
    case RECIPIENT_TYPE.OTHER_STEP_RECIPIENT:
    case RECIPIENT_TYPE.CURRENT_STEP_FINISHER:
    case RECIPIENT_TYPE.CURRENT_STEP_ASSIGNEE:
    case RECIPIENT_TYPE.SAME_STEP_REPORTING_MANAGER:
    case RECIPIENT_TYPE.INITIATOR_REPORTING_MANAGER_RECIPIENT:
      updatedRecipient = {
        recipients_type: recipients_type,
        to_recipients_other_steps: isRemove
          ? removeRecipientsHandler(
            existingRecipient.to_recipients_other_steps,
            id,
          )
          : addRecipientsHandler(
            existingRecipient.to_recipients_other_steps,
            value,
          ), // stepId
      };
      break;
    case RECIPIENT_TYPE.FORM_FIELD_RECIPIENT:
    case RECIPIENT_TYPE.FORM_REPORTING_MANAGER_RECIPIENT:
    case RECIPIENT_TYPE.EMAIL_FORM_FIELD_RECIPIENT:
      updatedRecipient = {
        recipients_type: recipients_type,
        to_recipients_field_uuids: isRemove
          ? removeRecipientsHandler(
            existingRecipient.to_recipients_field_uuids,
            id,
          )
          : addRecipientsHandler(
            existingRecipient.to_recipients_field_uuids,
            value,
          ), // fieldUuid
      };
      break;
    case RECIPIENT_TYPE.EXTERNAL_RECIPIENT:
      const splitString = value
        .split(',')
        .map((splittedValue) =>
          isEmpty(splittedValue.trim()) ? null : splittedValue.trim(),
        );
      updatedRecipient = {
        recipients_type: recipients_type,
        external_recipient: compact(splitString), // external email recipient
      };
      break;
    default:
      break;
  }

  if (existingRecipientIndex !== -1) {
    updatedList[existingRecipientIndex] = updatedRecipient;
  } else {
    updatedList.push(updatedRecipient);
  }
  return updatedList;
};

export const getUsersAndTeams = (recipientList) => {
  const emailUserAndTeams = get(
    find(recipientList, { recipients_type: RECIPIENT_TYPE.DIRECT_RECIPIENT }),
    [CONFIG_FIELD_KEY.TO_RECIPIENTS],
    {},
  );
  let usersAndTeams = [];

  if (emailUserAndTeams && emailUserAndTeams.teams) {
    usersAndTeams = union(usersAndTeams, emailUserAndTeams.teams);
  }
  if (emailUserAndTeams && emailUserAndTeams.users) {
    usersAndTeams = union(usersAndTeams, emailUserAndTeams.users);
  }
  return usersAndTeams;
};

export const getStatusOptionList = (flowData) => {
  const flow_data = cloneDeep(flowData);
  let step_statuses = get(flow_data, ['step_statuses'], []);
  if (isEmpty(step_statuses)) {
    step_statuses = [DUE_DATE_AND_STATUS.STATUS.OPTIONS[0].label];
  }
  const optionList = step_statuses.map((step_status) => {
    return {
      label: step_status,
      value: step_status,
    };
  });
  return optionList;
};

export const getEmptyRecipientObjectByType = (recipientType) => {
  let recipient = { recipients_type: recipientType };
  switch (recipientType) {
    case RECIPIENT_TYPE.DIRECT_RECIPIENT:
      recipient[CONFIG_FIELD_KEY.TO_RECIPIENTS] = {};
      break;
    case RECIPIENT_TYPE.EXTERNAL_RECIPIENT:
      recipient[CONFIG_FIELD_KEY.EXTERNAL_RECIPIENT] = [];
      break;
    case RECIPIENT_TYPE.FORM_FIELD_RECIPIENT:
    case RECIPIENT_TYPE.FORM_REPORTING_MANAGER_RECIPIENT:
    case RECIPIENT_TYPE.EMAIL_FORM_FIELD_RECIPIENT:
      recipient[CONFIG_FIELD_KEY.TO_RECIPIENTS_FIELD_UUID] = null;
      break;
    case RECIPIENT_TYPE.OTHER_STEP_RECIPIENT:
    case RECIPIENT_TYPE.CURRENT_STEP_FINISHER:
      break;
    case RECIPIENT_TYPE.CURRENT_STEP_ASSIGNEE:
    case RECIPIENT_TYPE.SAME_STEP_REPORTING_MANAGER:
      break;
    case RECIPIENT_TYPE.INITIATOR_REPORTING_MANAGER_RECIPIENT:
      recipient[CONFIG_FIELD_KEY.TO_RECIPIENTS_OTHER_STEP_ID] = null;
      break;
    case RECIPIENT_TYPE.RULE_RECIPIENT:
      recipient[CONFIG_FIELD_KEY.TO_RECIPIENTS_RULE] = null;
      break;
    default:
      recipient = {};
      break;
  }
  return recipient;
};

export const getSelectedRecipientByType = (
  recipient_type,
  active_action = {},
  configurationTypeId,
) => {
  let allRecipients = [];

  if (configurationTypeId === CONFIGURATION_TYPE_ID.SEND_EMAIL) {
    allRecipients = active_action.recipients;
  } else if (configurationTypeId === CONFIGURATION_TYPE_ID.SEND_ESCALATION) {
    allRecipients = active_action.escalation_recipients;
  }

  const recipient = find(allRecipients, { recipients_type: recipient_type });
  if (recipient && !isEmpty(recipient) && recipient.recipients_type) {
    switch (recipient.recipients_type) {
      case RECIPIENT_TYPE.DIRECT_RECIPIENT:
        return getUsersAndTeams(allRecipients || {});
      case RECIPIENT_TYPE.OTHER_STEP_RECIPIENT:
      case RECIPIENT_TYPE.CURRENT_STEP_FINISHER:
      case RECIPIENT_TYPE.CURRENT_STEP_ASSIGNEE:
      case RECIPIENT_TYPE.SAME_STEP_REPORTING_MANAGER:
      case RECIPIENT_TYPE.INITIATOR_REPORTING_MANAGER_RECIPIENT:
        return recipient[CONFIG_FIELD_KEY.TO_RECIPIENTS_OTHER_STEP_ID];
      case RECIPIENT_TYPE.EMAIL_FORM_FIELD_RECIPIENT:
      case RECIPIENT_TYPE.FORM_FIELD_RECIPIENT:
      case RECIPIENT_TYPE.FORM_REPORTING_MANAGER_RECIPIENT:
      case CONFIG_FIELD_KEY.TO_RECIPIENTS_FIELD_UUID:
        return recipient[CONFIG_FIELD_KEY.TO_RECIPIENTS_FIELD_UUID];
      case RECIPIENT_TYPE.EXTERNAL_RECIPIENT:
        const externalMails =
          recipient[CONFIG_FIELD_KEY.EXTERNAL_RECIPIENT] || [];
        return isEmpty(externalMails) ? null : join(externalMails, ', ');
      default:
        return null;
    }
  }
  return null;
};

export const getErrorMessageForDueDate = (
  error_list = {},
  is_escaltion = false,
) => {
  let due_date_error = '';
  Object.keys(error_list).forEach((errorKey) => {
    if (
      is_escaltion
        ? errorKey.includes('escalation_due') || errorKey.includes('duration')
        : errorKey.includes('due_data')
    ) {
      if (error_list[errorKey] && error_list[errorKey].includes('an integer')) {
        due_date_error = (error_list[errorKey] || '').replace(
          'an integer',
          'a whole number',
        );
      } else due_date_error = error_list[errorKey];
    }
  });
  return due_date_error;
};
export const constructInvalidEmailMessage = (initialErrorList, recipients, t) => {
  let error = '';
  let invalidEmailPosition = [];
  const externalRecipients = get(
    find(recipients, { recipients_type: CONFIG_FIELD_KEY.EXTERNAL_RECIPIENT }),
    [CONFIG_FIELD_KEY.EXTERNAL_RECIPIENT],
    [],
  );
  !isEmpty(initialErrorList) &&
    Object.keys(initialErrorList).forEach((key) => {
      if (key.includes(CONFIG_FIELD_KEY.EXTERNAL_RECIPIENT)) {
        error = initialErrorList[key];
        if (error.includes('does not contain 1 required value')) {
          error = t(FLOW_CONFIG_STRINGS.ERRORS.EMAIL_IS_REQUIRED);
        } else if (error.includes('Invalid')) {
          const splittedKey = key.split(',');
          const index = splittedKey.indexOf(
            CONFIG_FIELD_KEY.EXTERNAL_RECIPIENT,
          );
          const position = Number.isSafeInteger(+splittedKey[index + 1])
            ? +splittedKey[index + 1] + 1
            : null;
          invalidEmailPosition.push(position);
        }
      }
    });
  invalidEmailPosition = compact(invalidEmailPosition);
  if (
    (externalRecipients || []).length === (invalidEmailPosition || []).length &&
    !isEmpty(externalRecipients)
  ) {
    error = t(VALIDATION_STRINGS.INVALID_EMAIL);
  } else if (!isEmpty(invalidEmailPosition)) {
    error = `Invalid email found at position ( ${invalidEmailPosition.join(
      ', ',
    )} ) `;
  }
  return error;
};

export const getFormFieldDropdownData = (fields) => {
  if (nullCheck(fields, 'length', true)) {
    return fields.map((eachField) => {
      return {
        label: eachField.label,
        value: eachField.field_uuid,
      };
    });
  }
  return [];
};

export const INITIAL_MAPPING_DATA_FLOW_TO_DL = {
  [SEND_DATA_TO_DATALIST.FIELD_KEYS.FLOW_FIELD_UUID]: null,
  [SEND_DATA_TO_DATALIST.FIELD_KEYS.OPERATION]:
  SEND_DATA_TO_DL_OPERANDS.EQUAL_TO,
  [SEND_DATA_TO_DATALIST.FIELD_KEYS.DATA_LIST_FIELD_UUID]: null,
  [SEND_DATA_TO_DATALIST.FIELD_KEYS.VALUE_TYPE]:
    SEND_DATA_TO_DATALIST.FIELD_KEYS.DYNAMIC,
  [SEND_DATA_TO_DATALIST.FIELD_KEYS.MAPPING_TYPE]: SEND_DATA_TO_DATALIST.FIELD_KEYS.DIRECT_MAPPING_TYPE,
  [SEND_DATA_TO_DATALIST.FIELD_KEYS.MAPPING_ORDER]: 1,
  path: '0',
};

export const getInitialStateForDataToDatalist = (
  action_type = ENTRY_ACTION_TYPE.AUTO,
) => {
  switch (action_type) {
    case ENTRY_ACTION_TYPE.AUTO:
      return {
        [SEND_DATA_TO_DATALIST.FIELD_KEYS.ACTION_UUID]: null,
        [SEND_DATA_TO_DATALIST.FIELD_KEYS.DATA_LIST_UUID]: null,
        [SEND_DATA_TO_DATALIST.FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE]:
          ENTRY_ACTION_TYPE.AUTO,
        [SEND_DATA_TO_DATALIST.FIELD_KEYS.MAPPING]: [{
          ...INITIAL_MAPPING_DATA_FLOW_TO_DL,
        }],
      };
    case ENTRY_ACTION_TYPE.UPDATE:
      return {
        [SEND_DATA_TO_DATALIST.FIELD_KEYS.ACTION_UUID]: null,
        [SEND_DATA_TO_DATALIST.FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE]:
          ENTRY_ACTION_TYPE.UPDATE,
        [SEND_DATA_TO_DATALIST.FIELD_KEYS.ENTRY_ID_FROM]:
          SEND_DATA_TO_DATALIST.ENTRY_ID.FORM_FIELD,
        [SEND_DATA_TO_DATALIST.FIELD_KEYS.ENTRY_ID_FORM_VALUE]: null,
        [SEND_DATA_TO_DATALIST.FIELD_KEYS.MAPPING]: [{
          ...INITIAL_MAPPING_DATA_FLOW_TO_DL,
          [SEND_DATA_TO_DATALIST.FIELD_KEYS.OPERATION]: null,
        }],
      };
    case ENTRY_ACTION_TYPE.DELETE:
      return {
        [SEND_DATA_TO_DATALIST.FIELD_KEYS.ACTION_UUID]: null,
        [SEND_DATA_TO_DATALIST.FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE]:
          ENTRY_ACTION_TYPE.DELETE,
        [SEND_DATA_TO_DATALIST.FIELD_KEYS.ENTRY_ID_FROM]:
          SEND_DATA_TO_DATALIST.ENTRY_ID.FORM_FIELD,
        [SEND_DATA_TO_DATALIST.FIELD_KEYS.ENTRY_ID_FORM_VALUE]: null,
      };
    default:
      break;
  }
  return {};
};

export const isSelectedDatalistExistInTheOptionList = (allDataList = [], dataListUUID = null) => {
  if (isEmpty(allDataList)) return false;

  const isExist = (allDataList || []).some((eachDataList) => (eachDataList?.data_list_uuid === dataListUUID));
  return isExist;
};

export const isSystemDefinderUser = (allDataList = [], dataListUUID = null) => {
  if (isEmpty(allDataList)) return [];
  const datalist = (allDataList || []).find((eachDataList) => (eachDataList?.data_list_uuid === dataListUUID));

  if (datalist) {
    return {
      is_system_defined: datalist.is_system_defined,
      system_defined_name: datalist.system_defined_name,
    };
  } return [];
};

export const getDatalistSuggetion = (allDataList = []) => {
  let datalistOptions = [];
  const data_list = isEmpty(allDataList) ? [] : allDataList;
  datalistOptions = data_list.map((datalist) => {
    return {
      label: datalist.data_list_name,
      value: datalist.data_list_uuid,
      is_system_defined: datalist.is_system_defined,
      system_defined_name: datalist.system_defined_name,
    };
  });
  return datalistOptions;
};

export const getDataListFieldSuggestion = (
  dataListFields = [],
  mapping = [],
  selectedUUID,
) => {
  let valueToBeRemoved = [];
  let isRemovableEmpty = true;
  if (!isEmpty(mapping)) {
    valueToBeRemoved = mapping.map(
      (row) => row[SEND_DATA_TO_DATALIST.FIELD_KEYS.DATA_LIST_FIELD_UUID],
    );
    valueToBeRemoved = compact(valueToBeRemoved);
    isRemovableEmpty = isEmpty(valueToBeRemoved);
  }

  let optionList = [];
  const data_list_field = isEmpty(dataListFields) ? [] : dataListFields;
  optionList = data_list_field.map((field) => {
    if (
      !isRemovableEmpty &&
      valueToBeRemoved.includes(field.field_uuid) &&
      selectedUUID !== field.field_uuid
    ) {
      return null;
    }
    return {
      ...field,
      value: field.field_uuid,
    };
  });
  return compact(optionList);
};

export const getDataListId = (_uuid, allDataList = []) => {
  if (_uuid && !isEmpty(allDataList)) {
    const active_datalist = allDataList.find(
      (data_list) => data_list.data_list_uuid === _uuid,
    );
    return active_datalist._id;
  }
  return null;
};

export const NUMBER_FIELDS_WITH_MULTIPLE_OPERATION = [FIELD_TYPE.NUMBER, FIELD_TYPE.CURRENCY];

export const getOperation = (
  mappingObject,
  entryActionType,
  isChild = false,
  t = () => { },
) => {
  const {
    FIELD_KEYS,
  } = SEND_DATA_TO_DATALIST;
  if (entryActionType === ENTRY_ACTION_TYPE.AUTO) {
    return [DATA_TO_DL_OPERANDS_LIST(t)[DATA_TO_DL_OPERANDS_LIST(t).length - 1]];
  }
  const flowFieldType = getFieldType(get(mappingObject, [FIELD_KEYS.FLOW_FIELD], {}));
  const dataListFieldType = getFieldType(get(mappingObject, [FIELD_KEYS.DATA_LIST_FIELD], {}));
  if (
    !isChild && (
      (NUMBER_FIELDS_WITH_MULTIPLE_OPERATION.includes(flowFieldType) && isNull(dataListFieldType)) ||
      (NUMBER_FIELDS_WITH_MULTIPLE_OPERATION.includes(dataListFieldType) && isNull(flowFieldType)) ||
      (NUMBER_FIELDS_WITH_MULTIPLE_OPERATION.includes(flowFieldType) && NUMBER_FIELDS_WITH_MULTIPLE_OPERATION.includes(dataListFieldType))
    )
  ) {
    return DATA_TO_DL_OPERANDS_LIST(t);
  }
  return [DATA_TO_DL_OPERANDS_LIST(t)[DATA_TO_DL_OPERANDS_LIST(t).length - 1]];
};

export const getValueTypes = (t = () => {}, fieldType = EMPTY_STRING) => {
  if (FIELD_TYPE.TABLE === fieldType) {
    [getValueTypeOptions(t)?.[0]];
  }
  if (FIELD_TYPE.FILE_UPLOAD === fieldType) {
    const optionList = getValueTypeOptions(t);
    optionList.pop();
    return optionList;
  }
  return getValueTypeOptions(t);
};

export const getFormFieldOptionList = (fieldList, fieldType) => {
  const optionList = [];
  if (!isEmpty(fieldList)) {
    fieldList.forEach((field) => {
      if ((field.field_list_type === FIELD_LIST_TYPE.DIRECT) && (field.field_type === fieldType)) {
        optionList.push({
          label: field.label,
          value: field.field_uuid,
        });
      }
    });
  }
  return optionList;
};

export const deleteEntryActionRelatedValidation = (
  initial_error_list,
  skipFormField = false,
) => {
  const error_list = cloneDeep(initial_error_list);
  if (!isEmpty(initial_error_list)) {
    Object.keys(initial_error_list).forEach((errorKey) => {
      if (
        errorKey.includes(SEND_DATA_TO_DATALIST.FIELD_KEYS.MAPPING) ||
        (!skipFormField &&
          errorKey.includes(
            SEND_DATA_TO_DATALIST.FIELD_KEYS.ENTRY_ID_FORM_VALUE,
          ))
      ) {
        delete error_list[errorKey];
      }
    });
  }
  return error_list;
};

export const checkForJoiValidationExistence = (initial_error_list, t) => {
  let isExist = true;
  if (isEmpty(initial_error_list)) return false;
  if (!isEmpty(initial_error_list)) {
    isExist = Object.values(initial_error_list).some(
      (value) => !value.includes(t(TYPE_MISMATCH_TEXT)),
    );
    return isExist;
  }
  return isExist;
};

export const getActionsListFromUtils = (actions) => {
  const dropdownList = [];
  if (actions) {
    actions.map((actionData) => {
      dropdownList.push(actionData.action_uuid);
      return null;
    });
  }
  return dropdownList;
};

export const getActionsOptionList = (actions, stepData) => {
  const dropdownList = [];
  if (stepData?.is_subsequent_step && stepData?.step_type === 'user_step') {
    (actions || []).forEach((actionData) => {
      if (actionData?.action_type !== 'cancel') {
        dropdownList.push({
          label: actionData.action_name,
          value: actionData.action_uuid,
        });
      }
    });
  } else {
    (actions || []).forEach((actionData) => {
      dropdownList.push({
        label: actionData.action_name,
        value: actionData.action_uuid,
      });
    });
  }
  return dropdownList;
};

export const constructPostDataforRecipient = (recipients = []) => {
  const consolidatedRecipients = recipients.map((_recipient) => {
    if (_recipient.recipients_type === EMAIL_RECIPIENT_TYPE.DIRECT_RECIPIENT) {
      const recipientObj = _recipient[CONFIG_FIELD_KEY.TO_RECIPIENTS];
      const users = !isEmpty(recipientObj.users)
        ? recipientObj.users.map((user) => user._id)
        : [];
      const teams = !isEmpty(recipientObj.teams)
        ? recipientObj.teams.map((team) => team._id)
        : [];
      const consolidated = {};

      if (!isEmpty(users)) consolidated.users = users;
      if (!isEmpty(teams)) consolidated.teams = teams;
      return {
        [CONFIG_FIELD_KEY.RECIPIENTS_TYPE]: RECIPIENT_TYPE.DIRECT_RECIPIENT,
        [CONFIG_FIELD_KEY.TO_RECIPIENTS]: consolidated,
      };
    } else {
      return _recipient;
    }
  });
  return consolidatedRecipients;
};

export const getEmailEscalationPostData = (email_escalation) => {
  const constructedData = {
    // escalation_type: value.escalation_type,
    escalation_due: email_escalation.escalation_due,
    escalation_recipients: stepAssigneesPostData(
      email_escalation.escalation_recipients,
      ESCALATION_RECIPIENT_OBJECT_KEYS,
      ESCALATION_RECIPIENT_OBJECT_KEYS,
    ),
    escalation_type: EMAIL_ESCALATION_STRING.FORM_DETAILS.ESCALATION_TYPE.VALUE,
  };
  constructedData.escalation_due.duration = Number(
    constructedData.escalation_due.duration,
  );
  if (email_escalation?.escalation_uuid) {
    constructedData.escalation_uuid = email_escalation.escalation_uuid;
  }
  return constructedData;
};

const getSelectedDataFields = (fieldsList) =>
  fieldsList && fieldsList.map((field) => field.field_uuid);

export const constructPostDataforDocumentGeneration = (
  document_generation = {},
  overAllRemovedDocList,
) => {
  const data = {
    document_field_name: document_generation.document_field_name,
    template_doc_id: document_generation.template_doc_id,
    // is_condition_rule: false,
  };
  const selectedFields =
    isEmpty(document_generation.selectedFieldsList) &&
      !document_generation.selectedFieldsList
      ? document_generation.data_fields
      : compact(getSelectedDataFields(document_generation.selectedFieldsList));

  // selected form fields in the document generation editor
  if (!isEmpty(selectedFields)) {
    data.data_fields = selectedFields.filter(
      (value, index) => selectedFields.indexOf(value) === index,
    );
  }

  // document template name assigning
  if (document_generation?.document_template_field) {
    data.document_template_name_field_uuid =
      document_generation.document_template_field?.field_uuid;
  } else if (document_generation?.file_name) {
    data.file_name =
      document_generation.file_name;
  }
  // storing generated document in document field
  if (document_generation?.document_field_uuid) {
    data.document_field_uuid =
      document_generation.document_field_uuid;
  }
  // selected action uuid
  data.action_uuid = document_generation.action_uuid;
  // current document generation uuid
  if (document_generation?.document_generation_uuid) {
    data.document_generation_uuid =
      document_generation.document_generation_uuid;
  }
  // assigning all uploaded images into the editor
  if (!isEmpty(document_generation?.uploadedImages)) {
    set(data, 'image_doc_ids', []);

    document_generation?.uploadedImages?.forEach((image) => {
      if (isEmpty(overAllRemovedDocList) || !(overAllRemovedDocList?.includes(image?.imageId))) {
        data.image_doc_ids.push(image.imageId);
      }
    });

    if (isEmpty(data?.image_doc_ids)) unset(data, 'image_doc_ids');
  }

  // header config construct
  if (!isEmpty(document_generation?.header_document)) {
    data.header_document = document_generation?.header_document;
    if (isEmpty(get(data.header_document, ['header_config', 'show_in_pages'], null))) {
      unset(data.header_document, ['header_config', 'show_in_pages']);
    }
    if (!isEmpty(get(data.header_document, ['header_config', 'show_page_number'], null)) || get(data.header_document, ['header_config', 'show_page_number'], null)) {
      set(data.header_document, ['header_config', 'show_page_number'], true);
    } else {
      unset(data.header_document, ['header_config', 'show_page_number']);
    }
    if (isEmpty(get(data.header_document, 'header_config', null))) {
      unset(data.header_document, 'header_config');
    }
    if (isEmpty(get(document_generation, 'header_body', null))) unset(data, ['header_document', '_id']);
    if (isEmpty(data?.header_document)) {
      unset(data, 'header_document');
    }
  }

  // footer config construct
  if (!isEmpty(document_generation?.footer_document)) {
    data.footer_document = document_generation?.footer_document;
    if (isEmpty(get(data.footer_document, ['footer_config', 'show_in_pages'], null))) {
      unset(data.footer_document, ['footer_config', 'show_in_pages']);
    }
    if (!isEmpty(get(data.footer_document, ['footer_config', 'show_page_number'], null)) || get(data.footer_document, ['footer_config', 'show_page_number'], null)) {
      set(data.footer_document, ['footer_config', 'show_page_number'], true);
    } else {
      unset(data.footer_document, ['footer_config', 'show_page_number']);
    }
    if (isEmpty(get(data.footer_document, 'footer_config', null))) {
      unset(data.footer_document, 'footer_config');
    }
    if (isEmpty(get(document_generation, 'footer_body', null))) unset(data, ['footer_document', '_id']);
    if (isEmpty(data?.footer_document)) {
      unset(data, 'footer_document');
    }
  }

  return data;
};

export const INITIAL_UPLOAD_STATE = {
  totalCount: 0,
  currentCount: 0,
  documents: [],
  docNameList: [],
  upload_document_details: {},
  uploadDocumentAction: {},
};

const getTableColumnMappingRowPostData = (data = []) => {
  const formattedData = [];
  const { FIELD_KEYS } = SEND_DATA_TO_DATALIST;

  data.forEach((mappingRow) => {
    if (!mappingRow.is_deleted) {
      const postData = pick(mappingRow, [
        'data_list_field_uuid',
        'flow_field_uuid',
        'update_type',
        'operation',
        'value_type',
      ]);
      postData.mapping_order = formattedData.length + 1;
      postData.operation = 'equal_to';

      let fieldValue = mappingRow.flow_field_uuid;

      if (mappingRow?.[FIELD_KEYS.VALUE_TYPE] === FIELD_KEYS.STATIC) {
        fieldValue = getStaticValue(mappingRow.static, mappingRow?.[FIELD_KEYS.DATA_LIST_FIELD_TYPE], { isParseNumber: true });
      }
      postData.value = fieldValue;
      delete postData.flow_field_uuid;
      formattedData.push(postData);
    }
  });
  return formattedData;
};

export const getPostDataMapping = (mappingData = []) => {
  const mapping = [];
  const { FIELD_KEYS } = SEND_DATA_TO_DATALIST;

  mappingData.forEach((mappingRow) => {
    if (!mappingRow.is_deleted) {
      const postData = pick(mappingRow, [
        'data_list_field_uuid',
        'mapping_type',
        'operation',
        'value_type',
      ]);
      switch (mappingRow.mapping_type) {
        case FIELD_KEYS.DIRECT_MAPPING_TYPE:
          let fieldValue = mappingRow.flow_field_uuid;

          if (mappingRow?.[FIELD_KEYS.VALUE_TYPE] === FIELD_KEYS.STATIC) {
            fieldValue = getStaticValue(mappingRow.static, mappingRow?.[FIELD_KEYS.DATA_LIST_FIELD_TYPE], { isParseNumber: true });
          }

          postData.value = fieldValue;
          postData.mapping_order = mapping.length + 1;
          break;
        case FIELD_KEYS.DIRECT_TO_TABLE_MAPPING_TYPE:
          postData.data_list_table_uuid = mappingRow.data_list_table_uuid;
          delete postData.operation;
          delete postData.value_type;
          postData.table_column_mapping = getTableColumnMappingRowPostData(mappingRow.table_column_mapping);
          break;
        case FIELD_KEYS.TABLE_TO_TABLE_MAPPING_TYPE:
          postData.data_list_table_uuid = mappingRow.data_list_table_uuid;
          postData.flow_table_uuid = mappingRow.flow_table_uuid;
          delete postData.operation;
          delete postData.value_type;
          postData.table_column_mapping = getTableColumnMappingRowPostData(mappingRow.table_column_mapping);
          break;
        default:
          break;
      }
      mapping.push(postData);
    }
  });
  return mapping;
};

export const getSendDataToDataListPostData = (data_list_mapping) => {
  const { FIELD_KEYS, ENTRY_ID } = SEND_DATA_TO_DATALIST;
  const action_type = get(
    data_list_mapping,
    [FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE],
    null,
  );
  const postData = {};
  postData[FIELD_KEYS.ACTION_UUID] = get(
    data_list_mapping,
    [FIELD_KEYS.ACTION_UUID],
    [],
  );
  postData[FIELD_KEYS.DATA_LIST_UUID] = get(
    data_list_mapping,
    [FIELD_KEYS.DATA_LIST_UUID],
    null,
  );
  postData[FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE] = get(
    data_list_mapping,
    [FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE],
    null,
  );
  if (get(data_list_mapping, [FIELD_KEYS.MAPPING_UUID], null)) {
    postData[FIELD_KEYS.MAPPING_UUID] = get(
      data_list_mapping,
      [FIELD_KEYS.MAPPING_UUID],
      null,
    );
  }
  switch (action_type) {
    case ENTRY_ACTION_TYPE.AUTO:
      const autoMapping = get(
        data_list_mapping,
        [FIELD_KEYS.MAPPING],
        [],
      );
      postData[FIELD_KEYS.MAPPING] = getPostDataMapping(autoMapping);
      break;
    case ENTRY_ACTION_TYPE.UPDATE:
      const updateMapping = get(
        data_list_mapping,
        [FIELD_KEYS.MAPPING],
        [],
      );
      postData[FIELD_KEYS.ENTRY_ID_FORM_VALUE] = get(
        data_list_mapping,
        [FIELD_KEYS.ENTRY_ID_FORM_VALUE],
        null,
      );
      postData[FIELD_KEYS.ENTRY_ID_FROM] = get(
        data_list_mapping,
        [FIELD_KEYS.ENTRY_ID_FROM],
        ENTRY_ID.FORM_FIELD,
      );
      postData[FIELD_KEYS.MAPPING] = getPostDataMapping(updateMapping);
      break;
    case ENTRY_ACTION_TYPE.DELETE:
      postData[FIELD_KEYS.ENTRY_ID_FORM_VALUE] = get(
        data_list_mapping,
        [FIELD_KEYS.ENTRY_ID_FORM_VALUE],
        null,
      );
      postData[FIELD_KEYS.ENTRY_ID_FROM] = get(
        data_list_mapping,
        [FIELD_KEYS.ENTRY_ID_FROM],
        ENTRY_ID.FORM_FIELD,
      );
      break;
    default:
      break;
  }
  if (data_list_mapping?.mapping_uuid) {
    postData.mapping_uuid = data_list_mapping.mapping_uuid;
  }
  return postData;
};

const getTableColumnMappingRowValidationData = (data = []) => {
  const formattedData = [];
  const { FIELD_KEYS } = SEND_DATA_TO_DATALIST;

  data.forEach((mappingRow = {}) => {
      const validateData = mappingRow;

      if (mappingRow?.[FIELD_KEYS.VALUE_TYPE] === FIELD_KEYS.STATIC) {
        validateData[FIELD_KEYS.STATIC] = formatValidationData(mappingRow.static, mappingRow?.[FIELD_KEYS.DATA_LIST_FIELD_TYPE]);
      }
      formattedData.push(validateData);
  });
  return formattedData;
};

const constructMappingValidationData = (mappingData = []) => {
  const mapping = [];
  const { FIELD_KEYS } = SEND_DATA_TO_DATALIST;

  mappingData.forEach((mappingRow = {}) => {
    const validateData = mappingRow;

    switch (mappingRow.mapping_type) {
      case FIELD_KEYS.DIRECT_MAPPING_TYPE:
        if (mappingRow?.[FIELD_KEYS.VALUE_TYPE] === FIELD_KEYS.STATIC) {
          validateData[FIELD_KEYS.STATIC] = formatValidationData(mappingRow.static, mappingRow?.[FIELD_KEYS.DATA_LIST_FIELD_TYPE]);
        }
        break;
      case FIELD_KEYS.DIRECT_TO_TABLE_MAPPING_TYPE:
        validateData.table_column_mapping = getTableColumnMappingRowValidationData(mappingRow.table_column_mapping);
        break;
      case FIELD_KEYS.TABLE_TO_TABLE_MAPPING_TYPE:
        validateData.table_column_mapping = getTableColumnMappingRowValidationData(mappingRow.table_column_mapping);
        break;
      default:
        break;
    }

    mapping.push(validateData);
  });
  return mapping;
};

export const constructSendDataToDLValidateData = (activeDLMappingParam = {}) => {
  const activeDLMapping = cloneDeep(activeDLMappingParam) || {};

  const { FIELD_KEYS } = SEND_DATA_TO_DATALIST;
  const action_type = get(
    activeDLMapping,
    [FIELD_KEYS.DATA_LIST_ENTRY_ACTION_TYPE],
    null,
  );

  if (action_type === ENTRY_ACTION_TYPE.DELETE) return activeDLMapping;

  const currentMapping = get(
    activeDLMapping,
    [FIELD_KEYS.MAPPING],
    [],
  );

  const mappingValidateData = constructMappingValidationData(currentMapping);

  return {
    ...activeDLMapping,
    [FIELD_KEYS.MAPPING]: mappingValidateData,
  };
};

export const getEmailActionsData = (
  stepData = {},
  email_action = {},
  idk = 0,
) => {
  const data = {
    email_name: email_action.email_name || `Submit Email-${idk}`,
    email_subject: constructDynamicMailContentMessage(
      email_action.email_subject,
      stepData.mailSubjectFieldsList,
    ),
    email_body: constructDynamicMailContentMessage(
      email_action.email_body,
      stepData.mailBodyFieldsList,
    ),
    recipients: constructPostDataforRecipient(email_action.recipients),
    is_condition_rule: false,
    email_attachments: email_action.email_attachments,
  };
  if (!isEmpty(email_action.action_uuid)) {
    data.action_uuid = email_action.action_uuid;
  }
  if (email_action?.email_uuid) {
    data.email_uuid = email_action.email_uuid;
  }
  return data;
};

export const getSendDataToDatalistActiveData = (activeApiData, actions = []) => {
  console.log(activeApiData, activeApiData, activeApiData, 'activeApiDataactiveApiDataactiveApiData');
  const fieldMetaData = get(activeApiData, ['field_metadata'], {});
  const active_data = get(activeApiData, ['flow_step', 'data_list_mapping'], {});
  const selectedActionLabels = [];
  const apiDataMapping = active_data?.mapping;
  const convertedMapping = [];
  active_data.action_uuid.forEach((actionUuid) => {
    const selectedAction = actions.find((action) => action.action_uuid === actionUuid);
    selectedActionLabels.push(selectedAction.action_name);
  });
  let entryIdLabel = null;
  if (active_data.entry_id_from_value) {
    const selectedEntryId = fieldMetaData.filter(({ field_uuid }) => (field_uuid === active_data.entry_id_from_value))?.[0];
    if (selectedEntryId) {
      entryIdLabel = selectedEntryId.field_name;
    }
  }

  if (!isEmpty(apiDataMapping)) {
    apiDataMapping.forEach((mapping, index) => {
      const mappingData = {
        mapping_type: mapping.mapping_type,
        operation: mapping.operation,
        value_type: mapping.value_type,
        mapping_order: index + 1,
        flow_field: {},
        path: convertedMapping.length.toString(),
      };
      if (mapping.mapping_type === SEND_DATA_TO_DATALIST.FIELD_KEYS.DIRECT_MAPPING_TYPE) {
        let dataListField = fieldMetaData.filter(({ field_uuid }) => (field_uuid === mapping.data_list_field_uuid))?.[0];

        if (!isEmpty(dataListField)) {
          if (dataListField?.field_type === FIELD_TYPE.DATA_LIST) {
            dataListField[SEND_DATA_TO_DATALIST.FIELD_KEYS.CHOICE_VALUE_OBJ] = {};
            const displayFields = dataListField?.[SEND_DATA_TO_DATALIST.FIELD_KEYS.DATA_LIST_DETAILS]?.[SEND_DATA_TO_DATALIST.FIELD_KEYS.DISPLAY_FIELDS] || [];
            displayFields.forEach((uuid) => {
              const displayField = fieldMetaData?.find((eachField) => eachField?.field_uuid === uuid);
                if (displayField) {
                  const choiceValues = get(displayField, [SEND_DATA_TO_DATALIST.FIELD_KEYS.CHOICE_VALUES], []);
                  const choiceObj = {};
                  choiceValues?.forEach((c) => {
                    choiceObj[c.value.toString()] = c.label;
                  });
                  if (!isEmpty(choiceObj)) dataListField[SEND_DATA_TO_DATALIST.FIELD_KEYS.CHOICE_VALUE_OBJ][uuid] = choiceObj;
                }
            });
          }

          dataListField = {
            ...dataListField,
            value: mapping.data_list_field_uuid,
            label: getFieldLabelWithRefName(dataListField?.field_name, dataListField?.reference_name),
          };
        }

        let currentMappingData = {
          data_list_field_uuid: mapping.data_list_field_uuid,
          data_list_field: dataListField,
          data_list_field_type: dataListField?.field_type,
        };

        if (mapping?.[SEND_DATA_TO_DATALIST.FIELD_KEYS.VALUE_TYPE] === SEND_DATA_TO_DATALIST.FIELD_KEYS.STATIC) {
          if (!isEmpty(dataListField)) {
            currentMappingData = {
              ...currentMappingData,
              static: constructStaticValues(mapping.value, dataListField?.field_type, null, null, null, null, { isParseNumber: true }),
            };
          } else {
            currentMappingData = {
              ...currentMappingData,
              static: EMPTY_STRING,
            };
          }
        } else {
          let flowField = {};

          if (mapping.value_type === SEND_DATA_TO_DATALIST.FIELD_KEYS.SYSTEM) {
            flowField = SYSTEM_FIELDS_FOR_FLOW_DL_MAPPING.filter(({ value }) => (value === mapping.value))?.[0];
          } else {
            flowField = fieldMetaData.filter(({ field_uuid }) => (field_uuid === mapping.value))?.[0];
            flowField = {
              ...flowField,
              value: mapping.value,
              label: getFieldLabelWithRefName(flowField?.field_name, flowField?.reference_name),
            };
          }

          currentMappingData = {
            ...currentMappingData,
            flow_field_uuid: mapping.value,
            flow_field: flowField,
            flow_field_type: getFieldType(flowField),
          };
        }

        convertedMapping.push({
          ...mappingData,
          ...currentMappingData,
        });
      } else {
        const tableColumnMapping = [];
        let flowTableName = null;
        let dataListTableName = null;
        let flowTableDetails = {};
        (mapping?.table_column_mapping || []).forEach((tableCol, colIndex) => {
          let dataListField = fieldMetaData.filter(({ field_uuid }) => (field_uuid === tableCol.data_list_field_uuid))?.[0];

          if (isEmpty(dataListTableName)) {
            const selectedDataListTable = fieldMetaData.find(({ field_uuid }) => (field_uuid === mapping.data_list_table_uuid)) || {};
            dataListTableName = getFieldLabelWithRefName(selectedDataListTable?.field_name, selectedDataListTable?.reference_name);
          }

          if (!isEmpty(dataListField)) {
            dataListField = {
              ...dataListField,
              value: tableCol.data_list_field_uuid,
              label: getFieldLabelWithRefName(dataListField?.field_name, dataListField?.reference_name),
            };
          }

          let currentMappingData = {
            mapping_order: colIndex + 1,
            mapping_type: SEND_DATA_TO_DATALIST.FIELD_KEYS.DIRECT_MAPPING_TYPE,
            data_list_field_uuid: tableCol.data_list_field_uuid,
            data_list_field: dataListField,
            data_list_field_type: dataListField?.field_type,
          };

          if (tableCol?.[SEND_DATA_TO_DATALIST.FIELD_KEYS.VALUE_TYPE] === SEND_DATA_TO_DATALIST.FIELD_KEYS.STATIC) {
            if (!isEmpty(dataListField)) {
              currentMappingData = {
                ...currentMappingData,
                static: constructStaticValues(tableCol.value, dataListField?.field_type, null, null, null, null, { isParseNumber: true }),
              };
            } else {
              currentMappingData = {
                ...currentMappingData,
                static: EMPTY_STRING,
              };
            }
            delete tableCol.value;
          } else {
            let flowField = {};
            if (tableCol.value_type === SEND_DATA_TO_DATALIST.FIELD_KEYS.SYSTEM) {
              flowField = SYSTEM_FIELDS_FOR_FLOW_DL_MAPPING.filter(({ value }) => (value === tableCol.value))?.[0];
            } else {
              flowField = fieldMetaData.filter(({ field_uuid }) => (field_uuid === tableCol.value))?.[0];
              flowField = {
                ...flowField,
                value: tableCol.value,
                label: getFieldLabelWithRefName(flowField?.field_name, flowField?.reference_name),
              };
            }
            if (isEmpty(flowTableName) &&
              (mapping.mapping_type === SEND_DATA_TO_DATALIST.FIELD_KEYS.TABLE_TO_TABLE_MAPPING_TYPE) &&
              (mapping.flow_table_uuid === flowField.table_uuid)
            ) {
              const selectedFlowTable = fieldMetaData.find(({ field_uuid }) => (field_uuid === mapping.flow_table_uuid)) || {};
              flowTableName = getFieldLabelWithRefName(selectedFlowTable?.field_name, selectedFlowTable?.reference_name);
              flowTableDetails = {
                flow_table_uuid: mapping.flow_table_uuid,
                flow_field: {
                  value: mapping.flow_table_uuid,
                  label: flowTableName,
                  table_uuid: mapping.flow_table_uuid,
                },
                flow_field_type: FIELD_LIST_TYPE.TABLE,
              };
            }
            tableCol.flow_field_uuid = tableCol.value;
            delete tableCol.value;

            currentMappingData = {
              ...currentMappingData,
              flow_field: flowField,
              flow_field_type: getFieldType(flowField),
            };
          }

          tableColumnMapping.push({
            ...tableCol,
            ...currentMappingData,
            path: `${convertedMapping.length.toString()},${SEND_DATA_TO_DATALIST.FIELD_KEYS.TABLE_COLUMN_MAPPING},${tableColumnMapping.length.toString()}`,
          });
        });
        let dataListTable = {};
        if (dataListTableName) {
          dataListTable = {
            value: mapping.data_list_table_uuid,
            label: dataListTableName,
            table_uuid: mapping.data_list_table_uuid,
          };
        }
        convertedMapping.push({
          ...mappingData,
          value_type: mappingData.value_type || SEND_DATA_TO_DATALIST.FIELD_KEYS.DYNAMIC,
          operation: mappingData?.operation || SEND_DATA_TO_DL_OPERANDS.EQUAL_TO,
          data_list_table_uuid: dataListTable?.table_uuid,
          data_list_field: dataListTable,
          data_list_field_type: FIELD_LIST_TYPE.TABLE,
          table_column_mapping: tableColumnMapping,
          ...flowTableDetails,
        });
      }
    });
  }
  console.log(convertedMapping, 'convertedMapping convertedMapping');

  if (isEmpty(convertedMapping)) {
    return {
      ...active_data,
      selectedActionLabels,
      entryIdLabel,
    };
  }
  return {
    ...active_data,
    selectedActionLabels,
    entryIdLabel,
    mapping: convertedMapping,
  };
};

export const FEILD_LIST_DROPDOWN_TYPE = {
  ALL_TABLE_FIELDS: 1,
  DIRECT: 2,
  ALL: 3,
  SELECTED_TABLE_FIELDS: 4,
  TABLES: 5,
};

export const getSendDataListFieldMapping = (pagination_data = [], t = () => {}) => {
  const groupedTriggerFields = {
    [t('flows.send_data_to_datalist_all_labels.field_groups.text_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.number_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.selection_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.file_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.table_names')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.other_fields')]: [],
  };

  console.log('translatedd', groupedTriggerFields);

  const fields = [];
  pagination_data.forEach((fieldData) => {
    if (!has(fieldData, ['disabled'])) {
      if (fieldData.field_list_type === 'direct') {
        if (FIELD_TYPE_CATEGORY.NUMBER_FIELDS.includes(fieldData.field_type)) {
          groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.number_fields')].push({
            ...fieldData,
            value: fieldData.field_uuid,
            field_list_type: fieldData.field_list_type,
          });
        } else if (FIELD_TYPE_CATEGORY.SELECTION_FIELDS.includes(fieldData.field_type)) {
          groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.selection_fields')].push({
            ...fieldData,
            value: fieldData.field_uuid,
            field_list_type: fieldData.field_list_type,
          });
        } else if (FIELD_TYPE_CATEGORY.TEXT_FIELDS.includes(fieldData.field_type)) {
          groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.text_fields')].push({
            ...fieldData,
            value: fieldData.field_uuid,
            field_list_type: fieldData.field_list_type,
          });
        } else if (FIELD_TYPE_CATEGORY.FILE_FIELDS.includes(fieldData.field_type)) {
          groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.file_fields')].push({
            ...fieldData,
            value: fieldData.field_uuid,
            field_list_type: fieldData.field_list_type,
          });
        } else {
          groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.other_fields')].push({
            ...fieldData,
            value: fieldData.field_uuid,
            field_list_type: fieldData.field_list_type,
          });
        }
      } else if (fieldData.field_list_type === 'table') {
        if (!groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.table_names')].some((table) =>
          table.table_uuid === fieldData.table_uuid)) {
          const currentTableFields = pagination_data?.filter((tableField) => tableField?.table_uuid === fieldData.table_uuid);
          groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.table_names')].push({
            label: fieldData.table_name,
            value: fieldData.table_uuid,
            field_list_type: fieldData.field_list_type,
            table_uuid: fieldData.table_uuid,
            table_name: fieldData.table_name,
            field_name: fieldData.table_name,
            is_expand: true,
            expand_count: currentTableFields?.length || '0',
            current_level: SEND_DATALIST_DROPDOWN_TYPES.TABLE_FIELDS,
          });
        }
      }
    }
  });

  Object.keys(groupedTriggerFields).forEach((eachCategory) => {
    if (!isEmpty(groupedTriggerFields[eachCategory])) {
      fields.push({
        label: eachCategory,
        value: eachCategory,
        optionType: SEND_DATALIST_DROPDOWN_TYPES.OPTION_LIST_TITLE,
        disabled: true,
      });
      fields.push(...groupedTriggerFields[eachCategory]);
    }
  });

  return fields;
};

export const getDatalistFieldsOptionList = (dataListFieldsParam, t = () => {}) => {
  const dataListFields = isEmpty(dataListFieldsParam) ? [] : dataListFieldsParam;

  const optionList = dataListFields?.map((field) => {
    return {
      ...field,
      value: field?.field_uuid,
    };
  });

  return getSendDataListFieldMapping(optionList, t);
};

export const formatRecipientData = (recipients = []) => {
  const recipientIndex = recipients?.findIndex((recipient) => recipient?.recipients_type === RECIPIENT_TYPE.DIRECT_RECIPIENT);
  if (recipientIndex > -1) {
    if (isEmpty(recipients[recipientIndex]?.to_recipients?.users)) {
      delete recipients[recipientIndex]?.to_recipients?.users;
    }
    if (isEmpty(recipients[recipientIndex]?.to_recipients?.teams)) {
      delete recipients[recipientIndex]?.to_recipients?.teams;
    }
  }
  return recipients;
};

export const getInitialStaticValueByType = (fieldType, defaultCurrencyType) => {
  switch (fieldType) {
    case FIELD_TYPE.PHONE_NUMBER:
      return {
        country_code: null,
        value: null,
      };
    case FIELD_TYPE.CURRENCY:
      return {
        currency_type: defaultCurrencyType,
        value: null,
      };
    case FIELD_TYPE.LINK:
      return [
        {
          link_text: EMPTY_STRING,
          link_url: EMPTY_STRING,
        },
      ];
    default:
      return EMPTY_STRING;
  }
};
