import { createAction, createReducer } from '@reduxjs/toolkit';
import { CREATE_DATA_LIST } from '../actions/ActionConstants';
import jsUtils, { cloneDeep, get, set } from '../../utils/jsUtility';
import { FIELD_KEYS, FIELD_LIST_KEYS, GET_SECTION_INITIAL_DATA } from '../../utils/constants/form.constant';
import { POLICY_STRINGS } from '../../containers/edit_flow/security/security_policy/SecurityPolicy.strings';

const { EMPTY_STRING } = require('../../utils/strings/CommonStrings');

export const dataListStateChangeAction = createAction(
  CREATE_DATA_LIST.DATA_LIST_STATE_CHANGE,
  (content, id) => {
    return {
      payload: { content, id },
    };
  },
);

export const updatePolicyConditon = createAction(CREATE_DATA_LIST.UPDATE_POLICY_CONDITION, (payload) => { return { payload }; });

export const dataListInitialLoading = createAction(
  CREATE_DATA_LIST.DATA_LIST_INITIAL_LOADING,
  (content) => {
    return { payload: content };
  },
);

export const dataListFormLoading = createAction(
  CREATE_DATA_LIST.DATA_LIST_FORM_LOADING,
  (content) => {
    return { payload: content };
  },
);

export const dataListValuesStateChangeAction = createAction(
  CREATE_DATA_LIST.DATA_LIST_VALUES_STATE_CHANGE,
  (content) => {
    return {
      payload: content,
    };
  },
);
export const saveDataListFailedAction = createAction(
  CREATE_DATA_LIST.SAVE_DATA_LIST_FAILURE,
  (error) => {
    return {
      payload: { error },
    };
  },
);
export const saveDataListStartedAction = createAction(CREATE_DATA_LIST.SAVE_DATA_LIST_STARTED);
export const dataListClearAction = createAction(CREATE_DATA_LIST.CLEAR);
export const isEditDatalistAction = createAction(CREATE_DATA_LIST.IS_EDIT_DL, (content) => {
  return { payload: content };
});
export const totalDataListUpdate = createAction(CREATE_DATA_LIST.TOTAL_UPDATE, (sections) => {
  return {
    payload: sections,
  };
});
export const saveRuleAction = createAction(CREATE_DATA_LIST.SAVE_RULE, (response, id, sectionIndex, fieldListIndex, fieldIndex = null) => {
  return {
    payload: {
      response, sectionIndex, fieldListIndex, fieldIndex, id,
    },
  };
});

export const ruleFieldTypeChangeDataListStarted = createAction(
  CREATE_DATA_LIST.GET_ALL_OPERATORS_DATA_LIST_STARTED,
);
export const ruleFieldTypeChangeDataListSucess = createAction(
  CREATE_DATA_LIST.GET_ALL_OPERATORS_DATA_LIST_SUCCESS,
  (data) => {
    return {
      payload: data,
    };
  },
);

export const createDataListIntSetState = createAction(CREATE_DATA_LIST.SET_STATE);

export const createDataListSetState = (data) => (dispatch) => {
  dispatch(createDataListIntSetState(data));
  return Promise.resolve();
};

export const setSectionData = createAction(CREATE_DATA_LIST.SET_SECTION_VALUE, (id, value, sectionIndex, toggle = false) => {
  return {
    payload: {
      id,
      value,
      sectionIndex,
      toggle,
    },
  };
});

export const setSectionDataAction = (id, value, sectionIndex, toggle = false) => (dispatch) => {
  dispatch(setSectionData(id, value, sectionIndex, toggle));
  return Promise.resolve();
};

export const ruleFieldTypeChangeDataListIntSucess = (content) => (dispatch) => {
  dispatch(ruleFieldTypeChangeDataListSucess(content));
  return Promise.resolve();
};

export const openFieldConfig = createAction(CREATE_DATA_LIST.OPEN_FIELD_CONFIG, (sectionIndex, fieldListIndex, fieldIndex = null) => {
  return {
    payload: {
      sectionIndex,
      fieldListIndex,
      fieldIndex,
    },
  };
});

export const setFieldIntData = createAction(CREATE_DATA_LIST.SET_FIELD_VALUE, (id, value, sectionIndex, fieldListIndex, fieldIndex, toggle = false) => {
  return {
    payload: {
      id,
      value,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      toggle,
    },
  };
});

