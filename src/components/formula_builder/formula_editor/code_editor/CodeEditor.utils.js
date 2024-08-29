import React from 'react';
import cx from 'classnames';
import js_beautify from 'js-beautify';

import { BS } from 'utils/UIConstants';
import * as ReactDOMServer from 'react-dom/server';
import { FIELD, NON_PRINTABLE_KEYS, STRING_LITERAL, TOKENS } from 'components/formula_builder/formula_tokenizer_utils/constants';
import { encodeField, replaceNonBreakCharacterToEmpty, UUID_REEGEX } from 'components/formula_builder/formula_tokenizer_utils/formulaBuilder.utils';
import { EMPTY_STRING, SPACE } from 'utils/strings/CommonStrings';
import { FORMULA_BUILDER, FORMULA_TAB_TITLE } from 'components/formula_builder/FormulaBuilder.strings';
import { isEmpty, get } from '../../../../utils/jsUtility';
import codeThemeStyles from './CodeTheme.module.scss';
import styles from '../FormulaEditor.module.scss';
import { tokenizer, tokenizerOptionList } from '../../formula_tokenizer_utils/tokenizer';

export const formatCodeWithZeroWidthNonBreakSpace = (code) => {
  let modifiedCode = code;
    if ((replaceNonBreakCharacterToEmpty(code) || EMPTY_STRING).length > 0) {
        const allFieldUuidMatch = modifiedCode.match(UUID_REEGEX) || [];
        let trackPosition = 0;
         if (allFieldUuidMatch && !isEmpty(allFieldUuidMatch)) {
          allFieldUuidMatch.forEach((each_match) => {
              trackPosition = modifiedCode.indexOf(each_match, trackPosition) + each_match.length;
              if (modifiedCode.charCodeAt(trackPosition) !== FIELD.ZERO_WIDTH_NO_BREAK_SPACE) {
                modifiedCode = modifiedCode.slice(0, trackPosition) + String.fromCharCode(FIELD.ZERO_WIDTH_NO_BREAK_SPACE) + modifiedCode.slice(trackPosition);
              }
          });
        }
      }
  return modifiedCode;
};

// Helps to format(Beautify) the code.
export const beautifyFormula = (code, t) => {
  let formattedCode = js_beautify(code, {
    ...FORMULA_BUILDER(t).CODE_FORMATTER_CONFIG,
  });
  formattedCode = formatCodeWithZeroWidthNonBreakSpace(formattedCode);
  return formattedCode;
};

// function helps to set the caret position to the given position.
export function setCaretPosition(elemId, caretPos) {
  const elem = document.getElementById(elemId);
  if (elem != null) {
    if (elem.createTextRange) {
      const range = elem.createTextRange();
        range.move('character', caretPos);
        range.select();
    } else {
        if (elem.selectionStart) {
            elem.focus();
            elem.setSelectionRange(caretPos, caretPos);
        } else elem.focus();
    }
  }
}

// function helps to get the caret position.
export function getCaretCharacterOffsetWithin(element) {
  let caretOffset = 0;
  const doc = element.ownerDocument || element.document;
  const win = doc.defaultView || doc.parentWindow;
  let sel;
  let lineNumber;
  if (typeof win.getSelection !== 'undefined') {
      sel = win.getSelection();
      if (sel.focusNode.innerText === '\n') {
        const lineId = sel.focusNode.parentNode.id;
        lineNumber = Number(lineId);
      } else if (sel.focusNode.innerText === '') {
        const dataAttributeSelf = sel.focusNode.getAttribute('data-line');
        lineNumber = Number(dataAttributeSelf) + 1;
      } else {
        if (sel.focusNode.parentNode) {
          const dataAttribute = sel.focusNode.parentNode.getAttribute('data-line');
          lineNumber = Number(dataAttribute) + 1;
        }
      }
      if (sel.rangeCount > 0) {
          const range = win.getSelection().getRangeAt(0);
          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(element);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          caretOffset = preCaretRange.toString().length;
      }
  } else if ((sel === doc.selection) && sel.type !== 'Control') {
      if (sel.focusNode.innerText === '\n') {
        const lineId = sel.focusNode.parentNode.id;
        lineNumber = Number(lineId);
      } else {
        if (sel.focusNode.parentNode) {
          const dataAttribute = sel.focusNode.parentNode.getAttribute('data-line');
          lineNumber = Number(dataAttribute) + 1;
        }
      }
      const textRange = sel.createRange();
      const preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint('EndToEnd', textRange);
      caretOffset = preCaretTextRange.text.length;
  }
  return { currentPosition: caretOffset, currentLine: lineNumber };
}

