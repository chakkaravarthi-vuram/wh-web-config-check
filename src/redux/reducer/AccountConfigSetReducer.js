import { createAction, createReducer } from '@reduxjs/toolkit';
import { ACCOUNT_SIGNUP_MODULE } from 'redux/actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
    company_name: EMPTY_STRING,
    country: EMPTY_STRING,
    industry: [],
    company_logo: EMPTY_STRING,
    acc_timezone: EMPTY_STRING,
    acc_locale: [],
    primary_locale: null,
    acc_language: EMPTY_STRING,
    isLoading: false,
    error_list: [],
    server_error: [],
    common_server_error: EMPTY_STRING,
    account_setting_open: true,
};

export const accountSettingSuccess = createAction(ACCOUNT_SIGNUP_MODULE.ACCOUNT_SIGNUP_SUCCESS);

export const accountSettingStarted = createAction(
    ACCOUNT_SIGNUP_MODULE.ACCOUNT_SIGNUP_STARTED,
);

export const accountSettingFailure = createAction(
    ACCOUNT_SIGNUP_MODULE.ACCOUNT_SIGNUP_FAILURE,
    (error) => {
      return {
        payload: error,
      };
    },
);

export const accountSettingStateChange = createAction(
    ACCOUNT_SIGNUP_MODULE.ACCOUNT_SIGNUP_CHANGE,
    (setData) => {
        return {
            payload: setData,
        };
    },
);

export const accountSettingStateClear = createAction(
    ACCOUNT_SIGNUP_MODULE.ACCOUNT_SIGNUP_CLEAR,
);

const AccountSettingModalReducer = createReducer(initialState, (builder) => {
    builder
    .addCase(accountSettingSuccess, (state) => {
        return {
          ...state,
          isLoading: false,
        };
    })
    .addCase(accountSettingFailure, (state, action) => {
        return {
            ...state,
            common_server_error: action.payload.common_server_error,
            server_error: action.payload.common_server_error,
            isLoading: false,
        };
    })
    .addCase(accountSettingStarted, (state) => {
        return {
            ...state,
            isLoading: true,
        };
    })
    .addCase(accountSettingStateChange, (state, action) => {
        return {
          ...state,
          ...action.payload,
        };
    })
    .addCase(accountSettingStateClear, () => {
        return {
            ...initialState,
        };
    });
});

export default AccountSettingModalReducer;
