import { UNSAFE_NUMBER_MESSAGE } from 'utils/constants/validation.constant';
import { areAllFieldsDisabled, areAllFieldsReadOnly, getDatePickerFieldsRangeForValidations } from 'utils/formUtils';
import { EMAIL_VALIDATION } from 'utils/ValidationConstants';
import { dateFieldValidation } from 'components/form_builder/field_config/Field.validation.schema';
import { LANDING_PAGE_VALIDATION } from 'containers/landing_page/LandingPageTranslation.strings';
import { FIELD_TYPES } from '../../../../components/form_builder/FormBuilder.strings';
import { SUBMIT_TASK_COMMENTS, TEST_ASSIGNEES } from '../../../../utils/ValidationConstants';
import { EMOJI_REGEX } from '../../../../utils/strings/Regex';
import { TASK_CONTENT_STRINGS, TASK_VALIDATION_STRINGS } from '../../LandingPage.strings';
import { DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES, ADD_MEMBER_MIN_MAX_CONSTRAINT } from '../../../../utils/Constants';
import { FIELD_LIST_TYPE } from '../../../../utils/constants/form.constant';
import jsUtils, { translateFunction } from '../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { regexFormattedString } from '../../../../utils/UtilityFunctions';
import { FIELD_LINK } from '../../../../validation/form/form.validation.schema.constant';

const Joi = require('joi');

export const getValidationsForSingleLine = (
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
  isParagraph,
) => {
  const { field_name, field_uuid } = fieldData;
  let fieldSchema = Joi.string().trim();
  if (required && !isCancel && visibility !== false) fieldSchema = fieldSchema.required();
  else fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
  if (visibility !== false && (!jsUtils.isEmpty(validation_data))) {
    if (validation_data.minimum_characters) {
      fieldSchema = fieldSchema.min(
        parseInt(validation_data.minimum_characters, 10),
      );
    }
    if (validation_data.maximum_characters) {
      fieldSchema = fieldSchema.max(
        parseInt(validation_data.maximum_characters, 10),
      );
    }
    if (validation_data.allowed_special_characters) {
      const regex = new RegExp(
        `^[a-zA-Z0-9_ ,.'${regexFormattedString(validation_data.allowed_special_characters, false, isParagraph)}]*$`,
      );
      fieldSchema = fieldSchema.regex(regex);
    }
  }
  fieldSchema = fieldSchema.label(field_name);
  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }
  return fieldSchema;
};

export const getValidationsForScanner = (
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
) => {
  const { field_name, field_uuid } = fieldData;

  let fieldSchema = Joi.string().trim();
  if (required && !isCancel && visibility !== false) fieldSchema = fieldSchema.required();
  else fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
  fieldSchema = fieldSchema.label(field_name);

  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};
export const getValidationsForParagraphField = (
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
) => getValidationsForSingleLine(
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
  true,
);

export const getValidationsForEmailField = (
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
) => {
  const { field_name, field_uuid } = fieldData;

  let fieldSchema = EMAIL_VALIDATION.trim();
  if (required && !isCancel && !(visibility === false)) fieldSchema = fieldSchema.required();
  else fieldSchema = fieldSchema.allow(EMPTY_STRING, null);

  fieldSchema = fieldSchema.label(field_name);
  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};

export const getValidationsForInfoField = (fieldData) => {
  const { field_uuid } = fieldData;

  const fieldSchema = Joi.string().trim().allow(EMPTY_STRING);

  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};

export const getDefaultFieldValidations = (fieldData) => {
  const { field_uuid } = fieldData;

  const fieldSchema = Joi.any();

  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};