// function helps to get the length of the code with line feed.
const getActualPositionWithLineFeed = (str, position) => {
  let countWithNewLine = 0; let countWithoutNewLine = 0; let lineFeedCount = 0;
 for (let ch = 0; position > countWithoutNewLine; ch++) {
      if (str.charAt(ch) === '\n') {
         lineFeedCount++;
     }
      if (str.charAt(ch) !== '\n') {
         countWithoutNewLine++;
     }
     countWithNewLine++;
 }

 return { countWithNewLine, lineFeedCount };
};

// function helps to insert field and fucntion in code editor.
export function insertFieldOrFunction(code, positionWithoutLineFeed, insertText, currentLineNumber) {
 const { countWithNewLine } = getActualPositionWithLineFeed(code, positionWithoutLineFeed);
 let insertedCode = '';
 if (currentLineNumber < 1) currentLineNumber = 1;
 const actualIdk = countWithNewLine;
  const allLineData = code.split('\n');

  if (!allLineData[currentLineNumber - 1] && currentLineNumber > 0) {
      allLineData[currentLineNumber - 1] = insertText;
      insertedCode = allLineData.join('\n');
  } else {
    if ((!code) && actualIdk <= 0) {
      insertedCode = insertText;
    } else {
      insertedCode = code.slice(0, actualIdk) + insertText + code.slice(actualIdk);
    }
  }
  // position: countWithNewLine + insertText.length,
return { insertedCode: insertedCode, currentLineNumber };
}

// function helps to find technical code character position in compare with user code.
export const findTechnicalCodeCaretPosition = (tokens, position = 0) => {
  let technicalCodeCount = 0;
  let userCodeCount = 0;
  let currentTokenIndex = 0;
  tokens = tokens.map((eachToken) => {
    if (isEmpty(eachToken)) {
      return [{ type: TOKENS.PLAIN, value: String.fromCharCode(8204) }];
    }
    return eachToken;
  }).flat();
  for (let i = 0; i < tokens.length; i++) {
      if (userCodeCount < position) {
          userCodeCount += tokens[i].value.length;
          if (tokens[i].type === TOKENS.IDENTIFIER) {
              technicalCodeCount += tokens[i].uuid.length;
              technicalCodeCount += 3; // For f$ and $
          } else {
              technicalCodeCount += tokens[i].value.length;
          }
          currentTokenIndex++;
      } else {
          break;
      }
  }
  if (position !== userCodeCount) {
    if (position < userCodeCount) --currentTokenIndex;
    if (tokens[currentTokenIndex].type !== TOKENS.IDENTIFIER) {
      const remainingPosition = position - userCodeCount;
      technicalCodeCount += remainingPosition;
    }
}
  return { exactPosition: technicalCodeCount }; // position
};

// function to get code with field name
export const findCodeWithFieldName = (codeWithoutUuid, currentPosition, field, tabType) => {
  const name_structure = (tabType === FORMULA_TAB_TITLE.FIELDS) ? ` ${field.field_name}(Ref: ${field.reference_name}) ` : (tabType === FORMULA_TAB_TITLE.FUNCTION) ? ` ${field.expression} ` : field.value;
  const codeWithFieldNameArray = codeWithoutUuid.split('\n');
  let positionCalculate = 0;
  let mainCode = EMPTY_STRING;
  if (!isEmpty(codeWithoutUuid)) {
    codeWithFieldNameArray.forEach((codeWithFieldNameObject) => {
      const splittedCode = codeWithFieldNameObject.split('');
      splittedCode.forEach((splitCode) => {
        positionCalculate += 1;
        mainCode = mainCode.concat(splitCode);
        if (currentPosition === positionCalculate) {
          if (splitCode === SPACE) mainCode = mainCode.slice(0, -1);
          mainCode = mainCode.concat(name_structure);
          positionCalculate += name_structure.length;
        }
      });
      mainCode = mainCode.concat('\n');
    });
  } else {
    mainCode = mainCode.concat(name_structure);
    positionCalculate += name_structure.length;
  }
  return mainCode;
};

// function helps to find the exact position of the cursor in the user typed(without uuid)  code.
export const caret = (event) => {
  const range = window.getSelection().getRangeAt(0);
  const prefix = range.cloneRange();
  prefix.selectNodeContents(event.target);
  prefix.setEnd(range.endContainer, range.endOffset);
  return prefix.toString().length;
};

// function helps tp set the cursor in the position from the input
export const setCaret = (pos, parent) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const node of parent.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.length >= pos) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(node, pos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        return -1;
      } else {
        pos -= node.length;
      }
    } else {
      pos = setCaret(pos, node);
      if (pos < 0) {
        return pos;
      }
    }
  }
  return pos;
};

