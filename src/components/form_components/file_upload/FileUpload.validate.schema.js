import { constructJoiObject, FILE_UPLOAD_VALIDATION } from '../../../utils/ValidationConstants';

export const fileUploadValidateSchema = constructJoiObject({
  file: FILE_UPLOAD_VALIDATION,
});

export default fileUploadValidateSchema;
