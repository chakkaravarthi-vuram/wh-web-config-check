import { translateFunction } from 'utils/jsUtility';
import { constructJoiObject, CURRENT_PASSWORD_VALIDATION, PASSWORD_VALIDATION } from '../../../utils/ValidationConstants';
import { CURRENT_PASSWORD, NEW_PASSWORD } from './ChangePassword.strings';

export const changePasswordValidationSchema = (t = translateFunction) => (constructJoiObject({
  current_password: CURRENT_PASSWORD_VALIDATION.required().label(t(CURRENT_PASSWORD)),
  new_password: PASSWORD_VALIDATION.required()
    .label(t(NEW_PASSWORD)),
}));

export default changePasswordValidationSchema;
