import React from 'react';
import i18next from 'i18next';
import {
  isEmpty,
  has,
  cloneDeep,
  nullCheck,
  compact,
  get,
  find,
  isArray,
  unset,
  findIndex,
  isUndefined,
  uniqBy,
} from 'utils/jsUtility';
import { trimString } from 'utils/UtilityFunctions';
import FlowIcon from 'assets/icons/FlowIcon';
import ListIcon from 'assets/icons/ListIcon';
import { ACTION_TYPE } from 'utils/constants/action.constant';
import { FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import { store } from 'Store';
import { COMMA, EMPTY_STRING, SPACE } from 'utils/strings/CommonStrings';
import { updateFlowStateChange } from 'redux/reducer/EditFlowReducer';
import { MAPPING_CONSTANTS } from 'components/flow_trigger_configuration/field_mapping/FieldMapping.constants';
import { INTEGRATION_CONSTANTS } from 'containers/edit_flow/diagramatic_flow_view/flow_component/flow_integration_configuration/FlowIntegrationConfiguration.constants';
import { CONFIG_FIELD_KEY, EDIT_FLOW_TAB_INDEX, FLOW_STRINGS, STEP_CARD_STRINGS, STEP_LABELS } from './EditFlow.strings';
import { constructStaticValues, constructTriggerMappingPostData, getStaticValue } from './step_configuration/StepConfiguration.utils';
import { SECURITY_SETTINGS_STRINGS, SETTINGS_PAGE_TAB } from './settings_configuration/SettingsConfiguration.utils';
import { translateFunction } from '../../utils/jsUtility';
import { EDIT_FLOW_STEP_TABS } from '../application/app_components/dashboard/flow/Flow.utils';
import { DEFAULT_STEP_STATUS, DUE_DATE_VALUE_TYPE } from './EditFlow.constants';
import BasicDetailsIcon from '../../assets/icons/teams/BasicDetailsIcon';
import Trash from '../../assets/icons/application/Trash';
import DiscardIcon from '../../assets/icons/integration/DiscardIcon';
import { INTEGRATION_FAILURE_ACTION } from './diagramatic_flow_view/flow_component/flow_integration_configuration/FlowIntegrationConfiguration.constants';
import { SOMEONE_IS_EDITING, SOMEONE_IS_EDITING_ERROR } from '../../utils/strings/CommonStrings';
import { getFormattedDateFromUTC } from '../../utils/dateUtils';
import { getCurrentUserId } from '../../utils/userUtils';
import {
  getFieldLabelWithRefName,
  getShortCode,
  updateEditConfirmPopOverStatus,
} from '../../utils/UtilityFunctions';
import { deleteStepAPIThunk } from '../../redux/actions/FlowStepConfiguration.Action';
import { ALLOW_COMMENTS, BUTTON_COLOR_TYPES, BUTTON_POSITION_TYPES } from '../form/form_builder/form_footer/FormFooter.constant';
import { constructPolicyForConditionBasedData } from './security/policy_builder/PolicyBuilder.utils';
import { DATA_TYPE } from './step_configuration/StepConfiguration.constants';
import {
  STEP_TYPE,
  FORM_POPOVER_STATUS,
  ROLES,
  NON_PRIVATE_TEAM_TYPES,
  PRIVATE_TEAM_TYPES,
} from '../../utils/Constants';
import { NODE_BE_KEYS, NODE_FE_KEYS } from './node_configuration/NodeConfiguration.constants';
import { getAssigneesData } from './node_configuration/NodeConfiguration.utils';
import { USER_STEP_ASSIGNEE_OBJECT_KEYS } from './step_configuration/set_assignee/SetAssignee.utils';
import { getCurrentSystemField, getDocumentGenerationRawHtml } from './step_configuration/node_configurations/generate_document/general/document_template/DocumentTemplate.utils';
import { DYNAMIC_EMAIL_PREFIX_PATTERN, DYNAMIC_EMAIL_REGEX_PATTERN, DYNAMIC_EMAIL_SUFFIX_PATTERN } from '../../utils/strings/Regex';

const { FLOW_OWNERS } = SECURITY_SETTINGS_STRINGS;
export const FLOW_STATUS = {
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
};

export const FLOW_VIEW_OPTIONS = [
  {
    label: <ListIcon title="Step View" />,
    value: 1,
  },
  {
    label: <FlowIcon title="Flow Diagram View" />,
    value: 2,
  },
];
export const SECONDARY_ACTIONS_LIST = {
  DELETE: 1,
  SETTINGS: 2,
  DISCARD: 3,
  MANAGE_FLOW_FIELDS: 5,
  EDIT_BASIC_DETAILS: 4,
};
export const ASSIGNEE_TYPE = {
  DIRECT_ASSIGNEE: 'users_or_teams',
  RULE_BASED: 'rule',
  FORM_FIELDS: 'form_fields',
  SYSYEM_FIELDS: 'system_fields',
  FORM_REPORTING_MANAGER_ASSIGNEE: 'form_reporting_manager_assignee',
};

export const getEditFlowSecondaryActionMenu = (
  status,
  version,
  t,
) => ((status === FLOW_STATUS.PUBLISHED) || (version > 1))
    ? [
      {
        label: STEP_CARD_STRINGS(t).EDIT_BASIC_DETAILS,
        icon: <BasicDetailsIcon />,
        value: SECONDARY_ACTIONS_LIST.EDIT_BASIC_DETAILS,
        isChecked: false,
      },
      {
        label: STEP_CARD_STRINGS(t).DISCARD_FLOW,
        icon: <DiscardIcon />,
        value: SECONDARY_ACTIONS_LIST.DISCARD,
        isChecked: false,
      },
      {
        label: STEP_CARD_STRINGS(t).DELETE_FLOW_TEXT,
        icon: <Trash />,
        value: SECONDARY_ACTIONS_LIST.DELETE,
        isChecked: false,
      },
      {
        label: 'Manage flow fields',
        value: SECONDARY_ACTIONS_LIST.MANAGE_FLOW_FIELDS,
      },
    ]
    : [
      {
        label: STEP_CARD_STRINGS(t).EDIT_BASIC_DETAILS,
        icon: <BasicDetailsIcon />,
        value: SECONDARY_ACTIONS_LIST.EDIT_BASIC_DETAILS,
        isChecked: false,
      },
      {
        label: STEP_CARD_STRINGS(t).DELETE_FLOW_TEXT,
        icon: <Trash />,
        value: SECONDARY_ACTIONS_LIST.DELETE,
        isChecked: false,
      },
      {
        label: 'Manage flow fields',
        value: SECONDARY_ACTIONS_LIST.MANAGE_FLOW_FIELDS,
      },
    ];

export const constructMetricFields = (metric_fields) => {
  if (!isEmpty(metric_fields)) {
    const metricFields = metric_fields.map((field) => {
      return {
        ...field,
        existing_data: { ...field },
      };
    });
    return metricFields;
  }
  return [];
};

export const getFieldsListJsonFromContent = (content, formAndSystemFields = []) => {
  const matches = [];
  const re = /\$(.*?)\$/gm;
  let m;
  // eslint-disable-next-line no-cond-assign
  while ((m = re.exec(content))) {
    matches.push(m[1]);
  }
  const fieldsList = [];
  const formFields = formAndSystemFields?.[0]?.subMenuItems || [];
  matches &&
    matches.map((match) => {
      match = unescape(match);
      const matchObject = JSON.parse(match);
      console.log('matchObject', matchObject, 'matches', matches);
      if (matchObject.type === 'system') {
        const currentSystemField = getCurrentSystemField({ fieldUuid: matchObject.identifier, systemFields: formAndSystemFields?.[1]?.subMenuItems });
        fieldsList.push({
          label: matchObject.title,
          value: matchObject.identifier,
          field_uuid: matchObject.identifier,
          type: 'system',
          ...currentSystemField,
        });
      } else {
        const selectedField = formFields.find((field) => field.fieldUuid === matchObject.identifier);
        fieldsList.push({
          label: matchObject.title,
          value: matchObject.identifier,
          field_uuid: matchObject.identifier,
          ...selectedField,
        });
      }
      return null;
    });
  console.log('fieldsListJson', fieldsList, 'content', content);
  return fieldsList;
};

export const constructMailContentFromServer = (content, formAndSystemFields) => {
  const fieldslist = getFieldsListJsonFromContent(content, formAndSystemFields);
  return fieldslist;
};

export const formatMailContentFromServer = (
  email,
  formAndSystemFields,
) => {
  try {
    let docContent = cloneDeep(email);
    let dynamicContent = cloneDeep(email).match(DYNAMIC_EMAIL_REGEX_PATTERN);
    if (!isEmpty(dynamicContent)) {
      dynamicContent = dynamicContent.map((content) => content.slice(
        DYNAMIC_EMAIL_PREFIX_PATTERN.length,
        -(DYNAMIC_EMAIL_SUFFIX_PATTERN.length),
      ));
      const contentArray = [];
      dynamicContent.forEach((data) => {
        contentArray.push(JSON.parse(data));
      });
      contentArray.forEach((content) => {
        if (content.type === 'system') {
          const field = getCurrentSystemField({ fieldUuid: content.identifier, systemFields: formAndSystemFields?.[1]?.subMenuItems });
          if (field) {
            if (docContent.includes(`!@#\${"type":"system","identifier":"${content.identifier}","title":"${content.title}"}$#@!`)) {
              docContent = docContent.replace(
                `!@#\${"type":"system","identifier":"${content.identifier}","title":"${content.title}"}$#@!`,
                getDocumentGenerationRawHtml(field.value, field?.parentLabel || field.label, false, field?.deleteTagId),
              );
            }
          }
        } else {
          const field = formAndSystemFields?.[0]?.subMenuItems?.find((field) => field.value === content.identifier);
          if (field) {
            docContent = docContent.replace(
              `!@#\${"type":"field","identifier":"${content.identifier}","title":"${content.title}"}$#@!`,
              getDocumentGenerationRawHtml(field.value, field.label, false, field?.deleteTagId),
            );
          }
        }
      });
    }
    return docContent;
  } catch (e) {
    console.log(e, 'format mail content');
    return email;
  }
};

export const getCreateFlowValidateData = (flowData) => {
  const data = {
    flow_name: trimString(flowData.flow_name),
  };
  const description = trimString(flowData.flow_description);
  if (!isEmpty(description)) {
    data.flow_description = description;
  }
  if (!isEmpty(flowData.flow_uuid)) {
    data.flow_uuid = flowData.flow_uuid;
  }

  if (!isEmpty(flowData.initiators)) {
    const userTeam = {};
    if (!isEmpty(flowData.initiators.users)) userTeam.users = flowData.initiators.users.map((u) => u._id);
    if (!isEmpty(flowData.initiators.teams)) userTeam.teams = flowData.initiators.teams.map((u) => u._id);
    data.security = { initiators: userTeam };
  }
  return data;
};

export const getFlowAddOnConfigValidateData = (flowData) => {
  const data = {
    is_system_identifier: flowData.is_system_identifier,
    flow_short_code: flowData.flow_short_code,
    technical_reference_name: flowData.technical_reference_name,
  };
  if (!flowData.is_system_identifier) {
    data.custom_identifier = flowData?.custom_identifier?.field_uuid || null;
  }
  let taskIdentifier = null;
  if (flowData?.task_identifier?.length > 0) {
    taskIdentifier = [];
    flowData.task_identifier.forEach((field) => {
      if (!isEmpty(field?.field_uuid)) {
        taskIdentifier.push(field.field_uuid);
      }
    });
  }
  data.task_identifier = taskIdentifier;
  if (!isEmpty(flowData.category)) {
    data.category_id = flowData.category.category_id;
  }
  return data;
};

export const getSaveFlowPostDataWithSettingsTab = (currentSettingsPage, flowData) => {
  let data = {};
  switch (currentSettingsPage) {
    case SETTINGS_PAGE_TAB.SECURITY:
      data.is_participants_level_security = flowData.is_participants_level_security;
      data.viewers = {};
      if (flowData?.additional_viewers?.teams?.length > 0) {
        data.viewers.teams =
          flowData.additional_viewers.teams.map(
            (eachTeam) => eachTeam._id,
          );
      }
      if (flowData?.additional_viewers?.users?.length > 0) {
        data.viewers.users =
          flowData.additional_viewers.users.map(
            (eachUser) => eachUser._id,
          );
      }
      data.admins = {};
      if (flowData?.owners?.teams?.length > 0) {
        const teams = [];
        flowData.owners.teams.forEach((team) => {
          teams.push(team._id);
        });
        data.admins.teams = teams;
      }
      if (flowData?.owners?.users?.length > 0) {
        const users = [];
        flowData.owners.users.forEach((team) => {
          users.push(team._id);
        });
        data.admins.users = users;
      }
      data.owners = {};
      if (flowData?.reassignedOwners?.teams?.length > 0) {
        const teams = [];
        flowData.reassignedOwners.teams.forEach((team) => {
          teams.push(team._id);
        });
        data.owners.teams = teams;
      }
      if (flowData?.reassignedOwners?.users?.length > 0) {
        const users = [];
        flowData.reassignedOwners.users.forEach((team) => {
          users.push(team._id);
        });
        data.owners.users = users;
      }

      data.entity_viewers = {};

      if (flowData?.entityViewers?.teams?.length > 0) {
        const teams = [];
        flowData.entityViewers.teams.forEach((team) => {
          teams.push(team._id);
        });
        data.entity_viewers.teams = teams;
      }

      if (flowData?.entityViewers?.users?.length > 0) {
        const users = [];
        flowData.entityViewers.users.forEach((team) => {
          users.push(team._id);
        });
        data.entity_viewers.users = users;
      }

      if (flowData?.is_row_security_policy) {
        data.is_row_security_policy = flowData?.is_row_security_policy;
        data.security_policies = constructPolicyForConditionBasedData(flowData?.policyList);
      } else {
        data.is_row_security_policy = false;
      }
      break;
    case SETTINGS_PAGE_TAB.DASHBOARD:
      let defaultReportFields = null;
      if (flowData?.default_report_fields?.length > 0) {
        defaultReportFields = [];
        flowData.default_report_fields.forEach((field) => {
          if (!isEmpty(field?.value)) {
            defaultReportFields.push({
              field_uuid: field.value,
              label: field.customLabel,
            });
          }
        });
      }
      if (isEmpty(defaultReportFields)) data.default_report_fields = null;
      else data.default_report_fields = defaultReportFields;
      break;
    case SETTINGS_PAGE_TAB.ADDON:
      data = getFlowAddOnConfigValidateData(flowData);
      break;
    default:
      break;
  }
  return {
    ...data,
    ...getCreateFlowValidateData(flowData),
  };
};

export const consolidateMetricFields = (metric_fields) => {
  let consolidatedMetricFields = cloneDeep(metric_fields);
  if (!isEmpty(metric_fields)) {
    consolidatedMetricFields = metric_fields.map((eachMetric) => {
      if (has(eachMetric, ['is_edit'], false)) {
        delete eachMetric.is_edit;
        return {
          ...eachMetric,
          ...(eachMetric.existing_data || {}),
        };
      } else if (has(eachMetric, ['is_add'], false)) {
        return null;
      }
      return eachMetric;
    });
  }
  return compact(consolidatedMetricFields);
};

const getTriggerShortcutPostData = (currentTriggerData) => {
  const clonedTriggerData = cloneDeep(currentTriggerData);
  const data = {};
  data.child_flow_uuid = get(clonedTriggerData, ['child_flow_details', 'child_flow_uuid'], EMPTY_STRING) || EMPTY_STRING;
  data.trigger_name = clonedTriggerData?.trigger_name || EMPTY_STRING;
  const triggerMapping = constructTriggerMappingPostData(clonedTriggerData?.trigger_mapping, clonedTriggerData?.document_details || []) || [];
  if (!isEmpty(triggerMapping)) {
    data.trigger_mapping = constructTriggerMappingPostData(clonedTriggerData?.trigger_mapping, clonedTriggerData?.document_details || []) || [];
  }
  if (currentTriggerData?.trigger_uuid) {
    data.trigger_uuid = currentTriggerData?.trigger_uuid;
  }
  return data;
};

export const getExistingTriggerShortcutPostData = (currentTriggerData) => {
  const clonedTriggerData = cloneDeep(currentTriggerData);
  clonedTriggerData.trigger_name = currentTriggerData.trigger_name || clonedTriggerData.child_flow_name;
  clonedTriggerData?.trigger_mapping?.forEach((eachMapping, index) => {
    const fieldMapping = [];
    if (!isEmpty(get(eachMapping, [MAPPING_CONSTANTS.FIELD_MAPPING.ID], []))) {
      eachMapping.field_mapping.forEach((eachSubMapping) => {
        let { static_value } = cloneDeep(eachSubMapping);
        if (static_value) {
          if ((has(static_value, ['entry_details']))) {
            static_value = constructStaticValues(static_value, FIELD_TYPES.DATA_LIST);
          }
          const fieldType = has(eachSubMapping?.static_value, ['entry_details']) && FIELD_TYPES.DATA_LIST;
          static_value = getStaticValue(static_value, fieldType);
        }
        fieldMapping.push({
          ...eachSubMapping,
          ...(eachSubMapping.value_type === MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[0].value) ?
            {
              static_value: static_value,
            } : null,
        });
      });
      clonedTriggerData.trigger_mapping[index].field_mapping = fieldMapping;
    }

    let { static_value } = cloneDeep(eachMapping);
    if (static_value) {
      if ((has(static_value, ['entry_details']))) {
        static_value = constructStaticValues(static_value, FIELD_TYPES.DATA_LIST);
      }
      const fieldType = has(eachMapping?.static_value, ['entry_details']) && FIELD_TYPES.DATA_LIST;
      static_value = getStaticValue(static_value, fieldType);
    }
    if (eachMapping.value_type === MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[0].value) {
      clonedTriggerData.trigger_mapping[index].static_value = static_value;
    }
  });
  unset(clonedTriggerData, 'child_flow_name');
  return clonedTriggerData;
};

export const getFlowTriggerDetailsData = (saveFlowPostData, flowData) => {
  if (!isEmpty(flowData?.trigger_details) || !isEmpty(flowData?.activeTriggerData)) {
    const triggerDetails = flowData?.trigger_details?.map((trigger) => getExistingTriggerShortcutPostData(trigger)) || [];
    saveFlowPostData.trigger_details = triggerDetails;
    if (!isEmpty(flowData?.activeTriggerData)) {
      if (flowData?.activeTriggerData?.trigger_uuid) {
        const triggerIndex = findIndex(triggerDetails, {
          trigger_uuid: flowData?.activeTriggerData?.trigger_uuid,
        });
        saveFlowPostData.trigger_details[triggerIndex] = getTriggerShortcutPostData(flowData?.activeTriggerData);
      } else {
        saveFlowPostData.trigger_details = [...triggerDetails, getTriggerShortcutPostData(flowData?.activeTriggerData)];
      }
    }
    saveFlowPostData.has_related_flows = true;
    const clonedDetails = cloneDeep(flowData.activeTriggerData);
    if (clonedDetails.document_details && !isEmpty(clonedDetails.document_details.documents)) {
      const documentDetails = {};
      if (clonedDetails.document_details.entity) documentDetails.entity = clonedDetails.document_details.entity;
      if (clonedDetails.document_details.entity_id) documentDetails.entity_id = clonedDetails.document_details.entity_id;
      if (clonedDetails.document_details.ref_uuid) documentDetails.ref_uuid = clonedDetails.document_details.ref_uuid;
      documentDetails.uploaded_doc_metadata = [];
      clonedDetails.document_details.documents.forEach((eachDocument) => {
        const removedDocList = get(clonedDetails, ['removedDocList'], []);
        if (isEmpty(removedDocList) ||
          (isArray(removedDocList) && !removedDocList.includes(eachDocument.fileId))) {
          if (eachDocument.newDocument) {
            documentDetails.uploaded_doc_metadata.push({
              document_id: eachDocument.fileId,
              type: eachDocument.type,
              upload_signed_url: eachDocument.upload_signed_url,
            });
          }
        }
        if (isArray(removedDocList) && !isEmpty(removedDocList)) {
          documentDetails.removed_doc_list = removedDocList;
        }
      });
      if (!isEmpty(documentDetails.uploaded_doc_metadata)) {
        saveFlowPostData.document_details = documentDetails;
      }
    }
  } else {
    saveFlowPostData.has_related_flows = false;
  }
  return saveFlowPostData;
};

export const getNodePositionForFlow = (stepsList = []) => {
  const steps = [];
  stepsList.forEach((step) => {
    step.coordinate_info = {};
    step.coordinate_info = {
      step_coordinates: { x: 0, y: 0 },
    };
    steps.push(step);
  });
  return steps;
};

export const updatePostFormFieldValuesInState = (
  postFormData,
  sectionIndex,
  fieldIndex,
  flowDataParam,
  updateFlowData,
) => {
  const { sections } = cloneDeep(flowDataParam);
  if (
    nullCheck(postFormData, `sections.${sectionIndex}.fields.${fieldIndex}`) &&
    nullCheck(sections, `${sectionIndex}.fields.${fieldIndex}`)
  ) {
    const postFieldData =
      postFormData.sections[sectionIndex].fields[fieldIndex];
    if (
      postFieldData.field_type === FIELD_TYPES.CHECKBOX ||
      postFieldData.field_type === FIELD_TYPES.DROPDOWN ||
      postFieldData.field_type === FIELD_TYPES.RADIO_GROUP
    ) {
      sections[sectionIndex].fields[fieldIndex].values =
        postFieldData.values.join();
      updateFlowData({ sections });
    }
  }
};

export const getStepBasicDetails = (details) => {
  console.log('steporder check', details);
  const { flowData } = cloneDeep(store.getState().EditFlowReducer);
  const currentStep = find(flowData.steps, {
    step_order: details.step_order,
  });
  const { rule } = flowData;
  const { selected_assignee_type } =
    rule.length > 0 && rule[details.step_order - 1];
  const data =
    selected_assignee_type === ASSIGNEE_TYPE.DIRECT_ASSIGNEE
      ? {
        step_name: trimString(currentStep.step_name),
        step_description: currentStep.step_description,
        // assignees: currentStep.assignees,
        // actions: currentStep.actions,
      }
      : {
        step_name: trimString(currentStep.step_name),
        step_description: currentStep.step_description,
        // actions: currentStep.actions,
      };

  return data;
};

export const getBasicUsernamesFromUserDetails = (users = []) => {
  if (isEmpty(users) || !users) return null;
  const basicUsername = compact(users.map((user) => (user.user_type === ROLES.MEMBER) ? user.username : null));
  const consolidatedBasicUsername = isArray(basicUsername) ? basicUsername.join(COMMA + SPACE) : null;
  return consolidatedBasicUsername;
};

export const getReassigneeValidation = (reassignedOwners) => {
  if (
    (get(reassignedOwners, ['users'], []) || []).length === 0 &&
    (get(reassignedOwners, ['teams'], []) || []).length === 0
  ) {
    return FLOW_OWNERS.REQUIRED_ERROR;
  } else return '';
};

export const INITIAL_ACTION_VALUE = {
  action_type: ACTION_TYPE.FORWARD,
  action_name: 'Submit',
  is_next_step_rule: false,
  is_condition_rule: false,
  next_step_uuid: [],
  // added for happy path alone
  button_color: BUTTON_COLOR_TYPES.POSITIVE,
  button_position: BUTTON_POSITION_TYPES.RIGHT,
  allow_comments: ALLOW_COMMENTS.NO_COMMENTS,
};

export const NON_PRIVATE_TEAMS_PARAMS = {
  team_type: NON_PRIVATE_TEAM_TYPES,
};

export const ALL_USER_TYPES = {
  user_types: [ROLES.ADMIN, ROLES.MEMBER, ROLES.FLOW_CREATOR],
};

export const PRIVATE_TEAMS_PARAMS = {
  team_type: PRIVATE_TEAM_TYPES,
};

export const getAssigneeLabel = (assignees = [], steps = [], field_details = []) => {
  const assigneeLabels = [];
  assignees.forEach(({ assignee_type, other_step_uuids, assignee_field_uuids, condition_rule }) => {
    const labelArray = [];
    switch (assignee_type) {
      case ASSIGNEE_TYPE.OTHER_STEP_ASSIGNEE:
      case ASSIGNEE_TYPE.INITIATOR_REPORTING_MANAGER:
        if (other_step_uuids) {
          const filteredSteps = steps.filter(({ step_uuid }) => other_step_uuids?.includes(step_uuid));
          filteredSteps?.forEach(({ step_name }) => labelArray.push(step_name));
          assigneeLabels.push({
            id: assignee_type,
            label: assignee_type === ASSIGNEE_TYPE.OTHER_STEP_ASSIGNEE ?
              `${i18next.t('flows.assignee.other_step_assignee')} ${labelArray?.join(',')}` :
              `${i18next.t('flows.assignee.reporting_other_step')} ${labelArray?.join(',')}`,
          });
        }
        break;
      case ASSIGNEE_TYPE.FORM_FIELD_ASSIGNEE:
      case ASSIGNEE_TYPE.FORM_FIELD_REPORTING_MANAGER:
        if (assignee_field_uuids) {
          const filteredFields = field_details?.filter(({ field_uuid }) => assignee_field_uuids?.includes(field_uuid));
          filteredFields?.forEach(({ field_name, reference_name }) => labelArray?.push(getFieldLabelWithRefName(field_name, reference_name)));
          assigneeLabels.push({
            id: assignee_type,
            label: assignee_type === ASSIGNEE_TYPE.FORM_FIELD_ASSIGNEE ?
              `${i18next.t('flows.assignee.user_field')} ${labelArray?.join(',')}` :
              `${i18next.t('flows.assignee.user_field_reporting_manager')} ${labelArray?.join(',')}`,
          });
        }
        break;
      case ASSIGNEE_TYPE.RULE_BASED:
        if (condition_rule) {
          assigneeLabels.push({
            id: assignee_type,
            label: `${i18next.t('flows.assignee.condition_based')}`,
          });
        }
        break;
      default:
        break;
    }
  });
  return assigneeLabels;
};

export const deleteStep = async (activeStepIndex) => {
  await store.dispatch(deleteStepAPIThunk(activeStepIndex));
  store.dispatch(updateFlowStateChange({
    selectedStepType: null,
    activeStepId: null,
    isNodeConfigOpen: false,
  }));
};

export const calculateActionButtonName = (actions = [], actionRootString = 'Sumbit') => {
  let maxIndex = -1;
  if (!isEmpty(actions)) {
    actions.forEach((eachAction) => {
      if (eachAction?.action_name?.includes('Submit')) {
        const currentIndex = eachAction.action_name.replace('Submit', '');
        if ((currentIndex > maxIndex) && !Number.isNaN(currentIndex)) maxIndex = Number(currentIndex);
      }
    });
  } else {
    maxIndex = EMPTY_STRING;
  }
  if (maxIndex === -1) maxIndex = EMPTY_STRING;
  return maxIndex !== EMPTY_STRING ? actionRootString.concat(maxIndex + 1) : actionRootString;
};

export const calculateStepName = (stepType, callBackFn, t = translateFunction) => {
  const rootString = t(STEP_LABELS[stepType]);
  const rootStringLowerCase = rootString?.toLowerCase();
  let maxIndex = -1;
  const { flowData } = cloneDeep(store.getState().EditFlowReducer);
  flowData.steps.forEach((eachStep) => {
    const stepNameLowerCase = eachStep?.step_name?.toLowerCase();
    if (stepNameLowerCase?.includes(rootStringLowerCase)) {
      const stepIndex = stepNameLowerCase.replace(rootStringLowerCase, '');
      if (stepIndex > maxIndex && !Number.isNaN(stepIndex)) {
        maxIndex = Number(stepIndex);
      }
    }
  });
  if (maxIndex === -1) maxIndex = EMPTY_STRING;
  if (maxIndex === 0) maxIndex = 1;
  const stepName = maxIndex !== EMPTY_STRING ? rootString.concat(maxIndex + 1) : rootString;
  callBackFn?.(stepName);
  return stepName;
};

export const removeDeletedStepFromConnectedSteps = (flowData, removedSteps) => {
  const steps = get(flowData, ['steps'], []).filter((step) => !removedSteps.includes(step.step_uuid));
  const updatedSteps = steps.map((step, stepIndex) => {
    const stepData = cloneDeep(step);
    const { connected_steps } = stepData;
    if (!isEmpty(connected_steps) && connected_steps.some((connected_step) =>
      removedSteps.includes(connected_step))) {
      stepData.connected_steps = connected_steps.filter((connected_step) =>
        !removedSteps.includes(connected_step));
    }
    stepData.step_order = stepIndex + 1;
    return stepData;
  });
  return updatedSteps;
};

export const getTriggerFieldsLength = (triggerMapping) => {
  let fieldsCount = 0;
  if (isEmpty(triggerMapping)) return fieldsCount;
  triggerMapping?.map((mapping) => {
    if (mapping?.field_mapping) {
      fieldsCount += mapping.field_mapping.length;
    } else {
      fieldsCount += 1;
    }
    return null;
  });
  return fieldsCount;
};

export const getActiveUsers = (
  all_assignees = {
    users: [],
    teams: [],
  },
) => {
  let users = [];
  if (!isEmpty(all_assignees?.users)) {
    users = (all_assignees?.users || []).filter((each_user) => each_user?.is_active);
  }

  return {
    ...(all_assignees || {}),
    users: users,
  };
};

export const formatGetFlowDataResponse = (res) => {
  const flowData = {
    flow_id: res._id,
    flow_uuid: res.flow_uuid,
    flow_color: res.flow_color,
    flow_name: res.flow_name,
    saved_flow_name: res.flow_name,
    flow_short_code: res?.flow_short_code || getShortCode(res.flow_name),
    isFlowShortCodeSaved: res?.version > 1,
    technical_reference_name: res?.technical_reference_name,
    isTechnicalRefercenNameSaved: res?.version > 1,
    status: res.status,
    version: res.version,
    flow_description: res.flow_description,
    tabIndex: EDIT_FLOW_TAB_INDEX.BASIC_INFO,
    is_participants_level_security: has(res, ['is_participants_level_security']) ? res.is_participants_level_security : true,
    is_row_security_policy: res.is_row_security_policy,
    allow_additional_viewers: res.additional_viewers
      ? FLOW_STRINGS.ALLOW_VIEWERS_TRUE
      : FLOW_STRINGS.ALLOW_VIEWERS_FALSE,
    allow_owners: res.additional_owners
      ? FLOW_STRINGS.ALLOW_ADDITIONAL_OWNERS_TRUE
      : FLOW_STRINGS.ALLOW_ADDITIONAL_OWNERS_FALSE,
    custom_identifier: get(res, ['custom_identifier'], null),
    is_system_identifier: get(res, 'is_system_identifier', true),
    category: {},
    additional_viewers: getActiveUsers(res?.viewers),
    reassignedOwners: getActiveUsers(res?.owners),
    owners: getActiveUsers(res?.admins),
    entityViewers: cloneDeep(getActiveUsers(res?.entity_viewers)),
    entityViewersMetaData: cloneDeep(getActiveUsers(res?.entity_viewers)),
    task_identifier: [],
    stepStatuses: res?.step_statuses || [DEFAULT_STEP_STATUS],
  };
  if (res.category_id) {
    flowData.category = {
      category_id: res.category_id,
      category_name: res.category_name,
    };
  }
  if (res.task_identifier) {
    res?.task_identifier?.forEach((identifier) => {
      flowData.task_identifier.push({
        ...identifier,
        value: identifier.field_uuid,
        id: identifier.field_uuid,
      });
    });
  }
  return flowData;
};

export const getFormattedStepDetail = (dataParam = {}, flowData, postData) => {
  const data = cloneDeep(dataParam);
  const { step_assignees = [] } = data;
  if (step_assignees) {
    data.assigneeLabels = getAssigneeLabel(step_assignees, flowData?.steps, data?.field_details);
  }
  if (postData?.connected_steps) {
    data.connected_steps = postData.connected_steps;
  }
  return data;
};

export const getFormattedStepDetails = (data = {}, t = translateFunction, systemFields = []) => {
  if (data.step_type === STEP_TYPE.USER_STEP) {
    data.step_status = data.step_status || DEFAULT_STEP_STATUS;
    if (isUndefined(data.step_assignees) || isEmpty(data.step_assignees)) {
      data.step_assignees = [];
      data.step_assignees.push({
        assignee_type: ASSIGNEE_TYPE.DIRECT_ASSIGNEE,
      });
      data.progress = EDIT_FLOW_STEP_TABS.CREATE_FORM;
    } else {
      data.step_assignees = getAssigneesData(data.step_assignees, data.field_details, systemFields, USER_STEP_ASSIGNEE_OBJECT_KEYS);
      // data.assigneeLabels = getAssigneeLabel(data?.step_assignees, flowData?.steps, data?.field_details);
      if (!(isEmpty(data.email_actions) && isEmpty(data.data_list_mapping) && isEmpty(data.document_generation))) {
        data.progress = EDIT_FLOW_STEP_TABS.ADD_ON_CONFIGURATION;
      } else {
        const directAssigneeData = find(data.step_assignees, { assignee_type: ASSIGNEE_TYPE.DIRECT_ASSIGNEE });
        if (isEmpty(directAssigneeData?.assignees?.users) && isEmpty(directAssigneeData?.assignees?.teams)) { // update function here
          data.progress = EDIT_FLOW_STEP_TABS.CREATE_FORM;
        } else {
          data.progress = EDIT_FLOW_STEP_TABS.SET_ASSIGNEE;
        }
      }
    }
    if (isEmpty(data.actions)) {
      data.progress = EDIT_FLOW_STEP_TABS.CREATE_FORM;
    }
    data.due_data = isEmpty(data?.due_data)
      ? {
        [CONFIG_FIELD_KEY.TYPE]: DATA_TYPE.DIRECT,
        [CONFIG_FIELD_KEY.DURATION]: null,
        [CONFIG_FIELD_KEY.DURATION_TYPE]:
          DUE_DATE_VALUE_TYPE.DAYS,
      }
      : data.due_data;
    data.savedProgress = data.progress;
    data.step_id = data._id;
    data.step_status = data?.step_status || DEFAULT_STEP_STATUS;
    data.active_email_action = {};
    data.active_escalation = {};
    data.active_data_list_mapping = {};
    data.active_document_action = {};
  } else if (data.step_type === STEP_TYPE.INTEGRATION) {
    const { integration_details = {} } = data;
    if (isEmpty(integration_details?.connector_name)) {
      data.integration_details = {
        connector_name: EMPTY_STRING,
        connector_uuid: EMPTY_STRING,
        _id: EMPTY_STRING,
      };
      data.integration_error_list =
      {
        ...data.integration_error_list,
        connector_uuid: t((INTEGRATION_CONSTANTS.BASIC_CONFIGURATION.APP.DELETED)),
      };
    }
    if (integration_details?.event_name) {
      data.event_details = {
        method: integration_details?.method,
        end_point: integration_details?.end_point,
        name: integration_details?.event_name,
        event_uuid: integration_details?.event_uuid,
      };
    } else {
      data.event_details = {
        method: EMPTY_STRING,
        end_point: EMPTY_STRING,
        name: EMPTY_STRING,
        event_uuid: EMPTY_STRING,
      };
      data.integration_error_list =
      {
        ...data.integration_error_list,
        event_uuid: t(INTEGRATION_CONSTANTS.BASIC_CONFIGURATION.EVENT.DELETED),
      };
    }
    const failureActionIndex = (data?.actions || []).findIndex((action) => action.action_type === ACTION_TYPE.FORWARD_ON_FAILURE);
    if (failureActionIndex > -1) {
      data.failure_action = INTEGRATION_FAILURE_ACTION.ASSIGN_TO_STEP;
    } else data.failure_action = INTEGRATION_FAILURE_ACTION.CONTINUE;
    if (!has(data, ['skip_during_testbed'])) {
      data.skip_during_testbed = true;
    }
  } else if (data.step_type === STEP_TYPE.ML_MODELS) {
    const failureActionIndex = (data?.actions || []).findIndex((action) => action.action_type === ACTION_TYPE.FORWARD_ON_FAILURE);
    if (failureActionIndex > -1) {
      data.failure_action = INTEGRATION_FAILURE_ACTION.ASSIGN_TO_STEP;
    } else data.failure_action = INTEGRATION_FAILURE_ACTION.CONTINUE;
    if (!has(data, ['skip_during_testbed'])) {
      data.skip_during_testbed = true;
    }
  }
  return data;
};

export const getFormatStepDataForFlowDiagram = (data = {}, flowData = {}) => {
  if (data.step_type === STEP_TYPE.USER_STEP) {
    data.progress = EDIT_FLOW_STEP_TABS.ADD_ON_CONFIGURATION;
    if (data?.step_assignees?.length > 0) {
      data.assigneeLabels = getAssigneeLabel(data?.step_assignees, flowData?.steps, data?.field_details);
    }
    if (isEmpty(data.actions)) {
      data.progress = EDIT_FLOW_STEP_TABS.CREATE_FORM;
    }
    data.savedProgress = data.progress;
  }
  return data;
};

export const updateSomeoneIsEditingPopover = (errorMessage, options) => {
  const { flowData } = store.getState().EditFlowReducer;
  const { time, isMoreThanHoursLimit } = getFormattedDateFromUTC(
    errorMessage.edited_on,
    SOMEONE_IS_EDITING,
  );
  const isCurrentUser = getCurrentUserId() === errorMessage.user_id;
  let editSubtitle = null;
  if (isCurrentUser) {
    editSubtitle = SOMEONE_IS_EDITING_ERROR.SAME_USER;
  } else {
    editSubtitle = `${errorMessage.full_name} (${errorMessage.email}) ${SOMEONE_IS_EDITING_ERROR.DIFFERENT_USER}`;
  }
  updateEditConfirmPopOverStatus({
    title: SOMEONE_IS_EDITING_ERROR.FLOW.TITLE,
    subTitle: editSubtitle,
    secondSubTitle: isCurrentUser
      ? EMPTY_STRING
      : `${SOMEONE_IS_EDITING_ERROR.DESCRIPTION_LABEL} ${time}`,
    status: FORM_POPOVER_STATUS.SERVER_ERROR,
    isVisible: false,
    isEditConfirmVisible: true,
    type: SOMEONE_IS_EDITING_ERROR.FLOW.TYPE,
    enableDirectEditing: isCurrentUser && isMoreThanHoursLimit,
    params: {
      flow_id: flowData?.flow_id || options.flow_id,
      flow_uuid: flowData?.flow_uuid || options.flow_uuid,
    },
  });
};

export const getConnectedStepsFromActions = (actions = []) => {
  const connectedSteps = [];
  actions?.forEach((action) => {
    (action?.next_step_uuid || []).forEach((uuid) =>
      connectedSteps.push({ step_uuid: uuid, style: 'step' }),
    );
    (action?.context_data?.steps || []).forEach((uuid) =>
      connectedSteps.push({ step_uuid: uuid, style: 'step' }),
    );
  });
  const uniqueConnectedSteps = uniqBy(connectedSteps, (s) => s.step_uuid) || [];
  actions.connected_steps = uniqueConnectedSteps;
  return uniqueConnectedSteps;
};

export const constructPostDataForCreateStep = (data) => {
  const postData = {};
  postData[NODE_BE_KEYS.STEP_NAME] = data[NODE_FE_KEYS.STEP_NAME];
  postData[NODE_BE_KEYS.STEP_TYPE] = data[NODE_FE_KEYS.STEP_TYPE];
  postData[NODE_BE_KEYS.COORDINATE_INFO] = data[NODE_FE_KEYS.COORDINATE_INFO] || (
    {
      [NODE_BE_KEYS.STEP_COORDINATES]: { [NODE_BE_KEYS.X]: 0, [NODE_BE_KEYS.Y]: 0 },
    });
  return postData;
};

export const getStepAssigneeOptionList = (t) => ([
  {
    label: t('flow_strings.step_configuration.send_email.general.teams_or_users'),
    value: ASSIGNEE_TYPE.DIRECT_ASSIGNEE,
  },
  {
    label: t('flow_strings.step_configuration.send_email.general.user_fields'),
    value: ASSIGNEE_TYPE.FORM_FIELDS,
  },
  {
    label: t('flow_strings.step_configuration.send_email.general.system_fields'),
    value: ASSIGNEE_TYPE.SYSYEM_FIELDS,
  },
  {
    label: t('flow_strings.step_configuration.send_email.general.rule_based'),
    value: ASSIGNEE_TYPE.RULE_BASED,
  },
  {
    label: t('flow_strings.step_configuration.send_email.general.form_reporting_manager'),
    value: ASSIGNEE_TYPE.FORM_REPORTING_MANAGER_ASSIGNEE,
  },
]);
