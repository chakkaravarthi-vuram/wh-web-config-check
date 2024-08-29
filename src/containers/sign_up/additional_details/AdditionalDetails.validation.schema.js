import { translateFunction } from 'utils/jsUtility';
import {
  ACCOUNT_DOMAIN_VALIDATION,
  PASSWORD_VALIDATION,
  LAST_NAME_VALIDATION,
  FIRST_NAME_VALIDATION,
  USER_NAME_VALIDATION,
  constructJoiObject,
  STRING_VALIDATION,
} from '../../../utils/ValidationConstants';
import { ADDITIONAL_DETAILS_STRINGS } from './AdditionalDetails.strings';

export const additionalDetailsValidationSchema = (t = translateFunction) => constructJoiObject({
  account_domain: ACCOUNT_DOMAIN_VALIDATION.required().label(t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.ACCOUNT_DOMAIN.LABEL)),
  password: PASSWORD_VALIDATION.required().label(
    t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.PASSWORD.LABEL),
  ),
  first_name: FIRST_NAME_VALIDATION.required().label(t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.FIRST_NAME.LABEL)),
  last_name: LAST_NAME_VALIDATION.required().label(t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.LAST_NAME.LABEL)),
  username: USER_NAME_VALIDATION(t).required().label(
    t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.USER_NAME.LABEL),
  ),
  role_in_company: STRING_VALIDATION.required().label(
    t(ADDITIONAL_DETAILS_STRINGS.FORM_LABEL.YOUR_ROLE.LABEL),
  ),
});

export default additionalDetailsValidationSchema;
