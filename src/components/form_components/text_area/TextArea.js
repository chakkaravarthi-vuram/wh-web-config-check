import React, { useEffect, useRef } from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';

import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import Tooltip from 'components/tooltip/Tooltip';
import { translate } from 'language/config';
import Label from '../label/Label';
import HelperMessage, { HELPER_MESSAGE_TYPE } from '../helper_message/HelperMessage';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './TextArea.module.scss';
import { BS } from '../../../utils/UIConstants';
import { ACTION_STRINGS, EMPTY_STRING, SPACE } from '../../../utils/strings/CommonStrings';
import POSTCOMMENTS from './TextArea.string';

function TextArea(props) {
  // setting message
  let text_area_message = '';
  let ariaError = false;
  const {
    errorMessage,
    message,
    id,
    label,
    isDataLoading,
    type,
    name,
    onBlurHandler,
    onClick,
    onChangeHandler,
    required,
    readOnly,
    onKey,
    onFocusHandler,
    autoFocus,
    onKeyDownHandler,
    placeholder,
    value,
    hideMessage,
    hideLabel,
    innerClass,
    isRequired,
    hideBorder,
    className,
    noSpellCheck,
    testId,
    disabled,
    helperTooltipMessage,
    helperToolTipId,
    instructionMessage,
    instructionClass,
    editIcon,
    deleteIcon,
    labelClass,
    isCreationField,
    rows,
    inputUserRef,
    retainInputHeight,
    fieldTypeInstruction,
    referenceName,
    labelStyles,
    initialHeight,
    ariaLabel,
    isAdhocCommentLable,
    onAdhocCommentClick,
    helperMessageRole,
    focusOnError,
    focusOnErrorRefresher,
    isOptional,
  } = props;
  // let textBorder = (isTable && isCreationField) ? styles.NoBorder : gClasses.InputBorder;
  let textBorder = gClasses.InputBorder;
  if (errorMessage) {
    text_area_message = errorMessage;
    ariaError = true;
    textBorder = gClasses.ErrorInputBorder;
  } else if (message) {
    text_area_message = message;
  }
  console.log('text area messagecdxeew', text_area_message);

  if (hideBorder) {
    textBorder = BS.BORDER_0;
  }
  // setting id for label and helper message
  const labelId = `${id}_label`;
  const messageId = `${id}_message`;
  const instructionId = `${id}_instruction`;
  let labelComponent = null;
  let messageComponent = null;
  if (!hideMessage) {
    messageComponent = (
      <HelperMessage
        message={text_area_message}
        type={HELPER_MESSAGE_TYPE.ERROR}
        id={messageId}
        className={cx(gClasses.ErrorMarginV1)}
        role={helperMessageRole}
      />
    );
  }
  if (!hideLabel) {
    labelComponent = (
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
        <div className={cx(BS.D_FLEX)}>
          <Label
            isDataLoading={isDataLoading}
            content={label}
            labelFor={id}
            id={labelId}
            isRequired={isRequired}
            message={helperTooltipMessage}
            toolTipId={helperToolTipId}
            labelFontClass={labelClass}
            formFieldBottomMargin
            labelStyles={labelStyles}
            hideLabelClass
          />
                 {
          isOptional && !isDataLoading &&
          <div className={cx(gClasses.FOne13GrayV98, gClasses.FontWeight400)}>
            (
              {translate('text_area_strings.optional')}
            )
          </div>
        }
        </div>
        {(fieldTypeInstruction || editIcon || deleteIcon) ? (
          <div className={cx(gClasses.CenterV, gClasses.Height24)}>
            {fieldTypeInstruction}
          </div>
        ) : null}
        {(isAdhocCommentLable &&
          <div
           className={cx(gClasses.FOne13BlueV39, gClasses.CursorPointer)}
           onClick={onAdhocCommentClick}
           tabIndex={0}
           onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onAdhocCommentClick}
           onMouseDown={onAdhocCommentClick}
           role="button"
           id={POSTCOMMENTS.ID}
          >
            {isAdhocCommentLable}
            <Tooltip id={POSTCOMMENTS.ID} content={POSTCOMMENTS.CONTENT} isCustomToolTip />
          </div>
         )
        }
      </div>
    );
  }

  const multilineTextarea = useRef(null);

  const onChange = (event) => {
    const refData = inputUserRef || multilineTextarea;
    refData.current.style.height = 'auto';
    refData.current.style.height = `${refData.current.scrollHeight}px`;
    onChangeHandler(event);
  };

  useEffect(() => {
    const refData = inputUserRef || multilineTextarea;
    if (refData && refData.current) {
      if (retainInputHeight) {
        refData.current.style.height = 'auto';
        refData.current.style.height = `${refData.current.scrollHeight}px`;
      } else if (initialHeight) {
        refData.current.style.height = `${initialHeight}px`;
      }
    }
  }, [retainInputHeight]);

    useEffect(() => {
    const refData = inputUserRef || multilineTextarea;
    if (errorMessage) {
      if (focusOnError) refData.current?.focus();
    }
  }, [errorMessage, focusOnError, focusOnErrorRefresher]);

  const ariaLabelledby = `${labelId}${hideMessage ? EMPTY_STRING : SPACE + messageId}${instructionMessage ? SPACE + instructionId : EMPTY_STRING}`;

  return (
    <div className={cx(className)}>
      {labelComponent}
      <div className={cx(styles.TextAreaWidth, isCreationField ? !instructionMessage && styles.TextAreaHeight : null)}>
        {isDataLoading ? (
          <Skeleton height="64px" />
        ) : (
          <textarea
            id={id}
            type={type}
            name={name}
            rows={rows}
            spellCheck={noSpellCheck ? false : null}
            value={value || EMPTY_STRING}
            onBlur={onBlurHandler}
            onClick={onClick}
            onChange={onChange}
            required={required}
            aria-required={required}
            aria-invalid={ariaError}
            readOnly={readOnly}
            onKeyPress={onKey}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
            onFocus={onFocusHandler}
            onKeyDown={onKeyDownHandler}
            autoComplete={ACTION_STRINGS.OFF}
            placeholder={placeholder}
            aria-labelledby={ariaLabelledby || null}
            data-test={testId}
            className={cx(
              gClasses.InputBorderRadius,
              gClasses.InputPadding,
              BS.W100,
              styles.TextArea,
              gClasses.FTwo13GrayV3,
              innerClass,
              { [gClasses.ErrorPlaceHolder]: errorMessage && hideMessage },
              { [gClasses.ReadOnlyBg]: readOnly },
              textBorder,
              gClasses.ScrollBar,
            )}
            tabIndex={disabled || readOnly ? -1 : 0}
            ref={inputUserRef || multilineTextarea}
            disabled={disabled}
            ui-auto={referenceName}
            aria-label={ariaLabel}
          />
        )}

        {instructionMessage && (
          <div
            id={instructionId}
            className={cx(
              gClasses.MT5,
              gClasses.Fone12GrayV4,
              gClasses.WordWrap,
              instructionClass,
            )}
          >
            {instructionMessage}
          </div>
        )}
        {messageComponent}
      </div>
    </div>
  );
}
export default TextArea;
TextArea.propTypes = {
  errorMessage: PropTypes.string,
  message: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  isDataLoading: PropTypes.bool,
  type: PropTypes.string,
  name: PropTypes.string,
  onBlurHandler: PropTypes.func,
  onClick: PropTypes.func,
  onChangeHandler: PropTypes.func,
  onKeyDownHandler: PropTypes.func,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  onKey: PropTypes.func,
  autoFocus: PropTypes.bool,
  onFocusHandler: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  hideMessage: PropTypes.bool,
  hideLabel: PropTypes.bool,
  innerClass: PropTypes.string,
  isRequired: PropTypes.bool,
  hideBorder: PropTypes.bool,
  className: PropTypes.string,
  testId: PropTypes.string,
  editIcon: PropTypes.element,
  deleteIcon: PropTypes.element,
  labelClass: PropTypes.element,
  isAdhocCommentLable: PropTypes.bool,
  onMouseDownHandler: PropTypes.func,
};

TextArea.defaultProps = {
  errorMessage: EMPTY_STRING,
  message: EMPTY_STRING,
  id: null,
  label: EMPTY_STRING,
  autoFocus: false,
  isDataLoading: false,
  type: EMPTY_STRING,
  name: EMPTY_STRING,
  onBlurHandler: null,
  onClick: null,
  onChangeHandler: null,
  onKeyDownHandler: null,
  onFocusHandler: null,
  required: false,
  readOnly: false,
  onKey: null,
  placeholder: EMPTY_STRING,
  value: EMPTY_STRING,
  hideMessage: false,
  hideLabel: false,
  innerClass: EMPTY_STRING,
  isRequired: false,
  hideBorder: false,
  className: EMPTY_STRING,
  testId: EMPTY_STRING,
  editIcon: null,
  deleteIcon: null,
  labelClass: null,
  isAdhocCommentLable: false,
};
