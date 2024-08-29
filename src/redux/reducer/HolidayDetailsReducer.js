import { HOLIDAY_DETAILS } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  year: EMPTY_STRING,
  occasion: EMPTY_STRING,
  date: EMPTY_STRING,
  add_new_occasion: false,
  error_list: [],
  server_error: [],
  common_server_error: EMPTY_STRING,
  holiday_list: [],
};

export default function HolidayDetailsReducer(state = initialState, action) {
  switch (action.type) {
    case HOLIDAY_DETAILS.STARTED:
      return {
        ...state,
        is_data_loading: true,
      };
    case HOLIDAY_DETAILS.SUCCESS:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: null,
        holiday_list: action.payload,
      };

    case HOLIDAY_DETAILS.UPDATE:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: null,
        ...action.payload,
      };

    case HOLIDAY_DETAILS.FAILURE:
      return {
        ...state,
        is_data_loading: false,
        common_server_error: action.payload,
      };
    case HOLIDAY_DETAILS.CANCEL:
      return {
        ...state,
        is_data_loading: false,
      };
    case HOLIDAY_DETAILS.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };

    case HOLIDAY_DETAILS.CLEAR:
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
}
