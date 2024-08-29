import Joi from 'joi';
import { translate } from 'language/config';
import { EMAIL_VALIDATION } from 'utils/ValidationConstants';
import QUERY_BUILDER from 'components/query_builder/QueryBuilder.strings';
import { OPERAND_TYPE_STRINGS } from 'components/form_builder/FormBuilder.strings';
import { validateFixedDateRanges, dateFieldValidation } from 'components/form_builder/field_config/Field.validation.schema';
import { CBAllKeys, CBConditionType } from '@workhall-pvt-lmt/wh-ui-library';
import { has, isEmpty, translateFunction } from '../../utils/jsUtility';
import { VISIBILITY_CONFIG_FIELDS } from '../../utils/constants/form.constant';
import { OPERAND_TYPES } from '../../utils/constants/rule/operand_type.constant';
import { VALUE_REQUIRED_ERROR } from '../../utils/strings/CommonStrings';
import { L_VALUE_TYPE, R_CONSTANT, VALUE_TYPE, VALUE_TYPE_KEY } from '../../utils/constants/rule/rule.constant';
import { ADD_MEMBER_MIN_MAX_CONSTRAINT } from '../../utils/Constants';
import { LINK_VALIDATION } from '../../utils/ValidationConstants';

const validateDate = (date, helpers) => {
  if (isEmpty(date)) return helpers.message(translate('form_field_strings.error_text_constant.date_required'));
  const error = dateFieldValidation({}, date, false);
  if (error) return helpers.message(error);
  return date;
};

const validateDualTime = (a, b) => {
  if (isEmpty(a) || isEmpty(b)) return '';
  if (a === b) return 'duplicate';

  const [h1, m1, s1] = a.split(':').map((n) => Number(n));
  const [h2, m2, s2] = b.split(':').map((n) => Number(n));

  const startTime = new Date(0, 0, 0, h1, m1, s1);
  const endTime = new Date(0, 0, 0, h2, m2, s2);

  if (startTime > endTime) return 'duplicate';
  return '';
};

const {
  SINGLE_LINE,
  EMAIL,
  NUMBER,
  DATE,
  DUAL_DATE,
  DUAL_DATE_TIME,
  MULTI_DROPDOWN,
  DROPDOWN,
  MULTI_NUMBER,
} = OPERAND_TYPE_STRINGS;

