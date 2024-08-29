import { cloneDeep, set, isUndefined } from 'utils/jsUtility';
import { START_NODE_REQUEST_FIELD_KEYS, START_NODE_RESPONSE_FIELD_KEYS } from '../start_step/StartStepConfig.constants';
import { STEP_TYPE } from '../../../../../utils/Constants';
import { processDataRules } from '../../../../form/sections/field_configuration/column_configuration/external_source_column_configuration/ExternalSourceColumnConfiguration.utils';
import { isBoolean, isEmpty, translateFunction, isNumber } from '../../../../../utils/jsUtility';
import { ENTITY } from '../../../../../utils/strings/CommonStrings';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { constructFileUpload } from '../../../../landing_page/my_tasks/task_content/TaskContent.utils';
import { DATA_MANIPULATOR_STEP_CONFIGURATION } from './DataManipulator.strings';
import { REQUEST_KEYS, RESPONSE_KEYS, FLOW_MANIPULATION_FIELD_TYPE_MAP } from './DataManipulator.constants';
import { normalizer } from '../../../../../utils/normalizer.utils';
import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';
import { getCurrentSystemField } from '../generate_document/general/document_template/DocumentTemplate.utils';
import { FIELD_LIST_OBJECT } from '../../../../form/sections/field_configuration/basic_configuration/BasicConfiguration.constants';

const {
  SOURCE_VALUE,
  CHILD_MAPPING,
  DOCUMENT_DETAILS,
  SOURCE_FIELD_TYPE,
  SOURCE_TYPE,
  OPERATOR,
  SAVE_TO,
  SAVE_INTO_FIELD,
  TABLE_COLUMN_MAPPING,
  CHILD_DATA,
  RULE_NAME,
  IS_MULTIPLE,
  STATIC_VALUE,
  MANIPULATION_DETAILS,
} = RESPONSE_KEYS;

