import Joi from 'joi';
import { ACTION_TYPE } from 'utils/constants/action.constant';
import { isEmpty, translateFunction } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { EMAIL_REGEX, EMOJI_REGEX } from 'utils/strings/Regex';
import {
  EMAIL_BODY_VALIDATION,
  EMAIL_NAME_VALIDATION,
  EMAIL_SUBJECT_VALIDATION,
  STEP_DESCRIPTION_VALIDATION,
  STEP_NAME_VALIDATION,
  STEP_STATUS_VALIDATION,
  TABLE_FIELD_LIST_TYPE,
  FLOW_STEP_NAME_VALIDATION,
} from 'utils/ValidationConstants';
import { FIELD_MAPPING_ERRORS, MAPPING_CONSTANTS } from 'components/flow_trigger_configuration/field_mapping/FieldMapping.constants';
import { FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import { getValidationsForCurrencyField, getValidationsForDataListPickerField, getValidationsForDateField, getValidationsForEmailField, getValidationsForFileUploadField, getValidationsForLinkField, getValidationsForNumberField, getValidationsForParagraphField, getValidationsForPhoneNumberField, getValidationsForScanner, getValidationsForSingleLine, getValidationsForUserTeamPickerField } from 'containers/landing_page/my_tasks/task_content/TaskContent.validation.schema';
import { store } from 'Store';
import { FIELD_LIST_TYPE } from 'utils/constants/form.constant';
import { FIELD_MAPPING_TYPES, FLOW_TRIGGER_CONSTANTS } from 'components/flow_trigger_configuration/TriggerConfiguration.constants';
import {
  DUE_DATE_AND_STATUS,
  FLOW_CONFIG_STRINGS,
} from '../EditFlow.strings';
import { BASIC_CONFIG_STRINGS, constructDueDateData, getFieldTypeIncludingChoiceValueType } from './StepConfiguration.utils';
import { RECIPIENT_OPTION_LIST, RECIPIENT_TYPE, SEND_DATA_TO_DATALIST_STRINGS } from './configurations/Configuration.strings';
import { INTEGRATION_CONSTANTS } from '../diagramatic_flow_view/flow_component/flow_integration_configuration/FlowIntegrationConfiguration.constants';
import { DATA_TYPE } from './StepConfiguration.constants';
import { JOIN_STEP_CONDITIONS } from '../EditFlow.constants';
import { ENTRY_ACTION_TYPE, SEND_DATA_TO_DATALIST } from './configurations/Configuration.constants';
import { ASSIGNEE_TYPE } from '../EditFlow.utils';
import { SET_ASSIGNEE_STRINGS } from './set_assignee/SetAssignee.strings';
import { ML_INTEGRATION } from '../diagramatic_flow_view/flow_component/flow_ml_configuration/MLModelConfiguration.constants';
import { FIELD_TYPE } from '../../../utils/constants/form.constant';
import { FF_DROPDOWN_LIST } from '../../../components/form_builder/FormBuilder.strings';
import { FLOW_MIN_MAX_CONSTRAINT } from '../../../utils/Constants';

const { DUE_DATE } = DUE_DATE_AND_STATUS;
const { VALIDATION_MESSAGE, ALL_LABELS } = SEND_DATA_TO_DATALIST_STRINGS;
const {
  STEP_NAME_LABEL, CHOOSE_FLOW_STRING, ERRORS,
  VALUE_LABEL, ADDITIONAL_CONFIG, SEND_EMAIL_CONFIG,
  DUE_DATE_LABEL,
} = FLOW_CONFIG_STRINGS;
const {
  TRIGGER_NAME_STRING,
  CHILD_FIELD_STRING,
  PARENT_FIELD_STRING,
} = FLOW_TRIGGER_CONSTANTS;
const { MIN_ONE_TABLE_COLUMN } = FIELD_MAPPING_ERRORS;

export const dueDateValidationSchema = (t = translateFunction) => Joi.object().keys({
  type: Joi.string().valid(DATA_TYPE.DIRECT, DATA_TYPE.RULE),
  duration_type: Joi.string()
    .label('Duration type')
    .valid(DUE_DATE.LOOKUP.DAYS, DUE_DATE.LOOKUP.HOURS),
  duration: Joi.when('duration_type', {
    switch: [
      {
        is: DUE_DATE_AND_STATUS.DUE_DATE.LOOKUP.HOURS,
        then: Joi.number()
          .integer()
          .label(DUE_DATE.OPTIONS[1].label)
          .min(1)
          .max(DUE_DATE.MAX_LIMIT.HOURS)
          .required()
          .messages({
            'number.max': t(ERRORS.DUE_DATE.MAX_HOURS_LIMIT),
            'number.min': t(ERRORS.DUE_DATE.MIN_HOURS_LIMIT),
          }),
      },
      {
        is: DUE_DATE_AND_STATUS.DUE_DATE.LOOKUP.DAYS,
        then: Joi.number()
          .integer()
          .label(DUE_DATE.OPTIONS[0].label)
          .min(1)
          .max(DUE_DATE.MAX_LIMIT.DAYS)
          .required()
          .messages({
            'number.max': t(ERRORS.DUE_DATE.MAX_DAYS_LIMIT),
            'number.min': t(ERRORS.DUE_DATE.MIN_DAYS_LIMIT),
          }),
      },
    ],
    otherwise: Joi.forbidden(),
  }),
});

export const setAssigneeAdditionalDetailsSchema = (t = translateFunction) => Joi.object().keys({
  due_data: dueDateValidationSchema(t),
  step_status: Joi.string().label('Status').allow(null),
});

export const newStepNameSchema = (t = translateFunction) => Joi.object().keys({
  step_name: STEP_NAME_VALIDATION.required().label(t(STEP_NAME_LABEL)),
});

export const triggerNameSchema = (t = translateFunction) => Joi.object().keys({
  trigger_name: Joi.string()
  .regex(EMOJI_REGEX, { name: 'emoji', invert: true })
  .min(2)
  .max(50)
  .required()
  .label(t(TRIGGER_NAME_STRING)),
});

export const staticValueSchema = (t = translateFunction, maximum_file_size, childFieldType = 'child_field_type', additionalConfig = {}, isRequiredValidation = false) => {
  const staticValueFieldData = { field_name: t(VALUE_LABEL) };
  return Joi.when(childFieldType, {
    switch: [
      {
        is: FIELD_TYPES.SINGLE_LINE,
        then: getValidationsForSingleLine({}, staticValueFieldData, true, false, true),
      },
      {
        is: FIELD_TYPES.PARAGRAPH,
        then: getValidationsForParagraphField({}, staticValueFieldData, true, false, true),
      },
      {
        is: FIELD_TYPES.NUMBER,
        then: additionalConfig?.isOnlyRequired ? Joi.number().required().label(t(VALUE_LABEL)) : getValidationsForNumberField({}, staticValueFieldData, true, false, true),
      },
      {
        is: FIELD_TYPES.DROPDOWN,
        then: Joi.alternatives(Joi.string().required().label(t(VALUE_LABEL)), Joi.number().required().label(t(VALUE_LABEL))),
      },
      {
        is: FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
        then: Joi.alternatives(Joi.string().required().label(t(VALUE_LABEL)), Joi.number().required().label(t(VALUE_LABEL))),
      },
      {
        is: FIELD_TYPES.RADIO_GROUP,
        then: Joi.alternatives(Joi.string().required().label(t(VALUE_LABEL)), Joi.number().required().label(t(VALUE_LABEL))),
      },
      {
        is: FIELD_TYPES.YES_NO,
        then: Joi.boolean().required().label(t(VALUE_LABEL)),
      },
      {
        is: FIELD_TYPES.CHECKBOX,
        then: Joi.array().items(
          Joi.alternatives(Joi.string(), Joi.number()),
        ).required().min(1)
          .messages({
            'array.min': `${t(VALUE_LABEL)} ${t(ERRORS.IS_REQUIRED)}`,
          }),
      },
      {
        is: FIELD_TYPES.DATE,
        then: getValidationsForDateField(
          false,
          {
            date_selection: [
              {
                type: 'no_limit',
              },
            ],
          },
          staticValueFieldData,
          true,
          FIELD_TYPES.DATE,
          false,
          true,
          store.getState().LanguageAndCalendarAdminReducer.working_days || [],
          {},
          [],
          t,
        ),
      },
      {
        is: FIELD_TYPES.DATETIME,
        then: getValidationsForDateField(
          false,
          {
            date_selection: [
              {
                type: 'no_limit',
              },
            ],
          },
          staticValueFieldData,
          true,
          FIELD_TYPES.DATETIME,
          false,
          true,
          store.getState().LanguageAndCalendarAdminReducer.working_days || [],
          {},
          [],
          t,
        ),
      },
      {
        is: FIELD_TYPES.FILE_UPLOAD,
        then: getValidationsForFileUploadField(
          {
            is_multiple: true,
            minimum_count: 1,
          },
          staticValueFieldData,
          true,
          false,
          true,
          {
            maximum_file_size: maximum_file_size,
          },
          false),
      },
      {
        is: FIELD_TYPES.EMAIL,
        then: getValidationsForEmailField({}, staticValueFieldData, true, false, true),
      },
      {
        is: FIELD_TYPES.PHONE_NUMBER,
        then: getValidationsForPhoneNumberField(staticValueFieldData, true, false, true),
      },
      {
        is: FIELD_TYPES.CURRENCY,
        then: getValidationsForCurrencyField({}, staticValueFieldData, true, false, true),
      },
      {
        is: FIELD_TYPES.LINK,
        then: getValidationsForLinkField(
          {
            is_multiple: true,
            minimum_count: 1,
          },
          staticValueFieldData,
          true,
          false,
          true,
        ),
      },
      {
        is: FIELD_TYPES.SCANNER,
        then: getValidationsForScanner({}, staticValueFieldData, true, false, true),
      },
      {
        is: FIELD_TYPES.USER_TEAM_PICKER,
        then: getValidationsForUserTeamPickerField({}, staticValueFieldData, true, false, true, translateFunction, isRequiredValidation),
      },
      {
        is: FIELD_TYPES.DATA_LIST,
        then: getValidationsForDataListPickerField(
          {
            filter_fields: [],
            allow_multiple: true,
          },
          staticValueFieldData,
          true,
          false,
          true,
        ).messages({
          'array.min': `${t(VALUE_LABEL)} ${t(ERRORS.IS_REQUIRED)}`,
        }),
      },
      {
        is: FIELD_TYPES.INFORMATION,
        then: getValidationsForSingleLine({}, staticValueFieldData, true, false, true),
      },
    ],
  });
};
export const saveTriggerStepValidationSchema = (t = translateFunction, maximum_file_size) => Joi.object().keys({
  child_flow_uuid: Joi.string().required().label(t(CHOOSE_FLOW_STRING)).messages({
    'any.required': t(ERRORS.CHOOSE_FLOW_TO_CALL),
    'string.empty': t(ERRORS.CHOOSE_FLOW_TO_CALL),
  }),
  trigger_mapping: Joi.array().items(Joi.object().keys({
    c: Joi.string().when('a', { is: 'avalue', then: Joi.string().required() }).concat(Joi.string().when('b', { is: 'bvalue', then: Joi.string().required() })),
    value_type: Joi.when('child_field_uuid', {
      is: Joi.exist(),
      then: Joi.string().valid(FIELD_MAPPING_TYPES.DYNAMIC,
                                FIELD_MAPPING_TYPES.STATIC,
                                FIELD_MAPPING_TYPES.SYSTEM,
                               MAPPING_CONSTANTS.DATA_LIST_ENTRY_MAPPING.value).required(),
    }).concat(
      Joi.when('child_table_uuid', {
        is: Joi.exist(),
        then: Joi.string().valid(FIELD_MAPPING_TYPES.DYNAMIC,
                                  FIELD_MAPPING_TYPES.STATIC,
                                  FIELD_MAPPING_TYPES.SYSTEM).required(),
      }),
    ),
    child_field_uuid: Joi.when('child_field_type', {
      is: FIELD_LIST_TYPE.TABLE,
      then: Joi.forbidden(),
      otherwise: Joi.string().required().label(t(CHILD_FIELD_STRING)),
    }),
    child_table_uuid: Joi.when('child_field_type', {
      is: FIELD_LIST_TYPE.TABLE,
      then: Joi.string().required().label(t(CHILD_FIELD_STRING)),
      otherwise: Joi.forbidden(),
    }),
    child_field_type: Joi.string().label(t(CHILD_FIELD_STRING)),
    parent_field_type: Joi.string().label(t(PARENT_FIELD_STRING)),
    values: Joi.any().label('Values'),
    parent_field_uuid: Joi.when('value_type', {
      is: MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[1].value,
      then: Joi.when('parent_field_type', {
        is: FIELD_LIST_TYPE.TABLE,
        then: Joi.forbidden(),
        otherwise: Joi.string().required().label(t(PARENT_FIELD_STRING)),
      }),
      otherwise: Joi.forbidden(),
    }),
    parent_system_field: Joi.when('value_type', {
      is: FIELD_MAPPING_TYPES.SYSTEM,
      then: Joi.string().required().label(t(PARENT_FIELD_STRING)),
      otherwise: Joi.forbidden(),
    }),
    parent_table_uuid: Joi.when('value_type', {
      is: MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[1].value,
      then: Joi.when('parent_field_type', {
        is: FIELD_LIST_TYPE.TABLE,
        then: Joi.string().required().label(t(PARENT_FIELD_STRING)),
        otherwise: Joi.forbidden(),
      }),
      otherwise: Joi.forbidden(),
    }),
    field_mapping: Joi.when('parent_field_type', {
      is: FIELD_LIST_TYPE.TABLE,
      then: Joi.array().items(Joi.object().keys({
        value_type: Joi.when('child_field_uuid', {
          is: Joi.exist(),
          then: Joi.string().valid(MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[0].value,
                                    MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[1].value,
                                    FIELD_MAPPING_TYPES.SYSTEM,
                                    MAPPING_CONSTANTS.DATA_LIST_ENTRY_MAPPING.value).required(),
          otherwise: Joi.forbidden(),
        }),
        child_field_type: Joi.string().label(t(CHILD_FIELD_STRING)),
        child_field_uuid: Joi.string().required().label(t(CHILD_FIELD_STRING)).messages({
          'any.required': 'Table column is required',
        }),
        values: Joi.any().label('Values'),
        parent_field_uuid: Joi.when('value_type', {
          is: MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[1].value,
          then: Joi.string().required().label(t(PARENT_FIELD_STRING)).messages({
            'any.required': 'Table column is required',
          }),
          otherwise: Joi.forbidden(),
        }),
        parent_system_field: Joi.when('value_type', {
          is: FIELD_MAPPING_TYPES.SYSTEM,
          then: Joi.string().required().label(t(PARENT_FIELD_STRING)),
          otherwise: Joi.forbidden(),
        }),
        static_value: Joi.when('value_type', {
          is: MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[0].value,
          then: staticValueSchema(t, maximum_file_size),
          otherwise: Joi.forbidden(),
        }),
      })).min(1),
    }).messages({
      'array.min': t(MIN_ONE_TABLE_COLUMN),
    }),
    static_value: Joi.when('value_type', {
      is: MAPPING_CONSTANTS.VALUE_TYPE_OPTION_LIST()[0].value,
      then: staticValueSchema(t, maximum_file_size),
      otherwise: Joi.forbidden(),
    }),
  })),
});

export const basicIntegerationSchema = (t = translateFunction) => (
  Joi.object().keys({
    step_name: STEP_NAME_VALIDATION.required().label(t(INTEGRATION_CONSTANTS.BASIC_CONFIGURATION.STEP_NAME.LABEL)),
    step_description: STEP_DESCRIPTION_VALIDATION(t).allow(
      null,
      EMPTY_STRING,
    ).label(t(INTEGRATION_CONSTANTS.BASIC_CONFIGURATION.STEP_DESCRIPTION.LABEL)),
    connector_uuid: Joi.string().required().label(t(INTEGRATION_CONSTANTS.BASIC_CONFIGURATION.APP.LABEL)),
    event_uuid: Joi.string().required().label(t(INTEGRATION_CONSTANTS.BASIC_CONFIGURATION.EVENT.LABEL)),
    })
);

export const stepDetailsSchema = (t = translateFunction) => (
  Joi.object().keys({
    step_name: FLOW_STEP_NAME_VALIDATION.required().label(t(BASIC_CONFIG_STRINGS.FIELDS.STEP_NAME.LABEL)),
    step_description: STEP_DESCRIPTION_VALIDATION(t).allow(
      null,
      EMPTY_STRING,
    ).label(t(BASIC_CONFIG_STRINGS.FIELDS.STEP_DESCRIPTION.LABEL)),
  })
);

export const basicMLIntegerationSchema = (t = translateFunction) => (
  Joi.object().keys({
    step_name: STEP_NAME_VALIDATION.required().label(t(ML_INTEGRATION.BASIC_INTEGRATION.STEP_NAME.LABEL)),
    description: STEP_DESCRIPTION_VALIDATION(t).allow(
      null,
      EMPTY_STRING,
    ).label(t(ML_INTEGRATION.BASIC_INTEGRATION.STEP_DESCRIPTION.LABEL)),
    model_code: Joi.string().required().label(t(ML_INTEGRATION.BASIC_INTEGRATION.ML_MODEL_DROPDOWN.LABEL)),
    })
);

export const testRequestIntegrationData = (t = translateFunction) => (
  Joi.object().keys({
  event_headers: Joi.array().items(
    Joi.object().keys({
      isRequired: Joi.boolean().required().label('Required'),
      test_value: Joi.when('isRequired', {
              is: true,
              then: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.HEADERS.VALUE.LABEL)),
              otherwise: Joi.string().allow(EMPTY_STRING).label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.HEADERS.VALUE.LABEL)),
      }),
      value: Joi.optional(),
      key_name: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.HEADERS.KEY.LABEL)),
      key: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.HEADERS.KEY.LABEL)),
      type: Joi.string(),
      field_details: Joi.optional(),
    }),
  ),
  query_params: Joi.array().items(
    Joi.object().keys({
      isRequired: Joi.boolean().required().label('Required'),
      test_value: Joi.when('isRequired', {
              is: true,
              then: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.VALUE.LABEL)),
              otherwise: Joi.string().allow(EMPTY_STRING).label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.VALUE.LABEL)),
      }),
      value: Joi.optional(),
      key_name: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
      key: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
      type: Joi.string(),
      field_details: Joi.optional(),
    }),
  ),
  relative_path: Joi.array().items(
    Joi.object().keys({
      isRequired: Joi.boolean().required().label('Required'),
      test_value: Joi.when('isRequired', {
              is: true,
              then: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.VALUE.LABEL)),
              otherwise: Joi.string().allow(EMPTY_STRING).label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.VALUE.LABEL)),
      }),
      value: Joi.optional(),
      key_name: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
      key: Joi.optional(),
      type: Joi.string(),
      field_details: Joi.optional(),
    }),
  ),
}));

