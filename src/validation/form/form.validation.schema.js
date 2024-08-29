import { translate } from 'language/config';
import { DATA_LIST_PICKER_KEYS, FIELD_KEYS, PROPERTY_PICKER_KEYS } from 'utils/constants/form.constant';
import jsUtility from 'utils/jsUtility';
import { FLOW_CONFIG_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import { TASK_STRINGS } from '../../containers/task/task/Task.strings';
import {
  SECTION_NAME_VALIDATION,
  FIELD_NAME_VALIDATION,
  FIELD_TYPE_VALIDATION,
  REFERENCE_NAME_VALIDATION,
  FIELD_LIST_TYPE,
  TABLE_FIELD_LIST_TYPE,
  FORM_NAME_VALIDATION,
  FORM_DESCRIPTION_VALIDATION,
} from '../../utils/ValidationConstants';
import {
  SECTION_TITLE,
  FIELD_NAME,
  FIELD_TYPES,
  FIELD_CONFIG,
  FIELD_LIST_CONFIG,
} from '../../components/form_builder/FormBuilder.strings';
import {
  singlelineValidationSchema,
  paragraphValidationSchema,
  numberValidationSchema,
  dateValidationSchema,
  fileUploadValidationSchema,
  currencyValidationSchema,
  linkValidationSchema,
  userTeamPickerValidationSchema,
  dataListFieldValidationSchem,
  phoneNumberValidationSchema,
  emailFieldValidationSchema,
  tableValidationSchema,
  dateTimeValidationSchema,
} from '../../components/form_builder/field_config/Field.validation.schema';

import {
  SECTION_DESCRIPTION,
  SECTION_ORDER,
  SECTION_UUID,
  IS_SECTION_SHOW_WHEN_RULE,
  IS_VISIBLE,
  SECTION_SHOW_WHEN_RULE,
  IS_FIELD_LIST_SHOW_WHEN_RULE,
  FIELD_LIST_SHOW_WHEN_RULE,
  TABLE_NAME,
  TABLE_REFERENCE_NAME,
  TABLE_UUID,
  ROW_ORDER,
  COLUMN_ORDER,
  IS_SCRATCH,
  IS_FIELD_SHOW_WHEN_RULE,
  FIELD_SHOW_WHEN_RULE,
  IS_FIELD_DEFAULT_VALUE_RULE,
  FIELD_DEFAULT_VALUE_RULE,
  REQUIRED,
  READ_ONLY,
  HELP_TEXT,
  PLACE_HOLDER,
  INSTRUCTIONS,
  FIELD_SINGLE_LINE,
  FIELD_PARAGRAPH,
  FIELD_NUMBER,
  FIELD_DATE,
  FIELD_CURRENCY,
  FIELD_LINK,
  FIELD_DROPDOWN,
  FIELD_CHECKBOX,
  FIELD_RADIO_GROUP,
  FIELD_YES_NO,
  FIELD_INFORMATION,
  FIELD_INFORMATION_VALIDATION,
  FIELD_SCANNER_VALIDATION,
  FIELD_LOOKUP_VALIDATION,
  FIELD_DROPDOWN_VALUES,
  FIELD_CHECKBOX_VALUES,
  FIELD_RADIO_GROUP_VALUES,
  FIELD_YES_NO_VALUES,
  CUSTOM_LOOKUP_DROPDOWN,
  FIELD_DROPDOWN_VALIDATION,
  FIELD_CHECKBOX_VALIDATION,
  FIELD_RADIO_GROUP_VALIDATION,
  FIELD_DATA_LIST_PROPERTY_PICKER,
  FIELD_YES_NO_VALIDATION,
  FIELD_USER_TEAM_PICKER_VALIDATION,
  FIELD_PHONE_NUMBER,
  FIELD_EMAIL,
} from './form.validation.schema.constant';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { FOOTER_PARAMS_ID, FORM_ACTION_TYPES } from '../../containers/form/form_builder/form_footer/FormFooter.constant';
import { CREATE_FORM_STRINGS } from '../../containers/form/form_builder/form_footer/FormFooter.string';

const Joi = require('joi');

const formFieldValidation = (t) => [
  { is: FIELD_TYPES.SINGLE_LINE, then: singlelineValidationSchema },
  { is: FIELD_TYPES.PARAGRAPH, then: paragraphValidationSchema },
  { is: FIELD_TYPES.NUMBER, then: numberValidationSchema },
  { is: FIELD_TYPES.DATE, then: dateValidationSchema(t) },
  { is: FIELD_TYPES.DATETIME, then: dateTimeValidationSchema(t) },
  { is: FIELD_TYPES.CURRENCY, then: currencyValidationSchema },
  { is: FIELD_TYPES.FILE_UPLOAD, then: fileUploadValidationSchema },
  { is: FIELD_TYPES.LINK, then: linkValidationSchema },
  { is: FIELD_TYPES.DROPDOWN, then: FIELD_DROPDOWN },
  { is: FIELD_TYPES.CHECKBOX, then: FIELD_CHECKBOX },
  { is: FIELD_TYPES.INFORMATION, then: FIELD_INFORMATION_VALIDATION },
  { is: FIELD_TYPES.SCANNER, then: FIELD_SCANNER_VALIDATION },
  {
    is: FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
    then: FIELD_LOOKUP_VALIDATION,
  },
  { is: FIELD_TYPES.RADIO_GROUP, then: FIELD_RADIO_GROUP },
  { is: FIELD_TYPES.YES_NO, then: FIELD_YES_NO },
  { is: FIELD_TYPES.USER_TEAM_PICKER, then: userTeamPickerValidationSchema },
  { is: FIELD_TYPES.PHONE_NUMBER, then: phoneNumberValidationSchema },
  { is: FIELD_TYPES.DATA_LIST, then: dataListFieldValidationSchem },
  { is: FIELD_TYPES.EMAIL, then: emailFieldValidationSchema },
  { is: FIELD_TYPES.DATA_LIST_PROPERTY_PICKER, then: FIELD_DATA_LIST_PROPERTY_PICKER },
  { is: FIELD_TYPES.USER_PROPERTY_PICKER, then: FIELD_DATA_LIST_PROPERTY_PICKER },
];

const formDefaultValueValidation = [
  { is: FIELD_TYPES.SINGLE_LINE, then: FIELD_SINGLE_LINE },
  {
    is: FIELD_TYPES.LINK,
    then: Joi.when('validations.is_multiple', {
      is: true,
      then: FIELD_LINK.custom((value, helper) => {
        const validations = jsUtility.get(
          helper,
          ['state', 'ancestors', 0, 'validations'],
          {},
          );
        const valueCount = (value || []).length;
        const minimumCount = !Number.isNaN(validations.minimum_count) ? validations.minimum_count : 0;
        const maximumCount = !Number.isNaN(validations.maximum_count) ? validations.maximum_count : minimumCount > 1 ? minimumCount : 1;
        if (valueCount < minimumCount) return helper.message(`${translate('form_field_strings.error_text_constant.default_value')} ${minimumCount} ${translate('form_field_strings.error_text_constant.items')}`);

          if (valueCount > maximumCount) return helper.message(`${translate('form_field_strings.error_text_constant.default_value_equals')} ${maximumCount} ${translate('form_field_strings.error_text_constant.items')}`);
          return value;
      }),
      otherwise: FIELD_LINK.max(1),
    }),
  },
  { is: FIELD_TYPES.PARAGRAPH, then: FIELD_PARAGRAPH },
  { is: FIELD_TYPES.NUMBER, then: FIELD_NUMBER },
  { is: FIELD_TYPES.DATE, then: FIELD_DATE },
  { is: FIELD_TYPES.DATETIME, then: FIELD_DATE },
  { is: FIELD_TYPES.CURRENCY, then: FIELD_CURRENCY },
  { is: FIELD_TYPES.DROPDOWN, then: FIELD_DROPDOWN_VALIDATION },
  {
    is: FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
    then: FIELD_LOOKUP_VALIDATION,
  },
  { is: FIELD_TYPES.CHECKBOX, then: FIELD_CHECKBOX_VALIDATION },
  { is: FIELD_TYPES.RADIO_GROUP, then: FIELD_RADIO_GROUP_VALIDATION },
  { is: FIELD_TYPES.YES_NO, then: FIELD_YES_NO_VALIDATION },
  { is: FIELD_TYPES.INFORMATION, then: FIELD_INFORMATION },
  {
    is: FIELD_TYPES.USER_TEAM_PICKER,
    then: FIELD_USER_TEAM_PICKER_VALIDATION,
  },
  { is: FIELD_TYPES.PHONE_NUMBER, then: FIELD_PHONE_NUMBER },
  { is: FIELD_TYPES.EMAIL, then: FIELD_EMAIL },
];

const formValueValidation = [
  { is: FIELD_TYPES.DROPDOWN, then: FIELD_DROPDOWN_VALUES },
  { is: FIELD_TYPES.CHECKBOX, then: FIELD_CHECKBOX_VALUES },
  { is: FIELD_TYPES.RADIO_GROUP, then: FIELD_RADIO_GROUP_VALUES },
  { is: FIELD_TYPES.YES_NO, then: FIELD_YES_NO_VALUES },
  {
    is: FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
    then: CUSTOM_LOOKUP_DROPDOWN,
  },
];

const dataListFieldSchema = Joi.object().keys({
  data_list_id: Joi.string().required().label(DATA_LIST_PICKER_KEYS.ID),
  data_list_uuid: Joi.string().required().label(DATA_LIST_PICKER_KEYS.UUID),
  display_fields: Joi.array()
    .items(Joi.string().label(translate('form_field_strings.form_field_constants.datalist_field')))
    .unique()
    .min(1)
    .label(translate('form_field_strings.form_field_constants.datalist_field'))
    .required(),
  has_property_field: Joi.optional(),
});

const dataListPropertyPickerSchema = Joi.object().keys({
  [PROPERTY_PICKER_KEYS.SOURCE]: Joi.valid(...(Object.values(PROPERTY_PICKER_KEYS.SOURCE_TYPE))).required().label(PROPERTY_PICKER_KEYS.SOURCE),
  [PROPERTY_PICKER_KEYS.SOURCE_FIELD_UUID]: Joi.string().required().label(translate('form_field_strings.form_field_constants.datalist_picker')),
  [PROPERTY_PICKER_KEYS.REFERENCE_FIELD_UUID]: Joi.string().required().label(translate('form_field_strings.form_field_constants.datalist_field')),
  [PROPERTY_PICKER_KEYS.REFERENCE_FIELD_TYPE]: Joi.valid(...(Object.values(FIELD_TYPES))).required().label(PROPERTY_PICKER_KEYS.REFERENCE_FIELD_TYPE),
  [PROPERTY_PICKER_KEYS.DATA_LIST_ID]: Joi.optional(),
  [PROPERTY_PICKER_KEYS.DATA_LIST_UUID]: Joi.optional(),
});

const userPropertyPickerSchema = Joi.object().keys({
  [PROPERTY_PICKER_KEYS.SOURCE]: Joi.valid(...(Object.values(PROPERTY_PICKER_KEYS.SOURCE_TYPE))).required().label(PROPERTY_PICKER_KEYS.SOURCE),
  [PROPERTY_PICKER_KEYS.SOURCE_FIELD_UUID]: Joi.string().required().label(translate('form_field_strings.form_field_constants.user_selector')),
  [PROPERTY_PICKER_KEYS.REFERENCE_FIELD_UUID]: Joi.string().required().label(translate('form_field_strings.form_field_constants.user_selector_field')),
  [PROPERTY_PICKER_KEYS.REFERENCE_FIELD_TYPE]: Joi.valid(...(Object.values(FIELD_TYPES))).required().label(PROPERTY_PICKER_KEYS.REFERENCE_FIELD_TYPE),
  [PROPERTY_PICKER_KEYS.DATA_LIST_ID]: Joi.optional(),
  [PROPERTY_PICKER_KEYS.DATA_LIST_UUID]: Joi.optional(),
});

const commonFieldValidationSchema = (t = () => {}) => {
  return {
  is_scratch: IS_SCRATCH,
  row_order: ROW_ORDER,
  column_order: COLUMN_ORDER,
  // field_name: Joi.when('field_type', {
  //   is: FIELD_TYPES.INFORMATION,
  //   then: FIELD_NAME_VALIDATION.trim().label(FIELD_NAME.LABEL).allow(EMPTY_STRING),
  //   otherwise: FIELD_NAME_VALIDATION.required().trim().label(FIELD_NAME.LABEL),
  // }),
  field_name: FIELD_NAME_VALIDATION.required().trim().label(t(FIELD_NAME.LABEL)),
  reference_name: REFERENCE_NAME_VALIDATION.required()
    .trim()
    .label(FIELD_CONFIG(t).BASIC_CONFIG.REFERENCE_NAME.LABEL),
  // isConfigPopupOpen: IS_CONFIG_OPEN,
  field_type: FIELD_TYPE_VALIDATION.required(),
  default_value: Joi.when('is_field_default_value_rule', {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.when('field_type', {
      switch: formDefaultValueValidation,
      otherwise: Joi.forbidden(),
    }).allow(EMPTY_STRING),
  }),
  value_metadata: Joi.when('field_type', {
    is: FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
    then: Joi.object()
      .keys({ custom_lookup_id: Joi.string().required() })
      .required(),
    otherwise: Joi.forbidden(),
  }),

  required: REQUIRED,
  read_only: READ_ONLY,
  help_text: HELP_TEXT,
  place_holder: PLACE_HOLDER,
  instructions: INSTRUCTIONS,
  is_field_show_when_rule: IS_FIELD_SHOW_WHEN_RULE,
  is_visible: IS_VISIBLE,
  is_system_defined: Joi.bool(),
  is_edit_add_only: Joi.bool(),
  field_show_when_rule: FIELD_SHOW_WHEN_RULE,
  is_field_default_value_rule: IS_FIELD_DEFAULT_VALUE_RULE,
  field_default_value_rule: FIELD_DEFAULT_VALUE_RULE,
  is_advanced_expression: Joi.bool(),
  values: Joi.when('field_type', {
    switch: formValueValidation,
    otherwise: Joi.forbidden(),
  }),
  data_list: Joi.when('field_type', {
    is: FIELD_TYPES.DATA_LIST,
    then: dataListFieldSchema.required(),
    otherwise: Joi.forbidden(),
  }).label(t('form_field_strings.form_field_constants.datalist')),
  [FIELD_KEYS.PROPERTY_PICKER_DETAILS]: Joi.when('field_type', {
    is: FIELD_TYPES.DATA_LIST_PROPERTY_PICKER,
    then: dataListPropertyPickerSchema.required(),
    otherwise: Joi.when('field_type', {
      is: FIELD_TYPES.USER_PROPERTY_PICKER,
      then: userPropertyPickerSchema.required(),
      otherwise: Joi.forbidden(),
    }),
  }),
};
};

export const saveFieldValidateSchema = (t = () => {}) => Joi.object()
.keys({
  ...commonFieldValidationSchema(t),
  isConfigPopupOpen: Joi.bool(),
  validations: Joi.when('field_type', {
    switch: formFieldValidation(t),
    otherwise: Joi.forbidden(),
  }),
})
.unknown(true);

export const formFieldSchema = (t) => Joi.object()
  .keys({
    ...commonFieldValidationSchema(t),
    isConfigPopupOpen: Joi.bool(),
    validations: Joi.when('field_type', {
      switch: formFieldValidation(t),
      otherwise: Joi.forbidden(),
    }),
  })
  .unknown(true);

export const fieldListSchema = (t) => Joi.object()
  .keys({
    field_list_type: Joi.string()
      .required()
      .valid(...FIELD_LIST_TYPE),
    isFieldListConfigPopupOpen: Joi.bool(),
    table_uuid: TABLE_UUID,
    table_name: Joi.when('field_list_type', {
      is: TABLE_FIELD_LIST_TYPE,
      then: TABLE_NAME.label(FIELD_LIST_CONFIG(t).TABLE.BASIC_CONFIG.TABLE_NAME.LABEL),
      otherwise: Joi.forbidden(),
    }),
    table_reference_name: Joi.when('field_list_type', {
      is: TABLE_FIELD_LIST_TYPE,
      then: TABLE_REFERENCE_NAME.label(FIELD_LIST_CONFIG(t).TABLE.BASIC_CONFIG.TABLE_REFERENCE_NAME.LABEL),
      otherwise: Joi.forbidden(),
    }),
    table_validations: Joi.when('field_list_type', {
      is: TABLE_FIELD_LIST_TYPE,
      then: tableValidationSchema,
      otherwise: Joi.forbidden(),
    }),
    value_metadata: Joi.when('field_type', {
      is: FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
      then: Joi.object().keys({ custom_lookup_id: Joi.string().required }),
      otherwise: Joi.forbidden(),
    }),
    row_order: ROW_ORDER,
    column_order: COLUMN_ORDER,
    is_field_list_show_when_rule: IS_FIELD_LIST_SHOW_WHEN_RULE,
    // table_validations: tableValidationSchema,
    field_list_show_when_rule: FIELD_LIST_SHOW_WHEN_RULE,
    is_visible: Joi.bool(),
    fields: Joi.array().items(formFieldSchema(t)).allow(null),
  })
  .unknown(true);

export const publishSectionScheam = (t) => Joi.array()
  .items(
    Joi.object().keys({
      section_name: Joi.when('field_list', {
        is: Joi.array().min(1),
        then: SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL),
        otherwise: SECTION_NAME_VALIDATION.allow('', null).label(
          SECTION_TITLE.LABEL,
        ),
      }),
      section_uuid: SECTION_UUID,
      section_description: SECTION_DESCRIPTION,
      section_order: SECTION_ORDER,
      is_section_show_when_rule: IS_SECTION_SHOW_WHEN_RULE,
      is_system_defined: Joi.bool(),
      // is_visible: IS_VISIBLE,
      section_show_when_rule: SECTION_SHOW_WHEN_RULE,
      field_list: Joi.array()
        .items(
          fieldListSchema(t).append({
            fields: Joi.array()
              .items(
                formFieldSchema(t).append({
                  rule_expression: Joi.any(),
                  rule_expression_has_validation: Joi.bool(),
                  // draft_visibility_rule: Joi.any(),
                  draft_default_rule: Joi.any(),
                }),
              )
              .min(1),
            rule_expression: Joi.any(),
            rule_expression_has_validation: Joi.bool(),
            // draft_visibility_rule: Joi.any(),
            draft_default_rule: Joi.any(),
          }),
        )
        .allow(null),
    }),
  )
  .min(1)
  .required();