export const getValidationsForLinkField = (
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
  t = () => {},
) => {
  const { field_name, field_uuid } = fieldData;

  const requiredCheck = required && !isCancel && !(visibility === false);
  let fieldSchema = FIELD_LINK.custom((value, helpers) => {
    if (!jsUtils.isEmpty(validation_data) && !(visibility === false)) {
      if (!jsUtils.isEmpty(value) || requiredCheck) {
        if (validation_data.minimum_count) {
          if (value.length < validation_data.minimum_count) {
            return helpers.message(`${field_name} ${t('validation_constants.utility_constant.contain_atlest')} ${validation_data.minimum_count} ${t('validation_constants.utility_constant.items')}`);
          }
        }
        if (validation_data.maximum_count) {
          if (value.length > parseInt(validation_data.maximum_count, 10)) {
            return helpers.message(`${field_name} ${t('validation_constants.utility_constant.can_have')} ${validation_data.maximum_count} ${t('validation_constants.utility_constant.items')}`);
          }
        }
        if (!validation_data.is_multiple) {
          if (value.length < 1) {
            return helpers.message(`${field_name} ${t('validation_constants.utility_constant.is_required')}`);
          }
          if (value.length > 1) {
            return helpers.message(`${field_name} ${t('validation_constants.utility_constant.can_have')} ${1} ${t('validation_constants.utility_constant.items')}`);
          }
        }
      }
      return value;
    }
    return value;
  });
  if (requiredCheck) {
    fieldSchema = fieldSchema.required();
    fieldSchema = fieldSchema.messages({ 'array.base': `${field_name} ${t('validation_constants.utility_constant.is_required')}` });
  } else fieldSchema = fieldSchema.allow(EMPTY_STRING, null);

  fieldSchema = fieldSchema.label(field_name);
  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }
  return fieldSchema;
};
export const getValidationsForNumberField = (
  validation_data = {},
  fieldData,
  required,
  isCancel,
  visibility,
  t = () => { },
) => {
  const { field_name, field_uuid } = fieldData;
  let fieldSchema = Joi.number()
    .strict()
    .messages({
      ...UNSAFE_NUMBER_MESSAGE,
    });
  if (required && !isCancel && visibility !== false) fieldSchema = fieldSchema.required();
  else fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
  if (visibility !== false) {
    if (validation_data.allowed_minimum || validation_data.allowed_minimum === 0) {
      fieldSchema = fieldSchema.min(
        parseInt(validation_data.allowed_minimum, 10),
      );
    }
    if (validation_data.allowed_maximum || validation_data.allowed_maximum === 0) {
      fieldSchema = fieldSchema.max(
        parseInt(validation_data.allowed_maximum, 10),
      );
    }
    if (!validation_data.allow_decimal) {
      fieldSchema = fieldSchema.integer();
    }
    if (
      validation_data.allow_decimal &&
      validation_data.allowed_decimal_points
    ) {
      fieldSchema = fieldSchema.precision(
        parseInt(validation_data.allowed_decimal_points, 10),
      );
    }
    if (validation_data.dont_allow_zero) fieldSchema = fieldSchema.invalid(0);
  }
  fieldSchema = fieldSchema.label(field_name).messages({
    'number.min': `${field_name} ${t('validation_constants.utility_constant.greater_tha')} ${validation_data.allowed_minimum}`,
    'number.max': `${field_name} ${t('validation_constants.utility_constant.less_than')} ${validation_data.allowed_maximum}`,
    'number.greater': `${field_name} ${t('validation_constants.utility_constant.greater_tha')} ${0}`,
    'any.invalid': `${field_name} ${t('validation_constants.utility_constant.not_zero')} ${0}`,
  });
  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }
  return fieldSchema;
};

export const getValidationsForDateField = (
  read_only,
  validation_data,
  fieldData,
  required,
  fieldType,
  isCancel,
  visibility,
  workingDays,
  formData = {},
  formFields = [],
  t = translateFunction,
) => {
  const { field_name, field_uuid } = fieldData;

  let fieldSchema = Joi.string();
  if (required && !isCancel && !(visibility === false)) fieldSchema = fieldSchema.required();
  else fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
  fieldSchema = fieldSchema.label(field_name);
  if (!(visibility === false)) {
    fieldSchema = fieldSchema.custom((value, helper) => {
      const error = dateFieldValidation({
        workingDays,
        read_only,
        validations: validation_data,
        ...getDatePickerFieldsRangeForValidations({
          date: value,
          readOnly: read_only,
          validations: validation_data,
          workingDaysArray: workingDays,
          isEnableTime: fieldType === FIELD_TYPES.DATETIME,
          formData,
          formFields,
        }),
      }, value, fieldType === FIELD_TYPES.DATETIME, t);
      if (!jsUtils.isEmpty(error)) {
        return helper.message(error);
      }
      return value;
    });
  }

  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};

