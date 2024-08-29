import { find } from '../../../utils/jsUtility';
import { isBinaryDigit, isDecimalDigit, isHexDigit, isLineTerminator, isOctalDigit, isProgrammaticIdentifierPart, isProgrammaticIdentifierStart, isWhiteSpace } from './character';
import { LINE_TERMINATOR, ERROR_MESSAGE, PUNCTUATORS, TOKENS, STRING_LITERAL, FIELD } from './constants';
import { constructFieldDisplayValue, encodeField, UUID_REEGEX } from './formulaBuilder.utils';
// COMMENTING_CHARACTER,
export default class Scanner {
    constructor(code = '', extraParam) {
      this.sourceCode = code;
      this.length = code.length;
      // Has the current index with field uuid(instead of field value) included
      this.currentIdk = 0;
      // Has the current Index with field value (not the uuid).
      this.currentUserFriendlyCodeIdk = 0;

      this.allFunctionProperty = [];
      this.allFields = [];
      this.showError = extraParam?.showError || false;

      // Helps to know about code line number and content start
      this.lineNumber = (code.length > 0) ? 1 : 0;
      this.lineStart = 0;
      this.curlyStack = [];
    }

    eof = () => this.currentIdk >= this.length;

    isKeyword = (key) => {
        const isExist = this.allFunctionProperty.some((fn) => fn.name === key);
        return isExist;
    };

    // #skipSingleLineComment = (offset = 0) => {
    //      let comments = [];
    //      let commentStartIndex;
    //      let loc;
    //      const commentTerminator = () => {
    //         if (this.trackComment) {
    //             loc.end = {
    //                 line: this.lineNumber,
    //                 column: this.currentIdk - this.lineStart - 1,
    //             };
    //             // range - (avoidLineTermiantorCharacter) ? this.currentIdk -1 : this.currentIdk
    //             const entry = {
    //                 isMultiLine: false,
    //                 slice: [commentStartIndex + offset, this.currentIdk - 1],
    //                 range: [commentStartIndex, this.currentIdk],
    //                 location: loc,
    //             };
    //             comments.push(entry);
    //         }
    //         const newLine = this.#lineTerminator(false);
    //         comments.push(newLine);
    //         return comments;
    //      };

    //      if (this.trackComment) {
    //          comments = [];
    //          commentStartIndex = this.currentIdk - offset;
    //          loc = {
    //              start: {
    //                  line: this.lineNumber,
    //                  column: this.currentIdk - this.lineStart - offset,
    //              },
    //          };
    //      }

    //      while (!this.eof()) {
    //         const ch = this.sourceCode.charCodeAt(this.currentIdk);
    //         if (isLineTerminator(ch)) {
    //             return commentTerminator(true);
    //         }
    //         ++this.currentIdk;
    //      }
    //      return commentTerminator();
    // };

    // #skipMultipleLineComment = () => {
    //     let comments = [];
    //     let commentStartIndex;
    //     let loc;

    //     if (this.trackComment) {
    //         comments = [];
    //         commentStartIndex = this.currentIdk - 2;
    //         loc = {
    //             start: {
    //                 line: this.lineNumber,
    //                 column: this.currentIdk - this.lineStart,
    //             },
    //         };
    //     }
    //     while (!this.eof()) {
    //       const ch = this.sourceCode.charCodeAt(this.currentIdk);
    //       if (isLineTerminator(ch)) {
    //           if (ch === LINE_TERMINATOR.CARRIAGE_RETURN && this.sourceCode.charCodeAt(this.currentIdk + 1)) {
    //               ++this.currentIdk; // ++this.lineStart;
    //           }
    //           ++this.lineNumber;
    //           ++this.currentIdk;
    //           this.lineStart = this.currentIdk;
    //       } else if (ch === COMMENTING_CHARACTER.ASTERISK) {
    //           if (this.sourceCode.charCodeAt(this.currentIdk + 1) === COMMENTING_CHARACTER.FORWARD_SLASH) {
    //             this.currentIdk += 2;

