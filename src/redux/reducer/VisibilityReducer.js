import { combineReducers } from 'redux';
import { FIELD_CONFIG } from 'components/form_builder/FormBuilder.strings';
import { createSlice } from '@reduxjs/toolkit';
import { VISIBILITY_CONSTANTS } from '../actions/ActionConstants';

import { isEmpty, get, uniqBy, has, cloneDeep } from '../../utils/jsUtility';
import { FIELD_KEYS, FIELD_TYPE } from '../../utils/constants/form.constant';

const externalFieldsState = {
  externalFields: {
    pagination_details: [],
    hasMore: false,
  },
  tableValidationFields: {
    pagination_details: [],
    hasMore: false,
  },
  datalistFields: {
    pagination_details: [],
    hasMore: false,
  },
  dataListFieldValues: {
    values: {},
    field_type: [],
  },
  isTableValidationFieldsLoading: true,
  isDataListFieldsLoading: true,
  isDataListFieldValuesLoading: true,
  isLoading: true,
  error_list: [],
  server_error: [],
  common_server_error: null,
  field_metadata: [],
  searchFields: {
    pagination_details: [],
    hasMore: false,
  },
  tableColConditionList: [],
};

const visibilityOperators = {
  operators: [],
  all_fields_operator: {},
  isLoading: true,
  error_list: [],
  server_error: [],
  common_server_error: null,
};

const FIELD_VISIBILITY_REDUCER = 'fieldVisibilityReducer';
const FIELD_VISIBILITY_INITIAL_STATE = {
   ruleList: [],
   activeRule: {
    _id: '',
    ruleName: '',
    ruleType: 0,
    ruleExpression: {},
    selectedFields: [],
    fieldVisible: 'hide',
    isExistingRule: false,
   },
   activeRuleLoading: false,
   activeRuleError: {},
};

const FIELD_DEFAULT_VALUE_REDUCER = 'fieldDefaultValueReducer';
const FIELD_DEFAULT_VALUE_INITIAL_STATE = {
    ruleList: [],
    activeRule: {
      _id: '',
      ruleName: '',
      ruleType: 2,
      ruleExpression: {},
      selectedFields: [],
      isExistingRule: false,
    },
    activeRuleLoading: false,
    activeRuleError: {},
};

const EXTERNAL_DATA_SOURCE_REDUCER = 'externalDataSourceReducer';
const EXTERNAL_DATA_SOURCE_INITIAL_STATE = {
    ruleList: [],
    activeRule: {
      _id: '',
      ruleName: '',
      ruleType: 2,
      ruleExpression: {},
      selectedFields: [],
      isExistingRule: false,
    },
    activeRuleLoading: false,
    activeRuleError: {},
};

