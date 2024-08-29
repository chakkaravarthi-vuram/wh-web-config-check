import React, { useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import { BeatLoader, MoonLoader } from 'react-spinners';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import Input, { INPUT_VARIANTS } from '../form_components/input/Input';
import UserImage from '../user_image/UserImage';

import TeamsListContentLoader from '../content_loaders/teams_contenbt_loaders/TeamsListContentLoader';
import { store } from '../../Store';
import Button, { BUTTON_TYPE } from '../form_components/button/Button';
import AutoPositioningPopper, { POPPER_PLACEMENTS } from '../auto_positioning_popper/AutoPositioningPopper';

import { addMemberToFlow } from '../../redux/actions/EditFlow.Action';
import { BS } from '../../utils/UIConstants';
import { DROPDOWN_CONSTANTS, EMPTY_STRING, NO_RESULTS_FOUND } from '../../utils/strings/CommonStrings';
import ThemeContext from '../../hoc/ThemeContext';
import { USER_AUTO_SUGGESTION_STRINGS } from './UserAutoSuggestion.strings';
import gClasses from '../../scss/Typography.module.scss';
import styles from '../form_components/dropdown/dropdown_list/DropdownList.module.scss';
import localStyles from './UserAutoSuggestion.module.scss';
import jsUtils from '../../utils/jsUtility';
import { getFullName } from '../../utils/generatorUtils';
import CreateMember from '../../containers/admin_settings/user_management/add_or_invite_members/add_member/AddMember';
import { CREATE_TEAM_CONST } from '../../utils/Constants';
import { getDevRoutePath } from '../../utils/UtilityFunctions';

const ReactInfiniteScrollComponent = require('react-infinite-scroll-component').default;

const AUTO_SUGGESTION_TYPES = {
  TYPE_1: 1,
  TYPE_2: 2,
  TYPE_3: 3,
};

function UserAutoSuggestionView(props) {
  const { role } = store.getState().RoleReducer;
  const { t } = useTranslation();
  const dropdownContaineRef = useRef();
  const { buttonColor, primaryColor } = useContext(ThemeContext);
  const [suggestionVisibility, setSuggestionVisibility] = useState(false);

  let list = null;
  const {
    data,
    data: {
      activeSuggestion,
    },
    innerRef,
    userOptionList,
    onLoadMoreCallHandler,
    hasMore,
    isSingleSelect,
    onChangeHandler,
    onKeyDownHandler,
    onBlurHandler,
    onFocusHandler,
    id,
    label,
    placeholder,
    errorText,
    readOnlySuffix,
    readOnlyPrefix,
    not_reporting,
    isRequired,
    hideMessage,
    hideBorder,
    getAllCurrencyTypes,
    getAllFileExtensions,
    hideLabel,
    inputClass,
    document_url_details,
    suggestionData,
    referencePopperElement,
    isMultiSectionView,
    addMemberAndTeamToFlow,
    stepIndex,
    isDataLoading,
    popperFixedStrategy,
    popperClassName,
    responsiveClass,
    actionButtons,
    getOption,
    inputUserRef,
    selectedUserData,
    fileTypeLength,
    readOnly,
    suggestedTaskAssignee,
    suggestedTaskAssigneesProfilePicList,
    getTestBedAssignees,
    referenceName,
    onOptionSelectHandler,
    className,
    type,
    assigneeIndex,
    isCustomFormFields,
    isCustomDropdownList,
    noDataFoundOptionLabel,
    inputAriaLabelledBy,
    disabled,
    userInputAutoFocus,
    focusOnError,
    focusOnErrorRefresher,
    addMember,
    allowOnlySingleSelection,
    isDatalistField,
  } = props;
  const clonedUserOptionList = jsUtils.cloneDeep(userOptionList);

  const [isCreateMemberModalVisible, setCreateMemberModalVisibility] = useState(false);
  const [isDropdownSelected, setIsDropdownSelected] = useState(false);

  const _onOptionSelectHandler = (option) => {
    onOptionSelectHandler(option);
    if (!allowOnlySingleSelection && isDatalistField) {
      onFocusHandler();
      setSuggestionVisibility(true);
      setIsDropdownSelected(false);
    }
  };

  const isUserAreadySelected = (uniqueId) => selectedUserData.find((user) => user._id === uniqueId || user.value === uniqueId);
  const handleOnBlur = (e) => {
    if (dropdownContaineRef && dropdownContaineRef.current && dropdownContaineRef.current.contains(e.relatedTarget)) return;
    if (readOnly) return;
    onBlurHandler();
    if (!isDropdownSelected) {
      setSuggestionVisibility(false);
    }
    if ((isMultiSectionView || (suggestionData && suggestionData.assigneeSuggestionList && suggestionData.assigneeSuggestionList.length)) && suggestionVisibility === true) setSuggestionVisibility(false);
  };

  const handleCreateTeamClick = () => {
    window.open(getDevRoutePath(CREATE_TEAM_CONST), '_blank');
  };

  let taskAutoSuggestionList;
  let searchValue = EMPTY_STRING;
  if (data.isOptionSelected && !jsUtils.isEmpty(data.selectedData) && isSingleSelect) {
    searchValue = data.selectedData.email;
  } else if (!data.isOptionSelected) {
    searchValue = data.searchValue;
  }
  if (readOnly) searchValue = EMPTY_STRING;

  let InfiniteScrollStyle = {};
  if (isMultiSectionView || (data.isDropdownVisible && clonedUserOptionList)) {
    let optionListView = null;

    let optionList = [...clonedUserOptionList];

    const _option_list = optionList.filter((option) => {
      if (!jsUtils.isEmpty(selectedUserData) && !jsUtils.isEmpty(option)) {
        if (!jsUtils.isEmpty(option._id) && isUserAreadySelected(option._id)) {
          return false;
        }
        if (isCustomDropdownList && !jsUtils.isEmpty(option.value) && isUserAreadySelected(option.value)) {
          return false;
        }
      }
      return true;
    });
    optionList = _option_list;

    if ((getOption && hasMore) && (optionList && optionList.length < 5)) {
      onLoadMoreCallHandler();

      optionListView = [(
        <TeamsListContentLoader count={3} isFileTypeLoader />
      )];
    } else if (!optionList || !optionList.length) {
      const selectedClass = localStyles.SelectedOption;
      optionListView = [(
        <li
          className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, selectedClass, localStyles.Option)}
        >
          <div>
            {noDataFoundOptionLabel ?
            <div className={cx(gClasses.FTwo12BlackV3, gClasses.FontWeight500)}>{noDataFoundOptionLabel}</div> :
            <div className={cx(gClasses.FTwo12BlackV3, gClasses.FontWeight500)}>
              {t(NO_RESULTS_FOUND)}
            </div>
            }
          </div>
        </li>
      )];
    } else if (optionList[0] && optionList[0].noValue) {
      optionListView = optionList.map((option, index) => {
        const selectedClass = localStyles.SelectedOption;
        return (
          <li
            className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, selectedClass, localStyles.Option)}
            key={`user_suggestion_${index}`}
          >
            <div>
              <div className={cx(gClasses.FTwo12BlackV3, gClasses.FontWeight500)}>{option.noValue}</div>
            </div>
          </li>
        );
      });
    } else if (getOption) {
      InfiniteScrollStyle = { maxHeight: '153px', overflowX: 'hidden' };
      optionListView = optionList.flatMap((option, index) => {
        let ref = null;
        let selectedClass = null;
        console.log(' +++ Found getOption', activeSuggestion === index, index, option);
        if (activeSuggestion === index) {
          ref = innerRef;
          selectedClass = localStyles.SelectedOption;
        }
        const label = getOption(option, 'label');
        if (jsUtils.isEmpty(label)) return [];
        return [(
          <li
            className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, localStyles.Option, selectedClass)}
            key={getOption(option, 'value')}
            onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                _onOptionSelectHandler(option);
              }}
            value={getOption(option, 'value')}
            role="presentation"
            ref={ref}
          >
            <div className={BS.W100}>
              <div className={cx(gClasses.FTwo12BlackV3, gClasses.FontWeight500, gClasses.WordBreakAll, BS.W100)}>{label}</div>
            </div>
          </li>
        )];
      });
    } else if (isCustomFormFields) {
      optionListView = optionList.map((option, index) => {
        let ref = null;
        let selectedClass = null;
        console.log(' +++ Found  getAllCurrencyTypes', activeSuggestion === index, index, option.field_name);
        if (activeSuggestion === index) {
          ref = innerRef;
          selectedClass = localStyles.SelectedOption;
        }
        if (option[DROPDOWN_CONSTANTS.FIELD_NAME] === 'None') {
          return (
            <li
              className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, selectedClass, localStyles.Option)}
              key={option[DROPDOWN_CONSTANTS.FIELD_NAME]}
              onMouseDown={() => { }}
              ref={ref}
              value={option[DROPDOWN_CONSTANTS.FIELD_NAME]}
              role="presentation"
            >
              <div>
                <div className={cx(gClasses.FTwo12BlackV3, gClasses.FontWeight500)}>{option[DROPDOWN_CONSTANTS.FIELD_NAME]}</div>
              </div>
            </li>
          );
        }
        return (
          <li
            className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, selectedClass, localStyles.Option)}
            key={option[DROPDOWN_CONSTANTS.FIELD_NAME]}
            onMouseDown={() => _onOptionSelectHandler(option)}
            ref={ref}
            value={option[DROPDOWN_CONSTANTS.FIELD_NAME]}
            role="presentation"
          >
            <div>
              <div className={cx(gClasses.FTwo12BlackV3, gClasses.FontWeight500)}>
                {option.label}
              </div>
            </div>
          </li>
        );
      });
    } else if (isCustomDropdownList) {
      optionListView = optionList.map((option, index) => {
        let ref = null;
        let selectedClass = null;
        if (activeSuggestion === index) {
          ref = innerRef;
          selectedClass = localStyles.SelectedOption;
        }
        if (option[DROPDOWN_CONSTANTS.VALUE] === 'None') {
          return (
            <li
              className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, selectedClass, localStyles.Option)}
              key={option[DROPDOWN_CONSTANTS.VALUE]}
              onMouseDown={() => { }}
              ref={ref}
              value={option[DROPDOWN_CONSTANTS.VALUE]}
              role="presentation"
            >
              <div>
                <div className={cx(gClasses.FTwo12BlackV3, gClasses.FontWeight500)}>{option[DROPDOWN_CONSTANTS.VALUE]}</div>
              </div>
            </li>
          );
        }
        return (
          <li
            className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, selectedClass, localStyles.Option)}
            key={option[DROPDOWN_CONSTANTS.VALUE]}
            onMouseDown={() => _onOptionSelectHandler(option)}
            ref={ref}
            value={option[DROPDOWN_CONSTANTS.VALUE]}
            role="presentation"
          >
            <div>
              <div className={cx(gClasses.FTwo12BlackV3, gClasses.FontWeight500)}>
                {option.label}
              </div>
            </div>
          </li>
        );
      });
    } else if (getAllCurrencyTypes) {
      optionListView = optionList.map((option, index) => {
        let ref = null;
        let selectedClass = null;
        console.log(' +++ Found  getAllCurrencyTypes', activeSuggestion === index, index, option);
        if (activeSuggestion === index) {
          ref = innerRef;
          selectedClass = localStyles.SelectedOption;
        }
        if (option[DROPDOWN_CONSTANTS.VALUE] === 'None') {
          return (
            <li
              className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, selectedClass, localStyles.Option)}
              key={option[DROPDOWN_CONSTANTS.VALUE]}
              onMouseDown={() => { }}
              ref={ref}
              value={option[DROPDOWN_CONSTANTS.VALUE]}
              role="presentation"
            >
              <div>
                <div className={cx(gClasses.FTwo12BlackV3, gClasses.FontWeight500)}>{option[DROPDOWN_CONSTANTS.VALUE]}</div>
              </div>
            </li>
          );
        }
        return (
          <li
            className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, selectedClass, localStyles.Option)}
            key={option[DROPDOWN_CONSTANTS.VALUE]}
            onMouseDown={() => _onOptionSelectHandler(option)}
            ref={ref}
            value={option[DROPDOWN_CONSTANTS.VALUE]}
            role="presentation"
          >
            <div>
              <div className={cx(gClasses.FTwo13BlackV2, gClasses.FontWeight500)}>{option.currency}</div>
            </div>
          </li>
        );
      });
    } else if (getAllFileExtensions) {
      InfiniteScrollStyle = { maxHeight: '150px', overflowX: 'hidden' };
      optionListView = optionList.map((option, index) => {
        let ref = null;
        let selectedClass = null;
        if (activeSuggestion === index) {
          ref = innerRef;
          selectedClass = localStyles.SelectedOption;
        }
        if (index === 0 && index < fileTypeLength) {
          return (
            <>
              <li
                className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, localStyles.HeaderOption, localStyles.Option)}
                key={option[DROPDOWN_CONSTANTS.VALUE]}
                ref={ref}
                value={option[DROPDOWN_CONSTANTS.VALUE]}
              >
                <div>
                  <div className={cx(gClasses.FTwo13BlackV2, gClasses.FontWeight600)}>By File Types</div>
                </div>
              </li>
              <li
                className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, selectedClass, localStyles.Option)}
                key={option[DROPDOWN_CONSTANTS.VALUE]}
                onMouseDown={() => _onOptionSelectHandler(option)}
                ref={ref}
                value={option[DROPDOWN_CONSTANTS.VALUE]}
                role="presentation"
              >
                <div>
                  <div className={cx(gClasses.FTwo13BlackV2, gClasses.FontWeight500)}>{option.display}</div>
                </div>
              </li>
            </>
          );
        }
        if (index === fileTypeLength) {
          return (
            <>
              <li
                className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, localStyles.HeaderOption, localStyles.Option)}
                key={option[DROPDOWN_CONSTANTS.VALUE]}
                ref={ref}
                value={option[DROPDOWN_CONSTANTS.VALUE]}
              >
                <div>
                  <div className={cx(gClasses.FTwo13BlackV2, gClasses.FontWeight600)}>By Extension</div>
                </div>
              </li>
              <li
                className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, selectedClass, localStyles.Option)}
                key={option[DROPDOWN_CONSTANTS.VALUE]}
                onMouseDown={() => _onOptionSelectHandler(option)}
                ref={ref}
                value={option[DROPDOWN_CONSTANTS.VALUE]}
                role="presentation"
              >
                <div>
                  <div className={cx(gClasses.FTwo13BlackV2, gClasses.FontWeight500)}>{option.file_extension}</div>
                </div>
              </li>
            </>
          );
        }
        return (
          <li
            className={cx(BS.D_FLEX, styles.Option, selectedClass, gClasses.InputPaddingV2, localStyles.Option)}
            key={option[DROPDOWN_CONSTANTS.VALUE]}
            onMouseDown={() => _onOptionSelectHandler(option)}
            ref={ref}
            value={option[DROPDOWN_CONSTANTS.VALUE]}
            role="presentation"
          >
            <div>
              <div className={cx(gClasses.FTwo13BlackV2, gClasses.FontWeight500)}>
                {index < fileTypeLength ? option.display : option.file_extension}
              </div>
            </div>
          </li>
        );
      });
    } else if (isMultiSectionView) {
      optionListView = optionList.map((option, index) => {
        const userName = option.first_name
          ? `${getFullName(option.first_name, option.last_name)}`
          : option.email
            ? option.email
            : option.team_name;
        let ref = null;
        console.log(' +++ Found isMultiSectionView', activeSuggestion === index, index, option);

        let selectedClass = null;
        if (activeSuggestion === index) {
          ref = innerRef;
          selectedClass = localStyles.SelectedOption;
        }
        let profilePic = [];
        if (document_url_details && document_url_details.length) {
          profilePic = document_url_details.filter(
            (eachDoc) => eachDoc.document_id === option.profile_pic || eachDoc.document_id === option.team_pic,
          );
          [option.profilePic] = profilePic;
        }
        return (
          <li
            role="menuitem"
            className={cx(
              gClasses.CenterV,
              gClasses.PX20,
              localStyles.MultiSectionViewDropdownListItem,
              gClasses.CursorPointer,
              selectedClass,
            )}
            key={option._id}
            onMouseDown={() => _onOptionSelectHandler(option)}
            ref={ref}
            value={option[DROPDOWN_CONSTANTS.VALUE]}
          >
            <UserImage
              firstName={option.first_name || userName}
              lastName={option.last_name}
              src={profilePic.length ? profilePic[0].signedurl : null}
              className={localStyles.UserImage}
            />
            <div className={cx(gClasses.ML10, gClasses.CenterV, BS.JC_BETWEEN, gClasses.Flex1)}>
              <div>
                <div className={cx(gClasses.FTwo12BlackV3, gClasses.FontWeight500, gClasses.Ellipsis, BS.W100)}>
                  {userName}
                </div>
                <div className={cx(gClasses.FOne11GrayV2, gClasses.Ellipsis, BS.W100)}>{option.email}</div>
              </div>
              <div className={cx(gClasses.FTwo13GrayV14)}>{option.team_name ? 'Team' : 'User'}</div>
            </div>
          </li>
        );
      });
    } else {
      optionListView = optionList.map((option, index) => {
        const userName = option.first_name
          ? `${getFullName(option.first_name, option.last_name)}`
          : option.email
            ? option.email
            : option.team_name;
        let ref = null;
        let selectedClass = null;
        console.log(' +++ Found elseeee', activeSuggestion === index, index, option, data.activeSuggestion);

        if (activeSuggestion === index) {
          ref = innerRef;
          selectedClass = localStyles.SelectedOption;
        }
        let profilePic = [];
        if (document_url_details && document_url_details.length) {
          profilePic = document_url_details.filter(
            (eachDoc) => eachDoc.document_id === option.profile_pic || eachDoc.document_id === option.team_pic,
          );
          [option.profilePic] = profilePic;
        }
        return (
          <li
            className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, selectedClass, localStyles.Option)}
            key={option._id}
            ref={ref}
            value={option[DROPDOWN_CONSTANTS.VALUE]}
            role="menuitem"
            onMouseDown={(e) => {
              e.stopPropagation();
              _onOptionSelectHandler(jsUtils.cloneDeep(option));
            }}
          >
            <UserImage
              firstName={option.first_name || userName}
              lastName={option.last_name}
              src={profilePic.length ? profilePic[0].signedurl : null}
              className={localStyles.UserImage}
            />
            <div className={gClasses.ML20}>
              <div className={cx(gClasses.FTwo12BlackV3, gClasses.FontWeight500)}>{userName}</div>
              <div className={cx(gClasses.FOne11GrayV2, localStyles.FlexGrow1)}>{option.email}</div>
            </div>
          </li>
        );
      });
    }

    if (!jsUtils.isEmpty(suggestedTaskAssignee) && suggestedTaskAssignee.length && jsUtils.isEmpty(searchValue)) {
      taskAutoSuggestionList = suggestedTaskAssignee.map((option, index) => {
        const userName = option.first_name
          ? `${getFullName(option.first_name, option.last_name)}`
          : option.email
            ? option.email
            : option.team_name;
        let ref = null;
        let selectedClass = null;
        console.log(' +++ Found suggestedTaskAssignee', data.activeSuggestion === index, index, option);

        if (data.activeSuggestion === index) {
          ref = innerRef;
          selectedClass = localStyles.SelectedOption;
        }
        let profilePic = [];
        if (document_url_details && document_url_details.length) {
          profilePic = document_url_details.filter(
            (eachDoc) => eachDoc.document_id === option.profile_pic || eachDoc.document_id === option.team_pic,
          );
        }
        return (
          <li
            className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, selectedClass, localStyles.Option, gClasses.CursorPointer)}
            key={option._id}
            onMouseDown={() => {
              _onOptionSelectHandler(option);
              setIsDropdownSelected(true);
            }}
            role="menuitem"
            ref={ref}
            value={option[DROPDOWN_CONSTANTS.VALUE]}
          >
            <UserImage
              firstName={option.first_name || userName}
              lastName={option.last_name}
              src={profilePic.length ? profilePic[0].signedurl : null}
              className={localStyles.UserImage}
            />
            <div className={gClasses.ML20}>
              <div className={cx(gClasses.FTwo12BlackV3, gClasses.FontWeight500)}>{userName}</div>
              <div className={cx(gClasses.FOne11GrayV2, localStyles.FlexGrow1)}>{option.email}</div>
            </div>
          </li>
        );
      });
    }

    if (isMultiSectionView) {
      list = (
        <ul role="menu" className={cx(localStyles.MultiSectionChooseScrollView, gClasses.OverflowYAuto, gClasses.OverflowXHiddenImportant, gClasses.ScrollBar)}>
          {isDataLoading ? (
            <div className={cx(gClasses.CenterVH, localStyles.LoaderContainer)}>
              <MoonLoader size={20} />
            </div>
          ) : (
            <InfiniteScroll
              loadMore={onLoadMoreCallHandler}
              hasMore={false} // infinite scroll turned off since backend didn't implemented it
              threshold={46}
              initialLoad={false}
              useWindow={false}
              pageStart={0}
              className={gClasses.OverflowXHiddenImportant}
            >
              {optionListView}
              {((!jsUtils.isEmpty(suggestedTaskAssignee)) && suggestedTaskAssignee.length && jsUtils.isEmpty(searchValue)) && (
                <div>
                  <div
                    className={cx(
                      gClasses.FTwo12,
                      gClasses.FontWeight500,
                      gClasses.PT15,
                      gClasses.PX20,
                      gClasses.PB10,
                    )}
                    style={{ color: primaryColor }}
                  >
                    Suggestion
                  </div>
                  {taskAutoSuggestionList}
                </div>
              )}

            </InfiniteScroll>
          )}
        </ul>
      );
    } else {
      list = (
        <ul className={cx(styles.OptionList, gClasses.CursorPointer, BS.W100)} style={{ maxHeight: '153px' }}>
          <ReactInfiniteScrollComponent
            dataLength={optionListView.length}
            next={onLoadMoreCallHandler}
            hasMore={hasMore}
            scrollThreshold={0.6}
            loader={<TeamsListContentLoader count={3} isFileTypeLoader={getAllFileExtensions} />}
            height={BS.INHERIT}
            style={InfiniteScrollStyle}
            scrollableTarget={id}
            className={cx(gClasses.OverflowXHiddenImportant, gClasses.ScrollBar)}
          >
            {optionListView}
          </ReactInfiniteScrollComponent>
        </ul>
      );
    }
  }
  let inputVariant = null;
  let containerClass = null;
  switch (type) {
    case AUTO_SUGGESTION_TYPES.TYPE_1:
      inputVariant = INPUT_VARIANTS.TYPE_2;
      containerClass = cx(BS.P_RELATIVE, BS.D_FLEX, localStyles.FlexGrow1, localStyles.Container);
      break;
    case AUTO_SUGGESTION_TYPES.TYPE_2:
      inputVariant = INPUT_VARIANTS.TYPE_4;
      containerClass = cx(BS.P_RELATIVE, BS.D_FLEX, localStyles.FlexGrow1, localStyles.Container);
      break;
    case AUTO_SUGGESTION_TYPES.TYPE_3:
      inputVariant = INPUT_VARIANTS.TYPE_4;
      containerClass = cx(
        BS.D_FLEX,
        localStyles.FlexGrow1,
        getAllFileExtensions ? localStyles.FileContainer : localStyles.Container,
      );
      break;
    default:
      containerClass = BS.P_RELATIVE;
      break;
  }

  let popperClasses = null;
  let popperStyles = null;
  let popperComponent = null;
  let popperVisibility = false;

  console.log('sdfsfdsfdsfsdf', suggestionData);
  if (suggestionData) {
    let suggestionList;
    if (suggestionData.isAssigneeSuggestionLoading) {
      suggestionList = (
        <div className={cx(gClasses.CenterVH, gClasses.PY5)} style={{ color: 'black' }}>
          <BeatLoader size={10} color="#1f243d" loading />
        </div>
      );
    } else if (suggestionData.assigneeSuggestionList && suggestionData.assigneeSuggestionList.length) {
      suggestionList = suggestionData.assigneeSuggestionList.map((eachItem) => {
        const name = eachItem.is_user ? getFullName(eachItem.first_name, eachItem.last_name) : eachItem.team_name;
        const type = eachItem.is_user ? USER_AUTO_SUGGESTION_STRINGS.TYPES.PEOPLE : USER_AUTO_SUGGESTION_STRINGS.TYPES.TEAM;
        return (
          <div
            className={cx(localStyles.SuggestionListItem, BS.D_FLEX, BS.JC_BETWEEN, gClasses.CursorPointer)}
            onMouseDown={() => _onOptionSelectHandler(eachItem)}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && _onOptionSelectHandler(eachItem)}
            role="button"
            tabIndex={0}
          >
            <div className={cx(gClasses.MR15, gClasses.Ellipsis, gClasses.Flex1)}>
              <div className={cx(gClasses.FOne13BlackV6, localStyles.SuggestionListItemVisibilityA)}>{name}</div>
              <div
                className={cx(gClasses.FOne13BlackV6, localStyles.SuggestionListItemVisibilityB)}
                style={{
                  color: buttonColor,
                }}
              >
                {name}
              </div>
            </div>
            <div className={cx(gClasses.FOne12GrayV9)}>{type}</div>
          </div>
        );
      });
    } else if (suggestedTaskAssignee && suggestedTaskAssignee.length && jsUtils.isEmpty(searchValue) && jsUtils.isEmpty(data.selectedData)) {
      suggestionList = suggestedTaskAssignee.map((option, index) => {
        const userName = option.first_name
          ? `${getFullName(option.first_name, option.last_name)}`
          : option.email
            ? option.email
            : option.team_name;
        let ref = null;
        let selectedClass = null;
        if (data.activeSuggestion === index) {
          ref = innerRef;
          selectedClass = localStyles.SelectedOption;
        }
        let profilePic = {};
        if (suggestedTaskAssigneesProfilePicList && suggestedTaskAssigneesProfilePicList.length) {
          profilePic = suggestedTaskAssigneesProfilePicList.find(
            (eachDoc) => eachDoc.document_id === option.profile_pic || eachDoc.document_id === option.team_pic,
          ) || {};
        }
        return (
          <li
            className={cx(BS.D_FLEX, styles.Option, gClasses.InputPaddingV2, selectedClass, localStyles.Option, gClasses.CursorPointer)}
            key={option._id}
            onMouseDown={() => {
              _onOptionSelectHandler(option);
              setIsDropdownSelected(true);
            }}
            onKeyDown={(e) => {
              keydownOrKeypessEnterHandle(e) && _onOptionSelectHandler(option);
              setIsDropdownSelected(true);
            }}
            role="menuitem"
            ref={ref}
            value={option[DROPDOWN_CONSTANTS.VALUE]}
          >
              <UserImage
                firstName={option.first_name || userName}
                lastName={option.last_name}
                src={profilePic?.signedurl || null}
                className={localStyles.UserImage}
              />
              <div className={gClasses.ML20}>
                <div className={cx(gClasses.FTwo12BlackV3, gClasses.FontWeight500)}>{userName}</div>
                <div className={cx(gClasses.FOne11GrayV2, localStyles.FlexGrow1)}>{option.email}</div>
              </div>
          </li>
        );
      });
    } else {
      if ((jsUtils.isEmpty(searchValue)) && (jsUtils.isEmpty(suggestedTaskAssignee)) && (!suggestionData.isAssigneeSuggestionLoading)) {
        suggestionList = (
          <div className={cx(localStyles.NoSuggestionList)}>
            <div className={cx(gClasses.MR15, gClasses.Ellipsis, gClasses.Flex1)}>
              <div className={cx(gClasses.FOne13BlackV6)}>{t(USER_AUTO_SUGGESTION_STRINGS.NO_SUGGESTION_FOUND)}</div>
            </div>
          </div>
        );
      }
    }
    popperComponent = !jsUtils.isEmpty(suggestionList) && (
      <div className={cx(localStyles.SuggestionDropdownContainer, gClasses.PB8)}>
        {(!jsUtils.isEmpty(suggestedTaskAssignee) && suggestedTaskAssignee.length && jsUtils.isEmpty(searchValue)) && (
          <div
            className={cx(
              gClasses.FTwo13,
              gClasses.FontWeight500,
              gClasses.PT15,
              gClasses.PX20,
              gClasses.PB10,
            )}
            style={{ color: primaryColor }}
          >
            {t(USER_AUTO_SUGGESTION_STRINGS.TYPES.SUGGESTIONS)}
          </div>
        )}

        <div className={cx(localStyles.SuggestionDropdown, gClasses.ScrollBar, gClasses.OverflowYAuto)}>
          {suggestionList}
        </div>
      </div>
    );
    popperClasses = cx(gClasses.W100, gClasses.ZIndex5);
    popperVisibility = suggestionVisibility;
  }

  if (isMultiSectionView) {
    popperComponent = (!jsUtils.isEmpty(searchValue) || jsUtils.isEmpty(selectedUserData)) && (
      <div className={cx(localStyles.MultiSectionViewContainer, BS.D_FLEX, BS.FLEX_COLUMN)}>
        <div className={cx(gClasses.PX20, gClasses.PY15)}>
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, responsiveClass && responsiveClass)}>
            <div
              className={cx(gClasses.FTwo13, gClasses.FontWeight500, gClasses.CenterV)}
              style={{ color: primaryColor }}
            >
              {role === 1 ? USER_AUTO_SUGGESTION_STRINGS.USER_OR_TEAM : USER_AUTO_SUGGESTION_STRINGS.TEAMS_ONLY}
            </div>
            <div>
              {role === 1 && (
              <Button
                onMouseDown={() => setCreateMemberModalVisibility(true)}
                className={cx(localStyles.MultiSectionViewButton)}
                buttonType={BUTTON_TYPE.SECONDARY}
              >
                {USER_AUTO_SUGGESTION_STRINGS.CREATE_USER}
              </Button>
              )}
                <Button
                  onClick={handleCreateTeamClick}
                  className={cx(gClasses.ML10, localStyles.MultiSectionViewButton)}
                  buttonType={BUTTON_TYPE.SECONDARY}
                >
                  {USER_AUTO_SUGGESTION_STRINGS.CREATE_TEAM}
                </Button>
            </div>
          </div>
        </div>
        <div className={cx(gClasses.HorizontalLine)} />
        <div className={cx(localStyles.MultiSectionChooseView)}>
          <div
            className={cx(
              gClasses.FTwo13,
              gClasses.FontWeight500,
              gClasses.PT15,
              gClasses.PX20,
              gClasses.PB10,
            )}
            style={{ color: primaryColor }}
          >
            {USER_AUTO_SUGGESTION_STRINGS.CHOOSE_LABEL}
          </div>
          {list}
        </div>
      </div>
    );
    popperVisibility = suggestionVisibility;
    popperClasses = cx(gClasses.W100, gClasses.ZIndex2);
  } else if (data.isDropdownVisible) {
    popperClasses = cx(
      styles.DropdownContainer,
      gClasses.InputBorder,
      gClasses.InputBorderRadius,
      gClasses.FOne13BlackV1,
      gClasses.W100,
      className,
      localStyles.DropdownContainer,
      gClasses.ScrollBar,
      gClasses.ZIndex2,
    );
    popperStyles = { overflowY: getAllFileExtensions ? 'hidden' : 'auto', width: referencePopperElement && referencePopperElement.clientWidth };
    popperComponent = list;
    popperVisibility = data.isDropdownVisible;
  }
  const createMemberModal = isCreateMemberModalVisible && (
    <CreateMember
      id="teams_modal"
      isModalOpen={isCreateMemberModalVisible}
      contentClass={cx(gClasses.FullScreenModal, gClasses.ModalContentClass, localStyles.Modal)}
      isCreateMemberFromFlow={addMemberAndTeamToFlow}
      addMemberToFlow={(...args) => {
        if (addMember) addMember(...args);
        else store.dispatch(addMemberToFlow(...args, stepIndex, assigneeIndex));
      }}
      closeModal={() => setCreateMemberModalVisibility(false)}
    />
  );

  console.log('isMultiSectionView', isMultiSectionView);
  const showSuggestionInput = ((getTestBedAssignees && jsUtils.isEmpty(selectedUserData)) || !getTestBedAssignees);
  return (
    <>
      {createMemberModal}
      <div
        className={BS.W100}
        role="button"
        tabIndex={-1}
        onKeyDown={onKeyDownHandler}
        ref={dropdownContaineRef}
        onBlur={handleOnBlur}
      >
        <div className={containerClass}>
          {
            showSuggestionInput ? (
              <Input
                id={id}
                label={label}
                placeholder={placeholder}
                onChangeHandler={onChangeHandler}
                onFocusHandler={(...props_) => {
                  if (readOnly) return;
                  onFocusHandler(props_);
                  setIsDropdownSelected(false);
                  setSuggestionVisibility(true);
                  if ((isMultiSectionView || (suggestionData && suggestionData.assigneeSuggestionList && suggestionData.assigneeSuggestionList.length)) && suggestionVisibility === false) setSuggestionVisibility(true);
                }}
                value={searchValue}
                errorMessage={errorText}
                readOnlyPrefix={readOnlyPrefix}
                readOnlySuffix={readOnlySuffix}
                inputVariant={inputVariant}
                className={cx(BS.W100, inputClass)}
                readOnly={readOnly || not_reporting}
                isRequired={isRequired}
                hideMessage={hideMessage}
                hideBorder={hideBorder}
                hideLabel={hideLabel}
                inputUserRef={inputUserRef}
                innerClass={inputClass} // Assign to form placeholder
                referenceName={referenceName}
                inputContainerClasses={gClasses.Height24}
                inputAriaLabelledBy={inputAriaLabelledBy}
                required
                disabled={disabled}
                autoFocus={userInputAutoFocus}
                isEnableDropdown
                focusOnError={focusOnError}
                focusOnErrorRefresher={focusOnErrorRefresher}
              />
            ) : null
          }
          {actionButtons}
        </div>
        <AutoPositioningPopper
          className={cx(popperClasses, popperClassName)}
          style={popperStyles}
          placement={POPPER_PLACEMENTS.AUTO}
          allowedAutoPlacements={[POPPER_PLACEMENTS.BOTTOM, POPPER_PLACEMENTS.TOP]}
          referenceElement={referencePopperElement}
          isPopperOpen={showSuggestionInput && popperVisibility}
          fixedStrategy={popperFixedStrategy}
        >
            {popperComponent}
        </AutoPositioningPopper>
      </div>
    </>
  );
}

