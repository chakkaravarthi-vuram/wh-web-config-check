import { consolidateMetricFields } from 'containers/edit_flow/EditFlow.utils';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { constructStaticValues, constructTriggerMappingPostData, getStaticValue } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import { MAPPING_CONSTANTS } from 'components/flow_trigger_configuration/field_mapping/FieldMapping.constants';
import React from 'react';
import jsUtils, { nullCheck, isEmpty, findIndex, cloneDeep, unset, get, isArray } from '../../../utils/jsUtility';
import { getUsersAndTeamsIdObj, trimString } from '../../../utils/UtilityFunctions';
import { OWNERS_VALIDATION } from './CreateDataList.strings';
import BasicDetailsIcon from '../../../assets/icons/teams/BasicDetailsIcon';
import DiscardIcon from '../../../assets/icons/integration/DiscardIcon';
import Trash from '../../../assets/icons/application/Trash';
import { constructPolicyForConditionBasedData } from '../../edit_flow/security/policy_builder/PolicyBuilder.utils';

export const getBasicDataListDetailsSavePostData = (dataListDetails) => {
  const {
    data_list_name, data_list_description, data_list_color, data_list_uuid,
  } = dataListDetails;
  return {
    data_list_name,
    data_list_description,
    data_list_color,
    data_list_uuid,
  };
};

