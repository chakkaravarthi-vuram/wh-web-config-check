import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../../utils/constants/form/form.constant';
import { cloneDeep, has, isEmpty, translateFunction, isNull } from '../../../../../../utils/jsUtility';
import { getSplittedUsersAndTeamsIdObjFromArray } from '../../../../../../utils/UtilityFunctions';
import { FIELD_TYPES } from '../../FieldConfiguration.strings';
import { NON_VALIDATION_FIELDS } from '../../basic_configuration/BasicConfiguration.utils';
import { VALIDATION_CONFIG_STRINGS } from './ValidationConfiguration.strings';

export const getTextFielsValidationData = (validationData) => {
  return {
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MINIMUM_CHARACTERS]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MINIMUM_CHARACTERS],
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MAXIMUM_CHARACTERS]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].MAXIMUM_CHARACTERS],
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOWED_SPECIAL_CHARACTERS]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOWED_SPECIAL_CHARACTERS],
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOW_SPECIAL_CHARACTERS]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.SINGLE_LINE].ALLOW_SPECIAL_CHARACTERS],
  };
};

export const getNumberFieldValidationData = (validationData, allowDecimal) => {
  return {
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_MINIMUM]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_MINIMUM],
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_MAXIMUM]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_MAXIMUM],
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].DONT_ALLOW_ZERO]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].DONT_ALLOW_ZERO],
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOW_DECIMAL]: allowDecimal,
    ...(allowDecimal) ? {
      [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_DECIMAL_POINTS]:
      validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.NUMBER].ALLOWED_DECIMAL_POINTS],
    } : null,
  };
};

export const getLinkFieldValidationData = (validationData, allowMultiple) => {
  return {
    ...(allowMultiple) && {
      ...(!isNull(validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MINIMUM_COUNT]) ? { [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MINIMUM_COUNT]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MINIMUM_COUNT] } : null),
      ...(!isNull(validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MAXIMUM_COUNT]) ? { [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MAXIMUM_COUNT]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].MAXIMUM_COUNT] } : null),
    },
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.LINK].IS_MULTIPLE]: allowMultiple,
  };
};

export const getFileUploadFieldValidationData = (validationData, allowMultiple) => {
  return {
    ...(allowMultiple) && {
      ...(!isNull(validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MINIMUM_COUNT]) ? { [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MINIMUM_COUNT]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MINIMUM_COUNT] } : null),
      ...(!isNull(validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_COUNT]) ? { [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_COUNT]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_COUNT] } : null),
    },
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].IS_MULTIPLE]: allowMultiple,
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_FILE_SIZE]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].MAXIMUM_FILE_SIZE],
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].ALLOWED_EXTENSIONS]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].ALLOWED_EXTENSIONS],
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].SYSTEM_MAX_FILE_SIZE]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.FILE_UPLOAD].SYSTEM_MAX_FILE_SIZE],
  };
};

export const getCurrencyFieldValidationData = (validationData) => {
  return {
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.CURRENCY].ALLOWED_CURRENCY_TYPES]: validationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.CURRENCY].ALLOWED_CURRENCY_TYPES],
  };
};

export const getUserSelectorFieldValidationData = (validationData, allowMultiple, t = translateFunction) => {
  const constructedValidationData = {
    [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.ALLOW_MULTIPLE]: allowMultiple || false,
    [RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.IS_RESTRICTED]: validationData?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.IS_RESTRICTED] || false,
  };

  if (constructedValidationData?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.IS_RESTRICTED]) {
    constructedValidationData[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.RESTRICTED_USER_TEAM] = getSplittedUsersAndTeamsIdObjFromArray(
      validationData?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.USER_TEAM_PICKER]?.RESTRICTED_USER_TEAM] || {},
    );
  }

  if (allowMultiple) {
    if (has(validationData, [VALIDATION_CONFIG_STRINGS(t).MIN_USER_SELECTION.ID])) {
      constructedValidationData[VALIDATION_CONFIG_STRINGS(t).MIN_USER_SELECTION.ID] =
      validationData[VALIDATION_CONFIG_STRINGS(t).MIN_USER_SELECTION.ID];
    }
    if (has(validationData, [VALIDATION_CONFIG_STRINGS(t).MAX_USER_SELECTION.ID])) {
      constructedValidationData[VALIDATION_CONFIG_STRINGS(t).MAX_USER_SELECTION.ID] =
      validationData[VALIDATION_CONFIG_STRINGS(t).MAX_USER_SELECTION.ID];
    }
  }

  return constructedValidationData;
};

