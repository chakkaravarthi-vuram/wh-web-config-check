import Joi from 'joi';
import { translateFunction } from '../../../../../utils/jsUtility';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { JOIN_PARALLEL_PATHS_STRINGS, JOIN_TYPE } from './JoinParallelPaths.constants';

export const getJoinConfigValidation = (strings, validSteps, t, depth = 0) => Joi.object().keys({
        type: Joi.string().required(),
        stepUuids: Joi.when('type', {
            is: JOIN_TYPE.SPECIFIC_STEPS,
            then: Joi.array()
                .items(Joi.string().valid(...validSteps))
                .min(1)
                .required()
                .label(strings.STEP_UUID)
                .messages({
                    'array.min': strings.VALIDATION_MESSAGE.STEP_UUID_REQUIRED,
                    'any.only': strings.VALIDATION_MESSAGE.INVALID_STEPS_ADDED,
                }),
            otherwise: Joi.forbidden(),
        }),
        condition: Joi.when('type', {
            is: JOIN_TYPE.CONDITIONAL,
            then: Joi.array()
                .items(
                    Joi.object().keys({
                        rule: Joi.string().required().label(strings.CONDITION),
                        joinConfig: depth <= 1 && Joi.array()
                            .items(
                                getJoinConfigValidation(strings, validSteps, t, depth + 1),
                            ).min(1).required(),
                    }))
                .required()
                .min(1),
            // .messages({
            //     'array.min': strings.VALIDATION.STEPS,
            // }),
            otherwise: Joi.forbidden(),
        }),
        stepCount: Joi.when('type', {
            is: JOIN_TYPE.ATLEAST_N_FLOWS,
            then: Joi
                .number()
                .min(1)
                .max(validSteps.length)
                .required()
                .label(strings.STEP_COUNT),
            otherwise: Joi.forbidden(),
        }),
    });

export const joinParallelPathValidationSchema = (t = translateFunction, validSteps = []) => {
    const strings = JOIN_PARALLEL_PATHS_STRINGS(t);
    return constructJoiObject({
        ...basicNodeValidationSchema(t),
        joinConfig: Joi.array().items(
            getJoinConfigValidation(strings, validSteps, t),
        ),
    });
};
