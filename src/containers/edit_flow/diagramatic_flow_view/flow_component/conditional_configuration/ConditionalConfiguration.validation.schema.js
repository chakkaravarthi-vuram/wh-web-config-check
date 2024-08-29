import Joi from 'joi';
import { FORM_ACTION_TYPES } from '../../../../form/form_builder/form_footer/FormFooter.constant';
import { FIELD_IDS } from './ConditionalConfiguration.constants';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { CREATE_FORM_STRINGS } from '../../../../form/form_builder/form_footer/FormFooter.string';

export const conditionalConfigValidationSchema = (t) => {
  const {
    FORM_BUTTON_CONFIG: { BODY },
  } = CREATE_FORM_STRINGS(t);

  return Joi.object().keys({
    [FIELD_IDS.IS_NEXT_STEP_RULE]: Joi.when(FIELD_IDS.ACTION_TYPE, {
      is: FORM_ACTION_TYPES.FORWARD,
      then: Joi.boolean().required(),
      otherwise: Joi.allow(null, EMPTY_STRING),
    }),
    [FIELD_IDS.NEXT_STEP_RULE_CONTENT]: Joi.when(FIELD_IDS.IS_NEXT_STEP_RULE, {
      is: true,
      then: Joi.object({
        [FIELD_IDS.EXPRESSION]: Joi.object({
          [FIELD_IDS.IF]: Joi.array().items(
            Joi.object()
              .required()
              .keys({
                [FIELD_IDS.EXPRESSION_TYPE]: Joi.string().allow(
                  null,
                  EMPTY_STRING,
                ),
                [FIELD_IDS.RULE_ID]: Joi.string().required().label(BODY.RULE),
                [FIELD_IDS.RULE_NAME]: Joi.string().optional(),
                [FIELD_IDS.OUTPUT_VALUE]: Joi.array()
                  .min(1)
                  .items(Joi.string().required().label(BODY.STEP)),
              }),
          ),
          [FIELD_IDS.ELSE_OUTPUT_VALUE]: Joi.array()
            .length(1)
            .items(Joi.string().required().label(BODY.STEP)),
        }),
        [FIELD_IDS.EXPRESSION_TYPE]: Joi.string().allow(null, EMPTY_STRING),
      }),
      otherwise: Joi.allow(null, EMPTY_STRING),
    }),
    [FIELD_IDS.NEXT_STEP_UUID]: Joi.when(FIELD_IDS.IS_NEXT_STEP_RULE, {
      is: false,
      then: Joi.array()
        .items(Joi.string().required())
        .required()
        .label(BODY.NEXT_STEP_DROPDOWN_LABEL),
      otherwise: Joi.allow(null, EMPTY_STRING),
    }),
    [FIELD_IDS.ACTION_UUID]: Joi.string().required(),
  });
};