export const getManipulationValidationData = (manipulationData = [], flowFields = [], t = translateFunction) => {
  const data = [];
  manipulationData?.forEach((eachManipulation) => {
    const isNumberStaticField =
    (eachManipulation?.[SOURCE_TYPE] === DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].value) &&
    (eachManipulation[SOURCE_FIELD_TYPE] === FIELD_TYPE.NUMBER);

    const sourceField = flowFields?.find((eachField) => eachField?.fieldUuid === (eachManipulation?.[SAVE_TO] || eachManipulation?.[SAVE_INTO_FIELD]));
    console.log('isDecimal', sourceField, flowFields, eachManipulation);
    const eachData = {
      [SAVE_TO]: eachManipulation?.[SAVE_TO] || eachManipulation?.[SAVE_INTO_FIELD],
      [SOURCE_VALUE]: !isEmpty(eachManipulation?.[DOCUMENT_DETAILS]?.uploaded_doc_metadata) ? { doc_ids: eachManipulation?.[SOURCE_VALUE] } : eachManipulation?.[SOURCE_VALUE],
      [OPERATOR]: eachManipulation?.[OPERATOR],
      [SOURCE_TYPE]: eachManipulation?.[SOURCE_TYPE],
      ...(!isEmpty(eachManipulation?.[SOURCE_FIELD_TYPE])) && { [SOURCE_FIELD_TYPE]: eachManipulation?.[SOURCE_FIELD_TYPE] },
      [IS_MULTIPLE]: false,
      allowDecimal: isNumberStaticField && sourceField?.allow_decimal,
    };
    if ((eachManipulation?.[SOURCE_FIELD_TYPE] === FIELD_TYPE.TABLE) || (eachManipulation?.[SOURCE_FIELD_TYPE] === 'object') || (eachManipulation[SOURCE_TYPE] === 'external_data')) eachData[CHILD_MAPPING] = [];
    if (eachManipulation?.[CHILD_MAPPING]) {
      eachManipulation?.[CHILD_MAPPING]?.forEach((eachMapping) => {
        const isNumberStaticField =
        (eachMapping?.[SOURCE_TYPE] === DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].value) &&
        (eachMapping?.[SOURCE_FIELD_TYPE] === FIELD_TYPE.NUMBER);

        const sourceField = flowFields?.find((eachField) => eachField?.fieldUuid === (eachMapping?.[SAVE_TO] || eachMapping?.[SAVE_INTO_FIELD]));

        const sourceValue = (eachMapping?.[TABLE_COLUMN_MAPPING] || eachMapping?.[CHILD_DATA]) ?
        (eachMapping?.[SOURCE_VALUE] || eachMapping?.[CHILD_DATA]) :
        (!isEmpty(eachMapping?.[DOCUMENT_DETAILS]?.uploaded_doc_metadata) ? { doc_ids: eachMapping?.[SOURCE_VALUE] } : eachMapping?.[SOURCE_VALUE]);

        const mappingData = {
          [SAVE_TO]: eachMapping?.[SAVE_TO] || eachMapping?.[SAVE_INTO_FIELD],
          [SOURCE_VALUE]: sourceValue,
          [OPERATOR]: eachMapping?.[OPERATOR],
          [SOURCE_TYPE]: eachMapping?.[SOURCE_TYPE],
          [IS_MULTIPLE]: false,
          ...(!isEmpty(eachMapping?.[SOURCE_FIELD_TYPE])) && { [SOURCE_FIELD_TYPE]: eachMapping?.[SOURCE_FIELD_TYPE] },
          allowDecimal: isNumberStaticField && sourceField?.allow_decimal,
        };
        if (eachMapping?.[TABLE_COLUMN_MAPPING]) {
          mappingData[TABLE_COLUMN_MAPPING] = [];
          eachMapping?.[TABLE_COLUMN_MAPPING]?.forEach((eachColumn) => {
            mappingData[TABLE_COLUMN_MAPPING].push({
              [SAVE_TO]: eachColumn?.[SAVE_TO] || eachColumn?.[SAVE_INTO_FIELD],
              [SOURCE_VALUE]: eachColumn?.[CHILD_DATA],
              [OPERATOR]: eachColumn?.[OPERATOR],
              [SOURCE_TYPE]: eachColumn?.[SOURCE_TYPE],
              ...(!isEmpty(eachColumn?.[SOURCE_FIELD_TYPE])) && { [SOURCE_FIELD_TYPE]: eachColumn?.[SOURCE_FIELD_TYPE] },

            });
          });
        }

        eachData[CHILD_MAPPING].push(mappingData);
      });
    }
    data.push(eachData);
  });
  console.log('manipulator post data', data, manipulationData);
  return {
    [MANIPULATION_DETAILS]: data,
  };
};

