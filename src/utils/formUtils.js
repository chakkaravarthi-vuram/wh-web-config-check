import React from 'react';
import moment from 'moment-business-days';
import cx from 'classnames/bind';
// eslint-disable-next-line no-unused-vars
import momentTimezone from 'moment-timezone';
import { isNil, isUndefined, isNull, isObject, isString, filter, findIndex, isEqual } from 'lodash';
import { DATE_FIELDS_OPERATOR_VALUES, FIELD_CONFIG, FIELD_LIST_CONFIG, FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import { getHolidayListDataThunk } from 'redux/actions/HolidayList.Action';
import { YEAR_DROPDOWN } from 'containers/admin_settings/language_and_calendar/LanguagesAndCalendar.strings';
import { replaceNonBreakCharacterToEmpty } from 'components/formula_builder/formula_tokenizer_utils/formulaBuilder.utils';
import { getFieldType } from 'containers/edit_flow/step_configuration/StepConfiguration.utils';
import gClasses from '../scss/Typography.module.scss';
import { store } from '../Store';
import { defaultRuleValidationSchema } from '../validation/default_rule/defaultRule.schema';
import {
  ADD_FORM_FIELD_SOURCE,
  GET_FIELD_INITIAL_DATA,
  GET_FIELD_LIST_INITIAL_DATA,
  FIELD_LIST_TYPE,
  FORM_FIELD_CONFIG_TYPES,
  FIELD_ACCESSIBILITY_TYPES,
  VISIBILITY_CONFIG_FIELDS,
  FIELD_KEYS,
  FIELD_OR_FIELD_LIST,
  FORM_PARENT_MODULE_TYPES,
  FIELD_LIST_KEYS,
  FIELD_TYPE,
  REVERT_BACK_FILEDS,
  USER_TEAM_PICKER_CHANGE_HANDLER_TYPES,
  FORM_TYPES,
  READ_ONLY_FIELD_TYPE,
  PROPERTY_PICKER_ARRAY,
  DEFAULT_RULE_KEYS,
} from './constants/form.constant';
import {
  nullCheck,
  isEmpty,
  cloneDeep,
  has,
  get,
  unset,
  pick,
  compact,
  set,
  isArray,
  formFieldEmptyCheckObjSensitive,
} from './jsUtility';
import {
  checkForDefaultValueValidation,
  getDefaultRuleFieldSaveData,
  getVisibilityRuleApiData,
} from './rule_engine/RuleEngine.utils';
import {
  getSortedListForFormField,
  getSplittedUsersAndTeamsIdObjFromArray,
  getUserProfileData,
  mergeObjects,
  validate,
} from './UtilityFunctions';
import { TABLE_FIELD_LIST_TYPE } from './ValidationConstants';
import { DATE, LINK_FIELD_PROTOCOL, MODULE_TYPES } from './Constants';
import { addDaysToDate, subtractDaysFromDate } from './dateUtils';
import { EMPTY_STRING } from './strings/CommonStrings';
import { getExtensionFromFileName } from './generatorUtils';
import { checkAllFieldsAreReadOnly, checkAllFieldsAreReadOnlyExcludingCurrentField } from './taskContentUtils';
import { CHECKBOX_SELECT_ALL } from '../components/form_builder/FormBuilder.strings';
import { RESPONSE_FIELD_KEYS } from './constants/form/form.constant';

const getFieldListType = (fieldType) => {
  switch (fieldType) {
    case FIELD_LIST_TYPE.TABLE:
      return FIELD_LIST_TYPE.TABLE;
    case FIELD_LIST_TYPE.CHART:
      return FIELD_LIST_TYPE.CHART;
    default:
      return FIELD_LIST_TYPE.DIRECT;
  }
};

export const getFieldOrderKeyBasedOnFieldListType = (fieldListType) => {
  switch (fieldListType) {
    case FIELD_LIST_TYPE.TABLE:
      return 'column_order';
    case FIELD_LIST_TYPE.DIRECT:
      return 'column_order';
    default:
      return 'row_order';
  }
};

export const areAllFieldsReadOnly = (fields) => {
  if (fields && fields.length) {
    return !fields.some((eachField) => eachField.read_only === false);
  }
  return false;
};

export const areAllFieldsDisabled = (fields) => {
  if (fields && fields.length) {
    return !fields.some((eachField) => eachField.is_visible === true);
  }
  return false;
};

export const arrAllTableColumnsVisible = (formData, visibility) => {
  const visible = formData.fields.some((eachField) => visibility[eachField.field_uuid]);
  return !visible;
};

const mergeSavedFieldAndLocalField = (serverField, localField) => {
  const result = {};
  Object.keys(localField).forEach((key) => {
    if (REVERT_BACK_FILEDS.includes(key)) {
      if (key === FIELD_KEYS.HIDE_FIELD_IF_NULL && !serverField[FIELD_KEYS.READ_ONLY]) {
        // ignore
      }
      if (
        key === FIELD_KEYS.IS_DEFAULT_VALUE_RULE &&
        serverField[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]) {
        if (serverField[FIELD_KEYS.DEFAULT_VALUE_RULE]) {
          result[FIELD_KEYS.DEFAULT_VALUE_RULE] = serverField[FIELD_KEYS.DEFAULT_VALUE_RULE];
        }
      }
      if (key === 'validations') {
        if (serverField.field_type === FIELD_TYPE.CURRENCY) {
          result.validations = cloneDeep(serverField.validations);
          if (!has(serverField, ['validations', 'allowed_currency_types'])) {
            result.validations.allowed_currency_types = [];
          }
        }
        if (serverField.field_type === FIELD_TYPE.FILE_UPLOAD) {
          if (serverField.validations) {
            result.validations = {
              ...cloneDeep(serverField.validations),
            };
            delete result.validations.is_multiple;
          } else {
            result.validations = {};
          }
        } else if (serverField.field_type === FIELD_TYPE.LINK) {
          result.validations = cloneDeep(serverField.validations);
          if (
            has(serverField, ['validations', 'is_multiple']) &&
            serverField.validations.is_multiple === false
          ) {
            result.validations = { is_multiple: false };
          } else result.validations = {};
        }
      }
      if (key === 'values') {
        if (serverField && serverField.values) result[key] = serverField.values.join();
      } else result[key] = serverField[key];
    } else result[key] = localField[key];
  });
  return result;
};

export const getEmptySectionsBeforeEditedSectionIndex = (
  sections,
  sectionIndex,
) => {
  let emptySectionBeforeEditedSection = 0;
  if (!isEmpty(sections)) {
    for (let i = 0; i < sectionIndex; i += 1) {
      const currenctSection = get(sections, [i]);
      if (isEmpty(currenctSection.field_list)) {
        emptySectionBeforeEditedSection += 1;
      } else {
        let emptyFields = 0;
        currenctSection.field_list.forEach((eachFieldList) => {
          if (
            eachFieldList.field_list_type !== TABLE_FIELD_LIST_TYPE &&
            isEmpty(get(eachFieldList, ['fields']))
          ) emptyFields += 1;
        });
        emptySectionBeforeEditedSection += emptyFields;
      }
    }
  }
  return emptySectionBeforeEditedSection;
};

export const closeFieldOrFieldListConfigAndGetUpdatedFieldList = (
  sections = [],
  configType,
  fieldListType,
  sectionIndex,
  fieldListIndex,
  fieldIndex,
  form_details,
) => {
  const editedSectionIndex =
    sectionIndex -
    getEmptySectionsBeforeEditedSectionIndex(sections, sectionIndex);
  if (configType === FORM_FIELD_CONFIG_TYPES.FIELD_LIST) {
    if (fieldListType === FIELD_LIST_TYPE.TABLE) {
      console.log('getEmptySectionsBeforeEditedSectionIndex', sections);
      let allFieldList = [...sections[sectionIndex].field_list];
      if (
        has(form_details, [
          'sections',
          editedSectionIndex,
          'field_list',
          fieldListIndex,
        ])
      ) {
        const serverFieldList =
          form_details.sections[editedSectionIndex].field_list[fieldListIndex];
        const localFieldList = { ...allFieldList[fieldListIndex] };
        localFieldList.table_name = serverFieldList.table_name;
        localFieldList.table_validations = { ...serverFieldList.table_validations };
        localFieldList[FIELD_KEYS.RULE_EXPRESSION] =
          localFieldList[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION];
        localFieldList[FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION] = false;
        localFieldList.table_reference_name =
          serverFieldList.table_reference_name;
        localFieldList.is_field_list_show_when_rule =
          serverFieldList.is_field_list_show_when_rule;
        localFieldList.is_visible = serverFieldList.is_visible;
        if (serverFieldList.is_unique_column_available && (!serverFieldList.unique_column_uuid || isEmpty(serverFieldList.unique_column_uuid))) {
          localFieldList.is_unique_column_available = false;
        }
        allFieldList[fieldListIndex] = {
          ...localFieldList,
          isFieldListConfigPopupOpen: false,
        };
      } else {
        allFieldList[fieldListIndex] = {
          ...allFieldList[fieldListIndex],
          isFieldListConfigPopupOpen: false,
        };
      }
      if (!nullCheck(allFieldList[fieldListIndex], 'table_uuid')) {
        // deleting fieldlist
        allFieldList.splice(fieldListIndex, 1);
        // reordering remaining fieldlist
        allFieldList = allFieldList.map((eachFieldList, eachFieldListIndex) => {
          return {
            ...eachFieldList,
            row_order: eachFieldListIndex + 1,
          };
        });
      }
      return allFieldList;
    }
  } else if (configType === FORM_FIELD_CONFIG_TYPES.FIELD) {
    let allFieldList;
    let allFields;
    if (
      has(form_details, [
        'sections',
        editedSectionIndex,
        'field_list',
        fieldListIndex,
        'fields',
        fieldIndex,
      ])
    ) {
      allFieldList = [...sections[sectionIndex].field_list];
      allFields = [...sections[sectionIndex].field_list[fieldListIndex].fields];
      allFields[fieldIndex] = {
        ...mergeSavedFieldAndLocalField(
          form_details.sections[editedSectionIndex].field_list[fieldListIndex]
            .fields[fieldIndex],
          allFields[fieldIndex],
        ),
        isConfigPopupOpen: false,
      };
      allFields[fieldIndex][FIELD_KEYS.DEFAULT_DRAFT_VALUE] =
        allFields[fieldIndex][FIELD_KEYS.PREVIOUS_DRAFT_DRAFT_RULE];
      allFields[fieldIndex][FIELD_KEYS.RULE_EXPRESSION] =
        allFields[fieldIndex][FIELD_KEYS.PREVIOUS_RULE_EXPRESSION];
      allFields[fieldIndex][FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION] = false;
      allFieldList[fieldListIndex] = {
        ...allFieldList[fieldListIndex],
        fields: allFields,
      };
    } else {
      allFieldList = [...sections[sectionIndex].field_list];
      allFields = [...sections[sectionIndex].field_list[fieldListIndex].fields];
      allFields[fieldIndex] = {
        ...allFields[fieldIndex],
        isConfigPopupOpen: false,
      };
      allFieldList[fieldListIndex] = {
        ...allFieldList[fieldListIndex],
        fields: allFields,
      };
    }
    if (!nullCheck(allFields[fieldIndex], 'field_uuid')) {
      // deleting field
      allFields.splice(fieldIndex, 1);
      // reordering remaining fields
      let fieldOrder = 'row_order';
      if (fieldListType === FIELD_LIST_TYPE.TABLE) fieldOrder = 'column_order';
      allFields = allFields.map((eachField, eachFieldIndex) => {
        return {
          ...eachField,
          [fieldOrder]: eachFieldIndex + 1,
        };
      });
      allFieldList[fieldListIndex] = {
        ...allFieldList[fieldListIndex],
        fields: allFields,
      };

      // deleting fieldlist if there is no direct fields
      if (fieldListType === FIELD_LIST_TYPE.DIRECT && allFields.length === 0) {
        allFieldList.splice(fieldListIndex, 1);
        // reordering remaining fieldlist
        allFieldList = allFieldList.map((eachFieldList, eachFieldListIndex) => {
          return {
            ...eachFieldList,
            row_order: eachFieldListIndex + 1,
          };
        });
      }
    }
    return allFieldList;
  }
  return [];
};

export const getLookupId = (lookUpList, selectedLookup) => {
  console.log('getLookupId', lookUpList, selectedLookup);
  let value_metadata = {};
  lookUpList.forEach((value) => {
    if (value.lookup_name === selectedLookup) value_metadata = { custom_lookup_id: value._id };
  });
  console.log('value_metadata', value_metadata);
  return value_metadata;
};

export const getUserTeamPickerValidationData = (validationData = {}) => {
  console.log('getUserTeamPickerValidationData', validationData);
  const validations = { ...validationData };
  if (
    (!has(validations, 'allow_users') && !has(validations, 'allow_teams')) ||
    (!validations.allow_users && !validations.allow_teams)
  ) {
    validations.allow_users = true;
    validations.allow_teams = false;
  }
  if (has(validations, 'maximum_selection')) validations.allow_maximum_selection = true;
  if (has(validations, 'minimum_selection')) validations.allow_minimum_selection = true;
  if (!has(validations, 'is_restricted')) validations.is_restricted = false;
  if (!has(validations, 'allow_maximum_selection')) validations.allow_maximum_selection = false;
  if (!has(validations, 'allow_minimum_selection')) validations.allow_minimum_selection = false;
  if (validations.is_restricted) {
    validations.restricted_user_team = getSplittedUsersAndTeamsIdObjFromArray(
      validations.restricted_user_team,
    );
  }

  if (!validations.is_restricted && has(validations, 'restricted_user_team')) delete validations.restricted_user_team;
  console.log('userpicker validation max before', validations, !validations.allow_maximum_selection, has(validations, 'maximum_user_selection'));
  if (
    !validations.allow_maximum_selection &&
    has(validations, 'maximum_selection')
  ) delete validations.maximum_selection;
  if (
    !validations.allow_minimum_selection &&
    has(validations, 'minimum_selection')
  ) delete validations.minimum_selection;

  if (!validations.allow_multiple) {
    delete validations.allow_maximum_selection;
    delete validations.allow_minimum_selection;
    delete validations.minimum_selection;
    delete validations.maximum_selection;
    validations.allow_multiple = false;
  }
  return validations;
};

export const addNewFormFieldAndGetUpdatedFieldList = (
  fieldSuggestionData,
  _sections = [],
  addFormFieldSource,
  fieldType,
  sectionIndex,
  fieldListIndex,
  fieldIndex,
  form_details = {},
  initialTaskLabel,
  optionValue,
) => {
  const clonedSection = cloneDeep(_sections);
  let openedSectionIndex = null;
  let openedFieldListIndex = null;
  let openedFieldIndex = null;
  clonedSection.some((_section, eachSectionIndex) => {
    if (_section.field_list) {
      return _section.field_list.some((eachFieldList, eachFieldListIndex) => {
        if (eachFieldList[FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN]) {
          openedSectionIndex = eachSectionIndex;
          openedFieldListIndex = eachFieldListIndex;
          return true;
        }
        if (eachFieldList.fields) {
          return eachFieldList.fields.some((eachFields, eachFieldsIndex) => {
            if (eachFields[FIELD_KEYS.IS_CONFIG_OPEN]) {
              openedSectionIndex = eachSectionIndex;
              openedFieldListIndex = eachFieldListIndex;
              openedFieldIndex = eachFieldsIndex;
              return true;
            }
            return false;
          });
        }
        return false;
      });
    }
    return false;
  });
  if (openedSectionIndex !== null) {
    const configType =
      fieldIndex === null
        ? FORM_FIELD_CONFIG_TYPES.FIELD_LIST
        : FORM_FIELD_CONFIG_TYPES.FIELD;
    clonedSection[openedSectionIndex].field_list =
      closeFieldOrFieldListConfigAndGetUpdatedFieldList(
        clonedSection,
        configType,
        clonedSection[openedSectionIndex].field_list[openedFieldListIndex]
          .field_list_type,
        openedSectionIndex,
        openedFieldListIndex,
        openedFieldIndex,
        form_details,
      );
  }
  if (addFormFieldSource === ADD_FORM_FIELD_SOURCE.TABLE) {
    const tableFields = [
      ...clonedSection[sectionIndex].field_list[fieldListIndex].fields,
      GET_FIELD_INITIAL_DATA(fieldSuggestionData, fieldType, 1, fieldIndex + 1, initialTaskLabel, optionValue),
    ];
    const tableFieldList = {
      ...clonedSection[sectionIndex].field_list[fieldListIndex],
      fields: tableFields,
    };
    const allFieldList = [...clonedSection[sectionIndex].field_list];
    allFieldList[fieldListIndex] = tableFieldList;
    return allFieldList;
  }
  if (fieldListIndex === null) {
    return [
      ...clonedSection[sectionIndex].field_list,
      GET_FIELD_LIST_INITIAL_DATA(
        fieldSuggestionData,
        getFieldListType(fieldType),
        clonedSection[sectionIndex].field_list.length + 1,
        1,
        fieldType,
        1,
        1,
        initialTaskLabel,
        optionValue,
      ),
    ];
  } else {
    const field = GET_FIELD_INITIAL_DATA({}, fieldType, 1, fieldIndex + 1, initialTaskLabel, optionValue);
    set(
      clonedSection,
      [sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex],
      field,
    );
    return [...clonedSection[sectionIndex].field_list];
  }
};

export const validateDefaultRuleValue = (draft_default_rule, is_advanced_expression = false) => {
  const cloned_draft_default_rule = cloneDeep(draft_default_rule);
  if (is_advanced_expression) {
    if (has(cloned_draft_default_rule, [DEFAULT_RULE_KEYS.INPUT], false)) {
      cloned_draft_default_rule[DEFAULT_RULE_KEYS.INPUT] = replaceNonBreakCharacterToEmpty(cloned_draft_default_rule[DEFAULT_RULE_KEYS.INPUT]);
    }
  }
  return validate(
    cloned_draft_default_rule,
    defaultRuleValidationSchema(get(cloned_draft_default_rule, ['operator']), is_advanced_expression),
  );
};

export const getSaveFormRule = (metadata, field) => {
  const saveRules = [];

  if (field && field.is_field_default_value_rule) {
    if (
      (field.field_default_value_rule && field.draft_default_rule) ||
      !field.field_default_value_rule
    ) {
      const { draft_default_rule } = field;
      unset(draft_default_rule, ['errors']);
      const error = validateDefaultRuleValue(draft_default_rule, field[FIELD_KEYS.IS_ADVANCED_EXPRESSION]);
      if (isEmpty(error)) {
        const ruleData = getDefaultRuleFieldSaveData(
          field.draft_default_rule,
          { ...metadata, field_uuid: field.field_uuid },
          field[FIELD_KEYS.DEFAULT_VALUE_RULE],
          field[FIELD_KEYS.IS_ADVANCED_EXPRESSION],
        );
        saveRules.push({ default_rule: ruleData, is_default_rule: true });
      } else if (error) {
        return { success: false, error, defaultValue: true };
      }
    }
  }
  if (field && field.is_field_show_when_rule) {
    if (
      (field.field_show_when_rule && field[FIELD_KEYS.RULE_EXPRESSION]) ||
      !field.field_show_when_rule
    ) {
      if (get(field, [FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION], false)) {
        const expression_error = { query_builder: 'has validation' };
        return { success: false, expression_error, visibilityField: true };
      }
      const visibilityApiData = getVisibilityRuleApiData(
        { ...metadata, field_uuid: field.field_uuid },
        field[FIELD_KEYS.FIELD_SHOW_WHEN_RULE],
        'rule_field_show_when_condition',
        field[FIELD_KEYS.RULE_EXPRESSION],
      );
      saveRules.push({ field_rule: visibilityApiData, is_field_rule: true });
    }
  }
  return { success: true, saveRules };
};

export const getSaveTableRule = (metadata, field) => {
  const saveRules = [];
  if (field && (field.is_field_list_visibility_rule || field.is_field_list_show_when_rule) &&
  !isEqual(field?.previous_rule_expression, field.rule_expression)) {
    if (
      (field.field_list_show_when_rule && field[FIELD_KEYS.RULE_EXPRESSION]) ||
      !field.field_list_show_when_rule
    ) {
      if (get(field, [FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION], false)) {
        const expression_error = { query_builder: 'has validation' };
        return { success: false, expression_error, visibilityField: true };
      }
      const visibilityApiData = getVisibilityRuleApiData(
        { ...metadata, field_uuid: field.field_uuid },
        field[FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE],
        'rule_field_list_show_when_condition',
        field[FIELD_KEYS.RULE_EXPRESSION],
      );
      saveRules.push({ fieldlist_rule: visibilityApiData, is_field_list_rule: true });
    }
  }
  return { success: true, saveRules };
};

export const getSaveFormAndFieldData = (fieldValueData, state) => {
  if (fieldValueData.read_only) {
    fieldValueData.hide_field_if_null = !!fieldValueData.hide_field_if_null;
  } else if (has(fieldValueData, FIELD_KEYS.HIDE_FIELD_IF_NULL)) {
    delete fieldValueData.hide_field_if_null;
  }
  if (has(fieldValueData, FIELD_KEYS.READ_ONLY_PREVIOUS_STATE)) delete fieldValueData[FIELD_KEYS.READ_ONLY_PREVIOUS_STATE];
  if (has(fieldValueData, 'origin_form')) delete fieldValueData.origin_form;
  if (has(fieldValueData, 'origin_step_order')) delete fieldValueData.origin_step_order;
  if (has(fieldValueData, 'origin_step_name')) delete fieldValueData.origin_step_name;
  if (has(fieldValueData, 'isSelected')) delete fieldValueData.isSelected;
  if (has(fieldValueData, 'isDisabled')) delete fieldValueData.isDisabled;
  if (has(fieldValueData, FIELD_KEYS.RULE_EXPRESSION)) delete fieldValueData[FIELD_KEYS.RULE_EXPRESSION];
  if (has(fieldValueData, FIELD_KEYS.PREVIOUS_RULE_EXPRESSION)) delete fieldValueData[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION];
  if (has(fieldValueData, FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION)) delete fieldValueData[FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION];

  if (
    has(fieldValueData, ['validations', 'allowed_currency_types']) &&
    isEmpty(fieldValueData.validations.allowed_currency_types)
  ) {
    delete fieldValueData.validations.allowed_currency_types;
  }

  if (fieldValueData.field_type === FIELD_TYPE.FILE_UPLOAD) {
    if (fieldValueData.validations) {
      fieldValueData.validations = {
        ...fieldValueData.validations,
        is_multiple: fieldValueData.validations.is_multiple || false,
      };
    } else {
      fieldValueData.validations = {
        is_multiple: false,
      };
    }
  } else if (fieldValueData.field_type === FIELD_TYPE.LINK) {
    if (
      !has(fieldValueData, ['validations', 'is_multiple']) ||
      fieldValueData.validations.is_multiple === false
    ) {
      fieldValueData.validations = { is_multiple: false };
    }
  } else if (fieldValueData.field_type === FIELD_TYPE.DATE) {
    if (isEmpty(fieldValueData.validations)) {
      fieldValueData.validations = {
        date_selection: [
          {
            type: 'no_limit',
          },
        ],
      };
    }
  } else if (fieldValueData.field_type === FIELD_TYPE.DATETIME) {
    if (isEmpty(fieldValueData.validations)) {
      fieldValueData.validations = {
        date_selection: [
          {
            type: 'no_limit',
          },
        ],
      };
    }
  } else if (fieldValueData.field_type === FIELD_TYPE.USER_TEAM_PICKER) {
    fieldValueData.validations = getUserTeamPickerValidationData(
      cloneDeep(fieldValueData.validations),
    );
    if (fieldValueData.has_property_field) delete fieldValueData.has_property_field;
  } else if (fieldValueData.field_type === FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN) {
    fieldValueData.validations = {};
    const { lookUpList } = store.getState().LookUpReducer;
    fieldValueData.value_metadata = isUndefined(fieldValueData.value_metadata)
      ? getLookupId(lookUpList, fieldValueData.selected_lookup_field)
      : fieldValueData.value_metadata;
    delete fieldValueData.values;
    delete fieldValueData?.value_metadata?.custom_lookup_name;
    delete fieldValueData.selected_lookup_field;
  } else if (fieldValueData.field_type === FIELD_TYPE.DATA_LIST) {
    if (Object.keys(fieldValueData.validations).includes('is_datalist_filter')) {
      if (!fieldValueData.validations.is_datalist_filter) fieldValueData.validations.filter_fields = [];
      delete fieldValueData.validations.is_datalist_filter;
    }
    const validationData = get(fieldValueData, ['validations'], {});

    fieldValueData.validations = {
      ...validationData,
      allow_multiple: !!get(validationData, ['allow_multiple'], false),
    };

    if (has(fieldValueData, ['data_list', 'has_property_field'], false)) delete fieldValueData.data_list.has_property_field;
  }
  if (
    (fieldValueData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE] &&
      fieldValueData[FIELD_KEYS.DEFAULT_VALUE_RULE]) ||
    (fieldValueData[FIELD_KEYS.IS_DEFAULT_RULE] &&
      fieldValueData[FIELD_KEYS.DEFAULT_RULE_SAVE_FIELD])
  ) {
    delete fieldValueData[FIELD_KEYS.DEFAULT_VALUE];
  }
  fieldValueData.field_name = fieldValueData.field_name.trim();
  if (fieldValueData.field_type !== FIELD_TYPE.CURRENCY) {
    if (formFieldEmptyCheckObjSensitive(fieldValueData.default_value)) {
      if (typeof fieldValueData.default_value === 'string') {
        fieldValueData.default_value = fieldValueData.default_value.trim();
      }
    } else if (
      !isEmpty(state.form_details) &&
      has(fieldValueData, ['default_value'])
    ) {
      delete fieldValueData.default_value;
    }
  }
  if (has(fieldValueData, ['default_value']) && fieldValueData.default_value === null) delete fieldValueData.default_value;
  console.log('filescheck fieldValueData', fieldValueData);
  if (isEmpty(fieldValueData.reference_name)) {
    fieldValueData.reference_name = fieldValueData.field_name.trim();
  } else {
    fieldValueData.reference_name = fieldValueData.reference_name.trim();
  }
  if (!Object.prototype.hasOwnProperty.call(fieldValueData, 'is_field_show_when_rule')) {
    console.log('filescheck is_field_show_when_rule check');
    fieldValueData.is_field_show_when_rule = false;
  }
  const valueFields = [FIELD_TYPE.DROPDOWN, FIELD_TYPE.CHECKBOX, FIELD_TYPE.RADIO_GROUP];
  if ((valueFields.includes(fieldValueData.field_type)) && !Object.prototype.hasOwnProperty.call(fieldValueData, 'values')) {
    console.log('filescheck is_field_show_when_rule check');
    fieldValueData.values = ['option 1', 'option 2'];
  }
  console.log('filescheck is_field_default_value_rule check before', Object.prototype.hasOwnProperty.call(fieldValueData, 'is_field_default_value_rule'));
  if (!Object.prototype.hasOwnProperty.call(fieldValueData, 'is_field_default_value_rule')) {
    console.log('filescheck is_field_default_value_rule check');
    fieldValueData.is_field_default_value_rule = false;
  }

  if (Object.prototype.hasOwnProperty.call(fieldValueData, 'has_property_field')) {
    console.log('filescheck has_property_field check');
    delete fieldValueData.has_property_field;
  }
  if (fieldValueData.field_type === 'number' && !Object.prototype.hasOwnProperty.call(fieldValueData, 'is_digit_formatted')) {
    console.log('filescheck is_digit_formatted check');
    fieldValueData.is_digit_formatted = true;
  }

  // If read_only is enabled, no need to remove required field validation to presist required validation while importing
  // if (fieldValueData.read_only) {
  //   if (fieldValueData.field_type === FIELD_TYPE.FILE_UPLOAD) {
  //     fieldValueData.required = false;
  //   } else if (fieldValueData.field_type === FIELD_TYPE.LINK) {
  //     fieldValueData.required = false;
  //   } else if (fieldValueData.field_type === FIELD_TYPE.DATE) {
  //     fieldValueData.required = false;
  //   } else if (fieldValueData.field_type === FIELD_TYPE.DATETIME) {
  //     fieldValueData.required = false;
  //   } else if (fieldValueData.field_type === FIELD_TYPE.CURRENCY) {
  //     fieldValueData.required = false;
  //     if (
  //       !isEmpty(fieldValueData.validation) &&
  //       fieldValueData.validations.allowed_currency_types
  //     ) {
  //       fieldValueData.required = false;
  //     }
  //   } else if (fieldValueData.field_type === FIELD_TYPE.USER_TEAM_PICKER) {
  //     fieldValueData.required = false;
  //   } else if (fieldValueData.field_type === FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN) {
  //     fieldValueData.required = false;
  //   } else if (fieldValueData.field_type === FIELD_TYPE.USER_PROPERTY_PICKER) {
  //     // const validationData = get(fields, ['validations'], {});

  //     // field.validations = {
  //     //   ...validationData,
  //     //   allow_multiple: !!get(validationData, ['allow_multiple'], false),
  //     // };
  //   } else {
  //     fieldValueData.required = false;
  //   }
  // }

  if (
    [
      FIELD_TYPE.CHECKBOX,
      FIELD_TYPE.DROPDOWN,
      FIELD_TYPE.RADIO_GROUP,
    ].includes(fieldValueData.field_type)
  ) {
    fieldValueData.values = getSortedListForFormField(fieldValueData.values);
  }
  delete fieldValueData.isConfigPopupOpen;
  if (!fieldValueData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE] && has(fieldValueData, [FIELD_KEYS.IS_ADVANCED_EXPRESSION])) {
    delete fieldValueData[FIELD_KEYS.IS_ADVANCED_EXPRESSION];
  }
  delete fieldValueData.draft_default_rule;
  delete fieldValueData[FIELD_KEYS.RULE_EXPRESSION];
  delete fieldValueData[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION];
  delete fieldValueData[FIELD_KEYS.PREVIOUS_DRAFT_DRAFT_RULE];
  delete fieldValueData.errors;
  delete fieldValueData.form_count;
  delete fieldValueData.is_imported;

  return fieldValueData;
};

