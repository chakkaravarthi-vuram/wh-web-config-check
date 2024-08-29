import { LANGAUGE_AND_CALENDAR_ADMIN } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  acc_language: null,
  acc_locale: [],
  primary_locale: null,
  acc_timezone: null,
  working_hour_start_time: null,
  working_hour_end_time: null,
  working_days: [],
  enable_button: false,
  error_list: [],
  server_error: [],
  common_server_error: EMPTY_STRING,
  is_data_loading: true,
  is_language_changed: false,
  language_settings: {},
};

export default function LanguageAndCalendarReducer(state = initialState, action) {
  switch (action.type) {
    case LANGAUGE_AND_CALENDAR_ADMIN.STARTED:
      return {
        ...state,
        is_data_loading: true,
      };
    case LANGAUGE_AND_CALENDAR_ADMIN.SUCCESS:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: null,
        enable_button: false,
        ...action.payload,
      };

    case LANGAUGE_AND_CALENDAR_ADMIN.FAILURE:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: action.payload.common_server_error,
        server_error: action.payload.common_server_error,
      };
    case LANGAUGE_AND_CALENDAR_ADMIN.CANCEL:
      return {
        ...state,
        is_data_loading: false,
      };
    case LANGAUGE_AND_CALENDAR_ADMIN.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };

    case LANGAUGE_AND_CALENDAR_ADMIN.CLEAR:
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
}
