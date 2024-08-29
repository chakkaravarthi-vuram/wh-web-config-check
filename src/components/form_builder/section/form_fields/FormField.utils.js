import { FIELD_LIST_TYPE, FIELD_TYPE } from 'utils/constants/form.constant';
import { store } from '../../../../Store';
import jsUtils, { isEmpty, get, formatter } from '../../../../utils/jsUtility';
import { COMMA, EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { FIELD_TYPES } from '../../FormBuilder.strings';
import { TASK_VALIDATION_STRINGS } from '../../../../containers/landing_page/LandingPage.strings';
import { MODULE_TYPES } from '../../../../utils/Constants';

export const formVisibilityCheck = (formVisibility, field_list = {}, field = {}) => {
   if (
       get(field_list, ['field_list_type'], null) === FIELD_LIST_TYPE.TABLE &&
       (!!(field_list.is_visible) === false) &&
       (!!jsUtils.get(formVisibility, ['visible_tables', field_list.table_uuid]) === false)
       ) return false;

  return !!jsUtils.get(formVisibility, ['visible_fields', field.field_uuid]);
};

export const formDisabilityCheck = (formVisibility, field_list = {}, field = {}, tableRowOrder = 0) => (
    get(field_list, ['field_list_type'], null) === FIELD_LIST_TYPE.TABLE &&
    (
      (
        (!!(field_list.is_visible) === false) &&
        (!!jsUtils.get(formVisibility, ['visible_tables', field_list.table_uuid]) === false)
      ) ||
      (!!jsUtils.get(formVisibility, ['visible_disable_fields', field_list.table_uuid, tableRowOrder, field.field_uuid]) === true)
    )
  );

export const getCurrencyValidationMessage = (id, errorMessage, fieldName, fieldValue) => {
  if (errorMessage.includes('number')) return 'Please enter a valid number';
  else if (errorMessage.includes('required') && id.includes('value')) return `${fieldName} is required`;
  else if (errorMessage.includes('required') && id.includes('currency_type')) return 'Currency type is required';
  else if (errorMessage.includes('must be one of')) {
    return `${fieldValue.currency_type} has been removed from allowed currency types. Please check
            with your System Administrator`;
  }
  return errorMessage;
};

export const getFileUploadInvalidTypeMessage = (fieldValue, validationData = {}) => {
  const allowedExtensions = jsUtils.get(store.getState().AccountConfigurationAdminReducer, ['allowed_extensions'], []);
  const invalidFileTypes = [];
  fieldValue && fieldValue.forEach((eachFile) => {
    if (!isEmpty(get(eachFile, ['file', 'type'], ' ')) &&
      !invalidFileTypes.includes(get(eachFile, ['file', 'type'], ' ')) &&
      (!allowedExtensions.includes(get(eachFile, ['file', 'type'], ' ')) ||
      !validationData?.allowed_extensions?.includes(get(eachFile, ['file', 'type'], ' ')))) {
        invalidFileTypes.push(get(eachFile, ['file', 'type'], ' '));
    }
  });
  return `${invalidFileTypes.toString()} ${invalidFileTypes.length === 1 ? 'has' : 'have'} been removed from allowed extensions. Please check
  with your System Administrator`;
};

export const getPhoneNumberValidationMessage = (error_list, field_uuid, field_name) => {
  let countryCodeError = ''; let
phoneNumberError = '';
  Object.keys(error_list).forEach((id) => {
    if (id.includes(field_uuid)) {
      if (error_list[id].includes('required') && id.includes('country_code')) countryCodeError = `Country code of ${field_name} is required`;
      else phoneNumberError = error_list[id];
    }
  });
  return phoneNumberError || countryCodeError;
};

export const getFieldErrorMessage = (
  isTable,
  stateData,
  sectionId,
  fieldListIndex,
  field_data,
  table_row_index,
  tableRowId,
  t,
) => {
  const pref_locale = localStorage.getItem('application_language');
  let currencyValueError = EMPTY_STRING;
  let fieldErrorMessage = null;
  let uniqueColumnError = EMPTY_STRING;
  const fileUploadError = EMPTY_STRING;
  let phoneFieldError = EMPTY_STRING;
  let isUniqueColumnError = null;
  const linkFieldError = {};
  if (!isEmpty(stateData.error_list)) {
    if (isTable && stateData.active_task_details) {
      const sectionData = stateData.active_task_details.form_metadata.sections[sectionId - 1];
      const field_list = sectionData.field_list[fieldListIndex];
      const tableUuid = field_list.table_uuid;
      if (Object.keys(stateData.error_list).includes(`${tableUuid}non_unique_indices`)) isUniqueColumnError = true;
      Object.keys(stateData.error_list).some((id) => {
        const splitedErrorMessage = id.split(COMMA);
        const currentTableUuid = jsUtils.get(splitedErrorMessage, [0]);
        const currentRowId = jsUtils.get(splitedErrorMessage, [1]);
        const currentFieldId = jsUtils.get(splitedErrorMessage, [2], null);
        if (
          currentTableUuid === tableUuid &&
          currentRowId === tableRowId &&
          currentFieldId === field_data.field_uuid
        ) {
           switch (field_data.field_type) {
             case FIELD_TYPES.CURRENCY:
                currencyValueError = getCurrencyValidationMessage(
                  id,
                  stateData.error_list[id],
                  field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name,
                  stateData[tableUuid][table_row_index][field_data.field_uuid],
                );
               return true;
             case FIELD_TYPES.FILE_UPLOAD:
                if (
                    stateData.error_list[id].includes('at least') ||
                    (stateData.error_list[id].includes('required') && !field_data.required)
                  ) {
                  fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} should have at least ${field_data.validations.minimum_count} document(s)`;
                  } else if (!stateData[tableUuid][table_row_index][field_data.field_uuid]) fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} ${TASK_VALIDATION_STRINGS(t).IS_REQUIRED}`;
                  else if (id.includes('size')) fieldErrorMessage = 'File size exceeded.Try other file.';
                  else if (id.includes('type')) fieldErrorMessage = getFileUploadInvalidTypeMessage(stateData[tableUuid][table_row_index][field_data.field_uuid], field_data.validations || {});
                  else if (
                          stateData.error_list[id].includes('at most') &&
                          field_data.validations.is_multiple &&
                          field_data.validations.maximum_count
                          ) {
                    fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} can have at most ${field_data.validations.maximum_count} document(s)`;
                  } else if (stateData.error_list[id].includes('at most')) {
                      fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} can have at most 1 document`;
                  } else if (stateData.error_list[id].includes('required')) {
                    fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} ${TASK_VALIDATION_STRINGS(t).IS_REQUIRED}`;
                  }
               return true;
             case FIELD_TYPES.LINK:
                const linkFieldErrorId = id.replace(`${currentTableUuid},${tableRowId},`, EMPTY_STRING);
                linkFieldError[linkFieldErrorId] = stateData.error_list[id];
              return true;
             case FIELD_TYPES.PHONE_NUMBER:
                if (!jsUtils.isEmpty(stateData.error_list)) {
                  phoneFieldError = getPhoneNumberValidationMessage(
                    stateData.error_list,
                    field_data.field_uuid,
                    field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name,
                  );
                  return true;
                }
               break;
             case FIELD_TYPES.CHECKBOX:
                if (stateData[tableUuid][table_row_index][field_data.field_uuid]) {
                  const selectedValues = stateData[tableUuid][table_row_index][field_data.field_uuid];
                  const deactivatedList = [];
                  selectedValues.forEach((value) => {
                    if (!field_data.values.includes(value)) deactivatedList.push(value);
                  });
                  if (!jsUtils.isEmpty(deactivatedList)) fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} contains deactivated values: ${deactivatedList}`;
                  else fieldErrorMessage = stateData.error_list[id];
                } else fieldErrorMessage = stateData.error_list[id];
                return true;
             case FIELD_TYPES.RADIO_GROUP:
             case FIELD_TYPES.DROPDOWN:
             case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
                if (stateData[tableUuid][table_row_index][field_data.field_uuid]) {
                  fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} contains deactivated value: ${stateData[tableUuid][table_row_index][field_data.field_uuid]}`;
                } else fieldErrorMessage = stateData.error_list[id];
               return true;
             default:
               fieldErrorMessage = stateData.error_list[id];
               return true;
           }
        } else if (
            isUniqueColumnError &&
            field_list.table_validations.is_unique_column_available &&
            field_list.table_validations.unique_column_uuid &&
            stateData.error_list[`${tableUuid}non_unique_indices`].includes(tableRowId)) {
                const uniqueColumnUuid = field_list.table_validations.unique_column_uuid;
                if (uniqueColumnUuid === field_data.field_uuid) uniqueColumnError = 'Must be unique';
            return true;
        }
        return false;
      });
    } else if (field_data.field_type === FIELD_TYPES.FILE_UPLOAD) {
      if (!jsUtils.isEmpty(stateData.error_list)) {
        Object.keys(stateData.error_list).forEach((id) => {
          if (id.includes(field_data.field_uuid)) {
            console.log('stateData.error_list[id]nontable', stateData.error_list[id], id);
            if (stateData.error_list[id].includes('at least') ||
                  (stateData.error_list[id].includes('required') &&
                    !field_data.required)) {
                fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} should have at least ${field_data.validations.minimum_count} document(s)`;
              } else if (!stateData[field_data.field_uuid]) fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} ${TASK_VALIDATION_STRINGS(t).IS_REQUIRED}`;
            else if (id.includes('size')) fieldErrorMessage = 'File size exceeded.Try other file.';
            else if (id.includes('type')) {
              fieldErrorMessage = getFileUploadInvalidTypeMessage(stateData[field_data.field_uuid], field_data.validations || {});
            } else if (stateData.error_list[id].includes('at most')
            && field_data.validations.is_multiple &&
            field_data.validations.maximum_count) {
              fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} can have at most ${field_data.validations.maximum_count} document(s)`;
            } else if (stateData.error_list[id].includes('at most')) {
              fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} can have at most 1 document`;
            } else if (stateData.error_list[id].includes('required')) {
              fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} ${TASK_VALIDATION_STRINGS(t).IS_REQUIRED}`;
            }
          }
        });
      }
    } else if (field_data.field_type === FIELD_TYPES.CURRENCY) {
      if (!jsUtils.isEmpty(stateData.error_list)) {
        Object.keys(stateData.error_list).forEach((id) => {
          if (id.includes(field_data.field_uuid)) {
            currencyValueError = getCurrencyValidationMessage(
              id,
              stateData.error_list[id],
              field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name,
              stateData[field_data.field_uuid],
            );
          }
        });
      }
    } else if (field_data.field_type === FIELD_TYPE.PHONE_NUMBER) {
      if (!jsUtils.isEmpty(stateData.error_list)) {
        phoneFieldError = getPhoneNumberValidationMessage(
          stateData.error_list,
          field_data.field_uuid,
          field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name,
        );
      }
    } else if (field_data.field_type === FIELD_TYPES.LINK) {
      if (!jsUtils.isEmpty(stateData.error_list)) {
        Object.keys(stateData.error_list).forEach((id) => {
          if (id.includes(field_data.field_uuid)) {
            linkFieldError[id] = stateData.error_list[id];
          }
        });
      }
    } else if (field_data.field_type === FIELD_TYPES.CHECKBOX) {
      if (!jsUtils.isEmpty(stateData.error_list)) {
        Object.keys(stateData.error_list).forEach((id) => {
          if (id.includes(field_data.field_uuid)) {
            if (stateData[field_data.field_uuid]) {
              const selectedValues = stateData[field_data.field_uuid];
                    const deactivatedList = [];
                    selectedValues.forEach((value) => {
                      if (!field_data.values.includes(value)) deactivatedList.push(value);
                    });
              if (!jsUtils.isEmpty(deactivatedList)) fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} contains deactivated values: ${deactivatedList}`;
                    else fieldErrorMessage = stateData.error_list[id];
            } else fieldErrorMessage = stateData.error_list[id];
          }
        });
      }
    } else if (
      (field_data.field_type === FIELD_TYPES.RADIO_GROUP) ||
      (field_data.field_type === FIELD_TYPES.DROPDOWN ||
      field_data.field_type === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN)
      ) {
      if (!jsUtils.isEmpty(stateData.error_list)) {
        Object.keys(stateData.error_list).forEach((id) => {
          if (id.includes(field_data.field_uuid)) {
            if (stateData[field_data.field_uuid]) {
              fieldErrorMessage = `${field_data?.translation_data?.[pref_locale]?.field_name || field_data.field_name} contains deactivated value: ${stateData[field_data.field_uuid]}`;
            } else fieldErrorMessage = stateData.error_list[id];
          }
        });
      }
    } else {
      fieldErrorMessage = stateData.error_list
      ? stateData.error_list[field_data.field_uuid]
      : EMPTY_STRING;
    }
    return {
      uniqueColumnError,
      fieldErrorMessage,
      currencyValueError,
      fileUploadError,
      linkFieldError,
      phoneFieldError,
    };
  }
  return {
    uniqueColumnError,
    fieldErrorMessage,
    currencyValueError,
    fileUploadError,
    linkFieldError,
  };
};

export const getTaskParentId = () => {
  const taskLogInfo =
    Object.keys(
      jsUtils.get(
        store.getState().TaskContentReducer,
        'active_task_details.task_log_info',
      ),
      {},
    ).length > 0
      ? jsUtils.get(
        store.getState().TaskContentReducer,
        'active_task_details.task_log_info',
      )
      : {
        data_list_id: jsUtils.get(
          store.getState().DataListReducer,
          'particularDataListDetails._id',
        ),
      };
  const id = {};
  const idKeys = ['task_metadata_id', 'flow_id', 'data_list_id'];
  taskLogInfo &&
    idKeys.some((eachKey) => {
      if (jsUtils.has(taskLogInfo, eachKey)) {
        id[eachKey] = taskLogInfo[eachKey];
        return true;
      }
      return false;
    });
  return id;
};
export const validateLocale = (value) => {
  // if (value === 'es-ES') {
  //   return false;
  // }
  if (formatter(1234567, value).includes('.')) {
    return false;
  }
  return true;
};
export const isValidationEnabled = (fieldData) => {
  if (jsUtils.has(fieldData, ['validations', 'allow_decimal']) ||
  jsUtils.has(fieldData, [
    'validations',
    'allow_negative_numbers',
  ])) {
    return true;
  } else {
    return false;
  }
};
export const formatEngine = (value, event, prevNumber, eachKeyStroke, accountLocale, setPrevCount, setPrevNumber, setPrevNum, field_data, prevCount, fieldValue, isCurrrencyField = false) => {
  if (value.replace(/[^0-9]/g, '').length <= 15) {
    // if (field_data.is_digit_formatted) {
      const valueWithoutFormat = event.target.value;
      const isCommaSeperationLocale = validateLocale(accountLocale);
      const commaCountForSet = isCommaSeperationLocale ? valueWithoutFormat.replace(/[0-9-.]/g, '').length : valueWithoutFormat.replace(/[0-9-,]/g, '').length;
      if (((prevNumber.replace(/[, ]+/g, '')).length - (value.replace(/[, ]+/g, '').length === 1)) && (prevCount - commaCountForSet) === 1) {
        if (eachKeyStroke === 'Backspace') {
        value = value.substring(0, event.target.selectionStart - 1) + value.substring(event.target.selectionStart, value.length);
        } else {
          value = value.substring(0, event.target.selectionStart) + value.substring(event.target.selectionStart + 1, value.length);
        }
      }
      if (
        (isValidationEnabled(field_data) || isCurrrencyField) &&
        isCommaSeperationLocale) {
       if (eachKeyStroke === '-') {
      if (event.target.selectionStart === 1 && !prevNumber.includes('-')) { value = value.replace(/[^0-9.-]/g, ''); } else {
        value = prevNumber;
        value = value.replace(/[^0-9.-]/g, '');
      }
       } else {
        value = value.replace(/[^0-9.-]/g, '');
}
      } else if ((isValidationEnabled(field_data) || isCurrrencyField) &&
       !isCommaSeperationLocale) {
        if (eachKeyStroke === '-') {
          if (event.target.selectionStart === 1 && !prevNumber.includes('-')) {
            value = value.replace(/[^0-9,-]/g, '');
            value = value.replace(/,/g, '.');
         } else {
            value = prevNumber;
          }
           } else {
            value = value.replace(/[^0-9,-]/g, '');
            value = value.replace(/,/g, '.');
}
       } else {
        if (eachKeyStroke === '-') {
          if (event.target.selectionStart === 1 && !prevNumber.includes('-')) { value = value.replace(/[^0-9.-]/g, ''); } else {
            value = prevNumber;
            value = value.replace(/[^0-9.-]/g, '');
          }
           } else {
            value = value.replace(/[,.]+/g, '');
    }
      }
      const tempFormated = formatter(value, accountLocale);
      const commaCount = isCommaSeperationLocale ? tempFormated.replace(/[0-9-.]/g, '').length : tempFormated.replace(/[0-9-,]/g, '').length;
      const cursorPoint = commaCount - prevCount;
      const previousposition = event.target.selectionStart;
      console.log('previousCursorPostion:', previousposition, 'PreviousCount:', prevCount, 'commaCountPresent:', commaCount, 'preNumberValue:', prevNumber, 'currentNumber:', event.target.value, 'tempFormated:', tempFormated);
      let selectionPositionValue;
      if (previousposition === 0) {
         selectionPositionValue = previousposition;
      } else {
        selectionPositionValue = previousposition + cursorPoint;
      }
      if (eachKeyStroke === '-') {
        if (event.target.selectionStart === 1 && !prevNumber.includes('-')) { setPrevNumber(tempFormated); } else {
          setPrevNumber(prevNumber);
        }
         } else {
          setPrevNumber(tempFormated);
}
       setPrevCount(commaCount);
       const element = event.target;

      window.requestAnimationFrame(() => {
        element.selectionStart = selectionPositionValue;
        element.selectionEnd = selectionPositionValue;
      });
    }
    return value;
};

export default formVisibilityCheck;

export const getFormParentId = (metaData, moduleType) => {
  let taskLogInfo = {};
  if (jsUtils.get(store.getState().CreateTaskReducer, 'task_details._id')) {
    taskLogInfo = { task_metadata_id: jsUtils.get(store.getState().CreateTaskReducer, 'task_details._id') };
  } else if (jsUtils.get(store.getState().EditFlowReducer, 'flowData.flow_id')) {
    taskLogInfo = { flow_id: jsUtils.get(store.getState().EditFlowReducer, 'flowData.flow_id') };
  } else if (jsUtils.get(store.getState().CreateDataListReducer, 'data_list_id')) {
    taskLogInfo = { data_list_id: jsUtils.get(store.getState().CreateDataListReducer, 'data_list_id') };
  } else if (moduleType === MODULE_TYPES.SUMMARY) {
    if (!jsUtils.isEmpty(metaData.dataListId)) {
      taskLogInfo.data_list_id = metaData.dataListId;
    } else if (!jsUtils.isEmpty(metaData.flowId)) {
      taskLogInfo.flow_id = metaData.flowId;
    }
  }
  const id = {};
  const idKeys = ['task_metadata_id', 'flow_id', 'data_list_id'];
  taskLogInfo &&
    idKeys.some((eachKey) => {
      if (jsUtils.has(taskLogInfo, eachKey)) {
        id[eachKey] = taskLogInfo[eachKey];
        return true;
      }
      return false;
    });
  return id;
};
