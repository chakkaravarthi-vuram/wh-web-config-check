// @import '../../../../scss/constants';
import React, { useContext, useEffect } from 'react';
import cx from 'classnames/bind';
import propTypes from 'prop-types';
// import InfiniteScroll from 'react-infinite-scroller';
import TeamsListContentLoader from 'components/content_loaders/teams_contenbt_loaders/TeamsListContentLoader';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';
import Input, { INPUT_VARIANTS } from '../../input/Input';
import CheckboxGroup from '../../checkbox_group/CheckboxGroup';
import UserCard from '../../../user_card/UserCard';
import ConditionalWrapper from '../../../conditional_wrapper/ConditionalWrapper';
import Label from '../../label/Label';
import Button from '../../button/Button';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from '../../helper_message/HelperMessage';

import jsUtils from '../../../../utils/jsUtility';
import { filterListBySearchValue, keydownOrKeypessEnterHandle } from '../../../../utils/UtilityFunctions';
import {
  ACTION_STRINGS,
  EMPTY_STRING,
} from '../../../../utils/strings/CommonStrings';
import { ARIA_ROLES, BS, COLOR_CONSTANTS } from '../../../../utils/UIConstants';
import flagClasses from '../../flags/Flags.css';
import gClasses from '../../../../scss/Typography.module.scss';
import styles from './DropdownList.module.scss';
import { DROPDOWN_STRINGS } from '../Dropdown.strings';
import ThemeContext from '../../../../hoc/ThemeContext';

