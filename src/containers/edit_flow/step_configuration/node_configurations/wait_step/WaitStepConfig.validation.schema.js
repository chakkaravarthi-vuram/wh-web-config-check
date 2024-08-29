import Joi from 'joi';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { translateFunction } from '../../../../../utils/jsUtility';
import { DATE_FIELD_LABEL, DURATION_LABEL } from '../../../../../utils/strings/CommonStrings';
import {
    DURATION_TYPE_VALUE,
    EVENT_TYPE,
    TIMER_TYPE,
} from './WaitStepConfig.constants';
import { WAIT_STEP_ERRORS } from './WaitStepConfig.strings';

const { DAY, HOUR, MINUTE } = DURATION_TYPE_VALUE;

export const waitStepValidationSchema = (t = translateFunction) =>
    constructJoiObject({
        ...basicNodeValidationSchema(t),
        timerDetails: Joi.object().keys({
            timerType: Joi.number().required(),
            timerData: Joi.when('timerType', {
                is: TIMER_TYPE.FORM_FIELD_VALUE,
                then: Joi.object().keys({
                    fieldUuid: Joi.string().required().label(t(DATE_FIELD_LABEL)),
                    eventType: Joi.string().valid(EVENT_TYPE.ON_TIME),
                }),
                otherwise: Joi.object().keys({
                    duration: Joi.number().required().label(t(DURATION_LABEL)).min(1)
                        .when('durationType', {
                            is: DAY,
                            then: Joi.number().max(365),
                            otherwise: Joi.number().max(60).when('durationType', {
                                is: HOUR,
                                then: Joi.number().max(23),
                                otherwise: Joi.number().min(6).max(59).messages({
                                    'number.min': t(WAIT_STEP_ERRORS.MINUTES_MIN_VALUE),
                                }),
                            }),
                        })
                        .messages({
                            'number.min': t(WAIT_STEP_ERRORS.DURATION_MIN_VALUE),
                        }),
                    durationType: Joi.string().required().valid(DAY, HOUR, MINUTE),
                }),
            }),
        }),
    });