export const getValidationsForFileUploadField = (
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
  userProfileData,
  readOnly,
  ) => {
  const { field_name, field_uuid } = fieldData;

  const allowed_extensions = [];
  jsUtils.get(validation_data, ['allowed_extensions'], []).forEach((extension) => {
    if (userProfileData && userProfileData.allowed_extensions
        && userProfileData.allowed_extensions.includes(extension)) {
          allowed_extensions.push(extension);
          allowed_extensions.push(jsUtils.upperCase(extension));
    }
  });
  let typeSchema = Joi.string();
  if (required && !isCancel && !(visibility === false) && !readOnly) typeSchema = typeSchema.required();
  let sizeSchema = Joi.number().integer().min(1);
  const accountFileSize =
    jsUtils.isUndefined(userProfileData) || jsUtils.isEmpty(userProfileData)
      ? 1
      : userProfileData.maximum_file_size;
  if (validation_data.maximum_file_size) {
    sizeSchema = sizeSchema.max(
      Math.min(
        parseInt(validation_data.maximum_file_size, 10) *
        DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES,
        parseInt(accountFileSize, 10) * DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES,
      ),
    ).messages({
      'any.min': `Files must be less than or equal to ${Math.min(validation_data.maximum_file_size, accountFileSize)}MB.`,
    });
    } else {
    sizeSchema = accountFileSize
      ? sizeSchema.max(
        parseInt(accountFileSize, 10) * DEFAULT_FILE_UPLOAD_SIZE_IN_BYTES,
      ).messages({
        'number.max': `Files must be less than or equal to ${accountFileSize}MB.`,
      })
      : sizeSchema.max(1 * 1000 * 1000);
  }
  if (validation_data.allowed_extensions) {
    typeSchema = typeSchema.valid(...validation_data.allowed_extensions);
    typeSchema = typeSchema
        .valid(...allowed_extensions)
        .label(field_name)
        .messages({
          'any.only': `${field_name} must be one of ${allowed_extensions.toString()}.`,
        });
  }
   const eachFileSchema = Joi.object().keys({
    type: typeSchema,
    size: sizeSchema,
  });
  let fieldSchema = Joi.array().items(eachFileSchema);
  if (required && !isCancel && !(visibility === false)) fieldSchema = fieldSchema.required();
  fieldSchema = fieldSchema.label(field_name);
  if (validation_data && validation_data.is_multiple && !(visibility === false)) {
    // fieldSchema = fieldSchema
    //     .min(1)
    //     .required()
    //     .messages({
    //       'array.min': `${field_name} should have atleast 1 document`,
    //       'any.required': `${field_name} should have atleast 1 document`,
    //     });
    if (validation_data.minimum_count) {
      fieldSchema = fieldSchema
        .min(validation_data.minimum_count)
        // .required()
        .messages({
          'array.min': `${field_name} should have at least ${validation_data.minimum_count} document(s)`,
          // 'any.required': `${field_name} should have at least ${validation_data.minimum_count} document(s)`,

        });
    }
    if (validation_data.maximum_count) {
      fieldSchema = fieldSchema
        .max(validation_data.maximum_count)
        // .required()
        .messages({
          'array.max': `${field_name} can have at most ${validation_data.minimum_count} document(s)`,
        });
    }
  } else {
    console.log('chcek schema', !(visibility === false), field_name);
    if (!(visibility === false) && !readOnly) {
    fieldSchema = fieldSchema
        .max(1)
        .messages({
          'array.max': `${field_name} can have at most 1 document`,
        });
    }
      if (required && !isCancel && !(visibility === false) && !readOnly) {
          console.log('field_name111', field_name, required);
        fieldSchema = fieldSchema
        .min(1)
        .max(1)
        .messages({
          'array.min': `${field_name} is required`,
          'array.max': `${field_name} can have at most 1 document`,
        });
      }
  }

  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};

export const getValidationsForCurrencyField = (
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
  userProfileData = [],
) => {
  const { field_name, field_uuid } = fieldData;

  const allowed_currency_types = [];
  jsUtils.get(validation_data, ['allowed_currency_types'], []).forEach((extension) => {
    if (userProfileData && userProfileData.allowed_currency_types
        && userProfileData.allowed_currency_types.includes(extension)) {
          allowed_currency_types.push(extension);
    }
  });
  let valueSchema = Joi.number().label(field_name);
  let currencyTypeSchema = Joi.string();
  if (required && !isCancel && !(visibility === false)) {
    valueSchema = valueSchema.required();
    currencyTypeSchema = currencyTypeSchema.required();
  } else {
    valueSchema = valueSchema.allow(EMPTY_STRING, null);
    currencyTypeSchema = currencyTypeSchema.allow(EMPTY_STRING, null);
  }
  if (!jsUtils.isEmpty(validation_data) && !(visibility === false)) {
    if (validation_data.allowed_minimum) {
      valueSchema = valueSchema.min(
        parseInt(validation_data.allowed_minimum, 10),
      );
    }
    if (validation_data.allowed_maximum) {
      valueSchema = valueSchema.max(
        parseInt(validation_data.allowed_maximum, 10),
      );
    }

    if (validation_data.allowed_currency_types) {
      currencyTypeSchema = currencyTypeSchema
        .valid(...allowed_currency_types)
        .label('Currency Type')
        .messages({
          'any.only': `Currency Type must be one of ${allowed_currency_types.toString()}.`,
        });
    }
  }
  let fieldSchema = Joi.object().keys({
    value: valueSchema,
    currency_type: currencyTypeSchema,
  });
  if (required && !isCancel && !(visibility === false)) fieldSchema = fieldSchema.required();
  else fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
  fieldSchema = fieldSchema.label(field_name);

  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};

