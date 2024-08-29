import { cloneDeep, isEmpty, set } from '../../../../../utils/jsUtility';
import { TRIGGER_CONSTANTS, TRIGGER_RESPONSE_KEYS } from './CallAnotherFlow.constants';
import { normalizer } from '../../../../../utils/normalizer.utils';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { FIELD_VALUE_TYPES } from '../row_components/RowComponents.constants';
import { getStaticValue } from '../../StepConfiguration.utils';
import { formatValidationData } from '../../../../../utils/formUtils';
import { DOCUMENT_TYPES } from '../../../../../utils/strings/CommonStrings';
import { constructStaticValues } from '../../../node_configuration/NodeConfiguration.utils';

const {
    IS_ASYNC,
    IS_MNI,
    CANCEL_WITH_PARENT,
    CHILD_FLOW_UUID,
    ITERATE_FIELD_UUID,
    } = TRIGGER_RESPONSE_KEYS;

export const formatGetCallSubFlowData = (apiData) => {
    const clonedTriggerConstants = cloneDeep(TRIGGER_CONSTANTS);
    const clonedResponseKeys = cloneDeep(TRIGGER_RESPONSE_KEYS);
    clonedResponseKeys.ID = clonedTriggerConstants.ID;
    const stateData = normalizer(apiData, clonedTriggerConstants, clonedResponseKeys);
    stateData[TRIGGER_RESPONSE_KEYS.ID] = stateData?._id;
    console.log('sjkakdkjashdjsa', stateData);
    const mniUuidDetails = stateData?.fieldDetails?.find((eachField) => eachField?.fieldUuid === stateData?.mniUuid);
    stateData.mniUuidLabel = mniUuidDetails?.fieldName;
    stateData.mniUuidType = mniUuidDetails?.fieldType;
    const serverMappingData = [];
    (stateData?.triggerMapping || []).forEach((mappingData) => {
        if (!isEmpty(mappingData?.parent_table_uuid)) {
            const tableChilds = [];
            mappingData?.field_mapping?.forEach((childField = {}) => {
                let fieldValue = childField.value;

                if (childField?.valueType === FIELD_VALUE_TYPES.STATIC) {
                    const selectedChildField = stateData?.fieldDetails?.find((eachField) => eachField?.fieldUuid === childField?.childFieldUuid);
                    fieldValue = constructStaticValues(childField.value, selectedChildField?.fieldType, stateData?.document_url_details, stateData?.flowId, stateData?.stepId, DOCUMENT_TYPES.SUB_FLOW_DOCUMENTS, { isParseNumber: true });
                }

                tableChilds.push({
                    ...childField,
                    value: fieldValue,
                });
            });
            if (!isEmpty(tableChilds)) {
                serverMappingData.push({
                    childFieldUuid: mappingData.child_table_uuid,
                    valueType: FIELD_VALUE_TYPES.DYNAMIC,
                    value: mappingData.parent_table_uuid,
                    tableColumnMapping: tableChilds,
                });
            }
        } else {
            if (mappingData?.valueType === FIELD_VALUE_TYPES.STATIC) {
                const selectedChildField = stateData?.fieldDetails?.find((eachField) => eachField?.fieldUuid === mappingData?.childFieldUuid);
                mappingData.value = constructStaticValues(mappingData.value, selectedChildField?.fieldType, stateData?.document_url_details, stateData?.flowId, stateData?.stepId, DOCUMENT_TYPES.SUB_FLOW_DOCUMENTS, { isParseNumber: true });
            }
            serverMappingData.push(mappingData);
        }
    });
    stateData.triggerMapping = serverMappingData;
    console.log('kjbhjavghas', serverMappingData, stateData);

    return stateData;
};