function DropdownList(props) {
 // const [searchText, setSearchText] = useState(EMPTY_STRING);
  const onInputChangeHandlerFunc = (event) => {
    // setInputText(event);
    if (props.onInputChangeHandler) {
      props.onInputChangeHandler(event);
    }
  };

  const {
    optionList: unFilteredList,
    isVisible,
    className,
    textId,
    buttonId,
    textError,
    button,
    isBorderLess,
    placeholder,
    setValuePlaceholder = EMPTY_STRING,
    inputContainerShortcutStyle,
    inputTextContainerStyle,
    inputValue,
    onKeyDownHandler,
    onInputBlurHandler,
    onInputMouseDownHandler,
    onSearchInputChange,
    onButtonClick,
    onClick,
    onInputChangeHandler,
    isMultiSelect,
    selectedValue,
    isNewDropdown,
    buttonColor,
    buttonIconColor,
    noAbsolutePosition,
    isTaskDropDown,
    checkboxViewClassName,
    isUserDropdown,
    isCustomDisplay,
    isPaginated,
    hasMore,
    loadingOptionList,
    loadDataHandler,
    inputComponent,
    customInputPaddingClass,
    dropdownListLabel,
    onInputSetClicked,
    isMultiSectionDropdown, enableSearch, isTimeZone,
    optionsNoWrap,
    optionListDropDown,
    isNewInput,
    InputContainerClassName,
    listInputClass,
    customListClasses,
    customClassIndices,
    suggestionIndex,
    suggestionRef,
    optionListClassName,
    hideDropdownListLabel,
    multiSectionClassName,
    dropdownListCreateLabel,
    dropdownListChooseLabel,
    ButtonLabelMultiSectionDropdown,
    optionContainerClassName,
    dropdownListNotFoundLabel,
    isCountryCodeList,
    searchText,
    setSearchText,
    id,
    disableLoader,
    isMultiSelectWithMultiSection,
    hideOptionInput,
    enableOnClick = false,
    ListButtonClass,
    dropdownListVisibilityConditionProps,
    isUserDropdownLabel,
    onSetClicked = null,
    setValueError = EMPTY_STRING,
    showReset,
    searchInputPlaceholder = null,
    searchInputIcon,
    isCategoryDropdown,
    isCustomLogin,
  } = props;

  const { t } = useTranslation();
  console.log(isVisible, 'ddListisVisiblehsw', 'loadingOptionList', loadingOptionList, 'hasMore', hasMore);
  const containerId = id || 'dropDownListId';
  const multiSectionInputId = `${id}_multisection_input`;
  const multiSectionBtnId = `${id}_multisection_btn`;
  const { colorScheme } = useContext(ThemeContext);
// This useEffect helps to update the optionlist based on search text
  useEffect(() => {
    const { updateOptionListDisplay } = props;
    if (updateOptionListDisplay) {
      let optionList = unFilteredList;
      if (enableSearch && !onSearchInputChange) {
        optionList = filterListBySearchValue(unFilteredList, searchText, isTimeZone);
      }
      updateOptionListDisplay(optionList);
    }
  }, [searchText]);

  let optionList = unFilteredList;

  // Get the optionList based on inputValue ,if its not empty.
  // value in the inputValue, is meant to add in the optionlist eg: used for add category, add status
  if (!jsUtils.isEmpty(inputValue)) {
    console.log('nputVialue 12121', inputValue, inputValue, optionList);
    optionList = filterListBySearchValue(optionList || [], inputValue.trim(), isTimeZone);
  }

  // Below code helps to get optionlist based on searchText
  if (enableSearch && !onSearchInputChange) {
    optionList = filterListBySearchValue(unFilteredList, searchText, isTimeZone);
  }
  let header = false;
  const defaultOption = { label: placeholder, value: placeholder };
  console.log('optionlist', optionList);
  // Construct Entire Option List.
  let optionLists = [];
  if (jsUtils.isArray(optionList) && optionList.length > 0) {
    optionLists = optionList.map((option, index) => {
          if (!option || jsUtils.isEmpty(option)) return null;

          let labelContent = null;
          let selectedClass = null;
          const optionReference = ((suggestionIndex === index)) ? suggestionRef : null;

          if (option && option.header) {
            selectedClass = styles.HeaderOption;
            header = true;
          }

                      // Option List style
                        if (isMultiSelect) {
                          let isSelected = false;
                          if (jsUtils.isArray(selectedValue) && selectedValue.length > 0) {
                            const processedSelectedValue = selectedValue.map((value) => {
                              if (jsUtils.isObject(value)) return value.value;
                              return value;
                            });
                            isSelected = processedSelectedValue.includes(option.value);
                          }
                          labelContent = option.isNoDataLabel ? <div>{option.label}</div> : (
                            <CheckboxGroup
                              optionList={[{ label: option.label, value: option.value }]}
                              selectedValues={[isSelected ? option.value : null]}
                              hideLabel
                              hideMessage
                              isMultiSelectDropdown
                              checkboxViewClassName={checkboxViewClassName}
                            />
                          );
                        } else if (isUserDropdown) {
                          labelContent = (
                            <UserCard
                              firstName={option.userDetails.first_name}
                              lastName={option.userDetails.last_name}
                              accountId={option.userDetails._id}
                              onClick={() => onClick(option.userDetails._id)}
                              className={cx(
                                { opacity: option.value === selectedValue ? 0.5 : 1 },
                                BS.W100,
                              )}
                              isBorderLess
                              selectedAccountId={selectedValue}
                            />
                          );
                        } else if (isNewDropdown) {
                          labelContent = (
                            <div className={cx(BS.D_FLEX)}>
                              {option.icon ? (
                                <>
                                  <div
                                    className={cx(
                                      styles.DropdownListVisibilityConditionA,
                                      styles.LabelViewIconColor,
                                      dropdownListVisibilityConditionProps,
                                      gClasses.MR14,
                                    )}
                                    style={{
                                      fill: option.value === selectedValue && buttonIconColor,
                                    }}
                                  >
                                    {option.icon}
                                  </div>
                                  <div
                                    className={cx(
                                      styles.DropdownListVisibilityConditionB,
                                      gClasses.MR14,
                                    )}
                                    style={{
                                      fill: buttonColor,
                                    }}
                                  >
                                    {option.icon}
                                  </div>
                                </>
                              ) : null}
                              <div
                                className={cx(
                                  option.value === selectedValue && styles.selectedText, isUserDropdownLabel,
                                )}
                                disabled={option.disabled || false}
                              >
                                {option.label}
                              </div>
                            </div>
                          );
                        } else if (isMultiSectionDropdown) {
                          if (isMultiSelectWithMultiSection) {
                            let isSelected = false;
                            if (jsUtils.isArray(selectedValue) && selectedValue.length > 0) {
                              const processedSelectedValue = selectedValue.map((value) => {
                                if (jsUtils.isObject(value)) return value.value;
                                return value;
                              });
                              isSelected = processedSelectedValue.includes(option.value);
                            }
                            labelContent = (
                              <CheckboxGroup
                                optionList={[{ label: option.label, value: option.value }]}
                                selectedValues={[isSelected ? option.value : null]}
                                hideLabel
                                hideMessage
                              />
                            );
                          } else {
                            labelContent = (
                              <div
                                className={cx(
                                  gClasses.FOne13GrayV14,
                                  styles.ChooseSectionDropdownOption,
                                )}
                                disabled={option.disabled || false}
                              >
                                {option.label}
                              </div>
                          );
                          }
                        } else if (option.element) {
                          labelContent = option.element;
                        } else {
                          labelContent = option.label;
                        }
                        console.log('labelContentlabelContent', labelContent, option);
                      // Return single option.
                        return (
                          <li
                            className={cx(
                              !option.element && BS.P_RELATIVE,
                              !option.element && styles.Option,
                              !option.element && customListClasses && customListClasses[customClassIndices.indexOf(index)],
                              (option.value === selectedValue && !isCustomLogin) && styles.SelectedBg,
                              ((suggestionIndex === index) && !isCategoryDropdown && !isCustomLogin) && styles.SelectedMobileNumber,
                              optionReference && !isMultiSelectWithMultiSection && styles.SelectedSuggestion,
                              (!isUserDropdown && isMultiSectionDropdown) ? gClasses.InputPaddingV5 : gClasses.InputPaddingV2,
                              gClasses.CenterV,
                              (isNewDropdown && !isCustomLogin) && styles.LabelViewDropdownListItem,
                              selectedClass,
                              (isNewDropdown && option.value === selectedValue && !isCustomLogin) && styles.SelectedBg,
                              (option && option.header) && gClasses.CursorDefault,
                              (header && option && !option.header) && styles.ChildElements,
                              isMultiSectionDropdown && styles.ChooseSectionDropdownListItem,
                              optionsNoWrap && gClasses.WhiteSpaceNoWrap,
                              optionListClassName,
                              option.disabled === true &&
                              cx(gClasses.NoPointerEvent, styles.DisabledDropdown),
                            )}
                            onMouseDown={
                              option && (option.header || option.element) ? () => {
                              } : (e) => {
                                e.stopPropagation();
                               if (!option.isNoDataLabel && !isMultiSelectWithMultiSection) props.onClick(option.value, option);
                              }
                            }
                            onClick={
                              option && (option.header || option.element) ? () => { } : (e) => {
                              e.stopPropagation();
                              if ((!option.isNoDataLabel) && (isMultiSelectWithMultiSection || enableOnClick)) props.onClick(option.value, option);
                            }}
                            onKeyDown={
                              option && (option.header || option.element) ? () => { } : (e) => {
                              e.stopPropagation();
                              !option.isNoDataLabel && props.onClick(option.value, option);
                            }}
                            style={{
                              backgroundColor: (option.value === selectedValue && isCustomLogin) && colorScheme?.activeColor,
                              color: (option.value === selectedValue && isCustomLogin) && COLOR_CONSTANTS.WHITE,
                              ':hover': {
                                backgroundColor: isCustomLogin && colorScheme?.activeColor,
                                color: isCustomLogin && COLOR_CONSTANTS.WHITE,
                              },
                            }}
                            ref={optionReference}
                            // role="presentation"
                            role="option"
                            id={option.value}
                            aria-selected={option.value === selectedValue}
                            key={option.label}
                          >
                            {isCountryCodeList ? (
                              <div
                                className={cx(
                                  flagClasses.Flag,
                                  flagClasses[option.countryCode],
                                  gClasses.MR5,
                                )}
                              />
                            ) : null}
                            {labelContent}
                          </li>
                        );
                      });

        // // Return single option.
        //   return (
        //     <li
        //       className={cx(
        //         !option.element && BS.P_RELATIVE,
        //         !option.element && styles.Option,
        //         !option.element && customListClasses && customListClasses[customClassIndices.indexOf(index)],
        //         (option.value === selectedValue) && styles.SelectedBg,
        //         optionReference && styles.SelectedSuggestion,
        //         (!isUserDropdown && isMultiSectionDropdown) ? gClasses.InputPaddingV5 : gClasses.InputPaddingV2,
        //         gClasses.CenterV,
        //         isNewDropdown && styles.LabelViewDropdownListItem,
        //         selectedClass,
        //         (isNewDropdown && option.value === selectedValue) && styles.SelectedBg,
        //         (option && option.header) && gClasses.CursorDefault,
        //         (header && option && !option.header) && styles.ChildElements,
        //         isMultiSectionDropdown && styles.ChooseSectionDropdownListItem,
        //         optionsNoWrap && gClasses.WhiteSpaceNoWrap,
        //         optionListClassName,
        //       )}
        //       onMouseDown={
        //         option && (option.header || option.element) ? () => { } : (e) => {
        //           e.stopPropagation();
        //           props.onClick(option.value, option);
        //         }
        //       }
        //       ref={optionReference}
        //       // role="presentation"
        //       role="option"
        //       id={option.value}
        //       aria-selected={option.value === selectedValue}
        //       key={option.label}
        //     >
        //       {isCountryCodeList ? (
        //         <div
        //           className={cx(
        //             flagClasses.Flag,
        //             flagClasses[option.countryCode],
        //             gClasses.MR5,
        //           )}
        //         />
        //       ) : null}
        //       {labelContent}
        //     </li>
        //   );
        // });
  } else if (loadingOptionList) {
    console.log('hswLoadingOptionList');
    optionLists.push(
      <TeamsListContentLoader count={3} isFileTypeLoader disableLoader={disableLoader} />,
    );
  }

  const onSearchTextChange = (event) => {
    setSearchText(event.target.value);
    if (onSearchInputChange) onSearchInputChange(event.target.value, true);// 2nd param to signify that search has occurred
  };

  // Default search input component, show only if enableSearch is true.
  console.log('optionListoptionListoptionList', onSetClicked, !jsUtils.isNull(onSetClicked), optionList, (optionList && jsUtils.isArray(optionList) && enableSearch));
  const searchDropdownComponent = (optionList && jsUtils.isArray(optionList) && enableSearch) ?
  !jsUtils.isNull(onSetClicked) ? (
      <div className={cx(gClasses.InputPaddingV2, InputContainerClassName)}>
        <Input
          inputVariant={INPUT_VARIANTS.TYPE_2}
          value={searchText}
          placeholder={searchInputPlaceholder || setValuePlaceholder}
          onChangeHandler={onSearchTextChange}
          customInputPadding={customInputPaddingClass}
          className={cx(styles.Input)}
          onKeyDownHandler={onKeyDownHandler}
          onMouseDownHandler={onInputMouseDownHandler}
          onBlurHandler={onInputBlurHandler}
          id={textId}
          readOnlySuffix={t(DROPDOWN_STRINGS.SET_VALUE)}
          readOnlySuffixStyle={{ color: buttonColor }}
          onSetClick={onSetClicked}
          readOnlySuffixClasses={cx(gClasses.ClickableElement, gClasses.CursorPointer, styles.ReadOnlySuffix)}
          errorMessage={setValueError}
        />
      </div>
  ) : (
    <div className={cx(gClasses.InputPaddingV2, InputContainerClassName)}>
        <Input
          inputVariant={INPUT_VARIANTS.TYPE_2}
          value={searchText}
          placeholder={searchInputPlaceholder || placeholder}
          onChangeHandler={onSearchTextChange}
          className={cx(styles.Input)}
          onKeyDownHandler={onKeyDownHandler}
          onMouseDownHandler={onInputMouseDownHandler}
          onBlurHandler={onInputBlurHandler}
          id={textId}
          readOnlyPrefix={searchInputIcon}
          inputContainerShortcutStyle={inputContainerShortcutStyle}
          innerClass={inputTextContainerStyle}
        />
    </div>
  ) : null;

  let dropdownList = null;

  // isMultiSectionDropdown is enabled , then the dropdown looks like Add Category in flow and Datalist.
  // if disabled, then dropdown is ommonly dropdown with few customization.
  if (isMultiSectionDropdown) {
        dropdownList = isVisible ? (
                    <div className={cx(styles.MultiSectionDropdown, gClasses.ScrollBar, multiSectionClassName)}>
                      <div
                        className={cx(
                          gClasses.FTwo13BlackV6,
                          gClasses.FontWeight500,
                          gClasses.MB10,
                        )}
                      >
                        {dropdownListCreateLabel}
                      </div>
                      <div
                        className={cx(
                          gClasses.CenterV,
                          BS.JC_BETWEEN,
                          styles.CreateSectionInputButton,
                          InputContainerClassName,
                          textError
                            ? gClasses.ErrorInputBorder
                            : styles.CreateSectionInputButtonBorder,
                        )}
                      >
                        <Input
                          inputVariant={INPUT_VARIANTS.TYPE_2}
                          value={inputValue}
                          placeholder={placeholder}
                          onChangeHandler={onInputChangeHandlerFunc}
                          onKeyDownHandler={onKeyDownHandler}
                          className={cx(gClasses.Flex1)}
                          onMouseDownHandler={onInputMouseDownHandler}
                          onBlurHandler={onInputBlurHandler}
                          id={multiSectionInputId}
                          hideLabel
                          hideMessage={!textError}
                          errorMessage={textError}
                          hideBorder
                        />
                        <Button
                          id={buttonId || multiSectionBtnId}
                          className={cx(styles.CreateSectionButton)}
                          onMouseDown={onButtonClick}
                          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onButtonClick(e)}
                          // id={multiSectionBtnId}
                        >
                          {ButtonLabelMultiSectionDropdown}
                        </Button>
                      </div>
                      <HelperMessage
                        message={textError}
                        type={HELPER_MESSAGE_TYPE.ERROR}
                        className={gClasses.ErrorMarginV2}
                      />

                      <div className={cx(gClasses.HorizontalLine, gClasses.MB15)} />
                      <div
                        className={cx(
                          gClasses.FTwo13BlackV6,
                          gClasses.FontWeight500,
                          gClasses.MB5,
                        )}
                      >
                        {dropdownListChooseLabel}
                      </div>
                      <ConditionalWrapper
                        condition={isPaginated}
                        wrapper={(children) => (
                          <InfiniteScroll
                            dataLength={optionLists.length}
                            next={loadDataHandler}
                            hasMore={hasMore}
                            height={120}
                            className={cx(
                              gClasses.ScrollBar,
                              styles.InfiniteScrollHeight,
                              gClasses.MB10,
                              )}
                            scrollThreshold={0.4}
                            scrollableTarget={containerId}
                            // className={cx(gClasses.ScrollBar, styles.InfiniteScrollHeight)}
                            // loadMore={loadDataHandler}
                            // hasMore={hasMore}
                            // threshold={20}
                            // initialLoad={false}
                            // useWindow={false}
                            // pageStart={0}
                            loader={(
                              optionList.length > 0 && !optionList[0].isNoDataLabel &&
                              hasMore && <TeamsListContentLoader count={3} isFileTypeLoader />
                            )}
                          >
                            {children}
                          </InfiniteScroll>
                        )}
                      >
                      {jsUtils.isArray(optionList) && optionList.length > 0 ? (
                        <ul
                          id={containerId}
                          className={cx(gClasses.CursorPointer, gClasses.MB12)}
                        >
                          {optionLists}
                        </ul>
                      ) : (
                        <div className={cx(gClasses.FOne13GrayV14, gClasses.MB12)}>
                          {dropdownListNotFoundLabel}
                        </div>
                      )}
                      </ConditionalWrapper>
                    </div>
                  ) : null;
  } else {
        dropdownList = isVisible ? (
                    <div
                      className={cx(
                        styles.DropdownContainer,
                        optionListDropDown,
                        gClasses.InputBorder,
                        gClasses.InputBorderRadius,
                        gClasses.FTwo13BlackV7,
                        gClasses.ScrollBar,
                        !noAbsolutePosition && BS.P_ABSOLUTE,
                        isNewDropdown || isCustomDisplay ? gClasses.WidthMaxContent : BS.W100,
                        className,
                        { [styles.ContainerTopV1]: !isBorderLess },
                        isNewDropdown && styles.NoOptionListBorder,
                        isNewDropdown && styles.LabelViewDropdownList,
                        isNewDropdown && gClasses.P10,
                      )}
                    >
                      {searchDropdownComponent}
                      {inputComponent ? (
                          <>
                            <div
                              className={cx(styles.InputOuterPadding)}
                              role="presentation"
                              onMouseDown={onInputMouseDownHandler}
                              onKeyDown={onKeyDownHandler}
                            >
                              {inputComponent(onInputSetClicked)}
                            </div>
                            {(jsUtils.isEmpty(optionList) || hideDropdownListLabel) ? null : (
                              <Label
                                content={dropdownListLabel}
                                labelFor={containerId}
                                className={gClasses.ML10}
                              />
                            )}
                          </>
                        ) : null}
                    <ul
                        id={containerId}
                        className={cx(
                          !isCustomLogin && styles.OptionList,
                          gClasses.CursorPointer,
                          isTaskDropDown ? null : BS.W100,
                          optionContainerClassName,
                        )}
                        role={ARIA_ROLES.LIST_BOX}
                    >
                      {showReset && (
                      <li
                      className={cx(
                        BS.P_RELATIVE,
                        styles.Option,
                        gClasses.ReadOnlyBg,
                        (!isUserDropdown && isMultiSectionDropdown) ? gClasses.InputPaddingV5 : gClasses.InputPaddingV2,
                        gClasses.CenterV,
                        isNewDropdown && styles.LabelViewDropdownListItem,
                        isMultiSectionDropdown && styles.ChooseSectionDropdownListItem,
                        optionsNoWrap && gClasses.WhiteSpaceNoWrap,
                        optionListClassName,
                      )}
                      onClick={() => {
                        props.onClick(defaultOption.value, defaultOption);
                      }}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        props.onClick(defaultOption.value, defaultOption);
                      }}
                      role="option"
                      id={defaultOption.value}
                      aria-selected={selectedValue === defaultOption.value}
                      key={defaultOption.label}
                      >
                        {defaultOption.label}
                      </li>)}
                      <ConditionalWrapper
                        condition={isPaginated}
                        wrapper={(children) => (
                         <div className={cx(gClasses.OverflowHidden, gClasses.OverflowYAuto)}>
                             <InfiniteScroll
                              dataLength={optionLists.length}
                              next={loadDataHandler}
                              hasMore={hasMore}
                              height={145}
                              className={cx(gClasses.ScrollBar, styles.InfiniteScrollHeight)}
                              scrollThreshold={0.8}
                              scrollableTarget={containerId}
                              // className={cx(gClasses.ScrollBar, styles.InfiniteScrollHeight)}
                              // loadMore={loadDataHandler}
                              // hasMore={hasMore}
                              // threshold={20}
                              // initialLoad={false}
                              // useWindow={false}
                              // pageStart={0}
                              loader={(
                                hasMore && <TeamsListContentLoader count={3} isFileTypeLoader disableLoader={disableLoader} />
                              )}
                             >
                              {children}
                             </InfiniteScroll>
                         </div>
                        )}
                      >
                          {optionLists}
                          {(onInputChangeHandler && !hideOptionInput) ? (
                            <>
                            <div className={cx(gClasses.CenterV, gClasses.InputPaddingV2, InputContainerClassName)}>
                              <Input
                                inputVariant={INPUT_VARIANTS.TYPE_2}
                                value={inputValue}
                                placeholder={placeholder}
                                onChangeHandler={onInputChangeHandlerFunc}
                                onKeyDownHandler={onKeyDownHandler}
                                className={cx(styles.Input, listInputClass)}
                                onMouseDownHandler={onInputMouseDownHandler}
                                onBlurHandler={onInputBlurHandler}
                                id={textId}
                                errorMessage={textError}
                                icon={isNewInput ? (
                                  <div
                                    role="link"
                                    tabIndex="0"
                                    style={{ color: buttonColor }}
                                    className={cx(gClasses.CursorPointer, gClasses.WhiteSpaceNoWrap)}
                                    onClick={onButtonClick}
                                    onMouseDown={onButtonClick}
                                    onKeyDown={onButtonClick}
                                  >
                                    {button}
                                  </div>
                                ) : null}
                              />
                              {(isNewInput) ? null : (
                                <div
                                  className={cx(gClasses.ML5, gClasses.CursorPointer)}
                                  onMouseDown={onButtonClick}
                                  role="presentation"
                                >
                                  <Button className={cx(styles.CreateSectionButton, ListButtonClass)}>
                                    {button}
                                  </Button>
                                </div>
                              )}
                            </div>
                            <HelperMessage
                                message={textError}
                                type={HELPER_MESSAGE_TYPE.ERROR}
                                className={gClasses.ErrorMarginV2}
                            />
                            </>
                          ) : null}
                      </ConditionalWrapper>
                    </ul>
                    </div>
                ) : null;
  }
  return dropdownList;
}