export const layoutSectionSchema = (t) => Joi.array()
.items(
  Joi.object().keys({
    // section_name: Joi.optional(),
    section_name: SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL).required(),
    section_uuid: SECTION_UUID,
    section_description: SECTION_DESCRIPTION,
    section_order: SECTION_ORDER,
    is_section_show_when_rule: IS_SECTION_SHOW_WHEN_RULE,
    is_system_defined: Joi.bool(),
    // is_visible: IS_VISIBLE,
    section_show_when_rule: SECTION_SHOW_WHEN_RULE,
    fields: Joi.array().min(1).messages({
      'array.min': t('flow_config_strings.errors.section.min_one_item_required'),
    }),
  }),
)
.min(1)
.required();

const sectionArraySchema = (t) => Joi.object().keys({
  section_name: Joi.when('field_list', {
    is: Joi.array().min(1),
    then: SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL),
    otherwise: SECTION_NAME_VALIDATION.allow('', null).label(
      SECTION_TITLE.LABEL,
    ),
  }),
  section_uuid: SECTION_UUID,
  section_description: SECTION_DESCRIPTION,
  section_order: SECTION_ORDER,
  is_section_show_when_rule: IS_SECTION_SHOW_WHEN_RULE,
  is_visible: IS_VISIBLE,
  is_system_defined: Joi.bool(),
  section_show_when_rule: SECTION_SHOW_WHEN_RULE,
  field_list: Joi.array().items(fieldListSchema(t)).allow(null),
});