export const requestIntegerationSchema = (t = translateFunction) => (
  Joi.object().keys({
    step_name: STEP_NAME_VALIDATION.required().label(t(INTEGRATION_CONSTANTS.BASIC_CONFIGURATION.STEP_NAME.LABEL)),
    step_description: STEP_DESCRIPTION_VALIDATION(t).allow(
      null,
      EMPTY_STRING,
    ).label(t(INTEGRATION_CONSTANTS.BASIC_CONFIGURATION.STEP_DESCRIPTION.LABEL)),
    connector_uuid: Joi.string().required().label(t(INTEGRATION_CONSTANTS.BASIC_CONFIGURATION.APP.LABEL)),
    event_uuid: Joi.string().required().label(t(INTEGRATION_CONSTANTS.BASIC_CONFIGURATION.EVENT.LABEL)),
    event_headers: Joi.array().items(
      Joi.object().keys({
        value: Joi.when('isRequired', {
                is: true,
                then: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.HEADERS.VALUE.LABEL)),
                otherwise: Joi.string().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.HEADERS.VALUE.LABEL)),
        }),
        key_name: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.HEADERS.KEY.LABEL)),
        key: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.HEADERS.KEY.LABEL)),
        isRequired: Joi.boolean().required().label('Required'),
      }),
    ),
    query_params: Joi.array().items(
      Joi.object().keys({
        value: Joi.when('isRequired', {
                is: true,
                then: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.VALUE.LABEL)),
                otherwise: Joi.string().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.VALUE.LABEL)),
        }),
        key_name: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
        key: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
        isRequired: Joi.boolean().required().label('Required'),
      }),
    ),
    relative_path: Joi.array().items(
      Joi.object().keys({
        value: Joi.when('isRequired', {
                is: true,
                then: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.VALUE.LABEL)),
                otherwise: Joi.string().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.VALUE.LABEL)),
        }),
        key_name: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
        key: Joi.optional(),
        isRequired: Joi.boolean().required().label('Required'),
      }),
    ),
    body: Joi.optional(),
  })
);

