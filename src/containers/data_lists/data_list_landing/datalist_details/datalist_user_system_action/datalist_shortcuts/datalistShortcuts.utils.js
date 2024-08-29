import Joi from 'joi';
import { validate } from '../../../../../../utils/UtilityFunctions';
import { cloneDeep, isEmpty } from '../../../../../../utils/jsUtility';
import { FIELD_TYPE } from '../../../../../../utils/constants/form.constant';
import { getTriggerDetailsPostData } from '../../../../../edit_flow/step_configuration/node_configurations/call_another_flow/CallAnotherFlow.utils';
import { FIELD_VALUE_TYPES } from '../../../../../edit_flow/step_configuration/node_configurations/row_components/RowComponents.constants';
import { constructStaticValues } from '../../../../../edit_flow/node_configuration/NodeConfiguration.utils';
import { DOCUMENT_TYPES } from '../../../../../../utils/strings/CommonStrings';

export const validateDLShortcut = (data) => {
    const _data = {
      childFlowUUID: data.childFlowUUID,
      triggerName: data.triggerName,
    };

    const schema = Joi.object().keys({
        childFlowUUID: Joi.string().required().label('Child Flow'),
        triggerName: Joi.string().required().label('Shortcut Name'),
    }).unknown();

    return validate(_data, schema);
};

export const constructTriggerDetails = (mapping) => {
    const triggerMapping = [];
    mapping?.forEach((field) => {
        if (field.is_deleted) return;
        if (field?.fieldType !== FIELD_TYPE.TABLE) {
            if (!isEmpty(field?.value)) {
                triggerMapping.push({
                    child_field_uuid: field?.fieldUuid,
                    value_type: field?.valueType,
                    value: field.value,
                });
            }
        } else {
            const tableChilds = [];
            field?.tableColumnMapping?.forEach((childField) => {
                if (childField.is_deleted) return;
                if (!isEmpty(childField?.value)) {
                    tableChilds.push({
                        child_field_uuid: childField?.fieldUuid,
                        value_type: childField?.valueType,
                        value: childField.value,
                    });
                }
            });
            if (!isEmpty(tableChilds)) {
                triggerMapping.push({
                    child_table_uuid: field?.fieldUuid,
                    parent_table_uuid: field.value,
                    field_mapping: tableChilds,
                });
            }
        }
    });
    return triggerMapping;
};

export const deconstructTriggerDetails = (mapping, options = {}) => {
    const { fieldDetails, documentURLDetails, isParentDatalist } = options;
    const triggerMapping = [];

    const deconstructSingleMapping = (mappingData) => {
      const _mapping = {
        childFieldUuid: mappingData.child_field_uuid,
        valueType: mappingData.value_type,
        value: mappingData.value,
      };
      if (mappingData.value_type === FIELD_VALUE_TYPES.STATIC) {
        const selectedChildField = fieldDetails?.find(
          (f) => f?.fieldUuid === mappingData.child_field_uuid,
        );
        _mapping.value = constructStaticValues(
          mappingData.value,
          selectedChildField?.fieldType,
          documentURLDetails,
          '', // flow id
          '', // step id
          isParentDatalist
            ? DOCUMENT_TYPES.DATA_LIST_RELATED_ACTIONS
            : DOCUMENT_TYPES.SUB_FLOW_DOCUMENTS,
          { isParseNumber: false },
        );
      }
      return _mapping;
    };

    (mapping || []).forEach((mappingData) => {
        if (!isEmpty(mappingData?.parent_table_uuid)) {
            triggerMapping.push({
              childFieldUuid: mappingData.child_table_uuid,
              valueType: FIELD_VALUE_TYPES.DYNAMIC,
              value: mappingData.parent_table_uuid,
              tableColumnMapping: mappingData?.field_mapping?.map(deconstructSingleMapping),
            });
        } else {
            const _mapping = deconstructSingleMapping(mappingData);
            triggerMapping.push(_mapping);
        }
    });

    return triggerMapping;
};

