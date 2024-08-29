import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import formSchema from '../../../validation/form/form.validation.schema';
import jsUtils from '../../../utils/jsUtility';

export const checkToSaveFormIfNotSavedFlow = (activeStep, flowData, fieldData, sectionId) => {
  if (
    flowData.flow_id
    && !jsUtils.isEmpty(activeStep)
    && (jsUtils.isEmpty(flowData.form_details)
      || !flowData.form_details.sections[sectionId - 1]
      || !jsUtils.find(flowData.form_details.sections[sectionId - 1].fields, {
        field_uuid: fieldData.field_uuid,
      }))
  ) return true;
  return false;
};

export const rangeContainsZero = (start = -Infinity, end = Infinity) => {
  if (start === -Infinity && end === Infinity) {
    return true;
  } else if (start <= 0 && end >= 0) {
    return true;
  } else {
    return false;
  }
};

export const checkToSaveFormIfNotSavedDataList = (dataListData, fieldData, sectionId) => {
  if (!jsUtils.isEmpty(dataListData.data_list_id)
    && (jsUtils.isEmpty(dataListData.form_details)
      || !dataListData.form_details.sections[sectionId - 1]
      || !jsUtils.find(dataListData.form_details.sections[sectionId - 1].fields, {
        field_uuid: fieldData.field_uuid,
      }))) return true;
  return false;
};

export const checkToSaveFormIfNotSavedTask = (taskData, fieldData, sectionId) => {
  console.log('bbb', taskData);
  if ((taskData.task_details && !jsUtils.isEmpty(taskData.task_details._id))
    && (jsUtils.isEmpty(taskData.form_details)
      || !taskData.form_details.sections[sectionId - 1]
      || !jsUtils.find(taskData.form_details.sections[sectionId - 1].fields, {
        field_uuid: fieldData.field_uuid,
      }))) return true;
  return false;
};