    //             if (this.trackComment) {
    //                 loc.end = {
    //                     line: this.lineNumber,
    //                     column: this.currentIdk - this.lineStart,
    //                 };

    //                 const entry = {
    //                     isMultiLine: true,
    //                     slice: [commentStartIndex + 2, this.currentIdk - 2],
    //                     range: [commentStartIndex, this.currentIdk],
    //                     location: loc,
    //                 };
    //                 comments.push(entry);
    //              }
    //              return comments;
    //           }
    //           this.currentIdk++;
    //       } else {
    //           this.currentIdk++;
    //       }
    //     }
    //    // If entire file was commented.
    //     if (this.trackComment) {
    //         loc.end = {
    //             line: this.lineNumber,
    //             column: this.currentIdk - this.lineStart,
    //         };

    //         const entry = {
    //             isMultiLine: true,
    //             slice: [commentStartIndex + 2, this.currentIdk],
    //             range: [commentStartIndex, this.currentIdk],
    //             location: loc,
    //         };
    //         comments.push(entry);
    //     }
    //     // this.tolerateUnexpectedToken();
    //   return comments;
    // };

    #scanHexLiternal = (start, ufStart) => {
         let num = '';
         let errorMessage = '';
         while (!this.eof()) {
             if (!isHexDigit(this.sourceCode.charCodeAt(this.currentIdk))) {
                 break;
             }
             num += this.sourceCode[this.currentIdk++];
             this.currentUserFriendlyCodeIdk++;
         }

         if (num.length === 0 || isProgrammaticIdentifierStart(this.sourceCode.charCodeAt(this.currentIdk))) {
              // only 0x / 0X / identifer
            errorMessage = ERROR_MESSAGE.HEXADECIMAL_DIGIT_EXPECTED;
         }