// this function was actually refered by mobile number fields.
export const getValidationsForPhoneNumberField = (
  fieldData,
  isRequired,
  isCancel,
  isVisibility,
  t,
) => {
  const { field_name, field_uuid } = fieldData;

  let phoneNumber = Joi.string()
    .min(ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MIN_VALUE)
    .max(ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MAX_VALUE)
    .label(field_name)
    .messages({
      'string.min': `${field_name} ${TASK_VALIDATION_STRINGS(t).MUST_BE_ATLEAST} ${ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MIN_VALUE} ${TASK_VALIDATION_STRINGS(t).DIGITS_LONG}`,
      'string.max': `${field_name} ${TASK_VALIDATION_STRINGS(t).MUST_BE_LESS_THAN} ${ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MAX_VALUE} ${TASK_VALIDATION_STRINGS(t).DIGITS}`,
    });
  let countryCode = Joi.string().label(TASK_VALIDATION_STRINGS(t).COUNTRY_CODE);

  if (isRequired && !isCancel && !(isVisibility === false)) {
    phoneNumber = phoneNumber.required();
    countryCode = countryCode.required();
  } else {
    phoneNumber = phoneNumber.allow(EMPTY_STRING, null);
    countryCode = Joi.custom((value, helper) => {
      const phoneNumberValue = helper.state.ancestors[0].phone_number;
      if (
        !jsUtils.isEmpty(phoneNumberValue) &&
        phoneNumberValue.length >= ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MIN_VALUE &&
        phoneNumberValue.length <= ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MAX_VALUE
      ) {
        if (jsUtils.isEmpty(value)) {
          return helper.message('Country code is required');
        }
      }
      return true;
    });
  }

  let fieldSchema = Joi.object().keys({
    phone_number: phoneNumber,
    country_code: countryCode,
  });
  // .label(field_name);

  if (isRequired && !isCancel && !(isVisibility === false)) fieldSchema = fieldSchema.required();
  else fieldSchema = fieldSchema.allow(EMPTY_STRING, null, {});
  fieldSchema = fieldSchema.label(field_name);

  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};

export const getValidationsforDropdownField = (
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
  values,
  excludeNull,
) => {
  const { field_name, field_uuid } = fieldData;

  let fieldSchema = values ? Joi.string().valid(...values) : Joi.string();
  if (required && !isCancel && !(visibility === false)) fieldSchema = fieldSchema.required();
  else if (!excludeNull) fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
  fieldSchema = fieldSchema.label(field_name);

  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};

export const getValidationsforRadioField = (
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
  excludeNull,
  values,
) => {
  const { field_name, field_uuid } = fieldData;

  let fieldSchema = values ? Joi.string().valid(...values) : Joi.string();
  if (required && !isCancel && visibility !== false) fieldSchema = fieldSchema.required();
  else if (!excludeNull) fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
  fieldSchema = fieldSchema.label(field_name);

  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};

export const getValidationsforCheckboxField = (
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
  valids = [],
) => {
  const { field_name, field_uuid } = fieldData;

  const valueSchema = jsUtils.isEmpty(valids)
    ? Joi.string()
    : Joi.string()
      .valid(...valids)
      .label(field_name);
  let fieldSchema = Joi.array().items(valueSchema);
  if (required && !isCancel && !(visibility === false)) fieldSchema = fieldSchema.min(1).required();
  fieldSchema = fieldSchema.label(field_name);

  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};

export const getValidationsforYesOrNoField = (
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
  excludeNull,
) => {
  const { field_name, field_uuid } = fieldData;

  let fieldSchema = Joi.bool();
  if (required && !isCancel && !(visibility === false)) fieldSchema = fieldSchema.required();
  else if (!excludeNull) fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
  fieldSchema = fieldSchema.label(field_name);

  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};

export const getValidationsForUserTeamPickerField = (
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
  t = () => {},
  isRequiredValidation = false,
) => {
  const { field_name, field_uuid } = fieldData;

  let fieldSchema = Joi.object();
  if (validation_data.is_restricted) {
    /**
     * Only allowed user list will be listed in the user picker,
     * hence this valdiation is not needed while selecting user picker value.
     * But while updating existing values, some user picker values, might be invalid, it will be handled from server response.
    */
    // if (validation_data.restricted_user_team.teams) {
    //   fieldSchema = fieldSchema
    //   .keys({
    //     teams: Joi.array().items(Joi.string().valid(...validation_data.restricted_user_team.teams)),
    //   })
    //   .label(field_name)
    //   .messages({ 'any.only': `${field_name} must contain valid users or teams` });
    // }
    // if (validation_data.restricted_user_team.users) {
    //   fieldSchema = fieldSchema
    //   .keys({
    //     users: Joi.array().items(Joi.string().valid(...validation_data.restricted_user_team.users)),
    //   })
    //   .label(field_name)
    //   .messages({ 'any.only': `${field_name} must contain valid users or teams` });
    // }
  }

  if (required && !isCancel && !(visibility === false)) {
    fieldSchema = validation_data.max_selection
      ? fieldSchema
        .keys()
        .max(1)
        .required()
        .messages({
          'object.max': `${field_name} ${t('validation_constants.utility_constant.should_have_one')}`,
        })
      : fieldSchema
        .keys()
        .min(1)
        .required()
        .messages({
          'object.min': isRequiredValidation ? `${field_name} ${t('validation_constants.utility_constant.is_required')}` : `${field_name} ${t('validation_constants.utility_constant.should_have_one_atleast')}`,
          // fieldSchema = fieldSchema.keys().min(1).required().messages({
          //   'object.min': `${field_name} should have atleast one user`,
        });
  } else fieldSchema = fieldSchema.allow(EMPTY_STRING, null);
  fieldSchema = fieldSchema.label(field_name);

  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};