export const setIntEntireField = createAction(CREATE_DATA_LIST.SET_ENTIRE_FIELD, (field, sectionIndex, fieldListIndex, fieldIndex) => {
  return {
    payload: {
      field,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
    },
  };
});

export const setEntireField = (field, sectionIndex, fieldListIndex, fieldIndex, checkErrorCb) => (dispatch, getState) => {
  dispatch(setIntEntireField(field, sectionIndex, fieldListIndex, fieldIndex));
  if (checkErrorCb) {
    const { CreateDataListReducer } = getState();
    checkErrorCb(CreateDataListReducer);
  }
  return Promise.resolve();
};

export const setFieldData = (id, value, sectionIndex, fieldListIndex, fieldIndex, toggle = false, checkErrorCb) => (dispatch, getState) => {
  dispatch(setFieldIntData(id, value, sectionIndex, fieldListIndex, fieldIndex, toggle));
  if (checkErrorCb) {
    const { CreateDataListReducer } = getState();
    checkErrorCb(CreateDataListReducer);
  }
  return Promise.resolve();
};

export const setFieldIntListData = createAction(CREATE_DATA_LIST.SET_FIELD_LIST_VALUE, (id, value, sectionIndex, fieldListIndex, toggle = false) => {
  return {
    payload: {
      id,
      value,
      sectionIndex,
      fieldListIndex,
      toggle,
    },
  };
});

export const setFieldListValidationData = createAction(CREATE_DATA_LIST.SET_FIELD_LIST_VALIDATION, (id, value, sectionIndex, fieldListIndex, toggle = false) => {
  return {
    payload: {
      id,
      value,
      sectionIndex,
      fieldListIndex,
      toggle,
    },
  };
});

export const setFieldListValidation = (id, value, sectionIndex, fieldListIndex, fieldIndex, toggle = false, checkErrorCb) => (dispatch, getState) => {
  dispatch(setFieldListValidationData(id, value, sectionIndex, fieldListIndex, fieldIndex, toggle));
  if (checkErrorCb) {
    const { CreateDataListReducer } = getState();
    checkErrorCb(CreateDataListReducer);
  }
  return Promise.resolve();
};

export const setFieldListData = (id, value, sectionIndex, fieldListIndex, toggle = false, checkErrorCb) => (dispatch, getState) => {
  dispatch(setFieldIntListData(id, value, sectionIndex, fieldListIndex, toggle));
  if (checkErrorCb) {
    const { CreateDataListReducer } = getState();
    checkErrorCb(CreateDataListReducer);
  }
  return Promise.resolve();
};

export const setDefaultRuleFieldData = createAction(CREATE_DATA_LIST.SET_DEFAULT_RULE_VALUE, (id, value, sectionIndex, fieldListIndex, fieldIndex, errorCheckerCallBack, toggle = false, isInitial = false) => {
  return {
    payload: {
      id,
      value,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
      errorCheckerCallBack,
      toggle,
      isInitial,
    },
  };
});

export const setVisibilityFieldData = createAction(CREATE_DATA_LIST.SET_VISIBILITY_FIELD_DATA, (id, value, sectionIndex, fieldListIndex, fieldIndex) => {
  return {
    payload: {
      id, value, sectionIndex, fieldListIndex, fieldIndex,
    },
  };
});

const setIntErrorList = createAction(
  CREATE_DATA_LIST.SET_ERROR_LIST,
  (errorList, setDataListSelectorErrorListData = false) => {
    return { payload: { errorList, setDataListSelectorErrorListData } };
  },
);
export const setErrorListData = (errorList) => (dispatch) => {
  dispatch(setIntErrorList(errorList));
  return Promise.resolve();
};

export const setDataListSelectorErrorListData = (errorList) => (dispatch) => {
  dispatch(setIntErrorList(errorList, true));
  return Promise.resolve();
};

export const ruleFieldTypeChangeDataListFailed = createAction(
  CREATE_DATA_LIST.GET_ALL_OPERATORS_DATA_LIST_FAILED,
  (error) => {
    return {
      payload: error,
    };
  },
);

export const getAllFieldsDataListStartedAction = createAction(
  CREATE_DATA_LIST.GET_ALL_FIELDS_DATA_LIST_STARTED,
);
export const getAllFieldsDataListSuccessAction = createAction(
  CREATE_DATA_LIST.GET_ALL_FIELDS_DATA_LIST_SUCCESS,
  (fieldsList) => {
    return {
      payload: fieldsList,
    };
  },
);

