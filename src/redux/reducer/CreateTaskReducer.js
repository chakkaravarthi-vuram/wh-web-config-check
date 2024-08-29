import { createAction, createReducer } from '@reduxjs/toolkit';
import { CREATE_TASK } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import {
  FIELD_KEYS,
  FIELD_LIST_KEYS,
} from '../../utils/constants/form.constant';
import { isEmpty, has, get } from '../../utils/jsUtility';

//  ACTIONS
export const createTaskIntSetState = createAction(CREATE_TASK.SET_STATE);

export const createTaskSetState = (data) => (dispatch) => {
  dispatch(createTaskIntSetState(data));
  return Promise.resolve();
};
export const createTaskClearState = createAction(CREATE_TASK.CLEAR);
export const createTaskCancel = createAction(CREATE_TASK.CANCEL);
export const setFormVisibilityAction = createAction(
  CREATE_TASK.SET_FORM_VISIBILITY,
);
export const assigneeSuggestionApiStarted = createAction(
  CREATE_TASK.ASSIGNEE_SUGGESTION_API_STARTED,
);
export const saveRuleAction = createAction(
  CREATE_TASK.SAVE_RULE,
  (response, id, sectionIndex, fieldListIndex, fieldIndex = null) => {
    return {
      payload: {
        response,
        sectionIndex,
        fieldListIndex,
        fieldIndex,
        id,
      },
    };
  },
);
export const setDataInsideBatchTask = createAction(
  CREATE_TASK.SET_AUTO_TRIGGER_DETAILS,
  (auto_trigger_details) => {
    return {
      payload: auto_trigger_details,
    };
  },
);

export const setTaskReferenceDocuments = createAction(
  CREATE_TASK.SET_TASK_REFERENCE_DOCUMENTS,
  (files) => {
    return {
      payload: files,
    };
  },
);

export const setFieldIntData = createAction(
  CREATE_TASK.SET_FIELD_VALUE,
  (id, value, sectionIndex, fieldListIndex, fieldIndex, toggle = false) => {
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
  },
);

export const setDataListField = createAction(
  CREATE_TASK.SET_DATA_LIST_FIELD,
  (id, value, sectionIndex, fieldListIndex, fieldIndex) => {
    return {
      payload: {
        id,
        value,
        sectionIndex,
        fieldListIndex,
        fieldIndex,
      },
    };
  },
);

export const setIntEntireField = createAction(
  CREATE_TASK.SET_ENTIRE_FIELD,
  (field, sectionIndex, fieldListIndex, fieldIndex) => {
    return {
      payload: {
        field,
        sectionIndex,
        fieldListIndex,
        fieldIndex,
      },
    };
  },
);

export const setEntireField =
  (field, sectionIndex, fieldListIndex, fieldIndex, checkErrorCb) =>
    (dispatch, getState) => {
      dispatch(
        setIntEntireField(field, sectionIndex, fieldListIndex, fieldIndex),
      );
      if (checkErrorCb) {
        const { CreateTaskReducer } = getState();
        checkErrorCb(CreateTaskReducer);
      }
      return Promise.resolve();
    };

export const openFieldConfig = createAction(
  CREATE_TASK.OPEN_FIELD_CONFIG,
  (sectionIndex, fieldListIndex, fieldIndex = null) => {
    return {
      payload: {
        sectionIndex,
        fieldListIndex,
        fieldIndex,
      },
    };
  },
);

export const setFieldData =
  (
    id,
    value,
    sectionIndex,
    fieldListIndex,
    fieldIndex,
    toggle = false,
    checkErrorCb,
  ) =>
    (dispatch, getState) => {
      dispatch(
        setFieldIntData(
          id,
          value,
          sectionIndex,
          fieldListIndex,
          fieldIndex,
          toggle,
        ),
      );
      if (checkErrorCb) {
        const { CreateTaskReducer } = getState();
        checkErrorCb(CreateTaskReducer);
      }
      return Promise.resolve();
    };