const sectionSchema = (t) => Joi.array().items(sectionArraySchema(t)).min(1).required();

export const stricSectionSchemaWithFieldList = (t) => Joi.array().items(
  Joi.object().keys({
  section_name: SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL).required(),
  section_uuid: SECTION_UUID,
  section_description: SECTION_DESCRIPTION,
  section_order: SECTION_ORDER,
  is_section_show_when_rule: IS_SECTION_SHOW_WHEN_RULE,
  is_visible: IS_VISIBLE,
  is_system_defined: Joi.bool(),
  section_show_when_rule: SECTION_SHOW_WHEN_RULE,
  field_list: Joi.array().items(
    fieldListSchema(t).append({
    fields: Joi.array()
        .items(
          formFieldSchema(t).append({
            rule_expression: Joi.any(),
            rule_expression_has_validation: Joi.bool(),
            draft_default_rule: Joi.any(),
          }),
        )
        .min(1),
      rule_expression: Joi.any(),
      rule_expression_has_validation: Joi.bool(),
      draft_default_rule: Joi.any(),
    })).min(1)
.required()
.messages({
  'array.min': t(FLOW_CONFIG_STRINGS.ERRORS.SECTION.MIN_ONE_ITEM_REQUIRED),
})
.label(translate('form_field_strings.form_field_constants.section')),
}));

