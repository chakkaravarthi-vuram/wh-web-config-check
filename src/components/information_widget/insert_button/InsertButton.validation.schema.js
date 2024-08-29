import Joi from 'joi';
import { WIDGET_STRINGS } from '../InformationWidget.strings';
import { constructJoiObject } from '../../../utils/ValidationConstants';
import {
  FIELD_IDS,
  VALIDATION_CONSTANTS,
} from '../InformationWidget.constants';

export const getInsertButtonSchema = (t) =>
  constructJoiObject({
    [FIELD_IDS.BUTTON_LABEL]: Joi.string()
      .required()
      .min(VALIDATION_CONSTANTS.MIN_CHAR_2)
      .max(VALIDATION_CONSTANTS.MAX_CHAR_255)
      .label(WIDGET_STRINGS(t).INSERT_BUTTON.BUTTON_LABEL.LABEL),
    [FIELD_IDS.BUTTON_STYLE]: Joi.string()
      .required()
      .label(WIDGET_STRINGS(t).INSERT_BUTTON.BUTTON_STYLE.LABEL),
    [FIELD_IDS.BUTTON_LINK]: Joi.string()
      .required()
      .uri()
      .label(WIDGET_STRINGS(t).INSERT_BUTTON.BUTTON_LINK.LABEL)
      .messages({
        'string.uri': `${WIDGET_STRINGS(t).INSERT_BUTTON.BUTTON_LINK.LABEL} ${WIDGET_STRINGS(t).ERROR_MESSAGES.VALID_URI}`,
      }),
  });
