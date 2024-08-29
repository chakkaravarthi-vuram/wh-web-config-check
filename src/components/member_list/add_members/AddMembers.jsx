import React, { useEffect, useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import UserIconAddMembers from 'assets/icons/UserIconAddMembers';
import { axiosGetUtils } from 'axios/AxiosHelper';
import { getDatalistValidCheckData } from 'axios/apiService/addMember.apiService ';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import Button from '../../form_components/button/Button';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from '../../form_components/helper_message/HelperMessage';
// eslint-disable-next-line import/no-cycle
import UserAutoSuggestion from '../../user_autosuggestion/UserAutoSuggestion';
import { AUTO_SUGGESTION_TYPES } from '../../form_components/auto_suggestion/AutoSuggestion';
import Tag from '../../form_components/tag/Tag';

import { BUTTON_TYPE } from '../../../utils/Constants';
import {
  ARIA_ROLES,
  BS,
  COLOUR_CODES,
  SKELETON_LOADER_DIMENSION_CONSTANTS,
} from '../../../utils/UIConstants';

import gClasses from '../../../scss/Typography.module.scss';
// import UserImage from '../../user_image/UserImage';
import styles from './AddMembers.module.scss';
import { ADD_MEMBERS_STRINGS } from './AddMembers.strings';
import {
  GET_USERS,
  GET_ALL_TEAMS,
  GET_ALL_USERS_OR_TEAMS,
  GET_ALL_CURRENCY_TYPES,
  GET_ALL_FILE_EXTENSIONS,
  GET_ALL_FILE_TYPES,
  GET_USER_TEAM_PICKER_SUGGESTION,
  GET_TEST_BED_ASSIGNEES,
  GET_USER_SECURITY_BY_OBJECT,
  GET_ALL_FIELDS,
  GET_VALID_REVIEW_ASSIGNEES,
} from '../../../urls/ApiUrls';
import { COMMA, EMPTY_STRING, SPACE } from '../../../utils/strings/CommonStrings';
import Label from '../../form_components/label/Label';
import UserIcon from '../../../assets/icons/UserIcon';
import MyTeamIcon from '../../../assets/icons/side_bar/MyTeamIcon';
import ThemeContext from '../../../hoc/ThemeContext';
import jsUtils, { isArray, isEmpty, nullCheck } from '../../../utils/jsUtility';

let cancelTokenValidData;
function AddMembers(props) {
  const { buttonColor } = useContext(ThemeContext);
  const [isInitialLoadStarted, setInitialLoad] = useState(false);
  const [isInitialLoadEnded, setInitialLoadEndedStatus] = useState(false);
  // api props
  const {
    getTeams,
    getTeamsAndUsers,
    getAllCurrencyTypes,
    getAllowedCurrencyTypes,
    getAllFileExtensions,
    getUserTeamPickerSuggestion,
    apiParams,
    entryIds,
    getTestBedAssignees,
    helperMessageClassName,
    addMember,
    addTeam,
  } = props;

  const {
    selectedData,
    removeSelectedUser,
    errorText,
    memberSearchValue,
    hideLabel,
    hideUserIcon,
    label,
    isRequired,
    selectedSuggestionData,
    onUserSelectHandler,
    placeholder,
    id,
    showTagTooltip,
    allowedCurrencyList,
    setMemberSearchValue,
    onAddButtonClicked,
    onCancelButtonClicked,
    className,
    isDataLoading,
    showTagTitle,
    containerRefAsProp,
    isActive,
    suggestionData,
    isDisabled,
    hideErrorMessage,
    isCreationField,
    isMultiSectionView,
    addMemberAndTeamToFlow,
    lastSignin,
    popperFixedStrategy,
    popperClassName,
    responsiveClass,
    userAutoSuggestionClass,
    innerClassName,
    isScrollableSelectedList,
    readOnly,
    helperTooltipMessage,
    helperToolTipId,
    instructionMessage,
    instructionClass,
    apiUrl,
    internalSearchValueState = getUserTeamPickerSuggestion,
    getOption,
    getTagLabel,
    getTagId,
    icon,
    setErrorMessage,
    customClass,
    allowNavigationToDataList,
    dataListUUID,
    onTagClick,
    labelClass,
    editIcon,
    deleteIcon,
    fieldTypeInstruction,
    suggestedTaskAssignee,
    suggestedTaskAssigneesProfilePicList,
    referenceName,
    tagUserClass,
    labelClassAdmin,
    containerSize,
    getUserSecurityByObject,
    allowOnlySingleSelection,
    getAllowedUsersWithAlert,
    assigneeIndex,
    isCustomFormFields,
    stepIndex,
    isCustomDropdownList,
    customAddmemberDropdownList,
    noDataFoundOptionLabel,
    isDatalistField,
    disabled,
    focusOnError,
    focusOnErrorRefresher,
    displayOneByOne,
    memberListClass,
    getValidTeamsAndUsers,
    hideSuggestionFieldInput,
    filterFields,
    clearTextOnUnmount,
    isAlertDisplay,
  } = props;

  const helperMessageId = `${id}_helper_message`;
  const labelId = `${id}_label`;
  const inputAriaLabelledBy = `${labelId}${(!isDisabled && errorText) ? SPACE + helperMessageId : EMPTY_STRING}`;
  // internal state for storing search value
  const [searchValue, setSearchValue] = useState('');
  const [apiParamData, setApiParamData] = useState(EMPTY_STRING);
  const userSelectInputFocus = useRef(null);

  const clearInternalSearchValue = () => {
    if (internalSearchValueState) setSearchValue('');
  };

  const setMemberSearchValueHandler = (event) => {
    const value = jsUtils.get(event, 'target.value');
    const id = jsUtils.get(event, 'target.id');
    if (internalSearchValueState) setSearchValue(value, id);
    else setMemberSearchValue && setMemberSearchValue(event, event.target.value);
  };

  const getMemberSearchValue = () => {
    if (internalSearchValueState) return searchValue;
    return memberSearchValue;
  };
  useEffect(() => {
    if (getAllowedUsersWithAlert) {
      if (selectedData && selectedData.length > 0 && !isInitialLoadStarted) {
        const { assigneeListUpdateHandler } = props;
        setInitialLoad(true);
        const userIdsArray = [];
        const teamIdsArray = [];
        selectedData.forEach((data) => {
          if (!jsUtils.has(data, 'has_access')) {
            if (jsUtils.has(data, 'team_name')) teamIdsArray.push(data._id);
            else userIdsArray.push(data._id);
          }
        });
        axiosGetUtils(GET_USER_SECURITY_BY_OBJECT, {
          params: {
            ...apiParams,
            query_all_users: 0,
            is_search_by_ids: 1,
            user_ids: userIdsArray,
            team_ids: teamIdsArray,
          },
        })
        .then((res) => {
          // console.log(res.data.result.data, 'jsrhfghejgfjhewjh');
          const { pagination_data } = res.data.result.data;
          if (!jsUtils.isEmpty(pagination_data)) {
            const selectedDataCopy = jsUtils.cloneDeep(selectedData);
            selectedDataCopy.map((data) => {
              const newValue = pagination_data.find((resData) => resData._id === data._id);
              data.has_access = newValue.has_access;
              return data;
            });
            console.log(selectedDataCopy, 'jsrhfghejgfjhewjh');
            assigneeListUpdateHandler && assigneeListUpdateHandler(selectedDataCopy);
            setInitialLoadEndedStatus(true);
          }
        })
        .catch((error) => console.log(error, 'error'));
      }
    }
  }, [selectedData]);
  const removeSelectedTag = (event, id, data, tagValue) => {
    event.stopPropagation();
    if (getAllCurrencyTypes || getAllFileExtensions) removeSelectedUser(tagValue);
    else if (apiUrl) removeSelectedUser(getTagId(data));
    else if (isCustomDropdownList) removeSelectedUser(data.value);
    else removeSelectedUser(id);
    if (getTestBedAssignees) {
      setTimeout(() => {
        userSelectInputFocus && userSelectInputFocus.current && userSelectInputFocus.current.focus();
      }, 10);
    }
    userSelectInputFocus && userSelectInputFocus.current && userSelectInputFocus.current.focus();
  };
  let url = null;
  let updatedApiParams = {};

  if (apiUrl) {
    url = apiUrl;
  } else if (getTeams) {
    url = GET_ALL_TEAMS;
  } else if (getTeamsAndUsers) {
    url = GET_ALL_USERS_OR_TEAMS;
    if (!isEmpty(selectedData)) {
      const excludeUsers = [];
      const excludeTeams = [];
      selectedData.forEach((userOrTeam) => {
        if (userOrTeam.is_user) excludeUsers.push(userOrTeam._id);
        else excludeTeams.push(userOrTeam._id);
      });
      updatedApiParams = {
        exclude_teams: excludeTeams,
        exclude_users: excludeUsers,
       };
    }
  } else if (getAllCurrencyTypes) {
    url = GET_ALL_CURRENCY_TYPES;
  } else if (getAllFileExtensions) {
    if (memberSearchValue) url = GET_ALL_FILE_EXTENSIONS;
    else url = GET_ALL_FILE_TYPES;
  } else if (getUserTeamPickerSuggestion) {
    url = GET_USER_TEAM_PICKER_SUGGESTION;
  } else if (getTestBedAssignees) {
    url = GET_TEST_BED_ASSIGNEES;
  } else if (getUserSecurityByObject) {
    url = GET_USER_SECURITY_BY_OBJECT;
  } else if (getAllowedUsersWithAlert) {
    url = GET_USER_SECURITY_BY_OBJECT;
  } else if (isCustomFormFields) {
    url = GET_ALL_FIELDS;
  } else if (getValidTeamsAndUsers) {
    url = GET_VALID_REVIEW_ASSIGNEES;
  } else {
    url = GET_USERS;
  }

  const internalParams = JSON.stringify({ ...apiParams });

  const getCancelTokenAddMember = (cancelToken) => {
    cancelTokenValidData = cancelToken;
  };

  useEffect(() => {
    const checkFieldFilterAlone = isArray(filterFields) && filterFields.some((field) => field.value_type === 'field');
    if (isDatalistField && !jsUtils.isEmpty(selectedData) && checkFieldFilterAlone && (internalParams !== apiParamData)) {
      setApiParamData(internalParams);
      if (cancelTokenValidData) cancelTokenValidData();
      getDatalistValidCheckData(apiUrl, { ...apiParams, entry_id: entryIds }, searchValue, selectedData, removeSelectedUser, getCancelTokenAddMember, allowOnlySingleSelection, label);
    }
  }, [internalParams]);

  let selectedList = null;
  const usersListWithoutAccess = [];
  if ((!jsUtils.isEmpty(selectedData)) && selectedData.length > 0) {
    selectedList = [];
    const { selectedData } = props;
    selectedList = selectedData.map((data, index) => {
      console.log('userdatasd2', data, 'selectedData', selectedData, data?._id ? data._id : 'tagvalue');
      let tagValue = EMPTY_STRING;
      let tagIcon = EMPTY_STRING;
      let noCloseButton = false;
      if (data && data.email) {
        tagValue = data.email;
        tagIcon = <UserIcon className={styles.UserIcon} role={ARIA_ROLES.IMG} ariaHidden ariaLabel={ADD_MEMBERS_STRINGS.USERICON_ARIA_LABEL} />;
      }
      if (data && data.team_name) {
        tagValue = data.team_name;
        tagIcon = <MyTeamIcon className={styles.TeamIcon} fill={COLOUR_CODES.GRAY_V87} />;
      }
      if ((data && data.isDeleteDisabled) || readOnly) {
        noCloseButton = true;
      }
      if (getAllCurrencyTypes || getAllFileExtensions) tagValue = data;
      if (apiUrl) tagValue = getTagLabel(data);
      if (getAllowedUsersWithAlert && !data.has_access) {
        usersListWithoutAccess.push(tagValue);
      }
      if (isCustomFormFields) tagValue = data.label;
      if (isCustomDropdownList) tagValue = data.label;
      return (
        <Tag
          className={cx(gClasses.MR10, gClasses.MB3, styles.SelectedOptionTag, tagUserClass, (onTagClick ? gClasses.CursorPointer : ''), allowOnlySingleSelection && cx(BS.W100, BS.JC_BETWEEN))} // Assign to form height
          id={data?._id ? data._id : `${data?.value}_${index}`} // if there are spaces in id, error thrown when rendering tag
          onCloseClick={(event, id) => removeSelectedTag(event, id, data, tagValue)}
          noCloseButton={noCloseButton}
          showTagTooltip={showTagTooltip}
          tagValue={tagValue}
          key={`tag${index}`}
          onClick={onTagClick ? () => { allowNavigationToDataList && onTagClick(dataListUUID, data && data.value); } : null}
        >
          <div className={cx(gClasses.CenterV, !((data && data.isDeleteDisabled) || readOnly) && styles.SelectedUserTag)}>
            {tagIcon && (<div className={gClasses.CenterV}>{tagIcon}</div>)}
            <div
              className={cx(styles.SelectedUsersorTeams, gClasses.Ellipsis)}
              title={showTagTitle && tagValue}
            >
              {tagValue}
            </div>
          </div>
        </Tag>
      );
    });
  }
  let selectedUserAlert = null;
  if (usersListWithoutAccess && usersListWithoutAccess.length > 0 && isInitialLoadEnded && isAlertDisplay) {
    const alertText = usersListWithoutAccess.join(COMMA);
    const subText = (usersListWithoutAccess.length === 1) ? ADD_MEMBERS_STRINGS.NO_ACCESS_SINGLE_USER : ADD_MEMBERS_STRINGS.NO_ACCESS_MULTIPLE_USER;
    selectedUserAlert = (
      <div className={cx(styles.Alert, gClasses.FTwo10)}>
        {`${alertText} ${subText}`}
      </div>
    );
  }
  let inputBorder = gClasses.InputBorder;
  if (errorText && !isDisabled) {
    inputBorder = gClasses.ErrorInputBorder;
  }
  const [referencePopperElement, setReferencePopperElement] = useState(null);

  const cancelButton = onCancelButtonClicked ? (
    <div
      role="button"
      className={cx(
        gClasses.FTwo12,
        gClasses.FontWeight500,
        gClasses.MR15,
        gClasses.CursorPointer,
      )}
      style={{ color: buttonColor }}
      tabIndex={0}
      onKeyDown={(e, ...params) => {
        if (keydownOrKeypessEnterHandle(e)) {
          onCancelButtonClicked(...params);
          clearInternalSearchValue();
        }
      }
    }
      onClick={(...params) => {
        onCancelButtonClicked(...params);
        clearInternalSearchValue();
      }}
    >
      {ADD_MEMBERS_STRINGS.DELETE}
    </div>
  ) : null;
  const addButton = onAddButtonClicked ? (
    <Button
      id="member_add_button"
      onClick={(...params) => {
        onAddButtonClicked(...params);
        clearInternalSearchValue();
      }}
      tabIndex={nullCheck(selectedData, 'length', true) ? 0 : -1}
      buttonType={BUTTON_TYPE.PRIMARY}
      disabled={!nullCheck(selectedData, 'length', true)}
      className={cx(styles.AddButton, {
        [gClasses.DisabledField]: !nullCheck(selectedData, 'length', true),
      })}
    >
      {ADD_MEMBERS_STRINGS.ADD}
    </Button>
  ) : null;
  const displayIcon = hideUserIcon
    ? null
    : icon || (
      <UserIconAddMembers
        ariaLabel="add member"
        role={ARIA_ROLES.IMG}
        className={cx(
          styles.UserIconBg,
          gClasses.ML15,
          addButton ? null : gClasses.MB0,
        )}
      />
    );
  const actionButtons = (
    <div
      className={cx(gClasses.CenterV, BS.FLOAT_RIGHT, BS.AS_END, styles.Icon)}
    >
      {cancelButton}
      {addButton}
      {displayIcon}
    </div>
  );

  const userSelect = (value) => {
    if (!getTestBedAssignees) {
      setTimeout(() => {
        userSelectInputFocus && userSelectInputFocus.current && userSelectInputFocus.current.focus();
      }, 10);
    }
    setInitialLoadEndedStatus(true);
    onUserSelectHandler(value);
  };

  const hideAutoSuggestionField = (allowOnlySingleSelection && !jsUtils.isEmpty(selectedList) && selectedList && selectedList.length > 0) || hideSuggestionFieldInput;

  return (
    <div className={cx(className, isDisabled && gClasses.DisabledField, containerSize, gClasses.MB12)}>
      {hideLabel ? null : (
        <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER)}>
          <Label
            content={label}
            id={labelId}
            labelFor={id}
            isRequired={isRequired}
            isDataLoading={isDataLoading}
            message={helperTooltipMessage}
            toolTipId={helperToolTipId}
            labelFontClass={labelClass}
            labelFontClassAdmin={labelClassAdmin}
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
        <Skeleton height={SKELETON_LOADER_DIMENSION_CONSTANTS.PX32} />
      ) : (
        <>
          <div
            className={cx(
              inputBorder,
              innerClassName,
              gClasses.InputBorderRadius,
              getAllFileExtensions ? styles.FileContainer : styles.Container,
              BS.D_FLEX,
              BS.P_RELATIVE,
              // gClasses.CenterV,
              gClasses.ScrollBar,
              isScrollableSelectedList ? styles.ScrollableSelectedList : null,
              BS.FLEX_WRAP_WRAP,
              BS.JC_START,
              readOnly
                ? cx(styles.ReadOnlyInput, allowNavigationToDataList ? '' : gClasses.NoPointerEvent)
                : null,
            )}
            ref={setReferencePopperElement}
          >
            {/* <div className={cx(BS.D_FLEX, gClasses.FlexGrow1, BS.FLEX_WRAP_WRAP, BS.JC_START)}> */}
            {displayOneByOne ?
              <div className={cx(styles.SelectedList, memberListClass)}>
                {selectedList}
              </div>
            : selectedList }
            {!hideAutoSuggestionField && (
              <UserAutoSuggestion
                className={userAutoSuggestionClass}
                selectedData={selectedSuggestionData}
                selectedUserData={selectedData}
                onSelectHandler={userSelect}
                errorText={!isDisabled && errorText}
                placeholder={placeholder}
                id={id}
                inputAriaLabelledBy={inputAriaLabelledBy}
                type={AUTO_SUGGESTION_TYPES.TYPE_3}
                apiUrl={url}
                defaultOptionList={!!apiUrl}
                apiParams={{ ...updatedApiParams, ...apiParams }}
                searchValue={getMemberSearchValue()}
                setSearchValue={setMemberSearchValueHandler}
                getAllCurrencyTypes={getAllCurrencyTypes}
                getAllowedCurrencyTypes={getAllowedCurrencyTypes}
                allowedCurrencyList={allowedCurrencyList}
                getAllFileExtensions={getAllFileExtensions}
                clearTextOnUnmount={clearTextOnUnmount}
                inputClass={cx(
                  customClass,
                  styles.InputClass,
                  // gClasses.ML5,
                  gClasses.CenterV,
                  // gClasses.MB10,
                  styles.ContainerHeight,
                  // gClasses.MT5,
                )}
                ref={containerRefAsProp}
                isActive={isActive}
                suggestionData={suggestionData}
                referencePopperElement={referencePopperElement}
                isMultiSectionView={isMultiSectionView}
                addMemberAndTeamToFlow={addMemberAndTeamToFlow}
                stepIndex={stepIndex}
                lastSignin={lastSignin}
                popperFixedStrategy={popperFixedStrategy}
                popperClassName={popperClassName}
                responsiveClass={responsiveClass}
                actionButtons={actionButtons}
                getOption={getOption}
                setErrorMessage={setErrorMessage}
                inputUserRef={userSelectInputFocus}
                getTestBedAssignees={getTestBedAssignees}
                readOnly={readOnly}
                suggestedTaskAssignee={suggestedTaskAssignee}
                suggestedTaskAssigneesProfilePicList={suggestedTaskAssigneesProfilePicList}
                referenceName={referenceName}
                assigneeIndex={assigneeIndex}
                isCustomFormFields={isCustomFormFields}
                isRequired={isRequired}
                isCustomDropdownList={isCustomDropdownList}
                customAddmemberDropdownList={customAddmemberDropdownList}
                noDataFoundOptionLabel={noDataFoundOptionLabel}
                disabled={disabled}
                focusOnError={focusOnError}
                focusOnErrorRefresher={focusOnErrorRefresher}
                addMember={addMember}
                addTeam={addTeam}
                allowOnlySingleSelection={allowOnlySingleSelection}
                isDatalistField={isDatalistField}
              />
            )}
            {/* </div> */}
            {/* <div className={cx(gClasses.CenterV, BS.FLOAT_RIGHT, BS.AS_END)}>
          {cancelButton}
          {addButton}
          {userIcon}
          </div> */}
          </div>
          {selectedUserAlert}
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
        </>
      )}
      {!hideErrorMessage && !isCreationField && !isEmpty(errorText) && (
        <HelperMessage
          id={helperMessageId}
          message={!isDisabled && errorText}
          type={HELPER_MESSAGE_TYPE.ERROR}
          className={cx(gClasses.ErrorMarginV1, helperMessageClassName)}
        />
      )}
    </div>
  );
}
export default React.forwardRef((props, ref) => (
  <AddMembers containerRefAsProp={ref} {...props} />
));