export const getAllFieldsDataListFailedAction = createAction(
  CREATE_DATA_LIST.GET_ALL_FIELDS_DATA_LIST_FAILED,
  (error) => {
    return {
      payload: error,
    };
  },
);

export const createDatalistChange = createAction(
  CREATE_DATA_LIST.CREATE_DATALIST_CHANGE,
  (datalistObject) => {
    return {
      payload: datalistObject,
    };
  },
);

const initState = {
  isDataListModalDisabled: false,
  isEditDatalist: true,
  tabIndex: 1,
  data_list_name: EMPTY_STRING,
  policyList: [],
  data_list_description: EMPTY_STRING,
  data_list_color: {},
  data_list_id: EMPTY_STRING,
  data_list_uuid: EMPTY_STRING,
  canReassign: false,

  data_field_type: 1,
  sectionTitle: EMPTY_STRING,
  sectionTitleError: EMPTY_STRING,
  sections: [
    GET_SECTION_INITIAL_DATA(),
  ],
  addFormFieldsDropdownVisibilityData: false,
  form_details: {},
  temporary_form_details: {},
  flowSettingsModalVisibility: false,

  allIdentifierFields: [],
  is_system_identifier: true,
  custom_identifier: null,
  selected_identifier: null,
  editDataListDropdownSelectedValue: 0,

  security: {
    ownerSearchValue: '',
    selectedOwner: '',
    owners: {},
    additional_owners: true,

    reassignedOwnerSearchValue: '',
    selectedReassignedOwner: '',
    reassignedOwners: {},

    updaterSearchValue: '',
    selectedUpdater: '',
    entry_adders: {},

    viewerSearchValue: '',
    selectedViewer: '',
    viewers: {},
    additional_viewers: false,

    entityViewers: {},
    selectedEntityViewer: {},
    entityViewerSearchValue: EMPTY_STRING,

    is_participants_level_security: true,
  },

  metrics: {
    metric_fields: [],
    isShowMetricAdd: false,
    lstAllFields: [],
    l_field: EMPTY_STRING,
    err_l_field: {
      // metrics: EMPTY_STRING,
      // alternate_label: EMPTY_STRING,
    },
  },

  category: '',
  categoryData: {
    categoryCurrentPage: 1,
    categoryCountPercall: 5,
    categoryTotalCount: 1,
    categoryList: [],
    newCategoryValue: '',
    categoryValueError: '',
  },

  lstAllFields: [],
  hasMore: false,
  metricCurrentPage: 1,
  identifierCurrentPage: 1,
  isRuleFieldTypeChangeLoading: false,
  error_list: {},
  datalist_selector_error_list: {},
  additional_error_list: {},
  server_error: {},
  common_server_error: EMPTY_STRING,
  isFieldsListLoading: false,
  isOperatorsListLoading: true,
  isEditInitialLoading: false,
  isFormDetailsLoading: false,
  status: '',
  version_number: 1,
  isFromPromptCreation: false,
};

const clonedInitialState = jsUtils.cloneDeep(initState);

