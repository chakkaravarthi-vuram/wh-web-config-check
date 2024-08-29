import { RESET_PASSWORD } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  loading: true,
  confirm_password: EMPTY_STRING,
  new_password: EMPTY_STRING,
  error_list: {},
  server_error: {},
  common_server_error: EMPTY_STRING,
  validLink: false,
};

export default function ResetPasswordReducer(state = initialState, action) {
  switch (action.type) {
    case RESET_PASSWORD.STARTED:
      return {
        ...state,
        loading: true,
        server_error: null,
        // common_server_error: EMPTY_STRING,
      };
    case RESET_PASSWORD.SUCCESS:
      return {
        ...state,
        loading: false,
        // server_error: null,
      };
    case RESET_PASSWORD.FAILURE:
      return {
        ...state,
        loading: false,
        server_error: action.payload.error,
        // common_server_error: errors.common_server_error
        //   ? errors.common_server_error
        //   : EMPTY_STRING,
      };
    case RESET_PASSWORD.CANCEL:
      return {
        ...state,
        loading: false,
      };
    case RESET_PASSWORD.SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
