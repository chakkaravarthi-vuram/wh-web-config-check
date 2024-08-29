import { USER_PREFERENCE } from '../actions/ActionConstants';

const initialState = {
  languages_list: [],
  locale_list: [],
  timezone_list: [],
  pref_language: null,
  pref_locale: null,
  pref_timezone: null,
  enable_button: false,
  error_list: [],
  is_language_changed: true,
};

export default function UserPreferenceReducer(state = initialState, action) {
  switch (action.type) {
    case USER_PREFERENCE.STARTED:
      return {
        ...state,
        isDataLoading: true,
      };
    case USER_PREFERENCE.SUCCESS:
      return {
        ...state,
        isDataLoading: false,
        common_server_error: null,
        enable_button: false,
        ...action.payload,
      };

    case USER_PREFERENCE.FAILURE:
      return {
        ...state,
        isDataLoading: false,
        common_server_error: action.payload,
      };
    case USER_PREFERENCE.CANCEL:
      return {
        ...state,
        isDataLoading: false,
      };
    case USER_PREFERENCE.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };

    case USER_PREFERENCE.CLEAR:
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
}
