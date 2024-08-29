import React from 'react';
import PropTypes from 'prop-types';
import AutoSuggestion from '../form_components/auto_suggestion/AutoSuggestion';
import UserAutoSuggestionView from './UserAutoSuggestionView';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

function UserAutoSuggestion(props) {
  const {
    label,
    onSelectHandler,
    errorText,
    placeholder,
    id,
    apiUrl,
    selectedData,
    readOnlyPrefix,
    readOnlySuffix,
    type,
    searchValue,
    setSearchValue,
    isRequired,
    hideMessage,
    not_reporting,
    isSingleSelect,
    getAllowedCurrencyTypes,
    allowedCurrencyList,
    getAllCurrencyTypes,
    getAllFileExtensions,
    className,
    hideLabel,
    hideBorder,
    inputClass,
    isActive,
    suggestionData,
    referencePopperElement,
    isMultiSectionView,
    addMemberAndTeamToFlow,
    stepIndex,
    lastSignin,
    popperFixedStrategy,
    popperClassName,
    responsiveClass,
    actionButtons,
    apiParams,
    getOption,
    setErrorMessage,
    inputUserRef,
    selectedUserData,
    getTestBedAssignees,
    readOnly,
    suggestedTaskAssignee,
    suggestedTaskAssigneesProfilePicList,
    referenceName,
    assigneeIndex,
    isCustomFormFields,
    isCustomDropdownList,
    customAddmemberDropdownList,
    noDataFoundOptionLabel,
    inputAriaLabelledBy,
    disabled,
    userInputAutoFocus,
    focusOnError,
    focusOnErrorRefresher,
    addMember,
    addTeam,
    allowOnlySingleSelection,
    isDatalistField,
    clearTextOnUnmount,
  } = props;
  console.log('placeholderplaceholder', placeholder);
  return (
    <AutoSuggestion
      label={label}
      onSelectHandler={onSelectHandler}
      errorText={errorText}
      placeholder={placeholder}
      id={id}
      apiUrl={apiUrl}
      apiParams={apiParams}
      selectedData={selectedData}
      readOnlyPrefix={readOnlyPrefix}
      readOnlySuffix={readOnlySuffix}
      type={type}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      isRequired={isRequired}
      hideMessage={hideMessage}
      not_reporting={not_reporting}
      isSingleSelect={isSingleSelect}
      getAllowedCurrencyTypes={getAllowedCurrencyTypes}
      allowedCurrencyList={allowedCurrencyList}
      getAllCurrencyTypes={getAllCurrencyTypes}
      hideLabel={hideLabel}
      hideBorder={hideBorder}
      getAllFileExtensions={getAllFileExtensions}
      inputClass={inputClass}
      isActive={isActive}
      suggestionData={suggestionData}
      inputAriaLabelledBy={inputAriaLabelledBy}
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
      inputUserRef={inputUserRef}
      selectedUserData={selectedUserData}
      getTestBedAssignees={getTestBedAssignees}
      readOnly={readOnly}
      suggestedTaskAssignee={suggestedTaskAssignee}
      suggestedTaskAssigneesProfilePicList={suggestedTaskAssigneesProfilePicList}
      referenceName={referenceName}
      assigneeIndex={assigneeIndex}
      isCustomFormFields={isCustomFormFields}
      isCustomDropdownList={isCustomDropdownList}
      customAddmemberDropdownList={customAddmemberDropdownList}
      noDataFoundOptionLabel={noDataFoundOptionLabel}
      disabled={disabled}
      userInputAutoFocus={userInputAutoFocus}
      focusOnError={focusOnError}
      focusOnErrorRefresher={focusOnErrorRefresher}
      addMember={addMember}
      addTeam={addTeam}
      allowOnlySingleSelection={allowOnlySingleSelection}
      isDatalistField={isDatalistField}
      className={className}
      clearTextOnUnmount={clearTextOnUnmount}
    >
      {UserAutoSuggestionView}
    </AutoSuggestion>
  );
}
UserAutoSuggestion.defaultProps = {
  label: EMPTY_STRING,
  errorText: EMPTY_STRING,
  placeholder: EMPTY_STRING,
  id: EMPTY_STRING,
  selectedData: {},
  readOnlyPrefix: EMPTY_STRING,
  readOnlySuffix: EMPTY_STRING,
  searchValue: EMPTY_STRING,
  isRequired: false,
  hideMessage: false,
  hideBorder: false,
  not_reporting: false,
  isSingleSelect: false,
  isActive: false,
  suggestedTaskAssignee: null,
  suggestedTaskAssigneesProfilePicList: [],
  isCustomFormFields: false,
};
UserAutoSuggestion.propTypes = {
  label: PropTypes.string,
  onSelectHandler: PropTypes.func.isRequired,
  errorText: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  apiUrl: PropTypes.string.isRequired,
  selectedData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  readOnlyPrefix: PropTypes.string,
  readOnlySuffix: PropTypes.string,
  type: PropTypes.number.isRequired,
  searchValue: PropTypes.string,
  setSearchValue: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  hideMessage: PropTypes.bool,
  hideBorder: PropTypes.bool,
  not_reporting: PropTypes.bool,
  isSingleSelect: PropTypes.bool,
  isActive: PropTypes.bool,
  suggestedTaskAssignee: PropTypes.element,
  suggestedTaskAssigneesProfilePicList: PropTypes.array,
  isCustomFormFields: PropTypes.bool,
};
export default UserAutoSuggestion;
