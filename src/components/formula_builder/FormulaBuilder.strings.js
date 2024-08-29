import React from 'react';
import PlusOperatorIcon from 'assets/icons/math_symbols/PlusOperator';
import SubtractOperatorIcon from 'assets/icons/math_symbols/SubtractOperatorIcon';
import MultiplyOperatorIcon from 'assets/icons/math_symbols/MultiplyOperatorIcon';
import EqualOperatorIcon from 'assets/icons/math_symbols/EqualOperatorIcon';
import DivideOperatorIcon from 'assets/icons/math_symbols/DivideOperatorIcon';
import LessOperatorIcon from 'assets/icons/math_symbols/LessOperatorIcon';
import LessOrEqualtoIcon from 'assets/icons/math_symbols/LessOrEqualIcon';
import GreatorOperatorIcon from 'assets/icons/math_symbols/GreatorThanIcon';
import GreatorOrEqualIcon from 'assets/icons/math_symbols/GreatorOrEqualIcon';
import NotEqualOperatorIcon from 'assets/icons/math_symbols/NotEqualOperatorIcon';
import { FIELD_TYPE } from 'utils/constants/form.constant';
import { ARIA_ROLES } from 'utils/UIConstants';
import { translateFunction } from 'utils/jsUtility';

export const FORMULA_BUILDER_TAB_VALUE = {
    MATH_SYMBOL: 1,
    FORM_FIELDS: 2,
    FUNCTIONS: 3,
};

const OPERATOR_ARIA_LABEL = {
    ADDITION: 'Addition operator',
    SUBTRACTION: 'Subtraction operator',
    MULTIPLY: 'Multiply operator',
    DIVIDE: 'Divide operator',
    LESS_OR_EQUAL: 'Less or equal operator',
    LESSER_THAN: 'Lesser than operator',
    GREATER_THAN: 'Greater than operator',
    GREATER_OR_EQUAL: 'Greater or equal operator',
    NOT_EQUAL: 'Not equal operator',
    EQUAL_TO: 'Equal to operator',
};

export const FORMULA_BUILDER_TABS = [
    // { id: 'MATH_SYMBOL', tabName: 'Maths symbols', tabValue: FORMULA_BUILDER_TAB_VALUE.MATH_SYMBOL },
    { id: 'FORM_FIELDS', tabName: 'Form fields', tabValue: FORMULA_BUILDER_TAB_VALUE.FORM_FIELDS },
    { id: 'FUNCTIONS', tabName: 'Functions', tabValue: FORMULA_BUILDER_TAB_VALUE.FUNCTIONS },
];

export const FORMULA_BUILDER_OPERATORS = [
        { id: 'Addition', ICON: <PlusOperatorIcon role={ARIA_ROLES.IMG} ariaLabel={OPERATOR_ARIA_LABEL.ADDITION} />, value: '+', singleCharOperator: true },
        { id: 'Subtraction', ICON: <SubtractOperatorIcon role={ARIA_ROLES.IMG} ariaLabel={OPERATOR_ARIA_LABEL.SUBTRACTION} />, value: '-', singleCharOperator: true },
        { id: 'Multiply', ICON: <MultiplyOperatorIcon role={ARIA_ROLES.IMG} ariaLabel={OPERATOR_ARIA_LABEL.MULTIPLY} />, value: '*', singleCharOperator: true },
        { id: 'Divide', ICON: <DivideOperatorIcon role={ARIA_ROLES.IMG} ariaLabel={OPERATOR_ARIA_LABEL.DIVIDE} />, value: '/', singleCharOperator: true },
        { id: 'Less or Equal', ICON: <LessOrEqualtoIcon role={ARIA_ROLES.IMG} ariaLabel={OPERATOR_ARIA_LABEL.LESS_OR_EQUAL} />, value: '<=', singleCharOperator: false },
        { id: 'Lessor than', ICON: <LessOperatorIcon role={ARIA_ROLES.IMG} ariaLabel={OPERATOR_ARIA_LABEL.LESSER_THAN} />, value: '<', singleCharOperator: true },
        { id: 'Greator than', ICON: <GreatorOperatorIcon role={ARIA_ROLES.IMG} ariaLabel={OPERATOR_ARIA_LABEL.GREATER_THAN} />, value: '>', singleCharOperator: true },
        { id: 'Greator or Equal', ICON: <GreatorOrEqualIcon role={ARIA_ROLES.IMG} ariaLabel={OPERATOR_ARIA_LABEL.GREATER_OR_EQUAL} />, value: '>=', singleCharOperator: false },
        { id: 'Not equal', ICON: <NotEqualOperatorIcon role={ARIA_ROLES.IMG} ariaLabel={OPERATOR_ARIA_LABEL.NOT_EQUAL} />, value: '!=', singleCharOperator: false },
        { id: 'Equal to', ICON: <EqualOperatorIcon role={ARIA_ROLES.IMG} ariaLabel={OPERATOR_ARIA_LABEL.EQUAL_TO} />, value: '==', singleCharOperator: false },
];

