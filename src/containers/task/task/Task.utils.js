import { ENTITY, ERROR_TEXT } from 'utils/strings/CommonStrings';
import { postTaskAssigneeSuggestion } from 'axios/apiService/taskAssigneeSuggestion.apiService';
import { postFieldTypeSuggestion } from 'axios/apiService/fieldTypeSuggestion.apiService';
// eslint-disable-next-line import/no-cycle
import { postFieldAutocomplete } from 'axios/apiService/fieldAutoComplete.apiService';
import { postFieldSuggestionApi } from 'axios/apiService/fieldSuggestion.apiService';
import { checkIfRValueNeeded } from 'containers/edit_flow/EditFlow.validation.schema';
import {
  getFormDetailsValidateData,
  getSaveFieldAPIData,
  getSaveFormAPIData,
  getSaveTableApiData,
} from '../../../utils/formUtils';
import jsUtils, {
  isEmpty,
  cloneDeep,
  has,
  isNullishCoalesce,
} from '../../../utils/jsUtility';
import { showToastPopover, trimString } from '../../../utils/UtilityFunctions';

import {
  FIELD_CONFIG,
  FIELD_LIST_CONFIG,
  FIELD_TYPES,
  SECTION_TITLE,
} from '../../../components/form_builder/FormBuilder.strings';

import { FORM_POPOVER_STATUS } from '../../../utils/Constants';
import { TASK_STRINGS, ACTORS } from './Task.strings';
import { store } from '../../../Store';
import { getSectionFieldsFromLayout } from '../../form/sections/form_layout/FormLayout.utils';
import { FORM_LAYOUT_TYPE } from '../../form/Form.string';
import { REQUEST_SAVE_FORM } from '../../../utils/constants/form/form.constant';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';

export { setValuesForField } from '../../../utils/formUtils';

export const getFieldIndex = (sections, sectionId, fieldId) => {
  const fieldOrder = sections[sectionId - 1].is_table
    ? 'column_order'
    : 'row_order';
  return sections[sectionId - 1].fields.findIndex(
    (field) => field[fieldOrder] === fieldId,
  );
};

export const formDetailsObjectNullCheck = (
  form_details,
  sectionId,
  fieldId,
) => {
  if (
    form_details &&
    form_details.sections[sectionId - 1] &&
    form_details.sections[sectionId - 1].fields &&
    form_details.sections[sectionId - 1].fields[fieldId - 1]
  ) return true;
  return false;
};

// export const setStateFieldValueFromServer = (form_details, sections, sectionId, fieldId) => {
//   const currentStateField = sections[sectionId - 1].fields[fieldId - 1];
//   const fieldDataInServer = form_details.sections[sectionId - 1].fields[fieldId - 1];
//   currentStateField.field_name = fieldDataInServer.field_name;
//   currentStateField.reference_name = fieldDataInServer.reference_name;
//   currentStateField.required = fieldDataInServer.required ? fieldDataInServer.required : false;
//   if (fieldDataInServer.default_value) currentStateField.default_value = fieldDataInServer.default_value;
//   else if (currentStateField.default_value) delete currentStateField.default_value;
//   if (fieldDataInServer.place_holder) currentStateField.place_holder = fieldDataInServer.place_holder;
//   else if (currentStateField.place_holder) delete currentStateField.place_holder;
//   if (fieldDataInServer.help_text) currentStateField.help_text = fieldDataInServer.help_text;
//   else if (currentStateField.help_text) delete currentStateField.help_text;
//   if (fieldDataInServer.instructions) currentStateField.instructions = fieldDataInServer.instructions;
//   else if (currentStateField.instructions) delete currentStateField.instructions;
//   if (fieldDataInServer.validations) currentStateField.validations = fieldDataInServer.validations;
//   else if (currentStateField.validations) currentStateField.instructions = {};
//   return currentStateField;
// };

// export const resetStateFieldValue = (sections, sectionId, fieldId) => {
//   const currentStateField = sections[sectionId - 1].fields[fieldId - 1];
//   currentStateField.field_name = INPUT_TEXT;
//   currentStateField.reference_name = EMPTY_STRING;
//   currentStateField.required = false;
//   currentStateField.read_only = false;
//   if (currentStateField.default_value) delete currentStateField.default_value;
//   if (currentStateField.place_holder) delete currentStateField.place_holder;
//   if (currentStateField.help_text) delete currentStateField.help_text;
//   if (currentStateField.instructions) delete currentStateField.instructions;
//   currentStateField.validations = {};
//   return currentStateField;
// };

export const setDefaultValueForField = (
  sections,
  sectionId,
  fieldListIndex,
  fieldId,
  eventObject,
  t,
) => {
  const field = cloneDeep(
    sections[sectionId].field_list[fieldListIndex].fields[fieldId],
  );
  switch (field.field_type) {
    case FIELD_TYPES.DATE:
    case FIELD_TYPES.DATETIME:
      if (!jsUtils.isEmpty(eventObject)) {
        field.default_value = eventObject;
      } else if (jsUtils.isEmpty(eventObject)) delete field.default_value;
      break;
    case FIELD_TYPES.YES_NO:
      field.default_value = eventObject;
      break;
    case FIELD_TYPES.RADIO_GROUP:
      field.default_value = eventObject;
      break;
    case FIELD_TYPES.NUMBER:
      if (!jsUtils.isEmpty(eventObject.target.value)) field.default_value = parseInt(eventObject.target.value, 10);
      if (jsUtils.isEmpty(eventObject.target.value)) {
        delete field.default_value;
      }
      break;
    case FIELD_TYPES.CURRENCY:
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        if (
          eventObject.target.id ===
          FIELD_CONFIG(t).BASIC_CONFIG.DEFAULT_CURRENCY_TYPE.ID
        ) {
          if (jsUtils.isObject(field.default_value)) {
            field.default_value = {
              ...field.default_value,
              currency_type: eventObject.target.value,
            };
          } else {
            field.default_value = {
              currency_type: eventObject.target.value,
            };
          }
        } else if (jsUtils.isObject(field.default_value)) {
          field.default_value = {
            ...field.default_value,
            value: eventObject.target.value === '-' ? eventObject.target.value : parseFloat(eventObject.target.value),
          };
        } else {
          field.default_value = {
            // value: parseFloat(eventObject.target.value),
            value: eventObject.target.value === '-' ? eventObject.target.value : parseFloat(eventObject.target.value),
          };
        }
      }
      if (jsUtils.isEmpty(eventObject.target.value)) {
        if (
          eventObject.target.id ===
          FIELD_CONFIG(t).BASIC_CONFIG.DEFAULT_CURRENCY_TYPE.ID &&
          jsUtils.isObject(field.default_value)
        ) {
          if (field.default_value.value) delete field.default_value.currency_type;
          else delete field.default_value;
        } else if (jsUtils.isObject(field.default_value)) {
          if (field.default_value.currency_type) delete field.default_value.value;
          else delete field.default_value;
        } else delete field.default_value;
      }
      break;
    case FIELD_TYPES.PHONE_NUMBER: {
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        if (
          eventObject.target.id ===
          FIELD_CONFIG(t).BASIC_CONFIG.DEFAULT_PHONE_NUMBER_TYPE.ID
        ) {
          if (jsUtils.isObject(field.default_value)) {
            field.default_value = {
              ...field.default_value,
              phone_number: eventObject.target.value,
            };
          } else {
            field.default_value = {
              phone_number: eventObject.target.value,
            };
          }
        } else {
          if (jsUtils.isObject(field.default_value)) {
            field.default_value = {
              ...field.default_value,
              country_code: eventObject.target.value,
            };
          } else {
            field.default_value = {
              country_code: eventObject.target.value,
            };
          }
        }
      }
      if (jsUtils.isEmpty(eventObject.target.value)) {
        if (
          eventObject.target.id ===
          FIELD_CONFIG(t).BASIC_CONFIG.DEFAULT_PHONE_NUMBER_TYPE.ID &&
          jsUtils.isObject(field.default_value)
        ) {
          if (field.default_value.country_code) delete field.default_value.phone_number;
          else delete field.default_value;
        } else if (jsUtils.isObject(field.default_value)) {
          if (field.default_value.phone_number) delete field.default_value.country_code;
          else delete field.default_value;
        } else delete field.default_value;
      }
      break;
    }
    case FIELD_TYPES.LINK:
      if (jsUtils.isEmpty(eventObject.target.value)) delete field.default_value;
      else field.default_value = eventObject.target.value;
      break;
    case FIELD_TYPES.DROPDOWN:
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        field.default_value = trimString(eventObject.target.value);
      }
      if (
        jsUtils.isEmpty(eventObject.target.value) &&
        !jsUtils.isEmpty(field.default_value)
      ) {
        delete field.default_value;
      }
      break;
    case FIELD_TYPES.USER_TEAM_PICKER:
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        if (field.validations.allow_multiple) {
          field.default_value = { ...field.default_value, system_field: trimString(eventObject.target.value) };
        } else {
          field.default_value = { ...field.default_value, system_field: trimString(eventObject.target.value), operation: 'replace' };
        }
      }
      if (
        jsUtils.isEmpty(eventObject.target.value) &&
        !jsUtils.isEmpty(field.default_value)
      ) {
        delete field.default_value;
      }
      break;
    default:
      if (!jsUtils.isEmpty(eventObject.target.value)) field.default_value = eventObject.target.value;
      if (
        jsUtils.isEmpty(eventObject.target.value) &&
        !jsUtils.isEmpty(field.default_value)
      ) delete field.default_value;
      break;
  }
  return field;
};