         return {
             type: TOKENS.NUMERIC_LITERAL,
             value: errorMessage ? `0x${num}` : parseInt(`0x${num}`, 16),
             lineNumber: this.lineNumber,
             lineStart: this.lineStart,
             start: start,
             end: this.currentIdk,
             ufStart: ufStart,
             ufEnd: this.currentUserFriendlyCodeIdk,
             error: errorMessage,
         };
    };

    #scanOctalLiternal = (start, ufStart) => {
      let num = '';
      let errorMessage = '';
      while (!this.eof()) {
         if (isOctalDigit(this.sourceCode.charCodeAt(this.currentIdk))) {
             break;
         }

         num += this.sourceCode[this.currentIdk++];
         this.currentUserFriendlyCodeIdk++;
      }

      if (
          num.length === 0 ||
          isProgrammaticIdentifierStart(this.sourceCode.charCodeAt(this.currentIdk)) ||
          isDecimalDigit(this.sourceCode.charCodeAt(this.currentIdk))
        ) {
            // only 0o / 0O / identifer / decimal character
            errorMessage = ERROR_MESSAGE.OCTAL_DIGIT_EXPECTED;
        }

        return {
            type: TOKENS.NUMERIC_LITERAL,
            value: parseInt(num, 8),
            lineStart: this.lineStart,
            lineNumber: this.lineNumber,
            start: start,
            end: this.currentIdk,
            ufStart: ufStart,
            ufEnd: this.currentUserFriendlyCodeIdk,
            error: errorMessage,
        };
    };

    #scanBinaryLiternal = (start, ufStart) => {
      let num = '';
      let errorMessage = '';
      while (!this.eof()) {
          if (!isBinaryDigit(this.sourceCode[this.currentIdk])) {
              break;
          }
          num += this.sourceCode[this.currentIdk++];
          this.currentUserFriendlyCodeIdk++;
      }

      if (
          num.length === 0 ||
          isProgrammaticIdentifierStart(this.sourceCode.charCodeAt(this.currentIdk)) ||
          isDecimalDigit(this.sourceCode.charCodeAt(this.currentIdk))
        ) {
          // only 0b / 0B / identifer / decimal character
          errorMessage = ERROR_MESSAGE.BINARY_DIGIT_EXPECTED;
      }

      return {
          type: TOKENS.NUMERIC_LITERAL,
          value: errorMessage ? num : parseInt(num, 2),
          lineNumber: this.lineNumber,
          lineStart: this.lineStart,
          start: start,
          end: this.currentIdk,
          ufStart: ufStart,
          ufEnd: this.currentUserFriendlyCodeIdk,
          error: errorMessage,
      };
    };

    #getIdentifier = () => {
       const start = this.currentIdk++; // need to check increament
       this.currentUserFriendlyCodeIdk++;
       while (!this.eof()) {
           if (isProgrammaticIdentifierPart(this.sourceCode.charCodeAt(this.currentIdk))) {
            this.currentIdk++;
            this.currentUserFriendlyCodeIdk++;
           } else {
               break;
           }
       }
       return this.sourceCode.slice(start, this.currentIdk);
    };

    #lineTerminator = () => {
        const location = {
            start: {
                line: this.lineNumber,
                column: this.currentIdk - this.lineStart,
            },
        };

        const start = this.currentIdk;
        const userFriendlyCodeStart = this.currentUserFriendlyCodeIdk;

        const ch = this.sourceCode.charCodeAt(this.currentIdk);
        if (ch === LINE_TERMINATOR.CARRIAGE_RETURN &&
            this.sourceCode.charCodeAt(this.currentIdk + 1) === LINE_TERMINATOR.LINE_SEPARATOR) {
                this.currentIdk++;
                this.currentUserFriendlyCodeIdk++;
            }
        ++this.currentUserFriendlyCodeIdk;
        ++this.currentIdk;
        ++this.lineNumber;
        this.lineStart = this.currentIdk;

        location.end = {
            line: this.lineNumber,
            column: this.currentIdk - this.lineStart,
        };
        return {
            type: TOKENS.NEW_LINE,
            lineNumber: this.lineNumber - 1,
            lineStart: this.lineStart,
            location: location,
            start: start,
            end: this.currentIdk,
            ufStart: userFriendlyCodeStart,
            ufEnd: this.currentUserFriendlyCodeIdk,
        };
    };

    // For Empty Space
    scanWhiteSpace = (extractAsSeparateToken) => {
        if (extractAsSeparateToken) {
            let str = this.sourceCode[this.currentIdk];
            const start = this.currentIdk++;
            const userFriendlyCodeStart = this.currentUserFriendlyCodeIdk++;
            while (isWhiteSpace(this.sourceCode.charCodeAt(this.currentIdk))) {
                str += this.sourceCode[this.currentIdk];
                this.currentIdk++;
                this.currentUserFriendlyCodeIdk++;
            }

            return {
                type: TOKENS.PLAIN,
                value: str,
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: start,
                end: this.currentIdk,
                ufStart: userFriendlyCodeStart,
                ufEnd: this.currentUserFriendlyCodeIdk,
            };
        } else {
            this.currentIdk++;
            this.currentUserFriendlyCodeIdk++;
            return null;
        }
    };

    // For BlockComment and LineComment
    // scanComments = () => {
    //     let comments = [];

    //     if (this.trackComment) {
    //        comments = [];
    //     }
    //     while (!this.eof()) {
    //         let ch = this.sourceCode.charCodeAt(this.currentIdk);
    //         if (isLineTerminator(ch)) {
    //             const newLine = this.#lineTerminator();
    //             if (this.trackComment) {
    //              comments = comments.concat(newLine);
    //            }
    //         } else if (ch === COMMENTING_CHARACTER.FORWARD_SLASH) {
    //             ch = this.sourceCode.charCodeAt(this.currentIdk + 1);
    //             if (ch === COMMENTING_CHARACTER.FORWARD_SLASH) {
    //                 this.currentIdk += 2;
    //                 const comment = this.#skipSingleLineComment(2);
    //                 if (this.trackComment) {
    //                    comments = comments.concat(comment);
    //                 }
    //             } else {
    //                 break;
    //             }
    //             // else if (ch === COMMENTING_CHARACTER.ASTERISK) {
    //             //     this.currentIdk += 2;
    //             //     const comment = this.#skipMultipleLineComment();
    //             //     if (this.trackComment) {
    //             //         comments = comments.concat(comment);
    //             //     }
    //             // }
    //         } else {
    //             break;
    //         }
    //     }
    //     return comments;
    // };

    // For Punctuator
    scanPunctuator = () => {
        const {
            SINGLE_CHARACTER,
            TWO_CHARACTER,
            THREE_CHARACTER,
            FOUR_CHARACTER,
            BRACKETS,
            OTHERS,
        } = PUNCTUATORS;

        const start = this.currentIdk;
        const userFriendlyCodeStart = this.currentUserFriendlyCodeIdk;

        let str = this.sourceCode[start];
        let errorMessage = null;
        switch (str) {
            case BRACKETS.CURLY_BRACKET_LEFT:
                 this.curlyStack.push(BRACKETS.CURLY_BRACKET_LEFT);
                 this.currentIdk++;
                 this.currentUserFriendlyCodeIdk++;
                break;
            case OTHERS.DOT:
                ++this.currentIdk;
                ++this.currentUserFriendlyCodeIdk;
                // check whether the opertor is spread ...
               if (this.sourceCode[this.currentIdk] === OTHERS.DOT &&
                  this.sourceCode[this.currentIdk + 1] === OTHERS.DOT) {
                      this.currentIdk += 2;
                      this.currentUserFriendlyCodeIdk += 2;
                      str += OTHERS.SPREAD_OPERATOR;
                  }
                break;
            case BRACKETS.CURLY_BRACKET_RIGHT:
                ++this.currentIdk;
                ++this.currentUserFriendlyCodeIdk;
                this.curlyStack.pop();
                break;
            case BRACKETS.ANGLE_BRACKET_LEFT:
            case BRACKETS.ANGLE_BRACKET_RIGHT:
            case BRACKETS.SQUARE_BRACKET_LEFT:
            case BRACKETS.SQUARE_BRACKET_RIGHT:
            case OTHERS.SEMI_COLON:
            case OTHERS.COLON:
            case OTHERS.COMMA:
            case OTHERS.TILDE:
            case OTHERS.QUESTION_MARK:
                ++this.currentIdk;
                ++this.currentUserFriendlyCodeIdk;
                break;
            default:
                str = this.sourceCode.substring(this.currentIdk, this.currentIdk + 4);
                if (FOUR_CHARACTER.includes(str)) {
                    this.currentIdk += 4;
                    this.currentUserFriendlyCodeIdk += 4;
                } else {
                    str = str.slice(0, 3);
                    if (THREE_CHARACTER.includes(str)) {
                       this.currentIdk += 3;
                       this.currentUserFriendlyCodeIdk += 3;
                    } else {
                        str = str.slice(0, 2);
                        if (TWO_CHARACTER.includes(str)) {
                            this.currentIdk += 2;
                            this.currentUserFriendlyCodeIdk += 2;
                        } else {
                            str = str.slice(0, 1);
                            if (SINGLE_CHARACTER.includes(str)) {
                                this.currentIdk++;
                                this.currentUserFriendlyCodeIdk++;
                            } else {
                                this.currentIdk++;
                                this.currentUserFriendlyCodeIdk++;
                            }
                        }
                    }
                }
        }
        if (this.currentIdk === start) {
            errorMessage = ERROR_MESSAGE.SOMETHING_WENT_WRONG;
        }

        return {
            type: TOKENS.PUNCTUATOR,
            value: str,
            lineNumber: this.lineNumber,
            lineStart: this.lineStart,
            start: start,
            end: this.currentIdk,
            ufStart: userFriendlyCodeStart,
            ufEnd: this.currentUserFriendlyCodeIdk,
            ...(errorMessage ? { error: errorMessage } : {}),
        };
    };

    // For NumericLiteral
    scanNumericLiteral = () => {
       const start = this.currentIdk;
       const userFriendlyCodeStart = this.currentUserFriendlyCodeIdk;

       let ch = this.sourceCode[start];
       let num = '';
       let errorMessage = '';

        if (ch !== PUNCTUATORS.OTHERS.DOT) {
            num = this.sourceCode[this.currentIdk++];
            this.currentUserFriendlyCodeIdk++;
            ch = this.sourceCode[this.currentIdk];
           if (num === '0') {
             if (ch === 'x' || ch === 'X') {
                ++this.currentIdk;
                this.currentUserFriendlyCodeIdk++;
                return this.#scanHexLiternal(start, userFriendlyCodeStart);
             }
             if (ch === 'o' || ch === 'O') {
                ++this.currentIdk;
                this.currentUserFriendlyCodeIdk++;
                return this.#scanOctalLiternal(start, userFriendlyCodeStart);
             }
             if (ch === 'b' || ch === 'B') {
                ++this.currentIdk;
                this.currentUserFriendlyCodeIdk++;
                return this.#scanBinaryLiternal(start, userFriendlyCodeStart);
             }
           }
           while (isDecimalDigit(this.sourceCode.charCodeAt(this.currentIdk))) {
               num += this.sourceCode[this.currentIdk++];
               this.currentUserFriendlyCodeIdk++;
           }
           ch = this.sourceCode[this.currentIdk];
        }

        if (ch === PUNCTUATORS.OTHERS.DOT) {
            num += this.sourceCode[this.currentIdk++];
            this.currentUserFriendlyCodeIdk++;
             while (isDecimalDigit(this.sourceCode.charCodeAt(this.currentIdk))) {
                    num += this.sourceCode[this.currentIdk++];
                    this.currentUserFriendlyCodeIdk++;
              }
            ch = this.sourceCode[this.currentIdk];
        }

        if (ch === 'E' || ch === 'e') {
            num += this.sourceCode[this.currentIdk++];
            this.currentUserFriendlyCodeIdk++;
            ch = this.sourceCode[this.currentIdk];

            if (['+', '-'].includes(ch)) {
                num += this.sourceCode[this.currentIdk++];
                this.currentUserFriendlyCodeIdk++;
            }
            if (isDecimalDigit(this.sourceCode.charCodeAt(this.currentIdk))) {
                while (isDecimalDigit(this.sourceCode.charCodeAt(this.currentIdk))) {
                        num += this.sourceCode[this.currentIdk++];
                        this.currentUserFriendlyCodeIdk++;
                }
            } else {
                errorMessage = ERROR_MESSAGE.IDENTIFIER_CANNOT_IMMEDIATELY_FOLLOW_NUMBERIC;
                }
            }

       if (isProgrammaticIdentifierStart(this.sourceCode.charCodeAt(this.currentIdk))) {
        errorMessage = ERROR_MESSAGE.IDENTIFIER_CANNOT_IMMEDIATELY_FOLLOW_NUMBERIC;
       }

       return {
           type: TOKENS.NUMERIC_LITERAL,
           value: parseFloat(num),
           lineNumber: this.lineNumber,
           lineStart: this.lineStart,
           start: start,
           end: this.currentIdk,
           ufStart: userFriendlyCodeStart,
           ufEnd: this.currentUserFriendlyCodeIdk,
           error: errorMessage,
       };
    };

    // For StringLiteral
    scanStringLiteral = () => {
       const start = this.currentIdk;
       const userFriendlyCodeStart = this.currentUserFriendlyCodeIdk;

       let str = '';
       let errorMessage = '';
       const quote = this.sourceCode[this.currentIdk];
       while (!this.eof()) {
        let ch = this.sourceCode[++this.currentIdk];
        ++this.currentUserFriendlyCodeIdk;

        if (ch === quote) {
            str += ch;
            ++this.currentIdk;
            this.currentUserFriendlyCodeIdk++;
            break;
        } else if (ch === '\\') {
           ch = this.sourceCode[this.currentIdk + 1];
           if (!isLineTerminator(ch.charCodeAt(0))) {
               switch (ch) {
                   case 'n':
                       str += '\n';
                       break;
                   case 'r':
                       str += '\r';
                       break;
                   case 't':
                       str += '\t';
                       break;
                   case 'b':
                        str += '\b';
                        break;
                   case 'f':
                        str += '\f';
                        break;
                   case 'v':
                        str += '\v';
                        break;
                   default:
                        str += ch;
                        break;
               }
               this.currentIdk++;
               this.currentUserFriendlyCodeIdk++;
           }
        } else if (isLineTerminator(this.sourceCode.charCodeAt(this.currentIdk))) {
            break;
        }
       }

       if (quote !== '') {
           this.index = start;
           errorMessage = ERROR_MESSAGE.UNEXPECTED_TOKEN;
       }
      return {
          type: TOKENS.STRING_LITERAL,
          value: str,
          lineNumber: this.lineNumber,
          lineStart: this.lineStart,
          start: start,
          end: this.currentIdk,
          ufStart: userFriendlyCodeStart,
          ufEnd: this.currentUserFriendlyCodeIdk,
          error: errorMessage,
      };
    };

    // For Identifier - field
    scanIdentifier = () => {
      let type = null;
      const start = this.currentIdk;
      const userFriendlyCodeStart = this.currentUserFriendlyCodeIdk;
      const id = this.#getIdentifier();
      let errorMessage = null;
      let key_name = id;
      let field_uuid = null;

      if (
          id.length > 0 &&
          id.startsWith(FIELD.PREFIX) &&
          id.endsWith(FIELD.SUFFIX) &&
          (id.match(UUID_REEGEX) || []).length === 1
          ) {
          // Identifier
          type = TOKENS.IDENTIFIER;
          key_name = key_name.slice(FIELD.PREFIX.length, key_name.length - 1);
          const currentField = find(this.allFields, (field) => encodeField(field.field_uuid) === key_name);
          if (currentField === -1 || !currentField) {
              type = null;
          } else {
              key_name = constructFieldDisplayValue(currentField);
              field_uuid = currentField.field_uuid;
              this.currentUserFriendlyCodeIdk -= field_uuid.length + 3;
              this.currentUserFriendlyCodeIdk += key_name.length;
          }
      } else if (this.isKeyword(id)) {
          // Keyword
          type = TOKENS.KEYWORD;
      } else if (id === 'null') {
          // Null Literal
          type = TOKENS.NULL_LITERAL;
      } else if (['true', 'false'].includes(id)) {
         // Boolean Literal
         type = TOKENS.BOOLEAN_LITERAL;
      } else {
        let current_length = 0;
        let user_friendly_code_length = 0;
        const total_length = id.length;
        const local_tokens = [];
        const all_match = id.match(UUID_REEGEX);
        const all_match_length = (id.match(UUID_REEGEX) || []).length;

            if (all_match_length > 0) {
                all_match.forEach((each, idk) => {
                        const currentPositionIndex = id.indexOf(each);
                        if (!id.slice(current_length).startsWith(FIELD.PREFIX)) {
                            local_tokens.push({
                                type: TOKENS.PLAIN,
                                value: id.slice(current_length, currentPositionIndex),
                                start: start + current_length,
                                end: start + currentPositionIndex,
                                ufStart: userFriendlyCodeStart + current_length,
                                ufEnd: userFriendlyCodeStart + currentPositionIndex,
                                lineNumber: this.lineNumber,
                                lineStart: this.lineStart,
                            });

                            current_length += currentPositionIndex - current_length;
                            user_friendly_code_length += currentPositionIndex;
                        }

                        const uuid = id.slice(current_length + 2, current_length + each.length - 1);
                        const currentField = find(this.allFields, (field) => encodeField(field.field_uuid) === uuid);
                            if (currentField === -1 || !currentField) {
                                    local_tokens.push({
                                        type: TOKENS.PLAIN,
                                        uuid: uuid,
                                        value: FIELD.UNKNOWN_FIELD,
                                        start: start + current_length,
                                        end: start + current_length + each.length,
                                        ufStart: userFriendlyCodeStart + current_length,
                                        ufEnd: userFriendlyCodeStart + current_length + FIELD.UNKNOWN_FIELD.length,
                                        lineNumber: this.lineNumber,
                                        lineStart: this.lineStart,
                                    });
                                    user_friendly_code_length += FIELD.UNKNOWN_FIELD.length;
                                } else {
                                    const identifier_value = constructFieldDisplayValue(currentField);
                                    local_tokens.push({
                                        type: TOKENS.IDENTIFIER,
                                        uuid: currentField.field_uuid,
                                        value: identifier_value,
                                        start: start + current_length,
                                        end: start + current_length + each.length,
                                        ufStart: userFriendlyCodeStart + current_length,
                                        ufEnd: userFriendlyCodeStart + current_length + identifier_value.length,
                                        lineNumber: this.lineNumber,
                                        lineStart: this.lineStart,
                                    });
                                    user_friendly_code_length += identifier_value.length;
                                }

                        current_length += each.length;

                        if (idk === all_match_length - 1 && (current_length < total_length)) {
                            local_tokens.push({
                                type: TOKENS.PLAIN,
                                value: id.slice(current_length),
                                start: start + current_length,
                                end: start + total_length,
                                ufStart: userFriendlyCodeStart + user_friendly_code_length,
                                ufEnd: userFriendlyCodeStart + (total_length - current_length),
                                lineNumber: this.lineNumber,
                                lineStart: this.lineStart,
                            });
                           user_friendly_code_length += (total_length - current_length);
                        }
                    });
            }
            if (local_tokens.length > 0) {
                this.currentUserFriendlyCodeIdk -= total_length;
                this.currentUserFriendlyCodeIdk += user_friendly_code_length;
                return local_tokens;
            }
       }

    if (type === null) {
        type = TOKENS.PLAIN;
        errorMessage = ERROR_MESSAGE.UNEXPECTED_TOKEN;
    }

      return {
          type: type,
          value: key_name,
          lineNumber: this.lineNumber,
          lineStart: this.lineStart,
          start: start,
          end: this.currentIdk,
          ufStart: userFriendlyCodeStart,
          ufEnd: this.currentUserFriendlyCodeIdk,
          error: errorMessage,
          ...(field_uuid ? { uuid: field_uuid } : {}),
      };
    };

    // Main function to tokenize
    lexicalAnalysis = () => {
        if (this.eof()) {
            // EOF
            return {
                type: TOKENS.EOF,
                value: '',
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: this.currentIdk,
                end: this.currentIdk,
                ufStart: this.currentUserFriendlyCodeIdk,
                ufEnd: this.currentUserFriendlyCodeIdk,
            };
        }

      const cp = this.sourceCode.charCodeAt(this.currentIdk);
      if (isLineTerminator(cp)) return this.#lineTerminator();

      if (isWhiteSpace(cp)) {
      return this.scanWhiteSpace(true); // extractAsSeparateToken: true
      }

      if (isProgrammaticIdentifierStart(cp)) {
          return this.scanIdentifier();
      }

      if ([STRING_LITERAL.SINGLE_QUOTES, STRING_LITERAL.DOUBLE_QUOTES].includes(cp)) {
          return this.scanStringLiteral();
      }

      if (cp === STRING_LITERAL.DOT_HEXCODE) {
          if (isDecimalDigit(this.sourceCode.charCodeAt(this.currentIdk + 1))) {
              return this.scanNumericLiteral();
          }
          return this.scanPunctuator();
      }

      if (isDecimalDigit(this.sourceCode.charCodeAt(this.currentIdk))) {
        return this.scanNumericLiteral();
      }

      return this.scanPunctuator();
    };
}
