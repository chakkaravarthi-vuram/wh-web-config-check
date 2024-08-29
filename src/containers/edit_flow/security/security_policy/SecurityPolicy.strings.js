import { FIELD_TYPE } from '../../../../utils/constants/form.constant';

export const POLICY_STRINGS = {
   REQUEST_KEYS: {
      TYPE: 'type',
      POLICY_UUID: 'policy_uuid',
      POLICY: 'policy',
      ACCESS_TO: 'access_to',
      USER_TEAM: 'user_team',
      USERS: 'users',
      TEAMS: 'teams',
      FIELD_UUID: 'field_uuids',
      LOGICAL_OPERATOR: 'logical_operator',
      CONDITONS: 'conditions',
      ENTITY_VIEWERS: 'entity_viewers',
   },
   LABELS: {
      CONDITION_BASED_POLICY_TITLE: 'Selection Field & Number Based Policy(Radio/Dropdown/Checkbox/Number/Yes or No)',
      CONDITION_ACCESS_TO: 'If the condition is true provide access to',
      ADD_POLICY: 'Add Policy',
   },
   ENTITY_VIEWERS: {
      ID: 'entityViewers',
      LABEL: 'Entity Viewers',
      TITLE: 'Policy Based Data Viewers',
      SUB_TITLE: 'This will give access to the top level dashboard access, but further data access will be based on the policy and other security rules',
   },
};

export const POLICY_BUILDER_ALLOWED_FIELDS = [
   FIELD_TYPE.NUMBER,
   FIELD_TYPE.YES_NO,
   FIELD_TYPE.RADIO_GROUP,
   FIELD_TYPE.CHECKBOX,
   FIELD_TYPE.DROPDOWN,
   FIELD_TYPE.DATE,
   FIELD_TYPE.DATETIME,
   FIELD_TYPE.SINGLE_LINE,
   FIELD_TYPE.CURRENCY,
];

const COMMON_POLICY_BUILDER_OPERATORS = [
   {
      label: 'Empty',
      operator: 'isEmpty',
      has_operand: false,
   },
   {
      label: 'Not Empty',
      operator: 'isNotEmpty',
      has_operand: false,
   },
];

const COMMON_POLICY_BUILDER_NUMBER_OPERATORS = [
  {
      label: '>',
      operator: 'numberGreaterThan',
      has_operand: true,
      operand_field: 'number',
   },
   {
      label: '<',
      operator: 'numberLessThan',
      has_operand: true,
      operand_field: 'number',
   },
   {
      label: '>=',
      operator: 'numberGreaterThanOrEqualTo',
      has_operand: true,
      operand_field: 'number',
   },
   {
      label: '<=',
      operator: 'numberLessThanOrEqualTo',
      has_operand: true,
      operand_field: 'number',
   },
   {
      label: 'In Between',
      operator: 'numberInBetween',
      has_operand: true,
      operand_field: 'dual_number',
   },
];

const COMMON_SELECTION_STRING_TYPE_OPERATORS = [
  {
    label: 'Empty',
    operator: 'isEmpty',
    choice_type: 'text',
    has_operand: false,
  },
  {
    label: 'Not Empty',
    operator: 'isNotEmpty',
    choice_type: 'text',
    has_operand: false,
  },
  {
    label: '=',
    operator: 'stringEqualsTo',
    choice_type: 'text',
    has_operand: true,
    operand_field: 'dropdown',
  },
  {
    label: '≠',
    operator: 'stringNotEqualsTo',
    choice_type: 'text',
    has_operand: true,
    operand_field: 'dropdown',
  },
  {
    label: 'In',
    operator: 'stringIn',
    choice_type: 'text',
    has_operand: true,
    operand_field: 'multi_dropdown',
  },
  {
    label: 'Not In',
    operator: 'stringNotIn',
    choice_type: 'text',
    has_operand: true,
    operand_field: 'multi_dropdown',
  },
];

