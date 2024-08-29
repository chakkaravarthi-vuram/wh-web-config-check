// https://tc39.es/ecma262/#sec-white-space
export const WHITE_SPACE = {
    SPACE: 0x20,
    HORIZONTAL_TAB: 0x09, // <TAB>
    VERTICAL_TAB: 0x0B, // <VT>
    FORM_FEED: 0x0C, // <FF>
    NON_BREAKING_SPACE: 0xA0, // Zero Width Non Breaking Space(&nbsp) <ZWNBSP>
    ANY_UNICODE_SPACE_SEPARATOR: [0x1680, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0x200C], // refer https://en.wikipedia.org/wiki/Whitespace_character <USP>
};

// https://tc39.es/ecma262/#sec-line-terminators
export const LINE_TERMINATOR = {
    NEW_LINE: 0x0A, // <LF>
    CARRIAGE_RETURN: 0x0D, // <CR>
    LINE_SEPARATOR: 0x2028, // <LS>
    PARAGRAPH_SEPARATOR: 0x2029, // <PS>
};

export const COMMENTING_CHARACTER = {
    FORWARD_SLASH: 0x2F,
    ASTERISK: 0x2A,
};

export const STRING_LITERAL = {
    SINGLE_QUOTES: 0x27,
    DOUBLE_QUOTES: 0x22,
    CAP_A: 0x41,
    CAP_D: 0x44,
    CAP_F: 0x46,
    CAP_Z: 0x5A,
    SMALL_A: 0x61,
    SMALL_F: 0x66,
    SMALL_Z: 0x7A,
    DOT_HEXCODE: 0x2E,
    EXCLAMATION: 0x21,
    DOLLAR_HEXCODE: 0x24,
    UNDERSCORE_HEXCODE: 0x5f,
    BACKSLASH_HEXCODE: 0x5c,
    MINUS: 0x2D,
};

export const NUMERIC_LITERAL = {
    ZERO: 0x30,
    SEVEN: 0x37,
    NINE: 0x39,
};

export const NON_PRINTABLE_KEYS = {
    BACKSPACE: 0x08,
    DELETE: 46,
    ENTER: 13,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    NO_WIDTH_NON_JOINER_EMPTY_STRING: 8204,
};

export const PUNCTUATORS = {
    SINGLE_CHARACTER: ['<', '>', '=', '!', '+', '-', '*', '%', '&', '|', '^', '/'],
    TWO_CHARACTER: ['&&', '||', '??', '==', '!=', '+=', '-=', '*=', '/=', '++', '--', '<<', '>>', '&=', '|=', '^=', '%=', '<=', '>=', '=>', '**'],
    THREE_CHARACTER: ['===', '!==', '>>>', '<<=', '>>==', '**='],
    FOUR_CHARACTER: ['>>>=='],
    BRACKETS: {
       ANGLE_BRACKET_LEFT: '(',
       ANGLE_BRACKET_RIGHT: ')',
       CURLY_BRACKET_LEFT: '{',
       CURLY_BRACKET_RIGHT: '}',
       SQUARE_BRACKET_LEFT: '[',
       SQUARE_BRACKET_RIGHT: ']',
    },
    OTHERS: {
        DOT: '.',
        COMMA: ',',
        COLON: ':',
        SEMI_COLON: ';',
        QUESTION_MARK: '?',
        TILDE: '~',
        NULLISH_COALESCING: '??',
        OPTIONAL_CHAINING: '?.',
        SPREAD_OPERATOR: '...',
        DOLLAR: '$',
        UNDERSCORE: '_',
        BACKSLASH: '\\',
    },
};

export const VALID_WHITE_SPACE = [
                           WHITE_SPACE.SPACE,
                           WHITE_SPACE.VERTICAL_TAB,
                           WHITE_SPACE.HORIZONTAL_TAB,
                           WHITE_SPACE.FORM_FEED,
                           WHITE_SPACE.NON_BREAKING_SPACE,
                           ...(WHITE_SPACE.ANY_UNICODE_SPACE_SEPARATOR),
                        ];

