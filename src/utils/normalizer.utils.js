import { ValidationSubType, ValidationType } from '@workhall-pvt-lmt/wh-ui-library';
import { camelCase } from 'lodash';
import { isEmpty, isPlainObject, translateFunction, cloneDeep } from './jsUtility';
import { UUID_V4_REGEX } from './strings/Regex';

const mapObjectsByKey = (object1 = {}, object2 = {}) => {
    const allKeys = Object.keys(object1);

    const mappedObject = {};

    allKeys.forEach((key) => {
        mappedObject[object1[key]] = object2[key];
    });
    return mappedObject;
};

const normalize = (data = {}, mappedKeyObject = {}) => {
   const fieldDataKey = Object.keys(data);

   const contructedField = {};

   fieldDataKey.forEach((eachKey) => {
       const value = data[eachKey];
       const feKey = mappedKeyObject[eachKey] || eachKey;
       if (isPlainObject(value)) {
        contructedField[feKey] = normalize(value, mappedKeyObject);
       } else if (Array.isArray(value)) {
        contructedField[feKey] = value.map((eachValue) => {
            if (isPlainObject(eachValue)) {
                return normalize(eachValue, mappedKeyObject);
            }
            return eachValue;
        });
       } else {
        contructedField[feKey] = value;
       }
   });
   return contructedField;
};

export const normalizer = (data = {}, constantObject1 = {}, constantObject2 = {}) => {
   if (isEmpty(data)) return {};
   const mappedKeyObject = mapObjectsByKey(constantObject1, constantObject2);

   return normalize(data, mappedKeyObject);
};

export const mergeArrayOfObjects = (arrayOfObject = []) => {
    const finalObj = {};
    arrayOfObject.forEach((eachObject) => {
      Object.assign(finalObj, eachObject);
    });
    return finalObj;
 };
 export const convertDateValidation = (validationData = {}, t = translateFunction, VALIDATION_CONFIG_STRINGS) => {
    const modifiedValidationData = {};
    let subOptions = {};
    const dateSelectionData = cloneDeep(validationData)?.dateSelection?.[0];
    switch (dateSelectionData?.type) {
        case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[0].value:
            modifiedValidationData.validationTypes = [ValidationType.None];
            break;
        case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[1].value:
            modifiedValidationData.validationTypes = [ValidationType.Future];
            if (validationData?.allowToday) modifiedValidationData.validationTypes.push(ValidationType.Today);
             subOptions = VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_FUTURE_DATE_OPTIONS;
            switch (dateSelectionData?.subType) {
                case subOptions?.[2]?.value:
                    modifiedValidationData.validationSubType = ValidationSubType.Next;
                    modifiedValidationData.startDay = dateSelectionData?.next;
                    break;
                case subOptions?.[3]?.value:
                    modifiedValidationData.validationSubType = ValidationSubType.After;
                    modifiedValidationData.startDay = dateSelectionData?.next;
                    break;
                case subOptions?.[4]?.value:
                    modifiedValidationData.validationSubType = ValidationSubType.Between;
                    modifiedValidationData.startDay = dateSelectionData?.next;
                    modifiedValidationData.endDay = dateSelectionData?.endDay;
                    break;
                default: break;
            }
            break;
        case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[2].value:
            modifiedValidationData.validationTypes = [ValidationType.Past];
            if (validationData?.allowToday) modifiedValidationData.validationTypes.push(ValidationType.Today);
            subOptions = VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.ALLOW_PAST_DATE_OPTIONS;
            switch (dateSelectionData?.subType) {
                case subOptions?.[2]?.value:
                    modifiedValidationData.validationSubType = ValidationSubType.Last;
                    modifiedValidationData.startDay = dateSelectionData?.next;
                    break;
                case subOptions?.[3]?.value:
                    modifiedValidationData.validationSubType = ValidationSubType.Before;
                    modifiedValidationData.startDay = dateSelectionData?.next;
                    break;
                case subOptions?.[4]?.value:
                    modifiedValidationData.validationSubType = ValidationSubType.Between;
                    modifiedValidationData.startDay = dateSelectionData?.next;
                    modifiedValidationData.endDay = dateSelectionData?.endDay;
                    break;
                default: break;
            }
            break;
            case VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[3].value:
                modifiedValidationData.validationTypes = [ValidationType.Range];
                modifiedValidationData.startDate = dateSelectionData.startDate;
                modifiedValidationData.endDate = dateSelectionData.endDate;
                break;
        default: break;
    }
    return modifiedValidationData;
};

const snakeToCamelCase = (string) => {
    if (UUID_V4_REGEX.test(string)) {
      return string;
    }

    const _str = string.replace(/_/g, ' ').trim();
    let camelCaseKey = camelCase(_str);
    camelCaseKey = camelCaseKey.replace(/(Uuid)/g, 'UUID'); // to convert uuid to UUID
    return camelCaseKey;
};

/**
 *  converts API Response Keys to Frontend keys (snake_casing to camelCasing).
 *  @param {Object} data data object.
 *  @param {Object} customKeys keys which needs to be changed based on developer preference (Ex: { last_name: surname }).
 *  @param {Array} ignoreKeys keys in this array will not be converted to camelCase.
 *  @returns {Object} converted object.
 */
export const convertBeToFeKeys = (data = {}, customKeys = {}, ignoreKeys = [], ignoreKeysIncludingChild = []) => {
  if (isEmpty(data)) return {};

  const fieldDataKey = Object.keys(data);
  const contructedField = {};

  fieldDataKey.forEach((beKey) => {
    const value = data[beKey];
    let feKey = beKey;

    if (ignoreKeysIncludingChild.includes(beKey)) {
        contructedField[beKey] = value;
        return;
    }

    if (!ignoreKeys.includes(beKey)) {
        feKey = customKeys[beKey] || snakeToCamelCase(beKey);
    }

    if (isPlainObject(value)) {
      contructedField[feKey] = convertBeToFeKeys(value, customKeys, ignoreKeys, ignoreKeysIncludingChild);
    } else if (Array.isArray(value)) {
      contructedField[feKey] = value.map((eachValue) => {
        if (isPlainObject(eachValue)) {
          return convertBeToFeKeys(eachValue, customKeys, ignoreKeys, ignoreKeysIncludingChild);
        }
        return eachValue;
      });
    } else {
      contructedField[feKey] = value;
    }
  });
  return contructedField;
};