function externalFieldReducer(state = externalFieldsState, action) {
  switch (action.type) {
    case VISIBILITY_CONSTANTS.EXTERNAL_FIELDS_STARTED: {
        return {
          ...state,
          isLoading: true,
        };
    }
    case VISIBILITY_CONSTANTS.TABLE_VALIDATION_FIELDS_STARTED: {
      return {
        ...state,
        isTableValidationFieldsLoading: true,
      };
    }
    case VISIBILITY_CONSTANTS.TABLE_VALIDATION_FIELDS_SUCCESS: {
      let response;
      if (get(action.response, ['pagination_details', 0, 'page'], 1) > 1) {
        response = {
          pagination_data: [...state.tableValidationFields.pagination_data, ...action.response.pagination_data],
          pagination_details: action.response.pagination_details,
          hasMore: false,
        };
      } else {
        response = {
          pagination_data: [...action.response.pagination_data],
          pagination_details: action.response.pagination_details,
          hasMore: false,
        };
      }
      if (action.response.pagination_details[0].total_count > response.pagination_data.length) response.hasMore = true;
      console.log('hasMore changing', response, action.response.pagination_details[0].total_count, response.pagination_data.length);
      return {
        ...state,
        tableValidationFields: { ...response },
        isTableValidationFieldsLoading: false,
      };
    }
    case VISIBILITY_CONSTANTS.TABLE_VALIDATION_FIELDS_FAILURE:
      return {
        ...state,
        ...action.error,
        isTableValidationFieldsLoading: false,
      };
    case VISIBILITY_CONSTANTS.DATALIST_FIELDS_STARTED: {
      return {
        ...state,
        isDataListFieldsLoading: true,
      };
    }
    case VISIBILITY_CONSTANTS.DATALIST_FIELDS_SUCCESS: {
      let response;
      if (get(action.response, ['pagination_details', 0, 'page'], 1) > 1) {
        response = {
          pagination_data: [...state.datalistFields.pagination_data, ...action.response.pagination_data],
          pagination_details: action.response.pagination_details,
          hasMore: false,
        };
      } else {
        response = {
          pagination_data: [...action.response.pagination_data],
          pagination_details: action.response.pagination_details,
          hasMore: false,
        };
      }
      if (action.response.pagination_details[0].total_count > response.pagination_data.length) response.hasMore = true;
      console.log('hasMore changing', response, action.response.pagination_details[0].total_count, response.pagination_data.length);
      const { values } = state.dataListFieldValues;
      action.response.pagination_data.forEach((field) => {
        if (FIELD_CONFIG(action?.t).VALIDATION_CONFIG.LIMIT_DATALIST.FILTER_FIELDS.FIELD.ALLOWED_FIELD_TYPES.selectionFields.includes(field.field_type)) {
          if (field.field_type === 'yesorno') {
            values[field.field_uuid] = [
              {
                label: 'No',
                value: false,
              },
              {
                label: 'Yes',
                value: true,
              },
            ];
          } else {
            const fieldValues = [];
            field.values.forEach((value) => {
              fieldValues.push({
                label: value,
                value: value,
              });
            });
            console.log('fieldValuesfieldValues', fieldValues);
            values[field.field_uuid] = fieldValues;
          }
        } else values[field.field_uuid] = [];
      });
      return {
        ...state,
        datalistFields: { ...response },
        isDataListFieldsLoading: false,
      };
    }
    case VISIBILITY_CONSTANTS.DATALIST_FIELDS_FAILURE:
      return {
        ...state,
        ...action.error,
        isDataListFieldsLoading: false,
      };
    case VISIBILITY_CONSTANTS.DATALIST_FIELDS_CLEAR:
      return {
        ...state,
        datalistFields: {
          pagination_details: [],
          hasMore: false,
        },
        isDataListFieldsLoading: false,
      };
    case VISIBILITY_CONSTANTS.DATALIST_FIELD_VALUES_STARTED: {
      return {
        ...state,
        isDataListFieldValuesLoading: true,
      };
    }
    case VISIBILITY_CONSTANTS.DATALIST_FIELD_VALUES_SUCCESS: {
      const { values } = state.dataListFieldValues;
      const fieldTypes = state.dataListFieldValues.field_type;
      values[action.filterIndex] = action.response;
      fieldTypes[action.filterIndex] = action.field_type;
      console.log('dataListFieldValues success', values);
      return {
        ...state,
        isDataListFieldValuesLoading: false,
        dataListFieldValues: {
          values: values,
          field_type: fieldTypes,
        },
      };
    }
    case VISIBILITY_CONSTANTS.DATALIST_FIELD_VALUES_FAILURE: {
      return {
        ...state,
        isDataListFieldValuesLoading: false,
      };
    }
    case VISIBILITY_CONSTANTS.DATALIST_FIELD_VALUES_CLEAR:
      return {
        ...state,
        dataListFieldValues: {
          values: [],
          field_type: [],
        },
        isDataListFieldsLoading: false,
      };
    case VISIBILITY_CONSTANTS.EXTERNAL_FIELDS_SUCCESS: {
      let response;
      let finalResponse = {};
      const { response: response_, isSearch = false } = action.payload;
      if (isSearch === true) {
        if (get(response_, ['pagination_details', 0, 'page'], 1) > 1) {
          response = {
            pagination_data: [...state.searchFields.pagination_data, ...response_.pagination_data],
            pagination_details: response_.pagination_details,
            hasMore: false,
          };
        } else {
          response = {
            pagination_data: [...response_.pagination_data],
            pagination_details: response_.pagination_details,
            hasMore: false,
          };
        }
        if (response_.pagination_details[0].total_count > response.pagination_data.length) response.hasMore = true;
        finalResponse = { searchFields: { ...response } };
      } else {
        if (get(response_, ['pagination_details', 0, 'page'], 1) > 1) {
          response = {
            pagination_data: [...state.externalFields.pagination_data, ...response_.pagination_data],
            pagination_details: response_.pagination_details,
            hasMore: false,
          };
        } else {
          response = {
            pagination_data: [...response_.pagination_data],
            pagination_details: response_.pagination_details,
            hasMore: false,
          };
        }
        if (response_.pagination_details[0].total_count > response.pagination_data.length) response.hasMore = true;
        finalResponse = { externalFields: { ...response } };
      }
      return {
        ...state,
        ...finalResponse,
        isLoading: false,
      };
    }
    case VISIBILITY_CONSTANTS.EXTERNAL_FIELDS_FAILURE:
      return {
        ...state,
        ...action.error,
        isLoading: false,
      };
    case VISIBILITY_CONSTANTS.EXTERNAL_FIELDS_CLEAR:
      return externalFieldsState;
    case VISIBILITY_CONSTANTS.SET_SELECTED_FIELD_INFO: {
      const { selectedFieldUuid } = action.payload;
      if (selectedFieldUuid) {
        const list = get(state, ['externalFields', 'pagination_data']);
        if (isEmpty(list)) return state;
        console.log('visibility', list, selectedFieldUuid, list.find((field) => field.field_uuid === selectedFieldUuid));
        const selectedFieldInfo = list.find((field) => field.field_uuid === selectedFieldUuid);
        return {
          ...state,
          selectedFieldInfo,
        };
      }
      return state;
    }
    case VISIBILITY_CONSTANTS.VISIBILITY_EXTERNAL_FIELD_DATA_CHANGE: {
      const { updatedExternalFields, fieldMetadata = [] } = action.payload;
      const externalFields = { ...state.externalFields };
      externalFields.pagination_data = updatedExternalFields;

      const field_metadata_ = uniqBy([...fieldMetadata, ...state.field_metadata], (field) => field.field_uuid);
      return {
        ...state,
        externalFields: { ...externalFields },
        field_metadata: field_metadata_ || [],
      };
    }
    case VISIBILITY_CONSTANTS.EXTERNAL_FIELD_REDUCER_DATA_CHANGE: {
      const { updatedExternalFieldReducer = {} } = action.payload;
      return {
        ...state,
        ...(updatedExternalFieldReducer),
      };
    }
    case VISIBILITY_CONSTANTS.TABLE_COLUMN_VISIBILITY: {
      return {
        ...state,
        tableColConditionList: action.payload,
      };
    }
    default:
      return state;
  }
}