const staticValues = [
  {
    is: OPERAND_TYPES.MULTI_SINGLE_LINE,
    then: Joi.string().required().label(SINGLE_LINE.LABEL),
  },
  {
    is: OPERAND_TYPES.SINGLE_LINE,
    then: Joi.string().required().label(SINGLE_LINE.LABEL),
  },
  {
    is: OPERAND_TYPES.EMAIL,
    then: EMAIL_VALIDATION.required().label(EMAIL.LABEL),
  },
  {
    is: OPERAND_TYPES.NUMBER,
    then: Joi.when(R_CONSTANT, {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.alternatives()
        .try(Joi.string(), Joi.number())
        .required()
        .label(translate('form_field_strings.form_field_constants.value')),
    }),
  },
  {
    is: OPERAND_TYPES.DUAL_NUMBER,
    then: Joi.array()
      .unique((a, b) => a >= b)
      .items(Joi.number().required(), Joi.number().required())
      .label(NUMBER.LABEL),
  },
  {
    is: OPERAND_TYPES.MULTI_NUMBER,
    then: Joi.array()
      .items(Joi.number())
      .min(1)
      .required()
      .label(MULTI_NUMBER.LABEL)
      .messages({
        'array.min': `${MULTI_NUMBER.LABEL} ${translateFunction(
          'common_strings.is_required',
        )}`,
      }),
  },
  {
    is: OPERAND_TYPES.DROPDOWN,
    then: Joi.alternatives()
      .try(Joi.string(), Joi.number())
      .required()
      .label(DROPDOWN.LABEL),
  },
  {
    is: OPERAND_TYPES.MULTI_DROPDOWN,
    then: Joi.array()
      .items(Joi.alternatives().try(Joi.string(), Joi.number()))
      .min(1)
      .required()
      .label(MULTI_DROPDOWN.LABEL)
      .messages({
        'array.min': `${MULTI_NUMBER.LABEL} ${translateFunction(
          'common_strings.is_required',
        )}`,
      }),
  },

  { is: OPERAND_TYPES.DATE, then: Joi.string().required().label(DATE.LABEL) },
  {
    is: OPERAND_TYPES.DUAL_DATE,
    then: Joi.array()
      .unique((a, b) =>
        validateFixedDateRanges({
          start_date: a,
          end_date: b,
          sub_type: 'between',
          isDateTime: false,
        }),
      )
      .items(
        Joi.string().custom(validateDate).required(),
        Joi.string().custom(validateDate).required(),
      )
      .label(DUAL_DATE.LABEL),
  },
  {
    is: OPERAND_TYPES.DATE_TIME,
    then: Joi.string().required().label(DATE.LABEL),
  },
  {
    is: OPERAND_TYPES.DUAL_DATE_TIME,
    then: Joi.array()
      .unique((a, b) =>
        validateFixedDateRanges({
          start_date: a,
          end_date: b,
          sub_type: 'between',
          isDateTime: true,
        }),
      )
      .items(
        Joi.string().custom(validateDate).required(),
        Joi.string().custom(validateDate).required(),
      )
      .label(DUAL_DATE_TIME.LABEL),
  },
  {
    is: OPERAND_TYPES.DUAL_TIME,
    then: Joi.array()
      .unique((a, b) => validateDualTime(a, b))
      .items(Joi.string().required(), Joi.string().required())
      .label('Time'),
  },
  {
    is: OPERAND_TYPES.USER_SELECT,
    then: Joi.object()
      .keys({
        teams: Joi.any(),
        users: Joi.any(),
      })
      .custom((value, helper) => {
        if (value?.users?.length || value?.teams?.length) {
          return value;
        } else {
          return helper.message(
            translate(
              'form_field_strings.error_text_constant.user_team_required',
            ),
          );
        }
      }),
  },
  {
    is: OPERAND_TYPES.MIN_MAX,
    then: Joi.object({ min: Joi.number(), max: Joi.number() })
      .required()
      .custom((value, helpers) => {
        if (isEmpty(value)) {
          return helpers.message(
            'At least either one of (min, max) is required',
          );
        }
        if (has(value, ['min']) && has(value, ['max'])) {
          if (value.min > value.max) {
            return helpers.message('Max must be greater than Min');
          }
        }
        return value;
      }),
  },
  {
    is: OPERAND_TYPES.PHONE_NUMBER,
    then: Joi.string()
      .required()
      .min(ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MIN_VALUE)
      .max(ADD_MEMBER_MIN_MAX_CONSTRAINT.MOBILE_NUMBER_MAX_VALUE),
  },
  {
    is: OPERAND_TYPES.LINK,
    then: Joi.array().items(
      Joi.object()
        .keys({
          link_text: Joi.string()
            .required()
            .label(
              translate('form_field_strings.form_field_constants.link_text'),
            ),
          link_url: LINK_VALIDATION.label(
            translate('form_field_strings.field_config.link_url.label'),
          ).messages({
            'string.uri': translate(
              'form_field_strings.form_field_constants.link_url',
            ),
          }),
          isEditEnabled: Joi.bool().optional(),
        })
        .min(1),
    ),
  },
];

const fieldValues = [
  { is: OPERAND_TYPES.MULTI_SINGLE_LINE, then: Joi.string().required().label(SINGLE_LINE.LABEL) },
  { is: OPERAND_TYPES.SINGLE_LINE, then: Joi.string().required().label(SINGLE_LINE.LABEL) },
  { is: OPERAND_TYPES.EMAIL, then: Joi.string().required().label(EMAIL.LABEL) },
  { is: OPERAND_TYPES.NUMBER, then: Joi.string().required().label(EMAIL.LABEL) },
  { is: OPERAND_TYPES.DUAL_NUMBER,
    then: Joi.array()
          .unique((a, b) => a === b)
          .items(Joi.string().required(), Joi.string().required())
          .label(NUMBER.LABEL),
  },
  { is: OPERAND_TYPES.MULTI_NUMBER, then: Joi.string().required().label(MULTI_NUMBER.LABEL) },
  { is: OPERAND_TYPES.DROPDOWN, then: Joi.string().required().label(DROPDOWN.LABEL) },
  { is: OPERAND_TYPES.MULTI_DROPDOWN, then: Joi.string().required().label(MULTI_DROPDOWN.LABEL) },
  { is: OPERAND_TYPES.DATE, then: Joi.string().required().label(DATE.LABEL) },
  { is: OPERAND_TYPES.DUAL_DATE,
    then: Joi.array()
          .unique((a, b) => a === b)
          .items(Joi.string().required(), Joi.string().required())
          .label(DUAL_DATE.LABEL),
  },
  { is: OPERAND_TYPES.DATE_TIME, then: Joi.string().required().label(DATE.LABEL) },
  { is: OPERAND_TYPES.DUAL_DATE_TIME,
    then: Joi.array()
          .unique((a, b) => a === b)
          .items(Joi.string().required(), Joi.string().required())
          .label(DUAL_DATE_TIME.LABEL),
  },
  { is: OPERAND_TYPES.DUAL_TIME,
    then: Joi.array()
          .unique((a, b) => a === b)
          .items(Joi.string().required(), Joi.string().required())
          .label('Time'),
  },
  { is: OPERAND_TYPES.USER_SELECT, then: Joi.string().required() },
  { is: OPERAND_TYPES.DATALIST_PICKER, then: Joi.string().required() },
  { is: OPERAND_TYPES.MIN_MAX,
    then: Joi.object({ min: Joi.string(), max: Joi.string() })
      .required()
      .custom((value, helpers) => {
        if (isEmpty(value)) {
 return helpers.message(
            'At least either one of (min, max) is required',
          );
}
        if (has(value, ['min']) && has(value, ['max'])) {
          if (value.min === value.max) {
            return helpers.message('Fields should be unique on both sides');
          }
        }
        return value;
      }),
  },
  { is: OPERAND_TYPES.PHONE_NUMBER, then: Joi.string().required() },
  { is: OPERAND_TYPES.LINK, then: Joi.string().required() },
];

