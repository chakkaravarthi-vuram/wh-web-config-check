import React, { useState, useContext, useEffect, useRef } from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import PropTypes from 'prop-types';
import moment from 'moment';
import FilterIcon from 'assets/icons/FilterIcon';
import CloseIconNew from 'assets/icons/CloseIconNew';
import SortIcon from 'assets/icons/SortIcon';
import { KEY_CODES } from 'utils/Constants';
import CloseIcon from 'assets/icons/CloseIcon';
import i18next from 'i18next';
import ThemeContext from '../../../hoc/ThemeContext';

import Label from '../label/Label';
import DropdownList from './dropdown_list/DropdownList';
import UserCard from '../../user_card/UserCard';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from '../helper_message/HelperMessage';
import ConditionalWrapper from '../../conditional_wrapper/ConditionalWrapper';
import AutoPositioningPopper, {
  POPPER_PLACEMENTS,
} from '../../auto_positioning_popper/AutoPositioningPopper';
import { ARIA_ROLES, BS, COLOUR_CODES } from '../../../utils/UIConstants';
import {
  DROPDOWN_CONSTANTS,
  EMPTY_STRING,
  COMMA,
  SPACE,
} from '../../../utils/strings/CommonStrings';
import { filterListBySearchValue, findIndexBySearchValue, getNormalizeKeyCode, getUserCardFromIndex, isPrintableKeyCode, keydownOrKeypessEnterHandle } from '../../../utils/UtilityFunctions';
import jsUtils, { isEmpty, compact, isBoolean } from '../../../utils/jsUtility';
import { DROPDOWN_STRINGS } from './Dropdown.strings';
import gClasses from '../../../scss/Typography.module.scss';
import styles from './Dropdown.module.scss';
import {
  generateEventTargetObject,
  getLabelFromIndex,
  getLabelFromIndexList,
} from '../../../utils/generatorUtils';
import Input, { INPUT_VARIANTS } from '../input/Input';

