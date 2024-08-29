import { CBAllKeys, CBLogicalOperators, Text, getCBConditionInitialState } from '@workhall-pvt-lmt/wh-ui-library';
import cx from 'classnames/bind';
import React from 'react';
import gClasses from 'scss/Typography.module.scss';
import { v4 as uuidV4 } from 'uuid';
import { store } from '../../Store';
import EditDatalistIcon from '../../assets/icons/datalists/EditDatalistIcon';
import { constructConditionsforPostData, constructCondtionForResponse } from '../../containers/edit_flow/security/policy_builder/PolicyBuilder.utils';
import { POLICY_BUILDER_OPERATOR_LIST } from '../../containers/edit_flow/security/security_policy/SecurityPolicy.strings';
import { getVisibilityExternalFieldsData, getVisibilityExternalFieldsDropdownList } from '../../redux/reducer';
import { FIELD_TYPE } from '../../utils/constants/form.constant';
import { capitalize, cloneDeep, get, isEmpty, set, translateFunction } from '../../utils/jsUtility';
import { COMMA, EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { expressionValidator, hasValidation } from '../condition_builder/ConditionBuilder.utils';
import { FLOW_ACTION_VALUE_TYPE, SCHEDULAR_CONSTANTS, SYSTEM_FIELDS_FOR_AUTOMATION_SYSTEM, VALIDATION_CONSTANTS } from './AutomatedSystems.constants';
import style from './AutomatedSystems.module.scss';
import { FIELD_MAPPING_ERRORS, MAPPING_CONSTANTS } from '../flow_trigger_configuration/field_mapping/FieldMapping.constants';
import { getDataListPickerFieldFromActiveForm } from '../../containers/landing_page/my_tasks/task_content/TaskContent.utils';
import { AUTOMATED_SYSTEM_CONSTANTS } from './AutomatedSystems.strings';
import { parse12HrsTimeto24HoursTime, parse24HrsTimeto12HoursTime } from '../../utils/dateUtils';
import { deconstructTriggerDetails } from '../../containers/data_lists/data_list_landing/datalist_details/datalist_user_system_action/datalist_shortcuts/datalistShortcuts.utils';
import { convertBeToFeKeys } from '../../utils/normalizer.utils';
import { AUTOMATED_SYSTEM_ACTIONS_TABLE_DATA } from '../../containers/data_lists/data_list_landing/DatalistsLanding.constant';
import { getTriggerDetailsPostData } from '../../containers/edit_flow/step_configuration/node_configurations/call_another_flow/CallAnotherFlow.utils';
import { externalFieldDataChange } from '../../redux/actions/Visibility.Action';

const getLeftFieldMapping = (eachMapping, mapping = {}) => {
  mapping.flowFieldType = eachMapping?.flowFieldType || undefined;
  if (eachMapping?.flowFieldType === FIELD_TYPE.TABLE) {
    mapping.flowTableUUID = eachMapping?.flowTableUUID || undefined;
  } else {
    mapping.flowFieldUUID = eachMapping?.flowFieldUUID || undefined;
  }
};

const getRightFieldMapping = (eachMapping, mapping = {}) => {
  switch (mapping.valueType) {
    case FLOW_ACTION_VALUE_TYPE.DYNAMIC:
    case FLOW_ACTION_VALUE_TYPE.SYSTEM:
      mapping.dataListFieldType = eachMapping?.dataListFieldType || undefined;
      if (eachMapping?.dataListFieldType === FIELD_TYPE.TABLE) {
        mapping.dataListTableUUID = eachMapping?.dataListTableUUID || undefined;
      } else {
        mapping.dataListFieldUUID = eachMapping?.dataListFieldUUID || undefined;
      }
      break;
    case FLOW_ACTION_VALUE_TYPE.STATIC:
      mapping.staticValue = eachMapping?.staticValue || undefined;
      break;
    default:
      break;
  }
};

export const constructMapping = (fieldMapping = []) => fieldMapping.map((eachMapping) => {
  const mapping = {
    valueType: eachMapping?.valueType,
  };
  if (eachMapping.is_deleted) return null;

  // Left Field - Flow
  getLeftFieldMapping(eachMapping, mapping);

  // Right Field
  getRightFieldMapping(eachMapping, mapping);

  // Nested Structure
  if (mapping?.flowFieldType === FIELD_TYPE.TABLE) {
    const mappings = constructMapping(eachMapping?.fieldMapping || []);
    mapping.fieldMapping = mappings.filter((m) => !!m);
  }

  return mapping;
});

/**
 * Validates and constructs the validation data for automated systems.
 * @param {object} data - The input data object.
 * @returns {object} - The validated data object.
 */
function getAutomatedSystemsValidationData(data) {
  const { eventType, monitoringField, schedulerTimeAt, schedulerType, onDays, repeatType, onDate, onDay, onWeek, conditionType, condition, trigger, emailActions = {}, flowActions } = data;

  const validationData = {
    eventType,
    ...(eventType === SCHEDULAR_CONSTANTS.TRIGGER_TYPE.FIELD_VALUE_CHANGE && { monitoringField: monitoringField ?? null }),
    ...(eventType !== SCHEDULAR_CONSTANTS.TRIGGER_TYPE.FIELD_VALUE_CHANGE && {
      schedulerTimeAt,
      schedulerType,
      ...(schedulerType === SCHEDULAR_CONSTANTS.TYPE.DAY && { onDays: onDays ?? [] }),
      ...(schedulerType !== SCHEDULAR_CONSTANTS.TYPE.DAY && {
        repeatType,
        ...(repeatType === SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_DATE && { onDate }),
        ...(repeatType === SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_WEEK_DAY && { onDay, onWeek }),
      }),
    }),
    conditionType,
    ...(conditionType === SCHEDULAR_CONSTANTS.CONDITION_TYPE.CONDITION && { condition: condition ?? {} }),
    trigger,
    ...(trigger === SCHEDULAR_CONSTANTS.TRIGGER.FLOW && {
      flowActions: {
        childFlowUUID: flowActions?.childFlowUUID ?? null,
        // triggerMapping: constructMapping(flowActions?.triggerMapping ?? []).filter((m) => !!m),
      },
    }),
    ...(trigger === SCHEDULAR_CONSTANTS.TRIGGER.EMAIL && { emailActions }),
  };

  return validationData;
}

export const getErrorMessage = (errorList = {}, path = []) => {
  if (isEmpty(path)) return null;
  const consolidatedPath = Array.isArray(path) ? path : [path];
  const key = consolidatedPath.join(COMMA);
  return errorList?.[key];
};

export const getValueTypeForAutomation = (t, fieldType = null, flowFieldData = {}, dataListUUID = null) => {
    const { VALUE_TYPE } = AUTOMATED_SYSTEM_CONSTANTS(t);
    if (FIELD_TYPE.TABLE === fieldType) {
        return [VALUE_TYPE?.[1]];
      }
      if (FIELD_TYPE.FILE_UPLOAD === fieldType) {
        const optionList = VALUE_TYPE;
        optionList.pop();
        return optionList;
      }

      if (flowFieldData?.field_type === FIELD_TYPE.DATA_LIST) {
        const dlUUID = get(flowFieldData, ['data_list_details', 'data_list_uuid']);
        if (dataListUUID === dlUUID) {
          const optionList = [...VALUE_TYPE];
          optionList.push(MAPPING_CONSTANTS.DATA_LIST_ENTRY_MAPPING);
          return optionList;
        }
      }

      if (flowFieldData?.field_type === FIELD_TYPE.USER_TEAM_PICKER) {
        const optionList = [...VALUE_TYPE];
        optionList.push(MAPPING_CONSTANTS.USER_ENTRY_MAPPING);
        return optionList;
      }

      return VALUE_TYPE;
};

export const getAutomatedSystemCBInitialState = () => {
    return {
      [CBAllKeys.EXPRESSION_UUID]: uuidV4(),
      [CBAllKeys.LOGICAL_OPERATOR]: CBLogicalOperators.AND,
      [CBAllKeys.CONDITIONS]: [getCBConditionInitialState()],
    };
};

export const validateSystemActionCB = (automatedSystemData = {}) => {
  const { condition } = automatedSystemData;

  const clonedExpression = cloneDeep(condition);
  const allFields = getVisibilityExternalFieldsDropdownList(
    store.getState(),
    null,
    false,
  );

  const validatedExpression = expressionValidator(
    { expression: clonedExpression },
    allFields,
    POLICY_BUILDER_OPERATOR_LIST,
    false,
  );

  const hasError = hasValidation(validatedExpression);

  return { hasValidation: hasError, validatedExpression };
};

export const getRequestTriggerMapObject = (tm) => {
  const mapping = {};
  mapping.value_type = tm.valueType;

  if (tm.flowFieldType === FIELD_TYPE.TABLE) {
    return {};
  }

  mapping.child_field_uuid = tm.flowFieldUUID;

  if (tm.valueType === FLOW_ACTION_VALUE_TYPE.DYNAMIC) {
    mapping.parent_field_uuid = tm.dataListFieldUUID;
  } else if (tm.valueType === FLOW_ACTION_VALUE_TYPE.SYSTEM) {
    mapping.system_field = tm.dataListFieldData.value;
  } else if (tm.valueType === FLOW_ACTION_VALUE_TYPE.STATIC) {
    let _staticValue = tm.staticValue;
    if (tm.flowFieldType === FIELD_TYPE.USER_TEAM_PICKER) {
      _staticValue = {};
      if (tm.staticValue.users) _staticValue.users = tm.staticValue.users.map((u) => u._id || u.id);
      if (tm.staticValue.teams) _staticValue.teams = tm.staticValue.teams.map((u) => u._id || u.id);
    } else if (tm.flowFieldType === FIELD_TYPE.DATA_LIST) {
      _staticValue = tm.staticValue.map((d) => d._id || d.id);
    }
    mapping.static_value = _staticValue;
  }
  return mapping;
};

export const getResponseTriggerMapObject = (tm, fields = {}, path = null) => {
  const mapping = {};
  mapping.path = `${path}`;

  if (tm.parentTableUUID && tm.childTableUUID) {
    mapping.valueType = FLOW_ACTION_VALUE_TYPE.DYNAMIC;
    mapping.flowTableUUID = tm.childTableUUID;
    mapping.dataListTableUUID = tm.parentTableUUID;
    mapping.flowFieldType = FIELD_TYPE.TABLE;
    mapping.dataListFieldType = FIELD_TYPE.TABLE;
    mapping.flowFieldData = fields[tm.childTableUUID];
    mapping.dataListFieldData = fields[tm.parentTableUUID];
    mapping.fieldMapping = tm.fieldMapping?.map?.((tfm, idx) => {
      const _path = `${path},fieldMapping,${idx}`;
      const tfMapping = getResponseTriggerMapObject(tfm, fields, _path);
      return tfMapping;
    });
  } else {
    mapping.valueType = tm.valueType;
    mapping.flowFieldUUID = tm.childFieldUUID;
    mapping.flowFieldType = fields[tm.childFieldUUID]?.field_type;
    mapping.flowFieldData = fields[tm.childFieldUUID];
    if (tm.valueType === FLOW_ACTION_VALUE_TYPE.DYNAMIC) {
      mapping.dataListFieldUUID = tm.parentFieldUUID;
      mapping.dataListFieldType = fields[tm.parentFieldUUID]?.field_type;
      mapping.dataListFieldData = fields[tm.parentFieldUUID];
    } else if (tm.valueType === FLOW_ACTION_VALUE_TYPE.SYSTEM) {
      mapping.dataListFieldData = SYSTEM_FIELDS_FOR_AUTOMATION_SYSTEM.find((v) => v.value === tm.systemField);
      mapping.dataListFieldUUID = tm.systemField;
    } else if (tm.valueType === FLOW_ACTION_VALUE_TYPE.STATIC) {
      mapping.staticValue = tm.staticValue;
      if (mapping.flowFieldType === FIELD_TYPE.DATA_LIST) {
        mapping.staticValue = getDataListPickerFieldFromActiveForm(tm.staticValue);
      }
    }
  }

  return mapping;
};

const getSchedulerConfiguration = (action, postData = {}) => {
  if (action.eventType === SCHEDULAR_CONSTANTS.TRIGGER_TYPE.SCHEDULER) {
    const scheduler_details = {
      type: action.schedulerType,
      is_working: false,
      time_at: parse12HrsTimeto24HoursTime(action.schedulerTimeAt),
    };

    if (action.schedulerType === SCHEDULAR_CONSTANTS.TYPE.DAY) {
      scheduler_details.on_days = action.onDays;
    } else {
      scheduler_details.repeat_type = action.repeatType;
      if (action.repeatType === SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_WEEK_DAY) {
        scheduler_details.on_week = action.onWeek;
        scheduler_details.on_day = action.onDay;
      }
      if (action.repeatType === SCHEDULAR_CONSTANTS.REPEAT_TYPE.SELECTED_DATE) {
        scheduler_details.on_date = action.onDate;
      }
    }
    postData.scheduler_details = scheduler_details;
  } else {
    postData.monitoring_field = action.monitoringField;
  }
};

export const constructSaveSystemAction = (action, metaData = {}) => {
  const postData = {
    data_list_id: metaData.dataListId,
    data_list_uuid: metaData.dataListUUID,
    event_type: action.eventType,
    triggering_condition: { condition_type: action.conditionType },
  };

  if (action.eventUUID) postData.event_uuid = action.eventUUID;
  if (action.id) postData._id = action.id;

  // Scheduler Configuration
  getSchedulerConfiguration(action, postData);

  if (action.conditionType === SCHEDULAR_CONSTANTS.CONDITION_TYPE.CONDITION) {
    const condition = {
      [CBAllKeys.LOGICAL_OPERATOR]: action.condition.logical_operator,
      [CBAllKeys.CONDITIONS]: constructConditionsforPostData(action.condition.conditions),
    };

    postData.triggering_condition.condition_list = [condition];
  }

  postData.trigger = SCHEDULAR_CONSTANTS.TRIGGER.FLOW;

  const flow_actions = { child_flow_uuid: action.flowActions.childFlowUUID };

  if (!isEmpty(action.flowActions.triggerMapping)) {
    const triggerDetails = getTriggerDetailsPostData({
      mapping: action.flowActions.triggerMapping,
      childFlowUuid: action.flowActions.childFlowUUID,
    });
    if (!isEmpty(triggerDetails.trigger_mapping)) flow_actions.trigger_mapping = triggerDetails.trigger_mapping;
  }
  postData.flow_actions = flow_actions;

  if (action.documentDetails?.uploadedDocMetadata || action.documentDetails?.removedDocList) {
    postData.document_details = {};

    if (!isEmpty(action.documentDetails?.uploadedDocMetadata)) {
      postData.document_details = { ...action.documentDetails };
      postData.document_details.uploaded_doc_metadata = cloneDeep(action.documentDetails?.uploadedDocMetadata);
    }

    if (!isEmpty(action.documentDetails?.removedDocList)) {
      postData.document_details.removed_doc_list = cloneDeep(action.documentDetails?.removedDocList);
    }

    delete postData.document_details.uploadedDocMetadata;
    delete postData.document_details.removedDocList;
  }

  return postData;
};

export const deconstructSystemAction = (action = {}, options = {}) => {
  const { schedulerDetails = {}, triggeringCondition = {}, flowActions = {}, document_url_details = {} } = action;
  const { reduxDispatch, t } = options;
  const errorList = {};
  const data = {
    id: action.id,
    eventUUID: action.eventUUID,
    eventType: action.eventType,
    conditionType: triggeringCondition.conditionType,
    status: action.status,
   };

  if (data.eventType === SCHEDULAR_CONSTANTS.TRIGGER_TYPE.SCHEDULER) {
    data.schedulerType = schedulerDetails.type;
    data.isWorking = schedulerDetails.isWorking;
    data.schedulerTimeAt = parse24HrsTimeto12HoursTime(schedulerDetails.timeAt);

    if (schedulerDetails.onDays) data.onDays = schedulerDetails.onDays;
    if (schedulerDetails.onWeek) data.onWeek = schedulerDetails.onWeek;
    if (schedulerDetails.onDay) data.onDay = schedulerDetails.onDay;
    if (schedulerDetails.onDate) data.onDate = schedulerDetails.onDate;
    if (schedulerDetails.repeatType) data.repeatType = schedulerDetails.repeatType;
  } else {
    data.monitoringField = action.monitoringField;
  }

  if (data.conditionType === SCHEDULAR_CONSTANTS.CONDITION_TYPE.CONDITION) {
    const { field_metadata = [], conditionList = [] } = triggeringCondition;
    const condition = conditionList[0];
    const fields = {};
    field_metadata.forEach((f) => { fields[f.field_uuid] = f; });
    const externalFields = getVisibilityExternalFieldsData(store.getState());
    reduxDispatch?.(externalFieldDataChange(externalFields, field_metadata));

    const _condition = {
      [CBAllKeys.EXPRESSION_UUID]: uuidV4(),
      [CBAllKeys.LOGICAL_OPERATOR]: condition.logical_operator,
      [CBAllKeys.CONDITIONS]: constructCondtionForResponse(condition.conditions, fields, true),
    };
    data.condition = _condition;
  }

  data.trigger = action.trigger;
  data.flowActions = {
    childFlowUUID: action.flowActions.childFlowUUID,
    childFlowId: action.flowActions.childFlowId,
    childFlowName: action.flowActions.childFlowName,
  };

  if (!isEmpty(flowActions.trigger_mapping)) {
    const REFERENCE_NAME_CHECK = /^.+_[0-9]{1,2}$/;
    const fieldDetails = flowActions.field_metadata.map((f) => {
      const field = convertBeToFeKeys(f);
      field.fieldUuid = field.fieldUUID;
      field._id = field.id;
      if (!REFERENCE_NAME_CHECK.test(field.referenceName)) field.label = field.fieldName;
      return field;
    });

    const triggerMapping = deconstructTriggerDetails(
      flowActions.trigger_mapping,
      {
        fieldDetails,
        documentURLDetails: document_url_details,
        isParentDatalist: true,
      },
    );
    data.documentURLDetails = document_url_details || [];
    data.flowActions.triggerMapping = [];
    data.flowActions.serverTriggerMapping = cloneDeep(triggerMapping);
    data.flowActions.fieldDetails = fieldDetails;
  }

  // child flow is deleted;
  if (flowActions.childFlowUUID && !flowActions.childFlowId && !flowActions.childFlowName) {
    errorList['flowActions,childFlowUUID'] = t('common_strings.flow_deleted');
    delete data.flowActions.childFlowUUID;
  }

  return [data, errorList];
};

const getAutomatedSystemBodyData = (automatedData = [], onEdit = () => {}, isReadOnly = false, t = translateFunction) => {
    const { SCHEDULED_TRIGGER, FIELD_TRIGGER, ALL_DATALIST, DATA_MATCHES, INITIATE_A_FLOW } = AUTOMATED_SYSTEM_ACTIONS_TABLE_DATA(t);
    const automatedDetails = [];
    automatedData?.forEach((data, index) => {
        const dataObject = {};
        const compArray = [];
        dataObject.id = index + 1;
        const { TRIGGER_TYPE, CONDITION_TYPE } = SCHEDULAR_CONSTANTS;
        const triggerType = TRIGGER_TYPE.SCHEDULER === data.eventType ? SCHEDULED_TRIGGER : FIELD_TRIGGER;
        const triggerData = CONDITION_TYPE.ALL === data.triggeringCondition ? ALL_DATALIST : DATA_MATCHES;
        const systemAction = INITIATE_A_FLOW;
        compArray.push(<Text content={triggerType} className={cx(gClasses.FTwo13BlackV12, gClasses.WhiteSpaceNoWrap)} />);
        compArray.push(<Text content={triggerData} className={cx(gClasses.FTwo13BlackV12, gClasses.WhiteSpaceNoWrap)} />);
        compArray.push(<Text content={systemAction} className={cx(gClasses.FTwo13BlackV12, gClasses.WhiteSpaceNoWrap)} />);
        compArray.push(<Text content={capitalize(data.frequency)} className={cx(gClasses.FTwo13BlackV12, gClasses.WhiteSpaceNoWrap)} />);
        if (!isReadOnly) {
            compArray.push(
              <div className={cx(gClasses.CenterVH, gClasses.WhiteSpaceNoWrap)}>
                <button
                  className={cx(style.ActionButton, gClasses.CenterVH, gClasses.MR6)}
                  onClick={() => onEdit(data)}
                >
                  <EditDatalistIcon />
                </button>
              </div>,
            );
        } else {
          compArray.push('');
        }
        dataObject.component = compArray;
        automatedDetails.push(dataObject);
    });
    return automatedDetails;
};

export const getFlowlistSuggetion = (allFlowList = []) => {
  let flowOptions = [];
  const flow_list = isEmpty(allFlowList) ? [] : allFlowList;

  flowOptions = flow_list.map((flow) => {
    return {
      label: flow.flow_name,
      value: flow.flow_uuid,
      flowId: flow._id,
    };
  });
  return flowOptions;
};

const getErrors = (error, errorId, childFieldType, t) => {
  if (childFieldType === FIELD_TYPE.CURRENCY) {
      if (errorId.includes(VALIDATION_CONSTANTS.CURRENCY_TYPE)) return t(FIELD_MAPPING_ERRORS.CURRENCY_TYPE_REQUIRED);
      if (errorId.includes(VALIDATION_CONSTANTS.VALUE)) return t(FIELD_MAPPING_ERRORS.CURRENCY_VALUE_REQUIRED);
      return error;
  }

  return error;
};

export const getStaticValueErrors = (_id, errorList, childFieldType, t) => {
  const errors = [];
  Object.keys(errorList).forEach((errorId) => {
    const index = errorId.indexOf(_id);

    if (index === 0) {
      if (childFieldType === FIELD_TYPE.LINK) {
        const errorIdIndices = errorId.split(',');
        const currentErrorKey = errorIdIndices[errorIdIndices.length - 1];
        const currentErrorIndex = Number(errorIdIndices[errorIdIndices.length - 2]);

        if (currentErrorKey === VALIDATION_CONSTANTS.LINK_TEXT) {
          set(errors, [currentErrorIndex, VALIDATION_CONSTANTS.LINK_TEXT], errorList[errorId]);
        } else if (currentErrorKey === VALIDATION_CONSTANTS.LINK_URL) {
          set(errors, [currentErrorIndex, VALIDATION_CONSTANTS.LINK_URL], errorList[errorId]);
        }
      } else {
          errors.push(getErrors(errorList[errorId], errorId, childFieldType, t));
      }
    }
  });

  if (childFieldType === FIELD_TYPE.LINK) return errors;

  return errors[0] || EMPTY_STRING;
};

export { getAutomatedSystemBodyData, getAutomatedSystemsValidationData };
