import Joi from 'joi';
import { START_STEP_CONFIGURATION_STRINGS } from './StartStepConfiguration.strings';
import { translateFunction } from '../../../../../utils/jsUtility';
import { VALIDATION_ERROR_TYPES } from '../../../../../utils/strings/CommonStrings';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';

export const commonValidationSchema = (t = translateFunction) => {
  return {
    stepName: basicNodeValidationSchema(t)?.stepName,
    hasAutoTrigger: Joi.bool().required(),
    initiators: Joi.when('hasAutoTrigger', {
      is: false,
      then: Joi.object().keys({
        teams: Joi.array().min(1),
        users: Joi.array().min(1),
      })
      .or('users', 'teams')
      .required()
      .label(START_STEP_CONFIGURATION_STRINGS(t).GENERAL.INTIATORS.USER_OR_TEAM)
      .messages({
        [VALIDATION_ERROR_TYPES.OBJECT_MISSING]: START_STEP_CONFIGURATION_STRINGS(t).GENERAL.INTIATORS.USER_OR_TEAM_REQUIRED,
      }),
      otherwise: Joi.optional(),
    }),
    allowCallByFlow: Joi.bool().required(),
    allowCallByApi: Joi.bool().required(),
  };
};
