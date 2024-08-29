import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import ThemeContext from '../../../hoc/ThemeContext';

import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from '../helper_message/HelperMessage';
import Label from '../label/Label';

import gClasses from '../../../scss/Typography.module.scss';
import styles from './RadioGroup.module.scss';

import { isEmpty, isUndefined, nullCheck } from '../../../utils/jsUtility';
import { EMPTY_STRING, SPACE } from '../../../utils/strings/CommonStrings';
import { ARIA_ROLES, BS, INPUT_TYPES } from '../../../utils/UIConstants';
import { hasOwn, joinWordsInString, keydownOrKeypessEnterHandle } from '../../../utils/UtilityFunctions';

export const RADIO_GROUP_TYPE = {
  TYPE_1: 1,
  TYPE_2: 2,
  TYPE_3: 3,
  TYPE_4: 4,
  TYPE_5: 5,
  TYPE_6: 6,
  TYPE_7: 7,
  TYPE_8: 8,
};
function RadioGroup(props) {
  const {
    label,
    errorMessage,
    message,
    id,
    type,
    optionList,
    innerClassName,
    name,
    required,
    selectedValue,
    readOnly,
    onClick,
    // defaultChecked,
    isDataLoading,
    hideMessage,
    isRequired,
    setBorder,
    justifyBetween,
    inline,
    className,
    hideLabel,
    helperTooltipMessage,
    helperToolTipId,
    instructionMessage,
    instructionClass,
    hideInstructionMessage,
    showNoDataFoundOption,
    noDataFoundOptionLabel,
    enableOptionDeselect,
    radioViewClassName,
    radioViewLabelClassName,
    renderElement,
    customClass,
    HelperClass,
    containerClass,
    radioLabelClass,
    editIcon,
    deleteIcon,
    radioButtonClasses,
    radioSelectedStyle,
    fieldTypeInstruction,
    referenceName,
    labelClassName,
    radioLabelStyle,
    radioOptionListLabelStyle,
    isGridViewClass,
    displayDeactivatedValue,
    radioInnerClass,
    radioLabelClasses,
    readOnlyField,
    helperMessageId,
    isTable,
    isAdditionalInfo,
    additionalInfo,
  } = props;
  console.log('radio selectedValue', selectedValue);
  const { buttonColor } = useContext(ThemeContext);
  const [deactivatedValue, setDeactivatedValue] = useState(null);
  const messageId = helperMessageId || `${id}_helper_message`;
  const labelId = (!hideLabel || isTable) ? (id ? `${id}_label` : null) : null;
  useEffect(() => {
    if (selectedValue && optionList) {
      let deactivated = null;
      const index = optionList.findIndex((option) => (option.value === selectedValue));
      if (index === -1) {
        deactivated = selectedValue;
      }
      setDeactivatedValue(deactivated);
    }
  }, []);
  const onClickHandler = (value, visbility) => {
    if (onClick && !readOnly && !(readOnlyField && (readOnlyField === value))) {
      if (enableOptionDeselect && !isRequired && value === selectedValue) {
        onClick(null, visbility);
      } else onClick(value, visbility);
    }
  };
  // setting message
  let ariaError = false;
  let radioMessage = EMPTY_STRING;
  if (errorMessage) {
    radioMessage = errorMessage;
    ariaError = true;
  } else if (message) {
    radioMessage = message;
  }
  // setting id for label and helper message
  let optionsContainerClass = null;
  switch (type) {
    case RADIO_GROUP_TYPE.TYPE_1:
      optionsContainerClass = cx(BS.D_FLEX, styles.OptionContainer);
      break;
    case RADIO_GROUP_TYPE.TYPE_2:
      optionsContainerClass = styles.OptionContainerType2;
      break;
    case RADIO_GROUP_TYPE.TYPE_3:
      optionsContainerClass = styles.OptionContainerType3;
      break;
    case RADIO_GROUP_TYPE.TYPE_4:
      optionsContainerClass = styles.OptionContainerType4;
      break;
    case RADIO_GROUP_TYPE.TYPE_5:
      optionsContainerClass = cx(BS.D_FLEX, styles.OptionContainerType5);
      break;
    case RADIO_GROUP_TYPE.TYPE_6:
      optionsContainerClass = cx(BS.D_FLEX, styles.OptionContainerType6);
      break;
    case RADIO_GROUP_TYPE.TYPE_7:
      optionsContainerClass = cx(BS.D_FLEX);
      break;
    case RADIO_GROUP_TYPE.TYPE_8:
      optionsContainerClass = styles.OptionContainerType8;
      break;
    default:
      optionsContainerClass = cx(
        BS.D_FLEX,
        styles.OptionContainer,
        customClass,
        containerClass,
      );
      break;
  }
  let radioOptionList = [];
  if (nullCheck(optionList, 'length', true)) {
    radioOptionList = optionList.map((option, index) => {
      console.log('option is', option, selectedValue, readOnlyField && (readOnlyField === option.value));
      let radioMockStyle = null;
      let innerRadioMockStyle = null;
      let labelTypography = gClasses.FTwo13GrayV53;
      if (option.value === selectedValue) {
        radioMockStyle = {
          borderColor: buttonColor,
        };
        innerRadioMockStyle = {
          backgroundColor: buttonColor,
        };

        labelTypography = gClasses.FTwo13GrayV3;
      }
      const radioId = `${id}_${((option.value === true || option.value === false) ? joinWordsInString(option.label) : (option.value ? option.value.toString() : option.value))}`;
      const optionId = `${label ? joinWordsInString(label) : joinWordsInString(option.label)}_${index}_label`;
      const ariaLabelledBy = `${index === 0 ? (labelId ? (labelId + SPACE) : EMPTY_STRING) : EMPTY_STRING}${radioMessage && messageId + SPACE}${optionId}`;
      const radioView = (
        <div
          className={cx(
            gClasses.CenterV,
            gClasses.MR30,
            // gClasses.MB10,
            styles.Option,
            styles.Border,
            gClasses.P3,
            hasOwn(option, 'isVisible') && !option.isVisible
              ? styles.HalfOpacity
              : styles.FullOpacity,
            radioViewClassName,
          )}
          key={option.value}
          // id={option.value ? option.value.toString() : option.value}
          role="presentation"
          style={
            setBorder
              ? {
                borderRadius: '6px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor:
                  option.value === selectedValue ? buttonColor : null,
                padding: '10px',
                marginRight: justifyBetween ? '0px' : null,
              }
              : null
          }
          title={option.label}
        >
          <input
            type={INPUT_TYPES.RADIO}
            name={radioId || name}
            value={option.value}
            required={required}
            aria-invalid={ariaError}
            readOnly={readOnly || (readOnlyField && (readOnlyField === option.value))}
            onChange={() => onClickHandler(option.value)}
            // defaultChecked={defaultChecked}
            checked={selectedValue === option.value}
            id={radioId}
            className={cx(styles.Radio, BS.P_ABSOLUTE)}
            disabled={!!(hasOwn(option, 'isVisible') && !option.isVisible)}
            onClick={() => onClickHandler(option.value, option.isVisible)}
            ui-auto={referenceName}
          />
          <div
            className={cx(
              radioButtonClasses,
              styles.RadioMock,
              gClasses.CenterVH,
              gClasses.FlexShrink0,
              {
                [styles.ReadOnly]: readOnly || (readOnlyField && (readOnlyField === option.value)),
              },
            )}
            style={radioMockStyle}
            role="radio"
            required={isRequired}
            aria-label={!radioMessage && option.label}
            aria-labelledby={ariaLabelledBy}
            aria-checked={selectedValue === option.value}
            tabIndex={(readOnly || (readOnlyField && (readOnlyField === option.value))) ? -1 : 0}
            onClick={() => onClickHandler(option.value, option.isVisible)}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClickHandler(option.value, option.isVisible)}
          >
            <div className={radioSelectedStyle} style={innerRadioMockStyle} />
          </div>
          <label
            key={option.value}
            // id={`${option.value}_label`}
            id={optionId}
            htmlFor={radioId}
            className={cx(
              labelTypography,
              BS.MB_0,
              gClasses.ML10,
              radioViewLabelClassName,
              radioOptionListLabelStyle,
              // gClasses.Ellipsis,
              gClasses.FontWeight400,
              customClass,
            )}
          >
            {option.label}
          </label>
        </div>
      );
      console.log('renderElement', renderElement, index);
      return (
        <React.Fragment key={`radio_group_${option.value}`}>
          {isDataLoading ? (
            <div className={cx(gClasses.CenterV, gClasses.MR30)}>
              <Skeleton height="18px" width="18px" circle />
              <div
                className={cx(
                  gClasses.MinHeight18,
                  gClasses.MinWidth100,
                  gClasses.ML5,
                )}
              >
                <Skeleton />
              </div>
            </div>
          ) : (
            <>
              {radioView}

              {hasOwn(option, 'children') && option.value === selectedValue && (
                <div className={BS.D_FLEX}>{option.children}</div>
              )}
              {option.value === selectedValue && !isUndefined(renderElement)
                ? renderElement[index]
                : null}
            </>
          )}
        </React.Fragment>
      );
    });
  } else if (showNoDataFoundOption) {
    radioOptionList = (
      <label
        htmlFor={id}
        className={cx(
          gClasses.FTwo13GrayV53,
          BS.MB_0,
          gClasses.ML5,
          gClasses.Ellipsis,
        )}
      >
        {noDataFoundOptionLabel || 'No values found'}
      </label>
    );
  }

  let innerContainerClass = null;
  let labelClass = labelClassName;
  if (inline) {
    innerContainerClass = BS.D_FLEX;
    labelClass = cx(BS.MB_0, gClasses.PR15);
  }
  const deactivatedValueInstruction = displayDeactivatedValue && deactivatedValue && (
    <div
      className={cx(
        gClasses.FontStyleNormal,
        gClasses.MT5,
        gClasses.FontSize,
        gClasses.Fone12GrayV4,
        gClasses.WordWrap,
      )}
    >
      {`Deactivated option (${deactivatedValue}) is selected`}
    </div>
  );
  return (
    <div role={ARIA_ROLES.GROUP} id={id} aria-labelledby={labelId} className={className}>
      <div className={innerContainerClass}>
        {!hideLabel ? (
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
            <Label
              role={ARIA_ROLES.GROUP}
              content={label}
              id={labelId}
              labelFor={id}
              isRequired={isRequired}
              className={cx(
                labelClass,
                type === RADIO_GROUP_TYPE.TYPE_3 && gClasses.MB10,
              )}
              isDataLoading={isDataLoading}
              message={helperTooltipMessage}
              toolTipId={helperToolTipId}
              labelFontClass={radioLabelClass}
              radioLabelStyle={radioLabelStyle}
              formFieldBottomMargin
              innerClassName={radioInnerClass}
              labelFontClassAdmin={radioLabelClasses}
              hideLabelClass
              isAdditionalInfo={isAdditionalInfo}
              additionalInfo={additionalInfo}
            />
            {fieldTypeInstruction || editIcon || deleteIcon ? (
              <div
                className={cx(gClasses.CenterV, gClasses.Height24)}
              >
                {fieldTypeInstruction}
              </div>
            ) : null}
          </div>
        ) : null}
        <div
          className={cx(
            !isGridViewClass && optionsContainerClass,
            innerClassName,
            justifyBetween ? BS.JC_BETWEEN : null,
            isGridViewClass && gClasses.FormFieldMultipleOption,
          )}
        >
          {radioOptionList}
        </div>
      </div>
      {hideInstructionMessage ? null : (
        <div
          className={cx(
            gClasses.FontStyleNormal,
            gClasses.MT5,
            gClasses.Fone12GrayV4,
            gClasses.WordWrap,
            instructionClass,
          )}
        >
          {instructionMessage}
        </div>
      )}
      {deactivatedValueInstruction}
      {hideMessage ? null : !isEmpty(radioMessage) && (
        <HelperMessage
          id={messageId}
          message={radioMessage}
          type={HELPER_MESSAGE_TYPE.ERROR}
          className={cx(gClasses.ErrorMarginV1, HelperClass)}
        />
      )}
    </div>
  );
}
export default RadioGroup;

