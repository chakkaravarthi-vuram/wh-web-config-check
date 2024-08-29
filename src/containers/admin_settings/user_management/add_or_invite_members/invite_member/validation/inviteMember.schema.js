import { translateFunction } from 'utils/jsUtility';
import {
  EMAIL_ADDRESS_ID,
  EMAIL_ADDRESS_LABEL,
  REPORTING_MANAGER_ID,
  USER_PERMISSION_ID,
} from '../../../../../../components/member_list/invite_member/inviteMemberCard.strings';
import {
  arrayValidation,
  constructJoiObject,
} from '../../../../../../utils/ValidationConstants';

import { SCHEMA_CONSTANTS } from './inviteMember.schema.constant';

export const inviteMemberCardSchema = (t = translateFunction) =>
  constructJoiObject({
    [EMAIL_ADDRESS_ID]: SCHEMA_CONSTANTS.EMAIL.required().label(
      t(EMAIL_ADDRESS_LABEL),
    ),
    [USER_PERMISSION_ID]: SCHEMA_CONSTANTS.USER_PERMISSION.required(),
    [REPORTING_MANAGER_ID]: SCHEMA_CONSTANTS.REPORTING_MANAGER,
  });

export const inviteMembersSchema = (t) =>
  arrayValidation(inviteMemberCardSchema(t));
