import Joi from 'joi';
import i18next from 'i18next';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../utils/constants/form/form.constant';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { FIELD_TYPE } from '../../../utils/constants/form.constant';
import { isFiniteNumber, isEmpty, intersection, get, cloneDeep, compact, upperCase } from '../../../utils/jsUtility';
import { regexFormattedString } from '../../../utils/UtilityFunctions';
import { UNSAFE_NUMBER_MESSAGE } from '../../../utils/constants/validation.constant';
import { EMAIL_VALIDATION } from '../../../utils/ValidationConstants';
import { ADD_MEMBER_MIN_MAX_CONSTRAINT, DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES } from '../../../utils/Constants';
import { FIELD_VALIDATION } from './EditableForm.strings';
import { FIELD_LINK } from '../../../validation/form/form.validation.schema.constant';
import { dateFieldValidation } from '../../../components/form_builder/field_config/Field.validation.schema';
import { getDatePickerFieldsRangeForValidations } from '../../../utils/formUtils';
import { FIELD_TYPES } from '../sections/field_configuration/FieldConfiguration.strings';
import { ROW_IDENTIFIER } from '../Form.string';
import { isAllFieldsInsideTableDisabled } from './EditableForm.utils';

const { FIELD_UUID, FIELD_NAME, FIELD_TYPE: FIELD_TYPE_KEY, REQUIRED, VALIDATIONS, CHOICE_VALUES, READ_ONLY, CONTENTS, TABLE_UUID, FIELD_LIST_TYPES, TRANSLATION_DATA } = RESPONSE_FIELD_KEYS;

// Single Line, Paragraph Field.
export const getSchemaForTextField = (
    fieldData = {},
    isHideOrDisabled = false,
    isMultiLineField = false,
) => {
   const {
    ALLOWED_SPECIAL_CHARACTERS,
    MAXIMUM_CHARACTERS,
    MINIMUM_CHARACTERS,
   } = RESPONSE_VALIDATION_KEYS[FIELD_TYPE.SINGLE_LINE] || {};

   let fieldSchema = Joi.string().trim();

   // Required Check
   if (fieldData[REQUIRED] && !isHideOrDisabled) {
    fieldSchema = fieldSchema.required();
   } else {
    fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
   }

   const validation = fieldData[VALIDATIONS] || {};
   // Field Level Validation
   if (!isHideOrDisabled && !isEmpty(fieldData[VALIDATIONS] || [])) {
       if (isFiniteNumber(validation[MINIMUM_CHARACTERS])) {
         fieldSchema = fieldSchema.min(
            parseInt(validation[MINIMUM_CHARACTERS], 10),
         );
       }

       if (isFiniteNumber(validation[MAXIMUM_CHARACTERS])) {
        fieldSchema = fieldSchema.max(
           parseInt(validation[MAXIMUM_CHARACTERS], 10),
        );
      }

      if (validation[ALLOWED_SPECIAL_CHARACTERS]) {
        const regex = new RegExp(
            `^[a-zA-Z0-9_ ,.'${regexFormattedString(
                validation[ALLOWED_SPECIAL_CHARACTERS],
                false,
                isMultiLineField)}]*$`,
          );
          fieldSchema = fieldSchema.regex(regex);
      }
   }

   // Field Label
   fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]);

   if (fieldData?.isHiddenFieldValidation) {
     return {
      [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
      [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
      {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
     };
   }

   return fieldSchema;
};

// Number Field
export const getSchemaForNumberField = (fieldData = {}, isHideOrDisabled = false, t = i18next.t) => {
    const {
        ALLOWED_DECIMAL_POINTS,
        ALLOWED_MAXIMUM,
        ALLOWED_MINIMUM,
        ALLOW_DECIMAL,
        DONT_ALLOW_ZERO,
       } = RESPONSE_VALIDATION_KEYS[FIELD_TYPE.NUMBER] || {};

       // strict to check whether data is number type number, not string type number
       let fieldSchema = Joi.number().strict().messages({
          ...UNSAFE_NUMBER_MESSAGE,
        });

       // Required Check
       if (fieldData[REQUIRED] && !isHideOrDisabled) {
        fieldSchema = fieldSchema.required();
       } else {
        fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
       }

       const validation = fieldData[VALIDATIONS] || {};

       if (!isHideOrDisabled && !isEmpty(validation)) {
         // Minimum
         if (isFiniteNumber(validation[ALLOWED_MINIMUM])) {
            fieldSchema = fieldSchema.min(
                parseInt(validation[ALLOWED_MINIMUM], 10),
            );
         }
         // Maximum
         if (isFiniteNumber(validation[ALLOWED_MAXIMUM])) {
            fieldSchema = fieldSchema.max(
                parseInt(validation[ALLOWED_MAXIMUM], 10),
            );
         }
         // Decimal Points
         if (!fieldData[ALLOW_DECIMAL]) {
            fieldSchema = fieldSchema.integer();
         } else if (validation[ALLOWED_DECIMAL_POINTS]) {
            fieldSchema = fieldSchema.precision(
                parseInt(validation[ALLOWED_DECIMAL_POINTS], 10),
            );
         }
         // DOnt allow Zero
         if (validation[DONT_ALLOW_ZERO]) {
            fieldSchema = fieldSchema.invalid(0);
         }
       }

       fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]).messages({
        'number.min': `${fieldData[FIELD_NAME]} ${t('validation_constants.utility_constant.greater_tha')} ${validation[ALLOWED_MINIMUM]}`,
        'number.max': `${fieldData[FIELD_NAME]} ${t('validation_constants.utility_constant.less_than')} ${validation[ALLOWED_MAXIMUM]}`,
        'number.greater': `${fieldData[FIELD_NAME]} ${t('validation_constants.utility_constant.greater_tha')} ${0}`,
        'any.invalid': `${fieldData[FIELD_NAME]} ${t('validation_constants.utility_constant.not_zero')} ${0}`,
      });

      if (fieldData?.isHiddenFieldValidation) {
        return {
         [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
         [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
         {
           is: true,
           then: Joi.optional(),
           otherwise: fieldSchema,
         }),
        };
      }

       return fieldSchema;
};

// Yes Or No
export const getSchemaForYesOrNoField = (fieldData = {}, isHideOrDisabled = false) => {
     let fieldSchema = Joi.bool();

     if (fieldData[REQUIRED] && !isHideOrDisabled) {
        fieldSchema = fieldSchema.required();
     } else {
        fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
     }

     fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]);

     if (fieldData?.isHiddenFieldValidation) {
      return {
       [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
       [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
       {
         is: true,
         then: Joi.optional(),
         otherwise: fieldSchema,
       }),
      };
    }

     return fieldSchema;
};