export const constructShortcutPostData = (shortcut, options) => {
  const { parentData, triggerUUID } = options;

  const postData = { ...parentData, has_related_flows: true };
  const triggerData = {
    child_flow_uuid: shortcut.childFlowUUID,
    trigger_name: shortcut.triggerName,
  };

  if (triggerUUID) triggerData.trigger_uuid = triggerUUID;

  if (!isEmpty(shortcut.triggerMapping)) {
    const triggerDetails = getTriggerDetailsPostData({
      mapping: shortcut.triggerMapping,
      childFlowUuid: shortcut.childFlowUUID,
    });
    if (!isEmpty(triggerDetails.trigger_mapping)) triggerData.trigger_mapping = triggerDetails.trigger_mapping;
  }

  if (shortcut.documentDetails?.uploadedDocMetadata || shortcut.documentDetails?.removedDocList) {
    postData.document_details = {};

    if (!isEmpty(shortcut.documentDetails?.uploadedDocMetadata)) {
      postData.document_details = { ...shortcut.documentDetails };
      postData.document_details.uploaded_doc_metadata = cloneDeep(shortcut.documentDetails?.uploadedDocMetadata);
    }

    if (!isEmpty(shortcut.documentDetails?.removedDocList)) {
      postData.document_details.removed_doc_list = cloneDeep(shortcut.documentDetails?.removedDocList);
    }

    delete postData.document_details.uploadedDocMetadata;
    delete postData.document_details.removedDocList;
  }

  const triggerDetails = parentData.trigger_details || [];

  if (triggerUUID) {
    const triggerIdx = triggerDetails.findIndex(
      (t) => t.trigger_uuid === triggerUUID,
    );
    if (triggerIdx > -1) triggerDetails[triggerIdx] = triggerData;
  } else {
    triggerDetails.push(triggerData);
  }

  if (!isEmpty(triggerDetails)) postData.trigger_details = triggerDetails;

  return postData;
};

export const deconstructShortcutData = (trigger, options = {}) => {
  const { fieldMetadata = [], documentURLDetails = [], isParentDatalist = false, t } = options;
  const errorList = {};
  const data = {
    id: trigger.id,
    childFlowUUID: trigger.childFlowUUID,
    childFlowId: trigger.childFlowId,
    childFlowName: trigger.childFlowName,
    triggerName: trigger.triggerName,
    fieldDetails: [],
    documentURLDetails: cloneDeep(documentURLDetails),
  };

  if (!isEmpty(trigger.trigger_mapping)) {
    const fieldDetails = fieldMetadata.map((f) => {
      return { ...f, _id: f.id, fieldUuid: f.fieldUUID };
    });

    const triggerMapping = deconstructTriggerDetails(trigger.trigger_mapping, {
      fieldDetails,
      documentURLDetails,
      isParentDatalist,
    });
    data.triggerMapping = [];
    data.serverTriggerMapping = cloneDeep(triggerMapping);
    data.fieldDetails = fieldDetails;
    if (!isEmpty(triggerMapping)) data.showAutofill = true;
  }

  if (trigger.childFlowUUID && !trigger.childFlowName && !trigger.childFlowId) { // child flow is deleted;
    errorList.childFlowUUID = t('common_strings.flow_deleted');
    delete data.childFlowUUID;
  }

  return [data, errorList];
};

export const convertFieldDetailsForMapping = (fieldData) => {
  const updatedFieldDetails = fieldData?.map((field) => {
    const updatedField = field;
    if (field?.dataListDetails?.dataListUUID) {
      updatedField.dataListDetails = {
        dataListUuid: field?.dataListDetails?.dataListUUID,
        displayFields: field?.dataListDetails?.displayFields,
      };
    }
    if (field?.propertyPickerDetails) {
      field.property_picker_details = {};
      field.property_picker_details.reference_field_type = field?.propertyPickerDetails?.referenceFieldType;
      field.property_picker_details.reference_field_choice_value_type = field?.propertyPickerDetails?.referenceFieldChoiceValueType;
    }
    if (field?.sourceDataListDetails?.dataListUUID) {
      updatedField.source_data_list_details = {
        dataListUuid: field?.sourceDataListDetails?.dataListUUID,
        displayFields: field?.sourceDataListDetails?.displayFields,
      };
    }
    return updatedField;
  });
  return updatedFieldDetails;
};