export const getDataListSelectorFieldValidationData = (validationData, allowMultiple, t = translateFunction) => {
  const constructedValidationData = {
    [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATA_LIST].ALLOW_MULTIPLE]: allowMultiple || false,
  };

  if (allowMultiple) {
    if (has(validationData, [VALIDATION_CONFIG_STRINGS(t).MIN_USER_SELECTION.ID])) {
      constructedValidationData[VALIDATION_CONFIG_STRINGS(t).MIN_USER_SELECTION.ID] =
      validationData[VALIDATION_CONFIG_STRINGS(t).MIN_USER_SELECTION.ID];
    }
    if (has(validationData, [VALIDATION_CONFIG_STRINGS(t).MAX_USER_SELECTION.ID])) {
      constructedValidationData[VALIDATION_CONFIG_STRINGS(t).MAX_USER_SELECTION.ID] =
      validationData[VALIDATION_CONFIG_STRINGS(t).MAX_USER_SELECTION.ID];
    }
  }
    if (!isEmpty(validationData?.[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS])) {
      constructedValidationData[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS] =
      validationData[RESPONSE_VALIDATION_KEYS?.[FIELD_TYPES.DATA_LIST]?.FILTER_FIELDS];
    }

  return constructedValidationData;
};

export const getDateFieldValidationData = (validationData, t) => {
  const constructedValidationData = {};
  const clonedValidationData = cloneDeep(validationData);
  delete clonedValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OTHER];
  constructedValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOW_TODAY] = clonedValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOW_TODAY] || false;
  delete clonedValidationData?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOW_TODAY];
  constructedValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION] = [clonedValidationData.dateSelection[0]];
  switch (validationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].OTHER]) {
    case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.OTHER_OPTIONS_VALUES[0].value:
      constructedValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOW_WORKING_DAY] = true;
    break;
    case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.OTHER_OPTIONS_VALUES[1].value:
      constructedValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOW_NON_WORKING_DAY] = true;
    break;
    case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.OTHER_OPTIONS_VALUES[2].value:
      constructedValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].CUSTOM_WORKING_DAY] = validationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].CUSTOM_WORKING_DAY];
      constructedValidationData[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOW_CUSTOM_WORKING_DAY] = true;
    break;
    default: break;
  }
  // if (!)validationData.allow_working_day = has(validationData, ['allow_working_day']) ? validationData?.allow_working_day : false;
  return constructedValidationData;
};

export const getValidationData = (fieldData, t) => {
  switch (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
  case FIELD_TYPES.SINGLE_LINE:
  case FIELD_TYPES.PARAGRAPH:
    return getTextFielsValidationData(fieldData[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]);
  case FIELD_TYPES.LINK:
    return getLinkFieldValidationData(fieldData[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], fieldData?.allowMultiple);
  case FIELD_TYPES.NUMBER:
    return getNumberFieldValidationData(fieldData[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], fieldData?.allowDecimal);
  case FIELD_TYPES.FILE_UPLOAD:
    return getFileUploadFieldValidationData(fieldData[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], fieldData?.allowMultiple);
  case FIELD_TYPES.CURRENCY:
    return getCurrencyFieldValidationData(fieldData[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]);
  case FIELD_TYPES.USER_TEAM_PICKER:
      return getUserSelectorFieldValidationData(fieldData[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], fieldData?.allowMultiple, t);
  case FIELD_TYPES.DATA_LIST:
    return getDataListSelectorFieldValidationData(fieldData[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], fieldData?.allowMultiple, t);
    case FIELD_TYPES.DATE:
    case FIELD_TYPES.DATETIME:
      return getDateFieldValidationData(fieldData[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA], t);
  case FIELD_TYPES.TABLE: {
    const data = cloneDeep(fieldData[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]);
    delete data[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.TABLE].READ_ONLY];
    return data;
  }
  default: return null;
}
};

export const getFieldValidationConfigurationValidationData = (fieldData, t = translateFunction) => {
    return {
        ...(!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) && !NON_VALIDATION_FIELDS.includes(fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE])) ?
        { [RESPONSE_VALIDATION_KEYS.VALIDATION_DATA]: getValidationData(fieldData, t) } : null,
        [RESPONSE_FIELD_KEYS.FIELD_TYPE]: fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE],
      };
};

export const getFieldValidationErrorMessage = (errorList, errorKey) => errorList[`validationData,${errorKey}`];

export const getOptionListForUnqiueColumnTableValidation = (fieldList = []) => {
  const constructedList = [];
  const EXCLUDE_FIELDS = [FIELD_TYPES.INFORMATION, FIELD_TYPES.PARAGRAPH, FIELD_TYPES.FILE_UPLOAD];

  fieldList.forEach((eachField) => {
      if (
        !eachField[RESPONSE_FIELD_KEYS.READ_ONLY] &&
        !EXCLUDE_FIELDS.includes(eachField[RESPONSE_FIELD_KEYS.FIELD_TYPE])
      ) {
        constructedList.push({
                label: eachField?.[RESPONSE_FIELD_KEYS.FIELD_NAME],
                value: eachField?.[RESPONSE_FIELD_KEYS.FIELD_UUID],
              });
      }
  });

  return constructedList;
};

export const checkAllFieldsAreReadOnly = (fields = []) => {
  if (isEmpty(fields)) return false;
  return fields.every((eachField) => eachField?.[RESPONSE_FIELD_KEYS.READ_ONLY]);
};
