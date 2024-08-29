import Joi from 'joi';
import { translateFunction } from '../../../utils/jsUtility';
import { CREATE_APP_STRINGS } from '../create_app/CreateApp.strings';
import { APP_SECURITY_STRINGS } from '../app_security/AppSecurity.strings';

export const updateSecurityValidationSchema = (t = translateFunction) => (
    Joi.object().keys({
        _id: Joi.string().optional(),
        app_security: Joi.object().keys({
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
        page_security: Joi.array().items(Joi.object().keys({
            page_id: Joi.string().required(),
            is_inherit_from_app: Joi.bool().required(),
            viewers: Joi.when('is_inherit_from_app', {
                is: true,
                then: Joi.forbidden(),
                otherwise: Joi.object()
                .keys({
                    teams: Joi.array().items(),
                    users: Joi.array().items(),
                })
                .label(CREATE_APP_STRINGS(t).APP_VIEWERS.LABEL)
                .min(1)
                .messages({
                'object.min': APP_SECURITY_STRINGS(t).PAGE_VIEWERS_REQUIRED,
                }),
            }),
        })).min(1),
      })
);