const createDataListReducer = createReducer(initState, (builder) => {
  builder
    .addCase(dataListStateChangeAction, (state, action) => {
      state[action.payload.id] = action.payload.content;
    })
    .addCase(updatePolicyConditon, (state, { payload }) => {
            const clonedState = cloneDeep(state);
            const { expression, policyUUID } = payload;
            const clonedPolicies = get(clonedState, ['policyList'], []);
            const policyIndex = clonedPolicies.findIndex((eachPolicy) => eachPolicy?.[POLICY_STRINGS.REQUEST_KEYS.POLICY_UUID] === policyUUID);

            if (policyIndex > -1) {
                set(state, ['policyList', policyIndex, POLICY_STRINGS.REQUEST_KEYS.POLICY], expression);
            }
    })
    .addCase(dataListValuesStateChangeAction, (state, action) => {
      console.log('action.payload.map', action.payload);
      action.payload.map((data) => {
        state[data.id] = data.value;
        return null;
      });
    })
    .addCase(createDataListIntSetState, (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    })
    .addCase(setIntEntireField, (state, action) => {
      const {
        payload: {
          sectionIndex, fieldListIndex, fieldIndex, field,
        },
      } = action;
      state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex] = field;
    })
    .addCase(openFieldConfig, (state, action) => {
      const {
        payload: {
          sectionIndex, fieldListIndex, fieldIndex,
        },
      } = action;
      if (fieldIndex === null) {
        state.sections.forEach((_section, eachSectionIndex) => {
          if (_section.field_list) {
            _section.field_list.forEach((eachFieldList, eachFieldListIndex) => {
              if (eachFieldList[FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN]) {
                state.sections[eachSectionIndex].field_list[eachFieldListIndex][FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN] = false;
              }
              if (eachFieldList.fields) {
                eachFieldList.fields.forEach((eachFields, eachFieldsIndex) => {
                  if (eachFields[FIELD_KEYS.IS_CONFIG_OPEN]) {
                    state.sections[eachSectionIndex].field_list[eachFieldListIndex].fields[eachFieldsIndex][FIELD_KEYS.IS_CONFIG_OPEN] = false;
                  }
                });
              }
            });
          }
        });
        state.sections[sectionIndex].field_list[fieldListIndex][FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN] = true;
      } else {
        state.sections.forEach((_section, eachSectionIndex) => {
          if (_section.field_list) {
            _section.field_list.forEach((eachFieldList, eachFieldListIndex) => {
              if (eachFieldList[FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN]) {
                state.sections[eachSectionIndex].field_list[eachFieldListIndex][FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN] = false;
              }
              if (eachFieldList.fields) {
                eachFieldList.fields.forEach((eachFields, eachFieldsIndex) => {
                  if (eachFields[FIELD_KEYS.IS_CONFIG_OPEN]) {
                    state.sections[eachSectionIndex].field_list[eachFieldListIndex].fields[eachFieldsIndex][FIELD_KEYS.IS_CONFIG_OPEN] = false;
                  }
                });
              }
            });
          }
        });
        state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex][FIELD_KEYS.IS_CONFIG_OPEN] = true;
      }
    })
    .addCase(setFieldIntData, (state, action) => {
      const {
        payload: {
          sectionIndex, fieldListIndex, fieldIndex, id, toggle,
        },
      } = action;
      let { payload: { value } } = action;
      if (toggle) {
        value = !state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex][id];
        if (id === FIELD_KEYS.IS_SHOW_WHEN_RULE && !value) {
          delete state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex][FIELD_KEYS.FIELD_SHOW_WHEN_RULE];
        }
        if (id === FIELD_KEYS.IS_DEFAULT_VALUE_RULE && !value) {
          delete state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex][FIELD_KEYS.DEFAULT_VALUE_RULE];
        }
        // if (id === FIELD_KEYS.READ_ONLY && value) {
        //   state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex][FIELD_KEYS.REQUIRED] = false;
        // } else if (id === FIELD_KEYS.REQUIRED && value) {
        //   state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex][FIELD_KEYS.READ_ONLY] = false;
        // }
      }
      state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex][id] = value;
      if (id === FIELD_KEYS.READ_ONLY) {
        if (value) {
          state.sections[sectionIndex].field_list[fieldListIndex].fields[
          fieldIndex
          ][FIELD_KEYS.HIDE_FIELD_IF_NULL] = false;
        } else {
          delete state.sections[sectionIndex].field_list[fieldListIndex].fields[
        fieldIndex
        ][FIELD_KEYS.HIDE_FIELD_IF_NULL];
       }
      }
    })
    .addCase(setFieldIntListData, (state, action) => {
      const {
        payload: {
          sectionIndex, fieldListIndex, id, toggle,
        },
      } = action;
      let { payload: { value } } = action;
      if (toggle) {
        value = !state.sections[sectionIndex].field_list[fieldListIndex][id];
        if (id === FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE && !value) {
          delete state.sections[sectionIndex].field_list[fieldListIndex][FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE];
        }
      }
      state.sections[sectionIndex].field_list[fieldListIndex][id] = value;
    })
    .addCase(setFieldListValidationData, (state, action) => {
      const {
        payload: {
          sectionIndex, fieldListIndex,
        },
      } = action;
      const { payload: { value } } = action;
      state.sections[sectionIndex].field_list[fieldListIndex] = value;
    })
    .addCase(setSectionData, (state, action) => {
      const { payload: { sectionIndex, id, toggle } } = action;
      let { payload: { value } } = action;
      if (toggle) {
        value = !state.sections[sectionIndex][id];
      }
      state.sections[sectionIndex][id] = value;
    })
    .addCase(setDefaultRuleFieldData, (state, action) => {
      const {
        payload: {
          sectionIndex, fieldListIndex, fieldIndex, id, toggle, isInitial,
        },
      } = action;
      let { payload: { value } } = action;
      if (toggle) {
        value = !state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex].draft_default_rule[id];
      }
      if (!state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex].draft_default_rule) {
        state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex].draft_default_rule = {};
      }
      state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex].draft_default_rule[id] = value;
      if (isInitial) {
        state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex].previous_draft_default_rule = jsUtils.get(state, ['sections', sectionIndex, 'field_list', fieldListIndex, 'fields', fieldIndex, 'draft_default_rule']);
      }
    })
    .addCase(setIntErrorList, (state, { payload: { errorList, setDataListSelectorErrorListData } }) => {
      if (!setDataListSelectorErrorListData) state.error_list = { ...errorList };
      else state.datalist_selector_error_list = { ...errorList };
    })
    .addCase(setVisibilityFieldData, (state, action) => {
      const {
        payload: {
          sectionIndex, fieldListIndex, fieldIndex, id, value,
        },
      } = action;
      const fieldData = fieldIndex === undefined ? state.sections[sectionIndex].field_list[fieldListIndex] : state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex];
      if (id === FIELD_KEYS.RULE_EXPRESSION) {
        fieldData[id] = value;
        if (jsUtils.isEmpty(value) && jsUtils.has(fieldData, [FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION])) {
          fieldData[FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION] = false;
        }
      }
    })
    .addCase(saveRuleAction, (state, action) => {
      const {
        payload: {
          sectionIndex, fieldListIndex, fieldIndex, response, id,
        },
      } = action;
      const { _id } = response;
      const fieldData = fieldIndex !== null ? state.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex] : state.sections[sectionIndex].field_list[fieldListIndex];
      fieldData[id] = _id;
      switch (id) {
        case FIELD_KEYS.FIELD_SHOW_WHEN_RULE:
          fieldData[FIELD_KEYS.IS_SHOW_WHEN_RULE] = true;
          break;
        case FIELD_KEYS.DEFAULT_VALUE_RULE:
          fieldData[FIELD_KEYS.IS_DEFAULT_VALUE_RULE] = true;
          break;
        case FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE:
          fieldData[FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE] = true;
          break;
        default:
          break;
      }
    })
    .addCase(totalDataListUpdate, (state, action) => {
      state.sections = action.payload;
    })
    .addCase(saveDataListStartedAction, (state) => {
      state.server_error = {};
      state.common_server_error = EMPTY_STRING;
      return state;
    })
    .addCase(isEditDatalistAction, (state, action) => {
      state.isEditDatalist = action.payload;
    })
    .addCase(dataListInitialLoading, (state, action) => {
      state.isEditInitialLoading = action.payload;
    })
    .addCase(dataListFormLoading, (state, action) => {
      state.isFormDetailsLoading = action.payload;
    })
    .addCase(saveDataListFailedAction, (state, action) => {
      console.log('action.payload', action.payload);
      state.server_error = action.payload.error.server_error;
      state.common_server_error = action.payload.error.common_server_error;
    })
    .addCase(dataListClearAction, () => (clonedInitialState))
    .addCase(getAllFieldsDataListStartedAction, (state) => {
      state.isFieldsListLoading = true;
    })
    .addCase(getAllFieldsDataListSuccessAction, (state, action) => {
      console.log('action.payload.lstAllFields', action.payload.lstAllFields);
      console.log(' action.payload.lstPaginationData', action.payload.lstPaginationData);
      state.lstAllFields = action.payload.lstAllFields;
      state.lstPaginationData = action.payload.lstPaginationData;
      state.isFieldsListLoading = false;
    })
    .addCase(getAllFieldsDataListFailedAction, (state, action) => {
      state.common_server_error = action.payload.common_server_error;
      state.isFieldsListLoading = false;
    })
    .addCase(ruleFieldTypeChangeDataListStarted, (state) => {
      state.isOperatorsListLoading = true;
    })
    .addCase(ruleFieldTypeChangeDataListSucess, (state, action) => {
      console.log('sections111', action.payload);
      state.isOperatorsListLoading = false;
      state.sections = action.payload;
    })
    .addCase(ruleFieldTypeChangeDataListFailed, (state, action) => {
      state.isOperatorsListLoading = false;
      state.common_server_error = action.payload.common_server_error;
    })
    .addCase(createDatalistChange, (state, action) => {
      return {
        ...state,
        ...(action.payload || {}),
      };
    });
});

export default createDataListReducer;