export const setDefaultRuleFieldData = createAction(
  CREATE_TASK.SET_DEFAULT_RULE_VALUE,
  (
    id,
    value,
    sectionIndex,
    fieldListIndex,
    fieldIndex,
    errorCheckerCallBack,
    toggle = false,
    isInitial = false,
  ) => {
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
  },
);

export const setSectionData = createAction(
  CREATE_TASK.SET_SECTION_VALUE,
  (id, value, sectionIndex, toggle = false) => {
    return {
      payload: {
        id,
        value,
        sectionIndex,
        toggle,
      },
    };
  },
);

export const setSectionDataAction =
  (id, value, sectionIndex, toggle = false) =>
    (dispatch) => {
      dispatch(setSectionData(id, value, sectionIndex, toggle));
      return Promise.resolve();
    };

export const setFieldListValidationData = createAction(
  CREATE_TASK.SET_FIELD_LIST_VALIDATION,
  (id, value, sectionIndex, fieldListIndex, toggle = false) => {
    return {
      payload: {
        id,
        value,
        sectionIndex,
        fieldListIndex,
        toggle,
      },
    };
  },
);

export const setFieldIntListData = createAction(
  CREATE_TASK.SET_FIELD_LIST_VALUE,
  (id, value, sectionIndex, fieldListIndex, toggle = false) => {
    return {
      payload: {
        id,
        value,
        sectionIndex,
        fieldListIndex,
        toggle,
      },
    };
  },
);

export const setFieldListData =
  (id, value, sectionIndex, fieldListIndex, toggle = false, checkErrorCb) =>
    (dispatch, getState) => {
      dispatch(
        setFieldIntListData(id, value, sectionIndex, fieldListIndex, toggle),
      );
      if (checkErrorCb) {
        const { CreateTaskReducer } = getState();
        checkErrorCb(CreateTaskReducer);
      }
      return Promise.resolve();
    };

    export const setFieldListValidation = (id, value, sectionIndex, fieldListIndex, fieldIndex, toggle = false, checkErrorCb) => (dispatch, getState) => {
      dispatch(setFieldListValidationData(id, value, sectionIndex, fieldListIndex, fieldIndex, toggle));
      if (checkErrorCb) {
        const { CreateDataListReducer } = getState();
        checkErrorCb(CreateDataListReducer);
      }
      return Promise.resolve();
    };
const setIntErrorList = createAction(
  CREATE_TASK.SET_ERROR_LIST,
  (errorList, setDataListSelectorErrorListData = false) => {
    return { payload: { errorList, setDataListSelectorErrorListData } };
  },
);

