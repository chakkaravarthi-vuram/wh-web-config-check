import { USER_PROFILE } from '../actions/ActionConstants';
import { EMPTY_STRING } from '../../utils/strings/CommonStrings';

const initialState = {
  mobile_number_country_code: EMPTY_STRING,
  mobile_number_country: EMPTY_STRING,
  mobile_number: EMPTY_STRING,
  profile_pic: null,
  datalist_info: null,
  isProfileDetailsLoading: true,
  profileDetails: {},
  enable_button: false,
  error_list: [],
  server_error: [],
  common_server_error: EMPTY_STRING,
};

export default function UserProfileReducer(state = initialState, action) {
  switch (action.type) {
    case USER_PROFILE.STARTED:
      return {
        ...state,
        isDataLoading: true,
      };
    case USER_PROFILE.SUCCESS:
      return {
        ...state,
        isDataLoading: false,
        // error: null,
        // generateOtp: action.payload,
      };
    case USER_PROFILE.FAILURE:
      return {
        ...state,
        isDataLoading: false,
        // error: action.payload.error,
      };
    case USER_PROFILE.CANCEL:
      return {
        ...state,
        isDataLoading: false,
      };
    case USER_PROFILE.SET_STATE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