export const VALID_LINE_TERMINATOR = [
                           LINE_TERMINATOR.NEW_LINE,
                           LINE_TERMINATOR.CARRIAGE_RETURN,
                           LINE_TERMINATOR.LINE_SEPARATOR,
                           LINE_TERMINATOR.PARAGRAPH_SEPARATOR,
                        ];

export const VALID_STRING_LITERAL = [
                            STRING_LITERAL.SINGLE_QUOTES,
                            STRING_LITERAL.DOUBLE_QUOTES,
                        ];

export const TOKENS = {
    BLOCK_COMMENT: 'BlockComment',
    LINE_COMMENT: 'LineComment',
    IDENTIFIER: 'Identifier',
    KEYWORD: 'Keyword',
    BOOLEAN_LITERAL: 'BooleanLiteral',
    PUNCTUATOR: 'Punctuator',
    NUMERIC_LITERAL: 'NumericLiteral',
    STRING_LITERAL: 'StringLiteral',
    TEMPLATE: 'Template',
    REGULAR_EXPRESSION: 'RegularExpression',
    NULL_LITERAL: 'NullLiteral',
    EOF: 'EOF',
    PLAIN: 'Plain',
    NEW_LINE: 'NewLine',
};

export const ERROR_MESSAGE = {
    INVALID_REGEX: 'Invalid regular expression: missing /',
    SOMETHING_WENT_WRONG: 'Something went wrong',
    IDENTIFIER_CANNOT_IMMEDIATELY_FOLLOW_NUMBERIC: 'An identifier or keyword cannot immediately follow a numeric literal',
    HEXADECIMAL_DIGIT_EXPECTED: 'Hexadecimal digit expected',
    BINARY_DIGIT_EXPECTED: 'Binary digit expected',
    OCTAL_DIGIT_EXPECTED: 'Octal digit expected',
    UNEXPECTED_TOKEN: 'Unexpected token ILLEGAL',

};

export const FIELD = {
    PREFIX: 'f$',
    SUFFIX: '$',
    UNKNOWN_FIELD: 'Unknown Field',
    ZERO_WIDTH_NO_BREAK_SPACE: 0xFEFF,
};

