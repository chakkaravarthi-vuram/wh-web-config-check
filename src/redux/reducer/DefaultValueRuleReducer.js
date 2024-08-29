import { combineReducers } from 'redux';
import { OPERATOR_PICKER_VALUE } from 'components/form_builder/field_config/basic_config/DefaultValueRule.strings';
import { FIELD_LIST_TYPE } from '../../utils/constants/form.constant';
import { OPERAND_TYPES } from '../../utils/constants/rule/operand_type.constant';

import { isEmpty, get, uniqBy, translateFunction } from '../../utils/jsUtility';

import { DEFAULT_VALUE_RULE_CONSTANTS, EXTERNAL_FIELD_VALUES_CONSTANTS } from '../actions/ActionConstants';

const defaultValue = {
  defaultValue: [],
  isLoading: true,
  error_list: [],
  server_error: [],
  roundingList: [],
  common_server_error: null,
};

const externalFieldsState = {
  externalFields: {
    pagination_details: [],
    pagination_data: [],
  },
  isLoading: true,
  error_list: [],
  server_error: [],
  common_server_error: null,
  field_metadata: [],
};

function externalFieldReducer(state = externalFieldsState, action) {
  switch (action.type) {
    case EXTERNAL_FIELD_VALUES_CONSTANTS.STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case EXTERNAL_FIELD_VALUES_CONSTANTS.SUCCESS: {
      let response;
      if (get(action.response, ['pagination_details', 0, 'page'], 1) > 1) {
        response = {
          pagination_data: [...state.externalFields.pagination_data, ...action.response.pagination_data],
          pagination_details: action.response.pagination_details,
        };
      } else {
        response = {
          pagination_data: [...action.response.pagination_data],
          pagination_details: action.response.pagination_details,
        };
      }
      return {
        ...state,
        externalFields: { ...response },
        isLoading: false,
      };
    }
    case EXTERNAL_FIELD_VALUES_CONSTANTS.FAILURE:
      return {
        ...state,
        ...action.error,
        isLoading: false,
      };
    case EXTERNAL_FIELD_VALUES_CONSTANTS.DATA_CHANGE:
      return {
        ...state,
        ...action.response,
      };
    case EXTERNAL_FIELD_VALUES_CONSTANTS.CLEAR:
      return externalFieldsState;
    default:
      return state;
  }
}

function defaultOperatorsReducer(state = defaultValue, action) {
  switch (action.type) {
    case DEFAULT_VALUE_RULE_CONSTANTS.STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case DEFAULT_VALUE_RULE_CONSTANTS.SUCCESS:
      return {
        ...state,
        defaultValue: { ...action.response },
        isLoading: false,
      };
    case DEFAULT_VALUE_RULE_CONSTANTS.FAILURE:
      return {
        ...state,
        ...action.error,
        isLoading: false,
      };
    case DEFAULT_VALUE_RULE_CONSTANTS.CLEAR:
      return defaultValue;
    default:
      return state;
  }
}

export default combineReducers({ defaultOperatorsReducer, externalFieldReducer });

export const getSelectedDefaultValueRuleOperator = (state, operator, fieldType) => {
  if (isEmpty(operator)) return {};
  const list = get(state.defaultOperatorsReducer, ['defaultValue', fieldType], []);
  return list.find((element) => element.operator === operator);
};

export const getDefaultRuleValueDropdownList = (state, fieldType, isTableField, t = translateFunction) => {
  const list = get(state.defaultOperatorsReducer, ['defaultValue', fieldType], []);
  if (isEmpty(list)) return [];
  const optionList = [];
  const segments = new Map();
  list.forEach((operator) => {
    if (isTableField === !!operator.is_source_table_field) {
      if (!segments.get(operator.function_category) && operator.function_category) {
        segments.set(operator.function_category, 1);
        optionList.push({ label: `${operator.function_category} ${t(OPERATOR_PICKER_VALUE.LABEL)}`, header: true });
      }
      optionList.push({ label: operator.label, value: operator.operator });
    }
  });
  return optionList;
};