export const FORMULA_BUILDER_ALLOWED_FIELDS = [
    FIELD_TYPE.SINGLE_LINE,
    FIELD_TYPE.NUMBER,
    FIELD_TYPE.PARAGRAPH,
    FIELD_TYPE.CHECKBOX,
    FIELD_TYPE.DROPDOWN,
    FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN,
    FIELD_TYPE.DATE,
    FIELD_TYPE.DATETIME,
    FIELD_TYPE.CURRENCY,
    FIELD_TYPE.EMAIL,
    FIELD_TYPE.RADIO_GROUP,
    FIELD_TYPE.YES_NO,
];

export const EditorLineArray = [15, 33, 51, 69, 87, 105, 123, 141, 159, 177];

export const EditorCharWidth = 6.39996;

export const NeglibleChar = 4 * EditorCharWidth;

export const LINE_HEIGHT = 18;

export const FORMULA_BUILDER = (t = translateFunction) => {
    return {
   ALL_LABELS: {
       EVALUATE: 'Evaluate',
       TEST_EXPRESSION: 'Test Expression',
       CLEAR_FORMULA: 'Clear Formula',
       FORMULA_EXPRESSION: 'Formula Expression',
       EXPRESSION_BUILDER: 'Expression Builder',
       HIDE_BUILDER: 'Hide Builder',
       SHOW_BUILDER: 'Show Builder',
       UNSUPPORTED_DATA: 'unsupport',
    },
   ALL_PLACEHOLDER: {
       SEARCH_FIELD: 'Search form field',
       SEARCH_FUNCTION: 'Search function',
       ENTER_FORMULA_HERE: 'Enter the formula here...',
       SEARCH_FIELDS_FUNCTIONS: t('form_field_strings.formula_builder.formula_builder_string.search_functions_or_fields'),
   },
   TABS: [
    { id: 'FORM_FIELDS', tabName: 'Form fields', tabValue: FORMULA_BUILDER_TAB_VALUE.FORM_FIELDS },
    { id: 'FUNCTIONS', tabName: 'Functions', tabValue: FORMULA_BUILDER_TAB_VALUE.FUNCTIONS },
    { id: 'MATH_SYMBOL', tabName: 'Maths symbols', tabValue: FORMULA_BUILDER_TAB_VALUE.MATH_SYMBOL },
    ],
   CODE_FORMATTER_CONFIG: {
        indent_size: '2',
        indent_char: '  ',
        eol: '\n',
        max_preserve_newlines: '-1',
        preserve_newlines: true,
        end_with_newline: false,
        wrap_line_length: '40',
        indent_empty_lines: false,
        space_in_paren: true,
        space_in_empty_paren: true,
   },
   RULE_TYPE: {
    DEFAULT_VALUE_CONDITION: 'rule_field_default_value_condition',
   },
   VALIDATION: {
      CONDITION: {
         MAX_CODE_LIMIT: 2000,
         MIN_CODE_LIMIT: 0,
      },
      LABEL: {
          EMPTY: t('form_field_strings.formula_builder.formula_builder_string.editor_empty'),
          MAX_LIMIT: t('form_field_strings.formula_builder.formula_builder_string.editor_exceeds'),
          CORRECT_SYNTAX: t('form_field_strings.formula_builder.formula_builder_string.syntax_correct'),
          INCORRECT_SYNTAX: t('form_field_strings.formula_builder.formula_builder_string.syntax_error'),
      },
      TYPE: {
          PRIMARY: 'primary',
          SECONDARY: 'secondary',
      },
   },
   CLEAR_FORMULA: 'Clear Formula',
   LINE_NUMBER: 'line_number',
};
};

export const FORMULA_TAB_TITLE = {
    FUNCTION: 'functions',
    FIELDS: 'fields',
    MATH_SYMBOLS: 'math_symbols',
};

export const FORMULA_EXPRESSION_COMMON_STRINGS = (t = translateFunction) => {
    return {
    FORMULA: 'Formula',
    CLEAR: 'Clear',
    CLEAR_TITLE: 'Clear Formula',
    BEAUTIFY: 'Beautify',
    BEAUTIFY_TITLE: 'Beautify Formula',
    LOADER_TEXT: 'Preparing Formula Expression...',
    CONFIRMATION_MESSAGE: 'Are you sure you want to clear formula ?',
    CALCULATION_TYPE_CONFIRMATION_MESSAGE: t('form_field_strings.formula_builder.common_expression.calculation'),
    YES: 'Yes',
    NO: 'No',
    LOOSE_AND_PROCEED: t('form_field_strings.formula_builder.common_expression.loose'),
    REMAIN_TO_SAVE: t('form_field_strings.formula_builder.common_expression.save'),
    };
};

export const FORMULA_BUILDER_REDUX_KEYS = {
    TOKENIZED_OUTPUT: 'tokenizedOutput',
    CURRENT_FORMULA_TAB: 'currentFormulaTab',
    LIST_FUNCTION: 'lstFunctions',
    FIELD_METADATA: 'field_metadata',
    REFRESH_ON_CODE_CHANGE: 'refreshOnCodeChange',
};

export const FORMULA_BILDER_MAX_CHARACTER_LIMIT = 5000;
export const FORMULA_BILDER_MIN_CHARACTER_LIMIT = 1;