function visibilityOperatorReducer(state = visibilityOperators, action) {
  switch (action.type) {
    case VISIBILITY_CONSTANTS.VISIBILITY_OPERATORS_STARTED: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case VISIBILITY_CONSTANTS.VISIBILITY_OPERATORS_FAILURE: {
      return {
        ...state,
        ...action.error,
        isLoading: false,
      };
    }
    case VISIBILITY_CONSTANTS.VISIBILITY_OPERATORS_SUCCESS: {
      const { operators, all_fields_operator } = action.payload;
      const updated_all_fields_operator = state.all_fields_operator;
      (Object.keys(all_fields_operator)).forEach((fieldType) => {
        if (!has(updated_all_fields_operator, [fieldType], false)) {
          updated_all_fields_operator[fieldType] = all_fields_operator[fieldType];
        }
      });

      return {
        ...state,
        operators,
        all_fields_operator: updated_all_fields_operator,
        isLoading: false,
      };
    }
    case VISIBILITY_CONSTANTS.CLEAR_VISIBILITY_OPERATORS: {
      return {
        ...visibilityOperators,
        all_fields_operator: {},
      };
    }
    default:
      return state;
  }
}

export const fieldVisibilityReducer = createSlice({
    name: FIELD_VISIBILITY_REDUCER,
    initialState: FIELD_VISIBILITY_INITIAL_STATE,
    reducers: {
      updateRuleList: (state, action) => {
        const { pagination_data = [], pagination_detail } = action.payload;
        if (pagination_detail?.page > 1) {
           return {
             ...state,
             ruleList: [
               ...(state?.ruleList || []),
               ...(pagination_data),
             ],
             paginationDetail: pagination_detail,
           };
        }

        return {
           ...state,
           ruleList: pagination_data,
           paginationDetail: pagination_detail,
        };
      },
      dataChange: (state, action) => {
          return {
                    ...state,
                    ...action.payload,
                };
        },
      setActiveRule: (state, action) => {
        return {
          ...state,
          activeRule: action.payload,
        };
      },
      setActiveRuleExpression: (state, action) => {
        return {
          ...state,
          activeRule: {
            ...state.activeRule,
            ruleExpression: {
              ...state.activeRule.ruleExpression,
              ...action.payload,
            },
          },
        };
      },
      setActiveRuleError: (state, action) => {
        return {
          ...state,
          activeRuleError: action.payload,
        };
      },
      clearActiveRule: (state) => {
        return {
          ...state,
          activeRule: FIELD_VISIBILITY_INITIAL_STATE.activeRule,
        };
      },
      clearState: () => FIELD_VISIBILITY_INITIAL_STATE,
    },
});

