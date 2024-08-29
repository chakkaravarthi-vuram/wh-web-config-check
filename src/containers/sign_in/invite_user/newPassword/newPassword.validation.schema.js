import Joi from 'joi';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { constructJoiObject, PASSWORD_VALIDATION, setJoiRef, STRING_VALIDATION } from '../../../../utils/ValidationConstants';

import { NEW_PASSWORD_LABEL, CONFIRM_PASSWORD_LABEL, NEW_PASSWORD_ID, CONFIRM_PASSWORD_ID } from './newPassword.strings';

export const newPasswordDetailsValidateSchema = constructJoiObject({
  _id: STRING_VALIDATION,
  [NEW_PASSWORD_ID]: PASSWORD_VALIDATION.required().label(NEW_PASSWORD_LABEL),
  [CONFIRM_PASSWORD_ID]: Joi.when(NEW_PASSWORD_ID, {
    is: EMPTY_STRING,
    then: PASSWORD_VALIDATION.label(CONFIRM_PASSWORD_LABEL)
      .required(),
    otherwise: PASSWORD_VALIDATION.label(CONFIRM_PASSWORD_LABEL)
      .valid(setJoiRef(NEW_PASSWORD_ID))
      .required(),
  }),
});

export default newPasswordDetailsValidateSchema;