export const requestMLIntegerationSchema = (t = translateFunction) => (
  Joi.object().keys({
    step_name: STEP_NAME_VALIDATION.required().label(t(INTEGRATION_CONSTANTS.BASIC_CONFIGURATION.STEP_NAME.LABEL)),
    description: STEP_DESCRIPTION_VALIDATION(t).allow(
      null,
      EMPTY_STRING,
    ).label(t(INTEGRATION_CONSTANTS.BASIC_CONFIGURATION.STEP_DESCRIPTION.LABEL)),
    model_code: Joi.string().required().label(t(ML_INTEGRATION.BASIC_INTEGRATION.ML_MODEL_DROPDOWN.LABEL)),
    request_body: Joi.array().items(
      Joi.object().keys({
        value: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.VALUE.LABEL)),
        type: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.VALUE.LABEL)),
        key: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
        is_required: Joi.boolean().required().label('Required'),
      }),
    ),
  })
);

const constructRequestBodySchema = (depth = 0, t = translateFunction) =>
  Joi.object().keys({
    key: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
    key_name: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
    key_type: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
    is_required: Joi.boolean().required().label('Is Required'),
    is_multiple: Joi.boolean().required().label('Is Multiple'),
    test_value: Joi.optional(),
    keepChild: Joi.optional(),
    value: Joi.when('key_type', {
      is: 'object',
      then: Joi.when('is_multiple', {
        is: true,
        then: Joi.when('is_required', {
          is: true,
          then: Joi.required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.VALUE.LABEL)),
          otherwise: Joi.optional(),
        }),
        otherwise: Joi.optional(),
      }),
      otherwise: Joi.when('is_required', {
        is: true,
        then: Joi.required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.VALUE.LABEL)),
        otherwise: Joi.optional(),
      }),
    }),
    field_details: Joi.optional(),
    type: Joi.optional(),
    // key_uuid: Joi.string().required().label('Request Key'),
    root_uuid: Joi.optional(),
    path: Joi.optional(),
    description: Joi.optional(),
    child_rows:
      depth === 4
        ? Joi.optional()
        : Joi.when('key_type', {
          is: 'object',
          then: Joi.array().when('keepChild', {
            is: true,
            then: Joi.array()
            .items(constructRequestBodySchema(depth + 1, t))
            .has(Joi.object().keys({
              value: Joi.when('key_type', {
                is: 'object',
                then: Joi.when('is_multiple', {
                  is: true,
                  then: Joi.string().required(),
                  otherwise: Joi.optional(),
                }),
                otherwise: Joi.string().required(),
              }),
             }).unknown(true)),
            otherwise: Joi.optional(),
          }),
          otherwise: Joi.forbidden(),
        }),
  });

