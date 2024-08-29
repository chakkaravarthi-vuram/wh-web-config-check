import Joi from 'joi';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { BRANCH_PARALLEL_PATHS_STRINGS } from './BranchParallelPaths.strings';

export const parallelBranchValidationSchema = (t) => {
    const strings = BRANCH_PARALLEL_PATHS_STRINGS(t).GENERAL;
    return constructJoiObject({
        ...basicNodeValidationSchema(t),
        isConditional: Joi.bool().required(),
        stepUuids: Joi.when('isConditional', {
            is: false,
            then: Joi.array().min(1).required().label(strings.STEP_LABEL)
            .messages({
                'array.min': strings.VALIDATION.STEPS,
            }),
            otherwise: Joi.forbidden(),
        }),
        condition: Joi.when('isConditional', {
            is: true,
            then: Joi.array().items(Joi.object().keys({
                ruleDetails: Joi.object().min(1).required().label(strings.CONDITIONAL.TITLE)
                .messages({
                    'object.min': strings.VALIDATION.RULE,
                }),
                stepUuids: Joi.array().min(1).required().label(strings.STEP_LABEL),
            }))
                .required()
                .min(1)
                .messages({
                    'array.min': strings.VALIDATION.STEPS,
                }),
            otherwise: Joi.forbidden(),
        }),
        defaultSteps: Joi.when('isConditional', {
            is: true,
            then: Joi.array().min(1).required().label(strings.STEP_LABEL)
                .messages({
                'array.min': strings.VALIDATION.STEPS,
            }),
            otherwise: Joi.forbidden(),
        }),
    });
};