function Dropdown(props) {
  const { buttonColor, buttonIconColor } = useContext(ThemeContext);
  const [focusIndex, setFocusIndex] = useState(null);
  const activeSuggestionRef = useRef();
  const {
    id,
    label,
    isDataLoading,
    placeholder,
    setValuePlaceholder = EMPTY_STRING,
    hideMessage,
    selectedValue,
    className,
    labelClassName,
    isBorderLess,
    inputTextContainerStyle,
    rtl,
    optionList,
    onInputChangeHandler,
    onSearchInputChange,
    inputContainerShortcutStyle,
    showSelectedValTooltip = false,
    onButtonClick,
    inputValue,
    textId,
    onChange,
    loadData,
    textError,
    hideLabel,
    onKeyDownHandler,
    disabled,
    innerClassName,
    isRequired,
    isMultiSelect,
    setSelectedValue,
    strictlySetSelectedValue,
    enableSearch,
    isTimeZone,
    isNewDropdown,
    isSortDropdown,
    noInputPadding,
    isTaskDropDown,
    isUserDropdown,
    dropdownVisibility,
    disablePopper,
    style,
    placement,
    fallbackPlacements,
    customDisplay,
    tabBased,
    allowedAutoPlacements,
    popperClasses,
    popperStyles,
    isTable,
    showNoDataFoundOption,
    noDataFoundOptionLabel,
    isPaginated,
    hasMore,
    loadDataHandler,
    inputComponent,
    dropdownListLabel,
    isMultiSectionDropdown,
    fixedPopperStrategy,
    helperTooltipMessage,
    helperToolTipId,
    dropdownListClasses,
    instructionMessage,
    instructionClass,
    futureTime,
    isEditableDropdownInput,
    inputSize,
    onEditableInputBlurHandler,
    errorBorder,
    showDropdownListIfError,
    isTextInputDropdown,
    onFocusHandler,
    isSortTeamUser,
    onlyAllowDropdownValueChange,
    isCountryCodeList,
    disableClass,
    editIcon,
    deleteIcon,
    labelClass,
    labelClassAdmin,
    customInputPaddingClass,
    updatedDropdownOptionList,
    fieldTypeInstruction,
    optionsNoWrap,
    inputDropdownContainer,
    optionListDropDown,
    referenceName,
    isNewInput,
    InputContainerClassName,
    customListClasses,
    customClassIndices,
    isAdminSearchSort,
    errorMessageClassName,
    focusInitialValue,
    initialValue,
    isViewDropdown,
    viewComponent,
    optionListClassName,
    customContentStyle,
    CustomSortIcon,
    isCustomFilterDropdown,
    hideDropdownListLabel,
    placeholderClassName,
    selectedLabelClass,
    outerClassName,
    multiSectionClassName,
    dropdownListCreateLabel,
    dropdownListChooseLabel,
    ButtonLabelMultiSectionDropdown,
    optionContainerClassName,
    dropdownListInputClass,
    dropdownListNotFoundLabel,
    displayDeactivatedValue,
    disableFocusFilter,
    newDropdownCustomClass,
    isFromMoreFilter,
    onCloseMoreFilter,
    focusOnError,
    focusOnErrorRefresher,
    ariaLabelHelperMessage,
    comboboxClass,
    helperAriaHidden,
    isElementOption,
    isForceDropDownClose = false,
    strictForceDropdownClose = false,
    disableLoader,
    isMultiSelectWithMultiSection,
    buttonId,
    ondropdownKeydown,
    hideOptionInput,
    enableOnClick = false,
    handleBlurDropdown,
    heightClassName,
    ListButtonClass,
    isChart,
    isCrossDashBoard,
    isSummaryMenu,
    dropdownListVisibilityConditionProps,
    isUserDropdownLabel,
    onSetClicked,
    noMarginBottom = false,
    setValueError = EMPTY_STRING,
    showReset = false,
    loadingOptionList,
    setInitialSearchText,
    initialSearchText,
    searchInputPlaceholder,
    dropdownArrowIcon,
    searchInputIcon,
    checkboxViewClassName,
    isCategoryDropdown,
    customPlaceholderStyle,
    isCustomLogin,
  } = props;
  let { errorMessage } = props;
  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  console.log(isDropdownVisible, optionList, 'shww', 'placeholderv323', placeholder, 'selectedValue', selectedValue);
  const [referencePopperElement, setReferencePopperElement] = useState(null);
  const [isInputFocussed, setInputFocussed] = useState(false);
  const [inputState, setInputState] = useState(selectedValue);
  const [, setOptionListDisplay] = useState(optionList);
  const [deactivatedValue, setDeactivatedValue] = useState(null);
  const [, setFocusDropdownSearch] = useState(null);
  const [searchText, setSearchText] = useState(EMPTY_STRING);
  let search_text_delay_timer;
  const dropdownListid = `dropDownListId_${id}`;
  const inputRef = useRef(null);
  const helperMessageId = `helper_${id}`;
  const placeholderId = `${id ? (placeholder ? (isEditableDropdownInput ? `editable-input-${id}` : `placeholder_${id}`) : EMPTY_STRING) : EMPTY_STRING}`;
  const labelId = `label_${id}`;
  const multiSectionInputId = `${dropdownListid}_multisection_input`;
  const multiSectionBtnId = `${dropdownListid}_multisection_btn`;
  const isFirstRender = useRef(true);

  useEffect(() => {
    (isForceDropDownClose || strictForceDropdownClose) && setDropdownVisibility(!isForceDropDownClose);
  }, [isForceDropDownClose]);

  // This useEffect check for the selected value existency in the option list and if its not exist, then add the selected value to deactivatedValue.
  useEffect(() => {
    if (selectedValue && !jsUtils.isEmpty(optionList)) {
      let deactivated = null;
      const index = optionList.findIndex((option) => (option.value === selectedValue));
      if (index === -1) {
        deactivated = selectedValue;
      }
      setDeactivatedValue(deactivated);
    }
  }, []);

  const loadMoreDataOnScroll = () => {
    loadDataHandler(searchText || EMPTY_STRING);
  };

  // This function helps to focus the initial value on the optionlist
  const setSelectedValueFocusOnOpen = (optionListDisplay) => {
    if (!isPaginated && !isMultiSelect && !isMultiSelectWithMultiSection) {
      [selectedValue].flat().every((eachValue) => {
        const idk = optionListDisplay.findIndex((eachOption) => (eachOption && (eachOption.value === eachValue)));
          if (idk > -1) {
            setFocusIndex(idk);
            return false;
          }
        setFocusIndex(null);
        return true;
      });
     } else setFocusIndex(null);
   };

  const setFocusToInitialValue = (optionList_) => {
    if (focusInitialValue && initialValue) {
      const index = optionList.findIndex((data) => data.value === Number(initialValue));
      if (index > -1) {
        setFocusIndex(index);
      } else setFocusIndex(null);
    } else setSelectedValueFocusOnOpen(optionList_);
  };

  // This useEffect helps to custom visibility function based on isDropdownVisible.
  const onCloseDropdownPopper = () => {
    setFocusIndex(null);
    if (!isEmpty(searchText)) { // while closing reset search text and option list
      setSearchText(EMPTY_STRING);
      onSearchInputChange && onSearchInputChange(EMPTY_STRING);
    }
  };

  useEffect(() => {
    if (dropdownVisibility) {
      dropdownVisibility(isDropdownVisible);
    }
    if (setInitialSearchText && (dropdownVisibility || isDropdownVisible)) {
      setSearchText(initialSearchText || EMPTY_STRING);
    }
    if (!isCrossDashBoard || !isFirstRender.current) {
      if (!isDropdownVisible) {
          onCloseDropdownPopper();
      }
    } else {
      isFirstRender.current = false;
    }
  }, [dropdownVisibility, isDropdownVisible]);

  // This useEffect help to focus/highlight/select the (li)value pointed by activeSuggestionRef in a smooth scroll way.
  useEffect(() => {
    if (activeSuggestionRef && activeSuggestionRef.current) {
      activeSuggestionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
       });
    }
  }, [focusIndex]);

  // This useEffect helps to make the popper open, when any validation error occur.
  useEffect(() => {
    const elem = document.getElementById(`combo-box-${id}`);
    const addClass = () => {
        elem?.classList.add(styles.ComboBoxFocusVisible);
      };

    const removeClass = () => {
        elem?.classList.remove(styles.ComboBoxFocusVisible);
    };

    if (showDropdownListIfError && errorMessage) {
      setDropdownVisibility(true);
      inputRef.current.focus();
    } else if (errorMessage && focusOnError) {
        elem?.addEventListener('focus', addClass);
        elem?.addEventListener('focusout', removeClass);
        inputRef.current.focus();
    } else {
        elem?.classList.remove(styles.ComboBoxFocusVisible);
    }
    return () => {
      elem?.removeEventListener('focus', addClass);
      elem?.removeEventListener('focusout', removeClass);
      clearTimeout(search_text_delay_timer);
    };
  }, [errorMessage, showDropdownListIfError, focusOnError, focusOnErrorRefresher]);

  // Popper Specific styles.
  const popperPlacement = placement || POPPER_PLACEMENTS.AUTO;
  const popperClass = popperClasses || cx(gClasses.ZIndex3, BS.W100);
  const popperAllowedAutoPlacements = allowedAutoPlacements || [
    POPPER_PLACEMENTS.TOP,
    POPPER_PLACEMENTS.BOTTOM,
  ];
  const popperFallbackPlacements = fallbackPlacements;

  // Dropdown Selected Value Content and Style.
  let content = null;
  let contentStyle = null;
  const textAlignRight = rtl ? BS.TEXT_RIGHT : null;
  let selectedLabel = null;

  // construct selected value for multi-select drop.
  if (isMultiSelect) {
    const selectedLabels = getLabelFromIndexList(optionList, selectedValue);
    selectedLabel = selectedLabels.join(`${COMMA}${SPACE}`);
    content = <div id={placeholderId} className={cx(textAlignRight, !selectedLabel && gClasses.FTwo13GrayV6)}>{selectedLabel || placeholder}</div>;
    // content = <div className={textAlignRight}>{selectedLabel}</div>;
  } else if (isMultiSelectWithMultiSection) {
    const selectedLabels = getLabelFromIndexList(optionList, selectedValue);
    selectedLabel = selectedLabels.join(`${COMMA}${SPACE}`);
    console.log('selected Val1111', selectedValue);
    console.log('selected 487651', selectedLabel);
    content = <div className={textAlignRight}>{selectedLabel}</div>;
  } else if (
    jsUtils.isArray(optionList) &&
    optionList.length > 0 &&
    (selectedValue || selectedValue === 0 || (selectedValue !== null))
  ) {
    // Get the selected value as a user card.
    if (isUserDropdown) {
      selectedLabel = getUserCardFromIndex(optionList, selectedValue);
      content = (
        <UserCard
          firstName={selectedLabel.first_name}
          lastName={selectedLabel.last_name}
          userName={selectedLabel.user_name}
          accountName={selectedLabel.account_name}
          isDropdown
          isBorderLess
        />
      );
    } else {
      selectedLabel = getLabelFromIndex(optionList, selectedValue).toString();

      // if no selected label and no default placeholder available , replace empty space with custom placeholder.
      if (isPaginated && isEmpty(selectedLabel) && selectedValue) {
        if (setSelectedValue) selectedLabel = selectedValue;
        // else {
        // selectedLabel = (placeholder !== 'Select' && placeholder !== 'Select field') ? placeholder : null;
        // }
      }
      // isTaskDropdown Styles.
      const font = isTaskDropDown ? gClasses.FTwo12GrayV3 : null;
      const color = (((isTaskDropDown && !jsUtils.isEmpty(selectedLabel)) || !jsUtils.isNull(selectedValue) || (!jsUtils.isEmpty(selectedValue)) || !Number.isNaN(selectedValue) || isBoolean(selectedValue)) && selectedLabel) ? COLOUR_CODES.GRAY_V3 : COLOUR_CODES.GRAY_V6;
      if (isTaskDropDown && jsUtils.isEmpty(selectedLabel)) selectedLabel = jsUtils.get(optionList, [0, 'label']);

      // Dropdown Content customisation
      if (isSortDropdown) {
        content = isAdminSearchSort ? (
          <div
            className={cx(textAlignRight, font, gClasses.Ellipsis, gClasses.FTwo12GrayV3)}
            id={placeholderId}
          >
            {selectedLabel}
            {' '}
            <SortIcon color="#b8bfc7" />
          </div>
        ) : (
          <div
            className={cx(textAlignRight, font, gClasses.Ellipsis)}
            style={{ color }}
            id={placeholderId}
          >
            {CustomSortIcon ? <CustomSortIcon color={buttonColor} /> : <SortIcon color={buttonColor} />}
            {' '}
            {selectedLabel}
          </div>
        );
      } else if (isSortTeamUser) {
        content = (
          <div
            className={cx(textAlignRight, font, gClasses.Ellipsis)}
            style={{ color, fontWeight: '500' }}
          >
            {`${placeholder}: ${selectedLabel}`}
          </div>
        );
      } else if (isCustomFilterDropdown) {
        content = (
          <div
            className={cx(textAlignRight, font, gClasses.Ellipsis, BS.D_FLEX, BS.ALIGN_ITEM_CENTER)}
            style={{ color }}
            id={placeholderId}
            aria-hidden="true"
          >
            <FilterIcon ariaLabel={DROPDOWN_STRINGS.FILTER} className={styles.FilterIcon} role={ARIA_ROLES.IMG} />
            {' '}
            {selectedLabel}
          </div>
        );
        } else {
          console.log('selectedLabel232323pl', selectedLabel, 'placeholder', placeholder);
        content = (
          <div
            className={cx(textAlignRight, font, gClasses.Ellipsis, newDropdownCustomClass, isEmpty(selectedLabel) && styles.Placeholder)}
            style={{ color, ...customPlaceholderStyle }}
            id={placeholderId}
          >
            {`${selectedLabel || placeholder}`}
          </div>
        );
      }
    }
  } else if (setSelectedValue) {
    selectedLabel = selectedValue;
    content = <div id={placeholderId} className={textAlignRight}>{selectedLabel}</div>;
  } else if (isViewDropdown) {
    content = (
      <div className={cx(gClasses.FTwo12GrayV62, textAlignRight)}>
        {viewComponent}
      </div>
    );
  } else if (isSortDropdown) {
    content = (
      <div className={cx(gClasses.FTwo13GrayV6, textAlignRight)}>
        {placeholder}
        : Recent
      </div>
    );
  } else if (isCustomFilterDropdown) {
    content = (
      <div className={cx(gClasses.FTwo13GrayV6, textAlignRight, BS.D_FLEX, BS.ALIGN_ITEM_CENTER)} id={placeholderId}>
        <FilterIcon className={styles.FilterIcon} role={ARIA_ROLES.IMG} ariaLabel={DROPDOWN_STRINGS.FILTER} />
        {placeholder}
      </div>
    );
  } else {
    content = (
      <div className={cx(gClasses.FTwo13GrayV6, textAlignRight, placeholderClassName)} id={placeholderId}>
        {placeholder}
      </div>
    );
  }

  if (strictlySetSelectedValue) {
    console.log('selectedLabeldhwed', selectedLabel, 'selectedValue', selectedValue);
    selectedLabel = selectedLabel || selectedValue || placeholder;

    content = (
      <div
        className={cx(
          !selectedValue ? cx(gClasses.FTwo13GrayV6, disableClass) : (selectedValue && cx(selectedLabelClass, gClasses.Ellipsis)),
          textAlignRight,
        )}
        id={placeholderId}
        title={showSelectedValTooltip && !!selectedValue && selectedLabel}
      >
        {selectedLabel}
      </div>
    );
  }

 // Dropdown Content Style.
  if (isNewDropdown) {
    contentStyle = styles.NewDropdownContainer;
  } else if (isUserDropdown) {
    contentStyle = styles.UserCardDropdownContainer;
  } else contentStyle = cx(styles.ContentContainer, disableClass);

