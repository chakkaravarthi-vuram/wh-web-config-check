import { SIGN_UP_OTP_VERIFICATION } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  otp: EMPTY_STRING,
  otp_message_or_error_text: null,
  is_resend_enabled: true,
  block_resend: false,
  is_data_loading: false,
};

export default function SignUpOtpVerificationReducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_UP_OTP_VERIFICATION.STARTED:
      return {
        ...state,
        is_data_loading: true,
      };
    case SIGN_UP_OTP_VERIFICATION.SUCCESS:
      return {
        ...state,
        is_data_loading: true,
      };
    // case SIGN_UP_OTP_VERIFICATION.FAILURE:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: action.payload.error,
    //   };
    case SIGN_UP_OTP_VERIFICATION.CANCEL:
      return {
        ...state,
        is_data_loading: false,
      };
    case SIGN_UP_OTP_VERIFICATION.SET_STATE:
      return { ...state, ...action.payload };
    case SIGN_UP_OTP_VERIFICATION.CLEAR:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
