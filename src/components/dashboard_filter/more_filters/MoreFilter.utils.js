import jsUtils from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { FIELD_TYPE } from 'utils/constants/form_fields.constant';
import FILTER_STRINGS, {
  FILTER_TYPES,
  SINGLE_INPUT_DATE_FIELD,
  SINGLE_INPUT_NUMBER_FIELD,
} from '../Filter.strings';
import {
  dateRangeValidation,
  numberRangeValidation,
} from '../filter_form_builder/FilterFormBuilder.utils';
import { getSelectedUserTeamPickerDataForFilter } from '../FilterUtils';

export const validateFilterValues = (inputFieldDetailsForFilter, t) => {
  const errorArray = [];
  const updatedFilterFlowData = [];
  if (!jsUtils.isEmpty(inputFieldDetailsForFilter)) {
    inputFieldDetailsForFilter.forEach((data) => {
      const clonedData = jsUtils.cloneDeep(data);
      if (
        (data.fieldType === FIELD_TYPE.DATE ||
          data.fieldType === FIELD_TYPE.DATETIME) &&
        data.selectedOperator === FILTER_TYPES.DATE.DATE_IN_RANGE
      ) {
        const {
          fieldUpdateBetweenOneError = EMPTY_STRING,
          fieldUpdateBetweenTwoError = EMPTY_STRING,
        } = dateRangeValidation(
          data.fieldUpdateBetweenOne,
          data.fieldUpdateBetweenTwo,
          t,
        );
        clonedData.error = [
          fieldUpdateBetweenOneError,
          fieldUpdateBetweenTwoError,
        ];

        if (
          !jsUtils.isEmpty(fieldUpdateBetweenOneError) ||
          !jsUtils.isEmpty(fieldUpdateBetweenTwoError)
        ) {
          const error = {
            fieldUpdateBetweenOneError,
            fieldUpdateBetweenTwoError,
          };
          errorArray.push(error);
        }
      } else if (
        (data.fieldType === FIELD_TYPE.NUMBER ||
          data.fieldType === FIELD_TYPE.CURRENCY) &&
        data.selectedOperator === FILTER_TYPES.NUMBER.BETWEEN
      ) {
        const {
          fieldUpdateBetweenOneError = EMPTY_STRING,
          fieldUpdateBetweenTwoError = EMPTY_STRING,
        } = numberRangeValidation(
          data.fieldUpdateBetweenOne,
          data.fieldUpdateBetweenTwo,
          t,
        );
        clonedData.error = [
          fieldUpdateBetweenOneError,
          fieldUpdateBetweenTwoError,
        ];

        if (
          !jsUtils.isEmpty(fieldUpdateBetweenOneError) ||
          !jsUtils.isEmpty(fieldUpdateBetweenTwoError)
        ) {
          const error = {
            fieldUpdateBetweenOneError,
            fieldUpdateBetweenTwoError,
          };
          errorArray.push(error);
        }
      }
      updatedFilterFlowData.push(clonedData);
    });
  }
  return {
    updatedFilterFlowData,
    isValid: jsUtils.isArray(errorArray) && errorArray.length === 0,
  };
};

const handleFilterValidateForTextField = (returnData, fieldUpdateValue) => {
  if (
    !fieldUpdateValue ||
    (fieldUpdateValue &&
      jsUtils.isArray(fieldUpdateValue) &&
      (fieldUpdateValue.length === 0 || fieldUpdateValue[0].length === 0))
  ) {
    returnData.isValid = false;
  }
};

const handleFilterValidateForNumberField = (
  returnData,
  selectedOperator,
  fieldUpdateValue,
  fieldUpdateBetweenOne,
  fieldUpdateBetweenTwo,
  t,
) => {
  if (
    SINGLE_INPUT_NUMBER_FIELD.includes(selectedOperator) &&
    (!fieldUpdateValue ||
      (fieldUpdateValue &&
        jsUtils.isArray(fieldUpdateValue) &&
        (fieldUpdateValue.length === 0 || fieldUpdateValue[0].length === 0)))
  ) {
    returnData.isValid = false;
  } else if (selectedOperator === FILTER_TYPES.NUMBER.BETWEEN) {
    const {
      fieldUpdateBetweenOneError = EMPTY_STRING,
      fieldUpdateBetweenTwoError = EMPTY_STRING,
    } = numberRangeValidation(fieldUpdateBetweenOne, fieldUpdateBetweenTwo, t);
    if (
      !jsUtils.isEmpty(fieldUpdateBetweenOneError) ||
      !jsUtils.isEmpty(fieldUpdateBetweenTwoError)
    ) {
      returnData.isValid = false;
      returnData.message = [
        fieldUpdateBetweenOneError,
        fieldUpdateBetweenTwoError,
      ];
    }
  }
};

