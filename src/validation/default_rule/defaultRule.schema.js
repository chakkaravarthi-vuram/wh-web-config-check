import { getLValueLabelFromOperator, getRValueLabelFromOperator } from '../../components/form_builder/field_config/basic_config/DefaultValueRule.selectors';
import { FORMULA_BILDER_MAX_CHARACTER_LIMIT, FORMULA_BILDER_MIN_CHARACTER_LIMIT } from '../../components/formula_builder/FormulaBuilder.strings';

const Joi = require('joi');

const values = [
  { is: 'multi_string', then: Joi.string().required() },
  { is: 'dual_number', then: Joi.number().required() },
  { is: 'multi_number', then: Joi.number().required() },
  { is: 'multi_currency', then: Joi.number().required() },
  { is: 'dual_currency', then: Joi.number().required() },
  { is: 'dual_date', then: Joi.string().required() },
  { is: 'multi_date', then: Joi.string().required() },
];

export const lValueSchema = (label) => Joi.object().keys({
  value: Joi.when(Joi.ref('isField'), {
    is: true,
    then: Joi.alternatives(Joi.string().guid().required().label(label), Joi.array().min(2).items(Joi.string().guid().required().label(label)).label(label)).required().messages({ 'alternatives.match': 'Pick is Required' }),
    otherwise: Joi.when(Joi.ref('...operatorInfo.operand_field'), {
      switch: values,
      otherwise: Joi.forbidden(),
    }),
  }).label(label),
  isField: Joi.when(Joi.ref('...operatorInfo.is_direct_value_allowed'), {
    is: false,
    then: Joi.bool().equal(true),
    otherwise: Joi.bool(),
  }).when(Joi.ref('...operatorInfo.is_direct_field_allowed'), {
    is: false,
    then: Joi.bool().equal(false),
    otherwise: Joi.bool(),
  }),
}).label(label);

export const rValueSchema = (label) => Joi.object().keys({
  value: Joi.when(Joi.ref('isField'), {
    is: true,
    then: Joi.string().guid().required(),
    otherwise: Joi.when(Joi.ref('....operatorInfo.operand_field'), {
      switch: values,
      otherwise: Joi.forbidden(),
    }),
  }).label(label),
  isField: Joi.when(Joi.ref('....operatorInfo.is_direct_value_allowed'), {
    is: false,
    then: Joi.bool().equal(true),
    otherwise: Joi.bool(),
  }).when(Joi.ref('...operatorInfo.is_direct_field_allowed'), {
    is: false,
    then: Joi.bool().equal(false),
    otherwise: Joi.bool(),
  }),
}).label(label);

export const advanceDefaultValueExpressionValidationSchema = Joi.object().keys({
    input: Joi.string()
           .min(FORMULA_BILDER_MIN_CHARACTER_LIMIT)
           .max(FORMULA_BILDER_MAX_CHARACTER_LIMIT)
           .label('Formula')
           .required(),
    errors: Joi.any().allow(null),
  });

const getOnlyLValueSchema = (operator) => {
  const lValueLabel = getLValueLabelFromOperator(operator) ? getLValueLabelFromOperator(operator) : 'lValue'; // label must be a non empty string in joi
  return lValueSchema(lValueLabel).label(lValueLabel).required();
};

const getOnlyRValueSchema = (operator) => {
  const rValueLabel = getRValueLabelFromOperator(operator) ? getRValueLabelFromOperator(operator) : 'rValue'; // label must be a non empty string in joi
  return Joi.array()
          .items(rValueSchema(rValueLabel))
          .when('operatorInfo.is_unary_operand', {
            is: true,
            then: Joi.forbidden(),
            otherwise: Joi.array().min(1).required(),
          })
          .label(rValueLabel);
};

export const operatorSchema = Joi.object().keys({
  operatorInfo: Joi.object().required(),
  operator: Joi.string().required(),
});

export const getLValueSchema = (operator) => operatorSchema.append({
    lValue: getOnlyLValueSchema(operator),
});

export const getRValueSchema = (operator) => operatorSchema.append({
   rValue: getOnlyRValueSchema(operator),
});

export const defaultRuleValidationSchema = (operator, is_advanced_expression = false) => {
    if (is_advanced_expression) {
       return advanceDefaultValueExpressionValidationSchema;
    }
      // const rValueLabel = getRValueLabelFromOperator(operator) ? getRValueLabelFromOperator(operator) : 'rValue'; // label must be a non empty string in joi
      // const lValueLabel = getLValueLabelFromOperator(operator) ? getLValueLabelFromOperator(operator) : 'lValue';
      return operatorSchema.keys({
        // operatorInfo: Joi.object().required(),
        // operator: Joi.string().required(),
        lValue: Joi.when('operator', {
          is: Joi.required(),
          then: getOnlyLValueSchema(operator),
          otherwise: Joi.optional(),
        }),
        rValue: getOnlyRValueSchema(operator),
        extraOptions: Joi.object(),
        errors: Joi.any().allow(null),
      });
};

export default defaultRuleValidationSchema;
