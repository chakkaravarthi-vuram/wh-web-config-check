import { TIME_ZONE_LOOK_UP } from '../actions/ActionConstants';

const initialState = {
  timezone_list: [],
  common_server_error: null,
};

export default function TimeZoneLookUpReducer(state = initialState, action) {
  switch (action.type) {
    case TIME_ZONE_LOOK_UP.STARTED:
      return {
        ...state,
        isDataLoading: true,
      };
    case TIME_ZONE_LOOK_UP.SUCCESS:
      return {
        ...state,
        isDataLoading: false,
        common_server_error: null,
        timezone_list: action.payload,
      };

    case TIME_ZONE_LOOK_UP.FAILURE:
      return {
        ...state,
        isDataLoading: false,
        common_server_error: action.payload,
      };
    case TIME_ZONE_LOOK_UP.CANCEL:
      return {
        ...state,
        isDataLoading: false,
      };
    case TIME_ZONE_LOOK_UP.DATA_CHANGE:
      return {
        ...state,
        ...action.payload,
      };

    case TIME_ZONE_LOOK_UP.CLEAR:
      return {
        ...state,
        ...initialState,
      };

    default:
      return state;
  }
}
