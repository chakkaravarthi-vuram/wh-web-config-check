import Joi from 'joi';
import { translateFunction } from '../../../utils/jsUtility';
import { ASSIGNEE_TYPE } from '../EditFlow.utils';
import { EMAIL_RECIPIENT_TYPE } from '../step_configuration/node_configurations/send_email/SendEmailConfig.constants';
import { SET_ASSIGNEE_STRINGS } from '../step_configuration/set_assignee/SetAssignee.strings';
import { COMMA_SEPARATED_EMAIL_REGEX } from '../../../utils/strings/Regex';
import { RECIPIENT_STRINGS } from '../step_configuration/node_configurations/send_email/SendEmailConfig.string';

const getAssigneeRuleValidation = (objectKeys, t = translateFunction, isRequired = true, isChildLevel = false) => {
  let schema = Joi
    .array()
    .items({
      [objectKeys.type]: Joi.string().required(),
      [objectKeys.userOrTeams]: Joi.when(objectKeys.type, {
        is: ASSIGNEE_TYPE.DIRECT_ASSIGNEE,
        then: Joi.object().keys({
          teams: Joi.array().min(1),
          users: Joi.array().min(1),
        })
          .or('users', 'teams')
          .required()
          .label(SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_LABELS.USER_OR_TEAM)
          .messages({
            'object.missing': SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_MESSAGE.USER_OR_TEAM,
          }),
        otherwise: Joi.forbidden(),
      }),
      [objectKeys.external]: Joi.when(objectKeys.type, {
        is: EMAIL_RECIPIENT_TYPE.EMAIL_ADDRESS,
        then: Joi.string().regex(COMMA_SEPARATED_EMAIL_REGEX).required().label(RECIPIENT_STRINGS(t).EMAIL_ADDRESS)
        .messages({
          'string.pattern.base': RECIPIENT_STRINGS(t).ERRORS.INVALID_EMAIL,
        }),
        otherwise: Joi.forbidden(),
      }),
      [objectKeys.formFields]: Joi.when(objectKeys.type, {
        is: [
          ASSIGNEE_TYPE.FORM_FIELDS,
          ASSIGNEE_TYPE.FORM_REPORTING_MANAGER_ASSIGNEE,
          EMAIL_RECIPIENT_TYPE.FORM_REPORTING_MANAGER_ASSIGNEE,
        ],
        then: Joi.array().min(1).required().label(SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_LABELS.FORM_FIELD)
          .messages({
            'object.missing': SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_MESSAGE.FORM_FIELD,
            'array.min': SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_MESSAGE.FORM_FIELD,
          }),
        otherwise: Joi.forbidden(),
      }),
      [`${objectKeys.formFields}Labels`]: Joi.optional(),
      [objectKeys.systemFields]: Joi.when(objectKeys.type, {
        is: ASSIGNEE_TYPE.SYSYEM_FIELDS,
        then: Joi.array().min(1).required().label(SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_LABELS.SYSTEM_FIELD)
          .messages({
            'object.missing': SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_MESSAGE.SYSTEM_FIELD,
            'array.min': SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_MESSAGE.SYSTEM_FIELD,
          }),
        otherwise: Joi.forbidden(),
      }),
      [`${objectKeys.systemFields}Labels`]: Joi.optional(),
      [objectKeys.ruleBased]: Joi.when(objectKeys.type, {
        is: ASSIGNEE_TYPE.RULE_BASED,
        then: Joi.array().items({
          condition_rule: Joi.string().required().label(SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_LABELS.RULE)
            .messages({ 'object.missing': SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_MESSAGE.RULE }),
          otherwise: Joi.forbidden(),
          [objectKeys.ruleBasedRecipient]: Joi.when('condition_rule', {
            is: Joi.string().required(),
            then: !isChildLevel && getAssigneeRuleValidation(objectKeys, t, isRequired, true),
            otherwise: Joi.optional(),
          }),
        }),
        otherwise: Joi.forbidden(),
      }),
    });
  if (isRequired) {
    schema = schema.min(1).required();
  }
  return schema;
};

export const getAssigneeValidationSchema = (objectKeys, isRequired = true, t = translateFunction) => Joi.object().keys({
  [objectKeys.parentKey]: getAssigneeRuleValidation(objectKeys, t, isRequired),
});