export const fieldDefaultValueReducer = createSlice({
  name: FIELD_DEFAULT_VALUE_REDUCER,
  initialState: FIELD_DEFAULT_VALUE_INITIAL_STATE,
  reducers: {
    updateRuleList: (state, action) => {
       const { pagination_data = [], pagination_detail } = action.payload;
       if (pagination_detail?.page > 1) {
          return {
            ...state,
            ruleList: [
              ...(state?.ruleList || []),
              ...(pagination_data),
            ],
            paginationDetail: pagination_detail,
          };
       }

       return {
          ...state,
          ruleList: pagination_data,
          paginationDetail: pagination_detail,
       };
    },
    dataChange: (state, action) => {
      return {
                ...state,
                ...action.payload,
            };
    },
    setActiveRule: (state, action) => {
      return {
        ...state,
        activeRule: action.payload,
      };
    },
    activeRuleDataChange: (state, action) => {
      const clonedState = cloneDeep(state);
      return {
        ...clonedState,
        activeRule: {
          ...(clonedState?.activeRule || {}),
          ...(action.payload || {}),
        },
      };
    },
    setActiveRuleError: (state, action) => {
      return {
        ...state,
        activeRuleError: action.payload,
      };
    },
    clearActiveRule: (state) => {
      return {
        ...state,
        activeRule: FIELD_DEFAULT_VALUE_INITIAL_STATE.activeRule,
      };
    },
   clearState: () => FIELD_DEFAULT_VALUE_INITIAL_STATE,
  },
});