export const constructManipulatorStepPostData = (stateDataParam, t = translateFunction) => {
  const stateData = cloneDeep(stateDataParam);
  const postData = {};
  console.log('manipulator post data', stateData);

  set(
    postData,
    [START_NODE_REQUEST_FIELD_KEYS.FLOW_ID],
    stateData?.[START_NODE_REQUEST_FIELD_KEYS.FLOW_ID],
  );

  set(
    postData,
    [START_NODE_REQUEST_FIELD_KEYS.STEP_ID],
    stateData?.[START_NODE_REQUEST_FIELD_KEYS.STEP_ID],
  );

  set(
    postData,
    [START_NODE_REQUEST_FIELD_KEYS.STEP_UUID],
    stateData?.[START_NODE_REQUEST_FIELD_KEYS.STEP_UUID],
  );

  set(
    postData,
    [START_NODE_REQUEST_FIELD_KEYS.STEP_NAME],
    stateData?.[START_NODE_RESPONSE_FIELD_KEYS.STEP_NAME],
  );

  set(
    postData,
    [START_NODE_REQUEST_FIELD_KEYS.STEP_STATUS],
    stateData?.[START_NODE_RESPONSE_FIELD_KEYS.STEP_STATUS],
  );

  set(
    postData,
    [START_NODE_REQUEST_FIELD_KEYS.STEP_TYPE],
    STEP_TYPE.DATA_MANIPULATOR,
  );

  set(
    postData,
    [START_NODE_REQUEST_FIELD_KEYS.STEP_ORDER],
    stateData?.[START_NODE_REQUEST_FIELD_KEYS.STEP_ORDER],
  );
  const documents = [];
  postData.manipulation_details = stateData?.manipulationDetails?.map((eachManipulation) => {
    eachManipulation?.[DOCUMENT_DETAILS]?.uploaded_doc_metadata?.forEach((doc) => {
        documents.push({
          upload_signed_url: doc?.upload_signed_url?.s3_key,
          type: doc.type,
          document_id: doc._id,
        });
    });
    let sourceValue = eachManipulation[SOURCE_VALUE];
    if ((eachManipulation?.[SOURCE_FIELD_TYPE] === FIELD_TYPE.NUMBER) &&
        (eachManipulation?.[SOURCE_TYPE] === DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].value)) {
          if (!isEmpty(sourceValue?.toString())) {
            sourceValue = Number(sourceValue.toString().replace(/,/g, ''));
          }
    }
    if (!isEmpty(eachManipulation?.[DOCUMENT_DETAILS]?.uploaded_doc_metadata)) {
      sourceValue = { doc_ids: eachManipulation?.[SOURCE_VALUE] };
    }

    return {
      save_into_field: eachManipulation?.[SAVE_TO] || eachManipulation?.[SAVE_INTO_FIELD],
      ...(!isEmpty(sourceValue) || isBoolean(sourceValue) || isNumber(sourceValue)) && { source_value: sourceValue },
      operator: eachManipulation?.[OPERATOR],
      source_type: eachManipulation?.[SOURCE_TYPE],
      ...(!isEmpty(eachManipulation?.[SOURCE_FIELD_TYPE])) && { source_field_type: eachManipulation?.[SOURCE_FIELD_TYPE] },
      ...(eachManipulation?.[CHILD_MAPPING]) && {
        child_mapping: eachManipulation?.[CHILD_MAPPING]?.map((eachMapping) => {
          eachMapping?.[DOCUMENT_DETAILS]?.uploaded_doc_metadata?.forEach((doc) => {
            documents.push({
              upload_signed_url: doc?.upload_signed_url?.s3_key,
              type: doc.type,
              document_id: doc._id,
            });
          });

          let sourceValue = eachMapping?.[SOURCE_VALUE] || eachMapping?.[CHILD_DATA];
          if ((eachMapping?.[SOURCE_FIELD_TYPE] === FIELD_TYPE.NUMBER) &&
              (eachMapping?.[SOURCE_TYPE] === DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].value)) {
                if (!isEmpty(sourceValue?.toString())) {
                  sourceValue = Number(sourceValue.toString().replace(/,/g, ''));
                }
          }
          return {
            save_into_field: eachMapping?.[SAVE_TO] || eachMapping?.[SAVE_INTO_FIELD],
            ...(eachMapping?.[TABLE_COLUMN_MAPPING] || eachMapping?.[CHILD_DATA]) ?
            {
              child_data: sourceValue || eachMapping?.[SOURCE_VALUE] || eachMapping?.[CHILD_DATA],
            } :
            {
              source_value: !isEmpty(eachMapping?.[DOCUMENT_DETAILS]?.uploaded_doc_metadata) ? { doc_ids: eachMapping?.[SOURCE_VALUE] } : sourceValue || eachMapping?.[SOURCE_VALUE],
            },
            operator: eachMapping?.[OPERATOR],
            source_type: eachMapping?.[SOURCE_TYPE],
            ...(!isEmpty(eachMapping?.[SOURCE_FIELD_TYPE]) &&
              eachMapping?.[SOURCE_TYPE] !== DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[1].value)
            && { source_field_type: eachMapping?.[SOURCE_FIELD_TYPE] },
            ...(eachMapping?.[TABLE_COLUMN_MAPPING]) && {
              table_column_mapping: eachMapping?.[TABLE_COLUMN_MAPPING]?.map((eachColumn) => {
                return {
                  save_into_field: eachColumn?.[SAVE_TO] || eachColumn?.[SAVE_INTO_FIELD],
                  child_data: eachColumn?.[CHILD_DATA],
                  operator: eachColumn?.[OPERATOR],
                  source_type: eachColumn?.[SOURCE_TYPE],
                };
              }),
            },
          };
        }),
      },
    };
  });
  if (!isEmpty(documents)) {
      postData.document_details = {
        uploaded_doc_metadata: documents,
        entity: ENTITY.FLOW_STEPS,
        entity_id: stateData?._id,
        ref_uuid: stateData?.ref_uuid,
      };
  }

    return postData;
};

