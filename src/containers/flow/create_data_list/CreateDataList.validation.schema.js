import Joi from 'joi';
import { IS_SECTION_SHOW_WHEN_RULE, SECTION_ORDER, SECTION_UUID } from 'validation/form/form.validation.schema.constant';
import { fieldListSchema, formFieldSchema as formFieldSchemaObj } from 'validation/form/form.validation.schema';
import { store } from 'Store';
import {
  STEP_NAME_VALIDATION,
  STEP_DESCRIPTION_VALIDATION,
  SECTION_NAME_VALIDATION,
  FORM_NAME_VALIDATION,
  FORM_DESCRIPTION_VALIDATION,
  SECTION_DESCRIPTION_VALIDATION,
  FIELD_NAME_VALIDATION,
  FIELD_TYPE_VALIDATION,
  TASK_NAME_VALIDATION,
  TASK_DESCRIPTION_VALIDATION,
  ACTION_NAME_VALIDATION,
  REFERENCE_NAME_VALIDATION,
  PLACEHOLDER_TEXT,
  INSTRUCTION_TEXT,
  FIELD_HELP_TEXT,
  DATA_LIST_NAME_VALIDATION,
  DATA_LIST_DESCRIPTION_VALIDATION,
  TECHNICAL_REFERENCE_NAME_VALIDATION,
} from '../../../utils/ValidationConstants';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { FLOW_STRINGS } from '../Flow.strings';
import {
  SECTION_TITLE,
  SECTION_DESCRIPTION,
  FIELD_NAME,
  FIELD_TYPES,
} from '../../../components/form_builder/FormBuilder.strings';
import { TASK_STRINGS } from '../../task/task/Task.strings';
import {
  singlelineValidationSchema,
  paragraphValidationSchema,
  numberValidationSchema,
  dateValidationSchema,
  fileUploadValidationSchema,
  currencyValidationSchema,
} from '../../../components/form_builder/field_config/Field.validation.schema';
import { getSortedListForFormField, hasOwn, trimString } from '../../../utils/UtilityFunctions';
import jsUtils, { translateFunction } from '../../../utils/jsUtility';
import { getSaveFieldAPIData, getSaveFormAPIData, getSaveTableApiData } from '../../../utils/formUtils';
import { layoutSectionSchema } from '../../../validation/form/form.validation.schema';
import { NAME_REGEX } from '../../../utils/strings/Regex';
// import { FLOW_VALIDATION_STRINGS } from '../../edit_flow/EditFlow.strings';
// import { DATA_LIST_MIN_MAX_CONSTRAINT } from '../../../utils/Constants';

export const existingCommonFieldValidationSchema = {
  row_order: Joi.number().required(),
  column_order: Joi.number().required().default(1),
  field_name: FIELD_NAME_VALIDATION.required().trim().label(FIELD_NAME.LABEL),
  reference_name: REFERENCE_NAME_VALIDATION.required().trim().label('FIELD_CONFIG.BASIC_CONFIG.REFERENCE_NAME.LABEL'),
  is_scratch: Joi.bool().required(),
  field_type: FIELD_TYPE_VALIDATION.required(),
  field_id: Joi.string(),
  field_uuid: Joi.string(),
  // reference_name: Joi.string(),
  is_edited: Joi.bool(),
  default_value: Joi.any(),
  required: Joi.bool(),
  required_when: Joi.string().allow(EMPTY_STRING),
  read_only: Joi.bool(),
  read_only_when: Joi.string().allow(EMPTY_STRING),
  help_text: FIELD_HELP_TEXT,
  place_holder: PLACEHOLDER_TEXT,
  instructions: INSTRUCTION_TEXT,
  is_show_when_rule: Joi.bool(),
  isSelected: Joi.bool(),
  isConfigPopupOpen: Joi.bool(),
  values: Joi.when('field_type', {
    is: FIELD_TYPES.DROPDOWN,
    then: Joi.string().required().replace(',', ''),
    otherwise: Joi.when('field_type', {
      is: FIELD_TYPES.CHECKBOX,
      then: Joi.string().required().replace(',', ''),
      otherwise: Joi.when('field_type', {
        is: FIELD_TYPES.RADIO_GROUP,
        then: Joi.string().required().replace(',', ''),
        otherwise: Joi.when('field_type', {
          is: FIELD_TYPES.YES_NO,
          then: Joi.string(),
          otherwise: Joi.forbidden(),
        }),
      }),
    }),
  }),
};

