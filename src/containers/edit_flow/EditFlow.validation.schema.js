import { TASK_STRINGS } from 'containers/task/task/Task.strings';
import Joi from 'joi';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import {
  FORM_DESCRIPTION_VALIDATION,
  FORM_NAME_VALIDATION,
  FLOW_DESCRIPTION_VALIDATION,
  FLOW_NAME_VALIDATION,
  STEP_DESCRIPTION_VALIDATION,
  STEP_NAME_VALIDATION,
} from 'utils/ValidationConstants';
import formSchema, {
  stricSectionSchema,
  stricSectionSchemaWithFieldList,
} from 'validation/form/form.validation.schema';
import { translateFunction } from 'utils/jsUtility';
import { FLOW_CONFIG_STRINGS, FLOW_STRINGS, FLOW_VALIDATION_STRINGS } from './EditFlow.strings';
import { FLOW_REFERENCE_NAME_REGEX, NAME_REGEX } from '../../utils/strings/Regex';
import { FLOW_MIN_MAX_CONSTRAINT } from '../../utils/Constants';

export const { commonFieldValidationSchema } = formSchema;
export const { formFieldSchema } = formSchema;
export const { sectionSchema } = formSchema;
export const { basicSectionSchema } = formSchema;

const {
  ELSE_NEXT_STEP,
  NEXT_STEP_NAME,
  STEP_NAME_LABEL,
  CUSTOM_ID_LABEL,
  BUTTON_LABEL_TEXT,
  CONTROL_TYPE_LABEL,
  TASK_ID_LABEL,
} = FLOW_CONFIG_STRINGS;

export const technicalConfigSchema = (t) => {
  return {
    technical_reference_name: Joi.string().required()
      .label(t(FLOW_STRINGS.BASIC_INFO.FLOW_TECHNICAL_REF_NAME.LABEL))
      .min(FLOW_MIN_MAX_CONSTRAINT.FLOW_TECH_REF_NAME_MIN_VALUE)
      .max(FLOW_MIN_MAX_CONSTRAINT.FLOW_TECH_REF_NAME_MAX_VALUE)
      .regex(FLOW_REFERENCE_NAME_REGEX),
    flow_short_code: Joi.string()
      .label(t(FLOW_STRINGS.BASIC_INFO.SHORT_CODE.LABEL))
      .required()
      .min(2)
      .max(5)
      .regex(/^[A-Za-z0-9]{2,5}$/),
  };
};

export const getCreateFlowSchema = (t) => {
  return {
    flow_name: FLOW_NAME_VALIDATION.required().label(
      t(FLOW_STRINGS.BASIC_INFO.FLOW_NAME.LABEL),
    )
      .regex(NAME_REGEX)
      .messages({
        'string.max': `${FLOW_VALIDATION_STRINGS(t).NAME} ${FLOW_VALIDATION_STRINGS(t).SHOULD_NOT_EXCEED} ${FLOW_MIN_MAX_CONSTRAINT.FLOW_NAME_MAX_VALUE} ${FLOW_VALIDATION_STRINGS(t).CHARACTERS}`,
        'string.min': `${FLOW_VALIDATION_STRINGS(t).NAME} ${FLOW_VALIDATION_STRINGS(t).SHOULD_CONTAIN_ATLEAST} ${FLOW_MIN_MAX_CONSTRAINT.FLOW_NAME_MIN_VALUE} ${FLOW_VALIDATION_STRINGS(t).CHARACTERS}`,
      }),
    flow_description: FLOW_DESCRIPTION_VALIDATION.allow(
      null,
      EMPTY_STRING,
    ).label(t(FLOW_STRINGS.BASIC_INFO.FLOW_DESCRIPTION.LABEL))
    .messages({ 'string.max': `${FLOW_VALIDATION_STRINGS(t).DESCRIPTION} ${FLOW_VALIDATION_STRINGS(t).SHOULD_NOT_EXCEED} ${FLOW_MIN_MAX_CONSTRAINT.FLOW_DESCRIPTION_MAX_VALUE} ${FLOW_VALIDATION_STRINGS(t).CHARACTERS}` }),
    flow_uuid: Joi.optional(),
    security: Joi.object({
      initiators: Joi.object({ users: Joi.array().optional(), teams: Joi.array().optional() }).optional(),
    }).optional(),
  };
};

