import { LANGUAGE_LOOK_UP } from '../actions/ActionConstants';

const initialState = {
  languages_list: [],
  common_server_error: null,
};

export default function LanguageLookUpReducer(state = initialState, action) {
  switch (action.type) {
    case LANGUAGE_LOOK_UP.STARTED:
      return {
        ...state,
        isDataLoading: true,
      };
    case LANGUAGE_LOOK_UP.SUCCESS:
      return {
        ...state,
        isDataLoading: false,
        common_server_error: null,
        languages_list: action.payload,
      };

    case LANGUAGE_LOOK_UP.FAILURE:
      return {
        ...state,
        isDataLoading: false,
        common_server_error: action.payload,
      };
    case LANGUAGE_LOOK_UP.CANCEL:
      return {
        ...state,
        isDataLoading: false,
      };
    case LANGUAGE_LOOK_UP.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };

    case LANGUAGE_LOOK_UP.CLEAR:
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
}
