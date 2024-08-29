import i18next from 'i18next';
import { CONFIRM_PASSWORD_LABEL } from 'containers/sign_in/invite_user/newPassword/newPassword.strings';
import { FIELD_NAME } from '../components/form_builder/FormBuilder.strings';
import { OTHER_SETTINGS_FORM } from '../containers/admin_settings/other_settings/OtherSettings.strings';
import { FLOW_STRINGS } from '../containers/flows/Flow.strings';
import { RESET_PASSWORD_STRINGS } from '../containers/reset_password/ResetPassword.strings';
import { SIGN_IN_PASSWORD } from '../containers/sign_in/SignIn.strings';
import { ADDITIONAL_DETAILS_STRINGS } from '../containers/sign_up/additional_details/AdditionalDetails.strings';
import { ACTORS } from '../containers/task/task/Task.strings';
import { NEW_PASSWORD } from '../containers/user_settings/change_password/ChangePassword.strings';
import { generateFieldId } from './generatorUtils';
import jsUtils, { nullCheck, translateFunction } from './jsUtility';
import { NEW_PASSWORD_REGEX } from './strings/Regex';
import { STRING_VALIDATION } from './ValidationConstants';
import { VALIDATION_CONSTANT } from './constants/validation.constant';

/** @module joi * */
/**
 * @memberof joi
 */
/**
 * @function joiValidate
 * @description To evaluate given schema and data using joi validation
 * @param   {Object} data Data to validate
 * @param   {Object} schema Schema against which you want to validate
 * @return  Return either error object or false if no errors
 */
 export const joiValidate = (data, schema) => {
    if (!jsUtils.isEmpty(schema)) {
      const errors = schema.validate(data || {}, {
        abortEarly: false,
      });
      return errors.error;
    }
    return false;
  };
/**
 * @memberof joi
 */