export const commonFieldValidationSchema = {
  row_order: Joi.number().required(),
  column_order: Joi.number().required().default(1),
  field_name: FIELD_NAME_VALIDATION.required().trim().label(FIELD_NAME.LABEL),
  field_id: Joi.string(),
  field_uuid: Joi.string(),
  reference_name: REFERENCE_NAME_VALIDATION.required().trim().label('FIELD_CONFIG.BASIC_CONFIG.REFERENCE_NAME.LABEL'),
  is_scratch: Joi.bool().required(),
  field_type: FIELD_TYPE_VALIDATION.required(),
  isConfigPopupOpen: Joi.bool(),
  default_value: Joi.when('field_type', {
    is: FIELD_TYPES.SINGLE_LINE,
    then: Joi.string(),
    otherwise: Joi.when('field_type', {
      is: FIELD_TYPES.PARAGRAPH,
      then: Joi.string(),
      otherwise: Joi.when('field_type', {
        is: FIELD_TYPES.NUMBER,
        then: Joi.number(),
        otherwise: Joi.when('field_type', {
          is: FIELD_TYPES.DATE,
          then: Joi.string(),
          otherwise: Joi.when('field_type', {
            is: FIELD_TYPES.CURRENCY,
            then: Joi.number().greater(0),
            otherwise: Joi.when('field_type', {
              is: FIELD_TYPES.DROPDOWN,
              then: Joi.string(),
              otherwise: Joi.when('field_type', {
                is: FIELD_TYPES.CHECKBOX,
                then: Joi.string(),
                otherwise: Joi.when('field_type', {
                  is: FIELD_TYPES.RADIO_GROUP,
                  then: Joi.string(),
                  otherwise: Joi.when('field_type', {
                    is: FIELD_TYPES.YES_NO,
                    then: Joi.bool(),
                    otherwise: Joi.forbidden(),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
  required: Joi.bool(),
  required_when: Joi.string().allow(EMPTY_STRING),
  read_only: Joi.bool(),
  read_only_when: Joi.string().allow(EMPTY_STRING),
  help_text: FIELD_HELP_TEXT,
  place_holder: PLACEHOLDER_TEXT,
  instructions: INSTRUCTION_TEXT,
  is_show_when_rule: Joi.bool(),
  values: Joi.when('field_type', {
    is: FIELD_TYPES.DROPDOWN,
    then: Joi.string().required().replace(',', ''),
    otherwise: Joi.when('field_type', {
      is: FIELD_TYPES.CHECKBOX,
      then: Joi.string().required().replace(',', ''),
      otherwise: Joi.when('field_type', {
        is: FIELD_TYPES.RADIO_GROUP,
        then: Joi.string().required().replace(',', ''),
        otherwise: Joi.when('field_type', {
          is: FIELD_TYPES.YES_NO,
          then: Joi.string(),
          otherwise: Joi.forbidden(),
        }),
      }),
    }),
  }),
};

export const existingFormFieldSchema = Joi.object()
  .keys({
    ...existingCommonFieldValidationSchema,

    validations: Joi.when('field_type', {
      is: FIELD_TYPES.SINGLE_LINE,
      then: singlelineValidationSchema,
      otherwise: Joi.when('field_type', {
        is: FIELD_TYPES.PARAGRAPH,
        then: paragraphValidationSchema,
        otherwise: Joi.when('field_type', {
          is: FIELD_TYPES.NUMBER,
          then: numberValidationSchema,
          otherwise: Joi.when('field_type', {
            is: FIELD_TYPES.DATE,
            then: dateValidationSchema,
            otherwise: Joi.when('field_type', {
              is: FIELD_TYPES.FILE_UPLOAD,
              then: fileUploadValidationSchema,
              otherwise: Joi.when('field_type', {
                is: FIELD_TYPES.CURRENCY,
                then: currencyValidationSchema,
                otherwise: Joi.when('field_type', {
                  is: FIELD_TYPES.DROPDOWN,
                  then: Joi.optional(),
                  otherwise: Joi.when('field_type', {
                    is: FIELD_TYPES.CHECKBOX,
                    then: Joi.optional(),
                    otherwise: Joi.when('field_type', {
                      is: FIELD_TYPES.RADIO_GROUP,
                      then: Joi.optional(),
                      otherwise: Joi.when('field_type', {
                        is: FIELD_TYPES.YES_NO,
                        then: Joi.optional(),
                        otherwise: Joi.forbidden(),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  })
  .unknown(true);

export const formFieldSchema = Joi.object()
  .keys({
    ...commonFieldValidationSchema,

    validations: Joi.when('field_type', {
      is: FIELD_TYPES.SINGLE_LINE,
      then: singlelineValidationSchema,
      otherwise: Joi.when('field_type', {
        is: FIELD_TYPES.PARAGRAPH,
        then: paragraphValidationSchema,
        otherwise: Joi.when('field_type', {
          is: FIELD_TYPES.NUMBER,
          then: numberValidationSchema,
          otherwise: Joi.when('field_type', {
            is: FIELD_TYPES.DATE,
            then: dateValidationSchema,
            otherwise: Joi.when('field_type', {
              is: FIELD_TYPES.FILE_UPLOAD,
              then: fileUploadValidationSchema,
              otherwise: Joi.when('field_type', {
                is: FIELD_TYPES.CURRENCY,
                then: currencyValidationSchema,
                otherwise: Joi.when('field_type', {
                  is: FIELD_TYPES.DROPDOWN,
                  then: Joi.optional(),
                  otherwise: Joi.when('field_type', {
                    is: FIELD_TYPES.CHECKBOX,
                    then: Joi.optional(),
                    otherwise: Joi.when('field_type', {
                      is: FIELD_TYPES.RADIO_GROUP,
                      then: Joi.optional(),
                      otherwise: Joi.when('field_type', {
                        is: FIELD_TYPES.YES_NO,
                        then: Joi.optional(),
                        otherwise: Joi.forbidden(),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  })
  .unknown(true);

export const basicDataListDetailsValidationSchema = (t) => (Joi.object().keys({
  add_form: Joi.bool(),
  data_list_name: DATA_LIST_NAME_VALIDATION.required().label(
    FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.DATA_SET_NAME.LABEL,
  ).regex(NAME_REGEX),
  // .messages({
  //   'string.max': `${FLOW_VALIDATION_STRINGS(t).NAME} ${FLOW_VALIDATION_STRINGS(t).SHOULD_NOT_EXCEED} ${DATA_LIST_MIN_MAX_CONSTRAINT.DATA_LIST_NAME_MAX_VALUE} ${FLOW_VALIDATION_STRINGS(t).CHARACTERS}`,
  //   'string.min': `${FLOW_VALIDATION_STRINGS(t).NAME} ${FLOW_VALIDATION_STRINGS(t).SHOULD_CONTAIN_ATLEAST} ${DATA_LIST_MIN_MAX_CONSTRAINT.DATA_LIST_NAME_MIN_VALUE} ${FLOW_VALIDATION_STRINGS(t).CHARACTERS}`,
  // }),
  data_list_description: DATA_LIST_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING)
    .label(FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.DATA_SET_DESCRIPTION.LABEL)
    // .messages({ 'string.max': `${FLOW_VALIDATION_STRINGS(t).DESCRIPTION} ${FLOW_VALIDATION_STRINGS(t).SHOULD_NOT_EXCEED} ${DATA_LIST_MIN_MAX_CONSTRAINT.DATA_LIST_DESCRIPTION_MAX_VALUE} ${FLOW_VALIDATION_STRINGS(t).CHARACTERS}` })
    .trim(),
  // data_list_color: Joi.object(),
  // category_id: Joi.string(),
  // data_list_short_code: Joi.string().label(
  //   FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.SHORT_CODE.LABEL,
  // ).required().min(2)
  // .max(5)
  // .regex(/^[A-Za-z0-9]{2,5}$/),
  // data_list_uuid: DATA_LIST_UUID_VALIDATION.allow(null, EMPTY_STRING),
  // tabIndex: Joi.number().allow(null),
}));

export const addOnSettingsSchema = (t) => Joi.object().keys({
  technical_reference_name: TECHNICAL_REFERENCE_NAME_VALIDATION.required().label(
    FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.REFERENCE_NAME.LABEL,
  ),
  data_list_short_code: Joi.string().label(
    FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.SHORT_CODE.LABEL,
  ).required().min(2)
  .max(5),
  is_system_identifier: Joi.bool().required(),
  custom_identifier: Joi.when('is_system_identifier', {
    is: false,
    then: Joi.string().required().label(FLOW_STRINGS(t).CREATE_FLOW.SETTINGS.IDENTIFIER.DROPDOWN.DATALIST_LABEL),
    otherwise: Joi.optional(),
  }),
});

export const dataListNameValidation = (t) => Joi.object().keys({
  data_list_name: DATA_LIST_NAME_VALIDATION.required().label(
    FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.DATA_SET_NAME.LABEL,
  ),
});

export const datalistDescriptionValidation = (t) => Joi.object().keys({
  data_list_description: DATA_LIST_DESCRIPTION_VALIDATION.label(
    FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.DATA_SET_DESCRIPTION.LABEL,
  ).allow(EMPTY_STRING, null),
});

export const basicDataListSchema = (t) => {
  return {
  data_list_name: DATA_LIST_NAME_VALIDATION.required().label(
    FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.DATA_SET_NAME.LABEL,
  ),
  data_list_description: DATA_LIST_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING)
    .label(FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.DATA_SET_DESCRIPTION.LABEL)
    .trim(),
  };
};

export const basicDataListWithTableValidateSchemaWithOneSection = (t) => Joi.object().keys({
  data_list_name: DATA_LIST_NAME_VALIDATION.label(FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.DATA_SET_NAME.LABEL).allow(
    null,
    EMPTY_STRING,
  ),
  data_list_description: DATA_LIST_DESCRIPTION_VALIDATION.label(
    FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.DATA_SET_DESCRIPTION.LABEL,
  ).allow(EMPTY_STRING, null),
  sections: Joi.array()
    .items(
      Joi.object().keys({
        section_name: SECTION_NAME_VALIDATION.allow('', null).label(SECTION_TITLE.LABEL),
        section_description: SECTION_DESCRIPTION_VALIDATION.label(SECTION_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
        section_order: Joi.number().required(),
        is_show_when_rule: Joi.bool(),
        table_reference_name: Joi.string(),
        table_uuid: Joi.string(),
        // is_table: Joi.bool().required(),
        fields: Joi.array().items(formFieldSchema).allow(null),
      }),
    )
    .min(1)
    .required(),
});

export const basicDataListWithTableValidateSchema = (t) => Joi.object().keys({
  data_list_name: DATA_LIST_NAME_VALIDATION.label(FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.DATA_SET_NAME.LABEL).allow(
    null,
    EMPTY_STRING,
  ),
  data_list_description: DATA_LIST_DESCRIPTION_VALIDATION.label(
    FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.DATA_SET_DESCRIPTION.LABEL,
  ).allow(EMPTY_STRING, null),
  sections: Joi.array()
    .items(
      Joi.object().keys({
        section_name: Joi.when('fields', {
          is: Joi.array().min(1),
          then: SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL),
          otherwise: SECTION_NAME_VALIDATION.allow('', null).label(SECTION_TITLE.LABEL),
        }),
        section_description: SECTION_DESCRIPTION_VALIDATION.label(SECTION_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
        section_order: Joi.number().required(),
        is_show_when_rule: Joi.bool(),
        table_reference_name: Joi.string(),
        table_uuid: Joi.string(),
        // is_table: Joi.bool().required(),
        fields: Joi.array().items(formFieldSchema).allow(null),
      }),
    )
    .min(1)
    .required(),
});

export const basicDataListValidateSchemaWithOneSection = (t) => Joi.object().keys({
  data_list_name: DATA_LIST_NAME_VALIDATION.label(FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.DATA_SET_NAME.LABEL).allow(
    null,
    EMPTY_STRING,
  ),
  data_list_description: DATA_LIST_DESCRIPTION_VALIDATION.label(
    FLOW_STRINGS.CREATE_DATA_LIST.BASIC_INFO.DATA_SET_DESCRIPTION.LABEL,
  ).allow(EMPTY_STRING, null),
  sections: Joi.array()
    .items(
      Joi.object().keys({
        section_name: SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL).allow('', null),
        section_description: SECTION_DESCRIPTION_VALIDATION.label(SECTION_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
        table_reference_name: Joi.string(),
        table_uuid: Joi.string(),
        section_order: Joi.number().required(),
        is_show_when_rule: Joi.bool(),
        // is_table: Joi.bool().required(),
        fields: Joi.array().items(formFieldSchema).allow(null),
      }),
    )
    .min(1)
    .required(),
});

export const basicDataListValidateSchema = (t) => Joi.object().keys({
  data_list_name: DATA_LIST_NAME_VALIDATION.label(FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.DATA_SET_NAME.LABEL).allow(
    null,
    EMPTY_STRING,
  ),
  data_list_description: DATA_LIST_DESCRIPTION_VALIDATION.label(
    FLOW_STRINGS(t).CREATE_DATA_LIST.BASIC_INFO.DATA_SET_DESCRIPTION.LABEL,
  ).allow(EMPTY_STRING, null),
  sections: Joi.array()
    .items(
      Joi.object().keys({
        section_name: Joi.when('fields', {
          is: Joi.array().min(1),
          then: SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL),
          otherwise: SECTION_NAME_VALIDATION.allow('', null).label(SECTION_TITLE.LABEL),
        }),
        section_description: SECTION_DESCRIPTION_VALIDATION.label(SECTION_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
        table_reference_name: Joi.string(),
        table_uuid: Joi.string(),
        section_order: Joi.number().required(),
        is_show_when_rule: Joi.bool(),
        // is_table: Joi.bool().required(),
        fields: Joi.array().items(formFieldSchema).allow(null),
      }),
    )
    .min(1)
    .required(),
});

export const newStepNameSchema = Joi.object().keys({
  step_name: STEP_NAME_VALIDATION.required().label('Step Name'),
});

export const sectionTitleValidateSchema = Joi.object().keys({
  section_name: SECTION_NAME_VALIDATION.required().label(SECTION_TITLE.LABEL),
});

export const saveTaskSchema = {
  task_name: TASK_NAME_VALIDATION.required().label('Task Name'),
  task_description: TASK_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING).label('Task Description'),
};

export const existingFormDetailsValidateSchema = Joi.object().keys({
  // username: EMAIL_VALIDATION.required().label(SIGN_IN_STRINGS.FORM_LABEL.EMAIL.LABEL),
  form_title: FORM_NAME_VALIDATION.label(TASK_STRINGS.FORM_TITLE.LABEL).allow(null, EMPTY_STRING),
  form_description: FORM_DESCRIPTION_VALIDATION.label(TASK_STRINGS.FORM_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
  sections: Joi.array()
    .items(
      Joi.object()
        .keys({
          section_name: Joi.when('fields', {
            is: Joi.array().min(1),
            then: SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL),
            otherwise: SECTION_NAME_VALIDATION.allow('', null).label(SECTION_TITLE.LABEL),
          }),
          section_description: SECTION_DESCRIPTION_VALIDATION.label(SECTION_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
          section_order: Joi.number().required(),
          is_show_when_rule: Joi.bool(),
          // is_table: Joi.bool().required(),
          fields: Joi.array().items(formFieldSchema).allow(null),
        })
        .unknown(true),
    )
    .min(1)
    .required(),
});

export const existingFormDetailsValidateSchemaWithOneSection = Joi.object().keys({
  // username: EMAIL_VALIDATION.required().label(SIGN_IN_STRINGS.FORM_LABEL.EMAIL.LABEL),
  form_title: FORM_NAME_VALIDATION.label(TASK_STRINGS.FORM_TITLE.LABEL).allow(null, EMPTY_STRING),
  form_description: FORM_DESCRIPTION_VALIDATION.label(TASK_STRINGS.FORM_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
  sections: Joi.array()
    .items(
      Joi.object()
        .keys({
          section_name: SECTION_NAME_VALIDATION.allow('', null).label(SECTION_TITLE.LABEL),
          section_description: SECTION_DESCRIPTION_VALIDATION.label(SECTION_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
          section_order: Joi.number().required(),
          is_show_when_rule: Joi.bool(),
          // is_table: Joi.bool().required(),
          fields: Joi.array().items(formFieldSchema).allow(null),
        })
        .unknown(true),
    )
    .min(1)
    .required(),
});

export const formDetailsValidateSchemaWithOneSection = Joi.object().keys({
  // username: EMAIL_VALIDATION.required().label(SIGN_IN_STRINGS.FORM_LABEL.EMAIL.LABEL),
  form_title: FORM_NAME_VALIDATION.label(TASK_STRINGS.FORM_TITLE.LABEL).allow(null, EMPTY_STRING),
  form_description: FORM_DESCRIPTION_VALIDATION.label(TASK_STRINGS.FORM_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
  sections: Joi.array()
    .items(
      Joi.object().keys({
        section_name: SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL).allow('', null),
        section_description: SECTION_DESCRIPTION_VALIDATION.label(SECTION_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
        table_reference_name: Joi.string(),
        table_uuid: Joi.string(),
        section_order: Joi.number().required(),
        is_show_when_rule: Joi.bool(),
        // is_table: Joi.bool().required(),
        fields: Joi.array().items(formFieldSchema).allow(null),
      }),
    )
    .min(1)
    .required(),
});

export const formDetailsValidateSchema = (t) => Joi.object().keys({
  // username: EMAIL_VALIDATION.required().label(SIGN_IN_STRINGS.FORM_LABEL.EMAIL.LABEL),
  form_title: FORM_NAME_VALIDATION.label(TASK_STRINGS.FORM_TITLE.LABEL).allow(null, EMPTY_STRING),
  form_description: FORM_DESCRIPTION_VALIDATION.label(TASK_STRINGS.FORM_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
  sections: Joi.array()
    .items(
      Joi.object().keys({
        is_system_defined: Joi.bool().optional(),
        section_name: SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL),
        section_description: SECTION_DESCRIPTION,
        section_uuid: SECTION_UUID,
        section_order: SECTION_ORDER,
        is_section_show_when_rule: IS_SECTION_SHOW_WHEN_RULE,
        field_list: Joi.array()
          .items(
            fieldListSchema(t).append({
              fields: Joi.array()
                .items(
                  formFieldSchemaObj(t).append({
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
          ),
      }),
    )
    .min(1)
    .required(),
});

export const formDetailsWithTableValidateSchema = Joi.object().keys({
  // username: EMAIL_VALIDATION.required().label(SIGN_IN_STRINGS.FORM_LABEL.EMAIL.LABEL),
  form_title: FORM_NAME_VALIDATION.label(TASK_STRINGS.FORM_TITLE.LABEL).allow(null, EMPTY_STRING),
  form_description: FORM_DESCRIPTION_VALIDATION.label(TASK_STRINGS.FORM_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
  sections: Joi.array()
    .items(
      Joi.object().keys({
        section_name: Joi.when('fields', {
          is: Joi.array().min(1),
          then: SECTION_NAME_VALIDATION.label(SECTION_TITLE.LABEL),
          otherwise: SECTION_NAME_VALIDATION.allow('', null).label(SECTION_TITLE.LABEL),
        }),
        section_description: SECTION_DESCRIPTION_VALIDATION.label(SECTION_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
        section_order: Joi.number().required(),
        is_show_when_rule: Joi.bool(),
        table_reference_name: Joi.string(),
        table_uuid: Joi.string(),
        // is_table: Joi.bool().required(),
        fields: Joi.array().items(formFieldSchema).allow(null),
      }),
    )
    .min(1)
    .required(),
});

export const formDetailsWithTableValidateSchemaWithOneSection = Joi.object().keys({
  // username: EMAIL_VALIDATION.required().label(SIGN_IN_STRINGS.FORM_LABEL.EMAIL.LABEL),
  form_title: FORM_NAME_VALIDATION.label(TASK_STRINGS.FORM_TITLE.LABEL).allow(null, EMPTY_STRING),
  form_description: FORM_DESCRIPTION_VALIDATION.label(TASK_STRINGS.FORM_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
  sections: Joi.array()
    .items(
      Joi.object().keys({
        section_name: SECTION_NAME_VALIDATION.allow('', null).label(SECTION_TITLE.LABEL),
        section_description: SECTION_DESCRIPTION_VALIDATION.label(SECTION_DESCRIPTION.LABEL).allow(EMPTY_STRING, null),
        section_order: Joi.number().required(),
        is_show_when_rule: Joi.bool(),
        table_reference_name: Joi.string(),
        table_uuid: Joi.string(),
        // is_table: Joi.bool().required(),
        fields: Joi.array().items(formFieldSchema).allow(null),
      }),
    )
    .min(1)
    .required(),
});

export const saveAddActorsDetailsValidateSchema = (t = translateFunction) => Joi.object().keys({ // not used
  step_name: STEP_NAME_VALIDATION.required().label('Step Name'),
  step_description: STEP_DESCRIPTION_VALIDATION(t).allow(null, EMPTY_STRING).label('Step Description'),
  step_order: Joi.number().allow(null),
  assignees: Joi.object()
    .keys({
      teams: Joi.array().items(Joi.object().keys({ _id: Joi.string().required() }).unknown(true).required()),
      users: Joi.array().items(Joi.object().keys({ _id: Joi.string().required() }).unknown(true).required()),
    })
    .min(1),
});

export const actorsRuleValidateSchema = Joi.object().keys({
  if: Joi.array().items(
    Joi.object().keys({
      l_selectedFieldValue: Joi.string().required(),
      l_field: Joi.string().required().label('When'),
      operator: Joi.string().required(),
      r_value: Joi.when('l_selectedFieldValue', {
        is: FIELD_TYPES.SINGLE_LINE,
        then: Joi.string().required().label('Value'),
        otherwise: Joi.when('l_selectedFieldValue', {
          is: FIELD_TYPES.NUMBER,
          then: Joi.number().required().label('Value'),
          otherwise: Joi.when('l_selectedFieldValue', {
            is: FIELD_TYPES.DATE,
            then: dateValidationSchema,
            otherwise: Joi.when('l_selectedFieldValue', {
              is: FIELD_TYPES.PARAGRAPH,
              then: paragraphValidationSchema,
            }),
          }),
        }),
      }).label('Value'),
      output_value: Joi.object()
        .keys({
          teams: Joi.array().items(Joi.string()),
          users: Joi.array().items(Joi.string()),
        })
        .min(1),
    }),
  ),
  else_output_value: Joi.object()
    .keys({
      teams: Joi.array().items(Joi.string()),
      users: Joi.array().items(Joi.string()),
    })
    .min(1),
});

export const actionsSchema = Joi.object().keys({
  action: ACTION_NAME_VALIDATION.uppercase().required(),
  has_next_step: Joi.bool().required(),
  action_order: Joi.number(),
  next_step_name: Joi.string(),
  next_step_uuid: Joi.when('has_next_step', {
    is: true,
    then: Joi.array().items(Joi.string().required()).min(1).required(),
    otherwise: Joi.array().allow(null),
  }),
});

export const securityValidateSchema = Joi.object().keys({
  entry_adders: Joi.object().keys({
    teams: Joi.array().items(Joi.object().keys({
      _id: Joi.string().required(),
    }).unknown(true)).min(1),
    users: Joi.array().items(Joi.object().keys({
      _id: Joi.string().required(),
    }).unknown(true)).min(1),
  }).min(1).or('teams', 'users')
.label('entry adders'),
});

export const saveActionDetailsValidateSchema = (t = translateFunction) => Joi.object().keys({ // not used
  step_name: STEP_NAME_VALIDATION.required().label('Step Name'),
  step_description: STEP_DESCRIPTION_VALIDATION(t).allow(null, EMPTY_STRING).label('Step Description'),
  step_order: Joi.number().allow(null),
  assignees: Joi.object()
    .keys({
      teams: Joi.array().items(Joi.object().keys({ _id: Joi.string().required() }).unknown(true).required()),
      users: Joi.array().items(Joi.object().keys({ _id: Joi.string().required() }).unknown(true).required()),
    })
    .min(1),
  // actions: Joi.array().items(actionsSchema).unique('action').required(),
});

export const getExistingFormDetailsAPIData = (state, currentStep) => {
  const formPostData = {};
  if (!jsUtils.isEmpty(state.form_title)) formPostData.form_title = state.form_title;
  if (!jsUtils.isEmpty(state.form_description)) formPostData.form_decsription = state.form_decsription;
  formPostData.step_id = state.steps[currentStep]._id;
  formPostData.step_uuid = state.steps[currentStep].step_uuid;
  formPostData.flow_id = state.flow_id;
  formPostData.flow_uuid = state.flow_uuid;
  formPostData.sections = state.sections;

  formPostData.sections.forEach((section, sectionIndex) => {
    if (section.is_table) {
      section.fields.forEach((field) => {
        formPostData.sections[sectionIndex].fields[field.column_order - 1].is_edited = true;
        formPostData.sections[sectionIndex].fields[field.column_order - 1].reference_name = trimString(field.reference_name);
        if (formPostData.sections[sectionIndex].is_table) {
          formPostData.sections[sectionIndex].table_reference_name = trimString(section.table_reference_name);
          console.log('sectionsection', section);
          // if(formPostData.sections[section.section_order - 1].table_uuid){
          //   formPostData.sections[
          //     section.section_order - 1
          //   ].table_uuid = table_uuid
          // }
        }
        if (formPostData.sections[sectionIndex].fields[field.row_order - 1].l_field) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].l_field;
        }
        if (formPostData.sections[sectionIndex].fields[field.row_order - 1].l_selectedFieldValue) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].l_selectedFieldValue;
        }
        if (formPostData.sections[sectionIndex].fields[field.row_order - 1].operator) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].operator;
        }
        if (formPostData.sections[sectionIndex].fields[field.row_order - 1].r_value) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].r_value;
        }
        if (formPostData.sections[sectionIndex].fields[field.row_order - 1].arrOperatorData) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].arrOperatorData;
        }
        if (hasOwn(formPostData.sections[sectionIndex].fields[field.row_order - 1], 'isReadOnly')) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].isReadOnly;
        }
        if (hasOwn(formPostData.sections[sectionIndex].fields[field.row_order - 1], 'isSelected')) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].isSelected;
        }
        if (formPostData.sections[sectionIndex].fields[field.column_order - 1].read_only) {
          formPostData.sections[sectionIndex].fields[field.column_order - 1].required = false;
          formPostData.sections[sectionIndex].fields[field.column_order - 1].validations = {};
        }
        if ([FIELD_TYPES.CHECKBOX, FIELD_TYPES.DROPDOWN, FIELD_TYPES.RADIO_GROUP].includes(field.field_type)) {
          formPostData.sections[sectionIndex].fields[field.column_order - 1].values = getSortedListForFormField(
            field.values,
          );
        }
      });
    } else {
      section.fields.forEach((field) => {
        if (formPostData.sections[sectionIndex].fields[field.row_order - 1].l_field) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].l_field;
        }
        if (formPostData.sections[sectionIndex].fields[field.row_order - 1].l_selectedFieldValue) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].l_selectedFieldValue;
        }
        if (formPostData.sections[sectionIndex].fields[field.row_order - 1].operator) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].operator;
        }
        if (formPostData.sections[sectionIndex].fields[field.row_order - 1].r_value) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].r_value;
        }
        if (formPostData.sections[sectionIndex].fields[field.row_order - 1].arrOperatorData) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].arrOperatorData;
        }
        formPostData.sections[sectionIndex].fields[field.row_order - 1].is_edited = true;
        formPostData.sections[sectionIndex].fields[field.row_order - 1].reference_name = trimString(field.reference_name);
        if (formPostData.sections[section.section_order - 1].is_table) {
          formPostData.sections[section.section_order - 1].table_reference_name = trimString(section.table_reference_name);
          console.log('sectionsection', section);
        }
        if (hasOwn(formPostData.sections[sectionIndex].fields[field.row_order - 1], 'isReadOnly')) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].isReadOnly;
        }
        if (hasOwn(formPostData.sections[sectionIndex].fields[field.row_order - 1], 'isSelected')) {
          delete formPostData.sections[sectionIndex].fields[field.row_order - 1].isSelected;
        }
        if (formPostData.sections[sectionIndex].fields[field.row_order - 1].read_only) {
          formPostData.sections[sectionIndex].fields[field.row_order - 1].required = false;
          formPostData.sections[sectionIndex].fields[field.row_order - 1].validations = {};
        }
        if ([FIELD_TYPES.CHECKBOX, FIELD_TYPES.DROPDOWN, FIELD_TYPES.RADIO_GROUP].includes(field.field_type)) {
          formPostData.sections[sectionIndex].fields[field.row_order - 1].values = getSortedListForFormField(field.values);
        }
      });
    }
  });
  // filterting empty sections
  let areEmptySectionsRemoved = false;
  const filteredSections = formPostData.sections.filter((eachSection) => {
    if (jsUtils.isEmpty(eachSection.fields)) {
      areEmptySectionsRemoved = true;
      return false;
    }
    return true;
  });

  // re-ordering filtered section order numbers
  if (areEmptySectionsRemoved) {
    formPostData.sections = filteredSections.map((eachSection, eachSectionIndex) => {
      return {
        ...eachSection,
        section_order: eachSectionIndex + 1,
      };
    });
  } else formPostData.sections = filteredSections;
  return formPostData;
};

export const getSaveFormDataListMetadata = (state) => {
  let local_state = state;
  if (!(local_state.data_list_id && local_state.data_list_uuid)) local_state = store.getState().CreateDataListReducer;
  return {
    data_list_id: local_state.data_list_id,
    // data_list_uuid: local_state.data_list_uuid,
  };
};

export const getSaveFieldDetailsAPIDataDataList = (state, sectionIndex, fieldListIndex, fieldIndex) => getSaveFieldAPIData(state, sectionIndex, fieldListIndex, fieldIndex, () => getSaveFormDataListMetadata(state));

export const getSaveTableDetailsAPIDataDataList = (state, sectionIndex, fieldListIndex) => getSaveTableApiData(state, sectionIndex, fieldListIndex, () => getSaveFormDataListMetadata(state));

export const getFormDetailsAPIDataDataList = (state, sectionIndex, fieldListIndex, fieldIndex, isFinalSubmission = false) => getSaveFormAPIData(state, sectionIndex, fieldListIndex, fieldIndex, () => getSaveFormDataListMetadata(state), false, false, isFinalSubmission);

const visibilityConfigConditions = [
  { is: 'isEmpty', then: Joi.allow('', null) },
  { is: 'isNotEmpty', then: Joi.allow('', null) },
  { is: 'booleanIsTrue', then: Joi.allow('', null) },
  { is: 'booleanIsFalse', then: Joi.allow('', null) },
];

export const visibilityConfigSchema = Joi.object().keys({
  is_show_when_rule: Joi.bool().default(false),
  l_field: Joi.string()
    .label('Field')
    .when('is_show_when_rule', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.allow(''),
    }),
  operator: Joi.string()
    .label('Operator')
    .when('is_show_when_rule', {
      is: true,
      then: Joi.required(),
      otherwise: Joi.allow(''),
    }),
  r_value: Joi.alternatives()
    .try(Joi.optional())
    .when('is_show_when_rule', {
      is: true,
      then: Joi.when('operator', {
        switch: visibilityConfigConditions,
        otherwise: Joi.required().label('Value'),
      }),
      otherwise: Joi.allow(''),
    })
    .label('Value'),
});

export const datalistFormValidationSchema = (t) => (
  Joi.object().keys({
    sections: layoutSectionSchema(t),
  }));

export default basicDataListDetailsValidationSchema;
