import Joi from 'joi';
import { WIDGET_STRINGS } from '../InformationWidget.strings';
import { constructJoiObject } from '../../../utils/ValidationConstants';
import { FIELD_IDS } from '../InformationWidget.constants';

export const getInsertFieldSchema = (t) =>
  constructJoiObject({
    [FIELD_IDS.INSERT_FIELD]: Joi.string()
      .required()
      .label(WIDGET_STRINGS(t).INSERT_FIELD.FIELD_DROPDOWN.LABEL),
  });
