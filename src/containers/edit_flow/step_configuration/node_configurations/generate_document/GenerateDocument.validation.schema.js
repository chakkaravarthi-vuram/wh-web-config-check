import Joi from 'joi';
import { translateFunction } from '../../../../../utils/jsUtility';
import { GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS } from './GenerateDocument.strings';
import { RESPONSE_FIELD_KEYS } from './GenerateDocument.constants';
import { basicNodeValidationSchema } from '../../../node_configuration/NodeConfiguration.schema';
import { BUTTON_LABEL } from '../../../../../utils/strings/CommonStrings';

export const documentGenerationValidationSchema = (isAddOnConfig = false, t = translateFunction) => {
  const { TYPE_AND_STORE, TEMPLATE } =
    GENERATE_DOCUMENT_STEP_CONFIGURATION_STRINGS(t).GENERAL;

  return Joi.object()
    .keys({
      ...isAddOnConfig ? {
        stepId: Joi.string().required(),
        stepUuid: Joi.string().required(),
      } : basicNodeValidationSchema(t),
      [RESPONSE_FIELD_KEYS.DOCUMENT_BODY]: Joi.string().required().label(TEMPLATE.DOCUMENT.VALIDATION_STRING),
      [RESPONSE_FIELD_KEYS.DOCUMENT_NAME_UUID]: Joi.string().optional(),
      [RESPONSE_FIELD_KEYS.FILE_NAME]: Joi.string()
        .min(2)
        .max(255)
        .label(TEMPLATE.NAME.VALIDATION_STRING)
        .required(),
      [RESPONSE_FIELD_KEYS.DOCUMENT_FIELD_NAME]: Joi.string()
        .min(2)
        .max(255)
        .required()
        .label(TYPE_AND_STORE.STORE_FIELD.VALIDATION_STRING),
      [RESPONSE_FIELD_KEYS.ALLOW_HEADER]: Joi.bool().required(),
      [RESPONSE_FIELD_KEYS.ALLOW_FOOTER]: Joi.bool().required(),
      [RESPONSE_FIELD_KEYS.DOCUMENT_HEADER]: Joi.when(RESPONSE_FIELD_KEYS.ALLOW_HEADER, {
        is: true,
        then: Joi.string().required().label(TEMPLATE.HEADER.LABEL),
        otherwise: Joi.forbidden(),
      }),
      [RESPONSE_FIELD_KEYS.DOCUMENT_FOOTER]: Joi.when(RESPONSE_FIELD_KEYS.ALLOW_FOOTER, {
        is: true,
        then: Joi.string().required().label(TEMPLATE.FOOTER.LABEL),
        otherwise: Joi.forbidden(),
      }),
      ...isAddOnConfig && {
        actionUuid: Joi.array().min(1).required()
          .label(t(BUTTON_LABEL)),
      },
    })
    .unknown(true);
};