export const requestBodyValidationSchema = (t = translateFunction) => (Joi.array()
  .unique((a, b) => a.key === b.key)
  .items(constructRequestBodySchema(0, t)));

  const constructTestRequestBodySchema = (depth = 0, t) =>
  Joi.object().keys({
    key: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
    key_name: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
    key_type: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
    is_required: Joi.boolean().required().label('Is Required'),
    is_multiple: Joi.boolean().required().label('Is Multiple'),
    value: Joi.optional(),
    keepChild: Joi.optional(),
    test_value: Joi.when('key_type', {
      is: 'object',
      then: Joi.optional(),
      otherwise: Joi.when('is_required', {
        is: true,
        then: Joi.required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.VALUE.LABEL)),
        otherwise: Joi.optional(),
      }),
    }),
    field_details: Joi.optional(),
    type: Joi.optional(),
    // key_uuid: Joi.string().required().label('Request Key'),
    root_uuid: Joi.optional(),
    path: Joi.optional(),
    description: Joi.optional(),
    child_rows:
      depth === 4
        ? Joi.optional()
        : Joi.when('key_type', {
          is: 'object',
          then: Joi.array().when('keepChild', {
            is: true,
            then: Joi.array()
            .items(constructTestRequestBodySchema(depth + 1, t))
            .has(Joi.object().keys({
              test_value: Joi.when('key_type', {
                is: 'object',
                then: Joi.optional(),
                otherwise: Joi.required(),
              }),
             }).unknown(true)),
            otherwise: Joi.optional(),
          }),
          otherwise: Joi.forbidden(),
        }),
  });

  const constructMLtRequestBodySchema = (depth = 0, t) =>
  Joi.object().keys({
    key: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
    type: Joi.string().required().label(t(INTEGRATION_CONSTANTS.REQUEST_CONFIGURATION.QUERY.KEY.LABEL)),
    is_required: Joi.boolean().required().label('Is Required'),
    is_multiple: Joi.boolean().required().label('Is Multiple'),
    value: Joi.optional(),
    key_uuid: Joi.optional(),
    validations: Joi.optional(),
    keepChild: Joi.optional(),
    value_uuid: Joi.optional(),
    field_details: Joi.optional(),
    root_uuid: Joi.optional(),
    path: Joi.optional(),
    description: Joi.optional(),
    child_rows:
      depth === 4
        ? Joi.optional()
        : Joi.when('key_type', {
          is: 'object',
          then: Joi.array().when('keepChild', {
            is: true,
            then: Joi.array()
            .items(constructTestRequestBodySchema(depth + 1, t))
            .has(Joi.object().keys({
              test_value: Joi.when('key_type', {
                is: 'object',
                then: Joi.optional(),
                otherwise: Joi.required(),
              }),
             }).unknown(true)),
            otherwise: Joi.optional(),
          }),
          otherwise: Joi.forbidden(),
        }),
  });

  export const requestBodyMLValidationSchema = (t = translateFunction) => (Joi.array()
  .unique((a, b) => a.key === b.key)
  .items(constructMLtRequestBodySchema(0, t)));

export const testRequestBodyValidationSchema = (t = translateFunction) => (
  Joi.array()
  .unique((a, b) => a.key === b.key)
  .items(constructTestRequestBodySchema(0, t)));