const getExistingTriggerShortcutPostData = (currentTriggerData) => {
  const clonedTriggerData = cloneDeep(currentTriggerData);
  clonedTriggerData?.trigger_mapping?.forEach((eachMapping, index) => {
    const fieldMapping = [];
    if (!isEmpty(get(eachMapping, [MAPPING_CONSTANTS.FIELD_MAPPING.ID], []))) {
      eachMapping.field_mapping.forEach((eachSubMapping) => {
        let { static_value } = cloneDeep(eachSubMapping);
        if (static_value) {
        if ((jsUtils.has(static_value, ['entry_details']))) {
          static_value = constructStaticValues(static_value, FIELD_TYPES.DATA_LIST);
        }
        const fieldType = jsUtils.has(eachSubMapping?.static_value, ['entry_details']) && FIELD_TYPES.DATA_LIST;
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
      if ((jsUtils.has(static_value, ['entry_details']))) {
        static_value = constructStaticValues(static_value, FIELD_TYPES.DATA_LIST);
      }
      const fieldType = jsUtils.has(eachMapping?.static_value, ['entry_details']) && FIELD_TYPES.DATA_LIST;
      static_value = getStaticValue(static_value, fieldType);
      }
    if (eachMapping.value_type === MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[0].value) {
      clonedTriggerData.trigger_mapping[index].static_value = static_value;
    }
  });
  unset(clonedTriggerData, 'child_flow_name');
  return clonedTriggerData;
};

const getTriggerShortcutPostData = (currentTriggerData) => {
  const clonedTriggerData = cloneDeep(currentTriggerData);
  const data = {};
  data.child_flow_uuid = get(clonedTriggerData, ['child_flow_details', 'child_flow_uuid'], EMPTY_STRING) || EMPTY_STRING;
  data.trigger_name = clonedTriggerData?.trigger_name || EMPTY_STRING;
  const triggerMapping = constructTriggerMappingPostData(clonedTriggerData?.trigger_mapping) || [];
  if (!isEmpty(triggerMapping)) {
    data.trigger_mapping = constructTriggerMappingPostData(clonedTriggerData?.trigger_mapping) || [];
  }
  if (currentTriggerData?.trigger_uuid) {
    data.trigger_uuid = currentTriggerData?.trigger_uuid;
  }
  return data;
};

export const getReassignedOwnersValidations = (reassignedOwners) => {
  if (
    (get(reassignedOwners, ['users'], []) || []).length === 0 &&
    (get(reassignedOwners, ['teams'], []) || []).length === 0
  ) {
    return OWNERS_VALIDATION.DATALIST_OWNERS_REQUIRED;
  } else return '';
};

export const getDataListDetailsPostData = (dataListData, isPublish = false) => {
  const saveFlowPostData = {};

  if (isPublish) {
    saveFlowPostData.data_list_uuid = dataListData.data_list_uuid;
  } else {
    if (!jsUtils.isEmpty(dataListData.data_list_short_code)) saveFlowPostData.data_list_short_code = dataListData.data_list_short_code;
    if (!jsUtils.isEmpty(dataListData.data_list_uuid)) {
      saveFlowPostData.data_list_uuid = dataListData.data_list_uuid;
    }
    saveFlowPostData.data_list_name = trimString(dataListData.data_list_name);
    saveFlowPostData.technical_reference_name = dataListData.technical_reference_name;
    if (!jsUtils.isEmpty(dataListData.data_list_description)) {
      saveFlowPostData.data_list_description = dataListData.data_list_description;
    }
    if (!jsUtils.isEmpty(dataListData.data_list_color)) {
      saveFlowPostData.data_list_color = dataListData.data_list_color;
    }

    // Identifier
    if (dataListData.is_system_identifier) {
      saveFlowPostData.is_system_identifier = true;
    } else {
      saveFlowPostData.is_system_identifier = false;
    }
    if (
      saveFlowPostData.is_system_identifier === false
      && dataListData.custom_identifier
      && dataListData.custom_identifier.length > 0
    ) {
      saveFlowPostData.custom_identifier = dataListData.custom_identifier;
    }

    // security
    saveFlowPostData.owners = getUsersAndTeamsIdObj(dataListData.reassignedOwners);
    // if (nullCheck(dataListData.owners, 'teams.length', true) || nullCheck(dataListData.owners, 'users.length', true)) {
    //   saveFlowPostData.additional_owners = true;
    // } else saveFlowPostData.additional_owners = false;

    saveFlowPostData.admins = getUsersAndTeamsIdObj(dataListData.owners);
    // if (nullCheck(dataListData.reassignedOwners, 'teams.length', true) || nullCheck(dataListData.reassignedOwners, 'users.length', true)) {
    //   saveFlowPostData.additional_owners = true;
    // } else saveFlowPostData.additional_owners = false;

    const entryAdders = getUsersAndTeamsIdObj(dataListData.entry_adders);
    if (!jsUtils.isEmpty(entryAdders)) saveFlowPostData.entry_adders = entryAdders;

    if (nullCheck(dataListData?.viewers, 'teams.length', true)) {
      dataListData.viewers.teams = dataListData.viewers.teams.map(
        (eachTeam) => eachTeam._id,
      );
    } else dataListData.viewers.teams = [];
    if (nullCheck(dataListData?.viewers, 'users.length', true)) {
      dataListData.viewers.users = dataListData.viewers.users.map(
        (eachUser) => eachUser._id,
      );
    } else dataListData.viewers.users = [];

    if (!jsUtils.isEmpty(dataListData.viewers)) saveFlowPostData.viewers = dataListData.viewers;

    // if (nullCheck(dataListData.viewers, 'teams.length', true) || nullCheck(dataListData.viewers, 'users.length', true)) {
    //   saveFlowPostData.additional_viewers = true;
    // } else saveFlowPostData.additional_viewers = false;

    saveFlowPostData.is_participants_level_security = dataListData.is_participants_level_security;

    saveFlowPostData.entity_viewers = {};

    if (nullCheck(dataListData?.entityViewers, 'teams.length', true)) {
      dataListData.entityViewers.teams = dataListData.entityViewers.teams.map(
        (eachTeam) => eachTeam._id,
      );
    } else dataListData.entityViewers.teams = [];

    if (nullCheck(dataListData?.entityViewers, 'users.length', true)) {
      dataListData.entityViewers.users = dataListData.entityViewers.users.map(
        (eachUser) => eachUser._id,
      );
    } else dataListData.entityViewers.users = [];

    if (!jsUtils.isEmpty(dataListData.entityViewers)) saveFlowPostData.entity_viewers = dataListData.entityViewers;

    if (dataListData?.is_row_security_policy) {
      saveFlowPostData.is_row_security_policy = dataListData?.is_row_security_policy;
      saveFlowPostData.security_policies = constructPolicyForConditionBasedData(dataListData?.policyList);
    } else {
      saveFlowPostData.is_row_security_policy = false;
    }

    // Trigger Shortcut
    if (!isEmpty(dataListData?.trigger_details) || !isEmpty(dataListData?.activeTriggerData)) {
      const triggerDetails = dataListData?.trigger_details?.map((trigger) => getExistingTriggerShortcutPostData(trigger)) || [];
      saveFlowPostData.trigger_details = triggerDetails;
      if (!isEmpty(dataListData?.activeTriggerData)) {
        if (dataListData?.activeTriggerData?.trigger_uuid) {
          const triggerIndex = findIndex(triggerDetails, {
            trigger_uuid: dataListData?.activeTriggerData?.trigger_uuid,
          });
          saveFlowPostData.trigger_details[triggerIndex] = getTriggerShortcutPostData(dataListData?.activeTriggerData);
        } else {
          saveFlowPostData.trigger_details = [...triggerDetails, getTriggerShortcutPostData(dataListData?.activeTriggerData)];
        }
        const clonedDetails = cloneDeep(dataListData.activeTriggerData);
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
      }
      saveFlowPostData.has_related_flows = true;
    } else {
      saveFlowPostData.has_related_flows = false;
    }

    // system actions
    saveFlowPostData.has_system_events = dataListData.has_system_events || false;

    // Metrics
    let metrics = null;
    if (nullCheck(dataListData, 'metrics.metric_fields.length', true)) {
      metrics = [];
      const metricFields = consolidateMetricFields(dataListData.metrics.metric_fields);
      if (!jsUtils.isEmpty(metricFields)) {
        metricFields.forEach((metricsData) => {
          metrics.push({
            label: metricsData.label || metricsData.field_name,
            field_uuid: metricsData.field_uuid,
          });
        });
      } else metrics = null;
    }
      saveFlowPostData.default_report_fields = metrics;

    // category
    if (!isEmpty(dataListData.category)) {
      saveFlowPostData.category_id = dataListData?.category?.category_id;
    }
  }
  return saveFlowPostData;
};

export const deleteAndReorderSections = (sections, sectionId) => {
  jsUtils.remove(sections, { section_order: sectionId });
  const reOrderedSections = sections;
  let sectionOrderRearrange = 1;
  if (sections[sectionId - 1]) {
    reOrderedSections.map((section) => {
      reOrderedSections[sectionOrderRearrange - 1].section_order = sectionOrderRearrange;
      sectionOrderRearrange += 1;
      return section;
    });
  }
  return reOrderedSections;
};

export const deleteAndReOrderSectionsAndFields = (sections, sectionId, fieldId) => {
  jsUtils.remove(sections[sectionId - 1].fields, { row_order: fieldId });
  const reOrderedSectionsAndFields = sections;
  let rowOrderRearrange = 1;
  if (reOrderedSectionsAndFields[sectionId - 1] && reOrderedSectionsAndFields[sectionId - 1].fields.length) {
    reOrderedSectionsAndFields[sectionId - 1].fields.map((field) => {
      if (reOrderedSectionsAndFields[sectionId - 1].fields[rowOrderRearrange - 1].row_order !== field.row_order) {
        reOrderedSectionsAndFields[sectionId - 1].fields[rowOrderRearrange - 1].is_edited = true;
      }
      reOrderedSectionsAndFields[sectionId - 1].fields[rowOrderRearrange - 1].row_order = rowOrderRearrange;
      rowOrderRearrange += 1;
      return field;
    });
  }
  return reOrderedSectionsAndFields;
};

export const setValuesForField = (sections, sectionId, fieldId, value) => {
  const currentStateField = sections[sectionId - 1].fields[fieldId - 1];
  currentStateField.values = value;
  if (!jsUtils.isEmpty(currentStateField.default_value)) {
    if (!currentStateField.values.includes(currentStateField.default_value)) {
      delete currentStateField.default_value;
    }
  }
  return currentStateField;
};

export const formDetailsObjectNullCheck = (form_details, sectionId, fieldId) => {
  if (
    !jsUtils.isEmpty(form_details)
    && form_details.sections[sectionId - 1]
    && form_details.sections[sectionId - 1].fields
    && form_details.sections[sectionId - 1].fields[fieldId - 1]
  ) return true;
  return false;
};

export const getFieldIndex = (sections, sectionId, fieldId) => {
  const fieldOrder = sections[sectionId - 1].is_table ? 'column_order' : 'row_order';
  return sections[sectionId - 1].fields.findIndex((field) => field[fieldOrder] === fieldId);
};

export const DL_SECONDARY_ACTIONS_LIST = {
  DELETE: 1,
  SETTINGS: 2,
  DISCARD: 3,
  EDIT_BASIC_DETAILS: 4,
};

export const getDatalistSecondaryActionMenu = (
  isDraft,
  status,
  version,
  translate,
) => {
  console.log(isDraft, status, version, 'jsdgfdhfhdfh');
  if (isDraft) {
    return ((status === 'published') || (version > 1))
      ? [
        {
          label: translate('datalist.create_data_list.edit_name_description'),
          icon: <BasicDetailsIcon />,
          value: DL_SECONDARY_ACTIONS_LIST.EDIT_BASIC_DETAILS,
        },
        {
          label: translate('datalist.create_data_list.discard_datalist'),
          icon: <DiscardIcon />,
          value: DL_SECONDARY_ACTIONS_LIST.DISCARD,
        },
      ]
      : [
        {
        label: translate('datalist.create_data_list.edit_name_description'),
        icon: <BasicDetailsIcon />,
        value: DL_SECONDARY_ACTIONS_LIST.EDIT_BASIC_DETAILS,
        },
        // {
        //   label: translate('datalist.create_data_list.discard_datalist'),
        //   icon: <DiscardIcon />,
        //   value: DL_SECONDARY_ACTIONS_LIST.DISCARD,
        // },
        {
          label: translate('datalist.create_data_list.delete_datalist'),
          icon: <Trash />,
          value: DL_SECONDARY_ACTIONS_LIST.DELETE,
        },
      ];
  }
  return ((status === 'published') || (version > 1))
    ? [
      {
        label: translate('datalist.create_data_list.edit_name_description'),
        icon: <BasicDetailsIcon />,
        value: DL_SECONDARY_ACTIONS_LIST.EDIT_BASIC_DETAILS,
        isChecked: false,
      },
      {
        label: translate('datalist.create_data_list.discard_datalist'),
        icon: <DiscardIcon />,
        value: DL_SECONDARY_ACTIONS_LIST.DISCARD,
        isChecked: false,
      },
      {
        label: translate('datalist.create_data_list.delete_datalist'),
        icon: <Trash />,
        value: DL_SECONDARY_ACTIONS_LIST.DELETE,
        isChecked: false,
      },
    ]
    : [
      {
        label: translate('datalist.create_data_list.edit_name_description'),
        icon: <BasicDetailsIcon />,
        value: DL_SECONDARY_ACTIONS_LIST.EDIT_BASIC_DETAILS,
        isChecked: false,
      },
      // {
      //   label: translate('datalist.create_data_list.discard_datalist'),
      //   icon: <DiscardIcon />,
      //   value: DL_SECONDARY_ACTIONS_LIST.DISCARD,
      // },
      {
        label: translate('datalist.create_data_list.delete_datalist'),
        icon: <Trash />,
        value: DL_SECONDARY_ACTIONS_LIST.DELETE,
        isChecked: false,
      },
    ];
};