const userPickerFieldMinMaxValidations = (fieldValue, field, t = () => {}) => {
  if (!jsUtils.isEmpty(field.validations)) {
    if (field.validations.allow_multiple) {
      if (field.validations.allow_maximum_selection) {
        if (field.validations.allow_minimum_selection && ((!jsUtils.isEmpty(fieldValue)) && (!jsUtils.isEmpty(fieldValue.users)) && (fieldValue.users.length < field.validations.minimum_selection))) {
          return `${t('validation_constants.utility_constant.atleast')} ${field.validations.minimum_selection} ${t('validation_constants.utility_constant.users_must')}`;
        } else if (!jsUtils.isEmpty(fieldValue) && !jsUtils.isEmpty(fieldValue.users) && fieldValue.users.length > field.validations.maximum_selection) {
          return `${t('validation_constants.utility_constant.only')} ${field.validations.maximum_selection} ${t('validation_constants.utility_constant.users_can')}`;
        }
      }
      if (field.validations.allow_minimum_selection) {
        if (!jsUtils.isEmpty(fieldValue) && !jsUtils.isEmpty(fieldValue.users) && (fieldValue.users.length < field.validations.minimum_selection)) {
          return `${t('validation_constants.utility_constant.atleast')} ${field.validations.minimum_selection} ${t('validation_constants.utility_constant.users_must')}`;
        }
      }
    } else {
      if (!jsUtils.isEmpty(fieldValue) && !jsUtils.isEmpty(fieldValue.users) && fieldValue.users.length > 1) {
        return `${t('validation_constants.utility_constant.only')} ${1} ${t('validation_constants.utility_constant.users_can')}`;
      }
    }
  }
  return EMPTY_STRING;
};

export const getTableUniqueColumnMessage = (tableData, uniqueColumnUuid, ignoreNullValues = true) => {
  console.log('tableData Recieved', tableData, typeof uniqueColumnUuid);
  let uniqueColumnValidationMessage = EMPTY_STRING;
  const uniqueColumnDataArray = [];
  const notUniqueIndices = [];
  tableData.forEach((rowData) => {
    if (uniqueColumnUuid in rowData) {
      if (Array.isArray(rowData[uniqueColumnUuid])) {
        console.log('typeof rowData[uniqueColumnUuid]', typeof rowData[uniqueColumnUuid]);
        const temp = [...rowData[uniqueColumnUuid]];
        uniqueColumnDataArray.push(JSON.stringify(temp.sort()));
      } else {
        uniqueColumnDataArray.push(rowData[uniqueColumnUuid]);
      }
    } else {
      uniqueColumnDataArray.push('');
    }
  });
  const filteredUniqueColumnDataArray = uniqueColumnDataArray;

  console.log('arrayUniqueByKey123', filteredUniqueColumnDataArray);
  switch (typeof tableData[0][uniqueColumnUuid]) {
    case 'number':
    case 'string':
    case 'array':
    case 'object':
    case 'boolean':
    case 'undefined':
      let unique = true;
      for (let i = 0; i < filteredUniqueColumnDataArray.length; i++) {
        const iValue = filteredUniqueColumnDataArray[i];
        if (iValue !== null && iValue !== undefined && iValue !== '') {
          for (let j = i + 1; j < filteredUniqueColumnDataArray.length; j++) {
            const jValue = filteredUniqueColumnDataArray[j];
            if (jValue !== null && jValue !== undefined && jValue !== '') {
              if (jsUtils.isEqual(filteredUniqueColumnDataArray[i], filteredUniqueColumnDataArray[j])) {
                unique = false;

                if (typeof tableData[0][uniqueColumnUuid] === 'object' &&
                  ((!ignoreNullValues && (tableData[0][uniqueColumnUuid] === null)) || (
                    ignoreNullValues &&
                    !Array.isArray(filteredUniqueColumnDataArray[i]) &&
                    !Object.values(filteredUniqueColumnDataArray[i]).includes(EMPTY_STRING)
                  )
                  )) {
                  uniqueColumnValidationMessage = 'Duplicate value found';
                  notUniqueIndices.push(i);
                  notUniqueIndices.push(j);
                } else {
                  uniqueColumnValidationMessage = 'Duplicate value found';
                  notUniqueIndices.push(i);
                  notUniqueIndices.push(j);
                }
              }
            }
          }
        }
      }
      console.log('check if unique after nested', unique, notUniqueIndices);
      break;
    default: break;
  }
  return [uniqueColumnValidationMessage, notUniqueIndices];
};