export const setUserSelectorDefaultValueConfig = (
  sections,
  sectionId,
  fieldListIndex,
  fieldId,
  eventObject,
) => {
  const field = cloneDeep(
    sections[sectionId].field_list[fieldListIndex].fields[fieldId],
  );
  if (field.field_type === FIELD_TYPES.USER_TEAM_PICKER && !isEmpty(eventObject)) {
    field.default_value = { ...field.default_value, operation: trimString(eventObject) };
  }
  return field;
};

export const setOtherConfigDataForField = (
  sections,
  sectionIndex,
  fieldListIndex,
  fieldIndex,
  eventObject,
  t,
) => {
  console.log('otherconfighandler', typeof eventObject, eventObject.target.id, eventObject.target.value, sectionIndex, fieldListIndex, fieldIndex, sections);
  const field = cloneDeep(
    sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex],
  );
  switch (eventObject.target.id) {
    case FIELD_CONFIG(t).OTHER_CONFIG.PLACEHOLDER_VALUE.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) field.place_holder = eventObject.target.value;
      if (
        jsUtils.isEmpty(eventObject.target.value) &&
        !jsUtils.isEmpty(field.place_holder)
      ) delete field.place_holder;
      break;
    case FIELD_CONFIG(t).OTHER_CONFIG.HELPER_TOOL_TIP.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) field.help_text = eventObject.target.value;
      if (
        jsUtils.isEmpty(eventObject.target.value) &&
        !jsUtils.isEmpty(field.help_text)
      ) delete field.help_text;
      break;
    case FIELD_CONFIG(t).OTHER_CONFIG.INSTRUCTION.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        console.log('otherconfighandler first if', eventObject.target.value);
        field.instructions = eventObject.target.value;
      }
      if (
        jsUtils.isEmpty(eventObject.target.value) &&
        !jsUtils.isEmpty(field.instructions)
      ) delete field.instructions;
      break;
    case FIELD_CONFIG(t).OTHER_CONFIG.VALUE_FORMATER.ID:
      field.is_digit_formatted = !field.is_digit_formatted;
      break;
    default:
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        field.instructions = eventObject.target.value;
      }
      if (
        jsUtils.isEmpty(eventObject.target.value) &&
        !jsUtils.isEmpty(field.instructions)
      ) delete field.instructions;
      break;
  }
  return field;
};

const updateDateSelectionArray = (dateValidationArray, data, isMerge = true) => {
  let dateSelectionActual = {};
  if (!jsUtils.isEmpty(dateValidationArray)) {
    [dateSelectionActual] = dateValidationArray;
  }
  if (isMerge) {
    dateValidationArray[0] = {
      ...dateSelectionActual,
      ...data,
    };
  } else {
    dateValidationArray[0] = {
      ...data,
    };
  }
  return dateValidationArray;
};