UserAutoSuggestionView.defaultProps = {
  optionList: [],
  innerRef: EMPTY_STRING,
  className: EMPTY_STRING,
  label: EMPTY_STRING,
  errorText: EMPTY_STRING,
  placeholder: EMPTY_STRING,
  id: EMPTY_STRING,
  readOnlyPrefix: EMPTY_STRING,
  readOnlySuffix: EMPTY_STRING,
  searchValue: EMPTY_STRING,
  isRequired: false,
  hideMessage: false,
  hideBorder: false,
  not_reporting: false,
  isSingleSelect: false,
  isMultiSectionView: false,
  selectedUserData: [],
  isCustomFormFields: false,
  suggestedTaskAssigneesProfilePicList: [],
};

UserAutoSuggestionView.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  optionList: PropTypes.arrayOf(PropTypes.any),
  innerRef: PropTypes.string,
  className: PropTypes.string,
  dataLength: PropTypes.number.isRequired,
  onLoadMoreCallHandler: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  onKeyDownHandler: PropTypes.func.isRequired,
  onBlurHandler: PropTypes.func.isRequired,
  label: PropTypes.string,
  errorText: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  readOnlyPrefix: PropTypes.string,
  readOnlySuffix: PropTypes.string,
  type: PropTypes.number.isRequired,
  searchValue: PropTypes.string,
  isRequired: PropTypes.bool,
  hideMessage: PropTypes.bool,
  hideBorder: PropTypes.bool,
  not_reporting: PropTypes.bool,
  isSingleSelect: PropTypes.bool,
  isMultiSectionView: PropTypes.bool,
  selectedUserData: PropTypes.arrayOf(PropTypes.any),
  isCustomFormFields: PropTypes.bool,
  suggestedTaskAssigneesProfilePicList: PropTypes.array,

};

export default React.forwardRef((props, ref) => <UserAutoSuggestionView innerRef={ref} {...props} />);
