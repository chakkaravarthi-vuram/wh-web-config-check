import Joi from 'joi';
import { translateFunction } from '../../../utils/jsUtility';
import { APP_DESCRIPTION_VALIDATION, APP_NAME_VALIDATION } from '../../../utils/ValidationConstants';
import { CREATE_APP_STRINGS } from './CreateApp.strings';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { APP_SECURITY_STRINGS } from '../app_security/AppSecurity.strings';
import { APP_VALIDATION } from '../application.strings';
import { PATHNAME_URL_REGEX } from '../../../utils/strings/Regex';
import { APP_MIN_MAX_CONSTRAINT } from '../../../utils/Constants';

export const createAppValidationSchema = (t = translateFunction) => (
    Joi.object().keys({
      _id: Joi.string().optional(),
      app_uuid: Joi.string().optional(),
      name: APP_NAME_VALIDATION.required().label(CREATE_APP_STRINGS(t).APP_NAME.LABEL),
      description: APP_DESCRIPTION_VALIDATION.allow(
        null,
        EMPTY_STRING,
      ).label(CREATE_APP_STRINGS(t).APP_DESCRIPTION.LABEL),
      url_path: Joi.string().regex(PATHNAME_URL_REGEX).max(APP_MIN_MAX_CONSTRAINT.APP_URL_MAX_VALUE)
      .messages({ 'string.max': t(APP_VALIDATION.APP_URL_LIMIT) })
      .required()
      .label(CREATE_APP_STRINGS(t).APP_URL.LABEL),
      admins: Joi.object()
      .keys({
        teams: Joi.array().items(),
        users: Joi.array().items(),
      })
      .label(CREATE_APP_STRINGS(t).APP_ADMINS.LABEL)
      .min(1)
      .messages({
        'object.min': APP_SECURITY_STRINGS(t).APP_ADMINS_REQUIRED,
      }),
      viewers: Joi.object().keys({
        teams: Joi.array().items().min(1).messages({ 'array.min': t(APP_VALIDATION.APP_VIEWERS) }),
      }).required()
      .min(1),
    })
);
