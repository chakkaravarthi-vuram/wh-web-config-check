import React, { useRef, useState, useEffect } from 'react';
import cx from 'classnames';
import Skeleton from 'react-loading-skeleton';
import propTypes from 'prop-types';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { EXLCUDING_NUMBER_CHARACTERS_INPUT_ALONE } from 'utils/Constants';
import Label from '../label/Label';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from '../helper_message/HelperMessage';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './Input.module.scss';
import INPUT_VARIANTS from './Input.strings';
import {
  EMPTY_STRING,
  ACTION_STRINGS,
  FALSE,
  SPACE,
} from '../../../utils/strings/CommonStrings';
import jsUtils from '../../../utils/jsUtility';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';

function Input(props) {
  // Ref using useRef hook
  const {
    inputDropdown,
    children,
    className,
    defaultChecked,
    errorMessage,
    hideBorder,
    hideLabel,
    hideMessage,
    icon,
    id,
    innerClass,
    // inputTextContainerStyle,
    inputVariant,
    isDataLoading,
    isRequired,
    label,
    labelMessage,
    message,
    name,
    onBlurHandler,
    onClick,
    onChangeHandler,
    onKeyDownHandler,
    onMouseDownHandler,
    onMouseOverHandler,
    onMouseOutHandler,
    onKeyPress,
    placeholder,
    readOnly,
    readOnlyPrefix,
    readOnlySuffix,
    required,
    testId,
    type,
    value,
    inputStyle,
    autoFocus,
    size,
    step,
    onFocusHandler,
    inputContainerClasses,
    inputTextClasses,
    readOnlySuffixStyle,
    readOnlySuffixClasses,
    disabled,
    onSetClick,
    helperTooltipMessage,
    helperToolTipId,
    instructionMessage,
    instructionClass,
    inputUserRef,
    editIcon,
    deleteIcon,
    labelClass,
    fieldTypeInstruction,
    tooltipPlaceholder,
    labelClassAdmin,
    referenceName,
    showIconNearToLabel,
    errorMessageClassName,
    tabIndex,
    focusOnError,
    focusOnErrorRefresher,
    readOnlySuffixAriaHidden,
    readOnlyPrefixAriaHidden,
    ariaLabelHelperMessage,
    helperAriaHidden,
    labelIdIfHideLabel,
    autoComplete,
    inputAriaLabelledBy,
    ariaLabelForLabel,
    ariaLabel,
    customInputPadding,
    isEnableDropdown,
    scannerIconPadding,
    isTable,
    inputContainerShortcutStyle,
    isEnableInputTooltip,
    isHideTitle,
  } = props;
  const inputRef = useRef(null);
  let inputPadding = null;
  let errorMargin = null;
  let modifiedValue = value;
  let inputTitle = EMPTY_STRING;

  if (jsUtils.isNull(modifiedValue)) modifiedValue = EMPTY_STRING;
  if (!isHideTitle) {
    inputTitle = isEnableInputTooltip ? modifiedValue : placeholder || value;
  }

  switch (inputVariant) {
    case INPUT_VARIANTS.TYPE_2:
      inputPadding = gClasses.InputPaddingV2;
      errorMargin = gClasses.ErrorMarginV2;
      break;
    case INPUT_VARIANTS.TYPE_3:
      inputPadding = gClasses.InputPaddingV3;
      // errorMargin = gClasses.ErrorMarginV2;
      errorMargin = gClasses.ErrorMarginV1;
      break;
    case INPUT_VARIANTS.TYPE_5:
      inputPadding = gClasses.InputPaddingV2;
      // errorMargin = gClasses.ErrorMarginV2;
      errorMargin = gClasses.ErrorMarginV1;
      break;
    case INPUT_VARIANTS.TYPE_4:
      inputPadding = gClasses.InputPaddingV4;
      // errorMargin = gClasses.ErrorMarginV2;
      errorMargin = gClasses.ErrorMarginV1;
      break;
      case INPUT_VARIANTS.TYPE_6:
        inputPadding = null;
        // errorMargin = gClasses.ErrorMarginV2;
        errorMargin = gClasses.ErrorMarginV1;
        break;
    default:
      inputPadding = gClasses.InputPaddingV1;
      errorMargin = gClasses.ErrorMarginV1;
      break;
  }
  const inputHideBorder = inputVariant === (INPUT_VARIANTS.TYPE_4 || INPUT_VARIANTS.TYPE_4) || hideBorder;
  console.log('inputHideBorder', inputHideBorder, placeholder, inputVariant, errorMessage);
  const inputContainerStyle = cx(
    inputDropdown ? styles.DefaultInputDropdownContainer :
      styles.DefaultInputContainer,
      inputContainerShortcutStyle,
    gClasses.CenterV,
    !customInputPadding ? inputPadding : customInputPadding,
    scannerIconPadding,
    {
      [gClasses.InputBorder]: !!(!errorMessage && !inputHideBorder && inputVariant !== INPUT_VARIANTS.TYPE_6),
      [gClasses.ErrorInputBorder]: !!(errorMessage && !inputHideBorder && inputVariant !== INPUT_VARIANTS.TYPE_6),
      [gClasses.ErrorInputUnderline]: (!jsUtils.isEmpty(errorMessage) && inputVariant === INPUT_VARIANTS.TYPE_6),
      [gClasses.ReadOnlyBg]: (!!readOnly) || disabled,
    },
  );
  console.log('inputHideBorder1', inputContainerStyle, placeholder, !!(errorMessage && inputVariant === INPUT_VARIANTS.TYPE_6));
  const inputTextStyle = cx(
    {
      [styles.DefaultInputStyle]: !!(!readOnlyPrefix && !readOnlySuffix),
      [styles.InputWithSuffixStyle]: !!(readOnlySuffix && !readOnlyPrefix),
      [gClasses.ErrorPlaceHolder]: errorMessage && hideMessage,
    },
    styles.InputTextStyle,
    inputTextClasses,
    !inputTextClasses && gClasses.FTwo13GrayV3,
    innerClass,
  );
  const [inputMessage, setInputMessage] = useState(EMPTY_STRING);
  const [ariaError, setAriaError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (autoFocus) {
            const ref = inputUserRef || inputRef;
            ref.current &&
            ref.current.focus();
          }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const ref = inputUserRef || inputRef;
    if (errorMessage) {
      setInputMessage(errorMessage);
      setAriaError(true);
      if (focusOnError) ref.current.focus();
    } else if (message) {
      setInputMessage(message);
    } else {
      setInputMessage(EMPTY_STRING);
      setAriaError(false);
    }

    if (focusOnError) {
      ref.current.focus();
    }
  }, [ariaError, inputMessage, errorMessage, focusOnError, focusOnErrorRefresher]);
  // setting message

  // setting id for label and helper message
  const labelId = (!hideLabel || isTable) ? (labelIdIfHideLabel || (id && `${id}_label`)) : EMPTY_STRING;
  const messageId = `${id}_message`;
  const helperMessageId = `${inputMessage && labelId ? SPACE + messageId : (inputMessage ? messageId : EMPTY_STRING)}`;
  const instructionId = `${id}_instruction`;
  const ariaLabelledby = inputAriaLabelledBy || `${labelId}${helperMessageId}${instructionMessage ? SPACE + instructionId : EMPTY_STRING}`;
  const hideLabelAndMessage = !onSetClick && (inputVariant === INPUT_VARIANTS.TYPE_2
    || inputVariant === INPUT_VARIANTS.TYPE_4);
  const inputHeight = inputVariant === INPUT_VARIANTS.TYPE_3 ? '44px' : '32px';
  let display;
  if (children && readOnlySuffix) {
    display = children;
  } else if (readOnlySuffix) {
    const onSetClickHandler = () => onSetClick && onSetClick(true);
    const clickableSpan = {};
    if (onSetClick) {
      clickableSpan.role = 'button';
      clickableSpan.onClick = onSetClickHandler;
      clickableSpan.onKeyDown = (e) => keydownOrKeypessEnterHandle(e) && onSetClickHandler();
      clickableSpan.tabIndex = 0;
    }
    display = (
      <span
        className={cx(styles.ReadOnlySuffix, gClasses.FOne13BlackV1, readOnlySuffixClasses)}
        style={readOnlySuffixStyle}
        aria-hidden={readOnlySuffixAriaHidden}
        onClick={onSetClickHandler}
        tabIndex={onSetClick ? '0' : '-1'}
        role="button"
        onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onSetClickHandler()}
        title={readOnlySuffix}
      >
        {readOnlySuffix}
      </span>
    );
  } else {
    display = null;
  }

  const onWheel = () => {
    if (!isEnableDropdown) {
    inputUserRef ? inputUserRef.current.blur() : inputRef.current.blur();
    }
  };
  const onBlurHandlerFunc = (event) => {
    const { type } = props;
    if (type === 'number') {
      if (!jsUtils.isEmpty(event.target.validationMessage)) {
        setInputMessage(event.target.validationMessage);
        setAriaError(true);
      } else if (errorMessage) {
        setInputMessage(errorMessage);
        setAriaError(true);
      } else if (message) {
        setInputMessage(message);
        setAriaError(false);
      } else {
        setInputMessage(EMPTY_STRING);
        setAriaError(false);
      }
      if (onBlurHandler) onBlurHandler(event);
    } else if (onBlurHandler) onBlurHandler(event);
  };

  // const onKeyDownHandlerFunc = (event) => {
  //   if (
  //     props.type === 'number'
  //     && (event.key === 'ArrowUp' || event.key === 'ArrowDown')
  //   ) event.preventDefault();
  //   else if (props.onKeyDownHandler) props.onKeyDownHandler(event);
  // };
  const onInputKeyDownHandler = (event) => {
    const { type } = props;
    if (type === 'number') {
      EXLCUDING_NUMBER_CHARACTERS_INPUT_ALONE.includes(event.key) && event.preventDefault();
    }
    onKeyDownHandler && onKeyDownHandler();
  };
  console.log('instruction', onSetClick, errorMessage, hideLabelAndMessage, hideMessage, inputMessage, hideLabelAndMessage || hideMessage || !inputMessage);
  return (
    <div className={cx(className, !(hideLabelAndMessage || hideMessage) && gClasses.MB12)}>

      {hideLabelAndMessage || hideLabel ? null : (
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
            <Label
              content={label}
              labelFor={id}
              id={labelId}
              error={errorMessage}
              message={labelMessage || helperTooltipMessage}
              isRequired={isRequired}
              isDataLoading={isDataLoading}
              toolTipId={helperToolTipId}
              ariaLabel={ariaLabelForLabel ? id : EMPTY_STRING}
              labelFontClass={labelClass}
              labelFontClassAdmin={labelClassAdmin}
              placement={tooltipPlaceholder}
              formFieldBottomMargin
              labelStyles={labelClass}
              hideLabelClass
            />
             { showIconNearToLabel ? icon || null :
              (fieldTypeInstruction || editIcon || deleteIcon) ? (
                <div className={cx(gClasses.CenterV, gClasses.Height24)}>
                    {fieldTypeInstruction}
                </div>
              ) : null
             }
          </div>
      )}
      {isDataLoading ? (
        <div>
          <Skeleton height={inputHeight} />
        </div>
      ) : (
        <>
          <div className={cx(inputContainerStyle, inputContainerClasses)}>
            {readOnlyPrefix ? (
              <span
                className={cx(
                  styles.ReadOnlyPrefix,
                  styles.InputTextStyle,
                  gClasses.CenterV,
                  gClasses.MR10,
                  gClasses.FOne13BlackV1,
                )}
                aria-hidden={readOnlyPrefixAriaHidden}
              >
                {readOnlyPrefix}
              </span>
            ) : null}

            <input
              className={inputTextStyle}
              id={id}
              type={type}
              name={name}
              value={modifiedValue}
              onBlur={onBlurHandlerFunc}
              onClick={onClick}
              onChange={onChangeHandler}
              onFocus={onFocusHandler}
              onMouseDown={onMouseDownHandler}
              onMouseOver={onMouseOverHandler}
              onMouseOut={onMouseOutHandler}
              onKeyDown={onInputKeyDownHandler}
              onKeyPress={onKeyPress}
              required={isRequired || required}
              aria-required={isRequired || required}
              aria-invalid={ariaError}
              readOnly={readOnly}
              autoComplete={autoComplete || ACTION_STRINGS.OFF}
              defaultChecked={defaultChecked}
              placeholder={placeholder}
              title={inputTitle}
              aria-labelledby={ariaLabelledby || null}
              aria-label={ariaLabel}
              onWheel={onWheel}
              ref={inputUserRef || inputRef}
              spellCheck={FALSE}
              data-test={testId}
              style={inputStyle}
              step={step}
              disabled={disabled}
              size={size}
              ui-auto={referenceName}
              tabIndex={disabled || readOnly ? -1 : tabIndex}
            />

            { showIconNearToLabel ? null : icon || null}
            {display}
          </div>
          {instructionMessage && (
          <div id={instructionId} className={cx(gClasses.FontStyleNormal, gClasses.MT5, gClasses.Fone12GrayV4, gClasses.WordWrap, instructionClass)}>
            {instructionMessage}
          </div>
          )}
        </>
      )}
      { !(hideLabelAndMessage || hideMessage || !inputMessage) ? (
        <HelperMessage
          message={inputMessage}
          type={HELPER_MESSAGE_TYPE.ERROR}
          id={messageId}
          className={cx(errorMargin, errorMessageClassName)}
          noMarginBottom
          ariaLabelHelperMessage={ariaLabelHelperMessage}
          ariaHidden={!helperAriaHidden}
          role={ARIA_ROLES.ALERT}
        />
      ) : null}
    </div>
  );
}
export default Input;
export { INPUT_VARIANTS };
Input.defaultProps = {
  inputVariant: null,
  children: null,
  type: null,
  errorMessage: EMPTY_STRING,
  readOnlyPrefix: EMPTY_STRING,
  readOnlySuffix: EMPTY_STRING,
  id: EMPTY_STRING,
  innerClass: EMPTY_STRING,
  label: EMPTY_STRING,
  name: EMPTY_STRING,
  value: EMPTY_STRING,
  placeholder: EMPTY_STRING,
  message: EMPTY_STRING,
  testId: EMPTY_STRING,
  className: EMPTY_STRING,
  labelMessage: EMPTY_STRING,
  defaultChecked: false,
  hideBorder: false,
  hideMessage: false,
  hideLabel: false,
  isRequired: false,
  isDataLoading: false,
  readOnly: false,
  required: false,
  onBlurHandler: null,
  onChangeHandler: null,
  onClick: null,
  onKeyDownHandler: null,
  onMouseDownHandler: null,
  inputStyle: {},
  icon: null,
  editIcon: null,
  deleteIcon: null,
  labelClass: null,
  showIconNearToLabel: false,
  ariaHidden: false,
  focusOnError: false,
  ariaLabelHelperMessage: EMPTY_STRING,
  helperAriaHidden: true,
  autoComplete: EMPTY_STRING,
  isEnableDropdown: false,
  isEnableInputTooltip: false,
};

