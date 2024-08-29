import Joi from 'joi';
import { translateFunction } from '../../../../../utils/jsUtility';
import { LINK_CONFIGURATION_STRINGS } from './LinkPageConfiguration.strings';
import { LINK_VALIDATION } from '../../../../../utils/ValidationConstants';

const linkUrlValidation = (t) => [
    {
        is: LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[0].value,
        then: Joi.forbidden(),
    },
    {
        is: LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[1].value,
        then: Joi.string().required().label(LINK_CONFIGURATION_STRINGS(t).LINKS.COLUMN_LABELS[3]),
    },
    {
        is: LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[2].value,
        then: Joi.string().required().label(LINK_CONFIGURATION_STRINGS(t).LINKS.COLUMN_LABELS[4]),
    },
  ];

export const linkComponentValidationSchema = (t = translateFunction) => (
    Joi.object().keys({
      label: Joi.string().optional().label(LINK_CONFIGURATION_STRINGS(t).LABEL).max(50),
      type: Joi.string().required().label(LINK_CONFIGURATION_STRINGS(t).LABEL),
      label_position: Joi.string().required(),
      alignment: Joi.string().required().label(LINK_CONFIGURATION_STRINGS(t).ALIGNMENT.LABEL),
      coordinates: Joi.object().keys({
        x: Joi.number().required(),
        y: Joi.number().required(),
        h: Joi.number().required(),
        w: Joi.number().required(),
      }).required(),
      component_info: Joi.object().keys({
        shortcut_style: Joi.string().required().label(LINK_CONFIGURATION_STRINGS(t).SHORTCUT_STYLE.LABEL),
        links: Joi.array().items(Joi.object().keys({
            type: Joi.string().required().label(LINK_CONFIGURATION_STRINGS(t).LINKS.COLUMN_LABELS[0]),
            name: Joi.string().required().label(LINK_CONFIGURATION_STRINGS(t).LINKS.COLUMN_LABELS[1]).max(50),
            // url: Joi.string().required().label(LINK_CONFIGURATION_STRINGS(t).LINKS.COLUMN_LABELS[2]),
            url: Joi.when('type', {
                is: LINK_CONFIGURATION_STRINGS(t).LINKS.LINK_TYPES.OPTION_LIST[0].value,
                then: LINK_VALIDATION.label(LINK_CONFIGURATION_STRINGS(t).LINKS.COLUMN_LABELS[2])
                      .messages({
                        'any.custom': LINK_CONFIGURATION_STRINGS(t).INVALID_URL_ERROR,
                      }),
                otherwise: Joi.forbidden(),
            }),
            source_uuid: Joi.when('type', {
                switch: linkUrlValidation(t),
                otherwise: Joi.forbidden(),
            }),
        })).required(),
      }).required(),
    })
);
