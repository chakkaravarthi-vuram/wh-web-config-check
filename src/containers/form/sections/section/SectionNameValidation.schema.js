import Joi from 'joi';
import { EMOJI_REGEX } from '../../../../utils/strings/Regex';
import { constructJoiObject } from '../../../../utils/ValidationConstants';

export const SectionNameValidationSchema = (t) =>
  constructJoiObject({
    section_name: Joi.string()
      .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
      .required()
      .min(2)
      .max(50)
      .label(t('form_validation_schema.form_builder.section_title.label')),
  });