const constructSaveResponsechema = (depth = 0) =>
Joi.object().keys({
  is_deleted: Joi.bool().required().label('Deleted'),
  response_key: Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.string().required().label('Response Key'),
  }),
  // new_field: Joi.bool().required().label('New field'),
  new_field: Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.bool().required().label('New field'),
  }),
  // response_key: Joi.string().required().label('Response Key'),
  response_type: Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.string().required().label('Response Type'),
  }),
  // response_type: Joi.string().required().label('Response Key'),
  // field_value: Joi.when('is_deleted', {
  //   is: true,
  //   then: Joi.required().label('Field').required(),
  //   otherwise: Joi.optional(),
  // }),
  // field_value: Joi.required().label('Field'),
  // field_value: Joi.when('new_field', {
  //   is: false,
  //   then: Joi.required().label('Field'),
  //   otherwise: Joi.optional(),
  // }),
  field_value: Joi.when('new_field', {
    is: false,
    then: Joi.when('is_deleted', {
        is: false,
        then: Joi.required().label('Field'),
        otherwise: Joi.optional(),
      }),
    otherwise: Joi.optional(),
  }),
  field_type: Joi.when('is_deleted', {
    is: false,
    then: Joi.string().required().label('Field Type'),
    otherwise: Joi.optional(),
  }),
  // field_type: Joi.required().label('Field'),

  field_details: Joi.optional(),
  parent_table_uuid: Joi.optional(),
  parent_table_name: Joi.optional(),
  path: Joi.optional(),
  column_mapping:
    depth === 1
      ? Joi.optional()
      : Joi.when('field_type', {
        is: TABLE_FIELD_LIST_TYPE,
        then: Joi.array().required().min(1).label('Column mapping')
          .items(constructSaveResponsechema(depth + 1))
          .messages({
            'array.min': 'At least one column must be mapped',
            'any.required': 'At least one column must be mapped',
          }),
        otherwise: Joi.forbidden(),
      }),
});

export const saveResponseValidationSchema = Joi.array()
// .unique((a, b) => a.key === b.key)
.items(constructSaveResponsechema(0));

const constructMLSaveResponsechema = () =>
Joi.object().keys({
  is_deleted: Joi.bool().required().label('Deleted'),
  response_key: Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.string().required().label('Response Key'),
  }),
  response_type: Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.string().required().label('Response Type'),
  }),
  field_value: Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.string().required().label('Field'),
  }),
  field_type: Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: Joi.string().required().label('Field Type'),
  }),
});

export const saveResponseMLValidationSchema = Joi.array()
.items(constructMLSaveResponsechema());

export const addNewStepValidateSchema = (stepIndex, t = translateFunction) => Joi.object().keys({
  stepName: STEP_NAME_VALIDATION.required().label(t(STEP_NAME_LABEL)),
});

export const validateMappingFieldTypes = ({ parentFlowField = {}, parentFieldType, childFlowField = {}, childFieldType, matchCategory = {} }, t) => {
  let error = {};
  const child_flow_type = (childFieldType === FIELD_LIST_TYPE.TABLE) ?
    { fieldType: FIELD_LIST_TYPE.TABLE } :
    getFieldTypeIncludingChoiceValueType(childFlowField);
  const parent_flow_type = (parentFieldType === FIELD_LIST_TYPE.TABLE) ?
    { fieldType: FIELD_LIST_TYPE.TABLE } :
    getFieldTypeIncludingChoiceValueType(parentFlowField);
  let isValidFieldType = false;
  switch (child_flow_type.fieldType) {
    case FIELD_TYPE.CHECKBOX:
      isValidFieldType = (parent_flow_type.fieldType === FIELD_TYPE.CHECKBOX) &&
        (child_flow_type.choiceValueType === parent_flow_type.choiceValueType);
      break;
    case FIELD_TYPE.RADIO_GROUP:
    case FIELD_TYPE.DROPDOWN:
      if ([FIELD_TYPE.RADIO_GROUP, FIELD_TYPE.DROPDOWN].includes(parent_flow_type.fieldType)) {
        isValidFieldType = child_flow_type.choiceValueType === parent_flow_type.choiceValueType;
      } else if (child_flow_type.choiceValueType === FIELD_TYPE.SINGLE_LINE) {
        isValidFieldType = [FIELD_TYPE.SINGLE_LINE, FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN].includes(parent_flow_type.fieldType);
      } else if (child_flow_type.choiceValueType === FIELD_TYPE.NUMBER) {
        isValidFieldType = matchCategory.CATEGORY_1.includes(parent_flow_type.fieldType);
      } else if (child_flow_type.choiceValueType === FIELD_TYPE.DATE) {
        isValidFieldType = [FIELD_TYPE.DATE].includes(parent_flow_type.fieldType);
      }
      break;
    default:
      if (
        (
          matchCategory.CATEGORY_1.includes(child_flow_type.fieldType) &&
          matchCategory.CATEGORY_1.includes(parent_flow_type.fieldType)
        ) || (
          matchCategory.CATEGORY_2.includes(child_flow_type.fieldType) &&
          matchCategory.CATEGORY_2.includes(parent_flow_type.fieldType)
        ) || (
          child_flow_type.fieldType === parent_flow_type.fieldType
        )
      ) {
        isValidFieldType = true;
      }
      break;
  }
  if (!isValidFieldType) {
    const fieldDropdownList = FF_DROPDOWN_LIST(t);
    const childFlowFieldType = child_flow_type?.actualChoiceValueType ?
      `${fieldDropdownList.find((field) => field.ID === child_flow_type.fieldType)?.TITLE} - ${child_flow_type.actualChoiceValueType}` :
      fieldDropdownList.find((field) => field.ID === child_flow_type.fieldType)?.TITLE;
    const parentFlowFieldType = parent_flow_type?.actualChoiceValueType ?
      `${fieldDropdownList.find((field) => field.ID === parent_flow_type.fieldType)?.TITLE} - ${parent_flow_type.actualChoiceValueType}` :
      fieldDropdownList.find((field) => field.ID === parent_flow_type.fieldType)?.TITLE;
    error = {
      childFieldTypeError: `${t(FIELD_MAPPING_ERRORS.TYPE_MISMATCH_TEXT)} (${childFlowFieldType})`,
      parentFieldTypeError: `${t(FIELD_MAPPING_ERRORS.TYPE_MISMATCH_TEXT)} (${parentFlowFieldType})`,
    };
  }
 return error;
};

