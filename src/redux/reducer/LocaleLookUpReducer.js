import { LOCALE_LOOK_UP } from '../actions/ActionConstants';

const initialState = {
  locale_list: [],
  common_server_error: null,
};

export default function LocaleLookUpReducer(state = initialState, action) {
  switch (action.type) {
    case LOCALE_LOOK_UP.STARTED:
      return {
        ...state,
        isDataLoading: true,
      };
    case LOCALE_LOOK_UP.SUCCESS:
      return {
        ...state,
        isDataLoading: false,
        common_server_error: null,
        locale_list: action.payload,
      };

    case LOCALE_LOOK_UP.FAILURE:
      return {
        ...state,
        isDataLoading: false,
        common_server_error: action.payload,
      };
    case LOCALE_LOOK_UP.CANCEL:
      return {
        ...state,
        isDataLoading: false,
      };
    case LOCALE_LOOK_UP.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };

    case LOCALE_LOOK_UP.CLEAR:
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
}