Input.propTypes = {
  className: propTypes.string,
  children: propTypes.oneOfType([
    propTypes.arrayOf(propTypes.node),
    propTypes.node,
    propTypes.string,
  ]),
  inputVariant: propTypes.number,
  id: propTypes.string,
  innerClass: propTypes.string,
  label: propTypes.oneOfType([propTypes.string, propTypes.array]),
  labelMessage: propTypes.oneOfType([propTypes.string, propTypes.array]),
  placeholder: propTypes.string,
  errorMessage: propTypes.string,
  message: propTypes.string,
  name: propTypes.string,
  testId: propTypes.string,
  type: propTypes.string,
  value: propTypes.oneOfType([propTypes.string, propTypes.number]),
  defaultChecked: propTypes.bool,
  hideBorder: propTypes.bool,
  hideMessage: propTypes.bool,
  hideLabel: propTypes.bool,
  isDataLoading: propTypes.bool,
  isRequired: propTypes.bool,
  readOnly: propTypes.bool,
  required: propTypes.bool,
  readOnlyPrefix: propTypes.oneOfType([propTypes.string, propTypes.element]),
  readOnlySuffix: propTypes.oneOfType([propTypes.string, propTypes.element]),
  onBlurHandler: propTypes.func,
  onChangeHandler: propTypes.func,
  onClick: propTypes.func,
  onKeyDownHandler: propTypes.func,
  onMouseDownHandler: propTypes.func,
  inputStyle: propTypes.objectOf(propTypes.any),
  icon: propTypes.oneOfType([propTypes.string, propTypes.element]),
  editIcon: propTypes.element,
  deleteIcon: propTypes.element,
  labelClass: propTypes.element,
  showIconNearToLabel: propTypes.bool,
  ariaHidden: propTypes.bool,
  focusOnError: propTypes.bool,
  ariaLabelHelperMessage: propTypes.string,
  helperAriaHidden: propTypes.bool,
  autoComplete: propTypes.string,
  isEnableDropdown: propTypes.string,
  isEnableInputTooltip: propTypes.bool,
};
