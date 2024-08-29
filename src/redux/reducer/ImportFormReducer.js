import {
  createAction,
  createReducer,
} from '@reduxjs/toolkit';
import { IMPORT_FORM } from '../actions/ActionConstants';
import { IMPORT_FORM_KEYS } from '../../utils/constants/form.constant';
import jsUtils from '../../utils/jsUtility';

//  ACTIONS

//   export const createTaskSetState = (data) => (dispatch) => {
//     dispatch(createTaskIntSetState(data));
//     return Promise.resolve();
//   };

export const importFormStarted = createAction(IMPORT_FORM.IMPORT_TASK_FORM_STARTED);
export const importFormSectionIndex = createAction(IMPORT_FORM.IMPORT_FORM_SET_SECTION_INDEX, (sectionIndex) => { return { payload: { sectionIndex } }; });

export const importFormSuccess = createAction(IMPORT_FORM.IMPORT_TASK_FORM_SUCCESS, (formDetails) => {
  return {
    payload: {
      formDetails,
    },
  };
});

export const importFormFailure = createAction(IMPORT_FORM.IMPORT_TASK_FORM_FAILURE, (error) => {
  return {
    payload: {
      error,
    },
  };
});

export const importFormDataChange = createAction(IMPORT_FORM.IMPORT_TASK_FORM_DATA_CHANGE, (key, value) => {
  return {
    payload: {
      key,
      value,
    },
  };
});

export const importFormSetSectionData = createAction(IMPORT_FORM.IMPORT_TASK_FORM_SET_SECTION, (key, value, sectionIndex, toggle = false) => {
  return {
    payload: {
      key,
      value,
      sectionIndex,
      toggle,
    },
  };
});

export const importFormSetEntireSectionData = createAction(IMPORT_FORM.IMPORT_TASK_FORM_SET_ENTIRE_SECTION, (section, sectionIndex) => {
  return {
    payload: {
      section, sectionIndex,
    },
  };
});

export const importFormSetFieldListData = createAction(IMPORT_FORM.IMPORT_TASK_FORM_SET_FIELD_LIST, (id, value, sectionIndex, fieldListIndex, toggle = false) => {
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

export const importFormSetEntireFieldListData = createAction(IMPORT_FORM.IMPORT_TASK_FORM_SET_ENTIRE_FIELD_LIST, (fieldList, sectionIndex, fieldListIndex) => {
  return {
    payload: {
      fieldList, sectionIndex, fieldListIndex,
    },
  };
});

export const importFormSetFieldData = createAction(IMPORT_FORM.IMPORT_TASK_FORM_SET_FIELD, (id, value, sectionIndex, fieldListIndex, fieldIndex, toggle = false) => {
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

export const importFormSetEntireFieldData = createAction(IMPORT_FORM.IMPORT_TASK_FORM_SET_ENTIRE_FIELD, (field, sectionIndex, fieldListIndex, fieldIndex) => {
  return {
    payload: {
      field,
      sectionIndex,
      fieldListIndex,
      fieldIndex,
    },
  };
});

export const importFormClearState = createAction(IMPORT_FORM.IMPORT_TASK_CLEAR_STATE);

export const importFormCancel = createAction(IMPORT_FORM.IMPORT_FORM_CANCEL, (formDetailsServerData) => {
  return {
    payload: {
      formDetails: formDetailsServerData,
    },
  };
});

// reducer

const initialState = {
  isImportFormModalVisible: false,
  isImportFormEntirePageLoading: false,
  isImportFormLoading: false,
  stepList: [],
  stepsData: {
    stepList: [],
    page: 1,
    hasMore: false,
  },
  selectedStepIndex: null,
  formDetails: {},
  formDetailsServerData: {},
};

const ImportFormReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(importFormStarted, (state) => {
      state.isImportFormEntirePageLoading = true;
    })
   .addCase(importFormSuccess, (state, action) => {
      state.isImportFormEntirePageLoading = false;
      state.isImportFormLoading = false;
      state.formDetails = action.payload.formDetails;
      state.formDetailsServerData = action.payload.formDetails;
    })
    .addCase(importFormFailure, (state) => {
      state.isImportFormEntirePageLoading = false;
      state.isImportFormLoading = false;
    })
    .addCase(importFormSectionIndex, (state, action) => {
      const { payload: { sectionIndex } } = action;
      state[IMPORT_FORM_KEYS.SELECTED_SECTION_INDEX] = sectionIndex;
    })
    .addCase(importFormDataChange, (state, action) => {
        const { key, value } = action.payload;
        if (!jsUtils.isNil(value)) {
          return {
            ...state,
            [key]: value,
          };
        } else {
          return {
              ...state,
              ...key,
          };
        }
    })
    .addCase(importFormClearState, () => {
      return {
        ...initialState,
      };
    })
    .addCase(importFormSetSectionData, (state, action) => {
      const { payload: { sectionIndex, id, toggle } } = action;
      let { payload: { value } } = action;
      if (toggle) {
        value = !state.formDetails.sections[sectionIndex][id];
      }
      state.formDetails.sections[sectionIndex][id] = value;
    })
    .addCase(importFormSetEntireSectionData, (state, action) => {
      const { payload: { section, sectionIndex } } = action;
      state.formDetails.sections[sectionIndex] = section;
    })
    .addCase(importFormSetFieldListData, (state, action) => {
      const { payload: { sectionIndex, fieldListIndex, id, toggle } } = action;
      let { payload: { value } } = action;
      if (toggle) {
        value = !state.formDetails.sections[sectionIndex].field_list[fieldListIndex][id];
      }
      state.formDetails.sections[sectionIndex].field_list[fieldListIndex][id] = value;
    })
    .addCase(importFormSetEntireFieldListData, (state, action) => {
      const { payload: { fieldList, sectionIndex, fieldListIndex } } = action;
      state.formDetails.sections[sectionIndex].field_list[fieldListIndex] = fieldList;
    })
    .addCase(importFormSetEntireFieldData, (state, action) => {
      const {
        payload: {
          sectionIndex, fieldListIndex, fieldIndex, field,
        },
      } = action;
      state.formDetails.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex] = field;
    })
    .addCase(importFormSetFieldData, (state, action) => {
      const {
        payload: {
          sectionIndex, fieldListIndex, fieldIndex, id, toggle,
        },
      } = action;
      let { payload: { value } } = action;
      if (toggle) {
        value = !state.formDetails.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex][id];
      }
      state.formDetails.sections[sectionIndex].field_list[fieldListIndex].fields[fieldIndex][id] = value;
    })
    .addCase(importFormCancel, (state, action) => {
        state.formDetails = action.payload.formDetails;
        state.isImportFormModalVisible = false;
    });
});

export default ImportFormReducer;
