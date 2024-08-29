import React, { useState, useContext, useEffect, useRef } from 'react';
import cx from 'classnames/bind';
import propTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';

import { KEY_CODES } from 'utils/Constants';
import ThemeContext from '../../../hoc/ThemeContext';

import Label from '../label/Label';
import DropdownList from '../dropdown/dropdown_list/DropdownList';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from '../helper_message/HelperMessage';

import gClasses from '../../../scss/Typography.module.scss';
import style from './MobileNumber.module.scss';

import {
  ARIA_ROLES,
  BS,
  INPUT_TYPES,
  SKELETON_LOADER_DIMENSION_CONSTANTS,
} from '../../../utils/UIConstants';
import countryCodeList from '../flags/countryCodeList';
import {
  ACTION_STRINGS,
  COUNTRY_CODE,
  EMPTY_STRING,
  SPACE,
} from '../../../utils/strings/CommonStrings';
import {
  findIndexBySearchValue,
  getCountryCodeDropdownList, getNormalizeKeyCode, isPrintableKeyCode,
} from '../../../utils/UtilityFunctions';
import AutoPositioningPopper, {
  POPPER_PLACEMENTS,
} from '../../auto_positioning_popper/AutoPositioningPopper';
import ConditionalWrapper from '../../conditional_wrapper/ConditionalWrapper';

