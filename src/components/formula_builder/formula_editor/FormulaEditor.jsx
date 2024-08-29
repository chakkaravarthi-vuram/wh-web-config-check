/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, useRef } from 'react';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearFormulaBuilderValues, setFormulaTokenChange } from 'redux/reducer/FormulaBuilderReducer';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { verifyExpressionThunk } from 'redux/actions/FormulaBuilder.Actions';
import { useTranslation } from 'react-i18next';
import ErrorWarnIcon from 'assets/icons/ErrorWarnIcon';
import { isEmpty, get, compact, isNull } from '../../../utils/jsUtility';
import CodeEditor from './code_editor/CodeEditor';
import styles from './FormulaEditor.module.scss';
import FormulaEditorTab from './formula_editor_tab/formulaEditorTabs';
import { FORMULA_BUILDER, FORMULA_BUILDER_OPERATORS, FORMULA_EXPRESSION_COMMON_STRINGS, FORMULA_TAB_TITLE } from '../FormulaBuilder.strings';
import { combineFieldsAndMetadata, getFormulaValidationData, replaceEncodeWithDecodedUUID, replaceNonBreakCharacterToEmpty } from '../formula_tokenizer_utils/formulaBuilder.utils';
import {
  getCaretCharacterOffsetWithin,
  insertFieldOrFunction,
  caret,
  setCaret,
  findTechnicalCodeCaretPosition,
  getSpanBuild,
  codeConstructor,
  getAllToken,
  beautifyFormula,
  findCodeWithFieldName,
  codeEditorKeyDownHandler,
   } from './code_editor/CodeEditor.utils';
import { NON_PRINTABLE_KEYS, NUMERIC_LITERAL, WHITE_SPACE } from '../formula_tokenizer_utils/constants';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import gClasses from '../../../scss/Typography.module.scss';
import Button, { BUTTON_TYPE } from '../../form_components/button/Button';
import ClearFormulaConfirmation from './clear_confirmation/ClearConfirmation';