AddMembers.defaultProps = {
  selectedData: [],
  errorText: EMPTY_STRING,
  memberSearchValue: EMPTY_STRING,
  displayOneByOne: false,
  hideLabel: false,
  label: EMPTY_STRING,
  showTagTitle: false,
  isRequired: false,
  selectedSuggestionData: {},
  placeholder: EMPTY_STRING,
  id: EMPTY_STRING,
  getTeams: null,
  getTeamsAndUsers: null,
  className: EMPTY_STRING,
  onAddButtonClicked: null,
  isActive: false,
  hideErrorMessage: false,
  showTagTooltip: false,
  getUserTeamPickerSuggestion: false,
  customClass: EMPTY_STRING,
  onTagClick: null,
  dataListUUID: null,
  allowNavigationToDataList: false,
  editIcon: null,
  deleteIcon: null,
  labelClass: null,
  suggestedTaskAssignee: null,
  suggestedTaskAssigneesProfilePicList: [],
  allowOnlySingleSelection: false,
  helperMessageClassName: EMPTY_STRING,
  isCustomFormFields: false,
  filterFields: null,
  isAlertDisplay: false,
};

AddMembers.propTypes = {
  selectedData: PropTypes.arrayOf(PropTypes.any),
  dataListUUID: PropTypes.string,
  displayOneByOne: PropTypes.bool,
  showTagTitle: PropTypes.bool,
  allowNavigationToDataList: PropTypes.bool,
  removeSelectedUser: PropTypes.func.isRequired,
  errorText: PropTypes.string,
  showTagTooltip: PropTypes.bool, // if there are spaces in id, error thrown when rendering tag
  memberSearchValue: PropTypes.string,
  hideLabel: PropTypes.bool,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  selectedSuggestionData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  suggestedTaskAssigneesProfilePicList: PropTypes.array,
  onUserSelectHandler: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  getTeams: PropTypes.string,
  getTeamsAndUsers: PropTypes.bool,
  setMemberSearchValue: PropTypes.func.isRequired,
  onAddButtonClicked: PropTypes.func,
  className: PropTypes.string,
  isActive: PropTypes.bool,
  hideErrorMessage: PropTypes.bool,
  getUserTeamPickerSuggestion: PropTypes.bool,
  customClass: PropTypes.string,
  onTagClick: PropTypes.func,
  editIcon: PropTypes.element,
  deleteIcon: PropTypes.element,
  labelClass: PropTypes.element,
  suggestedTaskAssignee: PropTypes.element,
  allowOnlySingleSelection: PropTypes.bool,
  helperMessageClassName: PropTypes.string,
  isCustomFormFields: PropTypes.bool,
  filterFields: PropTypes.any,
  isAlertDisplay: PropTypes.bool,
};