export const setValidationConfigForField = (
  sections,
  sectionId,
  fieldListIndex,
  fieldId,
  eventObject,
  isTable,
  t,
) => {
  let field;
  let dateValidationArray;
  if (!isTable) {
    field = cloneDeep(
      sections[sectionId].field_list[fieldListIndex].fields[fieldId],
    );
    dateValidationArray = jsUtils.isEmpty(field.validations.date_selection) ? [] : field.validations.date_selection;
  } else {
    field = cloneDeep(
      sections[sectionId].field_list[fieldListIndex],
    );
  }
  console.log('KKSKKSLSLS', eventObject.target.id);
  switch (eventObject.target.id) {
    case FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MIN_ROW_VALIDATION.ID:
      field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MIN_ROW_VALIDATION.ID] = !field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MIN_ROW_VALIDATION.ID];
      !field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MIN_ROW_VALIDATION.ID] && (delete field.table_validations.minimum_row);
      console.log('field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MIN_ROW_VALIDATION.ID]', field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MIN_ROW_VALIDATION.ID]);
      break;
    case FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.ALLOW_ADDING_NEW_ROW.ID:
      field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.ALLOW_ADDING_NEW_ROW.ID] = !field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.ALLOW_ADDING_NEW_ROW.ID];
      break;
    case FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.ALLOW_EDITING_EXISTING_ROW.ID:
      field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.ALLOW_EDITING_EXISTING_ROW.ID] = !field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.ALLOW_EDITING_EXISTING_ROW.ID];
      break;
    case FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.ALLOW_DELETING_EXISTING_ROW.ID:
      field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.ALLOW_DELETING_EXISTING_ROW.ID] = !field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.ALLOW_DELETING_EXISTING_ROW.ID];
      break;
    case FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MIN_ROW_VALIDATION.ROWS_INPUT.ID:
      console.log('userteampicker ccccccal', eventObject);
      if (!jsUtils.isEmpty(eventObject.target.value) && !jsUtils.isNull(eventObject.target.value)) {
        field.table_validations.minimum_row = eventObject.target.value.replace(/[^0-9]/g, '');
        if (field.table_validations.minimum_row) {
          console.log('userteampicker ccccccal inside', eventObject.target.value.replace(/[^0-9]/g, ''));
          field.table_validations.minimum_row = parseInt(
            field.table_validations.minimum_row,
            10,
          );
        } else delete field.table_validations.minimum_row;
      } else delete field.table_validations.minimum_row;
      break;
    case FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MAX_ROW_VALIDATION.ID:
      field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MAX_ROW_VALIDATION.ID] = !field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MAX_ROW_VALIDATION.ID];
      !field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MAX_ROW_VALIDATION.ID] && (delete field.table_validations.maximum_row);
      console.log('field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MAX_ROW_VALIDATION.ID]', field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MAX_ROW_VALIDATION.ID]);
      break;
    case FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.MAX_ROW_VALIDATION.ROWS_INPUT.ID:
      console.log('userteampicker ccccccal', eventObject);
      if (!jsUtils.isEmpty(eventObject.target.value) && !jsUtils.isNull(eventObject.target.value)) {
        field.table_validations.maximum_row = eventObject.target.value.replace(/[^0-9]/g, '');
        if (field.table_validations.maximum_row) {
          console.log('userteampicker ccccccal inside', eventObject.target.value.replace(/[^0-9]/g, ''));
          field.table_validations.maximum_row = parseInt(
            field.table_validations.maximum_row,
            10,
          );
        } else delete field.table_validations.maximum_row;
      } else delete field.table_validations.maximum_row;
      break;
    case FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.UNIQUE_COLUMN.ID:
      field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.UNIQUE_COLUMN.ID] = !field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.UNIQUE_COLUMN.ID];
      field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.UNIQUE_COLUMN.UNIQUE_COLUMN_FIELDS.ID] = null;
      break;
    case FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.UNIQUE_COLUMN.UNIQUE_COLUMN_FIELDS.ID:
      console.log('event.target.value onTableValidationConfigChangeHandler123', eventObject);
      field.table_validations[FIELD_LIST_CONFIG(t).TABLE.VALIDATION_CONFIG.UNIQUE_COLUMN.UNIQUE_COLUMN_FIELDS.ID]
        = eventObject.target.value;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.NO_LIMITS.ID:
      dateValidationArray[0] = { type: eventObject.target.value };
      field.validations.date_selection = dateValidationArray;
      if (field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID]) {
        delete field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID];
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE.ID:
      if (field.validations.date_selection[0].type !== 'future') {
        dateValidationArray[0] = {
          type: eventObject.target.value,
          sub_type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_ALL.VALUE,
        };
        field.validations.date_selection = dateValidationArray;
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_ALL.ID:
      dateValidationArray[0] = {
        type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE.VALUE,
        sub_type: eventObject.target.value,
      };
      field.validations.date_selection = dateValidationArray;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.ID:
      dateValidationArray[0] = {
        type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE.VALUE,
        sub_type: eventObject.target.value,
        start_day: null,
      };
      field.validations.date_selection = dateValidationArray;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.ID:
      dateValidationArray[0] = {
        type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE.VALUE,
        sub_type: eventObject.target.value,
        start_day: null,
      };
      field.validations.date_selection = dateValidationArray;
      if (field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID]) {
        delete field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID];
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.ID:
      dateValidationArray[0] = {
        type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE.VALUE,
        sub_type: eventObject.target.value,
        start_day: null,
        end_day: null,
      };
      field.validations.date_selection = dateValidationArray;
      if (field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID]) {
        delete field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID];
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST.ID:
      if (field.validations.date_selection[0].type !== 'past') {
        dateValidationArray[0] = {
          type: eventObject.target.value,
          sub_type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_ALL.VALUE,
        };
        field.validations.date_selection = dateValidationArray;
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_ALL.ID:
      dateValidationArray[0] = {
        type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST.VALUE,
        sub_type: eventObject.target.value,
      };
      field.validations.date_selection = dateValidationArray;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.ID:
      dateValidationArray[0] = {
        type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST.VALUE,
        sub_type: eventObject.target.value,
        start_day: null,
      };
      field.validations.date_selection = dateValidationArray;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.ID:
      dateValidationArray[0] = {
        type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST.VALUE,
        sub_type: eventObject.target.value,
        start_day: null,
      };
      field.validations.date_selection = dateValidationArray;
      if (field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID]) {
        delete field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID];
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.ID:
      dateValidationArray[0] = {
        type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST.VALUE,
        sub_type: eventObject.target.value,
        start_day: null,
        end_day: null,
      };
      field.validations.date_selection = dateValidationArray;
      if (field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID]) {
        delete field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID];
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_ONLY_TODAY.ID:
      dateValidationArray[0] = { type: eventObject.target.value };
      field.validations.date_selection = dateValidationArray;
      if (field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID]) {
        delete field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID];
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.ID:
      if (field.validations.date_selection[0].type !== 'date') {
        dateValidationArray[0] = {
          type: eventObject.target.value,
          sub_type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE_OPTIONS.AFTER,
          start_date: null,
        };
        field.validations.date_selection = dateValidationArray;
        if (field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID]) {
          delete field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID];
        }
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.START_DATE.ID:
      let data = {};
      if (!isEmpty(dateValidationArray[0].end_date)) {
        if (isEmpty(eventObject.target.value)) {
          data = {
            type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.VALUE,
            sub_type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE_OPTIONS.BEFORE,
            end_date: dateValidationArray[0].end_date,
          };
        } else {
          data = {
            type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.VALUE,
            sub_type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE_OPTIONS.BETWEEN,
            start_date: eventObject.target.value,
            end_date: dateValidationArray[0].end_date,
          };
        }
      } else {
        data = {
          type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.VALUE,
          sub_type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE_OPTIONS.AFTER,
          start_date: eventObject.target.value,
        };
      }
      field.validations.date_selection = updateDateSelectionArray(
        dateValidationArray,
        data,
        false,
      );
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.END_DATE.ID:
      let dateValue = {};
      if (!isEmpty(dateValidationArray[0].start_date)) {
        if (isEmpty(eventObject.target.value)) {
          dateValue = {
            type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.VALUE,
            sub_type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE_OPTIONS.AFTER,
            start_date: dateValidationArray[0].start_date,
          };
        } else {
          dateValue = {
            type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.VALUE,
            sub_type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE_OPTIONS.BETWEEN,
            start_date: dateValidationArray[0].start_date,
            end_date: eventObject.target.value,
          };
        }
      } else {
        if (isEmpty(eventObject.target.value)) {
          dateValue = {
            type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.VALUE,
            sub_type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE_OPTIONS.AFTER,
            start_date: dateValidationArray[0].start_date,
          };
        } else {
          dateValue = {
            type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.VALUE,
            sub_type: FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE_OPTIONS.BEFORE,
            end_date: eventObject.target.value,
          };
        }
      }
      field.validations.date_selection = updateDateSelectionArray(
        dateValidationArray,
        dateValue,
        false,
      );
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_DATE_FIELDS.ID:
      field.validations.date_selection = updateDateSelectionArray(
        dateValidationArray,
        { type: eventObject.target.value },
        false,
      );
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERATORS.ID:
      // if (eventObject.target.value !== FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERATORS.DUAL_FIELDS_OPTION_LIST[0].value) {
      if (dateValidationArray && dateValidationArray[0] && !isEmpty(dateValidationArray[0].second_field_uuid)) delete dateValidationArray[0].second_field_uuid;
      field.validations.date_selection = updateDateSelectionArray(
        dateValidationArray,
        { operator: eventObject.target.value },
        true,
      );
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERAND_1.ID:
      field.validations.date_selection = updateDateSelectionArray(
        dateValidationArray,
        { first_field_uuid: eventObject.target.value },
        true,
      );
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERAND_2.ID:
      field.validations.date_selection = updateDateSelectionArray(
        dateValidationArray,
        { second_field_uuid: eventObject.target.value },
        true,
      );
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.INPUT_ID:
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.INPUT_ID:
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_1:
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.INPUT_ID:
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.INPUT_ID:
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_1:
      field.validations.date_selection = updateDateSelectionArray(
        dateValidationArray,
        { start_day: eventObject.target.value },
      );
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_2:
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_2:
      field.validations.date_selection = updateDateSelectionArray(
        dateValidationArray,
        { end_day: eventObject.target.value },
      );
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID:
      if (field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID]) {
        delete field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID];
      } else {
        field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID] = true;
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_WORKING_DAY.ID:
      if (field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_WORKING_DAY.ID]) {
        delete field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_WORKING_DAY.ID];
        console.log(field.validations, 'field.validations 2');
      } else {
        field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_WORKING_DAY.ID] = true;
        console.log(field.validations, 'field.validations');
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_DECIMAL.ID:
      if (field.validations.allow_decimal) {
        delete field.validations.allow_decimal;
        if (field.validations.allowed_decimal_points) delete field.validations.allowed_decimal_points;
      } else {
        field.validations.allow_decimal = true;
        field.validations.allowed_decimal_points = 2;
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_NEGATIVE_VALUE.ID:
      if (field.validations.allow_negative_numbers) delete field.validations.allow_negative_numbers;
      else field.validations.allow_negative_numbers = true;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_ZERO.ID:
      if (field.validations.dont_allow_zero) delete field.validations.dont_allow_zero;
      else field.validations.dont_allow_zero = true;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.MAXIMUM_FILE_SIZE.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        field.validations.maximum_file_size = parseInt(
          eventObject.target.value,
          10,
        );
      }
      if (jsUtils.isEmpty(eventObject.target.value)) delete field.validations.maximum_file_size;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOWED_CURRENCY_TYPES.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) field.validations.allowed_currency_types = eventObject.target.value;
      if (
        jsUtils.isEmpty(eventObject.target.value) &&
        !jsUtils.isEmpty(field.validations.allowed_currency_types)
      ) field.validations.allowed_currency_types = [];
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOWED_FILE_EXTENSIONS.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) field.validations.allowed_extensions = eventObject.target.value;
      if (
        jsUtils.isEmpty(eventObject.target.value) &&
        !jsUtils.isEmpty(field.validations.allowed_extensions)
      ) delete field.validations.allowed_extensions;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.DEFAULT_CURRENCY_TYPE.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) field.validations.default_currency_type = eventObject.target.value;
      if (
        jsUtils.isEmpty(eventObject.target.value) &&
        !jsUtils.isEmpty(field.validations.default_currency_type)
      ) delete field.validations.default_currency_type;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOWED_DECIMAL_POINTS.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        field.validations.allowed_decimal_points = parseInt(
          eventObject.target.value,
          10,
        );
      }
      if (jsUtils.isEmpty(eventObject.target.value)) delete field.validations.allowed_decimal_points;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOWED_MINIMUM.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        field.validations.allowed_minimum = parseInt(
          eventObject.target.value,
          10,
        );
      }
      if (jsUtils.isEmpty(eventObject.target.value)) delete field.validations.allowed_minimum;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOWED_MAXIMUM.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        field.validations.allowed_maximum = parseInt(
          eventObject.target.value,
          10,
        );
      }
      if (jsUtils.isEmpty(eventObject.target.value)) delete field.validations.allowed_maximum;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.MINIMUM_CHARCTERS.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        field.validations.minimum_characters = parseInt(
          eventObject.target.value,
          10,
        );
      }
      if (jsUtils.isEmpty(eventObject.target.value)) delete field.validations.minimum_characters;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.MAXIMUM_CHARCTERS.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        field.validations.maximum_characters = parseInt(
          eventObject.target.value,
          10,
        );
      }
      if (jsUtils.isEmpty(eventObject.target.value)) delete field.validations.maximum_characters;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.MINIMUM_COUNT.ID:
      field.validations.minimum_count = eventObject.target.value.replace(/[^0-9]/g, '');
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        field.validations.minimum_count = parseInt(
          field.validations.minimum_count,
          10,
        );
      }
      if (jsUtils.isEmpty(eventObject.target.value)) delete field.validations.minimum_count;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_LINKS.ID:
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_FILES.ID:
      if (field.field_type === FIELD_TYPES.LINK) {
        console.log('allowmutliplefiles', field, !field.validations[
          FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_LINKS.ID
        ]);
        if (
          !field.validations[
            FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_LINKS.ID
          ]
        ) {
          field.validations[
            FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_LINKS.ID
          ] = true;
        } else {
          if (!isEmpty(field.default_value) && (field.default_value.length > 1)) {
            showToastPopover(
              'Error(s) found in the form',
              'Multiple links added as default value. Remove them to update validations',
              FORM_POPOVER_STATUS.SERVER_ERROR,
              true,
            );
          } else {
            field.validations[
              FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_LINKS.ID
            ] = false;
            if (field.validations) {
              delete field.validations[
                FIELD_CONFIG(t).VALIDATION_CONFIG.MAXIMUM_COUNT.ID
              ];
              delete field.validations[
                FIELD_CONFIG(t).VALIDATION_CONFIG.MINIMUM_COUNT.ID
              ];
            }
          }
        }
      }
      if (field.field_type === FIELD_TYPES.FILE_UPLOAD) {
        console.log('linkhithere', field);
        const clonedFieldData = cloneDeep(field);
        if (!clonedFieldData.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_FILES.ID]) {
          clonedFieldData.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_FILES.ID] = true;
        } else if (clonedFieldData.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_FILES.ID]) {
          clonedFieldData.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_FILES.ID] = false;
          delete clonedFieldData.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.MAXIMUM_FILE_COUNT.ID];
          delete clonedFieldData.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.MINIMUM_FILE_COUNT.ID];
        }
        console.log('clonedFieldData', clonedFieldData);
        field = cloneDeep(clonedFieldData);
        console.log('clonedFieldData1', field);
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.MAXIMUM_COUNT.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) {
        field.validations.maximum_count = eventObject.target.value.replace(/[^0-9]/g, '');
        field.validations.maximum_count = parseInt(
          field.validations.maximum_count,
          10,
        );
      }
      if (jsUtils.isEmpty(eventObject.target.value)) delete field.validations.maximum_count;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.MAXIMUM_COUNT_DATA_LIST.ID:
      console.log('userteampicker ccccccal', eventObject);
      if (!jsUtils.isEmpty(eventObject.target.value) && !jsUtils.isNull(eventObject.target.value)) {
        field.validations.maximum_selection = eventObject.target.value.replace(/[^0-9]/g, '');
        if (field.validations.maximum_selection) {
          if (field.field_type === FIELD_TYPES.USER_TEAM_PICKER) {
            field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MAXIMUM_USER.ID] = true;
          }
          console.log('userteampicker ccccccal inside', eventObject.target.value.replace(/[^0-9]/g, ''));
          field.validations.maximum_selection = parseInt(
            field.validations.maximum_selection,
            10,
          );
        } else {
          (field.field_type === FIELD_TYPES.USER_TEAM_PICKER) && delete field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MAXIMUM_USER.ID];
          delete field.validations.maximum_selection;
        }
      } else {
        delete field.validations.maximum_selection;
        (field.field_type === FIELD_TYPES.USER_TEAM_PICKER) && delete field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MAXIMUM_USER.ID];
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_DATA_LIST.ID:
      const allow_multiple = jsUtils.get(eventObject, ['target', 'value'], false);
      field.validations.allow_multiple = allow_multiple;
      if (!allow_multiple) {
        delete field.validations.maximum_selection;
        delete field.validations.minimum_selection;
        if (
          field.field_type === FIELD_TYPES.USER_TEAM_PICKER &&
          (field.validations.allow_maximum_selection || field.validations.allow_minimum_selection)
        ) {
          field.validations.allow_maximum_selection = false;
          field.validations.allow_minimum_selection = false;
        }
      } else if (has(field, ['validations', 'maximum_selection'], false)) delete field.validations.maximum_selection;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.LIMIT_DATALIST.IS_DATALIST_FILTER:
      field.validations.is_datalist_filter = eventObject.target.value;
      if (!eventObject.target.value) field.validations.filter_fields = [];
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.ID:
      field.validations.filter_fields = eventObject.target.value;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.LIMIT_DATALIST.CHANGE_DATA:
      field.validations = eventObject.target.value;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ADDITIONAL_CHARACTERS.ID:
      if (!jsUtils.isEmpty(eventObject.target.value)) field.validations.allowed_special_characters = eventObject.target.value.replace(/[a-zA-Z0-9]/g, '');
      if (
        jsUtils.isEmpty(eventObject.target.value) &&
        !jsUtils.isEmpty(field.validations.allowed_special_characters)
      ) {
        delete field.validations.allowed_special_characters;
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_USERS.ID:
      if (
        field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_USERS.ID] &&
        field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_TEAMS.ID]
      ) {
        field.validations[
          FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_TEAMS.ID
        ] = false;
      } else {
        field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_USERS.ID] =
          !field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_USERS.ID];
        if (field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_USERS.ID]) {
          field.validations[
            FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_TEAMS.ID
          ] = false;
        }
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_TEAMS.ID:
      if (
        field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_USERS.ID] &&
        field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_TEAMS.ID]
      ) {
        field.validations[
          FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_USERS.ID
        ] = false;
      } else {
        field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_TEAMS.ID] =
          !field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_TEAMS.ID];
        if (field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_TEAMS.ID]) {
          field.validations[
            FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_USERS.ID
          ] = false;
        }
      }
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.IS_RESTRICTED.ID:
      field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.IS_RESTRICTED.ID] =
        !field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.IS_RESTRICTED.ID];
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.RESTRICTED_USER_TEAM.ID:
      field.validations[
        FIELD_CONFIG(t).VALIDATION_CONFIG.RESTRICTED_USER_TEAM.ID
      ] = eventObject.target.value;
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MAXIMUM_USER.ID:
      field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MAXIMUM_USER.ID] = !field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MAXIMUM_USER.ID];
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MINIMUM_USER.ID:
      field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MINIMUM_USER.ID] = !field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MINIMUM_USER.ID];
      break;
    case FIELD_CONFIG(t).VALIDATION_CONFIG.MIN_USER_SELECTION.ID:
      if (!jsUtils.isEmpty(eventObject.target.value) && !jsUtils.isNull(eventObject.target.value)) {
        field.validations.minimum_selection = eventObject.target.value.replace(/[^0-9]/g, '');
        if (field.validations.minimum_selection) {
          field.validations.minimum_selection = parseInt(
            field.validations.minimum_selection,
            10,
          );
          field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MINIMUM_USER.ID] = true;
        } else {
          delete field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MINIMUM_USER.ID];
          delete field.validations.minimum_selection;
        }
      } else {
        delete field.validations[FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MINIMUM_USER.ID];
        delete field.validations.minimum_selection;
      }
      break;
    default:
      break;
  }
  return field;
};

