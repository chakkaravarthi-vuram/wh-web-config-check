import {
    isEmpty,
    get,
    find,
    cloneDeep,
    has,
    isNull,
    translateFunction,
  } from 'utils/jsUtility';
import { getFieldTypeIncludingChoiceValueType, getSaveTriggerValidateData } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import { FIELD_LIST_TYPE, FIELD_TYPE } from 'utils/constants/form.constant';
import { validate } from 'utils/UtilityFunctions';
import { checkForJoiValidationExistence } from 'containers/edit_flow/step_configuration/configurations/Configuration.utils';
import { newStepNameSchema, saveTriggerStepValidationSchema } from 'containers/edit_flow/step_configuration/StepConfiguration.validations';
import { FF_DROPDOWN_LIST } from 'components/form_builder/FormBuilder.strings';
import { FIELD_MAPPING_ERRORS, MAPPING_CONSTANTS } from './field_mapping/FieldMapping.constants';
import { FIELD_MAPPING_TYPES, FLOW_TRIGGER_CONSTANTS } from './TriggerConfiguration.constants';

export const getErrorListForMappingMatch = (
    initial_error_list = {},
    mapping,
    idk,
    lstAllFields = [],
    childFlowlstAllFields = [],
    isSubMapping = false,
    subMappingIndex,
    t = translateFunction,
  ) => {
    const { TRIGGER_MAPPING, CHILD_FIELD_MAPPING, PARENT_FIELD_MAPPING, VALUE_TYPE,
      PARENT_TABLE_MAPPING, CHILD_TABLE_MAPPING, FIELD_MAPPING } = MAPPING_CONSTANTS;
    const { FIELD_MATCH_CATEGORY } = FLOW_TRIGGER_CONSTANTS;
    const { TYPE_MISMATCH_TEXT } = FIELD_MAPPING_ERRORS;
    const error_keys = !isSubMapping ? [
      `${TRIGGER_MAPPING},${idk},${FIELD_MAPPING.ID},${subMappingIndex},child_field_uuid`,
      `${TRIGGER_MAPPING},${idk},${FIELD_MAPPING.ID},${subMappingIndex},${VALUE_TYPE.ID}`,
      `${TRIGGER_MAPPING},${idk},${FIELD_MAPPING.ID},${subMappingIndex},parent_field_uuid`,
    ] :
    [
      `${TRIGGER_MAPPING},${idk},${CHILD_FIELD_MAPPING.ID}`,
      `${TRIGGER_MAPPING},${idk},${VALUE_TYPE.ID}`,
      `${TRIGGER_MAPPING},${idk},${PARENT_FIELD_MAPPING.ID}`,
    ];
    const error_list = cloneDeep(initial_error_list);
    if (
      !isEmpty(mapping)
      // get(mapping, [CHILD_FIELD_MAPPING.ID, 'field_uuid'], null) &&
      // get(mapping, [PARENT_FIELD_MAPPING.ID, 'field_uuid'], null)
      ) {
      const childFlowField = !isNull(get(mapping, [CHILD_FIELD_MAPPING.ID, 'field_uuid'], null)) ?
      find(childFlowlstAllFields, {
        field_uuid: mapping.child_field_details.field_uuid,
      }) : !isNull(get(mapping, [CHILD_TABLE_MAPPING.ID, 'table_uuid'], null)) ?
      find(childFlowlstAllFields, {
        table_uuid: mapping.child_table_details.table_uuid,
      }) : null;

      let parentFlowField = null;

      if (mapping?.value_type === FIELD_MAPPING_TYPES.SYSTEM) {
        parentFlowField = find(FLOW_TRIGGER_CONSTANTS.SYSTEM_FIELD_LIST(t), {
          value: mapping.parent_field_details.system_field,
        });
      } else {
        parentFlowField = !isNull(get(mapping, [PARENT_FIELD_MAPPING.ID, 'field_uuid'], null)) ?
          find(lstAllFields, {
            field_uuid: mapping.parent_field_details.field_uuid,
          }) : !isNull(get(mapping, [PARENT_TABLE_MAPPING.ID, 'table_uuid'], null)) ?
          find(lstAllFields, {
            table_uuid: mapping.parent_table_details.table_uuid,
          }) : null;
      }
      if (childFlowField && parentFlowField) {
        const child_flow_type = !isNull(get(mapping, [CHILD_FIELD_MAPPING.ID, 'field_uuid'], null)) ?
          getFieldTypeIncludingChoiceValueType(childFlowField) :
          { fieldType: FIELD_LIST_TYPE.TABLE };
        const parent_flow_type = (
          !isNull(get(mapping, [PARENT_FIELD_MAPPING.ID, 'field_uuid'], null)) ||
          !isNull(get(mapping, [PARENT_FIELD_MAPPING.ID, 'system_field'], null))
        ) ?
          getFieldTypeIncludingChoiceValueType(parentFlowField) :
          { fieldType: FIELD_LIST_TYPE.TABLE };
        let isValidFieldType = false;
        switch (child_flow_type.fieldType) {
          case FIELD_TYPE.CHECKBOX:
            isValidFieldType = (parent_flow_type.fieldType === FIELD_TYPE.CHECKBOX) &&
              (child_flow_type.choiceValueType === parent_flow_type.choiceValueType);
            break;
          case FIELD_TYPE.RADIO_GROUP:
          case FIELD_TYPE.DROPDOWN:
            if ([FIELD_TYPE.RADIO_GROUP, FIELD_TYPE.DROPDOWN].includes(parent_flow_type.fieldType)) {
              isValidFieldType = child_flow_type.choiceValueType === parent_flow_type.choiceValueType;
            } else if (child_flow_type.choiceValueType === FIELD_TYPE.SINGLE_LINE) {
              isValidFieldType = [FIELD_TYPE.SINGLE_LINE, FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN].includes(parent_flow_type.fieldType);
            } else if (child_flow_type.choiceValueType === FIELD_TYPE.NUMBER) {
              isValidFieldType = [FIELD_TYPE.NUMBER].includes(parent_flow_type.fieldType);
            } else if (child_flow_type.choiceValueType === FIELD_TYPE.DATE) {
              isValidFieldType = [FIELD_TYPE.DATE].includes(parent_flow_type.fieldType);
            }
            break;
          default:
            if (
              (FIELD_MATCH_CATEGORY.CATEGORY_1.includes(child_flow_type.fieldType) &&
              FIELD_MATCH_CATEGORY.CATEGORY_1.includes(parent_flow_type.fieldType)
              ) || (
                FIELD_MATCH_CATEGORY.CATEGORY_2.includes(child_flow_type.fieldType) &&
                FIELD_MATCH_CATEGORY.CATEGORY_2.includes(parent_flow_type.fieldType)
              ) || (
                child_flow_type.fieldType === parent_flow_type.fieldType
              )
            ) {
              isValidFieldType = true;
            }
            break;
        }
        if (isValidFieldType) {
          if (child_flow_type.fieldType !== FIELD_TYPE.DATA_LIST) {
          has(error_list, [error_keys[0]], false) &&
            error_list[error_keys[0]].includes('mismatch') &&
            delete error_list[error_keys[0]];
          has(error_list, [error_keys[2]], false) &&
            error_list[error_keys[2]].includes('mismatch') &&
            delete error_list[error_keys[2]];
          } else {
            const childDataListDetails = childFlowField.data_list;
            const parentDataListDetails = parentFlowField.data_list;
            if (childDataListDetails && parentDataListDetails) {
              const childDataListUUId = childDataListDetails.data_list_uuid;
              const parentDataListUUId = parentDataListDetails.data_list_uuid;
              if (childDataListUUId === parentDataListUUId) {
                has(error_list, [error_keys[0]], false) &&
                error_list[error_keys[0]].includes('mismatch') &&
                delete error_list[error_keys[0]];
                has(error_list, [error_keys[2]], false) &&
                error_list[error_keys[2]].includes('mismatch') &&
                delete error_list[error_keys[2]];
              } else {
                  error_list[error_keys[0]] = t('datalist_strings.errors.datalist_mismatch');
                  error_list[error_keys[2]] = t('datalist_strings.errors.datalist_mismatch');
              }
            }
          }
        } else {
          const fieldDropdownList = FF_DROPDOWN_LIST(t);
          const childFlowFieldType = child_flow_type?.actualChoiceValueType ?
          `${fieldDropdownList.find((field) => field.ID === child_flow_type.fieldType)?.TITLE} - ${child_flow_type.actualChoiceValueType}` :
          fieldDropdownList.find((field) => field.ID === child_flow_type.fieldType)?.TITLE;
          const parentFlowFieldType = parent_flow_type?.actualChoiceValueType ?
          `${fieldDropdownList.find((field) => field.ID === parent_flow_type.fieldType)?.TITLE} - ${parent_flow_type.actualChoiceValueType}` :
          fieldDropdownList.find((field) => field.ID === parent_flow_type.fieldType)?.TITLE;
          error_list[error_keys[0]] = `${t(TYPE_MISMATCH_TEXT)} (${childFlowFieldType})`;
          error_list[error_keys[2]] = `${t(TYPE_MISMATCH_TEXT)} (${parentFlowFieldType})`;
        }
      }
    }
    return error_list;
  };

  export const deleteEntryActionRelatedValidation = (
    initial_error_list,
  ) => {
    const error_list = cloneDeep(initial_error_list);
    if (!isEmpty(initial_error_list)) {
      Object.keys(initial_error_list).forEach((errorKey) => {
        if (
          errorKey.includes(MAPPING_CONSTANTS.TRIGGER_MAPPING)
        ) {
          delete error_list[errorKey];
        }
      });
    }
    return error_list;
  };