const COMMON_SELECTION_TYPE_OPERATORS = [
    ...COMMON_SELECTION_STRING_TYPE_OPERATORS,
    { // choice_type : number
      label: 'Empty',
      operator: 'isEmpty',
      choice_type: 'number',
      has_operand: false,
    },
    {
      label: 'Not Empty',
      operator: 'isNotEmpty',
      choice_type: 'number',
      has_operand: false,
    },
    {
      label: '=',
      operator: 'numberEqualsTo',
      choice_type: 'number',
      has_operand: true,
      operand_field: 'dropdown',
    },
    {
      label: '≠',
      operator: 'numberNotEqualsTo',
      choice_type: 'number',
      has_operand: true,
      operand_field: 'dropdown',
    },
    {
      label: '>',
      operator: 'numberGreaterThan',
      has_operand: true,
      choice_type: 'number',
      operand_field: 'dropdown',
   },
   {
      label: '<',
      operator: 'numberLessThan',
      has_operand: true,
      choice_type: 'number',
      operand_field: 'dropdown',
   },
   {
      label: '>=',
      operator: 'numberGreaterThanOrEqualTo',
      has_operand: true,
      choice_type: 'number',
      operand_field: 'dropdown',
   },
   {
      label: '<=',
      operator: 'numberLessThanOrEqualTo',
      has_operand: true,
      choice_type: 'number',
      operand_field: 'dropdown',
   },
   {
      label: 'In Between',
      operator: 'numberInBetween',
      has_operand: true,
      choice_type: 'number',
      operand_field: 'dual_number',
   },
    {
      label: 'In',
      operator: 'numberIn',
      choice_type: 'number',
      has_operand: true,
      operand_field: 'multi_dropdown',
    },
    {
      label: 'Not In',
      operator: 'numberNotIn',
      choice_type: 'number',
      has_operand: true,
      operand_field: 'multi_dropdown',
    },
  ];

export const POLICY_BUILDER_OPERATOR_LIST = {
  yesorno: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: 'True',
      operator: 'booleanIsTrue',
      has_operand: false,
    },
    {
      label: 'False',
      operator: 'booleanIsFalse',
      has_operand: false,
    },
  ],
  checkbox: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'stringEqualsTo',
      has_operand: true,
      operand_field: 'multi_dropdown',
    },
    {
      label: '≠',
      operator: 'stringNotEqualsTo',
      has_operand: true,
      operand_field: 'multi_dropdown',
    },
    {
      label: 'In',
      operator: 'stringIn',
      has_operand: true,
      operand_field: 'multi_dropdown',
    },
    {
      label: 'Not In',
      operator: 'stringNotIn',
      has_operand: true,
      operand_field: 'multi_dropdown',
    },
  ],
  dropdown: [
    ...COMMON_SELECTION_TYPE_OPERATORS,
  ],
  lookupdropdown: [
    ...COMMON_SELECTION_STRING_TYPE_OPERATORS,
  ],
  radiobutton: [
    ...COMMON_SELECTION_TYPE_OPERATORS,
  ],
  number: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'numberEqualsTo',
      choice_type: 'number',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: '≠',
      operator: 'numberNotEqualsTo',
      choice_type: 'number',
      has_operand: true,
      operand_field: 'number',
    },
    ...COMMON_POLICY_BUILDER_NUMBER_OPERATORS,
  ],
  currency: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'currencyEqualsTo',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: '≠',
      operator: 'currencyNotEqualsTo',
      has_operand: true,
      operand_field: 'number',
    },
    ...COMMON_POLICY_BUILDER_NUMBER_OPERATORS,
  ],
  singleline: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'stringEqualsTo',
      has_operand: true,
      operand_field: 'singleline',
    },
    {
      label: '≠',
      operator: 'stringNotEqualsTo',
      has_operand: true,
      operand_field: 'singleline',
    },
  ],
  paragraph: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'stringEqualsTo',
      has_operand: true,
      operand_field: 'singleline',
    },
    {
      label: '≠',
      operator: 'stringNotEqualsTo',
      has_operand: true,
      operand_field: 'singleline',
    },
  ],
  email: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'stringEqualsTo',
      has_operand: true,
      operand_field: 'email',
    },
    {
      label: '≠',
      operator: 'stringNotEqualsTo',
      has_operand: true,
      operand_field: 'email',
    },
  ],
  scanner: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'stringEqualsTo',
      has_operand: true,
      operand_field: 'singleline',
    },
    {
      label: '≠',
      operator: 'stringNotEqualsTo',
      has_operand: true,
      operand_field: 'singleline',
    },
  ],
  barcodescanner: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'stringEqualsTo',
      has_operand: true,
      operand_field: 'singleline',
    },
    {
      label: '≠',
      operator: 'stringNotEqualsTo',
      has_operand: true,
      operand_field: 'singleline',
    },
  ],
  date: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'dateEqualsTo',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: '≠',
      operator: 'dateNotEqualsTo',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: '>',
      operator: 'numberGreaterThan',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: '<',
      operator: 'numberLessThan',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: '>=',
      operator: 'numberGreaterThanOrEqualTo',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: '<=',
      operator: 'numberLessThanOrEqualTo',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: 'In Between',
      operator: 'numberInBetween',
      has_operand: true,
      operand_field: 'dual_date',
    },
    {
      label: 'Range',
      operator: 'range',
      has_operand: true,
      operand_field: 'min_max',
    },
  ],
  datetime: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'dateAndTimeEqualsTo',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: '≠',
      operator: 'dateAndTimeNotEqualsTo',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: '>',
      operator: 'numberGreaterThan',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: '<',
      operator: 'numberLessThan',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: '>=',
      operator: 'numberGreaterThanOrEqualTo',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: '<=',
      operator: 'numberLessThanOrEqualTo',
      has_operand: true,
      operand_field: 'number',
    },
    {
      label: 'In Between',
      operator: 'numberInBetween',
      has_operand: true,
      operand_field: 'dual_datetime',
    },
    {
      label: 'Range',
      operator: 'range',
      has_operand: true,
      operand_field: 'min_max',
    },
  ],
  datalistpicker: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'stringEqualsTo',
      has_operand: true,
      operand_field: 'datalistpicker',
    },
    {
      label: '≠',
      operator: 'stringNotEqualsTo',
      has_operand: true,
      operand_field: 'datalistpicker',
    },
  ],
  userteampicker: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'stringEqualsTo',
      has_operand: true,
      operand_field: 'mongoObjectIds',
    },
    {
      label: '≠',
      operator: 'stringNotEqualsTo',
      has_operand: true,
      operand_field: 'mongoObjectIds',
    },
  ],
  link: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'stringEqualsTo',
      has_operand: true,
      operand_field: 'link',
    },
    {
      label: '≠',
      operator: 'stringNotEqualsTo',
      has_operand: true,
      operand_field: 'link',
    },
  ],
  phonenumber: [
    ...COMMON_POLICY_BUILDER_OPERATORS,
    {
      label: '=',
      operator: 'stringEqualsTo',
      has_operand: true,
      operand_field: 'phonenumber',
    },
    {
      label: '≠',
      operator: 'stringNotEqualsTo',
      has_operand: true,
      operand_field: 'phonenumber',
    },
  ],
};

