import { CATEGORY_NAME } from '../../../utils/ValidationConstants';
import CATEGORY_MANAGEMENT_STRINGS from './CategoryManagement.strings';

const Joi = require('joi');

export const addCategoryValidationSchema = (t) => Joi.object().keys({
    category_name: CATEGORY_NAME.label(t(CATEGORY_MANAGEMENT_STRINGS.ADD_LABEL)),
});
export default addCategoryValidationSchema;
