import React, {
  useContext,
    useEffect,
    useState,
} from 'react';
import cx from 'classnames/bind';
import gClasses from 'scss/Typography.module.scss';
import { BS } from 'utils/UIConstants';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import SearchIcon from 'assets/icons/SearchIcon';
import LeftIcon from 'assets/icons/LeftIcon';
import { generateEventTargetObject } from 'utils/generatorUtils';
import { isEmpty, isNull, removeAllSpaces } from 'utils/jsUtility';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import Tooltip from 'components/tooltip/Tooltip';
import { Button, EButtonType, EPopperPlacements, NestedDropdown, TextInput } from '@workhall-pvt-lmt/wh-ui-library';
import styles from './ButtonDropdown.module.scss';
import ThemeContext from '../../hoc/ThemeContext';

function ButtonDropdown(props) {
    const {
        id,
        className,
        initialButtonLabel,
        optionList,
        selectedValue,
        backButtonLabel,
        showSelectedValTooltip = false,
        dropdownChangeHandler,
        handleCreateClick,
        primaryButtonLabel,
        inputPlaceholder,
        secondaryButtonLabel,
        searchBarPlaceholder,
        createBtnLabel,
        hideMessage,
        errorMessage,
        footerClass,
        loadData,
        showLabel = false,
        onOptionSearch = null,
        createValidation = null,
        setInitialSearchText,
        initialSearchText,
        noDataText,
        isLoading,
        hideSearch = false,
    } = props;

    const { colorSchemeDefault } = useContext(ThemeContext);

    const [currentPage, setPageIndex] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [buttonValue, setSelectedValue] = useState(selectedValue || initialButtonLabel);
    const [createError, setCreateError] = useState('');

    let dropdownOptionList = null;

    useEffect(() => {
        if (setInitialSearchText && currentPage === 1) {
            setCategoryName(initialSearchText || EMPTY_STRING);
        }
    }, [currentPage]);

    useEffect(() => {
        setSelectedValue(selectedValue || initialButtonLabel);
    }, [selectedValue]);

    const clearValues = () => {
        setPageIndex(0);
        setCreateError(EMPTY_STRING);
        setCategoryName(EMPTY_STRING);
        setSearchValue(EMPTY_STRING);
        if (onOptionSearch) onOptionSearch(EMPTY_STRING);
    };

    const closeDropdown = () => {
        clearValues();
    };

    const onListOptionClick = (e, value, option, close) => {
        e.stopPropagation();
        if (option?.is_disabled) return;

        const eventObject = generateEventTargetObject(id, value);
        eventObject.target = { ...eventObject?.target, ...option };
        dropdownChangeHandler(eventObject);
        if (showLabel) setSelectedValue(option.label);
        else setSelectedValue(value);
        closeDropdown();
        if (close) close();
    };

    const onCreateBtnClick = () => {
        setPageIndex(1);
    };

    dropdownOptionList = (close) => optionList?.map((option) =>
        <div
            key={option?.value}
            id={option.ID}
            className={cx(
                styles.ListOption,
                gClasses.CursorPointer,
                selectedValue === option?.value && styles.selectedValueClass,
                option.disabled === true &&
            cx(gClasses.NoPointerEvent, styles.DisabledDropdown))}
            onClick={(e) => onListOptionClick(e, option.value, option, close)}
            tabIndex={0}
            role="option"
            aria-selected={buttonValue === option.value}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onListOptionClick(e, option.value, option, close)}
        >
            {showLabel ? option?.label : option.value}
        </div>,
    );

    if (isEmpty(optionList)) {
        dropdownOptionList = () => (
            <div className={cx(styles.ListOption, styles.NoDataFound)}>
                {noDataText}
            </div>
        );
    }

    const onBackBtnClick = () => {
        clearValues();
    };

    const onCategoryInputChange = (event) => {
        setCreateError('');
        setCategoryName(event.target.value);
    };

    const handleCreateButtonClick = (e, close) => {
        e.stopPropagation();
        if (handleCreateClick) {
            let error = '';
            if (createValidation) {
                error = createValidation(categoryName);
            }
            if (isEmpty(error)) {
                setCreateError('');
                handleCreateClick(categoryName);
                setPageIndex(0);
                setSelectedValue(categoryName);
                closeDropdown();
                if (close) close();
                setCategoryName('');
            } else {
                setCreateError(error);
            }
        }
    };

    const handleCancelButtonClick = (e, close) => {
        e.stopPropagation();
        closeDropdown();
        if (close) close();
    };

    const searchOption = (e) => {
        setSearchValue(e.target.value);
        if (onOptionSearch) onOptionSearch(e?.target?.value);
    };

    const getDropdownMenu = (close) => {
      if (currentPage === 0) {
        return (
          <div>
            {
              !hideSearch && (
                <TextInput
                  onChange={searchOption}
                  value={searchValue}
                  placeholder={searchBarPlaceholder}
                  errorMessage={createError}
                  prefixIcon={<SearchIcon />}
                />
              )
            }
            <div className={styles.DropdownList}>
              {dropdownOptionList(close)}
            </div>
            <div
              className={cx(styles.CreateNewBtn, gClasses.CursorPointer)}
              tabIndex={0}
              role="button"
              onClick={onCreateBtnClick}
              onKeyDown={(e) =>
                keydownOrKeypessEnterHandle(e) && onCreateBtnClick()
              }
            >
              {createBtnLabel}
            </div>
          </div>
        );
      } else if (currentPage === 1) {
        return (
          <>
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
              {backButtonLabel}
            </div>
            <div className={styles.Input}>
              <TextInput
                onChange={onCategoryInputChange}
                value={categoryName}
                placeholder={inputPlaceholder}
                errorMessage={createError}
              />
            </div>
            <div className={cx(styles.Footer, footerClass)}>
              <div className={cx(gClasses.CenterV, BS.JC_END)}>
                <Button
                  buttonText={secondaryButtonLabel}
                  type={EButtonType.SECONDARY}
                  className={cx(BS.TEXT_NO_WRAP, gClasses.MR6)}
                  onClickHandler={(e) => handleCancelButtonClick(e, close)}
                  colorSchema={colorSchemeDefault}
                />
                <Button
                  buttonText={primaryButtonLabel}
                  type={EButtonType.PRIMARY}
                  className={cx(BS.TEXT_NO_WRAP)}
                  onClickHandler={(e) => handleCreateButtonClick(e, close)}
                />
              </div>
            </div>
          </>
        );
      } else {
        return null;
      }
    };

    let addBtnID = `open_dropdown_button_${id}`;
    addBtnID = removeAllSpaces(addBtnID);

    const onAddBtnClick = () => {
        if (loadData) loadData();
    };

    return (
      <>
        <NestedDropdown
          id={addBtnID}
          totalViews={2}
          displayText={buttonValue}
          popperClass="bg-white rounded-[2px] border shadow cursor-default"
          popperPlacement={EPopperPlacements.BOTTOM_START}
          onOpen={onAddBtnClick}
          onClose={closeDropdown}
          className={cx(styles.AddButton, gClasses.CursorPointer, className)}
          errorMessage={!hideMessage && errorMessage}
          isLoading={isLoading}
        >
          {({ close }) => getDropdownMenu(close)}
        </NestedDropdown>
        {selectedValue &&
          !isNull(document.getElementById(addBtnID)) &&
          showSelectedValTooltip && (
            <Tooltip id={addBtnID} content={buttonValue} isCustomToolTip />
          )}
      </>
    );
}

export default ButtonDropdown;
