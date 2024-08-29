import Joi from 'joi';
import {
  APP_NAME_VALIDATION,
  LINK_VALIDATION,
} from '../../../utils/ValidationConstants';
import {
  BUTTON_LINK_TYPE,
  FIELD_CONFIGURATIONS_CONSTANTS,
} from '../../form/sections/field_configuration/FieldConfiguration.constants';
import { FIELD_TYPE } from '../../../utils/constants/form.constant';
import { EMPTY_STRING } from '../../../utils/strings/CommonStrings';
import { VALUE_CONFIG_TYPE } from './summary_builder/Summary.constants';
import INDIVIDUAL_ENTRY_TABS_STRINGS from './individual_entry_tab/IndividualEntryTab.constants';

export const pageSettingsSchema = (t = () => {}) =>
  Joi.object().keys({
    name: APP_NAME_VALIDATION.label(INDIVIDUAL_ENTRY_TABS_STRINGS(t).PAGE_SETTINGS.PAGE_NAME.LABEL).required(),
    isInherit: Joi.boolean().optional(),
    viewers: Joi.when('isInherit', {
      is: true,
      then: Joi.object()
        .keys({
          teams: Joi.array().items(),
          users: Joi.array().items(),
        })
        .label(INDIVIDUAL_ENTRY_TABS_STRINGS(t).PAGE_SETTINGS.PAGE_VIEWERS)
        .min(1)
        .or('users', 'teams')
        .required()
        .messages({
          'object.missing': `${INDIVIDUAL_ENTRY_TABS_STRINGS(t).PAGE_SETTINGS.PAGE_VIEWERS} ${t('common_strings.is_required')}`,
        }),
      otherwise: Joi.forbidden(),
    }),
  });

