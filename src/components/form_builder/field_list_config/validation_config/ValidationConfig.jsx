import React, { useContext, useEffect } from 'react';
import cx from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import {
  get,
  isEmpty,
} from 'utils/jsUtility';
import { connect } from 'react-redux';
import FormBuilderContext from 'components/form_builder/FormBuilderContext';
import { FIELD_LIST_TYPE } from 'utils/constants/form.constant';
import { getTableValidationFieldsHasMore, getTableValidationFieldsLoadingStatus, getTableValidationFieldsPaginationDetails, getTableValidationlFieldsDropdownList } from 'redux/reducer';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { checkAllFieldsAreReadOnly } from 'utils/taskContentUtils';
import { BS } from 'utils/UIConstants';
import CheckboxGroup from '../../../form_components/checkbox_group/CheckboxGroup';
import Input from '../../../form_components/input/Input';
import { FIELD_LIST_CONFIG, FIELD_TYPES, TABLE_CONTROL_ACCESS } from '../../FormBuilder.strings';
import gClasses from '../../../../scss/Typography.module.scss';

function ValidationConfig(props) {
  const {
    onValidationChangeHandler, is_row_maximum, is_row_minimum, row_maximum, row_minimum, errorList, isTableValidationFieldsLoading,
    is_unique_column_available, currentTableUuid, tableValidationFieldsDropdownList, tableValidationFieldsDropdownData,
    tableValidationFieldsPaginationDetails, hasMore, selectedField, tabelFields, allow_modify_existing, add_new_row, allow_delete_existing,
  } = props;
  const { t } = useTranslation();
  const { getTableValidationFields } = useContext(FormBuilderContext);
  const isAllFieldReadOnly = isEmpty(tabelFields || []) ? false : checkAllFieldsAreReadOnly(tabelFields || []);
  const loadAllFields = (page) => {
    const params = {
      // search: '',
      page: page || 1,
      size: 6,
      // sort_field: '',
      sort_by: 1,
      // flow_id,
      field_list_type: FIELD_LIST_TYPE.TABLE,
      ignore_field_types: [FIELD_TYPES.INFORMATION, FIELD_TYPES.PARAGRAPH, FIELD_TYPES.FILE_UPLOAD],
      table_uuid: currentTableUuid,
      ignore_read_only_fields: 1,
      // is_table: 0,
    };
    getTableValidationFields(params);
  };
  useEffect(() => {
   if (is_unique_column_available) loadAllFields();
  }, [is_unique_column_available]);

  const onLoadMoreCallHandler = () => {
    if (!isTableValidationFieldsLoading && tableValidationFieldsDropdownData.pagination_details[0] && tableValidationFieldsDropdownData.pagination_data) {
      if (tableValidationFieldsDropdownData.pagination_details[0].total_count > tableValidationFieldsDropdownData.pagination_data.length) {
        const page = get(tableValidationFieldsPaginationDetails, ['page'], 0) + 1;
        loadAllFields(page);
      }
    }
  };
  const constructValueFromUuid = (selectedField) => {
    const fielddetails = tabelFields.find((field) => (field.field_uuid === selectedField));
    if (fielddetails) {
    return fielddetails.field_name;
    }
    return selectedField;
  };
  let maxRowErrorMessage = '';
  let minRowErrorMessage = '';
  let uniqueColumnErrorMessage = '';
  Object.keys(errorList).forEach((id) => {
    console.log('tableerrorlst', id, errorList);
    if (id.includes('unique_column_uuid')) {
      uniqueColumnErrorMessage = t('form_field_strings.error_text_constant.select_values');
    }
    if (id.includes('maximum_row') && errorList[id].includes(t('form_field_strings.error_text_constant.error_id.required'))) {
      console.log('maxminrequired0');
      maxRowErrorMessage = t('form_field_strings.error_text_constant.maximum_row_count');
    }
    if (id.includes('minimum_row') && errorList[id].includes(t('form_field_strings.error_text_constant.error_id.required'))) {
      console.log('maxminrequired1');
      minRowErrorMessage = t('form_field_strings.error_text_constant.minimum_allowd_table');
    }
    if (id.includes('maximum_row') && errorList[id].includes(t('form_field_strings.error_text_constant.error_id.greater_than_or_equal_to'))) {
      maxRowErrorMessage = t('form_field_strings.error_text_constant.greater_than_or_equal_to');
    }
    if (id.includes('maximum_row') && errorList[id].includes(t('form_field_strings.error_text_constant.error_id.greater_than_or_equal_to_one'))) {
      console.log('max_selection min123');
      maxRowErrorMessage = t('form_field_strings.error_text_constant.greater_than_or_equal_to_one');
    }
    if (id.includes('maximum_row') && errorList[id].includes(t('form_field_strings.error_text_constant.error_id.safe_number'))) {
      maxRowErrorMessage = t('form_field_strings.error_text_constant.row_count_higher');
    }
    if (id.includes('minimum_row') && errorList[id].includes(t('form_field_strings.error_text_constant.error_id.greater_than_or_equal_to_one'))) {
      console.log('max_selection min123123');
      minRowErrorMessage = t('form_field_strings.error_text_constant.minimum_row_count');
    }
    if (id.includes('minimum_row') && errorList[id].includes(t('form_field_strings.error_text_constant.error_id.safe_number'))) {
      minRowErrorMessage = t('form_field_strings.error_text_constant.minimum_allowed_row');
    }
  });
  const { TABLE: { VALIDATION_CONFIG } } = FIELD_LIST_CONFIG(t);
  return (
    <>
      {
          isAllFieldReadOnly ?
          (
          <div className={cx(BS.ALERT, BS.ALERT_WARNING, gClasses.FTwo11)}>
          {TABLE_CONTROL_ACCESS.REVOKE_ADD_AND_EDIT_VALIDATION_CONFIG}
          </div>
          ) : null
      }
      <CheckboxGroup
            optionList={VALIDATION_CONFIG.MIN_ROW_VALIDATION.OPTION_LIST}
            id={VALIDATION_CONFIG.MIN_ROW_VALIDATION.ID}
            onClick={() => {
              onValidationChangeHandler({
                target: { id: VALIDATION_CONFIG.MIN_ROW_VALIDATION.ID },
              });
            }}
            selectedValues={is_row_minimum ? [1] : []}
            hideLabel
      />
          {is_row_minimum ? (
            <Input
              id={VALIDATION_CONFIG.MIN_ROW_VALIDATION.ROWS_INPUT.ID}
              placeholder={VALIDATION_CONFIG.MIN_ROW_VALIDATION.ROWS_INPUT.PLACEHOLDER}
              // type="number"
              onChangeHandler={(event) => {
                onValidationChangeHandler(event);
              }}
              // onBlurHandler={onValidationConfigBlurHandler}
              value={row_minimum}
              hideLabel
              errorMessage={minRowErrorMessage}
            />
          ) : null}
      <CheckboxGroup
            optionList={VALIDATION_CONFIG.MAX_ROW_VALIDATION.OPTION_LIST}
            id={VALIDATION_CONFIG.MAX_ROW_VALIDATION.ID}
            onClick={() => {
              onValidationChangeHandler({
                target: { id: VALIDATION_CONFIG.MAX_ROW_VALIDATION.ID },
              });
            }}
            selectedValues={is_row_maximum ? [1] : []}
            hideLabel
      />
          {is_row_maximum ? (
            <Input
            id={VALIDATION_CONFIG.MAX_ROW_VALIDATION.ROWS_INPUT.ID}
            placeholder={VALIDATION_CONFIG.MAX_ROW_VALIDATION.ROWS_INPUT.PLACEHOLDER}
              // type="number"
              onChangeHandler={(event) => {
                onValidationChangeHandler(event);
              }}
              // onBlurHandler={onValidationConfigBlurHandler}
              value={row_maximum}
              hideLabel
              errorMessage={maxRowErrorMessage}
            />
          ) : null}
       <CheckboxGroup
            optionList={VALIDATION_CONFIG.UNIQUE_COLUMN.OPTION_LIST}
            id={VALIDATION_CONFIG.UNIQUE_COLUMN.ID}
            onClick={() => {
              onValidationChangeHandler({
                target: { id: VALIDATION_CONFIG.UNIQUE_COLUMN.ID },
              });
            }}
            selectedValues={is_unique_column_available ? [1] : []}
            hideLabel
       />
          {is_unique_column_available ? (
            <Dropdown
            optionList={tableValidationFieldsDropdownList}
            id={VALIDATION_CONFIG.UNIQUE_COLUMN.UNIQUE_COLUMN_FIELDS.ID}
            placeholder={VALIDATION_CONFIG.UNIQUE_COLUMN.UNIQUE_COLUMN_FIELDS.PLACEHOLDER}
            label={VALIDATION_CONFIG.UNIQUE_COLUMN.UNIQUE_COLUMN_FIELDS.LABEL}
            selectedValue={isEmpty(selectedField) ? null : constructValueFromUuid(selectedField)}
            onChange={(event) => {
              onValidationChangeHandler({
                target: { id: VALIDATION_CONFIG.UNIQUE_COLUMN.UNIQUE_COLUMN_FIELDS.ID, value: event.target.value },
              });
            }}
            errorMessage={uniqueColumnErrorMessage}
            isPaginated
            hasMore={hasMore}
            strictlySetSelectedValue
            setSelectedValue
            loadDataHandler={onLoadMoreCallHandler}
            isRequired
            disablePopper
            showNoDataFoundOption
            noDataFoundOptionLabel={t('form_field_strings.error_text_constant.no_values_found')}
            />
          ) : null}

        <CheckboxGroup
          optionList={VALIDATION_CONFIG.ALLOW_ADDING_NEW_ROW.OPTION_LIST}
          id={VALIDATION_CONFIG.ALLOW_ADDING_NEW_ROW.ID}
          onClick={() => {
            onValidationChangeHandler({
              target: { id: VALIDATION_CONFIG.ALLOW_ADDING_NEW_ROW.ID },
            });
          }}
          selectedValues={(isAllFieldReadOnly) ? [0] : (add_new_row ? [1] : [0])}
          hideLabel
          disabled={isAllFieldReadOnly}
        />

        <CheckboxGroup
          optionList={VALIDATION_CONFIG.ALLOW_EDITING_EXISTING_ROW.OPTION_LIST}
          id={VALIDATION_CONFIG.ALLOW_EDITING_EXISTING_ROW.ID}
          onClick={() => {
            onValidationChangeHandler({
              target: { id: VALIDATION_CONFIG.ALLOW_EDITING_EXISTING_ROW.ID },
            });
          }}
          selectedValues={(isAllFieldReadOnly) ? [0] : (allow_modify_existing ? [1] : [0])}
          hideLabel
          disabled={isAllFieldReadOnly}
        />

        <CheckboxGroup
          optionList={VALIDATION_CONFIG.ALLOW_DELETING_EXISTING_ROW.OPTION_LIST}
          id={VALIDATION_CONFIG.ALLOW_DELETING_EXISTING_ROW.ID}
          onClick={() => {
            onValidationChangeHandler({
              target: { id: VALIDATION_CONFIG.ALLOW_DELETING_EXISTING_ROW.ID },
            });
          }}
          selectedValues={allow_delete_existing ? [1] : [0]}
          hideLabel
        />
    </>
  );
}
const mapStateToProps = (state) => {
  return {
  tableValidationFieldsDropdownList: getTableValidationlFieldsDropdownList(
    state,
  ),
  isTableValidationFieldsLoading: getTableValidationFieldsLoadingStatus(state),
  tableValidationFieldsPaginationDetails: getTableValidationFieldsPaginationDetails(state),
  hasMore: getTableValidationFieldsHasMore(state),
  tableValidationFieldsDropdownData: state.VisibilityReducer.externalFieldReducer.tableValidationFields,
  };
};

export default connect(
  mapStateToProps,
  null,
)(ValidationConfig);
