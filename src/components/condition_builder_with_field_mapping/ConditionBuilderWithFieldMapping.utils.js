import React from 'react';
import i18next from 'i18next';
import { getCBConditionInitialState, getCBConditionExpressionInitialState, CBAllKeys, CBConditionType } from '@workhall-pvt-lmt/wh-ui-library';
import { FEILD_LIST_DROPDOWN_TYPE, getGroupedFieldListForMapping } from '../../containers/edit_flow/step_configuration/StepConfiguration.utils';
import { getGroupedSystemFieldListForMapping } from '../../containers/integration/add_integration/workhall_api/WorkhallApi.utils';
import { FIELD_TYPE_TITLE_LABELS } from '../../utils/strings/CommonStrings';
import { FIELD_PICKER_DROPDOWN_TYPES } from '../field_picker/FieldPicker.utils';
import { isEmpty, groupBy, cloneDeep, has, get, isBoolean, set, translateFunction } from '../../utils/jsUtility';
import { FIELD_TYPE_CATEGORY } from '../../containers/edit_flow/EditFlow.strings';
import { L_VALUE_TYPE, R_CONSTANT, R_CONSTANT_TYPES, VALUE_TYPE, VALUE_TYPE_KEY } from '../../utils/constants/rule/rule.constant';
import { FIELD_LIST_TYPE, FIELD_TYPE } from '../../utils/constants/form.constant';
import { store } from '../../Store';
import { getVisibilityExternalFieldsDropdownList } from '../../redux/reducer';
import { getFieldFromFieldUuid } from '../condition_builder/ConditionBuilder.utils';
import { getPostOperator, getResponseOperator } from '../../containers/edit_flow/security/policy_builder/PolicyBuilder.utils';
import { FIELD_TYPES } from '../form_builder/FormBuilder.strings';
import { getEachFieldExternalField } from '../../redux/reducer/VisibilityReducer';
import { REQUEST_OPERTAOR_LIST } from '../../containers/edit_flow/security/security_policy/SecurityPolicy.strings';
import ChevronRight from '../../assets/icons/ChevronRight';
import LFieldStyles from './l_field/LField.module.scss';
import { DATA_LIST_SYSTEM_FIELDS_NEW, FLOW_SYSTEM_FIELDS_NEW } from '../../utils/constants/systemFields.constant';
import { validateVisibilityRuleCondition } from '../../containers/form_configuration/field_visibility/FieldVisibilityRule.utils';

export const getConditionInitialStateForCBWithMapping = () => {
  const condition = getCBConditionInitialState();
  condition.value_type = VALUE_TYPE_KEY.USER_DEFINED;
  return condition;
};

export const getExpressionInitialStateForCBWithMapping = () => {
  const expression = getCBConditionExpressionInitialState();
  expression.expression.conditions[0].value_type = VALUE_TYPE_KEY.USER_DEFINED;
  return expression;
};

export const getFieldTypeOptionsForCB = ({ fieldsCount, systemFieldsCount }) => [
    {
      label: FIELD_TYPE_TITLE_LABELS.DATA,
      value: FIELD_PICKER_DROPDOWN_TYPES.DATA_FIELDS,
      is_expand: true,
      expand_count: fieldsCount,
      current_level: FIELD_PICKER_DROPDOWN_TYPES.DATA_FIELDS,
    },
    {
      label: FIELD_TYPE_TITLE_LABELS.SYSTEM,
      value: FIELD_PICKER_DROPDOWN_TYPES.SYSTEM_FIELDS,
      is_expand: true,
      expand_count: systemFieldsCount,
      current_level: FIELD_PICKER_DROPDOWN_TYPES.SYSTEM_FIELDS,
    },
  ];