export default React.forwardRef((props, ref) => (
  <DropdownList innerRef={ref} {...props} />
));

DropdownList.defaultProps = {
  button: ACTION_STRINGS.ADD,
  optionList: [],
  onButtonClick: null,
  onClick: null,
  onInputBlurHandler: null,
  onInputChangeHandler: null,
  onInputMouseDownHandler: null,
  onKeyDownHandler: null,
  // activeSuggestion: null,
  // returnData: EMPTY_STRING,
  className: EMPTY_STRING,
  placeholder: EMPTY_STRING,
  inputValue: EMPTY_STRING,
  textId: null,
  textError: null,
  isCountryCodeList: false,
  isBorderLess: false,
  enableSearch: false,
  isTimeZone: false,
  isVisible: false,
  isTaskDropDown: false,
  isPaginated: false,
  hasMore: true,
  loadDataHandler: null,
  optionsNoWrap: false,
  isNewInput: false,
  // labelList: [],
  customListClasses: null,
  customClassIndices: null,
  hideDropdownListLabel: false,
  multiSectionClassName: EMPTY_STRING,
  dropdownListCreateLabel: EMPTY_STRING,
  dropdownListChooseLabel: EMPTY_STRING,
  ButtonLabelMultiSectionDropdown: EMPTY_STRING,
  optionContainerClassName: EMPTY_STRING,
  dropdownListNotFoundLabel: EMPTY_STRING,
  onSetClicked: null,
  isCustomLogin: false,
};