export const getSaveFieldAPIData = (
  state = {},
  editedSectionIndex,
  editedFieldListIndex,
  editedFieldIndex,
  getSaveFormMetadata,
  skipIsEdited = false,
) => {
  console.log('filescheck getSaveFieldAPIData');
  let fieldValueData = {};
  let formPostData = {};
  if (!isEmpty(state?.form_title)) formPostData.form_title = state.form_title;
  if (!isEmpty(state?.form_description)) formPostData.form_decsription = state.form_decsription;

  formPostData = { ...formPostData, ...getSaveFormMetadata() };
  console.log('filescheck getSaveFieldAPIData formPostData', formPostData);
  formPostData.sections = cloneDeep(state.sections);
  const selectedSectionObj = formPostData.sections[editedSectionIndex];
  const selectedFieldListObj = formPostData.sections[editedSectionIndex].field_list[editedFieldListIndex];

  fieldValueData = cloneDeep(formPostData.sections[editedSectionIndex].field_list[editedFieldListIndex].fields[
    editedFieldIndex
  ]);
  fieldValueData = { ...fieldValueData, ...getSaveFormMetadata() };
  console.log('filescheck getSaveFieldAPIData fieldValueData', fieldValueData);
  if (selectedSectionObj && selectedSectionObj.section_uuid) {
    fieldValueData.section_uuid = selectedSectionObj.section_uuid;
  } else {
    fieldValueData.section_order = selectedSectionObj.section_order;
  }
  fieldValueData.field_list_row_order = selectedFieldListObj.row_order;
  fieldValueData.field_list_column_order = selectedFieldListObj.column_order;
  fieldValueData.field_list_type = selectedFieldListObj.field_list_type;
  fieldValueData.is_field_rule = false;
  fieldValueData.is_default_rule = false;

  if (selectedFieldListObj.field_list_type === FIELD_LIST_TYPE.TABLE) {
    fieldValueData.table_uuid = selectedFieldListObj.table_uuid;
    fieldValueData.table_name = selectedFieldListObj.table_name.trim();
    // if (fieldValueData.table_name) unset(fieldValueData, 'table_name');
  }

  if (!isEmpty(state.form_details)) {
    const metadata = {
      task_metadata_id: state.form_details.task_metadata_id,
      form_uuid: state.form_details.form_uuid,
    };
    try {
      const data = getSaveFormRule(metadata, fieldValueData);
      if (data && !isEmpty(data.saveRules)) {
        data.saveRules.map((ruleData) => {
          if (ruleData.is_default_rule) {
            unset(fieldValueData.previous_draft_default_rule, ['errors']); // remove errors to check equal to draft default rule
            if (!isEqual(fieldValueData.previous_draft_default_rule, fieldValueData.draft_default_rule)) {
              fieldValueData.is_default_rule = true;
              fieldValueData.default_rule = {
                rule_type: ruleData.default_rule.rule_type,
                rule: ruleData.default_rule.rule,
              };
              if (fieldValueData && fieldValueData.is_field_default_value_rule && fieldValueData.field_default_value_rule) {
                fieldValueData.default_rule = { ...fieldValueData.default_rule, rule_id: fieldValueData.field_default_value_rule };
              }
            } else {
              delete fieldValueData.is_default_rule;
            }
          }
          if (ruleData.is_field_rule) {
            if (!isEqual(fieldValueData.previous_rule_expression, fieldValueData.rule_expression)) {
              fieldValueData.is_field_rule = true;
              fieldValueData.field_rule = {
                rule_type: ruleData.field_rule.rule_type,
                rule: ruleData.field_rule.rule,
              };
              if (fieldValueData && fieldValueData.is_field_show_when_rule && fieldValueData.field_show_when_rule) {
                fieldValueData.field_rule = { ...fieldValueData.field_rule, rule_id: fieldValueData.field_show_when_rule };
              }
            } else {
              delete fieldValueData.is_field_rule;
            }
          }
          return null;
        });
      }
    } catch (e) {
      console.log('error', e);
    }
    if (state.form_details._id) fieldValueData.form_id = state.form_details._id;
    if (state.form_details.form_uuid) fieldValueData.form_uuid = state.form_details.form_uuid;
  }

  if (!selectedFieldListObj[FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE]) {
    delete fieldValueData[FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE];
  }

  if (!skipIsEdited) {
    fieldValueData.is_edited = true;
  } else {
    fieldValueData.is_edited = false;
  }

  // changes to be made common
  fieldValueData = getSaveFormAndFieldData(fieldValueData, state);
  if (!isEmpty(state.form_details)) {
    if (fieldValueData.is_default_rule && !isEmpty(fieldValueData.default_rule)) {
      delete fieldValueData.field_default_value_rule;
      fieldValueData.is_field_default_value_rule = false;
    } else {
      if (!fieldValueData.is_field_default_value_rule) {
        delete fieldValueData.field_default_value_rule;
      }
      if (
        fieldValueData.is_field_default_value_rule &&
        !fieldValueData.field_default_value_rule
      ) {
        fieldValueData.is_field_default_value_rule = false;
      }
      if (fieldValueData.is_field_default_value_rule && fieldValueData.field_default_value_rule) {
        delete fieldValueData.is_default_rule;
      }
    }

    if (fieldValueData.is_field_rule && !isEmpty(fieldValueData.field_rule)) {
      delete fieldValueData.field_show_when_rule;
      fieldValueData.is_field_show_when_rule = false;
    } else {
      if (!fieldValueData.is_field_show_when_rule) {
        delete fieldValueData.field_show_when_rule;
      }
      if (fieldValueData.is_field_show_when_rule && !fieldValueData.field_show_when_rule) {
        fieldValueData.is_field_show_when_rule = false;
      }
      if (fieldValueData.is_field_show_when_rule && fieldValueData.field_show_when_rule) {
        delete fieldValueData.is_field_rule;
      }
    }
  }
  console.log('save field api', fieldValueData);
  return fieldValueData;
};