// Radio, Dropdown
export const getSchemaForSingleSelectionField = (fieldData = {}, isHideOrDisabled = false) => {
    // Option List
    const values = (
        (!isEmpty(fieldData[CHOICE_VALUES]) && Array.isArray(fieldData[CHOICE_VALUES])) ?
        fieldData[CHOICE_VALUES].map((option) => option?.value?.toString() ? option.value : option) :
        null
    );
    let fieldSchema = values ? Joi.string().valid(...values) : Joi.string();

    if (fieldData[REQUIRED] && !isHideOrDisabled) {
        fieldSchema = fieldSchema.required();
    } else {
        fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
    }

    fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]);

    if (fieldData?.isHiddenFieldValidation) {
      return {
       [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
       [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
       {
         is: true,
         then: Joi.optional(),
         otherwise: fieldSchema,
       }),
      };
    }

    return fieldSchema;
};

// Checkbox
export const getSchemaForCheckboxField = (fieldData = {}, isHideOrDisabled = false, t) => {
    // Option List
    const values = (
        (!isEmpty(fieldData[CHOICE_VALUES]) && Array.isArray(fieldData[CHOICE_VALUES])) ?
        fieldData[CHOICE_VALUES].map((option) => option.value) :
        null
    );

    const valueSchema = values ? Joi.string().valid(...values).label(fieldData[FIELD_NAME]) : Joi.string();

    let fieldSchema = Joi.array().items(valueSchema);
    if (fieldData[REQUIRED] && !isHideOrDisabled) {
        fieldSchema = fieldSchema
          .min(1)
          .required()
          .messages({
            'array.min': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.is_required')}`,
            'any.required': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.is_required')}`,
          });
    }

    fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]);

    if (fieldData?.isHiddenFieldValidation) {
      return {
       [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
       [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
       {
         is: true,
         then: Joi.optional(),
         otherwise: fieldSchema,
       }),
      };
    }

    return fieldSchema;
};

