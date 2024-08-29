import Joi from 'joi';

const MlModelValidateSchema = (dynamicTextKeys, validations) => Joi.object({
    [dynamicTextKeys]: Joi.string().min(validations?.minimum_characters ? validations.minimum_characters : 2).max(validations?.maximum_characters ? validations.maximum_characters : 10000)
.required(),
    model_code: Joi.string().required(),
    is_playground_check: Joi.boolean().required(),
    is_sample: Joi.boolean().required(),
  });

export default MlModelValidateSchema;
