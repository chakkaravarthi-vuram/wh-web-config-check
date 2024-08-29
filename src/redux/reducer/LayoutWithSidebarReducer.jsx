import { LAYOUT_WITH_SIDEBAR } from '../actions/ActionConstants';

const initialState = {
  isUserProfileDropdownVisible: false,
  signOut: false,
};

export default function LayoutWithSidebarReducer(state = initialState, action) {
  switch (action.type) {
    case LAYOUT_WITH_SIDEBAR.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };
    case LAYOUT_WITH_SIDEBAR.CLEAR:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