const lineEndCaretArray = (code) => {
    const splitCode = code.split('\n');
    const charArray = [];
    let addedLength = 0;
    splitCode && splitCode.forEach((eachData) => {
      addedLength += eachData.length;
      charArray.push(addedLength);
    });
    return charArray;
};

// function helps to construct the user typed(without uuid) code from technical(with uuid) code as a string from html node.
export const codeConstructor = (event, currentKeycode, currentLine, currentPosition, code) => {
  const { childNodes, outerText } = event.target;
  let textLine = EMPTY_STRING;
  let textSpan = EMPTY_STRING;
  let textSpanWithFieldName = EMPTY_STRING;
  let textLineWithFieldName = EMPTY_STRING;
  const currentPositionChanged = false;
  let ignoreEnter = false;
  let initialEnter = false;
  if (!isEmpty(childNodes)) {
    childNodes.forEach((divNode, divIndex) => {
      if (!isEmpty(divNode.childNodes)) {
        textSpan = EMPTY_STRING;
        textSpanWithFieldName = EMPTY_STRING;
        divNode.childNodes.forEach((spanNode, spanIndex) => {
          if (spanNode) {
            if (spanNode.nodeType !== Node.TEXT_NODE && spanNode.getAttribute('data-type') === TOKENS.IDENTIFIER) {
              textSpan = textSpan.concat(`${FIELD.PREFIX}${encodeField(spanNode.getAttribute('data-info'))}${FIELD.SUFFIX}`);
              textSpanWithFieldName = textSpanWithFieldName.concat(spanNode.textContent);
              if (divNode.childNodes[spanIndex + 1] && divNode.childNodes[spanIndex + 1].textContent.charCodeAt(0) !== FIELD.ZERO_WIDTH_NO_BREAK_SPACE) {
                textSpan += String.fromCharCode(FIELD.ZERO_WIDTH_NO_BREAK_SPACE);
                textLineWithFieldName += String.fromCharCode(FIELD.ZERO_WIDTH_NO_BREAK_SPACE);
              }
            } else if (spanNode.nodeType === Node.TEXT_NODE) {
              textSpan = textSpan.concat(spanNode.textContent);
              textSpanWithFieldName = textSpanWithFieldName.concat(spanNode.textContent);
            } else {
              if (spanNode.innerText !== '\n') {
                  textSpan = textSpan.concat(spanNode.innerText);
                  textSpanWithFieldName = textSpanWithFieldName.concat(spanNode.textContent);
              } else {
                if (spanNode.innerText === '\n') {
                  console.log('ifcheck', JSON.stringify(spanNode.innerText));
                }
              }
            }
          }
        });
        if (divNode.innerText !== '\n' && textSpan !== EMPTY_STRING & divIndex > 0) {
          textLine = textLine.concat(`\n${textSpan}`);
          textLineWithFieldName = textLineWithFieldName.concat(`\n${textSpanWithFieldName}`);
        } else {
          textLine = textLine.concat(textSpan);
          textLineWithFieldName = textLineWithFieldName.concat(textSpanWithFieldName);
        }
        if (currentKeycode === NON_PRINTABLE_KEYS.ENTER && divIndex === currentLine && lineEndCaretArray(code).includes(currentPosition) && !initialEnter) {
            textLine = textLine.concat('\n');
            textLineWithFieldName = textLineWithFieldName.concat('\n ');
            ignoreEnter = true;
        } else if (currentKeycode === NON_PRINTABLE_KEYS.ENTER && divIndex === currentLine && divIndex > 0 && !initialEnter) {
            const nWChar = String.fromCharCode(8204);
            const breakSplitOccurance = textLine.split('\n', currentLine).join('\n').length;
            const breakSplitWithField = textLineWithFieldName.split('\n', currentLine).join('\n').length;
            const finalTextWithFieldName = `${textLineWithFieldName.slice(0, breakSplitWithField + 1)}${nWChar}${textLineWithFieldName.slice(breakSplitWithField + 1, textLineWithFieldName.length)}`;
            const finalText = `${textLine.slice(0, breakSplitOccurance + 1)}${nWChar}${textLine.slice(breakSplitOccurance + 1, textLine.length)}`;
            textLine = finalText;
            textLineWithFieldName = finalTextWithFieldName;
        }
      }
      if (divNode.innerText === undefined) {
        textLine = textLine.concat(outerText);
        textLineWithFieldName = textLineWithFieldName.concat(outerText);
      }
      if (divIndex > 0 && isEmpty(divNode.childNodes)) {
        textLine = textLine.concat('\n');
        textLineWithFieldName = textLineWithFieldName.concat('\n');
      }
    });
    if (currentKeycode === NON_PRINTABLE_KEYS.BACKSPACE && lineEndCaretArray(code).includes(currentPosition - 1)) {
      const breakSplitOccurance = textLine.split('\n', currentLine - 1).join('\n').length;
      const breakSplitWithField = textLineWithFieldName.split('\n', currentLine - 1).join('\n').length;
      const finalTextWithFieldName = textLineWithFieldName.slice(0, breakSplitWithField) + textLineWithFieldName.slice(breakSplitWithField + 1, textLineWithFieldName.length);
      const finalText = textLine.slice(0, breakSplitOccurance) + textLine.slice(breakSplitOccurance + 1, textLine.length);
      if (breakSplitOccurance && finalText) {
        textLine = finalText;
        textLineWithFieldName = finalTextWithFieldName;
      }
    }
  }
  if (textLine === '\n') {
    const nWChar = String.fromCharCode(8204);
    textLine = textLine.concat(`${nWChar}\n`);
    textLineWithFieldName = textLineWithFieldName.concat(`${nWChar}\n`);
    initialEnter = true;
  }
  return { textLine: textLine, ignoreEnter: ignoreEnter, textLineWithFieldName: textLineWithFieldName, currentPositionChanged: currentPositionChanged, initialEnter: initialEnter };
};

