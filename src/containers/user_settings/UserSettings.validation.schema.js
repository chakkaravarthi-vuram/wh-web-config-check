import Joi from 'joi';
import { API_KEY_NAME_VALIDATION } from '../../utils/ValidationConstants';
import { API_KEY_STRINGS } from './UserSettings.strings';
import { translateFunction } from '../../utils/jsUtility';
import { ACCOUNT_AND_DOMAIN_NAME_REGEX } from '../../utils/strings/Regex';

export const apiKeyValidationSchema = (t = translateFunction) =>
    Joi.object().keys({
        descriptive_name: API_KEY_NAME_VALIDATION.required().label(API_KEY_STRINGS(t).API_KEY_NAME)
        .regex(ACCOUNT_AND_DOMAIN_NAME_REGEX),
        scope: Joi.string().required().label(API_KEY_STRINGS(t).SCOPE),
    });
