import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';

import { BeatLoader } from 'react-spinners';
import AddSection from './add_section/AddSection';
import Section from './section/Section';
import FormBuilderContext from './FormBuilderContext';

import gClasses from '../../scss/Typography.module.scss';
import { BS } from '../../utils/UIConstants';
import styles from './FormBuilder.module.scss';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { FORM_STRINGS, IMPORT_INSTRUCTION } from './FormBuilder.strings';
import { FIELD_ACCESSIBILITY_TYPES, FORM_TYPES } from '../../utils/constants/form.constant';
import { nullCheck } from '../../utils/jsUtility';
import CheckboxGroup from '../form_components/checkbox_group/CheckboxGroup';
import { areAllFormSectionsDisabled, areAllFormSectionsEditable, areAllFormSectionsReadOnly, areAllFormSectionsSelected } from '../../utils/formUtils';
import { FIELD_VIEW_TYPE } from './section/form_fields/FormField.strings';

class FormBuilder extends Component {
  render() {
    const {
      formType,
      className,
      disableOuterBorder,
      hideTitle,
      isDataLoading,
      parentModuleType,
      sections,
      sectionTitle,
      onSectionTitleChangeHandler,
      sectionTitleError,
      onSectionAddButtonClick,
      sectionsLength = 0,

      isCompletedForm,
      isReadOnlyForm,
      isTaskForm,
      isDataListForm,
      isDataList,

      onDefaultValueRuleHandler,
      onDefaultRuleOperatorDropdownHandler,
      onDefaultLValueRuleHandler,
      onDefaultRValueRuleHandler,
      onDefaultExtraOptionsRuleHandler,
      onDefaultRuleOperatorInfoHandler,
      getDefaultRuleByIdApiThunk,
      getRuleDetailsByIdInFieldVisibilityApi,

      taskId,
      stepOrder = 1,
      onTableNameChangeHandler,
      onTableNameBlurHandler,
      onTableReferenceNameChangeHandler,
      disableDragAndDrop,
      onFormFieldChangeHandler,

      onFormFieldOpenAndCloseHandler,
      error_list, server_error,
      getVisibilityExternalFields,
      getTableValidationFields,
      // onAddFieldClick,
      // onDeleteForm,

      onSelectFieldListHandler, onFieldSelectHandler, onFieldAccessibilityHandler, onSelectSectionHandler,
      deleteFormFieldHandler,
      getMoreDependency,
      deleteFormFieldFromDependencyConfig,
      dependencyConfigCloseHandler,
      dependencyConfigData,
      addExistingFieldsDropdownHandler,
      onSelectExistingFieldHandler,
      existingFieldsData,
      addFormFieldsDropdownVisibilityData, setAddFormFieldsDropdownVisibility, clearAddFormFieldsDropdownData,
      onFormSelectHandler,
      getImportTaskPopUp,
      isImportFormModalVisible,
      onSourceSelect,
      showOnlyNewFormFieldsDropdown,
      userDetails,
      setAdditionalErrorList,
      lookupLoadDataHandler,
      lookupListDropdown,
      onLookupFieldChangeHandler,
      getDataListPropertyApi,
      dataListAuditfields,
      auditedTabelRows,
      isAuditView,
      tabelfieldEditedList,
      onDefaultValueCalculationTypeHandler,
      onDefaultRuleAdvanceCodeInputHandler,
      onDefaultRuleAdvanceCodeErrortHandler,
      disableDefaultValueConfig,
      onSectionTitleBlurHandler,
      stepIndex = 0,
      onUserSelectorDefaultValueChangeHandler,
      unique_column_error_message,
      onLabelChangeHandler,
    } = this.props;

    // context initialization
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    const contextValues = {
      formType,
      disableDragAndDrop,
      onTableNameChangeHandler,
      onTableNameBlurHandler,
      onTableReferenceNameChangeHandler,
      parentModuleType,
      isReadOnlyForm,
      isCompletedForm,
      // isEditableForm,
      onDefaultValueRuleHandler,
      onDefaultRuleOperatorDropdownHandler,
      onDefaultLValueRuleHandler,
      onDefaultRValueRuleHandler,
      onDefaultExtraOptionsRuleHandler,
      onDefaultRuleOperatorInfoHandler,
      isTaskForm,
      isDataListForm,
      taskId,
      stepOrder,
      isDataList,
      getDefaultRuleByIdApiThunk,
      getRuleDetailsByIdInFieldVisibilityApi,
      onFormFieldChangeHandler,
      onFormFieldOpenAndCloseHandler,
      getVisibilityExternalFields,
      getTableValidationFields,
      error_list,
      server_error,
      sectionsLength,
      onSelectFieldListHandler,
      onFieldSelectHandler,
      onFieldAccessibilityHandler,
      onSelectSectionHandler,
      getImportTaskPopUp,
      deleteFormFieldHandler,
      deleteFormFieldFromDependencyConfig,
      dependencyConfigCloseHandler,
      dependencyConfigData,
      addExistingFieldsDropdownHandler,
      onSelectExistingFieldHandler,
      existingFieldsData,
      isImportFormModalVisible,
      onSourceSelect,
      addFormFieldsDropdownVisibilityData,
      setAddFormFieldsDropdownVisibility,
      clearAddFormFieldsDropdownData,
      setAdditionalErrorList,
      userDetails,
      lookupLoadDataHandler,
      lookupListDropdown,
      onLookupFieldChangeHandler,
      getDataListPropertyApi,
      dataListAuditfields,
      auditedTabelRows,
      isAuditView,
      tabelfieldEditedList,
      onDefaultValueCalculationTypeHandler,
      onDefaultRuleAdvanceCodeInputHandler,
      onDefaultRuleAdvanceCodeErrortHandler,
      disableDefaultValueConfig,
      onSectionTitleBlurHandler,
      stepIndex,
      onUserSelectorDefaultValueChangeHandler,
      getMoreDependency,
      onLabelChangeHandler,
      sections,
    };
    console.log('CSS ISSUE FORMBUILDER', lookupLoadDataHandler, lookupListDropdown, onLookupFieldChangeHandler);
    let sectionList = null;
    let addSectionButton = null;
    let formBuilderTitle = null;
    let formCreationClass = null;
    const loader = isDataLoading && <BeatLoader size={10} color="#1f243d" loading />;

    switch (formType) {
      case FORM_TYPES.CREATION_FORM:
        sectionList = !isDataLoading && this.generateCreationSections();
        addSectionButton = !isDataLoading && (
          <div>
          <AddSection
            sectionTitle={sectionTitle}
            sectionTitleError={sectionTitleError}
            onTextChange={onSectionTitleChangeHandler}
            onSectionAddButtonClick={onSectionAddButtonClick}
            showOnlyNewFormFieldsDropdown={showOnlyNewFormFieldsDropdown}
            onSourceSelect={() => onSourceSelect(null)}
          />
          </div>
        );
        formBuilderTitle = !hideTitle && (
          <div className={cx(BS.D_FLEX, BS.JC_BETWEEN)}>
            <div className={cx(gClasses.FTwo14BlackV8, gClasses.FontWeight500, gClasses.MB10)}>
              {FORM_STRINGS.TITLE}
            </div>
            {/* delete form button */}
            {/* <DeleteIcon className={cx(gClasses.ML30, gClasses.CursorPointer)} onClick={onDeleteForm} /> */}
          </div>
        );
        formCreationClass = !disableOuterBorder ? cx(styles.EditableContainer) : null;
        break;
      case FORM_TYPES.EDITABLE_FORM:
        sectionList = !isDataLoading && this.generateEditableSections();
        break;
      case FORM_TYPES.IMPORTABLE_FORM:
        const areAllSelected = areAllFormSectionsSelected(sections, true);
        const areAllReadOnly = areAllFormSectionsReadOnly(sections, true);
        const areAllEditable = areAllFormSectionsEditable(sections, true);
        const isEntireFormDisabled = areAllFormSectionsDisabled(sections);

        sectionList = !isDataLoading && (
        <>
        <div className={cx(gClasses.CenterV, BS.JC_BETWEEN, styles.Header)}>
            {/* <ButtonSwitch
              className={cx(!areAllSelected ? gClasses.DisabledField : null, gClasses.MR20)}
              optionList={FORM_STRINGS.IMPORT_FIELDS.BUTTON_SWITCH.option_list}
              onClick={isEntireFormDisabled ? () => {} : onFormAccessibilityHandler}
              selectedValue={(areAllReadOnly && FIELD_ACCESSIBILITY_TYPES.READ_ONLY) || (areAllEditable && FIELD_ACCESSIBILITY_TYPES.EDITABLE) || undefined}
            /> */}
              <div className={cx(
                gClasses.FTwo13GrayV9,
                gClasses.WhiteSpaceNoWrap,
                )}
              >
               {IMPORT_INSTRUCTION.IMPORT_ALL_FIELDS}
              </div>
              <div className={styles.HLine} />
            <div className={gClasses.CenterV}>
              <CheckboxGroup
                optionList={[{ label: IMPORT_INSTRUCTION.READ_ONLY_TEXT, value: 1 }]}
                className={cx(gClasses.FontWeight500, gClasses.CheckBox, isEntireFormDisabled ? gClasses.DisabledField : null)}
                selectedValues={areAllSelected && areAllReadOnly && !isEntireFormDisabled ? [1] : []}
                onClick={isEntireFormDisabled ? () => {} : () => onFormSelectHandler(FIELD_ACCESSIBILITY_TYPES.READ_ONLY)}
                hideLabel
                hideMessage
                checkboxViewLabelClassName={styles.labelClass}
                checkboxViewClassName={styles.MR10}
                checkboxClasses={styles.Checkbox}
              />
               <CheckboxGroup
                optionList={[{ label: FIELD_VIEW_TYPE.EDITABLE, value: 1 }]}
                className={cx(gClasses.FontWeight500, gClasses.CheckBox, isEntireFormDisabled ? gClasses.DisabledField : null)}
                selectedValues={areAllSelected && areAllEditable && !isEntireFormDisabled ? [1] : []}
                onClick={isEntireFormDisabled ? () => {} : () => onFormSelectHandler(FIELD_ACCESSIBILITY_TYPES.EDITABLE)}
                hideLabel
                hideMessage
                checkboxViewLabelClassName={styles.labelClass}
                checkboxViewClassName={BS.MARGIN_0}
                checkboxClasses={styles.Checkbox}
               />
            </div>
        </div>
        <div className={styles.ImportSectionContainer}>
          <div className={styles.ImportSections}>
            {this.generateImportableSections()}
            {unique_column_error_message}
          </div>
        </div>
        </>
        );
        break;
      default:
        break;
    }

    return (
      <FormBuilderContext.Provider value={contextValues}>
        {formBuilderTitle}
        <div className={cx(className, formCreationClass, BS.W100)}>
          {loader}
          {sectionList}
          {addSectionButton}
        </div>
      </FormBuilderContext.Provider>
    );
  }