export const getvalidatedMappingErrorList = (
    initial_error_list,
    active_data,
    lstAllFields,
    childFlowlstAllFields = [],
    t,
    configuredMaxFileSize,
  ) => {
    const { TRIGGER_MAPPING, CHILD_FIELD_MAPPING, CHILD_TABLE_MAPPING,
            PARENT_FIELD_MAPPING } = MAPPING_CONSTANTS;
    // const { FIELD_KEYS } = SEND_DATA_TO_DATALIST;
    let error_list = cloneDeep(initial_error_list);
    const validatedErrorList = checkForJoiValidationExistence(initial_error_list, t)
      ? validate(
        {
          ...getSaveTriggerValidateData(
            cloneDeep(active_data),
          ),
          step_name: active_data?.step_name,
        },
        newStepNameSchema(t).concat(saveTriggerStepValidationSchema(t, configuredMaxFileSize)),
      )
      : {};
    const mappingRelatedValidations = {};
    if (!isEmpty(validatedErrorList)) {
      Object.keys(validatedErrorList).forEach((error) => {
        error.includes(TRIGGER_MAPPING) &&
          (mappingRelatedValidations[error] = validatedErrorList[error]);
      });
    }
    error_list = deleteEntryActionRelatedValidation(error_list);
    error_list = { ...error_list, ...mappingRelatedValidations };
    if (!isEmpty(active_data[TRIGGER_MAPPING])) {
      error_list = active_data[TRIGGER_MAPPING].reduce(
        (errorList, mapping, idk) => {
          console.log('activetriggerdata', mapping, get(mapping, [PARENT_FIELD_MAPPING.ID], null), get(mapping, [CHILD_FIELD_MAPPING.ID], null));
          let subMapping_errorList = {};
          if (
            !isEmpty(mapping) &&
            (get(mapping, [CHILD_FIELD_MAPPING.ID], null) || get(mapping, [CHILD_TABLE_MAPPING.ID], null)) &&
            (get(mapping, [PARENT_FIELD_MAPPING.ID], null) || get(mapping, [PARENT_FIELD_MAPPING.ID], null))
          ) {
            if (!isEmpty(get(mapping, ['field_mapping'], []))) {
              subMapping_errorList = mapping.field_mapping.reduce(
                (subMappingErrorList, subMapping, subMappingIdk) => {
                  console.log('activetriggerdata', mapping, get(mapping, [PARENT_FIELD_MAPPING.ID], null), get(mapping, [CHILD_FIELD_MAPPING.ID], null));
                  if (
                    !isEmpty(subMapping) &&
                    get(subMapping, [CHILD_FIELD_MAPPING.ID], null) &&
                    get(subMapping, [PARENT_FIELD_MAPPING.ID], null)
                  ) {
                    return {
                      ...subMappingErrorList,
                      ...(getErrorListForMappingMatch(
                        subMappingErrorList,
                        subMapping,
                        idk,
                        lstAllFields,
                        childFlowlstAllFields,
                        true,
                        subMappingIdk,
                        t,
                      ) || {}),
                    };
                  }
                  return subMappingErrorList;
                },
                subMapping_errorList,
              );
            }
            // from
            return {
              ...errorList,
              ...subMapping_errorList,
              ...(getErrorListForMappingMatch(
                errorList,
                mapping,
                idk,
                lstAllFields,
                childFlowlstAllFields,
                false,
                null,
                t,
              ) || {}),
            };
          }
          return errorList;
        },
        error_list,
      );
    }
    console.log('mappederrorList', error_list);
    return error_list;
  };
