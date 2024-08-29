import { createAction, createReducer } from '@reduxjs/toolkit';
import { FIELD_VISIBILITY } from '../actions/ActionConstants';

const initialState = {
    fieldUuidList: [],
};

export const addFieldToApiQueue = createAction(
    FIELD_VISIBILITY.ADD_FIELD,
    (fieldUuid) => {
        return { payload: fieldUuid };
    },
);
export const removeFieldFromApiQueue = createAction(
    FIELD_VISIBILITY.REMOVE_FIELD,
    (fieldUuid) => {
        return { payload: fieldUuid };
    },
);
export const clearApiQueue = createAction(FIELD_VISIBILITY.CLEAR_LIST);

const FieldVisibilityReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(addFieldToApiQueue, (state, action) => {
            const { payload } = action;
            console.log(action, 'rtyetrettet');
            state.fieldUuidList.push(payload);
        })
        .addCase(removeFieldFromApiQueue, (state, action) => {
            const { payload } = action;
            const index = state.fieldUuidList.findIndex((fieldUuid) => fieldUuid === payload);
            if (index > -1) state.fieldUuidList.splice(index, 1);
        })
        .addCase(clearApiQueue, () => initialState);
});

export default FieldVisibilityReducer;