// File Upload
export const getSchemaForFileUploadField = (fieldData = {}, isHideOrDisabled = false, allowedExtension = [], maxFileSize = 1, t) => {
    const { MAXIMUM_FILE_SIZE, ALLOWED_EXTENSIONS, IS_MULTIPLE, MINIMUM_COUNT, MAXIMUM_COUNT } = RESPONSE_VALIDATION_KEYS[FIELD_TYPE.FILE_UPLOAD];

    const validation = fieldData[VALIDATIONS];
    const allowed_extensions = [];
    get(fieldData, [VALIDATIONS, ALLOWED_EXTENSIONS], []).forEach((extension) => {
    if (allowedExtension?.includes(extension)) {
          allowed_extensions.push(extension);
          allowed_extensions.push(upperCase(extension));
    }
  });

    let typeSchema = Joi.string();
    if (fieldData[REQUIRED] && !fieldData[READ_ONLY] && !isHideOrDisabled) {
        typeSchema = typeSchema.required();
    }
    let sizeSchema = Joi.number().integer().min(1);
    const accountFileSize = maxFileSize;
    // Max File Size
    if (validation[MAXIMUM_FILE_SIZE]) {
        sizeSchema = sizeSchema.max(
            Math.min(
            parseInt(validation[MAXIMUM_FILE_SIZE], 10) * DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES,
            parseInt(accountFileSize, 10) * DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES,
            ),
        ).messages({
            'any.min': `${t('form_field_strings.validation_config.table_validation.files_less_than_or_equal_to')} ${Math.min(validation[MAXIMUM_FILE_SIZE], accountFileSize)}MB.`,
        });
    } else {
      sizeSchema = sizeSchema.max(
        parseInt(accountFileSize, 10) * DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES,
      ).messages({
        'number.max': `${t('form_field_strings.validation_config.table_validation.files_less_than_or_equal_to')} ${accountFileSize}MB.`,
      });
    }

    // Allowed Extension
    if (validation[ALLOWED_EXTENSIONS]) {
      typeSchema = typeSchema
          .valid(...allowed_extensions)
          .label(fieldData[FIELD_NAME])
          .messages({
            'any.only': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.must_be_one_of')} ${allowed_extensions.toString()}.`,
          });
    }

    const eachFileSchema = Joi.object().keys({
      type: typeSchema,
      size: sizeSchema,
    }).unknown();

    let fieldSchema = Joi.array().items(eachFileSchema).custom((value, helpers) => {
        if (!isHideOrDisabled && fieldData[IS_MULTIPLE] && value?.length > 0) {
          if (validation[MINIMUM_COUNT] && value.length < validation[MINIMUM_COUNT]) {
            return helpers.message(`${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.at_least')} ${validation[MINIMUM_COUNT]} ${t('form_field_strings.validation_config.table_validation.documents')}`);
          }
          if (validation[MAXIMUM_COUNT] && value.length > validation[MAXIMUM_COUNT]) {
            return helpers.message(`${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.at_most')} ${validation[MAXIMUM_COUNT]} ${t('form_field_strings.validation_config.table_validation.documents')}`);
          }
        }

        if (fieldData[REQUIRED] && value.length < 1) {
          return helpers.message(t(`${fieldData[FIELD_NAME]} ${FIELD_VALIDATION(t).IS_REQUIRED}`));
        }
        return value;
    });

    if (fieldData[REQUIRED] && !isHideOrDisabled) fieldSchema = fieldSchema.required();
    else fieldSchema = fieldSchema.empty(Joi.array().length(0));

    fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]);

    if (fieldData?.isHiddenFieldValidation) {
      return {
       [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
       [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
       {
         is: true,
         then: Joi.optional(),
         otherwise: fieldSchema,
       }),
      };
    }

    return fieldSchema;
};

// Currency
export const getSchemaForCurrencyField = (fieldData = {}, isHideOrDisabled = false, envAllowedCurrency = [], t) => {
  const {
    ALLOWED_MINIMUM,
    ALLOWED_MAXIMUM,
    // ALLOWED_DECIMAL_POINTS,
    ALLOWED_CURRENCY_TYPES,
  } = RESPONSE_VALIDATION_KEYS[FIELD_TYPE.CURRENCY];

  const validation = fieldData[VALIDATIONS] || {};
  const allowedCurrencyTypes = intersection(envAllowedCurrency, validation[ALLOWED_CURRENCY_TYPES] || []);

  let valueSchema = Joi.number().label(fieldData[FIELD_NAME]);
  let currencyTypeSchema = Joi.string();

  if (fieldData[REQUIRED] && !isHideOrDisabled) {
    valueSchema = valueSchema.required();
    currencyTypeSchema = currencyTypeSchema.required();
  } else {
    valueSchema = valueSchema.allow(EMPTY_STRING, null);
    currencyTypeSchema = currencyTypeSchema.allow(EMPTY_STRING, null);
  }

  if (!isHideOrDisabled && !isEmpty(fieldData[VALIDATIONS])) {
    if (isFiniteNumber(validation[ALLOWED_MINIMUM])) {
        valueSchema = valueSchema.min(
            parseInt(validation[ALLOWED_MINIMUM], 10),
        );
    }

    if (isFiniteNumber(validation[ALLOWED_MAXIMUM])) {
        valueSchema = valueSchema.max(
            parseInt(validation[ALLOWED_MAXIMUM], 10),
        );
    }

    if (validation[ALLOWED_CURRENCY_TYPES]) {
       currencyTypeSchema = currencyTypeSchema
        .valid(...allowedCurrencyTypes)
        .label(t('form_field_strings.validation_config.table_validation.currency_type'))
        .messages({
            'any.only': `${t('form_field_strings.validation_config.table_validation.currency_type')} ${t('form_field_strings.validation_config.table_validation.must_be_one_of')} ${allowedCurrencyTypes.toString()}.`,
        });
    }
  }

  let fieldSchema = Joi.object().keys({
    value: valueSchema,
    currency_type: currencyTypeSchema,
  });

  if (fieldData[REQUIRED] && !isHideOrDisabled) {
    fieldSchema = fieldSchema.required();
  } else {
    fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
  }

  fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]);

  if (fieldData?.isHiddenFieldValidation) {
    return {
     [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
     [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
     {
       is: true,
       then: Joi.optional(),
       otherwise: fieldSchema,
     }),
    };
  }

  return fieldSchema;
};

