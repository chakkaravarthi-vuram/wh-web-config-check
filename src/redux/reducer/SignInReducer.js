import { SIGN_IN_API, URL_VERIFY_API } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';
import { SIGN_IN_STRINGS } from '../../containers/sign_in/SignIn.strings';

const initialState = {
  username: EMPTY_STRING,
  password: EMPTY_STRING,
  error_list: [],
  server_error: [],
  common_server_error: EMPTY_STRING,
  formStep: SIGN_IN_STRINGS.PRE_SIGN_IN_STEP,
  loading: false,
  account_id: EMPTY_STRING,
  accounts: [],
  account_domain: EMPTY_STRING,
  direct_from_signin: false,
  is_email_signin: true,
  email: EMPTY_STRING,
  domain: EMPTY_STRING,
  username_or_email: EMPTY_STRING,
  sign_in_type: EMPTY_STRING,
  isValidUrl: true,
  isUrlVerificationLoading: false,
  isDomainVerified: false,
};

export default function SignInReducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_IN_API.STARTED:
      return {
        ...state,
        server_error: [],
        common_server_error: EMPTY_STRING,
        loading: true,
      };
    case SIGN_IN_API.SUCCESS:
      return {
        ...state,
        error_list: [],
        server_error: [],
        loading: false,
      };
    case SIGN_IN_API.FAILURE:
      return {
        ...state,
        ...action.payload.error,
        loading: false,
      };
    case SIGN_IN_API.CANCEL:
      return {
        ...state,
        loading: false,
      };
    case SIGN_IN_API.SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    case SIGN_IN_API.CLEAR:
      return {
        ...initialState,
      };
    case URL_VERIFY_API.STARTED:
      return {
        ...state,
        isUrlVerificationLoading: true,
      };
      case URL_VERIFY_API.FAILURE:
        return {
          ...state,
          isUrlVerificationLoading: false,
          isValidUrl: false,
        };
        case URL_VERIFY_API.SUCCESS:
          return {
            ...state,
            isUrlVerificationLoading: false,
            isValidUrl: true,
          };
    default:
      return state;
  }
}