export const stricSectionSchema = (t) => Joi.array().items(
  sectionArraySchema(t).append({
    section_name: SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL).required(),
  }),
);

const basicSectionSchema = (t) => Joi.array().items(
  Joi.object().keys({
    section_name: SECTION_NAME_VALIDATION.label(
      SECTION_TITLE.LABEL,
    ),
    section_uuid: SECTION_UUID,
    section_description: SECTION_DESCRIPTION,
    section_order: SECTION_ORDER,
    is_section_show_when_rule: IS_SECTION_SHOW_WHEN_RULE,
    is_system_defined: Joi.bool(),
    is_visible: IS_VISIBLE,
    section_show_when_rule: SECTION_SHOW_WHEN_RULE,
    field_list: Joi.array().items(fieldListSchema(t)).allow(null),
  }),
);
export const formDetailsValidateSchemaWithStrictSectionAndFieldList = (t) => Joi.object().keys({
  form_title: FORM_NAME_VALIDATION.label(TASK_STRINGS.FORM_TITLE.LABEL).allow(
    null,
    EMPTY_STRING,
  ),
  form_description: FORM_DESCRIPTION_VALIDATION.label(
    TASK_STRINGS.FORM_DESCRIPTION.LABEL,
  ).allow(EMPTY_STRING, null),
  sections: Joi.array().items(
    Joi.object().keys({
    section_name: SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL).required().min(2),
    section_uuid: SECTION_UUID,
    section_description: SECTION_DESCRIPTION,
    section_order: SECTION_ORDER,
    is_section_show_when_rule: IS_SECTION_SHOW_WHEN_RULE,
    is_visible: IS_VISIBLE,
    is_system_defined: Joi.bool(),
    section_show_when_rule: SECTION_SHOW_WHEN_RULE,
    field_list: Joi.array().items(
      fieldListSchema(t).append({
      fields: Joi.array()
          .items(
            formFieldSchema(t).append({
              rule_expression: Joi.any(),
              rule_expression_has_validation: Joi.bool(),
              draft_default_rule: Joi.any(),
            }),
          )
          .min(1),
        rule_expression: Joi.any(),
        rule_expression_has_validation: Joi.bool(),
        draft_default_rule: Joi.any(),
      })).min(1).required()
      .messages({
        'array.min': t(FLOW_CONFIG_STRINGS.ERRORS.SECTION.MIN_ONE_ITEM_REQUIRED),
      })
      .label(TASK_STRINGS.SECTION),
  })),
});