// if showNoDataFoundOption enable, below code a new option to show no data found.
  const optionList_ =
    showNoDataFoundOption &&
      (!optionList || (optionList && optionList.length === 0)) && (!loadingOptionList)
      ? [{ label: noDataFoundOptionLabel, isNoDataLabel: true }]
      : ((!isEmpty(optionList) && optionList) ? compact(optionList) : []);

  let updatedDropdownOptionList_ = [];
  if (!jsUtils.isEmpty(updatedDropdownOptionList)) {
    updatedDropdownOptionList_ = (showNoDataFoundOption && (updatedDropdownOptionList.length === 0) && !loadingOptionList)
      ? [{ label: noDataFoundOptionLabel, isNoDataLabel: true }]
      : ((!isEmpty(updatedDropdownOptionList) && updatedDropdownOptionList) ? compact(updatedDropdownOptionList) : []);
  }

 // ----- All Event Handler ------

  function onDropdownClick(optionList_) {
    console.log('onDropdownClick122');
    if (!isDropdownVisible) setFocusToInitialValue(optionList_);
    if (!isDropdownVisible && (onSearchInputChange || isMultiSectionDropdown)) setInputFocussed(true);
    setDropdownVisibility(!isDropdownVisible);
    if (loadData) loadData(id);
    if (isCrossDashBoard && onSearchInputChange) {
    onSearchInputChange(EMPTY_STRING);
    }
  }

  const onBlurElementOption = (event) => {
    if (!event) {
      return null;
    }
    event.stopPropagation();
    if (event && !event.currentTarget.contains(event.relatedTarget)
     && !event.target.parentElement.className.toString().includes('CalendarHeader_YearSelect')) {
      setDropdownVisibility(false);
      return null;
    }
    return null;
  };

  const onBlurHandler = (event = null, close = false) => {
    if (jsUtils.isNull(event)) {
      setInputFocussed(false);
      setDropdownVisibility(false);
    }
    if (isElementOption) return onBlurElementOption(event);

    if (event) setFocusIndex(null);

    const { datePicker } = props;
    if (datePicker) {
      if (close) setDropdownVisibility(false);
      return null;
    }

    if (event && !event.currentTarget.contains(event.relatedTarget)
    ) {
      console.log('onBlurHandlereventsdwew', event);
      setDropdownVisibility(false);
      if (handleBlurDropdown) handleBlurDropdown(event);
    } else if (isMultiSelect || isMultiSelectWithMultiSection) {
      // no action
      // multi-select dropdown list will not be closed upon option click
    } else if (isMultiSectionDropdown) {
      if (!textError) {
        if (!isInputFocussed) setDropdownVisibility(false);
      }
    } else if (!isInputFocussed || close) {
      setInputFocussed(false);
      setDropdownVisibility(false);
    }
    return null;
  };

  const handleFilterClear = () => {
    const event = {
      target: { id, value: null },
    };
    onChange(event);
  };

 const onDropdownListClickHandler = async (value, eventObject = undefined) => {
  if (eventObject?.value === placeholder) {
    handleFilterClear();
    setDropdownVisibility(false);
  } else {
  console.log('onDropdownListClickHandler24', eventObject);
    const data = generateEventTargetObject(id, value);
    if (eventObject && eventObject.field_type) data.target.field_type = eventObject.field_type;
    if (eventObject && eventObject.instanceId) data.target.instanceId = eventObject.instanceId;
    if (eventObject && eventObject.label) data.target.label = eventObject.label;
    data.target = { ...eventObject, ...data.target };
    if (onChange) {
      const { datePicker } = props;
      if (isTextInputDropdown) {
        if (isEmpty(value)) setDropdownVisibility(false);
        else {
          setDropdownVisibility(true);
        }
        onChange(data);
        setInputState(value);
      } else if (isMultiSelectWithMultiSection) {
          onChange(data);
      } else {
        onChange(data);
        !isMultiSelect && onBlurHandler(null, datePicker);
      }
      isMultiSectionDropdown && setInputFocussed(false);
      if (!isMultiSelect) setFocusIndex(null);
    }
  }
  };

  const onFocusFilter = (event, optionListDisplay) => {
    if (!disableFocusFilter && isPrintableKeyCode(event)) {
      event.preventDefault();
      setFocusDropdownSearch((previous_search_text) => {
        const searchText = (previous_search_text || '').concat(String.fromCharCode(getNormalizeKeyCode(event)));
        const index = findIndexBySearchValue(optionListDisplay, searchText, isTimeZone);
        (index > -1) ? setFocusIndex(index) : setFocusIndex(null);
        return searchText;
      });
          clearTimeout(search_text_delay_timer);
          search_text_delay_timer = setTimeout(() => setFocusDropdownSearch(''), 2000);
    }
  };

  const onSuggestionKeyDownHandler = (e, optionListDisplay_) => {
    const optionListDisplay = (!searchText) ? optionListDisplay_ : filterListBySearchValue(optionListDisplay_, searchText, isTimeZone);
    if (disabled) return null;
    switch (e?.keyCode) {
      case KEY_CODES.ENTER:
        if (focusIndex !== null && isDropdownVisible) {
              const selectedValue = optionListDisplay[focusIndex];
             if (selectedValue) {
              if (isUserDropdown) onDropdownListClickHandler(selectedValue.userDetails._id);
              else onDropdownListClickHandler(selectedValue.value);
             } else setDropdownVisibility(false);
          } else {
            onDropdownClick(optionListDisplay_);
            // if (onSearchInputChange) setInputFocussed(true);
            // below code helps to focus the initial/selected value.
            // setFocusToInitialValue(optionListDisplay_);
            // setDropdownVisibility(true);
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
        if (e.target.id !== `editable-input-${id}`) { // If editable input is focused don't open dropdown options on clicking space bar
         e.stopPropagation();
        // (
        //   !isTextInputDropdown &&
        //   !isEditableDropdownInput &&
        //   !inputComponent &&
        //   !onInputChangeHandler &&
        //   !onSearchInputChange
        // ) && e.preventDefault();
        if (isDropdownVisible) onFocusFilter(e, optionListDisplay);
        else {
          e.preventDefault();
          onDropdownClick(optionListDisplay_);
         // if (onSearchInputChange) setInputFocussed(true);
          // below code helps to focus the initial/selected value.
         // setFocusToInitialValue(optionListDisplay_);
         // setDropdownVisibility(true);
        }
      }
        break;
      case KEY_CODES.ESCAPE:
        e.stopPropagation();
        e.preventDefault();
        setDropdownVisibility(false);
        break;
      case KEY_CODES.TAB:
        if (isMultiSectionDropdown && isDropdownVisible) {
          e.preventDefault();
          const inputNode = document.getElementById(multiSectionInputId);
          const btnNode = document.getElementById(multiSectionBtnId);
          if (document.activeElement === inputNode) {
              if (e.shiftKey) {
                onBlurHandler(null, true);
              } else {
                btnNode && btnNode.focus();
              }
          } else { // when the focus is in Btn (Multisection Dropdown)
              if (document.activeElement === btnNode) {
                if (e.shiftKey) {
                  inputNode && inputNode.focus();
                } else {
                  onBlurHandler(null, true);
                }
              } else {
                inputNode && inputNode.focus();
              }
            }
          setInputFocussed(true);
        }
        break;
      default:
        if (isDropdownVisible) onFocusFilter(e, optionListDisplay);
       // onFocusFilter(e, optionListDisplay);
        break;
    }
    return null;
  };

  const updateOptionListDisplay = (list) => setOptionListDisplay(list);

  const onTextFocusHandler = (event) => {
    if (isEmpty(event.target.value)) setDropdownVisibility(false);
    else {
      setDropdownVisibility(true);
      onFocusHandler(event);
    }
  };

  const onButtonClickHandler = (e) => {
    const { stopPropagationFromButton, waitForApiResponse } = props;
    if (stopPropagationFromButton) e.stopPropagation();
    if (!waitForApiResponse) setDropdownVisibility(false);
    onButtonClick(() => setDropdownVisibility(false));
  };

  const onInputBlurHandler = (e) => {
    setInputFocussed(false);
    const { waitForApiResponse } = props;
    if ((e.relatedTarget && e.relatedTarget.id === buttonId) && (waitForApiResponse)) return;
    if (isMultiSectionDropdown) {
      const inputNode = document.getElementById(multiSectionInputId);
      const btnNode = document.getElementById(multiSectionBtnId);
      if (inputNode === e.target && btnNode === e.relatedTarget) return;
    }
    console.log('onInputblur');
    // onBlurHandler(null, true);
  };

  const onInputMouseDownHandler = () => {
    setInputFocussed(true);
  };

  const onInputSetClicked = () => {
    onBlurHandler(null, true);
  };

 // Below code helps to generate error message if current and future date are equal.
  const currentDate = new Date().toISOString().slice(0, 10);
  let tempErrorMessage = EMPTY_STRING;
  if (
    futureTime &&
    jsUtils.isEmpty(errorMessage) &&
    currentDate === futureTime
  ) {
    const currentTime = new Date()
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      .toUpperCase();

    tempErrorMessage =
      moment(currentTime, 'hh:mm A').format('HH:mm') >
        moment(selectedValue, 'hh:mm A').format('HH:mm') && !isEmpty(futureTime)
        ? 'Enter a future time'
        : EMPTY_STRING;

    if (tempErrorMessage !== EMPTY_STRING) errorMessage = tempErrorMessage;
  }

 // Dropdown Input Style.
  let dropdownInput = null;
  if (isEditableDropdownInput) {
    // isEditableDropdownInput- used in DatePicker (time picker)
    dropdownInput = (
      <Input
        hideBorder
        hideLabel
        hideMessage
        inputAriaLabelledBy={id}
        placeholder={placeholder}
        className={cx(
          gClasses.Flex1,
          !selectedValue && gClasses.NoPointerEvent,
        )}
        inputContainerClasses={styles.EditableDropdownInput}
        value={selectedValue}
        onChangeHandler={(event) =>
          onDropdownListClickHandler(jsUtils.get(event, 'target.value'))
        }
        onBlurHandler={onEditableInputBlurHandler}
        onKeyDownHandler={(event) => onSuggestionKeyDownHandler(
          event,
          (updatedDropdownOptionList.length > 0) ? updatedDropdownOptionList_ : optionList_,
          )
        }
        size={inputSize}
        disabled={disabled}
        referenceName={referenceName}
        id={`editable-input-${id}`}
      />
    );
  } else if (isTextInputDropdown) {
    dropdownInput = (
      <Input
        hideBorder
        hideLabel
        hideMessage
        placeholder={placeholder}
        className={cx(gClasses.Flex1)}
        inputContainerClasses={styles.EditableDropdownInput}
        value={inputState}
        onChangeHandler={(event) =>
          onDropdownListClickHandler(jsUtils.get(event, 'target.value'))
        }
        onBlurHandler={() => setDropdownVisibility(false)}
        onKeyDownHandler={(event) => onSuggestionKeyDownHandler(
          event,
          (updatedDropdownOptionList.length > 0) ? updatedDropdownOptionList_ : optionList_,
          )
        }
        onFocusHandler={onTextFocusHandler}
        readOnly={onlyAllowDropdownValueChange}
        inputVariant={INPUT_VARIANTS.TYPE_4}
        referenceName={referenceName}
      />
    );
  } else {
    dropdownInput = (
      <div
        className={cx(contentStyle, customContentStyle, customDisplay ? BS.W100 : null, {
          [BS.JC_END]: rtl,
        })}
        ui-auto={referenceName}
      >
        {customDisplay || content}
        {tabBased ? (
          <div
            className={cx(BS.P_ABSOLUTE, BS.W100, gClasses.SelectedTab)}
            style={{
              backgroundColor: (!isSortDropdown && !isCustomFilterDropdown) && buttonColor,
              bottom: '-8px',
            }}
          />
        ) : null}
      </div>
    );
  }

  const dropdownArrowButtonClasses = isEditableDropdownInput
    ? cx(BS.H100, gClasses.CenterVH, gClasses.CursorPointer)
    : gClasses.CenterH;

  const modifiedOnDropdownClick = () => {
    const opitonList = ((updatedDropdownOptionList.length > 0) ? updatedDropdownOptionList_ : optionList_) || [];
    onDropdownClick(opitonList);
  };
  let dropdownOnClickFunction = null;
  let dropdownInnerClasses = null;
  if (isEditableDropdownInput) {
    if (!selectedValue && !disabled) {
      dropdownOnClickFunction = modifiedOnDropdownClick;
      dropdownInnerClasses = gClasses.CursorPointer;
    }
  } else if (isTextInputDropdown) {
    // no action.
  } else {
    dropdownOnClickFunction = modifiedOnDropdownClick;
    dropdownInnerClasses = gClasses.CursorPointer;
  }

 // Enable Search if option list is more than 5 depend o the enableSearch(boolean).
  const enableSearchOptions = enableSearch;
    // ? nullCheck(optionList, 'length', true) &&
    // optionList.length > 5
    // : enableSearch;

 // Construct instruction , if option list has any deactivated option.
  const activedescendant = (optionList_ && optionList_[focusIndex] && (optionList_[focusIndex].label || optionList_[focusIndex].value));
  const deactivatedValueInstruction = displayDeactivatedValue && deactivatedValue && (
    <div
      className={cx(
        gClasses.MT5,
        gClasses.FontSize,
        gClasses.Fone12GrayV4,
        gClasses.WordWrap,
        gClasses.FontStyleNormal,
      )}
    >
      {`Deactivated option (${deactivatedValue}) is selected`}
    </div>
  );
  const ariaLabelledbyId = `${textId && textId + SPACE}${labelId || placeholderId}${errorMessage ? SPACE + helperMessageId : EMPTY_STRING}`;
  console.log('asdfkjlasjdfasdf', (updatedDropdownOptionList.length > 0), updatedDropdownOptionList_, optionList_, optionList);
  return (
    <div
      className={cx(BS.P_RELATIVE, className, gClasses.Outline0, !(isBorderLess || hideMessage) && !isChart && gClasses.MB12)}
      style={{ style }}
    >
      {(isBorderLess || hideLabel) ? null : (
         <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <Label
            labelFor={id}
            id={textId || labelId}
            content={label}
            isDataLoading={isDataLoading}
            isRequired={isRequired}
            message={helperTooltipMessage}
            toolTipId={helperToolTipId}
            innerClassName={labelClassName}
            labelFontClass={labelClass}
            labelFontClassAdmin={labelClassAdmin}
            formFieldBottomMargin
            labelStyles={labelClass}
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
        <Skeleton className={styles.DropdownInputLoader} />
      ) : (
        <div>
            {isFromMoreFilter && (
            <CloseIcon
              className={cx(
                styles.closeIcon,
                gClasses.ML10,
                BS.JC_END,
                gClasses.CursorPointer,
                BS.P_ABSOLUTE,
              )}
              onClick={onCloseMoreFilter}
              isButtonColor
              tabIndex={0}
              ariaLabel={`Remove ${label} filter`}
              role={ARIA_ROLES.BUTTON}
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onCloseMoreFilter()}
            />
          )}
        <div
          role="combobox"
          id={`combo-box-${id}`}
          tabIndex={disabled ? -1 : 0}
          onBlur={onBlurHandler}
          onKeyDown={(event) => {
            onSuggestionKeyDownHandler(event, (updatedDropdownOptionList.length > 0) ? updatedDropdownOptionList_ : optionList_);
            ondropdownKeydown && ondropdownKeydown(event);
          }}
          className={cx(styles.OutlineClass, comboboxClass, { [gClasses.FormFieldMinWidth]: !isCustomFilterDropdown }, BS.W100)}
          aria-haspopup={ARIA_ROLES.LIST_BOX}
          aria-expanded={isDropdownVisible}
          aria-controls={isDropdownVisible ? dropdownListid : EMPTY_STRING}
          ref={inputRef}
          aria-labelledby={ariaLabelledbyId || null}
          onClick={(e) => {
            if (e.target.id === `combo-box-${id}`) {
                onDropdownClick((updatedDropdownOptionList.length > 0) ? updatedDropdownOptionList_ : optionList_);
            }
          }}
          aria-activedescendant={activedescendant}
        >
          <div className={cx(outerClassName, { [BS.D_FLEX]: isCustomFilterDropdown }, { [BS.ALIGN_ITEM_CENTER]: isCustomFilterDropdown }, { [gClasses.FormFieldMinWidth]: !isCustomFilterDropdown }, comboboxClass)}>
            <div
              className={cx(
                { [gClasses.InputHeight36]: !isBorderLess },
                { [styles.UserDropdown]: isUserDropdown },
                { [gClasses.InputBorder]: !errorMessage && !isBorderLess },
                {
                  [gClasses.ErrorInputBorder]:
                    (errorMessage || errorBorder) && !isBorderLess,
                },
                { [gClasses.NoPointerEvent]: disabled },
                { [styles.DisabledDropdown]: disabled },
                { [gClasses.ReadOnlyBg]: !!onlyAllowDropdownValueChange },
                gClasses.InputBorderRadius,
                { [gClasses.InputPaddingV4]: !noInputPadding },
                gClasses.FTwo13BlackV17,
                BS.D_FLEX,
                gClasses.CenterV,
                gClasses.Outline0,
                dropdownInnerClasses,
                { [BS.JC_BETWEEN]: isNewInput },
                innerClassName,
                inputDropdownContainer,
                comboboxClass,
                heightClassName,
              )}
              onClick={dropdownOnClickFunction}
              role="presentation"
              id={id}
              ref={setReferencePopperElement}
            >
              {dropdownInput}
              {showReset && selectedValue && (
                <CloseIconNew
                  role={ARIA_ROLES.BUTTON}
                  tabIndex={0}
                  className={cx(gClasses.MR4, gClasses.TransparentBtn)}
                  height={8}
                  width={8}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFilterClear();
                  }}
                  onKeyDown={(e) => {
                    if (keydownOrKeypessEnterHandle(e)) {
                      e.stopPropagation();
                      handleFilterClear();
                    }
                  }}
                  ariaLabel={DROPDOWN_STRINGS.CLEAR}
                />
              )}
              {(!isSortDropdown && !(isCustomFilterDropdown && (selectedValue !== null && selectedValue !== ''))) && (
                <div
                  role="presentation"
                  className={cx(
                    styles.DropDownArrowContainer,
                    dropdownArrowButtonClasses,
                    {
                      [BS.D_NONE]: !!(
                        isUserDropdown ||
                        customDisplay ||
                        isTextInputDropdown
                      ),
                    },
                  )}
                  onClick={isEditableDropdownInput ? modifiedOnDropdownClick : null}
                >
                 {dropdownArrowIcon ? (
                  <div>
                    {dropdownArrowIcon}
                  </div>
                  ) : (
                  <div
                    className={cx(
                      gClasses.DropdownArrow,
                      gClasses.ML5,
                      disableClass,
                    )}
                    style={{
                      borderTopColor: '#959BA3',
                    }}
                  />
                 )}
                </div>
                 )}
            </div>
            {(!isSummaryMenu && isCustomFilterDropdown && (selectedValue !== null && selectedValue !== '')) &&
            <CloseIconNew
            onClick={handleFilterClear}
            fillClass="#217cf5"
            className={cx(styles.FilterClear, gClasses.TransparentBtn)}
            width={10}
            height={10}
            role={ARIA_ROLES.BUTTON}
            onKeyDown={(e) => {
              e.stopPropagation();
              keydownOrKeypessEnterHandle(e) && handleFilterClear();
            }}
            ariaLabel={DROPDOWN_STRINGS.CLEAR}
            tabIndex={0}
            />}
          </div>
          <ConditionalWrapper
            condition={!disablePopper}
            wrapper={(children) => (
              <AutoPositioningPopper
                referenceElement={referencePopperElement}
                placement={popperPlacement}
                className={popperClass}
                style={popperStyles}
                allowedAutoPlacements={popperAllowedAutoPlacements}
                fallbackPlacements={popperFallbackPlacements}
                isPopperOpen={isDropdownVisible}
                fixedStrategy={fixedPopperStrategy}
              >
                {children}
              </AutoPositioningPopper>
            )}
          >
            {isTextInputDropdown && isEmpty(optionList) ? null : (
              <DropdownList
                suggestionRef={activeSuggestionRef}
                suggestionIndex={focusIndex}
                optionList={(updatedDropdownOptionList.length > 0) ? updatedDropdownOptionList_ : optionList_}
                isVisible={isDropdownVisible}
                customListClasses={customListClasses}
                customClassIndices={customClassIndices}
                onClick={onDropdownListClickHandler}
                onSearchInputChange={onSearchInputChange}
                enableSearch={enableSearchOptions}
                isTimeZone={isTimeZone}
                placeholder={placeholder}
                onInputChangeHandler={onInputChangeHandler}
                onButtonClick={onButtonClickHandler}
                onInputMouseDownHandler={onInputMouseDownHandler}
                onInputBlurHandler={onInputBlurHandler}
                inputValue={inputValue}
                textId={textId}
                isBorderLess={isBorderLess}
                textError={textError}
                onKeyDownHandler={onKeyDownHandler}
                isMultiSelect={isMultiSelect}
                isMultiSelectWithMultiSection={isMultiSelectWithMultiSection}
                selectedValue={selectedValue}
                isNewDropdown={isNewDropdown}
                isSortDropdown={isSortDropdown}
                isCustomFilterDropdown={isCustomFilterDropdown}
                buttonColor={buttonColor}
                customInputPaddingClass={customInputPaddingClass}
                buttonIconColor={buttonIconColor}
                isTaskDropDown={isTaskDropDown}
                isUserDropdown={isUserDropdown}
                noAbsolutePosition={isTable || !disablePopper}
                isTable={isTable}
                isCustomDisplay={!!customDisplay}
                isPaginated={isPaginated}
                hasMore={hasMore}
                loadDataHandler={loadMoreDataOnScroll}
                inputComponent={inputComponent}
                dropdownListLabel={dropdownListLabel}
                ButtonLabelMultiSectionDropdown={ButtonLabelMultiSectionDropdown}
                onInputSetClicked={onInputSetClicked}
                isMultiSectionDropdown={isMultiSectionDropdown}
                className={dropdownListClasses}
                isCountryCodeList={isCountryCodeList}
                optionsNoWrap={optionsNoWrap}
                optionListDropDown={optionListDropDown}
                InputContainerClassName={InputContainerClassName}
                isNewInput={isNewInput}
                optionListClassName={optionListClassName}
                hideDropdownListLabel={hideDropdownListLabel}
                updateOptionListDisplay={updateOptionListDisplay}
                multiSectionClassName={multiSectionClassName}
                listInputClass={dropdownListInputClass}
                dropdownListCreateLabel={dropdownListCreateLabel}
                dropdownListChooseLabel={dropdownListChooseLabel}
                optionContainerClassName={optionContainerClassName}
                dropdownListNotFoundLabel={dropdownListNotFoundLabel}
                setFocusIndex={setFocusIndex}
                searchText={searchText}
                setSearchText={setSearchText}
                id={dropdownListid}
                disableLoader={disableLoader}
                buttonId={buttonId}
                hideOptionInput={hideOptionInput}
                enableOnClick={enableOnClick}
                ListButtonClass={ListButtonClass}
                dropdownListVisibilityConditionProps={dropdownListVisibilityConditionProps}
                isUserDropdownLabel={isUserDropdownLabel}
                onSetClicked={onSetClicked}
                setValueError={setValueError}
                setValuePlaceholder={setValuePlaceholder || placeholder}
                showReset={showReset}
                loadingOptionList={loadingOptionList}
                searchInputPlaceholder={searchInputPlaceholder}
                searchInputIcon={searchInputIcon}
                inputContainerShortcutStyle={inputContainerShortcutStyle}
                inputTextContainerStyle={inputTextContainerStyle}
                checkboxViewClassName={checkboxViewClassName}
                isCategoryDropdown={isCategoryDropdown}
                isCustomLogin={isCustomLogin}
              />
            )}
          </ConditionalWrapper>
        </div>
        </div>
      )}
      {instructionMessage && (
        <div
          className={cx(
            gClasses.MT5,
            gClasses.Fone12GrayV4,
            gClasses.WordWrap,
            gClasses.FontStyleNormal,
            instructionClass,
          )}
        >
          {instructionMessage}
        </div>
      )}
      {deactivatedValueInstruction}
      {(isBorderLess || hideMessage || !errorMessage) ? null : (
        <HelperMessage
          id={helperMessageId}
          type={HELPER_MESSAGE_TYPE.ERROR}
          message={errorMessage}
          ariaLabelHelperMessage={ariaLabelHelperMessage}
          className={cx(gClasses.ErrorMarginV1, errorMessageClassName)}
          ariaHidden={!helperAriaHidden}
          role={ARIA_ROLES.ALERT}
          noMarginBottom={noMarginBottom}
        />
      )}
    </div>
  );
}

