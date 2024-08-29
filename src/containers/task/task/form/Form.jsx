/* eslint-disable import/no-cycle */
import React, { useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { getDefaultRuleByIdApiThunk } from 'redux/actions/CreateTask.Action';
import { connect } from 'react-redux';
import { tableValidationExternalFieldsThunk } from 'redux/actions/Visibility.Action';
import { clearFormulaBuilderValues } from 'redux/reducer/FormulaBuilderReducer';
import FormBuilder from '../../../../components/form_builder/FormBuilder';

import gClasses from '../../../../scss/Typography.module.scss';
import {
  FORM_PARENT_MODULE_TYPES,
  FORM_TYPES,
} from '../../../../utils/constants/form.constant';
import { apiGetAllFieldsList } from '../../../../axios/apiService/flow.apiService';

function Form(props) {
  const {
    onSectionTitleChangeHandler,
    sectionTitle,
    sectionTitleError,
    onSectionAddButtonClick,
    sections,
    getNewInputId,
    onLabelChangeHandler,
    onReferenceNameChangeHandler,
    onReferenceNameBlurHandler,
    onLabelBlurHandler,
    onDefaultChangeHandler,
    onRequiredClickHandler,
    onReadOnlyClickHandler,
    onOtherConfigChangeHandler,
    onOtherConfigBlurHandler,
    onValidationConfigChangeHandler,
    onValidationConfigBlurHandler,
    error_list,
    datalist_selector_error_list,
    server_error,
    onSaveFormField,
    onAddValues,
    onAddedSectionTitleChangeHandler,
    hideFormBuilderTitle,
    onDeleteSectionHandler,
    showOnlyNewFormFieldsDropdown,
    onFieldDragEndHandler,
    onSectionDragEndHandler,
    onDefaultValueRuleHandler,
    onDefaultRuleOperatorDropdownHandler,
    onDefaultRValueRuleHandler,
    onDefaultLValueRuleHandler,
    onDefaultExtraOptionsRuleHandler,
    onDefaultRuleOperatorInfoHandler,
    taskId,
    onTableNameChangeHandler,
    onTableReferenceNameChangeHandler,
    onTableNameBlurHandler,
    onFormFieldChangeHandler,
    onFormFieldOpenAndCloseHandler,
    getVisibilityExternalFields,
    getTableValidationFields,
    deleteFormFieldHandler,
    deleteFormFieldFromDependencyConfig,
    dependencyConfigCloseHandler,
    dependencyConfigData,
    addFormFieldsDropdownVisibilityData,
    setAddFormFieldsDropdownVisibility,
    setAdditionalErrorList,
    lookupLoadDataHandler,
    lookupListDropdown,
    onLookupFieldChangeHandler,
    isFormDataLoading,
    getRuleDetailsByIdInFieldVisibilityApi,
    userDetails,
    onClearFormulaBuilderValues,
    onDefaultValueCalculationTypeHandler,
    onDefaultRuleAdvanceCodeInputHandler,
    onDefaultRuleAdvanceCodeErrortHandler,
    disableDefaultValueConfig,
    onSectionTitleBlurHandler,
    onUserSelectorDefaultValueChangeHandler,
  } = props;
  console.log(
    'CSS ISSUE FORM TASK',
    hideFormBuilderTitle,
  );

  useEffect(() => () => onClearFormulaBuilderValues(), []);

  const getDataListPropertyApi = (params, setCancelToken, cancelToken) => {
    params.task_metadata_id = taskId;
    return apiGetAllFieldsList(params, setCancelToken, cancelToken);
  };
  const getVisibilityExternalFieldApi = (params, ignoredFieldList) => {
    params.task_metadata_id = taskId;
    const fieldListType = 'direct';
    return getVisibilityExternalFields(
      params,
      fieldListType,
      ignoredFieldList,
      apiGetAllFieldsList,
    );
  };

  const getTableValidationFieldApi = (params) => {
    params.task_metadata_id = taskId;
    return getTableValidationFields(
      params,
      apiGetAllFieldsList,
    );
  };
  return (
    <div className={cx(gClasses.StepperFormContainer)}>
      {/* <RadioGroup
        id={FORM_CONFIRMATION.ID}
        optionList={FORM_CONFIRMATION.OPTION_LIST}
        label={FORM_CONFIRMATION.LABEL}
        onClick={onFormConfirmation}
        selectedValue={collectData}
        className={gClasses.MB10}
        hideMessage
      /> */}
      <FormBuilder
        parentModuleType={FORM_PARENT_MODULE_TYPES.TASK}
        formType={FORM_TYPES.CREATION_FORM}
        onSectionTitleChangeHandler={onSectionTitleChangeHandler}
        isTaskForm
        sectionTitle={sectionTitle}
        sectionTitleError={sectionTitleError}
        onSectionAddButtonClick={onSectionAddButtonClick}
        sections={sections}
        getNewInputId={getNewInputId}
        onLabelChangeHandler={onLabelChangeHandler}
        onReferenceNameChangeHandler={onReferenceNameChangeHandler}
        onReferenceNameBlurHandler={onReferenceNameBlurHandler}
        onLabelBlurHandler={onLabelBlurHandler}
        onDefaultChangeHandler={onDefaultChangeHandler}
        onRequiredClickHandler={onRequiredClickHandler}
        onReadOnlyClickHandler={onReadOnlyClickHandler}
        onOtherConfigChangeHandler={onOtherConfigChangeHandler}
        onOtherConfigBlurHandler={onOtherConfigBlurHandler}
        onValidationConfigChangeHandler={onValidationConfigChangeHandler}
        onValidationConfigBlurHandler={onValidationConfigBlurHandler}
        error_list={error_list}
        datalist_selector_error_list={datalist_selector_error_list}
        server_error={server_error}
        onSaveFormField={onSaveFormField}
        deleteFormFieldHandler={deleteFormFieldHandler}
        onAddValues={onAddValues}
        onAddedSectionTitleChangeHandler={onAddedSectionTitleChangeHandler}
        selectFields
        hideTitle={hideFormBuilderTitle}
        onDeleteSectionHandler={onDeleteSectionHandler}
        showOnlyNewFormFieldsDropdown={showOnlyNewFormFieldsDropdown}
        onFieldDragEndHandler={onFieldDragEndHandler}
        onSectionDragEndHandler={onSectionDragEndHandler}
        onDefaultValueRuleHandler={onDefaultValueRuleHandler}
        onDefaultRuleOperatorDropdownHandler={
          onDefaultRuleOperatorDropdownHandler
        }
        onDefaultRValueRuleHandler={onDefaultRValueRuleHandler}
        onDefaultLValueRuleHandler={onDefaultLValueRuleHandler}
        onDefaultExtraOptionsRuleHandler={onDefaultExtraOptionsRuleHandler}
        onDefaultRuleOperatorInfoHandler={onDefaultRuleOperatorInfoHandler}
        taskId={taskId}
        onTableNameChangeHandler={onTableNameChangeHandler}
        onTableNameBlurHandler={onTableNameBlurHandler}
        onTableReferenceNameChangeHandler={onTableReferenceNameChangeHandler}
        onFormFieldChangeHandler={onFormFieldChangeHandler}
        onFormFieldOpenAndCloseHandler={onFormFieldOpenAndCloseHandler}
        getDefaultRuleByIdApiThunk={getDefaultRuleByIdApiThunk}
        getVisibilityExternalFields={getVisibilityExternalFieldApi}
        getTableValidationFields={getTableValidationFieldApi}
        deleteFormFieldFromDependencyConfig={
          deleteFormFieldFromDependencyConfig
        }
        dependencyConfigCloseHandler={dependencyConfigCloseHandler}
        dependencyConfigData={dependencyConfigData}
        addFormFieldsDropdownVisibilityData={
          addFormFieldsDropdownVisibilityData
        }
        setAddFormFieldsDropdownVisibility={setAddFormFieldsDropdownVisibility}
        setAdditionalErrorList={setAdditionalErrorList}
        lookupLoadDataHandler={lookupLoadDataHandler}
        lookupListDropdown={lookupListDropdown}
        onLookupFieldChangeHandler={onLookupFieldChangeHandler}
        isDataLoading={isFormDataLoading}
        getRuleDetailsByIdInFieldVisibilityApi={
          getRuleDetailsByIdInFieldVisibilityApi
        }
        userDetails={userDetails}
        getDataListPropertyApi={getDataListPropertyApi}
        onDefaultValueCalculationTypeHandler={onDefaultValueCalculationTypeHandler}
        onDefaultRuleAdvanceCodeInputHandler={onDefaultRuleAdvanceCodeInputHandler}
        onDefaultRuleAdvanceCodeErrortHandler={onDefaultRuleAdvanceCodeErrortHandler}
        disableDefaultValueConfig={disableDefaultValueConfig}
        onSectionTitleBlurHandler={onSectionTitleBlurHandler}
        onUserSelectorDefaultValueChangeHandler={onUserSelectorDefaultValueChangeHandler}
      />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTableValidationFields: (...params) =>
    dispatch(tableValidationExternalFieldsThunk(...params)),
    onClearFormulaBuilderValues: () => dispatch(clearFormulaBuilderValues()),
    dispatch,
  };
};

export default connect(null, mapDispatchToProps)(Form);
Form.defaultProps = {
  // assignees: {},
  // member_team_search_value: EMPTY_STRING,
  error_list: null,
  // dueDate: EMPTY_STRING,
  // teamOrUserSelectHandler: null,
  // setMemberOrTeamSearchValue: null,
  // teamOrUserRemoveHandler: null,
  // onDueDateChangeHandler: null,
};
Form.propTypes = {
  // teamOrUserSelectHandler: PropTypes.func,
  // assignees: PropTypes.objectOf(PropTypes.any),
  // member_team_search_value: PropTypes.string,
  // setMemberOrTeamSearchValue: PropTypes.func,
  // teamOrUserRemoveHandler: PropTypes.func,
  error_list: PropTypes.arrayOf(),
  // onDueDateChangeHandler: PropTypes.func,
  // dueDate: PropTypes.string,
};