// Phone Number Field
export const getSchemaForPhoneNumberField = (fieldData = {}, isHideOrDisabled = false, t = i18next.t) => {
    let phoneNumber = Joi.string()
        .min(ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MIN_VALUE)
        .max(ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MAX_VALUE)
        .label(fieldData[FIELD_NAME])
        .messages({
            'string.min': `${fieldData[FIELD_NAME]} ${FIELD_VALIDATION(t).MUST_BE_ATLEAST} ${ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MIN_VALUE} ${FIELD_VALIDATION(t).DIGITS_LONG}`,
            'string.max': `${fieldData[FIELD_NAME]} ${FIELD_VALIDATION(t).MUST_BE_LESS_THAN} ${ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MAX_VALUE} ${FIELD_VALIDATION(t).DIGITS}`,
    });

    let countryCode = Joi.string().label(FIELD_VALIDATION(t).COUNTRY_CODE);

    if (fieldData[REQUIRED] && !isHideOrDisabled) {
        phoneNumber = phoneNumber.required();
        countryCode = countryCode.required();
    } else {
        phoneNumber = phoneNumber.allow(EMPTY_STRING, null);
        countryCode = Joi.custom((value, helper) => {
             const phoneNoValue = helper.state.ancestors[0].phone_number;
             if (
                !isEmpty(phoneNoValue) &&
                phoneNoValue.length >= ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MIN_VALUE &&
                phoneNoValue.length <= ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MAX_VALUE
             ) {
                if (isEmpty(value)) {
                    return helper.message(t(`${FIELD_VALIDATION(t).COUNTRY_CODE} ${FIELD_VALIDATION(t).IS_REQUIRED}`));
                }
             }
             return true;
        });
    }

    let fieldSchema = Joi.object().keys({
        phone_number: phoneNumber,
        country_code: countryCode,
    });

    if (fieldData[REQUIRED] && !isHideOrDisabled) {
        fieldSchema = fieldSchema.required();
    } else {
        fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
    }

    fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]);

    if (fieldData?.isHiddenFieldValidation) {
      return {
       [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
       [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
       {
         is: true,
         then: Joi.optional(),
         otherwise: fieldSchema,
       }),
      };
    }

    return fieldSchema;
};

// Email
export const getSchemaForEmailField = (fieldData = {}, isHideOrDisabled = false) => {
   let fieldSchema = EMAIL_VALIDATION.trim();

   // Required Check
   if (fieldData[REQUIRED] && !isHideOrDisabled) {
    fieldSchema = fieldSchema.required();
   } else {
    fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
   }

   // Field Label
   fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]);

   if (fieldData?.isHiddenFieldValidation) {
    return {
     [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
     [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
     {
       is: true,
       then: Joi.optional(),
       otherwise: fieldSchema,
     }),
    };
  }

   return fieldSchema;
};

// Scanner
export const getSchemaForScannerField = (fieldData = {}, isHideOrDisabled = false) => {
    let fieldSchema = Joi.string().trim();

    // Required Check
    if (fieldData[REQUIRED] && !isHideOrDisabled) {
     fieldSchema = fieldSchema.required();
    } else {
     fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
    }

    // Field Label
    fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]);

    if (fieldData?.isHiddenFieldValidation) {
      return {
       [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
       [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
       {
         is: true,
         then: Joi.optional(),
         otherwise: fieldSchema,
       }),
      };
    }

    return fieldSchema;
};

// Date
export const getSchemaForDateField = (fieldData = {}, isHideOrDisabled = false,
    workingDays = [], formData = {}, formFields = [], t = i18next.t) => {
    let fieldSchema = Joi.string();

    // Required
    if (fieldData[REQUIRED] && !isHideOrDisabled) {
        fieldSchema = fieldSchema.required();
    } else {
        fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
    }

    fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]);

    if (!isHideOrDisabled) {
      fieldSchema = fieldSchema.custom((value, helper) => {
        const error = dateFieldValidation({
          workingDays,
          read_only: fieldData[READ_ONLY],
          validations: fieldData?.originalValidationData,
          ...getDatePickerFieldsRangeForValidations({
            date: value,
            readOnly: fieldData[READ_ONLY],
            validations: fieldData?.originalValidationData,
            workingDaysArray: workingDays,
            isEnableTime: fieldData[FIELD_TYPE_KEY] === FIELD_TYPES.DATETIME,
            formData,
            formFields,
          }),
        }, value, fieldData[FIELD_TYPE_KEY] === FIELD_TYPES.DATETIME, t);
        if (!isEmpty(error)) {
          return helper.message(error);
        }
        return value;
      });
    }

    if (fieldData?.isHiddenFieldValidation) {
      return {
       [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
       [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
       {
         is: true,
         then: Joi.optional(),
         otherwise: fieldSchema,
       }),
      };
    }

    return fieldSchema;
};