function FormulaEditor(props) {
  const {
    modalId,
    tokenValue,
    currentFormulaTab,
    lstFields,
    lstFunctions,
    currentPosition,
    errorList,
    currentLine,
    refreshOnCodeChange,
    field_metadata = [],
    code,
    error,
    fieldsWithMetadata = [],

    setFormulaBuilderChange,
    onLoadMoreFields,
    onCodeChange,
    onErrorChange,
    codeWithoutUuid,
    setFieldsWithMetadata,
    dispatch,
    isClearTrigger,
    onClearOrBeautifyInitial,
    onButtonClick,
  } = props;
  const { t } = useTranslation();
  const [localValidationError, setLocalValidationError] = useState({
    message: null,
    type: null,
  });
  // Only for passing inside tokenizer .
  const [currentKeycode, setCurrentKeycode] = useState(null);

  // Only Arrow key handling
  const [updatedPosition, setUpdatedPosition] = useState(null);

  const textRef = React.useRef();
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const clearRef = useRef(null);

  useEffect(() => {
    if (!isEmpty(error) && error) {
         const errorMessage = error.input;
         setLocalValidationError({ message: errorMessage, type: FORMULA_BUILDER(t).VALIDATION.TYPE.SECONDARY });
    }
  }, [error]);

  const onValidation = (errorMessage = null, errorType = null) => {
      const { VALIDATION } = FORMULA_BUILDER(t);

      setLocalValidationError({
        message: errorMessage,
        type: errorType,
      });
      if (errorType === VALIDATION.TYPE.SECONDARY) {
         onErrorChange && onErrorChange(errorMessage);
      } else {
        onErrorChange && onErrorChange(null);
      }
  };

  useEffect(() => {
    combineFieldsAndMetadata(lstFields.pagination_data, field_metadata, setFieldsWithMetadata);
    }, [lstFields.pagination_data]);

  // Helps to convert code to sensible tokens.
  const onGetAllToken = (code, customError = null) => {
    const errors = customError || errorList;
    const tokens = getAllToken(
      code,
      errors,
      lstFunctions,
      fieldsWithMetadata,
    );
    return compact(tokens);
  };

  // Helps to update the updated code on DOM.
  const updateDOM = (el, tokenData) => {
    let getSpan = getSpanBuild(tokenData);
    getSpan = getSpan.replace(/&lt;br&gt;/gi, '&#8204;');
    el.innerHTML = getSpan;
  };

  // Helps to set the changed code and tokenize , then store tokenized code to redux
  const setCodeAndTokenize = (code) => {
    const tokenizedValue = onGetAllToken(code, errorList);
    setFormulaBuilderChange({
      tokenizedOutput: tokenizedValue,
      code: code,
    });
    updateDOM(textRef.current, tokenizedValue);
    setCaret(currentPosition, textRef.current);
  };

  useEffect(() => {
      setCodeAndTokenize(code);
  }, [refreshOnCodeChange]);

  // Helps to format(Beautify) the code.
  const onBeautifyHandler = () => {
    if (isEmpty(replaceNonBreakCharacterToEmpty(code))) return;
    const formattedCode = beautifyFormula(code, t);
    setCodeAndTokenize(formattedCode);
    onCodeChange && onCodeChange(formattedCode);
  };

  // Helps to change the code.
  const onChangeHandler = (event) => {
    const { textLine, ignoreEnter, textLineWithFieldName, currentPositionChanged, initialEnter } = codeConstructor(event, currentKeycode, currentLine, currentPosition, codeWithoutUuid);
    const tokenizedValue = onGetAllToken(textLine, {});
    setFormulaBuilderChange({
      tokenizedOutput: tokenizedValue,
      code: textLine,
      serverErrorList: [],
      codeWithoutUuid: textLineWithFieldName,
    });
    onCodeChange && onCodeChange(textLine);
    return { tokenizedValue: tokenizedValue, ignoreEnter: ignoreEnter, positionChangeTrigger: currentPositionChanged, initialEnter: initialEnter };
  };

  // Helps to set the field and function by clicking them from the bottom tab.
  const onClickTabContent = (tabData, type, detail = {}) => {
    const lengthBeforeFieldInsertion = get(textRef, ['current', 'textContent'], EMPTY_STRING);
    const insertedCodeWithoutUuid = findCodeWithFieldName(codeWithoutUuid, currentPosition, detail, type);
    const { exactPosition } = findTechnicalCodeCaretPosition(
      tokenValue,
      currentPosition,
    );
    const { insertedCode, currentLineNumber } = insertFieldOrFunction(
      code,
      exactPosition,
      tabData,
      currentLine,
    );
    const reduxUpdates = {
      code: insertedCode,
      codeWithoutUuid: insertedCodeWithoutUuid,
    };

    if ([FORMULA_TAB_TITLE.FIELDS, FORMULA_TAB_TITLE.FUNCTION, FORMULA_TAB_TITLE.MATH_SYMBOLS].includes(type)) {
        if (type === FORMULA_TAB_TITLE.FIELDS && !isEmpty(detail)) {
            const fieldMetadata = [...(field_metadata || []), detail];
            reduxUpdates.field_metadata = fieldMetadata;
            combineFieldsAndMetadata(lstFields.pagination_data, fieldMetadata, setFieldsWithMetadata);
            }
        const tokenizedValue = onGetAllToken(insertedCode);
        updateDOM(textRef.current, tokenizedValue);

        // this helps to avoid showing UUID inside the string literal, while continuous insertion of fields
        if (type === FORMULA_TAB_TITLE.FIELDS) {
          const { textLine, textLineWithFieldName } = codeConstructor(
            { target: textRef.current }, EMPTY_STRING, currentLine, currentPosition, codeWithoutUuid);
          reduxUpdates.code = textLine;
          reduxUpdates.codeWithoutUuid = textLineWithFieldName;
        }

        const newlyAddedStringLength = (get(textRef, ['current', 'textContent'], EMPTY_STRING).length - lengthBeforeFieldInsertion.length);
        reduxUpdates.tokenizedOutput = tokenizedValue;
        reduxUpdates.currentPosition = currentPosition + newlyAddedStringLength;
        reduxUpdates.currentLine = currentLineNumber;
    }
    onCodeChange && onCodeChange(reduxUpdates.code);
    setFormulaBuilderChange(reduxUpdates);
    setCaret(reduxUpdates.currentPosition, textRef.current);
  };

  // Helps to clear the formula
  const onClearFormula = () => {
    setFormulaBuilderChange({
      tokenizedOutput: [],
      code: EMPTY_STRING,
      codeWithoutUuid: EMPTY_STRING,
      serverErrorList: {},
      currentPosition: 0,
      currentLine: 1,
    });

    onCodeChange && onCodeChange(EMPTY_STRING);
    onValidation();
    updateDOM(textRef.current, []);
    setCaret(0, textRef.current);
  };

  useEffect(() => {
    if (isClearTrigger === FORMULA_EXPRESSION_COMMON_STRINGS(t).CLEAR) {
      onClearFormula();
      onClearOrBeautifyInitial();
    } else if (isClearTrigger === FORMULA_EXPRESSION_COMMON_STRINGS(t).BEAUTIFY) {
      onBeautifyHandler();
      onClearOrBeautifyInitial();
    }
  }, [isClearTrigger]);

  // Helps to evalute the formula.
  const onEvaluate = () => {
    const { VALIDATION } = FORMULA_BUILDER(t);
    const modifiedCode = replaceEncodeWithDecodedUUID(code);
    // const code_length = get(textRef, ['current', 'innerText'], EMPTY_STRING).length;
    const validationError = getFormulaValidationData(code);

    if (!validationError) {
        dispatch(verifyExpressionThunk(modifiedCode))
        .then((success) => {
          if (success) { onValidation(VALIDATION.LABEL.CORRECT_SYNTAX, VALIDATION.TYPE.PRIMARY); }
        })
        .catch((serverSyntaxError = []) => {
          if (!isEmpty(serverSyntaxError)) {
            const serverErrorMessage = get(Object.values(serverSyntaxError), [0], EMPTY_STRING);
            const message = serverErrorMessage ? `${VALIDATION.LABEL.INCORRECT_SYNTAX}: ${serverErrorMessage}` : VALIDATION.LABEL.INCORRECT_SYNTAX;
            onValidation(
              message,
              VALIDATION.TYPE.SECONDARY,
            );
          }
          const tokenizedValue = onGetAllToken(code, serverSyntaxError);
          setFormulaBuilderChange({ tokenizedOutput: tokenizedValue });
          updateDOM(textRef.current, tokenizedValue);
          setCaret(currentPosition, textRef.current);
        });
      } else {
          onValidation(validationError, VALIDATION.TYPE.SECONDARY);
      }
  };

  const onKeyDownHandler = (event) => {
    setCurrentKeycode(event.keyCode);
    codeEditorKeyDownHandler(
      event,
      textRef,
      tokenValue,
      currentPosition,
      currentLine,
      (updatedPosition) => {
        setUpdatedPosition(updatedPosition);
        setFormulaBuilderChange({ currentLine: updatedPosition });
      },
      );
  };

  const onInputHandler = (event) => {
    for (const node of Object.keys(event.target.children)) {
      event.target.children[node].id = Number(node) + 1;
    }
    const { tokenizedValue, positionChangeTrigger, initialEnter } = onChangeHandler(event);
    if (
      currentKeycode >= NUMERIC_LITERAL.ZERO ||
      [WHITE_SPACE.SPACE, NON_PRINTABLE_KEYS.ENTER, NON_PRINTABLE_KEYS.BACKSPACE, NON_PRINTABLE_KEYS.DELETE].includes(currentKeycode)
    ) {
      let cursorPosition = caret(event);
      updateDOM(event.target, tokenizedValue);
      if (currentKeycode === NON_PRINTABLE_KEYS.ENTER) {
        cursorPosition += 1;
      }
      if (initialEnter) cursorPosition += 1;
      // Trigger to alter the position based on the requirement
      if (positionChangeTrigger) {
        cursorPosition -= 1;
      }
      setCaret(cursorPosition, event.target);
    }
    onValidation();
    setFormulaBuilderChange(getCaretCharacterOffsetWithin(textRef.current));
  };

  const onKeyUpHandler = (event) => {
    if ([
      NON_PRINTABLE_KEYS.ARROW_LEFT,
      NON_PRINTABLE_KEYS.ARROW_RIGHT,
      ].includes(event.keyCode) && !isNull(updatedPosition)) {
        setCaret(updatedPosition, event.target);
        setUpdatedPosition(null);
      }
    if (
      [
      NON_PRINTABLE_KEYS.ARROW_LEFT,
      NON_PRINTABLE_KEYS.ARROW_RIGHT,
      NON_PRINTABLE_KEYS.ARROW_UP,
      NON_PRINTABLE_KEYS.ARROW_DOWN,
      ].includes(event.keyCode)) {
       setFormulaBuilderChange(getCaretCharacterOffsetWithin(textRef.current));
  }
};

  const onClickHandler = () => {
    // const sel = window.getSelection();
    // const range = sel.getRangeAt(0);
    // sel.selectNodeContents(textRef.current);
    // sel.setEnd(range.endContainer, range.endOffset);
    // return prefix.toString().length;
    // const content = sel.toString();
    setFormulaBuilderChange(getCaretCharacterOffsetWithin(textRef.current));
  };

  const onCopyHandler = (event) => {
    const selection = document.getSelection();
    event.clipboardData.setData('text/plain', selection.toString());
    event.preventDefault();
  };

  const getValidatedMessage = () => {
    if (!isEmpty(localValidationError) && localValidationError.message) {
      return (
        <div
          className={cx(
            gClasses.FTwo12,
            gClasses.FontWeight500,
            gClasses.MR15,
            localValidationError.type === FORMULA_BUILDER(t).VALIDATION.TYPE.PRIMARY ? styles.Correct : styles.Incorrect,
            BS.D_FLEX,
            styles.ErrorContainer,
            gClasses.MT8,
          )}
          role={ARIA_ROLES.ALERT}
        >
          {localValidationError.type !== FORMULA_BUILDER(t).VALIDATION.TYPE.PRIMARY && <ErrorWarnIcon ariaHidden className={gClasses.MR5} />}
          {localValidationError.message}
        </div>
      );
    }
    return (<div />);
  };

  return (
    <>
      <div className={BS.D_FLEX}>
        <div className={cx(styles.Container, gClasses.Flex1, BS.P_RELATIVE)}>
          <div
            className={cx(
              BS.D_FLEX,
              BS.JC_BETWEEN,
              BS.ALIGN_ITEM_CENTER,
              gClasses.PY8,
              gClasses.PX15,
              styles.Header,
            )}
          >
            <h3 className={styles.HeaderTitle}>{FORMULA_EXPRESSION_COMMON_STRINGS(t).FORMULA}</h3>
            <div>
              <button
                className={cx(styles.HeaderBtn, gClasses.MR10)}
                ref={clearRef}
                title={FORMULA_EXPRESSION_COMMON_STRINGS(t).CLEAR_TITLE}
                onClick={() => setIsCloseModalOpen(!isCloseModalOpen)}
              >
                {FORMULA_EXPRESSION_COMMON_STRINGS(t).CLEAR}
              </button>
              <ClearFormulaConfirmation
                referenceElement={clearRef.current}
                isPopperOpen={isCloseModalOpen}
                closeClearModal={() => setIsCloseModalOpen(false)}
                onClearClick={() => {
                  onButtonClick(FORMULA_EXPRESSION_COMMON_STRINGS(t).CLEAR);
                  setIsCloseModalOpen(false);
                }}
              />
              <button
                className={cx(styles.HeaderBtn)}
                onClick={() =>
                  onButtonClick(FORMULA_EXPRESSION_COMMON_STRINGS(t).BEAUTIFY)
                }
              >
                {FORMULA_EXPRESSION_COMMON_STRINGS(t).BEAUTIFY}
              </button>
            </div>
          </div>
          <CodeEditor
            defaultValue={tokenValue}
            textValue={code}
            ref={textRef}
            placeholder={FORMULA_BUILDER(t).ALL_PLACEHOLDER.ENTER_FORMULA_HERE}
            padding={15}
            style={{
              fontFamily:
                'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
              fontSize: 12,
            }}
            setFormulaBuilderChange={setFormulaBuilderChange}
            onInputHandler={onInputHandler}
            onClickHandler={onClickHandler}
            onKeyDownHandler={onKeyDownHandler}
            onClearFormula={onClearFormula}
            lstFunctions={lstFunctions}
            onKeyUpHandler={onKeyUpHandler}
            onCopyHandler={onCopyHandler}
          />
          <div className={styles.MathOperators}>
            {FORMULA_BUILDER_OPERATORS.map((individualOperator) => (
              <button
                key={individualOperator.id}
                className={styles.Operator}
                id={`tool${individualOperator.id}`}
                onClick={() =>
                  onClickTabContent(
                    individualOperator.value,
                    FORMULA_TAB_TITLE.MATH_SYMBOLS,
                    individualOperator,
                  )
                }
              >
                {individualOperator.ICON}
              </button>
            ))}
          </div>
          <Button
            buttonType={BUTTON_TYPE.OUTLINE_PRIMARY}
            className={cx(styles.EvaluateButton)}
            onClick={onEvaluate}
          >
            {FORMULA_BUILDER(t).ALL_LABELS.EVALUATE}
          </Button>
        </div>
        <FormulaEditorTab
          modalId={modalId}
          setFormulaBuilderChange={setFormulaBuilderChange}
          onClickTabContent={onClickTabContent}
          onEvaluate={onEvaluate}
          onClearFormula={onClearFormula}
          currentFormulaTab={currentFormulaTab}
          validationMessage={localValidationError}
          lstFields={lstFields}
          lstFunctions={lstFunctions}
          onLoadMoreFields={onLoadMoreFields}
        />
      </div>
      {getValidatedMessage()}
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFormulaBuilderChange: (value) => {
      dispatch(setFormulaTokenChange(value));
    },
    clearFormulaBuilderUpdatedValue: () => {
      dispatch(clearFormulaBuilderValues());
    },
    evaluate: (code) => {
      dispatch(verifyExpressionThunk(code));
    },
    dispatch,
  };
};

const mapStateToprops = (state) => {
  return {
    tokenValue: state.FormulaBuilderReducer.tokenizedOutput,
    currentLine: state.FormulaBuilderReducer.currentLine,
    currentFormulaTab: state.FormulaBuilderReducer.currentFormulaTab,
    lstFunctions: state.FormulaBuilderReducer.lstFunctions,
    lstFields: state.FormulaBuilderReducer.lstFields,
    errorList: state.FormulaBuilderReducer.serverErrorList,
    currentPosition: state.FormulaBuilderReducer.currentPosition,
    code: state.FormulaBuilderReducer.code,
    field_metadata: state.FormulaBuilderReducer.field_metadata,
    codeWithoutUuid: state.FormulaBuilderReducer.codeWithoutUuid,
  };
};

export default withRouter(
  connect(mapStateToprops, mapDispatchToProps)(FormulaEditor),
);