export const deleteAndReorderSections = (sections, sectionId) => {
  jsUtils.remove(sections, { section_order: sectionId });
  const reOrderedSections = sections;
  let sectionOrderRearrange = 1;
  if (sections[sectionId - 1]) {
    reOrderedSections.map((section) => {
      reOrderedSections[sectionOrderRearrange - 1].section_order =
        sectionOrderRearrange;
      sectionOrderRearrange += 1;
      return section;
    });
  }
  return reOrderedSections;
};

export const deleteAndReOrderSectionsAndFields = (
  sections,
  sectionId,
  fieldId,
) => {
  jsUtils.remove(sections[sectionId - 1].fields, { row_order: fieldId });
  const reOrderedSectionsAndFields = sections;
  let rowOrderRearrange = 1;
  if (
    reOrderedSectionsAndFields[sectionId - 1] &&
    reOrderedSectionsAndFields[sectionId - 1].fields.length
  ) {
    reOrderedSectionsAndFields[sectionId - 1].fields.map((field) => {
      if (
        reOrderedSectionsAndFields[sectionId - 1].fields[rowOrderRearrange - 1]
          .row_order !== field.row_order
      ) {
        reOrderedSectionsAndFields[sectionId - 1].fields[
          rowOrderRearrange - 1
        ].is_edited = true;
      }
      reOrderedSectionsAndFields[sectionId - 1].fields[
        rowOrderRearrange - 1
      ].row_order = rowOrderRearrange;
      rowOrderRearrange += 1;
      return field;
    });
  }
  return reOrderedSectionsAndFields;
};