export const getSaveTableApiData = (
  state = {},
  editedSectionIndex,
  editedFieldListIndex,
  getSaveFormMetadata,
  reOrder,
) => {
  let formPostData = {};
  if (!isEmpty(state?.form_title)) formPostData.form_title = state.form_title;
  if (!isEmpty(state.form_description)) formPostData.form_decsription = state.form_decsription;
  if (!isEmpty(state.form_details)) {
    if (state.form_details._id) formPostData._id = state.form_details._id;
    if (state.form_details.form_uuid) formPostData.form_uuid = state.form_details.form_uuid;
  }
  formPostData = { ...formPostData, ...getSaveFormMetadata() };
  formPostData.sections = cloneDeep(state.sections);
  const selectedSectionObj = formPostData.sections[editedSectionIndex];
  const currentTable = cloneDeep(state?.sections)?.[editedSectionIndex]?.field_list?.[editedFieldListIndex];
  let fieldValueData = cloneDeep(formPostData.sections[editedSectionIndex]?.field_list?.[editedFieldListIndex]);
  fieldValueData = { ...fieldValueData, ...getSaveFormMetadata() };
  if (selectedSectionObj && selectedSectionObj.section_uuid) {
    fieldValueData.section_uuid = selectedSectionObj.section_uuid;
  } else {
    fieldValueData.section_order = selectedSectionObj.section_order;
  }
    if (currentTable?.table_uuid) fieldValueData.table_uuid = currentTable?.table_uuid;
    fieldValueData.table_name = currentTable?.table_name;
    if (!isEmpty(state.form_details)) {
      fieldValueData?.fields?.forEach((field, fieldIndex) => {
        let fields =
        fieldValueData?.fields[fieldIndex];
        if (has(fields, 'is_imported')) delete fields.is_imported;
        if (has(field, 'is_imported')) delete field.is_imported;
        if (has(fields, 'form_count')) delete fields.form_count;
        if (has(field, 'form_count')) delete field.form_count;

        // changes to be made common
        fields = getSaveFormAndFieldData(fields, state);

        if (!isEmpty(state.form_details)) {
          if (!fields.is_field_default_value_rule) {
            delete fields.field_default_value_rule;
          }
          if (
            fields.is_field_default_value_rule &&
            !fields.field_default_value_rule
          ) {
            fields.is_field_default_value_rule = false;
          }
          if (!fields.is_field_show_when_rule) {
            delete fields.field_show_when_rule;
          }
          if (fields.is_field_show_when_rule && !fields.field_show_when_rule) {
            fields.is_field_show_when_rule = false;
          }
        }

        fieldValueData.fields[fieldIndex] = fields;
      });
    }

    const metadata = {
      task_metadata_id: state.form_details.task_metadata_id,
      form_uuid: state.form_details.form_uuid,
    };

    try {
      const data = getSaveTableRule(metadata, cloneDeep(fieldValueData));
      if (data && !isEmpty(data.saveRules)) {
        data.saveRules.map((ruleData) => {
          if (ruleData.is_field_list_rule) {
            if (!isEqual(fieldValueData.previous_rule_expression, fieldValueData.rule_expression)) {
              fieldValueData.field_list_visibility_rule = {
                rule_type: ruleData.fieldlist_rule.rule_type,
                rule: ruleData.fieldlist_rule.rule,
                rule_id: fieldValueData.field_list_show_when_rule,
              };
              delete fieldValueData.field_list_show_when_rule;
              if (fieldValueData.field_list_show_when_rule) {
                delete fieldValueData.is_field_list_show_when_rule;
                fieldValueData.is_field_list_visibility_rule = true;
                delete fieldValueData.field_list_show_when_rule;
              } else {
                fieldValueData.is_field_list_show_when_rule = false;
                fieldValueData.is_field_list_visibility_rule = true;
              }
            } else {
              delete fieldValueData.is_field_list_rule;
              delete fieldValueData.field_list_show_when_rule;
            }
          }
          return null;
        });
      } else {
        delete fieldValueData.is_field_list_visibility_rule;
        delete fieldValueData.field_list_visibility_rule;
        if (!fieldValueData.is_field_list_show_when_rule && !fieldValueData.field_list_show_when_rule) {
          fieldValueData.is_field_list_visibility_rule = false;
        }
      }
    } catch (e) {
      console.log('error', e);
    }

  if (!currentTable[FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE]) {
    delete fieldValueData[FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE];
  }

  if (!isEmpty(state.form_details)) {
    if (state.form_details._id) fieldValueData.form_id = state.form_details._id;
    if (state.form_details.form_uuid) fieldValueData.form_uuid = state.form_details.form_uuid;
  }

  delete fieldValueData.isFieldListConfigPopupOpen;

  if (has(fieldValueData, FIELD_KEYS.RULE_EXPRESSION)) delete fieldValueData[FIELD_KEYS.RULE_EXPRESSION];
  if (has(fieldValueData, FIELD_KEYS.PREVIOUS_RULE_EXPRESSION)) delete fieldValueData[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION];
  if (has(fieldValueData, FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION)) delete fieldValueData[FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION];
  if (has(fieldValueData, FIELD_LIST_KEYS.SHOW_TABLE_VALIDATION_MODAL)) delete fieldValueData[FIELD_LIST_KEYS.SHOW_TABLE_VALIDATION_MODAL];

  if (checkAllFieldsAreReadOnly(fieldValueData.fields) && !isEmpty(fieldValueData.fields)) {
    fieldValueData[FIELD_LIST_KEYS.TABLE_VALIDATIONS].add_new_row = false;
    fieldValueData[FIELD_LIST_KEYS.TABLE_VALIDATIONS].allow_modify_existing = false;
  }

  if (fieldValueData.table_validations &&
      !fieldValueData?.table_validations?.is_unique_column_available) {
    delete fieldValueData.table_validations.unique_column_uuid;
  }

  if (reOrder) {
    fieldValueData.row_order = editedFieldListIndex + 1;
  }

  return fieldValueData;
};

export const getSaveFormAPIData = (
  state = {},
  editedSectionIndex,
  editedFieldListIndex,
  editedFieldIndex,
  getSaveFormMetadata,
  skipIsEdited = false,
  reOrder = false,
  isFinalSubmission = false,
) => {
  let formPostData = {};
  console.log('filescheck getSaveFormAPIData');
  if (!isEmpty(state?.form_title)) formPostData.form_title = state.form_title;
  if (!isEmpty(state.form_description)) formPostData.form_decsription = state.form_decsription;
  if (!isEmpty(state.form_details)) {
    if (state.form_details._id) formPostData._id = state.form_details._id;
    if (state.form_details.form_uuid) formPostData.form_uuid = state.form_details.form_uuid;
  }
  formPostData = { ...formPostData, ...getSaveFormMetadata() };
  formPostData.sections = cloneDeep(state.sections) || [];
  console.log('filescheck formPostData', formPostData);

  // preparing sections data
  formPostData.sections.forEach((section, sectionIndex) => {
    if (reOrder) {
      formPostData.sections[sectionIndex].section_order = sectionIndex + 1;
    }
    section.field_list.forEach((fieldList, fieldListIndex) => {
      delete formPostData.sections[sectionIndex].field_list[fieldListIndex]
        .isFieldListConfigPopupOpen;
      if (!Object.prototype.hasOwnProperty.call(fieldList, 'is_field_list_show_when_rule')) {
        console.log('filescheck is_field_list_show_when_rule check');
        fieldList.is_field_list_show_when_rule = false;
      }
      if (fieldList.field_list_type === FIELD_LIST_TYPE.TABLE) {
        if (has(fieldList, FIELD_KEYS.RULE_EXPRESSION)) delete fieldList[FIELD_KEYS.RULE_EXPRESSION];
        if (has(fieldList, FIELD_KEYS.PREVIOUS_RULE_EXPRESSION)) delete fieldList[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION];
        if (has(fieldList, FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION)) delete fieldList[FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION];
        if (has(fieldList, FIELD_LIST_KEYS.SHOW_TABLE_VALIDATION_MODAL)) delete fieldList[FIELD_LIST_KEYS.SHOW_TABLE_VALIDATION_MODAL];

        if (checkAllFieldsAreReadOnly(fieldList.fields) && !isEmpty(fieldList.fields)) {
          fieldList[FIELD_LIST_KEYS.TABLE_VALIDATIONS].add_new_row = false;
          fieldList[FIELD_LIST_KEYS.TABLE_VALIDATIONS].allow_modify_existing = false;
        }
      }
      if (fieldList.field_list_type === 'table' && fieldList.table_validations &&
        !fieldList.table_validations.is_unique_column_available) {
        delete fieldList.table_validations.unique_column_uuid;
      }
      if (
        !formPostData.sections[sectionIndex].field_list[fieldListIndex][
        FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE
        ]
      ) {
        delete formPostData.sections[sectionIndex].field_list[fieldListIndex][
          FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE
        ];
      }
      if (reOrder) {
        formPostData.sections[sectionIndex].field_list[
          fieldListIndex
        ].row_order = fieldListIndex + 1;
      }
      fieldList.fields.forEach((field, fieldIndex) => {
        if (fieldList.field_list_type !== FIELD_LIST_TYPE.TABLE) {
          delete formPostData.sections[sectionIndex].field_list[fieldListIndex][
            FIELD_LIST_KEYS.IS_VISIBLE
          ];
        }
        let fields =
          formPostData.sections[sectionIndex].field_list[fieldListIndex].fields[
          fieldIndex
          ];
        if (has(fields, 'is_imported')) delete fields.is_imported;
        if (has(field, 'is_imported')) delete field.is_imported;
        if (has(fields, 'form_count')) delete fields.form_count;
        if (has(field, 'form_count')) delete field.form_count;

        if (!skipIsEdited) {
          if (
            sectionIndex === editedSectionIndex &&
            fieldListIndex === editedFieldListIndex &&
            fieldIndex === editedFieldIndex
          ) {
            fields.is_edited = true;
          } else {
            fields.is_edited = false;
          }
        }

        if (reOrder) {
          const order = getFieldOrderKeyBasedOnFieldListType(
            fieldList.field_list_type,
          );
          fields[order] = fieldIndex + 1;
        }

        // changes to be made common
        fields = getSaveFormAndFieldData(fields, state);
        if (
          formPostData.sections[sectionIndex].field_list[fieldListIndex]
            .field_list_type === FIELD_LIST_TYPE.TABLE
        ) {
          formPostData.sections[sectionIndex].field_list[
            fieldListIndex
          ].table_name = section.field_list[fieldListIndex].table_name.trim();
        }

        if (!isEmpty(state.form_details)) {
          if (!fields.is_field_default_value_rule) {
            delete fields.field_default_value_rule;
          }
          if (
            fields.is_field_default_value_rule &&
            !fields.field_default_value_rule
          ) {
            fields.is_field_default_value_rule = false;
          }
          if (!fields.is_field_show_when_rule) {
            delete fields.field_show_when_rule;
          }
          if (fields.is_field_show_when_rule && !fields.field_show_when_rule) {
            fields.is_field_show_when_rule = false;
          }
        }

        return field;
      });
    });
    if (!Object.prototype.hasOwnProperty.call(section, 'is_section_show_when_rule')) {
      console.log('filescheck is_section_show_when_rule check');
      section.is_section_show_when_rule = false;
    }
    console.log('saveFormPOstData returned', section, state);
    return section;
  });
  console.log('filescheck formPostData before filtering', formPostData);
  // filterting empty sections
  let areEmptySectionsRemoved = false;
  let filteredSections = [];
  if (isFinalSubmission) {
    filteredSections = formPostData.sections.filter((eachSection) => {
      if (isEmpty(eachSection.field_list)) {
        areEmptySectionsRemoved = true;
        return false;
      }
      const filteredFields = eachSection.field_list.filter((eachFieldList) => {
        if (eachFieldList.field_list_type === TABLE_FIELD_LIST_TYPE) return true;
        if (isEmpty(eachFieldList.fields)) return false;
        return true;
      });
      if (isEmpty(filteredFields)) {
        areEmptySectionsRemoved = true;
        return false;
      }
      return true;
    });
  } else {
    filteredSections = formPostData.sections.filter((eachSection) => !!eachSection.section_name);
    if ((filteredSections || []).length < (formPostData.sections || []).length) areEmptySectionsRemoved = true;
  }

  // re-ordering filtered section order numbers
  if (areEmptySectionsRemoved) {
    formPostData.sections = filteredSections.map(
      (eachSection, eachSectionIndex) => {
        return {
          ...eachSection,
          section_order: eachSectionIndex + 1,
        };
      },
    );
  } else formPostData.sections = filteredSections;
  console.log('filescheck ffinal', formPostData);
  return formPostData;
};