export const getTriggerDetailsPostData = (state) => {
    const clonedData = cloneDeep(state);
    const clonedMapping = clonedData?.mapping;
    const triggerDetails = {
        child_flow_uuid: clonedData?.[CHILD_FLOW_UUID],
    };
    const triggerMapping = [];
    clonedMapping?.forEach((field) => {
        if (field?.is_deleted) return;

        if (field?.fieldType !== FIELD_TYPE.TABLE) {
            let fieldValue = field.value;

            if (field?.valueType === FIELD_VALUE_TYPES.STATIC) {
              fieldValue = getStaticValue(field.value, field?.fieldType, { isParseNumber: true });
            }
            triggerMapping.push({
                child_field_uuid: field?.fieldUuid,
                value_type: field?.valueType,
                ...(![FIELD_VALUE_TYPES.MAP_ENTRY, FIELD_VALUE_TYPES.USER_ENTRY].includes(field?.valueType)) ? { value: fieldValue } : {},
            });
        } else {
            const tableChilds = [];
            field?.tableColumnMapping?.forEach((childField) => {
                if (childField?.is_deleted) return;
                let fieldValue = childField.value;

                if (childField?.valueType === FIELD_VALUE_TYPES.STATIC) {
                    fieldValue = getStaticValue(childField.value, childField?.fieldType, { isParseNumber: true });
                }
                tableChilds.push({
                    child_field_uuid: childField?.fieldUuid,
                    value_type: childField?.valueType,
                    value: fieldValue,
                });
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
    if (!isEmpty(triggerMapping)) triggerDetails.trigger_mapping = triggerMapping;
    if (!isEmpty(clonedData?.triggerUuid)) {
        triggerDetails.trigger_uuid = clonedData.triggerUuid;
    }
    console.log('triggerMappingNew', triggerMapping, 'triggerDetails', triggerDetails);
    return triggerDetails;
};

export const getTriggerNodePostData = (state) => {
    const stateData = cloneDeep(state);
    const triggerDetails = getTriggerDetailsPostData(stateData);
    console.log('getTriggerNodePostData', stateData, 'triggerDetails', triggerDetails);

    const postData = {
        [TRIGGER_CONSTANTS.FLOW_ID]: stateData?.[TRIGGER_RESPONSE_KEYS.FLOW_ID],
        [TRIGGER_CONSTANTS.ID]: stateData?.[TRIGGER_RESPONSE_KEYS.ID],
        [TRIGGER_CONSTANTS.STEP_UUID]: stateData?.[TRIGGER_RESPONSE_KEYS.STEP_UUID],
        [TRIGGER_CONSTANTS.STEP_NAME]: stateData?.[TRIGGER_RESPONSE_KEYS.STEP_NAME],
        [TRIGGER_CONSTANTS.STEP_TYPE]: stateData?.[TRIGGER_RESPONSE_KEYS.STEP_TYPE],
        [TRIGGER_CONSTANTS.STEP_ORDER]: stateData?.[TRIGGER_RESPONSE_KEYS.STEP_ORDER],
        [TRIGGER_CONSTANTS.STEP_STATUS]: stateData?.[TRIGGER_RESPONSE_KEYS.STEP_STATUS],
        [TRIGGER_CONSTANTS.CANCEL_WITH_PARENT]: stateData?.[CANCEL_WITH_PARENT],
        [TRIGGER_CONSTANTS.IS_ASYNC]: stateData?.[IS_ASYNC],
        [TRIGGER_CONSTANTS.IS_MNI]: stateData?.[IS_MNI],
        [TRIGGER_CONSTANTS.TRIGGER_DETAILS]: triggerDetails,
    };

    if (!isEmpty(stateData?.documentUrlDetails?.uploadedDocMetadata)) {
      postData.document_details = {
        ...stateData?.documentUrlDetails,
        uploaded_doc_metadata: [
          ...stateData.documentUrlDetails.uploadedDocMetadata,
        ],
      };

      delete postData?.document_details?.uploadedDocMetadata;
      delete postData?.document_details?.removedDocList;
    }

    if (!isEmpty(stateData?.documentUrlDetails?.removedDocList)) {
        set(postData, [TRIGGER_CONSTANTS.DOCUMENT_DETAILS, TRIGGER_CONSTANTS.REMOVED_DOC_LIST], stateData?.documentUrlDetails?.removedDocList);
    }

    if (stateData?.[IS_MNI]) {
        postData[TRIGGER_CONSTANTS.ITERATE_FIELD_UUID] = stateData?.[ITERATE_FIELD_UUID];
    }
    console.log('contructedTriggerStepPostData', postData, stateData?.[IS_MNI], stateData);
    return postData;
};

export const constructMappingValidationData = (mappingData = []) => {
  const triggerMapping = [];
  mappingData?.forEach((eachMappingRow) => {
    const validateData = cloneDeep(eachMappingRow);
    if (eachMappingRow?.valueType === FIELD_VALUE_TYPES.STATIC) {
      validateData.value = formatValidationData(
        eachMappingRow?.value,
        eachMappingRow?.fieldType,
      );
    } else if (eachMappingRow?.fieldType === FIELD_TYPE.TABLE) {
        validateData.tableColumnMapping = constructMappingValidationData(eachMappingRow.tableColumnMapping);
    }
    triggerMapping.push(validateData);
  });
  if (!isEmpty(triggerMapping)) return triggerMapping;
  return [];
};

export const triggerStepValidateData = (state) => {
    const {
        childFlowUuid,
        cancelWithParent,
        isAsync,
        isMni,
        mniUuid,
        mapping = [],
    } = cloneDeep(state);
    return {
        childFlowUuid,
        cancelWithParent,
        isAsync,
        isMni,
        mniUuid,
        mapping: constructMappingValidationData(mapping),
    };
};

export const formatAllFlowsList = (response, flowUUID) => {
    console.log('response_formatAllFlowsList', response);
    const flowList = [];
    response?.forEach((data) => {
        if (data.flow_uuid !== flowUUID) {
            flowList.push({
                label: data.flow_name,
                value: data.flow_uuid,
                id: data._id,
            });
        }
    });
    console.log('formattedFlowsList', flowList, 'response', response);
    return flowList;
};
