import { FIELD_TYPE, PROPERTY_PICKER_ARRAY } from '../../../../../utils/constants/form.constant';
import { RESPONSE_FIELD_KEYS, RESPONSE_VALIDATION_KEYS } from '../../../../../utils/constants/form/form.constant';
import { RULE_TYPE } from '../../../../../utils/constants/rule/rule.constant';
import { nullCheck, translateFunction, get, isEmpty } from '../../../../../utils/jsUtility';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { FIELD_TYPES } from '../FieldConfiguration.strings';
import { FIELD_INITIAL_STATE } from '../FieldConfigurationReducer';
import { VALIDATION_CONFIG_STRINGS } from '../validation_and_visibility_configuration/validation_configuration/ValidationConfiguration.strings';
import { BASIC_FORM_FIELD_CONFIG_STRINGS } from './BasicConfiguration.strings';
import { getValueTypeOptions } from './selection_fields_component/SelectionFieldComponent.constants';

export const FIELD_GROUPING = {
  SELECTION_FIELDS: [FIELD_TYPES.DROPDOWN, FIELD_TYPES.CHECKBOX, FIELD_TYPES.RADIO_GROUP, FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN],
};

export const NON_VALIDATION_FIELDS = [
  ...FIELD_GROUPING.SELECTION_FIELDS,
  FIELD_TYPES.PHONE_NUMBER,
  FIELD_TYPES.SCANNER,
  FIELD_TYPES.EMAIL,
  FIELD_TYPES.YES_NO,
  FIELD_TYPES.USER_PROPERTY_PICKER,
  FIELD_TYPES.DATA_LIST_PROPERTY_PICKER,
  FIELD_TYPES.INFORMATION,
];

export const DEFAULT_VALUE_FIELDS = [
  ...FIELD_GROUPING.SELECTION_FIELDS,
  FIELD_TYPES.CURRENCY,
  FIELD_TYPES.PHONE_NUMBER,
  FIELD_TYPES.EMAIL,
  FIELD_TYPES.NUMBER,
  FIELD_TYPES.SINGLE_LINE,
  FIELD_TYPES.PARAGRAPH,
  FIELD_TYPES.LINK,
  FIELD_TYPES.YES_NO,
  FIELD_TYPES.DATE,
  FIELD_TYPES.DATETIME,
  FIELD_TYPES.USER_TEAM_PICKER,
  FIELD_TYPES.SCANNER,
];

export const ALLOW_CHECKBOX_FIELDS = [
  FIELD_TYPES.NUMBER,
  FIELD_TYPES.LINK,
  FIELD_TYPES.FILE_UPLOAD,
  FIELD_TYPES.USER_TEAM_PICKER,
  FIELD_TYPES.DATA_LIST,
];

export const selectionFieldsBasicConfigurationValidationData = (fieldData, fieldType) =>
  (fieldData.choiceValues || [])?.map((option) => {
    return {
      label: fieldType !== FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN ? (option?.label || EMPTY_STRING) : (option?.label || option || EMPTY_STRING),
      value: fieldType !== FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN ? (option?.value?.toString() || EMPTY_STRING) : (option?.value?.toString() || option.toString() || EMPTY_STRING),
    };
});

export const datalistSelectorConfigurationValidationData = (fieldData) => {
  const displayFields = (fieldData?.[RESPONSE_FIELD_KEYS.DISPLAY_FIELDS] || []).map((displayField) => displayField?.[RESPONSE_FIELD_KEYS.FIELD_UUID]) || [];
  return {
    [RESPONSE_FIELD_KEYS.DISPLAY_FIELDS]: displayFields,
    [RESPONSE_FIELD_KEYS.DATA_LIST_UUID]: fieldData?.[RESPONSE_FIELD_KEYS.SELECTED_DATALIST]?.[RESPONSE_FIELD_KEYS.DATA_LIST_UUID],
    [RESPONSE_FIELD_KEYS.DATA_LIST_ID]: fieldData?.[RESPONSE_FIELD_KEYS.SELECTED_DATALIST]?.[RESPONSE_FIELD_KEYS.DATA_LIST_ID],
  };
};

