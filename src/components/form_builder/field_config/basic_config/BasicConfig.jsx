import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { FIELD_KEYS, FIELD_LIST_TYPE, FORM_PARENT_MODULE_TYPES, INITIAL_PAGE, MAX_PAGINATION_SIZE, FIELD_TYPE } from 'utils/constants/form.constant';
import { BS } from 'utils/UIConstants';
import Tooltip from 'components/tooltip/Tooltip';
import ThemeContext from 'hoc/ThemeContext';
import Input from '../../../form_components/input/Input';
import CheckboxGroup from '../../../form_components/checkbox_group/CheckboxGroup';
import Dropdown from '../../../form_components/dropdown/Dropdown';
import styles from './DefaultValueRule.module.scss';
import FormBuilderContext from '../../FormBuilderContext';
import { FIELD_CONFIG, FIELD_TYPES } from '../../FormBuilder.strings';
import RadioGroup, {
  RADIO_GROUP_TYPE,
} from '../../../form_components/radio_group/RadioGroup';
import {
  EMPTY_STRING,
  DROPDOWN_CONSTANTS,
} from '../../../../utils/strings/CommonStrings';
import {
  trimString,
} from '../../../../utils/UtilityFunctions';
import {
  get,
  isEmpty,
  isUndefined,
  nullCheck,
} from '../../../../utils/jsUtility';
import InfoField from '../../../form_components/info_field/InfoField';
import gClasses from '../../../../scss/Typography.module.scss';
import { getDropdownData } from '../../../../utils/generatorUtils';
import { getLookupListApiThunk } from '../../../../redux/actions/LookUp.Action';
import { getFieldTypeSuggestion } from '../../../../axios/apiService/fieldTypeSuggestion.apiService';
import { getFieldAutocomplete } from '../../../../axios/apiService/fieldAutoComplete.apiService';
import DataListFieldBasicConfig from './DataListFieldBasicConfig';
import { REFERENCE_NAME_INSTRUCTION, SET_NON_EDITABLE_FIELD_DISABLED_INFO } from './FieldValue.strings';
import {
  createTaskSetState,
} from '../../../../redux/reducer/CreateTaskReducer';
import Link from '../../../form_components/link/Link';