export const constructManipulatorStepData = (apiData, t = translateFunction) => {
  let stepData = cloneDeep(apiData);
  const data = {
    flowId: apiData?.flow_id,
    stepUuid: apiData?.step_uuid,
    stepId: apiData?._id,
    stepName: apiData?.step_name,
    stepOrder: apiData?.step_order,
    stepStatus: apiData?.step_status || DEFAULT_STEP_STATUS,
    stepType: apiData?.step_type,
    connectedSteps: apiData.connected_steps,
  };
  stepData = { ...stepData, ...data };
  const { OPTIONS } = DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION;
  const manipulationDetails = apiData?.manipulation_details?.map((eachManipulation) => {
    if ((eachManipulation.source_type !== OPTIONS?.[0]?.[SOURCE_TYPE]) &&
    (eachManipulation.source_type !== OPTIONS?.[1]?.[SOURCE_TYPE]) &&
    (eachManipulation.source_type !== OPTIONS?.[4]?.[SOURCE_TYPE])) {
      console.log('constructManipulatorStepData1st', eachManipulation);
      if (eachManipulation?.child_mapping) {
        eachManipulation[CHILD_MAPPING] = eachManipulation?.child_mapping?.map((eachMapping) => {
          if (eachMapping?.table_column_mapping) {
            eachMapping[TABLE_COLUMN_MAPPING] = eachMapping?.table_column_mapping?.map((eachColumn) =>
              normalizer(
                  cloneDeep(eachColumn),
                  REQUEST_KEYS,
                  RESPONSE_KEYS,
                ));
          }
          return normalizer(
            cloneDeep(eachMapping),
            REQUEST_KEYS,
            RESPONSE_KEYS,
          );
        });
      }
      return normalizer(
        eachManipulation,
        REQUEST_KEYS,
        RESPONSE_KEYS,
      );
    } else if ((eachManipulation.source_type === OPTIONS?.[4]?.[SOURCE_TYPE]) &&
    ((eachManipulation?.source_field_type === FIELD_TYPE.FILE_UPLOAD) ||
    (eachManipulation?.source_field_type === FIELD_TYPE.TABLE) ||
    (eachManipulation?.source_field_type === 'object'))) {
      const documents = [];
      console.log('constructManipulatorStepData2nd', eachManipulation);
      eachManipulation?.source_value?.doc_ids?.forEach((eachDocId) => {
        const document = stepData?.document_url_details?.find((eachData) => eachData?.document_id === eachDocId);
        if (document) {
          documents.push(...constructFileUpload([document], eachDocId, { field_uuid: eachDocId }));
        }
      });
      eachManipulation[CHILD_MAPPING] = cloneDeep(eachManipulation)?.child_mapping?.map((eachMapping) => {
        if ((eachMapping?.source_field_type === FIELD_TYPE.FILE_UPLOAD)) {
          const documents = [];
          eachMapping?.source_value?.doc_ids?.forEach((eachDocId) => {
            const document = stepData?.document_url_details?.find((eachData) => eachData?.document_id === eachDocId);
            if (document) {
              documents.push(...constructFileUpload([document], eachDocId, { field_uuid: eachDocId }));
            }
          });
          if (!isEmpty(documents)) eachMapping.static_value = documents;
        }
        eachMapping[TABLE_COLUMN_MAPPING] = cloneDeep(eachMapping)?.table_column_mapping?.map((eachColumn) => {
          if ((eachColumn?.source_field_type === FIELD_TYPE.FILE_UPLOAD)) {
            const documents = [];
            eachColumn?.source_value?.doc_ids?.forEach((eachDocId) => {
              const document = stepData?.document_url_details?.find((eachData) => eachData?.document_id === eachDocId);
              if (document) {
                documents.push(...constructFileUpload([document], eachDocId, { field_uuid: eachDocId }));
              }
            });
            if (!isEmpty(documents)) eachColumn.static_value = documents;
          }
          return eachColumn;
        });
        return eachMapping;
      });
      console.log('constructManipulatorStepData2ndddd', cloneDeep(eachManipulation), eachManipulation);
      if (!isEmpty(documents)) eachManipulation[STATIC_VALUE] = documents;
      if (!isEmpty(documents)) eachManipulation[STATIC_VALUE] = documents;
      return normalizer(
        cloneDeep(eachManipulation),
        REQUEST_KEYS,
        RESPONSE_KEYS,
      );
    } else {
      const manipulatorRuleData = apiData?.rule_details?.find(((eachRule) => eachRule.rule_uuid === eachManipulation.source_value));
      console.log('constructManipulatorStepData3rd', manipulatorRuleData, apiData.rule_details, eachManipulation);
      if (manipulatorRuleData) {
        eachManipulation.ruleDetails = {
          [RULE_NAME]: manipulatorRuleData.rule_name,
          ruleUUID: manipulatorRuleData.rule_uuid,
        };
        if (manipulatorRuleData?.rule?.output_format) {
          const processedMapping = {
            ...processDataRules([manipulatorRuleData])?.[0],
            [RULE_NAME]: manipulatorRuleData.rule_name,
            ruleUUID: manipulatorRuleData.rule_uuid,
            ruleId: manipulatorRuleData._id,
          };
          const ruleFields = [];
          processedMapping?.tables?.forEach((eachTable) => {
            ruleFields.push(eachTable);
            eachTable?.columns?.forEach((eachRow) => {
              eachRow?.forEach((eachField) => {
                if (!isUndefined(eachField?.label)) {
                  ruleFields.push({
                    ...eachField,
                    tableUUID: eachTable.value,
                  });
                }
              });
            });
          });
          console.log('externalRULE', processedMapping, ruleFields);
          processedMapping?.directFields?.forEach((eachRow) => {
            eachRow?.forEach((eachField) => {
              if (eachField && !isUndefined(eachField.label)) {
                ruleFields.push(eachField);
              }
            });
          });
          eachManipulation.ruleDetails = {
            ...processedMapping,
            fieldsList: ruleFields,
          };
        }
      }
      if (eachManipulation?.child_mapping) {
        eachManipulation[CHILD_MAPPING] = eachManipulation?.child_mapping?.map((eachMapping) => {
          if (eachMapping?.table_column_mapping) {
            eachMapping[TABLE_COLUMN_MAPPING] = eachMapping?.table_column_mapping?.map((eachColumn) =>
              normalizer(
                  cloneDeep(eachColumn),
                  REQUEST_KEYS,
                  RESPONSE_KEYS,
                ));
          }
          return normalizer(
            cloneDeep(eachMapping),
            REQUEST_KEYS,
            RESPONSE_KEYS,
          );
        });
      }
      return normalizer(
        eachManipulation,
        REQUEST_KEYS,
        RESPONSE_KEYS,
      );
    }
  });
  stepData.manipulationDetails = manipulationDetails;
  console.log('constructManipulatorStepData1', stepData, 'apiData', apiData);
  return stepData;
};