export const userPickerFieldValidations = (fieldValue, field, visibility, isSaveTask = false, t = () => {}) => {
  const pref_locale = localStorage.getItem('application_language');
  if (
    (field.required || (visibility)) && !field.read_only
  ) {
    if (visibility && field.required && !isSaveTask) {
      if (jsUtils.isEmpty(fieldValue) || jsUtils.isEmpty(fieldValue.users)) return `${field?.translation_data?.[pref_locale]?.field_name || field.field_name} ${TASK_VALIDATION_STRINGS(t).IS_REQUIRED}`;
      else return userPickerFieldMinMaxValidations(fieldValue, field, t);
    } else if (visibility) {
      return userPickerFieldMinMaxValidations(fieldValue, field, t);
    }
  }
  return EMPTY_STRING;
};

export const getValidationsForDataListPickerField = (
  validation_data,
  fieldData,
  required,
  isCancel,
  visibility,
) => {
  const { field_name, field_uuid } = fieldData;

  let fieldSchema = Joi.array().items(Joi.any());
  if (required && !isCancel && !(visibility === false)) {
    fieldSchema = fieldSchema.min(1).required();
  } else fieldSchema = fieldSchema.allow(EMPTY_STRING, null);

  if (!jsUtils.isEmpty(validation_data) && !(visibility === false)) {
    if (validation_data.maximum_selection) {
      console.log('getValidationsForDataListPickerField inside', fieldSchema);
      if (!(required && !isCancel && !(visibility === false))) {
        fieldSchema = fieldSchema.max(validation_data.maximum_selection).optional().allow(EMPTY_STRING, null).messages({
          'array.max': `${field_name} can have at most ${validation_data.maximum_selection} entries`,

        });
      } else {
        fieldSchema = fieldSchema
          .max(validation_data.maximum_selection)
          .min(1)
          // .required()
          .messages({
            'array.max': `${field_name} can have most ${validation_data.maximum_selection} entries`,
            'array.min': `${field_name} is required`,

          });
      }
    } else {
      if (!validation_data.allow_multiple) {
      if (!(required && !isCancel && !(visibility === false))) {
        fieldSchema = fieldSchema.max(1).optional().allow(EMPTY_STRING, null).messages({
          'array.max': `${field_name} can have at most ${1} entries`,
        });
      } else {
        fieldSchema = fieldSchema
          .max(validation_data?.maximum_selection || 1)
          .min(1)
          // .required()
          .messages({
            'array.max': `${field_name} can have most ${1} entries`,
            'array.min': `${field_name} is required`,

          });
      }
    }
  }
  }
  fieldSchema = fieldSchema.label(field_name);
  console.log('getValidationsForDataListPickerField return', fieldSchema);

  if (fieldData?.isHiddenFieldValidation) {
    return {
      [`is_hidden_${field_uuid}`]: Joi.bool().optional(),
      [field_uuid]: Joi.when(`is_hidden_${field_uuid}`, {
        is: true,
        then: Joi.optional(),
        otherwise: fieldSchema,
      }),
    };
  }

  return fieldSchema;
};