export const getOperatorsInfoByFieldType = (state, fieldType) => get(state.defaultOperatorsReducer, ['defaultValue', fieldType], []);
export const getDefaultRuleLoadingStatus = (state) => state.defaultOperatorsReducer.isLoading;
export const getDefaultRuleListErrors = (state) => { return { errorList: state.defaultOperatorsReducer.error_list, serverError: state.defaultOperatorsReducer.server_error, commonServerError: state.defaultOperatorsReducer.common_server_error }; };
export const getRoundingList = (state) => state.defaultOperatorsReducer.roundingList;

export const getDefaultRuleExternalFieldsData = (state) => get(state, ['externalFieldReducer', 'externalFields', 'pagination_data']);
export const getDefaultRuleExternalFieldMetaData = (state) => get(state, ['externalFieldReducer', 'field_metadata'], []);

export const getAllDefaultRuleExternalFields = (state) => uniqBy([
    ...(getDefaultRuleExternalFieldsData(state) || []),
    ...(getDefaultRuleExternalFieldMetaData(state) || []),
], (field) => field.field_uuid);
export const getDefaultRuleExternalFieldsPaginationDetails = (state) => get(state, ['externalFieldReducer', 'externalFields', 'pagination_details', 0]);
export const getDefaultRuleExternalFieldsLoadingStatus = (state) => state.externalFieldReducer.isLoading;
export const getDefaultRuleExternalFieldsErrors = (state) => { return { errorList: state.externalFieldReducer.error_list, serverError: state.externalFieldReducer.server_error, commonServerError: state.externalFieldReducer.common_server_error }; };
export const getDefaultRuleExternalFieldsDropdownList = (state, currentFieldId, tableUuid, isTableField, selectedOperatorInfo = {}) => {
  const list = getDefaultRuleExternalFieldsData(state);
  if (isEmpty(list)) return [];
  const optionList = [];
  list?.forEach((field) => {
    if (
        field._id !== currentFieldId &&
        (
          (isTableField && field.table_uuid === tableUuid) ||
          !isTableField
        ) &&
        (
          (
            field.field_list_type === FIELD_LIST_TYPE.TABLE &&
            selectedOperatorInfo.is_table_field_allowed
          ) ||
          (
            field.field_list_type === FIELD_LIST_TYPE.DIRECT &&
            selectedOperatorInfo.is_direct_field_allowed
          )
        )
      ) {
      optionList.push({ label: field.label || field.field_name, value: field.field_uuid });
    }
  });
  return optionList;
};
export const getDefaultRuleExternalFieldMetadataDropdownList = (state, currentFieldId, tableUuid, isTableField, selectedOperatorInfo = {}) => {
  const list = getDefaultRuleExternalFieldMetaData(state);
  if (isEmpty(list)) return [];
  const optionList = [];
  list?.forEach((field) => {
    if (
      field._id !== currentFieldId &&
      (
        (isTableField && field.table_uuid === tableUuid) ||
        !isTableField
      ) &&
      (
        (
          field.field_list_type === FIELD_LIST_TYPE.TABLE &&
          selectedOperatorInfo.is_table_field_allowed
        ) ||
        (
          field.field_list_type === FIELD_LIST_TYPE.DIRECT &&
          selectedOperatorInfo.is_direct_field_allowed
        )
      )
    ) {
      optionList.push({ label: field?.field_name || field.reference_name, value: field.field_uuid });
    }
  });
  return optionList;
};

export const isMultiSelectOperator = (selectedOperatorInfo = {}) => {
  switch (selectedOperatorInfo.operand_field) {
    case OPERAND_TYPES.MULTI_FIELD_PICKER:
    case OPERAND_TYPES.DUAL_FIELD_PICKER:
      return true;
    default:
      return false;
  }
};

export const getRoundingOptionList = (operatorInfo = {}) => {
  if (get(operatorInfo, 'is_rounding')) return operatorInfo.rounding_types.map((roundingType) => { return { label: Object.keys(roundingType)[0], value: roundingType[Object.keys(roundingType)[0]] }; });
  return false;
};

export const getConcatWithOptionList = (operatorInfo = {}) => {
  if (get(operatorInfo, 'is_concat_with')) return operatorInfo.concat_with_types.map((concat_with) => { return { label: Object.keys(concat_with)[0], value: concat_with[Object.keys(concat_with)[0]] }; });
  return false;
};