export const fieldBasicConfigurationValidationData = (fieldData, t) => {
     const validationData = {
        [RESPONSE_FIELD_KEYS.FIELD_NAME]: fieldData[RESPONSE_FIELD_KEYS.FIELD_NAME],
        [RESPONSE_FIELD_KEYS.FIELD_TYPE]: fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE],
        [RESPONSE_FIELD_KEYS.REQUIRED]: fieldData[RESPONSE_FIELD_KEYS.REQUIRED],
        [RESPONSE_FIELD_KEYS.READ_ONLY]: fieldData[RESPONSE_FIELD_KEYS.READ_ONLY],
      };
      if (FIELD_GROUPING.SELECTION_FIELDS.includes(validationData?.[RESPONSE_FIELD_KEYS.FIELD_TYPE])) {
        validationData[RESPONSE_FIELD_KEYS.VALUES] = selectionFieldsBasicConfigurationValidationData(fieldData, fieldData?.fieldType);
        validationData[RESPONSE_FIELD_KEYS.VALUE_TYPE] = fieldData?.[RESPONSE_FIELD_KEYS.VALUE_TYPE] || getValueTypeOptions(t)[0].value;
        if (validationData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN) {
          validationData[RESPONSE_FIELD_KEYS.VALUE_METADATA] = {
            [RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_ID]: fieldData[RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_ID],
            [RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_NAME]: fieldData[RESPONSE_FIELD_KEYS.CUSTOM_LOOKUP_NAME],
          };
        }
      }
      if (validationData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DATA_LIST) {
        validationData[RESPONSE_FIELD_KEYS.DATA_LIST_DETAILS] = datalistSelectorConfigurationValidationData(fieldData);
      }
      if (validationData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.DATA_LIST_PROPERTY_PICKER ||
        validationData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.USER_PROPERTY_PICKER) {
        validationData[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS] = fieldData?.[RESPONSE_FIELD_KEYS.PROPERTY_PICKER_DETAILS] || {};
      }
      if (validationData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.INFORMATION) {
        const parser = new DOMParser();
        const editorTemplate = get(fieldData, [RESPONSE_FIELD_KEYS.INFORMATION_CONTENT, RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE], null);

        if (!isEmpty(editorTemplate)) {
          const doc = parser.parseFromString(editorTemplate, 'text/html');
          const parsedElement = doc?.body;

          if (isEmpty(parsedElement?.textContent?.trim()) && editorTemplate?.includes('<img')) {
            validationData[RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE] = editorTemplate;
          } else {
            validationData[RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE] = parsedElement?.textContent?.trim() || EMPTY_STRING;
          }
        } else {
          validationData[RESPONSE_FIELD_KEYS.EDITOR_TEMPLATE] = EMPTY_STRING;
        }
      }
      if (validationData[RESPONSE_FIELD_KEYS.FIELD_TYPE] === FIELD_TYPES.TABLE) {
        validationData.columns = fieldData?.columns;
      }
      return validationData;
};

export const fieldLabelSuggestionListHandler = (suggestionList) => {
  const modifiedSuggestionList = [];
    if (nullCheck(suggestionList, 'length', true)) {
      suggestionList.forEach((item) => {
        modifiedSuggestionList.push({
          label: item,
          value: item,
        });
      });
    }
    return modifiedSuggestionList;
};

