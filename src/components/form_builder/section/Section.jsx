import React, { useContext, useRef, useState, useEffect } from 'react';
import cx from 'classnames/bind';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { DndProvider } from 'react-dnd';
import { Row, Col } from 'reactstrap';
import { isMobileScreen, onWindowResize, ifArrayisFullEmpty, keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import ChevronIcon from 'assets/icons/ChevronIcon';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import ImportFormIcon from 'assets/icons/flow/ImportFormIcon';
import { STEP_CARD_STRINGS } from 'containers/edit_flow/EditFlow.strings';
import ThemeContext from '../../../hoc/ThemeContext';
import FormBuilderContext from '../FormBuilderContext';

import Dropdown from '../../form_components/dropdown/Dropdown';
import AddFormFields from './add_form_fields/AddFormFields';
import FormField from './form_fields/FormFields';
import { ARIA_ROLES, BS } from '../../../utils/UIConstants';
import styles from './Section.module.scss';
import gClasses from '../../../scss/Typography.module.scss';
import Input from '../../form_components/input/Input';
import MoreIcon from '../../../assets/icons/MoreIcon';
import HelperMessage, {
  HELPER_MESSAGE_TYPE,
} from '../../form_components/helper_message/HelperMessage';
import CheckboxGroup from '../../form_components/checkbox_group/CheckboxGroup';
import CreateTable from './create_table/CreateTable';
import { POPPER_PLACEMENTS } from '../../auto_positioning_popper/AutoPositioningPopper';
import {
  getSectionRearrangeMenuOptions,
  isFormDragDisabled,
} from '../FormBuilder.utils';
import { FF_DROPDOWN_LIST_SECTION_TITLE_TYPE, FIELD_TYPES, SECTION_MENU, FORM_BUILDER_DND_ITEMS, FULL_WIDTH_FIELDS, FORM_STRINGS } from '../FormBuilder.strings';
import jsUtils, { isEmpty, nullCheck, get } from '../../../utils/jsUtility';
import {
  FIELD_LIST_TYPE,
  FIELD_LIST_KEYS,
  ADD_FORM_FIELD_SOURCE,
  FORM_TYPES,
  FORM_PARENT_MODULE_TYPES,
} from '../../../utils/constants/form.constant';
import { areAllSectionFieldListDisabled, areAllSectionFieldListSelected, getSectionTitleError, checkIsFieldNull, checkIsAllTableFieldsNull } from '../../../utils/formUtils';
import FormFieldDragDropWrapper from '../dnd/drag_drop_wrapper/FormFieldDragDropWrapper';
import ImportTable from './import_table/ImportTable';
// import ContextFieldSuggestions from './add_form_fields/context_field_suggestions/ContextFieldSuggestions';
import { formDisabilityCheck, formVisibilityCheck } from './form_fields/FormField.utils';
import DependencyHandler from '../../dependency_handler/DependencyHandler';

function Section(props) {
  const { t } = useTranslation();
  const backend = isMobileScreen() ? TouchBackend : HTML5Backend;
  const backendOptions = isMobileScreen() ? { enableMouseEvents: true } : {};
  const [isMobile, setIsMobile] = useState(isMobileScreen());
  const [isSectionExpanded, setIsSectionExpanded] = useState(true);
  const windowResize = () => {
    setIsMobile(isMobileScreen());
  };
  useEffect(() => {
    onWindowResize(windowResize);
    return () => window.removeEventListener('resize', windowResize);
  });
  const { primaryColor } = useContext(ThemeContext);
  const {
    disableDragAndDrop,
    isCompletedForm,
    onTableNameBlurHandler,
    formType,
    parentModuleType,
    onFormFieldChangeHandler,
    onSelectFieldListHandler, onFieldSelectHandler, onFieldAccessibilityHandler, onSelectSectionHandler,
    dependencyConfigCloseHandler, dependencyConfigData = {},
    onSourceSelect,
    onSectionTitleBlurHandler,
  } = useContext(FormBuilderContext);
  const {
    index,
    sectionIndex,
    details,
    onLabelChangeHandler,
    lookupListDropdown,
    lookupLoadDataHandler,
    onLookupFieldChangeHandler,
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
    onChangeHandler,
    suggestionDetails,
    onSelectFieldHandler,
    onReadOnlySelectHandler,
    onEditableSelectHandler,
    showSuggestion,
    activeFormContent,
    onDeleteFileClick,
    onRetryFileUploadClick,
    onSectionAddButtonClick,
    onTableAddOrDeleteRowClick,
    onDeleteSectionHandler,
    getMoreDependency,
    showOnlyNewFormFieldsDropdown,
    onFieldDragEndHandler,
    onSectionDragEndHandler,
    allSectionsLength,
    onAddExistingFieldToSection,
    getNewInputId,
    onDeleteFormFromDependencyConfig,
    disallowSessionAddAndActionButton,
    isTaskForm,
    isNavOpen,
  } = props;
  const {
    showFieldDependencyDialog = false,
    showStepDependencyDialog = false,
    showFormDependencyDialog = false,
    showSectionDependencyDialog = false,
    dependency_data,
    dependency_type,
  } = dependencyConfigData;

  const isDragDisabled = isFormDragDisabled(
    details,
    showFieldDependencyDialog,
    showStepDependencyDialog,
    showFormDependencyDialog,
    showSectionDependencyDialog,
  );

  const pref_locale = localStorage.getItem('application_language');

  const isCreationForm = formType === FORM_TYPES.CREATION_FORM;
  const sectionTitleError = getSectionTitleError(error_list, details, sectionIndex);
  const [isChildrenVisible] = useState(true);
  const [isDisplayTaskList] = useState(true);
  const referenceSectionPopperElement = useRef(null);
  const commonDNDConditions = isCreationForm && !disableDragAndDrop && !isDragDisabled;
  const addFormFieldClass = cx(BS.ALIGN_ITEM_CENTER, BS.JC_CENTER, BS.H100);
  const tablePrevScroll = useRef();
  let emptyFieldList = null; // empty field list drag and drop
  // let fieldAutoSuggestionView = null;
  const SectionMargin = (parentModuleType === FORM_PARENT_MODULE_TYPES.DATA_LIST) ?
  (isNavOpen ? gClasses.MR160 : gClasses.MR320) : null;

  const formfieldWidth = (parentModuleType !== FORM_PARENT_MODULE_TYPES.FLOW && parentModuleType !== FORM_PARENT_MODULE_TYPES.DATA_LIST) ?
  (styles.fieldWidth) : null;

  const ARIA_LABEL = {
    MORE: 'More items',
  };

  const getCreationFields = (fieldListItem, fieldListIndex) => {
    if (nullCheck(fieldListItem, 'fields.length', true)) {
      const fields = [...fieldListItem.fields];
      const fields_ = fields.map((field_data, fieldIndex) => {
        const errorList = { ...error_list, ...server_error };
        let serverErrorMessage = EMPTY_STRING;
        Object.values(errorList).forEach((id) => {
          try {
            const idArray = id?.field ? id.field.split('.') : [];
            if (!jsUtils.isEmpty(idArray) && idArray.includes('validations') &&
                (Number(jsUtils.get(idArray, [2], '')) === (jsUtils.get(details, ['section_order'], 0) - 1) ||
                Number(jsUtils.get(idArray, [1], '')) === (jsUtils.get(details, ['section_order'], 0) - 1)) &&
                (Number(jsUtils.get(idArray, [4], '')) === fieldListIndex ||
                Number(jsUtils.get(idArray, [3], '')) === fieldListIndex) &&
                (Number(jsUtils.get(idArray, [6], '')) === fieldIndex ||
                Number(jsUtils.get(idArray, [5], '')) === fieldIndex)) {
                  serverErrorMessage = 'Error in field configuration';
            }
          } catch (error) {
            console.log(error);
          }
        });
        return (
        <FormField
          sectionIndex={sectionIndex}
          fieldListIndex={fieldListIndex}
          fieldIndex={fieldIndex}
          sectionId={details.section_order}
          fieldList={fieldListItem}
          field_data={field_data}
          index={index}
          onLabelChangeHandler={onLabelChangeHandler}
          lookupListDropdown={lookupListDropdown}
          lookupLoadDataHandler={lookupLoadDataHandler}
          onLookupFieldChangeHandler={onLookupFieldChangeHandler}
          onReferenceNameChangeHandler={onReferenceNameChangeHandler}
          onReferenceNameBlurHandler={onReferenceNameBlurHandler}
          onLabelBlurHandler={onLabelBlurHandler}
          onDefaultChangeHandler={onDefaultChangeHandler}
          onRequiredClickHandler={onRequiredClickHandler}
          onReadOnlyClickHandler={onReadOnlyClickHandler}
          onOtherConfigChangeHandler={onOtherConfigChangeHandler}
          onOtherConfigBlurHandler={onOtherConfigBlurHandler}
          onValidationConfigChangeHandler={onValidationConfigChangeHandler}
          onAddValues={(event, row_order) => onAddValues(event, fieldListIndex, row_order, details.section_order)}
          onValidationConfigBlurHandler={onValidationConfigBlurHandler}
          onSaveFormField={onSaveFormField}
          error_list={error_list}
          datalist_selector_error_list={datalist_selector_error_list}
          key={index}
          isTable={fieldListItem.field_list_type === FIELD_LIST_TYPE.TABLE}
          tableUuid={fieldListItem.table_uuid}
          getNewInputId={getNewInputId}
          isFirstTableField={fieldListItem.field_list_type === FIELD_LIST_TYPE.TABLE && fieldIndex === 0}
          serverErrorMessage={serverErrorMessage}
        // isDragDisabled={true || isDragDisabled}
        />
        );
    });
      return fields_;
    }
    return [];
  };

  const toggleSectionView = () => {
    console.log('isSectionExpanded3w1', isSectionExpanded);
    setIsSectionExpanded(!isSectionExpanded);
  };

  const onDrop = (item, monitor, data) => {
    // if( isMobileScreen() &&  String(data.path).includes(',')) return;
    if (monitor.didDrop()) return;

  const sourceIndex = item.id;
  const destination = String(data.path);
  const event = {
    source: { index: sourceIndex },
    destination: { index: destination },
  };
  onFieldDragEndHandler(event);
};

  const generateCreationFieldList = (getAddAndImportFields) => {
    const fieldListLength = details && details.field_list && details.field_list.length;
    return details && details.field_list && details.field_list.map((fieldList, fieldListIndex) => {
      let eachFieldList = null;
      let rowDataArray = [];
      const singleColumnFieldType = [FIELD_LIST_TYPE.TABLE];
      const fieldListStyle = ((singleColumnFieldType.indexOf(fieldList.field_list_type) !== -1) || isMobile ? null : cx(BS.D_FLEX));
     if (fieldListIndex === fieldListLength - 1) {
       emptyFieldList = (
        <FormFieldDragDropWrapper
            id={fieldListIndex + 1}
            key={fieldListIndex + 1}
            data={{ path: fieldListIndex + 1, type: FORM_BUILDER_DND_ITEMS.FIELD_LIST }}
            dragClassname={cx(BS.D_FLEX, styles.fieldlist)}
            type={FORM_BUILDER_DND_ITEMS.FIELD_LIST}
            disableDrag
            disableDrop={!commonDNDConditions}
            onDrop={onDrop}
        >
                    <div className={cx(styles.field, styles.Height90, gClasses.MX0, formfieldWidth)}>
                      {getAddAndImportFields(null, null, showOnlyNewFormFieldsDropdown, [], addFormFieldClass, styles.TwoColumnAddFormFieldButton)}
                    </div>
                    <div className={!isMobile ? styles.FieldEmpty : BS.INVISIBLE} />
        </FormFieldDragDropWrapper>
     );
    }

      const { formVisibility } = props;
      switch (fieldList.field_list_type) {
        case FIELD_LIST_TYPE.TABLE:
          if (fieldList.fields && fieldList.fields.length > 0) {
            rowDataArray = [getCreationFields(fieldList, fieldListIndex)];
          }
          if (jsUtils.isEmpty(tablePrevScroll.current)) tablePrevScroll.current = {};
          else if (!jsUtils.has(tablePrevScroll.current, [`${fieldListIndex}`])) jsUtils.set(tablePrevScroll.current, [`${fieldListIndex}`], 0);
          eachFieldList = (
            <CreateTable
              tableRef={tablePrevScroll}
              sectionIndex={details.section_order - 1}
              formVisibility={formVisibility}
              fieldListIndex={fieldListIndex}
              fieldList={fieldList}
              getInputId={(fieldType) => getNewInputId(
                ADD_FORM_FIELD_SOURCE.TABLE,
                fieldType,
                details.section_order - 1,
                fieldListIndex,
                fieldList.fields.length,
              )}
              errorList={error_list}
              rowData={rowDataArray}
              onEditFieldClick={onFormFieldChangeHandler}
              fieldsData={fieldList.fields}
              onSaveFormField={onSaveFormField}
              // onAddExistingFieldToSection={(fieldId) => onAddExistingFieldToSection(
              //   fieldId,
              //   details.section_order,
              // )}
              showOnlyNewFormFieldsDropdown={true || showOnlyNewFormFieldsDropdown} // disabled import existing table fields
              onFormFieldChangeHandler={onFormFieldChangeHandler}
              onTableNameChangeHandler={(event) => onFormFieldChangeHandler(FIELD_LIST_KEYS.TABLE_NAME, event, details.section_order - 1, fieldListIndex)}
              onTableNameBlurHandler={(event) => onTableNameBlurHandler(event, details.section_order - 1, fieldListIndex)}
              onTableReferenceNameChangeHandler={(event) => onFormFieldChangeHandler(FIELD_LIST_KEYS.TABLE_REF_NAME, event, details.section_order - 1, fieldListIndex)}
              onFieldDragEndHandler={onFieldDragEndHandler}
            />
          );
          break;
        case FIELD_LIST_TYPE.DIRECT:
          const fields = getCreationFields(fieldList, fieldListIndex);
          const fieldsLen = fields.length;
          const draggableFields = (fieldsLen === 1 && !isMobile) ?
               [...fields,
                getAddAndImportFields(fieldListIndex, fields.length, true, [FIELD_TYPES.TABLE, FF_DROPDOWN_LIST_SECTION_TITLE_TYPE.TABLE], addFormFieldClass, styles.TwoColumnAddFormFieldButton),
               ] : [...fields];
              eachFieldList = draggableFields && draggableFields.map((field, idk) => {
                          const errorList = { ...error_list, ...server_error };
                          let isServerError = false;
                          Object.values(errorList).forEach((id) => {
                            try {
                              const idArray = id?.field ? id.field.split('.') : [];
                              if (!jsUtils.isEmpty(idArray) && (idArray.includes('validations') || idArray.includes('data_list') || idArray.includes('property_picker_details') || (
                                (idArray[0] === 'sections') &&
                                (idArray[2] === 'field_list') &&
                                (idArray[4] === 'fields') &&
                                (idArray[6] === 'field')
                              )) &&
                                  (Number(jsUtils.get(idArray, [2], '')) === (jsUtils.get(details, ['section_order'], 0) - 1) ||
                                  Number(jsUtils.get(idArray, [1], '')) === (jsUtils.get(details, ['section_order'], 0) - 1)) &&
                                  (Number(jsUtils.get(idArray, [4], '')) === fieldListIndex ||
                                  Number(jsUtils.get(idArray, [3], '')) === fieldListIndex) &&
                                  (Number(jsUtils.get(idArray, [6], '')) === idk ||
                                  Number(jsUtils.get(idArray, [5], '')) === idk)) {
                                    isServerError = true;
                              }
                            } catch (error) {
                              console.log(error);
                            }
                          });
                          return (
                          <FormFieldDragDropWrapper
                            id={`${fieldListIndex},${idk}`}
                            key={`${fieldListIndex},${idk}`}
                            data={{ path: `${fieldListIndex},${idk}`, type: FORM_BUILDER_DND_ITEMS.FIELD }}
                            type={FORM_BUILDER_DND_ITEMS.FIELD}
                            dropClassname={cx(
                                              isServerError ? styles.ErrorField : cx(styles.field, formfieldWidth),
                                              (idk === 0 || isMobile) ? gClasses.ML0 : null,
                                              (idk === draggableFields.length - 1 || isMobile) ? gClasses.MR0 : null,
                                              ((isMobile && idk > 0) ? gClasses.MT15 : null),
                                              )
                                            }
                            dragClassname={cx(styles['field-bg'], BS.H100)} // (fieldsLen === 1 && idk === 1) ?
                            disableDrag={!(fieldsLen === 1 ? idk !== 1 : true) || !commonDNDConditions || isServerError}
                            disableDrop={!(fieldsLen <= 1) || !commonDNDConditions || isServerError}
                            onDrop={onDrop}
                          >
                            {field}
                          </FormFieldDragDropWrapper>
                        );
                          });
          break;
        default:
          break;
      }
      return (
            <FormFieldDragDropWrapper
                id={fieldListIndex}
                key={fieldListIndex}
                data={{ path: fieldListIndex, type: FORM_BUILDER_DND_ITEMS.FIELD_LIST }}
                dragClassname={cx(styles.fieldlist, fieldListStyle)}
                type={FORM_BUILDER_DND_ITEMS.FIELD_LIST}
                disableDrag={!(fieldList.field_list_type === FIELD_LIST_TYPE.TABLE) || !commonDNDConditions}
                disableDrop={!commonDNDConditions}
                onDrop={onDrop}
            >
                 {eachFieldList}
            </FormFieldDragDropWrapper>
          );
    });
  };

  const getEditableFields = (fieldList, fieldListIndex, isReadOnlyForm, tableRowOrder, isTable = false, rowId, temp_row_uuid) => {
    const { stateData, formVisibility, error_list } = props;
    let formVisible = formVisibility;
    if (!isEmpty(get(stateData, ['active_task_details', 'form_metadata', 'fields', 'form_visibility'], []))) {
      formVisible = stateData.active_task_details.form_metadata.fields.form_visibility;
    }
    const rows = [];
    if (
      fieldList.fields &&
      fieldList.fields.length > 0
    ) {
      let fieldCount = 0;
      if (!isTable) {
        fieldList.fields.forEach((field) => {
          const fieldVisibility = formVisibilityCheck(
            formVisible,
            fieldList,
            field,
          );
          if (fieldVisibility || !field.is_visible || isReadOnlyForm) fieldCount++;
        });
      if (fieldCount === 0) return [];
      }
      fieldList.fields.forEach((_field_data, fieldIndex) => {
        const field_data = jsUtils.cloneDeep(_field_data);
        if (
           (
            formType === FORM_TYPES.EDITABLE_FORM &&
            !isCompletedForm &&
            (isTable
              ? true
              : !checkIsFieldNull(
                  stateData,
                  field_data.field_uuid,
                  field_data.hide_field_if_null,
                  field_data.field_type,
                )) &&
            (!field_data.is_field_show_when_rule ||
              jsUtils.isUndefined(get(formVisible, ['visible_fields', field_data.field_uuid])) ||
              !(
                !get(formVisible, ['visible_fields', field_data.field_uuid]) &&
                field_data.is_visible
              ))
            ) ||
            (
              isCompletedForm &&
              (!field_data.is_field_show_when_rule ||
                jsUtils.isUndefined(
                  get(formVisible, ['visible_fields', field_data.field_uuid]),
                ) ||
                !(
                  !get(formVisible, ['visible_fields', field_data.field_uuid]) &&
                  field_data.is_visible
                ))
            )
        ) {
            const fieldVisibility = formVisibilityCheck(
              formVisible,
              fieldList,
              field_data,
            );

            const fieldDisability = formDisabilityCheck(
              formVisible,
              fieldList,
              field_data,
              tableRowOrder,
            );

            const eachFieldVisibility = isTable ? !fieldDisability : fieldVisibility;

            if ((!!fieldList.is_visible) === false) {
              field_data.is_visible = false;
            }
            const wrapperClassName = fieldList.field_list_type === 'direct' ?
            (fieldCount === 1 && FULL_WIDTH_FIELDS.includes(field_data.field_type)) ? 'col-sm-12' : 'col-sm-6'
            : null;
            if (
                isCompletedForm ||
                isReadOnlyForm ||
                !field_data.is_visible ||
                fieldVisibility
                ) {
                  rows.push(
                    <FormField
                      wrapperEditableClassName={wrapperClassName}
                      sectionIndex={sectionIndex}
                      fieldListIndex={fieldListIndex}
                      fieldIndex={fieldIndex}
                      sectionId={details.section_order}
                      field_data={field_data}
                      fieldList={fieldList}
                      index={index}
                      onChangeHandler={onChangeHandler}
                      stateData={stateData}
                      activeFormContent={activeFormContent}
                      onDeleteFileClick={onDeleteFileClick}
                      onRetryFileUploadClick={onRetryFileUploadClick}
                      key={`row-${tableRowOrder}-col-${fieldIndex}`}
                      tableRow={tableRowOrder}
                      tableUuid={fieldList.table_uuid}
                      isTable={fieldList.field_list_type === FIELD_LIST_TYPE.TABLE}
                      isReadOnlyForm={isReadOnlyForm}
                      formVisibility={formVisible}
                      eachFieldVisibility={eachFieldVisibility}
                      formVisible={stateData.active_task_details && stateData.active_task_details.form_metadata &&
                        stateData.active_task_details.form_metadata.fields && stateData.active_task_details.form_metadata.fields.form_visibility
                        && stateData.active_task_details.form_metadata.fields.form_visibility.visible_fields}
                      error_list={error_list}
                      datalist_selector_error_list={datalist_selector_error_list}
                      rowId={rowId}
                      temp_row_uuid={temp_row_uuid}
                      allow_modify_existing={jsUtils.get(fieldList, ['table_validations', 'allow_modify_existing'], true)}
                      isFirstTableField={fieldList.field_list_type === FIELD_LIST_TYPE.TABLE && fieldIndex === 0}
                    />,
                  );
              }
        }
      });
    }
      if (isTable) return rows;
      return <div className="row">{rows}</div>;
  };

  const generateEditableFieldList = () => {
    const { stateData, isReadOnlyForm, formVisibility } = props;

    return details.field_list.map((fieldList, fieldListIndex) => {
      // const isAddRowButtonVisible =
      //   !isCompletedForm && typeof onTableAddOrDeleteRowClick !== 'undefined';
      let tableRows = [];
      switch (fieldList.field_list_type) {
        case FIELD_LIST_TYPE.TABLE:
          const tableFields = !jsUtils.isEmpty(stateData) ? stateData[fieldList.table_uuid] : [];
          let formVisible = formVisibility;
          if (
            get(stateData, ['active_task_details', 'form_metadata', 'fields', 'form_visibility'], null)
            ) formVisible = stateData.active_task_details.form_metadata.fields.form_visibility;
          if (nullCheck(fieldList, 'fields.length', true)) {
            if (isReadOnlyForm) {
              // to do
              // const rows = fieldList.fields
              //   .map((eachField) => eachField.row_order)// editable and !completed and
              //   .filter((value, index_, self) => self.indexOf(value) === index_);
              // tableRows = rows.map((data) => [
              //   getEditableFields(fieldList, fieldListIndex, isReadOnlyForm, data),
              // ]);
            } else if (stateData[fieldList.table_uuid]) {
              let isReadOnlyTable = isReadOnlyForm;
              if (!isReadOnlyTable) {
                if (formVisible && !isEmpty(formVisible.visible_tables)) {
                  isReadOnlyTable = !get(formVisible, ['visible_tables', fieldList.table_uuid]);
                }
              }
              tableRows = (
              isEmpty(jsUtils.get(stateData, ['active_task_details', 'active_form_content', fieldList.table_uuid], [])) &&
                !jsUtils.get(fieldList, ['table_validations', 'add_new_row'], true) ?
                [] :
                stateData[fieldList.table_uuid].map((each_row, index_) => {
                  return {
                    currentRowData: getEditableFields(
                        fieldList,
                        fieldListIndex,
                        isReadOnlyForm,
                        index_,
                        true,
                        each_row?._id,
                        each_row?.temp_row_uuid,
                      ),
                      ...(jsUtils.has(each_row, '_id') ? { rowId: each_row._id } : {}),
                      ...(jsUtils.has(each_row, 'temp_row_uuid') ? { tempRowUuid: each_row.temp_row_uuid } : {}),
                  };
                })
              );
            } else tableRows = [];
            if (stateData && stateData.active_task_details
              && stateData.active_task_details.form_visibility
          ) formVisible = stateData.active_task_details.form_visibility;
            return formType === FORM_TYPES.EDITABLE_FORM &&
            !checkIsAllTableFieldsNull(tableFields, fieldList.fields) &&
            (jsUtils.isUndefined(get(formVisible, ['visible_tables', fieldList.table_uuid])) ||
            !(!get(formVisible, ['visible_tables', fieldList.table_uuid]) && fieldList.is_visible)) ?
              (
                <CreateTable
                  isDisplayTaskList={isDisplayTaskList}
                  sectionIndex={details.section_order - 1}
                  fieldListIndex={fieldListIndex}
                  fieldList={fieldList}
                  getInputId={(fieldType) => getNewInputId(
                    ADD_FORM_FIELD_SOURCE.TABLE,
                    fieldType,
                    details.section_order - 1,
                    fieldListIndex,
                    fieldList.fields.length,
                  )}
                  rowData={tableRows}
                  onEditFieldClick={onFormFieldChangeHandler}
                  onTableAddOrDeleteRowClick={onTableAddOrDeleteRowClick}
                  errorList={stateData.error_list}
                  // onAddExistingFieldToSection={(fieldId) => props.onAddExistingFieldToSection(
                  //   fieldId,
                  //   details.section_order,
                  // )}
                  isTableDisabled={
                    get(formVisible, ['visible_tables', fieldList.table_uuid]) ===
                    false
                  }
                  formVisibility={formVisible}
                  showOnlyNewFormFieldsDropdown={showOnlyNewFormFieldsDropdown}
                  onTableNameChangeHandler={(event) => onFormFieldChangeHandler(FIELD_LIST_KEYS.TABLE_NAME, event, details.section_order - 1, fieldListIndex)}
                />
              ) : [];
          }
          break;
        case FIELD_LIST_TYPE.DIRECT:
        return getEditableFields(fieldList, fieldListIndex, isReadOnlyForm);
        default:
          break;
      }
      return null;
    });
  };

  const generateImportableFields = (eachFieldList, fieldListIndex) => {
    let fields = [];

    if (nullCheck(eachFieldList, 'fields.length', true)) {
      fields = eachFieldList.fields.map((eachField, eachFieldIndex) => (
        <FormField
          sectionIndex={sectionIndex}
          fieldListIndex={fieldListIndex}
          fieldIndex={eachFieldIndex}
          sectionId={details.section_order}
          field_data={eachField}
          fieldList={eachFieldList}
          index={index}
          onSelect={onSelectFieldHandler}
          onReadOnlySelect={onReadOnlySelectHandler}
          onEditableSelect={onEditableSelectHandler}
          isImportableForm
          key={index}
          isTable={eachFieldList.field_list_type === FIELD_LIST_TYPE.TABLE}
          tableUuid={eachFieldList.table_uuid}
          isFirstTableField={eachFieldList.field_list_type === FIELD_LIST_TYPE.TABLE && eachFieldIndex === 0}
        />
      ));
    }

    return fields;
  };

  const generateImportableTableFieldList = (eachFieldList, eachFieldListIndex) => {
    let tableFieldList = null;
    if (nullCheck(eachFieldList, 'fields.length', true)) {
      tableFieldList = (
        <ImportTable
          sectionIndex={sectionIndex}
          fieldList={eachFieldList}
          fieldListIndex={eachFieldListIndex}
          onSelectFieldListHandler={onSelectFieldListHandler}
          onFieldSelectHandler={onFieldSelectHandler}
          onFieldAccessibilityHandler={onFieldAccessibilityHandler}
          error_list={error_list}
        />
      );
    }
    return tableFieldList;
  };

  const generateImportableFieldList = () => {
    let allFieldList = [];

    if (nullCheck(details, 'field_list.length')) {
      allFieldList = details.field_list.map((eachFieldList, eachFieldListIndex) => {
        switch (eachFieldList.field_list_type) {
          case FIELD_LIST_TYPE.TABLE:
            return generateImportableTableFieldList(eachFieldList, eachFieldListIndex);
          case FIELD_LIST_TYPE.DIRECT: {
            const fields = generateImportableFields(eachFieldList, eachFieldListIndex);
            if (fields.length > 1) return <Row>{fields.map((eachField) => (<Col sm={6}>{eachField}</Col>))}</Row>;
            else {
              return <Row><Col sm={12}>{fields}</Col></Row>;
            }
          }
          default:
            return null;
        }
      });
    }
    return allFieldList;
  };

  const onChangeSectionMenuHandler = (event) => {
    if (!nullCheck(event, 'target.value')) return;
    const menuIndex = event.target.value;
    switch (menuIndex) {
      case 0:
        onSectionDragEndHandler(index, menuIndex);
        break;
      case 1:
        onSectionDragEndHandler(index, menuIndex);
        break;
      case 2:
        onDeleteSectionHandler(details.section_order);
        break;
      default:
        break;
    }
  };

  const getSectionMenuOption = () => {
    if (disableDragAndDrop || !(details.section_uuid)) {
        return [SECTION_MENU(t)[2]];
    } else {
        return [...getSectionRearrangeMenuOptions(index, allSectionsLength, t), SECTION_MENU(t)[2]];
    }
  };

  let fieldList = null;
  let creationView = null;
  let editableView = null;
  let importableView = null;

  const getAddAndImportFields = (fieldListIndex = null, fieldsLength = null, showOnlyNewFormFields = showOnlyNewFormFieldsDropdown, blackListedFields = [], className, buttonClassName) => (
      <div className={BS.H100}>
        <AddFormFields
          // onSuggestionListLoadMore={onSuggestionListLoadMore}
          suggestionDetails={suggestionDetails}
          // onAddFieldClick={onAddFieldClick}
          getInputId={(fieldType) => getNewInputId(ADD_FORM_FIELD_SOURCE.SECTION, fieldType, details.section_order - 1, fieldListIndex, fieldsLength)}
          // onSuggestionTextChange={onSuggestionTextChange}
          showSuggestion={showSuggestion}
          onAddExistingFieldToSection={(fieldId) => onAddExistingFieldToSection(fieldId, details.section_order)}
          onSectionAddButtonClick={onSectionAddButtonClick}
          sectionIndex={details.section_order - 1}
          showOnlyNewFormFieldsDropdown={showOnlyNewFormFields}
          showAddForm={!disallowSessionAddAndActionButton}
          fieldList={details.field_list}
          fieldListIndex={fieldListIndex}
          fieldsLength={fieldsLength}
          blackListedFields={blackListedFields}
          className={className}
          buttonClassName={buttonClassName}
          sectionDetails={details}
          isTaskForm={isTaskForm}
        />
        <div className={gClasses.MT10}>
          {!showOnlyNewFormFields &&
            <div
              className={cx(styles.ImportField, gClasses.CursorPointer, BS.D_FLEX)}
              onClick={() => onSourceSelect(details.section_order - 1)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onSourceSelect(details.section_order - 1)}
            >
              <ImportFormIcon className={cx(gClasses.MR7)} />
              {t(FORM_STRINGS.IMPORT_FORM_FIELDS)}
            </div>}
          {/* {!showOnlyNewFormFields && getImportTaskPopUp()} */}
        </div>
      </div>
    );
  switch (formType) {
    case FORM_TYPES.CREATION_FORM:

      // *** Commenting the field auto suggestion
      // const fieldListIndex = null;
      // const fieldsLength = null;
      // fieldAutoSuggestionView = <ContextFieldSuggestions getInputId={(fieldType) => getNewInputId(ADD_FORM_FIELD_SOURCE.SECTION, fieldType, details.section_order - 1, fieldListIndex, fieldsLength)} sectionIndex={details.section_order - 1} />;
      fieldList = generateCreationFieldList(getAddAndImportFields);
      let errorMessage = null;
      if (
        error_list['sections,0,field_list, 0,fields']
        || (error_list[0]
          && error_list[0].field
          && error_list[0].field === 'form.sections.0.field_list.0.fields')
      ) {
        errorMessage = 'Atleast one field is required';
      }

      creationView = isChildrenVisible ? (
        <>
          <div className={cx(gClasses.CenterV, BS.JC_BETWEEN, (!showOnlyNewFormFieldsDropdown && gClasses.MT20), styles.SectionName, SectionMargin)}>
            <Input
              id={`section_name_${sectionIndex}`}
              // inputStyle={{ color: primaryColor }}
              inputTextClasses={cx(gClasses.FontWeight500, gClasses.FTwo14GrayV3)}
              className={cx(BS.BORDER_0, styles.Input, {
                [gClasses.ErrorPlaceHolder]: sectionTitleError,
              })}
              placeholder={details.is_table ? 'Enter table title here' : STEP_CARD_STRINGS(t).SECTION_PLACEHOLDER}
              onBlurHandler={() => onSectionTitleBlurHandler(index)}
              onChangeHandler={(event) => onAddedSectionTitleChangeHandler(event, details.section_order)}
              value={details?.translation_data?.[pref_locale]?.section_name || t(details.section_name)}
              hideBorder
              hideMessage
              hideLabel
              errorMessage={sectionTitleError}
            />
            <div className={BS.D_FLEX}>
              {disallowSessionAddAndActionButton ? null : (
               <div ref={referenceSectionPopperElement}>
                <Dropdown
                  className={cx(gClasses.ML10, styles.DropdownWidth)}
                  comboboxClass={gClasses.MinWidth0}
                  optionList={getSectionMenuOption()}
                  onChange={onChangeSectionMenuHandler}
                  isNewDropdown
                  isBorderLess
                  noInputPadding
                  placement={POPPER_PLACEMENTS.BOTTOM_END}
                  fallbackPlacements={[POPPER_PLACEMENTS.TOP_END]}
                  popperClasses={cx(gClasses.ZIndex2, gClasses.ML10)}
                  popperStyles={{ marginTop: '-5px' }}
                  customDisplay={<MoreIcon role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.MORE} />}
                  outerClassName={gClasses.MinWidth0}
                />
                {
                    (showSectionDependencyDialog && (showSectionDependencyDialog.sectionIndex === index)) && (
                      <DependencyHandler
                        onDeleteClick={onDeleteFormFromDependencyConfig}
                        onCancelDeleteClick={dependencyConfigCloseHandler}
                        dependencyHeaderTitle={dependency_type}
                        dependencyData={dependency_data}
                        getMoreDependency={getMoreDependency}
                      />
                    )
                  }
               </div>
              )}
              {!isEmpty(fieldList) && (
              <div className={cx(gClasses.MR15, gClasses.CenterV, gClasses.CursorPointer)}>
                <ChevronIcon
                  role={ARIA_ROLES.BUTTON}
                  tabIndex={0}
                  ariaLabel={isSectionExpanded ? 'collapse section' : 'expand section'}
                  className={cx(styles.ChevronIcon, !isSectionExpanded && gClasses.Rotate180)}
                  onClick={toggleSectionView}
                  onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && toggleSectionView()}
                />
              </div>)}
            </div>
          </div>
          {/* <div className={cx(styles.Hr, BS.W100)} /> */}
          {isSectionExpanded ?
          <DndProvider backend={backend} options={backendOptions}>{emptyFieldList ? [...fieldList, emptyFieldList] : fieldList}</DndProvider>
          : null }
           {!emptyFieldList && (
            <div className={cx(BS.D_FLEX, styles.fieldlist)}>
              <div className={cx(styles.field, styles.Height90, gClasses.MT8, gClasses.MX0, formfieldWidth)}>
                {getAddAndImportFields(null, null, showOnlyNewFormFieldsDropdown, [], addFormFieldClass, styles.TwoColumnAddFormFieldButton)}
              </div>
            <div className={!isMobile ? styles.FieldEmpty : BS.INVISIBLE} />
            </div>
          )}
          {!jsUtils.isNull(errorMessage) &&
            <HelperMessage
              type={HELPER_MESSAGE_TYPE.ERROR}
              message={errorMessage}
              className={gClasses.MT10}
            />
          }
          {
            showFormDependencyDialog && (
              <DependencyHandler
                onDeleteClick={onDeleteFormFromDependencyConfig}
                onCancelDeleteClick={dependencyConfigCloseHandler}
                dependencyHeaderTitle={dependency_type}
                dependencyData={dependency_data}
                getMoreDependency={getMoreDependency}
              />
            )
          }
        </>
      ) : null;
      break;
    case FORM_TYPES.EDITABLE_FORM:
      fieldList = generateEditableFieldList();
      editableView = !ifArrayisFullEmpty(fieldList) ? (
        <>
          <div
            // style={{ color: primaryColor }}
            className={cx(
              gClasses.SectionSubTitle,
              gClasses.MB10,
            )}
          >
            {details?.translation_data?.[pref_locale]?.section_name || t(details.section_name)}
          </div>
          <div className={cx(BS.W100)} />
          {fieldList}
        </>
      ) : null;
      break;
    case FORM_TYPES.IMPORTABLE_FORM:
      fieldList = generateImportableFieldList();
      const isEntireSectionDisabled = areAllSectionFieldListDisabled(details);
      importableView = (
        <>
          <button
            className={cx(
              gClasses.ClickableElement,
              gClasses.CursorPointer,
              BS.W100,
              gClasses.MB20,
              isEntireSectionDisabled ? gClasses.DisabledField : null,
            )}
            // onClick={() => isEntireSectionDisabled ? null : onSelectSectionHandler(sectionIndex)}
          >
            <div className={cx(gClasses.CenterV, gClasses.MB10)}>
              <div
                style={{ color: primaryColor }}
                className={cx(
                  gClasses.SectionSubTitle,
                  gClasses.WhiteSpaceNoWrap,
                )}
              >
                {details?.translation_data?.[pref_locale]?.section_name || t(details.section_name)}
              </div>
              <div className={cx(BS.W100, styles.HLine)} />
              <CheckboxGroup
                optionList={[{ label: '', value: 1 }]}
                className={styles.CheckBox}
                selectedValues={areAllSectionFieldListSelected(details, true) ? [1] : []}
                hideLabel
                hideMessage
                checkboxClasses={styles.CheckBoxClass}
                onClick={() => isEntireSectionDisabled ? null : onSelectSectionHandler(sectionIndex)}
              />
            </div>
          </button>
          {fieldList}
        </>
      );
      break;
    default:
      break;
  }

  return (
    <div className={cx(styles.Container, showOnlyNewFormFieldsDropdown ? gClasses.MB24 : gClasses.MB54)}>
      {creationView}
      {editableView}
      {importableView}
      {/* {fieldAutoSuggestionView} */}
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    isNavOpen: state.NavBarReducer.isNavOpen,
    // showFormDependencyDialog: state.EditFlowReducer.flowData.showFormDependencyDialog,
    // showStepDependencyDialog: state.EditFlowReducer.flowData.showStepDependencyDialog,
    // showFieldDependencyDialog: state.EditFlowReducer.flowData.showFieldDependencyDialog,
  };
};

