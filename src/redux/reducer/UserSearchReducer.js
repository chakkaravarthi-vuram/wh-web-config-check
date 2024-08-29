import { USER_SEARCH_ACTION } from '../actions/ActionConstants';

const initialState = {
  user_search_value: '',
};

export default function UserSearchReducer(state = initialState, action) {
  switch (action.type) {
    case USER_SEARCH_ACTION.SET_SEARCH_VALUE:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}