export const CHOICE_VALUE_FIELD_TYPES = [FIELD_TYPE.DROPDOWN, FIELD_TYPE.RADIO_GROUP];
export const CHOICE_VALUE_FIELD_TYPES_CHECKBOX = [FIELD_TYPE.DROPDOWN, FIELD_TYPE.RADIO_GROUP, FIELD_TYPE.CHECKBOX];

export const PROPERTY_PICKER_FIELD_TYPES = [FIELD_TYPE.DATA_LIST_PROPERTY_PICKER, FIELD_TYPE.USER_PROPERTY_PICKER];

export const validateMapping = (sourceFieldUuid, flowFieldUuid, sourceFieldList = [], flowFieldList = [], errorList, errorKey, staticSourceType = null, t = translateFunction, currentData = {}) => {
  const isStaticType = (currentData?.sourceType === DATA_MANIPULATOR_STEP_CONFIGURATION(t).ADD_MANIPULATION.OPTIONS[4].sourceType);

  if (sourceFieldUuid && flowFieldUuid) {
    let sourceField = sourceFieldList?.find((eachField) => (eachField?.fieldUuid === sourceFieldUuid) || (eachField?.value === sourceFieldUuid));
    if (isEmpty(sourceField)) {
      sourceField = getCurrentSystemField({ fieldUuid: sourceFieldUuid, systemFields: sourceFieldList });
    }

    const flowField = flowFieldList?.find((eachField) => eachField?.fieldUuid === flowFieldUuid);

    let sourceFieldType = sourceField?.fieldType || sourceField?.type || staticSourceType;
    let flowFieldType = flowField?.fieldType;

    if ((CHOICE_VALUE_FIELD_TYPES.includes(sourceFieldType)) ||
        ((flowFieldType === FIELD_TYPE.CHECKBOX) && (sourceFieldType === FIELD_TYPE.CHECKBOX))) {
      sourceFieldType = sourceField?.choice_value_type;
    }
    if ((CHOICE_VALUE_FIELD_TYPES_CHECKBOX.includes(flowFieldType)) ||
    (isStaticType && (flowFieldType === FIELD_TYPE.CHECKBOX))) {
      flowFieldType = flowField?.choice_value_type;
    }

    if (PROPERTY_PICKER_FIELD_TYPES.includes(sourceField?.fieldType || sourceField?.type || staticSourceType)) {
      const sourceDetails = sourceField?.propertyPickerDetails;
      if (sourceDetails?.choice_values && (sourceDetails?.referenceFieldType !== FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN)) {
        sourceFieldType = sourceDetails?.reference_field_choice_value_type;
      } else {
        sourceFieldType = sourceDetails?.referenceFieldType;
      }
    }
    if (PROPERTY_PICKER_FIELD_TYPES.includes(flowField?.fieldType)) {
      const sourceDetails = flowField?.propertyPickerDetails;
      if ((CHOICE_VALUE_FIELD_TYPES_CHECKBOX.includes(sourceDetails?.referenceFieldType)) ||
      (isStaticType && (sourceDetails?.referenceFieldType === FIELD_TYPE.CHECKBOX))) {
        flowFieldType = sourceDetails?.reference_field_choice_value_type;
      } else {
        flowFieldType = sourceDetails?.referenceFieldType;
      }
    }

    console.log('validateMappingParams',
      flowFieldType,
      sourceFieldType,
      flowField,
      sourceField);

    if ((sourceFieldType !== flowFieldType) &&
      !FLOW_MANIPULATION_FIELD_TYPE_MAP(isStaticType)[sourceFieldType]?.includes(flowFieldType)) {
      let flowFieldError = `Type mismatch(${FIELD_LIST_OBJECT(t)[flowField?.fieldType]})`;
      let sourceFieldError = `Type mismatch(${FIELD_LIST_OBJECT(t)[sourceField?.fieldType || sourceField?.type || staticSourceType]})`;

      if ((CHOICE_VALUE_FIELD_TYPES_CHECKBOX.includes(flowField?.fieldType)) ||
        (isStaticType && (flowField?.fieldType === FIELD_TYPE.CHECKBOX))) {
        flowFieldError = `Type mismatch(${FIELD_LIST_OBJECT(t)[flowField?.fieldType]} - ${FIELD_LIST_OBJECT(t)[flowFieldType]})`;
      }
      if ((CHOICE_VALUE_FIELD_TYPES.includes(sourceField?.fieldType || sourceField?.type || staticSourceType)) ||
      ((flowField?.fieldType === FIELD_TYPE.CHECKBOX) && ((sourceField?.fieldType || sourceField?.type || staticSourceType) === FIELD_TYPE.CHECKBOX))) {
        sourceFieldError = `Type mismatch(${FIELD_LIST_OBJECT(t)[sourceField?.fieldType || sourceField?.type || staticSourceType]} - ${FIELD_LIST_OBJECT(t)[sourceFieldType]})`;
      }

      if (PROPERTY_PICKER_FIELD_TYPES.includes(sourceField?.fieldType || sourceField?.type || staticSourceType)) {
        const sourceDetails = sourceField?.propertyPickerDetails;
        if (sourceDetails?.choice_values && (sourceDetails?.referenceFieldType !== FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN)) {
          sourceFieldError = `Type mismatch(
          ${FIELD_LIST_OBJECT(t)[sourceField?.fieldType || sourceField?.type || staticSourceType]} - 
          ${FIELD_LIST_OBJECT(t)[sourceDetails?.referenceFieldType]} - 
          ${FIELD_LIST_OBJECT(t)[sourceDetails?.reference_field_choice_value_type]})`;
        } else {
          sourceFieldError = `Type mismatch(
            ${FIELD_LIST_OBJECT(t)[sourceField?.fieldType || sourceField?.type || staticSourceType]} - 
            ${FIELD_LIST_OBJECT(t)[sourceDetails?.referenceFieldType]})`;
          }
      }
      if (PROPERTY_PICKER_FIELD_TYPES.includes(flowField?.fieldType)) {
        const sourceDetails = flowField?.propertyPickerDetails;
        if ((CHOICE_VALUE_FIELD_TYPES_CHECKBOX.includes(sourceDetails?.choice_values)) ||
          ((isStaticType && (sourceDetails?.referenceFieldType === FIELD_TYPE.CHECKBOX)))) {
          flowFieldError = `Type mismatch(
          ${FIELD_LIST_OBJECT(t)[flowField?.fieldType]} - 
          ${FIELD_LIST_OBJECT(t)[sourceDetails?.referenceFieldType]} - 
          ${FIELD_LIST_OBJECT(t)[sourceDetails?.reference_field_choice_value_type]})`;
        } else {
          flowFieldError = `Type mismatch(
            ${FIELD_LIST_OBJECT(t)[flowField?.fieldType]} - 
            ${FIELD_LIST_OBJECT(t)[sourceDetails?.referenceFieldType]})`;
          }
      }

      errorList[`${errorKey},${SAVE_TO}`] = flowFieldError;
      errorList[`${errorKey},${SOURCE_VALUE}`] = sourceFieldError;
    } else if (sourceFieldUuid === flowFieldUuid) {
      errorList[`${errorKey},${SAVE_TO}`] = 'Same fields cannot be mapped';
      errorList[`${errorKey},${SOURCE_VALUE}`] = 'Same fields cannot be mapped';
    } else if ((flowFieldType === FIELD_TYPE.DATA_LIST && (sourceFieldType === FIELD_TYPE.DATA_LIST))) {
      let sourceDatalistUuid = sourceField?.data_list_details?.data_list_uuid;
      const flowFieldDatalistUuid = flowField?.data_list_details?.data_list_uuid;
      if (sourceField?.source_data_list_details) {
        sourceDatalistUuid = sourceField?.source_data_list_details?.data_list_details?.data_list_uuid;
      }
      if (sourceDatalistUuid !== flowFieldDatalistUuid) {
        errorList[`${errorKey},${SAVE_TO}`] = 'Datalist source must be same';
        errorList[`${errorKey},${SOURCE_VALUE}`] = 'Datalist source must be same';
      } else {
        delete errorList[`${errorKey},${SAVE_TO}`];
        delete errorList[`${errorKey},${SOURCE_VALUE}`];
      }
    } else {
      delete errorList[`${errorKey},${SAVE_TO}`];
      delete errorList[`${errorKey},${SOURCE_VALUE}`];
    }
  }
  return errorList;
};
