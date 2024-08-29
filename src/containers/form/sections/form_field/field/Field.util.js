import { store } from '../../../../../Store';
import { validateLocale } from '../../../../../components/form_builder/section/form_fields/FormField.utils';
import { MODULE_TYPES } from '../../../../../utils/Constants';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../utils/constants/form/form.constant';
import { formatter, get, isBoolean, isEmpty, isNaN, isNull, isNumber, isUndefined } from '../../../../../utils/jsUtility';
import { DOCUMENT_TYPES, EMPTY_STRING, ENTITY } from '../../../../../utils/strings/CommonStrings';
import { FORM_TYPE } from '../../../Form.string';
import { FIELD_TYPES } from '../../field_configuration/FieldConfiguration.strings';
import { DAY_LIST } from '../../field_configuration/validation_and_visibility_configuration/validation_configuration/date_field_validation_configuration/DateFieldValidationConfiguration.utils';
import { SELECT_ALL_OPTION } from '../FormField.string';

export const TASK_CATEGORY_FLOW_TASK = 1;
export const TASK_CATEGORY_ADHOC_TASK = 2;
export const TASK_CATEGORY_DATALIST_ADHOC_TASK = 3;
export const TASK_CATEGORY_FLOW_ADHOC_TASK = 4;

export const getSelectionOptions = (list) => {
  if (Array.isArray(list) && isEmpty(list)) return [];

  const optionList = list.map((data) => {
    return {
      label: data,
      value: data,
    };
  });

  return optionList;
};

export const getCheckboxOptions = (list, selectedValues = [], isDisabled = false, allowSelectAll = false) => {
  if (!Array.isArray(list) || isEmpty(list)) return [];

  const optionList = list?.map((data) => {
    return {
      ...data,
      ...(isDisabled ? { disabled: true } : {}),
      selected: selectedValues?.some?.((v) => v === data.value),
    };
  });

  if ((list.length > 1) && allowSelectAll) {
    optionList.unshift({
      ...SELECT_ALL_OPTION,
      ...(isDisabled ? { disabled: true } : {}),
      selected: list.length === selectedValues?.length,
    });
  }

  return optionList;
};

export const getServerError = (errorList, key) => {
  let errorMessage = EMPTY_STRING;
  Object.keys(errorList)?.forEach((eachKey) => {
    if (eachKey.includes(key)) {
      errorMessage = errorList[eachKey];
    } else errorMessage = EMPTY_STRING;
  });
  return errorMessage;
};

export const getValidationMessage = (validationMessage, field, key = '', formType = FORM_TYPE.CREATION_FORM) => {
  // key is needed for table fields
  const fieldType = field?.[RESPONSE_FIELD_KEYS.FIELD_TYPE];
  const fieldUUID = key || field?.[RESPONSE_FIELD_KEYS.FIELD_UUID];

  if (fieldType === FIELD_TYPES.TABLE) {
    return validationMessage || {};
  }

  if (validationMessage?.[fieldUUID] && fieldType !== FIELD_TYPES.LINK) {
    return validationMessage[fieldUUID];
  }

  let validation = '';
  const errorKeys = Object.keys(validationMessage || {}).filter((k) => k.startsWith(fieldUUID));

  switch (fieldType) {
    case FIELD_TYPES.FILE_UPLOAD:
   case FIELD_TYPES.PHONE_NUMBER:
   case FIELD_TYPES.CURRENCY: {
    errorKeys.forEach((key) => {
      const message = validationMessage[key];
      if (key.startsWith(fieldUUID)) {
        validation = message;
      }
    });
    break;
   }

   case FIELD_TYPES.LINK: {
    if (errorKeys.length === 1 && !errorKeys[0].includes(',')) {
      return [{ link_text: validationMessage[fieldUUID] }];
    }
    const error = [];

    errorKeys.forEach((key) => {
      const errorParts = key.split(',');
      if (errorParts?.length === 5) {
        error[Number(errorParts[3])] = { ...error[Number(errorParts[3])], [errorParts[4]]: validationMessage[key] };
      } else {
        if (errorParts[2] === 'link_text' || errorParts[2] === 'link_url') {
          error[Number(errorParts[1])] = { ...error[Number(errorParts[1])], [errorParts[2]]: validationMessage[key] };
        } else {
          error[0] = { link_text: validationMessage[key] };
        }
      }
    });
    validation = error;
    break;
   }
   default:
    if (formType === FORM_TYPE.CREATION_FORM) validation = getServerError(validationMessage || {}, fieldUUID);
    else return null;
  }

  return validation;
};

export const getFieldValues = (fieldDetails) => {
  console.log('mix', fieldDetails);
  switch (fieldDetails?.fieldType) {
    case FIELD_TYPES.DROPDOWN:
      return fieldDetails?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES];
    case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
      return fieldDetails?.[RESPONSE_FIELD_KEYS.CHOICE_VALUES]?.map((choice) => {
        return {
          label: choice.toString(),
          value: choice,
        };
      });
    default: return [];
  }
};

export const getContextType = (metadata = {}, moduleType) => {
    if ((metadata?.flowId || moduleType === MODULE_TYPES.FLOW) && metadata?.taskCategory === TASK_CATEGORY_FLOW_TASK) {
      return ENTITY.FLOW_METADATA;
    } else if (metadata?.dataListId || moduleType === MODULE_TYPES.DATA_LIST) {
      return ENTITY.DATA_LIST;
    } else return ENTITY.TASK_METADATA;
};

export const getEntity = (metadata = {}) => {
    if (metadata?.dataListId) {
      return ENTITY.DATA_LIST_ENTRY;
    } else return ENTITY.INSTANCES;
};