  generateCreationSections = () => {
    const {
      sections,
      getNewInputId,
      onLabelChangeHandler,
      onReferenceNameChangeHandler,
      onReferenceNameBlurHandler,
      onLabelBlurHandler,
      error_list,
      datalist_selector_error_list,
      server_error,
      onDefaultChangeHandler,
      onRequiredClickHandler,
      onReadOnlyClickHandler,
      onOtherConfigChangeHandler,
      onOtherConfigBlurHandler,
      onValidationConfigChangeHandler,
      onValidationConfigBlurHandler,
      onSaveFormField,
      onAddValues,
      onAddedSectionTitleChangeHandler,
      // onAddFieldClick,
      // onSuggestionListLoadMore,
      // onSuggestionTextChange,
      suggestionDetails,
      showSuggestion,
      onSectionAddButtonClick,
      onDeleteSectionHandler,
      onDeleteFormFromDependencyConfig,
      showOnlyNewFormFieldsDropdown,
      onFieldDragEndHandler,
      onSectionDragEndHandler,
      onAddExistingFieldToSection,
      lookupListDropdown,
      lookupLoadDataHandler,
      onLookupFieldChangeHandler,
      isTaskForm,
      onUserSelectorDefaultValueChangeHandler,
      getMoreDependency,
    } = this.props;
    let sections_ = [];
    if (nullCheck(sections, 'length', true)) {
      sections_ = sections.map((section, index) => (
        <Section
          key={`section${index}`}
          index={index}
          sectionIndex={index}
          details={section}
          allSectionsLength={sections.length}
          getNewInputId={getNewInputId}
          onLabelChangeHandler={onLabelChangeHandler}
          lookupListDropdown={lookupListDropdown}
          lookupLoadDataHandler={lookupLoadDataHandler}
          onLookupFieldChangeHandler={onLookupFieldChangeHandler}
          onReferenceNameChangeHandler={onReferenceNameChangeHandler}
          onReferenceNameBlurHandler={onReferenceNameBlurHandler}
          onLabelBlurHandler={onLabelBlurHandler}
          error_list={error_list}
          datalist_selector_error_list={datalist_selector_error_list}
          server_error={server_error}
          onDefaultChangeHandler={onDefaultChangeHandler}
          onRequiredClickHandler={onRequiredClickHandler}
          onReadOnlyClickHandler={onReadOnlyClickHandler}
          onOtherConfigBlurHandler={onOtherConfigBlurHandler}
          onOtherConfigChangeHandler={onOtherConfigChangeHandler}
          onValidationConfigChangeHandler={onValidationConfigChangeHandler}
          onValidationConfigBlurHandler={onValidationConfigBlurHandler}
          onSaveFormField={onSaveFormField}
          onAddValues={onAddValues}
          onAddedSectionTitleChangeHandler={onAddedSectionTitleChangeHandler}
          suggestionDetails={suggestionDetails}
          // onAddFieldClick={onAddFieldClick}
          // onSuggestionListLoadMore={onSuggestionListLoadMore}
          // onSuggestionTextChange={onSuggestionTextChange}
          onAddExistingFieldToSection={onAddExistingFieldToSection}
          onSectionAddButtonClick={onSectionAddButtonClick}
          onDeleteSectionHandler={onDeleteSectionHandler}
          onDeleteFormFromDependencyConfig={onDeleteFormFromDependencyConfig}
          showSuggestion={showSuggestion}
          showOnlyNewFormFieldsDropdown={showOnlyNewFormFieldsDropdown}
          onFieldDragEndHandler={(event) => onFieldDragEndHandler && onFieldDragEndHandler(event, index)}
          onSectionDragEndHandler={onSectionDragEndHandler}
          // disallowSessionAddAndActionButton={section.is_system_defined}  enabled Add form fields for user datalist under Basic ,Organization and Contact details
          isTaskForm={isTaskForm}
          onUserSelectorDefaultValueChangeHandler={onUserSelectorDefaultValueChangeHandler}
          getMoreDependency={getMoreDependency}
        />
      ));
    }
    return sections_;
  };