export const externalDataSourceReducer = createSlice({
  name: EXTERNAL_DATA_SOURCE_REDUCER,
  initialState: EXTERNAL_DATA_SOURCE_INITIAL_STATE,
  reducers: {
    updateRuleList: (state, action) => {
       const { pagination_data = [], pagination_detail } = action.payload;
       if (pagination_detail?.page > 1) {
          return {
            ...state,
            ruleList: [
              ...(state?.ruleList || []),
              ...(pagination_data),
            ],
            paginationDetail: pagination_detail,
          };
       }

       return {
          ...state,
          ruleList: pagination_data,
          paginationDetail: pagination_detail,
       };
    },
    dataChange: (state, action) => {
      return {
                ...state,
                ...action.payload,
            };
    },
    setActiveRule: (state, action) => {
      return {
        ...state,
        activeRule: action.payload,
      };
    },
    activeRuleDataChange: (state, action) => {
      const clonedState = cloneDeep(state);
      return {
        ...clonedState,
        activeRule: {
          ...(clonedState?.activeRule || {}),
          ...(action.payload || {}),
        },
      };
    },
    setActiveRuleError: (state, action) => {
      return {
        ...state,
        activeRuleError: action.payload,
      };
    },
    clearActiveRule: (state) => {
      return {
        ...state,
        activeRule: EXTERNAL_DATA_SOURCE_INITIAL_STATE.activeRule,
      };
    },
   clearState: () => EXTERNAL_DATA_SOURCE_INITIAL_STATE,
  },
});

export const {
  updateRuleList: fieldVisibilityUpdateRuleList,
  dataChange: fieldVisibilityDataChange,
  clearState: fieldVisibilityClearState,
  setActiveRule: setVisibilityActiveRule,
  clearActiveRule: clearVisibilityActiveRule,
  setActiveRuleError: setVisibilityActiveRuleError,
  setActiveRuleExpression: setVisibilityRuleExpression,
} = fieldVisibilityReducer.actions;

export const {
  updateRuleList: fieldDefaultValueUpdateRuleList,
  dataChange: fieldDefaultValueDataChange,
  clearState: fieldDefaultValueClearState,
  setActiveRule: setDefaultValueActiveRule,
  clearActiveRule: clearDefaultValueActiveRule,
  setActiveRuleError: setDefaultValueActiveRuleError,
  activeRuleDataChange: defaultValueActiveRuleDataChange,
} = fieldDefaultValueReducer.actions;

export const {
  updateRuleList: externalSourceUpdateRuleList,
  dataChange: externalSourceDataChange,
  clearState: externalSourceClearState,
  setActiveRule: setExternalSourceActiveRule,
  clearActiveRule: clearExternalSourceActiveRule,
  setActiveRuleError: setExternalSourceActiveRuleError,
  activeRuleDataChange: externalSourceActiveRuleDataChange,
} = externalDataSourceReducer.actions;

export default combineReducers({
  externalFieldReducer,
  visibilityOperatorReducer,
  fieldVisibilityReducer: fieldVisibilityReducer.reducer,
  fieldDefaultValueReducer: fieldDefaultValueReducer.reducer,
  externalDataSourceReducer: externalDataSourceReducer.reducer,
});

// EXTERNAL FIELDS
export const getVisibilityExternalFieldsData = (state) => get(state, ['externalFieldReducer', 'externalFields', 'pagination_data']);
export const getTableValidationFieldsPaginationData = (state) => get(state, ['externalFieldReducer', 'tableValidationFields', 'pagination_data']);
export const getDatalistFieldsPaginationData = (state) => get(state, ['externalFieldReducer', 'datalistFields', 'pagination_data']);
export const getDatalistFieldValues = (state) => get(state, ['externalFieldReducer', 'dataListFieldValues', 'values']);
export const getVisibilityExternalFieldsPaginationDetails = (state) => get(state, ['externalFieldReducer', 'externalFields', 'pagination_details', 0]);
export const getTableValidationFieldsPaginationDetails = (state) => get(state, ['externalFieldReducer', 'tableValidationFields', 'pagination_details', 0]);
export const getVisibilityExternalFieldsHasMore = (state) => state.externalFieldReducer.externalFields.hasMore;
export const getTableValidationFieldsHasMore = (state) => state.externalFieldReducer.tableValidationFields.hasMore;
export const getVisibilityExternalFieldsLoadingStatus = (state) => state.externalFieldReducer.isLoading;
export const getTableValidationFieldsLoadingStatus = (state) => state.externalFieldReducer.isTableValidationFieldsLoading;
export const getVisibilityExternalFieldsErrors = (state) => { return { errorList: state.externalFieldReducer.error_list, serverError: state.externalFieldReducer.server_error, commonServerError: state.externalFieldReducer.common_server_error }; };
export const getVisibilityFieldMetaData = (state) => get(state, ['externalFieldReducer', 'field_metadata'], []);
export const getVisibilitySearchFields = (state) => get(state, ['externalFieldReducer', 'searchFields', 'pagination_data'], []);

