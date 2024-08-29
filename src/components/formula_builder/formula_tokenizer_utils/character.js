import { has } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import {
    VALID_WHITE_SPACE,
    VALID_LINE_TERMINATOR,
    VALID_STRING_LITERAL,
    STRING_LITERAL,
    NUMERIC_LITERAL,
    FIELD,
    TOKENS,
 } from './constants';
import { updateUnsupportedDataInStringLiteral } from './formulaBuilder.utils';

export const isWhiteSpace = (character) => VALID_WHITE_SPACE.includes(character);

export const isLineTerminator = (character) => VALID_LINE_TERMINATOR.includes(character);

export const isIdentiferStart = (code = '', currentIndex) => {
    const currentPoint = code.slice(currentIndex);
    if (currentPoint) {
      return currentPoint.startsWith(FIELD.PREFIX);
    }
    return false;
};

export const isStringLiteral = (character) => VALID_STRING_LITERAL.includes(character);

// https://tc39.github.io/ecma262/#sec-literals-numeric-literals

export const isDecimalDigit = (number) => (number >= NUMERIC_LITERAL.ZERO && number <= NUMERIC_LITERAL.NINE);

export const isHexDigit = (number) => (
        (number >= NUMERIC_LITERAL.ZERO && number <= NUMERIC_LITERAL.NINE) ||
        (number >= STRING_LITERAL.CAP_A && number <= STRING_LITERAL.CAP_F) ||
        (number >= STRING_LITERAL.SMALL_A && number <= STRING_LITERAL.SMALL_F)
    );

export const isBinaryDigit = (number) => ['0', '1'].includes(number);

export const isOctalDigit = (number) => (number >= NUMERIC_LITERAL.ZERO && number <= NUMERIC_LITERAL.SEVEN);

export const isProgrammaticIdentifierStart = (ch) => (
      ([
        STRING_LITERAL.DOLLAR_HEXCODE,
        STRING_LITERAL.BACKSLASH_HEXCODE,
        STRING_LITERAL.UNDERSCORE_HEXCODE,
        ]).includes(ch) ||
      (ch >= STRING_LITERAL.CAP_A && ch <= STRING_LITERAL.CAP_Z) ||
      (ch >= STRING_LITERAL.SMALL_A && ch <= STRING_LITERAL.SMALL_Z)
    );

export const isProgrammaticIdentifierPart = (ch) => (
      ([
        STRING_LITERAL.DOLLAR_HEXCODE,
        STRING_LITERAL.BACKSLASH_HEXCODE,
        STRING_LITERAL.UNDERSCORE_HEXCODE,
        ]).includes(ch) ||
      (ch >= STRING_LITERAL.CAP_A && ch <= STRING_LITERAL.CAP_Z) ||
      (ch >= STRING_LITERAL.SMALL_A && ch <= STRING_LITERAL.SMALL_Z) ||
      (ch >= NUMERIC_LITERAL.ZERO && ch <= NUMERIC_LITERAL.NINE) ||
      (ch === STRING_LITERAL.MINUS)
    );

export const separateTokenBasedOnLines = (token, tokenList = []) => {
  const index = (token.type !== TOKENS.NEW_LINE) ? token.location.start.line - 1 : token.location.end.line - 1;
  const currentLineData = [(tokenList[index] || [])].flat();
  delete token.location;
  // Instead of providing new line as a token, representing empty line as empty array.
  if (token.type !== TOKENS.NEW_LINE) currentLineData.push(token);
  tokenList[index] = currentLineData;

  // for (let tokenLineIdk = 0; tokenLineIdk < tokenList.length; tokenLineIdk++) {
  //   if (!tokenList[tokenLineIdk]) tokenList[tokenLineIdk] = [];
  // }
  return tokenList;
};

export const getModifiedOptions = (
  options = {},
  ) => {
  const customizedOptions = { ...options };

  if (has(options, ['isLineSeparatedArray'], false)) {
     customizedOptions.location = true;
  }
  return customizedOptions;
};

export const splitBlockCommentIntoSeparateLine = (eachComment, value, trackRange, trackLocation) => {
   const lineSeparatedValues = (value || EMPTY_STRING).split('\n');
   const lineStart = eachComment.location.start.line;
   const rangeLimit = (eachComment.range);
   let previousRange = rangeLimit[0];
   let eachToken = {};
   const separatedBlockComment = (lineSeparatedValues || []).map((eachValue, index) => {
        eachToken = {
              type: TOKENS.BLOCK_COMMENT,
              value: eachValue,
            };

          if (trackRange) {
             eachToken.range = [previousRange, previousRange + eachValue.length];
             previousRange += eachValue.length;
          }

          if (trackLocation) {
             eachToken.location = {
                    start: {
                      line: lineStart + index,
                      column: 0,
                    },
                    end: {
                      line: lineStart + index,
                      column: eachValue.length,
                    },
                };
             }

          return eachToken;
        });
        return separatedBlockComment;
};

export const getTokenValue = (token, sourceCode = EMPTY_STRING, allFields = []) => {
  if (token.type === TOKENS.IDENTIFIER) {
    return token.value;
  } else if (token.type === TOKENS.STRING_LITERAL) {
    const value = sourceCode.slice(token.start, token.end);
    return updateUnsupportedDataInStringLiteral(value, allFields);
  }
    return sourceCode.slice(token.start, token.end);
};