Dropdown.propTypes = {
  errorMessage: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  isDataLoading: PropTypes.bool,
  placeholder: PropTypes.string,
  hideMessage: PropTypes.bool,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.any),
  ]),
  className: PropTypes.string,
  isBorderLess: PropTypes.bool,
  rtl: PropTypes.bool,
  optionList: PropTypes.arrayOf(PropTypes.any),
  onInputChangeHandler: PropTypes.func,
  onSearchInputChange: PropTypes.func,
  onButtonClick: PropTypes.func,
  inputValue: PropTypes.string,
  textId: PropTypes.string,
  onChange: PropTypes.func,
  loadData: PropTypes.func,
  textError: PropTypes.string,
  hideLabel: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
  disabled: PropTypes.bool,
  innerClassName: PropTypes.string,
  isRequired: PropTypes.bool,
  isMultiSelect: PropTypes.bool,
  setSelectedValue: PropTypes.bool,
  strictlySetSelectedValue: PropTypes.bool,
  helpText: PropTypes.string,
  enableSearch: PropTypes.bool,
  isTimeZone: PropTypes.bool,
  isTaskDropDown: PropTypes.bool,
  isTextInputDropdown: PropTypes.bool,
  noInputPadding: PropTypes.bool,
  isNewDropdown: PropTypes.bool,
  isSortDropdown: PropTypes.bool,
  /** not used */
  isUserDropdown: PropTypes.bool,
  disablePopper: PropTypes.bool,
  isTable: PropTypes.bool,
  showNoDataFoundOption: PropTypes.bool,
  noDataFoundOptionLabel: PropTypes.string,
  isPaginated: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadDataHandler: PropTypes.func,
  fixedPopperStrategy: PropTypes.bool,
  popperClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isEditableDropdownInput: PropTypes.bool,
  inputSize: PropTypes.number,
  onlyAllowDropdownValueChange: PropTypes.bool,
  labelClassName: PropTypes.string,
  disableClass: PropTypes.string,
  editIcon: PropTypes.element,
  deleteIcon: PropTypes.element,
  labelClass: PropTypes.element,
  updatedDropdownOptionList: PropTypes.arrayOf(PropTypes.any),
  optionsNoWrap: PropTypes.bool,
  customListClasses: PropTypes.element,
  customClassIndices: PropTypes.element,
  isAdminSearchSort: PropTypes.bool,
  initialValue: PropTypes.string, // initialValue to be focused
  focusInitialValue: PropTypes.number, // Enable focus initial value
  customContentStyle: PropTypes.string,
  hideDropdownListLabel: PropTypes.bool,
  placeholderClassName: PropTypes.string,
  multiSectionClassName: PropTypes.string,
  dropdownListCreateLabel: PropTypes.string,
  dropdownListChooseLabel: PropTypes.string,
  ButtonLabelMultiSectionDropdown: PropTypes.string,
  optionContainerClassName: PropTypes.string,
  dropdownListNotFoundLabel: PropTypes.string,
  outerClassName: PropTypes.string,
  disableFocusFilter: PropTypes.bool,
  newDropdownCustomClass: PropTypes.string,
  isFromMoreFilter: PropTypes.bool,
  isSortTeamUser: PropTypes.bool,
  ondropdownKeydown: PropTypes.func,
  isChart: PropTypes.bool,
  onSetClicked: PropTypes.func,
  customPlaceholderStyle: PropTypes.string,

};