  generateEditableSections = () => {
    const {
      sections,
      onChangeHandler,
      stateData,
      activeFormContent,
      onDeleteFileClick,
      onRetryFileUploadClick,
      onTableAddOrDeleteRowClick,
      isReadOnlyForm,
      formVisibility,
      error_list,
      server_error,
      getMoreDependency,
    } = this.props;
    let sections_ = [];
    if (nullCheck(sections, 'length', true)) {
      sections_ = sections.map((section, index) => (
        <Section
          key={`editable_section_${index}`}
          details={section}
          sectionIndex={index}
          onChangeHandler={onChangeHandler}
          stateData={stateData}
          activeFormContent={activeFormContent}
          onDeleteFileClick={onDeleteFileClick}
          onRetryFileUploadClick={onRetryFileUploadClick}
          onTableAddOrDeleteRowClick={onTableAddOrDeleteRowClick}
          isReadOnlyForm={isReadOnlyForm}
          formVisibility={formVisibility}
          error_list={error_list}
          server_error={server_error}
          getMoreDependency={getMoreDependency}
        />
      ));
    }
    return sections_;
  };

  generateImportableSections = () => {
    const {
      sections,
      error_list,
    } = this.props;

    let sections_ = [];
    if (nullCheck(sections, 'length', true)) {
      sections_ = sections.map((eachSection, eachSectionIndex) => (
        <Section
          sectionIndex={eachSectionIndex}
          key={`importable_section_${eachSectionIndex}`}
          details={eachSection}
          isImportableForm
          error_list={error_list}
        />
      ));
    }
    return sections_;
  };
}

