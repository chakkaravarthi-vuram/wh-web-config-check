import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { isArray, isNull, isObject } from 'lodash';
import { FIELD_TYPE } from 'utils/constants/form_fields.constant';
import { updateFlowStateChange } from 'redux/reducer/EditFlowReducer';
import { keydownOrKeypessEnterHandle } from 'utils/UtilityFunctions';
import { checkAllFieldsAreReadOnly } from 'utils/taskContentUtils';
import ModalLayout from 'components/form_components/modal_layout/ModalLayout';
import CheckboxGroup from 'components/form_components/checkbox_group/CheckboxGroup';
import Button, { BUTTON_TYPE } from 'components/form_components/button/Button';
import { HEADER_AND_BODY_LAYOUT } from 'components/form_components/modal/Modal.strings';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import EditIconV2 from 'assets/icons/form_fields/EditIconV2';
import ThemeContext from '../../../../hoc/ThemeContext';

import BasicTable from '../../../table/Table';
import AddIcon from '../../../../assets/icons/AddIcon';
import HelpIcon from '../../../../assets/icons/HelpIcon';

import {
  EXISTING_FORM_FIELD_ID, EXISTING_TABLE_FIELD_ID, FF_DROPDOWN_LIST_SECTION_TITLE_TYPE, FIELD_LIST_CONFIGS_TABS, FIELD_TYPES, FORM_STRINGS, FIELD_LIST_CONFIG, TABLE_CONTROL_ACCESS,
} from '../../FormBuilder.strings';
import { ARIA_ROLES, BS } from '../../../../utils/UIConstants';
import gClasses from '../../../../scss/Typography.module.scss';
import FormFieldsDropdown from '../add_form_fields/form_fields_dropdown/FormFieldsDropdown';
import { ASTERISK, EMPTY_STRING } from '../../../../utils/strings/CommonStrings';
import AutoPositioningPopper, { POPPER_PLACEMENTS } from '../../../auto_positioning_popper/AutoPositioningPopper';
import {
  getAllFieldsThunk,
  // getAllTableFieldsThunk,
} from '../../../../redux/actions/EditFlow.Action';
import styles from './CreateTable.module.scss';
import HelperMessage, { HELPER_MESSAGE_TYPE } from '../../../form_components/helper_message/HelperMessage';
import FormBuilderContext from '../../FormBuilderContext';
import Label from '../../../form_components/label/Label';
import FieldListConfig from '../../field_list_config/FieldListConfig';
import { getAddRowButton, getDeleteRowButton } from './CreateTable.utils';
import {
  FIELD_LIST_TYPE, FORM_FIELD_CONFIG_ACTIONS, FORM_FIELD_CONFIG_TYPES, FORM_TYPES, FIELD_LIST_KEYS, FIELD_OR_FIELD_LIST, VISIBILITY_CONFIG_CHANGE, FIELD_KEYS,
} from '../../../../utils/constants/form.constant';
import { areAllFieldsReadOnly } from '../../../../utils/formUtils';
import { nullCheck, get, isUndefined, isEmpty, cloneDeep } from '../../../../utils/jsUtility';
import { FIELD_VIEW_TYPE } from '../form_fields/FormField.strings';

