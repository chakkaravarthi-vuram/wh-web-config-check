import Joi from 'joi';
import { constructJoiObject, EMAIL_BODY_VALIDATION, EMAIL_SUBJECT_VALIDATION } from '../../../../../utils/ValidationConstants';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { translateFunction } from '../../../../../utils/jsUtility';
import { EMAIL_RECIPIENT_TYPE } from './SendEmailConfig.constants';
import { EMAIL_REGEX } from '../../../../../utils/strings/Regex';
import { EMAIL_LABELS } from './SendEmailConfig.string';

export const EMAIL_RECIPIENT_VALIDATION = Joi.array().items({
    recipientsType: Joi.string().required(),
    directRecipients: Joi.when('recipientsType', {
        is: EMAIL_RECIPIENT_TYPE.USERS_OR_TEAMS,
        then: Joi.object().keys({
          teams: Joi.array().min(1),
          users: Joi.array().min(1),
        }),
        otherwise: Joi.forbidden(),
    }),
    externalRecipient: Joi.when('recipientsType', {
        is: EMAIL_RECIPIENT_TYPE.EMAIL_ADDRESS,
        then: Joi.array()
        .items(Joi.string().regex(EMAIL_REGEX).required())
          .min(1)
          .max(20)
          .required(),
        otherwise: Joi.forbidden(),
    }),
    recipientsFieldUuids: Joi.when('recipientsType', {
        is: EMAIL_RECIPIENT_TYPE.FORM_FIELDS,
        then: Joi.string(),
        otherwise: Joi.forbidden(),
    }),
    recipientsSystemFields: Joi.when('recipientsType', {
        is: EMAIL_RECIPIENT_TYPE.SYSTEM_FIELDS,
        then: Joi.string(),
        otherwise: Joi.forbidden(),
    }),
});

export const emailNodeValidationSchema = (isAddOnConfig, t = translateFunction) =>
    constructJoiObject({
        ...isAddOnConfig ? {
            stepId: Joi.string().required(),
            stepUuid: Joi.string().required(),
        } : basicNodeValidationSchema(t),
        emailActions: Joi.object().keys({
            emailUuid: Joi.string().optional(),
            emailSubject: EMAIL_SUBJECT_VALIDATION.required().label(EMAIL_LABELS(t).EMAIL_SUBJECT),
            emailBody: EMAIL_BODY_VALIDATION.required().label(EMAIL_LABELS(t).EMAIL_BODY),
            emailAttachments: Joi.object().keys({
                fieldUuid: Joi.array().items(Joi.string().optional()),
                attachmentId: Joi.array().items(Joi.string().optional()),
            }),
            ...isAddOnConfig && {
                actionUuid: Joi.array().min(1).required().messages({
                    'any.required': 'Button is required',
                })
                .label('Button'),
            },
        }),
    });
