import React, { useEffect } from 'react';
import cx from 'classnames/bind';
import { Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

import gClasses from 'scss/Typography.module.scss';
import {
  arryToDropdownData, keydownOrKeypessEnterHandle,
} from 'utils/UtilityFunctions';
import jsUtils from 'utils/jsUtility';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import DeleteIconV2 from 'assets/icons/form_fields/DeleteIconV2';
import Dropdown from 'components/form_components/dropdown/Dropdown';
import { FIELD_CONFIG, FIELD_TYPES } from 'components/form_builder/FormBuilder.strings';
import { datalistFieldsClear, datalistFieldsThunk, datalistFieldValuesClear, datalistFieldValuesThunk, datalistFieldValuesSuccess } from 'redux/actions/Visibility.Action';
import { FIELD_LIST_TYPE } from 'utils/constants/form.constant';
import { getDataListFieldsDropdownList, getDataListFieldValuesList } from 'redux/reducer';
import Input from 'components/form_components/input/Input';
import HELPER_MESSAGE_TYPE from 'components/form_components/helper_message/HelperMessage.strings';
import HelperMessage from 'components/form_components/helper_message/HelperMessage';
import DatePicker from 'components/form_components/date_picker/DatePicker';
import InputDropdown from 'components/form_components/input_dropdown/InputDropdown';
import PlusIcon from 'assets/icons/PlusIcon';
import { getAllExternalFieldsThunk } from 'redux/actions/FormulaBuilder.Actions';
import { translate } from 'language/config';
import { useTranslation } from 'react-i18next';
import style from './DataListPickerFilter.module.scss';
import { DL_PICKER_FILTER_STRING, DL_VALUE_TYPE_OPTION_LIST } from './DatalistPickerFilter.string';
import { dynamicDatalistFieldOptions } from './DatalistPickerFilter.utils';

const mapStateToProps = (state) => {
  return {
    flowData: state.EditFlowReducer.flowData,
    isRuleFieldTypeChangeLoading: state.EditFlowReducer.isRuleFieldTypeChangeLoading,
    datalistFields: getDataListFieldsDropdownList(state),
    datalistFieldValues: getDataListFieldValuesList(state),
    pagination_details: state.VisibilityReducer.externalFieldReducer.datalistFields.pagination_details,
    hasMore: state.VisibilityReducer.externalFieldReducer.datalistFields.hasMore,
    isDataListFieldsLoading: state.VisibilityReducer.externalFieldReducer.isDataListFieldsLoading,
    flowId: state.EditFlowReducer.flowData.flow_id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getDataListFields: (params, setDataListFieldsCancelToken, t) => {
      dispatch(datalistFieldsThunk(params, setDataListFieldsCancelToken, t));
    },
    getDataListFieldValues: (params, setDataListFieldValuesCancelToken) => {
      dispatch(datalistFieldValuesThunk(params, setDataListFieldValuesCancelToken));
    },
    datalistFilterValuesSuccess: (valueArrray, fieldType, filterIndex) => {
      dispatch(datalistFieldValuesSuccess(valueArrray, fieldType, filterIndex));
    },
    getDatalistDynamicFieldData: (paginationDetails, taskId, isTaskForm, isDataListForm, stepOrder) => {
      dispatch(getAllExternalFieldsThunk(paginationDetails, taskId, { isTaskForm, isDataListForm }, stepOrder, true,
    ));
    },
    dispatch,
  };
};

function DataListPickerFilter(props) {
  const {
    filter,
    filterIndex,
    dataList,
    getDataListFields,
    datalistFields,
    hasMore,
    isDataListFieldsLoading,
    pagination_details,
    onSelectFilterField,
    onChangeOperatorData,
    totalFilters,
    // getDataListFieldValues,
    datalistFieldValues,
    onFilterValueChange,
    setLimitDataListValues,
    onDeleteDataListFilter,
    error_list,
    sectionIndex,
    fieldListIndex,
    fieldIndex,
    allowed_currency_types,
    defaultCurrencyType,
    fieldUuid,
    isTaskForm,
    taskId,
    // stepOrder,
    isDataListForm,
    onFilterTypeChange,
    dispatch,
    fieldValueData,
    setFieldValueDataChange,
    flowId,
  } = props;
  const { t } = useTranslation();

  const { VALIDATION_CONFIG } = FIELD_CONFIG(t);
  let fieldError = EMPTY_STRING;
  let operatorError = EMPTY_STRING;
  let fieldValueError = EMPTY_STRING;
  let duplicateError = EMPTY_STRING;
  // const errorKey = `sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},validations,filter_fields,${filterIndex}`;
  if (Object.keys(error_list).includes(`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},validations,filter_fields,${filterIndex}`)) {
        duplicateError = 'Duplicate Filter';
  }
  if (Object.keys(error_list).includes(`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},validations,filter_fields,${filterIndex},field_uuid`)) {
    fieldError = error_list[`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},validations,filter_fields,${filterIndex},field_uuid`];
  }
  if (Object.keys(error_list).includes(`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},validations,filter_fields,${filterIndex},operator`)) {
    operatorError = error_list[`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},validations,filter_fields,${filterIndex},operator`];
  }
  if (Object.keys(error_list).includes(`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},validations,filter_fields,${filterIndex},field_value`)) {
    fieldValueError = error_list[`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},validations,filter_fields,${filterIndex},field_value`];
  }
  if (Object.keys(error_list).includes(`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},validations,filter_fields,${filterIndex},field`)) {
    fieldValueError = error_list[`sections,${sectionIndex},field_list,${fieldListIndex},fields,${fieldIndex},validations,filter_fields,${filterIndex},field`];
  }

  const cancelDataListToken = {
    cancelToken: null,
  };

  const setDataListFieldsCancelToken = (c) => { cancelDataListToken.cancelToken = c; };

  const loadDatalistFields = (page) => {
    const params = {
      page: page || 1,
      size: 1000,
      data_list_id: dataList.data_list_id,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      allowed_field_types:
      [...VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD.ALLOWED_FIELD_TYPES.inputFields,
      ...VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD.ALLOWED_FIELD_TYPES.selectionFields],
    };
    getDataListFields(params, setDataListFieldsCancelToken, t);
  };

  useEffect(() => {
    loadDatalistFields();
    return () => {
      datalistFieldValuesClear();
      datalistFieldsClear();
    };
  }, [fieldUuid]);

  useEffect(() => () => {
      datalistFieldValuesClear();
      datalistFieldsClear();
    });

  const getOperatorList = () => {
    console.log('getOperatorList filter', filter);
    if (filter.field_type === FIELD_TYPES.NUMBER ||
        filter.field_type === FIELD_TYPES.CURRENCY ||
        filter.field_type === FIELD_TYPES.DATE ||
        filter.field_type === FIELD_TYPES.DATETIME) {
        return VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.OPERATORS.OPTION_LIST;
    } else if (
        filter.field_type === FIELD_TYPES.YES_NO ||
        filter.field_type === FIELD_TYPES.CHECKBOX ||
        filter.field_type === FIELD_TYPES.DROPDOWN ||
        filter.field_type === FIELD_TYPES.RADIO_GROUP ||
        filter.field_type === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN
    ) return [VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.OPERATORS.OPTION_LIST[4]];
    else {
      return [];
    }
  };

  const getValuesField = () => {
    if (filter.field_type === FIELD_TYPES.NUMBER) {
      return (
        <Input
        id={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.ID}
        onChangeHandler={(event) => {
          event.target.value = event.target.valueAsNumber;
          const valueEvent = {
            target: {
              value: jsUtils.isNaN(event.target.valueAsNumber) ? '' : event.target.valueAsNumber,
            },
          };
          onFilterValueChange(valueEvent, filterIndex);
        }
        }
        value={filter.field_value}
        errorMessage={fieldValueError}
        type="number"
        placeholder={DL_PICKER_FILTER_STRING.VALUE_PLACEHOLDER}
        />
      );
    } else if (filter.field_type === FIELD_TYPES.DATE ||
        filter.field_type === FIELD_TYPES.DATETIME) {
          return (
            <div className={gClasses.PositionRelative}>
          <DatePicker
              className={gClasses.PR30}
              id={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.ID}
              getDate={(value) => {
                const valueEvent = {
                  target: {
                    value: value,
                  },
                };
                console.log('datepicker check', value);
                onFilterValueChange(valueEvent, filterIndex);
              }}
              date={filter.field_value}
              errorMessage={fieldValueError}
              enableTime={filter.field_type === FIELD_TYPES.DATETIME}
              isScrollIntoView
              popperClasses={gClasses.ZIndex5}
          />
            </div>
          );
        } else if (filter.field_type === FIELD_TYPES.CURRENCY) {
          const allowedCurrenyTypes = arryToDropdownData(
            allowed_currency_types ||
            [],
          );
          return (
            <InputDropdown
              id={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.ID}
              onChange={(event) => {
                const valueEvent = {
                  target: {
                    value: {
                    value: event.target.value,
                    currency_type: filter.field_value.currency_type || defaultCurrencyType,
                  },
                },
                };
                onFilterValueChange(valueEvent, filterIndex);
              }
            }
              onDropdownChange={(event) => {
                const valueEvent = {
                  target: {
                    value: {
                    value: filter.field_value.value || '',
                    currency_type: event.target.value,
                    },
                  },
                };
                onFilterValueChange(valueEvent, filterIndex);
              }
            }
              optionList={allowedCurrenyTypes}
              value={filter.field_value.value || ''}
              strictlySetSelectedValue
              dropdownValue={filter.field_value.currency_type || defaultCurrencyType}
              errorMessage={fieldValueError}
              required
              placeholder={DL_PICKER_FILTER_STRING.VALUE_PLACEHOLDER}
            />
          );
        }
        return null;
  };

  const onSelectionFieldFilterValueSelected = (event) => {
    if (filter.field_type === FIELD_TYPES.CHECKBOX) {
      const { value } = event.target;
      const checkboxList = jsUtils.isEmpty(filter.field_value)
        ? []
        : jsUtils.cloneDeep(filter.field_value);
      if (!checkboxList.includes(value)) checkboxList.push(value);
      else checkboxList.splice(checkboxList.indexOf(value), 1);
      console.log('checkboxList', checkboxList);
      const valueEvent = {
        target: {
          value: checkboxList,
          id: 'field_value',
        },
      };
      onFilterValueChange(valueEvent, filterIndex);
    } else onFilterValueChange(event, filterIndex);
  };

  const onLoadMoreCallHandler = () => {
    if (pagination_details[0] && datalistFields && !isDataListFieldsLoading) {
      if (pagination_details[0].total_count > datalistFields.length) {
        const page = pagination_details[0].page + 1;
        loadDatalistFields(page);
      }
    }
  };

  const staticOrDynamicChange = (event) => {
    const { value } = event.target;
    onFilterTypeChange(filterIndex, value);
  };

  const loadFieldData = () => {
    const paginationDetails = {
      page: 1,
      size: 1000,
      include_property_picker: 1,
    };
    const idDetails = !(isTaskForm || isDataListForm) ? flowId : taskId;
    return new Promise((resolve, reject) => {
      dispatch(getAllExternalFieldsThunk(
          paginationDetails,
          idDetails,
          { isTaskForm, isDataListForm },
          // stepOrder,
          true,
          t,
      ))
      .then((response) => {
        setFieldValueDataChange(dynamicDatalistFieldOptions(response.pagination_data || []));
          resolve(response.pagination_data || []);
      }).catch(() => {
          reject();
      });
    });
  };

  useEffect(() => {
    if (jsUtils.isEmpty(fieldValueData)) loadFieldData();
  }, []);

  const onFieldSelect = (event) => {
    onFilterValueChange(event, filterIndex, true);
  };

  const specificFieldTypeOptionList = (optionList) => {
    const optionListData = optionList.filter((field) => field.fieldType === filter.field_type);
    return optionListData;
  };

  return (
    <>
    <div className={duplicateError ? style.ErrorFilter : style.RowConditions}>
      <Dropdown
        label={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD.LABEL}
        id={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD.ID}
        optionList={datalistFields}
        loadDataHandler={onLoadMoreCallHandler}
        hasMore={hasMore}
        isPaginated
        selectedValue={filter.field_uuid}
        onChange={(event) => onSelectFilterField(event, filterIndex)}
        isRequired
        errorMessage={fieldError}
        strictlySetSelectedValue
        disablePopper
        showNoDataFoundOption
        noDataFoundOptionLabel={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD.NO_FIELDS_AVAILABLE}
      />
      <Dropdown
        label={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.OPERATORS.LABEL}
        optionList={getOperatorList()}
        selectedValue={filter.operator}
        onChange={(event) => onChangeOperatorData(event, filterIndex)}
        showNoDataFoundOption
        noDataFoundOptionLabel={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.OPERATORS.NO_OPERATORS_AVAILABLE}
        isRequired
        errorMessage={operatorError}
        disablePopper
      />
      {filter.field_type && (
      <div className={cx(BS.D_FLEX)}>
        <Dropdown
          id={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.ID}
          label={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.LABEL}
          className={cx(style.StaticDynamic, gClasses.MR5)}
          optionList={DL_VALUE_TYPE_OPTION_LIST}
          selectedValue={filter.value_type === DL_PICKER_FILTER_STRING.FIELD}
          onChange={(event) => staticOrDynamicChange(event)}
          setSelectedValue
          isTaskDropDown
          disablePopper
          isRequired
        />
        <div className={cx(style.ValueField)}>
          {filter.value_type === DL_PICKER_FILTER_STRING.FIELD ? (
          <Dropdown
            id={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.ID}
            optionList={specificFieldTypeOptionList(fieldValueData)}
            onChange={(event) => onFieldSelect(event)}
            selectedValue={filter.field || EMPTY_STRING}
            placeholder={DL_PICKER_FILTER_STRING.FIELD_PLACEHOLDER}
            showNoDataFoundOption
            noDataFoundOptionLabel={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.NO_VALUES_FOUND}
            errorMessage={fieldValueError}
          />
          ) :
          VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD.ALLOWED_FIELD_TYPES.selectionFields.includes(filter.field_type) ?
          (
            <Dropdown
            id={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.ID}
            optionList={datalistFieldValues[filter.field_uuid]}
            onChange={(event) => onSelectionFieldFilterValueSelected(event)}
            selectedValue={filter.field_type === FIELD_TYPES.CHECKBOX || filter.field_type === FIELD_TYPES.YES_NO ? filter.field_value : filter.field_value && filter.field_value[0]}
            errorMessage={fieldValueError}
            // strictlySetSelectedValue
            placeholder={DL_PICKER_FILTER_STRING.VALUE_PLACEHOLDER}
            setSelectedValue
            showNoDataFoundOption
            noDataFoundOptionLabel={VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD_VALUE.NO_VALUES_FOUND}
            isMultiSelect={filter.field_type === FIELD_TYPES.CHECKBOX}
            disablePopper
            />
          ) :
          (
            getValuesField()
          ) }
        </div>
      </div>
      )}

      {totalFilters > 1 ? (
        <div className={cx(BS.D_FLEX, BS.JC_END)}>
          <div className={style.DeleteIconContainer}>
            <DeleteIconV2
            role={ARIA_ROLES.BUTTON}
            tabIndex={0}
            className={cx(style.DeleteIcon, gClasses.CursorPointer)}
            onClick={() => onDeleteDataListFilter(filterIndex)}
            onKeyDown={(e) => keydownOrKeypessEnterHandle(e) && onDeleteDataListFilter(filterIndex)}
            ariaLabel="Delete"
            />
          </div>
        </div>
      ) : null}
    </div>
    {duplicateError && (
        <HelperMessage
            type={HELPER_MESSAGE_TYPE.ERROR}
            message={duplicateError}
            className={cx(gClasses.ErrorMarginV1)}
        />
    )}
    { filterIndex === totalFilters - 1 ?
    (
    <Row className={style.RowMargin}>
      <Col lg={12}>
        <button
          className={cx(gClasses.FTwo13, gClasses.CenterV, gClasses.ClickableElement)}
          onClick={() => setLimitDataListValues(true)}
        >
          <PlusIcon ariaHidden className={style.AddCondition} />
          <div className={cx(
                 gClasses.ML5,
                 style.AddCondition,
                 gClasses.FontWeight500,
                 gClasses.FTwo13,
              )}
          >
           {translate('form_field_strings.validation_config.add_condition')}
          </div>
        </button>
      </Col>
    </Row>
    ) :
    (
      <Row className={style.RowMargin}>
      <Col lg={12}>
        <div
          className={cx(gClasses.FTwo11GrayV53, gClasses.CursorPointer)}
        >
          And
        </div>
      </Col>
      </Row>
    )
    }
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DataListPickerFilter);