function CreateTable(props) {
  const {
    isCompletedForm, isReadOnlyForm, formType, onFormFieldOpenAndCloseHandler, error_list, server_error, deleteFormFieldHandler, getRuleDetailsByIdInFieldVisibilityApi,
    dataListAuditfields,
    auditedTabelRows,
    isAuditView,
  } = useContext(FormBuilderContext);
  const { t } = useTranslation();
  const { buttonColor } = useContext(ThemeContext);
  const {
    fieldList,
    fieldList: {
      table_name,
      translation_data,
      is_field_list_show_when_rule, isFieldListConfigPopupOpen, fields, table_uuid, table_validations, table_validations: { is_pagination, page_size },
    },
    fieldListIndex,
    getInputId,
    rowData,
    onEditFieldClick,
    sectionIndex,
    onTableAddOrDeleteRowClick,
    allFieldsDetails,
    allTableFieldDetails,
    addFormFieldsDropdownId,
    showOnlyNewFormFieldsDropdown,
    errorList,
    onTableNameChangeHandler,
    onTableNameBlurHandler,
    onTableReferenceNameChangeHandler,
    onSaveFormField,
    onFormFieldChangeHandler,
    formVisibility,
    tableRef,
    onFieldDragEndHandler,
    updateFlowState,
    addFormFieldsDropdownVisibilityData,
    isTableDisabled,
  } = props;
  console.log('tabelchecking', rowData, fieldList, dataListAuditfields, auditedTabelRows, isAuditView);
  let tableError = null;
  let tableErrorIndex = null;
  let createTableError = null;
  let isTableImported = false;
  let nonUniqueErrorIndices = [];
  const uniqueColumnIndex = [];
  const isEditableForm = formType === FORM_TYPES.EDITABLE_FORM;
  const isCreationForm = formType === FORM_TYPES.CREATION_FORM;
  const isFieldConfigurable = isCreationForm && typeof onEditFieldClick !== 'undefined';
  const areAllColumnsReadOnly = areAllFieldsReadOnly(fields);
  const ARIA_LABEL = {
    ADD: 'Add',
    DELETE: 'Delete',
    EDIT: 'Edit',
  };
  const { TABLE } = FORM_STRINGS;

  const pref_locale = localStorage.getItem('application_language');

  const tableName = isEditableForm ?
  (translation_data?.[pref_locale]?.table_name || table_name) : table_name;
  if (errorList && isObject(errorList) && !isArray(errorList)) {
    Object.keys(errorList).some((errorKey) => {
      console.log('errorTableUuid', Object.keys(errorList).includes(`${fieldList.table_uuid}non_unique_indices`), errorList, errorKey, errorList[`${fieldList.table_uuid}non_unique_indices`], errorKey === `${fieldList.table_uuid}non_unique_indices`);
      if (Object.keys(errorList).includes(`${fieldList.table_uuid}non_unique_indices`)) {
        nonUniqueErrorIndices = errorList[`${fieldList.table_uuid}non_unique_indices`];
      }
      if (!isObject(errorList[errorKey])) {
      if (errorKey === `sections,${sectionIndex},field_list,${fieldListIndex},fields`) {
        if (errorList[errorKey].includes(t(TABLE.MIN_FIELDS)) || errorList[errorKey].includes(t(TABLE.MIN_FIELDS_TRANSLATED))) createTableError = t(TABLE.MIN_FIELDS_ERROR);
      }
      if (errorList[errorKey] === '"table" must have at least 1 key') {
        const currentTableUuid = fieldList.table_uuid;
        const errorTableUuid = errorKey.split(',')[0];
        if (currentTableUuid && currentTableUuid === errorTableUuid) {
          tableError = 'Table rows can not be empty';
          tableErrorIndex = Number(errorKey.split(',')[1]);
          return true;
        }
      }
      if (errorList[errorKey] &&
           ((errorKey === fieldList.table_uuid && errorList[errorKey].includes('Atleast')) ||
           (errorKey === fieldList.table_uuid && errorList[errorKey].includes('Not more than')) ||
           (errorKey === fieldList.table_uuid && errorList[errorKey].includes('Only')) ||
           (errorKey === fieldList.table_uuid && errorList[errorKey].includes('Duplicate')) ||
           errorList[errorKey].includes('non empty'))
         ) {
        const currentTableUuid = fieldList.table_uuid;
        const errorTableUuid = errorKey.split(',')[0];
        if (currentTableUuid && currentTableUuid === errorTableUuid) {
          tableError = errorList[errorKey];
          tableErrorIndex = Number(errorKey.split(',')[1]);
          return true;
        }
      }
    }
    return false;
    });
  }
  const [isDropdownVisible, setDropdownVisibility] = useState(false);

  const fieldsDataLength = fields ? fields.length : 0;

  const [referencePopperElement, setReferencePopperElement] = useState(null);
  const [tableConfigPopupRef, setTableConfigPopupRef] = useState(null);
  const [positionObject, setDropdownPosition] = useState({ top: 0, left: 0 });

  const toggleDropdown = (bool) => {
    if (isNull(bool)) {
      setDropdownVisibility(!isDropdownVisible);
    } else {
      setDropdownVisibility(bool);
    }
  };

  const onSuggestionListLoadMore = (id) => {
    const {
      getAllFields, getAllTableFields, flowData,
    } = props;

    switch (id) {
      case EXISTING_FORM_FIELD_ID: {
        allFieldsDetails.page += 1;
        updateFlowState({ all_fields_details: allFieldsDetails });
        const params = {
          flow_id: flowData.flow_id,
          page: allFieldsDetails.page,
          is_table: 0,
        };
        if (allFieldsDetails.search) params.search = allFieldsDetails.search;
        getAllFields(params);
        break;
      }
      case EXISTING_TABLE_FIELD_ID: {
        allTableFieldDetails.page += 1;
        updateFlowState({ all_table_fields_details: allTableFieldDetails });
        const params = {
          flow_id: flowData.flow_id,
          page: allTableFieldDetails.page,
        };
        if (allTableFieldDetails.search) params.search = allTableFieldDetails.search;
        getAllTableFields(params);
        break;
      }
      default:
        break;
    }
  };

  const setDropDownList = (id, searchValue) => {
    console.log('Action triggered 1');
    console.log('action triggered 2');
    const {
      getAllFields, getAllTableFields, flowData,
    } = props;
    const search = searchValue || null;
    updateFlowState({
      addFormFieldsDropdownVisibilityData: {
        ...addFormFieldsDropdownVisibilityData,
        id,
      },
    });
    switch (id) {
      case EXISTING_FORM_FIELD_ID: {
        allFieldsDetails.search = search;
        updateFlowState({ all_fields_details: allFieldsDetails });
        const params = {
          flow_id: flowData.flow_id,
          page: 1,
          is_table: 0,
        };
        if (allFieldsDetails.search) params.search = allFieldsDetails.search;
        getAllFields(params);
        break;
      }
      case EXISTING_TABLE_FIELD_ID:
        allTableFieldDetails.search = search;
        if (allTableFieldDetails.is_fields) {
          updateFlowState({ all_table_fields_details: allTableFieldDetails });
          const params = {
            flow_id: flowData.flow_id,
            page: 1,
            is_table: 1,
            table_uuid: allTableFieldDetails.table_uuid,
          };
          if (allTableFieldDetails.search) params.search = allTableFieldDetails.search;
          getAllFields(params, true);
        } else {
          updateFlowState({ all_table_fields_details: allTableFieldDetails });
          const params = {
            flow_id: flowData.flow_id,
            page: 1,
          };
          if (allTableFieldDetails.search) params.search = allTableFieldDetails.search;
          getAllTableFields(params);
        }
        break;
      default:
        break;
    }
  };

  // const onFormFieldSelect = (fieldType) => {
  //   setDropdownVisibility(false);
  //   getInputId(fieldList.field_list_type, fieldType, sectionIndex - 1, fieldListIndex, fieldList.fields.length);
  // };

  // const onFieldEditClick = (fieldIndex) => {
  //   if (isFieldConfigurable) {
  //     onEditFieldClick(FORM_FIELD_CONFIG_ACTIONS.EDIT, null, sectionIndex, fieldListIndex, fieldIndex);
  //   }
  // };

  // const onAddRowClick = () => {
  //   onTableAddOrDeleteRowClick(table_uuid);
  // };

  // const onDeleteRowClick = (rowOrder) => {
  //   onTableAddOrDeleteRowClick(table_uuid, rowOrder);
  // };
  const onHeaderClick = (e) => {
    setDropdownPosition({ top: e.pageY, left: e.pageX });
    setDropdownVisibility(!isDropdownVisible);
  };
  const hidePopups = () => {
    setDropdownVisibility(false);
    allTableFieldDetails.is_fields = false;
    allTableFieldDetails.table_uuid = null;
    updateFlowState({ all_table_fields_details: allTableFieldDetails });
  };

  const onSuggestionFieldClickHandler = (field_id, is_table) => {
    const {
      getAllFields, flowData,
    } = props;
    // onSuggestionFieldClick();
    if (is_table) {
      allTableFieldDetails.is_fields = true;
      allTableFieldDetails.table_uuid = field_id;
      updateFlowState({ all_table_fields_details: allTableFieldDetails });
      const params = {
        flow_id: flowData.flow_id,
        page: 1,
        is_table: 1,
        table_uuid: field_id,
      };
      getAllFields(params, true);
    } else {
      hidePopups();
      const { onAddExistingFieldToSection } = props;
      onAddExistingFieldToSection(field_id);
    }
  };
  const visibleFields = [];
  fields.forEach((field_data, fieldIndex) => {
    console.log('VISIBLE FIELDS inside', fields, formVisibility, !field_data.is_field_show_when_rule, (isUndefined(get(formVisibility, ['visible_fields', field_data.field_uuid])) || !(!get(formVisibility, ['visible_fields', field_data.field_uuid]) && field_data.is_visible)), field_data, formType, isCompletedForm, formVisibility, field_data.field_uuid, field_data.is_visible);
    if (formType === FORM_TYPES.EDITABLE_FORM && !isCompletedForm && (!field_data.is_field_show_when_rule || (isUndefined(get(formVisibility, ['visible_fields', field_data.field_uuid])) || !(!get(formVisibility, ['visible_fields', field_data.field_uuid]) && field_data.is_visible)))) {
      visibleFields.push(field_data);
      if (fieldList.table_validations.is_unique_column_available && fieldList.table_validations.unique_column_uuid &&
        !isEmpty(nonUniqueErrorIndices) &&
        field_data.field_uuid === fieldList.table_validations.unique_column_uuid) uniqueColumnIndex.push(fieldIndex);
      console.log('VISIBLE FIELDS inside insdie', field_data, visibleFields);
    }
    // else rowData.splice(fieldIndex, 1)
    if (formType === FORM_TYPES.CREATION_FORM ||
      (isCompletedForm && (!field_data.is_field_show_when_rule || (!(!get(formVisibility, ['visible_fields', field_data.field_uuid]) && field_data.is_visible))))) {
        visibleFields.push(field_data);
        if (fieldList.table_validations.is_unique_column_available && fieldList.table_validations.unique_column_uuid &&
          !isEmpty(nonUniqueErrorIndices) &&
          field_data.field_uuid === fieldList.table_validations.unique_column_uuid) uniqueColumnIndex.push(fieldIndex);
      }
    if (field_data.is_imported) {
      isTableImported = true;
    }
    console.log('VISIBLE FIELDSgdfhdfhfgjgf', rowData, visibleFields, formType, formVisibility, isCompletedForm, field_data);
  });
  const headerArray = visibleFields.map((field_data, fieldIndex) => {
    if (field_data.field_type !== FIELD_TYPE.INFORMATION) {
      const { translation_data } = field_data;
      const fieldName = isEditableForm ?
      (translation_data?.[pref_locale]?.field_name || field_data.field_name) : field_data.field_name;
    return (
    <div
      className={
        cx(
          tableError &&
            tableError.includes('Duplicate') &&
            fieldList.table_validations.unique_column_uuid === field_data.field_uuid ?
            cx(styles.UniqueColumnError) : gClasses.FTwo13GrayV53,
            gClasses.FontWeight500,
            gClasses.ClickableElement,
          { [gClasses.CursorMove]: isFieldConfigurable },
        )}
        id={`${field_data.field_uuid}_label`}
          tabIndex={isFieldConfigurable ? 0 : -1}
          role="button"
          onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && (isFieldConfigurable ? onFormFieldOpenAndCloseHandler(FORM_FIELD_CONFIG_ACTIONS.OPEN, FORM_FIELD_CONFIG_TYPES.FIELD, FIELD_LIST_TYPE.TABLE, sectionIndex, fieldListIndex, fieldIndex) : null)}
      // style={{ color: buttonColor, fontSize: '13px', fontWeight: 500 }}
      onClick={() => (isFieldConfigurable ? onFormFieldOpenAndCloseHandler(FORM_FIELD_CONFIG_ACTIONS.OPEN, FORM_FIELD_CONFIG_TYPES.FIELD, FIELD_LIST_TYPE.TABLE, sectionIndex, fieldListIndex, fieldIndex) : null)}
      // title={field_data.field_name}
    >
      {fieldName}
{(field_data.help_text) ? <HelpIcon className={gClasses.ML5} title={field_data.help_text} id={`form_field_tooltip-${sectionIndex}-${fieldListIndex}-${fieldIndex}`} /> : null}
      {(field_data.required && !field_data.read_only) && <span className={styles.Required}>{ASTERISK}</span>}

    </div>
  );
}
  return null;
});

  const addFieldButton = (
    <>
      <button
        className={cx(
          gClasses.CenterV,
          gClasses.ClickableElement,
          gClasses.ML15,
          gClasses.CursorPointer,
        )}
        // ref={dropdownRef}
        ref={setReferencePopperElement}
        onClick={toggleDropdown}
      >
        <AddIcon role={ARIA_ROLES.IMG} ariaLabel={ARIA_LABEL.ADD} ariaHidden style={{ fill: buttonColor }} />
        <div style={{ color: buttonColor }} className={cx(gClasses.FTwo13, gClasses.ML5, gClasses.FontWeight500)}>
          {t(TABLE.ADD_COLUMN)}
        </div>
      </button>
      <AutoPositioningPopper
        className={cx(
          gClasses.ZIndex7,
          gClasses.MT5,
          gClasses.MB5,
          gClasses.PX20,
          !showOnlyNewFormFieldsDropdown && BS.D_FLEX,
          !showOnlyNewFormFieldsDropdown && fieldsDataLength > 0 && gClasses.CenterH,
          !showOnlyNewFormFieldsDropdown && fieldsDataLength > 0 && styles.DropdownPopper,
        )}
        referenceElement={referencePopperElement}
        placement={POPPER_PLACEMENTS.BOTTOM}
        allowedAutoPlacements={undefined}
        fallbackPlacements={[POPPER_PLACEMENTS.TOP, POPPER_PLACEMENTS.RIGHT, POPPER_PLACEMENTS.LEFT]}
        fixedStrategy
        isPopperOpen={isDropdownVisible}
        enableOnBlur
        onBlur={() => toggleDropdown(false)}
        topPlacementClasses={cx(!showOnlyNewFormFieldsDropdown && BS.AI_END)}
      >
        <FormFieldsDropdown
          isDropdownVisible
          getInputId={(fieldType) => {
            setDropdownVisibility(false);
            getInputId(fieldType);
          }}
          positionObject={positionObject}
          onHeaderClick={onHeaderClick}
          blackListFields={[FIELD_TYPES.TABLE, FF_DROPDOWN_LIST_SECTION_TITLE_TYPE.TABLE]}
          setDropDownList={setDropDownList}
          addFormFieldsDropdownId={addFormFieldsDropdownId}
          onSuggestionListLoadMore={onSuggestionListLoadMore}
          onSuggestionFieldClickHandler={onSuggestionFieldClickHandler}
          showOnlyNewFormFieldsDropdown={showOnlyNewFormFieldsDropdown}
        />
      </AutoPositioningPopper>
    </>
  );

  const addRowButton = getAddRowButton(() => onTableAddOrDeleteRowClick(table_uuid), table_validations, isEditableForm, isReadOnlyForm, isCompletedForm, areAllColumnsReadOnly, isTableDisabled, t);

  // const isAddRowVisible = !isCompletedForm && typeof onTableAddOrDeleteRowClick !== 'undefined';

  if (isFieldConfigurable) {
    // headerArray.push(addFieldButton);
  } else if (!isUndefined(isAuditView) && !isAuditView) {
    headerArray.push(EMPTY_STRING);
  }

  let rowDataArray = [];
  const allRowUnqiueUUID = [];

  if (isCreationForm) {
    rowDataArray = [
      {
        note: (
          <div className={cx(gClasses.FOne12GrayV6, gClasses.Italics, BS.TEXT_CENTER, gClasses.ClickableElement)}>
            {t(TABLE.ROW_INSTRUCTION)}
          </div>
        ),
      },
    ];
  }

  if (nullCheck(rowData, 'length', true)) {
    rowDataArray = rowData.map((eachRow) => {
      const deleteRowButton = getDeleteRowButton(
          () => onTableAddOrDeleteRowClick(table_uuid,
             // get(eachRow, ['rowId'], null) ||
          get(eachRow, ['tempRowUuid'], null)),
          table_validations,
          isEditableForm,
          isReadOnlyForm,
          isCompletedForm,
          areAllColumnsReadOnly,
          get(eachRow, ['rowId'], null),
        );
      const eachRowData = [];
      const currentRow = formType === FORM_TYPES.CREATION_FORM ? eachRow : eachRow.currentRowData;
      currentRow.forEach((eachFieldData) => {
        if (get(formVisibility, ['visible_fields', eachFieldData.props.field_data.field_uuid])
        || isCreationForm || isNull(formVisibility) ||
        !eachFieldData.props.field_data.is_visible // if visibility condition is added to disable the field need to render it in table
        ) eachRowData.push(eachFieldData);
      });
      if (isEmpty(eachRowData)) return ['No Values found'];
      else {
        allRowUnqiueUUID.push(eachRow?.tempRowUuid || null);
        return !isNull(deleteRowButton) ? [...eachRowData, deleteRowButton] : [...eachRowData, EMPTY_STRING];
      }
    });
    headerArray.push(EMPTY_STRING);
  }

  if (isEmpty(rowDataArray)) rowDataArray = [['No Values found']];

  const [fieldListConfigTabIndex, setFieldListConfigTabIndex] = useState(FIELD_LIST_CONFIGS_TABS(FIELD_LIST_TYPE.TABLE, t)[0].INDEX);
  const onValidationConfigChangeHandler = (event) => onFormFieldChangeHandler(FIELD_LIST_KEYS.VALIDATIONS, event, sectionIndex, fieldListIndex);

  const onTabChange = async (index) => {
    if (index === fieldListConfigTabIndex) return false;
    const status = await onFormFieldChangeHandler(FORM_FIELD_CONFIG_ACTIONS.TAB_SWITCH, { currentIndex: fieldListConfigTabIndex, index }, sectionIndex, fieldListIndex);
    if (status) return setFieldListConfigTabIndex(index);
    return false;
  };
  useEffect(() => {
    setFieldListConfigTabIndex(FIELD_LIST_CONFIGS_TABS(FIELD_LIST_TYPE.TABLE, t)[0].INDEX);
  }, [fieldList.isFieldListConfigPopupOpen]);
  console.log('fieldList info', formVisibility, fieldList, fieldList.is_visible);
  const tableFieldListConfigPopup = (
    <AutoPositioningPopper
      className={cx(
        gClasses.ZIndex13,
        // gClasses.MT5,
        // gClasses.MB5,
        // gClasses.PX20,
        // !showOnlyNewFormFieldsDropdown && BS.D_FLEX,
        // !showOnlyNewFormFieldsDropdown && fieldsDataLength > 0 && gClasses.CenterH, !showOnlyNewFormFieldsDropdown && fieldsDataLength > 0 && styles.DropdownPopper,
      )}
      referenceElement={tableConfigPopupRef}
      placement={POPPER_PLACEMENTS.AUTO}
      allowedAutoPlacements={[POPPER_PLACEMENTS.TOP, POPPER_PLACEMENTS.RIGHT, POPPER_PLACEMENTS.BOTTOM]}
      fixedStrategy
      isPopperOpen={isFieldListConfigPopupOpen}
    >
      <FieldListConfig
        configTitle="Table Configuration"
        fieldListType={FIELD_LIST_TYPE.TABLE}
        tableName={tableName}
        tableRefName={fieldList[FIELD_LIST_KEYS.TABLE_REF_NAME]}
        onTableNameChangeHandler={onTableNameChangeHandler}
        onTableNameBlurHandler={onTableNameBlurHandler}
        onTableReferenceNameChangeHandler={onTableReferenceNameChangeHandler}
        onTableReferenceNameBlurHandler={(event) => onFormFieldChangeHandler(FORM_FIELD_CONFIG_ACTIONS.TABLE_REFERENCE_NAME_BLUR, event, sectionIndex, fieldListIndex)}
        onSaveFieldListHandler={onSaveFormField}
        sectionIndex={sectionIndex}
        fieldListShowWhenRule={fieldList && fieldList[FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE]}
        fieldListIndex={fieldListIndex}
        onCloseClickHandler={(...params) => onFormFieldOpenAndCloseHandler(FORM_FIELD_CONFIG_ACTIONS.CLOSE, ...params)}
        selectedTabIndex={fieldListConfigTabIndex}
        onTabChangeHandler={(tabIndex) => onTabChange(tabIndex)}
        error_list={error_list}
        getRuleDetailsByIdInFieldVisibilityApi={getRuleDetailsByIdInFieldVisibilityApi}
        server_error={server_error}
        onFieldListShowWhenRule={(event) => onFormFieldChangeHandler(FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE, event, sectionIndex, fieldListIndex)}
        onVisibilityConfigChangeHandler={(id, value) => onFormFieldChangeHandler(VISIBILITY_CONFIG_CHANGE.FIELD_LIST, { target: { id, value } }, sectionIndex, fieldListIndex)}
        onValidationConfigChangeHandler={onValidationConfigChangeHandler}
        errorList={errorList}
        onFieldVisibleRule={(event) => onFormFieldChangeHandler(FIELD_LIST_KEYS.IS_VISIBLE, event, sectionIndex, fieldListIndex)}
        isFieldListShowWhenRule={is_field_list_show_when_rule}
        is_visible={fieldList.is_visible}
        is_row_maximum={fieldList.table_validations.is_maximum_row}
        is_row_minimum={fieldList.table_validations.is_minimum_row}
        row_maximum={fieldList.table_validations.maximum_row}
        row_minimum={fieldList.table_validations.minimum_row}
        is_unique_column_available={fieldList.table_validations.is_unique_column_available}
        selectedField={fieldList.table_validations.unique_column_uuid}
        tabelFields={fieldList.fields}
        onDeleteFieldListHandler={(...params) => deleteFormFieldHandler(FIELD_OR_FIELD_LIST.FIELD_LIST, ...params)}
        isTableImported={isTableImported}
        isPopUpOpen={fieldList.isFieldListConfigPopupOpen}
        currentTableUuid={fieldList.table_uuid}
        previous_expression={fieldList[FIELD_KEYS.PREVIOUS_RULE_EXPRESSION] || {}}
        expression={fieldList[FIELD_KEYS.RULE_EXPRESSION] || {}}
        rule_expression_has_validation={fieldList[FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION]}
        add_new_row={fieldList.table_validations.add_new_row}
        allow_modify_existing={fieldList.table_validations.allow_modify_existing}
        allow_delete_existing={fieldList.table_validations.allow_delete_existing}
      />
    </AutoPositioningPopper>
  );

  const editButton = isCreationForm ? (
    <button
      className={cx(
        styles.EditDeleteIconContainer,
        gClasses.ML10,
        gClasses.CenterVH,
        gClasses.CursorPointer,
        gClasses.ClickableElement,
        styles.EditContainer,
      )}
      onClick={() => onFormFieldOpenAndCloseHandler(FORM_FIELD_CONFIG_ACTIONS.OPEN, FORM_FIELD_CONFIG_TYPES.FIELD_LIST, FIELD_LIST_TYPE.TABLE, sectionIndex, fieldListIndex)}

    >
      <EditIconV2 role={ARIA_ROLES.IMG} ariaLabel={`${ARIA_LABEL.EDIT} table`} className={styles.EditIcon} />
    </button>
  ) : null;
  const deleteButton = isCreationForm ? (
    <button
      className={cx(
        styles.EditDeleteIconContainer,
        gClasses.ML10,
        gClasses.CenterVH,
        gClasses.CursorPointer,
        gClasses.ClickableElement,
        styles.DeleteContainer,
      )}
        onClick={() => deleteFormFieldHandler(FIELD_OR_FIELD_LIST.FIELD_LIST, sectionIndex, fieldListIndex)}

    >
      <DeleteIconV2 role={ARIA_ROLES.IMG} ariaLabel={`${ARIA_LABEL.DELETE} table`} className={styles.DeleteIcon} />
    </button>
  ) : null;
  const auditedIndexs = [];
  if (isAuditView && auditedTabelRows) {
    auditedTabelRows.forEach((value) => {
      if (value.tabelUuid === table_uuid) {
        auditedIndexs.push({ index: value.rowIndex, type: value.actionType });
      }
    });
  }

