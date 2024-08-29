import { STEP_TYPE } from '../../../../../utils/Constants';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';

export const GENERATE_DOCUMENT_INITIAL_STATE = {
  flowId: null,
  _id: null,
  stepUuid: null,
  stepName: null,
  coordinateInfo: {
    stepCoordinates: {
      x: 0,
      y: 0,
    },
  },
  stepType: STEP_TYPE.DOCUMENT_GENERATION,
  stepStatus: DEFAULT_STEP_STATUS,
  allFieldsList: [],
  allDocumentFields: [],
  allTemplateNameFields: [],
  selectedFields: [],
  headerDocument: {
    headerConfig: {
      showInPages: EMPTY_STRING,
      showPageNumber: false,
    },
  },
  footerDocument: {
    footerConfig: {
      showInPages: EMPTY_STRING,
      showPageNumber: false,
    },
  },
  removedDocList: [],
  isSaveClicked: false,
};

export const DOC_NAME_TOOLTIP_ID = 'template_tooltip';

export const IGNORED_DOC_GEN_FIELD_TYPES = [FIELD_TYPE.INFORMATION, FIELD_TYPE.FILE_UPLOAD];

export const REQUEST_FIELD_KEYS = {
  DOCUMENT_GENERATION: 'document_generation',
  DOCUMENT_FIELD_NAME: 'document_field_name',
  TEMPLATE_DOC_ID: 'template_doc_id',
  DATA_FIELDS: 'data_fields',
  FILE_NAME: 'file_name',
  DOCUMENT_FIELD_UUID: 'document_field_uuid',
  ACTION_UUID: 'action_uuid',
  HEADER_DOCUMENT: 'header_document',
  HEADER_CONFIG: 'header_config',
  FOOTER_DOCUMENT: 'footer_document',
  FOOTER_CONFIG: 'footer_config',
  SHOW_IN_PAGES: 'show_in_pages',
  SHOW_PAGE_NUMBER: 'show_page_number',
  DOCUMENT_NAME_UUID: 'document_template_name_field_uuid',
  FIELD_UUID: 'field_uuid',
  TABLE_UUID: 'table_uuid',
  FIELD_NAME: 'field_name',
  FIELD_LIST_TYPE: 'field_list_type',
  FIELD_TYPE: 'field_type',
  REFERENCE_NAME: 'reference_name',
  TABLE_REFERENCE_NAME: 'table_reference_name',
  PROPERTY_PICKER_DETAILS: 'property_picker_details',
  REFERENCE_FIELD_TYPE: 'reference_field_type',
  DOCUMENT_GENERATION_UUID: 'document_generation_uuid',
  ID: '_id',
  STEP_UUID: 'step_uuid',
  STEP_STATUS: 'step_status',
  STEP_NAME: 'step_name',
  STEP_TYPE: 'step_type',
  STEP_ORDER: 'step_order',
  FLOW_ID: 'flow_id',
  IMAGE_DOC_IDS: 'image_doc_ids',
};

export const RESPONSE_FIELD_KEYS = {
  DOCUMENT_BODY: 'documentBody',
  FLOW_ID: 'flowId',
  DOCUMENT_HEADER: 'documentHeader',
  DOCUMENT_FOOTER: 'documentFooter',
  DOCUMENT_FIELD_NAME: 'documentFieldName',
  TEMPLATE_DOC_ID: 'templateDocId',
  DATA_FIELDS: 'dataFields',
  FILE_NAME: 'fileName',
  DOCUMENT_FIELD_UUID: 'documentFieldUuid',
  ACTION_UUID: 'actionUuid',
  HEADER_DOCUMENT: 'headerDocument',
  HEADER_CONFIG: 'headerConfig',
  FOOTER_DOCUMENT: 'footerDocument',
  FOOTER_CONFIG: 'footerConfig',
  SHOW_IN_PAGES: 'showInPages',
  SHOW_PAGE_NUMBER: 'showPageNumber',
  DOCUMENT_NAME_UUID: 'documentNameUuid',
  ALLOW_HEADER: 'allowHeader',
  ALLOW_FOOTER: 'allowFooter',
  FIELD_UUID: 'fieldUuid',
  TABLE_UUID: 'tableUuid',
  FIELD_NAME: 'fieldName',
  FIELD_LIST_TYPE: 'fieldListType',
  FIELD_TYPE: 'fieldType',
  REFERENCE_NAME: 'referenceName',
  TABLE_REFERENCE_NAME: 'tableReferenceName',
  PROPERTY_PICKER_DETAILS: 'propertyPickerDetails',
  REFERENCE_FIELD_TYPE: 'referenceFieldType',
  DOCUMENT_GENERATION_UUID: 'documentGenerationUuid',
  ID: 'stepId',
  STEP_UUID: 'stepUuid',
  STEP_STATUS: 'stepStatus',
  STEP_NAME: 'stepName',
  STEP_TYPE: 'stepType',
  STEP_ORDER: 'stepOrder',
  IMAGES: 'images',
  REMOVED_DOC_LIST: 'removedDocList',
  IMAGE_DOC_IDS: 'imageDocIds',
};

export const INITIAL_UPLOAD_STATE = {
  totalCount: 0,
  currentCount: 0,
  documents: [],
  docNameList: [],
  uploadedDocDetails: {},
  uploadDocumentAction: {},
};

export const PAGE_HEADER_FOOTER_OPTIONS = {
  ALL_PAGES: 'all_pages',
  FIRST_PAGE: 'first_page',
  LAST_PAGE: 'last_page',
  EXCEPT_FIRST_PAGE: 'except_first_page',
};

export const INSERT_IMAGE_MAX_FILE_SIZE = 5;
