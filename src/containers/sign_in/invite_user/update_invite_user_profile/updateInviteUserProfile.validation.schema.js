import { EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import { constructJoiObject, FIRST_NAME_VALIDATION, LAST_NAME_VALIDATION, MOBILE_NUMBER_VALIDATION } from '../../../../utils/ValidationConstants';
import { FIRST_NAME, LAST_NAME, MOBILE_NUMBER } from './updateInviteUserProfile.strings';

const updateInviteUserProfileSchema = (t) => (
  constructJoiObject({
  [FIRST_NAME.ID]: FIRST_NAME_VALIDATION.required().label(
    FIRST_NAME.LABEL,
  ),
  [LAST_NAME.ID]: LAST_NAME_VALIDATION.required().label(
    LAST_NAME.LABEL,
  ),
  [MOBILE_NUMBER.ID]: MOBILE_NUMBER_VALIDATION(t).allow(null, EMPTY_STRING),
}));

export default updateInviteUserProfileSchema;