// Link
export const getSchemaForLinkField = (fieldData = {}, isHideOrDisabled = false, t = i18next.t) => {
    const {
        MINIMUM_COUNT,
        MAXIMUM_COUNT,
        ALLOW_MULTIPLE,
    } = RESPONSE_VALIDATION_KEYS[FIELD_TYPE.LINK];

    const validation = fieldData[VALIDATIONS] || {};
    let fieldSchema = FIELD_LINK.custom((value, helpers) => {
          if (!isHideOrDisabled && !isEmpty(value) && value.length > 0) {
              if (validation[MINIMUM_COUNT] &&
                  value.length < parseInt(validation[MINIMUM_COUNT], 10)) {
                    return helpers.message(
                        `${fieldData[FIELD_NAME]} ${t('validation_constants.utility_constant.contain_atlest')} ${validation[MINIMUM_COUNT]} ${t('validation_constants.utility_constant.items')}`,
                    );
                }

              if (validation[MAXIMUM_COUNT] &&
                  value.length > parseInt(validation[MAXIMUM_COUNT], 10)) {
                    return helpers.message(
                        `${fieldData[FIELD_NAME]} ${t('validation_constants.utility_constant.can_have')} ${validation[MAXIMUM_COUNT]} ${t('validation_constants.utility_constant.items')}`,
                    );
                }
          }

          if (fieldData[REQUIRED] && value.length < 1) {
            return helpers.message(t(`${fieldData[FIELD_NAME]} ${FIELD_VALIDATION(t).IS_REQUIRED}`));
          }

          if (!fieldData?.[ALLOW_MULTIPLE] && value?.length > 1) {
            return helpers.message(`${t('server_validation_constants.must_contain_less_than_equal_to')} 1 ${t('server_validation_constants.items')}`);
          }
          return value;
    });

    if (fieldData[REQUIRED] && !isHideOrDisabled) {
        fieldSchema = fieldSchema.required();
        fieldSchema = fieldSchema.messages({ 'array.base': `${fieldData[FIELD_NAME]} ${t('validation_constants.utility_constant.is_required')}` });
    } else {
        fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
    }

    fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]);

    if (fieldData?.isHiddenFieldValidation) {
      return {
       [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
       [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
       {
         is: true,
         then: Joi.optional(),
         otherwise: fieldSchema,
       }),
      };
    }

    return fieldSchema;
};

// User
export const getSchemaForUserSelector = (fieldData = {}, isHideOrDisabled = false, t) => {
   const validation = fieldData[VALIDATIONS] || {};
   const {
    ALLOW_MULTIPLE,
    ALLOW_MAXIMUM_SELECTION,
    ALLOW_MINIMUM_SELECTION,
    MINIMUM_SELECTION,
    MAXIMUM_SELECTION,
   } = RESPONSE_VALIDATION_KEYS[FIELD_TYPE.USER_TEAM_PICKER] || {};

   const valueSchema = Joi.array().items(Joi.string());

   let fieldSchema = Joi.object().keys({
    users: valueSchema,
    teams: valueSchema,
   })
   .messages({
    'any.required': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.is_required')}`,
    'array.min': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.at_least')} ${validation[MINIMUM_SELECTION]} ${t('form_field_strings.validation_config.table_validation.users_or_teams')}`,
    'array.max': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.should_not_exceed')} ${validation[MINIMUM_SELECTION] || 1} ${t('form_field_strings.validation_config.table_validation.users_or_teams')}`,
   })
   .custom((_value, helper) => {
        if (fieldData[READ_ONLY] || isHideOrDisabled) return true;

        const values = [
          ...helper.original?.users || [],
          ...helper.original?.teams || [],
        ];

        if (values.length > 0) {
        // Allow Multiple Value
        if (fieldData[ALLOW_MULTIPLE]) {
           if (
               validation[ALLOW_MINIMUM_SELECTION] &&
               values.length < validation[MINIMUM_SELECTION]
              ) return helper.error('array.min', { limit: validation[MINIMUM_SELECTION] });

          if (
              validation[ALLOW_MAXIMUM_SELECTION] &&
              values.length > validation[MAXIMUM_SELECTION]
            ) {
              return helper.error('array.max', { limit: validation[MAXIMUM_SELECTION] });
            }
        } else if (
          !validation[ALLOW_MAXIMUM_SELECTION] &&
          values.length > 1
        ) {
          return helper.error('array.max', { limit: 1 });
        }
        }

        // Resticted User and Teams
        // if (validation[IS_RESTRICTED]) {
        //   const restrictedUserAndTeam = validation[RESTRICTED_USER_TEAM];
        //   const restrictedValue = [
        //     ...restrictedUserAndTeam?.users || [],
        //     ...restrictedUserAndTeam?.teams || [],
        //   ];

        //   const notAllowedValues = values.filter((eachValue) => !restrictedValue.includes(eachValue));

        //   if (notAllowedValues.length > 0) return helper.error('any.invalid', { invalids: notAllowedValues });
        // }

        // Required
        if (fieldData[REQUIRED] && values.length < 1) {
           return helper.error('any.required');
        }
        return true;
   });

    if (fieldData[REQUIRED] && !isHideOrDisabled) {
        fieldSchema = fieldSchema.required();
    } else {
        fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
    }

   // Field Label
   fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]);

   if (fieldData?.isHiddenFieldValidation) {
    return {
     [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
     [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
     {
       is: true,
       then: Joi.optional(),
       otherwise: fieldSchema,
     }),
    };
  }

   return fieldSchema;
};

