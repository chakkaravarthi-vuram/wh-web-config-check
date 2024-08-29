import Joi from 'joi';
import { translateFunction } from '../../../utils/jsUtility';
import { constructJoiObject } from '../../../utils/ValidationConstants';
import { ADMIN_SETTINGS_CONSTANT } from '../../admin_settings/AdminSettings.constant';

export const enableDisableMfaValidationSchema = (t = translateFunction) => (constructJoiObject({
  default_mfa_method: Joi.number().required().label(t(ADMIN_SETTINGS_CONSTANT.SECURITY_SETTINGS.MFA_ALLOWED_MFA_METHODS)),
}));

export default enableDisableMfaValidationSchema;