export const getUserTeamPickerMinMaxErrors = (
  submissionData,
  sections,
  visibility,
  isSaveTask,
  userProfileData,
  working_days,
  getValidationTableAddRowData,
  t = () => {},
) => {
  if (sections) {
    let errorList = {};
    sections.forEach((section) => {
      if (
           jsUtils.get(visibility, ['visible_sections', section.section_uuid], null) &&
           section.field_list
         ) {
          section.field_list.forEach((eachFieldList) => {
            if (eachFieldList.fields) {
              if (
                  eachFieldList.field_list_type === FIELD_LIST_TYPE.TABLE &&
                  jsUtils.get(visibility, ['visible_tables', eachFieldList.table_uuid], null)
                ) {
                const { table_validations = {} } = eachFieldList;
                if (
                    table_validations.is_unique_column_available &&
                    submissionData[eachFieldList.table_uuid] &&
                    submissionData[eachFieldList.table_uuid].length > 1
                  ) {
                      const [uniqueColumnValidationMessage, notUniqueIndices] = getTableUniqueColumnMessage(
                        submissionData[eachFieldList.table_uuid],
                        table_validations.unique_column_uuid.toString(),
                        );

                      if (uniqueColumnValidationMessage) {
                        errorList = {
                          ...errorList,
                          [eachFieldList.table_uuid]: uniqueColumnValidationMessage,
                          [`${eachFieldList.table_uuid}non_unique_indices`]: notUniqueIndices,
                        };
                      }
                  }
                if (
                  (visibility.visible_tables[eachFieldList.table_uuid] === true)
                ) {
                  const tableRowsCount = submissionData[eachFieldList.table_uuid].length || 0;
                  let nonEmptyTableRowsCount = 0;
                  const areAllColumnsReadOnly = areAllFieldsReadOnly(eachFieldList.fields);
                  const areAllColumnsDisabled = areAllFieldsDisabled(eachFieldList.fields);
                  if (!areAllColumnsReadOnly && !areAllColumnsDisabled) {
                    submissionData[eachFieldList.table_uuid].forEach((tableRow) => {
                      if (!jsUtils.isEmpty(tableRow)) {
                        const tableRowKeys = Object.keys(tableRow);
                        if (tableRowKeys.length > 1 || ((tableRowKeys.length === 1) && (tableRowKeys[0] !== 'temp_row_uuid'))) nonEmptyTableRowsCount++;
                      }
                    });
                  } else nonEmptyTableRowsCount = tableRowsCount;
                  if (!jsUtils.isEmpty(table_validations)) {
                    if (table_validations.is_minimum_row) {
                      if (nonEmptyTableRowsCount < table_validations.minimum_row) {
                        errorList = {
                          ...errorList,
                          [eachFieldList.table_uuid]: `Atleast ${table_validations.minimum_row} rows must be added`,
                        };
                      } else if (
                        table_validations.is_maximum_row &&
                        (nonEmptyTableRowsCount > table_validations.maximum_row)
                      ) {
                        errorList = {
                          ...errorList,
                          [eachFieldList.table_uuid]: `Only ${table_validations.maximum_row} rows can be added`,
                        };
                      }
                    } else if (
                      table_validations.is_maximum_row &&
                      (nonEmptyTableRowsCount > table_validations.maximum_row)
                    ) {
                      errorList = {
                        ...errorList,
                        [eachFieldList.table_uuid]: `Only ${table_validations.maximum_row} rows can be added`,
                      };
                    }
                  }
                }
              }
              eachFieldList.fields.forEach((field) => {
                let errorKey;
                let fieldValue;
                if (
                    eachFieldList.field_list_type === FIELD_LIST_TYPE.TABLE &&
                    jsUtils.get(visibility, ['visible_tables', eachFieldList.table_uuid], null)
                  ) {
                  const tableValue = getValidationTableAddRowData(eachFieldList, submissionData);
                  if (!jsUtils.isEmpty(tableValue) && !jsUtils.isEmpty(tableValue[[eachFieldList.table_uuid]])) {
                    tableValue[[eachFieldList.table_uuid]].map((data, index) => {
                      if (field.field_type === FIELD_TYPES.USER_TEAM_PICKER) {
                        errorKey = `${eachFieldList.table_uuid},${index},${[field.field_uuid]}`;
                        fieldValue = data[field.field_uuid];
                        const isVisibile = visibility && visibility.visible_fields && visibility.visible_fields[field.field_uuid];
                        const error = userPickerFieldValidations(fieldValue, field, isVisibile, isSaveTask, t);
                        if (!jsUtils.isEmpty(error)) {
                          errorList = { ...errorList, [errorKey]: error };
                        }
                      }
                      return null;
                    });
                  }
                } else {
                  errorKey = field.field_uuid;
                  fieldValue = submissionData[field.field_uuid];
                  if (field.field_type === FIELD_TYPES.USER_TEAM_PICKER) {
                    const isVisibile = visibility && visibility.visible_fields && visibility.visible_fields[errorKey];
                    const error = userPickerFieldValidations(fieldValue, field, isVisibile, isSaveTask, t);
                    if (!jsUtils.isEmpty(error)) {
                      errorList = { ...errorList, [errorKey]: error };
                    }
                  }
                }
              });
            }
          });
      }
    });
    console.log('userpicker fields error', errorList);
    return errorList;
  }
  return {};
};

export const constructIndividualFieldSchema = (field, { isVisibile, requiredCheck, isCancel, isTable }, workingDaysArray, formData, fieldBasedValidationSectionData, userProfileData, { t, pref_locale }) => {
  let fieldSchema;
  const fieldData = {
    field_name: field?.translation_data?.[pref_locale]?.field_name || field.field_name,
    field_uuid: field.field_uuid,
    isHiddenFieldValidation: isTable,
  };
  switch (field.field_type) {
    case FIELD_TYPES.SINGLE_LINE:
      fieldSchema = getValidationsForSingleLine(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
      );
      break;
    case FIELD_TYPES.INFORMATION:
      fieldSchema = getValidationsForInfoField(fieldData);
      break;
    case FIELD_TYPES.LINK:
      fieldSchema = getValidationsForLinkField(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
        t,
      );
      break;
    case FIELD_TYPES.PARAGRAPH:
      fieldSchema = getValidationsForParagraphField(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
      );
      break;
    case FIELD_TYPES.NUMBER:
      fieldSchema = getValidationsForNumberField(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
        t,
      );
      break;
    case FIELD_TYPES.EMAIL:
      fieldSchema = getValidationsForEmailField(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
      );
      break;
    case FIELD_TYPES.DATE:
    case FIELD_TYPES.DATETIME:
      fieldSchema = getValidationsForDateField(
        field.read_only,
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        field.field_type,
        isCancel,
        isVisibile,
        workingDaysArray,
        formData,
        fieldBasedValidationSectionData,
        t,
      );
      break;
    case FIELD_TYPES.FILE_UPLOAD:
      fieldSchema = getValidationsForFileUploadField(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
        userProfileData,
        field.read_only,
      );
      break;
    case FIELD_TYPES.CURRENCY:
      fieldSchema = getValidationsForCurrencyField(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
        userProfileData,
      );
      break;
    case FIELD_TYPES.PHONE_NUMBER:
      fieldSchema = getValidationsForPhoneNumberField(
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
      );
      break;
    case FIELD_TYPES.DROPDOWN:
    case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
      fieldSchema = getValidationsforDropdownField(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
        field.values,
      );
      break;
    case FIELD_TYPES.RADIO_GROUP:
      fieldSchema = getValidationsforRadioField(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
        null,
        field.values,
      );
      break;
    case FIELD_TYPES.CHECKBOX:
      fieldSchema = getValidationsforCheckboxField(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
        field.values,
      );
      break;
    case FIELD_TYPES.YES_NO:
      fieldSchema = getValidationsforYesOrNoField(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
      );
      break;
    case FIELD_TYPES.USER_TEAM_PICKER:
      fieldSchema = getValidationsForUserTeamPickerField(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
        t,
      );
      break;
    case FIELD_TYPES.DATA_LIST:
      fieldSchema = getValidationsForDataListPickerField(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
      );
      break;
    case FIELD_TYPES.SCANNER:
      fieldSchema = getValidationsForScanner(
        field.validations,
        fieldData,
        requiredCheck ? field.required : false,
        isCancel,
        isVisibile,
      );
      break;
    default:
      fieldSchema = getDefaultFieldValidations(fieldData);
      break;
  }

  if (isTable) return fieldSchema;
  return { [field.field_uuid]: fieldSchema };
};

