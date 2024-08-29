import { FIELD_TYPE } from '../../utils/constants/form.constant';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

export const TOOLBAR2 =
  'insertField insertChildCard insertButton | insertImage';
export const CHILD_TOOLBAR2 = 'insertField insertButton | insertImage';
export const APP_TOOLBAR2 = null;

export const TOOLBAR2_BUTTONS = {
  INSERT_FIELD: 'insertField',
  INSERT_CHILD: 'insertChildCard',
  INSERT_BUTTON: 'insertButton',
  INSERT_IMAGE: 'insertImage',
  IMAGE: 'image',
};

export const FIELD_IDS = {
  INSERT_FIELD_MODAL: 'insert_field_modal',
  INSERT_BUTTON_MODAL: 'insert_button_modal',
  INSERT_CHILD_CARD_MODAL: 'child_card_modal',
  BUTTON_LABEL: 'buttonLabel',
  BUTTON_STYLE: 'buttonStyle',
  BUTTON_LINK: 'buttonLink',
  CHILD_RECURSIVE: 'isChildRecursive',
  CHILD_BORDER: 'isChildBorder',
  CHILD_RECURSIVE_FIELD: 'childRecursiveField',
  CHILD_EDITOR: 'childCardEditor',
  CHOOSE_FIELD_TYPE: 'chooseFieldType',
  SEARCH_FIELD: 'searchField',
  ERROR_LIST: 'errorList',
  INSERT_FIELD: 'field',
  CHILD_BG_COLOR: 'childBgColor',
};

export const FIELD_OPTION_VALUES = {
  BUTTON_TYPE_LINK: 'link',
  BUTTON_TYPE_SOLID: 'solidButton',
  BUTTON_TYPE_OUTLINE: 'outlineButton',
  CHILD_RECURSIVE_BORDER_YES: 1,
  CHILD_RECURSIVE_BORDER_NO: 0,
  FIELD_TYPE_DIRECT: 'directField',
  FIELD_TYPE_CHILD: 'childField',
};

export const WIDGET_IGNORED_FIELD_TYPES = [
  FIELD_TYPE.FILE_UPLOAD,
  FIELD_TYPE.USER_PROPERTY_PICKER,
  FIELD_TYPE.DATA_LIST_PROPERTY_PICKER,
  FIELD_TYPE.INFORMATION,
];

export const BUTTON_INIT_TEXT = {
  [FIELD_IDS.BUTTON_LABEL]: EMPTY_STRING,
  [FIELD_IDS.BUTTON_STYLE]: FIELD_OPTION_VALUES.BUTTON_TYPE_LINK,
  [FIELD_IDS.BUTTON_LINK]: EMPTY_STRING,
  [FIELD_IDS.ERROR_LIST]: {},
};

export const CHILD_INIT_LOCAL_STATE = {
  [FIELD_IDS.CHILD_RECURSIVE]: FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES,
  [FIELD_IDS.CHILD_BORDER]: FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES,
  [FIELD_IDS.CHILD_RECURSIVE_FIELD]: EMPTY_STRING,
  [FIELD_IDS.ERROR_LIST]: {},
  [FIELD_IDS.CHILD_BG_COLOR]: EMPTY_STRING,
};

export const INSERT_FIELD_INIT = {
  [FIELD_IDS.CHOOSE_FIELD_TYPE]: FIELD_OPTION_VALUES.FIELD_TYPE_DIRECT,
  [FIELD_IDS.SEARCH_FIELD]: EMPTY_STRING,
  [FIELD_IDS.SEARCH_FIELD]: EMPTY_STRING,
  [FIELD_IDS.ERROR_LIST]: {},
};

export const CHILD_EDIT_INIT = {
  initialValue: EMPTY_STRING,
  isChildEdit: false,
  currentEditingElement: null,
  [FIELD_IDS.CHILD_RECURSIVE]: FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES,
  [FIELD_IDS.CHILD_RECURSIVE_FIELD]: {},
  [FIELD_IDS.CHILD_BORDER]: FIELD_OPTION_VALUES.CHILD_RECURSIVE_BORDER_YES,
  [FIELD_IDS.CHILD_BG_COLOR]: EMPTY_STRING,
};

export const EDITOR_HTML_IDS = {
  FIELD_DATA_ID: 'data-field-id',
  FIELD_TYPE_DATA: 'data-field-type',
  FIELD_LABEL_DATA: 'data-field-label',
  RECURSIVE_FIELD: 'data-recursive-field',
  IS_RECURSIVE: 'data-is-recursive',
  BG_COLOR: 'data-bg-color',
  CHILD_BORDER: 'data-is-border',
  EDITOR_ONLY: 'data-editor-only',
  DATA_IMAGE_ID: 'data-image-id',
  RECURSIVE_FIELD_TYPE: 'data-recursive-field-type',
};

export const GET_ALL_FIELDS = {
  PAGE_SIZE: 1000,
  SCROLLABLE_ID: 'get_all_fields_scrollable',
  SCROLLABLE_THRESOLD: 0.5,
};

export const EDITOR_CONSTANTS = {
  CONTENT_STYLE:
    'p { margin: 0px; padding: 0px; } .tox-toolbar { justify-content: space-between !important; } .child-card-container:hover .child-content-container { border: 1px solid #217cf5 !important; } .child-card-container:hover .child-card-icons { display: block; } .child-card-container:hover .card-icons-container { display: flex; position: absolute; z-index: 10;top: 0px; background: #217cf5; padding: 0px 4px 2px 6px; border-radius: 0px 2px 0px 5px; color: white; right: -1px !important; } .card-icons-container { display: none; } .child-card-icons { display: none; } .recursive-icons { margin-right: 8px; } .edit-icons { cursor: pointer; transform: rotateZ(90deg); }',
  HEIGHT: 400,
  CHILD_HEIGHT: 350,
};

export const VALIDATION_CONSTANTS = {
  MIN_CHAR_2: 2,
  MAX_CHAR_255: 255,
};
