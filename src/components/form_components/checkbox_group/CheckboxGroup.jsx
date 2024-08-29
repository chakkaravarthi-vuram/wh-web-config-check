import React, { useContext, useState, useEffect } from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import jsUtils, { isEmpty } from 'utils/jsUtility';
import { joinWordsInString, keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import ThemeContext from '../../../hoc/ThemeContext';

import Label from '../label/Label';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from '../helper_message/HelperMessage';
import HelpIcon from '../../../assets/icons/HelpIcon';

import styles from './CheckboxGroup.module.scss';
import gClasses from '../../../scss/Typography.module.scss';

import { BS, INPUT_TYPES, ARIA_ROLES } from '../../../utils/UIConstants';
import { EMPTY_STRING, SPACE } from '../../../utils/strings/CommonStrings';
import CorrectIcon from '../../../assets/icons/CorrectIcon';

export const CHECK_BOX_GROUP_TYPE = {
  TYPE_1: 1,
  TYPE_2: 2,
};
function CheckboxGroup(props) {
  const {
    label,
    errorMessage,
    message,
    id,
    type,
    optionList,
    name,
    required,
    selectedValues,
    readOnly,
    onClick,
    isSlider,
    hideOptionLabel,
    isDataLoading,
    hideMessage,
    className,
    hideLabel,
    checkboxClasses,
    helperTooltipMessage,
    helperToolTipId,
    isSlider1,
    instructionMessage,
    instructionMessageClassName,
    checkboxViewClassName,
    checkboxViewLabelClassName,
    disabled,
    editIcon,
    deleteIcon,
    labelClass,
    CorrectIconStyles,
    innerClassName,
    fieldTypeInstruction,
    sliderClassName,
    inputClassName,
    referenceName,
    mainLabelClass,
    isGridViewClass,
    displayDeactivatedValue,
    customSliderClassName,
    customSwitchClassName,
    helperMessageId,
    sliderAriaLabel,
    isTable,
    isMultiSelectDropdown,
  } = props;
  const { buttonColor } = useContext(ThemeContext);
  const [deactivatedList, setDeactivatedList] = useState([]);
  const messageId = helperMessageId || `${id}_helper_message`;
  const labelId = (!hideLabel || isTable) ? (id ? `${id}_label` : null) : null;
  const inputID = hideOptionLabel ? `${id}_label` : null;
  useEffect(() => {
    if (selectedValues && optionList) {
      const deactivated = [];
      selectedValues &&
        jsUtils.isArray(selectedValues) &&
       selectedValues.forEach((selectedValue) => {
        const index = optionList.findIndex((option) => (option.value === selectedValue));
        console.log(selectedValue, index, optionList, 'jfbjkbkjsbgkjbsk');
        if (index === -1) {
          deactivated.push(selectedValue);
        }
      });
      setDeactivatedList(deactivated);
    }
  }, []);
  const onClickHandler = (value) => {
    const { multipleValuesClicked } = props;
    if (onClick && !readOnly && !disabled) {
      if (multipleValuesClicked && deactivatedList && selectedValues) {
        const multipleClicksValues = [];
        selectedValues.forEach((selectedValue) => {
          // const index = optionList.findIndex((option) => (option.value === selectedValue));
          if ((deactivatedList || []).includes(selectedValue)) {
            multipleClicksValues.push(selectedValue);
          }
        });
        if (multipleClicksValues.length > 0) {
          multipleClicksValues.push(value);
          multipleValuesClicked(multipleClicksValues);
        } else onClick(value);
      } else {
        onClick(value);
      }
    }
  };
  // setting message
  let ariaError = false;
  let checkBoxMessage = EMPTY_STRING;
  if (errorMessage) {
    checkBoxMessage = errorMessage;
    ariaError = true;
  } else if (message) {
    checkBoxMessage = message;
  }
  // setting id for label and helper message
  let optionsContainerClass = null;
  switch (type) {
    case CHECK_BOX_GROUP_TYPE.TYPE_1:
      optionsContainerClass = cx(BS.D_FLEX, styles.OptionContainer);
      break;
    case CHECK_BOX_GROUP_TYPE.TYPE_2:
      optionsContainerClass = styles.OptionContainerType2;
      break;
    default:
      optionsContainerClass = cx(BS.D_FLEX, styles.OptionContainer);
      break;
  }
  let checkBoxOptionList = null;
  if (isDataLoading) {
    checkBoxOptionList = (
      <div className={cx(BS.D_FLEX)}>
        <div className={cx(gClasses.CenterV, gClasses.MR30)}>
          <Skeleton height="18px" width="18px" circle />
          <div className={cx(gClasses.MinHeight18, gClasses.MinWidth100, gClasses.ML5)}>
            <Skeleton />
          </div>
        </div>
        {/* <div className={cx(gClasses.CenterV, gClasses.MR30)}>
          <Skeleton height={'18px'} width={'18px'} circle />
          <div className={cx(gClasses.MinHeight18, gClasses.MinWidth75, gClasses.ML5)}>
            <Skeleton />
          </div>
        </div> */}
      </div>
    );
  } else {
    checkBoxOptionList = optionList.map((option, index) => {
      let checkBoxMockStyle = null;
      // let innerCheckBoxMockStyle = null;
      console.log('labelClassCheck', labelClass);
      const optionId = `${label ? joinWordsInString(label) : joinWordsInString(option.label)}_${index}_label`;
      const ariaLabelledBy = `${index === 0 ? (labelId ? (labelId + SPACE) : EMPTY_STRING) : EMPTY_STRING}${checkBoxMessage && (messageId + SPACE)}${hideOptionLabel ? inputID : optionId}`;
      let labelTypography = jsUtils.isNull(labelClass) ? gClasses.FTwo13GrayV53 : labelClass;
      const isValueSelected = (selectedValues || []).includes(option.value);
      if (isValueSelected) {
        checkBoxMockStyle = {
          borderColor: buttonColor,
        };
        // innerCheckBoxMockStyle = {
        //   backgroundColor: buttonColor,
        // };
        labelTypography = jsUtils.isNull(labelClass) ? gClasses.FTwo13 : labelClass;
      }
      const checkBoxView = (
        <div
          className={cx(
            gClasses.CenterV,
            gClasses.MR30,
            styles.Option,
            checkboxViewClassName,
          )}
          onClick={(e) => {
            e.preventDefault();
            onClickHandler(option.value);
            console.log('hello check box div');
          }}
          key={option.value}
          role="presentation"
          title={option.help_text ? null : option.label}
        >
          {isSlider ? (
            <div className={cx(styles.switch, customSwitchClassName)}>
              <input
                type={INPUT_TYPES.CHECKBOX}
                value={option.value}
                required={required}
                aria-invalid={ariaError}
                checked={isValueSelected}
                readOnly={readOnly}
                id={option.value}
                className={cx(inputClassName, styles.CheckBox, 'invisible')}
                ui-auto={referenceName}
              />
              <span
              role="checkbox"
              tabIndex={readOnly || disabled ? -1 : 0}
              aria-checked={isValueSelected}
              aria-labelledby={!hideLabel ? labelId : null}
              aria-label={sliderAriaLabel}
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onClickHandler(option.value)}
              className={cx(isSlider1 ? cx(styles.slider1, sliderClassName) : styles.slider, styles.round, (readOnly || disabled) ? styles.ReadOnly : gClasses.CursorPointer, customSliderClassName)}
              />
            </div>
          ) : (
            <>

              <input
                type={INPUT_TYPES.CHECKBOX}
                name={name}
                value={option.value}
                required={required}
                aria-invalid={ariaError}
                readOnly={readOnly}
                // defaultChecked={defaultChecked}
                onChange={() => {
                  onClickHandler(option.value);
                }}
                checked={isValueSelected}
                id={`${id}_${option.value}`}
                className={cx(styles.CheckBox, BS.P_ABSOLUTE, 'invisible')}
                ui-auto={referenceName}
              />
              <div
                className={cx(
                  checkboxClasses,
                  styles.CheckBoxMock,
                  isValueSelected && styles.SelectedBg,
                  gClasses.CenterVH,
                  gClasses.M3,
                  { [styles.ReadOnly]: readOnly },
                  { [styles.ReadOnly]: disabled },
                )}
                style={checkBoxMockStyle}
                role="checkbox"
                tabIndex={(readOnly || disabled || isMultiSelectDropdown) ? -1 : 0}
                aria-labelledby={ariaLabelledBy}
                aria-label={!checkBoxMessage && option.label}
                aria-checked={isValueSelected}
                onKeyDown={(e) => {
                  keydownOrKeypessEnterHandle(e) && onClickHandler(option.value);
                }}
              >
                {isValueSelected ? (
                  <CorrectIcon className={CorrectIconStyles || styles.CorrectIcon} role={ARIA_ROLES.IMG} title="checked icon" ariaHidden />
                ) : null}
              </div>
            </>
          )}
          {!hideOptionLabel ? (
            <label
              key={option.value}
              id={optionId}
              htmlFor={`${id}_${option.value}`}
              className={cx(
                labelTypography,
                BS.MB_0,
                gClasses.ML10,
                checkboxViewLabelClassName,
               // gClasses.Ellipsis,
                gClasses.FontWeight400,
              )}
            >
              {option.label}
            </label>
          ) : null}
          {option.help_text ? (
            <HelpIcon
              className={cx(styles.Help, gClasses.ML5, gClasses.CursorPointer)}
              title={option.help_text}
              ariaLabel={option.help_text}
              id={option.id}
            />
          ) : null}
        </div>
      );
      return checkBoxView;
    });
  }
  const deactivatedValueInstruction = displayDeactivatedValue && (deactivatedList && jsUtils.isArray(deactivatedList) && (deactivatedList.length > 0)) && (
    <div className={cx(gClasses.FontStyleNormal, gClasses.MT5, gClasses.FontSize, gClasses.Fone12GrayV4, gClasses.WordWrap)}>
      {`Deactivated options (${deactivatedList}) are selected`}
    </div>
  );
  return (
    <div role={ARIA_ROLES.GROUP} aria-labelledby={labelId} id={`checkbox-group-${id}`} className={className}>
      {!hideLabel ? (
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <Label
            isDataLoading={isDataLoading}
            content={label}
            id={labelId}
            labelFor={`checkbox-group-${id}`}
            isRequired={required}
            message={helperTooltipMessage}
            toolTipId={helperToolTipId}
            labelFontClass={cx(labelClass, mainLabelClass)}
            formFieldBottomMargin
            hideLabelClass
          />
          {(fieldTypeInstruction || editIcon || deleteIcon) ? (
            <div className={cx(BS.D_FLEX, BS.JC_END, gClasses.CenterV, gClasses.Height24)}>
              {fieldTypeInstruction}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className={cx(optionsContainerClass, innerClassName, isGridViewClass ? gClasses.FormFieldMultipleOption : null)}>{checkBoxOptionList}</div>
      {instructionMessage && (
        <div className={cx(gClasses.FontStyleNormal, gClasses.MT5, gClasses.FontSize, gClasses.Fone12GrayV4, gClasses.WordWrap, instructionMessageClassName)}>
          {instructionMessage}
        </div>
      )}
      {deactivatedValueInstruction}
      {hideMessage ? null : !isEmpty(checkBoxMessage) && (
        <HelperMessage
          id={messageId}
          message={checkBoxMessage}
          type={HELPER_MESSAGE_TYPE.ERROR}
          className={gClasses.ErrorMarginV1}
        />
      )}
    </div>
  );
}
export default CheckboxGroup;

CheckboxGroup.propTypes = {
  label: PropTypes.string,
  message: PropTypes.string,
  id: PropTypes.string,
  hideMessage: PropTypes.bool,
  hideLabel: PropTypes.bool,
  errorMessage: PropTypes.string,
  type: PropTypes.number,
  optionList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
  name: PropTypes.string,
  required: PropTypes.bool,
  isSlider: PropTypes.bool,
  selectedValues: PropTypes.arrayOf(PropTypes.number),
  readOnly: PropTypes.bool,
  onClick: PropTypes.func,
  defaultChecked: PropTypes.bool,
  hideOptionLabel: PropTypes.bool,
  isDataLoading: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  editIcon: PropTypes.element,
  deleteIcon: PropTypes.element,
  labelClass: PropTypes.element,
  mainLabelClass: PropTypes.element,
  CorrectIconStyles: PropTypes.element,
  isGridViewClass: PropTypes.bool,
  customSliderClassName: PropTypes.string,
  customSwitchClassName: PropTypes.string,
  isMultiSelectDropdown: PropTypes.bool,
};
CheckboxGroup.defaultProps = {
  optionList: [],
  className: EMPTY_STRING,
  label: EMPTY_STRING,
  message: EMPTY_STRING,
  errorMessage: EMPTY_STRING,
  hideMessage: false,
  hideLabel: false,
  hideOptionLabel: false,
  isSlider: false,
  type: null,
  // optionList: [],
  name: EMPTY_STRING,
  required: false,
  selectedValues: [],
  readOnly: false,
  onClick: null,
  defaultChecked: false,
  isDataLoading: false,
  id: EMPTY_STRING,
  disabled: false,
  editIcon: null,
  deleteIcon: null,
  labelClass: null,
  mainLabelClass: null,
  CorrectIconStyles: null,
  isGridViewClass: false,
  customSliderClassName: EMPTY_STRING,
  customSwitchClassName: EMPTY_STRING,
  isMultiSelectDropdown: false,
};
