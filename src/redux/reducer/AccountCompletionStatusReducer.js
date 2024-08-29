import { EMPTY_STRING } from 'utils/strings/CommonStrings';
import { ACTION_CONSTANTS } from '../actions/ActionConstants';

const initialState = {
    is_account_completed_status: true,
    manual_completion: false,
    is_account_expired: false,
    expiry_day_remaining: 7,
    already_existing_account: false,
    is_billing_user: false,
    account_subscription_type: 'subscription',
    is_card_verified: true,
    timezone: EMPTY_STRING,
    language: EMPTY_STRING,
    has_billing_profile: false,
};

const AccountCompleteCheckReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_CONSTANTS.SET_ACCOUNT_COMPLETION_STATUS:
            return {
                ...state,
                is_account_completed_status: action.payload,
            };
        case ACTION_CONSTANTS.MANUAL_ACCOUNT_COMPLETION_STATUS:
            return {
                ...state,
                manual_completion: action.payload,
            };
        case ACTION_CONSTANTS.CLEAR_ACCOUNT_COMPLETION_STATUS:
            return {
                ...initialState,
            };
        case ACTION_CONSTANTS.SET_IS_ACCOUNT_EXPIRED:
            return {
                ...state,
                is_account_expired: action.payload,
            };
        case ACTION_CONSTANTS.SET_EXPIRY_REMAINING:
            return {
                ...state,
                expiry_day_remaining: action.payload,
            };
        case ACTION_CONSTANTS.ACCOUNT_SUBSCRIPTION_TYPE:
            return {
                ...state,
                account_subscription_type: action.payload,
            };
        case ACTION_CONSTANTS.ALREADY_EXISTING_ACCOUNT:
            return {
                ...state,
                already_existing_account: action.payload,
            };
        case ACTION_CONSTANTS.IS_BILLING_USER:
            return {
                ...state,
                is_billing_user: action.payload,
            };
        case ACTION_CONSTANTS.IS_ACCOUNT_CARD_VERIFIED:
            return {
                ...state,
                is_card_verified: action.payload,
            };
        case ACTION_CONSTANTS.SET_TIMEZONE_LANGUAGE:
            return {
                ...state,
                timezone: action.payload.timezone,
                language: action.payload.language,
            };
        case ACTION_CONSTANTS.HAS_BILLING_PROFILE_COMPLETED:
            return {
                ...state,
                has_billing_profile: action.payload,
            };
        default:
            return state;
    }
};
export default AccountCompleteCheckReducer;