RadioGroup.propTypes = {
  label: PropTypes.string,
  message: PropTypes.string,
  id: PropTypes.string,
  hideMessage: PropTypes.bool,
  errorMessage: PropTypes.string,
  type: PropTypes.number,
  optionList: PropTypes.arrayOf(PropTypes.any),
  name: PropTypes.string,
  required: PropTypes.bool,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  readOnly: PropTypes.bool,
  onClick: PropTypes.func,
  defaultChecked: PropTypes.bool,
  isDataLoading: PropTypes.bool,
  isRequired: PropTypes.bool,
  setBorder: PropTypes.bool,
  justifyBetween: PropTypes.bool,
  inline: PropTypes.bool,
  enableOptionDeselect: PropTypes.bool,
  customClass: PropTypes.string,
  HelperClass: PropTypes.string,
  containerClass: PropTypes.string,
  radioLabelClass: PropTypes.element,
  editIcon: PropTypes.element,
  deleteIcon: PropTypes.element,
  radioButtonClasses: PropTypes.element,
  radioSelectedStyle: PropTypes.element,
  isGridViewClass: PropTypes.bool,
  radioInnerClass: PropTypes.string,
  readOnlyField: PropTypes.string,
  isAdditionalInfo: PropTypes.bool,
  additionalInfo: PropTypes.string,
};

RadioGroup.defaultProps = {
  label: EMPTY_STRING,
  message: EMPTY_STRING,
  errorMessage: EMPTY_STRING,
  hideMessage: false,
  type: null,
  optionList: [],
  name: EMPTY_STRING,
  required: false,
  isRequired: false,
  selectedValue: EMPTY_STRING,
  readOnly: false,
  onClick: null,
  defaultChecked: false,
  isDataLoading: false,
  setBorder: false,
  justifyBetween: false,
  inline: false,
  id: EMPTY_STRING,
  enableOptionDeselect: true,
  customClass: EMPTY_STRING,
  HelperClass: EMPTY_STRING,
  containerClass: EMPTY_STRING,
  radioLabelClass: null,
  editIcon: null,
  deleteIcon: null,
  radioButtonClasses: null,
  radioSelectedStyle: null,
  isGridViewClass: false,
  radioInnerClass: EMPTY_STRING,
  readOnlyField: EMPTY_STRING,
  isAdditionalInfo: false,
  additionalInfo: EMPTY_STRING,
};
