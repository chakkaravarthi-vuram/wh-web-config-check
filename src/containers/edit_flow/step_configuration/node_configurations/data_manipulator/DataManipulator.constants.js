import { STEP_TYPE } from '../../../../../utils/Constants';
import { FIELD_TYPE } from '../../../../../utils/constants/form.constant';
import { DEFAULT_STEP_STATUS } from '../../../EditFlow.constants';

export const DATA_MANIPULATOR_INITIAL_STATE = {
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
  stepType: STEP_TYPE.DATA_MANIPULATOR,
  stepStatus: DEFAULT_STEP_STATUS,
  isLoadingNodeDetails: true,
  isErrorInLoadingNodeDetails: false,
};

export const RESPONSE_KEYS = {
    MANIPULATION_DETAILS: 'manipulationDetails',
    SOURCE_TYPE: 'sourceType',
    TYPE: 'type',
    RULE_DETAILS: 'ruleDetails',
    RULE_NAME: 'ruleName',
    CHILD_MAPPING: 'childMapping',
    IS_MULTIPLE: 'isMultiple',
    OPERATOR: 'operator',
    SAVE_TO: 'saveTo',
    TABLE_COLUMN_MAPPING: 'tableColumnMapping',
    STATIC_VALUE: 'staticValue',
    SOURCE_VALUE: 'sourceValue',
    DOCUMENT_DETAILS: 'documentUrlDetails',
    SOURCE_FIELD_TYPE: 'sourceFieldType',
    SAVE_INTO_FIELD: 'saveIntoField',
    SOURCE_FIELD: 'sourceField',
    CHILD_DATA: 'childData',
    FLOW_FIELD_TYPE: 'flowFieldType',
    STEP_STATUS: 'stepStatus',
};

export const REQUEST_KEYS = {
    SOURCE_TYPE: 'source_type',
    TYPE: 'type',
    RULE_DETAILS: 'rule_details',
    CHILD_MAPPPING: 'child_mapping',
    IS_MULTIPLE: 'isMultiple',
    OPERATOR: 'operator',
    SAVE_TO: 'save_to',
    TABLE_COLUMN_MAPPING: 'table_column_mapping',
    STATIC_VALUE: 'static_value',
    SOURCE_VALUE: 'source_value',
    DOCUMENT_DETAILS: 'document_url_details',
    SOURCE_FIELD_TYPE: 'source_field_type',
    SAVE_INTO_FIELD: 'save_into_field',
    SOURCE_FIELD: 'source_field',
    CHILD_DATA: 'child_data',
    STEP_STATUS: 'step_status',
};

export const IGNORED_MANIPULATOR_FIELD_TYPES = [
    FIELD_TYPE.INFORMATION,
];

export const FLOW_MANIPULATION_FIELD_TYPE_MAP = (isStaticType = false) => {
  return {
    [FIELD_TYPE.NUMBER]: isStaticType ? [FIELD_TYPE.NUMBER] : [FIELD_TYPE.NUMBER,
      FIELD_TYPE.CURRENCY],
    [FIELD_TYPE.CURRENCY]: [FIELD_TYPE.NUMBER,
      FIELD_TYPE.CURRENCY],
    [FIELD_TYPE.SINGLE_LINE]: [FIELD_TYPE.PARAGRAPH,
      FIELD_TYPE.SINGLE_LINE, FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
      'text', FIELD_TYPE.SCANNER],
    [FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN]:
    [FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
      FIELD_TYPE.SINGLE_LINE,
      'text',
      FIELD_TYPE.PARAGRAPH,
    ],
    [FIELD_TYPE.PHONE_NUMBER]: [FIELD_TYPE.PHONE_NUMBER],
    [FIELD_TYPE.PARAGRAPH]: [FIELD_TYPE.PARAGRAPH,
      FIELD_TYPE.SINGLE_LINE, FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
      'text'],
    text: [FIELD_TYPE.PARAGRAPH, FIELD_TYPE.SINGLE_LINE,
      FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN, FIELD_TYPE.SCANNER],
    [FIELD_TYPE.FILE_UPLOAD]: [FIELD_TYPE.FILE_UPLOAD],
    [FIELD_TYPE.LINK]: [FIELD_TYPE.LINK],
    [FIELD_TYPE.CHECKBOX]: [FIELD_TYPE.CHECKBOX],
    [FIELD_TYPE.DATE]: [FIELD_TYPE.DATE],
    [FIELD_TYPE.DATETIME]: [FIELD_TYPE.DATETIME],
    [FIELD_TYPE.DATA_LIST]: [FIELD_TYPE.DATA_LIST],
    [FIELD_TYPE.USER_TEAM_PICKER]: [FIELD_TYPE.USER_TEAM_PICKER],
    [FIELD_TYPE.EMAIL]: [FIELD_TYPE.EMAIL],
    [FIELD_TYPE.SCANNER]: [FIELD_TYPE.SCANNER],
    [FIELD_TYPE.YES_NO]: [FIELD_TYPE.YES_NO,
      'boolean'],
    [FIELD_TYPE.TABLE]: [FIELD_TYPE.TABLE,
      'object',
    ],
    boolean: [FIELD_TYPE.YES_NO],
    // [FIELD_TYPE.INFORMATION]: [],
    object: [FIELD_TYPE.TABLE],
  };
};
