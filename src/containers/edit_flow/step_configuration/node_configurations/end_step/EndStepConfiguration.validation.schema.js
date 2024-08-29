import Joi from 'joi';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { TERMINATE_FLOW_TYPE } from './EndStepConfig.constants';

export const endStepValidationSchema = (t) =>
    constructJoiObject({
        ...basicNodeValidationSchema(t),
        terminateFlow: Joi.bool().required(),
        terminateType: Joi.string().valid(TERMINATE_FLOW_TYPE.CANCEL, TERMINATE_FLOW_TYPE.COMPLETE),
    });
