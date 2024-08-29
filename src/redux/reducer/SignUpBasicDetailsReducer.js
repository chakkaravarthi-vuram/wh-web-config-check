import { SIGN_UP_BASIC_DETAILS } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  email: EMPTY_STRING,
  error_list: [],
  server_error: [],
  is_data_loading: false,
  is_email_unique: false,
};

export default function SignUpBasicDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_UP_BASIC_DETAILS.STARTED:
      return {
        ...state,
        is_data_loading: true,
      };
    // case SIGN_UP_BASIC_DETAILS.SUCCESS:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: null,
    //     generateOtp: action.payload,
    //   };
    // case SIGN_UP_BASIC_DETAILS.FAILURE:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: action.payload.error,
    //   };
    case SIGN_UP_BASIC_DETAILS.CANCEL:
      return {
        ...state,
        is_data_loading: false,
      };
    case SIGN_UP_BASIC_DETAILS.SET_STATE:
      return { ...state, ...action.payload };
    case SIGN_UP_BASIC_DETAILS.CLEAR:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
