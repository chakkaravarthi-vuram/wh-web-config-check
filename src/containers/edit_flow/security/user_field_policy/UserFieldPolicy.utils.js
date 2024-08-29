import { v4 as uuidV4 } from 'uuid';
import {
  POLICY_STRINGS,
  POLICY_TYPE,
} from '../security_policy/SecurityPolicy.strings';
import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';

const { TYPE, POLICY_UUID, ACCESS_TO, FIELD_UUID } =
  POLICY_STRINGS.REQUEST_KEYS;

export const getUserFieldPolicyInitialState = () => {
  const uuid = uuidV4();
  return {
    [TYPE]: POLICY_TYPE.USER_FIELD_BASED,
    [POLICY_UUID]: uuid,
    [ACCESS_TO]: {
      [FIELD_UUID]: [
        {
          key: EMPTY_STRING,
        },
      ],
    },
  };
};
