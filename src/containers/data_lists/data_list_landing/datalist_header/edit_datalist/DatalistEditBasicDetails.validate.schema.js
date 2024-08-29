import Joi from 'joi';
import { EDIT_BASIC_DETAILS } from '../../DatalistsLanding.constant';
import { NAME_REGEX } from '../../../../../utils/strings/Regex';
import { DATA_LIST_DESCRIPTION_VALIDATION, DATA_LIST_NAME_VALIDATION } from '../../../../../utils/ValidationConstants';

export const basicDetailsSchema = (t) => Joi.object().keys({
  dataListName: DATA_LIST_NAME_VALIDATION.required()
  .label(EDIT_BASIC_DETAILS(t).DATALIST_NAME.LABEL)
  .regex(NAME_REGEX),
  dataListDescription: DATA_LIST_DESCRIPTION_VALIDATION.allow(null, '')
  .label(EDIT_BASIC_DETAILS(t).DATALIST_DESCRIPTION.LABEL)
  .trim(),
});