export const SAMPLE_DATA = {
  ALL_FUNCTIONS: ['if', 'sum', 'multiply'],
  ALL_FIELDS: [
    {
      field_name: 'first name',
      reference_name: 'first name',
      field_uuid: '503f0283-2430-416c-a3c5-f6b563246fcc',
      field_type: 'userpropertypicker',
    },
    {
      field_name: 'cu',
      reference_name: 'last name',
      field_uuid: '47950592-3cc1-4dd8-9f1f-5b34731c6844',
      field_type: 'currency',
    },
    {
      field_name: 'firstName',
      reference_name: 'firstName',
      field_uuid: '503f0283-2430-416c-a3c5-f6b563246fcc',
      field_type: 'currency',
    },
    {
      field_name: 'lastName',
      reference_name: 'lastName',
      field_uuid: '47950592-3cc1-4dd8-9f1f-5b34731c6844',
      field_type: 'currency',
    },
  ],
  GROUPED_FUNCTIONS: {
    string: [
      {
        name: 'substring',
        expression: 'substring(value, start, end)',
        definition: 'Returns the part of the text between the start and end.',
        Parameters: [
          {
            name: 'value',
            type: 'Text',
            definition: 'The text of which the character is to indexed.',
            required: true,
          },
          {
            name: 'start',
            type: 'Number',
            definition:
              'The start position of the character, starting at one (1).',
            required: true,
          },
          {
            name: 'end',
            type: 'Number',
            definition:
              'The integer index position of the character, starting at one (1).',
            required: true,
          },
        ],
        example: 'substring("hello",1,3) => "he"',
        output: {
          type: 'Text',
        },
      },
      {
        name: 'format',
        expression: 'format(value, pattern)',
        Parameters: [
          {
            name: 'value',
            type: 'Text',
            definition: 'The text which has to be formatted.',
            required: true,
          },
          {
            name: 'pattern',
            type: 'Text',
            definition: 'The pattern which is used in formatting.',
            required: true,
          },
        ],
        example: 'format("1234", "0,0.00") => 1,234.00',
        output: {
          type: 'text',
        },
      },
      {
        name: 'concatenate',
        expression: 'concatenate(value, delimiter)',
        definition: 'Returns the concatenation of given values with delimiter.',
        Parameters: [
          {
            name: 'value',
            type: 'Array of Text',
            definition: 'An array of Text which needs to be concatenated.',
            required: true,
          },
          {
            name: 'delimiter',
            type: 'Text',
            definition: 'A text which will be used to concatenate.',
            required: false,
          },
        ],
        example: 'concatenate(["hello", "hi"], " ") => "hello hi"',
        output: {
          type: 'text',
        },
      },
      {
        name: 'countChar',
        expression: 'countChar(characters)',
        definition: 'Returns the length of the given string or number',
        parameters: [
          {
            name: 'characters',
            type: 'number or string',
            definition: 'An number or string to find the length.',
            required: true,
          },
        ],
        output: {
          type: 'number',
        },
        example: 'countChar(-123) => 3',
      },
      {
        name: 'split',
        expression: 'split(string, delimiter)',
        definition: 'Splits the given string based on delimiter',
        parameters: [
          {
            name: 'string',
            type: 'string',
            definition: 'A string to split.',
            required: true,
          },
        ],
        output: {
          type: 'array',
        },
        example: "split(JOHN DOE, ' ') => ['JOHN', 'DOE']",
      },
      {
        name: 'lowerCase',
        expression: 'lowerCase(string)',
        definition: 'Converts the given letters to lowercase',
        parameters: [
          {
            name: 'string',
            type: 'string',
            definition: 'A string to convert to lowercase.',
            required: true,
          },
        ],
        output: {
          type: 'string',
        },
        example: 'lowerCase(Steve Smith) => steve smith',
      },
      {
        name: 'upperCase',
        expression: 'upperCase(string)',
        definition: 'Converts the given letters to uppercase',
        parameters: [
          {
            name: 'string',
            type: 'string',
            definition: 'A string to convert to uppercase.',
            required: true,
          },
        ],
        output: {
          type: 'string',
        },
        example: 'upperCase(Steve Smith) => steve smith',
      },
      {
        name: 'initials',
        expression: 'initials(string)',
        definition: 'Extracts the initials from given name',
        parameters: [
          {
            name: 'characters',
            type: 'string',
            definition: 'A string to extract initials.',
            required: true,
          },
        ],
        output: {
          type: 'string',
        },
        example: 'initials(JOHN DOE) => JD',
      },
    ],
    conditional: [
      {
        name: 'if',
        expression: 'if(condition, truepart, falsepart)',
        definition:
          'Returns valueIfTrue if condition returns true; returns valueIfFalse otherwise.',
        Parameters: [
          {
            name: 'condition',
            type: 'boolean',
            definition:
              'A test that determines whether valueIfTrue or valueIfFalse will be returned',
            required: true,
          },
          {
            name: 'truePart',
            type: 'Any Type',
            definition: 'The value to be returned if condition returns true',
            required: true,
          },
          {
            name: 'falsePart',
            type: 'Any Type',
            definition: 'The value to be returned if condition returns false',
            required: true,
          },
        ],
        output: {
          type: 'Any Type',
        },
        example: 'if(1<2,3,4) => 3',
      },
      {
        name: 'all',
        expression: 'all(value1,value2,value3)',
        definition:
          'Returns the and operation of the specified numbers or booleans. Returns true or false.',
        parameters: [
          {
            name: 'value',
            type: 'Boolean Array',
            definition:
              'A boolean or number or array of boolean or array of number that will undergo and operation.',
            required: true,
          },
        ],
        example: 'all(true, true, false) => false',
        output: {
          type: 'Boolean',
        },
      },
      {
        name: 'any',
        expression: 'any(value1,value2,value3)',
        definition:
          'Returns the or operation of the specified number(s) or boolean(s). Returns true or false.',
        parameters: [
          {
            name: 'value',
            type: 'Boolean Array',
            definition:
              'A boolean or number or array of boolean or array of number that will undergo or operation.',
            required: true,
          },
        ],
        output: {
          type: 'Boolean',
        },
        example: 'any(true, true, false) => true',
      },
      {
        name: 'not',
        expression: 'not(value)',
        definition: 'Returns the inverse of the specified value.',
        parameters: [
          {
            name: 'value',
            type: 'Boolean',
            definition:
              'A candidate number or an array of candidates for the minimum.',
            required: true,
          },
        ],
        output: {
          type: 'Boolean',
        },
        example: 'not(true) => false',
      },
      {
        name: 'isEmpty',
        expression: 'isEmpty(value)',
        definition:
          'Returns boolean indicating whether a given value is empty or not.',
        parameters: [
          {
            name: 'number',
            type: 'Number(Decimal or Integer)',
            definition: 'The value to be evaluate.',
            required: true,
          },
        ],
        output: {
          type: 'number',
        },
        example: 'isEmpty(2) => false',
      },
    ],
    arithmetic: [
      {
        name: 'sum',
        expression: 'sum(numbers)',
        definition: 'Returns the sum of the specified number(s).',
        parameters: [
          {
            name: 'numbers',
            type: 'Numbers(Decimal or Integer)',
            definition:
              'A number or array of numbers that will be added into the final sum.',
            required: true,
          },
        ],
        example: 'sum(1,2,3,4) => 10',
        output: {
          type: 'integer',
        },
      },
      {
        name: 'min',
        expression: 'min(numbers)',
        definition: 'Returns the minimum of the specified number(s).',
        parameters: [
          {
            name: 'numbers',
            type: 'Numbers(Decimal or Integer)',
            definition:
              'A candidate number or an array of candidates for the minimum.',
            required: true,
          },
        ],
        output: {
          type: 'integer',
        },
        example: 'min(1,2,3,4) => 1',
      },
      {
        name: 'max',
        expression: 'max(numbers)',
        definition: 'Returns the maximum of the specified number(s).',
        parameters: [
          {
            name: 'numbers',
            type: 'Numbers(Decimal or Integer)',
            definition:
              'A candidate number or an array of candidates for the minimum.',
            required: true,
          },
        ],
        output: {
          type: 'integer',
        },
        example: 'max(1,2,3,4) => 4',
      },
      {
        name: 'round',
        expression: 'round(value, number)',
        definition:
          'Returns the rounded value of the specified value upto to the number decimal spaces.',
        parameter_count: 2,
        parameters: [
          {
            name: 'value',
            type: 'Numbers(Decimal or Integer)',
            definition: 'A candidate value to be round off.',
            required: true,
          },
          {
            name: 'number',
            type: 'Numbers(Decimal or Integer)',
            definition:
              'A candidate number which specifies the number of decimal spaces.',
            required: true,
          },
        ],
        output: {
          type: 'integer',
        },
        example: 'round(860.235123, 2) => 860.24',
      },
      {
        name: 'isEven',
        expression: 'isEven(number)',
        definition:
          'Returns boolean indicating whether a given number is even or not.',
        parameters: [
          {
            name: 'number',
            type: 'Number(Decimal or Integer)',
            definition: 'A candidate number to evaluate.',
            required: true,
          },
        ],
        output: {
          type: 'boolean',
        },
        example: 'isEven(2) => true',
      },
      {
        name: 'isOdd',
        expression: 'isOdd(number)',
        definition:
          'Returns boolean indicating whether a given number is odd or not.',
        parameters: [
          {
            name: 'number',
            type: 'Number(Decimal or Integer)',
            definition: 'A candidate number to evaluate.',
            required: true,
          },
        ],
        output: {
          type: 'number',
        },
        example: 'isOdd(2) => false',
      },
      {
        name: 'modulo',
        expression: 'modulo(operand1, operand2)',
        definition: 'Returns modulo operation of operand1 and operand2.',
        parameters: [
          {
            name: 'operand1',
            type: 'Number(Decimal or Integer)',
            definition: 'A candidate number to get Modulus of.',
            required: true,
          },
          {
            name: 'operand2',
            type: 'Number(Decimal or Integer)',
            definition: 'A candidate number to get Modulus.',
            required: true,
          },
        ],
        output: {
          type: 'number',
        },
        example: 'modulo(2, 3) => 2',
      },
      {
        name: 'power',
        expression: 'power(baseNumber, powerNumber)',
        definition: 'Returns power operation of operand1 and operand2.',
        parameters: [
          {
            name: 'base',
            type: 'Number(Decimal or Integer)',
            definition: 'A candidate number to be the base.',
            required: true,
          },
          {
            name: 'power',
            type: 'Number(Decimal or Integer)',
            definition: 'A candidate number to be the power.',
            required: true,
          },
        ],
        output: {
          type: 'number',
        },
        example: 'power(10, 3) => 1000',
      },
      {
        name: 'generateRandom',
        expression: 'generateRandom(pattern, number)',
        definition:
          'Returns the random string with given pattern with the length of specified number.',
        parameters: [
          {
            name: 'pattern',
            type: 'string',
            definition: 'A string that defines the pattern.',
            values: ['alphanumeric', 'alphabetic', 'numeric', 'all'],
            required: true,
          },
          {
            name: 'number',
            type: 'number(Integer)',
            definition: 'A number that defines the length of the pattern.',
            required: true,
          },
        ],
        output: {
          type: 'string',
        },
        example: "generateRandom('numeric', 3) => 782",
      },
      {
        name: 'median',
        expression: 'median(numbers)',
        definition: 'Returns the median of the given numbers.',
        parameters: [
          {
            name: 'numbers',
            type: 'Number(Decimal or Integer)',
            definition: 'A sequence of numbers to find the median.',
            required: true,
          },
        ],
        output: {
          type: 'number',
        },
        example: 'median(1,2,3,6,5,4,7) => 4',
      },
      {
        name: 'mode',
        expression: 'mode(numbers)',
        definition: 'Returns the mode of the given numbers.',
        parameters: [
          {
            name: 'numbers',
            type: 'Number(Decimal or Integer)',
            definition: 'A sequence of numbers to find the mode.',
            required: true,
          },
        ],
        output: {
          type: 'number',
        },
        example: 'mode(7,2,4,4,5,4,7,7,8) => [4,7]',
      },
    ],
    array: [
      {
        name: 'doesValueExists',
        expression: 'doesValueExists(array,searchValue)',
        definition: 'Checks whether an array contains the value.',
        parameter_count: 2,
        Parameters: [
          {
            name: 'array',
            type: 'Any Type Array',
            definition: 'Array to check.',
            required: true,
          },
          {
            name: 'searchValue',
            type: 'Any Type',
            definition: 'Value to look for.',
            required: true,
          },
        ],
        output: {
          type: 'boolean',
          definition: '',
        },
        example: 'doesValueExists([1, 2, 3], 2) => true',
      },
      {
        name: 'count',
        expression: 'count(array)',
        definition: 'Returns the length of the given array',
        parameters: [
          {
            name: 'array',
            type: 'array',
            definition: 'An array to find the length.',
            required: true,
          },
        ],
        output: {
          type: 'number',
        },
        example: 'count([1,2,3]) => 3',
      },
    ],
    date: [
      {
        name: 'eDate',
        expression: 'eDate(date,number,period)',
        definition:
          'Returns the date after adding or subtracting date with number of periods given',
        parameters: [
          {
            name: 'date',
            type: 'Date',
            definition:
              'A date value to which the number of days or months or period which was given to be added or subtracted',
            required: true,
          },
          {
            name: 'number',
            type: 'Number',
            definition:
              'number specifying how much period to be added or subtracted',
            required: true,
          },
          {
            name: 'period',
            type: 'Text',
            definition:
              'The value specifies the period and must be in the types given',
            values: ['years', 'months', 'days', 'h', 'm', 's'],
            required: true,
          },
        ],
        example: "eDate('2022-07-13',9,'days') => 2022-07-22T00:00:00.000Z",
        output: {
          type: 'Date',
        },
      },
      {
        name: 'now',
        expression: 'now()',
        definition:
          'Returns the current date and time default(account timezone)',
        parameters: [],
        example: 'now() => 2022-11-011T00:00:00.000Z',
        output: {
          type: 'Date',
        },
      },
      {
        name: 'differenceDate',
        expression: 'differenceDate(date1,date2,period)',
        definition:
          'Returns the difference between date1 and date2 in given period',
        parameters: [
          {
            name: 'date1',
            type: 'Date',
            definition: 'first date value to get the difference',
            required: true,
          },
          {
            name: 'date2',
            type: 'Date',
            definition: 'second date value to get the difference',
            required: true,
          },
          {
            name: 'period',
            type: 'Text',
            definition:
              'The value specifies the period and must be in the types given',
            values: ['years', 'months', 'days', 'hours', 'minutes', 'seconds'],
            required: true,
          },
        ],
        example: "differenceDate('2022-07-13','2022-07-12','days') => 1",
        output: {
          type: 'number',
        },
      },
      {
        name: 'getMonth',
        expression: 'getMonth(date)',
        definition: 'Returns the month from the date',
        parameters: [
          {
            name: 'date',
            type: 'Date',
            definition: 'date value to get the month',
            required: true,
          },
        ],
        example: "getMonth('2022-07-13') => 7",
        output: {
          type: 'number',
        },
      },
      {
        name: 'getYear',
        expression: 'getYear(date)',
        definition: 'Returns the year from the date',
        parameters: [
          {
            name: 'date',
            type: 'Date',
            definition: 'date value to get the year',
            required: true,
          },
        ],
        example: "getYear('2022-07-13') => 2022",
        output: {
          type: 'number',
        },
      },
      {
        name: 'getDay',
        expression: 'getDay(date)',
        definition: 'Returns the day from the date',
        parameters: [
          {
            name: 'date',
            type: 'Date',
            definition: 'date value to get the day',
            required: true,
          },
        ],
        example: "getDay('2022-07-13') => 13",
        output: {
          type: 'number',
        },
      },
      {
        name: 'getTime',
        expression: 'getTime(dateTime)',
        definition: 'Returns the Time from the dateTime',
        parameters: [
          {
            name: 'date time',
            type: 'DateTime',
            definition: 'date time value to get the day',
            required: true,
          },
        ],
        example: "getTime('2022-07-13T12:00:30') => 12:00:30",
        output: {
          type: 'string',
        },
      },
    ],
    table: [
      {
        name: 'merge',
        expression: 'merge(arrays)',
        definition: 'Returns the single array of given array of elements',
        parameters: [
          {
            name: 'arrays',
            type: 'array',
            definition: 'Two or more arrays to mege',
            required: true,
          },
        ],
        output: {
          type: 'array',
        },
        example: 'merge([1,2,3], [4,5,6]) => [1,2,3,4,5,6]',
      },
      {
        name: 'getTableData',
        expression: 'getTableData(table_name, fields)',
        definition: 'Extract data for the given fields from the given table',
        parameters: [
          {
            name: 'table_name',
            type: 'field',
            definition: 'table name to extract data',
            required: true,
          },
          {
            name: 'fields',
            type: 'array of fields',
            values: ['all'],
            definition: 'list of fields to extract the data',
            required: true,
          },
        ],
        output: {
          type: 'array',
        },
        example: "getTableData(table1, 'all') => [[1,2,3][4,5,6]]",
      },
    ],
  },
};