// function helps to convert code(string) to HTML node.
export const getSpanBuild = (tokenData) => {
  const formulaBuilderArray = [];
  if (!isEmpty(tokenData)) {
    tokenData.forEach((lineData, indexLine) => {
      const lineDataArray = [];
      // if (indexLine > 0) {
      //   lineDataArray.push(<br />);
      // }
      if (!isEmpty(lineData)) {
        lineData.forEach((syntax, index) => (
          lineDataArray.push(
            <span
              data-line={indexLine}
              data-info={(syntax.type === TOKENS.IDENTIFIER ? syntax.uuid : (
                              syntax.type === TOKENS.KEYWORD ? syntax.value : null
                            )
                         )}
              data-type={syntax.type}
              data-error={syntax.error ? syntax.error : null}
              contentEditable={syntax.type === TOKENS.IDENTIFIER ? 'false' : 'true'}
              className={cx(
                codeThemeStyles.CursorAuto,
                codeThemeStyles[syntax.type],
                syntax.error ? codeThemeStyles.Error : EMPTY_STRING,
                BS.P_RELATIVE,
                codeThemeStyles.WhiteSpace,
                )}
              id={`syntax${indexLine}${index}`}
            >
              {syntax.value }
            </span>,
          )
        ));
      }
      formulaBuilderArray.push(<div data-line={indexLine} className={cx(BS.P_RELATIVE, styles.WholeLine)}>{!isEmpty(lineDataArray) ? lineDataArray : '<br>' }</div>);
    });
  const BuildDomElement = ReactDOMServer.renderToStaticMarkup(formulaBuilderArray);
  return BuildDomElement;
  }
  return EMPTY_STRING;
};

// A main function that helps to tokenize (i,e separate each sensible word perfectly ).
export const getAllToken = (code = EMPTY_STRING, errorList = [], lstFunctions = [], lstFields = []) => {
  const options = {
    ...tokenizerOptionList,
    allFunctionProperty: lstFunctions,
    allFields: lstFields || [],
    // location: true,
    // range: true,
    errorList: errorList,
  };
  code = formatCodeWithZeroWidthNonBreakSpace(code);
  const tokens = tokenizer(code, options);
  return tokens;
};

// A function find the x and y of the current caret position relative window.
export const getCaretCoordinates = () => {
  let x = 0;
  let y = 0;
  const isSupported = typeof window.getSelection !== 'undefined';
  if (isSupported) {
    const selection = window.getSelection();
    if (selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange();
      range.collapse(true);
      const rect = range.getClientRects()[0];
      if (rect) {
        x = rect.left;
        y = rect.top;
      }
    }
  }
  return { x, y };
};

