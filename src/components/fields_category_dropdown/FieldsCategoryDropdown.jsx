import React, { useRef, useState } from 'react';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import gClasses from 'scss/Typography.module.scss';
import AutoPositioningPopper, {
  POPPER_PLACEMENTS,
} from 'components/auto_positioning_popper/AutoPositioningPopper';
import ChevronIcon from 'assets/icons/ChevronIcon';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import {
  keydownOrKeypessEnterHandle,
  useClickOutsideDetector,
} from 'utils/UtilityFunctions';
import LeftIcon from 'assets/icons/LeftIcon';
import { isEmpty, isArray } from 'utils/jsUtility';
import HELPER_MESSAGE_TYPE from 'components/form_components/helper_message/HelperMessage.strings';
import HelperMessage from 'components/form_components/helper_message/HelperMessage';
import SearchIcon from 'assets/icons/SearchIcon';
import Input from 'components/form_components/input/Input';
import { SEND_DATALIST_DROPDOWN_TYPES } from 'containers/edit_flow/step_configuration/configurations/Configuration.strings';
import styles from './FieldsCategoryDropdown.module.scss';

function FieldsCategoryDropdown(props) {
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
    disabled,
  } = props;

  const [dropdownPopperReferenceElement, setDropdownPopperReferenceElement] =
    useState(null);
  const dropdownListElement = useRef();

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const closeDropdown = (e, outsideClick = false) => {
    const dropdownInput = document.getElementById(`${id}-${mappingIndex}`);
    if (!outsideClick || (dropdownInput && !dropdownInput?.contains(e.target))) {
      setDropdownOpen(false);
      if (dropdownClearHandler) dropdownClearHandler();
    }
  };

  useClickOutsideDetector(dropdownListElement, (e) => closeDropdown(e, true));

  const handleDropdownOptionSelection = (e, option) => {
    if (onChange) onChange(e, option, closeDropdown);
  };

  const dropdownOptionList = () => {
    console.log(optionList);
    return (
      optionList &&
      optionList.map((option, index) => {
        let isSelectedOption = false;

        if ((
          (isArray(selectedPath) &&
          !isEmpty(selectedPath) &&
          selectedPath?.includes(option.value)) ||
          selectedOption?.value === option.value
        )) {
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
            <div>
              <span className={gClasses.MR4}>{option?.expand_count}</span>
              <LeftIcon className={cx(styles.RightIcon, gClasses.Rotate180)} />
            </div>
          )}
        </div>
      );
          })
    );
  };

  const dropDownMenu = (
    <div className={styles.DropdownListWrapper}>
      <div className={styles.Wrap} ref={dropdownListElement}>
        {!isEmpty(backButtonDetails) && (
          <div
              className={cx(
                BS.D_FLEX,
                styles.BackButton,
                gClasses.CursorPointer,
              )}
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
        {
          (!isEmpty(backButtonDetails) || enableSearch) && (
            <Input
              className={styles.SearchField}
              placeholder={searchBarPlaceholder}
              value={searchValue}
              onChangeHandler={handleSearchChange}
              readOnlyPrefix={<SearchIcon />}
              hideLabel
              hideBorder
              hideMessage
            />
          )
        }
        <div className={cx(styles.DropdownList, gClasses.MT10, gClasses.MB10)}>{dropdownOptionList()}</div>
      </div>
    </div>
  );

  const buttonDropdownWidth = document.getElementById(`${id}-${mappingIndex}`)?.clientWidth;
  const dropdownPopper = isDropdownOpen && (
    <div tabIndex={0} role="button" className={BS.W100}>
      <AutoPositioningPopper
        className={gClasses.ZIndex151}
        placement={POPPER_PLACEMENTS.BOTTOM}
        fallbackPlacements={[POPPER_PLACEMENTS.TOP]}
        isPopperOpen={isDropdownOpen}
        referenceElement={dropdownPopperReferenceElement}
      >
        <div
          className={cx(styles.DropdownContainer, dropdownPopperContainerClass)}
          style={{ width: buttonDropdownWidth }}
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
            className,
            gClasses.CenterV,
            errorMessage ? gClasses.ErrorInputBorder : gClasses.InputBorder,
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
              selectedOption?.value ? styles.SelectedValue : styles.Placeholder,
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
        <HelperMessage
          type={HELPER_MESSAGE_TYPE.ERROR}
          message={errorMessage}
          className={cx(gClasses.ErrorMarginV1)}
          role={ARIA_ROLES.ALERT}
          noMarginBottom
        />
      )}
    </div>
  );
}

export default FieldsCategoryDropdown;