export const getFormDetailValidationSchema = () => formSchema.formDetailsValidateSchema;
const getDateValidationSubTypeValues = (dateValidationSelected, startDayError, endDayError, componentId, isFuture) => {
  const data = {};
  if (dateValidationSelected.sub_type) {
    switch (dateValidationSelected.sub_type) {
      case componentId.ALLOW_FUTURE_NEXT.VALUE:
        data[componentId.ALLOW_FUTURE_NEXT.INPUT_ID] = dateValidationSelected.start_day;
        data[`${componentId.ALLOW_FUTURE_NEXT.INPUT_ID}Error`] = startDayError ? 'Number of days is required' : EMPTY_STRING;
        break;
      case componentId.ALLOW_FUTURE_AFTER.VALUE:
        data[componentId.ALLOW_FUTURE_AFTER.INPUT_ID] = dateValidationSelected.start_day;
        data[`${componentId.ALLOW_FUTURE_AFTER.INPUT_ID}Error`] = startDayError ? 'Number of days is required' : EMPTY_STRING;
        break;
      case componentId.ALLOW_FUTURE_BETWEEN.VALUE:
        if (isFuture) {
          data[componentId.ALLOW_FUTURE_BETWEEN.INPUT_ID_1] = dateValidationSelected.start_day;
          data[componentId.ALLOW_FUTURE_BETWEEN.INPUT_ID_2] = dateValidationSelected.end_day;
          data[`${componentId.ALLOW_FUTURE_BETWEEN.INPUT_ID_1}Error`] = startDayError ? (startDayError.includes('must be a safe number') ? 'Invalid start day' : 'Start day is required') : EMPTY_STRING;
          data[`${componentId.ALLOW_FUTURE_BETWEEN.INPUT_ID_2}Error`] = endDayError ? (
            endDayError.includes('ref') ? 'End day should be greater than start day' :
            endDayError.includes('must be a safe number') ? 'Invalid end day' : 'End day is required'
           ) : EMPTY_STRING;
        } else {
          data[componentId.ALLOW_PAST_BETWEEN.INPUT_ID_1] = dateValidationSelected.start_day;
          data[componentId.ALLOW_PAST_BETWEEN.INPUT_ID_2] = dateValidationSelected.end_day;
          data[`${componentId.ALLOW_PAST_BETWEEN.INPUT_ID_1}Error`] = startDayError ? (startDayError.includes('must be a safe number') ? 'Invalid start day' : 'Start day is required') : EMPTY_STRING;
          data[`${componentId.ALLOW_PAST_BETWEEN.INPUT_ID_2}Error`] = endDayError ? (
            endDayError.includes('ref') ? 'End day should be greater than start day' :
            endDayError.includes('must be a safe number') ? 'Invalid end day' : 'End day is required'
           ) : EMPTY_STRING;
        }
        break;
      case componentId.ALLOW_PAST_LAST.VALUE:
        data[componentId.ALLOW_PAST_LAST.INPUT_ID] = dateValidationSelected.start_day;
        data[`${componentId.ALLOW_PAST_LAST.INPUT_ID}Error`] = startDayError ? 'Number of days is required' : EMPTY_STRING;
        break;
      case componentId.ALLOW_PAST_BEFORE.VALUE:
        data[componentId.ALLOW_PAST_BEFORE.INPUT_ID] = dateValidationSelected.start_day;
        data[`${componentId.ALLOW_PAST_BEFORE.INPUT_ID}Error`] = startDayError ? 'Number of days is required' : EMPTY_STRING;
        break;
      default:
        break;
    }
  }
  return data;
};
export const getDateValidationData = ({ dateValidationArray, startDayError, endDayError, componentId, startDateError, endDateError, externalFieldsDropdownData, firstFieldError, secondFieldError }) => {
  const dateValidationData = {
    [componentId.NO_LIMITS.ID]: false,
    [componentId.ALLOW_FUTURE.ID]: false,
    [componentId.ALLOW_PAST.ID]: false,
    [componentId.ALLOW_ONLY_TODAY.ID]: false,
    [componentId.ALLOW_FIXED_RANGE.ID]: false,
    [componentId.ALLOW_DATE_FIELDS.ID]: false,
    type: null,
  };
  let additionalData = {};
  if (!jsUtils.isEmpty(dateValidationArray)) {
    const dateValidationSelected = dateValidationArray[0];
    dateValidationData.type = dateValidationSelected.type;
    dateValidationData.sub_type = dateValidationSelected.sub_type;

    switch (dateValidationSelected.type) {
      case componentId.NO_LIMITS.VALUE:
        dateValidationData[componentId.NO_LIMITS.ID] = true;
        break;
      case componentId.ALLOW_FUTURE.VALUE:
        additionalData = getDateValidationSubTypeValues(dateValidationSelected, startDayError, endDayError, componentId, true);
        dateValidationData[componentId.ALLOW_FUTURE.ID] = true;
        break;
      case componentId.ALLOW_PAST.VALUE:
        additionalData = getDateValidationSubTypeValues(dateValidationSelected, startDayError, endDayError, componentId, false);
        dateValidationData[componentId.ALLOW_PAST.ID] = true;
        break;
      case componentId.ALLOW_ONLY_TODAY.VALUE:
        dateValidationData[componentId.ALLOW_ONLY_TODAY.ID] = true;
        break;
      case componentId.ALLOW_DATE_FIELDS.VALUE:
        dateValidationData[componentId.ALLOW_DATE_FIELDS.ID] = true;
        let firstField = {};
        let secondField = {};
        if (dateValidationSelected.first_field_uuid || dateValidationSelected.second_field_uuid) {
          if (externalFieldsDropdownData && externalFieldsDropdownData.pagination_data) {
            if (dateValidationSelected.first_field_uuid) {
              const firstFieldIndex = externalFieldsDropdownData.pagination_data.findIndex((data) => (data.field_uuid === dateValidationSelected.first_field_uuid));
              if (firstFieldIndex > -1) firstField = externalFieldsDropdownData.pagination_data[firstFieldIndex];
            }
            if (dateValidationSelected.second_field_uuid) {
              const secondFieldIndex = externalFieldsDropdownData.pagination_data.findIndex((data) => (data.field_uuid === dateValidationSelected.second_field_uuid));
              if (secondFieldIndex > -1) secondField = externalFieldsDropdownData.pagination_data[secondFieldIndex];
            }
          }
        }
        additionalData = {
          operator: dateValidationSelected.operator,
          firstField,
          secondField,
        };
        if (dateValidationSelected.operator === 'between') {
          if (firstFieldError) additionalData.firstFieldError = 'Start Date is required';
          if (secondFieldError) {
            if (!firstFieldError && dateValidationSelected.second_field_uuid) additionalData.secondFieldError = 'Start Date and End Date should be different';
            else additionalData.secondFieldError = 'End Date is required';
          }
        } else if (firstFieldError) {
          additionalData.firstFieldError = 'Date is required';
        }
        break;
      case componentId.ALLOW_FIXED_RANGE.VALUE:
        dateValidationData[componentId.ALLOW_FIXED_RANGE.ID] = true;
        additionalData = {
          start_date: dateValidationSelected.start_date,
          end_date: dateValidationSelected.end_date,
          startDateError,
          endDateError,
        };
        if (
          (dateValidationData.sub_type === 'between') &&
          !jsUtils.isEmpty(startDateError) && !jsUtils.isEmpty(endDateError)
        ) {
          if (!startDateError.includes('valid')) additionalData.startDateError = EMPTY_STRING;
        }
        break;
      default:
        break;
    }
  }
  return {
    ...dateValidationData,
    ...additionalData,
  };
};

export default checkToSaveFormIfNotSavedFlow;