const formDetailsValidateSchema = Joi.object().keys({
  form_title: FORM_NAME_VALIDATION.label(TASK_STRINGS.FORM_TITLE.LABEL).allow(
    null,
    EMPTY_STRING,
  ),
  form_description: FORM_DESCRIPTION_VALIDATION.label(
    TASK_STRINGS.FORM_DESCRIPTION.LABEL,
  ).allow(EMPTY_STRING, null),
  sections: sectionSchema,
});
const formSchema = Object.freeze({
  basicSectionSchema,
  sectionSchema,
  fieldListSchema,
  formFieldSchema,
  commonFieldValidationSchema,
  formDetailsValidateSchema,
  publishSectionScheam,
});

// Form Footer

export const formFooterBasicConfigValidationSchema = (t) => {
  const { FORM_BUTTON_CONFIG: { BODY } } = CREATE_FORM_STRINGS(t);
  return Joi.object().keys({
   [FOOTER_PARAMS_ID.ACTION_LABEL]: Joi.string().required().min(2).max(50)
                                    .label(BODY.BUTTON_LABEL),
   [FOOTER_PARAMS_ID.ACTION_TYPE]: Joi.string().required().label(BODY.BUTTON_TYPE_LABEL),
   [FOOTER_PARAMS_ID.ALLOW_COMMENTS]: Joi.when(FOOTER_PARAMS_ID.ACTION_TYPE, {
    is: BODY.BUTTON_TYPES[2].value,
    then: Joi.allow(null, EMPTY_STRING),
    otherwise: Joi.string().required().label(BODY.NEED_COMMENT_STATUS_LABEL),
   }),
   [FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE]: Joi.when(FOOTER_PARAMS_ID.ACTION_TYPE, {
    is: FORM_ACTION_TYPES.FORWARD,
    then: Joi.boolean().required(),
    otherwise: Joi.allow(null, EMPTY_STRING),
   }),

   [FOOTER_PARAMS_ID.NEXT_STEP_UUID]: Joi.when(FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE, {
     is: false,
     then: Joi.array().items(Joi.string().required()).required().label(BODY.NEXT_STEP_DROPDOWN_LABEL),
     otherwise: Joi.allow(null, EMPTY_STRING),
   }),

   [FOOTER_PARAMS_ID.NEXT_STEP_RULE_CONTENT]: Joi.when(FOOTER_PARAMS_ID.IS_NEXT_STEP_RULE, {
     is: true,
     then: Joi.object({
      [FOOTER_PARAMS_ID.EXPRESSION]: Joi.object({
        [FOOTER_PARAMS_ID.IF]: Joi.array().items(Joi.object().required().keys({
          [FOOTER_PARAMS_ID.EXPRESSION_TYPE]: Joi.string().allow(null, EMPTY_STRING),
          [FOOTER_PARAMS_ID.RULE_ID]: Joi.string().required().label(BODY.RULE),
          [FOOTER_PARAMS_ID.RULE_NAME]: Joi.string().optional(),
          [FOOTER_PARAMS_ID.OUTPUT_VALUE]: Joi.array().min(1).items(Joi.string().required().label(BODY.STEP)),
        })),
        [FOOTER_PARAMS_ID.ELSE_OUTPUT_VALUE]: Joi.array().length(1).items(Joi.string().required().label(BODY.STEP)),
      }),
      [FOOTER_PARAMS_ID.EXPRESSION_TYPE]: Joi.string().allow(null, EMPTY_STRING),
    }),
     otherwise: Joi.allow(null, EMPTY_STRING),
   }),

   [FOOTER_PARAMS_ID.CONTROL_TYPE]: Joi.when(FOOTER_PARAMS_ID.ACTION_TYPE, {
     is: FORM_ACTION_TYPES.ASSIGN_REVIEW,
     then: Joi.string().required().label(BODY.CONTROL_TYPE_LABEL),
     otherwise: Joi.allow(null, EMPTY_STRING),
   }),
});
};

export default formSchema;