export const getFormDetailsValidateData = (state, inputSection, outputId) => {
  const { form_title = EMPTY_STRING, form_description = EMPTY_STRING } = state;
  const sections = cloneDeep(inputSection) || cloneDeep(state.sections);
  const _sections = sections.map((section) => {
    const newSection = section;
    newSection.field_list = section.field_list.map((eachFieldList) => {
      const newFieldList = { ...eachFieldList };
      delete newFieldList.isFieldListConfigPopupOpen;
      delete newFieldList[FIELD_KEYS.RULE_EXPRESSION];
      (
        has(newFieldList, [FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION], false) &&
        delete newFieldList[FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION]
      );
      delete newFieldList[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION];
      if (newFieldList.field_list_type === 'table' && newFieldList.table_validations &&
        !newFieldList.table_validations.is_unique_column_available) {
        delete newFieldList.table_validations.unique_column_uuid;
      }
      newFieldList.fields = eachFieldList.fields.map((field) => {
        let newField = { ...field };
        delete newField.value_metadata;
        // if (isUndefined(newFieldList.fields[0].[FIELD_KEYS.IS_VISIBLE]) && newFieldList.fields[0].[FIELD_KEYS.IS_SHOW_WHEN_RULE]) {
        //   newFieldList.fields[0].[FIELD_KEYS.IS_VISIBLE] = true;
        //   console.log('newFIeld set', newFieldList.fields[0], isUndefined(newFieldList.fields[0].[FIELD_KEYS.IS_VISIBLE]), newFieldList.fields[0].[FIELD_KEYS.IS_SHOW_WHEN_RULE])
        // }
        if (field.field_type === FIELD_TYPE.USER_TEAM_PICKER) {
          newField = {
            ...field,
            validations: getUserTeamPickerValidationData(
              cloneDeep(field.validations),
            ),
          };
          console.log('userpicker validation returnedd', newField);
        } else if (field.field_type === FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN) {
          field.validations = {};
          console.log(
            'errr value_metadata 21 ',
            field,
            isUndefined(field.value_metadata),
          );
          const { lookUpList } = store.getState().LookUpReducer;
          field.value_metadata = isUndefined(field.value_metadata)
            ? getLookupId(lookUpList, field.selected_lookup_field)
            : field.value_metadata;
          delete field?.value_metadata?.custom_lookup_name;
          console.log('errr value_metadata 2 ', field, field.value_metadata);
          newField = { ...field };
        } else if (field.field_type === FIELD_TYPE.DATA_LIST) {
          if (Object.keys(field.validations).includes('is_datalist_filter')) {
            if (!field.validations.is_datalist_filter) field.validations.filter_fields = [];
            delete field.validations.is_datalist_filter;
          }
        }
        delete newField.isConfigPopupOpen;
        return newField;
      });
      return newFieldList;
    });
    return newSection;
  });
  return {
    [outputId.FORM_TITLE.ID]: form_title,
    [outputId.FORM_DESCRIPTION.ID]: form_description,
    [outputId.SECTIONS]: _sections,
  };
};

export const saveFormApiResponseProcess = (
  _sections = [],
  sectionIndex,
  fieldListIndex,
  fieldIndex,
  response,
  isConfigPopupOpen,
  isSaveField,
  t,
) => {
  // const emptySectionBeforeEditedSection =
  //   getEmptySectionsBeforeEditedSectionIndex(_sections, sectionIndex);
  const sections = [..._sections];
  const editedField = get(sections, [
    sectionIndex,
    'field_list',
    fieldListIndex,
    'fields',
    fieldIndex,
  ], null);
  const editedFieldList = get(sections, [
    sectionIndex,
    'field_list',
    fieldListIndex,
  ], null);
  const editedSectionId = sectionIndex; // - emptySectionBeforeEditedSection;
  if (sections && sections[editedSectionId]) {
    sections[editedSectionId].section_uuid = get(response, [
      'sections',
      editedSectionId,
      'section_uuid',
    ]);
  } else if (sections && sections.length > 0) {
    // for all initial sections
    sections.forEach((_, index) => {
      sections[index].section_uuid = get(response, [
        'sections',
        index,
        'section_uuid',
      ]);
      return null;
    });
  } else {
    // do nothing
  }

  if (isSaveField) {
    if (editedField[FIELD_KEYS.IS_DEFAULT_VALUE_RULE]) {
      editedField[FIELD_KEYS.DEFAULT_VALUE_RULE] = get(response, [
        'sections',
        editedSectionId,
        'field_list',
        fieldListIndex,
        'fields',
        fieldIndex,
        FIELD_KEYS.DEFAULT_VALUE_RULE,
      ]);
    }
    if (editedField[FIELD_KEYS.IS_SHOW_WHEN_RULE]) {
      editedField[FIELD_KEYS.FIELD_SHOW_WHEN_RULE] = get(response, [
        'sections',
        editedSectionId,
        'field_list',
        fieldListIndex,
        'fields',
        fieldIndex,
        FIELD_KEYS.FIELD_SHOW_WHEN_RULE,
      ]);
    }
  }

  if (
    editedFieldList &&
    editedFieldList.field_list_type === TABLE_FIELD_LIST_TYPE
  ) {
    editedFieldList.table_uuid = get(response, [
      'sections',
      editedSectionId,
      'field_list',
      fieldListIndex,
      'table_uuid',
    ]);
    editedFieldList.table_reference_name = get(response, [
      'sections',
      editedSectionId,
      'field_list',
      fieldListIndex,
      'table_reference_name']);
      if (get(response, [
        'sections',
        editedSectionId,
        'field_list',
        fieldListIndex,
        'field_list_show_when_rule'], EMPTY_STRING)) {
        editedFieldList.field_list_show_when_rule = get(response, [
          'sections',
          editedSectionId,
          'field_list',
          fieldListIndex,
          'field_list_show_when_rule']);
      }
    editedFieldList[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION] =
      editedFieldList[FIELD_KEYS.RULE_EXPRESSION];
    editedFieldList.isFieldListConfigPopupOpen = editedField
      ? false
      : isConfigPopupOpen || false;

    const { TABLE: { VALIDATION_CONFIG } } = FIELD_LIST_CONFIG(t);

    const all_fields = get(response, [
      'sections',
      editedSectionId,
      'field_list',
      fieldListIndex,
      'fields',
    ], []);
    const currentField = all_fields[fieldIndex] || {};
    const currentFieldBeforeSave = get(sections, [
      editedSectionId,
      'field_list',
      fieldListIndex,
      'fields',
      fieldIndex,
    ], {});

    if (!isEmpty(all_fields) && checkAllFieldsAreReadOnly(all_fields)) {
      editedFieldList[FIELD_LIST_KEYS.TABLE_VALIDATIONS][VALIDATION_CONFIG.ALLOW_ADDING_NEW_ROW.ID] = false;
      editedFieldList[FIELD_LIST_KEYS.TABLE_VALIDATIONS][VALIDATION_CONFIG.ALLOW_EDITING_EXISTING_ROW.ID] = false;
    }

    if (!isEmpty(currentField) && !(currentField?.read_only)) {
      let isAllFieldReadOnly = false;
      if (all_fields.length === 1) {
        isAllFieldReadOnly = (
          currentFieldBeforeSave[FIELD_KEYS.READ_ONLY] === false &&
          currentFieldBeforeSave[FIELD_KEYS.READ_ONLY_PREVIOUS_STATE] === true
        );
      } else {
        isAllFieldReadOnly = checkAllFieldsAreReadOnlyExcludingCurrentField(
          all_fields,
          currentField.field_uuid,
        );
      }

      if (isAllFieldReadOnly) {
        editedFieldList[FIELD_LIST_KEYS.SHOW_TABLE_VALIDATION_MODAL] = true;
        editedFieldList[FIELD_LIST_KEYS.TABLE_VALIDATIONS][VALIDATION_CONFIG.ALLOW_ADDING_NEW_ROW.ID] = true;
        editedFieldList[FIELD_LIST_KEYS.TABLE_VALIDATIONS][VALIDATION_CONFIG.ALLOW_EDITING_EXISTING_ROW.ID] = true;
      }
    }
  }
  if (editedField) {
    editedField.isConfigPopupOpen = isConfigPopupOpen || false;
    editedField[FIELD_KEYS.PREVIOUS_DRAFT_DRAFT_RULE] =
      editedField[FIELD_KEYS.DEFAULT_DRAFT_VALUE];
    editedField[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION] =
      editedField[FIELD_KEYS.RULE_EXPRESSION];
    editedField.field_id = get(response, [
      'sections',
      editedSectionId,
      'field_list',
      fieldListIndex,
      'fields',
      fieldIndex,
      'field_id',
    ]);
    editedField.field_uuid = get(response, [
      'sections',
      editedSectionId,
      'field_list',
      fieldListIndex,
      'fields',
      fieldIndex,
      'field_uuid',
    ]);
    editedField.reference_name = get(response, [
      'sections',
      editedSectionId,
      'field_list',
      fieldListIndex,
      'fields',
      fieldIndex,
      'reference_name']);
    editedField.is_label_edited = false;
    // editedField.is_scratch = false;
    if (editedFieldList.field_list_type === TABLE_FIELD_LIST_TYPE) {
      editedFieldList.table_uuid = get(response, [
        'sections',
        editedSectionId,
        'field_list',
        fieldListIndex,
        'table_uuid',
      ]);
      editedFieldList.table_reference_name = get(response, [
        'sections',
        editedSectionId,
        'field_list',
        fieldListIndex,
        'table_reference_name']);
      editedFieldList.is_table_label_edited = false;
    }
  }
  return sections;
};
const getErrorMessage = (errorType, label) => {
  if (errorType.includes('unique')) return `${label} is already exists`;
  return '';
};

export const constructFieldListConfigErrorList = (
  errorList,
  serverErrorList,
  requiredKeys,
  sectionIndex,
  fieldListIndex,
) => {
  const constructedErrorList = {};
  const constructedServerErrorList = {};
  if (!isEmpty(errorList)) {
    Object.keys(errorList).forEach((eachErrorId) => {
      if (
        requiredKeys.some((eachRequiredKey) =>
          eachErrorId.includes(eachRequiredKey.id))
      ) {
        const errorIdTokens = eachErrorId.split(',');
        if (
          sectionIndex === Number(errorIdTokens[1]) &&
          Number(errorIdTokens[3]) === fieldListIndex
        ) {
          constructedErrorList[errorIdTokens[4]] = errorList[eachErrorId];
        }
      }
    });
  }
  if (!isEmpty(serverErrorList) && isArray(serverErrorList)) {
    serverErrorList.forEach((eachError) => {
      const keyIndex = requiredKeys.findIndex((eachRequiredKey) =>
        (eachError.field || []).includes(eachRequiredKey.id));
      if (keyIndex >= 0) {
        const errorIdTokens = eachError.field.split('.');
        if (
          sectionIndex === Number(errorIdTokens[1]) &&
          Number(errorIdTokens[3]) === fieldListIndex
        ) {
          constructedServerErrorList[errorIdTokens[4]] = getErrorMessage(
            eachError.type,
            requiredKeys[keyIndex].label,
          );
        }
      }
    });
  }
  return mergeObjects(constructedErrorList, constructedServerErrorList);
};

// DND handlers
const isSectionMoveUpOrDownPossible = (
  sectionIndex,
  allSectionsLength,
  type,
) => {
  if (allSectionsLength > 0 && allSectionsLength !== 1) {
    if (sectionIndex > 0 && type === 0) return true;
    if (sectionIndex < allSectionsLength - 1 && type === 1) return true;
  }
  return false;
};

export const getMoveUpOrDownHandledSectionList = (
  sections = [],
  sectionIndex,
  type,
) => {
  let sections_ = [...sections];

  // type 0 -> Move Up, type 1 -> Move down

  if (
    nullCheck(sectionIndex) &&
    nullCheck(type) &&
    isSectionMoveUpOrDownPossible(sectionIndex, sections.length, type)
  ) {
    const swapOrder = type === 0 ? sectionIndex - 1 : sectionIndex + 1;

    // swapping sections
    [sections_[sectionIndex], sections_[swapOrder]] = [
      sections_[swapOrder],
      sections_[sectionIndex],
    ];

    // reordering sections
    sections_ = sections_.map((eachSection, eachSectionIndex) => {
      return {
        ...eachSection,
        section_order: eachSectionIndex + 1,
      };
    });
  }

  return sections_;
};

export const getDragHandledFieldList = (sections = [], event, sectionIndex) => {
  const modifiedFieldRows = [];
  let allFieldList = [...sections[sectionIndex].field_list];
  if (
    nullCheck(event, 'source.index') &&
    nullCheck(event, 'destination.index') &&
    nullCheck(sectionIndex) &&
    event.source.index !== event.destination.index
  ) {
    const {
      source: { index: sIndex },
      destination: { index: dIndex },
    } = event;

    // swapping fieldlist
    const [reorderedItem] = allFieldList.splice(sIndex, 1);
    allFieldList.splice(dIndex, 0, reorderedItem);
    console.log('fields111', allFieldList);
    // reordering field list
    allFieldList = allFieldList.map((eachField, fieldIndex) => {
      if (eachField.row_order !== fieldIndex + 1) {
        modifiedFieldRows.push(eachField.row_order);
      }
      console.log('eachField', eachField);
      return { ...eachField, row_order: fieldIndex + 1 };
    });
    console.log('fields222', allFieldList);
  }
  return { updatedFieldList: allFieldList, modifiedFieldRows };
};

export const getColumnDragHandledFieldList = (
  section = [],
  event,
  sectionIndex,
  fieldListIndex,
) => {
  let allFieldLists = [...section[sectionIndex].field_list];
  if (
    event &&
    nullCheck(section) &&
    nullCheck(sectionIndex) &&
    nullCheck(fieldListIndex)
  ) {
    let allFields = [...allFieldLists[fieldListIndex].fields];

    if (
      nullCheck(event, 'source.index') &&
      nullCheck(event, 'destination.index') &&
      event.source.index !== event.destination.index
    ) {
      const {
        source: { index: sIndex },
        destination: { index: dIndex },
      } = event;

      const [reorderedItem] = allFields.splice(sIndex, 1);
      allFields.splice(dIndex, 0, reorderedItem);

      allFields = allFields.map((field, fieldIndex) => {
        return {
          ...field,
          column_order: fieldIndex + 1,
        };
      });

      allFieldLists = allFieldLists.map((fieldList, index) => {
        if (index === fieldListIndex) {
          fieldList = {
            ...fieldList,
            fields: [...allFields],
          };
        }

        return fieldList;
      });
      // return { updatedFieldList: allFieldLists };
    }
  }
  return { updatedFieldList: allFieldLists };
};

export const getCrossDragHandledFieldList = (sections = [], sectionIndex, event) => {
  let allFieldLists = [...sections[sectionIndex].field_list];
  if (nullCheck(event) &&
    nullCheck(event, 'sFieldListIndex') &&
    nullCheck(event, 'sFieldIndex') &&
    nullCheck(event, 'dFieldListIndex') &&
    nullCheck(event, 'dFieldIndex')) {
    const { sFieldListIndex, sFieldIndex, dFieldListIndex, dFieldIndex } =
      event;

    let sFieldList = { ...allFieldLists[sFieldListIndex] };
    let dFieldList = { ...allFieldLists[dFieldListIndex] };

    if (
      // dFieldList.fields.length < 2 &&
      sFieldList.fields.length >= sFieldIndex &&
      dFieldList.fields.length >= dFieldIndex
    ) {
      let sFields = [...sFieldList.fields];
      let dFields = [...dFieldList.fields];

      const [sField] = sFields.splice(sFieldIndex, 1);

      if (dFields[dFieldIndex] && sField) {
        const [dField] = dFields.splice(dFieldIndex, 1);
        sFields.splice(sFieldIndex, 0, dField);
        dFields.splice(dFieldIndex, 0, sField);
      } else dFields.splice(dFieldIndex, 0, sField);

      if (sFields) {
        sFields = sFields.map(
          (field, index) => { return { ...field, column_order: index + 1 }; },
        );
      }

      dFields = dFields.map(
        (field, index) => { return { ...field, column_order: index + 1 }; },
      );

      sFieldList = { ...sFieldList, fields: sFields };
      dFieldList = { ...dFieldList, fields: dFields };

      let subtractIndex = 0;
      let currentFieldList = null;
      allFieldLists = allFieldLists
        .map((fieldList, index) => {
          currentFieldList = fieldList;
          if (index === sFieldListIndex) {
            if (sFieldList.fields.length > 0) currentFieldList = sFieldList;
            else {
              subtractIndex++;
              return null;
            }
          } else if (index === dFieldListIndex) currentFieldList = dFieldList;

          return { ...currentFieldList, row_order: index - subtractIndex + 1 };
        })
        .filter((fieldlist) => fieldlist !== null);
    }
  }
  return { updatedFieldList: allFieldLists };
};

