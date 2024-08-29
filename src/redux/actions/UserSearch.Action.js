import { USER_SEARCH_ACTION } from './ActionConstants';

export const setUserSearchValue = (searchValue) => (dispatch) => {
  dispatch({
    type: USER_SEARCH_ACTION.SET_SEARCH_VALUE,
    payload: searchValue,
  });
};