Dropdown.defaultProps = {
  errorMessage: EMPTY_STRING,
  id: null,
  label: EMPTY_STRING,
  isDataLoading: false,
  placeholder: i18next.t(DROPDOWN_CONSTANTS.SELECT),
  hideMessage: false,
  selectedValue: null,
  className: EMPTY_STRING,
  isBorderLess: false,
  rtl: false,
  optionList: [],
  updatedDropdownOptionList: [],
  onInputChangeHandler: null,
  onSearchInputChange: null,
  onButtonClick: null,
  inputValue: EMPTY_STRING,
  textId: EMPTY_STRING,
  onChange: null,
  loadData: null,
  textError: EMPTY_STRING,
  hideLabel: false,
  onKeyDownHandler: null,
  disabled: false,
  innerClassName: EMPTY_STRING,
  isRequired: false,
  isMultiSelect: false,
  setSelectedValue: false,
  strictlySetSelectedValue: false,
  helpText: EMPTY_STRING,
  enableSearch: false,
  isTimeZone: false,
  isTaskDropDown: false,
  isTextInputDropdown: false,
  noInputPadding: false,
  isNewDropdown: false,
  isSortDropdown: false,
  isUserDropdown: false,
  disablePopper: false,
  isTable: false,
  showNoDataFoundOption: false,
  noDataFoundOptionLabel: i18next.t(DROPDOWN_STRINGS.NO_DATA_FOUND_DEFAULT_LABEL),
  isPaginated: false,
  hasMore: true,
  loadDataHandler: null,
  fixedPopperStrategy: false,
  popperClasses: EMPTY_STRING,
  isEditableDropdownInput: false,
  isSortTeamUser: false,
  onlyAllowDropdownValueChange: false,
  labelClassName: EMPTY_STRING,
  disableClass: EMPTY_STRING,
  editIcon: null,
  deleteIcon: null,
  labelClass: null,
  optionsNoWrap: false,
  customListClasses: null,
  customClassIndices: null,
  isAdminSearchSort: false,
  customContentStyle: EMPTY_STRING,
  hideDropdownListLabel: false,
  placeholderClassName: EMPTY_STRING,
  multiSectionClassName: EMPTY_STRING,
  dropdownListCreateLabel: EMPTY_STRING,
  dropdownListChooseLabel: EMPTY_STRING,
  ButtonLabelMultiSectionDropdown: EMPTY_STRING,
  optionContainerClassName: EMPTY_STRING,
  dropdownListNotFoundLabel: EMPTY_STRING,
  outerClassName: EMPTY_STRING,
  disableFocusFilter: false,
  newDropdownCustomClass: EMPTY_STRING,
  isFromMoreFilter: false,
  ondropdownKeydown: null,
  isChart: false,
  onSetClicked: null,
  customPlaceholderStyle: EMPTY_STRING,
};

export default Dropdown;