let cancelForLabelSuggestion;
let cancelForFieldTypeSuggestion;
export const getCancelTokenForLabelSuggestion = (cancelToken) => {
  cancelForLabelSuggestion = cancelToken;
};
export const getCancelTokenForFieldTypeSuggestion = (cancelToken) => {
  cancelForFieldTypeSuggestion = cancelToken;
};
function BasicConfig(props) {
  const {
    parentModuleType,
    lookupLoadDataHandler,
    lookupListDropdown,
    getDataListPropertyApi,
  } = useContext(FormBuilderContext);
  const { t } = useTranslation();
  const { buttonColor } = useContext(ThemeContext);
  // const [suggestedWords, setSuggestedWords] = useState([]);
  const [isLoadingSuggestions, setSuggestionLoader] = useState(true);
  let fieldNameError = null;
  let defaultValueError = null;
  let uniqueColumnUuidError = null;
  let valuesError = null;
  const { BASIC_CONFIG } = FIELD_CONFIG(t);
  let configInputs = null;
  const {
    fieldType,
    fieldText,
    referenceName,
    onLabelChangeHandler,
    onLabelBlurHandler,
    error_list,
    datalist_selector_error_list,
    sectionId,
    fieldId,
    onDefaultChangeHandler,
    fieldData,
    onRequiredClickHandler,
    onReadOnlyClickHandler,
    onAddValues,
    isTableField,
    fieldListIndex,
    onGetLookupList,
    lookupHasMore,
    onLookupFieldChangeHandler,
    onDataListChangeHandler,
    onSetDataListSelectorErrorList,
    onDataListPropertyPickerChangeHandler,
    onSetDataListPropertyPickerErrorList,
    dispatch,
    dataListUuid,
    onlyAllowDropdownValueChange,
    getNewInputId,
    flowSections,
    datalistSections,
    isRequired,
    tableUuid,
    isNewField,
    fieldListType,
    userDatalistUuid,
    getRuleDetailsById,
  } = props;

  const { state, setState } = props;
  const [UnsortedlistDropDown, setUnsortedlistDropDown] = useState(
    !isEmpty(fieldData.values) ? getDropdownData(fieldData.values) : [],
  );

  const updateFieldTypeString = (fieldType) => {
    switch (fieldType) {
      case FIELD_TYPE.SINGLE_LINE:
      fieldType = t('form_field_strings.field_type.single_line');
      break;
      case FIELD_TYPE.PARAGRAPH:
      fieldType = t('form_field_strings.field_type.paragraph');
      break;
      case FIELD_TYPE.NUMBER:
      fieldType = t('form_field_strings.field_type.number');
      break;
      case FIELD_TYPE.EMAIL:
      fieldType = t('form_field_strings.field_type.email');
      break;
      case FIELD_TYPE.DATE:
      fieldType = t('form_field_strings.field_type.date');
      break;
      case FIELD_TYPE.FILE_UPLOAD:
      fieldType = t('form_field_strings.field_type.file_upload');
      break;
      case FIELD_TYPE.CURRENCY:
      fieldType = t('form_field_strings.field_type.currency');
      break;
      case FIELD_TYPE.DROPDOWN:
      fieldType = t('form_field_strings.field_type.dropdown');
      break;
      case FIELD_TYPE.CHECKBOX:
      fieldType = t('form_field_strings.field_type.checkbox');
      break;
      case FIELD_TYPE.RADIO_GROUP:
      fieldType = t('form_field_strings.field_type.radio_group');
      break;
      case FIELD_TYPE.CASCADING:
      fieldType = t('form_field_strings.field_type.cascading');
      break;
      case FIELD_TYPE.USER_TEAM_PICKER:
      fieldType = t('form_field_strings.field_type.user_team_picker');
      break;
      case FIELD_TYPE.USER_PROPERTY_PICKER:
      fieldType = t('form_field_strings.field_type.user_property_picker');
      break;
      case FIELD_TYPE.YES_NO:
      fieldType = t('form_field_strings.field_type.yes_no');
      break;
      case FIELD_TYPE.LINK:
      fieldType = t('form_field_strings.field_type.link');
      break;
      case FIELD_TYPE.INFORMATION:
      fieldType = t('form_field_strings.field_type.information');
      break;
      case FIELD_TYPE.SCANNER:
      fieldType = t('form_field_strings.field_type.barcodescanner');
      break;
      case FIELD_TYPE.CUSTOM_LOOKUP_CHECKBOX:
      fieldType = t('form_field_strings.field_type.custom_lookup_checkbox');
      break;
      case FIELD_TYPE.CUSTOM_LOOKUP_DROPDOWN:
      fieldType = t('form_field_strings.field_type.custom_lookup_dropdown');
      break;
      case FIELD_TYPE.CUSTOM_LOOKUP_RADIOBUTTON:
      fieldType = t('form_field_strings.field_type.custom_lookup_radiobutton');
      break;
      case FIELD_TYPE.DATETIME:
      fieldType = t('form_field_strings.field_type.datetime');
      break;
      case FIELD_TYPE.TIME:
      fieldType = t('form_field_strings.field_type.time');
      break;
      case FIELD_TYPE.USERS:
      fieldType = t('form_field_strings.field_type.users');
      break;
      case FIELD_TYPE.TEAMS:
      fieldType = t('form_field_strings.field_type.teams');
      break;
      case FIELD_TYPE.ADDRESS:
      fieldType = t('form_field_strings.field_type.address');
      break;
      case FIELD_TYPE.TABLE:
      fieldType = t('form_field_strings.field_type.table');
      break;
      case FIELD_TYPE.DATA_LIST:
      fieldType = t('form_field_strings.field_type.data_list');
      break;
      case FIELD_TYPE.DATA_LIST_PROPERTY_PICKER:
      fieldType = t('form_field_strings.field_type.data_list_property_picker');
      break;
      case FIELD_TYPE.PHONE_NUMBER:
      fieldType = t('form_field_strings.field_type.phone_number');
      break;
      default:
      break;
    }
    return fieldType;
  };
  const onAddValuesToList = async (event) => {
    await onAddValues(event);
    if (!isEmpty(event.target.value)) {
      const dropdownData = [];
      let list = event.target.value.split(',');
      if (list) list = Array.from(new Set(list));
      list.forEach((data) => {
        if (!isEmpty(data.trim())) {
          dropdownData.push({
            [DROPDOWN_CONSTANTS.OPTION_TEXT]: trimString(data),
            [DROPDOWN_CONSTANTS.VALUE]: data,
          });
        }
      });
      // const sortedDropdownData = sortBy(dropdownData, DROPDOWN_CONSTANTS.VALUE);
      setUnsortedlistDropDown(dropdownData);
    } else {
      setUnsortedlistDropDown([]);
    }
  };

  const onYesClickHandler = () => {
    if (state.field_type_data && state.field_type_data.data && state.field_type_data.data.field_type) {
      if (fieldType) {
        let values = EMPTY_STRING;
        if (!isEmpty(state.field_type_data.data.options)) {
          values = state.field_type_data.data.options.toString();
          onAddValuesToList({ target: { value: values } });
        }
        dispatch(createTaskSetState({ initial_field_type: fieldType, isSuggestedTypeSelected: true, suggested_field_type: state.field_type_data.data.field_type }));
      }

      setState({ isFieldSuggestionEnabled: false });
      let updatedFieldListIndex = ((fieldId - 1 === 0)) ? null : fieldListIndex;
      const taskSectionList = state.sections[sectionId - 1];
      const flowSectionList = flowSections[sectionId - 1];
      const datalistSectionList = datalistSections[sectionId - 1];
      let sectionType = 'section';
      if ((taskSectionList && taskSectionList.field_list[fieldListIndex] && taskSectionList.field_list[fieldListIndex].field_list_type && (taskSectionList.field_list[fieldListIndex].field_list_type === 'table')) || (
        flowSectionList && flowSectionList.field_list[fieldListIndex] && flowSectionList.field_list[fieldListIndex].field_list_type && (flowSectionList.field_list[fieldListIndex].field_list_type === 'table')) || (
          datalistSectionList && datalistSectionList.field_list[fieldListIndex] && datalistSectionList.field_list[fieldListIndex].field_list_type && (datalistSectionList.field_list[fieldListIndex].field_list_type === 'table'))
      ) {
        sectionType = 'TABLE';
        updatedFieldListIndex = fieldListIndex;
      }
      getNewInputId(
        sectionType,
        state.field_type_data.data.field_type,
        sectionId - 1,
        updatedFieldListIndex,
        fieldId - 1,
      );
    }
  };

  const onNoClickHandler = () => {
    setState({
      isFieldSuggestionEnabled: false,
      disableFieldTypeSuggestion: true,
    });
    dispatch(createTaskSetState({ isSuggestedTypeSelected: false, initial_field_type: fieldType, suggested_field_type: state.field_type_data && state.field_type_data.data && state.field_type_data.data.field_type ? state.field_type_data.data.field_type : null }));
  };

  useEffect(() => {
    getRuleDetailsById(true);
    if (fieldType === FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN) {
      const searchWithPaginationData = {
        page: INITIAL_PAGE,
        size: MAX_PAGINATION_SIZE,
      };
      onGetLookupList(searchWithPaginationData, false);
    }
    if ((fieldData && fieldData.origin_form) || (fieldData && fieldData.field_id)) {
      setState({
        disableFieldTypeSuggestion: true,
      });
    }
    return () => {
      if (cancelForLabelSuggestion) cancelForLabelSuggestion();
    };
  }, []);

  useEffect(() => {
    setUnsortedlistDropDown(getDropdownData(fieldData.values));
  }, [fieldData]);

  if (!isEmpty(error_list)) {
    Object.keys(error_list).forEach((id) => {
      if (id.includes('unique_column_uuid')) {
        uniqueColumnUuidError = SET_NON_EDITABLE_FIELD_DISABLED_INFO.ERROR;
      }
      if (id.includes('default_value')) {
        const idArray = id.split(',');

        if (
          parseInt(idArray[1], 10) === sectionId - 1 &&
          parseInt(idArray[3], 10) === fieldListIndex &&
          parseInt(idArray[5], 10) === fieldId - 1
        ) {
          defaultValueError = error_list[id];
        }
      }
      if (id.includes('field_name')) {
        const idArray = id.split(',');

        if (
          parseInt(idArray[1], 10) === sectionId - 1 &&
          parseInt(idArray[3], 10) === fieldListIndex &&
          parseInt(idArray[5], 10) === fieldId - 1
        ) {
          fieldNameError = error_list[id];
        }
      }
      if (id.includes('values')) {
        console.log('there is an id with field_name');
        const idArray = id.split(',');
        console.log('idarray,section id,field id', idArray, sectionId, fieldId);
        if (
          parseInt(idArray[1], 10) === sectionId - 1 &&
          parseInt(idArray[3], 10) === fieldListIndex &&
          parseInt(idArray[5], 10) === fieldId - 1
        ) { valuesError = error_list[id]; }
      }
    });
  }

  const suggestionListHandler = (word) => {
    const option_list = [];
    if (nullCheck(word, 'length', true)) {
      word.forEach((item) => {
        option_list.push({
          label: item,
          value: item,
        });
      });
    }
    return option_list;
  };

  // const [labelText, setlabelText] = useState('');
  const labelChangeAndSuggestionWrapper = (event) => {
    event.target.is_imported = fieldData.is_imported;
    onLabelChangeHandler(event);
    // setSuggestedWords([]);
    // setlabelText(event.target.value);
    dispatch(createTaskSetState({ initialTaskLabel: event.target.value, TaskLabel: event.target.value }));
    const data_format = {
      text: event.target.value,
      field_type: fieldType,
    };
    if (cancelForLabelSuggestion) {
      cancelForLabelSuggestion();
    }
    if (!isEmpty(event.target.value)) {
      setSuggestionLoader(true);
      getFieldAutocomplete(data_format, getCancelTokenForLabelSuggestion)
        .then((res) => {
          let result = [];
          let suggestionList = [];
          if (!isEmpty(res.next_word)) {
            suggestionList = suggestionListHandler(res.next_word);
            result = suggestionList.map((data) => data.value);
            // setSuggestedWords(suggestionList);
            setSuggestionLoader(false);
            dispatch(createTaskSetState({ field_autocomplete_suggestion: result, field_autocomplete_suggested_lable: event.target.value, autocompleteSuggestionList: suggestionList }));
          }
        })
        .catch((err) => {
          if (err && (err.code === 'ERR_CANCELED')) return;
          setSuggestionLoader(false);
          // setSuggestedWords([]);
          dispatch(createTaskSetState({ autocompleteSuggestionList: [] }));
        });
      if (fieldText.length <= 1) {
        dispatch(createTaskSetState({ field_type_data: [], isFieldSuggestionEnabled: false }));
      }
      if (cancelForFieldTypeSuggestion) {
        cancelForFieldTypeSuggestion();
      }
      if (!(state.disableFieldTypeSuggestion) && (!isEmpty(event.target.value)) && (event.target.value.length > 1)) {
        getFieldTypeSuggestion(data_format, getCancelTokenForFieldTypeSuggestion)
          .then((res) => {
            if (res.data.field_type) {
              dispatch(createTaskSetState({ field_type_data: res, isFieldSuggestionEnabled: true, intial_field_type: fieldType }));
            } else {
              dispatch(createTaskSetState({ field_type_data: [], isFieldSuggestionEnabled: false, intial_field_type: fieldType }));
            }
          })
          .catch((err) => {
            console.log('field type suggestion error', err);
          });
      }
    }
  };

  const onLookupSearchKeyHandler = (searchText) => {
   if (lookupLoadDataHandler) lookupLoadDataHandler(true, searchText);
  };

  let defaultInputLabel = isTableField
    ? BASIC_CONFIG.TABLE_FIELD.LABEL
    : BASIC_CONFIG.LABEL.LABEL;
  let readOnlyCheckBoxInfo;
  let disableReadOnlyCheckbox = false;
  const BLOCK_LIST_FIELDS = [FIELD_TYPES.INFORMATION, FIELD_TYPES.DATA_LIST_PROPERTY_PICKER, FIELD_TYPES.USER_PROPERTY_PICKER];
  if (fieldListType === FIELD_LIST_TYPE.TABLE) {
    let sections = [];
    if (parentModuleType === FORM_PARENT_MODULE_TYPES.TASK) sections = state.sections;
    else if (parentModuleType === FORM_PARENT_MODULE_TYPES.FLOW) sections = flowSections;
    else sections = datalistSections;
    const currentFieldList = get(sections, [(sectionId - 1), 'field_list', fieldListIndex], {});
    if (
      currentFieldList.table_validations &&
      currentFieldList.table_validations.is_unique_column_available &&
      (currentFieldList.table_validations.unique_column_uuid === fieldData.field_uuid)
    ) {
      disableReadOnlyCheckbox = true;
      readOnlyCheckBoxInfo = (
        <div className={gClasses.FOne11}>
          {SET_NON_EDITABLE_FIELD_DISABLED_INFO.INFO}
          {' '}
          <span style={{ color: buttonColor }} id={BASIC_CONFIG.READ_ONLY_HELPER_TEXT_ID}>{SET_NON_EDITABLE_FIELD_DISABLED_INFO.HELPER}</span>
          <Tooltip id={BASIC_CONFIG.READ_ONLY_HELPER_TEXT_ID} content={SET_NON_EDITABLE_FIELD_DISABLED_INFO.HELPER_TEXT} isCustomToolTip />
        </div>
      );
    }
  }
  const readOnlyCheckBox = (
    <CheckboxGroup
      optionList={BASIC_CONFIG.READ_ONLY}
      onClick={() => onReadOnlyClickHandler(!fieldData.read_only)}
      selectedValues={fieldData.read_only ? [1] : []}
      hideLabel
      disabled={disableReadOnlyCheckbox}
      instructionMessage={readOnlyCheckBoxInfo}
      errorMessage={uniqueColumnUuidError}
      instructionMessageClassName={gClasses.FOne11}
    />
  );

  switch (fieldType) {
    case FIELD_TYPES.DROPDOWN:
      configInputs = (
        <>
          <Input
            label={BASIC_CONFIG.DD_VALUES_INPUT.LABEL}
            id={BASIC_CONFIG.DD_VALUES_INPUT.ID}
            onChangeHandler={onAddValuesToList}
            value={fieldData.values}
            errorMessage={valuesError}
            placeholder={BASIC_CONFIG.DD_VALUES_INPUT.PLACEHOLDER}
            isRequired
          />
          <Dropdown
            optionList={UnsortedlistDropDown}
            // onChange={this.onSortDropdownChange}
            placeholder={BASIC_CONFIG.VALUES_DD.PLACEHOLDER}
            id={BASIC_CONFIG.VALUES_DD.ID}
            label={BASIC_CONFIG.VALUES_DD.LABEL}
            showNoDataFoundOption
            disablePopper
          />
          {!onlyAllowDropdownValueChange && readOnlyCheckBox}
        </>
      );
      break;
    case FIELD_TYPES.CUSTOM_LOOKUP_CHECKBOX:
    case FIELD_TYPES.CUSTOM_LOOKUP_RADIOBUTTON:
    case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
      const filteredList = lookupListDropdown.filter((v, i, a) => a.findIndex((t) => (t.label === v.label && t.value === v.value)) === i);
      configInputs = (
        <>
          <Dropdown
            optionList={filteredList}
            // onChange={this.onSortDropdownChange}
            placeholder={BASIC_CONFIG.VALUES_LOOKUP.PLACEHOLDER}
            id={BASIC_CONFIG.VALUES_LOOKUP.ID}
            label={BASIC_CONFIG.VALUES_LOOKUP.LABEL}
            showNoDataFoundOption
            isPaginated
            selectedValue={fieldData.selected_lookup_field}
            loadDataHandler={() => lookupLoadDataHandler()}
            onChange={onLookupFieldChangeHandler}
            hasMore={lookupHasMore}
            errorMessage={valuesError}
            strictlySetSelectedValue
            // fixedPopperStrategy={true}
            popperClasses={cx(styles.DropdownPopper, gClasses.ZIndex2)}
            disabled={!isUndefined(fieldData.field_uuid)}
            disablePopper
            enableSearch
            disableFocusFilter
            setSelectedValue
            onSearchInputChange={onLookupSearchKeyHandler}
            isRequired
          />
          <Input
            label={BASIC_CONFIG.LOOKUP_VALUES_INPUT.LABEL}
            id={BASIC_CONFIG.LOOKUP_VALUES_INPUT.ID}
            value={fieldData.values}
            onChangeHandler={onLookupFieldChangeHandler}
            placeholder={BASIC_CONFIG.LOOKUP_VALUES_INPUT.PLACEHOLDER}
            readOnly
          />
          {readOnlyCheckBox}
        </>
      );
      break;
    case FIELD_TYPES.RADIO_GROUP:
      configInputs = (
        <>
          <Input
            label={BASIC_CONFIG.DD_VALUES_INPUT.LABEL}
            id={BASIC_CONFIG.DD_VALUES_INPUT.ID}
            onChangeHandler={onAddValuesToList}
            value={fieldData.values}
            errorMessage={valuesError}
            placeholder={BASIC_CONFIG.DD_VALUES_INPUT.PLACEHOLDER}
            isRequired
          />
          <RadioGroup
            type={RADIO_GROUP_TYPE.TYPE_6}
            optionList={UnsortedlistDropDown}
            placeholder={BASIC_CONFIG.VALUES_RB.PLACEHOLDER}
            id={BASIC_CONFIG.VALUES_RB.ID}
            label={BASIC_CONFIG.VALUES_RB.LABEL}
            showNoDataFoundOption
            isGridViewClass
          />
          {readOnlyCheckBox}
        </>
      );
      break;
    case FIELD_TYPES.CHECKBOX:
      configInputs = (
        <>
          <Input
            label={BASIC_CONFIG.CB_VALUES.LABEL}
            placeholder={BASIC_CONFIG.CB_VALUES.PLACEHOLDER}
            id={BASIC_CONFIG.CB_VALUES.ID}
            onChangeHandler={onAddValuesToList}
            value={fieldData.values}
            errorMessage={valuesError}
            isRequired
          />
          <Dropdown
            optionList={UnsortedlistDropDown}
            // onChange={this.onSortDropdownChange}
            placeholder={BASIC_CONFIG.ITEMS_LIST_CB.PLACEHOLDER}
            id={BASIC_CONFIG.ITEMS_LIST_CB.ID}
            label={BASIC_CONFIG.ITEMS_LIST_CB.LABEL}
            showNoDataFoundOption
            disablePopper
          />
          {readOnlyCheckBox}
        </>
      );
      break;
    case FIELD_TYPES.YES_NO:
      configInputs = readOnlyCheckBox;
      defaultInputLabel = BASIC_CONFIG.YES_NO_QUESTION;
      break;
    case FIELD_TYPES.SINGLE_LINE:
    case FIELD_TYPES.PARAGRAPH:
    case FIELD_TYPES.NUMBER:
    case FIELD_TYPES.USER_TEAM_PICKER:
    case FIELD_TYPES.DATETIME:
    case FIELD_TYPES.DATE:
    case FIELD_TYPES.CURRENCY:
    case FIELD_TYPES.FILE_UPLOAD:
    case FIELD_TYPES.LINK:
    case FIELD_TYPES.PHONE_NUMBER:
    case FIELD_TYPES.EMAIL:
    case FIELD_TYPES.SCANNER:
      configInputs = readOnlyCheckBox;
      break;
    case FIELD_TYPES.INFORMATION:
      configInputs = (
        <div className={gClasses.MB5}>
          <InfoField
            errorMessage={defaultValueError}
            label={t('form_field_strings.form_field_constants.info_content')}
            onChangeHandler={onDefaultChangeHandler}
            description={fieldData.default_value}
          />
        </div>
      );
      break;
    case FIELD_TYPES.DATA_LIST:
      configInputs = (
        <>
          <DataListFieldBasicConfig
            sectionIndex={sectionId - 1}
            fieldIndex={fieldId - 1}
            fieldListIndex={fieldListIndex}
            errorList={error_list}
            datalist_selector_error_list={datalist_selector_error_list}
            onDataListChangeHandler={onDataListChangeHandler}
            onSetDataListSelectorErrorList={onSetDataListSelectorErrorList}
            dataListUuid={dataListUuid}
            disableDataListPicker={!isNewField}
            isNewField={isNewField}
            selectedDataList={get(
              fieldData,
              [FIELD_KEYS.DATA_LIST],
              {},
            )}
            fieldType={FIELD_TYPES.DATA_LIST}
          />
          {readOnlyCheckBox}
        </>
      );
      break;
    case FIELD_TYPES.DATA_LIST_PROPERTY_PICKER:
      configInputs = (
        <DataListFieldBasicConfig
        sectionIndex={sectionId - 1}
        fieldIndex={fieldId - 1}
        fieldListIndex={fieldListIndex}
        errorList={error_list}
        datalist_selector_error_list={datalist_selector_error_list}
        onDataListChangeHandler={onDataListPropertyPickerChangeHandler}
        onSetDataListSelectorErrorList={onSetDataListPropertyPickerErrorList}
        dataListUuid={dataListUuid}
        selectedDataListProperty={get(
          fieldData,
          [FIELD_KEYS.PROPERTY_PICKER_DETAILS],
          {},
        )}
        fieldType={FIELD_TYPES.DATA_LIST_PROPERTY_PICKER}
        getDataListPropertyApi={getDataListPropertyApi}
        fieldNameError={fieldNameError}
        onLabelChangeHandler={labelChangeAndSuggestionWrapper}
        fieldLabel={fieldText}
        isTable={isTableField}
        tableUuid={tableUuid}
        disableAll={!isNewField}
        isNewField={isNewField}
        />
      );
      break;
    case FIELD_TYPES.USER_PROPERTY_PICKER:
      configInputs = (
        <DataListFieldBasicConfig
        sectionIndex={sectionId - 1}
        fieldIndex={fieldId - 1}
        fieldListIndex={fieldListIndex}
        errorList={error_list}
        datalist_selector_error_list={datalist_selector_error_list}
        onDataListChangeHandler={onDataListPropertyPickerChangeHandler}
        onSetDataListSelectorErrorList={onSetDataListPropertyPickerErrorList}
        dataListUuid={dataListUuid}
        selectedDataListProperty={get(
          fieldData,
          [FIELD_KEYS.PROPERTY_PICKER_DETAILS],
          {},
        )}
        fieldType={FIELD_TYPES.USER_PROPERTY_PICKER}
        getDataListPropertyApi={getDataListPropertyApi}
        fieldNameError={fieldNameError}
        onLabelChangeHandler={labelChangeAndSuggestionWrapper}
        fieldLabel={fieldText}
        isTable={isTableField}
        tableUuid={tableUuid}
        disableAll={!isNewField}
        isNewField={isNewField}
        isUserPropertyPicker
        userDatalistUuid={userDatalistUuid}
        />
      );
      break;
    default:
      break;
  }

  return (
    <>
      {
        !BLOCK_LIST_FIELDS.includes(fieldType) && (
          <Dropdown
            id="field-name"
            label={defaultInputLabel}
            onChange={labelChangeAndSuggestionWrapper}
            onBlurHandler={onLabelBlurHandler}
            selectedValue={fieldText}
            errorMessage={fieldNameError}
            isRequired
            optionList={isLoadingSuggestions ? [] : state.autocompleteSuggestionList}
            disableFocusFilter
            // showNoDataFoundOption
            disablePopper
            strictlySetSelectedValue
            isTextInputDropdown
            onlyAllowDropdownValueChange={onlyAllowDropdownValueChange}
            dropdownListClasses={styles.DropdownListStyle}
            onFocusHandler={(event) => {
              // const data_format = {
              //   text: event.target.value,
              // };
              if (!isEmpty(event.target.value)) {
                if (cancelForLabelSuggestion) {
                  cancelForLabelSuggestion();
                }
                // getFieldAutocomplete(data_format, getCancelTokenForLabelSuggestion)
                //   .then((res) => {
                //     if (!isEmpty(res.next_word))
                //       setSuggestedWords(suggestionListHandler(res.next_word));
                //     // processing the recieved list as object
                //     else setSuggestedWords([]);
                //   })
                //   .catch((err) => {
                //     console.log('label autocomplete focus error', err);
                //   });
              }
            }}
          />
        )}
      <div>
        {(
          (fieldText.length > 1) &&
          (!state.disableFieldTypeSuggestion) &&
          state.isFieldSuggestionEnabled &&
          state.field_type_data &&
          state.field_type_data.data &&
          state.field_type_data.data.field_type !== fieldType
        ) && (
            <div
              className={cx(
                gClasses.FOne13GrayV14,
                gClasses.MB15,
                gClasses.ML5,
              )}
            >
              {`${t('form_field_strings.field_config.the')} '${updateFieldTypeString(get(state, ['field_type_data', 'data', 'field_type'], null))}' ${t('form_field_strings.field_config.form_field_suggestion')}`}
              <Link
                className={cx(gClasses.FTwo13, gClasses.ML5)}
                onClick={onYesClickHandler}
              >
                {t('form_field_strings.field_config.required.yes')}
              </Link>
              {' or '}
              <Link
                className={cx(gClasses.FTwo13)}
                onClick={onNoClickHandler}
              >
                {t('form_field_strings.field_config.required.no')}
              </Link>
            </div>
          )
        }
      </div>
      {
        (fieldData.field_id && !BLOCK_LIST_FIELDS.includes(fieldType)) ? (
          <Input
            id={BASIC_CONFIG.REFERENCE_NAME.ID}
            label={BASIC_CONFIG.REFERENCE_NAME.LABEL}
            value={referenceName}
            readOnly
            helperToolTipId="ReferenceNameTooltip"
            helperTooltipMessage={t(REFERENCE_NAME_INSTRUCTION)}
            tooltipPlaceholder="right"
          />
        ) : null
      }
      {configInputs}
      {
        !BLOCK_LIST_FIELDS.includes(fieldType) && !fieldData.read_only && (
          <RadioGroup
            id={BASIC_CONFIG.REQUIRED.id}
            label={BASIC_CONFIG.REQUIRED.label}
            className={gClasses.MT12}
            optionList={BASIC_CONFIG.REQUIRED.OPTION_LIST}
            onClick={(value) => onRequiredClickHandler(value)}
            selectedValue={isRequired}
            type={RADIO_GROUP_TYPE.TYPE_1}
            innerClassName={BS.D_BLOCK}
          />
        )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    // createTaskServerError: state.CreateTaskReducer.server_error,
    // createFlowServerError: state.EditFlowReducer.server_error,
    lookupHasMore: state.LookUpReducer.hasMore,
    state: state.CreateTaskReducer,
    flowSections: state.EditFlowReducer.flowData.sections,
    datalistSections: state.CreateDataListReducer.sections,
    userDatalistUuid: state.UserProfileReducer.user_data_list_uuid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetLookupList: (params, isPaginatedData) => {
      dispatch(getLookupListApiThunk(params, isPaginatedData));
    },
    setState: (value) => dispatch(createTaskSetState(value)),
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasicConfig);
BasicConfig.defaultProps = {
  fieldType: EMPTY_STRING,
  fieldText: EMPTY_STRING,
  error_list: {},
  fieldData: {},
  onAddValues: null,
  onDefaultChangeHandler: null,
  onRequiredClickHandler: null,
  onReadOnlyClickHandler: null,
  onLabelChangeHandler: null,
  onLabelBlurHandler: null,
  isTableField: false,
  onlyAllowDropdownValueChange: false,
  getNewInputId: null,
};
BasicConfig.propTypes = {
  fieldType: PropTypes.string,
  fieldText: PropTypes.string,
  onLabelChangeHandler: PropTypes.func,
  onLabelBlurHandler: PropTypes.func,
  error_list: PropTypes.objectOf(PropTypes.any),
  fieldData: PropTypes.objectOf(PropTypes.any),
  sectionId: PropTypes.number.isRequired,
  fieldId: PropTypes.number.isRequired,
  onDefaultChangeHandler: PropTypes.func,
  onRequiredClickHandler: PropTypes.func,
  onReadOnlyClickHandler: PropTypes.func,
  onAddValues: PropTypes.func,
  isTableField: PropTypes.bool,
  onlyAllowDropdownValueChange: PropTypes.bool,
  getNewInputId: PropTypes.func,
};