const setIntAdditionalErrorList = createAction(
  CREATE_TASK.SET_ADDITIONAL_ERROR_LIST,
  (errorList) => {
    return { payload: { errorList } };
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

export const setAdditionalErrorListData = (errorList) => (dispatch) => {
  dispatch(setIntAdditionalErrorList(errorList));
  return Promise.resolve();
};

export const setVisibilityFieldData = createAction(
  CREATE_TASK.SET_CREATE_TASK_VISIBILITY_FIELD_DATA,
  (id, value, sectionIndex, fieldListIndex, fieldIndex) => {
    return {
      payload: {
        id,
        value,
        sectionIndex,
        fieldListIndex,
        fieldIndex,
      },
    };
  },
);

export const setReferenceIdLoading = createAction(
  CREATE_TASK.SET_REFERENCE_ID_LOADING,
  (isLoading) => {
    return {
      payload: isLoading,
    };
  },
);

const initialState = {
  tabIndex: 1,
  form_title: EMPTY_STRING,
  task_name: EMPTY_STRING,
  task_description: EMPTY_STRING,
  form_description: EMPTY_STRING,
  error_list: [],
  additional_error_list: [],
  datalist_selector_error_list: {},
  sectionTitleError: EMPTY_STRING,
  server_error: [],
  section_name: EMPTY_STRING,
  sections: [],
  form_uuid: EMPTY_STRING,
  assignees: {},
  due_date: EMPTY_STRING,
  member_team_search_value: EMPTY_STRING,
  isTaskPublished: false,
  loading: false,
  isFormVisible: false,
  is_assign_to_individual_assignees: false,
  assigneeSuggestionList: [],
  isAssigneeSuggestionLoading: false,
  isRuleFieldTypeChangeLoading: false,
  isFieldsListLoading: false,
  isOperatorListLoading: false,
  suggestedWord: EMPTY_STRING,
  lstAllFields: [],
  field_type_data: [],
  isFieldSuggestionEnabled: false,
  disableFieldTypeSuggestion: false,
  suggestedTaskAssignee: [],
  initialTaskLabel: EMPTY_STRING,
  intial_field_type: EMPTY_STRING,
  isSuggestedTypeSelected: false,
  autocompleteSuggestionList: [],
  isMlTaskLoading: false,
  promptType: null,

  // field dependency variables
  showFieldDependencyDialog: false,
  showFormDependencyDialog: false,
  dependency_data: {},
  dependency_type: EMPTY_STRING,
  dependency_name: EMPTY_STRING,

  addFormFieldsDropdownVisibilityData: {
    isVisible: false,
    sectionIndex: 0,
  },
  isReferenceIdLoading: false,
  ref_uuid: null,
  files: [],
  removed_doc_list: [],
  entityId: null,
};

const CreateTaskReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(createTaskCancel, (state) => {
      state.loading = false;
    })
    .addCase(createTaskIntSetState, (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    })
    .addCase(setTaskReferenceDocuments, (state, action) => {
      console.log('setTaskReferenceDocuments reducer', action.payload);
      return {
        ...state,
        files: [...state.files, ...action.payload.files],
        entityId: action.payload.entityId,
      };
    })
    .addCase(setDataInsideBatchTask, (state, action) => {
      console.log(
        'set inside batch task',
        action.payload,
        Object.keys(action.payload),
      );
      return {
        ...state,
        has_auto_trigger: Object.keys(action.payload).includes('is_recursive')
          ? Object.values(action.payload)[0]
          : state.has_auto_trigger,
        auto_trigger_details: {
          ...state.auto_trigger_details,
          is_recursive: Object.keys(action.payload).includes('is_recursive')
            ? Object.values(action.payload)[0]
            : state.auto_trigger_details.is_recursive,
          recursive_data: !Object.keys(action.payload).includes('is_recursive')
            ? { ...state.auto_trigger_details.recursive_data, ...action.payload }
            : state.auto_trigger_details.recursive_data,
        },
        error_list: {},
      };
    })
    .addCase(setFormVisibilityAction, (state, action) => {
      state.isFormVisible = action.payload;
    })
    .addCase(assigneeSuggestionApiStarted, (state) => {
      state.isAssigneeSuggestionLoading = true;
    })
    .addCase(saveRuleAction, (state, action) => {
      const {
        payload: { sectionIndex, fieldListIndex, fieldIndex, response, id },
      } = action;
      const { _id } = response;
      if (!isEmpty(state.sections)) {
        const fieldData =
          fieldIndex !== null
            ? state.sections[sectionIndex].field_list[fieldListIndex].fields[
            fieldIndex
            ]
            : state.sections[sectionIndex].field_list[fieldListIndex];
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
      }
    })
    .addCase(createTaskClearState, () => {
      return {
        ...initialState,
      };
    })
    .addCase(setIntEntireField, (state, action) => {
      const {
        payload: { sectionIndex, fieldListIndex, fieldIndex, field },
      } = action;
      state.sections[sectionIndex].field_list[fieldListIndex].fields[
        fieldIndex
      ] = field;
    })
    .addCase(openFieldConfig, (state, action) => {
      const {
        payload: { sectionIndex, fieldListIndex, fieldIndex },
      } = action;
      if (fieldIndex === null) {
        state.sections.forEach((_section, eachSectionIndex) => {
          if (_section.field_list) {
            _section.field_list.forEach((eachFieldList, eachFieldListIndex) => {
              if (
                eachFieldList[FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN]
              ) {
                state.sections[eachSectionIndex].field_list[eachFieldListIndex][
                  FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN
                ] = false;
              }
              if (eachFieldList.fields) {
                eachFieldList.fields.forEach((eachFields, eachFieldsIndex) => {
                  if (eachFields[FIELD_KEYS.IS_CONFIG_OPEN]) {
                    state.sections[eachSectionIndex].field_list[
                      eachFieldListIndex
                    ].fields[eachFieldsIndex][
                      FIELD_KEYS.IS_CONFIG_OPEN
                    ] = false;
                  }
                });
              }
            });
          }
        });
        state.sections[sectionIndex].field_list[fieldListIndex][
          FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN
        ] = true;
      } else {
        state.sections.forEach((_section, eachSectionIndex) => {
          if (_section.field_list) {
            _section.field_list.forEach((eachFieldList, eachFieldListIndex) => {
              if (
                eachFieldList[FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN]
              ) {
                state.sections[eachSectionIndex].field_list[eachFieldListIndex][
                  FIELD_LIST_KEYS.IS_FIELD_LIST_CONFIG_POPUP_OPEN
                ] = false;
              }
              if (eachFieldList.fields) {
                eachFieldList.fields.forEach((eachFields, eachFieldsIndex) => {
                  if (eachFields[FIELD_KEYS.IS_CONFIG_OPEN]) {
                    state.sections[eachSectionIndex].field_list[
                      eachFieldListIndex
                    ].fields[eachFieldsIndex][
                      FIELD_KEYS.IS_CONFIG_OPEN
                    ] = false;
                  }
                });
              }
            });
          }
        });
        state.sections[sectionIndex].field_list[fieldListIndex].fields[
          fieldIndex
        ][FIELD_KEYS.IS_CONFIG_OPEN] = true;
      }
    })
    .addCase(setDataListField, (state, action) => {
      const {
        payload: { sectionIndex, fieldListIndex, fieldIndex, id },
      } = action;
      const {
        payload: { value },
      } = action;
      state.sections[sectionIndex].field_list[fieldListIndex].fields[
        fieldIndex
      ][id] = value;
    })
    .addCase(setFieldIntData, (state, action) => {
      const {
        payload: { sectionIndex, fieldListIndex, fieldIndex, id, toggle },
      } = action;
      let {
        payload: { value },
      } = action;
      // const readonly = state.sections[sectionIndex]
      //                     .field_list[fieldListIndex]
      //                     .fields[fieldIndex][FIELD_KEYS.READ_ONLY];
      if (toggle) {
        value =
          !state.sections[sectionIndex].field_list[fieldListIndex].fields[
          fieldIndex
          ][id];
        if (id === FIELD_KEYS.IS_SHOW_WHEN_RULE && !value) {
          delete state.sections[sectionIndex].field_list[fieldListIndex].fields[
            fieldIndex
          ][FIELD_KEYS.FIELD_SHOW_WHEN_RULE];
        }
        if (id === FIELD_KEYS.IS_DEFAULT_VALUE_RULE && !value) {
          delete state.sections[sectionIndex].field_list[fieldListIndex].fields[
            fieldIndex
          ][FIELD_KEYS.DEFAULT_VALUE_RULE];
        }
        // if (id === FIELD_KEYS.READ_ONLY && value) {
        //   state.sections[sectionIndex].field_list[fieldListIndex].fields[
        //     fieldIndex
        //   ][FIELD_KEYS.REQUIRED] = false;
        // } else if (id === FIELD_KEYS.REQUIRED && value) {
        //   state.sections[sectionIndex].field_list[fieldListIndex].fields[
        //     fieldIndex
        //   ][FIELD_KEYS.READ_ONLY] = false;
        // }
      }
      state.sections[sectionIndex].field_list[fieldListIndex].fields[
        fieldIndex
      ][id] = value;
      // id === FIELD_KEYS.HIDE_FIELD_IF_NULL && readonly ||
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
    .addCase(setDefaultRuleFieldData, (state, action) => {
      const {
        payload: { sectionIndex, fieldListIndex, fieldIndex, id, toggle, isInitial = false },
      } = action;
      let {
        payload: { value },
      } = action;
      if (toggle) {
        value =
          !state.sections[sectionIndex].field_list[fieldListIndex].fields[
            fieldIndex
          ].draft_default_rule[id];
      }
      if (
        !state.sections[sectionIndex].field_list[fieldListIndex].fields[
          fieldIndex
        ].draft_default_rule
      ) {
        state.sections[sectionIndex].field_list[fieldListIndex].fields[
          fieldIndex
        ].draft_default_rule = {};
      }
      state.sections[sectionIndex].field_list[fieldListIndex].fields[
        fieldIndex
      ].draft_default_rule[id] = value;
      if (isInitial) {
        state.sections[sectionIndex].field_list[fieldListIndex].fields[
          fieldIndex
        ].previous_draft_default_rule = get(
          state, ['sections', sectionIndex, 'field_list', fieldListIndex, 'fields',
          fieldIndex, 'draft_default_rule']);
      }
    })
    .addCase(setFieldIntListData, (state, action) => {
      const {
        payload: { sectionIndex, fieldListIndex, id, toggle },
      } = action;
      let {
        payload: { value },
      } = action;
      if (toggle) {
        value = !state.sections[sectionIndex].field_list[fieldListIndex][id];
        if (id === FIELD_LIST_KEYS.IS_FIELD_LIST_SHOW_WHEN_RULE && !value) {
          delete state.sections[sectionIndex].field_list[fieldListIndex][
            FIELD_LIST_KEYS.FIELD_LIST_SHOW_WHEN_RULE
          ];
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
      const {
        payload: { sectionIndex, id, toggle },
      } = action;
      let {
        payload: { value },
      } = action;
      if (toggle) {
        value = !state.sections[sectionIndex][id];
      }
      state.sections[sectionIndex][id] = value;
    })
    .addCase(setIntErrorList, (state, { payload: { errorList, setDataListSelectorErrorListData } }) => {
      if (!setDataListSelectorErrorListData) state.error_list = { ...errorList };
      else state.datalist_selector_error_list = { ...errorList };
    })
    .addCase(setIntAdditionalErrorList, (state, { payload: { errorList } }) => {
      state.additional_error_list = { ...errorList };
    })
    .addCase(setVisibilityFieldData, (state, action) => {
      const {
        payload: { sectionIndex, fieldListIndex, fieldIndex, id, value },
      } = action;
      const fieldData =
        (fieldIndex === undefined || fieldIndex === null)
          ? state.sections[sectionIndex].field_list[fieldListIndex]
          : state.sections[sectionIndex].field_list[fieldListIndex].fields[
          fieldIndex
          ];
      if (id === FIELD_KEYS.RULE_EXPRESSION) {
        fieldData[id] = value;
        if (isEmpty(value) && has(fieldData, [FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION])) {
          fieldData[FIELD_KEYS.RULE_EXPRESSION_HAS_VALIDATION] = false;
        }
      }
     if (fieldIndex === undefined || fieldIndex === null) {
      state.sections[sectionIndex].field_list[fieldListIndex] = fieldData;
     } else {
      state.sections[sectionIndex].field_list[fieldListIndex].fields[
        fieldIndex
        ] = fieldData;
     }
    })
    .addCase(setReferenceIdLoading, (state, action) => {
      state.isReferenceIdLoading = action.payload;
    });
});

export default CreateTaskReducer;
