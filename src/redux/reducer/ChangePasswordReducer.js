import { CHANGE_PASSWORD } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  current_password: EMPTY_STRING,
  new_password: EMPTY_STRING,
  error_list: [],
  server_error: [],
  common_server_error: EMPTY_STRING,
};

export default function ChatReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PASSWORD.CLEAR:
      return {
        ...initialState,
      };
    case CHANGE_PASSWORD.SET_STATE:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
