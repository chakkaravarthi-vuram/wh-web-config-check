// import { translate } from 'language/config';
import { translateFunction } from 'utils/jsUtility';
import { FIELD_TYPE, PROPERTY_PICKER_KEYS } from './form.constant';

export const ALLOWED_DATALIST_FIELD_TYPES = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.RADIO_GROUP,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.EMAIL,
  FIELD_TYPE.SCANNER,
];
export const ALLOWED_DATALIST_PROPERTY_TYPES = [
  FIELD_TYPE.SINGLE_LINE,
  FIELD_TYPE.PARAGRAPH,
  FIELD_TYPE.NUMBER,
  FIELD_TYPE.EMAIL,
  FIELD_TYPE.DATE,
  FIELD_TYPE.FILE_UPLOAD,
  FIELD_TYPE.CURRENCY,
  FIELD_TYPE.DROPDOWN,
  FIELD_TYPE.CHECKBOX,
  FIELD_TYPE.RADIO_GROUP,
  FIELD_TYPE.CASCADING,
  FIELD_TYPE.USER_TEAM_PICKER,
  FIELD_TYPE.YES_NO,
  FIELD_TYPE.LINK,
  // FIELD_TYPE.INFORMATION,
  FIELD_TYPE.CUSTOM_LOOKUP_CHECKBOX,
  FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
  FIELD_TYPE.CUSTOM_LOOKUP_RADIOBUTTON,
  FIELD_TYPE.DATETIME,
  FIELD_TYPE.DATA_LIST,
  FIELD_TYPE.PHONE_NUMBER,
  FIELD_TYPE.SCANNER,
];
export const DEFAULT_SEPARATOR = '-';

export const DATA_LIST_PROPERTY_PICKER_NOTE = (t = translateFunction) => {
  return {
  READ_ONLY: t('validation_constants.datalist_property_picker.read_only'),
  NO_DATA_LIST_PICKER_FORM_FEILD: t('validation_constants.datalist_property_picker.no_datalist_picker_form_field'),
  NO_DATA_LIST_PICKER_TABLE_FEILD: t('validation_constants.datalist_property_picker.no_datalist_picker_table_field'),
  };
};

export const USER_LIST_PROPERTY_PICKER_NOTE = (t = translateFunction) => {
  return {
  READ_ONLY: t('validation_constants.user_property_picker.read_only'),
  NO_DATA_LIST_PICKER_FORM_FEILD: t('validation_constants.user_property_picker.no_user_picker_from_field'),
  NO_DATA_LIST_PICKER_TABLE_FEILD: t('validation_constants.user_property_picker.no_user_picker_table_field'),
  };
};

export const DATA_LIST_FIELD_CONFIG = (t = translateFunction) => {
  return {
  PICKER: {
    ID: 'data_list',
    LABEL: t('validation_constants.datalist_field_config.picker.label'),
    PLACEHOLDER: t('validation_constants.datalist_field_config.picker.placeholder'),
  },
  PROPERTY_PICKER: {
    ID: PROPERTY_PICKER_KEYS.SOURCE_FIELD_UUID,
    LABEL: t('validation_constants.datalist_field_config.property_picker.label'),
    PLACEHOLDER: t('validation_constants.datalist_field_config.property_picker.placeholder'),
  },
};
};

export const USER_LIST_CONFIG = (t = translateFunction) => {
  return {
  PICKER: {
    ID: PROPERTY_PICKER_KEYS.SOURCE_FIELD_UUID,
    LABEL: t('validation_constants.user_list_config.picker.label'),
    PLACEHOLDER: t('validation_constants.user_list_config.picker.placeholder'),
  },
};
};