function MobileNumber(props) {
  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  const [isInputFocused, setInputFocus] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [countryCodeDropdownList, _setCountryCodeDropDownList] = useState(
    getCountryCodeDropdownList(),
  );
  const [optionListDisplay, setOptionListDisplay] = useState(countryCodeDropdownList);
  const [focusIndex, setFocusIndex] = useState(null);
  const activeSuggestionRef = useRef();
  const { buttonColor } = useContext(ThemeContext);
  const [, setFocusDropdownSearch] = useState(null);
  let search_text_delay_timer;

  const {
    id,
    placeholder,
    label,
    onChangeHandler,
    onKeyDownHandler,
    onCountryCodeChange,
    mobile_number,
    inputDropdownClassName,
    errorMessage,
    isCreationField,
    isDataLoading,
    isRequired,
    hideLabel,
    hideMessage,
    disabled,
    helperTooltipMessage,
    helperTooltipId,
    instructionMessage,
    instructionClass,
    isTable,
    countryCodeId,
    isFromDefaultValue,
    editIcon,
    deleteIcon,
    labelClass,
    className,
    innerClassName,
    fieldTypeInstruction,
    referenceName,
    focusOnError,
    focusOnErrorRefresher,
    ariaLabelHelperMessage,
    helperAriaHidden,
  } = props;

  const inputRef = useRef(null);
  useEffect(() => {
    console.log('activeSuggestionRef, ', activeSuggestionRef);
    if (activeSuggestionRef && activeSuggestionRef.current) {
      activeSuggestionRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [focusIndex]);
  useEffect(() => {
    if (errorMessage && focusOnError) inputRef.current.focus();
  }, [focusOnError, focusOnErrorRefresher]);

  const country_field_id = 'country_code';
  const dropdownListId = `${country_field_id}_dropdown_List`;
  const helperMessageId = `${country_field_id}_helper_message`;
  const labelId = `${id}_label`;

  const getCcodeFromId = (countryCodeId) => {
    const countryCode = countryCodeList.filter((cCode) => countryCodeId === cCode.countryCodeId);
    return countryCode[0].countryCode;
  };

  const onDropdownChange = (countryCodeId) => {
    setFocusIndex(null);
    setDropdownVisibility(false);
    const countryCode = getCcodeFromId(countryCodeId);
    const event = {
      target: {
        id: country_field_id,
        countryCode,
        value: countryCodeId,
      },
    };
    if (onCountryCodeChange) {
      onCountryCodeChange(event);
    }
  };

  useEffect(() => {
    if (countryCodeId && !disabled && isFromDefaultValue) {
      onDropdownChange(countryCodeId, null);
    }
    return () => clearTimeout(search_text_delay_timer);
  }, []);

const setSelectedValueFocusOnOpen = (optionListDisplay) => {
      [countryCodeId].flat().every((eachValue) => {
        const idk = optionListDisplay.findIndex((eachOption) => eachOption.value === eachValue);
          if (idk > -1) {
            setFocusIndex(idk);
            return false;
          }
        setFocusIndex(null);
        return true;
      });
   };

function onDropdownClick() {
    if (!disabled) {
      if (!isDropdownVisible) setSelectedValueFocusOnOpen(optionListDisplay);
       setDropdownVisibility((isDropdownVisible) => !isDropdownVisible);
    }
   }
  const onFocusFilter = (event, optionListDisplay) => {
    if (isPrintableKeyCode(event)) {
      event.preventDefault();
      setFocusDropdownSearch((previous_search_text) => {
        const searchText = (previous_search_text || '').concat(String.fromCharCode(getNormalizeKeyCode(event)));
        const index = findIndexBySearchValue(optionListDisplay, searchText);
        (index > -1) ? setFocusIndex(index) : setFocusIndex(null);
        return searchText;
      });
          clearTimeout(search_text_delay_timer);
          search_text_delay_timer = setTimeout(() => setFocusDropdownSearch(''), 2000);
    }
  };

  const onSuggestionKeyDownHandler = (e) => {
    if (e.target.id === id) e.preventDefault();
    switch (e.keyCode) {
      case KEY_CODES.ENTER:
         if (focusIndex !== null && isDropdownVisible) {
              const selectedValue = optionListDisplay[focusIndex];
              onDropdownChange(selectedValue.value);
          } else {
            setDropdownVisibility(true);
            setSelectedValueFocusOnOpen(optionListDisplay);
          }
         break;
      case KEY_CODES.UP_ARROW:
        e.preventDefault();
        if (focusIndex === null || focusIndex === 0) return setFocusIndex(optionListDisplay.length - 1);
        if (focusIndex !== 0) return setFocusIndex(focusIndex - 1);
        break;
      case KEY_CODES.DOWN_ARROW:
        e.preventDefault();
        if (focusIndex === null || focusIndex === optionListDisplay.length - 1) return setFocusIndex(0);
        if (focusIndex !== optionListDisplay.length - 1) return setFocusIndex(focusIndex + 1);
        break;
      case KEY_CODES.SPACE_BAR:
        e.stopPropagation();
        e.preventDefault();
        if (isDropdownVisible) onFocusFilter(e, optionListDisplay);
        else {
          setDropdownVisibility(true);
          setSelectedValueFocusOnOpen(optionListDisplay);
        }
        break;
      case KEY_CODES.ESCAPE:
        e.stopPropagation();
        e.preventDefault();
        setDropdownVisibility(false);
        setFocusIndex(null);
        break;
      default:
        onFocusFilter(e, optionListDisplay);
      break;
    }
    return null;
  };

  const onBlur = () => {
    if (!isInputFocused) {
      setDropdownVisibility(false);
      setFocusIndex(null);
    }
  };

  const updateOptionListDisplay = (list) => setOptionListDisplay(list);

  const onInputBlurHandler = () => {
    setFocusIndex(null);
    setInputFocus(false);
    setDropdownVisibility(false);
  };

  const onInputMouseDownHandler = () => {
    setInputFocus(true);
  };

  const onNumberChangeHandler = (event) => {
    event.stopPropagation();
    if (event.target.value === '' || /^(?!0)[0-9]+$/.test(event.target.value)) onChangeHandler(event);
  };

  const onKeyDownHandlerOfInput = (event) => {
    event.stopPropagation();
    if (onKeyDownHandler) onKeyDownHandler(event);
  };

  const [referencePopperElement, setReferencePopperElement] = useState(null);

  return (
    <div className={cx(className, !(!hideMessage && errorMessage) && !isCreationField && gClasses.MB15)}>
      <div
        className={cx(BS.P_RELATIVE)}
        ref={setReferencePopperElement}
      >
        {hideLabel ? null : (
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
            <Label
              id={labelId}
              content={label}
              labelFor={`${id + SPACE}country_field_id`}
              isDataLoading={isDataLoading}
              isRequired={isRequired}
              message={helperTooltipMessage}
              toolTipId={helperTooltipId}
              labelFontClass={labelClass}
              formFieldBottomMargin
              hideLabelClass
            />
            {(fieldTypeInstruction || editIcon || deleteIcon) ? (
              <div className={cx(gClasses.CenterV, gClasses.Height24)}>
                {fieldTypeInstruction}
              </div>
            ) : null}
          </div>
        )}
        {isDataLoading ? (
          <div>
            <Skeleton height={SKELETON_LOADER_DIMENSION_CONSTANTS.PX34} />
          </div>
        ) : (
          <>
            <div
              className={cx(
                errorMessage ? gClasses.ErrorInputBorder : gClasses.InputBorder,
                { [gClasses.ReadOnlyBg]: disabled },
                gClasses.InputBorderRadius,
                disabled ? gClasses.FOne13GrayV5 : gClasses.FOne13BlackV1,
                BS.D_FLEX,
                style.Container,
                innerClassName,
              )}
              onKeyDown={onSuggestionKeyDownHandler}
              onBlur={onBlur}
              role="combobox"
              tabIndex={disabled ? -1 : 0}
              id="country_field_id"
              aria-expanded={isDropdownVisible}
              aria-controls={isDropdownVisible ? dropdownListId : EMPTY_STRING}
              aria-label={`country code, selected ${countryCodeId}`}
              aria-labelledby={`${id && labelId}${errorMessage ? SPACE + helperMessageId : EMPTY_STRING}`}
            >
              <div
                className={cx(
                  gClasses.CenterV,
                  style.Dropdown,
                  gClasses.CursorPointer,
                  gClasses.InputPaddingV2,
                  inputDropdownClassName,
                )}
                onClick={() => onDropdownClick()}
                role="presentation"
                ui-auto={referenceName}
                aria-hidden="true"
              >
                {countryCodeId}

                <div
                  className={cx(gClasses.DropdownArrow, gClasses.ML5, disabled && style.DisabledArrow)}
                  style={{
                    borderTopColor: buttonColor,
                  }}
                />
              </div>
              <div className={cx(gClasses.InputPaddingV2, gClasses.CenterV, BS.W100, inputDropdownClassName)}>
                <input
                  type={INPUT_TYPES.TEXT}
                  className={cx(
                    BS.BORDER_0,
                    style.Input,
                    BS.W100,
                    disabled ? gClasses.FOne13GrayV5 : gClasses.FOne13BlackV1,
                  )}
                  onChange={onNumberChangeHandler}
                  value={mobile_number}
                  id={id}
                  ref={inputRef}
                  placeholder={placeholder}
                  onKeyDown={onKeyDownHandlerOfInput}
                  readOnly={disabled}
                  errorMessage={errorMessage}
                  ui-auto={referenceName}
                  autoComplete={ACTION_STRINGS.OFF}
                  tabIndex={disabled ? -1 : 0}
                />
              </div>
            </div>
            <ConditionalWrapper
              condition={!isTable}
              wrapper={(children) => (
                <AutoPositioningPopper
                  className={cx(gClasses.ZIndex2, BS.W100)}
                  referenceElement={referencePopperElement}
                  placement={POPPER_PLACEMENTS.BOTTOM}
                  fallbackPlacements={[POPPER_PLACEMENTS.TOP]}
                  isPopperOpen={isDropdownVisible}
                  enableOnBlur
                  onBlur={onBlur}
                >
                  {children}
                </AutoPositioningPopper>
              )}
            >
              <div
              onKeyDown={onSuggestionKeyDownHandler}
              role="button"
              tabIndex={disabled ? -1 : 0}
              >
              <DropdownList
                id={dropdownListId}
                suggestionRef={activeSuggestionRef}
                suggestionIndex={focusIndex}
                optionList={countryCodeDropdownList}
                onClick={onDropdownChange}
                isVisible={isDropdownVisible}
                onInputMouseDownHandler={onInputMouseDownHandler}
                onInputBlurHandler={onInputBlurHandler}
                // enableSearch
                isCountryCodeList
                noAbsolutePosition={isTable}
                isTable={isTable}
                updateOptionListDisplay={updateOptionListDisplay}
              />
              </div>
            </ConditionalWrapper>
          </>
        )}
      </div>
      {instructionMessage && (
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
      {!hideMessage && errorMessage && (
        <HelperMessage
          id={helperMessageId}
          type={HELPER_MESSAGE_TYPE.ERROR}
          message={errorMessage}
          className={gClasses.ErrorMarginV1}
          ariaLabelHelperMessage={ariaLabelHelperMessage}
          ariaHidden={!helperAriaHidden}
          role={ARIA_ROLES.PRESENTATION}
        />
      )}
    </div>
  );
}
export default MobileNumber;
MobileNumber.defaultProps = {
  countryCodeId: COUNTRY_CODE.US_MOBILE_COUNTRY_CODE,
  mobile_number: EMPTY_STRING,
  id: EMPTY_STRING,
  label: EMPTY_STRING,
  placeholder: EMPTY_STRING,
  errorMessage: EMPTY_STRING,
  onKeyDownHandler: null,
  onChangeHandler: null,
  isRequired: false,
  hideLabel: false,
  hideMessage: false,
  disabled: false,
  helperTooltipMessage: EMPTY_STRING,
  helperTooltipId: EMPTY_STRING,
  instructionMessage: EMPTY_STRING,
  editIcon: null,
  deleteIcon: null,
  labelClass: null,
};

MobileNumber.propTypes = {
  countryCodeId: propTypes.string,
  mobile_number: propTypes.string,
  id: propTypes.string,
  label: propTypes.string,
  placeholder: propTypes.string,
  errorMessage: propTypes.string,
  onKeyDownHandler: propTypes.func,
  onChangeHandler: propTypes.func,
  onCountryCodeChange: propTypes.func.isRequired,
  editIcon: propTypes.element,
  deleteIcon: propTypes.element,
  labelClass: propTypes.element,
  isRequired: propTypes.bool,
  hideLabel: propTypes.bool,
  hideMessage: propTypes.bool,
  disabled: propTypes.bool,
  helperTooltipMessage: propTypes.string,
  helperTooltipId: propTypes.string,
  instructionMessage: propTypes.string,
};