// Data List
export const getSchemaForDataListField = (fieldData = {}, isHideOrDisabled = false, t) => {
  const {
    ALLOW_MULTIPLE,
    MAXIMUM_SELECTION,
    MINIMUM_SELECTION,
  } = RESPONSE_VALIDATION_KEYS[FIELD_TYPE.DATA_LIST];

  const validation = fieldData[VALIDATIONS];

  let fieldSchema = Joi.array().items(Joi.string());

  if (fieldData[REQUIRED] && !isHideOrDisabled) {
    fieldSchema = fieldSchema.min(1).required();
  } else {
    fieldSchema = fieldSchema.empty(Joi.array().length(0));
  }

  if (!isEmpty(validation) && !isHideOrDisabled) {
    if (fieldData[ALLOW_MULTIPLE]) {
      if (isFiniteNumber(validation[MAXIMUM_SELECTION])) {
        fieldSchema = fieldSchema
          .max(validation[MAXIMUM_SELECTION])
          .messages({
            'array.max': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.at_most')} ${validation[MAXIMUM_SELECTION]} ${t('form_field_strings.validation_config.table_validation.entries')}`,
            'array.min': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.at_least')} ${validation[MINIMUM_SELECTION]} ${t('form_field_strings.validation_config.table_validation.entries')}`,
          });
      }
      if (isFiniteNumber(validation[MINIMUM_SELECTION])) {
        fieldSchema = fieldSchema
          .min(validation[MINIMUM_SELECTION])
          .messages({
            'array.max': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.at_most')} ${validation[MAXIMUM_SELECTION]} ${t('form_field_strings.validation_config.table_validation.entries')}`,
            'array.min': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.at_least')} ${validation[MINIMUM_SELECTION]} ${t('form_field_strings.validation_config.table_validation.entries')}`,
          });
      }
    } else {
       fieldSchema = fieldSchema.max(1)
       .messages({
        'array.max': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.at_most_one_entry')}`,
        'array.min': `${fieldData[FIELD_NAME]} is required`,
       });
    }
  }

  // Field Label
  fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]);

  if (fieldData?.isHiddenFieldValidation) {
    return {
     [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
     [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
     {
       is: true,
       then: Joi.optional(),
       otherwise: fieldSchema,
     }),
    };
  }

  return fieldSchema;
};

// Information
export const getSchemaForInfoField = (fieldData) => {
  const fieldSchema = Joi.string().trim().allow(EMPTY_STRING);

  if (fieldData?.isHiddenFieldValidation) {
    return {
     [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
     [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
     {
       is: true,
       then: Joi.optional(),
       otherwise: fieldSchema,
     }),
    };
  }

  return fieldSchema;
};

// Table
export const getSchemaForTable = (fieldData, isHideOrDisabled, tableFields, params, formVisibility = {}, t) => {
  const { isMaximumRow, isMinimumRow, minimumRow, maximumRow, isUniqueColumnAvailable, uniqueColumnUUID } = fieldData[VALIDATIONS];
  const tableUUID = fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID];
  // const tableFieldsSchema = [];
  const tableFieldSchemaObj = {};
  let uniqueColumnName = '';

  tableFields.forEach((tf) => {
    // eslint-disable-next-line no-use-before-define
    const tfSchema = getSchemaForIndividualField(tf, ...params);
    // tableFieldsSchema.push(tfSchema);
    Object.keys(tfSchema).forEach((key) => { tableFieldSchemaObj[key] = tfSchema[key]; });

    if (isUniqueColumnAvailable && tf[FIELD_UUID] === uniqueColumnUUID) uniqueColumnName = tf[FIELD_NAME];
  });
  tableFieldSchemaObj._id = Joi.string().optional();

  let fieldSchema = Joi.array().items(tableFieldSchemaObj);
    // .append({ _id:  }),

  // Unique Column
  if (!isHideOrDisabled && isUniqueColumnAvailable && uniqueColumnUUID) {
    fieldSchema = fieldSchema.custom((value, helpers) => {
      const clonedValue = Array.isArray(value) ? cloneDeep(value) : [];
      const set = new Set();
      for (let rowIdk = 0; rowIdk < clonedValue.length; rowIdk++) {
       const uniqueColumnValue = JSON.stringify(clonedValue?.[rowIdk]?.[uniqueColumnUUID]);
        if (set.has(uniqueColumnValue)) {
          return helpers.message(`${uniqueColumnName} ${t('form_field_strings.validation_config.table_validation.unique_values')}`);
        } else {
          set.add(uniqueColumnValue);
        }
      }
      return value;
    });
  }

  // Minimum and Maximum
  if (!isHideOrDisabled) {
    fieldSchema = fieldSchema.custom((value, helpers) => {
      if (isAllFieldsInsideTableDisabled(tableUUID, value, tableFields, formVisibility)) return true;

      const clonedValue = Array.isArray(value) ? cloneDeep(value) : [];
      const rowCount = clonedValue.length;

      let emptyRowCount = 0;
      clonedValue.forEach((eachRow) => {
          delete eachRow?.[ROW_IDENTIFIER.TEMP_ROW_UUID];
          delete eachRow?.[ROW_IDENTIFIER.ID];
          if (compact(Object.values(eachRow)) < 1) emptyRowCount++;
      });

      const rowWithValue = rowCount - emptyRowCount;

      if (isMinimumRow && isFiniteNumber(minimumRow)) {
        const minRange = parseInt(minimumRow, 10);
        if (rowWithValue < minRange) return helpers.message(`${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.at_least')} ${minimumRow} ${t('form_field_strings.validation_config.table_validation.rows_with_values')}`);
      }

      if (isMaximumRow && isFiniteNumber(maximumRow)) {
        const maxRange = parseInt(maximumRow, 10);
        if (rowWithValue > maxRange) return helpers.message(`${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.at_most')} ${maximumRow} ${t('form_field_strings.validation_config.table_validation.rows_with_values')}`);
      }
      return value;
  });
  }

  fieldSchema = fieldSchema.label(fieldData[FIELD_NAME]).messages({
    'any.required': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.is_required')}`,
    'array.min': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.at_least')} ${minimumRow} ${t('form_field_strings.validation_config.table_validation.rows')}`,
    'array.max': `${fieldData[FIELD_NAME]} ${t('form_field_strings.validation_config.table_validation.at_most')} ${maximumRow} ${t('form_field_strings.validation_config.table_validation.rows')}`,
    'array.unique': `${uniqueColumnName} ${t('form_field_strings.validation_config.table_validation.unique_values')}`,
  });

  return fieldSchema;
};