const getSchema = (currentSchema) =>
  Joi.when('is_deleted', {
    is: true,
    then: Joi.optional(),
    otherwise: currentSchema,
  });

  const constructMappingRowSchema = (t, depth = 0) =>
  Joi.object().keys({
    is_deleted: Joi.bool().optional(),
    [SEND_DATA_TO_DATALIST.FIELD_KEYS.VALUE_TYPE]: getSchema(Joi.string().valid(
      SEND_DATA_TO_DATALIST.FIELD_KEYS.DYNAMIC,
      SEND_DATA_TO_DATALIST.FIELD_KEYS.SYSTEM,
      SEND_DATA_TO_DATALIST.FIELD_KEYS.STATIC,
    )),
    mapping_type: getSchema(Joi.string().required()),
    flow_field_uuid: getSchema(
      Joi.when(SEND_DATA_TO_DATALIST.FIELD_KEYS.VALUE_TYPE, {
        is: SEND_DATA_TO_DATALIST.FIELD_KEYS.STATIC,
        then: Joi.optional(),
        otherwise: Joi.when(SEND_DATA_TO_DATALIST.FIELD_KEYS.MAPPING_TYPE, {
          is: SEND_DATA_TO_DATALIST.FIELD_KEYS.DIRECT_TO_TABLE_MAPPING_TYPE,
          then: Joi.optional(),
          otherwise: Joi.string().label(t(ALL_LABELS.FLOW_FIELD)),
        }),
      }),
    ),
    static: getSchema(
      Joi.when(SEND_DATA_TO_DATALIST.FIELD_KEYS.VALUE_TYPE, {
        is: SEND_DATA_TO_DATALIST.FIELD_KEYS.STATIC,
        then: staticValueSchema(t, null, SEND_DATA_TO_DATALIST.FIELD_KEYS.DATA_LIST_FIELD_TYPE, { isOnlyRequired: true }),
        otherwise: Joi.optional(),
      }),
    ),
    flow_field: Joi.optional(),
    data_list_field_uuid: getSchema(Joi.string().label(t(ALL_LABELS.DATALIST_FIELD))),
    data_list_field: Joi.when('data_list_field_uuid', {
      is: Joi.required(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    path: Joi.optional(),
    operation: getSchema(Joi.when(SEND_DATA_TO_DATALIST.FIELD_KEYS.MAPPING_TYPE, {
      is: [SEND_DATA_TO_DATALIST.FIELD_KEYS.DIRECT_TO_TABLE_MAPPING_TYPE, SEND_DATA_TO_DATALIST.FIELD_KEYS.TABLE_TO_TABLE_MAPPING_TYPE],
      then: Joi.optional(),
      otherwise: Joi.string().label(t(ALL_LABELS.OPERATION)),
    })),
    mapping_order: getSchema(Joi.number().required()),
    flow_table_uuid: getSchema(
      Joi.when(SEND_DATA_TO_DATALIST.FIELD_KEYS.VALUE_TYPE, {
        is: SEND_DATA_TO_DATALIST.FIELD_KEYS.STATIC,
        then: Joi.optional(),
        otherwise: Joi.when(SEND_DATA_TO_DATALIST.FIELD_KEYS.MAPPING_TYPE, {
          is: SEND_DATA_TO_DATALIST.FIELD_KEYS.TABLE_TO_TABLE_MAPPING_TYPE,
          then: Joi.string().label(t(ALL_LABELS.TABLE_UUID)),
          otherwise: Joi.forbidden(),
        }),
      }),
    ),
    update_type: Joi.optional(),
    data_list_table_uuid: getSchema(Joi.when(SEND_DATA_TO_DATALIST.FIELD_KEYS.MAPPING_TYPE, {
      is: [SEND_DATA_TO_DATALIST.FIELD_KEYS.DIRECT_TO_TABLE_MAPPING_TYPE, SEND_DATA_TO_DATALIST.FIELD_KEYS.TABLE_TO_TABLE_MAPPING_TYPE],
      then: Joi.string().label(t(ALL_LABELS.TABLE_UUID)).required(),
      otherwise: Joi.forbidden(),
    })),
    flow_field_type: getSchema(
      Joi.when(SEND_DATA_TO_DATALIST.FIELD_KEYS.VALUE_TYPE, {
        is: SEND_DATA_TO_DATALIST.FIELD_KEYS.STATIC,
        then: Joi.optional(),
        otherwise: Joi.string().label(t(ALL_LABELS.FLOW_FIELD)),
      }),
    ),
    data_list_field_type: getSchema(Joi.when(SEND_DATA_TO_DATALIST.FIELD_KEYS.MAPPING_TYPE, {
      is: SEND_DATA_TO_DATALIST.FIELD_KEYS.DIRECT_TO_TABLE_MAPPING_TYPE,
      then: Joi.string().label(t(ALL_LABELS.TABLE_UUID)),
      otherwise:
        Joi.when(SEND_DATA_TO_DATALIST.FIELD_KEYS.VALUE_TYPE, {
          is: SEND_DATA_TO_DATALIST.FIELD_KEYS.STATIC,
          then: Joi.string(),
          otherwise: Joi.when(SEND_DATA_TO_DATALIST.FIELD_KEYS.FLOW_FIELD_TYPE, {
            is: [...SEND_DATA_TO_DATALIST.FIELD_MATCH_CATEGORY.CATEGORY_1],
            then: Joi.string().valid(...SEND_DATA_TO_DATALIST.FIELD_MATCH_CATEGORY.CATEGORY_1),
            otherwise: Joi.when(SEND_DATA_TO_DATALIST.FIELD_KEYS.FLOW_FIELD_TYPE, {
              is: [...SEND_DATA_TO_DATALIST.FIELD_MATCH_CATEGORY.CATEGORY_2],
              then: Joi.string().valid(...SEND_DATA_TO_DATALIST.FIELD_MATCH_CATEGORY.CATEGORY_2),
              otherwise: Joi.string().valid(Joi.ref('flow_field_type')).label(t(ALL_LABELS.DATALIST_FIELD)),
            }),
          }),
        }),
    })),
    table_column_mapping: getSchema(
      depth === 1
        ? Joi.optional()
        : Joi.when(SEND_DATA_TO_DATALIST.FIELD_KEYS.MAPPING_TYPE, {
          is: [SEND_DATA_TO_DATALIST.FIELD_KEYS.DIRECT_TO_TABLE_MAPPING_TYPE, SEND_DATA_TO_DATALIST.FIELD_KEYS.TABLE_TO_TABLE_MAPPING_TYPE],
          then: Joi.array().required().min(1)
            .items(constructMappingRowSchema(t, depth + 1))
            .messages({
              'array.min': t(VALIDATION_MESSAGE.TABLE_COLUMN_MAPPING),
              'any.required': t(VALIDATION_MESSAGE.TABLE_COLUMN_MAPPING),
            }),
          otherwise: Joi.forbidden(),
        }),
    ),
  });

export const sendDataToDatalistValidationSchema = (t = translateFunction) => Joi.object().keys({
  action_uuid: Joi.array()
    .min(1)
    .items(Joi.string())
    .label(t(ALL_LABELS.ACTION_UUID))
    .required()
    .messages({
      'array.min': t(SEND_DATA_TO_DATALIST_STRINGS.VALIDATION_MESSAGE.ACTION_UUID),
      'array.base': t(SEND_DATA_TO_DATALIST_STRINGS.VALIDATION_MESSAGE.ACTION_UUID),
    }),
  selectedActionLabels: Joi.array().optional(),
  data_list_uuid: Joi.string().label(t(ALL_LABELS.DATA_LIST)).required(),
  data_list_entry_action_type: Joi.string()
    .label(t(ALL_LABELS.ENTRY_ACTION_TYPE))
    .valid(
      ENTRY_ACTION_TYPE.AUTO,
      ENTRY_ACTION_TYPE.UPDATE,
      ENTRY_ACTION_TYPE.DELETE,
    )
    .required(),
  entry_id_from: Joi.when('data_list_entry_action_type', {
    is: ENTRY_ACTION_TYPE.AUTO,
    then: Joi.forbidden(),
    otherwise: Joi.string().optional(),
  }),
  entry_id_from_value: Joi.when('data_list_entry_action_type', {
    is: ENTRY_ACTION_TYPE.AUTO,
    then: Joi.forbidden(),
    otherwise: Joi.string().label(t(ALL_LABELS.FORM_FIELD)).required(),
  }),
  entryIdLabel: Joi.optional(),
  mapping: Joi.when('data_list_entry_action_type', {
    is: Joi.valid(ENTRY_ACTION_TYPE.AUTO, ENTRY_ACTION_TYPE.UPDATE),
    then: Joi.array()
      .items(constructMappingRowSchema(t, 0))
      .required(),
    otherwise: Joi.forbidden(),
  }),
  is_edited: Joi.bool().optional(),
  data_list_name: Joi.string().optional(),
  is_system_defined: Joi.bool().optional(),
  system_defined_name: Joi.string().optional(),
  mapping_uuid: Joi.string().optional(),
});

const TYPES = {
  OBJECT: 'object',
  ARRAY: 'array',
  STRING: 'string',
};
const validationMessageBasedOnType = (type, name, t = translateFunction) => {
  const requiedMessage = `${name} ${t('common_strings.is_required')}`;
  switch (type) {
   case TYPES.ARRAY: return {
      'array.min': requiedMessage,
      'array.required': requiedMessage,
      'array.base': requiedMessage,
      'array.includesRequiredUnknowns': requiedMessage,
   };
   case TYPES.OBJECT: return {
      'object.min': requiedMessage,
      'object.required': requiedMessage,
      'object.base': requiedMessage,
   };
   case TYPES.STRING: return {
      'object.required': requiedMessage,
      'object.base': requiedMessage,
   };
   default: return {};
  }
};

export const recipientsArraySchema = (t) => Joi
  .array()
  .items({
    recipients_type: Joi.string().required(),
    to_recipients: Joi.when('recipients_type', {
      is: RECIPIENT_TYPE.DIRECT_RECIPIENT,
      then: Joi.object().keys({
        teams: Joi.array().min(1),
        users: Joi.array().min(1),
      })
        .or('users', 'teams')
        .required()
        .label(SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_LABELS.USER_OR_TEAM)
        .messages({
          'object.missing': SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_MESSAGE.USER_OR_TEAM,
        }),
      otherwise: Joi.forbidden(),
    }),
    external_recipient: Joi.when('recipients_type', {
      is: RECIPIENT_TYPE.EXTERNAL_RECIPIENT,
      then: Joi.array()
      .items(Joi.string().regex(EMAIL_REGEX).required())
        .min(1)
        .max(20)
        .required()
        .label(RECIPIENT_OPTION_LIST(t)[2].label)
        .messages(validationMessageBasedOnType(TYPES.ARRAY, RECIPIENT_OPTION_LIST(t)[2].label, t)),
      otherwise: Joi.forbidden(),
    }),
    to_recipients_field_uuids: Joi.when('recipients_type', {
      switch: [
        {
          is: RECIPIENT_TYPE.FORM_FIELD_RECIPIENT,
          then: Joi.array().required().label(RECIPIENT_OPTION_LIST(t)[3].label).min(1)
            .messages(validationMessageBasedOnType(TYPES.ARRAY, RECIPIENT_OPTION_LIST(t)[3].label, t)),
        },
        {
          is: RECIPIENT_TYPE.FORM_REPORTING_MANAGER_RECIPIENT,
          then: Joi.array()
            .required()
            .label(
              RECIPIENT_OPTION_LIST(t)[6].label,
            )
            .min(1)
            .messages(validationMessageBasedOnType(TYPES.ARRAY, RECIPIENT_OPTION_LIST(t)[6].label, t)),
        },
        {
          is: RECIPIENT_TYPE.EMAIL_FORM_FIELD_RECIPIENT,
          then: Joi.array().required().label(RECIPIENT_OPTION_LIST(t)[1].label).min(1)
            .messages(validationMessageBasedOnType(TYPES.ARRAY, RECIPIENT_OPTION_LIST(t)[1].label, t)),
        },
      ],
      otherwise: Joi.forbidden(),
    }),
    to_recipients_other_steps: Joi.when('recipients_type', {
      switch: [
        {
          is: RECIPIENT_TYPE.OTHER_STEP_RECIPIENT,
          then: Joi.array().required()
            .min(1)
            .label(RECIPIENT_OPTION_LIST(t)[4].label)
            .messages(validationMessageBasedOnType(TYPES.ARRAY, RECIPIENT_OPTION_LIST(t)[4].label, t)),
        },
        {
          is: RECIPIENT_TYPE.INITIATOR_REPORTING_MANAGER_RECIPIENT,
          then: Joi.array()
            .min(1)
            .required()
            .label(
              RECIPIENT_OPTION_LIST(t)[5].label,
            )
            .messages(validationMessageBasedOnType(TYPES.ARRAY, RECIPIENT_OPTION_LIST(t)[5].label, t)),
        },
      ],
      otherwise: Joi.forbidden(),
    }),
  })
  .min(1)
  .required();

export const emailActionsValidateSchema = (t = translateFunction) => Joi.object()
  .keys({
    email_name: EMAIL_NAME_VALIDATION.required().label('Email Name'),
    email_body: EMAIL_BODY_VALIDATION.required().label(t(SEND_EMAIL_CONFIG.EMAIL_BODY_LABEL)),
    email_subject: EMAIL_SUBJECT_VALIDATION.required().label(t(SEND_EMAIL_CONFIG.EMAIL_SUBJECT_LABEL)),
    action_uuid: Joi.array()
      .items(Joi.string().required())
      .label(t(ALL_LABELS.ACTION_UUID))
      .messages({
        'array.includesRequiredUnknowns': t(VALIDATION_MESSAGE.ACTION_UUID),
      }),
    is_condition_rule: Joi.boolean().required(),
  })
  .unknown(true);

export const constructEscalationValidationData = (initialEscalation = {}) => {
  const escalation = {};
  const escalation_due = constructDueDateData(
    initialEscalation.escalation_due || {},
  );
  if (!isEmpty(initialEscalation.escalation_type)) escalation.escalation_type = initialEscalation.escalation_type;
  if (!isEmpty(escalation_due)) escalation.escalation_due = escalation_due;

  return escalation;
};

export const emailEscalationValidationSchema = (t = translateFunction) => Joi.object().keys({
  escalation_type: Joi.string().valid('email').required().label('Email'),
  escalation_due: dueDateValidationSchema(t).label(t(DUE_DATE_LABEL)).required(),
});

export const documentActionsValidateSchema = (t = translateFunction) => Joi.object()
  .keys({
    document_body: Joi.string().required().label(t(ADDITIONAL_CONFIG.DOC_TEMPLATE_LABEL)),
    file_name: Joi
      .string()
      .min(2)
      .max(255)
      .label(t(ADDITIONAL_CONFIG.DOC_TEMPLATE_NAME))
      .optional()
      .allow(null, EMPTY_STRING),
    document_field_name: Joi
      .string()
      .min(2)
      .max(255)
      .required()
      .label(t(ADDITIONAL_CONFIG.DOC_FIELD_LABEL)),
    action_uuid: Joi.array()
      .items(Joi.string().required())
      .label(t(ALL_LABELS.ACTION_UUID))
      .messages({
        'array.includesRequiredUnknowns': t(VALIDATION_MESSAGE.ACTION_UUID),
      }),
  })
  .unknown(true);

export const documentFieldNameSchema = (t = translateFunction) => Joi.object().keys({
  document_field_name: Joi
    .string()
    .min(2)
    .max(255)
    .required()
    .label(t(ADDITIONAL_CONFIG.DOC_FIELD_NAME_LABEL)),
});

export const stepNameValidationSchema = Joi.object().keys({
  step_name: STEP_NAME_VALIDATION.label(FLOW_CONFIG_STRINGS.STEP_NAME_LABEL).required().min(FLOW_MIN_MAX_CONSTRAINT.CREATE_NEW_PARALLEL_STEP_MIN_VALUE),
});

export const stepStatusValidationSchema = (t = translateFunction) => Joi.object().keys({
  step_status: STEP_STATUS_VALIDATION(t).required().label(t(DUE_DATE_AND_STATUS.STATUS.LABEL)),
});

const ACTION_BUTTON_SCHEMA = Joi.object().keys({
  action_type: Joi.allow(ACTION_TYPE.FORWARD),
  action_name: Joi.string(),
  action_uuid: Joi.string(),
  is_next_step_rule: Joi.boolean(),
  is_condition_rule: Joi.boolean(),
  next_step_uuid: Joi.array().min(1),
  translation_data: Joi.optional(),
  allow_comments: Joi.optional(),
  button_color: Joi.optional(),
  button_position: Joi.optional(),
});

export const parallelStepDetailsValidateSchema = (t = translateFunction) => Joi.object().keys({
  step_name: STEP_NAME_VALIDATION.required().label(t(STEP_NAME_LABEL)),
  step_order: Joi.number().allow(null),
  actions: Joi.array().items(ACTION_BUTTON_SCHEMA).min(1),
});

export const joinStepDetailsValidateSchema = (t = translateFunction) => Joi.object().keys({
  step_name: STEP_NAME_VALIDATION.required().label(t(STEP_NAME_LABEL)),
  step_order: Joi.number().allow(null),
  actions: Joi.array().items(ACTION_BUTTON_SCHEMA).min(1),
  join_condition: Joi.object().keys({
    type: Joi.string(),
    step_count: Joi.when('type', { is: JOIN_STEP_CONDITIONS.ANY, then: Joi.number().required(), otherwise: Joi.optional() }),
  }).required(),
});

export const endStepDetailsValidateSchema = (t = translateFunction) => Joi.object().keys({
  step_name: STEP_NAME_VALIDATION.required().label(t(STEP_NAME_LABEL)),
  // step_description: STEP_DESCRIPTION_VALIDATION.allow(null, EMPTY_STRING),
  step_order: Joi.number().allow(null),
});

export const validateAdditionalConfigSchema = (t = translateFunction) => Joi.object().keys({
  send_email_condition: Joi.boolean(),
  email_actions: Joi.when('send_email_condition', {
    is: true,
    then: Joi.array().min(1).required().label(t(ADDITIONAL_CONFIG.SEND_EMAIL))
    .messages({
      'array.min': t(ERRORS.EMAIL_MIN_ONE_ITEM),
    }),
    otherwise: Joi.optional(),
  }),
  email_escalation_condition: Joi.boolean(),
  escalations: Joi.when('email_escalation_condition', {
    is: true,
    then: Joi.array().min(1).required().label(t(ADDITIONAL_CONFIG.SEND_ESCALATION))
    .messages({
      'array.min': t(ERRORS.ESCALATION_MIN_ONE_ITEM),
    }),
    otherwise: Joi.optional(),
  }),
  send_data_to_datalist_condition: Joi.boolean(),
  data_list_mapping: Joi.when('send_data_to_datalist_condition', {
    is: true,
    then: Joi.array().min(1).required().label(t(ADDITIONAL_CONFIG.SEND_DATA_TO_DATALIST))
    .messages({
      'array.min': t(ERRORS.SEND_DATA_MIN_ONE_ITEM),
    }),
    otherwise: Joi.optional(),
  }),
  document_generation_condition: Joi.boolean(),
  document_generation: Joi.when('document_generation_condition', {
    is: true,
    then: Joi.array().min(1).required().label(t(ADDITIONAL_CONFIG.DOC_GENERATION))
    .messages({
      'array.min': t(ERRORS.DOC_GENERATION_MIN_ONE_ITEM),
    }),
    otherwise: Joi.optional(),
  }),
});

const getAssigneeRuleValidation = (t = translateFunction, isChildLevel = false) => Joi
  .array()
  .items({
    assignee_type: Joi.string().required(),
    assignees: Joi.when('assignee_type', {
      is: ASSIGNEE_TYPE.DIRECT_ASSIGNEE,
      then: Joi.object().keys({
        teams: Joi.array().min(1),
        users: Joi.array().min(1),
      })
      .or('users', 'teams')
      .required()
      .label(SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_LABELS.USER_OR_TEAM)
      .messages({
        'object.missing': SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_MESSAGE.USER_OR_TEAM,
      }),
      otherwise: Joi.forbidden(),
    }),
    other_step_uuids: Joi.when('assignee_type', {
      is: [ASSIGNEE_TYPE.OTHER_STEP_ASSIGNEE, ASSIGNEE_TYPE.INITIATOR_REPORTING_MANAGER],
      then: Joi.array().min(1).required().label(SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_LABELS.ANY_OF_THE_PREVIOUS_STEP)
      .messages({
        'object.missing': SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_MESSAGE.USER_SELECTOR_FORM_FIELD,
      }),
      otherwise: Joi.forbidden(),
    }),
    rules: Joi.when('assignee_type', {
      is: ASSIGNEE_TYPE.RULE_BASED,
      then: Joi.array().items({
        condition_rule: Joi.string().required().label(SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_LABELS.RULE)
          .messages({ 'object.missing': SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_MESSAGE.RULE }),
          otherwise: Joi.forbidden(),
        rule_assignees: Joi.when('condition_rule', {
          is: Joi.string().required(),
          then: !isChildLevel && getAssigneeRuleValidation(t, true),
          otherwise: Joi.optional(),
        }),
      }),
      otherwise: Joi.forbidden(),
    }),
    assignee_field_uuids: Joi.when('assignee_type', {
      is: [ASSIGNEE_TYPE.FORM_FIELD_ASSIGNEE, ASSIGNEE_TYPE.FORM_FIELD_REPORTING_MANAGER],
      then: Joi.array().min(1).required().label(SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_LABELS.USER_SELECTOR_FORM_FIELD)
      .messages({
        'object.missing': SET_ASSIGNEE_STRINGS(t).SET_ASSIGNEE.VALIDATION_STRINGS.VALIDATION_MESSAGE.USER_SELECTOR_FORM_FIELD,
      }),
      otherwise: Joi.forbidden(),
    }),
  })
  .min(1)
  .required();

export const getAssigneeValidationSchema = (t = translateFunction) =>
  Joi.object().keys({
    step_assignees: getAssigneeRuleValidation(t),
  });
