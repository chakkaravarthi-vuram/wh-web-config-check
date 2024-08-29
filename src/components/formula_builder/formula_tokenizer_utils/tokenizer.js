import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { get, isEmpty } from '../../../utils/jsUtility';
import Scanner from './scanner';
import { SAMPLE_DATA } from './constants';
import { getModifiedOptions, getTokenValue, separateTokenBasedOnLines } from './character';

class Tokenizer {
   constructor(code, configuration) {
       // Error handler instance.
       this.errorHandler = {};
       this.trackRange = configuration ? (typeof configuration.range === 'boolean') : false;
       this.trackLocation = configuration ? (typeof configuration.location === 'boolean') : false;
       this.scanner = new Scanner(code, this.errorHandler);
       this.scanner.trackComment = configuration ? (typeof configuration.comment === 'boolean') : false;
       this.scanner.allFunctionProperty = get(configuration, ['allFunctionProperty'], []);
       this.scanner.allFields = get(configuration, ['allFields'], []);
       // buffer helps to hold all the tokens as array of objects.
       this.buffer = [];
       // this.reader = new Reader();
   }

 // cursorPointerPosition
   getNextToken = () => {
       if (this.buffer.length === 0) {
        // Commenting comment code for problem of fields in comment.
            //  const comments = this.scanner.scanComments() || [];
            //     if (this.scanner.trackComment) {
            //             let value = '';
            //             let bufferEntry = {};
            //             comments.forEach((eachComment) => {
            //                 if (eachComment.type === TOKENS.NEW_LINE) {
            //                     this.buffer.push(eachComment);
            //                 } else if (eachComment) {
            //                 value = this.scanner.sourceCode.slice(
            //                     eachComment.range[0],
            //                     eachComment.range[1],
            //                 );
            //                 // if (eachComment.isMultiLine) {
            //                 //     const separatedToken = splitBlockCommentIntoSeparateLine(eachComment, value, this.trackRange, this.trackLocation);
            //                 //     this.buffer.push(...(separatedToken || []));
            //                 // } else {
            //                     bufferEntry = {
            //                         type: TOKENS.LINE_COMMENT,
            //                         value: value,
            //                     };
            //                     if (this.trackRange) bufferEntry.range = eachComment.range;

            //                     if (this.trackLocation) bufferEntry.location = eachComment.location;
            //                     this.buffer.push(bufferEntry);
            //                 // }
            //              }
            //             });
            //     }

            if (!this.scanner.eof()) {
                let location = null;
                if (this.trackLocation) {
                  location = {
                      start: {
                          line: this.scanner.lineNumber,
                          column: this.scanner.currentIdk - this.scanner.lineStart,
                      },
                      end: {},
                  };
                }

                const tokens = [this.scanner.lexicalAnalysis()].flat();
            // Commenting the below, because currently we are not using field auto suggestion
                // let isIdentifierTigger = false;
                // if (cursorPointerPosition > -1) {
                //    if (
                //        token.end === cursorPointerPosition &&
                //        token.value &&
                //        typeof token.value === 'string' &&
                //        token.value.startsWith(FIELD.PREFIX)
                //     ) {
                //            isIdentifierTigger = true;
                //    }
                // }
               // this.reader.push(token);
               tokens.forEach((token) => {
                const entry = {
                    type: token.type,
                    value: getTokenValue(
                        token,
                        this.scanner.sourceCode,
                        this.scanner.allFields,
                     ),
                    // ...(isIdentifierTigger ? {
                    //     enableFieldPopper: true,
                    //     searchText: this.scanner.sourceCode.slice((token.start + FIELD.PREFIX.length), token.end),
                    //  } : {}),
                };

                if (token.uuid) {
                    entry.uuid = token.uuid;
                }

            // comment below code , because we dont want errors from client side now.
                // if (token.error) {
                //     entry.error = token.error;
                // }

                if (this.trackRange) {
                    entry.range = [token.start, token.end];
                    entry.ufRange = [token.ufStart, token.ufEnd];
                }

                if (this.trackLocation && !entry.location) {
                    location.end = {
                        line: this.scanner.lineNumber,
                        column: this.scanner.currentIdk - this.scanner.lineStart,
                    };
                    entry.location = location;
                }
                this.buffer.push(entry);
            });
            }
        }
        return this.buffer.shift();
   };
}

export const tokenizerOptionList = {
    range: true,
    comment: true,
    isLineSeparatedArray: true,
    allFunctionProperty: SAMPLE_DATA.ALL_FUNCTIONS,
    allFields: SAMPLE_DATA.ALL_FIELDS,
};

 export const tokenizer = (
    code,
    options = tokenizerOptionList,
    cursorPointerPosition = -1,
   ) => {
    options = getModifiedOptions(options);
    const tokenize = new Tokenizer(code, options);

   const errorList = get(options, 'errorList', []);
   let tokens = [];
   let token = null;
   do {
       token = tokenize.getNextToken(cursorPointerPosition || -1);
       if (!isEmpty(token) && !isEmpty(errorList)) {
           const tokenStart = token.location.start;
           const tokenEnd = token.location.end;
           if (
               get(errorList, [`${tokenStart.line},${tokenStart.column}`], false) ||
               get(errorList, [`${tokenStart.line},${tokenStart.column + 1}`], false)
             ) {
               token.error = (get(errorList, [`${tokenStart.line},${tokenStart.column}`], EMPTY_STRING) ||
               get(errorList, [`${tokenStart.line},${tokenStart.column + 1}`], EMPTY_STRING));
           } else if (
               get(errorList, [`${tokenEnd.line},${tokenEnd.column}`], false) ||
               get(errorList, [`${tokenEnd.line},${tokenEnd.column + 1}`], false)
               ) {
               token.error = (get(errorList, [`${tokenEnd.line},${tokenEnd.column}`], EMPTY_STRING) ||
               get(errorList, [`${tokenEnd.line},${tokenEnd.column + 1}`], EMPTY_STRING));
           }
       }
       if (!token) break;
       if (options.isLineSeparatedArray) tokens = separateTokenBasedOnLines(token, tokens);
         else tokens.push(token);
   } while (token);

   return tokens;
};
