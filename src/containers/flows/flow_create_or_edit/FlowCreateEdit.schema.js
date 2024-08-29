import Joi from 'joi';
import { FLOW_SECURITY_CONSTANTS } from './FlowCreateOrEdit.constant';
import { FLOW_ADDON_STRINGS } from '../flow_landing/flow_details/flow_add_on/FlowAddOn.strings';
import { EDIT_BASIC_DETAILS } from '../flow_landing/FlowLanding.constant';
import { FLOW_VALIDATION_STRINGS } from '../../edit_flow/EditFlow.strings';
import { FLOW_DESCRIPTION_VALIDATION, FLOW_NAME_VALIDATION } from '../../../utils/ValidationConstants';
import { NAME_REGEX } from '../../../utils/strings/Regex';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { FLOW_MIN_MAX_CONSTRAINT } from '../../../utils/Constants';

const userTeamPickerSchema = () =>
  Joi.object()
    .keys({
      users: Joi.array().allow(null),
      teams: Joi.array().allow(null),
    })
    .custom((value, helpers) => {
      const users = value?.users || [];
      const teams = value?.teams || [];
      if (users.length + teams.length <= 0) {
        return helpers.error('any.required');
      }
      return value;
    });

export const flowSecuritySchema = (t) => {
  const FLOW_SECURITY = FLOW_SECURITY_CONSTANTS(t);
  return Joi.object({
    admins: userTeamPickerSchema().required().label(FLOW_SECURITY.FLOW_ADMINS),
    owners: userTeamPickerSchema().required().label(FLOW_SECURITY.FLOW_OWNERS),
    hasAutoTrigger: Joi.bool().optional(),
    initiators: Joi.when('hasAutoTrigger', {
      is: true,
      then: Joi.optional(),
      otherwise: userTeamPickerSchema().required().label(FLOW_SECURITY.FLOW_INITIATORS),
    }),
    isParticipantsLevelSecurity: Joi.boolean()
      .required()
      .label(FLOW_SECURITY.DATA_ACCESS_PERMISSIONS),
    isRowSecurityPolicy: Joi.boolean(),
  });
};

export const flowAddOnSchema = (t) => {
  const { IDENTIFIER, TECHNICAL_CONFIGURATION } = FLOW_ADDON_STRINGS(t);
  return Joi.object({
    isSystemIdentifier: Joi.boolean(),
    customIdentifier: Joi.when('isSystemIdentifier', {
      is: false,
      then: Joi.string().required().label(IDENTIFIER.UNIQUE_IDENTIFIER.LABEL),
      otherwise: Joi.optional(),
    }),
    taskIdentifier: Joi.array().items(Joi.string()).optional(),
    flowShortCode: Joi.string().optional().label(TECHNICAL_CONFIGURATION.SHORT_CODE.LABEL),
    technicalReferenceName: Joi.string().optional().label(TECHNICAL_CONFIGURATION.TECHNICAL_REFERENCE_NAME.LABEL),
    category: Joi.object().optional(),
  });
};

export const flowBasicDetailsSchema = (t) => {
  const EDIT_BASIC_STRINGS = EDIT_BASIC_DETAILS(t);
  return Joi.object().keys({
    name: FLOW_NAME_VALIDATION.required().label(
     EDIT_BASIC_STRINGS.NAME.LABEL,
    )
      .regex(NAME_REGEX)
      .messages({
        'string.max': `${FLOW_VALIDATION_STRINGS(t).NAME} ${FLOW_VALIDATION_STRINGS(t).SHOULD_NOT_EXCEED} ${FLOW_MIN_MAX_CONSTRAINT.FLOW_NAME_MAX_VALUE} ${FLOW_VALIDATION_STRINGS(t).CHARACTERS}`,
        'string.min': `${FLOW_VALIDATION_STRINGS(t).NAME} ${FLOW_VALIDATION_STRINGS(t).SHOULD_CONTAIN_ATLEAST} ${FLOW_MIN_MAX_CONSTRAINT.FLOW_NAME_MIN_VALUE} ${FLOW_VALIDATION_STRINGS(t).CHARACTERS}`,
      }),
    description: FLOW_DESCRIPTION_VALIDATION.allow(
      null,
      EMPTY_STRING,
    ).label(EDIT_BASIC_STRINGS.DESCRIPTION.LABEL)
    .messages({ 'string.max': `${FLOW_VALIDATION_STRINGS(t).DESCRIPTION} ${FLOW_VALIDATION_STRINGS(t).SHOULD_NOT_EXCEED} ${FLOW_MIN_MAX_CONSTRAINT.FLOW_DESCRIPTION_MAX_VALUE} ${FLOW_VALIDATION_STRINGS(t).CHARACTERS}` }),
  });
};
