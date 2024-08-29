import { SIGN_UP_ADDITIONAL_DETAILS } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  account_name: EMPTY_STRING,
  account_domain: EMPTY_STRING,
  password: EMPTY_STRING,
  first_name: EMPTY_STRING,
  last_name: EMPTY_STRING,
  username: EMPTY_STRING,
  role_in_company: EMPTY_STRING,
  error_list: [],
  server_error: [],
  is_data_loading: false,
  urlEditable: false,
};

export default function SignUpAdditionalDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case SIGN_UP_ADDITIONAL_DETAILS.STARTED:
      return {
        ...state,
        is_data_loading: true,
      };
    case SIGN_UP_ADDITIONAL_DETAILS.SUCCESS:
      return {
        ...state,
        is_data_loading: true,
      };
    // case SIGN_UP_ADDITIONAL_DETAILS.FAILURE:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: action.payload.error,
    //   };
    case SIGN_UP_ADDITIONAL_DETAILS.CANCEL:
      return {
        ...state,
        is_data_loading: false,
      };
    case SIGN_UP_ADDITIONAL_DETAILS.SET_STATE:
      return { ...state, ...action.payload };
    case SIGN_UP_ADDITIONAL_DETAILS.CLEAR:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