export const getNewFieldListDragHandler = (sections = [], sectionIndex, event) => {
  // event={source:{index:1,0},destination:{index:3}}
  let allFieldList = [...sections[sectionIndex].field_list];
  if (event && nullCheck(event, 'source.index') && nullCheck(event, 'destination.index')) {
    let { destination: { index: dFieldListIndex } } = event;
    const { source: { index: sIndex } } = event;

    const [sFieldListIndex, sFieldIndex] = sIndex.split(',').map(Number);

    let newFieldList = { ...allFieldList[sFieldListIndex], fields: [] };
    let sourceFieldList = { ...allFieldList[sFieldListIndex] };

    let sourceFields = [...allFieldList[sFieldListIndex].fields];
    let destinationFields = [];

    if (sFieldListIndex < dFieldListIndex && sourceFields.length === 1 && dFieldListIndex !== 0) dFieldListIndex--;

    const [sField] = sourceFields.splice(sFieldIndex, 1);
    destinationFields.splice(0, 0, sField);

    if (sourceFields) sourceFields = sourceFields.map((field, index) => { return { ...field, column_order: index + 1 }; });

    destinationFields = destinationFields.map((field, index) => { return { ...field, column_order: index + 1 }; });

    newFieldList = { ...newFieldList, fields: destinationFields };
    sourceFieldList = { ...sourceFieldList, fields: sourceFields };

    allFieldList.splice(sFieldListIndex, 1);

    if (!isEmpty(sourceFields)) allFieldList.splice(sFieldListIndex, 0, sourceFieldList);

    allFieldList.splice(dFieldListIndex, 0, newFieldList);

    allFieldList = allFieldList.map((fieldList, index) => { return { ...fieldList, row_order: index + 1 }; });
  }
  return { updatedFieldList: allFieldList };
};

export const getFormFieldDragHandledFieldList = (sections = [], sectionIndex, event) => {
  let allFieldLists = [...sections[sectionIndex].field_list];
  let isupdated = false;
  if (nullCheck(event, 'source.index') &&
    nullCheck(event, 'destination.index') &&
    nullCheck(sectionIndex) &&
    event.source.index !== event.destination.index) {
    const {
      source: { index: sIndex },
      destination: { index: dIndex },
    } = event;
    if (String(sIndex).includes(',') && String(dIndex).includes(',')) {
      const [sFieldListIndex, sFieldIndex] = sIndex.split(',').map(Number);
      const [dFieldListIndex, dFieldIndex] = dIndex.split(',').map(Number);

      if (
        sFieldListIndex === dFieldListIndex &&
        sFieldIndex !== dFieldIndex
      ) {
        allFieldLists = getColumnDragHandledFieldList(
          sections,
          {
            source: { index: sFieldIndex },
            destination: { index: dFieldIndex },
          },
          sectionIndex,
          sFieldListIndex,
        );
      } else {
        allFieldLists = getCrossDragHandledFieldList(
          sections,
          sectionIndex,
          { sFieldListIndex, sFieldIndex, dFieldListIndex, dFieldIndex },
        );
      }
    } else if (nullCheck(event, 'isFromTable') && nullCheck(event, 'fieldIndex')) {
      allFieldLists = getColumnDragHandledFieldList(sections, event, sectionIndex, event.fieldIndex);
    } else if (String(sIndex).includes(',') && !String(dIndex).includes(',')) {
      allFieldLists = getNewFieldListDragHandler(sections, sectionIndex, event);
    } else if (!String(sIndex).includes(',') && String(dIndex).includes(',')) {
      return { updatedFieldList: allFieldLists };
    } else {
      const fieldListEvent = {
        source: { index: sIndex },
        destination: { index: (sIndex < dIndex) ? dIndex - 1 : dIndex },
      };
      allFieldLists = getDragHandledFieldList(sections, fieldListEvent, sectionIndex);
    }
    isupdated = true;
  }

  return isupdated ? allFieldLists : { updatedFieldList: allFieldLists };
};

// import form handlers

export const isFieldListSelected = (fieldList) =>
  fieldList.fields.every((eachField) => eachField.isSelected === true);

export const selectFieldListAndGetUpdatedFieldList = (
  sections = [],
  sectionIndex,
  fieldListIndex,
) => {
  const isSelected = !isFieldListSelected(
    sections[sectionIndex].field_list[fieldListIndex],
  );
  const isImported = !isFieldListSelected(
    sections[sectionIndex].field_list[fieldListIndex],
  );
  return {
    ...sections[sectionIndex].field_list[fieldListIndex],
    fields: sections[sectionIndex].field_list[fieldListIndex].fields.map(
      (eachField) => {
        if (eachField.isDisabled) {
          return eachField;
        }
        return {
          ...eachField,
          isSelected,
          is_imported: isImported,
        };
      },
    ),
  };
};

export const selectFieldAndGetUpdatedFieldData = (
  sections = [],
  sectionIndex,
  fieldListIndex,
  fieldIndex,
) => {
  return {
    ...sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex],
    isSelected:
      !sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex]
        .isSelected,
    is_imported: !sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex]
      .isSelected,
  };
};

export const setAccessibilityAndGetUpdatedFieldData = (
  value,
  sections = [],
  sectionIndex,
  fieldListIndex,
  fieldIndex,
) => {
  const field =
    sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex];
  const read_only = (Object.values(READ_ONLY_FIELD_TYPE).includes(field.field_type)) ? true : !field.read_only;
  return {
    ...field,
    read_only: read_only,
    required: !field.read_only ? false : field.required,
  };
};

export const areAllSectionFieldListSelected = (
  section = { field_list: [] },
  skipDisabledFields = false,
) =>
  section.field_list.every((eachFieldList = { fields: [] }) =>
    eachFieldList.fields.every((eachField = { isSelected: false }) => {
      if (skipDisabledFields && eachField.isDisabled) return true;
      return eachField.isSelected === true;
    }));

export const areAllFormSectionsSelected = (
  sections = [],
  skipDisabledFields = false,
) =>
  sections.every((eachSection) =>
    areAllSectionFieldListSelected(eachSection, skipDisabledFields));

export const areAllSectionFieldListEditable = (
  section = { field_list: [] },
  skipDisabledFields = false,
) =>
  section.field_list.every((eachFieldList = { fields: [] }) =>
    eachFieldList.fields.every((eachField = { read_only: false }) => {
      if (
        (skipDisabledFields && eachField.isDisabled) ||
        (Object.values(READ_ONLY_FIELD_TYPE).includes(eachField.field_type))
      ) return true;
      return eachField.read_only === false;
    }));

export const areAllFormSectionsEditable = (
  sections = [],
  skipDisabledFields = false,
) =>
  sections.every((eachSection) =>
    areAllSectionFieldListEditable(eachSection, skipDisabledFields));

export const areAllSectionFieldListReadOnly = (
  section = { field_list: [] },
  skipDisabledFields = false,
) =>
  section.field_list.every((eachFieldList = { fields: [] }) =>
    eachFieldList.fields.every((eachField = { read_only: false }) => {
      if (skipDisabledFields && eachField.isDisabled) return true;
      return eachField.read_only === true;
    }));

export const areAllFormSectionsReadOnly = (
  sections = [],
  skipDisabledFields = false,
) =>
  sections.every((eachSection) =>
    areAllSectionFieldListReadOnly(eachSection, skipDisabledFields));

export const selectFormAndGetUpdatedSectionsData = (
  sections = [],
  extraAction,
) => {
  const isAllFormFieldsSelected = areAllFormSectionsSelected(sections, true);
  const isAllFormFieldsEditable = areAllFormSectionsEditable(sections, true);
  const isAllFormFieldsReadonly = areAllFormSectionsReadOnly(sections, true);

  let isSelected = !isAllFormFieldsSelected;
  let isImported = !isAllFormFieldsSelected;
  if (
    (isAllFormFieldsSelected &&
      extraAction === FIELD_ACCESSIBILITY_TYPES.READ_ONLY &&
      isAllFormFieldsEditable) ||
    (isAllFormFieldsSelected &&
      extraAction === FIELD_ACCESSIBILITY_TYPES.EDITABLE &&
      isAllFormFieldsReadonly)
  ) {
    isSelected = true;
    isImported = true;
  }
  return sections.map((eachSection) => {
    return {
      ...eachSection,
      field_list: eachSection.field_list.map((eachFieldList) => {
        return {
          ...eachFieldList,
          fields: eachFieldList.fields.map((eachField) => {
            if (eachField.isDisabled) {
              return eachField;
            }
            return {
              ...eachField,
              isSelected,
              is_imported: isImported,
              read_only: (Object.values(READ_ONLY_FIELD_TYPE).includes(eachField.field_type))
                ? true
                : isSelected ? (extraAction === FIELD_ACCESSIBILITY_TYPES.READ_ONLY) : eachField.read_only_from_server,
            };
          }),
        };
      }),
    };
  });
};

export const setFormAccessibilityAndGetUpdatedSectionsData = (
  value,
  sections = [],
) => {
  const isReadOnly = value === FIELD_ACCESSIBILITY_TYPES.READ_ONLY;
  return sections.map((eachSection) => {
    return {
      ...eachSection,
      field_list: eachSection.field_list.map((eachFieldList) => {
        return {
          ...eachFieldList,
          fields: eachFieldList.fields.map((eachField) => {
            return {
              ...eachField,
              read_only: isReadOnly,
              required: isReadOnly ? false : eachField.required,
            };
          }),
        };
      }),
    };
  });
};

export const areAllFieldListFieldsDisabled = (eachFieldList = { fields: [] }) =>
  eachFieldList.fields.every(
    (eachField = { isDisabled: false }) => eachField.isDisabled === true,
  );

export const areAllSectionFieldListDisabled = (section = { field_list: [] }) =>
  section.field_list.every((eachFieldList = { fields: [] }) =>
    eachFieldList.fields.every(
      (eachField = { isDisabled: false }) => eachField.isDisabled === true,
    ));

export const areAllFormSectionsDisabled = (sections = []) =>
  sections.every((eachSection) => areAllSectionFieldListDisabled(eachSection));

const groupExistingFieldListAndImportedFieldListData = (
  existingFieldList = [],
  importedFieldList = [],
) => {
  const updatedExistingFieldList = [...existingFieldList];
  const updatedImportedFieldList = [...importedFieldList];
  importedFieldList.forEach(
    (eachImportedFieldList, eachImportedFieldListIndex) => {
      if (eachImportedFieldList.field_list_type === FIELD_LIST_TYPE.TABLE) {
        const existingFieldListIndex = existingFieldList.findIndex(
          (eachExistingFieldList) =>
            eachExistingFieldList.table_uuid ===
            eachImportedFieldList.table_uuid,
        );
        if (existingFieldListIndex >= 0) {
          updatedExistingFieldList[existingFieldListIndex].fields = [
            ...updatedExistingFieldList[existingFieldListIndex].fields,
            ...eachImportedFieldList.fields,
          ];
          updatedImportedFieldList[eachImportedFieldListIndex] = null;
        }
      }
    },
  );
  return [...updatedExistingFieldList, ...compact(updatedImportedFieldList)];
};

export const groupExistingAndImportedSectionsData = (
  existingSections = [],
  importedSections = [],
  sectionIndex = null,
) => {
  const updatedExistingSections = cloneDeep([...existingSections]);
  let updatedImportedSections = cloneDeep([...importedSections]);
  importedSections.forEach((eachImportedSection, eachImportedSectionIndex) => {
    let existingSectionIndex;
    if (!isNil(sectionIndex) && existingSections.length > 0) {
      existingSectionIndex = sectionIndex;
    } else {
      existingSectionIndex = existingSections.findIndex(
        (eachExistingSection) =>
          eachExistingSection.section_uuid === eachImportedSection.section_uuid,
      );
    }
    if (!isEmpty(eachImportedSection.field_list)) {
      eachImportedSection.field_list = eachImportedSection.field_list.filter(
        (eachFieldList) => {
          if (eachFieldList.field_list_type === FIELD_LIST_TYPE.TABLE) {
            let tableFound = false;
            updatedExistingSections.forEach((eachExistingSection) => {
              eachExistingSection.field_list.forEach(
                (eachExistingFieldList) => {
                  if (
                    eachExistingFieldList.field_list_type ===
                    FIELD_LIST_TYPE.TABLE &&
                    eachExistingFieldList.table_uuid ===
                    eachFieldList.table_uuid
                  ) {
                    eachExistingFieldList.fields = [
                      ...eachExistingFieldList.fields,
                      ...eachFieldList.fields,
                    ];
                    tableFound = true;
                  }
                },
              );
            });
            return !tableFound;
          }
          return true;
        },
      );
    }
    if (existingSectionIndex >= 0) {
      updatedExistingSections[existingSectionIndex].field_list =
        groupExistingFieldListAndImportedFieldListData(
          updatedExistingSections[existingSectionIndex].field_list,
          eachImportedSection.field_list,
        );
      updatedImportedSections[eachImportedSectionIndex] = null;
    }
  });
  const updatedSectionsWithId = cloneDeep(updatedImportedSections);
  updatedImportedSections = updatedImportedSections.map((eachSection) => {
    if (has(eachSection, ['section_uuid'], false)) delete eachSection.section_uuid;
    return eachSection;
  });
  return {
    groupedPostSections: [...updatedExistingSections, ...compact(updatedImportedSections)],
    grouped_sections_with_id: [...updatedExistingSections, ...compact(updatedSectionsWithId)],
  };
};

export const selectSectionAndGetUpdatedSection = (
  sections = [],
  sectionIndex,
) => {
  const isSelected = !areAllSectionFieldListSelected(sections[sectionIndex], true);
  const isImported = !areAllSectionFieldListSelected(sections[sectionIndex], true);
  const section = {
    ...sections[sectionIndex],
    field_list: sections[sectionIndex].field_list.map((eachFieldList) => {
      return {
        ...eachFieldList,
        fields: eachFieldList.fields.map((eachField) => {
          if (eachField.isDisabled) {
            return eachField;
          }
          return {
            ...eachField,
            isSelected,
            is_imported: isImported,
          };
        }),
      };
    }),
  };
  return section;
};

export const getVisibilityRuleData = (draftVisibilityData) => {
  console.log('draftVisibilityData', draftVisibilityData);
  const options = get(draftVisibilityData, [
    'selected_operator_info',
    'options',
  ]);
  console.log('draftVisibilityData 2', draftVisibilityData, options);
  const data = {
    r_value: get(draftVisibilityData, [VISIBILITY_CONFIG_FIELDS.R_VALUE]),
    l_field: get(draftVisibilityData, [
      VISIBILITY_CONFIG_FIELDS.SELECTED_L_FIELD_INFO,
      'field_uuid',
    ]),
    [VISIBILITY_CONFIG_FIELDS.SELECTED_OPERATOR_INFO]: get(
      draftVisibilityData,
      VISIBILITY_CONFIG_FIELDS.SELECTED_OPERATOR_INFO,
    ),
    // [VISIBILITY_CONFIG_FIELDS.]: get(draftVisibilityData, VISIBILITY_CONFIG_FIELDS.SELECTED_OPERATOR_INFO),
  };
  if (!isEmpty(options)) {
    data.options = options;
  }
  return data;
};