const rValueCommonSchema = (values = []) => Joi.when(
    Joi.ref(`${VISIBILITY_CONFIG_FIELDS.SELECTED_OPERATOR_INFO}.operand_field`),
    {
      switch: values,
      otherwise: Joi.forbidden(),
    },
 ).required()
  .label(translate('form_field_strings.form_field_constants.value'))
  .messages({
    'array.includesRequiredUnknowns': VALUE_REQUIRED_ERROR,
  });

export const rValueSchema = Joi.when(Joi.ref(VALUE_TYPE), {
  switch: [
    { is: VALUE_TYPE_KEY.USER_DEFINED, then: rValueCommonSchema(fieldValues) },
    { is: VALUE_TYPE_KEY.SYSTEM_FIELDS, then: rValueCommonSchema(fieldValues) },
  ],
  otherwise: rValueCommonSchema(staticValues),
});

// Schema for condition(i.e, each rule )
const conditionSchema = (t = translateFunction) =>
  Joi.object().keys({
    condition_type: Joi.string()
      .valid(CBConditionType.CONDITION, CBConditionType.EXPRESSION)
      .required(),
    // Type - Condition Params
    condition_uuid: Joi.when('condition_type', {
      is: CBConditionType.CONDITION,
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }),
    l_field: Joi.when('condition_type', {
      is: CBConditionType.CONDITION,
      then: Joi.string().label(t(QUERY_BUILDER.ALL_LABELS.WHEN)).required(),
      otherwise: Joi.optional(),
    }),
    selected_operator_info: Joi.when('condition_type', {
      is: CBConditionType.CONDITION,
      then: Joi.object().required(),
      otherwise: Joi.optional(),
    }),
    operator: Joi.when('condition_type', {
      is: CBConditionType.CONDITION,
      then: Joi.string().label(t(QUERY_BUILDER.ALL_LABELS.OPERATOR)).required(),
      otherwise: Joi.optional(),
    }),
    [VALUE_TYPE]: Joi.when('condition_type', {
      is: CBConditionType.CONDITION,
      then: Joi.string().optional(),
      otherwise: Joi.optional(),
    }),
    [L_VALUE_TYPE]: Joi.when('condition_type', {
      is: CBConditionType.CONDITION,
      then: Joi.string().optional(),
      otherwise: Joi.optional(),
    }),
    r_value: Joi.when('condition_type', {
      is: CBConditionType.CONDITION,
      then: Joi.when(`${CBAllKeys.SELECTED_OPERATOR_INFO}.has_operand`, {
        is: false,
        then: Joi.allow('', null),
        otherwise: rValueSchema,
      }).label(t(QUERY_BUILDER.ALL_LABELS.VALUES)),
      otherwise: Joi.optional(),
    }),
    [R_CONSTANT]: Joi.string().optional(),
    // Type - Expression Params
    expression: Joi.optional(),
  });

// Schema for operands(i.e, collection of nested expressions and conditions )
// const operandsSchema = (t = translateFunction) => Joi.object().keys({
//           conditions: Joi.array().items(conditionSchema(t)).label(t(QUERY_BUILDER.ALL_LABELS.SUB_CONDITION)).required()
//         });
// Schema for expression(i.e, collection of logical_operator and expresion)
export const expressionSchema = (t = translateFunction) => Joi.object({
          expression_uuid: Joi.optional(),
          label: Joi.string().label(t(QUERY_BUILDER.ALL_LABELS.GROUP_NAME)).optional().allow(null)
                 .max(255),
          logical_operator: Joi.valid(...Object.values(QUERY_BUILDER.LOGICAL_OPERATOR)),
          // operands: operandsSchema(t),
          conditions: Joi.array().items(conditionSchema(t)).label(t(QUERY_BUILDER.ALL_LABELS.SUB_CONDITION)).required(),
          validations: Joi.optional(),
       });
