import React from 'react';
import i18next from 'i18next';
import SingleLineIcon from '../../../../../assets/icons/form_field_icons_v2/SingleLineIcon';
import ParagraphIcon from '../../../../../assets/icons/form_field_icons_v2/ParagraphIcon';
import NumberIcon from '../../../../../assets/icons/form_field_icons_v2/NumberIcon';
import YesOrNoIcon from '../../../../../assets/icons/form_field_icons_v2/YesOrNoIcon';
import DropdownIcon from '../../../../../assets/icons/form_field_icons_v2/DropdownIcon';
import CheckboxIcon from '../../../../../assets/icons/form_field_icons_v2/CheckboxIcon';
import RadioIcon from '../../../../../assets/icons/form_field_icons_v2/RadioIcon';
import LookupIcon from '../../../../../assets/icons/form_field_icons_v2/LookupIcon';
import DateIcon from '../../../../../assets/icons/form_field_icons_v2/DateIcon';
import DateTimeIcon from '../../../../../assets/icons/form_field_icons_v2/DateTimeIcon';
import TableIcon from '../../../../../assets/icons/form_field_icons_v2/TableIcon';
import UserPropertyPickerIcon from '../../../../../assets/icons/form_field_icons_v2/UserPropertyPickerIcon';
import DataListPropertyPickerIcon from '../../../../../assets/icons/form_field_icons_v2/DataListPropertyPicker';
import UserSelectorIcon from '../../../../../assets/icons/form_field_icons_v2/UserSelectorIcon';
import DataListSelectorIcon from '../../../../../assets/icons/form_field_icons_v2/DataListSelectorIcon';
import EmailIcon from '../../../../../assets/icons/form_field_icons_v2/EmailIcon';
import PhoneIcon from '../../../../../assets/icons/form_field_icons_v2/PhoneIcon';
import CurrencyIcon from '../../../../../assets/icons/form_field_icons_v2/CurrencyIcon';
import LinkIcon from '../../../../../assets/icons/form_field_icons_v2/LinkIcon';
import InfoIcon from '../../../../../assets/icons/form_field_icons_v2/InfoIcon';
import ScannerIcon from '../../../../../assets/icons/form_field_icons_v2/ScannerIcon';
import { FIELD_TYPES } from '../FieldConfiguration.strings';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import jsUtility from '../../../../../utils/jsUtility';
import DocumentUploadIcon from '../../../../../assets/icons/form_field_icons_v2/DocumentUploadIcon';

export const FIELD_LIST_OPTIONS = () => [
    {
      value: FIELD_TYPE.SINGLE_LINE,
      label: 'Single Line Field',
      isCheck: false,
      header: 'Text Fields',
      icon: <SingleLineIcon />,
    },
    {
      value: FIELD_TYPE.PARAGRAPH,
      label: 'Paragraph Field',
      isCheck: false,
      icon: <ParagraphIcon />,
    },
    {
      value: FIELD_TYPE.NUMBER,
      label: 'Number Field',
      isCheck: false,
      icon: <NumberIcon />,
    },
    {
      value: FIELD_TYPE.YES_NO,
      label: 'Yes Or No Field',
      isCheck: false,
      header: 'Multi Fields',
      icon: <YesOrNoIcon />,
    },
    {
      value: FIELD_TYPE.DROPDOWN,
      label: 'Dropdown field',
      isCheck: false,
      icon: <DropdownIcon />,
    },
    {
      value: FIELD_TYPE.CHECKBOX,
      label: 'Checkbox field',
      isCheck: false,
      icon: <CheckboxIcon />,
    },
    {
      value: FIELD_TYPE.RADIO_GROUP,
      label: 'Radio Option field',
      isCheck: false,
      icon: <RadioIcon />,
    },
    {
      value: FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
      label: 'Cascading Dropdown field',
      isCheck: false,
      icon: <LookupIcon />,
    },
    {
      value: FIELD_TYPE.DATE,
      label: 'Date Field',
      isCheck: false,
      header: 'Date Fields',
      icon: <DateIcon />,
    },
    {
      value: FIELD_TYPE.DATETIME,
      label: 'Date Time Field',
      isCheck: false,
      icon: <DateTimeIcon />,
    },
    {
      value: FIELD_TYPE.FILE_UPLOAD,
      label: 'File Upload Field',
      isCheck: false,
      header: 'Media Fields',
      icon: <DocumentUploadIcon />,
    },
    {
      value: FIELD_TYPE.TABLE,
      label: 'Table',
      isCheck: false,
      header: 'Layout Fields',
      icon: <TableIcon />,
    },
    {
      value: FIELD_TYPE.USER_TEAM_PICKER,
      label: 'User/Team Picker Field',
      isCheck: false,
      header: 'Data Reference Fields',
      icon: <UserSelectorIcon />,
    },
    {
      value: FIELD_TYPE.USER_PROPERTY_PICKER,
      label: 'User Property Picker Field',
      isCheck: false,
      icon: <UserPropertyPickerIcon />,
    },
    {
      value: FIELD_TYPE.DATA_LIST,
      label: 'Datalist Picker Field',
      isCheck: false,
      icon: <DataListSelectorIcon />,
    },
    {
      value: FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
      label: 'Datalist Property Picker Field',
      isCheck: false,
      icon: <DataListPropertyPickerIcon />,
    },
    {
      value: FIELD_TYPE.EMAIL,
      label: 'Email Field',
      isCheck: false,
      header: 'Other Fields',
      icon: <EmailIcon />,
    },
    {
      value: FIELD_TYPE.PHONE_NUMBER,
      label: 'Phone Number Field',
      isCheck: false,
      icon: <PhoneIcon />,
    },
    {
      value: FIELD_TYPE.CURRENCY,
      label: 'Currency Field',
      isCheck: false,
      icon: <CurrencyIcon />,
    },
    {
      value: FIELD_TYPE.LINK,
      label: 'Link Field',
      isCheck: false,
      icon: <LinkIcon />,
    },
    {
      value: FIELD_TYPE.INFORMATION,
      label: 'Information Field',
      isCheck: false,
      icon: <InfoIcon />,
    },
    {
      value: FIELD_TYPE.SCANNER,
      label: 'Barcode Scanner Field',
      isCheck: false,
      icon: <ScannerIcon />,
    },
  ];

