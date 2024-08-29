import { constructJoiObject, EMAIL_VALIDATION } from '../../../utils/ValidationConstants';
import { BASIC_DETAIL_STRINGS } from './BasicDetails.strings';

export const basicDetailsValidationSchema = (translate) => constructJoiObject({
  email: EMAIL_VALIDATION.required().label(translate(BASIC_DETAIL_STRINGS.FORM_LABEL.EMAIL.LABEL)),
});
export default basicDetailsValidationSchema;