export const getModifiedFieldDetailsForLFields = (dataFields = [], systemFields = [], isOnlyTableColumns = false, tableUUID = null, t = translateFunction) => {
  const sectionBasedFields = [];

  dataFields.forEach((eachField, idx) => {
    const field = { ...eachField };
    if (idx === 0) {
      field.header = t('filter_strings.data_fields');
      field.isHeaderWithBg = true;
    }
     if (isOnlyTableColumns) {
      if (field?.table_uuid === tableUUID) sectionBasedFields.push({ ...field, l_value_type: VALUE_TYPE_KEY.USER_DEFINED });
     } else if (eachField.field_list_type === FIELD_LIST_TYPE.DIRECT) {
         if (eachField.field_type === FIELD_TYPE.TABLE) {
          sectionBasedFields.push(
            {
              ...field,
              table_uuid: eachField.value,
              table_name: eachField.label,
              field_name: eachField.label,
              // value: FIELD_PICKER_DROPDOWN_TYPES.TABLE_FIELDS,
              icon: <ChevronRight />,
              optionLabelClassName: LFieldStyles.TableLabel,
              optionIconClassName: LFieldStyles.TableIcon,
              is_expand: true,
              current_level: FIELD_PICKER_DROPDOWN_TYPES.TABLE_FIELDS,
            },
          );
         } else {
          sectionBasedFields.push({ ...field, l_value_type: VALUE_TYPE_KEY.USER_DEFINED });
         }
     }
  });

  systemFields.forEach((eachField, idx) => {
    const field = { ...eachField };
    if (idx === 0) {
      field.header = t('filter_strings.system_fields');
      field.isHeaderWithBg = true;
    }

    sectionBasedFields.push({ ...field, l_value_type: VALUE_TYPE_KEY.SYSTEM_FIELDS });
  });

  const allFields = {};
  [...dataFields].forEach((eachField) => {
    const field = { ...eachField, [L_VALUE_TYPE]: VALUE_TYPE_KEY.USER_DEFINED };
    if (eachField.field_type === FIELD_TYPE.TABLE) {
      field.columns = dataFields.filter((f) => f.table_uuid === eachField.field_uuid);
      field.table_name = eachField.label;
    }
    allFields[eachField?.value] = field;
  });

  [...systemFields].forEach((eachField) => {
    const field = { ...eachField, [L_VALUE_TYPE]: VALUE_TYPE_KEY.SYSTEM_FIELDS };
    allFields[eachField?.value] = field;
  });

  return {
    dataFields: sectionBasedFields,
    systemFields: [],
    dataFieldCount: 0,
    systemFieldCount: 0,
    allFields,
  };
};

export const getModifiedFieldDetails = (dataFields = [], systemFields = [],
  fieldListDropdownType = null, selectedFieldUUID = null,
  isRValue = false, t = i18next.t,
) => {
  // User Defined Fields.
    const sectionBasedOptionList = getGroupedFieldListForMapping(
        null,
        dataFields,
        [selectedFieldUUID],
        fieldListDropdownType || FEILD_LIST_DROPDOWN_TYPE.DIRECT,
        t,
        [],
    );

    const userDefinedFieldsCountExcludingTitle = sectionBasedOptionList?.filter(
        (eachField) => eachField?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE,
    );

    // System Fields

    const sectionBasedSystemFields = getGroupedSystemFieldListForMapping(systemFields, [selectedFieldUUID]);

    const sectionBasedSystemFieldsCountExcludingTitle = sectionBasedSystemFields?.filter(
        (eachField) => eachField?.optionType !== FIELD_PICKER_DROPDOWN_TYPES.OPTION_LIST_TITLE,
    );

    const allFields = {};

    [...dataFields, ...systemFields].forEach((eachField) => {
      allFields[eachField?.value] = eachField;
    });

    const output = {
      dataFields: sectionBasedOptionList,
      systemFields: sectionBasedSystemFields,
      dataFieldCount: userDefinedFieldsCountExcludingTitle?.length,
      systemFieldCount: sectionBasedSystemFieldsCountExcludingTitle?.length,
      allFields,
    };

    if (isRValue) {
      output.typeBasedDataFields = groupBy(userDefinedFieldsCountExcludingTitle, (eachField) => eachField?.field_type);
      output.typeBasedSystemFields = groupBy(sectionBasedSystemFieldsCountExcludingTitle, (eachField) => eachField?.field_type);
    }

    return output;
};