export default FormBuilder;

FormBuilder.defaultProps = {
  sectionTitle: EMPTY_STRING,
  error_list: {},
  className: EMPTY_STRING,
  isEditableForm: false,
  stateData: {},
  sectionTitleError: EMPTY_STRING,
  onSelectSection: null,
  onSelectFieldHandler: null,
  onReadOnlySelectHandler: null,
  onEditableSelectHandler: null,
  onSectionTitleChangeHandler: null,
  onSectionAddButtonClick: null,
  getNewInputId: null,
  onDefaultChangeHandler: null,
  onRequiredClickHandler: null,
  onReadOnlyClickHandler: null,
  onOtherConfigChangeHandler: null,
  onValidationConfigChangeHandler: null,
  onSaveFormField: null,
  onAddValues: null,
  onAddedSectionTitleChangeHandler: null,
  onDeleteSectionHandler: null,
  // deleteFormField: null,
  hideTitle: false,
  onChangeHandler: null,
  onValidationConfigBlurHandler: null,
  onOtherConfigBlurHandler: null,
  onLabelChangeHandler: null,
  onLabelBlurHandler: null,
  isDataLoading: false,
  disableOuterBorder: false,
  disableDragAndDrop: false,
  getDefaultRuleByIdApiThunk: () => {},
  getRuleDetailsByIdInFieldVisibilityApi: () => {},
};