export const recursiveValidationSchema = Joi.object().keys().keys({
  has_auto_trigger: Joi.bool().required(),
  auto_trigger_details: Joi.when(
  'has_auto_trigger',
  { is: true,
    then: Joi.object().keys({
    is_recursive: Joi.bool().required(),
    recursive_data: Joi.when(
    'is_recursive',
   { is: true,
     then: Joi.object().keys({
     type: Joi.string().required(),
     time_at: Joi.when(
    'type',
    { is: Joi.equal('day', 'month'),
      then: Joi.string().required(),
      otherwise: Joi.forbidden() },
    ),
    on_days: Joi.when(
    'type',
    { is: 'day',
      then: Joi.array().required().min(1).message('Please select atleast one day'),
      otherwise: Joi.forbidden() },
      ).label('Repeat every'),
      is_working: Joi.when(
      'type',
      { is: Joi.equal('day', 'month'),
        then: Joi.bool().required(),
        otherwise: Joi.forbidden() },
      ),
      repeat_type: Joi.when(
      'type',
      { is: 'month',
        then: Joi.string().required(),
        otherwise: Joi.forbidden() },
      ),
      on_date: Joi.when(
      'type',
      { is: Joi.equal('month'),
        then: Joi.when(
        'repeat_type',
        { is: Joi.equal('selected_date'),
          then: Joi.number().required(),
          otherwise: Joi.forbidden() },
        ),
          otherwise: Joi.forbidden() },
        ),
        on_week: Joi.when(
        'type',
        { is: Joi.equal('month'),
          then: Joi.when(
          'repeat_type',
          { is: Joi.equal('selected_week_day'),
            then: Joi.number().required(),
            otherwise: Joi.forbidden() },
          ),
          otherwise: Joi.forbidden() },
          ),
        on_day: Joi.when(
        'type',
        { is: Joi.equal('month'),
          then: Joi.when(
          'repeat_type',
          { is: Joi.equal('selected_week_day'),
            then: Joi.array().required().min(1).message('Please select a day of the week'),
            otherwise: Joi.forbidden() },
          ),
          otherwise: Joi.forbidden() },
          ),
      }),
      otherwise: Joi.forbidden(),
    },
    ),
  }),
  otherwise: Joi.forbidden() },
  ),
});

export const saveInitialStepValidateSchema = (t = translateFunction) => Joi.object().keys({
  step_name: STEP_NAME_VALIDATION.required().label(t(STEP_NAME_LABEL)),
  step_description: STEP_DESCRIPTION_VALIDATION(t).allow(null, EMPTY_STRING).label(
    t(FLOW_CONFIG_STRINGS.STEP_DESCRIPTION_LABEL),
  ),
  assignees: Joi.object()
    .keys({
      teams: Joi.array().items(
        Joi.object()
          .keys({ _id: Joi.string().required() })
          .unknown(true)
          .required(),
      ),
      users: Joi.array().items(
        Joi.object()
          .keys({ _id: Joi.string().required() })
          .unknown(true)
          .required(),
      ),
    })
    .min(1),
});

export const validateFlowAddOnConfig = (t) => {
  return {
    ...technicalConfigSchema(t),
    is_system_identifier: Joi.bool().required(),
    custom_identifier: Joi.when('is_system_identifier', {
      is: false,
      then: Joi.string().required(),
      otherwise: Joi.any(),
    }).label(t(CUSTOM_ID_LABEL)),
    task_identifier: Joi.any().label(t(TASK_ID_LABEL)),
    category_id: Joi.string(),
  };
};

export const formDetailsValidateSchema = (t = translateFunction) => Joi.object().keys({
  // username: EMAIL_VALIDATION.required().label(SIGN_IN_STRINGS.FORM_LABEL.EMAIL.LABEL),
  form_title: FORM_NAME_VALIDATION.label(TASK_STRINGS.FORM_TITLE.LABEL).allow(
    null,
    EMPTY_STRING,
  ),
  form_description: FORM_DESCRIPTION_VALIDATION.label(
    TASK_STRINGS.FORM_DESCRIPTION.LABEL,
  ).allow(EMPTY_STRING, null),
  sections: sectionSchema(t),
});

export const formDetailsValidateSchemaWithOneSection = (t = translateFunction) => Joi.object().keys({
  // username: EMAIL_VALIDATION.required().label(SIGN_IN_STRINGS.FORM_LABEL.EMAIL.LABEL),
  form_title: FORM_NAME_VALIDATION.label(TASK_STRINGS.FORM_TITLE.LABEL).allow(
    null,
    EMPTY_STRING,
  ),
  form_description: FORM_DESCRIPTION_VALIDATION.label(
    TASK_STRINGS.FORM_DESCRIPTION.LABEL,
  ).allow(EMPTY_STRING, null),
  sections: basicSectionSchema(t),
});

export const importFormValidationSectionSchema = (t = translateFunction) => Joi.object().keys({
  // username: EMAIL_VALIDATION.required().label(SIGN_IN_STRINGS.FORM_LABEL.EMAIL.LABEL),
  form_title: FORM_NAME_VALIDATION.label(TASK_STRINGS.FORM_TITLE.LABEL).allow(
    null,
    EMPTY_STRING,
  ),
  form_description: FORM_DESCRIPTION_VALIDATION.label(
    TASK_STRINGS.FORM_DESCRIPTION.LABEL,
  ).allow(EMPTY_STRING, null),
  sections: stricSectionSchema(t),
});

