import Joi from 'joi';
import { constructJoiObject } from '../../../../utils/ValidationConstants';
import {
  POLICY_STRINGS,
  POLICY_TYPE,
} from '../security_policy/SecurityPolicy.strings';
import { USER_FIELD_POLICY_CONSTANTS } from './UserFieldPolicy.constants';
import { USER_POLICY_STRINGS } from './UserFieldPolicy.strings';

const { TYPE, POLICY_UUID, ACCESS_TO, FIELD_UUID } =
  POLICY_STRINGS.REQUEST_KEYS;

const getSchema = (currentSchema) =>
  Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: currentSchema,
  });

export const getUserFieldPolicySchema = () =>
  constructJoiObject({
    [TYPE]: Joi.string().valid(POLICY_TYPE.USER_FIELD_BASED).required(),
    [POLICY_UUID]: Joi.string().required(),
    [ACCESS_TO]: Joi.object().keys({
      [FIELD_UUID]: Joi.array()
        .unique(USER_FIELD_POLICY_CONSTANTS.FIELD_KEY)
        .items(
          Joi.object().keys({
            key: getSchema(
              Joi.string()
                .required()
                .label(USER_POLICY_STRINGS.USER_FIELD.LABEL),
            ),
            label: Joi.optional(),
            is_deleted: Joi.optional(),
          }),
        )
        .min(1),
    }),
  });