export const IGNORE_STATIC_VALUE_FIELD_TYPES = [
  FIELD_TYPE.DATA_LIST,
];

export const REQUEST_OPERTAOR_LIST = {
   IS_EMPTY: 'is_empty',
   IS_NOT_EMPTY: 'is_not_empty',
   EQUAL_TO: 'equal_to',
   NOT_EQUAL_TO: 'not_equal_to',
   IN: 'in',
   NOT_IN: 'not_in',
   GREATER_THAN: 'greater_than',
   LESSER_THAN: 'lesser_than',
   GREATER_THAN_OR_EQUAL_TO: 'greater_than_or_equal_to',
   LESSER_THAN_OR_EQUAL_TO: 'lesser_than_or_equal_to',
   BETWEEN: 'between',
   IS_TRUE: 'is_true',
   IS_FALSE: 'is_false',
   RANGE: 'range',
};

const COMMON_OPERATOR_MAPPING = {
   [REQUEST_OPERTAOR_LIST.IS_EMPTY]: 'isEmpty',
   [REQUEST_OPERTAOR_LIST.IS_NOT_EMPTY]: 'isNotEmpty',
};

export const RQUEST_TO_RESPONSE_OPERATOR_MAPPING = {
   checkbox: {
      ...COMMON_OPERATOR_MAPPING,
      [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'stringEqualsTo',
      [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'stringNotEqualsTo',
      [REQUEST_OPERTAOR_LIST.IN]: 'stringIn',
      [REQUEST_OPERTAOR_LIST.NOT_IN]: 'stringNotIn',
   },
   dropdown: {
      ...COMMON_OPERATOR_MAPPING,
      text: {
        ...COMMON_OPERATOR_MAPPING,
        [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'stringEqualsTo',
        [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'stringNotEqualsTo',
        [REQUEST_OPERTAOR_LIST.IN]: 'stringIn',
        [REQUEST_OPERTAOR_LIST.NOT_IN]: 'stringNotIn',
      },
      number: {
        ...COMMON_OPERATOR_MAPPING,
        [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'numberEqualsTo',
        [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'numberNotEqualsTo',
        [REQUEST_OPERTAOR_LIST.IN]: 'numberIn',
        [REQUEST_OPERTAOR_LIST.NOT_IN]: 'numberNotIn',
        [REQUEST_OPERTAOR_LIST.GREATER_THAN]: 'numberGreaterThan',
        [REQUEST_OPERTAOR_LIST.LESSER_THAN]: 'numberLessThan',
        [REQUEST_OPERTAOR_LIST.GREATER_THAN_OR_EQUAL_TO]: 'numberGreaterThanOrEqualTo',
        [REQUEST_OPERTAOR_LIST.LESSER_THAN_OR_EQUAL_TO]: 'numberLessThanOrEqualTo',
        [REQUEST_OPERTAOR_LIST.BETWEEN]: 'numberInBetween',
      },
   },
   singleline: {
      ...COMMON_OPERATOR_MAPPING,
      [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'stringEqualsTo',
      [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'stringNotEqualsTo',
   },
   email: {
      ...COMMON_OPERATOR_MAPPING,
      [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'stringEqualsTo',
      [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'stringNotEqualsTo',
   },
   paragraph: {
      ...COMMON_OPERATOR_MAPPING,
      [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'stringEqualsTo',
      [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'stringNotEqualsTo',
   },
   barcodescanner: {
      ...COMMON_OPERATOR_MAPPING,
      [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'stringEqualsTo',
      [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'stringNotEqualsTo',
   },
   number: {
      ...COMMON_OPERATOR_MAPPING,
      [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'numberEqualsTo',
      [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'numberNotEqualsTo',
      [REQUEST_OPERTAOR_LIST.IN]: 'numberIn',
      [REQUEST_OPERTAOR_LIST.NOT_IN]: 'numberNotIn',
      [REQUEST_OPERTAOR_LIST.GREATER_THAN]: 'numberGreaterThan',
      [REQUEST_OPERTAOR_LIST.LESSER_THAN]: 'numberLessThan',
      [REQUEST_OPERTAOR_LIST.GREATER_THAN_OR_EQUAL_TO]: 'numberGreaterThanOrEqualTo',
      [REQUEST_OPERTAOR_LIST.LESSER_THAN_OR_EQUAL_TO]: 'numberLessThanOrEqualTo',
      [REQUEST_OPERTAOR_LIST.BETWEEN]: 'numberInBetween',
   },
   radiobutton: {
      ...COMMON_OPERATOR_MAPPING,
      text: {
        ...COMMON_OPERATOR_MAPPING,
        [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'stringEqualsTo',
        [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'stringNotEqualsTo',
        [REQUEST_OPERTAOR_LIST.IN]: 'stringIn',
        [REQUEST_OPERTAOR_LIST.NOT_IN]: 'stringNotIn',
      },
      number: {
        ...COMMON_OPERATOR_MAPPING,
        [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'numberEqualsTo',
        [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'numberNotEqualsTo',
        [REQUEST_OPERTAOR_LIST.IN]: 'numberIn',
        [REQUEST_OPERTAOR_LIST.NOT_IN]: 'numberNotIn',
        [REQUEST_OPERTAOR_LIST.GREATER_THAN]: 'numberGreaterThan',
        [REQUEST_OPERTAOR_LIST.LESSER_THAN]: 'numberLessThan',
        [REQUEST_OPERTAOR_LIST.GREATER_THAN_OR_EQUAL_TO]: 'numberGreaterThanOrEqualTo',
        [REQUEST_OPERTAOR_LIST.LESSER_THAN_OR_EQUAL_TO]: 'numberLessThanOrEqualTo',
        [REQUEST_OPERTAOR_LIST.BETWEEN]: 'numberInBetween',
      },
   },
   yesorno: {
      ...COMMON_OPERATOR_MAPPING,
      [REQUEST_OPERTAOR_LIST.IS_TRUE]: 'booleanIsTrue',
      [REQUEST_OPERTAOR_LIST.IS_FALSE]: 'booleanIsFalse',
   },
   date: {
      ...COMMON_OPERATOR_MAPPING,
      [REQUEST_OPERTAOR_LIST.IN]: 'numberIn',
      [REQUEST_OPERTAOR_LIST.NOT_IN]: 'numberNotIn',
      [REQUEST_OPERTAOR_LIST.GREATER_THAN]: 'numberGreaterThan',
      [REQUEST_OPERTAOR_LIST.LESSER_THAN]: 'numberLessThan',
      [REQUEST_OPERTAOR_LIST.GREATER_THAN_OR_EQUAL_TO]: 'numberGreaterThanOrEqualTo',
      [REQUEST_OPERTAOR_LIST.LESSER_THAN_OR_EQUAL_TO]: 'numberLessThanOrEqualTo',
      [REQUEST_OPERTAOR_LIST.BETWEEN]: 'numberInBetween',
      [REQUEST_OPERTAOR_LIST.RANGE]: 'range',
      [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'dateEqualsTo',
      [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'dateNotEqualsTo',
   },
   datetime: {
      ...COMMON_OPERATOR_MAPPING,
      [REQUEST_OPERTAOR_LIST.IN]: 'numberIn',
      [REQUEST_OPERTAOR_LIST.NOT_IN]: 'numberNotIn',
      [REQUEST_OPERTAOR_LIST.GREATER_THAN]: 'numberGreaterThan',
      [REQUEST_OPERTAOR_LIST.LESSER_THAN]: 'numberLessThan',
      [REQUEST_OPERTAOR_LIST.GREATER_THAN_OR_EQUAL_TO]: 'numberGreaterThanOrEqualTo',
      [REQUEST_OPERTAOR_LIST.LESSER_THAN_OR_EQUAL_TO]: 'numberLessThanOrEqualTo',
      [REQUEST_OPERTAOR_LIST.BETWEEN]: 'numberInBetween',
      [REQUEST_OPERTAOR_LIST.RANGE]: 'range',
      [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'dateAndTimeEqualsTo',
      [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'dateAndTimeNotEqualsTo',
   },
   currency: {
      ...COMMON_OPERATOR_MAPPING,
      [REQUEST_OPERTAOR_LIST.IN]: 'numberIn',
      [REQUEST_OPERTAOR_LIST.NOT_IN]: 'numberNotIn',
      [REQUEST_OPERTAOR_LIST.GREATER_THAN]: 'numberGreaterThan',
      [REQUEST_OPERTAOR_LIST.LESSER_THAN]: 'numberLessThan',
      [REQUEST_OPERTAOR_LIST.GREATER_THAN_OR_EQUAL_TO]: 'numberGreaterThanOrEqualTo',
      [REQUEST_OPERTAOR_LIST.LESSER_THAN_OR_EQUAL_TO]: 'numberLessThanOrEqualTo',
      [REQUEST_OPERTAOR_LIST.BETWEEN]: 'numberInBetween',
      [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'currencyEqualsTo',
      [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'currencyNotEqualsTo',
   },
   datalistpicker: {
    ...COMMON_OPERATOR_MAPPING,
    [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'stringEqualsTo',
    [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'stringNotEqualsTo',
    [REQUEST_OPERTAOR_LIST.IN]: 'stringIn',
    [REQUEST_OPERTAOR_LIST.NOT_IN]: 'stringNotIn',
  },
  userteampicker: {
    ...COMMON_OPERATOR_MAPPING,
    [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'stringEqualsTo',
    [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'stringNotEqualsTo',
    [REQUEST_OPERTAOR_LIST.IN]: 'stringIn',
    [REQUEST_OPERTAOR_LIST.NOT_IN]: 'stringNotIn',
  },
  lookupdropdown: {
    ...COMMON_OPERATOR_MAPPING,
    [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'stringEqualsTo',
    [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'stringNotEqualsTo',
    [REQUEST_OPERTAOR_LIST.IN]: 'stringIn',
    [REQUEST_OPERTAOR_LIST.NOT_IN]: 'stringNotIn',
  },
  phonenumber: {
    ...COMMON_OPERATOR_MAPPING,
    [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'stringEqualsTo',
    [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'stringNotEqualsTo',
  },
  link: {
    ...COMMON_OPERATOR_MAPPING,
    [REQUEST_OPERTAOR_LIST.EQUAL_TO]: 'stringEqualsTo',
    [REQUEST_OPERTAOR_LIST.NOT_EQUAL_TO]: 'stringNotEqualsTo',
  },
};

export const POLICY_TYPE = {
   CONDIITON_BASED: 'condition',
   USER_FIELD_BASED: 'user_field',
};

export const POLICY_CONDITION_ACTION = {
   UPDATE: 'update',
   DELETE: 'delete',
};
