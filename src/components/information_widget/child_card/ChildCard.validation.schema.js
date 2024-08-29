import Joi from 'joi';
import { WIDGET_STRINGS } from '../InformationWidget.strings';
import { constructJoiObject } from '../../../utils/ValidationConstants';
import { FIELD_IDS, FIELD_OPTION_VALUES } from '../InformationWidget.constants';

export const getInsertChildSchema = (t) =>
  constructJoiObject({
    [FIELD_IDS.CHILD_RECURSIVE]: Joi.number()
      .required()
      .label(WIDGET_STRINGS(t).INSERT_CHILD.CHILD_RECURSIVE.LABEL),
    [FIELD_IDS.CHILD_BORDER]: Joi.number()
      .required()
      .label(WIDGET_STRINGS(t).INSERT_CHILD.CHILD_BORDER.LABEL),
    [FIELD_IDS.CHILD_RECURSIVE_FIELD]: Joi.when(FIELD_IDS.CHILD_RECURSIVE, {
      is: FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES,
      then: Joi.string()
        .required()
        .label(WIDGET_STRINGS(t).INSERT_CHILD.CHILD_RECURSIVE_FIELD.ERROR_LABEL),
      otherwise: Joi.optional(),
    }),
    [FIELD_IDS.CHILD_EDITOR]: Joi.string()
      .required()
      .label(WIDGET_STRINGS(t).INSERT_CHILD.CHILD_EDITOR.LABEL),
  });
