import { FIELD_TYPES } from '../../../../../components/form_builder/FormBuilder.strings';
import { STEP_TYPE } from '../../../../../utils/Constants';
import { EMPTY_STRING } from '../../../../../utils/strings/CommonStrings';
import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';
import { NODE_REQUEST_FIELD_KEYS, NODE_RESPONSE_FIELD_KEYS } from '../../../node_configuration/NodeConfiguration.constants';

export const TRIGGER_CONSTANTS = {
  ...NODE_REQUEST_FIELD_KEYS,
  CANCEL_WITH_PARENT: 'cancel_with_parent',
  IS_ASYNC: 'is_async',
  IS_MNI: 'is_mni',
  TRIGGER_DETAILS: 'trigger_details',
  ITERATE_FIELD_UUID: 'mni_uuid',
  TRIGER_MAPPING: 'trigger_mapping',
  CHILD_FIELD_UUID: 'child_field_uuid',
  VALUE_TYPE: 'value_type',
  FIELD_NAME: 'field_name',
  TABLE_NAME: 'table_name',
  FIELD_UUID: 'field_uuid',
  TABLE_UUID: 'table_uuid',
  FIELD_TYPE: 'field_type',
  FIELD_LIST_TYPE: 'field_list_type',
  FIELD_LABEL: 'label',
  FIELD_REFERENCE_NAME: 'reference_name',
  DATA_FIELDS: 'data_fields',
  SYSTEM_FIELDS: 'system_fields',
  FORM_FIELDS: 'form_fields',
  FIELD_DETAILS: 'field_details',
  CHILD_FLOW_UUID: 'child_flow_uuid',
  TRIGGER_UUID: 'trigger_uuid',
  CHILD_FLOW_NAME: 'child_flow_name',
  CHILD_FLOW_ID: 'child_flow_id',
  DOCUMENT_DETAILS: 'document_details',
  REMOVED_DOC_LIST: 'removed_doc_list',
  CHOICE_VALUES: 'choice_values',
  CHOICE_VALUE_TYPE: 'choice_value_type',
  VALUE_META_DATA: 'value_meta_data',
  CUSTOM_LOOKUP_ID: 'custom_lookup_id',
  DATA_LIST_DETAILS: 'data_list_details',
  DISPLAY_FIELDS: 'display_fields',
  DATA_LIST_UUID: 'data_list_uuid',
  MAPPING: 'mapping',
};

export const TRIGGER_RESPONSE_KEYS = {
  ...NODE_RESPONSE_FIELD_KEYS,
  CANCEL_WITH_PARENT: 'cancelWithParent',
  IS_ASYNC: 'isAsync',
  IS_MNI: 'isMni',
  CHILD_FLOW_UUID: 'childFlowUuid',
  ITERATE_FIELD_UUID: 'mniUuid',
  TRIGER_MAPPING: 'triggerMapping',
  CHILD_FIELD_UUID: 'childFieldUuid',
  VALUE_TYPE: 'valueType',
  FIELD_NAME: 'fieldName',
  TABLE_NAME: 'tableName',
  FIELD_UUID: 'fieldUuid',
  TABLE_UUID: 'tableUuid',
  FIELD_TYPE: 'fieldType',
  FIELD_LIST_TYPE: 'fieldListType',
  FIELD_LABEL: 'label',
  FIELD_REFERENCE_NAME: 'referenceName',
  DATA_FIELDS: 'dataFields',
  SYSTEM_FIELDS: 'systemFields',
  FORM_FIELDS: 'formFields',
  FIELD_DETAILS: 'fieldDetails',
  TRIGGER_UUID: 'triggerUuid',
  CHILD_FLOW_NAME: 'childFlowName',
  CHILD_FLOW_ID: 'childFlowId',
  CHOICE_VALUES: 'choiceValues',
  CHOICE_VALUE_TYPE: 'choiceValueType',
  VALUE_META_DATA: 'valueMetaData',
  CUSTOM_LOOKUP_ID: 'customLookupId',
  DATA_LIST_DETAILS: 'dataListDetails',
  DISPLAY_FIELDS: 'displayFields',
  DATA_LIST_UUID: 'dataListUuid',
  MAPPING: 'mapping',
};

export const SUB_FLOW_RELATED_INIT_DATA = {
  errorList: {},
  cancelWithParent: false,
  isAsync: true,
  isMni: false,
  mniUuid: EMPTY_STRING,
  iterateFieldUuid: EMPTY_STRING,
  mapping: [],
  documentUrlDetails: {
    uploadedDocMetadata: [],
  },
};

export const TRIGGER_STEP_INITIAL_STATE = {
  flowId: null,
  stepUuid: null,
  _id: null,
  stepName: null,
  coordinateInfo: {
    stepCoordinates: {
      x: 0,
      y: 0,
    },
  },
  stepType: STEP_TYPE.FLOW_TRIGGER,
  stepStatus: DEFAULT_STEP_STATUS,
  isLoadingNodeDetails: true,
  isErrorInLoadingNodeDetails: false,
  childFlowUuid: EMPTY_STRING,
  isSaveClicked: false,
  ...SUB_FLOW_RELATED_INIT_DATA,
};

export const ALLOWED_ITERARTION_FIELD_TYPES = [
  FIELD_TYPES.CHECKBOX,
  FIELD_TYPES.USER_TEAM_PICKER,
  FIELD_TYPES.DATA_LIST,
  FIELD_TYPES.FILE_UPLOAD,
  FIELD_TYPES.TABLE,
  FIELD_TYPES.LINK,
];

export const CALL_SUBFLOW_CONSTANTS = {
  LIST_SCROLL_ID: 'call_subflow_scrollable',
  LIST_SCROLLABLE_THRESOLD: 0.5,
};