export const codeEditorKeyDownHandler = (event, textRef = {}, tokenValues = [], currentPosition = null, currentLine = null, arrowKeyCallBack = null) => {
   const userFriendlyCode = textRef.current.textContent;
      if (!isEmpty(tokenValues) && currentPosition >= 0) {
            const line = currentLine - 1; // holds the current starts from 0.
            const lineNode = get(textRef, ['current', 'childNodes', line], {}); // holds the current line node.
            const lineChildNodes = get(lineNode, ['childNodes'], []); // holds all the tokenized child node present in the current line.
            const tokensInTheLine = get(tokenValues, [line], []); // holds all the tokens present in the current line with user friend code range.

            let caretTokenNodes = []; // holds the tokens between the caret
            let identifierNode = null; // holds the identifier node to remove
            let zeroWidthSpaceNode = null; // holds the zero width non breaker next to the identifer to remove.
            // Backspace
            if ((event.keyCode === NON_PRINTABLE_KEYS.BACKSPACE) ||
                (event.keyCode === NON_PRINTABLE_KEYS.ARROW_LEFT)) {
                if (userFriendlyCode.length > 0 && userFriendlyCode.length === currentPosition) {
                    identifierNode = get(lineChildNodes, [lineChildNodes.length - 2], null);
                    zeroWidthSpaceNode = get(lineChildNodes, [lineChildNodes.length - 1], null);
                  } else {
                      caretTokenNodes = [];
                      tokensInTheLine.forEach((token, tokenIndex) => {
                          if (currentPosition >= (token.ufRange[0] - line) && currentPosition <= (token.ufRange[1] - line)) {
                            caretTokenNodes.push(lineChildNodes[tokenIndex]);
                          }
                      },
                      );
                      const exactCaretNode = get(caretTokenNodes, [0], {});
                      identifierNode = exactCaretNode.previousSibling;
                      zeroWidthSpaceNode = exactCaretNode;
                  }
              }

           //  Delete(Window) / CTRL + D(Mac OS), the
            if (
                (event.keyCode === NON_PRINTABLE_KEYS.DELETE ||
                (event.ctrlKey && event.keyCode === STRING_LITERAL.CAP_D) ||
                (event.keyCode === NON_PRINTABLE_KEYS.ARROW_RIGHT)
                )
              ) {
                  caretTokenNodes = [];
                  tokensInTheLine.forEach((token, tokenIndex) => {
                      if (currentPosition >= (token.ufRange[0] - line) && currentPosition <= (token.ufRange[1] - line)) {
                        caretTokenNodes.push(lineChildNodes[tokenIndex]);
                      }
                  },
                  );
                  if (caretTokenNodes.length > 1) {
                    const exactCaretNode = get(caretTokenNodes, [caretTokenNodes.length - 1], {});
                    identifierNode = exactCaretNode;
                    zeroWidthSpaceNode = exactCaretNode.nextSibling;
                  }
              }

            // Remove if identifierNode and zeroWidthSpaceNode has value based the key action
            // Only on backspace and delete
            if (
              (event.keyCode === NON_PRINTABLE_KEYS.BACKSPACE) ||
              (event.keyCode === NON_PRINTABLE_KEYS.DELETE) ||
              (event.ctrlKey && event.keyCode === STRING_LITERAL.CAP_D)
             ) {
                if (identifierNode && zeroWidthSpaceNode) {
                  if ((zeroWidthSpaceNode.textContent.charCodeAt(0) === FIELD.ZERO_WIDTH_NO_BREAK_SPACE) &&
                        identifierNode.getAttribute('data-type') === TOKENS.IDENTIFIER) {
                        // identifierNode.remove();
                        if (event.keyCode === NON_PRINTABLE_KEYS.BACKSPACE) zeroWidthSpaceNode.remove();
                        else identifierNode.remove();
                  }
                  }
              }

              if (
                (event.keyCode === NON_PRINTABLE_KEYS.ARROW_LEFT) ||
                (event.keyCode === NON_PRINTABLE_KEYS.ARROW_RIGHT)
              ) {
                 if (
                    identifierNode &&
                    zeroWidthSpaceNode &&
                    (zeroWidthSpaceNode.textContent.charCodeAt(0) === FIELD.ZERO_WIDTH_NO_BREAK_SPACE) &&
                    (identifierNode.getAttribute('data-type') === TOKENS.IDENTIFIER)
                  ) {
                      let updatedPosition = currentPosition;

                      const total_length = (identifierNode.textContent.length + zeroWidthSpaceNode.textContent.length);
                      if (event.keyCode === NON_PRINTABLE_KEYS.ARROW_LEFT) updatedPosition -= total_length;
                      else if (event.keyCode === NON_PRINTABLE_KEYS.ARROW_RIGHT) updatedPosition += total_length;

                      if (updatedPosition >= 0 && arrowKeyCallBack && updatedPosition !== currentPosition) {
                        arrowKeyCallBack(updatedPosition);
                      }
                  }
                }
         }
};