export const saveFormRule = async (metadata, field, saveRule, isSaveField) => {
  const saveRules = [];

  if (field && field.is_field_default_value_rule) {
    if (
      (field.field_default_value_rule && field.draft_default_rule) ||
      !field.field_default_value_rule
    ) {
      const { draft_default_rule } = field;
      unset(draft_default_rule, ['errors']);
      const { validation_error: error } = checkForDefaultValueValidation(field);
      if (isEmpty(error)) {
        const ruleData = getDefaultRuleFieldSaveData(
          field.draft_default_rule,
          { ...metadata, field_uuid: field.field_uuid },
          field[FIELD_KEYS.DEFAULT_VALUE_RULE],
          field[FIELD_KEYS.IS_ADVANCED_EXPRESSION],
        );
        if (!isSaveField) {
          saveRules.push(saveRule(ruleData, FIELD_KEYS.DEFAULT_VALUE_RULE));
        }
      } else if (error) {
        return { success: false, error, defaultValue: true };
      }
    }
  }
  if (field && field.is_field_show_when_rule) {
    if (
      (field.field_show_when_rule && field[FIELD_KEYS.RULE_EXPRESSION]) ||
      !field.field_show_when_rule
    ) {
      if (get(field, [FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION], false)) {
        const expression_error = { query_builder: 'has validation' };
        return { success: false, expression_error, visibilityField: true };
      }
      const visibilityApiData = getVisibilityRuleApiData(
        { ...metadata, field_uuid: field.field_uuid },
        field[FIELD_KEYS.FIELD_SHOW_WHEN_RULE],
        'rule_field_show_when_condition',
        field[FIELD_KEYS.RULE_EXPRESSION],
      );
      if (!isSaveField) {
        saveRules.push(
          saveRule(visibilityApiData, FIELD_KEYS.FIELD_SHOW_WHEN_RULE),
        );
      }
    }
  }
  if (field && field[FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE]) {
    if (
      (field[FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE] && field[FIELD_KEYS.RULE_EXPRESSION]) ||
      !field[FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE]
    ) {
      if (get(field, [FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION], false)) {
        const expression_error = { query_builder: 'has validation' };
        return { success: false, expression_error, visibilityField: true };
      }
      const visibilityApiData = getVisibilityRuleApiData(
        { ...metadata, table_uuid: field.table_uuid },
        field[FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE],
        'rule_field_list_show_when_condition',
        field[FIELD_KEYS.RULE_EXPRESSION],
      );
      if (!isSaveField) {
        saveRules.push(
          saveRule(
            visibilityApiData,
            FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE,
          ),
        );
      }
    }
  }
  if (isSaveField) {
    const response = [];
    return { success: true, response };
  }
  const response = await Promise.all(saveRules);
  return { success: true, response };
};

export const fieldExistCheckByIdInAllSections = (sections = [], fieldId) =>
  sections.some((eachSection) =>
    eachSection.field_list.some((eachFieldList) =>
      eachFieldList.fields.some((eachField) => eachField.field_id === fieldId)));

// import form utils
export const getImportedSectionsData = (_sections) => {
  // getting selected and re-ordered sections data
  const importedSections = [];
  const sections = cloneDeep(_sections);
  sections.forEach((eachSection) => {
    const fieldList = [];
    eachSection.field_list.forEach((eachFieldList) => {
      const fields = [];
      eachFieldList.fields.forEach((eachField) => {
        const fieldOrder = getFieldOrderKeyBasedOnFieldListType(
          eachFieldList.field_list_type,
        );
        if (eachField.isSelected) {
          if (has(eachField, [FIELD_KEYS.HIDE_FIELD_IF_NULL])) delete eachField.hide_field_if_null;
          if (has(eachField, [FIELD_KEYS.READ_ONLY_FROM_SERVER])) delete eachField[FIELD_KEYS.READ_ONLY_FROM_SERVER];
          if (has(eachField, [FIELD_KEYS.DEFAULT_VALUE]) && eachField.field_type !== 'information') delete eachField.default_value;
          fields.push({
            ...eachField,
            [fieldOrder]: fields.length + 1,
            is_edited: true,
          });
        }
      });
      if (fields.length > 0) {
        fieldList.push({
          ...eachFieldList,
          row_order: fieldList.length + 1,
          fields,
        });
      }
    });
    if (fieldList.length > 0) {
      importedSections.push({
        ...eachSection,
        section_order: importedSections.length + 1,
        field_list: fieldList,
      });
    }
  });
  return importedSections;
};

export const getOrganizedSectionsDataForImportForm = (sections = []) => {
  if (nullCheck(sections, 'length', true)) {
    const updatedSections = sections.map((eachSection) => {
      const sectionData = { ...eachSection };
      // removing section rules
      delete sectionData.section_show_when_rule;
      sectionData.is_section_show_when_rule = false;
      return {
        ...sectionData,
        field_list: eachSection.field_list.map((eachFieldList) => {
          const fieldListData = { ...eachFieldList };
          // removing fieldlist rules
          delete fieldListData.field_list_show_when_rule;
          fieldListData.is_field_list_show_when_rule = false;
          return {
            ...fieldListData,
            fields: eachFieldList.fields.map((eachField) => {
              const fieldData = { ...eachField };

              // joining array of strings into a string
              if (
                !isEmpty(eachField.values) &&
                (eachField.field_type === FIELD_TYPE.DROPDOWN ||
                  eachField.field_type === FIELD_TYPE.RADIO_GROUP ||
                  eachField.field_type === FIELD_TYPE.CHECKBOX)
              ) {
                fieldData.values = Array.isArray(fieldData.values)
                  ? fieldData.values.join()
                  : fieldData.values;
              }

              // removing field rules
              delete fieldData.field_show_when_rule;
              fieldData.is_field_show_when_rule = false;

              // removing field default value rules
              delete fieldData.field_default_value_rule;
              fieldData.is_field_default_value_rule = false;

              // setting user team picker validation data
              // if (eachField.field_type === FIELD_TYPE.USER_TEAM_PICKER) {
              //   fieldData.validations = { ...eachField.validations };
              //   if (eachField.validations.is_restricted) {
              //     fieldData.validations.restricted_user_team = getValidationTabUserTeamPickerSelectedData(eachField.validations.restricted_user_team);
              //   }
              // }

              return fieldData;
            }),
          };
        }),
      };
    });
    return updatedSections;
  }
  return sections;
};

export const compareExistingSectionsAndGetImportSectionsData = (
  sections = [],
  existingSections = [],
) => {
  if (nullCheck(sections, 'length', true)) {
    const updatedSections = sections.map((eachSection) => {
      return {
        ...eachSection,
        field_list: eachSection.field_list.map((eachFieldList) => {
          return {
            ...eachFieldList,
            fields: eachFieldList.fields.map((eachField) => {
              console.log('is Set here ', eachField);
              if (eachField.field_type === FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN) {
                eachField.selected_lookup_field =
                  eachField.value_metadata.custom_lookup_name;
                delete eachField.value_metadata.custom_lookup_name;
                console.log('LOOKUP FLOW', eachField);
                const isDisabled = fieldExistCheckByIdInAllSections(
                  existingSections,
                  eachField.field_id,
                );
                return {
                  ...eachField,
                  isDisabled,
                  [FIELD_KEYS.READ_ONLY_FROM_SERVER]: eachField.read_only,
                };
              }
              const isDisabled = fieldExistCheckByIdInAllSections(
                existingSections,
                eachField.field_id,
              );
              return {
                ...eachField,
                isDisabled,
                [FIELD_KEYS.READ_ONLY_FROM_SERVER]: eachField.read_only,
              };
            }),
          };
        }),
      };
    });
    return getOrganizedSectionsDataForImportForm(updatedSections);
  }
  return sections;
};

// delete form field or field list utils
export const deleteFieldOrFieldListAndGetReOrderedSectionsData = (
  deleteFieldOrFieldList = FIELD_OR_FIELD_LIST.FIELD,
  sections = [],
  sectionIndex,
  fieldListIndex,
  fieldIndex = null,
  t,
) => {
  const reorderedSections = [];
  sections.forEach((eachSection, eachSectionIndex) => {
    const fieldList = [];
    eachSection.field_list.forEach((eachFieldList, eachFieldListIndex) => {
      if (
        !(
          sectionIndex === eachSectionIndex &&
          fieldListIndex === eachFieldListIndex &&
          deleteFieldOrFieldList === FIELD_OR_FIELD_LIST.FIELD_LIST
        )
      ) {
        const fields = [];
        eachFieldList.fields.forEach((eachField, eachFieldIndex) => {
          if (
            !(
              sectionIndex === eachSectionIndex &&
              fieldListIndex === eachFieldListIndex &&
              fieldIndex === eachFieldIndex
            )
          ) fields.push({ ...eachField, column_order: fields.length + 1 });
        });

        if (
          eachFieldList.field_list_type === FIELD_LIST_TYPE.TABLE ||
          fields.length > 0
        ) {
          const field_list_data = cloneDeep(eachFieldList);
          if (
            eachFieldList.field_list_type === FIELD_LIST_TYPE.TABLE &&
            sectionIndex === eachSectionIndex &&
            fieldListIndex === eachFieldListIndex
          ) {
            const current_field = get(field_list_data, ['fields', fieldIndex], {});
            if (
              !isEmpty(current_field) &&
              checkAllFieldsAreReadOnlyExcludingCurrentField(
                field_list_data.fields || [],
                current_field.field_uuid,
              )
            ) {
              set(field_list_data, [
                FIELD_LIST_KEYS.TABLE_VALIDATIONS,
                FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.ALLOW_ADDING_NEW_ROW.ID,
              ], false);
              set(field_list_data, [
                FIELD_LIST_KEYS.TABLE_VALIDATIONS,
                FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.ALLOW_EDITING_EXISTING_ROW.ID,
              ], false);
            }
          }
          fieldList.push({
            ...field_list_data,
            row_order: fieldList.length + 1,
            fields,
          });
        }
        console.log('eachFieldListeachFieldList 1', eachFieldList);
      }
    });
    reorderedSections.push({
      ...eachSection,
      section_order: reorderedSections.length + 1,
      field_list: fieldList,
    });
  });
  return reorderedSections;
};

export const getFieldDependencyApiData = (
  formDetailsServerData,
  sectionIndex,
  fieldListIndex,
  fieldIndex = null,
) => {
  return {
   ...(isNull(fieldIndex)) ?
   {
    table_uuid: get(
      formDetailsServerData,
      `sections.${sectionIndex}.field_list.${fieldListIndex}.table_uuid`,
    ),
   } :
   {
    _id: [
      get(
        formDetailsServerData,
        `sections.${sectionIndex}.field_list.${fieldListIndex}.fields.${fieldIndex}.field_id`,
      ),
    ],
  },
    form_id: get(formDetailsServerData, '_id'),
  };
};

export const getSectionDependencyData = (formDetails, sectionIndex) => {
  const { sections } = formDetails;
  if (sections && sections[sectionIndex]) {
    const fieldIds = [];
    sections[sectionIndex]?.field_list.forEach((eachFieldList) => {
      eachFieldList?.fields.forEach((eachField) =>
        fieldIds.push(eachField.field_id));
    });
    return {
      _id: fieldIds,
      form_id: get(formDetails, '_id'),
    };
  }
  return null;
};
export const getFieldDependencyDetails = (
  sections = [],
  sectionIndex,
  fieldListIndex,
  fieldIndex,
) => {
  return {
    type: 'Field',
    name: get(
      sections[sectionIndex],
      `field_list.${fieldListIndex}.fields.${fieldIndex}.reference_name`,
    ),
    sectionIndex,
    fieldListIndex,
    fieldIndex,
  };
};

export const getFieldListDependencyDetails = (
  sections = [],
  sectionIndex,
  fieldListIndex,
) => {
  return {
    type: 'Field',
    name: get(
      sections[sectionIndex],
      `field_list.${fieldListIndex}.table_reference_name`,
    ),
    sectionIndex,
    fieldListIndex,
  };
};

export const getSectionDependencyDetails = (sections = [], sectionIndex) => {
  return {
    type: 'Section',
    name: get(sections[sectionIndex], 'section_name'),
    sectionIndex,
  };
};

export const getDependencyConfigData = (formParentModuleType, state) => {
  if (
    formParentModuleType === FORM_PARENT_MODULE_TYPES.TASK ||
    formParentModuleType === FORM_PARENT_MODULE_TYPES.DATA_LIST
  ) {
    return pick(state, [
      'dependency_data',
      'showFieldDependencyDialog',
      'showSectionDependencyDialog',
      'showFormDependencyDialog',
      'dependency_type',
      'dependency_name',
    ]);
  }
  if (formParentModuleType === FORM_PARENT_MODULE_TYPES.FLOW) {
    return pick(state, [
      'dependency_data',
      'showFieldDependencyDialog',
      'showSectionDependencyDialog',
      'showStepDependencyDialog',
      'showFormDependencyDialog',
      'showLinkDependencyDialog',
      'showFlowDependencyDialog',
      'dependency_type',
      'dependency_name',
    ]);
  }
  return {};
};

export const setValuesForField = (
  sections = [],
  sectionIndex,
  fieldListIndex,
  fieldIndex,
  value,
) => {
  const currentStateField =
    sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex];
  currentStateField.values = value;
  if (!isEmpty(currentStateField.default_value)) {
    if (!currentStateField.values.includes(currentStateField.default_value)) {
      delete currentStateField.default_value;
    }
  }
  return currentStateField;
};

export const getSectionTitleError = (error_list, details, sectionIndex) => {
  let sectionError = '';
  if (!isEmpty(error_list)) {
    Object.keys(error_list).some((id) => {
      if (id.includes('section_name')) {
        const idArray = id.split(',');
        if (parseInt(idArray[1], 10) === sectionIndex) {
          sectionError = error_list[id];
          return true;
        }
      }
      return false;
    });
  }
  return sectionError;
};

// steps dnd

export const getDragHandledSteps = (steps = [], event) => {
  const updatedStepDetails = [];
  let updatedSteps = [...steps];
  if (
    nullCheck(event, 'source.index') &&
    nullCheck(event, 'destination.index') &&
    event.source.index !== event.destination.index
  ) {
    const {
      source: { index: sIndex },
      destination: { index: dIndex },
    } = event;

    // swapping steps
    const [reorderedItem] = updatedSteps.splice(sIndex, 1);
    updatedSteps.splice(dIndex, 0, reorderedItem);
    // reordering steps
    updatedSteps = updatedSteps.map((eachStep, stepIndex) => {
      if (eachStep.step_order !== stepIndex + 1) {
        updatedStepDetails.push({
          step_id: eachStep._id,
          step_order: stepIndex + 1,
        });
      }
      return { ...eachStep, step_order: stepIndex + 1 };
    });
  }
  return { updatedSteps, updatedStepDetails };
};

export const basicConfigErrorExist = (
  error_list,
  sectionIndex,
  fieldListIndex,
  fieldIndex,
) =>
  Object.keys(error_list).some((id) => {
    console.log(id);
    if (id.includes('default_value')) {
      const idArray = id.split(',');
      console.log(
        'idarray,section id,field id',
        idArray,
        sectionIndex,
        fieldIndex,
      );
      if (
        parseInt(idArray[1], 10) === sectionIndex &&
        parseInt(idArray[3], 10) === fieldListIndex &&
        parseInt(idArray[5], 10) === fieldIndex
      ) {
        return true;
      }
    }
    if (id.includes('field_name')) {
      console.log('there is an id with field_name');
      const idArray = id.split(',');
      console.log(
        'idarray,section id,field id',
        idArray,
        sectionIndex,
        fieldIndex,
      );
      if (
        parseInt(idArray[1], 10) === sectionIndex &&
        parseInt(idArray[3], 10) === fieldListIndex &&
        parseInt(idArray[5], 10) === fieldIndex
      ) {
        return true;
      }
    }
    if (id.includes('data_list')) {
      console.log('data list is required');
      const idArray = id.split(',');
      console.log(
        'idarray,section id,field id',
        idArray,
        sectionIndex,
        fieldIndex,
      );
      if (
        parseInt(idArray[1], 10) === sectionIndex &&
        parseInt(idArray[3], 10) === fieldListIndex &&
        parseInt(idArray[5], 10) === fieldIndex
      ) {
        return true;
      }
    }
    if (id.includes('reference_name')) {
      const idArray = id.split(',');
      if (
        parseInt(idArray[1], 10) === sectionIndex &&
        parseInt(idArray[3], 10) === fieldListIndex &&
        parseInt(idArray[5], 10) === fieldIndex
      ) {
        return true;
      } else if (id === 'reference_name') return true;
    }
    if (id.includes('values')) {
      console.log('there is an id with field_name');
      const idArray = id.split(',');
      console.log(
        'idarray,section id,field id',
        idArray,
        sectionIndex,
        fieldIndex,
      );
      if (
        parseInt(idArray[1], 10) === sectionIndex &&
        parseInt(idArray[3], 10) === fieldListIndex &&
        parseInt(idArray[5], 10) === fieldIndex
      ) return true;
    }
    return false;
  });

