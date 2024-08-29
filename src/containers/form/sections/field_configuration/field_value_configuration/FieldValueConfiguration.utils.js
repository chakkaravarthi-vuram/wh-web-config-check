import Joi from 'joi';
import { isEmpty, translateFunction } from '../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { DEFAULT_VALUE_FIELD_CONFIG_STRINGS } from './FieldValueConfiguration.strings';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../utils/constants/form/form.constant';
import { FIELD_TYPES } from '../FieldConfiguration.strings';

export const getFieldDefaultValueConfigurationValidationData = (fieldData) => {
        const validationData = {
          fieldType: fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE],
        };
        if (!isEmpty(fieldData[RESPONSE_FIELD_KEYS.DEFAULT_VALUE])) {
          switch (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE]) {
            case FIELD_TYPES.USER_TEAM_PICKER:
              if (fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_FIELD_KEYS.SYSTEM_FIELD]) {
                validationData[RESPONSE_FIELD_KEYS.DEFAULT_VALUE] = {
                  [RESPONSE_FIELD_KEYS.SYSTEM_FIELD]: fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_FIELD_KEYS.SYSTEM_FIELD],
                  [RESPONSE_FIELD_KEYS.OPERATION]: fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_FIELD_KEYS.OPERATION] || RESPONSE_FIELD_KEYS.REPLACE,
                };
              }
              break;
            case FIELD_TYPES.PHONE_NUMBER:
              if (!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.phone_number)) {
                validationData[RESPONSE_FIELD_KEYS.DEFAULT_VALUE] = fieldData[RESPONSE_FIELD_KEYS.DEFAULT_VALUE];
              }
            break;
            case FIELD_TYPES.CURRENCY:
              if (!isEmpty(fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.[RESPONSE_VALIDATION_KEYS[FIELD_TYPES.CURRENCY].CURRENCY_VALUE])) {
                validationData[RESPONSE_FIELD_KEYS.DEFAULT_VALUE] = fieldData[RESPONSE_FIELD_KEYS.DEFAULT_VALUE];
              }
            break;
            case FIELD_TYPES.LINK:
              const constructedDefaultValue = fieldData?.[RESPONSE_FIELD_KEYS.DEFAULT_VALUE]?.map((link) => { return { link_text: link.link_text, link_url: link.link_url }; });
              validationData[RESPONSE_FIELD_KEYS.DEFAULT_VALUE] = constructedDefaultValue;
            break;
            default: validationData[RESPONSE_FIELD_KEYS.DEFAULT_VALUE] = fieldData[RESPONSE_FIELD_KEYS.DEFAULT_VALUE];
          }
        }
        if (fieldData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.CHECKBOX) {
          validationData[RESPONSE_FIELD_KEYS.ALLOW_SELECT_ALL] = fieldData?.[RESPONSE_FIELD_KEYS.ALLOW_SELECT_ALL] || false;
        }
        return validationData;
};

export const validateLink = (value, t = translateFunction) => {
  if (!value.includes('.')) return DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LINK.CUSTOM_VALID_LINK;
  if (value && value.includes('.')) {
    const domainPart = value.split('.')[1].length >= 2;
    if (!(domainPart)) return DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LINK.CUSTOM_VALID_LINK;
  }
  if (value && (value.includes('://')) && !(value.includes('http') || value.includes('https'))) {
    return DEFAULT_VALUE_FIELD_CONFIG_STRINGS(t).DEFAULT_VALUE.LINK.CUSTOM_VALID_LINK;
  }
  return EMPTY_STRING;
};

export const linkCustomValidation = (value) => {
  const error = validateLink(value);
  if (error) {
    throw new Error(error);
  }
  return value;
};

export const LINK_VALIDATION = Joi.string().uri().required().custom(linkCustomValidation, 'Custom link Validation');
