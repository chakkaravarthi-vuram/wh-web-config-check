import React, { useRef } from 'react';
import cx from 'classnames';
import propTypes from 'prop-types';
import { ACTION_STRINGS, EMPTY_STRING, FALSE } from 'utils/strings/CommonStrings';
import Label from '../form_components/label/Label';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from '../form_components/helper_message/HelperMessage';
import gClasses from '../../scss/Typography.module.scss';
import styles from './CardExpiry.module.scss';

function CardExpiry(props) {
    const {
        className,
        label,
        id,
        labelId,
        errorMessage,
        isRequired,
        isDataLoading,
        helperToolTipId,
        labelClass,
        tooltipPlaceholder,
        hideLabel,
        labelMessage,
        inputContainerClasses,
        readOnlyPrefix,
        inputTextClasses,
        type,
        value,
        name,
        onBlurHandlerFunc,
        // onClick,
        onFocusHandler,
        onChangeHandler,
        onMouseDownHandler,
        onMouseOverHandler,
        onMouseOutHandler,
        onKeyDownHandler,
        onKeyPress,
        required,
        placeholder,
        ariaError,
        readOnly,
        onWheel,
        defaultChecked,
        messageId,
        inputUserRef,
        testId,
        inputStyle,
        size,
        disabled,
        instructionMessage,
        hideLabelAndMessage,
        hideMessage,
    } = props;
    const inputRef = useRef(null);
    const onChangeInternalHandler = (e) => {
        // const previousValue = value;
        const inputValue = e.target.value;
        let actualValue;
        // let val = e.target.value;
        const valArray = inputValue.split(' ').join('').split('');
        const valSpace = inputValue.split('');
        // console.log('gfagffw', actualValue, valSpace[valSpace.length], valSpace[valSpace.length - 1] === '/');
        // to work with backspace
        if (valSpace[valSpace.length - 1] === '/') {
            const valSpaceN = valSpace.slice(0, -2);
            console.log('gsdfggfds', valSpaceN);
            actualValue = valSpaceN.join('');
            onChangeHandler(actualValue);
            return;
        }
        // console.log('gfsaga', valArray.join('').replace(/\//g, ''));
        const replaceSlashAndCheck = valArray.join('').replace(/\//g, '');
        // console.log('gfsaga', isNan(valArray.join('')), isNaN(replaceSlashAndCheck));
        if (Number.isNaN(replaceSlashAndCheck)) return;
        if (valArray.length === 2) {
            actualValue = `${inputValue}/`;
        } else if (valArray.length <= 5) {
            actualValue = `${inputValue}`;
        } else {
            actualValue = value;
        }
        console.log('gafgsefg', inputValue, valArray, 'actualValue', actualValue);
        onChangeHandler(actualValue);
    };

    const onClickHandler = () => {
        inputRef.current.selectionStart = inputRef.current.value.length;
        inputRef.current.selectionEnd = inputRef.current.value.length;
    };

    return (
        <div className={cx(className)}>
            {hideLabel ? null : (
                <Label
                content={label}
                labelFor={id}
                id={labelId}
                error={errorMessage}
                message={labelMessage}
                isRequired={isRequired}
                isDataLoading={isDataLoading}
                toolTipId={helperToolTipId}
                labelFontClass={labelClass}
                placement={tooltipPlaceholder}
                hideLabelClass
                />
            )}
            <div className={cx(styles.InputContainerStyle, inputContainerClasses, errorMessage ? gClasses.ErrorInputBorder : styles.InputNormalBorder)}>
                {readOnlyPrefix ? (
                <span
                    className={cx(
                    styles.ReadOnlyPrefix,
                    styles.InputTextStyle,
                    gClasses.CenterV,
                    gClasses.MR10,
                    gClasses.FOne13BlackV1,
                    )}
                >
                    {readOnlyPrefix}
                </span>
                ) : null}

                <input
                className={cx(styles.InputTextStyle, inputTextClasses)}
                id={id}
                type={type}
                name={name}
                value={value}
                onBlur={onBlurHandlerFunc}
                onClick={onClickHandler}
                onChange={onChangeInternalHandler}
                onFocus={onFocusHandler}
                onMouseDown={onMouseDownHandler}
                onMouseOver={onMouseOverHandler}
                onMouseOut={onMouseOutHandler}
                onKeyDown={onKeyDownHandler}
                onKeyPress={onKeyPress}
                required={required}
                aria-required={required}
                aria-invalid={ariaError}
                readOnly={readOnly}
                autoComplete={ACTION_STRINGS.OFF}
                defaultChecked={defaultChecked}
                placeholder={placeholder}
                aria-labelledby={`${labelId} ${messageId}`}
                onWheel={onWheel}
                ref={inputUserRef || inputRef}
                spellCheck={FALSE}
                data-test={testId}
                style={inputStyle}
                // autoFocus={autoFocus}
                disabled={disabled}
                size={size}
                />
            </div>
            {instructionMessage && (
                <div className={cx(gClasses.FontStyleNormal, gClasses.MT5, gClasses.Fone12GrayV4, gClasses.WordWrap)}>
                    {instructionMessage}
                </div>
            )}
            {!(hideLabelAndMessage || hideMessage) ? (
                <HelperMessage
                    message={errorMessage}
                    type={HELPER_MESSAGE_TYPE.ERROR}
                    id={messageId}
                    className={gClasses.ErrorMarginV1}
                />
            ) : null}
        </div>
    );
}
export default CardExpiry;

CardExpiry.defaultProps = {
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
};

CardExpiry.propTypes = {
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
  };