export const updateFieldTypeString = (fieldType, t = translateFunction) => {
  switch (fieldType) {
    case FIELD_TYPES.SINGLE_LINE:
    fieldType = t('form_field_strings.field_type.single_line');
    break;
    case FIELD_TYPES.PARAGRAPH:
    fieldType = t('form_field_strings.field_type.paragraph');
    break;
    case FIELD_TYPES.NUMBER:
    fieldType = t('form_field_strings.field_type.number');
    break;
    case FIELD_TYPES.EMAIL:
    fieldType = t('form_field_strings.field_type.email');
    break;
    case FIELD_TYPES.DATE:
    fieldType = t('form_field_strings.field_type.date');
    break;
    case FIELD_TYPES.FILE_UPLOAD:
    fieldType = t('form_field_strings.field_type.file_upload');
    break;
    case FIELD_TYPES.CURRENCY:
    fieldType = t('form_field_strings.field_type.currency');
    break;
    case FIELD_TYPES.DROPDOWN:
    fieldType = t('form_field_strings.field_type.dropdown');
    break;
    case FIELD_TYPES.CHECKBOX:
    fieldType = t('form_field_strings.field_type.checkbox');
    break;
    case FIELD_TYPES.RADIO_GROUP:
    fieldType = t('form_field_strings.field_type.radio_group');
    break;
    case FIELD_TYPES.CASCADING:
    fieldType = t('form_field_strings.field_type.cascading');
    break;
    case FIELD_TYPES.USER_TEAM_PICKER:
    fieldType = t('form_field_strings.field_type.user_team_picker');
    break;
    case FIELD_TYPES.USER_PROPERTY_PICKER:
    fieldType = t('form_field_strings.field_type.user_property_picker');
    break;
    case FIELD_TYPES.YES_NO:
    fieldType = t('form_field_strings.field_type.yes_no');
    break;
    case FIELD_TYPES.LINK:
    fieldType = t('form_field_strings.field_type.link');
    break;
    case FIELD_TYPES.INFORMATION:
    fieldType = t('form_field_strings.field_type.information');
    break;
    case FIELD_TYPES.SCANNER:
    fieldType = t('form_field_strings.field_type.barcodescanner');
    break;
    case FIELD_TYPES.CUSTOM_LOOKUP_CHECKBOX:
    fieldType = t('form_field_strings.field_type.custom_lookup_checkbox');
    break;
    case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
    fieldType = t('form_field_strings.field_type.custom_lookup_dropdown');
    break;
    case FIELD_TYPES.CUSTOM_LOOKUP_RADIOBUTTON:
    fieldType = t('form_field_strings.field_type.custom_lookup_radiobutton');
    break;
    case FIELD_TYPES.DATETIME:
    fieldType = t('form_field_strings.field_type.datetime');
    break;
    case FIELD_TYPES.TIME:
    fieldType = t('form_field_strings.field_type.time');
    break;
    case FIELD_TYPES.USERS:
    fieldType = t('form_field_strings.field_type.users');
    break;
    case FIELD_TYPES.TEAMS:
    fieldType = t('form_field_strings.field_type.teams');
    break;
    case FIELD_TYPES.ADDRESS:
    fieldType = t('form_field_strings.field_type.address');
    break;
    case FIELD_TYPES.TABLE:
    fieldType = t('form_field_strings.field_type.table');
    break;
    case FIELD_TYPES.DATA_LIST:
    fieldType = t('form_field_strings.field_type.data_list');
    break;
    case FIELD_TYPES.DATA_LIST_PROPERTY_PICKER:
    fieldType = t('form_field_strings.field_type.data_list_property_picker');
    break;
    case FIELD_TYPES.PHONE_NUMBER:
    fieldType = t('form_field_strings.field_type.phone_number');
    break;
    default:
    break;
  }
  return fieldType;
};

