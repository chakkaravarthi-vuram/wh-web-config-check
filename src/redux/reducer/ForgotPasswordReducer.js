import { FORGOT_PASSWORD_API } from '../actions/ActionConstants';

const { EMPTY_STRING } = require('../../utils/strings/CommonStrings');

const initialState = {
  email: EMPTY_STRING,
  error_list: [],
  server_error: [],
  common_server_error: null,
  loading: false,
  // page: 1,
};

export default function ForgotPasswordReducer(state = initialState, action) {
  switch (action.type) {
    case FORGOT_PASSWORD_API.STARTED:
      return {
        ...state,
        server_error: [],
        common_server_error: EMPTY_STRING,
        loading: true,
      };
    case FORGOT_PASSWORD_API.SUCCESS:
      return {
        ...state,
        error_list: [],
        server_error: [],
        loading: false,
        // page: 2,
      };
    case FORGOT_PASSWORD_API.FAILURE:
      return {
        ...state,
        ...action.payload.error,
        loading: false,
      };
    case FORGOT_PASSWORD_API.CANCEL:
      return {
        ...state,
        loading: false,
      };
    case FORGOT_PASSWORD_API.SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    case FORGOT_PASSWORD_API.CLEAR:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