export const constructSchemaFromData = (
  sections,
  isCancel,
  all_visibility,
  requiredCheckIsNeeded = true,
  userProfileData,
  workingDaysArray,
  formData,
  fieldBasedValidationSectionData = [],
  t,
) => {
  const pref_locale = localStorage.getItem('application_language');
  const { visible_sections = {}, visible_tables = {}, visible_fields = {} } = all_visibility;
  const finalFormSchema = {};
  const formSchema = sections.flatMap((section) => {
    if (visible_sections[section.section_uuid] && section.field_list) {
      return section.field_list.flatMap((eachFieldList) => {
        let fieldSchema = null;

        const isTable = (eachFieldList.field_list_type === FIELD_LIST_TYPE.TABLE);

        if (
            (
              isTable ?
             visible_tables[eachFieldList.table_uuid] : true
            ) &&
            eachFieldList.fields
          ) {
              fieldSchema = eachFieldList.fields
                .filter((field) => visible_fields[field.field_uuid])
                .map((field) => {
                  const requiredCheck = requiredCheckIsNeeded && !field.read_only;
                  const allowModifyExistingData = isTable ? eachFieldList?.table_validations?.allow_modify_existing : true;
                  console.log('tabledetailsss', eachFieldList);
                  const isVisibile = visible_fields ? visible_fields[field.field_uuid] : null;
                  return constructIndividualFieldSchema(
                    field,
                    {
                      isVisibile,
                      requiredCheck: requiredCheck && allowModifyExistingData,
                      isCancel,
                      isTable: isTable,
                    },
                    workingDaysArray,
                    formData,
                    fieldBasedValidationSectionData,
                    userProfileData,
                    { t, pref_locale },
                  );
                });
          }
          if (
              eachFieldList.field_list_type === FIELD_LIST_TYPE.TABLE &&
              visible_tables[eachFieldList.table_uuid]
            ) {
              fieldSchema = [
                {
                  [eachFieldList.table_uuid]: Joi.array().items(
                    Joi.object()
                      .keys(Object.assign({}, ...fieldSchema))
                      .append({ _id: Joi.string().optional() }),
                  ),
                },
              ];
           }
        return fieldSchema;
      });
    }
    return [];
  });
  formSchema.forEach((fields) => {
    if (fields) {
      const keys = Object.keys(fields);
      keys.forEach((key) => {
        finalFormSchema[key] = fields[key];
      });
    }
  });
  return Joi.object().keys(finalFormSchema);
};

export const nonFormValidateSchema = Joi.object().keys({
  comments: SUBMIT_TASK_COMMENTS,
});

export const testBedValidateSchema = Joi.object().keys({
  complete_as_user: TEST_ASSIGNEES,
});

export const cancelTaskFormValidateSchema = Joi.object().keys({
  cancel_reason: Joi.string()
    .min(1)
    .max(2000)
    .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
    .label(TASK_CONTENT_STRINGS.CANCEL_TASK.FORM.MESSAGE.ERROR_MESSAGAE_LABEL),
});

export const adhocCommentsSchema = Joi.object().keys({
  task_log_id: Joi.string().required(),
  notes: SUBMIT_TASK_COMMENTS.label(LANDING_PAGE_VALIDATION.ADHOC_COMMENTS_LABEL).required(),
  postNoteAttachments: Joi.optional(),
  document_url_details: Joi.optional(),
  flow_uuid: Joi.optional(),
  instance_id: Joi.optional(),
  data_list_uuid: Joi.optional(),
  data_list_entry_id: Joi.optional(),
});

export default constructSchemaFromData;
