import { FIELD_TYPES } from '../../../../../components/form_builder/FormBuilder.strings';

export const PREVIEW_UPLOAD = {
  CONTENT: 'Preview your data in the below table and proceed with upload.',
  PREVIEW: 'Preview Data',
  BACK: {
    ID: 'back',
    LABEL: 'Back',
  },
  UPLOAD: {
    ID: 'upload_data',
    LABEL: 'Upload',
  },
  ROW_COUNT_DROPDOWN_LIST: [
    {
      label: 5,
      value: 5,
    },
  ],
  ARIA_LABEL: {
    DELETE: 'Delete',
  },
};

export const BULK_UPLOAD_SUPPROTED_FIELDS = [
  FIELD_TYPES.NUMBER,
  FIELD_TYPES.SINGLE_LINE,
  FIELD_TYPES.PARAGRAPH,
  FIELD_TYPES.DATETIME,
  FIELD_TYPES.DATE,
  FIELD_TYPES.DROPDOWN,
  FIELD_TYPES.CHECKBOX,
  FIELD_TYPES.RADIO_GROUP,
  FIELD_TYPES.YES_NO,
  FIELD_TYPES.EMAIL,
  FIELD_TYPES.SCANNER,
];

export const OVERWRITE_PREVIEW_UPLOAD = 'Using the same field name for multiple fields could result in overlap. The following field names are';