// Default Field
export const getDefaultFieldValidations = () => {
  const fieldSchema = Joi.any();

  return fieldSchema;
};

// Field Schema
export const getSchemaForIndividualField = (
    fieldData = {},
    formData = {},
    isHideOrDisabled = false,
    workingDaysArray,
    fieldBasedValidationSectionData,
    userProfileData,
    pref_locale,
    t = i18next.t,
    tableFields = [],
    formVisibility = {},
  ) => {
    let fieldSchema;
    const isFieldWithinTable = fieldData[FIELD_LIST_TYPES] === FIELD_TYPE.TABLE;

    const field = {
      ...fieldData,
      [FIELD_NAME]: fieldData?.[TRANSLATION_DATA]?.[pref_locale]?.[FIELD_NAME] || fieldData[FIELD_NAME],
      isHiddenFieldValidation: isFieldWithinTable,
    };

    switch (field[FIELD_TYPE_KEY]) {
      case FIELD_TYPE.SINGLE_LINE:
          fieldSchema = getSchemaForTextField(
            field,
            isHideOrDisabled,
          );
          break;
      case FIELD_TYPE.PARAGRAPH:
          fieldSchema = getSchemaForTextField(
            field,
            isHideOrDisabled,
            true,
          );
          break;
      case FIELD_TYPE.NUMBER:
        fieldSchema = getSchemaForNumberField(
          field,
          isHideOrDisabled,
          t,
        );
        break;
      case FIELD_TYPE.YES_NO:
        fieldSchema = getSchemaForYesOrNoField(
          field,
          isHideOrDisabled,
        );
        break;
      case FIELD_TYPE.RADIO_GROUP:
        fieldSchema = getSchemaForSingleSelectionField(
          field,
          isHideOrDisabled,
        );
        break;
      case FIELD_TYPE.DROPDOWN:
      case FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN:
        fieldSchema = getSchemaForSingleSelectionField(
          field,
          isHideOrDisabled,
        );
        break;
      case FIELD_TYPE.CHECKBOX:
        fieldSchema = getSchemaForCheckboxField(
          field,
          isHideOrDisabled,
          t,
        );
        break;
      case FIELD_TYPE.FILE_UPLOAD:
        fieldSchema = getSchemaForFileUploadField(
          field,
          isHideOrDisabled,
          userProfileData.allowed_extensions,
          userProfileData.maximum_file_size,
          t,
        );
        break;
      case FIELD_TYPE.CURRENCY:
        fieldSchema = getSchemaForCurrencyField(
          field,
          isHideOrDisabled,
          userProfileData.allowed_currency_types,
          t,
        );
        break;
      case FIELD_TYPE.PHONE_NUMBER:
        fieldSchema = getSchemaForPhoneNumberField(
          field,
          isHideOrDisabled,
          t,
        );
        break;
      case FIELD_TYPE.EMAIL:
        fieldSchema = getSchemaForEmailField(
          field,
          isHideOrDisabled,
        );
        break;
      case FIELD_TYPE.SCANNER:
        fieldSchema = getSchemaForScannerField(
          field,
          isHideOrDisabled,
        );
        break;
      case FIELD_TYPE.DATE:
      case FIELD_TYPE.DATETIME:
        fieldSchema = getSchemaForDateField(
          field,
          isHideOrDisabled,
          workingDaysArray,
          formData,
          fieldBasedValidationSectionData,
          t,
        );
        break;
      case FIELD_TYPE.LINK:
        fieldSchema = getSchemaForLinkField(
          field,
          isHideOrDisabled,
          t,
        );
        break;
      case FIELD_TYPE.USER_TEAM_PICKER:
        fieldSchema = getSchemaForUserSelector(
          field,
          isHideOrDisabled,
          t,
        );
        break;
      case FIELD_TYPE.DATA_LIST:
        fieldSchema = getSchemaForDataListField(
          field,
          isHideOrDisabled,
          t,
        );
        break;
      case FIELD_TYPE.INFORMATION:
        fieldSchema = getSchemaForInfoField(
          field,
        );
        break;
      case FIELD_TYPE.TABLE: {
        const fieldUUID = field[FIELD_UUID];
        const currentTableFields = tableFields.filter((f) => f[TABLE_UUID] === fieldUUID);
        const params = [
          formData,
          isHideOrDisabled,
          workingDaysArray,
          fieldBasedValidationSectionData,
          userProfileData,
          pref_locale,
          t,
          [],
        ];
        fieldSchema = getSchemaForTable(field, isHideOrDisabled, currentTableFields, params, formVisibility, t);
        break;
      }
      default:
          fieldSchema = isFieldWithinTable ?
          {
            [`is_hidden_${fieldData[FIELD_UUID]}`]: Joi.optional(),
            [fieldData[FIELD_UUID]]: Joi.when(`is_hidden_${fieldData[FIELD_UUID]}`,
            {
              is: true,
              then: Joi.optional(),
              otherwise: getDefaultFieldValidations(),
            }),
           } :
          getDefaultFieldValidations();
        break;
  }

    if (isFieldWithinTable) return fieldSchema;

    return { [field[FIELD_UUID]]: fieldSchema };
};

