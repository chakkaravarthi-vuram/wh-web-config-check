import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { connect } from 'react-redux';
import DatePicker from 'components/form_components/date_picker/DatePicker';
import { ARIA_ROLES, BS } from 'utils/UIConstants';
import { getLanguageAndCalendarDataThunk } from 'redux/actions/LanguageAndCalendarAdmin.Action';
import FormBuilderContext from 'components/form_builder/FormBuilderContext';
import { getVisibilityExternalFieldsDropdownList, getVisibilityExternalFieldsHasMore, getVisibilityExternalFieldsLoadingStatus, getVisibilityExternalFieldsPaginationDetails } from 'redux/reducer';
import { FIELD_LIST_TYPE } from 'utils/ValidationConstants';
import HelperMessage from 'components/form_components/helper_message/HelperMessage';
import HELPER_MESSAGE_TYPE from 'components/form_components/helper_message/HelperMessage.strings';
import { evaluateAriaLabelMessage } from 'utils/UtilityFunctions';
import { updateFlowStateChange } from 'redux/reducer/EditFlowReducer';
import { EXLCUDING_NUMBER_CHARACTERS } from 'utils/Constants';
import { useHistory } from 'react-router';
import Input from '../../../form_components/input/Input';
import CheckboxGroup from '../../../form_components/checkbox_group/CheckboxGroup';
import RadioGroup, { RADIO_GROUP_TYPE } from '../../../form_components/radio_group/RadioGroup';
import DAY_LIST from '../../../form_components/day_picker/DayPicker.strings';
import { FIELD_CONFIG, FIELD_TYPES, DATA_LIST_VISIBILITY, DATE_FIELDS_OPERATOR_VALUES } from '../../FormBuilder.strings';
import {
  EMPTY_STRING,
  DROPDOWN_CONSTANTS,
  COMMA,
  SPACE,
} from '../../../../utils/strings/CommonStrings';
import gClasses from '../../../../scss/Typography.module.scss';

import AddMembers from '../../../member_list/add_members/AddMembers';
import Dropdown from '../../../form_components/dropdown/Dropdown';
import { getAccountConfigurationDetailsApiService } from '../../../../axios/apiService/accountConfigurationDetailsAdmin.apiService';
import jsUtils, { cloneDeep, isEmpty } from '../../../../utils/jsUtility';
import styles from '../FieldConfig.module.scss';
import {
  getValidationTabUserTeamPickerSelectedData,
  userTeamPickerChangeHandler,
} from '../../../../utils/formUtils';
import { USER_TEAM_PICKER_CHANGE_HANDLER_TYPES } from '../../../../utils/constants/form.constant';
import { getDateValidationData } from '../FieldConfig.utils';
import DataListPickerFilter from './datalistpicker_filter/DataListPickerFilter';
import { DL_PICKER_FILTER_STRING } from './datalistpicker_filter/DatalistPickerFilter.string';
import { NON_PRIVATE_TEAMS_PARAMS } from '../../../../containers/edit_flow/EditFlow.utils';
import { isBasicUserMode } from '../../../../utils/UtilityFunctions';

