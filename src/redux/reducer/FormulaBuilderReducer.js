import { createAction, createReducer } from '@reduxjs/toolkit';
import { FORMULA_BUILDER_ACTION_CONSTANTS } from 'redux/actions/ActionConstants';
import { INITIAL_PAGE } from 'utils/constants/form.constant';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { get, isEmpty, uniqBy, cloneDeep, has } from '../../utils/jsUtility';

export const setFormulaTokenChange = createAction(
    FORMULA_BUILDER_ACTION_CONSTANTS.FORMULA_BUILDER_DATA_CHANGE,
    (value) => {
      return {
        payload: value,
      };
    },
  );

export const clearFormulaBuilderValues = createAction(FORMULA_BUILDER_ACTION_CONSTANTS.CLEAR_FORMULA, (persistData) => {
  return { payload: persistData };
});

export const externalFieldSuccess = createAction(FORMULA_BUILDER_ACTION_CONSTANTS.EXTERNAL_FIELDS_SUCCESS, (response) => {
  return {
    payload: response,
  };
});

const initialState = {
  tokenizedOutput: [],
  currentFormulaTab: 2,
  showTabData: true,
  lstFunctions: [],
  lstFields: {},
  field_metadata: [],
  serverErrorList: [],
  code: EMPTY_STRING,
  refreshOnCodeChange: false,
  codeWithoutUuid: EMPTY_STRING,
};
const FormulaBuilderReducer = createReducer(initialState, (builder) => {
    builder
    .addCase(setFormulaTokenChange, (state, action) => {
        return {
            ...state,
            ...action.payload,
        };
    })
    .addCase(externalFieldSuccess, (state, action) => {
      const response = get(action, ['payload'], {});
      const existingFields = get(state, ['lstFields', 'pagination_data'], []);
      let updatedFields = get(response, ['pagination_data'], []);
      if (!isEmpty(response)) {
        if (get(response, ['pagination_details', 0, 'page'], INITIAL_PAGE) > 1) {
          updatedFields = uniqBy([
            ...existingFields,
            ...updatedFields,
        ], (field) => field.field_uuid);
        }
        return {
          ...state,
          lstFields: {
              pagination_details: get(response, ['pagination_details', 0], {}),
              pagination_data: updatedFields,
           },
        };
      }
      return state;
    })
    .addCase(clearFormulaBuilderValues, (state, action) => {
      const persistParamKeys = get(action, ['payload'], []);
      const cloneState = cloneDeep(state);

      const persistData = {};
      persistParamKeys.forEach((key) => {
          if (has(cloneState, [key], false)) {
              persistData[key] = cloneState[key];
          }
      });

      return {
        ...initialState,
       ...(!isEmpty(persistData) && persistData),
      };
    });
});

export default FormulaBuilderReducer;
