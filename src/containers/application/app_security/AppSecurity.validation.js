import Joi from 'joi';
import { translateFunction } from '../../../utils/jsUtility';
import { CREATE_APP_STRINGS } from '../create_app/CreateApp.strings';
import { APP_SECURITY_STRINGS } from './AppSecurity.strings';

export const appSecurityValidationSchema = (t = translateFunction) => (
    Joi.object().keys({
        _id: Joi.string().optional(),
        appSecurity: Joi.object().keys({
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
            viewers: Joi.object()
            .keys({
                teams: Joi.array().items(),
                users: Joi.array().items(),
            })
            .label(CREATE_APP_STRINGS(t).APP_VIEWERS.LABEL)
            .min(1)
            .messages({
                'object.min': APP_SECURITY_STRINGS(t).APP_VIEWERS_REQUIRED,
            }),
        }).required(),
      })
);
