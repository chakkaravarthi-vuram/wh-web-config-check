import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { MFA_DETAILS } from '../actions/ActionConstants';

const initialState = {
    isMFAMethodLoading: false,
    MfaData: null,
    isMfaVerified: false,
    allowedMfaMethods: [],
    isMfaEnabled: true,
    MfaTOTPUrl: EMPTY_STRING,
    selectedMfaMethod: 0,
    isMfaEnforced: false,
    error_list: {},
    common_server_error: {},
    isShowMFADetails: false,
};

const MfaReducer = (state = initialState, action) => {
    switch (action.type) {
        case MFA_DETAILS.UPDATED:
            return {
                ...state,
                ...action.payload,
            };
        case MFA_DETAILS.STARTED:
            return {
                ...state,
                ...action.payload,
                isMFAMethodLoading: true,
            };
        case MFA_DETAILS.SUCCESS:
            return {
                ...state,
                ...action.payload,
                isMFAMethodLoading: false,
            };
        case MFA_DETAILS.FAILURE:
        case MFA_DETAILS.CLEAR:
            return {
                ...state,
                ...initialState,
            };
        default:
            return state;
    }
};

export default MfaReducer;