const mapDispatchToProps = () => {
  return {
    // setDateInsideReduxFlowData: (flowData) => {
    //   dispatch(setDataInsideFlowData(flowData));
    // },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Section);

Section.defaultProps = {
  error_list: {},
  stateData: {},
  onEditableSelectHandler: null,
  onReadOnlySelectHandler: null,
  onSelectFieldHandler: null,
  onChangeHandler: null,
  // deleteFormField: null,
  onAddedSectionTitleChangeHandler: null,
  onAddValues: null,
  onSaveFormField: null,
  onDefaultChangeHandler: null,
  onRequiredClickHandler: null,
  onReadOnlyClickHandler: null,
  onOtherConfigBlurHandler: null,
  onOtherConfigChangeHandler: null,
  onValidationConfigChangeHandler: null,
  onValidationConfigBlurHandler: null,
  details: {},
  getNewInputId: null,
  onLabelChangeHandler: null,
  lookupListDropdown: null,
  lookupLoadDataHandler: null,
  onLookupFieldChangeHandler: null,
  onLabelBlurHandler: null,
  onDeleteSectionHandler: null,
  isImportableForm: false,
  onReferenceNameChangeHandler: null,
  onReferenceNameBlurHandler: null,
  suggestionDetails: {},
  activeFormContent: null,
  onSelect: null,
  onDeleteFileClick: null,
  onRetryFileUploadClick: null,
  // stepOrder: null,
  onSectionAddButtonClick: null,
  onTableAddOrDeleteRowClick: null,
  onDeleteFormFromDependencyConfig: null,
  showOnlyNewFormFieldsDropdown: false,
  onFieldDragEndHandler: null,
  onSectionDragEndHandler: null,
  allSectionsLength: null,
  showFieldDependencyDialog: false,
  showFormDependencyDialog: false,
  showStepDependencyDialog: false,
  // disableDragAndDrop: false,
  showSuggestion: false,
  formVisibility: null,
  onAddExistingFieldToSection: null,
  isReadOnlyForm: false,
  setDateInsideReduxFlowData: null,
  disallowSessionAddAndActionButton: false,
  onSectionTitleBlurHandler: () => {},
};

Section.propTypes = {
  details: PropTypes.objectOf(PropTypes.any),
  getNewInputId: PropTypes.func,
  onLabelChangeHandler: PropTypes.func,
  lookupListDropdown: PropTypes.func,
  lookupLoadDataHandler: PropTypes.func,
  onLookupFieldChangeHandler: PropTypes.func,
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
  // deleteFormField: PropTypes.func,
  onChangeHandler: PropTypes.func,
  stateData: PropTypes.objectOf(PropTypes.any),
  onSelectFieldHandler: PropTypes.func,
  onReadOnlySelectHandler: PropTypes.func,
  onEditableSelectHandler: PropTypes.func,
  onDeleteSectionHandler: PropTypes.func,
  index: PropTypes.number.isRequired,
  onReferenceNameChangeHandler: PropTypes.func,
  onReferenceNameBlurHandler: PropTypes.func,
  onSelect: PropTypes.func,
  isImportableForm: PropTypes.bool,
  suggestionDetails: PropTypes.objectOf,
  activeFormContent: PropTypes.objectOf,
  onDeleteFileClick: PropTypes.func,
  onRetryFileUploadClick: PropTypes.func,
  // stepOrder: PropTypes.number,
  onSectionAddButtonClick: PropTypes.func,
  onTableAddOrDeleteRowClick: PropTypes.func,
  onDeleteFormFromDependencyConfig: PropTypes.func,
  showOnlyNewFormFieldsDropdown: PropTypes.bool,
  onFieldDragEndHandler: PropTypes.func,
  onSectionDragEndHandler: PropTypes.func,
  allSectionsLength: PropTypes.number,
  showFieldDependencyDialog: PropTypes.bool,
  showFormDependencyDialog: PropTypes.bool,
  showStepDependencyDialog: PropTypes.bool,
  // disableDragAndDrop: PropTypes.bool,
  showSuggestion: PropTypes.bool,
  formVisibility: PropTypes.func,
  onAddExistingFieldToSection: PropTypes.func,
  isReadOnlyForm: PropTypes.bool,
  setDateInsideReduxFlowData: PropTypes.func,
  disallowSessionAddAndActionButton: PropTypes.bool,
  onSectionTitleBlurHandler: PropTypes.func,
};
