import Joi from 'joi';
import { EMOJI_REGEX } from '../../../../../utils/strings/Regex';
import { constructJoiObject } from '../../../../../utils/ValidationConstants';
import { FORM_CONFIG_STRINGS } from '../../../Form.string';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';

export const FormHeaderConfigurationSchema = (t) =>
  constructJoiObject({
    form_title: Joi.string()
      .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
      .required()
      .min(2)
      .max(255)
      .label(FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.FORM_TITLE_LABEL),
    form_description: Joi.string()
      .allow(null, EMPTY_STRING)
      .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
      .max(2000)
      .label(FORM_CONFIG_STRINGS(t).FORM_CONFIG.HEADER.FORM_DESCRIPTION_LABEL),
  });