export const checkAndDisplaySectionTitleError = (state) => {
  // let isSectionTitleError = false;
  /* Object.keys(state.error_list).forEach((key) => {
    if (key.includes('section_name')) {
      isSectionTitleError = true;
    }
  }); */
  Object.keys(state.error_list).forEach((eachErrorKey) => {
    if (
      eachErrorKey.includes('section_name') &&
      state.error_list[eachErrorKey].includes(
        'less than or equal to 50 characters ',
      )
    ) {
      showToastPopover(
        'Section title exceeds 50 characters',
        'Section title should be less than 50',
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    } else if (
      eachErrorKey.includes('section_name') &&
      state.error_list[eachErrorKey].includes('Title is required')
    ) {
      showToastPopover(
        ERROR_TEXT.SECTION_NAME_REQUIRED,
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    } else if (eachErrorKey.includes('section_name')) {
      showToastPopover(
        'Error in Section title',
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
  });
};
export const getBasicDetailsValidateData = (state) => {
  const { task_name, task_description, assignees, due_date } = state;
  return {
    [TASK_STRINGS.TASK_TITLE.ID]: task_name,
    [TASK_STRINGS.TASK_DESCRIPTION.ID]: task_description,
    [ACTORS.MEMBER_OR_TEAM.ASSIGN_TO.ID]: assignees,
    [ACTORS.MEMBER_OR_TEAM.DUE_DATE.ID]: due_date,
  };
};
export const getRecursiveDetails = (state) => {
  console.log('getRecursiveDetails', state);
  const data = {};
  data.has_auto_trigger = state.has_auto_trigger || false;
  if (data.has_auto_trigger) {
    data.auto_trigger_details = {};
    data.auto_trigger_details.is_recursive = state.auto_trigger_details.is_recursive;
    if (state.auto_trigger_details.is_recursive) {
      data.auto_trigger_details.recursive_data = {};
      data.auto_trigger_details.recursive_data.type = state.auto_trigger_details.recursive_data.type;
      data.auto_trigger_details.recursive_data.time_at = state.auto_trigger_details.recursive_data.time_at;
      console.log('if recursive', data);
      if (state.auto_trigger_details.recursive_data.type === 'day') {
        data.auto_trigger_details.recursive_data.on_days = state.auto_trigger_details.recursive_data.on_days;
        data.auto_trigger_details.recursive_data.is_working = state.auto_trigger_details.recursive_data.is_working;
        console.log('if recursive day', data);
      } else {
        data.auto_trigger_details.recursive_data.is_working = state.auto_trigger_details.recursive_data.is_working;
        data.auto_trigger_details.recursive_data.repeat_type = state.auto_trigger_details.recursive_data.repeat_type;
        if (data.auto_trigger_details.recursive_data.repeat_type === 'selected_date') {
          data.auto_trigger_details.recursive_data.on_date = state.auto_trigger_details.recursive_data.on_date;
        } else if (data.auto_trigger_details.recursive_data.repeat_type === 'selected_week_day') {
          data.auto_trigger_details.recursive_data.on_week = state.auto_trigger_details.recursive_data.on_week;
          data.auto_trigger_details.recursive_data.on_day = state.auto_trigger_details.recursive_data.on_day;
        }
      }
    }
  }
  console.log('getRecursiveDetails', data);

  return data;
};

export const getSectionDetails = (state) => {
  const { sections, form_details } = state;
  const sectionObj =
    !jsUtils.isEmpty(form_details) && sections && sections.length > 0
      ? { [TASK_STRINGS.SECTIONS]: sections }
      : null;
  return sectionObj;
};

export const getTaskDetailsValidateData = (state, inputSection) =>
  getFormDetailsValidateData(state, inputSection, TASK_STRINGS);

export const getFieldDataForValidation = (field) => {
  switch (field.field_type) {
    // case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
    //   console.log('3 loops done', field);
    //   const { lookUpList } = store.getState().LookUpReducer;
    //   field.value_metadata = isUndefined(field.value_metadata)
    //     ? getLookupId(lookUpList, field.selected_lookup_field)
    //     : field.value_metadata;
    //   // delete field.values;
    //   delete field.selected_lookup_field;
    //   break;
    // case FIELD_TYPES.USER_TEAM_PICKER: // removed users/teams array in validation config on changes
    //   if (field.validations && field.validations.is_restricted) {
    //     isEmpty(field.validations.restricted_user_team.teams) && delete field.validations.restricted_user_team.teams;
    //     isEmpty(field.validations.restricted_user_team.users) && delete field.validations.restricted_user_team.users;
    //   }
    //   break;
    case FIELD_TYPES.DATA_LIST:
      if (Object.keys(field.validations).includes('is_datalist_filter')) {
        if (!field.validations.is_datalist_filter) field.validations.filter_fields = [];
        delete field.validations.is_datalist_filter;
      }
      break;
    default:
      break;
  }
  return field;
};

export const getOverallTaskDetailsValidateData = (state) => {
  const { task_name, task_description, due_date, assignees } =
    state;
  // const _sections = sections.map((section) => {
  //   // console.log('sectionobj', value, index);
  //   const newSection = section;
  //   newSection.field_list = section.field_list.map((eachFieldList) => {
  //     const newFieldList = { ...eachFieldList };
  //     newFieldList.fields = eachFieldList.fields.map((field) => {
  //       let newField = { ...field };
  //       switch (field.field_type) {
  //         case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
  //           console.log('3 loops done', field);
  //           const { lookUpList } = store.getState().LookUpReducer;
  //           field.value_metadata = isUndefined(field.value_metadata)
  //             ? getLookupId(lookUpList, field.selected_lookup_field)
  //             : field.value_metadata;
  //           // delete field.values;
  //           delete field.selected_lookup_field;
  //           break;
  //         case FIELD_TYPES.USER_TEAM_PICKER:
  //           if (field.validations && field.validations.is_restricted) {
  //             isEmpty(field.validations.restricted_user_team.teams) && delete field.validations.restricted_user_team.teams;
  //             isEmpty(field.validations.restricted_user_team.users) && delete field.validations.restricted_user_team.users;
  //           }
  //           break;
  //         case FIELD_TYPES.DATA_LIST:
  //           if (Object.keys(field.validations).includes('is_datalist_filter')) {
  //             if (!field.validations.is_datalist_filter) field.validations.filter_fields = [];
  //             delete field.validations.is_datalist_filter;
  //           }
  //           break;
  //         default:
  //           break;
  //       }
  //       newField = { ...field };
  //       return newField;
  //     });
  //     return newFieldList;
  //   });
  //   return newSection;
  // });

  // const sectionObj = !jsUtils.isEmpty(form_details) && _sections && _sections.length > 0
  //   ? { [TASK_STRINGS.SECTIONS]: _sections }
  //   : null;
  // console.log('section obj', _sections, form_details, sectionObj);
  return {
    [TASK_STRINGS.TASK_TITLE.ID]: task_name,
    [TASK_STRINGS.TASK_DESCRIPTION.ID]: task_description,
    [ACTORS.MEMBER_OR_TEAM.DUE_DATE.ID]: due_date,
    [ACTORS.MEMBER_OR_TEAM.ASSIGN_TO.ID]: assignees,
    // ...sectionObj,
  };
};

export const getSaveTaskValidateSchema = (state) => {
  const { task_name, task_description, due_date } = state;
  return {
    [TASK_STRINGS.TASK_TITLE.ID]: task_name.trim(),
    [TASK_STRINGS.TASK_DESCRIPTION.ID]: task_description.trim(),
    [ACTORS.MEMBER_OR_TEAM.DUE_DATE.ID]: due_date,
  };
};

export const getSectionTitleValidateData = (state) => {
  const { section_name } = state;
  return {
    [SECTION_TITLE.ID]: section_name,
  };
};

export const removeTeamOrUserFromTask = (state, id) => {
  const { assignees } = state;
  if (assignees && assignees.teams) {
    if (jsUtils.find(assignees.teams, { _id: id })) {
      jsUtils.remove(assignees.teams, { _id: id });
      if (assignees.teams.length === 0) delete assignees.teams;
    }
  }
  if (assignees && assignees.users) {
    if (jsUtils.find(assignees.users, { _id: id })) {
      jsUtils.remove(assignees.users, { _id: id });
      if (assignees.users.length === 0) delete assignees.users;
    }
  }
  return assignees;
};

export const addTeamOrUserToTask = (state, eventObject) => {
  const { assignees } = state;
  const team_or_user = eventObject.target.value;
  if (team_or_user.is_user) {
    if (assignees && assignees.users) {
      if (!jsUtils.find(assignees.users, { _id: team_or_user._id })) assignees.users.push(team_or_user);
    } else {
      assignees.users = [];
      assignees.users.push(team_or_user);
    }
  } else if (!team_or_user.is_user) {
    if (team_or_user.user_type) {
      if (assignees && assignees.users) {
        if (!jsUtils.find(assignees.users, { _id: team_or_user._id })) assignees.users.push(team_or_user);
      } else {
        assignees.users = [];
        assignees.users.push(team_or_user);
      }
    } else {
      if (assignees && assignees.teams) {
        if (!jsUtils.find(assignees.teams, { _id: team_or_user._id })) assignees.teams.push(team_or_user);
      } else {
        assignees.teams = [];
        assignees.teams.push(team_or_user);
      }
    }
  }
  return assignees;
};

export const getUpdatedAssigneesList = (state, assigneesListUpdated) => {
  const { assignees } = state;
  assigneesListUpdated.forEach((assignee) => {
    if (jsUtils.has(assignee, 'team_name')) {
      const index = assignees.teams.findIndex((team) => (team._id === assignee._id));
      if (index > -1) {
        const selectedTeam = assignees.teams[index];
        selectedTeam.has_access = assignee.has_access;
        assignees.teams[index] = selectedTeam;
      }
    } else {
      const index = assignees.users.findIndex((user) => (user._id === assignee._id));
      if (index > -1) {
        const selectedUser = assignees.users[index];
        selectedUser.has_access = assignee.has_access;
        assignees.users[index] = selectedUser;
      }
    }
  });
  console.log(assignees, 'jhfgfjhdgfhfjfh');
  return assignees;
};

// const isValidTaskSections = (sections) =>
//   sections.find((section) => {
//     if (section.field_list && section.field_list.length > 0) {
//       return true;
//     }
//     return false;
//   });

const isValidTaskSections = (sections) =>
  sections.find((section) => {
    const layouts = [];
      section?.layout?.forEach((layout) => {
        if (!isEmpty(layout?.children)) {
          layouts.push(...getSectionFieldsFromLayout(layout));
        }
      });
      return !!(layouts.find((eachLayout) => eachLayout.type === FORM_LAYOUT_TYPE.FIELD));
  });

export const getTaskAPIData = (state, formStatus, collect_data = null, isMlTaskCreation = false) => {
  const taskPostData = {};
  console.log('form details', state, has(state, 'form_details'), jsUtils.isEmpty(state.form_details));
  if (!isEmpty(state.task_details)) {
    taskPostData.task_name = jsUtils.removeExtraSpace(state.task_name.trim());
    if (
      has(state, 'form_details')
      && !jsUtils.isEmpty(state.form_details)
      && state.sections
      && state.sections.length > 0
      && isValidTaskSections(state.sections)
    ) {
      taskPostData.collect_data = true;
    } else {
      taskPostData.collect_data = false;
    }

    if (!isNullishCoalesce(collect_data)) taskPostData.collect_data = collect_data;

    if (!isEmpty(state.task_description)) taskPostData.task_description = jsUtils.removeExtraSpace && jsUtils.removeExtraSpace(state.task_description.trim());
    else if (
      isEmpty(state.task_description) &&
      !isEmpty(state.task_details.task_description)
    ) taskPostData.task_description = null;
    if (!isEmpty(state.due_date)) taskPostData.due_date = state.due_date;
    else if (isEmpty(state.due_date) && !isEmpty(state.task_details.due_date)) taskPostData.due_date = null;
    taskPostData.task_metadata_uuid = state.task_details.task_metadata_uuid;
    if (!isEmpty(state.form_details)) taskPostData.form_id = state.form_details.form_id;
    if (!isEmpty(state.assignees)) {
      console.log('assignees is present in state');
      taskPostData.assignees = {};
      if (state.assignees.teams && state.assignees.teams.length > 0) {
        const teams = [];
        state.assignees.teams.forEach((team) => {
          teams.push(team._id);
        });
        taskPostData.assignees.teams = teams;
      }
      if (state.assignees.users && state.assignees.users.length > 0) {
        console.log('user is also added to assignees');
        const users = [];
        state.assignees.users.forEach((user) => {
          users.push(user._id);
        });
        taskPostData.assignees.users = users;
        console.log(taskPostData);
      }
    } else taskPostData.assignees = { users: [], teams: [] };
    if (formStatus === 'deleteForm') taskPostData.is_form_delete = '1';
    taskPostData.is_assign_to_individual_assignees = state.is_assign_to_individual_assignees;
    if (!jsUtils.isEmpty(state.files)) {
      const uploadedDocumentMetadata = [];
      const taskReferenceDocuments = [];
      state.files.forEach((file) => {
        const documentFromAPI = jsUtils.get(state, ['task_details', 'document_url_details'], []).find(
          (document) => document.document_id === file.id,
        );
        if (!state.removed_doc_list.includes(file.id)) {
          if (jsUtils.isUndefined(documentFromAPI)) {
            uploadedDocumentMetadata.push({
              document_id: file.id,
              type: ENTITY.TASK_REFERENCE_DOCUMENTS,
              upload_signed_url: file.url || file.link,
            });
          }
          taskReferenceDocuments.push(file.id);
        }
      });
      const documentDetails = {
        entity: ENTITY.TASK_METADATA,
        entity_id: state.task_details._id,
        ref_uuid: state.ref_uuid,
        uploaded_doc_metadata: uploadedDocumentMetadata,
        ...(!jsUtils.isEmpty(state.removed_doc_list) ? { removed_doc_list: state.removed_doc_list } : {}),
      };
      console.log('taskReferenceDocuments first if outside', uploadedDocumentMetadata, documentDetails);
      taskPostData.task_reference_documents = taskReferenceDocuments;
      if (!jsUtils.isEmpty(uploadedDocumentMetadata)) taskPostData.document_details = documentDetails;
    }
    return taskPostData;
  }
  if (!has(state, 'form_details')) {
    taskPostData.collect_data = false;
  }
  if (!isNullishCoalesce(collect_data)) taskPostData.collect_data = collect_data;

  taskPostData.task_name = state.task_name.trim();
  if (!isEmpty(state.task_description)) taskPostData.task_description = state.task_description;
  if (!isEmpty(state.due_date)) taskPostData.due_date = state.due_date;
  if (!isEmpty(state.assignees)) {
    console.log('assignees is present in state');
    taskPostData.assignees = {};
    if (state.assignees.teams && state.assignees.teams.length > 0) {
      const teams = [];
      state.assignees.teams.forEach((team) => {
        teams.push(team._id);
      });
      taskPostData.assignees.teams = teams;
    }
    if (state.assignees.users && state.assignees.users.length > 0) {
      console.log('user is also added to assignees');
      const users = [];
      state.assignees.users.forEach((user) => {
        users.push(user._id);
      });
      taskPostData.assignees.users = users;
      console.log(taskPostData);
    }
  } else taskPostData.assignees = { users: [], teams: [] };
  if (isMlTaskCreation) {
    if (isEmpty(taskPostData?.assignees) || (isEmpty(taskPostData.assignees?.users) && isEmpty(taskPostData.assignees?.teams))) {
      delete taskPostData.assignees;
    }
  }
  taskPostData.is_assign_to_individual_assignees = state.is_assign_to_individual_assignees;
  console.log(taskPostData);
  if (!jsUtils.isEmpty(state.files)) {
    const uploadedDocumentMetadata = [];
    const taskReferenceDocuments = [];
    state.files.forEach((file) => {
      const documentFromAPI = jsUtils.get(state, ['task_details', 'document_url_details'], []).find(
        (document) => document.document_id === file.id,
      );
      if (!state.removed_doc_list.includes(file.id)) {
        if (jsUtils.isUndefined(documentFromAPI)) {
          uploadedDocumentMetadata.push({
            document_id: file.id,
            type: ENTITY.TASK_REFERENCE_DOCUMENTS,
            upload_signed_url: file.url,
          });
        }
        taskReferenceDocuments.push(file.id);
      }
    });
    const documentDetails = {
      entity: ENTITY.TASK_METADATA,
      entity_id: state.files[0].entity_id,
      ref_uuid: state.ref_uuid,
      uploaded_doc_metadata: uploadedDocumentMetadata,
      ...(!jsUtils.isEmpty(state.removed_doc_list) ? { removed_doc_list: state.removed_doc_list } : {}),
    };
    taskPostData._id = state.files[0].entity_id;
    console.log('taskPostData123123123 first if', uploadedDocumentMetadata, documentDetails);
    console.log('taskReferenceDocuments', taskReferenceDocuments, documentDetails);
    taskPostData.task_reference_documents = taskReferenceDocuments;
    if (!jsUtils.isEmpty(uploadedDocumentMetadata)) taskPostData.document_details = documentDetails;
  }
  console.log('taskPostData123123123 first if check', cloneDeep(taskPostData));
  return taskPostData;
};

export const getSaveFormTaskMetadata = (state = {}) => {
  let local_state = state;
  if (!(local_state?.task_details?.task_metadata_uuid && local_state?.task_details?._id)) {
    local_state = store.getState().CreateTaskReducer;
  }
  return {
    task_metadata_uuid: local_state?.task_details?.task_metadata_uuid || null,
    task_metadata_id: local_state?.task_details?._id || null,
  };
};

export const getSaveFieldDetailsAPIData = (
  state,
  sectionIndex,
  fieldListIndex,
  fieldIndex,
) => getSaveFieldAPIData(state, sectionIndex, fieldListIndex, fieldIndex, () =>
  getSaveFormTaskMetadata(state));

export const getSaveTableDetailsAPIData = (
  state,
  sectionIndex,
  fieldListIndex,
) => getSaveTableApiData(state, sectionIndex, fieldListIndex, () =>
  getSaveFormTaskMetadata(state), false);

export const getTaskDetailsAPIData = (
  state,
  sectionIndex = null,
  fieldListIndex = null,
  fieldIndex = null,
  isFinalSubmission = false,
) =>
  getSaveFormAPIData(state, sectionIndex, fieldListIndex, fieldIndex, () =>
    getSaveFormTaskMetadata(state), false, false, isFinalSubmission);
export const getInitialTaskAssigneeSuggestionList = (list) =>
  list.map((eachItem) => {
    return { ...eachItem, is_user: !!eachItem.username };
  });

export const checkIfRuleAppliedProperly = (fieldData) => {
  if (fieldData.is_field_show_when_rule) {
    if (
      (isEmpty(fieldData.l_field) ||
        isEmpty(fieldData.operator) ||
        checkIfRValueNeeded(fieldData.operator)) &&
      isEmpty(fieldData.r_value)
    ) {
      showToastPopover(
        'Set rule or disable rule',
        EMPTY_STRING,
        FORM_POPOVER_STATUS.SERVER_ERROR,
        true,
      );
    }
    return false;
    // change tab only if rule conditions are satisfied
  }
  return true;
};
export default getFieldIndex;

export const PostFormFieldAndAutocompleteSuggestionAPI = (state) => {
  console.log('PostFormFieldAndAutocompleteSuggestionAPI', state);

  if (!(isEmpty(state.field_autocomplete_suggestion))) {
    const params = {
      text: state.TaskLabel,
      suggestions: state.field_autocomplete_suggestion,
      user_selection: state.field_autocomplete_suggested_lable,
    };

    postFieldAutocomplete(params)
      .then((res) => {
        console.log('postFieldAutocomplete', res);
      })
      .catch((err) => {
        console.log('postFieldAutocomplete', err);
      });
  }

  if ((!(isEmpty(state.suggested_field_type))) && state.initial_field_type) {
    const params = {
      label: state.TaskLabel,
      intial_field_type: state.initial_field_type,
      suggested_field_type: state.suggested_field_type,
      is_selected: state.isSuggestedTypeSelected,
    };

    postFieldTypeSuggestion(params)
      .then((res) => {
        console.log('postFieldTypeSuggestion', res);
      })
      .catch((err) => {
        console.log('postFieldTypeSuggestion', err);
      });
  }
};

export const postTaskAssigneeSuggestionAPI = (userId, state, selectedAssignees) => {
  console.log('postTaskAssigneeSuggestionAPI', userId, state);
  let selectedUsers = [];
  let selectedTeams = [];
  const AssigneeList = (selectedAssignees) || state.assignees;
  if ((!isEmpty(AssigneeList.users))) selectedUsers = AssigneeList.users.map((data) => data._id);
  if ((!isEmpty(AssigneeList.teams))) selectedTeams = AssigneeList.teams.map((data) => data._id);
  const selected = selectedUsers.concat(selectedTeams);
  if (!isEmpty(state.suggestedTaskAssignee && state.suggestedTaskAssignee.data && state.suggestedTaskAssignee.data.assignee_suggestion)) {
    const params = {
      user_id: userId,
      selected: selected,
      suggestions: (state.suggestedTaskAssignee && state.suggestedTaskAssignee.data && state.suggestedTaskAssignee.data.assignee_suggestion) ? state.suggestedTaskAssignee.data.assignee_suggestion : null,
    };

    postTaskAssigneeSuggestion(params)
      .then((res) => {
        console.log('postTaskAssigneeSuggestion', res);
      })
      .catch((err) => {
        console.log('postTaskAssigneeSuggestion', err);
      });
  }
};

export const postFieldSuggestionAPIThunk = (fieldSuggestionsData, user_selection, stepName) => {
  console.log('postFieldSuggestionAPI', fieldSuggestionsData, user_selection);
  if (!(jsUtils.isEmpty(fieldSuggestionsData.field_suggestions))) {
    const params = {
      suggestions: fieldSuggestionsData.field_suggestions,
      selected: user_selection,
      input_text: stepName,
    };
    postFieldSuggestionApi(params)
      .then((res) => {
        console.log('postTaskAssigneeSuggestion', res);
      })
      .catch((err) => {
        console.log('postTaskAssigneeSuggestion', err);
      });
  }
};

export const formatValidationMessages = (errorList = {}, sections = []) => {
  const formattedErrorList = cloneDeep(errorList);
  Object.keys(errorList).forEach((key) => {
    if (key.includes(REQUEST_SAVE_FORM.SECTIONS)) {
      const errorSectionIndex = key?.split(',')?.[1];
      const sectionData = sections[errorSectionIndex];
      if (sectionData) {
        if (key.includes(REQUEST_SAVE_FORM.SECTION_NAME)) {
          formattedErrorList[`${sectionData?.section_uuid},${REQUEST_SAVE_FORM.SECTION_NAME}`] = errorList[key];
        } else {
          formattedErrorList[sectionData?.section_uuid] = errorList[key];
        }
      }
    }
  });
  return formattedErrorList;
};

export const getTaskUserAndTeamIDs = (members) => {
  const modifiedMembers = {};
  if (!isEmpty(members?.users)) modifiedMembers.users = members.users.map((user) => user?._id) || [];
  if (!isEmpty(members?.teams)) modifiedMembers.teams = members.teams.map((team) => team?._id) || [];
  return modifiedMembers;
};