export const FIELD_LIST = (t, isTable = false) => jsUtility.compact([
  {
      value: FIELD_TYPES.SINGLE_LINE,
      label: t('form_field_strings.dropdown_list_text.single_line'),
      isCheck: false,
      header: 'Text Fields',
      icon: <SingleLineIcon />,
  },
  {
      header: 'Text Fields',
      value: FIELD_TYPES.PARAGRAPH,
      label: t('form_field_strings.dropdown_list_text.Paragraph'),
      isCheck: false,
      icon: <ParagraphIcon />,
  },
  {
      header: 'Text Fields',
      value: FIELD_TYPES.NUMBER,
      label: t('form_field_strings.dropdown_list_text.number'),
      isCheck: false,
      icon: <NumberIcon />,
  },
  {
      header: 'Selection Fields',
      label: t('form_field_strings.dropdown_list_text.yes_or_no'),
      isCheck: false,
      icon: <YesOrNoIcon />,
      value: FIELD_TYPES.YES_NO,
  },
  {
      header: 'Selection Fields',
      label: t('form_field_strings.dropdown_list_text.dropdown'),
      isCheck: false,
      icon: <DropdownIcon />,
      value: FIELD_TYPES.DROPDOWN,
  },
  {
      header: 'Selection Fields',
      label: t('form_field_strings.dropdown_list_text.Checkbox'),
      isCheck: false,
      icon: <CheckboxIcon />,
      value: FIELD_TYPES.CHECKBOX,
  },
  {
      header: 'Selection Fields',
      label: t('form_field_strings.dropdown_list_text.radio'),
      isCheck: false,
      icon: <RadioIcon />,
      value: FIELD_TYPES.RADIO_GROUP,
  },
  {
      header: 'Selection Fields',
      label: t('form_field_strings.dropdown_list_text.custom_dropdown'),
      isCheck: false,
      icon: <LookupIcon />,
      value: FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN,
  },
  {
      label: t('form_field_strings.dropdown_list_text.date'),
      isCheck: false,
      icon: <DateIcon />,
      value: FIELD_TYPES.DATE,
      header: 'Date Fields',
  },
  {
      header: 'Date Fields',
      label: t('form_field_strings.dropdown_list_text.date_time'),
      isCheck: false,
      icon: <DateTimeIcon />,
      value: FIELD_TYPES.DATETIME,
  },
  {
      header: 'Media Fields',
      label: t('form_field_strings.dropdown_list_text.document'),
      isCheck: false,
      icon: <DocumentUploadIcon />,
      value: FIELD_TYPES.FILE_UPLOAD,
  },
  !isTable ? {
      header: 'Layout Fields',
      label: t('form_field_strings.dropdown_list_text.table'),
      isCheck: false,
      icon: <TableIcon />,
      value: FIELD_TYPES.TABLE,
  } : null,
  {
      header: 'Data Reference Fields',
      label: t('form_field_strings.dropdown_list_text.user_selector'),
      isCheck: false,
      icon: <UserSelectorIcon />,
      value: FIELD_TYPES.USER_TEAM_PICKER,
  },
  {
      header: 'Data Reference Fields',
      label: t('form_field_strings.dropdown_list_text.user_property_picker'),
      isCheck: false,
      icon: <UserPropertyPickerIcon />,
      value: FIELD_TYPES.USER_PROPERTY_PICKER,
  },
  {
      header: 'Data Reference Fields',
      label: t('form_field_strings.dropdown_list_text.datalist_selector'),
      isCheck: false,
      icon: <DataListSelectorIcon />,
      value: FIELD_TYPES.DATA_LIST,
  },
  {
      header: 'Data Reference Fields',
      label: t('form_field_strings.dropdown_list_text.datalist_property_picker'),
      isCheck: false,
      icon: <DataListPropertyPickerIcon />,
      value: FIELD_TYPES.DATA_LIST_PROPERTY_PICKER,
  },
  {
      header: 'Other Fields',
      label: t('form_field_strings.dropdown_list_text.email'),
      isCheck: false,
      icon: <EmailIcon />,
      value: FIELD_TYPES.EMAIL,
  },
  {
      header: 'Other Fields',
      label: t('form_field_strings.dropdown_list_text.phone_number'),
      isCheck: false,
      icon: <PhoneIcon />,
      value: FIELD_TYPES.PHONE_NUMBER,
  },
  {
      header: 'Other Fields',
      label: t('form_field_strings.dropdown_list_text.currency'),
      isCheck: false,
      icon: <CurrencyIcon />,
      value: FIELD_TYPES.CURRENCY,
  },
  {
      header: 'Other Fields',
      label: t('form_field_strings.dropdown_list_text.link'),
      isCheck: false,
      icon: <LinkIcon />,
      value: FIELD_TYPES.LINK,
  },
  !isTable ? {
      header: 'Other Fields',
      label: t('form_field_strings.dropdown_list_text.information'),
      isCheck: false,
      icon: <InfoIcon />,
      value: FIELD_TYPES.INFORMATION,
  } : null,
  {
      header: 'Other Fields',
      label: t('form_field_strings.dropdown_list_text.scanner'),
      isCheck: false,
      icon: <ScannerIcon />,
      value: FIELD_TYPES.SCANNER,
  },
]);