export const getVisibilityExternalFieldsAndFieldMetadataData = (state) => {
  const external_field = getVisibilityExternalFieldsData(state);
  const field_metadata = getVisibilityFieldMetaData(state);
  return uniqBy([...(external_field || []), ...(field_metadata || [])], (field) => field.field_uuid);
};

// const CHOICE_VALUE_MAPPING = {
//   date: FIELD_TYPE.DATE,
//   text: FIELD_TYPE.SINGLE_LINE,
//   number: FIELD_TYPE.NUMBER,
// };

export const getVisibilityExternalFieldsDropdownListByChoiceValueType = (state, currentFieldUuid, excludeDateTime = false, isSearch = false) => {
  const list = (isSearch === true) ? getVisibilitySearchFields(state) : getVisibilityExternalFieldsAndFieldMetadataData(state);
  if (isEmpty(list)) return [];
  const optionList = [];
  list.forEach((field) => {
    if (field.field_uuid !== currentFieldUuid) {
      if (!excludeDateTime || (field.field_type !== FIELD_TYPE.DATETIME)) {
        const fieldObject = {
          label: field.label,
          value: field.field_uuid,
          fieldId: field._id,
          // field_type: (field.choice_value_type && field.field_type !== FIELD_TYPE.CHECKBOX) ? CHOICE_VALUE_MAPPING[field.choice_value_type] : field.field_type,
          field_type: field.field_type,
          original_field_type: field.field_type,
          choice_value_type: field.choice_value_type,
        };
        if (has(field, [FIELD_KEYS.PROPERTY_PICKER_DETAILS], false)) {
              fieldObject[FIELD_KEYS.PROPERTY_PICKER_DETAILS] = field[FIELD_KEYS.PROPERTY_PICKER_DETAILS];
        }
        if (field.field_type === FIELD_TYPE.CURRENCY) {
              fieldObject[FIELD_KEYS.VALIDATIONS] = field[FIELD_KEYS.VALIDATIONS];
         }
        if (has(field, [FIELD_KEYS.VALUES], false)) {
              fieldObject[FIELD_KEYS.VALUES] = field[FIELD_KEYS.VALUES];
         }
        if (has(field, [FIELD_KEYS.CHOICE_VALUES], false)) {
              fieldObject[FIELD_KEYS.VALUES] = field[FIELD_KEYS.CHOICE_VALUES];
         }
        optionList.push(fieldObject);
      }
    }
  });
  return optionList;
};

export const getEachFieldExternalField = (field) => {
  if (!field) return {};
  const fieldObject = {
    label: field.label,
    value: field.field_uuid,
    fieldId: field._id,
    field_uuid: field.field_uuid,
    field_list_type: field.field_list_type,
    // field_type: (field.choice_value_type && field.field_type !== FIELD_TYPE.CHECKBOX) ? CHOICE_VALUE_MAPPING[field.choice_value_type] : field.field_type,
    field_type: field.field_type,
    original_field_type: field.field_type,
    choice_value_type: field.choice_value_type,
  };

  if (has(field, ['table_uuid'], false)) fieldObject.table_uuid = field.table_uuid;
  if (has(field, [FIELD_KEYS.PROPERTY_PICKER_DETAILS], false)) {
        fieldObject[FIELD_KEYS.PROPERTY_PICKER_DETAILS] = field[FIELD_KEYS.PROPERTY_PICKER_DETAILS];
        fieldObject.field_type = field[FIELD_KEYS.PROPERTY_PICKER_DETAILS].reference_field_type;
        if (has(field, [FIELD_KEYS.PROPERTY_PICKER_DETAILS, 'reference_field_choice_value_type'], false)) {
          fieldObject.choice_value_type = field[FIELD_KEYS.PROPERTY_PICKER_DETAILS].reference_field_choice_value_type;
          fieldObject[FIELD_KEYS.VALUES] = field[FIELD_KEYS.PROPERTY_PICKER_DETAILS][FIELD_KEYS.CHOICE_VALUES];
        }
  }
  if (field.field_type === FIELD_TYPE.CURRENCY) {
        fieldObject[FIELD_KEYS.VALIDATIONS] = field[FIELD_KEYS.VALIDATIONS];
   }
  if (has(field, [FIELD_KEYS.VALUES], false)) {
        fieldObject[FIELD_KEYS.VALUES] = field[FIELD_KEYS.VALUES];
   }
  if (has(field, [FIELD_KEYS.CHOICE_VALUES], false)) {
    // console.log('xyz field', field);
        if (field.choice_value_type === 'date') {
          fieldObject[FIELD_KEYS.VALUES] = (field[FIELD_KEYS.CHOICE_VALUES] || []).map((v) => { return { ...v, value: v.value.substring(0, 10) }; });
        } else {
          fieldObject[FIELD_KEYS.VALUES] = field[FIELD_KEYS.CHOICE_VALUES];
        }
   }
  return fieldObject;
};