function ValidationConfig(props) {
  const { t } = useTranslation();
  const { VALIDATION_CONFIG } = FIELD_CONFIG(t);
  const history = useHistory();
  const isNormalMode = isBasicUserMode(history);
  const {
    onValidationConfigChangeHandler,
    onValidationConfigBlurHandler,
    fieldData,
    fieldType,
    error_list,
    working_days,
    externalFieldsDropdownList,
    hasMoreFields,
    externalFieldsPaginationDetails,
    externalFieldsDropdownData,
    isExternalFieldsLoading,
    sectionIndex,
    fieldListIndex,
    fieldIndex,
    isTableField,
    updateFlowState,
    isTaskForm,
    taskId,
    stepOrder,
    isDataListForm,
  } = props;
  const {
    getVisibilityExternalFields,
  } = useContext(FormBuilderContext);
  let maximumFileSizeError = null;
  let linkDefaultValueError = EMPTY_STRING;
  let linkCountDefaultError = EMPTY_STRING;
  let minCharErrorMessage = EMPTY_STRING;
  let maxCharErrorMessage = EMPTY_STRING;
  let minNumberErrorMessage = EMPTY_STRING;
  let maxNumberErrorMessage = EMPTY_STRING;
  let minCountErrorMessage = EMPTY_STRING;
  let maxCountErrorMessage = EMPTY_STRING;
  let userTeamPickerErrorMessage = EMPTY_STRING;
  let dateValidationMaxValueError = EMPTY_STRING;
  let dateValidationMinValueError = EMPTY_STRING;
  let startDateError = EMPTY_STRING;
  let endDateError = EMPTY_STRING;
  let operatorError = EMPTY_STRING;
  let firstFieldError = EMPTY_STRING;
  let secondFieldError = EMPTY_STRING;
  let maxUserErrorMessage = EMPTY_STRING;
  let minUserErrorMessage = EMPTY_STRING;
  let maxDocErrorMessage = EMPTY_STRING;
  let minDocErrorMessage = EMPTY_STRING;
  let allowedCurrencyTypeErrorMessage = EMPTY_STRING;
  let decimalPointErrorMessage = EMPTY_STRING;

  const [workingDaysString, setWorkingDaysString] = useState(EMPTY_STRING);
  const [configuredMaxFileSize, setConfiguredMaxFileSize] = useState(0);
  const [fieldValueData, setFieldValueData] = useState([]);
  console.log('Error list is', error_list, fieldData);
  console.log(fieldData.validations.maximum_file_size);
  console.log(
    configuredMaxFileSize,
    configuredMaxFileSize > 1,
    fieldData.validations.maximum_file_size > configuredMaxFileSize,
  );

  const [allowed_currency_types, setAllowedCurrencyTypes] = useState(
    fieldData.validations.allowed_currency_types
      ? fieldData.validations.allowed_currency_types
      : [],
  );
  const [allowedCurrencyList, setAllowedCurrencyList] = useState([]);
  const [adminAllowedCurrencyList, setAdminAllowedCurrencyList] = useState([]);
  const [defaultCurrencyType, setDefaultCurrencyType] = useState(EMPTY_STRING);
  const [allowedCurrencyErrorText, setAllowedCurrencyErrorText] =
    useState(EMPTY_STRING);
  const loadAllFields = (page) => {
    const paginationData = {
      // search: '',
      page: page || 1,
      size: 30,
      field_list_type: FIELD_LIST_TYPE.DIRECT,
      // sort_field: '',
      sort_by: 1,
      allowed_field_types: [FIELD_TYPES.DATETIME, FIELD_TYPES.DATE],
    };
    getVisibilityExternalFields(paginationData);
  };
  useEffect(() => {
    if (fieldType === FIELD_TYPES.DATA_LIST && !jsUtils.isEmpty(fieldData.validations.filter_fields)) {
      onValidationConfigChangeHandler({
        target: {
          id: VALIDATION_CONFIG.LIMIT_DATALIST.IS_DATALIST_FILTER,
          value: true,
        },
      });
    } else if (fieldType === FIELD_TYPES.DATA_LIST) {
      console.log('responsecheckdefault useEffect', fieldType);
      onValidationConfigChangeHandler({
        target: {
          id: VALIDATION_CONFIG.LIMIT_DATALIST.IS_DATALIST_FILTER,
          value: false,
        },
      });
    }
    if (
      fieldType === FIELD_TYPES.CURRENCY ||
      fieldType === FIELD_TYPES.FILE_UPLOAD ||
      fieldType === FIELD_TYPES.DATA_LIST
    ) {
      getAccountConfigurationDetailsApiService().then(
        (response) => {
          console.log('responsecheckdefault', response);
          if (
            fieldType === FIELD_TYPES.CURRENCY &&
            response.allowed_currency_types
          ) {
            // setAllowedCurrencyTypes(response.allowed_currency_types);
            setAllowedCurrencyList(response.allowed_currency_types);
            setAdminAllowedCurrencyList(response.allowed_currency_types);
          }
          if (
            fieldType === FIELD_TYPES.DATA_LIST &&
            response.allowed_currency_types
          ) {
            setAllowedCurrencyList(response.allowed_currency_types);
            setDefaultCurrencyType(response.default_currency_type || '');
          }
          if (
            fieldType === FIELD_TYPES.FILE_UPLOAD &&
            response.maximum_file_size
          ) {
            setConfiguredMaxFileSize(response.maximum_file_size);
            updateFlowState({
              isGetAccountConfigLoading: false,
              accountDetails: response,
            });
          }
        },
        (error) => {
          console.log(error);
        },
      );
    } else if (
      fieldType === FIELD_TYPES.DATE ||
      fieldType === FIELD_TYPES.DATETIME
    ) {
      loadAllFields();
      const { getLanguageAndCalendarData } = props;
      getLanguageAndCalendarData();
    }
  }, []);
  useEffect(() => {
    if (!jsUtils.isEmpty(working_days)) {
      const workingDaysStringArray = [];
      DAY_LIST(t).map((day) => {
        if (working_days.some((selectedDay) => day.VALUE === selectedDay)) {
          workingDaysStringArray.push(day.SUBTITLE);
        }
        return null;
      });
      const string = workingDaysStringArray.join(COMMA + SPACE);
      setWorkingDaysString(string);
    }
  }, [working_days]);
  const onNumberInputChange = (event) => {
    const { value } = event.target;
    if (value === '') {
      onValidationConfigChangeHandler(event);
    } else if (/^(?!0)\d+$/.test(value)) {
      onValidationConfigChangeHandler({
        target: {
          id: event.target.id,
          value: Number(value),
        },
      });
    }
  };
  const onNumberInputBlur = (event) => {
    const { value } = event.target;
    if (value === '') {
      onValidationConfigBlurHandler && onValidationConfigBlurHandler(event);
    } else if (/^(?!0)\d+$/.test(event.target.value)) {
      onValidationConfigBlurHandler && onValidationConfigBlurHandler({
        target: {
          id: event.target.id,
          value: Number(value),
        },
      });
    }
  };

  const invalidNumericHandler = (event) => {
    EXLCUDING_NUMBER_CHARACTERS.includes(event.key) && event.preventDefault();
  };

  const onLoadMoreFieldsCallHandler = () => {
    if (!isExternalFieldsLoading && externalFieldsDropdownData.pagination_details[0] && externalFieldsDropdownData.pagination_data) {
      if (externalFieldsDropdownData.pagination_details[0].total_count > externalFieldsDropdownData.pagination_data.length) {
        const page = jsUtils.get(externalFieldsPaginationDetails, ['page'], 0) + 1;
        loadAllFields(page);
      }
    }
  };
  Object.keys(error_list).forEach((id) => {
    if (id.includes('default_value')) {
      if (fieldType === FIELD_TYPES.LINK) {
        if (jsUtils.get(fieldData, [
          'validations',
          VALIDATION_CONFIG.ALLOW_MULTIPLE_LINKS.ID,
        ])) {
          const minLinkCount = jsUtils.get(fieldData, [
            'validations',
            VALIDATION_CONFIG.MINIMUM_COUNT.ID,
          ], null);
          const maxLinkCount = jsUtils.get(fieldData, [
            'validations',
            VALIDATION_CONFIG.MAXIMUM_COUNT.ID,
          ], null);
          if (minLinkCount && (minLinkCount > 0) && fieldData.default_value.length < minLinkCount) {
            minCountErrorMessage = fieldData.default_value.length === 1 ?
            t('validation_constants.utility_constant.update_min_link_count_one') :
            `${t('validation_constants.utility_constant.only')} ${fieldData.default_value.length} ${t('validation_constants.utility_constant.update_min_count')}`;
          }
          if (maxLinkCount && (maxLinkCount > 0) && fieldData.default_value.length > maxLinkCount) {
            linkCountDefaultError = `${fieldData.default_value.length} ${t(t('validation_constants.utility_constant.link_added_as_default'))}`;
          }
        } else {
          linkDefaultValueError = t('validation_constants.utility_constant.multiple_link_added');
        }
      }
    } else if (id.includes('maximum_selection') && error_list[id].includes('required')) {
      console.log('maxminrequired0');
      maxUserErrorMessage = t('validation_constants.utility_constant.max_user_count');
    }
    if (id.includes('maximum_count') && error_list[id].includes('required') &&
      fieldData.field_type === FIELD_TYPES.FILE_UPLOAD && !error_list[id].includes('minimum_count')) {
      console.log('maxminrequired0');
      maxDocErrorMessage = t('validation_constants.utility_constant.max_file_count');
    }
    if (id.includes('minimum_selection') && error_list[id].includes('required')) {
      console.log('maxminrequired1');
      minUserErrorMessage = t('validation_constants.utility_constant.minimum_allowed_user_count_req');
    }
    if (id.includes('minimum_count') && error_list[id].includes('required') &&
      fieldData.field_type === FIELD_TYPES.FILE_UPLOAD && !error_list[id].includes('maximum_count')) {
      console.log('maxminrequired0');
      minDocErrorMessage = t('validation_constants.utility_constant.min_file_count');
    }
    if (id.includes('minimum_characters')) {
      if (error_list[id].includes('must be a safe number')) {
        minCharErrorMessage = `${t('form_field_strings.validation_config.minimum_characters.label')} ${t('validation_constants.utility_constant.safe_number')}`;
      } else minCharErrorMessage = t('validation_constants.utility_constant.min_eqaul_to_one');
    }
    if (id.includes('maximum_characters')) {
      if (
        error_list[id].includes('maximum_characters must be greater than 0')
      ) {
        maxCharErrorMessage = t('validation_constants.utility_constant.greate_than_0');
      } else if (error_list[id].includes('must be a safe number')) {
        maxCharErrorMessage = `${t('form_field_strings.validation_config.maximum_characters.label')} ${t('validation_constants.utility_constant.safe_number')}`;
      } else {
        maxCharErrorMessage =
          t('validation_constants.utility_constant.maximum_reater_than_minimum');
      }
    }
    if (id.includes('minimum_count') && fieldData.field_type === FIELD_TYPES.LINK) {
      if (!error_list[id].includes('maximum_count')) {
      minCountErrorMessage = t('validation_constants.utility_constant.min_link_count');
      }
    }
    if (id.includes('maximum_count') && fieldData.field_type === FIELD_TYPES.LINK) {
      maxCountErrorMessage = t('validation_constants.utility_constant.max_link_count');
    }
    if (id.includes(VALIDATION_CONFIG.MAXIMUM_COUNT_DATA_LIST.ID)) {
      maxCountErrorMessage = t('validation_constants.utility_constant.max_selection');
    }
    if (id.includes('allowed_minimum')) {
      minNumberErrorMessage = error_list[id];
      // 'Minimum value should be greater than or equal to 1';
    }
    if (id.includes('allowed_maximum')) {
      maxNumberErrorMessage = error_list[id];
      // 'Maximum value should be greater than 0 or equal to minimum value.';
    }
    if (id.includes('allowed_decimal_points')) {
      decimalPointErrorMessage = error_list[id];
    }
    if (id.includes('maximum_selection') && error_list[id].includes('greater than or equal to ref')) {
      maxUserErrorMessage = t('validation_constants.utility_constant.max_allowed_user_tham_min');
    }
    if (id.includes('maximum_selection') && error_list[id].includes('greater than or equal to 1')) {
      console.log('max_selection min123');
      maxUserErrorMessage = t('validation_constants.utility_constant.max_allowed_user');
    }
    if (id.includes('maximum_count') && error_list[id].includes('greater than or equal to ref') && fieldData.field_type === FIELD_TYPES.FILE_UPLOAD) {
      maxDocErrorMessage = t('validation_constants.utility_constant.maximium_file_count_greater_than_min');
    }
    if (id.includes('maximum_count') && error_list[id].includes('greater than or equal to 1') && fieldData.field_type === FIELD_TYPES.FILE_UPLOAD) {
      maxDocErrorMessage = t('validation_constants.utility_constant.maximium_file_count');
    }
    if (id.includes('minimum_selection') && error_list[id].includes('greater than or equal to 1')) {
      console.log('max_selection min123123');
      minUserErrorMessage = t('validation_constants.utility_constant.minimum_allowed_user_count');
    }
    if (id.includes('minimum_count') && error_list[id].includes('greater than or equal to 1') && fieldData.field_type === FIELD_TYPES.FILE_UPLOAD) {
      minDocErrorMessage = t('validation_constants.utility_constant.minimum_allowed_user_count');
    }
    if (id.includes('maximum_file_size')) {
      maximumFileSizeError = error_list[id];
    }
    // if( typeof )
    if (
      typeof error_list[id] === 'string' &&
      error_list[id].includes('peers')
    ) {
      if (
        jsUtils.get(
          fieldData,
          ['validations', VALIDATION_CONFIG.MINIMUM_COUNT.ID],
          null,
        ) === null
      ) {
        minCountErrorMessage = t('validation_constants.utility_constant.minimum_link');
      } else if (
        jsUtils.get(
          fieldData,
          ['validations', VALIDATION_CONFIG.MAXIMUM_COUNT.ID],
          null,
        ) === null
      ) {
        maxCountErrorMessage = t('validation_constants.utility_constant.maximum_link');
      }
    }
    if (
      typeof error_list[id] === 'string' &&
      error_list[id].includes('validations.restricted_user_team')
    ) {
      if (error_list[id].includes('teams is required')) userTeamPickerErrorMessage = t('validation_constants.utility_constant.one_team_required');
      if (error_list[id].includes('at least one of [users, teams]')) userTeamPickerErrorMessage = t('validation_constants.utility_constant.one_user_team_required');
    }
    if (id.includes('start_day')) {
      dateValidationMinValueError = error_list[id];
    }
    if (id.includes('end_day')) {
      dateValidationMaxValueError = error_list[id];
    }
    if (id.includes('first_field_uuid')) {
      firstFieldError = error_list[id];
    }
    if (id.includes('second_field_uuid')) {
      secondFieldError = error_list[id];
    }
    if (id.includes('operator')) {
      operatorError = 'Operator is required';
    }
    if (id.includes('start_date')) {
      startDateError = error_list[id];
    }
    if (id.includes('end_date')) {
      endDateError = error_list[id];
    }
  });
  if (fieldData.validations.maximum_file_size) {
    if (fieldData.validations.maximum_file_size > configuredMaxFileSize && configuredMaxFileSize > 0) {
      maximumFileSizeError = `Limit exceeded.Maximum allowed is ${configuredMaxFileSize}MB `;
    }
  }
  if (fieldData.validations.allowed_currency_types) {
    if (!isEmpty(adminAllowedCurrencyList) && !fieldData.validations.allowed_currency_types.every((elem) => adminAllowedCurrencyList.includes(elem))) {
      const notAllowedTypes = fieldData.validations.allowed_currency_types.filter((x) => !adminAllowedCurrencyList.includes(x));
      allowedCurrencyTypeErrorMessage = `${notAllowedTypes.toString()} isn't displayed as a currency type for your account, contact the admin to add it.`;
    }
  }
  const getDropdownData = (list) => {
    const dropdownData = [];
    if (!jsUtils.isEmpty(list)) {
      list.map((data) => {
        dropdownData.push({
          [DROPDOWN_CONSTANTS.OPTION_TEXT]: data,
          [DROPDOWN_CONSTANTS.VALUE]: data,
        });
        return data;
      });
    }
    console.log(dropdownData);
    return dropdownData;
  };

  const getAccountConfigData = () => {
    // const { dispatch } = props;
    // dispatch(getAccountConfigurationDetailsThunk());
  };

  const [allowed_extensions, setAllowedFileExtensions] = useState(
    fieldData.validations.allowed_extensions
      ? fieldData.validations.allowed_extensions
      : [],
  );

  const [currencyTypeSearchValue, setCurrencyTypeSearchValue] = useState(EMPTY_STRING);
  const onAddCurrencyExtensionHandler = (event) => {
    setAllowedCurrencyErrorText(EMPTY_STRING);
    console.log(event.target.value);
    if (
      allowed_currency_types &&
      allowed_currency_types.some((value) => value === event.target.value.code)
    ) {
      // to preserve the conditions keeping this block
    } else {
      const allowedCurrencyTypes = [
        ...allowed_currency_types,
        event.target.value.code,
      ];
      setAllowedCurrencyTypes(allowedCurrencyTypes);
      onValidationConfigChangeHandler({
        target: {
          id: VALIDATION_CONFIG.ALLOWED_CURRENCY_TYPES.ID,
          value: allowedCurrencyTypes,
        },
      });
    }
    setAllowedCurrencyList(allowedCurrencyList.filter((value) => value !== event.target.value.code));
  };
  const onAddFileExtensionHandler = (event) => {
    console.log('eventevent', event);
    const allowedExtensions = jsUtils.cloneDeep(allowed_extensions);
    const index = allowedExtensions.indexOf(event.target.value);
    if (index >= 0) {
      allowedExtensions.splice(index, 1);
    } else {
      allowedExtensions.push(event.target.value);
    }
    console.log('eventevent', allowedExtensions);
    setAllowedFileExtensions(allowedExtensions);
    onValidationConfigChangeHandler({
      target: {
        id: VALIDATION_CONFIG.ALLOWED_FILE_EXTENSIONS.ID,
        value: allowedExtensions,
      },
    });
  };
  const onRemoveCurrencyExtensionHandler = (value) => {
    if (adminAllowedCurrencyList.includes(value) && !allowedCurrencyList.includes(value)) {
      allowedCurrencyList.push(value);
      setAllowedCurrencyList(allowedCurrencyList);
    }
    setAllowedCurrencyErrorText(EMPTY_STRING);
    if (
      jsUtils.isObject(fieldData.default_value) &&
      value === fieldData.default_value.currency_type
    ) {
      setAllowedCurrencyErrorText(
        `Can not remove currency type - ${value}, because ${value} is set as default currency type`,
      );
      return true;
    }
    if (value === fieldData.validations.default_currency_type) {
      onValidationConfigChangeHandler({
        target: {
          id: VALIDATION_CONFIG.DEFAULT_CURRENCY_TYPE.ID,
          value: EMPTY_STRING,
        },
      });
    }
    const allowedCurrencyTypes = [...allowed_currency_types];
    const index = allowedCurrencyTypes.indexOf(value);
    if (index !== -1) allowedCurrencyTypes.splice(index, 1);
    setAllowedCurrencyTypes(allowedCurrencyTypes);
    onValidationConfigChangeHandler({
      target: {
        id: VALIDATION_CONFIG.ALLOWED_CURRENCY_TYPES.ID,
        value: allowedCurrencyTypes,
      },
    });
    return false;
  };
  const [isSCIVisible, onSpecialCharactersCBClick] = useState(
    jsUtils.get(fieldData, ['validations', 'allowed_special_characters']) ||
    false,
  );

  const setLimitDataListValues = (
    actionType = null,
  ) => {
    const FILTER_FIELD_INITIAL_STATE_OBJECT = {
      field_uuid: '',
      field_type: '',
      operator: '',
      field_value: '',
    };
    const validations = cloneDeep(fieldData.validations);
    const isSwitchEnabled = jsUtils.get(fieldData, ['validations', 'is_datalist_filter'], false);
    const filter_fields = jsUtils.get(fieldData, ['validations', 'filter_fields'], []);
    switch (actionType) {
      case DATA_LIST_VISIBILITY.ACTIONS.ENABLE_LIMIT_SWITCH:
        if (!isSwitchEnabled) {
          validations.is_datalist_filter = !isSwitchEnabled;
          validations.filter_fields = [FILTER_FIELD_INITIAL_STATE_OBJECT];
        } else {
          validations.is_datalist_filter = !isSwitchEnabled;
          (jsUtils.has(validations, ['filter_fields'], false) && (delete validations.filter_fields));
        }
        break;
      case DATA_LIST_VISIBILITY.ACTIONS.ADD_CONDITION:
        if (jsUtils.isEmpty(filter_fields)) {
          validations.filter_fields = [FILTER_FIELD_INITIAL_STATE_OBJECT];
        } else {
          validations.filter_fields = [...filter_fields, FILTER_FIELD_INITIAL_STATE_OBJECT];
        }
        break;
      default:
        break;
    }

    onValidationConfigChangeHandler({
      target: {
        id: VALIDATION_CONFIG.LIMIT_DATALIST.CHANGE_DATA,
        value: validations,
      },
    });
  };
  const onChangeFilterData = (dataIndex = null, event = null, index = null, isDynamicField = false) => {
    if (dataIndex === 1) {
      const clonedDataListPickerFilters = cloneDeep(fieldData.validations.filter_fields);
      const particularFilterDetails = cloneDeep(clonedDataListPickerFilters[index]);
      if (particularFilterDetails.field_uuid !== event.target.value) {
        particularFilterDetails.field_uuid = event.target.value;
        particularFilterDetails.field_type = event.target.field_type;
        particularFilterDetails.operator = '';
        particularFilterDetails.field_value = '';
        particularFilterDetails.value_type = 'direct';
        delete particularFilterDetails.field;
        clonedDataListPickerFilters[index] = particularFilterDetails;
        console.log('clonedDataListPickerFilters', clonedDataListPickerFilters, event);
        onValidationConfigChangeHandler({
          target: {
            id: VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.ID,
            value: [...clonedDataListPickerFilters],
          },
        });
      }
    } else if (dataIndex === 2) {
      const clonedDataListPickerFilters = cloneDeep(fieldData.validations.filter_fields);
      const particularFilterDetails = cloneDeep(clonedDataListPickerFilters[index]);
      particularFilterDetails.operator = event.target.value;
      clonedDataListPickerFilters[index] = particularFilterDetails;
      console.log('clonedDataListPickerFilters', clonedDataListPickerFilters, event);
      onValidationConfigChangeHandler({
        target: {
          id: VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.ID,
          value: [...clonedDataListPickerFilters],
        },
      });
    } else if (dataIndex === 3) {
      const clonedDataListPickerFilters = cloneDeep(fieldData.validations.filter_fields);
      const particularFilterDetails = cloneDeep(clonedDataListPickerFilters[index]);
      if (particularFilterDetails.field_type === FIELD_TYPES.CHECKBOX) {
        particularFilterDetails.field_value = event.target.value;
      } else if (VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD.ALLOWED_FIELD_TYPES.selectionFields
        .includes(particularFilterDetails.field_type) && particularFilterDetails.field_type !== FIELD_TYPES.YES_NO) {
        particularFilterDetails.field_value = [event.target.value];
      } else if (particularFilterDetails.field_type === FIELD_TYPES.NUMBER ||
        particularFilterDetails.field_type === FIELD_TYPES.DATE ||
        particularFilterDetails.field_type === FIELD_TYPES.DATETIME ||
        particularFilterDetails.field_type === FIELD_TYPES.CURRENCY ||
        particularFilterDetails.field_type === FIELD_TYPES.YES_NO) {
        particularFilterDetails.field_value = event.target.value;
      }
      if (isDynamicField) {
        particularFilterDetails.value_type = 'field';
        particularFilterDetails.field = event.target.value;
        delete particularFilterDetails.field_value;
      } else {
        particularFilterDetails.value_type = 'direct';
      }
      if (event?.target?.field_type === FIELD_TYPES.TABLE) {
        if (particularFilterDetails.operator === 'equal_to') {
          particularFilterDetails.operator = 'in';
        }
      }
      clonedDataListPickerFilters[index] = particularFilterDetails;
      console.log('clonedDataListPickerFilters onFilterValueChange', clonedDataListPickerFilters, event);
      onValidationConfigChangeHandler({
        target: {
          id: VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.ID,
          value: [...clonedDataListPickerFilters],
        },
      });
    } else if (dataIndex === 4) {
      const clonedDataListPickerFilters = cloneDeep(fieldData.validations.filter_fields);
      clonedDataListPickerFilters.splice(index, 1);
      onValidationConfigChangeHandler({
        target: {
          id: VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.ID,
          value: [...clonedDataListPickerFilters],
        },
      });
    } else if (dataIndex === 5) {
      const clonedDataListPickerFilters = cloneDeep(fieldData.validations.filter_fields);
      const particularFilterDetails = cloneDeep(clonedDataListPickerFilters[index]);
      if (isDynamicField) {
        delete particularFilterDetails.field_value;
        particularFilterDetails.field = EMPTY_STRING;
        particularFilterDetails.value_type = DL_PICKER_FILTER_STRING.FIELD;
      } else {
        delete particularFilterDetails.field;
        particularFilterDetails.field_value = EMPTY_STRING;
        particularFilterDetails.value_type = DL_PICKER_FILTER_STRING.DIRECT;
      }
      clonedDataListPickerFilters[index] = particularFilterDetails;
        onValidationConfigChangeHandler({
          target: {
            id: VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.ID,
            value: [...clonedDataListPickerFilters],
          },
        });
    }
  };

  const clearFilter = () => {
    onValidationConfigChangeHandler({
      target: {
        id: VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.ID,
        value: [],
      },
    });
  };

  const setFieldValueDataChange = (value) => {
    setFieldValueData(value);
  };

  const filterList = fieldData.field_type === FIELD_TYPES.DATA_LIST
    && fieldData.data_list
    && fieldData.validations.filter_fields
    && fieldData.validations.filter_fields.map((filter, filterIndex) => {
      console.log('check filter');
      return (
        <DataListPickerFilter
          filter={filter}
          filterIndex={filterIndex}
          dataList={fieldData.data_list}
          onSelectFilterField={(event, index) => onChangeFilterData(1, event, index)}
          totalFilters={fieldData.validations.filter_fields.length}
          onChangeOperatorData={(event, index) => onChangeFilterData(2, event, index)}
          onFilterValueChange={(event, index, fieldBased) => onChangeFilterData(3, event, index, fieldBased)}
          setLimitDataListValues={() => setLimitDataListValues(DATA_LIST_VISIBILITY.ACTIONS.ADD_CONDITION)}
          onDeleteDataListFilter={(index) => onChangeFilterData(4, null, index)}
          onFilterTypeChange={(index, isDynamic) => onChangeFilterData(5, null, index, isDynamic)}
          error_list={error_list}
          sectionIndex={sectionIndex}
          fieldListIndex={fieldListIndex}
          fieldIndex={fieldIndex}
          clearFilter={clearFilter}
          allowed_currency_types={allowedCurrencyList}
          defaultCurrencyType={defaultCurrencyType}
          fieldUuid={fieldData.field_uuid}
          isTaskForm={isTaskForm}
          taskId={taskId}
          stepOrder={stepOrder}
          isDataListForm={isDataListForm}
          fieldValueData={fieldValueData}
          setFieldValueDataChange={setFieldValueDataChange}
        />
      );
    });
  console.log(fieldData);
  let currentComponent = null;
  const defaultValidationConfig = (
    <>
      <Row>
        <Col>
          <Input
            id={VALIDATION_CONFIG.MINIMUM_CHARCTERS.ID}
            placeholder={VALIDATION_CONFIG.MINIMUM_CHARCTERS.PLACEHOLDER}
            label={VALIDATION_CONFIG.MINIMUM_CHARCTERS.LABEL}
            type="number"
            onChangeHandler={onValidationConfigChangeHandler}
            onBlurHandler={onValidationConfigBlurHandler}
            value={fieldData.validations.minimum_characters}
            errorMessage={minCharErrorMessage}
          />
        </Col>
        <Col>
          <Input
            id={VALIDATION_CONFIG.MAXIMUM_CHARCTERS.ID}
            placeholder={VALIDATION_CONFIG.MAXIMUM_CHARCTERS.PLACEHOLDER}
            label={VALIDATION_CONFIG.MAXIMUM_CHARCTERS.LABEL}
            type="number"
            onChangeHandler={onValidationConfigChangeHandler}
            onBlurHandler={onValidationConfigBlurHandler}
            value={fieldData.validations.maximum_characters}
            errorMessage={maxCharErrorMessage}
          />
        </Col>
      </Row>
      <CheckboxGroup
        optionList={VALIDATION_CONFIG.ALLOW_SPECIAL_CHARACTERS.OPTION_LIST}
        id={VALIDATION_CONFIG.ALLOW_SPECIAL_CHARACTERS.ID}
        onClick={() => onSpecialCharactersCBClick(!isSCIVisible)}
        selectedValues={
          isSCIVisible
            ? [VALIDATION_CONFIG.ALLOW_SPECIAL_CHARACTERS.OPTION_LIST[0].value]
            : []
        }
        hideLabel
      />
      {isSCIVisible ? (
        <Input
          id={VALIDATION_CONFIG.ADDITIONAL_CHARACTERS.ID}
          placeholder={VALIDATION_CONFIG.ADDITIONAL_CHARACTERS.PLACEHOLDER}
          hideLabel
          onChangeHandler={onValidationConfigChangeHandler}
          onBlurHandler={onValidationConfigBlurHandler}
          value={fieldData.validations.allowed_special_characters}
        />
      ) : null}
    </>
  );
  switch (fieldType) {
    case FIELD_TYPES.FILE_UPLOAD: {
      const { accountDetails, isGetAccountConfigLoading } = props;
      let allowedExtensions = [];
      if (accountDetails && accountDetails.allowed_extensions) {
        allowedExtensions = getDropdownData(accountDetails.allowed_extensions);
      }
      const allow_multiple_pick = jsUtils.get(fieldData, ['validations', 'is_multiple'], false);
      currentComponent = (
        <>
          {/* <AddMembers
            id={VALIDATION_CONFIG.ALLOWED_FILE_EXTENSIONS.ID}
            onUserSelectHandler={onAddFileExtensionHandler}
            placeholder={VALIDATION_CONFIG.ALLOWED_FILE_EXTENSIONS.PLACEHOLDER}
            selectedData={allowed_extensions}
            removeSelectedUser={onRemoveFileExtensionHandler}
            // errorText={create_team_state.errorText}
            // selectedSuggestionData={this.state.current_selected_extension}
            memberSearchValue={fileExtensionSearchValue}
            setMemberSearchValue={(event) => setFileExtensionSearchValue(event.target.value)}
            label={VALIDATION_CONFIG.ALLOWED_FILE_EXTENSIONS.LABEL}
            getAllFileExtensions
          /> */}
          <CheckboxGroup
            className={gClasses.MB15}
            hideLabel
            hideMessage
            optionList={FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_FILES.OPTION_LIST}
            selectedValues={allow_multiple_pick ? [1] : []}
            onClick={() => {
              onValidationConfigChangeHandler({
                target: {
                  id: FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_FILES.ID,
                  value: !allow_multiple_pick,
                },
              });
            }
            }
          />
          {allow_multiple_pick && (
            <div>
              {(
                <Input
                  id={VALIDATION_CONFIG.MINIMUM_FILE_COUNT.ID}
                  placeholder={VALIDATION_CONFIG.MINIMUM_FILE_COUNT.PLACEHOLDER}
                  // type="number"
                  label={VALIDATION_CONFIG.MINIMUM_FILE_COUNT.LABEL}
                  onChangeHandler={(event) => {
                    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
                    onValidationConfigChangeHandler(event);
                  }}
                  onBlurHandler={onValidationConfigBlurHandler}
                  value={fieldData.validations.minimum_count}
                  // hideLabel
                  errorMessage={minDocErrorMessage}
                />
              )}
              {(
                <Input
                  id={VALIDATION_CONFIG.MAXIMUM_FILE_COUNT.ID}
                  placeholder={VALIDATION_CONFIG.MAXIMUM_FILE_COUNT.PLACEHOLDER}
                  // type="number"
                  label={VALIDATION_CONFIG.MAXIMUM_FILE_COUNT.LABEL}
                  onChangeHandler={(event) => {
                    event.target.value = event.target.value.replace(/[^0-9.]/g, '');
                    onValidationConfigChangeHandler(event);
                  }}
                  onBlurHandler={onValidationConfigBlurHandler}
                  value={fieldData.validations.maximum_count}
                  // hideLabel
                  errorMessage={maxDocErrorMessage}
                />
              )}
            </div>
          )}
          <Dropdown
            optionList={allowedExtensions}
            loadData={getAccountConfigData}
            id={VALIDATION_CONFIG.ALLOWED_FILE_EXTENSIONS.ID}
            placeholder={VALIDATION_CONFIG.ALLOWED_FILE_EXTENSIONS.PLACEHOLDER}
            label={VALIDATION_CONFIG.ALLOWED_FILE_EXTENSIONS.LABEL}
            selectedValue={allowed_extensions}
            onChange={onAddFileExtensionHandler}
            isDataLoading={isGetAccountConfigLoading}
            isMultiSelect
            disablePopper
          />
          <Row>
            <Col sm={6}>
              <Input
                id={VALIDATION_CONFIG.MAXIMUM_FILE_SIZE.ID}
                placeholder={VALIDATION_CONFIG.MAXIMUM_FILE_SIZE.PLACEHOLDER}
                label={VALIDATION_CONFIG.MAXIMUM_FILE_SIZE.LABEL}
                type="number"
                onKeyDownHandler={invalidNumericHandler}
                onChangeHandler={onValidationConfigChangeHandler}
                onBlurHandler={onValidationConfigBlurHandler}
                value={fieldData.validations.maximum_file_size}
                readOnlySuffix={VALIDATION_CONFIG.MAXIMUM_FILE_SIZE.SUFFIX}
                errorMessage={maximumFileSizeError}
              />
            </Col>
          </Row>
        </>
      );
      break;
    }
    case FIELD_TYPES.SINGLE_LINE:
      currentComponent = defaultValidationConfig;
      break;
    case FIELD_TYPES.NUMBER:
      currentComponent = (
        <>
          <Row>
            <Col>
              <Input
                id={VALIDATION_CONFIG.ALLOWED_MINIMUM.ID}
                placeholder={VALIDATION_CONFIG.ALLOWED_MINIMUM.PLACEHOLDER}
                label={VALIDATION_CONFIG.ALLOWED_MINIMUM.LABEL}
                type="number"
                onChangeHandler={onValidationConfigChangeHandler}
                onBlurHandler={onValidationConfigBlurHandler}
                value={fieldData.validations.allowed_minimum}
                errorMessage={minNumberErrorMessage}
              />
            </Col>
            <Col>
              <Input
                id={VALIDATION_CONFIG.ALLOWED_MAXIMUM.ID}
                placeholder={VALIDATION_CONFIG.ALLOWED_MAXIMUM.PLACEHOLDER}
                label={VALIDATION_CONFIG.ALLOWED_MAXIMUM.LABEL}
                type="number"
                onChangeHandler={onValidationConfigChangeHandler}
                onBlurHandler={onValidationConfigBlurHandler}
                value={fieldData.validations.allowed_maximum}
                errorMessage={maxNumberErrorMessage}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <CheckboxGroup
                optionList={VALIDATION_CONFIG.ALLOW_ZERO.OPTION_LIST}
                id={VALIDATION_CONFIG.ALLOW_ZERO.ID}
                onClick={() =>
                  onValidationConfigChangeHandler({
                    target: { id: VALIDATION_CONFIG.ALLOW_ZERO.ID },
                  })
                }
                selectedValues={fieldData.validations.dont_allow_zero ? [1] : []}
                hideLabel
                label={VALIDATION_CONFIG.ALLOW_ZERO.ID}
              />
            </Col>
          </Row>
          <CheckboxGroup
            optionList={VALIDATION_CONFIG.ALLOW_DECIMAL.OPTION_LIST}
            id={VALIDATION_CONFIG.ALLOW_DECIMAL.ID}
            onClick={() =>
              onValidationConfigChangeHandler({
                target: { id: VALIDATION_CONFIG.ALLOW_DECIMAL.ID },
              })
            }
            selectedValues={fieldData.validations.allow_decimal ? [1] : []}
            hideLabel
            label={VALIDATION_CONFIG.ALLOW_DECIMAL.ID}
          // className={gClasses.MT5}
          />
          {fieldData.validations.allow_decimal ? (
            <Input
              id={VALIDATION_CONFIG.ALLOWED_DECIMAL_POINTS.ID}
              placeholder={VALIDATION_CONFIG.ALLOWED_DECIMAL_POINTS.PLACEHOLDER}
              hideLabel
              onChangeHandler={onValidationConfigChangeHandler}
              onBlurHandler={onValidationConfigBlurHandler}
              value={fieldData.validations.allowed_decimal_points}
              errorMessage={decimalPointErrorMessage}
              type="number"
            />
          ) : null}
        </>
      );
      break;
    case FIELD_TYPES.EMAIL:
      currentComponent = (<div className={gClasses.FTwo18GrayV3}>{VALIDATION_CONFIG.YET_TO_BE_ADDED}</div>);
      break;
    case FIELD_TYPES.YES_NO:
      currentComponent = (<div className={gClasses.FTwo18GrayV3}>{VALIDATION_CONFIG.YET_TO_BE_ADDED}</div>);
      break;
    case FIELD_TYPES.CUSTOM_LOOKUP_DROPDOWN:
      currentComponent = (<div className={gClasses.FTwo18GrayV3}>{VALIDATION_CONFIG.YET_TO_BE_ADDED}</div>);
      break;
    case FIELD_TYPES.PARAGRAPH:
      currentComponent = defaultValidationConfig;
      break;
    case FIELD_TYPES.DATA_LIST:
      const allow_multiple = jsUtils.get(fieldData, ['validations', 'allow_multiple'], false);
      const max_selection = jsUtils.get(fieldData, ['validations', VALIDATION_CONFIG.MAXIMUM_COUNT_DATA_LIST.ID], null);
      const limitDataList = (
        jsUtils.get(fieldData, ['validations', VALIDATION_CONFIG.LIMIT_DATALIST.IS_DATALIST_FILTER], false) ||
        !jsUtils.isEmpty(jsUtils.get(fieldData, ['validations', VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.ID], []))
      );
      currentComponent = (
        <div>
          <div role="note" className={cx(gClasses.FTwo13BlackV13, gClasses.MB15)}>
            {FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_DATA_LIST.LABEL}
          </div>
          <CheckboxGroup
            className={gClasses.MB15}
            hideLabel
            hideMessage
            optionList={FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_DATA_LIST.OPTION_LIST}
            selectedValues={allow_multiple ? [1] : []}
            onClick={() => {
              onValidationConfigChangeHandler({
                target: {
                  id: FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_DATA_LIST.ID,
                  value: !allow_multiple,
                },
              });
            }
            }
          />
          {allow_multiple && (
            <Input
              id={VALIDATION_CONFIG.MAXIMUM_COUNT_DATA_LIST.ID}
              placeholder={VALIDATION_CONFIG.MAXIMUM_COUNT_DATA_LIST.PLACEHOLDER}
              label={VALIDATION_CONFIG.MAXIMUM_COUNT_DATA_LIST.LABEL}
              type="number"
              onKeyDownHandler={invalidNumericHandler}
              onChangeHandler={onValidationConfigChangeHandler}
              onBlurHandler={onValidationConfigBlurHandler}
              value={max_selection}
              errorMessage={maxCountErrorMessage}
            />
          )}
          <CheckboxGroup
            optionList={VALIDATION_CONFIG.LIMIT_DATALIST.OPTION_LIST}
            id={VALIDATION_CONFIG.LIMIT_DATALIST.ID}
            onClick={() => setLimitDataListValues(DATA_LIST_VISIBILITY.ACTIONS.ENABLE_LIMIT_SWITCH)}
            selectedValues={limitDataList ? [1] : []}
            hideLabel
          />
          {limitDataList && filterList}
        </div>
      );
      break;
    case FIELD_TYPES.LINK:
      currentComponent = (
        <>
          <Row>
            <Col>
              <CheckboxGroup
                optionList={VALIDATION_CONFIG.ALLOW_MULTIPLE_LINKS.OPTION_LIST}
                id={VALIDATION_CONFIG.ALLOW_MULTIPLE_LINKS.ID}
                onClick={() =>
                  onValidationConfigChangeHandler({
                    target: { id: VALIDATION_CONFIG.ALLOW_MULTIPLE_LINKS.ID },
                  })
                }
                selectedValues={
                  jsUtils.get(fieldData, [
                    'validations',
                    VALIDATION_CONFIG.ALLOW_MULTIPLE_LINKS.ID,
                  ])
                    ? [1]
                    : []
                }
                hideLabel
                errorMessage={linkDefaultValueError}
              />
            </Col>
          </Row>
          {jsUtils.get(fieldData, [
            'validations',
            VALIDATION_CONFIG.ALLOW_MULTIPLE_LINKS.ID,
          ]) && (
              <Row>
                <Col>
                  <Input
                    id={VALIDATION_CONFIG.MINIMUM_COUNT.ID}
                    placeholder={VALIDATION_CONFIG.MINIMUM_COUNT.PLACEHOLDER}
                    label={VALIDATION_CONFIG.MINIMUM_COUNT.LABEL}
                    type="number"
                    onKeyDownHandler={invalidNumericHandler}
                    onChangeHandler={onValidationConfigChangeHandler}
                    onBlurHandler={onValidationConfigBlurHandler}
                    value={jsUtils.get(fieldData, [
                      'validations',
                      VALIDATION_CONFIG.MINIMUM_COUNT.ID,
                    ])}
                    errorMessage={minCountErrorMessage}
                  />
                </Col>
                <Col>
                  <Input
                    id={VALIDATION_CONFIG.MAXIMUM_COUNT.ID}
                    placeholder={VALIDATION_CONFIG.MAXIMUM_COUNT.PLACEHOLDER}
                    label={VALIDATION_CONFIG.MAXIMUM_COUNT.LABEL}
                    type="number"
                    onKeyDownHandler={invalidNumericHandler}
                    onChangeHandler={onValidationConfigChangeHandler}
                    onBlurHandler={onValidationConfigBlurHandler}
                    value={jsUtils.get(fieldData, [
                      'validations',
                      VALIDATION_CONFIG.MAXIMUM_COUNT.ID,
                    ])}
                    errorMessage={maxCountErrorMessage || linkCountDefaultError}
                  />
                </Col>
              </Row>
            )}
        </>
      );
      break;
    case FIELD_TYPES.DATETIME:
    case FIELD_TYPES.DATE:
      const workingDaysComponent = (
        <div className={cx(gClasses.FOne13GrayV14, gClasses.Italics, gClasses.ML23)}>
          {VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_WORKING_DAY.SUBTITLE}
          {SPACE}
          {workingDaysString}
        </div>
      );
      let pastDateSubType = null;
      let futureDateSubType = null;
      let fixedDateRangeSubType = null;
      let dateFieldBasedSubType = null;
      let enableAllowTodayCheckbox = false;
      const { date_selection } = fieldData.validations;
      const dateValidationData = getDateValidationData({
        dateValidationArray: date_selection,
        startDayError: dateValidationMinValueError,
        endDayError: dateValidationMaxValueError,
        componentId: VALIDATION_CONFIG.DATE_VALIDATIONS,
        startDateError,
        endDateError,
        externalFieldsDropdownData,
        firstFieldError,
        secondFieldError,
      });
      console.log(dateValidationMinValueError, dateValidationMaxValueError, dateValidationData, 'dateValidationMinValueError');

      if (
        (dateValidationData.sub_type === VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_ALL.VALUE) ||
        (dateValidationData.sub_type === VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.VALUE) ||
        (dateValidationData.sub_type === VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_ALL.VALUE) ||
        (dateValidationData.sub_type === VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.VALUE)
      ) {
        enableAllowTodayCheckbox = true;
      }
      if (dateValidationData[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE.ID]) {
        const futureDateRangeError = dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_1}Error`] ||
          dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_2}Error`];
        futureDateSubType = (
          <>
            <RadioGroup
              className={BS.MY_AUTO}
              type={RADIO_GROUP_TYPE.TYPE_3}
              hideLabel
              hideMessage
              hideInstructionMessage
              enableOptionDeselect={false}
              optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_ALL.OPTION_LIST}
              selectedValue={dateValidationData.sub_type}
              onClick={(value) =>
                onValidationConfigChangeHandler({
                  target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_ALL.ID, value },
                })
              }
            />
            <div className={cx(gClasses.MB10, gClasses.MT7)}>
              <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.MB5)}>
                <RadioGroup
                  className={BS.MY_AUTO}
                  type={RADIO_GROUP_TYPE.TYPE_3}
                  hideLabel
                  hideMessage
                  hideInstructionMessage
                  enableOptionDeselect={false}
                  optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.OPTION_LIST}
                  selectedValue={dateValidationData.sub_type}
                  onClick={(value) =>
                    onValidationConfigChangeHandler({
                      target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.ID, value },
                    })
                  }
                  radioViewClassName={styles.DateValidationOption}
                />
                <Input
                  id={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.INPUT_ID}
                  placeholder={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.PLACEHOLDER}
                  type="text"
                  onChangeHandler={(e) => onNumberInputChange({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.INPUT_ID,
                      value: e.target.value,
                    },
                  })}
                  onBlurHandler={(e) => onNumberInputBlur({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.INPUT_ID,
                      value: e.target.value,
                    },
                  })}
                  value={dateValidationData[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.INPUT_ID] || EMPTY_STRING}
                  hideLabel
                  hideMessage
                  innerClass="text-center"
                  // errorMessage={dateValidationMaxValueError}
                  inputContainerClasses={styles.InputContainer}
                  readOnly={dateValidationData.sub_type !== VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.VALUE}
                  errorMessage={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.INPUT_ID}Error`]}
                />
                <span className={cx((dateValidationData.sub_type === VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.VALUE) ? gClasses.FOne13GrayV3 : gClasses.FOne13GrayV14, BS.MB_0)}>{t('form_field_strings.field_config.days')}</span>
              </div>
              {dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.INPUT_ID}Error`] && (
                <HelperMessage
                  message={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.INPUT_ID}Error`]}
                  type={HELPER_MESSAGE_TYPE.ERROR}
                  noMarginBottom
                  className={gClasses.ML60}
                  ariaLabelHelperMessage={evaluateAriaLabelMessage(dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.INPUT_ID}Error`])}
                  helperAriaHidden={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_NEXT.INPUT_ID}Error`]}
                  role={ARIA_ROLES.PRESENTATION}
                />
              )}
            </div>
            <div className={cx(gClasses.MB10, gClasses.MT7)}>
              <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.MB5)}>
                <RadioGroup
                  className={BS.MY_AUTO}
                  type={RADIO_GROUP_TYPE.TYPE_3}
                  hideLabel
                  hideMessage
                  hideInstructionMessage
                  enableOptionDeselect={false}
                  optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.OPTION_LIST}
                  selectedValue={dateValidationData.sub_type}
                  onClick={(value) =>
                    onValidationConfigChangeHandler({
                      target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.ID, value },
                    })
                  }
                  radioViewClassName={styles.DateValidationOption}
                />
                <Input
                  id={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.INPUT_ID}
                  placeholder={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.PLACEHOLDER}
                  type="text"
                  onChangeHandler={(e) => onNumberInputChange({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.INPUT_ID,
                      value: e.target.value,
                    },
                  })}
                  onBlurHandler={(e) => onNumberInputBlur({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.INPUT_ID,
                      value: e.target.value,
                    },
                  })}
                  value={dateValidationData[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.INPUT_ID] || EMPTY_STRING}
                  hideLabel
                  hideMessage
                  innerClass="text-center"
                  // errorMessage={dateValidationMaxValueError}
                  inputContainerClasses={styles.InputContainer}
                  readOnly={dateValidationData.sub_type !== VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.VALUE}
                  errorMessage={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.INPUT_ID}Error`]}
                />
                <span className={cx((dateValidationData.sub_type === VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.VALUE) ? gClasses.FOne13GrayV3 : gClasses.FOne13GrayV14, BS.MB_0)}>{t('form_field_strings.field_config.days')}</span>
              </div>
              {dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.INPUT_ID}Error`] && (
                <HelperMessage
                  message={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.INPUT_ID}Error`]}
                  type={HELPER_MESSAGE_TYPE.ERROR}
                  noMarginBottom
                  className={gClasses.ML60}
                  ariaLabelHelperMessage={evaluateAriaLabelMessage(dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.INPUT_ID}Error`])}
                  helperAriaHidden={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_AFTER.INPUT_ID}Error`]}
                  role={ARIA_ROLES.PRESENTATION}
                />
              )}
            </div>
            <div className={cx(gClasses.MB10, gClasses.MT7)}>
              <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.MB5)}>
                <RadioGroup
                  className={BS.MY_AUTO}
                  type={RADIO_GROUP_TYPE.TYPE_3}
                  hideLabel
                  hideMessage
                  hideInstructionMessage
                  enableOptionDeselect={false}
                  optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.OPTION_LIST}
                  selectedValue={dateValidationData.sub_type}
                  onClick={(value) =>
                    onValidationConfigChangeHandler({
                      target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.ID, value },
                    })
                  }
                  radioViewClassName={styles.DateValidationOption}
                />
                <Input
                  id={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_1}
                  placeholder={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.PLACEHOLDER_1}
                  type="text"
                  onChangeHandler={(e) => onNumberInputChange({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_1,
                      value: e.target.value,
                    },
                  })}
                  onBlurHandler={(e) => onNumberInputBlur({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_1,
                      value: e.target.value,
                    },
                  })}
                  value={dateValidationData[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_1] || EMPTY_STRING}
                  hideLabel
                  hideMessage
                  innerClass="text-center"
                  // errorMessage={dateValidationMaxValueError}
                  inputContainerClasses={styles.InputContainer}
                  readOnly={dateValidationData.sub_type !== VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.VALUE}
                  errorMessage={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_1}Error`]}
                />
                <span className={cx((dateValidationData.sub_type === VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.VALUE) ? gClasses.FOne13GrayV3 : gClasses.FOne13GrayV14, BS.MB_0)}>{t('form_field_strings.field_config.to')}</span>
                <Input
                  id={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_2}
                  placeholder={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.PLACEHOLDER_2}
                  type="text"
                  onChangeHandler={(e) => onNumberInputChange({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_2,
                      value: e.target.value,
                    },
                  })}
                  onBlurHandler={(e) => onNumberInputBlur({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_2,
                      value: e.target.value,
                    },
                  })}
                  value={dateValidationData[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_2] || EMPTY_STRING}
                  hideLabel
                  hideMessage
                  innerClass="text-center"
                  // errorMessage={dateValidationMaxValueError}
                  inputContainerClasses={styles.InputContainer}
                  readOnly={dateValidationData.sub_type !== VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.VALUE}
                  errorMessage={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.INPUT_ID_2}Error`]}
                />
                <span className={cx((dateValidationData.sub_type === VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE_BETWEEN.VALUE) ? gClasses.FOne13GrayV3 : gClasses.FOne13GrayV14, BS.MB_0)}>{t('form_field_strings.field_config.days')}</span>
              </div>
              {futureDateRangeError && (
                <HelperMessage
                  message={futureDateRangeError}
                  type={HELPER_MESSAGE_TYPE.ERROR}
                  noMarginBottom
                  className={gClasses.ML60}
                  ariaLabelHelperMessage={evaluateAriaLabelMessage(futureDateRangeError)}
                  helperAriaHidden={futureDateRangeError}
                  role={ARIA_ROLES.PRESENTATION}
                />
              )}
            </div>
          </>
        );
      }
      if (dateValidationData[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST.ID]) {
        const pastDateRangeError = dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_1}Error`] ||
          dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_2}Error`];
        pastDateSubType = (
          <>
            <RadioGroup
              className={BS.MY_AUTO}
              type={RADIO_GROUP_TYPE.TYPE_3}
              hideLabel
              hideMessage
              hideInstructionMessage
              enableOptionDeselect={false}
              optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_ALL.OPTION_LIST}
              selectedValue={dateValidationData.sub_type}
              onClick={(value) =>
                onValidationConfigChangeHandler({
                  target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_ALL.ID, value },
                })
              }
              radioViewClassName={styles.DateValidationOption}
            />
            <div className={cx(gClasses.MB10, gClasses.MT7)}>
              <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.MB5)}>
                <RadioGroup
                  className={BS.MY_AUTO}
                  type={RADIO_GROUP_TYPE.TYPE_3}
                  hideLabel
                  hideMessage
                  hideInstructionMessage
                  enableOptionDeselect={false}
                  optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.OPTION_LIST}
                  selectedValue={dateValidationData.sub_type}
                  onClick={(value) =>
                    onValidationConfigChangeHandler({
                      target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.ID, value },
                    })
                  }
                  radioViewClassName={styles.DateValidationOption}
                />
                <Input
                  id={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.INPUT_ID}
                  placeholder={t(VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.PLACEHOLDER)}
                  type="text"
                  onChangeHandler={(e) => onNumberInputChange({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.INPUT_ID,
                      value: e.target.value,
                    },
                  })}
                  onBlurHandler={(e) => onNumberInputBlur({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.INPUT_ID,
                      value: e.target.value,
                    },
                  })}
                  value={dateValidationData[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.INPUT_ID] || EMPTY_STRING}
                  hideLabel
                  hideMessage
                  innerClass="text-center"
                  // errorMessage={dateValidationMaxValueError}
                  inputContainerClasses={styles.InputContainer}
                  readOnly={dateValidationData.sub_type !== VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.VALUE}
                  errorMessage={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.INPUT_ID}Error`]}
                />
                <span className={cx((dateValidationData.sub_type === VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.VALUE) ? gClasses.FOne13GrayV3 : gClasses.FOne13GrayV14, BS.MB_0)}>{t('form_field_strings.field_config.days')}</span>
              </div>
              {dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.INPUT_ID}Error`] && (
                <HelperMessage
                  message={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.INPUT_ID}Error`]}
                  type={HELPER_MESSAGE_TYPE.ERROR}
                  noMarginBottom
                  className={gClasses.ML60}
                  ariaLabelHelperMessage={evaluateAriaLabelMessage(dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.INPUT_ID}Error`])}
                  helperAriaHidden={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_LAST.INPUT_ID}Error`]}
                  role={ARIA_ROLES.PRESENTATION}
                />
              )}
            </div>
            <div className={cx(gClasses.MB10, gClasses.MT7)}>
              <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.MB5)}>
                <RadioGroup
                  className={BS.MY_AUTO}
                  type={RADIO_GROUP_TYPE.TYPE_3}
                  hideLabel
                  hideMessage
                  hideInstructionMessage
                  enableOptionDeselect={false}
                  optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.OPTION_LIST}
                  selectedValue={dateValidationData.sub_type}
                  onClick={(value) =>
                    onValidationConfigChangeHandler({
                      target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.ID, value },
                    })
                  }
                  radioViewClassName={styles.DateValidationOption}
                />
                <Input
                  id={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.INPUT_ID}
                  placeholder={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.PLACEHOLDER}
                  type="text"
                  onChangeHandler={(e) => onNumberInputChange({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.INPUT_ID,
                      value: e.target.value,
                    },
                  })}
                  onBlurHandler={(e) => onNumberInputBlur({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.INPUT_ID,
                      value: e.target.value,
                    },
                  })}
                  value={dateValidationData[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.INPUT_ID] || EMPTY_STRING}
                  hideLabel
                  hideMessage
                  innerClass="text-center"
                  // errorMessage={dateValidationMaxValueError}
                  inputContainerClasses={styles.InputContainer}
                  readOnly={dateValidationData.sub_type !== VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.VALUE}
                  errorMessage={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.INPUT_ID}Error`]}
                />
                <span className={cx((dateValidationData.sub_type === VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.VALUE) ? gClasses.FOne13GrayV3 : gClasses.FOne13GrayV14, BS.MB_0)}>{t('form_field_strings.field_config.days')}</span>
              </div>
              {dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.INPUT_ID}Error`] && (
                <HelperMessage
                  message={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.INPUT_ID}Error`]}
                  type={HELPER_MESSAGE_TYPE.ERROR}
                  noMarginBottom
                  className={gClasses.ML60}
                  ariaLabelHelperMessage={evaluateAriaLabelMessage(dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.INPUT_ID}Error`])}
                  helperAriaHidden={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BEFORE.INPUT_ID}Error`]}
                  role={ARIA_ROLES.PRESENTATION}
                />
              )}
            </div>
            <div className={cx(gClasses.MB10, gClasses.MT7)}>
              <div className={cx(BS.D_FLEX, BS.ALIGN_ITEM_CENTER, gClasses.MB5)}>
                <RadioGroup
                  className={BS.MY_AUTO}
                  type={RADIO_GROUP_TYPE.TYPE_3}
                  hideLabel
                  hideMessage
                  hideInstructionMessage
                  enableOptionDeselect={false}
                  optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.OPTION_LIST}
                  selectedValue={dateValidationData.sub_type}
                  onClick={(value) =>
                    onValidationConfigChangeHandler({
                      target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.ID, value },
                    })
                  }
                  radioViewClassName={styles.DateValidationOption}
                />
                <Input
                  id={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_1}
                  placeholder={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.PLACEHOLDER_1}
                  type="text"
                  onChangeHandler={(e) => onNumberInputChange({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_1,
                      value: e.target.value,
                    },
                  })}
                  onBlurHandler={(e) => onNumberInputBlur({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_1,
                      value: e.target.value,
                    },
                  })}
                  value={dateValidationData[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_1] || EMPTY_STRING}
                  hideLabel
                  hideMessage
                  innerClass="text-center"
                  // errorMessage={dateValidationMaxValueError}
                  inputContainerClasses={styles.InputContainer}
                  readOnly={dateValidationData.sub_type !== VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.VALUE}
                  errorMessage={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_1}Error`]}
                />
                <span className={cx((dateValidationData.sub_type === VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.VALUE) ? gClasses.FOne13GrayV3 : gClasses.FOne13GrayV14, BS.MB_0)}>{t('form_field_strings.field_config.to')}</span>
                <Input
                  id={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_2}
                  placeholder={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.PLACEHOLDER_2}
                  type="text"
                  onChangeHandler={(e) => onNumberInputChange({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_2,
                      value: e.target.value,
                    },
                  })}
                  onBlurHandler={(e) => onNumberInputBlur({
                    target: {
                      id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_2,
                      value: e.target.value,
                    },
                  })}
                  value={dateValidationData[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_2] || EMPTY_STRING}
                  hideLabel
                  hideMessage
                  innerClass="text-center"
                  inputContainerClasses={styles.InputContainer}
                  readOnly={dateValidationData.sub_type !== VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.VALUE}
                  errorMessage={dateValidationData[`${VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.INPUT_ID_2}Error`]}
                />
                <span className={cx((dateValidationData.sub_type === VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST_BETWEEN.VALUE) ? gClasses.FOne13GrayV3 : gClasses.FOne13GrayV14, BS.MB_0)}>{t('form_field_strings.field_config.days')}</span>
              </div>
              {pastDateRangeError && (
                <HelperMessage
                  message={pastDateRangeError}
                  type={HELPER_MESSAGE_TYPE.ERROR}
                  noMarginBottom
                  className={gClasses.ML60}
                  ariaLabelHelperMessage={evaluateAriaLabelMessage(pastDateRangeError)}
                  helperAriaHidden={pastDateRangeError}
                  role={ARIA_ROLES.PRESENTATION}
                />
              )}
            </div>
          </>
        );
      }
      if (dateValidationData[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.ID]) {
        fixedDateRangeSubType = (
          <div className={cx(gClasses.ML30, (fieldType === FIELD_TYPES.DATE) && BS.D_FLEX, BS.P_RELATIVE)}>
            <div className={styles.FixedDateRangeContainer}>
              <DatePicker
                className={gClasses.PR30}
                id={FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.START_DATE.ID}
                label={FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.START_DATE.LABEL}
                getDate={(value) =>
                  onValidationConfigChangeHandler({
                    target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.START_DATE.ID, value, endValue: dateValidationData.end_date },
                  })
                }
                date={dateValidationData.start_date}
                errorMessage={dateValidationData.startDateError}
                enableTime={fieldType === FIELD_TYPES.DATETIME}
                isScrollIntoView
                validations={
                  {
                    date_selection: [
                      {
                        type: 'no_limit',
                      },
                    ],
                  }
                }
              />
            </div>
            <div className={styles.FixedDateRangeContainer}>
              <DatePicker
                className={gClasses.PR30}
                id={FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.END_DATE.ID}
                label={FIELD_CONFIG(t).VALIDATION_CONFIG.DATE_VALIDATIONS.END_DATE.LABEL}
                getDate={(value) =>
                  onValidationConfigChangeHandler({
                    target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.END_DATE.ID, value, startValue: dateValidationData.start_date },
                  })
                }
                date={dateValidationData.end_date}
                errorMessage={dateValidationData.endDateError}
                enableTime={fieldType === FIELD_TYPES.DATETIME}
                isScrollIntoView
                validations={{
                  date_selection: [
                    {
                      type: 'no_limit',
                    },
                  ],
                }}
              />
            </div>
          </div>
        );
      }
      if (dateValidationData[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_DATE_FIELDS.ID]) {
        const dropdownLabel = `${fieldData.field_name} must be`;
        let operatorOptions = VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERATORS.SINGLE_FIELDS_OPTION_LIST;
        if (externalFieldsDropdownList.length > 1) {
          operatorOptions = [
            ...VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERATORS.SINGLE_FIELDS_OPTION_LIST,
            ...VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERATORS.DUAL_FIELDS_OPTION_LIST,
          ];
        }
        let secondOperand = null;
        let firstFieldLabel = VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERAND_1.LABEL_1;
        if (dateValidationData.operator === DATE_FIELDS_OPERATOR_VALUES.BETWEEN) {
          firstFieldLabel = VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERAND_1.LABEL_2;
          secondOperand = (
            <Dropdown
              id={VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERAND_2.ID}
              placeholder={VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERAND_2.PLACEHOLDER}
              label={VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERAND_2.LABEL}
              selectedValue={jsUtils.isEmpty(dateValidationData.secondField) ? null : `${dateValidationData.secondField.field_name}(Ref: ${dateValidationData.secondField.reference_name})`}
              onChange={onValidationConfigChangeHandler}
              disablePopper
              optionList={externalFieldsDropdownList}
              isPaginated
              hasMore={hasMoreFields}
              strictlySetSelectedValue
              loadDataHandler={onLoadMoreFieldsCallHandler}
              errorMessage={dateValidationData.secondFieldError}
            />
          );
        }
        dateFieldBasedSubType = (
          <div className={gClasses.ML30}>
            <Dropdown
              optionList={operatorOptions}
              id={VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERATORS.ID}
              placeholder={VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERATORS.PLACEHOLDER}
              label={dropdownLabel}
              selectedValue={dateValidationData.operator}
              onChange={onValidationConfigChangeHandler}
              disablePopper
              errorMessage={operatorError}
            />
            {
              dateValidationData.operator && (
                <>
                  <Dropdown
                    id={VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERAND_1.ID}
                    placeholder={VALIDATION_CONFIG.DATE_VALIDATIONS.DATE_FIELDS_OPERAND_1.PLACEHOLDER}
                    label={firstFieldLabel}
                    optionList={externalFieldsDropdownList}
                    selectedValue={jsUtils.isEmpty(dateValidationData.firstField) ? null : `${dateValidationData.firstField.field_name}(Ref: ${dateValidationData.firstField.reference_name})`}
                    onChange={onValidationConfigChangeHandler}
                    disablePopper
                    isPaginated
                    hasMore={hasMoreFields}
                    strictlySetSelectedValue
                    loadDataHandler={onLoadMoreFieldsCallHandler}
                    errorMessage={dateValidationData.firstFieldError}
                  />
                  {secondOperand}
                </>
              )
            }
          </div>
        );
      }
      currentComponent = (
        <>
          <RadioGroup
            type={RADIO_GROUP_TYPE.TYPE_2}
            hideLabel
            hideMessage
            enableOptionDeselect={false}
            optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.NO_LIMITS.OPTION_LIST}
            selectedValue={dateValidationData.type}
            onClick={(value) =>
              onValidationConfigChangeHandler({
                target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.NO_LIMITS.ID, value },
              })
            }
          />
          <RadioGroup
            type={RADIO_GROUP_TYPE.TYPE_2}
            hideLabel
            hideMessage
            className={gClasses.MT10}
            enableOptionDeselect={false}
            optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE.OPTION_LIST}
            selectedValue={dateValidationData.type}
            onClick={(value) =>
              onValidationConfigChangeHandler({
                target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FUTURE.ID, value },
              })
            }
          />
          {futureDateSubType}
          <RadioGroup
            type={RADIO_GROUP_TYPE.TYPE_2}
            hideLabel
            hideMessage
            className={gClasses.MT10}
            enableOptionDeselect={false}
            optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST.OPTION_LIST}
            selectedValue={dateValidationData.type}
            onClick={(value) =>
              onValidationConfigChangeHandler({
                target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_PAST.ID, value },
              })
            }
          />
          {pastDateSubType}
          <RadioGroup
            type={RADIO_GROUP_TYPE.TYPE_2}
            hideLabel
            hideMessage
            className={gClasses.MT10}
            enableOptionDeselect={false}
            optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_ONLY_TODAY.OPTION_LIST}
            selectedValue={dateValidationData.type}
            onClick={(value) =>
              onValidationConfigChangeHandler({
                target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_ONLY_TODAY.ID, value },
              })
            }
          />
          <RadioGroup
            type={RADIO_GROUP_TYPE.TYPE_2}
            hideLabel
            hideMessage
            className={gClasses.MT10}
            enableOptionDeselect={false}
            optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.OPTION_LIST}
            selectedValue={dateValidationData.type}
            onClick={(value) =>
              onValidationConfigChangeHandler({
                target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_FIXED_RANGE.ID, value },
              })
            }
          />
          {fixedDateRangeSubType}
          {
            (externalFieldsDropdownList.length > 0) && (
              <>
                <RadioGroup
                  type={RADIO_GROUP_TYPE.TYPE_2}
                  hideLabel
                  hideMessage
                  className={gClasses.MT10}
                  enableOptionDeselect={false}
                  optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_DATE_FIELDS.OPTION_LIST}
                  selectedValue={dateValidationData.type}
                  onClick={(value) => {
                    onValidationConfigChangeHandler({
                      target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_DATE_FIELDS.ID, value },
                    });
                  }
                  }
                />
                {dateFieldBasedSubType}
              </>
            )
          }
          <div className={cx(gClasses.FieldName, gClasses.PB10, gClasses.MT10)}>
            {VALIDATION_CONFIG.DATE_VALIDATIONS.OTHER_PREFERENCES.LABEL}
          </div>
          <CheckboxGroup
            optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.OPTION_LIST}
            id={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID}
            onClick={() => {
              onValidationConfigChangeHandler({
                target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID },
              });
            }}
            selectedValues={fieldData.validations[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_TODAY.ID] ? ['allow_today'] : []}
            hideLabel
            checkboxViewLabelClassName={enableAllowTodayCheckbox ? styles.ActiveCheckboxLabel : null}
            readOnly={!enableAllowTodayCheckbox}
          />
          <CheckboxGroup
            optionList={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_WORKING_DAY.OPTION_LIST}
            id={VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_WORKING_DAY.ID}
            onClick={() => {
              onValidationConfigChangeHandler({
                target: { id: VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_WORKING_DAY.ID },
              });
            }}
            selectedValues={fieldData.validations[VALIDATION_CONFIG.DATE_VALIDATIONS.ALLOW_WORKING_DAY.ID] ? ['allow_working_day'] : []}
            checkboxViewLabelClassName={styles.ActiveCheckboxLabel}
            hideLabel
            hideMessage
          />
          {workingDaysComponent}
        </>
      );
      break;
    case FIELD_TYPES.RADIO_GROUP:
    case FIELD_TYPES.DROPDOWN:
      currentComponent = (<div className={gClasses.FTwo18GrayV3}>{VALIDATION_CONFIG.YET_TO_BE_ADDED}</div>);
      break;

    case FIELD_TYPES.CURRENCY:
      currentComponent = (
          <Row>
            <Col sm={6}>
              <AddMembers
                id={VALIDATION_CONFIG.ALLOWED_CURRENCY_TYPES.ID}
                onUserSelectHandler={onAddCurrencyExtensionHandler}
                placeholder={
                  VALIDATION_CONFIG.ALLOWED_CURRENCY_TYPES.PLACEHOLDER
                }
                selectedData={allowed_currency_types}
                removeSelectedUser={onRemoveCurrencyExtensionHandler}
                errorText={allowedCurrencyErrorText || allowedCurrencyTypeErrorMessage}
                // selectedSuggestionData={this.state.current_selected_extension}
                memberSearchValue={currencyTypeSearchValue}
                setMemberSearchValue={(event) => {
                  setAllowedCurrencyErrorText(EMPTY_STRING);
                  setCurrencyTypeSearchValue(event.target.value);
                }}
                label={VALIDATION_CONFIG.ALLOWED_CURRENCY_TYPES.LABEL}
                getAllCurrencyTypes
                getAllowedCurrencyTypes
                allowedCurrencyList={allowedCurrencyList.filter((value) => !allowed_currency_types.includes(value))}
                hideUserIcon
              />
            </Col>
          </Row>
      );
      break;
    case FIELD_TYPES.CHECKBOX:
      currentComponent = (<div className={gClasses.FTwo18GrayV3}>{VALIDATION_CONFIG.YET_TO_BE_ADDED}</div>);
      break;
    case FIELD_TYPES.USER_TEAM_PICKER:
      const allow_multiple_pick = jsUtils.get(fieldData, ['validations', 'allow_multiple'], false);
      currentComponent = (
        <div>
          <div role="note" className={cx(gClasses.FTwo13BlackV13, gClasses.MB15)}>
            {FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_DATA_LIST.LABEL}
          </div>
          <CheckboxGroup
            className={gClasses.MB15}
            hideLabel
            hideMessage
            optionList={FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_DATA_LIST.OPTION_LIST}
            selectedValues={allow_multiple_pick ? [1] : []}
            onClick={() => {
              onValidationConfigChangeHandler({
                target: {
                  id: FIELD_CONFIG(t).VALIDATION_CONFIG.ALLOW_MULTIPLE_DATA_LIST.ID,
                  value: !allow_multiple_pick,
                },
              });
            }
            }
          />
          {allow_multiple_pick && (
            <div>
              {(
                <Input
                  id={VALIDATION_CONFIG.MIN_USER_SELECTION.ID}
                  placeholder={VALIDATION_CONFIG.MIN_USER_SELECTION.PLACEHOLDER}
                  // type="number"
                  label={VALIDATION_CONFIG.MIN_USER_SELECTION.LABEL}
                  onChangeHandler={(event) => {
                    onValidationConfigChangeHandler(event);
                  }}
                  onBlurHandler={onValidationConfigBlurHandler}
                  value={fieldData.validations.minimum_selection}
                  // hideLabel
                  errorMessage={minUserErrorMessage}
                />
              )}
              {(
                <Input
                  id={VALIDATION_CONFIG.MAX_USER_SELECTION.ID}
                  placeholder={VALIDATION_CONFIG.MAX_USER_SELECTION.PLACEHOLDER}
                  // type="number"
                  label={VALIDATION_CONFIG.MAX_USER_SELECTION.LABEL}
                  onChangeHandler={(event) => {
                    onValidationConfigChangeHandler(event);
                  }}
                  onBlurHandler={onValidationConfigBlurHandler}
                  value={fieldData.validations.maximum_selection}
                  // hideLabel
                  errorMessage={maxUserErrorMessage}
                />
              )}
            </div>
          )}
          <CheckboxGroup
            optionList={VALIDATION_CONFIG.IS_RESTRICTED.OPTION_LIST}
            id={VALIDATION_CONFIG.IS_RESTRICTED.ID}
            onClick={() =>
              onValidationConfigChangeHandler({
                target: { id: VALIDATION_CONFIG.IS_RESTRICTED.ID },
              })
            }
            selectedValues={
              fieldData.validations[VALIDATION_CONFIG.IS_RESTRICTED.ID]
                ? [1]
                : []
            }
            hideLabel
          />
          {fieldData.validations[VALIDATION_CONFIG.IS_RESTRICTED.ID] ? (
            <AddMembers
              id={VALIDATION_CONFIG.RESTRICTED_USER_TEAM.ID}
              placeholder={VALIDATION_CONFIG.RESTRICTED_USER_TEAM.PLACEHOLDER}
              hideLabel
              selectedData={getValidationTabUserTeamPickerSelectedData(
                jsUtils.get(fieldData, 'validations.restricted_user_team', []),
              )}
              getTeamsAndUsers
              isActive
              internalSearchValueState
              popperClassName={isTableField && styles.ValidationTabUserTeamPickerDropdown}
              errorText={userTeamPickerErrorMessage}
              onUserSelectHandler={(event) => {
                const updatedUserTeamObj = userTeamPickerChangeHandler(
                  jsUtils.get(
                    fieldData,
                    'validations.restricted_user_team',
                    [],
                  ),
                  jsUtils.get(event, 'target.value'),
                  USER_TEAM_PICKER_CHANGE_HANDLER_TYPES.USER_TEAM_PICKER_CH_ADD,
                );
                onValidationConfigChangeHandler({
                  target: {
                    id: VALIDATION_CONFIG.RESTRICTED_USER_TEAM.ID,
                    value: updatedUserTeamObj,
                  },
                });
              }}
              removeSelectedUser={(userOrTeamId) => {
                const updatedUserTeamObj = userTeamPickerChangeHandler(
                  jsUtils.get(
                    fieldData,
                    'validations.restricted_user_team',
                    [],
                  ),
                  userOrTeamId,
                  USER_TEAM_PICKER_CHANGE_HANDLER_TYPES.USER_TEAM_PICKER_CH_REMOVE,
                );
                onValidationConfigChangeHandler({
                  target: {
                    id: VALIDATION_CONFIG.RESTRICTED_USER_TEAM.ID,
                    value: updatedUserTeamObj,
                  },
                });
              }}
              apiParams={!isNormalMode && NON_PRIVATE_TEAMS_PARAMS}
            />
          ) : null}
        </div>
      );
      break;
    case FIELD_TYPES.PHONE_NUMBER:
    case FIELD_TYPES.DATA_LIST_PROPERTY_PICKER:
      currentComponent = (<div className={gClasses.FTwo18GrayV3}>{VALIDATION_CONFIG.YET_TO_BE_ADDED}</div>);
      break;
    case FIELD_TYPES.USER_PROPERTY_PICKER:
      currentComponent = (<div className={gClasses.FTwo18GrayV3}>{VALIDATION_CONFIG.YET_TO_BE_ADDED}</div>);
      break;
    default:
      break;
  }

  return currentComponent;
}
const mapStateToProps = (state, ownProps) => {
  const { accountDetails, isGetAccountConfigLoading } =
    state.EditFlowReducer;
  return {
    accountDetails,
    isGetAccountConfigLoading,
    working_days: state.LanguageAndCalendarAdminReducer.working_days,
    externalFieldsDropdownList: getVisibilityExternalFieldsDropdownList(
      state,
      ownProps.fieldData.field_uuid,
      false,
    ),
    hasMoreFields: getVisibilityExternalFieldsHasMore(state),
    externalFieldsPaginationDetails:
      getVisibilityExternalFieldsPaginationDetails(state),
    isExternalFieldsLoading: getVisibilityExternalFieldsLoadingStatus(state),
    externalFieldsDropdownData: state.VisibilityReducer.externalFieldReducer.externalFields,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLanguageAndCalendarData: (value) => {
      dispatch(getLanguageAndCalendarDataThunk(value));
      return Promise.resolve();
    },
    updateFlowState: (value) => {
      dispatch(updateFlowStateChange(value));
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ValidationConfig);
ValidationConfig.defaultProps = {
  fieldData: {},
  fieldType: EMPTY_STRING,
  onValidationConfigChangeHandler: null,
  onValidationConfigBlurHandler: null,
};
ValidationConfig.propTypes = {
  onValidationConfigChangeHandler: PropTypes.func,
  onValidationConfigBlurHandler: PropTypes.func,
  fieldData: PropTypes.objectOf(PropTypes.any),
  fieldType: PropTypes.string,
};