export const getFileDocumentTYpe = (metadata = {}) => {
  if (metadata?.dataListId) return DOCUMENT_TYPES.LIST_DOCUMENTS;
  else return DOCUMENT_TYPES.FORM_DOCUMENTS;
};

export const getDeactivatedChoiceValue = (optionsList = [], selectedValues = []) => {
 const deactivatedValues = [];
 const optionListValue = Array.isArray(optionsList) ? optionsList.map((eachOption) => eachOption.value) : [];
 if (!Array.isArray(selectedValues)) return deactivatedValues;

 selectedValues.forEach((eachSelectedValue) => {
   if (!optionListValue.includes(eachSelectedValue)) {
    deactivatedValues.push(eachSelectedValue);
  }
 });
 return deactivatedValues;
};

export const constructValue = (value, prevnum, is_digit_formatted, accountLocale) => {
  if (!is_digit_formatted) {
    return value;
  }
  if (!isNull(value) && !isUndefined(value)) {
    value = value.toString().replace(/,/g, '');
    if (validateLocale(accountLocale)) {
      if (value.charAt(value.length - 1) === '.') {
        if (prevnum && prevnum.length <= value.length) {
          value = `${formatter(value.replace('.', ''), accountLocale)}.`;
        } else {
          value = formatter(value.replace('.', ''), accountLocale);
        }
      }
    } else {
      if (value.charAt(value.length - 1) === '.') {
        if (prevnum && prevnum.length <= value.length) {
          value = `${formatter(value.toString().replace('.', ''), accountLocale)},`;
        } else {
          value = formatter(value.toString().replace('.', ''), accountLocale);
        }
      }
    }
    return value;
  }
  return null;
};

export const constructDecimalZeroValue = (value, locale) => {
  let tempValue;
  const numarr = value && value.toString().split('.');
  if (value && value.toString().includes('.')) {
    tempValue = `${formatter(numarr[0].toString().replace(/,/g, ''), locale)}.${numarr[1]}`;
  } else {
    tempValue = formatter(value.toString().replace(/,/g, ''), locale);
  }
  return tempValue;
};

export const areDateTimeStringsEqual = (dateTimeString1, dateTimeString2) => {
  // Parse the date-time strings into Date objects
  const date1 = new Date(dateTimeString1);
  const date2 = new Date(dateTimeString2);

  if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      return false;
  }
  return dateTimeString2 === dateTimeString1?.slice(0, -5);
};

export const getDatalistValidateParamData = (fieldData, formData, options = {}) => {
  const { VALUE_TYPE, FIELD } = RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST];
  const { FIELD_UUID, VALIDATIONS } = RESPONSE_FIELD_KEYS;
  const filterFields = fieldData?.[VALIDATIONS]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].FILTER_FIELDS];
  const { tableUUID, rowIndex, rowId } = options;

  const filterFieldsData = {};
  const entryIds = [];
  if (!isEmpty(filterFields)) {
    filterFields.forEach((validField) => {
      if (validField?.[VALUE_TYPE] === FIELD) {
        if (isBoolean(formData?.[validField?.[FIELD]]) || !isEmpty(formData?.[validField?.[FIELD]]) || isNumber(formData?.[validField?.[FIELD]])) {
          filterFieldsData[validField?.[FIELD]] = formData?.[validField?.[FIELD]];
          if (formData?.[fieldData?.[FIELD_UUID]]) {
            const datalistData = formData?.[fieldData?.[FIELD_UUID]];
            if (!entryIds.includes(datalistData)) datalistData.forEach(({ value }) => entryIds.push(value));
          }
        }

        Object.keys(formData).forEach((fieldKey) => {
          if (Array.isArray(formData?.[fieldKey])) {
            const inOperatorArrayValue = [];
            formData?.[fieldKey]?.forEach((fieldDataValue, index) => {
              if ((tableUUID && rowIndex === index) || (!tableUUID)) {
                const data = (tableUUID) && get(formData, [fieldKey, index, fieldData?.[FIELD_UUID]], null);
                if (!isEmpty(data)) {
                  const datalistData = data[0];
                  if (!entryIds.includes(datalistData)) entryIds.push(datalistData.value);
                }
                if (isBoolean(fieldDataValue[validField[FIELD]]) || !isEmpty(fieldDataValue[validField[FIELD]]) || isNumber(fieldDataValue[validField[FIELD]])) {
                  if (validField.operator === 'in') {
                    inOperatorArrayValue.push(fieldDataValue[validField[FIELD]]);
                    filterFieldsData[validField[FIELD]] = inOperatorArrayValue;
                  } else {
                    filterFieldsData[validField[FIELD]] = fieldDataValue[validField[FIELD]];
                  }
                }
              }
            });
          }
        });
      }
    });
  }
  if (tableUUID && rowId) filterFieldsData.row_id = rowId;
  return {
    filterFieldsData, entryIds,
  };
};

export const getWorkingDays = (fieldData, t) => {
  const { working_days } = store.getState().LanguageAndCalendarAdminReducer;
  let workingDays = [1, 2, 3, 4, 5, 6, 7];
  const { allow_working_day = false, allow_non_working_day = false, allowed_day = [] } = fieldData?.originalValidationData || {};
  if (allow_working_day) workingDays = working_days;
  if (allow_non_working_day) {
    if (working_days?.length === DAY_LIST(t)?.length) workingDays = [];
    else {
      workingDays = [];
      DAY_LIST(t).map((day) => {
        if (!working_days.includes(day.VALUE)) {
          workingDays.push(day.VALUE);
        }
        return null;
      });
    }
  }
  if (!isEmpty(allowed_day)) workingDays = allowed_day;

  return workingDays;
};