export const getInitialFieldDataByFieldType = (fieldType = null, fieldDetails = {}, t = translateFunction) => {
  const fieldData = {
    ...FIELD_INITIAL_STATE,
    [RESPONSE_FIELD_KEYS.IS_NEW_FIELD]: true,
    [RESPONSE_FIELD_KEYS.READ_ONLY]: fieldDetails?.[RESPONSE_FIELD_KEYS.READ_ONLY] || PROPERTY_PICKER_ARRAY.includes(fieldType),
    [RESPONSE_FIELD_KEYS.REQUIRED]: fieldDetails?.[RESPONSE_FIELD_KEYS.REQUIRED],
    [RESPONSE_FIELD_KEYS.FIELD_TYPE]: fieldType,
    [RESPONSE_FIELD_KEYS.DROP_TYPE]: fieldDetails?.[RESPONSE_FIELD_KEYS.DROP_TYPE],
    [RESPONSE_FIELD_KEYS.SECTION_UUID]: fieldDetails?.[RESPONSE_FIELD_KEYS.SECTION_UUID],
    [RESPONSE_FIELD_KEYS.PATH]: fieldDetails?.[RESPONSE_FIELD_KEYS.PATH],
    [RESPONSE_FIELD_KEYS.FIELD_NAME]: fieldDetails?.[RESPONSE_FIELD_KEYS.FIELD_NAME],
  };

  if (fieldDetails[RESPONSE_FIELD_KEYS.TABLE_UUID]) fieldData[RESPONSE_FIELD_KEYS.TABLE_UUID] = fieldDetails?.[RESPONSE_FIELD_KEYS.TABLE_UUID];

  switch (fieldType) {
    case FIELD_TYPES.DATE:
    case FIELD_TYPES.DATETIME:
      fieldData[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] = {
        ...fieldDetails?.[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA],
        [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE]: VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[0].value,
        [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].ALLOW_TODAY]: false,
        [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].DATE_SELECTION]: [
              {
                [RESPONSE_VALIDATION_KEYS[FIELD_TYPES.DATE].TYPE]: VALIDATION_CONFIG_STRINGS(t).DATE_FIELD_VALIDATION_OPTIONS.MAIN_OPTIONS[0].value,
              },
          ],
      };
      break;
    case FIELD_TYPES.USER_TEAM_PICKER:
      fieldData[RESPONSE_FIELD_KEYS.DEFAULT_VALUE] = {
        [RESPONSE_FIELD_KEYS.OPERATION]: RESPONSE_FIELD_KEYS.REPLACE,
      };
      break;
    case FIELD_TYPES.INFORMATION:
      fieldData[RESPONSE_FIELD_KEYS.REQUIRED] = false;
      break;
    case FIELD_TYPES.DROPDOWN:
    case FIELD_TYPES.CHECKBOX:
    case FIELD_TYPES.RADIO_GROUP:
    case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
      fieldData[RESPONSE_FIELD_KEYS.VALUE_TYPE] = BASIC_FORM_FIELD_CONFIG_STRINGS(t).OPTIONS.VALUE_TYPES[0].VALUE;
      break;
    case FIELD_TYPES.USER_PROPERTY_PICKER:
    case FIELD_TYPES.DATA_LIST_PROPERTY_PICKER:
      fieldData[RESPONSE_FIELD_KEYS.REQUIRED] = false;
      delete fieldData[RESPONSE_FIELD_KEYS.FIELD_NAME];
      break;
    case FIELD_TYPES.TABLE: {
      // Deleting Unwanted Data.
      fieldData[RESPONSE_FIELD_KEYS.REQUIRED] = false;
      delete fieldData?.instruction;
      delete fieldData?.helper_tooltip;
      delete fieldData?.placeholder;
      delete fieldData?.default_value;
      delete fieldData?.validationData;

      const RESPONSE_TABLE_VALIDATION_KEY = RESPONSE_VALIDATION_KEYS[FIELD_TYPES.TABLE];
      // Adding Essentials for Table
      fieldData[RESPONSE_VALIDATION_KEYS.VALIDATION_DATA] = {
        [RESPONSE_TABLE_VALIDATION_KEY.ADD_NEW_ROW]: true,
        [RESPONSE_TABLE_VALIDATION_KEY.ALLOW_MODIFY_EXISTING]: true,
        [RESPONSE_TABLE_VALIDATION_KEY.ALLOW_DELETE_EXISTING]: true,
        [RESPONSE_TABLE_VALIDATION_KEY.READ_ONLY]: false,
        [RESPONSE_TABLE_VALIDATION_KEY.IS_PAGINATION]: false,
        [RESPONSE_TABLE_VALIDATION_KEY.IS_MINIMUM_ROW]: false,
        [RESPONSE_TABLE_VALIDATION_KEY.IS_MAXIMUM_ROW]: false,
        [RESPONSE_TABLE_VALIDATION_KEY.IS_UNIQUE_COLUMN_AVAILABLE]: false,
      };
    }
      break;
    default: break;
  }

  return fieldData;
};

