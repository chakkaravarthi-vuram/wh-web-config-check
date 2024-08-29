import React, { useRef, useState } from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import gClasses from 'scss/Typography.module.scss';
import AutoPositioningPopper, {
  POPPER_PLACEMENTS,
} from 'components/auto_positioning_popper/AutoPositioningPopper';
import ChevronIcon from 'assets/icons/ChevronIcon';
import { BS } from 'utils/UIConstants';
import {
  keydownOrKeypessEnterHandle,
  useClickOutsideDetector,
} from 'utils/UtilityFunctions';
import LeftIcon from 'assets/icons/LeftIcon';
import { isEmpty, isArray } from 'utils/jsUtility';
import SearchIcon from 'assets/icons/SearchIcon';
import { SEND_DATALIST_DROPDOWN_TYPES } from 'containers/edit_flow/step_configuration/configurations/Configuration.strings';
import { ETextSize, Text, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './NestedDropdown.module.scss';

function NestedDropdown(props) {
  const {
    id,
    placeholder,
    dropdownPopperContainerClass,
    className,
    errorMessage,
    optionList,
    onChange,
    outerClassName,
    onBackBtnClick,
    backButtonDetails,
    dropdownClearHandler,
    selectedOption,
    hideMessage,
    onDropdownClickHandler,
    isDataLoading,
    searchBarPlaceholder,
    searchValue,
    handleSearchChange,
    enableSearch,
    selectedPath = [],
    mappingIndex,
    valueKey = 'value',
    expandButtonClick,
    disabled,
    listOuterClass,
    dropdownListClass,
    isExactPopperWidth = false,
  } = props;

  const [dropdownPopperReferenceElement, setDropdownPopperReferenceElement] =
    useState(null);
  const dropdownListElement = useRef();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const nestedDropdownWidth = document.getElementById(`${id}-${mappingIndex}`)?.clientWidth;

  const closeDropdown = (e, outsideClick = false) => {
    const dropdownInput = document.getElementById(`${id}-${mappingIndex}`);
    if (
      !outsideClick ||
      (dropdownInput && !dropdownInput?.contains(e.target))
    ) {
      setDropdownOpen(false);
      if (dropdownClearHandler) dropdownClearHandler();
    }
  };

  useClickOutsideDetector(dropdownListElement, (e) => closeDropdown(e, true));

  const handleDropdownOptionSelection = (e, option) => {
    if (onChange) {
      onChange(e, option, closeDropdown);
    }
    console.log('optionlist', option, optionList);
  };

  console.log('ID_nestedDD', id, 'backButtonDetails', backButtonDetails, 'enableSearch', enableSearch);

  const handleExpandButtonClick = (e, option) => {
    if (expandButtonClick) expandButtonClick(e, option, closeDropdown);
  };

  const dropdownOptionList = () => {
    console.log(optionList);
    return (
      optionList &&
      optionList.map((option, index) => {
        let isSelectedOption = false;
        console.log(selectedPath?.includes(option[valueKey]), selectedPath, option[valueKey], 'ccbvcvvbcdfg');
        if (
          (isArray(selectedPath) &&
            !isEmpty(selectedPath) &&
            selectedPath?.includes(option[valueKey])) ||
          selectedOption?.[valueKey] === option[valueKey]
        ) {
          isSelectedOption = true;
        }

        return (
          <div
            key={index}
            id={option.ID}
            className={cx(
              styles.ListOption,
              gClasses.CursorPointer,
              option.disabled === true &&
                cx(gClasses.NoPointerEvent, styles.DisabledDropdown),
              isSelectedOption && styles.SelectedOption,
              option.optionType ===
                SEND_DATALIST_DROPDOWN_TYPES.OPTION_LIST_TITLE &&
                styles.TitleOption,
              BS.D_FLEX,
              BS.JC_BETWEEN,
            )}
            onClick={(e) => handleDropdownOptionSelection(e, option)}
            tabIndex={0}
            role="option"
            aria-selected={isSelectedOption}
            onKeyDown={(e) =>
              keydownOrKeypessEnterHandle(e) &&
              handleDropdownOptionSelection(e, option)
            }
          >
            {option?.label}
            {option?.is_expand && (
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  keydownOrKeypessEnterHandle(e) &&
                  handleExpandButtonClick(e, option)
                }
                onClick={(e) => handleExpandButtonClick(e, option)}
                className={gClasses.ML10}
              >
                <span className={gClasses.MR4}>{option?.expand_count}</span>
                <LeftIcon
                  className={cx(styles.RightIcon, gClasses.Rotate180)}
                />
              </div>
            )}
          </div>
        );
      })
    );
  };

  const dropDownMenu = (
    <div className={cx(styles.DropdownListWrapper, listOuterClass)}>
      <div className={cx(styles.Wrap, gClasses.W100)} ref={dropdownListElement}>
        {!isEmpty(backButtonDetails) && (
          <div
            className={cx(BS.D_FLEX, styles.BackButton, gClasses.CursorPointer)}
            onClick={onBackBtnClick}
            tabIndex={0}
            role="button"
            onKeyDown={(e) =>
              keydownOrKeypessEnterHandle(e) && onBackBtnClick()
            }
          >
            <LeftIcon className={cx(gClasses.MR10, styles.LeftIcon)} />
            {backButtonDetails?.label}
          </div>
        )}
        {(!isEmpty(backButtonDetails) || enableSearch) && (
          <TextInput
            onChange={handleSearchChange}
            value={searchValue}
            placeholder={searchBarPlaceholder}
            prefixIcon={<SearchIcon />}
            className={styles.SearchField}
            autoFocus
          />
        )}
        <div className={cx(styles.DropdownList, gClasses.MT10, gClasses.MB10, dropdownListClass)}>
          {dropdownOptionList()}
        </div>
      </div>
    </div>
  );

  const dropdownPopper = isDropdownOpen && (
    <div tabIndex={0} role="button" className={BS.W100}>
      <AutoPositioningPopper
        className={gClasses.ZIndex151}
        placement={POPPER_PLACEMENTS.BOTTOM_START}
        fallbackPlacements={[POPPER_PLACEMENTS.TOP_START]}
        isPopperOpen={isDropdownOpen}
        referenceElement={dropdownPopperReferenceElement}
      >
        <div
          className={cx(styles.DropdownContainer, dropdownPopperContainerClass)}
          style={{ width: isExactPopperWidth && nestedDropdownWidth }}
        >
          {dropDownMenu}
        </div>
      </AutoPositioningPopper>
    </div>
  );

  const onDropdownBtnClick = () => {
    if (onDropdownClickHandler) onDropdownClickHandler(id, selectedOption);
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={outerClassName}>
      {isDataLoading ? (
        <Skeleton className={styles.DropdownInputLoader} />
      ) : (
        <div
          id={`${id}-${mappingIndex}`}
          tabIndex={0}
          role="button"
          className={cx(
            styles.DropdownButton,
            gClasses.CursorPointer,
            gClasses.WhiteBackground,
            className,
            gClasses.CenterV,
            errorMessage ? styles.ErrorInputBorder : gClasses.InputBorder,
            disabled && styles.DisabledField,
            BS.D_FLEX,
            BS.JC_BETWEEN,
          )}
          ref={setDropdownPopperReferenceElement}
          onClick={onDropdownBtnClick}
          onKeyDown={(e) =>
            keydownOrKeypessEnterHandle(e) && onDropdownBtnClick(e)
          }
        >
          <span
            title={selectedOption?.label || placeholder}
            className={cx(
              BS.W100,
              selectedOption?.[valueKey]
                ? styles.SelectedValue
                : styles.Placeholder,
              gClasses.Ellipsis,
            )}
          >
            {selectedOption?.label || placeholder}
          </span>
          <ChevronIcon className={cx(styles.ChevronIcon, gClasses.Rotate180)} />
        </div>
      )}
      {dropdownPopper}
      {!hideMessage && (
            <Text size={ETextSize.XS} content={errorMessage} className={cx(gClasses.red22, 'pt-1')} />
      )}
    </div>
  );
}

export default NestedDropdown;