export const saveAddActorsDetailsValidateSchema = (t = translateFunction) => Joi.object().keys({
  step_name: STEP_NAME_VALIDATION.required().label(t(STEP_NAME_LABEL)),
  step_description: STEP_DESCRIPTION_VALIDATION(t).allow(null, EMPTY_STRING).label(
    t(FLOW_CONFIG_STRINGS.STEP_DESCRIPTION_LABEL),
  ),
  step_assignees: Joi.optional(),
  is_workload_assignment: Joi.optional(),
  step_order: Joi.number().allow(null),
});

export const flowStepformValidationSchema = (t = translateFunction) => Joi.object().keys({
  form_title: FORM_NAME_VALIDATION.label(TASK_STRINGS.FORM_TITLE.LABEL).allow(
    null,
    EMPTY_STRING,
  ),
  form_description: FORM_DESCRIPTION_VALIDATION.label(
    TASK_STRINGS.FORM_DESCRIPTION.LABEL,
  ).allow(EMPTY_STRING, null),
  sections: stricSectionSchemaWithFieldList(t),
});

const unaryOperatorConditions = [
  { is: 'isEmpty', then: Joi.allow('', null) },
  { is: 'isNotEmpty', then: Joi.allow('', null) },
  { is: 'booleanIsTrue', then: Joi.allow('', null) },
  { is: 'booleanIsFalse', then: Joi.allow('', null) },
  { is: 'dateIsToday', then: Joi.allow('', null) },
  { is: 'dateIsPastDate', then: Joi.allow('', null) },
  { is: 'dateIsFutureDate', then: Joi.allow('', null) },
  { is: 'dateIsWeekend', then: Joi.allow('', null) },
  { is: 'dateIsWeekday', then: Joi.allow('', null) },
  { is: 'dateIsHoliday', then: Joi.allow('', null) },
  { is: 'fileIsEmpty', then: Joi.allow('', null) },
  { is: 'fileIsNotEmpty', then: Joi.allow('', null) },
];

export const checkIfRValueNeeded = (operator) => {
  switch (operator) {
    case 'isEmpty':
      return false;
    case 'isNotEmpty':
      return false;
    case 'booleanIsTrue':
      return false;
    case 'booleanIsFalse':
      return false;
    case 'dateIsToday':
      return false;
    case 'dateIsPastDate':
      return false;
    case 'dateIsFutureDate':
      return false;
    case 'dateIsWeekend':
      return false;
    case 'dateIsWeekday':
      return false;
    case 'dateIsHoliday':
      return false;
    case 'fileIsEmpty':
      return false;
    case 'fileIsNotEmpty':
      return false;
    default:
      return true;
  }
};

export const actionShowHideRuleSchema = Joi.object().keys({
  is_hide_show_action: Joi.bool().default(false),
  l_field: Joi.string()
    .label('Field')
    .when('is_hide_show_action', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.allow(''),
    }),
  operator: Joi.string()
    .label('Operator')
    .when('is_hide_show_action', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.allow(''),
    }),
  r_value: Joi.when('is_hide_show_action', {
    is: true,
    then: Joi.alternatives()
      .try(
        Joi.string(),
        Joi.number(),
        Joi.string().email({ tlds: false }),
        Joi.array().items(Joi.optional()),
      )
      .when('operator', {
        switch: unaryOperatorConditions,
        otherwise: Joi.required().label('Value'),
      }),
    otherwise: Joi.allow(''),
  }).label('Value'),
});

export const ruleAssigneeSchema = Joi.object().keys({
  l_field: Joi.string().required().label('When'),
  selectedOperandData: Joi.string().required().label('Operator'),
  r_value: Joi.alternatives()
    .try(Joi.string(), Joi.number(), Joi.string().email({ tlds: false }), Joi.array().items(Joi.optional())).when('selectedOperandData', {
      switch: unaryOperatorConditions,
      otherwise: Joi.required().label('Value'),
    })
    .label('Value'),
});

export const forwardActionRuleSchema = (t = translateFunction) => Joi.object().keys({
  is_rule_action: Joi.bool().default(false),
  next_step_name: Joi.string()
    .label(t(NEXT_STEP_NAME))
    .when('is_rule_action', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.allow(''),
    }),
});

export const forwardActionElseRuleSchema = (t = translateFunction) => Joi.object().keys({
  is_rule_action: Joi.bool().default(false),
  else_next_step_name: Joi.string()
    .label(t(ELSE_NEXT_STEP))
    .when('is_rule_action', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.allow(''),
    }),
});

export const assignReviewActionConfigSchema = (t = translateFunction) => Joi.object().keys({
  action: Joi.string().label(t(BUTTON_LABEL_TEXT)).required().min(2)
.max(50),
  control_type: Joi.string().label(t(CONTROL_TYPE_LABEL)).required(),
});
