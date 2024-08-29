import { createAction, createReducer } from '@reduxjs/toolkit';
import { WELCOME_INSIGHTS } from 'redux/actions/ActionConstants';
import { EMPTY_STRING } from 'utils/strings/CommonStrings';

const initialState = {
    WelcomeMessage: EMPTY_STRING,
    WorkloadMessage: EMPTY_STRING,
    isDataLoading: false,
    isWelcomeInsightsOpen: false,
};

export const setWelcomeChange = createAction(
    WELCOME_INSIGHTS.ON_DATA_CHANGE,
    (data) => {
        return {
            payload: data,
        };
    },
  );

export const welcomeApiStarted = createAction(WELCOME_INSIGHTS.STARTED);
export const welcomeApiStopped = createAction(WELCOME_INSIGHTS.STOP);
export const welcomeDataClear = createAction(WELCOME_INSIGHTS.CLEAR);

const WelcomeInsightReducer = createReducer(initialState, (builder) => {
    builder
    .addCase(setWelcomeChange, (state, action) => {
        return {
            ...state,
            ...action.payload,
        };
    })
    .addCase(welcomeApiStarted, (state) => {
        state.isDataLoading = true;
    })
    .addCase(welcomeApiStopped, (state) => {
        state.isDataLoading = false;
    })
    .addCase(welcomeDataClear, () => {
        return {
            ...initialState,
        };
    });
});

export default WelcomeInsightReducer;