// Form Schema
export const getSchemaForFormData = (
  sections,
  allVisibility,
  userProfileData,
  workingDaysArray,
  formData,
  fields,
  t = i18next.t,
) => {
  const pref_locale = localStorage.getItem('application_language');
  const { visible_sections = {}, visible_tables = {}, visible_fields = {} } = allVisibility;
  const finalFormSchema = {};
  const allFields = Object.values(fields);

  const AllSectionSchemaArr = sections.map((section) => {
      const sectionFields = section[CONTENTS]
        .filter((layout) => layout.field_uuid)
        .map((field) => fields[field.field_uuid]);

      const allDirectFields = sectionFields.filter((field) => {
        const fieldUUID = field[FIELD_UUID];
        const isVisible = (fields[fieldUUID][FIELD_TYPE_KEY] === FIELD_TYPES.TABLE
        ? visible_tables[fieldUUID]
        : visible_fields[fieldUUID]);

        return isVisible ? (field[FIELD_LIST_TYPES] === 'direct') : false;
      });
      const tableFields = sectionFields.filter((f) => f[FIELD_LIST_TYPES] === 'table');

      if (visible_sections[section.section_uuid] && section[CONTENTS]) {
          return allDirectFields.map((field) => {
            let fieldSchema = null;
              fieldSchema = getSchemaForIndividualField(
                    field,
                    formData,
                    false,
                    workingDaysArray,
                    allFields,
                    userProfileData,
                    pref_locale,
                    t,
                    tableFields,
                    allVisibility,
                );
            return fieldSchema;
          });
      }
      return null;
  });

  AllSectionSchemaArr.forEach((sectionSchema) => {
    if (sectionSchema && Array.isArray(sectionSchema)) {
     sectionSchema.forEach((fieldSchema) => {
      Object.keys(fieldSchema).forEach((fieldUUID) => {
        finalFormSchema[fieldUUID] = fieldSchema[fieldUUID];
      });
     });
    }
  });
  return Joi.object().keys(finalFormSchema);
};

export const generateSchemaForAllFields = (
  sections,
  allVisibility,
  userProfileData,
  workingDaysArray,
  formData,
  fields,
  fieldBasedValidationSectionData = [],
  t = i18next.t,
) => {
  const pref_locale = localStorage.getItem('application_language');
  // const { visible_fields = {} } = allVisibility;
  const finalFormSchema = {};

  sections.forEach((section) => {
    const sectionFields = section[CONTENTS]
      .filter((field) => field.field_uuid)
      .map((field) => fields[field.field_uuid]);
      // const nonTableFields = sectionFields.filter((f) => f[FIELD_LIST_TYPES] === 'direct');
      const tableFields = sectionFields.filter((f) => f[FIELD_LIST_TYPES] === 'table');
      sectionFields.forEach((field) => {
        const fieldSchema = getSchemaForIndividualField(
              field,
              formData,
              false,
              workingDaysArray,
              fieldBasedValidationSectionData,
              userProfileData,
              pref_locale,
              t,
              tableFields,
              allVisibility,
          );
          finalFormSchema[field[FIELD_UUID]] = fieldSchema;
      });
  });

  return finalFormSchema;
};