const handleFilterValidateForDateTimeField = (
  returnData,
  selectedOperator,
  fieldUpdateBetweenOne,
  fieldUpdateBetweenTwo,
  t,
) => {
  if (
    SINGLE_INPUT_DATE_FIELD.includes(selectedOperator) &&
    jsUtils.isEmpty(fieldUpdateBetweenOne)
  ) {
    returnData.isValid = false;
  } else if (selectedOperator === FILTER_TYPES.DATE.DATE_IN_RANGE) {
    const {
      fieldUpdateBetweenOneError = EMPTY_STRING,
      fieldUpdateBetweenTwoError = EMPTY_STRING,
    } = dateRangeValidation(fieldUpdateBetweenOne, fieldUpdateBetweenTwo, t);
    if (
      !jsUtils.isEmpty(fieldUpdateBetweenOneError) ||
      !jsUtils.isEmpty(fieldUpdateBetweenTwoError)
    ) {
      returnData.isValid = false;
      returnData.message = [
        fieldUpdateBetweenOneError,
        fieldUpdateBetweenTwoError,
      ];
    }
  }
};

const handleFilterValidateForMultiCheckField = (
  returnData,
  fieldUpdateValue,
  t,
) => {
  if (
    !fieldUpdateValue ||
    (fieldUpdateValue &&
      jsUtils.isArray(fieldUpdateValue) &&
      fieldUpdateValue.length === 0)
  ) {
    returnData.isValid = false;
    returnData.message = FILTER_STRINGS(t).ERROR_MESSAGES.AT_LEAST_ONE_OPTION;
  }
};

const handleFilterValidateForUserTeamField = (
  returnData,
  fieldUpdateValue,
  is_logged_in_user,
  t,
) => {
  if (!is_logged_in_user) {
    if (jsUtils.isObject(fieldUpdateValue)) {
      const arrUserTeamPicker =
        getSelectedUserTeamPickerDataForFilter(fieldUpdateValue);
      if (arrUserTeamPicker && arrUserTeamPicker.length === 0) {
        returnData.isValid = false;
        returnData.message =
          FILTER_STRINGS(t).ERROR_MESSAGES.AT_LEAST_ONE_OPTION;
      }
    } else {
      returnData.isValid = false;
      returnData.message = FILTER_STRINGS(t).ERROR_MESSAGES.AT_LEAST_ONE_OPTION;
    }
  }
};

export const validateCurrentFilter = (field, inputFieldDetailsForFilter, t) => {
  const returnData = {
    isValid: true,
    message: FILTER_STRINGS(t).ERROR_MESSAGES.FIELD_REQUIRED,
  };

  const filter = inputFieldDetailsForFilter.find(
    (data) =>
      data.fieldNames === field.fieldNames &&
      data.dimension === field.dimension &&
      data.field_uuid === field.field_uuid,
  );
  if (!jsUtils.isEmpty(filter) && jsUtils.isObject(filter)) {
    const {
      fieldUpdateValue,
      fieldUpdateBetweenOne,
      fieldUpdateBetweenTwo,
      fieldType,
      selectedOperator,
      is_logged_in_user,
    } = filter;

    switch (fieldType) {
      case FIELD_TYPE.SINGLE_LINE:
      case FIELD_TYPE.SCANNER:
      case FIELD_TYPE.INFORMATION:
      case FIELD_TYPE.EMAIL:
      case FIELD_TYPE.PHONE_NUMBER:
      case FIELD_TYPE.PARAGRAPH:
      case FIELD_TYPE.LINK:
        handleFilterValidateForTextField(returnData, fieldUpdateValue);
        break;
      case FIELD_TYPE.NUMBER:
      case FIELD_TYPE.CURRENCY: {
        handleFilterValidateForNumberField(
          returnData,
          selectedOperator,
          fieldUpdateValue,
          fieldUpdateBetweenOne,
          fieldUpdateBetweenTwo,
          t,
        );
        break;
      }
      case FIELD_TYPE.DATE:
      case FIELD_TYPE.DATETIME: {
        handleFilterValidateForDateTimeField(
          returnData,
          selectedOperator,
          fieldUpdateBetweenOne,
          fieldUpdateBetweenTwo,
          t,
        );
        break;
      }
      case FIELD_TYPE.DROPDOWN:
      case FIELD_TYPE.CHECKBOX:
      case FIELD_TYPE.YES_NO:
      case FIELD_TYPE.RADIO_GROUP:
      case FIELD_TYPE.RADIO_BUTTON:
      case FIELD_TYPE.LOOK_UP_DROPDOWN:
      case FIELD_TYPE.DATA_LIST:
        handleFilterValidateForMultiCheckField(returnData, fieldUpdateValue, t);
        break;
      case FIELD_TYPE.USER_TEAM_PICKER: {
        handleFilterValidateForUserTeamField(
          returnData,
          fieldUpdateValue,
          is_logged_in_user,
          t,
        );
        break;
      }
      default:
        break;
    }
  }

  if (returnData.isValid) returnData.message = EMPTY_STRING;
  return [returnData.isValid, returnData.message];
};