export const FIELD_LIST_OBJECT = (t = i18next.t) => {
 return {
    [FIELD_TYPES.SINGLE_LINE]: t('form_field_strings.dropdown_list_text.single_line'),
    [FIELD_TYPES.PARAGRAPH]: t('form_field_strings.dropdown_list_text.Paragraph'),
    [FIELD_TYPES.NUMBER]: t('form_field_strings.dropdown_list_text.number'),
    [FIELD_TYPES.DROPDOWN]: t('form_field_strings.dropdown_list_text.dropdown'),
    [FIELD_TYPES.CHECKBOX]: t('form_field_strings.dropdown_list_text.Checkbox'),
    [FIELD_TYPES.RADIO_GROUP]: t('form_field_strings.dropdown_list_text.radio'),
    [FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN]: t('form_field_strings.dropdown_list_text.custom_dropdown'),
    [FIELD_TYPES.DATE]: t('form_field_strings.dropdown_list_text.date'),
    [FIELD_TYPES.DATETIME]: t('form_field_strings.dropdown_list_text.date_time'),
    [FIELD_TYPES.FILE_UPLOAD]: t('form_field_strings.dropdown_list_text.document'),
    [FIELD_TYPES.TABLE]: t('form_field_strings.dropdown_list_text.table'),
    [FIELD_TYPES.USER_TEAM_PICKER]: t('form_field_strings.dropdown_list_text.user_selector'),
    [FIELD_TYPES.USER_PROPERTY_PICKER]: t('form_field_strings.dropdown_list_text.user_property_picker'),
    [FIELD_TYPES.DATA_LIST]: t('form_field_strings.dropdown_list_text.datalist_selector'),
    [FIELD_TYPES.DATA_LIST_PROPERTY_PICKER]: t('form_field_strings.dropdown_list_text.datalist_property_picker'),
    [FIELD_TYPES.EMAIL]: t('form_field_strings.dropdown_list_text.email'),
    [FIELD_TYPES.PHONE_NUMBER]: t('form_field_strings.dropdown_list_text.phone_number'),
    [FIELD_TYPES.CURRENCY]: t('form_field_strings.dropdown_list_text.currency'),
    [FIELD_TYPES.LINK]: t('form_field_strings.dropdown_list_text.link'),
    [FIELD_TYPES.INFORMATION]: t('form_field_strings.dropdown_list_text.information'),
    [FIELD_TYPES.SCANNER]: t('form_field_strings.dropdown_list_text.scanner'),
    [FIELD_TYPES.YES_NO]: t('form_field_strings.dropdown_list_text.yes_or_no'),
    text: 'Text',
    boolean: 'Boolean',
    object: 'Object',
  };
};

export const NON_ML_SUGGESTION_FIELDS = [FIELD_TYPES.INFORMATION, FIELD_TYPES.DATA_LIST_PROPERTY_PICKER, FIELD_TYPES.USER_PROPERTY_PICKER];

export const CHOICE_VALUE_TYPE_OPTIONS = {
  TEXT: 'text',
  NUMBER: 'number',
};