// user team picker field utils

export const userTeamPickerChangeHandler = (
  existingUserPickerObj,
  value,
  type = USER_TEAM_PICKER_CHANGE_HANDLER_TYPES.USER_TEAM_PICKER_CH_ADD,
) => {
  const updatedObj = {
    users: [...get(existingUserPickerObj, 'users', [])],
    teams: [...get(existingUserPickerObj, 'teams', [])],
  };
  if (type === USER_TEAM_PICKER_CHANGE_HANDLER_TYPES.USER_TEAM_PICKER_CH_ADD) {
    if (has(value, 'email')) {
      if (!updatedObj.users.some((eachUser) => eachUser._id === value._id)) updatedObj.users.push(value);
    } else if (has(value, 'team_name')) {
      if (!updatedObj.teams.some((eachTeam) => eachTeam._id === value._id)) updatedObj.teams.push(value);
    }
  } else if (
    type === USER_TEAM_PICKER_CHANGE_HANDLER_TYPES.USER_TEAM_PICKER_CH_REMOVE
  ) {
    let isDeleteCompleted = false;
    updatedObj.users = updatedObj.users.filter((eachUser) => {
      isDeleteCompleted = false;
      const isNotEqual = eachUser._id !== value;
      if (!isNotEqual) isDeleteCompleted = true;
      return isNotEqual;
    });
    if (!isDeleteCompleted) {
      updatedObj.teams = updatedObj.teams.filter(
        (eachTeam) => eachTeam._id !== value,
      );
    }
  }
  if (isEmpty(updatedObj.teams)) delete updatedObj.teams;
  if (isEmpty(updatedObj.users)) delete updatedObj.users;
  return updatedObj;
};

export const getValidationTabUserTeamPickerSelectedData = (selectedData) => {
  if (!isEmpty(selectedData)) {
    if (Array.isArray(selectedData)) return selectedData;
    if (typeof selectedData === 'object') {
      return [
        ...selectedData.users ? get(selectedData, 'users', []) : [],
        ...selectedData.teams ? get(selectedData, 'teams', []) : [],
      ];
    }
  }
  return [];
};

// metrics dnd
export const getDragHandledMetrics = (metrics = [], event) => {
  const updatedMetrics = [...metrics];
  if (
    nullCheck(event, 'source.index') &&
    nullCheck(event, 'destination.index') &&
    event.source.index !== event.destination.index
  ) {
    const {
      source: { index: sIndex },
      destination: { index: dIndex },
    } = event;

    // swapping metrics
    const [reorderedItem] = updatedMetrics.splice(sIndex, 1);
    updatedMetrics.splice(dIndex, 0, reorderedItem);
  }
  return updatedMetrics;
};

// form style utils
export const getTableFieldStyle = (fieldType, formType, isTableHead) => {
  let minWidth = '';
  let maxWidth = '';
  switch (fieldType) {
    case FIELD_TYPE.SINGLE_LINE:
    case FIELD_TYPE.NUMBER:
      minWidth = '180px';
      maxWidth = '230px';
      break;
    case FIELD_TYPE.DATE:
      minWidth = '185px';
      maxWidth = '185px';
      break;
    case FIELD_TYPE.PARAGRAPH:
      if (formType === FORM_TYPES.CREATION_FORM) {
        minWidth = '180px';
        maxWidth = '230px';
      } else {
        minWidth = '270px';
        maxWidth = '320px';
      }
      break;
    case FIELD_TYPE.FILE_UPLOAD:
      if (formType === FORM_TYPES.CREATION_FORM) {
        minWidth = '225px';
        maxWidth = '275px';
      } else {
        minWidth = '300px';
        maxWidth = '350px';
      }
      break;
    case FIELD_TYPE.USER_TEAM_PICKER:
      if (formType === FORM_TYPES.CREATION_FORM) {
        minWidth = '195px';
        maxWidth = '245px';
      } else {
        minWidth = '270px';
        maxWidth = '320px';
      }
      break;
    case FIELD_TYPE.DROPDOWN:
    case FIELD_TYPE.CURRENCY:
      minWidth = '150px';
      maxWidth = '200px';
      break;
    case FIELD_TYPE.CHECKBOX:
    case FIELD_TYPE.RADIO_GROUP:
    case FIELD_TYPE.YES_NO:
      minWidth = '200px';
      maxWidth = '230px';
      break;
    case FIELD_TYPE.LINK:
      if (formType === FORM_TYPES.CREATION_FORM) {
        minWidth = '180px';
        maxWidth = '230px';
      } else {
        minWidth = '270px';
        maxWidth = '320px';
      }
      break;
    case FIELD_TYPE.INFORMATION:
      minWidth = '200px';
      maxWidth = '230px';
      break;
    case FIELD_TYPE.DATETIME:
      minWidth = '310px';
      maxWidth = '310px';
      break;
    default:
      minWidth = '180px';
      maxWidth = '230px';
      break;
  }

  if (isTableHead) return { maxWidth };
  if (fieldType === FIELD_TYPE.CHECKBOX || fieldType === FIELD_TYPE.RADIO_GROUP) return { minWidth, maxWidth };
  return { maxWidth, minWidth };
};

export const getHolidays = (formattedHolidayList) => {
  const holidays = [];
  if (!isEmpty(formattedHolidayList)) {
    formattedHolidayList.map((data) => {
      if (!isEmpty(data.holidays)) holidays.push(...data.holidays);
      return null;
    });
  }
  return holidays;
};

export const getHolidaysToUpdateMoment = (year) => new Promise((resolve) => {
  const { holiday_list } = store.getState().HolidayListReducer;
  const activeYear = year || Number(YEAR_DROPDOWN[0].value);
  if (moment(activeYear).isValid()) {
    if (!isEmpty(holiday_list)) {
      const index = holiday_list.findIndex((data) => (data.year === activeYear));
      if (index > -1) {
        if (!isEmpty(holiday_list[index].holidays) || holiday_list[index].isApiCalled) {
          const holidays = getHolidays(holiday_list);
          return resolve(holidays);
        }
      }
    }
    store.dispatch(getHolidayListDataThunk(activeYear))
      .then((formattedHolidayList) => {
        const holidays = getHolidays(formattedHolidayList, activeYear);
        return resolve(holidays);
      });
  }
  return resolve([]);
});

export const getFormattedWokingDaysArray = (workingDaysArray) => {
  const workingWeekDays = [];
  if (!isEmpty(workingDaysArray)) {
    workingDaysArray.map((day) => {
      if (day === 7) {
        workingWeekDays.push(0);
      } else {
        workingWeekDays.push(day);
      }
      return null;
    });
  }
  return workingWeekDays;
};

export const getDateRangeValue = (validations = {}, isEnableTime, formData = {}, formFields = [], t) => {
  const { allow_today, allow_working_day, date_selection } = validations;
  const userProfileData = getUserProfileData();
  let dateValidation = {};
  if (!isEmpty(date_selection)) {
    dateValidation = { ...date_selection[0] };
  }
  const data = {};
  const noOfDays = allow_today ? 0 : 1;
  let dateWithTimezone;
  if (userProfileData.pref_timezone) {
    dateWithTimezone = moment.utc().tz(userProfileData.pref_timezone).format(DATE.DATE_FORMAT);
  } else {
    dateWithTimezone = moment.utc().format(DATE.DATE_FORMAT);
  }

  const isFuture = dateValidation.type === FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE.VALUE;
  const isPast = dateValidation.type === FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST.VALUE;
  const isFixed = dateValidation.type === FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.VALUE;
  const format = isEnableTime ? 'YYYY-MM-DDTHH:mm:ss' : DATE.DATE_FORMAT;
  if (dateValidation.sub_type) {
    switch (dateValidation.sub_type) {
      case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_ALL.VALUE:
        data.minDateString = addDaysToDate(dateWithTimezone, noOfDays, allow_working_day);
        data.minDate = new Date(data.minDateString);
        break;
      case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.VALUE:
        data.minDateString = addDaysToDate(dateWithTimezone, noOfDays, allow_working_day);
        data.minDate = new Date(data.minDateString);
        data.maxDateString = addDaysToDate(dateWithTimezone, dateValidation.start_day, allow_working_day);
        data.maxDate = new Date(data.maxDateString);
        break;
      case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.VALUE:
        if (isFuture) {
          data.minDateString = addDaysToDate(dateWithTimezone, dateValidation.start_day + noOfDays, allow_working_day);
          data.minDate = new Date(data.minDateString);
        } else if (isFixed) {
          dateWithTimezone = moment(dateValidation.start_date).utcOffset(dateValidation.start_date).format(format);
          if (isEnableTime) {
            data.minDateString = moment.utc(dateWithTimezone).format(format);
            data.minDate = new Date(data.minDateString);
          } else {
            data.minDateString = addDaysToDate(dateWithTimezone, 0, allow_working_day);
            data.minDate = new Date(data.minDateString);
          }
        }
        break;
      case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.VALUE:
        if (isFuture) {
          data.minDateString = addDaysToDate(dateWithTimezone, dateValidation.start_day, allow_working_day);
          data.minDate = new Date(data.minDateString);
          data.maxDateString = addDaysToDate(dateWithTimezone, dateValidation.end_day, allow_working_day);
          data.maxDate = new Date(data.maxDateString);
        } else if (isPast) {
          data.minDateString = subtractDaysFromDate(dateWithTimezone, dateValidation.end_day, allow_working_day);
          data.minDate = new Date(data.minDateString);
          data.maxDateString = subtractDaysFromDate(dateWithTimezone, dateValidation.start_day, allow_working_day);
          data.maxDate = new Date(data.maxDateString);
        } else if (isFixed) {
          dateWithTimezone = moment(dateValidation.start_date).utcOffset(dateValidation.start_date).format(format);
          data.minDateString = moment.utc(dateWithTimezone).format(format);
          data.minDate = new Date(data.minDateString);
          dateWithTimezone = moment(dateValidation.end_date).utcOffset(dateValidation.end_date).format(format);
          data.maxDateString = moment.utc(dateWithTimezone).format(format);
          data.maxDate = new Date(data.maxDateString);
        }
        break;
      case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_ALL.VALUE:
        data.maxDateString = subtractDaysFromDate(dateWithTimezone, noOfDays, allow_working_day);
        data.maxDate = new Date(data.maxDateString);
        break;
      case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.VALUE:
        data.minDateString = subtractDaysFromDate(dateWithTimezone, dateValidation.start_day, allow_working_day);
        data.minDate = new Date(data.minDateString);
        data.maxDateString = subtractDaysFromDate(dateWithTimezone, noOfDays, allow_working_day);
        data.maxDate = new Date(data.maxDateString);
        break;
      case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.VALUE:
        if (isPast) {
          data.maxDateString = subtractDaysFromDate(dateWithTimezone, dateValidation.start_day + noOfDays, allow_working_day);
          data.maxDate = new Date(data.maxDateString);
        } else if (isFixed) {
          dateWithTimezone = moment(dateValidation.end_date).utcOffset(dateValidation.end_date).format(format);
          if (isEnableTime) {
            data.maxDateString = moment.utc(dateWithTimezone).format(format);
            data.maxDate = new Date(data.maxDateString);
          } else {
            data.maxDateString = subtractDaysFromDate(dateWithTimezone, 0, allow_working_day);
            data.maxDate = new Date(data.maxDateString);
          }
        }
        break;
      default:
        break;
    }
  }
  if (dateValidation.type === FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_ONLY_TODAY.VALUE) {
    data.includeDates = [new Date(dateWithTimezone)];
  }
  if (dateValidation.type === FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_DATE_FIELDS.VALUE) {
    if (formData && formFields) {
      let firstFieldDateString;
      let secondFieldDateString;
      const firstFieldIndex = formFields.findIndex((formField) => (formField.field_uuid === dateValidation.first_field_uuid) || (formField?.[RESPONSE_FIELD_KEYS.FIELD_UUID] === dateValidation.first_field_uuid));
      if (firstFieldIndex > -1) {
        data.firstFieldData = {
          fieldName: formFields[firstFieldIndex].field_name || formFields[firstFieldIndex]?.[RESPONSE_FIELD_KEYS.FIELD_NAME],
          fieldRefName: formFields[firstFieldIndex].reference_name || formFields[firstFieldIndex]?.[RESPONSE_FIELD_KEYS.REFERENCE_NAME],
          fieldUuid: formFields[firstFieldIndex].field_uuid || formFields[firstFieldIndex]?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
          isDateTimeField: (formFields[firstFieldIndex].field_type === FIELD_TYPE.DATETIME) || (formFields[firstFieldIndex]?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.DATETIME),
        };
      }
      data.firstFieldValue = formData[dateValidation.first_field_uuid] ? formData[dateValidation.first_field_uuid] : null;
      if (data.firstFieldValue && moment(data.firstFieldValue, ['YYYY-MM-DD', moment.ISO_8601], true).isValid()) {
        firstFieldDateString = moment.utc(data.firstFieldValue).format(format);
      }
      if (dateValidation.operator === DATE_FIELDS_OPERATOR_VALUES.BETWEEN) { //
        data.secondFieldValue = formData[dateValidation.second_field_uuid] ? formData[dateValidation.second_field_uuid] : null;
        if (data.secondFieldValue && moment(data.secondFieldValue, ['YYYY-MM-DD', moment.ISO_8601], true).isValid()) {
          secondFieldDateString = moment.utc(data.secondFieldValue).format(format);
        }
        const secondFieldIndex = formFields.findIndex((formField) => (formField.field_uuid === dateValidation.second_field_uuid) || (formField?.[RESPONSE_FIELD_KEYS.FIELD_UUID] === dateValidation.second_field_uuid));
        if (secondFieldIndex > -1) {
          data.secondFieldData = {
            fieldName: formFields[secondFieldIndex].field_name || formFields[secondFieldIndex]?.[RESPONSE_FIELD_KEYS.FIELD_NAME],
            fieldRefName: formFields[secondFieldIndex].reference_name || formFields[secondFieldIndex]?.[RESPONSE_FIELD_KEYS.REFERENCE_NAME],
            fieldUuid: formFields[secondFieldIndex].field_uuid || formFields[secondFieldIndex]?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
            isDateTimeField: (formFields[secondFieldIndex].field_type === FIELD_TYPE.DATETIME) || (formFields[secondFieldIndex]?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPE.DATETIME),
          };
        }
      }
      if (firstFieldDateString || secondFieldDateString) {
        switch (dateValidation.operator) {
          case DATE_FIELDS_OPERATOR_VALUES.LESS_THAN:
            if (isEnableTime) {
              data.maxDateString = moment.utc(firstFieldDateString).format(format);
              data.maxDate = new Date(data.maxDateString);
            } else {
              data.maxDateString = subtractDaysFromDate(firstFieldDateString, noOfDays, allow_working_day);
              data.maxDate = new Date(data.maxDateString);
            }
            break;
          case DATE_FIELDS_OPERATOR_VALUES.LESS_THAN_OR_EQUAL_TO:
            if (isEnableTime) {
              data.maxDateString = moment.utc(firstFieldDateString).format(format);
              data.maxDate = new Date(data.maxDateString);
            } else {
              data.maxDateString = subtractDaysFromDate(firstFieldDateString, 0, allow_working_day);
              data.maxDate = new Date(data.maxDateString);
            }
            break;
          case DATE_FIELDS_OPERATOR_VALUES.GREATER_THAN:
            if (isEnableTime) {
              data.minDateString = moment.utc(firstFieldDateString).format(format);
              data.minDate = new Date(data.minDateString);
            } else {
              data.minDateString = addDaysToDate(firstFieldDateString, noOfDays, allow_working_day);
              data.minDate = new Date(data.minDateString);
            }
            break;
          case DATE_FIELDS_OPERATOR_VALUES.GREATER_THAN_OR_EQUAL_TO:
            if (isEnableTime) {
              data.minDateString = moment.utc(firstFieldDateString).format(format);
              data.minDate = new Date(data.minDateString);
            } else {
              data.minDateString = addDaysToDate(firstFieldDateString, 0, allow_working_day);
              data.minDate = new Date(data.minDateString);
            }
            break;
          case DATE_FIELDS_OPERATOR_VALUES.BETWEEN:
            if (isEnableTime) {
              data.minDateString = moment.utc(firstFieldDateString).format(format);
              data.minDate = new Date(data.minDateString);
              data.maxDateString = moment.utc(secondFieldDateString).format(format);
              data.maxDate = new Date(data.maxDateString);
            } else {
              data.minDateString = addDaysToDate(firstFieldDateString, 0, allow_working_day);
              data.minDate = new Date(data.minDateString);
              data.maxDateString = subtractDaysFromDate(secondFieldDateString, 0, allow_working_day);
              data.maxDate = new Date(data.maxDateString);
            }
            break;
          default:
            break;
        }
      }
    }
  }
  console.log('dateWithTimezone dateWithTimezone @#@$@$#SDFDGS ', data, dateValidation.sub_type);
  return data;
};
export const getDatePickerRange = async ({ readOnly, validations = {}, workingDaysArray, isEnableTime, t }) => {
  const { allow_working_day } = validations;
  if (readOnly) {
    return {};
  }
  if (allow_working_day) {
    const workingWeekDays = getFormattedWokingDaysArray(workingDaysArray);
    await getHolidaysToUpdateMoment()
      .then((holidays) => {
        moment.updateLocale('us', {
          holidays,
          workingWeekdays: cloneDeep(workingWeekDays),
          holidayFormat: DATE.DATE_FORMAT,
        });
        return getDateRangeValue(validations, isEnableTime, {}, [], t);
      });
  }
  return getDateRangeValue(validations, isEnableTime, {}, [], t);
};
export const getDatePickerRangeForCalender = ({ readOnly, validations = {}, isEnableTime }, t) => {
  if (readOnly) {
    return {};
  }
  return getDateRangeValue(validations, isEnableTime, {}, [], t);
};
export const getDatePickerFieldsRangeForValidations = ({ readOnly, validations = {}, workingDaysArray, isEnableTime, formData = {}, formFields = [] }, t = () => { }) => {
  const { allow_working_day } = validations;
  if (readOnly) {
    return {};
  }
  if (allow_working_day) {
    const workingWeekDays = getFormattedWokingDaysArray(workingDaysArray);
    const { holiday_list } = store.getState().HolidayListReducer;
    const holidays = getHolidays(holiday_list);
    moment.updateLocale('us', {
      holidays,
      workingWeekdays: cloneDeep(workingWeekDays),
      holidayFormat: DATE.DATE_FORMAT,
    });
  }
  return getDateRangeValue(validations, isEnableTime, formData, formFields, t);
};