DropdownList.propTypes = {
  textId: propTypes.string,
  textError: propTypes.string,
  inputValue: propTypes.string,
  className: propTypes.string,
  placeholder: propTypes.string,
  button: propTypes.string,
  isBorderLess: propTypes.bool,
  isVisible: propTypes.bool,
  // returnData: propTypes.string,
  optionList: propTypes.arrayOf(
    propTypes.shape({
      label: propTypes.oneOfType([propTypes.string, propTypes.number]),
      value: propTypes.oneOfType([propTypes.string, propTypes.number]),
    }),
  ),
  onButtonClick: propTypes.func,
  onClick: propTypes.func,
  onInputBlurHandler: propTypes.func,
  onInputChangeHandler: propTypes.func,
  onInputMouseDownHandler: propTypes.func,
  onKeyDownHandler: propTypes.func,
  /** Dispalys a text field to enable search in the option list */
  enableSearch: propTypes.bool,
  isTimeZone: propTypes.bool,
  // activeSuggestion: propTypes.number,
  // labelList: propTypes.arrayOf(propTypes.string),
  isCountryCodeList: propTypes.bool,
  isTaskDropDown: propTypes.bool,
  isPaginated: propTypes.bool,
  hasMore: propTypes.bool,
  loadDataHandler: propTypes.func,
  optionsNoWrap: propTypes.bool,
  isNewInput: propTypes.bool,
  customListClasses: propTypes.element,
  customClassIndices: propTypes.element,
  hideDropdownListLabel: propTypes.bool,
  multiSectionClassName: propTypes.string,
  dropdownListChooseLabel: propTypes.string,
  dropdownListCreateLabel: propTypes.string,
  ButtonLabelMultiSectionDropdown: propTypes.string,
  optionContainerClassName: propTypes.string,
  dropdownListNotFoundLabel: propTypes.string,
  onSetClicked: propTypes.func,
  isCustomLogin: propTypes.bool,
};