// on extra validation configuration .
// this config model get visible only if all the existing field inside the table is readonly and newly adding field should be editable
  const onModalClose = () => {
    onFormFieldChangeHandler(FIELD_LIST_KEYS.SHOW_TABLE_VALIDATION_MODAL, false, sectionIndex, fieldListIndex);
  };
  const onModelSaveAction = () => {
    onSaveFormField(sectionIndex + 1, fieldListIndex);
    onModalClose();
  };

  let validation_config_header = null;
  let validation_config_body = null;
  let validation_config_footer = null;

  if (fieldList?.show_table_validation_modal) {
    const { TABLE: { VALIDATION_CONFIG, TABLE_CONFIGURATION } } = FIELD_LIST_CONFIG(t);
      validation_config_header = (
            <div className={cx(gClasses.ModalHeader, gClasses.ML15)}>
              {TABLE_CONFIGURATION.LABEL}
            </div>
          );
      validation_config_body = (
        <div>
          <Label
            innerClassName={cx(gClasses.FTwo14BlackV13)}
            className={gClasses.MB15}
            content={TABLE_CONFIGURATION.INSTRUCTION}
          />
          <CheckboxGroup
            optionList={VALIDATION_CONFIG.ALLOW_ADDING_NEW_ROW.OPTION_LIST}
            id={VALIDATION_CONFIG.ALLOW_ADDING_NEW_ROW.ID}
            onClick={() => {
              onValidationConfigChangeHandler({
                target: { id: VALIDATION_CONFIG.ALLOW_ADDING_NEW_ROW.ID },
              });
            }}
            selectedValues={(fieldList.table_validations.add_new_row ? [1] : [0])}
            hideLabel
          />

          <CheckboxGroup
            optionList={VALIDATION_CONFIG.ALLOW_EDITING_EXISTING_ROW.OPTION_LIST}
            id={VALIDATION_CONFIG.ALLOW_EDITING_EXISTING_ROW.ID}
            onClick={() => {
              onValidationConfigChangeHandler({
                target: { id: VALIDATION_CONFIG.ALLOW_EDITING_EXISTING_ROW.ID },
              });
            }}
            selectedValues={(fieldList.table_validations.allow_modify_existing ? [1] : [0])}
            hideLabel
          />
        </div>
      );
      validation_config_footer = (
        <div className={cx(
          BS.W100,
          BS.D_FLEX,
          BS.JC_BETWEEN,
        )}
        >
          <Button
            buttonType={BUTTON_TYPE.SECONDARY}
            className={cx(BS.TEXT_NO_WRAP)}
            onClick={onModalClose}
          >
            {TABLE_CONFIGURATION.ACTIONS.DISCARD}
          </Button>
          <Button
            buttonType={BUTTON_TYPE.PRIMARY}
            className={cx(BS.TEXT_NO_WRAP)}
            onClick={onModelSaveAction}
          >
            {TABLE_CONFIGURATION.ACTIONS.UPDATE}
          </Button>
        </div>
      );
  }

  return !isEmpty(visibleFields) || formType !== FORM_TYPES.EDITABLE_FORM ? (
    <div className={cx(isCreationForm ? cx(styles.CreateContainer, gClasses.CursorGrab) : styles.Container)}>
      <div className={cx(BS.D_FLEX, BS.JC_BETWEEN, BS.ALIGN_ITEM_CENTER, editButton ? gClasses.MB7 : null)}>
      <Label labelFor="tableId" content={tableName} className={editButton ? gClasses.ML3 : null} hideLabelClass />
      <div className={cx(BS.D_FLEX)}>
      {console.log('isTableImported33sw', isTableImported)}
         {(isTableImported) && (<p className={cx(styles.FieldTypeInstruction, gClasses.FOne12GrayV17, gClasses.Italics)}>{FIELD_VIEW_TYPE.IMPORTED}</p>)}
         {editButton}
         {deleteButton}
         {isFieldConfigurable ? addFieldButton : null}
      </div>
      </div>
      <div className={cx(BS.D_FLEX)}>
        <BasicTable
          tableRef={tableRef}
          headerClassName={styles.TableHeader}
          header={headerArray}
          data={rowDataArray}
          id="tableId"
          isCompletedForm={isCompletedForm}
          noOverflow={isFieldConfigurable}
          tableError={tableError}
          tableErrorIndex={tableErrorIndex}
          createTableError={createTableError}
          popperRef={setTableConfigPopupRef}
          enableInternalPagination={isEditableForm && is_pagination}
          rowCountPerPage={page_size}
          fieldListIndex={fieldListIndex}
          onFieldDragEndHandler={onFieldDragEndHandler}
          enableDragAndDrop={!!onFieldDragEndHandler}
          errorRowIndices={nonUniqueErrorIndices}
          errorColumnIndex={uniqueColumnIndex}
          // auditedTabelRows
          isAuditView={isAuditView}
          auditedIndexs={auditedIndexs}
          allRowUnqiueUUID={allRowUnqiueUUID}
        />
        <ModalLayout
            id="validation-config"
            modalContainerClass={styles.ModalContainer}
            headerContent={validation_config_header}
            headerClassName={styles.HeaderContent}
            footerContent={validation_config_footer}
            closeIconClass={styles.CloseIconContainer}
            centerVH
            isModalOpen={fieldList.show_table_validation_modal}
            mainContent={validation_config_body}
            backgroundScrollElementId={HEADER_AND_BODY_LAYOUT}
            onCloseClick={onModalClose}
            mainContentClassName={styles.InnerContent}
        />
        {/* {editButton}
        {deleteButton} */}
        {tableFieldListConfigPopup}
      </div>
      {
        (formType === FORM_TYPES.CREATION_FORM && checkAllFieldsAreReadOnly(fields) && !isEmpty(fields)) &&
        <div className={cx(BS.ALERT, BS.ALERT_WARNING, gClasses.FTwo11, gClasses.MT10)}>
           {TABLE_CONTROL_ACCESS.REVOKE_ADD_AND_EDIT_INFO}
        </div>
      }
      {tableError ? (
        <HelperMessage
          message={tableError}
          type={HELPER_MESSAGE_TYPE.ERROR}
          className={gClasses.ErrorMarginV2}
        />
      ) : null}
      {createTableError ? (
        <HelperMessage
          message={createTableError}
          type={HELPER_MESSAGE_TYPE.ERROR}
          className={gClasses.ErrorMarginV2}
        />
      ) : null}
      {addRowButton}
    </div>
  ) : null;
}
const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
    allFieldsDetails: state.EditFlowReducer.all_fields_details,
    allTableFieldDetails: cloneDeep(state.EditFlowReducer.all_table_fields_details),
    addFormFieldsDropdownId: state.EditFlowReducer.addFormFieldsDropdownId,
    addFormFieldsDropdownVisibilityData: cloneDeep(state.EditFlowReducer.addFormFieldsDropdownVisibilityData),
    // auditedTabelRows: state.DataListReducer.auditedTabelRows,
    isNavOpen: state.NavBarReducer.isNavOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllFields: (params) => {
      dispatch(getAllFieldsThunk(params));
    },
    updateFlowState: (params) => {
      dispatch(updateFlowStateChange(params));
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTable);
CreateTable.defaultProps = {
  headerData: [],
};
CreateTable.propTypes = {};
