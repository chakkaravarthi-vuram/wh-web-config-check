import Joi from 'joi';
import { DATALIST_ADDON_STRINGS } from '../../../data_list_landing/datalist_details/datalist_add_on/DatalistAddOn.strings';

export const addOnDataSchema = (t) => Joi.object().keys({
  isSystemIdentifier: Joi.bool(),
  customIdentifier: Joi.when('isSystemIdentifier', {
    is: false,
    then: Joi.object().required().label(DATALIST_ADDON_STRINGS(t).IDENTIFIER.TITLE),
    otherwise: Joi.any(),
  }),
  uniqueField: Joi.object().label(DATALIST_ADDON_STRINGS(t).IDENTIFIER.UNIQUE_FIELD.LABEL),
  isIgnoreNull: Joi.bool().optional(),
  taskIdentifier: Joi.array().optional(),
  dataListShortCode: Joi.string().required(),
  technicalReferenceName: Joi.string().required(),
  category: Joi.object().optional(),

});
