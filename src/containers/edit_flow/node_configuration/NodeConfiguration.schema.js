import Joi from 'joi';
import { STATUS_VALIDATION_STRINGS, STEP_NAME_AND_STATUS_STRINGS } from './NodeConfiguration.strings';
import { translateFunction } from '../../../utils/jsUtility';
import {
    constructJoiObject,
    FLOW_STEP_NAME_VALIDATION,
} from '../../../utils/ValidationConstants';
import { FLOW_MIN_MAX_CONSTRAINT } from '../../../utils/Constants';
import { VALIDATION_ERROR_TYPES } from '../../../utils/strings/CommonStrings';
import { INVALID_STEP_STATUSES } from './NodeConfiguration.constants';

export const basicNodeValidationSchema = (t = translateFunction) => {
    const STRINGS = STEP_NAME_AND_STATUS_STRINGS(t);
    return {
        stepId: Joi.string().required(),
        stepUuid: Joi.string().required(),
        stepName: FLOW_STEP_NAME_VALIDATION.required().label(t(STRINGS.STEP_NAME.LABEL)),
        stepType: Joi.string().optional(),
        stepOrder: Joi.number().required(),
        stepStatus: Joi.string().required().label(STRINGS.STATUS.LABEL),
        coordinateInfo: Joi.object().keys({
            stepCoordinates: Joi.object().keys({
                x: Joi.number().required(),
                y: Joi.number().required(),
            }),
        }),
        connectedSteps: Joi.optional(),
    };
};

export const statusCreationValidationSchema = (t = translateFunction) => constructJoiObject({
    stepStatus: Joi.string().min(FLOW_MIN_MAX_CONSTRAINT.CREATE_STATUS_MIN_VALUE).max(FLOW_MIN_MAX_CONSTRAINT.CREATE_STATUS_MAX_VALUE).label(STEP_NAME_AND_STATUS_STRINGS(t).STATUS.CREATE_STATUS.STEP_STATUS_LABEL)
        .invalid(...INVALID_STEP_STATUSES)
        .messages({ [VALIDATION_ERROR_TYPES.ANY_INVALID]: `${STATUS_VALIDATION_STRINGS(t).INVALID_STEP_STATUS}: ${INVALID_STEP_STATUSES.join(', ')}` }),
    statusOptionsList: Joi.array().unique((a, b) => (a.value === b.value))
        .messages({ [VALIDATION_ERROR_TYPES.ARRAY_UNIQUE]: STATUS_VALIDATION_STRINGS(t).DUPLICATE_STEP_STATUS }),
},
);