FormBuilder.propTypes = {
  onSectionTitleChangeHandler: PropTypes.func,
  sectionTitle: PropTypes.string,
  onSectionAddButtonClick: PropTypes.func,
  getNewInputId: PropTypes.func,
  onLabelChangeHandler: PropTypes.func,
  onLabelBlurHandler: PropTypes.func,
  error_list: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onDefaultChangeHandler: PropTypes.func,
  onRequiredClickHandler: PropTypes.func,
  onReadOnlyClickHandler: PropTypes.func,
  onOtherConfigBlurHandler: PropTypes.func,
  onOtherConfigChangeHandler: PropTypes.func,
  onValidationConfigChangeHandler: PropTypes.func,
  onValidationConfigBlurHandler: PropTypes.func,
  onSaveFormField: PropTypes.func,
  onAddValues: PropTypes.func,
  onAddedSectionTitleChangeHandler: PropTypes.func,
  className: PropTypes.string,
  // deleteFormField: PropTypes.func,
  isEditableForm: PropTypes.bool,
  onChangeHandler: PropTypes.func,
  stateData: PropTypes.objectOf(PropTypes.any),
  sectionTitleError: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onSelectSection: PropTypes.func,
  onSelectFieldHandler: PropTypes.func,
  onReadOnlySelectHandler: PropTypes.func,
  onEditableSelectHandler: PropTypes.func,
  onDeleteSectionHandler: PropTypes.func,
  hideTitle: PropTypes.bool,
  isDataLoading: PropTypes.bool,
  disableOuterBorder: PropTypes.bool,
  disableDragAndDrop: PropTypes.bool,
  getDefaultRuleByIdApiThunk: PropTypes.func,
  getRuleDetailsByIdInFieldVisibilityApi: PropTypes.func,
};