export const getInitialSummaryFieldData = (fieldData = {}) => {
  const summaryFieldData = {
    [RESPONSE_FIELD_KEYS.DROP_TYPE]: fieldData?.[RESPONSE_FIELD_KEYS.DROP_TYPE],
    [RESPONSE_FIELD_KEYS.SECTION_UUID]:
      fieldData?.[RESPONSE_FIELD_KEYS.SECTION_UUID],
    [RESPONSE_FIELD_KEYS.PATH]: fieldData?.[RESPONSE_FIELD_KEYS.PATH],
    [RESPONSE_FIELD_KEYS.FIELD_NAME]: fieldData[RESPONSE_FIELD_KEYS.FIELD_NAME],
    [RESPONSE_FIELD_KEYS.FIELD_TYPE]: fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE],
    [RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES]:
      fieldData[RESPONSE_FIELD_KEYS.FIELD_LIST_TYPES],
    [RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID]: fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID],
    isMultipleEntry: false,
    [RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID]:
      fieldData[RESPONSE_FIELD_KEYS.FIELD_UUID],
    [RESPONSE_FIELD_KEYS.FIELD_SOURCE_TYPE]: fieldData[RESPONSE_FIELD_KEYS.FIELD_SOURCE_TYPE],
    [RESPONSE_FIELD_KEYS.HIDE_FIELD_IF_NULL]: false,
    // [RESPONSE_FIELD_KEYS.CHOICE_VALUES]: fieldData?.chocieValues,
  };

  if (fieldData[RESPONSE_FIELD_KEYS.TABLE_UUID]) {
    summaryFieldData[RESPONSE_FIELD_KEYS.TABLE_UUID] =
      fieldData?.[RESPONSE_FIELD_KEYS.TABLE_UUID];
  }
  if (
    [
      FIELD_TYPE.DATA_LIST,
      FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
      FIELD_TYPE.USER_TEAM_PICKER,
      FIELD_TYPE.USER_PROPERTY_PICKER,
    ].includes(fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE])
  ) {
    summaryFieldData.selectedDataListUuid = fieldData.selectedDataListUuid;
    if (
      [
        FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
        FIELD_TYPE.USER_PROPERTY_PICKER,
      ].includes(fieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE])
    ) {
      summaryFieldData.showProperty = true;
      summaryFieldData.dataListPickerFieldUUID =
        fieldData.dataListPickerFieldUUID;
      summaryFieldData.datalistPickerFieldType =
        fieldData.datalistPickerFieldType;
      summaryFieldData.datalistPickerFieldName =
        fieldData.datalistPickerFieldName;
      summaryFieldData.datalistPickerUUID = fieldData.datalistPickerUUID;
    }
  }

  if (fieldData[RESPONSE_FIELD_KEYS.RULE_UUID]) { // external_data
    const isDLExternalSource = fieldData.ruleType === RULE_TYPE.DATA_LIST_QUERY;
    summaryFieldData[RESPONSE_FIELD_KEYS.SELECTED_EXTERNAL_RULE_UUID] = fieldData.ruleUUID;

    if (isDLExternalSource && fieldData.isMultipleEntry) {
      summaryFieldData[RESPONSE_FIELD_KEYS.FIELD_TYPE] = FIELD_TYPE.TABLE;
      if (fieldData.fieldType === FIELD_TYPES.TABLE) { // if a Table is DND from a multiple entry rule, then add the selectedFieldUUID
        summaryFieldData[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID] = fieldData.fieldUUID || '';
        summaryFieldData[RESPONSE_FIELD_KEYS.FIELD_NAME] = fieldData.label;
      } else {
        delete summaryFieldData[RESPONSE_FIELD_KEYS.SELECTED_FIELD_UUID];
        summaryFieldData[RESPONSE_FIELD_KEYS.FIELD_NAME] = 'Table';
      }
      summaryFieldData.isMultipleEntry = true;
    }
  }
  return summaryFieldData;
};