export const getVisibilityExternalFieldsDropdownList = (state, currentFieldUuid, excludeDateTime = false, isSearch = false) => {
  const list = (isSearch === true) ? getVisibilitySearchFields(state) : getVisibilityExternalFieldsAndFieldMetadataData(state);
  if (isEmpty(list)) return [];
  const optionList = [];
  list.forEach((field) => {
    if (field.field_uuid !== currentFieldUuid) {
      if (!excludeDateTime || (field.field_type !== FIELD_TYPE.DATETIME)) {
        optionList.push(getEachFieldExternalField(field));
      }
    }
  });
  return optionList;
};

export const getTableValidationlFieldsDropdownList = (state) => {
  const list = getTableValidationFieldsPaginationData(state);
  if (isEmpty(list)) return [];
  const optionList = [];
  list.forEach((field) => {
    optionList.push({ label: field.label, value: field.field_uuid, fieldId: field._id });
  });
  return optionList;
};

export const getDataListFieldsDropdownList = (state) => {
  const list = getDatalistFieldsPaginationData(state);
  if (isEmpty(list)) return [];
  const optionList = [];
  list.forEach((field) => {
    optionList.push({ label: field.label, value: field.field_uuid, fieldId: field._id, field_type: field.field_type });
  });
  return optionList;
};

export const getDataListFieldValuesList = (state) => {
  const values = getDatalistFieldValues(state);
  console.log('getDataListFieldValuesList', values, state);
  if (isEmpty(values)) return [];
  console.log('getDataListFieldValuesList return', values);
  return values;
};

// OPERATORS
export const getVisibilityOperatorsData = (state) => get(state, ['visibilityOperatorReducer', 'operators']);
export const getVisibilityOperatorsLoadingStatus = (state) => get(state, ['visibilityOperatorReducer', 'isLoading']);
export const getVisibilityOperatorsErrors = (state) => { return { errorList: state.visibilityOperatorReducer.error_list, serverError: state.visibilityOperatorReducer.server_error, commonServerError: state.visibilityOperatorReducer.common_server_error }; };
export const getVisibilitySpecificOperatorsData = (state, fieldType) => {
  const specificFieldTypeOperators = get(state, ['visibilityOperatorReducer', 'all_fields_operator', fieldType], {});
  return specificFieldTypeOperators || {};
};
export const getVisibilityOperatorsDropdownList = (state, fieldType = null) => {
  const list = (!fieldType) ? getVisibilityOperatorsData(state) : getVisibilitySpecificOperatorsData(state, fieldType);
  if (isEmpty(list)) return [];
  return list.map((operator) => { return { label: operator.label, value: operator.operator }; });
};
export const getAllFieldsOperator = (state) => get(state, ['visibilityOperatorReducer', 'all_fields_operator'], []);