/**
 * @function generateValidationMessage
 * @description to get raw error returned from joi and constructed meaningful string based on that
 * @param   {Object} errors errors object
 * @return  {string} constructed error message
 */
 export const generateValidationMessage = (errors, t = translateFunction) => {
    const error_list = {};
    let message = null;
    console.log('task error joi', errors);
    if (errors) {
      console.log('task error joi inside', errors.details);
      errors.details.forEach((element) => {
        console.log('Joi Error Object', element);
        if (!nullCheck(element.context.value)) {
          if (element.context.label === SIGN_IN_PASSWORD) {
            message = t(VALIDATION_CONSTANT.PASSWORD_REQUIRED);
          } else if (
            element.type
            && (element.type.includes('array.includesRequiredUnknowns')
              || element.type.includes('array.base'))
          ) {
            if (
              element.context.label === 'teams'
              || element.context.label === 'users'
            ) {
              message = t(VALIDATION_CONSTANT.STEP_ACTOR_REQUIRED);
            } else message = element.message;
        } else message = `${element.context.label} is required`;
          // else if (
          //   element.context.label === OTHER_SETTINGS_FORM.SESSION_TIMEOUT.LABEL ||
          //   element.context.label === OTHER_SETTINGS_FORM.PASSWORD_AGE.LABEL ||
          //   element.context.label === OTHER_SETTINGS_FORM.STAY_LOGGED_IN.LABEL ||
          //   element.context.label === OTHER_SETTINGS_FORM.MAXIMUM_FILE_SIZE.LABEL ||
          //   element.context.label === OTHER_SETTINGS_FORM.DOCUMENT_EXPIRY_TIME.LABEL
          // )
          //   message = `${element.context.label} must be larger than or equal to 1`;
          // else message = `${element.context.label} is required`;
        } else if (
          element.type
          && (element.type.includes('regex') || element.type.includes('pattern'))
        ) {
          const newPasswordSchema = STRING_VALIDATION.regex(NEW_PASSWORD_REGEX);
          const newPasswordError = newPasswordSchema.validate(
            element.context.value,
          );
          if (
            element.context.label
              === ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.LABEL
            || element.context.label
              === RESET_PASSWORD_STRINGS.FORM_LABEL.CONFIRM_PASSWORD.LABEL
            || (element.context.label === NEW_PASSWORD && newPasswordError.error)
          ) {
            message = `${element.context.label} ${t(VALIDATION_CONSTANT.ATLEAST_ONE_ALPHABET_OR_NUMBER_REQUIRED)}`;
          } else if (
            element.context.label === SIGN_IN_PASSWORD
            || element.context.label === NEW_PASSWORD
          ) {
            console.log('sign password error captured2');

            message = t(VALIDATION_CONSTANT.INVALID_PASSWORD);
          } else if (
            element.context.label
              === OTHER_SETTINGS_FORM.ALLOWED_EXTENSIONS.LABEL
            || element.context.label
              === OTHER_SETTINGS_FORM.ALLOWED_CURRENCY_TYPES.LABEL
          ) {
            message = `${element.context.label} ${t(VALIDATION_CONSTANT.MUST_BE_ONLY_CHARACTERS)}`;
          } else if (element.context.label === FIELD_NAME.LABEL) {
            message = `${element.context.label} ${t(VALIDATION_CONSTANT.SPECIAL_CHARACTERS_NOT_ALLOWED)}`;
          } else message = `Invalid ${element.context.label}`;
        } else if (element.type && element.type.includes('string.min')) {
          if (element.context.label === SIGN_IN_PASSWORD) message = t(VALIDATION_CONSTANT.INVALID_PASSWORD);
          else message = element.message;
        } else if (element.type && element.type.includes('any.only')) {
          if (element.context.label === CONFIRM_PASSWORD_LABEL) message = t(VALIDATION_CONSTANT.PASSWORD_MISMATCH);
          else message = element.message;
        } else if (element.type && element.type.includes('array.min')) {
          if (element.context.label === FLOW_STRINGS.STEPS.ID) message = t(VALIDATION_CONSTANT.ATLEAST_ONE_STEP_REQUIRED);
          else message = element.message;
        } else if (element.type && element.type.includes('object.min')) {
          if (element.context.label === ACTORS.MEMBER_OR_TEAM.ASSIGN_TO.ID) message = i18next.t(VALIDATION_CONSTANT.ASSIGN_ONE_USER_OR_TEAM_FOR_TASK);
          else if (element.context.label === 'assignees') message = t(VALIDATION_CONSTANT.STEP_ACTOR_REQUIRED);
          else if (element.context.label === 'Viewers') message = t(VALIDATION_CONSTANT.ATLEAST_ONE_VIEWER_REQUIRED);
          else if (element.context.label === 'Owners') message = t(VALIDATION_CONSTANT.ATLEAST_ONE_OWNER_REQUIRED);
          else if (element.context.label === 'entry adders') message = t(VALIDATION_CONSTANT.ATLEAST_ONE_ADDER_REQUIRED);
          else message = element.message;
        } else if (element.type && element.type.includes('any.invalid')) {
          if (element.context.label === NEW_PASSWORD) message = t(VALIDATION_CONSTANT.SAME_NEW_PASSWORD);
          else message = element.message;
        } else if (
          element.message
          && element.message.includes(t(VALIDATION_CONSTANT.DUPLICATE_VALUE))
        ) {
          message = `${element.context.label} ${t(VALIDATION_CONSTANT.HOLD_DUPLICATE)}`;
        } else if (
          element.message
          && element.message.includes(t(VALIDATION_CONSTANT.MUST_BE_ONE_OF))
        ) {
          message = `${element.context.label} mismatch`;
        } else if (element.type && element.type.includes('date.min')) {
          message = `${element.context.label} ${t(VALIDATION_CONSTANT.GREATER_THAN_START_TIME)}`;
        } else message = element.message.replace(/"/g, '');
        let { key } = element.context;
        if (key !== element.path[0]) {
          key = generateFieldId(element.path[0], element.path[1]);
          // if (element.path[element.path.length - 1]) key = element.path[element.path.length - 1];
          if (element.path.length > 1) {
            key = element.path.map((path) => path);
            console.log(typeof key);
            // key = key.replace(',', '.');
          }
        }
        if (element.path[0] === 'steps' && element.path[1] + 1) error_list.step_order = element.path[1] + 1;
        if (!error_list[key]) {
          error_list[key] = message;
        }
        message = null;
      });
    }
    return error_list;
  };
/**
 * @memberof joi
 */
  /**
   * @function validate
   * @description To evaluate given schema and data using joi validation
   * @param   {Object} data Data to validate
   * @param   {Object} schema Schema against which you want to validate
   * @return  function
   */
  export const validate = (data, schema, t = translateFunction) => generateValidationMessage(joiValidate(data, schema), t);

export default joiValidate;