export const filterFieldsByType = (fieldObject = {}, types = [], t = i18next.t) => {
  const groupedTriggerFields = {
    [t('flows.send_data_to_datalist_all_labels.field_groups.text_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.number_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.date_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.selection_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.file_fields')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.table_names')]: [],
    [t('flows.send_data_to_datalist_all_labels.field_groups.other_fields')]: [],
  };

  types.forEach((eachType) => {
    const fieldList = fieldObject[eachType] || [];
    if (FIELD_TYPE_CATEGORY.NUMBER_FIELDS.includes(eachType)) {
      groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.number_fields')].push(...fieldList);
    } else if (FIELD_TYPE_CATEGORY.DATE_FIELDS.includes(eachType)) {
      groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.date_fields')].push(...fieldList);
    } else if (FIELD_TYPE_CATEGORY.SELECTION_FIELDS.includes(eachType)) {
      groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.selection_fields')].push(...fieldList);
    } else if (FIELD_TYPE_CATEGORY.TEXT_FIELDS.includes(eachType)) {
      groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.text_fields')].push(...fieldList);
    } else if (FIELD_TYPE_CATEGORY.FILE_FIELDS.includes(eachType)) {
      groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.file_fields')].push(...fieldList);
    } else if (FIELD_TYPE_CATEGORY.TABLE_FIELDS.includes(eachType)) {
      groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.table_names')].push(...fieldList);
    } else {
      groupedTriggerFields[t('flows.send_data_to_datalist_all_labels.field_groups.other_fields')].push(...fieldList);
    }
  });

  const fields = [];
  let fieldCount = 0;
  Object.keys(groupedTriggerFields).forEach((eachCategory) => {
    if (!isEmpty(groupedTriggerFields[eachCategory])) {
      fields.push({
        label: eachCategory,
        value: eachCategory,
        optionType: 'Title',
        disabled: true,
      });
      const fieldList = groupedTriggerFields[eachCategory] || [];
      fieldCount += fieldList.length;
      fields.push(...fieldList);
    }
  });

  return { fields, totalCount: fieldCount };
};

const constructCondition = (condition = {}, allFields = []) => {
    const field_data = getFieldFromFieldUuid(allFields, condition[CBAllKeys.L_FIELD]);
    const obj = {
      [CBAllKeys.L_FIELD]: condition[CBAllKeys.L_FIELD],
      [L_VALUE_TYPE]: condition[L_VALUE_TYPE],
      [CBAllKeys.OPERATOR]: getPostOperator(condition[CBAllKeys.OPERATOR]),
      [VALUE_TYPE]: condition?.[VALUE_TYPE],
      [CBAllKeys.CONDITION_UUID]: condition?.[CBAllKeys.CONDITION_UUID],
      condition_type: condition?.condition_type,
    };

    if (condition[R_CONSTANT]) { // r_constant is maintained only in FE
      obj[CBAllKeys.R_VALUE] = condition[R_CONSTANT];
    } else if (has(condition, [CBAllKeys.R_VALUE])) {
      let rValue = Array.isArray(condition[CBAllKeys.R_VALUE]) ? [condition[CBAllKeys.R_VALUE]].flat() : condition[CBAllKeys.R_VALUE];

      if (condition?.[VALUE_TYPE] === VALUE_TYPE_KEY.STATIC_VALUE) {
        switch (field_data?.field_type) {
          case FIELD_TYPES.YES_NO:
            rValue = JSON.parse([condition[CBAllKeys.R_VALUE]]);
            break;
          case FIELD_TYPES.LINK:
            if (Array.isArray(rValue)) {
              rValue = rValue.map((v) => {
                delete v.isEditEnabled;
                return v;
              });
            }
            break;
          case FIELD_TYPE.USER_TEAM_PICKER:
            const value = {};
            if (Array.isArray(rValue?.users) && rValue?.users?.length > 0) {
              value.users = rValue.users.map((user) => user._id);
            }
            if (Array.isArray(rValue?.teams) && rValue?.teams?.length > 0) {
              value.teams = rValue.teams.map((teams) => teams._id);
            }
            rValue = value;
            break;
          default: null;
        }
      }

      obj[CBAllKeys.R_VALUE] = rValue;
    }

    return obj;
};

const constructExpression = (expression = {}, allFields = []) => {
  const clonedExpression = cloneDeep(expression);
  const constrcutedCondition = (clonedExpression?.conditions || []).map((eachCondition) => {
    if (eachCondition?.condition_type === CBConditionType.EXPRESSION) {
      return {
        condition_type: CBConditionType.EXPRESSION,
        expressions: [constructExpression(eachCondition.expression, allFields)],
      };
    }
    return constructCondition(eachCondition, allFields);
  });

  clonedExpression.conditions = constrcutedCondition;

  return clonedExpression;
};

export const constructCBWithFieldMappingPostData = (expression = []) => {
  const allFields = getVisibilityExternalFieldsDropdownList(store.getState(), null, false) || [];
  return constructExpression(expression, allFields);
};

const getResponseRValue = (operator = null, value = null, fieldType) => {
  switch (operator) {
     case REQUEST_OPERTAOR_LIST.EQUAL_TO:
     case REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO:
     case REQUEST_OPERTAOR_LIST.GREATER_THAN:
     case REQUEST_OPERTAOR_LIST.LESSER_THAN:
     case REQUEST_OPERTAOR_LIST.GREATER_THAN_OR_EQUAL_TO:
     case REQUEST_OPERTAOR_LIST.LESSER_THAN_OR_EQUAL_TO:
     case REQUEST_OPERTAOR_LIST.RANGE:
       if ([FIELD_TYPES.CHECKBOX, FIELD_TYPES.LINK].includes(fieldType)) return value;

       if (Array.isArray(value)) {
          if (isBoolean(value?.[0])) return value?.[0]?.toString();
          return value?.[0];
       } else {
          if (isBoolean(value)) return value?.toString();
          return value;
       }

     default: return value;
  }
};

const constructConditionForResponse = (condition = {}, allFields = []) => {
    const consolidateCondition = getConditionInitialStateForCBWithMapping();
    const fieldUUID = condition[CBAllKeys.L_FIELD];
    const fieldType = allFields[fieldUUID]?.field_type;
    const operator = getResponseOperator(condition[CBAllKeys.OPERATOR], allFields?.[fieldUUID]);

    if (condition[CBAllKeys.CONDITION_UUID]) {
      consolidateCondition[CBAllKeys.CONDITION_UUID] = condition[CBAllKeys.CONDITION_UUID];
    }
    consolidateCondition[CBAllKeys.L_FIELD] = fieldUUID;
    consolidateCondition[L_VALUE_TYPE] = condition[L_VALUE_TYPE];
    consolidateCondition[CBAllKeys.OPERATOR] = operator;

    if (condition[VALUE_TYPE]) {
      consolidateCondition[VALUE_TYPE] = condition[VALUE_TYPE];
    } else {
      delete consolidateCondition?.[VALUE_TYPE];
    }

    if (has(condition, [CBAllKeys.R_VALUE])) {
      const hasRConstant = [
        R_CONSTANT_TYPES.NOW,
        R_CONSTANT_TYPES.TODAY,
      ].includes(get(condition, CBAllKeys.R_VALUE));

      if (hasRConstant) {
        consolidateCondition[R_CONSTANT] = get(condition, CBAllKeys.R_VALUE);
      } else {
        consolidateCondition[CBAllKeys.R_VALUE] = getResponseRValue(condition[CBAllKeys.OPERATOR], condition[CBAllKeys.R_VALUE], fieldType);
      }
    }
    return consolidateCondition;
};

const constructExpressionForResponse = (expressions = [], allFields = []) => {
  const clonedExpression = cloneDeep(expressions?.[0]);
  const constrcutedCondition = (clonedExpression?.conditions || []).map((eachCondition) => {
    if (eachCondition?.condition_type === CBConditionType.EXPRESSION) {
      return {
        condition_type: CBConditionType.EXPRESSION,
        expression: constructExpressionForResponse(eachCondition.expressions, allFields),
      };
    }
    return constructConditionForResponse(eachCondition, allFields);
  });

  set(clonedExpression, ['conditions'], constrcutedCondition);

  return clonedExpression;
};
export const constructCBWithFieldMappingResponse = (expression = [], allFields = []) => constructExpressionForResponse(expression, allFields);

export const getSystemFieldsForExternalSource = (isFromFlow = false) => {
    const result = {};

    const datalist_system_fields = cloneDeep(DATA_LIST_SYSTEM_FIELDS_NEW);

    if (isFromFlow) {
      const flow_system_fields = cloneDeep(FLOW_SYSTEM_FIELDS_NEW);
      delete flow_system_fields.step_fields;

      result.rFields = flow_system_fields;
    } else {
      result.rFields = datalist_system_fields;
    }

    result.lFields = datalist_system_fields;

    // const step_fields =  FLOW_SYSTEM_FIELDS_NEW.step_fields.data;

    return result;
};

export const getFilterFields = (expression = [], allFields = {}, systemFields = {}) => {
  const lFields = {};
  const rFields = {};

  const conditionRunner = (condition = {}, fieldList = {}) => {
      // LVALUE
      if (!isEmpty(condition[CBAllKeys.L_FIELD])) {
        const systemFieldList = systemFields?.lFields || {};
        const fieldData = fieldList?.[condition[CBAllKeys.L_FIELD]] ||
                          systemFieldList?.[condition[CBAllKeys.L_FIELD]];
        lFields[condition[CBAllKeys.L_FIELD]] = getEachFieldExternalField(fieldData);
      }

      if (condition[VALUE_TYPE] === VALUE_TYPE_KEY.USER_DEFINED) {
        const systemFieldList = systemFields?.rFields || {};
        // RVALUE
        if (Array.isArray(condition[CBAllKeys.R_VALUE])) {
          condition[CBAllKeys.R_VALUE].forEach((eachFieldUUID) => {
            rFields[eachFieldUUID] = getEachFieldExternalField(
              fieldList?.[eachFieldUUID] || systemFieldList?.[eachFieldUUID]);
          });
        } else if (!isEmpty(condition[CBAllKeys.R_VALUE])) {
          rFields[condition[CBAllKeys.R_VALUE]] = getEachFieldExternalField(
                 fieldList?.[condition[CBAllKeys.R_VALUE]] ||
                 systemFieldList?.[condition[CBAllKeys.R_VALUE]],
              );
        }
      }
  };

  const expressionRunner = (expressions = [], fieldList = {}) => {
    const clonedExpression = cloneDeep(expressions?.[0]);
    (clonedExpression?.conditions || []).map((eachCondition) => {
      if (eachCondition?.condition_type === CBConditionType.EXPRESSION) {
        expressionRunner(eachCondition.expressions, fieldList);
      } else conditionRunner(eachCondition, fieldList);
      return null;
    });
  };

  const fieldList = {};

  allFields.forEach((eachField) => {
    fieldList[eachField?.field_uuid] = eachField;
  });

  expressionRunner(expression, fieldList);

  return { lFields, rFields };
};

export const validateFilter = (filter, flowId) => {
  const rule = filter?.rule;
  const postRule = filter?.postRule;

  const { lFields, rFields } = getSystemFieldsForExternalSource(!!flowId);

  let systemFieldList = (flowId) ?
                [...Object.values(lFields), ...Object.values(rFields)] :
                Object.values(lFields);

  systemFieldList = systemFieldList.map((eachField) => {
 return {
                            ...eachField,
                            field_uuid: eachField?.value,
                      };
});

  const { has_validation: isRuleHasValidation, validated_expression: ruleData } = validateVisibilityRuleCondition(
    { expression: rule } || {},
    systemFieldList,
  );

  const { has_validation: isPostRuleHasValidation, validated_expression: postRuleData } = validateVisibilityRuleCondition(
    { expression: postRule } || {},
    systemFieldList,
  );

  return {
    ruleData,
    postRuleData,
    isRuleHasValidation,
    isPostRuleHasValidation,
  };
};