export const savePageComponentValidateSchema = (t) =>
  Joi.object().keys({
    defaultValue: Joi.object().allow(EMPTY_STRING, null).optional(),
    errorList: Joi.object().optional(),
    fieldId: Joi.string().allow(null).optional(),
    fieldListType: Joi.when('fieldType', {
      is: Joi.string().valid(
        FIELD_TYPE.RICH_TEXT,
        FIELD_TYPE.BUTTON_LINK,
        FIELD_TYPE.IMAGE,
      ),
      then: Joi.optional(),
      otherwise: Joi.string().required(),
    }).label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.FIELD_DISPLAY.FIELD_VALUE_SOURCE.LABEL),
    fieldName: Joi.when('fieldType', {
      is: Joi.string().valid(
        FIELD_TYPE.RICH_TEXT,
        FIELD_TYPE.BUTTON_LINK,
        FIELD_TYPE.IMAGE,
      ),
      then: Joi.optional(),
      otherwise: Joi.string().required(),
    }).label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.FIELD_DISPLAY.FIELD_LABEL.LABEL),
    fieldType: Joi.string().required(),
    fieldUUID: Joi.string().optional(),
    helpText: Joi.string().allow(''),
    hideFieldIfNull: Joi.boolean().optional(),
    instructions: Joi.string().allow(''),
    isNewField: Joi.boolean().optional(),
    nodeUUID: Joi.string().optional(),
    path: Joi.string().required(),
    placeholder: Joi.string().allow(''),
    readOnly: Joi.boolean().optional(),
    required: Joi.boolean().optional(),
    ruleId: Joi.string().allow(''),
    sectionUUID: Joi.string().required(),
    valueType: Joi.string().optional(),
    fieldSourceType: Joi.when('fieldType', {
      is: Joi.string().valid(
        FIELD_TYPE.RICH_TEXT,
        FIELD_TYPE.BUTTON_LINK,
        FIELD_TYPE.IMAGE,
      ),
      then: Joi.optional(),
      otherwise: Joi.string().required(),
    }).label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.FIELD_DISPLAY.FIELD_VALUE_SOURCE.LABEL),
    selectedFieldUuid: Joi.when('isMultipleEntry', {
      is: true,
      then: Joi.string().optional().label(t('common_strings.field_label')).allow(EMPTY_STRING, null),
      otherwise: Joi.string().optional().label(t('common_strings.field_label')),
    }),
    selectedExternalRuleUUID: Joi.custom((value, helpers) => {
      const { fieldSourceType, tableUUID } = helpers.state.ancestors[0] || {};
      if (fieldSourceType !== VALUE_CONFIG_TYPE.EXTERNAL_DATA) return true;
      if (tableUUID) return true;
      if (value) return true;
      return helpers.error('any.required');
    }).label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.FIELD_DISPLAY.CHOOSE_FIELD.RULE),
    tableUUID: Joi.string()
      .optional()
      .when('fieldListType', {
        is: 'table',
        then: Joi.string()
          .optional()
          .label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.FIELD_DISPLAY.CHOOSE_FIELD.USER_DEFINED_FIELD),
        otherwise: Joi.string()
          .optional()
          .label(
            FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.FIELD_DISPLAY.CHOOSE_FIELD.SYSTEM_DEFINED_FIELD,
          ),
      }),
    validationData: Joi.object().unknown(true),
    dropType: Joi.string().optional(),
    auto_fill: Joi.string().optional(),
    node_uuid: Joi.string().optional(),
    referenceName: Joi.string().optional(),
    bgColor: Joi.string().optional(),
    documentData: Joi.object().optional(),
    documentDetails: Joi.object().optional(),
    isImageChange: Joi.bool().optional(),
    imageId: Joi.string()
      .when('fieldType', {
        is: FIELD_TYPE.IMAGE,
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.IMAGE.UPLOAD_IMAGE.LABEL),
    informationContent: Joi.object({
      editorTemplate: Joi.string()
        .optional()
        .when('fieldType', {
          is: FIELD_TYPE.RICH_TEXT,
          then: Joi.string().min(1).required().label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.RICH_TEXT.CONTENT),
          otherwise: Joi.string().optional(),
        }),
      renderingTemplate: Joi.string().optional(),
    }).when('fieldType', {
      is: FIELD_TYPE.RICH_TEXT,
      then: Joi.required().label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.RICH_TEXT.CONTENT),
      otherwise: Joi.optional(),
    }),
    informationData: Joi.object({
      field_uuids: Joi.array().items(Joi.string()),
      doc_ids: Joi.array().items(Joi.string()),
      rules: Joi.array().items(Joi.object()),
      insertedFields: Joi.array().optional(),
      insertedDocumentDetails: Joi.array().items(Joi.object()),
    }).when('fieldType', {
      is: FIELD_TYPE.RICH_TEXT,
      then: Joi.optional(),
      otherwise: Joi.forbidden(),
    }),
    buttonActionType: Joi.string()
      .when('fieldType', {
        is: FIELD_TYPE.BUTTON_LINK,
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      })
      .label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.BUTTON_LINK.BUTTON_LINK_TYPE.LABEL),
    buttonStyle: Joi.string()
      .when('fieldType', {
        is: FIELD_TYPE.BUTTON_LINK,
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      })
      .label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.BUTTON_LINK.ACTION_BUTTON_STYLE.LABEL),
    linkURL: Joi.string().when('fieldType', {
      is: FIELD_TYPE.BUTTON_LINK,
      then: Joi.when('buttonActionType', {
        is: BUTTON_LINK_TYPE.INTERNAL_EXTERNAL_LINK,
        then: LINK_VALIDATION.label(
          FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.BUTTON_LINK.INTERNAL_EXTERNAL_LINK.LABEL,
        ).required(),
        otherwise: Joi.forbidden(),
      }),
      otherwise: Joi.forbidden(),
    }),
    triggerUUID: Joi.string().when('fieldType', {
      is: FIELD_TYPE.BUTTON_LINK,
      then: Joi.when('buttonActionType', {
        is: BUTTON_LINK_TYPE.START_SUB_FLOW,
        then: Joi.string()
          .label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.BUTTON_LINK.START_SUB_FLOW.CHOOSE_ACTION)
          .required(),
        otherwise: Joi.forbidden(),
      }),
      otherwise: Joi.forbidden(),
    }),
    buttonName: Joi.string()
      .min(2)
      .max(50)
      .when('fieldType', {
        is: FIELD_TYPE.BUTTON_LINK,
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      })
      .label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.BUTTON_LINK.BUTTON_LINK_LABEL),
    tableChildData: Joi.array()
      .when('fieldType', {
        is: FIELD_TYPE.TABLE,
        then: Joi.array().items().min(1).required(),
        otherwise: Joi.forbidden(),
      })
      .label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.FIELD_DISPLAY.TABLE_COLUMN.LABEL),
    showProperty: Joi.when('fieldType', {
      is: Joi.string().valid(
        FIELD_TYPE.DATA_LIST,
        FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
      ),
      then: Joi.bool().optional(),
      otherwise: Joi.optional(),
    }).label('Show Property for picker'),
    dataListPickerFieldUUID: Joi.when('showProperty', {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }).label('Choose Property picker'),
    datalistPickerFieldName: Joi.when('showProperty', {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.optional(),
    }).label(FIELD_CONFIGURATIONS_CONSTANTS(t).GENERAL.FIELD_DISPLAY.FIELD_LABEL.LABEL),
    datalistPickerFieldType: Joi.string().optional().allow(EMPTY_STRING),
    datalistPickerUUID: Joi.string().optional().allow(EMPTY_STRING),
    ruleUUID: Joi.string().optional().allow(EMPTY_STRING),
    infoFieldImageRefUUID: Joi.string().optional().allow(EMPTY_STRING),
    validations: Joi.object().optional().allow(EMPTY_STRING),
    isMultipleEntry: Joi.bool().optional().allow(EMPTY_STRING),
    otherFieldDetail: Joi.optional(),
  });