export default addNewFormFieldAndGetUpdatedFieldList;

export const setTableCustomDragElement = (provided, snapshot, className, wrapperChildren, enableIsDragging) => (
  <td
    className={cx(gClasses.CursorMove, className)}
    ref={provided.innerRef}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
  >
    {enableIsDragging
      ? React.cloneElement(wrapperChildren, {
        isDragging: snapshot.isDragging,
      })
      : wrapperChildren}
  </td>
);
export const setTableCustomDropElement = (provided, className, wrapperChildren) => (
  <tr
    className={className}
    ref={provided.innerRef}
    {...provided.droppableProps}
  >
    {wrapperChildren}
    {provided.placeholder}
  </tr>
);
export const setFieldListCustomDragElement = (provided, snapshot, className, wrapperChildren, enableIsDragging) => (
  <div
    className={className}
    ref={provided.innerRef}
    {...provided.draggableProps}
  >
    {enableIsDragging
      ? React.cloneElement(wrapperChildren, {
        isDragging: snapshot.isDragging,
      })
      : wrapperChildren}
  </div>
);

export const setFieldListCustomDropElement = (provided, className, wrapperChildren) => (
  <div
    className={className}
    ref={provided.innerRef}
    {...provided.droppableProps}
  // style={snapshot.isDraggingOver?{backgroundColor:'#adb6c7',borderRadius:'6px'}:{}}
  >
    {wrapperChildren}
    {provided.placeholder}
  </div>
);

export const checkIsFieldNull = (stateData, uuid, hideFieldIfNull = false, field_type = null) => {
  if (!hideFieldIfNull) return false;

  const field = get(stateData, [uuid], null);
  let value = field;
  switch (field_type) {
    case FIELD_TYPE.CURRENCY:
      value = get(field, ['value'], null);
      break;
    case FIELD_TYPE.PHONE_NUMBER:
      value = get(field, ['phone_number'], null);
      break;
    default:
      value = field;
      break;
  }
  return (
    isArray(value) ||
    isObject(value) ||
    isString(value)
  ) ? isEmpty(value) : false || isUndefined(value) || isNull(value);
};

export const checkIsAllTableFieldsNull = (stateData = [], allField) => {
  if (stateData.length > 1) return false;
  const data = stateData[0];
  const readOnly = [];
  const value = [];
  allField.forEach((field) => {
    readOnly.push(field.read_only);
    value.push(checkIsFieldNull(data, field.field_uuid, field.hide_field_if_null, field.field_type));
  });
  const isTrue = (value) => value === true;
  return readOnly.every(isTrue) && value.every(isTrue);
};

export const getFieldBasedValidationSectionData = (sections) => {
  if (sections) {
    let dateFormFields = sections.flatMap((section) => {
      if (section.field_list) {
        return section.field_list.flatMap((fieldList) => {
          if (fieldList.fields) {
            return fieldList.fields.map((field) => {
              if (
                (field.field_type === FIELD_TYPE.DATE) ||
                (field.field_type === FIELD_TYPE.DATETIME)
              ) return field;
              return {};
            });
          }
          return {};
        });
      }
      return [];
    });
    dateFormFields = dateFormFields.filter((element) => element !== undefined);
    console.log(dateFormFields, ' getFieldBasedValidationSectionData');
    return dateFormFields;
  }
  return [];
};

export const getUpdatedFields = (newFields, existingFields) => {
  const fieldTypeToBeUpdated = [
    FIELD_TYPE.DROPDOWN,
    FIELD_TYPE.RADIO_GROUP,
    FIELD_TYPE.CHECKBOX,
    FIELD_TYPE.CUSTOM_LOOKUP_CHECKBOX,
    FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
    FIELD_TYPE.CUSTOM_LOOKUP_RADIOBUTTON,
  ];
  const cloneExistingField = cloneDeep(existingFields);
  const filteredFieldsToRefer = ((!isEmpty(newFields) && newFields) ? filter(newFields, (field) => (
    (PROPERTY_PICKER_ARRAY.includes(field.field_type)) &&
    fieldTypeToBeUpdated.includes(getFieldType(field))
  )) : []);

  let currentIndex = -1;
  filteredFieldsToRefer.forEach((eachField) => {
    if (!isEmpty(eachField) && eachField.field_uuid) {
      currentIndex = findIndex(cloneExistingField, { field_uuid: eachField.field_uuid });
      (currentIndex > -1) && (cloneExistingField[currentIndex] = eachField);
    }
    return eachField;
  });
  return cloneExistingField;
};

export const isSectionNameChanged = (sections, form_details) => {
  if (sections && form_details && form_details.sections) {
    return sections.some((eachSection, index) => {
      if (eachSection.section_name !== form_details.sections[index].section_name) {
        return true;
      }
      return false;
    });
  }
  return false;
};

export const formatValidationData = (fieldValue, fieldType) => {
  let value = fieldValue;
  switch (fieldType) {
    case FIELD_TYPE.LINK:
      if (isEmpty(value)) return [];
      value = value.map((eachLink) => {
        const link = {
          link_url: eachLink?.link_url,
          link_text: eachLink?.link_text,
        };
        if (link?.link_url) {
          link.link_url = link.link_url.trim();
          if (
            //  link.link_url.substring(0, 8) === LINK_FIELD_PROTOCOL.HTTPS ||
            //  link.link_url.substring(0, 7) === LINK_FIELD_PROTOCOL.HTTP
            link.link_url.includes(':/') || link.link_url.includes('://')
          ) {
            return link;
          } else {
            link.link_url = `${LINK_FIELD_PROTOCOL.HTTP}${link.link_url}`;
            return link;
          }
        }
        return link;
      });
      return value;
    case FIELD_TYPE.CHECKBOX:
      if (isArray(value)) {
        return value.filter((data) => data !== CHECKBOX_SELECT_ALL.VALUE);
      }
      return [];
    case FIELD_TYPE.PHONE_NUMBER:
      return {
        phone_number: has(value, 'phone_number') ? value.phone_number : null,
        country_code: has(value, 'country_code') ? value.country_code : null,
      };

    case FIELD_TYPE.FILE_UPLOAD:
      const fileUploadValidationObject = [];
      if (!isEmpty(value)) {
        value.forEach((eachFile) => {
          if (eachFile) {
            fileUploadValidationObject.push({
              type: getExtensionFromFileName(get(eachFile, ['file', 'name'], '')),
              size: get(eachFile, ['file', 'size'], ''),
            });
          }
        });
      }
      return fileUploadValidationObject;

    case FIELD_TYPE.NUMBER:
      if (Number.isNaN(value) || isEmpty(value)) return value;
      return parseFloat(value);

    case FIELD_TYPE.USER_TEAM_PICKER:
      return getSplittedUsersAndTeamsIdObjFromArray(value);

    case FIELD_TYPE.DATA_LIST:
      if (!isArray(value)) return [];
      else return value.map((dataListInstance) => get(dataListInstance, 'value'));

    default:
      return value;
  }
};

export const getEditableFormValidationData = (
  sections = [],
  all_visibility = {},
  active_form_data = {},
  module_type = EMPTY_STRING, // 'task' or 'data_list'
  is_save_task = false,
  is_validate_data = false,
) => {
  if ([MODULE_TYPES.TASK, MODULE_TYPES.DATA_LIST].includes(module_type)) {
    const finalValidateData = {};
    const { visible_sections = {}, visible_tables = {}, visible_fields = {}, visible_disable_fields = {} } = all_visibility;
    const module_based_condition = (module_type === MODULE_TYPES.TASK) ? !is_save_task : true;
    const formValidateData = sections.flatMap((section) => {
      if (visible_sections[section.section_uuid] && section.field_list) {
        return section.field_list.flatMap((eachFieldList) => {
          if (eachFieldList.fields) {
            let fieldValidateData = [];
            if (eachFieldList.field_list_type === FIELD_LIST_TYPE.TABLE) {
              if (visible_tables[eachFieldList.table_uuid]) {
                const tableDataArray = get(
                  active_form_data,
                  [eachFieldList.table_uuid],
                  [],
                )
                  .flatMap((tableRow, tableRowIndex) => {
                    let _isEmpty = true;
                    if ((
                      (!eachFieldList.table_validations.allow_modify_existing) && // If editing existing row is disabled, no need to validate it.
                      isEmpty(tableRow._id)) ||
                      (eachFieldList.table_validations.allow_modify_existing)) {
                      Object.keys(tableRow).forEach((key) => {
                        const fieldTypeIndex = eachFieldList.fields.findIndex(
                          (field) => field.field_uuid === key,
                        );
                        const isDisabled = get(visible_disable_fields, [eachFieldList.table_uuid, tableRowIndex, key], false);
                        const isVisibile = get(eachFieldList, ['fields', fieldTypeIndex, 'is_visible'], null);
                        const isFieldShowWhenRule = get(eachFieldList, ['fields', fieldTypeIndex, 'is_field_show_when_rule'], null);

                        const isFieldValidatable = !isFieldShowWhenRule || ((isVisibile && visible_fields[key]) || (!isVisibile && !isDisabled));

                        if (
                          fieldTypeIndex !== -1 &&
                          isFieldValidatable &&
                          tableRow[key] !== null &&
                          tableRow[key] !== EMPTY_STRING
                        ) {
                          if (!eachFieldList.fields[fieldTypeIndex].read_only) { // no need to validate Read only fields
                            _isEmpty = false;
                            const fieldType =
                              eachFieldList.fields[fieldTypeIndex].field_type;
                            const formattedData = formatValidationData(
                              tableRow[key],
                              fieldType,
                            );
                            if (fieldType === FIELD_TYPES.FILE_UPLOAD) {
                              if (
                                module_based_condition &&
                                (
                                  eachFieldList.fields[fieldTypeIndex].required ||
                                  !isEmpty(formattedData)
                                )
                              ) {
                                tableRow[key] = formattedData;
                              } else unset(tableRow, [key]);
                            } else {
                              tableRow[key] = formattedData;
                            }
                          } else {
                            unset(tableRow, [key]);
                          }
                        } else if (tableRow[key] === null || tableRow[key] !== EMPTY_STRING) {
                          unset(tableRow, [key]);
                        }

                        console.log('nfhfhgfjfhgffjhfjhfjhgf', cloneDeep(visible_disable_fields), isFieldValidatable);

                        if (is_validate_data && fieldTypeIndex !== -1 && (!isVisibile || visible_fields[key])) {
                          if (!isFieldValidatable) _isEmpty = false;
                          tableRow[`is_hidden_${key}`] = !isFieldValidatable;
                        }
                      });
                    }
                    return _isEmpty ? [{}] : tableRow;
                  });
                return [{ [eachFieldList.table_uuid]: tableDataArray }];
              }
            } else if (eachFieldList.fields) {
              fieldValidateData = [];
              eachFieldList.fields
                .filter((field) => (visible_fields[field.field_uuid] && !field.read_only))
                .forEach((field) => {
                  const formatedData = formatValidationData(
                    get(active_form_data, [field.field_uuid]),
                    field.field_type,
                  );
                  if (field.field_type === FIELD_TYPES.FILE_UPLOAD) {
                    if (
                      module_based_condition &&
                      (field.required || !isEmpty(formatedData))
                    ) fieldValidateData.push({ [field.field_uuid]: formatedData });
                  } else {
                    fieldValidateData.push({ [field.field_uuid]: formatedData });
                  }
                });
            }
            return fieldValidateData;
          }
          return [];
        });
      }
      return [];
    });

    formValidateData.forEach((fields) => {
      const key = Object.keys(fields);
      finalValidateData[key] = fields[key];
      return fields;
    });
    return finalValidateData;
  }
  return {};
};

export const getTableColConditionList = (expression, tableCol, field_metadata, nestedLevel = 1) => {
  (expression.operands?.conditions || []).forEach((condition, ruleIndex) => {
    const fieldData = field_metadata.find((field) => field.field_uuid === condition.l_field);
    if (fieldData?.field_list_type === FIELD_LIST_TYPE.TABLE) {
      tableCol.push({
        colId: condition.l_field,
        nestedLevel,
        ruleIndex,
      });
    }
  });
  nestedLevel++;
  (expression.operands?.expressions || []).forEach((nestedExpression) => {
    tableCol = getTableColConditionList(nestedExpression, tableCol, field_metadata, nestedLevel);
  });
  return tableCol;
};

export const setInitialFormVisibleFields = (rawResponseData) => {
  const clonedResponse = cloneDeep(rawResponseData);

  const { visible_fields = {}, visible_disable_fields = {} } = get(
    clonedResponse,
    ['form_metadata', 'fields', 'form_visibility'],
    {},
  );

  if (!isEmpty(visible_disable_fields)) {
    const visibleFields = { ...visible_fields };
    Object.keys(visible_disable_fields).forEach((table) => {
      if (isArray(visible_disable_fields[table])) {
        visible_disable_fields[table]?.forEach((fieldObj) => {
          Object.keys(fieldObj).forEach((field) => {
            if (!visibleFields[field]) {
              visibleFields[field] = true;
            }
          });
        });
      }
    });

    if (!isEmpty(visibleFields)) {
      set(
        clonedResponse,
        ['form_metadata', 'fields', 'form_visibility', 'visible_fields'],
        visibleFields,
      );
    }
  }

  return clonedResponse;
};
